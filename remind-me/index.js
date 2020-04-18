var form = document.getElementById('chat-box');
var submit = document.getElementById('chat-submit');
var input = document.getElementById('chat-user');
var container = document.getElementById('dialogue-container');
var keywords = [];
var reply;
var weather_trigger = 1;
var audioPlayer = document.getElementById('audio-player');

(function activate() {
    form = document.getElementById('chat-box');
    submit = document.getElementById('chat-submit');
    input = document.getElementById('chat-user');
    container = document.getElementById('dialogue-container');
    keywords = [];
    reply;
    weather_trigger = 1;
    audioPlayer = document.getElementById('audio-player');
    form.addEventListener("submit", function(event) {
        weather_trigger++;
        event.preventDefault();
        create_bubble_user();
    });
  })();



function create_bubble_user() {
  if (input.value != '') {
    keywords = input.value.toLowerCase()
      .replace(/[^\w\s]|_/g, '')
      .replace(/\s+/g, ' ').split(' ');
    var div = document.createElement('DIV');
    var para = document.createElement('SPAN');
    var txt = document.createTextNode(input.value);
    div.setAttribute('class', 'dialogue dialogue-user');
    para.appendChild(txt);
    div.appendChild(para);
    container.appendChild(div);
    input.value = '';
    count_childs();
    if (weather_trigger == 0) get_weather();
    else {
    	check_keywords();
    	setTimeout(function() {
          create_bubble_bot(reply);
          audioPlayer.play();
    	}, 500);
    }
  }
}

function got_weather() {
	count_childs();
    create_bubble_bot(reply);
}

function check_keywords() {
  for (var i = keywords.length - 1; i >= 0; i--) {
    switch (keywords[i]) {
      case 'name':
        reply = 'They all call me Sadie.';
        i = -1;
        break;
      case 'day':
        re_day();
        i = -1;
        break;
      case 'weather':
        reply = 'Sure, please enter a city.'
        weather_trigger = -1;
        i = -1;
        break;
      default:
        reply = "Sorry, I don't get it."
    }
  }
  keywords = [];
}

function create_bubble_bot(str) {
  var div = document.createElement('DIV');
  var para = document.createElement('SPAN');
  var txt = document.createTextNode(str);
  div.setAttribute('class', 'dialogue dialogue-bot');
  para.appendChild(txt);
  div.appendChild(para);
  container.appendChild(div);
  count_childs();
}

function get_weather() {
	var url_p1 = 'http://api.openweathermap.org/data/2.5/weather?q=';
  var url_p2 = keywords[0];
  var url_p3 = '&units=metric&APPID=49c0770f08d640ba6efb45847ca2ef9d';
  var url = url_p1 + url_p2 + url_p3;
  
  var ourRequest = new XMLHttpRequest();
  ourRequest.open('GET', url);
  ourRequest.onload = function() {
    if (ourRequest.status >= 200 && ourRequest.status < 400) {
      var data = JSON.parse(ourRequest.responseText);
      reply = data.name + ': ' + data.weather[0].main + ', ' + data.main.temp + '°C';
      got_weather();
    } else {
      console.log("Oops, something's wrong!");
    }
  };
  ourRequest.onerror = function() {
    console.log('Connection error');
  };

  ourRequest.send();
}

function re_day() {
  switch (new Date().getDay()) {
    case 0:
      reply = 'Sunday';
      break;
    case 1:
      reply = 'Monday';
      break;
    case 2:
      reply = 'Tuesday';
      break;
    case 3:
      reply = 'Wednesday';
      break;
    default:
      reply = 'Anyday';
  }
}

function count_childs() {
  var children = container.children;
  if (children.length > 6) {
    while (children.length > 6) {
      container.removeChild(container.firstChild);
    }
  }
  if (children.length > 3) {
    var transparency = 1;
    for (var i = children.length - 3; i >= 0; i--) {
      transparency -= 0.15;
      children[i].style.opacity = transparency;
    }
  }
}
