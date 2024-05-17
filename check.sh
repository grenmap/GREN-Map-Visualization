#!/bin/bash

# check if ng (Angular CLI) is available
if ! command -v ng >/dev/null ; then
    echo "Please install the Angular CLI: npm install -g @angular/cli"
    exit 1
fi

# check if chrome or chromium are available
CHROME_PATH=$(command -v chrome)
CHROMIUM_PATH=$(command -v chromium)
GOOGLE_CHROME_PATH=$(command -v 'Google Chrome')

if [ -z $CHROME_PATH ] && [ -z $CHROMIUM_PATH ] && [ -z $GOOGLE_CHROME_PATH ] ; then
    echo -n "The Angular tests require Google Chrome or Chromium. "
    echo "Please install one of them."
    echo "Make sure the directory containing it is in your PATH."
    exit 1
elif [ -z $GOOGLE_CHROME_PATH ] && [ -z $CHROME_PATH ] ; then
    # chromium is available
    export CHROME_BIN=$CHROMIUM_PATH
elif [ -z $GOOGLE_CHROME_PATH ] && [ -z $CHROMIUM_PATH ] ; then
    # "chrome" is available
    export CHROME_BIN=$CHROMIUM_PATH
else
    # "Google Chrome" is available
    export CHROME_BIN=$CHROME_PATH
fi

# run ng lint
ng lint
readonly NG_LINT_STATUS=$?

# run unit tests
ng test
readonly NG_TEST_STATUS=$?

if [ "$NG_LINT_STATUS" -gt "0" ] && [ "$NG_TEST_STATUS" -gt "0" ] ; then
    echo -n "Please fix the linter and the unit test errors "
    echo "before submitting a pull request."
    exit 1
fi

if [ "$NG_LINT_STATUS" -gt "0" ] ; then
    echo "Please fix the linter errors before submitting a pull request."
    exit 1
fi

if [ "$NG_TEST_STATUS" -gt "0" ] ; then
    echo "Please fix the unit tests errors before submitting a pull request."
    exit 1
fi

echo "Flake8 and unit tests ok."
