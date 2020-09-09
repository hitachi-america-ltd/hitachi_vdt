
/**
 * NetworkCableDesigner( options, editor ) : Constructor for network cable designing
 * @constructor
 * @param {Object} options - An object specifying the settings for the networkCableDesigner controls
 * @param {Object<THREE.PerspectiveCamera>} options.camera - The PerspectiveCamera through which the scene is rendered. Used for mouse picking using raycasting
 * @param {Object<Element>} options.areaOfScope - The areaOfScope is an HTML Element where the measurement controls should be effective. The mouse move and mouse click event listeners will be attached to this element.
 * @param {any} editor - The instance of the Editor which manages the overall objects and signals
 * @returns {Object}
 * @author Hari
 * @example <caption>Example usage of NetworkCableDesigner</caption>
 * var view = document.getElementById( 'viewport' ); 
 * var networkCableDesigner = new NetworkCableDesigner( { camera : editor.camera, areaOfScope : view }, editor );
 */


var NetworkCableDesigner = function( options, editor ){

    //Core properties
    var scope = this;
    this.camera;
    this.areaOfScope;
    this.raycaster = new THREE.Raycaster();
    this.mouseClickListener;
    this.mouseMoveListener;
    this.rightClickListener;
    this.renderOrder = ( options && options.renderOrder )? options.renderOrder : 10;

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
    //

    //Flags
    this.isActive = false; //Indicates whether the measurement controls is active or not
    this.startPointCollected = false; //Indicates whether the initial point has been selected or not
    this.endPointsCollected = false; //Indicates whether the end points for measurement has beem selected or not
    this.sessionGroupAdded = false; //Indicates whether the measurement session group has been added to the selected object or not

    //Vectors
    this.mousePosition = THREE.Vector3();
    //this.startPoint = THREE.Vector3();
    //this.intmdtPoint = THREE.Vector3();
    //this.endPoint = THREE.Vector3();

    //Temporary mouse cursor, direction helper line, measurement group, measurement value badge, markers + line colors
    this.markerColors = [ 0x76f441, 0x8adeff, 0xeadeff ];
    this.cableColor = 0x42a4f4;
    this.badgeFontColor = "#0b0c5b";
    this.badgeStrokeColor = "#0b0c5b";
    this.edgeMarkers = [];

    this.networkCable;// = new PolygonDrawer( { color : this.cableColor, vertexCount : 2, useZBuffer : false } );

    this.cablingSessionGroup;
    this.cablingGroup;
    this.startMarker = null;
    this.cableName;
    this.selectedNetworkCable = null;
    this.estimatedCableLength = 0;
    //this.selectedMeasurementData;
    //this.pointsPicked = 1;

    this.uiComponents = { 
        
        "propertiesWindow" : {},

    }

    this.cursor;

    if( options != undefined ){

        if( options.areaOfScope != undefined && options.areaOfScope instanceof Element && options.camera != undefined && options.camera instanceof THREE.Camera ){
            
            this.areaOfScope = options.areaOfScope;
            this.camera = options.camera;

        }
        else{

            console.warn( "%c NetworkCableDesigner( options ) : Constructor expects an object as argument. \n\"options.areaOfScope\" : HTML Element in which the measurement controls are active.\n\"options.camera:\" instance of THREE.PerspectiveCamera - used for raycasting.\n", "color:yellow; background-color:blue; font-style:italic; padding: 2px" );
            return;
            
        }

    }
    else{

        console.warn( "%c NetworkCableDesigner( options ) : Constructor expects an object as argument. \n\"options.areaOfScope\" : HTML Element in which the measurement controls are active.\n\"options.camera:\" instance of THREE.PerspectiveCamera - used for raycasting.\n", "color:yellow; background-color:blue; font-style:italic; padding: 2px" );
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

                /*if( this.startPointCollected === true && this.endPointsCollected === false ){

                        var cursorPosition = intersects[ 0 ].point.clone();
                        //this.networkCable.pushVertex( this.pointsPicked, [ cursorPosition.x, cursorPosition.y, cursorPosition.z ] );
        
                }*/
                this.rescaleComponents();
                editor.signals.sceneGraphChanged.dispatch();

            }

        }
       
    } );

    this.setMouseClickListener( function( event ){

        var scope = this;
        var boundingRect = this.areaOfScope.getBoundingClientRect();
        
        if( this.isActive === true ){
    
            var cursorPosition = new THREE.Vector3( ( ( event.clientX - boundingRect.left) / this.areaOfScope.offsetWidth ) * 2 - 1, -( ( event.clientY - boundingRect.top ) / this.areaOfScope.offsetHeight ) * 2 + 1, 0.5 );
            this.mousePosition = cursorPosition;
            
            //Raycasting and mouse picking point of interest
            this.raycaster.setFromCamera( this.mousePosition, this.camera );
            var intersects = this.raycaster.intersectObjects( editor.sceneObjects );
            if( intersects.length > 0 ){

                var pickedPoint = intersects[ 0 ].point.clone();

                if( this.startPointCollected === false ){
                    
                    this.startPointCollected = true;
                    this.endPointsCollected = false;
                    //this.selectedNetworkCable = this.networkCable.getPolygon();
                    toastr.info( editor.languageData.SourceisPicked );
                }

                if( this.sessionGroupAdded === false ){

                    var pickedObject = intersects[ 0 ].object; 
                    while( !( pickedObject.parent instanceof THREE.Scene ) ){

                        pickedObject = pickedObject.parent;

                    }
                    //Now pickedObject is the object group
                    this.cablingSessionGroup.matrixAutoUpdate = false; //Set this flag to false to prevent the position change of the group
                    //Changing the parent of the cablingSessionGroup to the object group without recalculating the world position
                    THREE.SceneUtils.attach( this.cablingSessionGroup, editor.scene, pickedObject );

                    this.sessionGroupAdded = true; //Set this flag to true to indicate that the measurement session has been added to the object

                }

                this.cablingSessionGroup.name = "NetworkCablingSession";

                this.networkCable.addVertex( new THREE.Vector3( pickedPoint.x, pickedPoint.y, pickedPoint.z ) );
                editor.deselect();
                editor.signals.sceneGraphChanged.dispatch();

            }
            else{

                //console.log( "No intersection!" );

            }
    
        }
    
    } );

    this.setRightClickListener( function( event ){

        var stopCabling = function(){

            this.endPointsCollected = true;
            
            var completedCable = this.networkCable.getPolygon();
            completedCable.name = "NetworkingCable";

            //var edgesLen = this.edgeMarkers.length;
            var totalVerticesCount = ( completedCable.geometry.attributes.position.array.length / 3 ) / 2;
            
            //for( var i = 0; i < edgesLen; i++ ){
            for( var i = 0; i < totalVerticesCount; i++ ){

                //completedCable.add( this.edgeMarkers[ i ] );

                //var markerGeo = new THREE.SphereGeometry( 0.1, 8, 6 );
                //var markerMat = new THREE.MeshStandardMaterial( { color: this.markerColors[ 0 ], emissive: this.markerColors[ 0 ], depthTest: false, depthWrite: false, side: THREE.DoubleSide } );
                var markerGeo = new THREE.SphereGeometry( 0.1, 10, -30 );
                var markerMat = new THREE.MeshBasicMaterial({
                    wireframe: true,
                    color: this.markerColors[ 0 ]
                });
                var marker = new THREE.Mesh( markerGeo, markerMat );
                marker.name = "NetworkMarker" + ( i + 1 );
                marker.position.copy( this.networkCable.getVertex( i + 1 ) );
                marker.renderOrder = this.renderOrder;

                if( editor.isFloorplanViewActive === true ){

                    editor.scaleLengthmarker( marker );

                } else{

                    editor.scaleLengthmarkerThreeDView( marker );

                }
                
                //Modified to add start and end marker icons start
                if( editor.nwStartMarkerIcon != null && editor.nwEndMarkerIcon != null ){

                    if( i === 0 ){

                        var startIcon = editor.nwStartMarkerIcon.clone();
                        startIcon.needsUpdate = true;
                        var sprite = new THREE.Sprite( new THREE.SpriteMaterial( { map: startIcon } ) );
                        sprite.name = "NetworkStartMarkerIcon";
                        //sprite.scale.set( 3, 3, 3 );
                        sprite.position.copy( marker.position );
                        sprite.position.y += 1.25;
                        //marker.add( sprite );
                        THREE.SceneUtils.attach( sprite, editor.scene, marker );
                        sprite.position.y = 0.60;

                    }

                }
                //Modified to add start and end marker icons end

                completedCable.add( marker );

            }

            this.estimatedCableLength = this.getCableLength( completedCable, 30 );
            var badgeLabelText = this.estimatedCableLength.length + ( ( this.targetUnit === "meter" )? "m" : "ft" );
            var curLengthBadge = this.getNumberBadge( { badgeText : badgeLabelText, badgeWidth : 125, badgeHeight : 35, fontSize : "16px", fontColor : this.badgeFontColor, strokeColor : this.badgeStrokeColor, borderRadius : 8 } );
            
            var vLen = completedCable.geometry.attributes.position.array.length,
            verticesArray = completedCable.geometry.attributes.position.array;
            var lastVertexPos = new THREE.Vector3( verticesArray[ vLen - 3 ], verticesArray[ vLen - 2 ] + 0.8, verticesArray[ vLen - 1 ] );
            curLengthBadge.position.copy( lastVertexPos );
            curLengthBadge.name = "NetworkCableLengthBadge";
            completedCable.add( curLengthBadge );
            this.cablingSessionGroup.matrixAutoUpdate = false;
            completedCable.matrixAutoUpdate = false;
            editor.execute( new AddObjectCommand( completedCable ) );           
            THREE.SceneUtils.attach( completedCable, editor.scene, this.cablingSessionGroup );

            //Modified to scale the network badge according to zoom level start
            if( editor.isFloorplanViewActive === true ){

                editor.scaleBadgeFloorPlanView( curLengthBadge );

            }
            else{

                editor.scaleBadgesThreeDView( curLengthBadge );
                
            }
            //Modified to scale the network badge according to zoom level end
            
            this.endPointsCollected = true;
            this.startPointCollected = false;
            //this.networkCable.unsetVertices();
            this.networkCable.setGeometry( new THREE.Geometry() );
            this.edgeMarkers = [];
            
            this.selectedNetworkCable = completedCable;

            this.isActive = false;
            var currentLineColor = this.selectedNetworkCable.material.uniforms.color.value.getHexString();
            document.getElementById( "cable-properties-color-input" ).value = "#" + currentLineColor;
            
            //
            var bBox = new THREE.Box3();
            bBox.setFromObject( completedCable.parent.parent );
            var actualGeom = this.networkCable.getActualGeometry( completedCable );
            var actualVertices = actualGeom.vertices;
            var yCoords = [], verLen = actualVertices.length;
            for( var i = 0; i < verLen; i++ ){

                yCoords.push( actualVertices[ i ].y );
                
            }
            var maximumYCoord = Math.max( ...yCoords );
            var maxCurrentCableHeight = maximumYCoord - bBox.min.y;
            var maxYInTargetUnit = ( maxCurrentCableHeight * this.conversionFactors[ this.baseUnit ][ this.targetUnit ] ).toFixed( 1 );
            document.getElementById( "cable-properties-height-of-wires-input" ).value = maxYInTargetUnit;
            document.getElementById( "cable-properties-height-of-wires-unit-input" ).value = this.targetUnit;
            //

            this.uiComponents.propertiesWindow.show();
            editor.deselect();

        }

        var removeLastVertex = function(){

            this.networkCable.popVertex();
            var vertexCount = this.networkCable.getNumberOfVertices( this.networkCable.polygon );
            if( vertexCount === 0 ){
                this.startPointCollected = false;
            }
            editor.signals.sceneGraphChanged.dispatch();

        }

        if( this.isActive === true ){

            var criteria = ( !editor.theatreMode && !editor.isMeasuring && !editor.isAreaMeasuring && !editor.lengthShowHideToggle && !editor.areaShowHideToggle && this.isActive );
            var curCableVerticesLen = this.networkCable.getNumberOfVertices();

            if( criteria ){

                var stopCallBack = stopCabling.bind( this );
                var undoVertexCallBack = removeLastVertex.bind( this );
                var items = [];

                if( curCableVerticesLen === 0 ){
                    return;
                }   
                if( curCableVerticesLen > 1 ){
                    
                    items.push( {
                        
                        title: editor.languageData.FinishCurrent, 
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
       
    } );

    this.initializeUiComponents();
    return this;

}

NetworkCableDesigner.prototype = {

    constructor : NetworkCableDesigner,

    /**
     * setBaseUnit( unit, conversionFactor ) - Method to set the base unit of the measurement controls
     * @param {String} unit - The measurement system to use for the measurement controls
     * @param {Number} conversionFactor - Defines the equivalent distance in the original object in base units corresponding to unit distance in the 3D model.
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of setBaseUnit method. Here 1 unit distance in the 3D model equals 2 feet in the actual object.</caption>
     * networkCableDesigner.setBaseUnit( "feet", 2 );
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
     * networkCableDesigner.setTargetUnit( "feet" );
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
     * getCableLength( cable, allowancePercent ) - Returns cable length based on the base unit, conversion factor and target unit
     * @param {Object<THREE.Line>} cable - The cable whose length should be calculated
     * @param {Number} allowancePercent - The tolerance percentage for the cable length
     * @returns {Object} - Returns the calculated length in target units
     * @author Hari
     * @example <caption>Example usage of getCableLength method.</caption>
     * networkCableDesigner.getCableLength( cable, allowancePercent );
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
     * initializeUiComponents() - Creates a window for saving the network cable along with its properties
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of initializeUiComponents method.</caption>
     * networkCableDesigner.initializeUiComponents();
     */

    initializeUiComponents: function(){

        var scope = this;
        this.uiComponents.propertiesWindow = new UI.MobileWindow( 'network-properties-popup' );

        this.uiComponents.propertiesWindow.headerCloseBtn.disabled = true;
        this.uiComponents.propertiesWindow.headerCloseBtn.style.display = "none";
        this.uiComponents.propertiesWindow.setHeading( editor.languageData.CableProperties );

        //Body
        var bodyContainer = document.createElement( 'div' );
        bodyContainer.id = "cable-properties-body";

        var labelContainer = document.createElement( 'div' );
        labelContainer.id = "cable-properties-label";
        labelContainer.className = "form-group form-group-sm";

        var cableLabel = document.createElement( 'label' );
        cableLabel.setAttribute( 'for', 'cable-properties-label-input' );
        cableLabel.innerHTML = editor.languageData.cbleLabel + ": ";
        labelContainer.appendChild( cableLabel );

        var cableLabelInput = document.createElement( 'input' );
        cableLabelInput.setAttribute( 'type', 'text' );
        cableLabelInput.className = "form-control input-sm";
        cableLabelInput.id = "cable-properties-label-input";
        labelContainer.appendChild( cableLabelInput );

        bodyContainer.appendChild( labelContainer );
        //

        //
        var numOfWiresContainer = document.createElement( 'div' );
        numOfWiresContainer.id = "cable-properties-num-wires";
        numOfWiresContainer.className = "form-group form-group-sm";

        var cableNumWiresLabel = document.createElement( 'label' );
        cableNumWiresLabel.setAttribute( 'for', 'cable-properties-num-wires-input' );
        cableNumWiresLabel.innerHTML = editor.languageData.NumberofWires + ": ";
        numOfWiresContainer.appendChild( cableNumWiresLabel );

        var cableNumWiresInput = document.createElement( 'input' );
        cableNumWiresInput.setAttribute( 'type', 'text' );
        cableNumWiresInput.setAttribute( 'value', '1' );
        cableNumWiresInput.className = "form-control input-sm";
        cableNumWiresInput.id = "cable-properties-num-wires-input";
        numOfWiresContainer.appendChild( cableNumWiresInput );
        bodyContainer.appendChild( numOfWiresContainer );

        var cableTypeContainer = document.createElement( 'div' );
        cableTypeContainer.id = "cable-properties-type";
        cableTypeContainer.className = "form-group form-group-sm";

        var cableType = document.createElement( 'label' );
        cableType.setAttribute( 'for', 'cable-properties-type-input' );
        cableType.innerHTML = editor.languageData.CableType + ": ";
        cableTypeContainer.appendChild( cableType );

        var cableTypeInput = document.createElement( 'select' );
        cableTypeInput.className = "form-control input-sm";
        cableTypeInput.id = "cable-properties-type-input";
        
        var typesLen = editor.nwCableTypes.length;
        for( var i = 0; i < typesLen; i++ ){

            var opt = document.createElement( 'option' );
            opt.value = editor.nwCableTypes[ i ];
            opt.innerHTML = editor.nwCableTypes[ i ];
            cableTypeInput.appendChild( opt );

        }
        cableTypeContainer.appendChild( cableTypeInput );
        bodyContainer.appendChild( cableTypeContainer );
        //

        //
        var cableApplicationContainer = document.createElement( 'div' );
        cableApplicationContainer.id = "cable-properties-applcn";
        cableApplicationContainer.className = "form-group form-group-sm";

        var cableAppLabel = document.createElement( 'label' );
        cableAppLabel.setAttribute( 'for', 'cable-properties-applcn-input' );
        cableAppLabel.innerHTML = editor.languageData.Application + ": ";
        cableApplicationContainer.appendChild( cableAppLabel );

        var cableAppInput = document.createElement( 'select' );
        cableAppInput.className = "form-control input-sm";
        cableAppInput.id = "cable-properties-applcn-input";
        
        var applcnsLen = editor.nwCableApplications.length;
        for( var i = 0; i < applcnsLen; i++ ){

            var opt = document.createElement( 'option' );
            opt.value = editor.nwCableApplications[ i ];
            opt.innerHTML = editor.nwCableApplications[ i ];
            cableAppInput.appendChild( opt );

        }
        cableApplicationContainer.appendChild( cableAppInput );
        bodyContainer.appendChild( cableApplicationContainer );
        //

        //
        var colorContainer = document.createElement( 'div' );
        colorContainer.id = "cable-properties-color";
        colorContainer.className = "form-group form-group-sm";

        var cableColor = document.createElement( 'label' );
        cableColor.setAttribute( 'for', 'cable-properties-color-input' );
        cableColor.innerHTML = editor.languageData.Color + ": ";
        colorContainer.appendChild( cableColor );

        var cableColorInput = document.createElement( 'input' );
        cableColorInput.setAttribute( 'type', 'color' );
        cableColorInput.setAttribute( 'value', '#981de2' );
        cableColorInput.className = "form-control input-sm";
        cableColorInput.id = "cable-properties-color-input";
        colorContainer.appendChild( cableColorInput );

        cableColorInput.addEventListener( 'change', function( event ){

            var newColor = new THREE.Color( this.value );
            scope.selectedNetworkCable.material.uniforms.color.value = newColor;
            scope.selectedNetworkCable.material.needsUpdate = true;
            editor.signals.sceneGraphChanged.dispatch();

        } );

        bodyContainer.appendChild( colorContainer );

        //Height section
        var heightOfWiresContainer = document.createElement( 'div' );
        heightOfWiresContainer.id = "cable-properties-height-of-wires";
        heightOfWiresContainer.className = "row form-group form-group-sm";

        /*var heightInfoContainer = document.createElement( 'div' );
        heightInfoContainer.className = "col col-sm-12 text-center";
        var heightInfoSpan = document.createElement( 'span' );
        heightInfoSpan.innerHTML = "Height of the cable from the floor";
        heightInfoContainer.appendChild( heightInfoSpan );
        heightOfWiresContainer.appendChild( heightInfoContainer );*/

        var heightLabelContainer = document.createElement( 'div' );
        heightLabelContainer.setAttribute( "style", "padding-right: 1px !important;" );
        heightLabelContainer.className = "col col-sm-6";

        var cableHeightOfWiresLabel = document.createElement( 'label' );
        cableHeightOfWiresLabel.setAttribute( 'for', 'cable-properties-height-of-wires-input' );
        cableHeightOfWiresLabel.innerHTML = editor.languageData.Height + ": ";
        //heightOfWiresContainer.appendChild( cableHeightOfWiresLabel );
        heightLabelContainer.appendChild( cableHeightOfWiresLabel );

        var cableHeightOfWiresInput = document.createElement( 'input' );
        cableHeightOfWiresInput.setAttribute( 'type', 'number' );
        cableHeightOfWiresInput.setAttribute( 'value', '' );
        cableHeightOfWiresInput.className = "form-control input-sm";
        cableHeightOfWiresInput.id = "cable-properties-height-of-wires-input";
        //heightOfWiresContainer.appendChild( cableHeightOfWiresInput );
        heightLabelContainer.appendChild( cableHeightOfWiresInput );

        //Unit
        var heightUnitContainer = document.createElement( 'div' );
        heightUnitContainer.setAttribute( "style", "padding-left: 1px !important;" );
        heightUnitContainer.className = "col col-sm-6";

        var unitLabel = document.createElement( 'label' );
        unitLabel.setAttribute( 'for', 'cable-properties-height-of-wires-unit-input' );
        unitLabel.innerHTML = editor.languageData.Unit + ": ";
        //heightOfWiresContainer.appendChild( unitLabel );
        heightUnitContainer.appendChild( unitLabel );

        var unitInput = document.createElement( 'select' );
        unitInput.setAttribute( 'value', 'feet' );
        unitInput.className = "form-control input-sm";
        unitInput.id = "cable-properties-height-of-wires-unit-input";

        var unitOptFeet = document.createElement( 'option' );
        unitOptFeet.value = "feet";
        unitOptFeet.innerHTML = "feet";

        var unitOptMeter = document.createElement( 'option' );
        unitOptMeter.value = "meter";
        unitOptMeter.innerHTML = "meter";

        unitInput.appendChild( unitOptFeet );
        unitInput.appendChild( unitOptMeter );

        //heightOfWiresContainer.appendChild( unitInput );
        heightUnitContainer.appendChild( unitInput );

        //
        heightOfWiresContainer.appendChild( heightLabelContainer );
        heightOfWiresContainer.appendChild( heightUnitContainer );

        var heightInfoContainer = document.createElement( 'div' );
        heightInfoContainer.className = "col col-sm-12";
        var heightInfoSpan = document.createElement( 'span' );
        heightInfoSpan.id = "cable-properties-height-info-span";
        heightInfoSpan.innerHTML = editor.languageData.SpecifytheHeightFortheCableFromTheFloor + "<br>" + editor.languageData.MaxHeightValueofthePickedPointsisAutomaticallyFilledontheInputField;
        heightInfoContainer.appendChild( heightInfoSpan );
        heightOfWiresContainer.appendChild( heightInfoContainer );

        bodyContainer.appendChild( heightOfWiresContainer );

        //footer
        var footerContainer = document.createElement( 'div' );
        footerContainer.id = "cable-properties-footer";
        footerContainer.className = "pull-right";

        var cablePropertiesSuccessBtn = document.createElement( 'button' );
        cablePropertiesSuccessBtn.id = "cable-properties-success-button";
        cablePropertiesSuccessBtn.className = "btn btn-success btn-xs";
        cablePropertiesSuccessBtn.innerHTML = "<span class='fa fa-floppy-o'> <strong>" + editor.languageData.Save + "</strong></span>";
        footerContainer.appendChild( cablePropertiesSuccessBtn );
        
        cablePropertiesSuccessBtn.addEventListener( 'click', function( event ){

            var cableLabelValue = cableLabelInput.value;
            
            if( cableLabelValue === "" || cableNumWiresInput.value === "" ){

                toastr.warning( editor.languageData.LabelAndNumberofWiresCantbeLeftBlank );
                return;

            }

            if( Number( cableNumWiresInput.value ) <= 0 || isNaN( Number( cableNumWiresInput.value ) ) ){

                toastr.warning( "'Number of wires' should be a number greater than zero" );
                return;

            }

            if( editor.scene.userData.cableDatas === undefined ){

                editor.scene.userData.cableDatas = {};

            }

            var labelInputLower = cableLabelInput.value.toLowerCase();
            for( var key in editor.scene.userData.cableDatas ){

                if( labelInputLower === editor.scene.userData.cableDatas[ key ].label.toLowerCase() ){

                    toastr.warning( editor.languageData.ACableWiththeSpecifiedLabelAlreadyExists );
                    return;

                }

            }

            try{

                var calculatedHeight = null;
                if( cableHeightOfWiresInput.value != null && cableHeightOfWiresInput.value != '' ){

                    var existingCableVerticesLength = scope.selectedNetworkCable.geometry.attributes.position.array.length;
                    calculatedHeight = Number( cableHeightOfWiresInput.value ) * Number( scope.conversionFactors[ unitInput.value ][ scope.baseUnit ] );
                    calculatedHeight = Number( calculatedHeight.toFixed( 1 ) );
                    for( var i = 1; i <= existingCableVerticesLength - 2; i += 3 ){
        
                        scope.selectedNetworkCable.geometry.attributes.position.array[ i ] = calculatedHeight;
        
                    }
                    scope.selectedNetworkCable.geometry.attributes.position.needsUpdate = true;

                    scope.estimatedCableLength = scope.getCableLength( scope.selectedNetworkCable, 30 );
                    var badgeLabelText = scope.estimatedCableLength.length + ( ( scope.targetUnit === "meter" )? "m" : "ft" );
                    var curLengthBadge = scope.getNumberBadge( { badgeText : badgeLabelText, badgeWidth : 125, badgeHeight : 35, fontSize : "16px", fontColor : this.badgeFontColor, strokeColor : this.badgeStrokeColor, borderRadius : 8, type : "image" } );
                    
                    var vLen = scope.selectedNetworkCable.geometry.attributes.position.array.length,
                    verticesArray = scope.selectedNetworkCable.geometry.attributes.position.array;
                    var lastVertexPos = new THREE.Vector3( verticesArray[ vLen - 3 ], verticesArray[ vLen - 2 ] + 0.8, verticesArray[ vLen - 1 ] );
                    scope.selectedNetworkCable.getObjectByName( "NetworkCableLengthBadge" ).material.map = curLengthBadge;

                }

                var data = {};
                data.label = cableLabelInput.value;
                data.length = scope.estimatedCableLength.length;
                data.unit = scope.targetUnit;
                data.cableColor = cableColorInput.value;
                data.numOfWires = cableNumWiresInput.value;
                data.cableType = cableTypeInput.value;
                data.cableApplication = cableAppInput.value;
                data.cableHeight = ( cableHeightOfWiresInput.value != '' )? cableHeightOfWiresInput.value: 'Not specified';
                data.cableHeightUnit = unitInput.value;

                editor.scene.userData.cableDatas[ scope.selectedNetworkCable.uuid ] = data;
                scope.uiComponents.propertiesWindow.hide();

                var networkData = {};
                networkData.lineUuid = scope.selectedNetworkCable.uuid;
                networkData.label = cableLabelInput.value;
                networkData.length = scope.estimatedCableLength.length;
                networkData.unit = scope.targetUnit;
                networkData.cableColor = cableColorInput.value;
                networkData.numOfWires = cableNumWiresInput.value;
                networkData.cableType = cableTypeInput.value;
                networkData.cableApplication = cableAppInput.value;
                networkData.cableHeight = ( cableHeightOfWiresInput.value != '' )? cableHeightOfWiresInput.value: 'Not specified';
                networkData.cableHeightUnit = unitInput.value;

                scope.selectedNetworkCable.traverse( function( subChild ){

                    if( subChild instanceof THREE.Mesh && ( /^NetworkMarker(\d+)/g ).test( subChild.name ) ){

                        if( calculatedHeight != undefined ){

                            subChild.position.y = calculatedHeight;

                        }
                        editor.nwMarkers.push( subChild );

                    }

                    if( subChild instanceof THREE.Sprite && ( /^NetworkCableLengthBadge/g ).test( subChild.name ) ){

                        editor.nwBadges.push( subChild );

                    }
    
                } );

                scope.isActive = true;
                cableLabelInput.value = '';
                cableNumWiresInput.value = '1';
                this.selectedNetworkCable = {};
                scope.networkCable.setGeometry( new THREE.Geometry() );
                scope.uiComponents.propertiesWindow.hide();

                editor.signals.newNetworkCableAdded.dispatch( networkData );
                editor.signals.sceneGraphChanged.dispatch();
                toastr.success( editor.languageData.SuccessfullyAddedNetworkData );

            }
            catch( error ){

                scope.uiComponents.propertiesWindow.hide();
                toastr.error( "Sorry, something wen\'t wrong" );
                console.log( error );

            }

        } );

        var cablePropertiesCancelBtn = document.createElement( 'button' );
        cablePropertiesCancelBtn.id = "cable-properties-cancel-button";
        cablePropertiesCancelBtn.className = "btn btn-danger btn-xs";
        cablePropertiesCancelBtn.innerHTML = "<span class='fa fa-times'> <strong>" + editor.languageData.Cancel + "</strong></span>";
        footerContainer.appendChild( cablePropertiesCancelBtn );

        cablePropertiesCancelBtn.addEventListener( 'click', function( event ){

            if( scope.selectedNetworkCable ) editor.execute( new RemoveObjectCommand( scope.selectedNetworkCable ) );
            cableLabelInput.value = '';
            scope.uiComponents.propertiesWindow.hide();
            scope.networkCable.setGeometry( new THREE.Geometry() );
            scope.isActive = true;

        } );

        this.uiComponents.propertiesWindow.setBody( bodyContainer );
        this.uiComponents.propertiesWindow.setFooter( footerContainer );
        document.getElementById( 'editorElement' ).appendChild( this.uiComponents.propertiesWindow.dom );
        this.uiComponents.propertiesWindow.setDraggable();

    },

    /**
     * activate() - Activates the measurement controls. This will enable the mouse listeners also
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of activate method.</caption>
     * networkCableDesigner.activate();
     */
    activate : function(){

        this.isActive = true;
        this.tempBadge = null;

        //Creating the cabling session group
        this.cablingSessionGroup = new THREE.Group();
        editor.scene.add( this.cablingSessionGroup );
        this.sessionGroupAdded = false; //Set the flag to false to indicate the measuring session group added only to the scene(It hasn't added to the object in which measurement is going on )

        //Creating the mouse following sphere
        var markerGeo = new THREE.SphereGeometry( 0.04, 8, 6 );
        var markerMat = new THREE.MeshStandardMaterial( { color: this.markerColors[ 0 ] } );
        this.cursor = new THREE.Mesh( markerGeo, markerMat );
        this.cursor.name = "cablingMouseCursor";
        editor.scene.add( this.cursor );

        //Initializing the thick polygon drawer component
        //this.connectionLine = new ThickPolygonDrawer( { color : this.lineColor, useZBuffer : false } );
        if( editor.isFloorplanViewActive === true ) this.networkCable = new ThickPolygonDrawer( { color : this.cableColor, useZBuffer : false, lineWidth : 0.2 } );
        else this.networkCable = new ThickPolygonDrawer( { color : this.cableColor, useZBuffer : false, lineWidth : 10 } );
        
        this.networkCable.polygon.name = "NetworkingCable";
        this.networkCable.unsetVertices();
        
        editor.scene.add( this.networkCable.polygon );

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
     * networkCableDesigner.deActivate();
     */
    deActivate : function(){

        if( this.cablingSessionGroup instanceof THREE.Group && this.cablingSessionGroup.children.length === 0 ){

            editor.scene.remove( this.cablingSessionGroup );

        }

        if( this.isActive === true && this.endPointsCollected === false ){

            var startMarkerParent = this.networkCable.polygon.parent;
            if( startMarkerParent ) startMarkerParent.remove( this.networkCable.polygon );

            /*for( var i = 0; i < this.edgeMarkers.length; i++ ){

                if( this.edgeMarkers[ i ].parent ) this.edgeMarkers[ i ].parent.remove( this.edgeMarkers[ i ] );

            }*/

        }

        if( this.isActive === false && this.startPointCollected === false && this.endPointsCollected === true ){

            var parentGroup = this.selectedNetworkCable.parent;
            if( parentGroup ) parentGroup.remove( this.selectedNetworkCable );
            this.uiComponents.propertiesWindow.hide();

        }

        editor.scene.remove( this.networkCable.polygon );

        this.isActive = false;
        editor.scene.remove( this.cursor );
        this.cursor = {};
        this.cablingSessionGroup = {};
        this.tempBadge = null;
        this.sessionGroupAdded = false; //This flag should be setted to false whenever the measurement session is deactivated

        this.startPointCollected = false;
        this.endPointsCollected = false;
        this.pointsPicked = 1;
        this.edgeMarkers = [];
        this.networkCable = null;

        editor.signals.sceneGraphChanged.dispatch();

    },

    /**
     * rescaleComponents() - Rescales the measurement markers based on current zoom level
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of rescaleComponents method.</caption>
     * networkCableDesigner.rescaleComponents();
     */
    rescaleComponents : function(){

        /*if( this.tempBadge ){

            var scale = this.tempBadge.position.distanceTo( editor.camera.position ) * 0.15;
            this.tempBadge.scale.set( scale, scale, scale );

        }*/
        if( this.cursor instanceof THREE.Mesh ){
 
            //var scale = this.cursor.position.distanceTo( editor.camera.position ) * 0.1;
            //this.cursor.scale.set( scale, scale, scale );

            
            if( editor.isFloorplanViewActive === true ){

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
     * networkCableDesigner.setMouseMoveListener( mouseMoveCallback );
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
     * networkCableDesigner.setMouseClickListener( mouseClickCallback );
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
     * setRightClickListener( callback ) - Defines the mouse right click listener
     * @param {Function} callback - The call back function to execute during right click event
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of setRightClickListener method.</caption>
     * var setRightClickListener = function( event ){ console.log( "Right Clicked at x : " + event.clientX +" y : " + event.clientY  ); }
     * networkCableDesigner.setRightClickListener( mouseClickCallback );
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
     * removeMouseMoveListener() - Removes the existing mousemove listener from the areaOfScope specified
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of removeMouseMoveListener method.</caption>
     * //It's very straight forward to invoke, just call the function
     * networkCableDesigner.removeMouseMoveListener();
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
     * networkCableDesigner.removeMouseClickListener();
     */
    removeMouseClickListener : function(){

        this.areaOfScope.removeEventListener( 'click', this.mouseClickListener );

    },

    /**
     * removeMouseClickListener() - Removes the existing mouse dblclick listener from the areaOfScope specified
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of removeMouseClickListener method</caption>
     * //It's very straight forward to invoke, just call the function
     * networkCableDesigner.removeMouseClickListener();
     */
    removeRightClickListener : function(){

        this.areaOfScope.removeEventListener( 'click', this.rightClickListener );

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
     * var badgeSprite = networkCableDesigner.getNumberBadge( { badgeText : 10, badgeWidth : 55, badgeHeight : 55, fontSize : "16px", fontColor : "#500080", strokeColor : "#500080", borderRadius : 7, type : "sprite" } );
     * //
     * //example to create an image badge
     * var badgeTexture = networkCableDesigner.getNumberBadge( { badgeText : 10, badgeWidth : 55, badgeHeight : 55, fontSize : "16px", fontColor : "#500080", strokeColor : "#500080", borderRadius : 7, type : "image" } );
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