import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { visit } from '@ember/test-helpers';

module('Application | index', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting / shows welcome message', async function(assert) {
    await visit('/');

    assert.dom('h1').hasText('Welcome Luke Skywalker');
  });
});
