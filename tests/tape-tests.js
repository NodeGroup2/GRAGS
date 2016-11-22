const server = require('../src/server.js');
const fs = require('fs');
const path = require('path');
const handlebars = require("../public/index.js")

tape("listrecipes function prints a list of 3 recipes", function(t){
  var html = handlebars.listRecipes();
  var pattern = new RegExp(/<li>Nelson Correira<\/li>\s?<li>Dan Correira<\/li>\s?<li>Ines Correira<\/li>/);
  t.ok(html.search(/<li>Dan Sofer<\/li>\s{0,}<li>Ines Teles<\/li>\s{0,}<li>Nelson Correira<\/li>/) > -1, "YAY! thats correct!");
  t.end()
});


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
>>>>>>> master
