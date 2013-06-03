var contentcontainer;
var minimap;

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

	contentcontainer.addChild(minimapContainer);
	contentcontainer.addChild(mainContainer);
	mainContainer.x = 200;
	contentcontainer.addChild(controlContainer);
	controlContainer.x = 700;

	uiStage.addChild(contentcontainer);

	uiStage.update();
}

function updateUI(focus){
	contentcontainer.children[1].removeAllChildren();
	currentName = new createjs.Text("Current Population", "24px Arial", "#000");
	currentName.x = 175;
	currentName.y = 10;
	contentcontainer.children[1].addChild(currentName);

	currentPop = new createjs.Text("Population size: " + focus.population, "12px Arial", "#000");
	currentPop.x = 10;
	currentPop.y =50;
	contentcontainer.children[1].addChild(currentPop);

	heatPref = new createjs.Text("Heat preference:       " + focus.traits.list[0], "12px Arial", "#000");
	heatPref.x = 10;
	heatPref.y = 70;
	contentcontainer.children[1].addChild(heatPref);

	waterPref = new createjs.Text("Water preference:     " + focus.traits.list[0], "12px Arial", "#000");
	waterPref.x = 10;
	waterPref.y = 90;
	contentcontainer.children[1].addChild(waterPref);

	nutPref = new createjs.Text("Nutrient preference: " + focus.traits.list[0], "12px Arial", "#000");
	nutPref.x = 10;
	nutPref.y = 110;
	contentcontainer.children[1].addChild(nutPref);
}