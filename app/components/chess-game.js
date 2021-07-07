import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class ChessGameComponent extends Component {
  currentPiece = undefined;

  @action
  toggleActive(piece) {
    for (let p of piece.game.pieces) {
      if (p == piece) continue;
      else p.active = false;
    }
    piece.toggle();
    this.currentPiece = piece.active ? piece : undefined;
  }

  @action
  clickOption(x, y) {
    if (this.currentPiece) {
        this.currentPiece.move(x, y);
      this.currentPiece = undefined;
    }
  }

  @action
  resetClick() {
    if(this.currentPiece) this.currentPiece.toggle();
  }
}
