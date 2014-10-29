var loadedMovies = 0;
var movieArray = [65565625,91521357,90633659,90633660,90633661,
  105214138,105214563,105215078,105215865,105336769,81483531,
  81482559,81793730,81792939,72178950,72178951,72179093,
  72178946,72179094,72178949,72178948,72179092,
  90855498,91512294];
var movieDivArray = ["#m0","#d0","#m1","#m2","#m3",
    "#pm1","#pm2","#pm3","#pm4","#pm5","#pm6",
    "#pm7","#pm8","#pm9","#pm10","#pm11","#pm12",
    "#pm13","#pm14","#pm15","#pm16","#pm17",
    "#v_mediaid","#m4"];
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
      singleItem:true,
      navigationText : ["vorige","volgende"]

  });

  $("#owl-debat").owlCarousel({

      navigation : true, // Show next and prev buttons
      slideSpeed : 300,
      paginationSpeed : 400,
      singleItem:true,
      navigationText : ["vorige","volgende"]

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
    setTimeout(loadMovies, 250);
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
