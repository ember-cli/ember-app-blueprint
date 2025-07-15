import { describe, it, expect } from 'vitest';
import { join } from 'path';
import { existsSync, writeFileSync } from 'fs';
import stripAnsi from 'strip-ansi';
import { newProjectWithFixtures } from './helpers.mjs';

const SCENARIOS = [
  {
    name: 'defaults',
    flags: [],
    fixturePath: join(import.meta.dirname, 'fixture'),
  },
  {
    name: 'compat (v1 addon support)',
    // @glimmer/component >= 2.0.0 is a v2 addon, which we don't need when testing "compat mode"
    // this test is "compat mode"
    // compat mode forces us to use v1 addon infra, ember-cli, etc
    flags: [
      /* none, default */
    ],
    packageJson: {
      devDependencies: {
        '@glimmer/component': '^1.1.2',
      },
    },
    fixturePath: join(import.meta.dirname, 'fixture'),
  },
  {
    name: 'typescript',
    flags: ['--typescript'],
    fixturePath: join(import.meta.dirname, 'fixture-ts'),
  },
];

describe('basic functionality', function () {
  for (let { name, flags, packageJson, fixturePath } of SCENARIOS) {
    describe(name, function () {
      let project = newProjectWithFixtures({
        fixturePath,
        flags,
        packageJson,
      });

      it('verify files', async function () {
        expect(
          !existsSync(join(project.dir(), 'app/index.html')),
          'the app index.html has been removed',
        );
        expect(
          existsSync(join(project.dir(), 'index.html')),
          'the root index.html has been added',
        );
      });

      it('successfully lints', async function () {
        let result = await project.execa('pnpm', ['lint']);

        console.log(result.stdout);
      });

      it('successfully builds', async function () {
        let result = await project.execa('pnpm', ['build']);

        console.log(result.stdout);
      });

      it('successfully runs tests', async function () {
        let result;

        try {
          result = await project.execa('pnpm', ['test']);
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
          'Acceptance | styles: visiting /styles',
        );

        console.log(result.stdout);
      });

      it('successfully runs tests in dev mode', async function () {
        await project.$`pnpm install --save-dev testem http-proxy`;
        let appURL;

        let server;

        try {
          server = project.execa('pnpm', ['start']);

          await new Promise((resolve) => {
            server.stdout.on('data', (line) => {
              let result = /Local:\s+(https?:\/\/.*)\//g.exec(
                stripAnsi(line.toString()),
              );

              if (result) {
                appURL = result[1];
                resolve();
              }
            });
          });

          writeFileSync(
            join(project.dir(), 'testem-dev.js'),
            `module.exports = {
  test_page: 'tests/index.html?hidepassed',
  disable_watching: true,
  launch_in_ci: ['Chrome'],
  launch_in_dev: ['Chrome'],
  browser_start_timeout: 120,
  browser_args: {
    Chrome: {
      ci: [
        // --no-sandbox is needed when running Chrome inside a container
        process.env.CI ? '--no-sandbox' : null,
        '--headless',
        '--disable-dev-shm-usage',
        '--disable-software-rasterizer',
        '--mute-audio',
        '--remote-debugging-port=0',
        '--window-size=1440,900',
      ].filter(Boolean),
    },
  },
  middleware: [
    require(__dirname + '/testem-proxy.cjs')('${appURL}')
  ],
};
`,
          );

          let testResult = await project.execa('pnpm', [
            'testem',
            '--file',
            'testem-dev.js',
            'ci',
          ]);
          expect(testResult.exitCode).to.eq(0, testResult.output);
        } finally {
          server?.kill('SIGINT');
        }
      });

      it('successfully optimizes deps', function () {
        return project.execa('pnpm', ['vite', 'optimize', '--force']);
      });

      it('can run generators', function () {
        return project.execa('pnpm', ['ember', 'g', 'route', 'fancy']);
      });
    });
  }
});
