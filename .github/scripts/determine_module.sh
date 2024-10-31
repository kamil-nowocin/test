#!/bin/bash

initialize_module_settings() {
    TEST_MODULE="$1"
    GRADLE_TASK="$TEST_MODULE:test"
    TEST_MODULES=("$TEST_MODULE")
}

if [[ "$GITHUB_EVENT_NAME" == "schedule" ]]; then
    CURRENT_TIME=$((10#$(date -u +"%H%M")))
    case $CURRENT_TIME in
        133[0-9]|135[0-5]) initialize_module_settings "WFE_Websters" ;;
        140[0-9]|142[0-5]) initialize_module_settings "WFE_Klasters" ;;
    *)
        echo "No matching time found for $CURRENT_TIME! Exiting..."
        exit 1
        ;;
    esac
elif [[ "$GITHUB_EVENT_NAME" == "workflow_dispatch" ]]; then
    TEST_MODULE="$GITHUB_INPUTS_TEST_MODULE"
    if [[ "$TEST_MODULE" == "WFE_All" ]]; then
        GRADLE_TASK="test"
        TEST_MODULES=("WFE_Websters" "WFE_Klasters")
    else
        initialize_module_settings "$TEST_MODULE"
    fi
else
    echo "This workflow was triggered by an unsupported event! Exiting..."
    exit 1
fi

{
    echo "TEST_MODULE=$TEST_MODULE"
    echo "GRADLE_TASK=$GRADLE_TASK"
    echo "TEST_MODULES=${TEST_MODULES[*]}"
} >>"$GITHUB_ENV"

echo "Selected frontend module: $TEST_MODULE"
