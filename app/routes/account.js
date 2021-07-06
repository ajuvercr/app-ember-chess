import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class AccountRoute extends Route {
  @service auth;

  model() {
    this.auth.current().then(console.log);
    const current = 'meee';

    return { current };
  }
}
