#!/usr/bin/env bash
# Automates "Beta release from the `beta` branch" in RELEASE.md.
# Safe to re-run: each step skips itself when its work is already done.
#
# Usage: scripts/promote-alpha.sh
set -o errexit -o nounset -o pipefail

repo=ember-cli/ember-app-blueprint
cd "$(git rev-parse --show-toplevel)"

git fetch origin

alpha_version=$(git show origin/main:package.json | jq --raw-output .version)
[[ $alpha_version =~ ^([0-9]+)\.([0-9]+)\.([0-9]+)-alpha\.[0-9]+$ ]] || {
  echo "Expected an alpha version on origin/main, found $alpha_version." >&2
  exit 1
}
major=${BASH_REMATCH[1]} minor=${BASH_REMATCH[2]} patch=${BASH_REMATCH[3]}
beta_version="$major.$minor.$patch-beta.0"
# The version is in the name because each release gets its own merge PR.
branch="merge-release-$major-$minor"

# Usage: merge <ref> <package.json version> [ours:<path> | theirs:<path> | theirs-on-conflict:<path>]...
#   ours / theirs:       keep the whole file from HEAD / <ref>
#   theirs-on-conflict:  merge as usual, but take <ref>'s side of each conflict
# The release-plan config in package.json always stays as it is on beta.
merge() {
  local ref=$1 version=$2 entry path source
  shift 2

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

  local release_plan
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
  git switch --no-track --create "$branch" origin/beta
fi

# Only release-plan's workflows may change these files.
merge origin/release "$(git show HEAD:package.json | jq --raw-output .version)" \
  ours:.release-plan.json \
  ours:.github/workflows/plan-beta-release.yml \
  ours:.github/workflows/publish.yml

# CHANGELOG.md must match origin/release, which the first merge brought in.
# The dependency update and pnpm install below set the ranges and the lockfile again,
# so main's side of a conflict is only a start.
merge origin/main "$beta_version" \
  ours:.release-plan.json \
  ours:CHANGELOG.md \
  theirs-on-conflict:package.json \
  theirs-on-conflict:files/package.json \
  theirs:pnpm-lock.yaml

pnpm dlx update-blueprint-deps --filter ember-source --tag beta package.json files/package.json
pnpm dlx update-blueprint-deps --filter '.*' package.json files/package.json
pnpm install

dep_files=(package.json files/package.json pnpm-lock.yaml)
if git diff --quiet -- "${dep_files[@]}"; then
  echo "blueprint dependencies are already at beta"
else
  git commit --message "update blueprint dependencies to beta" -- "${dep_files[@]}"
fi

git push --set-upstream origin "$branch"

pr=$(gh pr list --repo "$repo" --head "$branch" --base beta --state open --json url --jq '.[0].url')
if [[ -z $pr ]]; then
  pr=$(gh pr create --repo "$repo" --base beta --head "$branch" --label enhancement \
    --title "Prepare $major.$minor-beta" \
    --body "Merges \`release\` and \`main\` into \`beta\`, and updates all blueprint dependencies to beta, for the $major.$minor beta release.")
else
  gh pr edit "$pr" --repo "$repo" --add-label enhancement >/dev/null
fi

echo "$pr"
