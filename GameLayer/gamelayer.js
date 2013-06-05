var sList;
var stage;
var interval = 25;
var focus;
var focus = null;
var selectedPop = null;
var sight;
var popAdjuster;
var popText;
var uiStage;
var currentName;
var resist;
var mapArr;
var arbKFactor = 1000;
var arbRValue = .5;
var paused;

Settlement.prototype = new createjs.Shape();
Settlement.prototype.constructor = Settlement;

function initGame() {
	stage = new createjs.Stage("screen");
	uiStage = new createjs.Stage("uiStage");
	stage.enableMouseOver(10);
	sList = new Array();
	initUI();
	initMap();
}

function mapReady()
{
	if(typeof mapArr.tiles[mapArr.rows-1] != "undefined" && typeof mapArr.tiles[mapArr.rows-1][mapArr.cols-1] != "undefined")
		return true;
	return false;
}

function initMap()
{
	mapArr = new Map(50,50,10, [Math.random()*10000,Math.random()*10000,Math.random()*10000]);
	mapArr.generate();
	var loading = document.createElement('div');
	//Show something loady
	loading.innerHTML = "LOADING LOL";
	loading.setAttribute("style","position:absolute");
	document.body.appendChild(loading);
	var generator = setInterval(function(){
		if(mapReady())
		{
			initDependencies();
			clearInterval(generator);
		}
		else
			return 0;
	},0);
	function initDependencies()
	{
		document.body.removeChild(loading);
		initMapDraw();
		new Settlement(200,100,200, mapArr);
		initScreen();
		initSight();
		initPopAdjuster();
	}
}

function initMapDraw(){
	map = new createjs.Container();
	//map.x = -(mapArr.cols*mapArr.tile_width)/2;
	//map.y = -(mapArr.rows*mapArr.tile_width)/2;
	stage.addChild(map);
	for(var i = 0; i<mapArr.rows; i++)
	{
		for(var j=0; j<mapArr.cols; j++)
		{
			var temp = Math.floor(mapArr.tiles[i][j].attributes[0] * 255);
			var water = Math.floor(mapArr.tiles[i][j].attributes[1] * 255);
			var nut = Math.floor(mapArr.tiles[i][j].attributes[2] * 255);
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
			pixel.graphics.beginFill(color).drawRect(0,0,mapArr.tile_width,mapArr.tile_width);
			pixel.x = i*mapArr.tile_width;
			pixel.y = j*mapArr.tile_width;
			map.addChild(pixel);
		}
		map.cache(0,0,mapArr.rows*mapArr.tile_width,mapArr.cols*mapArr.tile_width);
	}
	// var minimap = map.clone();
	// minimap.scaleX = .7;
	// minimap.scaleY = .7;
	// contentcontainer.children[0].addChild(minimap);
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
		updatePopAdjuster();
	};
	var canvas = document.getElementById("screen");
	canvas.addEventListener("mousewheel", MouseWheelHandler, false);
	canvas.addEventListener("DOMMouseScroll", MouseWheelHandler, false);
	stage.canvas.addEventListener("contextmenu",function(e) {
		if (e.button === 2) {
			e.preventDefault();
			return false;
		}
	});
	stage.addEventListener("stagemousedown", function(e)
	{
		e.nativeEvent.preventDefault();
		if(e.nativeEvent.which === 3)
		{
			var x = e.stageX - stage.x;
			var y = e.stageY - stage.y;
			function move(e)
			{
				e.nativeEvent.preventDefault();
				stage.x = e.stageX - x;
				stage.y = e.stageY - y;
			}
			stage.addEventListener("stagemousemove", move);
			function up(e)
			{
				if(e.nativeEvent.which === 3)
				{
					e.nativeEvent.preventDefault();
					stage.removeEventListener("stagemousemove", move);
					stage.removeEventListener("stagemouseup", up);
				}
			}
			stage.addEventListener("stagemouseup", up);
		}
	});			
}

function MouseWheelHandler(e) {
	if(focus!=null){
		if(Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)))>0){
			if(focus.movingPop < focus.population) {
				focus.movingPop+=10
			}; 
		}else{
			if(focus.movingPop > 0) {
				focus.movingPop-=10
			}
		}
		updatePopAdjuster();		
	}else{
		if(e.wheelDelta != 0)
		{
			var loc = stage.globalToLocal(e.clientX, e.clientY);
			if(Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)))>0){
				var zoom = 1.05/1;
			}else{
				var zoom=1/1.05;
			}
			stage.scaleX *= zoom;
			stage.scaleY *= zoom;
		}
	}
}

