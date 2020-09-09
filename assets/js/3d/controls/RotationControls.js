/**
 * RotationControls( editor ) : Constructor for the rotation controls
 * @constructor
 * @param {any} editor - The instance of the Editor which manages the overall objects and signals
 * @returns {Object}
 * @author Hari
 * @example <caption>Example usage of RotationControls</caption>
 * var rotationControls = new RotationControls( editor );
 */

var RotationControls = function( editor ){
    
    var scope = this;
    this.signals = editor.signals;
    this.ui = {};
    this.rotDirection = 'x';
    this.rotStep = 1;
    this.rotationTarget;
    this.rotXValue;
    this.rotYValue;
    this.rotZValue;
    this.curRotationX;
    this.curRotationY;
    this.curRotationZ;
    this.sphericalControlsToggle;
    this.isControlsActive = false;
    this.isSphericalControlsActive = false;

    this.createUI();

    return this;

}

RotationControls.prototype = {

    /**
     * show( ) - Method to make the rotation controls visible
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of show method.</caption>
     * rotationControls.show( );
     */

    show : function(){

        var scope = this;
        var obj = editor.selected;
        
        if( obj != null ){
            scope.updateUI();
        }
        scope.ui.show();
        scope.isControlsActive = true;
        scope.isSphericalControlsActive = false;
        editor.signals.transformModeChanged.dispatch( 'translate' );

    },

    /**
     * hide( ) - Method to hide rotation controls
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of hide method.</caption>
     * rotationControls.hide( );
     */

    hide : function(){

        var scope = this;
        scope.ui.hide();
        scope.isControlsActive = false;
        var toolBarRotate = document.getElementById( 'toolbar-rotate' );
        if( toolBarRotate ){
            toolBarRotate.classList.remove( 'selected' );
        }
        scope.isSphericalControlsActive = false;
        scope.sphericalControlsToggle.innerHTML = '<span class="fa fa-toggle-off span-font-23" style="color:black"></span>';
        //scope.signals.transformModeChanged.dispatch( 'translate' );

    },

    /**
     * bringToFront( ) - Method to bring the window to front
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of bringToFront method.</caption>
     * rotationControls.bringToFront( );
     */

    bringToFront : function(){

        var scope = this;
        scope.ui.dom.style.zIndex = 1001;

    },

    /**
     * sendToBack( ) - Method to send the window to back
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of sendToBack method.</caption>
     * rotationControls.sendToBack( );
     */

    sendToBack : function(){

        var scope = this;
        scope.ui.dom.style.zIndex = 1;

    },

    /**
     * createUI( ) - Method to create the table for rotation controls
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of createUI method.</caption>
     * rotationControls.createUI( );
     */

    createUI : function(){

        var scope = this;
        
        //Rotation correction
        var directionWrapper = document.createElement( 'div' );
        directionWrapper.setAttribute( 'class', 'rotate-dir-wrapper' );

        //Current object Info start
        var rotTarget = document.createElement( 'div' );
        rotTarget.setAttribute( 'class', 'text-center' );
        var rotTargetName = document.createElement( 'div' );
        rotTargetName.innerHTML = '<strong>None selected</strong>';
        rotTarget.appendChild( rotTargetName );
        directionWrapper.appendChild( rotTarget );
        scope.rotationTarget = rotTargetName;
        //Current object Info end

        //=====================================================================
        //Direction x,y,z and +, - buttons section start
        var directionButtons = document.createElement( 'div' );
        directionButtons.setAttribute( 'class', 'direction-buttons text-center' );
        directionWrapper.appendChild( directionButtons );

        var minusButton = document.createElement( 'button' );
        minusButton.setAttribute( 'class', 'btn btn-default btn-md direction-minus-button' );
        //minusButton.setAttribute( 'id', 'direction-minus-button' );
        minusButton.setAttribute( 'title', editor.languageData.Rotateanticlockwise );
        minusButton.innerHTML = '<span class="fa fa-rotate-left"></span>';
        directionButtons.appendChild( minusButton );

        scope.xButton = document.createElement( 'button' );
        scope.xButton.setAttribute( 'class', 'btn btn-danger btn-md' );
        //scope.xButton.setAttribute( 'id', 'rotate-x-button' );
        scope.xButton.setAttribute( 'title', editor.languageData.RotateintheXdirection );
        scope.xButton.innerHTML = '<strong> X </strong>';
        directionButtons.appendChild( scope.xButton );

        scope.yButton = document.createElement( 'button' );
        scope.yButton.setAttribute( 'class', 'btn btn-success btn-xs' );
        //scope.yButton.setAttribute( 'id', 'rotate-y-button' );
        scope.yButton.setAttribute( 'title', editor.languageData.RotateintheYdirection );
        scope.yButton.innerHTML = '<strong> Y </strong>';
        directionButtons.appendChild( scope.yButton );

        scope.zButton = document.createElement( 'button' );
        scope.zButton.setAttribute( 'class', 'btn btn-primary btn-xs' );
        //scope.zButton.setAttribute( 'id', 'rotate-z-button' );
        scope.zButton.setAttribute( 'title', editor.languageData.RotateintheZdirection );
        scope.zButton.innerHTML = '<strong> Z </strong>';
        directionButtons.appendChild( scope.zButton );

        var plusButton = document.createElement( 'button' );
        plusButton.setAttribute( 'class', 'btn btn-default btn-md direction-plus-button' );
        //plusButton.setAttribute( 'id', 'direction-plus-button' );
        plusButton.setAttribute( 'title', editor.languageData.Rotateclockwise );
        plusButton.innerHTML = '<span class="fa fa-rotate-right"></span>';
        directionButtons.appendChild( plusButton );
        //Direction x,y,z and +, - buttons section end
        //=====================================================================

        //=====================================================================
        //Current rotation section start
        var rotValueFields = document.createElement( 'div' );
        rotValueFields.setAttribute( 'class', 'rotation-value-fields text-center' );

        var curRotationRow = new UI.Row();
        curRotationRow.setStyle( 'border', [ '1px solid #cccccc' ] );
        
        scope.curRotationX = new UI.Number().setRange( -360.00, 360.00 ).setStep( 10 ).setWidth( '50px' ).onChange( function( event ){

            var angle = event.target.value;
            if( angle != undefined && angle !== "NaN" ){

                if( editor.selected instanceof THREE.PerspectiveCamera && editor.selected.camCategory != undefined && editor.selected.camCategory === 'Fixed Dome' ){

                    scope.curRotationX.setValue( THREE.Math.RAD2DEG * editor.selected.rotation.x );
                    toastr.info( editor.languageData.Domecamerascantberotatedinxorydirection );
                    return;

                }
                scope.setDirection( "x" );
                scope.rotateInAngle( "x", Number( angle ) );

            }
            return;

        } );
        scope.rotXValue = scope.curRotationX;
        
        scope.curRotationY = new UI.Number().setRange( -360.00, 360.00 ).setStep( 10 ).setWidth( '50px' ).onChange( function( event ){

            var angle = event.target.value;
            if( angle != undefined && angle !== "NaN" ){

                if( editor.selected instanceof THREE.PerspectiveCamera && editor.selected.camCategory != undefined && editor.selected.camCategory === 'Fixed Dome' ){

                    scope.curRotationY.setValue( THREE.Math.RAD2DEG * editor.selected.rotation.y );
                    toastr.info( editor.languageData.Domecamerascantberotatedinxorydirection );
                    return;

                }
                scope.setDirection( "y" );
                scope.rotateInAngle( "y", event.target.value );

            }
            return;

        } );
        scope.rotYValue = scope.curRotationY;
        
        scope.curRotationZ = new UI.Number().setRange( -360.00, 360.00 ).setStep( 10 ).setWidth( '50px' ).onChange( function( event ){

            var angle = event.target.value;
            if( angle != undefined && angle !== "NaN" ){

                scope.setDirection( "z" );
                scope.rotateInAngle( "z", event.target.value );

            }
            return;

        } );

        scope.rotZValue = scope.curRotationZ;
        
        curRotationRow.add( scope.curRotationX, scope.curRotationY, scope.curRotationZ );
        rotValueFields.appendChild( curRotationRow.dom );

        directionWrapper.appendChild( rotValueFields );
        //Current rotation section end
        //=====================================================================

        //=====================================================================
        //Choose step section start
        var btnHolder = document.createElement( 'div' );
        btnHolder.setAttribute( 'class', 'direction-button-holder text-center' );

        /********************************************************/
        var rotationStepWrapper = document.createElement( 'div' );
        rotationStepWrapper.setAttribute( 'class', 'rot-step-wrapper text-center' );
        rotationStepWrapper.innerHTML = '<strong>'+ editor.languageData.Choosestep +'</strong>';

        var rotationStepListWrapper = document.createElement( 'div' );
        rotationStepWrapper.setAttribute( 'class', 'form-group form-group-sm' );
        rotationStepWrapper.setAttribute( 'style', 'margin-bottom: 7px !important;' );

        var col4 = document.createElement( 'div' );
        var selectList = document.createElement( 'select' );
        selectList.setAttribute( 'class', 'form-control' );
        //selectList.setAttribute( 'id', 'rotation-step-value' );

        var option1 = document.createElement( 'option' );
        option1.innerHTML = "01";
        var option2 = document.createElement( 'option' );
        option2.innerHTML = "05";
        var option3 = document.createElement( 'option' );
        option3.innerHTML = "10";
        var option4 = document.createElement( 'option' );
        option4.innerHTML = "90";

        selectList.appendChild( option1 );
        selectList.appendChild( option2 );
        selectList.appendChild( option3 );
        selectList.appendChild( option4 );

        col4.appendChild( selectList );
        rotationStepListWrapper.appendChild( col4 );

        rotationStepWrapper.appendChild( rotationStepListWrapper );
        btnHolder.appendChild( rotationStepWrapper );
        /********************************************************/
        //Choose step section end
        //=====================================================================

        directionWrapper.appendChild( btnHolder );

        //Spherical rotation controls section start
        var sphericalControlsWrapper = document.createElement( 'div' );
        sphericalControlsWrapper.setAttribute( 'class', 'rot-sphericalcontrols-wrapper' );

        sphericalControlsWrapper.innerHTML = "<strong>"+ editor.languageData.Sphericalcontrols +" : </strong>";

        scope.sphericalControlsToggle = document.createElement( 'button' );
        scope.sphericalControlsToggle.setAttribute( 'class', 'btn btn-default btn-xs rot-sphericalcontrols-toggle-btn' );
        scope.sphericalControlsToggle.setAttribute( 'title', editor.languageData.Togglethesphericalrotationcontrols );
        scope.sphericalControlsToggle.innerHTML = '<span class="fa fa-toggle-off span-font-23" style="color:black"></span>';

        sphericalControlsWrapper.appendChild( scope.sphericalControlsToggle );
        directionWrapper.appendChild( sphericalControlsWrapper );

        scope.sphericalControlsToggle.addEventListener( 'click', function( event ){

            //Turning the Spherical controls off
            if( scope.isSphericalControlsActive === true ){

                scope.isSphericalControlsActive = false;
                scope.sphericalControlsToggle.innerHTML = '<span class="fa fa-toggle-off span-font-23" style="color:black"></span>';
                editor.signals.transformModeChanged.dispatch( 'translate' );

            }
            //Turning the Spherical controls on
            else{

                var obj = editor.selected;

                if( obj!= null && obj!= undefined && obj instanceof THREE.PerspectiveCamera &&  obj.userData.threeDModelType != undefined && ( obj.userData.threeDModelType == "Dome" || obj.userData.threeDModelType == "PTZ" || (obj.userData.threeDModelType == "LiDAR" && obj.sensorCategory === "Hitachi LFOM5") ) ) {

                    toastr.info( editor.languageData.RotationControlsisdisabledforthiscameras );
                    editor.deselect();
                    return;
    
                }

                scope.isSphericalControlsActive = true;
                scope.sphericalControlsToggle.innerHTML = '<span class="fa fa-toggle-on span-font-23 faa-pulse animated" style="color:green"></span>';
                editor.signals.transformModeChanged.dispatch( 'rotate' );

            }

        } );
        //Spherical rotation controls section end

        scope.ui = new UI.MobileWindow( 'rotation-mob-window' );
        scope.ui.setHeading( editor.languageData.RotationControls );
        scope.ui.setBody( directionWrapper );
        document.getElementById( 'editorElement' ).appendChild( scope.ui.dom );
        scope.ui.setDraggable();

        scope.ui.headerCloseBtn.addEventListener( 'click', function( event ){

            scope.hide();
            scope.signals.transformModeChanged.dispatch( 'translate' );

        } );

        scope.xButton.addEventListener( 'click', function( event ){

            /*scope.xButton.className = 'btn btn-danger btn-md';
            scope.yButton.className = 'btn btn-success btn-xs';
            scope.zButton.className = 'btn btn-primary btn-xs';
            scope.rotDirection = 'x';*/
            scope.setDirection( 'x' );

        } );

        scope.yButton.addEventListener( 'click', function( event ){

            /*scope.yButton.className = 'btn btn-success btn-md';
            scope.xButton.className = 'btn btn-danger btn-xs';
            scope.zButton.className = 'btn btn-primary btn-xs';
            scope.rotDirection = 'y';*/
            scope.setDirection( 'y' );

        } );

        scope.zButton.addEventListener( 'click', function( event ){

            /*scope.zButton.className = 'btn btn-primary btn-md';
            scope.xButton.className = 'btn btn-danger btn-xs';
            scope.yButton.className = 'btn btn-success btn-xs';
            scope.rotDirection = 'z';*/
            scope.setDirection( 'z' );

        } );

        selectList.addEventListener( 'change', function( event ){

            scope.rotStep = Number( selectList.value );

        } );

        minusButton.addEventListener( 'click', function( event ){

            if( ( scope.rotDirection === 'x' || scope.rotDirection === 'y' ) && editor.selected instanceof THREE.PerspectiveCamera && editor.selected.camCategory != undefined && editor.selected.camCategory === 'Fixed Dome' ){

                toastr.info( editor.languageData.Domecamerascantberotatedinxorydirection );
                return;

            }
            scope.rotateAntiClockwise();

        } );

        plusButton.addEventListener( 'click', function( event ){

            if( ( scope.rotDirection === 'x' || scope.rotDirection === 'y' ) && editor.selected instanceof THREE.PerspectiveCamera && editor.selected.camCategory != undefined && editor.selected.camCategory === 'Fixed Dome' ){

                toastr.info( editor.languageData.Domecamerascantberotatedinxorydirection );
                return;

            }
            scope.rotateClockwise();

        } );

        /*Search for any simulation screens present on the document and,
        * bring it to back( by reducing the z-index to 1 ) to obtain a cascaded window effect.
        * Also set the z-index of the rotation window UI to a higher value( for example 1000 )
        */
        scope.ui.dom.addEventListener( 'click', function( event ){

            var simScreens = document.getElementsByClassName( 'simulation-wrapper' );
            var simScreensLen = simScreens.length;
            for( var i = 0; i < simScreensLen; i++ ){

                simScreens[ i ].style.zIndex = 1;

            }
            scope.ui.dom.style.zIndex = 1000;

        } );

    },

    /**
     * setMobile( minWidth, minHeight, maxWidth, maxHeight, resizeCallback  ) - Method to resize the table
     * @param {Number} minWidth - Minimum width of the table
     * @param {Number} minHeight - Minimum height of the table
     * @param {Number} maxWidth - Maximum width of the table
     * @param {Number} maxHeight - Maximum height of the table
     * @param {CallBackFunction} resizeCallback - Callback to execute during the resize event
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of setMobile method.</caption>
     * rotationControls.setMobile( minWidth, minHeight, maxWidth, maxHeight, resizeCallback  );
     */

    setMobile : function( minWidth, minHeight, maxWidth, maxHeight, resizeCallback ){

        var scope = this;
        scope.ui.setMobile( minWidth, minHeight, maxWidth, maxHeight, resizeCallback );

    },

    /**
     * setDraggable() - Enables the window to be draggable
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of setDraggable method.</caption>
     * rotationControls.setDraggable( );
    */

    setDraggable : function(){

        var scope = this;
        scope.ui.setDraggable();

    },

   /**
     * setResizable( keepAspectRatio, aspectRatio, minWidth, minHeight, maxWidth, maxHeight, onResize ) - Set the window as resizable
     * @param {Boolean} keepAspectRatio - true or false value that shows whether or not to keep the aspect ratio during resize. Default false.
     * @param {Number} aspectRatio - Aspect ratio that should be kept during simulation. 'keepAspectRatio' should be true for this parameter to have   an effect
     * @param {Number} minWidth - Minimum width that should be maintained during resize event. Required parameter
     * @param {Number} minHeight - Minimum height that should be maintained during resize event. Required parameter
     * @param {Number} maxWidth - Maximum width that should be maintained during resize event. Required parameter
     * @param {Number} maxHeight - Maximum height that should be maintained during resize event. Required parameter
     * @param {CallBackFunction} resizeCallback - Callback to execute during the resize event
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of setResizable method.</caption>
     * rotationControls.setResizable( );
    */ 

    setResizable : function( keepAspectRatio, aspectRatio, minWidth, minHeight, maxWidth, maxHeight, resizeCallback ){

        var scope = this;
        scope.ui.setResizable( keepAspectRatio, aspectRatio, minWidth, minHeight, maxWidth, maxHeight, resizeCallback );

    },

    /**
     * setDirection( direction ) - Method to set the direction, either X, Y or Z
     * @param {String} direction - X, Y or Z direction
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of setDirection method.</caption>
     * rotationControls.setDirection( direction );
     */

    setDirection : function( direction ){

        var scope = this;

        var formattedDirection = direction.toLowerCase();

        if( formattedDirection === 'x' || formattedDirection === 'y' || formattedDirection === 'z' ){

            if( formattedDirection === 'x' ){

                scope.xButton.className = 'btn btn-danger btn-md';
                scope.yButton.className = 'btn btn-success btn-xs';
                scope.zButton.className = 'btn btn-primary btn-xs';

            }
            else if( formattedDirection === 'y' ){

                scope.yButton.className = 'btn btn-success btn-md';
                scope.xButton.className = 'btn btn-danger btn-xs';
                scope.zButton.className = 'btn btn-primary btn-xs';

            }
            else if( formattedDirection === 'z' ){

                scope.zButton.className = 'btn btn-primary btn-md';
                scope.xButton.className = 'btn btn-danger btn-xs';
                scope.yButton.className = 'btn btn-success btn-xs';

            }
            
            scope.rotDirection = formattedDirection;

        }
        else{

            console.warn( '%c\"RotationControls\" : Rotation direction should be either \"x\", \"y\" or \"z\"', "color: yellow; font-style: italic; background-color: blue;padding: 2px" );

        }

    },

    /**
     * rotateInAngle( direction, angleInDegree ) - Method to rotate the object in the specified direction and angle.
     * @param {String} direction - X, Y or Z direction
     * @param {Number} angleInDegree - Degree of rotation
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of rotateInAngle method.</caption>
     * rotationControls.rotateInAngle( direction, angleInDegree );
     */

    rotateInAngle : function( direction, angleInDegree ){

        var scope = this;
        var object = editor.selected;
        var degToEulerFactor = Math.PI / 180;
        
        if( object !== null ){

            if( object instanceof THREE.PerspectiveCamera &&  object.userData.threeDModelType != undefined && (object.userData.threeDModelType == "Dome" || object.userData.threeDModelType == "PTZ" ||( object.userData.threeDModelType == "LiDAR" && object.sensorCategory === "Hitachi LFOM5" ) ) ) {

                toastr.info( editor.languageData.RotationControlsisdisabledforthiscameras );
                editor.deselect();
                return;

            }
            
            switch( direction.toLowerCase() ){

                case "x" :
                    if( object instanceof THREE.PerspectiveCamera && object.camCategory == "Panorama" ){
                        editor.execute( new SetRotationCommand( object, new THREE.Euler( angleInDegree * degToEulerFactor, object.rotation.y, object.rotation.z ) ) );
                        if( simulationManager.panoramaObject[ object.uuid ] != undefined){
                            
                            simulationManager.panoramaObject[ object.uuid ].rotateCubeCamera(angleInDegree * degToEulerFactor, object.rotation.y, object.rotation.z);
                        }
                    }
                    else{

                        editor.execute( new SetRotationCommand( object, new THREE.Euler( angleInDegree * degToEulerFactor, object.rotation.y, object.rotation.z ) ) );
                    }
                    break;
    
                case "y" :
                    if( object instanceof THREE.PerspectiveCamera && object.camCategory == "Panorama" ){
                        editor.execute( new SetRotationCommand( object, new THREE.Euler( object.rotation.x, angleInDegree * degToEulerFactor, object.rotation.z ) ) );
                        if( simulationManager.panoramaObject[ object.uuid ] != undefined){
                                
                            simulationManager.panoramaObject[ object.uuid ].rotateCubeCamera( object.rotation.x, angleInDegree * degToEulerFactor, object.rotation.z);
                        }

                    }
                    else{
                        
                        editor.execute( new SetRotationCommand( object, new THREE.Euler( object.rotation.x, angleInDegree * degToEulerFactor, object.rotation.z ) ) );
                    }
                    break;
    
                case "z" :
                    if( object instanceof THREE.PerspectiveCamera && object.camCategory == "Panorama" ){
                        editor.execute( new SetRotationCommand( object, new THREE.Euler( object.rotation.x, object.rotation.y, angleInDegree * degToEulerFactor ) ) );
                        if( simulationManager.panoramaObject[ object.uuid ] != undefined){
                            

                            simulationManager.panoramaObject[ object.uuid ].rotateCubeCamera( object.rotation.x, object.rotation.y, angleInDegree * degToEulerFactor);
                        }
                    }
                    else{
                        

                        editor.execute( new SetRotationCommand( object, new THREE.Euler( object.rotation.x, object.rotation.y, angleInDegree * degToEulerFactor ) ) );
                    }
                    break;    
    
            }

        }
        
        return;

    },

    /**
     * rotateClockwise( ) - Method to rotate the object in the clockwise direction.
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of rotateClockwise method.</caption>
     * rotationControls.rotateClockwise( );
     */

    rotateClockwise : function(){

        var scope = this;
        var degToEulerFactor = Math.PI / 180;
        var object = editor.selected;
        
        if( object != null ){

            if( object instanceof THREE.PerspectiveCamera &&  object.userData.threeDModelType != undefined && ( object.userData.threeDModelType == "Dome" || object.userData.threeDModelType == "PTZ" || (object.userData.threeDModelType == "LiDAR" && object.sensorCategory === "Hitachi LFOM5" )) ) {

                toastr.info( editor.languageData.RotationControlsisdisabledforthiscameras );
                editor.deselect();
                return;

            }
            
            var curRotateX = object.rotation.x * ( 180 / Math.PI );
            var curRotateY = object.rotation.y * ( 180 / Math.PI );
            var curRotateZ = object.rotation.z * ( 180 / Math.PI );

            switch( scope.rotDirection ){

                case 'x' : 
                    var newRotateX = ( curRotateX + scope.rotStep );
                    if( newRotateX > 360 ){

                        newRotateX = newRotateX - 360;

                    }
                    newRotateX *= degToEulerFactor;
                    if( object instanceof THREE.PerspectiveCamera && object.camCategory == "Panorama" ){
                        editor.execute( new SetRotationCommand( object, new THREE.Euler( newRotateX, object.rotation.y, object.rotation.z ) ) );
                        if( simulationManager.panoramaObject[ object.uuid ] != undefined){
                            simulationManager.panoramaObject[ object.uuid ].rotateCubeCamera( newRotateX, object.rotation.y, object.rotation.z);
                        }
                    }
                    else{
                        editor.execute( new SetRotationCommand( object, new THREE.Euler( newRotateX, object.rotation.y, object.rotation.z ) ) );
                    }
                    break;

                case 'y' :
                    var newRotateY = ( curRotateY + scope.rotStep );
                    if( newRotateY > 360 ){

                        newRotateY = newRotateY - 360;

                    }
                    newRotateY *= degToEulerFactor;
                    if( object instanceof THREE.PerspectiveCamera && object.camCategory == "Panorama" ){
                        editor.execute( new SetRotationCommand( object, new THREE.Euler( object.rotation.x, newRotateY, object.rotation.z ) ) );
                        if( simulationManager.panoramaObject[ object.uuid ] != undefined){
                            simulationManager.panoramaObject[ object.uuid ].rotateCubeCamera( object.rotation.x, newRotateY, object.rotation.z );
                        }
                    }
                    else{
                        editor.execute( new SetRotationCommand( object, new THREE.Euler( object.rotation.x, newRotateY, object.rotation.z ) ) );
                    }
                    break;

                case 'z' :
                    var newRotateZ = ( curRotateZ + scope.rotStep );
                    if( newRotateZ > 360 ){

                        newRotateZ = newRotateZ - 360;

                    }
                    newRotateZ *= degToEulerFactor;
                    if( object instanceof THREE.PerspectiveCamera && object.camCategory == "Panorama" ){
                        editor.execute( new SetRotationCommand( object, new THREE.Euler( object.rotation.x, object.rotation.y, newRotateZ ) ) );
                        if( simulationManager.panoramaObject[ object.uuid ] != undefined){
                            simulationManager.panoramaObject[ object.uuid ].rotateCubeCamera( object.rotation.x, object.rotation.y, newRotateZ );
                        }
                    }
                    else{
                        editor.execute( new SetRotationCommand( object, new THREE.Euler( object.rotation.x, object.rotation.y, newRotateZ ) ) );
                    }
                    break;

            }
            scope.updateUI();
            
        }

    },

    /**
     * rotateAntiClockwise( ) - Method to rotate the object in the anti-clockwise direction.
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of rotateAntiClockwise method.</caption>
     * rotationControls.rotateAntiClockwise( );
     */

    rotateAntiClockwise : function(){

        var scope = this;
        var degToEulerFactor = Math.PI / 180;
        var object = editor.selected;
        
        if( object != null ){

            if( object instanceof THREE.PerspectiveCamera &&  object.userData.threeDModelType != undefined && (object.userData.threeDModelType == "Dome" || object.userData.threeDModelType == "PTZ" || (object.userData.threeDModelType == "LiDAR" && object.sensorCategory === "Hitachi LFOM5" )) ) {

                toastr.info( editor.languageData.RotationControlsisdisabledforthiscameras );
                editor.deselect();
                return;

            }
            
            var curRotateX = object.rotation.x * ( 180 / Math.PI );
            var curRotateY = object.rotation.y * ( 180 / Math.PI );
            var curRotateZ = object.rotation.z * ( 180 / Math.PI );
            
            switch( scope.rotDirection ){

                case 'x' : 
                    var newRotateX = ( curRotateX - scope.rotStep );
                    if( newRotateX < -360 ){

                        newRotateX = newRotateX + 360;

                    }
                    newRotateX *= degToEulerFactor;
                    if( object instanceof THREE.PerspectiveCamera && object.camCategory == "Panorama" ){
                        editor.execute( new SetRotationCommand( object, new THREE.Euler( newRotateX, object.rotation.y, object.rotation.z ) ) );
                        if( simulationManager.panoramaObject[ object.uuid ] != undefined){
                            simulationManager.panoramaObject[ object.uuid ].rotateCubeCamera( newRotateX, object.rotation.y, object.rotation.z );
                        }
                    }
                    else{
                        editor.execute( new SetRotationCommand( object, new THREE.Euler( newRotateX, object.rotation.y, object.rotation.z ) ) );
                    }
                    break;

                case 'y' :
                    var newRotateY = ( curRotateY - scope.rotStep );
                    if( newRotateY < -360 ){

                        newRotateY = newRotateY + 360;

                    }
                    newRotateY *= degToEulerFactor;
                    if( object instanceof THREE.PerspectiveCamera && object.camCategory == "Panorama" ){
                        editor.execute( new SetRotationCommand( object, new THREE.Euler( object.rotation.x, newRotateY, object.rotation.z ) ) );
                        if( simulationManager.panoramaObject[ object.uuid ] != undefined){
                            simulationManager.panoramaObject[ object.uuid ].rotateCubeCamera( object.rotation.x, newRotateY, object.rotation.z );
                        }
                    }
                    else{
                        editor.execute( new SetRotationCommand( object, new THREE.Euler( object.rotation.x, newRotateY, object.rotation.z ) ) );
                    }
                    break;

                case 'z' :
                    var newRotateZ = ( curRotateZ - scope.rotStep );
                    if( newRotateZ < -360 ){

                        newRotateZ = newRotateZ + 360;

                    }
                    newRotateZ *= degToEulerFactor;
                    if( object instanceof THREE.PerspectiveCamera && object.camCategory == "Panorama" ){
                        editor.execute( new SetRotationCommand( object, new THREE.Euler( object.rotation.x, object.rotation.y, newRotateZ ) ) );
                        if( simulationManager.panoramaObject[ object.uuid ] != undefined){
                            simulationManager.panoramaObject[ object.uuid ].rotateCubeCamera( object.rotation.x, object.rotation.y, newRotateZ );
                        }
                    }
                    else{
                        editor.execute( new SetRotationCommand( object, new THREE.Euler( object.rotation.x, object.rotation.y, newRotateZ ) ) );
                    }
                    break;

            }
            scope.updateUI();
            
        }

    },

    /**
     * updateUI() - Updates the user interface of the rotation controls window
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of updateUI method.</caption>
     * rotationControls.updateUI( );
     */
    updateUI : function(){

        var scope = this, radToDeg = 180 / Math.PI;
        var obj = editor.selected;
        
        if( obj !== null ){

            if( obj.name != undefined && obj.name != "" ){
                
                scope.rotationTarget.innerHTML = '<strong>' + obj.name + '</strong>';

            }
            else{
                scope.rotationTarget.innerHTML = '<strong>Object no name</strong>';
            }

            scope.rotXValue.setValue( Number( obj.rotation.x * radToDeg ).toFixed( 2 ) );
            scope.rotYValue.setValue( Number( obj.rotation.y * radToDeg ).toFixed( 2 ) );
            scope.rotZValue.setValue( Number( obj.rotation.z * radToDeg ).toFixed( 2 ) );
        }
        else{
            scope.rotationTarget.innerHTML = '<strong>None selected</strong>';
            scope.rotXValue.setValue( Number( 0.00 ).toFixed( 2 ) );
            scope.rotYValue.setValue( Number( 0.00 ).toFixed( 2 ) );
            scope.rotZValue.setValue( Number( 0.00 ).toFixed( 2 ) );
        
        }

    }

}

RotationControls.prototype.constructor = RotationControls;