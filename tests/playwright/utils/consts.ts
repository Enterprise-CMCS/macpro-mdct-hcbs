export const adminUser = process.env.TEST_ADMIN_USER_EMAIL!;
export const adminPassword = process.env.TEST_ADMIN_USER_PASSWORD!; // pragma: allowlist secret
export const stateUser = process.env.TEST_STATE_USER_EMAIL!;
export const statePassword = process.env.TEST_STATE_USER_PASSWORD!; // pragma: allowlist secret

/** The path to the file containing admin browser session data */
export const adminAuthPath = "playwright/.auth/admin.json";
/** The path to the file containing state user browser session data */
export const stateUserAuthPath = "playwright/.auth/stateUser.json";
