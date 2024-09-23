import handler from "../../libs/handler-lib";
import { ok } from "../../libs/response-lib";

export const getHelloWorld = handler(async (_event) => {
  return ok("Hello World!");
});
