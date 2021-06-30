import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import Band from 'rarwe/models/band';
import fetch from 'fetch';

export default class BandsRoute extends Route {
    @service catalog;

    model() {
        return this.catalog.fetchAll('bands');
    }
}
