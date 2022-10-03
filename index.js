// Elements
const cityForm = document.querySelector("#city-form");
const inputText = document.querySelector("#input-text");
// select city menu has id (#city-menu)

cityForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (Number(inputText.value)) {
    getWeatherByZip(inputText.value).then((data) => console.log(data));
  } else {
    getWeatherByCity(inputText.value).then((data) => {
      console.log(data);
      if (data.length > 1) {
        const dropDown = document.createElement("select");
        dropDown.id = "city-menu";
        cityForm.append(dropDown);
        data.forEach((city) => {
          const option = document.createElement("option");
          option.textContent = city.state;
          dropDown.appendChild(option);
        });
      }
    });
  }
});

function cityStateSubmit() {}

const getWeatherByCity = (city) => {
  const apiByCity = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=ac4519ef112c6f4cc9a4b2e01e44fe76&units=imperial`;
  return fetch(apiByCity)
    .then((res) => res.json())
    .then((data) => data);
};
const getWeatherByZip = (zip) => {
  const apiByZip = `https://api.openweathermap.org/data/2.5/weather?zip=${zip}&appid=ac4519ef112c6f4cc9a4b2e01e44fe76&units=imperial`;
  return fetch(apiByZip)
    .then((res) => res.json())
    .then((data) => data);
};
