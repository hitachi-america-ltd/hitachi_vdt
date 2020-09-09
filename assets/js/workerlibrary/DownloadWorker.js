/**
 *  DownloadWorker - WebWorker for downloading saved project data as JSON
 *  @param - e - object - e.data includes { downloadPath : string, respType : string }
 *  @param - downloadPath - string - exact path from which file shold be downloaded
 *  @param - respType - string - expected response type
 *  @return - Object - { status : 'success'/'failure', body: Object }
 */
importScripts();
importScripts("../3d/three.js");
importScripts("../3d/libs/jszip.min.js");
THREE.Cache.enabled = false;

	var stringToJson = function( stringData ){ 

		return new Promise( function( resolve, reject ){

			try{
				var sceneAsJson = JSON.parse( stringData );
				resolve( sceneAsJson );
			}
			catch( exception ){
				console.log( exception );
				reject( exception );
			}  		

		} );

	}
	
	var fileLoaded = function( data ){

		var zip = new JSZip();
		zip.loadAsync( data ).then( function( contents ){

		    Object.keys( contents.files ).forEach( function( filename ){

		        zip.file( filename ).async( 'text' ).then( function( content ) {

					stringToJson( content ).then( function( jsonObj ){
						
						var workerResp = {};
						workerResp.status = 'success';
						workerResp.body = jsonObj;
						postMessage( workerResp );

					}, function( error ){
						console.log( error );
					} );

					
				} );
				 
			} );
			
		} );

	}
	
	var loadFile = function( path, respType ){

		THREE.Cache.enabled = false;
		THREE.Cache.clear();

		var loader = new THREE.FileLoader();
		loader.setRequestHeader( { 'Cache-Control': 'no-cache, no-store, must-revalidate', 'Pragma': 'no-cache', 'Expires': 0 } );
		loader.setResponseType( respType );

		loader.load(

		    // resource URL
		    path,

		    // Function when resource is loaded
		    function ( data ) {

				fileLoaded( data );
		    
		    },

		    // Function called when download progresses
		    function ( xhr ) {

				postMessage( { status : 'progressing', body : { progress : Math.round( ( xhr.loaded / xhr.total * 100 ) ) } } );

		    },

		    // Function called when download errors
		    function ( xhr ) {

		        console.error( 'An error happened' );

		    }

		);

	}

	/**
	 * onmessage() - WebWorker message receiver 
	 * @param - e - object - e.data includes { downloadPath : string, respType : string }
	 * @param - downloadPath - string - exact path from which file shold be downloaded
	 * @param - respType - string - expected response type
	 */
	onmessage = function( e ){

		var downloadPath = e.data.downloadPath;
		var respType = e.data.respType;
		loadFile( downloadPath, respType );

	}