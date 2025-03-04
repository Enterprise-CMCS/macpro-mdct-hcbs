<!-- # Import Instructions

## From `pete-sls` branch:

1. Deploy sls to get it ready for deletion with retained resources configured for import

```
./run deploy --stage <YOUR_BRANCH_NAME>
```

2. Collect information about the resources we're going to be importing into the new cdk stack.

```
cloudfront.Distribution -
cognito.UserPool -
```

3. Destroy sls

```
./run destroy --stage <YOUR_BRANCH_NAME>
```

:warning: Make sure that all sls associated stacks have been fully destroyed before proceeding.

## From `jon-cdk` branch:

1. Create just the new cdk stack without anything inside of it.

```bash
IMPORT_VARIANT=empty ./run deploy --stage <YOUR_BRANCH_NAME>
```

2. Now import all the serverless ejected resources.

```bash
IMPORT_VARIANT=imports_included PROJECT=hcbs cdk import --context stage=<YOUR_BRANCH_NAME> --force
```

As this import occurs you'll have to provide the information you gathered just before destroying the serverless stacks. For the dynamo tables the default should be correct but read closely to be sure.

3. Run a deploy on that same imported resource set.

```bash
IMPORT_VARIANT=imports_included ./run deploy --stage <YOUR_BRANCH_NAME>
```

4. Run a full deploy by kicking off the full cdk deploy.

```bash
./run deploy --stage <YOUR_BRANCH_NAME>
```

5. Find the Cloudfront Url in the Github Action's logs (or in the outputs section of your Cloudformation Stack). Visit the site and confirm that you can login and use the application.

6. Verify that the EUA login via Okta works (only applies to dev/val/prod builds) :tada: Congrats, you did it!
