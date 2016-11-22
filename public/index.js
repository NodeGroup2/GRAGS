var recipes = document.getElementsByClassName("recipes");

for(i = 0; i < recipes.length; i++){
  recipes[i].addEventListener('click', function(e) {
    document.getElementsByClassName("first_page")[0].style.visibility = "hidden";
    document.getElementsByClassName("second_page")[0].style.visibility = "visible";
  });
}
