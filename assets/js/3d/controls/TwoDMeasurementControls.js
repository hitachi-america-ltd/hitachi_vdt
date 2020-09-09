/**
 * TwoDMeasurementControls( options, editor ) : Constructor for the point to point 2D measurement controls
 * @constructor
 * @param {Object} options - An object specifying the settings for the measurement controls
 * @param {Object<THREE.PerspectiveCamera>} options.camera - The PerspectiveCamera through which the scene is rendered. Used for mouse picking using raycasting
 * @param {String} options.baseUnit - The measurement system used for designing the 3D model. Default is "meter"
 * @param {Number} options.baseConversionFactor - It defines the value of 1 unit distance in base units for the 3D model. Default is 1. For example, if 1 unit distance in the 3D model correspond to 2 meter in the real object, then the "baseConversionFactor" is 2.
 * @param {Object<Element>} options.areaOfScope - The areaOfScope is an HTML Element where the measurement controls should be effective. The mouse move and mouse click event listeners will be attached to this element.
 * @param {any} editor - The instance of the Editor which manages the overall objects and signals
 * @returns {Void}
 * @author Peeyush
 * @example <caption>Example usage of TwoDMeasurementControls</caption>
 * var view = document.getElementById( 'viewport' );  
 * var twoDMeasurementControls = new TwoDMeasurementControls( { camera : editor.camera, areaOfScope : view, baseUnit : "meter", baseConversionFactor : 1 }, editor );
 */
