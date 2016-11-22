const Hapi = require('hapi');
const server = new Hapi.Server();
const Request = require('request');

server.connection({
  host: 'localhost',
  port: process.env.port || 4000
});

server.register(require('inert'), (err) => {
  if (err) throw err;

  server.route({
    method: 'GET',
    path: '/{file*}',
    handler: {
      directory: {
        path: 'public/'
      }
    }
  });
});

server.route({
  method: 'GET',
  path: '/recipes/',
  handler: function(request,reply) {
    let url = 'http://www.recipepuppy.com/api/'
    let searchRecipe = request.query.q
    Request(`${url}?q=${searchRecipe}`, function(err, res, body) {
      console.log(body);
      reply(body);
    })
  }
});

module.exports = server;
