import { describe, it, expect } from 'vitest';

import { newProject } from './helpers.mjs';

describe('linting & formatting', function () {
  describe('JavaScript', function () {
    let project = newProject();

    it('yields output for JavaScript without errors', async function () {
      let { exitCode } = await project.execa('pnpm', ['lint']);

      expect(exitCode).to.equal(0);
    });
  });

  describe('TypeScript', function () {
    let project = newProject({
      flags: ['--typescript'],
    });

    it('yields output for JavaScript without errors', async function () {
      let { exitCode } = await project.execa('pnpm', ['lint']);

      expect(exitCode).to.equal(0);
    });
  });
});
