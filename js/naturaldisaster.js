// disasters:
// 0 -- kills all
// 1 -- heat based
// 	0 -- ice age (kills dom trait)
// 	1 -- warming (kills rec trait)
// 2 -- water based
// 	0 -- drought (kills dom trait)
// 	1 -- flood ( kills rec trait)

var naturalDisasters = [[.01, .02],[.03, .04], [0]];
var currentDisaster;
var disastSeverity;
var disaster_rate = 0;

Map.prototype.natDisaster = function(){
	if(disaster_rate > Math.random()){
		var index = Math.random();
		for (var x = 0; x < naturalDisasters.length; x++){
			for (var y = 0; y < naturalDisasters[x].length; y++){
				if(index < naturalDisasters[x][y]){
					currentDisaster = x * 10 + y;
					this.disasterRun();
					return;
				}
			}
		}
	}
}

Map.prototype.disasterRun = function(){
	var factorAffected = Math.floor(currentDisaster/10);
	if(currentDisaster % 2 == 0) {
		disastSeverity = .9;
	} else {
		disastSeverity = 1.2;
	}
	this.mutilate(disastSeverity, factorAffected, 0);
	currentDisaster = null;
}