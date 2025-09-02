import { beforeAll, describe, it, expect } from 'vitest';

import { generateApp } from './helpers.mjs';

describe('Slow: Generate individual files', function () {
  let app;

  beforeAll(async function () {
    app = await generateApp({ flags: ['--pnpm'], skipNpm: false, });
  });

  it('can generate a route', async function () {
    let { exitCode, stdout } = await app.execa('pnpm', ['ember', 'g', 'route', 'fancy']);

    if (!process.env.CI) {
      console.log(stdout);
    }

    expect(exitCode).to.equal(0);
    expect(app.files.app.routes['fancy.js']).to.not.be.empty;
    expect(app.files.app['router.js']).to.contain(`this.route('fancy')`);
    expect(app.files.tests.unit.routes['fancy-test.js']).to.not.be.empty;
  });

  // Note: We could run additional generators here (component, controller, etc)
});
