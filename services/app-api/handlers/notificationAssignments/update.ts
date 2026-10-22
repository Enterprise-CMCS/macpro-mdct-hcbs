import { ConditionalCheckFailedException } from "@aws-sdk/client-dynamodb";
import { handler } from "../../libs/handler-lib";
import { emptyParser } from "../../libs/param-lib";
import { badRequest, forbidden, notFound, ok } from "../../libs/response-lib";
import { updateNotificationAssignment as updateAssignment } from "../../storage/notificationAssignments";
import { canChangeNotification } from "../../utils/authorization";
import { error } from "../../utils/constants";
import {
  isValidNotificationAssignment,
  normalizeNotificationAssignment,
} from "../../utils/notificationAssignmentValidation";

export const updateNotificationAssignment = handler(
  emptyParser,
  async (request) => {
    if (!canChangeNotification(request.user)) {
      return forbidden(error.UNAUTHORIZED);
    }
    if (!isValidNotificationAssignment(request.body)) {
      return badRequest("Invalid notification assignment data.");
    }
    const assignment = normalizeNotificationAssignment(request.body);
    try {
      await updateAssignment(assignment);
    } catch (error) {
      if (error instanceof ConditionalCheckFailedException) {
        return notFound(
          "This assignment no longer exists. Refresh the page and try again."
        );
      }
      throw error;
    }
    return ok(assignment);
  }
);
