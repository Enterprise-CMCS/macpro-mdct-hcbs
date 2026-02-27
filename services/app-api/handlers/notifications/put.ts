import { handler } from "../../libs/handler-lib";
import { error } from "../../utils/constants";
import {
  badRequest,
  forbidden,
  ok,
} from "../../libs/response-lib";
import { canChangeNotification } from "../../utils/authorization";
import { parseNotificationId } from "../../libs/param-lib";
import { isValidNotification } from "../../utils/notificationsValidation";
import { putNotifications } from "../../storage/notifications";

export const updateNotifications = handler(
  parseNotificationId,
  async (request) => {
    const user = request.user;

    if (!canChangeNotification(user)) {
      return forbidden(error.UNAUTHORIZED);
    }

    if (!isValidNotification(request.body)) {
      return badRequest("Invalid notification data");
    }

    await putNotifications(request.body);
    return ok();
  },
);
