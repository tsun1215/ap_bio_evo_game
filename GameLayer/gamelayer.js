var sList;
var stage;
var interval = 25;
var focus;
var focus = null;
var sight;
var popAdjuster;
var popText;
var mapArr;

Settlement.prototype = new createjs.Shape();
Settlement.prototype.constructor = Settlement;

function initGame() {
	stage = new createjs.Stage("screen");
	stage.enableMouseOver(10);
	console.log("chkpt 1");
	console.log("chkpt 2");
	sList = new Array();
	initmap();
	new Settlement(200,100,200, mapArr);
	initScreen();
	initSight();
	initPopAdjuster();
}

function initmap(){
	mapArr = new Map(50,50,10, [Math.random()*10000,Math.random()*10000,Math.random()*10000]);
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
	if(createjs.Ticker.getTicks() % 90 == 0){
		for(i in sList){
			sList[i].survival();
		}
	}
	for(i in sList) {
		sList[i].migrateOnce(event.delta/10);
		}
	stage.update(event);
}

// function survive(event) {
// 	for(i in sList) {
// 		sList[i].survival();
// 	}
// }
function mouseHandler(event){
	//console.log("SOME EVENT HAPPENED");
	if (event.type == "click"){
		//console.log(sight.x);
		if (focus != null){
			//console.log("Secondclicked");
			//console.log(focus.movingPop);
			//console.log(sight.alpha);
			if (focus.movingPop > 0){
				//console.log("focus.movingPop > 0");
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
			focus = null;
			// stage.removeEventListener('click', stageEventHandler);
			stage.removeEventListener('stagemousemove', stageEventHandler);

		} else {
			focus = event.target;
			//console.log(focus);
			aimSight(event.stageX, event.stageY);
			sight.alpha = .5;
			popAdjuster.alpha = 1;
			//console.log(sight.alpha);
			//console.log("first clicked");
			//console.log(focus);
			stage.addEventListener("stagemousemove", stageEventHandler);
		}
	}
}

function stageEventHandler(event){
	//console.log("stageevent called");
	if (event.type == "stagemousemove"){
		//console.log("stagemousemoved");
		var loc = stage.globalToLocal(event.stageX, event.stageY);
		aimSight(loc.x, loc.y);
		aimPopAdjuster();
		updatePopAdjuster();
	}	
}
// 0 = % heat pref
// 1 = % water needy
// 2 = % nutrient dependent
var TraitsList = function(heat, water, nutrient){
	this.list = new Array();
	this.list[0] = heat;
	this.list[1] = water;
	this.list[2] = nutrient;
}

function Settlement(pop, xCoord, yCoord, amap) {
	this.population = pop;
	this.movingPop = pop;
	this.x = xCoord;
	this.y = yCoord;
	this.traits = new TraitsList(.15, .35, .7);
	this.destinationX;
	this.destinationY;
	this.speed;
	this.movingPop;
	this.migrateOnce = migrateOnce;
	this.addEventListener("click", mouseHandler);
	var color = rgbToHex(Math.floor(255*this.traits.list[0]),Math.floor(255*this.traits.list[1]),Math.floor(255*this.traits.list[2]))
	this.graphics.beginStroke("black").beginFill(color).drawCircle(0,0,8);
	stage.addChild(this);
	sList.push(this);
	this.map = amap;
}

Settlement.prototype.survival = function(){
	
	var calcInt = interval;
	var temp =  this.map.tiles[Math.floor(this.x / 16)][Math.floor(this.y / 16)].attributes.temperature * 100;
	console.log(temp);
	var domGrowthRate;
	var recGrowthRate;
	var calcDiff = ((Math.sqrt(Math.abs(50-temp))) + calcInt - 5)/ calcInt;
	//console.log(calcDiff);
	if (temp > 50){
		domGrowthRate = this.traits.list[0] * calcDiff;
		recGrowthRate = (1-this.traits.list[0]) * (1.9-calcDiff); 
	}
	if (temp < 50){
		domGrowthRate = this.traits.list[0] * (1.9-calcDiff);
		recGrowthRate = (1-this.traits.list[0]) * calcDiff; 
	}
	console.log(domGrowthRate);
	console.log(recGrowthRate);

	// var domGrowthRate = this.traits.list[0] * (Math.sqrt(temp - 0) + calcInt - 5)/calcInt;
	// console.log(domGrowthRate);
	// var recGrowthRate = (1-this.traits.list[0]) * (Math.sqrt(100-temp) + calcInt - 5)/calcInt;
	// console.log(recGrowthRate);
	// var domDeathRate = this.traits.list[0] * (Math.sqrt(100 - temp) + calcInt - 5)/calcInt;
	// console.log(domDeathRate);
	// var recDeathRate = (1-this.traits.list[0]) * (Math.sqrt(temp-0) + calcInt - 5)/calcInt;
	// console.log(recDeathRate);
	var totalGrowth = domGrowthRate + recGrowthRate;
	console.log("totalGrowth = " + totalGrowth);

	// var totalDeath = domDeathRate + recDeathRate;
	// console.log("totalDeath = " + totalDeath);

	// var totalChangeRate = totalGrowth - totalDeath;
	// console.log("totalChange = " + totalChangeRate);

	this.population = Math.floor(this.population*totalGrowth);
	this.movingPop = this.population;
	

	// this.traits[0] = (domGrowthRate - domDeathRate)/(recGrowthRate - recDeathRate);

	// if (Math.floor(this.map.tiles[this.xCoord / 16][this.yCoord / 16].temperature) > 50){

	// }
	// var netGrowth = (this.tempResist - Math.abs(Math.floor((this.map.tiles[this.xCoord / 16][this.yCoord / 16].temperature) * 100))) / this.tempResist;
	// var newPop = netGrowth * interval + this.population;
	// this.population = newPop;
}

var migrateOnce = function(speed){
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