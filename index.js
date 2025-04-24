"use strict";

// Node
const path = require("path");

// Deps
const fs = require("fs-extra");
const chalk = require("chalk");
const stringUtil = require("ember-cli-string-utils");
const sortPackageJson = require("sort-package-json");

// Local
const manifest = require("./package.json");

const description = manifest.description;
const blueprintVersion = manifest.version;
const date = new Date();

/**
 * Implementor's note: since ember-cli uses a configuration-focused custom object syntax,
 * it's easier to only define the called APIs / properties in this object, and have all
 * other utility functions defined outside the object here.
 * This way it's clearer
 *   - what is an ember-cli API (and will be called for us),
 *   - and what is owned by us, the blueprint (and what we need to call ourselves).
 */
module.exports = {
  description,
  shouldTransformTypeScript: true,

  async afterInstall(options) {
    sortManifest(options.target);
  },

  beforeInstall() {
    this.ui.writeLine(chalk.blue(`@ember/app-blueprint v${blueprintVersion}`));
    this.ui.writeLine("");
    this.ui.writeLine(
      prependEmoji(
        "✨",
        `Creating a new Ember app in ${chalk.yellow(process.cwd())}:`,
      ),
    );
  },

  /**
   * @typedef Entity
   * @property {string} name
   *
   *
   * @typedef {object} Options
   * @property {string} target
   * @property {Entity} entity
   * @property {unknown} ui
   * @property {unknown} project
   * @property {string} rawArgs
   * @property {unknown[]} targetFiles
   * @property {boolean} dryRun
   * @property {boolean} verbose
   * @property {boolean} skipNpm
   * @property {boolean} skipGit
   * @property {boolean} welcome
   * @property {boolean} lintFix
   * @property {boolean} embroider
   * @property {boolean} emberData
   * @property {boolean} interactive
   * @property {boolean} typescript
   * @property {boolean} checkForUpdates
   * @property {boolean} isTypeScriptProject
   * @property {string} name
   * @property {string} rawName
   * @property {string} blueprint
   * @property {string} ciProvider
   * @property {'npm' | 'pnpm' | 'yarn' | undefined} packageManager
   *
   * @param {Options} options
   */
  locals(options) {
    let info = infoFor(options);

    let opts = { ...options };

    delete opts.project;
    delete opts.ui;
    delete opts.lintFix;
    delete opts.verbose;
    delete opts.rawArgs;

    let invokeScriptPrefix = "npm run";
    let execBinPrefix = "npm exec";

    if (options.packageManager === "yarn") {
      invokeScriptPrefix = "yarn";
      execBinPrefix = "yarn";
    }

    if (options.packageManager === "pnpm") {
      invokeScriptPrefix = "pnpm";
      execBinPrefix = "pnpm";
    }

    return {
      info,
      blueprintVersion,
      year: date.getFullYear(),
      ...opts,

      appDirectory: directoryForPackageName(info.name.dashed),
      name: info.name.dashed,
      modulePrefix: info.name.dashed,
      namespace: info.name.namespace,
      yarn: options.packageManager === "yarn",
      pnpm: options.packageManager === "pnpm",
      npm:
        options.packageManager !== "yarn" && options.packageManager !== "pnpm",
      invokeScriptPrefix,
      execBinPrefix,
      welcome: options.welcome,
      blueprint: "app",
      lang: options.lang,
      emberData: options.emberData,
      ciProvider: options.ciProvider,
      typescript: options.typescript,
      packageManager: options.packageManager ?? "npm",
    };
  },

  files(options) {
    if (this._files) {
      return this._files;
    }

    let files = this._super();

    if (options.ciProvider !== "github") {
      files = files.filter((file) => file.indexOf(".github") < 0);
    }

    if (!options.typescript) {
      files = files.filter(
        (file) =>
          !["tsconfig.json", "types/"].includes(file) &&
          !file.endsWith(".d.ts"),
      );
    }

    if (!options.emberData) {
      files = files.filter((file) => !file.includes("models/"));
      files = files.filter((file) => !file.includes("ember-data/"));
    }

    this._files = files;

    return this._files;
  },
};

/************************
 *
 * Support / Utilities
 *
 ***********************/

function infoFor(options) {
  let entity = options.entity;
  let location = options.target;
  let rawName = entity.name;
  let dashedName = stringUtil.dasherize(rawName);
  let classyName = stringUtil.classify(rawName);

  return {
    name: {
      dashed: dashedName,
      classified: classyName,
      raw: rawName,
      get namespace() {
        return classyName;
      },
    },
    location,
  };
}

async function sortManifest(location) {
  let addonPackageJsonPath = path.join(location, "package.json");
  let addonPackageJson = await fs.readJSON(addonPackageJsonPath);

  await fs.writeJSON(addonPackageJsonPath, sortPackageJson(addonPackageJson), {
    spaces: 2,
  });
}

/**
 * Derive a directory name from a package name.
 * Takes scoped packages into account.
 *
 * @method directoryForPackageName
 * @param {String} packageName
 * @return {String} Derived directory name.
 */
function directoryForPackageName(packageName) {
  let isScoped = packageName[0] === "@" && packageName.includes("/");

  if (isScoped) {
    let slashIndex = packageName.indexOf("/");
    let scopeName = packageName.substring(1, slashIndex);
    let packageNameWithoutScope = packageName.substring(slashIndex + 1);
    let pathParts = process.cwd().split(path.sep);
    let parentDirectoryContainsScopeName = pathParts.includes(scopeName);

    if (parentDirectoryContainsScopeName) {
      return packageNameWithoutScope;
    } else {
      return `${scopeName}-${packageNameWithoutScope}`;
    }
  } else {
    return packageName;
  }
}

function supportEmoji() {
  const hasEmojiTurnedOff = process.argv.indexOf("--no-emoji") > -1;

  return (
    process.stdout.isTTY && process.platform !== "win32" && !hasEmojiTurnedOff
  );
}

const areEmojiSupported = supportEmoji();

function prependEmoji(emoji, msg) {
  return areEmojiSupported ? `${emoji}  ${msg}` : msg;
}
