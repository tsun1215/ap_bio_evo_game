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
		event.addEventListener("mouseup", function(evt) {
			console.log("mouseup");
			focus.destination = new Loc(evt.stageX, evt.stageY);
			console.log(event.target);
			console.log(focus);
			focus = null;
		});
	}
}

var Settlement = function(pop, xCoord, yCoord) {
	this.population = pop;
	this.destination = null;
	this.speed = 1;
	this.x = 1;
	this.y = 1;
	this.setX = function(x2){shape.x = x2}
	this.setY = function(y2){shape.y = y2}
	this.getX = function() {return this.shape.x;}
	this.getY = function() {return this.shape.y}
	this.migrateOnce = migrateOnce;

	sprite = new createjs.Shape();
	sprite.graphics.beginFill("red").drawCircle(0,0,10);
	sprite.x = xCoord;
	sprite.y = yCoord;
	stage.addChild(sprite);
	this.addChild(sprite);
	sprite.addEventListener("mousedown", mouseHandler);
	this.sprite = sprite;
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

