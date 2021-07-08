import Chess from '../models/chess';
import Piece, { PieceType } from '../models/piece';

const typeDict = {
  p: PieceType.PAWN,
  r: PieceType.ROOK,
  n: PieceType.KNIGHT,
  k: PieceType.KING,
  b: PieceType.BISHOP,
  q: PieceType.QUEEN,
};

export function createGame(input, meta) {
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
      pieces.push(Piece.createPiece(type, { x: col, y: 7 - row, isWhite }));
      col++;
    } else {
      col += parseInt(char);
    }
  }

  const isWhiteTurn = input[i + 2] == 'w';

  const game = new Chess({ pieces, isWhiteTurn });
  for (let piece of pieces) piece.game = game;
  game.meta = meta;

  return game;
}

export const TileState = {
  EMPTY: 'empty',
  ENEMY: 'enemy',
  FRIENDLY: 'friendly',
  ENPASSANT: 'enpassant',
};

export function tileUsage(game, option, isWhite) {
  if (game.enpassant)
    console.log(
      game.enpassant,
      game.enpassant.x,
      option.x,
      game.enpassant.y,
      option.y
    );
  if (
    game.enpassant &&
    game.enpassant.x == option.x &&
    game.enpassant.y == option.y
  )
    return TileState.ENPASSANT;

  for (let piece of game.pieces) {
    if (piece.x == option.x && piece.y == option.y) {
      return isWhite == piece.isWhite ? TileState.FRIENDLY : TileState.ENEMY;
    }
  }

  return TileState.EMPTY;
}

export function tileUsedBy(game, option, isWhite, ...options) {
  const usage = tileUsage(game, option, isWhite);
  return options.some((x) => x == usage);
}

export function calculateMoves(piece, game) {
  switch (piece.type) {
    case PieceType.PAWN:
      return calculateMovesPawn(piece, game);
    default:
      return [];
  }
}

export function inRange({ x, y }) {
  return !isNaN(x) && !isNaN(y) && x >= 0 && y >= 0 && x < 8 && y < 8;
}

export function calculateStraightMoves(game, piece, delta) {
  const moves = [];

  let current = { x: piece.x + delta.x, y: piece.y + delta.y };
  while (
    inRange(current) &&
    tileUsedBy(game, current, piece.isWhite, TileState.EMPTY)
  ) {
    moves.push({ x: current.x, y: current.y, piece });
    current.x += delta.x;
    current.y += delta.y;
  }

  if (
    inRange(current) &&
    tileUsedBy(game, current, piece.isWhite, TileState.ENEMY)
  )
    moves.push({ x: current.x, y: current.y, piece });

  console.log(moves);
  return moves;
}
