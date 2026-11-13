import { useRecommendedStore } from '@warp-drive/core';
import { JSONAPICache } from '@warp-drive/json-api';
import { withDefaults } from '@warp-drive/core/reactive';

const Store = useRecommendedStore({
  cache: JSONAPICache,
  handlers: [
    {
      request() {
        return Promise.resolve({
          data: {
            type: 'person',
            id: '1',
            attributes: { name: 'Luke Skywalker' },
          },
        });
      },
    },
  ],
  schemas: [
    // -- your schemas here
    withDefaults({
      type: 'person',
      fields: [{ kind: 'field', name: 'name' }],
    }),
  ],
});

export default Store;
