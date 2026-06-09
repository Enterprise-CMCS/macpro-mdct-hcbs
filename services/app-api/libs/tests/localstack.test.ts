import { fixLocalstackUrl } from "../localstack";

describe("fixLocalstackUrl", () => {
  const originalEnv = process.env.AWS_ENDPOINT_URL;

  afterEach(() => {
    process.env.AWS_ENDPOINT_URL = originalEnv;
  });

  it("removes .localstack.cloud from the url when in localstack", () => {
    process.env.AWS_ENDPOINT_URL = "http://localhost:4566";
    const result = fixLocalstackUrl("https://bucket.s3.localstack.cloud/key");
    expect(result).toBe("https://bucket.s3/key");
  });
});
