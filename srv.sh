#!/bin/bash
set -e
ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $ROOT
if [ ! -f package.json ]; then
  cd repository
fi
git pull
yarn install --non-interactive
yarn production
