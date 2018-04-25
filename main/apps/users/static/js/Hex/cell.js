class hx_Cell {
    constructor(){
        this.color = new THREE.Color( 0xFFFFFF );
        this.pos = {
            x:0,
            y:0,
            h:0
        };
        this.selected = false;
        this.Hexgeometry =new THREE.CylinderBufferGeometry( 1, 1, .5, 6 );
        this.Hexmaterial = new THREE.MeshBasicMaterial( {color: this.color, transparent: true, opacity: 0} );
        this.Cell = new THREE.Mesh( this.Hexgeometry, this.Hexmaterial );
    
        this.WireframeGeometry = new THREE.EdgesGeometry( this.Cell.geometry ); // or WireframeGeometry
        this.WireframeMat = new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 2 } );
        this.Wireframe = new THREE.LineSegments( this.WireframeGeometry, this.WireframeMat );
        this.Cell.add( this.Wireframe );
    }
    get cell(){
        return this
    }

    rmWireframe(){
        this.Cell.children = []
    }

}