# HCBS Database

This directory only exists to hold manual/one-time database scripts.

For deployment code, see the `deployment` directory.

For queries and updates, see the `services/app-api/storage` directory.

## How to run a database script locally

We can and should test database migration scripts against Localstack.
Doing so is just a matter of setting the correct environment variables,
and then invoking the file.

```sh
export AWS_ACCESS_KEY_ID="test"
export AWS_SECRET_ACCESS_KEY="test" # pragma: allowlist secret (lol)
export AWS_DEFAULT_REGION="us-east-1"
export AWS_ENDPOINT_URL=http://localhost.localstack.cloud:4566
export STAGE="localstack"
# ... and any other environment variables your script requires

cd services/database
npx tsx scripts/myScriptName.ts
```
