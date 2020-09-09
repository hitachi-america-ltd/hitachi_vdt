app.controller('sharectrl', function($scope, $http, $location, $rootScope, StorageService,configFactory) {
   
    $(document).ready(function() {

        var sharedUrl =  $rootScope.uploadurl;
        $rootScope.uploadurl ="";
        var id = sharedUrl.substring( sharedUrl.lastIndexOf('/') + 1 );
        $rootScope.share = 0;
        var urlRequest = null;
        editor.loader.loadSharedUrl( id );
        
        //Bug fix : shared url not working for logged out users
        fromSharedUrl = false;

    } );

} );