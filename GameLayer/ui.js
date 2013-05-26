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