Menubar.Right = function ( editor ) {

	var container = new UI.Panel();
	container.setClass( 'menu' );

	var title = new UI.Panel();
	title.setClass( 'title' );
	title.setId( 'rightView' );
	title.setStyle('display',['none']);
	title.setTextContent( 'Right View' );
	title.onClick( function () {
		document.getElementById('topView').style.background ='transparent';
		document.getElementById('leftView').style.background ='transparent';
		title.setStyle('background',['#dbdcd5']);
		//document.getElementById('topView').style.background ='#15b3b9';
		editor.camera.matrixAutoUpdate=true;
		document.getElementById('zoomIn').style.display='block';
		document.getElementById('zoomOut').style.display='block';
		editor.type2dView=3;
		if(editor.zoomRight==''){
			x = 60;
		}
		else{

			x = editor.zoomRight;
		}
		var object=editor.camera;
        editor.execute( new SetPositionCommand( object, new THREE.Vector3( x, 00, 00 ) ) );
        editor.execute( new SetRotationCommand( object, new THREE.Euler( -3.14159, 1.5708, 3.14159 ) ) );
		editor.camera.matrixAutoUpdate=false;

	});
	container.add( title );
	
	return container;
	

};