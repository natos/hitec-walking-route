#!/bin/bash

echo -e "\033[0;32mConfiguring deployment to GitHub...\033[0m"

# Create a new orphand branch (no commit history) named gh-pages
git checkout --orphan gh-pages

# Unstage all files
git rm --cached $(git ls-files)

# Grab one file from the master branch so we can make a commit
git checkout master README.md

# Add and commit that file
git add .
git commit -m "initial commit on gh-pages branch"

# Push to remote gh-pages branch
git push origin gh-pages

# Return to master branch
git checkout master

# Remove the public folder to make room for the gh-pages subtree
rm -rf app

git add .
git commit -m "Cleaning"

# Add the gh-pages branch of the repository. It will look like a folder named public
git subtree add --prefix=app git@github.com:Spaaza/hitec-walking-route.git gh-pages --squash

# Pull down the file we just committed. This helps avoid merge conflicts
git subtree pull --prefix=app git@github.com:Spaaza/hitec-walking-route.git gh-pages

# Add everything
git add -A

# Commit and push to master
git commit -m "Updating site" && git push origin master

# Push the public subtree to the gh-pages branch
git subtree push --prefix=app git@github.com:Spaaza/hitec-walking-route.git gh-pages
