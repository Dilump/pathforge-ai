#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# PathForge AI — Lambda Deployment Script
# Packages and deploys all three Lambda functions to AWS.
#
# PREREQUISITES (run these once first):
#   1. Install AWS CLI:   https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html
#   2. Configure CLI:     aws configure   (enter your AWS Access Key ID, Secret, region: us-east-1)
#   3. Install Node.js:   https://nodejs.org/ (v18 or v20)
#
# USAGE:
#   chmod +x deploy-lambdas.sh
#   ./deploy-lambdas.sh
#
# WHAT THIS DOES:
#   1. Creates IAM role for Lambda (if not exists)
#   2. Attaches Bedrock permissions to the role
#   3. Packages each Lambda function into a zip
#   4. Creates or updates the Lambda function on AWS
#   5. Creates API Gateway with three routes
#   6. Prints the API Gateway URL — paste this into Amplify as VITE_API_BASE_URL
# ─────────────────────────────────────────────────────────────────────────────

set -e

REGION="us-east-1"
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ROLE_NAME="pathforge-lambda-bedrock-role"
ROLE_ARN="arn:aws:iam::${ACCOUNT_ID}:role/${ROLE_NAME}"
API_NAME="pathforge-ai-api"

echo ""
echo "╔══════════════════════════════════════════════════╗"
echo "║   PathForge AI — AWS Lambda Deployment           ║"
echo "║   Account: ${ACCOUNT_ID}                         ║"
echo "║   Region:  ${REGION}                             ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""

# ── Step 1: Create IAM role ──────────────────────────────────────────────────
echo "▶ Step 1/5: Setting up IAM role..."

TRUST_POLICY='{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": { "Service": "lambda.amazonaws.com" },
    "Action": "sts:AssumeRole"
  }]
}'

# Create role if it doesn't exist
if ! aws iam get-role --role-name "$ROLE_NAME" > /dev/null 2>&1; then
  aws iam create-role \
    --role-name "$ROLE_NAME" \
    --assume-role-policy-document "$TRUST_POLICY" \
    --description "PathForge AI Lambda role with Bedrock access" > /dev/null
  echo "  ✓ IAM role created"
else
  echo "  ✓ IAM role already exists"
fi

# Attach AWS managed policies
aws iam attach-role-policy \
  --role-name "$ROLE_NAME" \
  --policy-arn "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole" 2>/dev/null || true

# Attach inline Bedrock policy
BEDROCK_POLICY='{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": ["bedrock:InvokeModel"],
    "Resource": "*"
  }]
}'

aws iam put-role-policy \
  --role-name "$ROLE_NAME" \
  --policy-name "BedrockInvokePolicy" \
  --policy-document "$BEDROCK_POLICY"
echo "  ✓ Bedrock permissions attached"

# Wait for role propagation
echo "  ⏳ Waiting 10s for IAM role to propagate..."
sleep 10

# ── Step 2: Package Lambda functions ────────────────────────────────────────
echo ""
echo "▶ Step 2/5: Packaging Lambda functions..."

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
LAMBDA_DIR="${SCRIPT_DIR}/lambda"
BUILD_DIR="${SCRIPT_DIR}/../.lambda-build"
mkdir -p "$BUILD_DIR"

for FUNC in coach roadmap quiz; do
  echo "  📦 Packaging: pathforge-${FUNC}"
  cd "${LAMBDA_DIR}/${FUNC}"
  npm install --omit=dev --silent
  zip -r "${BUILD_DIR}/pathforge-${FUNC}.zip" . > /dev/null
  cd "$SCRIPT_DIR"
  echo "  ✓ ${FUNC} packaged → .lambda-build/pathforge-${FUNC}.zip"
done

# ── Step 3: Deploy Lambda functions ─────────────────────────────────────────
echo ""
echo "▶ Step 3/5: Deploying Lambda functions..."

deploy_lambda() {
  local FUNC_NAME=$1
  local ZIP_FILE=$2
  local HANDLER=$3

  if aws lambda get-function --function-name "$FUNC_NAME" --region "$REGION" > /dev/null 2>&1; then
    echo "  🔄 Updating: ${FUNC_NAME}"
    aws lambda update-function-code \
      --function-name "$FUNC_NAME" \
      --zip-file "fileb://${ZIP_FILE}" \
      --region "$REGION" > /dev/null
  else
    echo "  🚀 Creating: ${FUNC_NAME}"
    aws lambda create-function \
      --function-name "$FUNC_NAME" \
      --runtime "nodejs20.x" \
      --role "$ROLE_ARN" \
      --handler "$HANDLER" \
      --zip-file "fileb://${ZIP_FILE}" \
      --timeout 30 \
      --memory-size 512 \
      --region "$REGION" > /dev/null
  fi
  echo "  ✓ ${FUNC_NAME} deployed"
}

