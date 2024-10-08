#!/bin/bash

if [[ "$GITHUB_EVENT_NAME" == "schedule" ]]; then
  CURRENT_TIME=$((10#$(date -u +"%H%M")))
  if [[ "$CURRENT_TIME" -ge 755 && "$CURRENT_TIME" -lt 815 ]]; then
    BACKEND_MODULE="WFE_Websters"
    GRADLE_TASK="$BACKEND_MODULE:test"
    TEST_MODULES=("$BACKEND_MODULE")
  elif [[ "$CURRENT_TIME" -ge 820 && "$CURRENT_TIME" -lt 840 ]]; then
    BACKEND_MODULE="WFE_Klasters"
    GRADLE_TASK="$BACKEND_MODULE:test"
    TEST_MODULES=("$BACKEND_MODULE")
  else
    echo "No matching time found for $CURRENT_TIME! Exiting..."
    exit 1
  fi
elif [[ "$GITHUB_EVENT_NAME" == "workflow_dispatch" ]]; then
  BACKEND_MODULE="$GITHUB_INPUTS_MODULE"
  if [[ "$BACKEND_MODULE" == "WFE_All" ]]; then
    GRADLE_TASK="test"
    TEST_MODULES=("WFE_Websters" "WFE_Klasters")
  else
    GRADLE_TASK="$BACKEND_MODULE:test"
    TEST_MODULES=("$BACKEND_MODULE")
  fi
else
  echo "This workflow was triggered by an unsupported event! Exiting..."
  exit 1
fi

{
  echo "BACKEND_MODULE=$BACKEND_MODULE"
  echo "GRADLE_TASK=$GRADLE_TASK"
  echo "TEST_MODULES=${TEST_MODULES[*]}"
} >> "$GITHUB_ENV"

echo "Selected backend module: $BACKEND_MODULE"
