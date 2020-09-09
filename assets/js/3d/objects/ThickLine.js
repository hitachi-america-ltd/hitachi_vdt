/**
 * ThickLine( options ) - Draw line using mouse click
 * @param {Object} options - Defines the customizable properties of the line. Sample syntax of the options object : { style : <String>, color : <String>, lineWidth : <Number>, gapSize : <Number>, dashSize : <Number>, scale : <Number>, areaOfScope : <Element> }
 * @param {String} options.style : Defines the style of the line. Accepted values 'dashed' or 'solid'. Default 'solid'
 * @param {String} options.color : Defines the color of the line. A color value in hexadecimal or string can be passed. Default '#ffaa00'
 * @param {Number} options.lineWidth : Defines the line width. Default 2
 * @param {Number} options.gapSize : Defines the gap size between the adjuscent parts of a line(Applicable only if the line style is dashed). Default 0.5
 * @param {Number} options.dashSize : The size of the dash(Applicable only if the line style is dashed). Default 1
 * @param {Number} options.scale : The scale of the dashed part of a line. Default 1
 * @param {Number} options.vertexCount : The number of vertices needed, default 2
 * @example <caption>Example usage of ThickLine</caption>
 * var thickLine = new ThickLine( { style : 'dashed', color : 0xffaaff, lineWidth : 3, gapSize : 0.5, dashSize : 1, scale : 1, vertexCount : 3 } );
 * @constructor
 * @author Hari
 */
var ThickLine = function( options ){

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
    this.MAX_POINTS;
    this.drawMin;
    this.drawMax;
    this.line;

    this.params = {

        curves : true,
        circles : false,
        amount : 100,
        lineWidth : 20,
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
        this.params.lineWidth = ( options.lineWidth != undefined ) ? options.lineWidth : 10;
        this.params.gapSize = ( options.gapSize != undefined ) ? options.gapSize : 0.5;
        this.params.dashSize = ( options.dashSize != undefined ) ? options.dashSize : 1;
        this.params.scale = ( options.scale != undefined ) ? options.scale : 1;
        this.MAX_POINTS = ( options.vertexCount != undefined ) ? options.vertexCount : 2;

        if( this.params.style.toLowerCase() === 'solid' ){

            this.material = new LineMeshMaterial( {

                //map: strokeTexture,
                //useMap: this.params.strokes,
                color: new THREE.Color( this.params.color ),
                opacity: 1,//this.params.strokes ? .5 : 1,
                dashArray: new THREE.Vector2( 10, 5 ),
                resolution: resolution,
                sizeAttenuation: this.params.sizeAttenuation,
                lineWidth: this.params.lineWidth,
                near: editor.camera.near,
                far: editor.camera.far,
                depthWrite: false,
                //depthTest: !this.params.strokes,
                depthTest: false,
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
                gapSize: scope.gapSize

            } );

        }
        this.material.needsUpdate = true;

        this.geometry = new THREE.Geometry();
        //this.geometry.setDrawRange( 0, 1 );

        this.geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
        this.geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
        //this.meshLine = new MeshLine();
        this.meshLine = new LineMesh();
        //this.meshLine.setGeometry( this.geometry, function( p ) { return 1 - p; } );
        this.meshLine.setGeometry( this.geometry );

        this.drawMin = 0;
        this.drawMax = 1;
        //this.geometry.verticesNeedUpdate = true;
        this.line = new THREE.Mesh( this.meshLine.geometry, this.material );

    }

    return this;

}

