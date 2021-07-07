import Component from '@glimmer/component';

export default class TimesComponent extends Component {
  get times() {
    const times = this.args.times ?? 1;
    return Array.apply(null, Array(times)).map(function (x, i) {
      return i;
    });
  }
}
