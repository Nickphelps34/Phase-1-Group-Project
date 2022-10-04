// 10/4 weatherScrolling() function progress. Continue tomorrow

let cityData = {};
let stateArray = [];

// Elements
const cityForm = document.querySelector("#city-form");
const inputText = document.querySelector("#input-text");
const homeBanner = document.querySelector("#home-banner");
const cityPage = document.querySelector("#city-page");

// City page elements
const cityName = document.querySelector("#city-name");
const currentTemp = document.querySelector("#current-temp");
const humidity = document.querySelector("#humidity");
const dailyHigh = document.querySelector("#daily-high");
const dailyLow = document.querySelector("#daily-low");
const feelsLike = document.querySelector("#feels-like");
const windSpeed = document.querySelector("#wind-speed");
const weatherFactsContainer = document.querySelector("#weather-facts");

// Elements Generated in Functions
// select state menu has id (#city-menu)
// weather fact name id = #weather-fact-name (from generateFirstWeatherFact())
// weather fact detail id = #weather-fact-detail (from generateFirstWeatherFact())

cityForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (Number(inputText.value)) {
    // ZipCode submitted

    getWeatherByZip(inputText.value).then((data) => {
      console.log("data: ", data);
      cityData = data;
      // 10/3 => stopped here: homeBanner.styles.visibility = 'hidden'
      // ==== GET IMAGES FOR CITY.WEATHER[0].MAIN (3 + DEFAULT TO START)
      // Later, wrap in separate function and call on both fetch by
      // zip and fetch by city/state
      homeBanner.style.display = "none";
      cityPage.style.display = "block";
      renderData();
    });

    // City Name submitted
  } else if (!document.querySelector("#city-menu")) {
    getWeatherByCity(inputText.value).then((data) => {
      console.log("fetch worked: ", data);
      cityData = data;

      if (data.length > 1) {
        const dropDown = document.createElement("select");
        const firstOption = document.createElement("option");

        dropDown.id = "city-menu";
        cityForm.append(dropDown);

        firstOption.textContent = "Select State";
        dropDown.appendChild(firstOption);

        data.forEach((city) => {
          stateArray.push(city.state);
          const option = document.createElement("option");

          option.textContent = city.state;
          dropDown.appendChild(option);
        });

        // Figure out how to temporarily remove submit button
        // When dropdownListener fires, we need submit button back
        // and select menu to be removed entirely
        // submit button style display: none
        // select menu erased => .remove()

        dropDownListener(dropDown);
      }
    });
  } else {
    console.log("are you here?");
    cityStateSubmit();
  }
  function dropDownListener(selectMenu) {
    console.log("stateArray: ", stateArray);

    selectMenu.addEventListener("change", (e) => {
      console.log(e);
      const stateArrayIndex = e.target.options.selectedIndex - 1;
      const selectedState = stateArray[stateArrayIndex];

      for (let city of cityData) {
        if (city.state === selectedState) cityData = city;
      }
      console.log("heres your city: ", cityData);
      console.log("cityData.lat: ", cityData.lat);

      getWeatherByLat(cityData.lat, cityData.lon).then((data) => {
        console.log("city ", data);
        console.log("cityData: ", cityData);
        cityData = data;
        renderData();
      });
    });
  }

  function cityStateSubmit() {
    cityForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const dropDown = document.querySelector("#city-input");
      console.log("worked!"), console.log("city-input: ", dropDown.value);
    });
  }
});

function renderData() {
  cityName.textContent = cityData.name;
  currentTemp.textContent = `${cityData.main.temp}°`;
  dailyHigh.textContent = `${cityData.main.temp_max}°`;
  dailyLow.textContent = `${cityData.main.temp_min}°`;
  windSpeed.textContent = `Wind Speed: ${cityData.wind.speed}mph`;
  humidity.textContent = `Humidity: ${cityData.main.humidity}%`;

  weatherScrolling();
}

// Optional weather data in #weather-facts-container via arrow keys
//
function weatherScrolling() {
  console.log("weatherScrolling running");
  generateFeelsLikeFact();
  document.addEventListener("keydown", (e) => {
    // adding ifs for functions 'generate${Different}Facts'
    // Feels like data renders on form submit, then keydowns to toggle between data
    //========= SCRAP CODE BELOW =================
    //     if (e.key === "ArrowRight") {
    //       if (!weatherFactsContainer.hasChildNodes()) {
    //         console.log(e.key);
    //         generateFeelsLikeFact();
    //       }
    //     }
    //     if (e.key === "ArrowLeft") {
    //       if (!weatherFactsContainer.hasChildNodes()) {
    //         console.log(e.key);
    //         generateFeelsLikeFact();
    //       }
    //     }
    //===========================================
  });
}

