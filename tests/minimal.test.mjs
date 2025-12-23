import { describe, it, expect } from 'vitest';
import { join } from 'path';
import { existsSync, readFileSync } from 'fs';
import { generateApp } from './helpers.mjs';
import fixturify from 'fixturify';
import { beforeAll } from 'vitest';

describe('--minimal', function () {
  describe('default', function () {
    let flags = ['--minimal'];
    let fixturePath = join(import.meta.dirname, 'fixtures/tests-js-minimal-10');
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

      expect(
        !existsSync(join(app.dir, 'ember-cli-build.js')),
        'the ember-cli-build.js is no longer needed',
      );

      expect(
        !existsSync(join(app.dir, 'eslint.config.mjs')),
        'the eslint config is not present',
      );

      let manifest = readFileSync(join(app.dir, 'package.json'));
      let json = JSON.parse(manifest);

      expect(json.devDependencies['eslint']).to.equal(undefined);
      expect(json.devDependencies['prettier']).to.equal(undefined);
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

    it('successfully builds', async function () {
      let result = await app.execa('pnpm', ['build']);

      expect(result.exitCode).to.equal(0);
    });
  });

  describe('--typescript', function () {
    let flags = ['--typescript', '--minimal'];
    let fixturePath = join(import.meta.dirname, 'fixtures/tests-ts-minimal-10');
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

      expect(result.exitCode).to.equal(0);
    });
  });
});
