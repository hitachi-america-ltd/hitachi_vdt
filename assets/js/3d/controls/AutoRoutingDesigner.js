/**
 * AutoRoutingDesigner( options, editor ) : Constructor for the point to point autorouting controls
 * @constructor
 * @param {Object} options - An object specifying the settings for the autorouting controls
 * @param {Object<THREE.PerspectiveCamera>} options.camera - The PerspectiveCamera through which the scene is rendered. Used for mouse picking using raycasting
 * @param {String} options.baseUnit - The measurement system used for designing the 3D model. Default is "meter"
 * @param {Number} options.baseConversionFactor - It defines the value of 1 unit distance in base units for the 3D model. Default is 1. For example, if 1 unit distance in the 3D model correspond to 2 meter in the real object, then the "baseConversionFactor" is 2.
 * @param {Object<Element>} options.areaOfScope - The areaOfScope is an HTML Element where the autorouting controls should be effective. The mouse move and mouse click event listeners will be attached to this element.
 * @param {any} editor - The instance of the Editor which manages the overall objects and signals
 * @returns {Void}
 * @author Pravi
 * @example <caption>Example usage of autorouting</caption>
 * var view = document.getElementById( 'viewport' ); 
 * var autoRoutingDesigner = new AutoRoutingDesigner( {  areaOfScope : view, camera : editor.camera , baseUnit : "meter", baseConversionFactor : 1}, editor );
 */
