# @ember/app-blueprint 

This is the blueprint that is used to generate a **new** Ember app using [Vite](https://vite.dev/) as the primary build system.

If you have an existing app that you would like to upgrade to use Vite consider using the [ember-vite-codemod](https://github.com/mainmatter/ember-vite-codemod)

## Usage

```
pnpm dlx ember-cli@latest new my-app-name -b @ember/app-blueprint --pnpm
```

## Options

### `--experimental-no-compat`

```
pnpm dlx ember-cli@latest new my-app-name \
  --blueprint @ember/app-blueprint@alpha \
  --pnpm \
  --no-compat
```

Does the following:
- enables `type=module` in package.json (required for vite-ssr, and many ESM tools)
- makes the build and boot _MUCH FASTER_   
  (in large apps, this can have your app's boot be up to 1 minute faster)
- removes `@embroider/compat`
  - removes support for:
    - hbs (both for component files, and testing)
    - content-for (in the HTML files)
    - v1 addons
    - node-land config/environment.js
- removes `ember-cli`
  - ember-cli brings in a ton of old dependencies, so removing it makes installs much faster
  - downside though is that you no longer have scaffolding (`ember g`) -- however, you could use `pnpm dlx ember-cli g ...` (or `npx ember-cli g`)

### `--minimal`

```
pnpm dlx ember-cli@latest new my-app-name \
  --blueprint @ember/app-blueprint@alpha \
  --pnpm \
  --minimal
```

Does the following
- everything listed under `--experimental-no-compat`
- Removes all linting, formatting, and testing support
  - leaves you with a minimal app that you can use for demos, and PRing to other repositories that have multi-framework support (and probably use other testing tools for that multi-framework support)
- different defaults:
  - warp-drive becomes _opt-in_ (pass `--warp-drive` if you want it -- normally requires `--no-warp-drive` to remove)
  - ember-welcome-page becomes _opt-in_ (normally requires `--no-welcome` to remove)

