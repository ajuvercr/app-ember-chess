import { tracked } from '@glimmer/tracking';
import {
  calculateMoves,
  calculateStraightMoves,
  inRange,
  TileState,
  tileUsage,
  tileUsedBy,
} from '../utils/chess';

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

  static createPiece(type, params) {
    switch (type) {
      case PieceType.PAWN:
        return new Pawn(params);
      case PieceType.BISHOP:
        return new Bishop(params);
      case PieceType.KNIGHT:
        return new Knight(params);
      case PieceType.ROOK:
        return new Rook(params);
      case PieceType.QUEEN:
        return new Queen(params);
      case PieceType.KING:
        return new King(params);
    }
  }

  constructor({ id, x, y, game, isWhite }) {
    this.id = id;
    this.active = false;
    this.x = x;
    this.y = y;
    this.game = game;
    this.isWhite = isWhite;
  }

  move(x, y) {
    this.game.doMove(this.x, this.y, x, y);
    this.toggle();
  }

  toggle() {
    if (this.isWhite != this.game.isWhiteTurn) {
      this.options = [];
      this.game.options = [];
      this.active = false;
      return;
    }

    this.active = !this.active;
    this.options = this.active ? this.calculateOptions() : [];
    this.game.options = this.options;
  }

  calculateOptions() {
    return [];
  }
}

export class Pawn extends Piece {
  type = PieceType.PAWN;

  get delta() {
    return this.isWhite ? -1 : 1;
  }

  calculateOptions() {
    const startPos = this.isWhite ? 6 : 1;
    const firstMove = { x: this.x, y: this.y + this.delta, piece: this };
    const moves = [];

    if (tileUsedBy(
      this.game,
      firstMove,
      this.isWhite,
      TileState.EMPTY
    )) {
      moves.push(firstMove);
      const secondMove = { x: this.x, y: this.y + 2 * this.delta, piece: this };
      if (this.y == startPos && tileUsedBy(
        this.game,
        secondMove,
        this.isWhite,
        TileState.EMPTY
      )) {
        moves.push(secondMove);
      }
    }


    const attackLeft = { x: this.x + 1, y: this.y + this.delta, piece: this };
    if (
      tileUsedBy(
        this.game,
        attackLeft,
        this.isWhite,
        TileState.ENEMY,
        TileState.ENPASSANT
      )
    )
      moves.push(attackLeft);

    const attackRight = { x: this.x - 1, y: this.y + this.delta, piece: this };
    if (
      tileUsedBy(
        this.game,
        attackRight,
        this.isWhite,
        TileState.ENEMY,
        TileState.ENPASSANT
      )
    )
      moves.push(attackRight);

    return moves;
  }

  move(x, y) {
    // Took previous enpassant
    if (
      this.game.enpassant &&
      this.game.enpassant.x == x &&
      this.game.enpassant.y == y
    )
      this.game.doTake(this.game.enpassant.x, this.y);

    const enpassant =
      Math.abs(y - this.y) == 2
        ? { x: this.x, y: this.y + this.delta }
        : undefined;
    super.move(x, y);

    this.game.enpassant = enpassant;
  }
}

export class Bishop extends Piece {
  type = PieceType.BISHOP;

  calculateOptions() {
    const moves = [];
    for (let delta of [
      { x: 1, y: 1 },
      { x: -1, y: 1 },
      { x: 1, y: -1 },
      { x: -1, y: -1 },
    ]) {
      moves.push(...calculateStraightMoves(this.game, this, delta));
    }

    return moves;
  }
}

export class Knight extends Piece {
  type = PieceType.KNIGHT;

  calculateOptions() {
    const moves = [];

    // vertical big, horizontal small
    for (let d1 of [
      { x: 0, y: 2 },
      { x: 0, y: -2 },
    ]) {
      for (let d2 of [
        { x: 1, y: 0 },
        { x: -1, y: 0 },
      ]) {
        const current = { x: this.x + d2.x, y: this.y + d1.y, piece: this };
        if (
          inRange(current) &&
          tileUsedBy(
            this.game,
            current,
            this.isWhite,
            TileState.EMPTY,
            TileState.ENEMY
          )
        )
          moves.push(current);
      }
    }

    // horizontal big, vertical small
    for (let d1 of [
      { x: 2, y: 0 },
      { x: -2, y: 0 },
    ]) {
      for (let d2 of [
        { x: 0, y: 1 },
        { x: 0, y: -1 },
      ]) {
        const current = { x: this.x + d1.x, y: this.y + d2.y, piece: this };
        if (
          inRange(current) &&
          tileUsedBy(
            this.game,
            current,
            this.isWhite,
            TileState.EMPTY,
            TileState.ENEMY
          )
        )
          moves.push(current);
      }
    }

    return moves;
  }
}

export class Rook extends Piece {
  type = PieceType.ROOK;

  calculateOptions() {
    const moves = [];
    for (let delta of [
      { x: 0, y: 1 },
      { x: 0, y: -1 },
      { x: 1, y: 0 },
      { x: -1, y: 0 },
    ]) {
      moves.push(...calculateStraightMoves(this.game, this, delta));
    }

    return moves;
  }
}

export class Queen extends Piece {
  type = PieceType.QUEEN;

  calculateOptions() {
    const moves = [];
    for (let delta of [
      { x: 0, y: 1 },
      { x: 0, y: -1 },
      { x: 1, y: 0 },
      { x: -1, y: 0 },
      { x: 1, y: 1 },
      { x: -1, y: 1 },
      { x: 1, y: -1 },
      { x: -1, y: -1 },
    ]) {
      moves.push(...calculateStraightMoves(this.game, this, delta));
    }
    return moves;
  }
}

export class King extends Piece {
  type = PieceType.KING;

  calculateOptions() {
    return [
      { x: 0, y: 1 },
      { x: 0, y: -1 },
      { x: 1, y: 0 },
      { x: -1, y: 0 },
      { x: 1, y: 1 },
      { x: -1, y: 1 },
      { x: 1, y: -1 },
      { x: -1, y: -1 },
    ]
      .map((delta) => ({
        x: this.x + delta.x,
        y: this.y + delta.y,
        piece: this,
      }))
      .filter(inRange)
      .filter((current) =>
        tileUsedBy(
          this.game,
          current,
          this.isWhite,
          TileState.EMPTY,
          TileState.ENEMY
        )
      );
  }
}
