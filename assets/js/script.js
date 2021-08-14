const searchList = document.getElementById("search-list");

//transposing unix into regular date that human people beings can read
var date = new Date(1620496800 * 1000);
console.log(date);
//end of that ^

//current date
$("#currentDate").append(moment().format("dddd, MMM Do YYYY"));

//variables
var searchInput = $("#city");
var getWeather = document.getElementById("btn");
var apiKey = "9c3a330f3153e65a0cf5321635105679";
var units = "imperial";
//document.ready when search button is clicked
$(document).ready(function () {
  function searchBar() {
    searchList.innerHTML = ``;
    if (localStorage.getItem("searchHistoryArr")) {
      var clearBtn = document.createElement("button");
      clearBtn.innerHTML = "Clear History";
      clearBtn.addEventListener("click", function () {
        localStorage.removeItem("searchHistoryArr");
        searchBar();
      });
      searchList.appendChild(clearBtn);

      var arrStorage = JSON.parse(localStorage.getItem("searchHistoryArr"));
      for (let i = 0; i < arrStorage.length; i++) {
        //append search
        var listItem = document.createElement("li");
        listItem.innerHTML = arrStorage[i];
        listItem.addEventListener("click", function (e) {
          console.log("clicked ", e.target.textContent);
          performSearch(e.target.textContent);
        });
        searchList.appendChild(listItem);
      }
    }
  }
  searchBar();

  $("#user-form").submit(function (e) {
    e.preventDefault();
    performSearch(searchInput.val());
  });

  //onclick make fetch request(openweather)
  function performSearch(cityToSearch) {
    var apiCall = `https://api.openweathermap.org/data/2.5/weather?q=${cityToSearch}&appid=${apiKey}&units=imperial`;

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

      <p class="current-temp">Current Temperature:  ${data.main.temp}°F</p>

      <p class="current-humidity">Current Humidity:${data.main.humidity}%</p>

      <p class="wind-speed">Wind Speed: ${data.wind.speed}MPH</p>

      <p class="UV">UVI: <span id="uv"></span> </p>`;

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
        console.log(data);
        document.querySelector("#uv").textContent = data.daily[0].uvi;
        if (data.daily[0].uvi > 5) {
          document.querySelector("#uv").style.backgroundColor = "red";
        }
        document.querySelector(".forecast").innerHTML = "";

        for (let i = 1; i <= 5; i++) {
          var unixSeconds = data.daily[i].dt;
          var unixMilliseconds = unixSeconds * 1000;
          var forecastDateUnix = new Date(unixMilliseconds);
          var forecastDoW = forecastDateUnix.toLocaleString("en-US", {
            weekday: "long",
          });
          let currentTimeUTC = data.daily[i].dt;
          let currentTimeZoneOffset = data.daily[i].timezone;
          let currentTimeZoneOffsetHours = currentTimeZoneOffset / 60 / 60;
          let currentMoment = moment
            .unix(currentTimeUTC)
            .utc()
            .utcOffset(currentTimeZoneOffsetHours);
          // let output = document.querySelector("h1");
          // let today = new Date();
          // let month = today.getMonth() + 1;
          // let year = today.getFullYear();
          // let date = today.getDate();
          // let current_date = `${month}/${date}/${year}`;
          // output.innerText = current_date;
          var forecastCard = document.createElement("div");
          forecastCard.classList.add("card");

          forecastCard.innerHTML = `<p>${forecastDoW}</p>
          <h3>${currentMoment.format("(MM/DD/YY)")}</h3>
                <img src=" http://openweathermap.org/img/wn/${
                  data.daily[i].weather[0].icon
                }.png"
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

// background video

// Get the video
var video = document.getElementById("myVideo");

// Get the button
var btn = document.getElementById("myBtn");

// Pause and play the video, and change the button text
function myFunction() {
  if (video.paused) {
    video.play();
    btn.innerHTML = "Pause";
  } else {
    video.pause();
    btn.innerHTML = "Play";
  }
}
