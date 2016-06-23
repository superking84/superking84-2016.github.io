$(document).ready(function() {
  // initialize URLs and other data for API calls
  var baseWeatherURL = "http://api.openweathermap.org/data/2.5/weather?q=";
  var APIkey = "&appid=f35a1cd21dd2ef4da0c8143ce9975955";
  var iconCode = '';
  var iconURL = "http://openweathermap.org/img/w/";
  
  // temperature data
  var temp = {
    unit: "F",
    value: 0,
    condition: ''
  };
  var currentUnit = "imperial"; // default will be Fahrenheit

  // functions
  var getWeather = function(unit) {
    $.getJSON("http://ipinfo.io", function(data) {
      $("#city_name").html(data.city + ", " + data.country);
      var fullURL = baseWeatherURL + data.city + "," + data.country + "&units=" + unit + APIkey;

      $.getJSON(fullURL, function(data) {
        iconCode = data.weather[0].icon;
        temp.value = data.main.temp;
        if (unit === "imperial")
          temp.unit = "F";
        else if (unit === "metric")
          temp.unit = "C";
        
        updateDisplayedTemp();
        temp.condition = data.weather[0].description;
        var displayCondition = data.weather[0].description;
        if (displayCondition.indexOf("sky") !== -1)
          displayCondition = displayCondition.replace(/sky/, "skies");
        else if (displayCondition === "thunderstorm")
          displayCondition = "thunderstorms";
        else if (displayCondition === "few clouds")
          displayCondition = "a few clouds";
        $("#condition").html(displayCondition);
        $("#icon").attr('src', iconURL + iconCode + ".png");
        setBackground(temp.condition);
      });
    });
  };

  var convertTemperature = function() {
    if (temp.unit === "F") {
      temp.value = (temp.value - 32) / 1.8;
      temp.unit = "C";
    } else if (temp.unit === "C") {
      temp.value = (temp.value * 1.8) + 32;
      temp.unit = "F";
    }
  };

  var updateDisplayedTemp = function() {
    $("#temp").html(Math.round(temp.value) + " " + temp.unit);
  };

  // page interactions
  $("#temp").on('click', function() {
    convertTemperature();
    updateDisplayedTemp();
  });

  $("#temp").hover(
    function() {
      $(this).css('font-weight', 'bold');
      $(this).css('color', 'gold');
      $(this).css('cursor', 'pointer');
    },
    function() {
      $(this).css('font-weight', 'normal');
      $(this).css('color', '');
      $(this).css('cursor', '');
    }
  );
  
  var setBackground = function(condition) {
    var userTime = new Date();
    var hour = userTime.getHours();
    if (hour >= 20 || hour <= 5) {
      $('body').css("background-image","url("+backgrounds['night']+")");
    } else {
      $('body').css("background-image","url("+backgrounds[condition]+")");
    }
  };
  
  getWeather(currentUnit);
  
  var backgrounds = {
    night: "http://s20.postimg.org/jq3f4al4d/stars.jpg",
    'clear sky': "http://s20.postimg.org/76ieas9kd/clear_sky.jpg",
    rain: "http://s20.postimg.org/lqzh5m4j1/rain.jpg",
    'shower rain': "http://s20.postimg.org/lqzh5m4j1/rain.jpg",
    'few clouds': "http://s20.postimg.org/tz1eqlwfh/clouds.jpg",
    'scattered clouds': "http://s20.postimg.org/tz1eqlwfh/clouds.jpg",
    'broken clouds': "http://s20.postimg.org/tz1eqlwfh/clouds.jpg",
    thunderstorm: "http://s20.postimg.org/vs4bexhm5/thunderstorm.jpg",
    "thunderstorm with rain": "http://s20.postimg.org/vs4bexhm5/thunderstorm.jpg",
    snow: "http://s20.postimg.org/nnw7a6v71/snow.jpg",
    mist: "http://s20.postimg.org/np653lx0t/mist.jpg" 
  };
});