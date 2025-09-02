import { describe, it, expect } from 'vitest';
import fixturify from 'fixturify';

import { generateApp } from './helpers.mjs';

describe('Slow: Runs tests', function () {
  it('runs in a freshly generated empty app', async function () {
    let app = await generateApp({ flags: ['--pnpm'], skipNpm: false });
    let { stdout: stdout1, exitCode: exitCode1 } = await app.execa('pnpm', ['test']);

    if (!process.env.CI) {
      console.log(stdout1);
    }

    expect(stdout1).to.contain('# tests 1');
    expect(stdout1).to.contain('# pass  1');
    expect(stdout1).to.contain('# skip  0');
    expect(stdout1).to.contain('# todo  0');
    expect(stdout1).to.contain('# ok');
    expect(exitCode1).to.equal(0);

    fixturify.writeSync(app.dir, fixturify.readSync('./tests/fixtures/tests-js'));

    let { stdout: stdout2, exitCode: exitCode2 } = await app.execa('pnpm', ['test']);

    if (!process.env.CI) {
      console.log(stdout2);
    }

    expect(stdout2).to.match(/ok .* Acceptance \| index/);
    expect(stdout2).to.match(/ok .* Integration \| Component \| sweet/);
    expect(stdout2).to.match(/ok .* Unit \| Route \| fancy/);
    expect(stdout2).to.match(/ok .* Ember.onerror/);

    expect(stdout2).to.contain('# tests 4');
    expect(stdout2).to.contain('# pass  4');
    expect(stdout2).to.contain('# skip  0');
    expect(stdout2).to.contain('# todo  0');
    expect(stdout2).to.contain('# ok');
    expect(exitCode2).to.equal(0);
  });
});
