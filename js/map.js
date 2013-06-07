function mapArrReady()
{
    return this.ready;
}

function initMap()
{
    timer = + new Date();
    // mapArr = new Map(50,50,10, [Math.random()*10000,Math.random()*10000,Math.random()*10000]);
    // Edit the array in the next line to change map.
    // Those are seeds to generate the random maps
    
    // Initializes loading bar
    progress = document.createElement("progress");
    progress.setAttribute("style","position:absolute");
    progress.setAttribute("max","100");
    progress.setAttribute("value","0");
    document.body.appendChild(progress);
    mapArr = new Map(300,200,5, [1,2,3]);
    progress.attributes.max.value=(mapArr.rows*mapArr.cols)*2;
    mapArr.generate();

    var generator = setInterval(function(){
        if(mapArrReady())
        {
            drawMap();
            clearInterval(generator);
        }
        else
            return 0;
    },0);
}

function drawMap(){
    map = new createjs.Container();
    stage.addChild(map);
    map.cache(0,0,mapArr.rows*mapArr.tile_width,mapArr.cols*mapArr.tile_width);     

    // Draws map in sections
    drawNextTiles(0,0);
    function drawNextTiles(x,y)
    {
        for(var i = 0; i < 10; i++)
        {
            for(var j = 0; j < 10; j++)
            {
                drawTile(i+x,j+y);
                progress.attributes.value.value++;
            }
        }
        if(10+x<=mapArr.rows-1)
        {
            setTimeout(function(){drawNextTiles(x+10,y)},0);
        }
        else if(y+10<=mapArr.cols-1)
        {
            setTimeout(function(){drawNextTiles(0,10+y)},0);
        }else{
            startGame();            
        }
    }

    // Initializes minimap
    // var minimap = map.clone();
    // minimap.scaleX = .7;
    // minimap.scaleY = .7;
    // contentcontainer.children[0].addChild(minimap);  
}


function drawTile(i,j){
    var temp = Math.floor(mapArr.tiles[i][j].attributes[0] * 255);
    var water = Math.floor(mapArr.tiles[i][j].attributes[1] * 255);
    var nut = Math.floor(mapArr.tiles[i][j].attributes[2] * 255);
    var color;
    if(water > 150)
    {
        var newwater = 255-water;
        newwater += 1.24;
        newwater *= 1.6;
        newwater = Math.floor(newwater);
        color = rgbToHex(0,0,newwater);
    }
    else if(water > 140)
    {
        color = rgbToHex(255,255,nut);
    }
    else if(water > 70)
    {
        color = rgbToHex(10,nut,10);
    }
    else
    {
        color = rgbToHex(255,255,nut);
    }
    if ( water > 100 && water < 120 && temp < 100)
    {
        var newwater = Math.floor(2 * (255-water));
        newwater = (newwater >255 ? 255: newwater);
        color = rgbToHex(newwater,newwater,newwater);
    }
    var pixel = new createjs.Shape();
    pixel.graphics.beginFill(color).drawRect(0,0,mapArr.tile_width,mapArr.tile_width);
    pixel.x = i*mapArr.tile_width;
    pixel.y = j*mapArr.tile_width;
	mapArr.tiles[i][j].pixel = pixel;
    map.addChild(pixel);
}

function Map(rows, cols, tile_width, seeds)
{
	this.tiles = new Array();
	this.rows = rows;
	this.cols = cols;
	this.tile_width = tile_width;
	this.seeds = seeds;
	this.ready = false;
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
		else
		{
			this.ready = true;
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
	var passingIn = new Array();
	for(var k = 0; k < this.seeds.length; k++)
	{
		passingIn.push(PerlinNoise.noise( si, sj, this.seeds[0]));
	}
	this.tiles[i][j] = new Tile(passingIn);
}

function Tile(attrib)
{
	this.attributes = attrib;
	this.pixel = null;
}

Map.prototype.chunkChange = function(x,y,change,index)
{
	for(var i = 0; i<chunkWidth; i++)
		for(var j = 0; j < chunkHeight; j++)
			this.tiles[x+i][y+j].update(change,index);
		
	
}

Map.prototype.mutilate = function(change,index,speed)
{
	changeNext(this,0,0);
	function changeNext(map,x,y)
	{
		map.chunkChange(x,y,change,index);
		if(chunkWidth+x<=map.rows-1)
		{
			setTimeout(function(){changeNext(map,x+chunkWidth,y)},speed);
		}
		else if(y+chunkHeight<=map.cols-1)
		{
			setTimeout(function(){changeNext(map,0,chunkHeight+y)},speed);
		}
	}
}

Tile.prototype.update = function(change,index)
{
	this.attributes[index] *= change;
	var temp = Math.floor(this.attributes[0] * 255);
    var water = Math.floor(this.attributes[1] * 255);
    var nut = Math.floor(this.attributes[2] * 255);
    var color;
    if(water > 150)
    {
        var newwater = 255-water;
        newwater += 1.24;
        newwater *= 1.6;
        newwater = Math.floor(newwater);
        color = rgbToHex(0,0,newwater);
    }
    else if(water > 140)
    {
        color = rgbToHex(255,255,nut);
    }
    else if(water > 70)
    {
        color = rgbToHex(10,nut,10);
    }
    else
    {
        color = rgbToHex(255,255,nut);
    }
    if ( water > 100 && water < 120 && temp < 100)
    {
        var newwater = Math.floor(2 * (255-water));
        newwater = (newwater >255 ? 255: newwater);
        color = rgbToHex(newwater,newwater,newwater);
    }
    this.pixel.graphics.clear().beginFill(color).drawRect(0,0,mapArr.tile_width,mapArr.tile_width);
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}




