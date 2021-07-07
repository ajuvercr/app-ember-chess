import { tracked } from '@glimmer/tracking';

export const PieceType = {
  PAWN: 'pawn',
  BISHOP: 'bishop',
  KNIGHT: 'knight',
  ROOK: 'rook',
  QUEEN: 'queen',
  KING: 'king',
};

export default class Piece {
  @tracked x;
  @tracked y;
  @tracked active;
  @tracked options;

  constructor({ id, type, x, y, game, isWhite }, relationships = {}) {
    this.id = id;
    this.type = type;
    this.active = false;
    this.options = [];
    this.x = x;
    this.y = y;
    this.game = game;
    this.isWhite = isWhite;
    this.relationships = relationships;
  }

  toggle() {
    if(this.isWhite != this.game.isWhiteTurn)
    {
      this.options = [];
      this.game.options = [];
      this.active = false;
      return;
    }

    this.active = !this.active;
    this.options = this.active ? this.calculateOptions() : [];
    this.game.options = this.options;
  }


  // TODO make piece and game dependant
  calculateOptions() {
    let options = [];

    for (let [dx, dy] of [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
    ]) {
      let x = dx + this.x;
      let y = dy + this.y;

      if (x < 0 || y < 0 || x >= 8 || y >= 8) continue;
      options.push({ x, y, piece: this });
    }

    return options;
  }
}
