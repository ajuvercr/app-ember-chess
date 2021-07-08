import Route from '@ember/routing/route';
import { createGame } from '../utils/chess';
import { inject as service } from '@ember/service';

export default class ChessRoute extends Route {
  @service chess;

  queryParams = {
    position: {
      as: 's',
    },
  };

  async model() {
    await this.chess.fetchAll('/games');
    for(let chess in this.chess.storage.games)
    {
      this.chess.storage.games[chess].init();
    }
    return this.chess.storage.games;
  }
}
