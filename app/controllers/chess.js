import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class ChessController extends Controller {
  queryParams = ['position'];
  currentPiece = undefined;

  @action
  toggleActive(piece) {
    for (let p of piece.game.pieces) {
      if (p == piece) continue;
      else p.active = false
    }
    piece.toggle();
    this.currentPiece = piece.active ? piece : undefined;
  }

  @action
  clickOption(x, y)
  {
    if(this.currentPiece)
    {
      this.currentPiece.game.doMove(this.currentPiece.x, this.currentPiece.y, x, y);

      this.currentPiece.x = x;
      this.currentPiece.y = y;
      this.currentPiece.toggle();
      this.currentPiece = undefined;
    }
  }
}
