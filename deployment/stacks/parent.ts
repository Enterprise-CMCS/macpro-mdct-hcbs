import { Construct } from "constructs";
import {
  Aws,
  aws_ec2 as ec2,
  aws_iam as iam,
  CfnOutput,
  Stack,
  StackProps,
} from "aws-cdk-lib";
import { DeploymentConfigProperties } from "../deployment-config.js";
import { createDataComponents } from "./data.js";
import { createUiAuthComponents } from "./ui-auth.js";
import { createUiComponents } from "./ui.js";
import { createApiComponents } from "./api.js";
import { deployFrontend } from "./deployFrontend.js";
import { isLocalStack } from "../local/util.js";
import { createTopicsComponents } from "./topics.js";
import { getSubnets } from "../utils/vpc.js";

export class ParentStack extends Stack {
  constructor(
    scope: Construct,
    id: string,
    props: StackProps & DeploymentConfigProperties
  ) {
    const {
      isDev,
      secureCloudfrontDomainName,
      vpcName,
      kafkaAuthorizedSubnetIds,
    } = props;

    super(scope, id, {
      ...props,
      terminationProtection: !isDev,
    });

    const commonProps = {
      scope: this,
      ...props,
      isDev,
    };

    const vpc = ec2.Vpc.fromLookup(this, "Vpc", { vpcName });
    const kafkaAuthorizedSubnets = getSubnets(this, kafkaAuthorizedSubnetIds);

    const { tables } = createDataComponents(commonProps);

    const { apiGatewayRestApiUrl, restApiId } = createApiComponents({
      ...commonProps,
      tables,
      vpc,
      kafkaAuthorizedSubnets,
    });

    if (isLocalStack) {
      /*
       * For local dev, the LocalStack container will host the database and API.
       * The UI will self-host, so we don't need to tell CDK anything about it.
       * Also, we skip authorization locally. So we don't set up Cognito,
       * or configure the API to interact with it. Therefore, we're done.
       */
      return;
    }

    const { applicationEndpointUrl, distribution, uiBucket } =
      createUiComponents(commonProps);

    const { userPoolDomainName, identityPoolId, userPoolId, userPoolClientId } =
      createUiAuthComponents({
        ...commonProps,
        applicationEndpointUrl,
        restApiId,
      });

    deployFrontend({
      ...commonProps,
      uiBucket,
      distribution,
      apiGatewayRestApiUrl,
      applicationEndpointUrl:
        secureCloudfrontDomainName ?? applicationEndpointUrl,
      identityPoolId,
      userPoolId,
      userPoolClientId,
      userPoolClientDomain: `${userPoolDomainName}.auth.${Aws.REGION}.amazoncognito.com`,
    });

    new CfnOutput(this, "CloudFrontUrl", {
      value: applicationEndpointUrl,
    });

    createTopicsComponents({
      ...commonProps,
      vpc,
      kafkaAuthorizedSubnets,
    });

    if (isDev) {
      applyDenyCreateLogGroupPolicy(this);
    }
  }
}

function applyDenyCreateLogGroupPolicy(stack: Stack) {
  const denyCreateLogGroupPolicy = {
    PolicyName: "DenyCreateLogGroup",
    PolicyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Deny",
          Action: "logs:CreateLogGroup",
          Resource: "*",
        },
      ],
    },
  };

  const adddenyCreateLogGroupPolicy = (
    role: iam.CfnRole,
    policyIndex?: number
  ) => {
    const path =
      policyIndex !== undefined ? `Policies.${policyIndex}` : "Policies";
    role.addPropertyOverride(
      path,
      policyIndex !== undefined
        ? denyCreateLogGroupPolicy
        : [denyCreateLogGroupPolicy]
    );
  };

  const findRole = (parent: Construct | undefined, childId = "Role") =>
    parent?.node.tryFindChild(childId) as iam.CfnRole | undefined;

  // S3 auto-delete objects provider
  const s3Provider = stack.node.tryFindChild(
    "Custom::S3AutoDeleteObjectsCustomResourceProvider"
  );
  const s3Role = findRole(s3Provider);
  if (s3Role) {
    adddenyCreateLogGroupPolicy(s3Role);
  }

  // AWSCDK Trigger provider (used by DeployTimeSubstitutedFile)
  // Has existing inline policy at index 0, so we add at index 1
  const triggerProviderIds = [
    "AWSCDK.TriggerCustomResourceProviderCustomResourceProvider",
  ];
  for (const id of triggerProviderIds) {
    const triggerRole = findRole(stack.node.tryFindChild(id));
    if (triggerRole) {
      adddenyCreateLogGroupPolicy(triggerRole, 1);
      break;
    }
  }
}
