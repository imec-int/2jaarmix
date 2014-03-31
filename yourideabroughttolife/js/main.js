var loadedMovies = 0;
var movieArray = [87475447,87475447,87475447,87475447]
var movieDivArray = ["#m0","#m1","#m2","#m3"];
var scroller=self.setInterval(function(){checkScroll()},400);
var activeMenu = "movie";

$(document).ready(function() {
  // alert($("#movie .videoWrapper").height());
  setTimeout(initCarousel, 200);
  setTimeout(loadMovies, 500);

});

function initCarousel(){
  $("#owl-hackers").owlCarousel({

      navigation : true, // Show next and prev buttons
      slideSpeed : 300,
      paginationSpeed : 400,
      singleItem:true

  });

  $("#owl-debat").owlCarousel({

      navigation : true, // Show next and prev buttons
      slideSpeed : 300,
      paginationSpeed : 400,
      singleItem:true

      // "singleItem:true" is a shortcut for:
      // items : 1,
      // itemsDesktop : false,
      // itemsDesktopSmall : false,
      // itemsTablet: false,
      // itemsMobile : false

  });
}

function loadMovies(){
  if(loadedMovies < movieArray.length){
    // console.log("loading movie "+loadedMovies)
    $(movieDivArray[loadedMovies]).append(
      '<iframe id="player'+loadedMovies+'" src="http://player.vimeo.com/video/'+movieArray[loadedMovies]+'?api=1&autoplay=0&player_id=player'+loadedMovies+'&title=0&byline=0&portrait=0" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>'
      );
    loadedMovies++;
    setTimeout(loadMovies, 200);
  }
}



function checkScroll(){
  var scrollFromTop = $(this).scrollTop();
  // find the div which top is closest to top of browser
  var closest;
  var closestDistance = Infinity;
  $(".section").each(function(){
    //console.log($(this).attr("id") + " - " + Math.abs(scrollFromTop - $(this).offset().top) + " - " + closestDistance);

    if(Math.abs(scrollFromTop - $(this).offset().top) < closestDistance){
      var thisdiv = $(this).attr("id");
      closest = "#a_"+thisdiv;
      activeMenu = thisdiv;
      closestDistance = Math.abs(scrollFromTop - $(this).offset().top);
    }
  });
  if(closest){
    // console.log(closest+" is smallest");
    highlightMenuItem(closest);

  }
}

function highlightMenuItem(active){
  // console.log("highlight: " + active);
  $("#menu a").removeClass("menuItemActive");
  $("#menu a").addClass("menuItem");
  $(active).addClass("menuItemActive");
}