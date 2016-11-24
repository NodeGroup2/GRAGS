"use strict";

const Hapi = require('hapi');
const inert = require('inert');
const vision = require('vision');
const handlebars = require('handlebars');
const Request = require('request');
const env = require('env2')('./.env');

const server = new Hapi.Server();

let data;
let ingredients = {
  arr: [],
  totalPrice: 0
};
let RecipesList = [];

server.connection({
  port: process.env.PORT || 4000
});

server.register([inert, vision], (err) => {
  if (err) throw err;
});

server.views({
  engines: {
    html: handlebars
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
    method: 'GET',
    path: '/index.html',
    handler: function(request, reply){
      data = {
        recipes: RecipesList || [],
        ingredients: ingredients || []
      };
      reply.view('index', data);
    }
  },
  {
    method: 'GET',
    path: '/',
    handler: function(request, reply){
      data = {
        recipes: RecipesList || [],
        ingredients: ingredients || []
      };
      reply.view('index', data);
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
              "ingredients": json.results[i].ingredients.split(','),
              "link": json.results[i].href
            }
          }
        }
        ingredients.arr = [];
        ingredients.totalPrice = 0;
        reply.view('index', data);
      })
    }
  },
  {
    method: 'GET',
    path: '/recipe/',
    handler: function(request, reply) {
      const index = encodeURIComponent(request.query.index);
      const searchIngredients = RecipesList[index].ingredients;
      var options = {
         url: 'https://dev.tescolabs.com/grocery/products/?query=nada&offset=0&limit=1',
         headers: {
          'Ocp-Apim-Subscription-Key': process.env.TESCO_API_KEY
        }
      };

      function addIngredientsCallback(error, response, body) {
        if (!error && response.statusCode == 200) {
          var info = JSON.parse(body);
          addIngredientToArray(info);
          if(ingredients.arr.length === searchIngredients.length)  {
            reply.view('index', data);
          }
        }
      }

      for(let i=0;i<searchIngredients.length;i++){
        options.url = "https://dev.tescolabs.com/grocery/products/?query="+searchIngredients[i]+"&offset=0&limit=1";
        Request(options, addIngredientsCallback);
      }

      function addIngredientToArray(response){
        var body = response.uk.ghs.products.results[0];
        var largeImage = body.image.replace("90x90","540x540");
        var info = {
          image: largeImage,
          name: body.name,
          price: body.price
        }
        ingredients.arr.push(info);
        ingredients.totalPrice += body.price;
        ingredients.totalPrice = parseFloat(ingredients.totalPrice.toFixed(2));
        console.log("the total fin price is: ", ingredients.totalPrice);
      }
    }
  }
];

server.route(routes);

module.exports = server;
