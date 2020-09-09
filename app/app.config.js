(function(){
    angular
        .module('myApp')
		.factory('settingsFactory', settingsFactory)
        .factory('configFactory', configFactory);
		var Settings = {};
    // 'old' will use the existing API. 'new' will use the latest, restructured API.

	// Mode to work with. Valid values are 'dev' and 'prod'.
	Settings.mode = "prod";
    
   // function settingsFactory() {
   // 	return Settings;
   // }		
	function settingsFactory() {
    	return Settings;
    }	
    
    function configFactory(settingsFactory) {
        var Config = {};
		Config.strings = getStringsData(settingsFactory);
	    return Config;
    }
	
	function getStringsData(settingsFactory){		
		var response = "";
		$.ajax({
			url : "assets/strings.json",
			type : "GET",
			async: false,
			success : function(data) {				
				if (data != null && angular.isObject(data)) {
					if(settingsFactory.mode == "uat")
					response = data.uat;
					
					else if(settingsFactory.mode == "prod")
					response = data.prod;

					else if(settingsFactory.mode == "dev")
					response = data.dev;
				}
			},
			error: function() {}
		});
		return response;
	}

})();