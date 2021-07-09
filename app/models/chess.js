import { tracked } from '@glimmer/tracking';
import Move from './move';

export default class Chess {
  @tracked isWhiteTurn;
  @tracked pieces;
  @tracked options;

  constructor({ id, pieces, options }, relationships = {}) {
    this.id = id;
    this.isWhiteTurn = true;
    this.pieces = pieces || [];
    this.options = options || [];
    this.relationships = relationships;
  }

  canMove(whitePiece) {
    if (this.isWhiteTurn != whitePiece) return false;
    return this.meta.account_can_move(this.isWhiteTurn);
  }

  applyMove(fromx, fromy, tox, toy) {
    this.doTake(tox, toy);
    for (let piece of this.pieces) {
      if (piece.x === fromx && piece.y === fromy) {
        piece.x = tox;
        piece.y = toy;
        return;
      }
    }
    console.error('Move not found');
  }

  doMove(fromx, fromy, tox, toy, notify_meta = true) {
    this.enpassant = undefined;
    this.isWhiteTurn = !this.isWhiteTurn;
    this.applyMove(fromx, fromy, tox, toy);

    if (notify_meta)
      this.meta.notify_move(new Move({ fromx, fromy, tox, toy }));
  }

  doTake(x, y) {
    this.pieces = this.pieces.filter((piece) => piece.x != x || piece.y != y);
  }
}
