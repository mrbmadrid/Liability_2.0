
var hx_scene = new hx_Scene();
var hx_grid = new hx_Grid(10,10, [.5,1]);
var hx_board = new hx_Board(10,10, [0,0]);

function RenderHexDemo(){

    
    hx_grid.generate();
    hx_board.generate();
    hx_board.generateNeighborhoods(8, hx_board.boardSize)
    console.log(hx_grid.grid['6,6']);
    hx_scene.camera.position.set(20,30,20);
    hx_scene.camera.lookAt(hx_grid.grid['6,6'].hx_cell.Cell.position)


    hx_scene.loader().load(
        // resource URL
        "/static/js/json_models/apartment_building.json",
    
        // onLoad callback
        // Here the loaded data is assumed to be an object
        function ( geometry ) {
            console.log(geometry)
            // Add the loaded object to the scene
            var obj = new THREE.Mesh(geometry);
            obj.scale.set(1.5,1.5,1.5);
            obj.position.set(0,.28,0);
            hx_scene.add( obj );
        },
    
        // onProgress callback
        function ( xhr ) {
            console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
        },
    
        // onError callback
        function ( err ) {
            console.error( 'An error happened' );
        }
    );
    //hx_grid.cleanup();
    $.ajaxSetup({ 
        beforeSend: function(xhr, settings) {
            function getCookie(name) {
                var cookieValue = null;
                if (document.cookie && document.cookie != '') {
                    var cookies = document.cookie.split(';');
                    for (var i = 0; i < cookies.length; i++) {
                        var cookie = jQuery.trim(cookies[i]);
                        // Does this cookie string begin with the name we want?
                        if (cookie.substring(0, name.length + 1) == (name + '=')) {
                            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                            break;
                        }
                    }
                }
                return cookieValue;
            }
            if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
                // Only send the token to relative URLs i.e. locally.
                xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
            }
        } 
   });


    $.ajax({
        type:'POST',
        url: '/Create_Game',
        data : JSON.stringify({
            'function': 'Create_Game',
            data: hx_grid.strip(),
            csrfmiddlewaretoken: '{% csrf_token %}'
        }),
        cache: false,
        contentType: false,
        processData: true,
        success: function(response){
            console.log('Success');
        },
    });
}

RenderHexDemo();

console.log(hx_grid.grid);


//game logic is handled in update loop
var update = function(){
    hx_scene.controlsUpdate();  
};

//draw and render the scene
var render = function(){
    scene = hx_scene.scene

	hx_scene.renderer.render( scene, hx_scene.camera );
};

//run complete gameLoop ie. update, render, repeat
var gameLoop = function(){
    requestAnimationFrame( gameLoop );

    update();
    render();
};


gameLoop();