function generateFeelsLikeFact() {
  console.log("first weather fact generated");
  // add class to first weatherFact and to subsequent facts
  // for similar css styling
  const weatherFactName = document.createElement("h2");
  const weatherFactDetail = document.createElement("h3");

  weatherFactName.id = "feels-like-fact-name";
  weatherFactDetail.id = "feels-like-fact-detail";

  weatherFactName.textContent = "Currently Feels Like:";
  weatherFactDetail.textContent = cityData.main.feels_like;

  weatherFactsContainer.appendChild(weatherFactName);
  weatherFactsContainer.appendChild(weatherFactDetail);
}

function generateWindSpeedFact() {
  console.log("wind speed");
}

function generateHumidityFact() {
  console.log("humidity");
}
//============================================================================

const getWeatherByCity = (city) => {
  const apiByCity = `http://api.openweathermap.org/geo/1.0/direct?q=${city},&limit=5&appid=ac4519ef112c6f4cc9a4b2e01e44fe76&units=imperial`;
  return fetch(apiByCity)
    .then((res) => res.json())
    .then((data) => data);
};
const getWeatherByLat = (lat, lon) => {
  const apiByLat = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&limit=5&appid=ac4519ef112c6f4cc9a4b2e01e44fe76&units=imperial`;
  return fetch(apiByLat)
    .then((res) => res.json())
    .then((data) => data);
};
const getWeatherByZip = (zip) => {
  const apiByZip = `https://api.openweathermap.org/data/2.5/weather?zip=${zip}&appid=ac4519ef112c6f4cc9a4b2e01e44fe76&units=imperial`;
  return fetch(apiByZip)
    .then((res) => res.json())
    .then((data) => data);
};

//geo/1.0/direct

//data/2.5/weather

//`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=ac4519ef112c6f4cc9a4b2e01e44fe76&units=imperial`;
// `https://api.openweathermap.org/data/2.5/weather?zip=${zip}&appid=ac4519ef112c6f4cc9a4b2e01e44fe76&units=imperial`;
// let cityData = {};
// let stateArray = [];
// let cityData = {};
// let stateArray = [];

// // Elements
// const cityForm = document.querySelector("#city-form");
// const inputText = document.querySelector("#input-text");
// const homeBanner = document.querySelector("#home-banner");
// const cityPage = document.querySelector("#city-page");

// // City page elements
// const cityName = document.querySelector("#city-name");
// const currentTemp = document.querySelector("#current-temp");
// const humidity = document.querySelector("#humidity");
// const dailyHigh = document.querySelector("#daily-high");
// const dailyLow = document.querySelector("#daily-low");
// const feelsLike = document.querySelector("#feels-like");
// const windSpeed = document.querySelector("#wind-speed");
// const weatherFactsContainer = document.querySelector("#weather-facts");

// // Elements Generated in Functions
// // select state menu has id (#city-menu)
// // weather fact name id = #weather-fact-name (from generateFirstWeatherFact())
// // weather fact detail id = #weather-fact-detail (from generateFirstWeatherFact())

// cityForm.addEventListener("submit", (e) => {
//   e.preventDefault();

//   if (Number(inputText.value)) {
//     // ZipCode submitted

//     getWeatherByZip(inputText.value).then((data) => {
//       console.log("data: ", data);
//       cityData = data;
//       // 10/3 => stopped here: homeBanner.styles.visibility = 'hidden'
//       // ==== GET IMAGES FOR CITY.WEATHER[0].MAIN (3 + DEFAULT TO START)
//       // Later, wrap in separate function and call on both fetch by
//       // zip and fetch by city/state
//       homeBanner.style.display = "none";
//       cityPage.style.display = "block";
//       renderData();
//     });

//     // City Name submitted
//   } else if (!document.querySelector("#city-menu")) {
//     getWeatherByCity(inputText.value).then((data) => {
//       console.log("fetch worked: ", data);
//       cityData = data;

//       if (data.length > 1) {
//         const dropDown = document.createElement("select");
//         const firstOption = document.createElement("option");

//         dropDown.id = "city-menu";
//         cityForm.append(dropDown);

//         firstOption.textContent = "Select State";
//         dropDown.appendChild(firstOption);

//         data.forEach((city) => {
//           stateArray.push(city.state);
//           const option = document.createElement("option");

//           option.textContent = city.state;
//           dropDown.appendChild(option);
//         });

//         // Figure out how to temporarily remove submit button
//         // When dropdownListener fires, we need submit button back
//         // and select menu to be removed entirely
//         // submit button style display: none
//         // select menu erased => .remove()

//         dropDownListener(dropDown);
//       }
//     });
//     //=======================  PROJECT PAUSE  ===================================

//     //  need to get final 'else' to call cityStateSubmit if possible. Otherwise need
//     // to figure out another way to call a second submit with different code on the
//     // same form element.
//   } else {
//     console.log("are you here?");
//     cityStateSubmit();
//   }
//   // Listen for change in select menu. Turns out the selected item is located deep in the
//   // event object, under target.options.selectedIndex!
//   function dropDownListener(selectMenu) {
//     console.log("stateArray: ", stateArray); // => Array of states listed in select menu

