/**
 * MeasurementControls( options, editor ) : Constructor for the point to point measurement controls
 * @constructor
 * @param {Object} options - An object specifying the settings for the measurement controls
 * @param {Object<THREE.PerspectiveCamera>} options.camera - The PerspectiveCamera through which the scene is rendered. Used for mouse picking using raycasting
 * @param {String} options.baseUnit - The measurement system used for designing the 3D model. Default is "meter"
 * @param {Number} options.baseConversionFactor - It defines the value of 1 unit distance in base units for the 3D model. Default is 1. For example, if 1 unit distance in the 3D model correspond to 2 meter in the real object, then the "baseConversionFactor" is 2.
 * @param {Object<Element>} options.areaOfScope - The areaOfScope is an HTML Element where the measurement controls should be effective. The mouse move and mouse click event listeners will be attached to this element.
 * @param {any} editor - The instance of the Editor which manages the overall objects and signals
 * @returns {Void}
 * @author Hari
 * @example <caption>Example usage of MeasurementControls</caption>
 * var view = document.getElementById( 'viewport' ); 
 * var measurementControls = new MeasurementControls( { camera : editor.camera, areaOfScope : view, baseUnit : "meter", baseConversionFactor : 1 }, editor );
 */
var MeasurementControls = function( options, editor ){

    //Core properties
    var scope = this;
    this.camera;
    this.lineMaker;
    this.areaOfScope;
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

    //Flags
    this.isActive = false; //Indicates whether the measurement controls is active or not
    this.startPointCollected = false; //Indicates whether the initial point has been selected or not
    this.endPointsCollected = false; //Indicates whether the end points for measurement has beem selected or not
    this.sessionGroupAdded = false; //Indicates whether the measurement session group has been added to the selected object or not

    //Vectors
    this.mousePosition = THREE.Vector3();
    this.startPoint = THREE.Vector3();
    this.endPoint = THREE.Vector3();

    //Popup window
    this.namePopup = new UI.MobileWindow( 'measure-popup' );
    this.initializePopupWindow();

    //Temporary mouse cursor, direction helper line, measurement group, measurement value badge, markers + line colors
    this.markerColors = [ 0xf441a3, 0x8adeff, 0xeadeff ];
    this.lineColor = 0x42f445;
    this.tempBadge = null;
    this.directionHelper;
    //this.directionHelper = new LineMaker( { style : 'solid', useZBuffer : false } );
    //this.directionHelper.setMaxPoints( 2 );//Commented here
    this.measureSessionGroup;
    this.measurementGroup;
    this.startMarker = null;
    this.measurementName;
    this.selectedMeasurementLine;
    this.selectedMeasurementData;
    this.renderOrder = ( options && options.renderOrder )? options.renderOrder : 10;

    this.cursor;

    if( options != undefined ){

        if( options.areaOfScope != undefined && options.areaOfScope instanceof Element && options.camera != undefined && options.camera instanceof THREE.Camera && options.baseUnit != undefined && options.baseConversionFactor != undefined  ){
            
            this.areaOfScope = options.areaOfScope;
            this.camera = options.camera;
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

            console.warn( "%cMeasurementControls( options ) : Constructor expects an object as argument. \n\"options.areaOfScope\" : HTML Element in which the measurement controls are active.\n\"options.camera:\" instance of THREE.PerspectiveCamera - used for raycasting.\n\"options.baseUnit:\" baseUnit is the measurement system used for the models in the scene(Default is \"meter\"),\n\"baseConversionFactor\"indicates the measurement value in baseUnit corresponding to 1 unit distance in the model.", "color:yellow; background-color:blue; font-style:italic; padding: 2px" );
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
                this.rescaleComponents();
                editor.signals.sceneGraphChanged.dispatch();

            }
            if( this.startPointCollected === true ){

                if( intersects.length > 0 ){
    
                    var cursorPosition = intersects[ 0 ].point.clone();

                    if( editor.isFloorplanViewActive === true ){

                        if( editor.type2dView == 1 ) {

                            cursorPosition.setY( this.startPoint.y );

                        }
                        if( editor.type2dView == 2 ) {
            
                            cursorPosition.setX( this.startPoint.x );

                        }
                        if( editor.type2dView == 3 ) {
            
                            cursorPosition.setX( this.startPoint.x );

                        }
                        if( editor.type2dView == 4 ) {
            
                            cursorPosition.setY( this.startPoint.y );

                        }
                        if( editor.type2dView == 5 ) {
            
                            cursorPosition.setZ( this.startPoint.z );

                        }
                        if( editor.type2dView == 6 ) {
            
                            cursorPosition.setZ( this.startPoint.z );

                        }

                    }

                    this.directionHelper.setEndPoints( this.startPoint, cursorPosition );
    
                    var mid = new THREE.Vector3( ( this.startPoint.x + cursorPosition.x ) / 2, ( this.startPoint.y + cursorPosition.y ) / 2, ( this.startPoint.z + cursorPosition.z ) / 2 );
                    var distance = this.getDistance( this.startPoint, cursorPosition ).toFixed( 1 );

                    var updatedBadge = this.getNumberBadge( { badgeText : distance, badgeWidth : 55, badgeHeight : 55, fontSize : "16px", fontColor : "#500080", strokeColor : "#500080", borderRadius : 7, type : "image" } );

                    if( this.tempBadge instanceof THREE.Sprite ){
                        this.tempBadge.material.map = updatedBadge;
                        this.tempBadge.name = "MeasurementTempBadge";
                    }
                    else if( this.tempBadge === null ){

                        this.tempBadge = new THREE.Sprite( new THREE.SpriteMaterial( {

                            map: updatedBadge,
                            depthWrite : false,
                            depthTest : false
        
                        } ) );
        
                        this.tempBadge.scale.set( 3, 3, 3 );
                        this.tempBadge.name = "MeasurementTempBadge";
                        this.measureSessionGroup.add( this.tempBadge );

                    }

                    this.tempBadge.position.copy( mid );
                    
                    this.rescaleComponents();
                    editor.signals.sceneGraphChanged.dispatch();

                }
    
            }

        }
       
    } );

    this.setMouseClickListener( function( event ){

        var scope = this;
        var boundingRect = this.areaOfScope.getBoundingClientRect();
        if( this.isActive === true ){

            if( this.startPointCollected === false ){

                //Modified here
                this.directionHelper = new LineMaker( { style : 'solid', useZBuffer : false } );
                this.directionHelper.setMaxPoints( 2 );
                this.directionHelper.setEndPoints( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, 0 ) );
                this.directionHelper.line.name = "MeasurementDirectionHelper";

                //editor.scene.add( this.directionHelper.line );//
                this.measureSessionGroup.add( this.directionHelper.line );
                
                editor.signals.sceneGraphChanged.dispatch();

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
                    
                    var markerGeo = new THREE.SphereGeometry( 0.1, 10, -30 );
                    //var markerMat = new THREE.MeshStandardMaterial( { color: this.markerColors[ 0 ], emissive: this.markerColors[ 0 ], depthTest: false, depthWrite: false, side: THREE.DoubleSide } );
                    var markerMat = new THREE.MeshBasicMaterial({
                        wireframe: true,
                        color: this.markerColors[ 0 ]
                    });
                    var marker = new THREE.Mesh( markerGeo, markerMat );
                    //Modified to place markers accordingly in Floorplan views start
                                            
                    if( ( editor.isFloorplanViewActive === true ) && ( ( editor.type2dView == 1 ) || ( editor.type2dView == 4 ) ) ){

                        this.startPoint.setY( 0 );
                        marker.position.copy( this.startPoint );
                        /*
                        if( editor.type2dView == 1 ) {

                            this.startPoint.setY( 0 );
                            marker.position.copy( this.startPoint );

                        }
                        if( editor.type2dView == 2 ) {

                            this.startPoint.setX( 0 );
                            marker.position.copy( this.startPoint );

                        }
                        if( editor.type2dView == 3 ) {
            
                            this.startPoint.setX( 0 );
                            marker.position.copy( this.startPoint );

                        }
                        if( editor.type2dView == 4 ) {
            
                            this.startPoint.setY( 0 );
                            marker.position.copy( this.startPoint );

                        }
                        if( editor.type2dView == 5 ) {
            
                            this.startPoint.setZ( 0 );
                            marker.position.copy( this.startPoint );

                        }
                        if( editor.type2dView == 6 ) {
            
                            this.startPoint.setZ( 0 );
                            marker.position.copy( this.startPoint );

                        } */

                    }
                    //Modified to place markers accordingly in Floorplan views end
                    else{

                        marker.position.copy( this.startPoint );

                    }
                    marker.name = "StartMeasurementMarker"; 
                    //marker.material.depthTest = false;//
                    //marker.material.depthWrite = false;//
                    this.measureSessionGroup.name = "MeasurementSession";
                    this.startMarker = marker;//Making a reference for future use
                    marker.renderOrder = this.renderOrder;
                    this.measureSessionGroup.add( marker );

                    if( editor.isFloorplanViewActive === true ){

                        editor.scaleLengthmarker( scope.startMarker );
    
                    }

                    //Modified to scale the measurement marker according to zoom level start
                    else {
                    
                        editor.scaleLengthmarkerThreeDView( scope.startMarker );
                    
                    }
                    
                    //Modified to scale the measurement marker according to zoom level end

                    editor.signals.sceneGraphChanged.dispatch();

                    this.startPointCollected = true;
                    this.endPointsCollected = false;

                }
                else{

                    //console.log( "No intersection!" );

                }

            }
            else if( this.startPointCollected === true ){

                var cursorPosition = new THREE.Vector3( ( ( event.clientX - boundingRect.left) / this.areaOfScope.offsetWidth ) * 2 - 1, -( ( event.clientY - boundingRect.top ) / this.areaOfScope.offsetHeight ) * 2 + 1, 0.5 );
                this.mousePosition = cursorPosition;
                
                //Raycasting and mouse picking point of interest
                this.raycaster.setFromCamera( this.mousePosition, this.camera );
                var intersects = this.raycaster.intersectObjects( editor.sceneObjects );
                if( intersects.length > 0 ){

                    this.endPoint = intersects[ 0 ].point.clone();
                    
                    //var markerGeo = new THREE.SphereGeometry( 0.1, 30, 2 ); Commented here
                    var markerGeo = new THREE.SphereGeometry( 0.1, 10, -30 );
                    //var markerMat = new THREE.MeshStandardMaterial( { color: this.markerColors[ 0 ], emissive: this.markerColors[ 0 ], depthTest: false, depthWrite: false, side: THREE.DoubleSide } );
                    var markerMat = new THREE.MeshBasicMaterial({
                        wireframe: true,
                        color: this.markerColors[ 0 ]
                    });
                    var marker = new THREE.Mesh( markerGeo, markerMat );
                    //Modified for height adjustment in Floorplan view start

                     //this.endPoint.setY( scope.startPoint.y );   
                        
                    if( editor.isFloorplanViewActive === true ){

                        if( editor.type2dView == 1 ) {

                            //this.endPoint.setY( this.startPoint.y );
                            this.endPoint.setY( 0 );

                        }
                        if( editor.type2dView == 2 ) {
                            
                            this.endPoint.setX( this.startPoint.x );
                            //this.endPoint.setX( 0 );

                        }
                        if( editor.type2dView == 3 ) {
                            
                            this.endPoint.setX( this.startPoint.x );
                            //this.endPoint.setX( 0 );

                        }
                        if( editor.type2dView == 4 ) {
            
                            this.endPoint.setY( 0 );

                        }
                        if( editor.type2dView == 5 ) {
                            
                            this.endPoint.setZ( this.startPoint.z );
                            //this.endPoint.setZ( 0 );

                        }
                        if( editor.type2dView == 6 ) {
                            
                            this.endPoint.setZ( this.startPoint.z );
                            //this.endPoint.setZ( 0 );

                        }

                    }
                    //Modified for height adjustment in Floorplan view end
                    marker.position.copy( this.endPoint );
                    marker.name = "EndMeasurementMarker";
                    marker.renderOrder = this.renderOrder;
                    //marker.material.depthTest = false;//
                    //marker.material.depthWrite = false;//
                    if( editor.isFloorplanViewActive === true ){

                        editor.scaleLengthmarker( marker );
    
                    } else {
                    
                        editor.scaleLengthmarkerThreeDView( marker );
                    
                    }

                    //Modified here
                    //editor.scene.remove( this.directionHelper.line );//
                    var directionHlprParent = this.directionHelper.line.parent;
                    if( directionHlprParent ) directionHlprParent.remove( this.directionHelper.line );//

                    var connectionLine = new LineMaker( { style : 'solid', color: this.lineColor, useZBuffer : false } );
                    connectionLine.setMaxPoints( 2 );
                    connectionLine.setEndPoints( this.startPoint, this.endPoint );
                    connectionLine.line.name = "MeasurementConnectionLine";

                    //connectionLine.line.material.depthTest = false;//
                    //connectionLine.line.material.depthWrite = false;//

                    connectionLine.line.matrixAutoUpdate = false; //Set this flag to false to prevent the position change
                    //this.measureSessionGroup.add( connectionLine.line );//commented here

                    this.curMeasurement = this.getDistance( this.startPoint, this.endPoint ).toFixed( 1 );
                    var badgeLabelText;
                    if( this.targetUnit === "meter" ) badgeLabelText = this.curMeasurement + " m";
                    else if(  this.targetUnit === "feet"  ) badgeLabelText = this.curMeasurement + " ft";
                    
                    var curMeasurementBadge = this.getNumberBadge( { badgeText : badgeLabelText, badgeWidth : 55, badgeHeight : 55, fontSize : "16px", fontColor : "#0f590b", strokeColor : "#0f590b", borderRadius : 8 } );
                    
                    curMeasurementBadge.position.copy( new THREE.Vector3( ( this.startPoint.x + this.endPoint.x ) / 2, ( this.startPoint.y + this.endPoint.y ) / 2, ( this.startPoint.z + this.endPoint.z ) / 2 ) );
                    
                    curMeasurementBadge.name = "MeasureValueBadge";
                    this.measureSessionGroup.remove( this.tempBadge );
                    this.tempBadge = null;

                    //Attaching all the edge markers and value badge to the connection line
                    connectionLine.line.add( curMeasurementBadge );
                    connectionLine.line.add( marker );
                    connectionLine.line.add( this.startMarker );
                    
                    //
                    editor.execute( new AddObjectCommand( connectionLine.line ) );//
                    editor.deselect();//
                    //Changing the parent of the connectionLine to the object group without recalculating the world position
                    THREE.SceneUtils.attach( connectionLine.line, editor.scene, this.measureSessionGroup );//
                    //

                    //Modified to scale the measurement badge and end marker according to zoom level start
                    if( editor.isFloorplanViewActive === true ){

                        editor.scaleBadgeFloorPlanView( curMeasurementBadge );

                    }
                    else{

                        editor.scaleBadgesThreeDView( curMeasurementBadge );
                        
                    }
                    //Modified to scale the measurement badge and end marker according to zoom level end

                    //Modified start
                    this.measrementHeight = ( this.startMarker.position.y ) * this.targetConversionFactor;
                    //Modified end

                    this.startMarker = null;

                    editor.signals.sceneGraphChanged.dispatch();

                    this.startPointCollected = false;
                    this.endPointsCollected = true;

                    this.selectedMeasurementLine = connectionLine.line;

                    //var screenPos = this.toScreenPosition( curMeasurementBadge, editor.camera );
                    //var screenPos = { x: event.clientX, y: event.clientY };
                    var view = document.getElementById( 'viewport' );
                    var widthHalf = 0.5 * view.offsetWidth;
                    var heightHalf = 0.5 * view.offsetHeight;
                    var screenPos = { x: widthHalf, y: heightHalf };
                    this.namePopup.dom.style.left = screenPos.x + "px";
                    this.namePopup.dom.style.top = screenPos.y + "px";
                    this.namePopup.nameInputField.value = "";

                    this.isActive = false;

                    this.namePopup.show();

                }
                else{

                    //console.log( "No intersection!" );

                }

            }

        }

    } );

    return this;

}

