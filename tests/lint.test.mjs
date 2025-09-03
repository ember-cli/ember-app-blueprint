import { beforeAll, describe, it, expect } from 'vitest';

import { generateApp } from './helpers.mjs';

describe('linting & formatting', function () {
  let app;

  beforeAll(async function () {
    app = await generateApp({ flags: ['--typescript'] });
  });

  describe('JavaScript', function () {
    it('yields output for JavaScript without errors', async function () {
      let { exitCode } = await app.execa('pnpm', ['lint']);

      expect(exitCode).to.equal(0);
    });
  });

  describe('TypeScript', function () {
    let app;

    beforeAll(function () {
      app = generateApp({ flags: ['--typescript'] });
    });

    it('yields output for JavaScript without errors', async function () {
      let { exitCode } = await app.execa('pnpm', ['lint']);

      expect(exitCode).to.equal(0);
    });
  });
});
