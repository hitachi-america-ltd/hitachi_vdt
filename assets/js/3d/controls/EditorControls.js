/**
 * @author qiao / https://github.com/qiao
 * @author mrdoob / http://mrdoob.com
 * @author alteredq / http://alteredqualia.com/
 * @author WestLangley / http://github.com/WestLangley
 */

THREE.EditorControls = function ( object, domElement ) {

	domElement = ( domElement !== undefined ) ? domElement : document;

	// API
	/*Change for zoom +/- start*/
	editor.Zoomoperationcontrol = this;
	/*Change for zoom +/- start*/
	this.enabled = true;
	this.center = new THREE.Vector3();
	this.panSpeed = 0.001;
	this.zoomSpeed = 0.001;
	this.rotationSpeed = 0.005;

	// internals

	var scope = this;
	var vector = new THREE.Vector3();

	var STATE = { NONE: - 1, ROTATE: 0, ZOOM: 1, PAN: 2 };
	var state = STATE.NONE;

	var center = this.center;
	var normalMatrix = new THREE.Matrix3();
	var pointer = new THREE.Vector2();
	var pointerOld = new THREE.Vector2();
	var spherical = new THREE.Spherical();

	// events

	var changeEvent = { type: 'change' };

	this.focus = function ( target ) {

		var box = new THREE.Box3().setFromObject( target );
		object.lookAt( center.copy( box.getCenter() ) );
		scope.dispatchEvent( changeEvent );


	};

	this.pan = function ( delta ) {

		var distance = object.position.distanceTo( center );

		delta.multiplyScalar( distance * scope.panSpeed );
		delta.applyMatrix3( normalMatrix.getNormalMatrix( object.matrix ) );

		object.position.add( delta );
		center.add( delta );

		scope.dispatchEvent( changeEvent );

	};

	this.zoom = function ( delta ) {

		
		if( editor.selectedView === false && editor.isFloorplanViewActive === true ){

				if( delta.z > 0){

					editor.camera.zoom -= 0.05;
					editor.camera.updateProjectionMatrix()
					editor.signals.sceneGraphChanged.dispatch();
					if( editor.type2dView == 1 ) {

					   	editor.FloorplanZoomTop = editor.camera.zoom;
					}
					if( editor.type2dView == 2 ) {

						editor.FloorplanZoomLeft = editor.camera.zoom;
					}
					if( editor.type2dView == 3 ) {

						editor.FloorplanZoomRight = editor.camera.zoom;
					}
					if( editor.type2dView == 4 ) {

						editor.FloorplanZoomBottem = editor.camera.zoom;
					}
					if( editor.type2dView == 5 ) {

						editor.FloorplanZoomFront = editor.camera.zoom;
					}
					if( editor.type2dView == 6 ) {

						editor.FloorplanZoomBack = editor.camera.zoom;
					}
					editor.orthographicScale();
					return;
				}
				else {


					editor.camera.zoom += 0.05;
					editor.camera.updateProjectionMatrix()
					editor.signals.sceneGraphChanged.dispatch();
					if( editor.type2dView == 1 ) {

					   	editor.FloorplanZoomTop = editor.camera.zoom;
					}
					if( editor.type2dView == 2 ) {

						editor.FloorplanZoomLeft = editor.camera.zoom;
					}
					if( editor.type2dView == 3 ) {

						editor.FloorplanZoomRight = editor.camera.zoom;
					}
					if( editor.type2dView == 4 ) {

						editor.FloorplanZoomBottem = editor.camera.zoom;
					}
					if( editor.type2dView == 5 ) {

						editor.FloorplanZoomFront = editor.camera.zoom;
					}
					if( editor.type2dView == 6 ) {

						editor.FloorplanZoomBack = editor.camera.zoom;
					}
					editor.orthographicScale();
					return;
				}

		}
	
		if( !editor.twoViewInLive){
			
			
			if(editor.selectedView == false){
			
				object.matrixAutoUpdate=true;
			}
			//console.log( object.matrixAutoUpdate )
			var distance = object.position.distanceTo( center );

			delta.multiplyScalar( distance * scope.zoomSpeed );

			if ( delta.length() > distance ) return;

			delta.applyMatrix3( normalMatrix.getNormalMatrix( object.matrix ) );

			object.position.add( delta );

			if(editor.liveTwodViewFlag){


				editor.twodCamera.copy(object);
		
			}
			//object.matrixAutoUpdate=false;
			

		}

		else{
			
			
			if(editor.liveZoombtn){

				editor.liveZoombtn = false;
				var distances = editor.twodCamera.position.distanceTo( center );
				delta.multiplyScalar( distances * scope.zoomSpeed );

				if ( delta.length() > distances ) return;

				delta.applyMatrix3( normalMatrix.getNormalMatrix( editor.twodCamera.matrix ) );
				editor.twodCamera.position.add( delta );

			}
			else if (!editor.liveZoombtn){
				
				var distances =object.position.distanceTo( center );
				delta.multiplyScalar( distances * scope.zoomSpeed );

				if ( delta.length() > distances ) return;

				delta.applyMatrix3( normalMatrix.getNormalMatrix( object.matrix ) );
				object.position.add( delta );

			}

			else{

				var data = delta;
				var newdalta;
				var distances = object.position.distanceTo( center );
				data.multiplyScalar( distances * scope.zoomSpeed );

				if ( data.length() > distances ) return;

				data.applyMatrix3( normalMatrix.getNormalMatrix( object.matrix ) );
				object.position.add( data );

				var distance = editor.twodCamera.position.distanceTo( center );

				if(data.z >0){

					newdalta = new THREE.Vector3( 0, 0, 100)

				}
				else{

					newdalta = new THREE.Vector3( 0, 0, -100)
				}
				newdalta.multiplyScalar( distance * scope.zoomSpeed );

				if ( newdalta.length() > distance ) return;

				newdalta.applyMatrix3( normalMatrix.getNormalMatrix( editor.twodCamera.matrix ) );

				editor.twodCamera.position.add( newdalta );


			}
	
		}

		if( editor.SCALE_LIMIT != null && editor.SCALE_LIMIT!= undefined && editor.camera.position.length() <= editor.SCALE_LIMIT ){
			
			var PoiScaleRef = 13;
			var PoiScaleVectorRef=new THREE.Vector3();
			var PoiScale;
			for(var i=0; i<editor.allPointOfinterest.length;i++){

				PoiScale = PoiScaleVectorRef.subVectors( editor.allPointOfinterest[i].position, editor.camera.position ).length() / PoiScaleRef;
				editor.allPointOfinterest[i].scale.set( PoiScale, PoiScale, PoiScale )
				
			}
			//Modified to auto scale sensor icons end
			var sensorScaleRef = 20;
			var sensorScaleVectorRef;
			var sensorScale;
			var sensorMaxScale
			editor.scene.traverse( function(child){
	
				if( child instanceof THREE.Sprite && child.userData && child.userData.sensorData ){
					
					sensorScaleVectorRef = new THREE.Vector3();
					sensorScale = sensorScaleVectorRef.subVectors( child.position, editor.camera.position ).length() / sensorScaleRef;
					child.scale.set( sensorScale, sensorScale, sensorScale )
				}
			} )
	
	
			//Modified to auto scale sensor icons end
	

			var len = editor.sceneCameras.length;
			var scaleVector = new THREE.Vector3();
			var scaleFactor = 7, scale;
			for( var i = 0; i < len; i++ ){

				//if( children[ i ] instanceof THREE.PerspectiveCamera ){

				var sprite;
                editor.sceneCameras[ i ].traverse( function( child ){
                    if(( child instanceof THREE.Sprite ) && ( child.name = "cameraHelperIcon" )){
                        sprite = child;
                    }
				} );
				if( !( ( sprite instanceof THREE.Sprite ) && ( sprite.name = "cameraHelperIcon" ) ) ) continue;
				if( sprite.parent instanceof THREE.Mesh && sprite.parent.name == "cameraHelperIcon" ){
					scaleFactor = 30;
					scale = scaleVector.subVectors( editor.sceneCameras[ i ].position, editor.camera.position ).length() / scaleFactor;
					sprite.parent.scale.set(scale, scale, 1);
				}
				else{
					if( editor.sceneCameras[ i ].camCategory == "LiDAR" ){
						scaleFactor = 2;
					}
					else{
						scaleFactor = 7;
					}
					scale = scaleVector.subVectors( editor.sceneCameras[ i ].position, editor.camera.position ).length() / scaleFactor;
					sprite.scale.set(scale, scale, 1);
				}

			}
			//Modified to add camera icon auto scaling with zoom end


			//Modified to add junction box icon auto scaling with zoom start
            var len = editor.junctionBoxBadges.length;
            
            var scaleVector = new THREE.Vector3();
            var scaleFactor = 20, scale;
            for( var i = 0; i < len; i++ ){

                var sprite = editor.junctionBoxBadges[ i ];
                
                scale = scaleVector.subVectors( editor.junctionBoxBadges[ i ].position, editor.camera.position ).length() / scaleFactor;
                sprite.scale.set(scale, scale, 1);

            }
            //Modified to add junction box icon auto scaling with zoom end

			//Modified to autoscale length badge measurement icons with respect to zoom level start
			var lBadgeScaleVector = new THREE.Vector3();
			var lBadgeScaleFactor = 7, lMarkerScaleFactor = 13;
			var lengthBadgesLen = editor.lengthBadges.length, lengthMarkersLen = editor.lengthEndMarkers.length, lBadgeScale, lMarkerScale;
			
			//if( editor.lengthShowHideToggle === true || editor.isMeasuring === true ){
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
			
			//if( editor.areaShowHideToggle === true || editor.isAreaMeasuring === true ){
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
			var scaleFactorRef = 20, scale;
			for( var i = 0; i < lenRef; i++ ){

				scale = scaleVectorRef.subVectors( editor.allReferencePoint[ i ].position, editor.camera.position ).length() / scaleFactorRef;
				editor.allReferencePoint[ i ].scale.set(scale, scale, 1);
				
			}
			//Modified to autoscale Camera Reference icons with respect to zoom level end

			//Modified to auto scale network marker and badges start
			var nwBadgeScaleVector = new THREE.Vector3();
			var nwBadgeScaleFactor = 7, nwMarkerScaleFactor = 18;
			var nwBadgesLen = editor.nwBadges.length, nwBadgeScale, nwMarkersLen = editor.nwMarkers.length, nwMarkerScale;
			//if( editor.msrmntsShowHideToggle === true || editor.isAreaMeasuring === true ){
				
				for( var k = 0; k < nwBadgesLen; k++ ){

					nwBadgeScale = nwBadgeScaleVector.subVectors( editor.nwBadges[ k ].position, editor.camera.position ).length() / nwBadgeScaleFactor;
					editor.nwBadges[ k ].scale.set( nwBadgeScale, nwBadgeScale, 1 );
					
				}

				for( var k = 0; k < nwMarkersLen; k++ ){

					nwMarkerScale = nwBadgeScaleVector.subVectors( editor.nwMarkers[ k ].position, editor.camera.position ).length() / nwMarkerScaleFactor;
					editor.nwMarkers[ k ].scale.set( nwMarkerScale, nwMarkerScale, nwMarkerScale );

				}

			//Modified to scale Ref Cam Badge Start
			var refCamBadgeScaleVector = new THREE.Vector3();
			var refCamBadgeScaleFactor = 9;
			var refBadgesLen = editor.refCamBadge.length, refCamBadgeScale;

			for( var k = 0; k < refBadgesLen; k++ ){

				refCamBadgeScale = refCamBadgeScaleVector.subVectors( editor.refCamBadge[ k ].position, editor.camera.position ).length() / refCamBadgeScaleFactor;
				editor.refCamBadge[ k ].scale.set( refCamBadgeScale, refCamBadgeScale, 1 );

			}

		} else if( editor.SCALE_LIMIT != null && editor.SCALE_LIMIT!= undefined && editor.camera.position.length() > editor.SCALE_LIMIT ){

			var maxCamPosition = new THREE.Vector3( editor.SCALE_LIMIT/Math.sqrt(3), editor.SCALE_LIMIT/Math.sqrt(3), editor.SCALE_LIMIT/Math.sqrt(3) );

			var PoiScaleRef = 13;
			var PoiScaleVectorRef=new THREE.Vector3();
			var PoiScale;
			for(var i=0; i<editor.allPointOfinterest.length;i++){

				PoiScale = PoiScaleVectorRef.subVectors( editor.allPointOfinterest[i].position, maxCamPosition ).length() / PoiScaleRef;
				editor.allPointOfinterest[i].scale.set( PoiScale, PoiScale, PoiScale )
				
			}

			//Modified to auto scale sensor icons end
			var sensorScaleRef = 20;
			var sensorScaleVectorRef;
			var sensorScale;
			editor.scene.traverse( function(child){
	
				if( child instanceof THREE.Sprite && child.userData && child.userData.sensorData ){
					
					sensorScaleVectorRef = new THREE.Vector3();
					sensorScale = sensorScaleVectorRef.subVectors( child.position, maxCamPosition ).length() / sensorScaleRef;
					child.scale.set( sensorScale, sensorScale, sensorScale )
				}
			} )
	
	
			//Modified to auto scale sensor icons end

			
			
			//Modified to autoscale Camera Reference icons with respect to zoom level start
            var lenRef = editor.allReferencePoint.length;
            var scaleVectorRef = new THREE.Vector3();
            var scaleFactorRef = 20, scale;
            for( var i = 0; i < lenRef; i++ ){

                scale = scaleVectorRef.subVectors( editor.allReferencePoint[ i ].position, maxCamPosition ).length() / scaleFactorRef;
				editor.allReferencePoint[ i ].scale.set(scale, scale, 1);
                
            }
			//Modified to autoscale Camera Reference icons with respect to zoom level end
			
			//Modified to add camera icon auto scaling with zoom start
            var len = editor.sceneCameras.length;
            var scaleVector = new THREE.Vector3();
            var scaleFactor = 7, scale;
            for( var i = 0; i < len; i++ ){

                var sprite;
                editor.sceneCameras[ i ].traverse( function( child ){
                    if(( child instanceof THREE.Sprite ) && ( child.name = "cameraHelperIcon" )){
                        sprite = child;
                    }
				} );

				if( !( ( sprite instanceof THREE.Sprite ) && ( sprite.name = "cameraHelperIcon" ) ) ) continue;

				if( sprite.parent instanceof THREE.Mesh && sprite.parent.name == "cameraHelperIcon" ){
					scaleFactor = 30;
					scale = scaleVector.subVectors( editor.sceneCameras[ i ].position, maxCamPosition ).length() / scaleFactor;
                	sprite.parent.scale.set(scale, scale, 1);
				}
				else{
					if( editor.sceneCameras[ i ].camCategory == "LiDAR" ){
						scaleFactor = 2;
					}
					else{
						scaleFactor = 7;
					}
					scale = scaleVector.subVectors( editor.sceneCameras[ i ].position, maxCamPosition ).length() / scaleFactor;
                	sprite.scale.set(scale, scale, 1);
				}

            }
            //Modified to add camera icon auto scaling with zoom end

			editor.signals.sceneGraphChanged.dispatch();
			
		}
         
		//Modified to scale Ref Cam Badge End

		scope.dispatchEvent( changeEvent );
		if(editor.selectedView == false){
			
			object.matrixAutoUpdate=false;

			if( editor.type2dView == 1 ) {

				editor.zoomTop = editor.camera.position.y;
			}
			if( editor.type2dView == 2 ) {

				editor.zoomLeft = editor.camera.position.x;
			}
			if( editor.type2dView == 3 ) {

				editor.zoomRight = editor.camera.position.x;
			}
			if( editor.type2dView == 4 ) {

				editor.zoomBottem = editor.camera.position.y;
			}
			if( editor.type2dView == 5 ) {

				editor.zoomFront = editor.camera.position.z;
			}
			if( editor.type2dView == 6 ) {

				editor.zoomBack = editor.camera.position.z;
			}

		}

	};

	this.rotate = function ( delta ) {
		//console.log('rotate');
		if( editor.selectedView == false ){
			return;
		}
		if( !editor.twoViewInLive){

			vector.copy( object.position ).sub( center );

			spherical.setFromVector3( vector );

			spherical.theta += delta.x;
			spherical.phi += delta.y;

			spherical.makeSafe();

			vector.setFromSpherical( spherical );

			object.position.copy( center ).add( vector );

			object.lookAt( center );

			if(editor.liveTwodViewFlag){


				editor.twodCamera.copy(object);
		
			}
		}
		else{

			vector.copy( object.position ).sub( center );

			spherical.setFromVector3( vector );

			spherical.theta += delta.x;
			spherical.phi += delta.y;

			spherical.makeSafe();

			vector.setFromSpherical( spherical );

			object.position.copy( center ).add( vector );

			object.lookAt( center );
			/*vector.copy( editor.twodCamera.position ).sub( center );

			spherical.setFromVector3( vector );

			spherical.theta += delta.x;
			spherical.phi += delta.y;

			spherical.makeSafe();

			vector.setFromSpherical( spherical );

			editor.twodCamera.position.copy( center ).add( vector );

			editor.twodCamera.lookAt( center )*/

			

		}
		
		
		

			/*vector.copy( editor.twodCamera.position ).sub( center );

			spherical.setFromVector3( vector );

			spherical.theta += delta.x;
			spherical.phi += delta.y;

			spherical.makeSafe();

			vector.setFromSpherical( spherical );

			editor.twodCamera.position.copy( center ).add( vector );

			editor.twodCamera.lookAt( center );*/

		scope.dispatchEvent( changeEvent );

	};

	// mouse

	function onMouseDown( event ) {

		if ( scope.enabled === false ) return;

		if ( event.button === 0 ) {

			state = STATE.ROTATE;

		} else if ( event.button === 1 ) {

			state = STATE.ZOOM;

		} else if ( event.button === 2 ) {

			state = STATE.PAN;

		}

		pointerOld.set( event.clientX, event.clientY );

		domElement.addEventListener( 'mousemove', onMouseMove, false );
		domElement.addEventListener( 'mouseup', onMouseUp, false );
		domElement.addEventListener( 'mouseout', onMouseUp, false );
		domElement.addEventListener( 'dblclick', onMouseUp, false );

	}

	function onMouseMove( event ) {

		if ( scope.enabled === false ) return;

		pointer.set( event.clientX, event.clientY );

		var movementX = pointer.x - pointerOld.x;
		var movementY = pointer.y - pointerOld.y;

		if ( state === STATE.ROTATE ) {

			scope.rotate( new THREE.Vector3( - movementX * scope.rotationSpeed, - movementY * scope.rotationSpeed, 0 ) );

		} else if ( state === STATE.ZOOM ) {

			scope.zoom( new THREE.Vector3( 0, 0, movementY ) );

		} else if ( state === STATE.PAN ) {

			scope.pan( new THREE.Vector3( - movementX, movementY, 0 ) );

		}

		pointerOld.set( event.clientX, event.clientY );

	}

	function onMouseUp( event ) {

		domElement.removeEventListener( 'mousemove', onMouseMove, false );
		domElement.removeEventListener( 'mouseup', onMouseUp, false );
		domElement.removeEventListener( 'mouseout', onMouseUp, false );
		domElement.removeEventListener( 'dblclick', onMouseUp, false );

		state = STATE.NONE;

	}

	function onMouseWheel( event ) {

		event.preventDefault();	
		scope.zoom( new THREE.Vector3( 0, 0, event.deltaY ) );
	}

	function contextmenu( event ) {

		event.preventDefault();

	}

	this.dispose = function() {

		domElement.removeEventListener( 'contextmenu', contextmenu, false );
		domElement.removeEventListener( 'mousedown', onMouseDown, false );
		domElement.removeEventListener( 'wheel', onMouseWheel, false );

		domElement.removeEventListener( 'mousemove', onMouseMove, false );
		domElement.removeEventListener( 'mouseup', onMouseUp, false );
		domElement.removeEventListener( 'mouseout', onMouseUp, false );
		domElement.removeEventListener( 'dblclick', onMouseUp, false );

		domElement.removeEventListener( 'touchstart', touchStart, false );
		domElement.removeEventListener( 'touchmove', touchMove, false );

	};

	domElement.addEventListener( 'contextmenu', contextmenu, false );
	domElement.addEventListener( 'mousedown', onMouseDown, false );
	domElement.addEventListener( 'wheel', onMouseWheel, false );

	// touch

	var touches = [ new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3() ];
	var prevTouches = [ new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3() ];

	var prevDistance = null;

	function touchStart( event ) {

		if ( scope.enabled === false ) return;

		switch ( event.touches.length ) {

			case 1:
				touches[ 0 ].set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY, 0 );
				touches[ 1 ].set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY, 0 );
				break;

			case 2:
				touches[ 0 ].set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY, 0 );
				touches[ 1 ].set( event.touches[ 1 ].pageX, event.touches[ 1 ].pageY, 0 );
				prevDistance = touches[ 0 ].distanceTo( touches[ 1 ] );
				break;

		}

		prevTouches[ 0 ].copy( touches[ 0 ] );
		prevTouches[ 1 ].copy( touches[ 1 ] );

	}


	function touchMove( event ) {

		if ( scope.enabled === false ) return;

		event.preventDefault();
		event.stopPropagation();

		function getClosest( touch, touches ) {

			var closest = touches[ 0 ];

			for ( var i in touches ) {

				if ( closest.distanceTo( touch ) > touches[ i ].distanceTo( touch ) ) closest = touches[ i ];

			}

			return closest;

		}

		switch ( event.touches.length ) {

			case 1:
				touches[ 0 ].set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY, 0 );
				touches[ 1 ].set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY, 0 );
				scope.rotate( touches[ 0 ].sub( getClosest( touches[ 0 ], prevTouches ) ).multiplyScalar( - scope.rotationSpeed ) );
				break;

			case 2:
				touches[ 0 ].set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY, 0 );
				touches[ 1 ].set( event.touches[ 1 ].pageX, event.touches[ 1 ].pageY, 0 );
				var distance = touches[ 0 ].distanceTo( touches[ 1 ] );
				scope.zoom( new THREE.Vector3( 0, 0, prevDistance - distance ) );
				prevDistance = distance;


				var offset0 = touches[ 0 ].clone().sub( getClosest( touches[ 0 ], prevTouches ) );
				var offset1 = touches[ 1 ].clone().sub( getClosest( touches[ 1 ], prevTouches ) );
				offset0.x = - offset0.x;
				offset1.x = - offset1.x;

				scope.pan( offset0.add( offset1 ).multiplyScalar( 0.5 ) );

				break;

		}

		prevTouches[ 0 ].copy( touches[ 0 ] );
		prevTouches[ 1 ].copy( touches[ 1 ] );

	}

	domElement.addEventListener( 'touchstart', touchStart, false );
	domElement.addEventListener( 'touchmove', touchMove, false );

};

THREE.EditorControls.prototype = Object.create( THREE.EventDispatcher.prototype );
THREE.EditorControls.prototype.constructor = THREE.EditorControls;
