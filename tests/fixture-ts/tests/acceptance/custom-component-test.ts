import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'test-app/tests/helpers';

module('Acceptance | custom-component page', function (hooks) {
  setupApplicationTest(hooks);

  test('visiting /custom-component', async function (assert) {
    await visit('/custom-component');

    assert.strictEqual(currentURL(), '/custom-component');
    assert.dom('#custom-component').containsText('I am a custom component');
  });
})
