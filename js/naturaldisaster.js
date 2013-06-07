// disasters:
// 0 -- kills all
// 1 -- heat based
// 	0 -- ice age (kills dom trait)
// 	1 -- warming (kills rec trait)
// 2 -- water based
// 	0 -- drought (kills dom trait)
// 	1 -- flood ( kills rec trait)

var naturalDisasters = [[0],[.01, .02], [.03, .04]];
var currentDisaster;
var disastX;
var disastY;
var disastSeverity;

Map.prototype.natDisaster = function(){
	var index = Math.random();
	for (var x = 0; x < naturalDisasters.length; x++){
		for (var y = 0; y < naturalDisasters[x].length; y++){
			if(index < naturalDisasters[x][y]){
				currentDisaster = x * 10 + y;
				disastX = Math.abs(Math.random()*(Map.cols - chunkWidth));
				disastY = Math.abs(Math.random()*(Map.rows - chunkLength)); 
				return;
			}
		}
	}
}

Map.prototype.disasterRun = function(){
	var factorAffected = Math.floor(currentDisaster/10);
	if(currentDisaster % 2 == 0) {
		disastSeverity = .5;
	} else {
		disastSeverity = 1.5;
	}
	this.mutilate(disastSeverity, factorAffected, 1500);
	currentDisaster = null;
}