<% if (warpDrive) { %>import '@warp-drive/ember/install';<% } %>
import Application from '@ember/application';
import compatModules from '@embroider/virtual/compat-modules';
import Resolver from 'ember-resolver';<% if (compat) { %>
import loadInitializers from 'ember-load-initializers';<% } %>
import config from '<%= modulePrefix %>/config/environment';<% if (notMinimal) { %>
import { importSync, isDevelopingApp, macroCondition } from '@embroider/macros';< } %>
import setupInspector from '@embroider/legacy-inspector-support/ember-source-4.12';

<% if (notMinimal) { %>
if (macroCondition(isDevelopingApp())) {
  importSync('./deprecation-workflow');
}
<% } %>


export default class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver.withModules(compatModules);
  inspector = setupInspector(this);
}
<% if (compat) { %>
loadInitializers(App, config.modulePrefix, compatModules);
<% } %>
