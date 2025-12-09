<% if (warpDrive) { %>import '@warp-drive/ember/install';
import Application from 'ember-strict-application-resolver';
import config from '<%= modulePrefix %>/config/environment';<% if (notMinimal) { %>
import { importSync, isDevelopingApp, macroCondition } from '@embroider/macros';< } %>
import setupInspector from '@embroider/legacy-inspector-support/ember-source-4.12';

<% if (notMinimal) { %>
if (macroCondition(isDevelopingApp())) {
  importSync('./deprecation-workflow');
}
<% } %>


export default class App extends Application {
  modules = {
    ...import.meta.glob('./router.*', { eager: true }),
    ...import.meta.glob('./templates/**/*', { eager: true }),
    ...import.meta.glob('./services/**/*', { eager: true }),
  }
}
