import Route from '@ember/routing/route';
import Chess from '../models/chess';
import Piece, { PieceType } from '../models/piece';

const typeDict = {
  'p': PieceType.PAWN,
  'r': PieceType.ROOK,
  'n': PieceType.KNIGHT,
  'k': PieceType.KING,
  'b': PieceType.BISHOP,
  'q': PieceType.QUEEN
}

export default class ChessRoute extends Route {
  queryParams = {
    position: {
      as: 's',
    },
  };

  model(params, transition) {
    const input = params.position ?? "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    const pieces = [];

    let row = 0;
    let col = 0;
    let i = 0;

    for (i = 0; i < input.length; i++) {
      const char = input[i];
      if (char == ' ') break;
      if (char == '/') {
        row++;
        col = 0;
        continue;
      }

      if (isNaN(char)) {
        // parse character to piece
        const isWhite = char == char.toLowerCase();
        const type = typeDict[char.toLowerCase()];
        pieces.push(new Piece({ x: col, y: 7 - row, type, isWhite }));
        col++;
      } else {
        col += parseInt(char);
      }
    }

    const isWhiteTurn = input[i+2] == 'w';

    const game = new Chess({ pieces, isWhiteTurn });
    for (let piece of pieces)
      piece.game = game;

    return game;
  }

  resetController(controller) {
    controller.currentPiece = undefined;
  }
}
