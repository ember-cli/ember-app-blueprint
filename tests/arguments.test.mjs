import { describe, it, expect } from 'vitest';
import tmp from 'tmp-promise';
import { join } from 'node:path';

import { execa } from 'execa';
import fixturify from 'fixturify';
import { parse } from 'jsonc-parser';

let localEmberCli = require.resolve('ember-cli/bin/ember');
const blueprintPath = join(__dirname, '..');

async function generateApp({ name = 'test-app', flags = [] } = {}) {
  const tmpDir = (await tmp.dir()).path;
  const dir = join(tmpDir, name);

  const { stdout, stderr } = await execa({
    cwd: tmpDir,
  })`${localEmberCli} new ${name} -b ${blueprintPath} --skip-git --skip-npm ${flags}`;

  const files = fixturify.readSync(dir);

  return {
    stdout,
    stderr,
    name,
    dir,
    files,
    execa: (program, args, options = {}) => {
      return execa(program, args, {
        cwd: dir,
        ...options,
      });
    },
  };
}

/**
 * These tests are non-functional that are designed to test only the output of the blueprint
 * and should never install packages or run any lints or tests
 */
describe('Blueprint Arguments', function () {
  describe('--typescript', async function () {
    it('does not generate a tsconfig if you do not pass --typescript', async function() {
      const { files } = await generateApp();
      expect(files['tsconfig.json']).to.be.undefined;

      expect(Object.keys(files.app.templates)).toMatchInlineSnapshot(`
        [
          "application.gjs",
        ]
      `)
    })

    it('generates an app with --typescript', async function() {
      const { files } = await generateApp({flags: ['--typescript']});

      expect(parse(files['tsconfig.json']).extends).to.equal("@ember/app-tsconfig")
      expect(Object.keys(files.app.templates)).toMatchInlineSnapshot(`
        [
          "application.gts",
        ]
      `)
    })

  });

  describe('--package-manager', async function () {
    it('works with npm by default', async function () {
      const { files } = await generateApp();

      expect(parse(files['package.json']).scripts.lint).toMatchInlineSnapshot(`"concurrently "npm:lint:*(!fix)" --names "lint:" --prefixColors auto"`)
    });

    it('works with --pnpm in the same way as --package-manager=pnpm', async function () {
      const { files } = await generateApp({ flags: ['--pnpm']});

      expect(parse(files['package.json']).scripts.lint).toMatchInlineSnapshot(`"concurrently "pnpm:lint:*(!fix)" --names "lint:" --prefixColors auto"`)
    });

    it('--package-manager=pnpm picks the right package manager for scripts', async function () {
      const { files } = await generateApp({ flags: ['--pnpm']});

      expect(parse(files['package.json']).scripts.lint).toMatchInlineSnapshot(`"concurrently "pnpm:lint:*(!fix)" --names "lint:" --prefixColors auto"`)
    });

    /**
     * soon... soon...
     */
    it.skip('freaks out and tells you off if you think about using yarn',  async function () {
      // We'll get there
    });
  });

  describe('--ci-provider', async function () {
    it('uses github by default', async function() {
      const { files } = await generateApp();

      expect(files['.github'].workflows['ci.yml']).to.not.be.undefined;
    });

    it('does not generate any wokflow files if --ci-provider=none is passed', async function() {
      const { files } = await generateApp();

      expect(files['.github']).to.be.undefined;
    })
  });

  describe('--lang', async function () {
    it('generates an app --lang=(valid code): no message + set `lang` in index.html', async function () {
      const { files } = await generateApp({ flags: ['--lang=eo'] });

      expect(files['index.html']).to.contain('<html lang="eo">');
    });
  });

  describe('--no-ember-data', async function () {
    it('installs ember-data by default', async function() {
      const { files } = await generateApp();

      expect(parse(files['package.json']).devDependencies['ember-data']).to.not.be.undefined;
    })

    it('does not add ember-data if you pass --no-ember-data', async function() {
      const { files } = await generateApp({flags: ['--no-ember-data']});

      expect(parse(files['package.json']).devDependencies['ember-data']).to.be.undefined;
    })
  });

  describe('--name', async function () {
    it('generates an app with a specified name', async function () {
      const { files } = await generateApp({ name: 'foo', flags: ['--name=foo'] });

      expect(parse(files['package.json']).name).toBe('foo');
    });
  });

  describe('--no-welcome', async function () {
    it('generates an app with the welcome page component by default', async function () {
      const { files } = await generateApp();

      expect(parse(files['package.json']).devDependencies['ember-welcome-page']).to.not.be.undefined;
      expect(files.app.templates['application.gjs']).to.contain('<WelcomePage />');
    });

    it('generates an app without the welcome page component', async function () {
      const { files } = await generateApp({ flags: ['--no-welcome'] });

      expect(parse(files['package.json']).devDependencies['ember-welcome-page']).to.be.undefined;
      expect(files.app.templates['application.gjs']).not.to.contain('<WelcomePage />');
    });
  });
})
