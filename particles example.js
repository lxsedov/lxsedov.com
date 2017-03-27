
		var canvas = document.createElement("canvas"); 
		canvas.width= 1800;
		canvas.height = 1000; 
		var ctx = canvas.getContext("2d"); 
		document.body.appendChild(canvas);
		mouseX = 0;
		mouseB = false;
		function clickedFun(event){
		  mouseX = event.clientX
		  mouseB = true;
		}
		  

		canvas.addEventListener("click",clickedFun);

		var w = 800;
		var h = 800;
		var wh = w/2;
		var hh = h/2;
		var speedMax = 5;
		var partSize = 2;
		var count = 100
		var grav = 1;
		var pA1 = [];  // particle arrays
		var pA2 = [];
		var PI2 = Math.PI * 2;

		// populate particle arrays
		for(var i = 0; i < count; i += 1){
		    // dumb list
		    pA1.push({
		       x : Math.random() * w,
		       y : Math.random() * h,
		       dx : (Math.random() -0.5)*speedMax,
		       dy : (Math.random() -0.5)*speedMax,
		       
		    })      
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
		//Old style line test. If two particles are less than dist apart
		// draw a line between them
		function linesBetween(parts,dist){
		    var distSq = dist*dist;
		    var x,y,d,j;
		    var i = 0;
		    var len = parts.length;
		    var p,p1;
		    ctx.beginPath();
		    for(; i < len; i ++){
		        p = parts[i];
		        for(j = i + 1; j < len; j ++){
		            p1 = parts[j];
		            x = p1.x-p.x;
		            if((x *= x) < distSq){
		                y = p1.y-p.y;
		                if(x + (y*y) < distSq){
		                    ctx.moveTo(p.x,p.y);
		                    ctx.lineTo(p1.x,p1.y)
		                }
		            }
		        }
		        
		    }
		    ctx.stroke();
		}

		var counter = 0;// counter for multyplexing
		// Fast version. As the eye can not posible see the differance of 
		// of 4 pixels over 1/30th of a second only caculate evey third
		// particls
		function linesBetweenFast(parts,dist){
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


		var drawLines; // to hold the function that draws lines
		// set where the screens are drawn
		var left = 10;
		var right = 10 * 2 + w;
		// Now to not cheat swap half the time
		if(Math.random() < 0.5){
		    right = 10;
		    left = 10 * 2 + w;
		}
		  

		// draws a screem
		var doScreen = function(parts){
		    ctx.fillStyle = "red"
		    drawAll(parts);
		    ctx.strokeStyle = "black";
		    ctx.lineWidth = 1;
		    drawLines(parts,109);
		}
		var guess = ""
		var guessPos;
		var gueesCol;
		ctx.font = "40px Arial Black";
		ctx.textAlign = "center";
		ctx.textBasline = "middle"
		var timer = 0;
		
		function update(){
		    ctx.setTransform(1,0,0,1,0,0);
		    ctx.clearRect(0,0,canvas.width,canvas.height);
		    ctx.setTransform(1,0,0,1,left,10);
		    ctx.strokeStyle = "red";
		    ctx.lineWidth = 4;
		    ctx.strokeRect(0,0,w,h);
		    drawLines = linesBetween;
		    doScreen(pA1)
		    ctx.setTransform(1,0,0,1,right,10);
		    ctx.strokeStyle = "red";
		    ctx.lineWidth = 4;
		    ctx.strokeRect(0,0,w,h);
		    drawLines = linesBetweenFast
		    doScreen(pA2)  
		  
		  
		  
		  
		    if(mouseB){
		      if((mouseX > 270 && right >250) ||
		          (mouseX < 250 && right < 250)){
		        guess = "CORRECT!"
		        guessPos = right;
		        guessCol = "Green";
		      }else{
		        guess = "WRONG"
		        guessPos = left
		        guessCol = "Red";
		      }
		      timer = 120;
		      mouseB = false;
		    }else
		    if(timer > 0){
		      timer -= 1;
		      if(timer > 30){
		        ctx.setTransform(1,0,0,1,guessPos,10);
		        ctx.font = "40px Arial Black";
		        ctx.fillStyle = guessCol;
		        ctx.fillText(guess,w/2,h/2);
		      }else{
		        if(Math.random() < 0.5){
		          right = 10;
		          left = 10 * 2 + w;
		        }else{
		          left = 10;
		          right = 10 * 2 + w;
		        }          
		      }
		      
		    }else{
		      ctx.setTransform(1,0,0,1,0,0);
		      ctx.font = "16px Arial Black";
		      var tw = ctx.measureText("Click which sim skips 2/3rd of").width +30;
		      
		      ctx.beginPath();
		      ctx.fillStyle = "#DDD";
		      ctx.strokeStyle = "Red";
		      ctx.rect(270-tw/2,-5,tw,40);
		      ctx.stroke();
		      ctx.fill();

		      ctx.fillStyle = "blue";
		      ctx.fillText("Click which sim skips 2/3rd of",270,15) ;
		      ctx.fillText("particle tests every frame",270,30) ;
		    }

		    requestAnimationFrame(update);
		}
		update();