export default class Move {
  constructor({ id, game, from_x, from_y, to_x, to_y }, relationships = {}) {
    this.id = id;
    this.game = game;
    this.from_x = from_x;
    this.from_y = from_y;
    this.to_x = to_x;
    this.to_y = to_y;
    this.relationships = relationships;
  }
}
