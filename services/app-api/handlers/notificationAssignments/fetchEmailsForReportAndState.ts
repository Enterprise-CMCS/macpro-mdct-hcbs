import { handler } from "../../libs/handler-lib";
import { parseReportTypeAndState } from "../../libs/param-lib";
import { forbidden, ok } from "../../libs/response-lib";
import { getEmailsForReportAndState } from "../../storage/notificationAssignments";
import { canChangeNotification } from "../../utils/authorization";
import { error } from "../../utils/constants";

export const fetchEmailsForReportAndState = handler(
  parseReportTypeAndState,
  async (request) => {
    if (!canChangeNotification(request.user)) {
      return forbidden(error.UNAUTHORIZED);
    }

    const { reportType, state } = request.parameters;
    return ok(await getEmailsForReportAndState(reportType, state));
  }
);
