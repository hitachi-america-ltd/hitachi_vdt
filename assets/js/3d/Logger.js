/**
 * Logger( editor ) : Constructor for activity logging feature
 * @constructor
 * @returns {Object}
 * @author Hari
 * @example <caption>Example usage of Logger</caption>
 * var logger = new Logger( editor );
 */

var Logger = function(){

    var scope = this;
    
    this.apiPath = "";
    this.reqUrl = "logs/";
    this.userActivities = {};
    this.reqHandler;

    return this;

}

Logger.prototype = {

    constructor : Logger,

    /**
     * setReqPath( path ) - Method to set the API path
     * @param {String} path - API path
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of setReqPath method.</caption>
     * logger.setReqPath( path );
     */

    setReqPath : function( path ){

        this.apiPath = path;

    },

    /**
     * addLog( userLogs ) - Method to store user activity logs
     * @param {Object} userLogs - user actitity logs
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of addLog method.</caption>
     * logger.addLog( userLogs );
     */

    addLog : function( userLogs ){

        var scope = this;
        //if( this.userActivities.userId === undefined ) this.userActivities.userId = localStorage.getItem( 'U_ID' );
        this.userActivities = {};
        for( var timeStamp in userLogs ){

            this.userActivities[ timeStamp ] = userLogs[ timeStamp ];

        }
        
    },

    /**
     * sendLogs( userId ) - Method to send logs to the server
     * @param {String} userId - user UUID
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of sendLogs method.</caption>
     * logger.sendLogs( userId );
     */

    sendLogs : function( userId ){

        var scope = this;

        var reqData = new FormData();
        reqData.append( 'data', JSON.stringify( { "userId" : userId, "activities": this.userActivities } ) );
        
        this.reqHandler = new ApiHandler();

        this.reqHandler.onStateChange(
            
            function successCallback( response ){

                if( response.status === 200 ){

                    this.userActivities = {};
                    //console.log( "Successfully updated the user logs" );

                }

            },
            
            function failureCallback(error) {

                console.log( error );
                //toastr.error("Sorry something went wrong.\nPlease try again after some time");

            }
        
        );

        this.reqHandler.onError( function errorCallback( message ){

            console.log( message );

        } );

        this.reqHandler.setProgressTrackers(
            
            function( info ){
            
            },
            
            function( info ){

                if ( info.status == 500 ){

                    console.log( "Error contacting server!" );

                }

            }
        );

        this.reqHandler.prepareRequest( {

            method: 'POST',
            url: scope.apiPath + scope.reqUrl,
            responseType: 'json',
            isDownload: false,
            formDataNeeded: true,
            formData: reqData

        } );

        this.reqHandler.sendRequest();

    },

}