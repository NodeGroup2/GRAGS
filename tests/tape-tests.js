const server = require('../src/server.js');
const fs = require('fs');
const path = require('path');
const handlebars = require("../public/index.js")

tape('check if server is running', function(t) {
  server.start(err => {
    t.error(err);
    server.stop();
    t.end();
  });
});

tape('check successful route & handling to index.html', function(t) {
  var options = {
    method: 'GET',
    url: '/'
  };
  server.inject(options, (res) => {
    t.equal(res.statusCode, 200, 'status code is 200');
    var servedFile = res.result.toString();
    var file = fs.readFileSync(path.join(__dirname, '../public/index.html')).toString();
    t.equal(servedFile, file, 'served file equal to original file');
    t.end();
  });
});

tape('check successful route & handling to styles.css', function(t) {
  var options = {
    method: 'GET',
    url: '/styles.css'
  };
  server.inject(options, (res) => {
    t.equal(res.statusCode, 200, 'status code is 200');
    var servedFile = res.result.toString();
    var file = fs.readFileSync(path.join(__dirname, '../public/styles.css')).toString();
    t.equal(servedFile, file, 'served file equal to original file');
    t.end();
  });
});

tape('check successful route & handling to /recipes/?q=omelet', function(t) {
  var options = {
    method: 'GET',
    url: '/recipes/?q=omelet'
  };
  server.inject(options, (res) => {
    t.equal(res.statusCode, 200, 'status code is 200');
    var firstRecipeTitle = JSON.parse(res.result).results[0].title.toString();
    t.equal(firstRecipeTitle, "Baked Omelet With Broccoli &amp; Tomato", 'first recipe title as expected');
    t.end();
  });
});
