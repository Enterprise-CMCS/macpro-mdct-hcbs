import { handler } from "../../libs/handler-lib";
import { parseNotificationAssignmentEmail } from "../../libs/param-lib";
import { forbidden, ok } from "../../libs/response-lib";
import { deleteNotificationAssignment as deleteAssignment } from "../../storage/notificationAssignments";
import { canChangeNotification } from "../../utils/authorization";
import { error } from "../../utils/constants";

export const deleteNotificationAssignment = handler(
  parseNotificationAssignmentEmail,
  async (request) => {
    if (!canChangeNotification(request.user)) {
      return forbidden(error.UNAUTHORIZED);
    }

    await deleteAssignment(request.parameters.email);

    return ok();
  }
);
