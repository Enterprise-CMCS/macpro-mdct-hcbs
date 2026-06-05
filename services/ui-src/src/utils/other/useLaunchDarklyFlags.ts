import { useEffect, useState } from "react";
import config from "config";

/*
 * This file partially reimplements the SDK from Launch Darkly's npm package.
 * - pro: It has fewer dependencies.
 * - con: It has fewer features.
 * - mid: It does not auto-convert flag names to camel case.
 *
 * It will instantly serve the default values described below,
 * then update to live values as soon as the network request resolves,
 * then poll for new values periodically.
 *
 * TODO:
 * - Make sure we only make one request every few minutes
 *    + Even if a component calls useFlags() multiple times in a row
 *    + Even if multiple components on the same page call useFlags()
 * - Make sure we make the first request as soon as the app loads
 *    + Even if no components that read flags are rendered initially
 * - To those ends, perhaps move these flags to the store?
 *    + This could resemble the way we poll for banners.
 * - Write a test or two, idk.
 */

// Values found in dev as of 2025-06-05
const defaultFlags = {
  isQipReportActive: true,
  "notifications-system": true,
  isPCPReportActive: true,
  isTAReportActive: true,
  isWwlReportActive: true,
  isCIReportActive: true,
  isTacmReportActive: true,
  ViewPDF: true,
  "component-inventory": false,
  componentInventory: true,
};

const FIVE_MINUTES = 5 * 60 * 1000;

/** Anonymously call LD's public API to read our feature flags */
const fetchAndParseFlags = async () => {
  const ldClientId = config.REACT_APP_LD_SDK_CLIENT;
  const detailObj = { anonymous: true, kind: "user", key: "nonce" };
  const details = btoa(JSON.stringify(detailObj)).replace(/=+$/, "");
  const url = `https://clientsdk.launchdarkly.us/sdk/evalx/${ldClientId}/contexts/${details}`;
  const response = await fetch(url);
  const json = (await response.json()) as LaunchDarklyPayload;
  const entries = Object.entries(json);
  const flags = Object.fromEntries(
    entries.map(([key, value]) => [key, value.value])
  );
  validateFlags(flags);
  return flags;
};

/** Log a warning if we don't get the flags we expect. */
function validateFlags(
  flags: Record<string, any>
): asserts flags is typeof defaultFlags {
  const missingFlags = Object.keys(defaultFlags).filter((k) => !(k in flags));
  const extraFlags = Object.keys(flags).filter((k) => !(k in defaultFlags));
  if (missingFlags.length > 0 && extraFlags.length > 0) {
    console.warn(
      `LaunchDarkly response does not match expectations! Missing flags: ${missingFlags}. Unexpected flags: ${extraFlags}.`
    );
  } else if (missingFlags.length > 0) {
    console.warn(
      `LaunchDarkly response is missing flags! Expected: ${missingFlags}.`
    );
  } else if (extraFlags.length > 0) {
    console.warn(
      `LaunchDarkly response contains unexpected flags! Found: ${extraFlags}.`
    );
  }
}

export const useFlags = () => {
  const [flags, setFlags] = useState(defaultFlags);

  const updateFlags = async () => setFlags(await fetchAndParseFlags());

  useEffect(() => {
    // Fetch immediately, and refresh periodically
    updateFlags();
    const intervalHandle = setInterval(updateFlags, FIVE_MINUTES);

    // Delete refresh timer when hook is disposed
    return () => clearInterval(intervalHandle);
  });

  return flags;
};

/**
 * The shape of LD's response over the wire.
 * See also: https://github.com/launchdarkly/js-core/blob/40c0e6c3ceade4c0cf12b69016c5dd9e90374759/packages/shared/sdk-client/src/types/index.ts#L3-L14
 */
type LaunchDarklyPayload = {
  [key: string]: {
    version: number;
    flagVersion: number;
    value: boolean;
    variation: number;
    trackEvents: boolean;
  };
};
