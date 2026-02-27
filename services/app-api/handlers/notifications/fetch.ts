import { handler } from "../../libs/handler-lib";
import { ok } from "../../libs/response-lib";
import { emptyParser } from "../../libs/param-lib";
import { scanAllNotifications } from "../../storage/notifications";

export const fetchNotifications = handler(emptyParser, async () => {
  const notifications = await scanAllNotifications();
  return ok(notifications);
});
