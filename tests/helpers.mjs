import { execa } from 'execa';
import tmp from 'tmp-promise';
import { join } from 'node:path';
import fixturify from 'fixturify';

let localEmberCli = require.resolve('ember-cli/bin/ember');
const blueprintPath = join(__dirname, '..');

export async function generateApp({
  name = 'test-app',
  flags = [],
  skipNpm = true,
} = {}) {
  const tmpDir = (await tmp.dir()).path;
  const dir = join(tmpDir, name);

  if (skipNpm) {
    flags.push('--skip-npm');
  }

  const execaOptions = {
    cwd: tmpDir,
  };

  if (!process.env.CI) {
    execaOptions.stdio = 'inherit';
  }

  const { stdout, stderr } = await execa(
    localEmberCli,
    ['new', name, '--blueprint', blueprintPath, '--skip-git', ...flags],
    execaOptions,
  );

  return {
    stdout,
    stderr,
    name,
    dir,
    get files() {
      return fixturify.readSync(dir);
    },
    execa: (program, args, options = {}) => {
      return execa(program, args, {
        cwd: dir,
        ...options,
      });
    },
  };
}
