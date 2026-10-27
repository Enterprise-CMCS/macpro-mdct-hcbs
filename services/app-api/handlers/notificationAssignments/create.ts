import { ConditionalCheckFailedException } from "@aws-sdk/client-dynamodb";
import { handler } from "../../libs/handler-lib";
import { emptyParser } from "../../libs/param-lib";
import {
  badRequest,
  conflict,
  created,
  forbidden,
} from "../../libs/response-lib";
import { createNotificationAssignment as createAssignment } from "../../storage/notificationAssignments";
import { canChangeNotification } from "../../utils/authorization";
import { error } from "../../utils/constants";
import {
  isValidNotificationAssignment,
  normalizeNotificationAssignment,
} from "../../utils/notificationAssignmentValidation";

export const createNotificationAssignment = handler(
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
      await createAssignment(assignment);
    } catch (error) {
      if (error instanceof ConditionalCheckFailedException) {
        return conflict(
          "An assignment already exists for this email. Use Edit to update it."
        );
      }
      throw error;
    }

    return created(assignment);
  }
);
