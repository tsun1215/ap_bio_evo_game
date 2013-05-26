var sList;
var stage;
var interval = 25;


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
}

function update() {
	for(i in sList) {
		sList[i].migrateOnce(interval);
		sList[i].draw();
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

var Loc = function(xCoord, yCoord){
	var x;
	var y;
}

