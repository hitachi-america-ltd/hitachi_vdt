/**
 * PreloadModel( editor ) - Constructor function for loading the preloaded models
 * @constructor
 * @param {any} editor - The instance of the Editor which manages the overall objects and signals
 * @author Mavelil
 * @returns {Object}
 * @example <caption>Example usage of PreloadModel</caption>
 * var preloadModel = new PreloadModel( editor );
 */
var PreloadModel = function(editor) {

    this.editor = editor;
    this.modelObj = {};
    this.workerInput = {};
    this.PreloadData = "";
    this.objectGroup = {};
    this.wwObjLoader2 = new THREE.OBJLoader2.WWOBJLoader2();
    this.objBuffer = "";
    this.mtlString = "";
    this.Validator = "";
    this.initPostGL();

    return this;

}
PreloadModel.prototype = {

    /*hitachiWarehouse: function() {

        var scope = this;
        scope.editor.progressBar.show();
        scope.modelObj.obj = 'preloadHitachiwarehouse.obj';
        scope.modelObj.mtl = 'preloadHitachiwarehouse.mtl';
        scope.modelObj.path = 'assets/json/9825e04cf6c5470f9d30945b50e305dc/';
        scope.workerInput = {
            "type": "objmtl",
            "path": scope.modelObj.path,
            "mtl": scope.modelObj.mtl,
            "obj": scope.modelObj.obj
        };
        $('#pre_uploaded_models').modal('hide');
        camera3d = '';
        camera3d = new THREE.PerspectiveCamera(33, 1, 1, 20);
        camera3d.name = 'PerspectiveCamera ' + (scope.editor.cameracount);
        camera3d.camCategory = "Bullet";
        camera3d.defFov = "Left";
        camera3d.opticalZoom = "2x";
        camera3d.digitalZoom = "4x";
        scope.editor.execute(new AddObjectCommand(camera3d));
        scope.editor.execute(new SetPositionCommand(camera3d, new THREE.Vector3(-10, 5, -0)));
        this.cameradetails = {
            model: "DI-CD322LEG",
            brand: "Hitachi"
        };
        scope.editor.signals.cameraAdded.dispatch(this.cameradetails)
        scope.PreloadData = new THREE.OBJLoader2.WWOBJLoader2.PrepDataFile(
            scope.workerInput.obj,
            scope.workerInput.path,
            scope.workerInput.obj,
            scope.workerInput.path,
            scope.workerInput.mtl
        );
        scope.objectGroup = new THREE.Group();
        scope.objectGroup.name =  scope.workerInput.obj;
        scope.PreloadData.setSceneGraphBaseNode(scope.objectGroup);
        scope.PreloadData.setStreamMeshes(true);
        scope.wwObjLoader2.setDebug(false);
        scope.wwObjLoader2.prepareRun(scope.PreloadData);
        scope.wwObjLoader2.run();
    },*/
    
    /**
     * office() - Method to load the office preloaded model.
     * @returns {Void}
     * @author Mavelil
     * @example <caption>Example usage of office method.</caption>
     * preloadModel.office( );
     */
    office :function (){
        var scope = this;

        var hAOV=63;
        var resolutionWidth = 1920;
        var resolutionHeight = 1080;
        var far = 39.40 ;
        //var distance = 39.40 ;
        var distance = 0 ;
        var minHorizontalAOV = 10;
        var aspectRatio = resolutionWidth/resolutionHeight;
        var vAOV = hAOV/aspectRatio;
        var minVerticalAOV = 10;
        var hView = 2 * distance * Math.tan( (hAOV/2) * (Math.PI/180) );
        var vView = 2 * distance * Math.tan( (vAOV/2) * (Math.PI/180) );


        scope.editor.progressBar.show();
        scope.modelObj.obj = 'office.obj';
        scope.modelObj.mtl = 'office.mtl';
        scope.modelObj.path = 'assets/json/office/';
        scope.camera3ad = '';
        scope.camera3ad = new THREE.PerspectiveCamera(vAOV, aspectRatio, 1, far );
        scope.camera3ad.name = 'PerspectiveCamera1';
        scope.camera3ad.camCategory = "Bullet";
        scope.camera3ad.defFov = "Left";
        scope.camera3ad.opticalZoom = "2x";
        scope.camera3ad.digitalZoom = "4x";
        scope.camera3ad.distance = distance;
        scope.camera3ad.resolutionWidth = resolutionWidth;
        scope.camera3ad.resolutionHeight = resolutionHeight;
        scope.camera3ad.hFOV = hAOV;
        scope.camera3ad.hView = hView;
        scope.camera3ad.vView = vView;
        scope.camera3ad.minVerticalAOV = minVerticalAOV;
        scope.camera3ad.minHorizontalAOV = minHorizontalAOV;
        scope.editor.execute(new AddObjectCommand(scope.camera3ad));
        scope.editor.execute(new SetPositionCommand(scope.camera3ad, new THREE.Vector3(-7.08, 4.60, 0.17)));
        scope.editor.execute(new SetRotationCommand(scope.camera3ad, new THREE.Euler(-0.4502949, -0.51783919, -0.29338985)));
        scope.cameradetails = {
            model: "DI-CD322LEG",
            brand: "Hitachi",
            "threeDModelType": "Bullet",
            "tiltRotationValue": 0,
            "panRotationValue": 0,
            "rollRotationValue": 0
        }
        scope.editor.signals.cameraAdded.dispatch(scope.cameradetails)
        //Modified to scale camera icon start
        editor.scaleCameraThreeDView( scope.camera3ad );
        scope.camera3d = '';
        scope.camera3d = new THREE.PerspectiveCamera(vAOV, aspectRatio, 1, far );
        scope.camera3d.name = 'PerspectiveCamera';
        scope.camera3d.camCategory = "Bullet";
        scope.camera3d.defFov = "Left";
        scope.camera3d.opticalZoom = "2x";
        scope.camera3d.digitalZoom = "4x";
        scope.camera3d.distance = distance;
        scope.camera3d.resolutionWidth = resolutionWidth;
        scope.camera3d.resolutionHeight = resolutionHeight;
        scope.camera3d.hFOV = hAOV;
        scope.camera3d.hView = hView;
        scope.camera3d.vView = vView;
        scope.camera3d.minVerticalAOV = minVerticalAOV;
        scope.camera3d.minHorizontalAOV = minHorizontalAOV;
        scope.editor.execute(new AddObjectCommand(scope.camera3d));
        scope.editor.execute(new SetPositionCommand(scope.camera3d, new THREE.Vector3(-11.32, 2.97, 10.25)));
        scope.editor.execute(new SetRotationCommand(scope.camera3d, new THREE.Euler(-1.4781193, -1.412495, -1.457699)));
        scope.cameradetails = {
            model: "DI-CD322LEG",
            brand: "Hitachi",
            "threeDModelType": "Bullet",
            "tiltRotationValue": 0,
            "panRotationValue": 0,
            "rollRotationValue": 0
        }
        scope.editor.signals.cameraAdded.dispatch(scope.cameradetails)
        //Modified to scale camera icon start
        editor.scaleCameraThreeDView( scope.camera3d );
        scope.workerInput = {
            "type": "objmtl",
            "path": scope.modelObj.path,
            "mtl": scope.modelObj.mtl,
            "obj": scope.modelObj.obj
        };
        $('#pre_uploaded_models').modal('hide');

        scope.PreloadData = new THREE.OBJLoader2.WWOBJLoader2.PrepDataFile(
            scope.workerInput.obj,
            scope.workerInput.path,
            scope.workerInput.obj,
            scope.workerInput.path,
            scope.workerInput.mtl
        );

        scope.objectGroup = new THREE.Group();
        scope.objectGroup.name = scope.workerInput.obj;
        scope.PreloadData.setSceneGraphBaseNode(scope.objectGroup);
        scope.PreloadData.setStreamMeshes(true);
        scope.wwObjLoader2.setDebug(false);
        scope.wwObjLoader2.prepareRun(scope.PreloadData);
        scope.wwObjLoader2.run();
    },

    /**
     * conferenceRoom() - Method to load the conferenceRoom preloaded model.
     * @returns {Void}
     * @author Pravi
     * @example <caption>Example usage of conferenceRoom method.</caption>
     * preloadModel.conferenceRoom( );
     */
    conferenceRoom : function(){
        var scope = this;
        scope.editor.progressBar.show();
        scope.modelObj.obj = 'conference_room.obj';
        scope.modelObj.mtl = 'conference_room.mtl';
        scope.modelObj.path = 'assets/json/conference-room/';
    
        scope.workerInput = {
            "type": "objmtl",
            "path": scope.modelObj.path,
            "mtl": scope.modelObj.mtl,
            "obj": scope.modelObj.obj
        };
        $('#pre_uploaded_models').modal('hide');
    
        scope.PreloadData = new THREE.OBJLoader2.WWOBJLoader2.PrepDataFile(
            scope.workerInput.obj,
            scope.workerInput.path,
            scope.workerInput.obj,
            scope.workerInput.path,
            scope.workerInput.mtl
        );
    
        scope.objectGroup = new THREE.Group();
        scope.objectGroup.name = scope.workerInput.obj;
        scope.editor.execute(new SetRotationCommand(scope.objectGroup, new THREE.Euler(-1.5708, 0, 0)));
    
        scope.PreloadData.setSceneGraphBaseNode(scope.objectGroup);
        scope.PreloadData.setStreamMeshes(true);
        scope.wwObjLoader2.setDebug(false);
        scope.wwObjLoader2.prepareRun(scope.PreloadData);
        scope.wwObjLoader2.run();
    },

    /**
     * telecomRoom() - Method to load the telecomRoom preloaded model.
     * @returns {Void}
     * @author Pravi
     * @example <caption>Example usage of telecomRoom method.</caption>
     * preloadModel.telecomRoom( );
     */
    telecomRoom : function(){
        var scope = this;
        scope.editor.progressBar.show();
        scope.modelObj.obj = 'telecom_room.obj';
        scope.modelObj.mtl = 'telecom_room.mtl';
        scope.modelObj.path = 'assets/json/telecom-room/';
    
        scope.workerInput = {
            "type": "objmtl",
            "path": scope.modelObj.path,
            "mtl": scope.modelObj.mtl,
            "obj": scope.modelObj.obj
        };
        $('#pre_uploaded_models').modal('hide');
    
        scope.PreloadData = new THREE.OBJLoader2.WWOBJLoader2.PrepDataFile(
            scope.workerInput.obj,
            scope.workerInput.path,
            scope.workerInput.obj,
            scope.workerInput.path,
            scope.workerInput.mtl
        );
    
        scope.objectGroup = new THREE.Group();
        scope.objectGroup.name = scope.workerInput.obj;
        scope.editor.execute(new SetRotationCommand(scope.objectGroup, new THREE.Euler(-1.5708, 0, 0)));
    
        scope.PreloadData.setSceneGraphBaseNode(scope.objectGroup);
        scope.PreloadData.setStreamMeshes(true);
        scope.wwObjLoader2.setDebug(false);
        scope.wwObjLoader2.prepareRun(scope.PreloadData);
        scope.wwObjLoader2.run();
    },

    /**
     * serviceCenter() - Method to load the serviceCenter preloaded model.
     * @returns {Void}
     * @author Pravi
     * @example <caption>Example usage of serviceCenter method.</caption>
     * preloadModel.serviceCenter( );
     */
    serviceCenter : function(){
        var scope = this;
        scope.editor.progressBar.show();
        scope.modelObj.obj = 'service_center.obj';
        scope.modelObj.mtl = 'service_center.mtl';
        scope.modelObj.path = 'assets/json/service-center/';
    
        scope.workerInput = {
            "type": "objmtl",
            "path": scope.modelObj.path,
            "mtl": scope.modelObj.mtl,
            "obj": scope.modelObj.obj
        };
        $('#pre_uploaded_models').modal('hide');
    
        scope.PreloadData = new THREE.OBJLoader2.WWOBJLoader2.PrepDataFile(
            scope.workerInput.obj,
            scope.workerInput.path,
            scope.workerInput.obj,
            scope.workerInput.path,
            scope.workerInput.mtl
        );
    
        scope.objectGroup = new THREE.Group();
        scope.objectGroup.name = scope.workerInput.obj;
        scope.editor.execute(new SetRotationCommand(scope.objectGroup, new THREE.Euler(-1.5708, 0, 0)));
    
        scope.PreloadData.setSceneGraphBaseNode(scope.objectGroup);
        scope.PreloadData.setStreamMeshes(true);
        scope.wwObjLoader2.setDebug(false);
        scope.wwObjLoader2.prepareRun(scope.PreloadData);
        scope.wwObjLoader2.run();
    },

    /*hitachiSecondFloor : function(){
        var scope = this;
        scope.editor.progressBar.show();
        scope.modelObj.obj = 'hitachiSecondFloor.obj';
        scope.modelObj.mtl = 'hitachiSecondFloor.mtl';
        scope.modelObj.path = 'assets/json/b7761b8570b54efc98fd3173769a802c/';

        scope.workerInput = {
            "type": "objmtl",
            "path": scope.modelObj.path,
            "mtl": scope.modelObj.mtl,
            "obj": scope.modelObj.obj
        };
        $('#pre_uploaded_models').modal('hide');

        scope.PreloadData = new THREE.OBJLoader2.WWOBJLoader2.PrepDataFile(
            scope.workerInput.obj,
            scope.workerInput.path,
            scope.workerInput.obj,
            scope.workerInput.path,
            scope.workerInput.mtl
        );

        scope.objectGroup = new THREE.Group();
        scope.objectGroup.name = scope.workerInput.obj;

        scope.PreloadData.setSceneGraphBaseNode(scope.objectGroup);
        scope.PreloadData.setStreamMeshes(true);
        scope.wwObjLoader2.setDebug(false);
        scope.wwObjLoader2.prepareRun(scope.PreloadData);
        scope.wwObjLoader2.run();
    },*/
    /*demothreeD : function(){

        var scope = this;
        scope.editor.progressBar.show();
        scope.modelObj.obj = 'preloadHitachifloor.obj';
        scope.modelObj.mtl = 'preloadHitachifloor.mtl';
        scope.modelObj.path = 'assets/json/Demo_3D/';
    
        scope.workerInput = {
            "type": "objmtl",
            "path": scope.modelObj.path,
            "mtl": scope.modelObj.mtl,
            "obj": scope.modelObj.obj
        };
        $('#pre_uploaded_models').modal('hide');
    
        scope.camera3d = '';
        scope.camera3d = new THREE.PerspectiveCamera(33, 1, 1, 20);
        scope.camera3d.name = 'PerspectiveCamera ';
        scope.camera3d.camCategory = "Bullet";
        scope.camera3d.defFov = "Left";
        scope.camera3d.opticalZoom = "2x";
        scope.camera3d.digitalZoom = "4x";
        scope.editor.execute(new AddObjectCommand(scope.camera3d));
        scope.editor.execute(new SetPositionCommand(scope.camera3d, new THREE.Vector3(-7.08, 4.60, 0.17)));
        scope.editor.execute(new SetRotationCommand(scope.camera3d, new THREE.Euler(-0.4502949, -0.51783919, -0.29338985)));
        scope.cameradetails = {
            model: "DI-CD322LEG",
            brand: "Hitachi"
        }
        scope.editor.signals.cameraAdded.dispatch(scope.cameradetails)

        scope.PreloadData = new THREE.OBJLoader2.WWOBJLoader2.PrepDataFile(
            scope.workerInput.obj,
            scope.workerInput.path,
            scope.workerInput.obj,
            scope.workerInput.path,
            scope.workerInput.mtl
        );
    
        scope.objectGroup = new THREE.Group();
        scope.objectGroup.name = scope.workerInput.obj;
    
        scope.PreloadData.setSceneGraphBaseNode(scope.objectGroup);
        scope.PreloadData.setStreamMeshes(true);
        scope.wwObjLoader2.setDebug(false);
        scope.wwObjLoader2.prepareRun(scope.PreloadData);
        scope.wwObjLoader2.run();

    },*/

    personOrLuggage: function ( position, name, object, scaleFactor ) {

        var scope = this;
        scope.editor.progressBar.show();
        if( object === "person" ){
            scope.modelObj.obj = 'DennisOptmisied.obj';
            scope.modelObj.mtl = 'DennisOptmisied.mtl';
            scope.modelObj.path = 'assets/json/Dennis/';
        }
        else if( object === "medium-luggage" || object === "large-luggage" ){

            scope.modelObj.obj = 'Bag3Finalized.obj';
            scope.modelObj.mtl = 'Bag3Finalized.mtl';
            scope.modelObj.path = 'assets/json/Bag/';

        }


        scope.workerInput = {
            "type": "objmtl",
            "path": scope.modelObj.path,
            "mtl": scope.modelObj.mtl,
            "obj": scope.modelObj.obj
        };
       

        scope.PreloadData = new THREE.OBJLoader2.WWOBJLoader2.PrepDataFile(
            scope.workerInput.obj,
            scope.workerInput.path,
            scope.workerInput.obj,
            scope.workerInput.path,
            scope.workerInput.mtl
        );

        scope.workerInput.obj

        scope.objectGroup = new THREE.Group();
        scope.objectGroup.position.copy( position );
          
        if( object === "person" ){
            scope.objectGroup.userData.type = "person";
        } else{
            
            if( object === "medium-luggage" ){
                scope.objectGroup.userData.type = "medium-luggage";
            } else if( object === "large-luggage" ){
                scope.objectGroup.userData.type = "large-luggage";
            }
        
        } 
        scope.objectGroup.scale.set( scaleFactor.x, scaleFactor.y, scaleFactor.z );
            
        scope.objectGroup.name = name;
        scope.objectGroup.userData.modelType = "not-a-base-model"   
        scope.PreloadData.setSceneGraphBaseNode(scope.objectGroup);
        scope.PreloadData.setStreamMeshes(true);
        scope.wwObjLoader2.setDebug(false);
        scope.wwObjLoader2.prepareRun(scope.PreloadData);
        scope.wwObjLoader2.run();

    },

    initPostGL: function() {

        var scope = this;
        scope.wwObjLoader2.setCrossOrigin('anonymous');
        scope.Validator = THREE.OBJLoader2.prototype._getValidator();
        scope.reportProgress = function(content) {
            var response = content;
            var splittedResp = response.split(":");
            var respMessage = splittedResp[0];
            if (respMessage.indexOf("Download of") !== -1) {
                var actualProgress = Number((splittedResp[splittedResp.length - 1].trim()).slice(0, -1));
                var evalProgress = (actualProgress * 0.8) / 100;
                scope.editor.progressBar.updateProgress(editor.languageData.Downloading , evalProgress);

            }
        };
        scope.materialsLoaded = function(materials) {

            var count = scope.Validator.isValid(materials) ? materials.length : 0;

        };

        scope.meshLoaded = function(name, bufferGeometry, material) {

            console.log('Loaded mesh: ' + name + ' Material name: ' + material.name);

        };

        scope.errorLoading = function() {

            alert("Sorry! an error occured");
            scope.editor.progressBar.hide();

        };

        scope.completedLoading = function(first, second, third) {

            var count = Math.abs((1.0 - 0.8) / 0.01);
            var progressVal = 0.80;
            (function loops() {
                scope.editor.progressBar.updateProgress(editor.languageData.Finishingtasks, progressVal);

                if (count > 0) {
                    count--;
                    progressVal += 0.01;
                    setTimeout(loops, 100);
                } else {

                    scope.editor.progressBar.hide();
                }

            })();

            scope.editor.execute(new AddObjectCommand(scope.objectGroup));
            for (var a = 0; a < scope.editor.scene.children.length; a++) {

                if (scope.editor.scene.children[a].type == 'Group' && scope.editor.scene.children[a].name == 'preloadHitachiwarehouse.obj') {

                    scope.editor.execute(new SetPositionCommand(editor.scene.children[a], new THREE.Vector3(-14, 2.81, 00)));
                    scope.editor.execute(new SetRotationCommand(editor.scene.children[a], new THREE.Euler(-1.5708, 0, 0)));
                    scope.editor.execute(new SetScaleCommand(editor.scene.children[a], new THREE.Vector3(2, 2, 2)));

                } else if (editor.scene.children[a].type == 'Group' && editor.scene.children[a].name == 'preloadHitachifloor.obj') {

                    scope.editor.execute(new SetPositionCommand(editor.scene.children[a], new THREE.Vector3(9.6, 0, 7.04)));
                    scope.editor.execute(new SetRotationCommand(editor.scene.children[a], new THREE.Euler(-1.5708, 0, 0)));
                    scope.editor.execute(new SetScaleCommand(editor.scene.children[a], new THREE.Vector3(2.58, 2.58, 2.58)));

                } else if (scope.editor.scene.children[a].type == 'Group' &&                  scope.editor.scene.children[a].name == 'office.obj') {

                } else if (scope.editor.scene.children[a].type == 'Group' && scope.editor.scene.children[a].name == 'hitachiSecondFloor.obj') {

                    scope.editor.execute(new SetPositionCommand(scope.editor.scene.children[a], new THREE.Vector3(40, 5, 15)));
                    scope.editor.execute(new SetRotationCommand(scope.editor.scene.children[a], new THREE.Euler(-1.5708, 0, 0)));
                    scope.editor.execute(new SetScaleCommand(scope.editor.scene.children[a], new THREE.Vector3(2.58, 2.58, 2.58)));

                }
            };
            /*scope.wwObjLoader2.registerCallbackProgress(scope.reportProgress);
            scope.wwObjLoader2.registerCallbackCompletedLoading(scope.completedLoading);
            scope.wwObjLoader2.registerCallbackMaterialsLoaded(scope.materialsLoaded);
            scope.wwObjLoader2.registerCallbackMeshLoaded(scope.meshLoaded);
            scope.wwObjLoader2.registerCallbackErrorWhileLoading(scope.errorLoading);
            console.log("scope.wwObjLoader2");
            console.log(scope.wwObjLoader2);
            return true;*/


        }
        scope.wwObjLoader2.registerCallbackProgress(scope.reportProgress);
        scope.wwObjLoader2.registerCallbackCompletedLoading(scope.completedLoading);
        scope.wwObjLoader2.registerCallbackMaterialsLoaded(scope.materialsLoaded);
        scope.wwObjLoader2.registerCallbackMeshLoaded(scope.meshLoaded);
        scope.wwObjLoader2.registerCallbackErrorWhileLoading(scope.errorLoading);
        return true;

    }

}