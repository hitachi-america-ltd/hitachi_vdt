
/**
 * Menubar.FloorplanViews( editor ) : Constructor for adding Floorplan option in the menubar
 * @constructor
 * @param {any} editor - The instance of the Editor which manages the overall objects and signals
 * @returns {Object<UI.Panel>}
 * @author Hari
 * @example <caption>Example usage of Menubar.FloorplanViews</caption>
 * var menubarFloorplanViews = new Menubar.FloorplanViews( editor );
 */

Menubar.FloorplanViews = function( editor ) {

    var container = new UI.Panel();
    container.setClass( 'menu' );

    var title = new UI.Panel();
    title.setClass( 'title' );
    title.setId( 'floorplan-views' );
    title.setTextContent( editor.languageData.MenubarFloorplanViews );
    container.add( title );

    var options = new UI.Panel();
    options.setClass( 'options' );
    container.add( options );

    var top = new UI.Row();
    top.setClass( 'option' );
    top.setId( 'floorplan-top' );
    top.setTextContent( editor.languageData.TopView );
    top.onClick( function() {

        editor.deselect();

        if(editor.liveTwodViewFlag){

            toastr.warning( editor.languageData.StopTheLiveViewModeaAndGoToThe2DViewMode );
            return;   

        }
        if( editor.selectedView ) {

            var postionX = editor.camera.position.x;
            var postionY = editor.camera.position.y;
            var postionZ = editor.camera.position.z;
            var rotationX = editor.camera.rotation.x;
            var rotationY = editor.camera.rotation.y;
            var rotationZ = editor.camera.rotation.z;
            editor.threeDpostion.x = postionX;
            editor.threeDpostion.y = postionY;
            editor.threeDpostion.z = postionZ;
            editor.threeDrotation.x = rotationX;
            editor.threeDrotation.y = rotationY;
            editor.threeDrotation.z = rotationZ;

        }

        //Modified for orthographic top-view start
        if( editor.FloorplanZoomTop == ''){

            editor.orthoCamera.zoom = 1;
        }
        else{

            editor.orthoCamera.zoom =  editor.FloorplanZoomTop;
        }
        
        editor.orthoCamera.updateProjectionMatrix();
        editor.camera = editor.orthoCamera;
        editor.signals.sceneCameraChanged.dispatch( editor.camera );
        //Modified for orthographic top-view end

        editor.selectedView = false;
        editor.camera.matrixAutoUpdate = true;
        editor.type2dView = 1;
        var object = editor.camera;
        editor.execute( new SetPositionCommand( object, new THREE.Vector3( 00, 61 , 00 ) ) );
        editor.execute( new SetRotationCommand( object, new THREE.Euler( -1.5708, 0, 0 ) ) );
        editor.camera.matrixAutoUpdate = false;
        showDome();
        document.getElementById( 'floorplan-top' ).style.backgroundColor = "rgb(219, 220, 213)";
        document.getElementById( 'floorplan-left' ).style.backgroundColor = "";
        document.getElementById( 'floorplan-right' ).style.backgroundColor = "";
        document.getElementById( 'floorplan-bottem' ).style.backgroundColor = "";
        document.getElementById( 'floorplan-front' ).style.backgroundColor = "";
        document.getElementById( 'floorplan-back' ).style.backgroundColor = "";

        //Disabling the zoom buttons for floorplan views start
        //document.getElementById( 'zoomIn' ).disabled = true;
        //document.getElementById( 'zoomOut' ).disabled = true;
        //Disabling the zoom buttons for floorplan views end
        // **Commented when the camera icons sprite were replaced with plane Start**
        /*function executeLoop( err, array ) {

            delayedLoop( array, function( err, key, next ) {

                if( key.children[ 0 ] instanceof THREE.Sprite ) {

                    editor.getNumberBadgeIcon( { badgeText: key.badgeText, type: "image" } ).then(

                        function( icon ) {

                            key.children[ 0 ].material.map = icon;
                            editor.signals.sceneGraphChanged.dispatch();

                        },
                        function( err ) {

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
            ( function recur() {

                var item = copy.shift();
                if( item ) {

                    callback( null, item, recur );

                } else {

                    if( typeof finish == 'function' ) {

                        finish();

                    }

                }

            } )();

        }
        executeLoop( null, editor.sceneCameras );*/
        // **Commented when the camera icons sprite were replaced with plane End**
        if( editor.msrmntsShowHideToggle === true ) {
            editor.areaMeasurement.showAreaMeasurements();
        }

        //Modified to auto scale icons start
        //editor.scaleAllIcons();
        editor.orthographicScale();
        //Modified to auto scale icons end

        //Modified for rescaling the network cables for top views start
        editor.networking.rescaleCablesForOrthographicCamera();
        //Modified for rescaling the network cables for top views end

        editor.isFloorplanViewActive = true;

        //Modified to resize transformControls in floorplan view start
        editor.signals.resizeTransformControls.dispatch( 'floorPlanView' );
        //Modified to resize transformControls in floorplan view end

        editor.signals.restoreBadgesToLastSize.dispatch();

        //Modified for activity logging start
        try {

            //Modified for activity logging start
            var logDatas = {};
            logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Changed view mode to Floorplan top view";
            logger.addLog( logDatas );
            logger.sendLogs( localStorage.getItem( 'U_ID' ) );
            //Modified for activity logging end

        }
        catch( exception ) {

            console.log( "Logging failed!" );
            console.log( exception );

        }
        //Modified for activity logging end

    } );
    options.add( top );


    var left = new UI.Row();
    left.setClass( 'option' );
    left.setId( 'floorplan-left' );
    left.setTextContent( editor.languageData.LeftView );
    left.onClick( function() {

        editor.deselect();
        if(editor.liveTwodViewFlag){

            toastr.warning( editor.languageData.StopTheLiveViewModeaAndGoToThe2DViewMode );
            return;   

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

        //If we are in the area measurement mode, ask for confirmation before switching to another views
        if( editor.isAreaMeasuring === true ) {

            if( confirm( editor.languageData.YouareintheAreaMeasurementswhichissupportedonlyon2DtopviewIfyouswitchtotheotherviewsnowyouwilllooseunsavedmeasurementsDoyouwishtoswitchtotheselectedview ) === false ) {

                return;

            }
            else {

                var areaButton = document.getElementById( 'area-enable-measure-mode-li' );
                areaButton.click();

            }

        }

        if( editor.selectedView ) {

            var postionX = editor.camera.position.x;
            var postionY = editor.camera.position.y;
            var postionZ = editor.camera.position.z;
            var rotationX = editor.camera.rotation.x;
            var rotationY = editor.camera.rotation.y;
            var rotationZ = editor.camera.rotation.z;
            editor.threeDpostion.x = postionX;
            editor.threeDpostion.y = postionY;
            editor.threeDpostion.z = postionZ;
            editor.threeDrotation.x = rotationX;
            editor.threeDrotation.y = rotationY;
            editor.threeDrotation.z = rotationZ;

        }

        //Modified for orthographic top-view start

        if( editor.FloorplanZoomLeft == ''){

            editor.orthoCamera.zoom = 1;
        }
        else{

            editor.orthoCamera.zoom =  editor.FloorplanZoomLeft;
        }
        editor.orthoCamera.updateProjectionMatrix();
        editor.camera = editor.orthoCamera;
        editor.signals.sceneCameraChanged.dispatch( editor.camera );
        //Modified for orthographic top-view end

        editor.selectedView = false;
        editor.camera.matrixAutoUpdate = true;
        var x;
        document.getElementById( 'zoomIn' ).style.display = 'block';
        document.getElementById( 'zoomOut' ).style.display = 'block';
        var object = editor.camera;
        editor.type2dView = 2;
        editor.execute( new SetPositionCommand( object, new THREE.Vector3( -60, 00, 00 ) ) );
        editor.execute( new SetRotationCommand( object, new THREE.Euler( -1.5708, -1.5708, -1.5708 ) ) );
        editor.camera.matrixAutoUpdate = false;
        showDome();
        document.getElementById( 'floorplan-left' ).style.backgroundColor = "rgb(219, 220, 213)";
        document.getElementById( 'floorplan-top' ).style.backgroundColor = "";
        document.getElementById( 'floorplan-right' ).style.backgroundColor = "";
        document.getElementById( 'floorplan-bottem' ).style.backgroundColor = "";
        document.getElementById( 'floorplan-front' ).style.backgroundColor = "";
        document.getElementById( 'floorplan-back' ).style.backgroundColor = "";

        if( editor.msrmntsShowHideToggle === true ) {
            editor.areaMeasurement.hideAreaMeasurements();
        }

        //Modified to auto scale icons start
        //editor.scaleAllIcons();
        editor.orthographicScale();
        //Modified to auto scale icons end

        //Modified for rescaling the network cables for top views start
        editor.networking.rescaleCablesForOrthographicCamera();
        //Modified for rescaling the network cables for top views end

        editor.isFloorplanViewActive = true;
        //Modified to resize transformControls in floorplan view start
        editor.signals.resizeTransformControls.dispatch( 'floorPlanView' );
        //Modified to resize transformControls in floorplan view end
        editor.signals.restoreBadgesToLastSize.dispatch();

        //Modified for activity logging start
        try {

            //Modified for activity logging start
            var logDatas = {};
            logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Changed view mode to Floorplan left view";
            logger.addLog( logDatas );
            logger.sendLogs( localStorage.getItem( 'U_ID' ) );
            //Modified for activity logging end

        }
        catch( exception ) {

            console.log( "Logging failed!" );
            console.log( exception );

        }
        //Modified for activity logging end

    } );
    options.add( left );

    var right = new UI.Row();
    right.setClass( 'option' );
    right.setId( 'floorplan-right' );
    right.setTextContent( editor.languageData.RightView );
    right.onClick( function() {

        editor.deselect();
        if(editor.liveTwodViewFlag){

            toastr.warning( editor.languageData.StopTheLiveViewModeaAndGoToThe2DViewMode );
            return;   

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

        //If we are in the area measurement mode, ask for confirmation before switching to another views
        if( editor.isAreaMeasuring === true ) {

            if( confirm( editor.languageData.YouareintheAreaMeasurementswhichissupportedonlyon2DtopviewIfyouswitchtotheotherviewsnowyouwilllooseunsavedmeasurementsDoyouwishtoswitchtotheselectedview ) === false ) {

                return;

            }
            else {

                var areaButton = document.getElementById( 'area-enable-measure-mode-li' );
                areaButton.click();

            }

        }

        if( editor.selectedView ) {

            var postionX = editor.camera.position.x;
            var postionY = editor.camera.position.y;
            var postionZ = editor.camera.position.z;
            var rotationX = editor.camera.rotation.x;
            var rotationY = editor.camera.rotation.y;
            var rotationZ = editor.camera.rotation.z;
            editor.threeDpostion.x = postionX;
            editor.threeDpostion.y = postionY;
            editor.threeDpostion.z = postionZ;
            editor.threeDrotation.x = rotationX;
            editor.threeDrotation.y = rotationY;
            editor.threeDrotation.z = rotationZ;

        }

        //Modified for orthographic top-view start

        if( editor.FloorplanZoomRight == ''){

            editor.orthoCamera.zoom = 1;
        }
        else{

            editor.orthoCamera.zoom =  editor.FloorplanZoomRight;
        }

        editor.orthoCamera.updateProjectionMatrix();
        editor.camera = editor.orthoCamera;
        editor.signals.sceneCameraChanged.dispatch( editor.camera );
        //Modified for orthographic top-view end

        editor.selectedView = false;
        editor.camera.matrixAutoUpdate = true;
        document.getElementById( 'zoomIn' ).style.display = 'block';
        document.getElementById( 'zoomOut' ).style.display = 'block';
        editor.type2dView = 3;
        var object = editor.camera;
        editor.execute( new SetPositionCommand( object, new THREE.Vector3( 60, 00, 00 ) ) );
        editor.execute( new SetRotationCommand( object, new THREE.Euler( -3.14159, 1.5708, 3.14159 ) ) );
        editor.camera.matrixAutoUpdate = false;
        showDome();
        document.getElementById( 'floorplan-right' ).style.backgroundColor = "rgb(219, 220, 213)";
        document.getElementById( 'floorplan-left' ).style.backgroundColor = "";
        document.getElementById( 'floorplan-top' ).style.backgroundColor = "";
        document.getElementById( 'floorplan-bottem' ).style.backgroundColor = "";
        document.getElementById( 'floorplan-front' ).style.backgroundColor = "";
        document.getElementById( 'floorplan-back' ).style.backgroundColor = "";

        if( editor.msrmntsShowHideToggle === true ) {
            editor.areaMeasurement.hideAreaMeasurements();
        }

        //Modified to auto scale icons start
        //editor.scaleAllIcons();
        editor.orthographicScale();
        //Modified to auto scale icons end

        //Modified for rescaling the network cables for top views start
        editor.networking.rescaleCablesForOrthographicCamera();
        //Modified for rescaling the network cables for top views end

        editor.isFloorplanViewActive = true;
        //Modified to resize transformControls in floorplan view start
        editor.signals.resizeTransformControls.dispatch( 'floorPlanView' );
        //Modified to resize transformControls in floorplan view end
        editor.signals.restoreBadgesToLastSize.dispatch();

        //Modified for activity logging start
        try {

            //Modified for activity logging start
            var logDatas = {};
            logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Changed view mode to Floorplan right view";
            logger.addLog( logDatas );
            logger.sendLogs( localStorage.getItem( 'U_ID' ) );
            //Modified for activity logging end

        }
        catch( exception ) {

            console.log( "Logging failed!" );
            console.log( exception );

        }
        //Modified for activity logging end

    } );
    options.add( right );



    var bottem = new UI.Row();
    bottem.setClass( 'option' );
    bottem.setId( 'floorplan-bottem' );
    bottem.setTextContent( editor.languageData.Bottom );
    bottem.onClick( function() {

        editor.deselect();

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

        if(editor.liveTwodViewFlag){

            toastr.warning( editor.languageData.StopTheLiveViewModeaAndGoToThe2DViewMode );
            return;   

        }
        //If we are in the area measurement mode, ask for confirmation before switching to another views
        if( editor.isAreaMeasuring === true ) {

            if( confirm( editor.languageData.YouareintheAreaMeasurementswhichissupportedonlyon2DtopviewIfyouswitchtotheotherviewsnowyouwilllooseunsavedmeasurementsDoyouwishtoswitchtotheselectedview ) === false ) {

                return;

            }
            else {

                var areaButton = document.getElementById( 'area-enable-measure-mode-li' );
                areaButton.click();

            }

        }

        if( editor.selectedView ) {

            var postionX = editor.camera.position.x;
            var postionY = editor.camera.position.y;
            var postionZ = editor.camera.position.z;
            var rotationX = editor.camera.rotation.x;
            var rotationY = editor.camera.rotation.y;
            var rotationZ = editor.camera.rotation.z;
            editor.threeDpostion.x = postionX;
            editor.threeDpostion.y = postionY;
            editor.threeDpostion.z = postionZ;
            editor.threeDrotation.x = rotationX;
            editor.threeDrotation.y = rotationY;
            editor.threeDrotation.z = rotationZ;

        }

        //Modified for orthographic top-view start
        if( editor.FloorplanZoomBottem == ''){

            editor.orthoCamera.zoom = 1;
        }
        else{

            editor.orthoCamera.zoom =  editor.FloorplanZoomBottem;
        }
        editor.orthoCamera.updateProjectionMatrix();
        editor.camera = editor.orthoCamera;
        editor.signals.sceneCameraChanged.dispatch( editor.camera );
        //Modified for orthographic top-view end

        editor.selectedView = false;
        editor.camera.matrixAutoUpdate = true;
        var x;
        document.getElementById( 'zoomIn' ).style.display = 'block';
        document.getElementById( 'zoomOut' ).style.display = 'block';
        var object = editor.camera;
        editor.type2dView=4;
        editor.execute( new SetPositionCommand( object, new THREE.Vector3( 00, -60 , 00 ) ) );
        editor.execute( new SetRotationCommand( object, new THREE.Euler( 1.5708, 0 , -1.5708 ) ) );
        editor.camera.matrixAutoUpdate = false;
        showDome();
        document.getElementById( 'floorplan-left' ).style.backgroundColor = "";
        document.getElementById( 'floorplan-top' ).style.backgroundColor = "";
        document.getElementById( 'floorplan-right' ).style.backgroundColor = "";
        document.getElementById( 'floorplan-bottem' ).style.backgroundColor = "rgb(219, 220, 213)";
        document.getElementById( 'floorplan-front' ).style.backgroundColor = "";
        document.getElementById( 'floorplan-back' ).style.backgroundColor = "";

        if( editor.msrmntsShowHideToggle === true ) {
            editor.areaMeasurement.hideAreaMeasurements();
        }

        //Modified to auto scale icons start
        //editor.scaleAllIcons();
        editor.orthographicScale();
        //Modified to auto scale icons end

        //Modified for rescaling the network cables for top views start
        editor.networking.rescaleCablesForOrthographicCamera();
        //Modified for rescaling the network cables for top views end

        editor.isFloorplanViewActive = true;
        //Modified to resize transformControls in floorplan view start
        editor.signals.resizeTransformControls.dispatch( 'floorPlanView' );
        //Modified to resize transformControls in floorplan view end
        editor.signals.restoreBadgesToLastSize.dispatch();

        //Modified for activity logging start
        try {

            //Modified for activity logging start
            var logDatas = {};
            logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Changed view mode to Floorplan bottom view";
            logger.addLog( logDatas );
            logger.sendLogs( localStorage.getItem( 'U_ID' ) );
            //Modified for activity logging end

        }
        catch( exception ) {

            console.log( "Logging failed!" );
            console.log( exception );

        }
        //Modified for activity logging end

    } );
    options.add( bottem );


    var front = new UI.Row();
    front.setClass( 'option' );
    front.setId( 'floorplan-front' );
    front.setTextContent( editor.languageData.Front );
    front.onClick( function() {

        editor.deselect();

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

        if(editor.liveTwodViewFlag){

            toastr.warning( editor.languageData.StopTheLiveViewModeaAndGoToThe2DViewMode );
            return;   

        }
        //If we are in the area measurement mode, ask for confirmation before switching to another views
        if( editor.isAreaMeasuring === true ) {

            if( confirm( editor.languageData.YouareintheAreaMeasurementswhichissupportedonlyon2DtopviewIfyouswitchtotheotherviewsnowyouwilllooseunsavedmeasurementsDoyouwishtoswitchtotheselectedview ) === false ) {

                return;

            }
            else {

                var areaButton = document.getElementById( 'area-enable-measure-mode-li' );
                areaButton.click();

            }

        }

        if( editor.selectedView ) {

            var postionX = editor.camera.position.x;
            var postionY = editor.camera.position.y;
            var postionZ = editor.camera.position.z;
            var rotationX = editor.camera.rotation.x;
            var rotationY = editor.camera.rotation.y;
            var rotationZ = editor.camera.rotation.z;
            editor.threeDpostion.x = postionX;
            editor.threeDpostion.y = postionY;
            editor.threeDpostion.z = postionZ;
            editor.threeDrotation.x = rotationX;
            editor.threeDrotation.y = rotationY;
            editor.threeDrotation.z = rotationZ;

        }

        //Modified for orthographic top-view start

        if( editor.FloorplanZoomFront == ''){

            editor.orthoCamera.zoom = 1;
        }
        else{

            editor.orthoCamera.zoom =  editor.FloorplanZoomFront;
        }

        editor.orthoCamera.updateProjectionMatrix();
        editor.camera = editor.orthoCamera;
        editor.signals.sceneCameraChanged.dispatch( editor.camera );
        //Modified for orthographic top-view end

        editor.selectedView = false;
        editor.camera.matrixAutoUpdate = true;
        var x;
        document.getElementById( 'zoomIn' ).style.display = 'block';
        document.getElementById( 'zoomOut' ).style.display = 'block';
        var object = editor.camera;
        editor.type2dView=5;
        editor.execute( new SetPositionCommand( object, new THREE.Vector3( 00, 00 , 60 ) ) );
        editor.execute( new SetRotationCommand( object, new THREE.Euler( 0, 0 , 0 ) ) );
        editor.camera.matrixAutoUpdate = false;
        showDome();
        document.getElementById( 'floorplan-left' ).style.backgroundColor = "";
        document.getElementById( 'floorplan-top' ).style.backgroundColor = "";
        document.getElementById( 'floorplan-right' ).style.backgroundColor = "";
        document.getElementById( 'floorplan-bottem' ).style.backgroundColor = "";
        document.getElementById( 'floorplan-front' ).style.backgroundColor = "rgb(219, 220, 213)";
        document.getElementById( 'floorplan-back' ).style.backgroundColor = "";

        if( editor.msrmntsShowHideToggle === true ) {
            editor.areaMeasurement.hideAreaMeasurements();
        }

        //Modified to auto scale icons start
        //editor.scaleAllIcons();
        editor.orthographicScale();
        //Modified to auto scale icons end

        //Modified for rescaling the network cables for top views start
        editor.networking.rescaleCablesForOrthographicCamera();
        //Modified for rescaling the network cables for top views end

        editor.isFloorplanViewActive = true;
        //Modified to resize transformControls in floorplan view start
        editor.signals.resizeTransformControls.dispatch( 'floorPlanView' );
        //Modified to resize transformControls in floorplan view end
        editor.signals.restoreBadgesToLastSize.dispatch();

        //Modified for activity logging start
        try {

            //Modified for activity logging start
            var logDatas = {};
            logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Changed view mode to Floorplan front view";
            logger.addLog( logDatas );
            logger.sendLogs( localStorage.getItem( 'U_ID' ) );
            //Modified for activity logging end

        }
        catch( exception ) {

            console.log( "Logging failed!" );
            console.log( exception );

        }
        //Modified for activity logging end

    } );
    options.add( front );


    var back = new UI.Row();
    back.setClass( 'option' );
    back.setId( 'floorplan-back' );
    back.setTextContent( editor.languageData.Back );
    back.onClick( function() {

        editor.deselect();

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
        
        if(editor.liveTwodViewFlag){

            toastr.warning( editor.languageData.StopTheLiveViewModeaAndGoToThe2DViewMode );
            return;   

        }
        //If we are in the area measurement mode, ask for confirmation before switching to another views
        if( editor.isAreaMeasuring === true ) {

            if( confirm( editor.languageData.YouareintheAreaMeasurementswhichissupportedonlyon2DtopviewIfyouswitchtotheotherviewsnowyouwilllooseunsavedmeasurementsDoyouwishtoswitchtotheselectedview ) === false ) {

                return;

            }
            else {

                var areaButton = document.getElementById( 'area-enable-measure-mode-li' );
                areaButton.click();

            }

        }

        if( editor.selectedView ) {

            var postionX = editor.camera.position.x;
            var postionY = editor.camera.position.y;
            var postionZ = editor.camera.position.z;
            var rotationX = editor.camera.rotation.x;
            var rotationY = editor.camera.rotation.y;
            var rotationZ = editor.camera.rotation.z;
            editor.threeDpostion.x = postionX;
            editor.threeDpostion.y = postionY;
            editor.threeDpostion.z = postionZ;
            editor.threeDrotation.x = rotationX;
            editor.threeDrotation.y = rotationY;
            editor.threeDrotation.z = rotationZ;

        }

        //Modified for orthographic top-view start

        if( editor.FloorplanZoomBack == ''){

            editor.orthoCamera.zoom = 1;
        }
        else{

            editor.orthoCamera.zoom =  editor.FloorplanZoomBack;
        }
        
        editor.orthoCamera.updateProjectionMatrix();
        editor.camera = editor.orthoCamera;
        editor.signals.sceneCameraChanged.dispatch( editor.camera );
        //Modified for orthographic top-view end

        editor.selectedView = false;
        editor.camera.matrixAutoUpdate = true;
        var x;
        document.getElementById( 'zoomIn' ).style.display = 'block';
        document.getElementById( 'zoomOut' ).style.display = 'block';
        var object = editor.camera;
        editor.type2dView=6;
        editor.execute( new SetPositionCommand( object, new THREE.Vector3( 00, 00 , -60 ) ) );
        editor.execute( new SetRotationCommand( object, new THREE.Euler( -3.14159, 0 , -3.14159 ) ) );
        editor.camera.matrixAutoUpdate = false;
        showDome();
        document.getElementById( 'floorplan-left' ).style.backgroundColor = "";
        document.getElementById( 'floorplan-top' ).style.backgroundColor = "";
        document.getElementById( 'floorplan-right' ).style.backgroundColor = "";
        document.getElementById( 'floorplan-bottem' ).style.backgroundColor = "";
        document.getElementById( 'floorplan-front' ).style.backgroundColor = "";
        document.getElementById( 'floorplan-back' ).style.backgroundColor = "rgb(219, 220, 213)";

        if( editor.msrmntsShowHideToggle === true ) {
            editor.areaMeasurement.hideAreaMeasurements();
        }

        //Modified to auto scale icons start
        //editor.scaleAllIcons();
        editor.orthographicScale();
        //Modified to auto scale icons end

        //Modified for rescaling the network cables for top views start
        editor.networking.rescaleCablesForOrthographicCamera();
        //Modified for rescaling the network cables for top views end

        editor.isFloorplanViewActive = true;
        //Modified to resize transformControls in floorplan view start
        editor.signals.resizeTransformControls.dispatch( 'floorPlanView' );
        //Modified to resize transformControls in floorplan view end
        editor.signals.restoreBadgesToLastSize.dispatch();

        //Modified for activity logging start
        try {

            //Modified for activity logging start
            var logDatas = {};
            logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Changed view mode to Floorplan back view";
            logger.addLog( logDatas );
            logger.sendLogs( localStorage.getItem( 'U_ID' ) );
            //Modified for activity logging end

        }
        catch( exception ) {

            console.log( "Logging failed!" );
            console.log( exception );

        }
        //Modified for activity logging end

    } );
    options.add( back );


    function showDome() {

        document.getElementById( "threedview" ).classList.remove( "selectMenubar" );
        document.getElementById( "twoDView" ).classList.remove( "selectMenubar" );
        document.getElementById( "floorplan-views" ).className += " selectMenubar";
        
        if(localStorage.getItem("viewmode") != "true"){
            document.getElementById( 'screenshot_2d' ).style.display = "block";
            document.getElementById( 'screenshot_3d' ).style.display = "none";
        }

        document.getElementById("twodRight").style.backgroundColor = "";
        document.getElementById("twodLeft").style.backgroundColor = "";
        document.getElementById("twodTop").style.backgroundColor = "";
        document.getElementById("twodBack").style.backgroundColor = "";
        document.getElementById("twodFront").style.backgroundColor = "";
        document.getElementById("twodBottem").style.backgroundColor = "";

    }

    return container;

};