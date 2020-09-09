		/**
	 * @author mrdoob / http://mrdoob.com/
	 */

	Sidebar.Object = function(editor) {

	    var signals = editor.signals;
	    var previousXposition, previousYposition, previousZposition;
	    var currentXposition, currentYposition, currentZposition;
	    var selectedType;
		var cameraBrandUserData = {};
		var sensorsTypes = [ 'Building', 'Factory', '3D LiDAR', 'Networking' ]
	    var container = new UI.Panel();
	    container.setBorderTop('0');
	    container.setPaddingTop('20px');
		container.setDisplay('none');

		const DEFAULT_LIDAR_TILT = -45;
		
		this.commonControls = new CommonControls( { camera : editor.camera, baseUnit : "meter", baseConversionFactor : 1 }, editor );

		var scope = this;
		/*
		editor.signals.measurementConfigurationChanged.add( function( baseUnit, convFactor, targetUnit ){

			editor.commonMeasurements.setBaseUnit( baseUnit, convFactor );
			editor.commonMeasurements.setTargetUnit( targetUnit );
	
		} ); */

	    // Actions

	    var objectActions = new UI.Select().setPosition('absolute').setRight('8px').setFontSize('11px');
	    objectActions.setOptions({

	        'Actions': 'Actions',
	        'Reset Position': 'Reset Position',
	        'Reset Rotation': 'Reset Rotation',
	        'Reset Scale': 'Reset Scale'

	    });
	    objectActions.onClick(function(event) {

	        event.stopPropagation(); // Avoid panel collapsing

	    });
	    objectActions.onChange(function(event) {

	        var object = editor.selected;

	        switch (this.getValue()) {

	            case 'Reset Position':
	                editor.execute(new SetPositionCommand(object, new THREE.Vector3(0, 0, 0)));
	                break;

	            case 'Reset Rotation':
	                editor.execute(new SetRotationCommand(object, new THREE.Euler(0, 0, 0)));
	                break;

	            case 'Reset Scale':
	                editor.execute(new SetScaleCommand(object, new THREE.Vector3(1, 1, 1)));
	                break;

	        }

	        this.setValue('Actions');

	    });
	    // container.addStatic( objectActions );

	    // type

	    var objectTypeRow = new UI.Row();
	    var objectType = new UI.Text();
	    objectTypeRow.add(new UI.Text(editor.languageData.Type).setWidth('90px'));
	    objectTypeRow.add(objectType);

	    container.add(objectTypeRow);

	    // uuid

	    var objectUUIDRow = new UI.Row();
	    var objectUUID = new UI.Input().setWidth('102px').setFontSize('12px').setDisabled(true);
	    var objectUUIDRenew = new UI.Button(editor.languageData.New).setMarginLeft('7px').onClick(function() {

	        objectUUID.setValue(THREE.Math.generateUUID());

	        editor.execute(new SetUuidCommand(editor.selected, objectUUID.getValue()));

	    });

	    objectUUIDRow.add(new UI.Text(editor.languageData.UUID).setWidth('90px'));
	    objectUUIDRow.add(objectUUID);
	    objectUUIDRow.add(objectUUIDRenew);

	    //container.add( objectUUIDRow );

	    // name

	    var objectNameRow = new UI.Row();
	    var objectName = new UI.Input().setWidth('150px').setFontSize('12px').onChange(function() {

			var selectedItem = editor.selected;
			var selectedItemName = selectedItem.name;

			if( selectedItemName != "StartMeasurementMarker" && selectedItemName != "EndMeasurementMarker" && selectedItemName != "AreaMeasureMarker1" && selectedItemName != "AreaMeasureMarker2" && selectedItemName != "AreaMeasureMarker3" && selectedItemName != "AreaMeasureMarker4" && selectedItemName != "AreaSelectionRectangle" && selectedItemName != "MeasurementConnectionLine" && ( /^(NetworkMarker[\d+])/g ).test( selectedItemName ) === false &&  ( /^(TwoDMeasureMarker[\d+])/g ).test( selectedItemName ) === false ) {

				editor.execute(new SetValueCommand(editor.selected, 'name', objectName.getValue()));
				editor.rotationControls.updateUI();
				editor.translationControls.updateUI();
				
				//Modified to refresh the collapsible list when the name of the object is changed start
				oExplorer.refreshList( editor.scene );
				oExplorer.highlightItem( editor.selected, false );
				//Modified to refresh the collapsible list when the name of the object is changed end
				
			}
			else{
				editor.execute(new SetValueCommand(editor.selected, 'name', selectedItemName ) );
			}

	    });

	    objectNameRow.add(new UI.Text(editor.languageData.Name).setWidth('90px'));
	    objectNameRow.add(objectName);

		container.add(objectNameRow);
		
		//Modified for NW Cable label start
		var cableLabelRow = new UI.Row();
		var cableLabel = new UI.Input().setWidth( '150px' ).setFontSize( '12px' ).onChange( function() {

			var editedText = cableLabel.getValue();
			var currentLine = editor.selected;
			var oldUserDataItem = editor.scene.userData.cableDatas[ currentLine.uuid ];
			if( editedText === "" ) {

				if( oldUserDataItem != undefined ) {

					cableLabel.getValue( oldUserDataItem.label );

				}

			}
			else if( oldUserDataItem != undefined && oldUserDataItem.label != editedText ) {

				editor.signals.networkDataEdited.dispatch( currentLine, { label: editedText, updateTable: true } );

				//Modified to refresh the collapsible list when the name of the object is changed start
				editor.rotationControls.updateUI();
				editor.translationControls.updateUI();
				oExplorer.refreshList( editor.scene );
				oExplorer.highlightItem( editor.selected, false );
				//Modified to refresh the collapsible list when the name of the object is changed end

			}

		} );

		cableLabelRow.add( new UI.Text( editor.languageData.cbleLabel ).setWidth( '90px' ) );
		cableLabelRow.add( cableLabel );

		container.add( cableLabelRow );
		//Modified for NW Cable label end

		var twoDLabelRow = new UI.Row();
		var TwoDLabel = new UI.Input().setWidth( '150px' ).setFontSize( '12px' ).onChange( function() {

			var editedText = TwoDLabel.getValue();
			var currentLine = editor.selected;
			var oldUserDataItem = currentLine.userData.lineLabel;
			if( editedText === "" ) {

				if( oldUserDataItem != undefined ) {

					TwoDLabel.getValue( oldUserDataItem.label );

				}

			}
			else if( oldUserDataItem != undefined && oldUserDataItem.label != editedText ) {

				currentLine.userData.lineLabel = editedText;

				//Modified to refresh the collapsible list when the name of the object is changed start
				editor.rotationControls.updateUI();
				editor.translationControls.updateUI();
				oExplorer.refreshList( editor.scene );
				oExplorer.highlightItem( editor.selected, false );
				//Modified to refresh the collapsible list when the name of the object is changed end

			}

		} );

		twoDLabelRow.add( new UI.Text( editor.languageData.TwoDlabel ).setWidth( '90px' ) );
		twoDLabelRow.add( TwoDLabel );

		container.add( twoDLabelRow );

	    /********************************************************/
	    /*MODIFIED TO INCLUDE COLOR PICKER FOR CAMERA HELPER START*/
	    // Camera Helper Color

	    function onCameraHelperColorChanged() {
			if( editor.theatreMode ){
				toastr.info( editor.languageData.DisableTheatremodeandtryagain );
				return;
			} else {
				var selectedCamObject = editor.selected;
				var color = helperColor.getHexValue();
				/*MODIFIED TO REMOVE AND UPDATE THE CAMERA ICON WHEN CHANGING THE CAMERA BRAND AND MODEL START*/
				var oldBadgeText = selectedCamObject.badgeText;
				var syncCameraBadgeSize = new Promise( function( resolve,reject ){
					editor.modifyCameraObject({ camObject: selectedCamObject, helperColor: color, badgeText: oldBadgeText });
					resolve();
				} );
				/*MODIFIED TO REMOVE AND UPDATE THE CAMERA ICON WHEN CHANGING THE CAMERA BRAND AND MODEL END*/
				syncCameraBadgeSize.then( function(){
					if( editor.isFloorplanViewActive === true ){

						editor.orthographicScale();
			
					} else {
			
						editor.scaleAllIcons();
			
					}
				} )
				// Modified to show camera frustum on color change
				if( editor.hideAllFrustum ){
					document.querySelector( "#hide-camera-frustum" ).click();
				}
			}

	    }

	    var helperColorRow = new UI.Row();

	    var helperColor = new UI.Color().setValue('#ffaa00').onChange(onCameraHelperColorChanged);

	    helperColorRow.add(new UI.Text(editor.languageData.CameraColor).setWidth('90px'));
	    helperColorRow.add(helperColor);

	    container.add(helperColorRow);
	    /*MODIFIED TO INCLUDE COLOR PICKER FOR CAMERA HELPER END*/
	    /********************************************************/

	    // Camera Location
	    /**********MODIFIED TO ADD TAG DETAILS BUTTON START**********/
	    var objectUserData = {};

	    var outerBorder = new UI.Div();
	    outerBorder.setClass('cam-details-ui');
	    var header = new UI.Div();
	    header.setClass('cam-details-ui-header text-center');
	    header.add(new UI.Text(editor.languageData.CameraDetails).setWidth('90px'));
	    outerBorder.add(header);

		var camImgPreivewDiv = new UI.Row().setStyle( ['height'],['80px'] );
		camImgPreivewDiv.setStyle( ['margin-left'],['auto'] );
		camImgPreivewDiv.setStyle( ['margin-right'],['auto'] );
		var camImgPreivew = new UI.Div();
		camImgPreivew.setId( 'camera-preview' );
		camImgPreivewDiv.add( camImgPreivew );
		outerBorder.add( camImgPreivewDiv );

	    var tagDetailsRow = new UI.Row();
	    var cameraUserData = new UI.Input().setWidth('150px').setFontSize('12px').setValue('Not Specified');

	    tagDetailsRow.add(new UI.Text(editor.languageData.CameraLocation).setWidth('90px'));
	    tagDetailsRow.add(cameraUserData);
	    //tagDetailsRow.add( objectDetailsSaveBtn );
	    //container.add( tagDetailsRow );
	    outerBorder.add(tagDetailsRow);
	    /**********MODIFIED TO ADD TAG DETAILS BUTTON END**********/

	    /**********MODIFIED TO CAMERA BRAND**********/
	    var tagCameraBrandRow = new UI.Row();
	    /*var CameraBrand = new UI.Select().setOptions( {
	    	'HITACHI': 'HITACHI',
	    	'HTC': 'HTC',
	    	'ACTI': 'ACTI'
	    } ).setWidth( '150px' );*/

	    /*MODIFIED TO GENERATE CAMERA SPEC ARRAY START*/
	    var CameraBrand = new UI.Select();
	    var camBrands = {};

	    /*CAMERA MODEL WITH BRAND START*/
	    var camModelRow = new UI.Row();
		var camModelSelector = new UI.Select().setWidth('150px');
		
		/*MODIFIED TO ROTATE 3D DOME CAMERA START*/
		var domeCameraRotationRow = new UI.Row();
		var rotationType = new UI.Select().setOptions( {

			'top-wall': editor.languageData.AligntoTopCeiling,
			'left-wall': editor.languageData.AligntoLeftWall,
			'right-wall': editor.languageData.AligntoRightWall,
			'front-wall': editor.languageData.AligntoFrontWall,
			'back-wall': editor.languageData.AligntoBackWall

		} ).setWidth( '150px' ).setValue( 'top-wall' ).setId( 'dome-camera-alignment' ).onChange( changeCameraAlignment );;
		domeCameraRotationRow.add( new UI.Text( editor.languageData.AlignCamera ).setWidth( '90px' ) );
		domeCameraRotationRow.add( rotationType );
		/*MODIFIED TO ROTATE 3D DOME CAMERA END*/
	    var camSpecArray
		var brandModelMaping = [];
		var sensorModelMapping = [];
		var sensorBrands = [];
		var camBrands = [];
	    //getAllCameraDetails();
	    /*CAMERA MODEL WITH BRAND END*/

	   /* $.getJSON('assets/json/data.json', function(data) {

	        var camSpecArray = data.cameras,
	            brandModelMaping = [];
	        camSpecArray.forEach(function(cam) {

	            if (brandModelMaping[cam.manufacturer] == undefined) {
	                brandModelMaping[cam.manufacturer] = [];
	            }
	            brandModelMaping[cam.manufacturer].push(cam.model);

	        });
	        editor.cameraSpecs = camSpecArray;
	        editor.camBrandModelMaping = brandModelMaping;
	        for (var key in editor.camBrandModelMaping) {

	            camBrands[key] = key;

	        };
	        CameraBrand.setOptions(camBrands).setWidth('150px').setValue('ACTi');
	        var defBrand = editor.camBrandModelMaping['ACTi'];
	        var len = defBrand.length;
	        var camModels = {};
	        for (var i = 0; i < len; i++) {

	            camModels[defBrand[i]] = defBrand[i];

	        }
	        camModelSelector.setOptions(camModels).setValue(defBrand[0]);

	    });*/

		function getAllCameraDetails(){

			camSpecArray = editor.allCameras,
			brandModelMaping = [];
			var cameraModelMap = [];
			sensorModelMap = [];
			sensorBrands = [];
			camSpecArray.forEach(function(cam) {

				if (brandModelMaping[cam.manufacturer] == undefined) {
					brandModelMaping[cam.manufacturer] = [];
				}
				brandModelMaping[cam.manufacturer].push(cam.model);

				if( cam.form_factor != undefined ){
					if( cameraModelMap[cam.manufacturer] == undefined ){
						cameraModelMap[cam.manufacturer] = []
					}
					cameraModelMap[cam.manufacturer].push( cam.model )
				} else if( cam.form_factor === undefined ){
					if( sensorModelMap[cam.manufacturer] == undefined ){
						sensorModelMap[cam.manufacturer] = []
					}
					sensorModelMap[cam.manufacturer].push( cam.model )
				}
				

			});
			editor.cameraSpecs = camSpecArray;
			editor.camBrandModelMaping = brandModelMaping;
			// for (var key in editor.camBrandModelMaping) {

			// 	camBrands[key] = key;

			// };
			for( var key in cameraModelMap ){
				camBrands[key] = key;
			}
			
			for( var key in sensorModelMap ){
				sensorBrands[key] = key;
			}

			CameraBrand.setOptions(camBrands).setWidth('150px').setValue('ACTi');
			var defBrand = editor.camBrandModelMaping['ACTi'];
			var len = defBrand.length;
			var camModels = {};
			for (var i = 0; i < len; i++) {

				camModels[defBrand[i]] = defBrand[i];

			}
			camModelSelector.setOptions(camModels).setValue(defBrand[0]);

		}

		function tiltLiDARSensor(camera, resetType) {

			if( resetType == "default" ) {

				return new Promise( function(resolve,reject) {

					if( camera.userData.tiltRotationValue != 0 ) {
	
						editor.customizedRotation.tiltLidar(camera,camera.userData.tiltRotationValue,'down');
						camera.userData.tiltRotationValue = 0;
						resolve();
	
					} else {
	
						resolve();
	
					}
		
				} )

			} else if( resetType == "bend-down" ) {

				return new Promise( function(resolve,reject) {

					if( camera.userData.tiltRotationValue != DEFAULT_LIDAR_TILT ) {
	
						editor.customizedRotation.tiltLidar(camera,DEFAULT_LIDAR_TILT,'up');
						camera.userData.tiltRotationValue = DEFAULT_LIDAR_TILT;
						resolve();
	
					} else {
	
						resolve();
	
					}
		
				} )

			}

		}

		function reFlipSensor(camera) {
			
			var threeDModel = camera.getObjectByProperty('type','Scene');
			THREE.SceneUtils.detach( threeDModel, camera, editor.scene );
			var alignment = camera.userData.flipped;

			switch(alignment) {

				case 'top': 

					editor.execute( new SetRotationCommand( camera, new THREE.Euler( camera.rotation.x, camera.rotation.y, THREE.Math.degToRad(180) ) ) );
						
					editor.signals.sceneGraphChanged.dispatch();
					break;
				
				case 'left': 

					editor.execute( new SetRotationCommand( camera, new THREE.Euler( camera.rotation.x, camera.rotation.y, 0 ) ) );

					editor.signals.sceneGraphChanged.dispatch();
					break;
				
				case 'right': 

					editor.execute( new SetRotationCommand( camera, new THREE.Euler( camera.rotation.x, camera.rotation.y, THREE.Math.degToRad(180) ) ) );
						
					editor.signals.sceneGraphChanged.dispatch();
					break;
				
				case 'front': 

					editor.execute( new SetRotationCommand( camera, new THREE.Euler( camera.rotation.x, camera.rotation.y, THREE.Math.degToRad(90) ) ) );
						
					editor.signals.sceneGraphChanged.dispatch();
					break;
				
				case 'back': 

					editor.execute( new SetRotationCommand( camera, new THREE.Euler( camera.rotation.x, camera.rotation.y, THREE.Math.degToRad(-90) ) ) );

					editor.signals.sceneGraphChanged.dispatch();
					break;

			}

			THREE.SceneUtils.attach( threeDModel, editor.scene, camera ); 
			return camera;

		}
		
		//camera alignment
		function changeCameraAlignment() {

			var value = rotationType.getValue();
			if( editor.selected instanceof THREE.PerspectiveCamera && editor.selected.userData.threeDModelType != undefined ) {

				if( editor.selected.userData.threeDModelType == "Dome" ) {

				var camera = editor.selected;

				if( value == "left-wall" ) {

					if( camera.userData.tiltRotationValue > 0 ) {

						editor.customizedRotation.tiltDomeCameraDown(camera,camera.userData.tiltRotationValue);
						camera.userData.tiltRotationValue = 0;

					} else if( camera.userData.tiltRotationValue < 0 ) {

						editor.customizedRotation.tiltDomeCameraUp(camera,Math.abs( camera.userData.tiltRotationValue) );
						camera.userData.tiltRotationValue = 0;

					}
					if( camera.userData.panRotationValue > 0 ){
						editor.customizedRotation.panDomeCameraLeft(camera, camera.userData.panRotationValue);
						camera.userData.panRotationValue = 0;
					}
					else if( camera.userData.panRotationValue < 0  ){
						editor.customizedRotation.panDomeCameraRight(camera, Math.abs(camera.userData.panRotationValue));
						camera.userData.panRotationValue = 0;
					}

					if( camera.userData.rollRotationValue > 0 ){
						editor.customizedRotation.rollDomeCameraLeft(camera, camera.userData.rollRotationValue);
						camera.userData.rollRotationValue = 0;
					}
					else if( camera.userData.rollRotationValue < 0  ){
						editor.customizedRotation.rollDomeCameraRight(camera, Math.abs(camera.userData.rollRotationValue));
						camera.userData.rollRotationValue = 0;
					}
					camera.userData.alignment = 'left';
					editor.execute( new SetRotationCommand( camera, new THREE.Euler( 0,0,0 ) ) );
					var numBadge = camera.getObjectByProperty('type','Sprite');
					if(numBadge) {

						numBadge.position.set(0,3,0);

					}
					editor.signals.sceneGraphChanged.dispatch();

				} else if( value == "right-wall" ) {

					if( camera.userData.tiltRotationValue > 0 ) {

						//tiltDownCameraLens(camera);
						editor.customizedRotation.tiltDomeCameraDown(camera,camera.userData.tiltRotationValue);
						camera.userData.tiltRotationValue = 0;

					} else if( camera.userData.tiltRotationValue < 0 ) {

						editor.customizedRotation.tiltDomeCameraUp(camera,Math.abs( camera.userData.tiltRotationValue) );
						camera.userData.tiltRotationValue = 0;

					}
					if( camera.userData.panRotationValue > 0 ){
						editor.customizedRotation.panDomeCameraLeft(camera, camera.userData.panRotationValue);
						camera.userData.panRotationValue = 0;
					}
					else if( camera.userData.panRotationValue < 0  ){
						editor.customizedRotation.panDomeCameraRight(camera, Math.abs(camera.userData.panRotationValue));
						camera.userData.panRotationValue = 0;
					}

					if( camera.userData.rollRotationValue > 0 ){
						editor.customizedRotation.rollDomeCameraLeft(camera, camera.userData.rollRotationValue);
						camera.userData.rollRotationValue = 0;
					}
					else if( camera.userData.rollRotationValue < 0  ){
						editor.customizedRotation.rollDomeCameraRight(camera, Math.abs(camera.userData.rollRotationValue));
						camera.userData.rollRotationValue = 0;
					}
					camera.userData.alignment = 'right';
					editor.execute( new SetRotationCommand( camera, new THREE.Euler( 0,THREE.Math.degToRad(180),0 ) ) );
					var numBadge = camera.getObjectByProperty('type','Sprite');
					if(numBadge) {

						numBadge.position.set(0,3,0);

					}
					editor.signals.sceneGraphChanged.dispatch();

				} else if( value == "front-wall" ) {

					if( camera.userData.tiltRotationValue > 0 ) {

						//tiltDownCameraLens(camera);
						editor.customizedRotation.tiltDomeCameraDown(camera,camera.userData.tiltRotationValue);
						camera.userData.tiltRotationValue = 0;

					} else if( camera.userData.tiltRotationValue < 0 ) {

						editor.customizedRotation.tiltDomeCameraUp(camera,Math.abs( camera.userData.tiltRotationValue) );
						camera.userData.tiltRotationValue = 0;

					}
					if( camera.userData.panRotationValue > 0 ){
						editor.customizedRotation.panDomeCameraLeft(camera, camera.userData.panRotationValue);
						camera.userData.panRotationValue = 0;
					}
					else if( camera.userData.panRotationValue < 0  ){
						editor.customizedRotation.panDomeCameraRight(camera, Math.abs(camera.userData.panRotationValue));
						camera.userData.panRotationValue = 0;
					}

					if( camera.userData.rollRotationValue > 0 ){
						editor.customizedRotation.rollDomeCameraLeft(camera, camera.userData.rollRotationValue);
						camera.userData.rollRotationValue = 0;
					}
					else if( camera.userData.rollRotationValue < 0  ){
						editor.customizedRotation.rollDomeCameraRight(camera, Math.abs(camera.userData.rollRotationValue));
						camera.userData.rollRotationValue = 0;
					}
					camera.userData.alignment = 'front';
					editor.execute( new SetRotationCommand( camera, new THREE.Euler( 0,THREE.Math.degToRad(-90),0 ) ) );
					var numBadge = camera.getObjectByProperty('type','Sprite');
					if(numBadge) {

						numBadge.position.set(0,3,0);

					}
					editor.signals.sceneGraphChanged.dispatch();

				} else if( value == "back-wall" ) {

					if( camera.userData.tiltRotationValue > 0 ) {

						//tiltDownCameraLens(camera);
						editor.customizedRotation.tiltDomeCameraDown(camera,camera.userData.tiltRotationValue);
						camera.userData.tiltRotationValue = 0;

					} else if( camera.userData.tiltRotationValue < 0 ) {

						editor.customizedRotation.tiltDomeCameraUp(camera,Math.abs( camera.userData.tiltRotationValue) );
						camera.userData.tiltRotationValue = 0;

					}
					if( camera.userData.panRotationValue > 0 ){
						editor.customizedRotation.panDomeCameraLeft(camera, camera.userData.panRotationValue);
						camera.userData.panRotationValue = 0;
					}
					else if( camera.userData.panRotationValue < 0  ){
						editor.customizedRotation.panDomeCameraRight(camera, Math.abs(camera.userData.panRotationValue));
						camera.userData.panRotationValue = 0;
					}

					if( camera.userData.rollRotationValue > 0 ){
						editor.customizedRotation.rollDomeCameraLeft(camera, camera.userData.rollRotationValue);
						camera.userData.rollRotationValue = 0;
					}
					else if( camera.userData.rollRotationValue < 0  ){
						editor.customizedRotation.rollDomeCameraRight(camera, Math.abs(camera.userData.rollRotationValue));
						camera.userData.rollRotationValue = 0;
					}
					camera.userData.alignment = 'back';
					editor.execute( new SetRotationCommand( camera, new THREE.Euler( 0,THREE.Math.degToRad(-270),0 ) ) );
					var numBadge = camera.getObjectByProperty('type','Sprite');
					if(numBadge) {

						numBadge.position.set(0,3,0);

					}
					editor.signals.sceneGraphChanged.dispatch();

				} else if( value == "top-wall" ) {

					if( camera.userData.tiltRotationValue > 0 ) {

						//tiltDownCameraLens(camera);
						editor.customizedRotation.tiltDomeCameraDown(camera,camera.userData.tiltRotationValue);
						camera.userData.tiltRotationValue = 0;

					} else if( camera.userData.tiltRotationValue < 0 ) {

						editor.customizedRotation.tiltDomeCameraUp(camera,Math.abs( camera.userData.tiltRotationValue) );
						camera.userData.tiltRotationValue = 0;

					}
					if( camera.userData.panRotationValue > 0 ){
						editor.customizedRotation.panDomeCameraLeft(camera, camera.userData.panRotationValue);
						camera.userData.panRotationValue = 0;
					}
					else if( camera.userData.panRotationValue < 0  ){
						editor.customizedRotation.panDomeCameraRight(camera, Math.abs(camera.userData.panRotationValue));
						camera.userData.panRotationValue = 0;
					}

					if( camera.userData.rollRotationValue > 0 ){
						editor.customizedRotation.rollDomeCameraLeft(camera, camera.userData.rollRotationValue);
						camera.userData.rollRotationValue = 0;
					}
					else if( camera.userData.rollRotationValue < 0  ){
						editor.customizedRotation.rollDomeCameraRight(camera, Math.abs(camera.userData.rollRotationValue));
						camera.userData.rollRotationValue = 0;
					}
					camera.userData.alignment = 'top';
					editor.execute( new SetRotationCommand( camera, new THREE.Euler( THREE.Math.degToRad(-90),0, 0 ) ) );
					var numBadge = camera.getObjectByProperty('type','Sprite');
					if(numBadge) {

						numBadge.position.set(0,3,0);

					}
					editor.signals.sceneGraphChanged.dispatch();

					}

				} else if( editor.selected.userData.threeDModelType == "LiDAR" ) {

					var camera = editor.selected;

					if( value == "left-wall" ) {

						var flipped = camera.userData.flipped; 
						if( flipped && flipped!= undefined && ( flipped == "un-flipped" || flipped == "top" ) ) {

							camera = reFlipSensor(camera);

						}

						tiltLiDARSensor(camera, 'default', flipped).then( function() {

							camera.userData.alignment = 'left';

							if( flipped && flipped!= undefined && ( flipped == "un-flipped" || flipped == "top" ) ) {

								editor.execute( new SetRotationCommand( camera, new THREE.Euler( THREE.Math.degToRad(-90),0,0 ) ) );

							} else {

								editor.execute( new SetRotationCommand( camera, new THREE.Euler(0, THREE.Math.degToRad(180),0 ) ) );

							}
							
							tiltLiDARSensor( camera, 'bend-down', flipped ).then( function() {

								if( camera.userData.rollRotationValue > 0 ){
								
									camera.userData.rollRotationValue = 0;
								}
								else if( camera.userData.rollRotationValue < 0  ){
									
									camera.userData.rollRotationValue = 0;
								}

								var numBadge = camera.getObjectByProperty('type','Sprite');
								if(numBadge) {

									numBadge.position.set(0,3,0);

								}
								
								//Added to flip camera by 180 degree
								var threeDModel = camera.getObjectByProperty('type','Scene');
								THREE.SceneUtils.detach( threeDModel, camera, editor.scene );
								editor.execute( new SetRotationCommand( camera, new THREE.Euler( THREE.Math.degToRad(-135),0,THREE.Math.degToRad(180) ) ) );
								THREE.SceneUtils.attach( threeDModel, editor.scene, camera ); 
								camera.userData.flipped = "left";

							} )

						} )
						
					} else if( value == "right-wall" ) {

						var flipped = camera.userData.flipped; 

						if( flipped && flipped!= undefined && ( flipped == "un-flipped" || flipped == "top" ) ) {

							camera = reFlipSensor(camera);

						}
						
						tiltLiDARSensor(camera, 'default').then( function() {

							camera.userData.alignment = 'right';
							//editor.execute( new SetRotationCommand( camera, new THREE.Euler( 0,THREE.Math.degToRad(180),0 ) ) );
							if( flipped && flipped!= undefined && ( flipped == "un-flipped" || flipped == "top" ) ) {

								editor.execute( new SetRotationCommand( camera, new THREE.Euler( THREE.Math.degToRad(-90),0,THREE.Math.degToRad(180) ) ) );
	
							} else {

								editor.execute( new SetRotationCommand( camera, new THREE.Euler( THREE.Math.degToRad(-180),THREE.Math.degToRad(180),THREE.Math.degToRad(180) ) ) );

							}
							//editor.execute( new SetRotationCommand( camera, new THREE.Euler( THREE.Math.degToRad(-90),0,THREE.Math.degToRad(180) ) ) );//Org
							tiltLiDARSensor( camera, 'bend-down' ).then( function() {

								if( camera.userData.rollRotationValue > 0 ){
								  
									camera.userData.rollRotationValue = 0;
								}
								else if( camera.userData.rollRotationValue < 0  ){
									
									camera.userData.rollRotationValue = 0;
								}
								var numBadge = camera.getObjectByProperty('type','Sprite');
								if(numBadge) {
	
									numBadge.position.set(0,3,0);
	
								}

								//Added to flip camera by 180 degree
								var threeDModel = camera.getObjectByProperty('type','Scene');
								THREE.SceneUtils.detach( threeDModel, camera, editor.scene );
								editor.execute( new SetRotationCommand( camera, new THREE.Euler( THREE.Math.degToRad(-45),0,THREE.Math.degToRad(360) ) ) );
								THREE.SceneUtils.attach( threeDModel, editor.scene, camera ); 
								camera.userData.flipped = "right";

							} )

						} )
						
					} else if( value == "front-wall" ) {

						var flipped = camera.userData.flipped; 

						if( flipped && flipped!= undefined && ( flipped == "un-flipped" || flipped == "top" ) ) {

							camera = reFlipSensor(camera);

						}

						tiltLiDARSensor(camera, 'default').then( function() {

							camera.userData.alignment = 'front';
							//editor.execute( new SetRotationCommand( camera, new THREE.Euler( 0,THREE.Math.degToRad(-90),0 ) ) );

							if( flipped && flipped!= undefined && ( flipped == "un-flipped" || flipped == "top" ) ) {

								editor.execute( new SetRotationCommand( camera, new THREE.Euler( THREE.Math.degToRad(-90),0, THREE.Math.degToRad(90) ) ) );
	
							} else {
								
								editor.execute( new SetRotationCommand( camera, new THREE.Euler( THREE.Math.degToRad(-90),THREE.Math.degToRad(-90),THREE.Math.degToRad(270) ) ) );

							}
							
							//editor.execute( new SetRotationCommand( camera, new THREE.Euler( THREE.Math.degToRad(-90),0, THREE.Math.degToRad(90) ) ) );//Org
							
							tiltLiDARSensor( camera, 'bend-down' ).then( function() {

								if( camera.userData.rollRotationValue > 0 ){
									
									camera.userData.rollRotationValue = 0;
								}
								else if( camera.userData.rollRotationValue < 0  ){
									
									camera.userData.rollRotationValue = 0;
								}
								var numBadge = camera.getObjectByProperty('type','Sprite');
								if(numBadge) {
	
									numBadge.position.set(0,3,0);
	
								}

								//Added to flip camera by 180 degree
								var threeDModel = camera.getObjectByProperty('type','Scene');
								THREE.SceneUtils.detach( threeDModel, camera, editor.scene );
								editor.execute( new SetRotationCommand( camera, new THREE.Euler( THREE.Math.degToRad(-90),THREE.Math.degToRad(-45),THREE.Math.degToRad(270) ) ) );
								THREE.SceneUtils.attach( threeDModel, editor.scene, camera ); 
								camera.userData.flipped = "front";

							} )

						} )

					} else if( value == "back-wall" ) {

						var flipped = camera.userData.flipped; 

						if( flipped && flipped!= undefined && ( flipped == "un-flipped" || flipped == "top" ) ) {

							camera = reFlipSensor(camera);

						}

						tiltLiDARSensor(camera, 'default').then( function() {

							camera.userData.alignment = 'back';
							//editor.execute( new SetRotationCommand( camera, new THREE.Euler( 0,THREE.Math.degToRad(-270),0 ) ) );
							if( flipped && flipped!= undefined && ( flipped == "un-flipped" || flipped == "top" ) ) {

								editor.execute( new SetRotationCommand( camera, new THREE.Euler( THREE.Math.degToRad(-90),0,THREE.Math.degToRad(-90) ) ) );
	
							} else {

								editor.execute( new SetRotationCommand( camera, new THREE.Euler( 0,THREE.Math.degToRad(90),0 ) ) );

							}
							//editor.execute( new SetRotationCommand( camera, new THREE.Euler( THREE.Math.degToRad(-90),0,THREE.Math.degToRad(-90) ) ) );//Org

							tiltLiDARSensor( camera, 'bend-down' ).then( function() {

								if( camera.userData.rollRotationValue > 0 ){
								  
									camera.userData.rollRotationValue = 0;
								}
								else if( camera.userData.rollRotationValue < 0  ){
									
									camera.userData.rollRotationValue = 0;
								}
								var numBadge = camera.getObjectByProperty('type','Sprite');
								if(numBadge) {
	
									numBadge.position.set(0,3,0);
	
								}

								//Added to flip camera by 180 degree
								var threeDModel = camera.getObjectByProperty('type','Scene');
								THREE.SceneUtils.detach( threeDModel, camera, editor.scene );
								editor.execute( new SetRotationCommand( camera, new THREE.Euler( THREE.Math.degToRad(-90),THREE.Math.degToRad(45),THREE.Math.degToRad(90) ) ) );
								THREE.SceneUtils.attach( threeDModel, editor.scene, camera ); 
								camera.userData.flipped = "back";

							} )

						} )

					} else if( value == "top-wall" ) {

						var flipped = camera.userData.flipped; 
						
						tiltLiDARSensor(camera, 'default').then( function() {
							
							camera.userData.alignment = 'top';
							//editor.execute( new SetRotationCommand( camera, new THREE.Euler( THREE.Math.degToRad(-90),0, 0 ) ) );//Orginal
							editor.execute( new SetRotationCommand( camera, new THREE.Euler( THREE.Math.degToRad(-90),0, 0 ) ) );
							
							//editor.execute( new SetRotationCommand( camera, new THREE.Euler( 0,0,0 ) ) );//Org
							
							tiltLiDARSensor( camera, 'bend-down' ).then( function() {

								if( camera.userData.rollRotationValue > 0 ){
								  
									camera.userData.rollRotationValue = 0;
								}
								else if( camera.userData.rollRotationValue < 0  ){
									
									camera.userData.rollRotationValue = 0;
								}
								var numBadge = camera.getObjectByProperty('type','Sprite');
								if(numBadge) {
	
									numBadge.position.set(0,3,0);
	
								}
								camera.userData.flipped = "top";
								if( flipped && flipped!= undefined ) {

									camera = reFlipSensor(camera);
		
								}

							} )

						} )

					} 
				}

			} else {

				toastr.warning('Select a 3D Dome camera for changing the alignment');
				return;

			}

		}
		
	    /*MODIFIED TO GENERATE CAMERA SPEC ARRAY END*/

	    //CameraBrand.setOptions( camBrands ).setWidth( '150px' );


	    function updateCamBrandModel() {

			
	        var camModels = {};
			var bnd = editor.camBrandModelMaping[CameraBrand.getValue()];
			if(bnd == undefined){

				//toastr.info(editor.languageData.Thesecameraisremovedpleasetryanotherone)
			}
			else{
				var len = bnd.length;
				for (var i = 0; i < len; i++) {

					camModels[bnd[i]] = bnd[i];

				}
	        	camModelSelector.setOptions(camModels).setWidth('150px').setValue(bnd[0]);
			}
	        

	    }

	    CameraBrand.onChange(function() {
			
	        	updateCamBrandModel();

	    });
	    camModelSelector.onChange(function() {

	        // objectUserData = JSON.stringify({ "location": cameraUserData.getValue(), "cameraBrand": CameraBrand.getValue(), "cameraModel": camModelSelector.getValue() });

	        //objectUserData.setValue(JSON.stringify(loc));
	        //update();
	        //toastr.success("Camera brand and model successfully Updated");
	        //toastr.css = "toast-css";

	    });

	    tagCameraBrandRow.add(new UI.Text(editor.languageData.CameraBrand).setWidth('90px'));
	    tagCameraBrandRow.add(CameraBrand);
	    //container.add( tagCameraBrandRow );
	    outerBorder.add(tagCameraBrandRow);

	    camModelRow.add(new UI.Text(editor.languageData.CameraModel).setWidth('90px'));
	    camModelRow.add(camModelSelector);
	    //container.add( camModelRow );
		outerBorder.add(camModelRow);
		if( localStorage.getItem("viewmode") != "true") {

			outerBorder.add( domeCameraRotationRow );
		}
		

		/*reference position */
		
	    var ReferenceRow = new UI.Row();
	    var ReferenceX = new UI.Number().setWidth('50px').onChange(referenceUpdate);
	    var ReferenceY = new UI.Number().setWidth('50px').onChange(referenceUpdate);
	    var ReferenceZ = new UI.Number().setWidth('50px').onChange(referenceUpdate);
	    ReferenceRow.add(new UI.Text(editor.languageData.Refpoint).setWidth('90px'));
	    ReferenceRow.add(ReferenceX, ReferenceY, ReferenceZ);
		outerBorder.add(ReferenceRow);
		
		/*camera Current Refence position*/

		var cameraReferenceRow = new UI.Row();
		var cameraReferenceX = new UI.Number().setWidth('50px').onChange(updateActualCameraPosition);
		var cameraReferenceY = new UI.Number().setWidth('50px').onChange(updateActualCameraPosition);
		var cameraReferenceZ = new UI.Number().setWidth('50px').onChange(updateActualCameraPosition);
	    cameraReferenceRow.add(new UI.Text(editor.languageData.ActualPosition).setWidth('90px'));
	    cameraReferenceRow.add(cameraReferenceX, cameraReferenceY, cameraReferenceZ);
		outerBorder.add(cameraReferenceRow);

		/*camera Current Refence position*/

	    var referenceButtonRow = new UI.Row();
	    var referenceButton = new UI.Button(editor.languageData.ChooseReference).setId('refPointButton').setClass('').onClick(function() {

			if ( editor.selected.isLocked == true ){
				toastr.warning(editor.languageData.UnlockCamerasandRetry);
				return;
			}

	        if (editor.selected.userData.objectUuid === "notset") {
	        	if(editor.cameraGeneratingFlag){

					toastr.error(editor.languageData.Firststopgeneratingcameraandthentryit)
					
	        	}
	        	else{

	        		//editor.referencePointFlag = true;
					editor.currentRefernceCamera = editor.selected;
					var currentcamera = editor.currentRefernceCamera;	
					var currentCameraPosition = currentcamera.position
					var ChangeYAxies = currentCameraPosition.y - 3;
					//var newPositonVector = new THREE.Vector3(currentCameraPosition.x , ChangeYAxies , currentCameraPosition.z)
                    var iconUrl = 'assets/img/mappin.png';
                    var badgeTextValue = Number(currentcamera.badgeText).toString();
					var iconBadge = editor.iconWithBadgeSprite(iconUrl, badgeTextValue, currentcamera.helperColor);
					
					iconBadge.name = "Cam Reference " + currentcamera.badgeText;
					iconBadge.center.copy( new THREE.Vector2( 0.5,0 ) );
					iconBadge.userData.refPointName = "Cam Reference " + currentcamera.badgeText;

					var currentCamera = editor.selected;
					var newCamera = new THREE.PerspectiveCamera(1, 1, 0.1, currentCamera.far);
					newCamera.rotation.x = -1.57069632679523;
					newCamera.position.set( currentCamera.position.x ,currentCamera.position.y, currentCamera.position.z)
					newCamera.visible=false;
					editor.execute(new AddObjectCommand( newCamera ));
					var Box3Ref = new THREE.Box3();
					Box3Ref.setFromObject(editor.scene);
					var sceneMinY = Box3Ref.min.y;
					var targetPoint = new THREE.Vector3( currentCamera.position.x , sceneMinY , currentCamera.position.z)
					var refRaycaster = new THREE.Raycaster();
					refRaycaster.setFromCamera(targetPoint, newCamera);
					var intersects = refRaycaster.intersectObjects( editor.sceneObjects , true );
					editor.cameraDeletedNumber.push(newCamera.badgeText)
					editor.cameraDeletedNumber.sort(function(a, b) {
						return b - a;
					});
					editor.execute(new RemoveObjectCommand( newCamera))

					var ReferanceY = 0 ;
					var interssetObject = "";
					if(intersects.length > 0){
	
						var intersectsLength = intersects.length;
						for(var i=0 ; i < intersectsLength ; i++){
							
							if(intersects[i].distance > 2 && intersects[i].object.type == "Mesh"){
								ReferanceY= intersects[i].point.y;
								interssetObject =intersects[i];
								break;

							}							
						}
						if(ReferanceY != 0){
							
							var newPositonVector = new THREE.Vector3(currentCameraPosition.x , ReferanceY , currentCameraPosition.z)
							iconBadge.position.copy( newPositonVector );
							//iconBadge.position.copy( interssetObject.point );
							iconBadge.camerauuid = currentcamera.uuid
							iconBadge.givenid = "refpostion";
							editor.execute(new AddObjectCommand(iconBadge));	
							var meshUuid = editor.selected.uuid;
							var currentRefence = editor.selected;
							//var scaleVectorPoint = new THREE.Vector3();
							//var scaleFactorPoint = 16, scale ;
							//scale = scaleVectorPoint.subVectors( currentRefence.position, editor.camera.position ).length() / scaleFactorPoint;
							//currentRefence.scale.set(scale, scale, 1);
							editor.signals.objectChanged.dispatch( currentRefence )
							editor.signals.referranceSignal.dispatch(currentcamera, newPositonVector , meshUuid);
							editor.signals.objectAdded.dispatch(iconBadge);
							editor.signals.sceneGraphChanged.dispatch();
							//editor.signals.neededReferancePoint.dispatch();
							toastr.info( editor.languageData.Referencepointisadded);
							editor.allReferencePoint.push(iconBadge);
							
						}
						else{
							
							var newPositonVector = new THREE.Vector3(currentCameraPosition.x , ChangeYAxies , currentCameraPosition.z)
							iconBadge.position.copy( newPositonVector );
							iconBadge.camerauuid = currentcamera.uuid
							iconBadge.givenid = "refpostion"
							editor.execute(new AddObjectCommand(iconBadge));	
							var meshUuid = editor.selected.uuid;
		
							var currentRefence = editor.selected;
							//var scaleVectorPoint = new THREE.Vector3();
							//var scaleFactorPoint = 16, scale ;
							//scale = scaleVectorPoint.subVectors( currentRefence.position, editor.camera.position ).length() / scaleFactorPoint;
							//currentRefence.scale.set(scale, scale, 1);

							editor.signals.objectChanged.dispatch( currentRefence )
							editor.signals.referranceSignal.dispatch(currentcamera, newPositonVector , meshUuid);
							editor.signals.objectAdded.dispatch(iconBadge);
							editor.signals.sceneGraphChanged.dispatch();
							//editor.signals.neededReferancePoint.dispatch();
							toastr.info( editor.languageData.Referencepointisadded);
							editor.allReferencePoint.push(iconBadge);

						}

					}
					else{
						
						var newPositonVector = new THREE.Vector3(currentCameraPosition.x , ChangeYAxies , currentCameraPosition.z)
						iconBadge.position.copy( newPositonVector );
						iconBadge.camerauuid = currentcamera.uuid
						iconBadge.givenid = "refpostion"
						editor.execute(new AddObjectCommand(iconBadge));	
						var meshUuid = editor.selected.uuid;
						var currentRefence = editor.selected;
						//var scaleVectorPoint = new THREE.Vector3();
						//var scaleFactorPoint = 16, scale ;
						//scale = scaleVectorPoint.subVectors( currentRefence.position, editor.camera.position ).length() / scaleFactorPoint;
						//currentRefence.scale.set(scale, scale, 1);
						editor.signals.objectChanged.dispatch( currentRefence )
						editor.signals.referranceSignal.dispatch(currentcamera, newPositonVector , meshUuid);
						editor.signals.objectAdded.dispatch(iconBadge);
						editor.signals.sceneGraphChanged.dispatch();
						toastr.info( editor.languageData.Referencepointisadded);
						editor.allReferencePoint.push(iconBadge);

					}

				}

				iconBadge.userData.checkLOSFlag = 'notset';
				iconBadge.userData.checkDetailsFlag = 'notset';
				iconBadge.userData.labelName = iconBadge.name;
				currentcamera.userData.refName = iconBadge.name;

				var absHeight = ( ( currentcamera.position.y - iconBadge.position.y) * editor.commonMeasurements.targetConversionFactor );
				var absDistance = ( ( currentcamera.position.x - iconBadge.position.x) * editor.commonMeasurements.targetConversionFactor ) ;
				currentcamera.userData.absHeight = absHeight;
				currentcamera.userData.absDistance = absDistance;

				editor.signals.addReferencePointLine.dispatch( iconBadge ); 
				editor.select( iconBadge );

				if( editor.isFloorplanViewActive === true ){

					editor.scaleReferencePointOrthographic( iconBadge );
					//editor.orthographicScale();

				} else{

					//editor.scaleAllIcons();
					editor.scaleReferencePointThreeDView( iconBadge );

				}

				//Modified to re-position Reference point start

				toastr.info('<div>'+editor.languageData.Doyouneedtochangerefpointpos+ ' ' + currentcamera.badgeText + '</div><div><button type="button" id="ref-change-' + currentcamera.uuid + '" class="btn btn-success" style="margin-right:1px">' + editor.languageData.Yes + '</button><button type="button" id="ref-pos-no-change" class="btn btn-danger" style="margin-left:1px">'+ editor.languageData.No + '</button></div>');

				document.getElementById( 'ref-change-' + currentcamera.uuid ).addEventListener( 'click', function(){

					//processRePositioningRefPt( camUUID );
					editor.signals.processRePositioningRefPt.dispatch( currentcamera.uuid );

				} );
					           
	        } 

	        else {

	            editor.referencePointFlag = false;;
	            toastr.error(editor.languageData.Youhavealreadyselectedareferencepoint);

	        }

		})
		if(localStorage.getItem("viewmode") != "true")
			referenceButtonRow.add(referenceButton);
		//editor.groupCamRef.add( referenceButtonRow );
	    outerBorder.add(referenceButtonRow);

	    /*reference position */

	    var camDetailsSaveBtnRow = new UI.Row();
	    var objectDetailsSaveBtn = new UI.Button(editor.languageData.UpdateCamera).setClass('cam-details-ui-save-btn').setId('update-camera-button').onClick( function(){

			//MODIFIED TO GET THE CAMERA SPECS FROM API START
			var objectcamSelected = editor.selected;	
			
			if( objectcamSelected.camCategory === "LiDAR" ){
				return;
			}
				
			
			if( ( simulationManager.liveCameras.length > 0 && simulationManager.liveCameras[0] == objectcamSelected.uuid ) || simulationManager.pausedCameras.includes( objectcamSelected.uuid  ) ){
				toastr.warning("Cannot update simulated camera");
				return;
			}
			if( objectcamSelected != undefined && objectcamSelected.camCategory == "Panorama" ){
				toastr.warning("Cannot update panoramic cameras");
				return;
			}

			var cameraWithPerson = false
			
			objectcamSelected.traverse( function( child ){
				if( child && child.userData && child.userData.modelType === "not-a-base-model" )
					cameraWithPerson = true
			} );
	
			if( cameraWithPerson ){
				toastr.warning( editor.languageData.UnlockPersonOrLuggageAndRetry );
				return;
			}  
	

			var specParams = new FormData();
			specParams.append( 'cameraData', JSON.stringify( { "Model": camModelSelector.getValue(), "Brand":CameraBrand.getValue(),"userId": localStorage.getItem( 'U_ID' ) } ) );

			var getCamSpecs = new ApiHandler();
			getCamSpecs.prepareRequest( {

				method: 'POST',
				url: editor.api + 'specificUserCamera/',
				responseType: 'json',
				isDownload: false,
				formDataNeeded: true,
				formData: specParams

			} );
			getCamSpecs.onStateChange( function( response ){

				if( response.status === 200 ){

					if (cameraUserData.getValue() != '' && cameraUserData.getValue() != undefined) {
						
						//var objectcamSelected = editor.selected;
						if ( objectcamSelected.userData.objectUuid !== "notset" ) {
							var point = new THREE.Vector3(ReferenceX.getValue() / editor.commonMeasurements.targetConversionFactor , ReferenceY.getValue() / editor.commonMeasurements.targetConversionFactor , ReferenceZ.getValue() / editor.commonMeasurements.targetConversionFactor ); //Edited to convert to target conversion factor

							if( ( objectcamSelected.userData.refUUID ) && ( objectcamSelected.userData.lineUUID ) ){

								userData = { "location": cameraUserData.getValue(), "cameraBrand": CameraBrand.getValue(), "cameraModel": camModelSelector.getValue(), "lineUUID": objectcamSelected.userData.lineUUID, "refUUID" : objectcamSelected.userData.refUUID, "objectUuid": objectcamSelected.userData.objectUuid, "reference": point, "flipped": objectcamSelected.userData.flipped };

							}

							else{
															
							userData = { "location": cameraUserData.getValue(), "cameraBrand": CameraBrand.getValue(), "cameraModel": camModelSelector.getValue(), "objectUuid": objectcamSelected.userData.objectUuid, "reference": point, "flipped": objectcamSelected.userData.flipped };

							}
		
						} else {
		
							var point = new THREE.Vector3(0, 0, 0);
							userData = { "location": cameraUserData.getValue(), "cameraBrand": CameraBrand.getValue(), "cameraModel": camModelSelector.getValue(), "objectUuid": objectcamSelected.userData.objectUuid, "reference": point, "flipped": objectcamSelected.userData.flipped };
		
						}
						if( response.body.form_factor != undefined )
							userData.threeDModelType = response.body.form_factor;
						else if( response.body.sensor_category != undefined )
							userData.threeDModelType = response.body.sensor_category;
						if( (objectcamSelected.camCategory ==  response.body.form_factor) || (objectcamSelected.camCategory ==  response.body.sensor_category) ){
						//if( (objectcamSelected.camCategory == 'Dome' || objectcamSelected.camCategory == 'PTZ') && (objectcamSelected.camCategory ==  response.body.form_factor) ){
						

							var cameraTiltValue = objectcamSelected.userData.tiltRotationValue;
							var cameraPanValue = objectcamSelected.userData.panRotationValue;
							var cameraRollValue = objectcamSelected.userData.rollRotationValue;
							var alignment = objectcamSelected.userData.alignment;
							var flipped = objectcamSelected.userData.flipped;

			
							userData.alignment = alignment;
							userData.tiltRotationValue = cameraTiltValue;
							userData.panRotationValue = cameraPanValue;
							userData.rollRotationValue = cameraRollValue;
							( flipped )? userData.flipped = flipped: "" ;

													
			
						}
						else if( (objectcamSelected.camCategory !=  response.body.form_factor)|| (objectcamSelected.camCategory ==  response.body.sensor_category) ){
							toastr.warning( editor.languageData.RotationsAreNotRetainedFortheNewCamera );
							if( response.body.form_factor == 'Dome' || response.body.form_factor == 'PTZ' ){
								userData.alignment = "top";
							}
							userData.tiltRotationValue = 0;
							userData.panRotationValue = 0;
							userData.rollRotationValue = 0;
						}
						//objectUserData.setValue(JSON.stringify(loc));
						updataCameraParameters(editor.selected, camModelSelector.getValue(), updatecameraCallback);
						editor.execute(new SetValueCommand(objectcamSelected, 'userData', userData));
		
						/*MODIFIED TO REMOVE AND UPDATE THE CAMERA ICON WHEN CHANGING THE CAMERA BRAND AND MODEL START*/
						var selectedCamObject = editor.selected;
						var oldBadgeText = selectedCamObject.badgeText;
						//( objectcamSelected.camCategory && objectcamSelected.camCategory != "" && objectcamSelected.camCategory === "LiDAR" )? objectcamSelected.iconUrl = "assets/img/lidar_black_256.png" : objectcamSelected.iconUrl = response.body.image_url;
						objectcamSelected.iconUrl = response.body.image_url;
						if( response.body.form_factor != undefined )
							objectcamSelected.camCategory = response.body.form_factor;
						else if( response.body.sensor_category != undefined )
							objectcamSelected.camCategory = response.body.sensor_category;
						var syncScaleCamera = new Promise( function(resolve, reject){
							editor.modifyCameraObject({ camObject: selectedCamObject, helperColor: selectedCamObject.helperColor, badgeText: oldBadgeText });
							resolve();
						} );
						/*MODIFIED TO REMOVE AND UPDATE THE CAMERA ICON WHEN CHANGING THE CAMERA BRAND AND MODEL END*/
						update();
						syncScaleCamera.then( function(){
							if( editor.isFloorplanViewActive === true ){

								editor.orthographicScale();////Modified to scale all the icons when camera is updated in floorplan view
						 
							} 
							else {
						 
								editor.scaleAllIcons(); 
								//Modified to scale all the icons when camera is updated in ThreeD view
						 
							}
						} )
						
						//editor.scaleAllIcons();//Modified to scale all the icons when camera is updated
						
						toastr.success(editor.languageData.CameraDetailsSuccessfullyUpdated);

						if( selectedCamObject.userData.objectUuid != "notset" ){

							var refPointUUID = selectedCamObject.userData.objectUuid;
							var refPoint = editor.scene.getObjectByProperty( 'uuid', refPointUUID );
							
							if( refPoint && refPoint.userData.checkLOSFlag && refPoint.userData.checkDetailsFlag ){

								if( refPoint.userData.checkLOSFlag === "set" ){

									var lineUUID = refPoint.userData.lineUUID;
									var line = editor.scene.getObjectByProperty( 'uuid', lineUUID );
									line.visible = false;
									refPoint.userData.checkLOSFlag = "notset";
					
								}
								
								if( refPoint.userData.checkDetailsFlag === "set" ){
					
									var table = document.querySelector( '#cam__ref__mobilewindow__' + refPoint.uuid );
									table.style.display = 'none';
									refPoint.userData.checkDetailsFlag = "hidden";
					
								}
								
								editor.signals.sceneGraphChanged.dispatch(); 

							}

						}

						if( editor.hideAllFrustum ){
							
							selectedCamObject.traverse( function( children ){
								if( children.name == 'CameraFrustum' ) {
									children.visible = false;
								} 
							} )
							editor.sceneHelpers.children[ editor.sceneHelpers.children.length -1 ].visible = false;				
						}
						//Modified for activity logging start
						try{

							//Modified for activity logging start
							var logDatas = {};
							logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " Camera : "  + selectedCamObject.name + " updated, new userData : " + JSON.stringify( selectedCamObject.userData ) + ", other values : " + JSON.stringify( { "helperColor" : selectedCamObject.helperColor, "badgeText" : oldBadgeText } );
							logger.addLog( logDatas );
							logger.sendLogs( localStorage.getItem( 'U_ID' ) );
							//Modified for activity logging end

						}
						catch( exception ){

							console.log( "Logging failed!" );
							console.log( exception );

						}
						//Modified for activity logging end
		
					} else {
		
						toastr.error(editor.languageData.Pleasegiveavalidlocation);
		
					}

				}
				else{

					toastr.error(editor.languageData.Cantconnectwithservertogetthecompletecameraspecs );

				}

			}, function(error) {

				console.log( error );
				toastr.error(editor.languageData.SorrysomethingwentwrongPleasetryagainaftersometime);

			} );

			getCamSpecs.setProgressTrackers( function( info ){
				
			}, function( info ){

				if ( info.status == 500 ){

					console.log( "Error contacting server!" );
					toastr.error(editor.languageData.SorrysomethingwentwrongPleasetryagainaftersometime);

				}

			} );

			getCamSpecs.sendRequest();
			//MODIFIED TO GET THE CAMERA SPECS FROM API END
			
		} );
		
		if(localStorage.getItem("viewmode") != "true")
	    	camDetailsSaveBtnRow.add(objectDetailsSaveBtn);
	    outerBorder.add(camDetailsSaveBtnRow);

	    container.add(outerBorder);

		/**********MODIFIED TO ADD CAMERA BRAND END**********/
		
		/**********MODIFIED TO ADD SENSOR BRAND START**********/

		var sensorOuterBorder = new UI.Div();
	    sensorOuterBorder.setClass('sensor-details-ui');
	    var header = new UI.Div();
	    header.setClass('cam-details-ui-header text-center');
	    header.add(new UI.Text(editor.languageData.SensorDetails).setWidth('90px'));
	    sensorOuterBorder.add(header);

		var sensorImgPreivewDiv = new UI.Row().setStyle( ['height'],['80px'] );
		sensorImgPreivewDiv.setStyle( ['margin-left'],['auto'] );
		sensorImgPreivewDiv.setStyle( ['margin-right'],['auto'] );
		var sensorImgPreivew = new UI.Div();
		sensorImgPreivew.setId( 'sensor-preview' );
		sensorImgPreivewDiv.add( sensorImgPreivew );
		sensorOuterBorder.add( sensorImgPreivewDiv ); 

		var sensorBrandRow = new UI.Row();
		var sensorBrandInput = new UI.Text();
		sensorBrandRow.add( new UI.Text( editor.languageData.SensorBrand).setWidth( '90px' ) );
		sensorBrandRow.add( sensorBrandInput );

		var sensorModelRow = new UI.Row();
		var sensorModelInput = new UI.Text();
		sensorModelRow.add( new UI.Text( editor.languageData.SensorModel).setWidth( '90px' ) );
		sensorModelRow.add( sensorModelInput );

		var sensorCategoryRow = new UI.Row();
		var sensorCategoryInput = new UI.Text();
		sensorCategoryRow.add( new UI.Text( editor.languageData.Cat).setWidth( '90px' ) );
		sensorCategoryRow.add( sensorCategoryInput );

		var sensorCategoryRow = new UI.Row();
		var sensorCategoryInput = new UI.Text();
		sensorCategoryRow.add( new UI.Text( editor.languageData.Cat).setWidth( '90px' ) );
		sensorCategoryRow.add( sensorCategoryInput );

		var sensorSubCategoryRow = new UI.Row();
		var sensorSubCategoryInput = new UI.Text();
		sensorSubCategoryRow.add( new UI.Text( editor.languageData.SubCat ).setWidth( '90px' ) );
		sensorSubCategoryRow.add( sensorSubCategoryInput )

		var sensorFrustumRow = new UI.Row();
		var sensorFrustumSelect = new UI.Select();
		var frustum = new Array();
		frustum['Cylinder Frustum'] = "Cylinder Frustum";
		frustum['Spherical Frustum'] = "Spherical Frustum";
		sensorFrustumSelect.setOptions( frustum );
		sensorFrustumRow.add( new UI.Text( editor.languageData.SensorFrustum ).setWidth( '90px' ));
		sensorFrustumRow.add( sensorFrustumSelect );

		var sphereTypeRow = new UI.Row();
		var sphereTypeSelect = new UI.Select();
		var types = new Array();
		types['full-sphere'] = "full-sphere";
		types['half-sphere-top'] = "half-sphere-top";
		types['half-sphere-bottom'] = "half-sphere-bottom";
		sphereTypeSelect.setOptions( types );
		sphereTypeRow.add( new UI.Text( editor.languageData.SphereShape ).setWidth( '90px' ) );
		sphereTypeRow.add( sphereTypeSelect );
		sphereTypeRow.setStyle( 'display', ['none'] )

		function changeFrusutm( event ){

			var smartSensor = editor.selected;
			var spec = editor.selected.userData.sensorData;
			var point;
			if( smartSensor && smartSensor.userData && smartSensor.userData.sensorData ){

				if( spec.frustum != event.target.value ){

					if( spec.radius != "" || spec.height != "" ){

						smartSensor.children.forEach( (child) => {

							if( child instanceof THREE.Mesh ){
								THREE.SceneUtils.detach( child, smartSensor, editor.scene );
								editor.execute( new RemoveObjectCommand( child ) );
			
							}
			
						} )
						var colour = editor.randomColor();
						if( event.target.value === "Cylinder Frustum" ){

							sphereTypeRow.setStyle( 'display', ['none'] );
							spec.frustum = event.target.value;
							var point = smartSensor.position;
							var radius = 50;
							var height = 25;
							if( spec.radius != "" && spec.radius != undefined ){
								radius = spec.radius;
							}
								
							if( spec.height != "" && spec.height != undefined ){
								height = spec.height;
							} 
				
							radiusInTargetUnit = radius/3.28084
							heightInTargetUnit = height/3.28084
							var endAngle = 2*Math.PI;
                			if( spec.sensorAngle != undefined && spec.sensorAngle != '' ){
                			    endAngle = spec.sensorAngle * (Math.PI/180);
                			}
                			var geometry = new THREE.CylinderGeometry( radiusInTargetUnit, radiusInTargetUnit, heightInTargetUnit, 200, 200, false, 0, endAngle );
							var material = new THREE.MeshBasicMaterial( {color: colour, transparent: true, opacity: 0.5, side: THREE.DoubleSide} );
							material.depthWrite = false;
							var cylinder = new THREE.Mesh( geometry, material );
							cylinder.position.copy( point )
							cylinder.position.setY( point.y - heightInTargetUnit/2 )
							editor.execute( new AddObjectCommand( cylinder ) )
							THREE.SceneUtils.attach( cylinder, editor.scene, smartSensor )
				
						} else {

							sphereTypeRow.setStyle( 'display', ['block'] )
							spec.frustum = "Spherical Frustum";
							if( event.target.value === "Spherical Frustum" ){
								
								smartSensor.userData.sensorData.sphereType = "full-sphere"
							} else{

								sensorFrustumSelect.setValue( "Spherical Frustum" )
								smartSensor.userData.sensorData.sphereType = event.target.value;
							}
								

							var startAngle, endAngle;
							if( event.target.value === "Spherical Frustum" || event.target.value === "full-sphere" ){
								
								if( event.target.value === "Spherical Frustum" )
									
								startAngle = 0;
								endAngle = Math.PI;

							} else if( event.target.value === "half-sphere-top" ){

								startAngle = 0;
								endAngle = Math.PI/2;

							} else if( event.target.value === "half-sphere-bottom" ){

								startAngle = Math.PI/2;
								endAngle = Math.PI;
							}

							var radius = 50;
							if( spec.radius != "" && spec.radius != undefined ){
								radius = spec.radius;
							}
							radiusInTargetUnit = radius/3.28084;
                			var geometry = new THREE.SphereGeometry( radiusInTargetUnit, 500, 500, 0, 2*Math.PI, startAngle, endAngle );
                			var material = new THREE.MeshBasicMaterial( {color: colour, transparent: true, opacity: 0.5, side: THREE.DoubleSide} );
							material.depthWrite = false;
							var sphere = new THREE.Mesh( geometry, material );
							sphere.position.copy( smartSensor.position )	
							editor.execute( new AddObjectCommand( sphere ) )
							THREE.SceneUtils.attach( sphere, editor.scene, smartSensor );

						}

					}
					editor.select( smartSensor )
				}
					

			}

		}

		sensorFrustumSelect.onChange( changeFrusutm );

		sphereTypeSelect.onChange( changeFrusutm )
		
		sensorOuterBorder.add( sensorBrandRow );
		sensorOuterBorder.add( sensorModelRow );
		sensorOuterBorder.add( sensorCategoryRow );
		sensorOuterBorder.add( sensorSubCategoryRow );
		sensorOuterBorder.add( sensorFrustumRow );
		sensorOuterBorder.add( sphereTypeRow );

		container.add( sensorOuterBorder )

		/**********MODIFIED TO ADD SENSOR BRAND END**********/


	    // position

	    var objectPositionRow = new UI.Row();
	    var objectPositionX = new UI.Number().setWidth('55px').onChange(update);
	    var objectPositionY = new UI.Number().setWidth('55px').onChange(update);
	    var objectPositionZ = new UI.Number().setWidth('55px').onChange(update);
	   /* objectPositionX.setUnit('ft');
	    objectPositionY.setUnit('ft');
	    objectPositionZ.setUnit('ft');*/
	    objectPositionRow.add(new UI.Text(editor.languageData.Position).setWidth('90px'));
	    objectPositionRow.add(objectPositionX, objectPositionY, objectPositionZ);

		container.add(objectPositionRow);
		
		//Camera Offset
		var camOffsetRow = new UI.Row();
		var camOffsetX = new UI.Number().setWidth( '36px' ).setValue( 0.0 );
	    var camOffsetY = new UI.Number().setWidth( '36px' ).setValue( 0.0 );
	    var camOffsetZ = new UI.Number().setWidth( '36px' ).setValue( 0.0 );
	    camOffsetRow.add( new UI.Text(editor.languageData.Offset).setWidth( '90px' ) );
	    camOffsetRow.add( camOffsetX, camOffsetY, camOffsetZ );
		
		
		var updateCamOffsetBtn = new UI.Button(editor.languageData.Apply).setMarginLeft( '0px' ).onClick( function(){

			var cam = editor.selected;
			if( cam != null ){

				var originalPos = cam.position;
				var posOffset = new THREE.Vector3( camOffsetX.getValue(), camOffsetY.getValue(), camOffsetZ.getValue() );
				var posOffsetIn3D = new THREE.Vector3( camOffsetX.getValue() / editor.commonMeasurements.targetConversionFactor, camOffsetY.getValue() / editor.commonMeasurements.targetConversionFactor, camOffsetZ.getValue() / editor.commonMeasurements.targetConversionFactor ); //Edited to convert to target conversion factor
				var updatedPos = originalPos.add( posOffsetIn3D );
				cam.mountingOffset = posOffsetIn3D;
				//cam.position.set( updatedPos.x, updatedPos.y, updatedPos.z );
				editor.execute( new SetPositionCommand( cam, updatedPos ) );
				objectPositionX.setValue( cam.position.x * editor.commonMeasurements.targetConversionFactor ); //Edited to convert to target conversion factor
				objectPositionY.setValue( cam.position.y * editor.commonMeasurements.targetConversionFactor ); //Edited to convert to target conversion factor
				objectPositionZ.setValue( cam.position.z * editor.commonMeasurements.targetConversionFactor); //Edited to convert to target conversion factor
				editor.signals.sceneGraphChanged.dispatch();
				update();

				//Modified to update line-of-sight and reference point w.r.t camera change start
				if( cam.userData.objectUuid != "notset" && cam.userData.lineUUID ){

					editor.signals.updateCameraAndRefPoint.dispatch( cam );

				}
				//Modified to update line-of-sight and reference point w.r.t camera change end

				toastr.info(editor.languageData.OffsetvaluesetforcameraYouhavetoapplytheoffseteachtimeafteryouchangethecamerasposition);

				//Modified for activity logging start
				try{

					//Modified for activity logging start
					var logDatas = {};
					logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Mounting offset value set for "  + cam.name + ", Offset : " + JSON.stringify( posOffset ) + ", New position" + JSON.stringify( updatedPos );
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
		camOffsetRow.add( updateCamOffsetBtn );
		container.add( camOffsetRow );

	    // rotation

	    var objectRotationRow = new UI.Row();
	    var objectRotationX = new UI.Number().setRange( -360.00, 360.00 ).setStep(10).setUnit('°').setWidth('50px').setId( 'SideBarRotationX' ).onChange( function( event ){
			
			if( editor.selected instanceof THREE.PerspectiveCamera && editor.selected.camCategory != undefined && editor.selected.camCategory === 'Fixed Dome' ){

				objectRotationX.setValue( THREE.Math.RAD2DEG * editor.selected.rotation.x );
				toastr.info(editor.languageData.Domecamerascantberotatedinxorydirection);
				return;
				
			}
			update();
			document.getElementById( "ObjectRotationX" ).value = Number( objectRotationX.getValue() ).toFixed(2);
			editor.rotationControls.setDirection( 'x' );

		} );
	    var objectRotationY = new UI.Number().setRange( -360.00, 360.00 ).setStep(10).setUnit('°').setWidth('50px').setId( 'SideBarRotationY' ).onChange( function( event ){
			
			if( editor.selected instanceof THREE.PerspectiveCamera && editor.selected.camCategory != undefined && editor.selected.camCategory === 'Fixed Dome' ){

				objectRotationY.setValue( THREE.Math.RAD2DEG * editor.selected.rotation.y );
				toastr.info( editor.languageData.Domecamerascantberotatedinxorydirection);
				return;
				
			}
			update();
			document.getElementById( "ObjectRotationY" ).value = Number( objectRotationY.getValue() ).toFixed(2);
			editor.rotationControls.setDirection( 'y' );

		} );
	    var objectRotationZ = new UI.Number().setRange( -360.00, 360.00 ).setStep(10).setUnit('°').setWidth('50px').setId( 'SideBarRotationZ' ).onChange( function( event ){
			
			update();
			document.getElementById( "ObjectRotationZ" ).value = Number( objectRotationZ.getValue() ).toFixed(2);
			editor.rotationControls.setDirection( 'z' );
			
		} );

	    objectRotationRow.add(new UI.Text(editor.languageData.Rotation).setWidth('90px'));
	    objectRotationRow.add(objectRotationX, objectRotationY, objectRotationZ);
	    objectRotationRow.setId('rotation');
	    container.add(objectRotationRow);

	    // scale

	    var objectScaleRow = new UI.Row();
	    var objectScaleLock = new UI.Checkbox(true).setPosition('absolute').setLeft('75px');
	    var objectScaleX = new UI.Number(1).setRange(0.01, Infinity).setWidth('50px').onChange(updateScaleX);
	    var objectScaleY = new UI.Number(1).setRange(0.01, Infinity).setWidth('50px').onChange(updateScaleY);
	    var objectScaleZ = new UI.Number(1).setRange(0.01, Infinity).setWidth('50px').onChange(updateScaleZ);

	    objectScaleRow.add(new UI.Text(editor.languageData.Scale).setWidth('90px'));
	    objectScaleRow.add(objectScaleLock);
	    objectScaleRow.add(objectScaleX, objectScaleY, objectScaleZ);

	    container.add(objectScaleRow);

	    // fov

	    /*var objectFovRow = new UI.Row();
	    var objectFov = new UI.Number().onChange(update);

	    objectFovRow.add(new UI.Text(editor.languageData.Fov).setWidth('90px'));
	    objectFovRow.add(objectFov);

		container.add(objectFovRow);*/
		
		// hfov

	    var objectHFovRow = new UI.Row();
	    var objectHFov = new UI.Number().onChange(update);

	    objectHFovRow.add(new UI.Text(editor.languageData.HFov).setWidth('90px'));
	    objectHFovRow.add(objectHFov);

	    container.add(objectHFovRow);

	    // near

	    var objectNearRow = new UI.Row();
	    var objectNear = new UI.Number().onChange(update);

	    objectNearRow.add(new UI.Text(editor.languageData.Near).setWidth('90px'));
	    objectNearRow.add(objectNear);

	    container.add(objectNearRow);

	    // far

	    var objectFarRow = new UI.Row();
	    var objectFar = new UI.Number().onChange(update);

	    objectFarRow.add(new UI.Text(editor.languageData.Far).setWidth('90px'));
	    objectFarRow.add(objectFar);

	    container.add(objectFarRow);

	    // intensity

	    var objectIntensityRow = new UI.Row();
	    var objectIntensity = new UI.Number().setRange(0, Infinity).onChange(update);

	    objectIntensityRow.add(new UI.Text(editor.languageData.Intensity).setWidth('90px'));
	    objectIntensityRow.add(objectIntensity);

	    container.add(objectIntensityRow);

	    // color

	    var objectColorRow = new UI.Row();
	    var objectColor = new UI.Color().onChange(update);

	    objectColorRow.add(new UI.Text(editor.languageData.Color).setWidth('90px'));
	    objectColorRow.add(objectColor);

	    container.add(objectColorRow);

	    // ground color

	    var objectGroundColorRow = new UI.Row();
	    var objectGroundColor = new UI.Color().onChange(update);

	    objectGroundColorRow.add(new UI.Text(editor.languageData.Groundcolor).setWidth('90px'));
	    objectGroundColorRow.add(objectGroundColor);

	    container.add(objectGroundColorRow);

	    // angle

	    var objectAngleRow = new UI.Row();
	    var objectAngle = new UI.Number().setPrecision(3).setRange(0, Math.PI / 2).onChange(update);

	    objectAngleRow.add(new UI.Text(editor.languageData.Angle).setWidth('90px'));
	    objectAngleRow.add(objectAngle);

	    container.add(objectAngleRow);

	    // penumbra

	    var objectPenumbraRow = new UI.Row();
	    var objectPenumbra = new UI.Number().setRange(0, 1).onChange(update);

	    objectPenumbraRow.add(new UI.Text(editor.languageData.Penumbra).setWidth('90px'));
	    objectPenumbraRow.add(objectPenumbra);

	    container.add(objectPenumbraRow);

	    // decay

	    var objectDecayRow = new UI.Row();
	    var objectDecay = new UI.Number().setRange(0, Infinity).onChange(update);

	    objectDecayRow.add(new UI.Text(editor.languageData.Decay).setWidth('90px'));
	    objectDecayRow.add(objectDecay);

	    container.add(objectDecayRow);

	    // shadow

	    var objectShadowRow = new UI.Row();

	    objectShadowRow.add(new UI.Text(editor.languageData.Shadow).setWidth('90px'));

	    var objectCastShadow = new UI.THREE.Boolean(false, editor.languageData.cast ).onChange(update);
	    objectShadowRow.add(objectCastShadow);

	    var objectReceiveShadow = new UI.THREE.Boolean(false, editor.languageData.receive).onChange(update);
	    objectShadowRow.add(objectReceiveShadow);

	    var objectShadowRadius = new UI.Number(1).onChange(update);
	    objectShadowRow.add(objectShadowRadius);

	    container.add(objectShadowRow);

	    // visible

	    var objectVisibleRow = new UI.Row();
	    var objectVisible = new UI.Checkbox().onChange(update);

	    objectVisibleRow.add(new UI.Text(editor.languageData.Visible).setWidth('90px'));
	    objectVisibleRow.add(objectVisible);

		container.add(objectVisibleRow);
		
		// * Badge Color *

		function onBadgeColorChanged( event ) {
					
			var twoDLine = editor.selected;
			twoDLine.traverse( function( child ){
				if( child instanceof THREE.Sprite && child.name === 'TwoDMeasurementBadge' ){

					var lineID = child.userData.lineID;
					var lineNumber = child.userData.lineNumber;
					var newBadgeColorSelected = newBadgeColor.getValue();
					var badgeLabelText = editor.scene.userData.twoDDrawingDatas[ lineID ][ lineNumber ].distance;
					if( badgeLabelText != undefined ){
						child.userData.badgeColor = newBadgeColorSelected;
						var badgeTexture = editor.commonMeasurements.getNumberBadgeTransparent( { badgeText : badgeLabelText, badgeWidth : 105, badgeHeight : 35, fontSize : "16px", fontColor : newBadgeColorSelected, strokeColor : "#500080", borderRadius : 7, type : "image" } );
						child.material.map = badgeTexture;
						child.material.needsUpdate = true;
						editor.signals.sceneGraphChanged.dispatch();
					}
				}
			} );
	
		}

		

		function onPointOfInterestColorChanged( event ) {

			var color =  newPOIColor.getValue();
			editor.pointOfinterestObject.editColor(color);
			editor.signals.sceneGraphChanged.dispatch();

		}
		

		var badgeColorRow = new UI.Row().setId("badge-color-row");
		var newBadgeColor = new UI.Color().setValue( '#FF0000' ).setId('badge-color-value').onChange( onBadgeColorChanged );
		badgeColorRow.add(new UI.Text("Badge color").setWidth('90px'));
		badgeColorRow.add(newBadgeColor);
		container.add(badgeColorRow);

		// Point of Interest color
		var pointOfInterestColorRow = new UI.Row().setId("pointofinterest-color-row").setStyle('display',['none']);
		var newPOIColor = new UI.Color().setValue( '#FF0000' ).setId('pointofinterest-color-value').onChange( onPointOfInterestColorChanged );
		pointOfInterestColorRow.add(new UI.Text("Point of Interest Color").setWidth('90px'));
		pointOfInterestColorRow.add(newPOIColor);
		//container.add(pointOfInterestColorRow);

	    // user data

	    var timeout;

	    //commented to hide userdata field
	    /*var objectUserDataRow = new UI.Row();
				var objectUserData = new UI.TextArea().setWidth( '150px' ).setHeight( '40px' ).setFontSize( '12px' ).onChange( update );
				objectUserData.onKeyUp( function () {
		
					try {
		
						JSON.parse( objectUserData.getValue() );
		
						objectUserData.dom.classList.add( 'success' );
						objectUserData.dom.classList.remove( 'fail' );
		
					} catch ( error ) {
		
						objectUserData.dom.classList.remove( 'success' );
						objectUserData.dom.classList.add( 'fail' );
		
					}
		
				} );
		
				objectUserDataRow.add( new UI.Text( 'User data' ).setWidth( '90px' ) );
				objectUserDataRow.add( objectUserData );*/

	    //container.add( objectUserDataRow );//commented to hide

	    //

	    function updataCameraParameters(object, model, Callback) {

	        var Objects = object;
	        var Models = model;
	        var value = [];
	        editor.camspecfull.forEach(function(cameradata) {
	            if (cameradata.model == Models) {
	                value = [cameradata.children[0].vertical_aov, cameradata.children[0].far, cameradata.children[0].min_focal, model, cameradata.children[0].image_url,cameradata.children[0].horizontal_aov,cameradata.children[0].min_horizontal_aov,cameradata.children[0].form_factor];
	                Callback(Objects, value);
	            }
	        });

	    }
	    var updatecameraCallback = function(Objects, value) {


			var oldCamCategory = Objects.camCategory;
			Objects.camCategory = value[7];

			if( value[7] == "Fisheye" ){
				
				objectFar.setValue(value[1] * editor.commonMeasurements.targetConversionFactor );
				Objects.name = CameraBrand.getValue()+ " " + value[3];
				Objects.iconUrl = value[4];
				Objects.fov = 140;
				Objects.updateProjectionMatrix();
			}
			else if( value[7] == "Panorama" ){
				
				objectFar.setValue(value[1] * editor.commonMeasurements.targetConversionFactor );
				Objects.name = CameraBrand.getValue()+ " " + value[3];
				Objects.iconUrl = value[4];
				Objects.fov = 360;
				editor.removeHelper(Objects);
				editor.addHelper(Objects);
				editor.signals.sceneGraphChanged.dispatch();
				
			}
			else if( value[7] == "Dome" ){
				objectHFov.setValue(value[5]);
				Objects.hFOV = value[5];
				Objects.name = CameraBrand.getValue()+ " " + value[3];
				Objects.iconUrl = value[4];
				Objects.fov = value[0];
				Objects.minHorizontalAOV = value[6];
				editor.execute( new SetRotationCommand( Objects, new THREE.Euler( -1.57, 0, 0 ) ) );
				Objects.updateProjectionMatrix();
				update();

			} else if( value[7] == "PTZ" ){
				objectHFov.setValue(value[5]);
				Objects.hFOV = value[5];
				Objects.name = CameraBrand.getValue()+ " " + value[3];
				Objects.iconUrl = value[4];
				Objects.fov = value[0];
				Objects.minHorizontalAOV = value[6];
				editor.execute( new SetRotationCommand( Objects, new THREE.Euler( 0, 0, 0 ) ) );
				Objects.updateProjectionMatrix();
				update();

			}
			else{
				
				objectHFov.setValue(value[5]);
				//objectFar.setValue(value[1] * editor.commonMeasurements.targetConversionFactor ); //Edited to convert to target conversion factor
				//Objects.focus = value[2];
				Objects.hFOV = value[5];
				Objects.name = CameraBrand.getValue()+ " " + value[3];
				Objects.iconUrl = value[4];
				Objects.fov = value[0];
				Objects.minHorizontalAOV = value[6];
				Objects.updateProjectionMatrix();
				update();

			}


	    }

	    function updateScaleX() {

	        var object = editor.selected;

	        if (objectScaleLock.getValue() === true) {

	            var scale = objectScaleX.getValue() / object.scale.x;

	            objectScaleY.setValue(objectScaleY.getValue() * scale);
	            objectScaleZ.setValue(objectScaleZ.getValue() * scale);

	        }

	        update();

	    }

	    function referenceUpdate() {
	        var currentCamera = editor.selected;

	        editor.scene.traverse(function(child) {

	            if (child.uuid === currentCamera.userData.objectUuid) {

	                var newRefPostion = new THREE.Vector3(ReferenceX.getValue() / editor.commonMeasurements.targetConversionFactor , ReferenceY.getValue() / editor.commonMeasurements.targetConversionFactor, ReferenceZ.getValue() / editor.commonMeasurements.targetConversionFactor); //Edited to convert to target conversion factor
	            	editor.execute(new SetPositionCommand(child, newRefPostion));

					editor.selected = currentCamera;
					
					if( child.userData.checkLOSFlag === 'set' || child.userData.checkDetailsFlag === 'set' ){

						var refPointPosition = child.position.clone();
						var referencePoint = child;
						lineUUID = child.userData.lineUUID;
						camUUID = child.camerauuid;
						refCam = editor.scene.getObjectByProperty( 'uuid', camUUID );
						refLine = editor.scene.getObjectByProperty( 'uuid', lineUUID );		
						var camPosition = refCam.position.clone();
						var Distance = ( ( refPointPosition.distanceTo( camPosition ) ) * editor.commonMeasurements.targetConversionFactor ).toFixed(1);

						//Modified to include absolute height and absolute distance start
						var absHeight = Math.abs((( camPosition.y - refPointPosition.y )* editor.commonMeasurements.targetConversionFactor ).toFixed(1));
						var absDistance = Math.abs((( camPosition.x - refPointPosition.x )* editor.commonMeasurements.targetConversionFactor ).toFixed(1));
						//Modified to include absolute height and absolute distance end
						refCam.userData.absHeight = absHeight;
						refCam.userData.absDistance = absDistance;

						//Modified to include reference point position in camera userdata start
						refCam.userData.reference = refPointPosition;
						//Modified to include referencepoint position in camera userdata end

						var badgeLabelText;
						if( editor.commonMeasurements.targetUnit === "meter" ){

							badgeLabelText = Distance + " m";
							absHeight = absHeight + " m";
                    		absDistance = absDistance + " m";

						} 
						else if(  editor.commonMeasurements.targetUnit === "feet"  ) {

							badgeLabelText = Distance + " ft";
							absHeight = absHeight + " ft";
                    		absDistance = absDistance + " ft";

						}

						var relPoint = new THREE.Vector3();
						relPoint.x = camPosition.x - refPointPosition.x;
						relPoint.y = camPosition.y - refPointPosition.y;
						relPoint.z = camPosition.z - refPointPosition.z;

						if( referencePoint.userData.checkDetailsFlag === 'set' ){

							var data = {

								dis: badgeLabelText,
								changedPos: relPoint,
								refuuid: referencePoint.uuid,
								absoluteHeight: absHeight,
                        		absoluteDistance: absDistance

							}

							editor.signals.refCamAttributesChanged.dispatch( data );

						}

						if( child.userData.checkLOSFlag === 'set' ){

							var processedLine = processRefCamLineEndPoints( refLine, refPointPosition, camPosition, badgeLabelText );

						}								

						child.userData.refCamDistance = badgeLabelText;
						child.userData.absHeight = absHeight;
						child.userData.absDistance = absDistance;
						editor.signals.sceneGraphChanged.dispatch();	

					}
				} 

			});
			
		}
		 
		function updateActualCameraPosition(){

			var currentCamera = editor.selected;
			var refPointUUID = currentCamera.userData.objectUuid;
			var referencePoint = editor.scene.getObjectByProperty( 'uuid', refPointUUID );

			if(currentCamera.userData.objectUuid === "notset"){

				var actualPositionVector = new THREE.Vector3(  cameraReferenceX.getValue() / editor.commonMeasurements.targetConversionFactor, cameraReferenceY.getValue() / editor.commonMeasurements.targetConversionFactor, cameraReferenceZ.getValue() / editor.commonMeasurements.targetConversionFactor );//Edited to convert to target conversion factor
				editor.execute(new SetPositionCommand(currentCamera, actualPositionVector));
			}
			else{

				var currentCameraUserDataRef = referencePoint.position.clone();
				var actualPositionVector = new THREE.Vector3( currentCameraUserDataRef.x + cameraReferenceX.getValue() / editor.commonMeasurements.targetConversionFactor,  currentCameraUserDataRef.y +cameraReferenceY.getValue() / editor.commonMeasurements.targetConversionFactor,  currentCameraUserDataRef.z + cameraReferenceZ.getValue() / editor.commonMeasurements.targetConversionFactor ); //Edited to convert to target conversion factor
				editor.execute(new SetPositionCommand(currentCamera, actualPositionVector));

				if( ( currentCamera instanceof THREE.PerspectiveCamera ) && ( currentCamera.userData.objectUuid != "notset" ) && ( currentCamera.userData.lineUUID ) ){

					var camPosition = currentCamera.position.clone();
					lineUUID = currentCamera.userData.lineUUID;
					refUUID = currentCamera.userData.refUUID;
					RefPt = editor.scene.getObjectByProperty( 'uuid', refUUID );
					refLine = editor.scene.getObjectByProperty( 'uuid', lineUUID );
					var refPosition = RefPt.position.clone();
					
					var relPoint = new THREE.Vector3();
					relPoint.x = camPosition.x - refPosition.x;
					relPoint.y = camPosition.y - refPosition.y;
					relPoint.z = camPosition.z - refPosition.z;

					var Distance = ( ( refPosition.distanceTo( camPosition ) ) * editor.commonMeasurements.targetConversionFactor ).toFixed(1);

					//Modified to include absolute height and absolute distance start
					var absHeight = Math.abs((( camPosition.y - refPosition.y )* editor.commonMeasurements.targetConversionFactor ).toFixed(1));
					var absDistance = Math.abs((( camPosition.x - refPosition.x )* editor.commonMeasurements.targetConversionFactor ).toFixed(1));
					//Modified to include absolute height and absolute distance end
					currentCamera.userData.absHeight = absHeight;
					currentCamera.userData.absDistance = absDistance;

					var badgeLabelText;
					if( editor.commonMeasurements.targetUnit === "meter" ) {

						badgeLabelText = Distance + " m";
						absHeight = absHeight + " m";
                    	absDistance = absDistance + " m";

					}
					else if(  editor.commonMeasurements.targetUnit === "feet"  ){

						badgeLabelText = Distance + " ft";
						absHeight = absHeight + " ft";
                    	absDistance = absDistance + " ft";

					} 
					
					if( RefPt.userData.checkLOSFlag === 'set' ){

						var processedLine = processRefCamLineEndPoints( refLine, refPosition, camPosition, badgeLabelText );

						RefPt.userData.refCamDistance = badgeLabelText;
						RefPt.userData.absHeight = absHeight;
						RefPt.userData.absDistance = absDistance;
						editor.signals.sceneGraphChanged.dispatch();

					}

					if( RefPt.userData.checkDetailsFlag === 'set' ){

						var data = {

							dis: badgeLabelText,
							changedPos: relPoint,
							refuuid: RefPt.uuid,
							absoluteHeight: absHeight,
                        	absoluteDistance: absDistance


						}

						editor.signals.refCamAttributesChanged.dispatch( data );

					}

				}

			}

		}

	    function updateScaleY() {

	        var object = editor.selected;

	        if (objectScaleLock.getValue() === true) {

	            var scale = objectScaleY.getValue() / object.scale.y;

	            objectScaleX.setValue(objectScaleX.getValue() * scale);
	            objectScaleZ.setValue(objectScaleZ.getValue() * scale);

	        }

	        update();

	    }

	    function updateScaleZ() {

	        var object = editor.selected;

	        if (objectScaleLock.getValue() === true) {

	            var scale = objectScaleZ.getValue() / object.scale.z;

	            objectScaleX.setValue(objectScaleX.getValue() * scale);
	            objectScaleY.setValue(objectScaleY.getValue() * scale);

	        }

	        update();

	    }

	    function update() {

	        var object = editor.selected;
	        selectedType = '';
	        if (object !== null) {

	            previousXposition = objectPositionX.getValue()/editor.commonMeasurements.targetConversionFactor; //Edited to convert to target conversion factor
	            previousYposition = objectPositionY.getValue()/editor.commonMeasurements.targetConversionFactor; //Edited to convert to target conversion factor
	            previousZposition = objectPositionZ.getValue()/editor.commonMeasurements.targetConversionFactor; //Edited to convert to target conversion factor

	            currentXposition = object.position.x;
	            currentYposition = object.position.y;
	            currentZposition = object.position.z;
	            if (previousXposition != currentXposition && previousZposition != currentZposition && previousYposition != currentYposition) {
	                changeBackgroundColourZ(objectPositionZ);
	                changeBackgroundColourX(objectPositionX);
	                changeBackgroundColourY(objectPositionY);
	            } else if (previousXposition != currentXposition && previousYposition != currentYposition) {
	                objectPositionZ.setStyle('background-color', ['transparent']);
	                changeBackgroundColourX(objectPositionX);
	                changeBackgroundColourY(objectPositionY);
	            } else if (previousYposition != currentYposition && previousZposition != currentZposition) {
	                objectPositionX.setStyle('background-color', ['transparent']);
	                changeBackgroundColourZ(objectPositionZ);
	                changeBackgroundColourY(objectPositionY);
	            } else if (previousXposition != currentXposition && previousZposition != currentZposition) {
	                objectPositionY.setStyle('background-color', ['transparent']);
	                changeBackgroundColourX(objectPositionX);
	                changeBackgroundColourZ(objectPositionZ);
	            } else if (previousYposition != currentYposition) {

	                objectPositionZ.setStyle('background-color', ['transparent']);
	                objectPositionX.setStyle('background-color', ['transparent']);
	                changeBackgroundColourY(objectPositionY);
	            } else if (previousZposition != currentZposition) {
	                objectPositionX.setStyle('background-color', ['transparent']);
	                objectPositionY.setStyle('background-color', ['transparent']);
	                changeBackgroundColourZ(objectPositionZ);
	            } else if (previousXposition != currentXposition) {
	                objectPositionZ.setStyle('background-color', ['transparent']);
	                objectPositionY.setStyle('background-color', ['transparent']);
	                changeBackgroundColourX(objectPositionX);
	            }

	            var newPosition = new THREE.Vector3( ( objectPositionX.getValue()/editor.commonMeasurements.targetConversionFactor ), ( objectPositionY.getValue()/editor.commonMeasurements.targetConversionFactor ), ( objectPositionZ.getValue()/editor.commonMeasurements.targetConversionFactor ) ); //Edited to convert to target conversion factor
	            if (object.position.distanceTo(newPosition) >= 0.01) {

	                if (object.camerauuid != undefined) {
						
						toastr.info(editor.languageData.ClickonUpdateinCameraDetailsThenonlythispositonistakenasreferece);
						
						if( object.userData.checkLOSFlag == "set" || object.userData.checkDetailsFlag == "set" ){

							var refPointPosition = newPosition.clone();
							var referencePoint = object;
							lineUUID = object.userData.lineUUID;
							camUUID = object.camerauuid;
							refCam = editor.scene.getObjectByProperty( 'uuid', camUUID );
							refLine = editor.scene.getObjectByProperty( 'uuid', lineUUID );		
			
							var camPosition = refCam.position.clone();
							var Distance = ( ( refPointPosition.distanceTo( camPosition ) ) * editor.commonMeasurements.targetConversionFactor ).toFixed(1);

							//Modified to include absolute height and absolute distance start
							var absHeight = Math.abs((( camPosition.y - refPointPosition.y ) * editor.commonMeasurements.targetConversionFactor ).toFixed(1)); //Edited to convert to target conversion factor
							var absDistance = Math.abs((( camPosition.x - refPointPosition.x ) * editor.commonMeasurements.targetConversionFactor ).toFixed(1)); //Edited to convert to target conversion factor
							//Modified to include absolute height and absolute distance end
							refCam.userData.absHeight = absHeight;
							refCam.userData.absDistance = absDistance;

							//Modified to include reference point position in camera userdata start
							refCam.userData.reference = refPointPosition;
							//Modified to include referencepoint position in camera userdata end

							var badgeLabelText;
							if( editor.commonMeasurements.targetUnit === "meter" ){

								badgeLabelText = Distance + " m";
								absHeight = absHeight + " m";
                    			absDistance = absDistance + " m";

							} 
							else if(  editor.commonMeasurements.targetUnit === "feet"  ) {

								badgeLabelText = Distance + " ft";
								absHeight = absHeight + " ft";
                    			absDistance = absDistance + " ft";

							}

							var relPoint = new THREE.Vector3();
							relPoint.x = camPosition.x - refPointPosition.x;
							relPoint.y = camPosition.y - refPointPosition.y;
							relPoint.z = camPosition.z - refPointPosition.z;

							if( referencePoint.userData.checkDetailsFlag === 'set' ){

								var data = {

									dis: badgeLabelText,
									changedPos: relPoint,
									refuuid: referencePoint.uuid,
									absoluteHeight: absHeight,
                        			absoluteDistance: absDistance

								}

								editor.signals.refCamAttributesChanged.dispatch( data );

							}

							if( object.userData.checkLOSFlag === 'set' ){

								var processedLine = processRefCamLineEndPoints( refLine, refPointPosition, camPosition, badgeLabelText );

							}								

							object.userData.refCamDistance = badgeLabelText;
							object.userData.absHeight = absHeight;
							object.userData.absDistance = absDistance;
							editor.signals.sceneGraphChanged.dispatch();		

						}

					}

					else if( object.parent.name === "AreaSelectionRectangle" ||  object.parent.name ==="MeasurementConnectionLine"){
						
						editor.signals.arealengthManualPositionChange.dispatch(object);
						
					}

					else if( ( /^(NetworkMarker[\d+])/g ).test( object.name ) === true ){
						
						editor.signals.nwMarkerSidebarPositionChanged.dispatch( object );
						
					}

					else if( ( object instanceof THREE.PerspectiveCamera ) && ( object.userData.objectUuid != "notset" ) && ( object.userData.lineUUID ) ){

						var camPosition = newPosition.clone();
						lineUUID = object.userData.lineUUID;
						refUUID = object.userData.refUUID;
						RefPt = editor.scene.getObjectByProperty( 'uuid', refUUID );
						refLine = editor.scene.getObjectByProperty( 'uuid', lineUUID );
						var refPosition = RefPt.position.clone();

						var Distance = ( ( refPosition.distanceTo( camPosition ) ) * editor.commonMeasurements.targetConversionFactor ).toFixed(1);

						//Modified to include absolute height and absolute distance start
						var absHeight = Math.abs((( camPosition.y - refPosition.y )* editor.commonMeasurements.targetConversionFactor ).toFixed(1));
						var absDistance = Math.abs((( camPosition.x - refPosition.x )* editor.commonMeasurements.targetConversionFactor ).toFixed(1));
						//Modified to include absolute height and absolute distance end
						object.userData.absHeight = absHeight;
						object.userData.absDistance = absDistance;

						var badgeLabelText;
						if( editor.commonMeasurements.targetUnit === "meter" ){

							badgeLabelText = Distance + " m";
							absHeight = absHeight + " m";
                    		absDistance = absDistance + " m";

						} 
						else if(  editor.commonMeasurements.targetUnit === "feet"  ) {

							badgeLabelText = Distance + " ft";
							absHeight = absHeight + " ft";
                    		absDistance = absDistance + " ft";

						}

						if( RefPt.userData.checkLOSFlag === "set" ){

							var processedLine = processRefCamLineEndPoints( refLine, refPosition, camPosition, badgeLabelText );

						}

						var relPoint = new THREE.Vector3();
						relPoint.x = camPosition.x - refPosition.x;
						relPoint.y = camPosition.y - refPosition.y;
						relPoint.z = camPosition.z - refPosition.z;

						if( RefPt.userData.checkDetailsFlag === 'set' ){

							var data = {

								dis: badgeLabelText,
								changedPos: relPoint,
								refuuid: RefPt.uuid,
								absoluteHeight: absHeight,
                        		absoluteDistance: absDistance


							}

							editor.signals.refCamAttributesChanged.dispatch( data );

						}

						RefPt.userData.refCamDistance = badgeLabelText;
						RefPt.userData.absHeight = absHeight;
						RefPt.userData.absDistance = absDistance;
						editor.signals.sceneGraphChanged.dispatch();

					}
					
	                editor.execute(new SetPositionCommand(object, newPosition));

	            }

	            var newRotation = new THREE.Euler(objectRotationX.getValue() * THREE.Math.DEG2RAD, objectRotationY.getValue() * THREE.Math.DEG2RAD, objectRotationZ.getValue() * THREE.Math.DEG2RAD);
	            if (object.rotation.toVector3().distanceTo(newRotation.toVector3()) >= 0.01) {

					if( object instanceof THREE.PerspectiveCamera && editor.selected.userData.threeDModelType != undefined && ( editor.selected.userData.threeDModelType == "Dome" || editor.selected.userData.threeDModelType == "PTZ" || (editor.selected.userData.threeDModelType == "LiDAR" && editor.selected.sensorCategory === object.sensorCategory === "Hitachi LFOM5"  ) ) ) {

						toastr.info(editor.languageData.ManualRotationisdisabledforthiscamera);
						editor.deselect();
						return;
		
					}
					editor.execute(new SetRotationCommand(object, newRotation));
					if( object instanceof THREE.PerspectiveCamera && object.camCategory == "Panorama" ){
						if( simulationManager.panoramaObject[ object.uuid ] != undefined )
						simulationManager.panoramaObject[ object.uuid ].rotateCubeCamera(objectRotationX.getValue() * THREE.Math.DEG2RAD,objectRotationY.getValue() * THREE.Math.DEG2RAD,objectRotationZ.getValue() * THREE.Math.DEG2RAD);
					}
					/*Modified to update the rotaions controls UI during rotation changes from sidebar*/
					editor.rotationControls.updateUI();
					editor.translationControls.updateUI();

	            }

	            var newScale = new THREE.Vector3(objectScaleX.getValue(), objectScaleY.getValue(), objectScaleZ.getValue());
	            if (object.scale.distanceTo(newScale) >= 0.01) {

	                editor.execute(new SetScaleCommand(object, newScale));

	            }

	            /*if (object.fov !== undefined && Math.abs(object.fov - objectFov.getValue()) >= 0.01) {

	                editor.execute(new SetValueCommand(object, 'fov', objectFov.getValue()));
					object.updateProjectionMatrix();
					//Modified to update the simulation additional controls when the camera parameters are changed
					editor.signals.updateSimulationControls.dispatch( object );

				}*/
				
				// hfov

				if (object.hFOV !== undefined && Math.abs(object.hFOV - objectHFov.getValue()) >= 0.01 ) {

					if( object.minHorizontalAOV <= objectHFov.getValue() ){

						editor.execute(new SetValueCommand(object, 'hFOV', objectHFov.getValue()));
						var vAOV =  objectHFov.getValue()  / object.aspect ;
						editor.execute(new SetValueCommand(object, 'fov', vAOV));
						object.updateProjectionMatrix();
						editor.signals.updateSimulationControls.dispatch( object );
					}
					else{
						objectHFov.setValue( object.hFOV );
						
					}

				}

	            if (object.near !== undefined && Math.abs((object.near * editor.commonMeasurements.targetConversionFactor) - objectNear.getValue()) >= 0.01) { //Edited to convert to target conversion factor

					editor.execute(new SetValueCommand(object, 'near', objectNear.getValue() / editor.commonMeasurements.targetConversionFactor )); //Edited to convert to target conversion factor
					if( object.isPerspectiveCamera == true && object.camCategory != undefined && object.camCategory == "Panorama" ){
						if(simulationManager.panoramaObject[ object.uuid ] != undefined ){
							var panoramaObject = simulationManager.panoramaObject[ object.uuid ];
							panoramaObject.setNearFar ( objectNear.getValue() / editor.commonMeasurements.targetConversionFactor , undefined ); //Edited to convert to target conversion factor
						}
					
					}
					//Modified to update the simulation additional controls when the camera parameters are changed
					editor.signals.updateSimulationControls.dispatch( object );

	            }

	            if (object.far !== undefined && Math.abs((object.far * editor.commonMeasurements.targetConversionFactor) - objectFar.getValue()) >= 0.01) { //Edited to convert to target conversion factor

					/*if( object.distance> objectFar.getValue() ){
						toastr.warning("Far must not be less than object distance");
						objectFar.value = object.far;

					}
					else{*/	
						editor.execute(new SetValueCommand(object, 'far', objectFar.getValue() / editor.commonMeasurements.targetConversionFactor )); //Edited to convert to target conversion factor
						if( object.isPerspectiveCamera == true && object.camCategory != undefined && object.camCategory == "Panorama" ){

						if(simulationManager.panoramaObject[ object.uuid ] != undefined ){

							var panoramaObject = simulationManager.panoramaObject[ object.uuid ];
							panoramaObject.setNearFar ( undefined, objectFar.getValue() / editor.commonMeasurements.targetConversionFactor  ); //Edited to convert to target conversion factor
						}
						object.traverse( function( child ){

							if( child.name == "PanoramaFrustum" ){

								editor.execute( new SetGeometryCommand( child, new THREE.CylinderGeometry( objectFar.getValue() / editor.commonMeasurements.targetConversionFactor  , objectFar.getValue() / editor.commonMeasurements.targetConversionFactor  , 2, 18
								) ) ); //Edited to convert to target conversion factor
							}
						} );
					}
					//Modified to update the simulation additional controls when the camera parameters are changed
					editor.signals.updateSimulationControls.dispatch( object );

					//}

	            }

	            if (object.intensity !== undefined && Math.abs(object.intensity - objectIntensity.getValue()) >= 0.01) {

	                editor.execute(new SetValueCommand(object, 'intensity', objectIntensity.getValue()));

	            }

	            if (object.color !== undefined && object.color.getHex() !== objectColor.getHexValue()) {

	                editor.execute(new SetColorCommand(object, 'color', objectColor.getHexValue()));

	            }

	            if (object.groundColor !== undefined && object.groundColor.getHex() !== objectGroundColor.getHexValue()) {

	                editor.execute(new SetColorCommand(object, 'groundColor', objectGroundColor.getHexValue()));

	            }

	            if (object.angle !== undefined && Math.abs(object.angle - objectAngle.getValue()) >= 0.01) {

	                editor.execute(new SetValueCommand(object, 'angle', objectAngle.getValue()));

	            }

	            if (object.penumbra !== undefined && Math.abs(object.penumbra - objectPenumbra.getValue()) >= 0.01) {

	                editor.execute(new SetValueCommand(object, 'penumbra', objectPenumbra.getValue()));

	            }

	            if (object.decay !== undefined && Math.abs(object.decay - objectDecay.getValue()) >= 0.01) {

	                editor.execute(new SetValueCommand(object, 'decay', objectDecay.getValue()));

	            }

	            if (object.visible !== objectVisible.getValue()) {

	                editor.execute(new SetValueCommand(object, 'visible', objectVisible.getValue()));

	            }

	            if (object.castShadow !== undefined && object.castShadow !== objectCastShadow.getValue()) {

	                editor.execute(new SetValueCommand(object, 'castShadow', objectCastShadow.getValue()));

	            }

	            if (object.receiveShadow !== undefined && object.receiveShadow !== objectReceiveShadow.getValue()) {

	                editor.execute(new SetValueCommand(object, 'receiveShadow', objectReceiveShadow.getValue()));
	                object.material.needsUpdate = true;

	            }

	            if (object.shadow !== undefined) {

	                if (object.shadow.radius !== objectShadowRadius.getValue()) {

	                    editor.execute(new SetValueCommand(object.shadow, 'radius', objectShadowRadius.getValue()));

	                }

	            }

	            /*MODIFIED TO INCLUDE CAMERA FRUSTUM UPDATIONS START*/
	            /*if (object.children[1] != undefined) {

	                if (object.children[1].name == 'CameraFrustum') {

	                    object.children[1].geometry.updateFromCamera(object);
	                    editor.signals.sceneGraphChanged.dispatch();
	                }

				}*/
				if (object != undefined) {

                    object.traverse( function( child ) {

                        if( child.name === "CameraFrustum" ) {

							child.geometry.updateFromCamera(object);
							editor.signals.sceneGraphChanged.dispatch();

                        }

                    } ) 

                }
	            /*MODIFIED TO INCLUDE CAMERA FRUSTUM UPDATIONS END*/

	            try {

	                /*MODIFIED TO INCLUDE CAMERA LOCATION FIELD START*/
	                //var userData = JSON.parse( objectUserData.getValue() );
	                if (Object.keys(objectUserData).length != 0) {

	                    var userData = JSON.parse(objectUserData);
	                    if (JSON.stringify(object.userData) != JSON.stringify(userData)) {

	                        // editor.execute(new SetValueCommand(object, 'userData', userData));

	                    }

	                }
	                /*MODIFIED TO INCLUDE CAMERA LOCATION FIELD END*/

	            } catch (exception) {

	                console.warn(exception);

	            }

	        }

	    }

	    function updateRows(object) {

	        var properties = {
				//'fov': objectFovRow,
				'hFOV' : objectHFovRow,
	            'near': objectNearRow,
	            'far': objectFarRow,
	            'intensity': objectIntensityRow,
	            'color': objectColorRow,
	            'groundColor': objectGroundColorRow,
	            'angle': objectAngleRow,
	            'penumbra': objectPenumbraRow,
	            'decay': objectDecayRow,
	            'castShadow': objectShadowRow,
	            'receiveShadow': objectReceiveShadow,
	            'shadow': objectShadowRadius
	        };

	        for (var property in properties) {

	            properties[property].setDisplay(object[property] !== undefined ? '' : 'none');

	        }

	    }

	    function updateTransformRows(object) {

	        if (object instanceof THREE.Light ||
	            (object instanceof THREE.Object3D && object.userData.targetInverse)) {

	            objectRotationRow.setDisplay('none');
	            objectScaleRow.setDisplay('none');

	        } else {

	            objectRotationRow.setDisplay('');
	            objectScaleRow.setDisplay('');

	        }

	        if (object instanceof THREE.PerspectiveCamera) {
				
				if( sensorsTypes.includes( object.camCategory ) ){
					CameraBrand.setOptions(sensorBrands);
				} else{
					CameraBrand.setOptions(camBrands);
				}
	            outerBorder.setDisplay('');
				helperColorRow.setDisplay('');
				camOffsetRow.setDisplay('');
				
				//Mounting offset calculations START
				if (object.mountingOffset == undefined){

					camOffsetX.setValue( '0.0' );
					camOffsetY.setValue( '0.0' );
					camOffsetZ.setValue( '0.0' );

				}
				else{

					camOffsetX.setValue( object.mountingOffset.x * editor.commonMeasurements.targetConversionFactor);
					camOffsetY.setValue( object.mountingOffset.y * editor.commonMeasurements.targetConversionFactor);
					camOffsetZ.setValue( object.mountingOffset.z * editor.commonMeasurements.targetConversionFactor);

				}
				//Mounting offset calculations END
				
	            if (object.helperColor != undefined) helperColor.setHexValue(object.helperColor);
	            if (cameraUserData.getValue() == '') {
	                cameraUserData.setValue('Not Specified');
	            }
	            if (CameraBrand.getValue() == '') {
	                CameraBrand.setValue('ACTi');
	            }
	            if (camModelSelector.getValue() == '') {
	                camModelSelector.setValue('ACM-1431');
				}
				if( object.camCategory && object.camCategory === "LiDAR" && object.sensorCategory === "Hitachi LFOM5" ){
				
					CameraBrand.setDisabled( true );
					camModelSelector.setDisabled( true );
					domeCameraRotationRow.setStyle( 'display',['block'] );//Changed to enable alignment feature for LiDAR sensor
		
				} else if( object.camCategory && editor.selected.userData.threeDModelType != undefined && editor.selected.userData.threeDModelType == "Dome") {

					domeCameraRotationRow.setStyle( 'display',['block'] );
					if( object.alignment && object.alignment!= null && object.alignment!= undefined ) {

						var alignment = object.alignment + '-wall';
						rotationType.setValue(alignment);

					}

				}
				else{

					CameraBrand.setDisabled( false );
					camModelSelector.setDisabled( false );
					domeCameraRotationRow.setStyle( 'display',['none'] );

				}


			}
			else{

	            outerBorder.setDisplay('none');
				helperColorRow.setDisplay('none');
				camOffsetRow.setDisplay('none');

			}

			//Modified for Smart Sensors Start

			if( object instanceof THREE.Group && object.userData && object.userData.sensorData ){

				sensorOuterBorder.setDisplay( '' );

			} else{

				sensorOuterBorder.setDisplay( 'none' );

			}

			//Modified for Smart Sensors End
			
			//Modified for NW cable label start
			if( object.name === "NetworkingCable" ){

				cableLabelRow.setDisplay( '' );
				if( editor.scene.userData.cableDatas && editor.scene.userData.cableDatas[ object.uuid ] && editor.scene.userData.cableDatas[ object.uuid ].label ){

					cableLabel.setValue( editor.scene.userData.cableDatas[ object.uuid ].label );

				}
				objectNameRow.setDisplay( 'none' );

			}
			else{

				cableLabelRow.setDisplay( 'none' );
				objectNameRow.setDisplay( '' );

				cableLabel.setValue( '' );

			}
			//Modified for NW cable label end

			if( object.name === "2DMeasurement" ){

				twoDLabelRow.setDisplay( '' );
				if( object.userData.lineLabel ){

					TwoDLabel.setValue( object.userData.lineLabel );

				}
				objectNameRow.setDisplay( 'none' );

			}
			else{

				twoDLabelRow.setDisplay( 'none' );
				objectNameRow.setDisplay( '' );

				TwoDLabel.setValue( '' );

			}

	    }

	    // events
	    signals.referranceSignal.add(function(object, point, mesh) {

			editor.select( object );
			var threeDModelType = ( object.userData.threeDModelType != undefined )? object.userData.threeDModelType : object.camCategory;
			var alignment = ( object.userData.alignment != undefined )? object.userData.alignment : "top";
			var tiltRotationValue = ( object.userData.tiltRotationValue != undefined )? object.userData.tiltRotationValue : 0;
			var panRotationValue = ( object.userData.panRotationValue != undefined )? object.userData.panRotationValue : 0;
			var rollRotationValue = ( object.userData.rollRotationValue != undefined )? object.userData.rollRotationValue : 0;
			var flipped = ( object.userData.flipped != undefined )? object.userData.flipped : 'un-flipped';
			userData = { "location": cameraUserData.getValue(), "cameraBrand": CameraBrand.getValue(), "cameraModel": camModelSelector.getValue(), "objectUuid": mesh, "reference": point };
			userData.threeDModelType = threeDModelType;
			userData.alignment = alignment;
			userData.tiltRotationValue = tiltRotationValue;
			userData.panRotationValue = panRotationValue;
			userData.rollRotationValue = rollRotationValue;
			if( object.camCategory && object.camCategory == "LiDAR" ){
				userData.flipped = flipped;
			}
			editor.execute(new SetValueCommand(object, 'userData', userData));
			
			//Modified for activity logging start
			try{

				//Modified for activity logging start
				var logDatas = {};
				logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Reference point added for camera "  + object.name + ", position : " + JSON.stringify( point );
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

	    signals.cameraAdded.add(function(data) {

			camImgPreivew.setStyle( ['background-image'],['url('+editor.selected.iconUrl+')'] ).setStyle( ['background-repeat'], ['no-repeat'] );
			camImgPreivew.setStyle( ['background-size'], ['contain'] );
			camImgPreivew.setStyle( ['height'], ['100%'] );
			camImgPreivew.setStyle( ['background-position'], ['center'] );
			
			if( data.threeDModelType != undefined ){

				var camera = editor.selected;
				
				if( data.threeDModelType === "LiDAR" && camera.sensorCategory === "Hitachi LFOM5" ){
				
					userData = { "location": "Not Specified", "cameraBrand": data.brand, "cameraModel": data.model, "objectUuid": "notset", "reference": new THREE.Vector3(0, 0, 0), "threeDModelType": data.threeDModelType, "alignment" : data.alignment, "tiltRotationValue": data.tiltRotationValue, "panRotationValue": data.panRotationValue, "rollRotationValue": data.rollRotationValue, "flipped": "un-flipped" }

					editor.rotateLiDAR( camera );
	
		
				
				} 
				else if( data.threeDModelType === "Dome"){
					
					userData = { "location": "Not Specified", "cameraBrand": data.brand, "cameraModel": data.model, "objectUuid": "notset", "reference": new THREE.Vector3(0, 0, 0), "threeDModelType": data.threeDModelType, "alignment" : data.alignment, "tiltRotationValue": data.tiltRotationValue, "panRotationValue": data.panRotationValue, "rollRotationValue": data.rollRotationValue }

					editor.rotateDomeCam( camera )
						
				}
				else if( data.threeDModelType === "PTZ"){					

					userData = { "location": "Not Specified", "cameraBrand": data.brand, "cameraModel": data.model, "objectUuid": "notset", "reference": new THREE.Vector3(0, 0, 0), "threeDModelType": data.threeDModelType, "alignment" : data.alignment, "tiltRotationValue": data.tiltRotationValue, "panRotationValue": data.panRotationValue, "rollRotationValue": data.rollRotationValue }
					
					editor.rotatePTZCam( camera );

				}
				 else {

					userData = { "location": "Not Specified", "cameraBrand": data.brand, "cameraModel": data.model, "objectUuid": "notset", "reference": new THREE.Vector3(0, 0, 0), "threeDModelType": data.threeDModelType, "alignment" : data.alignment, "tiltRotationValue": data.tiltRotationValue, "panRotationValue": data.panRotationValue, "rollRotationValue": data.rollRotationValue }
				}
				
			}
			else{
				userData = { "location": "Not Specified", "cameraBrand": data.brand, "cameraModel": data.model, "objectUuid": "notset", "reference": new THREE.Vector3(0, 0, 0) }
			}
		
	        editor.execute(new SetValueCommand(editor.selected, 'userData', userData));
	        CameraBrand.setValue(data.brand);
			camModelSelector.setValue(data.model);
			
			if( editor.selected instanceof THREE.PerspectiveCamera && ( editor.selected.camCategory === "Dome" || editor.selected.camCategory === "LiDAR" ) ){

				var alignment = editor.selected.userData.alignment;

				if( alignment == "left" ){
					rotationType.setValue( "left-wall" );
				}
				else if( alignment == "right" ){
					rotationType.setValue( "right-wall" );
				}
				else if( alignment == "top" ){
					rotationType.setValue( "top-wall" );
				}
				else if( alignment == "front" ){
					rotationType.setValue( "front-wall" );
				}
				else if( alignment == "back" ){
					rotationType.setValue( "back-wall" );
				}
				 
			}

	    });
	    signals.newCameraSpec.add(function() {
	    		chnagesfiles =true;
	    		getAllCameraDetails();
 
		});
	    signals.objectSelected.add(function(object) {
			selectedType = 'objectselected';
			
	        if (object !== null) {

				var badgeColorRow = document.querySelector("#badge-color-row");
				var pointOfInterestColorRow = document.querySelector("#pointofinterest-color-row");
				if( badgeColorRow && badgeColorRow!= undefined ){

					if( object instanceof THREE.Line && object.name === '2DMeasurement'  ){
						badgeColorRow.style.display = 'block';
					} else {
						badgeColorRow.style.display = 'none';
					}
				}

				if( pointOfInterestColorRow && pointOfInterestColorRow!=undefined){

					if(object instanceof THREE.Sprite && (/^Point Of Interest [1-9]+[0-9]*/g).test(object.name )) {
						pointOfInterestColorRow.style.display = 'block';
						document.querySelector( "#pointofinterest-color-value" ).value = object.userData.pointData.BadgeColor;
					} else {
						pointOfInterestColorRow.style.display = 'none';
					}
				}	
				
				if( object instanceof THREE.PerspectiveCamera ) {

					// if( object.sensorCategory ){

					// 	CameraBrand.setValue( object.userData.cameraBrand );
					// 	camModelSelector.setValue( object.userData.cameraModel )

					// }

					camImgPreivew.setStyle( ['background-image'],['url('+editor.selected.iconUrl+')'] ).setStyle( ['background-repeat'], ['no-repeat'] );
					camImgPreivew.setStyle( ['background-size'], ['contain'] );
					camImgPreivew.setStyle( ['height'], ['100%'] );
					camImgPreivew.setStyle( ['background-position'], ['center'] );
				}

				if( object instanceof THREE.Group && object.userData && object.userData.sensorData ){

					var sensorData = editor.selected.userData.sensorData
					sensorImgPreivew.setStyle( ['background-image'],['url('+sensorData.imageUrl+')'] ).setStyle( ['background-repeat'], ['no-repeat'] )
					sensorImgPreivew.setStyle( ['background-size'], ['contain'] );
					sensorImgPreivew.setStyle( ['height'], ['100%'] );
					sensorImgPreivew.setStyle( ['background-position'], ['center'] );
					sensorBrandInput.setValue( sensorData.brandName );
					sensorModelInput.setValue( sensorData.modelName );
					sensorCategoryInput.setValue( sensorData.category );
					sensorSubCategoryInput.setValue( sensorData.subCategory );
					sensorFrustumSelect.setValue( sensorData.frustum );
					if( sensorData.frustum === "Spherical Frustum" ){
						sphereTypeRow.setStyle( 'display', ['block'] )
						sphereTypeSelect.setValue( sensorData.sphereType )
					}


				}
				
				if( object instanceof THREE.PerspectiveCamera && ( object.camCategory === "Dome" || object.camCategory === "LiDAR" ) ){

					var alignment = object.userData.alignment;

					if( alignment == "left" ){
						rotationType.setValue( "left-wall" );
					}
					else if( alignment == "right" ){
						rotationType.setValue( "right-wall" );
					}
					else if( alignment == "top" ){
						rotationType.setValue( "top-wall" );
					}
					else if( alignment == "front" ){
						rotationType.setValue( "front-wall" );
					}
					else if( alignment == "back" ){
						rotationType.setValue( "back-wall" );
					}
					  
				}
				
	            container.setDisplay('block');
	            objectPositionZ.setStyle('background-color', ['transparent']);
	            objectPositionX.setStyle('background-color', ['transparent']);
	            objectPositionY.setStyle('background-color', ['transparent']);
				updateRows(object);
	            //selectedType =='objectselected';
				updateUI(object);
				//editor.rotationControls.updateUI();
	            editor.objectSelectedTimeOut();

	        } else {

	            container.setDisplay('none');

			}

			editor.rotationControls.updateUI();
			editor.translationControls.updateUI();

	    });

	    signals.objectChanged.add(function(object) {
	        selectedType = '';
			if (object !== editor.selected) return;
			updateUI(object);
			/*
	        if (object.camerauuid != undefined) {
				//toastr.info(editor.languageData.ClickonUpdateinCameraDetailsThenonlythispositonistakenasreferece)

			} */
			editor.objectSelectedTimeOut();
			//Modified to update the rotation controls UI when this signal is dispatched
			editor.rotationControls.updateUI();
			editor.translationControls.updateUI();

	    });

	    signals.refreshSidebarObject3D.add(function(object) {
	        selectedType = '';
	        if (object !== editor.selected) return;
			updateUI(object);
			oExplorer.refreshList( editor.scene );
			oExplorer.highlightItem( editor.selected, false );

		});
		//Edited to convert to target conversion factor START
		signals.reConfigurePreviousMeasurements.add( function(){
			var unitLabel = document.getElementById( 'sidebar-targetunit' );
			unitLabel.innerHTML = editor.commonMeasurements.targetUnit;
			if( editor.selected != null )
			updateUI( editor.selected );
		} );

		signals.projectDataLoaded.add( function () {

			var unitLabel = document.getElementById( 'sidebar-targetunit' );
			if( unitLabel ){
				unitLabel.innerHTML = editor.commonMeasurements.targetUnit;
			}

			//Modified to place the center of Reference point at (0.5,0) 
			editor.scene.traverse( function( child ){

				if( ( child instanceof THREE.Sprite ) && ( child.userData.checkLOSFlag ) ){

					child.center.copy( new THREE.Vector2( 0.5,0 ) );

				}


			} );
		} );

		signals.editorCleared.add( function(){
			var unitLabel = document.getElementById( 'sidebar-targetunit' );
			unitLabel.innerHTML = editor.commonMeasurements.targetUnit;
		} );
		//Edited to convert to target conversion factor END
	    function changeBackgroundColourX(object) {

	        object.setStyle('background-color', ['red']);

	    }

	    function changeBackgroundColourY(object) {
	        object.setStyle('background-color', ['lightgreen']);
	    }

	    function changeBackgroundColourZ(object) {
	        object.setStyle('background-color', ['lightblue']);
	    }

	    function updateUI(object) {

	        objectType.setValue(object.type);
			objectUUID.setValue(object.uuid);
			object.name = object.name.replace(/&nbsp;/g," ");			
	        objectName.setValue(object.name);
	        if (selectedType != 'objectselected') {

	            previousXposition = objectPositionX.getValue();
	            previousYposition = objectPositionY.getValue();
	            previousZposition = objectPositionZ.getValue();

	            objectPositionX.setValue( object.position.x * editor.commonMeasurements.targetConversionFactor ); //Edited to convert to target conversion factor
	            objectPositionY.setValue(object.position.y * editor.commonMeasurements.targetConversionFactor ); //Edited to convert to target conversion factor
	            objectPositionZ.setValue(object.position.z * editor.commonMeasurements.targetConversionFactor ); //Edited to convert to target conversion factor

	            currentXposition = object.position.x;
	            currentYposition = object.position.y;
	            currentZposition = object.position.z;

	            if (previousXposition != currentXposition && previousZposition != currentZposition && previousYposition != currentYposition) {
	                changeBackgroundColourZ(objectPositionZ);
	                changeBackgroundColourX(objectPositionX);
	                changeBackgroundColourY(objectPositionY);
	            } else if (previousXposition != currentXposition && previousYposition != currentYposition) {
	                objectPositionZ.setStyle('background-color', ['transparent']);
	                changeBackgroundColourX(objectPositionX);
	                changeBackgroundColourY(objectPositionY);
	            } else if (previousYposition != currentYposition && previousZposition != currentZposition) {
	                objectPositionX.setStyle('background-color', ['transparent']);
	                changeBackgroundColourZ(objectPositionZ);
	                changeBackgroundColourY(objectPositionY);
	            } else if (previousXposition != currentXposition && previousZposition != currentZposition) {
	                objectPositionY.setStyle('background-color', ['transparent']);
	                changeBackgroundColourX(objectPositionX);
	                changeBackgroundColourZ(objectPositionZ);
	            } else if (previousYposition != currentYposition) {

	                objectPositionZ.setStyle('background-color', ['transparent']);
	                objectPositionX.setStyle('background-color', ['transparent']);
	                changeBackgroundColourY(objectPositionY);
	            } else if (previousZposition != currentZposition) {
	                objectPositionX.setStyle('background-color', ['transparent']);
	                objectPositionY.setStyle('background-color', ['transparent']);
	                changeBackgroundColourZ(objectPositionZ);
	            } else if (previousXposition != currentXposition) {
	                objectPositionZ.setStyle('background-color', ['transparent']);
	                objectPositionY.setStyle('background-color', ['transparent']);
	                changeBackgroundColourX(objectPositionX);
	            }
	        } else {
 
	            objectPositionX.setValue(object.position.x * editor.commonMeasurements.targetConversionFactor); //Edited to convert to target conversion factor
	            objectPositionY.setValue(object.position.y * editor.commonMeasurements.targetConversionFactor); //Edited to convert to target conversion factor
	            objectPositionZ.setValue(object.position.z * editor.commonMeasurements.targetConversionFactor); //Edited to convert to target conversion factor
	        }
	        objectRotationX.setValue(object.rotation.x * THREE.Math.RAD2DEG);
	        objectRotationY.setValue(object.rotation.y * THREE.Math.RAD2DEG);
	        objectRotationZ.setValue(object.rotation.z * THREE.Math.RAD2DEG);

	        objectScaleX.setValue(object.scale.x);
	        objectScaleY.setValue(object.scale.y);
	        objectScaleZ.setValue(object.scale.z);

	        /*if (object.fov !== undefined) {

				if(object.camCategory == 'Fisheye' || object.camCategory == "Panorama"){
					objectFovRow.dom.style.display = "none";
				}
				else{
					objectFovRow.dom.style.display = "block";
				}						
	            objectFov.setValue(object.fov);

			}*/

			// hfov
			
			if (object.hFOV !== undefined) {

				if(object.camCategory == 'Fisheye' || object.camCategory == "Panorama"){
					objectHFovRow.dom.style.display = "none";
				}
				else if( object.minHorizontalAOV == undefined ){
					objectHFovRow.dom.disabled = true;
				}
				else{
					objectHFovRow.dom.disabled = false;
					objectHFovRow.dom.style.display = "block";
				}						
	            objectHFov.setValue(object.hFOV);

	        }

	        if (object.near !== undefined) {

	            objectNear.setValue(object.near * editor.commonMeasurements.targetConversionFactor ); //Edited to convert to target conversion factor

	        }

	        if (object.far !== undefined) {

	            objectFar.setValue(object.far * editor.commonMeasurements.targetConversionFactor ); //Edited to convert to target conversion factor

	        }

	        if (object.intensity !== undefined) {

	            objectIntensity.setValue(object.intensity);

	        }

	        if (object.color !== undefined) {

	            objectColor.setHexValue(object.color.getHexString());

	        }

	        if (object.groundColor !== undefined) {

	            objectGroundColor.setHexValue(object.groundColor.getHexString());

	        }

	        if (object.angle !== undefined) {

	            objectAngle.setValue(object.angle);

	        }

	        if (object.penumbra !== undefined) {

	            objectPenumbra.setValue(object.penumbra);

	        }

	        if (object.decay !== undefined) {

	            objectDecay.setValue(object.decay);

	        }

	        if (object.castShadow !== undefined) {

	            objectCastShadow.setValue(object.castShadow);

	        }

	        if (object.receiveShadow !== undefined) {

	            objectReceiveShadow.setValue(object.receiveShadow);

	        }

	        if (object.shadow !== undefined) {

	            objectShadowRadius.setValue(object.shadow.radius);

	        }

	        objectVisible.setValue(object.visible);

	        try {

	            /*MODIFIED TO INCLUDE CAMERA LOCATION FIELD START*/
	            //objectUserData.setValue( JSON.stringify( object.userData, null, '  ' ) );
				if (Object.keys(object.userData).length != 0) {

					camImgPreivew.setStyle( ['background-image'],['url('+editor.selected.iconUrl+')'] );
					if( sensorsTypes.includes( object.camCategory ) ){
						CameraBrand.setOptions( sensorBrands )
					} else{
						CameraBrand.setOptions( camBrands )
					}
	                CameraBrand.setValue(object.userData.cameraBrand);
	                updateCamBrandModel();
	                cameraUserData.setValue(object.userData.location);
					camModelSelector.setValue(object.userData.cameraModel);
	                editor.scene.traverse(function(child) {

	                    if (child.uuid === object.userData.objectUuid) {
							
	                        ReferenceX.setValue(child.position.x * editor.commonMeasurements.targetConversionFactor );//Edited to convert to target conversion factor
	                        ReferenceY.setValue(child.position.y * editor.commonMeasurements.targetConversionFactor );//Edited to convert to target conversion factor
							ReferenceZ.setValue(child.position.z * editor.commonMeasurements.targetConversionFactor );//Edited to convert to target conversion factor
							cameraReferenceX.setValue((object.position.x - child.position.x) * editor.commonMeasurements.targetConversionFactor );//Edited to convert to target conversion factor
							cameraReferenceY.setValue((object.position.y - child.position.y) * editor.commonMeasurements.targetConversionFactor );//Edited to convert to target conversion factor
							cameraReferenceZ.setValue((object.position.z - child.position.z) * editor.commonMeasurements.targetConversionFactor );//Edited to convert to target conversion factor

	                    }
	                    if (object.userData.objectUuid === "notset") {
	                        ReferenceX.setValue(object.userData.reference.x * editor.commonMeasurements.targetConversionFactor );//Edited to convert to target conversion factor
	                        ReferenceY.setValue(object.userData.reference.y * editor.commonMeasurements.targetConversionFactor );//Edited to convert to target conversion factor
							ReferenceZ.setValue(object.userData.reference.z * editor.commonMeasurements.targetConversionFactor );//Edited to convert to target conversion factor
							cameraReferenceX.setValue(object.position.x * editor.commonMeasurements.targetConversionFactor );//Edited to convert to target conversion factor
							cameraReferenceY.setValue(object.position.y  * editor.commonMeasurements.targetConversionFactor );//Edited to convert to target conversion factor
							cameraReferenceZ.setValue(object.position.z * editor.commonMeasurements.targetConversionFactor );//Edited to convert to target conversion factor
	                    }
	                });


				}
				
				if( object instanceof THREE.PerspectiveCamera ){

					if( object.mountingOffset != undefined ){
						camOffsetX.setValue( object.mountingOffset.x );
						camOffsetY.setValue( object.mountingOffset.y );
						camOffsetZ.setValue( object.mountingOffset.z );
					}
					else{
						camOffsetX.setValue( 0.0 );
						camOffsetY.setValue( 0.0 );
						camOffsetZ.setValue( 0.0 );
					}

				}
	            /*MODIFIED TO INCLUDE CAMERA LOCATION FIELD END*/

	        } catch (error) {

	            console.log(error);

	        }

	        /*MODIFIED TO INCLUDE CAMERA LOCATION FIELD START*/
	        //objectUserData.setBorderColor( 'transparent' );
	        //objectUserData.setBackgroundColor( '' );
	        /*MODIFIED TO INCLUDE CAMERA LOCATION FIELD END*/

	        updateTransformRows(object);

		}
		
		function processRefCamLineEndPoints( line, refPos, camPos, badgeLabelText ){

			//line.geometry.vertices[0].copy( refPos );
			//line.geometry.vertices[1].copy( camPos );
			//line.geometry.verticesNeedUpdate = true;

			//Modified to change line attributes for buffer geometry start
			if( ( refPos instanceof THREE.Vector3 ) && ( camPos instanceof THREE.Vector3 ) ){
            
				line.geometry.dispose();
				var newArray = new Float32Array( [refPos.x, refPos.y, refPos.z, camPos.x, camPos.y, camPos.z] );
				line.geometry.attributes.position.setArray( newArray );
				line.geometry.attributes.position.needsUpdate = true;
	
			} else{
	
				console.warn( "%csetEndPoints( start, end ) : \'start\' and \'end\' should be instance of THREE.Vector3", "color: yellow; font-style: italic; background-color: blue; padding: 2px" );
				return;
	
			}
			
			//Modified to change line attributes for buffer geometry end

			var badgeTexture = editor.commonMeasurements.getNumberBadge( { badgeText : badgeLabelText, badgeWidth : 105, badgeHeight : 35, fontSize : "16px", fontColor : "#0f590b", strokeColor : "#0f590b", borderRadius : 8, type : "image" } );
    
			var midPoint = new THREE.Vector3( ( refPos.x + camPos.x )/2, ( refPos.y + camPos.y )/2, ( refPos.z + camPos.z )/2  );
			
			line.traverse( function( child ){

				if( child instanceof THREE.Sprite && child.name === "RefCamLineValueBadge" ){

					child.material.map = badgeTexture;
					child.position.copy( midPoint );

				}

			} );

        return line;

    }

	    return container;

	};