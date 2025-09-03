import { defineConfig } from 'vitest/config';

const ONE_SECOND = 1_000;

export default defineConfig({
  test: {
    testTimeout: 240 * ONE_SECOND,
    hookTimeout: 240 * ONE_SECOND,
  },
});
