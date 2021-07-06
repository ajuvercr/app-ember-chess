import { tracked } from '@glimmer/tracking';

export default class Chess {
  @tracked at_white_turn;
  @tracked pieces;
  @tracked moves;

  constructor({ id, moves, pieces }, relationships = {}) {
    this.id = id;
    this.at_white_turn = true;
    this.moves = moves || [];
    this.pieces = pieces || [];
    this.relationships = relationships;
  }
}
