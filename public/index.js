console.log('got into index')

var inputField = document.querySelector(".input_field");
var searchBtn = document.querySelector(".search_btn");
var linksShopping = document.getElementsByClassName("links_shopping");

for(i = 0; i < linksShopping.length; i++){
  linksShopping[i].addEventListener('click', function(e) {
    document.getElementsByClassName("first_page")[0].style.visibility = "hidden";
    document.getElementsByClassName("second_page")[0].style.visibility = "visible";
  });
}

// searchBtn.onclick = function() {
//   console.log('clicked')
//   if (inputField.value) {
//     sendRequest();
//   }
// }

// function sendRequest() {
//   var url = '/recipes/?q=' + inputField.value;
//   console.log(url);
//   var xhr = new XMLHttpRequest();
//   xhr.onreadystatechange = function() {
//     if (xhr.readyState === 4 && xhr.status == 200) {
//       document.body.innerHTML = xhr.responseText;
//     }
//   };
//   xhr.open('GET', url, true);
//   // xhr.responseType = "document";
//   xhr.send();
// }
