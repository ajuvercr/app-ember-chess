import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class ChessRoute extends Route {
  @service chess;

  async model({ id }) {
    const out = await this.chess.fetch('games', id);
    out.init();
    return out;
  }
}
