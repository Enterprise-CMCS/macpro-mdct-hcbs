import { aws_ec2 as ec2, Stack } from "aws-cdk-lib";

// Restores DynamoDB access for VPC-bound lambdas after NAT Gateway removal (CLDSPT-90136).
export function addAdditionalPrerequisites(_stack: Stack, vpc: ec2.IVpc): void {
  vpc.addGatewayEndpoint("DynamoDbEndpoint", {
    service: ec2.GatewayVpcEndpointAwsService.DYNAMODB,
  });
}
