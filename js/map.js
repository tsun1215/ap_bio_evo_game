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
		for(var j = 0; j<this.cols; j++)
		{
			var si = i/this.rows * 3.5;
			var sj = j/this.cols * 3.5;
			//console.log(si);
			var temp = PerlinNoise.noise( si, sj, this.seeds[0]);
			var water = PerlinNoise.noise( si, sj, this.seeds[1]);
			var nut = PerlinNoise.noise( si, sj, this.seeds[2]);
			this.tiles[i][j] = new Tile({temperature:temp, water: water, nutrients:nut});
		}
	}
}

Map.prototype.display = function()
{
	var disp = "";
	for(var i = 0; i<this.rows; i++)
	{
		for(var j = 0; j<this.cols; j++)
		{
			disp += "a ";
		}
		disp += "\n";
	}
	console.log(disp);
	return disp;
};

function Tile(attributes,value)
{
	this.attributes = attributes;
	this.value = value;
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}


