var inputField = document.querySelector(".input_field");
var searchBtn = document.querySelector(".search_btn");
var links = document.getElementsByClassName("links");

for(i = 0; i < links.length; i++){
  links[i].addEventListener('click', function(e) {
    document.getElementsByClassName("first_page")[0].style.visibility = "hidden";
    document.getElementsByClassName("second_page")[0].style.visibility = "visible";
  });
}
