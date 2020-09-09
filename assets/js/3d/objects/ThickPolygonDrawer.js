/**
 * ThickPolygonDrawer( options ) - Draw polygon using mouse click
 * @param {Object} options - Defines the customizable properties of the polygon. Sample syntax of the options object : { style : <String>, color : <String>, lineWidth : <Number>, gapSize : <Number>, dashSize : <Number>, scale : <Number>, areaOfScope : <Element>, useZBuffer : <Boolean> }
 * @param {String} options.style : Defines the style of the polygon. Accepted values 'dashed' or 'solid'. Default 'solid'
 * @param {String} options.color : Defines the color of the polygon. A color value in hexadecimal or string can be passed. Default '#ffaa00'
 * @param {Number} options.lineWidth : Defines the polygon width. Default 2
 * @param {Number} options.gapSize : Defines the gap size between the adjuscent parts of a polygon(Applicable only if the polygon style is dashed). Default 0.5
 * @param {Number} options.dashSize : The size of the dash(Applicable only if the polygon style is dashed). Default 1
 * @param {Number} options.scale : The scale of the dashed part of a polygon. Default 1
 * @param {Number} options.vertexCount : The number of vertices needed, default 2
 * @param {Boolean} options.useZBuffer : Decides whether to use the z buffer for rendering or not. Default is true.
 * @example <caption>Example usage of ThickPolygonDrawer</caption>
 * var thickPolygonDrawer = new ThickPolygonDrawer( { style : 'dashed', color : 0xffaaff, lineWidth : 3, gapSize : 0.5, dashSize : 1, scale : 1, vertexCount : 3, useZBuffer : false } );
 * @constructor
 * @author Hari
 */
var ThickPolygonDrawer = function( options ){

    var scope = this;
    
    this.geometry;
    this.material;
    this.verticesArray;
    this.useZBuffer;
    this.MAX_POINTS;
    this.drawMin;
    this.drawMax;
    this.polygon;
    this.numberOfVertices = 0;
    this.renderOrder = 10;

    this.params = {

        curves : true,
        circles : false,
        amount : 100,
        lineWidth : 30,
        taper : 'parabolic',
        strokes : false,
        sizeAttenuation : false,
        animateWidth : false,
        spread : false,
        autoRotate : true,
        autoUpdate : true,
        animateVisibility : false,
        color : '#ffaa00',
        style : 'solid',
        gapSize : 0.5,
        dashSize : 1,
        scale : 1,

    };

    var resolution = new THREE.Vector2( window.innerWidth, window.innerHeight );

    if( options != undefined ){

        this.params.color = ( options.color != undefined ) ? options.color: '#ffaa00';
        this.params.style = ( options.style != undefined ) ? options.style : 'solid';
        this.params.lineWidth = ( options.lineWidth != undefined ) ? options.lineWidth : 2;
        this.params.gapSize = ( options.gapSize != undefined ) ? options.gapSize : 0.5;
        this.params.dashSize = ( options.dashSize != undefined ) ? options.dashSize : 1;
        this.params.scale = ( options.scale != undefined ) ? options.scale : 1;
        this.MAX_POINTS = ( options.vertexCount != undefined ) ? options.vertexCount : 0;
        this.useZBuffer = ( options.useZBuffer != undefined ) ? options.useZBuffer : true;
        this.renderOrder = ( options.renderOrder != undefined ) ? options.renderOrder : 10;

        if( this.params.style.toLowerCase() === 'solid' ){

            this.material = new LineMeshMaterial( {

                color: new THREE.Color( this.params.color ),
                opacity: 1,//this.params.strokes ? .5 : 1,
                dashArray: new THREE.Vector2( 10, 5 ),
                resolution: resolution,
                sizeAttenuation: this.params.sizeAttenuation,
                lineWidth: this.params.lineWidth,
                near: editor.camera.near,
                far: editor.camera.far,
                depthWrite: scope.useZBuffer,
                depthTest: scope.useZBuffer,
                alphaTest: this.params.strokes ? .5 : 0,
                transparent: false,//true
                side: THREE.DoubleSide,

            });

        }
        else if( this.style.toLowerCase() === 'dashed' ){

            this.material = new THREE.LineDashedMaterial( {

                color: scope.color,
                linewidth: scope.lineWidth,
                scale: scope.scale,
                dashSize: scope.dashSize,
                gapSize: scope.gapSize,
                depthTest : scope.useZBuffer,
                depthWrite : scope.useZBuffer,
                side : THREE.DoubleSide

            } );

        }
        this.material.needsUpdate = true;

        this.geometry = new THREE.Geometry();

        if( this.MAX_POINTS > 0 ){

            for( var i = 0; i < this.MAX_POINTS; i++ ){
                this.geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
            }

        }

        this.meshLine = new LineMesh();
        //this.meshLine.setGeometry( this.geometry, function( p ) { return 2; } );
        this.meshLine.setGeometry( this.geometry );

        this.drawMin = 0;
        this.drawMax = 1;
        this.polygon = new THREE.Mesh( this.meshLine.geometry, this.material );
        this.polygon.renderOrder = this.renderOrder;

    }

    return this;

}

