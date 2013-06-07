var dBox;
var dialog;

function refresh(event) {
    if(!createjs.Ticker.getPaused()){
        if(createjs.Ticker.getTicks() % 45 == 0){
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
            sList[i].updatePopTag();

            //Clears any dead Settlements
            if(sList[i].population <= 0) {
                stage.removeChild(sList[i]);
                stage.removeChild(sList[i].popTag);
                var j = sList.indexOf(sList[i]);
                sList.splice(j, 1);
                if(focus == sList[i]) {
                    sight.alpha = 0;
                    popAdjuster.alpha = 0;
                    focus = null;
                    stage.removeEventListener('stagemousemove', stageEventHandler);
                    stage.removeEventListener('click', stageEventHandler);
                    contentcontainer.children[1].removeAllChildren();
                }
                i--;
            }
        }
        stage.update(event);
        uiStage.update(event);
    }
}

function stageEventHandler(event){
    if (event.type == "stagemousemove"){
        var loc = stage.globalToLocal(event.stageX, event.stageY);
        aimSight(loc.x, loc.y);
        aimPopAdjuster();
        updatePopAdjuster();
    }
    if (event.type == "click"){
        if (focus != null){
            // Moves the selected population on the second click            
            if (focus.movingPop > 0){
                var loc = stage.globalToLocal(event.stageX, event.stageY);
                if (focus.movingPop < focus.population){
                    focus.splitTo(loc.x, loc.y);
                } else {
                    focus.moveTo(loc.x, loc.y);
                } 
            } else {    
                sight.alpha = 0;
                popAdjuster.alpha = 0;
            }
            
            focus.checkMerge(event.stageX, event.stageY);
            focus = null;
            stage.removeEventListener('stagemousemove', stageEventHandler);
            stage.removeEventListener('click', stageEventHandler);
            contentcontainer.children[1].removeAllChildren();
        } else {
            contentcontainer.children[1].removeAllChildren();
        }
    }
}

function setPause(){
    paused = !createjs.Ticker.getPaused();
    createjs.Ticker.setPaused(paused);
    if(paused){
        document.getElementById("pause").innerHTML = "Resume";
    } else{
        document.getElementById("pause").innerHTML = "Pause";
    }
}



function showDialog(text){
    // for(var i = 0; i < 3; i++){
    //     contentcontainer.children[i].removeAllChildren();
    // }
    // contentcontainer.removeAllChildren();
    dBox = new createjs.Shape();
    dBox.graphics.beginFill("#fff").drawRect(0,0,900,150);
    contentcontainer.addChild(dBox);

    document.getElementById("dialog").innerHTML = text;
    dialog = new createjs.DOMElement(document.getElementById("dialog"));
    dialog.x = 200;
    dialog.y = 500;
    contentcontainer.addChild(dialog);

    popsize.htmlElement.style.display = "none";
    heatPref.htmlElement.style.display = "none";
    waterPref.htmlElement.style.display = "none";
    nutrientPref.htmlElement.style.display = "none";
    document.getElementById("continue").style.display = "block";
    document.getElementById("pause").style.display = "none";
    setPause();
    uiStage.update();
}

function resume(){
    popsize.htmlElement.style.display = "block";
    heatPref.htmlElement.style.display = "block";
    waterPref.htmlElement.style.display = "block";
    nutrientPref.htmlElement.style.display = "block";
    document.getElementById("continue").style.display = "none";
    document.getElementById("pause").style.display = "block";

    document.getElementById("dialog").innerHTML = "";
    contentcontainer.removeChild(dialog, dBox);
    setPause();
}