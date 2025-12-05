# Project
PROJECT=labs

# Cognito (for LocalStack)
COGNITO_IDENTITY_POOL_ID=us-east-1:8704d834-6f30-4a07-99d1-bba118fac6fc
COGNITO_USER_POOL_CLIENT_ID=1emhno4akev8hv6famjkt3i0ij
COGNITO_USER_POOL_CLIENT_DOMAIN=labs-main-login-user-pool-client
COGNITO_USER_POOL_ID=us-east-1_QXVJlucjv

REACT_APP_LD_SDK_CLIENT=op://mdct_devs/labs_secrets/REACT_APP_LD_SDK_CLIENT

# These settings are needed for playwright end-to-end tests
TEST_ADMIN_USER_EMAIL=op://mdct_devs/labs_secrets/CYPRESS_ADMIN_USER_EMAIL
TEST_ADMIN_USER_PASSWORD=op://mdct_devs/labs_secrets/CYPRESS_ADMIN_USER_PASSWORD # pragma: allowlist secret
TEST_STATE_USER_EMAIL=op://mdct_devs/labs_secrets/CYPRESS_STATE_USER_EMAIL
TEST_STATE_USER_PASSWORD=op://mdct_devs/labs_secrets/CYPRESS_STATE_USER_PASSWORD # pragma: allowlist secret
TEST_STATE=DC
