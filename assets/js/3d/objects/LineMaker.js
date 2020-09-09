/**
 * LineMaker( options ) - Draw line between two points
 * @param {Object} options - Defines the customizable properties of the line. Sample syntax of the options object : { style : <String>, color : <String>, lineWidth : <Number>, gapSize : <Number>, dashSize : <Number>, scale : <Number>, useZBuffer : <Boolean> }
 * @param {String} options.style : Defines the style of the line. Accepted values 'dashed' or 'solid'. Default 'solid'
 * @param {String/Number} options.color : Defines the color of the line. A color value in hexadecimal or string can be passed. Default '#ffaa00'
 * @param {Number} options.lineWidth : Defines the line width. Default 2
 * @param {Number} options.gapSize : Defines the gap size between the adjuscent parts of a line(Applicable only if the line style is dashed). Default 0.5
 * @param {Number} options.dashSize : The size of the dash(Applicable only if the line style is dashed). Default 1
 * @param {Number} options.scale : The scale of the dashed part of a line. Default 1
 * @param {Boolean} options.useZBuffer : Decides whether to use the z buffer for rendering or not. Default is true.
 * Setting this field to false will let the line to appear on front while rendering.
 * @example var lineMaker = new LineMaker( { style : 'dashed', color : 0xffaaff, lineWidth : 3, gapSize : 0.5, dashSize : 1, scale : 1, useZBuffer : false } );
 * @constructor
 * @author Hari
 */
var LineMaker = function( options ){

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
    this.MAX_POINTS = 5;
    this.renderOrder = 10;
    this.line = scope.getLine( options );

    return this;

}

