import { helper } from '@ember/component/helper';

export function isodd(number) {
  return Number(number) % 2 == 0;
}

export default helper(isodd);
