import handler from "../../libs/handler-lib";
import { StatusCodes } from "../../types";

export const getHelloWorld = handler(async (event, _context) => {
  return { status: StatusCodes.SUCCESS, body: "Hello World!" };
});
