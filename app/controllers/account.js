import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from 'tracked-built-ins';
import { action } from '@ember/object';

class Data {
  @tracked name;
  @tracked password;
  constructor() {
    this.name = '';
    this.password = '';
  }
}

export default class AccountController extends Controller {
  @service auth;
  @service router;

  @tracked login = new Data();
  @tracked register = new Data();

  @action
  updateName(type, event) {
    const v = type === 'login' ? this.login : this.register;
    console.log('update name ', type, event.target.value);
    v['name'] = event.target.value;
  }

  @action
  updatePw(type, event) {
    const v = type === 'login' ? this.login : this.register;
    console.log('update pw ', type, event.target.value);
    v['password'] = event.target.value;
  }

  @action
  async doLogin() {
    console.log('Logging in');
    await this.auth.login(this.login.name, this.login.password);
    this.login = new Data();
    if(this.auth.user.id)
    {
      console.log("here");
      this.router.transitionTo('chesshub');
    }
  }

  @action
  async doRegister() {
    console.log('registering');
    await this.auth.register(this.register.name, this.register.password);
    this.register = new Data();
  }

  @action
  async checkCurrent() {
    this.auth.current().then(console.log);
  }

  @action
  async doLogout() {
    this.auth.logout().then(console.log);
  }
}
