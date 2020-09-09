/**
 * Menubar.Add.Sensors( editor ) : Constructor for adding sensor option in the menubar
 * @constructor
 * @param {any} editor - The instance of the Editor which manages the overall objects and signals
 * @returns {Object<UI.Panel>}
 * @author Hari
 * @example <caption>Example usage of Menubar.Add.Sensors</caption>
 * var menubarAddSensors = new Menubar.Add.Sensors( editor );
 */

Menubar.Add.Sensors = function(editor) {

    var editCamData;
    var camToEditor = new AddCameraToEditor(editor);
    var addspec = new AddNewSpecCamera( editor );
    var addspecModal = addspec.createModal();


    var updateCamera = new UpdateCameraSpec (editor,addspecModal);
	updateCamera.setUpadteFeildsForSensors();
    
    
    var scope = this;


    this.raycaster = new THREE.Raycaster();

	var sensors = new UI.Panel();
    sensors.setId( 'menubar-sensors-list' );
    sensors.dom.style.display = 'none';

	var options = new UI.Panel();
	options.setClass('options');
	sensors.add(options);
	
	// var option = new UI.Row();
    // option.setClass('option');
    // option.setTextContent(  editor.languageData.ThreeDLiDAR );
    // option.setId('menubar-add-sensors-lidar');

    var addLidar = new UI.Row();
    addLidar.setClass('option');
    addLidar.setTextContent("Add 3D LiDAR");
    addLidar.setId('menubar-add-new-lidar');

    var selectLidar = new UI.Row();
    selectLidar.setClass('option');
    selectLidar.setTextContent("Select 3D LiDAR");
    selectLidar.setId('menubar-select-new-lidar');

    var editLidar = new UI.Row();
    editLidar.setClass('option');
    editLidar.setTextContent("Edit 3D LiDAR");
    editLidar.setId('menubar-edit-new-lidar');

    var addSensor = new UI.Row();
    addSensor.setClass('option');
    addSensor.setTextContent(  editor.languageData.AddNewSen );
    addSensor.setId('menubar-add-new-sensors');

    var selectSensorFromMenu = new UI.Row();
    selectSensorFromMenu.setClass('option');
    selectSensorFromMenu.setTextContent(  editor.languageData.SelectSensor );
    selectSensorFromMenu.setId('menubar-select-sensor');

    var editSensor = new UI.Row();
    editSensor.setClass('option');
    editSensor.setTextContent(  editor.languageData.ChangeSpecSensor );
    editSensor.setId('menubar-add-changesensor-spec');
    editSensor.onClick( function( event ){
        

        scope.sensorModal.saveorEdit( "edit-smart-sensor-btn" );
        if( !(document.getElementById( "select-smart-sensor-model" )) ){
            document.getElementById( "editorElement" ).appendChild( scope.sensorModal.dom )
        }
        scope.selectSmartSensor.hideModalElements();
        scope.sensorModal.show();

        document.getElementById( "edit-smart-sensor-btn" ).addEventListener( 'click', (  ) => {

            scope.selectSmartSensor.getSensorDetails().then( result => {
                scope.smartSensor.setValues( result );
                document.getElementById( "add-each-smart-sensor" ).style.display = "none";
                document.getElementById( "edit-remove-div" ).style.display = "block";
                scope.newSensorSpec.show();
            } );
            
            
        } )
        

    } )

    var camManager = new AddCameraToEditor( editor );
    
    // option.onClick( function(){

    //     camManager.addLidarCamera();
        
    // } );

    this.smartSensor = new AddSmartSensor( editor );
    this.newSensorSpec = this.smartSensor.createNewSensorModal();
    document.getElementById('editorElement').appendChild( scope.newSensorSpec.dom )

    addSensor.onClick(function(event){
        if(event.target.id == "menubar-add-new-sensors"){

            if( !(document.getElementById( 'Add-Smart-Sensor' )) )
                document.getElementById('editorElement').appendChild( scope.newSensorSpec.dom )
            
            scope.smartSensor.initializeValues();
            document.getElementById( "add-each-smart-sensor" ).style.display = "block";
            document.getElementById( "edit-remove-div" ).style.display = "none";
            scope.newSensorSpec.show();

        }
        
    });

    addLidar.onClick(function(event){
        if (event.target.id == "menubar-add-new-lidar") {
            if (!(document.getElementById('Add-Camera-Spec')))
                document.getElementById('editorElement').appendChild(addspecModal.dom)
            document.getElementById('addeachspeccam').style.display = "none"
            document.getElementById('eachSpec').style.display = "none"
            document.getElementById("addeachspecsensor").style.display = "block";
            document.getElementById("addeachspecsensor").click();
            addspecModal.show();
        }
    })
    document.getElementById('addeachspecsensor').onclick = function () {
        document.getElementById('fileXmlSpec').style.display = "none";
        document.getElementById('eachSpec').style.display = "none";
        document.getElementById('eachSpecSen').style.display = "block";

    }
    document.getElementById('addxmlfile').onclick = function () {
        document.getElementById('fileXmlSpec').style.display = "block";
        document.getElementById('eachSpec').style.display = "none";
        document.getElementById('eachSpecSen').style.display = "none";
    }

    this.editor = editor;
    this.sensorModal;
    this.view = null;
    this.boundingRect = null
    // update camera Data 
    function getAllLidarDetails(){
        updateCamera.getAllCameraInDb().then((allCameras)=>{
            editor.allCameraDetails = allCameras;
            editor.camspecfull = allCameras;
            selectLidarCamera = new SelectedSensor(allCameras,editor);
            selectLidarCameraModal = selectLidarCamera.createmodal();
            updateCamera.createCameraModalUseNewCamera(selectLidarCamera).then((getModalcamera)=>{                
                var button = document.getElementById('selectSensorBtn');
                button.onclick = function () {
                    var cameraObject = selectLidarCamera.getsensorDetails();
                    camToEditor.addSelectPerspectiveCamera(cameraObject)
                }
                document.getElementById('RemoveaddspeceachSensorSubmit').onclick = function () {

                    updateCamera.removeSensor(editCamData);
                }
                document.getElementById('UpdateaddspeceachSensorSubmit').onclick = function () {
                    updateCamera.updateSensorFromData(editCamData);
                }	
            })
        }).catch((allCameraError)=>{
            console.log("Some error in the sensor Db");
        })
    }
    
    function getAllDetails(){

        scope.selectSmartSensor = new SelectSmartSensor( editor );
        scope.selectSmartSensor.getAllSmartSensorsinDB().then( ( sensorDetails ) => {

            scope.sensorModal = scope.selectSmartSensor.createSelectSensorModal();
            document.getElementById( "editorElement" ).appendChild( scope.sensorModal.dom )

            document.getElementById( "select-smart-sensor-btn" ).addEventListener( 'click', () => {

                if( editor.liveTwodViewFlag ){
            
                    toastr.warning( editor.languageData.DisableLive2DView );
                    return;
                
                } else if( editor.isntwrkngStarted ){
                 
                    toastr.warning( editor.languageData.DisableNetworkingAndTryAgain );
                    return;
                
                } else if( editor.isMeasuring ){
                
                    toastr.warning( editor.languageData.DisableLengthMeasurementAndRetry );
                    return;
                
                } else if( editor.isAreaMeasuring ){
                
                    toastr.warning( editor.languageData.DisableAreaMeasurementAndRetry );
                    return;
                
                } else if( editor.isTwoDMeasuring ){
                
                    toastr.warning( editor.languageData.DisableTwoDDrawingAndRetry );
                    return;
                
                } else if( editor.isAutoRoutingStrtd ){
        
                    toastr.warning( editor.languageData.DisableAutoRoutingAndRetry );
                    return

                } 

                editor.addSensorToScene = true;
                toastr.info( "Double click the location where you want to add the sensor" )
        
            } )

        } );
    }

    document.addEventListener( "dblclick", ( event ) => {

        if( scope.view === null || scope.boundingRect ){

            scope.view = document.getElementById( "viewport" )
            scope.boundingRect = scope.view.getBoundingClientRect();

        }
            
        
        if( editor.addSensorToScene === true ){

            if( editor.freezflag === true )
                document.getElementById( 'freeez-btn' ).click();

            scope.selectSmartSensor.getSensorDetails().then( ( sensorSpectoAdd ) => {

                var cursorPosition = new THREE.Vector3( ( ( event.clientX - scope.boundingRect.left) / scope.view.offsetWidth ) * 2 - 1, -( ( event.clientY - scope.boundingRect.top ) / scope.view.offsetHeight ) * 2 + 1, 0.5 );

                scope.raycaster.setFromCamera( cursorPosition, editor.camera );
                var intersects = scope.raycaster.intersectObjects( editor.sceneObjects );

                if( intersects.length > 0 ){
                
                    var pickedPoint = intersects[ 0 ].point.clone();
                    var badgeText;
                    if( editor.scene.userData.smartSensorCounter === undefined ){
                        editor.scene.userData.smartSensorCounter = 1;
                    }
            
                    if( editor.scene.userData.sensorDeletedNumber != undefined && editor.scene.userData.sensorDeletedNumber.deletedSensorArray.length > 0 ){
                        badgeText = editor.smartSensorDeletedNumber[0];
                        editor.smartSensorDeletedNumber.splice( 0, 1 );
            
                    } else{
                        var badgeText = editor.scene.userData.smartSensorCounter;
                        editor.scene.userData.smartSensorCounter++;
                    }    
            
                    scope.selectSmartSensor.addSensortoScene( pickedPoint, sensorSpectoAdd, badgeText )

                } else{

                    toastr.info( editor.languageData.NoObjectSelected );
                    
                }
            } )
        }

        editor.addSensorToScene = false;

    } )

    getAllDetails();
    getAllLidarDetails();

    editor.signals.specUpdateCompleteSensor.add( () => {

        scope.sensorModal.hide();
        selectLidarCameraModal.hide();
        getAllDetails();
        getAllLidarDetails();
    } )

    selectSensorFromMenu.onClick(function(event){

        scope.sensorModal.saveorEdit( "select-smart-sensor-btn" );
        if( !(document.getElementById( "select-smart-sensor-model" )) ){
            document.getElementById( "editorElement" ).appendChild( scope.sensorModal.dom )
        }
        scope.selectSmartSensor.hideModalElements();
        scope.sensorModal.show();
        scope.selectSmartSensor.getSensorDetails();
        
        // updateCamera.selectSensorDomChange();
    });

    selectLidar.onClick(function () {
        if (event.target.id == "menubar-select-new-lidar") {
            if (!(document.getElementById('select-sensor-model'))) {
            document.getElementById('editorElement').appendChild(selectLidarCameraModal.dom)
            }
            updateCamera.selectSensorDomChange();
            selectLidarCameraModal.show();
        }
    })

    editLidar.onClick(function () {
        if (event.target.id == "menubar-edit-new-lidar") {
            if (!(document.getElementById('select-sensor-model'))) {
                document.getElementById('editorElement').appendChild(selectLidarCameraModal.dom)
            }
            updateCamera.changeSensorSpecDomAction();
            selectLidarCameraModal.show();
            document.getElementById("EditSensorBtn").addEventListener('click', () => {
                editor.select(null);
                updateCamera.editButtonSensorDomAction();
                var sensorObject = selectLidarCamera.getsensorDetails();

                editCamData = new EditCameraDetails({
                    'camdata': sensorObject.fullcamData,
                    "model": addspecModal
                });
                editCamData.setallSensorDAta();
            })
        }
    })

    document.getElementById( "edit-sensor" ).addEventListener( "click", ()  => {
        
        var sensorId = scope.selectSmartSensor.getSensortoUpdate();
        var details = scope.smartSensor.getSensorSpec( );
        scope.smartSensor.updateDB( details, sensorId );
        scope.newSensorSpec.hide();
        
    } )
    
    document.getElementById( 'remove-sensor' ).addEventListener( 'click', () => {

        var sensorId = scope.selectSmartSensor.getSensortoUpdate();
        scope.newSensorSpec.hide();
        scope.smartSensor.removeFromDB( sensorId );

    } )

    //options.add(option);
    options.add(addLidar);
    options.add(selectLidar);
    options.add(editLidar);
    options.add(new UI.HorizontalRule());
    options.add(addSensor);
    options.add(selectSensorFromMenu);
    options.add(editSensor);
	
	return sensors;

};