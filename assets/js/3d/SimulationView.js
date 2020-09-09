/**
 * SimulationView( editor ) - Constructor function for creating the simulation window
 * @constructor
 * @param {any} editor - The instance of the Editor which manages the overall objects and signals
 * @author Hari
 * @returns {Object}
 * @example <caption>Example usage of SimulationView</caption>
 * var simulationView = new SimulationView( editor );
 */
var SimulationView = function( editor ) {

    var scope = this;

    this.signals = editor.signals;

    //Rendering components start
    this.camera;
    this.hView;
    this.vView;
    this.distance;
    //this.tiltRotationValue = 0;
    //Rendering components end

    this.maxHAOV;
    this.isLive = false;

    //used to check whether roll option of camera is enabled
    if( editor.selected && editor.selected instanceof THREE.PerspectiveCamera && editor.selected.camCategory === "LiDAR" && editor.selected.sensorCategory === "Hitachi LFOM5" )
        this.isRollEnabled = true;
    else 
        this.isRollEnabled = false;
    //used for setting step to rotation
    this.rotStep = 1;

    //unique id for div START
    this.timestamp = Date.now();
    this.wrapperId = 'wrapper-' + Date.now();
    this.previewId = 'preview-' + Date.now();
    this.statusId = 'status-' + Date.now();
    this.headerCloseButtonId = 'header-close-' + Date.now();
    this.headerMinimizeButtonId = 'header-minimize-' + Date.now();
    this.headerMaximizeButtonId = 'header-maximize-' + Date.now();
    this.personObjectId = 'person-' + Date.now();
    this.luggageObjectId = 'luggage-' + Date.now();
    this.spotLightButtonId = 'spotlight-' + Date.now();
    this.spotLightOn = false;
    this.baseModel = '';
    this.simulationAdditionalControls = 'simulation-additional-controls' + Date.now()
    this.simulationControls = "simulation-controls" + Date.now();
    this.isSimulatedMinMax = true;
    this.simulationWrapperHeight;
    //unique id for div END

    this.cameraControlsEnabled = false;
    this.translationValue = 0.1;

    this.setDefaultSize = false;

    //Creating the UI for simulated view
    this.playerWrapperDiv = document.createElement( 'div' );
    this.playerWrapperDiv.setAttribute( 'id', this.wrapperId );
    this.playerWrapperDiv.setAttribute( 'class', 'ui-widget-content simulation-wrapper' );
    this.playerWrapperDiv.style.display = 'none';
    
    //Header section
    this.wrapperHeader = document.createElement( 'div' );
    this.wrapperHeader.setAttribute( 'class', 'simulation-header-div' );
    this.wrapperHeader.setAttribute( 'style', 'text-align:center' );//
    this.wrapperHeader.innerHTML = '<strong style="text-align:center;">'+ editor.languageData.Simulatedviewofcamera+ '</strong>';

    //Header minimize button
    this.wrapperMinimizeBtn = document.createElement( 'button' );
    this.wrapperMinimizeBtn.setAttribute( 'class', 'btn btn-default btn-xs simulation-header-minimize-button' );
    this.wrapperMinimizeBtn.setAttribute( 'id', scope.headerMinimizeButtonId ); 
    this.wrapperMinimizeBtn.innerHTML = '<span class="fa fa-minus"></span>';
    this.wrapperHeader.appendChild( scope.wrapperMinimizeBtn );

    //Header maximize to default button
    this.wrapperMaximizeBtn = document.createElement( 'button' );
    this.wrapperMaximizeBtn.setAttribute( 'class', 'btn btn-default btn-xs simulation-header-maximize-button' );
    this.wrapperMaximizeBtn.setAttribute( 'id', scope.headerMaximizeButtonId ); 
    this.wrapperMaximizeBtn.innerHTML = '<span class="fa fa-plus-circle"></span>';
    this.wrapperHeader.appendChild( scope.wrapperMaximizeBtn );

    //Header close button
    this.wrapperCloseBtn = document.createElement( 'button' );
    this.wrapperCloseBtn.setAttribute( 'class', 'btn btn-default btn-xs simulation-header-close-button' );
    this.wrapperCloseBtn.setAttribute( 'id', scope.headerCloseButtonId );
    this.wrapperCloseBtn.innerHTML = '<span class="fa fa-close"></span>';
    this.wrapperHeader.appendChild( scope.wrapperCloseBtn );

    this.playerWrapperDiv.appendChild( this.wrapperHeader );
    
    this.playerPreviewDiv = document.createElement( 'div' );
    this.playerPreviewDiv.setAttribute( 'id', this.previewId );
    this.playerPreviewDiv.setAttribute( 'class', 'simulation-preview' );
    
    this.playerWrapperDiv.appendChild( this.playerPreviewDiv );

    //simulation controls
    this.controls = document.createElement( 'div' );
    this.controls.setAttribute( 'class', "simulation-controls" );
    this.controls.setAttribute('id',scope.simulationControls);

    //Simulation status
    this.statusButton = document.createElement( 'button' );
    this.statusButton.setAttribute( 'class', 'btn btn-default btn-xs simulation-status' );
    this.statusButton.setAttribute( 'id', scope.statusId );
    this.statusButton.innerHTML = '<span class="fa fa-pause-circle faa-shake animated-hover"></span>'+ editor.languageData.Pause+'';
    this.controls.appendChild( this.statusButton );

    //pause-resume button
    this.pauseButton = document.createElement( 'button' );
    this.pauseButton.setAttribute( 'class', 'btn btn-default btn-xs left-right-margin' );
    this.pauseButton.setAttribute( 'title', editor.languageData.PlayPausesimulation );
    this.pauseButton.innerHTML = '<span class="fa fa-pause-circle-o" style="font-size:20px;"></span>';
    this.controls.appendChild( this.pauseButton );

    //stop button
    this.stopButton = document.createElement( 'button' );
    this.stopButton.setAttribute( 'class', 'btn btn-default btn-xs left-right-margin' );
    this.stopButton.setAttribute( 'title', editor.languageData.Stopsimulation );
    //this.stopButton.setAttribute( 'style', 'color : #d80d0d;' );
    this.stopButton.innerHTML = '<span class="fa fa-stop-circle-o" style="font-size:20px;"></span>';
    this.controls.appendChild( this.stopButton );

    //snapshot button
    this.snapshotButton = document.createElement( 'button' );
    this.snapshotButton.setAttribute('id', 'simulation-snapshot-btn');
    this.snapshotButton.setAttribute( 'class', 'btn btn-default btn-xs left-right-margin' );
    this.snapshotButton.setAttribute( 'title',  editor.languageData.Takesnapshot );
    this.snapshotButton.innerHTML = '<span class="fa fa-camera" style="font-size:20px;"></span>';
    if( localStorage.getItem("viewmode") != "true") {
        this.controls.appendChild( this.snapshotButton );
    }

    //H-View label
    this.hViewLabel = document.createElement( 'label' );
    this.hViewLabel.setAttribute( 'class','label label-primary left-right-margin-label' );
    this.hViewLabel.innerHTML = 'H-View';
    this.controls.appendChild( this.hViewLabel );

    //H-View value
    this.hViewValue = document.createElement( 'input' );
    this.hViewValue.setAttribute( 'class','left-right-margin-label simulation-view-values' );
    this.hViewValue.setAttribute( 'id','h-view-value' );
    this.hViewValue.setAttribute( 'type','number' );
    this.hViewValue.setAttribute( 'title', 'Please enter a valid H-View value' );
    this.hViewValue.innerHTML = '0';
    this.hViewValue.addEventListener( 'change', function ( event ) {
        
        var hViewInTarget = event.target.value;
        var hViewIn3D = hViewInTarget / editor.commonMeasurements.targetConversionFactor;
        var maxHView = scope.camera.hView;
        

        if( maxHView  < hViewIn3D || hViewIn3D <0 ){

            scope.hViewValue.value = (scope.hView * editor.commonMeasurements.targetConversionFactor).toFixed(2);
            toastr.warning( "H-View exceeds camera limit" );
        }
        else{
            var aspect = scope.camera.aspect;

            var vAOV = scope.camera.getEffectiveFOV();

            var hAOV = scope.camera.hFOV;

            var distanceinTarget = hViewInTarget/( 2 * Math.tan( (hAOV/2)* (Math.PI / 180) ) );
            var vViewInTarget = 2 * distanceinTarget * Math.tan( (vAOV/2)* (Math.PI / 180) );

            scope.vViewValue.value = vViewInTarget.toFixed(2);
            scope.distanceValue.value = distanceinTarget.toFixed(2);

            var distancein3D = distanceinTarget / editor.commonMeasurements.targetConversionFactor;
            //scope.distanceSphere.position.z = -(distancein3D);
            scope.distancePlane.position.z = -(distancein3D);

            scope.hView = hViewIn3D;
            scope.vView = vViewInTarget / editor.commonMeasurements.targetConversionFactor;
            scope.distance = distancein3D;

            scope.camera.distance = distancein3D;

            if( scope.hView == 0 || scope.vView == 0 ){
                editor.execute( new SetGeometryCommand( scope.distancePlane, new THREE.PlaneGeometry( 0.01, 0.01 ) ) );
            }
            else {
                editor.execute( new SetGeometryCommand( scope.distancePlane, new THREE.PlaneGeometry( scope.hView, scope.vView ) ) );
            }

            scope.camera.updateProjectionMatrix();

            editor.signals.sceneGraphChanged.dispatch();


        }

    } );
    this.controls.appendChild( this.hViewValue );

    this.hViewUnit = document.createElement( 'label' );
    this.hViewUnit.setAttribute( 'class','left-right-margin-unit-label' );
    this.hViewUnit.innerHTML = "ft";
    this.controls.appendChild( this.hViewUnit );

    //V-View label
    this.vViewLabel = document.createElement( 'label' );
    this.vViewLabel.setAttribute( 'class','label label-primary left-right-margin-label' );
    this.vViewLabel.innerHTML = 'V-View';
    this.controls.appendChild( this.vViewLabel );

    //V-View value
    this.vViewValue = document.createElement( 'input' );
    this.vViewValue.setAttribute( 'class','left-right-margin-label simulation-view-values' );
    this.vViewValue.setAttribute( 'id','v-view-value' );
    this.vViewValue.setAttribute( 'type','number' );
    this.vViewValue.setAttribute( 'title', 'Please enter a valid V-View value' );
    this.vViewValue.innerHTML = '0';
    this.vViewValue.addEventListener( 'change', function ( event ) {
        var vViewInTarget = event.target.value;
        var vViewIn3D = vViewInTarget / editor.commonMeasurements.targetConversionFactor;
        var maxVView = scope.camera.vView;


        if( maxVView < vViewIn3D|| vViewIn3D <0 ){
            
            scope.vViewValue.value = (scope.vView * editor.commonMeasurements.targetConversionFactor).toFixed(2);
            toastr.warning( "V-View exceeds camera limit" );
        }
        else{
            var aspect = scope.camera.aspect;

            var vAOV = scope.camera.getEffectiveFOV();

            var hAOV = scope.camera.hFOV;

            var distanceinTarget = vViewInTarget/( 2 * Math.tan( (vAOV/2)* (Math.PI / 180) ) );
            var hViewInTarget = 2 * distanceinTarget * Math.tan( (hAOV/2)* (Math.PI / 180) );

            scope.hViewValue.value = hViewInTarget.toFixed(2);
            scope.distanceValue.value = distanceinTarget.toFixed(2);

            var distancein3D = distanceinTarget / editor.commonMeasurements.targetConversionFactor;
            //scope.distanceSphere.position.z = -(distancein3D);
            scope.distancePlane.position.z = -(distancein3D);


            scope.hView = hViewInTarget / editor.commonMeasurements.targetConversionFactor;
            scope.vView = vViewIn3D;
            scope.distance = distancein3D;

            scope.camera.distance = distancein3D;

            if( scope.hView == 0 || scope.vView == 0 ){
                editor.execute( new SetGeometryCommand( scope.distancePlane, new THREE.PlaneGeometry( 0.01, 0.01 ) ) );
            }
            else {
                editor.execute( new SetGeometryCommand( scope.distancePlane, new THREE.PlaneGeometry( scope.hView, scope.vView ) ) );
            }

            scope.camera.updateProjectionMatrix();

            editor.signals.sceneGraphChanged.dispatch();


        }

    } );
    this.controls.appendChild( this.vViewValue );

    this.vViewUnit = document.createElement( 'label' );
    this.vViewUnit.setAttribute( 'class','left-right-margin-unit-label' );
    this.vViewUnit.innerHTML = "ft";
    this.controls.appendChild( this.vViewUnit );

    //Distance label
    this.distanceLabel = document.createElement( 'label' );
    this.distanceLabel.setAttribute( 'class','label label-primary left-right-margin-label' );
    this.distanceLabel.innerHTML = 'Distance';
    this.controls.appendChild( this.distanceLabel );

    //Distance value
    this.distanceValue = document.createElement( 'input' );
    this.distanceValue.setAttribute( 'class','left-right-margin-label simulation-view-values' );
    this.distanceValue.setAttribute( 'id','camera-distance-value' );
    this.distanceValue.setAttribute( 'type','number' );
    this.distanceValue.setAttribute( 'title', 'Please enter a valid distance' );
    this.distanceValue.innerHTML = '0';
    this.distanceValue.addEventListener( 'change', function( event ){


        var distanceinTarget = event.target.value;
        var distancein3D = distanceinTarget / editor.commonMeasurements.targetConversionFactor;
        var far = scope.camera.far;

        if( distancein3D > far || distancein3D < 0 ){
            
            scope.distanceValue.value = (scope.distance * editor.commonMeasurements.targetConversionFactor).toFixed(2);
            toastr.warning( "Distance exceeds camera limit" );
        }
        else{
            var aspect = scope.camera.aspect;

            var vAOV = scope.camera.getEffectiveFOV();

            var hAOV = scope.camera.hFOV;

            var hView = 2 * distanceinTarget * Math.tan( (hAOV/2)* (Math.PI / 180) );
            var vView = 2 * distanceinTarget * Math.tan( (vAOV/2)* (Math.PI / 180) );

            scope.hViewValue.value = hView.toFixed(2);
            scope.vViewValue.value = vView.toFixed(2);

            //scope.distanceSphere.position.z = -(distancein3D);
            scope.distancePlane.position.z = -(distancein3D);


            scope.hView = hView / editor.commonMeasurements.targetConversionFactor;
            scope.vView = vView / editor.commonMeasurements.targetConversionFactor;
            scope.distance = distancein3D;

            scope.camera.hView = scope.hView;
            scope.camera.vView = scope.vView;
            scope.camera.distance = distancein3D;

            if( scope.hView == 0 || scope.vView == 0 ){
                editor.execute( new SetGeometryCommand( scope.distancePlane, new THREE.PlaneGeometry( 0.01, 0.01 ) ) );
            }
            else {
                editor.execute( new SetGeometryCommand( scope.distancePlane, new THREE.PlaneGeometry( scope.hView, scope.vView ) ) );
            }

            scope.camera.updateProjectionMatrix();

            editor.signals.sceneGraphChanged.dispatch();
        }

        scope.distanceValue.blur();
    } );
    
    this.controls.appendChild( this.distanceValue );

    this.distanceUnit = document.createElement( 'label' );
    this.distanceUnit.setAttribute( 'class','left-right-margin-unit-label' );
    this.distanceUnit.innerHTML = "ft";
    this.controls.appendChild( this.distanceUnit );
    

    //Controls toggle
    this.tglCtrlBtn = document.createElement( 'button' );
    this.tglCtrlBtn.setAttribute( 'class', 'btn btn-default btn-xs right-align' );
    this.tglCtrlBtn.setAttribute( 'title', editor.languageData.Togglecontrols );
    this.tglCtrlBtn.setAttribute( 'id', 'toggle-controls'+ this.wrapperId );
    this.tglCtrlBtn.innerHTML = '<span class="fa fa-gamepad" style="font-size:20px;"></span>';
    this.controls.appendChild( this.tglCtrlBtn );

    scope.tglCtrlBtn.addEventListener( 'click', function( event ){
        //Modified for Fisheye start
        if(scope.camera.camCategory == 'Fisheye'){
            if(scope.fovSlider.dom.disabled != true){
                scope.fovSlider.dom.disabled = true;
            }
        }
        //Modified for Fisheye end
        

        if( scope.additionalControls.dom.style.display === 'none' ){

            //scope.additionalControls.style.display = 'block';
            scope.zoomSlider.setValue( scope.camera.zoom );
            scope.zoomSlider.setLabelValue(scope.camera.zoom+' x');
            scope.digZoomSlider.setLabelValue(scope.digZoomSlider.dom.value+' x');

            if(scope.camera.opticalZoom != undefined){
                if( scope.camera.opticalZoom == "1x" ){
                    scope.zoomSlider.hide();
                }
                else{
                    var length = scope.camera.opticalZoom.length;
                    var opticalZoomInNum = scope.camera.opticalZoom.substring( 0, length-1 );
                    scope.zoomSlider.setSliderMinMax( 1, opticalZoomInNum );
                }
            }
            
            if(scope.camera.digitalZoom != undefined){
                if( scope.camera.digitalZoom == "1x" ){
                    scope.digZoomSlider.hide();
                }
                else{
                    var length = scope.camera.digitalZoom.length;
                    var digitalZoomInNum = scope.camera.digitalZoom.substring( 0, length-1 );
                    scope.digZoomSlider.setSliderMinMax( 1, digitalZoomInNum );
                }
            } 

            scope.fovSlider.setValue( scope.camera.fov );
            if( scope.camera.minFov !== undefined && scope.camera.maxFov !== undefined ){
        
                scope.fovSlider.setSliderMinMax( scope.camera.minFov, scope.camera.maxFov );
        
            }
            else if( scope.camera.maxFov !== undefined ){
        
                scope.fovSlider.setSliderMinMax( 5, scope.camera.maxFov );
        
            }
            else{
        
                scope.fovSlider.setSliderMinMax( 5, 170 );
        
            }
            scope.nearSlider.setValue( scope.camera.near );
            scope.farSlider.setValue( scope.camera.far );

            scope.additionalControls.dom.style.height = scope.playerWrapperDiv.offsetHeight;
            scope.additionalControls.show();

            /* 
             * Modified to slide the simulation screen to the left when the control buttons are clicked,
             * Change the left position of the screen to fit the total width of the simulation screen. 
             */
            var bBox = scope.playerWrapperDiv.getBoundingClientRect();
            var cntrlsWidth = Number( scope.additionalControls.dom.offsetWidth );
            var vPort = document.getElementById( 'viewport' );
            var screenWidth = bBox.width + cntrlsWidth, viewportWidth = Number( vPort.offsetWidth );
            
            if( Number( bBox.right ) > ( viewportWidth - cntrlsWidth )  ){

                var positionToChange = bBox.right - ( viewportWidth - cntrlsWidth );
                scope.playerWrapperDiv.style.left = ( viewportWidth - screenWidth ) + "px";

            }

        }
        else{

            //scope.additionalControls.style.display = 'none';
            scope.additionalControls.hide();

        }

    } );

    scope.pauseButton.addEventListener( 'click', function( event ){

        scope.pauseButtonClicked( event );

    } );

    scope.stopButton.addEventListener( 'click', function( event ){
        
        scope.stopButtonClicked( event );
        
    } );

    scope.snapshotButton.addEventListener( 'click', function( event ){
        
        scope.snapshotButtonClicked( event );
        
    } );

    scope.playerWrapperDiv.addEventListener( 'click', function( event ){

        scope.signals.simulationScreenClicked.dispatch( scope );

    } );

    scope.playerWrapperDiv.addEventListener( 'contextmenu', function( event ){

        scope.signals.simulationScreenContextmenuRequested.dispatch( event );

    } );

    /*scope.playerWrapperDiv.addEventListener( 'dblclick', function( event ){

        scope.pauseButtonClicked( event );

    } );*/

    scope.wrapperCloseBtn.addEventListener( 'click', function( event ){

        scope.stopButtonClicked( event );

    } );

    scope.wrapperMinimizeBtn.addEventListener( 'click', function( event ){

        var resizeHandlerParent = document.querySelector("#"+scope.wrapperId).getElementsByClassName('ui-resizable-handle');        

        if(scope.isSimulatedMinMax == true){
            
            document.querySelector("#"+scope.previewId).style.display = "none";
            document.querySelector("#"+scope.simulationAdditionalControls).style.display = "none";
            scope.simulationWrapperHeight = document.querySelector("#"+scope.wrapperId).style.height;
            document.querySelector("#"+scope.wrapperId).style.height = "25px";
            document.querySelector("#"+scope.simulationControls).style.display = "none";
            // Disable resize handles
            for( var i = 0; i < resizeHandlerParent.length; i++ ){
                resizeHandlerParent[i].style.display = "none";
            }
            document.querySelector("#"+scope.headerMinimizeButtonId).setAttribute("class","btn btn-default btn-xs simulation-header-minimize-button");
            document.querySelector("#"+scope.headerMinimizeButtonId).innerHTML = '<span class="fa fa-window-maximize"></span>';
            scope.isSimulatedMinMax = false;

        } else {

            document.querySelector("#"+scope.previewId).style.display = "block";
            document.querySelector("#"+scope.simulationAdditionalControls).style.display = "none";
            document.querySelector("#"+scope.wrapperId).style.height = scope.simulationWrapperHeight;
            document.querySelector("#"+scope.simulationControls).style.display = "block";
            
            // Enable resize handles
            for( var i = 0; i < resizeHandlerParent.length; i++ ){
                resizeHandlerParent[i].style.display = "block";
            }
            document.querySelector("#"+scope.headerMinimizeButtonId).setAttribute("class","btn btn-default btn-xs simulation-header-minimize-button ");
            document.querySelector("#"+scope.headerMinimizeButtonId).innerHTML = '<span class="fa fa-minus"></span>';
            scope.isSimulatedMinMax = true;

            // var toggleButton = document.querySelector( "#toggle-controls"+scope.wrapperId );
      
            // if( scope.simulationWrapperHeight < 377.047 ){                  
            //     if( scope.additionalControls.dom.style.display === 'block' ){
            //         toggleButton.click();
            //     }
            //     toggleButton.disabled = true;
            // }
            // else if( scope.simulationWrapperHeight >= 377.047 ){

            //     if( toggleButton.disabled == true ){
            //         toggleButton.disabled = false;
            //     }
            // }

        }

    } );

    scope.wrapperMaximizeBtn.addEventListener( 'click', function(){

        // scope.pauseButton.click();
        // if( scope.isLive === false ){
        //     scope.pauseButton.click();
        // }
        // setTimeout( function(){
        //     if( scope.setDefaultSize === false ){
        //         scope.setToDefault();
        //         scope.setDefaultSize = true;
        //     }
        //     else{
        //         scope.setTomin();    
        //         scope.setDefaultSize = false;
        //     }
        //     scope.signals.simulationResized.dispatch( scope.playerPreviewDiv.offsetWidth, scope.playerPreviewDiv.offsetHeight );
        // } )

        var syncPlaySimulation = new Promise( function( resolve, reject ){
            if( scope.isLive === false ){
                scope.pauseButton.click();
            }
            resolve();
        } );
        
        syncPlaySimulation.then( function(){
            if( scope.setDefaultSize === false ){
                scope.setToDefault();
                scope.setDefaultSize = true;
            }
            else{
                scope.setTomin();    
                scope.setDefaultSize = false;
            }
            scope.signals.simulationResized.dispatch( scope.playerPreviewDiv.offsetWidth, scope.playerPreviewDiv.offsetHeight );
        } );
        
        
    } )

    this.playerWrapperDiv.appendChild( this.controls );

    //Additional controls start
    this.additionalControls = new UI.MobileWindow( scope.simulationAdditionalControls );
    this.additionalControls.setClass("simulation-additional-controls");

    //Additional controls body
    this.ctrlBody = document.createElement( 'div' );
    this.ctrlBody.setAttribute( 'class', 'additional-controls-body' );

    this.cameraControlsDiv = document.createElement( 'div' );

    //Zoom slider
    this.zoomSlider = new UI.SliderWithLabel( 'sim-zoom-slider-container','sim-zoom-slider', editor.languageData.Zoom , '1' );
    this.zoomSlider.setContainerClass( 'slider-container' );
    this.zoomSlider.setLabelClass( 'slider-text' );
    this.zoomSlider.setSliderStep('0.1');  
    this.zoomSlider.setValue( '1' );

    this.cameraControlsDiv.appendChild( this.zoomSlider.container );

    //Listener for 'zoom' range slider value change
    this.zoomSlider.dom.addEventListener( 'input', function( event ){

        scope.zoomSlider.setLabelValue( scope.zoomSlider.dom.value+" x" );
        //scope.camera.zoom = Number( scope.zoomSlider.dom.value );
        editor.execute( new SetValueCommand( scope.camera, 'zoom', Number( scope.zoomSlider.dom.value ) ) );
        if( scope.camera.camCategory != undefined && scope.camera.camCategory != "Fisheye" ){
            
            var distanceInTarget = Number( scope.distanceValue.value );
            var distancein3D = distanceInTarget / editor.commonMeasurements.targetConversionFactor;

            var aspect = scope.camera.aspect;
            var vAOV = scope.camera.getEffectiveFOV();
            var hAOV = vAOV*aspect;
            /*if( scope.camera.maxVerticalAOV != undefined && scope.camera.maxVerticalAOV != "" ){
                var vAOV = scope.camera.getEffectiveFOV();
                var hAOV = scope.camera.hFOV;
                var hAOVInRadians = THREE.Math.degToRad( hAOV )

            }
            else{

                var vAOV = scope.camera.getEffectiveFOV();
                var hAOVInRadians = 2 * Math.atan( Math.tan( THREE.Math.degToRad(vAOV) / 2 ) * aspect );
                var hAOV = THREE.Math.radToDeg(hAOVInRadians);
                //var hAOV = vAOV * aspect;
            }*/

            

            var hView = 2 * distanceInTarget * Math.tan( (hAOV/2)* (Math.PI / 180) );
            var vView = 2 * distanceInTarget * Math.tan( (vAOV/2)* (Math.PI / 180) );

            scope.hView = hView / editor.commonMeasurements.targetConversionFactor;
            scope.vView = vView / editor.commonMeasurements.targetConversionFactor;
            scope.distance = distancein3D;

            /*scope.camera.fov = vAOV;
            scope.camera*/

            scope.hViewValue.value = hView.toFixed(2);
            scope.vViewValue.value = vView.toFixed(2);

            editor.execute( new SetGeometryCommand( scope.distancePlane, new THREE.PlaneGeometry( scope.hView, scope.vView ) ) );
        }

        scope.camera.updateProjectionMatrix();

        //MODIFIED TO INCLUDE CAMERA FRUSTUM UPDATIONS START
        /*if( scope.camera.children[ 1 ] != undefined ){

            if( scope.camera.children[ 1 ].name == 'CameraFrustum' ){

                scope.camera.children[ 1 ].geometry.updateFromCamera( scope.camera );
                editor.signals.sceneGraphChanged.dispatch();
            }

        }*/
        if (scope.camera != undefined) {

            scope.camera.traverse( function( child ) {

                if( child.name === "CameraFrustum" ) {

                    child.geometry.updateFromCamera(scope.camera);
                    editor.signals.sceneGraphChanged.dispatch();

                }

            } ) 

        }
        //MODIFIED TO INCLUDE CAMERA FRUSTUM UPDATIONS END

        

    } );

    //Digital Zoom Slider
    this.digZoomSlider = new UI.SliderWithLabel( 'sim-zoom-slider-container','digital-zoom-slider', editor.languageData.DigitalZoom , '1' );
    this.digZoomSlider.setContainerClass( 'slider-container' );
    this.digZoomSlider.setLabelClass( 'slider-text' ); 
    this.cameraControlsDiv.appendChild( this.digZoomSlider.container );
    
    this.digZoomSlider.setValue( '1' );
    this.digZoomSlider.dom.disabled = true;
    this.digZoomSlider.dom.step = 0.1;
    
    //Listener for 'digital-zoom' range slider value change
    this.digZoomSlider.dom.addEventListener( 'input', function( event ){

        scope.digZoomSlider.setLabelValue( scope.digZoomSlider.dom.value +" x");
        var origImg = simulationManager.screens[ scope.camera.uuid ].snapshotOnPause;
        var zoomRatio;            
        var zoomLevel = event.target.value;
        //zoomRatio = 1 - ( ( 100/scope.digZoomSlider.dom.max ) * ( zoomLevel - 1 ) * 0.01 );
        //zoomRatio = 1 - ( ( zoomLevel - 1 ) * 0.1 );
        zoomRatio = ( 100/zoomLevel * 0.01 );
        var prevId = simulationManager.screens[ scope.camera.uuid ].previewId;
        var targetScreen = document.querySelector( "#" + prevId );
        var lensWidth = targetScreen.offsetWidth * zoomRatio;
        var lensHeight = targetScreen.offsetHeight * zoomRatio;

        var img = new Image();
        img.src = origImg;
        img.width = targetScreen.offsetWidth;
        img.height = targetScreen.offsetHeight;
        var cx = targetScreen.offsetWidth / lensWidth;
        var cy = targetScreen.offsetHeight / lensHeight;
        targetScreen.style.backgroundImage = "url('" + img.src + "')";
        targetScreen.style.backgroundSize = (img.width * cx) + "px " + (img.height * cy) + "px";
        targetScreen.style.backgroundPosition = "center";

    } ); 

    //Camera pan and tilt controls start
    this.tiltpanLabel = document.createElement('div');
    //this.tiltpanLabel.innerHTML = '<span class = "label label-primary">' + 'Pan' + '</span>' + '<span class = "label label-danger">' + 'Tilt' + '</span>';
    this.tiltpanLabel.setAttribute( 'class','tilt-pan-label' );
    this.tiltpanLabel.innerHTML = '<b>'+ editor.languageData.PanTiltRoll + '</b>';
    this.cameraControlsDiv.appendChild(this.tiltpanLabel);

    this.tiltPanControls = document.createElement('div');
    this.tiltPanControls.setAttribute( 'class','tilt-pan-controls' );

    this.tiltCameraUplabel = document.createElement( 'div' );
    this.tiltCameraUplabel.setAttribute( 'class','tilt-camera-up-label' );
    this.tiltUpLabel = document.createElement( 'label' );
    this.tiltUpLabel.innerHTML = "Tilt(+)";
    this.tiltUpLabel.setAttribute( 'id','tilt-up-label' );
    this.tiltCameraUplabel.appendChild( this.tiltUpLabel );
    this.tiltPanControls.appendChild(this.tiltCameraUplabel);

    this.tiltCameraUpRow = document.createElement('div');
    this.tiltCameraUp = document.createElement('button');
    this.tiltCameraUp.setAttribute( 'id','tilt-camera-up' );
    this.tiltCameraUp.setAttribute( 'class','btn btn-danger btn-xs tilt-camera-up' );
    this.tiltCameraUp.innerHTML = '<span class = "fa fa-arrow-up"></span>';
    this.tiltCameraUp.setAttribute( 'title',editor.languageData.TiltCameraUp );

    this.tiltCameraUp.addEventListener( 'click', function(event){

        editor.deselect();
        var object = scope.camera;
        object.userData.timestamp = scope.timestamp;

        if( object.userData.threeDModelType != undefined && object.userData.threeDModelType == "Dome" ) {

            if( object.userData.tiltRotationValue >= 90 ) {

                toastr.info( editor.languageData.Rotationoflensbeyondalimitisdisabled );
                return;

            }

            object.userData.tiltRotationValue = object.userData.tiltRotationValue + scope.rotStep;
            editor.customizedRotation.tiltDomeCameraUp(object,scope.rotStep);

        } else if( object.userData.threeDModelType != undefined && object.userData.threeDModelType == "PTZ" ) {
            
            if( object.userData.tiltRotationValue <= 0 ) {

                toastr.info( editor.languageData.Rotationoflensbeyondalimitisdisabled );
                return;

            }
            
            object.userData.tiltRotationValue = object.userData.tiltRotationValue - scope.rotStep;
            editor.customizedRotation.tiltPTZCamera(object,scope.rotStep,'up');

        } else if( object.userData.threeDModelType != undefined && object.userData.threeDModelType == "LiDAR" && object.sensorCategory === "Hitachi LFOM5" ) {

            if( object.userData.tiltRotationValue >= 0 ) {

                toastr.info( editor.languageData.Rotationoflensbeyondalimitisdisabled );
                return;

            }  

            object.userData.tiltRotationValue = object.userData.tiltRotationValue + scope.rotStep;
            editor.customizedRotation.tiltLidar(object,scope.rotStep,'up',scope.timestamp);

        }
        else {

            object.rotateOnAxis( new THREE.Vector3(1,0,0), THREE.Math.degToRad(scope.rotStep) );
            object.userData.tiltRotationValue = object.userData.tiltRotationValue + scope.rotStep;
            if( object.userData.tiltRotationValue > 360 ) {

                var extraValue = object.userData.tiltRotationValue - 360;
                object.userData.tiltRotationValue = extraValue;

            }
            editor.signals.sceneGraphChanged.dispatch();

        }
        editor.signals.cameraControlsChanged.dispatch( object.userData );

    } );

    this.tiltCameraUpRow.appendChild( this.tiltCameraUp );
    this.tiltPanControls.appendChild( this.tiltCameraUpRow );

    this.panCameraLeftRow = document.createElement('div');
    this.panCameraLeftRow.setAttribute( 'class','pan-camera-row' );

    this.panLeftLabel = document.createElement( 'label' );
    this.panRightLabel = document.createElement( 'label' );
    
    this.panLeftLabel.innerHTML = "Pan(-)" + '&nbsp';
    this.panLeftLabel.setAttribute( 'id','pan-left-label' );
    this.panCameraLeftRow.appendChild( this.panLeftLabel );

    this.panCameraLeft = document.createElement( 'button' );
    this.panCameraLeft.setAttribute( 'id','pan-camera-left' );
    this.panCameraLeft.setAttribute( 'class','btn btn-success btn-xs pan-camera-left' );
    this.panCameraLeft.innerHTML = '<span class = "fa fa-arrow-left"></span>';
    this.panCameraLeft.setAttribute( 'title',editor.languageData.PanCameraLeft );

    this.panCameraLeft.addEventListener( 'click', function(event){

        if( scope.isRollEnabled === true ){

            editor.deselect();
            var object = scope.camera;
            object.userData.timestamp = scope.timestamp;

            if( object.userData.threeDModelType != undefined && object.userData.threeDModelType == "Dome" ){

                editor.customizedRotation.rollDomeCameraLeft(object,scope.rotStep);
                object.userData.rollRotationValue = object.userData.rollRotationValue - scope.rotStep;

                if( object.userData.rollRotationValue < -360 ) {

                    var extraValue = object.userData.rollRotationValue + 360;
                    object.userData.rollRotationValue = extraValue;

                }

            } else if( object.userData.threeDModelType != undefined && object.userData.threeDModelType == "PTZ" ) {

                editor.customizedRotation.rollPTZCamera(object,scope.rotStep,'left');
                object.userData.rollRotationValue = object.userData.rollRotationValue - scope.rotStep;

                if( object.userData.rollRotationValue < -360 ) {

                    var extraValue = object.userData.rollRotationValue + 360;
                    object.userData.rollRotationValue = extraValue;

                }

            } else if( object.userData.threeDModelType != undefined && object.userData.threeDModelType == "LiDAR" ){

                object.rotateOnWorldAxis( new THREE.Vector3(0,1,0), THREE.Math.degToRad(scope.rotStep) );
                object.userData.rollRotationValue = object.userData.rollRotationValue - scope.rotStep;

                if( object.userData.rollRotationValue < -360 ) {

                    var extraValue = object.userData.rollRotationValue + 360;
                    object.userData.rollRotationValue = extraValue;

                }
                editor.signals.sceneGraphChanged.dispatch();

            }
            else {

                object.rotateOnAxis( new THREE.Vector3(0,0,1), THREE.Math.degToRad(scope.rotStep) );
                object.userData.rollRotationValue = object.userData.rollRotationValue - scope.rotStep;

                if( object.userData.rollRotationValue < -360 ) {

                    var extraValue = object.userData.rollRotationValue + 360;
                    object.userData.rollRotationValue = extraValue;

                }
                editor.signals.sceneGraphChanged.dispatch();

            }
            editor.signals.cameraControlsChanged.dispatch( object.userData );
            

        } else{

            editor.deselect();
            var object = scope.camera;
            object.userData.timestamp = scope.timestamp;

            if( object.userData.threeDModelType != undefined && object.userData.threeDModelType == "Dome" ) {

                editor.customizedRotation.panDomeCameraLeft(object,scope.rotStep);
                object.userData.panRotationValue = object.userData.panRotationValue - scope.rotStep;

                if( object.userData.panRotationValue < -360 ) {

                    var extraValue = object.userData.panRotationValue + 360;
                    object.userData.panRotationValue = extraValue;

                }
            
            } else if( object.userData.threeDModelType != undefined && object.userData.threeDModelType == "PTZ" ) {

                editor.customizedRotation.panPTZCamera(object,scope.rotStep,'left');
                object.userData.panRotationValue = object.userData.panRotationValue - scope.rotStep;

                if( object.userData.panRotationValue < -360 ) {

                    var extraValue = object.userData.panRotationValue + 360;
                    object.userData.panRotationValue = extraValue;

                }

            } else if( object.userData.threeDModelType != undefined && object.userData.threeDModelType == "LiDAR" && object.sensorCategory === "Hitachi LFOM5" ) {

                toastr.info( editor.languageData.ThisOperationisRestrictedforLiDARSensors );

            }
            else {

                object.rotateOnAxis( new THREE.Vector3(0,1,0), THREE.Math.degToRad(scope.rotStep) );
                object.userData.panRotationValue = object.userData.panRotationValue - scope.rotStep;

                if( object.userData.panRotationValue < -360 ) {

                    var extraValue = object.userData.panRotationValue + 360;
                    object.userData.panRotationValue = extraValue;

                }
                editor.signals.sceneGraphChanged.dispatch();

            }
            editor.signals.cameraControlsChanged.dispatch( object.userData );

        }

    } );

    this.panCameraLeftRow.appendChild( this.panCameraLeft );

    this.switchPanRollButton = document.createElement( 'button' );
    this.switchPanRollButton.setAttribute( 'id','pan-roll-switch' );
    this.switchPanRollButton.setAttribute( 'class','btn btn-default btn-xs' );
    this.switchPanRollButton.setAttribute( 'title',editor.languageData.SwitchBetweenPanandRoll );
    this.switchPanRollButton.innerHTML = '<span class = "fa fa-refresh"></span>';
    this.panCameraLeftRow.appendChild( this.switchPanRollButton );

    this.switchPanRollButton.addEventListener( 'click', function(event){

        if( scope.isRollEnabled === true ){

            scope.isRollEnabled = false;
            toastr.clear();
            scope.panCameraLeft.setAttribute( 'title',editor.languageData.PanCameraLeft );
            scope.panCameraRight.setAttribute( 'title',editor.languageData.PanCameraRight );
            scope.panLeftLabel.innerHTML = "Pan(-)" + '&nbsp';
            scope.panRightLabel.innerHTML = '&nbsp' + "Pan(+)";
            toastr.success( editor.languageData.CameraPanOptionisEnabled );

        } else {

            scope.isRollEnabled = true;
            toastr.clear();
            scope.panCameraLeft.setAttribute( 'title',editor.languageData.RollCameraLeft );
            scope.panCameraRight.setAttribute( 'title',editor.languageData.RollCameraRight );
            scope.panLeftLabel.innerHTML = "Roll(-)";
            scope.panRightLabel.innerHTML = '&nbsp' + "Roll(+)";
            toastr.success( editor.languageData.CameraRollOptionisEnabled );

        }

    } );

    this.panCameraRight = document.createElement( 'button' );
    this.panCameraRight.setAttribute( 'id','pan-camera-right' );
    this.panCameraRight.setAttribute( 'class','btn btn-success btn-xs pan-camera-right' );
    this.panCameraRight.innerHTML = '<span class = "fa fa-arrow-right"></span>';
    this.panCameraRight.setAttribute( 'title',editor.languageData.PanCameraRight );

    this.panCameraRight.addEventListener( 'click', function(event){

        if( scope.isRollEnabled === true ){

            editor.deselect();
            var object = scope.camera;
            object.userData.timestamp = scope.timestamp;

            if( object.userData.threeDModelType != undefined && object.userData.threeDModelType == "Dome" ){

                editor.customizedRotation.rollDomeCameraRight(object,scope.rotStep);
                object.userData.rollRotationValue = object.userData.rollRotationValue + scope.rotStep;

                if( object.userData.rollRotationValue > 360 ) {

                    var extraValue = object.userData.rollRotationValue - 360;
                    object.userData.rollRotationValue = extraValue;

                }

            } else if( object.userData.threeDModelType != undefined && object.userData.threeDModelType == "PTZ" ) {

                editor.customizedRotation.rollPTZCamera(object,scope.rotStep,'right');
                object.userData.rollRotationValue = object.userData.rollRotationValue + scope.rotStep;

                if( object.userData.rollRotationValue > 360 ) {

                    var extraValue = object.userData.rollRotationValue - 360;
                    object.userData.rollRotationValue = extraValue;

                }

            } else if( object.userData.threeDModelType != undefined && object.userData.threeDModelType == "LiDAR" && object.sensorCategory === "Hitachi LFOM5" ) {

                object.rotateOnWorldAxis( new THREE.Vector3(0,-1,0), THREE.Math.degToRad(scope.rotStep) );
                object.userData.rollRotationValue = object.userData.rollRotationValue + scope.rotStep;

                if( object.userData.rollRotationValue > 360 ) {

                    var extraValue = object.userData.rollRotationValue - 360;
                    object.userData.rollRotationValue = extraValue;

                }
                editor.signals.sceneGraphChanged.dispatch();

            } else {

                object.rotateOnAxis( new THREE.Vector3(0,0,-1), THREE.Math.degToRad(scope.rotStep) );
                object.userData.rollRotationValue = object.userData.rollRotationValue + scope.rotStep;
                if( object.userData.rollRotationValue > 360 ) {

                    var extraValue = object.userData.rollRotationValue - 360;
                    object.userData.rollRotationValue = extraValue;

                }
                editor.signals.sceneGraphChanged.dispatch();

            }
            editor.signals.cameraControlsChanged.dispatch( object.userData );

        } else {

            editor.deselect();
            var object = scope.camera;
            object.userData.timestamp = scope.timestamp;
            
            if( object.userData.threeDModelType != undefined && object.userData.threeDModelType == "Dome" ) {

                editor.customizedRotation.panDomeCameraRight(object,scope.rotStep);
                object.userData.panRotationValue = object.userData.panRotationValue + scope.rotStep;

                if( object.userData.panRotationValue > 360 ) {

                    var extraValue = object.userData.panRotationValue - 360;
                    object.userData.panRotationValue = extraValue;

                }
            
            } else if( object.userData.threeDModelType != undefined && object.userData.threeDModelType == "PTZ" ) {

                editor.customizedRotation.panPTZCamera(object,scope.rotStep,'right');
                object.userData.panRotationValue = object.userData.panRotationValue + scope.rotStep;

                if( object.userData.panRotationValue > 360 ) {

                    var extraValue = object.userData.panRotationValue - 360;
                    object.userData.panRotationValue = extraValue;

                }

            } else if( object.userData.threeDModelType != undefined && object.userData.threeDModelType == "LiDAR" && object.sensorCategory === "Hitachi LFOM5" ) {

                toastr.info( editor.languageData.ThisOperationisRestrictedforLiDARSensors );

            }
            else {

                object.rotateOnAxis( new THREE.Vector3(0,-1,0), THREE.Math.degToRad(scope.rotStep) );
                object.userData.panRotationValue = object.userData.panRotationValue + scope.rotStep;

                if( object.userData.panRotationValue > 360 ) {

                    var extraValue = object.userData.panRotationValue - 360;
                    object.userData.panRotationValue = extraValue;

                }
                editor.signals.sceneGraphChanged.dispatch();

            }
            editor.signals.cameraControlsChanged.dispatch( object.userData );

        }

    } );

    this.panCameraLeftRow.appendChild( this.panCameraRight );

    this.panRightLabel.innerHTML = '&nbsp' + "Pan(+)";
    this.panRightLabel.setAttribute( 'id','pan-right-label' );
    this.panCameraLeftRow.appendChild( this.panRightLabel );

    if( editor.selected && editor.selected instanceof THREE.PerspectiveCamera && editor.selected.camCategory === "LiDAR" && editor.selected.sensorCategory === "Hitachi LFOM5" ){
        scope.isRollEnabled = true;
        scope.panCameraLeft.setAttribute( 'title',editor.languageData.RollCameraLeft );
        scope.panCameraRight.setAttribute( 'title',editor.languageData.RollCameraRight );
        scope.panLeftLabel.innerHTML = "Roll(-)";
        scope.panRightLabel.innerHTML = '&nbsp' + "Roll(+)";
        scope.switchPanRollButton.setAttribute( 'title',"" );
        scope.switchPanRollButton.disabled = true;
    }

    this.tiltPanControls.appendChild( this.panCameraLeftRow );

    this.tiltCameraDownRow = document.createElement('div');
    this.tiltCameraDown = document.createElement('button');
    this.tiltCameraDown.setAttribute( 'id','tilt-camera-down'+ this.timestamp );
    this.tiltCameraDown.setAttribute( 'class','btn btn-danger btn-xs tilt-camera-down' );
    this.tiltCameraDown.innerHTML = '<span class = "fa fa-arrow-down"></span>';
    this.tiltCameraDown.setAttribute( 'title', editor.languageData.TiltCameraDown );

    this.tiltCameraDown.addEventListener( 'click', function(event){

        var object = scope.camera;
        object.userData.timestamp = scope.timestamp;

        if( object.userData.threeDModelType != undefined && object.userData.threeDModelType == "Dome" ) {

            //if( object.userData.tiltRotationValue <= 0 ) {
            if( object.userData.tiltRotationValue <= -90 ) {

                toastr.info( editor.languageData.Rotationoflensbeyondalimitisdisabled );
                return;

            }
            object.userData.tiltRotationValue = object.userData.tiltRotationValue - scope.rotStep;
            editor.customizedRotation.tiltDomeCameraDown(object,scope.rotStep);
     
        } else if( object.userData.threeDModelType != undefined && object.userData.threeDModelType == "PTZ" ) {
            
            if( object.userData.tiltRotationValue >= 180 ) {

                toastr.info( editor.languageData.Rotationoflensbeyondalimitisdisabled );
                return;

            }   
            object.userData.tiltRotationValue = object.userData.tiltRotationValue + scope.rotStep;
            editor.customizedRotation.tiltPTZCamera(object,scope.rotStep,'down');
            
        } else if( object.userData.threeDModelType != undefined && object.userData.threeDModelType == "LiDAR" && object.sensorCategory === "Hitachi LFOM5" ) {

            if( object.userData.tiltRotationValue <= -90 ) {

                toastr.info( editor.languageData.Rotationoflensbeyondalimitisdisabled );
                return;

            }
            object.userData.tiltRotationValue = object.userData.tiltRotationValue - scope.rotStep;
            editor.customizedRotation.tiltLidar(object,scope.rotStep,'down');

        }
        else {

            object.rotateOnAxis( new THREE.Vector3(-1,0,0), THREE.Math.degToRad(scope.rotStep) );
            object.userData.tiltRotationValue = object.userData.tiltRotationValue - scope.rotStep;
            if( object.userData.tiltRotationValue < -360 ) {

                var extraValue = object.userData.tiltRotationValue + 360;
                object.userData.tiltRotationValue = extraValue;

            }
            editor.signals.sceneGraphChanged.dispatch();

        }
        editor.signals.cameraControlsChanged.dispatch( object.userData );

    } );

    this.tiltCameraDownRow.appendChild( this.tiltCameraDown );
    this.tiltPanControls.appendChild( this.tiltCameraDownRow );

    
    this.tiltCameraDownLabel = document.createElement( 'div' );
    this.tiltCameraDownLabel.setAttribute( 'class','tilt-camera-down-label' );
    this.tiltDownLabel = document.createElement( 'label' );
    this.tiltDownLabel.innerHTML = "Tilt(-)";
    this.tiltDownLabel.setAttribute( 'id','tilt-down-label' );
    this.tiltCameraDownLabel.appendChild( this.tiltDownLabel );
    this.tiltPanControls.appendChild(this.tiltCameraDownLabel);

    this.selectListRow = document.createElement( 'div' );
    this.selectList = document.createElement( 'select' );
    this.selectList.setAttribute( 'class', 'form-control height-alignment' );

    this.option1 = document.createElement( 'option' );
    this.option1.innerHTML = '<b>' + "Slow" + '</b>';
    this.option2 = document.createElement( 'option' );
    this.option2.innerHTML = '<b>' + "Medium" + '</b>';
    this.option3 = document.createElement( 'option' );
    this.option3.innerHTML = '<b>' + "Fast" + '</b>';

    this.selectList.appendChild( this.option1 );
    this.selectList.appendChild( this.option2 );
    this.selectList.appendChild( this.option3 );

    this.selectList.addEventListener( 'change', function( event ){

        if( event.target.value === 'Slow' ){

            scope.rotStep = 1;

        } else if( event.target.value === 'Medium' ){

            scope.rotStep = 5;

        } else if( event.target.value === 'Fast' ){

            scope.rotStep = 10;

        }

    } );

    this.selectListRow.appendChild( this.selectList );
    this.tiltPanControls.appendChild( this.selectListRow );

    this.cameraControlsDiv.appendChild( this.tiltPanControls );
    //this.ctrlBody.appendChild( this.tiltCameraDownRow );

    //Camera pan and tilt controls end

     //Pan,Tilt,Roll labels in additional controls

    this.cameraControldiv = document.createElement( 'div' );
    this.cameraControldiv.setAttribute( 'id','camera-control-div' ); 
 
    this.panControlLabel = document.createElement( 'label' );
    this.panControlLabel.setAttribute( 'id','panControlLabel' );
    this.panControlLabel.setAttribute( 'class','panLabelStyle  cameraControlsStyle ' );
    this.panControlLabel.innerHTML = 'Pan : ';
    this.panControlLabelValue = document.createElement('label');
    this.panControlLabelValue.setAttribute('id','panControlLabelValue' + this.timestamp);
    this.panControlLabelValue.innerHTML = "0";
    this.panControlLabel.appendChild(this.panControlLabelValue);

    this.tiltControlLabel = document.createElement( 'label' );
    this.tiltControlLabel.setAttribute( 'id','tiltControlLabel' );
    this.tiltControlLabel.setAttribute( 'class','tiltLabelStyle cameraControlsStyle ' );
    this.tiltControlLabel.innerHTML = 'Tilt : ';
    this.tiltControlLabelValue = document.createElement('label');
    this.tiltControlLabelValue.setAttribute('id','tiltControlLabelValue' + this.timestamp);
    this.tiltControlLabelValue.innerHTML = "0";
    this.tiltControlLabel.appendChild(this.tiltControlLabelValue);
 
    this.rollControlLabel = document.createElement( 'label' );
    this.rollControlLabel.setAttribute( 'id','rollControlLabel' );
    this.rollControlLabel.setAttribute( 'class','rollLabelStyle cameraControlsStyle ' );
    this.rollControlLabel.innerHTML = 'Roll : ';
    this.rollControlLabelValue = document.createElement('label');
    this.rollControlLabelValue.setAttribute('id','rollControlLabelValue' + this.timestamp);
    this.rollControlLabelValue.innerHTML = "0";
    this.rollControlLabel.appendChild(this.rollControlLabelValue);
 
    this.cameraControldiv.appendChild( this.panControlLabel );
    this.cameraControldiv.appendChild( this.tiltControlLabel );
    this.cameraControldiv.appendChild( this.rollControlLabel );

    this.cameraControlsDiv.appendChild( this.cameraControldiv )
    this.ctrlBody.appendChild( this.cameraControlsDiv );

    this.objectShadowHeading = document.createElement( 'div' );
    this.objectShadowHeading.setAttribute( 'class', 'object-shadow-label' );
    this.headingLabel = document.createElement( 'b' );
    this.headingLabel.innerHTML = editor.languageData.ObjectShadow;
    this.objectShadowHeading.appendChild( this.headingLabel );
    if( localStorage.getItem("viewmode") != "true") {
        this.ctrlBody.appendChild( this.objectShadowHeading );
    }
    this.objectControlBody = document.createElement( 'div' );
    this.objectControlBody.setAttribute( 'class', 'additional-object-controls-body' );

    this.translationLabel = document.createElement('div');
    this.translationLabel.setAttribute( 'class','object-translation-label' );
    this.translationLabel.innerHTML = '<b>'+ editor.languageData.Translation + '</b>';
    this.objectControlBody.appendChild(this.translationLabel);

    this.translationControls = document.createElement('div');
    this.translationControls.setAttribute( 'class','tilt-pan-controls' );

    this.moveObjectUplabel = document.createElement( 'div' );
    this.moveObjectUplabel.setAttribute( 'class','tilt-camera-up-label' );
    this.moveUpLabel = document.createElement( 'label' );
    this.moveUpLabel.innerHTML = "Z(+)";
    this.moveUpLabel.setAttribute( 'id','move-up-label' );
    this.moveObjectUplabel.appendChild( this.moveUpLabel );
    this.translationControls.appendChild(this.moveObjectUplabel);

    this.moveObjectUpRow = document.createElement('div');
    this.moveObjectUp = document.createElement('button'); //Add Event Listener
    this.moveObjectUp.setAttribute( 'id','move-object-up' );
    this.moveObjectUp.setAttribute( 'class','btn btn-danger btn-xs move-object-up' );
    this.moveObjectUp.innerHTML = '<span class = "fa fa-arrow-up"></span>';
    this.moveObjectUp.setAttribute( 'title',editor.languageData.TiltCameraUp );

    this.moveObjectUp.addEventListener( 'click', function( event ){

        if( editor.selected instanceof THREE.Group && editor.selected.userData && editor.selected.userData.modelType === "not-a-base-model" ){
            editor.selected.position.z += scope.translationValue;
            editor.signals.sceneGraphChanged.dispatch();
        } else{
            toastr.info( editor.languageData.SelectAnObjectAndTranslate )
        }

    } )

    this.moveObjectUpRow.appendChild( this.moveObjectUp );
    this.translationControls.appendChild( this.moveObjectUpRow );

    this.moveObjectLeftRow = document.createElement('div');
    this.moveObjectLeftRow.setAttribute( 'class','pan-camera-row' );

    this.moveLeftLabel = document.createElement( 'label' );
    
    this.moveRightLabel = document.createElement( 'label' );
    
    this.moveLeftLabel.innerHTML = "X(-)" + '&nbsp';
    this.moveLeftLabel.setAttribute( 'id','move-left-label' );
    this.moveObjectLeftRow.appendChild( this.moveLeftLabel );

    this.moveObjectLeft = document.createElement( 'button' );
    this.moveObjectLeft.setAttribute( 'id','move-object-left' );
    this.moveObjectLeft.setAttribute( 'class','btn btn-success btn-xs pan-camera-left' );
    this.moveObjectLeft.innerHTML = '<span class = "fa fa-arrow-left"></span>';
    this.moveObjectLeft.setAttribute( 'title',editor.languageData.PanCameraLeft );

    this.moveObjectLeft.addEventListener( 'click', function( event ){

        if( editor.selected instanceof THREE.Group && editor.selected.userData && editor.selected.userData.modelType === "not-a-base-model" ){
            editor.selected.position.x -= scope.translationValue;
            editor.signals.sceneGraphChanged.dispatch();
        } else{
            toastr.info( editor.languageData.SelectAnObjectAndTranslate )
        }

    } )

    this.moveObjectLeftRow.appendChild( this.moveObjectLeft );

    this.moveObjectDown = document.createElement( 'button' );
    this.moveObjectDown.setAttribute( 'id','move-object-down' );
    this.moveObjectDown.setAttribute( 'class','btn btn-danger btn-xs move-object-down' );
    this.moveObjectDown.innerHTML = '<span class = "fa fa-arrow-down"></span>';
    this.moveObjectDown.setAttribute( 'title',editor.languageData.PanCameraLeft );

    this.moveObjectDown.addEventListener( 'click', function( event ){

        if( editor.selected instanceof THREE.Group && editor.selected.userData && editor.selected.userData.modelType === "not-a-base-model" ){
            editor.selected.position.z -= scope.translationValue;
            editor.signals.sceneGraphChanged.dispatch();
        } else{
            toastr.info( editor.languageData.SelectAnObjectAndTranslate )
        }

    } )

    this.moveObjectLeftRow.appendChild( this.moveObjectDown );

    this.moveObjectRight = document.createElement( 'button' );
    this.moveObjectRight.setAttribute( 'id','move-object-right' );
    this.moveObjectRight.setAttribute( 'class','btn btn-success btn-xs pan-camera-right' );
    this.moveObjectRight.innerHTML = '<span class = "fa fa-arrow-right"></span>';
    this.moveObjectRight.setAttribute( 'title',editor.languageData.PanCameraRight );

    this.moveObjectRight.addEventListener( 'click', function( event ){

        if( editor.selected instanceof THREE.Group && editor.selected.userData && editor.selected.userData.modelType === "not-a-base-model" ){
            editor.selected.position.x += scope.translationValue;
            editor.signals.sceneGraphChanged.dispatch();
        } else{
            toastr.info( editor.languageData.SelectAnObjectAndTranslate )
        }

    } );

    this.moveObjectLeftRow.appendChild( this.moveObjectRight );

    this.moveRightLabel.innerHTML = '&nbsp' + "X(+)";
    this.moveRightLabel.setAttribute( 'id','move-right-label' );
    this.moveObjectLeftRow.appendChild( this.moveRightLabel );
    this.translationControls.appendChild( this.moveObjectLeftRow );

    this.moveDownLabelRow = document.createElement( 'div' );
    this.moveDownLabelRow.setAttribute( 'class', 'move-down-label-row' )
    this.moveDownLabel = document.createElement( 'label' );
    this.moveDownLabel.innerHTML = "Z(-)" + '&nbsp';
    this.moveDownLabel.setAttribute( 'id','move-down-label' );
    this.moveDownLabelRow.appendChild( this.moveDownLabel );
    this.translationControls.appendChild( this.moveDownLabelRow );

    this.selectListRow = document.createElement( 'div' );
    this.selectList = document.createElement( 'select' );
    this.selectList.setAttribute( 'class', 'form-control height-alignment' );

    this.option1 = document.createElement( 'option' );
    this.option1.innerHTML = '<b>' + "Slow" + '</b>';
    this.option2 = document.createElement( 'option' );
    this.option2.innerHTML = '<b>' + "Medium" + '</b>';
    this.option3 = document.createElement( 'option' );
    this.option3.innerHTML = '<b>' + "Fast" + '</b>';

    this.selectList.appendChild( this.option1 );
    this.selectList.appendChild( this.option2 );
    this.selectList.appendChild( this.option3 );

    this.selectList.addEventListener( 'change', function( event ){

        if( event.target.value === 'Slow' ){

            scope.translationValue = 0.1;

        } else if( event.target.value === 'Medium' ){

            scope.translationValue = 0.5;

        } else if( event.target.value === 'Fast' ){

            scope.translationValue = 1;

        }

    } );

    this.selectListRow.appendChild( this.selectList );
    this.translationControls.appendChild( this.selectListRow );

    this.objectControlBody.appendChild( this.translationControls );
    
    this.rotateObjectLabel = document.createElement( 'div' );
    this.rotateObjectLabel.setAttribute( 'class', 'rotate-object-label' )
    this.rotateObjectLabel.innerHTML = '<b>'+ editor.languageData.Rotation + '</b>'
    this.objectControlBody.appendChild( this.rotateObjectLabel )

    this.objectRotationDiv = document.createElement( 'div' );
    this.objectRotationDiv.setAttribute( 'class', 'object-rotation-div' );

    this.anticlockwiseRotation = document.createElement( 'button' );
    this.anticlockwiseRotation.setAttribute( 'class', 'rotate-object-left' )
    this.anticlockwiseRotation.innerHTML = '<span class = "fa fa-rotate-left " ></span>';

    this.anticlockwiseRotation.addEventListener( 'click', function( event ){

        if( editor.selected && editor.selected.userData && editor.selected.userData.modelType === "not-a-base-model" ){
            var newRotation = new THREE.Euler( 0, editor.selected.rotation.y + THREE.Math.degToRad( -45 ), 0);
            editor.execute(new SetRotationCommand(editor.selected, newRotation ));
        } else{
            toastr.info( editor.languageData.SelectAnObjectAndRotate )
        }

    } );

    this.objectRotationDiv.appendChild( this.anticlockwiseRotation );

    this.clockwiseRotation = document.createElement( 'button' );
    this.clockwiseRotation.setAttribute( 'class', 'rotate-object-right' );
    this.clockwiseRotation.innerHTML = '<span class = "fa fa-rotate-right " ></span>';

    this.clockwiseRotation.addEventListener( 'click', function( event ){

        if( editor.selected && editor.selected.userData && editor.selected.userData.modelType === "not-a-base-model" ){
            var newRotation = new THREE.Euler( 0, editor.selected.rotation.y + THREE.Math.degToRad( 45 ), 0);
            editor.execute(new SetRotationCommand(editor.selected, newRotation ));
        } else{
            toastr.info( editor.languageData.SelectAnObjectAndRotate )
        }

    } )

    this.objectRotationDiv.appendChild( this.clockwiseRotation );

    this.objectControlBody.appendChild( this.objectRotationDiv );

    this.lockObjectLabel = document.createElement( 'div' );
    this.lockObjectLabel.setAttribute( 'class', 'lock-object-label' )
    this.lockObjectLabel.innerHTML = '<b>'+ editor.languageData.LockUnlock +'</b>'
    this.objectControlBody.appendChild( this.lockObjectLabel );

    this.lockObjectButtonDiv = document.createElement( 'div' );
    this.lockObjectButtonDiv.setAttribute( 'class', 'lock-object-to-camera' );
    this.lockObjectButton = document.createElement( 'button' );
    this.lockObjectButton.setAttribute( 'class', 'lock-object-to-cam' );
    this.lockObjectButton.innerHTML = '<span class = "fa fa-lock" ></span>';

    editor.signals.lockedObjectSelected.add( ( object ) => {

        if( object.parent instanceof THREE.Scene )
            scope.lockObjectButton.innerHTML = '<span class = "fa fa-lock" ></span>';
        else if( object.parent instanceof THREE.PerspectiveCamera )
            scope.lockObjectButton.innerHTML = '<span class = "fa fa-unlock" ></span>';

        if( scope.personHeightInput && object && object.userData && object.userData.modelType === "not-a-base-model" ){
            var scaleFactor = object.scale.y;
            if( object.userData.type === "person" ){
                
                if( editor.commonMeasurements.targetUnit === "feet" )
                    scope.personHeightInput.innerHTML = (5*scaleFactor + 0.9).toFixed(1);
                else    
                scope.personHeightInput.innerHTML = ((5*scaleFactor + 0.9)/3.28).toFixed(1);
                
            } else{
                if( editor.commonMeasurements.targetUnit === "feet" )
                    scope.luggagesizeValue.innerText = (10*scaleFactor + 0.3).toFixed(1);
                else    
                scope.luggagesizeValue.innerHTML = ((10*scaleFactor + 0.3)/3.28).toFixed(1);
            }
               
        }

    } );

    this.lockObjectButton.addEventListener( 'click', function(){

        if( editor.selected && editor.selected.userData && editor.selected.userData.modelType === "not-a-base-model" ){
            
            if( editor.selected.parent === editor.scene ){
                THREE.SceneUtils.attach( editor.selected, editor.scene, scope.camera );
                scope.lockObjectButton.innerHTML = '<span class = "fa fa-unlock" ></span>';
            } else if( editor.selected.parent instanceof THREE.Group ){
                THREE.SceneUtils.attach( editor.selected, editor.selected.parent, scope.camera );
                scope.lockObjectButton.innerHTML = '<span class = "fa fa-unlock" ></span>';
            } else{
                THREE.SceneUtils.detach( editor.selected, scope.camera, editor.scene );
                scope.lockObjectButton.innerHTML = '<span class = "fa fa-lock" ></span>';
            }
            
        } else{
            toastr.info( editor.languageData.SelectAnObjectAndLock )
        }

    } )

    this.lockObjectButtonDiv.appendChild( this.lockObjectButton );

    this.objectControlBody.appendChild( this.lockObjectButtonDiv );

    this.personLuggageScaling = document.createElement( 'div' );

    this.personScaling = document.createElement( 'div' );
    this.personScaling.setAttribute( 'class', 'person-scaling' )
    this.personHeightLabel = document.createElement( 'label' );
    this.personHeightLabel.setAttribute( "class", 'person-height' );
    this.personHeightLabel.innerHTML = editor.languageData.PersonHeight;
    this.personScaling.appendChild( this.personHeightLabel );

    this.personHeightInput = document.createElement( 'label' );
    this.personHeightInput.setAttribute( 'class', 'person-height-input' )
    this.personHeightInput.setAttribute( 'id', 'person-height' + scope.timestamp );
    if( editor.commonMeasurements.targetUnit === "feet" )
        this.personHeightInput.innerText = 5.9;
    else    
        this.personHeightInput.innerText = 1.8;
    this.personScaling.appendChild( this.personHeightInput );

    this.personHeightUnit = document.createElement( 'label' );
    this.personHeightUnit.setAttribute( 'id', 'height-unit' + scope.timestamp );
    this.personHeightUnit.innerHTML = editor.commonMeasurements.targetUnit;
    this.personScaling.appendChild( this.personHeightUnit );

    this.incrementHeight = document.createElement( 'button' );
    this.incrementHeight.setAttribute( 'class', 'adjust-height fa fa-plus' );
    this.personScaling.appendChild( this.incrementHeight );

    if( editor.commonMeasurements.targetUnit === "feet" )
        this.conversionFactor = 1;
    else    
        this.conversionFactor = 3.28;

    this.incrementHeight.addEventListener( 'click', function( event ){
        var person = editor.selected;
        if( person && person instanceof THREE.Group && person.userData && person.userData.modelType === "not-a-base-model" && person.userData.type === "person" ){

           var scaleFactor = person.scale.y;
           var personHeightValue = ((5*scaleFactor + 0.9)/scope.conversionFactor).toFixed(1)

           if( personHeightValue >= 2.3*editor.commonMeasurements.targetConversionFactor ){
                //personHeightValue = ( 2.3*editor.commonMeasurements.targetConversionFactor ).toFixed(1);
                return;
           }
           
           personHeightValue = parseFloat( personHeightValue ) + 0.1;
           personHeightValue = personHeightValue.toFixed(1)
           scope.personHeightInput.innerText = personHeightValue;
           person.scale.y += 0.02*scope.conversionFactor; 
        } else{
            toastr.info( editor.languageData.Selectthepersonandthenclick );
        }
    } );

    this.decrementHeight = document.createElement( 'button' );
    this.decrementHeight.setAttribute( 'class', 'adjust-height fa fa-minus' );
    this.personScaling.appendChild( this.decrementHeight );

    
    this.decrementHeight.addEventListener( 'click', function( event ){
        var person = editor.selected;
        if( person && person instanceof THREE.Group && person.userData && person.userData.modelType === "not-a-base-model" && person.userData.type === "person" ){
            
            var scaleFactor = person.scale.y;
            var personHeightValue = ((5*scaleFactor + 0.9)/scope.conversionFactor).toFixed(1);

            if( personHeightValue <= 1.4*editor.commonMeasurements.targetConversionFactor ){
                //scope.personHeightInput.innerText = ( 1.4*editor.commonMeasurements.targetConversionFactor ).toFixed(1);
                return
            }
            personHeightValue = parseFloat( personHeightValue ) - 0.1;
            personHeightValue = personHeightValue.toFixed(1)
            scope.personHeightInput.innerText = personHeightValue;
            
            person.scale.y -= 0.02*scope.conversionFactor; 
        } else{
            toastr.info( editor.languageData.Selectthepersonandthenclick ); 
        }
    } );

    this.personLuggageScaling.appendChild( this.personScaling );

    this.luggageScaling = document.createElement( 'div' );
    this.luggageScaling.setAttribute( 'class', 'luggage-scaling' )
    this.luggagesizeLabel = document.createElement( 'label' );
    this.luggagesizeLabel.setAttribute( 'class', 'luggage-size-label' )
    this.luggagesizeLabel.innerHTML = editor.languageData.LuggageSize;
    this.luggageScaling.appendChild( this.luggagesizeLabel )

    this.luggagesizeValue = document.createElement( 'label' );
    this.luggagesizeValue.setAttribute( 'class', 'luggage-size-input' )
    if( editor.commonMeasurements.targetUnit === "feet" )
        this.luggagesizeValue.innerText = 1.8;
    else    
        this.luggagesizeValue.innerText = 0.5;
    this.luggageScaling.appendChild( this.luggagesizeValue );

    this.luggageSizeUnit = document.createElement( 'label' );
    this.luggageSizeUnit.setAttribute( 'id', 'size-unit' + scope.timestamp );
    this.luggageSizeUnit.innerHTML = editor.commonMeasurements.targetUnit;
    this.luggageScaling.appendChild( this.luggageSizeUnit );


    this.incrementsize = document.createElement( 'button' );
    this.incrementsize.setAttribute( 'class', 'adjust-height fa fa-plus' );
    this.luggageScaling.appendChild( this.incrementsize );

    this.incrementsize.addEventListener( 'click', function( event ){
        var luggage = editor.selected
        if( luggage && luggage instanceof THREE.Group && luggage.userData && luggage.userData.modelType === "not-a-base-model" && (luggage.userData.type === "medium-luggage" || luggage.userData.type === "large-luggage") ){
            
            var scaleFactor = luggage.scale.y;
            var luggagesizeValue = ((10*scaleFactor + 0.3)/scope.conversionFactor).toFixed(1);

            if( luggagesizeValue >= 2.2*editor.commonMeasurements.targetConversionFactor ){
                //scope.luggagesizeValue.innerText = ( 2.2*editor.commonMeasurements.targetConversionFactor ).toFixed(1);
                return;
            }
            luggagesizeValue = parseFloat( luggagesizeValue ) + 0.1;
            luggagesizeValue = luggagesizeValue.toFixed(1)
            scope.luggagesizeValue.innerText = luggagesizeValue;
            
            var valueToScale = luggage.scale.y + 0.01*scope.conversionFactor
            luggage.scale.set( valueToScale, valueToScale, valueToScale );  
        
        } else{
            toastr.info( editor.languageData.SelectTheLuggageandThenClick );
        }
    } )

    this.decrementsize = document.createElement( 'button' );
    this.decrementsize.setAttribute( 'class', 'adjust-height fa fa-minus' );
    this.luggageScaling.appendChild( this.decrementsize );

    this.decrementsize.addEventListener( 'click', function( event ){
        var luggage = editor.selected;
        if( luggage && luggage instanceof THREE.Group && luggage.userData && luggage.userData.modelType === "not-a-base-model" && (luggage.userData.type === "medium-luggage" || luggage.userData.type === "large-luggage") ){
            
            var scaleFactor = luggage.scale.y;
            var luggagesizeValue = ((10*scaleFactor + 0.3)/scope.conversionFactor).toFixed(1);

            if( luggagesizeValue <= 0.5*editor.commonMeasurements.targetConversionFactor ){
                //scope.luggagesizeValue.innerText = ( 0.5*editor.commonMeasurements.targetConversionFactor ).toFixed(1);
                return
            }
            luggagesizeValue = parseFloat( luggagesizeValue ) - 0.1;
            luggagesizeValue = luggagesizeValue.toFixed(1)
            scope.luggagesizeValue.innerText = luggagesizeValue;
            
            var valueToScale = luggage.scale.y - 0.01*scope.conversionFactor
            luggage.scale.set( valueToScale, valueToScale, valueToScale );
        
        } else{
            toastr.info( editor.languageData.SelectTheLuggageandThenClick );
        }
    } )

    this.personLuggageScaling.appendChild( this.luggageScaling );

    this.objectControlBody.appendChild( this.personLuggageScaling );

    editor.signals.measurementConfigurationChanged.add( ( baseUnit, convFactor, targetUnit ) => {
        
        if( targetUnit === "feet" )
            scope.conversionFactor = 1;
        else    
            scope.conversionFactor = 3.28;
        
        var previousUnit = scope.personHeightUnit.innerHTML;
        if( previousUnit != targetUnit ){
            scope.personHeightUnit.innerHTML = targetUnit;
            scope.luggageSizeUnit.innerHTML = targetUnit;
            if( previousUnit === "feet" ){
                scope.personHeightInput.innerText = (parseFloat( scope.personHeightInput.innerText )/3.28).toFixed(1);
                scope.luggagesizeValue.innerText = (parseFloat( scope.luggagesizeValue.innerText )/3.28).toFixed(1);
            } else if( previousUnit === "meter" ){
                scope.personHeightInput.innerText = (parseFloat( scope.personHeightInput.innerText )*3.28).toFixed(1);
                scope.luggagesizeValue.innerText = (parseFloat( scope.luggagesizeValue.innerText )*3.28).toFixed(1);
            }
                
        }
    
    } )

    this.shadowControlDiv = document.createElement( 'div' );
    this.shadowControlDiv.setAttribute( 'class', 'shadow-control-div' );

    this.personObject = document.createElement( 'button' );
    this.personObject.setAttribute( 'class', 'btn btn-default btn-xs left-right-margin shadow-control-style' );
    this.personObject.innerHTML = '<span class = "fa fa-user-circle" style = "font-size:20px;"></span>';
    this.personObject.setAttribute( 'id', scope.personObjectId );
    this.personObject.setAttribute( 'title', editor.languageData.AddPerson );
    this.personObject.addEventListener( 'click', function( child ){
        
        if( editor.scene.userData.personObjectCounter === undefined ){

            editor.scene.userData.personObjectCounter = 1;

        }

        if( this.baseModel === undefined ){
            
            this.baseModel = editor.setBaseModel();
            
        }
        var preloadModels = new PreloadModel(editor);
        var cameraFrustum = scope.camera.children[1];
        var cameraFrustumVertices = scope.camera.children[1].geometry.vertices;
        var cameraFrustumMidPoint = {};
        var personPosition = new THREE.Vector3();
        cameraFrustumMidPoint.x = ( cameraFrustumVertices[0].x + cameraFrustumVertices[7].x )/2;
        cameraFrustumMidPoint.y = ( cameraFrustumVertices[0].y + cameraFrustumVertices[7].y )/2;
        cameraFrustumMidPoint.z = ( cameraFrustumVertices[0].z + cameraFrustumVertices[7].z )/2;
        personPosition.x = cameraFrustumMidPoint.x;
           
        if( this.baseModel != undefined ){
            if( this.baseModel != '' ){
                personPosition.y = this.baseModel.position.y;
            }
            
        } else{
            personPosition.y = cameraFrustumMidPoint.y;
        } 

        personPosition.z = cameraFrustumMidPoint.z/4;
        var personPosWorldCoordinate = cameraFrustum.localToWorld( personPosition );

        if( this.baseModel != '' && this.baseModel != undefined ){
            personPosWorldCoordinate.y = this.baseModel.position.y;
        }

        if( editor.scene.userData.personDeletedNumber != undefined && editor.scene.userData.personDeletedNumber.deletedPersonArray.length > 0 ){
            var personName = "Person" + editor.personObjectDeletedNumber[0];
            editor.personObjectDeletedNumber.splice( 0, 1 );
        } else{
            var personName = "Person" + editor.scene.userData.personObjectCounter;
            editor.scene.userData.personObjectCounter++;
        }     


        function castShadow(){

            setTimeout( () => {
                var castShadowObject = editor.selected;

                if( castShadowObject && castShadowObject instanceof THREE.Group && castShadowObject.userData && castShadowObject.userData.modelType === 'not-a-base-model' ){
                    castShadowObject.children[0].castShadow = true;
                }

            }, 1500 );

        }

        async function loadModel(){
            
            preloadModels.personOrLuggage( personPosWorldCoordinate, personName, "person", { 'x': 1, 'y': 1, 'z': 1 } );
            await castShadow();
        }

        loadModel();


    } )

    this.luggageObject = document.createElement( 'button' );
    this.luggageObject.setAttribute( 'class', 'btn btn-default btn-xs left-right-margin shadow-control-style' );
    this.luggageObject.innerHTML = '<span class = "fa fa-briefcase" style = "font-size:20px;"></span>'
    this.luggageObject.setAttribute( 'id', scope.luggageObjectId );
    this.luggageObject.setAttribute( 'title', editor.languageData.AddLuggage );
    this.luggageObject.addEventListener( 'click', function( child ){
        
        if( editor.scene.userData.luggageObjectCounter === undefined ){
            editor.scene.userData.luggageObjectCounter = 1;
        }

        if( this.baseModel === undefined ){        
            this.baseModel = editor.setBaseModel();         
        }

        var preloadModels = new PreloadModel(editor);
        var cameraFrustum = scope.camera.children[1];
        var cameraFrustumVertices = scope.camera.children[1].geometry.vertices;
        var cameraFrustumMidPoint = {};
        var luggagePosition = new THREE.Vector3();
        cameraFrustumMidPoint.x = ( cameraFrustumVertices[0].x + cameraFrustumVertices[7].x )/2;
        cameraFrustumMidPoint.y = ( cameraFrustumVertices[0].y + cameraFrustumVertices[7].y )/2;
        cameraFrustumMidPoint.z = ( cameraFrustumVertices[0].z + cameraFrustumVertices[7].z )/2;
        luggagePosition.x = cameraFrustumMidPoint.x;
           
        if( this.baseModel != undefined ){
            if( this.baseModel != '' ){
                luggagePosition.y = this.baseModel.position.y;
            }
            
        } else{
            luggagePosition.y = cameraFrustumMidPoint.y;
        } 

        luggagePosition.z = cameraFrustumMidPoint.z/4;
        var luggagePosWorldCoordinate = cameraFrustum.localToWorld( luggagePosition )
        
        if( this.baseModel != '' && this.baseModel != undefined ){
            luggagePosWorldCoordinate.y = this.baseModel.position.y;
        }
        if( editor.scene.userData.luggageDeletedNumber != undefined && editor.scene.userData.luggageDeletedNumber.deletedLuggageArray.length > 0 ){
            var luggageName = "Luggage" + editor.luggageObjectDeletedNumber[0];
            editor.luggageObjectDeletedNumber.splice( 0, 1 );
        } else{
            var luggageName = "Luggage" + editor.scene.userData.luggageObjectCounter;
            editor.scene.userData.luggageObjectCounter++;
        }     

        function castShadow(){

            setTimeout( () => {
                var castShadowObject = editor.selected;
                if( castShadowObject && castShadowObject instanceof THREE.Group && castShadowObject.userData && castShadowObject.userData.modelType === 'not-a-base-model' ){
                    castShadowObject.children[0].castShadow = true;
                }
            }, 1500 );

        }

        async function loadModel(){
            
            preloadModels.personOrLuggage( luggagePosWorldCoordinate, luggageName, "medium-luggage", { 'x': 0.15, 'y': 0.15, 'z': 0.15 } );
            await castShadow();
        }

        loadModel();


    } )

    this.spotLightButton = document.createElement( 'button' );
    this.spotLightButton.setAttribute( 'class', 'btn btn-default btn-xs left-right-margin shadow-control-style' );
    this.spotLightButton.setAttribute( 'id', scope.spotLightButtonId );
    this.spotLightButton.setAttribute( 'title',  editor.languageData.SpotLight );
    this.spotLightButton.addEventListener( 'click', function( event ){
        
        if( !scope.spotLightOn ){
            scope.lightButtonTurnedOn( event );
        } else {
            scope.lightButtonTurnedOff( event )
        }   
            
    } );
    this.spotLightButton.innerHTML = '<span class="fa fa-lightbulb-o" style="font-size:20px;"></span>';

    this.switchControls = document.createElement( 'button' );
    this.switchControls.setAttribute( 'class', 'btn btn-default btn-xs left-right-margin shadow-control-style' );
    this.switchControls.setAttribute( 'id', 'switch-page' );
    this.switchControls.setAttribute( 'title', 'Switch Page' );
    this.switchControls.innerHTML = '<span class="fa fa-exchange" style="font-size:20px;"></span>';
    this.switchControls.addEventListener( 'click', function( event ){

        if( !scope.cameraControlsEnabled ){
            scope.ctrlBody.removeChild( scope.cameraControlsDiv );
            scope.ctrlBody.removeChild( scope.shadowControlDiv );
            scope.ctrlBody.removeChild( scope.objectShadowHeading );
            scope.ctrlBody.appendChild( scope.objectControlBody ); 
            scope.ctrlBody.appendChild( scope.objectShadowHeading ); 
            scope.ctrlBody.appendChild( scope.shadowControlDiv ); 
            toastr.info( editor.languageData.PersonAndLuggageControlsEnabled )
            scope.cameraControlsEnabled = true;
        }
        else{
            scope.ctrlBody.removeChild( scope.objectControlBody );
            scope.ctrlBody.removeChild( scope.shadowControlDiv );
            scope.ctrlBody.removeChild( scope.objectShadowHeading );
            scope.ctrlBody.appendChild( scope.cameraControlsDiv );
            scope.ctrlBody.appendChild( scope.objectShadowHeading );
            scope.ctrlBody.appendChild( scope.shadowControlDiv );
            toastr.info( editor.languageData.CameraControlsEnabled )
            scope.cameraControlsEnabled = false;

        }

    } )

    this.shadowControlDiv.appendChild( this.personObject );
    this.shadowControlDiv.appendChild( this.luggageObject );
    this.shadowControlDiv.appendChild( this.spotLightButton );
    this.shadowControlDiv.appendChild( this.switchControls );
    if( localStorage.getItem("viewmode") != "true") {
        this.ctrlBody.appendChild( this.shadowControlDiv );
    }
   

    //FOV slider
    this.fovSlider = new UI.SliderWithLabel( 'sim-zoom-slider-container','sim-zoom-slider', editor.languageData.Fov , '50' );
    this.fovSlider.setContainerClass( 'slider-container' );
    this.fovSlider.setLabelClass( 'slider-text' );
    
    this.ctrlBody.appendChild( this.fovSlider.container );

    //Listener for 'fov' range slider value change
    this.fovSlider.dom.addEventListener( 'input', function( event ){

        scope.fovSlider.setLabelValue( scope.fovSlider.dom.value );
        //scope.camera.fov = Number( scope.fovSlider.dom.value );
        editor.execute( new SetValueCommand( scope.camera, 'fov', Number( scope.fovSlider.dom.value ) ) );
        scope.camera.updateProjectionMatrix();

        //MODIFIED TO INCLUDE CAMERA FRUSTUM UPDATIONS START
        /*if( scope.camera.children[ 1 ] != undefined ){

            if( scope.camera.children[ 1 ].name == 'CameraFrustum' ){

                scope.camera.children[ 1 ].geometry.updateFromCamera( scope.camera );
                editor.signals.sceneGraphChanged.dispatch();
            }

        }*/
        if (scope.camera != undefined) {

            scope.camera.traverse( function( child ) {

                if( child.name === "CameraFrustum" ) {

                    child.geometry.updateFromCamera(scope.camera);
                    editor.signals.sceneGraphChanged.dispatch();

                }

            } ) 

        }
        //MODIFIED TO INCLUDE CAMERA FRUSTUM UPDATIONS END

    } );

    this.fovSlider.hide(); // Hidden the FOV slider as per the requirement.

    //Near slider
    this.nearSlider = new UI.SliderWithLabel( 'sim-zoom-slider-container','sim-zoom-slider', editor.languageData.Near, '1' );
    this.nearSlider.setContainerClass( 'slider-container' );
    this.nearSlider.setLabelClass( 'slider-text' );
    this.nearSlider.setSliderValue( 1 );
    this.nearSlider.setSliderMinMax( 1, 100 );
    this.ctrlBody.appendChild( this.nearSlider.container );

    //Listener for 'near' range slider value change
    this.nearSlider.dom.addEventListener( 'input', function( event ){

        if( Number( scope.nearSlider.getSliderValue() ) >= Number( scope.farSlider.getSliderValue() ) ){

            scope.nearSlider.setValue( Number( scope.farSlider.getSliderValue() ) - 1 );
           // toastr.warning( '\"near\" should be less than \"far\"' );
            toastr.warning(editor.languageData.nearshouldbelessthanfar );

            editor.execute( new SetValueCommand( scope.camera, 'near', Number( scope.farSlider.getSliderValue() ) - 1 ) );
            scope.camera.updateProjectionMatrix();

            //MODIFIED TO INCLUDE CAMERA FRUSTUM UPDATIONS START
            /*if( scope.camera.children[ 1 ] != undefined ){

                if( scope.camera.children[ 1 ].name == 'CameraFrustum' ){

                    scope.camera.children[ 1 ].geometry.updateFromCamera( scope.camera );
                    
                }

            }*/
            if (scope.camera != undefined) {

                scope.camera.traverse( function( child ) {
    
                    if( child.name === "CameraFrustum" ) {
    
                        child.geometry.updateFromCamera(scope.camera);
    
                    }
    
                } ) 
    
            }
            //MODIFIED TO INCLUDE CAMERA FRUSTUM UPDATIONS END

            return;

        }
        
        scope.nearSlider.setLabelValue( scope.nearSlider.dom.value );
        editor.execute( new SetValueCommand( scope.camera, 'near', Number( scope.nearSlider.dom.value ) ) );
        scope.camera.updateProjectionMatrix();

        //MODIFIED TO INCLUDE CAMERA FRUSTUM UPDATIONS START
        /*if( scope.camera.children[ 1 ] != undefined ){

            if( scope.camera.children[ 1 ].name == 'CameraFrustum' ){

                scope.camera.children[ 1 ].geometry.updateFromCamera( scope.camera );

            }

        }*/
        if (scope.camera != undefined) {

            scope.camera.traverse( function( child ) {

                if( child.name === "CameraFrustum" ) {

                    child.geometry.updateFromCamera(scope.camera);

                }

            } ) 

        }
        //MODIFIED TO INCLUDE CAMERA FRUSTUM UPDATIONS END

    } );

    this.nearSlider.hide(); // Hidden the Near slider as per the requirement.

    //Far slider
    this.farSlider = new UI.SliderWithLabel( 'sim-zoom-slider-container','sim-zoom-slider', editor.languageData.Far, '50' );
    this.farSlider.setContainerClass( 'slider-container' );
    this.farSlider.setLabelClass( 'slider-text' );
    this.farSlider.setSliderMinMax( 1, 100 );
    this.ctrlBody.appendChild( this.farSlider.container );

    //Listener for 'far' range slider value change
    this.farSlider.dom.addEventListener( 'input', function( event ){

        if( Number( scope.nearSlider.getSliderValue() ) >= Number( scope.farSlider.getSliderValue() ) ){

            scope.farSlider.setValue( Number( scope.nearSlider.getSliderValue() ) + 1 );
           // toastr.warning( '\"far\" should be greater than \"near\"' );
            toastr.warning( editor.languageData.farshouldbegreaterthannear);
 
            editor.execute( new SetValueCommand( scope.camera, 'far', Number( scope.nearSlider.getSliderValue() ) + 1 ) );
            scope.camera.updateProjectionMatrix();

            //MODIFIED TO INCLUDE CAMERA FRUSTUM UPDATIONS START
            /*if( scope.camera.children[ 1 ] != undefined ){

                if( scope.camera.children[ 1 ].name == 'CameraFrustum' ){

                    scope.camera.children[ 1 ].geometry.updateFromCamera( scope.camera );

                }

            }*/
            if (scope.camera != undefined) {

                scope.camera.traverse( function( child ) {
    
                    if( child.name === "CameraFrustum" ) {
    
                        child.geometry.updateFromCamera(scope.camera);
    
                    }
    
                } ) 
    
            }
            //MODIFIED TO INCLUDE CAMERA FRUSTUM UPDATIONS END

            return;

        }

        scope.farSlider.setLabelValue( scope.farSlider.dom.value );
        editor.execute( new SetValueCommand( scope.camera, 'far', Number( scope.farSlider.dom.value ) ) );
        scope.camera.updateProjectionMatrix();

        //MODIFIED TO INCLUDE CAMERA FRUSTUM UPDATIONS START
        /*if( scope.camera.children[ 1 ] != undefined ){

            if( scope.camera.children[ 1 ].name == 'CameraFrustum' ){

                scope.camera.children[ 1 ].geometry.updateFromCamera( scope.camera );

            }

        }*/
        if (scope.camera != undefined) {

            scope.camera.traverse( function( child ) {

                if( child.name === "CameraFrustum" ) {

                    child.geometry.updateFromCamera(scope.camera);

                }

            } ) 

        }
        //MODIFIED TO INCLUDE CAMERA FRUSTUM UPDATIONS END

    } );

    this.farSlider.hide(); // Hidden the Far slider as per the requirement.

    this.additionalControls.setHeading( editor.languageData.Additionalcontrols );
    this.additionalControls.setBody( this.ctrlBody );
    //this.additionalControls.setBody( this.objectControlBody );
    
    //this.additionalControls.appendChild( this.zoomSlider );
    this.playerWrapperDiv.appendChild( this.additionalControls.dom );
    //Additional controls end

    //Listener for the simulation controls update request signal 
    editor.signals.updateSimulationControls.add( function( object ){

        if( object.uuid === scope.camera.uuid ) scope.updateControls();

    } );

    /*var geometry = new THREE.SphereGeometry( 0.2, 10, 10 );
    var material = new THREE.MeshBasicMaterial( {color: 0xff0000} );
    this.distanceSphere = new THREE.Mesh( geometry, material );
    this.distanceSphere.name = "DistanceSphere";*/

    var geometry = new THREE.PlaneGeometry( 1, 1 );
    var material = new THREE.MeshBasicMaterial( {color: 0xcd0000, side: THREE.DoubleSide} );
    material.transparent = true;
    material.opacity = 0.3;
    this.distancePlane = new THREE.Mesh( geometry, material );
    this.distancePlane.name = "DistancePlane";


    return this;

};

