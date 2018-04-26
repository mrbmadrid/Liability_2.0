class hx_Tile {
    constructor(){
        this.color = new THREE.Color( 0x40C843 );
        this.pos = {
            x:0,
            y:0,
            h:0
        }
        this.selected = false;
        this.gamedata = {
            'edgeCost': 1,
            'neighborhood': null,
            'stayCost': 1,
            'for_sale': true,
            'price':0,
            'residual_income': 0,
            'value': 0,
            'owner': null,
            'color': null,
        }
        this.gamedata['children'] = {
            'buildings': [0,0,0,0],
            'players': [],
        }
        this.Hexgeometry =new THREE.CylinderBufferGeometry( 1, 1, .5, 6 );
        this.Hexmaterial = new THREE.MeshLambertMaterial( {color: this.color} );
        this.Tile = new THREE.Mesh( this.Hexgeometry, this.Hexmaterial );
        this.Tile.receiveShadow = true;
        this.WireframeGeometry = new THREE.EdgesGeometry( this.Tile.geometry ); // or WireframeGeometry
        this.WireframeMat = new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 2 } );
        this.Wireframe = new THREE.LineSegments( this.WireframeGeometry, this.WireframeMat );
        this.Tile.add( this.Wireframe );
        
    }
  
    get tile(){
        return this.Tile
    }

}