var contentcontainer;
var minimap;
var pause;
var heatPref;
var waterPref;
var nutrientPref;
var popsize;
var currentName;

function initUI(){
	contentcontainer = new createjs.Container();
	// minimap = stage.getChildByName(map);
	var minimapContainer = new createjs.Container();
	var mainContainer = new createjs.Container();
	var controlContainer = new createjs.Container();
	var testing1 = new createjs.Shape();
	testing1.graphics.beginFill("#F00").drawRect(0,0,200,150);
	minimapContainer.addChild(testing1);

	var testing3 = new createjs.Shape();
	testing3.graphics.beginFill("#00F").drawRect(0,0,200,150);
	controlContainer.addChild(testing3);

	pause = document.getElementById("test");
	var pauseButton = new createjs.DOMElement(pause);
	pauseButton.x = 50;
	pauseButton.y = 475;
	controlContainer.addChild(pauseButton);

	var pingButton = new createjs.DOMElement(document.getElementById("ping"));
	pingButton.x = 50;
	pingButton.y = 505;
	controlContainer.addChild(pingButton);

	popsize = new createjs.DOMElement(document.getElementById("popsize"));
	popsize.x = 10;
	popsize.y = 500;
	mainContainer.addChild(popsize);

	heatPref = new createjs.DOMElement(document.getElementById("heatPref"));
	heatPref.x = 10;
	heatPref.y = 520;
	mainContainer.addChild(heatPref);

	waterPref = new createjs.DOMElement(document.getElementById("waterPref"));
	waterPref.x = 10;
	waterPref.y = 540;
	mainContainer.addChild(waterPref);

	nutrientPref = new createjs.DOMElement(document.getElementById("nutrientPref"));
	nutrientPref.x = 10;
	nutrientPref.y = 560;
	mainContainer.addChild(nutrientPref);

	contentcontainer.addChild(minimapContainer);
	// minimapContainer.y = 450;
	contentcontainer.addChild(mainContainer);
	mainContainer.x = 200;
	// mainContainer.y = 450;
	contentcontainer.addChild(controlContainer);
	controlContainer.x = 700;
	// controlContainer.y = 450;

	uiStage.addChild(contentcontainer);

	uiStage.update();
}

function updateUI(focus){
	contentcontainer.children[1].removeAllChildren();
	currentName = new createjs.Text("Current Population", "24px Arial", "#000");
	currentName.x = 175;
	currentName.y = 10;
	contentcontainer.children[1].addChild(currentName);

	popsize.htmlElement.innerHTML = "Population size: " + focus.population;
	heatPref.htmlElement.innerHTML = "Heat Preference: " + focus.traits.list[0];
	waterPref.htmlElement.innerHTML = "Water Preference: " + focus.traits.list[1];
	nutrientPref.htmlElement.innerHTML = "Nutrient Preference: " + focus.traits.list[2];

	// currentPop = new createjs.Text("Population size: " + focus.population, "12px Arial", "#000");
	// currentPop.x = 10;
	// currentPop.y =50;
	// contentcontainer.children[1].addChild(currentPop);


	// heatPref = new createjs.Text("Heat preference:       " + focus.traits.list[0], "12px Arial", "#000");
	// heatPref.x = 10;
	// heatPref.y = 70;
	// contentcontainer.children[1].addChild(heatPref);

	// waterPref = new createjs.Text("Water preference:     " + focus.traits.list[0], "12px Arial", "#000");
	// waterPref.x = 10;
	// waterPref.y = 90;
	// contentcontainer.children[1].addChild(waterPref);

	// nutPref = new createjs.Text("Nutrient preference: " + focus.traits.list[0], "12px Arial", "#000");
	// nutPref.x = 10;
	// nutPref.y = 110;
	// contentcontainer.children[1].addChild(nutPref);
}
