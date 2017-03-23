$(document).ready(function(){

    $(".btn-main-control").click(function(){
        $(".navbar-side").animate({
        	width: 'toggle'
        });
    });

	(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
	ga('create', 'UA-84863639-1', 'auto');
	ga('send', 'pageview');

	

});


window.onload = function() {

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
	var canvas = createHiDPICanvas(1500, 1000);
	document.body.appendChild(canvas);
	
	var ctx = canvas.getContext("2d");


		//canvas.width = 500;
		//canvas.height = 500;
		/*var canvas = document.getElementById("myCanvas");
		var ctx = canvas.getContext("2d");

		canvas.width = 500;
		canvas.height = 500;*/

		var w = 1000;
		var h = 1000;
		var wh = w/2;
		var hh = h/2;
		var speedMax = 5;
		var partSize = 2;
		var count = 200;
		var grav = 2;
		var pA2 = [];
		var PI2 = Math.PI * 2;

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
}
















	/*var c=document.getElementById("myCanvas");
	var ctx=c.getContext("2d");
	ctx.beginPath();
	ctx.arc(100,75,50,0,2*Math.PI);
	ctx.stroke();*/
/*
	var TWO_PI = 2*Math.PI;

	var canvas = document.getElementById("myCanvas");
	var c = canvas.getContext("2d");

	var particles = {};
	var particleIndex = 0;

	c.fillStyle = "white";
	c.fillRect(0, 0, canvas.width, canvas.height);

	var posX = 500;
	var posY = 0;

	function Particle(){
		this.s = Math.floor((Math.random() * 4) + 1);
		this.x = Math.floor((Math.random() * 1000) + 1);
		this.y = 0;
		particleIndex++;
		particles[particleIndex] = this;
		this.draw = function() {
			this.y += this.s;
			c.fillStyle = "orange";
			c.beginPath();
			c.arc(this.x,this.y,2.5,0,TWO_PI,false);
			c.fill();
		};
	}

	for ( var i = 0; i < 6; i++){
		new Particle();
	}
	

	setInterval( function(){
		c.fillStyle = "white";
		c.fillRect(0, 0, canvas.width, canvas.height);
		//posX += 1;
		//posY += 1;
		for(var i in particles){
			particles[i].draw();
		}
		//c.fillStyle = "blue";
		//c.fillRect(posX, posY, 100, 100);

	}, 30);
*/
	



/*< countom  += 1rp
	pA.push(
	);
}ts*;/
/MASONRY 

/*
window.onload = function() {
	
	  // set up the base pattern
	 var pattern = Trianglify({
		variance: .9,
		seed: 'qpvh',
		height: 300,
		width: window.innerWidth,
		cell_size: 50,
		x_colors: 'GnBu'});
	  
	  // svg 
	//document.body.appendChild(pattern.svg());
	pattern.canvas(document.getElementById('myCanvas'));

	document.addEventListener("mousemove", myFunction);
	function myFunction() {
		var x = (Math.floor((Math.random() * 20) + 70))/1;
		 // set up the base pattern
		 var pattern = Trianglify({
		variance: .8,
		seed: 'qpvh',
		height: 300,
		width: window.innerWidth,
		cell_size: x,
		x_colors: 'GnBu'});
	 
	  // svg 
	  pattern.canvas(document.getElementById('myCanvas'));	
	}
  
	var placeholders = [];
	var i = 0;

	document.querySelectorAll('.img-placeholder').forEach(function(placeholder) {
		placeholders.push(placeholder);
	});	 

	shuffleArray(placeholders);
	loadSmallImages(placeholders);		

	function loadSmallImages(placeholders){
		if (i >= placeholders.length){
			i = 0;
			loadLargeImages(placeholders);
			return;	
		}
		var imgSmall = new Image();
		var placeholder = placeholders[i];
		var url = placeholder.dataset.small;		
		imgSmall.src = url;		
		placeholder.appendChild(imgSmall);		
		imgSmall.onload = function(){ 
			i++;
			imgSmall.classList.add('small-loaded');
			loadSmallImages(placeholders) 
		};			
	}		
		
	function loadLargeImages(placeholders){
		if (i >= placeholders.length){
			i = 0;
			$('.grid').masonry();
			return;	
		}
		var imgLarge = new Image();
		var placeholder = placeholders[i];
		var url = placeholder.dataset.large;		
		imgLarge.src = url;		
		placeholder.appendChild(imgLarge);		
		imgLarge.onload = function(){ 
			i++;
			imgLarge.classList.add('large-loaded');
			loadLargeImages(placeholders) 
		};			
	}	
		 
	function shuffleArray(array) {
		for (var i = array.length - 1; i > 0; i--) {
			var j = Math.floor(Math.random() * (i + 1));
			var temp = array[i];
			array[i] = array[j];
			array[j] = temp;
		}
		return array;
	}	

   $(window).resize(function() {
   		$('.grid').masonry();
   });
   
   
}

jQuery(document).ready(function($){
	$('.grid').masonry({
	  itemSelector: '.grid-item',
	  columnWidth: '.grid-sizer',
	  percentPosition: true
	});

	$(document).mousemove(function(event){
        $("#coordinates").text(event.pageX + ", " + event.pageY);
    });
	
	


});
*/