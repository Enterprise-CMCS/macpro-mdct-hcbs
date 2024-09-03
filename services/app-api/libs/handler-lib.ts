// utils
import * as logger from "./debug-lib";
import { internalServerError, buildResponse } from "./response-lib";
import { error } from "../constants";
import { sanitizeObject } from "../utils/sanitize";
// types
import { APIGatewayProxyEvent, StatusCodes } from "../types";
import { isAuthorized } from "../utils/authorization";

type LambdaFunction = (
  event: APIGatewayProxyEvent, // eslint-disable-line no-unused-vars
  context: any // eslint-disable-line no-unused-vars
) => Promise<any>;

export default function handler(lambda: LambdaFunction) {
  return async function (event: APIGatewayProxyEvent, context: any) {
    // Start debugger
    logger.init();
    logger.debug("API event: %O", {
      body: event.body,
      pathParameters: event.pathParameters,
      queryStringParameters: event.queryStringParameters,
    });

    if (await isAuthorized(event)) {
      try {
        if (event.body) {
          const newEventBody = sanitizeObject(JSON.parse(event.body));
          event.body = JSON.stringify(newEventBody);
        }
        // Run the Lambda
        const { status, body } = await lambda(event, context);
        return buildResponse(status, body);
      } catch (error: any) {
        // Print debug messages
        logger.error("Error: %O", error);

        const body = { error: error.message };
        return internalServerError(body);
      } finally {
        logger.flush();
      }
    } else {
      const body = { error: error.UNAUTHORIZED };
      return buildResponse(StatusCodes.UNAUTHORIZED, body);
    }
  };
}