SimulationView.prototype = {

    /**
     * show() - sets the visibility to 'block'.
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of show method.</caption>
     * simulationView.show( );
     */
    show : function(){
        
        var scope = this;
        this.playerWrapperDiv.style.display = 'block';
        /*if( scope.camera.opticalZoom == "1x" && scope.camera.digitalZoom == "1x" ){
            scope.tglCtrlBtn.disabled = true;
        }*/
        if( scope.camera.camCategory != undefined && scope.camera.camCategory == "Fisheye" ){
            scope.distanceLabel.style.visibility = "hidden";
            scope.distanceValue.style.visibility = "hidden";
            scope.distanceUnit.style.visibility = "hidden";
            scope.hViewValue.style.visibility = "hidden";
            scope.hViewLabel.style.visibility = "hidden";
            scope.hViewUnit.style.visibility = "hidden";
            scope.vViewLabel.style.visibility = "hidden";
            scope.vViewValue.style.visibility = "hidden";
            scope.vViewUnit.style.visibility = "hidden";
        }

        var wrapperHeight = (370.313 / scope.camera.aspect);
        var previewHeight = (370.313 / scope.camera.aspect)-65;
        this.playerWrapperDiv.setAttribute( 'style', 'height:'+ wrapperHeight + 'px' );
        this.playerPreviewDiv.setAttribute( 'style', 'height:'+ previewHeight +'px' );


        // if( this.playerWrapperDiv.style.width < 670.313 ){
            scope.statusButton.style.visibility = "hidden";
            scope.hViewLabel.style.visibility = "hidden";
            scope.hViewUnit.style.visibility = "hidden";
            scope.hViewValue.style.visibility = "hidden";
            scope.vViewLabel.style.visibility = "hidden";
            scope.vViewValue.style.visibility = "hidden";
            scope.vViewUnit.style.visibility = "hidden";
            scope.distanceLabel.style.visibility = "hidden";
            scope.distanceValue.style.visibility = "hidden";
            scope.distanceUnit.style.visibility = "hidden";
        // }
        // else if( this.playerWrapperDiv.style >= 670.313 ){
            // scope.statusButton.style.visibility = "visible";
            // scope.hViewLabel.style.visibility = "visible";
            // scope.hViewUnit.style.visibility = "visible";
            // scope.hViewValue.style.visibility = "visible";
            // scope.vViewLabel.style.visibility = "visible";
            // scope.vViewValue.style.visibility = "visible";
            // scope.vViewUnit.style.visibility = "visible";
            // scope.distanceLabel.style.visibility = "visible";
            // scope.distanceValue.style.visibility = "visible";
            // scope.distanceUnit.style.visibility = "visible";
        // } 
        var toggleButton = document.querySelector( "#toggle-controls"+scope.wrapperId );
       // var heightWithinPx = this.style.height;
        //addlCntrlheight = heightWithinPx.substring( 0, heightWithinPx.length-2 );
        if( wrapperHeight < 408 ){                  
            if( scope.additionalControls.dom.style.display === 'block' ){
                toggleButton.click();
            }
            toggleButton.disabled = true;
        }
        else if( wrapperHeight >= 408 ){

            if( toggleButton.disabled == true ){
                toggleButton.disabled = false;
            }
        }


        // if( scope.camera.camCategory === "LiDAR" ){

        //     var wrapperHeight = (670.313 / scope.camera.aspect)-516.75;
        //     var previewHeight = (670.313 / scope.camera.aspect)-581.750;
        //     this.playerWrapperDiv.setAttribute( 'style', 'height:'+ wrapperHeight + 'px' );
        //     this.playerPreviewDiv.setAttribute( 'style', 'height:'+ previewHeight +'px' );
        // }

    },

    /**
     * hide() - sets the visibility to 'none'.
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of hide method.</caption>
     * simulationView.hide( );
     */
    hide : function(){
        
        this.playerWrapperDiv.style.display = 'none';

    },

    /**
     * bringToFront( ) - Method to bring the window to front
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of bringToFront method.</caption>
     * simulationView.bringToFront( );
     */
    bringToFront : function(){

        var scope = this;
        scope.playerWrapperDiv.style.zIndex = 1000;
        scope.playerWrapperDiv.style.backgroundColor = '#ffffff';

    },

    /**
     * sendToBack( ) - Method to send the window to back
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of sendToBack method.</caption>
     * simulationView.sendToBack( );
     */
    sendToBack : function(){
        
        var scope = this;
        scope.playerWrapperDiv.style.zIndex = 1;
        scope.playerWrapperDiv.style.backgroundColor = '#eeeeee';

    },

    /**
     * setAsPaused( background ) - Method to set paused mode for UI.
     * @param {String} background - The background image to be set on the paused screen. Should be base64.
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of setAsPaused method.</caption>
     * simulationView.setAsPaused( background );
     */

    setAsPaused : function( background ){

        var scope = this;
        
        // if( scope.spotLightOn ){
        //     console.log( scope.spotLightOn );
        //     scope.lightButtonTurnedOff( event );
        // }
        if( scope.personObject && scope.personObject.disabled === false )
            scope.personObject.disabled = true;
        if( scope.luggageObject && scope.luggageObject.disabled === false )
            scope.luggageObject.disabled = true;
        if( scope.spotLightButton && scope.spotLightButton.disabled === false )
            scope.spotLightButton.disabled = true;
            
        scope.isLive = false;
        scope.pauseButton.innerHTML = '<span class="fa fa-play-circle-o" style="font-size:20px;"></span>';

        scope.statusButton.style.color = "red";
        scope.statusButton.innerHTML = '<span class="fa fa-pause-circle faa-shake animated-hover" style="font-size:15px;"></span>'+ editor.languageData.Pause;

        //scope.snapshotButton.disabled = true; //Commented to take snapshot when camera is paused
        this.digZoomSlider.dom.disabled = false;

        var renderDom = scope.playerPreviewDiv.firstChild;
        if( renderDom != null && renderDom != undefined ){

            renderDom.parentNode.removeChild( renderDom );

        }

        if( background != undefined ){

            scope.snapshotOnPause = background;
            document.getElementById( scope.previewId ).style.background = 'url( "' + background + '" )';
            document.getElementById( scope.previewId ).style.backgroundSize = '100% 100%';

        }
        if( scope.distancePlane != undefined ){
            scope.distancePlane.visible = false;
        }

    },

    /**
     * setAsLive( ) - Method to set live mode for UI.
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of setAsLive method.</caption>
     * simulationView.setAsLive( );
     */

    setAsLive : function(){
        
        var scope = this;
        scope.isLive = true;

        if( scope.personObject && scope.personObject.disabled === true )
            scope.personObject.disabled = false;
        if( scope.luggageObject && scope.luggageObject.disabled === true )
            scope.luggageObject.disabled = false;
        if( scope.spotLightButton && scope.spotLightButton.disabled === true )
            scope.spotLightButton.disabled = false;

        var baseUnitAbbrevation, targetUnitAbbrevation;

        baseUnitAbbrevation = (  editor.commonMeasurements.baseUnit == "meter")? "m": "ft";
        targetUnitAbbrevation = ( editor.commonMeasurements.targetUnit == "feet" )? "ft" : "m";

        //scope.wrapperHeader.innerHTML = '<strong style="text-align:center;">Simulated view of camera: ' + scope.camera.badgeText + '</strong><button class="btn btn-default btn-xs simulation-header-close-button" id=' + scope.headerCloseButtonId + '><span class="fa fa-close"></span></button>';
        scope.wrapperHeader.innerHTML = '<strong style="text-align:center;">'+editor.languageData.Simulatedviewofcamera  + scope.camera.badgeText + '</strong>';
        scope.wrapperHeader.appendChild( scope.wrapperCloseBtn );
        scope.wrapperHeader.appendChild( scope.wrapperMinimizeBtn ); // Added minimize button
        scope.wrapperHeader.appendChild( scope.wrapperMaximizeBtn ); 

        scope.pauseButton.innerHTML = '<span class="fa fa-pause-circle-o" style="font-size:20px;"></span>';

        scope.statusButton.style.color = "green";
        scope.statusButton.innerHTML = '<span class="fa fa-play-circle faa-flash animated" style="font-size: 15px;"></span>'+ editor.languageData.Live+'';
        //scope.snapshotButton.disabled = false; //Commented to take snapshot when camera is paused
        
        scope.digZoomSlider.dom.disabled = true;
        scope.digZoomSlider.setValue( '1' );
        scope.digZoomSlider.setLabelValue('1 x');

        if( scope.camera.camCategory != "Fisheye" ){

            if( scope.hView == undefined && scope.vView == undefined  && scope.distance ==undefined){

                var aspect = scope.camera.aspect;
                var vAOV = scope.camera.fov;
                var hAOV = scope.camera.hFOV;

                var distance = scope.camera.distance;
    
                var hView = 2 * distance * Math.tan( (hAOV/2)* (Math.PI / 180) );
                var vView = 2 * distance * Math.tan( (vAOV/2)* (Math.PI / 180) );
    
                scope.camera.hView = hView;
                scope.camera.vView = vView;
    
                scope.hViewValue.value = (scope.camera.hView * editor.commonMeasurements.targetConversionFactor ).toFixed(2);
                this.hViewUnit.innerHTML = targetUnitAbbrevation;
                scope.vViewValue.value = (scope.camera.vView * editor.commonMeasurements.targetConversionFactor ).toFixed(2);
                this.vViewUnit.innerHTML = targetUnitAbbrevation;
                scope.distanceValue.value = (scope.camera.distance * editor.commonMeasurements.targetConversionFactor ).toFixed(2);
                this.distanceUnit.innerHTML = targetUnitAbbrevation;
                scope.hView = scope.camera.hView;
                scope.vView = scope.camera.vView;
                scope.distance = scope.camera.distance;
                
                if( scope.hView == 0 || scope.vView == 0 ){
                    editor.execute( new SetGeometryCommand( scope.distancePlane, new THREE.PlaneGeometry( 0.01, 0.01 ) ) );
                }
                else {
                    editor.execute( new SetGeometryCommand( scope.distancePlane, new THREE.PlaneGeometry( scope.hView, scope.vView ) ) );
                }
    
            }
            else if(scope.hView != undefined && scope.vView != undefined  && scope.distance !=undefined){
                scope.hViewValue.value = (scope.hView * editor.commonMeasurements.targetConversionFactor ).toFixed(2);
                this.hViewUnit.innerHTML = targetUnitAbbrevation;
                scope.vViewValue.value = (scope.vView * editor.commonMeasurements.targetConversionFactor ).toFixed(2);
                this.vViewUnit.innerHTML = targetUnitAbbrevation;
                scope.distanceValue.value = (scope.distance * editor.commonMeasurements.targetConversionFactor ).toFixed(2);
                this.distanceUnit.innerHTML = targetUnitAbbrevation;
    
                scope.distancePlane.visible = true;
            }
            
    
            if( scope.camera.children[2] == undefined  ){
                /*scope.distanceSphere.position.x = 0;
                scope.distanceSphere.position.y = 0;
                scope.distanceSphere.position.z = -(scope.camera.distance);
                scope.camera.add(scope.distanceSphere);*/
    
                scope.distancePlane.position.x = 0;
                scope.distancePlane.position.y = 0;
                scope.distancePlane.position.z = -(scope.camera.distance);
                scope.camera.add(scope.distancePlane);
            }
            /*else if( scope.camera.children[2] != undefined  && scope.camera.children[2].name == "DistanceSphere" ){
                scope.distanceSphere.visible = true;
            }*/
            else if( scope.camera.children[2] != undefined  && scope.camera.children[2].name == "DistancePlane" ){
                scope.distancePlane.visible = true;
            }

        }
               
    },

    /**
     * setResizable( keepAspectRatio, aspectRatio ) - Method to set the element dimensions as resizable.
     * @param {Boolean} keepAspectRatio - Determines whether aspect ratio should be kept or not. Default is false
     * @param {Number} aspectRatio - Number specifying the aspect ratio value. This field have effect only when keepAspectRatio is true 
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of setResizable method.</caption>
     * simulationView.setResizable( );
     */

    setResizable : function( keepAspectRatio, aspectRatio ){

        var scope = this;
        var ratio = ( keepAspectRatio === true )? ( ( typeof( aspectRatio ) == 'number' )? aspectRatio : 1 ) : false;

        $( '#' + this.wrapperId ).resizable( {
            aspectRatio : ratio,
            alsoResize : "#" + this.previewId,
            //minWidth : 604.331,
            // minHeight : 100,
            // minWidth : 670.313,
            minWidth: 250,
            minHeight : 190,
            //minHeight : 194.422,
            // maxWidth : 922.917,
            //maxHeight : 521.422,
            resize : function( event, ui ){

                var styleWidthinPx = event.target.style.width;
                var styleWidthLength = event.target.style.width.length;
                var styleWidth = styleWidthinPx.substring( 0, styleWidthLength-2 );
                if( styleWidth < 670.313 ){
                    scope.statusButton.style.visibility = "hidden";
                    scope.hViewLabel.style.visibility = "hidden";
                    scope.hViewUnit.style.visibility = "hidden";
                    scope.hViewValue.style.visibility = "hidden";
                    scope.vViewLabel.style.visibility = "hidden";
                    scope.vViewValue.style.visibility = "hidden";
                    scope.vViewUnit.style.visibility = "hidden";
                    scope.distanceLabel.style.visibility = "hidden";
                    scope.distanceValue.style.visibility = "hidden";
                    scope.distanceUnit.style.visibility = "hidden";
                }
                else if( styleWidth >= 670.313 ){
                    scope.statusButton.style.visibility = "visible";
                    scope.hViewLabel.style.visibility = "visible";
                    scope.hViewUnit.style.visibility = "visible";
                    scope.hViewValue.style.visibility = "visible";
                    scope.vViewLabel.style.visibility = "visible";
                    scope.vViewValue.style.visibility = "visible";
                    scope.vViewUnit.style.visibility = "visible";
                    scope.distanceLabel.style.visibility = "visible";
                    scope.distanceValue.style.visibility = "visible";
                    scope.distanceUnit.style.visibility = "visible";
                } 
                var toggleButton = document.querySelector( "#toggle-controls"+scope.wrapperId );
                var heightWithinPx = this.style.height;
                addlCntrlheight = heightWithinPx.substring( 0, heightWithinPx.length-2 );
                if( addlCntrlheight < 408 ){
                    if( scope.additionalControls.dom.style.display === 'block' ){
                        toggleButton.click();
                    }
                    toggleButton.disabled = true;
                    scope.setDefaultSize = false;
                    scope.wrapperMaximizeBtn.innerHTML = '<span class="fa fa-plus-circle"></span>';
                }
                else if( addlCntrlheight >= 408 ){
                    if( toggleButton.disabled == true ){
                        toggleButton.disabled = false;
                        scope.setDefaultSize = true;
                        scope.wrapperMaximizeBtn.innerHTML = '<span class="fa fa-minus-circle"></span>';
                    }
                }

                if( scope.isLive == true ){

                    scope.signals.simulationResized.dispatch( scope.playerPreviewDiv.offsetWidth, scope.playerPreviewDiv.offsetHeight );

                }
                else{

                    scope.signals.pauseScreenResized.dispatch( scope.playerPreviewDiv.offsetWidth, scope.playerPreviewDiv.offsetHeight, scope.camera );

                }

            }
        } );

    },

    /**
     * setDraggable( ) - Method to set the element draggable.
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of setDraggable method.</caption>
     * simulationView.setDraggable( );
     */

    setDraggable : function(){

        $( '.simulation-wrapper' ).draggable( {
            containment: "parent"
        } );

    },

    /**
     * setMobile( ) - Method to set the element both resizable and draggable.
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of setMobile method.</caption>
     * simulationView.setMobile( );
     */

    setMobile : function(){

        var scope = this;
        scope.setDraggable();

    },

    /**
     * attachFilm( film ) - Method to attach the renderer DOM element to the screen.
     * @param {Object} film - Renderer DOM element to be attached.
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of attachFilm method.</caption>
     * simulationView.attachFilm( film );
     */
    
    attachFilm : function( film ){

        var scope = this;
        scope.playerPreviewDiv.appendChild( film );

    },

    /**
     * destroySelf( ) - Method to destroy and detach the simulation view object and DOM.
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of destroySelf method.</caption>
     * simulationView.destroySelf( );
     */
    
    destroySelf : function(){

        var scope = this;
        scope.hide();
        /*if( scope.camera != undefined && scope.camera.children[2] != undefined && scope.camera.children[2].name == "DistanceSphere" ){
            scope.camera.remove( scope.camera.children[2] );
        }*/
        if( scope.camera != undefined && scope.camera.children[2] != undefined && scope.camera.children[2].name == "DistancePlane" ){
            scope.camera.remove( scope.camera.children[2] );
        }
        scope.playerWrapperDiv.parentNode.removeChild( scope.playerWrapperDiv );

    },

    /**
     * pauseButtonClicked( event ) - Method to handle the pause button action.
     * @param {Object} event - Mouse click event
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of pauseButtonClicked method.</caption>
     * simulationView.pauseButtonClicked( event );
     */
    
    pauseButtonClicked : function( event ){

        var scope = this;
        /*if( scope.distanceSphere != undefined ){
            scope.distanceSphere.visible = false;
        }*/
        if( scope.distancePlane != undefined ){
            scope.distancePlane.visible = false;
        }
        if( scope.isLive === true )
        {   

            if( localStorage.getItem( "viewmode" ) === "true" )
                editor.liveCamera = "";
            if( scope.personObject && scope.personObject.disabled === false )
                scope.personObject.disabled = true;
            if( scope.luggageObject && scope.luggageObject.disabled === false )
                scope.luggageObject.disabled = true;
            if( scope.spotLightButton && scope.spotLightButton.disabled === false )
            {   
                scope.spotLightButton.disabled = true;
            }
                
            // if( scope.spotLightOn )
            //     scope.lightButtonTurnedOff( event );
            scope.digZoomSlider.dom.disabled = false;
            scope.signals.simulationViewPaused.dispatch( scope.camera );


        }    
        else
        { 

            if( localStorage.getItem( "viewmode" ) === "true" )
                editor.liveCamera = scope.camera.uuid + "-play";
            
            if( scope.personObject && scope.personObject.disabled === true )
                scope.personObject.disabled = false;
            if( scope.luggageObject && scope.luggageObject.disabled === true )
                scope.luggageObject.disabled = false;
            if( scope.spotLightButton && scope.spotLightButton.disabled === true )
                scope.spotLightButton.disabled = false;

            scope.digZoomSlider.dom.disabled = true;
            scope.signals.simulationViewResumed.dispatch( scope.camera );

        }
        

    },
    
    /**
     * stopButtonClicked( event ) - Method to handle the the stop button action.
     * @param {Object} event - Mouse click event
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of stopButtonClicked method.</caption>
     * simulationView.stopButtonClicked( event );
     */
    
    stopButtonClicked : function( event ){

        var scope = this;

        if( localStorage.getItem("viewmode") == "true"){
            var indexPos = editor.liveCamera.lastIndexOf( '-' );
            var cameraUuid = editor.liveCamera.substring( 0, indexPos );
            if( cameraUuid === scope.camera.uuid ){
                editor.liveCamera = "";
            }    
        }
        
        if( scope.spotLightOn )
            scope.lightButtonTurnedOff( event );
        scope.signals.simulationViewStopped.dispatch( scope.camera );

    },

    /**
     * snapshotButtonClicked( event ) - Method to handle the snapshot button action.
     * @param {Object} event - Mouse click event
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of snapshotButtonClicked method.</caption>
     * simulationView.snapshotButtonClicked( event );
     */
    
    snapshotButtonClicked : function( event ){

        var scope = this;
        //Modified to take snapshot when digital zoom is active
        if( simulationManager.screens[scope.camera.uuid] && simulationManager.screens[scope.camera.uuid].isLive === false ){

            var imgURL = simulationManager.screens[scope.camera.uuid].snapshotOnPause;
            simulationManager.takeSnapShotWhenPaused( scope.camera, imgURL );

        } else {

            scope.signals.simulationSnapshotNeeded.dispatch( scope.camera );

        }

    },

    lightButtonTurnedOn : function( event ){

        this.spotLightOn = true;
        this.spotLight = new THREE.SpotLight( '#FFFFFF' );
        this.spotLight.castShadow = true;
        this.spotLight.angle = 0.5;
        editor.scene.add( this.spotLight );
        THREE.SceneUtils.attach( this.spotLight, editor.scene, this.camera );
        this.spotLight.position.set( -2, -2, -2 );
        this.spotLightTarget = this.spotLight.target;
        
        var frustumVertices = this.camera.children[1].geometry.vertices;
        var frustumMidPointX = ( frustumVertices[0].x + frustumVertices[7].x)/2;
        var frustumMidPointY = ( frustumVertices[0].y + frustumVertices[7].y)/2;
        var frustumMidPointZ = ( frustumVertices[0].z + frustumVertices[7].z)/2;
        
        editor.scene.add( this.spotLightTarget );
        THREE.SceneUtils.attach( this.spotLightTarget, editor.scene, this.camera );
        this.spotLightTarget.position.set( frustumMidPointX, frustumMidPointY, frustumMidPointZ/1.5 );
        this.spotLight.distance = Math.abs( frustumMidPointZ/1.3 );
        this.baseModel = editor.setBaseModel();
        
        if( this.baseModel != '' ){
            this.baseModel.traverse( function( child ){
           
                if( child instanceof THREE.Mesh ){
                    child.receiveShadow = true;
                }  
    
           } )
        }

        editor.scene.traverse( function( child ){

            if( child instanceof THREE.Group && child.personOrLuggage ){
                child.children.forEach( function( child ){
                    child.castShadow = true;
                } );
            }

        } )

        rendererEngine.setRendererShadowMap();

    },

    lightButtonTurnedOff : function( event ){

        this.spotLightOn = false;

        if( this.spotLight != undefined ){
            THREE.SceneUtils.detach( this.spotLight, this.camera, editor.scene );
            editor.scene.remove( this.spotLight );
        }

        if( this.spotLightTarget != undefined ){
            THREE.SceneUtils.detach( this.spotLightTarget, this.camera, editor.scene );
            editor.scene.remove( this.spotLightTarget );
        }

    },

    setToDefault : function(){
        var scope = this;
        if(scope.isSimulatedMinMax == false){

            scope.wrapperMinimizeBtn.click();

        }
        this.wrapperMaximizeBtn.innerHTML = '<span class="fa fa-minus-circle"></span>';
        var wrapperHeight = (725.333 / scope.camera.aspect);
        var previewHeight = (724 / scope.camera.aspect)-65;   
        // scope.playerWrapperDiv.setAttribute( 'style', 'height:'+ wrapperHeight + 'px' );
        // scope.playerPreviewDiv.setAttribute( 'style', 'height:'+ previewHeight +'px' ); 
        // scope.playerWrapperDiv.setAttribute( 'style', 'width: 672.528px' ); 
        // scope.playerPreviewDiv.setAttribute( 'style', 'width: 671px' );  
        var leftAlign = document.querySelector("#"+scope.wrapperId).style.left;
        var topAlign = document.querySelector("#"+scope.wrapperId).style.top;
        document.querySelector("#"+scope.wrapperId).style.height = wrapperHeight + 'px'; 
        document.querySelector("#"+scope.wrapperId).style.width = '725.333px'; 
        scope.playerPreviewDiv.setAttribute( 'style', 'height:'+ previewHeight +'px' );
        scope.playerWrapperDiv.setAttribute( 'style', 'width: 725.333px' );  
        document.querySelector("#"+scope.wrapperId).style.left = leftAlign;
        document.querySelector("#"+scope.wrapperId).style.top = topAlign;
        var canvasElement = scope.playerPreviewDiv.children[0];
        if( canvasElement ){
            canvasElement.style.width = "672.528px";
            canvasElement.style.height = previewHeight + "px";
        }
        

        scope.tglCtrlBtn.disabled =  false;
        if( scope.additionalControls.dom.style.display === "none" )
            scope.tglCtrlBtn.click();

        scope.statusButton.style.visibility = "visible";
        scope.hViewLabel.style.visibility = "visible";
        scope.hViewUnit.style.visibility = "visible";
        scope.hViewValue.style.visibility = "visible";
        scope.vViewLabel.style.visibility = "visible";
        scope.vViewValue.style.visibility = "visible";
        scope.vViewUnit.style.visibility = "visible";
        scope.distanceLabel.style.visibility = "visible";
        scope.distanceValue.style.visibility = "visible";
        scope.distanceUnit.style.visibility = "visible";

        
    },

    setTomin : function(){
        var scope = this;
        if(scope.isSimulatedMinMax == false){

            scope.wrapperMinimizeBtn.click();

        }
        this.wrapperMaximizeBtn.innerHTML = '<span class="fa fa-plus-circle"></span>';
        var wrapperHeight = (370.313 / scope.camera.aspect);
        var previewHeight = (368.766 / scope.camera.aspect)-65;
        //scope.playerWrapperDiv.setAttribute( 'style', 'height:'+ wrapperHeight + 'px' );
        document.querySelector("#"+scope.wrapperId).style.height = wrapperHeight + 'px';
        document.querySelector("#"+scope.wrapperId).style.width = '370.313px'; 
        scope.playerPreviewDiv.setAttribute( 'style', 'width : 368.766px' );
        scope.playerPreviewDiv.setAttribute( 'style', 'height:'+ previewHeight +'px' );      
        
        var canvasElement = scope.playerPreviewDiv.children[0];
        if( canvasElement ){
            canvasElement.style.width = "368.766px";
            canvasElement.style.height = previewHeight + "px";
        }
        if( scope.additionalControls.dom.style.display === "block" )
            scope.tglCtrlBtn.click();
        if( previewHeight < 311 )
            scope.tglCtrlBtn.disabled =  true;
          
        scope.statusButton.style.visibility = "hidden";
        scope.hViewLabel.style.visibility = "hidden";
        scope.hViewUnit.style.visibility = "hidden";
        scope.hViewValue.style.visibility = "hidden";
        scope.vViewLabel.style.visibility = "hidden";
        scope.vViewValue.style.visibility = "hidden";
        scope.vViewUnit.style.visibility = "hidden";
        scope.distanceLabel.style.visibility = "hidden";
        scope.distanceValue.style.visibility = "hidden";
        scope.distanceUnit.style.visibility = "hidden";
    },

    /**
     * updateControls( ) - Method to update the slider controls.
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of updateControls method.</caption>
     * simulationView.updateControls( );
     */
    
    updateControls : function(){

        var scope = this;
        scope.zoomSlider.setValue( scope.camera.zoom );
        scope.fovSlider.setValue( scope.camera.fov );
        scope.nearSlider.setValue( scope.camera.near );
        scope.farSlider.setValue( scope.camera.far );

        var aspect = scope.camera.aspect;
        var vAOV = scope.camera.fov;
        var hAOV = vAOV * aspect;

        var distanceInTarget = Number( scope.distanceValue.value );
        var distancein3D = distanceInTarget / editor.commonMeasurements.targetConversionFactor;

        var vAOV = scope.camera.getEffectiveFOV();

        var hView = 2 * distanceInTarget * Math.tan( (hAOV/2)* (Math.PI / 180) );
        var vView = 2 * distanceInTarget * Math.tan( (vAOV/2)* (Math.PI / 180) );

        scope.hView = hView / editor.commonMeasurements.targetConversionFactor; ;
        scope.vView = vView / editor.commonMeasurements.targetConversionFactor;;
        scope.distance = distancein3D;

        scope.hViewValue.value = hView.toFixed(2);
        scope.vViewValue.value = vView.toFixed(2);

        editor.execute( new SetGeometryCommand( scope.distancePlane, new THREE.PlaneGeometry( scope.hView, scope.vView ) ) );


        //scope.digZoomSlider.setValue( scope.camera.digitalZoom );

    }

};

SimulationView.prototype.constructor = SimulationView;