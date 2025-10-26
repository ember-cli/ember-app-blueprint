import { describe, it, expect } from 'vitest';
import fixturify from 'fixturify';
import stripAnsi from 'strip-ansi';

import { generateApp } from './helpers.mjs';

describe('Slow(JavaScript): Runs tests', async function () {
  it('runs in a freshly generated app', async function () {
    let app = await generateApp({ flags: ['--pnpm'], skipNpm: false });

    let { stdout: stdout1, exitCode: exitCode1 } = await app.execa('pnpm', [
      'test',
    ]);

    if (!process.env.CI) {
      console.log(stdout1);
    }

    expect(stdout1).to.contain('# tests 1');
    expect(stdout1).to.contain('# pass  1');
    expect(stdout1).to.contain('# skip  0');
    expect(stdout1).to.contain('# todo  0');
    expect(stdout1).to.contain('# ok');
    expect(exitCode1).to.equal(0);
  });

  it('runs in an app with fixtures', async function () {
    let app = await generateApp({ flags: ['--pnpm'], skipNpm: false });

    fixturify.writeSync(
      app.dir,
      fixturify.readSync('./tests/fixtures/tests-js-10'),
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
    expect(stdout2).to.match(/ok .* Unit \| Adapter \| post/);
    expect(stdout2).to.match(/ok .* Unit \| Model \| post/);
    expect(stdout2).to.match(/ok .* Unit \| Route \| fancy/);
    expect(stdout2).to.match(/ok .* Unit \| Serializer \| post/);
    expect(stdout2).to.match(/ok .* Ember.onerror/);

    expect(stdout2).to.contain('# tests 10');
    expect(stdout2).to.contain('# pass  10');
    expect(stdout2).to.contain('# skip  0');
    expect(stdout2).to.contain('# todo  0');
    expect(stdout2).to.contain('# ok');
    expect(exitCode2).to.equal(0);
  });

  it('runs when serving /tests', async function () {
    let app = await generateApp({ flags: ['--pnpm'], skipNpm: false });

    await app.execa('pnpm', ['install', '--save-dev', 'testem', 'http-proxy']);

    let fixtures = fixturify.readSync('./tests/fixtures/tests-js-20');
    let server;

    try {
      server = app.execa('pnpm', ['start']);

      let appURL = await new Promise((resolve) => {
        // Read app url from Vite server output
        server.stdout.on('data', (line) => {
          let parsed = stripAnsi(line.toString());
          let result = /Local:\s+(https?:\/\/.*)\//g.exec(parsed);

          if (process.env.CI) {
            console.log(parsed);
          }

          if (result) {
            resolve(result[1]);
          }
        });
      });

      fixtures['testem-dev.js'] = fixtures['testem-dev.js'].replace(
        '%APP_URL%',
        appURL,
      );
      fixturify.writeSync(app.dir, fixtures);

      let testResult = await app.execa('pnpm', [
        'testem',
        '--file',
        'testem-dev.js',
        'ci',
      ]);

      if (process.env.CI) {
        console.log(testResult.stdout);
        console.log(testResult.stderr);
      }

      expect(testResult.exitCode).to.eq(0);
    } finally {
      server?.kill('SIGKILL');
    }
  });
});

describe('Slow(TypeScript): Runs tests', async function () {
  it('runs in a freshly generated app', async function () {
    let app = await generateApp({
      flags: ['--pnpm', '--typescript'],
      skipNpm: false,
    });

    let { stdout: stdout1, exitCode: exitCode1 } = await app.execa('pnpm', [
      'test',
    ]);

    if (!process.env.CI) {
      console.log(stdout1);
    }

    expect(stdout1).to.contain('# tests 1');
    expect(stdout1).to.contain('# pass  1');
    expect(stdout1).to.contain('# skip  0');
    expect(stdout1).to.contain('# todo  0');
    expect(stdout1).to.contain('# ok');
    expect(exitCode1).to.equal(0);
  });

  it('runs in an app with fixtures', async function () {
    let app = await generateApp({
      flags: ['--pnpm', '--typescript'],
      skipNpm: false,
    });

    fixturify.writeSync(
      app.dir,
      fixturify.readSync('./tests/fixtures/tests-ts-10'),
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
    expect(stdout2).to.match(/ok .* Unit \| Adapter \| post/);
    expect(stdout2).to.match(/ok .* Unit \| Model \| post/);
    expect(stdout2).to.match(/ok .* Unit \| Route \| fancy/);
    expect(stdout2).to.match(/ok .* Unit \| Serializer \| post/);
    expect(stdout2).to.match(/ok .* Ember.onerror/);

    expect(stdout2).to.contain('# tests 10');
    expect(stdout2).to.contain('# pass  10');
    expect(stdout2).to.contain('# skip  0');
    expect(stdout2).to.contain('# todo  0');
    expect(stdout2).to.contain('# ok');
    expect(exitCode2).to.equal(0);
  });

  it('runs when serving /tests', async function () {
    let app = await generateApp({
      flags: ['--pnpm', '--typescript'],
      skipNpm: false,
    });

    await app.execa('pnpm', ['install', '--save-dev', 'testem', 'http-proxy']);

    let fixtures = fixturify.readSync('./tests/fixtures/tests-js-20');
    let server;

    try {
      server = app.execa('pnpm', ['start']);

      let appURL = await new Promise((resolve) => {
        // Read app url from Vite server output
        server.stdout.on('data', (line) => {
          let parsed = stripAnsi(line.toString());
          let result = /Local:\s+(https?:\/\/.*)\//g.exec(parsed);

          if (process.env.CI) {
            console.log(parsed);
          }

          if (result) {
            resolve(result[1]);
          }
        });
      });

      fixtures['testem-dev.js'] = fixtures['testem-dev.js'].replace(
        '%APP_URL%',
        appURL,
      );
      fixturify.writeSync(app.dir, fixtures);

      let testResult = await app.execa('pnpm', [
        'testem',
        '--file',
        'testem-dev.js',
        'ci',
      ]);

      if (process.env.CI) {
        console.log(testResult.stdout);
        console.log(testResult.stderr);
      }

      expect(testResult.exitCode).to.eq(0);
    } finally {
      server?.kill('SIGKILL');
    }
  });
});
