var sList;
var stage;
var interval = 25;
var focus;
var lockmap = false;

Settlement.prototype = new createjs.Shape();
Settlement.prototype.constructor = Settlement;

function initGame() {
	stage = new createjs.Stage("screen");
	sList = new Array();
	initmap();
	new Settlement(100,5,5);
	new Settlement(200,10,20);
	new Settlement(200,100,200);
	initScreen();
}

function initmap(){
	var mapArr = new Map(100,100,10, [Math.random()*10000,Math.random()*10000,Math.random()*10000]);
	mapArr.generate();
	map = new createjs.Container();
	stage.addChild(map);
	for(var i = 0; i<mapArr.rows; i++)
	{
		for(var j=0; j<mapArr.cols; j++)
		{
			var temp = Math.floor(mapArr.tiles[i][j].attributes.temperature * 255);
			var water = Math.floor(mapArr.tiles[i][j].attributes.water * 255);
			var nut = Math.floor(mapArr.tiles[i][j].attributes.nutrients * 255);
			var color;
			if(water > 150)
			{
				var newwater = 255-water;
				newwater += 1.24;
				newwater *= 1.6;
				newwater = Math.floor(newwater);
				color = rgbToHex(0,0,newwater);
			}
			else if(water > 140)
			{
				color = rgbToHex(255,255,nut);
			}
			else if(water > 70)
			{
				color = rgbToHex(10,nut,10);
			}
			else
			{
				color = rgbToHex(255,255,nut);
			}
			if ( water > 100 && water < 120 && temp < 100)
			{
				var newwater = Math.floor(2 * (255-water));
				newwater = (newwater >255 ? 255: newwater);
				color = rgbToHex(newwater,newwater,newwater);
			}
			var pixel = new createjs.Shape();
			pixel.graphics.beginFill(color).drawRect(i*mapArr.tile_width,j*mapArr.tile_width,mapArr.tile_width,mapArr.tile_width);
			map.addChild(pixel);
		}
		map.cache(0,0,mapArr.rows*mapArr.tile_width,mapArr.cols*mapArr.tile_width);
	}
	stage.update();
}

function initScreen() {
	createjs.Ticker.addEventListener("tick", refresh);
	createjs.Ticker.setFPS(30);
	document.onkeypress = function(e) {
		e = e || window.event;
		var charCode = (typeof e.which == "number") ? e.which : e.keyCode;
		switch(String.fromCharCode(charCode)){
			case 'w':
				stage.y-=5;
				break;
			case 'a':
				stage.x-=5;
				break;
			case 's':
				stage.y+=5;
				break;
			case 'd':
				stage.x+=5;
				break;
		}
	};
}

function refresh(event) {
	for(i in sList) {
		sList[i].migrateOnce(event.delta/10);
	}
	stage.update(event);
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

			});
		});
	}
	if (event.type == "mousedown"){
		event.nativeEvent.preventDefault();
		focus = event.target;
		lockmap = true;
		event.addEventListener("mouseup", function(evt) {
			var loc = stage.globalToLocal(evt.stageX, evt.stageY);
			focus.destinationX = loc.x;
			focus.destinationY = loc.y;
			focus = null;
		});
	}
}
function Settlement(pop, xCoord, yCoord, mapArr) {
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


var migrateOnce = function(speed){
	var totalMovement = speed;

	if (this.destinationX != null){
		if (Math.abs(this.destinationX - this.x) > 20 || Math.abs(this.destinationY - this.y) > 20){
			var flipped = 1;
			var destX = this.destinationX;
			var destY = this.destinationY;
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