var TwoDMeasurementControls = function( options, editor ) {

    this.isActive = false;
    this.tempBadge = null;
    this.sessionGroupAdded = false;
    this.startPointCollected = false;
    this.endPointsCollected = false;

    this.raycaster = new THREE.Raycaster();
    this.mouseClickListener;
    this.mouseMoveListener;

    this.directionHelper;
    this.lineColor = 0x42f445;
    
    //Vectors
    this.mousePosition = THREE.Vector3();
    this.startPoint = THREE.Vector3();
    this.intmdtPoint = THREE.Vector3();
    this.endPoint = THREE.Vector3();

    //Temporary mouse cursor, direction helper line, measurement group, measurement value badge, markers + line colors
    this.markerColors = [ 0xf441a3, 0x8adeff, 0xeadeff ];

    this.directionHelper = new LineMaker( { style : 'solid', color : this.lineColor } );
    this.directionHelper.setMaxPoints( this.maxPoints );
    this.edgeMarkers = [];
    this.connectionLine;
    this.twoDMeasureSessionGroup;
    this.twDMeasurementGroup;
    this.startMarker = null;
    this.measurementName;
    this.selectedtwoDMeasurementLine;
    this.selectedtwoDMeasurementData;
    this.pointsPicked = 1;
    this.tempVertices;
    this.sceneHeight=1;


    if( options != undefined ){

        if( options.areaOfScope != undefined && options.areaOfScope instanceof Element && options.camera != undefined && options.camera instanceof THREE.Camera && options.baseUnit != undefined && options.baseConversionFactor != undefined  ){

            this.areaOfScope = options.areaOfScope;
            this.camera = options.camera;

        }
        else{

            console.warn( "%c2D-MeasurementControls( options ) : Constructor expects an object as argument. \n\"options.areaOfScope\" : HTML Element in which the measurement controls are active.\n\"options.camera:\" instance of THREE.PerspectiveCamera - used for raycasting.\n\"options.baseUnit:\" baseUnit is the measurement system used for the models in the scene(Default is \"meter\"),\n\"baseConversionFactor\"indicates the measurement value in baseUnit corresponding to 1 unit distance in the model.", "color:yellow; background-color:blue; font-style:italic; padding: 2px" );
            return;
            
        }

    }
    else{

        console.warn( "%c2D-MeasurementControls( options ) : Constructor expects an object as argument. \n\"options.areaOfScope\" : HTML Element in which the measurement controls are active.\n\"options.camera:\" instance of THREE.PerspectiveCamera - used for raycasting.\n\"options.baseUnit:\" baseUnit is the measurement system used for the models in the scene(Default is \"meter\"),\n\"baseConversionFactor\"indicates the measurement value in baseUnit corresponding to 1 unit distance in the model.", "color:yellow; background-color:blue; font-style:italic; padding: 2px" );
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
                    this.connectionLine.setMaxPoints( this.pointsPicked * 3 );
                    this.connectionLine.pushVertex( this.pointsPicked, [ cursorPosition.x, cursorPosition.y, cursorPosition.z ] );
    
                }
                this.rescaleComponents();
                editor.signals.sceneGraphChanged.dispatch();

            }

        }
       
    } );

    this.setMouseClickListener( function( event ) {

        var scope = this;
        var boundingRect = this.areaOfScope.getBoundingClientRect();

        if( this.isActive === true ) {

            if( this.endPointsCollected === false ) {

                var cursorPosition = new THREE.Vector3( ( ( event.clientX - boundingRect.left) / this.areaOfScope.offsetWidth ) * 2 - 1, -( ( event.clientY - boundingRect.top ) / this.areaOfScope.offsetHeight ) * 2 + 1, 0.5 );
                this.mousePosition = cursorPosition;

                //Raycasting and mouse picking point of interest
                this.raycaster.setFromCamera( this.mousePosition, this.camera );
                var intersects = this.raycaster.intersectObjects( editor.sceneObjects );

                if( intersects.length > 0 ) {

                    this.startPoint = intersects[ 0 ].point.clone();
                    this.startPoint.y = this.sceneHeight;
                    if( this.sessionGroupAdded === false ){
    
                        var pickedObject = intersects[ 0 ].object; 
                        while( !( pickedObject.parent instanceof THREE.Scene ) ){
    
                            pickedObject = pickedObject.parent;
    
                        }
                        //Now pickedObject is the object group
                        this.twoDMeasureSessionGroup.matrixAutoUpdate = false; //Set this flag to false to prevent the position change of the group
                        //Changing the parent of the twoDMeasureSessionGroup to the object group without recalculating the world position
                        THREE.SceneUtils.attach( this.twoDMeasureSessionGroup, editor.scene, pickedObject );
    
                        this.sessionGroupAdded = true; //Set this flag to true to indicate that the measurement session has been added to the object
                    }
                    
                    var markerGeo = new THREE.SphereGeometry( 0.1, 10, -30 );
                    var markerMat = new THREE.MeshBasicMaterial({
                    wireframe: true,
                    color: this.markerColors[ 0 ]
                    });
                    var marker = new THREE.Mesh( markerGeo, markerMat );
                    marker.position.copy( this.startPoint );
                    marker.name = "TwoDMeasureMarker" + this.pointsPicked;
                    marker.renderOrder = this.renderOrder;

                    this.twoDMeasureSessionGroup.name = "TwoDMeasurementSession";
                    this.startMarker = marker;//Making a reference for future use
                    this.twoDMeasureSessionGroup.add( marker );

                    this.edgeMarkers.push( marker );
                    this.connectionLine.setMaxPoints( ( this.pointsPicked * 1) )
                    this.connectionLine.pushVertex( this.pointsPicked, [ this.startPoint.x, this.startPoint.y, this.startPoint.z ] );
                    
                    if( editor.isFloorplanViewActive === true ){

                        editor.scaleTwoDMarker( marker );
    
                    }

                    this.pointsPicked++;
                    this.startPointCollected = true;
                    this.endPointsCollected = false;

                    editor.signals.sceneGraphChanged.dispatch();

                }

            }

        }

    } )

    this.setRightClickListener( function(event) {

        function FinishCurrentLine() {

            if( editor.scene.userData.twoDDrawingDatas === undefined ){

                editor.scene.userData.twoDDrawingDatas = {};
            
            }

            var twoDMeasurementLine = new PolygonDrawer( { color : 0x0000ff, style:'dashed', linewidth: 1, dashSize: 0.25, gapSize: 0.25, vertexCount : (this.pointsPicked - 1), useZBuffer : false } );
            var cLineVertices = this.connectionLine.polygon.geometry.attributes.position.array;
            this.tempVertices = cLineVertices;
            
            var cLineVerticesLen = this.pointsPicked * 3;

            for( var k = 0; k < cLineVerticesLen; k++ ){
                
                twoDMeasurementLine.polygon.geometry.attributes.position.array[ k ] = cLineVertices[ k ];

            }
            twoDMeasurementLine.setDrawRange( 0, twoDMeasurementLine.MAX_POINTS );
            
            var twoDLine = twoDMeasurementLine.polygon;
            twoDLine.computeLineDistances();
            twoDLine.name = "2DMeasurement";
            twoDLine.userData.lineLabel = "2D Line";

            var edgesLen = this.edgeMarkers.length;
            for( var i = 0; i < edgesLen; i++ ){

                twoDLine.add( this.edgeMarkers[ i ] );
                editor.twoDMeasureMarkers.push( this.edgeMarkers[ i ] );

            }
            editor.execute( new AddObjectCommand( twoDLine ) );
            this.twoDMeasureSessionGroup.matrixAutoUpdate = false;
            THREE.SceneUtils.attach( twoDLine, editor.scene, this.twoDMeasureSessionGroup );

            var badgeLimit = this.pointsPicked - 2;
            var badgeCounter = 1;
            for( var i = 0; i < (badgeLimit*3); i=i+3 ) {

                var badgeLabelText;
                var startMarker = new THREE.Vector3( cLineVertices[i], cLineVertices[i+1], cLineVertices[i+2]);
                var endMarker = new THREE.Vector3( cLineVertices[i+3], cLineVertices[i+4], cLineVertices[i+5]);
                var curMeasurement = ( startMarker.distanceTo(endMarker) * editor.commonMeasurements.targetConversionFactor ).toFixed(1);
                if( editor.commonMeasurements.targetUnit === "meter" ) badgeLabelText = curMeasurement + " m";
                else if(  editor.commonMeasurements.targetUnit === "feet"  ) badgeLabelText = curMeasurement + " ft";
                var curMeasurementBadge = editor.commonMeasurements.getNumberBadgeTransparent( { badgeText : badgeLabelText, badgeWidth : 105, badgeHeight : 35, fontSize : "16px", fontColor : "#FF0000", strokeColor : "#0f590b", borderRadius : 8 } );
                curMeasurementBadge.name = "TwoDMeasurementBadge";
                curMeasurementBadge.userData.lineID = twoDLine.uuid;
                curMeasurementBadge.userData.lineNumber = badgeCounter;
                //curMeasurementBadge.position.copy( new THREE.Vector3( ( ( (startMarker.x + 1) + (endMarker.x + 1) )/2 ), ( ((startMarker.y) + (endMarker.y))/2), ( ( (startMarker.z + 1) + (endMarker.z + 1))/2 ) ) );
                
                var xdiff = Math.abs(startMarker.x - endMarker.x);
                var zdiff = Math.abs(startMarker.z - endMarker.z);
                                
                if( zdiff > 1.5 ){
                    
                    curMeasurementBadge.position.copy( new THREE.Vector3( ( ( (startMarker.x + endMarker.x)/2 ) + 1 ), ( (startMarker.y + endMarker.y)/2), ( ( startMarker.z + endMarker.z)/2 ) ) );
                }
                
                else if( xdiff > 1.5 ){
                    
                    curMeasurementBadge.position.copy( new THREE.Vector3( ( (startMarker.x + endMarker.x)/2 ) , ( (startMarker.y + endMarker.y)/2), ( ( (startMarker.z + endMarker.z)/2 ) - 1  ) ) );
                        
                }
                else{

                    curMeasurementBadge.position.copy( new THREE.Vector3( ( (startMarker.x + endMarker.x)/2 ), ( (startMarker.y + endMarker.y)/2), ( ( startMarker.z + endMarker.z)/2 ) ) );
                    
                }
                twoDLine.add( curMeasurementBadge );
                if( editor.isFloorplanViewActive === true ){

                    editor.scaleTwoDBadgeFloorPlanView( curMeasurementBadge );

                }
                editor.twoDMeasureBadges.push( curMeasurementBadge );
                editor.signals.sceneGraphChanged.dispatch();

                ++badgeCounter;

            }

            this.endPointsCollected = true;
            this.startPointCollected = false;
            this.connectionLine.unsetVertices();
            this.edgeMarkers = [];

            scope.endPointsCollected = false;
            
            //Modified to include start and end arrows start

            var length = twoDLine.geometry.attributes.position.array.length;
            var twoDArray = twoDLine.geometry.attributes.position.array;
            var firstPoint = new THREE.Vector3( twoDArray[ 0 ], twoDArray[ 1 ], twoDArray[ 2 ] );
            var secondPoint = new THREE.Vector3( twoDArray[ 3 ], twoDArray[ 4 ], twoDArray[ 5 ] );
            var lastPoint = new THREE.Vector3( twoDArray[ length - 3 ], twoDArray[ length - 2 ], twoDArray[ length - 1 ] );
            var secondLastPoint = new THREE.Vector3( twoDArray[ length - 6 ], twoDArray[ length - 5 ], twoDArray[ length - 4 ] );

            var startIcon = editor.getStartArrowIcon(firstPoint,secondPoint);
            var endIcon = editor.getEndArrowIcon(lastPoint,secondLastPoint);

            var lastChild = this.pointsPicked - 1;

            twoDLine.traverse( function( child ) {

                if( child.name === "TwoDMeasureMarker1" && child instanceof THREE.Mesh ) {

                    startIcon.needsUpdate = true;
                    var sprite = new THREE.Sprite( new THREE.SpriteMaterial( { map: startIcon } ) );
                    sprite.name = "2DDrawingStartIcon";
                    sprite.userData.textureName = startIcon.name;
                    child.add(sprite);
                    sprite.position.y = 0.60;
                    sprite.renderOrder = 10;

                } 
                else if( child.name === ("TwoDMeasureMarker" + lastChild) && child instanceof THREE.Mesh ) {

                    endIcon.needsUpdate = true;
                    var sprite = new THREE.Sprite( new THREE.SpriteMaterial( { map: endIcon } ) );
                    sprite.name = "2DDrawingEndIcon";
                    sprite.userData.textureName = endIcon.name;
                    child.add(sprite);
                    sprite.position.y = 0.60;
                    sprite.renderOrder = 10;

                }
                else if( ( /^(TwoDMeasureMarker[\d+])/g ).test( child.name ) == true ) {

                    var number = child.name.substr(17);
                    var startPoint = new THREE.Vector3( twoDArray[ (number * 3) - 6 ], twoDArray[ (number * 3) - 5 ], twoDArray[ (number * 3) - 4 ] );

                    var endPoint = new THREE.Vector3( twoDArray[ (number * 3)  ], twoDArray[ (number * 3) + 1 ], twoDArray[ (number * 3) + 2 ] );

                    var midPoint = new THREE.Vector3( twoDArray[ (number * 3) - 3 ], twoDArray[ (number * 3) - 2 ], twoDArray[ (number * 3) - 1 ] );

                    var segmentEndIcon = editor.getEndArrowIcon(midPoint,startPoint);
                    var segmentStartIcon = editor.getStartArrowIcon(midPoint,endPoint);
                    
                    segmentEndIcon.needsUpdate = true;
                    var sprite = new THREE.Sprite( new THREE.SpriteMaterial( { map: segmentEndIcon } ) );
                    sprite.name = "2DDrawingSgmtEndIcon";
                    sprite.userData.textureName = segmentEndIcon.name;
                    child.add(sprite);
                    sprite.position.y = 0.60;

                    var arrowEndPosition = editor.setArrowPosition( segmentEndIcon.name )
                    sprite.center.copy( arrowEndPosition );
                    sprite.renderOrder = 10;
                    
                    segmentStartIcon.needsUpdate = true;
                    var spriteEnd = new THREE.Sprite( new THREE.SpriteMaterial( { map: segmentStartIcon } ) );
                    spriteEnd.name = "2DDrawingSgmtStartIcon";
                    spriteEnd.userData.textureName = segmentStartIcon.name;
                    child.add(spriteEnd);
                    spriteEnd.position.y = 0.60;

                    var arrowStartPosition = editor.setArrowPosition( segmentStartIcon.name )
                    spriteEnd.center.copy( arrowStartPosition );
                    spriteEnd.renderOrder = 10;

                }

            } )

            //Modified to include start and end arrows end
            
            editor.signals.newTwoDLineAdded.dispatch( twoDLine, this.pointsPicked, true );
            this.pointsPicked = 1;
            editor.deselect();
    
        }
    
        function UndoLastLineSegment() {
            
            var limit = this.pointsPicked;
            var vArray = this.connectionLine.geometry.attributes.position.array;
            var tempGeometry = [];

            for( i=0;i<(limit-2)*3;i++ ) {

                tempGeometry.push( vArray[i] );

            }

            var newArray = new Float32Array( tempGeometry );
            this.connectionLine.unsetVertices();
            this.connectionLine.setMaxPoints( ( (this.pointsPicked - 2) * 1) )
            this.connectionLine.setVerticesArray(newArray);
            this.pointsPicked = this.pointsPicked - 1;
            var lastMarker = this.edgeMarkers.pop();
            this.twoDMeasureSessionGroup.remove(lastMarker);
            editor.signals.sceneGraphChanged.dispatch();
    
        }

        var scope = this;
        if( this.isActive === true ) {

            var criteria = ( !editor.theatreMode && !editor.isMeasuring && !editor.isAreaMeasuring && !editor.lengthShowHideToggle && !editor.areaShowHideToggle && this.isActive && !editor.isntwrkngStarted );

            if( criteria ) {

                var stopCallBack = FinishCurrentLine.bind( this );
                var undoVertexCallBack = UndoLastLineSegment.bind( this );
                var items = [];

                if(this.pointsPicked == 1){

                    return;
    
                }

                if(this.pointsPicked > 2){

                    items.push( {
                            
                        title: editor.languageData.FinishDrawing, 
                        icon: 'fa fa-check', 
                        fn: stopCallBack
            
                    } );
    
                }
        
                items.push( {
                    title: editor.languageData.UndoLastPoint,
                    icon: 'fa fa-undo',
                    fn: undoVertexCallBack
                } );
        
                basicContext.show(items, event);

            }

        }

    } )
    return this;

}

