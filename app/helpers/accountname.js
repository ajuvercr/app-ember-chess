import { helper } from '@ember/component/helper';

export async function accountname(id) {
  if (!id) return "";

  const query = `
  PREFIX  mu:  <http://mu.semte.ch/vocabularies/>
  PREFIX  muCore:  <http://mu.semte.ch/vocabularies/core/>
  PREFIX  muExt:  <http://mu.semte.ch/vocabularies/ext/>
  PREFIX  session:  <http://mu.semte.ch/vocabularies/session/>
  PREFIX  sh:  <http://schema.org/>
  PREFIX  foaf:  <http://xmlns.com/foaf/0.1/>

  SELECT ?name  WHERE
  {
      ?a muCore:uuid '${id}';
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
  if (bindings.length) return bindings[0].name.value;
  else return "";
}

export default helper(accountname);
