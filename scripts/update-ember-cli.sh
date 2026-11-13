#!/usr/bin/env bash
# Automates "Release ember-cli and update that dependency" in RELEASE.md.
# Safe to re-run: each step skips itself when its work is already done.
#
# Usage: scripts/update-ember-cli.sh
set -o errexit -o nounset -o pipefail

repo=ember-cli/ember-app-blueprint
cd "$(git rev-parse --show-toplevel)"

ember_cli=$(npm view ember-cli@latest version)
[[ $ember_cli =~ ^([0-9]+)\.([0-9]+)\. ]]
major=${BASH_REMATCH[1]} minor=${BASH_REMATCH[2]}
# The version is in the name because each release gets its own update PR.
branch="update-ember-cli-$major-$minor"

git fetch origin

if git show-ref --verify --quiet "refs/heads/$branch"; then
  git switch "$branch"
else
  git switch --no-track --create "$branch" origin/release
fi

pnpm dlx update-blueprint-deps --filter ember-cli --tag latest package.json files/package.json
pnpm install

dep_files=(package.json files/package.json pnpm-lock.yaml)
if git diff --quiet -- "${dep_files[@]}"; then
  echo "ember-cli is already at $ember_cli"
else
  git commit --message "update ember-cli dependency to latest" -- "${dep_files[@]}"
fi

if [[ -z $(git rev-list origin/release..HEAD) ]]; then
  echo "origin/release already uses ember-cli $ember_cli. Nothing to push."
  exit 0
fi

git push --set-upstream origin "$branch"

pr=$(gh pr list --repo "$repo" --head "$branch" --base release --state open --json url --jq '.[0].url')
if [[ -z $pr ]]; then
  pr=$(gh pr create --repo "$repo" --base release --head "$branch" --label bug \
    --title "Update ember-cli to $major.$minor" \
    --body "Updates the ember-cli dependency to $ember_cli.")
else
  gh pr edit "$pr" --repo "$repo" --add-label bug >/dev/null
fi

echo "$pr"
