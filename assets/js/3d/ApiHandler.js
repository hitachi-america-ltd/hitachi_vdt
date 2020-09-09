/**
 * Object for handling XMLHttpRequest
 * @constructor
 * @author Hari
 */
var ApiHandler = function () {

    this.request = new XMLHttpRequest();
    this.options = {};
    this.formDataNeeded = false;
    this.formData = new FormData();
    this.fileSize = 0;
    this.fileType = "";
    this.response = {};
    this.isDownload = false;

	return this;

};

ApiHandler.prototype = {

    /**
     * ApiHandler.prototype.prepareRequest() - prepares the http request
     * @param {object} options - options for creating the http request( { method: string, url: string, responseType : string, isDownload : boolean,formDataNeeded: boolean, formData: Object(instance of FormData) } )
     * @return {void} returns void
     * @author Hari
     **/
	prepareRequest: function ( options ) {

        this.options = options;
        this.request.responseType = options.responseType;
        this.request.open( options.method, options.url );
        if( options.formDataNeeded ){

            this.formDataNeeded = true;
            this.formData = options.formData;

        }
        this.isDownload = options.isDownload;

		return;

    },

    /**
     * Send the request using the options specified with prepareRequest.
     * @return returns void
     * @author Hari
     */
	sendRequest: function (){

        var scope = this;
        if( scope.isDownload ){
            var getReqHead = new XMLHttpRequest();
            getReqHead.open('HEAD', scope.options.url, true);
            getReqHead.send();
            getReqHead.onload = function() {
                
                if ( getReqHead.status === 200 && getReqHead.readyState == 4 ) {

                    scope.fileSize = parseInt( getReqHead.getResponseHeader( "Content-Length" ) );
                    scope.fileType = getReqHead.getResponseHeader( "Content-Type" );
                    if( scope.formDataNeeded ){
                        
                        scope.request.send( scope.formData );
                        return;
            
                    }
                    scope.request.send();
                    return;
                    
                }
                else{
                    
                    console.error( getReqHead.status + " " + getReqHead.statusText );
                    return;
                    
                }
                
            };
        }
        else{
            if( scope.formDataNeeded ){
                
                scope.request.send( scope.formData );
                return;
    
            }
            scope.request.send();
            return;
        }
    },
    
    /**
     * Event listner for ready state change of the http request.
     * @param {function} successCallback - function to execute if the request succeed.
     * @param {function} failureCallback - function to execute if the request failed.
     * @return {void} returns void.
     * @author Hari
     */
	onStateChange: function ( successCallback, failureCallback ) {
        
        var scope = this;
        this.request.addEventListener( "readystatechange", function () {
			
		  if ( this.readyState === 4 ) {
			  
			if( this.status == 200 ){

                successCallback( this.response );

			}
			else{

				failureCallback( { status : this.status, message: this.statusText } );

			}
			
		  }
		  
		} );

    },

    /**
     * Tracks progress for the upload and download events of the http request.
     * @param {function} onUploadProgress - callback for the upload progress.
     * @param {function} onDownloadProgress - callback for the download progress.
     * @return {object} - returns an object { loaded : Number, total: Number, progress: Number }.
     * @author Hari
     */
    setProgressTrackers: function( onUploadProgress, onDownloadProgress ){

        var scope = this;
        var progressInfo;
        var upldProgress;
        this.request.addEventListener( "progress", function( event ){
            
            if( event.lengthComputable ){
                
                var percentComplete = ( event.loaded / event.total ) * 100;
                progressInfo = { loaded : event.loaded, total: event.total, progress: Number( percentComplete ) };
                
            } 
            else{
            
                var percentComplete = ( event.loaded / fileSize ) * 100;
                progressInfo = { loaded : event.loaded, total: event.total, progress: Number( percentComplete ) };
                
            }
            onDownloadProgress( progressInfo );
        
        } );
        this.request.upload.addEventListener( "progress", function( event ){

            upldProgress = Math.round( ( event.loaded / event.total ) * 100, 2);
            progressInfo = { loaded : event.loaded, total: event.total, progress: upldProgress };
            onUploadProgress( progressInfo );

        } );

    },

    /**
     * Event listner for failure of the request.
     * @param {function} callback - function to execute if the request failed.
     * @return {void} returns void.
     * @author Hari
     */
	onError: function ( callback ) {
        
        this.request.addEventListener( "error", function ( message ) {
			
            callback( message );
		  
		} );

    },

    /**
     * Clear the current request object.
     * @return {void} returns void.
     * @author Hari
     */
	clearRequest: function () {
        
        this.request = new XMLHttpRequest();
        this.options = {};
        this.formDataNeeded = false;
        this.formData = new FormData();
        this.fileSize = 0;
        this.fileType = "";
        this.response = {};
        this.isDownload = false;

    }

};

ApiHandler.prototype.constructor = ApiHandler;