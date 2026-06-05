import * as ld from "@launchdarkly/node-server-sdk";

let client: ld.LDClient | undefined;

async function getLdClient(): Promise<ld.LDClient> {
  if (client) return client;
  const sdkKey = process.env.LD_SDK_SERVER ?? "local";
  client = ld.init(sdkKey);
  await client.waitForInitialization({ timeout: 5 });
  return client;
}

export async function getFlag(
  flagKey: string,
  defaultValue: boolean = false
): Promise<boolean> {
  try {
    const ldClient = await getLdClient();
    return (await ldClient.variation(
      flagKey,
      { key: "server" },
      defaultValue
    )) as boolean;
  } catch {
    return defaultValue;
  }
}
