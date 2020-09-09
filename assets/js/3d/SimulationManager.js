/**
 * SimulationManager( editor ) - Constructor function for managing multiple rendering setups..
 * @constructor
 * @param {any} editor - The instance of the Editor which manages the overall objects and signals
 * @author Hari
 * @returns {Object}
 * @example <caption>Example usage of SimulationManager</caption>
 * var simulationManager = new SimulationManager( editor );
 */
var SimulationManager = function( editor ){
    
    var scope = this;

    this.signals = editor.signals;
    this.liveCameras = []; // Holds the UUID of the cameras that are live now
    this.pausedCameras = []; // Holds the UUID of the cameras that are paused now
    this.screens = []; // Holds the corresponding simulation screen for each cameras
    this.panoramaObject = [];
    //SIGNAL LISTNERS FOR EXTERNAL SIMULATION HANDLING REQUESTS START
    scope.signals.simulationViewPaused.add( function( camera ){

        scope.handlePause( camera );

    } );

    scope.signals.panoramicViewRefreshed.add( function( camera ){
        scope.processPanorama( camera );
    } );

    scope.signals.simulationViewResumed.add( function( camera ){
        
        scope.handlePlay( camera );

    } );
    //Modified for Panorama start
    scope.signals.simulationViewStopped.add( function( camera ){

        if( camera != undefined && camera.camCategory != undefined && camera.camCategory == "Panorama" ){
            scope.stopPanorama( camera );
        }
        else { 
            scope.handleStop( camera );
        }
       
    } );
    //Modified for Panorama end
    scope.signals.simulationSnapshotNeeded.add( function( camera ){
        
        scope.handleSnapshot( camera );

    } );

    scope.signals.simulationScreenClicked.add( function( targetScreen ){

        for( var key in scope.screens ){

            scope.screens[ key ].sendToBack();

        }
        var rotationWindow = document.getElementById( 'rotation-mob-window' );
        if( rotationWindow !== undefined && rotationWindow !== null ) rotationWindow.style.zIndex = 1;
        targetScreen.bringToFront();

    } );
    //SIGNAL LISTENERS FOR EXTERNAL SIMULATION HANDLING REQUESTS END

    return this;

}

