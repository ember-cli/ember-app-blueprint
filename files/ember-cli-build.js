'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const { compatBuild } = require('@embroider/compat');

module.exports = async function (defaults) {
  <% if (warpDrive) {%>const { setConfig } = await import('@warp-drive/core/build-config');
  <% } %>const { buildOnce } = await import('@embroider/vite');

  let app = new EmberApp(defaults, {
    // Add options here
  });
<% if (warpDrive) {%>
  setConfig(app, __dirname, {
    // this should be the most recent <major>.<minor> version for
    // which all deprecations have been fully resolved
    // and should be updated when that changes
    compatWith: '5.8',
    deprecations: {
      // ... list individual deprecations that have been resolved here
    }
  });
<% } %>
  return compatBuild(app, buildOnce);
};
