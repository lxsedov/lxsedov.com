$(document).ready(function() {
    $('.mouse').click(function(){
        if($(window).scrollTop() >= $('body').height()/3){
            $('html, body').animate({scrollTop : 0},600);
        } else {
            $('html, body').animate({scrollTop : $(document).height()-$(window).height()},600);
        }
        return false;
    });
    $(window).scroll(function(){
        if ($(this).scrollTop() <= $('body').height()/3) {
            $(".mouse-scroll").addClass("animation-scroll-down");
            $(".mouse-scroll").removeClass("animation-scroll-up");
    		} else {
            $(".mouse-scroll").addClass("animation-scroll-up");
            $(".mouse-scroll").removeClass("animation-scroll-down");
    		}
  	});
});

$(window).on('load', function() {

  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
  ga('create', 'UA-84863639-1', 'auto');
  ga('send', 'pageview');

	var PIXEL_RATIO = (function () {
      var ctx = document.createElement("canvas").getContext("2d"),
        dpr = window.devicePixelRatio || 1,
        bsr = ctx.webkitBackingStorePixelRatio ||
              ctx.mozBackingStorePixelRatio ||
              ctx.msBackingStorePixelRatio ||
              ctx.oBackingStorePixelRatio ||
              ctx.backingStorePixelRatio || 1;
      return dpr / bsr;
	})();

	createHiDPICanvas = function(w, h, ratio) {
	    if (!ratio) { ratio = PIXEL_RATIO; }
	    var can = document.createElement("canvas");
	    can.width = w * ratio;
	    can.height = h * ratio;
	    can.style.width = w + "px";
	    can.style.height = h + "px";
	    can.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
	    return can;
	}



	//Create canvas with the device resolution.
	var canvas = createHiDPICanvas( Math.round($('.s0').width()) , Math.round($('.s0').height()) );

  /*var canvas = document.createElement('canvas');
  canvas.width = 500;
  canvas.height = 500;*/

	document.body.appendChild(canvas);

	var ctx = canvas.getContext("2d");

		//canvas.width = 500;
		//canvas.height = 500;
		/*var canvas = document.getElementById("myCanvas");
		var ctx = canvas.getContext("2d");

		canvas.width = 500;
		canvas.height = 500;*/



		var w = canvas.width;
		var h = canvas.height;
		var wh = w/2;
		var hh = h/2;
		var speedMax = 5;
		var partSize = 2;
		var count = 100;
		var grav = 2;
		var pA2 = [];
		var PI2 = Math.PI * 2;

    /*$( window ).resize(function() {
        w = $(this).width();
    });*/

		// populate particle arrays
		for(var i = 0; i < count; i += 1){
		    // smart list
		    pA2.push({
		       x : Math.random() * w,
		       y : Math.random() * h,
		       dx : (Math.random() -0.5)*speedMax,
		       dy : (Math.random() -0.5)*speedMax,
		       links : [], // add some memory
		    })
		    for(var j = 0; j < count; j += 1){
		        pA2[i].links[i] = false; // set memory to no links
		    }
		}

		// move and draw the dots. Just a simple gravity sim
		function drawAll(parts){
		    var x,y,d;
		    var i = 0;
		    var len = parts.length;
		    var p;
		    ctx.beginPath();
		    for(;i < len; i++){
		        p = parts[i];
		        x = wh-p.x;
		        y = hh-p.y;
		        d = x*x + y*y;
		        x *= grav / d;
		        y *= grav / d;
		        p.dx += x;
		        p.dy += y;
		        p.x += p.dx;
		        p.y += p.dy;
		        if(p.x <= 0){
		            p.dx -= p.dx/2;
		            p.x = 1;
		        }else
		        if(p.x >= w){
		            p.dx -= p.dx/2;
		            p.x = w-1;
		        }
		        if(p.y <= 0){
		            p.dy -= p.dy/2;
		            p.y = 1;
		        }else
		        if(p.y >= h){
		            p.dy -= p.dy/2;
		            p.y = w-1;
		        }
		        ctx.moveTo(p.x+partSize,p.y)
		        ctx.arc(p.x,p.y,partSize,0,PI2)
		    }
		    ctx.fill();
		}

		var counter = 0;// counter for multyplexing
		// Fast version. As the eye can not posible see the differance of
		// of 4 pixels over 1/30th of a second only caculate evey third
		// particls
		function linesBetweenFast(parts,dist){
			//strokeAlpha = (Math.floor((Math.random() * 10) + 1))/10;
			//ctx.strokeStyle = 'rgba(0,0,0,' + Math.random().toString(16) + ')';
		    var distSq = dist*dist;
		    var x,y,d,j,l;
		    var i = 0;
		    counter += 1;
		    var cc = counter % 3;
		    var wr,re;
		    var len = parts.length;
		    var p,p1;
		    var lineSet
		    ctx.beginPath();
		    for(; i < len; i ++){
		        p = parts[i];
		        l = p.links;
		        for(j = i + 1; j < len; j += 1){
		            p1 = parts[j];
		            if((j + cc)%3 === 0){ // only every third particle
		                lineSet = false;  // test for diferance default to fail
		                x = p1.x-p.x;
		                if((x *= x) < distSq){
		                    y = p1.y-p.y;
		                    if(x + (y*y) < distSq){
		                        lineSet = true;  // yes this needs a line
		                        ctx.strokeStyle = 'rgba(0,0,0,.2)';
		                    }
		                }
		                l[j] = lineSet; // flag it as needing a line
		            }
		            if(l[j]){ // draw the line if needed
		                ctx.moveTo(p.x,p.y);
		                ctx.lineTo(p1.x,p1.y);
		            }
		        }
		    }
		    ctx.stroke();
		}

		var drawLines;

		// draws a screem
		var doScreen = function(parts){
		    ctx.fillStyle = "red"
		    drawAll(parts);
		    //ctx.strokeStyle = "blue";
		    //ctx.strokeStyle = "rgba(0, 0, 0, " + Math.random() + ")";
		    ctx.lineWidth = 1;
		    drawLines(parts,99);
		}

		function update(){
		    ctx.setTransform(1,0,0,1,0,0);
		    ctx.clearRect(0,0,canvas.width,canvas.height);
		    //ctx.setTransform(1,0,0,1,10,10);
		    drawLines = linesBetweenFast;
		    doScreen(pA2);
		    requestAnimationFrame(update);
		}
		update();
});