var AutoRoutingDesigner = function( options, editor ){
    
    //Core properties
    this.areaOfScope;
    this.raycaster = new THREE.Raycaster();
    this.mouseClickListener;
    this.camera;
    this.mouseMoveListener;
    this.rightClickListener;
    this.autoRoutingGroup;
    this.sessionGroupAdded;
    this.networkCable;
    this.renderOrder = ( options && options.renderOrder )? options.renderOrder : 10;
    this.cube;
    this.basemodel;
    this.box = new THREE.Box3();
    this.routingMode;
    this.modelHeight; 
    this.modelBox3;
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
    this.isActive = false; //Indicates whether the AutoRoutingDesigner controls is active or not
    this.cursor;

    //Vectors
    this.mousePosition = THREE.Vector3();

    //Temporary mouse cube, direction helper line, measurement group, measurement value badge, markers + line colors
    this.markerColors = [ 0x76f441, 0x8adeff, 0xeadeff ];
    this.cableColor = 0x42a4f4;
    this.badgeFontColor = "#F50AC3";
    this.badgeStrokeColor = "#F50AC3";
    this.edgeMarkers = [];

    this.routedNetworkCable;// = new PolygonDrawer( { color : this.cableColor, vertexCount : 2, useZBuffer : false } );

    this.startMarker = null;
    this.cableName;
    this.selectedNetworkCable = null;
    this.estimatedCableLength = 0;

    this.ceilingHeight;
    //editor.scene.userData.cableCounter = 1;

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
        
        
        if( this.isActive && editor.placeJunctionBox == true ){

            var boundingRect = this.areaOfScope.getBoundingClientRect();
            this.mousePosition = new THREE.Vector3( ( ( event.clientX - boundingRect.left) / this.areaOfScope.offsetWidth ) * 2 - 1, -( ( event.clientY - boundingRect.top ) / this.areaOfScope.offsetHeight ) * 2 + 1, 0.5 );

            this.raycaster.setFromCamera( this.mousePosition, this.camera );
            var intersects = this.raycaster.intersectObjects( editor.sceneObjects );

            if( intersects.length > 0 ){

                this.cursor.position.copy( intersects[ 0 ].point.clone() );

                //if( this.startPointCollected === true && this.endPointsCollected === false ){

                        //var cursorPosition = intersects[ 0 ].point.clone();
                        //this.networkCable.pushVertex( this.pointsPicked, [ cursorPosition.x, cursorPosition.y, cursorPosition.z ] );
        
                //}
                //this.rescaleComponents();
                editor.signals.sceneGraphChanged.dispatch();

            }

        }
        
    } );

    this.setMouseClickListener( function( event ){

        if( this.isActive && editor.placeJunctionBox == true ){

            var cameras = editor.sceneCameras;

            if ( editor.camLock ) {
                document.getElementById( "move_with_model" ).click();
            }

            if( cameras.length > 0 ){
                cameras.forEach(camera => {
                    if(camera.isLocked == true){
                        document.getElementById("move_with_model").click();
                        document.getElementById("move_with_model").click(); 
                    }
                });
            }
            var boundingRect = this.areaOfScope.getBoundingClientRect();
            var cursorPosition = new THREE.Vector3( ( ( event.clientX - boundingRect.left) / this.areaOfScope.offsetWidth ) * 2 - 1, -( ( event.clientY - boundingRect.top ) / this.areaOfScope.offsetHeight ) * 2 + 1, 0.5 );
            this.mousePosition = cursorPosition;
            
            //Raycasting and mouse picking point of interest
            this.raycaster.setFromCamera( this.mousePosition, this.camera );
            var intersects = this.raycaster.intersectObjects( editor.sceneObjects );

            if( intersects.length > 0 ){

                var pickedPoint = intersects[ 0 ].point.clone();

                var pickedObject = intersects[ 0 ].object; 
                while( !( pickedObject.parent instanceof THREE.Scene ) ){

                    pickedObject = pickedObject.parent;
                    this.basemodel = pickedObject;

                }

                
                var sceneCameras = editor.sceneCameras;
                var yOfJunctionBox;
                if( sceneCameras.length == 0 ){
                    var sceneBox = this.box;
                    sceneBox.setFromObject( pickedObject );
                    var yOfBaseModel = sceneBox.getSize().y;
                    yOfJunctionBox = yOfBaseModel + pickedObject.position.y;
                }
                else if( sceneCameras.length > 0 ){
                    var highestCameraY;
                    sceneCameras.forEach( camera => {
                        
                        highestCameraY = ( ( highestCameraY == undefined )? camera.position.y : ( camera.position.y > highestCameraY ) ? camera.position.y : highestCameraY );
                    });
                    yOfJunctionBox = highestCameraY;
                }
                if( this.modelHeight === undefined ){   
                    // this.modelBox3 = this.box.setFromObject( this.basemodel );
                    // this.modelHeight = this.modelBox3.max.y - this.basemodel.position.y;
                    this.modelHeight = yOfJunctionBox;
                } 

                var geometry = new THREE.BoxGeometry( 0.5, 0.5, 0.5 );
                //var texture = new THREE.TextureLoader().load( "assets/img/junction_box.png" );
                var texture = editor.junctionBoxIcon.clone();
                texture.needsUpdate = true;

                var badgeTextValue;
                var material = new THREE.MeshBasicMaterial( { map: texture, color: 0xffffff} );
                var junctionBox = new THREE.Mesh( geometry, material );
                if( editor.scene.userData.jnBoxDeletedNumber != undefined && editor.scene.userData.jnBoxDeletedNumber.deletedJnBoxArray.length > 0 ){
                    junctionBox.name  = "JunctionBox"+editor.junctionBoxDeletedNumber[0];
                    badgeTextValue = editor.junctionBoxDeletedNumber[0];
                    editor.junctionBoxDeletedNumber.splice( 0,1 );
                }
                else{
                    junctionBox.name = "JunctionBox"+editor.scene.userData.junctionBoxCounter;
                    badgeTextValue = editor.scene.userData.junctionBoxCounter;
                    editor.scene.userData.junctionBoxCounter++;
                }               
                junctionBox.position.copy( new THREE.Vector3( pickedPoint.x, yOfJunctionBox, pickedPoint.z ) );


                editor.getNumberBadgeIcon( { badgeText: badgeTextValue, badgeRadius: 20, badgeColor: editor.randomColor(), type: "sprite", badgeShape: "square" } ).then(

                    function( icon ){

                        icon.name = "JunctionBoxNumberBadge";
                        icon.position.copy(new THREE.Vector3( 0,1,0 ));
                        junctionBox.add( icon );
                        editor.junctionBoxBadges.push( icon );
                        icon.scale.set( 3,3,3 );

                    },
                    function( err ){

                        console.log( "Problem with junction box number badge" );

                    }

                );
                editor.execute( new AddObjectCommand( junctionBox ) );

                toastr.success( editor.languageData.JunctionBoxPlaced );
                var placeJunctionBox = document.getElementById( 'place-junction-box-li' );
                placeJunctionBox.click();
            
            }

        }

    } );


    return this;
}

