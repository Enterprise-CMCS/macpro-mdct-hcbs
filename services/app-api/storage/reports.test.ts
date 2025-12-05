import {
  getReport,
  putReport,
  queryReportsForState,
  updateFields,
} from "./reports";
import { Report, ReportType } from "../types/reports";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";

const mockDynamo = mockClient(DynamoDBDocumentClient);
const mockReport = {
  type: "XYZ",
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
          TableName: "local-xyz-reports",
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

      const report = await getReport(ReportType.XYZ, "CO", "mock-report-id");

      expect(report).toBe(mockReport);
      expect(mockGet).toHaveBeenCalledWith(
        {
          TableName: "local-xyz-reports",
          Key: { state: "CO", id: "mock-report-id" },
        },
        expect.any(Function)
      );
    });

    it("should return undefined if report is not found", async () => {
      mockDynamo.on(GetCommand).resolvesOnce({});
      const report = await getReport(ReportType.XYZ, "CO", "mock-report-id");
      expect(report).toBe(undefined);
    });
  });

  describe("queryReportsForState", () => {
    it("should call DynamoDB to get report data", async () => {
      const mockQuery = jest.fn().mockResolvedValue({
        Items: [mockReport],
        LastEvaluatedKey: undefined,
      });
      mockDynamo.on(QueryCommand).callsFake(mockQuery);

      const reports = await queryReportsForState(ReportType.XYZ, "CO");

      expect(reports).toEqual([mockReport]);
      expect(mockQuery).toHaveBeenCalledWith(
        {
          TableName: "local-xyz-reports",
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
          },
          ProjectionExpression:
            "#id, #name, #state, #created, #status, #submissionCount, #archived, #lastEdited, #lastEditedBy, #type, #year, #lastEditedByEmail, #options",
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
        ReportType.XYZ,
        "CO",
        "mock-report-id"
      );

      expect(mockUpdate).toHaveBeenCalledWith(
        {
          TableName: "local-xyz-reports",
          Key: { state: "CO", id: "mock-report-id" },
          UpdateExpression: "set #updateField = :updateValue",
          ExpressionAttributeNames: {
            "#updateField": "name",
          },
          ExpressionAttributeValues: {
            ":updateValue": "Updated Name",
          },
        },
        expect.any(Function)
      );
    });
  });
});