MeasurementControls.prototype = {

    constructor : MeasurementControls,

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
        this.targetConversionFactor = ( this.conversionFactors[ this.baseUnit ][ this.targetUnit ] ) * this.baseConversionFactor;

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
        this.cursor.name = "MeasurementCursor";
        editor.scene.add( this.cursor );

        //Commented here
        //this.directionHelper = new LineMaker( { style : 'solid', useZBuffer : false } );//
        //this.directionHelper.setEndPoints( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, 0 ) );

        //this.directionHelper.line.material.depthTest = false;//
        //this.directionHelper.line.material.depthWrite = false;//
        //this.directionHelper.line.material.needsUpdate = true;
        //this.directionHelper.line.name = "MeasurementDirectionHelper";

        //editor.scene.add( this.directionHelper.line );//
        //this.measureSessionGroup.add( this.directionHelper.line );
        
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

        if( this.startPointCollected === true && this.endPointsCollected === false ){

            var startMarkerParent = this.startMarker.parent;
            var tempBadgeParent = this.tempBadge.parent;
            if( startMarkerParent ) startMarkerParent.remove( this.startMarker );
            if( tempBadgeParent ) tempBadgeParent.remove( this.tempBadge );

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

        this.startPointCollected = false;
        this.endPointsCollected = false;

        //Commented here
        //editor.scene.remove( this.directionHelper.line );//
        //var directionHlprParent = this.directionHelper.line.parent;
        //if( directionHlprParent ) directionHlprParent.remove( this.directionHelper.line );//

        editor.signals.sceneGraphChanged.dispatch();

    },

    /**
     * getDistance( start, end ) - Calculates the distance between two points and converts it based on the base unit, conversion factor and target unit
     * @param {Object<THREE.Vector3>} start - The point from which the measurement should be started
     * @param {Object<THREE.Vector3>} end - The point to which the measurement should be performed
     * @returns {Number} - Returns the converted distance in target units
     * @author Hari
     * @example <caption>Example usage of getDistance method.</caption>
     * measurementControls.getDistance( new THREE.Vector3( 0, 10, 0 ), new THREE.Vector3( 0, 20, 0 ) );
     * // returns 20 meter ( given baseUnit as meter and conversion factor as 2 )
     */
    getDistance : function( start, end ){

        return ( this.targetConversionFactor * ( start.distanceTo( end ) ) );

    },

    /**
     * rescaleComponents() - Rescales the measurement temporary badge and markers based on current zoom level
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of rescaleComponents method.</caption>
     * measurementControls.rescaleComponents();
     */
    rescaleComponents : function(){

        if( this.tempBadge ){

            editor.reScaleTemporaryBadge( this.tempBadge );

        }
        if( this.cursor instanceof THREE.Mesh ){

            if( editor.isFloorplanViewActive === true ){

                //editor.scaleLengthmarker( this.cursor );
                editor.scaleCursorFloorPlanView( this.cursor );

            }
            else{

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
        msrPopupBody.setAttribute( 'id', 'measure-popup-body-div' );

        var nameSection = document.createElement( 'div' );
        nameSection.setAttribute( 'class', 'measure-name-div' );

        var nameFrmGrp = document.createElement( 'div' );
        nameFrmGrp.setAttribute( 'class', 'form-group' );
        nameFrmGrp.setAttribute( 'id', 'popup-form-group' );

        var nameId = "name_field_" + Date.now();
        var nameLabel = document.createElement( 'label' );
        nameLabel.setAttribute( 'for', nameId );
        nameLabel.innerHTML = editor.languageData.Labelforthemeasurement ;
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
        footerDiv.setAttribute( 'id', 'measure-popup-footer-div' );
        footerDiv.setAttribute( 'class', 'pull-right' );

        var measureSaveBtn = document.createElement( 'button' );
        measureSaveBtn.setAttribute( 'class', 'btn btn-success btn-xs left-right-margin' );
        measureSaveBtn.setAttribute( 'id', 'measure-popup-footer-save-btn' );
        measureSaveBtn.innerHTML = '<span class="fa fa-floppy-o">' + editor.languageData.Save + '</span>';

        var measureDeleteBtn = document.createElement( 'button' );
        measureDeleteBtn.setAttribute( 'class', 'btn btn-danger btn-xs left-right-margin' );
        measureDeleteBtn.setAttribute( 'id', 'measure-popup-footer-delete-btn' );
        measureDeleteBtn.innerHTML = '<span class="fa fa-trash-o">' + editor.languageData.Delete+ '</span>';

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

            if( editor.scene.userData.measurementDatas === undefined ){

                editor.scene.userData.measurementDatas = {};

            }

            var labelInputLower = nameInput.value.toLowerCase();
            for( var key in editor.scene.userData.measurementDatas ){

                if( labelInputLower === editor.scene.userData.measurementDatas[ key ].label.toLowerCase() ){

                    toastr.warning( editor.languageData.AmeasurementwithgivenlabelalreadyexistsPleasetryanotherlabelName );
                    return;

                }

            }

            try{

                var data = {};
                data.label = nameInput.value;
                data.start = scope.startPoint;
                data.end = scope.endPoint;
                data.measurement = scope.curMeasurement;
                data.unit = scope.targetUnit;
                //Modified start
                data.elevation = scope.measrementHeight;
                //Modified end
                data.badgeLabel = ( scope.targetUnit === "meter" )? ( scope.curMeasurement + "m" ) : ( scope.targetUnit === "feet" )? ( scope.curMeasurement + "ft" ) : ( scope.curMeasurement + scope.targetUnit );
                editor.scene.userData.measurementDatas[ scope.selectedMeasurementLine.uuid ] = data;
                scope.namePopup.hide();
                toastr.success( editor.languageData.Successfullyaddedmeasurementdata );

                var measuredData = {};
                measuredData.lineUuid = scope.selectedMeasurementLine.uuid;
                measuredData.label = nameInput.value;
                measuredData.start = scope.startPoint;
                measuredData.end = scope.endPoint;
                measuredData.measurement = scope.curMeasurement;
                measuredData.unit = scope.targetUnit;
                //Modified start
                measuredData.elevation = scope.measrementHeight;
                //Modified end

                scope.selectedMeasurementLine.traverse( function( subChild ){

                    if( subChild instanceof THREE.Sprite && subChild.name === "MeasureValueBadge" ){

                        editor.lengthBadges.push( subChild );

                    }
                    else if( subChild instanceof THREE.Mesh && ( subChild.name === "StartMeasurementMarker" || subChild.name === "EndMeasurementMarker" ) ){

                        editor.lengthEndMarkers.push( subChild );

                    }
    
                } );

                scope.isActive = true;
                scope.startPointCollected = false;
                scope.endPointsCollected = false;

                editor.signals.newMeasurementAdded.dispatch( measuredData );

            }
            catch( error ){

                scope.namePopup.hide();
                toastr.error(  editor.languageData.SorrysomethingwentwrongPleasetryagainaftersometime );
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
                toastr.success(  editor.languageData.Measurementdataremoved );

                scope.isActive = true;
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