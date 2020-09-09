/**
 * @author mrdoob / http://mrdoob.com/
 */

var Player = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Panel();
	container.setId( 'player' );
	container.setPosition( 'absolute' );
	container.setDisplay( 'none' );

	//

	var player = new APP.Player();
	container.dom.appendChild( player.dom );

	
	window.addEventListener( 'resize', function () {
		
		

		player.setSize( 1278, 719 );

	} );

	signals.startPlayer.add( function () {

		container.setDisplay( '' );

		player.load( editor.toJSON() );
		player.setSize( 1278, 719 );
		player.play();

	} );

	signals.stopPlayer.add( function () {

		container.setDisplay( 'none' );

		player.stop();
		player.dispose();

		editor.scripts = [];//remove all scripts

	} );

	return container;

};
