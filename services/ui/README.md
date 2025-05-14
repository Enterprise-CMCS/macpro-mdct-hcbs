# ui

## Configuration - AWS Secrets Manager

Look in `deployment/deployment-config.ts` and look at the `DeploymentConfigProperties` interface which should give you a sense of which values are being injected into the app. The values must either be in `hcbs-default` secret or `hcbs-STAGE` to be picked up. The secrets are json objects so they contain multiple values each.

No values should be specified in both secrets. Just don't do it. Ok if that did ever happen the stage value would supercede. But really I promise you don't need it.
