import { GetParameterCommand, SSMClient } from "@aws-sdk/client-ssm";
import { logger } from "../../libs/debug-lib";

export const getParameter = async (Name: string) => {
  const ssmClient = new SSMClient({ logger });
  const result = await ssmClient.send(new GetParameterCommand({ Name }));
  return result.Parameter?.Value;
};
