export default class Move {
  constructor({ id, game, fromx, fromy, tox, toy, index }, relationships = {}) {
    this.id = id;
    this.game = game;
    this.fromx = fromx;
    this.fromy = fromy;
    this.tox = tox;
    this.toy = toy;
    this.index = index;
    this.relationships = relationships;
  }
}
