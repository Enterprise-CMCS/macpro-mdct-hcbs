# Dynamo
BannersTable=local-banners
QmsReportsTable=local-qms-reports
TacmReportsTable=local-tacm-reports
CiReportsTable=local-ci-reports
PcpReportsTable=local-pcp-reports

DISABLE_ESLINT_PLUGIN=true

COGNITO_IDENTITY_POOL_ID=op://mdct_devs/hcbs_secrets/COGNITO_IDENTITY_POOL_ID
COGNITO_USER_POOL_CLIENT_ID=op://mdct_devs/hcbs_secrets/COGNITO_USER_POOL_CLIENT_ID
COGNITO_USER_POOL_CLIENT_DOMAIN=op://mdct_devs/hcbs_secrets/COGNITO_USER_POOL_CLIENT_DOMAIN
COGNITO_USER_POOL_ID=op://mdct_devs/hcbs_secrets/COGNITO_USER_POOL_ID
REACT_APP_LD_SDK_CLIENT=op://mdct_devs/hcbs_secrets/REACT_APP_LD_SDK_CLIENT

# These settings are needed for playwright end-to-end tests
TEST_ADMIN_USER_EMAIL=op://mdct_devs/hcbs_secrets/CYPRESS_ADMIN_USER_EMAIL
TEST_ADMIN_USER_PASSWORD=op://mdct_devs/hcbs_secrets/CYPRESS_ADMIN_USER_PASSWORD # pragma: allowlist secret
TEST_STATE_USER_EMAIL=op://mdct_devs/hcbs_secrets/CYPRESS_STATE_USER_EMAIL
TEST_STATE_USER_PASSWORD=op://mdct_devs/hcbs_secrets/CYPRESS_STATE_USER_PASSWORD # pragma: allowlist secret
TEST_STATE=DC

# db:seed
SEED_ADMIN_USER_EMAIL=op://mdct_devs/hcbs_secrets/SEED_ADMIN_USER_EMAIL
SEED_ADMIN_USER_PASSWORD=op://mdct_devs/hcbs_secrets/SEED_ADMIN_USER_PASSWORD # pragma: allowlist secret
SEED_STATE_USER_EMAIL=op://mdct_devs/hcbs_secrets/SEED_STATE_USER_EMAIL
SEED_STATE_USER_PASSWORD=op://mdct_devs/hcbs_secrets/SEED_STATE_USER_PASSWORD # pragma: allowlist secret
SEED_STATE=op://mdct_devs/hcbs_secrets/SEED_STATE
SEED_STATE_NAME=op://mdct_devs/hcbs_secrets/SEED_STATE_NAME
