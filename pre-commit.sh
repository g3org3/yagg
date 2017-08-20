#!/bin/sh
npm t
if [[ `node_modules/.bin/prettier-eslint --list-different "lib/**/*.js"` ]]; then
  exit 0;
else
  echo "Please run npm run format"
  exit 1;
fi