SimulationManager.prototype = {
    
    /**
     * start( ) - Method to initializes all the properties and prepares the manager.
	 * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of start method.</caption>
     * simulationManager.start( );
     */

    start : function(){

        var scope = this;
        scope.liveCameras = []; // Holds the UUID of the cameras that are live now
        scope.pausedCameras = []; // Holds the UUID of the cameras that are paused now
        scope.screens = []; // Holds the corresponding simulation screen for each cameras

    },

    /**
     * handlePlay( camera ) - Method to handle the play action of the camera.
     * @param {Object<THREE.PerspectiveCamera>} camera  - Instance of THREE.PerspectiveCamera object to be handled
	 * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of handlePlay method.</caption>
     * simulationManager.handlePlay( camera );
     */

    handlePlay : function( camera ){
        
        var scope = this;

        function prerenderingTasks(){

            if( scope.pausedCameras.includes( camera.uuid ) ){

                //Simulation screen already exist.
                if( scope.screens[ camera.uuid ] != undefined ){
                    
                    rendererEngine.setCamera( camera, scope.screens[ camera.uuid ].playerPreviewDiv ).then( function( success ){

                        scope.resetRendererSize( camera );
                        scope.screens[ camera.uuid ].attachFilm( rendererEngine.renderer.domElement );
                        rendererEngine.runPreRenderingTasks(); //hiding all the camera frustum and helpers
                        editor.helpers[ camera.id ].visible = true; // show the helper for current camera
                        editor.signals.sceneGraphChanged.dispatch(); // performs an immediate rendering to make the changes visible
                        rendererEngine.keepRenderingAlive = true;
                        rendererEngine.render();
                        scope.screens[ camera.uuid ].setAsLive();

                        //Modified to display Toggle Controls when Simulation screen is enabled
                        /*if( scope.screens[ camera.uuid ].additionalControls.dom.style.display === 'none' )
                        scope.screens[ camera.uuid ].tglCtrlBtn.click();*/

                    }, function( error ){

                        return;

                    } );

                }
                //Simulation screen doesn't exist, need to create one first.
                else{

                    var view = new SimulationView( editor );
                    document.getElementById( 'editorElement' ).appendChild( view.playerWrapperDiv );
                    view.setMobile();
                    //view.setResizable( camera.aspect, true );
                    view.setResizable( true, camera.aspect );
                    scope.screens[ camera.uuid ] = view;
                    scope.screens[ camera.uuid ].camera = camera;//attaching the specified camera to the screen
                    view.show();
                    rendererEngine.setCamera( camera, scope.screens[ camera.uuid ].playerPreviewDiv ).then( function( success ){

                        scope.resetRendererSize( camera );
                        scope.screens[ camera.uuid ].attachFilm( rendererEngine.renderer.domElement );
                        rendererEngine.runPreRenderingTasks(); //hiding all the camera frustum and helpers
                        editor.helpers[ camera.id ].visible = true; // show the helper for current camera
                        editor.signals.sceneGraphChanged.dispatch(); // performs an immediate rendering to make the changes visible
                        rendererEngine.keepRenderingAlive = true;
                        rendererEngine.render();
                        scope.screens[ camera.uuid ].setAsLive();
       
                        //Modified to display Toggle Controls when Simulation screen is enabled
                        if( scope.screens[ camera.uuid ].additionalControls.dom.style.display === 'none' )
                        scope.screens[ camera.uuid ].tglCtrlBtn.click();
                        

                    }, function( error ){

                        return;

                    } );

                }

                //camera is now live, remove it from the pausedCameras
                var camIndex = scope.pausedCameras.indexOf( camera.uuid );
                if( camIndex > -1 ) scope.pausedCameras.splice( camIndex, 1 );

                //push the camera that was live previously to the pausedCameras. First confirm it is not already in the pausedCameras
                if( scope.liveCameras.length != 0 && scope.pausedCameras.includes( scope.liveCameras[ 0 ] ) === false ){

                    scope.pausedCameras.push( scope.liveCameras[ 0 ] );

                }

                //Add current camera to the liveCameras
                scope.liveCameras[ 0 ] = camera.uuid;

            }
            //this is the first time we are simulating the specified camera.
            else{

                var view = new SimulationView( editor );
                document.getElementById( 'editorElement' ).appendChild( view.playerWrapperDiv );
                view.setMobile();
                //view.setResizable( camera.aspect, true );
                view.setResizable( true, camera.aspect );
                scope.screens[ camera.uuid ] = view;
                scope.screens[ camera.uuid ].camera = camera;//attaching the specified camera to the screen
                view.show();
                rendererEngine.setCamera( camera, scope.screens[ camera.uuid ].playerPreviewDiv ).then( function( success ){

                    scope.resetRendererSize( camera );
                    scope.screens[ camera.uuid ].attachFilm( rendererEngine.renderer.domElement );
                    rendererEngine.runPreRenderingTasks(); //hiding all the camera frustum and helpers
                    editor.helpers[ camera.id ].visible = true; // show the helper for current camera
                    editor.signals.sceneGraphChanged.dispatch(); // performs an immediate rendering to make the changes visible
                    rendererEngine.keepRenderingAlive = true;
                    rendererEngine.render();
                    scope.screens[ camera.uuid ].setAsLive();
        
                    if( scope.liveCameras.length != 0 ){

                        if( scope.pausedCameras.includes( scope.liveCameras[ 0 ] ) === false ){

                            scope.pausedCameras.push( scope.liveCameras[ 0 ] );

                        }

                    }
                    //Adding the camera to the list of liveCameras
                    scope.liveCameras[ 0 ] = camera.uuid;

                    //Modified to display Toggle Controls when Simulation screen is enabled
                    if( scope.screens[ camera.uuid ].additionalControls.dom.style.display === 'none' )
                    scope.screens[ camera.uuid ].tglCtrlBtn.click();
                    

                }, function( error ){

                    return;

                } );

            }
            camera.userData.timestamp = scope.screens[ camera.uuid ].timestamp;
            editor.signals.cameraControlsChanged.dispatch( camera.userData );

            //Modified for activity logging start
            try{

                //Modified for activity logging start
                var logDatas = {};
                logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Theater mode : Playing PerspectiveCamera : " + camera.name;
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
        
        //Some camera is playing now. We have to set it's view as paused
        if( scope.liveCameras.length != 0 && scope.liveCameras.includes( camera.uuid ) === false ){

            //scope.screens[ scope.liveCameras[ 0 ] ].setAsPaused();
            rendererEngine.getSnapshot().then( function( img ){
                
                if( img != undefined ) scope.screens[ scope.liveCameras[ 0 ] ].setAsPaused( img );
                else scope.screens[ scope.liveCameras[ 0 ] ].setAsPaused();

                prerenderingTasks();
	
            }, function( img ){
                
                scope.screens[ scope.liveCameras[ 0 ] ].setAsPaused();
                prerenderingTasks();
                
            } );

        }
        //Either none of the cameras are live, or the camera that we are trying to play is live 
        else{
            
            //check whether camera is already playing
            if( scope.liveCameras.includes( camera.uuid ) ){

                //camera is already live, no action needed.
                return;

            }
            prerenderingTasks();

        }

    },

    /**
     * handlePause( camera ) - Method to handle the pause action of the specified camera.
     * @param {Object<THREE.PerspectiveCamera>} camera  - Instance of THREE.PerspectiveCamera object to be paused
	 * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of handlePause method.</caption>
     * simulationManager.handlePause( camera );
     */

    handlePause : function( camera ){

        var scope = this;
        
        //camera is live now. Need to pause
        if( scope.liveCameras.includes( camera.uuid ) ){

            rendererEngine.getSnapshot().then( function( img ){

                rendererEngine.keepRenderingAlive = false;
                rendererEngine.stop();

                if( img != undefined ) scope.screens[ camera.uuid ].setAsPaused( img );
                else scope.screens[ camera.uuid ].setAsPaused();

                scope.liveCameras = [];
    
                if( scope.pausedCameras.includes( camera.uuid ) === false ){
    
                    scope.pausedCameras.push( camera.uuid );
    
                }

                //Modified for activity logging start
                try{

                    //Modified for activity logging start
                    var logDatas = {};
                    logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Theater mode : Pausing simulation for PerspectiveCamera : " + camera.name;
                    logger.addLog( logDatas );
                    logger.sendLogs( localStorage.getItem( 'U_ID' ) );
                    //Modified for activity logging end

                }
                catch( exception ){

                    console.log( "Logging failed!" );
                    console.log( exception );

                }
                //Modified for activity logging end
                
            }, function( img ){

                rendererEngine.keepRenderingAlive = false;
                rendererEngine.stop();
                scope.screens[ camera.uuid ].setAsPaused();
                scope.liveCameras = [];

                if( scope.pausedCameras.includes( camera.uuid ) === false ){
                    
                    scope.pausedCameras.push( camera.uuid );
    
                }

                //Modified for activity logging start
                try{

                    //Modified for activity logging start
                    var logDatas = {};
                    logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Theater mode : Pausing simulation for PerspectiveCamera : " + camera.name;
                    logger.addLog( logDatas );
                    logger.sendLogs( localStorage.getItem( 'U_ID' ) );
                    //Modified for activity logging end

                }
                catch( exception ){

                    console.log( "Logging failed!" );
                    console.log( exception );

                }
                //Modified for activity logging end
                
            } );

        }

    },

    /**
     * processPanorama( camera ) - Method to handle the process panorama action for the specified camera.
     * @param {Object<THREE.PerspectiveCamera>} camera  - Instance of THREE.PerspectiveCamera object to process
	 * @returns {Void}
     * @author Pravi
     * @example <caption>Example usage of processPanorama method.</caption>
     * simulationManager.processPanorama( camera );
     */

    processPanorama : function( camera ){
        var scope = this;
        if( scope.screens[ camera.uuid ] != undefined ){

            if( scope.liveCameras.length != 0 ){
                var camToBePaused = editor.scene.getObjectByProperty( 'uuid',scope.liveCameras[0] )
                if(camToBePaused != undefined && camToBePaused instanceof THREE.PerspectiveCamera){
                    rendererEngine.getSnapshot().then( function( img ){
                    
                        if( img != undefined ) scope.screens[ scope.liveCameras[ 0 ] ].setAsPaused( img );
                        else scope.screens[ scope.liveCameras[ 0 ] ].setAsPaused();

                        //rendererEngine.runPreRenderingTasks();
                        editor.signals.hideEverythingForPanorama.dispatch( camera );
                        var view = scope.screens[ camera.uuid ];
                        var equiManaged = scope.panoramaObject[ camera.uuid ];
                        equiManaged.rotateCubeCamera( camera.rotation.x, camera.rotation.y, camera.rotation.z );
                        equiManaged.setNearFar( camera.near, camera.far );
                        var processedImage = equiManaged.update( camera, editor.scene );
                        view.setAsPaused(processedImage);    
                        //rendererEngine.runPostRenderingTasks();
                        editor.signals.showAfterPanorama.dispatch();

                        if( scope.liveCameras.length != 0 ){
        
                            if( scope.pausedCameras.includes( scope.liveCameras[ 0 ] ) === false ){
            
                                scope.pausedCameras.push( scope.liveCameras[ 0 ] );
            
                            }
            
                        }
                        //Clearing the list of liveCameras
                        scope.liveCameras.pop();
            
                    }, function( img ){
                        
                        console.log("Some error with snapshot for pause");
                        /*scope.screens[ scope.liveCameras[ 0 ] ].setAsPaused();
                        rendererEngine.runPreRenderingTasks();
                        editor.signals.hideEverythingForPanorama.dispatch( camera );
                        var view = scope.screens[ camera.uuid ];
                        var equiManaged = scope.panoramaObject[ camera.uuid ];
                        var processedImage = equiManaged.update( camera, editor.scene );
                        view.setAsPaused(processedImage);    
                        rendererEngine.runPostRenderingTasks();
                        editor.signals.showAfterPanorama.dispatch();

                        if( scope.liveCameras.length != 0 ){
        
                            if( scope.pausedCameras.includes( scope.liveCameras[ 0 ] ) === false ){
            
                                scope.pausedCameras.push( scope.liveCameras[ 0 ] );
            
                            }
            
                        }
                        //Clearing the list of liveCameras
                        scope.liveCameras.pop();*/
                        
                    } );
                
                }
            }
            else {
                //rendererEngine.runPreRenderingTasks();
                editor.signals.hideEverythingForPanorama.dispatch( camera );
                var view = scope.screens[ camera.uuid ];
                var equiManaged = scope.panoramaObject[ camera.uuid ];
                equiManaged.rotateCubeCamera( camera.rotation.x, camera.rotation.y, camera.rotation.z );
                equiManaged.setNearFar( camera.near, camera.far );
                var processedImage = equiManaged.update( camera, editor.scene );
                view.setAsPaused(processedImage);    
                //rendererEngine.runPostRenderingTasks();
                editor.signals.showAfterPanorama.dispatch();
            }
            
                
            
               
        }
        else{

            if( scope.liveCameras.length != 0 ){
                var camToBePaused = editor.scene.getObjectByProperty( 'uuid',scope.liveCameras[0] )
                if(camToBePaused != undefined && camToBePaused instanceof THREE.PerspectiveCamera){
                    rendererEngine.getSnapshot().then( function( img ){
                    
                        if( img != undefined ) scope.screens[ scope.liveCameras[ 0 ] ].setAsPaused( img );
                        else scope.screens[ scope.liveCameras[ 0 ] ].setAsPaused();

                        //rendererEngine.runPreRenderingTasks();
                        editor.signals.hideEverythingForPanorama.dispatch( camera );
                        var view = new PanoramaSimulationView( editor );
                        document.getElementById( 'editorElement' ).appendChild( view.playerWrapperDiv );
                        view.setMobile();
                        view.show();
                        scope.screens[ camera.uuid ] = view;
                        scope.screens[ camera.uuid ].camera = camera;
                        rendererEngine.setRendererForPanorama( camera );
            
                        var equiManaged  = new CubemapToEquirectangular( rendererEngine.renderer, true,editor );
                        equiManaged.rotateCubeCamera( camera.rotation.x, camera.rotation.y, camera.rotation.z );
                        equiManaged.setNearFar( camera.near, camera.far );
                        scope.panoramaObject[ camera.uuid ] = equiManaged;
                        var processedImage = equiManaged.update( camera, editor.scene );
                        view.setAsPaused(processedImage);
                        //rendererEngine.runPostRenderingTasks();
                        editor.signals.showAfterPanorama.dispatch();
                        
                        if( scope.liveCameras.length != 0 ){
        
                            if( scope.pausedCameras.includes( scope.liveCameras[ 0 ] ) === false ){
            
                                scope.pausedCameras.push( scope.liveCameras[ 0 ] );
            
                            }
            
                        }
                        //Clearing the list of liveCameras
                        scope.liveCameras.pop();
                        
            
                    }, function( img ){
                        console.log("Some error with snapshot for pause");
                        
                        /*scope.screens[ scope.liveCameras[ 0 ] ].setAsPaused();

                        rendererEngine.runPreRenderingTasks();
                        editor.signals.hideEverythingForPanorama.dispatch( camera );
                        var view = new PanoramaSimulationView( editor );
                        document.getElementById( 'editorElement' ).appendChild( view.playerWrapperDiv );
                        view.setMobile();
                        view.show();
                        scope.screens[ camera.uuid ] = view;
                        scope.screens[ camera.uuid ].camera = camera;
                        rendererEngine.setRendererForPanorama( camera );
            
                        var equiManaged  = new CubemapToEquirectangular( rendererEngine.renderer, true,editor );
                        scope.panoramaObject[ camera.uuid ] = equiManaged;
                        var processedImage = equiManaged.update( camera, editor.scene );
                        view.setAsPaused(processedImage);
                        rendererEngine.runPostRenderingTasks();
                        editor.signals.showAfterPanorama.dispatch();

                        if( scope.liveCameras.length != 0 ){
        
                            if( scope.pausedCameras.includes( scope.liveCameras[ 0 ] ) === false ){
            
                                scope.pausedCameras.push( scope.liveCameras[ 0 ] );
            
                            }
            
                        }
                        //Clearing the list of liveCameras
                        scope.liveCameras.pop();*/
                        
                        
                    } );
        
                
                }
                
            }
            else {
                //rendererEngine.runPreRenderingTasks();
                editor.signals.hideEverythingForPanorama.dispatch( camera );
                var view = new PanoramaSimulationView( editor );
                document.getElementById( 'editorElement' ).appendChild( view.playerWrapperDiv );
                view.setMobile();
                view.show();
                scope.screens[ camera.uuid ] = view;
                scope.screens[ camera.uuid ].camera = camera;
                rendererEngine.setRendererForPanorama( camera );
    
                var equiManaged  = new CubemapToEquirectangular( rendererEngine.renderer, true,editor );
                equiManaged.rotateCubeCamera( camera.rotation.x, camera.rotation.y, camera.rotation.z );
                equiManaged.setNearFar( camera.near, camera.far );
                scope.panoramaObject[ camera.uuid ] = equiManaged;
                var processedImage = equiManaged.update( camera, editor.scene );
                view.setAsPaused(processedImage);
                //rendererEngine.runPostRenderingTasks();
                editor.signals.showAfterPanorama.dispatch();
            }
            
            
            
        }
    },

    /**
     * stopPanorama( camera ) - Method to delete the panorama camera simulation view instance.
     * @param {Object<THREE.PerspectiveCamera>} camera  - Instance of THREE.PerspectiveCamera object to be stopped
	 * @returns {Void}
     * @author Pravi
     * @example <caption>Example usage of stopPanorama method.</caption>
     * simulationManager.stopPanorama( camera );
     */

    stopPanorama : function( camera ){
        var scope = this;
        if( scope.screens[ camera.uuid ] != undefined ){
            scope.screens[ camera.uuid ].hide();
            scope.screens[ camera.uuid ].destroySelf();
            delete scope.screens[ camera.uuid ];
            delete scope.panoramaObject[ camera.uuid ];
        }

    },

    /**
     * handleStop( camera ) - Method to handle the stop action for the specified camera.
     * @param {Object<THREE.PerspectiveCamera>} camera  - Instance of THREE.PerspectiveCamera
	 * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of handleStop method.</caption>
     * simulationManager.handleStop( camera );
     */

    handleStop : function( camera ){
        
        var scope = this;
        
        //camera is live now. Need to stop
        if( scope.liveCameras.includes( camera.uuid ) ){

            rendererEngine.stop();
            scope.screens[ camera.uuid ].hide();
            scope.screens[ camera.uuid ].setAsPaused();
            scope.screens[ camera.uuid ].destroySelf();
            if( scope.screens[ camera.uuid ] != undefined ) delete scope.screens[ camera.uuid ];
            scope.liveCameras = [];

            if( scope.pausedCameras.includes( camera.uuid ) === true ){

                //camera is now stopped, remove it from the pausedCameras
                var camIndex = scope.pausedCameras.indexOf( camera.uuid );
                if( camIndex > -1 ) scope.pausedCameras.splice( camIndex, 1 );

            }

        }
        //camera is paused now. Need to stop
        else if( scope.pausedCameras.includes( camera.uuid ) ){

            scope.screens[ camera.uuid ].hide();
            scope.screens[ camera.uuid ].setAsPaused();
            scope.screens[ camera.uuid ].destroySelf();
            if( scope.screens[ camera.uuid ] != undefined ) delete scope.screens[ camera.uuid ];

            //camera is now stopped, remove it from the pausedCameras
            var camIndex = scope.pausedCameras.indexOf( camera.uuid );
            if( camIndex > -1 ) scope.pausedCameras.splice( camIndex, 1 );

        }

        //Modified for activity logging start
        try{

            //Modified for activity logging start
            var logDatas = {};
            logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Theater mode : Stopping simulation for PerspectiveCamera : " + camera.name;
            logger.addLog( logDatas );
            logger.sendLogs( localStorage.getItem( 'U_ID' ) );
            //Modified for activity logging end

        }
        catch( exception ){

            console.log( "Logging failed!" );
            console.log( exception );

        }
        //Modified for activity logging end

    },

    /**
     * killAllSimulations( ) - Method to stop and dispose all the simulations.
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of killAllSimulations method.</caption>
     * simulationManager.killAllSimulations( );
     */

    killAllSimulations : function(){

        var scope = this;
        rendererEngine.stop();
        rendererEngine.dispose();
        for( var key in scope.screens ){

            scope.screens[ key ].hide();
            scope.screens[ key ].destroySelf();
            delete scope.screens[ key ];

        }
        scope.liveCameras = []; // Holds the UUID of the cameras that are live now
        scope.pausedCameras = []; // Holds the UUID of the cameras that are paused now
        scope.screens = []; // Holds the corresponding simulation screen for each cameras
        scope.panoramaObject = [] // Holds the simulation instance of panorama cameras

    },

    /**
     * resetRendererSize( camera ) - Method to reset the renderer DOM size according to the current simulation view size.
     * @param {Object<THREE.PerspectiveCamera>} camera  - Instance of THREE.PerspectiveCamera
	 * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of resetRendererSize method.</caption>
     * simulationManager.resetRendererSize( camera );
     */

    resetRendererSize : function( camera ){

        var scope = this;
        rendererEngine.setRendererSize( scope.screens[ camera.uuid ].playerPreviewDiv.offsetWidth, scope.screens[ camera.uuid ].playerPreviewDiv.offsetHeight );
        //rendererEngine.setRendererSize( camera.resWidth , camera.resHeight );

    },

    /**
     * handleSnapshot( camera ) - Method to take the snapshot of the camera and uploads it to the server.
     * @param {Object<THREE.PerspectiveCamera>} camera  - Instance of THREE.PerspectiveCamera
	 * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of handleSnapshot method.</caption>
     * simulationManager.handleSnapshot( camera );
     */

    handleSnapshot : function( camera ){
        
        var scope = this;
        var selectedCamera = camera;
        var cameraX, cameraY, cameraZ;
        var cameraTiltX, cameraTiltY, cameraTiltZ,refenceX ,refenceY,refenceZ;
        var focus;
        var distance;
        var cameraBrand, opticalZoom, digitalZoom, tilt, pan, roll;
        var cameraBrandmodel;
        var cameraLocation;
        var filmgauge;
        var fov;
        var cameraRefence;
        var nameOfCamera, helper,hView,vView,hFOV,aspect,resolutionWidth,resolutionHeight;

        if( editor.activeProject.user_id === undefined ){

            toastr.warning( editor.languageData.Youhavetobeonaprojectbeforeyoutakethesnapshot );
            return;

        }

        //if( editor.activeProject.user_id != undefined ){
            
            if( !( selectedCamera instanceof THREE.PerspectiveCamera ) ){

                alert( editor.languageData.Selectacamerathenclickonthesnapshotbuttontotakesnapshot );
                return;

            }
            focus = selectedCamera.focus;
            //distance = selectedCamera.far - selectedCamera.near;
            //distance = selectedCamera.distance;
            distance = (scope.screens[ selectedCamera.uuid ] != undefined ) ? scope.screens[ selectedCamera.uuid ].distance : selectedCamera.distance;
            //hView = selectedCamera.hView;
            hView = (scope.screens[ selectedCamera.uuid ] != undefined ) ? scope.screens[ selectedCamera.uuid ].hView : selectedCamera.hView;
            //vView = selectedCamera.vView;
            vView = (scope.screens[ selectedCamera.uuid ] != undefined ) ? scope.screens[ selectedCamera.uuid ].vView : selectedCamera.vView;
            hFOV = selectedCamera.hFOV;
            aspect = selectedCamera.aspect;
            resolutionWidth = selectedCamera.resolutionWidth;
            resolutionHeight = selectedCamera.resolutionHeight;
            cameraBrand = selectedCamera.userData.cameraBrand;
            cameraBrandmodel = selectedCamera.userData.cameraModel;
            cameraLocation = selectedCamera.userData.location;
            filmgauge = selectedCamera.filmGauge;
            fov = selectedCamera.fov;
            nameOfCamera = selectedCamera.name;
            cameraRefence = selectedCamera.userData.reference;
            //opticalZoom = selectedCamera.opticalZoom;
            //digitalZoom = selectedCamera.digitalZoom;
            tilt = selectedCamera.userData.tiltRotationValue;
            pan = selectedCamera.userData.panRotationValue;
            roll = selectedCamera.userData.rollRotationValue;

            refenceX =( selectedCamera.userData.reference.x ).toFixed(0);   
            refenceY =( selectedCamera.userData.reference.y ).toFixed(0);   
            refenceZ =( selectedCamera.userData.reference.z ).toFixed(0);   
            cameraX = ( selectedCamera.position.x ).toFixed( 0 ) - refenceX ;
            cameraY = ( selectedCamera.position.y ).toFixed( 0 ) - refenceY ;
            cameraZ = ( selectedCamera.position.z ).toFixed( 0 ) - refenceZ;
            cameraTiltX = ((selectedCamera.rotation.x) * 57.32).toFixed(0);
            cameraTiltY = ((selectedCamera.rotation.y) * 57.32).toFixed(0);
            cameraTiltZ = ((selectedCamera.rotation.z) * 57.32).toFixed(0);

            if( simulationManager && simulationManager.screens[camera.uuid] && camera.camCategory != 'Panorama' ) {

                var currentScreen = simulationManager.screens[camera.uuid];
                var opticalZoomValue = currentScreen.zoomSlider.dom.value;
                var digitalZoomValue = currentScreen.digZoomSlider.dom.value;

                if( opticalZoomValue!= null && opticalZoomValue!= undefined ) {

                    opticalZoomValue = opticalZoomValue + 'x';
                    opticalZoom = opticalZoomValue;

                } else {

                    opticalZoom = selectedCamera.opticalZoom;

                }

                if( digitalZoomValue!= null && digitalZoomValue!= undefined ) {

                    digitalZoomValue = digitalZoomValue + 'x';
                    digitalZoom = digitalZoomValue;

                } else {

                    digitalZoom = selectedCamera.digitalZoom;

                }

            }
            
            //selectedCamera.children[0].visible = false;
            /*if(selectedCamera.children[1] != undefined )
            selectedCamera.children[1].visible = false;*/
            if (selectedCamera != undefined) {

                selectedCamera.traverse( function( child ) {

                    if( child.name === "CameraFrustum" ) {

                        child.visible = false;

                    }

                } ) 

            }

            //Hiding the camera icons to avoid them during snapshot
            var sceneLen = editor.scene.children.length;
            for( var i = 0; i < sceneLen; i++ ){ 
               
                var element = editor.scene.children[ i ];
                if( element instanceof THREE.PerspectiveCamera ){
                    
                    try{

                        //element.children[ 0 ].visible = false;
                        element.traverse( function( child ) {

                            if( child.name === "threeDCameraModel" || child.name === "cameraHelperIcon" ) {
        
                                child.visible = false;
        
                            }
        
                        } )

                    }
                    catch( error ){
                        console.warn( 'Recovered from snapshot error!' );
                    }
                    
                }
            
            }

            rendererEngine.getSnapshot().then( function( img ){

                var sceneLen = editor.scene.children.length;
                for( var i = 0; i < sceneLen; i++ ){ 
                   
                    var element = editor.scene.children[ i ];
                    if( element instanceof THREE.PerspectiveCamera ){
                        
                        try{
    
                            //element.children[ 0 ].visible = true;
                            element.traverse( function( child ) {

                                if( child.name === "threeDCameraModel" || child.name === "cameraHelperIcon" ) {
            
                                    child.visible = true;
            
                                }
            
                            } )
    
                        }
                        catch( error ){
                            console.warn( 'Recovered from sanpshot error!' );
                        }
                        
                    }
                
                }

                //selectedCamera.children[0].visible = true;
                /*if(selectedCamera.children[1] != undefined )
                selectedCamera.children[1].visible = true;*/
                if (selectedCamera != undefined) {

                    selectedCamera.traverse( function( child ) {

                        if( child.name === "CameraFrustum" ) {

                            child.visible = true;

                        }

                    } ) 

                }

                helper = new THREE.CameraHelper( selectedCamera, new THREE.Color( selectedCamera.helperColor ) );
                editor.execute( new AddObjectCommand( helper ) );
                //This will take the snapshot on main renderer( snapshot of the viewport )
                editor.takeViewportSnapShot = true;

                var camSnapshot = img;
                //var selectedCamera = camera;
                
                if ( editor.activeProject.user_id != undefined ){

                    // fixing the ill formed data url.
                    selectedCam = selectedCamera;
                    snapshotData = img;
                    snapshotData = snapshotData.replace( /^data:image\/(png|jpeg|jpg);base64,/, '' );
                    editor.base64ToBlob( snapshotData, 'image/png', 512 ).then( function( file ){
            
                        var snapshotImage = file;
                        if( selectedCam.userData.location != 'undefined' ) {
                            
                            cameraLocation = selectedCam.userData.location;
                            cameraLocation += '_';
            
                        } else {
            
                            cameraLocation = '';
            
                        }
            
                        refenceX =( selectedCam.userData.reference.x ).toFixed(0);   
                        refenceY =( selectedCam.userData.reference.y ).toFixed(0);   
                        refenceZ =( selectedCam.userData.reference.z ).toFixed(0);   
                        cameraX = ( selectedCam.position.x ).toFixed( 0 ) - refenceX ;
                        cameraY = ( selectedCam.position.y ).toFixed( 0 ) - refenceY ;
                        cameraZ = ( selectedCam.position.z ).toFixed( 0 ) - refenceZ;
                        cameraTiltX = ( ( selectedCam.rotation.x ) * 57.32 ).toFixed( 0 );
                        cameraTiltY = ( ( selectedCam.rotation.y ) * 57.32 ).toFixed( 0 );
                        cameraTiltZ = ( ( selectedCam.rotation.z ) * 57.32 ).toFixed( 0 );
            
                        //var url = renderer.domElement.toDataURL().replace( "image/png", "image/octet-stream" );
            
                        var cameraName = ( selectedCam.name ).replace( 'Perspective', '' );
                        var camSnapshotFileName = cameraLocation + cameraName;
                        camSnapshotFileName = camSnapshotFileName.replace( /\s+/g, '' );
                        camSnapshotFileName = camSnapshotFileName+ '_View(' + cameraX + ',' + cameraY + ',' + cameraZ + 'Deg' + cameraTiltX + ',' + cameraTiltY + ',' + cameraTiltZ + ')';
                        camSnapshotFileName = camSnapshotFileName + selectedCam.uuid;

                        
                            var fds = new FormData();
                            fds.append( 'file', snapshotImage, camSnapshotFileName );
                            if( camera.camCategory != 'Panorama' ) {
                            var digZoomValue = currentScreen.digZoomSlider.dom.value;

                            if( digZoomValue!= undefined && digZoomValue!= null ) {

                                var data = {
                                    digitalZoom: digZoomValue
                                }
                                var datas = JSON.stringify(data);
                                fds.append( 'datas', datas );

                            }
                    }
                        
                        //simulatedscreenshot(  + editor.activeProject.name, fds );
                        
                        var uid = localStorage.getItem( 'U_ID' ) + editor.activeProject.name;
                        $.ajax( {
                            
                            url: editor.api + 'screenshot/' + uid,
                            type: 'POST',
                            processData: false,
                            contentType: false,
                            data: fds,
                            success: function(response) {

                                var cameraUserdata = editor.scene.userData.cameraList;
                                var selectedCameraId = selectedCamera.uuid;
                                if(cameraUserdata == undefined){

                                    editor.scene.userData.cameraList= {};
                                    cameraUserdata = editor.scene.userData.cameraList
                                    var value = []
                                    var position = { "x": cameraX, "y": cameraY, "z": cameraZ };
                                    var rotation = { "x": cameraTiltX, "y": cameraTiltY, "z": cameraTiltZ }
                                    var newimg = camSnapshotFileName + "positionImage.jpg";
                                    var data = { "screenshotname": camSnapshotFileName + '.jpg', "position": position, "rotation": rotation, "positionimage": newimg, "focus": focus, "distance": distance, "cameraBrand": cameraBrand, "cameraBrandmodel": cameraBrandmodel, "cameraLocation": cameraLocation, "filmgauge": filmgauge, "fov": fov, "name": nameOfCamera , "refence" : cameraRefence,"hView": hView, "vView" :vView, "hFOV":hFOV, "aspect":aspect, "resolutionWidth" : resolutionWidth, "resolutionHeight": resolutionHeight, "opticalZoom": opticalZoom, "digitalZoom": digitalZoom,"tilt": tilt,"pan": pan,"roll": roll };
                                    value.push(data);

                                    cameraUserdata[selectedCameraId] = value;
                                    editor.scene.userData.cameraList = cameraUserdata ;
                                    editor.signals.sceneGraphChanged.dispatch();
                                    

                                }
                                else {

                                    if(cameraUserdata[selectedCameraId] == undefined){

                                        cameraUserdata[selectedCameraId] = [];
                                        var currentCameraArray = cameraUserdata[selectedCameraId];
                                        var position = { "x": cameraX, "y": cameraY, "z": cameraZ };
                                        var rotation = { "x": cameraTiltX, "y": cameraTiltY, "z": cameraTiltX }
                                        var newimg = camSnapshotFileName + "positionImage.jpg";
                                        var data = { "screenshotname": camSnapshotFileName + '.jpg', "position": position, "rotation": rotation, "positionimage": newimg, "focus": focus, "distance": distance, "cameraBrand": cameraBrand, "cameraBrandmodel": cameraBrandmodel, "cameraLocation": cameraLocation, "filmgauge": filmgauge, "fov": fov, "name": nameOfCamera ,"refence" : cameraRefence,"hView": hView, "vView" :vView, "hFOV":hFOV, "aspect":aspect, "resolutionWidth" : resolutionWidth, "resolutionHeight": resolutionHeight, "digitalZoom": digitalZoom, "opticalZoom": opticalZoom,"tilt": tilt,"pan": pan,"roll": roll }
                                        currentCameraArray.push(data);
                                        cameraUserdata[selectedCameraId] = currentCameraArray;
                                        editor.scene.userData.cameraList = cameraUserdata ;
                                        editor.signals.sceneGraphChanged.dispatch();
                                    }
                                    else {

                                        var currentCameraArray = cameraUserdata[selectedCameraId];
                                        var count = 0;
                                        var isDuplicateImage = false;
                                        currentCameraArray.forEach( function( imageDetail ){
                                            
                                            var currentImageName = camSnapshotFileName + '.jpg'
                                            if( imageDetail.screenshotname === currentImageName ){
                                                
                                                var position = { "x": cameraX, "y": cameraY, "z": cameraZ };
                                                var rotation = { "x": cameraTiltX, "y": cameraTiltY, "z": cameraTiltX }
                                                var newimg = camSnapshotFileName + "positionImage.jpg";
                                                var data = { "screenshotname": camSnapshotFileName + '.jpg', "position": position, "rotation": rotation, "positionimage": newimg, "focus": focus, "distance": distance, "cameraBrand": cameraBrand, "cameraBrandmodel": cameraBrandmodel, "cameraLocation": cameraLocation, "filmgauge": filmgauge, "fov": fov, "name": nameOfCamera ,"refence" : cameraRefence,"hView": hView, "vView" :vView, "hFOV":hFOV, "aspect":aspect, "resolutionWidth" : resolutionWidth, "resolutionHeight": resolutionHeight, "opticalZoom": opticalZoom, "digitalZoom": digitalZoom, "tilt": tilt,"pan": pan,"roll": roll }

                                                currentCameraArray[ count ] = data;

                                                cameraUserdata[selectedCameraId] = currentCameraArray;
                                                editor.scene.userData.cameraList = cameraUserdata ;
                                                editor.signals.sceneGraphChanged.dispatch();
                                                isDuplicateImage = true;

                                            }
                                            count++;
                                            
                                        } );

                                        if( isDuplicateImage == false ){

                                            var position = { "x": cameraX, "y": cameraY, "z": cameraZ };
                                            var rotation = { "x": cameraTiltX, "y": cameraTiltY, "z": cameraTiltX }
                                            var newimg = camSnapshotFileName + "positionImage.jpg";
                                            var data = { "screenshotname": camSnapshotFileName + '.jpg', "position": position, "rotation": rotation, "positionimage": newimg, "focus": focus, "distance": distance, "cameraBrand": cameraBrand, "cameraBrandmodel": cameraBrandmodel, "cameraLocation": cameraLocation, "filmgauge": filmgauge, "fov": fov, "name": nameOfCamera ,"refence" : cameraRefence,"hView": hView, "vView" :vView, "hFOV":hFOV, "aspect":aspect, "resolutionWidth" : resolutionWidth, "resolutionHeight": resolutionHeight, "digitalZoom": digitalZoom, "opticalZoom": opticalZoom, "tilt": tilt,"pan": pan,"roll": roll }
                                            currentCameraArray.push(data);
                                            cameraUserdata[selectedCameraId] = currentCameraArray;
                                            editor.scene.userData.cameraList = cameraUserdata ;
                                            editor.signals.sceneGraphChanged.dispatch();

                                        }

                                        isDuplicateImage = false;

                                    }         

                                }

                                //Modified for activity logging start
                                try{

                                    //Modified for activity logging start
                                    var logDatas = {};
                                    logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Theater mode : Snapshot taken for PerspectiveCamera : " + camera.name;
                                    logger.addLog( logDatas );
                                    logger.sendLogs( localStorage.getItem( 'U_ID' ) );
                                    //Modified for activity logging end

                                }
                                catch( exception ){

                                    console.log( "Logging failed!" );
                                    console.log( exception );

                                }
                                //Modified for activity logging end
                               
                            },
                            error: function(jqxhr, status, msg) {
                                toastr.error(editor.languageData.UploadFailedTryAgain);
                            }
                            
                        } );
            
                    }, function( error ){
                        
                        console.warn( error );
            
                    } );
                
                }
                else{
                    
                    toastr.error( "Please remember to save the project before you take the snapshot" );
                
                }

            }, function( error ){

                toastr.error( 'Sorry, something went wrong!' );

            } );

        //}
        //else{
        
            //toastr.error( "You have to be on a project before you take the snapshot" );

        //}
        
        scope.signals.viewportSnapshotTaken.addOnce( function( sceneSnapshot ){

            //selectedCamera.children[0].visible = false;
            if (selectedCamera != undefined) {

                selectedCamera.traverse( function( child ) {

                    if( child.name === "CameraFrustum" ) {

                        child.visible = false;

                    }

                } ) 

            }
            editor.execute( new RemoveObjectCommand( helper ) );
            if( editor.activeProject.user_id != undefined ){

                // fixing the ill formed data url.
                sceneSnapshot = sceneSnapshot.replace( /^data:image\/(png|jpeg|jpg);base64,/, '' );
                editor.base64ToBlob( sceneSnapshot, 'image/png', 512 ).then( function( file ){

                    var snapshotImage = file;
                    selectedCam = selectedCamera;
                    if( selectedCam.userData.location != 'undefined' ) {
                        
                        cameraLocation = selectedCam.userData.location;
                        cameraLocation += '_';
        
                    } else {
        
                        cameraLocation = '';
        
                    }
                    refenceX =( selectedCam.userData.reference.x ).toFixed(0);   
                    refenceY =( selectedCam.userData.reference.y ).toFixed(0);   
                    refenceZ =( selectedCam.userData.reference.z ).toFixed(0);   
                    cameraX = ( selectedCam.position.x ).toFixed( 0 ) - refenceX ;
                    cameraY = ( selectedCam.position.y ).toFixed( 0 ) - refenceY ;
                    cameraZ = ( selectedCam.position.z ).toFixed( 0 ) - refenceZ;
                    cameraTiltX = ( ( selectedCam.rotation.x ) * 57.32 ).toFixed( 0 );
                    cameraTiltY = ( ( selectedCam.rotation.y ) * 57.32 ).toFixed( 0 );
                    cameraTiltZ = ( ( selectedCam.rotation.z ) * 57.32 ).toFixed( 0 );
        
                    var cameraName = ( selectedCam.name ).replace( 'Perspective', '' );
                    var viewportImgName = cameraLocation + cameraName;
                    viewportImgName = viewportImgName.replace( /\s+/g, '' );
                    viewportImgName = viewportImgName + '_View(' + cameraX + ',' + cameraY + ',' + cameraZ + 'Deg' + cameraTiltX + ',' + cameraTiltY + ',' + cameraTiltZ + ')';
                    viewportImgName = viewportImgName + selectedCam.uuid;

                    var cameraName = (selectedCam.name).replace('Perspective', '');
                    var filename = viewportImgName + 'positionImage';
                    var nameForImage = viewportImgName + 'positionImage';
                    var viewportFormData = new FormData();
                    viewportFormData.append( 'file', snapshotImage, nameForImage );
                    
                    //camerascreenshot( localStorage.getItem('U_ID') + editor.activeProject.name, viewportFormData );
                    var uid = localStorage.getItem('U_ID') + editor.activeProject.name;
                    $.ajax({
                        url: editor.api + 'cameraScreenshot/' + uid,
                        type: 'POST',
                        processData: false,
                        contentType: false,
                        data: viewportFormData,
                        success: function(response) {

                            toastr.success( editor.languageData.SuccessfullyUploadedToServer );
                            //editor.execute( new RemoveObjectCommand( helper ) );

                        },
                        error: function(jqxhr, status, msg) {
                            toastr.error( editor.languageData.UploadFailedTryAgain);
                            //editor.execute( new RemoveObjectCommand( helper ) );
                        }
                    });

                }, function( error ){
                    
                    console.warn( error );

                } );
                    
            }
            else{
                
                toastr.error( editor.languageData.Pleaseremembertosavetheprojectbeforeyoutakethesnapshot );
            
            }

        } );

    },

    /**
     * takeSnapShotWhenPaused( camera, img ) - Method to take camera snapshot when the view is paused.
     * @param {Object<THREE.PerspectiveCamera>} camera  - Instance of THREE.PerspectiveCamera
     * @param {Object<base-64>} img  - snapshot image taken
	 * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of takeSnapShotWhenPaused method.</caption>
     * simulationManager.takeSnapShotWhenPaused( camera, img );
     */
    
    takeSnapShotWhenPaused : function( camera, img ){

        var scope = this;
        var selectedCamera = camera;
        var cameraX, cameraY, cameraZ;
        var cameraTiltX, cameraTiltY, cameraTiltZ,refenceX ,refenceY,refenceZ;
        var focus;
        var distance;
        var cameraBrand, opticalZoom, digitalZoom, tilt, pan, roll;
        var cameraBrandmodel;
        var cameraLocation;
        var filmgauge;
        var fov;
        var cameraRefence;
        var nameOfCamera, helper,hView,vView,hFOV,aspect,resolutionWidth,resolutionHeight;
        
        //This will take the snapshot on main renderer( snapshot of the viewport )
        editor.takeViewprtSnpshtWhnCamPaused = true;

        if( editor.activeProject.user_id === undefined ){

            toastr.warning( editor.languageData.Youhavetobeonaprojectbeforeyoutakethesnapshot );
            return;

        }
            
        if( !( selectedCamera instanceof THREE.PerspectiveCamera ) ){

            alert( editor.languageData.Selectacamerathenclickonthesnapshotbuttontotakesnapshot );
            return;

        }
        focus = selectedCamera.focus;
        distance = (scope.screens[ selectedCamera.uuid ] != undefined ) ? scope.screens[ selectedCamera.uuid ].distance : selectedCamera.distance;
        hView = (scope.screens[ selectedCamera.uuid ] != undefined ) ? scope.screens[ selectedCamera.uuid ].hView : selectedCamera.hView;
        vView = (scope.screens[ selectedCamera.uuid ] != undefined ) ? scope.screens[ selectedCamera.uuid ].vView : selectedCamera.vView;
        hFOV = selectedCamera.hFOV;
        aspect = selectedCamera.aspect;
        resolutionWidth = selectedCamera.resolutionWidth;
        resolutionHeight = selectedCamera.resolutionHeight;
        cameraBrand = selectedCamera.userData.cameraBrand;
        cameraBrandmodel = selectedCamera.userData.cameraModel;
        cameraLocation = selectedCamera.userData.location;
        filmgauge = selectedCamera.filmGauge;
        fov = selectedCamera.fov;
        nameOfCamera = selectedCamera.name;
        cameraRefence = selectedCamera.userData.reference;
        //opticalZoom = selectedCamera.opticalZoom;
        //digitalZoom = selectedCamera.digitalZoom;
        tilt = selectedCamera.userData.tiltRotationValue;
        pan = selectedCamera.userData.panRotationValue;
        roll = selectedCamera.userData.rollRotationValue;

        refenceX =( selectedCamera.userData.reference.x ).toFixed(0);   
        refenceY =( selectedCamera.userData.reference.y ).toFixed(0);   
        refenceZ =( selectedCamera.userData.reference.z ).toFixed(0);   
        cameraX = ( selectedCamera.position.x ).toFixed( 0 ) - refenceX ;
        cameraY = ( selectedCamera.position.y ).toFixed( 0 ) - refenceY ;
        cameraZ = ( selectedCamera.position.z ).toFixed( 0 ) - refenceZ;
        cameraTiltX = ((selectedCamera.rotation.x) * 57.32).toFixed(0);
        cameraTiltY = ((selectedCamera.rotation.y) * 57.32).toFixed(0);
        cameraTiltZ = ((selectedCamera.rotation.z) * 57.32).toFixed(0);

        if( simulationManager && simulationManager.screens[camera.uuid] ) {

            var currentScreen = simulationManager.screens[camera.uuid];
            var opticalZoomValue = currentScreen.zoomSlider.dom.value;
            var digitalZoomValue = currentScreen.digZoomSlider.dom.value;

            if( opticalZoomValue!= null && opticalZoomValue!= undefined ) {

                opticalZoomValue = opticalZoomValue + 'x';
                opticalZoom = opticalZoomValue;

            } else {

                opticalZoom = selectedCamera.opticalZoom;

            }

            if( digitalZoomValue!= null && digitalZoomValue!= undefined ) {

                digitalZoomValue = digitalZoomValue + 'x';
                digitalZoom = digitalZoomValue;

            } else {

                digitalZoom = selectedCamera.digitalZoom;

            }

        }
        
        if ( editor.activeProject.user_id != undefined ){
            
            // fixing the ill formed data url.
            selectedCam = selectedCamera;
            snapshotData = img;
            snapshotData = snapshotData.replace( /^data:image\/(png|jpeg|jpg);base64,/, '' );
            editor.base64ToBlob( snapshotData, 'image/png', 512 ).then( function( file ){
    
                var snapshotImage = file;
                if( selectedCam.userData.location != 'undefined' ) {
                    
                    cameraLocation = selectedCam.userData.location;
                    cameraLocation += '_';
    
                } else {
    
                    cameraLocation = '';
    
                }
    
                refenceX =( selectedCam.userData.reference.x ).toFixed(0);   
                refenceY =( selectedCam.userData.reference.y ).toFixed(0);   
                refenceZ =( selectedCam.userData.reference.z ).toFixed(0);   
                cameraX = ( selectedCam.position.x ).toFixed( 0 ) - refenceX ;
                cameraY = ( selectedCam.position.y ).toFixed( 0 ) - refenceY ;
                cameraZ = ( selectedCam.position.z ).toFixed( 0 ) - refenceZ;
                cameraTiltX = ( ( selectedCam.rotation.x ) * 57.32 ).toFixed( 0 );
                cameraTiltY = ( ( selectedCam.rotation.y ) * 57.32 ).toFixed( 0 );
                cameraTiltZ = ( ( selectedCam.rotation.z ) * 57.32 ).toFixed( 0 );
    
                var cameraName = ( selectedCam.name ).replace( 'Perspective', '' );
                var camSnapshotFileName = cameraLocation + cameraName;
                camSnapshotFileName = camSnapshotFileName.replace( /\s+/g, '' );
                camSnapshotFileName = camSnapshotFileName+ '_View(' + cameraX + ',' + cameraY + ',' + cameraZ + 'Deg' + cameraTiltX + ',' + cameraTiltY + ',' + cameraTiltZ + ')';
                camSnapshotFileName = camSnapshotFileName + selectedCam.uuid;
                
                var fds = new FormData();
                fds.append( 'file', snapshotImage, camSnapshotFileName );
                var digZoomValue = currentScreen.digZoomSlider.dom.value;
                if( digZoomValue!= undefined && digZoomValue!= null ) {

                    var data = {
                        digitalZoom: digZoomValue
                    }
                    var datas = JSON.stringify(data);
                    fds.append( 'datas', datas );

                }
                
                var uid = localStorage.getItem( 'U_ID' ) + editor.activeProject.name;
                $.ajax( {
                    
                    url: editor.api + 'screenshot/' + uid,
                    type: 'POST',
                    processData: false,
                    contentType: false,
                    data: fds,
                    success: function(response) {

                        var cameraUserdata = editor.scene.userData.cameraList;
                        var selectedCameraId = selectedCamera.uuid;
                        if(cameraUserdata == undefined){

                            editor.scene.userData.cameraList= {};
                            cameraUserdata = editor.scene.userData.cameraList
                            var value = []
                            var position = { "x": cameraX, "y": cameraY, "z": cameraZ };
                            var rotation = { "x": cameraTiltX, "y": cameraTiltY, "z": cameraTiltZ }
                            var newimg = camSnapshotFileName + "positionImage.jpg";
                            var data = { "screenshotname": camSnapshotFileName + '.jpg', "position": position, "rotation": rotation, "positionimage": newimg, "focus": focus, "distance": distance, "cameraBrand": cameraBrand, "cameraBrandmodel": cameraBrandmodel, "cameraLocation": cameraLocation, "filmgauge": filmgauge, "fov": fov, "name": nameOfCamera , "refence" : cameraRefence,"hView": hView, "vView" :vView, "hFOV":hFOV, "aspect":aspect, "resolutionWidth" : resolutionWidth, "resolutionHeight": resolutionHeight, "opticalZoom": opticalZoom, "digitalZoom": digitalZoom,"tilt": tilt,"pan": pan,"roll": roll };
                            value.push(data);

                            cameraUserdata[selectedCameraId] = value;
                            editor.scene.userData.cameraList = cameraUserdata ;
                            editor.signals.sceneGraphChanged.dispatch();
                            

                        }
                        else {

                            if(cameraUserdata[selectedCameraId] == undefined){

                                cameraUserdata[selectedCameraId] = [];
                                var currentCameraArray = cameraUserdata[selectedCameraId];
                                var position = { "x": cameraX, "y": cameraY, "z": cameraZ };
                                var rotation = { "x": cameraTiltX, "y": cameraTiltY, "z": cameraTiltX }
                                var newimg = camSnapshotFileName + "positionImage.jpg";
                                var data = { "screenshotname": camSnapshotFileName + '.jpg', "position": position, "rotation": rotation, "positionimage": newimg, "focus": focus, "distance": distance, "cameraBrand": cameraBrand, "cameraBrandmodel": cameraBrandmodel, "cameraLocation": cameraLocation, "filmgauge": filmgauge, "fov": fov, "name": nameOfCamera ,"refence" : cameraRefence,"hView": hView, "vView" :vView, "hFOV":hFOV, "aspect":aspect, "resolutionWidth" : resolutionWidth, "resolutionHeight": resolutionHeight, "digitalZoom": digitalZoom, "opticalZoom": opticalZoom,"tilt": tilt,"pan": pan,"roll": roll }
                                currentCameraArray.push(data);
                                cameraUserdata[selectedCameraId] = currentCameraArray;
                                editor.scene.userData.cameraList = cameraUserdata ;
                                editor.signals.sceneGraphChanged.dispatch();
                            }
                            else {

                                var currentCameraArray = cameraUserdata[selectedCameraId];
                                var count = 0;
                                var isDuplicateImage = false;
                                currentCameraArray.forEach( function( imageDetail ){
                                    
                                    var currentImageName = camSnapshotFileName + '.jpg'
                                    if( imageDetail.screenshotname === currentImageName ){
                                        
                                        var position = { "x": cameraX, "y": cameraY, "z": cameraZ };
                                        var rotation = { "x": cameraTiltX, "y": cameraTiltY, "z": cameraTiltX }
                                        var newimg = camSnapshotFileName + "positionImage.jpg";
                                        var data = { "screenshotname": camSnapshotFileName + '.jpg', "position": position, "rotation": rotation, "positionimage": newimg, "focus": focus, "distance": distance, "cameraBrand": cameraBrand, "cameraBrandmodel": cameraBrandmodel, "cameraLocation": cameraLocation, "filmgauge": filmgauge, "fov": fov, "name": nameOfCamera ,"refence" : cameraRefence,"hView": hView, "vView" :vView, "hFOV":hFOV, "aspect":aspect, "resolutionWidth" : resolutionWidth, "resolutionHeight": resolutionHeight, "opticalZoom": opticalZoom, "digitalZoom": digitalZoom, "tilt": tilt,"pan": pan,"roll": roll }

                                        currentCameraArray[ count ] = data;

                                        cameraUserdata[selectedCameraId] = currentCameraArray;
                                        editor.scene.userData.cameraList = cameraUserdata ;
                                        editor.signals.sceneGraphChanged.dispatch();
                                        isDuplicateImage = true;

                                    }
                                    count++;
                                    
                                } );

                                if( isDuplicateImage == false ){

                                    var position = { "x": cameraX, "y": cameraY, "z": cameraZ };
                                    var rotation = { "x": cameraTiltX, "y": cameraTiltY, "z": cameraTiltX }
                                    var newimg = camSnapshotFileName + "positionImage.jpg";
                                    var data = { "screenshotname": camSnapshotFileName + '.jpg', "position": position, "rotation": rotation, "positionimage": newimg, "focus": focus, "distance": distance, "cameraBrand": cameraBrand, "cameraBrandmodel": cameraBrandmodel, "cameraLocation": cameraLocation, "filmgauge": filmgauge, "fov": fov, "name": nameOfCamera ,"refence" : cameraRefence,"hView": hView, "vView" :vView, "hFOV":hFOV, "aspect":aspect, "resolutionWidth" : resolutionWidth, "resolutionHeight": resolutionHeight, "digitalZoom": digitalZoom, "opticalZoom": opticalZoom, "tilt": tilt,"pan": pan,"roll": roll }
                                    currentCameraArray.push(data);
                                    cameraUserdata[selectedCameraId] = currentCameraArray;
                                    editor.scene.userData.cameraList = cameraUserdata ;
                                    editor.signals.sceneGraphChanged.dispatch();

                                }

                                isDuplicateImage = false;

                            }         

                        }

                        //Modified for activity logging start
                        try{

                            //Modified for activity logging start
                            var logDatas = {};
                            logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Theater mode : Snapshot taken for PerspectiveCamera : " + camera.name;
                            logger.addLog( logDatas );
                            logger.sendLogs( localStorage.getItem( 'U_ID' ) );
                            //Modified for activity logging end

                        }
                        catch( exception ){

                            console.log( "Logging failed!" );
                            console.log( exception );

                        }
                        //Modified for activity logging end
                        
                    },
                    error: function(jqxhr, status, msg) {
                        toastr.error(editor.languageData.UploadFailedTryAgain);
                    }
                    
                } );
    
            }, function( error ){
                
                console.warn( error );
    
            } );
        
        }
        else{
            
            toastr.error( "Please remember to save the project before you take the snapshot" );
        
        }

        editor.signals.vwprtSnpshtTakenWhenCamPaused.addOnce( function( sceneSnapshot ){
            
            if( editor.activeProject.user_id != undefined ){

                // fixing the ill formed data url.
                sceneSnapshot = sceneSnapshot.replace( /^data:image\/(png|jpeg|jpg);base64,/, '' );
                editor.base64ToBlob( sceneSnapshot, 'image/png', 512 ).then( function( file ){

                    var snapshotImage = file;
                    selectedCam = selectedCamera;
                    if( selectedCam.userData.location != 'undefined' ) {
                        
                        cameraLocation = selectedCam.userData.location;
                        cameraLocation += '_';
        
                    } else {
        
                        cameraLocation = '';
        
                    }
                    refenceX =( selectedCam.userData.reference.x ).toFixed(0);   
                    refenceY =( selectedCam.userData.reference.y ).toFixed(0);   
                    refenceZ =( selectedCam.userData.reference.z ).toFixed(0);   
                    cameraX = ( selectedCam.position.x ).toFixed( 0 ) - refenceX ;
                    cameraY = ( selectedCam.position.y ).toFixed( 0 ) - refenceY ;
                    cameraZ = ( selectedCam.position.z ).toFixed( 0 ) - refenceZ;
                    cameraTiltX = ( ( selectedCam.rotation.x ) * 57.32 ).toFixed( 0 );
                    cameraTiltY = ( ( selectedCam.rotation.y ) * 57.32 ).toFixed( 0 );
                    cameraTiltZ = ( ( selectedCam.rotation.z ) * 57.32 ).toFixed( 0 );
        
                    var cameraName = ( selectedCam.name ).replace( 'Perspective', '' );
                    var viewportImgName = cameraLocation + cameraName;
                    viewportImgName = viewportImgName.replace( /\s+/g, '' );
                    viewportImgName = viewportImgName + '_View(' + cameraX + ',' + cameraY + ',' + cameraZ + 'Deg' + cameraTiltX + ',' + cameraTiltY + ',' + cameraTiltZ + ')';
                    viewportImgName = viewportImgName + selectedCam.uuid;

                    var cameraName = (selectedCam.name).replace('Perspective', '');
                    var filename = viewportImgName + 'positionImage';
                    var nameForImage = viewportImgName + 'positionImage';
                    var viewportFormData = new FormData();
                    viewportFormData.append( 'file', snapshotImage, nameForImage );

                    var uid = localStorage.getItem('U_ID') + editor.activeProject.name;
                    $.ajax({
                        url: editor.api + 'cameraScreenshot/' + uid,
                        type: 'POST',
                        processData: false,
                        contentType: false,
                        data: viewportFormData,
                        success: function(response) {

                            toastr.success( editor.languageData.SuccessfullyUploadedToServer );

                        },
                        error: function(jqxhr, status, msg) {
                            toastr.error( editor.languageData.UploadFailedTryAgain);
                        }
                    });

                }, function( error ){
                    
                    console.warn( error );

                } );
                    
            }
            else{
                
                toastr.error( editor.languageData.Pleaseremembertosavetheprojectbeforeyoutakethesnapshot );
            
            }

        } );

    }

}

SimulationManager.prototype.constructor = SimulationManager;