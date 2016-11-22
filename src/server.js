const Hapi = require('hapi');
const vision = require('vision');
const inert = require('inert');
// const routes = require('./router.js');
const server = new Hapi.Server();
const Request = require('request');

server.connection({
  host: 'localhost',
  port: process.env.port || 4000
});

server.register([inert, vision], (err) => {
  if (err) console.log(err);
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
    handler: function(request, response){
      var data = {
        recipes:  ['1','2','3'];
      };
      return response.view('index', data);
    }
  },
  {
    method: 'GET',
    path: '/recipes/',
    handler: function(request, reply) {
      let url = 'http://www.recipepuppy.com/api/';
      let searchRecipe = request.query.q;
      Request(`${url}?q=${searchRecipe}`, function(err, res, body) {
        console.log(body);
        reply(body);
      })
    }
  }
];

server.route(routes);

module.exports = server;
