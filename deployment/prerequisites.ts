#!/usr/bin/env node
import "source-map-support/register";
import {
  App,
  DefaultStackSynthesizer,
  Stack,
  StackProps,
  Tags,
} from "aws-cdk-lib";
import { loadDefaultSecret } from "./deployment-config";
import { Construct } from "constructs";

interface PrerequisiteConfigProps {
  project: string;
}

export class PrerequisiteStack extends Stack {
  constructor(
    scope: Construct,
    id: string,
    props: StackProps & PrerequisiteConfigProps
  ) {
    super(scope, id, props);
  }
}

async function main() {
  const app = new App({
    defaultStackSynthesizer: new DefaultStackSynthesizer({
      deployRoleArn:
        "arn:${AWS::Partition}:iam::${AWS::AccountId}:role/delegatedadmin/developer/cdk-${Qualifier}-deploy-role-${AWS::AccountId}-${AWS::Region}",
      fileAssetPublishingRoleArn:
        "arn:${AWS::Partition}:iam::${AWS::AccountId}:role/delegatedadmin/developer/cdk-${Qualifier}-file-publishing-role-${AWS::AccountId}-${AWS::Region}",
      imageAssetPublishingRoleArn:
        "arn:${AWS::Partition}:iam::${AWS::AccountId}:role/delegatedadmin/developer/cdk-${Qualifier}-image-publishing-role-${AWS::AccountId}-${AWS::Region}",
      cloudFormationExecutionRole:
        "arn:${AWS::Partition}:iam::${AWS::AccountId}:role/delegatedadmin/developer/cdk-${Qualifier}-cfn-exec-role-${AWS::AccountId}-${AWS::Region}",
      lookupRoleArn:
        "arn:${AWS::Partition}:iam::${AWS::AccountId}:role/delegatedadmin/developer/cdk-${Qualifier}-lookup-role-${AWS::AccountId}-${AWS::Region}",
      qualifier: "hnb659fds",
    }),
  });

  Tags.of(app).add("PROJECT", "HCBS");

  const project = process.env.PROJECT!;
  new PrerequisiteStack(app, "hcbs-prerequisites", {
    project,
    ...(await loadDefaultSecret(project)),
    env: {
      account: process.env.CDK_DEFAULT_ACCOUNT,
      region: process.env.CDK_DEFAULT_REGION,
    },
  });
}

main();
