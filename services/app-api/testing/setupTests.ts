import { vi } from "vitest";

process.env.ReportsTable = "local-reports";
process.env.BannersTable = "local-banners";

/*
 * This mock mutes all logger output during tests! Including console errors!
 *
 * Lots of our tests deliberately trigger console logs, warnings, and errors.
 * That adds a lot of noise to the console output of `yarn test` -
 * or it would, if we didn't mute it here.
 *
 * The only test where we need to observe logger output is debug-lib.test.ts,
 * which overrides this mock.
 */
vi.mock("../libs/debug-lib", () => {
  const debug = vi.fn();
  const info = vi.fn();
  const warn = vi.fn();
  const error = vi.fn();
  const logger = { debug, info, warn, error };
  return {
    trace: vi.fn(),
    debug,
    info,
    warn,
    error,
    logger,
    init: vi.fn(),
    flush: vi.fn(),
  };
});

/**
 * Generate every combination of the given number of boolean values.
 *
 * Technically it's every _permutation_, but who's counting?
 * @example
 * for (let combo of booleanCombinations(2)) {
 *  console.log(combo);
 * }
 * // [true, true]
 * // [true, false]
 * // [false, true]
 * // [false, false]
 */
export function* booleanCombinations(count: number): Generator<boolean[]> {
  if (count <= 1) {
    yield [true];
    yield [false];
  } else {
    for (let combo of booleanCombinations(count - 1)) {
      yield [true, ...combo];
      yield [false, ...combo];
    }
  }
}
