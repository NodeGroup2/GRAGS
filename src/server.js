const Hapi = require('hapi');
const vision = require('vision');
const inert = require('inert');
// const routes = require('./router.js');
const server = new Hapi.Server();

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

var routes = [
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
        recipes:  ['1','2','3']
      };
      return response.view('index', data);
    }
  }
];


server.route(routes);
//
// server.register(require('inert'), (err) => {
//   if (err) throw err;
//
//   server.route({
//     method: 'GET',
//     path: '/{file*}',
//     handler: {
//       directory: {
//         path: 'public/'
//       }
//     }
//   });
// });

module.exports = server;
