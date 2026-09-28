import { Kafka } from "kafkajs";
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { getReport } from "../../../storage/reports";
import { ReportType } from "../../../types/reports";

const { mockConnect, mockSendBatch, mockGetReport } = vi.hoisted(() => ({
  mockConnect: vi.fn(),
  mockSendBatch: vi.fn(),
  mockGetReport: vi.fn(),
}));

vi.mock("kafkajs", () => ({
  Kafka: vi.fn(
    class {
      producer = vi.fn().mockReturnValue({
        connect: mockConnect,
        disconnect: vi.fn(),
        sendBatch: mockSendBatch,
      });
    }
  ),
}));

vi.mock("../../../storage/reports", () => ({
  getReport: mockGetReport,
}));

const mockedGetReport = vi.mocked(getReport);

const namespace = "--hcbs--test-stage--";
const reportTable = "testing-Reports";
const qmsTopic = `${namespace}aws.mdct.hcbs.qms-reports.v0`;
const qipTopic = `${namespace}aws.mdct.hcbs.qip-reports.v0`;
const fullReport = {
  id: "report-1",
  type: ReportType.QMS,
  state: "CO",
  pages: [{ id: "root" }],
} as any;

const loadHandler = async () => (await import("./postKafkaData.js")).handler;

const createRecord = ({
  type = "QMS",
  sortKey = "report-1",
  eventID = "evt-1",
  eventName = "MODIFY",
}: {
  type?: string;
  sortKey?: string;
  eventID?: string;
  eventName?: string;
}) => ({
  eventID,
  eventName,
  dynamodb: {
    NewImage: {
      type: { S: type },
      state: { S: "CO" },
      id: { S: "report-1" },
      sortKey: { S: sortKey },
    },
  },
  eventSourceARN: `arn:aws:dynamodb:us-east-1:123456789012:table/${reportTable}/stream/2026-09-28T00:00:00.000`,
});

describe("postKafkaData", () => {
  const originalEnv = {
    brokerString: process.env.brokerString,
    STAGE: process.env.STAGE,
    topicNamespace: process.env.topicNamespace,
    ReportsTable: process.env.ReportsTable,
  };

  beforeAll(() => {
    process.env.brokerString = "brokerA,brokerB";
    process.env.STAGE = "testing";
    process.env.topicNamespace = namespace;
    process.env.ReportsTable = reportTable;
  });

  afterAll(() => {
    process.env.brokerString = originalEnv.brokerString;
    process.env.STAGE = originalEnv.STAGE;
    process.env.topicNamespace = originalEnv.topicNamespace;
    process.env.ReportsTable = originalEnv.ReportsTable;
  });

  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    mockedGetReport.mockResolvedValue(fullReport);
  });

  it("should publish a full QMS report to the QMS topic", async () => {
    const handler = await loadHandler();

    await handler({ Records: [createRecord({ type: "QMS" })] });

    expect(Kafka).toHaveBeenCalledWith({
      clientId: "hcbs-testing",
      brokers: ["brokerA", "brokerB"],
      retry: { initialRetryTime: 300, retries: 8 },
      ssl: { rejectUnauthorized: false },
    });
    expect(mockedGetReport).toHaveBeenCalledWith("QMS", "CO", "report-1");
    expect(mockSendBatch).toHaveBeenCalledWith({
      topicMessages: [
        {
          topic: qmsTopic,
          messages: [
            expect.objectContaining({
              key: "QMS#CO#report-1",
              value: JSON.stringify(fullReport),
              headers: {
                eventID: "evt-1",
                eventName: "MODIFY",
              },
            }),
          ],
        },
      ],
    });
  });

  it("should publish a full QIP report to the QIP topic", async () => {
    const handler = await loadHandler();
    mockedGetReport.mockResolvedValueOnce({
      ...fullReport,
      type: ReportType.QIP,
    } as any);

    await handler({
      Records: [createRecord({ type: "QIP", eventID: "evt-2" })],
    });

    expect(mockedGetReport).toHaveBeenCalledWith("QIP", "CO", "report-1");
    expect(mockSendBatch).toHaveBeenCalledWith({
      topicMessages: [
        {
          topic: qipTopic,
          messages: [
            expect.objectContaining({
              key: "QIP#CO#report-1",
              value: JSON.stringify({ ...fullReport, type: "QIP" }),
            }),
          ],
        },
      ],
    });
  });

  it("should not publish page items", async () => {
    const handler = await loadHandler();

    await handler({ Records: [createRecord({ sortKey: "report-1#page-a" })] });

    expect(mockedGetReport).not.toHaveBeenCalled();
    expect(mockSendBatch).not.toHaveBeenCalled();
  });

  it("should publish exactly one message for multiple stream records", async () => {
    const handler = await loadHandler();

    await handler({
      Records: [
        createRecord({ sortKey: "report-1#root", eventID: "evt-page-1" }),
        createRecord({ sortKey: "report-1#page-a", eventID: "evt-page-2" }),
        createRecord({ sortKey: "report-1", eventID: "evt-head" }),
      ],
    });

    expect(mockedGetReport).toHaveBeenCalledTimes(1);
    expect(mockSendBatch).toHaveBeenCalledTimes(1);
    expect(mockSendBatch).toHaveBeenCalledWith({
      topicMessages: [
        expect.objectContaining({
          topic: qmsTopic,
          messages: [expect.any(Object)],
        }),
      ],
    });
    const [firstCall] = mockSendBatch.mock.calls;
    expect(firstCall[0].topicMessages[0].messages).toHaveLength(1);
  });
});
