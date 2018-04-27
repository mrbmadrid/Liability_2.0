class hx_Scene {
    
    constructor(){

        this._scene = new THREE.Scene();
        this._camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
        this._renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this._renderer.setSize( window.innerWidth*.75, window.innerHeight*.75 );
        this.controls = new THREE.OrbitControls( this._camera );
        this.controls.minDistance = 5;
        this.controls.maxDistance = 17;
        this.controls.update();
        this.raycaster = new THREE.Raycaster();
        this.mouse_ = new THREE.Vector2();
        this.mouse_.x = 0
        this.mouse_.y = 0
        this.StartMarker = true;
        this.AStar = true;
        this.points = {
            'A': null,
            'B': null
        }
        this._roll = 0;
        this.AStar_cooldown = false;
        this._loader = new THREE.JSONLoader();
        this.path_hover = null;
        this.path_colors = null;
        var green = new THREE.Color( 0x40C843 );



        document.getElementById('gameView').appendChild( this._renderer.domElement );

        window.addEventListener( 'resize', this.onWindowResize, false );
        window.addEventListener( 'mousemove', this.onMouseMove, false );
        window.addEventListener( 'mousedown', this.onMouseLeftClick, false );
    }

    get renderer(){
        return this._renderer;
    }
    loader(){
        return this._loader;
    }
    get camera(){
        return this._camera
    }

    get scene(){
        return this._scene
    }

    add(obj){
        this._scene.add(obj);
    }
    remove(obj){
        this._scene.remove(obj);
    }
    controlsUpdate(){

        this.controls.update();
        // update the picking ray with the camera and mouse position
        this.raycaster.setFromCamera( this.mouse_, this._camera );


    }
    test(){
        console.log('test')
    }

    roll(val){
        this._roll = val;
    }

    get get_roll(){
        return this._roll;
    }

    get_path(){
        return this.path_hover;
    }


    onWindowResize(){

        this.hx_scene.camera.aspect = window.innerWidth / window.innerHeight;
        this.hx_scene._camera.updateProjectionMatrix();
    
        this.hx_scene._renderer.setSize( window.innerWidth*.75, window.innerHeight*.75 );
    
    }

    onMouseMove( event ) {
        // calculate mouse position in normalized device coordinates
        // (-1 to +1) for both components
        
        var rect = this.hx_scene.renderer.domElement.getBoundingClientRect();
        this.hx_scene.mouse_.x = ( ( event.clientX - rect.left ) / ( rect.width - rect.left ) ) * 2 - 1;
        this.hx_scene.mouse_.y = - ( ( event.clientY - rect.top ) / ( rect.bottom - rect.top) ) * 2 + 1;

        var intersects = this.hx_scene.raycaster.intersectObjects( this.hx_scene._scene.children );
        if (intersects.length < 1)
            return;

        
        var x = intersects[ intersects.length-1 ].object.pos.x;
        var y = intersects[ intersects.length-1 ].object.pos.y;
        this.hx_scene.points['B'] = [x,y];
        var key = String(x + "," + y)
       // console.log(hx_grid.grid[key])
        if(this.hx_scene.points['A'] == null || this.hx_scene.points['B'] == null || this.AStar_cooldown == true || $('#confirm_move').css('display') == 'block' )
            return;

        this.AStar_cooldown = true;

        setInterval(function()
        { 
            this.AStar_cooldown = false;
        }, 1500);


        

        if(hx_scene.path_hover != null){
            for(var cords in hx_scene.path_hover){
                var key = String(hx_scene.path_hover[cords][0]) + "," + String(hx_scene.path_hover[cords][1])
                hx_grid.grid[key].hx_tile.Tile.material.color.set( hx_scene.path_colors[key] )
            }            
        }

        var path = hx_grid.calculatePath(this.hx_scene.points['A'], this.hx_scene.points['B'],10, 1);
        var path_colors = {};
        
        for(var cords in path){
            if(cords == 0){continue;}
            var key = String(path[cords][0]) + "," + String(path[cords][1])
            path_colors[key] = hx_grid.grid[key].hx_tile.gamedata.color
            hx_grid.grid[key].hx_tile.Tile.material.color.set( 0x1DF800 )
        }
        hx_scene.path_hover = path;
        hx_scene.path_colors = path_colors;
        
    }

    
    onMouseLeftClick( event ) {
        // calculate objects intersecting the picking ray
        $('#info_tile').hide(); 
        var intersects = this.hx_scene.raycaster.intersectObjects( this.hx_scene._scene.children );
            
            if (intersects.length < 1){
                return;
            }

            if(this.hx_scene.points['A'] != null){
                $('#confirm_move').toggle();
                $('#confirm_move').css({
                    top: event.pageY-$('#confirm_move').height() + "px",
                    left:  event.pageX + "px",
                });
                return;
            }

            $('#info_tile').css({
                top: event.pageY-$('#info_tile').height() + "px",
                left:  event.pageX + "px",
            });

            intersects[ intersects.length-1 ].object.selected = !intersects[ intersects.length-1 ].object.selected;
            var x = intersects[ intersects.length-1 ].object.pos.x;
            var y = intersects[ intersects.length-1 ].object.pos.y;
            
            var key = String(x + "," + y)
            console.log(hx_board.board[key])
            console.log([x,y],hx_grid.calculateDistance([x,y], [5,1]))
            $('#info_tile').show();
            $('#info_nh').text(hx_board.board[key].gamedata.neighborhood);
            $('#info_value').text('$' + hx_board.board[key].gamedata.value.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'));
            $('#info_income').text('$' + hx_board.board[key].gamedata.residual_income.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'));
            $('#info_price').text('$' + hx_board.board[key].gamedata.price.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'));
            $('#info_rent').text('$' + hx_board.board[key].gamedata.stayCost.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'));
            $('#info_toll').text('$' + hx_board.board[key].gamedata.edgeCost.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'));
            $('#info_owner').text(hx_board.board[key].gamedata.owner);

    }

    cellNeighbor(pos, mark){
        console.log(hx_grid.findNeighbor(pos, mark, "object"));
    }


}