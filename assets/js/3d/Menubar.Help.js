
Menubar.Help = function ( editor ) {

	var container = new UI.Panel();
	container.setClass( 'menu' );

	var title = new UI.Panel();
	title.setClass( 'title' );
	title.setId('twodDthreeD');
	title.setTextContent( '2D view' );
	title.onClick( function () {

		if(editor.selectedView){
					title.setTextContent( '3D view' );
					var postionX = editor.camera.position.x;
					var postionY= editor.camera.position.y;
					var postionZ= editor.camera.position.z;
					var rotationX= editor.camera.rotation.x;
					var rotationY= editor.camera.rotation.y;
					var rotationZ= editor.camera.rotation.z;
					editor.threeDpostion.x = postionX;
					editor.threeDpostion.y = postionY;
					editor.threeDpostion.z = postionZ;
					editor.threeDrotation.x = rotationX;
					editor.threeDrotation.y = rotationY;
					editor.threeDrotation.z = rotationZ;

					document.getElementById('topView').style.background ='#dbdcd5';
					document.getElementById('leftView').style.background ='transparent';
					document.getElementById('rightView').style.background ='transparent';
					editor.selectedView=false;
					editor.type2dView=1;
					editor.set2Dview();
					if(editor.liveTwodViewFlag){
						document.getElementById('stopSide2dView').click();
					}
			if(editor.zoomTop==''){
			y = 61;
				}
				else{

				y = editor.zoomTop;
			}
			editor.execute( new SetPositionCommand( editor.camera, new THREE.Vector3( 00, y, 00 ) ) );
        	editor.execute( new SetRotationCommand( editor.camera, new THREE.Euler( -1.5708, 0, 0 ) ) );
           // editor.execute( new SetRotationCommand( object, new THREE.Euler(1.74533, 1.22173,-1.74533) ) );
			editor.camera.matrixAutoUpdate=false;

			/*MODIFIED TO SHOW?HIDE MEASUREMENT TOOL START*/
			//document.getElementById('measurement').style.display = "block";
			//document.getElementById('measure-tool-btn').style.display = "block";
			/*MODIFIED TO SHOW?HIDE MEASUREMENT TOOL END*/

		}
		else{

			title.setTextContent( '2D view' );
			document.getElementById('generate_report').style.display="block";
			editor.set3Dview();
			editor.execute( new SetPositionCommand( editor.camera, new THREE.Vector3( editor.threeDpostion.x, editor.threeDpostion.y, editor.threeDpostion.z ) ) );
        	editor.execute( new SetRotationCommand( editor.camera, new THREE.Euler( editor.threeDrotation.x, editor.threeDrotation.y,editor.threeDrotation.z ) ) );

        	/*MODIFIED TO SHOW?HIDE MEASUREMENT TOOL START*/
        	/*if(editor.isMeasuring){

        		document.getElementById("measure-tool-btn").click();
        		
        	}*/
			//document.getElementById('measurement').style.display = "none";
			//document.getElementById('measure-tool-btn').style.display = "none";
			/*MODIFIED TO SHOW?HIDE MEASUREMENT TOOL END*/

		}
	});
	container.add( title );

	/*var options = new UI.Panel();
	options.setClass( 'options' );
	container.add( options );


	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Top' );
	option.onClick( function () {
		editor.camera.matrixAutoUpdate=true;
		document.getElementById('zoomIn').style.display='block';
		document.getElementById('zoomOut').style.display='block';
		type2dView=1;
		var object=editor.camera;
		editor.execute( new SetPositionCommand( object, new THREE.Vector3( 00, 61, 00 ) ) );
        editor.execute( new SetRotationCommand( object, new THREE.Euler( -1.5708, 0, 0 ) ) );
		editor.camera.matrixAutoUpdate=false;
		 
		
	} );
	options.add( option );
	
	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Left' );
	option.onClick( function () {
		editor.camera.matrixAutoUpdate=true;
		document.getElementById('zoomIn').style.display='block';
		document.getElementById('zoomOut').style.display='block';
		var object=editor.camera;
		type2dView=2;
		editor.execute( new SetPositionCommand( object, new THREE.Vector3( -60, 00, 00 ) ) );
        editor.execute( new SetRotationCommand( object, new THREE.Euler(-1.5708, -1.5708,-1.5708 ) ) );
		renderer = new THREE.WebGLRenderer( { antialias: true } );
		editor.camera.matrixAutoUpdate=false;
		

	} );
	options.add( option );

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Right' );
	option.onClick( function () {
		editor.camera.matrixAutoUpdate=true;
		document.getElementById('zoomIn').style.display='block';
		document.getElementById('zoomOut').style.display='block';
		type2dView=3;
		 var object=editor.camera;
         editor.execute( new SetPositionCommand( object, new THREE.Vector3( 60, 00, 00 ) ) );
         editor.execute( new SetRotationCommand( object, new THREE.Euler( -3.14159, 1.5708, 3.14159 ) ) );
		editor.camera.matrixAutoUpdate=false;
		 

	} );
	options.add( option );
	
	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Screenshot' );
	option.onClick( function () {
		 var d=270;
		 var dd= d.toString()
	     var object=editor.camera;
	    //editor.execute( new SetPositionCommand( object, new THREE.Vector3( 00, 61, 00 ) ) );
     	// editor.execute( new SetRotationCommand( object, new THREE.Euler( -1.5708, 0, 0 ) ) );
		renderer = new THREE.WebGLRenderer( { antialias: true } );
		var a = document.createElement('a');
		renderer.setSize(window.innerWidth, window.innerHeight)
		renderer.render( editor.scene, editor.camera );
		a.href = renderer.domElement.toDataURL().replace("image/png", "image/octet-stream");
		a.download = 'Screenshot.png'
		a.click();
	     
	     
        
	} );
	options.add( option );*/


	return container;
	

};
