const Hapi = require('hapi');
const server = new Hapi.Server();
const Request = require('request');
const RecipesList = [];

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
      // run function to store top three recipes and their ingredients
      var json = JSON.parse(body);

      for (var i=0; i<3; i++) {
        RecipesList[i] = {
          "title": json.results[i].title,
          "ingredients": json.results[i].ingredients
        }
      }
      console.log(RecipesList);
      // reply with a rendered template
      reply(body);
    })
  }
});

module.exports = server;
