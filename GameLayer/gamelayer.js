var sList;
var stage;
var interval = 25;
var focus = null;
var sight;
var popAdjuster;
var popText;

Settlement.prototype = new createjs.Shape();
Settlement.prototype.constructor = Settlement;

function initGame() {
	stage = new createjs.Stage("screen");
	stage.enableMouseOver(10);
	console.log("chkpt 1");
	console.log("chkpt 2");
	sList = new Array();
	new Settlement(100,5,5);
	new Settlement(200,10,20);
	new Settlement(200,100,200);
	// stage.addEventListener("click", function(evt){
	// 	console.log("clickedonstage");
	// 	console.log(evt.stageX);
	// 	console.log(evt.stageY);
	// });
initScreen();
initSight();
initPopAdjuster();
}

function initScreen() {
	document.onkeydown = handleKeyDown;

	createjs.Ticker.addEventListener("tick", refresh);
	createjs.Ticker.setInterval(interval);
	// stage.addEventListener("click", function(evt){
	// 	console.log("clicked on stage");
	// 	console.log(evt.stageX);
	// });
}

function handleKeyDown(e) {
	console.log("key was detected");
	if(focus != null) {
		switch(e.keyCode) {
		case 65: if(focus.movingPop > 0) {focus.movingPop-=10}; break; //A Key
		case 68: if(focus.movingPop < focus.population) {focus.movingPop+=10}; break; //D Key
		}
		console.log(focus.movingPop);
		updatePopAdjuster()
	}
}

function refresh() {
	for(i in sList) {
		sList[i].migrateOnce();
		// sList[i].survival();
	}
	stage.update();
}

