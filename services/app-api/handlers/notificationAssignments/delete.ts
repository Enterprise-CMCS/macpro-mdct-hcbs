import { ConditionalCheckFailedException } from "@aws-sdk/client-dynamodb";
import { handler } from "../../libs/handler-lib";
import { parseNotificationAssignmentEmail } from "../../libs/param-lib";
import { forbidden, notFound, ok } from "../../libs/response-lib";
import { deleteNotificationAssignment as deleteAssignment } from "../../storage/notificationAssignments";
import { canChangeNotification } from "../../utils/authorization";
import { error } from "../../utils/constants";

export const deleteNotificationAssignment = handler(
  parseNotificationAssignmentEmail,
  async (request) => {
    if (!canChangeNotification(request.user)) {
      return forbidden(error.UNAUTHORIZED);
    }

    try {
      await deleteAssignment(request.parameters.email);
    } catch (error) {
      if (error instanceof ConditionalCheckFailedException) {
        return notFound(
          "This assignment no longer exists. Refresh the page and try again."
        );
      }
      throw error;
    }

    return ok();
  }
);
