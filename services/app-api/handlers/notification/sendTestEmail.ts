import { handler } from "../../libs/handler-lib";
import { badRequest, forbidden, ok } from "../../libs/response-lib";
import { error } from "../../utils/constants";
import { canChangeNotification } from "../../utils/authorization";
import { emptyParser } from "../../libs/param-lib";
import { sesLib } from "../../libs/ses-lib";
import { logger } from "../../libs/debug-lib";

const FROM_ADDRESS = "MDCT_NoReply@cms.hhs.gov";

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
    await sesLib(params);
    logger.info("Test email sent successfully to:", toAddress);
  } catch (error) {
    logger.warn("SES send failed:", error);
  }

  return ok();
});
