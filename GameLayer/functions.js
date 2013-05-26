function death(percent) {
	var i = sList.indexOf(this);
	sList.splice(i, 1);
}

function split() {
	var child = createSettlement(50, this.x, this.y);
	this.population -= 50;
}