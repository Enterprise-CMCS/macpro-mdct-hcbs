import { handler } from "../../libs/handler-lib";
import { emptyParser } from "../../libs/param-lib";
import { forbidden, ok } from "../../libs/response-lib";
import { scanNotificationAssignments } from "../../storage/notificationAssignments";
import { canChangeNotification } from "../../utils/authorization";
import { error } from "../../utils/constants";

export const fetchNotificationAssignments = handler(
  emptyParser,
  async (request) => {
    if (!canChangeNotification(request.user)) {
      return forbidden(error.UNAUTHORIZED);
    }

    return ok(await scanNotificationAssignments());
  }
);
