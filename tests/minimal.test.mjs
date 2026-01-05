import { describe, it, expect } from 'vitest';
import { join } from 'path';
import { existsSync, readFileSync } from 'fs';
import { generateApp } from './helpers.mjs';
import { beforeAll } from 'vitest';

describe('--minimal', function () {
  describe('default', function () {
    let flags = ['--minimal'];
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

      expect(
        !existsSync(join(app.dir, 'eslint.config.mjs')),
        'the eslint config is not present',
      );

      let manifest = readFileSync(join(app.dir, 'package.json'));
      let json = JSON.parse(manifest);

      expect(json.devDependencies['@warp-drive/core']).toBeFalsy();
      expect(json.devDependencies['eslint']).toBeFalsy();
      expect(json.devDependencies['prettier']).toBeFalsy();
      expect(json.devDependencies['ember-cli']).toBeFalsy();
      expect(json.devDependencies['ember-cli-babel']).toBeFalsy();

      expect(json.devDependencies['ember-load-initializers']).toBeFalsy();
      expect(json.devDependencies['@ember/optional-features']).toBeFalsy();
      expect(json.devDependencies['@embroider/compat']).toBeFalsy();
    });

    it('successfully builds', async function () {
      let result = await app.execa('pnpm', ['build']);

      expect(result.exitCode).to.equal(0);
    });
  });

  describe('--warp-drive', function () {
    let flags = ['--minimal', '--warp-drive'];
    let app;

    beforeAll(async function () {
      app = await generateApp({
        flags,
        skipNpm: false,
      });
    });

    it('verify files', async function () {
      expect(
        readFileSync(join(app.dir, 'babel.config.mjs')).toString(),
      ).to.include(
        'setConfig',
        'Babel config contains the required warp-drive configuration',
      );

      let manifest = readFileSync(join(app.dir, 'package.json'));
      let json = JSON.parse(manifest);

      expect(json.devDependencies['@warp-drive/core']).toBeTruthy();
    });

    it('successfully builds', async function () {
      let result = await app.execa('pnpm', ['build']);

      expect(result.exitCode).to.equal(0);
    });
  });

  describe('--typescript', function () {
    let flags = ['--typescript', '--minimal'];
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

    it('successfully builds', async function () {
      let result = await app.execa('pnpm', ['build']);

      expect(result.exitCode).to.equal(0);
    });
  });
});
