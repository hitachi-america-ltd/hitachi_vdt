Menubar.Manage = function(editor) {

    var container = new UI.Panel();
    container.setClass('menu');

    var title = new UI.Panel();
    title.setClass('title');
    title.setTextContent(editor.languageData.Manage);
    container.add(title);

    var options = new UI.Panel();
    options.setClass( 'options' );
    container.add( options );

    var generateJson = new UI.Row();
    generateJson.setClass('option');
    generateJson.setTextContent(editor.languageData.GenerateJSON);
    generateJson.onClick(function() {
        if( editor.activeProject !== undefined && editor.activeProject._id !== undefined && editor.activeProject._id !== null ){

            var cameraDetails = [];
            var sensorDetails = [];
            var pointOfInterestDetails = [];
            var uid = localStorage.getItem('U_ID');
            var snapshotListComponent = new SanpshotList(editor);

            snapshotListComponent.getSnapshotOfCurrentProject(editor.api + 'screenshotlist/' + uid + editor.activeProject.name)
            .then( function (snapshotDetails) {

                function getCameraSnapshot(uuid){
                    let snapshotNames = []
                    snapshotDetails.forEach(snapshot => {
                        if(snapshot.includes(uuid)) {
                            snapshotNames.push(editor.path + "output/uploadurl/" + uid + editor.activeProject.name + "/screenshottwod/" + snapshot)
                        }
                    })
                    return snapshotNames;
                }

                function getAllSnapshots() {
                    let snapshots = [];
                    snapshotDetails.forEach(snapshot => {
                        snapshots.push( editor.path + "output/uploadurl/" + uid + editor.activeProject.name + "/screenshottwod/" + snapshot )
                    })
                    return snapshots
                }

                editor.sceneCameras.forEach(element => {
                    if(element.camCategory != 'LiDAR') {
                        var camDetails = {};
                        Object.assign(camDetails, element.userData);
                        camDetails.uuid = element.uuid;
                        camDetails.position = element.position;
                        camDetails.opticalZoom = element.opticalZoom;
                        camDetails.digitalZoom = element.digitalZoom;
                        camDetails.snapshots = getCameraSnapshot(element.uuid)
                        cameraDetails.push(camDetails); 
                    }
                    else {
                        var sensorArray = {};
                        Object.assign(sensorArray, element.userData);
                        sensorArray.uuid = element.uuid;
                        sensorArray.position = element.position;
                        sensorArray.opticalZoom = element.opticalZoom;
                        sensorArray.digitalZoom = element.digitalZoom;
                        sensorArray.snapshots = getCameraSnapshot(element.uuid)
                        sensorDetails.push(sensorArray)
                    }
                })
    
                editor.allPointOfinterest.forEach(element => {
                    var pointOfInterestDetailsArray = {};
                    Object.assign(pointOfInterestDetailsArray, element.userData.pointData);
                    pointOfInterestDetailsArray.uuid = element.uuid;
                    pointOfInterestDetailsArray.position = element.position;
                    pointOfInterestDetails.push(pointOfInterestDetailsArray);
                })

                const viewID = Date.now() + Math.floor(Math.random()*1000);

                var data = {
                    projectid : editor.activeProject._id,
                    info : editor.activeProject,
                    cameras : cameraDetails,
                    sensors : sensorDetails,
                    pointofinterest : pointOfInterestDetails,
                    snapshotlist: getAllSnapshots()
                };
                
                $.ajax({
                    url: editor.api + 'viewmode/generate',
                    dataType: 'json',
                    type: 'POST',
                    data: {
                        data: JSON.stringify(data),
                        viewId : viewID,
                        viewUrl : editor.webroot + '#/hitachihome/' + viewID,
                        projectId : editor.activeProject._id
                    },
                    success: function() {  
                        toastr.success("Json Data generated successfully!");
                        activityLogSuccessForGenerateJSon = function(){
		
                            try{
                    
                                       
                                var logDatas = {};
                                logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Started to generate interactive viewmode JSON for "  + editor.activeProject.name ;
                                logger.addLog( logDatas );
                                logger.sendLogs( localStorage.getItem( 'U_ID' ) );
                                
                    
                            }
                            catch( exception ){
                    
                                console.log( "Logging failed!" );
                                console.log( exception );
                    
                            }
                        }
                        activityLogSuccessForGenerateJSon();
                    },
                    error: function() {
                        toastr.error("Failed Try Again !!");
                        activityLogsFailureForGenerateJSon = function(){
		
                            try{
                    
                                       
                                var logDatas = {};
                                logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Failed to generate interactive viewmode JSON for "  + editor.activeProject.name ;
                                logger.addLog( logDatas );
                                logger.sendLogs( localStorage.getItem( 'U_ID' ) );
                                
                    
                            }
                            catch( exception ){
                    
                                console.log( "Logging failed!" );
                                console.log( exception );
                    
                            }
                        }
                        activityLogsFailureForGenerateJSon();
                    }
                });
            })
            .catch( function ( err) {
                console.log( err)
            })   
            
        } else {
            toastr.error(editor.languageData.YouhavetobeonaprojectbeforeyougenerateJSONdata);
        }
    });
    options.add(generateJson);

    // Show JSON
    var urlList = new UI.Row();
    urlList.setClass('option');
    urlList.setTextContent(editor.languageData.URLList);
    urlList.onClick( function(){
        $('#urlList').modal('show');
        $('#urlListBtn').click()
    } )

    options.add(urlList)


    var apiDataList = new UI.Row();
    apiDataList.setClass('option');
    apiDataList.setTextContent(editor.languageData.ApiDataList);
    apiDataList.onClick( function(){
        $('#apiList').modal('show');
        $('#apiDataListBtn').click()
    } )

    options.add(apiDataList)
    
    // Create user
    
    var CreateUser = new UI.Row();
    CreateUser.setClass('option');
    CreateUser.setTextContent(editor.languageData.CreateUser);
    CreateUser.setId('create_user');
    CreateUser.onClick(function(){

        $('#createUserModal').modal('show');
        $('#create-user-form').on('submit', function() {
            $('#createUserModal').modal('hide');
            if(editor.createUserFlag == false) {
                editor.createUserFlag = true
                $.ajax({
                    url: editor.api + 'viewmode/' + localStorage.getItem("U_ID"),
                    dataType: 'json',
                    type: 'POST',
                    data: {
                        "firstname": $('#create-user-firstname').val(),
                        "lastname": $('#create-user-lastname').val(),
                        "email": $('#create-user-email').val(),
                        "password": $('#create-user-password').val(),
                        "owner_id": localStorage.getItem("U_ID")
                    },
                    success: function(response) {
                        console.log(typeof(response.status), response.status);
                        if(response.status == '0') {
                            toastr.warning(editor.languageData.UserAlreadyExists);
                            $('#create-user-firstname').val("");
                            $('#create-user-lastname').val("");
                            $('#create-user-email').val("");
                            $('#create-user-password').val("");
                        } else if(response.status == '2'){
                            toastr.info(editor.languageData.LimitExceeded);
                            $('#create-user-firstname').val("");
                            $('#create-user-lastname').val("");
                            $('#create-user-email').val("");
                            $('#create-user-password').val("");
                        } else if(response.status == '3'){
                            toastr.error(editor.languageData.SomethingwentwrongPleasetryagain);
                            $('#create-user-firstname').val("");
                            $('#create-user-lastname').val("");
                            $('#create-user-email').val("");
                            $('#create-user-password').val("");
                        }else {
                            toastr.success(editor.languageData.Usercreatedsuccessfully);
                            $('#create-user-firstname').val("");
                            $('#create-user-lastname').val("");
                            $('#create-user-email').val("");
                            $('#create-user-password').val("");
                            document.getElementById("viewmodeUsers").click();
                        }
                        editor.createUserFlag = false  
                        activityLogsSuccessForCreateUserViewMode = function(){
        
                            try{
                            
                                var logDatas = {};
                                logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Successfully created interactive viewmode user";
                                logger.addLog( logDatas );
                                logger.sendLogs( localStorage.getItem( 'U_ID' ) );
                    
                            }
                            catch( exception ){
                    
                                console.log( "Logging failed!" );
                                console.log( exception );
                    
                            }
                        }
                        activityLogsSuccessForCreateUserViewMode();  
                    },
                    error: function(jqxhr, status, msg) {  
                        toastr.error(editor.languageData.UploadFailedtryAgain);
                        activityLogsFailureForCreateUserViewMode = function(){
        
                            try{
                           
                                var logDatas = {};
                                logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Failed to create interactive viewmode user";
                                logger.addLog( logDatas );
                                logger.sendLogs( localStorage.getItem( 'U_ID' ) );   
                    
                            }
                            catch( exception ){
                    
                                console.log( "Logging failed!" );
                                console.log( exception );
                    
                            }
                        }
                        activityLogsFailureForCreateUserViewMode();  
                    }
                }); 
            }
            
        });
    });

    $('.close-create-user').click(function(){
        $('#create-user-firstname').val("");
        $('#create-user-lastname').val("");
        $('#create-user-email').val("");
        $('#create-user-password').val("");
        $('#createUserModal').modal('hide');
    })

    options.add(CreateUser);
    
    // Manage Users
    var manageUsersModal = document.createElement('div');
    manageUsersModal.class = 'modal';
    manageUsersModal.id = 'manage-users-modal';

    var manageUsers = new UI.Row();
    manageUsers.setClass('option');
    manageUsers.setTextContent(editor.languageData.ManageUsers);
    manageUsers.setId('manage_users');
    manageUsers.onClick(function() { 
        $('#manageUserModal').modal('show');
    
        document.getElementById("viewmodeUsers").click();
    });
    options.add(manageUsers);
    
    return container;
};
