import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  Paginator,
  QueryCommandOutput,
  ScanCommandOutput,
} from "@aws-sdk/lib-dynamodb";

const config = {
  region: "us-east-1",
  logger: {
    // DynamoDB is quite chatty. We'll ignore most of that for our scripts.
    trace: () => {},
    debug: () => {},
    info: () => {},
    warn: console.warn,
    error: console.error,
  },
};

export const createClient = () => {
  return DynamoDBDocumentClient.from(new DynamoDBClient(config));
};

/** Given a paginator, eagerly collect all of its items in an array */
export const collectPageItems = async <
  T extends QueryCommandOutput | ScanCommandOutput,
>(
  paginator: Paginator<T>
) => {
  let items: Record<string, any>[] = [];
  for await (let page of paginator) {
    items = items.concat(page.Items ?? []);
  }
  return items;
};

/** Given a paginator, lazily visit all of its items */
export async function* iteratePageItems<
  T extends QueryCommandOutput | ScanCommandOutput,
>(paginator: Paginator<T>) {
  for await (let page of paginator) {
    yield* page.Items ?? [];
  }
}
