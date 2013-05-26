var sList;
var stage;
var interval = 25;
var focus;

function initGame() {
	var s1 = new Settlement(100, 5, 5);
	sList = new Array();
	sList.push(s1);

	initScreen();
}

function initScreen() {
	stage = new createjs.Stage("screen");
	createjs.Ticker.addEventListener("tick", update);
	createjs.Ticker.setInterval(interval);
	stage.addEventListener("mousedown", mouseHandler);
	stage.enableMouseOver(10);
	stage.mouseMoveOutside = true;
}

function update() {
	for(i in sList) {
		sList[i].migrateOnce(interval);
		sList[i].draw();
	}
}

function mouseHandler(event){
	if (event.type == "mousedown"){
		focus = event.target.parent;
	}
	if (event.type == "mouseup"){
		focus.destination = new Loc(event.stageX, event.stageY);
		focus = null;
	}
}

var Settlement = function(pop, xCoord, yCoord) {
	this.population = pop;
	this.destination = null;
	this.speed = 1;
	this.x = xCoord;
	this.y = yCoord;
	this.shape = new createjs.Shape();

}

var Circle = function() {

}

var migrateOnce = function(fpsDelta){
	if (destination != null){
		// flipped accounts for problems with arctan's range only being -pi/2 to pi/2
		// either 1 (atan works) or -1 (atan doesn't work)
		var flipped = 1;
		var destX = this.destination.x;
		var destY = this.destination.y;
		var angle = Math.atan((destY-this.y)/(destX-this.x));
		if (destX - this.x < 0){
			flipped = -1;
		}
		var totalMovement = fpsDelta * this.speed;
		this.x += flipped*totalMovement*cos(angle);
		this.y += flipped*totalMovement*sin(angle);
	}
}

var draw = function(){
	this.shape.graphics.beginFill("blue").drawCircle(this.x, this.y, this.population/50);
}


var Loc = function(xCoord, yCoord){
	var x;
	var y;
}

