import { putBanner, getBanner, deleteBanner, scanAllBanners } from "./banners";
import { mockClient } from "aws-sdk-client-mock";
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";
import { BannerShape, BannerAreas } from "../types/banner";

const mockDynamo = mockClient(DynamoDBDocumentClient);

const mockBanner: BannerShape = {
  title: "mock title",
  area: BannerAreas.QMS,
  description: "mock description",
  link: "https://example.com",
  startDate: new Date().toISOString().slice(0, 10),
  endDate: new Date().toISOString().slice(0, 10),
  key: "mock-existing-banner-key-guid",
  createdAt: "1998-01-01T00:00:00.123Z",
  lastAltered: "1998-01-01T00:00:00.123Z",
  lastAlteredBy: "prev username",
};

describe("Banner storage methods", () => {
  beforeEach(() => {
    mockDynamo.reset();
  });

  it("should call Dynamo to create a new or updated banner", async () => {
    const mockPut = jest.fn();
    mockDynamo.on(PutCommand).callsFakeOnce(mockPut);

    await putBanner(mockBanner);

    expect(mockPut).toHaveBeenCalledWith(
      {
        TableName: "local-banners",
        Item: mockBanner,
      },
      expect.any(Function)
    );
  });

  it("should call Dynamo to fetch a banner", async () => {
    const mockFetch = jest.fn().mockResolvedValue({ Item: mockBanner });
    mockDynamo.on(GetCommand).callsFakeOnce(mockFetch);

    const banner = await getBanner("mock-key");

    expect(banner).toBe(mockBanner);
    expect(mockFetch).toHaveBeenCalledWith(
      {
        TableName: "local-banners",
        Key: { key: "mock-key" },
      },
      expect.any(Function)
    );
  });

  it("should call Dynamo to scan all banners", async () => {
    const mockScan = jest
      .fn()
      .mockResolvedValueOnce({ Items: [mockBanner], LastEvaluatedKey: "foo" })
      .mockResolvedValueOnce({ Items: [mockBanner] });
    mockDynamo.on(ScanCommand).callsFakeOnce(mockScan).callsFakeOnce(mockScan);

    const banner = await scanAllBanners();

    expect(banner).toEqual([mockBanner, mockBanner]);
    expect(mockScan).toHaveBeenCalledWith(
      expect.objectContaining({
        TableName: "local-banners",
      }),
      expect.any(Function)
    );
  });

  it("should call Dynamo to delete a banner", async () => {
    const mockDelete = jest.fn();
    mockDynamo.on(DeleteCommand).callsFakeOnce(mockDelete);

    await deleteBanner("mock-key");

    expect(mockDelete).toHaveBeenCalledWith(
      {
        TableName: "local-banners",
        Key: { key: "mock-key" },
      },
      expect.any(Function)
    );
  });
});
