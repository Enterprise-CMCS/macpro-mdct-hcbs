import { ReportType, isReportType } from "../../../types/reports";
import { GetDynamoInfo, GetKafkaConfig, kafkaHandler } from "../kafkaLib";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { getReport } from "../../../storage/reports";

const version = "v0";
const topicPrefix = "aws.mdct.hcbs";
const reportTopics: { [key in ReportType]: string } = {
  QMS: "qms-reports",
  HA: "ha-reports",
  CI: "ci-reports",
  IMA: "ima-reports",
  PCP: "pcp-reports",
  QIP: "qip-reports",
  WWL: "wwl-reports",
};

const getConfig: GetKafkaConfig = () => {
  const { brokerString, STAGE } = process.env;

  if (!brokerString) {
    throw new Error("Missing Kafka config: brokerString required");
  } else if (brokerString === "localstack") {
    console.debug("Ignoring event: Localstack should not talk to Kafka");
    return undefined;
  }

  if (!STAGE) {
    throw new Error("Missing Kafka config: STAGE required");
  }

  return {
    clientId: `hcbs-${STAGE}`,
    brokers: brokerString.split(","),
    retry: { initialRetryTime: 300, retries: 8 },
    ssl: { rejectUnauthorized: false },
  };
};

const getDynamoInfo: GetDynamoInfo = async (record) => {
  const source = record.eventSourceARN;
  const namespace = process.env.topicNamespace ?? "";
  const reportsTable = process.env.ReportsTable;

  if (reportsTable && !source.includes(`/${reportsTable}/`)) {
    return undefined;
  }

  const payload = unmarshall(record.dynamodb.NewImage);
  if (
    !isReportType(payload.type) ||
    typeof payload.state !== "string" ||
    typeof payload.id !== "string" ||
    typeof payload.sortKey !== "string"
  ) {
    return undefined;
  }

  if (payload.sortKey.includes("#")) {
    return undefined;
  }

  const report = await getReport(
    payload.type,
    payload.state as Parameters<typeof getReport>[1],
    payload.id
  );
  if (!report) {
    throw new Error(
      `Could not reassemble report ${payload.type}/${payload.state}/${payload.id}`
    );
  }

  return {
    topic: `${namespace}${topicPrefix}.${reportTopics[payload.type]}.${version}`,
    payload: report,
  };
};

export const handler = kafkaHandler({
  getConfig,
  getDynamoInfo,
});