//     selectMenu.addEventListener(
//       "change",
//       (e) => {
//         const stateArrayIndex = e.target.options.selectedIndex - 1;
//         const selectedState = stateArray[stateArrayIndex];

//         for (let city of cityData) {
//           if (city.state === selectedState) cityData = city;
//         }
//         console.log("heres your city: ", cityData);
//         console.log("cityData.lat: ", cityData.lat);

//         getWeatherByLat(cityData.lat, cityData.lon).then((data) => {
//           console.log("city ", data);
//           console.log("cityData: ", cityData);
//           cityData = data;
//           renderData();
//         });
//         //renderData();
//       }
//       // make sure to convert selected city to global cityData
//     );
//   }

//   function cityStateSubmit() {
//     cityForm.addEventListener("submit", (e) => {
//       e.preventDefault();

//       const dropDown = document.querySelector("#city-input");
//       console.log("worked!"), console.log("city-input: ", dropDown.value);
//     });
//   }
// });

// function renderData() {
//   cityName.textContent = cityData.name;
//   currentTemp.textContent = `${cityData.main.temp}°`;
//   dailyHigh.textContent = `${cityData.main.temp_max}°`;
//   dailyLow.textContent = `${cityData.main.temp_min}°`;
//   windSpeed.textContent = `Wind Speed: ${cityData.wind.speed}mph`;
//   humidity.textContent = `Humidity: ${cityData.main.humidity}%`;

//   weatherScrolling();
// }

// // Optional weather data in #weather-facts-container via arrow keys
// //
// function weatherScrolling() {
//   console.log("weatherScrolling running");
//   document.addEventListener("keydown", (e) => {
//     if (e.key === "ArrowRight") {
//       if (!weatherFactsContainer.hasChildNodes()) {
//         console.log(e.key);
//         generateFeelsLikeFact();
//       }
//     }
//     if (e.key === "ArrowLeft") {
//       if (!weatherFactsContainer.hasChildNodes()) {
//         console.log(e.key);

//         generateFeelsLikeFact();
//       }
//     }
//   });
// }

// function generateFeelsLikeFact() {
//   console.log("first weather fact generated");
//   // add class to first weatherFact and to subsequent facts
//   // for similar css styling
//   const weatherFactName = document.createElement("h2");
//   const weatherFactDetail = document.createElement("h3");

//   weatherFactName.id = "weather-fact-name";
//   weatherFactDetail.id = "weather-fact-detail";

//   weatherFactName.textContent = "Currently Feels Like:";
//   weatherFactDetail.textContent = cityData.main.feels_like;

//   weatherFactsContainer.appendChild(weatherFactName);
//   weatherFactsContainer.appendChild(weatherFactDetail);
// }
// //============================================================================
// //   if (Number(inputText.value)) {
// //     getWeatherByZip(inputText.value).then((data) => console.log(data));
// //   } else {
// //     getWeatherByCity(inputText.value)
// //       .then((data) => {
// //         console.log(data);
// //         if (data.length > 1) {
// //           const dropDown = document.createElement("select");
// //           dropDown.id = "city-menu";
// //           cityForm.append(dropDown);
// //           data.forEach((city) => {
// //             const option = document.createElement("option");
// //             option.textContent = city.state;
// //             dropDown.appendChild(option);
// //             //cityStateSubmit();
// //           });
// //         }
// //       })
// //       //.catch((e) => console.log("error", e));
// //   }
// // });

// const getWeatherByCity = (city) => {
//   const apiByCity = `http://api.openweathermap.org/geo/1.0/direct?q=${city},&limit=5&appid=ac4519ef112c6f4cc9a4b2e01e44fe76&units=imperial`;
//   return fetch(apiByCity)
//     .then((res) => res.json())
//     .then((data) => data);
// };
// const getWeatherByLat = (lat, lon) => {
//   const apiByLat = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&limit=5&appid=ac4519ef112c6f4cc9a4b2e01e44fe76&units=imperial`;
//   return fetch(apiByLat)
//     .then((res) => res.json())
//     .then((data) => data);
// };
// const getWeatherByZip = (zip) => {
//   const apiByZip = `https://api.openweathermap.org/data/2.5/weather?zip=${zip}&appid=ac4519ef112c6f4cc9a4b2e01e44fe76&units=imperial`;
//   return fetch(apiByZip)
//     .then((res) => res.json())
//     .then((data) => data);
// };

// //geo/1.0/direct

// //data/2.5/weather

// //`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=ac4519ef112c6f4cc9a4b2e01e44fe76&units=imperial`;
// // `https://api.openweathermap.org/data/2.5/weather?zip=${zip}&appid=ac4519ef112c6f4cc9a4b2e01e44fe76&units=imperial`;
// // let cityData = {};
// // let stateArray = [];
