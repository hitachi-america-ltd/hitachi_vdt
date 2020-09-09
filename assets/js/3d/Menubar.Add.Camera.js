/**
 * Menubar.Add.Camera( editor ) : Constructor for adding camera option in the menubar
 * @constructor
 * @param {any} editor - The instance of the Editor which manages the overall objects and signals
 * @returns {Object<UI.Panel>}
 * @author Pravi
 * @example <caption>Example usage of Menubar.Add.Camera</caption>
 * var menubarAddCamera = new Menubar.Add.Camera( editor );
 */

Menubar.Add.Camera = function( editor ){

    var editCamData;
    var Selectcamera;
    var camToEditor = new AddCameraToEditor(editor);
    var addspec = new AddNewSpecCamera( editor );
    var addspecModal = addspec.createModal();
    this.editor = editor;
	var scope = this;
	// update camera Data 

	var updateCamera = new UpdateCameraSpec (editor,addspecModal);
	updateCamera.setUpadteFeilds();
	
	function upadteAllModels(){

		updateCamera.getAllCameraInDb().then (function( allCamera ){

            //getCameraDeatils( allCamera );
            editor.allCameraDetails = allCamera;
			Selectcamera = new SelectedCamera( allCamera , editor);
            editor.camspecfull = allCamera;
            modalcamera = Selectcamera.createmodal();
			updateCamera.createCameraModalUseNewCamera( Selectcamera  ).then(function( getModalcamera){
		
				var button = document.getElementById('selectCameraBtn');
				button.onclick = function() {
	
					var cameraObject = Selectcamera.getcameraDetails();
					camToEditor.addSelectPerspectiveCamera(cameraObject)
				}	   
				document.getElementById('RemoveaddspeceachCameraSubmit').onclick = function() {
	
					updateCamera.removeCamera( editCamData  );
				}
				document.getElementById('UpdateaddspeceachCameraSubmit').onclick = function() {
	
					updateCamera.updateCameraFromData( editCamData );
				}
	
			})
	
			
		})
		.catch( function( allCameraError ){ 
	
			console.log( "Some error in the camera Db" );
		})
	

	}


    upadteAllModels();
    
    /*signals*/
    editor.signals.editorCleared.add(function() {
        editor.scene.userData = {};
        camera3d = null,
        meshCount = 0;
        lightCount = 0;
        cameraCount = 0;
        editor.pivot.matrixAutoUpdate = true;
        var geometry = new THREE.BoxBufferGeometry(0.5, 0.5, 0.5);
        var material = new THREE.MeshBasicMaterial({
            color: 0xffff00
        });
        editor.pivot = new THREE.Mesh(geometry, material);
        editor.pivot.name = 'EditorOrigin';
        editor.execute(new AddObjectCommand(editor.pivot));
        editor.removeHelper(editor.pivot);
        editor.pivot.matrixAutoUpdate = false;
	});

	editor.signals.specUpdateComplete.add(function() {

		//getCameraCall(getCameraDeatils);
		upadteAllModels();
		
	});
    //document.getElementById("addeachspecsensor").style.display = "none"
    document.getElementById('addeachspeccam').onclick = function() {

        // alert('addeachspeccam');
        document.getElementById('fileXmlSpec').style.display = "none";
        document.getElementById('eachSpec').style.display = "block";
        document.getElementById('eachSpecSen').style.display = "none";
    }
    document.getElementById('addeachspecsensor').onclick = function() {

        // alert('addeachspeccam');
        document.getElementById('fileXmlSpec').style.display = "none";
        document.getElementById('eachSpec').style.display = "none";
        document.getElementById('eachSpecSen').style.display = "block";
        
    }
    
    document.getElementById('addxmlfile').onclick = function() {

        // alert('addxmlfile');
        document.getElementById('fileXmlSpec').style.display = "block";
        document.getElementById('eachSpec').style.display = "none";
        document.getElementById('eachSpecSen').style.display = "none";
    }
    document.getElementById('addspeceachCameraSubmit').onclick = function() {

        var getCamSpec = updateCamera.camNewSpecData()
		updateCamera.addindividualCamera( getCamSpec );
		addspecModal.hide();

    }
    
    document.getElementById('addspeceachSensorSubmit').onclick = function() {

        var getCamSpec = updateCamera.sensorNewSpecData()
		updateCamera.addindividualSensor( getCamSpec );
		addspecModal.hide();

    }

    document.getElementById('resetFileButton').onclick = function() {

        document.getElementById('addFileInput').value = null;

    }

    document.getElementById('submitFileButton').onclick = function() {

		updateCamera.cameraSpecSubmit();
        addspecModal.hide();
    }

    var camera = new UI.Panel();
    camera.setId('menubar-cameras-list');
    camera.dom.style.display = 'none';

    var options = new UI.Panel();
	options.setClass('options');
    camera.add(options);
    
    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent(  editor.languageData.DefaultCamera );
    option.setId('menubar-add-defaultcamera');
    option.onClick(function() {

        camToEditor.addPerspectiveCamera();

    });
    options.add(option);

    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent(  editor.languageData.SelectCamera );
    option.setId('menubar-add-selectcamera');
    option.onClick(function() {

        updateCamera.selectCameraDomChange();
        modalcamera.show();

    });
    options.add(option);

    // Option to add Last used camera to the scene
    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent(  editor.languageData.LastUsedCamera );
    option.setId('menubar-add-lastusedcamera');
    option.onClick(function() {

        var camlength = editor.sceneCameras.length;
        var newCamPosition = new THREE.Vector3();

        if( camlength != '0' && camlength!= undefined ){

            var lastCam = editor.sceneCameras[ camlength-1 ];
            
            if( lastCam.camCategory == "LiDAR" ){

                // camToEditor.addLidarCamera();
                editor.signals.cloneCamera.dispatch( lastCam );
                var newCamLength = editor.sceneCameras.length;
                var newCam = editor.sceneCameras[ newCamLength-1 ];
                newCam.position.copy( newCamPosition );
                editor.cameraPosition = '';
                editor.signals.sceneGraphChanged.dispatch(); 
                    
            }
            else {

                editor.signals.cloneCamera.dispatch( lastCam );
                var newCamLength = editor.sceneCameras.length;
                var newCam = editor.sceneCameras[ newCamLength-1 ];
                newCam.position.copy( newCamPosition );
                editor.cameraPosition = '';
                editor.signals.sceneGraphChanged.dispatch(); 
                
            } 

        }
        else{

            toastr.info( editor.languageData.NocamerainEditor );

        } 

    });
    options.add(option);

    //Modified to include 3D Model
    /*var option = new UI.Row();
    option.setClass('option');
    option.setTextContent( '3D-Bullet Camera' );
    option.setId('menubar-add-3d-bullet-camera');
    option.onClick(function() {

        if( editor.threeDCamera ) {

            editor.deselect();
            camToEditor.addPerspectiveCamera();
            var newCam = editor.selected;
            newCam.name = "3D-Bullet-Hitachi";
            newCam.camCategory = "3D-Bullet";
            var camIconModel = editor.threeDCamera.clone();
            editor.execute( new AddObjectCommand( camIconModel ) );
            editor.execute( new MoveObjectCommand( camIconModel, newCam ) );
            editor.select( newCam );
            camIconModel.rotateY( 90.0 * ( Math.PI / 180 ) );
            newCam.getObjectByName( "cameraHelperIcon" ).visible = false;
            camIconModel.position.copy( newCam.position.clone() );
            camIconModel.position.setZ(0.4);
            editor.signals.sceneGraphChanged.dispatch();

        } else {

            console.log('3D Bullet camera failed to load');

        }

    });
    options.add(option);

    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent( '3D-Dome Camera' );
    option.setId('menubar-add-3d-dome-camera');
    option.onClick(function() {

        if( editor.threeDDomeCamera ) {

            editor.deselect();
            camToEditor.addPerspectiveCamera();
            var newCam = editor.selected;
            newCam.name = "3D-Dome-Hitachi";
            newCam.camCategory = "3D-Dome";
            var camIconModel = editor.threeDDomeCamera.clone();
            newCam.rotateX( -90.0 * ( Math.PI / 180 ) )
            editor.execute( new AddObjectCommand( camIconModel ) );
            editor.execute( new MoveObjectCommand( camIconModel, newCam ) );
            editor.select( newCam );
            camIconModel.rotateX( 90.0 * ( Math.PI / 180 ) )
            camIconModel.rotateY( 90.0 * ( Math.PI / 180 ) ) //Modified by Pivot
            newCam.getObjectByName( "cameraHelperIcon" ).visible = false;
            camIconModel.position.copy( newCam.position.clone() );
            //camIconModel.position.setX(0.15); //Commented here Pivot
            camIconModel.position.setZ(0.4);
            camIconModel.position.setY(0.175); //Added by pivot
            newCam.tiltRotationValue = 0; 
            newCam.alignment = 'top';
            editor.signals.sceneGraphChanged.dispatch();

        } else {

            console.log('3D Dome camera failed to load');

        }

    });
    options.add(option);
    
    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent(  editor.languageData._3DDomeCamera );
    option.setId('menubar-add-3ddome');
    option.onClick( function() {

        editor.deselect();
        var texLoader = new THREE.TextureLoader();
        
        var wwObjLoader2 = new THREE.OBJLoader2.WWOBJLoader2();
        wwObjLoader2.setCrossOrigin( 'anonymous' );
        var Validator = THREE.OBJLoader2.prototype._getValidator();
        var prepData, objectGroup;

        if( editor.domCameraModel ){

            camToEditor.addPerspectiveCamera();
            var newCam = editor.selected;
            newCam.name = "Dome3D";
            newCam.camCategory = "Dome3D";
            var camIconModel = editor.domCameraModel.clone();
            editor.execute( new AddObjectCommand( camIconModel ) );
            editor.execute( new MoveObjectCommand( camIconModel, newCam ) );
            editor.select( newCam );
            //newCam.add( camIconModel );
            newCam.rotation.set( -90.0 * ( Math.PI / 180 ), 0, 0 );
            camIconModel.rotation.set( 90.0 * ( Math.PI / 180 ), 0, 0 );
            newCam.getObjectByName( "cameraHelperIcon" ).visible = false;
            camIconModel.position.copy( newCam.position.clone() );
            editor.signals.sceneGraphChanged.dispatch();

        }
        else{

            texLoader.load(

                'assets/editorresources/DomeCamera/DomeCamera.png',
                
                function( texture ) {

                    var reportProgress = function( content ) {

                        var response = content;
                        var splittedResp = response.split(":");
                        var respMessage = splittedResp[0];
                        if (respMessage.indexOf("Download of") !== -1) {
            
                            var actualProgress = Number((splittedResp[splittedResp.length - 1].trim()).slice(0, -1));
                            var evalProgress = (actualProgress * 0.8) / 100;
                            editor.progressBar.updateProgress(editor.languageData.DownloadingFiles, evalProgress);
                            //editor.progressBar.show();
            
                        }
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
                
                            //console.log('Loading complete!');
                            editor.progressBar.updateProgress(editor.languageData.DownloadingFiles, 1 );
                            objectGroup.scale.set( 0.5, 0.5, 0.5 );
                            //editor.execute( new AddObjectCommand( objectGroup ) );
                            objectGroup.traverse( function( subChild ){

                                if(  subChild.name === "CamBody" && subChild.material ){

                                    subChild.material.map = texture;
                                    subChild.material.needsUpdate = true;

                                }

                            } );

                            camToEditor.addPerspectiveCamera();
                            var newCam = editor.selected;
                            newCam.name = "Dome3D";
                            newCam.camCategory = "Dome3D";
                            editor.execute( new AddObjectCommand( objectGroup ) );
                            editor.execute( new MoveObjectCommand( objectGroup, newCam ) );
                            editor.select( newCam );
                            //newCam.add( objectGroup );
                            newCam.rotation.set( -90.0 * ( Math.PI / 180 ), 0, 0 );
                            objectGroup.rotation.set( 90.0 * ( Math.PI / 180 ), 0, 0 );
                            newCam.getObjectByName( "cameraHelperIcon" ).visible = false;
                            objectGroup.position.copy( newCam.position.clone() );
                            editor.signals.sceneGraphChanged.dispatch();
                            editor.domCameraModel = objectGroup;
                            editor.progressBar.hide();

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
                    
                    editor.progressBar.updateProgress( "Preparing", 0.0 );
                    editor.progressBar.show();

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

    } );
    options.add(option);*/

    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent(  editor.languageData.AddNewSpec );
    option.setId('menubar-add-addnewspec');
    option.onClick(function(event) {

        if(event.target.id == "menubar-add-addnewspec"){
            document.getElementById("addeachspecsensor").style.display = "none";
        }
		updateCamera.addNewSpecDomAction();
        addspecModal.show();
        var cameraTypeSelect = document.getElementById("cameraType");
        var cameraDefFov = document.getElementById("defaultfov");
        var cameraOptical = document.getElementById("opticalzoom");
        var cameraDigital = document.getElementById("digitalzoom");
        var cameraResolutionWidth = document.getElementById('resolutionwidth');
        var cameraResolutionHeight = document.getElementById('resolutionheight');
        var cameraHorizontalAOV = document.getElementById( "horizontalaov" );
        var cameraMinHorizontalAOV = document.getElementById('minhorizontalaov');

        var cameraVerticalAOV = document.getElementById( "maxverticalaov" );
        var cameraMinVerticalAOV = document.getElementById( "minverticalaov" );
           
        cameraTypeSelect.addEventListener('change', function( event ){
            if( cameraTypeSelect.value == "Panorama" ){
                cameraDefFov.value ="Right";
                cameraDefFov.disabled = true;
                cameraHorizontalAOV.value = 180;
                cameraHorizontalAOV.disabled = true;
                cameraResolutionWidth.disabled = true;
                cameraResolutionHeight.disabled = true;
                cameraMinHorizontalAOV.value = null;
                cameraMinHorizontalAOV.disabled = true;
                cameraVerticalAOV.disabled = true;
                cameraMinVerticalAOV.disabled = true;
                cameraOptical.value = "2x";
                cameraOptical.disabled = true;
                cameraDigital.value = "4x"
                cameraDigital.disabled = true;
            }
            else if( cameraTypeSelect.value == "Fisheye" ){
                cameraDefFov.disabled = false;
                cameraResolutionWidth.disabled = false;
                cameraResolutionHeight.disabled = false;
                cameraHorizontalAOV.value = 179;
                cameraMinHorizontalAOV.value = 10;
                cameraMinHorizontalAOV.disabled = true;
                cameraHorizontalAOV.disabled = true;
                cameraVerticalAOV.disabled = true;
                cameraMinVerticalAOV.disabled = true;
                cameraOptical.disabled = false;
                cameraDigital.disabled = false;
            }
            else if( cameraTypeSelect.value == "Dome" ){
                cameraDefFov.value ="Bottom";
                cameraDefFov.disabled = true;   
                cameraResolutionWidth.disabled = false;
                cameraResolutionHeight.disabled = false;
                cameraHorizontalAOV.disabled = false;
                cameraMinHorizontalAOV.disabled = false;
                cameraVerticalAOV.disabled = false;
                cameraMinVerticalAOV.disabled = false;
                cameraOptical.disabled = false;
                cameraDigital.disabled = false;         
            }
            else if( cameraTypeSelect.value == "PTZ" ){
                cameraDefFov.value ="Right";
                cameraDefFov.disabled = true;   
                cameraResolutionWidth.disabled = false;
                cameraResolutionHeight.disabled = false;
                cameraHorizontalAOV.disabled = false;
                cameraMinHorizontalAOV.disabled = false;
                cameraVerticalAOV.disabled = false;
                cameraMinVerticalAOV.disabled = false;
                cameraOptical.disabled = false;
                cameraDigital.disabled = false;         
            }
            else{
                cameraDefFov.disabled = false;
                cameraResolutionWidth.disabled = false;
                cameraResolutionHeight.disabled = false;
                cameraHorizontalAOV.disabled = false;
                cameraMinHorizontalAOV.disabled = false;
                cameraVerticalAOV.disabled = false;
                cameraMinVerticalAOV.disabled = false;
                cameraOptical.disabled = false;
                cameraDigital.disabled = false;
            }
        });
		
    });
    options.add(option);

    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent(  editor.languageData.ChangeSpec );
    option.setId('menubar-add-changespec');
    option.onClick(function() {

		var uid = localStorage.getItem('U_ID');
		updateCamera.changeSpecDomAction();
		modalcamera.show();
        var Editbutton = document.getElementById('EditCameraBtn');
        Editbutton.onclick = function() {
			editor.select(null);
			updateCamera.editButtonCameraDomAction()
			var cameraObject = Selectcamera.getcameraDetails();
            editCamData = new EditCameraDetails({
                'camdata': cameraObject.fullcamData,
                "model": addspecModal
            });
            editCamData.setallDAta();
            var cameraTypeSelect = document.getElementById("cameraTypeUpdate");
            var cameraDefFov = document.getElementById("defaultfovUpdate");
            var cameraOptical = document.getElementById("opticalzoomUpdate");
            var cameraDigital = document.getElementById("digitalzoomUpdate");
            var cameraResolutionWidth = document.getElementById('resolutionwidthUpdate');
            var cameraResolutionHeight = document.getElementById('resolutionheightUpdate');
            var cameraHorizontalAOV = document.getElementById( "horizontalaovUpdate" );
            var cameraMinHorizontalAOV = document.getElementById('minhorizontalaovUpdate');

            var cameraVerticalAOV = document.getElementById( "maxverticalaovUpdate" );
            var cameraMinVerticalAOV = document.getElementById( "minverticalaovUpdate" );

            cameraTypeSelect.addEventListener('change', function( event ){
                if( cameraTypeSelect.value == "Panorama" ){
                    cameraDefFov.value ="Right";
                    cameraDefFov.disabled = true;
                    cameraHorizontalAOV.value = 180;
                    cameraHorizontalAOV.disabled = true;
                    cameraResolutionWidth.disabled = true;
                    cameraResolutionHeight.disabled = true;
                    cameraMinHorizontalAOV.value = null;
                    cameraMinHorizontalAOV.disabled = true;
                    cameraVerticalAOV.disabled = true;
                    cameraMinVerticalAOV.disabled = true;
                    cameraOptical.value = "2x";
                    cameraOptical.disabled = true;
                    cameraDigital.value = "4x"
                    cameraDigital.disabled = true;
                }
                else if(cameraTypeSelect.value == "Fisheye"){
                    cameraDefFov.disabled = false;
                    cameraResolutionWidth.disabled = false;
                    cameraResolutionHeight.disabled = false;
                    cameraHorizontalAOV.value = 179;
                    cameraHorizontalAOV.disabled = true;
                    cameraMinHorizontalAOV.value = 10;
                    cameraMinHorizontalAOV.disabled = true;
                    cameraVerticalAOV.disabled = true;
                    cameraMinVerticalAOV.disabled = true;
                    cameraOptical.disabled = false;
                    cameraDigital.disabled = false;
                }
                else if( cameraTypeSelect.value == "Dome" ){
                    cameraDefFov.value ="Bottom";
                    cameraDefFov.disabled = true; 
                    cameraResolutionWidth.disabled = false;
                    cameraResolutionHeight.disabled = false;
                    cameraHorizontalAOV.disabled = false;
                    cameraMinHorizontalAOV.disabled = false;
                    cameraVerticalAOV.disabled = false;
                    cameraMinVerticalAOV.disabled = false;
                    cameraOptical.disabled = false;
                    cameraDigital.disabled = false;           
                }
                else if( cameraTypeSelect.value == "PTZ" ){
                    cameraDefFov.value ="Right";
                    cameraDefFov.disabled = true; 
                    cameraResolutionWidth.disabled = false;
                    cameraResolutionHeight.disabled = false;
                    cameraHorizontalAOV.disabled = false;
                    cameraMinHorizontalAOV.disabled = false;
                    cameraVerticalAOV.disabled = false;
                    cameraMinVerticalAOV.disabled = false;
                    cameraOptical.disabled = false;
                    cameraDigital.disabled = false;           
                }
                else{
                    cameraDefFov.disabled = false;
                    cameraResolutionWidth.disabled = false;
                    cameraResolutionHeight.disabled = false;
                    cameraHorizontalAOV.disabled = false;
                    cameraMinHorizontalAOV.disabled = false;
                    cameraVerticalAOV.disabled = false;
                    cameraMinVerticalAOV.disabled = false;
                    cameraOptical.disabled = false;
                    cameraDigital.disabled = false;
                }
            });
            var event = new Event('change');
            cameraTypeSelect.dispatchEvent(event);
            return false;
        }

    });
    options.add(option);

    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent(editor.languageData.MarkCameraPosition);
    option.setId('cameraGenerationPoints');
    option.onClick(function() {

        if (editor.liveTwodViewFlag) {
            toastr.warning(editor.languageData.Exitfromtheliveviewandtryagain);
            return;
        }

        var inneraText = document.getElementById('cameraGenerationPoints').innerText;
        if ( editor.generateCameraFlag == 0 ) {
            if(editor.referencePointFlag){
                toastr.error(editor.languageData.Firstchoosethereferencepositionthentrythis)
            }
            else{

                editor.cameraGeneratingPosition = [];
                toastr.info(editor.languageData.DoubleClickonthe3Dobjectwhereyouwanttoplacethecamera)
                editor.cameraGeneratingFlag = true;
                editor.generateCameraFlag = 1;
                document.getElementById('cameraGenerationPoints').innerText = editor.languageData.StopGenerateCamera
            }

        } 
        else {

            editor.cameraGeneratingFlag = false;
            if(editor.cameraGeneratingPosition.length ==1){

                editor.execute(new RemoveObjectCommand(editor.cameraGeneratingPosition[0]));
                editor.execute(new RemoveObjectCommand(editor.cameraGenerateLine.line));
                editor.setCamera = 0;
                editor.setCameraRotation = 1;
                editor.targetLocked = !editor.targetLocked;

            }
            editor.generateCameraFlag = 0;
            document.getElementById('cameraGenerationPoints').innerText = editor.languageData.MarkCameraPosition;

        }

        // option.setTextContent('Stop');	
    });
    options.add(option);

    return camera;



}