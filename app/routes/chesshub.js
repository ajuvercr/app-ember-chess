import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class ChesshubRoute extends Route {
  @service chess;

  async model() {
    await this.chess.fetchAll('/games');
    for (let chess in this.chess.storage.games) {
      this.chess.storage.games[chess].init();
    }
    return this.chess.storage.games;
  }
}
