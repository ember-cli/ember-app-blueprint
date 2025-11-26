'use strict';

const stringUtil = require('ember-cli-string-utils');
const chalk = require('chalk');
const directoryForPackageName = require('./lib/directory-for-package-name');
const { sortPackageJson } = require('sort-package-json');
const { join } = require('path');
const { readFileSync } = require('fs');
const ejs = require('ejs');

const CONDITIONAL_FILES = join(__dirname, 'conditional-files');

function stringifyAndNormalize(contents) {
  return `${JSON.stringify(contents, null, 2)}\n`;
}

/**
 * This overrides ember-cli's default replace function,
 * which is a call to ejs with the template locals.
 *
 * If we want to continue using ejs in any of these,
 * we _may_ need to call ejs ourselves
 * (in the case where we ignore the "contents" passed to these functions)
 * (see `conditional-files`)
 */
const replacers = {
  'package.json'(...args) {
    return this.updatePackageJson(...args);
  },
  'eslint.config.mjs'(locals) {
    let prefix = locals.typescript ? '_ts_' : '_js_';
    let filePath = join(CONDITIONAL_FILES, prefix + 'eslint.config.mjs');

    let raw = readFileSync(filePath).toString();

    return ejs.render(raw, locals);
  },
  'babel.config.mjs'(locals) {
    let prefix = locals.typescript ? '_ts_' : '_js_';
    let filePath = join(CONDITIONAL_FILES, prefix + 'babel.config.mjs');

    let raw = readFileSync(filePath).toString();

    return ejs.render(raw, locals);
  },
};

module.exports = {
  description: 'The default blueprint for ember-cli projects.',

  shouldTransformTypeScript: true,

  filesToRemove: [
    'app/styles/.gitkeep',
    'app/templates/.gitkeep',
    'app/views/.gitkeep',
    'public/.gitkeep',
    'Brocfile.js',
    'testem.json',
  ],

  locals(options) {
    let entity = options.entity;
    let rawName = entity.name;
    let name = stringUtil.dasherize(rawName);
    let namespace = stringUtil.classify(rawName);

    let hasOptions =
      !options.welcome || options.packageManager || options.ciProvider;
    let blueprintOptions = '';
    if (hasOptions) {
      let indent = `\n            `;
      let outdent = `\n          `;

      blueprintOptions =
        indent +
        [
          !options.welcome && '"--no-welcome"',
          options.packageManager === 'yarn' && '"--yarn"',
          options.packageManager === 'pnpm' && '"--pnpm"',
          options.ciProvider && `"--ci-provider=${options.ciProvider}"`,
          options.typescript && `"--typescript"`,
          !options.emberData && `"--no-ember-data"`,
          !options.warpDrive && `"--no-warp-drive"`,
        ]
          .filter(Boolean)
          .join(',\n            ') +
        outdent;
    }

    let invokeScriptPrefix = 'npm run';
    let execBinPrefix = 'npm exec';

    if (options.packageManager === 'yarn') {
      invokeScriptPrefix = 'yarn';
      execBinPrefix = 'yarn';
    }

    if (options.packageManager === 'pnpm') {
      invokeScriptPrefix = 'pnpm';
      execBinPrefix = 'pnpm';
    }

    return {
      appDirectory: directoryForPackageName(name),
      name,
      modulePrefix: name,
      namespace,
      blueprintVersion: require('./package').version,
      yarn: options.packageManager === 'yarn',
      pnpm: options.packageManager === 'pnpm',
      npm:
        options.packageManager !== 'yarn' && options.packageManager !== 'pnpm',
      invokeScriptPrefix,
      execBinPrefix,
      welcome: options.welcome,
      blueprint: 'app',
      blueprintOptions,
      lang: options.lang,
      warpDrive: options.warpDrive ?? options.emberData,
      ciProvider: options.ciProvider,
      typescript: options.typescript,
      packageManager: options.packageManager ?? 'npm',
    };
  },

  files(options) {
    if (this._files) {
      return this._files;
    }

    let files = this._super();

    if (options.ciProvider !== 'github') {
      files = files.filter((file) => file.indexOf('.github') < 0);
    }

    if (!options.typescript) {
      files = files.filter(
        (file) =>
          !['tsconfig.json', 'app/config/', 'types/'].includes(file) &&
          !file.endsWith('.d.ts'),
      );
    }

    const warpDrive = options.warpDrive || options.emberData;
    if (!warpDrive) {
      files = files.filter((file) => !file.includes('services/store.ts'));
    } else {
      files = files.filter((file) => !file.includes('services/.gitkeep'));
    }

    this._files = files;

    return this._files;
  },

  beforeInstall() {
    const prependEmoji = require('./lib/prepend-emoji');

    this.ui.writeLine(
      prependEmoji(
        '✨',
        `Creating a new Ember app in ${chalk.yellow(process.cwd())}:`,
      ),
    );
  },

  /**
   * @override
   */
  buildFileInfo(intoDir, templateVariables, file) {
    let fileInfo = this._super.buildFileInfo.apply(this, arguments);

    if (file in replacers) {
      fileInfo.replacer = replacers[file].bind(this, templateVariables);
    }

    return fileInfo;
  },

  updatePackageJson(options, content) {
    let contents = JSON.parse(content);

    return stringifyAndNormalize(sortPackageJson(contents));
  },
};
