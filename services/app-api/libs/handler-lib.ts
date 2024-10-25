import * as logger from "./debug-lib";
import {
  HttpResponse,
  internalServerError,
  unauthenticated,
} from "./response-lib";
import { error } from "../utils/constants";
import { sanitizeObject } from "../utils/sanitize";
import { APIGatewayProxyEvent } from "../types/types";
import { authenticatedUser } from "../utils/authentication";

type LambdaFunction = (event: APIGatewayProxyEvent) => Promise<HttpResponse>;

export default function handler(lambda: LambdaFunction) {
  return async function (event: APIGatewayProxyEvent, _context: any) {
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

      if (event.body) {
        const newEventBody = sanitizeObject(JSON.parse(event.body));
        event.body = JSON.stringify(newEventBody);
      }

      return await lambda(event);
    } catch (error: any) {
      logger.error("Error: %O", error);
      return internalServerError(error.message);
    } finally {
      logger.flush();
    }
  };
}
