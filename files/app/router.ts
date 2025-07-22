import EmberRouter from '@embroider/router';
import config from '<%= modulePrefix %>/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {<% if (typescript) { %>
  // Add route declarations here
<% } %>});
