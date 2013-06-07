function refresh(event) {
    if(!createjs.Ticker.getPaused()){
        if(createjs.Ticker.getTicks() % 45 == 0){
            natDisaster();
            for(i in sList){
                sList[i].survival();
                sList[i].resetColor();
                if(Math.random()<0.4){
                    sList[i].moveTo(-10+sList[i].x+Math.random()*20, -10+sList[i].y+Math.random()*20);
                }
            }
            if(selectedPop){
                updateUI(selectedPop);
            }
            natDisaster = null;
        }
        if(createjs.Ticker.getTicks() % 225 == 0){
            console.log("Recalculating traits");
            for(i in sList){
                sList[i].adapt();
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
	document.getElementById('pause').className = (document.getElementById('pause').className == "" ? "activated" : "");
}

ping.prototype = new createjs.Shape();
ping.prototype.constructor = ping;

function ping(x,y){
    this.x = x;
    this.y = y;
    this.addEventListener("click",mouseHandler);
    this.graphics.beginStroke("black").beginFill("#F00").drawCircle(0,0,5);
    stage.addChild(this);
}