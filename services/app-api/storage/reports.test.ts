import { getReport, putReport } from "./reports";
import { Report, ReportType } from "../types/reports";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";

const mockDynamo = mockClient(DynamoDBDocumentClient);
const mockReport = {
  type: "QM",
  id: "mock-report-id",
  state: "CO",
} as Report;

describe("Report storage helpers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDynamo.reset();
  });

  describe("putReport", () => {
    it("should call DynamoDB to put report data", async () => {
      const mockPut = jest.fn();
      mockDynamo.on(PutCommand).callsFake(mockPut);

      await putReport(mockReport);

      expect(mockPut).toHaveBeenCalledWith(
        {
          TableName: "local-qm-reports",
          Item: mockReport,
        },
        expect.any(Function)
      );
    });
  });

  describe("getReport", () => {
    it("should call DynamoDB to get report data", async () => {
      const mockGet = jest.fn().mockResolvedValue({
        Item: mockReport,
      });
      mockDynamo.on(GetCommand).callsFake(mockGet);

      const report = await getReport(ReportType.QM, "CO", "mock-report-id");

      expect(report).toBe(mockReport);
      expect(mockGet).toHaveBeenCalledWith(
        {
          TableName: "local-qm-reports",
          Key: { state: "CO", id: "mock-report-id" },
        },
        expect.any(Function)
      );
    });

    it("should return undefined if report is not found", async () => {
      mockDynamo.on(GetCommand).resolvesOnce({});
      const report = await getReport(ReportType.QM, "CO", "mock-report-id");
      expect(report).toBe(undefined);
    });
  });
});
