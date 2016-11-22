const Hapi = require('hapi');
const server = new Hapi.Server();

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

module.exports = server;
