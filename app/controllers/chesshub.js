import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class ChesshubController extends Controller {
  @service auth;
  @service chess;

  @action
  async createGame() {
    await this.chess.create();
  }
}
