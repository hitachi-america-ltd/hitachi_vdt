importScripts( "../3d/three.js" );
importScripts( "../3d/MTLLoader.js" );
importScripts( "../3d/loaders/OBJLoader2.js" );
importScripts( "../jsonpatch/json-patch-duplex.min.js" );
//importScripts( "../jsonpatch/fast-json-patch.js" );
importScripts( "../3d/libs/jszip.min.js" );
importScripts( "../../mainconfig.js" );
importScripts( "../3d/ApiHandler.js" );
 
	var config = new mainconfig();
	var httpRequest = new XMLHttpRequest();
	var jsonArray = [], NUMBER_PRECISION = 6, progressValue = 0;
	const MAX_DIFF = 1000;
	var createPatch = function( json1, json2 ){
		
		return new Promise(function( resolve, reject ){
			
			try{
				
				var diffs = jsonpatch.compare( json1, json2 );
				resolve( diffs );
			
			}
			catch( exception ){
				
				reject( exception );
				
			}
			
		});
		
	}
	
	var arrayBufferToString = function( buf ) {
		
		return new Promise( function( resolve, reject ){
			
			try{
				
				var str = String.fromCharCode.apply( null, new Uint16Array(buf) );
				resolve( str );
				
			}
			catch( exception ){
				
				reject( exception );
				
			}
			
		} );
	  
	}
	function stringToArrayBuffer( str ) {
		
		return new Promise( function( resolve, reject ){
	  
			try{
				
				var buf = new ArrayBuffer( str.length * 2 ); // 2 bytes for each char
				var bufView = new Uint16Array( buf );
				
				for ( var i=0, strLen = str.length; i < strLen; i++ ) {
					
					bufView[i] = str.charCodeAt(i);
					
				}
				resolve( buf );
				
			}
			catch(exception){
				
				reject(exception);
				
			}
			
		} );
		
	}

	function parseNumber( key, value ) {

		return typeof value === 'number' ? parseFloat( value.toFixed( NUMBER_PRECISION ) ) : value;

	}

	var CustomBlobBuilder = function() {

	  this.parts = [];

	}

	CustomBlobBuilder.prototype.append = function( part ) {

		this.parts.push(part);
		this.blob = undefined; // Invalidate the blob

	};

	CustomBlobBuilder.prototype.getBlob = function() {

    	if (!this.blob) {

        	this.blob = new Blob( this.parts, { type: "text/plain" } );

  		}
  		return this.blob;

	};

	var generateZip = function( blob, fileName ){

		return new Promise( function( resolve, reject ){

			var zip = new JSZip();
			zip.file( fileName + '.json', blob );

			zip.generateAsync( { type: 'blob', compression: 'DEFLATE' } )
			.then( function( zipFile ){ 

				resolve( zipFile ); 
			
			}, function( error ){ 

				reject( error );

			} )
			.catch( function(error){

				reject( error );

			} );

		} );

	}

	var sendDataAsFile = function( blob, jsonData, reqURL ){

		return new Promise( function( resolve, reject ){
			
			var projectName = jsonData.project;

			jsonData = JSON.stringify( jsonData );
			generateZip( blob, projectName ).then( function( zipFile ){

				var data = new FormData();
				data.append( "file", zipFile );
				data.append( 'data', jsonData );

				/*var xhr = new XMLHttpRequest();
				//xhr.withCredentials = true;

				xhr.addEventListener( "readystatechange", function () {
					
				    if( this.readyState === 4 ){

						resolve( "Done" );
					
				    }
					
				} );
				
				xhr.open( "POST", reqURL + projectName );
				xhr.send( data );*/
				
				var sendProjectData = new ApiHandler();
				sendProjectData.prepareRequest( {
					method: 'POST',  
					url: reqURL + projectName,
					responseType : 'json',
					isDownload : false,
					formDataNeeded: true, 
					formData: data
				} );
				sendProjectData.onStateChange( function( response ){
					
					resolve( "Done" );
					
				}, function( error ){
					
					console.log( error );
					reject( error );
					
				} );
				
				//Progress trackers for the http request
				sendProjectData.setProgressTrackers( function( info ){

					progressValue = Math.round( 50 + ( info.progress / 2 ) );
					postMessage( { status : "progressing", body : { progress : progressValue } } );
					
				}, function( info ){

					if( info.status == 500 ){
						
						console.log( "Error contacting server!" );
						reject( 'Error' );
				
					}
					
					
				} );
				
				sendProjectData.sendRequest();

			}, function( error ){

				reject( error );

			} );
			
		} );

	}
	
	var stringifyServerData = function( customBlobBuilder ){

		return new Promise( function( resolve, reject ){
			
			try{

				customBlobBuilder.append( "\n}" );
				var blob = customBlobBuilder.getBlob();
				resolve( blob );

			}
			catch( exception ){
				
				reject( exception );
				
			}
			
		} );
		
	}
	
	var stringifyData = function( data ){
		
		return new Promise( function( resolve, reject ){
			
			try{
				
				//var str = JSON.stringify( data, parseNumber, '\t' );
				var str = JSON.stringify( data );
				//uncomment the following line if json formatting is needed.
				//str = str.replace( /[\n\t]+([\d\.e\-\[\]]+)/g, '$1' );
				resolve( str );
				
			}
			catch( exception ){
				
				reject( exception );
				
			}
			
		} );
		
	}
	
	var prepareJsonFile = function( json ){
	
		return new Promise( function( resolve, reject ){
			
			console.time( 'Save process' );
			var i = 0;
			var customBlobBuilder = new CustomBlobBuilder();
			customBlobBuilder.append( "{" );
			try{
				
				var keysArray = Object.keys( json );
				
				function executeLoop( err, array ) {

					var processedData = [];
					delayedLoop( array, function( err, key, next ) {

						//console.log( key );
						progressValue += 5;
						postMessage( { status : "progressing", body : { progress : progressValue } } );
						
						stringifyData( json[ key ] ).then( function( str ){

							if( i == 0 ){

								var keyValue = '\n"' + key + '" : ' + str;

							}
							else{
								
								var keyValue = ',\n"' + key + '" : ' + str;
							
							}
							
							//processedData.push( keyValue );
							customBlobBuilder.append( keyValue );
							i++;
							next(); // this will call recur inside delayedLoop function
						
						}, function( error ){

							console.log( error );
							return;

						} );

						//next(); // this will call recur inside delayedLoop function

					}, function() {

						try{
							customBlobBuilder.append( "\n}" );
							var blob = customBlobBuilder.getBlob();
							resolve( blob );
						}
						catch( exception ){
							reject( exception );
						}
	
					});

				}

				function delayedLoop( array, callback, finish ) {

					var copy = array.slice();
					(function recur() {

						var item = copy.shift();
						if (item) {

							callback( null, item, recur );

						} else {

							if ( typeof finish == 'function' ) { 

								finish();

							}

						}

					} )();
					
				}
				executeLoop( null, keysArray );
				
			}
			catch( exception ){
				
				reject( exception );
				
			}
			
		} );
	}

	var preparePatchJsonFile = function( json ){
		
		return new Promise( function( resolve, reject ){
			
			console.time( 'Save process' );
			var i = 0;
			var customBlobBuilder = new CustomBlobBuilder();
			customBlobBuilder.append( "[" );
			try{
				
				var keysArray = Object.keys( json );
				
				function executeLoop( err, array ) {

					var processedData = [];
					delayedLoop( array, function( err, key, next ) {

						//console.log( key );
						stringifyData( json[ key ] ).then( function( str ){

							if( i == 0 ){

								var keyValue = '\n' + str;

							}
							else{
								
								var keyValue = ',\n' + str;
							
							}
							
							//processedData.push( keyValue );
							customBlobBuilder.append( keyValue );
							i++;
							next(); // this will call recur inside delayedLoop function
						
						}, function( error ){

							console.log( error );
							return;

						} );

						//next(); // this will call recur inside delayedLoop function

					}, function() {

						try{
							customBlobBuilder.append( "\n]" );
							var blob = customBlobBuilder.getBlob();
							progressValue = 50;
							postMessage( { status : "progressing", body : { progress : progressValue } } );
							resolve( blob );
						}
						catch( exception ){
							reject( exception );
						}
	
					});

				}

				function delayedLoop( array, callback, finish ) {

					var copy = array.slice();
					(function recur() {

						var item = copy.shift();
						if (item) {

							callback( null, item, recur );

						} else {

							if ( typeof finish == 'function' ) { 

								finish();

							}

						}

					} )();
					
				}

				progressValue = 25;
				postMessage( { status : "progressing", body : { progress : progressValue } } );
				executeLoop( null, keysArray );
				
			}
			catch( exception ){
				
				reject( exception );
				
			}
			
		} );
	}

	var uploadAndSaveEntireJSON = function( data ){

		prepareJsonFile( data.newData ).then( function( blob ){
				
			var jsn = { project : data.projectDetails._id };
			if( data.imageList != undefined ){

				jsn.imageList = data.imageList;

			}
			progressValue = 50;
			postMessage( { status : "progressing", body : { progress : progressValue } } );
			sendDataAsFile( blob, jsn, config.api + "projects3d/saves/" ).then( function( success ){

				console.timeEnd( 'Save process' );
				postMessage( { status : 200, body: { message : success } } );
				close();//Terminate the WebWorker
				
			}, function( error ){
				
				//reject( error );
				postMessage( { status : 500, body: { message : error } } );
				close();//Terminate the WebWorker
				
			} );
			console.timeEnd("prepareJsonFile");
			
		},
		function( exception ){
			
			console.log( exception );
			postMessage( { status : 500, body: { message : exception } } );
			close();//Terminate the WebWorker
			
		});

	}

	onmessage = function( e ){

		if( e.data.oldData === undefined ){

			progressValue = 0;
			console.time("prepareJsonFile");

			uploadAndSaveEntireJSON( e.data );
			
		}
		else{

			//var reqURL = "http://localhost:8000/api/projects3d/updates/";
			progressValue = 0;
			createPatch( e.data.oldData, e.data.newData )
			.then(function( diffs ){

				if( diffs.length > MAX_DIFF ){

					uploadAndSaveEntireJSON( e.data );
				
				}
				else{
					
					preparePatchJsonFile( diffs )
					.then( function( blob ){
						
						var jsn = { project : e.data.projectDetails._id };
						if( e.data.imageList != undefined ){
							
							jsn.imageList = e.data.imageList;
		
						}
						sendDataAsFile( blob, jsn, config.api + "projects3d/updates/" ).then( function( success ){
							
							console.timeEnd( 'Save process' );
							postMessage( { status : 200, body: { message : success } } );
							close();//Terminate the WebWorker
							
						}, function( error ){
							
							//reject( error );
							postMessage( { status : 500, body: { message : error } } );
							close();//Terminate the WebWorker
							
						} );
						console.timeEnd("prepareJsonFile");
											
					},
					function( exception ){
						
						console.log( exception );
						postMessage( { status : 500, body: { message : exception } } );
						close();//Terminate the WebWorker
						
					} );

				}
				
			},
			function( exception ){
				
				console.log( exception );
				postMessage( { status : 500, body: { message : exception } } );
				close();//Terminate the WebWorker
				
			} );
			
		}
		
	}