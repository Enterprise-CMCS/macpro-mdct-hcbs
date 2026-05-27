import { sendEmail } from "./emailNotification";

const mockPost = jest.fn();
jest.mock("../apiLib", () => ({
  apiLib: {
    post: (path: string, opts: Record<string, any>) => mockPost(path, opts),
  },
}));

describe("notifications api", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("sendEmail", async () => {
    const payload = {
      toAddress: "test@example.com",
      subject: "Test Subject",
      message: "Test Message",
    };
    await sendEmail(payload);
    expect(mockPost).toHaveBeenCalledTimes(1);
  });
});
