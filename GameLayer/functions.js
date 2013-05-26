var migrateOnce = function(fpsDelta){
	if (destination != null){
		// flipped accounts for problems with arctan's range only being -pi/2 to pi/2
		// either 1 (atan works) or -1 (atan doesn't work)
		var flipped = 1;
		var destX = this.destination.x;
		var destY = this.destination.y;
		var angle = Math.atan((destY-this.y)/(destX-this.x));
		if (destX - this.x < 0){
			flipped = -1;
		}
		var totalMovement = fpsDelta * this.speed;
		this.x += flipped*totalMovement*cos(angle);
		this.y += flipped*totalMovement*sin(angle);
	}
}

var draw = function(){
	this.shape.graphics.beginFill("blue").drawCircle(this.x, this.y, this.population/50);
}
