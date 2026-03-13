import { mockClient } from "aws-sdk-client-mock";
import {
  DynamoDBDocumentClient,
  paginateScan,
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

jest.mock("@aws-sdk/lib-dynamodb", () => {
  const actual = jest.requireActual("@aws-sdk/lib-dynamodb");
  return { ...actual, paginateScan: jest.fn() };
});

const mockedPaginateScan = paginateScan as unknown as jest.Mock;

function mockPages(pages: any[]) {
  return (async function* () {
    for (const page of pages) yield page;
  })();
}

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

  it("should call Dynamo to scan all notifications", async () => {
    mockedPaginateScan.mockReturnValue(
      mockPages([{ Items: [mockNotification] }, { Items: [mockNotification] }])
    );

    const items = await scanAllNotifications();

    expect(items).toEqual([mockNotification, mockNotification]);
  });
});
