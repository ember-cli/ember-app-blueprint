'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const { compatBuild } = require('@embroider/compat');

module.exports = async function (defaults) {
  const { buildOnce } = await import('@embroider/vite');
  const { setConfig } = await import('@warp-drive/core/build-config');

  let app = new EmberApp(defaults, {
    // Add options here
  });

  <% if (emberdata) { %>setConfig(app, __dirname, {
    // this should be the most recent <major>.<minor> version for
    // which all deprecations have been fully resolved
    // and should be updated when that changes
    // for new apps it should be the version you installed
    compatWith: '5.6'
  });<% }%>

  return compatBuild(app, buildOnce);
};
