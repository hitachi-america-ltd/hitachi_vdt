/**
 * AreaMeasurementControls( options, editor ) : Constructor for the area measurement controls
 * @constructor
 * @param {Object} options - An object specifying the settings for the measurement controls
 * @param {Object<THREE.PerspectiveCamera>} options.camera - The PerspectiveCamera through which the scene is rendered. Used for mouse picking using raycasting
 * @param {String} options.baseUnit - The measurement system used for designing the 3D model. Default is "meter"
 * @param {Number} options.baseConversionFactor - It defines the value of 1 unit distance in base units for the 3D model. Default is 1. For example, if 1 unit distance in the 3D model correspond to 2 meter in the real object, then the "baseConversionFactor" is 2.
 * @param {Object<Element>} options.areaOfScope - The areaOfScope is an HTML Element where the measurement controls should be effective. The mouse move and mouse click event listeners will be attached to this element.
 * @param {Number} options.maxPolygonPoints - Defines the maximum number of points to form a polygon, default is 4 
 * @param {any} editor - The instance of the Editor which manages the overall objects and signals
 * @returns {Void}
 * @author Hari
 * @example <caption>Example usage of AreaMeasurementControls</caption>
 * var view = document.getElementById( 'viewport' ); 
 * var measurementControls = new AreaMeasurementControls( { camera : editor.camera, areaOfScope : view, baseUnit : "meter", baseConversionFactor : 1, maxPolygonPoints : 4 }, editor );
 */
