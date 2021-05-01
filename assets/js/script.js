const searchList = document.getElementById("search-list");

//current date
$("#currentDate").append(moment().format("dddd, MMM Do YYYY"));
//variables
var search = $("#city");
var getWeather = document.getElementById("btn");
var apiKey = "9c3a330f3153e65a0cf5321635105679";
var units = "imperial";
//document.ready when search button is clicked
$(document).ready(function () {
  function searchBar() {
    searchList.innerHTML = ``;
    if (localStorage.getItem("searchHistoryArr")) {
      var arrStorage = JSON.parse(localStorage.getItem("searchHistoryArr"));
      for (let i = 0; i < arrStorage.length; i++) {
        //append search
        var listItem = document.createElement("li");
        listItem.innerHTML = arrStorage[i];
        searchList.appendChild(listItem);
      }
    }
  }
  searchBar();

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

        document.querySelector(
          ".current-weather"
        ).innerHTML = `<h2 class="city-name">
        City: ${data.name} <img
          src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png"
          alt=""
        />
      </h2>

      <p class="current-temp">Current Temperature: ${data.main.temp}°F</p>

      <p class="current-humidity">Current Humidity:${data.main.humidity}%</p>

      <p class="wind-speed">Wind Speed: ${data.wind.speed}MPH</p>

      <p class="UV">UVI: ${(data.coord.lon, data.coord.lat)} </p>`;

        // save city info to local storage
        if (localStorage.getItem("searchHistoryArr")) {
          console.log(localStorage.getItem("searchHistoryArr"));
          var arrStorage = JSON.parse(localStorage.getItem("searchHistoryArr"));
          if (!arrStorage.includes(data.name)) {
            arrStorage.unshift(data.name);
            localStorage.setItem(
              "searchHistoryArr",
              JSON.stringify(arrStorage)
            );
          }
        } else {
          localStorage.setItem("searchHistoryArr", JSON.stringify([data.name]));
        }

        //makeUVI call
        oneCall(data.coord.lon, data.coord.lat);
        searchBar();
        // $(".form-input").append($("ul"));
      });
  }

  //UVI function
  function oneCall(lon, lat) {
    var oneCallUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;
    fetch(oneCallUrl)
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        console.log(data.daily);
        document.querySelector(".forecast").innerHTML = "";

        for (let i = 1; i <= 5; i++) {
          var unixSeconds = data.daily[i].dt;
          var unixMilliseconds = unixSeconds * 1000;
          var forecastDateUnix = new Date(unixMilliseconds);
          var forecastDoW = forecastDateUnix.toLocaleString("en-US", {
            weekday: "long",
          });
          var forecastCard = document.createElement("div");
          forecastCard.classList.add("card");
          forecastCard.innerHTML = `<p>${forecastDoW}</p>
                <src=" http://openweathermap.org/img/wn/5d${data.daily[0].icon}.png"
                alt=""/>
                <p>Temp:${data.daily[i].temp.day}  °F</p>
                <p>Wind Speed:${data.daily[i].wind_speed} MPH</p>
              <p>Humidity:${data.daily[i].humidity} %</p>

           `;

          document.querySelector(".forecast").appendChild(forecastCard);
        }
      });
  }
});
