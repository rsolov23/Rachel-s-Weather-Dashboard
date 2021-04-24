//current date
$("#currentDate").append(moment().format("dddd, MMM Do YYYY"));
//variables
var search = $("#city");
var getWeather = document.getElementById("btn");
var apiKey = "9c3a330f3153e65a0cf5321635105679";

//document.ready when search button is clicked
$(document).ready(function () {
  $("#user-form").submit(performSearch);

  //onclick make fetch request(openweather)
  function performSearch(e) {
    e.preventDefault();
    console.log(search.val());
    var apiCall = `https://api.openweathermap.org/data/2.5/weather?q=${search.val()}&appid=${apiKey}&units=imperial`;

    //make fetch request
    fetch(apiCall)
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        console.log(data);

        document.querySelector(".city-name").textContent = data.name;
        document.querySelector(".current-temp").textContent =
          data.main.temp + " °F";

        //makeUVI call
        oneCall(data.coord.lon, data.coord.lat);
      });
  }

  //UVI function
  function oneCall(lon, lat) {
    var oneCallUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    fetch(oneCallUrl)
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        console.log(data);
      });
  }
});
