import { tracked } from '@glimmer/tracking';
import { createGame } from '../utils/chess';
import Move from './move';

export default class GameMeta {
  @tracked black;
  @tracked white;

  constructor(
    { id, start, moves, black, white },
    relationships = {},
    chessService,
    authService
  ) {
    this.id = id;
    this.start = start;
    this.moves = moves || [];
    this.black = black;
    this.white = white;

    this.relationships = relationships;

    this.chess = chessService;
    this.auth = authService;
    this.inited = false;
  }

  init() {
    if (this.inited) return;
    this.inited = true;
    this.game = createGame(this.start, this);

    this.moves.sort((a, b) => a.index - b.index);
    for (let move of this.moves) {
      console.log(move.index, move);
      let { fromx, fromy, tox, toy } = move;
      this.game.doMove(fromx, fromy, tox, toy, false);
    }

    this.game.isWhiteTurn = this.moves.length % 2 == 0;
  }

  account_can_move(isWhiteTurn) {
    if (!this.auth.user.id) return false;

    if (isWhiteTurn) {
      return this.auth.user.id === this.white;
    } else {
      return this.auth.user.id === this.black;
    }
  }

  notify_move(move) {
    this.moves.push(move);
    this.chess.move(this.id, this.moves.length, move);
  }

  add_move(move) {
    if (move.index > this.moves.length) {
      this.moves.push(move);

      let { fromx, fromy, tox, toy } = move;

      this.game.doMove(fromx, fromy, tox, toy, false);
    }
  }
}
