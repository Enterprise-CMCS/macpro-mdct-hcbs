import {
  getReport,
  putReport,
  queryReportsForState,
  updateFields,
} from "./reports";
import { ElementType, Report, ReportType } from "../types/reports";
import {
  BatchWriteCommand,
  DynamoDBDocumentClient,
  QueryCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";

const mockDynamo = mockClient(DynamoDBDocumentClient);

/** The shape of the report as the rest of the app sees it */
const mockReport = {
  type: "QMS",
  id: "mock-report-id",
  state: "CO",
  pages: [
    { id: "root", childPageIds: ["pageA", "pageB"] },
    { id: "pageA", elements: [{ type: ElementType.Header, text: "Page A" }] },
    { id: "pageB", elements: [{ type: ElementType.Header, text: "Page B" }] },
  ],
} as Report;

/** The shape of the report as it is stored in the database */
const mockStoredReport = [
  {
    type: "QMS",
    id: "mock-report-id",
    state: "CO",
    pKey: "QMS#CO",
    sortKey: "mock-report-id",
    pages: [
      "mock-report-id#root",
      "mock-report-id#pageA",
      "mock-report-id#pageB",
    ],
  },
  {
    id: "root",
    childPageIds: ["pageA", "pageB"],
    pKey: "QMS#CO",
    sortKey: "mock-report-id#root",
  },
  {
    id: "pageA",
    elements: [{ type: ElementType.Header, text: "Page A" }],
    pKey: "QMS#CO",
    sortKey: "mock-report-id#pageA",
  },
  {
    id: "pageB",
    elements: [{ type: ElementType.Header, text: "Page B" }],
    pKey: "QMS#CO",
    sortKey: "mock-report-id#pageB",
  },
];

describe("Report storage helpers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDynamo.reset();
  });

  describe("putReport", () => {
    it("should call DynamoDB to put report data", async () => {
      const mockBatchWrite = jest.fn().mockResolvedValue({});
      mockDynamo.on(BatchWriteCommand).callsFake(mockBatchWrite);

      await putReport(mockReport);

      expect(mockBatchWrite).toHaveBeenCalledWith(
        {
          RequestItems: {
            "local-reports": [
              { PutRequest: { Item: mockStoredReport[0] } },
              { PutRequest: { Item: mockStoredReport[1] } },
              { PutRequest: { Item: mockStoredReport[2] } },
              { PutRequest: { Item: mockStoredReport[3] } },
            ],
          },
        },
        expect.any(Function)
      );
    });
  });

  describe("getReport", () => {
    it("should call DynamoDB to get report data", async () => {
      const mockQuery = jest.fn().mockResolvedValue({
        Items: structuredClone(mockStoredReport),
      });
      mockDynamo.on(QueryCommand).callsFake(mockQuery);

      const report = await getReport(ReportType.QMS, "CO", "mock-report-id");

      expect(report).toEqual(mockReport);
      expect(mockQuery).toHaveBeenCalledWith(
        {
          TableName: "local-reports",
          KeyConditionExpression: "pKey = :pKey AND begins_with(sortKey, :id)",
          ExpressionAttributeValues: {
            ":pKey": "QMS#CO",
            ":id": "mock-report-id",
          },
        },
        expect.any(Function)
      );
    });

    it("should return undefined if report is not found", async () => {
      mockDynamo.on(QueryCommand).resolvesOnce({});
      const report = await getReport(ReportType.QMS, "CO", "mock-report-id");
      expect(report).toBe(undefined);
    });
  });

  describe("queryReportsForState", () => {
    it("should call DynamoDB to get multiple reports", async () => {
      const mockLiteReport = structuredClone(mockReport) as any;
      delete mockLiteReport.pages;
      const mockQuery = jest.fn().mockResolvedValue({
        Items: structuredClone(mockStoredReport),
        LastEvaluatedKey: undefined,
      });
      mockDynamo.on(QueryCommand).callsFake(mockQuery);

      const reports = await queryReportsForState(ReportType.QMS, "CO");

      expect(reports).toEqual([mockLiteReport]);
      expect(mockQuery).toHaveBeenCalledWith(
        {
          TableName: "local-reports",
          KeyConditionExpression: "pKey = :pKey",
          ExpressionAttributeValues: { ":pKey": "QMS#CO" },
        },
        expect.any(Function)
      );
    });
  });

  describe("updateFields", () => {
    it("should call DynamoDB to update report data", async () => {
      const mockUpdate = jest.fn();
      mockDynamo.on(UpdateCommand).callsFake(mockUpdate);

      await updateFields(
        { name: "Updated Name" },
        ReportType.QMS,
        "CO",
        "mock-report-id"
      );

      expect(mockUpdate).toHaveBeenCalledWith(
        {
          TableName: "local-reports",
          Key: { pKey: "QMS#CO", sortKey: "mock-report-id" },
          UpdateExpression: "SET #name = :name",
          ExpressionAttributeNames: {
            "#name": "name",
          },
          ExpressionAttributeValues: {
            ":name": "Updated Name",
          },
        },
        expect.any(Function)
      );
    });
  });
});
