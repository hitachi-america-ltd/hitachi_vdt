var FrustumGeometry = function( x, y, z ){

    THREE.BoxGeometry.apply( this, [ 2 , 2, 2 ] );
    //this.type = 'FrustumGeometry';
    this.helperCamera = new THREE.PerspectiveCamera( 45, 1, 0.1, 1 );

    this.origVertices = this.vertices.map( function( v ){ 
        return ( v.clone() );
    } );
    
    return this;

}

FrustumGeometry.prototype = Object.create( THREE.BoxGeometry.prototype );
FrustumGeometry.prototype.constructor = FrustumGeometry;

FrustumGeometry.prototype.updateFromCamera = function( camera ){

    var scope = this;
    scope.helperCamera.projectionMatrix.copy( camera.projectionMatrix );

    scope.vertices = scope.vertices.map( function (v, i) { 

        return ( v.copy( scope.origVertices[i] ).unproject( scope.helperCamera ) ); 

    } );

    this.verticesNeedUpdate = true;
    return this;

}
