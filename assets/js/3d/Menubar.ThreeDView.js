/**
 * Menubar.ThreeDView( editor ) : Constructor for adding 3D View option in the menubar
 * @constructor
 * @param {any} editor - The instance of the Editor which manages the overall objects and signals
 * @returns {Object<UI.Panel>}
 * @author Mavelil
 * @example <caption>Example usage of Menubar.ThreeDView</caption>
 * var menubarThreeDView = new Menubar.ThreeDView( editor );
 */
Menubar.ThreeDView = function ( editor ) {

	var container = new UI.Panel();
	container.setClass( 'menu' );

	var title = new UI.Panel();
	title.setClass( 'title selectMenubar' );
	title.setId('threedview');
	title.setTextContent( editor.languageData.ThreeDview );
	title.onClick( function () {
        editor.selected = null;

        if( editor.areaShowHideToggle === true ){

            var areaShowHide = document.getElementById( 'area-show-measurements-li' );
            areaShowHide.click();

        }
        //If we are in the area measurement mode, ask for confirmation before switching to another views
        if( editor.isAreaMeasuring === true ){

            if( confirm( editor.languageData.YouareintheAreaMeasurementswhichissupportedonlyon2DtopviewIfyouswitchtotheotherviewsnowyouwilllooseunsavedmeasurementsDoyouwishtoswitchtotheselectedview ) === false ){

                return;

            }
            else{

                var areaButton = document.getElementById( 'area-enable-measure-mode-li' );
                areaButton.click();

            }

        }
        
        if( editor.msrmntsShowHideToggle === true ){

            editor.areaMeasurement.hideAreaMeasurements();

        }

        //If we are in twod drawing mode, asl for confirmation before switching to another views
        if( editor.isTwoDMeasurementEnabled === true ) {

            if( confirm( editor.languageData.YouareintheTwoDMeasurementswhichissupportedonlyonFloorplantopviewIfyouswitchtotheotherviewsnowyouwilllooseunsavedmeasurementsDoyouwishtoswitchtotheselectedview ) === false ){

                return;

            }else{

                var enableTwoDMeasurements = document.getElementById('twod-enable-measure-mode-li');
                enableTwoDMeasurements.click();

            }

        }

        if( editor.twoDDrawingsShowHideToggle === true ){

            if( confirm( editor.languageData.YouareintheTwoDMeasurementswhichissupportedonlyonFloorplantopviewIfyouswitchtotheotherviewsnowyouwilllooseunsavedmeasurementsDoyouwishtoswitchtotheselectedview ) === false ){

                return;

            }else{

                var showHideTwoDMeasurements = document.getElementById('twod-show-measurements-li');
                showHideTwoDMeasurements.click();

            }

        }

        editor.scaleAllIcons();
        //Modified for orthographic top-view start
        editor.camera = editor.DEFAULT_CAMERA.clone();
        editor.camera.zoom = 1;
        editor.camera.updateProjectionMatrix();
        editor.signals.sceneCameraChanged.dispatch( editor.camera );
        //Modified for orthographic top-view end

        if(editor.threeDpostion.x != undefined){

            editor.selectedView=true;
            editor.camera.matrixAutoUpdate=true;
            editor.execute( new SetPositionCommand( editor.camera, new THREE.Vector3( editor.threeDpostion.x, editor.threeDpostion.y, editor.threeDpostion.z ) ) );
            editor.execute( new SetRotationCommand( editor.camera, new THREE.Euler( editor.threeDrotation.x, editor.threeDrotation.y,editor.threeDrotation.z ) ) );
            hidedome();

        }
        // **Commented when the camera icons sprite were replaced with plane Start**
        /*function executeLoop( err, array ) {
                    
            delayedLoop( array, function( err, key, next ) {
        
                if( key.children[ 0 ] instanceof THREE.Sprite ){

                    editor.getNumberBadgeIcon( { badgeText: key.badgeText, badgeRadius: 30, badgeColor: key.helperColor, type: "image", imageUrl: key.iconUrl } ).then(

                        function( icon ){

                            key.children[ 0 ].material.map = icon;
                            editor.signals.sceneGraphChanged.dispatch();

                        },
                        function( err ){

                            console.log( "Failed to change camera icon" );

                        }

                    );

                }
                next();
        
            }, function() {
        
                //completed the loop
                editor.signals.sceneGraphChanged.dispatch();
                
        
            } );
        
        }
        
        function delayedLoop( array, callback, finish ) {
        
            var copy = array.slice();
            (function recur() {
        
                var item = copy.shift();
                if (item) {
        
                    callback( null, item, recur );
        
                } else {
        
                    if ( typeof finish == 'function' ) { 
        
                        finish();
        
                    }
        
                }
        
            } )();
            
        }
        executeLoop( null, editor.sceneCameras );*/
        // **Commented when the camera icons sprite were replaced with plane End**
        //Modified to auto scale icons start
        editor.scaleAllIcons();
        //Modified to auto scale icons end

        //Modified for rescaling the network cables for top views start
        editor.networking.rescaleCablesForPerspectiveCamera();
        //Modified for rescaling the network cables for top views end

        //Enabling the zoom buttons for 3D view start
        document.getElementById( 'zoomIn' ).disabled = false;
        document.getElementById( 'zoomOut' ).disabled = false;
        //Enabling the zoom buttons for 3D view end

        editor.isFloorplanViewActive = false;

        //Modified for activity logging start
        try{

            //Modified for activity logging start
            var logDatas = {};
            logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Changed view mode to 3D view";
            logger.addLog( logDatas );
            logger.sendLogs( localStorage.getItem( 'U_ID' ) );
            //Modified for activity logging end

        }
        catch( exception ){

            console.log( "Logging failed!" );
            console.log( exception );

        }
        //Modified for activity logging end

	});
	container.add( title );
    function hidedome(){
         
        /*if(editor.isMeasuring){

            document.getElementById('measure-tool-btn').click();
        }*/
        document.getElementById("twoDView").classList.remove("selectMenubar");
        document.getElementById("floorplan-views").classList.remove("selectMenubar");
        document.getElementById("threedview").className += " selectMenubar";
        
        if(localStorage.getItem("viewmode") != "true"){
            document.getElementById('screenshot_2d').style.display ="none";
            document.getElementById('screenshot_3d').style.display ="block";
            document.getElementById('generate_report').style.display ="block";
        }
        
        document.getElementById("twodRight").style.backgroundColor = "";
        document.getElementById("twodLeft").style.backgroundColor = "";
        document.getElementById("twodTop").style.backgroundColor = "";

        document.getElementById('floorplan-top').style.backgroundColor = "";
        document.getElementById('floorplan-left').style.backgroundColor = "";
        document.getElementById('floorplan-right').style.backgroundColor = "";
        
    }
	return container;
	

};