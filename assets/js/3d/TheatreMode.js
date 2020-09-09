/**
 * TheatreMode( editor ) - Constructor function for enabling theatre mode
 * @constructor
 * @param {any} editor - The instance of the Editor which manages the overall objects and signals
 * @author Hari
 * @returns {Void}
 * @example <caption>Example usage of TheatreMode</caption>
 * var theatreMode = new TheatreMode( editor );
 */
var TheatreMode = function ( editor ) {

    var signals = editor.signals;
    var showSmartSensorFrustum = false;
    var elem = document.getElementById( "theatre_button_content" );
    document.getElementById( 'theatre_button' ).addEventListener( 'click' , function( event ){

        if( editor.liveTwodViewFlag ){
            toastr.warning(  editor.languageData.Youcantactivatebothliveviewandtheatremodesimultaneously );
            return;   
        }

        if (!editor.hideAllCamera){

            toastr.warning( editor.languageData.Allcamerasshouldbevisibletoenabletheatermode);
            return;
        }
        if( editor.camLock ){
            toastr.warning( editor.languageData.UnlockCamerasandRetry );
            return;
        }

        if( editor.hideAllFrustum ){
            toastr.warning( editor.languageData.ShowCameraFrustum );
            return;
        }
        editor.theatreMode = !editor.theatreMode;
        
        if( editor.theatreMode ){

            if( !(document.getElementById( 'hide-sensor-frustum' ).checked) ){

                showSmartSensorFrustum = true;
                document.getElementById( 'hide-sensor-frustum' ).click();

            }

            var startNetworkingLi = document.getElementById( 'start-networking-li' );
            var showHideNetworkingLi = document.getElementById( 'show-hide-networking-li' );
            var editNetworkCablesLi = document.getElementById( 'edit-networking-li' );
            var enableMeasurementLi = document.getElementById( 'enable-measure-mode-li' );	
            var showAllMsrmntsLi = document.getElementById( "show-all-measurements-li" );
            var enableAreaMeasurementLi = document.getElementById( 'area-enable-measure-mode-li' );

            if( editor.isntwrkngStarted == true ) {

                startNetworkingLi.click();

            }
            if( editor.nwShowHideToggle == true ) {

                showHideNetworkingLi.click();

            }
            if( editor.isMeasuring == true ){

                enableMeasurementLi.click();

            }
            if( editor.isAreaMeasuring == true ){
                
                enableAreaMeasurementLi.click();

            }
            if( editor.msrmntsShowHideToggle === true ){

                showAllMsrmntsLi.click();

            }
            if( editor.isCableEditingEnabled === true ){

                editNetworkCablesLi.click();

            }

            //De-activating 'Rotation-Controls' and 'Spherical-Controls' if they are active start

            if ( editor.rotationControls.isControlsActive == true ){

                if ( editor.rotationControls.isSphericalControlsActive == true ) {

                    editor.signals.transformModeChanged.dispatch( 'translate' );
                    //editor.rotationControls.hide();
    
                }

                editor.rotationControls.hide();
                editor.isRotationControlsClosed = true;

            }

            //De-activating 'Rotation-Controls' and 'Spherical-Controls' if they are active end
            

            editor.scene.traverse( function( child ){

                if( ( child instanceof THREE.Sprite ) && ( child.camerauuid != null ) && ( child.camerauuid != undefined ) ){

                    if( child.userData.checkLOSFlag === 'set' ){

                        var lineUID = child.userData.lineUUID;
                        var line = editor.scene.getObjectByProperty( 'uuid', lineUID );
                        line.visible = false;                        
                        child.userData.checkLOSFlag = 'notset';
                        editor.signals.sceneGraphChanged.dispatch();

                    }

                }

                if( child.userData.checkDetailsFlag === 'set' ){

                    detailsTable = document.querySelector( '#cam__ref__mobilewindow__' + child.uuid );
                    detailsTable.style.display = 'none';
                    child.userData.checkDetailsFlag = 'hidden';

                }

            } );

            simulationManager.start();
            rendererEngine.start();
            rendererEngine.setScene( editor.scene );

            elem.style.color = "#500080";
            elem.className = "fa fa-video-camera span-font-26 faa-pulse animated";
            toastr.success( editor.languageData.Theatremodeactive );

            //Modified for activity logging start
            try{

                //Modified for activity logging start
                var logDatas = {};
                logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Theater mode activated";
                logger.addLog( logDatas );
                logger.sendLogs( localStorage.getItem( 'U_ID' ) );
                //Modified for activity logging end

            }
            catch( exception ){

                console.log( "Logging failed!" );
                console.log( exception );

            }
            //Modified for activity logging end

        }
        else{

            if( document.getElementById( 'hide-sensor-frustum' ).checked ){
                if( showSmartSensorFrustum ){

                    showSmartSensorFrustum = false;
                    document.getElementById( 'hide-sensor-frustum' ).click();
                
                }
            }
            

            editor.sceneCameras.forEach( ( cam ) => {
            
                for( var i = 0; i < cam.children.length; i++ ){
                
                    if( cam.children[i] instanceof THREE.SpotLight || cam.children[i].type === 'Object3D' ){
                        var SpotLight = cam.children[i]
                        THREE.SceneUtils.detach( cam.children[i], cam, editor.scene );
                        editor.scene.remove( SpotLight );
                    }
                
                }
            
            } );

            simulationManager.killAllSimulations();
            elem.style.color = "#000000";
            elem.className = "fa fa-video-camera span-font-26";

            if( editor.isRotationControlsClosed === true ) {

                var rotationControls = document.getElementById('toolbar-rotate');
                rotationControls.click();
                toastr.info('Rotation Controls is active now');
                editor.isRotationControlsClosed = false;

            }

            //Modified for activity logging start
            try{

                //Modified for activity logging start
                var logDatas = {};
                logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Theater mode deactivated";
                logger.addLog( logDatas );
                logger.sendLogs( localStorage.getItem( 'U_ID' ) );
                //Modified for activity logging end

            }
            catch( exception ){

                console.log( "Logging failed!" );
                console.log( exception );

            }
            //Modified for activity logging end

        }

    } );
    //theatreButton.dom.setAttribute( 'title', 'Theatre mode\n enables you to play the cameras' );

    //theatreRow.add( theatreButton );
    //container.add( theatreRow );
    //document.getElementById('editorElement').appendChild( container.dom );
    //return container;

};
    
    