import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from 'tracked-built-ins';
import { inject as service } from '@ember/service';

function syntaxHighlight(json) {
  if (typeof json != 'string') {
    json = JSON.stringify(json, undefined, 2);
  }
  json = json
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    function (match) {
      var cls = 'number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'key';
        } else {
          cls = 'string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'boolean';
      } else if (/null/.test(match)) {
        cls = 'null';
      }
      return '<span class="' + cls + '">' + match + '</span>';
    }
  );
}

export default class FoobarController extends Controller {
  @service chess;

  constructor() {
    super(...arguments);
    this.test1text = 'foo';
    this.test2text = 'bar';
  }

  @action
  async test1(url, id) {
    console.log('HERE');
    let response = await fetch(url);
    let json = await response.json();
    console.log(json);
    document.getElementById(id).innerHTML = syntaxHighlight(json);
  }

  @action
  async test2(id) {
    let json = await this.chess.create();
    document.getElementById(id).innerHTML = syntaxHighlight(json);
    this.currentId = json.id;
  }

  @action
  async test3(id) {
    let json = await this.chess.move(this.currentId);
    document.getElementById(id).innerHTML = syntaxHighlight(json);
  }
}
