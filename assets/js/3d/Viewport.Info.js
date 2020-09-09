/**
 * @author mrdoob / http://mrdoob.com/
 */

Viewport.Info = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Panel();
	container.setId( 'info' );
	container.setPosition( 'absolute' );
	container.setLeft( '10px' );
	container.setBottom( '10px' );
	container.setFontSize( '12px' );
	container.setColor( '#fff' );

	var objectsText = new UI.Text( '0' ).setMarginLeft( '6px' );
	var verticesText = new UI.Text( '0' ).setMarginLeft( '6px' );
	var trianglesText = new UI.Text( '0' ).setMarginLeft( '6px' );
	var cameraCount = new UI.Text( '0' ).setMarginLeft( '6px' );
	var sensorCount = new UI.Text( '0' ).setMarginLeft( '6px' );

	container.add( new UI.Text( editor.languageData.objects ), objectsText, new UI.Break() );
	container.add( new UI.Text( editor.languageData.Vertices ), verticesText, new UI.Break() );
	container.add( new UI.Text( editor.languageData.triangles ), trianglesText, new UI.Break() );
	container.add( new UI.Text( editor.languageData.cameras ), cameraCount, new UI.Break() );
	container.add( new UI.Text( editor.languageData.sensors ), sensorCount, new UI.Break() );

	signals.objectAdded.add( update );
	signals.objectRemoved.add( update );
	signals.geometryChanged.add( update );

	//

	function update() {

		var scene = editor.scene;
		//console.log(scene);

		var objects = 0, vertices = 0, triangles = 0, cameracount = 0, sensorcount = 0;


		for ( var i = 0, l = scene.children.length; i < l; i ++ ) {
			var object = scene.children[ i ];

			object.traverseVisible( function ( object ) {

				objects ++;

				if ( object instanceof THREE.Camera ) {

					if( object.camCategory != "LiDAR" )
						cameracount = cameracount +1;
					else
						sensorcount += 1;

				}

				if( object instanceof THREE.Group && object.userData && object.userData.sensorData ){

					sensorcount += 1;

				}

				if ( object instanceof THREE.Mesh ) {

					var geometry = object.geometry;

					if ( geometry instanceof THREE.Geometry ) {

						vertices += geometry.vertices.length;
						triangles += geometry.faces.length;

					} else if ( geometry instanceof THREE.BufferGeometry ) {

						if ( geometry.index !== null ) {

							vertices += geometry.index.count * 3;
							triangles += geometry.index.count;

						} else {

							vertices += geometry.attributes.position.count;
							triangles += geometry.attributes.position.count / 3;

						}

					}

				}

			} );

			if(i ==editor.scene.children.length-1 )	{
				/* Default hemisphere Light remove */
				removeLight();
				/* Default hemisphere Light remove */
			}

		}

		objectsText.setValue( objects.format() );
		verticesText.setValue( vertices.format() );
		trianglesText.setValue( triangles.format() );
		cameraCount.setValue( cameracount );
		sensorCount.setValue( sensorcount );

		
		


	}

	/* Default hemisphere Light remove */
	function removeLight(){
		var hemisphereLightCount = 0;
		for(var i =0 ;i<editor.scene.children.length;i++){
			if(editor.scene.children[i] instanceof THREE.HemisphereLight ){
				
					//hemisphereLightCount=hemisphereLightCount+1;
					if(editor.arraylight[0] ===editor.scene.children[i] ){
						
					}
					else{
						editor.execute( new RemoveObjectCommand( editor.scene.children[i] ) );
					}
					
			}

			/*if(hemisphereLightCount >= 2){
			
				editor.execute( new RemoveObjectCommand( editor.arraylight[0] ) );
				return;
			
			}	*/
		}


	}
	/* Default hemisphere Light remove */
	
	return container;

};
