import { createClient } from "./utils.ts";
import {
  paginateScan,
  BatchWriteCommand,
  BatchWriteCommandInput,
} from "@aws-sdk/lib-dynamodb";

/*
 * ENVIRONMENT VARIABLES TO SET:
 * STAGE: "main", "val", or "production" as appropriate.
 * AWS auth variables as usual.
 */

/*
 * This migration updates persisted component names in existing QMS reports.
 *
 * Since component names get baked into reports,
 * and since we changed the serialized value for QmsMeasureTable,
 * this is not a mere code change; we need to modify existing report data.
 */

const client = createClient();
const logPrefix = () => new Date().toISOString() + " | ";
/** The table in which all Reports and Pages are stored */
const TableName = `${process.env.STAGE}-reports`;

async function main() {
  console.info(`${logPrefix()}Updating reports...`);
  let updatedCount = 0;

  try {
    for await (const batch of createBatches(reportItemsToUpdate())) {
      await sendBatch(batch);
      updatedCount += Object.values(batch.RequestItems).flat().length;
    }

    console.info(`${logPrefix()}Success. Updated ${updatedCount} reports.`);
  } catch (error) {
    console.error(error);
    console.info(`${logPrefix()}Updated at least ${updatedCount} reports.`);
  }
}

/** Find all QMS reports, and collect the ones that need updating */
async function* reportItemsToUpdate() {
  for await (const item of scanReportTableItems()) {
    if (!isQmsPage(item)) continue;

    const needsUpdate = updateComponentNames(item);
    if (needsUpdate) {
      yield item;
    }
  }
}

/** Find all reports in a given Dynamo table */
async function* scanReportTableItems() {
  console.info(`${logPrefix()}Scanning table ${TableName}...`);
  let pageNumber = 0;
  for await (const page of paginateScan({ client }, { TableName })) {
    pageNumber += 1;
    console.debug(`${logPrefix()}${TableName} page ${pageNumber}...`);
    yield* (page.Items ?? []) as ReportTableItem[];
  }
}

function isQmsPage(item: ReportTableItem) {
  return item.pKey?.startsWith("QMS#") && item.sortKey?.includes("#");
}

/**
 * Modify a report's component names in-place.
 * @returns `true` if a change was made, `false` otherwise.
 */
function updateComponentNames(item: ReportTableItem) {
  let isChanged = false;

  // Current split-table shape where page items carry elements.
  for (const element of iterateElements(item.elements)) {
    if (element.type === "measureTable") {
      element.type = "qmsMeasureTable";
      isChanged = true;
    }
  }

  return isChanged;
}

/**
 * Find all PageElements in the given array.
 * Recurse into checkedChildren as needed.
 */
function* iterateElements(
  elements: PageElement[] | undefined
): Generator<PageElement> {
  for (const element of elements ?? []) {
    yield element;
    for (const choice of element.choices ?? []) {
      yield* iterateElements(choice.checkedChildren);
    }
  }
}

/**
 * Collect reports that need to be updated into batches of <= 25 items.
 *
 * Note: this can handle reports of different types,
 * because a BatchWriteCommand can touch multiple tables.
 */
async function* createBatches(iterator: AsyncGenerator<ReportTableItem>) {
  /**
   * Dynamo BatchWriteCommand allows up to 25 items, but also has a size cap.
   * Limiting each batch to 5 items should be safe.
   */
  const MAX_BATCH_SIZE = 5;
  let batchNumber = 0;
  let currentBatchSize = 0;
  let RequestItems: Record<string, { PutRequest: { Item: any } }[]> = {
    [TableName]: [],
  };

  for await (const Item of iterator) {
    RequestItems[TableName].push({ PutRequest: { Item } });
    currentBatchSize += 1;

    if (currentBatchSize >= MAX_BATCH_SIZE) {
      batchNumber += 1;
      console.debug(`Saving batch ${batchNumber}...`);

      yield { RequestItems };

      currentBatchSize = 0;
      RequestItems = { [TableName]: [] };
    }
  }

  if (currentBatchSize > 0) {
    yield { RequestItems };
  }
}

/** Send a BatchWriteCommand containing the given reports. */
async function sendBatch(params: BatchWriteCommandInput) {
  const command = new BatchWriteCommand(params);
  const response = await client.send(command);

  const unprocessedIds = Object.entries(
    response.UnprocessedItems ?? {}
  ).flatMap(([table, reqs]) =>
    reqs.map(
      (req) =>
        `${table}:${req.PutRequest!.Item!.pKey}#${req.PutRequest!.Item!.sortKey}`
    )
  );
  if (unprocessedIds.length > 0) {
    const message = `Batch write failed! The following reports were not updated: ${unprocessedIds.join(", ")}`;
    throw new Error(message);
  }
}

type ReportTableItem = {
  id: string;
  pKey?: string;
  sortKey?: string;
  elements?: PageElement[];
};

/** An element on a report page. Imitates the real type used in the app. */
type PageElement = {
  type: string;
  choices?: {
    checkedChildren?: PageElement[];
  }[];
};

main();
