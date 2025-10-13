import { defineConfig } from 'vitest/config';

const ONE_SECOND = 1_000;

export default defineConfig({
  /**
   * add a 6x factor for windows tests... because windows 😭
   */
  test: {
    testTimeout: 240 * ONE_SECOND * (process.platform === 'win32' ? 6 : 1),
    hookTimeout: 240 * ONE_SECOND * (process.platform === 'win32' ? 6 : 1),
  },
});
