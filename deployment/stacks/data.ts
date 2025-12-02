import { Construct } from "constructs";
import { aws_dynamodb as dynamodb } from "aws-cdk-lib";
import { DynamoDBTable } from "../constructs/dynamodb-table";

interface CreateDataComponentsProps {
  project: string;
  scope: Construct;
  stage: string;
  isDev: boolean;
}

export function createDataComponents(props: CreateDataComponentsProps) {
  const { scope, stage, isDev, project } = props;

  const tables = [
    new DynamoDBTable(scope, "Banners", {
      project,
      stage,
      isDev,
      name: "banners",
      streamable: false,
      partitionKey: { name: "key", type: dynamodb.AttributeType.STRING },
    }),
    new DynamoDBTable(scope, "XyzReports", {
      project,
      stage,
      isDev,
      name: "xyz-reports",
      partitionKey: { name: "state", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "id", type: dynamodb.AttributeType.STRING },
    }),
  ];

  return { tables };
}
