var cityFormEl = $('#user-form'); //form element
var cityInputEl = $('#city'); //form city input elemet
var WeatherContainer = $('.weather-container'); //container to display today weather
var todayWeatherEl = $('.today-weather'); //element to display today weather
var fiveDayWeatherContainer = $('.five-day-weather-container'); //element to display today weather
var fiveDayWeatherEl = $('.five-day-weather');
var fiveDayHeaderEl = $('.five-day-header');
var RecentSearch =  $('.card-recent');
var APIKey = '6f092801568446709287b96be65ed97a';

var uvi;

function init(){
    renderSearchedCities();
}

function renderSearchedCities(){
    var cities = JSON.parse(localStorage.getItem('cities'));

    if (cities){
        for (var i=0;i<cities.length;i++){
            var city = $('<button>').text(cities[i]).attr({'class':'btn', 'id': cities[i]});
            RecentSearch.append(city);
            $('#'+ cities[i]).on('click',recentSearchHandler);
        }
    }   
}


var recentSearchHandler = function () {
  
    console.log('city to search for: ' + $(this).text());
    var city = $(this).text();
    
    if (city) {
        todayWeatherEl.textContent = '';
        cityInputEl.val('');
        getTodayWeather(city);
    }
    return;
};

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
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey + "&units=imperial";
  
    fetch(queryURL)
      .then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {
            console.log(data);
            var lat = data.coord.lat;
            var lon = data.coord.lon;
            getFutureWeather(lat,lon);
            displayTodayWeather(data);
            saveRecentSearch(city)
          });
        } else {
          alert('Error: ' + response.statusText);
        }
      })
      .catch(function (error) {
        alert('Unable to connect to GitHub');
      });
  };

function saveRecentSearch(city){
    const searchedCity = (() => {
        const cities = localStorage.getItem('cities');
        return cities === null ? []: JSON.parse(cities);
      })();
    
    //   add activity in the local storage
    if (!(searchedCity.includes(city))){
        searchedCity.push(city)
    }

    localStorage.setItem("cities", JSON.stringify(searchedCity));
}

var weatherDisplayAttr = {'color':'white', 'font-weight': '500', 'font-size': '1.2rem'};
function displayTodayWeather(data,uvi) {
    // var weatherDisplayAttr = {'color':'white', 'font-weight': '500', 'font-size': '1.2rem'};
    // todayWeatherContainer.css({'border': '3px solid #466786','border-radius': '.3rem', 'background-color':'rgb(15, 144, 153)', 'height': '72%', 'padding': '10px'});
    todayWeatherEl.css({'border': '3px solid #466786','border-radius': '.3rem', 'background-color':'rgb(15, 144, 153)', 'height': '72%', 'padding': '10px'});

    var dateString = moment.unix(data.dt).format('dddd, MMMM Do YYYY');
    todayWeatherEl.append($('<h3>').text(data.name + ' - ' + dateString).css({'color':'white'}));
    var iconcode = data.weather[0].icon;
    var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
    todayWeatherEl.append($('<img>').attr({'src': iconurl, 'id': 'wicon', 'alt':'Weather Icon', 'display': 'inline', 'width':'100px', 'float': 'left'}));
    todayWeatherEl.append($('<h3>').text(data.weather[0].description).css({'color':'white', 'font-weight': '500', 'font-size': '1.2rem', 'display':'inline-block'}));
    todayWeatherEl.append($('<h3>').text('Temperature: ' + data.main.temp + ' ℉').css(weatherDisplayAttr));
    todayWeatherEl.append($('<h3>').text('Feels Like: ' + data.main.feels_like + ' ℉').css(weatherDisplayAttr));
    todayWeatherEl.append($('<h3>').text('Wind: ' + data.wind.speed +' MPH').css(weatherDisplayAttr));
    todayWeatherEl.append($('<h3>').text('Humidity: ' + data.main.humidity +'%').css(weatherDisplayAttr));
    var sunriseTime = moment.unix(data.sys.sunrise).format('h:mm A');
    var sunsetTime = moment.unix(data.sys.sunset).format('h:mm A');
    todayWeatherEl.append($('<h3>').text('Sunrise: ' + sunriseTime).css(weatherDisplayAttr));
    todayWeatherEl.append($('<h3>').text('Sunset: ' + sunsetTime).css(weatherDisplayAttr));
    // todayWeatherEl.append('<h3>').text('UV Index: ').attr({'class':'uv'});
};


function getFutureWeather(lat,lon){
    var queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey +"&exclude=minutely,hourly,alerts" + "&units=imperial";
        
    fetch(queryURL)
      .then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {
            console.log(data);
            displayFiveDayWeather(data);
            var uvi = data.current.uvi; 
            todayWeatherEl.append($('<h3>').text('UV Index: ').css(weatherDisplayAttr));
            todayWeatherEl.append($('<button>').text(uvi).attr({'class':'uvi-btn', 'display':'inline-block'}));
            if (uvi < 3){
                $('.uvi-btn').css({'background':'green','width': '10%','color':'white'})
            } else if (uvi<6){
                $('.uvi-btn').css({'background':'yellow','width': '10%','color':'white'})
            } else if (uvi<8){
                $('.uvi-btn').css({'background':'orange','width': '10%','color':'white'})
            } else if (uvi<11){
                $('.uvi-btn').css({'background':'red','width': '10%','color':'white'})
            } else {
                $('.uvi-btn').css({'background':'purple','width': '10%','color':'white'})
            }
          });
        } else {
          alert('Error: ' + response.statusText);
        }
      })
      .catch(function (error) {
        alert('Unable to connect to GitHub');
      });
}

function displayFiveDayWeather(data){
    var dailyWeather = data.daily;
    console.log(dailyWeather);
    fiveDayHeaderEl.append($('<h3>').text('5-Day Forecast'));
    for (var i=1;i<6;i++){
        var dateString = moment.unix(dailyWeather[i].dt).format('MMMM Do YYYY');
        var divWeather = $('<div>').addClass('col-sm');
        divWeather.css({'border': '2px solid #466786','border-radius': '.3rem', 'background-color':'#c5ecf3', 'height': '72%', 'padding': '10px'});
        divWeather.append($('<h3>').text(dateString).css({'font-size': '1rem', 'font-weight':'500'}));
        var iconcode = dailyWeather[i].weather[0].icon;
        var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
        divWeather.append($('<img>').attr({'src': iconurl, 'id': 'wicon', 'alt':'Weather Icon', 'width':'100px'}));
        divWeather.append($('<h3>').text('Temp: ' + dailyWeather[i].temp.day + '℉').css({'font-size': '1rem', 'font-weight':'200'}))
        divWeather.append($('<h3>').text('Wind: ' + dailyWeather[i].wind_speed + 'MPH').css({'font-size': '1rem', 'font-weight':'200'}))
        divWeather.append($('<h3>').text('Humidity: ' + dailyWeather[i].humidity + '%').css({'font-size': '1rem', 'font-weight':'200'}))       
        fiveDayWeatherEl.append(divWeather)
    }
}



cityFormEl.on("submit",formSubmitHandler);

init();