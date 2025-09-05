import { beforeAll, describe, it, expect } from 'vitest';

import { generateApp } from './helpers.mjs';

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

    it('yields output without errors', async function () {
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
    });

    it('yields output without errors', async function () {
      let { exitCode } = await app.execa('pnpm', ['lint']);

      expect(exitCode).to.equal(0);
    });

    it('glint passes', async function () {
      expect(
        JSON.parse(app.files['package.json']).scripts['lint:types'],
      ).to.equal('glint');

      let { exitCode, stdout } = await app.execa('pnpm', ['lint:types']);

      console.log(stdout);
      expect(exitCode).to.equal(0);
    });
  });
});
