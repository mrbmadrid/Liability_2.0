//Adjust AJAX calls to validate with DJANGO//
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
//-----END-----//


var hx_scene,hx_grid,hx_board;
hx_scene = new hx_Scene();

Init();
function Init(){
    $.ajax({
        type:'POST',
        url: '/get_game_data',
        data : JSON.stringify({
            'function': 'join_game',
            id : $('#Game_ID').val(),
            csrfmiddlewaretoken : '{% csrf_token %}'
        }),
        cache: false,
        contentType: false,
        processData: true,
        success: function(response){
            console.log(response);
            RenderGame(response);
        },
    });
}
function RenderGame(data){

    hx_grid = new hx_Grid(data.game.width,data.game.length, [.5,1]);
    hx_board = new hx_Board(data.game.width,data.game.length, [0,0]);
    
    hx_grid.generate();
    hx_board.generate(data);
    //hx_board.generateNeighborhoods(8, hx_board.boardSize)
    console.log(hx_grid.grid['3,3']);
    hx_scene.camera.position.set(20,30,20);
    hx_scene.camera.lookAt(hx_grid.grid['3,3'].hx_cell.Cell.position)

    hx_scene.renderer.shadowMap.enabled = true;
    hx_scene.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    var light = new THREE.PointLight( 0xFFFCA2, 2, 100 );
    light.castShadow = true;
    light.position.set( -5, 10, -5 );
    //Set up shadow properties for the light
    light.shadow.mapSize.width = 1024;  // default
    light.shadow.mapSize.height = 1024; // default
    light.shadow.camera.near = 0.5;       // default
    light.shadow.camera.far = 1000      // default
    
    var sphereSize = 50;
    var pointLightHelper = new THREE.PointLightHelper( light, sphereSize );
    //hx_scene.add( pointLightHelper );
    
    hx_scene.loader().load(
        // resource URL
        "/static/js/json_models/truck_stop.json",

        // onLoad callback
        function ( geometry ) {
            var material = new THREE.MeshLambertMaterial( {color: 0x959595} );
            var obj = new THREE.Mesh(geometry, material);
            obj.castShadow = true;
            obj.receiveShadow = true;
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
    hx_scene.add( light );
}

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


//PLAYER ACTION EVEN LISTENERS//
$('#DiceRoll').on('click', RollTheDice)

//AJAX CALL FUNCTIONS FOR PLAYER ACTION//
function RollTheDice(){
    $.ajax({
        type:'POST',
        url: '/roll/'+$('#Game_ID').val(),
        data : JSON.stringify({
            'function': 'dice_roll',
            game_id : $('#Game_ID').val(),
            csrfmiddlewaretoken : '{% csrf_token %}'
        }),
        cache: false,
        contentType: false,
        processData: true,
        success: function(response){
            console.log(response);
        },
    });
}