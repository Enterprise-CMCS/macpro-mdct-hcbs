export enum UserRoles {
  ADMIN = "mdcthcbs-bor", // "MDCT HCBS Business Owner Representative"
  APPROVER = "mdcthcbs-appr", // "MDCT HCBS Approver"
  HELP_DESK = "mdcthcbs-hd", // "MDCT HCBS Help Desk"
  INTERNAL = "mdcthcbs-internal-user", // "MDCT HCBS Internal User"
  STATE_USER = "mdcthcbs-state-user", // "MDCT HCBS State User"
}

/**
 * Abridged copy of the type used by `aws-lambda@1.0.7` (from `@types/aws-lambda@8.10.88`)
 * We only this package for these types, and we use only a subset of the
 * properties. Since `aws-lambda` depends on `aws-sdk` (that is, SDK v2),
 * we can save ourselves a big dependency with this small redundancy.
 */
export interface APIGatewayProxyEvent {
  body: string | null;
  headers: Record<string, string | undefined>;
  multiValueHeaders: Record<string, string | undefined>;
  httpMethod: string;
  isBase64Encoded: boolean;
  path: string;
  pathParameters: Record<string, string | undefined> | null;
  queryStringParameters: Record<string, string | undefined> | null;
  multiValueQueryStringParameters: Record<string, string | undefined> | null;
  stageVariables: Record<string, string | undefined> | null;
  /** The context is complicated, and we don't (as of 2023) use it at all. */
  requestContext: any;
  resource: string;
}
