import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import wait from 'rarwe/utils/wait';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class BandsBandSongsRoute extends Route {
  @service catalog;

  async model() {
    let band = this.modelFor('bands.band');
    // await wait(3000);
    await this.catalog.fetchRelated(band, 'songs', 'band');
    return band;
  }

  resetController(controller) {
    controller.title = '';
    controller.showAddSong = true;
  }
}
