import { handler } from "../../libs/handler-lib";
import { badRequest, ok } from "../../libs/response-lib";
import { emptyParser } from "../../libs/param-lib";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const ses = new SESClient({ region: process.env.region });

interface SendEmailBody {
  toAddress: string;
  subject: string;
  message: string;
}

export const sendEmail = handler(emptyParser, async ({ body }) => {
  if (!body) {
    return badRequest("Missing request body");
  }
  const { toAddress, subject, message } = body as SendEmailBody;
  await ses.send(
    new SendEmailCommand({
      Source: process.env.SES_SENDER_EMAIL,
      Destination: { ToAddresses: [toAddress] },
      Message: {
        Subject: { Data: subject },
        Body: { Text: { Data: message } },
      },
    })
  );
  return ok();
});
