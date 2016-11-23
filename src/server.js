const Hapi = require('hapi');
const vision = require('vision');
const inert = require('inert');
const server = new Hapi.Server();
const Request = require('request');
let RecipesList = [];
const env = require('env2')('./.env');

server.connection({
  host: 'localhost',
  port: process.env.port || 4000
});

server.register([inert, vision], (err) => {
  if (err) throw err;
});

server.views({
  engines: {
    html: require('handlebars')
  },
  relativeTo: __dirname,
  path: '../public'
});

const routes = [
  {
    method:'GET',
    path:'/{public*}',
    handler: {
      directory: {
        path: 'public/'
      }
    }
  },
  {
    method: 'GET',
    path: '/',
    handler: function(request, reply){
      var data = {
        recipes: RecipesList || []
      };
      return reply.view('index', data);
    }
  },
  {
    method: 'GET',
    path: '/recipes/',
    handler: function(request, reply) {
      let url = 'http://www.recipepuppy.com/api/';
      let searchRecipe = encodeURIComponent(request.query.q);
      Request(`${url}?q=${searchRecipe}`, function(err, res, body) {
        var json = JSON.parse(body);
        if (json.results.length === 0) {
          RecipesList = [{
            "title": "Sorry, no recipe matches found. Fancy searching for a different recipe?"
          }]
        }
        else {
          for (var i=0; i<3; i++) {
            RecipesList[i] = {
              "title": json.results[i].title,
              "ingredients": json.results[i].ingredients,
              "link": json.results[i].href
            }
          }
        }
        reply().redirect('/');
      })
    }
  }
];

server.route(routes);

module.exports = server;
