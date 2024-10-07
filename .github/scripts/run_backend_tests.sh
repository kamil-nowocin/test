#!/bin/bash

GRADLE_COMMAND="./gradlew $GRADLE_TASK \
-DruntimeEnvironment='CICD' \
-DbackendEnvironment='${FRONTEND_ENVIRONMENT%% *}' \
-DenableTestRetry='$ENABLE_TEST_RETRY' \
-DenableXrayReport='$ENABLE_XRAY_REPORT' \
-DenableSlackReport='$ENABLE_SLACK_REPORT'"

if [[ -n "$GITHUB_EVENT_INPUTS_TEST_GROUP" && "$GITHUB_EVENT_INPUTS_TEST_GROUP" != "ALL" ]]; then
  GRADLE_COMMAND="$GRADLE_COMMAND -Dgroups='$GITHUB_EVENT_INPUTS_TEST_GROUP'"
fi

echo "Executing command: $GRADLE_COMMAND"
eval "$GRADLE_COMMAND"
