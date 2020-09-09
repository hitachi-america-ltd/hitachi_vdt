/**
 * PolygonDrawer( options ) - Draw polygon using mouse click
 * @param {Object} options - Defines the customizable properties of the polygon. Sample syntax of the options object : { style : <String>, color : <String>, lineWidth : <Number>, gapSize : <Number>, dashSize : <Number>, scale : <Number>, areaOfScope : <Element>, useZBuffer : <Boolean> }
 * @param {String} options.style : Defines the style of the polygon. Accepted values 'dashed' or 'solid'. Default 'solid'
 * @param {String} options.color : Defines the color of the polygon. A color value in hexadecimal or string can be passed. Default '#ffaa00'
 * @param {Number} options.lineWidth : Defines the polygon width. Default 2
 * @param {Number} options.gapSize : Defines the gap size between the adjuscent parts of a polygon(Applicable only if the polygon style is dashed). Default 0.5
 * @param {Number} options.dashSize : The size of the dash(Applicable only if the polygon style is dashed). Default 1
 * @param {Number} options.scale : The scale of the dashed part of a polygon. Default 1
 * @param {Number} options.vertexCount : The number of vertices needed, default 2
 * @param {Boolean} options.useZBuffer : Decides whether to use the z buffer for rendering or not. Default is true.
 * @example <caption>Example usage of PolygonDrawer</caption>
 * var polygonDrawer = new PolygonDrawer( { style : 'dashed', color : 0xffaaff, lineWidth : 3, gapSize : 0.5, dashSize : 1, scale : 1, vertexCount : 3, useZBuffer : false } );
 * @constructor
 * @author Hari
 */
