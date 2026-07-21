import { Construct } from "constructs";
import { aws_dynamodb as dynamodb } from "aws-cdk-lib";
import { DynamoDBTable } from "../constructs/dynamodb-table.ts";

interface CreateDataComponentsProps {
  scope: Construct;
  stage: string;
  isDev: boolean;
}

export function createDataComponents(props: CreateDataComponentsProps) {
  const { scope, stage, isDev } = props;

  const tables = [
    new DynamoDBTable(scope, "Banners", {
      stage,
      isDev,
      name: "banners",
      partitionKey: {
        name: "key",
        type: dynamodb.AttributeType.STRING,
      },
    }),
    new DynamoDBTable(scope, "Reports", {
      stage,
      isDev,
      name: "reports",
      partitionKey: {
        name: "pKey",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "sortKey",
        type: dynamodb.AttributeType.STRING,
      },
    }),
    new DynamoDBTable(scope, "Notifications", {
      stage,
      isDev,
      name: "notifications",
      partitionKey: {
        name: "category",
        type: dynamodb.AttributeType.STRING,
      },
    }),
  ];

  return { tables };
}