function refresh(event) {
	if(!createjs.Ticker.getPaused()){
		if(createjs.Ticker.getTicks() % 90 == 0){
			for(i in sList){
				sList[i].survival();
				sList[i].resetColor();
			}
			if(selectedPop){
				updateUI(selectedPop);
			}
		}
		for(i in sList) {
			sList[i].migrateOnce(event.delta/10);
			if(sList[i] != null) {
				sList[i].updatePopTag();
			}
		}
	}
	stage.update(event);
	uiStage.update(event);
}

// function survive(event) {
// 	for(i in sList) {
// 		sList[i].survival();
// 	}
// }

function settMoveHandler(event){
	if (event.type == "dblclick" && event.nativeEvent.which === 1){
		if (focus == null){
			focus = event.target;
			//console.log(focus);
			aimSight(event.stageX, event.stageY);
			sight.alpha = .5;
			popAdjuster.alpha = 1;
			updateUI(focus);
			stage.addEventListener("stagemousemove", stageEventHandler);
			stage.addEventListener("click", stageEventHandler);
		}
	}
}

function mouseHandler(event){
	if (event.type == "click" && event.nativeEvent.which === 1){
		selectedPop = event.target;
		updateUI(selectedPop);
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
	if (event.type == "click"){
		if (focus != null){
			// Moves the selected population on the second click
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
				popAdjuster.alpha = 0;
			}
			// sight.alpha = 0;
			// popAdjuster.alpha = 0;
			focus.movingPop = focus.population;
			focus.checkMerge(event.stageX, event.stageY);
			focus = null;
			// stage.removeEventListener('click', stageEventHandler);
			stage.removeEventListener('stagemousemove', stageEventHandler);
			stage.removeEventListener('click', stageEventHandler);
			contentcontainer.children[1].removeAllChildren();
		} else {
			contentcontainer.children[1].removeAllChildren();
		}
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
	this.previousPop = pop;
	this.movingPop = pop;
	this.x = xCoord;
	this.y = yCoord;
	this.traits = new TraitsList(.15, .25, .85);
	this.destinationX;
	this.destinationY;
	this.speed;
	this.addEventListener("click", mouseHandler);
	this.addEventListener("dblclick", settMoveHandler);
	this.color = rgbToHex(Math.floor(255*this.traits.list[0]),Math.floor(255*this.traits.list[1]),Math.floor(255*this.traits.list[2]))
	this.graphics.beginStroke("black").beginFill(this.color).drawCircle(0,0,8);
	console.log(this.color);
	stage.addChild(this);
	sList.push(this);
	this.map = amap;
}

Settlement.prototype.resetColor = function(){
	var colorChange = rgbToHex(Math.floor(255*this.traits.list[0]),Math.floor(255*this.traits.list[1]),Math.floor(255*this.traits.list[2]));
	console.log(colorChange);
	this.color = colorChange
	this.graphics.clear().beginStroke("black").beginFill(colorChange).drawCircle(0,0,8);
}

Settlement.prototype.survival = function(){
	var ovRate = 1;
	var k = arbKFactor;
	for (var i = 0; i < this.traits.list.length; i++){
		ovRate = this.surviveFactor(i) * ovRate;
	}
	k = k * ovRate;
	this.previousPop = this.population;
	this.population = this.population + Math.floor(arbRValue * this.population * (1 - (this.population/k)));
	//Math.floor(this.population*ovRate);
	this.movingPop = this.population;
	// var calcInt = interval;
	// console.log(this.map.tiles[Math.floor(this.x / 16)][Math.floor(this.y / 16)].attributes);
	// var temp =  this.map.tiles[Math.floor(this.x / 16)][Math.floor(this.y / 16)].attributes[0] * 100;
	// console.log(temp);
	// var domGrowthRate;
	// var recGrowthRate;
	// var calcDiff = ((Math.sqrt(Math.abs(50-temp))) + calcInt - 5)/ calcInt;
	
	// if (temp > 50){
	// 	domGrowthRate = this.traits.list[0] * calcDiff;
	// 	recGrowthRate = (1-this.traits.list[0]) * (1.9-calcDiff); 
	// }
	// if (temp < 50){
	// 	domGrowthRate = this.traits.list[0] * (1.9-calcDiff);
	// 	recGrowthRate = (1-this.traits.list[0]) * calcDiff; 
	// }

	// var totalGrowth = domGrowthRate + recGrowthRate;

	// this.population = Math.floor(this.population*totalGrowth);
	// this.traits.list[0] = domGrowthRate/(domGrowthRate + recGrowthRate);
	// // console.log (this.traits.list[0]);
	// this.movingPop = this.population;
	

	// this.traits[0] = (domGrowthRate - domDeathRate)/(recGrowthRate - recDeathRate);

	// if (Math.floor(this.map.tiles[this.xCoord / 16][this.yCoord / 16].temperature) > 50){

	// }
	// var netGrowth = (this.tempResist - Math.abs(Math.floor((this.map.tiles[this.xCoord / 16][this.yCoord / 16].temperature) * 100))) / this.tempResist;
	// var newPop = netGrowth * interval + this.population;
	// this.population = newPop;
}

Settlement.prototype.surviveFactor = function(factor){
	
	var fact =  this.map.tiles[Math.floor(this.x / 16)][Math.floor(this.y / 16)].attributes[factor] * 100;
	// var calcInt = fact * 2;
	console.log(fact);
	var domGrowthRate;
	var recGrowthRate;
	var calcDiff = (fact/50);
	//console.log(calcDiff);
	//if (fact > 50){
		domGrowthRate = this.traits.list[factor] * calcDiff;
		recGrowthRate = (1-this.traits.list[factor]) * (1.9-calcDiff); 
	//}
	// if (fact < 50){
	// 	domGrowthRate = this.traits.list[factor] * (-calcDiff);
	// 	recGrowthRate = (1-this.traits.list[factor]) * calcDiff; 
	// }
	this.traits.list[factor] = domGrowthRate/(domGrowthRate + recGrowthRate);
	var totalGrowth = domGrowthRate + recGrowthRate;
	return totalGrowth;
	// this.population = Math.floor(this.population*totalGrowth);
	
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
	sight.alpha = 0;
	sight.addEventListener("click", mouseHandler);
}

function aimSight(xCoords, yCoords) {
	sight.alpha=0.5;
	sight.x = xCoords;
	sight.y = yCoords;
	stage.update();
}


function initPopAdjuster() {
	var popFrame = new createjs.Shape();
	popFrame.graphics.clear().beginFill("black").drawRoundRect(-30,-50,60,30,5);
	popText = new createjs.Text();
	popAdjuster = new createjs.Container();
	popAdjuster.alpha = 0;
	popAdjuster.addChild(popFrame, popText);
	stage.addChild(popAdjuster);
}

function aimPopAdjuster() {
	if(focus != null) {
		popAdjuster.alpha = 1;
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
		popText.y = -46;
		switch(Math.floor(Math.log(focus.movingPop)/Math.LN10)+1) {
			case 1: popText.x = -5; break;
			case 2: popText.x = -11; break;
			case 3: popText.x = -17; break;
			case 4: popText.x = -23; break;
		}
		popAdjuster.addChild(popText);
		stage.addChild(popAdjuster);
	}
}

Settlement.prototype.updatePopTag = function() {
	if(stage.getChildIndex(this.popTag) == -1) {
		this.tagFrame = new createjs.Shape();
		this.tagFrame.graphics.clear().beginFill("black").drawRoundRect(-2,1,19,10,4);
		this.popTag = new createjs.Container();
		this.popTag.addChild(this.tagFrame);
	}else{
		stage.removeChild(this.popTag);
		this.popTag.removeChild(this.tagText);
		this.popTag.x = this.x;
		this.popTag.y = this.y;

		if(Math.floor(Math.log(this.previousPop)/Math.LN10) != Math.floor(Math.log(this.population)/Math.LN10)) {
			this.popTag.removeChild(this.tagFrame);
			this.tagFrame = new createjs.Shape();
			this.tagFrame.graphics.clear().beginFill("black");
			switch(Math.floor(Math.log(this.population)/Math.LN10+1)){
				case 1: this.tagFrame.graphics.drawRoundRect(-2,1,9,10,4); break;
				case 2: this.tagFrame.graphics.drawRoundRect(-2,1,14,10,4); break;
				case 3: this.tagFrame.graphics.drawRoundRect(-2,1,19,10,4); break;
				case 4: this.tagFrame.graphics.drawRoundRect(-2,1,24,10,4); break;
			}
			this.popTag.addChild(this.tagFrame);
		}
	}
	this.tagText = new createjs.Text(this.population, "9px Arial", "white");
	this.popTag.addChild(this.tagText);
	stage.addChild(this.popTag);
}

Settlement.prototype.checkMerge = function(xCoord, yCoord) {
	var index = sList.indexOf(this);
	var mergeSett;
	var set_loc = stage.globalToLocal(xCoord, yCoord);
	for(i in sList) {
		var dest_loc = stage.localToLocal(set_loc.x, set_loc.y, sList[i])
		if(sList[i].hitTest(dest_loc.x, dest_loc.y)) {
			if(i != index){this.mergeSett = sList[i];}
		}
	}
}

Settlement.prototype.checkMergeHelper = function() {
	if (this.mergeSett != null) {
		if(Math.abs(this.x - this.mergeSett.x) < 8 && Math.abs(this.y - this.mergeSett.y) < 8) {
			this.traits.list[0] = ((this.traits.list[0] * this.population) + (this.mergeSett.traits.list[0] * this.mergeSett.population))/(this.population + this.mergeSett.population);
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

function setPause(){
	paused = !createjs.Ticker.getPaused();
	createjs.Ticker.setPaused(paused);
}