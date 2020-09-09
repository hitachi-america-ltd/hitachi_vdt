/**
 * FreezButton( editor ) : Constructor for freeze button
 * @constructor
 * @param {any} editor - The instance of the Editor which manages the overall objects and signals
 * @returns {Void}
 * @author Hari
 * @example <caption>Example usage of FreezButton</caption>
 * var freezButton = new FreezButton( editor );
 */

var FreezButton  = function( editor ){

	//var container = new UI.Panel();
	//container.setId( 'freeezbtn-cont' );
	//var freezbutton = new UI.Button();	
	//freezbutton.setId( 'freeez-btn' );
	//freezbutton.setClass( 'fa fa-toggle-off fa-2x' );
	//freezbutton.onClick(function(){
	document.getElementById( 'freeez-btn' ).addEventListener( 'click', function( event ){

		var freez = new FreezObject(editor.scene.children,editor);
		//var el = document.getElementById("freeez-btn");
		var el = document.getElementById("freeez-btn-content");
		if (el.classList.contains("fa-toggle-off")){

			el.style.color = "#500080";
			el.classList.remove("fa-toggle-off");
			el.className += " fa-toggle-on";
			el.className += " faa-pulse animated";
			freez.freezall();
			editor.freezflag = true;

			//Modified for activity logging start
			try{

				//Modified for activity logging start
				var logDatas = {};
				logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Freez mode active";
				logger.addLog( logDatas );
				logger.sendLogs( localStorage.getItem( 'U_ID' ) );
				//Modified for activity logging end

			}
			catch( exception ){

				console.log( "Logging failed!" );
				console.log( exception );

			}
			//Modified for activity logging end

			return;
		}

		if (el.classList.contains("fa-toggle-on"))
		{
			el.style.color = "#000000";
			el.classList.remove("fa-toggle-on");
			el.classList.remove("faa-pulse");
			el.classList.remove("animated");
			el.className += " fa-toggle-off";
			freez.removeFreez();
			editor.freezflag = false;

			//Modified for activity logging start
			try{

				//Modified for activity logging start
				var logDatas = {};
				logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Freez mode disabled";
				logger.addLog( logDatas );
				logger.sendLogs( localStorage.getItem( 'U_ID' ) );
				//Modified for activity logging end

			}
			catch( exception ){

				console.log( "Logging failed!" );
				console.log( exception );

			}
			//Modified for activity logging end

			return;
		}

	})

	//container.add( freezbutton );
	//return container;

}
