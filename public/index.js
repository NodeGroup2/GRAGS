var inputField = document.querySelector(".input_field");
var searchBtn = document.querySelector(".search_btn");
var ingredientLink = document.getElementsByClassName("ingredient_link");

for(i = 0; i < ingredientLink.length; i++){
  ingredientLink[i].addEventListener('click', function(e) {
    document.getElementsByClassName("first_page")[0].style.visibility = "hidden";
    document.getElementsByClassName("second_page")[0].style.visibility = "visible";
  });
}
