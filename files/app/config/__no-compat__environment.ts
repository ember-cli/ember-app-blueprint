import { getGlobalConfig } from '@embroider/macros/src/addon/runtime';

const ENV = {
  modulePrefix: 'limber',
  environment: import.meta.env.DEV ? 'development' : 'production',
  rootURL: '/',
  locationType: 'history',
  EmberENV: {},
  APP: {},
} as {
  environment: string;
  modulePrefix: string;
  podModulePrefix?: string;
  locationType: 'history' | 'hash' | 'none';
  rootURL: string;
  EmberENV: Record<string, unknown>;
  APP: Record<string, unknown>;
};

export default ENV;

export function enterTestMode() {
  ENV.locationType = 'none';
  ENV.APP.rootElement = '#ember-testing';
  ENV.APP.autoboot = false;

  let config = getGlobalConfig()['@embroider/macros'];

  if (config) config.isTesting = true;
}
