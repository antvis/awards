#!/usr/bin/env sh

rm -rf ./dist

npm version patch -m "Upgrade to %s"

npm run test
npm run build
npm run readme

cp ./package.json ./dist/package.json
cp ./README.md ./dist/README.md

cd ./dist
npm publish