var Handlebars = require('handlebars');
var fs = require('fs');

var source = fs.readFileSync(__dirname + "/index.html")
var template = Handlebars.compile(source.toString());

function listRecipes(){
  var obj = {
    recipes: ["Dan Sofer", "Ines Teles", "Nelson Correira"]
  }
  var html = template(obj);
  return html;
}


module.exports = {
  listRecipes: listRecipes
}
