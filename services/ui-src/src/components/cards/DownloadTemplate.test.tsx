import { downloadTemplate } from "./TemplateCard";

jest.mock("utils", () => ({
  getSignedTemplateUrl: jest.fn(),
}));

const mockCreateElement = jest.spyOn(document, "createElement");
const mockClick = jest.fn();
const mockSetAttribute = jest.fn();
const mockRemove = jest.fn();

describe("downloadTemplate", () => {
  beforeEach(() => {
    mockCreateElement.mockReturnValue({
      setAttribute: mockSetAttribute,
      click: mockClick,
      remove: mockRemove,
    } as unknown as HTMLAnchorElement);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should download the template when called", async () => {
    const templateName = "test-template";
    const signedUrl = "https://example.com/signed-url";
    const { getSignedTemplateUrl } = require("utils");
    (getSignedTemplateUrl as jest.Mock).mockResolvedValue(signedUrl);

    await downloadTemplate(templateName);

    expect(getSignedTemplateUrl).toHaveBeenCalledWith(templateName);
    expect(mockSetAttribute).toHaveBeenCalledWith("target", "_blank");
    expect(mockSetAttribute).toHaveBeenCalledWith("href", signedUrl);
    expect(mockClick).toHaveBeenCalled();
    expect(mockRemove).toHaveBeenCalled();
  });
});
