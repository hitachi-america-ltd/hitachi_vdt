/**
 * CommonControls( options, editor ) : Constructor for common controls
 * @constructor
 * @param {any} editor - The instance of the Editor which manages the overall objects and signals
 * @returns {Void}
 * @author Peeyush
 * @example <caption>Example usage of CommonControls</caption>
 * var commonControls = new CommonControls( options, editor );
 */

var CommonControls = function( options, editor ){

    var scope = this;
    this.camera;
    this.lineMaker;
    //this.areaOfScope;
    this.raycaster = new THREE.Raycaster();
    this.mouseClickListener;
    this.mouseMoveListener;
    this.curMeasurement;

    //Units and related
    this.allowedUnits = [ "meter", "feet" ]; //The allowed measurement units

    //Unit conversion factors.
    this.conversionFactors = {

        meter : { meter: 1, feet : 3.28084 },
        feet : { meter : 0.3048, feet : 1 }

    }

    this.baseUnit = "meter"; //baseUnit is the measurement system used for the model
    this.baseConversionFactor = 1; //indicates the measurement value in baseUnit corresponding to 1 unit distance in the model 
    this.targetUnit = "feet"; //The target unit inwhich the measurement should be calculated
    //this.targetConversionFactor = 1; //Factor to convert measurement from baseUnit to targetUnit
    this.targetConversionFactor = 3.28084; //Factor to convert measurement from baseUnit to targetUnit

}

