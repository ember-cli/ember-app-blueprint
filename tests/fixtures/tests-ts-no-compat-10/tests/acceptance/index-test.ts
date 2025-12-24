import { module, test } from 'qunit';
import { visit, currentURL, click } from '@ember/test-helpers';
import { setupApplicationTest } from 'test-app/tests/helpers';

module('Acceptance | index', function (hooks) {
  setupApplicationTest(hooks);

  test('visiting /', async function (assert) {
    await visit('/');

    assert.strictEqual(currentURL(), '/');

    await click('[data-test-a]');

    assert.strictEqual(currentURL(), '/fancy');

    assert.dom('p').hasText('Fancy');

    assert.dom('p.purple').hasStyle(
      {
        'color': 'rgb(102, 51, 153)',
      },
      'The text should be purple if the app styles are working correctly',
    )
  });
});
