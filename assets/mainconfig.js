var mainconfig = function(){
	
	var server = {"api":"https://h3dsp.hitachi-america.us/hitachiUAT/api/" , "apiPath": "https://h3dsp.hitachi-america.us/hvdt_api/" ,"webroot":"https://h3dsp.hitachi-america.us/", "modelPath": "https://h3dsp.hitachi-america.us/hitachiUAT/api/models/" }

	this.api = server.api;
	this.path = server.apiPath;
	this.webroot = server.webroot;
	this.modelPath = server.modelPath;
	return this;
}