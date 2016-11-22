const server = require('./server.js');

server.start(err => {
  console.log(process.env.TESCO_API_KEY);
  if (err) throw err;
  console.log(`server is running on ${server.info.uri}`);
});
