/**
 * This file is used to ensure that `eslint.config.mjs` is properly configured
 * to apply `typescript-eslint`'s recommended rules to `.ts` files. It ensures
 * that:
 *
 * - `no-undef` is disabled (otherwise the undefined symbol would cause a
 *   linting error)
 * - `@typescript-eslint/no-unsafe-return` is enabled (otherwise the
 *   `eslint-disable-next-line` comment would cause a linting error)
 */
export default function () {
  // @ts-expect-error testing lint
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return notDefined;
}
