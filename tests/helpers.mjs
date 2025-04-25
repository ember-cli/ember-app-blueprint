import assert from 'node:assert';

import { beforeAll } from 'vitest';
import { sync as resolveBinSync } from 'resolve-bin';
import { execa } from 'execa';
import tmp from 'tmp-promise';
import { join } from 'path';
import fixturify from 'fixturify';

let localEmberCli = require.resolve('ember-cli/bin/ember');
const blueprintPath = join(__dirname, '..');

function findEmber() {
  return resolveBinSync('ember-cli', { executable: 'ember' });
}

export const emberCli = findEmber();

const appName = 'test-app';

export function newProjectWithFixtures({
  flags = [],
  fixturePath,
  name = appName,
} = {}) {
  let dir;

  assert(fixturePath, `a fixturePath is required`);

  beforeAll(async () => {
    const tmpDir = (await tmp.dir()).path;
    dir = join(tmpDir, name);
    await execa({cwd: tmpDir})`${localEmberCli} new ${name} -b ${blueprintPath} --skip-git --pnpm ${flags}`;

    let addonFixture = fixturify.readSync(fixturePath);
    fixturify.writeSync(dir, addonFixture);

    // Sync the lints for the fixtures with the project's config
    await execa(`pnpm`, ['lint:fix'], {
      cwd: dir,
    });
  });



  return {
    appName: () => name,
    dir: () => dir,
    $: (...args) => execa({ cwd: dir })(...args),
    execa: (program, args, options = {}) => {
      return execa(program, args, {
        cwd: dir,
        ...options,
      });
    },
  };
}
