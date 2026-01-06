import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class FancyRoute extends Route {
  @service router;
}
