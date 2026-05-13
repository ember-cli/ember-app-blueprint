<<<<<<< HEAD
<% if (warpDrive) { %>import '@warp-drive/ember/install';
<% } %>import Application from '<%= modulePrefix %>/app';
import config from '<%= modulePrefix %>/config/environment';
||||||| 87dd08b (Merge pull request #49 from ember-cli/nvp/minimal-flag-non-default)
<% if (warpDrive) { %>import '@warp-drive/ember/install';<% } %>
import Application from '<%= modulePrefix %>/app';
import config<% if (noCompat) {%>, { enterTestMode }<% } %> from '<%= modulePrefix %>/config/environment';
=======
<% if (warpDrive) { %>import '@warp-drive/ember/install';<% } %>
import Application from '<%= modulePrefix %>/app';
import config from '<%= modulePrefix %>/config/environment';
>>>>>>> parent of 87dd08b (Merge pull request #49 from ember-cli/nvp/minimal-flag-non-default)
import * as QUnit from 'qunit';
import { setApplication } from '@ember/test-helpers';
import { setup } from 'qunit-dom';
import { start as qunitStart, setupEmberOnerrorValidation } from 'ember-qunit';

export function start() {
  setApplication(Application.create(config.APP));

  setup(QUnit.assert);
  setupEmberOnerrorValidation();

  qunitStart();
}
