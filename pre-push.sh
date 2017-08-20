#!/bin/sh

if [[ `node_modules/.bin/prettier-eslint --list-different "lib/**/*.js"` ]]; then
  exit 0;
else
  echo "Formatting lib/**/*.js, please commit these files"
  npm run format
  git status
fi