LineMaker.prototype = {

    constructor : LineMaker,

    /**
     * getLine( options ) - Returns the line between two points with the specified settings applied.
     * This method should not be invoked externally
     *@param {Object} options - Defines the customizable properties of the line. Sample syntax of the options object : { style : <String>, color : <String>, lineWidth : <Number>, gapSize : <Number>, dashSize : <Number>, scale : <Number> }
     * @param {String} options.style : Defines the style of the line. Accepted values 'dashed' or 'solid'. Default 'solid'
     * @param {String/Number} options.color : Defines the color of the line. A color value in hexadecimal or string can be passed. Default '#ffaa00'
     * @param {Number} options.lineWidth : Defines the line width. Default 2
     * @param {Number} options.gapSize : Defines the gap size between the adjuscent parts of a line(Applicable only if the line style is dashed). Default 0.5
     * @param {Number} options.dashSize : The size of the dash(Applicable only if the line style is dashed). Default 1
     * @param {Number} options.scale : The scale of the dashed part of a line. Default 1
     * @returns {Object} - Returns an instance of THREE.Line with the specified settings
     * @author Hari
     * @example <caption>Example usage of getLine</caption>
     * lineMaker.getLine( { style : 'dashed', color : 0xffaaff, lineWidth : 3, gapSize : 0.5, dashSize : 1, scale : 1, vertexCount : 3, useZBuffer : false } );
     */
    getLine : function( options ){

        var scope = this;

        if( options ){

            this.color = ( options.color != undefined ) ? options.color: '#ffaa00';
            this.style = ( options.style != undefined ) ? options.style : 'solid';
            this.lineWidth = ( options.lineWidth != undefined ) ? options.lineWidth : 2;
            this.gapSize = ( options.gapSize != undefined ) ? options.gapSize : 0.5;
            this.dashSize = ( options.dashSize != undefined ) ? options.dashSize : 1;
            this.scale = ( options.scale != undefined ) ? options.scale : 1;
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
            this.geometry.setDrawRange( 0, 2 );
            this.geometry.attributes.position.needsUpdate = true;
            this.line = new THREE.Line(  scope.geometry, scope.material );
            this.line.renderOrder = this.renderOrder;
            return( this.line );

        }
        else{

            console.warn( "%cLine : Line constructor expects an object as parameter", "color: yellow; font-style: italic; background-color: blue; padding: 2px" );
            return;

        }
        
    },

    /**
     * show() - Set the visibility of the line to true
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of show()</caption>
     * lineMaker.show();
     */
    show : function(){

        this.line.visible = true;

    },

    /**
     * hide() - Set the visibility of the line to false
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of hide()</caption>
     * lineMaker.hide();
     */
    hide : function(){

        this.line.visible = false;

    },

    /**
     * setMaxPoints( maxValue ) - Set the maximum number of vertices that the line can have
     * @param {Number} maxValue - The maximum number of vertices that should be supported by the line
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of setMaxPoints()</caption>
     * lineMaker.setMaxPoints( 5 );
     */
    setMaxPoints : function( maxValue ){

        var scope = this;
        this.MAX_POINTS = maxValue;
        var newVerticesArray = new Float32Array( scope.MAX_POINTS * 3 );
        this.verticesArray = newVerticesArray;
        this.line.geometry.addAttribute( 'position', new THREE.BufferAttribute( scope.verticesArray, 3 ) );

    },

    /**
     * setDrawRange( min, max ) - Used to determine what part of the geometry should be rendered(Similar to BufferGeometry.setDrawRange())
     * @param {Number} min - The starting point
     * @param {Number} max - The end point
     * @returns {Void}
     * @author Hari
     * //The following code segment will tell the renderer to render from the 0th vertex upto 5th vertex
     * lineMaker.setDrawRange( 0, 5 );
     */
    setDrawRange : function( min, max ){

        var scope = this;
        this.line.geometry.setDrawRange( min, max );
        this.line.geometry.attributes.position.needsUpdate = true;

    },

    /**
     * setVerticesArray( verticesArray ) - Sets the positions of the vertices by setting the specified verticesArray for line's geometry.
     * Always remember that the vertices array should be a typed array (preferably a Float32Array).
     * Each vertex is represented using 3 consecutive locations(corresponding to x, y and z positions from origin) in the vertices array.
     * To create a vertices array large enough to hold all the vertices you need, create the array with NUMBER_OF_MAX_VERTICES_NEEDED * 3 .
     * @param {Array} verticesArray - The vertices array for setting in the geometry. This should be a typed array
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
     * //To set this array as the vertices array for the line,
     * lineMaker.setVerticesArray( verticesArray );
     */
    setVerticesArray : function( verticesArray ){

        var scope = this;

        this.line.geometry.attributes.position.set( verticesArray );
        this.line.geometry.attributes.position.needsUpdate = true;

    },

    /**
     * pushVertex( vertexNumber, vertex ) - Push the specified vertex to the geometry.
     * @param {Number} vertexNumber - The index number of the vertex
     * @param {Array} vertex - Array representing x, y, z of the new vertex
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of pushVertex()</caption>
     * //To push a 5th vertex with position ( -10, 5, 0 ) to an existing line,
     * lineMaker.pushVertex( 5, [ -10, 5, 0 ] );
     */
    pushVertex : function( vertexNumber, vertex ){

        var scope = this;
        if( vertexNumber < this.MAX_POINTS ){

            this.line.geometry.attributes.position.array[ ( vertexNumber * 3 ) - 3 ] = vertex[ 0 ];
            this.line.geometry.attributes.position.array[ ( vertexNumber * 3 ) - 2 ] = vertex[ 1 ];
            this.line.geometry.attributes.position.array[ ( vertexNumber * 3 ) - 1 ] = vertex[ 2 ];
            this.line.geometry.attributes.position.needsUpdate = true;

        }

    },

    /**
     * setEndPoints( start, end ) - Sets the start and end points of the line.
     * @param {Object} start - The start point of the line( Should be instance of THREE.Vector3 )
     * @param {Object} end -  The end point of the line( Should be instance of THREE.Vector3 )
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of setEndPoints()</caption>
     * //To set the end points at ( -10, 5, 0 ) and ( 10, 5, 0 ),
     * lineMaker.setEndPoints( new THREE.Vector3( -10, 5, 0 ), new THREE.Vector3( 10, 5, 0 ) );
     */
    setEndPoints : function( start, end ){

        var scope = this;

        if( ( start instanceof THREE.Vector3 ) && ( end instanceof THREE.Vector3 ) ){

            var newVertices = new Float32Array( this.MAX_POINTS * 3 );
            newVertices[ 0 ] = start.x;
            newVertices[ 1 ] = start.y;
            newVertices[ 2 ] = start.z;
            newVertices[ 3 ] = end.x;
            newVertices[ 4 ] = end.y;
            newVertices[ 5 ] = end.z;
            this.line.geometry.attributes.position.setArray( newVertices );
            this.line.geometry.attributes.position.needsUpdate = true;

        }
        else{

            console.warn( "%csetEndPoints( start, end ) : \'start\' and \'end\' should be instance of THREE.Vector3", "color: yellow; font-style: italic; background-color: blue; padding: 2px" );
            return;
            
        }

    },

    /**
     * setStartPoint( position ) - Sets the start point of the line
     * @param {Object} position - The start point of the line. Should be instance of THREE.Vector3
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of setStartPoint()</caption>
     * //To set the start point at ( -10, 5, 0 ),
     * lineMaker.setStartPoint( new THREE.Vector3( -10, 5, 0 ) );
     */
    setStartPoint : function( position ){

        if( position instanceof THREE.Vector3 ){

            var newVertices = new Float32Array( this.MAX_POINTS * 3 );
            newVertices[ 0 ] = position.x;
            newVertices[ 1 ] = position.y;
            newVertices[ 2 ] = position.z;
            newVertices[ 3 ] = this.line.geometry.attributes.position.array[ 3 ];
            newVertices[ 4 ] = this.line.geometry.attributes.position.array[ 4 ];
            newVertices[ 5 ] = this.line.geometry.attributes.position.array[ 5 ];
            this.line.geometry.attributes.position.setArray( newVertices );
            this.line.geometry.attributes.position.needsUpdate = true;

        }
        else{

            console.warn( "%setStartPoint( position ) : \'position\' should be instance of THREE.Vector3", "color: yellow; font-style: italic; background-color: blue; padding: 2px" );
            return;
            
        }

    },

    /**
     * setTargetPoint( position ) - Sets the end point of the line
     * @param {Object} position - The end point of the line. Should be instance of THREE.Vector3
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of setTargetPoint()</caption>
     * //To set the end point at ( -10, 5, 0 ),
     * lineMaker.setTargetPoint( new THREE.Vector3( -10, 5, 0 ) );
     */
    setTargetPoint : function( position ){

        if( position instanceof THREE.Vector3 ){

            var newVertices = new Float32Array( this.MAX_POINTS * 3 );
            newVertices[ 0 ] = this.line.geometry.attributes.position.array[ 0 ];
            newVertices[ 1 ] = this.line.geometry.attributes.position.array[ 1 ];
            newVertices[ 2 ] = this.line.geometry.attributes.position.array[ 2 ];
            newVertices[ 3 ] = position.x;
            newVertices[ 4 ] = position.y;
            newVertices[ 5 ] = position.z;
            this.line.geometry.attributes.position.setArray( newVertices );
            this.line.geometry.attributes.position.needsUpdate = true;

        }
        else{

            console.warn( "%csetTargetPoint( position ) : \'position\' should be instance of THREE.Vector3", "color: yellow; font-style: italic; background-color: blue; padding: 2px" );
            return;
            
        }

    },

    /**
     * setColor( color ) - Changes the color of the line.
     * Hex codes, hex numbers and RGB values are supported for specifying color.
     * @param {String/Number} color - A string or hexadecimal number that represents a color
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of setColor()</caption>
     * //To set white color for an existing line,
     * //Using hex code, 
     * lineMaker.setColor( "#ffffff" );
     * 
     * //Using hex number,
     * lineMaker.setColor( 0xffffff );
     * 
     * //Using RGB value,
     * lineMaker.setColor( 255, 255, 255 );
     */
    setColor : function( color ){

        var scope = this;
        this.line.material.color = new THREE.Color( color );
        this.line.material.needsUpdate = true;

    },

    /**
     * setLineWidth( width ) - Controls line thickness. Due to limitations in the ANGLE layer, with the WebGL renderer on Windows platforms linewidth will always be 1 regardless of the set value.
     * @param {Number} width - The required line width
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of setLineWidth()</caption>
     * //Remember, linewidth doesn't have any effect on WINDOWS platforms 
     * lineMaker.setLineWidth( 3 );
     */
    setLineWidth : function( width ){

        var scope = this;
        this.line.material.lineWidth = width;
        this.line.material.needsUpdate = true;

    },

    /**
     * setGapSize( gap ) - Defines the gap size between the adjuscent parts of a line(Applicable only if the line style is dashed).
     * @param {Number} gap - The required gap size
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of setGapSize()</caption>
     * //Remember, gapSize doesn't have any effect on solid lines, and is available for dashed lines 
     * lineMaker.setGapSize( 0.5 );
     */
    setGapSize :  function( gap ){

        var scope = this;
        this.line.material.gapSize = gap;
        this.line.material.needsUpdate = true;

    },

    /**
     * setDashSize( size ) - The size of the dash(Applicable only if the line style is dashed).
     * @param {Number} size - The required dash size
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of setDashSize()</caption>
     * //Remember, dashSize doesn't have any effect on solid lines, and is available for dashed lines 
     * lineMaker.setDashSize( 3 );
     */
    setDashSize : function( size ){

        var scope = this;
        this.line.material.dashSize = size;
        this.line.material.needsUpdate = true;

    },

    /**
     * setScale( scale ) - The scale of the dashed part of a line.
     * @param {Number} size - The required scale size
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of setScale()</caption>
     * //Remember, scale doesn't have any effect on solid lines, and is available for dashed lines 
     * lineMaker.setScale( 3 );
     */
    setScale : function( scale ){

        var scope = this;
        this.line.material.scale = scale;
        this.line.material.needsUpdate = true;

    },

    /**
     * computeLineDistances() - Calculates the length from each point in the line to the start of the line. The distances are stored as an array and is used to draw gaps between the parts of a 'dashed' line. This method should be called explicitly after drawing the line to get the dashed line.
     * This method is intended to compute the distance between the dashed part of a line.
     * It is highly recommended to call this method explicitly after changing any property of a dashed line.
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of computeLineDistances()</caption>
     * //Remember, there is no need to call computeLineDistances() on a solid line as it doesn't have any visual effect
     * lineMaker.computeLineDistances();
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

					console.warn( 'LineMaker.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.' );

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

	}() )

}