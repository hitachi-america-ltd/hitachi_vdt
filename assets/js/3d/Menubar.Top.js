Menubar.Top = function ( editor ) {

	var container = new UI.Panel();
	container.setClass( 'menu' );

	var title = new UI.Panel();
	title.setClass( 'title' );
	title.setId( 'topView' );
	title.setStyle('display',['none']);
	title.setTextContent( 'Top View' );
	title.onClick( function () {
		document.getElementById('leftView').style.background ='transparent';
		document.getElementById('rightView').style.background ='transparent';
		title.setStyle('background',['#dbdcd5']);
		//document.getElementById('topView').style.background ='#15b3b9';
		editor.camera.matrixAutoUpdate=true;
		var y;
		editor.type2dView=1;
		if(editor.zoomTop==''){
			y = 61;
		}
		else{

			y = editor.zoomTop;
		}
		var object=editor.camera;
		editor.execute( new SetPositionCommand( object, new THREE.Vector3( 00, y, 00 ) ) );
        editor.execute( new SetRotationCommand( object, new THREE.Euler( -1.5708, 0, 0 ) ) );
		editor.camera.matrixAutoUpdate = false;

	});
	container.add( title );

	return container;
	

};
