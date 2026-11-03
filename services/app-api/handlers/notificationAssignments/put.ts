import { handler } from "../../libs/handler-lib";
import { emptyParser } from "../../libs/param-lib";
import { badRequest, forbidden, ok } from "../../libs/response-lib";
import { putNotificationAssignment as putAssignment } from "../../storage/notificationAssignments";
import { canChangeNotification } from "../../utils/authorization";
import { error } from "../../utils/constants";
import {
  isValidNotificationAssignment,
  normalizeNotificationAssignment,
} from "../../utils/notificationAssignmentValidation";

export const putNotificationAssignment = handler(
  emptyParser,
  async (request) => {
    if (!canChangeNotification(request.user)) {
      return forbidden(error.UNAUTHORIZED);
    }

    if (!isValidNotificationAssignment(request.body)) {
      return badRequest("Invalid notification assignment data.");
    }

    const assignment = normalizeNotificationAssignment(request.body);
    await putAssignment(assignment);

    return ok(assignment);
  }
);
