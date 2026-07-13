import { handler } from "../../libs/handler-lib";
import { badRequest, forbidden, ok } from "../../libs/response-lib";
import { error, EMAIL_PATTERN, FROM_ADDRESS } from "../../utils/constants";
import { canChangeNotification } from "../../utils/authorization";
import { emptyParser } from "../../libs/param-lib";
import { sendSesEmail } from "../../libs/ses-lib";
import { logger } from "../../libs/debug-lib";

export const sendTestEmail = handler(emptyParser, async (request) => {
  if (!canChangeNotification(request.user)) {
    return forbidden(error.UNAUTHORIZED);
  }

  const { toAddress, subject, message } = (request.body ?? {}) as {
    toAddress?: string;
    subject?: string;
    message?: string;
  };

  if (!toAddress || !subject || !message) {
    return badRequest("Missing required fields: toAddress, subject, message");
  }

  if (!EMAIL_PATTERN.test(toAddress)) {
    return badRequest("toAddress is not a valid email address");
  }

  const params = {
    Source: FROM_ADDRESS,
    Destination: { ToAddresses: [toAddress] },
    Message: {
      Subject: { Data: subject },
      Body: { Text: { Data: message } },
    },
  };

  logger.info("Sending test email to:", toAddress);
  try {
    await sendSesEmail(params);
    logger.info("Test email sent successfully to:", toAddress);
  } catch (error) {
    logger.warn("SES send failed:", error);
  }

  return ok();
});
