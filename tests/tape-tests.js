var test = require("tape");
var handlebars = require("../public/index.js")

test("listrecipes function prints a list of 3 recipes", function(t){
  var html = handlebars.listRecipes();
  var pattern = new RegExp(/<li>Nelson Correira<\/li>\s?<li>Dan Correira<\/li>\s?<li>Ines Correira<\/li>/);
  t.ok(html.search(/<li>Dan Sofer<\/li>\s{0,}<li>Ines Teles<\/li>\s{0,}<li>Nelson Correira<\/li>/) > -1, "YAY! thats correct!");
  t.end()
})
