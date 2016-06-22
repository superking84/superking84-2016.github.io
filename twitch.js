$(document).ready(function() {
  var twitchBaseURL = 'https://api.twitch.tv/kraken/streams/';
  var usernames = ["ESL_SC2","OgamingSC2","freecodecamp", "storbeck", "terakilobyte", "habathcx","RobotCaleb","thomasballinger","noobs2ninjas","beohoff","brunofin","comster404"]
  for (var i = 0; i < usernames.length; i++) {
    var id = usernames[i].toLowerCase();
    var html = '';
    html    += "<div class='row' id='"+id+"'>";
    html    += "<div class='col-xs-5'><img id='"+id+"_logo'></img>";
    html    += "<span><a href='https://www.twitch.tv/" + id + "'>"+usernames[i]+"</a></span></div>";
    html    += "<div class='col-xs-7'>Loading...</div>";
    html    += "</a></div>";
    $("#main").append(html);
  }
  
  var pullUserData = function(username) {
    var id = "#" + username.toLowerCase();
    var logoId = id + "_logo";
    var accountStatus = '';
    var game = '';
    var logo = '';
    $.getJSON(twitchBaseURL+username.toLowerCase()+'?callback=?',
              function(data) {
      if (data.hasOwnProperty('status')) {
            if (data.status === 404) {
              logo = "http://s20.postimg.org/j9uag778t/no_account.png";
              accountStatus = "There is no account associated with this username";
            }
            else if (data.status === 422) {
              logo = "http://s20.postimg.org/htiry24bx/account_closed.png";
              accountStatus = "This account has been closed";
            }
      }
      else {
        if (data.stream === null) {
          logo = "http://s20.postimg.org/rgma7rxbh/offline.png";
          accountStatus = "This user is offline";
        }
        else {
          accountStatus = "online";
          game = data.stream.game;
          logo = data.stream.channel.logo;
          console.log(this.logo);
        }
      }
    }).done(function() {
        if (game !== '') {
            $(id).children('.col-xs-7').html("<a href='https://www.twitch.tv/"+id.slice(1)+"'>Now playing "+game+"</a>");
        } else {
            $(id).children('.col-xs-7').html(accountStatus);
            $(id).fadeTo(1000, 0.75);
            $(id).hover(
                function() { $(this).css("opacity", 1); },
                function() { $(this).css("opacity", 0.75);}
            );
        }
        if (logo !== '') {
          $(logoId).attr('src',logo);
        }
    });
    $('a').attr('target','_blank');
  };
  
  for (var i = 0; i < usernames.length; i++) {
    pullUserData(usernames[i]);
  }
});