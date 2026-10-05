import { Kafka } from "kafkajs";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { kafkaHandler } from "./kafkaLib";

const { mockConnect, mockDisconnect, mockOn, mockSendBatch } = vi.hoisted(
  () => ({
    mockConnect: vi.fn(),
    mockDisconnect: vi.fn(),
    mockOn: vi.fn(),
    mockSendBatch: vi.fn(),
  })
);

vi.mock("kafkajs", () => ({
  Kafka: vi.fn(
    class {
      producer = vi.fn().mockReturnValue({
        connect: mockConnect,
        disconnect: mockDisconnect,
        on: mockOn,
        sendBatch: mockSendBatch,
      });
    }
  ),
}));

const config = { clientId: "test", brokers: ["localhost:9092"] };
const s3Record = (eventName: string) => ({
  eventSourceARN: "arn:aws:s3:::reports",
  eventName,
  eventTime: "2026-09-30T12:00:00.000Z",
  s3: {
    bucket: { arn: "arn:aws:s3:::reports", name: "reports" },
    object: { key: "report.json" },
  },
});

describe("kafkaHandler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockConnect.mockResolvedValue(undefined);
    mockSendBatch.mockResolvedValue(undefined);
  });

  it("retrieves and publishes S3 objects while sharing the initial connection", async () => {
    const getS3Object = vi.fn().mockResolvedValue('{"id":"report-1"}');
    const event = { Records: [s3Record("ObjectCreated:Put")] };
    const handler = kafkaHandler({
      getConfig: () => config,
      getS3Topic: () => "reports.v0",
      getS3Object,
    });

    await Promise.all([handler(event), handler(event)]);

    expect(Kafka).toHaveBeenCalledTimes(1);
    expect(mockConnect).toHaveBeenCalledTimes(1);
    expect(getS3Object).toHaveBeenCalledTimes(2);
    expect(mockSendBatch).toHaveBeenCalledWith({
      topicMessages: [
        {
          topic: "reports.v0",
          messages: [
            {
              headers: {
                eventName: "ObjectCreated:Put",
                eventTime: "2026-09-30T12:00:00.000Z",
              },
              partition: 0,
              key: "report.json",
              value: '{"id":"report-1"}',
            },
          ],
        },
      ],
    });
  });

  it("publishes S3 removals without fetching the object", async () => {
    const getS3Object = vi.fn();
    const handler = kafkaHandler({
      getConfig: () => config,
      getS3Topic: () => "reports.v0",
      getS3Object,
    });

    await handler({ Records: [s3Record("ObjectRemoved:Delete")] });

    expect(getS3Object).not.toHaveBeenCalled();
    expect(mockSendBatch).toHaveBeenCalledWith({
      topicMessages: [
        {
          topic: "reports.v0",
          messages: [
            expect.objectContaining({ key: "report.json", value: "" }),
          ],
        },
      ],
    });
  });

  it("skips events when the environment has no Kafka config or topic", async () => {
    const skippedHandler = kafkaHandler({ getConfig: () => undefined });
    await skippedHandler({ Records: [s3Record("ObjectCreated:Put")] });

    const noTopicHandler = kafkaHandler({
      getConfig: () => config,
      getS3Topic: () => undefined,
      getS3Object: vi.fn(),
    });
    await noTopicHandler({ Records: [s3Record("ObjectCreated:Put")] });

    expect(mockSendBatch).not.toHaveBeenCalled();
  });
});
