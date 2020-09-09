/**
 * ResetButton( editor ) - Constructor function for resetting the viewport.
 * @constructor
 * @param {any} editor - The instance of the Editor which manages the overall objects and signals
 * @author Mavelil
 * @returns {Void}
 * @example <caption>Example usage of ResetButton</caption>
 * var resetButton = new ResetButton( editor );
 */
var ResetButton = function ( editor ) {

	const TOP_VIEW = 1;
	const LEFT_VIEW = 2;
	const Right_VIEW = 3;
	//var container = new UI.Panel();
	//container.setId( 'resetbtn' );
	//var resetbutton = new UI.Button();	
	//resetbutton.setId( 'reset-btn' );
	//resetbutton.setClass( 'fa fa-undo fa-3x' );

	//resetbutton.onClick( function () {
	document.getElementById( 'reset-btn' ).addEventListener( 'click', function( event ){

		//Editor is in 3D view
		if( editor.selectedView === true && editor.isFloorplanViewActive === false ){

			//Modified for reseting the camera zoom start
			editor.camera.zoom = 1;
			editor.camera.updateProjectionMatrix();
			//Modified for reseting the camera zoom end
			
			editor.execute( new SetPositionCommand( editor.camera, new THREE.Vector3( 20, 10, 20 ) ) );	
			editor.execute( new SetRotationCommand( editor.camera, new THREE.Euler( -0.453786, 0.715585, 0.314159) ) );
		}
		//Editor is in floor-plan views
		else if( editor.selectedView === false && editor.isFloorplanViewActive === true ){

			//Modified for reseting the camera zoom start
			editor.orthoCamera.zoom = 1;
        	editor.orthoCamera.updateProjectionMatrix();
			editor.camera.zoom = 1;
			editor.camera.updateProjectionMatrix();
			//Modified for reseting the camera zoom end
			
		}
		//Editor is in 2D views
		else{

			//Modified for reseting the camera zoom start
			editor.camera.zoom = 1;
			editor.camera.updateProjectionMatrix();
			//Modified for reseting the camera zoom end

			editor.camera.matrixAutoUpdate = true;
			if(editor.type2dView == TOP_VIEW){

				editor.execute( new SetPositionCommand( editor.camera, new THREE.Vector3( 00, 61, 00 ) ) );
				editor.execute( new SetRotationCommand( editor.camera, new THREE.Euler( -1.5708, 0, 0 ) ) );
				editor.zoomTop=editor.camera.position.y;
			}
			
			if(editor.type2dView == LEFT_VIEW){

				editor.execute( new SetPositionCommand( editor.camera, new THREE.Vector3( -60, 00, 00 ) ) );
				editor.execute( new SetRotationCommand( editor.camera, new THREE.Euler(-1.5708, -1.5708,-1.5708 ) ) );
				editor.zoomLeft = editor.camera.position.x;
			}
			if(editor.type2dView == Right_VIEW){

				editor.execute( new SetPositionCommand( editor.camera, new THREE.Vector3( 60, 00, 00 ) ) );
			editor.execute( new SetRotationCommand( editor.camera, new THREE.Euler( -3.14159, 1.5708, 3.14159 ) ) );
				editor.zoomLeft = editor.camera.position.x;
			}
			editor.camera.matrixAutoUpdate = false;

		}

		//Modified for autoscaling of icons start
		if( editor.isFloorplanViewActive === true ){

			editor.orthographicScale();

		}
		else{

			//Modified to add camera icon auto scaling with zoom start
			var len = editor.sceneCameras.length;
			var scaleVector = new THREE.Vector3();
			var scaleFactor = 16, scale;
			for( var i = 0; i < len; i++ ){

				var sprite = editor.sceneCameras[ i ].children[ 0 ];

				if( !( sprite instanceof THREE.Sprite ) ) continue;

				scale = scaleVector.subVectors( editor.sceneCameras[ i ].position, editor.camera.position ).length() / scaleFactor;
				sprite.scale.set(scale, scale, 1);

			}
			//Modified to add camera icon auto scaling with zoom end
			
			//Modified to autoscale length badge measurement icons with respect to zoom level start
			var lBadgeScaleVector = new THREE.Vector3();
			var lBadgeScaleFactor = 7, lMarkerScaleFactor = 13;
			var lengthBadgesLen = editor.lengthBadges.length, lengthMarkersLen = editor.lengthEndMarkers.length, lBadgeScale, lMarkerScale;
			if( editor.msrmntsShowHideToggle === true || editor.isMeasuring === true ){

				for( var j = 0; j < lengthBadgesLen; j++ ){
					
					lBadgeScale = lBadgeScaleVector.subVectors( editor.lengthBadges[ j ].position, editor.camera.position ).length() / lBadgeScaleFactor;
					editor.lengthBadges[ j ].scale.set( lBadgeScale, lBadgeScale, 1 );

				}

				lengthMarkersLen = editor.lengthEndMarkers.length;
				for( var j = 0; j < lengthMarkersLen; j++ ){
					
					lMarkerScale = lBadgeScaleVector.subVectors( editor.lengthEndMarkers[ j ].position, editor.camera.position ).length() / lMarkerScaleFactor;
					editor.lengthEndMarkers[ j ].scale.set( lMarkerScale, lMarkerScale, lMarkerScale );

				}

			}
			//Modified to autoscale length badge measurement icons with respect to zoom level end

			//Modified to autoscale area badge measurement icons with respect to zoom level start
			var aBadgeScaleVector = new THREE.Vector3();
			var aBadgeScaleFactor = 7, aMarkerScaleFactor = 13;
			var aBadgesLen = editor.areaBadges.length, aBadgeScale, aMarkersLen = editor.areaEndMarkers.length, aMarkerScale;
			if( editor.msrmntsShowHideToggle === true || editor.isAreaMeasuring === true ){

				for( var k = 0; k < aBadgesLen; k++ ){
					
					aBadgeScale = aBadgeScaleVector.subVectors( editor.areaBadges[ k ].position, editor.camera.position ).length() / aBadgeScaleFactor;
					editor.areaBadges[ k ].scale.set( aBadgeScale, aBadgeScale, 1 );

				}

				for( var k = 0; k < aMarkersLen; k++ ){
					
					aMarkerScale = aBadgeScaleVector.subVectors( editor.areaEndMarkers[ k ].position, editor.camera.position ).length() / aMarkerScaleFactor;
					editor.areaEndMarkers[ k ].scale.set( aMarkerScale, aMarkerScale, aMarkerScale );

				}

			}
			//Modified to autoscale area badge measurement icons with respect to zoom level end

			//Modified to autoscale Camera Reference icons with respect to zoom level start
			var lenRef = editor.allReferencePoint.length;
			var scaleVectorRef = new THREE.Vector3();
			var scaleFactorRef = 16, scale;
			for( var i = 0; i < lenRef; i++ ){

				scale = scaleVectorRef.subVectors( editor.allReferencePoint[ i ].position, editor.camera.position ).length() / scaleFactorRef;
				editor.allReferencePoint[ i ].scale.set(scale, scale, 1);
				
			}
			//Modified to autoscale Camera Reference icons with respect to zoom level end

		}

		editor.signals.sceneGraphChanged.dispatch();
		//Modified for autoscaling of icons end
	
		//Modified for activity logging start
		try{

			//Modified for activity logging start
			var logDatas = {};
			logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : View-port reset";
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
	
};