var PolygonDrawer = function( options ){

    var scope = this;
    
    this.geometry;
    this.material;
    this.verticesArray;
    this.color;
    this.style;
    this.lineWidth;
    this.gapSize;
    this.dashSize;
    this.scale;
    this.useZBuffer;
    this.MAX_POINTS;
    this.drawMin;
    this.drawMax;
    this.polygon;
    this.renderOrder = 10;

    if( options != undefined ){

        this.color = ( options.color != undefined ) ? options.color: '#ffaa00';
        this.style = ( options.style != undefined ) ? options.style : 'solid';
        this.lineWidth = ( options.lineWidth != undefined ) ? options.lineWidth : 2;
        this.gapSize = ( options.gapSize != undefined ) ? options.gapSize : 0.5;
        this.dashSize = ( options.dashSize != undefined ) ? options.dashSize : 1;
        this.scale = ( options.scale != undefined ) ? options.scale : 1;
        this.MAX_POINTS = ( options.vertexCount != undefined ) ? options.vertexCount : 2;
        this.useZBuffer = ( options.useZBuffer != undefined ) ? options.useZBuffer : true;
        this.renderOrder = ( options.renderOrder != undefined ) ? options.renderOrder : 10;

        if( this.style.toLowerCase() === 'solid' ){

            this.material = new THREE.LineBasicMaterial( { 
                
                color: scope.color,
                linewidth: scope.lineWidth,
                depthTest : scope.useZBuffer,
                depthWrite : scope.useZBuffer,
                side : THREE.DoubleSide

            } );

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

        this.geometry = new THREE.BufferGeometry();
        this.verticesArray = new Float32Array( scope.MAX_POINTS * 3 );
        this.verticesArray[ 0 ] = 0;
        this.verticesArray[ 1 ] = 0;
        this.verticesArray[ 2 ] = 0;
        this.verticesArray[ 3 ] = 0;
        this.verticesArray[ 4 ] = 0;
        this.verticesArray[ 5 ] = 0;
        this.geometry.addAttribute( 'position', new THREE.BufferAttribute( scope.verticesArray, 3 ) );
        this.geometry.setDrawRange( 0, 1 );
        this.drawMin = 0;
        this.drawMax = 1;
        this.geometry.attributes.position.needsUpdate = true;
        this.polygon = new THREE.Line(  scope.geometry, scope.material );
        this.polygon.renderOrder = this.renderOrder;

    }

    return this;

}

PolygonDrawer.prototype = {

    constructor : PolygonDrawer,

    /**
     * show() - Set the visibility of the polygon to true
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of show()</caption>
     * polygonDrawer.show();
     */
    show : function(){

        this.polygon.visible = true;

    },

    /**
     * hide() - Set the visibility of the polygon to false
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of hide()</caption>
     * polygonDrawer.hide();
     */
    hide : function(){

        this.polygon.visible = false;

    },

    /**
     * setMaxPoints( maxValue ) - Set the maximum number of vertices that the polygon can have
     * @param {Number} maxValue - The maximum number of vertices that should be supported by the polygon
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of setMaxPoints()</caption>
     * polygonDrawer.setMaxPoints( 5 );
     */
    setMaxPoints : function( maxValue ){

        var scope = this;
        this.MAX_POINTS = maxValue;
        var newVerticesArray = new Float32Array( scope.MAX_POINTS * 3 );
        var oldVerticesLen = this.verticesArray.length;

        for( var i = 0; i < oldVerticesLen; i++ ){
            
            newVerticesArray[ i ] = this.verticesArray[ i ];
        
        }

        this.verticesArray = newVerticesArray;
        this.polygon.geometry.addAttribute( 'position', new THREE.BufferAttribute( scope.verticesArray, 3 ) );

    },

    /**
     * setDrawRange( min, max ) - Used to determine what part of the geometry should be rendered(Similar to BufferGeometry.setDrawRange())
     * @param {Number} min - The starting point
     * @param {Number} max - The end point
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of setDrawRange()</caption>
     * //The following code segment will tell the renderer to render from the 0th vertex upto 5th vertex
     * polygonDrawer.setDrawRange( 0, 5 );
     */
    setDrawRange : function( min, max ){

        var scope = this;
        if( min != undefined && max != undefined ){

            this.polygon.geometry.setDrawRange( min, max );
            this.drawMin = min;
            this.drawMax = max;
            this.polygon.geometry.attributes.position.needsUpdate = true;

        }
        else{
            console.warn( "%PolygonDrawer.setDrawRange( min, max ) : \"min\" and \"max\" parameters are required", "color:yellow; background-color:blue; font-style: italic; padding : 2px" );
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
     * polygonDrawer.setVerticesArray( verticesArray );
     */
    setVerticesArray : function( verticesArray ){

        var scope = this;

        this.polygon.geometry.attributes.position.set( verticesArray );
        this.polygon.geometry.attributes.position.needsUpdate = true;

    },

    /**
     * unsetVertices() - Clears all the existing vertices and changes their position to ( 0, 0, 0 )
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of unsetVertices()</caption>
     * polygonDrawer.unsetVertices();
     */
    unsetVertices : function(){

        var vLen = this.polygon.geometry.attributes.position.array.length;
        for( var i = 0; i < vLen; i++ ){
            this.polygon.geometry.attributes.position.array[ i ] = 0;
        }
        this.setDrawRange( 0, 1 );

    },

    /**
     * pushVertex( vertexNumber, vertex ) - Push the specified vertex to the geometry.
     * @param {Number} vertexNumber - The index number of the vertex
     * @param {Array} vertex - Array representing x, y, z of the new vertex
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of pushVertex()</caption>
     * //To push a 5th vertex with position ( -10, 5, 0 ) to an existing polygon,
     * polygonDrawer.pushVertex( 5, [ -10, 5, 0 ] );
     */
    pushVertex : function( vertexNumber, vertex ){

        var scope = this;
        if( vertexNumber <= this.MAX_POINTS ){

            this.polygon.geometry.attributes.position.array[ ( vertexNumber * 3 ) - 3 ] = vertex[ 0 ];
            this.polygon.geometry.attributes.position.array[ ( vertexNumber * 3 ) - 2 ] = vertex[ 1 ];
            this.polygon.geometry.attributes.position.array[ ( vertexNumber * 3 ) - 1 ] = vertex[ 2 ];

            if( vertexNumber > this.drawMax ){
                
                this.polygon.geometry.setDrawRange( this.drawMin, vertexNumber );
                this.drawMax = vertexNumber;

            }

            this.polygon.geometry.attributes.position.needsUpdate = true;

        }

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
     * polygonDrawer.setColor( "#ffffff" );
     * 
     * //Using hex number,
     * polygonDrawer.setColor( 0xffffff );
     * 
     * //Using RGB value,
     * polygonDrawer.setColor( 255, 255, 255 );
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
     * polygonDrawer.setLineWidth( 3 );
     */
    setLineWidth : function( width ){

        var scope = this;
        this.polygon.material.lineWidth = width;
        this.polygon.material.needsUpdate = true;

    },

    /**
     * setGapSize( gap ) - Defines the gap size between the adjuscent parts of a polygon(Applicable only if the polygon style is dashed).
     * @param {Number} gap - The required gap size
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of setGapSize()</caption>
     * //Remember, gapSize doesn't have any effect on solid lines, and is available for dashed lines 
     * polygonDrawer.setGapSize( 0.5 );
     */
    setGapSize :  function( gap ){

        var scope = this;
        this.polygon.material.gapSize = gap;
        this.polygon.material.needsUpdate = true;

    },

    /**
     * setDashSize( size ) - The size of the dash(Applicable only if the polygon style is dashed).
     * @param {Number} size - The required dash size
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of setDashSize()</caption>
     * //Remember, dashSize doesn't have any effect on solid lines, and is available for dashed lines 
     * polygonDrawer.setDashSize( 3 );
     */
    setDashSize : function( size ){

        var scope = this;
        this.polygon.material.dashSize = size;
        this.polygon.material.needsUpdate = true;

    },

    /**
     * setScale( scale ) - The scale of the dashed part of a polygon.
     * @param {Number} size - The required scale size
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of setScale()</caption>
     * //Remember, scale doesn't have any effect on solid lines, and is available for dashed lines 
     * polygonDrawer.setScale( 3 );
     */
    setScale : function( scale ){

        var scope = this;
        this.polygon.material.scale = scale;
        this.polygon.material.needsUpdate = true;

    },

    /**
     * computeLineDistances() - Calculates the length from each point in the polygon to the start of the polygon. The distances are stored as an array and is used to draw gaps between the parts of a 'dashed' polygon. 
     * This method is intended to compute the distance between the dashed part of a polygon.
     * It is highly recommended to call this method explicitly after changing any property of a dashed polygon.
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of computeLineDistances()</caption>
     * //Remember, there is no need to call computeLineDistances() on a solid line as it doesn't have any visual effect
     * polygonDrawer.computeLineDistances();
     */
    computeLineDistances : ( function () {

		var start = new THREE.Vector3();
		var end = new THREE.Vector3();

		return function computeLineDistances() {

			var geometry = this.geometry;

			if ( geometry.isBufferGeometry ) {

				// we assume non-indexed geometry

				if ( geometry.index === null ) {

					var positionAttribute = geometry.attributes.position;
					var lineDistances = [ 0 ];

					for ( var i = 1, l = positionAttribute.count; i < l; i ++ ) {

						start.fromBufferAttribute( positionAttribute, i - 1 );
						end.fromBufferAttribute( positionAttribute, i );

						lineDistances[ i ] = lineDistances[ i - 1 ];
						lineDistances[ i ] += start.distanceTo( end );

					}

					geometry.addAttribute( 'lineDistance', new THREE.Float32BufferAttribute( lineDistances, 1 ) );

				} else {

					console.warn( 'PolygonDrawer.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.' );

				}

			} else if ( geometry.isGeometry ) {

				var vertices = geometry.vertices;
				var lineDistances = geometry.lineDistances;

				lineDistances[ 0 ] = 0;

				for ( var i = 1, l = vertices.length; i < l; i ++ ) {

					lineDistances[ i ] = lineDistances[ i - 1 ];
					lineDistances[ i ] += vertices[ i - 1 ].distanceTo( vertices[ i ] );

				}

			}

			return this;

		};

    }() ),
    
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
     * polygonDrawer.computeLineDistances( 1 );
     * //Above code segment will give the result [ -10, 5, 0 ]
     */
    getVertex : function( vertexNumber ){

        var scope = this;
        var vertex = [];
        vertex[ 0 ] = this.polygon.geometry.attributes.position.array[ ( vertexNumber * 3 ) - 3 ];
        vertex[ 1 ] = this.polygon.geometry.attributes.position.array[ ( vertexNumber * 3 ) - 2 ];
        vertex[ 2 ] = this.polygon.geometry.attributes.position.array[ ( vertexNumber * 3 ) - 1 ];
        return vertex;

    }

}