import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { withReactiveResponse } from '@warp-drive/core/request';
import type { Type } from '@warp-drive/core/types/symbols';
import type Store from 'my-test-app2/services/store';

export interface Person {
  id: string;
  $type: 'person';
  name: string;
  [Type]: 'person';
}

export default class ApplicationRoute extends Route {
  @service declare store: Store;

  model() {
    return {
      person: this.store.request(
        withReactiveResponse<Person>({
          url: 'https://swapi.dev/api/people/1'
        })
      )
    };
  }
}
