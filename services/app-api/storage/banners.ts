import {
  DeleteCommand,
  GetCommand,
  paginateScan,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { createClient } from "./dynamo/dynamodb-lib";
import { BannerShape } from "../types/banner";

const bannerTableName = process.env.BannersTable;
const client = createClient();

export const putBanner = async (banner: BannerShape) => {
  await client.send(
    new PutCommand({
      TableName: bannerTableName,
      Item: banner,
    })
  );
};

export const getBanner = async (bannerKey: string) => {
  const response = await client.send(
    new GetCommand({
      TableName: bannerTableName,
      Key: { key: bannerKey },
    })
  );
  return response.Item as BannerShape | undefined;
};

export const scanAllBanners = async () => {
  const pages = paginateScan({ client }, { TableName: bannerTableName });
  let items: Record<string, any>[] = [];
  for await (const page of pages) {
    items = items.concat(page.Items ?? []);
  }
  return items as BannerShape[];
};

export const deleteBanner = async (bannerKey: string) => {
  await client.send(
    new DeleteCommand({
      TableName: bannerTableName,
      Key: { key: bannerKey },
    })
  );
};
