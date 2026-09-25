import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { sortPackageJson } from 'sort-package-json';

describe('package.json template', function () {
  it('is sorted', function () {
    let packageJsonPath = join(__dirname, '..', 'files', 'package.json');
    let packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

    // JSON.stringify is order-sensitive (unlike object deep-equal).
    expect(JSON.stringify(packageJson, null, 2)).toEqual(
      JSON.stringify(sortPackageJson(packageJson), null, 2),
    );
  });
});
