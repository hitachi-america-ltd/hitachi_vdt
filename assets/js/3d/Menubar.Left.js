Menubar.Left = function ( editor ) {

	var container = new UI.Panel();
	container.setClass( 'menu' );

	var title = new UI.Panel();
	title.setClass( 'title' );
	title.setId( 'leftView' );
	title.setStyle('display',['none']);
	title.setTextContent( 'Left View' );
	
	title.onClick( function () {
		document.getElementById('topView').style.background ='transparent';
		document.getElementById('rightView').style.background ='transparent';
		title.setStyle('background',['#dbdcd5']);
		//document.getElementById('topView').style.background ='#15b3b9';
		editor.camera.matrixAutoUpdate=true;
		var x;
		document.getElementById('zoomIn').style.display='block';
		document.getElementById('zoomOut').style.display='block';
		var object=editor.camera;
		editor.type2dView=2;
		if(editor.zoomLeft==''){
			x= -60;
		}
		else{

			x = editor.zoomLeft;
		}
		editor.execute( new SetPositionCommand( object, new THREE.Vector3( x, 00, 00 ) ) );
        editor.execute( new SetRotationCommand( object, new THREE.Euler(-1.5708, -1.5708,-1.5708 ) ) );
		editor.camera.matrixAutoUpdate=false;

	});
	container.add( title );
	
	return container;
	

};