var sList; // List of all settlement objects
var stage; // The main stage
var focus; // The focused settlement for movement
var selectedPop; // Selected settlement to see info
var popAdjuster; // Rectagle to select amount of population for movement
var popText; // The text of the popAdjuster
var sight; // Shadow of where to move population
var uiStage; // The UI Stage; displays info
var mapArr; // THe Map object
var paused;
var chunkWidth = 50;
var chunkHeight = 50;

// Used for debugging and loading
var progress, timer; 

function initGame() {
    stage = new createjs.Stage("screen");
    uiStage = new createjs.Stage("uiStage");
    stage.enableMouseOver(10);
    sList = new Array();
    focus = null;
    selectedPop = null;
    initUI();
    initMap();
}

function startGame(){
    // Redraws the finished map and clears loading remenents
    map.updateCache();
    console.log("Map load time: " + ((+new Date)-timer)/1000+" sec");
    document.body.removeChild(progress);

    // Moves map and settlement to center
    stage.x = -(mapArr.rows*mapArr.tile_width)/2+300;
    stage.y = -(mapArr.cols*mapArr.tile_width)/2+300;
    new Settlement(200,700,450, mapArr);    

    initScreen();
    addEventListeners();
    initSight();
    initPopAdjuster();
    stage.update();
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

function initScreen() {
    stage.canvas.getContext('2d').webkitImageSmoothingEnabled = false;
    createjs.Ticker.addEventListener("tick", refresh);
    createjs.Ticker.setFPS(30);               
}

function addEventListeners(){
    // Keyboard Listener: Slightly unnecessary as of now
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

    // Scroll to zoom
    var canvas = document.getElementById("screen");
    canvas.addEventListener("mousewheel", MouseWheelHandler, false);
    canvas.addEventListener("DOMMouseScroll", MouseWheelHandler, false);
    
    // Prevents context menus
    stage.canvas.addEventListener("contextmenu",function(e) {
        if (e.button === 2) {
            e.preventDefault();
            return false;
        }
    });
    document.addEventListener("contextmenu",function(e) {
        if (e.button === 2) {
            e.preventDefault();
            return false;
        }
    });

    // Stage movement
    stage.addEventListener("stagemousedown", function(e) {
        e.nativeEvent.preventDefault();
        if(e.nativeEvent.which === 3)
        {
            var x = e.stageX - stage.x;
            var y = e.stageY - stage.y;
            function move(e)
            {
                e.nativeEvent.preventDefault();
                var newX = e.stageX - x;
                var newY = e.stageY - y;
                if(newX > 0)
                {
                    newX = 0;
                }
                else if(newX < stage.canvas.width-((mapArr.rows*mapArr.tile_width)*stage.scaleX))
                {
                    newX = stage.canvas.width-((mapArr.rows*mapArr.tile_width)*stage.scaleX);
                }   
                if(newY > 0)
                {
                    newY = 0;
                }
                else if(newY < stage.canvas.height-((mapArr.cols*mapArr.tile_width)*stage.scaleY))
                {
                    newY = stage.canvas.height-((mapArr.cols*mapArr.tile_width)*stage.scaleX);
                }
                stage.x = newX;
                stage.y = newY;
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

    // Debugging mouse click listener
    // Checks the color of the brick (to see if its actually the correct brick)
    // Remove for production
    map.addEventListener("click", function(e) {
        var loc = map.globalToLocal(e.stageX,e.stageY);
        var temp = Math.floor(mapArr.getTileAt(loc.x,loc.y).attributes[0] * 255);
        var water = Math.floor(mapArr.getTileAt(loc.x,loc.y).attributes[1] * 255);
        var nut = Math.floor(mapArr.getTileAt(loc.x,loc.y).attributes[2] * 255);
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
        console.log("Clicked color: "+color);
    });  
}

function MouseWheelHandler(e) {
    if(focus!=null){
        if(Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)))>0){
            if(focus.movingPop < focus.population) {
                focus.movingPop+=10;
            }
            if(focus.movingPop > focus.population) {
                // focus.movingPop = focus.population;
            }
        }else{
            if(focus.movingPop > 0) {
                focus.movingPop-=10;
            }
            if(focus.movingPop < 0) {
                focus.movingPop = 0;
            }
        }
        updatePopAdjuster();        
    }else{
        if(e.wheelDelta != 0)
        {
            zoomOnce(Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail))));
        }
    }
}

function zoomOnce(n) {   
    if(n>0){
        var zoom = 1.05/1;
    }
    else{
        var zoom=1/1.05;
    }
    stage.scaleX *= zoom;
    stage.scaleY *= zoom;
    if(stage.scaleX * mapArr.tile_width * mapArr.rows < stage.canvas.width)
    {
        stage.scaleX = 1/((mapArr.tile_width * mapArr.rows) / stage.canvas.width);
        stage.scaleY = stage.scaleX;
    }
    console.log(stage.x);
    setCenter(stage.x,stage.y);
}

function setCenter(x,y) {
    stage.x = -x*stage.scaleX+(stage.canvas.width/2);
    stage.y = -y*stage.scaleY+(stage.canvas.height/2);
}