function mouseHandler(event){
	console.log("SOME EVENT HAPPENED");
	if (event.type == "click"){
		console.log(sight.x);
		if (focus != null){
			console.log("Secondclicked");
			console.log(focus.movingPop);
			console.log(sight.alpha);
			if (focus.movingPop > 0){
				console.log("focus.movingPop > 0");
				if (focus.movingPop < focus.population){	
					var settle = new Settlement(focus.movingPop, focus.x, focus.y, focus.map);
					settle.destinationX = event.stageX;
					settle.destinationY = event.stageY;
					focus.population = focus.population - focus.movingPop;
				} else {
					focus.destinationX = event.stageX;
					focus.destinationY = event.stageY;
				} 
			} else {
				sight.alpha = 0;
				popAdjuster.alpha = 0
			}
			// sight.alpha = 0;
			// popAdjuster.alpha = 0;
			focus.movingPop = focus.population;
			console.log("focus.movingPop");
			focus = null;
			console.log(focus);
			// stage.removeEventListener('click', stageEventHandler);
			stage.removeEventListener('stagemousemove', stageEventHandler);
			// stage.removeEventListener('mouseWheel', stageEventHandler);	

		} else {
			focus = event.target;
			console.log(focus);
			aimSight(event.stageX, event.stageY);
			sight.alpha = .5;
			popAdjuster.alpha = 1;
			console.log(sight.alpha);
			console.log("first clicked");
			console.log(focus);
			stage.addEventListener("stagemousemove", stageEventHandler);
			// stage.addEventListener("mouseWheel", stageEventHandler);
		}
	}
	// if (event.type == "stagemousemove"){
	// 	console.log("called mousemove");
	// 	aimSight(event.stageX, event.stageY);
	// 	aimPopAdjuster();

	// }	
	// event.addEventListener("click", function (ev){
	// 		console.log("secondclicked");
	// 		if (ev.type == "click"){
	// 			console.log("mouse was clicked a second time");
	// 			if (focus.movingPop > 0){

	// 			if (focus.movingPop < focus.population){	
	// 				var settle = new Settlement(focus.movingPop, focus.x, focus.y, focus.map);
	// 				settle.destinationX = ev.stageX;
	// 				settle.destinationY = ev.stageY;
	// 				focus.population = focus.population - movingPop;
	// 				focus = null;
	// 			} else {
	// 				focus.destinationX = ev.stageX;
	// 				focus.destinationY = ev.stageY;
	// 				}
	// 			} 
	// 			sight.alpha = 0;
	// 			popAdjuster.alpha = 0;
	// 			console.log("secondclicked1");
	// 		}	
	//});
// if (event.type == "mousewheel"){
// 	console.log("mousewheeled");
// 	var zoom;
// 	if(Math.max(-1, Math.min(1, (event.WheelDelta || -event.detail)))>0){
// 		zoom=1;
// 	}else{
// 		zoom=-1;
// 	}
// 	if (focus.movingPop + zoom > 0){
// 		if (focus.movingPop + zoom < focus.population){
// 			focus.movingPop = focus.movingPop + zoom;
// 		} else {
// 			focus.movingPop = focus.population;
// 		} 
// 	} else {
// 		focus.movingPop = 0;
// 	}
// }
	// 	event.addEventListener("mousemove", function (ev){
	// 		aimSight(ev.stageX, ev.stageY);
	// 		aimPopAdjuster();
	// 	})
	// 	event.addEventListener("click", function (ev){
	// 		if (ev.type == "click"){
	// 			console.log("mouse was clicked a second time");
	// 			if (focus.movingPop > 0){

	// 			if (focus.movingPop < focus.population){	
	// 				var settle = new Settlesment(focus.movingPop, focus.x, focus.y, focus.map);
	// 				settle.destinationX = ev.stageX;
	// 				settle.destinationY = ev.stageY;
	// 				focus.population = focus.population - movingPop;
	// 				focus = null;
	// 			} else {
	// 				focus.destinationX = ev.stageX;
	// 				focus.destinationY = ev.stageY;
	// 				}
	// 			} 
	// 			sight.isVisible = false;
	// 		}	
	// 	});

	// }
	// if (event.type == "mousedown"){
	// 	console.log("mousedown");
	// 	focus = event.target;
	// 	event.addEventListener("mouseup", function(evt) {
	// 		console.log("mouseup");
	// 		focus.destinationX = evt.stageX;
	// 		focus.destinationY = evt.stageY;
	// 		console.log(evt.stageX);
	// 		console.log(focus.destinationX);
	// 		focus = null;
	// 	});
	// }
}
// function wheelHandler(event){
// 	console.log("wheelhandler called");
// 	if(focus != null){
// 		if (event.type == "mousewheel"){
// 			console.log("mousewheeled");
// 			var zoom;
// 			if(Math.max(-1, Math.min(1, (event.WheelDelta || -event.detail)))>0){
// 				zoom=1;
// 			}else{
// 				zoom=-1;
// 			}
// 			if (focus.movingPop + zoom > 0){
// 				if (focus.movingPop + zoom < focus.population){
// 					focus.movingPop = focus.movingPop + zoom;
// 				} else {
// 					focus.movingPop = focus.population;
// 				}
// 			} else {
// 				focus.movinPop = 0;
// 			}
// 		}
// 	}
// }
function stageEventHandler(event){
	console.log("stageevent called");
	// if (event.type == "mousewheel"){
	// 	console.log("mousewheeled");
	// 	var zoom;
	// 	if(Math.max(-1, Math.min(1, (event.WheelDelta || -event.detail)))>0){
	// 		zoom=1;
	// 	}else{
	// 		zoom=-1;
	// 	}
	// 	if (focus.movingPop + zoom < 0){
	// 		if (focus.movingPop + zoom < focus.population){
	// 			focus.movingPop = focus.movingPop + zoom;
	// 		} else {
	// 			focus.movingPop = focus.population;
	// 		}

	// 	} else {
	// 		focus.movinPop = 0;
	// 	}
	// }
	if (event.type == "stagemousemove"){
		aimSight(event.stageX, event.stageY);
		aimPopAdjuster();
		updatePopAdjuster();

	}	
	// if (event.type == "click"){
	// 	if (focus != null){
	// 		console.log("Secondclicked");
	// 		if (focus.movingPop > 0){
	// 			if (focus.movingPop < focus.population){	
	// 				var settle = new Settlement(focus.movingPop, focus.x, focus.y, focus.map);
	// 				settle.destinationX = ev.stageX;
	// 				settle.destinationY = ev.stageY;
	// 				focus.population = focus.population - movingPop;
	// 				focus = null;
	// 			} else {
	// 				focus.destinationX = ev.stageX;
	// 				focus.destinationY = ev.stageY;
	// 			} 
	// 			sight.alpha = 0;
	// 			popAdjuster.alpha = 0;
	// 		}
	// 		focus = null;
	// 		stage.removeEventListener('click', stageEventHandler);
	// 		stage.removeEventListener('stagemousemove', stageEventHandler);
	// 		stage.removeEventListener('mousewheel', stageEventHandler);	
	// 	} 
	// }
}

