import { handler } from "../../libs/handler-lib";
import { error } from "../../utils/constants";
import { badRequest, forbidden, ok } from "../../libs/response-lib";
import { canChangeNotification } from "../../utils/authorization";
import { emptyParser } from "../../libs/param-lib";
import sesLib from "../../libs/ses-lib";
import { logger } from "../../libs/debug-lib";
import { isLocalStack } from "../../libs/localstack";

const FROM_ADDRESS = "MDCT_NoReply@cms.hhs.gov";

interface SendEmailBody {
  toAddress: string;
  subject: string;
  message: string;
}

const isValidSendEmailBody = (body: unknown): body is SendEmailBody => {
  if (!body || typeof body !== "object") return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.toAddress === "string" &&
    typeof b.subject === "string" &&
    typeof b.message === "string"
  );
};

export const sendTestEmail = handler(emptyParser, async (request) => {
  const user = request.user;

  if (!canChangeNotification(user)) {
    return forbidden(error.UNAUTHORIZED);
  }

  if (!isValidSendEmailBody(request.body)) {
    return badRequest("Invalid email payload");
  }

  const { toAddress, subject, message } = request.body;

  if (!isLocalStack()) {
    await sesLib.sendSesEmail({
      Source: FROM_ADDRESS,
      Destination: { ToAddresses: [toAddress] },
      Message: {
        Subject: { Data: subject },
        Body: { Text: { Data: message } },
      },
    });
  } else {
    logger.info("Skipping email send in local dev environment");
  }

  return ok();
});
