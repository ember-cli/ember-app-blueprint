import assert from 'node:assert';

import { beforeAll } from 'vitest';
import { execa } from 'execa';
import tmp from 'tmp-promise';
import fs from 'node:fs/promises';
import { join } from 'node:path';
import fixturify from 'fixturify';

let localEmberCli = require.resolve('ember-cli/bin/ember');
const blueprintPath = join(__dirname, '..');


const appName = 'test-app';

export function newProject({ name = appName, flags = [] } = {}) {
  let dir;

  beforeAll(async () => {
    const tmpDir = (await tmp.dir()).path;
    dir = join(tmpDir, name);
    await execa({
      cwd: tmpDir,
    })`${localEmberCli} new ${name} -b ${blueprintPath} --skip-git --pnpm ${flags}`;
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

export function newProjectWithFixtures({
  flags = [],
  fixturePath,
  packageJson = {},
  name = appName,
} = {}) {
  let dir;

  assert(fixturePath, `a fixturePath is required`);

  beforeAll(async () => {
    const tmpDir = (await tmp.dir()).path;
    dir = join(tmpDir, name);
    await execa({
      cwd: tmpDir,
    })`${localEmberCli} new ${name} -b ${blueprintPath} --skip-git --pnpm ${flags}`;

    let addonFixture = fixturify.readSync(fixturePath);
    fixturify.writeSync(dir, addonFixture);

    await mergePackageJson(dir, packageJson);

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

async function mergePackageJson(dir, packageJson) {
  let rootKeys = Object.keys(packageJson || {});

  if (rootKeys.length === 0) {
    return;
  }

  let packageJsonPath = join(dir, 'package.json');
  let testPackageJson = JSON.parse(
    (await fs.readFile(packageJsonPath)).toString(),
  );

  for (let rootKey of rootKeys) {
    /**
     * For searchability in logs
     */
    console.log(`Modifying ${rootKey} in package.json @ ${packageJsonPath}`);
    let value = packageJson[rootKey];

    let isObject = typeof value === 'object' && !Array.isArray(value);
    if (!isObject) {
      throw new Error(`${rootKey} customization is currently not implemented`);
    }

    Object.assign(testPackageJson[rootKey], value);
  }

  await fs.writeFile(packageJsonPath, JSON.stringify(testPackageJson, null, 2));
}
