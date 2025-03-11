import { Construct } from "constructs";
import {
  aws_apigateway as apigateway,
  aws_s3 as s3,
  aws_iam as iam,
  aws_logs as logs,
  aws_wafv2 as wafv2,
  Duration,
  RemovalPolicy,
  Tags,
} from "aws-cdk-lib";
import { Lambda } from "../constructs/lambda";
import { WafConstruct } from "../constructs/waf";
import { DynamoDBTableIdentifiers } from "../constructs/dynamodb-table";
import { isLocalStack } from "../local/util";
import { CloudWatchToS3 } from "../constructs/cloudwatch-to-s3";
import { addIamPropertiesToBucketAutoDeleteRole } from "../utils/s3";

interface CreateApiComponentsProps {
  scope: Construct;
  stage: string;
  project: string;
  isDev: boolean;
  tables: DynamoDBTableIdentifiers[];
  iamPermissionsBoundary: iam.IManagedPolicy;
  iamPath: string;
}

export function createApiComponents(props: CreateApiComponentsProps) {
  const {
    scope,
    stage,
    project,
    isDev,
    tables,
    iamPermissionsBoundary,
    iamPath,
  } = props;

  const service = "app-api";
  Tags.of(scope).add("SERVICE", service);

  const logGroup = new logs.LogGroup(scope, "ApiAccessLogs", {
    removalPolicy: isDev ? RemovalPolicy.DESTROY : RemovalPolicy.RETAIN,
  });

  const api = new apigateway.RestApi(scope, "ApiGatewayRestApi", {
    restApiName: `${stage}-app-api`,
    deploy: true,
    cloudWatchRole: false,
    deployOptions: {
      stageName: stage,
      tracingEnabled: true,
      loggingLevel: apigateway.MethodLoggingLevel.INFO,
      dataTraceEnabled: true,
      metricsEnabled: false,
      throttlingBurstLimit: 5000,
      throttlingRateLimit: 10000.0,
      cachingEnabled: false,
      cacheTtl: Duration.seconds(300),
      cacheDataEncrypted: false,
      accessLogDestination: new apigateway.LogGroupLogDestination(logGroup),
      accessLogFormat: apigateway.AccessLogFormat.custom(
        "requestId: $context.requestId, ip: $context.identity.sourceIp, " +
          "caller: $context.identity.caller, user: $context.identity.user, " +
          "requestTime: $context.requestTime, httpMethod: $context.httpMethod, " +
          "resourcePath: $context.resourcePath, status: $context.status, " +
          "protocol: $context.protocol, responseLength: $context.responseLength"
      ),
    },
    defaultCorsPreflightOptions: {
      allowOrigins: apigateway.Cors.ALL_ORIGINS,
      allowMethods: apigateway.Cors.ALL_METHODS,
    },
  });

  api.addGatewayResponse("Default4XXResponse", {
    type: apigateway.ResponseType.DEFAULT_4XX,
    responseHeaders: {
      "Access-Control-Allow-Origin": "'*'",
      "Access-Control-Allow-Headers": "'*'",
    },
  });

  api.addGatewayResponse("Default5XXResponse", {
    type: apigateway.ResponseType.DEFAULT_5XX,
    responseHeaders: {
      "Access-Control-Allow-Origin": "'*'",
      "Access-Control-Allow-Headers": "'*'",
    },
  });

  const environment = {
    STAGE: stage,
    ...Object.fromEntries(
      tables.map((table) => [`${table.id}Table`, table.name])
    ),
  };

  const additionalPolicies = [
    new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        "dynamodb:DeleteItem",
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:Query",
      ],
      resources: tables.map((table) => table.arn),
    }),
  ];

  const commonProps = {
    stackName: `${service}-${stage}`,
    api,
    environment,
    additionalPolicies,
    iamPermissionsBoundary: iamPermissionsBoundary,
    iamPath: iamPath,
  };

  new Lambda(scope, "createBanner", {
    entry: "services/app-api/handlers/banners/create.ts",
    handler: "createBanner",
    path: "banners/{bannerId}",
    method: "POST",
    ...commonProps,
  });

  new Lambda(scope, "deleteBanner", {
    entry: "services/app-api/handlers/banners/delete.ts",
    handler: "deleteBanner",
    path: "banners/{bannerId}",
    method: "DELETE",
    ...commonProps,
  });

  new Lambda(scope, "fetchBanner", {
    entry: "services/app-api/handlers/banners/fetch.ts",
    handler: "fetchBanner",
    path: "banners/{bannerId}",
    method: "GET",
    ...commonProps,
  });

  new Lambda(scope, "createReport", {
    entry: "services/app-api/handlers/reports/create.ts",
    handler: "createReport",
    path: "reports/{reportType}/{state}",
    method: "POST",
    ...commonProps,
  });

  new Lambda(scope, "updateReport", {
    entry: "services/app-api/handlers/reports/update.ts",
    handler: "updateReport",
    path: "reports/{reportType}/{state}/{id}",
    method: "PUT",
    ...commonProps,
  });

  new Lambda(scope, "submitReport", {
    entry: "services/app-api/handlers/reports/submit.ts",
    handler: "submitReport",
    path: "reports/submit/{reportType}/{state}/{id}",
    method: "POST",
    ...commonProps,
  });

  new Lambda(scope, "getReport", {
    entry: "services/app-api/handlers/reports/get.ts",
    handler: "getReport",
    path: "reports/{reportType}/{state}/{id}",
    method: "GET",
    ...commonProps,
  });

  new Lambda(scope, "getReportsForState", {
    entry: "services/app-api/handlers/reports/get.ts",
    handler: "getReportsForState",
    path: "reports/{reportType}/{state}",
    method: "GET",
    ...commonProps,
  });

  if (!isLocalStack) {
    const waf = new WafConstruct(
      scope,
      "ApiWafConstruct",
      {
        name: `${project}-${stage}-${service}`,
        blockRequestBodyOver8KB: false,
      },
      "REGIONAL"
    );

    new wafv2.CfnWebACLAssociation(scope, "WebACLAssociation", {
      resourceArn: api.deploymentStage.stageArn,
      webAclArn: waf.webAcl.attrArn,
    });

    if (!isDev) {
      const logBucket = new s3.Bucket(scope, "WafLogBucket", {
        encryption: s3.BucketEncryption.S3_MANAGED,
        blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
        removalPolicy: RemovalPolicy.RETAIN,
        enforceSSL: true,
      });

      new CloudWatchToS3(scope, "CloudWatchToS3Construct", {
        logGroup: waf.logGroup,
        bucket: logBucket,
        iamPermissionsBoundary: iamPermissionsBoundary,
        iamPath: iamPath,
      });
    }
  }

  addIamPropertiesToBucketAutoDeleteRole(
    scope,
    iamPermissionsBoundary.managedPolicyArn,
    iamPath
  );

  return {
    restApiId: api.restApiId,
    apiGatewayRestApiUrl: api.url.slice(0, -1),
  };
}
