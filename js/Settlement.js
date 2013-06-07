var arbKFactor = 1000;
var arbRValue = .5;
var interval = 25;
var resist;

Settlement.prototype = new createjs.Shape();
Settlement.prototype.constructor = Settlement;

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
    createjs.Shape.call(this, null);
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
    this.color = rgbToHex(Math.floor(255*this.traits.list[0]),Math.floor(255*this.traits.list[1]),Math.floor(255*this.traits.list[2]));
    this.graphics.beginStroke("black").beginFill(this.color).drawCircle(0,0,8);
    stage.addChild(this);
    sList.push(this);
    this.map = amap;
}

Settlement.prototype.death = function() {
    this.population = 0;
}

Settlement.prototype.moveTo = function(xCoord, yCoord){
    this.destinationX = xCoord;
    this.destinationY = yCoord;
}

Settlement.prototype.splitTo = function(xCoord, yCoord, splitPop){
    if(splitPop != null) {this.movingPop = splitPop;}
    if(this.movingPop > 0 && this.movingPop < this.population) {
        var settle = new Settlement(this.movingPop, this.x, this.y, this.map);
        settle.setAttributes(this.traits);
        settle.resetColor();
        settle.destinationX = xCoord;
        settle.destinationY = yCoord;
        this.population = this.population - this.movingPop;
    }
}

Settlement.prototype.setAttributes = function(traitlist){
    this.traits = new TraitsList(traitlist.list[0],traitlist.list[1],traitlist.list[2])
}

Settlement.prototype.resetColor = function(){
    var colorChange = rgbToHex(Math.floor(255*this.traits.list[0]),Math.floor(255*this.traits.list[1]),Math.floor(255*this.traits.list[2]));
    this.color = colorChange;
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
    if(this.movingPop > this.population || this.movingPop == this.previousPop) {
        this.movingPop = this.population;
        updatePopAdjuster();
    }

    if(Math.random()<.05){
        console.log("Natural disaster");
        this.population-=Math.round(Math.random()*k+200);
    }
    // var calcInt = interval;
    // console.log(this.map.tiles[Math.floor(this.x / 16)][Math.floor(this.y / 16)].attributes);
    // var temp =  this.map.tiles[Math.floor(this.x / 16)][Math.floor(this.y / 16)].attributes[0] * 100;
    // console.log(temp);
    // var domGrowthRate;
    // var recGrowthRate;
    // var calcDiff = ((Math.sqrt(Math.abs(50-temp))) + calcInt - 5)/ calcInt;
    
    // if (temp > 50){
    //  domGrowthRate = this.traits.list[0] * calcDiff;
    //  recGrowthRate = (1-this.traits.list[0]) * (1.9-calcDiff); 
    // }
    // if (temp < 50){
    //  domGrowthRate = this.traits.list[0] * (1.9-calcDiff);
    //  recGrowthRate = (1-this.traits.list[0]) * calcDiff; 
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
    
    var fact =  this.map.getTileAt(this.x,this.y).attributes[factor] * 100;
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
    //  domGrowthRate = this.traits.list[factor] * (-calcDiff);
    //  recGrowthRate = (1-this.traits.list[factor]) * calcDiff; 
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


Settlement.prototype.updatePopTag = function() {
    if(stage.getChildIndex(this.popTag) == -1) {
        this.tagFrame = new createjs.Shape();
        this.popTag = new createjs.Container();
        this.tagFrame.graphics.clear().beginFill("black");
        switch(Math.floor(Math.log(this.population)/Math.LN10+1)){
            case 1: this.tagFrame.graphics.drawRoundRect(-2,1,9,10,4); break;
            case 2: this.tagFrame.graphics.drawRoundRect(-2,1,14,10,4); break;
            case 3: this.tagFrame.graphics.drawRoundRect(-2,1,19,10,4); break;
            case 4: this.tagFrame.graphics.drawRoundRect(-2,1,24,10,4); break;
        }
        this.popTag.addChild(this.tagFrame);
    }else{
        stage.removeChild(this.popTag);
        this.popTag.removeChild(this.tagText);
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
    this.popTag.x = this.x;
    this.popTag.y = this.y;
    this.tagText = new createjs.Text(this.population, "9px Arial", "white");
    this.popTag.addChild(this.tagText);
    stage.addChild(this.popTag);
}

Settlement.prototype.checkMerge = function(xCoord, yCoord) {
    var index = sList.indexOf(this);
    var mergeSett;
    var set_loc = stage.globalToLocal(xCoord, yCoord);
    for(i in sList) {
        if(sList[i] == null){continue;}
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
            
            stage.removeChild(this.mergeSett);
            stage.removeChild(this.mergeSett.popTag);
            this.mergeSett.population = 0;
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

// Settlement movement handlers

function settMoveHandler(event){
    if (event.type == "dblclick" && event.nativeEvent.which === 1){
        if (focus == null){
            focus = event.target;
            focus.movingPop = focus.population;
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