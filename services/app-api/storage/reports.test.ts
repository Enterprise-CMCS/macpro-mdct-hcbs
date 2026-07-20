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
            "local-qms-reports": [
              {
                PutRequest: {
                  Item: {
                    type: "QMS",
                    id: "mock-report-id",
                    state: "CO",
                    sortKey: "mock-report-id",
                    pages: [
                      "mock-report-id#root",
                      "mock-report-id#pageA",
                      "mock-report-id#pageB",
                    ],
                  },
                },
              },
              {
                PutRequest: {
                  Item: {
                    id: "root",
                    childPageIds: ["pageA", "pageB"],
                    sortKey: "mock-report-id#root",
                    state: "CO",
                  },
                },
              },
              {
                PutRequest: {
                  Item: {
                    id: "pageA",
                    elements: [{ type: ElementType.Header, text: "Page A" }],
                    sortKey: "mock-report-id#pageA",
                    state: "CO",
                  },
                },
              },
              {
                PutRequest: {
                  Item: {
                    id: "pageB",
                    elements: [{ type: ElementType.Header, text: "Page B" }],
                    sortKey: "mock-report-id#pageB",
                    state: "CO",
                  },
                },
              },
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
        Items: [
          {
            type: "QMS",
            id: "mock-report-id",
            state: "CO",
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
            sortKey: "mock-report-id#root",
            state: "CO",
          },
          {
            id: "pageA",
            elements: [{ type: ElementType.Header, text: "Page A" }],
            sortKey: "mock-report-id#pageA",
            state: "CO",
          },
          {
            id: "pageB",
            elements: [{ type: ElementType.Header, text: "Page B" }],
            sortKey: "mock-report-id#pageB",
            state: "CO",
          },
        ],
      });
      mockDynamo.on(QueryCommand).callsFake(mockQuery);

      const report = await getReport(ReportType.QMS, "CO", "mock-report-id");

      expect(report).toEqual(mockReport);
      expect(mockQuery).toHaveBeenCalledWith(
        {
          TableName: "local-qms-reports",
          KeyConditionExpression:
            "#state = :state AND begins_with(sortKey, :id)",
          ExpressionAttributeNames: { "#state": "state" },
          ExpressionAttributeValues: {
            ":state": "CO",
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
    it("should call DynamoDB to get report data", async () => {
      const mockQuery = jest.fn().mockResolvedValue({
        Items: [{ ...mockReport, sortKey: "mock-report-id" }],
        LastEvaluatedKey: undefined,
      });
      mockDynamo.on(QueryCommand).callsFake(mockQuery);

      const reports = await queryReportsForState(ReportType.QMS, "CO");

      expect(reports).toEqual([mockReport]);
      expect(mockQuery).toHaveBeenCalledWith(
        {
          TableName: "local-qms-reports",
          KeyConditionExpression: "#state = :state",
          ExpressionAttributeValues: { ":state": "CO" },
          ExpressionAttributeNames: {
            "#id": "id",
            "#name": "name",
            "#state": "state",
            "#created": "created",
            "#status": "status",
            "#submissionCount": "submissionCount",
            "#archived": "archived",
            "#lastEdited": "lastEdited",
            "#lastEditedBy": "lastEditedBy",
            "#type": "type",
            "#year": "year",
            "#lastEditedByEmail": "lastEditedByEmail",
            "#options": "options",
            "#sortKey": "sortKey",
          },
          ProjectionExpression:
            "#id, #name, #state, #created, #status, #submissionCount, #archived, #lastEdited, #lastEditedBy, #type, #year, #lastEditedByEmail, #options, #sortKey",
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
          TableName: "local-qms-reports",
          Key: { state: "CO", sortKey: "mock-report-id" },
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
