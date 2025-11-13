# Changelog

## Release (2025-11-12)

* @ember/app-blueprint 6.10.0-alpha.4 (patch)

#### :bug: Bug Fix
* `@ember/app-blueprint`
  * [#133](https://github.com/ember-cli/ember-app-blueprint/pull/133) remove ember-auto-import from newly generated app ([@mansona](https://github.com/mansona))

#### Committers: 1
- Chris Manson ([@mansona](https://github.com/mansona))

## Release (2025-11-12)

* @ember/app-blueprint 6.10.0-alpha.3 (patch)

#### :bug: Bug Fix
* `@ember/app-blueprint`
  * [#134](https://github.com/ember-cli/ember-app-blueprint/pull/134) Restore correct version of babel-plugin-ember-template-compilation ([@ef4](https://github.com/ef4))

#### Committers: 1
- Edward Faulkner ([@ef4](https://github.com/ef4))

## Release (2025-11-07)

* @ember/app-blueprint 6.10.0-alpha.2 (patch)

#### :bug: Bug Fix
* `@ember/app-blueprint`
  * [#126](https://github.com/ember-cli/ember-app-blueprint/pull/126) [bugfix release] Add eslint parser option `project: true` ([@mkszepp](https://github.com/mkszepp))
  * [#120](https://github.com/ember-cli/ember-app-blueprint/pull/120) [bugfix release] set node version in engines to >= 20 ([@aklkv](https://github.com/aklkv))
  * [#116](https://github.com/ember-cli/ember-app-blueprint/pull/116) [bugfix release] update ember-cli version to latest stable ([@mansona](https://github.com/mansona))

#### :house: Internal
* `@ember/app-blueprint`
  * [#130](https://github.com/ember-cli/ember-app-blueprint/pull/130) Merge beta into main ([@mansona](https://github.com/mansona))
  * [#131](https://github.com/ember-cli/ember-app-blueprint/pull/131) fix warpdrive lint tests ([@mansona](https://github.com/mansona))
  * [#129](https://github.com/ember-cli/ember-app-blueprint/pull/129) Prepare Beta Release v6.9.0-beta.2 ([@github-actions[bot]](https://github.com/apps/github-actions))
  * [#122](https://github.com/ember-cli/ember-app-blueprint/pull/122) Merge release into beta ([@mansona](https://github.com/mansona))
  * [#127](https://github.com/ember-cli/ember-app-blueprint/pull/127) Prepare Stable Release v6.8.3 ([@github-actions[bot]](https://github.com/apps/github-actions))
  * [#121](https://github.com/ember-cli/ember-app-blueprint/pull/121) Prepare Stable Release v6.8.2 ([@github-actions[bot]](https://github.com/apps/github-actions))
  * [#117](https://github.com/ember-cli/ember-app-blueprint/pull/117) Prepare Stable Release v6.8.1 ([@github-actions[bot]](https://github.com/apps/github-actions))

#### Committers: 4
- Alexey Kulakov ([@aklkv](https://github.com/aklkv))
- Chris Manson ([@mansona](https://github.com/mansona))
- Markus Sanin ([@mkszepp](https://github.com/mkszepp))
- [@github-actions[bot]](https://github.com/apps/github-actions)

## Release (2025-10-31)

* @ember/app-blueprint 6.10.0-alpha.1 (minor)

#### :rocket: Enhancement
* `@ember/app-blueprint`
  * [#125](https://github.com/ember-cli/ember-app-blueprint/pull/125) Glint 2 (for `--typescript` projects) ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
  * [#124](https://github.com/ember-cli/ember-app-blueprint/pull/124) Use modern EmberData/WarpDrive ([@runspired](https://github.com/runspired))
  * [#113](https://github.com/ember-cli/ember-app-blueprint/pull/113) Prepare 6.10 alpha ([@mansona](https://github.com/mansona))

#### :memo: Documentation
* `@ember/app-blueprint`
  * [#114](https://github.com/ember-cli/ember-app-blueprint/pull/114) update RELEASE.md with notes for after ember-cli release ([@mansona](https://github.com/mansona))

#### Committers: 3
- Chris Manson ([@mansona](https://github.com/mansona))
- Chris Thoburn ([@runspired](https://github.com/runspired))
- [@NullVoxPopuli](https://github.com/NullVoxPopuli)

## Release (2025-10-14)

* @ember/app-blueprint 6.9.0-alpha.2 (minor)

#### :rocket: Enhancement
* `@ember/app-blueprint`
  * [#103](https://github.com/ember-cli/ember-app-blueprint/pull/103) [beta] update Vite to latest (v7) ([@mansona](https://github.com/mansona))
  * [#98](https://github.com/ember-cli/ember-app-blueprint/pull/98) Update deps ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
  * [#95](https://github.com/ember-cli/ember-app-blueprint/pull/95) [Beta] add services directory ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
  * [#91](https://github.com/ember-cli/ember-app-blueprint/pull/91) [bugfix beta] add legacy inspector support ([@mansona](https://github.com/mansona))

#### :bug: Bug Fix
* `@ember/app-blueprint`
  * [#100](https://github.com/ember-cli/ember-app-blueprint/pull/100) [beta] swap to the Vitest beta to fix CI ([@mansona](https://github.com/mansona))
  * [#88](https://github.com/ember-cli/ember-app-blueprint/pull/88) [bugfix beta] fix the use of ember test in the new blueprint ([@mansona](https://github.com/mansona))
  * [#86](https://github.com/ember-cli/ember-app-blueprint/pull/86) [bugfix beta] update ember-cli to beta ([@mansona](https://github.com/mansona))
  * [#82](https://github.com/ember-cli/ember-app-blueprint/pull/82) Use TypeScript way of accessing potentially undefined `podModulePrefix` ([@pichfl](https://github.com/pichfl))
  * [#78](https://github.com/ember-cli/ember-app-blueprint/pull/78) Use strict mode for all CJS files ([@simonihmig](https://github.com/simonihmig))

#### :memo: Documentation
* `@ember/app-blueprint`
  * [#97](https://github.com/ember-cli/ember-app-blueprint/pull/97) [documentation beta] update readme for Vite ([@mansona](https://github.com/mansona))
  * [#64](https://github.com/ember-cli/ember-app-blueprint/pull/64) Update the release document to match the ember-cli process ([@mansona](https://github.com/mansona))
  * [#81](https://github.com/ember-cli/ember-app-blueprint/pull/81) Correct example usage command in README ([@abeforgit](https://github.com/abeforgit))
  * [#80](https://github.com/ember-cli/ember-app-blueprint/pull/80) Fix formatting of README file ([@bertdeblock](https://github.com/bertdeblock))

#### :house: Internal
* `@ember/app-blueprint`
  * [#108](https://github.com/ember-cli/ember-app-blueprint/pull/108) update release-plan ([@mansona](https://github.com/mansona))
  * [#106](https://github.com/ember-cli/ember-app-blueprint/pull/106) Merge beta into main ([@mansona](https://github.com/mansona))
  * [#105](https://github.com/ember-cli/ember-app-blueprint/pull/105) Prepare Beta Release v6.8.0-beta.8 ([@github-actions[bot]](https://github.com/apps/github-actions))
  * [#104](https://github.com/ember-cli/ember-app-blueprint/pull/104) Merge release into beta ([@mansona](https://github.com/mansona))
  * [#102](https://github.com/ember-cli/ember-app-blueprint/pull/102) Prepare Beta Release v6.8.0-beta.7 ([@github-actions[bot]](https://github.com/apps/github-actions))
  * [#101](https://github.com/ember-cli/ember-app-blueprint/pull/101) [beta] update node version used in CI ([@mansona](https://github.com/mansona))
  * [#96](https://github.com/ember-cli/ember-app-blueprint/pull/96) Prepare Beta Release v6.8.0-beta.6 ([@github-actions[bot]](https://github.com/apps/github-actions))
  * [#93](https://github.com/ember-cli/ember-app-blueprint/pull/93) Add Windows tests ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
  * [#92](https://github.com/ember-cli/ember-app-blueprint/pull/92) Prepare Beta Release v6.8.0-beta.5 ([@github-actions[bot]](https://github.com/apps/github-actions))
  * [#89](https://github.com/ember-cli/ember-app-blueprint/pull/89) Prepare Beta Release v6.8.0-beta.4 ([@github-actions[bot]](https://github.com/apps/github-actions))
  * [#87](https://github.com/ember-cli/ember-app-blueprint/pull/87) Prepare Beta Release v6.8.0-beta.3 ([@github-actions[bot]](https://github.com/apps/github-actions))
  * [#85](https://github.com/ember-cli/ember-app-blueprint/pull/85) Prepare Stable Release v6.7.2 ([@github-actions[bot]](https://github.com/apps/github-actions))
  * [#84](https://github.com/ember-cli/ember-app-blueprint/pull/84) Prepare Beta Release v6.8.0-beta.2 ([@github-actions[bot]](https://github.com/apps/github-actions))
  * [#83](https://github.com/ember-cli/ember-app-blueprint/pull/83) update ember source to latest beta ([@mansona](https://github.com/mansona))

#### Committers: 7
- Arne Bertrand ([@abeforgit](https://github.com/abeforgit))
- Bert De Block ([@bertdeblock](https://github.com/bertdeblock))
- Chris Manson ([@mansona](https://github.com/mansona))
- Florian Pichler ([@pichfl](https://github.com/pichfl))
- Simon Ihmig ([@simonihmig](https://github.com/simonihmig))
- [@NullVoxPopuli](https://github.com/NullVoxPopuli)
- [@github-actions[bot]](https://github.com/apps/github-actions)

## Release (2025-09-05)

* @ember/app-blueprint 6.9.0-alpha.1 (minor)

#### :rocket: Enhancement
* `@ember/app-blueprint`
  * [#76](https://github.com/ember-cli/ember-app-blueprint/pull/76) Prepare 6.9-alpha ([@mansona](https://github.com/mansona))

#### Committers: 1
- Chris Manson ([@mansona](https://github.com/mansona))

## Release (2025-09-05)

* @ember/app-blueprint 6.8.0-beta.1 (minor)

#### :rocket: Enhancement
* `@ember/app-blueprint`
  * [#73](https://github.com/ember-cli/ember-app-blueprint/pull/73) Prepare 6.8 beta ([@mansona](https://github.com/mansona))

#### :house: Internal
* `@ember/app-blueprint`
  * [#75](https://github.com/ember-cli/ember-app-blueprint/pull/75) update the beta version ([@mansona](https://github.com/mansona))

#### Committers: 1
- Chris Manson ([@mansona](https://github.com/mansona))

## Release (2025-09-04)

* @ember/app-blueprint 6.7.1 (patch)

#### :house: Internal
* `@ember/app-blueprint`
  * [#71](https://github.com/ember-cli/ember-app-blueprint/pull/71) fix publish-branch for pnpm publish ([@mansona](https://github.com/mansona))

#### Committers: 1
- Chris Manson ([@mansona](https://github.com/mansona))

## Release (2025-09-04)

* @ember/app-blueprint 6.7.0 (minor)

#### :rocket: Enhancement
* `@ember/app-blueprint`
  * [#65](https://github.com/ember-cli/ember-app-blueprint/pull/65) Update all dependencies for 6.7 release ([@mansona](https://github.com/mansona))

#### :bug: Bug Fix
* `@ember/app-blueprint`
  * [#67](https://github.com/ember-cli/ember-app-blueprint/pull/67) make sure that release-plan publishes from release branch ([@mansona](https://github.com/mansona))

#### :memo: Documentation
* `@ember/app-blueprint`
  * [#70](https://github.com/ember-cli/ember-app-blueprint/pull/70) add a basic readme ([@mansona](https://github.com/mansona))

#### Committers: 1
- Chris Manson ([@mansona](https://github.com/mansona))

## Release (2025-09-04)

* @ember/app-blueprint 6.6.0 (minor)

#### :rocket: Enhancement
* `@ember/app-blueprint`
  * [#63](https://github.com/ember-cli/ember-app-blueprint/pull/63) reset blueprint to match ember-cli app blueprint (in the next release) ([@mansona](https://github.com/mansona))
  * [#57](https://github.com/ember-cli/ember-app-blueprint/pull/57) run update-blueprint-deps to update to Ember 6.6 ([@mansona](https://github.com/mansona))

#### :house: Internal
* `@ember/app-blueprint`
  * [#60](https://github.com/ember-cli/ember-app-blueprint/pull/60) Split test files ([@pichfl](https://github.com/pichfl))

#### Committers: 2
- Chris Manson ([@mansona](https://github.com/mansona))
- Florian Pichler ([@pichfl](https://github.com/pichfl))

## Release (2025-09-03)

* @ember/app-blueprint 0.8.2 (patch)

#### :bug: Bug Fix
* `@ember/app-blueprint`
  * [#56](https://github.com/ember-cli/ember-app-blueprint/pull/56) Make sure that `npm run lint` doesn't fail on a newly generated app ([@pichfl](https://github.com/pichfl))

#### Committers: 1
- Florian Pichler ([@pichfl](https://github.com/pichfl))

## Release (2025-07-22)

* @ember/app-blueprint 0.8.1 (patch)

#### :bug: Bug Fix
* `@ember/app-blueprint`
  * [#53](https://github.com/ember-cli/ember-app-blueprint/pull/53) Use @embroider/router ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### Committers: 1
- [@NullVoxPopuli](https://github.com/NullVoxPopuli)

## Release (2025-07-01)

* @ember/app-blueprint 0.8.0 (minor)

#### :rocket: Enhancement
* `@ember/app-blueprint`
  * [#43](https://github.com/ember-cli/ember-app-blueprint/pull/43) No top-level ambiguous js ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### :bug: Bug Fix
* `@ember/app-blueprint`
  * [#41](https://github.com/ember-cli/ember-app-blueprint/pull/41) Allow .env.test to be checked in to git ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
  * [#42](https://github.com/ember-cli/ember-app-blueprint/pull/42) Don't allow CI to run linting twice ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
  * [#38](https://github.com/ember-cli/ember-app-blueprint/pull/38) Change Test mode to Development mode and fix NODE_ENV in tests ([@gossi](https://github.com/gossi))

#### Committers: 2
- Thomas Gossmann ([@gossi](https://github.com/gossi))
- [@NullVoxPopuli](https://github.com/NullVoxPopuli)

## Release (2025-06-24)

* @ember/app-blueprint 0.7.1 (patch)

#### :bug: Bug Fix
* `@ember/app-blueprint`
  * [#33](https://github.com/ember-cli/ember-app-blueprint/pull/33) Fix NODE_ENV for tests ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### Committers: 1
- [@NullVoxPopuli](https://github.com/NullVoxPopuli)

## Release (2025-06-18)

* @ember/app-blueprint 0.7.0 (minor)

#### :rocket: Enhancement
* `@ember/app-blueprint`
  * [#27](https://github.com/ember-cli/ember-app-blueprint/pull/27) Remove unused dependencies ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### :house: Internal
* `@ember/app-blueprint`
  * [#35](https://github.com/ember-cli/ember-app-blueprint/pull/35) Adjust the lint command / enforce prettier in CI (our code, not for the output) ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### Committers: 1
- [@NullVoxPopuli](https://github.com/NullVoxPopuli)

## Release (2025-06-05)

* @ember/app-blueprint 0.6.0 (minor)

#### :rocket: Enhancement
* `@ember/app-blueprint`
  * [#28](https://github.com/ember-cli/ember-app-blueprint/pull/28) make sure we always use strict generators ([@mansona](https://github.com/mansona))

#### Committers: 1
- Chris Manson ([@mansona](https://github.com/mansona))

## Release (2025-05-22)

* @ember/app-blueprint 0.5.0 (minor)

#### :rocket: Enhancement
* `@ember/app-blueprint`
  * [#24](https://github.com/ember-cli/ember-app-blueprint/pull/24) run update-blueprint-deps --latest ([@mansona](https://github.com/mansona))

#### Committers: 1
- Chris Manson ([@mansona](https://github.com/mansona))

## Release (2025-05-22)

* @ember/app-blueprint 0.4.0 (minor)

#### :rocket: Enhancement
* `@ember/app-blueprint`
  * [#23](https://github.com/ember-cli/ember-app-blueprint/pull/23) run update-blueprint-deps ([@mansona](https://github.com/mansona))

#### :bug: Bug Fix
* `@ember/app-blueprint`
  * [#21](https://github.com/ember-cli/ember-app-blueprint/pull/21) Remove @ember-data/tracking ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### Committers: 2
- Chris Manson ([@mansona](https://github.com/mansona))
- [@NullVoxPopuli](https://github.com/NullVoxPopuli)

## Release (2025-05-20)

* @ember/app-blueprint 0.3.0 (minor)

#### :rocket: Enhancement
* `@ember/app-blueprint`
  * [#20](https://github.com/ember-cli/ember-app-blueprint/pull/20) Upgrade embroider dependencies ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### :bug: Bug Fix
* `@ember/app-blueprint`
  * [#18](https://github.com/ember-cli/ember-app-blueprint/pull/18) Add missing dependency: chalk ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### Committers: 1
- [@NullVoxPopuli](https://github.com/NullVoxPopuli)

## Release (2025-05-20)

* @ember/app-blueprint 0.2.0 (minor)

#### :rocket: Enhancement
* `@ember/app-blueprint`
  * [#13](https://github.com/ember-cli/ember-app-blueprint/pull/13) Bump ember-cli and ember-source to 6.5 (beta) ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
  * [#14](https://github.com/ember-cli/ember-app-blueprint/pull/14) Use *.cjs for the testem config ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
  * [#12](https://github.com/ember-cli/ember-app-blueprint/pull/12) Upgrade ember-data/warp-drive ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### :bug: Bug Fix
* `@ember/app-blueprint`
  * [#11](https://github.com/ember-cli/ember-app-blueprint/pull/11) Don't emit application.hbs, use application.gjs ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
  * [#15](https://github.com/ember-cli/ember-app-blueprint/pull/15) Add imported module that is not declared ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### Committers: 1
- [@NullVoxPopuli](https://github.com/NullVoxPopuli)

## Release (2025-05-08)

* @ember/app-blueprint 0.1.1 (patch)

#### :bug: Bug Fix
* `@ember/app-blueprint`
  * [#10](https://github.com/ember-cli/ember-app-blueprint/pull/10) Add @ember/test-waiters ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
  * [#7](https://github.com/ember-cli/ember-app-blueprint/pull/7) Remove @glimmer/tracking ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### Committers: 1
- [@NullVoxPopuli](https://github.com/NullVoxPopuli)

## Release (2025-04-25)

* @ember/app-blueprint 0.1.0 (minor)

#### :rocket: Enhancement
* `@ember/app-blueprint`
  * [#3](https://github.com/ember-cli/ember-app-blueprint/pull/3) Import the app blueprint from ember-cli and @embroider/app-blueprint ([@mansona](https://github.com/mansona))

#### :house: Internal
* `@ember/app-blueprint`
  * [#6](https://github.com/ember-cli/ember-app-blueprint/pull/6) fix repo url ([@mansona](https://github.com/mansona))
  * [#4](https://github.com/ember-cli/ember-app-blueprint/pull/4) set up release plan ([@mansona](https://github.com/mansona))

#### Committers: 1
- Chris Manson ([@mansona](https://github.com/mansona))
