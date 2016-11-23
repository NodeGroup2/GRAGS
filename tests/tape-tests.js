const server = require('../src/server.js');
const fs = require('fs');
const path = require('path');
const tape = require('tape');
const Request = require('request');

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
    var file = fs.readFileSync(path.join(__dirname, './index-mock.html')).toString();
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

tape('check successful route & handling to index.js', function(t) {
  var options = {
    method: 'GET',
    url: '/index.js'
  };
  server.inject(options, (res) => {
    t.equal(res.statusCode, 200, 'status code is 200');
    var servedFile = res.result.toString();
    var file = fs.readFileSync(path.join(__dirname, '../public/index.js')).toString();
    t.equal(servedFile, file, 'served file equal to original file');
    t.end();
  });
});

tape('check successful response from server on omelet search from client', function(t) {
  var options = {
    method: 'GET',
    url: '/recipes/?q=omelet'
  };
  server.inject(options, (res) => {
    t.equal(res.statusCode, 200, 'status code is 200');
    var html = res.result.toString();
    t.ok(html.indexOf("Mild Curry Omelet") > -1, 'recipe title as expected');
    t.ok(html.indexOf("href=http://allrecipes.com/Recipe/Mild-Curry-Omelet/Detail.aspx") > -1, 'recipe link as expected');
    t.end();
  });
});

tape('check successful response from recipe API on omelet search from server', function(t) {
  Request('http://www.recipepuppy.com/api/?q=omelet', function(err, res, body) {
    t.equal(res.statusCode, 200, 'status code is 200');
    var json = JSON.parse(body);
    t.equal(json.results[0].title, "Baked Omelet With Broccoli &amp; Tomato", 'recipe title as expected');
    t.equal(json.results[0].ingredients, "milk, cottage cheese, broccoli, cheddar cheese, basil, onion powder, eggs, garlic powder, roma tomato, salt", 'recipe ingredients as expected');
    t.equal(json.results[0].href, "http://www.recipezaar.com/Baked-Omelet-With-Broccoli-Tomato-325014", 'recipe link as expected');
    t.end();
  });
});
