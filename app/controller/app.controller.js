var map;
/*MODIFIED TO INCLUDE THE MAP CROP FEATURE START*/
var shapeBounds, shapeType,mapShape;
/*MODIFIED TO INCLUDE THE MAP CROP FEATURE END*/

/*MODIFIED TO INCLUDE PUBLISH PROJECT START*/
var fromSharedUrl = false;
var publishData = {};
/*MODIFIED TO INCLUDE PUBLISH PROJECT END*/
var chnagesfiles = false;
angular.module('myApp').directive('fileModel', ['$parse', function($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            element.bind('change', function() {
                scope.$apply(function() {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

app.controller('myCtrl', function($scope, $http, $q, ProjectService, modelService, $rootScope, StorageService, $location, configFactory, $window ,$translate, LoggerService) {
    if(StorageService.getDatavalue("isLoggedIn") !== "true" && StorageService.getDatavalue("email")!== "3dezmonitoring@gmail.com") {
        $location.path('/login');
    }  

    var lang = new language();
    var lngDatas = lang.lngdata;
    var CurrentLanguageData;
    if(StorageService.getDatavalue('Lang') == undefined  || StorageService.getDatavalue('Lang') == null ){

        $rootScope.currentLanguage = "en";
        $translate.use("en");
        CurrentLanguageData = lngDatas.en 
    }
    else{
        $translate.use(StorageService.getDatavalue('Lang'));
        if( StorageService.getDatavalue('Lang') == "jp"){
			
            $scope.languageData = lngDatas.jp;
            CurrentLanguageData = lngDatas.jp; 
		}
		if(StorageService.getDatavalue('Lang') == "en"){

            $scope.languageData = lngDatas.en;
            CurrentLanguageData = lngDatas.en; 
		}
    }

    $scope.url = configFactory.strings.webroot;
    $scope.upgrade_renew = true;
    $scope.changePassword = false;
    $scope.changePrice = false;

    $scope.api_access=localStorage.getItem("api_access");
    
    $scope.availableOptions = [{
            name: '1/4"',
            value: '3.6'
        },
        {
            name: '1/3.6"',
            value: '4.54'
        },
        {
            name: '1/3"',
            value: '4.8'
        },
        {
            name: '1/2.7"',
            value: '6.46'
        },
        {
            name: '1/2.5"',
            value: '5.37'
        },
        {
            name: '1/2.3"',
            value: '6.44'
        },
        {
            name: '1/2"',
            value: '6.4'
        },
        {
            name: '1/1.8"',
            value: '7.18'
        },
        {
            name: '2/3"',
            value: '8.8'
        },
        {
            name: '1"',
            value: '12.8'
        },
        {
            name: '27.2m',
            value: '27.2'
        },
        {
            name: '35mm ',
            value: '35.9'
        }
    ];

    $scope.data = {
        selectedOption: $scope.availableOptions[2].value
    };
    $scope.conversion = {
        "m": 0.3048,
        "ft": 3.280839895
    };
    $scope.resolutions = [{
            text: "QVGA",
            value: "320"
        },
        {
            text: "VGA",
            value: "640"
        },
        {
            text: "SVGA",
            value: "800"
        },
        {
            text: "720p",
            value: "1280"
        },
        {
            text: "1.3MP",
            value: "1280.01"
        },
        {
            text: "2MP",
            value: "1600"
        },
        {
            text: "1080p",
            value: "1920"
        },
        {
            text: "3MP",
            value: "2048"
        },
        {
            text: "4MP",
            value: "2688"
        },
        {
            text: "5MP",
            value: "2592"
        },
        {
            text: "6MP",
            value: "3072"
        },
        {
            text: "4K",
            value: "3840"
        },
        {
            text: "10MP",
            value: "3648"
        },
        {
            text: "12MP",
            value: "4000"
        },
        {
            text: "16MP",
            value: "4608"
        },
        {
            text: "6K",
            value: "6016"
        },
        {
            text: "7K",
            value: "7360"
        }
    ];

    /* Global variables camera parameters START*/
    $scope.image3d_count = 0;
    $scope.image_street;
    $scope.image_street1;
    $scope.Show3DViews = false;
    $scope.StreetView = "StreetView";
    $scope.image_coo = 0;
    $scope.falsefileformat = true;
    $scope.index_image = 0;
    $scope.app_fov_image = 0;
    $scope.i = 0;
    $scope.ppf_image = 0;
    $scope.timg = 0;
    $scope.ppf_image_size = [0, 2.5, 4.1, 6.6, 9.1, 11.1, 13.6, 17.6, 21.1, 23.6, 27.6, 32.6, 37.6, 45.6, 55.1, 70.1, 90.1, 125, 175.1];
    $scope.projectTitle = {
        pname: 'sample project'
    };
    var cc = 0
    $scope.cheak = 0;
    $scope.projectName = '';
    $scope.projectNameSaveAs = '';
    $scope.horizontal_aov = '';
    $scope.width_proxy = '';
    $scope.add_camera = true;
    $scope.subsearch = true;
    $scope.full_cam_details = true;
    $scope.user_id = null;
    $scope.buttonname = "Add Camera";
    $scope.datas = {
        selectedresolutions: $scope.resolutions[6].value
    };
    var cameramarker_draged;
    $scope.threedmodel = 0;
    $scope.cc = 0;
    $scope.not_correct_file = true;
    $scope.ShowDefault3D = false;
    $scope.cppf = 53.9;
    $scope.image_sizer = false;
    $scope.cameraheight = 10;
    $scope.sceneheight = 10;
    $scope.Tilt = 0.00;
    $scope.distance = 101;
    $scope.focallength = 2.9;
    $scope.result_aov = 70;
    $scope.width = 35.6;
    $scope.imager_count = 1;
    $scope.span_invalid = true;
    $scope.span_camera_invalid = true;
    $scope.progress_time = true;
    $scope.span_aov_invalid = true;
    $scope.span_focal_invalid = true;
    $scope.span_distance_invalid = true;
    $scope.span_sheight_invalid = true;
    $scope.span_width_invalid = true;
    $scope.savedProject = [];
    $scope.save_modal_id = '#saveAs';
    $scope.uniqueID = '';
    $scope.image_sizer_span = true;
    $scope.Imager_Size_orginal = "Imager_Size"
    $scope.projectTitle.pname = 0;
    /* Modified to add unit to save options*/
    $scope.unit = "ft";
    /* Modified to add unit to save options*/
    $scope.file_extension = true;
    $scope.upload_btn = true;
    $scope.myFile = '';
    $scope.bankfilepath = '';
    $scope.subsearch3 = true;
    $scope.full_cam_details3 = true;
    $scope.ShowFloorView = false;
    $scope.HidefloorDemoBtn = false;
    $scope.ShowMapView = true;
    $scope.floorDemoShow = false;
    $scope.Show3DView = false;
    $scope.HideMapViewBtn = true;
    $scope.HideUploadBtn = true;
    $scope.panomafov_hide = true;
    $scope.panomafov_hide_duplicate = false;
    $scope.hideCameraButton = false;
    $scope.hideDynamicStreet = false;
    $scope.hideReportButton = true;
    $scope.hide3CameraButton = true;
    $scope.editMode = false;
    var countts = 0;
    $scope.renamecam = "";
    var data_count;
    var viewer = null;
    var default_viewer = null;
    var street_viewer = null;
    var cameralat = null;
    var cameralng = null;
    var default_viewer = null;
    var contextMenuOptions = {};
    var contextMenu = null;
    var floorplan_contextMenuOptions = {};
    var floorcontextMenu = null;
    $scope.onecam = true;
    var thatt;
    var first_cam = 0;
    var arrayobj = [];
    var bounds;
    var floorPlanOverlay;
    var markerA;
    var markerB;
    $scope.Hide2DObjectRemoveBtn = true;
    $scope.HideUploadBtn = true;
    $scope.Hide2DObjectBtn = false;
    $scope.floorPlan2D = false;
    $scope.boolSelectCamera = false;
    var nocamera = 0;
    var ij = 0;
    var countcamear = 0;
    $scope.a = [];
    $scope.test_array = [];
    var cam_count = 0;

    /*MODIFIED TO INCLUDE CAMERA ICON START*/
    var labelCount = 0;
    var availableCamNumbers = [];
    /*MODIFIED TO INCLUDE CAMERA ICON END*/

    var camera_details = {};
    var active_camera;
    var active_camera_index;
    $scope.object_index;
    $scope.camera_color;
    $scope.is_special_camera = false;
    var floorplan_save_values = {};
    $scope.localData = {};

    var timebar_timeWidth = 500;
    var intervalDuration = 200;
    var drawbar_time = 0;
    var bar_timeWidth;
    var interval;
    var timer = 0;
    /*MODIFIED TO INCLUDE CAMERA ICON START*/
    $scope.imageUrl = '';
    /*MODIFIED TO INCLUDE CAMERA ICON END*/

    $scope.edit_fname = 'First Name';
    $scope.edit_lname = 'Last Name';
    $scope.edit_mail = 'user@mail.com';
    $scope.edit_phone;
    $scope.upgrd_plan = '0';
    $scope.locs = [];
    $scope.show_title_used = false;
    //$scope.location_index = 0;

    /*MODIFIED TO SHOW 3D EDITOR AS THE DEFAULT VIEW START*/
    //$scope.showEditor = true;
    $scope.showEditor = false;
    /*MODIFIED TO SHOW 3D EDITOR AS THE DEFAULT VIEW START*/

    $scope.last_location = {};
    $scope.isFromLogout = false;

    /*change Password*/

    $scope.changePasswordCurrentPassword = "";
    $scope.changePasswordNewPassword = "";
    $scope.changePasswordConformNewPassword = "";

    /* change Password*/

    var countResizable = 0;

    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": true,
        "progressBar": false,
        "positionClass": "toast-top-right",
        "preventDuplicates": true,
        "onclick": null,
        "showDuration": "10000",
        "hideDuration": "10000",
        "timeOut": "5000",
        "extendedTimeOut": "5000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "slideDown",
        "hideMethod": "slideUp",
        "closeMethod": "slideUp"
    };

    var checkPermission = function(type, permission) {
        var roles = {
            "0": {
                "2D": true,
                "floorplan": false,
                "save": false,
                "open": false,
                "delete": false,
                "pdf": false,
                "snapshot": false,
                "multipleCamera": false,
                "3D": false,
                "report": false
            },

            "1": {
                "2D": true,
                "floorplan": true,
                "save": true,
                "open": true,
                "delete": true,
                "pdf": true,
                "snapshot": true,
                "multipleCamera": true,
                "3D": false,
                "report": false
            },

            "2": {
                "2D": true,
                "floorplan": true,
                "save": true,
                "open": true,
                "delete": true,
                "pdf": true,
                "snapshot": true,
                "multipleCamera": true,
                "3D": true,
                "report": true
            }
        }
        if (roles[type] != null && roles[type][permission] == true)
            return true;
        else
            return false;
    }

    function progressbar_time(duration) {
        $(".overlay").show();
        $('#3dLoaderModal').modal('hide');

    };
    /* change Password function for clicking the Save Button*/
    $scope.changePasswordUpadte = function(){

        var currentUrl = window.location.href;
        var currentPassword = $scope.changePasswordCurrentPassword;
        var newPassworrd = $scope.changePasswordNewPassword;
        var conformNewPassword = $scope.changePasswordConformNewPassword;
        var userId = localStorage.getItem('U_ID');
        if (currentPassword == "" || newPassworrd == ""  || conformNewPassword == "" ){
           
            toastr.warning(CurrentLanguageData.Pleaseenterthedatainallfields );
            return;
        }

        if(newPassworrd == conformNewPassword ){

            
            var changePasswordData = { 'currentPassword' : currentPassword , 'newPassworrd' :newPassworrd ,'userId' : userId, 'currentUrl': currentUrl}
                $http({
                        method : "POST",
                        data:changePasswordData,
                        url : configFactory.strings.api+"changePassword"

                    }).then(function mySucces(response) {

                        if(response.data.status == 200){

                            toastr.success(CurrentLanguageData.PasswordUpdatedVerifythepasswordbyusingthelinkintheEmail);
                            $scope.upgrade_renew = true;
                            $scope.changePassword = false;
                            $scope.changePrice = false;
                             $scope.clearFieldForChangePassword();
                        }
                        else if(response.data.status == 204 ){

                            toastr.warning( CurrentLanguageData.CurrentpassworddoesntmatchTryagain);
                            $scope.changePasswordCurrentPassword = "";
                        }
                        
                    })
                    .catch(function(error){

                        console.log(error)
                    });
        }
        else{

            toastr.error(CurrentLanguageData.passwordmismatch)
        }
    }

    //MODIFIED TO ADD CLICK EVENT LISTENER FOR ACCOUNT STATUS REFRESH BTN START
    document.getElementById('stats-refresh-btn').addEventListener('click', function (event) {
        $scope.matterportactiveproject = []
        var userEmail = { "email": localStorage.getItem('email') }

        $http({
            method: "POST",
            data: userEmail,
            url: configFactory.strings.api + "matterport/matterportperuser"

        }).then(function (response) {

            $scope.matterportactiveproject = response.data;
            
        })

        var uesrStorageStatusReq = new ApiHandler();
        uesrStorageStatusReq.prepareRequest({

            method: 'GET',
            url: editor.api + 'storage/users/' + localStorage.getItem('U_ID'),
            responseType: 'json',
            isDownload: false,
            formDataNeeded: false,
            formData: null

        });
        uesrStorageStatusReq.onStateChange(function (response) {

            //The request succeeded
            //{"status":200,"body":{"Storage Allocation":82.43,"temp":35.25,"total":117.68}}
            if (response.status === 200) {

                var stats = response.body, userChartData = [], userLegendData = [], totalValue = Number(stats.total).toFixed(2);
                var keys = Object.keys(stats);
                var len = keys.length, subTotal = 0;
                for (var i = 0; i < len; i++) {

                    if (keys[i] !== 'total') {

                        //userChartData.labels.push( keys[ i ] );
                        //userChartData.series.push( stats[ keys[ i ] ] );
                        subTotal += stats[keys[i]];
                        userLegendData.push(keys[i]);
                        userChartData.push({ "name": keys[i], "value": Number(stats[keys[i]]).toFixed(2) });

                    }

                }
                var sizeOfOtherItems = stats.total - subTotal;
                userLegendData.push("Other Items");
                userChartData.push({ "name": "Other Items", "value": Number(sizeOfOtherItems).toFixed(2) });

                var userStorageChart = echarts.init(document.getElementById('total-user-storage'));
                option = {
                    title: {
                        text: editor.languageData.UtilizationInfo,
                        subtext: editor.languageData.TotalActiveProjects + ' : ' + $scope.matterportactiveproject.length + '\n' + editor.languageData.TotalUsedStorageSpace + ' : ' + Number(totalValue).toFixed(2) + 'MB',
                        subtextStyle: {
                            color: "red"
                        },
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} MB ({d}%)"
                    },
                    legend: {
                        type: 'scroll',
                        //orient: 'horizontal',
                        left: 'center',
                        bottom: 5,
                        //data: ['RED','Black','Cyan','Orange','Green']
                        data: userLegendData
                    },
                    series: [
                        {
                            name: 'Storage',
                            type: 'pie',
                            radius: '50%',
                            center: ['50%', '60%'],
                            /*data:[
                                {value:335, name:'RED'},
                                {value:310, name:'Black'},
                                {value:234, name:'Cyan'},
                                {value:135, name:'Orange'},
                                {value:1548, name:'Green'}
                            ],*/
                            data: userChartData,
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                };
                userStorageChart.setOption(option);

                if (editor.activeProject !== undefined && editor.activeProject._id !== undefined && editor.activeProject._id !== null) {

                    var projectStorageStatusReq = new ApiHandler();
                    projectStorageStatusReq.prepareRequest({

                        method: 'GET',
                        url: editor.api + 'storage/projects/' + editor.activeProject._id,
                        responseType: 'json',
                        isDownload: false,
                        formDataNeeded: false,
                        formData: null

                    });
                    projectStorageStatusReq.onStateChange(function (response) {

                        //The request succeeded
                        //{"status":200,"body":{"JSON":62.28,"archives":10.53,"images":9.62,"others":0,"total":82.43}}
                        if (response.status === 200) {

                            var stats = response.body, userChartData = [], userLegendData = [], totalValue = Number(stats.total).toFixed(2);
                            var keys = Object.keys(stats);
                            var len = keys.length, subTotal = 0;
                            for (var i = 0; i < len; i++) {

                                if (keys[i] !== 'total') {

                                    //userChartData.labels.push( keys[ i ] );
                                    //userChartData.series.push( stats[ keys[ i ] ] );
                                    //subTotal += stats[ keys[ i ] ];
                                    userLegendData.push(keys[i]);
                                    userChartData.push({ "name": keys[i], "value": Number(stats[keys[i]]).toFixed(2) });

                                }

                            }
                            //var sizeOfOtherItems = stats.total - subTotal;
                            //userLegendData.push( "Other Items" );
                            //userChartData.push( { "name" : "Other Items", "value" : Number( sizeOfOtherItems ).toFixed( 2 ) } );

                            var userStorageChart = echarts.init(document.getElementById('total-project-storage'));
                            option = {
                                title: {
                                    text: editor.languageData.StorageUsedBy + editor.activeProject.name + '\"',
                                    subtext: editor.languageData.TotalUsedSize + Number(totalValue).toFixed(2) + 'MB',
                                    subtextStyle: {
                                        color: "red"
                                    },
                                    x: 'center'
                                },
                                tooltip: {
                                    trigger: 'item',
                                    formatter: "{a} <br/>{b} : {c} MB ({d}%)"
                                },
                                legend: {
                                    type: 'scroll',
                                    //orient: 'horizontal',
                                    left: 'center',
                                    bottom: 5,
                                    data: userLegendData
                                },
                                series: [
                                    {
                                        name: 'Storage',
                                        type: 'pie',
                                        radius: '50%',
                                        center: ['50%', '60%'],
                                        data: userChartData,
                                        itemStyle: {
                                            emphasis: {
                                                shadowBlur: 10,
                                                shadowOffsetX: 0,
                                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                                            }
                                        }
                                    }
                                ]
                            };
                            userStorageChart.setOption(option);

                        }
                        else {

                            toastr.error(editor.languageData.SorrysomethingwentwrongPleasetryagainaftersometime);
                            return;

                        }

                    }, function (error) {

                        console.log(error);
                        toastr.error(editor.languageData.SorrysomethingwentwrongPleasetryagainaftersometime);
                        return;

                    });

                    projectStorageStatusReq.setProgressTrackers(function (info) {

                    }, function (info) {

                        if (info.status == 500) {

                            console.log("Error contacting server!");

                        }

                    });

                    projectStorageStatusReq.sendRequest();

                }

            }
            else {

                toastr.error(editor.languageData.SorrysomethingwentwrongPleasetryagainaftersometime);
                return;

            }

        }, function (error) {

            console.log(error);
            toastr.error(editor.languageData.SorrysomethingwentwrongPleasetryagainaftersometime);

            return;

        });

        uesrStorageStatusReq.setProgressTrackers(function (info) {

        }, function (info) {

            if (info.status == 500) {

                console.log("Error contacting server!");

            }

        });

        uesrStorageStatusReq.sendRequest();

    });

    /*Assign user-log*/
    $scope.addIcon = function(){
        var input = document.getElementById( 'user-icon' )
        if( input && input.files[0] && input.files[0].name != undefined && input.files[0].name != "" ){

            toastr.success( "Uploaded Successfully" )
            var Data = new FormData();
            var fileJson = input.files[0];
            Data.append('file', fileJson);
    
            
            
            $.ajax({
                url: editor.api + 'cameraSpec/users/update/img',
                type: "POST",
                processData: false,
                contentType: false,
                data: Data,
                success: function(result) {
                    $scope.userLogo = "assets/img/" + input.files[0].name;
                    document.getElementById( 'container-logo-img' ).src = $scope.userLogo;
                    document.getElementById( 'container-logo' ).style.visibility = "visible";
                    StorageService.putDatavalue( 'user_logo', $scope.userLogo )
                    var id = localStorage.getItem( 'U_ID' );
                    $.ajax({
                    
                        url: editor.api + 'viewmode/' + id,
                        dataType: 'json',
                        type: 'PUT',
                        data: {
                            "user_logo" : input.files[0].name             
                        },
                        success: function(res){
                            console.log( res )
                        },
                        error: function(err){
                            console.log( err )
                        }
                    
                    })
                },
                error: function(err) {
                    toastr.error('Somthing went wrong try again !!!');
                    console.log(err);
                }
            });
           
            
        }
        

    }
    /*Assign user-log*/

    /* change Password function for clicking the Save Button End*/
    /* clear all the field in the change password  */
    $scope.clearFieldForChangePassword = function(){

        $scope.changePasswordCurrentPassword = "";
        $scope.changePasswordNewPassword = "";
        $scope.changePasswordConformNewPassword = "";
    }
    /* clear all the field in the change password  */
    $scope.resetbar = function() {

        var timebar_timeWidth = 500;
        var intervalDuration = 200;

        //clearInterval();
        $('#bar_time').css('width', '0px');
        interval = 1
    };

    $scope.updateDistance = function(hfovval) {
        $scope.$apply(function() {
            $scope.distance = parseFloat(hfovval.toFixed(2));
            $scope.distances();
        });
    }
    $scope.updateDistances = function(dist) {

        $scope.$apply(function() {
            $scope.distance = parseFloat(dist.toFixed(2));
            //alert("vanny");
            $scope.distances();
        })
    };

    $scope.openProjects = function(reloadFlag) {
        var title;
        reloadFlag = reloadFlag || false;
        usrId = StorageService.getDatavalue("U_ID");
        if(usrId != null && usrId != undefined) {
            ProjectService.getAll(usrId).then(function(data) {
                $scope.savedProject = data;
                if (reloadFlag == true) {
                    if ($scope.savedProject != '') {
                        title = StorageService.getDatavalue('openedTitle');
                        if (title == '') {
                            $scope.projectTitle.pname = 0;
                        } else {
                            $scope.projectTitle.pname = ProjectService.getIdOfTitle(title);
                        }
                        $scope.openProject();
                    }
    
                }
            });
        }
    };

    $scope.reportGeneration = function(myFile) {

        $http.get(configFactory.strings.api + "reports").success(function(data, status) {
            var fileOut = configFactory.strings.path + data;
            window.open(fileOut);

        }).error(function(data) {
            alert("Error with the system!! Please try later")
        });
    };

    $scope.showmapview = function() {
        $scope.panomafov_hide = true;
        $scope.panomafov_hide_duplicate = false;
        $scope.ShowDefault3D = false;
        $scope.Show3DView = false;
        $scope.ShowFloorView = false;
        $scope.ShowMapView = true;
        $scope.HideMapViewBtn = true;
        $scope.HideUploadBtn = true;
        $scope.HidefloorDemoBtn = false;
        $scope.Hide3DBtn = false;
        $scope.mapfloor3Dvisible = true;
        $scope.hideCameraButton = false;
        $scope.hide3CameraButton = true;
        $scope.hideReportButton = true;
        $scope.showEditor = true;
        if (countResizable == 1) {
            $(".left_view").removeClass("col-md-2");
            $('.left_view').hide();
        } else {
            $(".left_view").addClass("col-md-2");
            $('.left_view').show();
        }


        if ($scope.floorPlan2D) {
            $scope.Hide2DObjectRemoveBtn = false;
            $scope.Hide2DObjectBtn = true;

        } else {
            $scope.Hide2DObjectRemoveBtn = true;
            $scope.Hide2DObjectBtn = false;
        }

        $("#mapfloorbtn").removeClass("click-highlight");
        $("#mapviewBtn").addClass("click-highlight");
        $("#map3dbtn").removeClass("click-highlight");
        $("#edit3dbtn").removeClass("click-highlight");
        setTimeout(function() { $(window).trigger('resize'); }, 1);
    };
    $scope.default3D = function() {

        if (!checkPermission(StorageService.getDatavalue("role"), "3D")) {
            $('#NeedPayedAccount').modal('show');
            return;
        }

        if (modelService.detectWebgl().webGL) {
            $scope.cheak = 1;
            $scope.panomafov_hide = true;
            $scope.panomafov_hide_duplicate = false;
            if ($scope.threedmodel == 1) {
                $scope.Show3DView = true;
            } else {
                $scope.ShowDefault3D = true;
            }
            $scope.ShowFloorView = false;
            //$scope.Show3DView = false;
            $scope.ShowMapView = false;
            $scope.showEditor = true;
            $scope.HideMapViewBtn = false;
            $scope.HidefloorDemoBtn = false;
            $scope.HideUploadBtn = false;
            $scope.Hide3DBtn = true;
            $scope.HideUploadBtn = false;
            $scope.hideCameraButton = true;
            // $scope.hide3CameraButton=true;
            if ($scope.cc == 1) {
                $scope.hide3CameraButton = false;
            } else {
                $scope.hide3CameraButton = true;
            }
            $scope.hideReportButton = true;
            $scope.Hide2DObjectBtn = true;
            $scope.Hide2DObjectRemoveBtn = true;
            /* default_viewer = pannellum.viewer('panoramafov2', {
                 "type": "equirectangular",
                 "panorama": "assets/img/cam4.jpg",
                 "autoLoad": true
             });*/
            default_viewer = pannellum.viewer('panoramafo', {
                "type": "equirectangular",
                "panorama": "assets/img/FloorPlan.jpg",
                "autoLoad": true
            });

            $("#mapfloorbtn").removeClass("click-highlight");
            $("#mapviewBtn").removeClass("click-highlight");
            $("#map3dbtn").addClass("click-highlight");
            $("#edit3dbtn").removeClass("click-highlight");
        } else {
            alert("Your browser is not enabled with WebGL");
        }
    };

    $scope.defaultPlus = function() {
        if ($scope.ShowDefault3D == true) {
            var ghfov;
            ghfov = (default_viewer.getHfov()) - 10;
            $scope.distance = parseFloat(ghfov.toFixed(2));
            default_viewer.setHfov($scope.distance);
            $scope.distances();
        }

    };

    $scope.defaultMinus = function() {
        if ($scope.ShowDefault3D == true) {
            var ghfov;
            ghfov = (default_viewer.getHfov()) + 10;
            $scope.distance = parseFloat(ghfov.toFixed(2));
            default_viewer.setHfov($scope.distance);
            $scope.distances();
        }

    };

    $scope.staticPlus = function() {
        if ($scope.ShowMapView == true) {
            var ghfov;
            ghfov = (street_viewer.getHfov()) - 10;
            $scope.result_aov = parseFloat(ghfov.toFixed(2));
            street_viewer.setHfov($scope.result_aov);
            $scope.focal_length();
        }
    };

    $scope.staticMinus = function() {
        if ($scope.ShowMapView == true) {
            var ghfov;
            ghfov = (street_viewer.getHfov()) + 10;
            $scope.result_aov = parseFloat(ghfov.toFixed(2));
            street_viewer.setHfov($scope.result_aov);
            $scope.focal_length();
        }
    };

    //For 2D Object uploads
    $scope.objectUpload = function(myFile) {
        var name = myFile.name.replace(/^.*\./, '');
        if (name == "jpg" || name == "png" || name == "jpeg") {
            $scope.falsefileformat = true;
            floorplan_save_values = {};
            $scope.objectFilePath = $scope.myFile.name;
            $scope.objectFilePath = $scope.bankfilepath.replace(/^.*\./, '');
            var file = $scope.myFile;
            var uploadUrl = configFactory.strings.api + "floorplan";
            var fd = new FormData();
            fd.append('file', file);

            $http.post(uploadUrl, fd, {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined
                    }
                })
                .success(function(result) {
                    $scope.object2DPath(result);
                })
                .error(function() {

                });
        } else {
            $scope.falsefileformat = false;
        }
    };

    //2D Object Modal Loader
    $scope.open2DObjectLoad = function() {
        $('#2DObjectLoaderModal').modal('show');

    }

    $scope.getlocation = function(lat, lng) {
        var d = $q.defer();
        var geocoder = new google.maps.Geocoder;
        var latlng = { lat: parseFloat(lat), lng: parseFloat(lng) };
        geocoder.geocode({ 'location': latlng }, function(results, status) {
            if (status === 'OK') {

                if (results[1]) {
                    return d.resolve(results[1].formatted_address);
                }
            } else {
                return d.reject("Not found");
            }

        });
        return d.promise;
    }

    $scope.reportGeneration = function() {

        if (!checkPermission(StorageService.getDatavalue("role"), "report")) {
            $('#NeedPayedAccount').modal('show');
            return;
        }

        $(".overlay").show();
        var image_name = "sample image.jpg"
        var length = $scope.a.length;
        var cams = [];
        var cam_objects = {};
        var project_data = {};
        var camera_location = "";
        var itemsProcessed = 0;

        $scope.a.forEach(function(currentObject, index) {
            var lat = currentObject.cameramarker.getPosition().lat();
            var lng = currentObject.cameramarker.getPosition().lng();

            $scope.getlocation(lat, lng).then(function(data) {
                itemsProcessed++;
                $scope.camera_details = {
                    'camera_id': currentObject.cameraId,
                    'cameramarker': currentObject.cameramarker.getPosition(),
                    'camera_location': data,
                    'horizontalaov': currentObject.horizontalaov,
                    'subjectMarker': currentObject.subjectMarker.getPosition(),
                    'tilt': currentObject.tilt,
                    'scene_height': currentObject.scene_height,
                    'camera_height': currentObject.camera_height,
                    'ppf': currentObject.ppf,
                    'width': currentObject.width,
                    'distance': currentObject.distance,
                    'aov': currentObject.aov,
                    'focal_length': currentObject.focal_length,
                    //'imager_size'               : $scope.a[i].imager_size,
                    //'resolution'                : $scope.a[i].resolution,

                    'data': currentObject.data,
                    'datas': currentObject.datas,

                    'unit': currentObject.unit,
                    'Imager_Size_orginal': currentObject.Imager_Size_orginal,
                    'image_sizer': currentObject.image_sizer,
                    'image_sizer_span': currentObject.image_sizer_span,
                    'buttonname': currentObject.buttonname,
                    'color': currentObject.color,
                    'title': currentObject.title
                };

                cams.push($scope.camera_details);
                var key = "camera" + index;
                cam_objects[key] = $scope.camera_details;
                if (itemsProcessed === length) {
                    default_camera_values = {
                        'tilt': $scope.Tilt,
                        'scene_height': $scope.sceneheight,
                        'camera_height': $scope.cameraheight,
                        'ppf': $scope.cppf,
                        'width': $scope.width,
                        'distance': $scope.distance,
                        'aov': $scope.result_aov,
                        'focal_length': $scope.focallength,
                        //'imager_size'               : $scope.data.selectedOption,
                        //'resolution'                : $scope.datas.selectedresolutions,

                        'data': $scope.data,
                        'datas': $scope.datas,

                        'unit': $scope.unit
                    }
                    var usrId = StorageService.getDatavalue("U_ID");
                    project_data["user_id"] = usrId;
                    project_data["title"] = $scope.projectName;
                    project_data["cameras"] = cam_objects;
                    project_data["floor_plan_image"] = image_name;
                    project_data["default"] = default_camera_values;
                    project_data["floorplan"] = floorplan_save_values;
                    var data = JSON.stringify(project_data);
                    ProjectService.saveSelected($scope.uniqueID, data);
                    /*********/
                    $scope.localData = JSON.parse(data);
                    $http.post(configFactory.strings.api + "screen", $scope.localData).success(function(data, status) {

                        $scope.fileOut = configFactory.strings.path + data;

                        setTimeout(function() {
                            $(".overlay").hide();
                            $scope.pdfGenerator();
                        }, 5000);

                    }).error(function(data) {
                        $(".overlay").hide();
                        alert("Error with the system!! Please try later")
                    });

                }
            });
        });
    };

    $scope.pdfGenerator = function() {
        $http({
            url: $scope.fileOut,
            method: 'GET',
            headers: {
                'Content-type': 'application/pdf'
            },
            responseType: 'arraybuffer'
        }).success(function(data, status, headers) {
            headers = headers();

            //var filename = headers['x-filename'];
            var filename = "Hitachi Report.pdf";
            var contentType = headers['content-type'];

            var linkElement = document.createElement('a');
            try {
                var blob = new Blob([data], { type: contentType });
                var url = window.URL.createObjectURL(blob);

                linkElement.setAttribute('href', url);
                linkElement.setAttribute("download", filename);

                var clickEvent = new MouseEvent("click", {
                    "view": window,
                    "bubbles": true,
                    "cancelable": false
                });
                linkElement.dispatchEvent(clickEvent);
            } catch (ex) {}
        }).error(function(data) {

        });
    }


    $scope.object2DPath = function(fpath) {


        var srcImage = configFactory.strings.path + "output/" + fpath;
        floorPlanOverlay = new FloorPlanOverlay(srcImage, map);

        $('#2DObjectLoaderModal').modal('hide');
        $scope.floorPlan2D = true;
        $scope.Hide2DObjectBtn = true;
        $scope.Hide2DObjectRemoveBtn = false;

        /*********
            $scope.localData = JSON.parse(data);
        /*********/

    };

    $scope.removeOverlay = function() {
        floorPlanOverlay.setMap(null);

        $scope.floorPlan2D = false;
        $scope.Hide2DObjectBtn = false;
        $scope.Hide2DObjectRemoveBtn = true;
        floorplan_save_values = {};
    }

    $scope.show3Ddemo = function() {
        if (modelService.detectWebgl().webGL) {
            //$( "#mapfloorbtn" ).addClass("click-highlight");
            $("#mapviewBtn").removeClass("click-highlight");
            $("#map3dbtn").removeClass("click-highlight");
            $("#edit3dbtn").removeClass("click-highlight");
            $(".left_view").addClass("col-md-2");
            $(".left_view").show();

            $scope.ShowDefault3D = false;
            $scope.HideUploadBtn = true;
            $scope.ShowMapView = false;
            $scope.Show3DView = false;
            $scope.ShowFloorView = true;
            $scope.HideUploadBtn = true;
            $scope.HideMapViewBtn = false;
            $scope.HidefloorDemoBtn = true;
            $scope.Hide3DBtn = false;
            $scope.hideCameraButton = true;
            $scope.hide3CameraButton = true;
            $scope.hideReportButton = false;
            $scope.Hide2DObjectBtn = true;
            $scope.Hide2DObjectRemoveBtn = true;
            $scope.showEditor = true;
            if (viewer == null) {
                viewer = pannellum.viewer('panorama', {
                    "default": {
                        "firstScene": "floorplan",
                        "sceneFadeDuration": 2000
                    },

                    "scenes": {
                        "floorplan": {
                            "title": "Hitachi Floor Plan",
                            "type": "equirectangular",
                            "panorama": "assets/img/FloorPlan.jpg",
                            "autoLoad": true,
                            "showFullscreenCtrl": false,
                            "hotSpotDebug": false,
                            "hotSpots": [{
                                    "pitch": -11.69,
                                    "yaw": -1.46,
                                    "type": "scene",
                                    "text": "Hitachi Entrance",
                                    "sceneId": "entrance",
                                    "targetYaw": -23,
                                    "targetPitch": 2
                                }

                            ]
                        },

                        "entrance": {
                            "title": "Hitachi Entrance",
                            "type": "equirectangular",
                            "panorama": "assets/img/panoramahitachi.jpg",
                            "hfov": 120,
                            "autoLoad": true,
                            "showFullscreenCtrl": false,
                            /*
                             * Uncomment the next line to print the coordinates of mouse clicks
                             * to the browser's developer //console, which makes it much easier
                             * to figure out where to place hot spots. Always remove it when
                             * finished, though.
                             */
                            "hotSpotDebug": false,
                            "hotSpots": [{
                                    "pitch": 39.53,
                                    "yaw": -67.94,
                                    "type": "info",
                                    "cssClass": "custom-hotspot",
                                    "text": "Camera1",
                                    "clickHandlerFunc": camera1
                                },
                                {
                                    "pitch": 35.63,
                                    "yaw": -115.39,
                                    "type": "info",
                                    "cssClass": "custom-hotspot",
                                    "text": "camera2",
                                    "clickHandlerFunc": camera2
                                },
                                {
                                    "pitch": 47.13,
                                    "yaw": -125.14,
                                    "type": "info",
                                    "cssClass": "custom-hotspot",
                                    "text": "camera3",
                                    "clickHandlerFunc": camera3
                                },
                                {
                                    "pitch": -2.1,
                                    "yaw": 132.9,
                                    "type": "scene",
                                    "text": "Hitachi Floor Plan",
                                    "sceneId": "floorplan"
                                }
                            ]
                        }
                    }
                });
            }

            viewer = pannellum.viewer('panoramafov', ﻿ {
                "type": "equirectangular",
                "panorama": "assets/img/default.jpg",
                "showFullscreenCtrl": false,
                "autoLoad": true,
                "showControls": false
            });

            function camera1() {
                $scope.$apply(function() {
                    $scope.panomafov_hide = false;
                    $scope.panomafov_hide_duplicate = true;

                });

                viewer.destroy();
                viewer = pannellum.viewer('panoramafov', ﻿ {
                    "type": "equirectangular",
                    "hotSpotDebug": false,
                    "panorama": "assets/img/cam3.jpg",
                    "center pitch": -8.84,
                    "center yaw": -24.96,
                    "hfov": 120,
                    "vaov": 180,
                    "minYaw": -90,
                    "maxYaw": 90,
                    "minPitch": -90,
                    "maxPitch": 90,
                    "showFullscreenCtrl": false,
                    "autoLoad": true,
                    "showControls": false
                });
            }

            function camera2()

            {
                $scope.$apply(function() {
                    $scope.panomafov_hide = false;
                    $scope.panomafov_hide_duplicate = true;
                });

                viewer.destroy();
                viewer = pannellum.viewer('panoramafov', ﻿ {
                    "type": "equirectangular",
                    "hotSpotDebug": false,
                    "panorama": "assets/img/cam4.jpg",
                    "center pitch": -12.95,
                    "minYaw": -90,
                    "maxYaw": 90,
                    "minPitch": -90,
                    "maxPitch": 90,
                    "center yaw": -36.16,
                    "hfov": 120,
                    "vaov": 180,
                    "showFullscreenCtrl": false,
                    "autoLoad": true,
                    "showControls": false
                });

            }

            function camera3() {
                $scope.$apply(function() {
                    $scope.panomafov_hide = false;
                    $scope.panomafov_hide_duplicate = true;

                });
                viewer.destroy();
                viewer = pannellum.viewer('panoramafov', ﻿ {
                    "type": "equirectangular",
                    "hotSpotDebug": false,
                    "minYaw": -90,
                    "maxYaw": 90,
                    "minPitch": -90,
                    "maxPitch": 90,
                    "hfov": 87.36,
                    "vaov": 180,
                    "panorama": "assets/img/cam1.jpg",
                    "showFullscreenCtrl": false,
                    "autoLoad": true,
                    "showControls": false

                });
            }
        } else {
            alert("Your browser is not enabled with WebGL");
        }
    };

    $scope.floor_zoomin = function() {
        if ($scope.ShowFloorView == true) {
            var ghfov;
            ghfov = (viewer.getHfov()) - 10;
            $scope.distance = parseFloat(ghfov.toFixed(2));
            viewer.setHfov($scope.distance);
            $scope.distances();
        }
    };

    $scope.floor_zoomout = function() {
        if ($scope.ShowFloorView == true) {
            var ghfov;
            ghfov = (viewer.getHfov()) + 10;
            $scope.distance = parseFloat(ghfov.toFixed(2));
            viewer.setHfov($scope.distance);
            $scope.distances();
        }
    };
    $scope.move_3d_object_up = function() {
        $scope.focallength = $scope.focallength - 1;
        $scope.change_focal_length();
    }

    $scope.move_3d_object_down = function() {
        $scope.focallength = $scope.focallength + 1;
        $scope.change_focal_length();
    }

    $scope.fovWheelUp = function() {
        if ($scope.ShowFloorView == true) {
            var ghfov;
            viewer.setHfov(viewer.getHfov() - 10);
            ghfov = viewer.getHfov();
            $scope.distance = parseFloat(ghfov.toFixed(2));
            $scope.distances();
        } else if ($scope.ShowDefault3D == true) {
            var ghfov;
            default_viewer.setHfov(default_viewer.getHfov() - 10);
            ghfov = default_viewer.getHfov();
            $scope.distance = parseFloat(ghfov.toFixed(2));
            $scope.distances();

        }
    }

    $scope.fovWheelDown = function() {
        if ($scope.ShowFloorView == true) {
            var ghfov;
            viewer.setHfov(viewer.getHfov() + 10);
            ghfov = viewer.getHfov();
            $scope.distance = parseFloat(ghfov.toFixed(2));
            $scope.distances();
        } else if ($scope.ShowDefault3D == true) {
            var ghfov;
            default_viewer.setHfov(default_viewer.getHfov() + 10);
            ghfov = default_viewer.getHfov();
            $scope.distance = parseFloat(ghfov.toFixed(2));
            $scope.distances();

        }
    }


    $scope.convertImage = function(elementId) {
        try {
            var imgObj = document.getElementById(elementId);
            imgObj.style.display = "none";
            var canvas = document.createElement('canvas');
            var canvasContext = canvas.getContext('2d');
            var imgW = imgObj.width;
            var imgH = imgObj.height;
            canvas.width = imgW;
            canvas.height = imgH;
            canvasContext.drawImage(imgObj, 0, 0);
            var imgPixels = canvasContext.getImageData(0, 0, imgW, imgH);
            var data = imgPixels.data;
            for (var i = 0; i < data.length; i += 4) {
                data[i + 0] = data[i + 1] = data[i + 2] = (data[i] + data[i + 1] + data[i + 2]) / 3;
            }
            canvasContext.putImageData(imgPixels, 0, 0, 0, 0, imgW, imgH);
            imgObj.src = canvas.toDataURL();
            imgObj.style.display = "block";
        } catch (e) {}
    };
    $scope.fileezt = function(myFile) {
        $scope.not_correct_file = true;
        $scope.bankfilepath = $scope.myFile.name;
        $scope.bankfilepath = $scope.bankfilepath.replace(/^.*\./, '');
        if ($scope.bankfilepath == "zip") {
            $scope.file_extension = true;
            $scope.progress_time = false;


            $scope.uploadFile(true);
        } else
            $scope.file_extension = false;

    };

    //* for preload function*/
    $scope.loadPreuploaded3D = function(value) {

        progressbar_time(17000);
        $scope.ShowFloorView = false;
        //$scope.Show3DView = true;
        $scope.ShowMapView = false;
        $scope.ShowDefault3D = false;
        $scope.HideMapViewBtn = false;
        $scope.HidefloorDemoBtn = false;
        $scope.HideUploadBtn = false;
        $scope.Hide3DBtn = true;
        $scope.hideCameraButton = true;
        $scope.hideReportButton = true;
        $scope.progress_time = true;
        $scope.threedmodel = 1;
        $scope.Show3DView = true;
        $scope.load3Ddemo(value)
        $scope.focallength = 20;
        $scope.cc = 1;
        $scope.image3d_count = 1;
        $scope.hide3CameraButton = false;
        $scope.Show3DViews = true;
        //$(".overlay").hide();
    }

    $scope.load3Ddemo = function(modelObj) {
            var detectWebgl = modelService.detectWebgl().webGL;

            if (modelService.detectWebgl().webGL) {
                var container = document.getElementById("3dview");
                //var dd=$scope.result_aov;
                $scope.Show3DView = true;
                var re = modelService.initdemo(modelObj);
                //   modelService.fov_set(dd);
                modelService.setFOV($("#aov-input").val());
                modelService.callAnimate();
                $scope.Show3DView = true;
                clearInterval(drawbar_time);
                $('#pre_uploaded_models').modal('hide');
            } else {
                alert("Your browser is not enabled with WebGL");
            }
            $("#aov-input").on("input", function() {

            });

        }
        //*End for preload function*/

    $scope.uploadFile = function(doUpload) {

        progressbar_time(17000);
        $scope.ShowFloorView = false;
        //$scope.Show3DView = true;
        $scope.ShowMapView = false;
        $scope.ShowDefault3D = false;
        $scope.HideMapViewBtn = false;
        $scope.HidefloorDemoBtn = false;
        $scope.HideUploadBtn = false;
        $scope.Hide3DBtn = true;
        $scope.hideCameraButton = true;
        $scope.hideReportButton = true;
        var file = $scope.myFile;
        var uploadUrl = configFactory.strings.api + "multer";
        var fd = new FormData();
        var modelObj = {};
        fd.append('file', file);

        if (doUpload) {
            $http.post(uploadUrl, fd, {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined
                    }
                })
                .success(function(result) {
                    if (typeof result.obj !== "undefined" && typeof result.mtl !== "undefined") {

                        $scope.progress_time = true;
                        $scope.threedmodel = 1;
                        modelObj.obj = result.obj;
                        modelObj.mtl = result.mtl;
                        modelObj.path = 'http://192.168.11.246:8000/' + result.path + "/";
                        $scope.Show3DView = true;
                        $scope.load3D(modelObj)
                        $scope.focallength = 20;
                        $scope.cc = 1;
                        $scope.image3d_count = 1;
                        $scope.hide3CameraButton = false;
                        $scope.Show3DViews = true;

                    } else if (typeof result.converted != "undefined") {

                        $scope.progress_time = true;
                        $scope.threedmodel = 1;
                        modelObj.json = result.json;
                        modelObj.path = 'http://192.168.11.246:8000/' + result.path + '/' + modelObj.json;
                        $scope.Show3DView = true;
                        setTimeout(function() {
                            $scope.load3Ddemo(modelObj.path);
                        }, 10000);

                        $scope.focallength = 20;
                        $scope.cc = 1;
                        $scope.image3d_count = 1;
                        $scope.hide3CameraButton = false;
                        $scope.Show3DViews = true;
                        // $(".overlay").hide();

                    } else {
                        if ($scope.image3d_count == 0) {
                            $scope.not_correct_file = false;
                            $('#3dLoaderModal').modal('show');
                            $scope.ShowDefault3D = true;
                            //  $(".overlay").hide();
                        } else {
                            $scope.not_correct_file = false;
                            $('#3dLoaderModal').modal('show');
                            $scope.Show3DView = true;
                            // $(".overlay").hide();
                        }
                    }
                })
                .error(function() {

                    $scope.progress_time = true;
                    $scope.not_correct_file = false;
                    if ($scope.image3d_count == 0) {
                        $scope.ShowDefault3D = true;
                    }
                    $('#3dLoaderModal').modal('show');
                    // $(".overlay").hide();
                });
        } else {
            //alert("vannu");

            $scope.upload_btn = false;

        }
    };


    $scope.load3D = function(modelObj) {
        var detectWebgl = modelService.detectWebgl().webGL;

        if (modelService.detectWebgl().webGL) {
            var container = document.getElementById("3dview");
            //var dd=$scope.result_aov;
            $scope.Show3DView = true;
            var re = modelService.init(modelObj);
            //   modelService.fov_set(dd);
            modelService.setFOV($("#aov-input").val());
            modelService.callAnimate();
            $scope.Show3DView = true;
            clearInterval(drawbar_time);
            $('#3dLoaderModal').modal('hide');
        } else {
            alert("Your browser is not enabled with WebGL");
        }
        $("#aov-input").on("input", function() {

        });

    }

    //3dModal Loader
    $scope.objLoaderModal = function() {
        $('#3dLoaderModal').modal('show');

    }
    //Upload 2D objetc OverLay Start
    var imageSize = { width: '500', height: '600' };

    function getImgCornerPt(e) {
        switch (e) {
            case "nw":
                return {
                    x: 0,
                    y: 0
                };
            case "se":
                return {
                    x: imageSize.width,
                    y: imageSize.height
                };
            case "ne":
                return {
                    x: imageSize.width,
                    y: 0
                };
            case "sw":
                return {
                    x: 0,
                    y: imageSize.height
                }
        }
    }

    function createImageOverlayTransform(e, t) {
        var n, i, o, r, a, s, l, c, u, h, p, d, f;
        if (s = e.latLng.lat(), u = e.latLng.lng(), l = t.latLng.lat(), h = t.latLng.lng(), i = l - s, o = h - u, r = t.imgPt.x - e.imgPt.x, a = t.imgPt.y - e.imgPt.y, this.containerElementDisplay = Math.abs(i) < 1e-7 && Math.abs(o) < 1e-7 ? "none" : "block", Math.abs(r) < 1 && Math.abs(a) < 1) throw new Error("Reference points may not coincide. At least one of the x/y deltas must be greater than 0.");
        return n = s + i / 2, d = -(Math.atan2(-a, r) - Math.atan2(i, o * Math.cos(n * Math.PI / 180))), p = void 0, Math.abs(o) > 1e-7 && (p = o / (Math.cos(d) * r + Math.cos(d + Math.PI / 2) * -a)), c = void 0, Math.abs(i) > 1e-7 && (c = i / (Math.sin(d) * r + Math.sin(d + Math.PI / 2) * -a)), void 0 === c && (c = p * Math.cos(n * Math.PI / 180)), void 0 === p && (p = c / Math.cos(n * Math.PI / 180)), f = {
            r: d,
            latpp: c,
            lonpp: p,
            transform: function(t, n) {
                var i, o;
                return i = t - e.imgPt.x, o = n - e.imgPt.y, new google.maps.LatLng(s + Math.sin(d) * i * c + Math.sin(d + Math.PI / 2) * -o * c, u + Math.cos(d) * i * p + Math.cos(d + Math.PI / 2) * -o * p)
            }
        }
    }

    function FloorPlanOverlay(image, map) {
        // Initialize all properties.
        this.image_ = image;
        this.map_ = map;
        floorplan_save_values.imagesrc = image;

        // Define a property to hold the image's div. We'll
        // actually create this div upon receipt of the onAdd()
        // method so we'll leave it null for now.
        this.div_ = null;

        // Explicitly call setMap on this overlay.
        this.setMap(map);
    }


    FloorPlanOverlay.prototype = new google.maps.OverlayView();

    FloorPlanOverlay.prototype.onAdd = function() {
        this.containerElementDisplay = "block";
        if (floorplan_save_values != null) {
            if (floorplan_save_values.nwMarker) {
                this.nw = floorplan_save_values.nwMarker;
                this.se = floorplan_save_values.seMarker;
                this.xform = this.createImageOverlayTransformPivot({
                    latLng: this.nw,
                    imgPt: getImgCornerPt("nw")
                }, {
                    latLng: this.se,
                    imgPt: getImgCornerPt("se")
                });
                this.ne = this.xform.transform(imageSize.width, 0);
                this.sw = this.xform.transform(0, imageSize.height);
            } else {
                t = this.calculateInitialPosition();
                northwestmarker =
                    this.nw = t[0];
                this.se = t[1];
                this.xform = createImageOverlayTransform({
                    latLng: this.nw,
                    imgPt: getImgCornerPt("nw")
                }, {
                    latLng: this.se,
                    imgPt: getImgCornerPt("se")
                });
                this.ne = this.xform.transform(imageSize.width, 0);
                this.sw = this.xform.transform(0, imageSize.height);
            }
        } else {
            t = this.calculateInitialPosition();
            northwestmarker =
                this.nw = t[0];
            this.se = t[1];
            this.xform = createImageOverlayTransform({
                latLng: this.nw,
                imgPt: getImgCornerPt("nw")
            }, {
                latLng: this.se,
                imgPt: getImgCornerPt("se")
            });
            this.ne = this.xform.transform(imageSize.width, 0);
            this.sw = this.xform.transform(0, imageSize.height);
        }


        this.containerElement = null;



        this.initCornerMarkers();
        this.initRectangle();
        this.initHoverRectangle();

        var div = document.createElement('div'),
            that = this;
        div.style.borderStyle = 'none';
        div.style.borderWidth = '0px';
        div.style.position = 'absolute';
        div.draggable = true;
        this.containerElement = div;

        // Create the img element and attach it to the div.
        var img = document.createElement('img');
        img.src = this.image_;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.position = 'absolute';
        div.appendChild(img);

        this.div_ = div;

        // Add the element to the "overlayLayer" pane.
        //var panes = this.getPanes();
        //panes.overlayLayer.appendChild(div);

        //this.set('div',div)
        this.getPanes().overlayLayer.appendChild(div);

        this.zoomListener = google.maps.event.addListener(map, "zoom_changed", function(e) {
            return function() {
                return e.hoverRectangle.setPath(e.buildPathForHoverRectangle())
            }
        }(this))
    };

    FloorPlanOverlay.prototype.calculateInitialPosition = function() {
        var e, t, n, i, o, r, a, s, l, c, u, h, p, d, f, m;
        return l = this.getProjection(), p = $("#map").height(), m = $("#map").width(), f = p / 2, d = m / 2, i = imageSize.width, t = imageSize.height, a = .5 * m, n = a / i, r = t * n, h = f - r / 2, e = f + r / 2, o = d - a / 2, c = d + a / 2, s = l.fromContainerPixelToLatLng(new google.maps.Point(o, h)), u = l.fromContainerPixelToLatLng(new google.maps.Point(c, e)), [s, u]
    }

    FloorPlanOverlay.prototype.initCornerMarkers = function() {
        return ["nw", "se", "ne", "sw"].forEach(function(e) {
            return function(t) {
                var n;
                return n = e[t + "Marker"] = new google.maps.Marker({
                    position: e[t],
                    icon: {
                        url: "https://maps.google.com/mapfiles/kml/pal4/icon57.png",
                        origin: new google.maps.Point(0, 0),
                        anchor: new google.maps.Point(15, 15),
                        scaledSize: new google.maps.Size(30, 30)
                    },
                    zIndex: 101,
                    map: e.map,
                    draggable: !0,
                    raiseOnDrag: !1
                }), n.ptId = t, n.imgPt = getImgCornerPt(t), google.maps.event.addListener(n, "drag", function() {
                    return e.cornerMarkerDragEventHandler(n)
                }), google.maps.event.addListener(n, "mousedown", function(t) {
                    return e.setMarkerVisibileSoft(!1), google.maps.event.trigger(e, "mousedown", t)
                }), google.maps.event.addListener(n, "mouseup", function(t) {
                    return e.setMarkerVisibileSoft(!0), google.maps.event.trigger(e, "mouseup", t)
                }), google.maps.event.addListener(n, "mouseover", function() {
                    return $("#google-map").removeClass("rotateFloorPlan")
                }), google.maps.event.addListener(n, "rightclick", function() {
                    //floorPlanOverlay.setMap(null);
                    floorcontextMenu.show(e[t]);
                });
            }
        }(this)), [this.nwMarker, this.seMarker, this.neMarker, this.swMarker].forEach(function(e) {
            return function(t) {
                var n;
                return n = e.getDiagonalMarkers(t), google.maps.event.addDomListener(t, "mousedown", function() {
                    var i;
                    return i = google.maps.geometry.spherical.computeHeading(n[0].getPosition(), n[1].getPosition()), e.resizePath = e.buildDragPath(t.getPosition(), i)
                })
            }
        }(this))
    }

    FloorPlanOverlay.prototype.cornerMarkerDragEventHandler = function(e) {
        var t, n, i;
        return n = this.getDiagonalMarkers(e), t = this.getAdjacentMarkers(e), e.setPosition(this.findClosestPoint(e.getPosition(), this.resizePath)), i = google.maps.geometry.spherical.computeHeading(n[0].getPosition(), n[1].getPosition()), this.resizePath = this.buildDragPath(e.getPosition(), i), this.xform = this.createImageOverlayTransform({
            latLng: n[0].getPosition(),
            imgPt: n[0].imgPt
        }, {
            latLng: n[1].getPosition(),
            imgPt: n[1].imgPt
        }), t[0].setPosition(this.xform.transform(t[0].imgPt.x, t[0].imgPt.y)), t[1].setPosition(this.xform.transform(t[1].imgPt.x, t[1].imgPt.y)), this.rectangle.setPath(this.buildPathForRectangle()), this.draw(), google.maps.event.trigger(this, "position_changed", e.getPosition())
    }

    FloorPlanOverlay.prototype.createImageOverlayTransform = function(e, t) {
        var n, i, o, r, a, s, l, c, u, h, p, d, f;
        if (s = e.latLng.lat(), u = e.latLng.lng(), l = t.latLng.lat(), h = t.latLng.lng(), i = l - s, o = h - u, r = t.imgPt.x - e.imgPt.x, a = t.imgPt.y - e.imgPt.y, this.containerElementDisplay = Math.abs(i) < 1e-7 && Math.abs(o) < 1e-7 ? "none" : "block", Math.abs(r) < 1 && Math.abs(a) < 1) throw new Error("Reference points may not coincide. At least one of the x/y deltas must be greater than 0.");
        return n = s + i / 2, d = -(Math.atan2(-a, r) - Math.atan2(i, o * Math.cos(n * Math.PI / 180))), p = void 0, Math.abs(o) > 1e-7 && (p = o / (Math.cos(d) * r + Math.cos(d + Math.PI / 2) * -a)), c = void 0, Math.abs(i) > 1e-7 && (c = i / (Math.sin(d) * r + Math.sin(d + Math.PI / 2) * -a)), void 0 === c && (c = p * Math.cos(n * Math.PI / 180)), void 0 === p && (p = c / Math.cos(n * Math.PI / 180)), f = {
            r: d,
            latpp: c,
            lonpp: p,
            transform: function(t, n) {
                var i, o;
                return i = t - e.imgPt.x, o = n - e.imgPt.y, new google.maps.LatLng(s + Math.sin(d) * i * c + Math.sin(d + Math.PI / 2) * -o * c, u + Math.cos(d) * i * p + Math.cos(d + Math.PI / 2) * -o * p)
            }
        }
    }

    FloorPlanOverlay.prototype.createImageOverlayTransformPivot = function(e, t) {
        var n, i, o, r, a, s, l, c, u, h, p, d, f;
        if (s = e.latLng.lat, u = e.latLng.lng, l = t.latLng.lat, h = t.latLng.lng, i = l - s, o = h - u, r = t.imgPt.x - e.imgPt.x, a = t.imgPt.y - e.imgPt.y, this.containerElementDisplay = Math.abs(i) < 1e-7 && Math.abs(o) < 1e-7 ? "none" : "block", Math.abs(r) < 1 && Math.abs(a) < 1) throw new Error("Reference points may not coincide. At least one of the x/y deltas must be greater than 0.");
        return n = s + i / 2, d = -(Math.atan2(-a, r) - Math.atan2(i, o * Math.cos(n * Math.PI / 180))), p = void 0, Math.abs(o) > 1e-7 && (p = o / (Math.cos(d) * r + Math.cos(d + Math.PI / 2) * -a)), c = void 0, Math.abs(i) > 1e-7 && (c = i / (Math.sin(d) * r + Math.sin(d + Math.PI / 2) * -a)), void 0 === c && (c = p * Math.cos(n * Math.PI / 180)), void 0 === p && (p = c / Math.cos(n * Math.PI / 180)), f = {
            r: d,
            latpp: c,
            lonpp: p,
            transform: function(t, n) {
                var i, o;
                return i = t - e.imgPt.x, o = n - e.imgPt.y, new google.maps.LatLng(s + Math.sin(d) * i * c + Math.sin(d + Math.PI / 2) * -o * c, u + Math.cos(d) * i * p + Math.cos(d + Math.PI / 2) * -o * p)
            }
        }
    }

    FloorPlanOverlay.prototype.findClosestPoint = function(e, t) {
        var n, i;
        return i = new Array, n = new Array, $.each(t, function(t, o) {
            var r;
            r = google.maps.geometry.spherical.computeDistanceBetween(e, o), i[t] = r, n[r] = t
        }), "undefined" == typeof t[n[Math.min.apply(Math, i)] + 1] ? t[n[Math.min.apply(Math, i)]] : t[n[Math.min.apply(Math, i)] + 1]
    }

    FloorPlanOverlay.prototype.getAdjacentMarkers = function(e) {
        switch (e.ptId) {
            case "nw":
            case "se":
                return [this.neMarker, this.swMarker];
            case "ne":
            case "sw":
                return [this.nwMarker, this.seMarker]
        }
    }

    FloorPlanOverlay.prototype.buildDragPath = function(e, t) {
        var n, i, o;
        for (o = new Array, i = 1e3, n = i + 1; n -= 1;) o[n - 1] = google.maps.geometry.spherical.computeOffset(e, n / 10, t);
        for (n = i + 1; n -= 1;) o[i + n - 1] = google.maps.geometry.spherical.computeOffset(e, n / 10, 0 - (180 - t));
        return o
    }

    FloorPlanOverlay.prototype.setMarkerVisibileSoft = function(e) {
        return [this.nwMarker, this.neMarker, this.seMarker, this.swMarker].forEach(function() {
            return function(t) {
                var n;
                return e ? (n = t.getIcon(), n.url = "https://maps.google.com/mapfiles/kml/pal4/icon57.png", t.set("icon", n)) : (n = t.getIcon(), n.url = null, t.set("icon", n))
            }
        }(this))
    }


    FloorPlanOverlay.prototype.getDiagonalMarkers = function(e) {
        switch (e.ptId) {
            case "nw":
            case "se":
                return [this.nwMarker, this.seMarker];
            case "ne":
            case "sw":
                return [this.neMarker, this.swMarker]
        }
    }

    FloorPlanOverlay.prototype.getDiagonalMarker = function(e) {
        switch (e.ptId) {
            case "nw":
                return this.seMarker;
            case "se":
                return this.nwMarker;
            case "ne":
                return this.swMarker;
            case "sw":
                return this.neMarker
        }
    }


    FloorPlanOverlay.prototype.initRectangle = function() {

        this.rectangle = new google.maps.Polygon({
            path: this.buildPathForRectangle(),
            strokeColor: "#4CE91C",
            draggable: !0,
            strokeOpacity: 0,
            strokeWeight: 2,
            fillOpacity: 0,
            zIndex: 101,
            map: map
        });



        google.maps.event.addListener(this.rectangle, "drag", this.rectangleDragEventHandler.bind(this)),

            google.maps.event.addListener(this.rectangle, "mousedown", function(e) {
                return function(t) {
                    return google.maps.event.trigger(e, "mousedown", t)
                }
            }(this)), google.maps.event.addListener(this.rectangle, "mouseup", function(e) {
                return function(t) {
                    return google.maps.event.trigger(e, "mouseup", t)
                }
            }(this)), google.maps.event.addListener(this.rectangle, "rightclick", function(e) {
                return function(t) {
                    floorcontextMenu.show(t.latLng);
                    return google.maps.event.trigger(e, "rightclick", t)
                }
            }(this)), google.maps.event.addListener(this.rectangle, "dragstart", function(e) {
                return function() {
                    return e.setMarkerVisibileSoft(!1)
                }
            }(this)), google.maps.event.addListener(this.rectangle, "dragend", function(e) {
                return function() {
                    return e.setMarkerVisibileSoft(!0)
                }
            }(this))
    }

    FloorPlanOverlay.prototype.initHoverRectangle = function() {
        return this.hoverRectangle = new google.maps.Polygon({
            path: this.buildPathForHoverRectangle(),
            strokeColor: "#4CE91C",
            strokeOpacity: 0,
            strokeWeight: 2,
            fillOpacity: 0,
            zIndex: 99,
            map: this.map
        }), google.maps.event.addListener(this.hoverRectangle, "mouseover", function() {
            return function() {
                return $("#google-map").addClass("rotateFloorPlan")
            }
        }(this)), google.maps.event.addListener(this.hoverRectangle, "mouseout", function() {
            return function() {
                return $("#google-map").removeClass("rotateFloorPlan")
            }
        }(this)), google.maps.event.addListener(this.hoverRectangle, "mousedown", function(e) {
            return function(t) {
                var n, i;
                return e.setMarkerVisibileSoft(!1), e.map.setOptions({
                    draggable: !1
                }), e.hoverRectangle.setPath(e.buildPathForHoverRectangle(2e4)), e.hoverRectangle.set("zIndex", 105), i = google.maps.geometry.spherical.computeHeading(e.getBounds().getCenter(), t.latLng), n = google.maps.geometry.spherical.computeHeading(e.neMarker.getPosition(), e.swMarker.getPosition()), e.hoverListener = google.maps.event.addListener(e.hoverRectangle, "mousemove", function(t) {
                    var o, r, a, s;
                    return r = google.maps.geometry.spherical.computeHeading(e.getBounds().getCenter(), t.latLng), o = r - i, o += null != (a = o > 180) ? a : -{
                        360: null != (s = -180 > o) ? s : {
                            360: 0
                        }
                    }, e.rotateByDeg(o, n)
                })
            }
        }(this)), google.maps.event.addListener(this.hoverRectangle, "mouseup", function(e) {
            return function() {
                return e.setMarkerVisibileSoft(!0), e.hoverRectangle.setPath(e.buildPathForHoverRectangle()), e.hoverRectangle.set("zIndex", 99), e.map.setOptions({
                    draggable: !0
                }), google.maps.event.removeListener(e.hoverListener)
            }
        }(this))
    }

    FloorPlanOverlay.prototype.rotateByDeg = function(e, t) {
        var n, i, o;
        return t || (t = google.maps.geometry.spherical.computeHeading(this.neMarker.getPosition(), this.swMarker.getPosition())), i = google.maps.geometry.spherical.computeDistanceBetween(this.swMarker.getPosition(), this.neMarker.getPosition()), o = google.maps.geometry.spherical.computeOffset(this.getBounds().getCenter(), i / 2, t + e), n = google.maps.geometry.spherical.computeOffset(this.getBounds().getCenter(), i / 2, 0 - (180 - (t + e))), this.swMarker.setPosition(o), this.neMarker.setPosition(n), this.xform = this.createImageOverlayTransform({
            latLng: o,
            imgPt: this.swMarker.imgPt
        }, {
            latLng: n,
            imgPt: this.neMarker.imgPt
        }), this.seMarker.setPosition(this.xform.transform(this.seMarker.imgPt.x, this.seMarker.imgPt.y)), this.nwMarker.setPosition(this.xform.transform(this.nwMarker.imgPt.x, this.nwMarker.imgPt.y)), this.rectangle.setPath(this.buildPathForRectangle()), this.draw(), google.maps.event.trigger(this, "position_changed", this.getPosition())
    }

    FloorPlanOverlay.prototype.getBounds = function() {
        var e;
        return e = new google.maps.LatLngBounds, this.buildPathForRectangle().forEach(function(t) {
            return e.extend(t)
        }), e
    }

    FloorPlanOverlay.prototype.buildPathForHoverRectangle = function(e) {
        var t;
        return e || (e = 25), t = this.getProjection(), [this.nwMarker, this.neMarker, this.seMarker, this.swMarker, this.nwMarker].map(function(n) {
            return function(i) {
                var o, r, a, s, l;
                return o = n.getDiagonalMarker(i), a = t.fromLatLngToDivPixel(i.getPosition()), r = google.maps.geometry.spherical.computeHeading(o.getPosition(), i.getPosition()) - 90, s = a.x + Math.cos(r * Math.PI / 180) * e, l = a.y + Math.sin(r * Math.PI / 180) * e, t.fromDivPixelToLatLng(new google.maps.Point(s, l))
            }
        }(this))
    }

    FloorPlanOverlay.prototype.buildPathForRectangle = function() {
        return [this.nwMarker.getPosition(), this.neMarker.getPosition(), this.seMarker.getPosition(), this.swMarker.getPosition(), this.nwMarker.getPosition()];
    }

    FloorPlanOverlay.prototype.rectangleDragEventHandler = function() {
        var e;
        return e = this.rectangle.getPath().getArray(), this.nwMarker.setPosition(e[0]), this.neMarker.setPosition(e[1]), this.seMarker.setPosition(e[2]), this.swMarker.setPosition(e[3]), this.hoverRectangle.setPath(this.buildPathForHoverRectangle()),
            this.draw(),
            google.maps.event.trigger(this, "position_changed", this.getPosition())
    }

    FloorPlanOverlay.prototype.getPosition = function() {
        return {
            nw: this.nwMarker.getPosition(),
            se: this.seMarker.getPosition()
        }
    }

    FloorPlanOverlay.prototype.draw = function() {
        var e, t, n, i, o, r, a, s, l, c, u, h;

        return e = this.containerElement,
            a = this.getProjection(),
            c = a.fromLatLngToDivPixel(this.swMarker.getPosition()),
            r = a.fromLatLngToDivPixel(this.neMarker.getPosition()),
            n = r.x - c.x,
            o = c.y - r.y,
            e.style.display = "block",
            t = imageSize.width,
            i = imageSize.height,
            s = Math.atan2(o, n) - Math.atan2(i, t),
            l = Math.sqrt(n * n + o * o) / Math.sqrt(t * t + i * i),
            e.style.display = this.containerElementDisplay,
            e.style.left = c.x - (l * 520) / 2 + "px",
            e.style.top = c.y - l * imageSize.height + "px",
            e.style.width = l * imageSize.width + "px",
            e.style.height = l * imageSize.height + "px",
            bounds = new google.maps.LatLngBounds(this.swMarker.getPosition(), this.neMarker.getPosition()),
            floorplan_save_values.seMarker = this.seMarker.getPosition(),
            floorplan_save_values.nwMarker = this.nwMarker.getPosition()
    };

    // The onRemove() method will be called automatically from the API if
    // we ever set the overlay's map property to 'null'.
    FloorPlanOverlay.prototype.onRemove = function() {
        bounds = null;
        this.containerElement.parentNode.removeChild(this.containerElement), this.containerElement = null,
            google.maps.event.removeListener(this.zoomListener), [this.nwMarker,
                this.neMarker, this.seMarker, this.swMarker, this.nwMarker, this.rectangle, this.hoverRectangle
            ].forEach(function(e) {
                return e.setMap(null), e = null
            })
    };

    //End of upload 2D Object overlay   

    $scope.onSaveButtonClicked = function(fromSaveOrSaveas) {

        if (!checkPermission(StorageService.getDatavalue("role"), "save")) {
            $('#NeedPayedAccount').modal('show');
            return;
        } else {

            if (fromSaveOrSaveas == 'save') {
                $($scope.save_modal_id).modal('show');
            } else {
                $('#saveAs').modal('show');
            }
        }

    }

    $scope.selectSaveModal = function() {
        if ($scope.projectName == '') {
            $('#saveAs_Upgrade').modal('show');
            $('#myAccount').modal('hide');
            //$('body').removeClass('modal-open');
            //$('.modal-backdrop').remove();
        } else {
            $('#Save_Upgrd').modal('show');
            $('#myAccount').modal('hide');
            //$('body').removeClass('modal-open');
            //$('.modal-backdrop').remove();
        }
    }

    $scope.onOpenProjectClicked = function() {

        if (!checkPermission(StorageService.getDatavalue("role"), "open")) {
            $('#NeedPayedAccount').modal('show');
            return;
        }

        $('#myModalopen').modal('show');
    }

    $scope.onDeleteProjectClicked = function() {

        if (!checkPermission(StorageService.getDatavalue("role"), "delete")) {
            $('#NeedPayedAccount').modal('show');
            return;
        }

        $('#deleteModal').modal('show');
    }

    $scope.openProject = function() {

        cam_count = 0;

        /*MODIFIED TO INCLUDE CAMERA ICON START*/
        labelCount = 0;
        /*MODIFIED TO INCLUDE CAMERA ICON END*/

        $scope.a = [];
        $scope.loadLocation();
        ProjectService.openSelected($scope.projectTitle.pname);
        $scope.uniqueID = ProjectService.uniqID;
        $scope.user_id = ProjectService.user_id;
        $scope.projectName = ProjectService.projectName;
        $scope.datas = ProjectService.datas;
        $scope.cppf = parseFloat(ProjectService.cppf);
        $scope.data = ProjectService.data;
        $scope.focallength = parseFloat(ProjectService.focallength);
        $scope.result_aov = parseFloat(ProjectService.result_aov);

        if ($scope.result_aov > 180)
            $scope.span_aov_invalid = false;
        else
            $scope.span_aov_invalid = true;

        if ($scope.cppf > 0) {
            $scope.span_invalid = true;
        } else {
            $scope.span_invalid = false;
        }

        $scope.distance = parseFloat(ProjectService.distance.toFixed(2));
        $scope.width = parseFloat(ProjectService.width);
        $scope.cameraheight = parseFloat(ProjectService.cameraheight);
        $scope.sceneheight = parseFloat(ProjectService.sceneheight);
        $scope.Tilt = parseFloat(ProjectService.Tilt);
        $scope.unit = ProjectService.unit;
        /*SELECT CAMERA FEATURE*/
        $scope.Imager_Size_orginal = ProjectService.Imager_Size_orginal;
        $scope.image_sizer = ProjectService.image_sizer;
        $scope.image_sizer_span = ProjectService.image_sizer_span;

        /*MODIFIED TO INCLUDE CAMERA ICON START*/
        $scope.imageUrl = ProjectService.imageurl;
        /*MODIFIED TO INCLUDE CAMERA ICON END*/

        $scope.buttonname = ProjectService.buttonname;

        $scope.last_location = ProjectService.last_location;

        /*SELECT CAMERA FEATURE*/
        $scope.save_modal_id = '#Save';
        var openedproj = $scope.savedProject[$scope.projectTitle.pname];
        var arr_index = 0;
        if (typeof(openedproj.cameras) != 'undefined') {
            active_camera_index = 0;
            var camsarray = openedproj.cameras;
            var length = camsarray.length;

            /*MODIFIED TO INCLUDE CAMERA ICON START*/
            labelCount = 1;
            /*MODIFIED TO INCLUDE CAMERA ICON END*/

            for (var key in camsarray) {

                /*MODIFIED TO INCLUDE CAMERA ICON START*/
                $scope.a.push(new camera(camsarray[key].camera_id, camsarray[key].cameramarker, camsarray[key].subjectMarker, camsarray[key].horizontalaov, camsarray[key].color, camsarray[key].title, camsarray[key].imageurl, camsarray[key].camBadgeText));
                /*MODIFIED TO INCLUDE CAMERA ICON END*/

                $scope.a[arr_index].tilt = camsarray[key].tilt;
                $scope.a[arr_index].scene_height = camsarray[key].scene_height;
                $scope.a[arr_index].camera_height = camsarray[key].camera_height;
                $scope.a[arr_index].ppf = camsarray[key].ppf;
                $scope.a[arr_index].width = camsarray[key].width;
                $scope.a[arr_index].distance = camsarray[key].distance;
                $scope.a[arr_index].aov = camsarray[key].aov;
                $scope.a[arr_index].focal_length = camsarray[key].focal_length;
                //$scope.a[arr_index].imager_size = camsarray[key].imager_size;
                //$scope.a[arr_index].resolution = camsarray[key].resolution;
                $scope.a[arr_index].data = camsarray[key].data;
                $scope.a[arr_index].datas = camsarray[key].datas;
                $scope.a[arr_index].unit = camsarray[key].unit;
                $scope.a[arr_index].Imager_Size_orginal = camsarray[key].Imager_Size_orginal;
                $scope.a[arr_index].image_sizer = camsarray[key].image_sizer;
                $scope.a[arr_index].image_sizer_span = camsarray[key].image_sizer_span;
                $scope.a[arr_index].buttonname = camsarray[key].buttonname;
                $scope.a[arr_index].color = camsarray[key].color;
                $scope.a[arr_index].title = camsarray[key].title;

                /*MODIFIED TO INCLUDE CAMERA ICON START*/
                $scope.a[arr_index].imageurl = camsarray[key].imageurl;
                $scope.a[arr_index].camBadgeText = camsarray[key].camBadgeText;
                /*MODIFIED TO INCLUDE CAMERA ICON END*/

                arr_index++;
                cam_count++;

                /*MODIFIED TO INCLUDE CAMERA ICON START*/
                labelCount++;
                /*MODIFIED TO INCLUDE CAMERA ICON END*/

            }
        }

        if (typeof(openedproj.floorplan) != 'undefined') {
            $scope.Hide2DObjectRemoveBtn = false;
            $scope.Hide2DObjectBtn = true;
            var floorplanarray = openedproj.floorplan;
            floorplan_save_values = floorplanarray;
            floorPlanOverlay = new FloorPlanOverlay(floorplanarray.imagesrc, map);
            $scope.floorPlan2D = true;
        } else {
            floorplan_save_values = {};
            $scope.Hide2DObjectRemoveBtn = true;
            $scope.Hide2DObjectBtn = false;
            $scope.floorPlan2D = false;
        }
        var location_value = StorageService.getDatavalue("last_location");
        location_value = JSON.parse(location_value);
        $scope.setLocation($scope.last_location.location, $scope.last_location.zoom);
        //$scope.setLocation(location_value.location, location_value.zoom);

    }

    $scope.deleteProject = function() {

        if ($scope.savedProject[$scope.projectTitle.pname].title == $scope.projectName) {
            ProjectService.deleteSelected($scope.projectTitle.pname);
            $scope.createNewProject();
        } else {
            ProjectService.deleteSelected($scope.projectTitle.pname);
        }
    }

    $scope.saveProjectAs = function() {
        usrId = StorageService.getDatavalue("U_ID");
        ProjectService.getAll(usrId).then(function(data) {

            var url = configFactory.strings.api + 'projects/';
            $scope.savedProject = data;
            var len = $scope.savedProject.length;
            for (i = 0; i < len; i++) {
                if ($scope.savedProject[i].title == $scope.projectNameSaveAs) {
                    $("#saveWarning").modal("show");
                    return;
                }
            }
            var image_name = "sample image.jpg"
            var length = $scope.a.length;
            var cams = [];
            var cam_objects = {};
            var default_camera_values = {};
            var project_data = {};
            var floorplan_obj = {};
            var floor_pos = {};
            for (i = 0; i < length; i++) {
                $scope.camera_details = {
                    'camera_id': $scope.a[i].cameraId,
                    'cameramarker': $scope.a[i].cameramarker.getPosition(),
                    'horizontalaov': $scope.a[i].horizontalaov,
                    'subjectMarker': $scope.a[i].subjectMarker.getPosition(),
                    'tilt': $scope.a[i].tilt,
                    'scene_height': $scope.a[i].scene_height,
                    'camera_height': $scope.a[i].camera_height,
                    'ppf': $scope.a[i].ppf,
                    'width': $scope.a[i].width,
                    'distance': $scope.a[i].distance,
                    'aov': $scope.a[i].aov,
                    'focal_length': $scope.a[i].focal_length,
                    //'imager_size'               : $scope.a[i].imager_size,
                    //'resolution'                : $scope.a[i].resolution,

                    'data': $scope.a[i].data,
                    'datas': $scope.a[i].datas,

                    'unit': $scope.a[i].unit,
                    'Imager_Size_orginal': $scope.a[i].Imager_Size_orginal,
                    'image_sizer': $scope.a[i].image_sizer,
                    'image_sizer_span': $scope.a[i].image_sizer_span,
                    'buttonname': $scope.a[i].buttonname,
                    'color': $scope.a[i].color,
                    'title': $scope.a[i].title,

                    /*MODIFIED TO INCLUDE CAMERA ICON START*/
                    'imageurl': $scope.a[i].imageurl,
                    'camBadgeText': $scope.a[i].camBadgeText
                        /*MODIFIED TO INCLUDE CAMERA ICON START*/
                   // 'resolutionDAta':    

                };

                cams.push($scope.camera_details);
                var key = "camera" + i;
                cam_objects[key] = $scope.camera_details;
            }
            default_camera_values = {
                'tilt': $scope.Tilt,
                'scene_height': $scope.sceneheight,
                'camera_height': $scope.cameraheight,
                'ppf': $scope.cppf,
                'width': $scope.width,
                'distance': $scope.distance,
                'aov': $scope.result_aov,
                'focal_length': $scope.focallength,
                //'imager_size'               : $scope.data.selectedOption,
                //'resolution'                : $scope.datas.selectedresolutions,

                'data': $scope.data,
                'datas': $scope.datas,

                'unit': $scope.unit
            }

            //var usrId = localStorage.getItem("U_ID");
            project_data["user_id"] = usrId;
            project_data["title"] = $scope.projectNameSaveAs;
            project_data["cameras"] = cam_objects;
            project_data["floor_plan_image"] = image_name;
            project_data["default"] = default_camera_values;
            project_data["floorplan"] = floorplan_save_values;
            $scope.saveLastLocation();
            project_data["last_location"] = $scope.last_location;
            var data = JSON.stringify(project_data);
            $http.post(url, data).success(function(response, status) {
                $scope.uniqueID = response._id;
                $scope.projectName = $scope.projectNameSaveAs;
                /*********/
                $scope.localData = JSON.parse(data);
                /*********/
            });
            $scope.save_modal_id = '#Save';
        });

    }

    $scope.saveProject = function() {
        var image_name = "sample image.jpg"
        var length = $scope.a.length;
        var cams = [];
        var cam_objects = {};
        var project_data = {};
        for (i = 0; i < length; i++) {
            $scope.camera_details = {
                'camera_id': $scope.a[i].cameraId,
                'cameramarker': $scope.a[i].cameramarker.getPosition(),
                'horizontalaov': $scope.a[i].horizontalaov,
                'subjectMarker': $scope.a[i].subjectMarker.getPosition(),
                'tilt': $scope.a[i].tilt,
                'scene_height': $scope.a[i].scene_height,
                'camera_height': $scope.a[i].camera_height,
                'ppf': $scope.a[i].ppf,
                'width': $scope.a[i].width,
                'distance': $scope.a[i].distance,
                'aov': $scope.a[i].aov,
                'focal_length': $scope.a[i].focal_length,
                //'imager_size'               : $scope.a[i].imager_size,
                //'resolution'                : $scope.a[i].resolution,

                'data': $scope.a[i].data,
                'datas': $scope.a[i].datas,

                'unit': $scope.a[i].unit,
                'Imager_Size_orginal': $scope.a[i].Imager_Size_orginal,
                'image_sizer': $scope.a[i].image_sizer,
                'image_sizer_span': $scope.a[i].image_sizer_span,
                'buttonname': $scope.a[i].buttonname,
                'color': $scope.a[i].color,
                'title': $scope.a[i].title,
                /*MODIFIED TO INCLUDE CAMERA ICON START*/
                'imageurl': $scope.a[i].imageurl,
                'camBadgeText': $scope.a[i].camBadgeText
                    /*MODIFIED TO INCLUDE CAMERA ICON END*/
            };

            cams.push($scope.camera_details);
            var key = "camera" + i;
            cam_objects[key] = $scope.camera_details;
        }
        default_camera_values = {
            'tilt': $scope.Tilt,
            'scene_height': $scope.sceneheight,
            'camera_height': $scope.cameraheight,
            'ppf': $scope.cppf,
            'width': $scope.width,
            'distance': $scope.distance,
            'aov': $scope.result_aov,
            'focal_length': $scope.focallength,
            //'imager_size'               : $scope.data.selectedOption,
            //'resolution'                : $scope.datas.selectedresolutions,

            'data': $scope.data,
            'datas': $scope.datas,

            'unit': $scope.unit
        }
        var usrId = StorageService.getDatavalue("U_ID");
        project_data["user_id"] = usrId;
        project_data["title"] = $scope.projectName;
        project_data["cameras"] = cam_objects;
        project_data["floor_plan_image"] = image_name;
        project_data["default"] = default_camera_values;
        project_data["floorplan"] = floorplan_save_values;

        $scope.saveLastLocation();
        project_data["last_location"] = $scope.last_location;

        var data = JSON.stringify(project_data);
        ProjectService.saveSelected($scope.uniqueID, data);
        /*********/
        $scope.localData = JSON.parse(data);
        /*********/
        $scope.save_modal_id = '#Save';
        $scope.openProjects();

    }

    $scope.createNewProject = function() {
        /* to refresh map*/
        cam_count = 0;

        /*MODIFIED TO INCLUDE CAMERA ICON START*/
        labelCount = 0;
        $scope.imageUrl = '';
        /*MODIFIED TO INCLUDE CAMERA ICON END*/

        $scope.a = [];
        $scope.Hide2DObjectRemoveBtn = true;
        $scope.Hide2DObjectBtn = false;
        floorplan_save_values = {};

        $scope.loadLocation();

        /* to refresh map*/
        $scope.user_id = ProjectService.user_id;
        $scope.projectName = '';
        $scope.datas = {
            selectedresolutions: $scope.resolutions[6].value
        };
        $scope.cppf = 11.5;
        $scope.data = {
            selectedOption: $scope.availableOptions[2].value
        };
        $scope.focallength = 2.9;
        $scope.result_aov = 79.22;
        $scope.distance = 101;
        $scope.width = 167.2;
        $scope.cameraheight = 10;
        $scope.sceneheight = 10;
        $scope.Tilt = 0.00;
        /*clear selected camera*/
        $scope.Imager_Size_orginal = "Imager_Size";
        $scope.image_sizer = false;
        $scope.image_sizer_span = true;
        $scope.buttonname = "Add Camera";
        $scope.add_camera = true;
        /*clear selected camera*/
        $scope.save_modal_id = '#saveAs';

        $scope.hideDynamicStreet = false;
        $scope.StreetView = "StreetView";
    }

    $scope.aov = function() {
        $scope.result_aov = parseFloat((2 * (Math.atan(($scope.data.selectedOption * 0.5) / $scope.focallength) * (180 / Math.PI))).toFixed(2));
        $scope.width = parseFloat($scope.result_aov >= 180 ? (6.28 * $scope.distance).toFixed(2) : (Math.tan($scope.result_aov / 2 * Math.PI / 180) * $scope.distance * 2).toFixed(2));
        $scope.cppf = parseFloat(($scope.datas.selectedresolutions / $scope.width).toFixed(1));
        $scope.updateCameraObject(active_camera_index);
        // Updating 3d view for new AOV value
        modelService.setFOV($scope.result_aov);

    };

    $scope.change_focal_length = function() {

        if ($scope.focallength >= 0) {
            $scope.span_focal_invalid = true;
            $scope.result_aov = parseFloat((2 * (Math.atan(($scope.data.selectedOption * 0.5) / $scope.focallength) * (180 / Math.PI))).toFixed(2));

            $scope.width = parseFloat($scope.result_aov >= 180 ? (6.28 * $scope.distance).toFixed(2) : (Math.tan($scope.result_aov / 2 * Math.PI / 180) * $scope.distance * 2).toFixed(2));
            $scope.cppf = parseFloat(($scope.datas.selectedresolutions / $scope.width).toFixed(1));

            // Updating 3d view for new AOV value
            // modelService.setFOV($scope.result_aov);

        } else {
            $scope.span_focal_invalid = false;
            $scope.focallength = 0;
        }
        $scope.span_aov_invalid = true;
        if ($scope.a.length != 0) {
            $scope.updateCameraObject(active_camera_index);
            $scope.updateOnCameraClicked();
        }


    };

    $scope.focal_length = function() {
        $scope.span_aov_invalid = true;
        $scope.span_invalid = true;
        if ($scope.result_aov >= 1 && $scope.result_aov <= 180) {
            $scope.span_aov_invalid = true;
            $scope.focallength = parseFloat((360 == parseInt($scope.result_aov)) ? 0 : parseFloat(($scope.data.selectedOption / 2) / Math.tan(($scope.result_aov / 2) * Math.PI / 180)).toFixed(2));

            $scope.width = parseFloat($scope.result_aov >= 180 ? (6.28 * $scope.distance).toFixed(2) : (Math.tan($scope.result_aov / 2 * Math.PI / 180) * $scope.distance * 2).toFixed(2));
            $scope.cppf = parseFloat(($scope.datas.selectedresolutions / $scope.width).toFixed(1));

            if ($scope.ShowMapView == true && $scope.hideDynamicStreet == true) {
                street_viewer.setHfov($scope.result_aov);
            }
            // $scope.updateCameraObject(active_camera_index);
            $scope.image_change();

        } else {
            $scope.span_aov_invalid = false;

        }
        if ($scope.a.length != 0) {
            $scope.updateCameraObject(active_camera_index);
            $scope.updateOnCameraClicked();
            //$scope.a[active_camera_index].
        }
    };

    $scope.distances = function() {
        $scope.span_invalid = true;
        if ($scope.distance >= 0) {
            $scope.span_distance_invalid = true;
            $scope.width = parseFloat($scope.result_aov >= 180 ? (6.28 * $scope.distance).toFixed(1) : (Math.tan($scope.result_aov / 2 * Math.PI / 180) * $scope.distance * 2).toFixed(1));
            $scope.cppf = parseFloat(($scope.datas.selectedresolutions / $scope.width).toFixed(1));
            if (!isFinite($scope.cppf)) {
                $scope.span_invalid = false;
            } else {
                $scope.span_invalid = true;
            }
            $scope.image_change();
            if ($scope.ShowDefault3D == true) {
                default_viewer.setHfov($scope.distance);

            }
            if ($scope.ShowFloorView == true) {
                viewer.setHfov($scope.distance);
            }

        } else if (!isFinite($scope.distance)) {
            $scope.span_distance_invalid = false;
        } else {
            $scope.span_distance_invalid = false;
            $scope.distance = 0;
        }
        if ($scope.a.length != 0) {
            $scope.updateCameraObject(active_camera_index);
        }
    };

    $scope.ppff = function() {

        $scope.$watch(function(scope) { return $scope.datas.selectedresolutions },
            function(newValue, oldValue) {

            }
        );

        var resol = $scope.datas;
        $scope.cppf = parseFloat((resol.selectedresolutions / $scope.width).toFixed(1));

        $scope.a[active_camera_index].datas = resol;

        if (!isFinite($scope.cppf)) {
            $scope.span_invalid = false;
        } else {
            $scope.span_invalid = true;
        }
        if ($scope.a.length != 0) {
            $scope.updateCameraObject(active_camera_index);
            //alert(active_camera_index);
        }
    };
    $scope.ppfwidth = function() {
        if ($scope.cppf == 0) {

            $scope.span_invalid = false;
            $scope.width = 167.2;
            $scope.distance = 101;

        } else if ($scope.cppf < 0) {
            $scope.span_invalid = false;
            $scope.cppf = 0;
            $scope.width = 167.2;
            $scope.distance = 101;

        } else if (!isFinite($scope.cppf)) {
            $scope.span_invalid = false;
        } else {
            $scope.span_invalid = true;
            $scope.distance = parseFloat($scope.distance = ($scope.datas.selectedresolutions / $scope.cppf / Math.tan(($scope.result_aov / 2) * Math.PI / 180) / 2).toFixed(0));
            $scope.width = parseFloat($scope.result_aov >= 180 ? (6.28 * $scope.distance).toFixed(1) : (Math.tan($scope.result_aov / 2 * Math.PI / 180) * $scope.distance * 2).toFixed(1));
            $scope.ppf_image = $scope.cppf;
            $scope.ppf_image_size = [0, 2.5, 4.1, 6.6, 9.1, 11.1, 13.6, 17.6, 21.1, 23.6, 27.6, 32.6, 37.6, 45.6, 55.1, 70.1, 90.1, 125, 175.1];
            if ($scope.ShowDefault3D == true) {
                default_viewer.setHfov($scope.distance);

            }
            if ($scope.ShowFloorView == true) {
                viewer.setHfov($scope.distance);
            }

            for ($scope.i = 1; $scope.i <= $scope.ppf_image_size.length; $scope.i++) {
                if ($scope.ppf_image >= $scope.ppf_image_size[$scope.i]) {
                    $scope.index_image = $scope.i;
                } else {
                    switch ($scope.index_image) {
                        case 0:
                            $scope.app_fov_image = 1;
                            break;
                        case 1:
                            $scope.app_fov_image = 3;
                            break;
                        case 2:
                            $scope.app_fov_image = 5;
                            break;
                        case 3:
                            $scope.app_fov_image = 8;
                            break;
                        case 4:
                            $scope.app_fov_image = 10;
                            break;
                        case 5:
                            $scope.app_fov_image = 12;
                            break;
                        case 6:
                            $scope.app_fov_image = 15;
                            break;
                        case 7:
                            $scope.app_fov_image = 20;
                            break;
                        case 8:
                            $scope.app_fov_image = 22;
                            break;
                        case 9:
                            $scope.app_fov_image = 25;
                            break;
                        case 10:
                            $scope.app_fov_image = 30;
                            break;
                        case 11:
                            $scope.app_fov_image = 35;
                            break;
                        case 12:
                            $scope.app_fov_image = 40;
                            break;
                        case 13:
                            $scope.app_fov_image = 50;
                            break;
                        case 14:
                            $scope.app_fov_image = 60;
                            break;
                        case 15:
                            $scope.app_fov_image = 80;
                            break;
                        case 16:
                            $scope.app_fov_image = 100;
                            break;
                        case 17:
                            $scope.app_fov_image = 150;
                            break;
                        case 18:
                            $scope.app_fov_image = 200;
                            break;


                    }
                    $scope.timg = "ppf_day_" + $scope.app_fov_image + ".jpg";
                    break;
                }

            }

        }
        if ($scope.a.length != 0) {

            $scope.updateCameraObject(active_camera_index);
            $scope.updateOnCameraClicked();
        }


    };
    $scope.image_change = function() {
        $scope.ppf_image = $scope.cppf;
        $scope.ppf_image_size = [0, 2.5, 4.1, 6.6, 9.1, 11.1, 13.6, 17.6, 21.1, 23.6, 27.6, 32.6, 37.6, 45.6, 55.1, 70.1, 90.1, 125, 175.1];

        for ($scope.i = 1; $scope.i <= $scope.ppf_image_size.length; $scope.i++) {
            if ($scope.ppf_image >= $scope.ppf_image_size[$scope.i]) {
                $scope.index_image = $scope.i;
            } else {
                switch ($scope.index_image) {
                    case 0:
                        $scope.app_fov_image = 1;
                        break;
                    case 1:
                        $scope.app_fov_image = 3;
                        break;
                    case 2:
                        $scope.app_fov_image = 5;
                        break;
                    case 3:
                        $scope.app_fov_image = 8;
                        break;
                    case 4:
                        $scope.app_fov_image = 10;
                        break;
                    case 5:
                        $scope.app_fov_image = 12;
                        break;
                    case 6:
                        $scope.app_fov_image = 15;
                        break;
                    case 7:
                        $scope.app_fov_image = 20;
                        break;
                    case 8:
                        $scope.app_fov_image = 22;
                        break;
                    case 9:
                        $scope.app_fov_image = 25;
                        break;
                    case 10:
                        $scope.app_fov_image = 30;
                        break;
                    case 11:
                        $scope.app_fov_image = 35;
                        break;
                    case 12:
                        $scope.app_fov_image = 40;
                        break;
                    case 13:
                        $scope.app_fov_image = 50;
                        break;
                    case 14:
                        $scope.app_fov_image = 60;
                        break;
                    case 15:
                        $scope.app_fov_image = 80;
                        break;
                    case 16:
                        $scope.app_fov_image = 100;
                        break;
                    case 17:
                        $scope.app_fov_image = 150;
                        break;
                    case 18:
                        $scope.app_fov_image = 200;
                        break;


                }
                $scope.timg = "ppf_day_" + $scope.app_fov_image + ".jpg";
                break;
            }

        }
    };
    $scope.ppfwidth();


    $scope.minus_aov = function() {
        var pp;
        $scope.result_aov = parseFloat(($scope.result_aov - 1).toFixed(2));
        $scope.focal_length();
        $scope.image_change();
        if ($scope.image_coo == 1) {
            pp = $scope.image_street + $scope.result_aov + "&pitch=0";
        } else {
            pp = "https://maps.googleapis.com/maps/api/streetview?key=AIzaSyCFW1G080NFMVFuIXKLouPSM3lTGm9X8J8&size=640x483&location=40.76200623199031,-73.95792075257623&heading=140.01337608699498&fov=" + $scope.result_aov + "&pitch=0.00";
        }
        var svs = document.getElementById("streetview-image");
        svs.src = pp;
    };

    $scope.plus_aov = function() {
        var pp;
        $scope.result_aov = parseFloat(($scope.result_aov + 1).toFixed(2));
        $scope.focal_length();
        $scope.image_change();
        if ($scope.image_coo == 1) {
            pp = $scope.image_street + $scope.result_aov + "&pitch=0";
        } else {
            pp = "https://maps.googleapis.com/maps/api/streetview?key=AIzaSyCFW1G080NFMVFuIXKLouPSM3lTGm9X8J8&size=640x483&location=40.76200623199031,-73.95792075257623&heading=140.01337608699498&fov=" + $scope.result_aov + "&pitch=0.00";
        }
        var svs = document.getElementById("streetview-image");
        svs.src = pp;
    };

    $scope.cTilt = function() {
        if ($scope.cameraheight >= 0) {
            $scope.span_camera_invalid = true;
            $scope.Tilt = parseFloat((Math.atan(($scope.sceneheight - $scope.cameraheight) / $scope.distance) * 180 / Math.PI).toFixed(2));
        } else {
            $scope.span_camera_invalid = false;
            $scope.cameraheight = 0;
        }
    };
    $scope.sTilt = function() {
        if ($scope.sceneheight >= 0) {
            $scope.span_sheight_invalid = true;
            $scope.Tilt = parseFloat((Math.atan(($scope.sceneheight - $scope.cameraheight) / $scope.distance) * 180 / Math.PI).toFixed(2));
        } else {
            $scope.span_sheight_invalid = false;
            $scope.sceneheight = 0;
        }
    };
    $scope.Tilts = function() {
        $scope.cameraheight = parseFloat(($scope.sceneheight - Math.tan(new Number($scope.Tilt) * Math.PI / 180) * $scope.distance).toFixed(0));
    };
    $scope.widths = function() {

        if ($scope.width >= 0) {
            $scope.span_width_invalid = true;
            $scope.cppf = parseFloat(($scope.datas.selectedresolutions / $scope.width).toFixed(1));
            if (!isFinite($scope.cppf)) {
                $scope.span_invalid = false;
            } else {
                $scope.span_invalid = true;
            }
            var r;
            $scope.distance = parseFloat($scope.result_aov >= 180 ? ($scope.width / 6.28).toFixed(0) : (e = new Fraction($scope.data.selectedOption),
                r = $scope.width * $scope.focallength * e.denominator / e.numerator,
                r.toFixed(0)));
            if ($scope.ShowDefault3D == true) {
                default_viewer.setHfov($scope.distance);

            } else if ($scope.ShowFloorView == true) {
                viewer.setHfov($scope.distance);
            }
        } else {
            $scope.span_width_invalid = false;
            $scope.width = 0;
        }
        if ($scope.a.length != 0) {
            $scope.updateCameraObject(active_camera_index);
            $scope.updateOnCameraClicked();
        }
    };

    /*LOAD LOCATION*/
    $scope.loadLocation = function() {

        var drawingManager;
        var selectedShape;
        var colors = ['#1E90FF', '#FF1493', '#32CD32', '#FF8C00', '#4B0082'];
        var selectedColor;
        var colorButtons = {};

        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 18,
            minZoom: 10, //15
            center: {
                lat: 40.74963047352599,
                lng: -73.9685235414974
            },
            streetViewControl: !1,
            disableDefaultUI: false,
            mapTypeId: google.maps.MapTypeId.SATELLITE,
            tilt: 0,
            keyboardShortcuts: !1,
            scaleControl: !0,
            fullscreenControl: false
        });

        var maxZoomService = new google.maps.MaxZoomService();
        //$scope.search_location = StorageService.getDatavalue("lastlocation");

        var drp_down_div = document.createElement('div');
        var drp_down = new customDropDown(drp_down_div, map);


        function customDropDown(controlDiv, map) {

            var controlUI = document.createElement('div');
            controlUI.style.backgroundColor = '#FAFAFA';
            controlUI.style.height = '29px';
            controlUI.style.marginTop = '5px';
            controlUI.style.marginLeft = '10px';
            controlUI.style.paddingTop = '1px';
            controlUI.style.fontSize = '16px';
            controlUI.style.cursor = 'pointer';
            controlUI.title = 'Click here to show saved locations';
            controlDiv.appendChild(controlUI);

            // Set CSS for the control interior.
            var controlText = document.createElement('div');
            controlText.style.padding = '6px';
            //controlText.innerHTML = 'Save';
            controlText.style.color = '#000';
            controlUI.style.fontSize = '16px';
            controlText.style.paddingTop = '3px';
            controlText.className += "fa fa-caret-square-o-down";
            controlUI.appendChild(controlText);

            // Setup the click event listeners
            google.maps.event.addDomListener(controlUI, 'click', function() {
                //$scope.activateLocationList();
                $('#list_locations').modal('show');
            });
        }

        function cropSelectedArea(controlDiv, map) {

            // Set CSS for the control border.
            var controlUI = document.createElement('div');
            controlUI.style.backgroundColor = '#fff';
            controlUI.style.border = '2px solid #fff';
            //controlUI.style.borderRadius = '3px';
            controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
            controlUI.style.cursor = 'pointer';
            controlUI.style.marginBottom = '10px';
            //controlUI.style.textAlign = 'center';
            controlUI.title = 'Click to take snapshot of the selected area';
            controlDiv.appendChild(controlUI);

            // Set CSS for the control interior.
            var controlText = document.createElement('div');
            controlText.style.color = 'rgb(25,25,25)';
            controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
            controlText.style.fontSize = '16px';
            controlText.style.paddingLeft = '3px';
            controlText.style.paddingRight = '4px';

            var cropIcon = document.createElement('span');
            cropIcon.setAttribute('class', 'fa fa-crop');
            controlText.appendChild(cropIcon);
            controlUI.appendChild(controlText);

            // Setup the click event listeners: simply set the map to Chicago.
            controlUI.addEventListener('click', function() {

                if( typeof(mapShape) != 'object' || mapShape == null ){
                    toastr.warning(CurrentLanguageData.Selecttheareayouwanttocrop);
                    return;
                }
                
                if (mapShape.type != 'rectangle') {

                    alert( CurrentLanguageData.Youcantcropareaselectedbypolygonorline);
                    return;

                }

                var rectangle = mapShape;
                var zoom = map.zoom;
                var centre = rectangle.getBounds().getCenter(); //rectangle is the shape drawn on the map
                var spherical = google.maps.geometry.spherical;
                bounds = rectangle.getBounds(); //rectangle is the shape drawn on the map
                var cor1 = bounds.getNorthEast();
                var cor2 = bounds.getSouthWest();
                var cor3 = new google.maps.LatLng(cor2.lat(), cor1.lng()); 
                var cor4 = new google.maps.LatLng(cor1.lat(), cor2.lng()); 
                var width = distanceInPx(cor1, cor4);
                var height = distanceInPx(cor1, cor3); 
                function distanceInPx(pos1, pos2) {
                    var p1 = map.getProjection().fromLatLngToPoint(pos1);
                    var p2 = map.getProjection().fromLatLngToPoint(pos2);
            
                    var pixelSize = Math.pow(2, -map.getZoom());
            
                    var d = Math.sqrt((p1.x-p2.x)*(p1.x-p2.x) + (p1.y-p2.y)*(p1.y-p2.y))/pixelSize;
            
                    return Math.round(d);
                }

                var maxZoom;
                maxZoomService.getMaxZoomAtLatLng(map.center, function(response) {

                    if (response.status !== 'OK') {

                        //infoWindow.setContent('Error in MaxZoomService');
                        maxZoom = map.zoom;

                    } else {

                        //maxZoom = response.zoom;
                        maxZoom = map.zoom;

                    }
                    var currentMap = document.getElementById('map');
                    var currentMapheight = currentMap.offsetHeight;
                    var currentMapWidth = currentMap.offsetWidth;
                    var currentMapsize = currentMapWidth + "x" + currentMapheight;
                    var currentMapsize = 1920 + "x" + 1200;
                    var shapeCenter = map.getCenter().lat() + "," + map.getCenter().lng();
                   // var croppedImgUrl = "https://maps.googleapis.com/maps/api/staticmap?center=" + shapeCenter + "&zoom=" + maxZoom + "&size=" + currentMapsize + "&maptype=satellite&key=AIzaSyBHUDKMbiQoVC8DabrXoRkhzP5o6TvqbGo";
                    var croppedImgUrl = "https://maps.googleapis.com/maps/api/staticmap?center=" + centre.lat() + "," + centre.lng() + "&zoom=" + zoom + "&size=" + width + "x" + height+"&maptype=satellite&key=AIzaSyBHUDKMbiQoVC8DabrXoRkhzP5o6TvqbGo"

                   
                    $scope.getlocation(map.getCenter().lat(), map.getCenter().lng()).then(function(nameLocation) {
                        nameLocation = nameLocation.replace(/\s/g, '');
                        nameLocation = nameLocation+Date.now();
                        var userId = localStorage.getItem("U_ID");
                        var fds = new FormData();
                        var data = {};
                        data.userId = userId
                        data.name = nameLocation
                        data.url = croppedImgUrl;
                        var imageName = nameLocation+'.png';
                        var downloadImage = new ApiHandler();
                        downloadImage.prepareRequest({
                            method: 'GET',
                            url: croppedImgUrl,
                            responseType: 'blob',
                            isDownload:true,
                            formDataNeeded: false,
                            formData: ''
                        });
                        downloadImage.onStateChange(function(response) {
                            data = JSON.stringify(data);
                            fds.append('data', data);
                            fds.append('file', response,imageName);
                            //saveAs(response, 'img.png');
                            var sendLocationImage = new ApiHandler();
                            sendLocationImage.prepareRequest({
                                method: 'POST',
                                url: configFactory.strings.api + "location/",
                                responseType: 'json',
                                isDownload: false,
                                formDataNeeded: true,
                                formData: fds
                            });
                            sendLocationImage.onStateChange( function( response ) {
                                
                                toastr.info(CurrentLanguageData.Currentmapviewissuccessfullysaved ); 
                                
                            }, function( error ) {
                                
                                console.log( error );
                                
                            });
                            sendLocationImage.sendRequest();

                        }, function(error) {

                            console.log(error);

                        });
                        downloadImage.sendRequest();

                    });

                });

            });

        }

        var cropBtnWrapper = document.createElement('div');
        cropBtnWrapper.setAttribute('class', 'map-crop-selected-btn');
        var cropBtn = new cropSelectedArea(cropBtnWrapper, map);
        map.controls[google.maps.ControlPosition.RIGHT_CENTER].push(cropBtnWrapper);

        drp_down_div.index = 3;
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(drp_down_div);



        var shapeOptions = {
            strokeWeight: 1,
            strokeOpacity: 1,
            fillOpacity: 0.2,
            editable: true,
            draggable: true,
            clickable: true,
            strokeColor: '#3399FF',
            fillColor: '#3399FF'
        };

        function clearSelection() {
            if (selectedShape) {
                selectedShape.setEditable(false);
                selectedShape = null;
                mapShape =null;
            }
        }

        function setSelection(shape) {
            clearSelection();
            selectedShape = shape;
            mapShape = shape;
            shape.setEditable(true);
            //selectColor(shape.get('fillColor') || shape.get('strokeColor'));
        }

        function deleteSelectedShape() {
            if (selectedShape) {
                selectedShape.setMap(null);
                mapShape = null;
            }
        }

        function selectColor(color) {
            selectedColor = color;
            for (var i = 0; i < colors.length; ++i) {
                var currColor = colors[i];
                colorButtons[currColor].style.border = currColor == color ? '2px solid #789' : '2px solid #fff';
            }
            // Retrieves the current options from the drawing manager and replaces the
            // stroke or fill color as appropriate.
            var polylineOptions = drawingManager.get('polylineOptions');
            polylineOptions.strokeColor = color;
            drawingManager.set('polylineOptions', polylineOptions);
            var rectangleOptions = drawingManager.get('rectangleOptions');
            rectangleOptions.fillColor = color;
            drawingManager.set('rectangleOptions', rectangleOptions);
            var circleOptions = drawingManager.get('circleOptions');
            circleOptions.fillColor = color;
            drawingManager.set('circleOptions', circleOptions);
            var polygonOptions = drawingManager.get('polygonOptions');
            polygonOptions.fillColor = color;
            drawingManager.set('polygonOptions', polygonOptions);
        }

        function setSelectedShapeColor(color) {
            if (selectedShape) {
                if (selectedShape.type == google.maps.drawing.OverlayType.POLYLINE) {
                    selectedShape.set('strokeColor', color);
                } else {
                    selectedShape.set('fillColor', color);
                }
            }
        }

        function makeColorButton(color) {
            var button = document.createElement('span');
            button.className = 'color-button';
            button.style.backgroundColor = color;
            google.maps.event.addDomListener(button, 'click', function() {
                selectColor(color);
                setSelectedShapeColor(color);
            });
            return button;
        }

        function buildColorPalette() {
            var colorPalette = document.getElementById('color-palette');
            for (var i = 0; i < colors.length; ++i) {
                var currColor = colors[i];
                var colorButton = makeColorButton(currColor);
                colorPalette.appendChild(colorButton);
                colorButtons[currColor] = colorButton;
            }
            selectColor(colors[0]);
        }

        drawingManager = new google.maps.drawing.DrawingManager({
            drawingMode: null,
            drawingControlOptions: {
                position: google.maps.ControlPosition.TOP_RIGHT,
                drawingModes: ['circle', 'polygon', 'polyline', 'rectangle']
            },
            rectangleOptions: shapeOptions,
            circleOptions: shapeOptions,
            Options: shapeOptions,
            map: map
        });


        google.maps.event.addListener(drawingManager, 'overlaycomplete', function(e) {
            if (e.type != google.maps.drawing.OverlayType.MARKER) {
                // Switch back to non-drawing mode after drawing a shape.
                drawingManager.setDrawingMode(null);
                // Add an event listener that selects the newly-drawn shape when the user
                // mouses down on it.
                var newShape = e.overlay;
                newShape.type = e.type;
                shapeType = newShape.type;
                if(newShape.type =='polygon' || newShape.type =='polyline' ){
                   
                }
                else{
                    shapeBounds = newShape.getBounds();
                }
                google.maps.event.addListener(newShape, 'click', function() {
                    setSelection(newShape);
                });
                setSelection(newShape);
            }
        });



        drawingManager.setMap(map);

        var customControlDiv = document.createElement('div');
        var customControl = new CustomControl(customControlDiv, map);

        var customResizableDiv = document.createElement('div');
        var customResizable = new CustomResizable(customResizableDiv, map);

        /*Custom button on map for adding point of interest*/
        var save_btn_div = document.createElement('div');
        var save_btn = new customButton(save_btn_div, map);

        //var custom_search_div = document.createElement('div');

        var parent_div = document.getElementById('map-location-search-box');
        var custom_search_div = document.getElementById('location_container');
        if (custom_search_div) {
            custom_search_div.parentNode.removeChild(custom_search_div);
        }

        custom_search_div = document.createElement('div');
        custom_search_div.className += "location-input";
        custom_search_div.setAttribute("id", "location_container");
        parent_div.appendChild(custom_search_div);
        //var custom_search_div = document.getElementById('location_container');

        var custom_search = new customSearch(custom_search_div, map);

        function customSearch(controlDiv, map) {

            var controlText = document.createElement('input');
            controlText.style.color = '#000000';
            controlText.setAttribute("id", "pac-input");
            controlText.setAttribute("placeholder", "Enter a location");
            controlText.className += "select-location";
            controlDiv.appendChild(controlText);

            // Setup the click event listeners
            /*google.maps.event.addDomListener(controlUI, 'click', function () {

            });*/
        }

        function customButton(controlDiv, map) {

            var controlUI = document.createElement('div');
            controlUI.style.backgroundColor = '#FAFAFA';
            controlUI.style.height = '24px';
            controlUI.style.marginTop = '5px';
            controlUI.style.marginLeft = '0px';
            controlUI.style.paddingTop = '1px';
            //controlUI.style.fontSize = '21px';
            controlUI.style.cursor = 'pointer';
            controlUI.title = 'Save this location';
            controlDiv.appendChild(controlUI);

            // Set CSS for the control interior.
            var controlText = document.createElement('div');
            controlText.style.padding = '6px';
            //controlText.innerHTML = 'Save';
            controlText.style.color = '#000';
            controlUI.style.fontSize = '16px';
            controlText.style.paddingTop = '3px';
            controlText.className += "fa fa-save";
            controlUI.appendChild(controlText);

            // Setup the click event listeners
            google.maps.event.addDomListener(controlUI, 'click', function() {
                $scope.show_title_used = false;
                $('#point_of_interest').modal('show');
            });
        }
        /*Custom button on map for adding point of interest END*/

        function CustomControl(controlDiv, map) {

            var controlUI = document.createElement('div');
            controlUI.style.backgroundColor = '#FAFAFA';
            controlUI.style.height = '24px';
            controlUI.style.marginTop = '5px';
            controlUI.style.marginLeft = '0px';
            controlUI.style.paddingTop = '1px';
            //controlUI.style.fontSize = '21px';
            controlUI.style.cursor = 'pointer';
            controlUI.title = 'Delete drawing';
            controlDiv.appendChild(controlUI);

            // Set CSS for the control interior.
            var controlText = document.createElement('div');
            controlText.style.padding = '6px';
            //controlText.innerHTML = 'Save';
            controlText.style.color = '#000';
            controlUI.style.fontSize = '16px';
            controlText.style.paddingTop = '3px';
            controlText.className += "fa fa-trash";
            controlUI.appendChild(controlText);

            // Setup the click event listeners
            google.maps.event.addDomListener(controlUI, 'click', function() {
                deleteSelectedShape();
            });
        }


        /*Custom button on map For Resizeable Map START */

        function CustomResizable(controlDiv, map) {

            var controlUI = document.createElement('div');
            controlUI.style.backgroundColor = '#FAFAFA';
            controlUI.style.height = '24px';
            // controlUI.style.marginTop = '82px';
            // controlUI.style.marginLeft = '0px';
            // controlUI.style.paddingTop = '1px';
            controlUI.style.fontSize = '21px';
            controlUI.style.marginRight = '10px';
            controlUI.style.cursor = 'pointer';
            controlUI.title = 'Maximize Map';
            controlDiv.appendChild(controlUI);

            // Set CSS for the control interior.
            var controlText = document.createElement('div');
            controlText.style.padding = '6px';
            controlText.id = 'map_resize_button';
            //controlText.innerHTML = 'Save';
            controlText.style.color = '#000';
            controlUI.style.fontSize = '16px';
            controlText.style.paddingTop = '3px';
            controlText.className += "fa fa-expand";
            controlUI.appendChild(controlText);

            // Setup the click event listeners
            google.maps.event.addDomListener(controlUI, 'click', function() {
                $scope.onMapResize();
                var resizeBtn = document.getElementById("map_resize_button");
                if (resizeBtn.className == "fa fa-expand") {
                    resizeBtn.className = "fa fa-compress";
                    resizeBtn.title = 'Minimize Map';
                } else {
                    resizeBtn.className = "fa fa-expand";
                    resizeBtn.title = 'Maximize Map';
                }
            });
        }
        /*Custom button on map For Resizeable Map END */


        /*Custom search box on map for adding point of interest*/
        custom_search_div.index = 5;
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(custom_search_div);

        /************* LOCATION SEARCH BOX********************/
        var input = document.getElementById('pac-input');
        var searchBox = new google.maps.places.SearchBox(input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
        // Bias the SearchBox results towards current map's viewport.
        map.addListener('bounds_changed', function() {
            searchBox.setBounds(map.getBounds());
        });

        var markers = [];
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', function() {
            var places = searchBox.getPlaces();

            if (places.length == 0) {
                return;
            }

            // Clear out the old markers.
            markers.forEach(function(marker) {
                marker.setMap(null);
            });
            markers = [];

            // For each place, get the icon, name and location.
            var bounds = new google.maps.LatLngBounds();
            places.forEach(function(place) {
                if (!place.geometry) {
                    console.log("Returned place contains no geometry");
                    return;
                }
                var icon = {
                    url: place.icon,
                    size: new google.maps.Size(71, 71),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(17, 34),
                    scaledSize: new google.maps.Size(25, 25)
                };

                // Create a marker for each place.
                markers.push(new google.maps.Marker({
                    map: map,
                    icon: icon,
                    title: place.name,
                    position: place.geometry.location
                }));

                if (place.geometry.viewport) {
                    // Only geocodes have viewport.
                    bounds.union(place.geometry.viewport);
                } else {
                    bounds.extend(place.geometry.location);
                }
            });
            map.fitBounds(bounds);

            var project_data_loc = {};

            if ($scope.projectName != '') {
                //for storing last location
                $scope.saveLastLocation();
                project_data_loc["last_location"] = $scope.last_location;
                var data_loc = JSON.stringify(project_data_loc);
                ProjectService.saveSelected($scope.uniqueID, data_loc);
            } else {
                //for storing last location
                $scope.saveLastLocation();
            }

        });
        /************* LOCATION SEARCH BOX END ********************/

        google.maps.event.addListener(drawingManager, 'drawingmode_changed', clearSelection);
        google.maps.event.addListener(map, 'click', clearSelection);

        customControlDiv.index = 2;
        map.controls[google.maps.ControlPosition.TOP_RIGHT].push(customControlDiv);

        customResizableDiv.index = 3;
        map.controls[google.maps.ControlPosition.RIGHT_CENTER].push(customResizableDiv);

        /*Custom button on map for adding point of interest*/
        save_btn_div.index = 1;
        map.controls[google.maps.ControlPosition.TOP_RIGHT].push(save_btn_div);

        /*Custom button on map for adding point of interest END*/
        contextMenuOptions.classNames = { menu: 'context_menu', menuSeparator: 'context_menu_separator' };

        //  create an array of ContextMenuItem objects
        //  an 'id' is defined for each of the four directions related items
        var menuItems = [];

        menuItems.push({ className: 'context_menu_item', eventName: 'delete_click', label: 'Delete' }, { className: 'context_menu_item', eventName: 'R_click', label: 'Edit' });
        menuItems.push({});


        contextMenuOptions.menuItems = menuItems;
        contextMenu = new ContextMenu(map, contextMenuOptions);

        floorplan_contextMenuOptions.classNames = { menu: 'context_menu', menuSeparator: 'context_menu_separator' };
        var menuess = [];

        menuess.push({ className: 'context_menu_item', eventName: 'removeplan', label: 'remove' });
        menuess.push({});
        floorplan_contextMenuOptions.menuItems = menuess;
        floorcontextMenu = new ContextMenu(map, floorplan_contextMenuOptions);

        google.maps.event.addListener(contextMenu, 'menu_item_selected', function(latLng, eventName) {

            switch (eventName) {

                case "delete_click":
                    if ($scope.cameramarker != null) {

                        if ($scope.object_index > -1) {
                            $scope.a.splice($scope.object_index, 1);
                            cam_count--;

                            /*MODIFIED TO INCLUDE CAMERA ICON START*/
                            //for labelCount
                            if (cam_count == 0) {
                                labelCount = 0;
                            }
                            /*MODIFIED TO INCLUDE CAMERA ICON END*/

                        }
                        $scope.cameramarker.setMap(null);
                        $scope.subjectMarker.setMap(null);
                        $scope.leftMarker.setMap(null);
                        $scope.rightMarker.setMap(null);
                        $scope.irLine.setMap(null);
                        $scope.angle.setMap(null);
                        $scope.onecam = true;

                    }

                    break;
                case "R_click":
                    $('#rename').modal('show');
                    $scope.renamecam = active_camera.cameramarker.title;
                    break;
            }
        });


        google.maps.event.addListener(floorcontextMenu, 'menu_item_selected', function(latLng, eventName) {

            switch (eventName) {

                case "removeplan":

                    $scope.deletefloorplan();

            }


        });

        var url = configFactory.strings.api + "user/";
        var u_ID = StorageService.getDatavalue("U_ID");
        if(u_ID != null && u_ID != undefined){
            $http.get(url + u_ID).success(function(response, status) {
                if (response != undefined && response[0] != undefined && typeof(response[0].locations) != 'undefined')
                    $scope.locs = response[0].locations;
            })
            .error(function(data) {
                console.log("error!");
            });
        }
        
    };
    /*LOAD LOCATION END*/

    $scope.onMapResize = function() {

        if (countResizable == 0) {
            $('.left_view').hide();
            $("#map-location-search-box").addClass("col-md-9");
            // remove a class
            $("#map-location-search-box").removeClass("col-md-8");
            $(".left_view").removeClass("col-md-2");
            $("#mapview").css({ "width": "100%" });
            $("#mapview").css({ "transition": "background-position 150ms ease-out" });
            $("#mapview").css({ "width": "100%" });
            $("#scenes").css({ "width": "23%" });
            countResizable = 1;
        } else {
            $('.left_view').show();
            $("#map-location-search-box").addClass("col-md-8");
            // remove a class
            $("#map-location-search-box").removeClass("col-md-9");
            $(".left_view").addClass("col-md-2");
            $("#mapview").css({ "width": "78%" });
            $("#scenes").css({ "width": "32%" });
            countResizable = 0;
        }
        google.maps.event.trigger(map, "resize");

    }

    $scope.deletefloorplan = function() {

        $scope.$apply(function() {
            floorPlanOverlay.setMap(null);
            $scope.floorPlan2D = false;
            $scope.Hide2DObjectBtn = false;
            $scope.Hide2DObjectRemoveBtn = true;
            floorplan_save_values = {};
        });

    };
    $scope.camera_name = function() {

        var selectedCamIndex = $scope.a.indexOf(active_camera);
        //var jobValue = document.getElementById('colorPicker_hex-0').value;
        var color_picker_element = document.getElementsByClassName('colorPicker-picker');
        var jobValue = color_picker_element[0].style.backgroundColor;
        $scope.color_rename_camera = jobValue;
        active_camera.cameramarker.title = $scope.renamecam;
        active_camera.title = $scope.renamecam;
        active_camera.angle.setOptions({ strokeWeight: 3, strokeColor: $scope.color_rename_camera, fillColor: $scope.color_rename_camera });
        active_camera.cameramarker.getIcon().strokeColor = $scope.color_rename_camera;
        active_camera.cameramarker.setMap(map);
        active_camera.cameramarker.title = $scope.renamecam;

        /*MODIFIED TO INCLUDE CAMERA ICON START*/
        active_camera.cameramarker.labelStyle.background = jobValue;
        $scope.a[selectedCamIndex].title = $scope.renamecam;
        $scope.a[selectedCamIndex].color = jobValue;
        /*MODIFIED TO INCLUDE CAMERA ICON END*/

        active_camera.title = $scope.renamecam;
        $('#rename').modal('hide');

    };

    $scope.camera_madel3 = function() {
        $scope.subsearch3 = false;
        $scope.full_cam_details3 = true;
    };

    $scope.full_details3 = function() {
        $scope.full_cam_details3 = false;
    };
    $scope.camera_madel = function() {
        $scope.subsearch = false;
        $scope.full_cam_details = true;
    };

    $scope.full_details = function() {
        $scope.full_cam_details = false;
    };
    $scope.count = 0;
    $scope.add_details_table = function() {
        $scope.buttonname = $scope.selected_modal;
        $scope.add_camera = false;
        $scope.add_details_table2();
    };

    $scope.cancelAddCamera = function() {
        $scope.Imager_Size_orginal = "Imager_Size";
        $scope.image_sizer = false;
        $scope.image_sizer_span = true;
    }


    $scope.add_details_table2 = function() {
        $scope.Imager_Size_orginal = "Selected Camera"
        $scope.image_sizer = true;
        $scope.image_sizer_span = false;
        if ($scope.buttonname == "Add Camera") {
            $scope.buttonname = "Add Camera";

        } else {

            $scope.count = $scope.count + 1;
            if ($scope.count > -1) {
                $scope.datas = {
                    selectedresolutions: $scope.selected_resolution
                };
                $scope.result_aov = parseFloat($scope.selected_aov);
                $scope.focallength = parseFloat($scope.selected_focal);
                $scope.buttonname = $scope.selected_modal;
                $scope.datas = {
                    selectedresolutions: $scope.selected_resolution
                };
                $scope.width = parseFloat($scope.result_aov >= 180 ? (6.28 * $scope.distance).toFixed(2) : (Math.tan($scope.result_aov / 2 * Math.PI / 180) * $scope.distance * 2).toFixed(2));
                $scope.cppf = parseFloat(($scope.datas.selectedresolutions / $scope.width).toFixed(1));
                $scope.distance = parseFloat($scope.result_aov >= 180 ? ($scope.width / 6.28).toFixed(0) : (e = new Fraction($scope.data.selectedOption),
                    r = $scope.width * $scope.focallength * e.denominator / e.numerator,
                    r.toFixed(0)));
            }
            $scope.boolSelectCamera = true;
            $scope.is_special_camera = true;
            $scope.initcamera();

        }
    };

    $scope.convert = function(what, from) {
        if ($.inArray(from, $scope.conversion)) {
            return parseFloat($scope.conversion[from] * what).toFixed(2);
        }
        return 0;
    };

    $scope.updateAovValue = function(aov) {
        $scope.$apply(function() {
            // alert("uppdate aov");
            $scope.result_aov = parseFloat(aov);
            $scope.focal_length();
        });
        /* to update a[]*/
        $scope.updateCameraObject(active_camera_index);
        /* to update a[]*/
    };

    $scope.plus_distance = function() {
        $scope.distance = parseFloat(($scope.distance + 10).toFixed(2));
        $scope.distances();
    };

    $scope.minus_distance = function() {
        $scope.distance = parseFloat(($scope.distance - 10).toFixed(2));
        $scope.distances();
    };
    $scope.unitConvert = function() {
        StorageService.putDatavalue("unit", $scope.unit);
        $scope.ppf = ($scope.unit == "m") ? "PPM" : "PPF";
        $scope.width = parseFloat($scope.convert($scope.width, $scope.unit));
        $scope.widths();
        $scope.cameraheight = parseFloat($scope.convert($scope.cameraheight, $scope.unit));
        $scope.cTilt();
        $scope.sceneheight = parseFloat($scope.convert($scope.sceneheight, $scope.unit));
        $scope.sTilt();
    };


    if (typeof(Storage) !== "undefined") {
        var unit = StorageService.getDatavalue("unit");
        unit = (unit == null) ? "ft" : unit;
        $scope.unit = unit;
        $scope.ppf = (unit == "m") ? "PPM" : "PPF";
        if (unit == "m") {
            $scope.width = parseFloat($scope.convert($scope.width, unit));
            $scope.widths();
            $scope.cameraheight = parseFloat($scope.convert($scope.cameraheight, $scope.unit));
            $scope.cTilt();
            $scope.sceneheight = parseFloat($scope.convert($scope.sceneheight, $scope.unit));
            $scope.sTilt();
        }
    }

    if(!chnagesfiles){
    var getcameraSpeclist = new ApiHandler();
        getcameraSpeclist.prepareRequest({
        method: 'GET',
        url:configFactory.strings.api+ 'cameraSpec/users/' + localStorage.getItem('U_ID'),
        responseType: 'json',
        isDownload: false,
        formDataNeeded: false,
        formData: ''
    });
    getcameraSpeclist.onStateChange(function(data) {
        var subcameras = [];
        $("#tp").on("click", 'li', function() {
            $("#tps").empty();
            var names = [];
            var ids = [];
            var k = 0;
            var d = 0;
            var modelname = $(this).text();
            $("#tp>li.selected").removeClass("selected").css("background-color", "#ffffff");
            $(this).addClass("selected").css("background-color", "#b7c9d2");
            var nameid = this.id;
            var detailsGetCameraBrand =[];
            var number = document.getElementById(nameid).value;
            $.each(data, function(i, f) {
                if (f.manufacturer == modelname) {

                    if(!detailsGetCameraBrand.includes( f.model )){
                        detailsGetCameraBrand.push(f.model);
                        var tblRows = "<li class='list-group-item' id='" + f.id + "'>" + f.model + "</li>"
                        $(tblRows).appendTo("#tps");

                    }

            }
        });

        });
        $("#tp3").on("click", 'li', function() {
            $("#tps3").empty();
            var names = [];
            var ids = [];
            var k = 0;
            var d = 0;
            var modelname = $(this).text();
            $("#tp3>li.selected").removeClass("selected").css("background-color", "#ffffff");
            $(this).addClass("selected").css("background-color", "#b7c9d2");
            var nameid = this.id;
            var number = document.getElementById(nameid).value;
            $.each(data, function(i, f) {
               // alert('vannu');
                if (f.manufacturer == modelname) {
                   
                         detailsGetCameraBrand.push(f.model);  
                         var tblRows = "<li class='list-group-item' id='" + f.id + "'>" + f.model + "</li>"
                         $(tblRows).appendTo("#tps3"); 

                }
            });

        });
        ///// submenu click//////
        $("#tps").on("click", 'li', function() {
            $("#image_modal").empty();
            $("#Model_Name").empty();
            $("#red").empty();
            $("#irss").empty();
            $("#image_size").empty();
            $("#aov").empty();
            $("#focal_length").empty();
            var names = [];
            var ids = [];
            var k = 0;
            var d = 0;
            var detailsGetCamera = [];
            var modelname = $(this).text();
            $("#tps>li.selected").removeClass("selected").css("background-color", "#ffffff");
            $(this).addClass("selected").css("background-color", "#b7c9d2");
            var modelname = $(this).text();
            $.each(data, function(i, f) {
                if (f.model == modelname) {

                    if(!detailsGetCamera.includes(f.model)){
                         detailsGetCamera.push(f.model); 
                        /*MODIFIED TO INCLUDE CAMERA ICON START*/
                        $scope.imageUrl = f.image_url;
                        /*MODIFIED TO INCLUDE CAMERA ICON END*/

                        var imgs = "<img src=" + f.image_url + " id='prem'width='100' height='130'style=' object-fit: contain; width: 150px;height: 100px;' >";
                        var tblRows = "<span ng-model='f_model'>" + f.model + "</span>";
                        var maxres = "<span ng-model='f.resolution'>" + f.resolutions[0].value + "</span>";
                        var irs = "<span ng-model='f_ir'>" + f.ir + "</span>";
                        var image_size = "<span ng-model='f_imager_size'>" + f.imager_size + "</span>";
                        var aov = "<span ng-model='f_min_aov'>" + f.children[0].min_aov + "</span>";
                        $scope.f_min_aov = f.children[0].min_aov;
                        var focal_length = "<span ng-model='f_min_focal'>" + f.children[0].min_focal + "</span>";
                        $scope.f_min_focal=f.children[0].min_focal;
                        $(imgs).appendTo("#image_modal");
                        $(tblRows).appendTo("#Model_Name");
                        $(maxres).appendTo("#red");
                        $(irs).appendTo("#irss");
                        $(image_size).appendTo("#image_size")
                        $(aov).appendTo("#aov");
                        $(focal_length).appendTo("#focal_length");
                        $scope.selected_ir = f.ir;
                        $scope.selected_focal = f.children[0].min_focal;
                        $scope.selected_aov = f.children[0].min_aov;
                        $scope.selected_modal = f.model;
                        $scope.selected_resolution = f.resolutions[0].value;

                     }

                     // alert("prem");

                }
            });
        });

        $("#tps3").on("click", 'li', function() {
            $("#image_modal3").empty();
            $("#Model_Name3").empty();
            $("#red3").empty();
            $("#irss3").empty();
            $("#image_size3").empty();
            $("#aov3").empty();
            $("#focal_length3").empty();
            var names = [];
            var ids = [];
            var k = 0;
            var d = 0;
             alert("prem");
            var modelname = $(this).text();
            $("#tps3>li.selected").removeClass("selected").css("background-color", "#ffffff");
            $(this).addClass("selected").css("background-color", "#b7c9d2");
            var modelname = $(this).text();
           // var detailsGetCamera = [];
            $.each(data, function(i, f) {
                if (f.model == modelname) {
                    if(!detailsGetCamera.includes(f.model)){

                        detailsGetCamera.push(f.model); 
                        var imgs = "<img src=" + f.image_url + " id='prem'width='100' height='130'style=' object-fit: contain; width: 150px;height: 100px;' >";
                        var tblRows = "<span ng-model='f_model'>" + f.model + "</span>";
                        var maxres = "<span ng-model='f.resolution'>" + f.resolutions[0].value + "</span>";
                        var irs = "<span ng-model='f_ir'>" + f.ir + "</span>";
                        var image_size = "<span ng-model='f_imager_size'>" + f.imager_size + "</span>";
                        var aov = "<span ng-model='f_min_aov'>" + f.children[0].min_aov + "</span>";
                        $scope.f_min_aov = f.children[0].min_aov;
                        var focal_length = "<span ng-model='f_min_focal'>" + f.children[0].min_focal + "</span>";
                        $scope.f_min_focal=f.children[0].min_focal;
                        $(imgs).appendTo("#image_modal3");
                        $(tblRows).appendTo("#Model_Name3");
                        $(maxres).appendTo("#red3");
                        $(irs).appendTo("#irss3");
                        $(image_size).appendTo("#image_size3")
                        $(aov).appendTo("#aov3");
                        $(focal_length).appendTo("#focal_length3");
                        $scope.selected_ir = f.ir;
                        $scope.selected_focal = f.children[0].min_focal;
                        $scope.selected_aov = f.children[0].min_aov;
                        $scope.selected_modal = f.model;
                        $scope.selected_resolution = f.resolutions[0].value;   

                    }

                }
            });
        });


        $(function() {
            var i = 0;
            var j = 0;
            var p = 0;
            var cameras = [];
            var name = [];
            var newname = [];
            var idname = [];
            $.each(data, function(i, f) {
                name[i++] = f.manufacturer;
                idname[j++] = f.id;
            });
            for (i = 0; i < name.length; i++) {
                var comp = name[i];
                if (newname.length == 0) {
                    newname[0] = comp;
                    var tblRow = "<li class='list-group-item' id='" + idname[i] + "' value='" + comp + "'>" + comp + "</li>"
                    $(tblRow).appendTo("#tp");
                     $(tblRow).appendTo("#tp3");
                } else {
                    for (j = 0; j <= newname.length; j++) {
                        if (comp == newname[j]) {
                            break;
                        }
                        if (j == newname.length) {
                            newname[newname.length++] = comp;
                            var tblRow = "<li class='list-group-item' id='" + idname[i] + "' value='" + comp + "'>" + comp + "</li>";
                            $(tblRow).appendTo("#tp");
                             $(tblRow).appendTo("#tp3");
                            break;
                        }
                    }
                }
            }
        }); 
    }, function(response) {
				
			//request failed
			console.log(response);
			   
	});
    getcameraSpeclist.sendRequest();


    }
    $scope.updateOnCameraClicked = function(){
        
        $scope.Tilt = $scope.a[active_camera_index].tilt;
        $scope.sceneheight = $scope.a[active_camera_index].scene_height;
        $scope.cameraheight = $scope.a[active_camera_index].camera_height;
        $scope.cppf = $scope.a[active_camera_index].ppf;
        $scope.width = $scope.a[active_camera_index].width;
        $scope.distance = parseFloat($scope.a[active_camera_index].currentDistance.toFixed(2));
        $scope.result_aov = $scope.a[active_camera_index].aov;
        $scope.focallength = $scope.a[active_camera_index].focal_length;
        $scope.data = $scope.a[active_camera_index].data;
        $scope.datas = $scope.a[active_camera_index].datas;
        $scope.unit = $scope.a[active_camera_index].unit;
        /*Save With Select Camera*/
        $scope.Imager_Size_orginal = $scope.a[active_camera_index].Imager_Size_orginal;
        $scope.image_sizer = $scope.a[active_camera_index].image_sizer;
        $scope.image_sizer_span = $scope.a[active_camera_index].image_sizer_span;
        $scope.buttonname = $scope.a[active_camera_index].buttonname;
        $scope.a[active_camera_index].processStreetView($scope.a[active_camera_index].cameramarker.getPosition());
        /*Save With Select Camera*/
    }

    $scope.updateCameraObject = function(active_camera_obj) {
        if ($scope.a != '') {
            $scope.a[active_camera_obj].tilt = $scope.Tilt;
            $scope.a[active_camera_obj].scene_height = $scope.sceneheight;
            $scope.a[active_camera_obj].camera_height = $scope.cameraheight;
            $scope.a[active_camera_obj].ppf = $scope.cppf;
            $scope.a[active_camera_obj].width = $scope.width;
            $scope.a[active_camera_obj].currentDistance = $scope.distance;
            $scope.a[active_camera_obj].distance = $scope.a[active_camera_obj].currentDistance;
            $scope.a[active_camera_obj].horizontalaov = $scope.result_aov;
            $scope.a[active_camera_obj].aov = $scope.result_aov;
            $scope.a[active_camera_obj].focal_length = $scope.focallength;
            $scope.a[active_camera_obj].data = $scope.data;
            $scope.a[active_camera_obj].unit = $scope.unit;
        }
    }

    /*change data.json */
        $scope.checkFileChanged = function() {
        if(chnagesfiles){

      
            $("#tp").empty();
            $("#tps").empty();
            var getcameraSpeclist = new ApiHandler();
                getcameraSpeclist.prepareRequest({
                method: 'GET',
                url:configFactory.strings.api+ 'cameraSpec/users/' + localStorage.getItem('U_ID'),
                responseType: 'json',
                isDownload: false,
                formDataNeeded: false,
                formData: ''
		    });
		    getcameraSpeclist.onStateChange(function(data) {
                
                var subcameras = [];
                $("#tp").on("click", 'li', function() {
                    $("#tps").empty();
                    var names = [];
                    var ids = [];
                    var k = 0;
                    var d = 0;
                    var modelname = $(this).text();
                    $("#tp>li.selected").removeClass("selected").css("background-color", "#ffffff");
                    $(this).addClass("selected").css("background-color", "#b7c9d2");
                    var nameid = this.id;
                    var detailsGetCameraBrand =[];
                    var number = document.getElementById(nameid).value;
                    $.each(data, function(i, f) {
                        if (f.manufacturer == modelname) {
    
                            if(!detailsGetCameraBrand.includes( f.model )){
                                detailsGetCameraBrand.push(f.model);
                                var tblRows = "<li class='list-group-item' id='" + f.id + "'>" + f.model + "</li>"
                                $(tblRows).appendTo("#tps");
      
                            }
    
                    }
                });
    
                });
                $("#tp3").on("click", 'li', function() {
                    $("#tps3").empty();
                    var names = [];
                    var ids = [];
                    var k = 0;
                    var d = 0;
                    var modelname = $(this).text();
                    $("#tp3>li.selected").removeClass("selected").css("background-color", "#ffffff");
                    $(this).addClass("selected").css("background-color", "#b7c9d2");
                    var nameid = this.id;
                    var number = document.getElementById(nameid).value;
                    $.each(data, function(i, f) {
                    
                        if (f.manufacturer == modelname) {
                           
                                 detailsGetCameraBrand.push(f.model);  
                                 var tblRows = "<li class='list-group-item' id='" + f.id + "'>" + f.model + "</li>"
                                 $(tblRows).appendTo("#tps3"); 
    
                        }
                    });
    
                });
                ///// submenu click//////
                $("#tps").on("click", 'li', function() {
                    $("#image_modal").empty();
                    $("#Model_Name").empty();
                    $("#red").empty();
                    $("#irss").empty();
                    $("#image_size").empty();
                    $("#aov").empty();
                    $("#focal_length").empty();
                    var names = [];
                    var ids = [];
                    var k = 0;
                    var d = 0;
                    var detailsGetCamera = [];
                    var modelname = $(this).text();
                    $("#tps>li.selected").removeClass("selected").css("background-color", "#ffffff");
                    $(this).addClass("selected").css("background-color", "#b7c9d2");
                    var modelname = $(this).text();
                    $.each(data, function(i, f) {
                        if (f.model == modelname) {
    
                            if(!detailsGetCamera.includes(f.model)){
                                 detailsGetCamera.push(f.model); 
                                /*MODIFIED TO INCLUDE CAMERA ICON START*/
                                $scope.imageUrl = f.image_url;
                                /*MODIFIED TO INCLUDE CAMERA ICON END*/
    
                                var imgs = "<img src=" + f.image_url + " id='prem'width='100' height='130'style=' object-fit: contain; width: 150px;height: 100px;' >";
                                var tblRows = "<span ng-model='f_model'>" + f.model + "</span>";
                                var maxres = "<span ng-model='f.resolution'>" + f.resolutions[0].value + "</span>";
                                var irs = "<span ng-model='f_ir'>" + f.ir + "</span>";
                                var image_size = "<span ng-model='f_imager_size'>" + f.imager_size + "</span>";
                                var aov = "<span ng-model='f_min_aov'>" + f.children[0].min_aov + "</span>";
                                $scope.f_min_aov = f.children[0].min_aov;
                                var focal_length = "<span ng-model='f_min_focal'>" + f.children[0].min_focal + "</span>";
                                $scope.f_min_focal=f.children[0].min_focal;
                                $(imgs).appendTo("#image_modal");
                                $(tblRows).appendTo("#Model_Name");
                                $(maxres).appendTo("#red");
                                $(irs).appendTo("#irss");
                                $(image_size).appendTo("#image_size")
                                $(aov).appendTo("#aov");
                                $(focal_length).appendTo("#focal_length");
                                $scope.selected_ir = f.ir;
                                $scope.selected_focal = f.children[0].min_focal;
                                $scope.selected_aov = f.children[0].min_aov;
                                $scope.selected_modal = f.model;
                                $scope.selected_resolution = f.resolutions[0].value;
    
                             }
    
                             // alert("prem");
    
                        }
                    });
                });
    
                $("#tps3").on("click", 'li', function() {
                    $("#image_modal3").empty();
                    $("#Model_Name3").empty();
                    $("#red3").empty();
                    $("#irss3").empty();
                    $("#image_size3").empty();
                    $("#aov3").empty();
                    $("#focal_length3").empty();
                    var names = [];
                    var ids = [];
                    var k = 0;
                    var d = 0;
                     //alert("prem");
                    var modelname = $(this).text();
                    $("#tps3>li.selected").removeClass("selected").css("background-color", "#ffffff");
                    $(this).addClass("selected").css("background-color", "#b7c9d2");
                    var modelname = $(this).text();
                   // var detailsGetCamera = [];
                    $.each(data, function(i, f) {
                        if (f.model == modelname) {
                            if(!detailsGetCamera.includes(f.model)){
    
                                detailsGetCamera.push(f.model);
                                var imgs = "<img src=" + f.image_url + " id='prem'width='100' height='130'style=' object-fit: contain; width: 150px;height: 100px;' >";
                                var tblRows = "<span ng-model='f_model'>" + f.model + "</span>";
                                var maxres = "<span ng-model='f.resolution'>" + f.resolutions[0].value + "</span>";
                                var irs = "<span ng-model='f_ir'>" + f.ir + "</span>";
                                var image_size = "<span ng-model='f_imager_size'>" + f.imager_size + "</span>";
                                var aov = "<span ng-model='f_min_aov'>" + f.children[0].min_aov + "</span>";
                                $scope.f_min_aov = f.children[0].min_aov;
                                var focal_length = "<span ng-model='f_min_focal'>" + f.children[0].min_focal + "</span>";
                                $scope.f_min_focal=f.children[0].min_focal;
                                $(imgs).appendTo("#image_modal3");
                                $(tblRows).appendTo("#Model_Name3");
                                $(maxres).appendTo("#red3");
                                $(irs).appendTo("#irss3");
                                $(image_size).appendTo("#image_size3")
                                $(aov).appendTo("#aov3");
                                $(focal_length).appendTo("#focal_length3");
                                $scope.selected_ir = f.ir;
                                $scope.selected_focal = f.children[0].min_focal;
                                $scope.selected_aov = f.children[0].min_aov;
                                $scope.selected_modal = f.model;
                                $scope.selected_resolution = f.resolutions[0].value;   
    
                            }
    
                        }
                    });
                });
    
    
                $(function() {
                    var i = 0;
                    var j = 0;
                    var p = 0;
                    var cameras = [];
                    var name = [];
                    var newname = [];
                    var idname = [];
                    $.each(data, function(i, f) {
                        name[i++] = f.manufacturer;
                        idname[j++] = f.id;
                    });
                    for (i = 0; i < name.length; i++) {
                        var comp = name[i];
                        if (newname.length == 0) {
                            newname[0] = comp;
                            var tblRow = "<li class='list-group-item' id='" + idname[i] + "' value='" + comp + "'>" + comp + "</li>"
                            $(tblRow).appendTo("#tp");
                             $(tblRow).appendTo("#tp3");
                        } else {
                            for (j = 0; j <= newname.length; j++) {
                                if (comp == newname[j]) {
                                    break;
                                }
                                if (j == newname.length) {
                                    newname[newname.length++] = comp;
                                    var tblRow = "<li class='list-group-item' id='" + idname[i] + "' value='" + comp + "'>" + comp + "</li>";
                                    $(tblRow).appendTo("#tp");
                                     $(tblRow).appendTo("#tp3");
                                    break;
                                }
                            }
                        }
                    }
                }); 
		    }, function(response) {
					
				//request failed
				console.log(response);
				   
            });
            
		    getcameraSpeclist.sendRequest();

        } 

    }
    /*change data.json */

    /*Create Camera for Open*/
    var camera = function(camId, camMarkerPos, subjectMarkerPos, hAov, color, title, labelUrl, camBadgeText) {

            this.data = {};
            this.datas = {};

            this.tilt = '';
            this.color = color;
            this.title = title;
            this.scene_height = '';
            this.camera_height = '';
            this.ppf = '';
            this.width = '';
            this.distance = '';
            this.aov = '';
            this.focal_length = '';
            this.unit = '';
            this.Imager_Size_orginal = '';
            this.image_sizer = '';
            this.image_sizer_span = '';
            this.buttonname = '';
            this.cameraId = camId;
            this.horizontalaov = (hAov == null) ? 79.22 : hAov;

            /*MODIFIED TO INCLUDE CAMERA ICONS AND BADGE NUMBER START*/
            this.imageCam = labelUrl;
            this.camBadgeText = camBadgeText;

            if (labelUrl == '' || labelUrl == undefined) {
                //this.imageCam = configFactory.strings.webroot + "assets/img/Cam_DICB.png";
                this.imageCam = "assets/img/Cam_DICB.png";
            } else {
                this.imageCam = labelUrl;
            }

            var iconCam = {

                url: this.imageCam, // url to the image.
                scaledSize: new google.maps.Size(40, 40), // scaled size
                origin: new google.maps.Point(0, 0), // origin
                anchor: new google.maps.Point(38, 20), // anchor
                //labelOrigin: new google.maps.Point(80,-23)

            };

            this.cameramarker = new MarkerWithLabel({

                position: (camMarkerPos == null) ? map.getCenter() : camMarkerPos,
                icon: iconCam,
                raiseOnDrag: !1,
                labelContent: camBadgeText,
                labelVisible: true,
                labelAnchor: new google.maps.Point(10, 30),
                labelClass: "camera-label",
                labelStyle: {
                    opacity: 1.0,
                    background: color
                },
                map: map,
                title: this.title,
                draggable: true

            });
            /*MODIFIED TO INCLUDE CAMERA ICONS AND BADGE NUMBER END*/

            /*this.cameramarker = new google.maps.Marker( {
                position: ( camMarkerPos == null )? map.getCenter():camMarkerPos,
                icon: {
                    path: "M-168.3,110.4c-1,0-1.3,0.7-0.9,1.5l1.4,2.4c0.5,0.8,1.7,1.5,2.6,1.5h2.1c1,0,2.1-0.7,2.6-1.5l1.4-2.4 c0.5-0.8,0.1-1.5-0.9-1.5L-168.3,110.4L-168.3,110.4z M-169.2,133.4c0,1,0.8,1.7,1.7,1.7h6.8c1,0,1.7-0.8,1.7-1.7V119 c0-1-0.8-1.7-1.7-1.7h-6.8c-1,0-1.7,0.8-1.7,1.7V133.4L-169.2,133.4z",
                    scale: 1.3,
                    strokeWeight: 2.6,
                    strokeColor: this.color,
                    rotation: 90,
                    anchor: new google.maps.Point(-164, 109)
                },
                raiseOnDrag: !1,
                labelContent: 'camera',
                labelVisible: !1,
                labelAnchor: new google.maps.Point(-10, 0),
                labelClass: "camera-label",
                labelStyle: {
                    opacity: .75
                },  
                map: map,
                title: this.title,
                draggable: !0
            } );*/

            this.subjectMarkerCoordinates = google.maps.geometry.spherical.computeOffset(this.cameramarker.getPosition(), 50, 90);
            this.subjectMarker = new google.maps.Marker({
                position: new google.maps.LatLng((subjectMarkerPos == null) ? this.subjectMarkerCoordinates.lat() : subjectMarkerPos.lat, (subjectMarkerPos == null) ? this.subjectMarkerCoordinates.lng() : subjectMarkerPos.lng),
                icon: "https://maps.google.com/mapfiles/ms/micons/man.png",
                map: map,
                zIndex: 102,
                draggable: !0
            });
            var i = google.maps.geometry.spherical.computeHeading(this.cameramarker.getPosition(), this.subjectMarker.getPosition());
            var t = this.cameramarker.get("icon");
            t.rotation = i;
            this.currentDistance = google.maps.geometry.spherical.computeDistanceBetween(this.cameramarker.getPosition(), this.subjectMarker.getPosition());
            this.currentHeading = google.maps.geometry.spherical.computeHeading(this.cameramarker.getPosition(), this.subjectMarker.getPosition());
            this.irLine = new google.maps.Polyline({
                map: map,
                path: this.pathForIrLine(),
                strokeColor: this.color,
                strokeOpacity: 1,
                strokeWeight: 3,
                zIndex: 103,
                visible: false
            });
            var i = this.calculateVertex(this.horizontalaov, this.distanceToSubjectMarker());
            this.leftMarker = new google.maps.Marker({
                position: i[1],
                anchor: google.maps.Point(-164, 109),
                icon: {
                    url: "https://maps.google.com/mapfiles/kml/pal4/icon57.png",
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(15, 15),
                    scaledSize: new google.maps.Size(30, 30)
                },
                map: map,
                zIndex: 102,
                draggable: !0
            });
            this.rightMarker = new google.maps.Marker({
                position: i[2],
                icon: {
                    url: "https://maps.google.com/mapfiles/kml/pal4/icon57.png",
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(15, 15),
                    scaledSize: new google.maps.Size(30, 30)
                },
                map: map,
                zIndex: 102,
                draggable: !0
            });
            this.angle = new google.maps.Polygon({
                path: i,
                strokeColor: this.color,
                strokeOpacity: .8,
                strokeWeight: 3,
                fillColor: this.color,
                fillOpacity: .35,
                zIndex: 103,
                map: map
            });



            google.maps.event.addListener(this.cameramarker, "position_changed", this.move.bind(this));
            google.maps.event.addListener(this.subjectMarker, "position_changed", this.update.bind(this));
            google.maps.event.addDomListener(this.leftMarker, "drag", function(e) {
                /* Active camera IDENTIFY*/
                active_camera = $scope.a[$scope.a.indexOf(this)];
                active_camera_index = $scope.a.indexOf(this);
                /* Active camera IDENTIFY*/
                var n, o;
                return o = this.findClosestPoint.call(this, e.latLng, "left"), this.leftMarker.setPosition(o), n = this.calculateAov.call(this, o, this.cameramarker.getPosition(), this.subjectMarker.getPosition()), i = this.calculateVertex.call(this, n, this.distanceToSubjectMarker()), this.rightMarker.setPosition(i[2]), this.angle.setPath(i, n), this.processStreetView.call(this, e)
            }.bind(this));

            google.maps.event.addListener(this.cameramarker, "mouseup", function(e) {
                var t;
                /* Active camera IDENTIFY*/
                cameralat = e.latLng.lat();
                cameralng = e.latLng.lng();
                this.processStreetView.call(this, e);
            }.bind(this));

            google.maps.event.addListener(this.subjectMarker, "mouseup", function(e) {
                var t;
                this.processStreetView.call(this, e);
            }.bind(this));

            google.maps.event.addDomListener(this.cameramarker, "rightclick", function(e) {
                var that = this;
                $scope.$apply(function() {
                    $scope.object_index = $scope.a.indexOf(that);
                    $scope.cameramarker = that.cameramarker;
                    $scope.subjectMarker = that.subjectMarker;
                    $scope.leftMarker = that.leftMarker;
                    $scope.rightMarker = that.rightMarker;
                    $scope.irLine = that.irLine;
                    $scope.angle = that.angle;
                    active_camera = $scope.a[$scope.object_index];
                    active_camera_index = $scope.object_index;
                });
                contextMenu.show(e.latLng);
            }.bind(this));

            google.maps.event.addDomListener(this.cameramarker, "click", function(e) {

                var chumma;
                /* Active camera IDENTIFY*/

                active_camera = $scope.a[$scope.a.indexOf(this)];
                active_camera_index = $scope.a.indexOf(this);
                var color = $scope.a[active_camera_index].color;
                $scope.updateOnCameraClicked();
                this.move();
                this.currentDistance = google.maps.geometry.spherical.computeDistanceBetween(this.cameramarker.getPosition(), this.subjectMarker.getPosition());
                $scope.updateDistances(this.currentDistance);
                $scope.updateAovValue(this.horizontalaov);
                var chumma = active_camera;


            }.bind(this));

            google.maps.event.addListener(this.cameramarker, "mouseover", function(e) { $scope.updateOnCameraClicked() }.bind(this));


            google.maps.event.addDomListener(this.subjectMarker, "click", function(e) {
                /* Active camera IDENTIFY*/
                active_camera = $scope.a[$scope.a.indexOf(this)];
                active_camera_index = $scope.a.indexOf(this);
                $scope.updateOnCameraClicked();
                /* Active camera IDENTIFY*/
                this.currentDistance = google.maps.geometry.spherical.computeDistanceBetween(this.cameramarker.getPosition(), this.subjectMarker.getPosition());
                $scope.updateDistances(this.currentDistance);
                $scope.updateAovValue(this.horizontalaov);

            }.bind(this));

            google.maps.event.addDomListener(this.angle, "click", function(e) {
                /* Active camera IDENTIFY*/
                var chumma, cummacolor;
                active_camera = $scope.a[$scope.a.indexOf(this)];
                active_camera_index = $scope.a.indexOf(this);
                $scope.updateOnCameraClicked();
                /* Active camera IDENTIFY*/
                this.currentDistance = google.maps.geometry.spherical.computeDistanceBetween(this.cameramarker.getPosition(), this.subjectMarker.getPosition());
                $scope.updateDistances(this.currentDistance);
                $scope.updateAovValue(this.horizontalaov);


            }.bind(this));

            google.maps.event.addDomListener(this.leftMarker, "click", function(e) {

                /* Active camera IDENTIFY*/
                active_camera = $scope.a[$scope.a.indexOf(this)];
                active_camera_index = $scope.a.indexOf(this);
                $scope.updateOnCameraClicked();
                /* Active camera IDENTIFY*/
                this.currentDistance = google.maps.geometry.spherical.computeDistanceBetween(this.cameramarker.getPosition(), this.subjectMarker.getPosition());
                $scope.updateDistances(this.currentDistance);
                $scope.updateAovValue(this.horizontalaov);

            }.bind(this));

            google.maps.event.addDomListener(this.rightMarker, "click", function(e) {

                /* Active camera IDENTIFY*/
                active_camera = $scope.a[$scope.a.indexOf(this)];
                active_camera_index = $scope.a.indexOf(this);
                $scope.updateOnCameraClicked();
                /* Active camera IDENTIFY*/
                this.currentDistance = google.maps.geometry.spherical.computeDistanceBetween(this.cameramarker.getPosition(), this.subjectMarker.getPosition());
                $scope.updateDistances(this.currentDistance);
                $scope.updateAovValue(this.horizontalaov);

            }.bind(this));

            google.maps.event.addDomListener(this.subjectMarker, "dragend", function(e) {

                //alert("draged");
                /* Active camera IDENTIFY*/
                active_camera = $scope.a[$scope.a.indexOf(this)];
                active_camera_index = $scope.a.indexOf(this);
                $scope.updateOnCameraClicked();
                /* Active camera IDENTIFY*/
                this.currentDistance = google.maps.geometry.spherical.computeDistanceBetween(this.cameramarker.getPosition(), this.subjectMarker.getPosition());
                $scope.updateDistances(this.currentDistance);
                // $scope.updateCameraObject(active_camera_index);

            }.bind(this));

            google.maps.event.addDomListener(this.leftMarker, "dragend", function(e) {
                /* Active camera IDENTIFY*/
                active_camera = $scope.a[$scope.a.indexOf(this)];
                active_camera_index = $scope.a.indexOf(this);
                $scope.updateOnCameraClicked();
                /* Active camera IDENTIFY*/
                var n, i;

                return i = this.findClosestPoint.call(this, e.latLng, "left"), n = this.calculateAov(i, this.cameramarker.getPosition(), this.subjectMarker.getPosition()), this.horizontalaov = n.toFixed(2), this.updateAoV.call(this), this.processStreetView.call(this, e)
            }.bind(this));

            google.maps.event.addDomListener(this.rightMarker, "drag", function(e) {
                /* Active camera IDENTIFY*/
                active_camera = $scope.a[$scope.a.indexOf(this)];
                active_camera_index = $scope.a.indexOf(this);
                //$scope.updateOnCameraClicked();
                /* Active camera IDENTIFY*/
                var n, o;
                return o = this.findClosestPoint.call(this, e.latLng, "right"), this.rightMarker.setPosition(o), n = this.calculateAov.call(this, this.subjectMarker.getPosition(), this.cameramarker.getPosition(), o), i = this.calculateVertex.call(this, n, this.distanceToSubjectMarker()), this.leftMarker.setPosition(i[1]), this.angle.setPath(i, n)
            }.bind(this));

            google.maps.event.addDomListener(this.rightMarker, "dragend", function(e) {
                /* Active camera IDENTIFY*/
                active_camera = $scope.a[$scope.a.indexOf(this)];
                active_camera_index = $scope.a.indexOf(this);
                $scope.updateOnCameraClicked();
                /* Active camera IDENTIFY*/
                var n, i;
                return i = this.findClosestPoint.call(this, e.latLng, "right"), n = this.calculateAov(this.subjectMarker.getPosition(), this.cameramarker.getPosition(), i), this.horizontalaov = n.toFixed(2), this.updateAoV.call(this)
            }.bind(this));



        }
        /*Create Camera for Open*/

    function createPolygonFromBounds(latLngBounds) {
        var paths = new google.maps.MVCArray();
        var path = new google.maps.MVCArray();
        var ne = bounds.getNorthEast();
        var sw = bounds.getSouthWest();
        path.push(ne);
        path.push(new google.maps.LatLng(sw.lat(), ne.lng()));
        path.push(sw);
        path.push(new google.maps.LatLng(ne.lat(), sw.lng()));
        paths.push(path);
        return paths;
    }

    camera.prototype.distanceToSubjectMarker = function() {
        return google.maps.geometry.spherical.computeDistanceBetween(this.cameramarker.getPosition(), this.subjectMarker.getPosition());
    }

    camera.prototype.calculateVertex = function(e, t) {

        var n, i, o;
        n = google.maps.geometry.spherical.computeHeading(this.subjectMarker.getPosition(), this.cameramarker.getPosition());
        n = 360 * (n - -180) / 360;
        i = google.maps.geometry.spherical.computeOffset(this.cameramarker.getPosition(), t / Math.cos(Math.PI * (e / 2) / 180), n - e / 2);
        o = google.maps.geometry.spherical.computeOffset(this.cameramarker.getPosition(), t / Math.cos(Math.PI * (e / 2) / 180), n + e / 2);
        return [this.cameramarker.getPosition(), i, o];
    }

    camera.prototype.move = function() {

        if (bounds != null && bounds && bounds.contains(this.cameramarker.getPosition()) == true) {
            if (street_viewer == null) {
                $scope.hideDynamicStreet = true;
                $scope.StreetView = "IndoorView";
                street_viewer = pannellum.viewer('static_image', ﻿ {
                    "type": "equirectangular",
                    "panorama": "assets/img/cam2.jpg",
                    "showFullscreenCtrl": false,
                    "autoLoad": true,
                    "hfov": 70,
                    "showControls": false
                });
            } else {
                $scope.hideDynamicStreet = true;
                $scope.StreetView = "IndoorView";
            }

        } else {
            $scope.hideDynamicStreet = false;
            $scope.StreetView = "StreetView";
        }


        t = google.maps.geometry.spherical.computeOffset(this.cameramarker.getPosition(), this.currentDistance, this.currentHeading);
        this.subjectMarker.setPosition(t);
        e = this.calculateVertex(this.horizontalaov, this.distanceToSubjectMarker());
        this.leftMarker.setPosition(e[1]);
        this.rightMarker.setPosition(e[2]);
        n = this.pathForIrLine();
        this.irLine.setPath(n), n[1];
        this.angle.setPath(e);
        /* to update a[]*/
        // $scope.updateCameraObject(this);
        /* to update a[]*/
    }

    camera.prototype.update = function() {
        this.currentDistance = google.maps.geometry.spherical.computeDistanceBetween(this.cameramarker.getPosition(), this.subjectMarker.getPosition());

        /* to update a[]*/
        // $scope.updateCameraObject(this);
        /* to update a[]*/

        $scope.updateDistance(this.currentDistance);
        this.currentHeading = google.maps.geometry.spherical.computeHeading(this.cameramarker.getPosition(), this.subjectMarker.getPosition());
        var e, t, n, i, o, r;
        i = google.maps.geometry.spherical.computeHeading(this.cameramarker.getPosition(), this.subjectMarker.getPosition());
        t = this.cameramarker.get("icon");
        t.rotation = i;
        this.cameramarker.set("icon", t);
        e = this.calculateVertex(this.horizontalaov, this.distanceToSubjectMarker());
        this.leftMarker.setPosition(e[1]);
        this.rightMarker.setPosition(e[2]);
        r = this.pathForIrLine();
        this.irLine.setPath(r), r[1];
        this.angle.setPath(e);

    }

    camera.prototype.updateAoV = function() {
        var e;
        $scope.updateAovValue(this.horizontalaov);
        e = this.calculateVertex(this.horizontalaov, this.distanceToSubjectMarker());
        this.leftMarker.setPosition(e[1]);
        this.rightMarker.setPosition(e[2]);
        r = this.pathForIrLine();
        this.irLine.setPath(r), r[1];
        this.angle.setPath(e);
    }

    camera.prototype.setCurrentDistanceAndHeading = function() {
        return this.currentHeading = google.maps.geometry.spherical.computeHeading(this.cameramarker.getPosition(), this.subjectMarker.getPosition()), this.currentDistance = google.maps.geometry.spherical.computeDistanceBetween(this.cameramarker.getPosition(), this.subjectMarker.getPosition());
    }
    camera.prototype.distanceToSubjectMarker = function() {
        return google.maps.geometry.spherical.computeDistanceBetween(this.cameramarker.getPosition(), this.subjectMarker.getPosition())
    }

    camera.prototype.pathForIrLine = function() {
        var e, t, n;
        t = 45, e = google.maps.geometry.spherical.computeHeading(this.cameramarker.getPosition(), this.subjectMarker.getPosition());
        n = google.maps.geometry.spherical.computeOffset(this.cameramarker.getPosition(), t, e);
        return [this.cameramarker.getPosition(), n];
    }

    camera.prototype.calculateAov = function(e, t, n) {
        var i, o, r, a;
        o = google.maps.geometry.spherical.computeHeading(e, t);
        r = google.maps.geometry.spherical.computeHeading(t, n);
        i = 2 * this.getDifference(o, r);
        a = 180.00;
        return (i > a && i < 180 ? a : i < 0 ? 0 : i > 180 ? 180 : i);
    }

    camera.prototype.findClosestPoint = function(e, t) {
        var n, i, o, r, a, s;
        return o = new Array, i = new Array, a = new Array, s = Array.apply(null, Array(180)).map(function(e, t) {
            return t
        }), r = google.maps.geometry.spherical.computeHeading(this.subjectMarker.getPosition(), this.cameramarker.getPosition()), r = 360 * (r - -180) / 360, n = google.maps.geometry.spherical.computeDistanceBetween(this.cameramarker.getPosition(), this.subjectMarker.getPosition()), $.each(s, function(e) {
            return function(i, o) {
                return a[i] = "right" === t ? google.maps.geometry.spherical.computeOffset(e.cameramarker.getPosition(), n / Math.cos(Math.PI * (o / 2) / 180), r + o / 2) : google.maps.geometry.spherical.computeOffset(e.cameramarker.getPosition(), n / Math.cos(Math.PI * (o / 2) / 180), r - o / 2)
            }
        }(this)), $.each(a, function(t, n) {
            var r;
            r = google.maps.geometry.spherical.computeDistanceBetween(e, n), o[t] = r, i[r] = t
        }), "undefined" == typeof a[i[Math.min.apply(Math, o)] + 1] ? a[i[Math.min.apply(Math, o)]] : a[i[Math.min.apply(Math, o)] + 1]
    }

    camera.prototype.getDifference = function(e, t) {
        var n, i;
        return n = e > 0 ? e : 360 + e, t = t > 0 ? t : 360 + t, i = Math.abs(e - t) + 180, i > 180 && (i = 360 - i), Math.abs(i)
    }

    camera.prototype.processStreetView = function(e) {

        var n, i, o, r;
        i = google.maps.geometry.spherical.computeHeading(this.cameramarker.getPosition(), this.subjectMarker.getPosition());
        n = $scope.result_aov;
        r = "AIzaSyCFW1G080NFMVFuIXKLouPSM3lTGm9X8J8";
        o = "https://maps.googleapis.com/maps/api/streetview?key=" + r + "&size=640x483&location=" + this.cameramarker.position.lat() + "," + this.cameramarker.position.lng() + "&heading=" + i + "&fov=" + n + "&pitch=0";

        var sv = document.getElementById("streetview-image");
        $scope.image_street = "https://maps.googleapis.com/maps/api/streetview?key=" + r + "&size=640x483&location=" + this.cameramarker.position.lat() + "," + this.cameramarker.position.lng() + "&heading=" + i + "&fov=";
        $scope.image_coo = 1;

        sv.src = o;
    }

    $scope.initcamera = function() {
        $scope.renamecam = "";
        /*$('#color1').colorPicker();
        $('#color12').colorPicker();*/
        if (!checkPermission(StorageService.getDatavalue("role"), "multipleCamera")) {
            if (cam_count >= 1) {
                $('#NeedPayedAccount').modal('show');
                return;
            }
        }
        $('#nEWrename').modal('show');
    };

    $scope.initcamera2 = function() {
        var dd = $scope.f_min_aov;
        //alert(dd);
        modelService.fov_set(dd);
        $scope.focallength = parseFloat($scope.f_min_focal);
        $scope.result_aov = parseFloat(dd);
        $scope.change_focal_length();
    };

    $scope.addcamera = function() {
        cam_count++;

        /*MODIFIED TO INCLUDE CAMERA ICON START*/
        //labelCount++;
        var len = $scope.a.length,
            isbadgeAvailable = true,
            badgeValue;
        if (len != 0) {

            for (var i = 0; i <= len; i++) {

                isbadgeAvailable = true;
                for (var j = 0; j < len; j++) {

                    if (Number($scope.a[j].camBadgeText) == i + 1) {

                        //labelCount = i + 1;
                        isbadgeAvailable = false;
                        break;

                    }

                }
                if (isbadgeAvailable) {

                    badgeValue = i + 1;
                    break;

                }

            }

        } else {

            badgeValue = 1;

        }
        /*MODIFIED TO INCLUDE CAMERA ICON END*/

        //var jobValue = document.getElementById('colorPicker_hex-0').value;
        var color_picker_element = document.getElementsByClassName('colorPicker-picker');
        var jobValue = color_picker_element[1].style.backgroundColor;
        if ($scope.renamecam == "") {
            $scope.renamecam = "camera";
        }
        $('#nEWrename').modal('hide');
        //$scope.a.push(new camera(cam_count,null, null, null,jobValue,$scope.renamecam));

        if ($scope.is_special_camera) {
            /*Changed*/

            /*MODIFIED TO INCLUDE CAMERA ICON START*/
            $scope.a.push(new camera(cam_count, null, null, $scope.selected_aov, jobValue, $scope.renamecam, $scope.imageUrl, badgeValue));
            /*MODIFIED TO INCLUDE CAMERA ICON END*/

            $scope.a[cam_count - 1].tilt = $scope.Tilt;
            $scope.a[cam_count - 1].scene_height = $scope.sceneheight;
            $scope.a[cam_count - 1].camera_height = $scope.cameraheight;
            $scope.a[cam_count - 1].aov = parseFloat($scope.selected_aov);
            $scope.a[cam_count - 1].focal_length = parseFloat($scope.selected_focal);
            //$scope.a[cam_count - 1].imager_size = $scope.data.selectedOption;
            //$scope.a[cam_count - 1].resolution = $scope.selected_resolution;
            $scope.a[cam_count - 1].unit = $scope.unit;
            $scope.a[cam_count - 1].color = jobValue;
            $scope.a[cam_count - 1].title = $scope.renamecam;
            $scope.a[cam_count - 1].width = $scope.width;
            $scope.a[cam_count - 1].ppf = $scope.cppf;
            $scope.a[cam_count - 1].distance = $scope.distance;

            /*MODIFIED TO INCLUDE CAMERA ICON START*/
            $scope.a[cam_count - 1].imageurl = $scope.imageUrl;
            $scope.a[cam_count - 1].camBadgeText = badgeValue;
            /*MODIFIED TO INCLUDE CAMERA ICON END*/

            /*Changed*/

            $scope.a[cam_count - 1].data = $scope.data;
            $scope.a[cam_count - 1].datas = $scope.datas;

            $scope.a[cam_count - 1].Imager_Size_orginal = "Selected Camera";
            $scope.a[cam_count - 1].image_sizer = true;
            $scope.a[cam_count - 1].image_sizer_span = false;
            $scope.a[cam_count - 1].buttonname = $scope.selected_modal;
            $scope.is_special_camera = false;

            $scope.add_camera = true;
            active_camera = $scope.a[cam_count - 1];
            active_camera_index = cam_count - 1;
        } else {
            /*changed*/
            //alert($scope.datas.selectedresolutions);
            $scope.a.push(new camera(cam_count, null, null, null, jobValue, $scope.renamecam, undefined, badgeValue));
            $scope.a[cam_count - 1].tilt = $scope.Tilt;
            $scope.a[cam_count - 1].scene_height = 10;
            $scope.a[cam_count - 1].camera_height = 10;
            $scope.a[cam_count - 1].ppf = 23.2;
            $scope.a[cam_count - 1].width = 82.8;
            $scope.a[cam_count - 1].distance = 50;
            $scope.a[cam_count - 1].aov = 79.22;
            $scope.a[cam_count - 1].focal_length = 2.9;

            //$scope.a[cam_count - 1].imager_size = $scope.data.selectedOption;
            //$scope.a[cam_count - 1].resolution = $scope.datas.selectedresolutions;
            $scope.a[cam_count - 1].unit = "m";
            $scope.a[cam_count - 1].color = jobValue;
            $scope.a[cam_count - 1].title = $scope.renamecam;
            /*changed*/

            $scope.a[cam_count - 1].data = $scope.data;

            $scope.a[cam_count - 1].datas.selectedresolutions = "1920";

            $scope.is_special_camera = false;
            $scope.a[cam_count - 1].Imager_Size_orginal = "Imager_Size";
            $scope.a[cam_count - 1].image_sizer = false;
            $scope.a[cam_count - 1].image_sizer_span = true;
            $scope.a[cam_count - 1].buttonname = "Add Camera";

            /*MODIFIED TO INCLUDE CAMERA ICON START*/
            $scope.a[cam_count - 1].imageurl = '';
            $scope.a[cam_count - 1].camBadgeText = badgeValue;
            /*MODIFIED TO INCLUDE CAMERA ICON END*/

            var aa = $scope.data;
            $scope.add_camera = true;
            active_camera = $scope.a[cam_count - 1];
            active_camera_index = cam_count - 1;
            $scope.updateOnCameraClicked();

            $scope.distance = parseFloat($scope.a[cam_count - 1].distance.toFixed(2));
            $scope.distances();
            $scope.result_aov = parseFloat($scope.a[cam_count - 1].aov.toFixed(2));
            $scope.focal_length();

        }

    };

    window.onbeforeunload = function(event) {
        //$scope.saveLastLocation();

        if ($scope.isFromLogout) {
            $scope.isFromLogout = false;
            return;
        }

        var current_latlng = map.getCenter();
        var zoom_level = map.getZoom();
        var lat_and_lng = { "lat": current_latlng.lat(), "lng": current_latlng.lng() };
        var obj = { "location": lat_and_lng, "zoom": zoom_level };
        $scope.last_location = obj;
        StorageService.putDatavalue("last_location", JSON.stringify($scope.last_location));
        if ($scope.projectName != '') {
            StorageService.putDatavalue('openedTitle', $scope.projectName);
        } else {
            StorageService.putDatavalue('openedTitle', 'new');
        }
        return 'You have unsaved changes!';

    };

    $(document).ready( function() {
        
        var path = '';
        var modelObj = {};
        if ($rootScope.share == 1) {

            var sharedUrl =  $rootScope.uploadurl;
            $rootScope.uploadurl = "";
            var id = sharedUrl.substring( sharedUrl.lastIndexOf('/') + 1 );
            $rootScope.share = 0;
            var urlRequest = null;
            //editor.loader.loadSharedUrl( id );
            fromSharedUrl = true;
            publishData.urlId = id;

        }
        /*MODIFIED TO SET 3D EDITOR AS THE START STATE START*/
        if( document.getElementById("edit3dbtn") != null || document.getElementById("edit3dbtn") != undefined ) {
            document.getElementById("edit3dbtn").click();
        }
		/*MODIFIED TO SET 3D EDITOR AS THE START STATE END*/
		
		$('#color1').colorPicker();
        $('#color12').colorPicker();
        if(StorageService.getDatavalue('openedTitle') != 'new')
        {
            if(checkPermission(StorageService.getDatavalue("role"),"open"))
            {
                $scope.openProjects(true);   
            }
        }
        var lst_lcn = StorageService.getDatavalue("last_location");
        if(lst_lcn != null || lst_lcn != undefined) {

            lst_lcn = JSON.parse(lst_lcn);
            var lat = lst_lcn.location.lat;
            var lng = lst_lcn.location.lng;
            var zm =  lst_lcn.zoom;
            var loc = {"lat" : lat, "lng" : lng};
            if((lat == null || lng == null || zm == null ) || (typeof(lat) == 'undefined' || typeof(lng) == 'undefined'  || typeof(zm) == 'undefined'))
            {
                $scope.setLocation({"lat": 40.74963047352599,"lng": -73.9685235414974},18);
            }
            else
            {
                $scope.setLocation(loc,zm);
            }
        }
        
        var count =0;

        //Modified for activity logging start
        try{

            var logDatas = {};
            logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " logged in";
            LoggerService.sendLogs( localStorage.getItem( "U_ID" ), logDatas, configFactory.strings.api + "logs/" );

        }
        catch( exception ){

            console.log( "Logging failed!" );
            console.log( exception );

        }
        //Modified for activity logging end
    
    } );
    
    /*$(document.body).on('hide.bs.modal,hidden.bs.modal', function () {
        console.log( 'Bootstrap modal closed' );
        $('body').css('padding-right','0');
    });*/

    $( document.body ).on( 'hidden.bs.modal', function(){
        $( 'body' ).css( 'padding-right', '0' );
    } );

    /*document.body.addEventListener( 'hidden.bs.modal', function( event ){

        console.log( 'Bootstrap modal closed' );
        document.body.style.paddingRight = 0;

    } );*/

    $scope.initializeUserCredentials = function() {
        $scope.fname = StorageService.getDatavalue("firstname");
        $scope.lname = StorageService.getDatavalue("lastname");
        $scope.mail = StorageService.getDatavalue("email");
        $scope.phone = StorageService.getDatavalue("phone");
        $scope.u_role = StorageService.getDatavalue("role");
        if( StorageService.getDatavalue("user_logo") ){
            $scope.userLogo = StorageService.getDatavalue( "user_logo" );
            $('#user-logo').attr('src', $scope.userLogo);
            document.getElementById( 'container-logo' ).style.visibility = "visible";
        }
        else{
            $scope.userLogo = 'assets/img/sample-user.jpg';
            document.getElementById( 'container-logo' ).style.visibility = "hidden";
            
        }
    };

    $scope.initializeUserCredentials();

    $scope.userLoggedOut = function() {


        $rootScope.plan = 10;

        //Modified for activity logging start
        try{

            var logDatas = {};
            logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " logged out";
            LoggerService.sendLogs( localStorage.getItem( "U_ID" ), logDatas, configFactory.strings.api + "logs/" );

        }
        catch( exception ){

            console.log( "Logging failed!" );
            console.log( exception );

        }
        //Modified for activity logging end

        $('#logout_confirm').modal('hide');
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
        localStorage.clear()

        $scope.isFromLogout = true;
        $window.location.reload(true);

        //$location.path('/login');
    }
    $scope.editProfileData = function() {
        $scope.edit_fname = $scope.fname;
        $scope.edit_lname = $scope.lname;
        $scope.edit_mail = $scope.mail;
        $scope.edit_phone = $scope.phone;
    }

    $scope.saveProfileData = function() {
        var url = configFactory.strings.api + "signup/";
        var u_ID = StorageService.getDatavalue("U_ID");

        var datas = {
            "firstname": $scope.edit_fname,
            "lastname": $scope.edit_lname,
            "email": $scope.edit_mail,
            "phone": $scope.edit_phone,
            "role": $scope.u_role
        };
        var data = JSON.stringify(datas);

        $http.put(url + u_ID, data).success(function(response, status) {

                $scope.fname = response.firstname;
                $scope.lname = response.lastname;
                $scope.mail = response.email;
                $scope.phone = response.phone;
                $scope.u_role = response.role;
                $scope.editMode = false;
                StorageService.putDatavalue("firstname", $scope.fname);
                StorageService.putDatavalue("lastname", $scope.lname);
                StorageService.putDatavalue("email", $scope.mail);
                StorageService.putDatavalue("phone", $scope.phone);
                StorageService.putDatavalue("role", $scope.u_role);
            })
            .error(function(data) {

            });
    }

    /*if(checkPermission(StorageService.getDatavalue("role"),"open"))
    {
        $scope.openProjects(true);   
    }*/
    //$( "#mapviewBtn" ).addClass("click-highlight");

    window.onresize = function() {
        google.maps.event.trigger(map, 'resize');
    };

    $("#export_image").click(function() {

        if (!checkPermission(localStorage.getItem("role"), "snapshot")) {
            $('#NeedPayedAccount').modal('show');
            return;
        }

        $("#export_as").trigger("click");
        html2canvas($("#formConfirmation"), {
            useCORS: true,
            onrendered: function(canvas) {
                theCanvas = canvas;
                canvas.toBlob(function(blob) {
                    saveAs(blob, "Project.png");
                });
            }
        });
    });

    $scope.generatePDF = function() {
        if (!checkPermission(localStorage.getItem("role"), "pdf")) {
            $('#NeedPayedAccount').modal('show');
            return;
        }
        kendo.drawing.drawDOM($("#formConfirmation")).then(function(group) {
            kendo.drawing.pdf.saveAs(group, "Project.pdf");
        });
    }

    $scope.savePointOfInterest = function(loc_name) {
        var current_latlng = map.getCenter();
        var zoom_level = map.getZoom();
        var len = $scope.locs.length;
        for (var i = 0; i < len; i++) {
            value = $scope.locs[i];
            var saved_lat = value.location.lat;
            var saved_lng = value.location.lng;
            var cur_lat = current_latlng.lat();
            var cur_lng = current_latlng.lng();

            if (loc_name == value.title) {
                $scope.show_title_used = true;
                return;
            } else if (saved_lat == cur_lat && saved_lng == cur_lng) {
                toastr.success( CurrentLanguageData.Thislocationisalreadysavedwithadifferentname);
                toastr.css = "toast-css";
                $('#point_of_interest').modal('hide');
                $('body').removeClass('modal-open');
                $('.modal-backdrop').remove();
                return;
            }
        };
        var lat_and_lng = { "lat": current_latlng.lat(), "lng": current_latlng.lng() };
        var obj = { "title": loc_name, "location": lat_and_lng, "zoom": zoom_level };
        $scope.locs.push(obj);

        var url = configFactory.strings.api + "signup/";
        var u_ID = StorageService.getDatavalue("U_ID");
        var datas = { "locations": $scope.locs };
        var data = JSON.stringify(datas);

        $http.put(url + u_ID, data).success(function(response, status) {
                $('#point_of_interest').modal('hide');
                $('body').removeClass('modal-open');
                $('.modal-backdrop').remove();
            })
            .error(function(data) {
                console.log("error");
            });
    }

    /**
     * for saving last map location
     */
    $scope.saveLastLocation = function() {

        var current_latlng = map.getCenter();
        var zoom_level = map.getZoom();
        var lat_and_lng = { "lat": current_latlng.lat(), "lng": current_latlng.lng() };
        var obj = { "location": lat_and_lng, "zoom": zoom_level };
        $scope.last_location = obj;
        StorageService.putDatavalue("last_location", JSON.stringify($scope.last_location));
    }

    /**
     * for loading previous location on the map
     */
    $scope.setLocation = function(location, zoom) {

        if (location.lat != '' && location.lng != '' && typeof(location.lat) != 'undefined' && typeof(location.lng) != 'undefined' && zoom != '' && typeof(zoom) != 'undefined') {
            map.setCenter({ "lat": Number(location.lat), "lng": Number(location.lng) });
            map.setZoom(Number(zoom));
        }
    }

    $scope.basicplan_up = function() {
        $scope.send_upgrade(1);
        /* $scope.u_role="1";
         StorageService.putDatavalue("role","1");
         $('#myAccount').modal('hide');
         $('body').removeClass('modal-open');
         $('.modal-backdrop').remove();
         $location.path('/pay'); */

    }
    $scope.professionalplan_up = function() {

        $scope.send_upgrade(2);
        /*$scope.u_role="2";
        StorageService.putDatavalue("role","2");
        $('#myAccount').modal('hide');
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
        $location.path('/pay'); */

    }
    $scope.send_upgrade = function(role) {

        var u_ID = StorageService.getDatavalue("U_ID");
        $http({
            method: "PUT",
            url: configFactory.strings.api + "signup/" + u_ID,
            data: { "role": role }
        }).then(function mySucces(response) {
            var containerexists1 = document.getElementById('colorPicker_hex-0');
            var containerexists2 = document.getElementById('colorPicker_hex-1');
            if (containerexists1) {
                containerexists1.parentNode.removeChild(containerexists1);
            }
            if (containerexists2) {
                containerexists2.parentNode.removeChild(containerexists2);
            }
            $scope.result = response.data;
            // $scope.result=response.data;
            $scope.u_role = role;
            StorageService.putDatavalue("role", role);
            $('#myAccount').modal('hide');
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
            StorageService.putDatavalue('openedTitle', $scope.projectName);

            if( $rootScope.details_get === undefined ){
                $rootScope.details_get = {
                    _id : StorageService.getDatavalue("U_ID"),
                    firstname : $scope.fname,
                    lastname : $scope.lname,
                    email : $scope.mail,
                    phone : $scope.phone,
                    role : $scope.u_role
                }
            }
            else{
                $rootScope.details_get._id = StorageService.getDatavalue("U_ID");
            }
            if( $rootScope.logdata === undefined ){
                $rootScope.logdata = {

                    firstname : $scope.fname,
                    lastname : $scope.lname,
                    email : $scope.mail,
                    phone : $scope.phone,
                    role : $scope.u_role

                }
            }
            else{
                $rootScope.logdata.firstname = $scope.fname;
                $rootScope.logdata.lastname = $scope.lname;
                $rootScope.logdata.email = $scope.mail;
                $rootScope.logdata.phone = $scope.phone;
                $rootScope.logdata.role = $scope.u_role;
            }
            $location.path('/pay');




        }, function myError(status) {

        });
    }

    $scope.activateLocationList = function(index) {

        var locationTextBox = document.getElementById('pac-input');
        $scope.getlocation($scope.locs[$scope.location_index].location.lat, $scope.locs[$scope.location_index].location.lng).then(function(actualLocation) {
            var map_loc = $scope.locs[$scope.location_index].location;
            map.setCenter(map_loc);
            map.setZoom(Number($scope.locs[$scope.location_index].zoom));
            locationTextBox.value = actualLocation;
        });
    }

    $scope.on3DEditorClicked = function() {
        $scope.showEditor = false;
        $("#mapfloorbtn").removeClass("click-highlight");
        $("#mapviewBtn").removeClass("click-highlight");
        $("#map3dbtn").removeClass("click-highlight");
        $("#edit3dbtn").addClass("click-highlight");
    }

});