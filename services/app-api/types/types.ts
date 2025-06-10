import { HttpResponse } from "../libs/response-lib";
import { StateAbbr } from "../utils/constants";

export enum UserRoles {
  ADMIN = "mdcthcbs-bor", // "MDCT HCBS Business Owner Representative"
  APPROVER = "mdcthcbs-appr", // "MDCT HCBS Approver"
  HELP_DESK = "mdcthcbs-hd", // "MDCT HCBS Help Desk"
  INTERNAL = "mdcthcbs-internal-user", // "MDCT HCBS Internal User"
  STATE_USER = "mdcthcbs-state-user", // "MDCT HCBS State User"
}
export const isUserRole = (role: string): role is UserRoles => {
  return Object.values(UserRoles).includes(role as UserRoles);
};

export interface User {
  role: UserRoles;
  state?: StateAbbr;
  email: string;
  fullName: string;
}

/**
 * Abridged definition of the type receieved by our lambdas in AWS.
 * We use only a handful of these properties.
 *
 * For official documentation, see https://docs.aws.amazon.com/lambda/latest/dg/services-apigateway.html#apigateway-example-event
 *
 * For more details, see https://github.com/DefinitelyTyped/DefinitelyTyped/blob/97a6cb3f8272fe9915c2152c964e607557906f30/types/aws-lambda/trigger/api-gateway-proxy.d.ts#L135-L148
 */
export interface APIGatewayProxyEvent {
  body: string | null;
  headers: Record<string, string | undefined>;
  pathParameters: Record<string, string | undefined> | null;
  queryStringParameters: Record<string, string | undefined> | null;
  requestContext: any;
}

/**
 * Given an event, pull out all necessary parameters.
 * Returns undefined if parsing fails (due to a missing or invalid param).
 *
 * Usually, these extract reportType and state from the event's pathParameters,
 * but exact needs will vary from endpoint to endpoint.
 *
 * If parsing fails, parsers should log which parameter was missing or invalid.
 *
 * At this time none of our endpoints use queryParameters,
 * but in theory those should be extracted & validated here as well.
 */
export type ParameterParser<TParams> = (
  event: APIGatewayProxyEvent
) => TParams | undefined;

/**
 * Represents a request that:
 *   1. Was made by an authenticated user
 *   2. Has valid values for all necessary parameters
 *   3. Has a sanitized body (or none at all)
 *
 * This is a more refined object than `APIGatewayProxyEvent`,
 * which makes no such guarantees.
 */
export interface AuthenticatedRequest<TParams> {
  body: object | undefined;
  user: User;
  parameters: TParams;
}

/**
 * Performs all the necessary operations for an API endpoint. This includes:
 *   1. Checking user permissions
 *   2. Validating the request body (if applicable)
 *   3. Creating, reading, updating, and/or deleting appropriate resources
 *   4. Returning an HTTP Response (complete with status and headers)
 */
export type HandlerLambda<TParams> = (
  request: AuthenticatedRequest<TParams>
) => Promise<HttpResponse>;
