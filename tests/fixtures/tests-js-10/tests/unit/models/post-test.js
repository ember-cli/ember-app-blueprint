import { module, test } from 'qunit';
import { setupTest } from 'test-app/tests/helpers';

module('Unit | Model | post', function (hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function (assert) {
    const store = this.owner.lookup('service:store');
    const model = store.createRecord('post', {});
    assert.ok(model, 'model exists');
  });
});
