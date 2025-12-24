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
  'app/app.ts'(locals, contents) {
    if (locals.minimal) {
      let filePath = join(CONDITIONAL_FILES, 'minimal', 'app/app.ts');
      let raw = readFileSync(filePath).toString();
      return ejs.render(raw, locals);
    } else if (locals.noCompat) {
      let filePath = join(CONDITIONAL_FILES, 'no-compat', 'app/app.ts');
      let raw = readFileSync(filePath).toString();
      return ejs.render(raw, locals);
    }

    return ejs.render(contents, locals);
  },
  'app/config/environment.ts'(locals, contents) {
    if (locals.noCompat) {
      let filePath = join(
        CONDITIONAL_FILES,
        'no-compat',
        'app/config/environment.ts',
      );
      let raw = readFileSync(filePath).toString();
      return ejs.render(raw, locals);
    }

    return ejs.render(contents, locals);
  },
  'app/templates/application.gts'(locals, contents) {
    if (locals.minimal) {
      let filePath = join(
        CONDITIONAL_FILES,
        'minimal',
        'app/templates/application.gts',
      );
      let raw = readFileSync(filePath).toString();
      return ejs.render(raw, locals);
    }

    return ejs.render(contents, locals);
  },
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

    let filePath = join(
      ...[
        CONDITIONAL_FILES,
        locals.noCompat && 'no-compat',
        prefix + 'babel.config.mjs',
      ].filter(Boolean),
    );

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
          options.minimal && `"--minimal"`,
          options.noCompat && `"--no-compat"`,
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

    let welcome = options.welcome;
    let warpDrive = options.warpDrive ?? options.emberData;
    let minimal = false;
    let compat = true;
    /**
     * --minimal overrides compat/no-compat
     */
    if (options.minimal) {
      minimal = true;
      compat = false;

      // Invert defaults
      {
        welcome = options.welcome = process.argv.includes('--welcome');
        warpDrive =
          options.emberData =
          options.warpDrive =
            process.argv.includes('--ember-data') ||
            process.argv.includes('--warp-drive');
      }
    }

    if (!minimal) {
      if (options.noCompat || options.compat === false) {
        compat = false;
      }
    }

    let noCompat = !compat;
    let notMinimal = !minimal;

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
      welcome,
      blueprint: 'app',
      blueprintOptions,
      lang: options.lang,
      warpDrive: warpDrive,
      ciProvider: options.ciProvider,
      typescript: options.typescript,
      packageManager: options.packageManager ?? 'npm',
      compat,
      noCompat,
      minimal,
      notMinimal,
    };
  },

  files(options) {
    if (this._files) {
      return this._files;
    }

    let files = this._super();

    // Locals is where we calculate defaults and such.
    // Let's not duplicate that work here
    options = this.locals(options);

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

    if (options.noCompat) {
      files = files.filter((file) => {
        return (
          !file.includes('ember-cli') &&
          !file.includes('ember-cli-build.js') &&
          !file.includes('controllers/') &&
          !file.includes('config/environment.js') &&
          !file.includes('config/optional-features') &&
          !file.includes('config/targets') &&
          !file.includes('app/helpers/')
        );
      });
    }

    if (options.minimal) {
      files = files.filter((file) => {
        return (
          !file.includes('.github/') &&
          !file.includes('.prettierignore') &&
          !file.includes('README') &&
          !file.includes('deprecation-workflow') &&
          !file.includes('components/') &&
          !file.includes('eslint.config') &&
          !file.includes('prettierrc') &&
          !file.includes('public/') &&
          !file.includes('routes/') &&
          !file.includes('services/') &&
          !file.includes('stylelint') &&
          !file.includes('styles/') &&
          !file.includes('template-lintrc') &&
          !file.includes('testem') &&
          !file.includes('tests/') &&
          !file.includes('watchman')
        );
      });
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

    if (options.minimal) {
      // Remove linting
      {
        delete contents.scripts['format'];
        delete contents.scripts['lint'];
        delete contents.scripts['lint:format'];
        delete contents.scripts['lint:fix'];
        delete contents.scripts['lint:js'];
        delete contents.scripts['lint:js:fix'];
        delete contents.scripts['lint:css'];
        delete contents.scripts['lint:css:fix'];
        delete contents.scripts['lint:hbs'];
        delete contents.scripts['lint:hbs:fix'];

        delete contents.devDependencies['@babel/eslint-parser'];
        delete contents.devDependencies['@eslint/js'];
        delete contents.devDependencies['concurrently'];
        delete contents.devDependencies['ember-template-lint'];
        delete contents.devDependencies['eslint'];
        delete contents.devDependencies['eslint-config-prettier'];
        delete contents.devDependencies['eslint-plugin-ember'];
        delete contents.devDependencies['eslint-plugin-n'];
        delete contents.devDependencies['eslint-plugin-qunit'];
        delete contents.devDependencies['eslint-plugin-warp-drive'];
        delete contents.devDependencies['globals'];
        delete contents.devDependencies['prettier'];
        delete contents.devDependencies['prettier-plugin-ember-template-tag'];
        delete contents.devDependencies['stylelint'];
        delete contents.devDependencies['stylelint-config-standard'];
        delete contents.devDependencies['typescript-eslint'];
      }
      // Remove testing
      {
        delete contents.scripts['test'];
        delete contents.devDependencies['@ember/test-helpers'];
        delete contents.devDependencies['@ember/test-waiters'];
        delete contents.devDependencies['ember-qunit'];
        delete contents.devDependencies['qunit'];
        delete contents.devDependencies['qunit-dom'];
        delete contents.devDependencies['testem'];
      }
      // Extraneous / non-core deps.
      // if folks go minimal, they know what they are doing
      {
        delete contents.devDependencies['ember-welcome-page'];
        delete contents.devDependencies['tracked-built-ins'];
        delete contents.devDependencies['ember-page-title'];
        delete contents.devDependencies['ember-modifier'];
        delete contents.devDependencies['ember-cli-deprecation-workflow'];
        delete contents.devDependencies['ember-resolver'];
      }
      // common-in-the-vite-ecosystem alias
      {
        contents.scripts.dev = contents.scripts.start;
      }

      contents.devDependencies['ember-strict-application-resolver'] = '^0.1.0';
    }
    if (options.noCompat) {
      contents.type = 'module';
      contents.engines.node = '>= 24';
      delete contents.directories;
      delete contents.devDependencies['@ember/string'];
      delete contents.devDependencies['@ember/optional-features'];
      delete contents.devDependencies['@embroider/compat'];
      delete contents.devDependencies['@embroider/config-meta-loader'];
      // Users should use npx ember-cli instead
      delete contents.devDependencies['ember-cli'];
      delete contents.devDependencies['ember-cli-babel'];
      delete contents.devDependencies['ember-load-initializers'];

      // A nice feature of modern apps is using sub-path imports
      // Why specify the whole app name, when you can use `#`?
      contents.imports = {
        '#app/*': './app/*',
        '#config': './app/config/environment',
        '#components/*': './app/components/*',
      };

      if (contents.scripts.test) {
        contents.scripts.test =
          'vite build --mode development && testem ci --port 0';
        contents.devDependencies['testem'] = '^3.17.0';
      }
    }

    return stringifyAndNormalize(sortPackageJson(contents));
  },
};
