API_URL=http://localhost:3030/local
BANNER_TABLE_NAME=local-banners
COGNITO_USER_POOL_CLIENT_ID=op://mdct_devs/hcbs_secrets/COGNITO_USER_POOL_CLIENT_ID
COGNITO_USER_POOL_ID=op://mdct_devs/hcbs_secrets/COGNITO_USER_POOL_ID
POST_SIGNOUT_REDIRECT=http://localhost:3000/
DISABLE_ESLINT_PLUGIN=true
DYNAMODB_URL=http://localhost:8000
IAM_PATH=/
IAM_PERMISSIONS_BOUNDARY="bound"
LOCAL_LOGIN=true
LOGGING_BUCKET=log-bucket
S3_LOCAL_ENDPOINT=http://localhost:4569
SAR_REPORT_TABLE_NAME=local-sar-reports
SKIP_PREFLIGHT_CHECK=true

# Values used for short-circuiting ssm: lookups, most likely won't need locally
VPC_ID=local-nonsense
VPC_SUBNET_A=local-nonsense
VPC_SUBNET_B=local-nonsense
VPC_SUBNET_C=local-nonsense
BROKER_STRINGS=local-nonsense