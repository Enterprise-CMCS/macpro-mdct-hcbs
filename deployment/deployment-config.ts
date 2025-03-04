/* eslint-disable no-console */
import { isLocalStack } from "./local/util";
import { getSecret } from "./utils/secrets-manager";

//GO THROUGH THIS AND MAKE IT MAKE SENSE!!!
export interface DeploymentConfigProperties {
  project: string;
  stage: string;
  isDev: boolean;
}

export const determineDeploymentConfig = async (stage: string) => {
  const project = process.env.PROJECT!;
  const isDev =
    isLocalStack ||
    !["master", "main", "val", "production", "jon-cdk"].includes(stage); // TODO: remove jon-cdk after main is deployed
  const secretConfigOptions = {
    ...(await loadDefaultSecret(project)),
    ...(await loadStageSecret(project, stage)),
  };

  const config = {
    project,
    stage,
    isDev,
    ...secretConfigOptions,
  };
  if (config.cloudfrontDomainName) {
    config.secureCloudfrontDomainName = `https://${config.cloudfrontDomainName}/`;
  }

  if (!isLocalStack) {
    validateConfig(config);
  }

  return config;
};

export const loadDefaultSecret = async (project: string) => {
  if (isLocalStack) {
    return {};
  } else {
    return JSON.parse((await getSecret(`${project}-default`))!);
  }
};

const loadStageSecret = async (project: string, stage: string) => {
  const secretName = `${project}-${stage}`;
  try {
    return JSON.parse((await getSecret(secretName))!);
  } catch (error: any) {
    console.warn(
      `Optional stage secret "${secretName}" not found: ${error.message}`
    );
    return {};
  }
};

function validateConfig(config: {
  [key: string]: any;
}): asserts config is DeploymentConfigProperties {
  const expectedKeys = ["project", "stage"];

  const invalidKeys = expectedKeys.filter(
    (key) => !config[key] || typeof config[key] !== "string"
  );

  if (invalidKeys.length > 0) {
    throw new Error(
      `The following deployment config keys are missing or invalid: ${invalidKeys}`
    );
  }
}
