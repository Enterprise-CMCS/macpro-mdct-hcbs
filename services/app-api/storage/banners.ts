import { DeleteCommand, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { createClient } from "./dynamo/dynamodb-lib";
import { BannerData } from "../types/banner";

const bannerTableName = process.env.BannersTable;
const client = createClient();

export const putBanner = async (banner: BannerData) => {
  await client.send(
    new PutCommand({
      TableName: bannerTableName,
      Item: banner,
    })
  );
};

export const getBanner = async (bannerId: string) => {
  const response = await client.send(
    new GetCommand({
      TableName: bannerTableName,
      Key: {
        key: bannerId,
      },
    })
  );
  return response.Item as BannerData | undefined;
};

export const deleteBanner = async (bannerId: string) => {
  await client.send(
    new DeleteCommand({
      TableName: bannerTableName,
      Key: {
        key: bannerId,
      },
    })
  );
};
