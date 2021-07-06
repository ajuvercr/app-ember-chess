import { tracked } from '@glimmer/tracking';

export const piece_type = {
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

  constructor({ id, type, x, y, game }, relationships = {}) {
    this.id = id;
    this.type = type;
    this.active = false;
    this.options = [];
    this.x = x;
    this.y = y;
    this.game = game;
    this.relationships = relationships;
  }

  activate() {
    this.active = true;
    this.options = this.calculateOptions();
  }

  deactivate() {
    this.active = false;
    this.options = [];
  }

  // TODO make piece and game dependant
  calculateOptions() {
    let options = [];

    for (let [dx, dy] in [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
    ]) {
      let x = dx + this.x;
      let y = dy + this.y;
      if (x < 0 || y < 0 || x >= 8 || y >= 8) continue;
      options.push({ x, y });
    }

    return options;
  }
}
