import { tracked } from '@glimmer/tracking';
import Move from './move';

export default class Chess {
  @tracked isWhiteTurn;
  @tracked pieces;
  @tracked moves;
  @tracked options;

  constructor({ id, moves, pieces, options }, relationships = {}) {
    this.id = id;
    this.isWhiteTurn = true;
    this.moves = moves || [];
    this.pieces = pieces || [];
    this.options = options || [];
    this.relationships = relationships;
  }

  doMove(from_x, from_y, to_x, to_y) {
    this.enpassant = undefined;
    this.isWhiteTurn = !this.isWhiteTurn;
    this.moves.push(new Move({ from_x, from_y, to_x, to_y }));
  }

  doTake(x, y)
  {
    console.log("do take", x, y, this.pieces.length);
    this.pieces = this.pieces.filter(piece => piece.x != x || piece.y != y);
    console.log(this.pieces.length);
  }
}
