import * as ld from "@launchdarkly/node-server-sdk";

let client: ld.LDClient | undefined;

async function getLdClient(): Promise<ld.LDClient> {
  if (client) return client;
  const sdkKey = process.env.launchDarklyServer ?? "local";
  client = ld.init(sdkKey, {
    baseUri: "https://sdk.launchdarkly.us/",
    eventsUri: "https://events.launchdarkly.us/",
    streamUri: "https://stream.launchdarkly.us/",
  });
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
