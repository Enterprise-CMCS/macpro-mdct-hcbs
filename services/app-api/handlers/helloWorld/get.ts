import handler from "../../libs/handler-lib";
import { StatusCodes } from "../../types/types";

export const getHelloWorld = handler(async (_context) => {
  return { status: StatusCodes.SUCCESS, body: "Hello World!" };
});
