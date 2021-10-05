var cityFormEl = $('#user-form'); //form element
var cityInputEl = $('#city'); //form city input elemet
var todayWeatherContainer = $('.today-container'); //container to display today weather
var todayWeatherEl = $('#today-weather'); //element to display today weather
var APIKey = '6f092801568446709287b96be65ed97a';



// function formSubmitHandler(event){
//     event.preventDefault();
//     var searchValue = inputBox.val();
//     console.log(searchValue)

//     requestURL = genericApiUrl + 'q=' + searchValue + '&fo=json'
//     console.log(requestURL)
    
//     fetch (requestURL)
//         .then(function (response){
//             return response.json()
//         })
//         .then(function(data){
//             console.log(data)
//         });  
//         var searchEl = document.createElement('a');
//         // repoEl.classList = 'list-item flex-row justify-space-between align-center';
//         searchEl.setAttribute('href', './search-results.html?search=' + searchValue);
// }


var formSubmitHandler = function (event) {
    event.preventDefault();
  
    var city = cityInputEl.val();
    console.log('city to search for: ' + city);
  
    if (city) {
        todayWeatherEl.textContent = '';
        cityInputEl.val('');
        getTodayWeather(city);
    } else {
      alert('Please enter a city');
    }
};

var getTodayWeather = function (city) {
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey +"&units=imperial";
  
    fetch(queryURL)
      .then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {
            console.log(data);
            var lat = data.coord.lat;
            var lon = data.coord.lon;
            displayTodayWeather(data);
            // getFutureWeather(lat,lon)
            // saveRecentSearch(city)
          });
        } else {
          alert('Error: ' + response.statusText);
        }
      })
      .catch(function (error) {
        alert('Unable to connect to GitHub');
      });
  };

function displayTodayWeather(data) {
    var weatherDisplayAttr = {'color':'white', 'font-weight': '500', 'font-size': '1.2rem'};
    todayWeatherContainer.css({'border': '3px solid #466786','border-radius': '.3rem', 'background-color':'rgb(15, 144, 153)', 'height': '72%', 'padding': '10px'});
    var dateString = moment.unix(data.dt).format('dddd, MMMM Do YYYY');
    todayWeatherEl.append($('<h3>').text(data.name + ' - ' + dateString).css({'color':'white'}));
    var iconcode = data.weather[0].icon;
    var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
    todayWeatherContainer.append($('<img>').attr({'src': iconurl, 'id': 'wicon', 'alt':'Weather Icon', 'display': 'inline', 'width':'100px', 'float': 'left'}));
    todayWeatherContainer.append($('<h3>').text(data.weather[0].description).css({'color':'white', 'font-weight': '500', 'font-size': '1.2rem', 'display':'inline-block'}));
    todayWeatherContainer.append($('<h3>').text('Temperature: ' + data.main.temp + ' ℉').css(weatherDisplayAttr));
    todayWeatherContainer.append($('<h3>').text('Feels Like: ' + data.main.feels_like + ' ℉').css(weatherDisplayAttr));
    todayWeatherContainer.append($('<h3>').text('Wind: ' + data.wind.speed +' MPH').css(weatherDisplayAttr));
    todayWeatherContainer.append($('<h3>').text('Humidity: ' + data.main.humidity +'%').css(weatherDisplayAttr));
    var sunriseTime = moment.unix(data.sys.sunrise).format('h:mm A');
    var sunsetTime = moment.unix(data.sys.sunset).format('h:mm A');
    todayWeatherContainer.append($('<h3>').text('Sunrise: ' + sunriseTime).css(weatherDisplayAttr));
    todayWeatherContainer.append($('<h3>').text('Sunset: ' + sunsetTime).css(weatherDisplayAttr));
};




cityFormEl.on("submit",formSubmitHandler);

