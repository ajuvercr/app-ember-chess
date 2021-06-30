import Application from '@ember/application';
import Resolver from 'ember-resolver';
import loadInitializers from 'ember-load-initializers';
import config from 'rarwe/config/environment';

export default class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver;
}

loadInitializers(App, config.modulePrefix);


const alreadyShownFactory = () => {
  let alreadyShown = [];
  return (msg, test, opt) => {
    if (test)
      return false;

    if( alreadyShown.indexOf(msg) === -1 ) {
      let warning = 'DEPRECATION: ' + msg;
      if(opt && opt.url) {
        warning += ' See: ' + opt.url;
      }
      console.warn(warning);
      alreadyShown.push(msg);
    }
  };
};

Ember.deprecate = alreadyShownFactory();
Ember.warn = alreadyShownFactory();

//see https://guides.emberjs.com/v2.3.0/configuring-ember/handling-deprecations/
Ember.Debug.registerDeprecationHandler((() => {
  let alreadyShown = [];
  return (message, options, next) => {
    if(alreadyShown.indexOf(message) === -1) {
      next(message, options);
      alreadyShown.push(message);
    }
  };
})());
