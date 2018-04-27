class hx_Grid {
    constructor(MaxWidth,MaxLength,HeightMap){

        this.cells = {}
        this.MaxLength = MaxLength;
        this.MaxWidth = MaxWidth;
        this.HeightMap = HeightMap;
    }

    generate(){
        for(var i = 0; i < this.MaxLength; i++){
            for(var j =0; j < this.MaxWidth; j++){
                var hxCell = new hx_Cell().cell;
                var Cell = hxCell.Cell;
                Cell.pos = {
                    x: j,
                    y: i,
                    h: 0.5
                }
                Cell.selected = false;
                Cell.cell = true;
                this.add(hxCell)
                var offset = 0;
                if(Cell.pos.y % 2 != 0){
                    offset = .9
                }

                Cell.position.set((Cell.pos.x*1.75) + offset,0,Cell.pos.y*1.5)
                
                hx_scene.add(Cell)
            }
        }
        this.findNeighbors();
    }

    cleanup(){
        for(var i = 0; i < this.MaxLength; i++){
            for(var j =0; j < this.MaxWidth; j++){
                var key = String(i) + "," + String(j)
                this.cells[key].hx_cell.Cell.oldChildren = this.cells[key].hx_cell.Cell.children;
                this.cells[key].hx_cell.rmWireframe();
            }
        }
    }

    add(cell){
        var key, pos;
        pos = cell.Cell.pos;
        key = String(pos.x) + "," + String(pos.y)
        this.cells[key] = {
            hx_cell: cell,
            hx_tile: null,
            _id: this.guid(),
            outline: cell.Cell.children
           
        };
    }

    strip(){
        var stripped_grid = {};
        for(var cell in this.cells){
            var c = this.cells[cell]
            var pos, gamedata,id, info, key;
            pos = c.hx_cell.Cell.pos;
            key = String(pos.x) + "," + String(pos.y)
            gamedata = c.hx_tile.gamedata;
            var nh = function(){
                var neighbors_S = "";
                for(var n in c.hx_cell.neighbors){
                    var p = c.hx_cell.neighbors[n].hx_cell.Cell.pos
                    var k = String(p.x) + "," + String(p.y) + "_"
                    neighbors_S += k;
                }
                return neighbors_S;
            }
            info = {
                'pos':pos,
                'neighbors': nh,
                'game-data':gamedata,
                'id':id
            }
            stripped_grid[key] = info;
        }
        return stripped_grid;
    }

    spawns(){
        var spawns = "";
        for(var i=0;i<4;i++){
            var s = String(Math.floor(Math.random() * (this.MaxWidth-1 - 0 + 1)) + 0) + "," + String(Math.floor(Math.random() * (this.MaxLength-1 - 0 + 1)) + 0);
            spawns += s+"_"
        }
        return spawns;
    }

    get grid(){
        return this.cells;
    }

    guid() {
        function s4() {
          return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
        return 'UID-' + s4()+s4();
      }

    removeTile(cell){
        this.cells[cell.pos].tile = null;
    }

    updateCellObject(key,hxTile){
        this.cells[key].hx_tile = hxTile
    }

    findNeighbors(){
        for(var c in this.cells){
            var pos = this.cells[c].hx_cell.Cell.pos;
            if (pos.y % 2 == 0){ //neighbor list for evens
                var neighbors = [
                    [pos.x-1,pos.y],[pos.x,pos.y-1],[pos.x-1,pos.y-1],
                    [pos.x+1,pos.y],[pos.x-1,pos.y+1],[pos.x,pos.y+1]
                ];
            }else{ //neighbor list for odds
                var neighbors = [
                    [pos.x-1,pos.y],[pos.x,pos.y-1],[pos.x+1,pos.y-1],
                    [pos.x+1,pos.y],[pos.x+1,pos.y+1],[pos.x,pos.y+1]
                ];
            }
            this.cells[c].hx_cell.neighbors = this.validateNeighbors(neighbors, false);
        }   
        
    }

    findNeighbor(pos, mark, returnType){
        var key = String(pos.x) + "," + String(pos.y)
        var cellObject = this.cells[key];
        var cell = cellObject.hx_cell.Cell;

        if (pos.y % 2 == 0){ //neighbor list for evens
            var neighbors = [
                [pos.x-1,pos.y],[pos.x,pos.y-1],[pos.x-1,pos.y-1],
                [pos.x+1,pos.y],[pos.x-1,pos.y+1],[pos.x,pos.y+1]
            ];
        }else{ //neighbor list for odds
            var neighbors = [
                [pos.x-1,pos.y],[pos.x,pos.y-1],[pos.x+1,pos.y-1],
                [pos.x+1,pos.y],[pos.x+1,pos.y+1],[pos.x,pos.y+1]
            ];
        }
        //console.log(this.validateNeighbors(neighbors));
        if (returnType == "object")
            return this.validateNeighbors(neighbors, mark);
        else if (returnType == "array")
            return neighbors;
    }

    validateNeighbors(arr, clicked){
        var newArr = []
        for(var i=0;i<arr.length;i++){
            var key = String(arr[i][0]+","+arr[i][1]);
            if (!(key in this.cells)){
                continue;
            }
            newArr[newArr.length] = this.cells[key]
            if (clicked){
                newArr[newArr.length-1].hx_tile.Tile.material.opacity = 0
                newArr[newArr.length-1].hx_tile.Tile.material.transparent = true;
                newArr[newArr.length-1].hx_tile.Tile.material.color.set( 0xFFFFFF );
            }
        }
        
        return newArr;
    }

    calculatePath(A,B, greedyWeight, dijkstrasWeight){
        //console.log(A)
        var key = String(A[0]) + "," + String(A[1])
        var keyB = String(B[0]) + "," + String(B[1])
        var PQ = new PriorityQueue();
        PQ.push(A,0);
        var came_from = {}
        var cost_so_far = {};
        came_from[key] = null;
        cost_so_far[key] = 0;
        if(key == keyB){return;}
        while(PQ.empty() == false){
            var runner = PQ.pop();

            if(runner.item == B)
                break;
            
            //var _key = String(runner.item[0]) + "," + String(runner.item[1])   
            //console.log(this.grid[_key].hx_tile.gamedata['edgeCost']);
            var neighbors = this.findNeighbor({'x':runner.item[0], 'y':runner.item[1]}, false, 'object')

            for(var n in neighbors){
                var n_key = String(neighbors[n].hx_cell.Cell.pos.x) + "," + String(neighbors[n].hx_cell.Cell.pos.y) 
                var new_cost = cost_so_far[key]  + this.nodeCost(key, n_key) 
                if (cost_so_far.hasOwnProperty(n_key) == false || new_cost < cost_so_far[n_key]){
                    cost_so_far[n_key] = new_cost;
                    var pos = [neighbors[n].hx_cell.Cell.pos.x, neighbors[n].hx_cell.Cell.pos.y]
                    var h = this.heuristic( this.calculateDistance(pos, B), greedyWeight, dijkstrasWeight, this.nodeCost(key, n_key));
                    var priority = new_cost + h;  //f(n) = g(n) + h(n)
                    PQ.push(pos,priority);
                    came_from[n_key] = runner.item;
                }
            }
        }
        var path = this.reconstruct_path(came_from,A,B);
        console.log(cost_so_far[keyB]);
        return path;
    }

    reconstruct_path(came_from, A, B){
        var current = B
        var path = []
        var count = 0;
        console.log("roll", hx_scene.get_roll)
        while (current != A){
            path.push(current)
            current = came_from[current]
        }
        path.push(A)
        path.reverse()
        
        return path.slice(0,hx_scene.get_roll+1);
    }

    nodeCost(A,B){
        //console.log(A,B);
        return (this.cells[A].hx_tile.gamedata.edgeCost + this.cells[B].hx_tile.gamedata.edgeCost)/100;
    }

    heuristic(h,w1,w2,cost){
        h += h * w1;
        var c = cost * w2;
        return h + c;
    }

    calculateDistance(A,B){

        var posA = this.offset_to_cube(A);
        var posB = this.offset_to_cube(B);
        //console.log(posA)
        return this.findDistance(posA, posB)
    }

    cube_to_evenr(cords){
        var col = cube.x + (cube.z + (cube.z%2)) / 2
        var row = cube.z

        return [col, row]
    }

    offset_to_cube(cords){
        var x = cords[0] - (cords[1] + 1) / 2
        var z = cords[1]
        var y = -x-z
        return {
            'x':x,
            'y':y,
            'z':z
        }
    }

    findDistance(posA, posB){
        return (Math.abs(posA.x - posB.x) + Math.abs(posA.y - posB.y) + Math.abs(posA.z - posB.z)) / 2
    }

    heurustic(){
        return 1;
    }
}