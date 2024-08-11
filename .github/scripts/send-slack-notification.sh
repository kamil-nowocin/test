#!/bin/bash

# Fetch arguments
BUILD_RESULT=$1
PR_TITLE=$2
PR_USER=$3
REPO=$4
RUN_ID=$5

# Check if the build failed
if [ "$BUILD_RESULT" == "failure" ]; then
  curl -X POST -H 'Content-type: application/json' --data "{
    \"text\": \"❌ The Gradle build failed!\nPR: \\\"$PR_TITLE\\\" by @$PR_USER\nURL: https://github.com/$REPO/actions/runs/$RUN_ID\",
    \"username\": \"GitHub Actions\",
    \"icon_emoji\": \":warning:\"
  }" $SLACK_WEBHOOK_URL
fi
