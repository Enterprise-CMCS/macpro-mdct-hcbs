import { reportTables, tableTopics } from "../../../utils/constants";
import KafkaSourceLib from "../../../utils/kafka/kafka-source-lib";

const topicPrefix = "aws.mdct.hcbs";
const version = "v0";
const tables = [{ sourceName: reportTables.QMS, topicName: tableTopics.QMS }];

const postKafkaData = new KafkaSourceLib(topicPrefix, version, tables);

exports.handler = postKafkaData.handler.bind(postKafkaData);
