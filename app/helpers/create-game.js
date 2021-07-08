import { helper } from '@ember/component/helper';
import { createGame as inner } from '../utils/chess';

export function createGame(input) {
  return inner(input[0]);
}

export default helper(createGame);
