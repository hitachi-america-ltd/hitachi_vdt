
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

            toastr.warning( "All cameras should be visible to Generate Report!!");
            return;
        }
        var classListName = document.getElementById("Report");
        if (editor.activeProject.user_id != undefined) {
            var cameraListArray = [];
            var cameraHelperArray = [];
            var refarray = [];
            var reportCamera = editor.camera.clone();
            var projectDetails = editor.activeProject;
            renderer = new THREE.WebGLRenderer({
                antialias: true
            });
            if (editor.generatReport) {

                //Modified for activity logging start
                try{

                    //Modified for activity logging start
                    var logDatas = {};
                    logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Started to generate report for "  + editor.activeProject.name;
                    logger.addLog( logDatas );
                    logger.sendLogs( localStorage.getItem( 'U_ID' ) );
                    //Modified for activity logging end

                }
                catch( exception ){

                    console.log( "Logging failed!" );
                    console.log( exception );

                }
                //Modified for activity logging end

                //editor.generatReport = false;

                editor.scene.traverse(function(child) {
                    if (child.type === 'PerspectiveCamera') {
                        cameraListArray.push(child)
                    }
                });
                if (cameraListArray.length == 0) {
                   // toastr.info(editor.languageData.NocameraintheScene);
                    GenerateReportWithOutCamera( cameraListArray );
                    return;
                }
                /* if (!(editor.topRightView && editor.topTopView && editor.topLeftView)) {

                     toastr.info("No SnapShot Of 2D view");
                     return;

                 }*/

                if ( editor.scene.userData.cameraList == undefined) {

                    toastr.info(editor.languageData.NoSnapShotforcameraView);
                    //GenerateReportWithOutCamera( cameraListArray )
                    return;

                }
                renderer = new THREE.WebGLRenderer({
                    antialias: true
                });
                function checkImageIsexit(){
                    
                    var Data = {};
                    Data.userdata = editor.scene.userData ;
                    Data.user_id = localStorage.getItem('U_ID') + editor.activeProject.name;
                   
                    $.ajax({
                        url: editor.api + 'checkscreenshot',
                        type: "POST",
                        contentType: 'application/json',
                        processData: false,
                        data: JSON.stringify(Data),
                        success: function(result) {
                            console.log("result")
                            console.log(result)
                            if(result.length == 0){

                                conformAllCameraSanapshot();
                            }
                            else{

                                for(var i=0 ; i < result.length ; i++){
                                   
                                    removeUseraDataCameraSnapshot (result[i])
                                    if(i == result.length -1){
                                        conformAllCameraSanapshot();
                                    }
                                }

                            }
                           
                           
                        },
                        error: function(err) {
                            toastr.error('Somthing went wrong try again !!!');
                            console.log(err);
                        }
                    });
                }

                checkImageIsexit();
                function removeUseraDataCameraSnapshot(currentDAta){

                    var cameraId = currentDAta.camera;
                    var cameraSnapshotList = editor.scene.userData.cameraList[cameraId ];
                    for(var j =0 ; j < cameraSnapshotList.length ;j++ ){

                        if(cameraSnapshotList[j].screenshotname == currentDAta.image){

                            editor.scene.userData.cameraList[cameraId ].splice(j, 1);
                            removeUseraDataCameraSnapshot(currentDAta);
                            break;
                        }
                    }
                    
                }

                function conformAllCameraSanapshot() {

                    var allCameraSimulaterFlage;
                    var allCameraSimulaterFlageChild = true;
                    editor.scene.traverse(function(child) {
                        if (child.type === "PerspectiveCamera") {
                            allCameraSimulaterFlage = false;
                            var seanuserdatakeys = Object.keys( editor.scene.userData.cameraList );
                            for (var i = 0; i < seanuserdatakeys.length; i++) {

                                if (child.uuid == seanuserdatakeys[i]) {
                                    var datastocheak = editor.scene.userData.cameraList[seanuserdatakeys[i]];
                                    // alert(datastocheak);
                                    if (datastocheak.length == 0) {
                                        allCameraSimulaterFlageChild = false;
                                        //allCameraSimulaterFlage =false;
                                        toastr.info(editor.languageData.Takethesnapshotofsimulatedviewofcamera + child.name);
                                        //toastr.error("Try again after take the snap shot");
                                        return;

                                    }


                                    allCameraSimulaterFlage = true;




                                }
                                if (i == seanuserdatakeys.length - 1) {

                                    if (!allCameraSimulaterFlage) {
                                        allCameraSimulaterFlageChild = false;
                                        // alert("take the simulated view of camera "+ child.name);
                                        toastr.info(editor.languageData.Takethesnapshotofsimulatedviewofcamera + child.name);
                                        toastr.error(editor.languageData.Tryagainaftertakethesnapshot);
                                        return;
                                    }

                                }

                            }


                        }

                    });
                    if (!allCameraSimulaterFlage) {


                        return;
                    }
                    if (!allCameraSimulaterFlageChild) {

                        return;
                    }
                    toastr.info(editor.languageData.PleaseWait);
                    takesnapshotofmodelNocamera();

                }



                function takesnapshotofmodelNocamera() {
                    document.getElementById("Report").className += " selectMenubar";
                    editor.pointOfinterestObject.hideAllPointOfIntrest();
                    editor.hideAreaMeasurements();
                    editor.hideLengthMeasurements();
                    editor.scene.traverse(function(child) {
                        if (child.camerauuid != undefined) {
                          
                            refarray.push(child);
                            child.visible = false;
                        }

                    });


                    for (var i = 0; i < cameraListArray.length; i++) {
                        cameraListArray[i].visible = false;
                    }
                    renderer.setSize(window.innerWidth, window.innerHeight)
                    editor.execute(new SetPositionCommand(reportCamera, new THREE.Vector3(41, 20, 34)));
                    editor.execute(new SetRotationCommand(reportCamera, new THREE.Euler(-0.523599, 0.785398, 0.401426)));
                    renderer.render(editor.scene, reportCamera);
                    var url = renderer.domElement.toDataURL().replace("image/png", "image/octet-stream");
                    var name = 'MainView';
                    var file = dataURItoBlobSnapshotofmodelNocamera(url, 'image/png', name);
                    editor.progressBar.updateProgress(editor.languageData.ReportGenerationStarted, 0.0);
                    editor.progressBar.show();
                    for (var i = 0; i < cameraListArray.length; i++) {
                        cameraListArray[i].visible = true;
                    }

                }

                function dataURItoBlobSnapshotofmodelNocamera(dataURI, type, name) {

                    editor.progressBar.updateProgress(editor.languageData.MainviewisupdatedtoServer , 0.15);
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
                    var fds = new FormData();
                    var filename = name
                    fds.append('file', file, name);
                    var uid = localStorage.getItem('U_ID') + editor.activeProject.name;
                    
                    $.ajax({
                        url: editor.api + 'cameraScreenshot/' + uid,
                        type: 'POST',
                        processData: false,
                        contentType: false,
                        data: fds,
                        success: function(response) {

                           // toastr.success("Main view is updated to Server");
                            editor.progressBar.updateProgress(editor.languageData.MainviewisupdatedtoServer, 0.25);
                            takeSnapshotofModelWithCamera();


                        },
                        error: function(jqxhr, status, msg) {
                            toastr.error("Upload Failed Try Again !!");
                            editor.pointOfinterestObject.ShowAllPointOfIntrest();
                        }
                    });

                }

                function takeSnapshotofModelWithCamera() {

                    for (var i = 0; i < cameraListArray.length; i++) {

                        var helper = new THREE.CameraHelper(cameraListArray[i], new THREE.Color(cameraListArray[i].helperColor));
                        editor.execute(new AddObjectCommand(helper));
                        cameraHelperArray.push(helper);

                    }
                    renderer.setSize(window.innerWidth, window.innerHeight)
                    editor.execute(new SetPositionCommand(reportCamera, new THREE.Vector3(41, 20, 34)));
                    editor.execute(new SetRotationCommand(reportCamera, new THREE.Euler(-0.523599, 0.785398, 0.401426)));
                    renderer.render(editor.scene, reportCamera);
                    var url = renderer.domElement.toDataURL().replace("image/png", "image/octet-stream");
                    var name = "SubmainView"
                    var file = dataURItoBlobSnapshotofmodelWithcamera(url, 'image/png', name);
                }

                function dataURItoBlobSnapshotofmodelWithcamera(dataURI, type, name) {
                    editor.progressBar.updateProgress(editor.languageData.Simulatedviewuploadedtoserver , 0.35);
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
                    var fds = new FormData();
                    var filename = name
                    fds.append('file', file, name);
                    var uid = localStorage.getItem('U_ID') + editor.activeProject.name;

                    $.ajax({
                        url: editor.api + 'cameraScreenshot/' + uid,
                        type: 'POST',
                        processData: false,
                        contentType: false,
                        data: fds,
                        success: function(response) {

                           // toastr.success("Simulated view  camera is uploaded to server");
                            editor.progressBar.updateProgress(editor.languageData.Simulatedviewuploadedtoserver , 0.50);
                            for (var i = 0; i < cameraHelperArray.length; i++) {

                                editor.execute(new RemoveObjectCommand(cameraHelperArray[i]));

                            }
                            takeSnapshotofTopView();


                        },
                        error: function(jqxhr, status, msg) {
                            toastr.error("Upload Failed Try Again !!");
                            editor.pointOfinterestObject.ShowAllPointOfIntrest();
                        }
                    });

                }

                function takeSnapshotofTopView() {
                    cameraHelperArray = [];
                    for (var i = 0; i < cameraListArray.length; i++) {

                        var helper = new THREE.CameraHelper(cameraListArray[i], new THREE.Color(cameraListArray[i].helperColor));
                        editor.execute(new AddObjectCommand(helper));
                        cameraHelperArray.push(helper);

                    }
                    renderer.setSize(window.innerWidth, window.innerHeight)
                    editor.execute(new SetPositionCommand(reportCamera, new THREE.Vector3(00, 51, 00)));
                    editor.execute(new SetRotationCommand(reportCamera, new THREE.Euler(-1.5708, 0, 0)));
                    renderer.render(editor.scene, reportCamera);
                    var url = renderer.domElement.toDataURL().replace("image/png", "image/octet-stream");
                    var name = "TopView";
                    editor.progressBar.updateProgress(editor.languageData.TwoDviewuploadedtoserver , 0.55);
                    var file = dataURItoBlobSnapshotofTwodView(url, 'image/png', name, takeSnapshotofLeftView);
                }
                var takeSnapshotofLeftView = function() {

                    cameraHelperArray = [];
                    for (var i = 0; i < cameraListArray.length; i++) {

                        var helper = new THREE.CameraHelper(cameraListArray[i], new THREE.Color(cameraListArray[i].helperColor));
                        editor.execute(new AddObjectCommand(helper));
                        cameraHelperArray.push(helper);


                    }
                    renderer.setSize(window.innerWidth, window.innerHeight)
                    editor.execute(new SetPositionCommand(reportCamera, new THREE.Vector3(-60, 00, 00)));
                    editor.execute(new SetRotationCommand(reportCamera, new THREE.Euler(-1.5708, -1.5708, -1.5708)));
                    renderer.render(editor.scene, reportCamera);
                    var url = renderer.domElement.toDataURL().replace("image/png", "image/octet-stream");
                    var name = "LeftView";
                    editor.progressBar.updateProgress(editor.languageData.TwoDviewuploadedtoserver , 0.65);
                    var file = dataURItoBlobSnapshotofTwodView(url, 'image/png', name, takeSnapshotofPointOfInterest);
                }
                var takeSnapshotofRightView = function() {
                    cameraHelperArray = [];
                    for (var i = 0; i < cameraListArray.length; i++) {

                        var helper = new THREE.CameraHelper(cameraListArray[i], new THREE.Color(cameraListArray[i].helperColor));
                        editor.execute(new AddObjectCommand(helper));
                        cameraHelperArray.push(helper);

                    }
                    renderer.setSize(window.innerWidth, window.innerHeight)
                    editor.execute(new SetPositionCommand(reportCamera, new THREE.Vector3(60, 00, 00)));
                    editor.execute(new SetRotationCommand(reportCamera, new THREE.Euler(-3.14159, 1.5708, 3.14159)));
                    renderer.render(editor.scene, reportCamera);
                    var url = renderer.domElement.toDataURL().replace("image/png", "image/octet-stream");
                    var name = "RightView";
                    editor.progressBar.updateProgress(editor.languageData.TwoDviewuploadedtoserver, 0.68);
                    var file = dataURItoBlobSnapshotofTwodView(url, 'image/png', name, takeThreedReport);
                }
                var takeSnapshotofPointOfInterest = function (){

                    editor.pointOfinterestObject.ShowAllPointOfIntrest();

                    cameraHelperArray = [];
                    for (var i = 0; i < cameraListArray.length; i++) {
                        cameraListArray[i].visible = false;
                    }
                    renderer.setSize(window.innerWidth, window.innerHeight)
                    editor.execute(new SetPositionCommand(reportCamera, new THREE.Vector3(00, 51, 00)));
                    editor.execute(new SetRotationCommand(reportCamera, new THREE.Euler(-1.5708, 0, 0)));
                    renderer.render(editor.scene, reportCamera);
                    var url = renderer.domElement.toDataURL().replace("image/png", "image/octet-stream");
                    var name = "PointOfIntrest";
                    editor.progressBar.updateProgress(editor.languageData.TwoDviewuploadedtoserver , 0.70);
                    var file = dataURItoBlobSnapshotofTwodView(url, 'image/png', name, takeSnapshotofLengthMesurement);
                    editor.pointOfinterestObject.hideAllPointOfIntrest();
                    for (var i = 0; i < cameraListArray.length; i++) {
                        cameraListArray[i].visible = true;
                    }

                }
                var takeSnapshotofLengthMesurement = function (){

                    //editor.pointOfinterestObject.ShowAllPointOfIntrest();
                    editor.showLengthMeasurements();
                    cameraHelperArray = [];
                    for (var i = 0; i < cameraListArray.length; i++) {
                        cameraListArray[i].visible = false;
                    }
                    renderer.setSize(window.innerWidth, window.innerHeight)
                    editor.execute(new SetPositionCommand(reportCamera, new THREE.Vector3(00, 51, 00)));
                    editor.execute(new SetRotationCommand(reportCamera, new THREE.Euler(-1.5708, 0, 0)));
                    renderer.render(editor.scene, reportCamera);
                    var url = renderer.domElement.toDataURL().replace("image/png", "image/octet-stream");
                    var name = "LengthMesurement";
                    editor.progressBar.updateProgress(editor.languageData.TwoDviewuploadedtoserver , 0.55);
                    var file = dataURItoBlobSnapshotofTwodView(url, 'image/png', name, takeSnapshotofAreaMesurement);
                    if(editor.lengthShowHideToggle === false){

                        editor.hideLengthMeasurements();
                    }
                   

                    for (var i = 0; i < cameraListArray.length; i++) {
                        cameraListArray[i].visible = true;
                    }

                }
                var takeSnapshotofAreaMesurement = function (){

                    editor.showAreaMeasurements();

                    cameraHelperArray = [];
                    for (var i = 0; i < cameraListArray.length; i++) {
                        cameraListArray[i].visible = false;
                    }
                    renderer.setSize(window.innerWidth, window.innerHeight)
                    editor.execute(new SetPositionCommand(reportCamera, new THREE.Vector3(00, 51, 00)));
                    editor.execute(new SetRotationCommand(reportCamera, new THREE.Euler(-1.5708, 0, 0)));
                    renderer.render(editor.scene, reportCamera);
                    var url = renderer.domElement.toDataURL().replace("image/png", "image/octet-stream");
                    var name = "AreaMesurement";
                    editor.progressBar.updateProgress(editor.languageData.TwoDviewuploadedtoserver , 0.55);
                    var file = dataURItoBlobSnapshotofTwodView(url, 'image/png', name, takeSnapshotofRightView);
                    
                    if(editor.areaShowHideToggle === false){

                        editor.hideAreaMeasurements();
                    }

                    for (var i = 0; i < cameraListArray.length; i++) {
                        cameraListArray[i].visible = true;
                    }

                }


                function dataURItoBlobSnapshotofTwodView(dataURI, type, name, callback) {

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
                    var fds = new FormData();
                    var filename = name
                    fds.append('file', file, name);
                    var uid = localStorage.getItem('U_ID') + editor.activeProject.name;

                    $.ajax({
                        url: editor.api + 'cameraScreenshot/' + uid,
                        type: 'POST',
                        processData: false,
                        contentType: false,
                        data: fds,
                        success: function(response) {

                           // toastr.success(" TwoD view added to report");
                            editor.progressBar.updateProgress(editor.languageData.TwoDviewuploadedtoserver, 0.80);
                            for (var i = 0; i < cameraHelperArray.length; i++) {

                                editor.execute(new RemoveObjectCommand(cameraHelperArray[i]));

                            }
                            if (name == "RightView") {
                                callback(reportGenerate);
                            } else {
                                callback();
                            }



                        },
                        error: function(jqxhr, status, msg) {
                            editor.pointOfinterestObject.ShowAllPointOfIntrest();
                            if(editor.areaShowHideToggle === false){

                                editor.hideAreaMeasurements();
                            }
                            if(editor.lengthShowHideToggle === false){

                                editor.hideLengthMeasurements();
                            }
                            toastr.error("Upload Failed Try Again !!");
                        }
                    });

                }




                var dataReport = [];
                var editorCameraObject = [];
                var getReportDataScean = function(){
                    return new Promise(function( resolve, reject ){
                        
                        var UserDataScean = editor.scene.userData.cameraList;
                        var SceenUserData = Object.assign({} , editor.scene.userData.cameraList) 
                        var SceenUserDataKeys = Object.keys(SceenUserData);
                        var editorCameraObject = [];

                        if(editor.scene.userData.cameraList['editorCamera'] == undefined){
                            dataReport.push( SceenUserData );
                            dataReport.push(editor.activeProject);
                            dataReport.push(localStorage.getItem('email'));
                            dataReport.push( editor.scene.userData );
                            resolve(dataReport);
                            return;
                        }

                        for(var i = 0 ; i < SceenUserDataKeys.length ; i++){
                           
                            if(SceenUserDataKeys[i] == 'editorCamera')
                            {
                                editor.scene.userData.twodSnapshot = {}
                                editorCameraObject.push(editor.scene.userData.cameraList['editorCamera']) ;
                                delete SceenUserData["editorCamera"];
                                editor.scene.userData.twodSnapshot['editorCamera'] = editor.scene.userData.cameraList['editorCamera']
                                
                                dataReport.push( SceenUserData );
                                dataReport.push(editor.activeProject);
                                dataReport.push(localStorage.getItem('email'));
                                dataReport.push( editor.scene.userData );
                                
                                resolve(dataReport);
                                return
                            }
                            
                                     
                        
                        }
                        

                    })
                }
                var takeThreedReport = function(callback) {

                    for (var i = 0; i < refarray.length; i++) {
                        refarray[i].visible = true;
                    }
                    getReportDataScean().then(function(dataReports) {
                        console.log("dataReport"); 
                        console.log(dataReports); 
                        var sceneData = editor.scene.children;
                        for (var i = 0; i < sceneData.length; i++) {
    
                            if (sceneData[i].type === "PerspectiveCamera") {
    
                                var camData = {};
                                camData.name = sceneData[i].name;
                                camData.uuid = sceneData[i].uuid;
                                camData.location = sceneData[i].position;
                                camData.rotation = sceneData[i].rotation;
                                camData.userData = sceneData[i].userData;
                                camData.focus = sceneData[i].focus;
                                camData.distance = sceneData[i].far - sceneData[i].near;
                                dataReport.push(camData);

    
                            }
                            if (i == sceneData.length - 1) {
                            
                                callback();
    
                            }
    
                        }
                    },
                    function(err) {
                        console.log(err); // Error: "It broke"
                    });
                    
                     
                   
                  

                }
                var reportGenerate = function() {
                    editor.progressBar.updateProgress(editor.languageData.Reportgenerating,0.90);
                    $.ajax({
                        url: editor.api + 'Report3D',
                        type: "POST",
                        contentType: 'application/json',
                        processData: false,
                        data: JSON.stringify(dataReport),
                        success: function(result) {

                            console.log( dataReport );
                            editor.progressBar.updateProgress(editor.languageData.Reportgenerating ,0.99);
                            console.log(result.body.message.filename);
                            var reportFileName = result.body.message.filename;
                            editor.pointOfinterestObject.ShowAllPointOfIntrest();
                            editor.scene.userData.twodSnapshot={}    
                            setTimeout(function() {

                                var linkElement = document.createElement('a');
                                classListName.classList.remove("selectMenubar");
                                try {
                                  /*  url = editor.path + '/output/uploadurl/' + projectDetails.user_id + projectDetails.name + '/cameraScreenShot/' + reportFileName + '.pdf';
                                    linkElement.setAttribute('href', url);
                                    linkElement.setAttribute("download", reportFileName + '.pdf');
                                    var clickEvent = new MouseEvent("click", {
                                        "view": window,
                                        "bubbles": true,
                                        "cancelable": false
                                    });
                                    linkElement.dispatchEvent(clickEvent);*/
                
                                    renderer.dispose();
                                    toastr.info(editor.languageData.Reportgenerationcompletednowyoucanopenthereport);
                                    editor.progressBar.hide();                                    
                                } catch (ex) {
                                    toastr.error("Some error in Downloading Pdf");
                                    editor.pointOfinterestObject.ShowAllPointOfIntrest();
                                    renderer.dispose();
                                }
                            }, 5000);

                            //Modified for activity logging start
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
                        error: function(err) {

                            toastr.error(editor.languageData.SomethingwentwrongwiththeserverPleasetryagain);
                            renderer.dispose();
                            editor.pointOfinterestObject.ShowAllPointOfIntrest();

                            //Modified for activity logging start
                            try{

                                //Modified for activity logging start
                                var logDatas = {};
                                logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Failed to generate report for "  + editor.activeProject.name + " : " + err;
                                logger.addLog( logDatas );
                                logger.sendLogs( localStorage.getItem( 'U_ID' ) );
                                //Modified for activity logging end

                            }
                            catch( exception ){

                                console.log( "Logging failed!" );
                                console.log( exception );

                            }
                            //Modified for activity logging end

                        }
                    });

                }



            }

        } else {

            toastr.error(editor.languageData.FirstsavetheprojectthentaketheReport);

        }




    });
    options.add(GenerateReport);



    function GenerateReportWithOutCamera(cameraData){
       
        //Modified for activity logging start
        try{

            //Modified for activity logging start
            var logDatas = {};
            logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Started to generate report(Without camera) for "  + editor.activeProject.name;
            logger.addLog( logDatas );
            logger.sendLogs( localStorage.getItem( 'U_ID' ) );
            //Modified for activity logging end

        }
        catch( exception ){

            console.log( "Logging failed!" );
            console.log( exception );

        }
        //Modified for activity logging end

        console.log( " GenerateReportWithOutCamera" );
        var cameraListArray = [];
        var cameraHelperArray = [];
        var refarray = [];
        var dataReport = [];
        var reportCamera = editor.camera.clone();
        var projectDetails = editor.activeProject;
        renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        takesnapshotofmodelNocamera();
        function takesnapshotofmodelNocamera() {
           
            cameraListArray = cameraData

            document.getElementById("Report").className += " selectMenubar";
            editor.pointOfinterestObject.hideAllPointOfIntrest();
            editor.hideAreaMeasurements();
            editor.hideLengthMeasurements();

            if(cameraListArray.length > 0){

                editor.scene.traverse(function(child) {
                    if (child.camerauuid != undefined) {
                      
                        refarray.push(child);
                        child.visible = false;
                    }
    
                });

            }


            if(cameraListArray.length > 0){
                for (var i = 0; i < cameraListArray.length; i++) {
                    cameraListArray[i].visible = false;
                }
            }
            renderer.setSize(window.innerWidth, window.innerHeight)
            editor.execute(new SetPositionCommand(reportCamera, new THREE.Vector3(41, 20, 34)));
            editor.execute(new SetRotationCommand(reportCamera, new THREE.Euler(-0.523599, 0.785398, 0.401426)));
            renderer.render(editor.scene, reportCamera);
            var url = renderer.domElement.toDataURL().replace("image/png", "image/octet-stream");
            var name = 'MainView';
            var file = dataURItoBlobSnapshotofmodelNocamera(url, 'image/png', name);
            editor.progressBar.updateProgress(editor.languageData.ReportGenerationStarted, 0.0);
            editor.progressBar.show();

            if(cameraListArray.length > 0){
                for (var i = 0; i < cameraListArray.length; i++) {
                    cameraListArray[i].visible = true;
                }
            }



        }

        function dataURItoBlobSnapshotofmodelNocamera(dataURI, type, name) {

            editor.progressBar.updateProgress(editor.languageData.MainviewisupdatedtoServer , 0.15);
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
            var fds = new FormData();
            var filename = name
            fds.append('file', file, name);
            var uid = localStorage.getItem('U_ID') + editor.activeProject.name;
            
            $.ajax({
                url: editor.api + 'cameraScreenshot/' + uid,
                type: 'POST',
                processData: false,
                contentType: false,
                data: fds,
                success: function(response) {
                    
                   
                   // toastr.success("Main view is updated to Server");
                    editor.progressBar.updateProgress(editor.languageData.MainviewisupdatedtoServer, 0.25);
                    takeSnapshotofModelWithCamera();


                },
                error: function(jqxhr, status, msg) {
                    toastr.error("Upload Failed Try Again !!");
                    editor.pointOfinterestObject.ShowAllPointOfIntrest();
                }
            });

        }
        function takeSnapshotofModelWithCamera() {
					
            if( cameraListArray.length > 0 ){
                
                for (var i = 0; i < cameraListArray.length; i++) {

                    var helper = new THREE.CameraHelper(cameraListArray[i], new THREE.Color(cameraListArray[i].helperColor));
                    editor.execute(new AddObjectCommand(helper));
                    cameraHelperArray.push(helper);

                }
            }

            renderer.setSize(window.innerWidth, window.innerHeight)
            editor.execute(new SetPositionCommand(reportCamera, new THREE.Vector3(41, 20, 34)));
            editor.execute(new SetRotationCommand(reportCamera, new THREE.Euler(-0.523599, 0.785398, 0.401426)));
            renderer.render(editor.scene, reportCamera);
            var url = renderer.domElement.toDataURL().replace("image/png", "image/octet-stream");
            var name = "SubmainView"
            var file = dataURItoBlobSnapshotofmodelWithcamera(url, 'image/png', name);
            
            
        }
        
        function dataURItoBlobSnapshotofmodelWithcamera(dataURI, type, name) {
        
            editor.progressBar.updateProgress(editor.languageData.Simulatedviewuploadedtoserver , 0.35);
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
            var fds = new FormData();
            var filename = name
            fds.append('file', file, name);
            var uid = localStorage.getItem('U_ID') + editor.activeProject.name;

            $.ajax({
                url: editor.api + 'cameraScreenshot/' + uid,
                type: 'POST',
                processData: false,
                contentType: false,
                data: fds,
                success: function(response) {

                   // toastr.success("Simulated view  camera is uploaded to server");
                    editor.progressBar.updateProgress(editor.languageData.Simulatedviewuploadedtoserver , 0.50);
                    if( cameraListArray.length > 0 ){
                        
                        for (var i = 0; i < cameraHelperArray.length; i++) {

                            editor.execute(new RemoveObjectCommand(cameraHelperArray[i]));

                        }
                        
                    }
                    takeSnapshotofTopView();


                },
                error: function(jqxhr, status, msg) {
                    toastr.error("Upload Failed Try Again !!");
                    editor.pointOfinterestObject.ShowAllPointOfIntrest();
                }
            });

        }	

        function takeSnapshotofTopView() {
            cameraHelperArray = [];
            if( cameraListArray.length >0) {
                for (var i = 0; i < cameraListArray.length; i++) {

                    var helper = new THREE.CameraHelper(cameraListArray[i], new THREE.Color(cameraListArray[i].helperColor));
                    editor.execute(new AddObjectCommand(helper));
                    cameraHelperArray.push(helper);

                }
            }
            renderer.setSize(window.innerWidth, window.innerHeight)
            editor.execute(new SetPositionCommand(reportCamera, new THREE.Vector3(00, 51, 00)));
            editor.execute(new SetRotationCommand(reportCamera, new THREE.Euler(-1.5708, 0, 0)));
            renderer.render(editor.scene, reportCamera);
            var url = renderer.domElement.toDataURL().replace("image/png", "image/octet-stream");
            var name = "TopView";
            editor.progressBar.updateProgress(editor.languageData.TwoDviewuploadedtoserver , 0.55);
            var file = dataURItoBlobSnapshotofTwodView(url, 'image/png', name, takeSnapshotofLeftView);
        }
        var takeSnapshotofLeftView = function() {

            cameraHelperArray = [];
            if(  cameraListArray.length >0 ){
                
                for (var i = 0; i < cameraListArray.length; i++) {

                    var helper = new THREE.CameraHelper(cameraListArray[i], new THREE.Color(cameraListArray[i].helperColor));
                    editor.execute(new AddObjectCommand(helper));
                    cameraHelperArray.push(helper);


                }
            }

            renderer.setSize(window.innerWidth, window.innerHeight)
            editor.execute(new SetPositionCommand(reportCamera, new THREE.Vector3(-60, 00, 00)));
            editor.execute(new SetRotationCommand(reportCamera, new THREE.Euler(-1.5708, -1.5708, -1.5708)));
            renderer.render(editor.scene, reportCamera);
            var url = renderer.domElement.toDataURL().replace("image/png", "image/octet-stream");
            var name = "LeftView";
            editor.progressBar.updateProgress(editor.languageData.TwoDviewuploadedtoserver , 0.65);
            var file = dataURItoBlobSnapshotofTwodView(url, 'image/png', name, takeSnapshotofPointOfInterest);
        }
        var takeSnapshotofRightView = function() {
            cameraHelperArray = [];
            if(  cameraListArray.length >0 ){
                for (var i = 0; i < cameraListArray.length; i++) {

                    var helper = new THREE.CameraHelper(cameraListArray[i], new THREE.Color(cameraListArray[i].helperColor));
                    editor.execute(new AddObjectCommand(helper));
                    cameraHelperArray.push(helper);

                }
            }
            renderer.setSize(window.innerWidth, window.innerHeight)
            editor.execute(new SetPositionCommand(reportCamera, new THREE.Vector3(60, 00, 00)));
            editor.execute(new SetRotationCommand(reportCamera, new THREE.Euler(-3.14159, 1.5708, 3.14159)));
            renderer.render(editor.scene, reportCamera);
            var url = renderer.domElement.toDataURL().replace("image/png", "image/octet-stream");
            var name = "RightView";
            editor.progressBar.updateProgress(editor.languageData.TwoDviewuploadedtoserver, 0.70);
            var file = dataURItoBlobSnapshotofTwodView(url, 'image/png', name, takeThreedReport);
        }
        var takeSnapshotofPointOfInterest = function (){

            editor.pointOfinterestObject.ShowAllPointOfIntrest();

            cameraHelperArray = [];
            if(  cameraListArray.length >0 ){
                for (var i = 0; i < cameraListArray.length; i++) {
                    cameraListArray[i].visible = false;
                }
            }
            renderer.setSize(window.innerWidth, window.innerHeight)
            editor.execute(new SetPositionCommand(reportCamera, new THREE.Vector3(00, 51, 00)));
            editor.execute(new SetRotationCommand(reportCamera, new THREE.Euler(-1.5708, 0, 0)));
            renderer.render(editor.scene, reportCamera);
            var url = renderer.domElement.toDataURL().replace("image/png", "image/octet-stream");
            var name = "PointOfIntrest";
            editor.progressBar.updateProgress(editor.languageData.TwoDviewuploadedtoserver , 0.55);
            var file = dataURItoBlobSnapshotofTwodView(url, 'image/png', name, takeSnapshotofLengthMesurement);
            editor.pointOfinterestObject.hideAllPointOfIntrest();
            if(  cameraListArray.length >0 ){
                for (var i = 0; i < cameraListArray.length; i++) {
                    cameraListArray[i].visible = true;
                }
            }

        }
        var takeSnapshotofLengthMesurement = function (){

            //editor.pointOfinterestObject.ShowAllPointOfIntrest();
            editor.showLengthMeasurements();
            cameraHelperArray = [];
            if(  cameraListArray.length >0 ){
                for (var i = 0; i < cameraListArray.length; i++) {
                    cameraListArray[i].visible = false;
                }
            }
            renderer.setSize(window.innerWidth, window.innerHeight)
            editor.execute(new SetPositionCommand(reportCamera, new THREE.Vector3(00, 51, 00)));
            editor.execute(new SetRotationCommand(reportCamera, new THREE.Euler(-1.5708, 0, 0)));
            renderer.render(editor.scene, reportCamera);
            var url = renderer.domElement.toDataURL().replace("image/png", "image/octet-stream");
            var name = "LengthMesurement";
            editor.progressBar.updateProgress(editor.languageData.TwoDviewuploadedtoserver , 0.55);
            var file = dataURItoBlobSnapshotofTwodView(url, 'image/png', name, takeSnapshotofAreaMesurement);
            if(editor.lengthShowHideToggle === false){

                editor.hideLengthMeasurements();
            }
           
            if(  cameraListArray.length >0 ){
                for (var i = 0; i < cameraListArray.length; i++) {
                    cameraListArray[i].visible = true;
                }
            }

        }
        var takeSnapshotofAreaMesurement = function (){

            editor.showAreaMeasurements();

            cameraHelperArray = [];
            if(  cameraListArray.length >0 ){
                for (var i = 0; i < cameraListArray.length; i++) {
                    cameraListArray[i].visible = false;
                }
            }
            renderer.setSize(window.innerWidth, window.innerHeight)
            editor.execute(new SetPositionCommand(reportCamera, new THREE.Vector3(00, 51, 00)));
            editor.execute(new SetRotationCommand(reportCamera, new THREE.Euler(-1.5708, 0, 0)));
            renderer.render(editor.scene, reportCamera);
            var url = renderer.domElement.toDataURL().replace("image/png", "image/octet-stream");
            var name = "AreaMesurement";
            editor.progressBar.updateProgress(editor.languageData.TwoDviewuploadedtoserver , 0.55);
            var file = dataURItoBlobSnapshotofTwodView(url, 'image/png', name, takeSnapshotofRightView);
            
            if(editor.areaShowHideToggle === false){

                editor.hideAreaMeasurements();
            }
            
            if(  cameraListArray.length >0 ){
                for (var i = 0; i < cameraListArray.length; i++) {
                    cameraListArray[i].visible = true;
                }
            }

        }
        
        var takeThreedReport = function(callback) {
                
            if(  cameraListArray.length >0 ){
            
                for (var i = 0; i < refarray.length; i++) {
                    refarray[i].visible = true;
                }
            }

            var sceneData = editor.scene.children;

            dataReport.push(editor.activeProject);
            dataReport.push(localStorage.getItem('email'));
            dataReport.push( editor.scene.userData );
                 
            for (var i = 0; i < sceneData.length; i++) {

                if (sceneData[i].type === "PerspectiveCamera") {

                    var camData = {};
                    camData.name = sceneData[i].name;
                    camData.uuid = sceneData[i].uuid;
                    camData.location = sceneData[i].position;
                    camData.rotation = sceneData[i].rotation;
                    camData.userData = sceneData[i].userData;
                    camData.focus = sceneData[i].focus;
                    camData.distance = sceneData[i].far - sceneData[i].near;
                    dataReport.push(camData);


                }
                if (i == sceneData.length - 1) {
                    console.log("dataReport");
                    console.log(dataReport);
                    callback();

                }

            }                                                     

        }
        var reportGenerate = function() {
            console.log("asda");
            editor.progressBar.updateProgress(editor.languageData.Reportgenerating,0.90);
            $.ajax({
                url: editor.api + 'Report3dWithoutCamera',
                type: "POST",
                contentType: 'application/json',
                processData: false,
                data: JSON.stringify(dataReport),
                success: function(result) {

                    console.log( dataReport );
                    editor.progressBar.updateProgress(editor.languageData.Reportgenerating ,0.99);
                    console.log(result.body.message.filename);
                    var reportFileName = result.body.message.filename;
                    editor.pointOfinterestObject.ShowAllPointOfIntrest();
                    editor.scene.userData.twodSnapshot={}    
                    setTimeout(function() {

                        var linkElement = document.createElement('a');
                        var classListName = document.getElementById("Report");
                        classListName.classList.remove("selectMenubar");
                        try {
                          
        
                            renderer.dispose();
                            toastr.info(editor.languageData.Reportgenerationcompletednowyoucanopenthereport);
                            editor.progressBar.hide();                                    
                        } catch (ex) {
                            toastr.error("Some error in Downloading Pdf");
                            editor.pointOfinterestObject.ShowAllPointOfIntrest();
                            renderer.dispose();
                        }
                    }, 5000);

                    //Modified for activity logging start
                    try{

                        //Modified for activity logging start
                        var logDatas = {};
                        logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Finished report preparation (Without camera) for "  + editor.activeProject.name + " : " + result.body.message.filename;
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
                error: function(err) {

                    toastr.error(editor.languageData.SomethingwentwrongwiththeserverPleasetryagain);
                    renderer.dispose();
                    editor.pointOfinterestObject.ShowAllPointOfIntrest();

                    //Modified for activity logging start
                    try{

                        //Modified for activity logging start
                        var logDatas = {};
                        logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Failed to generate report (Without camera) for "  + editor.activeProject.name + " : " + err;
                        logger.addLog( logDatas );
                        logger.sendLogs( localStorage.getItem( 'U_ID' ) );
                        //Modified for activity logging end

                    }
                    catch( exception ){

                        console.log( "Logging failed!" );
                        console.log( exception );

                    }
                    //Modified for activity logging end

                }
            });

        }
        
        function dataURItoBlobSnapshotofTwodView(dataURI, type, name, callback) {

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
            var fds = new FormData();
            var filename = name
            fds.append('file', file, name);
            var uid = localStorage.getItem('U_ID') + editor.activeProject.name;

            $.ajax({
                url: editor.api + 'cameraScreenshot/' + uid,
                type: 'POST',
                processData: false,
                contentType: false,
                data: fds,
                success: function(response) {

                   // toastr.success(" TwoD view added to report");
                    editor.progressBar.updateProgress(editor.languageData.TwoDviewuploadedtoserver, 0.80);
                    for (var i = 0; i < cameraHelperArray.length; i++) {

                        editor.execute(new RemoveObjectCommand(cameraHelperArray[i]));

                    }
                    if (name == "RightView") {
                    //alert("all added")
                        callback(reportGenerate);
                    } else {
                        callback();
                    }



                },
                error: function(jqxhr, status, msg) {
                    editor.pointOfinterestObject.ShowAllPointOfIntrest();
                    if(editor.areaShowHideToggle === false){

                        editor.hideAreaMeasurements();
                    }
                    if(editor.lengthShowHideToggle === false){

                        editor.hideLengthMeasurements();
                    }
                    toastr.error("Upload Failed Try Again !!");
                }
            });
           


        }


    }

    // My Reports

    var myReports = new UI.Row();
    myReports.setClass('option');
    myReports.setTextContent(editor.languageData.MyReports);
    myReports.onClick(function() {

        //  document.getElementById("Report").className += " selectMenubar";

        if (editor.activeProject.user_id != undefined) {

            openReportList.show();
            getReportList();
            function getReportList (){

                var openReport = function(paramsArray){
					
                    var reportData = paramsArray[0];
                    var url = editor.path + reportData.url;
                    window.open(url,'_blank');

                    //Modified for activity logging start
                    try{

                        //Modified for activity logging start
                        var logDatas = {};
                        logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Opened project report for " + editor.activeProject.name + " : " + url;
                        logger.addLog( logDatas );
                        logger.sendLogs( localStorage.getItem( 'U_ID' ) );
                        //Modified for activity logging end

                    }
                    catch( exception ){

                        console.log( "Logging failed!" );
                        console.log( exception );

                    }
                    //Modified for activity logging end

                }

                var copyLinkReportClick = function(paramsArray){
                    var id = paramsArray[0];
                    var copyFrom = document.getElementById( id );
                    copyFrom.select();
                    document.execCommand( 'Copy' );
                    toastr.info( editor.languageData.Copiedtoclipboard );
                }

                var onDeleteReportClick = function(paramsArray) {
                    
                    var reportData = paramsArray[0];
                    var reportDomElement = paramsArray[1];
                    var deleteReport = new ApiHandler();
                    deleteReport.prepareRequest({
                    
                        method: 'GET',
                        url: editor.api + 'Report/trash/' + reportData._id,
                        responseType: 'json',
                        isDownload: false,
                        formDataNeeded: false,
                        formData: null
                    
                    });
                    deleteReport.onStateChange(function(response) {
                    
                        var cardToRemove = document.getElementById(reportDomElement.dom.id);
                            if (cardToRemove) {
                    
                                var parent = cardToRemove.parentNode;
                                parent.removeChild(cardToRemove);
                    
                            }
                        toastr.success(editor.languageData.Reportremovedsuccessfully);

                        //Modified for activity logging start
                        try{

                            //Modified for activity logging start
                            var logDatas = {};
                            logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Removed project report "  + reportData.name;
                            logger.addLog( logDatas );
                            logger.sendLogs( localStorage.getItem( 'U_ID' ) );
                            //Modified for activity logging end

                        }
                        catch( exception ){

                            console.log( "Logging failed!" );
                            console.log( exception );

                        }
                        //Modified for activity logging end
                    
                    },function(error) {
                    
                        console.log(error);
                        toastr.error(editor.languageData.SorrysomethingwentwrongPleasetryagainaftersometime);

                        //Modified for activity logging start
                        try{

                            //Modified for activity logging start
                            var logDatas = {};
                            logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Failed to remove project report "  + reportData.name;
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
                        
                    deleteReport.sendRequest();
                    
                }	


                var downloadReportClick = function(param){

                    var downloadData = param[0];
                    console.log(downloadData);
                    var linkElement = document.createElement('a');
                    try {
                        url = editor.path + downloadData.url;
                        console.log(url)
                        linkElement.setAttribute('href', url);
                        linkElement.setAttribute("download", downloadData.filename + '.pdf');
                        var clickEvent = new MouseEvent("click", {
                            "view": window,
                            "bubbles": true,
                            "cancelable": false
                        });

                        linkElement.dispatchEvent(clickEvent);

                        //Modified for activity logging start
                        try{

                            //Modified for activity logging start
                            var logDatas = {};
                            logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Downloaded project report "  + downloadData.filename + ".pdf";
                            logger.addLog( logDatas );
                            logger.sendLogs( localStorage.getItem( 'U_ID' ) );
                            //Modified for activity logging end

                        }
                        catch( exception ){

                            console.log( "Logging failed!" );
                            console.log( exception );

                        }
                        //Modified for activity logging end
                       
                    } catch (ex) {
                        console.log(ex)
                        toastr.error(editor.languageData.SomeerrorinDownloadingPdf);

                        //Modified for activity logging start
                        try{

                            //Modified for activity logging start
                            var logDatas = {};
                            logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Failed to downloaded project report "  + downloadData.filename + ".pdf" + " : " + ex;
                            logger.addLog( logDatas );
                            logger.sendLogs( localStorage.getItem( 'U_ID' ) );
                            //Modified for activity logging end

                        }
                        catch( exception ){

                            console.log( "Logging failed!" );
                            console.log( exception );

                        }
                        //Modified for activity logging end
                       
                    }

                }
                var report3dData, report3dDataCount = 0;
                var report3dDataModalBody = document.createElement('div');
                report3dDataModalBody.className = 'row';
                
                var defaultModalBodyContent = document.createElement('div');
                defaultModalBodyContent.setAttribute('class', 'text-center');
                defaultModalBodyContent.setAttribute('style', 'font-size: 20px; color: #b5afaf');
                defaultModalBodyContent.innerHTML = ' <strong>'+ editor.languageData.Nothingtoshowhere+'</strong>';

                var genReportList = new ApiHandler();
                genReportList.prepareRequest({
                    method: 'GET',
                    url: editor.api + 'report/users/' + localStorage.getItem('U_ID'),
                    responseType: 'json',
                    isDownload: false,
                    formDataNeeded: false,
                    formData: ''
                });
                genReportList.onStateChange(function(result) {
                    var count = 0
                    console.log("result");	
                    console.log(result);	
                    if (result !== undefined) {
                        report3dData = result;
                        if (report3dData.length != 0) {
                            report3dData.forEach(function(ReportData) {
                                count = count+1;
                                if (ReportData !== undefined) {
                                    var projectLocation = editor.languageData.location +':'+ ReportData.location;
                                    
                                    //var img =  editor.path +'/projects3d/'+localStorage.getItem("U_ID")+ '/maplocations/'+ReportData.name+'.png'	;
                                    var cardFooterValue = (ReportData.updated_at != undefined && project.updated_at != null) ? ReportData.updated_at : ReportData.created_at;
                                    var card = new UI.BootstrapCard('open-project-card-' + report3dDataCount, ReportData.filename, projectLocation, editor.languageData.Open ,editor.languageData.Delete, cardFooterValue);
                                    card.setCardButton(editor.languageData.download);
                                    card.setCardText( editor.languageData.ToatlNoOfCamera + ReportData.totalCamera);
                                   
                                    card.setWraperClass(' col-sm-3');
                                    card.setWraperStyle('border: 1px solid #cccccc;padding-left: 0px;padding-right: 0px;');
                                    card.setHeaderStyle('font-size: 21px;background-color: #e0e0e0;border-bottom: 1px solid #cccccc;overflow: hidden;text-overflow: clip;');
                                    card.setBodyStyle('padding-top: 18px;');
                                    var link = editor.path+ReportData.url ;
                                    var inputid = 'reportlink'+count;
                                    card.setShareLink(link,inputid,editor.languageData.copyLink,editor.languageData.ShareableLink);
                                    //card.setBodyStyle('background-image :url('+img+');height: 70px;')
                                    card.setFooterStyle('padding-top: 10px;margin-top: 10px;font-size: 12px;border-top: 1px solid #cccccc;background-color: #e0e0e0;');
                                    card.setSubmitCallback(openReport, [ReportData, card]);
                                    card.setCancelCallback(onDeleteReportClick, [ReportData, card]);
                                    card.setDownloadCallback(downloadReportClick, [ReportData, card]);
                                    card.setCopyCallback(copyLinkReportClick, [inputid, card]);
                                    report3dDataModalBody.appendChild(card.dom);
           
                                }
                                report3dDataCount++;
           
                            });
                            openReportList.setModalBody(report3dDataModalBody);
           
                        } else {
                            openReportList.setModalBody(defaultModalBodyContent);
                        }
                        openReportList.show();
                    } else {
                        openReportList.setModalBody(defaultModalBodyContent);
                        openReportList.show();
                    }
                });
                genReportList.sendRequest();   


            }
            
        }
        else{

            toastr.error(editor.languageData.Openaprojectthenselectthisoptionstoviewthereports);
        }

    });
    options.add(myReports);




    return container;

};