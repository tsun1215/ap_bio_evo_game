function death(percent) {
	this.population = this.population*(100-percent);
}

function massDeath() {
	var i = sList.indexOf(this);
	sList.splice(i, 1);
}

function split() {
	var movingPop;
	var child = createSettlement(50, this.x, this.y);
	this.population -= 50;
}

function growth() {
	this.population++;
}

function selectAid() {
	var shadow
	stage.addChild()
}