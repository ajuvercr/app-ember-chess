import Controller from '@ember/controller';

import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

import { inject as service } from '@ember/service';

export default class BandsNewController extends Controller {
  @service catalog;
  @service router;

  @tracked name;
  @tracked description;

  constructor() {
    super(...arguments);
    this.router.on('routeWillChange', (transition) => {
      if (this.confirmedLeave || transition.isAborted) {
        return;
      }
      if (transition.from.name === 'bands.new') {
        if (this.name) {
          let leave = window.confirm(
            'You have unsaved changes. Are you sure ? '
          );
          if (leave) {
            this.confirmedLeave = true;
          } else {
            transition.abort();
          }
        }
      }
    });
  }

  @action
  updateName(event) {
    this.name = event.target.value;
  }

  @action
  updateDesc(event) {
    this.description = event.target.value;
  }

  @action
  async saveBand() {
    let band = await this.catalog.create('band', {
      name: this.name,
      description: this.description,
    });
    this.confirmedLeave = true;
    this.router.transitionTo('bands.band', band.id);
  }
}
