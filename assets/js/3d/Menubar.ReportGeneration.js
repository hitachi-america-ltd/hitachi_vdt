
/**
 * Menubar.ReportGeneration( editor ) : Constructor for generating reports and view generated reports
 * @constructor
 * @param {any} editor - The instance of the Editor which manages the overall objects and signals
 * @returns {Object<UI.Panel>}
 * @author Mavelil
 * @example <caption>Example usage of Menubar.ReportGeneration</caption>
 * var menubarReportGeneration = new Menubar.ReportGeneration( editor );
 */

Menubar.ReportGeneration = function(editor) {
    var projectDetails = {};
    var signals = editor.signals;
    var container = new UI.Panel();
	var reportComponent = new threedReportComponent ( editor );
 	var cameraHideFlag = false;

    var defaultBodyContent = document.createElement('div');
    defaultBodyContent.id = "open-ReportList-modal-body";
    var openReportList = new UI.bootstrapModal("", "Report-List", editor.languageData.MyReports, defaultBodyContent, "Open", "Cancel", "Report-form");
    openReportList.hideFooterButtons();
    openReportList.makeLargeModal();
    document.getElementById('editorElement').appendChild(openReportList.dom);

    container.setClass('menu');

    var title = new UI.Panel();
    title.setClass('title');
    title.setTextContent(editor.languageData.Report);
    title.setId('Report');
    container.add(title);

    var options = new UI.Panel();
    options.setClass('options');
    container.add(options);

    // GenerateReport

    var GenerateReport = new UI.Row();
    GenerateReport.setClass('option');
    GenerateReport.setTextContent( editor.languageData.GenerateReport );
    GenerateReport.setId('generate_report');
    GenerateReport.onClick(function() {

        if(editor.isMeasuring === true){
            toastr.warning("You can't take reports while measurement controls are active !!")
            return;
        }
        if (!editor.hideAllCamera){

        	document.getElementById( 'hideAllCameraButton' ).click();
        	cameraHideFlag = true;
            
        }
		if( editor.isntwrkngStarted ){
			
			toastr.warning( "You can't take reports while Network Cable mode is active !!");
			reportComponent.hideallCamera();
        	cameraHideFlag = false;
            return;
			
		}
        var classListName = document.getElementById("Report");
		
			if (editor.activeProject.user_id != undefined){
				
				var projectDetails = editor.activeProject;
				var reportCamera = reportComponent.generateReportCamera();
				if (editor.generatReport) {
					var renderer  
					reportComponent.activityLogsForReportStart();
					var cameraArrayInEditor = reportComponent.allCameraInEditor();
					
					if (cameraArrayInEditor.length == 0) {
						
						toastr.info("No camera In the editor")
						GenerateReportWithOutCamera();
						return;
					}
					if ( editor.scene.userData.cameraList == undefined  ) {
						
						toastr.info(editor.languageData.NoSnapShotforcameraView);
						if(cameraHideFlag){
								
							reportComponent.hideallCamera();
        					cameraHideFlag = false;	
						}
						return;	

					}
					else if( Object.keys(editor.scene.userData.cameraList).length  == 0 ){
						
							toastr.info(editor.languageData.NoSnapShotforcameraView);
							if(cameraHideFlag){

								reportComponent.hideallCamera();
        						cameraHideFlag = false;	
							}

							return;						
						
					}
					
					var Data = {};
                    Data.userdata = editor.scene.userData ;
                    Data.user_id = localStorage.getItem('U_ID') + editor.activeProject.name;
					reportComponent.checkImageIsAvilableInServer( Data , editor.api + 'checkscreenshot')
						.then(function(data){
							
							var checkImageIsAvilableInServerResponce = data;
							/*console.log( checkImageIsAvilableInServerResponce );
							console.log(data);*/
							if(checkImageIsAvilableInServerResponce.length == 0){

								checkAllCameraHaveSnapshhot();
							}
							else{

								for(var i=0 ; i < checkImageIsAvilableInServerResponce.length ; i++){
									   
									removeUseraDataCameraSnapshot (checkImageIsAvilableInServerResponce[i])
									
									if(i == checkImageIsAvilableInServerResponce.length -1){
										checkAllCameraHaveSnapshhot();
									}
								}

							}
						
						
						}).catch(function(err){
							
							if(cameraHideFlag){
								
								reportComponent.hideallCamera();
        						cameraHideFlag = false;	
							}
							toastr.error('Somthing went wrong try again !!!');
							console.log(err);
						})
						
					function removeUseraDataCameraSnapshot( cameraAndSnaphotDetails ){
						
						reportComponent.removeDetailsOfSnaphotOfCameraFromUserData( cameraAndSnaphotDetails )
					}
					
					function checkAllCameraHaveSnapshhot (){
						
						
						reportComponent.confirmAllCameraHaveSnapshot().then(function(data){
						renderer  = reportComponent.createRenderForReportCamera();
						toastr.info(editor.languageData.PleaseWait);
						takeSnapshotOfModel()
							
							
						}).catch(function(){
							
							if(cameraHideFlag){
								
								reportComponent.hideallCamera();
        						cameraHideFlag = false;	
							}	
							return;	
							
						})
					}
					
					function takeSnapshotOfModel () {
						
						// if( editor.scene.userData.ReportImage){
			
						// 	if(editor.scene.userData.ReportImage.Project_Overview != null){
						// 		takeSnapshotOfModelWithAllElement();
						// 		return;

						// 	}
						// }

						reportComponent.changeClass( 'Report' , '  selectMenubar' );
						reportComponent.shapshotOfModel().then(function(data){
							
							takeSnapshotOfModelWithAllElement()
						})
						.catch(function( err ){
							
							if(cameraHideFlag){
								
								reportComponent.hideallCamera();
        						cameraHideFlag = false;	
							}
							console.log(err)
						})	
					}
					
					function takeSnapshotOfModelWithAllElement(){

						if( editor.scene.userData.ReportImage){
			
							if(editor.scene.userData.ReportImage.Project_Scenes_Layouts != null){
								topViewOfModel();
								return;

							}
						}
						
						reportComponent.shapshotOfModelWIthAllElement().then(function(data){
							
							topViewOfModel();
						})
						.catch(function( err ){
							
							if(cameraHideFlag){
								
								reportComponent.hideallCamera();
        						cameraHideFlag = false;	
							}
							console.log(err)
						})	
						
					}
					function topViewOfModel () {
						
						if( editor.scene.userData.ReportImage){
			
							if(editor.scene.userData.ReportImage.Top_View != null){
								leftViewOfModel();
								return;

							}
						}
						reportComponent.takeSnapshotofTopView().then(function(data){
							
							leftViewOfModel();
						})
						.catch( function( err ){

							if(cameraHideFlag){
								
								reportComponent.hideallCamera();
        						cameraHideFlag = false;	
							}
							console.log(err)
						})
					}
					
					function leftViewOfModel (){

						if( editor.scene.userData.ReportImage){
			
							if(editor.scene.userData.ReportImage.Left_View != null){
								rightViewOfModel();
								return;

							}
						}
						
						reportComponent.takeSnapshotofLeftView().then(function(data){
							
							rightViewOfModel();
						})
						.catch( function ( data ) {
							
							if(cameraHideFlag){
								
								reportComponent.hideallCamera();
        						cameraHideFlag = false;	
							}
							console.log(err)
						})
						
					}
					
					function rightViewOfModel(){
						
						if( editor.scene.userData.ReportImage){
			
							if(editor.scene.userData.ReportImage.Right_View != null){
								
								//checkPointOfInerestIsAvilable();
								frontViewOfModel();
								return;

							}
						}
						
						reportComponent.takeSnapshotofRightView().then (function(data){
							
							//checkPointOfInerestIsAvilable()
							frontViewOfModel();
						})
						.catch( function ( err ) {
							
							if(cameraHideFlag){
								
								reportComponent.hideallCamera();
        						cameraHideFlag = false;	
							}
							console.log(err)
							
						})
					}

					//Modified Pivot start
					function frontViewOfModel(){
						
						if( editor.scene.userData.ReportImage){
			
							if(editor.scene.userData.ReportImage.Front_View != null){
								
								backViewOfModel();
								return;

							}
						}
						
						reportComponent.takeSnapshotofFrontView().then (function(data){
							
							backViewOfModel()
						})
						.catch( function ( err ) {
							
							if(cameraHideFlag){
								
								reportComponent.hideallCamera();
        						cameraHideFlag = false;	
							}
							console.log(err)
							
						})
					}

					function backViewOfModel(){
						
						if( editor.scene.userData.ReportImage){
			
							if(editor.scene.userData.ReportImage.Back_View != null){
								
								checkPointOfInerestIsAvilable();
								return;

							}
						}
						
						reportComponent.takeSnapshotofBackView().then (function(data){
							
							checkPointOfInerestIsAvilable()
						})
						.catch( function ( err ) {
							
							if(cameraHideFlag){
								
								reportComponent.hideallCamera();
        						cameraHideFlag = false;	
							}
							console.log(err)
							
						})
					}

					//Modified Pivot End
					
					function checkPointOfInerestIsAvilable(){
						
						var Keys = reportComponent.pointOfInerestIsAvilable();
						
						if(!Keys){
							
							checkLengthMesurementIsAvilable()
						}
						else{
							
							if( editor.scene.userData.ReportImage){
			
								if(editor.scene.userData.ReportImage.point_Of_Intrest != null){
									
									checkLengthMesurementIsAvilable();
									return;

								}
							}
							pointOfInerestSnapshot()
						}
						
					}
					
					function checkLengthMesurementIsAvilable () {
						
						var lengthKeys = reportComponent.lengthMeasurementIsAvilable();
						
						if(!lengthKeys){
							
							checkAreaMesurementIsAvilable()
						}
						else{
							
							if( editor.scene.userData.ReportImage){
			
								if(editor.scene.userData.ReportImage.Length_Mesurement != null){
									
									checkAreaMesurementIsAvilable();
									return;

								}
							}

							lengthMeasurementSnapshot()
						}
					}
					
					// function checkAreaMesurementIsAvilable (){
						
					// 	var areaKeys = reportComponent.areaMeasurementIsAvilable();
						
					// 	if(!areaKeys){
							
					// 		checkNetworkCableIsAvilable();
					// 	}
					// 	else{
							
					// 		if( editor.scene.userData.ReportImage){
			
					// 			if(editor.scene.userData.ReportImage.Area_Mesurement != null){
									
					// 				checkNetworkCableIsAvilable();
					// 				return;

					// 			}
					// 		}
					// 		areaMeasurementSnapshot()
					// 	}
						
					// }

					function checkAreaMesurementIsAvilable (){
						
						var areaKeys = reportComponent.areaMeasurementIsAvilable();
						
						if(!areaKeys){
							
							checkTwoDLineMeasurementIsAvailable();
						}
						else{
							
							if( editor.scene.userData.ReportImage){
			
								if(editor.scene.userData.ReportImage.Area_Mesurement != null){
									
									checkTwoDLineMeasurementIsAvailable();
									return;

								}
							}
							areaMeasurementSnapshot()
						}
						
					}

					function checkTwoDLineMeasurementIsAvailable(){

						var twoDKeys = reportComponent.twoDLineMeasurementIsAvailable();
						if(!twoDKeys){
							
							checkNetworkCableIsAvilable();
						}
						else{

							twoDLineDrawingSnapshot();
						}

					}
					
					function checkNetworkCableIsAvilable (){
						
						var networkKeys = reportComponent.networkCablingIsAvilable();
						
						if(!networkKeys){
							
							goToGenerateReport();
						}
						else{
							
							if( editor.scene.userData.ReportImage){
			
								if(editor.scene.userData.ReportImage.Network_Cable_Mesurement != null){
									
									goToGenerateReport();
									return;

								}
							}
							netWorkCableSnapshot()
						}
						
					}
					
					function pointOfInerestSnapshot () {
						
						reportComponent.takeSnapshotofPointOfInterest().then(function(data){
							
							checkLengthMesurementIsAvilable();
						})
						.catch ( function ( err ) {
							
							if(cameraHideFlag){
								
								reportComponent.hideallCamera();
        						cameraHideFlag = false;	
							}
							console.log( err );
						})
						
					}
					
					function lengthMeasurementSnapshot() {
						
						reportComponent.takeSnapshotofLengthMeasurement().then(function(data){
							
							checkAreaMesurementIsAvilable();
						})
						.catch ( function ( err ) {
							if(cameraHideFlag){
								
								reportComponent.hideallCamera();
        						cameraHideFlag = false;	
							}
							console.log( err );
						})
						
					}
					function areaMeasurementSnapshot () {
						
						reportComponent.takeSnapshotofAreaMeasurement().then(function(data){
							
							checkTwoDLineMeasurementIsAvailable()
						})
						.catch ( function ( err ) {
							
							if(cameraHideFlag){
								
								reportComponent.hideallCamera();
        						cameraHideFlag = false;	
							}
							console.log( err );  
						})
						
					}
					function twoDLineDrawingSnapshot(){

						reportComponent.takeSnapshotof2DMeasurement().then(function(data){
							
							checkNetworkCableIsAvilable()
						})
						.catch ( function ( err ) {
							
							if(cameraHideFlag){
								
								reportComponent.hideallCamera();
        						cameraHideFlag = false;	
							}
							console.log( err );
						})

					}
					function netWorkCableSnapshot () {
						
						reportComponent.takeSnapshotofnetWorkCable().then(function(data){
							
							goToGenerateReport()
						})
						.catch ( function ( err ) {
							
							if(cameraHideFlag){
								
								reportComponent.hideallCamera();
        						cameraHideFlag = false;	
							}
							console.log( err );
							
						})
						
					}
					function goToGenerateReport () {
						
						reportComponent.getDataAboutScene().then( function (data) {
							
							var reportData = data;
							//console.log( "data" + data)
							
							reportComponent.goToGenerateThreedReport(reportData).then( function( newData) {
								//console.log( newData );
								reportComponent.generatethreedReport( newData ).then( function ( reportResult ) { 
									
									reportComponent.removeClass( 'Report' , 'selectMenubar' );
									reportComponent.threedReportSucess( reportResult );
									if(cameraHideFlag){
								
										reportComponent.hideallCamera();
        								cameraHideFlag = false;	
									}
									
								})
								.catch ( function (err) {

									if(cameraHideFlag){
								
										reportComponent.hideallCamera();
        								cameraHideFlag = false;	
									}
							
									console.log( err );
								})  
								
							})
							.catch ( function (err) {

								if(cameraHideFlag){
								
									reportComponent.hideallCamera();
        							cameraHideFlag = false;	
								}
							
								console.log( err );
							}) 
							
						})
						.catch ( function (err) {

							if(cameraHideFlag){
								
								reportComponent.hideallCamera();
        						cameraHideFlag = false;	
							}
							
							console.log( err );
						}) 
						
					}
					
					function GenerateReportWithOutCamera(){
						
						
						reportComponent.startGenerateReportWithoutCamera();
						
						reportComponent.shapshotOfModel().then( function ( mainView ){
						
							reportComponent.shapshotOfModelWIthAllElement().then( function (  subView ) {
							
								reportComponent.takeSnapshotofTopView().then ( function ( topView ) {
								
									reportComponent.takeSnapshotofFrontView().then ( function ( frontView ) {
										
										reportComponent.takeSnapshotofBackView().then ( function ( backView ) {
											
											//checkPointOfInerestIsAvilable();
											reportComponent.takeSnapshotofLeftView().then ( function ( leftView ) {
											
												//checkPointOfInerestIsAvilable();
												reportComponent.takeSnapshotofRightView().then ( function ( rightView ) {
											
													checkPointOfInerestIsAvilable();
												})
												.catch( function ( err ){
													
													if(cameraHideFlag){
										
														reportComponent.hideallCamera();
														cameraHideFlag = false;	
													}
													console.log( err ) 
												})
											})
											.catch( function ( err ){
												
												if(cameraHideFlag){
									
													reportComponent.hideallCamera();
													cameraHideFlag = false;	
												}
												console.log( err ) 
											})
										})
										.catch( function ( err ){
											
											if(cameraHideFlag){
								
												reportComponent.hideallCamera();
			        							cameraHideFlag = false;	
											}
											console.log( err ) 
										})
									})
									.catch( function ( err ){
										
										if(cameraHideFlag){
								
											reportComponent.hideallCamera();
        									cameraHideFlag = false;	
										}
										console.log( err ) 
									})
								}) 
								.catch ( function ( err ){
									
									if(cameraHideFlag){
								
										reportComponent.hideallCamera();
        								cameraHideFlag = false;	
									}
									console.log( err )
								}) 
							
							})
							.catch ( function ( err ) {
								if(cameraHideFlag){
								
									reportComponent.hideallCamera();
        							cameraHideFlag = false;	
								}
								console.log( err )
							})
						})
						.catch ( function ( err ){
							
							if(cameraHideFlag){
								
								reportComponent.hideallCamera();
        						cameraHideFlag = false;	
							}
							console.log(err)
						}) 
						
					}			
					
				}
				
				
			}else {

				if(cameraHideFlag){
								
					reportComponent.hideallCamera();
        			cameraHideFlag = false;	
				}
            	toastr.error(editor.languageData.FirstsavetheprojectthentaketheReport);

			}




    });
    options.add(GenerateReport);
	
	// My Reports

    var myReports = new UI.Row();
    myReports.setClass('option');
    myReports.setTextContent(editor.languageData.MyReports);
    myReports.onClick(function() {
		
		
		if (editor.activeProject.user_id != undefined) {
			
			openReportList.show();
			reportComponent.getReportList().then( function ( result ) {
				
				var domToAppend = reportComponent.projectListModelCreate(result);
				openReportList.setModalBody( domToAppend )
			});
		}
		else{
			
			 toastr.error(editor.languageData.Openaprojectthenselectthisoptionstoviewthereports);
		}
	})
	options.add(myReports);

    return container;

};