import { describe, it, expect } from 'vitest';

import { parse } from 'jsonc-parser';
import { generateApp } from './helpers.mjs';

/**
 * These tests are non-functional that are designed to test only the output of the blueprint
 * and should never install packages or run any lints or tests
 */
describe('Blueprint Arguments', function () {
  describe('--typescript', async function () {
    it('does not generate a tsconfig if you do not pass --typescript', async function () {
      const { files } = await generateApp();

      expect(files['tsconfig.json']).to.be.undefined;
      expect(Object.keys(files.app.templates)).toMatchInlineSnapshot(`
        [
          "application.gjs",
        ]
      `);
    });

    it('generates an app with --typescript', async function () {
      const { files } = await generateApp({ flags: ['--typescript'] });

      expect(parse(files['tsconfig.json']).extends).to.equal(
        '@ember/app-tsconfig',
      );
      expect(parse(files['package.json']).scripts['lint:types']).to.not.be
        .undefined;
      expect(Object.keys(files.app.templates)).toMatchInlineSnapshot(`
        [
          "application.gts",
        ]
      `);
    });
  });

  describe('--package-manager', async function () {
    it('works with npm by default', async function () {
      const { files } = await generateApp();

      expect(parse(files['package.json']).scripts.lint).toMatchInlineSnapshot(
        `"concurrently "npm:lint:*(!fix)" --names "lint:" --prefixColors auto"`,
      );
    });

    it('works with --package-manager=pnpm', async function () {
      const { files } = await generateApp({
        flags: ['--package-manager=pnpm'],
      });

      expect(parse(files['package.json']).scripts.lint).toMatchInlineSnapshot(
        `"concurrently "pnpm:lint:*(!fix)" --names "lint:" --prefixColors auto"`,
      );
    });

    it('works with --pnpm in the same way as --package-manager=pnpm', async function () {
      const { files } = await generateApp({ flags: ['--pnpm'] });

      expect(parse(files['package.json']).scripts.lint).toMatchInlineSnapshot(
        `"concurrently "pnpm:lint:*(!fix)" --names "lint:" --prefixColors auto"`,
      );
    });

    it('works with --package-manager=yarn', async function () {
      const { files } = await generateApp({
        flags: ['--package-manager=yarn'],
      });

      expect(parse(files['package.json']).scripts.lint).toMatchInlineSnapshot(
        `"concurrently "yarn:lint:*(!fix)" --names "lint:" --prefixColors auto"`,
      );
    });

    it('works with --yarn in the same way as --package-manager=yarn', async function () {
      const { files } = await generateApp({ flags: ['--yarn'] });

      expect(parse(files['package.json']).scripts.lint).toMatchInlineSnapshot(
        `"concurrently "yarn:lint:*(!fix)" --names "lint:" --prefixColors auto"`,
      );
    });
  });

  describe('--ci-provider', async function () {
    it('uses github by default', async function () {
      const { files } = await generateApp();

      expect(files['.github'].workflows['ci.yml']).to.not.be.undefined;
    });

    it('does not generate any workflow files if --ci-provider=none is passed', async function () {
      const { files } = await generateApp({ flags: ['--ci-provider=none'] });

      expect(files['.github']).to.be.undefined;
    });
  });

  describe('--lang', async function () {
    it('generates an app --lang=(valid code): no message + set `lang` in index.html', async function () {
      const { files } = await generateApp({ flags: ['--lang=eo'] });

      expect(files['index.html']).to.contain('<html lang="eo">');
    });
  });

  describe('--no-ember-data', async function () {
    it('installs ember-data by default', async function () {
      const { files } = await generateApp();

      expect(parse(files['package.json']).devDependencies['@warp-drive/core'])
        .to.not.be.undefined;
    });

    it('does not add ember-data if you pass --no-ember-data', async function () {
      const { files } = await generateApp({ flags: ['--no-ember-data'] });

      expect(parse(files['package.json']).devDependencies['@warp-drive/core'])
        .to.be.undefined;
    });
  });

  describe('--no-warp-drive', async function () {
    it('installs warp-drive by default', async function () {
      const { files } = await generateApp();

      expect(parse(files['package.json']).devDependencies['@warp-drive/core'])
        .to.not.be.undefined;
    });

    it('does not add warp-drive if you pass --no-warp-drive', async function () {
      const { files } = await generateApp({ flags: ['--no-warp-drive'] });

      expect(parse(files['package.json']).devDependencies['@warp-drive/core'])
        .to.be.undefined;
    });
  });

  describe('--name', async function () {
    it('generates an app with a specified name', async function () {
      const { files } = await generateApp({
        name: 'foo',
        flags: ['--name=foo'],
      });

      expect(parse(files['package.json']).name).toBe('foo');
    });
  });

  describe('--no-welcome', async function () {
    it('generates an app with the welcome page component by default', async function () {
      const { files } = await generateApp();

      expect(parse(files['package.json']).devDependencies['ember-welcome-page'])
        .to.not.be.undefined;
      expect(files.app.templates['application.gjs']).to.contain(
        '<WelcomePage />',
      );
    });

    it('generates an app without the welcome page component', async function () {
      const { files } = await generateApp({ flags: ['--no-welcome'] });

      expect(parse(files['package.json']).devDependencies['ember-welcome-page'])
        .to.be.undefined;
      expect(files.app.templates['application.gjs']).not.to.contain(
        '<WelcomePage />',
      );
    });
  });
});
