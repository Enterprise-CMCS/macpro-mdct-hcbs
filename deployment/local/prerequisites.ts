#!/usr/bin/env node
import "source-map-support/register";
import { App, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";

export class LocalPrerequisiteStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
  }
}

async function main() {
  const app = new App();

  new LocalPrerequisiteStack(app, "hcbs-local-prerequisites");
}

main();
