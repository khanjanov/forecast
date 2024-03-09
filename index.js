let wrapperTopLeft = document.querySelector(".wrapper__top__left");
let locDescription = document.querySelector("#location");
let temperture = document.querySelector("#temperature");
let condition = document.querySelector("#condition");
let weekday = document.querySelector("#weekday");
let maxTemp = document.querySelector("#maxTemp");
let minTemp = document.querySelector("#minTemp");
let fellsLike = document.querySelector("#fellsLike");
let wind = document.querySelector("#wind");
let humidity = document.querySelector("#humidity");
let uv = document.querySelector("#uv");
let visibility = document.querySelector("#visibility");
let pressure = document.querySelector("#pressure");

// get user's location
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(show);
} else {
  alert("Geolocation is not supported by this browser.");
}

const baseUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline`;
const myKey = config.my_key;

// get current date and time
let currentDatenTime = new Date();
// get date
let date =
  currentDatenTime.getFullYear() +
  "-" +
  "0" +
  (currentDatenTime.getMonth() + 1) +
  "-" +
  "0" +
  currentDatenTime.getDate();
// get weekday with name
const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
let day = daysOfWeek[currentDatenTime.getDay() - 1];
// get time ( we need only hour )
let hour = currentDatenTime.getHours() + ":00:00";
currentDatenTime.getHours() < 10 && (hour = "0" + hour);

// pass the location coordinates to api to get the current location's
function show(position) {
  // get latitude and longitude from geolocation
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  // make a request to api
  fetch(
    baseUrl +
      `/${latitude},${longitude}?&unitGroup=uk&key=${myKey}&contentType=json`
  )
    .then((response) => response.json())
    .then((data) => {
      let days = data.days;

      // find max and min temperature for chart
      let maxTempForChart = [null];
      let minTempForChart = [null];
      for (i = 0; i < days.length - 8; i++) {
        maxTempForChart.push(Math.round(days[i].tempmax));
        minTempForChart.push(Math.round(days[i].tempmin));
      }
      console.log(maxTempForChart);
      console.log(minTempForChart);
      days.forEach((el) => {
        if (el.datetime === date) {
          locDescription.innerText = "Your location";
          weekday.innerText = `${day} :`;
          maxTemp.innerText = `H ${Math.round(el.tempmax)}°`;
          minTemp.innerText = `L ${Math.round(el.tempmin)}°`;

          //! chart
          const xValues = [""];
          xValues.push(day);
          for (i = 1; i < 7; i++) {
            if (daysOfWeek.indexOf(day) + i <= 6) {
              xValues.push(daysOfWeek[daysOfWeek.indexOf(day) + i]);
            } else {
              xValues.push(daysOfWeek[daysOfWeek.indexOf(day) + i - 7]);
            }
          }
          new Chart("myChart", {
            type: "line",
            data: {
              labels: xValues,
              datasets: [
                {
                  data: maxTempForChart,
                  backgroundColor: "oldlace",
                  borderColor: "#FFC801",
                  fill: false,
                },
                {
                  data: minTempForChart,
                  backgroundColor: "oldlace",
                  borderColor: "#EE3572",
                  fill: false,
                },
              ],
            },
            options: {
              legend: { display: false },
            },
          });

          el.hours.forEach((el) => {
            if (el.datetime === hour) {
              temperture.innerText = `${Math.round(el.temp)}°`;
              condition.innerText = el.conditions;
              fellsLike.innerText = `${Math.round(el.feelslike)}°`;
              wind.innerText = `${Math.round(el.windspeed)} km/h`;
              humidity.innerText = `${Math.round(el.humidity)}%`;
              uv.innerText = `${Math.round(el.uvindex)}`;
              visibility.innerText = `${Math.round(el.visibility)} km`;
              pressure.innerText = `${Math.round(el.pressure)} hPa`;
            }
          });
        }
      });
    })
    .catch((error) => console.log(error));
}

let inp = document.createElement("input");
locDescription.addEventListener("click", () => {
  locDescription.remove();
  inp.type = "text";
  inp.placeholder = "type city name here ...";
  inp.setAttribute(
    "style",
    "background:transparent;border:1px solid #ff006b;color:oldlace;border-radius:8px;outline: none;padding:12px;"
  );
  wrapperTopLeft.insertBefore(inp, wrapperTopLeft.firstChild);

  // change city from input
  inp.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      let city = inp.value;
      fetch(baseUrl + `/${city}?&unitGroup=uk&key=${myKey}&contentType=json`)
        .then((response) => response.json())
        .then((data) => {
          let days = data.days;

          // find max and min temperature for chart
          let maxTempForChart = [null];
          let minTempForChart = [null];
          for (i = 0; i < days.length - 8; i++) {
            maxTempForChart.push(Math.round(days[i].tempmax));
            minTempForChart.push(Math.round(days[i].tempmin));
          }
          //! chart
          const xValues = [""];
          xValues.push(day);
          for (i = 1; i < 7; i++) {
            if (daysOfWeek.indexOf(day) + i <= 6) {
              xValues.push(daysOfWeek[daysOfWeek.indexOf(day) + i]);
            } else {
              xValues.push(daysOfWeek[daysOfWeek.indexOf(day) + i - 7]);
            }
          }
          new Chart("myChart", {
            type: "line",
            data: {
              labels: xValues,
              datasets: [
                {
                  data: maxTempForChart,
                  backgroundColor: "oldlace",
                  borderColor: "#FFC801",
                  fill: false,
                },
                {
                  data: minTempForChart,
                  backgroundColor: "oldlace",
                  borderColor: "#EE3572",
                  fill: false,
                },
              ],
            },
            options: {
              legend: { display: false },
            },
          });

          //!
          days.forEach((el) => {
            if (el.datetime === date) {
              maxTemp.innerText = `H ${Math.round(el.tempmax)}°`;
              minTemp.innerText = `L ${Math.round(el.tempmin)}°`;
              el.hours.forEach((el) => {
                if (el.datetime === hour) {
                  temperture.innerText = `${Math.round(el.temp)}°`;
                  condition.innerText = el.conditions;
                  fellsLike.innerText = `${Math.round(el.feelslike)}°`;
                  wind.innerText = `${Math.round(el.windspeed)} km/h`;
                  humidity.innerText = `${Math.round(el.humidity)}%`;
                  uv.innerText = `${Math.round(el.uvindex)}`;
                  visibility.innerText = `${Math.round(el.visibility)} km`;
                  pressure.innerText = `${Math.round(el.pressure)} hPa`;
                }
              });
              inp.remove();
              wrapperTopLeft.insertBefore(
                locDescription,
                wrapperTopLeft.firstChild
              );
              locDescription.innerText = `${data.resolvedAddress}`;
              inp.value = "";
            }
          });
        })
        .catch((error) => console.log(error));
    }
  });
});