ThickLine.prototype = {

    constructor : ThickLine,

    /**
     * show() - Set the visibility of the line to true
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of show()</caption>
     * thickLine.show();
     */
    show : function(){

        this.line.visible = true;

    },

    /**
     * hide() - Set the visibility of the line to false
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of hide()</caption>
     * thickLine.hide();
     */
    hide : function(){

        this.line.visible = false;

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
        geo.fromBufferGeometry( this.line.geometry );
        geo.mergeVertices();
        var numVertices = geo.vertices.length;
        if( vertexNumber != undefined && vertex != undefined ){

            if( vertexNumber <= numVertices ){

                if( vertex instanceof THREE.Vector3 ){

                    geo.vertices[ ( vertexNumber - 1 ) ] = vertex;
                    //this.meshLine.setGeometry( geo, function( p ) { return 1 - p; } );
                    //this.meshLine.setGeometry( geo );//
                    this.meshLine.updateGeometry( geo );

                }
                else{

                    console.warn( "%cThickLine.updateVertex( vertexNumber, vertex ) : \"vertexNumber\" and \"vertex\" parameters are required.\n\"vertexNumber\" is the index of the vertex to be added,\n\"vertex\" is the new vertex to be added - it should be an instance of THREE.Vector3.", "color:yellow; background-color:blue; font-style: italic; padding : 2px" );

                }

            }
            else{

                console.warn( "%cThickLine.updateVertex( vertexNumber, vertex ) : The specified \"vertexNumber\" exceeds the maximum number of vertices existing in the line.\nIf you are trying to add a new vertex, use the pushVertex( vertex, vertexNumber ) method.", "color:yellow; background-color:blue; font-style: italic; padding : 2px" );
                return;

            }

        }
        else{

            console.warn( "%cThickLine.updateVertex( vertexNumber, vertex ) : \"vertexNumber\" and \"vertex\" parameters are required.\n\"vertexNumber\" is the index of the vertex to be added,\n\"vertex\" is the new vertex to be added - it should be an instance of THREE.Vector3.", "color:yellow; background-color:blue; font-style: italic; padding : 2px" );

        }

    },

    /**
     * pushVertex( vertex, vertexNumber ) - Push the specified vertex to the geometry.
     * If 'vertexNumber' is specified, the new vertex will be pushed to that index and the preceeding vertices will be shifted to the right.
     * If 'vertexNumber' is not specified, the new vertex will be added to the end.
     * @param {Object} vertex - Instance of THREE.Vector3 representing x, y, z of the new vertex
     * @param {Number} vertexNumber - (optional) The index number of the vertex.
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of pushVertex()</caption>
     * 
     * //To push a vertex ( -10, 5, 0 ) as the 5th vertex to an existing line,
     * thickLine.pushVertex( new THREE.Vector3( -10, 5, 0 ), 5 );
     * 
     * //To add a new vertex ( -20, 20, 0 ) to an existing line,
     * thickLine.pushVertex( new THREE.Vector3( -20, 20, 0 ) );
     */
    pushVertex : function( vertex, vertexNumber ){

        var scope = this;

        var geo = new THREE.Geometry();
        geo.fromBufferGeometry( this.line.geometry );
        geo.mergeVertices();
        var numVertices = geo.vertices.length;

        if( vertex != undefined ){

            if( vertexNumber != undefined ){

                if( vertexNumber <= numVertices ){

                    if( vertex instanceof THREE.Vector3 ){

                        geo.vertices.splice( vertexNumber - 1, 0, vertex );
                        //this.meshLine.setGeometry( geo, function( p ) { return 1 - p; } );
                        this.meshLine.setGeometry( geo );
        
                    }
                    else{
        
                        console.warn( "%cThickLine.pushVertex( vertex, vertexNumber ) : \"vertex\" (required) is the new vertex to be added - it should be an instance of THREE.Vector3.\n\"vertexNumber\" (optional) is the index of the vertex to be added", "color:yellow; background-color:blue; font-style: italic; padding : 2px" );
        
                    }

                }
                else{

                    console.warn( "%cThickLine.pushVertex( vertex, vertexNumber ) : You can't specify a number greater than the maximum number of vertices existing in the line", "color:yellow; background-color:blue; font-style: italic; padding : 2px" );

                }
    
            }
            else{
    
                if( vertex instanceof THREE.Vector3 ){
    
                    geo.vertices.push( vertex );
                    //this.meshLine.setGeometry( geo, function( p ) { return 1 - p; } );
                    this.meshLine.setGeometry( geo );
    
                }
                else{
    
                    console.warn( "%cThickLine.pushVertex( vertex, vertexNumber ) : \"vertex\" (required) is the new vertex to be added - it should be an instance of THREE.Vector3.\n\"vertexNumber\" (optional) is the index of the vertex to be added", "color:yellow; background-color:blue; font-style: italic; padding : 2px" );
    
                }
    
            }

        }
        else{

            console.warn( "%cThickLine.pushVertex( vertex, vertexNumber ) : \"vertex\" (required) is the new vertex to be added - it should be an instance of THREE.Vector3.\n\"vertexNumber\" (optional) is the index of the vertex to be added", "color:yellow; background-color:blue; font-style: italic; padding : 2px" );

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
            geo.fromBufferGeometry( this.line.geometry );
            geo.mergeVertices();
            geo.vertices.splice( vertexIndex - 1, 1 );
            //this.meshLine.setGeometry( geo, function( p ) { return 1 - p; } );
            this.meshLine.setGeometry( geo );

        }
        else{

            console.warn( "%cThickLine.removeVertex( vertexIndex ) : \"vertexIndex\" (required) is the index of the vertex to be removed", "color:yellow; background-color:blue; font-style: italic; padding : 2px" );
            return;

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
     * thickLine.setEndPoints( new THREE.Vector3( -10, 5, 0 ), new THREE.Vector3( 10, 5, 0 ) );
     */
    setEndPoints : function( start, end ){

        var scope = this;

        if( ( start instanceof THREE.Vector3 ) && ( end instanceof THREE.Vector3 ) ){

            var geo = new THREE.Geometry();
            geo.vertices.push( start );
            geo.vertices.push( end );
            //this.meshLine.setGeometry( geo, function( p ) { return 1 - p; } );
            this.meshLine.setGeometry( geo );

        }
        else{

            console.warn( "%cThickLine.setEndPoints( start, end ) : \'start\' and \'end\' should be instance of THREE.Vector3", "color: yellow; font-style: italic; background-color: blue; padding: 2px" );
            return;
            
        }

    },

    /**
     * setVerticesArray( verticesArray ) - Sets the positions of the vertices by setting the specified verticesArray for line's geometry.
     * @param {Array} verticesArray - The vertices array for setting in the geometry. This should be a typed array.
     * Always remember that the vertices array should hold instances of THREE.Vector3.
     * Each vertex is represented using a THREE.Vector3( x, y, z ).
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of setVerticesArray()</caption>
     * 
     * //The following code segment will create a vertices array to hold 2 vertices.
     * var verticesArray = [];
     * 
     * //Setting the first vertex at ( -10, 5, 0 )
     * verticesArray.push( -10, 5, 0 );
     * 
     * //Setting the second vertex at ( 10, 5, 0 )
     * verticesArray.push( 10, 5, 0 );
     * 
     * //To set this array as the vertices array for the line,
     * thickLine.setVerticesArray( verticesArray );
     */
    setVerticesArray : function( verticesArray ){

        var scope = this;
        //this.meshLine.setGeometry( verticesArray, function( p ) { return 1 - p; } );
        this.meshLine.setGeometry( verticesArray );
        
    },

    /**
     * unsetVertices() - Clears all the existing vertices and changes their position to ( 0, 0, 0 )
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of unsetVertices()</caption>
     * thickLine.unsetVertices();
     */
    unsetVertices : function(){

        var geo = new THREE.Geometry();
        geo.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
        geo.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
        //this.meshLine.setGeometry( geo, function( p ) { return 1 - p; } );
        this.meshLine.setGeometry( geo );

    },

    /**
     * setColor( color ) - Changes the color of the line.
     * Hex codes, hex numbers and RGB values are supported for specifying color.
     * @param {String} color - A string or hexadecimal number that represents a color
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of setColor()</caption>
     * //To set white color for an existing line,
     * //Using hex code, 
     * thickLine.setColor( "#ffffff" );
     * 
     * //Using hex number,
     * thickLine.setColor( 0xffffff );
     * 
     * //Using RGB value,
     * thickLine.setColor( 255, 255, 255 );
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
     * thickLine.setLineWidth( 3 );
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
     * thickLine.setGapSize( 0.5 );
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
     * thickLine.setDashSize( 3 );
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
     * thickLine.setScale( 3 );
     */
    setScale : function( scale ){

        var scope = this;
        this.line.material.scale = scale;
        this.line.material.needsUpdate = true;

    },

    /**
     * computeLineDistances() - Calculates the length from each point in the line to the start of the line. The distances are stored as an array and is used to draw gaps between the parts of a 'dashed' line. 
     * This method is intended to compute the distance between the dashed part of a line.
     * It is highly recommended to call this method explicitly after changing any property of a dashed line.
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of computeLineDistances()</caption>
     * //Remember, there is no need to call computeLineDistances() on a solid line as it doesn't have any visual effect
     * thickLine.computeLineDistances();
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

					console.warn( 'ThickLine.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.' );

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
     * @returns {Object} - Returns the vertex at the specified location as a THREE.Vector3
     * @author Hari
     * @example <caption>Example usage of getVertex()</caption>
     * 
     * //Let the vertices array for the line is [ { x: -10, y: 5, z: 0 }, { x: 10, y: 5, z :0 }, { x: 0, y: 10, z: 0 } ]
     * thickLine.getVertex( 1 );
     * //Above code segment will give the result { x: -10, y: 5, z: 0 }
     */
    getVertex : function( vertexNumber ){

        var scope = this;

        var geo = new THREE.Geometry();
        geo.fromBufferGeometry( this.line.geometry );
        geo.mergeVertices();

        var vertex = [];
        vertex[ 0 ] = geo.vertices[ vertexNumber - 1 ].x;
        vertex[ 1 ] = geo.vertices[ vertexNumber - 1 ].y;
        vertex[ 2 ] = geo.vertices[ vertexNumber - 1 ].z;
        return vertex;

    }

}