var sList;
var stage;
var interval = 25;
var focus;
var sight;
var popAdjuster;

Settlement.prototype = new createjs.Shape();
Settlement.prototype.constructor = Settlement;

function initGame() {
	stage = new createjs.Stage("screen");
	console.log("chkpt 1");
	console.log("chkpt 2");
	sList = new Array();
	new Settlement(100,5,5);
	new Settlement(200,10,20);
	new Settlement(200,100,200);
	initScreen();
	initSight();
	initPopAdjuster();
}

function initScreen() {
	createjs.Ticker.addEventListener("tick", refresh);
	createjs.Ticker.setInterval(interval);
}

function refresh() {
	for(i in sList) {
		sList[i].migrateOnce(interval);
		sList[i].survival();
	}
	stage.update();
}

function mouseHandler(event){
	if (event.type == "click"){
		focus = event.target;
		focus.showPopAdjuster();
		event.addEventListener("mouseWheel", function (evt){
			var zoom;
			if(Math.max(-1, Math.min(1, (evt.wheelDelta || -evt.detail)))>0){
				zoom=1;
			}else{
				zoom=-1;
			}
			if (focus.movingPop + zoom < 0){
				if (focus.movingPop + zoom < focus.population){
					focus.movingPop = focus.movingPop + zoom;
				} else {
					focus.movingPop = focus.population;
				}
				
			} else {
				focus.movinPop = 0;
			}
			
			evt.addEventListener("click", function (ev){

			})
		})
	}
	if (event.type == "mousedown"){
		console.log("mousedown");
		focus = event.target;
		event.addEventListener("mouseup", function(evt) {
			console.log("mouseup");
			focus.destinationX = evt.stageX;
			focus.destinationY = evt.stageY;
			console.log(evt.stageX);
			console.log(focus.destinationX);
			focus = null;
		});
	}
}
function Settlement(pop, xCoord, yCoord, map,idealT,tempResist) {
	this.population = pop;
	this.movingPop;
	this.x = xCoord;
	this.y = yCoord;
	this.destinationX;
	this.destinationY;
	this.speed;
	this.migrateOnce = migrateOnce;
	this.addEventListener("mousedown", mouseHandler);
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
		if (Math.abs(this.destinationX - this.x) > 20 || Math.abs(this.destinationY - this.y) > 20){
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
	}
}
}

var Loc = function(xCoord, yCoord){
	var x;
	var y;
}

function initSight() {
	sight = createjs.Shape();
	sight.graphics.beginFill("blue").drawCircle(0,0,10);
	stage.addChild(sight);
}

function aimSight(xCoords, yCoords) {
	sight.x = xCoords;
	sight.y = yCoords;
	stage.update();
}


function initPopAdjuster() {
	var popFrame = new createjs.Shape();
	frame.graphics.beginFill("blue").drawRoundRect(0,0,20,10,5);
	var popText = new createjs.Text(focus.movingPop, "20px Arial", "black");
	popAdjuster = new createjs.Container();
	popAdjuster.addChild(popFrame, popText);
}

function aimPopAdjuster() {
	popAdjuster = (focus.x + sight.x)/2;
	popAdjuster = (focus.y + focus.y)/2;
	stage.update();
}