#!/bin/bash

echo -e "\033[0;32mDeploying updates to GitHub...\033[0m"

# build the app
npm run build

# Add changes to git.
git add -A

# Commit changes.
msg="rebuilding site `date`"
if [ $# -eq 1 ]
  then msg="$1"
fi
git commit -m "$msg"

# Push source and build repos.
# git push live master
git subtree push --prefix=app git@github.com:Spaaza/hitec-walking-route.git gh-pages
