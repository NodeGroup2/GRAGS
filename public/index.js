var recipes = document.getElementsByClassName("recipes787");
console.log(recipes);
console.log(recipes[0]);

for(i = 0; i < recipes.length; i++){
  recipes[i].addEventListener('click', function(e) {
    console.log(document.getElementsByClassName("first_page"));
    document.getElementsByClassName("first_page")[0].style.visibility = "hidden";
    document.getElementsByClassName("second_page")[0].style.visibility = "visible";
    console.log(  document.getElementsByClassName("second_page")[0].style.visibility);
  });
}
