import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function sortedCopy(value) {
  if (Array.isArray(value)) {
    return value.map(sortedCopy);
  }

  if (isObject(value)) {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, sortedCopy(value[key])]),
    );
  }

  return value;
}

describe('package.json template', function () {
  it('is sorted', function () {
    let packageJsonPath = join(__dirname, '..', 'files', 'package.json');
    let packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

    expect(packageJson).toEqual(sortedCopy(packageJson));
  });
});
