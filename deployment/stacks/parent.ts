/* eslint-disable no-console */
import { Construct } from "constructs";
import {
  Aws,
  // aws_ec2 as ec2,
  aws_iam as iam,
  // CfnOutput,
  Stack,
  StackProps,
} from "aws-cdk-lib";
import { DeploymentConfigProperties } from "../deployment-config";
import { createDataComponents } from "./data";
/*
 * import { createUiAuthComponents } from "./ui-auth";
 * import { createUiComponents } from "./ui";
 */
import { createApiComponents } from "./api";
/*
 * import { sortSubnets } from "../utils/vpc";
 * import { deployFrontend } from "./deployFrontend";
 * import { createCustomResourceRole } from "./customResourceRole";
 * import { isLocalStack } from "../local/util";
 */

export class ParentStack extends Stack {
  constructor(
    scope: Construct,
    id: string,
    props: StackProps & DeploymentConfigProperties
  ) {
    const { isDev } = props;

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
    };

    const { tables } = createDataComponents(commonProps);

    const { apiGatewayRestApiUrl, restApiId } = createApiComponents({
      ...commonProps,
      tables,
    });
    console.log(apiGatewayRestApiUrl);
    console.log(restApiId);

    /*
     *   if (!isLocalStack) {
     *     const {
     *       applicationEndpointUrl,
     *       distribution,
     *       uiBucket,
     *     } = createUiComponents({ ...commonProps });
     */

    /*
     *     const {
     *       userPoolDomainName,
     *       identityPoolId,
     *       userPoolId,
     *       userPoolClientId,
     *     } = createUiAuthComponents({
     *       ...commonProps,
     *       applicationEndpointUrl,
     *       restApiId,
     *       customResourceRole
     *     });
     */

    /*
     *     deployFrontend({
     *       ...commonProps,
     *       uiBucket,
     *       distribution,
     *       apiGatewayRestApiUrl,
     *       applicationEndpointUrl: props.secureCloudfrontDomainName || applicationEndpointUrl,
     *       identityPoolId,
     *       userPoolId,
     *       userPoolClientId,
     *       userPoolClientDomain: `${userPoolDomainName}.auth.${this.region}.amazoncognito.com`,
     *       customResourceRole,
     *     });
     */

    /*
     *     new CfnOutput(this, "CloudFrontUrl", {
     *       value: applicationEndpointUrl,
     *     });
     *   }
     *   new CfnOutput(this, "ApiUrl", {
     *     value: apiGatewayRestApiUrl,
     *   });
     */
  }
}
