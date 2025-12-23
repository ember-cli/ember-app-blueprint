import { describe, it, expect } from 'vitest';
import { join } from 'path';
import { existsSync, readFileSync } from 'fs';
import { generateApp } from './helpers.mjs';
import fixturify from 'fixturify';
import { beforeAll } from 'vitest';

/**
 * We use pnpm in these tests because npm can't handle peers and pre-releases
 *
 * The minimal tests don't need to use pnpm because we don't use ember-load-initializers
 */
describe('--no-compat', function () {
  describe('default', function () {
    let flags = ['--no-compat', '--pnpm'];
    let fixturePath = join(import.meta.dirname, 'fixtures/tests-js-10');

    describe('empty project', function () {
      let app;
      beforeAll(async function () {
        app = await generateApp({
          flags,
          skipNpm: false,
        });
      });

      it('verify files', async function () {
        expect(
          !existsSync(join(app.dir, 'app/index.html')),
          'the app index.html has been removed',
        );
        expect(
          existsSync(join(app.dir, 'index.html')),
          'the root index.html has been added',
        );

        expect(
          !existsSync(join(app.dir, 'ember-cli-build.js')),
          'the ember-cli-build.js is no longer needed',
        );

        let manifest = readFileSync(join(app.dir, 'package.json'));
        let json = JSON.parse(manifest);

        expect(json.devDependencies['ember-cli']).to.equal(undefined);
        expect(json.devDependencies['ember-cli-babel']).to.equal(undefined);
        expect(json.devDependencies['ember-load-initializers']).to.equal(
          undefined,
        );
        expect(json.devDependencies['@ember/optional-features']).to.equal(
          undefined,
        );
        expect(json.devDependencies['@embroider/compat']).to.equal(undefined);
      });

      it('successfully lints', async function (context) {
        // Lint errors on windows machines - probably because of line-endings.
        // TODO fix the config so that a newly generated app doens't fail lint on windows
        if (process.platform === 'win32') {
          context.skip();
        }

        let result = await app.execa('pnpm', ['lint']);

        expect(result.exitCode).to.equal(0);
      });

      it('successfully builds', async function () {
        let result = await app.execa('pnpm', ['build']);

        expect(result.exitCode).to.equal(0);
      });
    });

    describe('with fixture', function () {
      let app;
      beforeAll(async function () {
        app = await generateApp({
          flags,
          skipNpm: false,
        });
        fixturify.writeSync(app.dir, fixturify.readSync(fixturePath));
      });

      it('successfully runs tests', async function () {
        let result;

        try {
          result = await app.execa('pnpm', ['test']);
        } catch (err) {
          console.log(err.stdout, err.stderr);
          throw 'Failed to successfully run test';
        }

        // make sure that each of the tests that we expect actually show up
        // alternatively we can change this to search for `pass 3`
        expect(result.stdout).to.contain(
          'Acceptance | welcome page: visiting /index shows the welcome page',
        );
        expect(result.stdout).to.contain(
          'Integration | Component | sweet: it renders',
        );

        console.log(result.stdout);
      });
    });
  });

  describe('--typescript', function () {
    let flags = ['--typescript', '--no-compat', '--pnpm'];
    let fixturePath = join(import.meta.dirname, 'fixtures/tests-ts-10');

    describe('empty project', function () {
      let app;
      beforeAll(async function () {
        app = await generateApp({
          flags,
          skipNpm: false,
        });
      });

      it('verify files', async function () {
        expect(
          !existsSync(join(app.dir, 'app/index.html')),
          'the app index.html has been removed',
        );
        expect(
          existsSync(join(app.dir, 'index.html')),
          'the root index.html has been added',
        );
      });

      it('successfully lints', async function (context) {
        // Lint errors on windows machines - probably because of line-endings.
        // TODO fix the config so that a newly generated app doens't fail lint on windows
        if (process.platform === 'win32') {
          context.skip();
        }

        let result = await app.execa('pnpm', ['lint']);

        expect(result.exitCode).to.equal(0);
      });

      it('successfully builds', async function () {
        let result = await app.execa('pnpm', ['build']);

        expect(result.exitCode).to.equal(0);
      });
    });

    describe('with fixture', function () {
      let app;
      beforeAll(async function () {
        app = await generateApp({
          flags,
          skipNpm: false,
        });
        fixturify.writeSync(app.dir, fixturify.readSync(fixturePath));
      });

      it('successfully runs tests', async function () {
        let result;

        try {
          result = await app.execa('pnpm', ['test']);
        } catch (err) {
          console.log(err.stdout, err.stderr);
          throw 'Failed to successfully run test';
        }

        // make sure that each of the tests that we expect actually show up
        // alternatively we can change this to search for `pass 3`
        expect(result.stdout).to.contain(
          'Acceptance | welcome page: visiting /index shows the welcome page',
        );
        expect(result.stdout).to.contain(
          'Integration | Component | sweet: it renders',
        );

        console.log(result.stdout);
      });
    });
  });
});
