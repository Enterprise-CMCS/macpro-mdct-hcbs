process.env.QmsReportsTable = "local-qms-reports";
process.env.TacmReportsTable = "local-tacm-reports";
process.env.CiReportsTable = "local-ci-reports";
process.env.PcpReportsTable = "local-pcp-reports";
process.env.WwlReportsTable = "local-wwl-reports";
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
jest.mock("../libs/debug-lib", () => {
  const debug = jest.fn();
  const info = jest.fn();
  const warn = jest.fn();
  const error = jest.fn();
  const logger = { debug, info, warn, error };
  return {
    trace: jest.fn(),
    debug,
    info,
    warn,
    error,
    logger,
    init: jest.fn(),
    flush: jest.fn(),
  };
});
