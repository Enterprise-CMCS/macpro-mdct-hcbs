import * as logger from "./debug-lib";
import {
  HttpResponse,
  internalServerError,
  unauthenticated,
} from "./response-lib";
import { error } from "../utils/constants";
import { sanitizeObject } from "../utils/sanitize";
import { APIGatewayProxyEvent } from "../types/types";
import { isAuthenticated } from "../utils/authentication";

type LambdaFunction = (event: APIGatewayProxyEvent) => Promise<HttpResponse>;

export default function handler(lambda: LambdaFunction) {
  return async function (event: APIGatewayProxyEvent, _context: any) {
    // Start debugger
    logger.init();
    logger.debug("API event: %O", {
      body: event.body,
      pathParameters: event.pathParameters,
      queryStringParameters: event.queryStringParameters,
    });

    if (await isAuthenticated(event)) {
      try {
        if (event.body) {
          const newEventBody = sanitizeObject(JSON.parse(event.body));
          event.body = JSON.stringify(newEventBody);
        }
        return await lambda(event);
      } catch (error: any) {
        // Print debug messages
        logger.error("Error: %O", error);
        return internalServerError(error.message);
      } finally {
        logger.flush();
      }
    } else {
      return unauthenticated(error.UNAUTHORIZED);
    }
  };
}