var AreaMeasurementControls = function( options, editor ){

    //Core properties
    var scope = this;
    this.camera;
    this.lineMaker;
    this.areaOfScope;
    this.raycaster = new THREE.Raycaster();
    this.mouseClickListener;
    this.mouseMoveListener;
    this.curMeasurement;
    this.maxPoints = 4;

    //Units and related
    this.allowedUnits = [ "meter", "feet" ]; //The allowed measurement units

    //Unit conversion factors.
    this.conversionFactors = {

        meter : { meter: 1, feet : 10.7639 },
        feet : { meter : 0.092903, feet : 1 }

    }

    this.baseUnit = "meter"; //baseUnit is the measurement system used for the model
    this.baseConversionFactor = 1; //indicates the measurement value in baseUnit corresponding to 1 unit distance in the model 
    this.targetUnit = "feet"; //The target unit inwhich the measurement should be calculated
    //this.targetConversionFactor = 1; //Factor to convert measurement from baseUnit to targetUnit
    this.targetConversionFactor = 10.7639; //Factor to convert measurement from baseUnit to targetUnit

    //Flags
    this.isActive = false; //Indicates whether the measurement controls is active or not
    this.startPointCollected = false; //Indicates whether the initial point has been selected or not
    this.endPointsCollected = false; //Indicates whether the end points for measurement has beem selected or not
    this.sessionGroupAdded = false; //Indicates whether the measurement session group has been added to the selected object or not

    //Vectors
    this.mousePosition = THREE.Vector3();
    this.startPoint = THREE.Vector3();
    this.intmdtPoint = THREE.Vector3();
    this.endPoint = THREE.Vector3();

    //Popup window
    this.namePopup = new UI.MobileWindow( 'area-measure-popup' );
    this.initializePopupWindow();

    //Temporary mouse cursor, direction helper line, measurement group, measurement value badge, markers + line colors
    this.markerColors = [ 0x76f441, 0x8adeff, 0xeadeff ];
    this.lineColor = 0xc8ff54;
    this.shadeColor = 0xdd2504;
    this.tempBadge = null;
    this.directionHelper = new LineMaker( { style : 'solid', color : this.lineColor } );
    this.directionHelper.setMaxPoints( this.maxPoints );
    this.edgeMarkers = [];

    this.connectionLine = new PolygonDrawer( { color : this.lineColor, vertexCount : 5, useZBuffer : false } );
    //this.connectionLine.setMaxPoints( this.maxPoints );

    this.measureSessionGroup;
    this.measurementGroup;
    this.startMarker = null;
    this.measurementName;
    this.selectedMeasurementLine;
    this.selectedMeasurementData;
    this.pointsPicked = 1;

    this.cursor;

    if( options != undefined ){

        if( options.areaOfScope != undefined && options.areaOfScope instanceof Element && options.camera != undefined && options.camera instanceof THREE.Camera && options.baseUnit != undefined && options.baseConversionFactor != undefined && options.maxPolygonPoints != undefined  ){
            
            this.areaOfScope = options.areaOfScope;
            this.camera = options.camera;
            this.maxPoints = options.maxPolygonPoints;
            if( this.allowedUnits.indexOf( options.baseUnit.toLowerCase() ) === -1 ){

                console.warn( "%cMeasurementControls( options ) : Specified baseUnit is not allowed. Using meter instead", "color:yellow; background-color:blue; font-style: italic; padding : 2px" );
                this.baseUnit = "meter";
                return false;
    
            }
            else{

                this.baseUnit = options.baseUnit.toLowerCase();

            }
            this.baseConversionFactor = options.baseConversionFactor;

        }
        else{

            console.warn( "%cMeasurementControls( options ) : Constructor expects an object as argument. \n\"options.areaOfScope\" : HTML Element in which the measurement controls are active.\n\"options.camera:\" instance of THREE.PerspectiveCamera - used for raycasting.\n\"options.baseUnit:\" baseUnit is the measurement system used for the models in the scene(Default is \"meter\"),\n\"baseConversionFactor\"indicates the measurement value in baseUnit corresponding to 1 unit distance in the model.\n\"maxPolygonPoints\" : Indicates the maximum number of vertices the polygon can have, default is 4", "color:yellow; background-color:blue; font-style:italic; padding: 2px" );
            return;
            
        }

    }
    else{

        console.warn( "%cMeasurementControls( options ) : Constructor expects an object as argument. \n\"options.areaOfScope\" : HTML Element in which the measurement controls are active.\n\"options.camera:\" instance of THREE.PerspectiveCamera - used for raycasting.\n\"options.baseUnit:\" baseUnit is the measurement system used for the models in the scene(Default is \"meter\"),\n\"baseConversionFactor\"indicates the measurement value in baseUnit corresponding to 1 unit distance in the model.", "color:yellow; background-color:blue; font-style:italic; padding: 2px" );
        return;

    }

    this.setMouseMoveListener( function( event ){

        if( this.isActive === true ){

            var boundingRect = this.areaOfScope.getBoundingClientRect();
            this.mousePosition = new THREE.Vector3( ( ( event.clientX - boundingRect.left) / this.areaOfScope.offsetWidth ) * 2 - 1, -( ( event.clientY - boundingRect.top ) / this.areaOfScope.offsetHeight ) * 2 + 1, 0.5 );

            this.raycaster.setFromCamera( this.mousePosition, this.camera );
            var intersects = this.raycaster.intersectObjects( editor.sceneObjects );

            if( intersects.length > 0 ){

                this.cursor.position.copy( intersects[ 0 ].point.clone() );

                if( this.startPointCollected === true && this.endPointsCollected === false ){

                        var cursorPosition = intersects[ 0 ].point.clone();
                        this.connectionLine.pushVertex( this.pointsPicked, [ cursorPosition.x, cursorPosition.y, cursorPosition.z ] );
        
                }
                this.rescaleComponents();
                editor.signals.sceneGraphChanged.dispatch();

            }

        }
       
    } );

    this.setMouseClickListener( function( event ){

        var scope = this;
        var boundingRect = this.areaOfScope.getBoundingClientRect();
        
        if( this.isActive === true ){
    
            if( this.pointsPicked <= this.maxPoints && this.endPointsCollected === false ){
    
                var cursorPosition = new THREE.Vector3( ( ( event.clientX - boundingRect.left) / this.areaOfScope.offsetWidth ) * 2 - 1, -( ( event.clientY - boundingRect.top ) / this.areaOfScope.offsetHeight ) * 2 + 1, 0.5 );
                this.mousePosition = cursorPosition;
                
                //Raycasting and mouse picking point of interest
                this.raycaster.setFromCamera( this.mousePosition, this.camera );
                var intersects = this.raycaster.intersectObjects( editor.sceneObjects );
                if( intersects.length > 0 ){
    
                    this.startPoint = intersects[ 0 ].point.clone();
    
                    if( this.sessionGroupAdded === false ){
    
                        var pickedObject = intersects[ 0 ].object; 
                        while( !( pickedObject.parent instanceof THREE.Scene ) ){
    
                            pickedObject = pickedObject.parent;
    
                        }
                        //Now pickedObject is the object group
                        this.measureSessionGroup.matrixAutoUpdate = false; //Set this flag to false to prevent the position change of the group
                        //Changing the parent of the measureSessionGroup to the object group without recalculating the world position
                        THREE.SceneUtils.attach( this.measureSessionGroup, editor.scene, pickedObject );
    
                        this.sessionGroupAdded = true; //Set this flag to true to indicate that the measurement session has been added to the object
    
                    }
    
                    //var markerGeo = new THREE.SphereGeometry( 0.1, 8, 6 );
                    //var markerMat = new THREE.MeshStandardMaterial( { color: this.markerColors[ 0 ], emissive: this.markerColors[ 0 ], depthTest: false, depthWrite: false, side: THREE.DoubleSide } );
                    var markerGeo = new THREE.SphereGeometry( 0.1, 10, -30 );
                    var markerMat = new THREE.MeshBasicMaterial({
                        wireframe: true,
                        color: this.markerColors[ 0 ]
                    });
                    var marker = new THREE.Mesh( markerGeo, markerMat );
                    marker.position.copy( this.startPoint );
                    marker.name = "AreaMeasureMarker" + this.pointsPicked;
                    marker.renderOrder = this.renderOrder;
                    //marker.material.depthTest = false;//
                    //marker.material.depthWrite = false;//
    
                    this.measureSessionGroup.name = "AreaMeasurementSession";
                    this.startMarker = marker;//Making a reference for future use
                    this.measureSessionGroup.add( marker );

                    if( editor.isFloorplanViewActive === true ){

                        editor.scaleLengthmarker( scope.startMarker );
    
                    }
                    else{

                        editor.scaleLengthmarkerThreeDView( scope.startMarker );

                    }

                    this.edgeMarkers.push( marker );
    
                    this.connectionLine.pushVertex( this.pointsPicked, [ this.startPoint.x, this.startPoint.y, this.startPoint.z ] );
                    
                    if( this.pointsPicked === this.maxPoints ){
                        
                        var start = this.connectionLine.getVertex( 1 );
                        this.connectionLine.pushVertex( this.pointsPicked + 1, [ start[ 0 ], start[ 1 ], start[ 2 ] ] );
                        this.pointsPicked = 1;

                        var tempGeometry = new THREE.Geometry();
                        var geoArray = this.connectionLine.geometry.attributes.position.array;
                        var geoArrayLen = this.connectionLine.geometry.attributes.position.array.length;

                        for( var i = 0; i < geoArrayLen; i += 3 ){
                            tempGeometry.vertices.push( new THREE.Vector3( geoArray[ i ], geoArray[ i + 1 ], geoArray[ i + 2 ] ) );
                        }

                        var color = new THREE.Color( 0xffaa00 );
                        var face1 = new THREE.Face3( 0, 1, 2 );
                        var face2 = new THREE.Face3( 2, 3, 4 );

                        tempGeometry.faces.push( face1 );
                        tempGeometry.faces.push( face2 );

                        tempGeometry.computeFaceNormals();
                        tempGeometry.computeVertexNormals();

                        var tempMaterial = new THREE.MeshStandardMaterial( { color : this.shadeColor, opacity : 0.75, transparent : true, side : THREE.DoubleSide, depthTest : false, depthWrite : false } );
                        var selectionRect = new THREE.Mesh( tempGeometry, tempMaterial );
                        selectionRect.name = "AreaSelectionShade";
                        selectionRect.renderOrder = this.renderOrder;

                        var closedPolygon = new PolygonDrawer( { color : this.lineColor, vertexCount : 5, useZBuffer : false } );
                        var cLineVertices = this.connectionLine.polygon.geometry.attributes.position.array;
                        var cLineVerticesLen = this.connectionLine.polygon.geometry.attributes.position.array.length;
                        
                        for( var k = 0; k < cLineVerticesLen; k++ ){

                            closedPolygon.polygon.geometry.attributes.position.array[ k ] = cLineVertices[ k ];

                        }
                        closedPolygon.setDrawRange( 0, closedPolygon.MAX_POINTS );
                        
                        var areaRectangle = closedPolygon.polygon;
                        areaRectangle.name = "AreaSelectionRectangle";
                        areaRectangle.add( selectionRect );
                        
                        var edgesLen = this.edgeMarkers.length;
                        for( var i = 0; i < edgesLen; i++ ){

                            areaRectangle.add( this.edgeMarkers[ i ] );

                        }

                        //Measurement start
                        this.curMeasurement = ( this.getQuadPointsArea( tempGeometry.vertices ) ).toFixed( 1 );
                        var badgeLabelText;
                        
                        if( this.targetUnit === "meter" ) badgeLabelText = this.curMeasurement + "\n sqm";
                        else if(  this.targetUnit === "feet"  ) badgeLabelText = this.curMeasurement + "\n sqft";
                        
                        var curMeasurementBadge = this.getNumberBadge( { badgeText : badgeLabelText, badgeWidth : 105, badgeHeight : 35, fontSize : "16px", fontColor : "#0f590b", strokeColor : "#0f590b", borderRadius : 8 } );

                        curMeasurementBadge.position.copy( new THREE.Vector3( ( tempGeometry.vertices[ 0 ].x + tempGeometry.vertices[ 2 ].x ) / 2, ( tempGeometry.vertices[ 0 ].y + tempGeometry.vertices[ 2 ].y ) / 2, ( tempGeometry.vertices[ 0 ].z + tempGeometry.vertices[ 2 ].z ) / 2 ) );
                        curMeasurementBadge.name = "AreaMeasureValueBadge";
                        areaRectangle.add( curMeasurementBadge );
                        //Measurement end

                        if( editor.isFloorplanViewActive === true ){

                            editor.scaleBadgeFloorPlanView( curMeasurementBadge );

                        }
                        else{

                            editor.scaleBadgesThreeDView( curMeasurementBadge );

                        }

                        //areaRectangle.material.depthTest = false;//
                        //areaRectangle.material.depthWrite = false;//

                        editor.execute( new AddObjectCommand( areaRectangle ) );
                        THREE.SceneUtils.attach( areaRectangle, editor.scene, this.measureSessionGroup );
                        //this.measureSessionGroup.add( areaRectangle );
                        
                        this.endPointsCollected = true;
                        this.startPointCollected = false;
                        this.connectionLine.unsetVertices();
                        this.edgeMarkers = [];
                        
                        this.selectedMeasurementLine = areaRectangle;
                        var screenPos = this.toScreenPosition( curMeasurementBadge, editor.camera );
                        this.namePopup.dom.style.left = screenPos.x + "px";
                        this.namePopup.dom.style.top = screenPos.y + "px";
                        this.namePopup.nameInputField.value = "";
                        this.namePopup.show();
                        editor.deselect();

                    }
                    else{
                        
                        this.pointsPicked++;
                        this.startPointCollected = true;
                        this.endPointsCollected = false;

                    }
                    editor.signals.sceneGraphChanged.dispatch();
    
                }
                else{
    
                    //console.log( "No intersection!" );
    
                }
                
            }
    
        }
    
    } );

    return this;

}

