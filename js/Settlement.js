var arbKFactor = 1000;
var arbRValue = .5;
var interval = 25;
var resist;
var evoFactor = 10;
var speciesList = [0];


Settlement.prototype = new createjs.Shape();
Settlement.prototype.constructor = Settlement;

// 0 = % heat pref
// 1 = % water needy
// 2 = % nutrient dependent
var TraitsList = function(nutrient, water, heat){
    this.list = new Array();
    this.list[0] = nutrient;
    this.list[1] = water;
    this.list[2] = heat;
}

function Settlement(pop, xCoord, yCoord, amap) {
    createjs.Shape.call(this, null);
    this.population = pop;
    this.previousPop = pop;
    this.movingPop = pop;
    this.x = xCoord;
    this.y = yCoord;
    this.traits = new TraitsList(.1, .25, .85);
    this.destinationX;
    this.destinationY;
    this.addEventListener("click", mouseHandler);
    this.addEventListener("dblclick", settMoveHandler);
    this.color = rgbToHex(Math.floor(255*this.traits.list[0]),Math.floor(255*this.traits.list[1]),Math.floor(255*this.traits.list[2]));
    this.graphics.beginStroke("black").beginFill(this.color).drawCircle(0,0,8);
    stage.addChild(this);
    sList.push(this);
    this.map = amap;
    this.speciesNumber = speciesList[speciesList.length - 1];
}

Settlement.prototype.speciate = function(){
    this.speciesNumber = speciesList.length;
    speciesList.push(this.speciesNumber);
}

Settlement.prototype.death = function() {
    this.population = 0;
    shown_death = true;
    if(tutIndex > 5 && tutIndex<15){
        if(shown_death){
            showDialog("A population has died! You are bad <br/> \
                and you should feel bad!", false);
        }else{            
            showDialog("Success is not universal as the environment is not kind. <br/> \
                Individuals and populations, too, are unfortunately maligned. <br/> \
                Survival is difficult as many fall victim to the wrath of Mother Earth, <br/> \
                Genetic variation due to a dearth.", false);
            continue_tut = false; 
        }
    }
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
        var loc = stage.localToGlobal(xCoord, yCoord);
        settle.checkMerge(loc.x, loc.y);
    }
}

Settlement.prototype.setAttributes = function(traitlist){
    this.traits = new TraitsList(traitlist.list[0],traitlist.list[1],traitlist.list[2])
}

Settlement.prototype.resetColor = function(){
	console.log(this.traits.list[0]);
    var colorChange = rgbToHex(Math.floor(255*Math.pow(this.traits.list[0],2)),Math.floor(255*Math.pow(this.traits.list[1],2)),Math.floor(Math.pow(255*this.traits.list[2],2)));
    this.color = colorChange;
	var size = (Math.log(Math.abs(this.population)/200 + 2))*8;
    this.graphics.clear().beginStroke("black").beginFill(colorChange).drawCircle(0,0,size);
}

Settlement.prototype.survival = function(){
    var ovRate = 1;
    // var k = arbKFactor;
    var k = this.map.getTileAt(this.x, this.y).attributes[0]*1000;
    for (var i = 1; i < this.traits.list.length; i++){
        ovRate = this.surviveFactor(i) * ovRate;
    }
    k = k * ovRate;
    console.log("Carrying Capcity: "+k);
    this.previousPop = this.population;
    this.population = this.population + Math.floor(arbRValue * (this.population * (1 - (this.population/k))));
    //Math.floor(this.population*ovRate);
    if(this.movingPop > this.population || this.movingPop == this.previousPop) {
        this.movingPop = this.population;
        updatePopAdjuster();
    }
    if(this.population<0){
        this.death();
    }
}

Settlement.prototype.surviveFactor = function(factor){
    
    var fact =  this.map.getTileAt(this.x,this.y).attributes[factor] * 100;
    // var calcInt = fact * 2;
    // console.log(fact);
    var domGrowthRate;
    var recGrowthRate;
    var calcDiff = (fact/50);
    var pref = this.traits.list[factor];
    console.log(pref);
    var Diff = Math.abs(pref*100 - fact);
    //console.log(calcDiff);
    // if (fact > 50){
    var traitCheck = this.traits.list[factor] - .5;
    domGrowthRate = this.traits.list[factor] * calcDiff;
    recGrowthRate = (1-this.traits.list[factor]) * (1.9-calcDiff); 
    // }
    // if (Diff <= 10){
    //     totalGrowth = 2 - (Diff/10);
    // } else {
    //     totalGrowth = 10/Diff;
    // }
    // if (fact < 50){
    //  domGrowthRate = this.traits.list[factor] * (-calcDiff);
    //  recGrowthRate = (1-this.traits.list[factor]) * calcDiff; 
    // }
    this.traits.list[factor] = domGrowthRate/(domGrowthRate + recGrowthRate);
    if ((this.traits.list[factor] - .5)/traitCheck < 0){
        this.speciate();
    }
    // this.traits.list[factor] = pref + totalGrowth*(fact/100 - pref)/evoFactor;
    var totalGrowth = domGrowthRate + recGrowthRate;
    // console.log(totalGrowth);
    return totalGrowth;
    // this.population = Math.floor(this.population*totalGrowth);
    
}

// Settlement.prototype.adapt = function(){
//     for (var x = 1; x < this.traits.list.length; x++){    
//         var traitCheck = this.traits.list[x] - .5;
//         this.traits.list[x] = this.traits.list[x] + ((this.map.getTileAt(this.x, this.y).attributes[x]) - this.traits.list[x])/evoFactor;
//         if ((this.traits.list[x] - .5)/traitCheck < 0){
//         this.speciate();
//         }
//     }
// }

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
        if (this.mergeSett.speciesNumber == this.speciesNumber){
            if(Math.abs(this.x - this.mergeSett.x) < 8 && Math.abs(this.y - this.mergeSett.y) < 8) {
                this.traits.list[0] = ((this.traits.list[0] * this.population) + (this.mergeSett.traits.list[0] * this.mergeSett.population))/(this.population + this.mergeSett.population);
                this.population += this.mergeSett.population;
            
                stage.removeChild(this.mergeSett);
                stage.removeChild(this.mergeSett.popTag);
                this.mergeSett.population = 0;
            }
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
