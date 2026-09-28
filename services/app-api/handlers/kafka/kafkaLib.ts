import type { AttributeValue } from "@aws-sdk/client-dynamodb";
import {
  Kafka,
  type KafkaConfig,
  type Message,
  type Producer,
  type ProducerBatch,
} from "kafkajs";

type AwsStreamRecord = {
  eventID: string;
  eventName: string;
  eventSourceARN: string;
  dynamodb?: {
    NewImage?: Record<string, AttributeValue>;
  };
};

export type DynamoRecord = {
  eventID: string;
  eventName: string;
  eventSourceARN: string;
  dynamodb: {
    NewImage: Record<string, AttributeValue>;
  };
};

type AwsStreamEvent = {
  Records?: AwsStreamRecord[];
};

export type GetKafkaConfig = () => KafkaConfig | undefined;

export type GetDynamoInfo = (record: DynamoRecord) => Promise<
  | {
      topic: string;
      payload: any;
    }
  | undefined
>;

export type KafkaCallbacks = {
  getConfig: GetKafkaConfig;
  getDynamoInfo: GetDynamoInfo;
};

export const kafkaHandler = (callbacks: KafkaCallbacks) => {
  return async (event: AwsStreamEvent) => {
    const config = callbacks.getConfig();
    if (config === undefined) {
      return;
    }

    const messages: { topic: string; message: Message }[] = [];
    for (const record of event.Records ?? []) {
      const message = await convertToMessage(record, callbacks);
      if (message) {
        messages.push(message);
      }
    }

    const topics = [...new Set(messages.map((message) => message.topic))];
    const topicMessages = topics.map((topic) => ({
      topic,
      messages: messages
        .filter((message) => message.topic === topic)
        .map((message) => message.message),
    }));

    if (topicMessages.length === 0) {
      console.warn("Ignoring event: no messages to send.");
      return;
    }

    await LazyProducer.sendBatch(config, { topicMessages });
    console.info("Processing complete.");
  };
};

const convertToMessage = async (
  record: AwsStreamRecord,
  { getDynamoInfo }: KafkaCallbacks
) => {
  if (record.eventName === "REMOVE" || !record.dynamodb?.NewImage) {
    return undefined;
  }

  const dynamoInfo = await getDynamoInfo({
    eventID: record.eventID,
    eventName: record.eventName,
    eventSourceARN: record.eventSourceARN,
    dynamodb: {
      NewImage: record.dynamodb.NewImage,
    },
  });
  if (!dynamoInfo) {
    return undefined;
  }

  const { topic, payload } = dynamoInfo;
  return {
    topic,
    message: {
      headers: {
        eventID: record.eventID,
        eventName: record.eventName,
      },
      partition: 0,
      key: `${payload.type}#${payload.state}#${payload.id}`,
      value: JSON.stringify(payload),
    },
  };
};

const LazyProducer = (() => {
  let producer: Producer | undefined;
  let connected = false;

  const connect = async (config: KafkaConfig) => {
    const kafka = new Kafka(config);
    await producer?.disconnect();
    producer = kafka.producer();
    await producer.connect();
    connected = true;
  };

  return {
    sendBatch: async (config: KafkaConfig, batch: ProducerBatch) => {
      if (!connected) {
        await connect(config);
      }

      await producer!.sendBatch(batch);
    },
  };
})();
