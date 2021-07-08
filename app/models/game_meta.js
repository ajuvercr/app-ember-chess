import { tracked } from '@glimmer/tracking';
import { createGame } from '../utils/chess';
import Move from './move';
import { inject as service } from '@ember/service';

export default class GameMeta {
    constructor({ id, start, moves }, relationships = {}, chessService) {
        this.id = id;
        this.start = start;
        this.moves = moves || [];
        this.relationships = relationships;

        this.chess = chessService;
    }

    init()
    {
        this.game = createGame(this.start, this);

        for (let move of this.moves) {
            let { fromx, fromy, tox, toy } = move;
            this.game.applyMove(fromx, fromy, tox, toy);
        }

        this.game.isWhiteTurn = this.moves.length % 2 == 0;
    }


    notify_move(move) {
        this.chess.move(this.id, move);
    }
}
