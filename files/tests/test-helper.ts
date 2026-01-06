<% if (warpDrive) { %>import '@warp-drive/ember/install';<% } %>
import Application from '<%= modulePrefix %>/app';
import config<% if (noCompat) {%>, { enterTestMode }<% } %> from '<%= modulePrefix %>/config/environment';
import * as QUnit from 'qunit';
import { setApplication } from '@ember/test-helpers';
import { setup } from 'qunit-dom';
import { start as qunitStart, setupEmberOnerrorValidation } from 'ember-qunit';

export function start() {
  <% if (noCompat) { %>enterTestMode();
  <% } %>setApplication(Application.create(config.APP));

  setup(QUnit.assert);
  setupEmberOnerrorValidation();

  qunitStart();
}
