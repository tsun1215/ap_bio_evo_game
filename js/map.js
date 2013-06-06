function Map(rows, cols, tile_width, seeds)
{
	this.tiles = new Array();
	this.rows = rows;
	this.cols = cols;
	this.tile_width = tile_width;
	this.seeds = seeds;

}

Map.prototype.generatePerlin = Map.prototype.generate = function()
{
	for(var i = 0; i<this.rows; i++)
	{
		this.tiles[i] = new Array(this.cols);
	}
	generateNext(this,0,0);
	
	function generateNext(map,x,y)
	{
		for(var i = 0; i < 10; i++)
		{
			for(var j = 0; j < 10; j++)
			{
				map.generateAt(i+x,j+y);
				progress.attributes.value.value++;
			}
		}
		// console.log('loaded '+(x+i-1)+','+(y+j-1));
		if(10+x<=map.rows-1)
		{
			setTimeout(function(){generateNext(map,x+10,y)},0);
		}
		else if(y+10<=map.cols-1)
		{
			setTimeout(function(){generateNext(map,0,10+y)},0);
		}
	}

}

Map.prototype.getTileAt = function(x,y){
	if (this.tiles[Math.floor(x/this.tile_width)][Math.floor(y/this.tile_width)]){
		return this.tiles[Math.floor(x/this.tile_width)][Math.floor(y/this.tile_width)];
	}else{
		console.log("Settlement not on map");
		return null;
	}
}

Map.prototype.generateAt = function(i,j)
{
	var si = i/this.rows * 3.5;
	var sj = j/this.cols * 3.5;
	var temp = PerlinNoise.noise( si, sj, this.seeds[0]);
	var water = PerlinNoise.noise( si, sj, this.seeds[1]);
	var nut = PerlinNoise.noise( si, sj, this.seeds[2]);
	var passingIn = new Array(temp, water, nut);
	this.tiles[i][j] = new Tile(passingIn);
}

function Tile(attrib)
{
	this.attributes = attrib;
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}


