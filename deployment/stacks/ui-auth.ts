import { Construct } from "constructs";
import {
  aws_cognito as cognito,
  aws_iam as iam,
  aws_lambda as lambda,
  aws_lambda_nodejs as lambda_nodejs,
  aws_wafv2 as wafv2,
  Duration,
  custom_resources as cr,
  RemovalPolicy,
} from "aws-cdk-lib";
import { WafConstruct } from "../constructs/waf";
import { IManagedPolicy } from "aws-cdk-lib/aws-iam";
import { isLocalStack } from "../local/util";

interface CreateUiAuthComponentsProps {
  scope: Construct;
  project: string;
  stage: string;
  isDev: boolean;
  applicationEndpointUrl: string;
  customResourceRole: iam.Role;
  iamPath: string;
  iamPermissionsBoundary: IManagedPolicy;
  oktaMetadataUrl: string;
  bootstrapUsersPassword?: string;
  secureCloudfrontDomainName?: string;
  userPoolDomainPrefix?: string;
}

export function createUiAuthComponents(props: CreateUiAuthComponentsProps) {
  const {
    scope,
    project,
    stage,
    isDev,
    applicationEndpointUrl,
    customResourceRole,
    iamPath,
    iamPermissionsBoundary,
    oktaMetadataUrl,
    bootstrapUsersPassword,
    secureCloudfrontDomainName,
    userPoolDomainPrefix,
  } = props;

  const userPool = new cognito.UserPool(scope, "UserPool", {
    userPoolName: `${stage}-user-pool`,
    signInAliases: {
      email: true,
    },
    autoVerify: {
      email: true,
    },
    selfSignUpEnabled: false,
    standardAttributes: {
      givenName: {
        required: true,
        mutable: true,
      },
      familyName: {
        required: true,
        mutable: true,
      },
    },
    customAttributes: {
      cms_roles: new cognito.StringAttribute({
        mutable: true,
      }),
      cms_state: new cognito.StringAttribute({
        mutable: true,
        minLen: 0,
        maxLen: 256,
      }),
    },
    // advancedSecurityMode: cognito.AdvancedSecurityMode.ENFORCED, DEPRECATED WE NEED FEATURE_PLAN.plus if we want to use StandardThreatProtectionMode.FULL_FUNCTION which I think is the new way to do this
    removalPolicy: isDev ? RemovalPolicy.DESTROY : RemovalPolicy.RETAIN,
  });

  const cfnUserPool = userPool.node.defaultChild as cognito.CfnUserPool;
  cfnUserPool.adminCreateUserConfig = {
    allowAdminCreateUserOnly: true,
  };

  let supportedIdentityProviders:
    | cognito.UserPoolClientIdentityProvider[]
    | undefined = undefined;
  let oktaIdp: cognito.CfnUserPoolIdentityProvider | undefined = undefined;

  const providerName = "Okta";

  oktaIdp = new cognito.CfnUserPoolIdentityProvider(
    scope,
    "CognitoUserPoolIdentityProvider",
    {
      providerName,
      providerType: "SAML",
      userPoolId: userPool.userPoolId,
      providerDetails: {
        MetadataURL: oktaMetadataUrl,
      },
      attributeMapping: {
        email:
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress",
        family_name:
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname",
        given_name:
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname",
        "custom:cms_roles": "cms_roles",
        "custom:cms_state": "cms_state",
      },
      idpIdentifiers: ["IdpIdentifier"],
    }
  );

  supportedIdentityProviders = [
    cognito.UserPoolClientIdentityProvider.custom(providerName),
  ];

  const appUrl =
    secureCloudfrontDomainName ||
    applicationEndpointUrl ||
    "https://localhost:3000/";
  const userPoolClient = new cognito.UserPoolClient(scope, "UserPoolClient", {
    userPoolClientName: `${stage}-user-pool-client`,
    userPool,
    authFlows: {
      userPassword: true,
    },
    oAuth: {
      flows: {
        implicitCodeGrant: true,
      },
      scopes: [
        cognito.OAuthScope.EMAIL,
        cognito.OAuthScope.OPENID,
        cognito.OAuthScope.PROFILE,
      ],
      callbackUrls: [appUrl],
      defaultRedirectUri: appUrl,
      logoutUrls: [appUrl, `${appUrl}postLogout`],
    },
    accessTokenValidity: Duration.minutes(30),
    idTokenValidity: Duration.minutes(30),
    refreshTokenValidity: Duration.hours(24),
    supportedIdentityProviders,
    generateSecret: false,
  });

  userPoolClient.node.addDependency(oktaIdp);

  (
    userPoolClient.node.defaultChild as cognito.CfnUserPoolClient
  ).addPropertyOverride("ExplicitAuthFlows", ["ADMIN_NO_SRP_AUTH"]);

  const userPoolDomain = new cognito.UserPoolDomain(scope, "UserPoolDomain", {
    userPool,
    cognitoDomain: {
      domainPrefix:
        userPoolDomainPrefix || `${project}-${stage}-login-user-pool-client`,
    },
  });

  const identityPool = new cognito.CfnIdentityPool(
    scope,
    "CognitoIdentityPool",
    {
      identityPoolName: `${stage}IdentityPool`,
      allowUnauthenticatedIdentities: false,
      cognitoIdentityProviders: [
        {
          clientId: userPoolClient.userPoolClientId,
          providerName: userPool.userPoolProviderName,
        },
      ],
    }
  );

  const cognitoAuthRole = new iam.Role(scope, "CognitoAuthRole", {
    permissionsBoundary: iamPermissionsBoundary,
    path: iamPath,
    assumedBy: new iam.FederatedPrincipal(
      "cognito-identity.amazonaws.com",
      {
        StringEquals: {
          "cognito-identity.amazonaws.com:aud": identityPool.ref,
        },
        "ForAnyValue:StringLike": {
          "cognito-identity.amazonaws.com:amr": "authenticated",
        },
      },
      "sts:AssumeRoleWithWebIdentity"
    ),
    inlinePolicies: {
      CognitoAuthorizedPolicy: new iam.PolicyDocument({
        statements: [
          new iam.PolicyStatement({
            actions: [
              "mobileanalytics:PutEvents",
              "cognito-sync:*",
              "cognito-identity:*",
            ],
            resources: ["*"],
            effect: iam.Effect.ALLOW,
          }),
        ],
      }),
    },
  });

  new cognito.CfnIdentityPoolRoleAttachment(scope, "CognitoIdentityPoolRoles", {
    identityPoolId: identityPool.ref,
    roles: { authenticated: cognitoAuthRole.roleArn },
  });

  let bootstrapUsersFunction;

  if (bootstrapUsersPassword) {
    const lambdaApiRole = new iam.Role(scope, "BootstrapUsersLambdaApiRole", {
      permissionsBoundary: iamPermissionsBoundary,
      path: iamPath,
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          "service-role/AWSLambdaVPCAccessExecutionRole"
        ),
      ],
      inlinePolicies: {
        LambdaApiRolePolicy: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              actions: [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents",
              ],
              resources: ["arn:aws:logs:*:*:*"],
              effect: iam.Effect.ALLOW,
            }),
            new iam.PolicyStatement({
              actions: ["*"],
              resources: [userPool.userPoolArn],
              effect: iam.Effect.ALLOW,
            }),
          ],
        }),
      },
    });

    // TODO: test deploy and watch performance with scope using lambda.Function vs lambda_nodejs.NodejsFunction
    bootstrapUsersFunction = new lambda_nodejs.NodejsFunction(
      scope,
      "bootstrapUsers",
      {
        entry: "services/ui-auth/handlers/createUsers.js",
        handler: "handler",
        runtime: lambda.Runtime.NODEJS_20_X,
        timeout: Duration.seconds(60),
        role: lambdaApiRole,
        environment: {
          userPoolId: userPool.userPoolId,
          bootstrapUsersPassword,
        },
      }
    );
  }

  if (!isLocalStack) {
    const webAcl = new WafConstruct(
      scope,
      "CognitoWafConstruct",
      { name: `${project}-${stage}-ui-auth` },
      "REGIONAL"
    ).webAcl;

    new wafv2.CfnWebACLAssociation(scope, "CognitoUserPoolWAFAssociation", {
      resourceArn: userPool.userPoolArn,
      webAclArn: webAcl.attrArn,
    });
  }

  if (bootstrapUsersFunction) {
    const bootstrapUsersInvoke = new cr.AwsCustomResource(
      scope,
      "InvokeBootstrapUsersFunction",
      {
        onCreate: {
          service: "Lambda",
          action: "invoke",
          parameters: {
            FunctionName: bootstrapUsersFunction.functionName,
            InvocationType: "Event",
            Payload: JSON.stringify({}),
          },
          physicalResourceId: cr.PhysicalResourceId.of(
            `InvokeBootstrapUsersFunction-${stage}`
          ),
        },
        onUpdate: undefined,
        onDelete: undefined,
        policy: cr.AwsCustomResourcePolicy.fromStatements([
          new iam.PolicyStatement({
            actions: ["lambda:InvokeFunction"],
            resources: [bootstrapUsersFunction.functionArn],
          }),
        ]),
        role: customResourceRole,
        resourceType: "Custom::InvokeBootstrapUsersFunction",
      }
    );

    bootstrapUsersInvoke.node.addDependency(bootstrapUsersFunction);
  }

  return {
    userPoolDomainName: userPoolDomain.domainName,
    identityPoolId: identityPool.ref,
    userPoolId: userPool.userPoolId,
    userPoolClientId: userPoolClient.userPoolClientId,
    cognitoAuthRole: cognitoAuthRole,
  };
}
