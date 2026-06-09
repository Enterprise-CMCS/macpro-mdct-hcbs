export const isLocalStack = () =>
  process.env.AWS_ENDPOINT_URL?.includes("localhost") ?? false;

export const fixLocalstackUrl = (url: string) =>
  isLocalStack() ? url.replace(".localstack.cloud", "") : url;
