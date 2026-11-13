#!/usr/bin/env bash
# Automates "Alpha release from the `main` branch" in RELEASE.md.
# Safe to re-run: each step skips itself when its work is already done.
#
# Usage: scripts/next-alpha.sh
set -o errexit -o nounset -o pipefail

repo=ember-cli/ember-app-blueprint
cd "$(git rev-parse --show-toplevel)"

git fetch origin

# Read beta, not main: main's version changes once this PR merges, beta's does not.
beta_version=$(git show origin/beta:package.json | jq --raw-output .version)
[[ $beta_version =~ ^([0-9]+)\.([0-9]+)\.[0-9]+-beta\.[0-9]+$ ]] || {
  echo "Expected a beta version on origin/beta, found $beta_version." >&2
  exit 1
}
major=${BASH_REMATCH[1]} minor=$((BASH_REMATCH[2] + 1))
alpha_version="$major.$minor.0-alpha.0"
# The version is in the name because each release gets its own merge PR.
branch="merge-beta-$major-$minor"

# Usage: merge <ref> [ours:<path> | theirs:<path> | theirs-on-conflict:<path>]...
#   ours / theirs:       keep the whole file from HEAD / <ref>
#   theirs-on-conflict:  merge as usual, but take <ref>'s side of each conflict
# The version and release-plan config in package.json always stay as they are on main.
merge() {
  local ref=$1 entry path source
  shift

  if git merge-base --is-ancestor "$ref" HEAD; then
    echo "$ref is already merged"
    return
  fi

  if ! git rev-parse --quiet --verify MERGE_HEAD >/dev/null; then
    git merge "$ref" --no-ff --no-commit || true
  fi

  for entry in "$@"; do
    path=${entry#*:}
    case $entry in
      theirs-on-conflict:*)
        if git diff --name-only --diff-filter=U | grep --quiet --line-regexp --fixed-strings "$path"; then
          local base theirs
          base=$(mktemp) theirs=$(mktemp)
          git show ":1:$path" > "$base"
          git show ":3:$path" > "$theirs"
          git show ":2:$path" > "$path"
          git merge-file --theirs "$path" "$base" "$theirs"
          rm "$base" "$theirs"
          git add "$path"
        fi
        continue
        ;;
      ours:*) source=HEAD ;;
      theirs:*) source=MERGE_HEAD ;;
    esac
    if git rev-parse --quiet --verify "$source:$path" >/dev/null; then
      git restore --source="$source" --staged --worktree -- "$path"
    else
      git rm --quiet --force --ignore-unmatch -- "$path"
    fi
  done

  if git diff --name-only --diff-filter=U | grep --quiet --line-regexp package.json; then
    echo "Resolve the package.json conflict, 'git add' it, then run this script again." >&2
    exit 1
  fi

  local version release_plan
  version=$(git show HEAD:package.json | jq --raw-output .version)
  release_plan=$(git show HEAD:package.json | jq '."release-plan"')
  jq --arg v "$version" --argjson rp "$release_plan" '.version = $v | ."release-plan" = $rp' package.json > package.json.tmp
  mv package.json.tmp package.json
  git add package.json

  local conflicts
  conflicts=$(git diff --name-only --diff-filter=U)
  if [[ -n $conflicts ]]; then
    printf 'Resolve these conflicts, "git add" them, then run this script again:\n%s\n' "$conflicts" >&2
    exit 1
  fi

  git commit --no-edit
}

if git show-ref --verify --quiet "refs/heads/$branch"; then
  git switch "$branch"
else
  git switch --no-track --create "$branch" origin/main
fi

# Only release-plan's workflows may change these files.
# The dependency update and pnpm install below set the ranges and the lockfile again,
# so beta's side of a conflict is only a start.
merge origin/beta \
  ours:.release-plan.json \
  ours:.github/workflows/plan-alpha-release.yml \
  ours:.github/workflows/publish.yml \
  theirs-on-conflict:package.json \
  theirs-on-conflict:files/package.json \
  theirs:pnpm-lock.yaml

if [[ $(jq --raw-output .version package.json) == "$alpha_version" ]]; then
  echo "package.json is already at $alpha_version"
else
  jq --arg v "$alpha_version" '.version = $v' package.json > package.json.tmp
  mv package.json.tmp package.json
  git commit --message "update to the next alpha version" -- package.json
fi

pnpm dlx update-blueprint-deps --filter ember-source --tag alpha package.json files/package.json
pnpm dlx update-blueprint-deps --filter '.*' package.json files/package.json
pnpm install

dep_files=(package.json files/package.json pnpm-lock.yaml)
if git diff --quiet -- "${dep_files[@]}"; then
  echo "blueprint dependencies are already at alpha"
else
  git commit --message "update blueprint dependencies to alpha" -- "${dep_files[@]}"
fi

git push --set-upstream origin "$branch"

pr=$(gh pr list --repo "$repo" --head "$branch" --base main --state open --json url --jq '.[0].url')
if [[ -z $pr ]]; then
  pr=$(gh pr create --repo "$repo" --base main --head "$branch" --label enhancement \
    --title "Prepare $major.$minor-alpha" \
    --body "Merges \`beta\` into \`main\`, moves to $alpha_version, and updates all blueprint dependencies to alpha.")
else
  gh pr edit "$pr" --repo "$repo" --add-label enhancement >/dev/null
fi

echo "$pr"
