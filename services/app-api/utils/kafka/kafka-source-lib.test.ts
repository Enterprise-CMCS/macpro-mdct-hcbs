import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import KafkaSourceLib from "./kafka-source-lib";

const { mockConnect, mockSendBatch, mockDisconnect, mockOn } = vi.hoisted(
  () => ({
    mockConnect: vi.fn(),
    mockSendBatch: vi.fn(),
    mockDisconnect: vi.fn(),
    mockOn: vi.fn(),
  })
);
vi.mock("kafkajs", () => ({
  Kafka: vi.fn(
    class {
      producer = vi.fn().mockReturnValue({
        disconnect: mockDisconnect,
        connect: mockConnect,
        sendBatch: mockSendBatch,
        on: mockOn,
      });
    }
  ),
}));

const stage = "testing";
const namespace = "--hcbs--test-stage--";
const table = { sourceName: `${stage}-aTable`, topicName: "aTable-reports" };
const brokerString = "brokerA,brokerB,brokerC";
const dynamoEvent = {
  Records: [
    {
      eventID: "2",
      eventName: "MODIFY",
      eventVersion: "1.0",
      eventSource: "aws:dynamodb",
      awsRegion: "us-east-1",
      dynamodb: {
        Keys: {
          Id: {
            N: "101",
          },
        },
        NewImage: {
          Message: {
            S: "This item has changed",
          },
          Id: {
            N: "101",
          },
        },
        OldImage: {
          Message: {
            S: "New item!",
          },
          Id: {
            N: "101",
          },
        },
        SequenceNumber: "222",
        SizeBytes: 59,
        StreamViewType: "NEW_AND_OLD_IMAGES",
      },
      eventSourceARN: `somePrefix/${table.sourceName}/someSuffix`,
    },
  ],
};

let consoleSpy = {
  log: vi.fn(),
};

describe("Kafka Lib", () => {
  let tempNamespace: string | undefined;
  let tempBrokers: string | undefined;

  beforeAll(() => {
    tempNamespace = process.env.topicNamespace;
    tempBrokers = process.env.brokerString;

    process.env.topicNamespace = namespace;
    process.env.brokerString = brokerString;
  });

  afterAll(() => {
    process.env.topicNamespace = tempNamespace;
    process.env.brokerString = tempBrokers;
  });

  beforeEach(() => {
    vi.clearAllMocks();
    consoleSpy.log = vi.spyOn(console, "log").mockImplementation(vi.fn());
  });

  it("should handles a dynamo event", async () => {
    const sourceLib = new KafkaSourceLib("hcbs", "v0", [table]);
    await sourceLib.handler(dynamoEvent);
    expect(consoleSpy.log).toHaveBeenCalled();
    expect(mockSendBatch).toBeCalledTimes(1);
  });

  it("should handle events without versions", async () => {
    const sourceLib = new KafkaSourceLib("hcbs", null, [table]);
    await sourceLib.handler(dynamoEvent);
    expect(consoleSpy.log).toHaveBeenCalled();
    expect(mockSendBatch).toBeCalledTimes(1);
  });

  it("should not pass through events from unrelated tables", async () => {
    const sourceLib = new KafkaSourceLib("hcbs", "v0", [
      { sourceName: "unrelated-table", topicName: "unrelated-topic" },
    ]);
    await sourceLib.handler(dynamoEvent);
    expect(consoleSpy.log).toHaveBeenCalled();
    expect(mockSendBatch).toBeCalledTimes(0);
  });

  it("should ignore items with bad keys or missing events", async () => {
    const sourceLib = new KafkaSourceLib("hcbs", "v0", [table]);
    await sourceLib.handler({});
    expect(consoleSpy.log).toHaveBeenCalled();
    expect(mockSendBatch).toBeCalledTimes(0);
  });

  it("should handle dynamo events with no OldImage", async () => {
    const dynamoInsertEvent = {
      Records: [
        {
          eventSourceARN: `/${table.sourceName}/`,
          eventID: "test-event-id",
          eventName: "INSERT",
          dynamodb: {
            Keys: { foo: { S: "bar" } },
            NewImage: { foo: { S: "bar" } },
            StreamViewType: "NEW_AND_OLD_IMAGES",
          },
        },
      ],
    };
    const sourceLib = new KafkaSourceLib("hcbs", "v0", [table]);
    await sourceLib.handler(dynamoInsertEvent);
    expect(consoleSpy.log).toHaveBeenCalled();
    expect(mockSendBatch).toBeCalledWith({
      topicMessages: [
        {
          messages: [
            expect.objectContaining({
              headers: {
                eventID: "test-event-id",
                eventName: "INSERT",
              },
              key: "bar",
              value: `{"NewImage":{"foo":"bar"},"OldImage":{},"Keys":{"foo":"bar"}}`,
            }),
          ],
          topic: "--hcbs--test-stage--hcbs.aTable-reports.v0",
        },
      ],
    });
  });
});
