class hx_Board {
    constructor(MaxWidth,MaxLength,Offset){

        this.Tiles = {}
        this.neighborhoods = []
        this.MaxLength = MaxLength;
        this.MaxWidth = MaxWidth;
        this.Offset = Offset;
    }

    generate(data){
        if(data != false){

            for(var tile in data.cells){
                var hxTile = new hx_Tile();
                var Tile = hxTile.tile;
                Tile.pos = data.cells[tile].pos
                Tile.selected = false;
                console.log(data.cells[tile]);
                hxTile.gamedata = {
                    'edgeCost': data.cells[tile].travel_cost,
                    'neighborhood': data.cells[tile].nh,
                    'stayCost': data.cells[tile].stay_cost,
                    'for_sale': data.cells[tile].for_sale,
                    'price':data.cells[tile].price,
                    'residual_income': data.cells[tile].residual_income,
                    'value': data.cells[tile].value,
                    'owner': data.cells[tile].owner,
                    'color': data.cells[tile].color,                 
                }
                hxTile.gamedata['children'] = {
                    'buildings': data.cells[tile].buildings,
                    'players': []
                }
                this.add(hxTile)
                var offset = 0;
                if(Tile.pos.y % 2 != 0){
                    offset = .9
                }
                Tile.position.set((Tile.pos.x*1.75+offset),0,Tile.pos.y*1.5)
                hx_scene.add(Tile)
            }

            return;
        }


        for(var i = this.Offset[0]; i < this.MaxLength+this.Offset[0]; i++){
            for(var j = this.Offset[1]; j < this.MaxWidth+this.Offset[1]; j++){
                var hxTile = new hx_Tile();
                var Tile = hxTile.tile;
                Tile.pos = {
                    x: j,
                    y: i,
                    h: 0.5
                }
                Tile.selected = false;
                Tile.gamedata = {}
                this.add(hxTile)
                var offset = 0;
                if(Tile.pos.y % 2 != 0){
                    offset = .9
                }
                Tile.position.set((Tile.pos.x*1.75+offset),0,Tile.pos.y*1.5)
                hx_scene.add(Tile)
            }
        }
    }

    generateNeighborhoods(count, boardSize){
        var queue = new hx_SLL();
        var visited = {};

        this.calculateNeighborhoodSize(count,boardSize)
        this.sectionNeighborhoods(queue,Math.sqrt(boardSize))
        console.log(this.neighborhoods);
    }

    calculateNeighborhoodSize(count,boardSize){
        var board_size = boardSize;
        var max = Math.floor(boardSize/count);
        var n = 0;
        var colors = ['red','green','blue','purple','black','gray','yellow','orange','pink','teal','white','brown'] //['0xE74C3C','0x27AE60','0x3498DB','0x9B59B6','0x17202A','0x7E5109','0x626567','0xF1C40F','0xE67E22','0xF5B7B1','0x76D7C4','0xFBFCFC']
        var colors_picked = []
        while (board_size > 0){
            if(this.neighborhoods.length < count-1){
                for(var i=0;i<count;i++){
                    var randomnumber = Math.floor(Math.random() * (max - 1 + 1)) + 1;
                    var color = Math.floor(Math.random() * (colors.length-1 - 0 + 1)) + 0;
                    while(colors_picked.includes(color))
                        color = Math.floor(Math.random() * (colors.length-1 - 0 + 1)) + 0;

                    colors_picked.push(color);

                    this.neighborhoods[i] = {
                        'size': randomnumber+2,
                        'color': colors[color],
                        'tiles': []
                    }
                    board_size -= this.neighborhoods[i].size;
                }
            }else{
                for(var i=0;i<count-1;i++){
                    var break_ = false;
                    var randomnumber = Math.floor(Math.random() * (max/2 - 1 + 1)) + 1;
                    
                    if(randomnumber > board_size){
                        randomnumber = board_size;
                        break_ = true;
                    }
                    
                    this.neighborhoods[i].size += randomnumber;
                    board_size -= randomnumber;
                    
                    if(break_)
                        break;
                }            
                   
            }
        }
        var total = 0;
        for(var i=0;i<this.neighborhoods.length;i++){
            total += this.neighborhoods[i].size;
        }
        console.log(total);
    }

    sectionNeighborhoods(queue, sideLength){
        var current = {x:0,y:0,h:0.5};
        var assigned = {};

        for(var nh=0; nh < this.neighborhoods.length;nh++){
            var visited = {};
            var size = this.neighborhoods[nh].size;
            queue.clear();
            while(size > 0){
                var neighbors = hx_grid.findNeighbor(current,false,"object");
                for(var n in neighbors){
                    if(!(neighbors[n]._id in visited) && !(neighbors[n]._id in assigned) ){
                        queue.enqueue(neighbors[n].hx_cell.Cell.pos)
                        visited[neighbors[n]._id] = ""
                    }else{}
                }
                var key = String(current.x) + "," + String(current.y)
                if(!this.neighborhoods[nh].tiles.includes(hx_grid.grid[key]))
                    this.neighborhoods[nh].tiles.push(hx_grid.grid[key])
                hx_grid.grid[key].hx_tile.gamedata.neighborhood = nh;
                assigned[hx_grid.grid[key]._id] = ""
                this.Tiles[key].Tile.material.color.set(this.neighborhoods[nh].color)
                this.Tiles[key].gamedata.color = this.neighborhoods[nh].color
                size -= 1;
                current = queue.dequeue().item;
            }
            var done = false;
            for(var i=0;i<sideLength-1;i++){
                for(var j=0;j<sideLength-1;j++){
                    var pos = {x:j,y:i,h:0.5};
                    key = String(pos.x) + "," + String(pos.y)
                    if(!(hx_grid.grid[key]._id in assigned)){
                        current = pos;
                        done = true;
                    }
                    if(done)
                        break;
                }
                if(done)
                    break;
            }
            //console.log(current);
        }
    }
    
    add(hxTile){
        var key, pos;
        pos = hxTile.Tile.pos;
        key = String(pos.x) + "," + String(pos.y)
        this.Tiles[key] = hxTile;
        hx_grid.updateCellObject(key,hxTile);
    }

    removeTile(tile){
        pos = tile.pos;
        key = String(pos.x) + "," + String(pos.y)
        this.Tiles[key] = null;
    }

    get board(){
        return this.Tiles;
    }

    get boardSize(){
        return this.MaxLength * this.MaxWidth;
    }
}