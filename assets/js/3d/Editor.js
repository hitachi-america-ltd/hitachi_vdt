/**
 * @author mrdoob,Hari,Mavelil
 */
var maxCamCount = 0;
var Editor = function(config , lang ) {

    var scope = this;
    this.api = config.api;
    this.path = config.path;
    this.webroot = config.webroot;
    this.modelPath = config.modelPath;
    this.setLang = localStorage.getItem('Lang');
    this.generateCameraFlag = 0;
    this.createUserFlag = false;
    if(this.setLang == "jp"){
        this.languageData = lang.jp;
    }
    else if(this.setLang == "en"){
        this.languageData = lang.en;
    }
    else{
        this.languageData = lang.en;
    }

    this.DEFAULT_CAMERA = new THREE.PerspectiveCamera(50, 1, 0.1, 10000);

    this.DEFAULT_CAMERA.name = "Live 3D Camera";
    this.DEFAULT_CAMERA.position.set(20, 10, 20);
    this.DEFAULT_CAMERA.lookAt(new THREE.Vector3());

    var Signal = signals.Signal;
    /* for Editorcontrol js object*/
    this.Zoomoperationcontrol;
    /* for Editorcontrol js object End*/
    /*MULTIPLE CAMERA START*/
    this.camera_array = [];
    this.camera_name = "camera name";
    this.last_script = [];
    /*Pivot*/
    this.pivot;
    this.notselected = false;
    /*pivot*/
    /*MULTIPLE CAMERA END*/
    this.hideCenterCube = false;
    /*MODIFIED TO INCLUDE MEASURING TOOL START*/
    this.isMeasuring = false;
    this.isAreaMeasuring = false;
    this.pointsToMeasure = [];
    this.markerA = '';
    this.markerB = '';
    this.pointA = new THREE.Vector3(0, 1, 0);
    this.pointB = new THREE.Vector3();
    this.line = '';
    this.measureGroup = {};
    this.distanceHelper = '';
    this.distanceHelperDiv = {};
    this.start = {};
    this.end = {};
    this.pointSelected = 0;
    /*MODIFIED TO INCLUDE MEASURING TOOL START*/

    /*DROPBOX OPTIONS START*/
    this.dropBoxUrl = "";
    /*DROPBOX OPTIONS END*/

    /*2D view*/
    this.threedzoom = '';
    this.type2dView = '';
    this.selectedView = true;
    this.zoomTop = '';
    this.zoomLeft = '';
    this.zoomBottem = '';
    this.zoomFront = '';
    this.zoomRight = '';
    this.zoomBack = '';
    this.FloorplanZoomTop = '';
    this.FloorplanZoomLeft = '';
    this.FloorplanZoomBottem = '';
    this.FloorplanZoomFront = '';
    this.FloorplanZoomRight = '';
    this.FloorplanZoomBack = '';

    //For simulation play btn in sidebar in interactive viewmode
    this.liveCamera
    this.playBtn = true;

    //Name for screenshot
    this.filenametwod = '';
    this.filenamethreed = '';
    //Name for screenshot
    //Value for 3D view
    this.threeDpostion = {};
    this.threeDrotation = {};

    //Value for 3D view
    /*2D view*/
    /* Report generation*/
    this.preloadModelName = '';
    this.preloadModelName = '';
    /* Report generation*/

    /*MODIFIED TO INCLUDE PROGRESS START*/
    this.progressBar = {};
    /*MODIFIED TO INCLUDE PROGRESS END*/

    /*MODIFIED TO INCLUDE DATA MANAGER START*/
    this.dataManager = new DataManager();
    this.activeProject = {};
    /*MODIFIED TO INCLUDE DATA MANAGER END*/

    /*MODIFIED TO INCLUDE CAMERA LOCATION MODAL START*/
    /* Default hemisphere light */
    this.arraylight = [];
    /* Default hemisphere light */
    /*camerahelper for 3d report*/
    this.cameraHelperArray = [];
    /*camerahelper for 3d repor*/
    /*generate report*/
    this.generatReport = true;
    /*freez oBject*/
    this.freezobject;
    this.freezflag = false;
    this.previousfreezeObject = [];
    /*freez oBject*/
    /*Modefied for object deselected after some time*/
    this.objectSelectedTime;
    this.timeoutID;
    /*Modefied for object deselected after some time End*/
    this.twodTopviewUrl;
    this.twodLeftviewUrl;
    this.twodRightviewUrl;
    this.topTopView = false;
    this.topLeftView = false;
    this.topRightView = false;
    /**
     * camera model and camera Brand in the Datajson
     *
     */
    this.getSelectedCameraModel;
    this.getSelectedCameraBrand;
    this.camspecfull;
    /*end generate report*/
    /*Generate Camera on position*/
    this.cameraGeneratingFlag = false;
    this.cameraGeneratingPosition = [];
    this.cameraGeneratingPositionAndLook = [];
    this.cameraGeneratingLines = [];
    this.setCamera = 0;
    this.setCameraRotation = 1;
    /*Generate Camera on position*/

    /*Reference Point*/
    this.referencePointFlag = false;
    this.currentRefernceCamera = "";
    this.generateReferenceLine = null;
    this.referenceLineArray = [];

    /*Reference Point*/
    /*for cameracount*/
    /*delete Camera */
    this.cameraDeletedNumber = [];
    /*delete Camera */
    this.cameracount = 0;
    this.cameraDeletCount = 0;
    /*generate line in generating camera*/
    this.cameraGenerateLine = "";
    this.targetLocked = true;
    /*Point of intrest Data*/
    this.pointofIntrestNumber = 0;
    this.deletePointofIntrestNumber =[];
    this.savepointofIntrestNumber = [];
    this.pointOfinterestObject = "";
    /*Point of intrest Data*/
    /* Snapshot rename or delete Flag */
    this.previousUserData = "";
    /* Snapshot rename or delete Flag */

    //For UI Additional Controls
    this.uiAdditionalControls;
            
    //Global variable for bg color
    //var bgcolor_save = 0;

	//Lock Camera and Reference Point 
    this.camLock = false;
    this.lockedCameras = [];

    //Set this flag to place junction box
    this.placeJunctionBox = false;
    this.junctionBoxBadges = [];
    this.junctionBoxDeletedNumber = [];

    this.personObjectDeletedNumber = [];
    this.luggageObjectDeletedNumber = [];

    //Add New Sensor
    this.addSensorToScene = false;
    this.smartSensorDeletedNumber = [];


    var camLocModal = {};
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": true,
        "progressBar": false,
        "positionClass": "toast-top-right",
        "preventDuplicates": true,
        "onclick": null,
        "showDuration": "10000",
        "hideDuration": "10000",
        "timeOut": "7000",
        "extendedTimeOut": "5000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "slideDown",
        "hideMethod": "slideUp",
        "closeMethod": "slideUp"
    };
    /*MODIFIED TO INCLUDE CAMERA LOCATION MODAL END*/

    //MODIFIED FOR ADDING SCENE CAMERAS ARRAY START
    this.sceneCameras = [];
    //MODIFIED FOR ADDING SCENE CAMERAS ARRAY START

    //MODIFIED FOR ADDING SCENE SENSORS ARRAY START
    this.sceneSensors = [];
    //MODIFIED FOR ADDING SCENE SENSORS ARRAY START

    /*MODIFIED TO INCLUDE CAMERA SPECIFICATIONS START*/
    this.cameraSpecs = [];
    this.camBrandModelMaping = [];
    /*MODIFIED TO INCLUDE CAMERA SPECIFICATIONS END*/

    //flag to check whether the current scene is loaded from published URL or not
    this.isFromPublishedUrl = false;
    this.publishedUrlID = '';

    //for taking snapshots
    this.takeSnapShot = false;
    this.takeViewportSnapShot = false;
    this.takeViewprtSnpshtWhnCamPaused = false; //Added to take snapshot when digital zoom is active
    
    //MODIFIED FOR MULTIPLE SIMULATION START
    this.theatreMode = false;
    this.snapshotCamHelper;
    //MODIFIED FOR MULTIPLE SIMULATION END

    /*camera for the Live TwoD view*/
    this.twodCamera = this.DEFAULT_CAMERA.clone();
    this.liveTwodViewFlag = false;
    this.twoViewInLive = false;
    this.liveZoombtn = false;
    /*camera for the Live TwoD view*/

    //Rotation controls start
    this.rotationControls;
    //Rotation controls end
    // Postion show model //
    this.currentPosition;
    //Postion show model //
    /* All camera  */
    this.allCameras = new Array()
    /* For  scale Object array  Start */
    this.allPointOfinterest = [];
    this.allReferencePoint = [];
    /* For  scale Object array  End */

    /* Flag for re-positioning reference point */
    this.rePositionRefpoint = false; 
    
    this.currentRefpoint = '';

    this.cameraPosition = '';

    this.allCameraDetails = [];

    this.allSensors = new Array();

    this.selectedDevice = "camera";

    this.contextPosition = '';

    this.excludeNamesFromRaycast = [ "StartMeasurementMarker", "EndMeasurementMarker", "MeasurementSession", "MeasurementConnectionLine", "MeasureValueBadge", "cameraHelperIcon", "CameraFrustum", "DetailsOfPointOfIntrest", "EditorOrigin","AreaMeasureMarker", "AreaMeasureMarker1","AreaMeasureMarker2","AreaMeasureMarker3","AreaMeasureMarker4", "AreaMeasurementSession", "AreaSelectionShade", "AreaSelectionRectangle", "AreaMeasureValueBadge", "AreaMouseCursor", "AreaSelectionLine", "NetworkCablingSession", "NetworkingCable", "NetworkCableLengthBadge", "cablingMouseCursor" , "RefCamLineValueBadge" ];

    this.excludeRegxFromRaycast = [ /^NetworkMarker\d+/g , /^RefPointCameraLOS\d+/g, /^Cam Reference\d+/g ];

    this.sceneObjects = [];
    this.measureGroups = [];
    this.lengthShowHideToggle = false;
    this.enableDisableToggle = false;
    this.areaShowHideToggle = false;
    this.areaEnableDisableToggle = false;
    
    this.msrmntsShowHideToggle = false;

    //Editor reference to measurement and area measurement
    this.lengthMeasurement;
    this.areaMeasurement;
    this.networking;
    
    //Used to hold the length measurement and area measurement badges
    this.lengthBadges = [];
    this.areaBadges = [];
    this.lengthEndMarkers = [];
    this.areaEndMarkers = [];
    this.nwMarkers = [];
    this.nwBadges = [];
    this.refCamBadge = [];
    this.twoDMeasureBadges = [];
    this.twoDMeasureMarkers = [];
    this.nwCableTypes = [ 'CAT5', 'Type 2', 'Type 3' ];
    this.nwCableApplications = [ 'Network', 'CCTV', 'Electricity' ];

    this.isntwrkngStarted = false;
    this.nwShowHideToggle = false;
    this.isAutoRoutingStrtd = false;

    this.isFloorplanViewActive = false;

    this.isCableEditingEnabled = false;

    //Modified for adding 3D Dome camera start
    this.domCameraModel;
    //Modified for adding 3D Dome camera end

    //Modified to add camera model start
    this.threeDCamera;
    this.threeDLiteCamera;
    this.threeDDomeCamera;
    this.threeDCovertCamera;
    this.threeDCovertLiteCamera;
    this.threeDBoxCamera;
    this.threeDPTZCamera;
    this.threeDPTZLiteCamera;
    this.threeDLidarCamera;
    this.threeDLidarIntelCamera;
    this.threeDLidarHLSLFOM1Camera;
    this.threeDLidarHLSLFOM3Camera;
    this.threeDLidarLiteCamera;
    this.threeDBoxLiteCamera;
    this.threeDDomeLiteCamera;

    //Modified to add camera model end

    this.nwStartMarkerIcon = null;
    this.nwEndMarkerIcon = null;
    this.leftArrowIcon = null;
    this.rightArrowIcon = null;
    this.topArrowIcon = null;
    this.bottomArrowIcon = null;
    this.bottomRightCornerArrowIcon = null;
    this.bottomLeftCornerArrowIcon = null;
    this.topRightCornerArrowIcon = null;
    this.topLeftCornerArrowIcon = null;
    this.junctionBoxIcon = null;
    this.routingWithHeight = [];
    this.ceilingHeightin3DUnits = [];
    /*  Hide Camera*/
    this.hideAllCamera = true;

    /* zoom limit upto which cameras, badges needed to be scaled */
    this.SCALE_LIMIT = 30;

    this.currentScaleFactor = new THREE.Vector3();

    this.zeroVector = new THREE.Vector3(0,0,0);

    this.gridOriginalDimension = 60;
    this.gridSize = 60;
    this.gridDivision = 196;
    this.gridUnit = 'feet';
    this.isGridShowing = true;
    this.gridScale = 1;

    //Modified to include freezed objects start
    //this.freezedObjects = [];
    //Modified to include freezed objects end

    //Used for 2D Measurements
    this.isTwoDMeasurementEnabled = false;
    this.isTwoDMeasuring = false;

    //used to check whether Rotation Controls is forcefully closed during Theatre Mode
    this.isRotationControlsClosed = false;

    this.twoDDrawingsShowHideToggle = false;

    // Frustum Hide/Show Flag
    this.hideAllFrustum = false;

    //Default lidar tilt value
    const LIDAR_TILT_VALUE = -45;

    this.signals = {

        // script

        editScript: new Signal(),

        // player

        startPlayer: new Signal(),
        stopPlayer: new Signal(),

        // vr

        enterVR: new Signal(),

        enteredVR: new Signal(),
        exitedVR: new Signal(),

        // actions

        showModal: new Signal(),

        // notifications

        editorCleared: new Signal(),

        savingStarted: new Signal(),
        savingFinished: new Signal(),

        themeChanged: new Signal(),

        transformModeChanged: new Signal(),
        snapChanged: new Signal(),
        spaceChanged: new Signal(),
        rendererChanged: new Signal(),

        sceneBackgroundChanged: new Signal(),
        sceneFogChanged: new Signal(),
        sceneGraphChanged: new Signal(),

        cameraChanged: new Signal(),

        geometryChanged: new Signal(),

        objectSelected: new Signal(),
        objectFocused: new Signal(),

        lockedObjectSelected: new Signal(),
        //objectLightAdded: new Signal(),
        objectAdded: new Signal(),
        objectChanged: new Signal(),
        objectRemoved: new Signal(),

        helperAdded: new Signal(),
        helperRemoved: new Signal(),

        materialChanged: new Signal(),

        scriptAdded: new Signal(),
        scriptChanged: new Signal(),
        scriptRemoved: new Signal(),

        windowResize: new Signal(),

        showGridChanged: new Signal(),
        refreshSidebarObject3D: new Signal(),
        historyChanged: new Signal(),

        //signal for add camera start//
        cameraAdded: new Signal(),
        referranceSignal: new Signal(),
        //signal for add camera End//

        //signal for Add new Camera Spec  Start
        newCameraSpec : new Signal(),
        //signal for Add new Camera Spec  End
        
        //signal for sending snapshot data start
        cameraSnapshotTaken: new Signal(),
        viewportSnapshotTaken: new Signal(),
        vwprtSnpshtTakenWhenCamPaused: new Signal(),//Added to take snapshot when digital zoom is active
        //signal for sending snapshot data end

        //signals for the multiple simulations start
        simulationResized: new Signal(),
        simulationViewPaused: new Signal(),
        simulationViewStopped: new Signal(),
        simulationSnapshotTaken: new Signal(),
        simulationSnapshotNeeded: new Signal(),
        simulationViewResumed: new Signal(),
        simulationScreenClicked: new Signal(),
        toolbarHidden: new Signal(),
        updateSimulationControls: new Signal(),
        simulationScreenContextmenuRequested: new Signal(),
        //signals for the multiple simulations end

        //signals for Panoramic view  start
        panoramicViewRefreshed : new Signal(),
        hideEverythingForPanorama : new Signal(),
        showAfterPanorama : new Signal(),
        //signals for Panoramic view  end

        /*signals for camera spec updated */
        specUpdateComplete : new Signal(),
        /*signals for camera spec updated End */ 

        /*signals for camera spec updated */
        specUpdateCompleteSensor : new Signal(),
        /*signals for camera spec updated End */ 

        /*signals for Reference Point needed for camera Start*/
        neededReferancePoint : new Signal(),
        /*signals for Reference Point needed for camera End*/

        //Signals for indicating that the saved project data has been loaded start
        projectDataLoaded : new Signal(),
        //Signals for indicating that the saved project data has been loaded end

        //Signal for indicating that a new project has been created start
        newProjectCreated : new Signal(),
        //Signal for indicating that a new project has been created end

        //Signals for measurement start
        newMeasurementAdded : new Signal(),
        newAreaMeasurementAdded : new Signal(),
        measurementConfigurationChanged : new Signal(),
        measurementEdited : new Signal(),
        networkDataEdited : new Signal(),
        areaMeasurementEdited : new Signal(),
        measurementEditingCompleted : new Signal(),
        showAllMeasurements : new Signal(),
        hideAllMeasurements : new Signal(),
        //Signals for measurement end

        //Modified for activity logging start
        objectAttributeChanged : new Signal(),
        //Modified for activity logging end

        /* Show and Hide camera */
        cameraShowHideSignal : new Signal(),
        /* Show and Hide camera  */
        
        //Modified for orthographic top-view start
        sceneCameraChanged : new Signal(),
        //Modified for orthographic top-view end

        //Modified for calling when area is manually changed in sidebar
        arealengthManualPositionChange : new Signal(),

        //Modified for NetworkCableDesigner start
        newNetworkCableAdded : new Signal(),
        nwMarkerSidebarPositionChanged: new Signal(),
        //Modified for NetworkCableDesigner end

        //Modified to update reference-camera details in table
        refCamAttributesChanged : new Signal(),

        //Modified to resize the zoomed image w.r.t the enlarging the preview div
        pauseScreenResized : new Signal(),

        //Modified to choose an option to add Refernce Point
        addReferencePoint : new Signal(), 

        //Modified to draw Refernce Point Line  
        addReferencePointLine : new Signal(),

        //Modified to re-configure all line-of-sight measurements when baseUnit and targetUnits are changed
        reConfigurePreviousMeasurements: new Signal(),

        //Modified to restore badges to the size made during Floorplan view
        restoreBadgesToLastSize: new Signal(),

        //Modified to update area measurement when Congiguration unit is changed
        updateAreaMeasurement: new Signal(),

        //Modified to edit length measurement by by double-clicking on Length Measurement table
        showLengthMsrCntxtMenu: new Signal(),
        
        //Modified to create a new grid with user specified size, division and unit start
        gridParametersChanged: new Signal(),
        gridUnitChanged: new Signal(),
        //Modified to create a new grid with user specified size, division and unit end

        //Modified to resize transform controls
        resizeTransformControls: new Signal(),

        //Modified to update Reference point line-of-sight
        updateReferenceLineOfSight: new Signal(),

        //Modified to update Camera line-of-sight
        updateCameraLineOfSight: new Signal(),

        //Modified to change height of measured line
        changeLengthMeasurementHeight: new Signal(),

        //Modified to update camera line of sight and reference point
        updateCameraAndRefPoint: new Signal(),
        updateReferencePoint: new Signal(),

        //Modified to clone a selected camera
        cloneCamera: new Signal(),

        //Modified to re-position Reference point
        processRePositioningRefPt: new Signal(), 

        editTwoDDrawings: new Signal(),
        changeTwoDValues: new Signal(),
        newTwoDLineAdded: new Signal(),

        // Change Pan, Tilt and Roll values in Additional Controls
        cameraControlsChanged: new Signal()

    };

    this.config = new Config('threejs-editor');
    this.history = new History(this);
    this.storage = new Storage();
    this.loader = new Loader(this);

    this.camera = this.DEFAULT_CAMERA.clone();

    //Modified for orthographic top-view start
    var frustumSize = 50;
    var aspect = window.innerWidth / window.innerHeight;
    var orthoCamera = new THREE.OrthographicCamera( frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 0.1, 10000 );
    this.orthoCamera = orthoCamera;
    //Modified for orthographic top-view end

     //Modified for report-orthographic start
     var aspect = window.innerWidth / window.innerHeight;
     var orthoCameraForReport = new THREE.OrthographicCamera( frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 0.1, 10000 );
     this.reportOrthoCamera = orthoCameraForReport;
     //Modified for report-orthographic end

    this.scene = new THREE.Scene();
    this.scene.name = 'Scene';
    this.scene.background = new THREE.Color(0xaaaaaa);

    this.sceneHelpers = new THREE.Scene();

    this.object = {};
    this.geometries = {};
    this.materials = {};
    this.textures = {};
    this.scripts = {};

    this.selected = null;
    this.helpers = {};

    //Added to update the sceneCameras array during object addition start
    this.signals.objectAdded.add( function( object ){

        setTimeout(function(){ editor.signals.sceneGraphChanged.dispatch(); });
        
        var currentValue = scope.computeSceneCoordinates();
        if( currentValue > 30 ){

            scope.SCALE_LIMIT = currentValue;

        } else{

            scope.SCALE_LIMIT = 30;

        }
        /*
        //Modified to freeze the object if the freeze option is currently active start
        if( editor.freezflag === true && !( object instanceof THREE.PerspectiveCamera ) || ( object instanceof THREE.Sprite && object.camerauuid ) ){

            editor.freezedObjects.push( object );
            object.matrixAutoUpdate = false;

        }*/
        //Modified to freeze the object if the freeze option is currently active end 
        if( object instanceof THREE.PerspectiveCamera ){
            object.visible = true;
            scope.sceneCameras.push( object );
            scope.camera_array.push( object );

            //Modified for activity logging start
            try{

                //Modified for activity logging start
                var logDatas = {};
                logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Added PerspectiveCamera : " + object.name + " : " + object.badgeText + " to the scene using commands";
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

            //Modified for activity logging start
            try{

                //Modified for activity logging start
                var logDatas = {};
                logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Added object : " + object.name + " to the scene using commands";
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
    //Added to update the sceneCameras array during object addition start

    //Added to update the sceneCameras array during object removal start
    this.signals.objectRemoved.add( function( object ){

        editor.scene.userData.cameraDeletedNumber = {deletedCamArray:editor.cameraDeletedNumber};
        

        //scope.SCALE_LIMIT = scope.computeSceneCoordinates();
        var currentValue = scope.computeSceneCoordinates();
        if( currentValue > 30 ){

            scope.SCALE_LIMIT = currentValue;

        } else{

            scope.SCALE_LIMIT = 30;

        }
        if( object instanceof THREE.PerspectiveCamera ){

            scope.sceneCameras.splice( scope.sceneCameras.indexOf( object ), 1 );
            scope.camera_array.splice( scope.sceneCameras.indexOf( object ), 1 );

            //Modified for activity logging start
            try{

                //Modified for activity logging start
                var logDatas = {};
                logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Removed PerspectiveCamera : " + object.name;
                logger.addLog( logDatas );
                logger.sendLogs( localStorage.getItem( 'U_ID' ) );
                //Modified for activity logging end

            }
            catch( exception ){

                console.log( "Logging failed!" );
                console.log( exception );

            }

            object.traverse( function( child ){

                if( child instanceof THREE.Group && child.userData && child.userData.modelType == 'not-a-base-model' ){
                    
                    if( child.userData.type === "person" ){

                        editor.personObjectDeletedNumber.push( parseInt( child.name.substring( 6 ) ));  
                        editor.personObjectDeletedNumber.sort( function(a, b){return a-b} );
                        editor.scene.userData.personDeletedNumber = { deletedPersonArray : editor.personObjectDeletedNumber };    
        
                    } else if( child.userData.type === "medium-luggage" || child.userData.type === "large-luggage" ){
        
                        editor.luggageObjectDeletedNumber.push( parseInt( child.name.substring( 7 ) ));  
                        editor.luggageObjectDeletedNumber.sort( function(a, b){return a-b} );
                        editor.scene.userData.luggageDeletedNumber = { deletedLuggageArray : editor.luggageObjectDeletedNumber };
        
                    }
                }
                
            } )
            //Modified for activity logging end

        } else if( object instanceof THREE.Group && object.userData && object.userData.modelType == 'not-a-base-model' ){
         
            if( object.userData.type === "person" ){

                editor.personObjectDeletedNumber.push( parseInt( object.name.substring( 6 ) ));  
                editor.personObjectDeletedNumber.sort( function(a, b){return a-b} );
                editor.scene.userData.personDeletedNumber = { deletedPersonArray : editor.personObjectDeletedNumber };    

            } else if( object.userData.type === "medium-luggage" || object.userData.type === "large-luggage" ){

                editor.luggageObjectDeletedNumber.push( parseInt( object.name.substring( 7 ) ));  
                editor.luggageObjectDeletedNumber.sort( function(a, b){return a-b} );
                editor.scene.userData.luggageDeletedNumber = { deletedLuggageArray : editor.luggageObjectDeletedNumber };

            }
           
        } else if( object instanceof THREE.Group && object.userData && object.userData.sensorData ){

            editor.smartSensorDeletedNumber.push( parseInt( object.userData.sensorData.badgeText ) );
            editor.smartSensorDeletedNumber.sort( function(a, b){return a-b} );
            editor.scene.userData.sensorDeletedNumber = { deletedSensorArray : editor.smartSensorDeletedNumber};

        }
        else{

            //Modified for activity logging start
            try{

                //Modified for activity logging start
                var logDatas = {};
                logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Removed object : " + object.name;
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
    //Added to update the sceneCameras array during object removal start

    //Modified to add the listener for objectAttributeChanged start
    //objectProperties structure : { "object" : this.object, "attribute" : "position", "oldValue" : this.oldScale, "newValue" : this.newScale }
    this.signals.objectAttributeChanged.add( function( objectProperties ){
        
        //Modified for activity logging start
        try{

            //Modified for activity logging start
            var logDatas = {};
            logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Attribute \"" + objectProperties.attribute + "\" changed for object : " + objectProperties.object.name + " . Old value : " + JSON.stringify( objectProperties.oldValue ) + ", New Value : " + JSON.stringify( objectProperties.newValue );
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
    //Modified to add the listener for objectAttributeChanged start    

    //Modified to add the DOME camera model to camera's after loading the project, start
    this.signals.projectDataLoaded.add( function(){

        if( editor.scene.userData.personDeletedNumber != undefined ){
            editor.personObjectDeletedNumber = editor.scene.userData.personDeletedNumber.deletedPersonArray;
        }

        if( editor.scene.userData.sensorDeletedNumber != undefined ){
            editor.smartSensorDeletedNumber = editor.scene.userData.sensorDeletedNumber.deletedSensorArray;
        }

        if( editor.scene.userData.luggageDeletedNumber != undefined ){
            editor.luggageObjectDeletedNumber = editor.scene.userData.luggageDeletedNumber.deletedLuggageArray;
        }

        if( editor.scene.userData.mobileWindow ){
            
            var userDataKeys = Object.keys( editor.scene.userData.mobileWindow );
            userDataKeys.forEach( function( child ){
                editor.ceilingHeightin3DUnits[child] = editor.scene.userData.mobileWindow[child] 
            } );
           // editor.ceilingHeightin3DUnits = editor.scene.userData.mobileWindow;
        }
        
        if( !editor.domCameraModel ){

            var texLoader = new THREE.TextureLoader();
            var wwObjLoader2 = new THREE.OBJLoader2.WWOBJLoader2();
            wwObjLoader2.setCrossOrigin( 'anonymous' );
            var Validator = THREE.OBJLoader2.prototype._getValidator();
            var prepData, objectGroup;

            texLoader.load(

                'assets/editorresources/DomeCamera/DomeCamera.png',
                
                function( texture ) {

                    var reportProgress = function( content ) {

                        /*var response = content;
                        var splittedResp = response.split(":");
                        var respMessage = splittedResp[0];
                        if (respMessage.indexOf("Download of") !== -1) {
            
                            var actualProgress = Number((splittedResp[splittedResp.length - 1].trim()).slice(0, -1));
                            var evalProgress = (actualProgress * 0.8) / 100;
                            editor.progressBar.updateProgress(editor.languageData.DownloadingFiles, evalProgress);
                            //editor.progressBar.show();
            
                        }*/
                    };
            
                    var materialsLoaded = function( materials ) {
            
                        var count = Validator.isValid(materials) ? materials.length : 0;
                        //console.log('Loaded #' + count + ' materials.');
                        //console.log( materials );
            
                    };
            
                    var meshLoaded = function(name, bufferGeometry, material) {
            
                        //console.log('Loaded mesh: ' + name + ' Material name: ' + material.name);
            
                    };
            
                    var errorLoading = function() {
            
                        console.log("Error while loading");
                        editor.progressBar.hide();
            
                    };
            
                    var completedLoading = function(first, second, third) {
            
                        try{

                            var count = Math.abs((1.0 - 0.8) / 0.01);
                            var progressVal = 0.80;

                            objectGroup.scale.set( 0.5, 0.5, 0.5 );
                            objectGroup.traverse( function( subChild ){

                                if(  subChild.name === "CamBody" && subChild.material ){

                                    subChild.material.map = texture;
                                    subChild.material.needsUpdate = true;

                                }

                            } );

                            //objectGroup.rotation.set( 90.0 * ( Math.PI / 180 ), 0, 0 );
                            editor.domCameraModel = objectGroup;

                            scope.scene.traverse( function( sceneItem ){

                                if( sceneItem instanceof THREE.PerspectiveCamera && sceneItem.camCategory === "Dome3D" ){
                    
                                    if( editor.domCameraModel ){
                    
                                        console.log( "Dome3D found" );
                                        sceneItem.getObjectByName( "cameraHelperIcon" ).visible = false;
                                        var camIconModel = editor.domCameraModel.clone();
                                        editor.execute( new AddObjectCommand( camIconModel ) );
                                        editor.execute( new MoveObjectCommand( camIconModel, sceneItem ) );
                                        editor.deselect();
                                        //sceneItem.add( camIconModel );
                                        //sceneItem.rotation.set( -90.0 * ( Math.PI / 180 ), 0, 0 );
                                        camIconModel.rotation.set( 90.0 * ( Math.PI / 180 ), 0, 0 );
                                        //camIconModel.position.copy( sceneItem.position.clone() );
                                        console.log( "Applied the model for camera" );
                            
                                    }
                    
                                }
                    
                            } );
                            editor.signals.sceneGraphChanged.dispatch();

                        }
                        catch( exception ){

                            console.log( exception );
                            editor.progressBar.hide();

                        }
            
                    };

                    wwObjLoader2.registerCallbackProgress(reportProgress);
                    wwObjLoader2.registerCallbackCompletedLoading(completedLoading);
                    wwObjLoader2.registerCallbackMaterialsLoaded(materialsLoaded);
                    wwObjLoader2.registerCallbackMeshLoaded(meshLoaded);
                    wwObjLoader2.registerCallbackErrorWhileLoading(errorLoading);
                    prepData = new THREE.OBJLoader2.WWOBJLoader2.PrepDataFile( '3DDomeCamera', 'assets/editorresources/DomeCamera/', 'DomeCamera.obj' );
                    objectGroup = new THREE.Group();
                    objectGroup.name = '3DDomeCamera';
                    prepData.setSceneGraphBaseNode( objectGroup );
                    prepData.setStreamMeshes( true );
                    wwObjLoader2.setDebug( false );
                    wwObjLoader2.prepareRun( prepData );
                    wwObjLoader2.run();
                    
                },

                undefined,

                function ( err ) {
                    
                    console.error( 'An error happened.' );
                    console.error( err );
                    editor.progressBar.hide();
                    
                }
                
            );

        }
        else{

            scope.scene.traverse( function( sceneItem ){

                if( sceneItem instanceof THREE.PerspectiveCamera && sceneItem.camCategory === "Dome3D" ){

                    sceneItem.getObjectByName( "cameraHelperIcon" ).visible = false;
                    var camIconModel = editor.domCameraModel.clone();
                    editor.execute( new AddObjectCommand( camIconModel ) );
                    editor.execute( new MoveObjectCommand( camIconModel, sceneItem ) );
                    editor.deselect();
                    //sceneItem.add( camIconModel );
                    //sceneItem.rotation.set( -90.0 * ( Math.PI / 180 ), 0, 0 );
                    camIconModel.rotation.set( 90.0 * ( Math.PI / 180 ), 0, 0 );
                    //camIconModel.position.copy( sceneItem.position.clone() );
    
                }
    
            } );
            editor.signals.sceneGraphChanged.dispatch();

        }

    } );
    //Modified to add the DOME camera model to camera's after loading the project, end

    //Added for Panorama Start
    this.signals.hideEverythingForPanorama.add( function( camera ){

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

            editor.scene.traverse( function( child ){
                if( (child instanceof THREE.PerspectiveCamera ) || (/^(Point Of Interest )[0-9]+/g).test(child.name) == true  || (/^(Cam Reference )[0-9]+/g).test(child.name) == true ){
                    child.visible = false;
                }
            } );
            
        
       // editor.signals.sceneGraphChanged.dispatch();
    } );

    this.signals.showAfterPanorama.add( function(){
        
            editor.scene.traverse( function( child ){
                if( (child instanceof THREE.PerspectiveCamera) || (/^(Point Of Interest )[0-9]+/g).test(child.name) == true || (/^(Cam Reference )[0-9]+/g).test(child.name) == true ){
                    child.visible = true;
                }
            } );
            
        
        editor.signals.sceneGraphChanged.dispatch();
    } );
    //Added for Panorama end

    this.preloadIcons();
    this.loadThreeDCamera();
    this.loadThreeDLiteCamera();
    this.loadThreeDCovertCamera();
    this.loadThreeDCovertLiteCamera();
    this.loadThreeDDomeCamera();
    this.loadThreeDDomeLiteCamera();
    this.loadThreeDBoxCamera();
    this.loadThreeDBoxLiteCamera();
    this.loadThreeDPTZCamera();
    this.loadThreeDPTZLiteCamera();
    this.loadThreeDLidarCamera();
    this.loadThreeDLidarIntelCamera();
    this.loadThreeDLidarHLSLFOM3Camera();
    this.loadThreeDLidarHLSLFOM1Camera();
    this.loadThreeDLidarLiteCamera();

};

Editor.prototype = {

    setTheme: function(value) {

        document.getElementById('theme').href = value;

        this.signals.themeChanged.dispatch(value);

    },
    set3Dview: function() {

        this.selectedView = true;
        this.camera.matrixAutoUpdate = true;
        document.getElementById('screenshot_2d').style.display = "none";
        document.getElementById('topView').style.display = "none";
        document.getElementById('leftView').style.display = "none";
        document.getElementById('rightView').style.display = "none";
        //document.getElementById('playcamera').style.display = "block";
        //document.getElementById('publish').style.display = "block";
        document.getElementById('add_editor').style.display = "block";
        //document.getElementById('zoomIn').style.display='none';
        //document.getElementById('zoomOut').style.display='none';
        document.getElementById('rotation').style.display = 'block';
        document.getElementById('toolbar_rotate').disabled = false;
        if (this.preloadModelName != '') {
            document.getElementById('generate_report').style.display = "block";
        }

    },

    float32ToVerticesArray: function( positionArray ) {
        var len = positionArray.length;
        var totalVertices = len/3;
        var vertexArray = [];
        for(var i = 1; i <= totalVertices; i++){
            vertexArray.push(new THREE.Vector3( positionArray[((i*3)-3)],positionArray[((i*3)-2)],positionArray[((i*3)-1)] ));
        }
        return vertexArray;
    },
        
    set2Dview: function() {

        document.getElementById('generate_report').style.display = "none";
        document.getElementById('screenshot_2d').style.display = "block";
        document.getElementById('topView').style.display = "block";
        document.getElementById('leftView').style.display = "block";
        document.getElementById('rightView').style.display = "block";
        //document.getElementById('playcamera').style.display = "none";
        //document.getElementById('publish').style.display = "none";
        document.getElementById('add_editor').style.display = "block";
        //document.getElementById('zoomIn').style.display='block';
        //document.getElementById('zoomOut').style.display='block';
        document.getElementById('rotation').style.display = 'none';
        document.getElementById('toolbar_rotate').disabled = true;
        //var cameraplay = document.getElementById('playcamera');
        //var cameravalue = cameraplay.innerHTML;
        //if (cameravalue == 'Stop') {
            //cameraplay.click();
        //}
    },



    setScene: function(scene) {

        this.scene.uuid = scene.uuid;
        this.scene.name = scene.name;

        if (scene.background !== null) this.scene.background = scene.background.clone();
        if (scene.fog !== null) this.scene.fog = scene.fog.clone();

        this.scene.userData = JSON.parse(JSON.stringify(scene.userData));

        // avoid render per object

        this.signals.sceneGraphChanged.active = false;

        while (scene.children.length > 0) {

            this.addObject(scene.children[0]);

        }

        this.signals.sceneGraphChanged.active = true;
        this.signals.sceneGraphChanged.dispatch();

    },

    //

    addObject: function(object) {

        var scope = this;

        /*MODIFIED TO UPDATE CAMERA COUNT START*/
        if (object instanceof THREE.Camera) {

            if (object.badgeText != undefined) {

                if (Number(object.badgeText) > maxCamCount) {

                    maxCamCount = Number(object.badgeText);
                    this.cameracount = maxCamCount;

                }

            } 
            else {
                
                if (this.cameraDeletedNumber.length != 0) {
                    var deletedBadgeNumber = this.cameraDeletedNumber.pop();
                    object.badgeText = deletedBadgeNumber;
                    this.cameraDeletCount = deletedBadgeNumber;

                } else {

                    var count = this.cameracount + 1;
                    if(this.cameraDeletCount > this.cameracount){

                        this.cameraDeletCount ++;
                        object.badgeText = this.cameraDeletCount;
                        this.cameracount  = this.cameraDeletCount;
                    }
                    else{


                        object.badgeText = count;
                        this.cameracount++
                    }
                   

                }

            }

        }
        /*MODIFIED TO UPDATE CAMERA COUNT END*/
        object.traverse(function(child) {

            if (child.geometry !== undefined) scope.addGeometry(child.geometry);
            if (child.material !== undefined) scope.addMaterial(child.material);

            scope.addHelper(child);

        });

        this.scene.add(object);
        this.signals.objectAdded.dispatch(object);
        this.signals.sceneGraphChanged.dispatch();

    },

    moveObject: function(object, parent, before) {

        if (parent === undefined) {

            parent = this.scene;

        }

        parent.add(object);

        // sort children array

        if (before !== undefined) {

            var index = parent.children.indexOf(before);
            parent.children.splice(index, 0, object);
            parent.children.pop();

        }

        this.signals.sceneGraphChanged.dispatch();

    },

    nameObject: function(object, name) {

        object.name = name;
        this.signals.sceneGraphChanged.dispatch();

    },

    removeObject: function(object) {

        if (object.parent === null) return; // avoid deleting the camera or scene

        var scope = this;

        object.traverse(function(child) {

            scope.removeHelper(child);

        });

        object.parent.remove(object);

        this.signals.objectRemoved.dispatch(object);
        this.signals.sceneGraphChanged.dispatch();

    },

    addGeometry: function(geometry) {

        this.geometries[geometry.uuid] = geometry;

    },

    setGeometryName: function(geometry, name) {

        geometry.name = name;
        this.signals.sceneGraphChanged.dispatch();

    },

    addMaterial: function(material) {

        this.materials[material.uuid] = material;

    },

    setMaterialName: function(material, name) {

        material.name = name;
        this.signals.sceneGraphChanged.dispatch();

    },

    addTexture: function(texture) {

        this.textures[texture.uuid] = texture;

    },

    //

    addHelper: function() {

        var geometry = new THREE.SphereBufferGeometry(2, 4, 2);
        var material = new THREE.MeshBasicMaterial({ color: 0xff0000, visible: false });

        return function(object) {

            var helper;

            if (object instanceof THREE.Camera) {

                //Randomly pick a camera helper color if there are no helper colors specified.
                if (object.helperColor == undefined) {

                    object.helperColor = this.randomColor();

                }

                //Attach camera iconBadge and frustum only if there are no children for camera.
                if (object.children.length == 0) {

                    var mid = new THREE.Vector3(object.position.x, object.position.y, object.position.z);

                    var iconUrl = '';
                    if (object.iconUrl != undefined) {

                        iconUrl = object.iconUrl;

                    } else {

                        iconUrl = 'assets/img/Cam_DICB_Tilted.png';

                    }
                    object.iconUrl = iconUrl;

                    var badgeTextValue;

                    if (object.badgeText == undefined) {

                        //badgeTextValue = Number(this.cameracount++).toString();
                        badgeTextValue = Number(this.cameracount).toString();

                    } else {

                        badgeTextValue = object.badgeText;

                    }
                    /**/
                    if( object.camCategory == "Dome" || object.camCategory == "Bullet"|| object.camCategory == "Covert" || object.camCategory == "Box" || object.camCategory == "PTZ" || object.camCategory == "LiDAR"){
                        var sensorCategory = ""
                        if( object.sensorCategory != undefined )
                            sensorCategory = object.sensorCategory;
                        var threeDModeWithlbadge = this.modelWithBadge( badgeTextValue, object.helperColor, object.camCategory, object.isCameraLite, sensorCategory );
                        editor.execute(new AddObjectCommand(threeDModeWithlbadge));
                        
                        object.add(threeDModeWithlbadge);
                        
                    }
                    else{
                        var iconBadge = this.iconWithBadge(iconUrl, badgeTextValue, object.helperColor);
                        if( object.camCategory != undefined && (object.camCategory == "Dome" || object.camCategory == "PTZ" || object.camCategory == "Fisheye") ){
                            editor.execute( new SetRotationCommand( iconBadge, new THREE.Euler(  0, -1.5708, -1.5708 ) ) );
                        }
                        else{
                            editor.execute( new SetRotationCommand( iconBadge, new THREE.Euler(  0, -1.5708, 0 ) ) );
                        }
                        object.badgeText = badgeTextValue;
                        iconBadge.name = "cameraHelperIcon";
                        editor.execute(new AddObjectCommand(iconBadge));
                        object.add(iconBadge);
                    }
                    /*if(  object.camCategory && object.camCategory === "LiDAR" ){
                        
                        object.name = "Camera" + object.badgeText + " LiDAR";
                    
                    }
                    else
                        object.name = "Camera" + object.badgeText;*/

                    if( !object.name || object.name === "" ){

                        if(  object.camCategory && object.camCategory === "LiDAR" ){
                        
                            object.name = "Camera" + object.badgeText + " LiDAR";
                        
                        }
                        else
                            object.name = "Camera" + object.badgeText;
                    
                    }

                    if( object.camCategory != undefined && object.camCategory == "Panorama" ){
        
                        var geometryCylinder = new THREE.CylinderGeometry( object.far, object.far, 2, 18 );
                        var materialCylinder = new THREE.MeshBasicMaterial( {color: object.helperColor} );
                        materialCylinder.transparent = true;
                        materialCylinder.opacity = 0.35;
                        materialCylinder.depthWrite = false;
                        var cylinder = new THREE.Mesh( geometryCylinder, materialCylinder );
                        cylinder.name = "PanoramaFrustum";
                        object.add( cylinder );
                        editor.signals.sceneGraphChanged.dispatch();
                    }
                    else{
                        var camFrustum = new FrustumGeometry(2, 2, 2);
                        var mesh = new THREE.Mesh(camFrustum, new THREE.MeshStandardMaterial({ color: object.helperColor, side: THREE.FrontSide, opacity: 0.3, transparent: true, vertexColors: THREE.FaceColors }));
                        mesh.name = "CameraFrustum";
                        object.add(mesh);
                        camFrustum.updateFromCamera(object);
                        editor.signals.sceneGraphChanged.dispatch();
                        helper = new THREE.CameraHelper(object, new THREE.Color(object.helperColor));
                    }
                    

                }

                

            } else if (object instanceof THREE.PointLight) {

                helper = new THREE.PointLightHelper(object, 1);

            } else if (object instanceof THREE.DirectionalLight) {

                helper = new THREE.DirectionalLightHelper(object, 1);

            } else if (object instanceof THREE.SpotLight) {

                helper = new THREE.SpotLightHelper(object, 1);

            } else if (object instanceof THREE.HemisphereLight) {

                helper = new THREE.HemisphereLightHelper(object, 1);

            } else if (object instanceof THREE.SkinnedMesh) {

                helper = new THREE.SkeletonHelper(object);

            } else {

                // no helper for this object type
                return;

            }
            if( object.camCategory != "Panorama" ){
            var picker = new THREE.Mesh(geometry, material);
            picker.name = 'picker';
            picker.userData.object = object;
            helper.add(picker);

            this.sceneHelpers.add(helper);
            this.helpers[object.id] = helper;

            this.signals.helperAdded.dispatch(helper);
            }

        };

    }(),

    removeHelper: function(object) {

        if (this.helpers[object.id] !== undefined) {

            var helper = this.helpers[object.id];
            helper.parent.remove(helper);

            delete this.helpers[object.id];

            this.signals.helperRemoved.dispatch(helper);

        }

    },

    //

    addScript: function(object, script) {

        if (this.scripts[object.uuid] === undefined) {

            this.scripts[object.uuid] = [];

        }

        this.scripts[object.uuid].push(script);

        this.signals.scriptAdded.dispatch(script);

    },

    removeScript: function(object, script) {

        if (this.scripts[object.uuid] === undefined) return;

        var index = this.scripts[object.uuid].indexOf(script);

        if (index !== -1) {

            this.scripts[object.uuid].splice(index, 1);

        }

        this.signals.scriptRemoved.dispatch(script);

    },

    getObjectMaterial: function(object, slot) {

        var material = object.material;

        if (Array.isArray(material)) {

            material = material[slot];

        }

        return material;

    },

    setObjectMaterial: function(object, slot, newMaterial) {

        if (Array.isArray(object.material)) {

            object.material[slot] = newMaterial;

        } else {

            object.material = newMaterial;

        }

    },
    deselect: function() {

        this.select(null);

    },

    //

    select: function(object) {
        var that = this;
        var flag = false;

        if (this.pivot === object) {
         return
        }
        var uuid = null;

        if (object !== null) {

            uuid = object.uuid;
            if(object.name == 'GenerateCameraLine' ){
                return
            }

        }

        if(object == null ) {
            this.selected = object;
            this.config.setKey('selected', uuid);
            this.signals.objectSelected.dispatch(object);
            return;
        }
        if (this.selected === object) return;
        if (this.freezflag == true) {
            
            
        
            this.previousfreezeObject.forEach(function(currentObject) {
                if (currentObject.uuid == object.uuid) {

                    that.deselect();
                    flag = true;
                    // return;
                }
            })

        }
        if (flag) {
            return;
        }
        this.selected = object;
        this.config.setKey('selected', uuid);
        this.signals.objectSelected.dispatch(object);
        if( this.selected && this.selected.userData && this.selected.userData.modelType === "not-a-base-model" )
            this.signals.lockedObjectSelected.dispatch( object );

    },

    selectById: function(id) {

        if (id === this.camera.id) {

            this.select(this.camera);
            return;

        }

        this.select(this.scene.getObjectById(id, true));

    },

    selectByUuid: function(uuid) {

        var scope = this;

        this.scene.traverse(function(child) {

            if (child.uuid === uuid) {

                scope.select(child);

            }

        });

    },

    /*MODIFIED TO INCLUDE FUNCTION CHECK FOR AN OBJECT IN SCENE START*/

    checkExistanceByUuid: function(uuid) {

        var scope = this;
        var existance = false;

        this.scene.traverse(function(child) {

            if (child.uuid === uuid) {

                existance = true;
                return existance;

            }

        });
        return existance;

    },
    /*MODIFIED TO INCLUDE FUNCTION CHECK FOR AN OBJECT IN SCENE END*/



    focus: function(object) {

        this.signals.objectFocused.dispatch(object);

    },

    focusById: function(id) {

        this.focus(this.scene.getObjectById(id, true));

    },

    clear: function() {

        this.history.clear();
        /*MODIFIED TO AVOID CLOSING OF INDEXEDDB ACCIDENTALLY START*/
        //this.storage.clear();
        this.storage.init(function() {
            editor.storage.clear();
        });
        /*MODIFIED TO AVOID CLOSING OF INDEXEDDB ACCIDENTALLY END*/

        this.camera.copy(this.DEFAULT_CAMERA);
        this.scene.background.setHex(0xaaaaaa);
        this.scene.fog = null;

        var objects = this.scene.children;

        //Modified to avoid removing light start
        /*while (objects.length > 0) {

            this.removeObject(objects[0]);

        }*/
        while (objects.length > 1) {

            if( objects[ 0 ] instanceof THREE.HemisphereLight && objects[ 0 ].name === 'SceneHemisphereLight' ){

                this.removeObject( objects[ 1 ] );

            }
            else{

                this.removeObject( objects[ 0 ] );

            }

        }
        //Modified to avoid removing light end

        this.geometries = {};
        this.materials = {};
        this.textures = {};
        this.scripts = {};

        this.deselect();

        maxCamCount = 0;

        this.signals.editorCleared.dispatch();

    },

    //

    fromJSON: function(json) {

        //Get tha value previous Zoom size//
        this.zoomRight = parseInt(json.Right);
        this.zoomTop = parseInt(json.Top);
        this.zoomLeft = parseInt(json.Left);
        //Get tha value previous Zoom size//

        var loader = new THREE.ObjectLoader();

        // backwards

        if (json.scene === undefined) {

            this.setScene(loader.parse(json));
            return;

        }

        var camera = loader.parse(json.camera);

        this.camera.copy(camera);
        this.camera.aspect = this.DEFAULT_CAMERA.aspect;
        this.camera.updateProjectionMatrix();

        this.history.fromJSON(json.history);
        this.scripts = json.scripts;

        /*MODIFIED FOR PUSHING CAMERAS TO EDITOR.CAMERA_ARRAY START*/
        var obj_in_json = json.scene.object.children;
        editor.camera_array = [];
        for (var model in obj_in_json) {
            if (obj_in_json[model].type == 'PerspectiveCamera') {
                editor.camera_array.push(loader.parseObject(obj_in_json[model]));
            }
        }
        /*MODIFIED FOR PUSHING CAMERAS TO EDITOR.CAMERA_ARRAY END*/

        this.setScene(loader.parse(json.scene));

    },

    toJSON: function() {

        // scripts clean up

        var scene = this.scene;
        var scripts = this.scripts;

        for (var key in scripts) {

            var script = scripts[key];

            if (script.length === 0 || scene.getObjectByProperty('uuid', key) === undefined) {

                delete scripts[key];

            }

        }

        //

        return {


            metadata: {},
            project: {
                gammaInput: this.config.getKey('project/renderer/gammaInput'),
                gammaOutput: this.config.getKey('project/renderer/gammaOutput'),
                shadows: this.config.getKey('project/renderer/shadows'),
                vr: this.config.getKey('project/vr')
            },
            camera: this.camera.toJSON(),
            scene: this.scene.toJSON(),
            scripts: this.scripts,
            history: this.history.toJSON(),
            /* retain Zoom postion*/
            Right: this.zoomRight,
            Left: this.zoomLeft,
            Top: this.zoomTop
                /* end retain Zoom postion*/

        };

    },

    objectByUuid: function(uuid) {

        return this.scene.getObjectByProperty('uuid', uuid, true);

    },

    execute: function(cmd, optionalName) {

        this.history.execute(cmd, optionalName);

    },

    undo: function() {

        this.history.undo();

    },

    redo: function() {

        this.history.redo();

    },
    /*modified for the object seleted time out*/
    objectSelectedTimeOut: function() {
        
        /*var that = this;
        if (this.timeoutID != undefined) {
            window.clearTimeout(this.timeoutID);
            this.timeoutID = window.setTimeout(function() {
                that.deselect();

            }, 45000);
        } else {

            this.timeoutID = window.setTimeout(function() {
                that.deselect();
            }, 45000);
        }*/

    },
    /*End*/

    /*Get  object data from uuid */
    getObjectByUuid: function(uuid) {

        var scope = this;
        return new Promise(function(resolve, reject) {

            var obj;
            try {
                var len = scope.scene.children.length,
                    children = scope.scene.children;
                for (var i = 0; i < len; i++) {

                    if (children[i].uuid == uuid) {

                        obj = children[i];
                        break;

                    }

                };
                resolve(obj);
            } catch (exception) {

                reject(exception);

            }

        });
    },


    /*Get  object data from uuid */
    /*MODIFIED TO INCLUDE A FUNCTION THAT WILL RETURN A 3D MODEL AND BADGE START*/
    modelWithBadge : function ( badgeText, badgeColor, camCategory, isCameraLite, sensorCategory ) {
        if( camCategory == "Bullet" ){
            if( isCameraLite == "true"){
                var threeDModel = this.threeDLiteCamera.clone();
                this.getNumberBadgeForCamera( { "badgeText": badgeText, "badgeColor": badgeColor  } ).then( function( numberBadge ){
                    numberBadge.scale.set(1, 1, 1);
                    numberBadge.position.setY(4);
                    threeDModel.rotateY( 90.0 * ( Math.PI / 180 ) );
                    //threeDModel.scale.set( 0.25, 0.25, 0.25 );//Commented here Pivot
                    threeDModel.scale.set( 0.15, 0.15, 0.15 );
                    //threeDModel.position.setZ(0.4);
                    threeDModel.add( numberBadge );
                } )
            }else{
                var threeDModel = this.threeDCamera.clone();
                this.getNumberBadgeForCamera( { "badgeText": badgeText, "badgeColor": badgeColor  } ).then( function( numberBadge ){
                    numberBadge.scale.set(1, 1, 1);
                    numberBadge.position.setY(4);
                    threeDModel.rotateY( 90.0 * ( Math.PI / 180 ) );
                    //threeDModel.scale.set( 0.25, 0.25, 0.25 );//Commented here Pivot
                    threeDModel.scale.set( 0.15, 0.15, 0.15 );
                    //threeDModel.position.setZ(0.4);
                    threeDModel.add( numberBadge );
                } )
            }

            return threeDModel;
        }
        if( camCategory == "Covert" ){
            if( isCameraLite == "true"){
                var threeDModel = this.threeDCovertLiteCamera.clone();
                this.getNumberBadgeForCamera( { "badgeText": badgeText, "badgeColor": badgeColor  } ).then( function( numberBadge ){
                    numberBadge.scale.set(1, 1, 1);
                    numberBadge.position.setY(4);
                    // threeDModel.rotateX( 90.0 * ( Math.PI / 180 ) )
                    threeDModel.rotateY( 180.0 * ( Math.PI / 180 ) )
                    //threeDModel.scale.set( 0.25, 0.25, 0.25 );//Commented here Pivot
                    threeDModel.scale.set( 0.15, 0.15, 0.15 );
                    //threeDModel.position.setZ(0.4);
                    threeDModel.add( numberBadge );
                } )
            }else{
                var threeDModel = this.threeDCovertCamera.clone();
                this.getNumberBadgeForCamera( { "badgeText": badgeText, "badgeColor": badgeColor  } ).then( function( numberBadge ){
                    numberBadge.scale.set(1, 1, 1);
                    numberBadge.position.setY(4);
                    // threeDModel.rotateX( 90.0 * ( Math.PI / 180 ) )
                    threeDModel.rotateY( 180.0 * ( Math.PI / 180 ) )
                    //threeDModel.scale.set( 0.25, 0.25, 0.25 );//Commented here Pivot
                    threeDModel.scale.set( 0.15, 0.15, 0.15 );
                    //threeDModel.position.setZ(0.4);
                    threeDModel.add( numberBadge );
                } )
            }
           
            return threeDModel;
            
        }
        else if( camCategory == "Box" ){
            if( isCameraLite == "true"){
                var threeDModel = this.threeDBoxLiteCamera.clone();
                this.getNumberBadgeForCamera( { "badgeText": badgeText, "badgeColor": badgeColor  } ).then( function( numberBadge ){
                    numberBadge.scale.set(1, 1, 1);
                    numberBadge.position.setX(-1.5);
                    numberBadge.position.setY(3.5);
                    threeDModel.rotateY( -90.0 * ( Math.PI / 180 ) );
                    //threeDModel.scale.set( 0.25, 0.25, 0.25 ); //Commented here Pivot
                    threeDModel.scale.set( 0.15, 0.15, 0.15 );
                    //threeDModel.position.setZ(0.6);//Commented here Pivot
                    threeDModel.position.setZ(0.37);
                    threeDModel.add( numberBadge );
                } )
            } else {

                var threeDModel = this.threeDBoxCamera.clone();
                this.getNumberBadgeForCamera( { "badgeText": badgeText, "badgeColor": badgeColor  } ).then( function( numberBadge ){
                    numberBadge.scale.set(1, 1, 1);
                    numberBadge.position.setX(-1.5);
                    numberBadge.position.setY(3.5);
                    threeDModel.rotateY( -90.0 * ( Math.PI / 180 ) );
                    //threeDModel.scale.set( 0.25, 0.25, 0.25 ); //Commented here Pivot
                    threeDModel.scale.set( 0.15, 0.15, 0.15 );
                    //threeDModel.position.setZ(0.6);//Commented here Pivot
                    threeDModel.position.setZ(0.37);
                    threeDModel.add( numberBadge );
                } )
            }
           
            return threeDModel;
            

        }
     
        else if( camCategory == "PTZ" ){
            if( isCameraLite == "true"){
                var threeDModel = this.threeDPTZLiteCamera.clone();
                this.getNumberBadgeForCamera( { "badgeText": badgeText, "badgeColor": badgeColor  } ).then( function( numberBadge ){
                    numberBadge.scale.set(1, 1, 1);
                    numberBadge.position.setY(3);
                    //threeDModel.scale.set( 0.25, 0.25, 0.25 );//Commented here Pivot
                    threeDModel.scale.set( 0.15, 0.15, 0.15 );
                    //threeDModel.rotateX( 90.0 * ( Math.PI / 180 ) )
                    threeDModel.rotateY( 90.0 * ( Math.PI / 180 ) ) //Modified by Pivot
                    //camIconModel.position.setX(0.15); //Commented here Pivot
                    //threeDModel.position.setZ(0.4);
                    //threeDModel.position.setY(0.30);//Commented here Pivot
                    threeDModel.position.setY(0.175);
                    threeDModel.add( numberBadge );
                } )
            }
            else{
                var threeDModel = this.threeDPTZCamera.clone();
                this.getNumberBadgeForCamera( { "badgeText": badgeText, "badgeColor": badgeColor  } ).then( function( numberBadge ){
                    numberBadge.scale.set(1, 1, 1);
                    numberBadge.position.setY(3);
                    //threeDModel.scale.set( 0.25, 0.25, 0.25 );//Commented here Pivot
                    threeDModel.scale.set( 0.15, 0.15, 0.15 );
                    //threeDModel.rotateX( 90.0 * ( Math.PI / 180 ) )
                    threeDModel.rotateY( 90.0 * ( Math.PI / 180 ) ) //Modified by Pivot
                    //camIconModel.position.setX(0.15); //Commented here Pivot
                    //threeDModel.position.setZ(0.4);
                    //threeDModel.position.setY(0.30);//Commented here Pivot
                    threeDModel.position.setY(0.175);
                    threeDModel.add( numberBadge );
                } )
            }
            
            return threeDModel;
        }

        else if( camCategory == "Dome" ){
            if( isCameraLite == "true"){
                var threeDModel = this.threeDDomeLiteCamera.clone();
                this.getNumberBadgeForCamera( { "badgeText": badgeText, "badgeColor": badgeColor  } ).then( function( numberBadge ){
                    numberBadge.scale.set(1, 1, 1);
                    numberBadge.position.setY(3);
                    //threeDModel.scale.set( 0.25, 0.25, 0.25 );//Commented here Pivot
                    threeDModel.scale.set( 0.15, 0.15, 0.15 );
                    threeDModel.rotateX( 90.0 * ( Math.PI / 180 ) )
                    threeDModel.rotateY( 90.0 * ( Math.PI / 180 ) ) //Modified by Pivot
                    //camIconModel.position.setX(0.15); //Commented here Pivot
                    //threeDModel.position.setZ(0.4);//Commented here Pivot
                    //threeDModel.position.setZ(0.19);//Commented for 180 tilt camera
                    //threeDModel.position.setY(0.175);//Commented here Pivot
                    //threeDModel.position.setY(0.1);//Commented for 180 tilt camera
                    threeDModel.position.setZ(-0.1);
                    threeDModel.add( numberBadge );
            } )
          
            } else{
                var threeDModel = this.threeDDomeCamera.clone();
                this.getNumberBadgeForCamera( { "badgeText": badgeText, "badgeColor": badgeColor  } ).then( function( numberBadge ){
                    numberBadge.scale.set(1, 1, 1);
                    numberBadge.position.setY(3);
                    //threeDModel.scale.set( 0.25, 0.25, 0.25 );//Commented here Pivot
                    threeDModel.scale.set( 0.15, 0.15, 0.15 );
                    threeDModel.rotateX( 90.0 * ( Math.PI / 180 ) )
                    threeDModel.rotateY( 90.0 * ( Math.PI / 180 ) ) //Modified by Pivot
                    //camIconModel.position.setX(0.15); //Commented here Pivot
                    //threeDModel.position.setZ(0.4);//Commented here Pivot
                    //threeDModel.position.setZ(0.19);//Commented for 180 tilt camera
                    //threeDModel.position.setY(0.175);//Commented here Pivot
                    //threeDModel.position.setY(0.1);//Commented for 180 tilt camera
                    threeDModel.position.setZ(-0.1);
                    threeDModel.add( numberBadge );
                } )
               
            }
            return threeDModel;

        }
        else if( camCategory == "LiDAR" ){

            if( sensorCategory === "Intel RealSense L515" ){

                if( this.threeDLidarIntelCamera ){
                    var threeDModel = this.threeDLidarIntelCamera.clone();
                }
                
                this.getNumberBadgeForCamera( { "badgeText": badgeText, "badgeColor": badgeColor  } ).then( function( numberBadge ){
                    numberBadge.scale.set(4, 4, 4);
                    numberBadge.position.setY(11);
                    threeDModel.rotateY( 90.0 * ( Math.PI / 180 ) );
                    editor.execute( new SetRotationCommand( threeDModel, new THREE.Euler( THREE.Math.degToRad(45), THREE.Math.degToRad(90), 0 ) ) );
                    //threeDModel.scale.set( 0.15, 0.15, 0.15 );//Commented here
                    //threeDModel.position.setZ(0.15);//Commented here
                    //threeDModel.position.setY(-0.04);//Commented here
                    threeDModel.scale.set( 0.05, 0.05, 0.05 );
                    //threeDModel.position.setZ(0.075);
                    //threeDModel.position.setY(-0.015);
                    threeDModel.position.setY(-0.075);
                    threeDModel.position.setZ(0.04);
                    threeDModel.add( numberBadge );
                } )

            }
            else if( sensorCategory === "HLS-LFOM1" ){
                if( this.threeDLidarHLSLFOM1Camera ){
                    var threeDModel = this.threeDLidarHLSLFOM1Camera.clone();
                }
                
                this.getNumberBadgeForCamera( { "badgeText": badgeText, "badgeColor": badgeColor  } ).then( function( numberBadge ){
                    numberBadge.scale.set(4, 4, 4);
                    numberBadge.position.setY(11);
                    threeDModel.rotateY( 90.0 * ( Math.PI / 180 ) );
                    editor.execute( new SetRotationCommand( threeDModel, new THREE.Euler( THREE.Math.degToRad(45), THREE.Math.degToRad(90), 0 ) ) );
                    //threeDModel.scale.set( 0.15, 0.15, 0.15 );//Commented here
                    //threeDModel.position.setZ(0.15);//Commented here
                    //threeDModel.position.setY(-0.04);//Commented here
                    threeDModel.scale.set( 0.05, 0.05, 0.05 );
                    //threeDModel.position.setZ(0.075);
                    //threeDModel.position.setY(-0.015);
                    threeDModel.position.setY(-0.075);
                    threeDModel.position.setZ(0.04);
                    threeDModel.add( numberBadge );
                } )

            }
            
            else if( sensorCategory === "HLS-LFOM3" ){
                if( this.threeDLidarHLSLFOM3Camera ){
                    var threeDModel = this.threeDLidarHLSLFOM3Camera.clone();
                }

                this.getNumberBadgeForCamera( { "badgeText": badgeText, "badgeColor": badgeColor  } ).then( function( numberBadge ){
                    numberBadge.scale.set(4, 4, 4);
                    numberBadge.position.setY(14);
                    threeDModel.rotateY( 90.0 * ( Math.PI / 180 ) );
                    editor.execute( new SetRotationCommand( threeDModel, new THREE.Euler( THREE.Math.degToRad(45), THREE.Math.degToRad(90), 0 ) ) );
                    //threeDModel.scale.set( 0.15, 0.15, 0.15 );//Commented here
                    //threeDModel.position.setZ(0.15);//Commented here
                    //threeDModel.position.setY(-0.04);//Commented here
                    threeDModel.scale.set( 0.05, 0.05, 0.05 );
                    //threeDModel.position.setZ(0.075);
                    //threeDModel.position.setY(-0.015);
                    threeDModel.position.setY(-0.075);
                    threeDModel.position.setZ(0.04);
                    threeDModel.add( numberBadge );
                } )

            }
            

            else if( isCameraLite == "true"){

                if( this.threeDLidarLiteCamera ){
                    var threeDModel = this.threeDLidarLiteCamera.clone();
                }
                
                this.getNumberBadgeForCamera( { "badgeText": badgeText, "badgeColor": badgeColor  } ).then( function( numberBadge ){
                    numberBadge.scale.set(4, 4, 4);
                    numberBadge.position.setY(7);
                    threeDModel.rotateY( 90.0 * ( Math.PI / 180 ) );
                    editor.execute( new SetRotationCommand( threeDModel, new THREE.Euler( THREE.Math.degToRad(45), THREE.Math.degToRad(90), 0 ) ) );
                    //threeDModel.scale.set( 0.15, 0.15, 0.15 );//Commented here
                    //threeDModel.position.setZ(0.15);//Commented here
                    //threeDModel.position.setY(-0.04);//Commented here
                    threeDModel.scale.set( 0.05, 0.05, 0.05 );
                    //threeDModel.position.setZ(0.075);
                    //threeDModel.position.setY(-0.015);
                    threeDModel.position.setY(-0.075);
                    threeDModel.position.setZ(0.04);
                    threeDModel.add( numberBadge );
                } )

            }
            else{

            if( this.threeDLidarCamera ){
                var threeDModel = this.threeDLidarCamera.clone();
            }
            
            this.getNumberBadgeForCamera( { "badgeText": badgeText, "badgeColor": badgeColor  } ).then( function( numberBadge ){
                numberBadge.scale.set(4, 4, 4);
                numberBadge.position.setY(7);
                threeDModel.rotateY( 90.0 * ( Math.PI / 180 ) );
                editor.execute( new SetRotationCommand( threeDModel, new THREE.Euler( THREE.Math.degToRad(45), THREE.Math.degToRad(90), 0 ) ) );
                //threeDModel.scale.set( 0.15, 0.15, 0.15 );//Commented here
                //threeDModel.position.setZ(0.15);//Commented here
                //threeDModel.position.setY(-0.04);//Commented here
                threeDModel.scale.set( 0.05, 0.05, 0.05 );
                //threeDModel.position.setZ(0.075);
                //threeDModel.position.setY(-0.015);
                threeDModel.position.setY(-0.075);
                threeDModel.position.setZ(0.04);
                threeDModel.add( numberBadge );
            } )
         }
            return threeDModel;
        }
        else{
            toastr.error("Some error occured");
        }
    },
    /*MODIFIED TO INCLUDE A FUNCTION THAT WILL RETURN A 3D MODEL AND BADGE END*/

    /*MODIFIED TO INCLUDE A FUNCTION THAT WILL RETURN A MESH WITH IMAGE AND BADGE START*/
    iconWithBadge: function( imageUrl, badgeText, badgeColor, textColor ){

        var scope = this;
        var spriteCanvas = document.createElement('canvas');
        var spriteTexture = new THREE.Texture(spriteCanvas);

        var numberCanvas = document.createElement('canvas');
        var numberTexture = new THREE.Texture(numberCanvas);
        numberCanvas.width = 32;
        numberCanvas.height = 32;

        spriteCanvas.width = spriteCanvas.height = 128;
        var imageLoader = new THREE.ImageLoader();
        imageLoader.load(imageUrl, function(img) {

            var ctx = spriteCanvas.getContext('2d');
            ctx.fillStyle = "#aaaaaa";
            ctx.fillRect(0, 0, spriteCanvas.width, spriteCanvas.height);
            ctx.drawImage(img, 0, 0, 128, 128);
            var colorHex;
            //check whether the badgeColor is hex value or number
            if (typeof(badgeColor) == 'number') {

                //colorHex = '#' + Number(badgeColor).toString(16);
                colorHex = '#' + (new THREE.Color(badgeColor)).getHexString();

            } else if (typeof(badgeColor) == 'string') {

                colorHex = badgeColor;

            }
            var ctx2 = numberCanvas.getContext('2d');
            ctx2.fillStyle = colorHex;
            //ctx.arc(104, 24, 24, 0, Math.PI * 2);
            ctx2.arc(16, 16, 16, 0, Math.PI * 2);
            ctx2.fill();

            //
            var pc = new ProcessColors();
            var fontColor;
            //( textColor != undefined )? fontColor = textColor : fontColor = scope.invertColor( colorHex, true );//
            //( textColor != undefined )? fontColor = textColor : fontColor = pc.invert( colorHex, { black: '#3a3a3a', white: '#fafafa' } );
            ( textColor != undefined )? fontColor = textColor : fontColor = pc.invert( colorHex, true );
            //( textColor != undefined )? fontColor = textColor : fontColor = pc.invert( colorHex, false );
            //

            //ctx.fillStyle = 'white';//
            ctx2.fillStyle = fontColor;
            //ctx.font = '26px sans-serif';
            ctx2.font = 'bold 20px sans-serif';//30px default
            ctx2.textAlign = 'center';
            ctx2.textBaseline = 'middle';
            //ctx.fillText(badgeText, 104, 24);
            ctx2.fillText(badgeText, 16, 16);

            numberTexture.needsUpdate = true;
            spriteTexture.needsUpdate = true;

        });

        var spriteNumberBadge = new THREE.Sprite(new THREE.SpriteMaterial({

            map: numberTexture

        }));
        //sprite1.position.x= 0.3;
        spriteNumberBadge.position.y= 0.8;
        spriteNumberBadge.scale.set( 0.6,0.6,0.6 );

        var geometry = new THREE.PlaneGeometry( 1, 1 );
        var material = new THREE.MeshBasicMaterial( {map: spriteTexture, side: THREE.DoubleSide} );
        var iconMesh = new THREE.Mesh( geometry, material );

        iconMesh.add( spriteNumberBadge );

        //editor.execute( new SetRotationCommand( sprite, new THREE.Euler(  0, -1.5708, 0 ) ) );

        //sprite.scale.set(3, 3, 3);

        return iconMesh;

    },
    /*MODIFIED TO INCLUDE A FUNCTION THAT WILL RETURN A MESH WITH IMAGE AND BADGE END*/

    /*ADDED TO INCLUDE A FUNCTION THAT WILL RETURN A SPRITE WITH IMAGE AND BADGE START*/
    iconWithBadgeSprite: function( imageUrl, badgeText, badgeColor, textColor ){

        var scope = this;
        var spriteCanvas = document.createElement('canvas');
        var spriteTexture = new THREE.Texture(spriteCanvas);

        spriteCanvas.width = spriteCanvas.height = 128;
        var imageLoader = new THREE.ImageLoader();
        imageLoader.load(imageUrl, function(img) {

            var ctx = spriteCanvas.getContext('2d');
            ctx.drawImage(img, 0, 0, 128, 128);
            var colorHex;
            //check whether the badgeColor is hex value or number
            if (typeof(badgeColor) == 'number') {

                //colorHex = '#' + Number(badgeColor).toString(16);
                colorHex = '#' + (new THREE.Color(badgeColor)).getHexString();

            } else if (typeof(badgeColor) == 'string') {

                colorHex = badgeColor;

            }

            ctx.fillStyle = colorHex;
            //ctx.arc(104, 24, 24, 0, Math.PI * 2);
            ctx.arc(98, 50, 30, 0, Math.PI * 2);
            ctx.fill();

            //
            var pc = new ProcessColors();
            var fontColor;
            //( textColor != undefined )? fontColor = textColor : fontColor = scope.invertColor( colorHex, true );//
            //( textColor != undefined )? fontColor = textColor : fontColor = pc.invert( colorHex, { black: '#3a3a3a', white: '#fafafa' } );
            ( textColor != undefined )? fontColor = textColor : fontColor = pc.invert( colorHex, true );
            //( textColor != undefined )? fontColor = textColor : fontColor = pc.invert( colorHex, false );
            //

            //ctx.fillStyle = 'white';//
            ctx.fillStyle = fontColor;
            //ctx.font = '26px sans-serif';
            ctx.font = 'bold 40px sans-serif';//30px default
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            //ctx.fillText(badgeText, 104, 24);
            ctx.fillText(badgeText, 98, 50);

            spriteTexture.needsUpdate = true;

        });

        // sample geometry
        var sprite = new THREE.Sprite(new THREE.SpriteMaterial({

            map: spriteTexture

        }));

        sprite.scale.set(3, 3, 3);

        return sprite;

    },
    iconWithBadgeSpriteForPoi: function( imageUrl, badgeNumber, badgeColor, textColor ){

        var scope = this;
        var spriteCanvas = document.createElement('canvas');
        var spriteTexture = new THREE.Texture(spriteCanvas);

        spriteCanvas.width = spriteCanvas.height = 298;
        var imageLoader = new THREE.ImageLoader();
        imageLoader.load(imageUrl, function(img) {

            var ctx = spriteCanvas.getContext('2d');
            //ctx.drawImage(img, 0, 0, 128, 128);
            ctx.drawImage(img, 20, 120, 140, 140);
            var colorHex;
            //check whether the badgeColor is hex value or number
            if (typeof(badgeColor) == 'number') {

                //colorHex = '#' + Number(badgeColor).toString(16);
                colorHex = '#' + (new THREE.Color(badgeColor)).getHexString();

            } else if (typeof(badgeColor) == 'string') {

                colorHex = badgeColor;

            }

            ctx.fillStyle = colorHex;
            //ctx.arc(104, 24, 24, 0, Math.PI * 2);
            ctx.arc(100, 60, 50, 0, Math.PI * 2);
            ctx.fill();

            //
            var pc = new ProcessColors();
            var fontColor;
            //( textColor != undefined )? fontColor = textColor : fontColor = scope.invertColor( colorHex, true );//
            //( textColor != undefined )? fontColor = textColor : fontColor = pc.invert( colorHex, { black: '#3a3a3a', white: '#fafafa' } );
            ( textColor != undefined )? fontColor = textColor : fontColor = pc.invert( colorHex, true );
            //( textColor != undefined )? fontColor = textColor : fontColor = pc.invert( colorHex, false );
            //

            //ctx.fillStyle = 'white';//
            ctx.fillStyle = fontColor;
            //ctx.font = '26px sans-serif';
            ctx.font = 'bold 75px sans-serif';//30px default
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            //ctx.fillText(badgeText, 104, 24);
            ctx.fillText(badgeNumber,100, 60);

            spriteTexture.needsUpdate = true;

        });

        // sample geometry
        var sprite = new THREE.Sprite(new THREE.SpriteMaterial({

            map: spriteTexture

        }));

        sprite.scale.set(3, 3, 3);

        return sprite;

    },
    /*ADDED TO INCLUDE A FUNCTION THAT WILL RETURN A SPRITE WITH IMAGE AND BADGE END*/

    iconWithBadgeSpriteAlignTop: function( imageUrl, badgeText, badgeColor, textColor ){

        var scope = this;
        var spriteCanvas = document.createElement('canvas');
        var spriteTexture = new THREE.Texture(spriteCanvas);

        spriteCanvas.width = spriteCanvas.height = 308;
        var imageLoader = new THREE.ImageLoader();
        imageLoader.load(imageUrl, function(img) {

            var ctx = spriteCanvas.getContext('2d');
            ctx.drawImage(img, 55, 170, 110, 110);
            var colorHex;
            //check whether the badgeColor is hex value or number
            if (typeof(badgeColor) == 'number') {

                //colorHex = '#' + Number(badgeColor).toString(16);
                colorHex = '#' + (new THREE.Color(badgeColor)).getHexString();

            } else if (typeof(badgeColor) == 'string') {

                colorHex = badgeColor;

            }

            ctx.fillStyle = colorHex;
            //ctx.arc(104, 24, 24, 0, Math.PI * 2);
            ctx.arc(113, 80, 70, 0, Math.PI * 2);
            ctx.fill();

            //
            var pc = new ProcessColors();
            var fontColor;
            //( textColor != undefined )? fontColor = textColor : fontColor = scope.invertColor( colorHex, true );//
            //( textColor != undefined )? fontColor = textColor : fontColor = pc.invert( colorHex, { black: '#3a3a3a', white: '#fafafa' } );
            ( textColor != undefined )? fontColor = textColor : fontColor = pc.invert( colorHex, true );
            //( textColor != undefined )? fontColor = textColor : fontColor = pc.invert( colorHex, false );
            //

            //ctx.fillStyle = 'white';//
            ctx.fillStyle = fontColor;
            //ctx.font = '26px sans-serif';
            ctx.font = 'bold 80px sans-serif';//30px default
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            //ctx.fillText(badgeText, 104, 24);
            ctx.fillText(badgeText, 113, 80);

            spriteTexture.needsUpdate = true;

        });

        // sample geometry
        var sprite = new THREE.Sprite(new THREE.SpriteMaterial({

            map: spriteTexture

        }));

        sprite.scale.set(4, 4, 4);

        return sprite;

    },

    triangleWithBadge: function( option ){
        
        if(option.badgeColour == undefined){option.badgeColour = 'red'}
        var spriteCanvas = document.createElement('canvas');
        var spriteTexture = new THREE.Texture(spriteCanvas);
        spriteCanvas.width = spriteCanvas.height = 128;
		var ctx = spriteCanvas.getContext('2d');
        ctx.beginPath();
		ctx.moveTo(0, 0)
		ctx.lineTo(100,0);
		ctx.lineTo(50,70)
		ctx.fillStyle = option.badgeColour;
		ctx.fill();
		ctx.fillStyle = 'white';
		ctx.font = '30px sans-serif';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
        ctx.fillText(option.number,50,20)
        spriteTexture.needsUpdate = true;
        var sprite = new THREE.Sprite(new THREE.SpriteMaterial({

            map: spriteTexture

        }));

        sprite.scale.set(3, 3, 3);

        return sprite;
		
	},

    getNumberBadgeIcon : function( options ){

        return new Promise( function( resolve, reject ){
            var pc = new ProcessColors();
            var badgeText, badgeRadius, badgeColor, type, badgeShape;
            var badgeCanvas = document.createElement( 'canvas' );

            ( options.badgeText === undefined )? badgeText = "" : badgeText = options.badgeText;
            ( options.badgeRadius === undefined )? badgeRadius = 45 : badgeRadius = options.badgeRadius;
            ( options.badgeColor === undefined )? badgeColor = "#000000" : badgeColor = options.badgeColor;
            ( options.type === undefined )? type = "sprite" : type = options.type;
            
            ( options.badgeShape === undefined ) ?  badgeShape = "round" :  badgeShape = options.badgeShape;
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


                //Create Badge Shape
                if( badgeShape == "square" ){
                   
                    ctx.rect(48, 45, 35, 35);
                    ctx.lineWidth = "6";
                    ctx.strokeStyle = "black";
                    ctx.stroke();
                }
                else{
                    ctx.arc( 64, 64, badgeRadius, 0, Math.PI * 2 );
                }
                
                ctx.fillStyle = colorHex;
                ctx.fill();


                // Create Badge Text  
                ctx.font =  (badgeShape == "round") ? '40px sans-serif':'32px sans-serif';
                ctx.fillStyle = pc.invert( colorHex, true );
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText( badgeText, 64, 64);

                var badgeTexture = new THREE.Texture( badgeCanvas );
                badgeTexture.needsUpdate = true;

                if( type != undefined && type === 'image' ){

                    resolve( badgeTexture );

                }
                else if( type != undefined && type === 'sprite' ){

                    // sample geometry
                    var badge = new THREE.Sprite( new THREE.SpriteMaterial( {

                        map: badgeTexture

                    } ) );

                    badge.scale.set( 3, 3, 3 );

                    resolve( badge );

                }
                else{
                    console.warn( "getNumberBadgeIcon( options ) - options.type can only accept \'image\' or \'sprite\'" );
                    reject( false );
                }

            }    
            else{

                
                var imageLoader = new THREE.ImageLoader();
                imageLoader.load( options.imageUrl, function( img ){

                    var ctx = badgeCanvas.getContext('2d');
                    ctx.drawImage( img, 0, 0, 128, 128 );
                    
                    var colorHex;
                    //check whether the badgeColor is undefined, hex value or number
                    if( typeof( badgeColor ) == 'number' ){

                        colorHex = '#' + ( new THREE.Color( badgeColor ) ).getHexString();

                    }
                    else if( typeof( badgeColor ) == 'string' ){

                        colorHex = badgeColor;

                    }


                    //Create Badge Shape
                    if( badgeShape == "square" ){
                    
                        ctx.rect(48, 45, 35, 35);
                        ctx.lineWidth = "6";
                        ctx.strokeStyle = "black";
                        ctx.stroke();
                    }
                    else{
                        ctx.arc( 98, 50, badgeRadius, 0, Math.PI * 2 );
                    }
                    
                    ctx.fillStyle = colorHex;
                    ctx.fill();
                
                
                    // Create Badge Text  
                    ctx.font =  (badgeShape == "round") ? '30px sans-serif':'22px sans-serif';
                    ctx.fillStyle = pc.invert( colorHex, true );
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText( badgeText, 98, 50 );

                    var badgeTexture = new THREE.Texture( badgeCanvas );
                    badgeTexture.needsUpdate = true;

                    if( type != undefined && type === 'image' ){

                        resolve( badgeTexture );

                    }
                    else if( type != undefined && type === 'sprite' ){

                        // sample geometry
                        var badge = new THREE.Sprite( new THREE.SpriteMaterial( {

                            map: badgeTexture

                        } ) );

                        badge.scale.set( 3, 3, 3 );

                        resolve( badge );

                    }
                    else{
                        console.warn( "getNumberBadgeIcon( options ) - options.type can only accept \'image\' or \'sprite\'" );
                        reject( false );
                    }

                } );

            }

        } );

    },

    getNumberBadgeForCamera : function( options ){

        return new Promise( function( resolve, reject ){
    
            var badgeText, badgeColor,textColor;
    
            ( options.badgeText === undefined )? badgeText = "" : badgeText = options.badgeText;
            ( options.badgeColor === undefined )? badgeColor = "#000000" : badgeColor = options.badgeColor;
    
            var numberCanvas = document.createElement( 'canvas' );
            var numberTexture = new THREE.Texture( numberCanvas );
            numberCanvas.width = 32;
            numberCanvas.height = 32;
            numberTexture.needsUpdate = true;
    
            var colorHex;
            //check whether the badgeColor is hex value or number
            if (typeof(badgeColor) == 'number') {
    
                //colorHex = '#' + Number(badgeColor).toString(16);
                colorHex = '#' + (new THREE.Color(badgeColor)).getHexString();
    
            } else if (typeof(badgeColor) == 'string') {
    
                colorHex = badgeColor;
    
            }
    
            var ctx2 = numberCanvas.getContext( '2d' );
            ctx2.fillStyle = colorHex;
            ctx2.arc( 16, 16, 16, 0, Math.PI * 2 );
            ctx2.fill();
    
            var pc = new ProcessColors();
            var fontColor;
            ( textColor != undefined ) ? fontColor = textColor : fontColor = pc.invert( colorHex, true );
            ctx2.fillStyle = fontColor;
            ctx2.font = 'bold 20px sans-serif';//30px default
            ctx2.textAlign = 'center';
            ctx2.textBaseline = 'middle';
            ctx2.fillText( badgeText, 16, 16 );
            var spriteNumberBadge = new THREE.Sprite( new THREE.SpriteMaterial( {
    
                map: numberTexture
    
            } ) );
            spriteNumberBadge.position.y = 0.8;
            spriteNumberBadge.scale.set( 0.6, 0.6, 0.6 );
            spriteNumberBadge.name = "cameraHelperIcon";
    
            resolve( spriteNumberBadge )
        });
    },

    removeAllCameraIcons : function(){

        var len = this.sceneCameras.length;
        for( var i = 0; i < len; i++ ){

            this.execute( new RemoveObjectCommand( this.sceneCameras[ i ].children[ 0 ] ) );

        }

    },

    /*MODIFIED TO INCLUDE A FUNCTION THAT WILL RETURN A RANDOM COLOR CODE START*/
    randomColor: function() {

        var colors = [0xF0A3FF, 0x0075DC, 0x993F00, 0x4C005C, 0x191919, 0x005C31, 0x2BCE48, 0xFFCC99, 0x808080, 0x94FFB5, 0x8F7C00, 0x9DCC00, 0xC20088, 0x003380, 0xFFA405, 0xFFA8BB, 0x426600, 0xFF0010, 0x5EF1F2, 0x00998F, 0xE0FF66, 0x740AFF, 0x990000, 0xFFFF80, 0xFF5005, 0x4286f4, 0x41d9f4, 0x41f4d3, 0x41f47c, 0xf4dc41, 0xf47c41, 0xf441d3, 0xcd41f4, 0xa01e47, 0xEE82EE, 0x4B0082, 0x8A2BE2, 0x008000, 0xFFFF00, 0xFFA500, 0xFF0000, 0x008080, 0x800000, 0x00CED1, 0x7FFFD4, 0x00FFFF, 0xC71585, 0x0000FF];

        return (colors[Math.floor(Math.random() * colors.length)]);

    },
    /*MODIFIED TO INCLUDE A FUNCTION THAT WILL RETURN A RANDOM COLOR CODE END*/

    //MODIFIED TO INCLUDE THE INVERT COLOR FUNCTION START
    invertColor : function( hex, invertToBW ){

        function padZero( str, len ){
            
            len = len || 2;
            var zeros = new Array( len ).join( '0' );
            return( zeros + str ).slice( -len );
    
        }
    
        if ( hex.indexOf( '#' ) === 0 ){
    
            hex = hex.slice( 1 );
    
        }
    
        // convert 3-digit hex to 6-digits.
        if( hex.length === 3 ){
    
            hex = hex[ 0 ] + hex[ 0 ] + hex[ 1 ] + hex[ 1 ] + hex[ 2 ] + hex[ 2 ];
    
        }
    
        if ( hex.length !== 6 ){
    
            throw new Error( 'Invalid HEX color.' );
    
        }
    
        var r = parseInt( hex.slice( 0, 2 ), 16 ),
            g = parseInt( hex.slice( 2, 4 ), 16 ),
            b = parseInt( hex.slice( 4, 6 ), 16 );
    
        if( invertToBW ){
    
            return( r * 0.299 + g * 0.587 + b * 0.114 ) > 186 ? '#000000' : '#FFFFFF';
    
        }
    
        // invert color components
        r = ( 255 - r ).toString( 16 );
        g = ( 255 - g ).toString( 16 );
        b = ( 255 - b ).toString( 16 );
    
        // pad each with zeros and return
        return "#" + padZero( r ) + padZero( g ) + padZero( b );
    
    },
    //MODIFIED TO INCLUDE THE INVERT COLOR FUNCTION END

    //MODIFIED TO RE-FLIP LIDAR SENSOR START
    reFlipSensor: function(camera) {

        var threeDModel = camera.getObjectByProperty('type','Scene');
        THREE.SceneUtils.detach( threeDModel, camera, editor.scene );
        var alignment = camera.userData.flipped;

        switch(alignment) {

            case 'top': 

                editor.execute( new SetRotationCommand( camera, new THREE.Euler( camera.rotation.x, camera.rotation.y, THREE.Math.degToRad(180) ) ) );
                    
                editor.signals.sceneGraphChanged.dispatch();
                break;
            
            case 'left': 

                editor.execute( new SetRotationCommand( camera, new THREE.Euler( THREE.Math.degToRad(-135),0,THREE.Math.degToRad(180) ) ) );

                editor.signals.sceneGraphChanged.dispatch();
                break;
            
            case 'right': 

                editor.execute( new SetRotationCommand( camera, new THREE.Euler( THREE.Math.degToRad(-45),0, THREE.Math.degToRad(360) ) ) );
                    
                editor.signals.sceneGraphChanged.dispatch();
                break;
            
            case 'front': 

                editor.execute( new SetRotationCommand( camera, new THREE.Euler( THREE.Math.degToRad(-90),THREE.Math.degToRad(-45), THREE.Math.degToRad(270) ) ) );
                    
                editor.signals.sceneGraphChanged.dispatch();
                break;
            
            case 'back': 

                editor.execute( new SetRotationCommand( camera, new THREE.Euler( THREE.Math.degToRad(-90),THREE.Math.degToRad(45), THREE.Math.degToRad(90) ) ) );

                editor.signals.sceneGraphChanged.dispatch();
                break;

        }

        THREE.SceneUtils.attach( threeDModel, editor.scene, camera ); 
        return camera;

    },
    //MODIFIED TO RE-FLIP LIDAR SENSOR END

    /*MODIFIED TO INCLUDE A PROTOTYPE THAT WILL UPDATE THE CAMERA OBJECT BASED ON SETTINGS START*/
    modifyCameraObject: function(settings) {

        var scope = this;
        var selectedCamObject = settings.camObject;
        var badgeText, helperColor;
    
        //Removing the existing iconBadge and frustum.
        if( selectedCamObject.children[0] != undefined )
        this.execute(new RemoveObjectCommand(selectedCamObject.children[0]));
        if( selectedCamObject.children[0] != undefined )
        this.execute(new RemoveObjectCommand(selectedCamObject.children[0]));
    
        //if helperColor is specified remove the CameraHelper and attach a new one
        //using the specified settings.
        if (settings.helperColor != undefined) {
    
            selectedCamObject.helperColor = settings.helperColor;
    
        }
    
        if (settings.badgeText != undefined) {
    
            selectedCamObject.badgeText = settings.badgeText;
    
        }
        /*
        function tiltLiDARSensor(camera) {

            return new Promise( function(resolve,reject) {

                if( camera.userData.tiltRotationValue != -45 ) {

                    var defValue;
                    if( camera.userData.tiltRotationValue < -45 ) {

                        defValue = camera.userData.tiltRotationValue + 45;

                    }
                    editor.customizedRotation.tiltLidar(camera,defValue,'down');
                    //camera.userData.tiltRotationValue = 0;
                    resolve();

                } else {

                    resolve();

                }
    
            } )

        }*/
        
    
        //Removing the existing camera helper.
        var syncHelperChange = new Promise( function( resolve, reject ) {
    
            scope.removeHelper(selectedCamObject);
            scope.addHelper(selectedCamObject);
            scope.select(selectedCamObject);
            resolve();
    
            
        } );
        syncHelperChange.then( function(){
            if( selectedCamObject instanceof THREE.PerspectiveCamera && selectedCamObject.camCategory && selectedCamObject.camCategory === "Dome" ) {

                var currentCamera = selectedCamObject;

                var cameraTiltValue = currentCamera.userData.tiltRotationValue;
                var cameraPanValue = currentCamera.userData.panRotationValue;
                var cameraRollValue = currentCamera.userData.rollRotationValue;
                var alignment = currentCamera.userData.alignment;

                switch(alignment) {

                    case 'top': 

                        editor.execute( new SetRotationCommand( currentCamera, new THREE.Euler( THREE.Math.degToRad(-90),0,0 ) ) );
                            

                        editor.signals.sceneGraphChanged.dispatch();
                        break;

                    
                    case 'left': 

                        editor.execute( new SetRotationCommand( currentCamera, new THREE.Euler( 0,0,0 ) ) ); 
                        
                        editor.signals.sceneGraphChanged.dispatch();
                        break;

                    
                    case 'right': 

                        editor.execute( new SetRotationCommand( currentCamera, new THREE.Euler( 0,THREE.Math.degToRad(180),0 ) ) );
                            

                        editor.signals.sceneGraphChanged.dispatch();
                        break;

                    
                    case 'front': 

                        editor.execute( new SetRotationCommand( currentCamera, new THREE.Euler( 0,THREE.Math.degToRad(-90),0 ) ) );
                            

                        editor.signals.sceneGraphChanged.dispatch();
                        break;

                    
                    case 'back': 

                        editor.execute( new SetRotationCommand( currentCamera, new THREE.Euler( 0,THREE.Math.degToRad(-270),0 ) ) );
                        

                        editor.signals.sceneGraphChanged.dispatch();
                        break;

                    

                }
                if( cameraTiltValue!= undefined && cameraTiltValue!= null && cameraTiltValue!=0 ) {
                    editor.customizedRotation.tiltDomeCameraUp(currentCamera,currentCamera.userData.tiltRotationValue);
                }  

                if(cameraPanValue!=undefined && cameraPanValue!=null && cameraPanValue!=0) {
                    if( cameraPanValue <0 ){
                        editor.customizedRotation.panDomeCameraLeft(currentCamera,Math.abs(cameraPanValue));
                    }
                    else if( cameraPanValue >0  ){
                        editor.customizedRotation.panDomeCameraRight(currentCamera,cameraPanValue)
                    }

                }
                
                if(cameraRollValue!= undefined && cameraRollValue!=null && cameraRollValue!=0) {

                    if(cameraRollValue<0){
                        editor.customizedRotation.rollDomeCameraLeft(currentCamera,Math.abs(cameraRollValue));
                    }
                    else if( cameraRollValue>0 ){
                        editor.customizedRotation.rollDomeCameraRight(currentCamera,cameraRollValue);   
                    }

                }

            } else if(selectedCamObject instanceof THREE.PerspectiveCamera && selectedCamObject.camCategory && selectedCamObject.camCategory === "PTZ"){

                var currentCamera = selectedCamObject;
                var cameraTiltValue = currentCamera.userData.tiltRotationValue;
                var cameraPanValue = currentCamera.userData.panRotationValue;
                var cameraRollValue = currentCamera.userData.rollRotationValue;

                editor.execute( new SetRotationCommand( currentCamera, new THREE.Euler( 0, 0, 0 ) ) );
                if( cameraTiltValue!= undefined && cameraTiltValue!= null && cameraTiltValue!=0 ) {
  
                    editor.customizedRotation.tiltPTZCamera(currentCamera,cameraTiltValue,'down')

                }

                if(cameraPanValue!=undefined && cameraPanValue!=null && cameraPanValue!=0) {

                    if( cameraPanValue < 0 ){
                        editor.customizedRotation.panPTZCamera(currentCamera,Math.abs(cameraPanValue),'left')
                    }
                    else if( cameraPanValue > 0  ){
                        editor.customizedRotation.panPTZCamera(currentCamera,cameraPanValue,'right')
                    }

                }
                
                if(cameraRollValue!= undefined && cameraRollValue!=null && cameraRollValue!=0) {

                    if(cameraRollValue < 0){
                        editor.customizedRotation.rollPTZCamera(currentCamera,Math.abs(cameraRollValue),'left');
                    }
                    else if( cameraRollValue > 0 ){
                        editor.customizedRotation.rollPTZCamera(currentCamera,cameraRollValue,'right');   
                    }

                }
                
            } else if(selectedCamObject instanceof THREE.PerspectiveCamera && selectedCamObject.camCategory && selectedCamObject.camCategory === "LiDAR") {

                var currentCamera = selectedCamObject;
                var cameraTiltValue = currentCamera.userData.tiltRotationValue;
                var cameraPanValue = currentCamera.userData.panRotationValue;
                var cameraRollValue = currentCamera.userData.rollRotationValue;
                var alignment = currentCamera.userData.alignment;

                //editor.execute( new SetRotationCommand( currentCamera, new THREE.Euler( 0, 0, 0 ) ) );
                switch(alignment) {

                    case 'top': 

                        //editor.execute( new SetRotationCommand( currentCamera, new THREE.Euler( THREE.Math.degToRad(-90),0,0 ) ) );
                        //editor.execute( new SetRotationCommand( currentCamera, new THREE.Euler( 0,0,0 ) ) );
                        var flipped = currentCamera.userData.flipped;
                        if( flipped == "un-flipped" ) {

                            editor.execute( new SetRotationCommand( currentCamera, new THREE.Euler( THREE.Math.degToRad(-45), 0, 0 ) ) );

                        } else if( flipped == "top" ) {

                            editor.execute( new SetRotationCommand( currentCamera, new THREE.Euler( THREE.Math.degToRad(-135), 0, THREE.Math.degToRad(185) ) ) );

                        }
                            
                        editor.signals.sceneGraphChanged.dispatch();
                        break;
                    
                    case 'left': 

                        //editor.execute( new SetRotationCommand( currentCamera, new THREE.Euler( 0,0,0 ) ) ); 
                        editor.execute( new SetRotationCommand( currentCamera, new THREE.Euler( THREE.Math.degToRad(-135),0,0 ) ) );

                        editor.signals.sceneGraphChanged.dispatch();
                        scope.reFlipSensor(currentCamera);
                        break;
                    
                    case 'right': 

                        //editor.execute( new SetRotationCommand( currentCamera, new THREE.Euler( 0,THREE.Math.degToRad(180),0 ) ) );
                        editor.execute( new SetRotationCommand( currentCamera, new THREE.Euler( THREE.Math.degToRad(-45),0,THREE.Math.degToRad(180) ) ) );
                            
                        editor.signals.sceneGraphChanged.dispatch();
                        scope.reFlipSensor(currentCamera);
                        break;
                    
                    case 'front': 

                        //editor.execute( new SetRotationCommand( currentCamera, new THREE.Euler( 0,THREE.Math.degToRad(-90),0 ) ) );
                        editor.execute( new SetRotationCommand( currentCamera, new THREE.Euler( THREE.Math.degToRad(-90),THREE.Math.degToRad(-45), THREE.Math.degToRad(90) ) ) );
                            
                        editor.signals.sceneGraphChanged.dispatch();
                        scope.reFlipSensor(currentCamera);
                        break;
                    
                    case 'back': 

                        //editor.execute( new SetRotationCommand( currentCamera, new THREE.Euler( 0,THREE.Math.degToRad(-270),0 ) ) );
                        editor.execute( new SetRotationCommand( currentCamera, new THREE.Euler( THREE.Math.degToRad(-90),THREE.Math.degToRad(45),THREE.Math.degToRad(-90) ) ) );

                        editor.signals.sceneGraphChanged.dispatch();
                        scope.reFlipSensor(currentCamera);
                        break;

                }
                
                if(cameraRollValue!= undefined && cameraRollValue!=null && cameraRollValue!=0) {

                    if(cameraRollValue < 0){
                        currentCamera.rotateOnWorldAxis( new THREE.Vector3(0,-1,0), THREE.Math.degToRad(cameraRollValue) );
                    }
                    else if( cameraRollValue > 0 ){
                        currentCamera.rotateOnWorldAxis( new THREE.Vector3(0,1,0), THREE.Math.degToRad(-cameraRollValue) );  
                    }

                }

                var tiltChange = 0;
                if( cameraTiltValue > -45 ) {

                    tiltChange = cameraTiltValue  + 45;
                    editor.customizedRotation.tiltLidar( currentCamera, tiltChange ,'up');

                } else if ( cameraTiltValue < -45 ) {

                    tiltChange = -45 - cameraTiltValue;
                    editor.customizedRotation.tiltLidar( currentCamera, tiltChange ,'down');

                }
                
            }

        } );
    
        this.signals.sceneGraphChanged.dispatch();
    
    },
    /*MODIFIED TO INCLUDE A PROTOTYPE THAT WILL UPDATE THE CAMERA OBJECT BASED ON SETTINGS END*/

    /*MODIFIED  METHOD TO HIDE OBJECTS ON CAMERA SIMULATION START*/
    hideObjectsOnSimulation: function(objectArrayList){

        objectArrayList = objectArrayList || [];
        if (!(objectArrayList instanceof Array)) {

            console.warn('hideObjectsOnSimulation() expects instance of Array as argument!');
            console.warn('ignore the argument if you have nothing to specify');
            return;

        }
        //adding pivot element to the list
        objectArrayList.push(this.scene.children[1]); //.visible = false;

        //hiding all the camera icons and frustum
        this.scene.children.forEach(function(data) {

            if (data instanceof THREE.Camera) {

                //if(data.children[0] != undefined) data.children[0].visible = false;
                //if(data.children[1] != undefined && data.children[1].name == 'CameraFrustum') data.children[1].visible = false;
                if (data != undefined) {

                    data.traverse( function( child ) {

                        if( child.name === "CameraFrustum" ) {

                            child.visible = false;

                        }

                    } ) 

                }

            }

        });

        //hiding all the items specified in the objectArrayList.
        objectArrayList.forEach(function(data) {

            if (data != undefined) data.visible = false;

        });

        editor.signals.sceneGraphChanged.dispatch();

    },
    /*MODIFIED  METHOD TO HIDE OBJECTS ON CAMERA SIMULATION END*/

    /*MODIFIED  METHOD TO HIDE OBJECTS AFTER CAMERA SIMULATION START*/
    showObjectsAfterSimulation: function(objectArrayList){

            objectArrayList = objectArrayList || [];
            if (!(objectArrayList instanceof Array)) {

                console.warn('showObjectsAfterSimulation() expects instance of Array as argument!');
                console.warn('ignore the argument if you have nothing to specify');
                return;

            }
            //adding pivot element to the list
            objectArrayList.push(this.scene.children[1]); //.visible = true;

            //showing all the camera icons and frustum
            this.scene.children.forEach(function(data) {

                if (data instanceof THREE.Camera) {

                    //if (data.children[0] != undefined) data.children[0].visible = true;
                    //if (data.children[1] != undefined && data.children[1].name == 'CameraFrustum') data.children[1].visible = true;
                    if (data != undefined) {

                        data.traverse( function( child ) {

                            if( child.name === "CameraFrustum" ) {

                                child.visible = true;

                            }

                        } ) 

                    }

                }

            });

            //showing all the items specified in the objectArrayList.
            objectArrayList.forEach(function(data) {

                if (data != undefined) data.visible = true;

            });

            editor.signals.sceneGraphChanged.dispatch();

    },

    setBaseModel : function(){

        var baseModel = '';

        for( var i = 0; i<editor.scene.children.length; i++ ){
            editorChild = editor.scene.children[i];
            if (editorChild.type == "Group" && ( editorChild.children[0] instanceof THREE.Mesh ) && (editorChild.userData === undefined || editorChild.userData.modelType != 'not-a-base-model' )){
                baseModel = editorChild;
                break;
            }
        }
        return baseModel;
    },

    /*MODIFIED  METHOD TO SHOW OBJECTS AFTER CAMERA SIMULATION END*/

    //MODIFIED TO INCLUDE PROTOTYPE FOR BASE64 TO BLOB CONVERSION START
    /**
     * base64ToBlob() - Converts the given base64 encoded data to a Blob.
     * @param {String} - b64Data - the base64 encoded data.
     * @param {String} - contentType - expected content type of the resulting file.
     * @param {Number} - number of bytes to be processed at a time.
     * @return {Promise}  - returns a Promise with the converted Blob file.
     * @author Hari
     */
    base64ToBlob : function( b64Data, contentType, sliceSize ){
        
        return new Promise( function( resolve, reject ){
            
            contentType = contentType || '';
            sliceSize = sliceSize || 512;
        
            try{

                //converting each byte in the b64Data to a single character using the atob() method.
                var byteCharacters = atob(b64Data);
                var byteArrays = [];
            
                // a set of 'sliceSize' number of characters are processed at a time. 
                for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {

                    //slice holds a set of 'sliceSize' number of characters from the byteCharacters array.
                    var slice = byteCharacters.slice(offset, offset + sliceSize);
                
                    //converting each character in 'slice' to the ASCII code.
                    var byteNumbers = new Array(slice.length);
                    for (var i = 0; i < slice.length; i++) {

                        byteNumbers[i] = slice.charCodeAt(i);

                    }
                
                    //creating a typed array structure using the ASCII codes of the characters.
                    var byteArray = new Uint8Array(byteNumbers);
                
                    byteArrays.push(byteArray);

                }
            
                //now byteArrays holds the whole bytes converted to the ASCII character codes
                //convert the typed array to the blob
                var blob = new Blob( byteArrays, { type : contentType } );
                resolve( blob );

            }
            catch( error ){

                reject( error );

            }

        } );

    },
    /*MODIFIED TO INCLUDE PROTOTYPE FOR BASE64 TO BLOB CONVERSION END*/

    checkRaycastApplicability : function( object ){

        var isRaycastPossible = true;
        if( this.excludeNamesFromRaycast.indexOf( object.name ) != -1 ){
            isRaycastPossible = false;
            return false;
        }

        var regxArrayLen = this.excludeRegxFromRaycast.length;
        for( var i = 0; i < regxArrayLen; i++ ){
            
            if( this.excludeRegxFromRaycast[ i ].test( object.name ) ){
                
                isRaycastPossible = false;
                return false;
            
            }

        }

        if( object.userData.pointData != undefined ){
            isRaycastPossible = false;
            return false;
        }

        if( object instanceof THREE.Light ){
            isRaycastPossible = false;
            return false;
        }

        return isRaycastPossible;
        
    },

    showLengthMeasurements : function(){

        var scope = this;
        editor.scene.traverse( function( child ){

            if( child instanceof THREE.Group && child.name == "MeasurementSession" ){

                child.visible = true;

            }

        } );

        //editor.signals.sceneGraphChanged.dispatch();

    },

    resetDomeCameras: function() {

        var scope = this; 
        //Modified to align Dome camera position back to orginal value start
        editor.scene.traverse( function( child ) {

            if( child instanceof THREE.PerspectiveCamera && child.camCategory && child.camCategory === "Dome" ) {

                scope.rotateDomeCam( child );

            } 
            else if(child instanceof THREE.PerspectiveCamera && child.camCategory && child.camCategory === "PTZ"){

                scope.rotatePTZCam( child );
                
            } 
            else if(child instanceof THREE.PerspectiveCamera && child.camCategory && child.camCategory === "LiDAR" && child.sensorCategory === "Hitachi LFOM5") {
                
                scope.rotateLiDAR( child );
            }
        } )
        //Modified to align Dome camera position back to orginal value end
    },
    rotatePTZCam : function( child ){

        var currentCamera = child;
        var cameraTiltValue = currentCamera.userData.tiltRotationValue;
        var cameraPanValue = currentCamera.userData.panRotationValue;
        var cameraRollValue = currentCamera.userData.rollRotationValue;

        editor.execute( new SetRotationCommand( currentCamera, new THREE.Euler( 0, 0, 0 ) ) );
        if( cameraTiltValue!= undefined && cameraTiltValue!= null && cameraTiltValue!=0 ) {

            editor.customizedRotation.tiltPTZCamera(currentCamera,cameraTiltValue,'down')

        }

        if(cameraPanValue!=undefined && cameraPanValue!=null && cameraPanValue!=0) {

            if( cameraPanValue < 0 ){
                editor.customizedRotation.panPTZCamera(currentCamera,Math.abs(cameraPanValue),'left')
            }
            else if( cameraPanValue > 0  ){
                editor.customizedRotation.panPTZCamera(currentCamera,cameraPanValue,'right')
            }

        }
        
        if(cameraRollValue!= undefined && cameraRollValue!=null && cameraRollValue!=0) {

            if(cameraRollValue < 0){
                editor.customizedRotation.rollPTZCamera(currentCamera,Math.abs(cameraRollValue),'left');
            }
            else if( cameraRollValue > 0 ){
                editor.customizedRotation.rollPTZCamera(currentCamera,cameraRollValue,'right');   
            }

        }
    },
    

    rotateLiDAR : function( child ){

        var currentCamera = child;
        var cameraTiltValue = currentCamera.userData.tiltRotationValue;
        var cameraPanValue = currentCamera.userData.panRotationValue;
        var cameraRollValue = currentCamera.userData.rollRotationValue;

        //editor.execute( new SetRotationCommand( currentCamera, new THREE.Euler( 0, 0, 0 ) ) );
        var alignment = currentCamera.userData.alignment;

        //editor.execute( new SetRotationCommand( currentCamera, new THREE.Euler( 0, 0, 0 ) ) );
        switch(alignment) {

            case 'top': 

                //editor.execute( new SetRotationCommand( currentCamera, new THREE.Euler( THREE.Math.degToRad(-90),0,0 ) ) );
                //editor.execute( new SetRotationCommand( currentCamera, new THREE.Euler( THREE.Math.degToRad(-45), 0, 0 ) ) ); //Orginal
                var flipped = currentCamera.userData.flipped;
                if( flipped == "un-flipped" ) {

                    editor.execute( new SetRotationCommand( currentCamera, new THREE.Euler( THREE.Math.degToRad(-45), 0, 0 ) ) );

                } else if( flipped == "top" ) {

                    editor.execute( new SetRotationCommand( currentCamera, new THREE.Euler( THREE.Math.degToRad(-135), 0, THREE.Math.degToRad(185) ) ) );

                }
                    
                editor.signals.sceneGraphChanged.dispatch();
                break;
            
            case 'left': 

                //editor.execute( new SetRotationCommand( currentCamera, new THREE.Euler( 0,0,0 ) ) ); 
                editor.execute( new SetRotationCommand( currentCamera, new THREE.Euler( THREE.Math.degToRad(-135),0,0 ) ) );

                editor.signals.sceneGraphChanged.dispatch();
                this.reFlipSensor(currentCamera);
                break;
            
            case 'right': 

                //editor.execute( new SetRotationCommand( currentCamera, new THREE.Euler( 0,THREE.Math.degToRad(180),0 ) ) );
                editor.execute( new SetRotationCommand( currentCamera, new THREE.Euler( THREE.Math.degToRad(-45),0,THREE.Math.degToRad(180) ) ) );
                    
                editor.signals.sceneGraphChanged.dispatch();
                this.reFlipSensor(currentCamera);
                break;
            
            case 'front': 

                //editor.execute( new SetRotationCommand( currentCamera, new THREE.Euler( 0,THREE.Math.degToRad(-90),0 ) ) );
                editor.execute( new SetRotationCommand( currentCamera, new THREE.Euler( THREE.Math.degToRad(-90),THREE.Math.degToRad(-45), THREE.Math.degToRad(90) ) ) );
                    
                editor.signals.sceneGraphChanged.dispatch();
                this.reFlipSensor(currentCamera);
                break;
            
            case 'back': 

                //editor.execute( new SetRotationCommand( currentCamera, new THREE.Euler( 0,THREE.Math.degToRad(-270),0 ) ) );
                editor.execute( new SetRotationCommand( currentCamera, new THREE.Euler( THREE.Math.degToRad(-90),THREE.Math.degToRad(45),THREE.Math.degToRad(-90) ) ) );

                editor.signals.sceneGraphChanged.dispatch();
                this.reFlipSensor(currentCamera);
                break;

        }
        
        var syncRotationLiDAR = new Promise( function( resolve, reject ){
            /*if( cameraTiltValue!= undefined && cameraTiltValue!= null && cameraTiltValue!=0 ) {
                
                    editor.customizedRotation.tiltLidar(currentCamera,cameraTiltValue,'up');

            }*/
            var tiltChange = 0;
            if( cameraTiltValue > -45 ) {

                tiltChange = cameraTiltValue  + 45;
                editor.customizedRotation.tiltLidar( currentCamera, tiltChange ,'up');

            } else if ( cameraTiltValue < -45 ) {

                tiltChange = -45 - cameraTiltValue;
                editor.customizedRotation.tiltLidar( currentCamera, tiltChange ,'down');

            }
            resolve();
        } );
        
        syncRotationLiDAR.then( function(){
            
            
            if(cameraRollValue!= undefined && cameraRollValue!=null && cameraRollValue!=0) {

                if(cameraRollValue < 0){
                    currentCamera.rotateOnWorldAxis( new THREE.Vector3(0,-1,0), THREE.Math.degToRad(cameraRollValue) );
                }
                else if( cameraRollValue > 0 ){
                    currentCamera.rotateOnWorldAxis( new THREE.Vector3(0,1,0), THREE.Math.degToRad(-cameraRollValue) );  
                }

            }

        } );
    },

    rotateDomeCam : function( child ){

        var currentCamera = child;
        var cameraTiltValue = currentCamera.userData.tiltRotationValue;
        var cameraPanValue = currentCamera.userData.panRotationValue;
        var cameraRollValue = currentCamera.userData.rollRotationValue;
        var alignment = currentCamera.userData.alignment;

        switch(alignment) {

            case 'top': 

                editor.execute( new SetRotationCommand( currentCamera, new THREE.Euler( THREE.Math.degToRad(-90),0,0 ) ) );
                    

                        editor.signals.sceneGraphChanged.dispatch();
                        break;

                    
                    case 'left': 

                        editor.execute( new SetRotationCommand( currentCamera, new THREE.Euler( 0,0,0 ) ) ); 
                        

                        editor.signals.sceneGraphChanged.dispatch();
                        break;

                    
                    case 'right': 

                        editor.execute( new SetRotationCommand( currentCamera, new THREE.Euler( 0,THREE.Math.degToRad(180),0 ) ) );
                            

                        editor.signals.sceneGraphChanged.dispatch();
                        break;

                    
                    case 'front': 

                        editor.execute( new SetRotationCommand( currentCamera, new THREE.Euler( 0,THREE.Math.degToRad(-90),0 ) ) );
                            

                        editor.signals.sceneGraphChanged.dispatch();
                        break;

                    
                    case 'back': 

                        editor.execute( new SetRotationCommand( currentCamera, new THREE.Euler( 0,THREE.Math.degToRad(-270),0 ) ) );
                        

                        editor.signals.sceneGraphChanged.dispatch();
                        break;

                    

                }
                if( cameraTiltValue!= undefined && cameraTiltValue!= null && cameraTiltValue!=0 ) {

                    if( cameraTiltValue < 0 ) {

                        editor.customizedRotation.tiltDomeCameraDown(currentCamera,Math.abs( currentCamera.userData.tiltRotationValue) );

                    } else if( cameraTiltValue > 0 ) {

                        editor.customizedRotation.tiltDomeCameraUp(currentCamera,currentCamera.userData.tiltRotationValue);

                    }

                }  

                if(cameraPanValue!=undefined && cameraPanValue!=null && cameraPanValue!=0) {

                    if( cameraPanValue < 0 ){
                        editor.customizedRotation.panDomeCameraLeft(currentCamera,Math.abs(cameraPanValue));
                    }
                    else if( cameraPanValue > 0  ){
                        editor.customizedRotation.panDomeCameraRight(currentCamera,cameraPanValue)
                    }

                }
                
                if(cameraRollValue!= undefined && cameraRollValue!=null && cameraRollValue!=0) {

                    if(cameraRollValue < 0){
                        editor.customizedRotation.rollDomeCameraLeft(currentCamera,Math.abs(cameraRollValue));
                    }
                    else if( cameraRollValue > 0 ){
                        editor.customizedRotation.rollDomeCameraRight(currentCamera,cameraRollValue);   
                    }

        }
    },
    
    hideLengthMeasurements : function(){

        var scope = this;
        editor.scene.traverse( function( child ){

            if( child instanceof THREE.Group && child.name == "MeasurementSession" ){

                child.visible = false;

            }

        } );

        //editor.signals.sceneGraphChanged.dispatch();

    },

    showAreaMeasurements : function(){

        var scope = this;
        editor.scene.traverse( function( child ){

            if( child instanceof THREE.Group && child.name == "AreaMeasurementSession" ){

                child.visible = true;

            }

        } );

        //editor.signals.sceneGraphChanged.dispatch();

    },

    hideAreaMeasurements : function(){

        var scope = this;
        editor.scene.traverse( function( child ){

            if( child instanceof THREE.Group && child.name == "AreaMeasurementSession" ){

                child.visible = false;

            }

        } );

        //editor.signals.sceneGraphChanged.dispatch();

    },

    show2DLineDrawings : function(){

        var scope = this;
        editor.scene.traverse( function( child ){

            if( child instanceof THREE.Group && child.name == "TwoDMeasurementSession" ){

                child.visible = true;

            }

        } );

    },

    hide2DLineDrawings : function(){

        var scope = this;
        editor.scene.traverse( function( child ){

            if( child instanceof THREE.Group && child.name == "TwoDMeasurementSession" ){

                child.visible = false;

            }

        } );

    },

    showNetworkingCables : function(){

        editor.scene.traverse( function( child ){

            if( child instanceof THREE.Group && child.name == "NetworkCablingSession"){
            
                child.visible = true;

            }  

        } );

    },

    hideNetworkingCables : function(){

        editor.scene.traverse( function( child ){

            if( child instanceof THREE.Group && child.name == "NetworkCablingSession"){
            
                child.visible = false;

            }  

        } );

    },

    scaleAllIcons : function(){
        
        if( this.SCALE_LIMIT != null && this.SCALE_LIMIT!= undefined && editor.camera.position.length() <= this.SCALE_LIMIT ){
            
            var scaleFactorPoi = 13, scale;
            var scaleVectorPoi = new THREE.Vector3();
            for(var i=0; i<editor.allPointOfinterest.length; i++){

                scale = scaleVectorPoi.subVectors( this.allPointOfinterest[ i ].position, this.camera.position ).length() / scaleFactorPoi;
                this.allPointOfinterest[i].scale.set(scale, scale, 1);
            }
            //Modified to add camera icon auto scaling with zoom start
            var len = this.sceneCameras.length;
            var scaleVector = new THREE.Vector3();
            var scaleFactor = 7, scale;
            for( var i = 0; i < len; i++ ){

                var sprite;
                this.sceneCameras[ i ].traverse( function( child ){
                    if(( child instanceof THREE.Sprite ) && ( child.name == "cameraHelperIcon" )){
                        sprite = child;
                    }
                } );
                if( !( ( sprite instanceof THREE.Sprite ) && ( sprite.name == "cameraHelperIcon" ) ) ) continue;

                if( sprite.parent instanceof THREE.Mesh && sprite.parent.name == "cameraHelperIcon" ){
                    scaleFactor = 30;
                    scale = scaleVector.subVectors( this.sceneCameras[ i ].position, this.camera.position ).length() / scaleFactor;
                    sprite.parent.scale.set(scale, scale, 1);
                }
                else{
                    if( this.sceneCameras[ i ].camCategory == "LiDAR" ){
						scaleFactor = 2;
					}
					else{
						scaleFactor = 7;
					}
                    scale = scaleVector.subVectors( this.sceneCameras[ i ].position, this.camera.position ).length() / scaleFactor;
                    sprite.scale.set(scale, scale, 1);
                }
                
                

            }
            //Modified to add camera icon auto scaling with zoom end

            //Modified to add junction box icon auto scaling with zoom start
            var len = this.junctionBoxBadges.length;
            
            var scaleVector = new THREE.Vector3();
            var scaleFactor = 20, scale;
            for( var i = 0; i < len; i++ ){

                var sprite = this.junctionBoxBadges[ i ];
                
                scale = scaleVector.subVectors( this.junctionBoxBadges[ i ].position, this.camera.position ).length() / scaleFactor;
                sprite.scale.set(scale, scale, 1);

            }
            //Modified to add junction box icon auto scaling with zoom end

            //Modified to autoscale length badge measurement icons with respect to zoom level start
            var lBadgeScaleVector = new THREE.Vector3();
            var lBadgeScaleFactor = 7, lMarkerScaleFactor = 13;
            var lengthBadgesLen = this.lengthBadges.length, lengthMarkersLen = this.lengthEndMarkers.length, lBadgeScale, lMarkerScale;
            if( this.msrmntsShowHideToggle === true || this.isMeasuring === true ){

                for( var j = 0; j < lengthBadgesLen; j++ ){
                    
                    lBadgeScale = lBadgeScaleVector.subVectors( this.lengthBadges[ j ].position, this.camera.position ).length() / lBadgeScaleFactor;
                    this.lengthBadges[ j ].scale.set( lBadgeScale, lBadgeScale, 1 );

                }

                lengthMarkersLen = this.lengthEndMarkers.length;
                for( var j = 0; j < lengthMarkersLen; j++ ){
                    
                    lMarkerScale = lBadgeScaleVector.subVectors( this.lengthEndMarkers[ j ].position, this.camera.position ).length() / lMarkerScaleFactor;
                    this.lengthEndMarkers[ j ].scale.set( lMarkerScale, lMarkerScale, lMarkerScale );

                }

            }
            //Modified to autoscale length badge measurement icons with respect to zoom level end

            //Modified to autoscale area badge measurement icons with respect to zoom level start
            var aBadgeScaleVector = new THREE.Vector3();
            var aBadgeScaleFactor = 7, aMarkerScaleFactor = 13;
            var aBadgesLen = this.areaBadges.length, aBadgeScale, aMarkersLen = this.areaEndMarkers.length, aMarkerScale;
            if( this.msrmntsShowHideToggle === true || this.isAreaMeasuring === true ){

                for( var k = 0; k < aBadgesLen; k++ ){
                    
                    aBadgeScale = aBadgeScaleVector.subVectors( this.areaBadges[ k ].position, this.camera.position ).length() / aBadgeScaleFactor;
                    this.areaBadges[ k ].scale.set( aBadgeScale, aBadgeScale, 1 );

                }

                for( var k = 0; k < aMarkersLen; k++ ){
                    
                    aMarkerScale = aBadgeScaleVector.subVectors( this.areaEndMarkers[ k ].position, this.camera.position ).length() / aMarkerScaleFactor;
                    this.areaEndMarkers[ k ].scale.set( aMarkerScale, aMarkerScale, aMarkerScale );

                }

            }
            //Modified to autoscale area badge measurement icons with respect to zoom level end

            //Modified to autoscale Camera Reference icons with respect to zoom level start
            var lenRef = this.allReferencePoint.length;
            var scaleVectorRef = new THREE.Vector3();
            var scaleFactorRef = 20, scale;
            for( var i = 0; i < lenRef; i++ ){

                scale = scaleVectorRef.subVectors( this.allReferencePoint[ i ].position, this.camera.position ).length() / scaleFactorRef;
                this.allReferencePoint[ i ].scale.set(scale, scale, 1);
                
            }
            //Modified to autoscale Camera Reference icons with respect to zoom level end
            
            //Modified to auto scale network marker and badges start
            var nwBadgeScaleVector = new THREE.Vector3();
            var nwBadgeScaleFactor = 7, nwMarkerScaleFactor = 18;
            var nwBadgesLen = this.nwBadges.length, nwBadgeScale, nwMarkersLen = this.nwMarkers.length, nwMarkerScale;
            //if( this.msrmntsShowHideToggle === true || this.isAreaMeasuring === true ){

                for( var k = 0; k < nwBadgesLen; k++ ){

                    nwBadgeScale = nwBadgeScaleVector.subVectors( this.nwBadges[ k ].position, this.camera.position ).length() / nwBadgeScaleFactor;
                    this.nwBadges[ k ].scale.set( nwBadgeScale, nwBadgeScale, 1 );

                }

                for( var k = 0; k < nwMarkersLen; k++ ){
                    
                    nwMarkerScale = nwBadgeScaleVector.subVectors( this.nwMarkers[ k ].position, this.camera.position ).length() / nwMarkerScaleFactor;
                    this.nwMarkers[ k ].scale.set( nwMarkerScale, nwMarkerScale, nwMarkerScale );

                }

            //}
            //Modified to auto scale network marker and badges start

            //Modified to autoscale Reference Camera Badges start 
                
            var refCamBadgeScaleVector = new THREE.Vector3();
            var refCamBadgeScaleFactor = 7;
            var refBadgesLen = this.refCamBadge.length, refCamBadgeScale;

                for( var k = 0; k < refBadgesLen; k++ ){

                    refCamBadgeScale = refCamBadgeScaleVector.subVectors( this.refCamBadge[ k ].position, this.camera.position ).length() / refCamBadgeScaleFactor;
                    this.refCamBadge[ k ].scale.set( refCamBadgeScale, refCamBadgeScale, 1 );

                }
            
            //Modified to autoscale Reference Camera Badges end
            this.signals.sceneGraphChanged.dispatch();

        } else if( this.SCALE_LIMIT != null && this.SCALE_LIMIT!= undefined && this.camera.position.length() > editor.SCALE_LIMIT ){
            
            var maxCamPosition = new THREE.Vector3( this.SCALE_LIMIT/Math.sqrt(3), this.SCALE_LIMIT/Math.sqrt(3), this.SCALE_LIMIT/Math.sqrt(3) );
            var scaleFactorPoi = 13, scale;
            var scaleVectorPoi = new THREE.Vector3();
            for(var i=0; i<editor.allPointOfinterest.length; i++){

                scale = scaleVectorPoi.subVectors( this.allPointOfinterest[ i ].position, maxCamPosition ).length() / scaleFactorPoi;
                this.allPointOfinterest[ i ].scale.set(scale, scale, 1);
            }
            //Modified to autoscale length badge measurement icons with respect to zoom level start
            var lBadgeScaleVector = new THREE.Vector3();
            var lBadgeScaleFactor = 7, lMarkerScaleFactor = 13;
            var lengthBadgesLen = this.lengthBadges.length, lengthMarkersLen = this.lengthEndMarkers.length, lBadgeScale, lMarkerScale;
            if( this.msrmntsShowHideToggle === true || this.isMeasuring === true ){

                for( var j = 0; j < lengthBadgesLen; j++ ){
                    
                    lBadgeScale = lBadgeScaleVector.subVectors( this.lengthBadges[ j ].position, maxCamPosition ).length() / lBadgeScaleFactor;
                    this.lengthBadges[ j ].scale.set( lBadgeScale, lBadgeScale, 1 );

                }

            }
            //Modified to autoscale length badge measurement icons with respect to zoom level end

            //Modified to autoscale area badge measurement icons with respect to zoom level start
            var aBadgeScaleVector = new THREE.Vector3();
            var aBadgeScaleFactor = 7, aMarkerScaleFactor = 13;
            var aBadgesLen = this.areaBadges.length, aBadgeScale, aMarkersLen = this.areaEndMarkers.length, aMarkerScale;
            if( this.msrmntsShowHideToggle === true || this.isAreaMeasuring === true ){

                for( var k = 0; k < aBadgesLen; k++ ){
                    
                    aBadgeScale = aBadgeScaleVector.subVectors( this.areaBadges[ k ].position, maxCamPosition ).length() / aBadgeScaleFactor;
                    this.areaBadges[ k ].scale.set( aBadgeScale, aBadgeScale, 1 );

                }

            }
            //Modified to autoscale area badge measurement icons with respect to zoom level end

            //Modified to auto scale network marker and badges start
            var nwBadgeScaleVector = new THREE.Vector3();
            var nwBadgeScaleFactor = 7, nwMarkerScaleFactor = 18;
            var nwBadgesLen = this.nwBadges.length, nwBadgeScale, nwMarkersLen = this.nwMarkers.length, nwMarkerScale;

                for( var k = 0; k < nwBadgesLen; k++ ){

                    nwBadgeScale = nwBadgeScaleVector.subVectors( this.nwBadges[ k ].position, maxCamPosition ).length() / nwBadgeScaleFactor;
                    this.nwBadges[ k ].scale.set( nwBadgeScale, nwBadgeScale, 1 );

                }

            //Modified to auto scale network marker and badges start

            //Modified to autoscale Reference Camera Badges start 
                
            var refCamBadgeScaleVector = new THREE.Vector3();
            var refCamBadgeScaleFactor = 7;
            var refBadgesLen = this.refCamBadge.length, refCamBadgeScale;

                for( var k = 0; k < refBadgesLen; k++ ){

                    refCamBadgeScale = refCamBadgeScaleVector.subVectors( this.refCamBadge[ k ].position, maxCamPosition ).length() / refCamBadgeScaleFactor;
                    this.refCamBadge[ k ].scale.set( refCamBadgeScale, refCamBadgeScale, 1 );

                }
            
            //Modified to autoscale Reference Camera Badges end

            //Modified to add camera icon auto scaling with zoom start
            var len = this.sceneCameras.length;
            var scaleVector = new THREE.Vector3();
            var scaleFactor = 7, scale;
            for( var i = 0; i < len; i++ ){

                var sprite;
                this.sceneCameras[ i ].traverse( function( child ){
                    if(( child instanceof THREE.Sprite ) && ( child.name = "cameraHelperIcon" )){
                        sprite = child;
                    }
                } );

                if( !( ( sprite instanceof THREE.Mesh ) && ( sprite.name = "cameraHelperIcon" ) ) ) continue;
                if( sprite.parent instanceof THREE.Mesh && sprite.parent.name == "cameraHelperIcon" ){
                    scaleFactor = 30;
                    scale = scaleVector.subVectors( this.sceneCameras[ i ].position, maxCamPosition ).length() / scaleFactor;
                    sprite.parent.scale.set(scale, scale, 1);
                }
                else{
                    if( this.sceneCameras[ i ].camCategory == "LiDAR" ){
						scaleFactor = 2;
					}
					else{
						scaleFactor = 7;
					}
                    scale = scaleVector.subVectors( this.sceneCameras[ i ].position, maxCamPosition ).length() / scaleFactor;
                    sprite.scale.set(scale, scale, 1);
                }
                

            }
            //Modified to add camera icon auto scaling with zoom end

            //Modified to autoscale Camera Reference icons with respect to zoom level start
            var lenRef = this.allReferencePoint.length;
            var scaleVectorRef = new THREE.Vector3();
            var scaleFactorRef = 20, scale;
            for( var i = 0; i < lenRef; i++ ){

                scale = scaleVectorRef.subVectors( this.allReferencePoint[ i ].position, maxCamPosition ).length() / scaleFactorRef;
                this.allReferencePoint[ i ].scale.set(scale, scale, 1);
                
            }
            //Modified to autoscale Camera Reference icons with respect to zoom level end

            this.signals.sceneGraphChanged.dispatch();
		}

    },

    orthographicScale : function(){

        var scope = this;
        var cameraToOriginLength = scope.camera.position.clone();
        var zoom = scope.camera.zoom;
        var a = new THREE.Vector3( zoom,zoom,zoom );
        var divideRatio = cameraToOriginLength.divide( a );

        var scaleFactorPoi = 13, scale;
        var scaleVectorPoi = new THREE.Vector3();
        for(var i=0; i<editor.allPointOfinterest.length; i++){
            scale = scaleVectorPoi.subVectors( this.allPointOfinterest[ i ].position, this.camera.position ).length() / scaleFactorPoi;
            maxScalePoi = scaleVectorPoi.subVectors( scope.allPointOfinterest[ i ].position, scope.camera.position ).length() / scaleFactorPoi;
            if( scale < maxScalePoi )
                scope.allPointOfinterest[ i ].scale.set(scale, scale, 1);
            else  
                scope.allPointOfinterest[ i ].scale.set(maxScalePoi, maxScalePoi, 1); 
        }
        //Modified to autoscale Camera Reference icons with respect to zoom level start
        var lenRef = scope.allReferencePoint.length;
        var scaleVectorRef = new THREE.Vector3();
        var scaleFactorRef = 27, scale;
        for( var i = 0; i < lenRef; i++ ){

            scale = scaleVectorRef.subVectors( scope.allReferencePoint[ i ].position, divideRatio ).length() / scaleFactorRef;
            maxScale = scaleVectorRef.subVectors( scope.allReferencePoint[ i ].position, scope.camera.position ).length() / scaleFactorRef;
            if( scale < maxScale ){

                scope.allReferencePoint[ i ].scale.set(scale, scale, scale);

            }
            else{

                scope.allReferencePoint[ i ].scale.set(maxScale, maxScale, maxScale);

            }
            
        }
        //Modified to autoscale Camera Reference icons with respect to zoom level end

        //Modified to autoscale junction box icons with respect to zoom level start
        var lenRef = scope.junctionBoxBadges.length;
        var scaleVectorRef = new THREE.Vector3();
        var scaleFactorRef = 20, scale;
        for( var i = 0; i < lenRef; i++ ){

            scale = scaleVectorRef.subVectors( scope.junctionBoxBadges[ i ].position, divideRatio ).length() / scaleFactorRef;
            maxScale = scaleVectorRef.subVectors( scope.junctionBoxBadges[ i ].position, scope.camera.position ).length() / scaleFactorRef;
            if( scale < maxScale ){

                scope.junctionBoxBadges[ i ].scale.set(scale, scale, scale);

            }
            else{

                scope.junctionBoxBadges[ i ].scale.set(maxScale, maxScale, maxScale);

            }
            
        }
        //Modified to autoscale junction box icons with respect to zoom level end



        //Modified to autoscale 2d measurement badge icons with respect to zoom level start
        var lBadgeScaleVector = new THREE.Vector3();
        var twoDBadgeScaleFactor = 6, twoDMarkerScaleFactor = 35;
        var twoDBadgesLen = editor.twoDMeasureBadges.length, lengthMarkersLen = editor.twoDMeasureMarkers.length, lBadgeScale, twoDMarkerScale;

        if( editor.isTwoDMeasuring === true || editor.twoDDrawingsShowHideToggle === true ) {

            for( var j = 0; j < lengthMarkersLen; j++ ){

                var scaleFactorRef = 35;
                var scaleVectorRef = new THREE.Vector3();
                scale = scaleVectorRef.subVectors( scope.twoDMeasureMarkers[ i ].position, divideRatio ).length() / scaleFactorRef;
                maxScale = scaleVectorRef.subVectors( scope.twoDMeasureMarkers[ i ].position, scope.camera.position ).length() / scaleFactorRef;
                if( scale < maxScale ){
                    
                    scope.twoDMeasureMarkers[ j ].scale.set(scale, scale, scale);

                } else {
                    
                    scope.twoDMeasureMarkers[ j ].scale.set(maxScale, maxScale, maxScale);

                }
                //twoDMarkerScale = lBadgeScaleVector.subVectors( scope.twoDMeasureMarkers[ j ].position, divideRatio ).length() / twoDMarkerScaleFactor;
                //scope.twoDMeasureMarkers[ j ].scale.set( twoDMarkerScale, twoDMarkerScale, twoDMarkerScale );

            }

            for( var j = 0; j < twoDBadgesLen; j++ ){

                var scaleFactorRef = 6;
                var scaleVectorRef = new THREE.Vector3();
                scale = scaleVectorRef.subVectors( scope.twoDMeasureBadges[ i ].position, divideRatio ).length() / scaleFactorRef;
                maxScale = scaleVectorRef.subVectors( scope.twoDMeasureBadges[ i ].position, scope.camera.position ).length() / scaleFactorRef;
                if( scale < maxScale ){
                    
                    scope.twoDMeasureBadges[ j ].scale.set(scale, scale, scale);

                } else {
                    
                    scope.twoDMeasureBadges[ j ].scale.set(maxScale, maxScale, maxScale);

                }
                 
                //twoDBadgeScale = lBadgeScaleVector.subVectors( scope.twoDMeasureBadges[ j ].position, divideRatio ).length() / twoDBadgeScaleFactor;
                //scope.twoDMeasureBadges[ j ].scale.set( twoDBadgeScale, twoDBadgeScale, twoDBadgeScale );

            }

        }

        //Modified to autoscale 2d measurement badge icons with respect to zoom level end

        //Modified to autoscale area badge measurement icons with respect to zoom level start
        var lBadgeScaleVector = new THREE.Vector3();
        var lMarkerScaleFactor = 30;
        var lengthMarkersLen = scope.lengthEndMarkers.length, lMarkerScale;
        if( scope.msrmntsShowHideToggle === true || scope.isMeasuring === true ){

            lengthMarkersLen = scope.lengthEndMarkers.length;
            for( var j = 0; j < lengthMarkersLen; j++ ){
                
                lMarkerScale = lBadgeScaleVector.subVectors( scope.lengthEndMarkers[ j ].position, divideRatio ).length() / lMarkerScaleFactor;
                scope.lengthEndMarkers[ j ].scale.set( lMarkerScale, lMarkerScale, lMarkerScale );
                
            }

        }
        //Modified to autoscale area badge measurement icons with respect to zoom level end

        //Modified to autoscale area badge measurement icons with respect to zoom level start
        var aBadgeScaleVector = new THREE.Vector3();
        var aMarkerScaleFactor = 30;
        var aMarkersLen = scope.areaEndMarkers.length,aMarkerScale;

        if( scope.msrmntsShowHideToggle === true || scope.isAreaMeasuring === true ){

            for( var k = 0; k < aMarkersLen; k++ ){
                        
                aMarkerScale = aBadgeScaleVector.subVectors( scope.areaEndMarkers[ k ].position, divideRatio ).length() / aMarkerScaleFactor;
                scope.areaEndMarkers[ k ].scale.set( aMarkerScale, aMarkerScale, aMarkerScale );
    
            }
        }

        //Modified to auto scale network marker and badges start
        var nwBadgeScaleVector = new THREE.Vector3();
        var nwMarkerScaleFactor = 30;
        var nwMarkersLen = scope.nwMarkers.length, nwMarkerScale;

        for( var k = 0; k < nwMarkersLen; k++ ){
            
            nwMarkerScale = nwBadgeScaleVector.subVectors( scope.nwMarkers[ k ].position, divideRatio ).length() / nwMarkerScaleFactor;
            scope.nwMarkers[ k ].scale.set( nwMarkerScale, nwMarkerScale, nwMarkerScale );
            
        }
        //Modified to auto scale network marker and badges start

        //Modified to auto scale camera icons start
        var lenCam = scope.sceneCameras.length;
        var scaleVectorRef = new THREE.Vector3();
        var scaleFactorRef = 7, scale;

        for( var i = 0; i < lenCam; i++ ){

            var sprite;
                this.sceneCameras[ i ].traverse( function( child ){
                    if(( child instanceof THREE.Sprite ) && ( child.name = "cameraHelperIcon" )){
                        sprite = child;
                    }
                } );
            
            if( !( ( sprite instanceof THREE.Sprite ) && ( sprite.name = "cameraHelperIcon" ) ) ) continue;
            if( sprite.parent instanceof THREE.Mesh && sprite.parent.name == "cameraHelperIcon" ){
                scaleFactorRef = 30;
            }
            else{
                if( this.sceneCameras[ i ].camCategory == "LiDAR" ){
                    scaleFactorRef = 3;
                }
                else{
                    scaleFactorRef = 7;
                }         
            }
            scale = scaleVectorRef.subVectors( scope.sceneCameras[ i ].position, divideRatio ).length() / scaleFactorRef;
            maxScale = scaleVectorRef.subVectors( scope.sceneCameras[ i ].position, scope.camera.position ).length() / scaleFactorRef;

            if( scale < maxScale ){

                if( sprite.parent instanceof THREE.Mesh && sprite.parent.name == "cameraHelperIcon" ){
                    sprite.parent.scale.set(scale, scale, 1);
                }
                else{
                    sprite.scale.set(scale, scale, 1);
                }
                

            }
            else{

                if( sprite.parent instanceof THREE.Mesh && sprite.parent.name == "cameraHelperIcon" ){
                    sprite.parent.scale.set(maxScale, maxScale, 1);
                }
                else{
                    sprite.scale.set(maxScale, maxScale, 1);
                }

            }
            
        }
        //Modified to auto scale camera icons end

        //Modified to auto scale sensor icons end
        var sensorScaleRef = 20;
        var sensorScaleVectorRef;
        var sensorScale;
        var sensorMaxScale
        editor.scene.traverse( function(child){

			if( child instanceof THREE.Sprite && child.userData && child.userData.sensorData ){
                
                sensorScaleVectorRef = new THREE.Vector3();
                sensorScale = sensorScaleVectorRef.subVectors( child.position, divideRatio ).length() / sensorScaleRef;
                sensorMaxScale = sensorScaleVectorRef.subVectors( child.position, scope.camera.position ).length() / sensorScaleRef;
                
                if( sensorScale < sensorMaxScale ){

                    child.scale.set( sensorScale, sensorScale, 1 )
    
                }
                else{
    
                    child.scale.set( sensorMaxScale, sensorMaxScale, 1 )
                    
                }
                
			}
        } )


        //Modified to auto scale sensor icons end

    },

    scaleLengthmarker( marker ){

        var scope = this;
        var cameraToOriginLength = scope.camera.position.clone();
        var zoom = scope.camera.zoom;
        var a = new THREE.Vector3( zoom,zoom,zoom );
        var divideRatio = cameraToOriginLength.divide( a );

        var lBadgeScaleVector = new THREE.Vector3();
        var lMarkerScaleFactor = 30;
        var lMarkerScale;
                
        lMarkerScale = lBadgeScaleVector.subVectors( marker.position, divideRatio ).length() / lMarkerScaleFactor;
        marker.scale.set( lMarkerScale, lMarkerScale, lMarkerScale );
        scope.signals.sceneGraphChanged.dispatch();

    },

    scaleTwoDMarker( marker ){

        var scope = this;
        var cameraToOriginLength = scope.camera.position.clone();
        var zoom = scope.camera.zoom;
        var a = new THREE.Vector3( zoom,zoom,zoom );
        var divideRatio = cameraToOriginLength.divide( a );

        var lBadgeScaleVector = new THREE.Vector3();
        var lMarkerScaleFactor = 35;
        var lMarkerScale;
                
        lMarkerScale = lBadgeScaleVector.subVectors( marker.position, divideRatio ).length() / lMarkerScaleFactor;
        marker.scale.set( lMarkerScale, lMarkerScale, lMarkerScale );
        scope.signals.sceneGraphChanged.dispatch();

    },

    scaleLengthmarkerThreeDView( marker ){

        var scope = this;
        if( scope.isFloorplanViewActive === false && scope.SCALE_LIMIT != null && scope.SCALE_LIMIT!= undefined && scope.camera.position.length() <= scope.SCALE_LIMIT ){

            var lMarkerScaleVector = new THREE.Vector3();
            var lMarkerScaleFactor = 13;
            var lMarkerScale = lMarkerScaleVector.subVectors( marker.position, scope.camera.position ).length() / lMarkerScaleFactor;
            marker.scale.set( lMarkerScale, lMarkerScale, lMarkerScale );

        } 
        else if( scope.isFloorplanViewActive === false && scope.SCALE_LIMIT != null && scope.SCALE_LIMIT!= undefined && scope.camera.position.length() > scope.SCALE_LIMIT ){
        
            
            var maxCamPosition = new THREE.Vector3( scope.SCALE_LIMIT/Math.sqrt(3), scope.SCALE_LIMIT/Math.sqrt(3), scope.SCALE_LIMIT/Math.sqrt(3) );
                        
            var lMarkerScaleVector = new THREE.Vector3();
            var lMarkerScaleFactor = 13;
            var lMarkerScale = lMarkerScaleVector.subVectors( marker.position, maxCamPosition ).length() / lMarkerScaleFactor;
            marker.scale.set( lMarkerScale, lMarkerScale, lMarkerScale );   

            
        }

    },

    scaleBadgeFloorPlanView( curMeasurementBadge ){

        var scope = this;
        if( scope.currentScaleFactor!= undefined && scope.currentScaleFactor!= null && !( scope.currentScaleFactor.equals( scope.zeroVector ) ) ){

            curMeasurementBadge.scale.set( scope.currentScaleFactor.x, scope.currentScaleFactor.y, 1 );
            curMeasurementBadge.userData.badgeScaledValue = scope.currentScaleFactor.clone();

        }

    },

    scaleTwoDBadgeFloorPlanView( curMeasurementBadge ){

        var scope = this;
        var cameraToOriginLength = scope.camera.position.clone();
        var zoom = scope.camera.zoom;
        var a = new THREE.Vector3( zoom,zoom,zoom );
        var divideRatio = cameraToOriginLength.divide( a );

        var twoDBadgeScaleVector = new THREE.Vector3();
        var twoDBadgeScaleFactor = 6;
        var twoDBadgeScale;
                
        twoDBadgeScale = twoDBadgeScaleVector.subVectors( curMeasurementBadge.position, divideRatio ).length() / twoDBadgeScaleFactor;
        curMeasurementBadge.scale.set( twoDBadgeScale, twoDBadgeScale, twoDBadgeScale );
        scope.signals.sceneGraphChanged.dispatch();

    },

    scaleBadgesThreeDView( curMeasurementBadge ){

        var scope = this;
        if( scope.SCALE_LIMIT != null && scope.SCALE_LIMIT!= undefined && scope.camera.position.length() <= scope.SCALE_LIMIT ){

            var lbadgeScaleVector = new THREE.Vector3();
            var lbadgeScaleFactor = 7;
            var lbadgeScale = lbadgeScaleVector.subVectors( curMeasurementBadge.position, scope.camera.position ).length() / lbadgeScaleFactor;
            curMeasurementBadge.scale.set( lbadgeScale, lbadgeScale, 1 );

        }
        else if( scope.SCALE_LIMIT != null && scope.SCALE_LIMIT!= undefined && scope.camera.position.length() > scope.SCALE_LIMIT ){

            var lbadgeScaleVector = new THREE.Vector3();
            var lbadgeScaleFactor = 7;
            var maxCamPosition = new THREE.Vector3( scope.SCALE_LIMIT/Math.sqrt(3), scope.SCALE_LIMIT/Math.sqrt(3), scope.SCALE_LIMIT/Math.sqrt(3) );
            var lbadgeScale = lbadgeScaleVector.subVectors( curMeasurementBadge.position, maxCamPosition ).length() / lbadgeScaleFactor;
            curMeasurementBadge.scale.set( lbadgeScale, lbadgeScale, 1 ); 

        }

    },

    scaleCursorFloorPlanView( cursor ){

        var scope = this;
        var cameraToOriginLength = scope.camera.position.clone();
        var zoom = scope.camera.zoom;
        var a = new THREE.Vector3( zoom,zoom,zoom );
        var divideRatio = cameraToOriginLength.divide( a );

        var scale = cursor.position.distanceTo( divideRatio ) * 0.1;
        var maxScale = cursor.position.distanceTo( scope.camera.position ) * 0.1;

        if( scale < maxScale ){

            cursor.scale.set( scale, scale, scale );

        }
        else{

            cursor.scale.set( maxScale, maxScale, maxScale );

        }

    },

    scaleCursorThreeDView( cursor ){

        var scope = this;
        if( scope.SCALE_LIMIT != null && scope.SCALE_LIMIT!= undefined && scope.camera.position.length() <= scope.SCALE_LIMIT ){

            var scale = cursor.position.distanceTo( scope.camera.position ) * 0.1;
            cursor.scale.set( scale, scale, scale );

        }
        else if( scope.SCALE_LIMIT != null && scope.SCALE_LIMIT!= undefined && scope.camera.position.length() > scope.SCALE_LIMIT ){

            var maxCamPosition = new THREE.Vector3( scope.SCALE_LIMIT/Math.sqrt(3), scope.SCALE_LIMIT/Math.sqrt(3), scope.SCALE_LIMIT/Math.sqrt(3) );
            var scale = cursor.position.distanceTo( maxCamPosition ) * 0.1;
            cursor.scale.set( scale, scale, scale );

        }  

    },

    reScaleTemporaryBadge( tempBadge ){

        var scope = this;
        if( scope.isFloorplanViewActive === true ){

            if( scope.currentScaleFactor!= undefined && scope.currentScaleFactor!= null && !( scope.currentScaleFactor.equals( scope.zeroVector ) ) ){

                tempBadge.scale.set( scope.currentScaleFactor.x, scope.currentScaleFactor.y, 1 );

            }

        }
        else{
            
            if( scope.SCALE_LIMIT != null && scope.SCALE_LIMIT!= undefined && scope.camera.position.length() <= scope.SCALE_LIMIT ){

                var scale = tempBadge.position.distanceTo( scope.camera.position ) * 0.15;
                tempBadge.scale.set( scale, scale, scale );

            }
            else if( scope.SCALE_LIMIT != null && scope.SCALE_LIMIT!= undefined && scope.camera.position.length() > scope.SCALE_LIMIT ){

                var maxCamPosition = new THREE.Vector3( scope.SCALE_LIMIT/Math.sqrt(3), scope.SCALE_LIMIT/Math.sqrt(3), scope.SCALE_LIMIT/Math.sqrt(3) );
                var scale = tempBadge.position.distanceTo( maxCamPosition ) * 0.15;
                tempBadge.scale.set( scale, scale, scale );

            }

        }

    },

    scaleCameraThreeDView: function( currentCamera ){

        var scope = this;
        var scaleVector = new THREE.Vector3();
        var scaleFactor = 7, scale;
        var sprite;
        setTimeout( function(){

            currentCamera.traverse( function( child ){

                if(( child instanceof THREE.Sprite ) && ( child.name = "cameraHelperIcon" )){
                    sprite = child;
                    
                    if( sprite ) {

                        if( scope.SCALE_LIMIT != null && scope.SCALE_LIMIT!= undefined && scope.camera.position.length() <= scope.SCALE_LIMIT ){

                            //Modified to add camera icon auto scaling with zoom start
                            if( sprite.parent instanceof THREE.Mesh && sprite.parent.name == "cameraHelperIcon" ){
                                scaleFactor = 30;
                                scale = scaleVector.subVectors( sprite.position, scope.camera.position ).length() / scaleFactor;
                                sprite.parent.scale.set(scale, scale, 1);
                            }
                            else{
                                if( currentCamera.camCategory == "LiDAR" ){
                                    scaleFactor = 2;
                                }
                                else{
                                    scaleFactor = 7;
                                }
                                scale = scaleVector.subVectors( sprite.position, scope.camera.position ).length() / scaleFactor;
                                sprite.scale.set(scale, scale, 1);
                            }

                            
                            //Modified to add camera icon auto scaling with zoom end
                        
                        } else if( scope.SCALE_LIMIT != null && scope.SCALE_LIMIT!= undefined && scope.camera.position.length() > scope.SCALE_LIMIT ){
                
                            var maxCamPosition = new THREE.Vector3( scope.SCALE_LIMIT/Math.sqrt(3), scope.SCALE_LIMIT/Math.sqrt(3), scope.SCALE_LIMIT/Math.sqrt(3) );
                        
                            //Modified to add camera icon auto scaling with zoom start
                            
                            if( sprite.parent instanceof THREE.Mesh && sprite.parent.name == "cameraHelperIcon" ){
                                scaleFactor = 30;
                                scale = scaleVector.subVectors( sprite.position, maxCamPosition ).length() / scaleFactor;
                                sprite.parent.scale.set(scale, scale, 1);
                            }
                            else{
                                if( currentCamera.camCategory == "LiDAR" ){
                                    scaleFactor = 2;
                                }
                                else{
                                    scaleFactor = 7;
                                }
                                scale = scaleVector.subVectors( sprite.position, maxCamPosition ).length() / scaleFactor;
                                sprite.scale.set(scale, scale, 1);
                            }
                        
                            //Modified to add camera icon auto scaling with zoom end
                        
                        }

                    }

                }
    
            } );

        } )

    },

    scaleCameraOrthographicView: function( currentCamera ){

        //Modified to auto scale camera icons start
        var scope = this;
        var cameraToOriginLength = scope.camera.position.clone();
        var zoom = scope.camera.zoom;
        var a = new THREE.Vector3( zoom,zoom,zoom );
        var divideRatio = cameraToOriginLength.divide( a );
        
        var scaleVectorRef = new THREE.Vector3();
        var scaleFactorRef = 7, scale;

        setTimeout( function(){

            currentCamera.traverse( function( child ){
            
                if(( child instanceof THREE.Sprite ) && ( child.name = "cameraHelperIcon" )){
                    sprite = child;
                    
                    if( sprite ) {
                        
                        if( sprite.parent instanceof THREE.Mesh && sprite.parent.name == "cameraHelperIcon" ){
                            scaleFactorRef = 30;   
                        }
                        else{
                            if( currentCamera.camCategory == "LiDAR" ){
                                scaleFactor = 2;
                            }
                            else{
                                scaleFactor = 7;
                            }
                        }

                        scale = scaleVectorRef.subVectors( currentCamera.position, divideRatio ).length() / scaleFactorRef;
                        maxScale = scaleVectorRef.subVectors( currentCamera.position, scope.camera.position ).length() / scaleFactorRef;

                        if( scale < maxScale ){
                            
                            if( sprite.parent instanceof THREE.Mesh && sprite.parent.name == "cameraHelperIcon" ){
                                
                                sprite.parent.scale.set(scale, scale, 1);
                                
                            }
                            else{
                                
                                sprite.scale.set(scale, scale, 1);
                            }
                            
            
                        }
                        else{
                            if( sprite.parent instanceof THREE.Mesh && sprite.parent.name == "cameraHelperIcon" ){
                
                                sprite.parent.scale.set(maxScale, maxScale, 1);
                                
                            }
                            else{
                                
                                sprite.scale.set(maxScale, maxScale, 1);
                            }
            
                        }

                    }
                }

            } )
        });

        //Modified to auto scale camera icons end

    },

    scaleReferencePointThreeDView: function( referencePoint ){

        var scope = this;
        if( scope.SCALE_LIMIT != null && scope.SCALE_LIMIT!= undefined && scope.camera.position.length() <= scope.SCALE_LIMIT ){

			var scaleVectorRef = new THREE.Vector3();
            var scaleFactorRef = 20, scale;
            
            scale = scaleVectorRef.subVectors( referencePoint.position, editor.camera.position ).length() / scaleFactorRef;
            referencePoint.scale.set(scale, scale, 1);

        } else if( scope.SCALE_LIMIT != null && scope.SCALE_LIMIT!= undefined && scope.camera.position.length() > scope.SCALE_LIMIT ){

            var maxCamPosition = new THREE.Vector3( scope.SCALE_LIMIT/Math.sqrt(3), scope.SCALE_LIMIT/Math.sqrt(3), scope.SCALE_LIMIT/Math.sqrt(3) );

            var scaleVectorRef = new THREE.Vector3();
            var scaleFactorRef = 20, scale;

            scale = scaleVectorRef.subVectors( referencePoint.position, maxCamPosition ).length() / scaleFactorRef;
            referencePoint.scale.set(scale, scale, 1);

        }

    },

    scaleReferencePointOrthographic: function( referencePoint ){
        
        //Modified to auto scale camera icons start
        var scope = this;
        var cameraToOriginLength = scope.camera.position.clone();
        var zoom = scope.camera.zoom;
        var a = new THREE.Vector3( zoom,zoom,zoom );
        var divideRatio = cameraToOriginLength.divide( a );

        //Modified to autoscale Camera Reference icons with respect to zoom level start
        var scaleVectorRef = new THREE.Vector3();
        var scaleFactorRef = 27, scale;

        scale = scaleVectorRef.subVectors( referencePoint.position, divideRatio ).length() / scaleFactorRef;
        maxScale = scaleVectorRef.subVectors( referencePoint.position, scope.camera.position ).length() / scaleFactorRef;
        if( scale < maxScale ){

            referencePoint.scale.set(scale, scale, scale);

        }
        else{

            referencePoint.scale.set(maxScale, maxScale, maxScale);

        }

        //Modified to autoscale Camera Reference icons with respect to zoom level end

    },

    scaleBadgesOthographicView: function( simulationCamera, badgeType ){

        var scope = this;
        var cameraToOrigin = simulationCamera.position.clone();
        var zoom = simulationCamera.zoom;
        var ratio = new THREE.Vector3( zoom,zoom,zoom );
        var divideRatio = cameraToOrigin.divide( ratio );
        
        if( badgeType === 'lengthMeasurement' ){

            var lenRef = scope.lengthBadges.length;
            var scaleVectorRef = new THREE.Vector3();
            var scaleFactorRef = 7, scale;
            for( var i = 0; i < lenRef; i++ ){

                scale = scaleVectorRef.subVectors( scope.lengthBadges[ i ].position, divideRatio ).length() / scaleFactorRef;
                maxScale = scaleVectorRef.subVectors( scope.lengthBadges[ i ].position, simulationCamera.position ).length() / scaleFactorRef;

                if( scale < maxScale ){
                    
                    scope.lengthBadges[ i ].scale.set(scale, scale, scale);

                }
                else{
                    
                    scope.lengthBadges[ i ].scale.set(maxScale, maxScale, maxScale);

                }
                
            }

        } else if( badgeType === 'areaMeasurement' ){
            
            var lenRef = scope.areaBadges.length;
            var scaleVectorRef = new THREE.Vector3();
            var scaleFactorRef = 7, scale;
            for( var i = 0; i < lenRef; i++ ){

                scale = scaleVectorRef.subVectors( scope.areaBadges[ i ].position, divideRatio ).length() / scaleFactorRef;
                maxScale = scaleVectorRef.subVectors( scope.areaBadges[ i ].position, simulationCamera.position ).length() / scaleFactorRef;

                if( scale < maxScale ){
                    
                    scope.areaBadges[ i ].scale.set(scale, scale, scale);

                }
                else{
                    
                    scope.areaBadges[ i ].scale.set(maxScale, maxScale, maxScale);

                }
                
            }

        } else if( badgeType === 'networkCable' ){
            
            var lenRef = scope.nwBadges.length;
            var scaleVectorRef = new THREE.Vector3();
            var scaleFactorRef = 7, scale;
            for( var i = 0; i < lenRef; i++ ){

                scale = scaleVectorRef.subVectors( scope.nwBadges[ i ].position, divideRatio ).length() / scaleFactorRef;
                maxScale = scaleVectorRef.subVectors( scope.nwBadges[ i ].position, simulationCamera.position ).length() / scaleFactorRef;

                if( scale < maxScale ){
                    
                    scope.nwBadges[ i ].scale.set(scale, scale, scale);

                }
                else{
                    
                    scope.nwBadges[ i ].scale.set(maxScale, maxScale, maxScale);

                }
                
            }

        }
        
    },
    
    computeSceneCoordinates : function(){

        var bbox = new THREE.Box3().setFromObject( editor.scene );
        const center = new THREE.Vector3();
        var coordinates = bbox.getSize( center );
        //var avgCoordinate = ( coordinates.x + coordinates.y + coordinates.z )/3;
        //return avgCoordinate;
        return coordinates.x;

    }, 

    preloadIcons : function(){

        var scope = this;
        var tLoader = new THREE.TextureLoader();
        var tLoader2 = new THREE.TextureLoader();
        var tLoader3 = new THREE.TextureLoader();
        var tLoader4 = new THREE.TextureLoader();
        var tLoader5 = new THREE.TextureLoader();
        var tLoader6 = new THREE.TextureLoader();
        var tLoader7 = new THREE.TextureLoader();
        var tLoader8 = new THREE.TextureLoader();
        var tLoader9 = new THREE.TextureLoader();
        var tLoader10 = new THREE.TextureLoader();
        
        if( scope.nwStartMarkerIcon === null ){

            tLoader.load(

                'assets/img/start_marker.png',
    
                function( img ){
    
                    scope.nwStartMarkerIcon = img;
                    scope.nwStartMarkerIcon.needsUpdate = true;
    
                },
    
                undefined,
                
                undefined
    
            );

        }

        if( scope.nwEndMarkerIcon === null ){

            tLoader2.load(

                'assets/img/end_marker.png',
    
                function( img ){
    
                    scope.nwEndMarkerIcon = img;
                    scope.nwEndMarkerIcon.needsUpdate = true;
    
                },
    
                undefined,
                
                undefined
    
            );

        }

        if( scope.leftArrowIcon === null ){

            tLoader3.load(
        
                'assets/img/left_arrow.png',
        
                function( img ){
        
                    scope.leftArrowIcon = img;
                    scope.leftArrowIcon.needsUpdate = true;
                    scope.leftArrowIcon.name = "left_arrow";
        
                },
        
                undefined,
                
                undefined
        
            );
        
        }
        
        if( scope.rightArrowIcon === null ){
        
            tLoader4.load(
        
                'assets/img/right_arrow.png',
        
                function( img ){
        
                    scope.rightArrowIcon = img;
                    scope.rightArrowIcon.needsUpdate = true;
                    scope.rightArrowIcon.name = "right_arrow";
        
                },
        
                undefined,
                
                undefined
        
            );
        
        }
        if( scope.topArrowIcon === null ){
        
            tLoader5.load(
        
                'assets/img/top_arrow.png',
        
                function( img ){
        
                    scope.topArrowIcon = img;
                    scope.topArrowIcon.needsUpdate = true;
                    scope.topArrowIcon.name = "top_arrow";
        
                },
        
                undefined,
                
                undefined
        
            );
        
        }
        if( scope.bottomArrowIcon === null ){
        
            tLoader6.load(
        
                'assets/img/bottom_arrow.png',
        
                function( img ){
        
                    scope.bottomArrowIcon = img;
                    scope.bottomArrowIcon.needsUpdate = true;
                    scope.bottomArrowIcon.name = "bottom_arrow";
        
                },
        
                undefined,
                
                undefined
        
            );
        
        }
        if( scope.bottomRightCornerArrowIcon === null ){
        
            tLoader7.load(
        
                'assets/img/right_bottom_corner_arrow.png',
        
                function( img ){
        
                    scope.bottomRightCornerArrowIcon = img;
                    scope.bottomRightCornerArrowIcon.needsUpdate = true;
                    scope.bottomRightCornerArrowIcon.name = "right_bottom_corner_arrow";
        
                },
        
                undefined,
                
                undefined
        
            );
        
        }
        if( scope.bottomLeftCornerArrowIcon === null ){
        
            tLoader8.load(
        
                'assets/img/left_bottom_corner_arrow.png',
        
                function( img ){
        
                    scope.bottomLeftCornerArrowIcon = img;
                    scope.bottomLeftCornerArrowIcon.needsUpdate = true;
                    scope.bottomLeftCornerArrowIcon.name = "left_bottom_corner_arrow";
        
                },
        
                undefined,
                
                undefined
        
            );
        
        }
        if( scope.topRightCornerArrowIcon === null ){
        
            tLoader9.load(
        
                'assets/img/right_top_corner_arrow.png',
        
                function( img ){
        
                    scope.topRightCornerArrowIcon = img;
                    scope.topRightCornerArrowIcon.needsUpdate = true;
                    scope.topRightCornerArrowIcon.name = "right_top_corner_arrow";
        
                },
        
                undefined,
                
                undefined
        
            );
        
        }
        if( scope.topLeftCornerArrowIcon === null ){
        
            tLoader10.load(
        
                'assets/img/left_top_corner_arrow.png',
        
                function( img ){
        
                    scope.topLeftCornerArrowIcon = img;
                    scope.topLeftCornerArrowIcon.needsUpdate = true;
                    scope.topLeftCornerArrowIcon.name = "left_top_corner_arrow";
        
                },
        
                undefined,
                
                undefined
        
            );
        
        }
        if( scope.junctionBoxIcon === null ){

            tLoader3.load(

                'assets/img/junction_box.png',
    
                function( img ){
    
                    scope.junctionBoxIcon = img;
                    scope.junctionBoxIcon.needsUpdate = true;
    
                },
    
                undefined,
                
                undefined
    
            );

        }

    },
    /*
    getStartArrowIcon: function( firstPoint,secondPoint ) {

        var scope = this;
        if( (firstPoint.x > secondPoint.x) && ( Math.abs(firstPoint.z - secondPoint.z )<0.25 ) && ( Math.abs(firstPoint.x - secondPoint.x )>0.25 ) ){
                
            startIcon = scope.rightArrowIcon.clone();
        }
        else if( (firstPoint.x > secondPoint.x) && ( firstPoint.z > secondPoint.z  ) && ( Math.abs( firstPoint.z - secondPoint.z) >0.25  ) &&  ( Math.abs( firstPoint.x - secondPoint.x) >0.25  )){

            startIcon = scope.bottomRightCornerArrowIcon.clone();
        }
        else if( ( firstPoint.z > secondPoint.z ) && ( Math.abs( firstPoint.z - secondPoint.z) >0.25  ) && ( Math.abs( firstPoint.x - secondPoint.x) <0.25  ) ){

            startIcon = scope.bottomArrowIcon.clone();
        }
        else if( (firstPoint.x < secondPoint.x) && ( firstPoint.z > secondPoint.z  ) && ( Math.abs( firstPoint.z - secondPoint.z) >0.25  ) &&  ( Math.abs( firstPoint.x - secondPoint.x) >0.25  ) ){

            startIcon = scope.bottomLeftCornerArrowIcon.clone();
        }
        else if( (firstPoint.x < secondPoint.x) && ( Math.abs(firstPoint.z - secondPoint.z )<0.25 ) && ( Math.abs(firstPoint.x - secondPoint.x )>0.25 ) ){

            startIcon = scope.leftArrowIcon.clone();
        }
        else if( (firstPoint.x < secondPoint.x) && ( firstPoint.z < secondPoint.z  ) && ( Math.abs( firstPoint.z - secondPoint.z) >0.25  ) &&  ( Math.abs( firstPoint.x - secondPoint.x) >0.25  )){

            startIcon = scope.topLeftCornerArrowIcon.clone();
        }
        else if( ( firstPoint.z < secondPoint.z ) && ( Math.abs( firstPoint.z - secondPoint.z) >0.25  ) && ( Math.abs( firstPoint.x - secondPoint.x) <0.25  ) ){

            startIcon = scope.topArrowIcon.clone();
        }
        else if( (firstPoint.x > secondPoint.x) && ( firstPoint.z < secondPoint.z  ) && ( Math.abs( firstPoint.z - secondPoint.z) >0.25  ) &&  ( Math.abs( firstPoint.x - secondPoint.x) >0.25  ) ){

            startIcon = scope.topRightCornerArrowIcon.clone();

        }
        else {

            startIcon = scope.leftArrowIcon.clone();
            console.log("No criterias matched");

        }
        return startIcon;

    },

    getEndArrowIcon: function(lastPoint,secondLastPoint) {

        var scope = this;
        if( (lastPoint.x > secondLastPoint.x) && ( Math.abs(lastPoint.z - secondLastPoint.z )<0.25 ) && ( Math.abs(lastPoint.x - secondLastPoint.x )>0.25 ) ){

            endIcon = scope.rightArrowIcon.clone();

        }
        else if( (lastPoint.x > secondLastPoint.x) && ( lastPoint.z > secondLastPoint.z  ) && ( Math.abs( lastPoint.z - secondLastPoint.z) >0.25  ) &&  ( Math.abs( lastPoint.x - secondLastPoint.x) >0.25  )){

            endIcon = scope.bottomRightCornerArrowIcon.clone();

        }
        else if( ( lastPoint.z > secondLastPoint.z ) && ( Math.abs( lastPoint.z - secondLastPoint.z) >0.25  ) && ( Math.abs( lastPoint.x - secondLastPoint.x) <0.25  ) ){

            endIcon = scope.bottomArrowIcon.clone();

        }
        else if( (lastPoint.x < secondLastPoint.x) && ( lastPoint.z > secondLastPoint.z  ) && ( Math.abs( lastPoint.z - secondLastPoint.z) >0.25  ) &&  ( Math.abs( lastPoint.x - secondLastPoint.x) >0.25  ) ){

            endIcon = scope.bottomLeftCornerArrowIcon.clone();

        }
        else if( (lastPoint.x < secondLastPoint.x) && ( Math.abs(lastPoint.z - secondLastPoint.z )<0.25 ) && ( Math.abs(lastPoint.x - secondLastPoint.x )>0.25 ) ){

            endIcon = scope.leftArrowIcon.clone();

        }
        else if( (lastPoint.x < secondLastPoint.x) && ( lastPoint.z < secondLastPoint.z  ) && ( Math.abs( lastPoint.z - secondLastPoint.z) >0.25  ) &&  ( Math.abs( lastPoint.x - secondLastPoint.x) >0.25  )){

            endIcon = scope.topLeftCornerArrowIcon.clone();

        }
        else if( ( lastPoint.z < secondLastPoint.z ) && ( Math.abs( lastPoint.z - secondLastPoint.z) >0.25  ) && ( Math.abs( lastPoint.x - secondLastPoint.x) <0.25  ) ){

            endIcon = scope.topArrowIcon.clone();

        }
        else if( (lastPoint.x > secondLastPoint.x) && ( lastPoint.z < secondLastPoint.z  ) && ( Math.abs( lastPoint.z - secondLastPoint.z) >0.25  ) &&  ( Math.abs( lastPoint.x - secondLastPoint.x) >0.25  ) ){

            endIcon = scope.topRightCornerArrowIcon.clone();

        }
        else {

            endIcon = scope.rightArrowIcon.clone();
            console.log("No criterias matched for end icon");

        }
        return endIcon;

    },*/

    getStartArrowIcon: function( firstPoint,secondPoint ) {
        
        var scope = this;
        var length = firstPoint.distanceTo(secondPoint);

        if(length < 9){

            if( (firstPoint.x > secondPoint.x) && ( firstPoint.z > secondPoint.z  ) && ( Math.abs( firstPoint.z - secondPoint.z) >0.5  ) &&  ( Math.abs( firstPoint.x - secondPoint.x) >0.5  )){
    
                startIcon = scope.bottomRightCornerArrowIcon.clone();
            }
            
            else if( (firstPoint.x < secondPoint.x) && ( firstPoint.z > secondPoint.z  ) && ( Math.abs( firstPoint.z - secondPoint.z) >0.5  ) &&  ( Math.abs( firstPoint.x - secondPoint.x) >0.5  ) ){
        
                startIcon = scope.bottomLeftCornerArrowIcon.clone();
            }
            else if( (firstPoint.x < secondPoint.x) && ( firstPoint.z < secondPoint.z  ) && ( Math.abs( firstPoint.z - secondPoint.z) >0.5  ) &&  ( Math.abs( firstPoint.x - secondPoint.x) >0.5  )){
        
                startIcon = scope.topLeftCornerArrowIcon.clone();
            }
            else if( (firstPoint.x > secondPoint.x) && ( firstPoint.z < secondPoint.z  ) && ( Math.abs( firstPoint.z - secondPoint.z) >0.5  ) &&  ( Math.abs( firstPoint.x - secondPoint.x) >0.5  ) ){
        
                startIcon = scope.topRightCornerArrowIcon.clone();
        
            }
            else if( (firstPoint.x < secondPoint.x) && ( Math.abs(firstPoint.z - secondPoint.z ) < Math.abs(firstPoint.x - secondPoint.x ) ) ){
        
                startIcon = scope.leftArrowIcon.clone();
            }
            else if( (firstPoint.x > secondPoint.x) && ( Math.abs(firstPoint.x - secondPoint.x )>Math.abs(firstPoint.z - secondPoint.z ) ) ){
                    
                startIcon = scope.rightArrowIcon.clone();
            }
            else if( ( firstPoint.z > secondPoint.z ) && ( Math.abs( firstPoint.z - secondPoint.z) > Math.abs( firstPoint.x - secondPoint.x)  ) ){
        
                startIcon = scope.bottomArrowIcon.clone();
            }
            else if( ( firstPoint.z < secondPoint.z ) && ( Math.abs( firstPoint.z - secondPoint.z) > Math.abs( firstPoint.x - secondPoint.x)  ) ){
        
                startIcon = scope.topArrowIcon.clone();
            }
            else {
        
                startIcon = scope.leftArrowIcon.clone();
                console.log("No criterias matched");
        
            }
            return startIcon;

        } else if( (length > 9) && (length < 25) ) {

            if( (firstPoint.x > secondPoint.x) && ( firstPoint.z > secondPoint.z  ) && ( Math.abs( firstPoint.z - secondPoint.z) >2.0  ) &&  ( Math.abs( firstPoint.x - secondPoint.x) >2.0  )){
    
                startIcon = scope.bottomRightCornerArrowIcon.clone();
            }
            
            else if( (firstPoint.x < secondPoint.x) && ( firstPoint.z > secondPoint.z  ) && ( Math.abs( firstPoint.z - secondPoint.z) >2.0  ) &&  ( Math.abs( firstPoint.x - secondPoint.x) >2.0  ) ){
        
                startIcon = scope.bottomLeftCornerArrowIcon.clone();
            }
            else if( (firstPoint.x < secondPoint.x) && ( firstPoint.z < secondPoint.z  ) && ( Math.abs( firstPoint.z - secondPoint.z) >2.0  ) &&  ( Math.abs( firstPoint.x - secondPoint.x) >2.0  )){
        
                startIcon = scope.topLeftCornerArrowIcon.clone();
            }
            else if( (firstPoint.x > secondPoint.x) && ( firstPoint.z < secondPoint.z  ) && ( Math.abs( firstPoint.z - secondPoint.z) >2.0  ) &&  ( Math.abs( firstPoint.x - secondPoint.x) >2.0  ) ){
        
                startIcon = scope.topRightCornerArrowIcon.clone();
        
            }
            else if( (firstPoint.x < secondPoint.x) && ( Math.abs(firstPoint.z - secondPoint.z ) < Math.abs(firstPoint.x - secondPoint.x ) ) ){
        
                startIcon = scope.leftArrowIcon.clone();
            }
            else if( (firstPoint.x > secondPoint.x) && ( Math.abs(firstPoint.x - secondPoint.x )>Math.abs(firstPoint.z - secondPoint.z ) ) ){
                    
                startIcon = scope.rightArrowIcon.clone();
            }
            else if( ( firstPoint.z > secondPoint.z ) && ( Math.abs( firstPoint.z - secondPoint.z) > Math.abs( firstPoint.x - secondPoint.x)  ) ){
        
                startIcon = scope.bottomArrowIcon.clone();
            }
            else if( ( firstPoint.z < secondPoint.z ) && ( Math.abs( firstPoint.z - secondPoint.z) > Math.abs( firstPoint.x - secondPoint.x)  ) ){
        
                startIcon = scope.topArrowIcon.clone();
            }
            else {
        
                startIcon = scope.leftArrowIcon.clone();
                console.log("No criterias matched");
        
            }
            return startIcon;

        } else {

            if( (firstPoint.x > secondPoint.x) && ( firstPoint.z > secondPoint.z  ) && ( Math.abs( firstPoint.z - secondPoint.z) >3.5  ) &&  ( Math.abs( firstPoint.x - secondPoint.x) >3.5  )){
    
                startIcon = scope.bottomRightCornerArrowIcon.clone();
            }
            
            else if( (firstPoint.x < secondPoint.x) && ( firstPoint.z > secondPoint.z  ) && ( Math.abs( firstPoint.z - secondPoint.z) >3.5  ) &&  ( Math.abs( firstPoint.x - secondPoint.x) >3.5  ) ){
        
                startIcon = scope.bottomLeftCornerArrowIcon.clone();
            }
            else if( (firstPoint.x < secondPoint.x) && ( firstPoint.z < secondPoint.z  ) && ( Math.abs( firstPoint.z - secondPoint.z) >3.5  ) &&  ( Math.abs( firstPoint.x - secondPoint.x) >3.5  )){
        
                startIcon = scope.topLeftCornerArrowIcon.clone();
            }
            else if( (firstPoint.x > secondPoint.x) && ( firstPoint.z < secondPoint.z  ) && ( Math.abs( firstPoint.z - secondPoint.z) >3.5  ) &&  ( Math.abs( firstPoint.x - secondPoint.x) >3.5  ) ){
        
                startIcon = scope.topRightCornerArrowIcon.clone();
        
            }
            else if( (firstPoint.x < secondPoint.x) && ( Math.abs(firstPoint.z - secondPoint.z ) < Math.abs(firstPoint.x - secondPoint.x ) ) ){
        
                startIcon = scope.leftArrowIcon.clone();
            }
            else if( (firstPoint.x > secondPoint.x) && ( Math.abs(firstPoint.x - secondPoint.x )>Math.abs(firstPoint.z - secondPoint.z ) ) ){
                    
                startIcon = scope.rightArrowIcon.clone();
            }
            else if( ( firstPoint.z > secondPoint.z ) && ( Math.abs( firstPoint.z - secondPoint.z) > Math.abs( firstPoint.x - secondPoint.x)  ) ){
        
                startIcon = scope.bottomArrowIcon.clone();
            }
            else if( ( firstPoint.z < secondPoint.z ) && ( Math.abs( firstPoint.z - secondPoint.z) > Math.abs( firstPoint.x - secondPoint.x)  ) ){
        
                startIcon = scope.topArrowIcon.clone();
            }
            else {
        
                startIcon = scope.leftArrowIcon.clone();
                console.log("No criterias matched");
        
            }
            return startIcon;

        }      
    
    },

    getEndArrowIcon: function(lastPoint,secondLastPoint) {

        var scope = this;
        var length = secondLastPoint.distanceTo(lastPoint);

        if(length < 9){

            if( (lastPoint.x > secondLastPoint.x) && ( lastPoint.z > secondLastPoint.z  ) && ( Math.abs( lastPoint.z - secondLastPoint.z) >0.5  ) &&  ( Math.abs( lastPoint.x - secondLastPoint.x) >0.5  )){
    
                endIcon = scope.bottomRightCornerArrowIcon.clone();
        
            }
            else if( (lastPoint.x < secondLastPoint.x) && ( lastPoint.z > secondLastPoint.z  ) && ( Math.abs( lastPoint.z - secondLastPoint.z) >0.5  ) &&  ( Math.abs( lastPoint.x - secondLastPoint.x) >0.5  ) ){
        
                endIcon = scope.bottomLeftCornerArrowIcon.clone();
        
            }
            else if( (lastPoint.x < secondLastPoint.x) && ( lastPoint.z < secondLastPoint.z  ) && ( Math.abs( lastPoint.z - secondLastPoint.z) >0.5  ) &&  ( Math.abs( lastPoint.x - secondLastPoint.x) >0.5  )){
        
                endIcon = scope.topLeftCornerArrowIcon.clone();
        
            }
            else if( (lastPoint.x > secondLastPoint.x) && ( lastPoint.z < secondLastPoint.z  ) && ( Math.abs( lastPoint.z - secondLastPoint.z) >0.5  ) &&  ( Math.abs( lastPoint.x - secondLastPoint.x) >0.5  ) ){
        
                endIcon = scope.topRightCornerArrowIcon.clone();
        
            }
            else if( (lastPoint.x > secondLastPoint.x) && ( Math.abs(lastPoint.z - secondLastPoint.z )< Math.abs(lastPoint.x - secondLastPoint.x ) ) ){
        
                endIcon = scope.rightArrowIcon.clone();
        
            }
            else if( ( lastPoint.z > secondLastPoint.z ) && ( Math.abs( lastPoint.z - secondLastPoint.z) > Math.abs( lastPoint.x - secondLastPoint.x)  ) ){
        
                endIcon = scope.bottomArrowIcon.clone();
        
            }
            else if( (lastPoint.x < secondLastPoint.x) && ( Math.abs(lastPoint.z - secondLastPoint.z ) < Math.abs(lastPoint.x - secondLastPoint.x ) ) ){
        
                endIcon = scope.leftArrowIcon.clone();
        
            }
            else if( ( lastPoint.z < secondLastPoint.z ) && ( Math.abs( lastPoint.z - secondLastPoint.z) > Math.abs( lastPoint.x - secondLastPoint.x)  ) ){
        
                endIcon = scope.topArrowIcon.clone();
        
            }
            else {
        
                endIcon = scope.rightArrowIcon.clone();
                console.log("No criterias matched for end icon");
        
            }
            return endIcon;

        } else if( (length > 9) && (length < 25) ) {

            if( (lastPoint.x > secondLastPoint.x) && ( lastPoint.z > secondLastPoint.z  ) && ( Math.abs( lastPoint.z - secondLastPoint.z) >2.0  ) &&  ( Math.abs( lastPoint.x - secondLastPoint.x) >2.0  )){
    
                endIcon = scope.bottomRightCornerArrowIcon.clone();
        
            }
            else if( (lastPoint.x < secondLastPoint.x) && ( lastPoint.z > secondLastPoint.z  ) && ( Math.abs( lastPoint.z - secondLastPoint.z) >2.0  ) &&  ( Math.abs( lastPoint.x - secondLastPoint.x) >2.0  ) ){
        
                endIcon = scope.bottomLeftCornerArrowIcon.clone();
        
            }
            else if( (lastPoint.x < secondLastPoint.x) && ( lastPoint.z < secondLastPoint.z  ) && ( Math.abs( lastPoint.z - secondLastPoint.z) >2.0  ) &&  ( Math.abs( lastPoint.x - secondLastPoint.x) >2.0  )){
        
                endIcon = scope.topLeftCornerArrowIcon.clone();
        
            }
            else if( (lastPoint.x > secondLastPoint.x) && ( lastPoint.z < secondLastPoint.z  ) && ( Math.abs( lastPoint.z - secondLastPoint.z) >2.0  ) &&  ( Math.abs( lastPoint.x - secondLastPoint.x) >2.0  ) ){
        
                endIcon = scope.topRightCornerArrowIcon.clone();
        
            }
            else if( (lastPoint.x > secondLastPoint.x) && ( Math.abs(lastPoint.z - secondLastPoint.z )< Math.abs(lastPoint.x - secondLastPoint.x ) ) ){
        
                endIcon = scope.rightArrowIcon.clone();
        
            }
            else if( ( lastPoint.z > secondLastPoint.z ) && ( Math.abs( lastPoint.z - secondLastPoint.z) > Math.abs( lastPoint.x - secondLastPoint.x)  ) ){
        
                endIcon = scope.bottomArrowIcon.clone();
        
            }
            else if( (lastPoint.x < secondLastPoint.x) && ( Math.abs(lastPoint.z - secondLastPoint.z ) < Math.abs(lastPoint.x - secondLastPoint.x ) ) ){
        
                endIcon = scope.leftArrowIcon.clone();
        
            }
            else if( ( lastPoint.z < secondLastPoint.z ) && ( Math.abs( lastPoint.z - secondLastPoint.z) > Math.abs( lastPoint.x - secondLastPoint.x)  ) ){
        
                endIcon = scope.topArrowIcon.clone();
        
            }
            else {
        
                endIcon = scope.rightArrowIcon.clone();
                console.log("No criterias matched for end icon");
        
            }
            return endIcon;

        } else {

            if( (lastPoint.x > secondLastPoint.x) && ( lastPoint.z > secondLastPoint.z  ) && ( Math.abs( lastPoint.z - secondLastPoint.z) >3.5  ) &&  ( Math.abs( lastPoint.x - secondLastPoint.x) >3.5  )){
    
                endIcon = scope.bottomRightCornerArrowIcon.clone();
        
            }
            else if( (lastPoint.x < secondLastPoint.x) && ( lastPoint.z > secondLastPoint.z  ) && ( Math.abs( lastPoint.z - secondLastPoint.z) >3.5  ) &&  ( Math.abs( lastPoint.x - secondLastPoint.x) >3.5  ) ){
        
                endIcon = scope.bottomLeftCornerArrowIcon.clone();
        
            }
            else if( (lastPoint.x < secondLastPoint.x) && ( lastPoint.z < secondLastPoint.z  ) && ( Math.abs( lastPoint.z - secondLastPoint.z) >3.5  ) &&  ( Math.abs( lastPoint.x - secondLastPoint.x) >3.5  )){
        
                endIcon = scope.topLeftCornerArrowIcon.clone();
        
            }
            else if( (lastPoint.x > secondLastPoint.x) && ( lastPoint.z < secondLastPoint.z  ) && ( Math.abs( lastPoint.z - secondLastPoint.z) >3.5  ) &&  ( Math.abs( lastPoint.x - secondLastPoint.x) >3.5  ) ){
        
                endIcon = scope.topRightCornerArrowIcon.clone();
        
            }
            else if( (lastPoint.x > secondLastPoint.x) && ( Math.abs(lastPoint.z - secondLastPoint.z )< Math.abs(lastPoint.x - secondLastPoint.x ) ) ){
        
                endIcon = scope.rightArrowIcon.clone();
        
            }
            else if( ( lastPoint.z > secondLastPoint.z ) && ( Math.abs( lastPoint.z - secondLastPoint.z) > Math.abs( lastPoint.x - secondLastPoint.x)  ) ){
        
                endIcon = scope.bottomArrowIcon.clone();
        
            }
            else if( (lastPoint.x < secondLastPoint.x) && ( Math.abs(lastPoint.z - secondLastPoint.z ) < Math.abs(lastPoint.x - secondLastPoint.x ) ) ){
        
                endIcon = scope.leftArrowIcon.clone();
        
            }
            else if( ( lastPoint.z < secondLastPoint.z ) && ( Math.abs( lastPoint.z - secondLastPoint.z) > Math.abs( lastPoint.x - secondLastPoint.x)  ) ){
        
                endIcon = scope.topArrowIcon.clone();
        
            }
            else {
        
                endIcon = scope.rightArrowIcon.clone();
                console.log("No criterias matched for end icon");
        
            }
            return endIcon;

        }
          
    },

    loadThreeDCamera: function() {
        
        if( !editor.threeDCamera ) {

            var loader = new THREE.GLTFLoader();

            loader.load(
                // resource URL
                'assets/editorresources/Bullet_3D_Hitachi/bullet-3d.gltf',
                // called when the resource is loaded
                function ( gltf ) {

                    editor.threeDCamera = gltf.scene;
                    gltf.animations; // Array<THREE.AnimationClip>
                    gltf.scene; // THREE.Scene
                    gltf.scenes; // Array<THREE.Scene>
                    gltf.cameras; // Array<THREE.Camera>
                    gltf.asset; // Object

                    gltf.scene.scale.set(0.25,0.25,0.25);
                    editor.threeDCamera.name = "threeDCameraModel";
                    editor.signals.sceneGraphChanged.dispatch();
            
                },
                // called while loading is progressing
                function ( xhr ) {
            
                    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
            
                },
                // called when loading has errors
                function ( error ) {
            
                    console.log( 'An error happened' );
            
                }
            );

        } else{

            console.log('Something went wrong. 3D Bullet camera icon not loaded');

        }

    },
    loadThreeDLiteCamera: function() {
        
        if( !editor.threeDLiteCamera ) {

            var loader = new THREE.GLTFLoader();

            loader.load(
                // resource URL
                'assets/editorresources/bullet_lite.glb',
                // called when the resource is loaded
                function ( gltf ) {

                    editor.threeDLiteCamera = gltf.scene;
                    gltf.animations; // Array<THREE.AnimationClip>
                    gltf.scene; // THREE.Scene
                    gltf.scenes; // Array<THREE.Scene>
                    gltf.cameras; // Array<THREE.Camera>
                    gltf.asset; // Object

                    gltf.scene.scale.set(0.25,0.25,0.25);
                    editor.threeDLiteCamera.name = "threeDCameraModel";
                    editor.signals.sceneGraphChanged.dispatch();
            
                },
                // called while loading is progressing
                function ( xhr ) {
            
                    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
            
                },
                // called when loading has errors
                function ( error ) {
            
                    console.log( 'An error happened' );
            
                }
            );

        } else{

            console.log('Something went wrong. 3D Bullet camera icon not loaded');

        }

    },
    loadThreeDCovertCamera: function() {
        
        if( !editor.threeDCovertCamera ) {

            var loader = new THREE.GLTFLoader();

            loader.load(
                // resource URL
                'assets/editorresources/CameraGL.gltf',
                // called when the resource is loaded
                function ( gltf ) {

                    editor.threeDCovertCamera = gltf.scene;
                    gltf.animations; // Array<THREE.AnimationClip>
                    gltf.scene; // THREE.Scene
                    gltf.scenes; // Array<THREE.Scene>
                    gltf.cameras; // Array<THREE.Camera>
                    gltf.asset; // Object

                    gltf.scene.scale.set(0.25,0.25,0.25);
                    editor.threeDCovertCamera.name = "threeDCameraModel";
                    editor.signals.sceneGraphChanged.dispatch();
            
                },
                // called while loading is progressing
                function ( xhr ) {
            
                    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
            
                },
                // called when loading has errors
                function ( error ) {
            
                    console.log( 'An error happened' );
            
                }
            );

        } else{

            console.log('Something went wrong. 3D Bullet camera icon not loaded');

        }

    },
    loadThreeDCovertLiteCamera: function() {
        
        if( !editor.threeDCovertLiteCamera ) {

            var loader = new THREE.GLTFLoader();

            loader.load(
                // resource URL
                'assets/editorresources/covert_lite.glb',
                // called when the resource is loaded
                function ( gltf ) {

                    editor.threeDCovertLiteCamera = gltf.scene;
                    gltf.animations; // Array<THREE.AnimationClip>
                    gltf.scene; // THREE.Scene
                    gltf.scenes; // Array<THREE.Scene>
                    gltf.cameras; // Array<THREE.Camera>
                    gltf.asset; // Object

                    gltf.scene.scale.set(0.25,0.25,0.25);
                    editor.threeDCovertLiteCamera.name = "threeDCameraModel";
                    editor.signals.sceneGraphChanged.dispatch();
            
                },
                // called while loading is progressing
                function ( xhr ) {
            
                    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
            
                },
                // called when loading has errors
                function ( error ) {
            
                    console.log( 'An error happened' );
            
                }
            );

        } else{

            console.log('Something went wrong. 3D Bullet camera icon not loaded');

        }

    },

    loadThreeDLidarCamera: function() {
        
        if( !editor.threeDLidarCamera ) {

            var loader = new THREE.GLTFLoader();

            loader.load(
                // resource URL
                'assets/editorresources/LiDAR_3D_Hitachi/lidar_3d.glb',
                // called when the resource is loaded
                function ( gltf ) {

                    editor.threeDLidarCamera = gltf.scene;
                    gltf.animations; // Array<THREE.AnimationClip>
                    gltf.scene; // THREE.Scene
                    gltf.scenes; // Array<THREE.Scene>
                    gltf.cameras; // Array<THREE.Camera>
                    gltf.asset; // Object

                    gltf.scene.scale.set(0.25,0.25,0.25);
                    editor.threeDLidarCamera.name = "threeDCameraModel";
                    editor.signals.sceneGraphChanged.dispatch();
            
                },
                // called while loading is progressing
                function ( xhr ) {
            
                    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
            
                },
                // called when loading has errors
                function ( error ) {
            
                    console.log( 'An error happened' );
            
                }
            );

        } else{

            console.log('Something went wrong. 3D Bullet camera icon not loaded');

        }

    },

    loadThreeDLidarIntelCamera: function() {
        
        if( !editor.threeDLidarIntelCamera ) {

            var loader = new THREE.GLTFLoader();

            loader.load(
                // resource URL
                'assets/editorresources/Intel-L515/Camera3.glb',
                // called when the resource is loaded
                function ( gltf ) {

                    editor.threeDLidarIntelCamera = gltf.scene;
                    gltf.animations; // Array<THREE.AnimationClip>
                    gltf.scene; // THREE.Scene
                    gltf.scenes; // Array<THREE.Scene>
                    gltf.cameras; // Array<THREE.Camera>
                    gltf.asset; // Object

                    gltf.scene.scale.set(0.25,0.25,0.25);
                    editor.threeDLidarIntelCamera.name = "threeDCameraModel";
                    editor.signals.sceneGraphChanged.dispatch();
            
                },
                // called while loading is progressing
                function ( xhr ) {
            
                    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
            
                },
                // called when loading has errors
                function ( error ) {
            
                    console.log( 'An error happened' );
            
                }
            );

        } else{

            console.log('Something went wrong. 3D Lidar Intel camera icon not loaded');

        }

    },

    loadThreeDLidarHLSLFOM3Camera: function(){
                if( !editor.threeDLidarHLSLFOM3Camera ) {


            var loader = new THREE.GLTFLoader();

            loader.load(
                // resource URL
                'assets/editorresources/HLS-LFOM3/HLS-LFOM3.glb',
                // called when the resource is loaded
                function ( gltf ) {

                    editor.threeDLidarHLSLFOM3Camera = gltf.scene;
                    gltf.animations; // Array<THREE.AnimationClip>
                    gltf.scene; // THREE.Scene
                    gltf.scenes; // Array<THREE.Scene>
                    gltf.cameras; // Array<THREE.Camera>
                    gltf.asset; // Object

                    gltf.scene.scale.set(0.25,0.25,0.25);
                    editor.threeDLidarHLSLFOM3Camera.name = "threeDCameraModel";
                    editor.signals.sceneGraphChanged.dispatch();
            
                },
                // called while loading is progressing
                function ( xhr ) {
            
                    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
            
                },
                // called when loading has errors
                function ( error ) {
            
                    console.log( 'An error happened' );
            
                }
            );

        } else{

            console.log('Something went wrong. 3D Lidar HLS-LFOM3 camera icon not loaded');

        }

    },
    loadThreeDLidarHLSLFOM1Camera: function(){
        if( !editor.threeDLidarHLSLFOM1Camera ) {


    var loader = new THREE.GLTFLoader();

    loader.load(
        // resource URL
        'assets/editorresources/HLS-LFOM1/HLS-LFOM1.glb',
        // called when the resource is loaded
        function ( gltf ) {

            editor.threeDLidarHLSLFOM1Camera = gltf.scene;
            gltf.animations; // Array<THREE.AnimationClip>
            gltf.scene; // THREE.Scene
            gltf.scenes; // Array<THREE.Scene>
            gltf.cameras; // Array<THREE.Camera>
            gltf.asset; // Object

            gltf.scene.scale.set(0.25,0.25,0.25);
            editor.threeDLidarHLSLFOM1Camera.name = "threeDCameraModel";
            editor.signals.sceneGraphChanged.dispatch();
    
        },
        // called while loading is progressing
        function ( xhr ) {
    
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    
        },
        // called when loading has errors
        function ( error ) {
    
            console.log( 'An error happened' );
    
        }
    );

} else{

    console.log('Something went wrong. 3D Lidar HLS-LFOM1 camera icon not loaded');

}

},

    loadThreeDLidarLiteCamera: function() {
        
        if( !editor.threeDLidarLiteCamera ) {

            var loader = new THREE.GLTFLoader();

            loader.load(
                // resource URL
                'assets/editorresources/LiDAR_Lite.glb',
                // called when the resource is loaded
                function ( gltf ) {

                    editor.threeDLidarLiteCamera = gltf.scene;
                    gltf.animations; // Array<THREE.AnimationClip>
                    gltf.scene; // THREE.Scene
                    gltf.scenes; // Array<THREE.Scene>
                    gltf.cameras; // Array<THREE.Camera>
                    gltf.asset; // Object

                    gltf.scene.scale.set(0.25,0.25,0.25);
                    editor.threeDLidarLiteCamera.name = "threeDCameraModel";
                    editor.signals.sceneGraphChanged.dispatch();
            
                },
                // called while loading is progressing
                function ( xhr ) {
            
                    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
            
                },
                // called when loading has errors
                function ( error ) {
            
                    console.log( 'An error happened' );
            
                }
            );

        } else{

            console.log('Something went wrong. 3D Bullet camera icon not loaded');

        }

    },

    loadThreeDDomeCamera: function() {
        
        if( !editor.threeDDomeCamera ) {

            var loader = new THREE.GLTFLoader();

            loader.load(
                // resource URL
                'assets/editorresources/Dome_3D_Hitachi/dome_3d.gltf',
                // called when the resource is loaded
                function ( gltf ) {

                    editor.threeDDomeCamera = gltf.scene;
                    gltf.animations; // Array<THREE.AnimationClip>
                    gltf.scene; // THREE.Scene
                    gltf.scenes; // Array<THREE.Scene>
                    gltf.cameras; // Array<THREE.Camera>
                    gltf.asset; // Object

                    gltf.scene.scale.set(0.25,0.25,0.25);
                    editor.threeDDomeCamera.name = "threeDCameraModel";
                    editor.signals.sceneGraphChanged.dispatch();
            
                },
                // called while loading is progressing
                function ( xhr ) {
            
                    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
            
                },
                // called when loading has errors
                function ( error ) {
            
                    console.log( 'An error happened' );
            
                }
            );

        } else{

            console.log('Something went wrong. 3D Bullet camera icon not loaded');

        }

    },
    loadThreeDDomeLiteCamera: function(){

        if( !editor.threeDDomeLiteCamera ) {
            
            var loader = new THREE.GLTFLoader();

            loader.load(

                // resource URL
                'assets/editorresources/Dome_3D_Lite.glb',
                // called when the resource is loaded
                function ( gltf ) {

                    editor.threeDDomeLiteCamera = gltf.scene;
                    gltf.animations; // Array<THREE.AnimationClip>
                    gltf.scene; // THREE.Scene
                    gltf.scenes; // Array<THREE.Scene>
                    gltf.cameras; // Array<THREE.Camera>
                    gltf.asset; // Object

                    gltf.scene.scale.set(0.25,0.25,0.25);
                    editor.threeDDomeLiteCamera.name = "threeDCameraModel";
                    editor.signals.sceneGraphChanged.dispatch();
                    
                },
                // called while loading is progressing
                function ( xhr ) {
            
                    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
            
                },
                // called when loading has errors
                function ( error ) {
            
                    console.log(error );
            
                }
            );

        } else{

            console.log('Something went wrong. 3D Box camera icon not loaded');

        }

    },

    loadThreeDBoxCamera: function(){

        if( !editor.threeDBoxCamera ) {

            var loader = new THREE.GLTFLoader();

            loader.load(
                // resource URL
                'assets/editorresources/Box_3D_Hitachi/ACTiBoxCamera.gltf',
                // called when the resource is loaded
                function ( gltf ) {

                    editor.threeDBoxCamera = gltf.scene;
                    gltf.animations; // Array<THREE.AnimationClip>
                    gltf.scene; // THREE.Scene
                    gltf.scenes; // Array<THREE.Scene>
                    gltf.cameras; // Array<THREE.Camera>
                    gltf.asset; // Object

                    gltf.scene.scale.set(0.25,0.25,0.25);
                    editor.threeDBoxCamera.name = "threeDCameraModel";
                    editor.signals.sceneGraphChanged.dispatch();
            
                },
                // called while loading is progressing
                function ( xhr ) {
            
                    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
            
                },
                // called when loading has errors
                function ( error ) {
            
                    console.log( 'An error happened' );
            
                }
            );

        } else{

            console.log('Something went wrong. 3D Box camera icon not loaded');

        }

    },
    loadThreeDBoxLiteCamera: function(){

        if( !editor.threeDBoxLiteCamera ) {
            
            var loader = new THREE.GLTFLoader();

            loader.load(

                // resource URL
                'assets/editorresources/ACTiBox_Camera_reduced.glb',
                // called when the resource is loaded
                function ( gltf ) {

                    editor.threeDBoxLiteCamera = gltf.scene;
                    gltf.animations; // Array<THREE.AnimationClip>
                    gltf.scene; // THREE.Scene
                    gltf.scenes; // Array<THREE.Scene>
                    gltf.cameras; // Array<THREE.Camera>
                    gltf.asset; // Object

                    gltf.scene.scale.set(0.25,0.25,0.25);
                    editor.threeDBoxLiteCamera.name = "threeDCameraModel";
                    editor.signals.sceneGraphChanged.dispatch();
                    
                },
                // called while loading is progressing
                function ( xhr ) {
            
                    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
            
                },
                // called when loading has errors
                function ( error ) {
            
                    console.log(error );
            
                }
            );

        } else{

            console.log('Something went wrong. 3D Box camera icon not loaded');

        }

    },


    loadThreeDPTZCamera: function(){

        if( !editor.threeDPTZCamera ) {

            var loader = new THREE.GLTFLoader();

            loader.load(
                // resource URL
                'assets/editorresources/PTZ_3D_Hitachi/SamsungPTZ.gltf',
                // called when the resource is loaded
                function ( gltf ) {

                    editor.threeDPTZCamera = gltf.scene;
                    gltf.animations; // Array<THREE.AnimationClip>
                    gltf.scene; // THREE.Scene
                    gltf.scenes; // Array<THREE.Scene>
                    gltf.cameras; // Array<THREE.Camera>
                    gltf.asset; // Object

                    gltf.scene.scale.set(0.25,0.25,0.25);
                    editor.threeDPTZCamera.name = "threeDCameraModel";
                    editor.signals.sceneGraphChanged.dispatch();
            
                },
                // called while loading is progressing
                function ( xhr ) {
            
                    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
            
                },
                // called when loading has errors
                function ( error ) {
            
                    console.log( 'An error happened' );
            
                }
            );

        } else{

            console.log('Something went wrong. 3D PTZ camera icon not loaded');

        }

    },
    loadThreeDPTZLiteCamera: function(){

        if( !editor.threeDPTZLiteCamera ) {

            var loader = new THREE.GLTFLoader();

            loader.load(
                // resource URL
                'assets/editorresources/PTZ_Lite.glb',
                // called when the resource is loaded
                function ( gltf ) {

                    editor.threeDPTZLiteCamera = gltf.scene;
                    gltf.animations; // Array<THREE.AnimationClip>
                    gltf.scene; // THREE.Scene
                    gltf.scenes; // Array<THREE.Scene>
                    gltf.cameras; // Array<THREE.Camera>
                    gltf.asset; // Object

                    gltf.scene.scale.set(0.25,0.25,0.25);
                    editor.threeDPTZLiteCamera.name = "threeDCameraModel";
                    editor.signals.sceneGraphChanged.dispatch();
            
                },
                // called while loading is progressing
                function ( xhr ) {
            
                    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
            
                },
                // called when loading has errors
                function ( error ) {
            
                    console.log( 'An error happened' );
            
                }
            );

        } else{

            console.log('Something went wrong. 3D PTZ camera icon not loaded');

        }

    },
    
    getRandomColor : function() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    },
    
    setArrowPosition: function( ArrowName ) {

        if( ArrowName == "right_arrow" )
        {

            return ( new THREE.Vector2(1,0.5) );

        } else if( ArrowName == "left_arrow" ) {

            return ( new THREE.Vector2(0.125,0.5) );

        }else if( ArrowName == "top_arrow" ) {

            return ( new THREE.Vector2(0.5,1) );

        } else if( ArrowName == "bottom_arrow" ) {

            return ( new THREE.Vector2(0.5,0.25) );

        } else if( ArrowName == "right_top_corner_arrow" ) {

            return ( new THREE.Vector2(0.9,0.7) );

        } else if( ArrowName == "left_top_corner_arrow" ) {

            return ( new THREE.Vector2(0.1,0.75) );

        } else if( ArrowName == "left_bottom_corner_arrow" ) {

            return ( new THREE.Vector2(0.1,0.3) );

        } else if( ArrowName == "right_bottom_corner_arrow" ) {

            return ( new THREE.Vector2(0.8,0.3) );

        }

    },

    alignArrowsForPreMarkers: function(preMarker,lastPoint,secondLastPoint) {
        
        preMarker.traverse( function( subChild ) {

            if( subChild instanceof THREE.Sprite && ( ( subChild.name === "2DDrawingSgmtStartIcon" ) || ( subChild.name === "2DDrawingStartIcon" ) ) ){

                var preMarkerIcon = editor.getStartArrowIcon(secondLastPoint,lastPoint);
                if( preMarkerIcon.name != subChild.userData.textureName ) {

                    preMarker.remove( subChild );
                    preMarkerIcon.needsUpdate = true;
                    var sprite = new THREE.Sprite( new THREE.SpriteMaterial( { map: preMarkerIcon } ) );
                    preMarker.add(sprite);
                    sprite.userData.textureName = preMarkerIcon.name;
                    sprite.position.y = 0.60;

                    if( subChild.name === "2DDrawingSgmtStartIcon" ) {

                        sprite.name = "2DDrawingSgmtStartIcon";
                        var arrowEndPosition = editor.setArrowPosition( preMarkerIcon.name )
                        sprite.center.copy( arrowEndPosition );

                    } else {

                        sprite.name = "2DDrawingStartIcon";

                    }
    
                    sprite.renderOrder = 10;

                }

            }

        } )

    },

    alignArrowsForPostMarker: function(postMarker,lastPoint,secondLastPoint) {
        
        postMarker.traverse( function( subChild ) {
                                                
            if( subChild instanceof THREE.Sprite && ( ( subChild.name === "2DDrawingSgmtEndIcon" ) || ( subChild.name === "2DDrawingEndIcon" ) ) ){
                
                var postMarkerIcon = editor.getEndArrowIcon(lastPoint,secondLastPoint);
                if( postMarkerIcon.name != subChild.userData.textureName ) {

                    postMarker.remove( subChild );
                    postMarkerIcon.needsUpdate = true;
                    var sprite = new THREE.Sprite( new THREE.SpriteMaterial( { map: postMarkerIcon } ) );
                    postMarker.add(sprite);
                    sprite.userData.textureName = postMarkerIcon.name;
                    sprite.position.y = 0.60;

                    if( subChild.name === "2DDrawingSgmtEndIcon" ) {

                        sprite.name = "2DDrawingSgmtEndIcon";
                        var arrowEndPosition = editor.setArrowPosition( postMarkerIcon.name )
                        sprite.center.copy( arrowEndPosition );

                    } else {

                        sprite.name = "2DDrawingEndIcon";

                    }
    
                    sprite.renderOrder = 10;

                }

            }

        } )
    },

    checkConnectionSpeed : function(){

        var isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
        if( isChrome && navigator && navigator.connection.downlink < 5 ){
            toastr.info( editor.languageData.YourConnectionAppearsToBeSlowThisWillTakeaMoment );
        }
    }

};