
/**
 * ReportComponent( editor ) - Constructor function for report generation
 * @constructor
 * @param {any} editor - The instance of the Editor which manages the overall objects and signals
 * @author Mavelil
 * @returns {void}
 * @example <caption>Example usage of ReportComponent</caption>
 * var reportComponent = new ReportComponent( editor );
 */
var ReportComponent  = function ( editor ){
	
	this.editor = editor;
	this.refarray = [];
	this.refLine = [];	
	
}
ReportComponent.prototype = {
	
	
	/**
     * createNewRender() - Method to create a new instance of WebGL Renderer.
     * @returns {Object<THREE.WebGLRenderer>} - Newly created WebGLRenderer instance
     * @author Mavelil
     * @example <caption>Example usage of createNewRender method.</caption>
     * reportComponent.createNewRender( );
     */

	createNewRender : function(){
		
		this.renderer = new THREE.WebGLRenderer({
			
            antialias: true
			
        });
		return  this.renderer
	},
	
	/**
     * destroyRender() - Method to dispose instance of WebGL Renderer.
     * @returns {void>}
     * @author Mavelil
     * @example <caption>Example usage of destroyRender method.</caption>
     * reportComponent.destroyRender( );
     */

	destroyRender : function(){
		
		 this.renderer.dispose();
	},
	
	/**
     * getAllCamera() - Method to return the list of all cameras in the scene.
     * @returns {Array} - An array of all the cameras in the scene
     * @author Mavelil
     * @example <caption>Example usage of getAllCamera method.</caption>
     * reportComponent.getAllCamera( );
     */

	getAllCamera : function(){
		
		this.cameraListArray = [];	
		this.editor.scene.traverse((child) => {
			
            if (child.type === 'PerspectiveCamera') {
				
                this.cameraListArray.push(child)
            }
        });
		return this.cameraListArray;
		
	},
	
	/**
     * addClassToElement( id , classNameToAdd ) - Method to assing a CSS Class name to a particular element with specified ID.
	 * @param {String} id - ID of the DOM element to which the class has to be assigned
	 * @param {String} classNameToAdd - Class name that must be assigned
     * @returns {Void}
     * @author Mavelil
     * @example <caption>Example usage of addClassToElement method.</caption>
     * reportComponent.addClassToElement( id , classNameToAdd );
     */

	addClassToElement: function( id , classNameToAdd){
		
		document.getElementById(id).className += classNameToAdd;
		
	},

	/**
     * removeClassFromElement( id , classNameToAdd ) - Method to remove a CSS Class name for a particular element.
	 * @param {String} id - ID of the DOM element from which the class has to be removed
	 * @param {String} classNameToAdd - Class name that must be removed
     * @returns {Void}
     * @author Mavelil
     * @example <caption>Example usage of removeClassFromElement method.</caption>
     * reportComponent.removeClassFromElement( id , classNameToAdd );
     */

	removeClassFromElement  : function ( id , classNameToRemove ) {
		
		document.getElementById(id).classList.remove( classNameToRemove );
	},

	/**
     * hideAllReferencePoint( ) - Method to hide all the reference points in the scenes.
	 * @returns {Void}
     * @author Mavelil
     * @example <caption>Example usage of hideAllReferencePoint method.</caption>
     * reportComponent.hideAllReferencePoint( );
     */

	hideAllReferencePoint : function (){
		
		this.refarray = [];
		this.refLine = [];
        this.editor.scene.traverse((child) => {
            if (child.camerauuid != undefined) {
				
				if( child.userData.lineUUID && child.userData.checkLOSFlag == "set" ){

					var lineUiD = child.userData.lineUUID;
					var line = editor.scene.getObjectByProperty( 'uuid', lineUiD );
					
					if( line.visible == true ){

						line.visible = false;
						this.refLine.push( line );
					}

				}
                this.refarray.push(child);
				child.visible = false;
				
            }

        });
	},

	/**
     * showAllReferencePoint( ) - Method to show all the reference points.
	 * @returns {Void}
     * @author Mavelil
     * @example <caption>Example usage of showAllReferencePoint method.</caption>
     * reportComponent.showAllReferencePoint( );
     */

	showAllReferencePoint : function(){

		if( this.refarray == undefined ){
			this.refarray = [];
			this.editor.scene.traverse((child) => {
	            if (child.camerauuid != undefined) {
	                          
	                this.refarray.push(child);
	                child.visible = true;
	            }

        	});
		}
		
		for (var i = 0; i < this.refarray.length; i++) {
			
            this.refarray[i].visible = true;
		}

		for( i=0;i < this.refLine.length; i++ ){

			var line = this.refLine[i];
			line.visible = true;

		}

            
	},

	/**
     * showOnlyModel( ) - Method to hide all except the model.
	 * @returns {Void}
     * @author Mavelil
     * @example <caption>Example usage of showOnlyModel method.</caption>
     * reportComponent.showOnlyModel( );
     */

	showOnlyModel : function(){
		
		this.editor.pointOfinterestObject.hideAllPointOfIntrest();
        this.editor.hideAreaMeasurements();
        this.editor.hideLengthMeasurements();
		this.hideAllReferencePoint();
		this.hideAllNetworkCable()
		
		
	},
	
	/**
     * hideAllCameraInArray( cameraListArray ) - Method to hide all the cameras in the scene.
	 * @param {Array} cameraListArray - An array that contains the list of all cameras in the scene 
	 * @returns {Void}
     * @author Mavelil
     * @example <caption>Example usage of hideAllCameraInArray method.</caption>
     * reportComponent.hideAllCameraInArray( cameraListArray );
     */

	hideAllCameraInArray : function( cameraListArray ){
		
		for (var i = 0; i < cameraListArray.length; i++) {
			cameraListArray[i].visible = false;
        }
		
	},

	/**
     * showALlcameraInArray( cameraListArray ) - Method to show all the cameras in the scene.
	 * @param {Array} cameraListArray - An array that contains the list of all cameras.
	 * @returns {Void}
     * @author Mavelil
     * @example <caption>Example usage of showALlcameraInArray method.</caption>
     * reportComponent.showALlcameraInArray( cameraListArray );
     */

	showALlcameraInArray : function( cameraListArray ){
		
		for (var i = 0; i < cameraListArray.length; i++) {
			
            cameraListArray[i].visible = true;
        }
	},

	/**
     * setRenderSize( width , height ) - Method to set size for the renderer.
	 * @param {Number} width - width to be set for the renderer.
	 * @param {Number} height - height to be set for the renderer.
	 * @returns {Void}
     * @author Mavelil
     * @example <caption>Example usage of setRenderSize method.</caption>
     * reportComponent.setRenderSize( width , height );
     */

	setRenderSize : function( width , height){
		
		this.renderer.setSize(width,height)
	},

	/**
     * reportCameraPosition( camera, vector ) - Method to set position for the camera.
	 * @param {Object<THREE.PerspectiveCamera>} camera - camera for which position needs to be set.
	 * @param {Object<THREE.Vector3>} vector - the position to be set for the camera.
	 * @returns {Void}
     * @author Mavelil
     * @example <caption>Example usage of reportCameraPosition method.</caption>
     * reportComponent.reportCameraPosition( camera, vector );
     */

	reportCameraPosition : function( camera, vector ){
		
		this.editor.execute( new SetPositionCommand( camera, vector ));
	},

	/**
     * reportCameraRotation( camera, Euler ) - Method to set rotation for the camera.
	 * @param {Object<THREE.PerspectiveCamera>} camera - camera for which rotation needs to be set.
	 * @param {Object<THREE.Euler>} vector - the rotation to be set for the camera.
	 * @returns {Void}
     * @author Mavelil
     * @example <caption>Example usage of reportCameraRotation method.</caption>
     * reportComponent.reportCameraRotation( camera, Euler );
     */

	reportCameraRotation : function( camera, Euler  ){
		
		this.editor.execute( new SetRotationCommand( camera, Euler ));	
	},

	/**
     * render( scene, camera ) - Method to render the scene.
	 * @param {Object<THREE.Scene>} scene - Scene that has to be rendered.
	 * @param {Object<THREE.PerspectiveCamera>} camera - The camera used for rendering.
	 * @returns {Void}
     * @author Mavelil
     * @example <caption>Example usage of render method.</caption>
     * reportComponent.render( scene, camera );
     */

	render : function( scene , camera ){
		
		this.renderer.render(scene, camera);
	},
	getUrlFromrender : function(){
		
		return this.renderer.domElement.toDataURL().replace("image/png", "image/octet-stream");
	},
	
	dataURItoBlobSnapshot : function (dataURI, type,){
		
		var byteString = atob(dataURI.split(',')[1]);
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        var file = new Blob([ab], {
            type: type
        });
		
		return file;
	},

	/**
     * addHelperToEditor( cameraListArray ) - Method to return the list of all camera helpers.
	 * @param {Array} cameraListArray - An array that contains the list of all cameras.
	 * @returns {Array} - An array containing list of all camera helpers
     * @author Mavelil
     * @example <caption>Example usage of addHelperToEditor method.</caption>
     * reportComponent.addHelperToEditor( cameraListArray );
     */

	addHelperToEditor: function(  cameraListArray ){
		
		
		this.cameraHelperArray = [];
		for (var i = 0; i < cameraListArray.length; i++) {

			var helper = new THREE.CameraHelper(cameraListArray[i], new THREE.Color(cameraListArray[i].helperColor));
            this.editor.execute(new AddObjectCommand(helper));
            this.cameraHelperArray.push(helper);

        }
		return ( this.cameraHelperArray )
		
	},

	/**
     * removeCameraHelperFromEditor( cameraListArray ) - Method to remove all the camera helpers from the scene.
	 * @param {Array} cameraListArray - An array that contains the list of all cameras.
	 * @returns {Void}
     * @author Mavelil
     * @example <caption>Example usage of removeCameraHelperFromEditor method.</caption>
     * reportComponent.removeCameraHelperFromEditor( cameraListArray );
     */

	removeCameraHelperFromEditor : function( cameraHelperArray ){
		
	
		for (var i = 0; i < cameraHelperArray.length; i++) {

            this.editor.execute(new RemoveObjectCommand(cameraHelperArray[i]));

        }
	},

	/**
     * showAllPointOfIntrest( ) - Method to show all the point of interest.
	 * @returns {Void}
     * @author Mavelil
     * @example <caption>Example usage of showAllPointOfIntrest method.</caption>
     * reportComponent.showAllPointOfIntrest( );
     */

	showAllPointOfIntrest  : function(){
		
		this.editor.pointOfinterestObject.ShowAllPointOfIntrest();
	},

	/**
     * hideAllPointOfIntrest( ) - Method to hide all the point of interests in the scene.
	 * @returns {Void}
     * @author Mavelil
     * @example <caption>Example usage of hideAllPointOfIntrest method.</caption>
     * reportComponent.hideAllPointOfIntrest( );
     */

	hideAllPointOfIntrest : function (){
		
		this.editor.pointOfinterestObject.hideAllPointOfIntrest();
	},

	/**
     * showAllLengthMeasurement( ) - Method to show all the length measurements.
	 * @returns {Void}
     * @author Mavelil
     * @example <caption>Example usage of showAllLengthMeasurement method.</caption>
     * reportComponent.showAllLengthMeasurement( );
     */

	showAllLengthMeasurement  : function(){
		
		this.editor.showLengthMeasurements();
	},

	/**
     * hideAllLengthMeasurement( ) - Method to hide all the length measurements in the scene.
	 * @returns {Void}
     * @author Mavelil
     * @example <caption>Example usage of hideAllLengthMeasurement method.</caption>
     * reportComponent.hideAllLengthMeasurement( );
     */

	hideAllLengthMeasurement : function (){
		
		this.editor.hideLengthMeasurements()
	},

	/**
     * showAllAreaMesurement( ) - Method to show all the area measurements.
	 * @returns {Void}
     * @author Mavelil
     * @example <caption>Example usage of showAllAreaMesurement method.</caption>
     * reportComponent.showAllAreaMesurement( );
     */

	showAllAreaMesurement : function(){
		
		this.editor.showAreaMeasurements();
	},

	/**
     * hideAllAreaMeasurement( ) - Method to hide all the area measurements in the scene.
	 * @returns {Void}
     * @author Mavelil
     * @example <caption>Example usage of hideAllAreaMeasurement method.</caption>
     * reportComponent.hideAllAreaMeasurement( );
     */

	hideAllAreaMeasurement : function(){
		
		this.editor.hideAreaMeasurements();
		
	},

	/**
     * showAll2DDrawings( ) - Method to show all the 2D Drawings.
	 * @returns {Void}
     * @author Mavelil
     * @example <caption>Example usage of showAll2DDrawings method.</caption>
     * reportComponent.showAll2DDrawings( );
     */

	showAll2DDrawings : function(){
		
		this.editor.show2DLineDrawings();
	},

	/**
     * hideAll2DDrawings( ) - Method to hide all the 2D Drawings in the scene.
	 * @returns {Void}
     * @author Mavelil
     * @example <caption>Example usage of hideAll2DDrawings method.</caption>
     * reportComponent.hideAll2DDrawings( );
     */

	hideAll2DDrawings : function(){
		
		this.editor.hide2DLineDrawings();
		
	},

	/**
     * showProgress( ) - Method to show the progress bar while generating report.
	 * @returns {Void}
     * @author Mavelil
     * @example <caption>Example usage of showProgress method.</caption>
     * reportComponent.showProgress( );
     */

	showProgress : function(){
		
		this.editor.progressBar.show();
	},

	/**
     * updateProgress( label , number ) - Method to update the progress in the progress bar while generating report.
	 * @param {String} label - The string to be displayed in the progress bar.
	 * @param {Number} number - The progress percentage.
	 * @returns {Void}
     * @author Mavelil
     * @example <caption>Example usage of updateProgress method.</caption>
     * reportComponent.updateProgress( label , number );
     */

	updateProgress : function( label , number){
		
		this.editor.progressBar.updateProgress(label, number);
	},

	/**
     * hideProgress( ) - Method to hide the progress bar.
	 * @returns {Void}
     * @author Mavelil
     * @example <caption>Example usage of hideProgress method.</caption>
     * reportComponent.hideProgress( );
     */

	hideProgress : function(){
		
		this.editor.progressBar.hide(); 
	},

	/**
     * showAllNetwoekCable( ) - Method to show all the network cables.
	 * @returns {Void}
     * @author Mavelil
     * @example <caption>Example usage of showAllNetwoekCable method.</caption>
     * reportComponent.showAllNetwoekCable( );
     */

	showAllNetwoekCable : function () {
		
		this.editor.showNetworkingCables()
	},

	/**
     * hideAllNetworkCable( ) - Method to hide all the network cables in the scene.
	 * @returns {Void}
     * @author Mavelil
     * @example <caption>Example usage of hideAllNetworkCable method.</caption>
     * reportComponent.hideAllNetworkCable( );
     */

	hideAllNetworkCable : function () {
		
		this.editor.hideNetworkingCables();
	}
	
	
	
	
	
	
}
