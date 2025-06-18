import Application from '@ember/application';<% if (compat) { %>
import compatModules from '@embroider/virtual/compat-modules';<% } else { %>
import { registry } from './registry.ts';<% } %>
import Resolver from 'ember-resolver';<% if (compat) %>
import loadInitializers from 'ember-load-initializers';<% } %>
import config from '<%= modulePrefix %>/config/environment';
import { importSync, isDevelopingApp, macroCondition } from '@embroider/macros';

if (macroCondition(isDevelopingApp())) {
  importSync('./deprecation-workflow');
}

export default class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;<% if (compat) { %>
  Resolver = Resolver.withModules(compatModules);<% } else { %>
  Resolver = Resolver.withModules(registry);<% } %>
}
<% if (compat) { %>
loadInitializers(App, config.modulePrefix, compatModules);<% } %>
