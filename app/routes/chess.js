import Route from '@ember/routing/route';

export default class ChessRoute extends Route {
  queryParams = {
    position: {
      as: 's',
    },
  };

  model(params, transition) {
    console.log(params.position, transition);
    return params.position;
  }
}
