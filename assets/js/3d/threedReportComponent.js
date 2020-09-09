/**
 * threedReportComponent( editor ) - Constructor function for report generation
 * @constructor
 * @param {any} editor - The instance of the Editor which manages the overall objects and signals
 * @author Mavelil
 * @returns {void}
 * @example <caption>Example usage of threedReportComponent</caption>
 * var threedReportComponent = new threedReportComponent( editor );
 */
var threedReportComponent = function( editor ){
	
	this.reportComponent  = new ReportComponent( editor);
	this.cameraListArray = [];
	this.editor = editor;
}
threedReportComponent.prototype = {
	
	/**
     * createRenderForReportCamera() - Method to create a new instance of WebGL Renderer.
     * @returns {Object<THREE.WebGLRenderer>} - Newly created WebGLRenderer instance
     * @author Mavelil
     * @example <caption>Example usage of createRenderForReportCamera method.</caption>
     * threedReportComponent.createRenderForReportCamera( );
     */

	createRenderForReportCamera : function(){
		
		this.newRender = this.reportComponent.createNewRender()
		return this.newRender;
		
	},

	/**
     * generateReportCamera() - Method to create a new camera for report generation.
     * @returns {Object<THREE.PerspectiveCamera>} - Newly created camera for report generation
     * @author Mavelil
     * @example <caption>Example usage of generateReportCamera method.</caption>
     * threedReportComponent.generateReportCamera( );
     */

	generateReportCamera : function () {
		
		this.camera = this.editor.camera.clone();
		return this.camera;
	},

	/**
     * allCameraInEditor() - Method to return the list of all cameras in the scene.
     * @returns {Array} - An array of all the cameras in the scene
     * @author Mavelil
     * @example <caption>Example usage of allCameraInEditor method.</caption>
     * threedReportComponent.allCameraInEditor( );
     */

	allCameraInEditor :function(){
		
		this.cameraListArray = this.reportComponent.getAllCamera()
		return this.cameraListArray;
	},

	/**
     * hideallCamera() - Method to hide all the cameras.
	 * @returns {Void}
     * @author Mavelil
     * @example <caption>Example usage of hideallCamera method.</caption>
     * threedReportComponent.hideallCamera( );
     */

	hideallCamera : function(){

		toastr.warning('since the camera visiblity mode is set to off, we are hiding all the cameras after generating the report')
		document.getElementById( 'hideAllCameraButton' ).click()
	},
	
	/**
     * checkImageIsAvilableInServer( data , apiUrl ) - Method to check if an image is available in server.
	 * @param {Object<JSON>} data
	 * @param {String} apiUrl
	 * @returns {Object<Promise>}
     * @author Mavelil
     * @example <caption>Example usage of checkImageIsAvilableInServer method.</caption>
     * threedReportComponent.checkImageIsAvilableInServer( data , apiUrl );
     */

	checkImageIsAvilableInServer : function( data , apiUrl){
		
		return new Promise ( function ( resolve , reject ){
				
			$.ajax({
				url: apiUrl,
				type: "POST",
				contentType: 'application/json',
				processData: false,
				data: JSON.stringify(data),
				success: function(result) {
					
					resolve( result )
				},
				error: function(err) {
					this.disposeRender();
					reject ( err )
				}
			});	
			
		})
		
		
	},
	
	/**
     * confirmAllCameraHaveSnapshot( ) - Method to confirm if all the cameras have screenshot in server.
	 * @returns {String<Promise>}
     * @author Mavelil
     * @example <caption>Example usage of confirmAllCameraHaveSnapshot method.</caption>
     * threedReportComponent.confirmAllCameraHaveSnapshot( );
     */

	confirmAllCameraHaveSnapshot : function(){
		
		return new Promise(function(resolve ,reject ){
				
			var allCameraSimulaterFlage;
			var allCameraSimulaterFlageChild = true;
			this.editor.scene.traverse((child) => {
				
				if (child.type === "PerspectiveCamera") {
					
					allCameraSimulaterFlage = false;
					var sceneUserDataKeys = Object.keys( this.editor.scene.userData.cameraList );
					for (var i = 0; i < sceneUserDataKeys.length; i++) {
						
						var cameraSnapshots = 0;
						var sensorsnaps = 0;
						if (child.uuid == sceneUserDataKeys[i]) {
							
							var datastocheak = this.editor.scene.userData.cameraList[sceneUserDataKeys[i]];
							if (datastocheak.length == 0) {
								
								allCameraSimulaterFlageChild = false;
								toastr.info(this.editor.languageData.Takethesnapshotofsimulatedviewofcamera + child.name);
								return ;

							}


							else if( ( editor.scene.userData.ReportImage && editor.scene.userData.ReportImage["Miscellaneous_Snapshots"].length > 0  ) && ( editor.scene.userData.ReportImage && editor.scene.userData.ReportImage["Smart_Sensor"].length > 0  )){
								
								for( var l = 0; l < datastocheak.length; l++ ){
									if( (editor.scene.userData.ReportImage["Miscellaneous_Snapshots"].includes( datastocheak[l].screenshotname )) ){
										cameraSnapshots++;
									}
									if( (editor.scene.userData.ReportImage["Smart_Sensor"].includes( datastocheak[l].screenshotname )) ){
										sensorsnaps++;
									}
								}
							}
							else if(  editor.scene.userData.ReportImage && editor.scene.userData.ReportImage["Miscellaneous_Snapshots"].length > 0  ){
								
								for( var l = 0; l < datastocheak.length; l++ ){
									if( (editor.scene.userData.ReportImage["Miscellaneous_Snapshots"].includes( datastocheak[l].screenshotname )) ){
										cameraSnapshots++;
									}
								}
							}
							else if( editor.scene.userData.ReportImage && editor.scene.userData.ReportImage["Smart_Sensor"].length > 0 ){
								
								for( var l = 0; l < datastocheak.length; l++ ){
									if( (editor.scene.userData.ReportImage["Smart_Sensor"].includes( datastocheak[l].screenshotname )) ){
										sensorsnaps++;
									}
								}
							}

							if( (cameraSnapshots == datastocheak.length && editor.scene.userData.ReportImage && editor.scene.userData.ReportImage["Miscellaneous_Snapshots"].length > 0 )  || (sensorsnaps == datastocheak.length && editor.scene.userData.ReportImage && editor.scene.userData.ReportImage["Smart_Sensor"].length > 0 )  ){
								allCameraSimulaterFlageChild = false;
								toastr.info(this.editor.languageData.Takethesnapshotofsimulatedviewofcamera + child.name);
								return ;
							}							
							allCameraSimulaterFlage = true;
							
						}
						if (i == sceneUserDataKeys.length - 1) {
							
							if (!allCameraSimulaterFlage) {
								allCameraSimulaterFlageChild = false;
								toastr.info(this.editor.languageData.Takethesnapshotofsimulatedviewofcamera + child.name);
								toastr.error(this.editor.languageData.Tryagainaftertakethesnapshot);
								return;
							}

						}

					}


				}

			});
			if (!allCameraSimulaterFlage) {

				reject();
			}
			if (!allCameraSimulaterFlageChild) {
				
				reject()
			}
			else {
				
				resolve ('AllCameraHaveSnapshot')
			}
			
		})

		
	},
	
	/**
     * removeDetailsOfSnaphotOfCameraFromUserData( cameraAndSnaphotDetails ) - Method to remove details of snapshot from camera.
	 * @param {Object<JSON>} cameraAndSnaphotDetails - JSON data of camera and snapshots.
	 * @returns {void}
     * @author Mavelil
     * @example <caption>Example usage of removeDetailsOfSnaphotOfCameraFromUserData method.</caption>
     * threedReportComponent.removeDetailsOfSnaphotOfCameraFromUserData( cameraAndSnaphotDetails );
     */

	removeDetailsOfSnaphotOfCameraFromUserData : function( cameraAndSnaphotDetails ){

		var cameraId = cameraAndSnaphotDetails.camera;
		
		var cameraSnapshotList = this.editor.scene.userData.cameraList[cameraId ];
        for(var j =0 ; j < cameraSnapshotList.length ;j++ ){

            if(cameraSnapshotList[j].screenshotname == cameraAndSnaphotDetails.image){

                this.editor.scene.userData.cameraList[cameraId ].splice(j, 1);
                if(editor.scene.userData.ReportImage){


                	if(editor.scene.userData.ReportImage.Top_View == cameraAndSnaphotDetails.image ){

                		editor.scene.userData.ReportImage.Top_View = null;
                	}
                	if(editor.scene.userData.ReportImage.Project_Overview == cameraAndSnaphotDetails.image ){

                		editor.scene.userData.ReportImage.Project_Overview = null;
                	}
                	if(editor.scene.userData.ReportImage.Project_Scenes_Layouts == cameraAndSnaphotDetails.image ){

                		editor.scene.userData.ReportImage.Project_Scenes_Layouts = null;
					}
					//Modified Pivot to include Front and Back view start
					if(editor.scene.userData.ReportImage.Front_View == cameraAndSnaphotDetails.image ){

                		editor.scene.userData.ReportImage.Front_View = null;
					}
					if(editor.scene.userData.ReportImage.Back_View == cameraAndSnaphotDetails.image ){

                		editor.scene.userData.ReportImage.Back_View = null;
					}
					//Modified Pivot to include Front and Back view end
                	if(editor.scene.userData.ReportImage.Left_View == cameraAndSnaphotDetails.image ){

                		editor.scene.userData.ReportImage.Left_View = null;
                	}
                	if(editor.scene.userData.ReportImage.Right_View == cameraAndSnaphotDetails.image ){

                		editor.scene.userData.ReportImage.Right_View = null;
                	}
                	if(editor.scene.userData.ReportImage.Length_Mesurement == cameraAndSnaphotDetails.image ){

                		editor.scene.userData.ReportImage.Length_Mesurement = null;
                	}
                	if(editor.scene.userData.ReportImage.Area_Mesurement == cameraAndSnaphotDetails.image ){

                		editor.scene.userData.ReportImage.Area_Mesurement = null;
                	}
                	if(editor.scene.userData.ReportImage.point_Of_Intrest == cameraAndSnaphotDetails.image ){

                		editor.scene.userData.ReportImage.point_Of_Intrest = null;
                	}
                	if(editor.scene.userData.ReportImage.Network_Cable_Mesurement == cameraAndSnaphotDetails.image ){

                		editor.scene.userData.ReportImage.Network_Cable_Mesurement = null;
                	}

                }
                this.removeDetailsOfSnaphotOfCameraFromUserData(cameraAndSnaphotDetails);
                return
            }
        }
		
	},

	/**
     * activityLogsForReportStart( ) - Method to add and send logs of report.
	 * @returns {void}
     * @author Mavelil
     * @example <caption>Example usage of activityLogsForReportStart method.</caption>
     * threedReportComponent.activityLogsForReportStart( );
     */

	activityLogsForReportStart : function(){
		
		try{

                   
            var logDatas = {};
            logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Started to generate report for "  + editor.activeProject.name;
            logger.addLog( logDatas );
            logger.sendLogs( localStorage.getItem( 'U_ID' ) );
            

        }
        catch( exception ){

            console.log( "Logging failed!" );
            console.log( exception );

        }
	},

	/**
     * changeClass( id , classNameToAdd ) - Method to add a CSS class to an element with a particular ID.
	 * @param {String} id - The ID of the element to which the CSS class needs to be added.
	 * @param {String} classNameToAdd - The CSS class to be added
	 * @returns {void}
     * @author Mavelil
     * @example <caption>Example usage of changeClass method.</caption>
     * threedReportComponent.changeClass( id , classNameToAdd );
     */

	changeClass : function(  id , classNameToAdd ){
		
		this.reportComponent.addClassToElement( id , classNameToAdd  )	
	},

	/**
     * removeClass( id , classNameToAdd ) - Method to remove a CSS class from an element with a particular ID.
	 * @param {String} id - The ID of the element to which the CSS class needs to be removed.
	 * @param {String} classNameToAdd - The CSS class to be removed
	 * @returns {void}
     * @author Mavelil
     * @example <caption>Example usage of removeClass method.</caption>
     * threedReportComponent.removeClass( id , classNameToAdd );
     */

	removeClass : function( id , classNameToRemove ){
		
		this.reportComponent.removeClassFromElement( id , classNameToRemove )
		 
	},

	/**
     * sendSnapshotToServer( file ,fileName , url ) - Method to send the snapshot to server.
	 * @param {Blob} file - The file that needs to be sent.
	 * @param {String} fileName - The filename of the file.
	 * @param {String} url - The URL to the API. 
	 * @returns {Object<Promise>}
     * @author Mavelil
     * @example <caption>Example usage of sendSnapshotToServer method.</caption>
     * threedReportComponent.sendSnapshotToServer( file ,fileName , url );
     */

	sendSnapshotToServer( file ,fileName , url){
		
		
		
		return  new Promise(function(resolve ,reject ){
			
			var fds = new FormData();
			fds.append('file', file, fileName);
			$.ajax({
				url: url,
				type: 'POST',
				processData: false,
				contentType: false,
				data: fds,
				success: function(response) {
					
					resolve (response);

				},
				
				error: function(err) {
					
					reject(err);              
				}
			});
		})

	},

	/**
     * shapshotOfModel( ) - Method to take the snapshot of the model.
	 * @returns {String<Promise>}
     * @author Mavelil
     * @example <caption>Example usage of shapshotOfModel method.</caption>
     * threedReportComponent.shapshotOfModel( );
     */

	shapshotOfModel : function(){
		
		return  new Promise((resolve ,reject )=>{
			var scope = this;
			var uid = localStorage.getItem('U_ID') + this.editor.activeProject.name;
			var apiUrl = this.editor.api + 'cameraScreenshot/' + uid;
			var name = "MainView";
			this.reportComponent.showOnlyModel();
			this.reportComponent.hideAllCameraInArray( this.cameraListArray )
			this.reportComponent.setRenderSize( window.innerWidth  , window.innerHeight );
			if( this.editor.SCALE_LIMIT <= 30 )
			this.reportComponent.reportCameraPosition( this.camera , new THREE.Vector3(13, 10, 14) );
			else
			this.reportComponent.reportCameraPosition( this.camera , new THREE.Vector3(33, 20, 33) );
			this.reportComponent.reportCameraRotation ( this.camera, new THREE.Euler(-0.523599, 0.785398, 0.401426) )
			//this.reportComponent.reportCameraRotation ( this.camera, new THREE.Euler(-0.9628002781102245, 0.6458148831526722, 0.713024010868131) )
			this.reportComponent.render(this.editor.scene.clone() , this.camera )
			var url  = this.reportComponent.getUrlFromrender();
			var file = this.reportComponent.dataURItoBlobSnapshot( url, 'image/png');
			this.reportComponent.updateProgress(this.editor.languageData.ReportGenerationStarted, 0.0)
			this.reportComponent.showProgress();
			this.reportComponent.showALlcameraInArray( this.cameraListArray );
			this.sendSnapshotToServer( file, name , apiUrl )
				.then( function(data){
					
					scope.reportComponent.updateProgress(scope.editor.languageData.MainviewisupdatedtoServer, 0.25);
					resolve(' Main View upload')
					
				})
				.catch(function(err){
					
					toastr.error("Upload Failed Try Again !!");
					console.log(err);
					scope.editor.pointOfinterestObject.ShowAllPointOfIntrest();
					this.disposeRender();
					reject ("Failed in upload !!")
				})
		})
		
		
	},

	/**
     * shapshotOfModelWIthAllElement( ) - Method to take the snapshot of the model with all elements.
	 * @returns {String<Promise>}
     * @author Mavelil
     * @example <caption>Example usage of shapshotOfModelWIthAllElement method.</caption>
     * threedReportComponent.shapshotOfModelWIthAllElement( );
     */

	shapshotOfModelWIthAllElement  : function(){
		
		return new Promise ( ( resolve ,reject) => {
			
			this.cameraHelperArray = this.reportComponent.addHelperToEditor( this.cameraListArray );
			this.reportComponent.setRenderSize( window.innerWidth  , window.innerHeight );
			if( this.editor.SCALE_LIMIT <= 30 )
			this.reportComponent.reportCameraPosition( this.camera , new THREE.Vector3(13, 10, 14) );
			else
			this.reportComponent.reportCameraPosition( this.camera , new THREE.Vector3(33, 20, 33) );
			//this.reportComponent.reportCameraPosition( this.camera , new THREE.Vector3(41, 20, 34) );
			this.reportComponent.reportCameraRotation ( this.camera, new THREE.Euler(-0.523599, 0.785398, 0.401426) )
			this.reportComponent.render( this.editor.scene , this.camera )
			var url  = this.reportComponent.getUrlFromrender();
			var file = this.reportComponent.dataURItoBlobSnapshot( url, 'image/png');
			var scope = this;
			var name = "SubmainView"
			var uid = localStorage.getItem('U_ID') + this.editor.activeProject.name;
			var apiUrl = this.editor.api + 'cameraScreenshot/' + uid;
			this.sendSnapshotToServer( file, name , apiUrl )
				.then( function(data){
						
					scope.reportComponent.updateProgress(editor.languageData.Simulatedviewuploadedtoserver , 0.50);
					scope.reportComponent.removeCameraHelperFromEditor(scope.cameraHelperArray)
					resolve(' Submain View upload')
						
				})
				.catch(function(err){
						
					
					console.log(err);
					toastr.error("Upload Failed Try Again !!");
					scope.editor.pointOfinterestObject.ShowAllPointOfIntrest();
					this.disposeRender();
					reject ("Failed in upload !!")
				})
		
		})

	},

	/**
     * takeSnapshotofTopView( ) - Method to take the snapshot of top view.
	 * @returns {String<Promise>}
     * @author Mavelil
     * @example <caption>Example usage of takeSnapshotofTopView method.</caption>
     * threedReportComponent.takeSnapshotofTopView( );
     */

	takeSnapshotofTopView : function(){
		
		return new Promise ( (resolve , reject) => {
			
			var orthographicCameraTop = editor.reportOrthoCamera;			
			this.cameraHelperArray = this.reportComponent.addHelperToEditor( this.cameraListArray );
			this.reportComponent.setRenderSize( window.innerWidth  , window.innerHeight );
			if( this.editor.SCALE_LIMIT <= 30 )
			orthographicCameraTop.zoom = 3;
			else
			orthographicCameraTop.zoom = 1;
			orthographicCameraTop.updateProjectionMatrix();
			this.reportComponent.reportCameraPosition( orthographicCameraTop , new THREE.Vector3( 00, 51, 00 ) );
			this.reportComponent.reportCameraRotation ( orthographicCameraTop, new THREE.Euler( -1.5708, 0, 0 ) )
			this.reportComponent.render(this.editor.scene , orthographicCameraTop )
			var url  = this.reportComponent.getUrlFromrender();
			var file = this.reportComponent.dataURItoBlobSnapshot( url, 'image/png');
			var scope = this;
			var name = "TopView"
			var uid = localStorage.getItem('U_ID') + this.editor.activeProject.name;
			this.reportComponent.updateProgress( this.editor.languageData.TwoDviewuploadedtoserver , 0.55 );
			var apiUrl = this.editor.api + 'cameraScreenshot/' + uid;
			this.sendSnapshotToServer( file, name , apiUrl )
				.then( function(data){
						
					scope.reportComponent.removeCameraHelperFromEditor(scope.cameraHelperArray)
					resolve(' Top View upload')
						
				})
				.catch(function(err){
						
					console.log(err);
					toastr.error("Upload Failed Try Again !!");
					scope.goToReset();
					this.disposeRender();
					reject ("Failed in upload !!")

				})
		})

	},

	/**
     * takeSnapshotofLeftView( ) - Method to take the snapshot of left view.
	 * @returns {String<Promise>}
     * @author Mavelil
     * @example <caption>Example usage of takeSnapshotofLeftView method.</caption>
     * threedReportComponent.takeSnapshotofLeftView( );
     */

	takeSnapshotofLeftView : function (){
		
		return new Promise ( (resolve , reject) => {
			
			var orthographicCameraLeft = editor.reportOrthoCamera;
			this.cameraHelperArray = this.reportComponent.addHelperToEditor( this.cameraListArray );
			this.reportComponent.setRenderSize( window.innerWidth  , window.innerHeight );
			if( this.editor.SCALE_LIMIT <= 30 )
			orthographicCameraLeft.zoom = 3;
			else
			orthographicCameraLeft.zoom = 1;
			orthographicCameraLeft.updateProjectionMatrix();
			this.reportComponent.reportCameraPosition( orthographicCameraLeft , new THREE.Vector3( -60, 00, 00 ) );
			this.reportComponent.reportCameraRotation ( orthographicCameraLeft, new THREE.Euler( -1.5708, -1.5708, -1.5708 ) )
			this.reportComponent.render( this.editor.scene , orthographicCameraLeft );
			var url  = this.reportComponent.getUrlFromrender();
			var file = this.reportComponent.dataURItoBlobSnapshot( url, 'image/png');
			var scope = this;
			var name = "LeftView"
			var uid = localStorage.getItem('U_ID') + this.editor.activeProject.name;
			this.reportComponent.updateProgress( editor.languageData.TwoDviewuploadedtoserver , 0.65  );
			var apiUrl = this.editor.api + 'cameraScreenshot/' + uid;
			this.sendSnapshotToServer( file, name , apiUrl )
				.then( function(data){
						
					scope.reportComponent.removeCameraHelperFromEditor(scope.cameraHelperArray)
					resolve(' Left View upload')
						
				})
				.catch(function(err){
						
					console.log(err);
					toastr.error("Upload Failed Try Again !!");
					scope.goToReset();
					this.disposeRender();
					reject ("Failed in upload !!")

				})
		})

	},

	/**
     * takeSnapshotofRightView( ) - Method to take the snapshot of right view.
	 * @returns {String<Promise>}
     * @author Mavelil
     * @example <caption>Example usage of takeSnapshotofRightView method.</caption>
     * threedReportComponent.takeSnapshotofRightView( );
     */

	takeSnapshotofRightView : function (){

		return new Promise ( (resolve , reject) => {
			
			var orthographicCameraRight = editor.reportOrthoCamera;
			this.cameraHelperArray = this.reportComponent.addHelperToEditor( this.cameraListArray );
			this.reportComponent.setRenderSize( window.innerWidth  , window.innerHeight );
			if( this.editor.SCALE_LIMIT <= 30 )
			orthographicCameraRight.zoom = 3;
			else
			orthographicCameraRight.zoom = 1;
			orthographicCameraRight.updateProjectionMatrix();
			this.reportComponent.reportCameraPosition( orthographicCameraRight , new THREE.Vector3( 60, 00, 00 ) );
			this.reportComponent.reportCameraRotation ( orthographicCameraRight, new THREE.Euler( -3.14159, 1.5708, 3.14159 ) )
			this.reportComponent.render(this.editor.scene , orthographicCameraRight );
			var url  = this.reportComponent.getUrlFromrender();
			var file = this.reportComponent.dataURItoBlobSnapshot( url, 'image/png');
			var scope = this;
			var name = "RightView"
			var uid = localStorage.getItem('U_ID') + this.editor.activeProject.name;
			this.reportComponent.updateProgress( editor.languageData.TwoDviewuploadedtoserver , 0.65  );
			var apiUrl = this.editor.api + 'cameraScreenshot/' + uid;
			this.sendSnapshotToServer( file, name , apiUrl )
				.then( function(data){
						
					scope.reportComponent.removeCameraHelperFromEditor(scope.cameraHelperArray)
					resolve(' Right View upload')
						
				})
				.catch(function(err){
						
					console.log(err);
					toastr.error("Upload Failed Try Again !!");
					scope.goToReset();
					this.disposeRender();
					reject ("Failed in upload !!")

				})

		})
		
	},

	//Modified Pivot start
	/**
     * takeSnapshotofFrontView( ) - Method to take the snapshot of front view.
	 * @returns {String<Promise>}
     * @author Mavelil
     * @example <caption>Example usage of takeSnapshotofFrontView method.</caption>
     * threedReportComponent.takeSnapshotofFrontView( );
     */

	takeSnapshotofFrontView : function (){
		
		return new Promise ( (resolve , reject) => {
			
			var orthographicCameraFront = editor.reportOrthoCamera;
			this.cameraHelperArray = this.reportComponent.addHelperToEditor( this.cameraListArray );
			this.reportComponent.setRenderSize( window.innerWidth  , window.innerHeight );
			if( this.editor.SCALE_LIMIT <= 30 )
			orthographicCameraFront.zoom = 3;
			else
			orthographicCameraFront.zoom = 1;
			orthographicCameraFront.updateProjectionMatrix();
			this.reportComponent.reportCameraPosition( orthographicCameraFront , new THREE.Vector3( 00, 00, 60 ) );
			this.reportComponent.reportCameraRotation ( orthographicCameraFront, new THREE.Euler( 0, 0, 0 ) )
			this.reportComponent.render(this.editor.scene , orthographicCameraFront )
			var url  = this.reportComponent.getUrlFromrender();
			var file = this.reportComponent.dataURItoBlobSnapshot( url, 'image/png');
			var scope = this;
			var name = "FrontView"
			var uid = localStorage.getItem('U_ID') + this.editor.activeProject.name;
			this.reportComponent.updateProgress( editor.languageData.TwoDviewuploadedtoserver , 0.65  );
			var apiUrl = this.editor.api + 'cameraScreenshot/' + uid;
			this.sendSnapshotToServer( file, name , apiUrl )
				.then( function(data){
						
					scope.reportComponent.removeCameraHelperFromEditor(scope.cameraHelperArray)
					resolve(' Front View upload')
						
				})
				.catch(function(err){
						
					console.log(err);
					toastr.error("Upload Failed Try Again !!");
					scope.goToReset();
					this.disposeRender();
					reject ("Failed in upload !!")

				})
		})
		
	},

	/**
     * takeSnapshotofBackView( ) - Method to take the snapshot of back view.
	 * @returns {String<Promise>}
     * @author Mavelil
     * @example <caption>Example usage of takeSnapshotofBackView method.</caption>
     * threedReportComponent.takeSnapshotofBackView( );
     */

	takeSnapshotofBackView : function (){
		
		return new Promise ( (resolve , reject) => {
			
			var orthographicCameraBack = editor.reportOrthoCamera;
			this.cameraHelperArray = this.reportComponent.addHelperToEditor( this.cameraListArray );
			this.reportComponent.setRenderSize( window.innerWidth  , window.innerHeight );
			if( this.editor.SCALE_LIMIT <= 30 )
			orthographicCameraBack.zoom = 3;
			else
			orthographicCameraBack.zoom = 1;
			orthographicCameraBack.updateProjectionMatrix();
			this.reportComponent.reportCameraPosition( orthographicCameraBack , new THREE.Vector3( 00, 00, -60 ) );
			this.reportComponent.reportCameraRotation ( orthographicCameraBack, new THREE.Euler( -3.14159, 0 , -3.14159 ) )
			this.reportComponent.render(this.editor.scene , orthographicCameraBack )
			var url  = this.reportComponent.getUrlFromrender();
			var file = this.reportComponent.dataURItoBlobSnapshot( url, 'image/png');
			var scope = this;
			var name = "BackView"
			var uid = localStorage.getItem('U_ID') + this.editor.activeProject.name;
			this.reportComponent.updateProgress( editor.languageData.TwoDviewuploadedtoserver , 0.65  );
			var apiUrl = this.editor.api + 'cameraScreenshot/' + uid;
			this.sendSnapshotToServer( file, name , apiUrl )
				.then( function(data){
						
					scope.reportComponent.removeCameraHelperFromEditor(scope.cameraHelperArray)
					resolve(' Back View upload')
						
				})
				.catch(function(err){
						
					console.log(err);
					toastr.error("Upload Failed Try Again !!");
					scope.goToReset();
					this.disposeRender();
					reject ("Failed in upload !!")

				})
		})
		
	},

	//Modified pivot end
	/**
     * pointOfInerestIsAvilable( ) - Method to check whether point of interest is available or not.
	 * @returns {Number}
     * @author Mavelil
     * @example <caption>Example usage of pointOfInerestIsAvilable method.</caption>
     * threedReportComponent.pointOfInerestIsAvilable( );
     */

	pointOfInerestIsAvilable : function (){
		
		if ( this.editor.scene.userData.PointofinterestData ){
			
			var objectKeys = Object.keys( this.editor.scene.userData.PointofinterestData );
			return objectKeys.length;
			
			
		} 
		else {
			
			return  0;
		}
	},

	/**
     * takeSnapshotofPointOfInterest( ) - Method to take snapshot of point of interest.
	 * @returns {String<Promise>}
     * @author Mavelil
     * @example <caption>Example usage of takeSnapshotofPointOfInterest method.</caption>
     * threedReportComponent.takeSnapshotofPointOfInterest( );
     */

	takeSnapshotofPointOfInterest : function(){
		
		return new Promise ( (resolve , reject ) => {
			
			
			this.reportComponent.showAllPointOfIntrest();
			this.reportComponent.hideAllCameraInArray( this.cameraListArray);
			this.reportComponent.setRenderSize( window.innerWidth  , window.innerHeight );
			this.reportComponent.reportCameraPosition( this.camera , new THREE.Vector3( 00, 51, 00) );
			this.reportComponent.reportCameraRotation ( this.camera, new THREE.Euler( -1.5708, 0, 0 ) )
			this.reportComponent.render( this.editor.scene , this.camera )
			var url  = this.reportComponent.getUrlFromrender();
			var file = this.reportComponent.dataURItoBlobSnapshot( url, 'image/png');
			var scope = this;
			var name = "PointOfIntrest"
			var uid = localStorage.getItem('U_ID') + this.editor.activeProject.name;
			this.reportComponent.updateProgress( editor.languageData.TwoDviewuploadedtoserver , 0.70  );
			var apiUrl = this.editor.api + 'cameraScreenshot/' + uid;
			this.reportComponent.hideAllPointOfIntrest();
			this.reportComponent.showALlcameraInArray( this.cameraListArray )
			this.sendSnapshotToServer( file, name , apiUrl )
				.then( function(data){
						
					
					
					resolve(' Point of Interest  View upload')
						
				})
				.catch(function(err){
						
					
					console.log( err );
					toastr.error("Upload Failed Try Again !!");
					scope.goToReset();
					this.disposeRender();
					reject ("Failed in upload !!")
				})	
			
		})  

		
	},

	/**
     * lengthMeasurementIsAvilable( ) - Method to check whether length measurement is available or not.
	 * @returns {Number}
     * @author Mavelil
     * @example <caption>Example usage of lengthMeasurementIsAvilable method.</caption>
     * threedReportComponent.lengthMeasurementIsAvilable( );
     */

	lengthMeasurementIsAvilable :function (){
		
		if ( this.editor.scene.userData.measurementDatas ){
			
			var objectKeys = Object.keys( this.editor.scene.userData.measurementDatas );
			return objectKeys.length;
			
			
		} 
		else {
			
			return  0;
		}
		
	},

	/**
     * takeSnapshotofLengthMeasurement( ) - Method to take snapshot of length measurement.
	 * @returns {String<Promise>}
     * @author Mavelil
     * @example <caption>Example usage of takeSnapshotofLengthMeasurement method.</caption>
     * threedReportComponent.takeSnapshotofLengthMeasurement( );
     */

	takeSnapshotofLengthMeasurement : function(){
		
		return new Promise ( (resolve , reject ) => {
			
			var type = 'lengthMeasurement';
			var orthographicCameraForLength = editor.reportOrthoCamera;
			//Added to hide all networking cables start
			this.reportComponent.hideAllNetworkCable();
			//Added to hide all networking cables end
			this.reportComponent.showAllLengthMeasurement();
			this.reportComponent.hideAllCameraInArray( this.cameraListArray);
			this.reportComponent.setRenderSize( window.innerWidth  , window.innerHeight );
			if( this.editor.SCALE_LIMIT <= 30 )
			orthographicCameraForLength.zoom = 3;
			else
			orthographicCameraForLength.zoom = 1;
			orthographicCameraForLength.updateProjectionMatrix();
			this.reportComponent.reportCameraPosition( orthographicCameraForLength , new THREE.Vector3( 00, 51, 00) );
			this.reportComponent.reportCameraRotation ( orthographicCameraForLength, new THREE.Euler( -1.5708, 0, 0 ) )
			editor.scaleBadgesOthographicView( orthographicCameraForLength,type );
			this.reportComponent.render( this.editor.scene, orthographicCameraForLength )
			var url  = this.reportComponent.getUrlFromrender();
			var file = this.reportComponent.dataURItoBlobSnapshot( url, 'image/png');
			var scope = this;
			var name = "LengthMesurement"
			var uid = localStorage.getItem('U_ID') + this.editor.activeProject.name;
			this.reportComponent.updateProgress( editor.languageData.TwoDviewuploadedtoserver , 0.71  );
			var apiUrl = this.editor.api + 'cameraScreenshot/' + uid;
			//if(this.editor.lengthShowHideToggle === false){

               this.reportComponent.hideAllLengthMeasurement();
			//}
			
			this.reportComponent.showALlcameraInArray( this.cameraListArray )
			this.sendSnapshotToServer( file, name , apiUrl )
				.then( function(data){
						
					resolve(' Length Mesurement  View upload')
						
				})
				.catch(function(err){

					console.log( err );
					toastr.error("Upload Failed Try Again !!");
					scope.goToReset();
					this.disposeRender();
					reject ("Failed in upload !!")
				})	
			
		})  
		
	},

	/**
     * areaMeasurementIsAvilable( ) - Method to check whether area measurement is available or not.
	 * @returns {Number}
     * @author Mavelil
     * @example <caption>Example usage of areaMeasurementIsAvilable method.</caption>
     * threedReportComponent.areaMeasurementIsAvilable( );
     */

	areaMeasurementIsAvilable : function (){
		
		
		if ( this.editor.scene.userData.areaMeasurementDatas ){
			
			var objectKeys = Object.keys( this.editor.scene.userData.areaMeasurementDatas );
			return objectKeys.length;
			
			
		} 
		else {
			
			return  0;
		}
	},

	/**
     * twoDLineMeasurementIsAvailable( ) - Method to check whether 2D measurement is available or not.
	 * @returns {Number}
     * @author Mavelil
     * @example <caption>Example usage of twoDLineMeasurementIsAvailable method.</caption>
     * threedReportComponent.twoDLineMeasurementIsAvailable( );
     */

	twoDLineMeasurementIsAvailable : function(){

		if( this.editor.scene.userData.twoDDrawingDatas ){

			var objectKeys = Object.keys( this.editor.scene.userData.twoDDrawingDatas );
			return objectKeys.length;
		
		}
		else {
			
			return  0;
		}

	},

	/**
     * networkCablingIsAvilable( ) - Method to check whether network cabling is available or not.
	 * @returns {Number}
     * @author Mavelil
     * @example <caption>Example usage of networkCablingIsAvilable method.</caption>
     * threedReportComponent.networkCablingIsAvilable( );
     */

	networkCablingIsAvilable : function (){
		
		
		if ( this.editor.scene.userData.cableDatas ){
			
			var objectKeys = Object.keys( this.editor.scene.userData.cableDatas );
			return objectKeys.length;
			
			
		} 
		else {
			
			return  0;
		}
	},
	
	/**
     * takeSnapshotofAreaMeasurement( ) - Method to take snapshot of area measurement.
	 * @returns {String<Promise>}
     * @author Mavelil
     * @example <caption>Example usage of takeSnapshotofAreaMeasurement method.</caption>
     * threedReportComponent.takeSnapshotofAreaMeasurement( );
     */

	takeSnapshotofAreaMeasurement : function () {
		
		return new Promise ( (resolve , reject ) => {
			
			var type = 'areaMeasurement';
			var orthographicCameraForArea = editor.reportOrthoCamera;
			this.reportComponent.showAllAreaMesurement();
			this.reportComponent.hideAllCameraInArray( this.cameraListArray);
			this.reportComponent.setRenderSize( window.innerWidth  , window.innerHeight );
			if( this.editor.SCALE_LIMIT <= 30 )
			orthographicCameraForArea.zoom = 3;
			else
			orthographicCameraForArea.zoom = 1;
			orthographicCameraForArea.updateProjectionMatrix();
			this.reportComponent.reportCameraPosition( orthographicCameraForArea , new THREE.Vector3( 00, 51, 00) );
			this.reportComponent.reportCameraRotation ( orthographicCameraForArea, new THREE.Euler( -1.5708, 0, 0 ) )
			editor.scaleBadgesOthographicView( orthographicCameraForArea,type );
			this.reportComponent.render( this.editor.scene, orthographicCameraForArea )
			var url  = this.reportComponent.getUrlFromrender();
			var file = this.reportComponent.dataURItoBlobSnapshot( url, 'image/png');
			var scope = this;
			var name = "AreaMesurement"
			var uid = localStorage.getItem('U_ID') + this.editor.activeProject.name;
			this.reportComponent.updateProgress( editor.languageData.TwoDviewuploadedtoserver , 0.73  );
			var apiUrl = this.editor.api + 'cameraScreenshot/' + uid;
			if(this.editor.areaShowHideToggle === false){

                this.reportComponent.hideAllAreaMeasurement();
            }
			
			this.reportComponent.showALlcameraInArray( this.cameraListArray )
			this.sendSnapshotToServer( file, name , apiUrl )
				.then( function(data){
						
					resolve(' Area Mesurement  View upload')
						
				})
				.catch(function(err){

					console.log( err );
					toastr.error("Upload Failed Try Again !!");
					scope.goToReset();
					this.disposeRender();
					reject ("Failed in upload !!")
					
				})	
			
		})  
		
	},

	/**
     * takeSnapshotof2DMeasurement( ) - Method to take snapshot of 2D measurement.
	 * @returns {String<Promise>}
     * @author Mavelil
     * @example <caption>Example usage of takeSnapshotof2DMeasurement method.</caption>
     * threedReportComponent.takeSnapshotof2DMeasurement( );
     */

	takeSnapshotof2DMeasurement : function () {
		
		return new Promise ( (resolve , reject ) => {
			
			var type = 'twoDLine';
			var orthographicCameraForArea = editor.reportOrthoCamera;
			this.reportComponent.showAll2DDrawings();
			this.reportComponent.hideAllCameraInArray( this.cameraListArray);
			this.reportComponent.setRenderSize( window.innerWidth  , window.innerHeight );
			if( this.editor.SCALE_LIMIT <= 30 )
			orthographicCameraForArea.zoom = 3;
			else
			orthographicCameraForArea.zoom = 1;
			orthographicCameraForArea.updateProjectionMatrix();
			this.reportComponent.reportCameraPosition( orthographicCameraForArea , new THREE.Vector3( 00, 51, 00) );
			this.reportComponent.reportCameraRotation ( orthographicCameraForArea, new THREE.Euler( -1.5708, 0, 0 ) )
			editor.scaleBadgesOthographicView( orthographicCameraForArea,type );
			this.reportComponent.render( this.editor.scene, orthographicCameraForArea )
			var url  = this.reportComponent.getUrlFromrender();
			var file = this.reportComponent.dataURItoBlobSnapshot( url, 'image/png');
			var scope = this;
			var name = "TwoDMeasurement"
			var uid = localStorage.getItem('U_ID') + this.editor.activeProject.name;
			this.reportComponent.updateProgress( editor.languageData.TwoDviewuploadedtoserver , 0.73  );
			var apiUrl = this.editor.api + 'cameraScreenshot/' + uid;
			if(this.editor.areaShowHideToggle === false){

                this.reportComponent.hideAll2DDrawings();
            }
			this.reportComponent.showALlcameraInArray( this.cameraListArray )
			this.sendSnapshotToServer( file, name , apiUrl )
				.then( function(data){
						
					resolve(' 2D Line Mesurement  View upload')
						
				})
				.catch(function(err){

					console.log( err );
					toastr.error("Upload Failed Try Again !!");
					scope.goToReset();
					this.disposeRender();
					reject ("Failed in upload !!")
					
				})	
			
		})  
		
	},

	/**
     * takeSnapshotofnetWorkCable( ) - Method to take snapshot of network measurement.
	 * @returns {String<Promise>}
     * @author Mavelil
     * @example <caption>Example usage of takeSnapshotofnetWorkCable method.</caption>
     * threedReportComponent.takeSnapshotofnetWorkCable( );
     */

	takeSnapshotofnetWorkCable : function () {
		
		return new Promise ( (resolve , reject ) => {
			
			var type = 'networkCable';
			this.reportComponent.showAllNetwoekCable();
			this.reportComponent.hideAllCameraInArray( this.cameraListArray);
			this.reportComponent.setRenderSize( window.innerWidth  , window.innerHeight );
			this.reportComponent.reportCameraPosition( this.camera , new THREE.Vector3( 00, 51, 00) );
			this.reportComponent.reportCameraRotation ( this.camera, new THREE.Euler( -1.5708, 0, 0 ) )
			editor.scaleBadgesOthographicView( this.camera,type );
			this.reportComponent.render( this.editor.scene, this.camera )
			var url  = this.reportComponent.getUrlFromrender();
			var file = this.reportComponent.dataURItoBlobSnapshot( url, 'image/png');
			var scope = this;
			var name = "NetworkCable"
			var uid = localStorage.getItem('U_ID') + this.editor.activeProject.name;
			this.reportComponent.updateProgress( editor.languageData.TwoDviewuploadedtoserver , 0.73  );
			var apiUrl = this.editor.api + 'cameraScreenshot/' + uid;
			this.reportComponent.hideAllNetworkCable();
			
			this.reportComponent.showALlcameraInArray( this.cameraListArray )
			this.sendSnapshotToServer( file, name , apiUrl )
				.then( function(data){
						
					resolve(' takeSnapshotofnetWorkCable  View upload')
						
				})
				.catch(function(err){

					console.log( err );
					toastr.error("Upload Failed Try Again !!");
					scope.goToReset();
					this.disposeRender();
					reject ("Failed in upload !!")
					
				})	
			
		})  
		
	},

	/**
     * goToReset( ) - Method to show point of interest and hide all area and length measurements.
	 * @returns {void}
     * @author Mavelil
     * @example <caption>Example usage of goToReset method.</caption>
     * threedReportComponent.goToReset( );
     */

	goToReset : function(){
		
		this.reportComponent.showAllPointOfIntrest();
        if(this.editor.areaShowHideToggle === false){

            this.editor.hideAreaMeasurements();
        }
        if(this.editor.lengthShowHideToggle === false){

            this.editor.hideLengthMeasurements();
        }
        
	},

	/**
     * getDataAboutScene( ) - Method to return scene data.
	 * @returns {Array<Promise>}
     * @author Mavelil
     * @example <caption>Example usage of getDataAboutScene method.</caption>
     * threedReportComponent.getDataAboutScene( );
     */

	getDataAboutScene : function (){

		return new Promise ( ( resolve , reject ) =>  {

			this.dataReport = [];
            this.editorCameraObject = [];
			var UserDataScean = editor.scene.userData.cameraList;
			var SceenUserData = Object.assign({} , editor.scene.userData.cameraList) 
			var SceenUserDataKeys = Object.keys(SceenUserData);
			this.editorCameraObject = [];
			
			if (editor.scene.userData.cameraList  == undefined)  {
				
				this.dataReport.push( SceenUserData );
				this.dataReport.push(editor.activeProject);
				this.dataReport.push(localStorage.getItem('email'));
				this.dataReport.push( editor.scene.userData );			
				resolve(this.dataReport);
				return
				
			}
			
			if(editor.scene.userData.cameraList['editorCamera'] == undefined){
				this.dataReport.push( SceenUserData );
				this.dataReport.push(editor.activeProject);
				this.dataReport.push(localStorage.getItem('email'));
				this.dataReport.push( editor.scene.userData );    		
				resolve(this.dataReport);
				return
				
			}
			
			for(var i = 0 ; i < SceenUserDataKeys.length ; i++){
			
				if(SceenUserDataKeys[i] == 'editorCamera')
				{
					editor.scene.userData.twodSnapshot = {}
					this.editorCameraObject.push(editor.scene.userData.cameraList['editorCamera']) ;
					delete SceenUserData["editorCamera"];
					editor.scene.userData.twodSnapshot['editorCamera'] = editor.scene.userData.cameraList['editorCamera']
					
					this.dataReport.push( SceenUserData );
					this.dataReport.push(editor.activeProject);
					this.dataReport.push(localStorage.getItem('email'));
					this.dataReport.push( editor.scene.userData );
					
					resolve(this.dataReport);
					return
					
				}
			}
		})
	},

	/**
     * goToGenerateThreedReport( data ) - Method to store and return the camera parameters needed for report generation
	 * @param {Array} data - The report data to which the camera data is to be added.
	 * @returns {Array<Promise>} - Array containing camera parameters
     * @author Mavelil
     * @example <caption>Example usage of goToGenerateThreedReport method.</caption>
     * threedReportComponent.goToGenerateThreedReport( data );
     */
	
	goToGenerateThreedReport : function ( data ){
		

		this.reportData = [];
		this.reportData = data;
		return new Promise (  (resolve ,reject) => {
		
			this.reportComponent.showAllReferencePoint();
			this.sceneData = editor.scene.children;
			
			for (var i = 0; i < this.sceneData.length; i++) {
			
				if (this.sceneData[i].type === "PerspectiveCamera") {
			
					this.camData = {};
					this.camData.name = this.sceneData[i].name;
					this.camData.uuid = this.sceneData[i].uuid;
					this.camData.location = this.sceneData[i].position;
					this.camData.rotation = this.sceneData[i].rotation;
					this.camData.userData = this.sceneData[i].userData;
					this.camData.focus = this.sceneData[i].focus;
					//this.camData.distance = this.sceneData[i].far - this.sceneData[i].near;
					this.camData.distance = this.sceneData[i].distance;
					this.camData.hView = this.sceneData[i].hView;
					this.camData.resolutionWidth = this.sceneData[i].resolutionWidth;
					this.camData.resolutionHeight = this.sceneData[i].resolutionHeight;
					this.camData.vView = this.sceneData[i].vView;
					this.camData.hFOV = this.sceneData[i].hFOV;
					this.camData.fov = this.sceneData[i].fov;
					this.camData.aspect = this.sceneData[i].aspect;
					this.camData.digitalZoom = this.sceneData[i].digitalZoom;
					this.camData.opticalZoom = this.sceneData[i].opticalZoom;
					this.camData.badgeText = this.sceneData[i].badgeText;
					this.reportData.push(this.camData);
			
			
				}
				
			
			}
			resolve(this.reportData);
			
		})
    
	},

	/**
     * generatethreedReport( dataReport ) - Method to send API request to generate report.
	 * @param {Array} dataReport - Data used for report generation.
	 * @returns {Object<Promise>}
     * @author Mavelil
     * @example <caption>Example usage of generatethreedReport method.</caption>
     * threedReportComponent.generatethreedReport( dataReport );
     */

	generatethreedReport : function(dataReport){

		var sensordetails =[]
		for(var i = 0 ; i < editor.scene.children.length ; i++){
				
			    if(editor.scene.children[i].type == "Group"){
				    if(editor.scene.children[i].userData["sensorData"]){
						sensordetails.push(editor.scene.children[i].userData["sensorData"])

				    }
				}				
		}

        dataReport.push(sensordetails)
		//Modified pivot start
		var convParameters = {};
		convParameters.convFactor = editor.commonMeasurements.targetConversionFactor;
		convParameters.unit = editor.commonMeasurements.targetUnit;
		dataReport.push( convParameters );
		//Modified pivot end
		 
		this.reportComponent.updateProgress( editor.languageData.Reportgenerating , 0.90  );
		return new Promise ( ( resolve ,reject ) =>  { 
		
			$.ajax({
				url: this.editor.api + 'Report3D',
				type: "POST",
				contentType: 'application/json',
				processData: false,
				data: JSON.stringify(dataReport),
				success: function(result) {
					resolve ( result ) 

				},
				error: (err) => {
					console.log ( dataReport ) ;	
					this.disposeRender();
					reject (err) 

				}
			});
		
		}) 

		
	},

	/**
     * threedReportSucess( result ) - Method to do certain tasks after 3D report success.
	 * @param {Object} result - API response from 'Report3D' route.
	 * @returns {void}
     * @author Mavelil
     * @example <caption>Example usage of threedReportSucess method.</caption>
     * threedReportComponent.threedReportSucess( result );
     */

	threedReportSucess : function ( result ) {
		
		this.reportComponent.updateProgress(  editor.languageData.Reportgenerating , 0.99 );
		this.reportFileName = result.body.message.filename;
		this.reportComponent.showAllPointOfIntrest();
		editor.scene.userData.twodSnapshot = {}
		this.alertForSuceesOfThreedReport();
		this.activityLogsForReportEnd ( result );
		
	},

	/**
     * activityLogsForReportEnd( result ) - Method to add and send activity logs for report end.
	 * @param {Object} result - API response from 'Report3D' route for activity logging.
	 * @returns {void}
     * @author Mavelil
     * @example <caption>Example usage of activityLogsForReportEnd method.</caption>
     * threedReportComponent.activityLogsForReportEnd( result );
     */

	activityLogsForReportEnd : function ( result ) {
		
		try{

            //Modified for activity logging start
            var logDatas = {};
            logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Finished report preparation for "  + editor.activeProject.name + " : " + result.body.message.filename;
            logger.addLog( logDatas );
            logger.sendLogs( localStorage.getItem( 'U_ID' ) );
            //Modified for activity logging end

        }
        catch( exception ){

            console.log( "Logging failed!" );
            console.log( exception );

        }
        //Modified for activity logging end
		
	},

	/**
     * alertForSuceesOfThreedReport( ) - Method to alert on success 3D report generation. 
	 * @returns {void}
     * @author Mavelil
     * @example <caption>Example usage of alertForSuceesOfThreedReport method.</caption>
     * threedReportComponent.alertForSuceesOfThreedReport( );
     */

	alertForSuceesOfThreedReport : function () {
		
		setTimeout(() =>  {

            try {
              /* 
			   var linkElement = document.createElement('a');
			  url = editor.path + '/output/uploadurl/' + projectDetails.user_id + projectDetails.name + '/cameraScreenShot/' + reportFileName + '.pdf';
                linkElement.setAttribute('href', url);
                linkElement.setAttribute("download", reportFileName + '.pdf');
                var clickEvent = new MouseEvent("click", {
                    "view": window,
                    "bubbles": true,
                    "cancelable": false
                });
                linkElement.dispatchEvent(clickEvent);*/
        
                this.disposeRender();
                toastr.info(editor.languageData.Reportgenerationcompletednowyoucanopenthereport);
				this.reportComponent.hideProgress();
				if( editor.isFloorplanViewActive ){

					editor.scaleAllIcons();            

				}                        
            } catch (ex) {
                toastr.error("Some error in Downloading Pdf");
                editor.pointOfinterestObject.ShowAllPointOfIntrest();
                this.disposeRender();
            }
        }, 5000);
	},

	/**
     * disposeRender( ) - Method to dispose the renderer and hide progress bar. 
	 * @returns {void}
     * @author Mavelil
     * @example <caption>Example usage of disposeRender method.</caption>
     * threedReportComponent.disposeRender( );
     */

	disposeRender : function(){
		
		this.newRender.dispose();
		this.reportComponent.hideProgress();    
		
	},

	/**
     * activityLogForGenerateReportWithOutCamera( ) - Method to add and send activity logs for generating report without camera. 
	 * @returns {void}
     * @author Mavelil
     * @example <caption>Example usage of activityLogForGenerateReportWithOutCamera method.</caption>
     * threedReportComponent.activityLogForGenerateReportWithOutCamera( );
     */

	activityLogForGenerateReportWithOutCamera : function(){
		
		//Modified for activity logging start
        try{

            //Modified for activity logging start
            var logDatas = {};
            logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Started to generate report(Without camera) for "  + this.editor.activeProject.name;
            logger.addLog( logDatas );
            logger.sendLogs( localStorage.getItem( 'U_ID' ) );
            //Modified for activity logging end

        }
        catch( exception ){

            console.log( "Logging failed!" );
            console.log( exception );

        }
        //Modified for activity logging end
	},
	
	/**
     * startGenerateReportWithoutCamera( ) - Method to initiate report generation of the scene whithout any cameras.
	 * @returns {Function}
     * @author Mavelil
     * @example <caption>Example usage of startGenerateReportWithoutCamera method.</caption>
     * threedReportComponent.startGenerateReportWithoutCamera( );
     */

	startGenerateReportWithoutCamera : function (){
		this.cameraListArray = [];
		this.activityLogForGenerateReportWithOutCamera();
		return this.createRenderForReportCamera();

		
	},

	/**
     * getReportList( ) -  Method to get the list of reports.
	 * @returns {Object<Promise>}
     * @author Mavelil
     * @example <caption>Example usage of getReportList method.</caption>
     * threedReportComponent.getReportList( );
     */

	getReportList : function () {
		
		return new Promise (  ( resolve ,reject ) => {
			
			
            var genReportList = new ApiHandler();
            genReportList.prepareRequest({
                method: 'GET',
                url: this.editor.api + 'report/users/' + localStorage.getItem('U_ID'),
                responseType: 'json',
                isDownload: false,
                formDataNeeded: false,
                formData: ''
            });
			genReportList.onStateChange(function(result) {
				
				resolve ( result ) 
			})
			genReportList.sendRequest(); 
			
		})
	},

	/**
     * projectListModelCreate( data ) -  Method to create model for project report.
	 * @param {Object} data - JSON data of 3D report.
	 * @returns {DOM Element}
     * @author Mavelil
     * @example <caption>Example usage of projectListModelCreate method.</caption>
     * threedReportComponent.projectListModelCreate( data );
     */

	projectListModelCreate : function ( data ) {
		
		this.report3dData, report3dDataCount = 0;
		this.report3dDataModalBody = document.createElement('div');
        this.report3dDataModalBody.className = 'row';
        this.defaultModalBodyContent = document.createElement('div');
        this.defaultModalBodyContent.setAttribute('class', 'text-center');
		this.defaultModalBodyContent.setAttribute('style', 'font-size: 20px; color: #b5afaf');
        this.defaultModalBodyContent.innerHTML = ' <strong>'+ editor.languageData.Nothingtoshowhere+'</strong>';
		this.count = 0
		if (data !== undefined) {
			
            this.report3dData = data;
			
            if ( this.report3dData.length != 0 ) {
				
                this.report3dData.forEach((ReportData) => {
                    this.count = this.count+1;
                    if (ReportData !== undefined) {
                        var projectLocation = editor.languageData.location +':'+ ReportData.location;
                        
                        //var img =  editor.path +'/projects3d/'+localStorage.getItem("U_ID")+ '/maplocations/'+ReportData.name+'.png'	;
                        var cardFooterValue = (ReportData.updated_at != undefined && project.updated_at != null) ? ReportData.updated_at : ReportData.created_at;
                        var card = new UI.BootstrapCard('project-report-card-' + report3dDataCount, ReportData.filename, projectLocation, editor.languageData.Open ,editor.languageData.Delete, cardFooterValue);
                        card.setCardButton(editor.languageData.download);
                        card.setCardText( editor.languageData.ToatlNoOfCamera + ReportData.totalCamera);
                       
                        card.setWraperClass(' col-sm-3');
                        card.setWraperStyle('border: 1px solid #cccccc;padding-left: 0px;padding-right: 0px;');
                        card.setHeaderStyle('font-size: 21px;background-color: #e0e0e0;border-bottom: 1px solid #cccccc;overflow: hidden;text-overflow: clip;');
                        card.setBodyStyle('padding-top: 18px;');
                        var link = editor.path+ReportData.url ;
                        var inputid = 'reportlink'+this.count;
                        card.setShareLink(link,inputid,editor.languageData.copyLink,editor.languageData.ShareableLink);
                        //card.setBodyStyle('background-image :url('+img+');height: 70px;')
                        card.setFooterStyle('padding-top: 10px;margin-top: 10px;font-size: 12px;border-top: 1px solid #cccccc;background-color: #e0e0e0;');
						card.setSubmitCallback( this.openReport.bind( this ) ,  [ReportData, card]);
                        card.setCancelCallback( this.onDeleteReportClick.bind( this ) , [ReportData, card]);
						card.setDownloadCallback( this.downloadReportClick.bind( this ) , [ReportData, card]);
                        card.setCopyCallback( this.copyLinkReportClick.bind( this ), [inputid, card]);
                        this.report3dDataModalBody.appendChild( card.dom );
        
                    }
                    report3dDataCount++;
        
                });
				
                return this.report3dDataModalBody;
				
        
            } else {
				
                 return this.defaultModalBodyContent ;
            }
        }   
		
	},

	/**
     * openReport( reportArray ) -  Method to open the project report in a new tab.
	 * @param {Array} reportArray - Array containing details of the report.
	 * @returns {Void}
     * @author Mavelil
     * @example <caption>Example usage of openReport method.</caption>
     * threedReportComponent.openReport( reportArray );
     */

	openReport: function ( reportArray ) {
		
		this.openReportData = reportArray[0];
        this.openReportUrl = editor.path + this.openReportData.url;
        window.open(this.openReportUrl,'_blank');

        //Modified for activity logging start
        try{

            //Modified for activity logging start
            var logDatas = {};
            logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Opened project report for " + editor.activeProject.name + " : " + this.openReportUrl;
            logger.addLog( logDatas );
            logger.sendLogs( localStorage.getItem( 'U_ID' ) );
            //Modified for activity logging end

        }
        catch( exception ){

            console.log( "Logging failed!" );
            console.log( exception );

        }
        //Modified for activity logging end
	},

	/**
     * onDeleteReportClick( reportArray ) -  Method to execute delete operation on generated reports.
	 * @param {Array} reportArray - Array containing details of the report.
	 * @returns {Void}
     * @author Mavelil
     * @example <caption>Example usage of onDeleteReportClick method.</caption>
     * threedReportComponent.onDeleteReportClick( reportArray );
     */

	onDeleteReportClick : function( reportArray ){

		this.deleteReportData = reportArray[0];
		this.reportDeleteDom = reportArray[1];
		var scope = this;
        this.deleteReport = new ApiHandler();
		
        this.deleteReport.prepareRequest({
        
            method: 'GET',
            url: editor.api + 'Report/trash/' + this.deleteReportData._id,
            responseType: 'json',
            isDownload: false,
            formDataNeeded: false,
            formData: null
        
        });
        this.deleteReport.onStateChange((response) =>{
			
            var cardToRemove = document.getElementById(scope.reportDeleteDom.dom.id);
                if (cardToRemove) {
					
					scope.removeAnElement(  scope.reportDeleteDom.dom.id ) 
					toastr.success(editor.languageData.Reportremovedsuccessfully);
        
                }
           

            //Modified for activity logging start
            try{

                //Modified for activity logging start
                var logDatas = {};
                logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Removed project report "  + scope.deleteReportData.name;
                logger.addLog( logDatas );
                logger.sendLogs( localStorage.getItem( 'U_ID' ) );
                //Modified for activity logging end

            }
            catch( exception ){

                console.log( "Logging failed!" );
                console.log( exception );

            }
            //Modified for activity logging end
        
        },(error) => {
        
            console.log(error);
            toastr.error(editor.languageData.SorrysomethingwentwrongPleasetryagainaftersometime);

            //Modified for activity logging start
            try{

                //Modified for activity logging start
                var logDatas = {};
                logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Failed to remove project report "  + scope.deleteReportData.name;
                logger.addLog( logDatas );
                logger.sendLogs( localStorage.getItem( 'U_ID' ) );
                //Modified for activity logging end

            }
            catch( exception ){

                console.log( "Logging failed!" );
                console.log( exception );

            }
            //Modified for activity logging end
        
        });
        
        //Progress trackers for the http request
            
        this.deleteReport.sendRequest();
		
		
	},

	/**
     * removeAnElement( id ) -  Method to remove an element with the specified ID.
	 * @param {String} id - ID of the element to be removed.
	 * @returns {Object} - Returns the object that has been removed.
     * @author Mavelil
     * @example <caption>Example usage of removeAnElement method.</caption>
     * threedReportComponent.removeAnElement( id );
     */

	removeAnElement : function removeElement(id) {
		
		this.elem = document.getElementById( id );
		return this.elem.parentNode.removeChild( this.elem );
		
	},

	/**
     * downloadReportClick( downloadDetails ) -  Method to download a generated report.
	 * @param {Array} downloadDetails - Array containing details of the report.
	 * @returns {Void}
     * @author Mavelil
     * @example <caption>Example usage of downloadReportClick method.</caption>
     * threedReportComponent.downloadReportClick( downloadDetails );
     */

	downloadReportClick : function( downloadDetails ){
		
		this.downloadReportData = downloadDetails[0];
		this.downloadReportUrl =  this.downloadReportData.url;
		this.downloadFileName = this.downloadReportData.filename;
        this.downloadFromUrl( this.downloadReportUrl , this.downloadFileName , this.activityLogFordownloadProjectScucess ,  this.activityLogFordownloadProjectFail )
	},

	/**
     * downloadFromUrl( downloadUrl , fileName ,   suceess , fail ) -  Method to download a generated report from the URL.
	 * @param {String} downloadUrl - The URL from which the report can be downloaded.
	 * @param {String} fileName - The file name for the report to be generated.
	 * @param {CallBackFunction} suceess - Function to be executed when the action is successfull.
	 * @param {CallBackFunction} fail - Function to be executed when the action is failed.
	 * @returns {Void}
     * @author Mavelil
     * @example <caption>Example usage of downloadFromUrl method.</caption>
     * threedReportComponent.downloadFromUrl( downloadUrl , fileName ,   suceess , fail );
     */

	downloadFromUrl : function ( downloadUrl , fileName ,   suceess , fail ) {
		
		this.linkElement  = document.createElement('a');
		
		try {
			
            var url = this.editor.path + downloadUrl;
            this.linkElement.setAttribute('href', url);
            this.linkElement.setAttribute("download", fileName + '.pdf');
            this.downloadClickEvent  = new MouseEvent("click", {
                "view": window,
                "bubbles": true,
                "cancelable": false
            });

            this.linkElement.dispatchEvent( this.downloadClickEvent );
			suceess( fileName )
        } 
		catch (ex) {
			
            console.log(ex)
            toastr.error(editor.languageData.SomeerrorinDownloadingPdf);
			fail( fileName );
           
        }
	},

	/**
     * activityLogFordownloadProjectScucess( fileName ) -  Method to logging upon successfull project report download.
	 * @param {String} fileName - The file name of the generated report for logging purposes.
	 * @returns {Void}
     * @author Mavelil
     * @example <caption>Example usage of activityLogFordownloadProjectScucess method.</caption>
     * threedReportComponent.activityLogFordownloadProjectScucess( fileName );
     */

	activityLogFordownloadProjectScucess : function ( filename ){
		
		try{

            
            var logDatas = {};
            logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Downloaded project report "  + filename + ".pdf";
            logger.addLog( logDatas );
            logger.sendLogs( localStorage.getItem( 'U_ID' ) );

        }
        catch( exception ){

            console.log( "Logging failed!" );
            console.log( exception );

        }
		
		
	},

	/**
     * activityLogFordownloadProjectFail( fileName ) -  Method to logging upon failed project report download.
	 * @param {String} fileName - The file name of the generated report for logging purposes.
	 * @returns {Void}
     * @author Mavelil
     * @example <caption>Example usage of activityLogFordownloadProjectFail method.</caption>
     * threedReportComponent.activityLogFordownloadProjectFail( fileName );
     */

	activityLogFordownloadProjectFail : function ( filename ){
		
		try{

			
			var logDatas = {};
			logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Failed to downloaded project report "  + filename + ".pdf" + " : " + ex;
			logger.addLog( logDatas );
			logger.sendLogs( localStorage.getItem( 'U_ID' ) );
			
	
		}
		catch( exception ){
	
			console.log( "Logging failed!" );
			console.log( exception );
	
		}
		
		
	},

	/**
     * copyLinkReportClick( copyArray ) -  Method to copy the report link to the clipboard.
	 * @param {Array} copyArray - The Array containing the details of the generated report.
	 * @returns {Void}
     * @author Mavelil
     * @example <caption>Example usage of copyLinkReportClick method.</caption>
     * threedReportComponent.copyLinkReportClick( copyArray );
     */

	copyLinkReportClick : function ( copyArray  ) {
		
		this.copyElementId  = copyArray[0];
        this.copyElement = document.getElementById( this.copyElementId );
        this.copyElement.select();
        document.execCommand( 'Copy' );
        toastr.info( editor.languageData.Copiedtoclipboard );
	}

	
	

	
	
	
}
