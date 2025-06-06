import Application from '<%= modulePrefix %>/app';
import config from '<%= modulePrefix %>/config/environment';
import * as QUnit from 'qunit';
import { setApplication, getSettledState, currentUrl, currentRouteName } from '@ember/test-helpers';
import { getPendingWaiterState } from '@ember/test-waiters';
import { setup } from 'qunit-dom';
import { start as qunitStart, setupEmberOnerrorValidation } from 'ember-qunit';

Object.assign(window, {
  getSettledState,
  getPendingWaiterState,
  currentURL,
  currentRouteName,
  snapshotTimers: (label?: string) => {
    const result = JSON.parse(
      JSON.stringify({
        settled: getSettledState(),
        waiters: getPendingWaiterState(),
      })
    );

    console.debug(label ?? 'snapshotTimers', result);

    return result;
  },
});

export function start() {
  setApplication(Application.create(config.APP));

  setup(QUnit.assert);
  setupEmberOnerrorValidation();

  qunitStart();
}
