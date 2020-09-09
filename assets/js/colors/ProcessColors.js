var ProcessColors = function(){

    this.BW_THRESHOLD = Math.sqrt(1.05 * 0.05) - 0.05;
    this.RE_HEX = /^(?:[0-9a-f]{3}){1,2}$/i;
    this.DEFAULT_BW_COLORS = {

        black: '#000000',
        white: '#ffffff'

    };

}

ProcessColors.prototype = {

    construtor : ProcessColors,
    
    padz : function( str, len ){

        var scope = this;
        len = len || 2;
        return( new Array( len ).join( '0' ) + str ).slice( -len );

    },

    toObj : function( c ){

        var scope = this;
        return { r : c[ 0 ], g : c[ 1 ], b : c[ 2 ] };
    },

    hexToRGB : function( hex ){

        var scope = this;
        if( hex.slice( 0, 1 ) === '#' ) hex = hex.slice( 1 );
        if( !scope.RE_HEX.test( hex ) ) throw new Error( `Invalid HEX color: "${hex}"` );
        
        // normalize / convert 3-chars hex to 6-chars.
        if( hex.length === 3 ){

            hex = hex[ 0 ] + hex[ 0 ] + hex[ 1 ] + hex[ 1 ] + hex[ 2 ] + hex[ 2 ];

        }

        return[

            parseInt( hex.slice( 0, 2 ), 16 ), // r
            parseInt( hex.slice( 2, 4 ), 16 ), // g
            parseInt( hex.slice( 4, 6 ), 16 )  // b

        ];

    },

    // c = String (hex) | Array [r, g, b] | Object {r, g, b}
    toRGB : function( c ){
        
        var scope = this;
        if( !c ){

            throw new Error( 'Invalid color value' );
        
        }

        if( Array.isArray( c ) ) return c;
        return typeof c === 'string' ? scope.hexToRGB( c ) : [ c.r, c.g, c.b ];
    },

    getLuminance : function( c ){

        var scope = this;
        let i, x;
        const a = []; // so we don't mutate
        for( i = 0; i < c.length; i++ ){

            x = c[ i ] / 255;
            a[ i ] = x <= 0.03928 ? x / 12.92 : Math.pow( ( x + 0.055 ) / 1.055, 2.4 );

        }
        return 0.2126 * a[ 0 ] + 0.7152 * a[ 1 ] + 0.0722 * a[ 2 ];

    },

    invertToBW : function( color, bw, asArr ){

        var scope = this;
        const colors = ( bw === true )? scope.DEFAULT_BW_COLORS : Object.assign( {}, scope.DEFAULT_BW_COLORS, bw );
        return scope.getLuminance( color ) > scope.BW_THRESHOLD ? ( asArr ? scope.hexToRGB( colors.black ) : colors.black ) : ( asArr ? scope.hexToRGB( colors.white ) : colors.white );

    },

    invert : function( color, bw ){

        var scope = this;
        color = scope.toRGB( color );
        if( bw ) return scope.invertToBW( color, bw );
        return '#' + color.map( c => scope.padz( ( 255 - c ).toString( 16 ) ) ).join( '' );

    },

    asRgbArray : function( color, bw ){

        var scope = this;
        color = scope.toRGB( color );
        return bw ? scope.invertToBW( color, bw, true ) : color.map( c => 255 - c );

    },

    asRgbObject : function( color, bw ){

        var scope = this;
        color = scope.toRGB( color );
        return scope.toObj( bw ? scope.invertToBW( color, bw, true ) : color.map( c => 255 - c ) );

    },

}