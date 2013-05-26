var sList;
var stage;
var interval = 25;
var focus;

function initGame() {
	stage = new createjs.Stage("screen");
	var s1 = new Settlement(100, 5, 5);
	sList = new Array();
	sList.push(s1);
	
	initScreen();
}

function initScreen() {
	createjs.Ticker.addEventListener("tick", refresh);
	createjs.Ticker.setInterval(interval);
	stage.addEventListener("mousedown", mouseHandler);
	stage.enableMouseOver(10);
	stage.mouseMoveOutside = true;
}

function refresh() {
	for(i in sList) {
		sList[i].migrateOnce(interval);
	}
	stage.update();
}

function mouseHandler(event){
	console.log("chkpt");
	if (event.type == "mousedown"){
		console.log("mousedown");
		focus = event.target.parent;
	}
	if (event.type == "mouseup"){
		console.log("mouseup");
		focus.destination = new Loc(event.stageX, event.stageY);
		focus = null;
	}
}

var Settlement = function(pop, xCoord, yCoord) {
	this.population = pop;
	this.destination = null;
	this.speed = 1;
	this.shape = new Sprite(xCoord, yCoord);
	this.setX = function(x2){shape.x = x2}
	this.setY = function(y2){shape.y = y2}
	this.getX = function() {return this.shape.x;}
	this.getY = function() {return this.shape.y}
	this.migrateOnce = migrateOnce;
}

var Sprite = function(xCoord, yCoord) {
	var shape = new createjs.Shape();
	shape.graphics.beginFill("red").drawCircle(0, 0, 10);
	shape.x = xCoord;
	shape.y = yCoord;
	stage.addChild(shape);
}

var migrateOnce = function(fpsDelta){
	if (this.destination != null){
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