AutoRoutingDesigner.prototype = {

    constructor : AutoRoutingDesigner,

    /**
     * setBaseUnit( unit, conversionFactor ) - Method to set the base unit of the autorouting controls
     * @param {String} unit - The measurement system to use for the autorouting controls
     * @param {Number} conversionFactor - Defines the equivalent distance in the original object in base units corresponding to unit distance in the 3D model.
     * @returns {Void}
     * @author Pravi
     * @example <caption>Example usage of setBaseUnit method. Here 1 unit distance in the 3D model equals 2 feet in the actual object.</caption>
     * autoRoutingDesigner.setBaseUnit( "feet", 2 );
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
     * setTargetUnit( unit ) - Defines the measurement system in which the autorouting values should be displayed
     * @param {String} unit - The target measurement system.
     * @returns {Void}
     * @author Pravi
     * @example <caption>Example usage of setTargetUnit method.</caption>
     * autoRoutingDesigner.setTargetUnit( "feet" );
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
     * addFollowingCursorToScene() - Adds a mouse following cube to the scene which represents the junction box.
     * @returns {Void}
     * @author Pravi
     * @example <caption>Example usage of addFollowingCursorToScene method.</caption>
     * autoRoutingDesigner.addFollowingCursorToScene();
     */
    addFollowingCursorToScene : function(){
        var markerGeo = new THREE.SphereGeometry( 0.04, 8, 6 );
        var markerMat = new THREE.MeshStandardMaterial( { color: this.markerColors[ 0 ] } );
        this.cursor = new THREE.Mesh( markerGeo, markerMat );
        this.cursor.name = "autoRoutingMouseCube";
        editor.scene.add( this.cursor );
        toastr.success( editor.languageData.PlaceJunctionBox );
    },

    /**
     * removeFollowingCursorFromScene() - Removes the mouse following cube from the scene which represents the junction box.
     * @returns {Void}
     * @author Pravi
     * @example <caption>Example usage of removeFollowingCursorFromScene method.</caption>
     * autoRoutingDesigner.removeFollowingCursorFromScene();
     */
    removeFollowingCursorFromScene : function(){
        editor.scene.remove( this.cursor );
    },

    /**
     * setMouseMoveListener( callback ) - Defines the mouse move listener
     * @param {Function} callback - The call back function to execute during mousemove event
     * @returns {Void}
     * @author Pravi
     * @example <caption>Example usage of setMouseMoveListener method.</caption>
     * var mouseMoveCallback = function( event ){ console.log( "Mouse at x : " + event.clientX +" y : " + event.clientY  ); }
     * autoRoutingDesigner.setMouseMoveListener( mouseMoveCallback );
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
     * @author Pravi
     * @example <caption>Example usage of setMouseClickListener method.</caption>
     * var mouseClickCallback = function( event ){ console.log( "Clicked at x : " + event.clientX +" y : " + event.clientY  ); }
     * autoRoutingDesigner.setMouseClickListener( mouseClickCallback );
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
     * rescaleComponents() - Rescales the autorouting temporary badge and markers based on current zoom level
     * @returns {Void}
     * @author Pravi
     * @example <caption>Example usage of rescaleComponents method.</caption>
     * autoRoutingDesigner.rescaleComponents();
     */
    rescaleComponents : function(){

        if( this.cube instanceof THREE.Mesh ){
 
            var scale = this.cube.position.distanceTo( editor.camera.position ) * 0.1;
            this.cube.scale.set( scale, scale, scale );

            
            if( editor.isFloorplanViewActive === true ){

                editor.scaleCursorFloorPlanView( this.cube );

            }
            else{

                editor.scaleCursorThreeDView( this.cube ); 

            }

        }

    },

    /**
     * setRightClickListener( callback ) - Defines the mouse right click listener
     * @param {Function} callback - The call back function to execute during right click event
     * @returns {Void}
     * @author Pravi
     * @example <caption>Example usage of setRightClickListener method.</caption>
     * var mouseClickCallback = function( event ){ console.log( "Clicked at x : " + event.clientX +" y : " + event.clientY  ); }
     * autoRoutingDesigner.setRightClickListener( mouseClickCallback );
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
     * @author Pravi
     * @example <caption>Example usage of removeMouseMoveListener method.</caption>
     * //It's very straight forward to invoke, just call the function
     * autoRoutingDesigner.removeMouseMoveListener();
     */
    removeMouseMoveListener : function(){

        this.areaOfScope.removeEventListener( 'mousemove', this.mouseMoveListener );

    },

    /**
     * removeMouseClickListener() - Removes the existing mouse dblclick listener from the areaOfScope specified
     * @returns {Void}
     * @author Pravi
     * @example <caption>Example usage of removeMouseClickListener method</caption>
     * //It's very straight forward to invoke, just call the function
     * autoRoutingDesigner.removeMouseClickListener();
     */
    removeMouseClickListener : function(){

        this.areaOfScope.removeEventListener( 'click', this.mouseClickListener );

    },

    /**
     * removeRightClickListener() - Removes the existing mouse right click listener from the areaOfScope specified
     * @returns {Void}
     * @author Pravi
     * @example <caption>Example usage of removeRightClickListener method</caption>
     * //It's very straight forward to invoke, just call the function
     * autoRoutingDesigner.removeRightClickListener();
     */
    removeRightClickListener : function(){

        this.areaOfScope.removeEventListener( 'click', this.rightClickListener );

    },
    
    /**
     * activate() - Activates the autorouting controls. This will enable the mouse listeners also
     * @returns {Void}
     * @author Pravi
     * @example <caption>Example usage of activate method.</caption>
     * autoRoutingDesigner.activate();
     */
    activate : function(){

        this.isActive = true;
        this.tempBadge = null;
        
        this.sessionGroupAdded = false; //Set the flag to false to indicate the autoRouting session group added only to the scene(It hasn't added to the object in which measurement is going on )

        if( editor.scene.userData.junctionBoxCounter == undefined ){

                editor.scene.userData.junctionBoxCounter = 1;
        }
        editor.signals.sceneGraphChanged.dispatch();

    },
    
    /**
     * deActivate() - Deactivates the autorouting controls. This will disable the mouse listeners also
     * @returns {Void}
     * @author Pravi
     * @example <caption>Example usage of deActivate method.</caption>
     * autoRoutingDesigner.deActivate();
     */
    deActivate : function(){

        this.isActive = false;

        /*if( this.autoRoutingGroup instanceof THREE.Group && this.autoRoutingGroup.children.length === 0 ){

            editor.scene.remove( this.autoRoutingGroup );

        }*/


        editor.signals.sceneGraphChanged.dispatch();

    },

    /**
     * updateCamera( camera ) - Updates the camera instance used for autorouting
     * @param {Object<THREE.PerspectiveCamera>} camera - An instance of THREE.Camera
     * @returns {Void}
     * @author Pravi
     * @example <caption>Example usage of updateCamera method.</caption>
     * var camera = editor.camera;
     * autoRoutingDesigner.updateCamera();
     */
    updateCamera : function( camera ){

        this.camera = camera;

    },

    /**
     * setMode( camera ) - Sets the mode of autorouting
     * @param {String} mode - Defines the mode by which autorouting needs to be done. ie, "direct", "ceiling" or "floor".
     * @returns {Void}
     * @author Pravi
     * @example <caption>Example usage of setMode method.</caption>
     * var mode = "ceiling"
     * autoRoutingDesigner.setMode(mode);
     */
    setMode : function( mode ){

        this.routingMode = mode;

    },

    /**
     * drawCableFromAllCameras( camera ) - Sets the mode of autorouting
     * @param {String} mode - Defines the mode by which autorouting needs to be done. ie, "direct", "ceiling" or "floor".
     * @returns {Void}
     * @author Pravi
     * @example <caption>Example usage of drawCableFromAllCameras method.</caption>
     * autoRoutingDesigner.drawCableFromAllCameras(junctionBox);
     */
    drawCableFromAllCameras : function( junctionBox ){

        if( editor.isFloorplanViewActive === true ) this.networkCable = new ThickPolygonDrawer( { color : this.cableColor, useZBuffer : false, lineWidth : 0.2 } );
        else this.networkCable = new ThickPolygonDrawer( { color : this.cableColor, useZBuffer : false, lineWidth : 12 } );

        this.networkCable.unsetVertices();

        if( this.basemodel == undefined ){
            var childlen = editor.scene.children.length;
            for( var i = 0; i < childlen; i++ ){
                if( editor.scene.children[i].type == "Group"  && editor.scene.children[i].children[0] instanceof THREE.Mesh ){
                    this.basemodel = editor.scene.children[i];
                }
            }
        }

        if( editor.nwShowHideToggle == true ) {

            var showHideNetworkingLi = document.getElementById( 'show-hide-networking-li' );
            showHideNetworkingLi.click();

        }
        var autoRoutingGroup = new THREE.Group();//autoRoutingGroup
        autoRoutingGroup.name = "NetworkCablingSession";
        editor.scene.add(autoRoutingGroup);
        if( editor.scene.userData.cableDatas === undefined ){

            editor.scene.userData.cableDatas = {};

        }
        if (junctionBox.userData.autoRouteData == undefined ){
            junctionBox.userData.autoRouteData = {};
            this.sessionGroupAdded = false;
        }
        else{

            //THREE.SceneUtils.detach(junctionBox, autoRoutingGroup, editor.scene);
            var sessionToBeRemoved;
           
            if (junctionBox.userData.autoRouteData.sessionUUID != undefined ){
                sessionToBeRemoved = editor.scene.getObjectByProperty( 'uuid', junctionBox.userData.autoRouteData.sessionUUID );
            }
           
            THREE.SceneUtils.detach(sessionToBeRemoved, this.basemodel, editor.scene);
            THREE.SceneUtils.detach(junctionBox, sessionToBeRemoved, editor.scene);
            sessionToBeRemoved.traverse(function (cable) {

                if (cable instanceof THREE.Mesh && cable.name == "NetworkingCable") {

                    delete editor.scene.userData.cableDatas[cable.uuid];
                    for (i = 0; i < editor.nwBadges.length; i++) {

                        if (editor.nwBadges[i] instanceof THREE.Sprite && editor.nwBadges[i].name == "AutoRoutedCableLengthBadge") {

                            if (editor.nwBadges[i].parent.uuid == cable.uuid) {

                                editor.nwBadges.splice(i, 1);
                            }
                        }
                    }
                }
            });
            editor.scene.remove(sessionToBeRemoved)
            //editor.execute(new AddObjectCommand(junctionBox));
            junctionBox.userData.autoRouteData = {};
            this.sessionGroupAdded = false;
        }
        var cameras = editor.sceneCameras;
        
        if( cameras.length > 0 ){
            cameras.forEach(camera => {
                var junctionBoxPos = junctionBox.position.clone();
                if ( editor.camLock ) {
                    document.getElementById( "move_with_model" ).click();
                }
                else if(camera.isLocked == true){
                    document.getElementById("move_with_model").click();
                    document.getElementById("move_with_model").click(); 
                }
                if( cameras.length > 0 ){
                    var highestCameraY;
                    cameras.forEach( camera => {
                        
                        highestCameraY = ( ( highestCameraY == undefined )? camera.position.y : ( camera.position.y > highestCameraY ) ? camera.position.y : highestCameraY );
                    });
                    yOfJunctionBox = highestCameraY;
                }
                if( this.modelHeight === undefined ){   
                    // this.modelBox3 = this.box.setFromObject( this.basemodel );
                    // this.modelHeight = this.modelBox3.max.y;
                    this.modelHeight = highestCameraY;
                }

                var cameraPos = camera.position.clone();
                
                this.networkCable.addVertex( junctionBoxPos );
                if( this.routingMode === "direct" ){
                    this.networkCable.addVertex( new THREE.Vector3( cameraPos.x, junctionBoxPos.y, cameraPos.z  ) );
                }
                else if( this.routingMode === "ceiling" ){

                    this.modelHeight += this.basemodel.position.y;
                    this.networkCable.addVertex( new THREE.Vector3( junctionBoxPos.x, highestCameraY, junctionBoxPos.z  ) );
                    this.networkCable.addVertex( new THREE.Vector3( junctionBoxPos.x, highestCameraY, cameraPos.z  ) );
                    this.networkCable.addVertex( new THREE.Vector3( cameraPos.x, highestCameraY, cameraPos.z  ) );
                    
                    this.modelHeight -= this.basemodel.position.y;
                }
                else if( this.routingMode === "customheight" ){
                    this.ceilingHeight = document.getElementById( "ceiling-height"+junctionBox.uuid ).value;
                    if( this.ceilingHeight === "" ){
                        if( cameras.length > 0 ){
                            var highestCameraY;
                            cameras.forEach( camera => {
                                
                                highestCameraY = ( ( highestCameraY == undefined )? camera.position.y : ( camera.position.y > highestCameraY ) ? camera.position.y : highestCameraY );
                            });
                        }
                        this.ceilingHeight = highestCameraY;
                        this.ceilingHeight *= editor.commonMeasurements.targetConversionFactor;
                    }

                    this.ceilingHeight = parseInt( this.ceilingHeight );
                    this.ceilingHeight /= editor.commonMeasurements.targetConversionFactor;
                    //target conversion factor
                    this.networkCable.addVertex( new THREE.Vector3( junctionBoxPos.x, this.ceilingHeight, junctionBoxPos.z  ) );
                    this.networkCable.addVertex( new THREE.Vector3( junctionBoxPos.x, this.ceilingHeight, cameraPos.z  ) );
                    this.networkCable.addVertex( new THREE.Vector3( cameraPos.x, this.ceilingHeight, cameraPos.z  ) );
                }
                else if( this.routingMode === "floor" ){
                    var parentModel = this.basemodel;
                    this.networkCable.addVertex( new THREE.Vector3( junctionBoxPos.x, parentModel.position.y, junctionBoxPos.z  ) );
                    this.networkCable.addVertex( new THREE.Vector3( junctionBoxPos.x, parentModel.position.y, cameraPos.z  ) );
                    this.networkCable.addVertex( new THREE.Vector3( cameraPos.x, parentModel.position.y, cameraPos.z  ) );
                }
                //this.networkCable.addVertex( new THREE.Vector3( junctionBox.position.x, modelPositionHeight, junctionBox.position.z ) );
                //this.networkCable.addVertex( new THREE.Vector3( cameraPos.x, modelPositionHeight, cameraPos.z ) );
                this.networkCable.addVertex( cameraPos );
    
                var completedCable = this.networkCable.getPolygon();
                completedCable.name = "NetworkingCable";
    
                //var edgesLen = this.edgeMarkers.length;
                var totalVerticesCount = ( completedCable.geometry.attributes.position.array.length / 3 ) / 2;
                var startVertexUUID;
                for( var i = 0; i < totalVerticesCount; i++ ){
    
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

                    completedCable.add( marker );
                    if( i==0 ){
                        startVertexUUID = marker.uuid;
                    }
                    
                    
    
                }
    
                this.estimatedCableLength = this.getCableLength( completedCable, 30 );
                var badgeLabelText = this.estimatedCableLength.length + ( ( this.targetUnit === "meter" )? "m" : "ft" );

                var curLengthBadge = editor.commonMeasurements.getNumberBadgeTransparent( { badgeText : badgeLabelText, badgeWidth : 100, badgeHeight : 35, fontSize : "20px", fontColor : this.badgeFontColor, strokeColor : this.badgeStrokeColor, borderRadius : 8 } );
                
                var vLen = completedCable.geometry.attributes.position.array.length,
                verticesArray = completedCable.geometry.attributes.position.array;
                var lastVertexPos = new THREE.Vector3( verticesArray[ vLen - 3 ]-1, verticesArray[ vLen - 2 ]+1, verticesArray[ vLen - 1 ]+1 );
                curLengthBadge.position.copy( lastVertexPos );
                curLengthBadge.name = "AutoRoutedCableLengthBadge";
                curLengthBadge.renderOrder = 10;
                curLengthBadge.scale.set( 3,3,3 );

                completedCable.add( curLengthBadge );
                autoRoutingGroup.matrixAutoUpdate = false;
                completedCable.matrixAutoUpdate = false;
                var color = editor.getRandomColor();
                var newColor = new THREE.Color( color );
                completedCable.material.uniforms.color.value = newColor;
                completedCable.material.uniformsNeedUpdate = true;
                completedCable.material.needsUpdate = true;
                editor.execute( new AddObjectCommand( completedCable ) );
                autoRoutingGroup.add( completedCable );


                completedCable.traverse( function( subChild ){

                    if( subChild instanceof THREE.Mesh && ( /^NetworkMarker(\d+)/g ).test( subChild.name ) ){

                        editor.nwMarkers.push( subChild );

                    }

                    if( subChild instanceof THREE.Sprite && subChild.name == "AutoRoutedCableLengthBadge" ){

                        editor.nwBadges.push( subChild );

                    }
    
                } );
                
                var data = {};
                data.label = "C" + camera.badgeText;
                //data.label = "C" + editor.scene.userData.cableCounter;
                data.length = this.estimatedCableLength.length;
                data.unit = this.targetUnit;
                data.cableColor = color;
                data.numOfWires = "3";
                data.cableType = "CAT5";
                data.cableApplication = "CCTV";
                data.cableHeight = "Not Specified";
                data.cableHeightUnit = this.targetUnit;
                
                editor.scene.userData.cableDatas[ completedCable.uuid ] = data;
                junctionBox.userData.autoRouteData[completedCable.uuid] = { "startVertexUUID": startVertexUUID, "cameraUUID": camera.uuid};
                this.networkCable.setGeometry( new THREE.Geometry() );
                
    
            });
            
            THREE.SceneUtils.attach(junctionBox, editor.scene, autoRoutingGroup);
            
            if( this.sessionGroupAdded == false ){
                
                THREE.SceneUtils.attach( autoRoutingGroup, editor.scene, this.basemodel );
                this.sessionGroupAdded = true;
            }
            if (junctionBox.userData.autoRouteData.sessionUUID == undefined ){
                junctionBox.userData.autoRouteData.sessionUUID = {};
            }
            junctionBox.userData.autoRouteData.sessionUUID = autoRoutingGroup.uuid;
            
        }
        else{
            toastr.warning( "No cameras on scene" );
        }
        
        
    },
    
    /**
     * getCableLength( cable, allowancePercent ) - For calculating the length for a given network cable.
     * @param {Object<THREE.Mesh>} cable - The network cable for which the length is to be calculated.
     * @param {Number} allowancePercent - Percentage of allowance.
     * @returns {Object} - Returns an object with length and its unit. 
     * @author Pravi
     * @example <caption>Example usage of getCableLength method.</caption>
     * autoRoutingDesigner.getCableLength( cable, allowancePercent );
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
     * @author Pravi
     * @example <caption>Example usage of getNumberBadge method</caption>
     * //example to create a sprite badge
     * var badgeSprite = autoRoutingDesigner.getNumberBadge( { badgeText : 10, badgeWidth : 55, badgeHeight : 55, fontSize : "16px", fontColor : "#500080", strokeColor : "#500080", borderRadius : 7, type : "sprite" } );
     * //
     * //example to create an image badge
     * var badgeTexture = autoRoutingDesigner.getNumberBadge( { badgeText : 10, badgeWidth : 55, badgeHeight : 55, fontSize : "16px", fontColor : "#500080", strokeColor : "#500080", borderRadius : 7, type : "image" } );
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

    }
}