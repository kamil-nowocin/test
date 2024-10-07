#!/bin/bash

mkdir -p artifacts

# Properly iterate over elements in the array
if [[ "${#TEST_MODULES[@]}" -gt 1 ]]; then
  echo "TEST_MODULES is treated as an array"
  for MODULE in "${TEST_MODULES[@]}"; do
    echo "1Processing TestNG results for \"$MODULE\""
    MODULE_PATH="/home/runner/work/test/test/$MODULE/build/reports/tests/test"

    # Display MODULE_PATH for debugging purposes
    echo "1MODULE_PATH: $MODULE_PATH"

    if [ -d "$MODULE_PATH" ]; then
      mkdir -p "artifacts/$MODULE"
      cp -r "$MODULE_PATH" "artifacts/$MODULE/"
    else
      echo "No TestNG results found for \"$MODULE\""
    fi
  done
else
  echo "TEST_MODULES is being treated as a single string"
  # If treated as a single string, iterate over space-separated values
  for MODULE in $TEST_MODULES; do
    echo "2Processing TestNG results for \"$MODULE\""
    MODULE_PATH="/home/runner/work/test/test/$MODULE/build/reports/tests/test"

    # Display MODULE_PATH for debugging purposes
    echo "2MODULE_PATH: $MODULE_PATH"

    if [ -d "$MODULE_PATH" ]; then
      mkdir -p "artifacts/$MODULE"
      cp -r "$MODULE_PATH" "artifacts/$MODULE/"
    else
      echo "No TestNG results found for \"$MODULE\""
    fi
  done
fi


#
#mkdir -p artifacts
#
#for MODULE in $TEST_MODULES; do
#  echo "Processing TestNG results for \"$MODULE\""
#  MODULE_PATH="/home/runner/work/test/test/$MODULE/build/reports/tests/test"
#  if [ -d "$MODULE_PATH" ]; then
#    mkdir -p "artifacts/$MODULE"
#    cp -r "$MODULE_PATH" "artifacts/$MODULE/"
#  else
#    echo "No TestNG results found for \"$MODULE\""
#  fi
#done
