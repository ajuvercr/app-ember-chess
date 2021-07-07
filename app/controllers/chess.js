import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class ChessController extends Controller {
  queryParams = ['position'];
}
