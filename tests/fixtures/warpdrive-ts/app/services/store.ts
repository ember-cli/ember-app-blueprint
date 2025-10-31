import { useLegacyStore } from '@warp-drive/legacy';
import { JSONAPICache } from '@warp-drive/json-api';
import { withDefaults } from '@warp-drive/legacy/model/migration-support';

const Store = useLegacyStore({
  linksMode: true,
  cache: JSONAPICache,
  handlers: [
    {
      async request<T>(): Promise<T> {
        return {
          data: {
            type: 'person',
            id: '1',
            attributes: { name: 'Luke Skywalker' },
          },
        } as T;
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

type Store = InstanceType<typeof Store>;

export default Store;
