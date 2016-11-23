"use strict";

const Hapi = require('hapi');
const vision = require('vision');
const inert = require('inert');
const server = new Hapi.Server();
const Request = require('request');
let data;
let ingredients = [];
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
    path:'/{file*}',
    handler: {
      directory: {
        path: 'public/'
      }
    }
  },
  {
    method:'GET',
    path:'/recipes/{file*}',
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
      data = {
        recipes: RecipesList || []
      };
      return reply.view('index', data);
    }
  },
  {
    method: 'GET',
    path: '/recipes/',
    handler: function(request, reply) {
      let test = true;
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
        return reply.view('index', data);
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
  }
];

server.route(routes);

module.exports = server;
