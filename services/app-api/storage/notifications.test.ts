import { mockClient } from "aws-sdk-client-mock";
import {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";
import { Notifications } from "../types/notifications";
import { ReportType } from "../types/reports";
import { putNotifications, scanAllNotifications } from "./notifications";

const mockDynamo = mockClient(DynamoDBDocumentClient);

const mockNotification: Notifications = {
  category: ReportType.WWL,
  enabled: true,
};

describe("Notification storage methods", () => {
  beforeEach(() => {
    mockDynamo.reset();
  });

  it("should call Dynamo to updated notification", async () => {
    const mockPut = jest.fn();
    mockDynamo.on(PutCommand).callsFakeOnce(mockPut);

    await putNotifications(mockNotification);

    expect(mockPut).toHaveBeenCalledWith(
      {
        Item: mockNotification,
      },
      expect.any(Function)
    );
  });

  it("should call Dynamo to scan all notification", async () => {
    const mockScan = jest
      .fn()
      .mockResolvedValueOnce({ Items: mockNotification });
    mockDynamo.on(ScanCommand).callsFakeOnce(mockScan);

    const notification = await scanAllNotifications();

    expect(notification).toEqual(mockNotification);
    expect(mockScan).toHaveBeenCalledWith(
      expect.objectContaining({
        Item: mockNotification,
      }),
      expect.any(Function)
    );
  });
});
