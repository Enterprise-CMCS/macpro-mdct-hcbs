import handler from "../../libs/handler-lib";
import { StatusCodes } from "../../types";

export const getHelloWorld = handler(async (_context) => {
  return { status: StatusCodes.SUCCESS, body: "Hello World!" };
});
