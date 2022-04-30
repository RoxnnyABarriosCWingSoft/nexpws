#!/usr/bin/env bash

yarn
yarn run cpy-ci:loc
yarn command sfl
yarn run dev:watch
