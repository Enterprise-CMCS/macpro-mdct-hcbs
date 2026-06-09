export const isLocalStack = () =>
  process.env.AWS_ENDPOINT_URL?.includes("localhost") ?? false;

export const fixLocalstackUrl = (url: string) =>
  url.replace(".localstack.cloud", "");
