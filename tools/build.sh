#!/bin/sh
# Copies only the files the site needs into dist/, which is what Netlify publishes
# (see netlify.toml). Source photos, the AI image backup, tools, tests and notes stay out.
#
#   sh tools/build.sh
#
# For a drag-and-drop deploy, run this and drop the dist/ folder onto Netlify.
# (Drag-and-drop doesn't deploy functions, so the concierge then runs in smart-match mode.)

set -e
cd "$(dirname "$0")/.."

rm -rf dist
mkdir -p dist
cp ./*.html _headers dist/
cp -R css js images dist/
echo "Built dist/ ($(du -sh dist | cut -f1))"
