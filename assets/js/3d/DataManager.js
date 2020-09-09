/**
 * @author Hitachi
 */

var DataManager = function () {

	var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

	if ( indexedDB === undefined  ) {

		console.warn( 'Storage: IndexedDB not available.' );
		return { init: function () {}, get: function () {}, set: function () {}, clear: function () {} };

	}

	var name = '3D_editor_local_files';
	var version, database;
	var versionValue = localStorage.getItem( 'editor-db-version' );
	if( versionValue != null && versionValue != undefined && Number( versionValue ) != 0 ){
		version = Number( versionValue );
	}
	else{
		version = 1;
	}

	return {

		init: function ( callback ) {

			//version++;
			var request = indexedDB.open( name, version );

			request.onupgradeneeded = function ( event ){

				console.log( 'Indexed DB upgrade needed! Reopening to make the changes' );
				var db = event.target.result;

				/*Modified to set project info in indexedDB according to project name START*/
				if( db.objectStoreNames.contains( localStorage.getItem( 'U_ID' ) ) === false ){
					
					db.createObjectStore( localStorage.getItem( 'U_ID' ) );

				}
				/*Modified to set project info in indexedDB according to project name END*/

			};
			request.onsuccess = function ( event ) {

				database = event.target.result;

				callback();

			};
			request.onerror = function ( event ) {

				//console.error( 'IndexedDB', event );

			};


		},

		get: function ( callback ) {

			/*Modified to set project info in indexedDB according to project name START*/
			var transaction = database.transaction( [ localStorage.getItem( 'U_ID' ) ], 'readwrite' );
			var objectStore = transaction.objectStore( localStorage.getItem( 'U_ID' ) );
			var request = objectStore.get( localStorage.getItem( "project3d" ) );
			/*Modified to set project info in indexedDB according to project name END*/
			
			request.onsuccess = function ( event ) {

				callback( event.target.result );

			};

		},

		/*MODIFIED TO GET THE INDEX NAMES IN THE OBJECT STORES START*/

		getProjectData: function ( projectName, callback ) {

			var scope = this;
			var transaction, objectStore, request;

			try{

			transaction = database.transaction( [ localStorage.getItem( 'U_ID' ) ], 'readwrite' );
			objectStore = transaction.objectStore( localStorage.getItem( 'U_ID' ) );
			request = objectStore.get( projectName );

			}
			catch( err ){

				console.warn( '---------->DataManger Warning!---------->' );
				console.warn( err );
				
				version++;
				localStorage.setItem( 'editor-db-version', version );
				scope.close();
				callback( false );
				return;

			}
			request.onsuccess = function ( event ) {

				callback( event.target.result );

			};

		},

		getAllIndexes: function ( callback ) {
			
			var transaction = database.transaction( [ localStorage.getItem( 'U_ID' ) ], 'readwrite' );
			var objectStore = transaction.objectStore( localStorage.getItem( 'U_ID' ) );
			
			var request = objectStore.getAllKeys();
			
			request.onsuccess = function ( event ) {

				callback( event.target.result );

			};
			console.log( request );

		},

		setProjectData: function ( projectName, data, callback ) {
			
			var scope = this;
			var start = performance.now();
			var transaction, objectStore, request;

			/*Modified to set project info in indexedDB according to project name START*/
			try{
				
				transaction = database.transaction( [ localStorage.getItem( 'U_ID' ) ], 'readwrite' );
				objectStore = transaction.objectStore( localStorage.getItem( 'U_ID' ) );
				request = objectStore.put( data, projectName );
			
			}
			catch( err ){

				console.warn( '---------->DataManger Warning!---------->' );
				console.warn( err );
				version++;
				localStorage.setItem( 'editor-db-version', version );
				scope.close();
				if( callback ){

					callback( false );
					return;

				}

			}
			/*Modified to set project info in indexedDB according to project name END*/

			request.onsuccess = function ( event ) {

				console.log( 'Successfully recovered from DB errors :)' );
				console.log( '[' + /\d\d\:\d\d\:\d\d/.exec( new Date() )[ 0 ] + ']', 'Saved state to IndexedDB. ' + ( performance.now() - start ).toFixed( 2 ) + 'ms' );
				if( callback ){

					callback();

				}

			};
			request.onerror = function( event ){

				console.log( event );
				if( callback ){
					callback();
				}

			}

		},

		clearProjectData: function ( projectName, callback ) {

			if ( database === undefined ) return;

			//MODIFIED TO AVOID THE ERROR DUE TO NON EXISTING OBJECTSTORE START
			var scope = this;
			var start = performance.now();
			var transaction, objectStore, request;
			//MODIFIED TO AVOID THE ERROR DUE TO NON EXISTING OBJECTSTORE END
			
			try{

				transaction = database.transaction( [ localStorage.getItem( 'U_ID' ) ], 'readwrite' );
				objectStore = transaction.objectStore( localStorage.getItem( 'U_ID' ) );

				request = objectStore.delete( projectName );

			}
			catch( err ){

				console.warn( '---------->DataManger Warning!---------->' );
				console.warn( err );
				version++;
				localStorage.setItem( 'editor-db-version', version );
				scope.close();
				if( callback ){

					callback( false );
					return;

				}

			}

			request.onsuccess = function ( event ) {

				console.log( '[' + /\d\d\:\d\d\:\d\d/.exec( new Date() )[ 0 ] + ']', 'Cleared' + projectName + 'IndexedDB.' );
				callback();

			};

		},

		/*MODIFIED TO GET THE INDEX NAMES IN THE OBJECT STORES END*/
		
		set: function ( data, callback ) {

			var start = performance.now();

			/*Modified to set project info in indexedDB according to project name START*/
			var transaction = database.transaction( [ localStorage.getItem( 'U_ID' ) ], 'readwrite' );
			var objectStore = transaction.objectStore( localStorage.getItem( 'U_ID' ) );
			var request = objectStore.put( data, localStorage.getItem( "project3d" ) );
			/*Modified to set project info in indexedDB according to project name END*/

			request.onsuccess = function ( event ) {

				console.log( '[' + /\d\d\:\d\d\:\d\d/.exec( new Date() )[ 0 ] + ']', 'Saved state to IndexedDB. ' + ( performance.now() - start ).toFixed( 2 ) + 'ms' );

			};

		},

		clear: function () {

			/*Modified to set project info in indexedDB according to project name START*/
			if ( database === undefined ) return;
			
			var transaction = database.transaction( [ localStorage.getItem( 'U_ID' ) ], 'readwrite' );
			var objectStore = transaction.objectStore( localStorage.getItem( 'U_ID' ) );
			var request = objectStore.clear();
			request.onsuccess = function ( event ) {

				console.log( '[' + /\d\d\:\d\d\:\d\d/.exec( new Date() )[ 0 ] + ']', 'Cleared IndexedDB.' );

			};
			/*Modified to set project info in indexedDB according to project name END*/

		},

		close: function(){

			if( database ) database.close();

		}

	};

};
