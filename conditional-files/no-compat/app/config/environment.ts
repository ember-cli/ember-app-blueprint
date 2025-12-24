<% if (notMinimal) { %><% if (typescript) { %>// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
<% } %>import { getGlobalConfig } from '@embroider/macros/src/addon/runtime';
<% } %>
interface Config {
  isTesting?: boolean;
  environment: string;
  modulePrefix: string;
  podModulePrefix?: string;
  locationType: 'history' | 'hash' | 'none' | 'auto';
  rootURL: string;
  EmberENV?: Record<string, unknown>;
  APP: Record<string, unknown> & { rootElement?: string; autoboot?: boolean };
}

const ENV: Config = {
  modulePrefix: '<%= name %>',
  environment: import.meta.env.DEV ? 'development' : 'production',
  rootURL: '/',
  locationType: 'history',
  EmberENV: {},
  APP: {},
};

export default ENV;
<% if (notMinimal) { %>
export function enterTestMode() {
  ENV.locationType = 'none';
  ENV.APP.rootElement = '#ember-testing';
  ENV.APP.autoboot = false;

  <% if (typescript) { %>// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  <% } %>const config = getGlobalConfig()['@embroider/macros'];

  <% if (typescript) { %>// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  <% } %>if (config) config.isTesting = true;
}
<% } %>