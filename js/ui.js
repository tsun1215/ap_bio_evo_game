var contentcontainer;
var minimap;
var pause;
var heatPref;
var waterPref;
var nutrientPref;
var popsize;
var currentName;
var species;

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

	pause = document.getElementById("pause");
	var pauseButton = new createjs.DOMElement(pause);
	pauseButton.x = 50;
	pauseButton.y = 475;
	controlContainer.addChild(pauseButton);

	var cButton = new createjs.DOMElement(document.getElementById("continue"));
	cButton.x = 50;
	cButton.y = 475;
	controlContainer.addChild(cButton);

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

	species = new createjs.DOMElement(document.getElementById("species"));
	species.x = 10;
	species.y = 580;
	mainContainer.addChild(species);

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

    // popsize.htmlElement.style.display = "block";
    // heatPref.htmlElement.style.display = "block";
    // waterPref.htmlElement.style.display = "block";
    // nutrientPref.htmlElement.style.display = "block";
    // document.getElementById("pause").style.display = "block";

	popsize.htmlElement.innerHTML = "Population size: " + focus.population;
	heatPref.htmlElement.innerHTML = "Prefered Temperature: " + (focus.traits.list[2] * 100).toFixed(2) + " F";
	waterPref.htmlElement.innerHTML = "Humidity Preference " + (focus.traits.list[1] * 100).toFixed(2) + "%";
	species.htmlElement.innerHTML = "Species Number: " + focus.speciesNumber;
	// nutrientPref.htmlElement.innerHTML = "Nutrient Preference: " + focus.traits.list[2];

}

