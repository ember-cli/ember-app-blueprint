import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class ApplicationRoute extends Route {
  @service store;

  model() {
    return {
      person: this.store.request({
        url: 'https://swapi.dev/api/people/1'
      })
    };
  }
}
