import Service from '@ember/service';
import { tracked } from 'tracked-built-ins';
import fetch from 'fetch';

export default class AuthService extends Service {
  @tracked storage = {};

  constructor() {
    super(...arguments);
    this.storage.user = tracked({});
  }

  async _log(name, password, url) {}

  async _current(method) {
    const result = await fetch('/sessions/current', { method }).catch(
      (reason) => {
        var error = reason.responseJSON.errors[0].title;
        console.log('Current ' + method + ' failed: ' + error);
      }
    );

    console.log('_current');
    console.log(result);

    return result;
  }

  async login(name, password) {
    const result = await fetch('/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/vnd.api+json',
      },
      body: JSON.stringify({
        data: {
          type: 'sessions',
          attributes: {
            nickname: name,
            password: password,
          },
        },
      }),
    }).catch((reason) => {
      var error = reason.responseJSON.errors[0].title;
      console.log('Log /sessions failed: ' + error);
    });

    console.log('login', name, password, '/sessions');
    console.log(result);

    return result;
  }

  async logout() {
    return await this._current('DELETE');
  }

  async current() {
    return await this._current('GET');
  }

  async register(name, password) {
    const result = await fetch('/accounts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/vnd.api+json',
      },
      body: JSON.stringify({
        data: {
          type: 'accounts',
          attributes: {
            name: name,
            nickname: name,
            password: password,
            'password-confirmation': password,
          },
        },
      }),
    }).catch((reason) => {
      var error = reason.responseJSON.errors[0].title;
      console.log('Log /accounts failed: ' + error);
    });

    console.log('register', name, password, '/accounts');
    console.log(result);

    return result;
  }
}
