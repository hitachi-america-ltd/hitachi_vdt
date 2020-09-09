var Zoom = function ( editor ) {

	var container = new UI.Panel();
	container.setId( 'zoom' );

	container.add( new Zoom.operation( editor ) );
	
	return container;

};