import { Construct } from "constructs";
import { aws_dynamodb as dynamodb } from "aws-cdk-lib";
import { DynamoDBTable } from "../../constructs/dynamodb-table";

interface CreateDataComponentsProps {
  scope: Construct;
  stage: string;
  isDev: boolean;
}

export function createDataComponents(props: CreateDataComponentsProps) {
  const { scope, stage, isDev } = props;

  new DynamoDBTable(scope, "Banners", {
    stage,
    isDev,
    name: "banners",
    partitionKey: {
      name: "key",
      type: dynamodb.AttributeType.STRING,
    },
  });
  new DynamoDBTable(scope, "QmsReports", {
    stage,
    isDev,
    name: "qms-reports",
    partitionKey: {
      name: "state",
      type: dynamodb.AttributeType.STRING,
    },
    sortKey: {
      name: "id",
      type: dynamodb.AttributeType.STRING,
    },
  });
}
