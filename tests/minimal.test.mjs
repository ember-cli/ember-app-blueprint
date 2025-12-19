import { describe, it, expect } from 'vitest';
import { join } from 'path';
import { existsSync, writeFileSync } from 'fs';
import stripAnsi from 'strip-ansi';
import { generateApp } from './helpers.mjs';
import fixturify from 'fixturify';
import { beforeAll } from 'vitest';

const SCENARIOS = [
  {
    name: 'minimal',
    flags: ['--minimal'],
    fixturePath: join(import.meta.dirname, 'fixtures/tests-js-10'),
  },

  {
    name: 'typescript + minimal',
    flags: ['--typescript', '--minimal'],
    fixturePath: join(import.meta.dirname, 'fixtures/tests-ts-10'),
  },
];

describe('basic functionality', function () {
  for (let { name, flags, fixturePath } of SCENARIOS) {
    describe(name, function () {
      let app;
      beforeAll(async function () {
        app = await generateApp({
          flags,
          skipNpm: false,
        });

        fixturify.writeSync(app.dir, fixturify.readSync(fixturePath));
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

   

      it('successfully builds', async function () {
        let result = await app.execa('pnpm', ['build']);

        console.log(result.stdout);
      });

      it('successfully optimizes deps', function () {
        return app.execa('pnpm', ['vite', 'optimize', '--force']);
      });
    });
  }
});