deploy_lambda "pathforge-coach"   "${BUILD_DIR}/pathforge-coach.zip"   "index.handler"
deploy_lambda "pathforge-roadmap" "${BUILD_DIR}/pathforge-roadmap.zip" "index.handler"
deploy_lambda "pathforge-quiz"    "${BUILD_DIR}/pathforge-quiz.zip"    "index.handler"

# ── Step 4: Create API Gateway ───────────────────────────────────────────────
echo ""
echo "▶ Step 4/5: Setting up API Gateway..."

# Check if API already exists
EXISTING_API=$(aws apigatewayv2 get-apis --region "$REGION" \
  --query "Items[?Name=='${API_NAME}'].ApiId" --output text 2>/dev/null)

if [ -z "$EXISTING_API" ]; then
  API_ID=$(aws apigatewayv2 create-api \
    --name "$API_NAME" \
    --protocol-type HTTP \
    --cors-configuration \
      AllowOrigins='["*"]',AllowMethods='["POST","OPTIONS"]',AllowHeaders='["Content-Type","Authorization"]' \
    --region "$REGION" \
    --query ApiId --output text)
  echo "  ✓ API Gateway created: ${API_ID}"
else
  API_ID=$EXISTING_API
  echo "  ✓ API Gateway already exists: ${API_ID}"
fi

# Create integrations and routes for each Lambda
create_route() {
  local FUNC_NAME=$1
  local ROUTE_PATH=$2

  FUNC_ARN="arn:aws:lambda:${REGION}:${ACCOUNT_ID}:function:${FUNC_NAME}"

  INTEGRATION_ID=$(aws apigatewayv2 create-integration \
    --api-id "$API_ID" \
    --integration-type AWS_PROXY \
    --integration-uri "$FUNC_ARN" \
    --payload-format-version "2.0" \
    --region "$REGION" \
    --query IntegrationId --output text 2>/dev/null || echo "exists")

  if [ "$INTEGRATION_ID" != "exists" ]; then
    aws apigatewayv2 create-route \
      --api-id "$API_ID" \
      --route-key "POST ${ROUTE_PATH}" \
      --target "integrations/${INTEGRATION_ID}" \
      --region "$REGION" > /dev/null 2>/dev/null || true

    # Grant API Gateway permission to invoke Lambda
    aws lambda add-permission \
      --function-name "$FUNC_NAME" \
      --statement-id "apigateway-invoke-${FUNC_NAME}" \
      --action "lambda:InvokeFunction" \
      --principal "apigateway.amazonaws.com" \
      --source-arn "arn:aws:execute-api:${REGION}:${ACCOUNT_ID}:${API_ID}/*/*" \
      --region "$REGION" > /dev/null 2>/dev/null || true
  fi

  echo "  ✓ Route: POST ${ROUTE_PATH} → ${FUNC_NAME}"
}

create_route "pathforge-coach"   "/api/v1/ai/coach"
create_route "pathforge-roadmap" "/api/v1/ai/generate-roadmap"
create_route "pathforge-quiz"    "/api/v1/ai/generate-quiz"

# Deploy the stage
aws apigatewayv2 create-stage \
  --api-id "$API_ID" \
  --stage-name "prod" \
  --auto-deploy \
  --region "$REGION" > /dev/null 2>/dev/null || true

# ── Step 5: Print results ────────────────────────────────────────────────────
API_URL="https://${API_ID}.execute-api.${REGION}.amazonaws.com/prod"

echo ""
echo "╔══════════════════════════════════════════════════════════════════════╗"
echo "║   ✅ PathForge AI AWS Deployment Complete!                           ║"
echo "╠══════════════════════════════════════════════════════════════════════╣"
echo "║                                                                      ║"
echo "║   API Gateway URL (copy this):                                       ║"
echo "║   ${API_URL}"
echo "║                                                                      ║"
echo "║   NEXT STEP — Set this as an environment variable in Amplify:        ║"
echo "║   1. Open AWS Amplify Console → your app → App settings              ║"
echo "║   2. Go to Environment variables                                     ║"
echo "║   3. Add: VITE_API_BASE_URL = ${API_URL}"
echo "║   4. Redeploy (or push to GitHub to trigger auto-deploy)             ║"
echo "║                                                                      ║"
echo "║   Test the coach endpoint:                                           ║"
echo "║   curl -X POST ${API_URL}/api/v1/ai/coach \\"
echo "║     -H 'Content-Type: application/json' \\"
echo "║     -d '{\"message\": \"What should I focus on this week?\"}'"
echo "║                                                                      ║"
echo "╚══════════════════════════════════════════════════════════════════════╝"
echo ""
