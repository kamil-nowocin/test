#!/bin/bash

mkdir -p artifacts

# Properly iterate over the elements in the array
for MODULE in "${TEST_MODULES[@]}"; do
  echo "Processing TestNG results for \"$MODULE\""
  MODULE_PATH="/home/runner/work/test/test/$MODULE/build/reports/tests/test"

  # Display MODULE_PATH for debugging purposes
  echo "MODULE_PATH: $MODULE_PATH"

  if [ -d "$MODULE_PATH" ]; then
    mkdir -p "artifacts/$MODULE"
    cp -r "$MODULE_PATH" "artifacts/$MODULE/"
  else
    echo "No TestNG results found for \"$MODULE\""
  fi
done

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
