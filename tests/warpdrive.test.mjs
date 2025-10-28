import { describe, it, expect, beforeAll } from 'vitest';
import fixturify from 'fixturify';

import { generateApp } from './helpers.mjs';

describe('Slow(JavaScript): Runs tests', async function () {
  let app = await generateApp({
    flags: ['--pnpm', '--typescript'],
    skipNpm: false,
  });

  fixturify.writeSync(
    app.dir,
    fixturify.readSync('./tests/fixtures/warpdrive-js'),
  );

  let { stdout: stdout2, exitCode: exitCode2 } = await app.execa('pnpm', [
    'test',
  ]);

  if (!process.env.CI) {
    console.log(stdout2);
  }

  expect(stdout2).to.match(/ok .* Acceptance \| app route/);
  expect(stdout2).to.match(/ok .* Acceptance \| index/);
  expect(stdout2).to.match(/ok .* Integration \| Component \| sweet/);
  expect(stdout2).to.match(/ok .* Unit \| Route \| fancy/);
  expect(stdout2).to.match(/ok .* Ember.onerror/);

  expect(stdout2).to.contain('# tests 6');
  expect(stdout2).to.contain('# pass  6');
  expect(stdout2).to.contain('# skip  0');
  expect(stdout2).to.contain('# todo  0');
  expect(stdout2).to.contain('# ok');
  expect(exitCode2).to.equal(0);
});

describe('Slow(TypeScript): Runs tests', async function () {
  let app = await generateApp({
    flags: ['--pnpm', '--typescript'],
    skipNpm: false,
  });

  fixturify.writeSync(
    app.dir,
    fixturify.readSync('./tests/fixtures/warpdrive-ts'),
  );

  let { stdout: stdout2, exitCode: exitCode2 } = await app.execa('pnpm', [
    'test',
  ]);

  if (!process.env.CI) {
    console.log(stdout2);
  }

  expect(stdout2).to.match(/ok .* Acceptance \| app route/);
  expect(stdout2).to.match(/ok .* Acceptance \| index/);
  expect(stdout2).to.match(/ok .* Integration \| Component \| sweet/);
  expect(stdout2).to.match(/ok .* Unit \| Route \| fancy/);
  expect(stdout2).to.match(/ok .* Ember.onerror/);

  expect(stdout2).to.contain('# tests 6');
  expect(stdout2).to.contain('# pass  6');
  expect(stdout2).to.contain('# skip  0');
  expect(stdout2).to.contain('# todo  0');
  expect(stdout2).to.contain('# ok');
  expect(exitCode2).to.equal(0);
});

describe('linting & formatting', function () {
  describe('JavaScript', function () {
    let app;

    beforeAll(async function () {
      /**
       * We are passing --pnpm here because it's just faster to run in CI and realistically
       * we don't need to worry about the differences between pnpm and npm at this level
       */
      app = await generateApp({ flags: ['--pnpm'], skipNpm: false });
      fixturify.writeSync(
        app.dir,
        fixturify.readSync('./tests/fixtures/warpdrive-js'),
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
        fixturify.readSync('./tests/fixtures/warpdrive-ts'),
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
      ).to.equal('glint');

      let { exitCode, stdout } = await app.execa('pnpm', ['lint:types']);

      console.log(stdout);
      expect(exitCode).to.equal(0);
    });
  });
});
