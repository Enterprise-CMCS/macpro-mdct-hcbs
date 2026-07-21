import { ReportType } from "../../../types/reports";
import KafkaSourceLib from "../../../utils/kafka/kafka-source-lib";

const _tableTopics: { [key in ReportType]: string } = {
  QMS: "qms-reports",
  TACM: "tacm-reports",
  CI: "ci-reports",
  PCP: "pcp-reports",
  QIP: "qip-reports",
  WWL: "wwl-reports",
};

const topicPrefix = "aws.mdct.hcbs";
const version = "v0";
const tables: { sourceName: string; topicName: string }[] = [
  // TODO: When HCBS starts sending data to Kafa,
  // determine the appropriate topic based on the individual item
  // (not on which table it's in, since all reports share a table).
  // Additionally, write code to reassemble the report pages
  // before sending the report on.
  // Alternatively, establish with our integration partners
  // that HCBS topics are Different from other MDCT apps,
  // and that the item shape is Different as well.
];

const postKafkaData = new KafkaSourceLib(topicPrefix, version, tables);

exports.handler = postKafkaData.handler.bind(postKafkaData);
