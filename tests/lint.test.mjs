import { beforeAll, describe, it, expect } from 'vitest';

import { generateApp } from './helpers.mjs';
import fixturify from 'fixturify';

describe('linting & formatting', function () {
  describe('JavaScript', function () {
    let app;

    beforeAll(async function () {
      /**
       * We are passing --pnpm here because it's just faster to run in CI and realistically
       * we don't need to worry about the differences between pnpm and npm at this level
       */
      app = await generateApp({ flags: ['--pnpm'], skipNpm: false });
    });

    it('yields output without errors', async function (context) {
      // Lint errors on windows machines - probably because of line-endings.
      // TODO fix the config so that a newly generated app doens't fail lint on windows
      if (process.platform === 'win32') {
        context.skip();
      }

      let { exitCode } = await app.execa('pnpm', ['lint']);

      expect(exitCode).to.equal(0);
    });
  });

  describe('TypeScript', function () {
    let app;

    beforeAll(async function () {
      /**
       * We are passing --pnpm here because it's just faster to run in CI and realistically
       * we don't need to worry about the differences between pnpm and npm at this level
       */
      app = await generateApp({
        flags: ['--typescript', '--pnpm'],
        skipNpm: false,
      });

      fixturify.writeSync(
        app.dir,
        fixturify.readSync('./tests/fixtures/lint-ts'),
      );
    });

    it('yields output without errors', async function (context) {
      // Lint errors on windows machines - probably because of line-endings.
      // TODO fix the config so that a newly generated app doens't fail lint on windows
      if (process.platform === 'win32') {
        context.skip();
      }

      let { exitCode } = await app.execa('pnpm', ['lint']);

      expect(exitCode).to.equal(0);
    });

    it('glint passes', async function () {
      expect(
        JSON.parse(app.files['package.json']).scripts['lint:types'],
      ).to.equal('ember-tsc --noEmit');

      let { exitCode, stdout } = await app.execa('pnpm', ['lint:types']);

      console.log(stdout);
      expect(exitCode).to.equal(0);
    });
  });
});
