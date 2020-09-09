Zoom.operation = function ( editor ) {

	var signals = editor.signals;

	document.getElementById( 'zoomIn' ).addEventListener( 'click', function( event ){
		var x,y,z;
		if( editor.selectedView === false && editor.isFloorplanViewActive === false ){

			
			if( editor.type2dView== 1 || editor.type2dView== 2 ||editor.type2dView== 3 ||editor.type2dView== 4 || editor.type2dView== 5 || editor.type2dView== 6){
				
				editor.camera.matrixAutoUpdate=true;
				editor.Zoomoperationcontrol.zoom( new THREE.Vector3( 0, 0, -100) );
				editor.camera.matrixAutoUpdate=false;

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
		
		}
		else if( editor.selectedView === false && editor.isFloorplanViewActive === true ){

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

		}
		else{
			
			editor.camera.matrixAutoUpdate=true;
			editor.Zoomoperationcontrol.zoom( new THREE.Vector3( 0, 0, -100) );
		
		}

	} );
	
	document.getElementById( 'zoomOut' ).addEventListener( 'click', function( event ){

		var x,y,z;
		if( editor.selectedView === false && editor.isFloorplanViewActive === false ){

			
			if(editor.type2dView== 1 || editor.type2dView== 2 ||editor.type2dView== 3 ||editor.type2dView== 4 || editor.type2dView== 5 || editor.type2dView== 6){
				
				
				editor.camera.matrixAutoUpdate=true;
				editor.Zoomoperationcontrol.zoom( new THREE.Vector3( 0, 0, 100) );
				editor.camera.matrixAutoUpdate=false;

					
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

		}
		else if( editor.selectedView === false && editor.isFloorplanViewActive === true ){

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

		}
		else{

			editor.camera.matrixAutoUpdate=true;
			editor.Zoomoperationcontrol.zoom( new THREE.Vector3( 0, 0, 100) );
			
		}

	} );


};