ThickPolygonDrawer.prototype = {

    constructor : ThickPolygonDrawer,

    /**
     * show() - Set the visibility of the polygon to true
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of show()</caption>
     * thickPolygonDrawer.show();
     */
    show : function(){

        this.polygon.visible = true;

    },

    /**
     * hide() - Set the visibility of the polygon to false
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of hide()</caption>
     * thickPolygonDrawer.hide();
     */
    hide : function(){

        this.polygon.visible = false;

    },

    /**
     * setGeometry( newGeometry ) - Set the geometry of the polygon.
     * Old geometry will be removed from the polygon.
     * @param {Object} newGeometry - The new geometry to set for the polygon
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of setGeometry()</caption>
     * var geo = new THREE.Geometry();
     * geo.vertices.push( new THREE.Vector3( 10, 10, 0 ) );
     * geo.vertices.push( new THREE.Vector3( 20, 10, 0 ) );
     * thickPolygonDrawer.setGeometry( geo );
     */
    setGeometry : function( newGeometry ){

        if( newGeometry != undefined && newGeometry instanceof THREE.Geometry ){

            //this.meshLine.setGeometry( newGeometry, function( p ) { return 2; } );
            this.meshLine.setGeometry( newGeometry );

        }
        else{

            console.warn( "%cThickPolygonDrawer.setGeometry( newGeometry ) : The function expects a THREE.Geometry instance as argument", "background-color: blue; color: yellow; padding: 2px; font-style: italic" );

        }

    },

    /**
     * updateGeometry( newGeometry ) - Updates the geometry of the polygon using the geometry provided.
     * If you use this method, OLD GEOMETRY WILL NOT BE REMOVED FROM THE POLYGON.
     * @param {Object} newGeometry - The new geometry to set for the polygon
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of updateGeometry()</caption>
     * var geo = new THREE.Geometry();
     * geo.vertices.push( new THREE.Vector3( 10, 10, 0 ) );
     * geo.vertices.push( new THREE.Vector3( 20, 10, 0 ) );
     * thickPolygonDrawer.updateGeometry( geo );
     */
    updateGeometry : function( newGeometry ){

        if( newGeometry != undefined && newGeometry instanceof THREE.Geometry ){

            this.meshLine.updateGeometry( newGeometry );

        }
        else{

            console.warn( "%cThickPolygonDrawer.updateGeometry( newGeometry ) : The function expects a THREE.Geometry instance as argument", "background-color: blue; color: yellow; padding: 2px; font-style: italic" );

        }

    },

    /**
     * setVerticesArray( verticesArray ) - Sets the positions of the vertices by setting the specified verticesArray for polygon's geometry
     * @param {Array} verticesArray - The vertices array for setting in the geometry. This should be a typed array.
     * Always remember that the vertices array should be a typed array (preferably a Float32Array).
     * Each vertex is represented using 3 consecutive locations(corresponding to x, y and z positions from origin) in the vertices array.
     * To create a vertices array large enough to hold all the vertices you need, create the array with NUMBER_OF_MAX_VERTICES_NEEDED * 3 .
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of setVerticesArray()</caption>
     * 
     * //The following code segment will create a vertices array to hold a maximum of 2 vertices.
     * var verticesArray = new Float32Array( 2 * 3 );
     * 
     * //Setting the first vertex at ( -10, 5, 0 )
     * verticesArray[ 0 ] = -10;
     * verticesArray[ 1 ] = 5;
     * verticesArray[ 2 ] = 0;
     * 
     * //Setting the second vertex at ( 10, 5, 0 )
     * verticesArray[ 3 ] = 10;
     * verticesArray[ 4 ] = 5;
     * verticesArray[ 5 ] = 0;
     * 
     * //To set this array as the vertices array for the polygon,
     * thickPolygonDrawer.setVerticesArray( verticesArray );
     */
    setVerticesArray : function( verticesArray ){

        var scope = this;
        //this.meshLine.setGeometry( verticesArray, function( p ) { return 2; } );
        this.meshLine.setGeometry( verticesArray );
        
    },

    /**
     * unsetVertices() - Clears all the existing vertices and changes their position to ( 0, 0, 0 )
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of unsetVertices()</caption>
     * thickPolygonDrawer.unsetVertices();
     */
    unsetVertices : function(){

        var geo = new THREE.Geometry();
        for( var i = 0; i < this.MAX_POINTS; i++ ){

            geo.vertices[ i ] = new THREE.Vector3( 0, 0, 0 );

        }
        
        //this.meshLine.setGeometry( geo, function( p ) { return 2; } );
        this.meshLine.setGeometry( geo );

    },

    /**
     * addVertex( vertexNumber, vertex ) - Push the specified vertex to the geometry.
     * @param {Number} vertexNumber - The index number of the vertex
     * @param {Array} vertex - Array representing x, y, z of the new vertex
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of addVertex()</caption>
     * //To push a 5th vertex with position ( -10, 5, 0 ) to an existing polygon,
     * thickPolygonDrawer.addVertex( 5, [ -10, 5, 0 ] );
     */
    addVertex : function( vertex ){

        var scope = this;

        if( vertex === undefined || !( vertex instanceof THREE.Vector3 ) ){

            console.warn( "%cThickPolygonDrawer.addVertex( vertex ) : \"vertex\" (required) is the new vertex to be added - it should be an instance of THREE.Vector3", "color:yellow; background-color:blue; font-style: italic; padding : 2px" );
            return;

        }

        var geo = new THREE.Geometry();
        //geo.fromBufferGeometry( this.polygon.geometry );
        //geo.mergeVertices();
        //var numVertices = geo.vertices.length;

        var vArray = this.polygon.geometry.attributes.position.array;
        var len = this.polygon.geometry.attributes.position.array.length;
        for( var i = 1; i <= (len/3); i+=2 ){
            
            geo.vertices.push( new THREE.Vector3( vArray[ ( i * 3 ) - 3 ], vArray[ ( i * 3 ) - 2 ], vArray[ ( i * 3 ) - 1 ] ) );
        
        }
        geo.vertices.push( vertex );
        //this.meshLine.setGeometry( geo, function( p ) { return 2; } );
        this.meshLine.setGeometry( geo );

    },

    /**
     * updateVertex( vertexNumber, vertex ) - Updates the specified vertex of the geometry.
     * This method will replace the existing vertex at 'vertexNumber' with 'vertex' specified.
     * @param {Number} vertexNumber - The index number of the vertex
     * @param {Object} vertex - Instance of THREE.Vector3 representing x, y, z of the new vertex
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of updateVertex()</caption>
     * //To change the 5th vertex to ( -10, 5, 0 ) for an existing line,
     * thickLine.updateVertex( 5, new THREE.Vector3( -10, 5, 0 ) );
     */
    updateVertex : function( vertexNumber, vertex ){

        var scope = this;
        var geo = new THREE.Geometry();
        geo.fromBufferGeometry( this.polygon.geometry );
        geo.mergeVertices();
        var numVertices = geo.vertices.length;
        if( vertexNumber != undefined && vertex != undefined ){

            if( vertexNumber <= this.MAX_POINTS ){

                if( vertex instanceof THREE.Vector3 ){

                    geo.vertices[ ( vertexNumber - 1 ) ] = vertex;
                    this.meshLine.updateGeometry( geo );

                }
                else{

                    console.warn( "%cThickLine.updateVertex( vertexNumber, vertex ) : \"vertexNumber\" and \"vertex\" parameters are required.\n\"vertexNumber\" is the index of the vertex to be added,\n\"vertex\" is the new vertex to be added - it should be an instance of THREE.Vector3.", "color:yellow; background-color:blue; font-style: italic; padding : 2px" );

                }

            }
            else{

                console.warn( "%cThickLine.updateVertex( vertexNumber, vertex ) : The specified \"vertexNumber\" exceeds the maximum number of vertices existing in the line.\nIf you are trying to add a new vertex, use the addVertex( vertex ) method.", "color:yellow; background-color:blue; font-style: italic; padding : 2px" );
                return;

            }

        }
        else{

            console.warn( "%cThickLine.updateVertex( vertexNumber, vertex ) : \"vertexNumber\" and \"vertex\" parameters are required.\n\"vertexNumber\" is the index of the vertex to be updated,\n\"vertex\" is the new vertex to be added - it should be an instance of THREE.Vector3.", "color:yellow; background-color:blue; font-style: italic; padding : 2px" );

        }

    },

    /**
     * removeVertex( vertexIndex ) - Removes the vertex at the index specified.
     * @param {Number} vertexIndex - (Required) The index of the vertex to be removed.
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of removeVertex()</caption>
     * 
     * //To remove the vertex at the 5th index,
     * thickLine.removeVertex( 5 );
     */
    removeVertex : function( vertexIndex ){

        if( vertexIndex ){

            var geo = new THREE.Geometry();
            geo.fromBufferGeometry( this.polygon.geometry );
            geo.mergeVertices();
            geo.vertices.splice( vertexIndex - 1, 1 );
            //this.meshLine.setGeometry( geo, function( p ) { return 2; } );
            this.meshLine.setGeometry( geo );

        }
        else{

            console.warn( "%cThickLine.removeVertex( vertexIndex ) : \"vertexIndex\" (required) is the index of the vertex to be removed", "color:yellow; background-color:blue; font-style: italic; padding : 2px" );
            return;

        }

    },

    popVertex : function(){

        var geo = new THREE.Geometry();

        var vArray = this.polygon.geometry.attributes.position.array;
        var len = this.polygon.geometry.attributes.position.array.length;
        for( var i = 1; i <= (len/3); i+=2 ){
            
            geo.vertices.push( new THREE.Vector3( vArray[ ( i * 3 ) - 3 ], vArray[ ( i * 3 ) - 2 ], vArray[ ( i * 3 ) - 1 ] ) );
        
        }
        geo.vertices.pop();
        //this.meshLine.setGeometry( geo, function( p ) { return 2; } );
        this.meshLine.setGeometry( geo );

    },

    /**
     * getVertex( vertexNumber ) - Returns the vertex at the specified location.
     * Remember, in the actual implementation, the vertex position are counted from 0, 
     * but in this method the actual index( starting from 1 ) of the vertex should be supplied
     * @param {Number} vertexNumber - The position of the vertex counting from 1 
     * @returns {Array} - Returns the vertex at the specified location as an array
     * @author Hari
     * @example <caption>Example usage of getVertex()</caption>
     * 
     * //Let the vertices array for the polygon is [ -10, 5, 0, 10, 5, 0, 0, 10, 0 ]
     * thickPolygonDrawer.computeLineDistances( 1 );
     * //Above code segment will give the result [ -10, 5, 0 ]
     */
    getVertex : function( vertexNumber ){

        var scope = this;
        var geo = new THREE.Geometry();
        var vArray = this.polygon.geometry.attributes.position.array;
        var len = this.polygon.geometry.attributes.position.array.length;
        for( var i = 1; i <= ( len / 3 ); i += 2 ){

            geo.vertices.push( new THREE.Vector3( vArray[ ( i * 3 ) - 3 ], vArray[ ( i * 3 ) - 2 ], vArray[ ( i * 3 ) - 1 ] ) );

        }
        
        return ( geo.vertices[ vertexNumber - 1 ] )? geo.vertices[ vertexNumber - 1 ] : null;

    },

    getActualGeometry : function( customPolygon ){
        
        var scope = this;
        var geo = new THREE.Geometry();
        if( customPolygon ){

            var vArray = customPolygon.geometry.attributes.position.array;
            var len = customPolygon.geometry.attributes.position.array.length;
            for( var i = 1; i <= ( len / 3 ); i += 2 ){

                geo.vertices.push( new THREE.Vector3( vArray[ ( i * 3 ) - 3 ], vArray[ ( i * 3 ) - 2 ], vArray[ ( i * 3 ) - 1 ] ) );

            }

            return geo;

        }
        else{

            var vArray = this.polygon.geometry.attributes.position.array;
            var len = this.polygon.geometry.attributes.position.array.length;
            for( var i = 1; i <= ( len / 3 ); i += 2 ){

                geo.vertices.push( new THREE.Vector3( vArray[ ( i * 3 ) - 3 ], vArray[ ( i * 3 ) - 2 ], vArray[ ( i * 3 ) - 1 ] ) );

            }

            return geo;

        }

    },

    getNumberOfVertices : function( polygon ){

        if( polygon ) return ( polygon.geometry.attributes.position.array.length / 3 ) / 2;
        else return ( this.polygon.geometry.attributes.position.array.length / 3 ) / 2;

    },

    /**
     * setColor( color ) - Changes the color of the polygon.
     * Hex codes, hex numbers and RGB values are supported for specifying color.
     * @param {String} color - A string or hexadecimal number that represents a color
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of setColor()</caption>
     * //To set white color for an existing polygon,
     * //Using hex code, 
     * thickPolygonDrawer.setColor( "#ffffff" );
     * 
     * //Using hex number,
     * thickPolygonDrawer.setColor( 0xffffff );
     * 
     * //Using RGB value,
     * thickPolygonDrawer.setColor( 255, 255, 255 );
     */
    setColor : function( color ){

        var scope = this;
        this.polygon.material.color = new THREE.Color( color );
        this.polygon.material.needsUpdate = true;

    },

    /**
     * setLineWidth( width ) - Controls polygon thickness. Due to limitations in the ANGLE layer, with the WebGL renderer on Windows platforms linewidth will always be 1 regardless of the set value.
     * @param {Number} width - The required polygon width
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of setLineWidth()</caption>
     * //Remember, linewidth doesn't have any effect on WINDOWS platforms 
     * thickPolygonDrawer.setLineWidth( 3 );
     */
    setLineWidth : function( width ){

        var scope = this;
        this.polygon.material.lineWidth = width;
        this.polygon.material.needsUpdate = true;

    },

    getPolygon: function(){

        var scope = this;
        var polyRef = new THREE.Mesh( this.meshLine.geometry.clone(), this.material.clone() );
        polyRef.renderOrder = this.renderOrder;
        return ( polyRef );

    }

}