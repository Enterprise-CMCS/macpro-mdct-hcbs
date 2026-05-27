import {
  SendEmailCommand,
  SendEmailRequest,
  SESClient,
} from "@aws-sdk/client-ses";
import { logger } from "./debug-lib";

export const awsConfig = {
  region: "us-east-1",
  logger,
  endpoint: process.env.AWS_ENDPOINT_URL,
  forcePathStyle: true,
};

const client = new SESClient(awsConfig);

export default {
  sendSesEmail: (params: SendEmailRequest) =>
    client.send(new SendEmailCommand(params)),
};
