import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import fetch from 'fetch';

class User {
  @tracked name;
  constructor() {
    this.name = '';
    this.id = '';
  }

  reset() {
    this.name = '';
    this.id = undefined;
  }
}

export default class AuthService extends Service {
  user = new User();

  constructor() {
    super(...arguments);
  }

  async update_current() {
    const result = await this._current();
    if (result.status != 200) {
      console.log('invalid session');
      this.user.reset();
      return;
    }

    const session = await result.json();

    const account_id = session.relationships.account.data.id;
    this.user.id = account_id;
    const query = `
    PREFIX  mu:  <http://mu.semte.ch/vocabularies/>
    PREFIX  muCore:  <http://mu.semte.ch/vocabularies/core/>
    PREFIX  muExt:  <http://mu.semte.ch/vocabularies/ext/>
    PREFIX  session:  <http://mu.semte.ch/vocabularies/session/>
    PREFIX  sh:  <http://schema.org/>
    PREFIX  foaf:  <http://xmlns.com/foaf/0.1/>

    SELECT ?name  WHERE
    {
        ?a muCore:uuid '${account_id}';
          foaf:accountName ?name.
    }`;

    const sparql = await fetch('/sparql', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: new URLSearchParams({
        query,
      }),
    });
    const account = await sparql.json();

    const bindings = account.results.bindings;
    if (bindings.length) this.user.name = bindings[0].name.value;
    else this.user.reset();
  }

  async _log(name, password, url) {}

  async _current(method) {
    const result = await fetch('/sessions/current', { method }).catch(
      (reason) => {
        var error = reason.responseJSON.errors[0].title;
        console.log('Current ' + method + ' failed: ' + error);
      }
    );

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

    this.update_current();

    return result;
  }

  async logout() {
    const result = await this._current('DELETE');
    this.update_current();
    return result;
  }

  async current() {
    await this.update_current();
    return this.user;
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
