// mirage/config.js
export default function () {
  this.get('/bands');
  this.get('/chess');

  this.get('/bands/:id');

  this.get('/bands/:id/songs', function (schema, request) {
    let id = request.params.id;
    return schema.songs.where({ bandId: id });
  });

  this.post('/bands');
}
