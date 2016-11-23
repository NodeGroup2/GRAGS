"use strict";

const Hapi = require('hapi');
const vision = require('vision');
const inert = require('inert');
// const routes = require('./router.js');
const server = new Hapi.Server();
const Request = require('request');
const RecipesList = [];
var ingredients = [];
const env = require('env2')('./.env');

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
      let searchRecipe = request.query.q;
      Request(`${url}?q=${searchRecipe}`, function(err, res, body) {
        var json = JSON.parse(body);
        for (var i=0; i<3; i++) {
          RecipesList[i] = {
            "title": json.results[i].title,
            "ingredients": json.results[i].ingredients.split(','),
            "link": json.results[i].href
          }
        }
        console.log(RecipesList);
        reply().redirect('/');
      })
    }
  },
  {
    method: 'GET',
    path: '/recipe/', //TODO change recipe to the actual name of the recipe chosen
    handler: function(request, reply) {
      let recipe = {ingredients: ["chicken", "rice", "tomato"]};
      // let url = 'https://dev.tescolabs.com/grocery/products/?query=chicken&offset=0&limit=1';
      let options = {
         url: 'https://dev.tescolabs.com/grocery/products/?query=nada&offset=0&limit=1',
         headers: {
          'Ocp-Apim-Subscription-Key': process.env.TESCO_API_KEY
        }
      };

      function callback(error, response, body) {
        //console.log("I'm in the callback and I'm getting this res:", response);
        if (!error && response.statusCode == 200) {
          var info = JSON.parse(body);
          addIngredientToArray(info);
          console.log(ingredients);
        }
      }

      for(let i=0;i<recipe.ingredients.length;i++){
        options.url = "https://dev.tescolabs.com/grocery/products/?query="+recipe.ingredients[i]+"&offset=0&limit=1";
        Request(options, callback);
      }

      function addIngredientToArray(response){
        var body = response.uk.ghs.products.results[0];
        var info = {
          image: body.image,
          name: body.name,
          price: body.price
        } // TODO add unit price
        ingredients.push(info);
      }
    }

      // Request(`${url}?query=${recipe.ingredients[i]}&offset=0&limit=1`, function(err, res, body) {
      //   var json = JSON.parse(body);
      //   for (var i=0; i<3; i++) {
      //     RecipesList[i] = {
      //       "title": json.results[i].title,
      //       "ingredients": json.results[i].ingredients.split(','),
      //       "link": json.results[i].href
      //     }
      //   }
      //   console.log(RecipesList);
      //   reply().redirect('/');
      // })
    }
];

server.route(routes);

module.exports = server;
