import { module, test } from 'qunit';
import { setupTest } from 'test-app/tests/helpers';

module('Unit | Adapter | post', function (hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function (assert) {
    const adapter = this.owner.lookup('adapter:post');
    assert.ok(adapter, 'adapter exists');
  });
});
