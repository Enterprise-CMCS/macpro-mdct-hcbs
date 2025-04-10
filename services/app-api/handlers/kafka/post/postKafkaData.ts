import {
  bucketTopics,
  reportBuckets,
  reportTables,
  tableTopics,
} from "../../../utils/constants";
import KafkaSourceLib from "../../../utils/kafka/kafka-source-lib";

const topicPrefix = "aws.mdct.hcbs";
const version = "v0";
const tables = [{ sourceName: reportTables.QMS, topicName: tableTopics.QMS }];
const buckets = [
  { sourceName: reportBuckets.QMS, topicName: bucketTopics.QMS },
];

const postKafkaData = new KafkaSourceLib(topicPrefix, version, tables, buckets);

exports.handler = postKafkaData.handler.bind(postKafkaData);
