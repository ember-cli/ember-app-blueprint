"use strict";

// Node
const path = require("path");

// Deps
const fs = require("fs-extra");
const stringUtil = require("ember-cli-string-utils");
const sortPackageJson = require("sort-package-json");

// Files
const manifest = require("./package.json");

const description = manifest.description;
const blueprintVersion = manifest.version;

module.exports = {
  description,

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
   *
   * @param {Options} options
   */
  locals(options) {
    let info = infoFor(options);

    return {
      info,
      blueprintVersion,
    };
  },

  async afterInstall(options) {
    sortManifest(options.target);
  },
};

function infoFor(options) {
  let entity = options.entity;
  let location = options.target;
  let rawName = entity.name;
  let dashedName = stringUtil.dasherize(rawName);

  return {
    name: {
      dashed: dashedName,
      classified: stringUtil.classify(rawName),
      raw: rawName,
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
