function Map(rows, cols, tile_width)
{
	this.tiles = new Array();
	this.rows = rows;
	this.cols = cols;
	this.tile_width = tile_width;
}

Map.prototype.generate = function()
{
	for(var i = 0; i<this.rows; i++)
	{
		this.tiles[i] = new Array(this.cols);
		for(var j = 0; j<this.cols; j++)
		{
			this.tiles[i][j] = new Tile([],"black");
		}
	}
};

Map.prototype.generatePerlin = function(v)
{
	var seeds = new Array();
	for (var i = 0; i<3 ; i++)
	{
		seeds.push(Math.random()*v);
	}
	for(var i = 0; i<this.rows; i++)
	{
		this.tiles[i] = new Array(this.cols);
		for(var j = 0; j<this.cols; j++)
		{
			var temp = PerlinNoise.noise( i/20, j/20, seeds[0]);
			var water = PerlinNoise.noise( i/20, j/20, seeds[1]);
			var nut = PerlinNoise.noise( i/20, j/20, seeds[2]);
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


