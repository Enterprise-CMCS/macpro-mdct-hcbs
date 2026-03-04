import { mockClient } from "aws-sdk-client-mock";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { Notifications } from "../types/notifications";
import { ReportType } from "../types/reports";
import { putNotifications } from "./notifications";

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
});
