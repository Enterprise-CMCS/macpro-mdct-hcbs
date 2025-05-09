import * as logger from "./debug-lib";
import {
  badRequest,
  internalServerError,
  unauthenticated,
} from "./response-lib";
import { error } from "../utils/constants";
import { sanitizeObject } from "../utils/sanitize";
import {
  APIGatewayProxyEvent,
  HandlerLambda,
  ParameterParser,
} from "../types/types";
import { authenticatedUser } from "../utils/authentication";

export const handler = <TParams>(
  parser: ParameterParser<TParams>,
  lambda: HandlerLambda<TParams>
) => {
  return async function (event: APIGatewayProxyEvent) {
    try {
      logger.init();
      logger.debug("API event: %O", {
        body: event.body,
        pathParameters: event.pathParameters,
        queryStringParameters: event.queryStringParameters,
      });

      const user = await authenticatedUser(event);
      if (!user) {
        return unauthenticated(error.UNAUTHORIZED);
      }

      const parameters = parser(event);
      if (!parameters) {
        return badRequest(error.MISSING_DATA);
      }

      let body: object | undefined = undefined;
      if (event.body) {
        body = sanitizeObject(JSON.parse(event.body));
      }
      const request = { body, user, parameters };

      return await lambda(request);
    } catch (error: unknown) {
      logger.error("Error: %O", error);
      const message =
        error instanceof Error ? error.message : "Internal Server Error";
      return internalServerError(message);
    } finally {
      logger.flush();
    }
  };
};
