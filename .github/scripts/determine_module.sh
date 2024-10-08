#!/bin/bash

initialize_module_settings() {
    BACKEND_MODULE="$1"
    GRADLE_TASK="$BACKEND_MODULE:test"
    TEST_MODULES=("$BACKEND_MODULE")
}

if [[ "$GITHUB_EVENT_NAME" == "schedule" ]]; then
    CURRENT_TIME=$((10#$(date -u +"%H%M")))
    case $CURRENT_TIME in
        113[0-9]|114[0-5]) initialize_module_settings "WFE_Websters" ;;
        115[0-9]|120[0-5]) initialize_module_settings "WFE_Klasters" ;;
        *)
            echo "No matching time found for $CURRENT_TIME! Exiting..."
            exit 1
            ;;
    esac
elif [[ "$GITHUB_EVENT_NAME" == "workflow_dispatch" ]]; then
    BACKEND_MODULE="$GITHUB_INPUTS_MODULE"
    if [[ "$BACKEND_MODULE" == "WFE_All" ]]; then
        GRADLE_TASK="test"
        TEST_MODULES=("WFE_Websters" "WFE_Klasters")
    else
        initialize_module_settings "$BACKEND_MODULE"
    fi
else
    echo "This workflow was triggered by an unsupported event! Exiting..."
    exit 1
fi

{
    echo "BACKEND_MODULE=$BACKEND_MODULE"
    echo "GRADLE_TASK=$GRADLE_TASK"
    echo "TEST_MODULES=${TEST_MODULES[*]}"
} >>"$GITHUB_ENV"

echo "Selected backend module: $BACKEND_MODULE"
