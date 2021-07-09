import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ChessController extends Controller {
  @service auth;
  @service chess;

  queryParams = ['position'];

  @action
  setWhite(metaid, playerid) {
    this.chess.updateGame(metaid, { white: playerid });
  }

  @action
  setBlack(metaid, playerid) {
    this.chess.updateGame(metaid, { black: playerid });
  }
}
