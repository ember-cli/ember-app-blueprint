#!/usr/bin/env bash
# Automates "Initial Stable Release from the `release` branch" in RELEASE.md.
# Safe to re-run: each step skips itself when its work is already done.
#
# Usage: scripts/promote-beta.sh [major.minor]   (default: from release-plan-X-Y branch name)
set -o errexit -o nounset -o pipefail

repo=ember-cli/ember-app-blueprint
cd "$(git rev-parse --show-toplevel)"

version=${1:-}
if [[ -z $version && $(git branch --show-current) =~ ^release-plan-([0-9]+)-([0-9]+)$ ]]; then
  version="${BASH_REMATCH[1]}.${BASH_REMATCH[2]}"
fi
[[ $version =~ ^([0-9]+)\.([0-9]+)$ ]] || { echo "usage: $0 <major.minor>" >&2; exit 1; }
major=${BASH_REMATCH[1]} minor=${BASH_REMATCH[2]}
branch="release-plan-$major-$minor"

# Only release-plan's workflows may change these on the release branch.
protected=(
  .release-plan.json
  .github/workflows/plan-stable-release.yml
  .github/workflows/publish.yml
  CHANGELOG.md
)

git fetch origin

if git show-ref --verify --quiet "refs/heads/$branch"; then
  git switch "$branch"
else
  git switch --no-track --create "$branch" origin/release
fi

if git merge-base --is-ancestor origin/beta HEAD; then
  echo "origin/beta is already merged"
else
  if ! git rev-parse --quiet --verify MERGE_HEAD >/dev/null; then
    git merge origin/beta --no-ff --no-commit || true
  fi

  for path in "${protected[@]}"; do
    if git rev-parse --quiet --verify "HEAD:$path" >/dev/null; then
      git restore --source=HEAD --staged --worktree -- "$path"
    else
      git rm --quiet --force --ignore-unmatch -- "$path"
    fi
  done

  if git diff --name-only --diff-filter=U | grep --quiet --line-regexp package.json; then
    echo "Resolve the package.json conflict, 'git add' it, then run this script again." >&2
    exit 1
  fi

  # release-plan owns the version, and a stable release must not have the prerelease config.
  stable_version=$(git show HEAD:package.json | jq --raw-output .version)
  jq --arg v "$stable_version" '.version = $v | del(."release-plan")' package.json > package.json.tmp
  mv package.json.tmp package.json
  git add package.json

  conflicts=$(git diff --name-only --diff-filter=U)
  if [[ -n $conflicts ]]; then
    printf 'Resolve these conflicts, "git add" them, then run this script again:\n%s\n' "$conflicts" >&2
    exit 1
  fi

  git commit --no-edit
fi

pnpm dlx update-blueprint-deps --filter 'ember-source' --tag latest package.json files/package.json
pnpm dlx update-blueprint-deps --filter '.*' package.json files/package.json
if git diff --quiet; then
  echo "blueprint dependencies are already at latest"
else
  git commit --all --message "update blueprint dependencies to latest"
fi

git push --set-upstream origin "$branch"

if ((minor == 0)); then label=breaking; else label=enhancement; fi

pr=$(gh pr list --repo "$repo" --head "$branch" --base release --state open --json url --jq '.[0].url')
if [[ -z $pr ]]; then
  pr=$(gh pr create --repo "$repo" --base release --head "$branch" --label "$label" \
    --title "Promote Beta and update all dependencies for $major.$minor release" \
    --body "Merges \`beta\` into \`release\` and updates all blueprint dependencies to latest, for the $major.$minor release.")
else
  gh pr edit "$pr" --repo "$repo" --add-label "$label" >/dev/null
fi

echo "$pr"
