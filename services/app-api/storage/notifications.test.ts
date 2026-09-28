import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockClient } from "aws-sdk-client-mock";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { Notification } from "../types/notification";
import { ReportType } from "../types/reports";
import { putNotifications, scanAllNotifications } from "./notifications";

const mockDynamo = mockClient(DynamoDBDocumentClient);

const mockNotification: Notification = {
  category: ReportType.WWL,
  enabled: true,
};

describe("Notification storage methods", () => {
  beforeEach(() => {
    mockDynamo.reset();
  });

  it("should call Dynamo to update notification", async () => {
    const mockPut = vi.fn();
    mockDynamo.on(PutCommand).callsFakeOnce(mockPut);

    await putNotifications(mockNotification);

    expect(mockPut).toHaveBeenCalledWith(
      {
        Item: mockNotification,
      },
      expect.any(Function)
    );
  });

  it("should call Dynamo to scan all notifications", async () => {
    mockDynamo
      .on(ScanCommand)
      .resolvesOnce({ Items: [mockNotification], LastEvaluatedKey: {} })
      .resolvesOnce({ Items: [mockNotification], LastEvaluatedKey: undefined });

    const items = await scanAllNotifications();

    expect(items).toEqual([mockNotification, mockNotification]);
  });
});
