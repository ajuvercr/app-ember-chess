import Route from '@ember/routing/route';
import { createGame } from '../utils/chess';

export default class ChessRoute extends Route {
  queryParams = {
    position: {
      as: 's',
    },
  };

  model(params, transition) {
    const input =
      params.position ??
      'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    return createGame(input);
  }

  resetController(controller) {
    controller.currentPiece = undefined;
  }
}
