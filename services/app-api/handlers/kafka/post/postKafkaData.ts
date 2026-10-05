import { ReportType, isReportType } from "../../../types/reports";
import { GetDynamoInfo, GetKafkaConfig, kafkaHandler } from "../kafkaLib";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { getReport } from "../../../storage/reports";
import { isStateAbbreviation } from "../../../utils/constants";

const getConfig: GetKafkaConfig = () => {
  const { brokerString, STAGE } = process.env;

  if (!brokerString) {
    throw new Error("Missing Kafka config: brokerString required");
  }
  if (!process.env.ReportsTable) {
    throw new Error("Missing Kafka config: ReportsTable required");
  }
  if (brokerString === "localstack") {
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

  if (!source.includes(`/${reportsTable}/`)) {
    return undefined;
  }

  const payload = unmarshall(record.dynamodb.NewImage);
  if (
    !isReportType(payload.type) ||
    !isStateAbbreviation(payload.state) ||
    typeof payload.id !== "string" ||
    typeof payload.sortKey !== "string"
  ) {
    return undefined;
  }

  // Skip page records; the report record publishes the full report.
  if (payload.sortKey.includes("#")) {
    return undefined;
  }

  const report = (await getReport(payload.type, payload.state, payload.id))!;

  const reportTopics: { [key in ReportType]: string } = {
    QMS: "qms-reports",
    HA: "ha-reports",
    CI: "ci-reports",
    IMA: "ima-reports",
    PCP: "pcp-reports",
    QIP: "qip-reports",
    WWL: "wwl-reports",
  };

  return {
    topic: `${namespace}aws.mdct.hcbs.${reportTopics[payload.type]}.v0`,
    payload: report,
  };
};

export const handler = kafkaHandler({
  getConfig,
  getDynamoInfo,
});
