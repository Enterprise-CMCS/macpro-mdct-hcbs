import { Construct } from "constructs";
import {
  Aws,
  aws_iam as iam,
  aws_ec2 as ec2,
  CfnOutput,
  Stack,
  StackProps,
} from "aws-cdk-lib";
import { DeploymentConfigProperties } from "../deployment-config";
import { createDataComponents } from "./data";
import { createUiAuthComponents } from "./ui-auth";
import { createUiComponents } from "./ui";
import { createApiComponents } from "./api";
import { deployFrontend } from "./deployFrontend";
import { createCustomResourceRole } from "./customResourceRole";
import { createTopicsComponents } from "./topics";
import { isLocalStack } from "../local/util";
import { getSubnets } from "../utils/vpc";

export class ParentStack extends Stack {
  constructor(
    scope: Construct,
    id: string,
    props: StackProps & DeploymentConfigProperties
  ) {
    const {
      isDev,
      secureCloudfrontDomainName,
      kafkaAuthorizedSubnetIds,
      vpcName,
    } = props;

    super(scope, id, {
      ...props,
      terminationProtection: !isDev,
    });

    const iamPermissionsBoundaryArn = `arn:aws:iam::${Aws.ACCOUNT_ID}:policy/cms-cloud-admin/developer-boundary-policy`;
    const iamPath = "/delegatedadmin/developer/";

    const commonProps = {
      scope: this,
      ...props,
      iamPermissionsBoundary: iam.ManagedPolicy.fromManagedPolicyArn(
        this,
        "iamPermissionsBoundary",
        iamPermissionsBoundaryArn
      ),
      iamPath,
      isDev,
    };

    const vpc = ec2.Vpc.fromLookup(this, "Vpc", { vpcName });
    const kafkaAuthorizedSubnets = getSubnets(
      this,
      kafkaAuthorizedSubnetIds ?? ""
    );

    const customResourceRole = createCustomResourceRole({ ...commonProps });

    const { tables } = createDataComponents(commonProps);

    if (isLocalStack) {
      createApiComponents({
        ...commonProps,
        tables,
      });
      /*
       * For local dev, the LocalStack container will host the database and API.
       * The UI will self-host, so we don't need to tell CDK anything about it.
       * Also, we skip authorization locally. So we don't set up Cognito,
       * or configure the API to interact with it. Therefore, we're done.
       */
      return;
    }

    const { applicationEndpointUrl, distribution, uiBucket } =
      createUiComponents({
        ...commonProps,
      });

    const {
      userPoolDomainName,
      identityPoolId,
      userPoolId,
      userPoolClientId,
      createAuthRole,
    } = createUiAuthComponents({
      ...commonProps,
      applicationEndpointUrl,
      customResourceRole,
    });

    const { apiGatewayRestApiUrl, restApiId } = createApiComponents({
      ...commonProps,
      userPoolId,
      userPoolClientId,
      tables,
    });

    createAuthRole(restApiId);

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
      customResourceRole,
    });

    new CfnOutput(this, "CloudFrontUrl", {
      value: applicationEndpointUrl,
    });

    createTopicsComponents({
      ...commonProps,
      brokerString: "", // TODO: do i need this? jon doesn't have this in mfp....
      kafkaAuthorizedSubnets,
      vpc,
    });
  }
}
