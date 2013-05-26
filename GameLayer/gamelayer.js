var sList;
var stage;
var interval = 25;
var focus;

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
	console.log(sList);
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
		focus = event.target;
		event.addEventListener("mouseup", function(evt) {
			console.log("mouseup");
			focus.destination = new Loc(evt.stageX, evt.stageY);
			console.log(focus);
			focus = null;
		});
	}
}
function Settlement(pop, xCoord, yCoord, map) {
	this.population = pop;
	this.x = xCoord;
	this.y = yCoord;
	this.destination;
	this.speed;
	this.migrateOnce = migrateOnce;
	this.addEventListener("mousedown", mouseHandler);
	this.graphics.beginFill("red").drawCircle(0,0,10);
	stage.addChild(this);
	sList.push(this);
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
		this.x += flipped*totalMovement*Math.cos(angle);
		this.y += flipped*totalMovement*Math.sin(angle);
	}
}

var Loc = function(xCoord, yCoord){
	var x;
	var y;
}