function Settlement(pop, xCoord, yCoord, map,idealT,tempResist) {
	this.population = pop;
	this.movingPop = pop;
	this.x = xCoord;
	this.y = yCoord;
	this.destinationX;
	this.destinationY;
	this.speed;
	this.movingPop;
	this.migrateOnce = migrateOnce;
	this.addEventListener("click", mouseHandler);
	// this.addEventListener("mouseWheel", mouseHandler);
	// this.addEventListener("stagemousemove", mouseHandler);
	this.graphics.beginFill("red").drawCircle(0,0,10);
	stage.addChild(this);
	sList.push(this);
}

Settlement.prototype.survival = function(map){
	var netGrowth = (this.tempResist - Math.abs(Math.floor((this.map.tiles[this.xCoord / 16][this.yCoord / 16].temperature) * 100))) / this.tempResist;
	var newPop = netGrowth * interval + this.population;
	this.population = newPop;
}

var migrateOnce = function(){
	var totalMovement = 10;

	if (this.destinationX != null){
		// console.log("cleared MO CKPT 1");
		// console.log(this.destinationX);
		// console.log(this.x);
		if (Math.abs(this.destinationX - this.x) > 5 ||
			Math.abs(this.destinationY - this.y) > 5){
		// flipped accounts for problems with arctan's range only being -pi/2 to pi/2
		// either 1 (atan works) or -1 (atan doesn't work)
		//console.log("cleared MO CHKPT2");
		var flipped = 1;
		var destX = this.destinationX;
		var destY = this.destinationY;
		//console.log(" migrateOnce stuffs" + this.x);
		//console.log(this.y);
		var angle = Math.atan((destY-this.y)/(destX-this.x));
		if (destX - this.x < 0){
			flipped = -1;
		}
		
		this.x += flipped*totalMovement*Math.cos(angle);
		this.y += flipped*totalMovement*Math.sin(angle);
	} else {
			this.destinationX = null;
			sight.alpha = 0;
			popAdjuster.alpha = 0;
	}
} else {
	this.destinationX = null;
}
}



var Loc = function(xCoord, yCoord){
	var x;
	var y;
}

function initSight() {
	sight = new createjs.Shape();
	sight.graphics.beginFill("blue").drawCircle(0,0,10);
	stage.addChild(sight);
	sight.addEventListener("click", mouseHandler);
	// sight.addEventListener("stagemousemove", mouseHandler);
	// sight.addEventListener("mousewheel", wheelHandler);
}

function aimSight(xCoords, yCoords) {
	sight.x = xCoords;
	sight.y = yCoords;
	stage.update();
}


function initPopAdjuster() {
	var popFrame = new createjs.Shape();
	popFrame.graphics.beginFill("black").drawRoundRect(-25,-50,50,30,5);
	popText = new createjs.Text();
	popAdjuster = new createjs.Container();
	popAdjuster.addChild(popFrame);
	stage.addChild(popAdjuster, popText);
}

function aimPopAdjuster() {
	if(focus != null) {
		popAdjuster.x = sight.x;
		popAdjuster.y = sight.y;
		stage.update();
	}
}

function updatePopAdjuster(){
	if (focus != null){
		stage.removeChild(popAdjuster);
		popAdjuster.removeChild(popText);
		popText = new createjs.Text(focus.movingPop, "20px Arial", "white");
		popText.x = -13;
		popText.y = -46;
		popAdjuster.addChild(popText);
		stage.addChild(popAdjuster);
	}
}