/**
 * @author mrdoob / http://mrdoob.com/
 */

Menubar.Play = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Panel();
	container.setClass( 'menu' );

	var isPlaying = false;

	var title = new UI.Panel();
	title.setClass( 'title' );
	title.setTextContent( 'Play' );
	title.onClick( function () {
		

		var cams_array_length = editor.camera_array.length;
		if ( isPlaying === false ) {

			//isPlaying = true;//
			//title.setTextContent( 'Stop' );//

			/*MULTIPLE CAMERA START*/

			if(cams_array_length > 0)
			{

				isPlaying = true;
				title.setTextContent( 'Stop' );
				(function myLoop (indx) {          
				   setTimeout(function () {  
				   		if(indx != 0) 
				   		{
				   			signals.stopPlayer.dispatch();
				   		}
				      	var script = { name: '', source: 'player.setCamera( editor.camera_array[' + indx + '] );' };
						
						editor.selected = editor.camera_array[indx];
						editor.execute( new AddScriptCommand( editor.selected, script ) );
						editor.last_script = script;
						signals.startPlayer.dispatch();     
					    if ((++indx) < cams_array_length) 
					    {
					      myLoop(indx);
					    }
				   }, 3000);
				})(0);
			}
			else
			{
				alert("You haven't added any cameras!");
			}
			/*MULTIPLE CAMERA END*/

			// uncomment below line
			//signals.startPlayer.dispatch();

		} else {

			isPlaying = false;
			title.setTextContent( 'Play' );
			signals.stopPlayer.dispatch();

		}

	} );
	/*MODIFIED TO HIDE PLAY BUTTON START*/
	//container.add( title );
	/*MODIFIED TO HIDE PLAY BUTTON END*/

	return container;

};
