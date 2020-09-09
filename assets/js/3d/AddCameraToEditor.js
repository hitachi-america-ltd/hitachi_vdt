/**
 * AddCameraToEditor( editor ) : Constructor for adding camera to the editor
 * @constructor
 * @param {any} editor - The instance of the Editor which manages the overall objects and signals
 * @returns {Object}
 * @author Mavelil
 * @example <caption>Example usage of AddCameraToEditor</caption>
 * var addCameraToEditor = new AddCameraToEditor( editor );
 */
var AddCameraToEditor = function(editor){

    this.editor = editor;
    this.cameraCount = 0;
    this.selectedObject = "";
    this.box = new THREE.Box3();
    this.previousPosition = null;
    this.previousBoundingBoxCenter = new THREE.Vector3(0,0,0);

    return this;
}
AddCameraToEditor.prototype={
   
    /**
     * addPerspectiveCamera( ) - Method to add a perspective camera. 
     * @returns {Void}
     * @author Mavelil
     * @example <caption>Example usage of addPerspectiveCamera method.</caption>
     * addCameraToEditor.addPerspectiveCamera( );
     */

    addPerspectiveCamera:function(){

        var scope = this;
        scope.cameraCount = 0;
        var editorChildLength = scope.editor.scene.children.length;
        for(var a =0 ;a< editorChildLength; a++){

            if(scope.editor.scene.children[a].type == 'PerspectiveCamera'){
                
                scope.cameraCount++;
            }	
        }
        var sceneBox = scope.box;
        sceneBox.setFromObject( scope.editor.scene );
        const center = new THREE.Vector3();
        var sceneWidth = sceneBox.getSize( center ).x;
        sceneWidth = ( sceneWidth<10   ) ? 10 : sceneWidth;
        var far = sceneWidth;
        //var distance = sceneWidth;
        var distance = 0;
        var hAOV=63;
        var resolutionWidth = 1920;
        var resolutionHeight = 1080;
        var minHorizontalAOV = 10;
        var aspectRatio = resolutionWidth/resolutionHeight;
        var vAOV = hAOV/aspectRatio;
        var hView = 2 * distance * Math.tan( (hAOV/2) * (Math.PI/180) );
        var vView = 2 * distance * Math.tan( (vAOV/2) * (Math.PI/180) );

        var camera = new THREE.PerspectiveCamera(vAOV, aspectRatio, 1, far );
        if(scope.editor.scene.userData.cameraDeletedNumber != undefined  ) {
            scope.editor.cameraDeletedNumber = scope.editor.scene.userData.cameraDeletedNumber.deletedCamArray;
        } 
        if( scope.editor.cameraDeletedNumber.length == 0){
    
            var tagName = scope.editor.cameracount;
            tagName++
            camera.name = 'Camera' + (tagName);
            scope.cameradetails = {model: "DI-CD322LEG", brand: "Hitachi","threeDModelType": "Bullet", "tiltRotationValue": 0, "panRotationValue": 0, "rollRotationValue": 0}
            camera.camCategory = "Bullet";
            camera.defFov = "Left";
            camera.opticalZoom = "2x";
            camera.digitalZoom = "4x";
            camera.distance = distance;
            camera.minHorizontalAOV = minHorizontalAOV;
            camera.resolutionWidth = resolutionWidth;
            camera.resolutionHeight = resolutionHeight;
            camera.hFOV = hAOV;
            camera.hView = hView;
            camera.vView = vView;
            scope.addCameraToTop( camera);

        }
        else{
            
            var lastIndex = scope.editor.cameraDeletedNumber.length
            var value = scope.editor.cameraDeletedNumber[lastIndex-1];
            //value = value -1;
            camera.name = 'Camera' + (value);
            scope.cameradetails = {model: "DI-CD322LEG", brand: "Hitachi" ,"threeDModelType": "Bullet", "tiltRotationValue": 0, "panRotationValue": 0, "rollRotationValue": 0}
            camera.camCategory = "Bullet";
            camera.defFov = "Left";
            camera.opticalZoom = "2x";
            camera.digitalZoom = "4x";
            camera.distance = distance;
            camera.minHorizontalAOV = minHorizontalAOV;
            camera.resolutionWidth = resolutionWidth;
            camera.resolutionHeight = resolutionHeight;
            camera.hFOV = hAOV;
            camera.hView = hView;
            camera.vView = vView;
            scope.addCameraToTop( camera );
            
        }     

        editor.signals.addReferencePoint.dispatch( camera );

    },

    /**
     * addLidarCamera( ) - Method to add a LiDAR camera 
     * @returns {Void}
     * @author Mavelil
     * @example <caption>Example usage of addLidarCamera method.</caption>
     * addCameraToEditor.addLidarCamera( );
     */

    addLidarCamera:function(){

        var scope = this;
        scope.cameraCount = 0;

        var editorChildLength = scope.editor.scene.children.length;
        if(scope.editor.scene.userData.cameraDeletedNumber != undefined  ) {
            scope.editor.cameraDeletedNumber = scope.editor.scene.userData.cameraDeletedNumber.deletedCamArray;
        } 
        for(var a =0 ;a< editorChildLength; a++){

            if(scope.editor.scene.children[a].type == 'PerspectiveCamera'){
                
                scope.cameraCount++;
            }	
        }
        /*var sceneBox = scope.box;
        sceneBox.setFromObject( scope.editor.scene );
        const center = new THREE.Vector3();
        var sceneWidth = sceneBox.getSize( center ).x;
        sceneWidth = ( sceneWidth<10   ) ? 10 : sceneWidth;
        var far = sceneWidth;
        var distance = sceneWidth;*/
        var targetDistance = (editor.commonMeasurements.targetUnit == "meter") ? 10 : 32.80;
        var far = targetDistance /  editor.commonMeasurements.targetConversionFactor;
        //var distance = targetDistance / editor.commonMeasurements.targetConversionFactor;
        var distance = 0;
        var hAOV = 60;
        var resolutionWidth = 240;
        var resolutionHeight = 320;
        var minHorizontalAOV = 10;
        var aspectRatio = resolutionWidth/resolutionHeight;
        var vAOV = 80;
        var hView = 2 * distance * Math.tan( (hAOV/2) * (Math.PI/180) );
        var vView = 2 * distance * Math.tan( (vAOV/2) * (Math.PI/180) );

        var camera = new THREE.PerspectiveCamera( vAOV, aspectRatio, 1, far );
        //camera.iconUrl= 'assets/img/lidar_black_256.png';
        camera.iconUrl= 'assets/img/lidar_lfom5.jpg';
        
        if( scope.editor.cameraDeletedNumber.length == 0){
            var tagName = scope.editor.cameracount;
            camera.name = "3D LiDAR LFOM5";    
            camera.camCategory = "LiDAR";
            scope.cameradetails = {model: "3D LiDAR LFOM5", brand: "Hitachi", "threeDModelType": "LiDAR", "alignment": "top", "tiltRotationValue": -45, "panRotationValue": 0, "rollRotationValue": 0,  "flipped" : "un-flipped"};
            //camera.defFov = "Left";
            camera.opticalZoom = "1x";
            camera.digitalZoom = "1x";
            camera.distance = distance;
            camera.minHorizontalAOV = minHorizontalAOV;
            camera.resolutionWidth = resolutionWidth;
            camera.resolutionHeight = resolutionHeight;
            camera.hFOV = hAOV;
            camera.hView = hView;
            camera.vView = vView;
            scope.addCameraToTop( camera);
            //scope.editor.execute( new SetRotationCommand( camera, new THREE.Euler( ( -45 * ( Math.PI / 180 ) ), 0, 0 ) ) );
            //scope.editor.execute( new SetRotationCommand( camera, new THREE.Euler( 0, 0, 0 ) ) );
            scope.editor.execute( new SetRotationCommand( camera, new THREE.Euler( THREE.Math.degToRad(-45), 0, 0 ) ) );
        }
        else{
            var lastIndex = scope.editor.cameraDeletedNumber.length
            var value = scope.editor.cameraDeletedNumber[lastIndex-1];
            //value = value -1;
            camera.camCategory = "LiDAR";
            //camera.name = 'LiDAR ' + (value);
            camera.name = "3D LiDAR LFOM5";
            scope.cameradetails = {model: "3D LiDAR LFOM5", brand: "Hitachi", "threeDModelType": "LiDAR", "alignment": "top", "tiltRotationValue": -45, "panRotationValue": 0, "rollRotationValue": 0, "flipped" : "un-flipped"};
            //camera.defFov = "Left";
            camera.opticalZoom = "1x";
            camera.digitalZoom = "1x";
            camera.distance = distance;
            camera.minHorizontalAOV = minHorizontalAOV;
            camera.resolutionWidth = resolutionWidth;
            camera.resolutionHeight = resolutionHeight;
            camera.hFOV = hAOV;
            camera.hView = hView;
            camera.vView = vView;
            scope.addCameraToTop( camera);
            //scope.editor.execute( new SetRotationCommand( camera, new THREE.Euler( ( -45 * ( Math.PI / 180 ) ), 0, 0 ) ) );
            scope.editor.execute( new SetRotationCommand( camera, new THREE.Euler( THREE.Math.degToRad(-45), 0, 0 ) ) );
        }

        editor.signals.addReferencePoint.dispatch( camera );
        
    },

    /**
     * addSelectPerspectiveCamera( Data ) - Method to add a perspective camera with custom properties. 
     * @param {Object} Data - The object containing camera details
     * @returns {Void}
     * @author Mavelil
     * @example <caption>Example usage of addSelectPerspectiveCamera method.</caption>
     * addCameraToEditor.addSelectPerspectiveCamera( Data );
     */

    addSelectPerspectiveCamera : function(Data){
        
        var scope = this;
        if(scope.editor.scene.userData.cameraDeletedNumber != undefined  ) {
            scope.editor.cameraDeletedNumber = scope.editor.scene.userData.cameraDeletedNumber.deletedCamArray;
        } 
        var selectedCameraData = Data.selectedcam;
        var selectedCameraFullData = Data.fullcamData;
        scope.cameraCount = 0;
        var length = selectedCameraData.length;
        var sceneBox = scope.box;
        sceneBox.setFromObject( scope.editor.scene );
        const center = new THREE.Vector3();
        var sceneWidth = sceneBox.getSize( center ).x;
        var camCategory


        var name = selectedCameraData[3]+" "+selectedCameraData[2];
        var iconURL = selectedCameraData[4];
        var defFOV = selectedCameraData[6];
        if( selectedCameraData[5].split(" ")[1] == "Lite" ){

            camCategory = selectedCameraData[5].split(" ")[0];
            var isCameraLite = "true";

        }else{

            camCategory  = selectedCameraData[5];
            var isCameraLite = "false";
            
        }

        if( selectedCameraData[5] === "Hitachi LFOM5" || selectedCameraData[5] === "Intel RealSense L515" || selectedCameraData[5] === "HLS-LFOM3" || selectedCameraData[5] === "HLS-LFOM1"  ){

            camCategory = "LiDAR";
            var sensorCategory = selectedCameraData[5];

        }  
       
        var opticalZoom = selectedCameraData[7];
        var digitalZoom = selectedCameraData[8];
        var hAOV = selectedCameraData[0];
        var minHorizontalAOV = selectedCameraData[1];
        var resolutionWidth = selectedCameraData[9];
        var resolutionHeight = selectedCameraData[10];
        var hView, vView, far, vAOV;

        var distance;

        var maxVerticalAOV = selectedCameraData[11];
        var minVerticalAOV = selectedCameraData[12];

        sceneWidth = ( sceneWidth<10   ) ? 10 : sceneWidth;
        hAOV = ( isNaN(hAOV) ) ? 60 : hAOV;
        //minHorizontalAOV = ( isNaN(minHorizontalAOV) ||  minHorizontalAOV<10 ) ? 10 : minHorizontalAOV;
        resolutionWidth = ( isNaN(resolutionWidth) ) ? 1920 : resolutionWidth;
        resolutionHeight = ( isNaN(resolutionHeight) ) ? 1080 : resolutionHeight;

        var far = sceneWidth;

        if( camCategory === "LiDAR" ){

            if( sensorCategory === "Hitachi LFOM5" )
                far = 13;
            
            else if( sensorCategory === "HLS-LFOM1" || sensorCategory === "HLS-LFOM3" )
                far = 10;

            else if( sensorCategory === "Intel RealSense L515" )
                far = 9;
        }

        //distance = sceneWidth;
        distance = 0;

        var aspectRatio = resolutionWidth/resolutionHeight;
        var editorChildLength = scope.editor.scene.children.length;

        for(var a =0 ;a< editorChildLength; a++){

            if( scope.editor.scene.children[a].type == 'PerspectiveCamera' ){
                
                scope.cameraCount++;
            }	
        }
        //Modified for adding fisheye from 'Select Camera' start
        if( camCategory!=undefined && camCategory == "Fisheye" ){

            far = 10;
            //distance=10;
            distance=0;
            var vAOV = hAOV / aspectRatio ;
            hView = 2 * distance * Math.tan( (hAOV/2) * (Math.PI/180) );
            vView = 2 * distance * Math.tan( (vAOV/2) * (Math.PI/180) );
            var camera = new THREE.PerspectiveCamera( 140, aspectRatio, 1,far);

        }
        else if( camCategory!=undefined && camCategory == "Panorama" ){
            
            var camera = new THREE.PerspectiveCamera( 360, 1, 1, far );

        }
        else{
            if( maxVerticalAOV == undefined || maxVerticalAOV == "" ){
                
                var vAOV =   hAOV  / aspectRatio ;
                hView = 2 * distance * Math.tan( (hAOV/2) * (Math.PI/180) );
                vView = 2 * distance * Math.tan( (vAOV/2) * (Math.PI/180) );
                var camera = new THREE.PerspectiveCamera( vAOV, aspectRatio, 1,far );
                maxVerticalAOV = vAOV;
            }
            else{
                
                hView = 2 * distance * Math.tan( (hAOV/2) * (Math.PI/180) );
                vView = 2 * distance * Math.tan( (maxVerticalAOV/2) * (Math.PI/180) );
                var camera = new THREE.PerspectiveCamera( maxVerticalAOV, aspectRatio, 1,far );
            }
            
        }
        //Modified for adding fisheye from 'Select Camera' end
        camera.name = name;
        camera.iconUrl = iconURL;
        camera.defFov = defFOV;
        camera.opticalZoom = opticalZoom;
        camera.digitalZoom = digitalZoom;
        camera.distance = distance;
        camera.resolutionWidth = resolutionWidth;
        camera.resolutionHeight = resolutionHeight;
        camera.hFOV = hAOV;
        camera.maxVerticalAOV = maxVerticalAOV;
        camera.minVerticalAOV = minVerticalAOV;
        camera.minHorizontalAOV = minHorizontalAOV;
        camera.hView = hView;
        camera.vView = vView;

        //Adding the camera category to the THREE.PerspectiveCamera object
        camera.camCategory = camCategory;
        camera.isCameraLite = isCameraLite;
        camera.sensorCategory = sensorCategory;
        
        this.cameradetails = { "model":selectedCameraData[2], "brand":selectedCameraData[3], "threeDModelType": camCategory, "alignment" : "top", "tiltRotationValue": 0, "panRotationValue": 0, "rollRotationValue": 0 , "isCameraLite" : isCameraLite };

       /* if(selectedCameraData[6] == "Dome" || selectedCameraData[6] == "dome"|| selectedCameraData[6] == "DOME" ){

            scope.editor.execute( new SetRotationCommand( camera, new THREE.Euler( -1.57, 0, 0 ) ) );
        }*/
        if(selectedCameraData[6]!= undefined)
        var defFovInLowerCase = defFOV.toLowerCase();
        if( camera.camCategory != "LiDAR" ){
            if(defFovInLowerCase == "bottom")
            scope.editor.execute( new SetRotationCommand( camera, new THREE.Euler( -1.57, 0, 0 ) ) );
            else if(defFovInLowerCase == "top")
            scope.editor.execute( new SetRotationCommand( camera, new THREE.Euler( 1.57, 0, 0 ) ) );
            else if(defFovInLowerCase == "left")
            scope.editor.execute( new SetRotationCommand( camera, new THREE.Euler( 0, 3.14, 0 ) ) );
            else if(defFovInLowerCase == "right")
            scope.editor.execute( new SetRotationCommand( camera, new THREE.Euler( 0, 0, 0 ) ) );
            else if(defFovInLowerCase == "front")
            scope.editor.execute( new SetRotationCommand( camera, new THREE.Euler( 0, -1.57, 0 ) ) );
            else if(defFovInLowerCase == "back")
            scope.editor.execute( new SetRotationCommand( camera, new THREE.Euler( 0, 1.57, 0 ) ) );
        }
        // else if( selectedCameraData[5] === "Hitachi LFOM5" ){
            else if( camCategory == "LiDAR" ){
            this.cameradetails = { "model":selectedCameraData[2], "brand":selectedCameraData[3], "threeDModelType": camCategory, "alignment" : "top", "tiltRotationValue": -45, "panRotationValue": 0, "rollRotationValue": 0 };
            scope.editor.execute( new SetRotationCommand( camera, new THREE.Euler( THREE.Math.degToRad(-45), 0, 0 ) ) );
            }
        // } else if( selectedCameraData[5] === "Intel RealSense L515" ){
        //     this.cameradetails = { "model":selectedCameraData[2], "brand":selectedCameraData[3], "threeDModelType": camCategory, "alignment" : "top", "tiltRotationValue": 0, "panRotationValue": 0, "rollRotationValue": 0 }
        // }

        if( camera.camCategory != undefined && ( camera.camCategory == "Panorama" ) )
            scope.addCameraToScene(camera);
        else  
            scope.addCameraToTop(camera);
        editor.signals.addReferencePoint.dispatch( camera );
    
    },
    
    /**
     * addCameraToScene( camera ) - Method to add a camera to the scene
     * @param {Object<THREE.PerspectiveCamera>} camera - The camera to be added
     * @returns {Void}
     * @author Mavelil
     * @example <caption>Example usage of addCameraToScene method.</caption>
     * addCameraToEditor.addCameraToScene( camera );
     */

    addCameraToScene : function( camera ){
        var scope = this;
        scope.editor.execute( new AddObjectCommand( camera ) );
        scope.editor.signals.cameraAdded.dispatch(scope.cameradetails);
        scope.editor.camera_array.push(camera);  
        scope.editor.select( camera );
        if( editor.isFloorplanViewActive === false ){
            editor.scaleCameraThreeDView( camera );
        } 
        else{
            editor.scaleCameraOrthographicView( camera );
        }
    },

    /**
     * addPositionCameraGenerating( positionData ) - Method to add a camera which looks at a particular position
     * @param {Array<Object>} positionData - Array of objects containing the camera details
     * @returns {Void}
     * @author Mavelil
     * @example <caption>Example usage of addPositionCameraGenerating method.</caption>
     * addCameraToEditor.addPositionCameraGenerating( positionData );
     */

    addPositionCameraGenerating : function(positionData){

        var scope = this;
        editor.setCamera = 0 ;
        editor.setCameraRotation = 1
       /* for(var i=0;i<positionData.length;i++){
            camera3ad = new THREE.PerspectiveCamera(20, 1, 1, 50);
            if( scope.editor.cameraDeletedNumber.length ==0 ){
                camera3ad.name = 'PerspectiveCamera ' + ( scope.editor.cameracount );
            }
            else
            {
                var lastIndex = scope.editor.cameraDeletedNumber.length
                var value = scope.editor.cameraDeletedNumber[lastIndex-1];
                value = value -1;
                camera3ad.name = 'PerspectiveCamera ' + (value);
            }
                //camera3ad.name = 'PerspectiveCamera'+editor.cameracount;
                scope.editor.execute(new AddObjectCommand(camera3ad));
                scope.editor.execute(new SetPositionCommand(camera3ad,positionData[i].position
            ));
            var cameradetails = { model: "DI-CB320G", brand: "Hitachi" }
            scope.editor.signals.cameraAdded.dispatch(cameradetails)
            scope.editor.execute(new RemoveObjectCommand(positionData[i]));
    
        }   */
        var sceneBox = scope.box;
        sceneBox.setFromObject( scope.editor.scene );
        const center = new THREE.Vector3();
        var sceneWidth = sceneBox.getSize( center ).x;
        sceneWidth = ( sceneWidth<10   ) ? 10 : sceneWidth;
        var far = sceneWidth;
        //var distance = sceneWidth;
        var distance = 0;
        var hAOV = 63;
        var resolutionWidth = 1920;
        var resolutionHeight = 1080;
        var minHorizontalAOV = 10;
        var aspectRatio = resolutionWidth/resolutionHeight;
        var vAOV =   hAOV / aspectRatio ;
        //var vAOV = hAOV/aspectRatio;
        var hView = 2 * distance * Math.tan( (hAOV/2) * (Math.PI/180) );
        var vView = 2 * distance * Math.tan( (vAOV/2) * (Math.PI/180) );

        for(var i=0;i<positionData.length;i++){
            camera3ad = new THREE.PerspectiveCamera( vAOV, aspectRatio, 1, far );
            var currentObject = editor.cameraGeneratingPositionAndLook[positionData[i].uuid] ;
            if( scope.editor.cameraDeletedNumber.length ==0 ){
                
                camera3ad.name = 'PerspectiveCamera ' + ( scope.editor.cameracount );
                camera3ad.defFov = "Left";
                camera3ad.opticalZoom = "2x";
                camera3ad.digitalZoom = "4x";
                camera3ad.distance = distance;
                camera3ad.resolutionWidth = resolutionWidth;
                camera3ad.resolutionHeight = resolutionHeight;
                camera3ad.hFOV = hAOV;
                camera3ad.minHorizontalAOV = minHorizontalAOV;
                camera3ad.hView = hView;
                camera3ad.vView = vView;
            }
            else
            {
                var lastIndex = scope.editor.cameraDeletedNumber.length
                var value = scope.editor.cameraDeletedNumber[lastIndex-1];
                value = value -1;
                camera3ad.name = 'PerspectiveCamera ' + (value);
                camera3ad.defFov = "Left";
                camera3ad.opticalZoom = "2x";
                camera3ad.digitalZoom = "4x";
                camera3ad.distance = distance;
                camera3ad.resolutionWidth = resolutionWidth;
                camera3ad.resolutionHeight = resolutionHeight;
                camera3ad.hFOV = hAOV;
                camera3ad.minHorizontalAOV = minHorizontalAOV;
                camera3ad.hView = hView;
                camera3ad.vView = vView;
            }
                //camera3ad.name = 'PerspectiveCamera'+editor.cameracount;

                scope.editor.execute(new AddObjectCommand(camera3ad));
                scope.editor.execute(new SetPositionCommand(camera3ad,positionData[i].position
            ));
            var cameradetails = { model: "DI-CB320G", brand: "Hitachi" }
            scope.editor.signals.cameraAdded.dispatch(cameradetails)
            scope.editor.execute(new RemoveObjectCommand(positionData[i]));
        
            if(currentObject != undefined && currentObject.LookObject.uuid != undefined ){

                scope.editor.execute(new RemoveObjectCommand(currentObject.LookObject));
                camera3ad.lookAt(currentObject.LookObject.position);
            }
           
        } 
        editor.cameraGeneratingPosition = [];
        //scope.removeLineFromEditor();


    },

    /**
     * addCameraToTop( camera ) - Method to add a camera to the top of the model
     * @param {Object<THREE.PerspectiveCamera>} camera - Camera to be added
     * @returns {Void}
     * @author Mavelil
     * @example <caption>Example usage of addCameraToTop method.</caption>
     * addCameraToEditor.addCameraToTop( camera );
     */

    addCameraToTop : function(camera){

        var scope = this ;
        var objectBox = scope.box;
        const center = new THREE.Vector3();
        var cameraVector = new THREE.Vector3(0,0,0);
        var boundingBoxCenter = "";  
    
        if(  scope.selectedObject == scope.editor.selected  && (scope.editor.selected != null) ) {

            objectBox.setFromObject(scope.editor.selected);
            scope.box = objectBox;
            center.y = objectBox.max.y;
            boundingBoxCenter = objectBox.getCenter( center );
            scope.selectedObject = scope.editor.selected;

            if(  scope.previousBoundingBoxCenter.equals(boundingBoxCenter) ){

                scope.previousBoundingBoxCenter = boundingBoxCenter;
                scope.previousPosition.x = scope.previousPosition.x+2.5;
                if(scope.box.containsPoint( scope.previousPosition )){
                        
                    camera.position.set( scope.previousPosition.x , scope.previousPosition.y , scope.previousPosition.z );
                    //camera.lookAt( boundingBoxCenter );
                    camera.lookAt( new THREE.Vector3( scope.previousPosition.x , boundingBoxCenter.y , scope.previousPosition.z  ))
                    scope.editor.execute( new AddObjectCommand( camera ) );
                    scope.editor.signals.cameraAdded.dispatch(scope.cameradetails)
                    scope.editor.camera_array.push(camera);  
                    scope.editor.select( scope.selectedObject ) 
                }
                else{

                    scope.previousPosition.x = scope.box.min.x
                    camera.position.set( scope.previousPosition.x , scope.previousPosition.y , scope.previousPosition.z );
                    //camera.lookAt( boundingBoxCenter );
                    camera.lookAt( new THREE.Vector3( scope.previousPosition.x , boundingBoxCenter.y , scope.previousPosition.z ))
                    scope.editor.execute( new AddObjectCommand( camera ) );
                    scope.editor.signals.cameraAdded.dispatch(scope.cameradetails)
                    scope.editor.camera_array.push(camera);  
                    scope.editor.select( scope.selectedObject ) 
                }
            }
            else{

                scope.previousBoundingBoxCenter = boundingBoxCenter;
                cameraVector.x = boundingBoxCenter.x;
                cameraVector.y = objectBox.max.y;
                cameraVector.z = boundingBoxCenter.z;
                scope.previousPosition = new THREE.Vector3(cameraVector.x , cameraVector.y , cameraVector.z )
                camera.position.set( cameraVector.x , cameraVector.y , cameraVector.z );
                //camera.lookAt( boundingBoxCenter );
                camera.lookAt( new THREE.Vector3( cameraVector.x, boundingBoxCenter.y , cameraVector.z ))
                scope.editor.execute( new AddObjectCommand( camera ) );
                scope.editor.signals.cameraAdded.dispatch(scope.cameradetails)
                scope.editor.camera_array.push(camera);  
                scope.editor.select( scope.selectedObject )  
            }

        }
        else{
           
            scope.selectedObject = scope.editor.selected;
            scope.previousPosition = null;
            if( scope.selectedObject != null ){

                if(scope.selectedObject.type == 'Group' || scope.selectedObject.type == 'Mesh' && scope.selectedObject != null ) {

                    objectBox.setFromObject(scope.selectedObject);
                    boundingBoxCenter = objectBox.getCenter( center );
                    scope.previousBoundingBoxCenter = boundingBoxCenter;
                    cameraVector.x = boundingBoxCenter.x;
                    cameraVector.y = objectBox.max.y;
                    cameraVector.z = boundingBoxCenter.z;
                    scope.previousPosition = new THREE.Vector3(cameraVector.x , cameraVector.y , cameraVector.z )
                    camera.position.set( cameraVector.x , cameraVector.y , cameraVector.z );
                    //camera.lookAt( boundingBoxCenter );
                    // camera.lookAt( new THREE.Vector3( cameraVector.x, boundingBoxCenter.y , cameraVector.z ))
                    scope.editor.execute( new AddObjectCommand( camera ) );
                    scope.editor.signals.cameraAdded.dispatch(scope.cameradetails)
                    scope.editor.camera_array.push(camera);  
                    scope.editor.select( scope.selectedObject )                
                }
                else{
          
                    scope.editor.execute( new AddObjectCommand( camera ) );
                    scope.editor.signals.cameraAdded.dispatch(scope.cameradetails)
                    scope.editor.camera_array.push(camera);
                }
            }
            else{
  
                scope.editor.execute( new AddObjectCommand( camera ) );
                scope.editor.signals.cameraAdded.dispatch(scope.cameradetails)
                scope.editor.camera_array.push(camera);
            }

        } 

        if( editor.isFloorplanViewActive === false ){
            
            editor.scaleCameraThreeDView( camera );
            //scope.editor.scaleAllIcons();
            // **Commented when the camera icons sprite were replaced with plane Start**
            /*var key = editor.sceneCameras[ editor.sceneCameras.length - 1 ];
            editor.getNumberBadgeIcon( { badgeText: key.badgeText, type: "image" } ).then(

                function( icon ) {

                    key.children[ 0 ].material.map = icon; 
                    editor.signals.sceneGraphChanged.dispatch();

                },
                function( err ) {

                    console.log( "Failed to change camera icon" );

                }

            );
            // **Commented when the camera icons sprite were replaced with plane End**
        }
         */

        } else{

            //editor.orthographicScale();
            editor.scaleCameraOrthographicView( camera );

        }
    
    }
    /*,
    removeLineFromEditor : function(){

        var len = editor.cameraGeneratingLines.length;
        for(var i = 0; i < len ; i++  ){

           editor.execute(new RemoveObjectCommand(editor.cameraGeneratingLines[i])); 
           if( i == len-1 ){

                editor.cameraGeneratingLines = [];
            }
        }
        editor.cameraGeneratingPosition = [];                                
    }*/
}