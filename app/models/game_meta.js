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

        this.moves.sort((a, b) => a.index - b.index);
        for (let move of this.moves) {
            console.log(move.index, move);
            let { fromx, fromy, tox, toy } = move;
            this.game.doMove(fromx, fromy, tox, toy,false);
        }

        this.game.isWhiteTurn = this.moves.length % 2 == 0;
    }


    notify_move(move) {
        this.moves.push(move);
        this.chess.move(this.id, this.moves.length, move);
    }

    add_move(move)
    {
        if(move.index > this.moves.length)
        {
            this.moves.push(move);

            let { fromx, fromy, tox, toy } = move;

            this.game.doMove(fromx, fromy, tox, toy, false);
        }
    }
}
