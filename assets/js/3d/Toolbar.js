/**
 * @author mrdoob / http://mrdoob.com/
 */

var Toolbar = function ( editor ) {

	this.commonControls = new CommonControls( { camera : editor.camera, baseUnit : "meter", baseConversionFactor : 1 }, editor );
	var scope = this;

	var signals = editor.signals;

	//Contains value of meter to feet conversion
	const METERTOFEET = 3.28084;
	const GRID_DIVISION = 196;

	var container = new UI.Panel();
	container.setId( 'toolbar' );

	var buttons = new UI.Panel();
	container.add( buttons );

	// translate / rotate / scale

	var translate = new UI.Button( editor.languageData.translate );
	translate.dom.title = 'W';
	translate.setId( 'toolbar-translate' );
	translate.dom.className = 'Button selected';
	translate.onClick( function () {

		signals.transformModeChanged.dispatch( 'translate' );
		editor.rotationControls.hide();
		editor.translationControls.show();

	} );
	buttons.add( translate );

	var rotate = new UI.Button( editor.languageData.rotate );
	rotate.dom.title = 'E';
	rotate.setId('toolbar-rotate');
	rotate.onClick( function () {

		if( editor.theatreMode == true ) {

			toastr.info( editor.languageData.DefaultRotationControlsisDisabledinTheatreMode );
			return;

		}

		//signals.transformModeChanged.dispatch( 'rotate' );
		//Replaced default rotation controls with new RotationControls
		editor.translationControls.hide();
		editor.rotationControls.show();
		editor.rotationControls.bringToFront();
		translate.dom.classList.remove( 'selected' );
		rotate.dom.classList.remove( 'selected' );
		scale.dom.classList.remove( 'selected' );
		rotate.dom.classList.add( 'selected' );

	} );
	buttons.add( rotate );

	var scale = new UI.Button( editor.languageData.scale );
	scale.dom.title = 'R';
	scale.setId( 'toolbar-scale' );
	scale.onClick( function () {

		signals.transformModeChanged.dispatch( 'scale' );
		editor.rotationControls.hide();
		editor.translationControls.hide();

	} );
	buttons.add( scale );
	/*
	editor.signals.measurementConfigurationChanged.add( function( baseUnit, convFactor, targetUnit ){

		editor.commonMeasurements.setBaseUnit( baseUnit, convFactor );
		editor.commonMeasurements.setTargetUnit( targetUnit );

	} ); */

	signals.transformModeChanged.add( function ( mode ) {

		translate.dom.classList.remove( 'selected' );
		rotate.dom.classList.remove( 'selected' );
		scale.dom.classList.remove( 'selected' );

		switch ( mode ) {

			case 'translate': translate.dom.classList.add( 'selected' ); break;
			case 'rotate': rotate.dom.classList.add( 'selected' ); break;
			case 'scale': scale.dom.classList.add( 'selected' ); break;

		}

	} );

	// grid

	var grid = new UI.Number( 25 ).setWidth( '40px' ).onChange( update );
	//buttons.add( new UI.Text( 'grid: ' ) );//Hiding option grid
	//buttons.add( grid );//Hiding option grid

	var snap = new UI.THREE.Boolean( false, 'snap' ).onChange( update );
	//buttons.add( snap );//Hiding option snap

	var local = new UI.THREE.Boolean( false, 'local' ).onChange( update );
	//buttons.add( local );//Hiding option local

	var showGrid = new UI.THREE.Boolean( true, editor.languageData.showGrid ).onChange( update );
	buttons.add( showGrid );

	//Modified to make grid size as scale ratios that multiplies the grid divisions start
	var gridSize = new UI.Number( 1 ).setRange( 1,5 ).setPrecision( 0 ).setWidth( '35px' ).setStep(1).onChange( changeGridParameters );
	gridSize.setId( 'change-grid-size' );
	buttons.add( new UI.Text( editor.languageData.GridScale ) );
	buttons.add( gridSize );
	//Modified to make grid size as scale ratios that multiplies the grid divisions end

	var gridUnit = new UI.Select( ).setOptions( {

		'meter': editor.languageData.meter,
		'feet': editor.languageData.feet

	} ).setWidth( '60px' ).setValue( 'feet' ).setFontSize( '12px' ).onChange( changeGridUnit );
	gridUnit.setId( 'change-grid-unit' );
	buttons.add( new UI.Text( editor.languageData.GridUnit ).setStyle( 'padding-right',['5px'] ) );
	buttons.add( gridUnit );

	//Modified to change grid size as scale parameters 
	function changeGridParameters(){

		toastr.clear();
		var gridScale = gridSize.getValue();
		var newSize, newDivisions, divisions, scaleDivision, individualDivision;

		if( editor.scene.userData.gridParameters && editor.scene.userData.gridParameters.gridDivision && editor.scene.userData.gridParameters.gridDivision != null && editor.scene.userData.gridParameters.gridDivision != undefined && editor.scene.userData.gridParameters.gridScale && editor.scene.userData.gridParameters.gridScale != null && editor.scene.userData.gridParameters.gridScale != undefined ){

			divisions = editor.scene.userData.gridParameters.gridDivision;
			scaleDivision = editor.scene.userData.gridParameters.gridScale;
			individualDivision = divisions/scaleDivision;

		} else{

			individualDivision = GRID_DIVISION;

		}

		newSize = gridScale * editor.gridOriginalDimension;
		newDivisions = Math.round( gridScale * individualDivision );
		if( newDivisions%2 != 0 ){

			newDivisions = newDivisions + 1;

		}

		editor.gridSize = newSize;
		editor.gridDivision = newDivisions;
		editor.gridScale = gridScale;
		editor.signals.gridParametersChanged.dispatch( newSize, newDivisions, gridScale );

		if( editor.scene.userData.gridParameters === undefined ){

			editor.scene.userData.gridParameters = {};

		}
		editor.scene.userData.gridParameters.gridSize = newSize;
		editor.scene.userData.gridParameters.gridDivision = newDivisions; 
		editor.scene.userData.gridParameters.gridScale = gridScale;

	}

	function changeGridUnit(){

		var newSize = editor.gridSize;
		var newDivisions = editor.gridDivision;
		var newUnit = gridUnit.getValue();
		var baseunit = editor.commonMeasurements.baseUnit;
		editor.signals.gridUnitChanged.dispatch( newSize, newUnit, baseunit, true );

	}

	editor.signals.gridUnitChanged.add( function( newSize, targetUnit, baseUnit, configureMeasurement ){

		var unitDivisions;
		var gridScale = editor.gridScale

		if( targetUnit === baseUnit ){

			unitDivisions = Math.round( gridScale * editor.gridOriginalDimension );
			if( unitDivisions%2 != 0 ){

				unitDivisions = unitDivisions + 1;

			}
			editor.gridDivision = unitDivisions;
            editor.gridUnit = targetUnit;
			editor.signals.gridParametersChanged.dispatch( newSize, unitDivisions, gridScale );

		} else if( targetUnit === 'meter' && baseUnit === 'feet' ){

			unitDivisions = Math.round( ( gridScale * GRID_DIVISION ) / ( METERTOFEET * METERTOFEET) );
			if( unitDivisions%2 != 0 ){

				unitDivisions = unitDivisions + 1;

			}
			editor.gridDivision = unitDivisions;
			editor.gridUnit = targetUnit;
			editor.signals.gridParametersChanged.dispatch( newSize, unitDivisions, gridScale );

		} else if( targetUnit === 'feet' && baseUnit === 'meter' ){

			unitDivisions = Math.round( gridScale * GRID_DIVISION );
			if( unitDivisions%2 != 0 ){

				unitDivisions = unitDivisions + 1;

			}
			editor.gridDivision = unitDivisions;
			editor.gridUnit = targetUnit;
			editor.signals.gridParametersChanged.dispatch( newSize, unitDivisions, gridScale );

		}

		if( editor.scene.userData.gridParameters === undefined ){

			editor.scene.userData.gridParameters = {};

		}
		
		editor.scene.userData.gridParameters.gridUnit = targetUnit; 

		if( configureMeasurement === false ){

			var gridUnit = document.querySelector( '#change-grid-unit' );
			gridUnit.value = targetUnit;

		}
		//editor.gridBaseUnit = baseUnit;

		if( configureMeasurement === true ){

			var convFactor = ( editor.scene.userData.measurementConfig != undefined )? editor.scene.userData.measurementConfig.baseConversionFactor : editor.lengthMeasurement.measurementControls.baseConversionFactor;

			var baseUnit = ( editor.scene.userData.measurementConfig != undefined )? editor.scene.userData.measurementConfig.baseUnit : editor.lengthMeasurement.measurementControls.baseUnit;

			editor.lengthMeasurement.measurementControls.setBaseUnit( baseUnit, convFactor );
        	editor.lengthMeasurement.measurementControls.setTargetUnit( targetUnit );
			toastr.success( editor.languageData.AppliedTargetUnitConfiguration );

			if( editor.scene.userData.measurementConfig === undefined ){

				editor.scene.userData.measurementConfig = {};

			}
			editor.scene.userData.measurementConfig.baseUnit = baseUnit;
			editor.scene.userData.measurementConfig.baseConversionFactor = convFactor;
			editor.scene.userData.measurementConfig.targetUnit = targetUnit;
		
			editor.signals.measurementConfigurationChanged.dispatch( baseUnit, convFactor, targetUnit  );

		}

	} );

	//Modified for changing grid and it's units end

	//Modified to change grid w.r.t the changed values on project load start

	editor.signals.projectDataLoaded.add( function(){

        if( editor.scene.userData.gridParameters != null && editor.scene.userData.gridParameters != undefined ){

            if( editor.scene.userData.gridParameters.gridUnit && editor.scene.userData.gridParameters.gridUnit != null && editor.scene.userData.gridParameters.gridUnit != undefined ){

                var newSize = editor.scene.userData.gridParameters.gridSize;
                var newDivisions = editor.scene.userData.gridParameters.gridDivision;
				var newUnit = editor.scene.userData.gridParameters.gridUnit; 
				var gridScale = editor.scene.userData.gridParameters.gridScale; 

                editor.gridUnit = newUnit;
                editor.gridSize = newSize;
				editor.gridDivision = newDivisions; 
				gridSize.setValue( gridScale );

                if( newUnit === 'feet' ){

                    editor.gridDivision = newDivisions;
					editor.gridUnit = 'feet';
					gridUnit.setValue( 'feet' );
                    editor.signals.gridParametersChanged.dispatch( newSize, newDivisions, gridScale ); 
        
                } else if( newUnit === 'meter' ){
                    
                    editor.gridDivision = newDivisions;
					editor.gridUnit = 'meter';
					gridUnit.setValue( 'meter' );
                    editor.signals.gridParametersChanged.dispatch( newSize, newDivisions, gridScale );
        
                } 

            } else if( editor.scene.userData.gridParameters.gridSize && editor.scene.userData.gridParameters.gridSize != null && editor.scene.userData.gridParameters.gridSize != undefined && editor.scene.userData.gridParameters.gridDivision && editor.scene.userData.gridParameters.gridDivision != null && editor.scene.userData.gridParameters.gridDivision != undefined && editor.scene.userData.gridParameters.gridScale && editor.scene.userData.gridParameters.gridScale != null && editor.scene.userData.gridParameters.gridScale != undefined ){

				editor.gridSize = editor.scene.userData.gridParameters.gridSize;
				editor.gridDivision = editor.scene.userData.gridParameters.gridDivision;
				var gridScale = editor.scene.userData.gridParameters.gridScale; 
				gridSize.setValue( gridScale );

				editor.signals.gridParametersChanged.dispatch( editor.gridSize, editor.gridDivision, gridScale );

			}

        }

	});

	//Modified to change grid w.r.t the changed values on project load end

	function update() {
		signals.snapChanged.dispatch( snap.getValue() === true ? grid.getValue() : null );
		signals.spaceChanged.dispatch( local.getValue() === true ? "local" : "world" );
		signals.showGridChanged.dispatch( showGrid.getValue() );

	}
	function changeBackgroundColourX(object) {
		object.setStyle('background-color',['red']);
		//setTimeout(function(){object.setStyle('background-color',['transparent']); }, 900);

	}
	function changeBackgroundColourY(object) {
		object.setStyle('background-color',['lightgreen']);
		//setTimeout(function(){object.setStyle('background-color',['transparent']); }, 900);

	}
	function changeBackgroundColourZ(object) {
		object.setStyle('background-color',['lightblue']);
		//setTimeout(function(){object.setStyle('background-color',['transparent']); }, 900);

	}
	function updateSelectedobject(object){

		objectPositionX.setValue( ( object.position.x * editor.commonMeasurements.targetConversionFactor ) );
		objectPositionY.setValue( ( object.position.y * editor.commonMeasurements.targetConversionFactor ) );
		objectPositionZ.setValue( ( object.position.z * editor.commonMeasurements.targetConversionFactor ) );

	}
	function updateToolbarposition(object){
		previousXposition = objectPositionX.getValue();
		previousYposition = objectPositionY.getValue();
		previousZposition = objectPositionZ.getValue();
		objectPositionX.setValue( object.position.x * editor.commonMeasurements.targetConversionFactor);
		objectPositionY.setValue( object.position.y * editor.commonMeasurements.targetConversionFactor );
		objectPositionZ.setValue( object.position.z * editor.commonMeasurements.targetConversionFactor );
		currentXposition = objectPositionX.getValue();
		currentYposition = objectPositionY.getValue();
		currentZposition = objectPositionZ.getValue(); 
		/*if(previousXposition !=currentXposition){

			changeBackgroundColourX(objectPositionX);
		}*/
		if(previousXposition !=currentXposition && previousZposition !=currentZposition && previousYposition !=currentYposition){
			changeBackgroundColourZ(objectPositionZ);
			changeBackgroundColourX(objectPositionX);
			changeBackgroundColourY(objectPositionY);
		}
		else if(previousXposition !=currentXposition && previousYposition !=currentYposition){
			objectPositionZ.setStyle('background-color',['transparent']);
			changeBackgroundColourX(objectPositionX);
			changeBackgroundColourY(objectPositionY);
		}
		else if(previousYposition !=currentYposition && previousZposition !=currentZposition){
			objectPositionX.setStyle('background-color',['transparent']);
			changeBackgroundColourZ(objectPositionZ);
			changeBackgroundColourY(objectPositionY);
		}
		else if(previousXposition !=currentXposition && previousZposition !=currentZposition){
			objectPositionY.setStyle('background-color',['transparent']);
			changeBackgroundColourX(objectPositionX);
			changeBackgroundColourZ(objectPositionZ);
		}
		else if(previousYposition !=currentYposition){

			objectPositionZ.setStyle('background-color',['transparent']);
			objectPositionX.setStyle('background-color',['transparent']);
			changeBackgroundColourY(objectPositionY);
		}

		else if(previousZposition !=currentZposition){
			objectPositionX.setStyle('background-color',['transparent']);
			objectPositionY.setStyle('background-color',['transparent']);
			changeBackgroundColourZ(objectPositionZ);
		}
		else if(previousXposition !=currentXposition){
			objectPositionZ.setStyle('background-color',['transparent']);
			objectPositionY.setStyle('background-color',['transparent']);
			changeBackgroundColourX(objectPositionX);
		}
	}
	function updateObjectPositionx() {
		
		var object = editor.selected;
		
		if ( object !== null ) {

			objectPositionX.setStyle('background-color',['red']);
			objectPositionZ.setStyle('background-color',['transparent']);
			objectPositionY.setStyle('background-color',['transparent']);
			//setTimeout(function(){objectPositionX.setStyle('background-color',['transparent']); }, 900);
			
			var newPosition = new THREE.Vector3( ( objectPositionX.getValue() / editor.commonMeasurements.targetConversionFactor ), ( objectPositionY.getValue() / editor.commonMeasurements.targetConversionFactor ),( objectPositionZ.getValue() / editor.commonMeasurements.targetConversionFactor) );
			
			if ( object.position.distanceTo( newPosition ) >= 0.01 ) {

				editor.execute( new SetPositionCommand( object, newPosition ) );

			}

		}
		else{

			objectPositionX.setValue('0.00');
		}

		if( ( object!= null && object!= undefined && object instanceof THREE.Sprite && object.userData.checkLOSFlag && object.userData.checkDetailsFlag ) && ( object.userData.checkLOSFlag === "set" || object.userData.checkDetailsFlag === "set" ) ){

			//updateReferencePoint( object );
			editor.signals.updateReferencePoint.dispatch( object );

		}
		else if( object!= null && object!= undefined && object instanceof THREE.PerspectiveCamera  && object.userData.objectUuid != "notset" && object.userData.lineUUID ){

			//updateCameraAndRefPoint( object );
			editor.signals.updateCameraAndRefPoint.dispatch( object );

		}

	}
	function updateObjectPositiony() {
		
		var object = editor.selected;
		
		if ( object !== null ) {
			
			objectPositionY.setStyle('background-color',['lightgreen']);
			objectPositionX.setStyle('background-color',['transparent']);
			objectPositionZ.setStyle('background-color',['transparent']);
			//setTimeout(function(){objectPositionY.setStyle('background-color',['transparent']); }, 1000);
			var newPosition = new THREE.Vector3( ( objectPositionX.getValue() / editor.commonMeasurements.targetConversionFactor ), ( objectPositionY.getValue() / editor.commonMeasurements.targetConversionFactor ), ( objectPositionZ.getValue() / editor.commonMeasurements.targetConversionFactor ) );
			if ( object.position.distanceTo( newPosition ) >= 0.01 ) {

				editor.execute( new SetPositionCommand( object, newPosition ) );

			}

		}
		else{

			objectPositionY.setValue('0.00');
		}

		if( ( object!= null && object!= undefined && object instanceof THREE.Sprite && object.userData.checkLOSFlag && object.userData.checkDetailsFlag ) && ( object.userData.checkLOSFlag === "set" || object.userData.checkDetailsFlag === "set" ) ){

			//updateReferencePoint( object );
			editor.signals.updateReferencePoint.dispatch( object );

		}
		else if( object!= null && object!= undefined && object instanceof THREE.PerspectiveCamera  && object.userData.objectUuid != "notset" && object.userData.lineUUID ){

			//updateCameraAndRefPoint( object );
			editor.signals.updateCameraAndRefPoint.dispatch( object );

		}

	}
	function updateObjectPositionz() {
		
		var object = editor.selected;
		
		if ( object !== null ) {
			
			objectPositionZ.setStyle('background-color',['lightblue']);
			objectPositionX.setStyle('background-color',['transparent']);
			objectPositionY.setStyle('background-color',['transparent']);
			//setTimeout(function(){objectPositionZ.setStyle('background-color',['transparent']); }, 1000);
			var newPosition = new THREE.Vector3( ( objectPositionX.getValue() / editor.commonMeasurements.targetConversionFactor ), ( objectPositionY.getValue() / editor.commonMeasurements.targetConversionFactor ), ( objectPositionZ.getValue() / editor.commonMeasurements.targetConversionFactor ) );
			if ( object.position.distanceTo( newPosition ) >= 0.01 ) {

				editor.execute( new SetPositionCommand( object, newPosition ) );

			}

		}
		else{

			objectPositionZ.setValue('0.00');
		}

		if( ( object!= null && object!= undefined && object instanceof THREE.Sprite && object.userData.checkLOSFlag && object.userData.checkDetailsFlag ) && ( object.userData.checkLOSFlag === "set" || object.userData.checkDetailsFlag === "set" ) ){

			//updateReferencePoint( object );
			editor.signals.updateReferencePoint.dispatch( object );

		}
		else if( object!= null && object!= undefined && object instanceof THREE.PerspectiveCamera  && object.userData.objectUuid != "notset" && object.userData.lineUUID ){

			//updateCameraAndRefPoint( object );
			editor.signals.updateCameraAndRefPoint.dispatch( object );

		}

	}
	// Object Position
	var previousXposition,previousYposition,previousZposition;
	var currentXposition,currentYposition,currentZposition;

	var objectPositionX = new UI.Number( 0 ).setWidth( '50px' ).onChange(updateObjectPositionx);
	objectPositionX.setId( 'ObjectPositionX' );
	//objectPositionX.setUnit('ft');
	buttons.add( new UI.Text( editor.languageData.ObjectPositionX ) );
	buttons.add( objectPositionX );

	var objectPositionY = new UI.Number( 0 ).setWidth( '50px' ).onChange(updateObjectPositiony);
	objectPositionY.setId( 'ObjectPositionY' );
	//objectPositionY.setUnit('ft');
	buttons.add( new UI.Text( "Y" ));
	buttons.add( objectPositionY );

	var objectPositionZ = new UI.Number( 0 ).setWidth( '50px' ).onChange(updateObjectPositionz);
	objectPositionZ.setId( 'ObjectPositionZ' );
	//objectPositionZ.setUnit('ft');
	buttons.add( new UI.Text( "Z" ) );
	buttons.add( objectPositionZ );
	
	
	var event = new Event('change');
	var sideBarRoationX = document.getElementById( "SideBarRotationX" );;
	var sideBarRoationY = document.getElementById( "SideBarRotationY" );;
	var sideBarRoationZ = document.getElementById( "SideBarRotationZ" );;
	var objectRotationX = new UI.Number().setRange( -360.00, 360.00 ).setStep(10).setUnit('°').setWidth('50px').setId( 'ObjectRotationX' ).onChange( function( child ){

		resetRorations( 'x' );
		sideBarRoationX.value = Number(this.getValue()).toFixed(2);
		sideBarRoationX.dispatchEvent(event);
	} );
	buttons.add( new UI.Text( editor.languageData.ObjectRotation +  "X" ) );
	buttons.add( objectRotationX );

	var objectRotationY = new UI.Number().setRange( -360.00, 360.00 ).setStep(10).setUnit('°').setWidth('50px').setId( 'ObjectRotationY' ).onChange( function( child ){

		resetRorations( 'y' );
		sideBarRoationY.value = Number(this.getValue()).toFixed(2);
		sideBarRoationY.dispatchEvent(event);
	} );
	buttons.add( new UI.Text( "Y" ) );
	buttons.add( objectRotationY );

	var objectRotationZ = new UI.Number().setRange( -360.00, 360.00 ).setStep(10).setUnit('°').setWidth('50px').setId( 'ObjectRotationZ' ).onChange( function( child ){

		resetRorations( 'z' );
		sideBarRoationZ.value = Number(this.getValue()).toFixed(2);
		sideBarRoationZ.dispatchEvent(event);
	} );
	if( sideBarRoationX != undefined && sideBarRoationY != undefined && sideBarRoationZ != undefined ){
		objectRotationX.setValue( Number( sideBarRoationX.value ).toFixed(2) );
		objectRotationY.setValue( Number( sideBarRoationY.value ).toFixed(2) );
		objectRotationZ.setValue( Number( sideBarRoationZ.value ).toFixed(2) );
	}
	

	buttons.add( new UI.Text( "Z" ) );
	buttons.add( objectRotationZ );

	function resetRorations( coordinate ){
		if( editor.selected === null || editor.selected === undefined || editor.selected.type == "HemisphereLight" ){
			if( coordinate == "x" ){
				objectRotationX.setValue( Number(0).toFixed(2) );
			}
			else if( coordinate == "y" ){
				objectRotationY.setValue( Number(0).toFixed(2) );
			}
			else if( coordinate == "z" ){
				objectRotationZ.setValue( Number(0).toFixed(2) );
			}
			editor.deselect();
			return;
		}
		if( editor.selected.camCategory == "Fixed Dome" ){
			if( coordinate == "x" || coordinate == "y" ){
				objectRotationX.setValue( (editor.selected.rotation.x * THREE.Math.RAD2DEG).toFixed(2) );
				objectRotationY.setValue( (editor.selected.rotation.y * THREE.Math.RAD2DEG).toFixed(2) );
				toastr.info( editor.languageData.Domecamerascantberotatedinxorydirection);

			}
		}
		if( editor.selected instanceof THREE.PerspectiveCamera && editor.selected.userData.threeDModelType != undefined && ( editor.selected.userData.threeDModelType == "Dome" || editor.selected.userData.threeDModelType == "PTZ" || editor.selected.userData.threeDModelType == "LiDAR" && editor.selected.sensorCategory === "Hitachi LFOM5" ) ) {

			if( coordinate == "x" ){
				objectRotationX.setValue((editor.selected.rotation.x * THREE.Math.RAD2DEG).toFixed(2));
			}
			else if( coordinate == "y" ){
				objectRotationY.setValue((editor.selected.rotation.y * THREE.Math.RAD2DEG).toFixed(2));
			}
			else{
				objectRotationZ.setValue((editor.selected.rotation.z * THREE.Math.RAD2DEG).toFixed(2));
			}
			toastr.info(editor.languageData.ManualRotationisdisabledforthiscamera);
			editor.deselect();
			return;
		}
		

	}

	signals.objectSelected.add( function ( object ) {

		if ( object !== editor.selected ) return;

		if(object == null){
			objectRotationX.setValue(Number( 0 ).toFixed(2));
			objectRotationY.setValue(Number( 0 ).toFixed(2));
			objectRotationZ.setValue(Number( 0 ).toFixed(2));
			return;
		}
		objectPositionZ.setStyle('background-color',['transparent']);
		objectPositionX.setStyle('background-color',['transparent']);
		objectPositionY.setStyle('background-color',['transparent']);
		updateSelectedobject(object);
		
		objectRotationX.setValue((editor.selected.rotation.x * THREE.Math.RAD2DEG).toFixed(2));
		objectRotationY.setValue((editor.selected.rotation.y * THREE.Math.RAD2DEG).toFixed(2));
		objectRotationZ.setValue((editor.selected.rotation.z * THREE.Math.RAD2DEG).toFixed(2));

	} );

	var hide = new UI.Button( '' );
	hide.dom.title = editor.languageData.HideMe;
	hide.dom.className = 'btn btn-default btn-xs';
	hide.dom.innerHTML = '<span class="fa fa-close"></span>';
	hide.onClick( function () {

		document.getElementById( 'toolbar' ).style.display =  'none';
		editor.signals.toolbarHidden.dispatch();

	} );
	buttons.add( hide );

	//Signal to update position of selected object in toolbar start
	editor.signals.reConfigurePreviousMeasurements.add( function(){

		var object = editor.selected;
		if( object!= null ){

			updateSelectedobject(object);

		}

	} );
	//Signal to update position of selected object in toolbar end
	editor.signals.updateReferencePoint.add( function( object ){

		var refPointPosition = object.position.clone();
		var referencePoint = object;
		refCam = editor.scene.getObjectByProperty( 'uuid', object.camerauuid );
		refLine = editor.scene.getObjectByProperty( 'uuid', object.userData.lineUUID );		

		var camPosition = refCam.position.clone();
		var Distance = ( ( refPointPosition.distanceTo( camPosition ) ) * editor.commonMeasurements.targetConversionFactor ).toFixed(1);

		//Modified to include absolute height and absolute distance start
		var absHeight = (( camPosition.y - refPointPosition.y )* editor.commonMeasurements.targetConversionFactor ).toFixed(1);
		var absDistance = (( camPosition.x - refPointPosition.x )* editor.commonMeasurements.targetConversionFactor ).toFixed(1);
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
		else if(  editor.commonMeasurements.targetUnit === "feet"  ){

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

			processRefCamLineEndPoints( refLine, refPointPosition, camPosition, badgeLabelText );

		}								

		object.userData.refCamDistance = badgeLabelText;
		object.userData.absHeight = absHeight;
		object.userData.absDistance = absDistance;
		editor.signals.sceneGraphChanged.dispatch();


	} );

	editor.signals.updateCameraAndRefPoint.add( function( object ){

		var camPosition = object.position.clone();
		RefPt = editor.scene.getObjectByProperty( 'uuid', object.userData.refUUID );
		refLine = editor.scene.getObjectByProperty( 'uuid', object.userData.lineUUID );
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
		else if(  editor.commonMeasurements.targetUnit === "feet"  ){

			badgeLabelText = Distance + " ft";
			absHeight = absHeight + " ft";
            absDistance = absDistance + " ft";

		} 

		if( RefPt.userData.checkLOSFlag === "set" ){

			processRefCamLineEndPoints( refLine, refPosition, camPosition, badgeLabelText );

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

	} );

	signals.objectChanged.add( function ( object ) {
		
		if ( object !== editor.selected ) return;
			
		updateToolbarposition(object);
	
		objectRotationX.setValue((editor.selected.rotation.x * THREE.Math.RAD2DEG).toFixed(2));
		objectRotationY.setValue((editor.selected.rotation.y * THREE.Math.RAD2DEG).toFixed(2));
		objectRotationZ.setValue((editor.selected.rotation.z * THREE.Math.RAD2DEG).toFixed(2));

	} );

	signals.refreshSidebarObject3D.add( function ( object ) {

		if ( object !== editor.selected ) return;

		updateToolbarposition(object);

	} );

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