CommonControls.prototype = {

    constructor : CommonControls,

    /**
     * getNumberBadge( options ) - Returns a text badge as image or sprite based on the options provided 
     * @param {Object} options - The settings for creating the badge
     * @param {String} options.badgeText - The text that should appear on the badge, default is empty string
     * @param {Number} options.badgeWidth - The badge width value, default is 50
     * @param {Number} options.badgeHeight - The badge height value, default is 50
     * @param {String} options.badgeColor - Color using which the badge should be filled, default is "#ffffff" (white). Also accepts hexadecimal values or RGB values
     * @param {Number} options.fontSize - Font size for the badge text, default is "20px"
     * @param {String} options.fontColor - Color using which the badge text should be written, default is "#000000" (black). Also accepts hexadecimal values or RGB values
     * @param {String} options.strokeColor - Color for the badge border, default is "#000000" (black). Also accepts hexadecimal values or RGB values
     * @param {String} options.type - Specifies the type of the badge (image or sprite), default is "sprite"
     * @param {Number} options.borderRadius - Specifies the border radius, default is 10
     * @returns {Object} - Returns an object which is either a 'Sprite' or a 'Texture' and is determined by the 'type' in the 'options' object
     * @author Hari
     * @example <caption>Example usage of removeMouseClickListener method</caption>
     * //example to create a sprite badge
     * var badgeSprite = measurementControls.getNumberBadge( { badgeText : 10, badgeWidth : 55, badgeHeight : 55, fontSize : "16px", fontColor : "#500080", strokeColor : "#500080", borderRadius : 7, type : "sprite" } );
     * //
     * //example to create an image badge
     * var badgeTexture = measurementControls.getNumberBadge( { badgeText : 10, badgeWidth : 55, badgeHeight : 55, fontSize : "16px", fontColor : "#500080", strokeColor : "#500080", borderRadius : 7, type : "image" } );
     */
    getNumberBadge : function( options ){
      
        /**
         * Draws a rounded rectangle using the current state of the canvas.
         * If you omit the last three params, it will draw a rectangle
         * outline with a 5 pixel border radius
         * @param {CanvasRenderingContext2D} ctx
         * @param {Number} x The top left x coordinate
         * @param {Number} y The top left y coordinate
         * @param {Number} width The width of the rectangle
         * @param {Number} height The height of the rectangle
         * @param {Number} [radius = 5] The corner radius; It can also be an object 
         *                 to specify different radii for corners
         * @param {Number} [radius.tl = 0] Top left
         * @param {Number} [radius.tr = 0] Top right
         * @param {Number} [radius.br = 0] Bottom right
         * @param {Number} [radius.bl = 0] Bottom left
         * @param {Boolean} [fill = false] Whether to fill the rectangle.
         * @param {Boolean} [stroke = true] Whether to stroke the rectangle.
         */
        function roundRect( ctx, x, y, width, height, radius, fill, stroke ){
            
            if ( typeof stroke == 'undefined' ){
                
                stroke = true;
                
            }
            if( typeof radius === 'undefined' ){
                
                radius = 5;
                
            }
            
            if( typeof radius === 'number' ){
                
                radius = { tl: radius, tr: radius, br: radius, bl: radius };
                
            } 
            else{
                
                var defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };
                for( var side in defaultRadius ){
                    
                    radius[ side ] = radius[ side ] || defaultRadius[ side ];
                    
                }
                
            }
            
            ctx.beginPath();
            ctx.moveTo( x + radius.tl, y );
            ctx.lineTo( x + width - radius.tr, y );
            ctx.quadraticCurveTo( x + width, y, x + width, y + radius.tr );
            ctx.lineTo( x + width, y + height - radius.br );
            ctx.quadraticCurveTo( x + width, y + height, x + width - radius.br, y + height );
            ctx.lineTo( x + radius.bl, y + height );
            ctx.quadraticCurveTo( x, y + height, x, y + height - radius.bl );
            ctx.lineTo( x, y + radius.tl );
            ctx.quadraticCurveTo( x, y, x + radius.tl, y );
            ctx.closePath();
            
            if( fill ){
                
                ctx.fill();
                
            }
            if( stroke ){
                
                ctx.stroke();
                
            }

        }

        var badgeText, badgeRadius, badgeColor, type, fontSize, fontColor, badgeWidth, badgeHeight, strokeColor, borderRadius;
        var badgeCanvas = document.createElement( 'canvas' );

        ( options.badgeText === undefined )? badgeText = "" : badgeText = options.badgeText;
        ( options.badgeRadius === undefined )? badgeRadius = 45 : badgeRadius = options.badgeRadius;
        ( options.badgeWidth === undefined )? badgeWidth = 50 : badgeWidth = options.badgeWidth;
        ( options.badgeHeight === undefined )? badgeHeight = 50 : badgeHeight = options.badgeHeight;
        ( options.badgeColor === undefined )? badgeColor = "#ffffff" : badgeColor = options.badgeColor;
        ( options.fontSize === undefined )? fontSize = "20px" : fontSize = options.fontSize;
        ( options.fontColor === undefined )? fontColor = "#000000" : fontColor = options.fontColor;
        ( options.type === undefined )? type = "sprite" : type = options.type;
        ( options.strokeColor === undefined )? strokeColor = "#000000" : strokeColor = options.strokeColor;
        ( options.borderRadius === undefined )? borderRadius = 10 : borderRadius = options.borderRadius;
         
        badgeCanvas.width = badgeCanvas.height = 128;
        
        if( options.imageUrl === undefined ){

            var ctx = badgeCanvas.getContext( '2d' );

            var colorHex;
            //check whether the badgeColor is undefined, hex value or number
            if( typeof( badgeColor ) == 'number' ){

                colorHex = '#' + ( new THREE.Color( badgeColor ) ).getHexString();

            }
            else if( typeof( badgeColor ) == 'string' ){

                colorHex = badgeColor;

            }

            ctx.fillStyle = colorHex;

            //
            ctx.strokeStyle = strokeColor;
            roundRect( ctx, 64 - ( badgeWidth / 2 ), 64 - ( badgeHeight / 2 ), badgeWidth, badgeHeight, borderRadius, true, true );
            //

            ctx.fillStyle = fontColor;
            ctx.font = fontSize + ' sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText( badgeText, 64, 64 );

            var badgeTexture = new THREE.Texture( badgeCanvas );
            badgeTexture.needsUpdate = true;

            if( type != undefined && type === 'image' ){

                return( badgeTexture );

            }
            else if( type != undefined && type === 'sprite' ){

                // sample geometry
                var badge = new THREE.Sprite( new THREE.SpriteMaterial( {

                    map: badgeTexture,
                    depthWrite : false,
                    depthTest : false

                } ) );

                badge.scale.set( 3, 3, 3 );

                return( badge );

            }
            else{
                
                console.warn( "getNumberBadgeIcon( options ) - options.type can only accept \'image\' or \'sprite\'" );
                return;

            }

        }

    },

    /**
     * setBaseUnit( unit, conversionFactor ) - Method to set the base unit of the measurement controls
     * @param {String} unit - The measurement system to use for the measurement controls
     * @param {Number} conversionFactor - Defines the equivalent distance in the original object in base units corresponding to unit distance in the 3D model.
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of setBaseUnit method. Here 1 unit distance in the 3D model equals 2 feet in the actual object.</caption>
     * measurementControls.setBaseUnit( "feet", 2 );
     */
    setBaseUnit : function( unit, conversionFactor ){

        if( this.allowedUnits.indexOf( unit.toLowerCase() ) === -1 ){

            console.warn( "%cMeasurementControls.setBaseUnit( unit ) : Specified unit is not allowed", "color:yellow; background-color:blue; font-style: italic; padding : 2px" );
            return false;

        }
        this.baseUnit = unit.toLowerCase();
        this.baseConversionFactor = conversionFactor;
        this.setTargetUnit( this.targetUnit );

    },

    /**
     * setTargetUnit( unit ) - Defines the measurement system in which the measurement values should be displayed
     * @param {String} unit - The target measurement system.
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of setTargetUnit method.</caption>
     * measurementControls.setTargetUnit( "feet" );
     */
    setTargetUnit : function( unit ){

        if( this.allowedUnits.indexOf( unit.toLowerCase() ) === -1 ){

            console.warn( "%cMeasurementControls.setTargetUnit( unit ) : Specified unit is not allowed", "color:yellow; background-color:blue; font-style: italic; padding : 2px" );
            return false;

        }
        this.targetUnit = unit.toLowerCase();
        this.targetConversionFactor = ( this.conversionFactors[ this.baseUnit ][ this.targetUnit ] ) * this.baseConversionFactor;

    },

    /**
     * getQuadPointsArea( verticesArray ) - Calculates the area of the polygon using triangle subdivision method
     * @param {Array} verticesArray - The vertices of the polygon as an array
     * @returns {Number} - Returns the area of the polygon converted to target unit
     * @example <caption>Example usage of getQuadPointsArea method.</caption>
     * //The following code segment will give 32 meter square as area for -
     * // a rectangle of 2 meter length and 4 meter width if baseUnit is "meter"
     * //and baseConversionFactor is 2 ( result calculated as 2 * 4* 4 )
     * var vertices = polygon.geometry.vertices;
     * var area = commonControls.getQuadPointsArea( vertices );
     */


    getQuadPointsArea : function( verticesArray ){

        var vArray = [], len = verticesArray.length;
        for( var j = 0; j < len; j++ ){
            vArray[ j ] = new THREE.Vector3( verticesArray[ j ].x, 0, verticesArray[ j ].z );
        }
        /*vArray.forEach( function( point ){
            point.y = 0;
        } );*/
        
        var tris = [ new THREE.Triangle( vArray[ 0 ], vArray[ 1 ], vArray[ 2 ] ), new THREE.Triangle( vArray[ 0 ], vArray[ 2 ], vArray[ 3 ] ) ];
        
        var area = tris[ 0 ].getArea() + tris[ 1 ].getArea();
        return ( this.targetConversionFactor * this.targetConversionFactor * ( area ) );

    },

    /**
     * getCableLength( cable, allowancePercent ) - Returns cable length based on the base unit, conversion factor and target unit
     * @param {Object<THREE.Line>} cable - The cable whose length should be calculated
     * @param {Number} allowancePercent - The tolerance percentage for the cable length
     * @returns {Object} - Returns the calculated length in target units
     * @example <caption>Example usage of getCableLength method.</caption>
     * commonControls.getCableLength( cable, allowancePercent );
     * // returns 20 meter ( given baseUnit as meter and conversion factor as 2 )
     */

    getCableLength : function( cable, allowancePercent ){

        var scope = this,
            cableLength = 0,
            vArray = cable.geometry.attributes.position.array,
            len = cable.geometry.attributes.position.array.length;
            
        for( var i = 1, j = i + 2; j < ( len / 3 ); i += 2, j += 2 ){
            
            var start = new THREE.Vector3( vArray[ ( i * 3 ) - 3 ], vArray[ ( i * 3 ) - 2 ], vArray[ ( i * 3 ) - 1 ] );
            var end = new THREE.Vector3( vArray[ ( j * 3 ) - 3 ], vArray[ ( j * 3 ) - 2 ], vArray[ ( j * 3 ) - 1 ] );
            cableLength += ( this.targetConversionFactor * ( start.distanceTo( end ) ) );
        
        }

        if( allowancePercent && typeof allowancePercent === "number" ){

            cableLength += cableLength * ( allowancePercent / 100 );

        }
        else{

            console.warn( "%cgetCableLength( cable, allowancePercent ) : Function expects a \"cable<THREE.Mesh>\" and an \"allowancePercent<Number>\" as arguments.\nSince \"allowancePercent\" is not a number( or not provided ), it is excluded from the calculation", "font-style: italic; color: yellow; background-color: blue; padding: 2px" );

        }

        return { length : Number( cableLength.toFixed( 1 ) ), unit: this.targetUnit };

    },

    /**
     * getNumberBadgeTransparent( options ) - Draws a rounded rectangle using the current state of the canvas.
     * If you omit the last three params, it will draw a rectangle
     * outline with a 5 pixel border radius
     * @param {CanvasRenderingContext2D} ctx
     * @param {Number} x The top left x coordinate
     * @param {Number} y The top left y coordinate
     * @param {Number} width The width of the rectangle
     * @param {Number} height The height of the rectangle
     * @param {Number} [radius = 5] The corner radius; It can also be an object 
     *                 to specify different radii for corners
     * @param {Number} [radius.tl = 0] Top left
     * @param {Number} [radius.tr = 0] Top right
     * @param {Number} [radius.br = 0] Bottom right
     * @param {Number} [radius.bl = 0] Bottom left
     * @param {Boolean} [fill = false] Whether to fill the rectangle.
     * @param {Boolean} [stroke = true] Whether to stroke the rectangle.
     * @example <caption>Example usage of getNumberBadgeTransparent method.</caption>
     * commonControls.getNumberBadgeTransparent( options );
    */

    getNumberBadgeTransparent : function( options ){
      
        function roundRect( ctx, x, y, width, height, radius, fill, stroke ){
            
            if ( typeof stroke == 'undefined' ){
                
                stroke = true;
                
            }
            if( typeof radius === 'undefined' ){
                
                radius = 5;
                
            }
            
            if( typeof radius === 'number' ){
                
                radius = { tl: radius, tr: radius, br: radius, bl: radius };
                
            } 
            else{
                
                var defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };
                for( var side in defaultRadius ){
                    
                    radius[ side ] = radius[ side ] || defaultRadius[ side ];
                    
                }
                
            }
            
            /*ctx.beginPath();
            ctx.moveTo( x + radius.tl, y );
            ctx.lineTo( x + width - radius.tr, y );
            ctx.quadraticCurveTo( x + width, y, x + width, y + radius.tr );
            ctx.lineTo( x + width, y + height - radius.br );
            ctx.quadraticCurveTo( x + width, y + height, x + width - radius.br, y + height );
            ctx.lineTo( x + radius.bl, y + height );
            ctx.quadraticCurveTo( x, y + height, x, y + height - radius.bl );
            ctx.lineTo( x, y + radius.tl );
            ctx.quadraticCurveTo( x, y, x + radius.tl, y );
            ctx.closePath();
            
            if( fill ){
                
                ctx.fill();
                
            }
            if( stroke ){
                
                ctx.stroke();
                
            }*/

        }

        var badgeText, badgeRadius, badgeColor, type, fontSize, fontColor, badgeWidth, badgeHeight, strokeColor, borderRadius;
        var badgeCanvas = document.createElement( 'canvas' );

        ( options.badgeText === undefined )? badgeText = "" : badgeText = options.badgeText;
        ( options.badgeRadius === undefined )? badgeRadius = 45 : badgeRadius = options.badgeRadius;
        ( options.badgeWidth === undefined )? badgeWidth = 50 : badgeWidth = options.badgeWidth;
        ( options.badgeHeight === undefined )? badgeHeight = 50 : badgeHeight = options.badgeHeight;
        ( options.badgeColor === undefined )? badgeColor = "#ffffff" : badgeColor = options.badgeColor;
        ( options.fontSize === undefined )? fontSize = "30px" : fontSize = options.fontSize;
        ( options.fontColor === undefined )? fontColor = "#FF0000" : fontColor = options.fontColor;
        ( options.type === undefined )? type = "sprite" : type = options.type;
        ( options.strokeColor === undefined )? strokeColor = "#000000" : strokeColor = options.strokeColor;
        ( options.borderRadius === undefined )? borderRadius = 10 : borderRadius = options.borderRadius;
         
        badgeCanvas.width = badgeCanvas.height = 128;
        
        if( options.imageUrl === undefined ){

            var ctx = badgeCanvas.getContext( '2d' );

            var colorHex;
            //check whether the badgeColor is undefined, hex value or number
            if( typeof( badgeColor ) == 'number' ){

                colorHex = '#' + ( new THREE.Color( badgeColor ) ).getHexString();

            }
            else if( typeof( badgeColor ) == 'string' ){

                colorHex = badgeColor;

            }

            ctx.fillStyle = colorHex;

            //
            ctx.strokeStyle = strokeColor;
            roundRect( ctx, 64 - ( badgeWidth / 2 ), 64 - ( badgeHeight / 2 ), badgeWidth, badgeHeight, borderRadius, true, true );
            //

            ctx.fillStyle = fontColor;
            ctx.font = fontSize + ' sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText( badgeText, 64, 64 );

            var badgeTexture = new THREE.Texture( badgeCanvas );
            badgeTexture.needsUpdate = true;

            if( type != undefined && type === 'image' ){

                return( badgeTexture );

            }
            else if( type != undefined && type === 'sprite' ){

                // sample geometry
                var badge = new THREE.Sprite( new THREE.SpriteMaterial( {

                    map: badgeTexture,
                    depthWrite : false,
                    depthTest : false

                } ) );

                badge.scale.set( 5, 5, 5 );

                return( badge );

            }
            else{
                
                console.warn( "getNumberBadgeIcon( options ) - options.type can only accept \'image\' or \'sprite\'" );
                return;

            }

        }

    },

}