TwoDMeasurementControls.prototype = {

    constructor: TwoDMeasurementControls,

    /**
     * activate() - Activates the 2D measurement controls. This will enable the mouse listeners also
     * @returns {Void}
     * @author Peeyush
     * @example <caption>Example usage of activate method.</caption>
     * twoDMeasurementControls.activate();
     */

    activate: function() {

        this.isActive = true; 
        this.tempBadge = null;

        this.twoDMeasureSessionGroup = new THREE.Group();
        this.twoDMeasureSessionGroup.groupType = "2dmeasurement";
        editor.scene.add( this.twoDMeasureSessionGroup );
        this.sessionGroupAdded = false; //Set the flag to false to indicate the measuring session group added only to the scene(It hasn't added to the object in which measurement is going on )

        var markerGeo = new THREE.SphereGeometry( 0.04, 8, 6 );
        var markerMat = new THREE.MeshStandardMaterial( { color: this.markerColors[ 0 ] } );
        this.cursor = new THREE.Mesh( markerGeo, markerMat );
        this.cursor.name = "TwoD-MeasurementCursor";
        editor.scene.add( this.cursor );

        this.directionHelper.setEndPoints( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, 0 ) );

        this.connectionLine = new PolygonDrawer( { color : this.lineColor, vertexCount : 0, useZBuffer : false } );
        this.connectionLine.name = "2DmeasurementLine";
        this.connectionLine.unsetVertices();
        editor.scene.add( this.connectionLine.polygon );

        this.startPointCollected = false;
        this.endPointsCollected = false;
        this.pointsPicked = 1;
        this.edgeMarkers = [];
        
        editor.signals.sceneGraphChanged.dispatch();

        var bbox = new THREE.Box3().setFromObject( editor.scene );
        const center = new THREE.Vector3();
        var coordinates = bbox.getSize( center );
        this.sceneHeight = coordinates.y - 1;

        if( this.sceneHeight > 50 ) {

            this.sceneHeight = 49;

        }

    },

    /**
     * setMouseMoveListener( callback ) - Defines the mouse move listener
     * @param {Function} callback - The call back function to execute during mousemove event
     * @returns {Void}
     * @author Peeyush
     * @example <caption>Example usage of setMouseMoveListener method.</caption>
     * var mouseMoveCallback = function( event ){ console.log( "Mouse at x : " + event.clientX +" y : " + event.clientY  ); }
     * twoDMeasurementControls.setMouseMoveListener( mouseMoveCallback );
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
     * @author Peeyush
     * @example <caption>Example usage of setMouseClickListener method.</caption>
     * var mouseClickCallback = function( event ){ console.log( "Clicked at x : " + event.clientX +" y : " + event.clientY  ); }
     * twoDMeasurementControls.setMouseClickListener( mouseClickCallback );
     */

    setMouseClickListener : function( callback ){

        var scope = this;
        if( callback ){

            this.mouseClickListener = callback.bind( this );
            this.areaOfScope.addEventListener( 'dblclick', this.mouseClickListener );

        }
        else{

            console.warn( "%c2D-MeasurementControls.setMouseMoveListener( callback ) : callback should be specified for the event listeners", "color:yellow; background-color:blue; font-style:italic; padding: 2px" );
            return;

        }

    },

    /**
     * setRightClickListener( callback ) - Defines the mouse right click listener
     * @param {Function} callback - The call back function to execute during right click event
     * @returns {Void}
     * @author Peeyush
     * @example <caption>Example usage of setRightClickListener method.</caption>
     * var mouseRightClickCallback = function( event ){ console.log( "Right Clicked at x : " + event.clientX +" y : " + event.clientY  ); }
     * twoDMeasurementControls.setRightClickListener( mouseRightClickCallback );
     */

    setRightClickListener : function( callback ){

        var scope = this;
        if( callback ){

            this.rightClickListener = callback.bind( this );
            this.areaOfScope.addEventListener( 'contextmenu', this.rightClickListener );

        }
        else{

            console.warn( "%cMeasurementControls.setMouseMoveListener( callback ) : callback should be specified for the event listeners", "color:yellow; background-color:blue; font-style:italic; padding: 2px" );
            return;

        }

    },

    /**
     * rescaleComponents() - Rescales the cursor marker based on current zoom level
     * @returns {Void}
     * @author Peeyush
     * @example <caption>Example usage of rescaleComponents method.</caption>
     * twoDMeasurementControls.rescaleComponents();
     */

    rescaleComponents : function(){

        if( this.cursor instanceof THREE.Mesh ){

            if( editor.isFloorplanViewActive === true ){

                editor.scaleCursorFloorPlanView( this.cursor );

            }
            else{

                editor.scaleCursorThreeDView( this.cursor );

            }
            
        } 

    },

    /**
     * moveDrawingsByMarkerPosition( marker, twoDLine ) - Adjust the 2D lines and arrows w.r.t the dragged marker.
     * @param {THREE.Mesh} Marker used to define end-point of a line.
     * @param {THREE.Line} Currently drawn 2D Line. 
     * @returns {Void}
     * @author Peeyush
     * @example <caption>Example usage of moveDrawingsByMarkerPosition method.</caption>
     * twoDMeasurementControls.moveDrawingsByMarkerPosition( marker, twoDLine );
     */

    moveDrawingsByMarkerPosition: function( marker, twoDLine ){

        var scope = this;
		if( marker instanceof THREE.Mesh && ( /^TwoDMeasureMarker(\d+)/g ).test( marker.name ) ) {

            var twoDDrawing = marker.parent;
            var markerNumber = Number( marker.name.substring(17) );
            startPoint = (markerNumber - 1 ) * 3;

            if( twoDDrawing.name === "2DMeasurement" ) {

                twoDDrawing.geometry.attributes.position.array[ startPoint ] = marker.position.x;
				twoDDrawing.geometry.attributes.position.array[ startPoint + 1 ] = marker.position.y;
                twoDDrawing.geometry.attributes.position.array[ startPoint + 2 ] = marker.position.z;
                
                twoDDrawing.geometry.attributes.position.needsUpdate = true;

                var lineVertices = twoDDrawing.geometry.attributes.position.array;
                var lineSegments = (lineVertices.length)/3;
                var lineVericesLength = lineVertices.length;

                //First marker of 2D Line is being dragged
                if( markerNumber == 1 ) {

                    for( var i=0;i<editor.twoDMeasureBadges.length;i++ ) {
    
                        if( ( editor.twoDMeasureBadges[i].userData.lineID === twoDLine.uuid ) && ( editor.twoDMeasureBadges[i].userData.lineNumber === markerNumber ) ) {

                            var startMarker = new THREE.Vector3(lineVertices[0],lineVertices[1],lineVertices[2]) 
                            var endMarker = new THREE.Vector3(lineVertices[3],lineVertices[4],lineVertices[5]) 
                            editor.signals.changeTwoDValues.dispatch(startMarker,endMarker,twoDLine,editor.twoDMeasureBadges[i], markerNumber, false);

                            //Modified to change the start arrow icon w.r.t the new line
                            marker.traverse( function( child ){

                                if( child instanceof THREE.Sprite && child.name === "2DDrawingStartIcon" ) {

                                    var firstPoint = new THREE.Vector3( lineVertices[ 0 ], lineVertices[ 1 ], lineVertices[ 2 ] );
                                    var secondPoint = new THREE.Vector3( lineVertices[ 3 ], lineVertices[ 4 ], lineVertices[ 5 ] );

                                    var startIcon = editor.getStartArrowIcon(firstPoint,secondPoint)
                                    if( startIcon.name != child.userData.textureName ) {
                            
                                        marker.remove( child );
                                        startIcon.needsUpdate = true;
                                        var sprite = new THREE.Sprite( new THREE.SpriteMaterial( { map: startIcon } ) );
                                        sprite.name = "2DDrawingStartIcon";
                                        marker.add(sprite);
                                        sprite.userData.textureName = startIcon.name;
                                        sprite.position.y = 0.60;
                                        sprite.renderOrder = 10;

                                    }
                                    
                                        var twoDArray = twoDLine.geometry.attributes.position.array;
                                        var lastPoint = new THREE.Vector3( twoDArray[ 3 ], twoDArray[ 4 ], twoDArray[ 5 ] );
                                        var secondLastPoint = new THREE.Vector3( twoDArray[ 0 ], twoDArray[ 1 ], twoDArray[ 2 ] );

                                        var postMarkerName = 'TwoDMeasureMarker2';
                                        var postMarker = twoDDrawing.getObjectByName(postMarkerName);

                                        if( postMarker ) {

                                            editor.alignArrowsForPostMarker(postMarker,lastPoint,secondLastPoint);
                            
                                        }

                                }

                            } )
    
                        }
    
                    }
    
                } 
                //Last marker of 2D Line is being dragged
                else if( markerNumber == lineSegments ) {

                    for( var i=0;i<editor.twoDMeasureBadges.length;i++ ) {

                        if( ( editor.twoDMeasureBadges[i].userData.lineID === twoDLine.uuid ) && ( editor.twoDMeasureBadges[i].userData.lineNumber === (markerNumber - 1) ) ) {
                            
                            var startMarker = new THREE.Vector3(lineVertices[ lineVericesLength-6 ],lineVertices[ lineVericesLength-5 ],lineVertices[ lineVericesLength-4 ]) 
                            var endMarker = new THREE.Vector3(lineVertices[ lineVericesLength - 3 ],lineVertices[lineVericesLength - 2],lineVertices[lineVericesLength - 1]) 
                            editor.signals.changeTwoDValues.dispatch(startMarker,endMarker,twoDLine,editor.twoDMeasureBadges[i], markerNumber, true);

                            //Modified to change the end arrow icon w.r.t the new line
                            marker.traverse( function( child ){

                                if( child instanceof THREE.Sprite && child.name === "2DDrawingEndIcon" ) {

                                    var length = twoDLine.geometry.attributes.position.array.length;
                                    var twoDArray = twoDLine.geometry.attributes.position.array;
                                    var lastPoint = new THREE.Vector3( twoDArray[ length - 3 ], twoDArray[ length - 2 ], twoDArray[ length - 1 ] );
                                    var secondLastPoint = new THREE.Vector3( twoDArray[ length - 6 ], twoDArray[ length - 5 ], twoDArray[ length - 4 ] );

                                    var endIcon = editor.getEndArrowIcon(lastPoint,secondLastPoint) ;
                                    
                                    if( endIcon.name != child.userData.textureName ) {
                            
                                        marker.remove( child );
                                        endIcon.needsUpdate = true;
                                        var sprite = new THREE.Sprite( new THREE.SpriteMaterial( { map: endIcon } ) );
                                        sprite.name = "2DDrawingEndIcon";
                                        marker.add(sprite);
                                        sprite.userData.textureName = endIcon.name;
                                        sprite.position.y = 0.60;
                                        sprite.renderOrder = 10;

                                    }
                                    
                                    var twoDArray = twoDLine.geometry.attributes.position.array;
                                    var ArrayLength = twoDArray.length;
                                    var lastPoint = new THREE.Vector3( twoDArray[ ArrayLength - 3 ], twoDArray[ ArrayLength - 2 ], twoDArray[ ArrayLength - 1 ] );
                                    var secondLastPoint = new THREE.Vector3( twoDArray[ ArrayLength - 6 ], twoDArray[ ArrayLength - 5 ], twoDArray[ ArrayLength - 4 ] );

                                    var preMarkerName = 'TwoDMeasureMarker' + (markerNumber - 1);
                                    var preMarker = twoDDrawing.getObjectByName(preMarkerName);

                                    if( preMarker ) {

                                        editor.alignArrowsForPreMarkers(preMarker,lastPoint,secondLastPoint);

                                    }

                                }

                            } )

                        }

                    }

                }
                //Intermediate marker of 2D Line is being dragged
                else {

                    for( var i=0;i<editor.twoDMeasureBadges.length;i++ ) {

                        if( ( editor.twoDMeasureBadges[i].userData.lineID === twoDLine.uuid ) && ( editor.twoDMeasureBadges[i].userData.lineNumber === markerNumber ) ) {

                            var startMarker = new THREE.Vector3(lineVertices[ (markerNumber * 3) - 3 ],lineVertices[ (markerNumber * 3) - 2 ],lineVertices[ (markerNumber * 3) - 1 ]) 
                            var endMarker = new THREE.Vector3(lineVertices[ (markerNumber * 3) ],lineVertices[ (markerNumber * 3) + 1],lineVertices[(markerNumber * 3) + 2]) 
                            editor.signals.changeTwoDValues.dispatch(startMarker,endMarker,twoDLine,editor.twoDMeasureBadges[i], markerNumber, false);

                        }
                        if( ( editor.twoDMeasureBadges[i].userData.lineID === twoDLine.uuid ) && ( editor.twoDMeasureBadges[i].userData.lineNumber === (markerNumber - 1) ) ) {

                            var startMarker = new THREE.Vector3(lineVertices[ ( (markerNumber - 1) * 3) - 3 ],lineVertices[ ((markerNumber - 1) * 3) - 2 ],lineVertices[ ((markerNumber - 1) * 3) - 1 ]) 
                            var endMarker = new THREE.Vector3(lineVertices[ ((markerNumber - 1) * 3) ],lineVertices[ ((markerNumber - 1) * 3) + 1],lineVertices[((markerNumber - 1) * 3) + 2]) 
                            editor.signals.changeTwoDValues.dispatch(startMarker,endMarker,twoDLine,editor.twoDMeasureBadges[i], (markerNumber - 1), false);

                        }

                    }
                    
                    marker.traverse( function( child ) {

                        if( child instanceof THREE.Sprite && child.name === "2DDrawingSgmtEndIcon" ) {

                            var twoDArray = twoDLine.geometry.attributes.position.array;

                            var startPoint = new THREE.Vector3( twoDArray[ (markerNumber * 3) - 6 ], twoDArray[ (markerNumber * 3) - 5 ], twoDArray[ (markerNumber * 3) - 4 ] );

                            var midPoint = new THREE.Vector3( twoDArray[ (markerNumber * 3) - 3 ], twoDArray[ (markerNumber * 3) - 2 ], twoDArray[ (markerNumber * 3) - 1 ] );

                            var segmentEndIcon = editor.getEndArrowIcon(midPoint,startPoint);

                            if( segmentEndIcon.name != child.userData.textureName ) {
                            
                                marker.remove( child );
                                segmentEndIcon.needsUpdate = true;
                                var sprite = new THREE.Sprite( new THREE.SpriteMaterial( { map: segmentEndIcon } ) );
                                sprite.name = "2DDrawingSgmtEndIcon";
                                marker.add(sprite);
                                sprite.userData.textureName = segmentEndIcon.name;
                                sprite.position.y = 0.60;

                                var arrowEndPosition = editor.setArrowPosition( segmentEndIcon.name )
                                sprite.center.copy( arrowEndPosition );
                                sprite.renderOrder = 10;

                                sprite.renderOrder = 10;

                            }

                            var preMarkerName = 'TwoDMeasureMarker' + (markerNumber - 1);
                            var preMarker = twoDDrawing.getObjectByName(preMarkerName);

                            if( preMarker ) {
                                
                                if( preMarker ) {

                                    editor.alignArrowsForPreMarkers(preMarker,midPoint,startPoint);

                                }

                            }

                        }

                        if( child instanceof THREE.Sprite && child.name === "2DDrawingSgmtStartIcon" ) {

                            var twoDArray = twoDLine.geometry.attributes.position.array;

                            var endPoint = new THREE.Vector3( twoDArray[ (markerNumber * 3)  ], twoDArray[ (markerNumber * 3) + 1 ], twoDArray[ (markerNumber * 3) + 2 ] );

                            var midPoint = new THREE.Vector3( twoDArray[ (markerNumber * 3) - 3 ], twoDArray[ (markerNumber * 3) - 2 ], twoDArray[ (markerNumber * 3) - 1 ] );

                            var segmentStartIcon = editor.getStartArrowIcon(midPoint,endPoint);

                            if( segmentStartIcon.name != child.userData.textureName ) {
                            
                                marker.remove( child );
                                segmentStartIcon.needsUpdate = true;
                                var sprite = new THREE.Sprite( new THREE.SpriteMaterial( { map: segmentStartIcon } ) );
                                sprite.name = "2DDrawingSgmtStartIcon";
                                marker.add(sprite);
                                sprite.userData.textureName = segmentStartIcon.name;
                                sprite.position.y = 0.60;

                                var arrowEndPosition = editor.setArrowPosition( segmentStartIcon.name )
                                sprite.center.copy( arrowEndPosition );
                                sprite.renderOrder = 10;

                                sprite.renderOrder = 10;

                            }
                            
                            var postMarkerName = 'TwoDMeasureMarker' + (markerNumber + 1);
                            var postMarker = twoDDrawing.getObjectByName(postMarkerName);

                            if( postMarker ) {
                                
                                if( postMarker ) {

                                    editor.alignArrowsForPostMarker(postMarker,endPoint,midPoint);
                    
                                }

                            }

                        }

                    } )

                }

            }

        }

    },

    /**
     * deActivate() - Deactivates the 2D measurement controls. This will disable the mouse listeners also
     * @returns {Void}
     * @author Peeyush
     * @example <caption>Example usage of deActivate method.</caption>
     * twoDMeasurementControls.deActivate();
     */

    deActivate: function() {

        if( this.twoDMeasureSessionGroup instanceof THREE.Group && this.twoDMeasureSessionGroup.children.length === 0 ){

            editor.scene.remove( this.twoDMeasureSessionGroup );

        }

        if( this.isActive === true && this.endPointsCollected === false ){

            var startMarkerParent = this.connectionLine.polygon.parent;
            if( startMarkerParent ) startMarkerParent.remove( this.connectionLine.polygon );

            for( var i = 0; i < this.edgeMarkers.length; i++ ){

                if( this.edgeMarkers[ i ].parent ) this.edgeMarkers[ i ].parent.remove( this.edgeMarkers[ i ] );

            }

        }

        this.isActive = false;
        editor.scene.remove( this.cursor );
        this.cursor = {};
        this.twoDMeasureSessionGroup = {};
        this.tempBadge = null;
        //this.twoDMeasureSessionGroup = false; //This flag should be setted to false whenever the measurement session is deactivated
        this.sessionGroupAdded = false;

        this.connectionLine.unsetVertices();
        editor.scene.remove( this.connectionLine.polygon );

        this.startPointCollected = false;
        this.endPointsCollected = false;
        this.pointsPicked = 1;
        this.edgeMarkers = [];

        editor.signals.sceneGraphChanged.dispatch();

    },

    updateCamera : function( camera ){

        this.camera = camera;

    },

}