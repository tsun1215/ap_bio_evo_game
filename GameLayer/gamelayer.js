var sList;
var stage;
var interval = 25;
var focus;
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
	//initmap();
	new Settlement(200,100,200);
	new Settlement(100,200,200);
	initScreen();
	initSight();
	initPopAdjuster();
}

function initmap(){
	var mapArr = new Map(200,150,10, [Math.random()*10000,Math.random()*10000,Math.random()*10000]);
	mapArr.generate();
	map = new createjs.Container();
	map.x = -(mapArr.cols*mapArr.tile_width)/2;
	map.y = -(mapArr.rows*mapArr.tile_width)/2;
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
			case 'q':
			if(focus.movingPop > 0) {
				focus.movingPop-=10
			}; 
			break;
			case 'e':
			if(focus.movingPop < focus.population) {
				focus.movingPop+=10
			}; 
			break;
		}
		updatePopAdjuster()
	};
}

function refresh(event) {
	for(i in sList) {
		sList[i].migrateOnce(event.delta/10);
		if(sList[i] != null) {
			sList[i].updatePopTag();
		}
	}
	stage.update(event);
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
				var loc = stage.globalToLocal(event.stageX, event.stageY);
				if (focus.movingPop < focus.population){	
					var settle = new Settlement(focus.movingPop, focus.x, focus.y, focus.map);
					settle.destinationX = loc.x;
					settle.destinationY = loc.y;
					focus.population = focus.population - focus.movingPop;
				} else {
					focus.destinationX = loc.x;
					focus.destinationY = loc.y;
				} 
			} else {
				sight.alpha = 0;
				popAdjuster.alpha = 0
			}
			// sight.alpha = 0;
			// popAdjuster.alpha = 0;
			focus.movingPop = focus.population;
			focus.checkMerge(event.stageX, event.stageY);
			focus = null;
			// stage.removeEventListener('click', stageEventHandler);
			stage.removeEventListener('stagemousemove', stageEventHandler);
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
		}
	}
}

function stageEventHandler(event){
	console.log("stageevent called");
	if (event.type == "stagemousemove"){
		var loc = stage.globalToLocal(event.stageX, event.stageY);
		aimSight(loc.x, loc.y);
		aimPopAdjuster();
		updatePopAdjuster();

	}	
}

//0 - % heat resistant
//1 - % water needy
//2 - % nutrient dependent
var Traits = function(heat, water, nutrient){
	this.list = new array();
	array[0] = heat;
	array[1] = water;
	array[2] = nutrient;
}

function Settlement(pop, xCoord, yCoord, map,idealT,tempResist) {
	this.population = pop;
	this.movingPop = pop;
	this.x = xCoord;
	this.y = yCoord;
	this.destinationX;
	this.destinationY;
	this.speed;
	this.addEventListener("click", mouseHandler);
	this.graphics.beginStroke("black").beginFill("red").drawCircle(0,0,8);
	stage.addChild(this);
	sList.push(this);
}

Settlement.prototype.survival = function(map){
	var netGrowth = (this.tempResist - Math.abs(Math.floor((this.map.tiles[this.xCoord / 16][this.yCoord / 16].temperature) * 100))) / this.tempResist;
	var newPop = netGrowth * interval + this.population;
	this.population = newPop;
}

Settlement.prototype.migrateOnce = function(speed){
	var totalMovement = speed;

	if (this.destinationX != null){
		if (Math.abs(this.destinationX - this.x) > 5 ||
			Math.abs(this.destinationY - this.y) > 5){
			// flipped accounts for problems with arctan's range only being -pi/2 to pi/2
			// either 1 (atan works) or -1 (atan doesn't work)
			//console.log("cleared MO CHKPT2");
			var flipped = 1;
			var destX = this.destinationX;
			var destY = this.destinationY;
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
		this.checkMergeHelper();
	}
}



var Loc = function(xCoord, yCoord){
	var x;
	var y;
}

function initSight() {
	sight = new createjs.Shape();
	sight.graphics.beginFill("blue").drawCircle(0,0,9);
	stage.addChild(sight);
	sight.addEventListener("click", mouseHandler);
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
	popAdjuster.addChild(popFrame, popText);
	stage.addChild(popAdjuster);
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
		popText.x = -17;
		popText.y = -46;
		popAdjuster.addChild(popText);
		stage.addChild(popAdjuster);
	}
}

Settlement.prototype.updatePopTag = function() {
	if(stage.getChildIndex(this.popTag) == -1) {
		var tagFrame = new createjs.Shape();
		tagFrame.graphics.beginFill("black").drawRoundRect(-2,1,20,10,4);
		this.popTag = new createjs.Container();
		this.popTag.addChild(tagFrame);
	}else{
		stage.removeChild(this.popTag);
		this.popTag.removeChild(this.tagText);
		this.popTag.x = this.x;
		this.popTag.y = this.y;
	}
	this.tagText = new createjs.Text(this.population, "9px Arial", "white");
	this.tagText.x = 0;
	this.tagText.y = 0;
	this.popTag.addChild(this.tagText);
	stage.addChild(this.popTag);
}

Settlement.prototype.checkMerge = function(xCoord, yCoord) {
	var index = sList.indexOf(this);
	var mergeSett;
	for(i in sList) {
		if(Math.sqrt(Math.pow(xCoord - sList[i].x,2) + Math.pow(yCoord - sList[i].y,2)) <= 8) {
			if(i != index){this.mergeSett = sList[i];}
		}
	}
}

Settlement.prototype.checkMergeHelper = function() {
	if (this.mergeSett != null) {
		if(Math.abs(this.x - this.mergeSett.x) < 8 && Math.abs(this.y - this.mergeSett.y) < 8) {
			this.population += this.mergeSett.population;
			this.movingPop = this.population;
			stage.removeChild(this.mergeSett);
			stage.removeChild(this.mergeSett.popTag);
			sList.splice(sList.indexOf(this.mergeSett), 1);
			this.mergeSett = null;
		}
	}
}

function getSettByArea(xCenter, yCenter, radius) {
	for(i in sList) {
		if(Math.sqrt(Math.pow(xCenter - sList[i].x,2) + Math.pow(yCenter - sList[i].y,2)) <= radius) {
			return sList[i];
		}
	}
	return null;
}

function getSettByCoords(xCoord, yCoord) {
	for(i in sList) {
		if(sList[i].x == xCoord && sList[i].y == yCoord)
			return sList[i];
	}
	return null;
}