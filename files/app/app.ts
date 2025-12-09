<% if (warpDrive) { %>import '@warp-drive/ember/install';<% } %><% if (compat) { %>
import Application from '@ember/application';
import compatModules from '@embroider/virtual/compat-modules';
import Resolver from 'ember-resolver';
import loadInitializers from 'ember-load-initializers';<% } else { %>
  import Application from 'ember-strict-application-resolver';<% } %>
import config from '<%= modulePrefix %>/config/environment';<% if (notMinimal) { %>
import { importSync, isDevelopingApp, macroCondition } from '@embroider/macros';< } %>
import setupInspector from '@embroider/legacy-inspector-support/ember-source-4.12';

<% if (notMinimal) { %>
if (macroCondition(isDevelopingApp())) {
  importSync('./deprecation-workflow');
}
<% } %>


export default class App extends Application {
<% if (compat) {%>  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver.withModules(compatModules);
<% } %>  inspector = setupInspector(this);
<% if (noCompat) { %>
  modules = {
    ...import.meta.glob('./router', { eager: true }),
    ...import.meta.glob('./templates/**/*', { eager: true }),
  }
<% } %>
}
<% if (compat) { %>
loadInitializers(App, config.modulePrefix, compatModules);
<% } %>