AreaMeasurementControls.prototype = {

    constructor : AreaMeasurementControls,

    initialize : function(){

        var scope = this;

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
        this.targetConversionFactor = ( this.conversionFactors[ this.baseUnit ][ this.targetUnit ] ) * ( this.baseConversionFactor * this.baseConversionFactor );

    },

    /**
     * activate() - Activates the measurement controls. This will enable the mouse listeners also
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of activate method.</caption>
     * measurementControls.activate();
     */
    activate : function(){

        this.isActive = true;
        
        this.tempBadge = null;
        this.measureSessionGroup = new THREE.Group();
        this.measureSessionGroup.groupType = "measurement";
        editor.scene.add( this.measureSessionGroup );
        this.sessionGroupAdded = false; //Set the flag to false to indicate the measuring session group added only to the scene(It hasn't added to the object in which measurement is going on )

        var markerGeo = new THREE.SphereGeometry( 0.04, 8, 6 );
        var markerMat = new THREE.MeshStandardMaterial( { color: this.markerColors[ 0 ] } );
        this.cursor = new THREE.Mesh( markerGeo, markerMat );
        this.cursor.name = "AreaMouseCursor";
        editor.scene.add( this.cursor );

        this.directionHelper.setEndPoints( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, 0 ) );
        //editor.scene.add( this.directionHelper.line );//

        //
        this.connectionLine = new PolygonDrawer( { color : this.lineColor, vertexCount : 5, useZBuffer : false } );
        //

        this.connectionLine.name = "AreaSelectionLine";
        this.connectionLine.unsetVertices();
        
        //this.connectionLine.polygon.material.depthTest = false;//
        //this.connectionLine.polygon.material.depthWrite = false;//
        
        editor.scene.add( this.connectionLine.polygon );

        this.startPointCollected = false;
        this.endPointsCollected = false;
        this.pointsPicked = 1;
        this.edgeMarkers = [];
        
        editor.signals.sceneGraphChanged.dispatch();

    },

    /**
     * deActivate() - Deactivates the measurement controls. This will disable the mouse listeners also
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of deActivate method.</caption>
     * measurementControls.deActivate();
     */
    deActivate : function(){

        if( this.measureSessionGroup instanceof THREE.Group && this.measureSessionGroup.children.length === 0 ){

            editor.scene.remove( this.measureSessionGroup );

        }

        if( this.isActive === true && this.endPointsCollected === false ){

            var startMarkerParent = this.connectionLine.polygon.parent;
            if( startMarkerParent ) startMarkerParent.remove( this.connectionLine.polygon );

            for( var i = 0; i < this.edgeMarkers.length; i++ ){

                if( this.edgeMarkers[ i ].parent ) this.edgeMarkers[ i ].parent.remove( this.edgeMarkers[ i ] );

            }

        }

        if( this.namePopup.dom.style.display === "block" ){

            var parentGroup = this.selectedMeasurementLine.parent;
            if( parentGroup ) parentGroup.remove( this.selectedMeasurementLine );
            this.namePopup.hide();

        }

        this.isActive = false;
        editor.scene.remove( this.cursor );
        this.cursor = {};
        this.measureSessionGroup = {};
        this.tempBadge = null;
        this.sessionGroupAdded = false; //This flag should be setted to false whenever the measurement session is deactivated

        //editor.scene.remove( this.directionHelper.line );//
        this.connectionLine.unsetVertices();
        editor.scene.remove( this.connectionLine.polygon );

        this.startPointCollected = false;
        this.endPointsCollected = false;
        this.pointsPicked = 1;
        this.edgeMarkers = [];

        editor.signals.sceneGraphChanged.dispatch();

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
     * var area = measurementControls.getQuadPointsArea( vertices );
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
        
        return ( this.targetConversionFactor * ( area ) );

    },

    /**
     * rescaleComponents() - Rescales the measurement markers based on current zoom level
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of rescaleComponents method.</caption>
     * measurementControls.rescaleComponents();
     */
    rescaleComponents : function(){

        /*
        if( this.tempBadge ){

            var scale = this.tempBadge.position.distanceTo( editor.camera.position ) * 0.15;
            this.tempBadge.scale.set( scale, scale, scale );

        }*/
        if( this.cursor instanceof THREE.Mesh ){
 
            //var scale = this.cursor.position.distanceTo( editor.camera.position ) * 0.1;
            //this.cursor.scale.set( scale, scale, scale );
            
            if( editor.isFloorplanViewActive === true ){

                //editor.scaleLengthmarker( this.cursor );
                editor.scaleCursorFloorPlanView( this.cursor );

            } else{

                editor.scaleCursorThreeDView( this.cursor );
            }

        }

    },

    /**
     * setMouseMoveListener( callback ) - Defines the mouse move listener
     * @param {Function} callback - The call back function to execute during mousemove event
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of setMouseMoveListener method.</caption>
     * var mouseMoveCallback = function( event ){ console.log( "Mouse at x : " + event.clientX +" y : " + event.clientY  ); }
     * measurementControls.setMouseMoveListener( mouseMoveCallback );
     */
    setMouseMoveListener : function( callback ){

        var scope = this;
        if( callback ){

            this.mouseMoveListener = callback.bind( this );
            this.areaOfScope.addEventListener( 'mousemove', this.mouseMoveListener );

        }
        else{

            console.warn( "%cMeasurementControls.setMouseMoveListener( callback ) : callback should be specified for the event listeners", "color:yellow; background-color:blue; font-style:italic; padding: 2px" );
            return;

        }

    },

    /**
     * setMouseClickListener( callback ) - Defines the mouse dblclick listener
     * @param {Function} callback - The call back function to execute during dblclick event
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of setMouseClickListener method.</caption>
     * var mouseClickCallback = function( event ){ console.log( "Clicked at x : " + event.clientX +" y : " + event.clientY  ); }
     * measurementControls.setMouseClickListener( mouseClickCallback );
     */
    setMouseClickListener : function( callback ){

        var scope = this;
        if( callback ){

            this.mouseClickListener = callback.bind( this );
            this.areaOfScope.addEventListener( 'dblclick', this.mouseClickListener );

        }
        else{

            console.warn( "%cMeasurementControls.setMouseMoveListener( callback ) : callback should be specified for the event listeners", "color:yellow; background-color:blue; font-style:italic; padding: 2px" );
            return;

        }

    },

    /**
     * removeMouseMoveListener() - Removes the existing mousemove listener from the areaOfScope specified
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of removeMouseMoveListener method.</caption>
     * //It's very straight forward to invoke, just call the function
     * measurementControls.removeMouseMoveListener();
     */
    removeMouseMoveListener : function(){

        this.areaOfScope.removeEventListener( 'mousemove', this.mouseMoveListener );

    },

    /**
     * removeMouseClickListener() - Removes the existing mouse dblclick listener from the areaOfScope specified
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of removeMouseClickListener method</caption>
     * //It's very straight forward to invoke, just call the function
     * measurementControls.removeMouseClickListener();
     */
    removeMouseClickListener : function(){

        this.areaOfScope.removeEventListener( 'click', this.mouseClickListener );

    },

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
     * initializePopupWindow - Creates the popup window for measurement labels. Should not be called externally 
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of initializePopupWindow method</caption>
     * //This method should not be invoked externally
     * measurementControls.initializePopupWindow();
     */
    initializePopupWindow : function(){

        var scope = this;
        this.namePopup.headerCloseBtn.disabled = true;
        this.namePopup.setHeading( editor.languageData.EditMeasurement );
        
        //Popup body section start
        var msrPopupBody = document.createElement( 'div' );
        msrPopupBody.setAttribute( 'id', 'area-measure-popup-body-div' );

        var nameSection = document.createElement( 'div' );
        nameSection.setAttribute( 'class', 'measure-name-div' );

        var nameFrmGrp = document.createElement( 'div' );
        nameFrmGrp.setAttribute( 'class', 'form-group' );
        nameFrmGrp.setAttribute( 'id', 'area-popup-form-group' );

        var nameId = "area_name_field_" + Date.now();
        var nameLabel = document.createElement( 'label' );
        nameLabel.setAttribute( 'for', nameId );
        nameLabel.innerHTML = editor.languageData.Labelforthemeasurement;
        nameFrmGrp.appendChild( nameLabel );

        var nameInput = document.createElement( 'input' );
        nameInput.setAttribute( 'type', 'text' );
        nameInput.setAttribute( 'class', 'form-control' );
        nameInput.setAttribute( 'id', nameId );
        nameFrmGrp.appendChild( nameInput );
        this.namePopup.nameInputField = nameInput;

        nameSection.appendChild( nameFrmGrp );
        msrPopupBody.appendChild( nameSection );
        //Popup body section end
        
        this.namePopup.setBody( msrPopupBody );

        //Popup footer section start
        var footerDiv = document.createElement( 'div' );
        footerDiv.setAttribute( 'id', 'area-measure-popup-footer-div' );
        footerDiv.setAttribute( 'class', 'pull-right' );

        var measureSaveBtn = document.createElement( 'button' );
        measureSaveBtn.setAttribute( 'class', 'btn btn-success btn-xs left-right-margin' );
        measureSaveBtn.setAttribute( 'id', 'area-measure-popup-footer-save-btn' );
        measureSaveBtn.innerHTML = '<span class="fa fa-floppy-o">' + editor.languageData.Save + '</span>';

        var measureDeleteBtn = document.createElement( 'button' );
        measureDeleteBtn.setAttribute( 'class', 'btn btn-danger btn-xs left-right-margin' );
        measureDeleteBtn.setAttribute( 'id', 'area-measure-popup-footer-delete-btn' );
        measureDeleteBtn.innerHTML = '<span class="fa fa-trash-o">' + editor.languageData.Delete + '</span>';

        footerDiv.appendChild( measureSaveBtn );
        footerDiv.appendChild( measureDeleteBtn );
        //Popup footer section end

        this.namePopup.setFooter( footerDiv );
        document.getElementById( 'editorElement' ).appendChild( this.namePopup.dom );

        //Event listener for clicking on the save button
        measureSaveBtn.addEventListener( 'click', function( event ){

            scope.measurementName = nameInput.value;
            
            if( nameInput.value === "" ){
                
                toastr.warning( editor.languageData.Youhavetogivealabelforthemeasurement );
                return;

            }

            if( editor.scene.userData.areaMeasurementDatas === undefined ){

                editor.scene.userData.areaMeasurementDatas = {};

            }

            var labelInputLower = nameInput.value.toLowerCase();
            for( var key in editor.scene.userData.areaMeasurementDatas ){

                if( labelInputLower === editor.scene.userData.areaMeasurementDatas[ key ].label.toLowerCase() ){

                    toastr.warning( editor.languageData.AmeasurementwithgivenlabelalreadyexistsPleasetryanotherlabelName );
                    return;

                }

            }

            try{

                var data = {};
                data.label = nameInput.value;
                data.area = scope.curMeasurement;
                //Commented here Pivot
                //data.unit = scope.targetUnit + " square";
                
                data.unit = ( scope.targetUnit === "meter" )? ( " square meter" ) : ( " square foot" );

                data.badgeLabel = ( scope.targetUnit === "meter" )? ( scope.curMeasurement + " sqm" ) : ( scope.targetUnit === "feet" )? ( scope.curMeasurement + " sqft" ) : ( scope.curMeasurement + scope.targetUnit );
                editor.scene.userData.areaMeasurementDatas[ scope.selectedMeasurementLine.uuid ] = data;
                scope.namePopup.hide();
                toastr.success( editor.languageData.Successfullyaddedmeasurementdata );

                var measuredData = {};
                measuredData.lineUuid = scope.selectedMeasurementLine.uuid;
                measuredData.label = nameInput.value;
                measuredData.area = scope.curMeasurement;
                //Commented here Pivot
                //measuredData.unit = scope.targetUnit + " square";
                measuredData.unit = ( scope.targetUnit === "meter" )? ( " square meter" ) : ( " square foot" );

                scope.selectedMeasurementLine.traverse( function( subChild ){

                    if( subChild instanceof THREE.Sprite && subChild.name === "AreaMeasureValueBadge" ){

                        editor.areaBadges.push( subChild );

                    }
                    else if( subChild instanceof THREE.Mesh && (/^(AreaMeasureMarker[1-4])/g).test(subChild.name) ){

                        editor.areaEndMarkers.push( subChild );

                    }
    
                } );

                editor.signals.newAreaMeasurementAdded.dispatch( measuredData );

                scope.startPointCollected = false;
                scope.endPointsCollected = false;

            }
            catch( error ){

                scope.namePopup.hide();
                toastr.error( editor.languageData.SorrysomethingwentwrongPleasetryagainaftersometime );
                console.log( error );

            }

        } );

        //Event listener for clicking on the delete button
        measureDeleteBtn.addEventListener( 'click', function( event ){

            try{
                
                var parentGroup = scope.selectedMeasurementLine.parent;
                parentGroup.remove( scope.selectedMeasurementLine );
                editor.signals.sceneGraphChanged.dispatch();
                scope.namePopup.hide();
                toastr.success( editor.languageData.Measurementdataremoved );
                
                scope.startPointCollected = false;
                scope.endPointsCollected = false;

            }
            catch( error ){

                scope.namePopup.hide();
                toastr.error( editor.languageData.SorrysomethingwentwrongPleasetryagainaftersometime );
                console.log( error );

            }

        } );

    },

    /**
     * toScreenPosition( obj, camera ) - Converts the object's 3D position to 2D coordinates on screen
     * @param {Object} obj - The 3D object whose position should be converted to 2D
     * @param {Object} camera - The camera through which the scene is rendered
     * @returns {Object} - Returns an object whose 'x' and 'y' corresponds to the 2D 'x' and 'y' co-ordinates
     * @author Hari
     * @example <caption>Example usage of toScreenPosition method</caption>
     * //editor.selected holds the selected object on the viewport, editor.camera is the camera used for rendering scene
     * var selectedObject = editor.selected;
     * var screenPos = this.toScreenPosition( selectedObject, editor.camera );
     */
    toScreenPosition : function( obj, camera ){
        var vector = new THREE.Vector3();
        var view = document.getElementById( 'viewport' );
        var widthHalf = 0.5 * view.offsetWidth;
        var heightHalf = 0.5 * view.offsetHeight;

        obj.updateMatrixWorld();
        vector.setFromMatrixPosition(obj.matrixWorld);
        vector.project(camera);

        vector.x = ( vector.x * widthHalf ) + widthHalf;
        vector.y = - ( vector.y * heightHalf ) + heightHalf;

        return { 
            x: vector.x,
            y: vector.y
        };

    },

    updateCamera : function( camera ){

        this.camera = camera;

    }

}