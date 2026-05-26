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
 * This migration will rename various report components for clarity.
 *
 * Since component names get baked into reports,
 * (or at least their `type` fields do, which correspond to their names),
 * and since we don't want this rename to break all existing reports,
 * this is not a mere code change; we need to modify existing report data.
 *
 * The components being renamed are some of our multi-input components:
 *
 * | Before          | After            | What is it                          |
 * |-----------------|------------------|-------------------------------------|
 * | NDR             | [no rename]      | A Numerator, Denominator, and Rate  |
 * | NDRBasic        | PerformanceNdr   | NDR + a performance target          |
 * | NDREnhanced     | MultiRateNdr     | One D, with many NR pairs           |
 * | NDRFields       | MultiCategoryNdr | Many Ds, each with many NR pairs    |
 * | LengthOfStay    | [no rename]      | Actual vs Expected counts and rates |
 * | ReadmissionRate | [no rename]      | Observed vs Expected readmissions   |
 *
 * NDRFieldsTemplate.fields is also renamed, to MultiCategoryNdr.categories.
 */

const client = createClient();
const logPrefix = () => new Date().toISOString() + " | ";

async function main() {
  console.info(`${logPrefix()}Updating reports...`);
  let updatedCount = 0;

  try {
    for await (const batch of createBatches(reportsToUpdate())) {
      await sendBatch(batch);
      updatedCount += Object.values(batch.RequestItems).flat().length;
    }

    console.info(`${logPrefix()}Success. Updated ${updatedCount} reports.`);
  } catch (error) {
    console.error(error);
    console.info(`${logPrefix()}Updated at least ${updatedCount} reports.`);
  }
}

/** Find all reports of all types, and collect the ones that need updating */
async function* reportsToUpdate() {
  const reportTypes = ["qms", "tacm", "ci", "pcp", "wwl"];
  for (const reportType of reportTypes) {
    const tableName = `${process.env.STAGE}-${reportType}-reports`;
    for await (const report of scanReports(tableName)) {
      const needsUpdate = updateComponentNames(report);
      if (needsUpdate) {
        yield { tableName, Item: report };
      }
    }
  }
}

/** Find all reports in a given Dynamo table */
async function* scanReports(TableName: string) {
  console.info(`${logPrefix()}Scanning table ${TableName}...`);
  let pageNumber = 0;
  for await (const page of paginateScan({ client }, { TableName })) {
    pageNumber += 1;
    console.debug(`${logPrefix()}${TableName} page ${pageNumber}...`);
    yield* (page.Items ?? []) as Report[];
  }
}

/**
 * Modify a report's component names in-place.
 * @returns `true` if a change was made, `false` otherwise.
 */
function updateComponentNames(report: Report) {
  const NEW_NAMES: Record<string, string> = {
    ndrBasic: "performanceNdr",
    ndrEnhanced: "multiRateNdr",
    ndrFields: "multiCategoryNdr",
  };

  let isChanged = false;

  for (const page of report.pages ?? []) {
    for (const element of iterateElements(page.elements)) {
      if (element.type in NEW_NAMES) {
        element.type = NEW_NAMES[element.type];
        if (element.type === "multiCategoryNdr") {
          element.categories = element.fields;
          delete element.fields;
        }
        isChanged = true;
      }
    }
  }

  return isChanged;
}

/**
 * Find all PageElements in the given array.
 * Recurse into checkedChildren as needed.
 */
function* iterateElements(elements: PageElement[] | undefined) {
  for (const element of elements ?? []) {
    yield element;
    for (const choice of element.choices ?? []) {
      iterateElements(choice.checkedChildren);
    }
  }
}

/**
 * Collect reports that need to be updated into batches of <= 25 items.
 *
 * Note: this can handle reports of different types,
 * because a BatchWriteCommand can touch multiple tables.
 */
async function* createBatches(
  iterator: AsyncGenerator<{ tableName: string; Item: Report }>
) {
  /**
   * Dynamo BatchWriteCommand allows up to 25 items, but also has a size cap.
   * Limiting each batch to 5 items should be safe.
   */
  const MAX_BATCH_SIZE = 5;
  let batchNumber = 0;
  let currentBatchSize = 0;
  let RequestItems: Record<string, { PutRequest: { Item: any } }[]> = {};

  for await (const { tableName, Item } of iterator) {
    RequestItems[tableName] ??= [];
    RequestItems[tableName].push({ PutRequest: { Item } });
    currentBatchSize += 1;

    if (currentBatchSize >= MAX_BATCH_SIZE) {
      batchNumber += 1;
      console.debug(`Saving batch ${batchNumber}...`);

      yield { RequestItems };

      currentBatchSize = 0;
      RequestItems = {};
    }
  }

  if (currentBatchSize > 0) {
    yield { RequestItems };
  }
}

/** Send a BatchWriteCommand containing the given reports. */
async function sendBatch(params: BatchWriteCommandInput) {
  // console.trace(JSON.stringify(params, null, 2));

  const command = new BatchWriteCommand(params);
  const response = await client.send(command);

  const unprocessedIds = Object.entries(response.UnprocessedItems ?? {}).map(
    ([table, reqs]) => reqs.map((req) => `${table}:${req.PutRequest!.Item!.id}`)
  );
  if (unprocessedIds.length > 0) {
    const message = `Batch write failed! The following reports were not updated: ${unprocessedIds.join(", ")}`;
    throw new Error(message);
  }
}

/** An HCBS report. Imitates the real type used in the app. */
type Report = {
  id: string;
  pages: {
    elements?: PageElement[];
  }[];
};

/** An element on a report page. Imitates the real type used in the app. */
type PageElement = {
  type: string;
  fields?: unknown;
  categories?: unknown;
  choices?: {
    checkedChildren?: PageElement[];
  }[];
};

main();
