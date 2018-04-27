

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
    
    hx_grid.cleanup();
    hx_scene.add( light );

    loadPlayers(data);
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


function loadPlayers(data){
        hx_scene.loader().load(
            // resource URL
            "/static/js/json_models/player.json",
    
            // onLoad callback
            function ( geometry ) {
    
                var loader = new THREE.FontLoader();
                loader.load( 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/fonts/helvetiker_bold.typeface.json', function ( font ) {
                
                var options =  {
                
                        font: font,
                    
                        size: .5,
                        height: .1,
                        curveSegments: 12,
        
                    
                      }
                
                  var textMaterial = new THREE.MeshPhongMaterial( 
                    { color: 0xff0000, specular: 0xffffff }
                  );
                
                  for(var p in data.players){
                    var textGeometry = new THREE.TextGeometry( data.players[p].name, options);
                    var text = new THREE.Mesh( textGeometry, textMaterial );
                    var material = new THREE.MeshLambertMaterial( {color: 'red'} );
                    var obj = new THREE.Mesh(geometry, material);                 
                    obj.add(text)
                    text.position.set(0,2,0);
                    text.lookAt( hx_scene.camera.position );
                    obj.castShadow = true;
                    obj.receiveShadow = true;
                    obj.scale.set(.5,.5,.5);
                    console.log(data.players[p],p)
                    var cords = data.players[p].pos.split(",")
                    var y = hx_grid.grid[data.players[p].pos].hx_cell.Cell.pos.h
                    var tile_pos = hx_board.board[data.players[p].pos].Tile.position
                    console.log(tile_pos)
                    obj.position.set(tile_pos.x,y,tile_pos.z);
                    hx_scene.add( obj );
                  }
                }); 
    
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
}


//PLAYER ACTION EVEN LISTENERS//
$('#DiceRoll').on('click', RollTheDice)
$('#move_confirm').on('click', ConfirmMove)
$('#move_revert').on('click', RevertMove)

function RevertMove(){
    console.log(hx_scene.get_path() ),
    $('#confirm_move').hide();
}

function ConfirmMove(){
    $.ajax({
        type:'POST',
        url: '/action',
        data : JSON.stringify({
            'function': 'move',
            game_id : $('#Game_ID').val(),
            data: hx_scene.path_hover,
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

//AJAX CALL FUNCTIONS FOR PLAYER ACTION//
function RollTheDice(){
    $.ajax({
        type:'POST',
        url: '/action',
        data : JSON.stringify({
            'function': 'roll',
            game_id : $('#Game_ID').val(),
            csrfmiddlewaretoken : '{% csrf_token %}'
        }),
        cache: false,
        contentType: false,
        processData: true,
        success: function(response){
            console.log(response);
            hx_scene.roll(parseInt(response.roll));
            var cords = response.pos.split(",")
            hx_scene.points['A'] = [parseInt(cords[0]),parseInt(cords[1])];
        },
    });
}