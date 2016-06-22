$(document).ready(function () {
  var baseArticleURL = "https://en.wikipedia.org/wiki/";
  var baseSearchURL = "https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srwhat=text&srprop=snippet&srsearch=";
  
  function ResultBox(url, title, snippet) {
    this.url = url;
    this.title = title;
    this.snippet = snippet;
    this.html = "<div class='resultBox' onclick=window.open('" + this.url + "')>";
    this.html += "<p class='title'>"+this.title+"</p>";
    this.html += "<p class='snippet'>"+this.snippet+"</p>";
    this.html += "</div>";
    this.draw = function(drawArea) {
      $(drawArea).append(this.html);
    };
  }

  var drawResultBoxes = function(numberOfBoxes, drawArea, results) {
    for (var i = 0; i < numberOfBoxes; i++) {
      var resultBox = new ResultBox(articleURL, title, snippet);
      resultBox.draw(drawArea);
    }
  }
  
  $("form").submit(function(event) {
    var searchTerm = $("#searchbox").val();

    $.ajax({
      dataType: "jsonp",
      url: baseSearchURL + searchTerm,
      success: function(data) {
        results = data.query.search;
        if (results.length > 0) {
          $("#results").empty();
        
          for (var i = 0; i < results.length; i++) {
            var title = results[i].title;
            var parsedTitle = title.replace(/ /g, "_");
            var articleURL = baseArticleURL + parsedTitle;
            var snippet = results[i].snippet;
          
            var resultBox = new ResultBox(articleURL, title, snippet);
            resultBox.draw("#results");
            $("#main").css("padding-top","0");
          }
        }
        else {
          alert("No results found!  Please try again.");
          $("#searchbox").val("");
        }
      }
    });

    
    event.preventDefault();
  });
  
  $("#searchbox").keyup(function(e) {
    if (e.keyCode === 27) {
      $("#searchbox").val("");
      $("#results").empty();
      $("#main").css("padding-top","10%");
    }
  });
});