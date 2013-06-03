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
	
	function generateNext(map,i,j)
	{
		if(i<map.rows)
		{
			map.generateAt(i,j);
			setTimeout(function(){generateNext(map,i+1,j)},1);
		}
		else if(j<map.cols-1)
		{
			setTimeout(function(){generateNext(map,0,j+1)},1);
		}
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


