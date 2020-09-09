app.controller('adminCtrl', function($scope, $http, $location, $rootScope, configFactory, StorageService , $translate) {
    if(StorageService.getDatavalue("isLoggedIn") !== "true" && StorageService.getDatavalue("email") !== "3dezmonitoring@gmail.com") {
        localStorage.clear();
        $location.path('/login');
    } else if(StorageService.getDatavalue("isLoggedIn") == "true" && StorageService.getDatavalue("email") !== "3dezmonitoring@gmail.com") {
        localStorage.clear();
        $location.path('/login');
    }
    $scope.AddcameraMain = false;
    $scope.AddSensorMain = false;
    $scope.AddSmartSensor = false;
    $scope.cameraFromFile = true;
    $scope.sensorFromFile = false;
    $scope.smartSensorFromFile = false;
    $scope.cameraFromInput = false;
    $scope.sensorFromInput = true;
    $scope.smartSensorFromInput = true;
    $scope.myaccount = false;
    $scope.enableEdit = false;
    $scope.changePassword = false;
    $scope.userlist = false;
    $scope.CameraListlist = false;
    $scope.createTrailAccountDiv = false;
    $scope.dashboad = true;
    $scope.adminFirstName = StorageService.getDatavalue("firstname");
    $scope.adminLastName = StorageService.getDatavalue("lastname");
    $scope.adminEmail = StorageService.getDatavalue("email");
    $scope.adminPhone = StorageService.getDatavalue("phone");
    $scope.logEmailAddress = StorageService.getDatavalue("LogEmail");
    $scope.edit_fname = "";
    $scope.edit_lname = "";
    $scope.edit_phone = "";
    $scope.currentPassword = "";
    $scope.newPassword = "";
    $scope.conformPassword = "";
    $scope.cameraBrandName;
    $scope.cameraModelName;
    $scope.cameraMinAov;
    $scope.cameraMaxAov;
    $scope.cameraImageCount;
    $scope.cameraIr;
    $scope.cameraImagerSize;
    $scope.cameraImageUrl;
    $scope.cameraCameraType;
    $scope.cameraResolution;
    $scope.cameraResolution;
    $scope.cameraMinFocus;
    $scope.cameraMAxFocus;
    $scope.imageData;
    $scope.viewmode;
    $scope.matterport;
    $scope.trailEmail = "";
    $scope.sensorBrandName;
    $scope.sensorModelName;
    $scope.sensorHorizontalAov;
    $scope.sensorMinHorizontalAov;
    $scope.sensorLensType;
    $scope.sensorDefaultFov;
    $scope.sensorOpticalZoom;
    $scope.sensorDigitalZoom;
    $scope.sensorCategory;
    $scope.sensorResolutionWidth;
    $scope.sensorResolutionHeight;
    $scope.sensorMaxAov;
    $scope.sensorMinAov;
    $scope.selectedSensorImage = null;
    $scope.manageCameraOrSensor = 1;
    $scope.allCameras = new Array();
    $scope.allSensors = new Array();
    $scope.allSensorArray = new Array();
    $scope.smartSensorBrandName;
    $scope.smartSensorModelName;
    $scope.smartSensorCoverage;
    $scope.smartSensorAngle;
    $scope.smartSensorHeight;
    $scope.smartSensorWifi;
    $scope.smartSensorBluetooth;
    $scope.smartSensorZigBee;
    $scope.smartSensorP2P;
    $scope.smartSensorCategory = "Building";
    $scope.smartSensorApplicationType = "Access Control";
    $scope.smartSensorConnectionType = "Wired";
    $scope.smartSensorCategoryArray = new Array();
    $scope.smartSensorApplicationTypeArray;
    $scope.smartSensorApplicationList = new Array();
    $scope.adminSmartSensors;
    $scope.userSmartSensors;
    $scope.newSmartSensorCategory;
    $scope.newSmartSensorApplicationType;
    $scope.matterportUrl = configFactory.strings.webroot+'#/matterport/';
    $scope.adminUrl = configFactory.strings.webroot;
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

    $scope.addCamera = function() {

        $scope.AddcameraMain = true;
        $scope.AddSensorMain = false;
        $scope.AddSmartSensor = false;
        $scope.dashboad = false;
        $scope.myaccount = false
        $scope.userlist = false;
        $scope.CameraListlist = false;
        $scope.showalluserCamera = false;
        $scope.createTrailAccountDiv = false;
        $scope.matterportUrlDetails = false;
        $scope.matterportDetail = false;
        $scope.matterportIdTable = false;
        $scope.generateTokenMatterportDiv = false;
    }

    $scope.addSensor = function() {

        $scope.AddcameraMain = false;
        $scope.AddSensorMain = true;
        $scope.AddSmartSensor = false;
        $scope.dashboad = false;
        $scope.myaccount = false
        $scope.userlist = false;
        $scope.CameraListlist = false;
        $scope.showalluserCamera = false;
        $scope.createTrailAccountDiv = false;
        $scope.matterportUrlDetails = false;
        $scope.matterportIdTable = false;
        $scope.matterportDetail = false;
        $scope.generateTokenMatterportDiv = false;
    }

    $scope.addSmartSensor = function() {

        $scope.AddcameraMain = false;
        $scope.AddSensorMain = false;
        $scope.AddSmartSensor = true;
        $scope.smartSensorCategoryFlag = false;
        $scope.dashboad = false;
        $scope.myaccount = false
        $scope.userlist = false;
        $scope.CameraListlist = false;
        $scope.showalluserCamera = false;
        $scope.createTrailAccountDiv = false;
        $scope.matterportUrlDetails = false;
        $scope.matterportDetail = false;
        $scope.matterportIdTable = false;
        $scope.generateTokenMatterportDiv = false;
        $scope.getAllSmartSensors();
    }

    $scope.addCameraFromFile = function() {

        $scope.dashboad = false;
        $scope.cameraFromInput = false;
        $scope.sensorFromInput = false;
        $scope.myaccount = false
        $scope.cameraFromFile = true;
        $scope.sensorFromFile = false;
        $scope.smartSensorCategoryFlag = false;
        $scope.smartSensorFromInput = false;
        $scope.userlist = false;
        $scope.CameraListlist = false;
        $scope.showalluserCamera = false;
        $scope.createTrailAccountDiv = false;
        $scope.matterportUrlDetails = false;
        $scope.matterportDetail = false;
        $scope.matterportIdTable = false;
        $scope.generateTokenMatterportDiv = false;
    }

    $scope.addSensorFromFile = function() {

        $scope.dashboad = false;
        $scope.cameraFromInput = false;
        $scope.sensorFromInput = false;
        $scope.myaccount = false
        $scope.cameraFromFile = false;
        $scope.sensorFromFile = true;
        $scope.smartSensorCategoryFlag = false;
        $scope.smartSensorFromInput = false;
        $scope.userlist = false;
        $scope.CameraListlist = false;
        $scope.showalluserCamera = false;
        $scope.createTrailAccountDiv = false;
        $scope.matterportUrlDetails = false;
        $scope.matterportDetail = false;
        $scope.matterportIdTable = false;
        $scope.generateTokenMatterportDiv = false;
    }

    $scope.addCamerafromInput = function() {

        $scope.dashboad = false;
        $scope.cameraFromInput = true;
        $scope.sensorFromInput = false;
        $scope.cameraFromFile = false;
        $scope.sensorFromFile = false;
        $scope.smartSensorCategoryFlag = false;
        $scope.smartSensorFromInput = false;
        $scope.myaccount = false
        $scope.userlist = false;
        $scope.CameraListlist = false;
        $scope.showalluserCamera = false;
        $scope.createTrailAccountDiv = false;
        $scope.matterportUrlDetails = false;
        $scope.matterportIdTable = false;
        $scope.matterportDetail = false;
        $scope.generateTokenMatterportDiv = false;

    }

    $scope.addSensorFromInput = function() {

        $scope.dashboad = false;
        $scope.cameraFromInput = false;
        $scope.sensorFromInput = true;
        $scope.cameraFromFile = false;
        $scope.smartSensorCategoryFlag = false;
        $scope.smartSensorFromInput = false;
        $scope.sensorFromFile = false;
        $scope.myaccount = false
        $scope.userlist = false;
        $scope.CameraListlist = false;
        $scope.showalluserCamera = false;
        $scope.createTrailAccountDiv = false;
        $scope.matterportUrlDetails = false;
        $scope.matterportDetail = false;
        $scope.matterportIdTable = false;
        $scope.generateTokenMatterportDiv = false;

    }

    $scope.addSmartSensorFromInput = function() {

        $scope.dashboad = false;
        $scope.cameraFromInput = false;
        $scope.sensorFromInput = false;
        $scope.smartSensorFromInput = true;
        $scope.smartSensorCategoryFlag = false;
        $scope.cameraFromFile = false;
        $scope.sensorFromFile = false;
        $scope.myaccount = false
        $scope.userlist = false;
        $scope.CameraListlist = false;
        $scope.showalluserCamera = false;
        $scope.createTrailAccountDiv = false;
        $scope.matterportUrlDetails = false;
        $scope.matterportDetail = false;
        $scope.matterportIdTable = false;
        $scope.generateTokenMatterportDiv = false;
        $scope.getAllSmartSensors();
    }

    $scope.addSmartSensorCategory = function() {

        $scope.dashboad = false;
        $scope.cameraFromInput = false;
        $scope.sensorFromInput = false;
        $scope.smartSensorFromInput = false;
        $scope.smartSensorCategoryFlag = true;
        $scope.cameraFromFile = false;
        $scope.sensorFromFile = false;
        $scope.myaccount = false
        $scope.userlist = false;
        $scope.CameraListlist = false;
        $scope.showalluserCamera = false;
        $scope.createTrailAccountDiv = false;
        $scope.matterportUrlDetails = false;
        $scope.matterportDetail = false;
        $scope.matterportIdTable = false;
        $scope.generateTokenMatterportDiv = false;
    }

    $scope.showMyaccount = function() {

        $scope.dashboad = false;
        $scope.allSensorArray = false;
        $scope.AddcameraMain = false;
        $scope.AddSensorMain = false;
        $scope.AddSmartSensor = false;
        $scope.myaccount = true;
        $scope.detailsMyaccount = true;
        $scope.enableEdit = false;
        $scope.changePassword = false;
        $scope.userlist = false;
        $scope.CameraListlist = false;
        $scope.showalluserCamera = false;
        $scope.createTrailAccountDiv = false;
        $scope.matterportUrlDetails = false;
        $scope.matterportDetail = false;
        $scope.matterportIdTable = false;
        $scope.generateTokenMatterportDiv = false;
    }
    $scope.editmyAccount = function() {

        $scope.dashboad = false;
        $scope.enableEdit = true;
        $scope.detailsMyaccount = false;
        $scope.AddcameraMain = false;
        $scope.AddSensorMain = false;
        $scope.AddSmartSensor = false;
        $scope.changePassword = false;
        $scope.userlist = false;
        $scope.CameraListlist = false;
        $scope.showalluserCamera = false;
        $scope.createTrailAccountDiv = false;
        $scope.edit_fname = $scope.adminFirstName;
        $scope.edit_lname = $scope.adminLastName;
        $scope.edit_phone = $scope.adminPhone;
        $scope.edit_LogEmail = $scope.logEmailAddress;
        $scope.matterportUrlDetails = false;
        $scope.matterportDetail = false;
        $scope.matterportIdTable = false;
        $scope.generateTokenMatterportDiv = false;

    }
    $scope.changePasswordData = function() {

        $scope.dashboad = false;
        $scope.changePassword = true;
        $scope.enableEdit = false;
        $scope.detailsMyaccount = false;
        $scope.AddcameraMain = false;
        $scope.AddSensorMain = false;
        $scope.AddSmartSensor = false;
        $scope.userlist = false;
        $scope.CameraListlist = false;
        $scope.showalluserCamera = false;
        $scope.createTrailAccountDiv = false;
        $scope.matterportUrlDetails = false;
        $scope.matterportDetail = false;
        $scope.matterportIdTable = false;
        $scope.generateTokenMatterportDiv = false;
    }
    $scope.getUsersList = function() {

        $scope.dashboad = false;
        $scope.AddcameraMain = false;
        $scope.AddSensorMain = false;
        $scope.AddSmartSensor = false;
        $scope.changePassword = false;
        $scope.enableEdit = false;
        $scope.detailsMyaccount = false;
        $scope.myaccount = false;
        $scope.CameraListlist = false;
        $scope.showalluserCamera = false;
        $scope.createTrailAccountDiv = false;
        $scope.matterportUrlDetails = false;
        $scope.matterportDetail = false;
        $scope.matterportIdTable = false;
        $scope.generateTokenMatterportDiv = false;
        $http({
                method: "GET",
                url: configFactory.strings.api + "users"

            }).then(function (response) {

      
                $scope.allUsers = response.data;

                $scope.userlist = true;

            })
            .catch(function(error) {

                console.log(error)
            });
    }
    $scope.getallcamera = function(index) {

        $scope.dashboad = false;
        $scope.AddcameraMain = false;
        $scope.AddSensorMain = false;
        $scope.AddSmartSensor = false;
        $scope.changePassword = false;
        $scope.enableEdit = false;
        $scope.detailsMyaccount = false;
        $scope.myaccount = false;
        $scope.userlist = false;
        $scope.createTrailAccountDiv = false;
        $scope.generateTokenMatterportDiv = false;
        $scope.matterportUrlDetails = false;
        $scope.matterportIdTable = false;
        $scope.matterportDetail = false;
        $http({
                method: "GET",
                url: configFactory.strings.api + "adminCameras/" + StorageService.getDatavalue("U_ID")

            }).then(function (response) {

                let devices = new Array();
                $scope.allCameras = new Array()
                $scope.allSensors = new Array()
                devices = response.data;
                devices.forEach(device => {
                    if(device["spec"].form_factor == "LiDAR") {
                        $scope.allSensors.push(device)
                    } else if(device["spec"].form_factor != null){
                        $scope.allCameras.push(device)
                    }
                })
                $scope.CameraListlist = true;
                $scope.manageCameraOrSensor = index;

            })
            .catch(function(error) {

                console.log(error)
            });

    }
    $scope.showDashboad = function() {

        $scope.AddcameraMain = false;
        $scope.AddSensorMain = false;
        $scope.AddSmartSensor = false;
        $scope.cameraFromInput = false;
        $scope.myaccount = false;
        $scope.enableEdit = false;
        $scope.changePassword = false;
        $scope.userlist = false;
        $scope.CameraListlist = false;
        $scope.showalluserCamera = false;
        $scope.dashboad = true;
        $scope.createTrailAccountDiv = false;
        $scope.matterportUrlDetails = false;
        $scope.matterportIdTable = false;
        $scope.generateTokenMatterportDiv = false;
        $scope.matterportDetail = false;
        $scope.totalCamers();
        $scope.totalUsers();
        $scope.totalProjects();

    }
    $scope.matterportUrlList = function() {
        
        $scope.dashboad = false;
        $scope.AddcameraMain = false;
        $scope.AddSensorMain = false;
        $scope.AddSmartSensor = false;
        $scope.cameraFromInput = false;
        $scope.myaccount = false;
        $scope.enableEdit = false;
        $scope.changePassword = false;
        $scope.userlist = false;
        $scope.CameraListlist = false;
        $scope.showalluserCamera = false;
        $scope.matterport = true;
        $scope.matterportUrlDetails = true;
        $scope.matterportDetail = true;
        $scope.matterportIdTable = false;
        $scope.generateTokenMatterportDiv = false;
        $scope.createTrailAccountDiv = false;
        $scope.getMatterportId();

    }

    $scope.getMatterportDetails = function() {
        
        $scope.dashboad = false;
        $scope.AddcameraMain = false;
        $scope.AddSensorMain = false;
        $scope.AddSmartSensor = false;
        $scope.cameraFromInput = false;
        $scope.myaccount = false;
        $scope.enableEdit = false;
        $scope.changePassword = false;
        $scope.userlist = false;
        $scope.CameraListlist = false;
        $scope.showalluserCamera = false;
        $scope.matterport = true;
        $scope.generateTokenMatterportDiv = false;
        $scope.matterportUrlDetails = true;
        $scope.matterportIdTable = false;
        $scope.createTrailAccountDiv = false;
        $scope.getMatterportId();

    }

    $scope.generateUniqueId = function() {

        $scope.dashboad = false;
        $scope.AddcameraMain = false;
        $scope.AddSensorMain = false;
        $scope.AddSmartSensor = false;
        $scope.cameraFromInput = false;
        $scope.myaccount = false;
        $scope.enableEdit = false;
        $scope.changePassword = false;
        $scope.userlist = false;
        $scope.CameraListlist = false;
        $scope.showalluserCamera = false;
        $scope.matterport = true;
        $scope.generateTokenMatterportDiv = true;
        $scope.matterportUrlDetails = false;
        $scope.matterportIdTable = true;
        $scope.createTrailAccountDiv = false;
        $scope.matterportIdTable = true;
        $scope.getMatterportUniqueId();
    }

    $scope.generateRandomMatterportId = function(){

        $http({
            method: "GET",
            url: configFactory.strings.api + "matterport/generate",

        }).then(function (response) {

            $scope.matterportId = response.data;

        })
        .catch(function(error) {

            console.log(error)
        });

    }

    $scope.getMatterportUniqueId = function(){

        $http({
            method:"GET",
            url: configFactory.strings.api + "matterport/unique",
        }).then(function (response) {

            $scope.uniqueIdListdata = response.data;
            console.log(response.data) 
        })
        .catch(function(error) {

            console.log(error)
        });
    }

    $scope.reAcceptUrl = function (modelId) {        
        data = {
            endUserId: '',
            count: 0,
            projectAcceptanceDate: ''
        }
        $http({
            method: "PUT",
            data: data,
            url: configFactory.strings.api + "matterport/model/" + modelId
        }).then(function mySucces(response) {
            $scope.getMatterportId();
            toastr.success( "Re initialized" );
        }).catch( error=> {
            console.log(error);   
        })
    }

    $scope.createTrailAccount = function (){

        $scope.AddcameraMain = false;
        $scope.AddSensorMain = false;
        $scope.AddSmartSensor = false;
        $scope.cameraFromInput = false;
        $scope.myaccount = false;
        $scope.enableEdit = false;
        $scope.changePassword = false;
        $scope.userlist = false;
        $scope.CameraListlist = false;
        $scope.showalluserCamera = false;
        $scope.dashboad = false;
        $scope.createTrailAccountDiv = true;
        $scope.matterportUrlDetails = false;
        $scope.matterportDetail = false;
        $scope.matterport = false;
        $scope.generateTokenMatterportDiv = false;
        $scope.matterportIdTable = false;
    }

    $scope.getApplicationType = (event) => {

        $scope.smartSensorCategory = event.target.value
        if($scope.smartSensorCategory != "Others"){

            $scope.smartSensorApplicationType = $scope.smartSensorApplicationTypeArray[event.target.value][0] || ""
        }
    }

    $scope.capitalizeFirstLetter = word => {
        return word.charAt(0).toUpperCase() + word.slice(1)
    }

    $scope.submitNewSmartSensorCategory = () => {
        if($scope.smartSensorCategory == "Others") {
            let category = $scope.capitalizeFirstLetter($scope.newSmartSensorCategory);
            let subCategory = $scope.capitalizeFirstLetter($scope.newSmartSensorApplicationType);

            if(category == "" || subCategory == "") {
                toastr.info("Some Data is Missing");
                return;
            } else {
                $http({
                    method: "POST",
                    url: configFactory.strings.api + "sensor/admin",
                    data: {
                        "category": category,
                        "subCategory": subCategory,
                        "owner": localStorage.getItem("U_ID")
                    }
        
                }).then(function (response) {
        
                    toastr.success("New Category Added")
                })
                .catch(function(error) {
        
                    console.log(error)
                });
            }

        } else if($scope.smartSensorApplicationType == "Others") {

            let subCategory = $scope.capitalizeFirstLetter($scope.newSmartSensorApplicationType);
            if(subCategory == "") {
                toastr.info("Some Data is Missing");
                return;
            } else {
                $http({
                    method: "POST",
                    url: configFactory.strings.api + "sensor/admin",
                    data: {
                        "category": $scope.smartSensorCategory,
                        "subCategory": subCategory,
                        "owner": localStorage.getItem("U_ID")
                    }
        
                }).then(function (response) {
        
                    toastr.success("New Category Added")
                })
                .catch(function(error) {
        
                    console.log(error)
                });
            }
        } else {
            toastr.info("Cannot Add Existing Datas");
            return;
        }
        $scope.getAllSmartSensors();
        $scope.newSmartSensorCategory = "";
        $scope.newSmartSensorApplicationType = ""
    }

    $scope.getAllSmartSensors = () => {
        $http({
            method: "GET",
            url: configFactory.strings.api + "sensor/public"

        }).then(function (response) {

            var applicationType = {};

            response.data.forEach(e => {
                if(!$scope.smartSensorCategoryArray.includes(e.category)){

                    $scope.smartSensorCategoryArray.push(e.category);
                }  
            })

            $scope.smartSensorCategoryArray.forEach(category => {
                var types = [];
                response.data.forEach(e => {
                    if(category == e.category) {
                        types.push(e.subCategory)
                    }
                })
                applicationType[category] = types;
            });

            $scope.smartSensorApplicationTypeArray = applicationType;
        })
        .catch(function(error) {

            console.log(error)
        });
  
    }

    $scope.getAdminSmartSensorList = (index) => {
        $scope.manageCameraOrSensor = index;
        $http({
            method: "GET",
            url: configFactory.strings.api + "sensorspec/admin"

        }).then(function (response) {

            $scope.adminSmartSensors = response.data;
        })
        .catch(function(error) {

            console.log(error)
        });
    }
    $scope.getMatterportId = () => {
        $http({
            method: "GET",
            url: configFactory.strings.api + "matterport"

        }).then(function (response) {
            $scope.matterportDetails = response.data;
           
        })
        .catch(function(error) {

            console.log(error)
        });
    }

    $scope.getUserSmartSensorList = (index) => {
        $scope.manageCameraOrSensor = index;
        
        $http({
            method: "GET",
            url: configFactory.strings.api + "sensorspec/user"

        }).then(function (response) {

            $scope.userSmartSensors = response.data;
        })
        .catch(function(error) {

            console.log(error)
        });
    }

    $scope.changeSmartSensorImage = function(event, option) {
        var filepath = event.target.files[0];
        if (filepath) {
            $scope.selectedSmartSensorImage = filepath
            var reader = new FileReader();

            if(option == "new") {
                reader.onload = function(e) {
                    $("#smart-sensor-thumbnail-image")
                        .attr('src', e.target.result)
                        .width(150)
                        .height(200);
                };
            } else {
                reader.onload = function(e) {
                    $("#edit-smart-sensor-thumbnail-image")
                        .attr('src', e.target.result)
                        .width(150)
                        .height(200);
                };
            }

            
            var Data = new FormData();
            Data.append('file', filepath);
            $.ajax({
                url: configFactory.strings.api + 'cameraSpec/users/update/img',
                type: "POST",
                processData: false,
                contentType: false,
                data: Data,
                success: function(result) {

                },
                error: function(err) {
                    toastr.error('Somthing went wrong try again !!!');
                    console.log(err);
                }
            });

            reader.readAsDataURL(filepath);
        }
     }

    $scope.viewCurrentSmartSensorDetails = (x) => {
        $scope.getAdminSmartSensorList(5);
        $scope.selectedSmartSensor = x;
        $scope.selectedSensorImage = x.spec.sensorImageUrl;
    }

    $scope.editSmartSensor = (x) => {
        $scope.getAllSmartSensors();
        $scope.selectedSmartSensor = x;
        $scope.smartSensorBrandName = x.spec.sensorBrand;
        $scope.smartSensorModelName = x.spec.sensorModel;
        $scope.smartSensorCoverage = x.spec.sensorCoverage;
        $scope.smartSensorAngle = x.spec.sensorAngle;
        $scope.smartSensorHeight = x.spec.sensorHeight;
        $scope.smartSensorCategory = x.spec.sensorCategory;
        $scope.smartSensorWifi = x.spec.checkedTypes.includes("Wifi");
        $scope.smartSensorBluetooth = x.spec.checkedTypes.includes("Bluetooth");
        $scope.smartSensorZigBee = x.spec.checkedTypes.includes("ZigBee");
        $scope.smartSensorP2P = x.spec.checkedTypes.includes("P2P");
        $scope.smartSensorApplicationType = x.spec.sensorSubCategory;
        $scope.smartSensorConnectionType = x.spec.sensorConnection;
        $scope.selectedSensorImage = x.spec.sensorImageUrl;

    }

    $scope.submitNewSmartSensorSpec = () => {
        let smartSensorBrandName = $scope.smartSensorBrandName;
        let smartSensorModelName = $scope.smartSensorModelName;
        let smartSensorCoverage = $scope.smartSensorCoverage;
        let smartSensorAngle = $scope.smartSensorAngle;
        let smartSensorHeight = $scope.smartSensorHeight;
        let smartSensorCategory = $scope.smartSensorCategory;
        let smartSensorApplicationType = $scope.smartSensorApplicationType;
        let smartSensorConnectionType = $scope.smartSensorConnectionType;
        let sensorImageUrl;

        let checked = [];
        $scope.smartSensorWifi == true ? checked.push("Wifi") : false;
        $scope.smartSensorBluetooth == true ? checked.push("Bluetooth") : false;
        $scope.smartSensorZigBee == true ? checked.push("ZigBee") : false;
        $scope.smartSensorP2P == true ? checked.push("P2P") : false;

        if ($scope.selectedSmartSensorImage == undefined || $scope.selectedSmartSensorImage == null) {

            sensorImageUrl = "lidar_black_256.png";
        } else {

            sensorImageUrl = $scope.selectedSmartSensorImage.name;
        }

        if(smartSensorBrandName == "" || smartSensorModelName == "" || smartSensorCoverage == "" || smartSensorAngle == "" || smartSensorHeight == "") {
            toastr.warn("Incomplete data");
            return null;
        } else {

            let newSensorSpecification = {
                 "sensorBrand" : smartSensorBrandName, "sensorModel" : smartSensorModelName, "sensorCoverage" : smartSensorCoverage, "sensorAngle" : smartSensorAngle, "sensorHeight" : smartSensorHeight, "sensorCategory" : smartSensorCategory, "sensorSubCategory" : smartSensorApplicationType, "sensorConnection" : smartSensorConnectionType, "sensorImageUrl" : sensorImageUrl, "checkedTypes": checked };

            let smartSensorSpec = { "user_id" : localStorage.getItem( "U_ID" ), "spec" : newSensorSpecification };

            $http({
                method: "POST",
                url: configFactory.strings.api + "sensorspec/",
                data: smartSensorSpec
    
            }).then(function (response) {
                toastr.success("Added Successfully")
                $scope.smartSensorBrandName = "";
                $scope.smartSensorModelName = "";
                $scope.smartSensorHeight = "";
                $scope.smartSensorCoverage = "";
                $scope.smartSensorAngle = "";
                $scope.smartSensorCategory = "";
                $scope.smartSensorApplicationType = "";
                $scope.smartSensorConnectionType = "";
                
            })
            .catch(function(error) {
    
                console.log(error)
            });

        }
    }

    $scope.removeAdminSmartSensor = id => {
        $http({
            method: "DELETE",
            url: configFactory.strings.api + "sensorspec/" + id,

        }).then(function (response) {
            
            toastr.success("Deleted Successfully");
            $scope.getAdminSmartSensorList($scope.manageCameraOrSensor)
        })
        .catch(function(error) {
            toastr.error("Please try again after reload") 
            console.log(error)
        });
    }

    $scope.updateNewSmartSensorSpec = (id) => {
        let smartSensorBrandName = $scope.smartSensorBrandName;
        let smartSensorModelName = $scope.smartSensorModelName;
        let smartSensorCoverage = $scope.smartSensorCoverage;
        let smartSensorAngle = $scope.smartSensorAngle;
        let smartSensorHeight = $scope.smartSensorHeight;
        let smartSensorCategory = $scope.smartSensorCategory;
        let smartSensorApplicationType = $scope.smartSensorApplicationType;
        let smartSensorConnectionType = $scope.smartSensorConnectionType;
        let sensorImageUrl;

        let checked = [];
        $scope.smartSensorWifi == true ? checked.push("Wifi") : false;
        $scope.smartSensorBluetooth == true ? checked.push("Bluetooth") : false;
        $scope.smartSensorZigBee == true ? checked.push("ZigBee") : false;
        $scope.smartSensorP2P == true ? checked.push("P2P") : false;

        if ($scope.selectedSmartSensorImage == undefined || $scope.selectedSmartSensorImage == null) {

            sensorImageUrl = "lidar_black_256.png";
        } else {

            sensorImageUrl = $scope.selectedSmartSensorImage.name;
        }

        if(smartSensorBrandName == "" || smartSensorModelName == "" || smartSensorCoverage == "" || smartSensorAngle == "" || smartSensorHeight == "") {
            toastr.warn("Incomplete data");
            return null;
        } else {

            let newSensorSpecification = {
                 "sensorBrand" : smartSensorBrandName, "sensorModel" : smartSensorModelName, "sensorCoverage" : smartSensorCoverage,"sensorAngle" : smartSensorAngle, "sensorHeight" : smartSensorHeight, "sensorCategory" : smartSensorCategory, "sensorSubCategory" : smartSensorApplicationType, "sensorConnection" : smartSensorConnectionType, "sensorImageUrl" : sensorImageUrl, "checkedTypes": checked };

            let smartSensorSpec = { "user_id" : localStorage.getItem( "U_ID" ), "spec" : newSensorSpecification };

            $http({
                method: "PUT",
                url: configFactory.strings.api + "sensorspec/" + id,
                data: smartSensorSpec
    
            }).then(function (response) {
                document.getElementById("smartSensorClose").click();
                toastr.success("Updated Successfully")
                $scope.smartSensorBrandName = "";
                $scope.smartSensorModelName = "";
                $scope.smartSensorCoverage = "";
                $scope.smartSensorAngle = "";
                $scope.smartSensorHeight = "";
                $scope.smartSensorCategory = "";
                $scope.smartSensorApplicationType = "";
                $scope.smartSensorConnectionType = "";

                $scope.getAdminSmartSensorList(5);
            })
            .catch(function(error) {
    
                console.log(error)
            });

        }
    }


    $scope.submitNewSensorSpec = () => {

        let sensorBrandName = $scope.sensorBrandName;
        let sensorModelName = $scope.sensorModelName;
        let sensorHorizontalAOV = $("#sensor-horizontal-aov").val();
        let sensorMinHorizontalAOV = $scope.sensorMinHorizontalAov;
        let sensorImageUrl;
        let sensorResolutionWidth = $scope.sensorResolutionWidth;
        let sensorResolutionHeight = $scope.sensorResolutionHeight;
        let sensorDefFov =  $scope.sensorDefaultFov;
        let sensorOpticalZoom = $scope.sensorOpticalZoom;
        let sensorDigitalZoom = $scope.sensorDigitalZoom;
        let sensorLensType = $scope.sensorLensType;
        let sensorCategory = $("#sensor-category").val();
        let sensorMaxAOV = $scope.sensorMaxAOV;
        let sensorMinAOV = $scope.sensorMinAOV;

        if ($scope.selectedSensorImage == undefined || $scope.selectedSensorImage == null) {

            sensorImageUrl = "lidar_black_256.png";
        } else {

            sensorImageUrl = $scope.selectedSensorImage.name;
        }

        if (sensorBrandName == '' || sensorModelName == '' || sensorBrandName == null || sensorModelName == null || sensorHorizontalAOV == null || sensorResolutionWidth == null || sensorResolutionHeight == null ) {

            toastr.error( CurrentLanguageData.SomeDataisMissing );
            return "null";
        } else {

            var vFOV;
            var idRandom = Math.random();
            idRandom = idRandom * 10000;
            var aspect = sensorResolutionWidth/sensorResolutionHeight;
            if( sensorMaxAOV == "" || sensorMaxAOV == null ) {
        
                vFOV = sensorHorizontalAOV / aspect;
            }
            else{
                vFOV = sensorMaxAOV;
            }
            var newSensorSpecification = {
                "id": idRandom,
                "manufacturer": sensorBrandName,
                "model": sensorModelName,
                "model_path": sensorModelName,
                "parent": true,
                "text": sensorBrandName,
                "disabled": true,
                "children": [{
                    "id": idRandom + 1,
                    "manufacturer": sensorBrandName,
                    "model": sensorModelName,
                    "model_path": sensorModelName,
                    "horizontal_aov": sensorHorizontalAOV,
                    "aspect": aspect,
                    "vertical_aov": vFOV,
                    "min_horizontal_aov": sensorMinHorizontalAOV,
                    "max_vertical_aov" : sensorMaxAOV,
                    "min_vertical_aov" : sensorMinAOV,
                    "text": sensorBrandName,
                    "zoom_digital":sensorDigitalZoom,
                    "zoom_optical":sensorOpticalZoom,
                    "def_fov": sensorDefFov,
                    "cam_lens": sensorLensType,
                    "resolutionWidth": sensorResolutionWidth,
                    "resolutionHeight": sensorResolutionHeight,
                    "image_url": "assets/img/" + sensorImageUrl,
                    "sensorCategory": sensorCategory,
                    "form_factor": "LiDAR"
                }],
                "image_url": "assets/img/" + sensorImageUrl,
                "sensorCategory": sensorCategory,
                "form_factor": "LiDAR"
            }

        $scope.sensorBrandName = "";
        $scope.sensorModelName = "";
        $scope.sensorMinHorizontalAov = "";
        $scope.sensorResolutionWidth = "";
        $scope.sensorResolutionHeight = "";
        $scope.sensorDefaultFov = "";
        $scope.sensorOpticalZoom = "";
        $scope.sensorDigitalZoom = "";
        $scope.sensorLensType = "";
        $scope.sensorMaxAOV = "";
        $scope.sensorMinAOV = "";

            $scope.sendCameraToDB(newSensorSpecification)
        }

    }

    $scope.totalCamers = function() {

        $http({
                method: "GET",
                url: configFactory.strings.api + "users"

            }).then(function (response) {

               
                $scope.totalNumberOfUsers = response.data.length;


            })
            .catch(function(error) {

                console.log(error)
            });

    }
    $scope.sendActivityLogFlag = function( activityUser_id ,modalData ,nameOfUser ){

        //console.log(modalData);
        var userDataForUpdate = {

            userId : activityUser_id,
            valueOfFlag : modalData
        }
        $http({

            method: "POST",
            data: userDataForUpdate,
            url: configFactory.strings.api + 'updateLogFlag'
        }).then(function ( response ) {
            if(response.data.sendLog != true){

                toastr.info('Activity log of '+ nameOfUser + ' is send to admin email account in everyday at 1 am ' )

            }
            //console.log(response.data.sendLog)
        })
        .catch ( function (err) {

            console.log( err)
        })
    }
    $scope.totalUsers = function() {

        $http({
                method: "GET",
                url: configFactory.strings.api + "getAllCamera"

            }).then(function (response) {

               
                $scope.allCameraFromDb = response.data
                $scope.totalNumberOfCam = response.data.length;


            })
            .catch(function(error) {

                console.log(error)
            });
    }
    $scope.totalProjects = function() {

        $http({
                method: "GET",
                url: configFactory.strings.api + "getAllProject"

            }).then(function (response) {

               
                $scope.totalNumberOfProject = response.data.length;


            })
            .catch(function(error) {

                console.log(error)
            });

    }

    $scope.saveProfileData = function() {
        var url = configFactory.strings.api + "signup/";
        var u_ID = StorageService.getDatavalue("U_ID");

        var datas = {
            "firstname": $scope.edit_fname,
            "lastname": $scope.edit_lname,
            "phone": $scope.edit_phone,
            "LogEmail" : $scope.edit_LogEmail,
        };
        var data = JSON.stringify(datas);

        $http.put(url + u_ID, data).success(function(response, status) {

                $scope.adminFirstName = response.firstname;
                $scope.adminLastName = response.lastname;
                $scope.adminEmail = response.email;
                $scope.adminPhone = response.phone;
                $scope.logEmailAddress = response.LogEmail;
                StorageService.putDatavalue("firstname", $scope.adminFirstName);
                StorageService.putDatavalue("lastname", $scope.adminLastName);
                StorageService.putDatavalue("email", $scope.adminEmail);
                StorageService.putDatavalue("phone", $scope.adminPhone);
                StorageService.putDatavalue("LogEmail", $scope.logEmailAddress);
                $scope.enableEdit = false;
                $scope.detailsMyaccount = true;
                $scope.changePassword = false;

            })
            .error(function(data) {

            });
    }
    $scope.viewLogs = function( id , email ) {



        var activityLogsFilter  = document.getElementById(  id ).value;
        var activityLogsFilterValue = {'criteria' : 'days' ,'frequency' : 1 }
        switch(activityLogsFilter) {

            case  'Today':

                activityLogsFilterValue.criteria= 'date';
                activityLogsFilterValue.frequency= 1;

                
                break;

            case  'Last Day':

                activityLogsFilterValue.criteria= 'days';
                activityLogsFilterValue.frequency= 1;

                
                break;
            case 'Last Week':

                activityLogsFilterValue.criteria= 'days';
                activityLogsFilterValue.frequency= 7 ;

                break;
            case 'Last Month':

                activityLogsFilterValue.criteria= 'months';
                activityLogsFilterValue.frequency= 1;

                break
            case 'Last 6 Month':

                activityLogsFilterValue.criteria= 'months';
                activityLogsFilterValue.frequency=  6;

                break
        }
        var payload = new FormData();
        var logId = localStorage.getItem('U_ID');
        //var payloadData = {"userId" : "591aa4764105c70fb6b5e9ca", "criteria" : activityLogsFilterValue.criteria , "frequency" : activityLogsFilterValue.frequency ,"date" :  moment().format( "YYYY-MM-DD HH:mm:ss" ) }
       var payloadData = {"userId" : id , "criteria" : activityLogsFilterValue.criteria , "frequency" : activityLogsFilterValue.frequency ,"date" :  moment().format( "YYYY-MM-DD HH:mm:ss" ) }
        payload.append("data", JSON.stringify(payloadData));

        $scope.matterportactiveproject=[]
        var userEmail ={"email":email}
        $http({
            method: "POST",
            data:userEmail,
            url: configFactory.strings.api + "matterport/matterportperuser" 

        }).then(function(matterportactiveproject){

            $scope.matterportactiveproject = matterportactiveproject.data;
         
            $http({
                method: "GET",
                url: configFactory.strings.api + "statistics/users/" + id
                //url: 'http://192.168.11.157:8000/api/statistics/users/591aa4764105c70fb6b5e9ca'

            }).then( function ( response ) {

                
                $.ajax({
                    url: configFactory.strings.api + 'logs/filters/',
                    type: "POST",
                    processData: false,
                    contentType: false,
                    data: payload,
                success: function(result) {

                        
                        $scope.$apply(function() {

                            $scope.viewActiveLogResponce = result.body.logData;
                             $scope.viewActiveLogResponce =  $scope.viewActiveLogResponce + '\nTotal  storage  Details :'+ JSON.stringify(response.data.body.storage) +' \n.'+"\nTotal Active Projects :"+$scope.matterportactiveproject.length;
    
                            var par = document.getElementById('viewAtivitylogPara');
                            par.innerText= $scope.viewActiveLogResponce 

                        });

                        if(result.body.logData != null){

                            $("#viewActiveLog").modal();

                        }

                        else{

                            toastr.info(' No Activity is marked yet !! ')

                        }
                },      
                error: function(err) {
                    toastr.error('Somthing went wrong try again !!!');
                    console.log(err);
                }
            });

            })
            .catch( function(error){

                 toastr.error('Somthing went wrong try again !!!');
                    console.log(error);
            })
        })
          



    }
    $scope.downloadLogs = function( id ,userName ,email ) {

        var activityLogsFilter  = document.getElementById(  id ).value;
        var activityLogsFilterValue = {'criteria' : 'days' ,'frequency' : 1 }
        switch(activityLogsFilter) {

            case  'Today':

                activityLogsFilterValue.criteria= 'date';
                activityLogsFilterValue.frequency= 1;

                
                break;

            case  'Last Day':

                activityLogsFilterValue.criteria= 'days';
                activityLogsFilterValue.frequency= 1;

                
                break;
            case 'Last Week':

                activityLogsFilterValue.criteria= 'days';
                activityLogsFilterValue.frequency= 7 ;

                break;
            case 'Last Month':

                activityLogsFilterValue.criteria= 'months';
                activityLogsFilterValue.frequency= 1;

                break
            case 'Last 6 Month':

                activityLogsFilterValue.criteria= 'months';
                activityLogsFilterValue.frequency=  6;

                break
        }
        var payload = new FormData();
        var logId = localStorage.getItem('U_ID');

        var payloadData = {"userId" : id , "criteria" : activityLogsFilterValue.criteria , "frequency" : activityLogsFilterValue.frequency ,"date" :  moment().format( "YYYY-MM-DD HH:mm:ss" ) }
        payload.append("data", JSON.stringify(payloadData));
        $scope.matterportactiveproject=[]
        var userEmail ={"email":email}
        $http({
            method: "POST",
            data:userEmail,
            url: configFactory.strings.api + "matterport/matterportperuser" 

        }).then(function(matterportactiveproject){

            $scope.matterportactiveproject = matterportactiveproject.data;
            $http({
                method: "GET",
                url: configFactory.strings.api + "statistics/users/" + id
                //url: 'http://192.168.11.157:8000/api/statistics/users/591aa4764105c70fb6b5e9ca'

            }).then( function ( response ) {


                 $.ajax({
                    url: configFactory.strings.api + 'logs/filters/',
                    type: "POST",
                    processData: false,
                    contentType: false,
                    data: payload,
                    success: function(result) {

                            if(result.body.logData != null){    

                               
                                $scope.$apply(function() {

                                    $scope.viewActiveLogResponce = result.body.logData;
                                    $scope.viewActiveLogResponce =  $scope.viewActiveLogResponce + '\nTotal  storage  Details :'+ JSON.stringify(response.data.body.storage) +' \n.';
                           
                                });

                                var csvStringWord = '';
                                var  cvsString = $scope.viewActiveLogResponce.split('\n');
                                for( var k = 0 ; k < cvsString.length ; k++ ){
                                                        
                                    var newString = cvsString[k];
                                                        
                                    csvStringWord += newString.replace(/,/g, "-") + ', \n'
                                                        
                                }
                                var element = document.createElement('a');
                                element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent( csvStringWord ));
                                element.setAttribute('download', userName+'ActivityLogs.csv');
                                element.style.display = 'none';
                                document.body.appendChild(element);
                                element.click();
                                document.body.removeChild(element);   
                            }

                            else{

                                toastr.info(' No Activity is marked yet !! ')

                            }
                            
                    },
                    error: function(err) {
                        toastr.error('Somthing went wrong try again !!!');
                        console.log(err);
                    }
                });
            })
            .catch(function(error){

                toastr.error('Somthing went wrong try again !!!');
                console.log(error);
            })
        })

       // alert( id )
    }

    $scope.emailLogs = function( id , email , userName ) {

        var activityLogsFilter  = document.getElementById(  id ).value;
        var activityLogsFilterValue = {'criteria' : 'days' ,'frequency' : 1 }
        switch(activityLogsFilter) {

            case  'Today':

                activityLogsFilterValue.criteria= 'date';
                activityLogsFilterValue.frequency= 1;

                
                break;

            case  'Last Day':

                activityLogsFilterValue.criteria= 'days';
                activityLogsFilterValue.frequency= 1;

                
                break;
            case 'Last Week':

                activityLogsFilterValue.criteria= 'days';
                activityLogsFilterValue.frequency= 7 ;

                break;
            case 'Last Month':

                activityLogsFilterValue.criteria= 'months';
                activityLogsFilterValue.frequency= 1;

                break
            case 'Last 6 Month':

                activityLogsFilterValue.criteria= 'months';
                activityLogsFilterValue.frequency=  6;

                break
        }
        var payload = new FormData();
        var logId = localStorage.getItem('U_ID');

        var payloadData = {"userId" :  id , "criteria" : activityLogsFilterValue.criteria , "frequency" : activityLogsFilterValue.frequency ,"date" :  moment().format( "YYYY-MM-DD HH:mm:ss" ) }
        payload.append("data", JSON.stringify(payloadData));
 
        $scope.matterportactiveproject=[]
        var userEmail ={"email":email}
        $http({
            method: "POST",
            data:userEmail,
            url: configFactory.strings.api + "matterport/matterportperuser" 

        }).then(function(matterportactiveproject){

            $scope.matterportactiveproject = matterportactiveproject.data;
            $http({
                method: "GET",
                url: configFactory.strings.api + "statistics/users/" + id
                //url: 'http://192.168.11.157:8000/api/statistics/users/591aa4764105c70fb6b5e9ca'

            }).then( function ( response ) {
            

                $.ajax({
                    url: configFactory.strings.api + 'logs/filters/',
                    type: "POST",
                    processData: false,
                    contentType: false,
                    data: payload,
                    success: function(result) {

                        if(result.body.logData != null){    

                            
                            
                            $scope.$apply(function() {

                                $scope.viewActiveLogResponce = result.body.logData;
                                $scope.viewActiveLogResponce =  $scope.viewActiveLogResponce + '\nTotal  storage  Details :'+ JSON.stringify(response.data.body.storage) +' \n' +"\nTotal Active Projects : "+ $scope.matterportactiveproject.length;

                                
                            });
                            var emailData = JSON.stringify({ string : $scope.viewActiveLogResponce , email : email });
                            var datasLog = $scope.viewActiveLogResponce

                            $.ajax({
                                type: 'POST',
                                url: configFactory.strings.api + 'passwordZip',
                                data: { 

                                    'logData': datasLog, 
                                    'email': email,
                                    //'email': 'premkumarp@pivotsys.com',
                                    'name' : userName,
                                    'Id' : id
                                },
                                success: function(msg){
                                    console.log(msg);
                                   toastr.info(msg);
                                }
                            });

                            }

                            else{

                                toastr.info(' No Activity is marked yet !! ')

                            }
                        
        

                    },
                    error: function(err) {
                        toastr.error('Somthing went wrong try again !!!');
                        console.log(err);
                    }
                });

            })
            .catch(function(error){

                toastr.error('Somthing went wrong try again !!!');
                console.log(error);
            })
        })
         
    }

    $scope.updatePassword = function() {

        var currentUrl = window.location.href;
        var currentPassword = $scope.currentPassword;
        var newPassworrd = $scope.newPassword;
        var conformNewPassword = $scope.conformPassword;
        var userId = localStorage.getItem('U_ID');
        if (currentPassword == "" || newPassworrd == "" || conformNewPassword == "") {

            toastr.warning(" Please enter the data in all fields !!");
            return;
        }

        if (newPassworrd == conformNewPassword) {


            var changePasswordData = {
                'currentPassword': currentPassword,
                'newPassworrd': newPassworrd,
                'userId': userId,
                'currentUrl': currentUrl
            }
            $http({
                    method: "POST",
                    data: changePasswordData,
                    url: configFactory.strings.api + "changePassword"

                }).then(function (response) {

                    if (response.data.status == 200) {

                        toastr.success(response.data.body.message);
                        $scope.currentPassword = "";
                        $scope.newPassword = "";
                        $scope.conformPassword = "";
                        $scope.enableEdit = false;
                        $scope.detailsMyaccount = true;
                        $scope.changePassword = false;

                    } else if (response.data.status == 204) {

                        toastr.warning(response.data.body.message);
                        $scope.currentPassword = "";

                    }

                })
                .catch(function(error) {

                    console.log(error)
                });
        } else {

            toastr.error(" Mismatch in New Password and conform password\ Try again !!!")
        }

    }
    $scope.submitnewCameraSpec = function() {

        var Data = $scope.dataCamera();
        $scope.sendCameraToDB(Data);
    }
    $scope.dataCamera = function() {

        var cameraBrandName = $scope.cameraBrandName;
        var cameraModelName = $scope.cameraModelName;
        //var cameraHorizontalAOV = $scope.cameraHorizontalAov;
        var cameraHorizontalAOV = document.getElementById('horizontalAovAdmin').value;
        var cameraMinHorizontalAOV = $scope.cameraMinHorizontalAov;
        var cameraImageUrl
        var cameraCameraType = document.getElementById('cameraTypeadmin').value;
        var cameraResolutionWidth = $scope.cameraResolutionWidth;
        var cameraResolutionHeight = $scope.cameraResolutionHeight;
        var cameraDefFov =  document.getElementById('DefaultFovAdmin').value;
        var cameraOpticalZoom = $scope.opticalZoomAdminInput;
        var cameraDigitalZoom = $scope.digitalZoomAdminInput;
        var cameraLensType = $scope.lensTypeAdminInput;

        var cameraMaxVerticalAOV = $scope.max_vertical_aov;
        var cameraMinVerticalAOV = $scope.min_vertical_aov;
        

        if (filesAdadmin.files[0] == undefined || filesAdadmin.files[0] == null) {

            cameraImageUrl = "Cam_VX_3PV_B_I.png";
        } else {

            cameraImageUrl = filesAdadmin.files[0].name;
        }
        if (cameraBrandName == '' || cameraModelName == '' || cameraBrandName == null || cameraModelName == null || cameraHorizontalAOV == null || cameraResolutionWidth == null || cameraResolutionHeight == null ) {

            toastr.error( CurrentLanguageData.SomeDataisMissing );
            return "null";
        }
        else if( cameraCameraType != "Panorama" && ( (/(^(?:\b|-)([1-9]{1,2}[0]?x|100x)\b)/g).test(cameraOpticalZoom) == false || (/^(?:[1-9]x|0[1-9]x|1[1-5]x|10x)$/g).test(cameraDigitalZoom) == false ) ){
            toastr.error( CurrentLanguageData.incorrectzoomparameters );
            return "null";
        } 
        else {
            var vFOV;
            var idRandom = Math.random();
            idRandom = idRandom * 10000;
            var aspect = cameraResolutionWidth/cameraResolutionHeight;
            if( cameraMaxVerticalAOV == "" || cameraMaxVerticalAOV == null ) {
        
                vFOV = cameraHorizontalAOV / aspect;
            }
            else{
                vFOV = cameraMaxVerticalAOV;
            }
            var getCamSpec = {
                "id": idRandom,
                "manufacturer": cameraBrandName,
                "model": cameraModelName,
                "model_path": cameraModelName,
                "parent": true,
                "text": cameraBrandName,
                "disabled": true,
                "children": [{
                    "id": idRandom + 1,
                    "manufacturer": cameraBrandName,
                    "model": cameraModelName,
                    "model_path": cameraModelName,
                    "horizontal_aov": cameraHorizontalAOV,
                    "aspect": aspect,
                    "vertical_aov": vFOV,
                    "min_horizontal_aov": cameraMinHorizontalAOV,
                    "max_vertical_aov" : cameraMaxVerticalAOV,
                    "min_vertical_aov" : cameraMinVerticalAOV,
                    "text": cameraBrandName,
                    "zoom_digital":cameraDigitalZoom,
                    "zoom_optical":cameraOpticalZoom,
                    "def_fov": cameraDefFov,
                    "cam_lens": cameraLensType,
                    "resolutionWidth": cameraResolutionWidth,
                    "resolutionHeight": cameraResolutionHeight,
                    "image_url": "assets/img/" + cameraImageUrl,
                    "form_factor": cameraCameraType
                }],
                "image_url": "assets/img/" + cameraImageUrl,
                "form_factor": cameraCameraType
            }
            return (getCamSpec)
        }
    }

    $scope.sendCameraToDB = function(getCamSpec) {

        var scope = this;
        if (getCamSpec == "null") {
            return;
        } else if(getCamSpec.sensorCategory != undefined) {

            var userId = StorageService.getDatavalue("U_ID");
            var sensorSpecData = {};
            sensorSpecData.user = userId;
            sensorSpecData.spec = getCamSpec;
            var Data = new FormData();
            var fileJson = $scope.selectedSensorImage;
            Data.append('file', fileJson);
            if ($scope.selectedSensorImage == undefined || $scope.selectedSensorImage == null) {

                $scope.createNewSpecification(sensorSpecData, "sensor");

            } else {

                $.ajax({
                    url: configFactory.strings.api + 'cameraSpec/users/update/img',
                    type: "POST",
                    processData: false,
                    contentType: false,
                    data: Data,
                    success: function(result) {

                        $scope.createNewSpecification(sensorSpecData, "sensor");


                    },
                    error: function(err) {
                        toastr.error('Somthing went wrong try again !!!');
                        console.log(err);
                    }
                });

            }

        } else {

            var userId = StorageService.getDatavalue("U_ID");
            var cameraSpecData = {};
            cameraSpecData.user = userId;
            cameraSpecData.spec = getCamSpec;
            var Data = new FormData();
            var fileJson = filesAdadmin.files[0];
            Data.append('file', fileJson);
            if (filesAdadmin.files[0] == undefined || filesAdadmin.files[0] == null) {

                $scope.createNewSpecification(cameraSpecData, "camera");

            } else {

                $.ajax({
                    url: configFactory.strings.api + 'cameraSpec/users/update/img',
                    type: "POST",
                    processData: false,
                    contentType: false,
                    data: Data,
                    success: function(result) {

                        $scope.createNewSpecification(cameraSpecData, "camera");


                    },
                    error: function(err) {
                        toastr.error('Somthing went wrong try again !!!');
                        console.log(err);
                    }
                });

            }
        }
    }

    $scope.createNewSpecification = function(cameraSpecData, device) {

        $.ajax({
            url: configFactory.strings.api + 'addCameraSpecAdmin',
            type: "POST",
            contentType: 'application/json',
            processData: false,
            data: JSON.stringify(cameraSpecData),
            success: function(result) {

                if(device === "camera"){
                    document.getElementById('filesAdadmin').value = null;
                    document.getElementById('cardthumpimgAddadmin').src = 'assets/img/Cam_VX_3PV_B_I.png'
                } else {
                    document.getElementById('image-file-selection').value = null;
                    document.getElementById('sensor-thumbnail-image').src = 'assets/img/lidar_black_256.png'
                }

                toastr.info( "Your New SpecIs Updated" );
                $scope.$apply(function() {
                    $scope.dashboad = false;
                    $scope.cameraFromInput = false;
                    $scope.myaccount = false
                    $scope.cameraFromFile = true;
                    $scope.userlist = false;
                    $scope.CameraListlist = false;
                    $scope.showalluserCamera = false;
                    $scope.createTrailAccountDiv = false;
                });

            },
            error: function(err) {
                toastr.error('Somthing went wrong try again !!!');
                console.log(err);
            }

        });

    }

    $scope.chnageImag = function(input) {
       // console.log('asd')
        var filepath = filesAdadmin.files[0];
        if (filepath) {
            var reader = new FileReader();

            reader.onload = function(e) {
                $('#cardthumpimgAddadmin')
                    .attr('src', e.target.result)
                    .width(150)
                    .height(200);
            };

            reader.readAsDataURL(filepath);
        }
    }

    $scope.changeSensorImage = function(event) {

         var filepath = event.target.files[0];
         if (filepath) {
             $scope.selectedSensorImage = filepath
             var reader = new FileReader();
 
             reader.onload = function(e) {
                 $("#sensor-thumbnail-image")
                     .attr('src', e.target.result)
                     .width(150)
                     .height(200);
             };
 
             reader.readAsDataURL(filepath);
         }
    }

    $scope.ChangeEditImg = function(input) {
       // console.log('ChangeEditImg')
        var filepath = editfilesAdadmin.files[0];
        if (filepath) {
            var reader = new FileReader();

            reader.onload = function(e) {
                $('#editCardthumpimgAddadmin')
                    .attr('src', e.target.result);
            };

            reader.readAsDataURL(filepath);
        }
    }

    $scope.editSensorImage = function(event) {
        // console.log('ChangeEditImg')
         var filepath = event.target.files[0];
         if (filepath) {
            $scope.selectedSensorImage = filepath
             var reader = new FileReader();
 
             reader.onload = function(e) {
                 $('#edit-sensor-image-thumbnail')
                     .attr('src', e.target.result);
             };
 
             reader.readAsDataURL(filepath);
         }
     }

    $scope.checkSpecialCharater = function(str) {

        return !/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?\s]/g.test(str);
    }
    $scope.cameraspecToDbFromFile = function() {

        var scope = this;
        var fileDAta = document.getElementById("addFileInputadmin").files[0];
        var userId = StorageService.getDatavalue("U_ID");
        var sendurl = configFactory.strings.api + 'addCameraSpecFromFileAdmin/' + userId;
       // console.log(sendurl);
        var checkData = $scope.checkSpecialCharater(fileDAta.name);
        if (checkData) {

            var fds = new FormData()
            fds.append('file', fileDAta);
            $.ajax({
                url: sendurl,
                type: "POST",
                processData: false,
                contentType: false,
                data: fds,
                success: function(result) {

                    toastr.info(result.body.message);
                   // $scope.resetFileBtn();


                },
                error: function(err) {
                    toastr.error('Somthing went wrong try again !!!');
                    console.log(err);
                }
            });
        } else {

            toastr.error("Remove the special characters and white space from the file name");
        }
    }

    $scope.viewCurrentCameraDetails = function(data) {

        var cameraId = data.target.id;
        $http({
                method: "GET",
                url: configFactory.strings.api + "getSpecById/" + cameraId

            }).then(function (response) {

               // console.log(response.data);
                var currentCameraData = response.data;
                $scope.currentCameraDataDetails = currentCameraData;



            })
            .catch(function(error) {

                console.log(error)
            });
    }

    $scope.removeAdminCamera = function(clientId) {
       
        var id = clientId
        var cameraData = {
            'cameraId': clientId,
            'userId': StorageService.getDatavalue("U_ID")
        }
        $http({
                method: "POST",
                data: cameraData,
                url: configFactory.strings.api + "addminCameraRemove/" + id

            }).then(function (response) {

                $http({
                        method: "GET",
                        url: configFactory.strings.api + "adminCameras/" + StorageService.getDatavalue("U_ID")

                    }).then(function (response) {

                        
                        $scope.allCamera = response.data;
                        $scope.CameraListlist = true;
                        $scope.showalluserCamera = true;

                    })
                    .catch(function(error) {

                        console.log(error)
                    });
            })
            .catch(function(error) {

                console.log(error)
            });
    }

    $scope.EditAdminCamera = function(event, device) {
   
        var cameraId = event.target.id;
        $scope.currentEditCamera = event.target.id;
        $http({
                method: "GET",
                url: configFactory.strings.api + "getSpecById/" + cameraId

            }).then(function (response) {
               
                var currentCameraData = response.data;
                $scope.EditcurrentCameraDataDetails = currentCameraData;
                if(device == 1){

                    document.getElementById('editCardthumpimgAddadmin').src = $scope.EditcurrentCameraDataDetails.spec.image_url;
                } else {
                    document.getElementById('edit-sensor-image-thumbnail').src = $scope.EditcurrentCameraDataDetails.spec.image_url;

                }
                //console.log($scope.EditcurrentCameraDataDetails)
                var cameraDefFovEdit = document.getElementById("edit-admincamera-deffov");
                var cameraOpticalEdit = document.getElementById("edit-admincamera-opticalzoom");
                var cameraDigitalEdit = document.getElementById("edit-admincamera-digitalzoom");
                var cameraResolutionWidthEdit = document.getElementById( "edit-admincamera-resolution-width" );
                var cameraResolutionHeightEdit = document.getElementById( "edit-admincamera-resolution-height" );
                var cameraHorizontalAOVEdit = document.getElementById( "edit-admincamera-horizontalaov" );
                var cameraMinHorizontalAOVEdit = document.getElementById( "edit-admincamera-minhorizontalaov" );
                 if( $scope.EditcurrentCameraDataDetails.spec.children[0].form_factor == "Fisheye" ){
                    cameraDefFovEdit.disabled = false;
                    cameraResolutionWidthEdit.disabled = false;
                    cameraResolutionHeightEdit.disabled = false;
                    cameraHorizontalAOVEdit.value = 179;
                    cameraHorizontalAOVEdit.disabled = true;
                    cameraMinHorizontalAOVEdit.value = 10;
                    cameraMinHorizontalAOVEdit.disabled = true;
                    cameraOpticalEdit.disabled = false;
                    cameraDigitalEdit.disabled = false;
                 }
                 else if( $scope.EditcurrentCameraDataDetails.spec.children[0].form_factor == "Panorama" ){
                    cameraDefFovEdit.value ="Right";
                    cameraDefFovEdit.disabled = true;
                    cameraHorizontalAOVEdit.value = 180;
                    cameraHorizontalAOVEdit.disabled = true;
                    cameraMinHorizontalAOVEdit.value= null;
                    cameraMinHorizontalAOVEdit.disabled = true;
                    cameraResolutionWidthEdit.disabled = true;
                    cameraResolutionHeightEdit.disabled = true;
                    cameraOpticalEdit.value = "2x";
                    cameraOpticalEdit.disabled = true;
                    cameraDigitalEdit.value = "4x"
                    cameraDigitalEdit.disabled = true;
                 }
                 else if( $scope.EditcurrentCameraDataDetails.spec.children[0].form_factor == "Dome" ){
                    cameraDefFovEdit.value ="Bottom";
                    cameraDefFovEdit.disabled = true;
                    cameraResolutionWidthEdit.disabled = false;
                    cameraResolutionHeightEdit.disabled = false;
                    cameraHorizontalAOVEdit.disabled = false;
                    cameraMinHorizontalAOVEdit.disabled = false;
                    cameraOpticalEdit.disabled = false;
                    cameraDigitalEdit.disabled = false;            
                }
                else if( $scope.EditcurrentCameraDataDetails.spec.children[0].form_factor == "PTZ" ){
                    cameraDefFovEdit.value ="Right";
                    cameraDefFovEdit.disabled = true;
                    cameraResolutionWidthEdit.disabled = false;
                    cameraResolutionHeightEdit.disabled = false;
                    cameraHorizontalAOVEdit.disabled = false;
                    cameraMinHorizontalAOVEdit.disabled = false;
                    cameraOpticalEdit.disabled = false;
                    cameraDigitalEdit.disabled = false;            
                }
                 else{
                    cameraDefFovEdit.disabled = false;
                    cameraResolutionWidthEdit.disabled = false;
                    cameraResolutionHeightEdit.disabled = false;
                    cameraHorizontalAOVEdit.disabled = false;
                    cameraMinHorizontalAOVEdit.disabled = false;
                    cameraOpticalEdit.disabled = false;
                    cameraDigitalEdit.disabled = false;
                 }


            })
            .catch(function(error) {

                console.log(error)
            });
    }

    $scope.getAdminEditDevice = function(device) {
        var cameraBrandName = $scope.EditcurrentCameraDataDetails.spec.manufacturer;
        var cameraModelName = $scope.EditcurrentCameraDataDetails.spec.model;
        var cameraHorizontalAOV = Number(document.getElementById('edit-admincamera-horizontalaov').value);
        var cameraMinHorizontalAOV = Number(document.getElementById('edit-admincamera-minhorizontalaov').value);
        var cameraImageUrl;
        let sensorImageName;
        let cameraCameraType;
        let sensorCategory;
        if(device == "camera"){

            cameraCameraType = $scope.EditcurrentCameraDataDetails.spec.children[0].form_factor;
            cameraImageUrl = document.getElementById('editfilesAdadmin').value;
        } else {

            sensorCategory = $scope.EditcurrentCameraDataDetails.spec.sensorCategory;
        }
        var cameraResolutionWidth = document.getElementById( 'edit-admincamera-resolution-width' ).value;
        var cameraResolutionHeight = document.getElementById( 'edit-admincamera-resolution-height' ).value;
        var cameraDefaultFov = document.getElementById( 'edit-admincamera-deffov' ).value;
        var cameraOpticalZoom = document.getElementById( 'edit-admincamera-opticalzoom' ).value;
        var cameraDigitalZoom = document.getElementById( 'edit-admincamera-digitalzoom' ).value;
        var cameraLensType = $scope.EditcurrentCameraDataDetails.spec.children[0].cam_lens;

        var cameraMaxVerticalAOV = $scope.EditcurrentCameraDataDetails.spec.children[0].max_vertical_aov;
        var cameraMinVerticalAOV = $scope.EditcurrentCameraDataDetails.spec.children[0].min_vertical_aov;

        if(device == "camera"){
            if (editfilesAdadmin.files[0] == undefined || editfilesAdadmin.files[0] == null) {

                var imageNameEdit = document.getElementById('editCardthumpimgAddadmin').src;
                var imagenameSpiltArray = imageNameEdit.split('/');
                cameraImageUrl = imagenameSpiltArray.pop();
    
            } else {
    
                cameraImageUrl = editfilesAdadmin.files[0].name;
    
            }
        } else {
            if ($scope.selectedSensorImage == undefined || $scope.selectedSensorImage == null) {

                sensorImageName = "lidar_black_256.png";
            } else {
    
                sensorImageName = $scope.selectedSensorImage.name;
            }
        }

        if (cameraBrandName == '' || cameraModelName == '' || cameraBrandName == null || cameraModelName == null || cameraHorizontalAOV == null || cameraResolutionWidth == null || cameraResolutionHeight == null  ) {

            toastr.error( "Some Data is Missing" );
            return "null";

        }
        else if( cameraCameraType != undefined && cameraCameraType != "Panorama" && ( (/(^(?:\b|-)([1-9]{1,2}[0]?x|100x)\b)/g).test(cameraOpticalZoom) == false || (/^(?:[1-9]x|0[1-9]x|1[1-5]x|10x)$/g).test(cameraDigitalZoom) == false ) ){
            toastr.error( CurrentLanguageData.incorrectzoomparameters );
            return "null";
        } 
        else {
            var vFOV;
            var idRandom = Math.random();
            idRandom = idRandom * 10000;
            var aspect = cameraResolutionWidth/cameraResolutionHeight;
            if( cameraMaxVerticalAOV == "" || cameraMaxVerticalAOV == null ) {
        
                vFOV = cameraHorizontalAOV / aspect;
            }
            else{
                vFOV = cameraMaxVerticalAOV;
            }
            let getDeviceSpec;
            if(device == "camera") {
                getDeviceSpec = {
                    "id": idRandom,
                    "manufacturer": cameraBrandName,
                    "model": cameraModelName,
                    "model_path": cameraModelName,
                    "parent": true,
                    "text": cameraBrandName,
                    "disabled": true,
                    "children": [{
                        "id": idRandom + 1,
                        "manufacturer": cameraBrandName,
                        "model": cameraModelName,
                        "model_path": cameraModelName,
                        "horizontal_aov": cameraHorizontalAOV,
                        "aspect": aspect,
                        "vertical_aov": vFOV,
                        "min_horizontal_aov": cameraMinHorizontalAOV,
                        "max_vertical_aov" : cameraMaxVerticalAOV,
                        "min_vertical_aov" : cameraMinVerticalAOV,
                        "text": cameraBrandName,
                        "zoom_digital":cameraDigitalZoom,
                        "zoom_optical":cameraOpticalZoom,
                        "def_fov": cameraDefaultFov,
                        "cam_lens": cameraLensType,
                        "resolutionWidth": cameraResolutionWidth,
                        "resolutionHeight": cameraResolutionHeight,
                        "image_url": "assets/img/" + cameraImageUrl,
                        "form_factor": cameraCameraType
                    }],
                    "image_url": "assets/img/" + cameraImageUrl,
                    "form_factor": cameraCameraType
                }
            } else {
                getDeviceSpec = {
                    "id": idRandom,
                    "manufacturer": cameraBrandName,
                    "model": cameraModelName,
                    "model_path": cameraModelName,
                    "parent": true,
                    "text": cameraBrandName,
                    "disabled": true,
                    "children": [{
                        "id": idRandom + 1,
                        "manufacturer": cameraBrandName,
                        "model": cameraModelName,
                        "model_path": cameraModelName,
                        "horizontal_aov": cameraHorizontalAOV,
                        "aspect": aspect,
                        "vertical_aov": vFOV,
                        "min_horizontal_aov": cameraMinHorizontalAOV,
                        "max_vertical_aov" : cameraMaxVerticalAOV,
                        "min_vertical_aov" : cameraMinVerticalAOV,
                        "text": cameraBrandName,
                        "zoom_digital":cameraDigitalZoom,
                        "zoom_optical":cameraOpticalZoom,
                        "def_fov": cameraDefaultFov,
                        "cam_lens": cameraLensType,
                        "resolutionWidth": cameraResolutionWidth,
                        "resolutionHeight": cameraResolutionHeight,
                        "image_url": "assets/img/" + sensorImageName,
                        "sensorCategory": sensorCategory,
                        "form_factor": "LiDAR"
                    }],
                    "image_url": "assets/img/" + sensorImageName,
                    "sensorCategory": sensorCategory,
                    "form_factor": "LiDAR"
                }
            }
            
            return (getDeviceSpec);
        }
        
    }

    $scope.updateCameraEditData = function(cameraSpecDataupdate) {
       
        $.ajax({

            url: configFactory.strings.api + 'cameraSpec/users/update/',
            type: "POST",
            contentType: 'application/json',
            processData: false,
            data: JSON.stringify(cameraSpecDataupdate),
            success: function(result) {
                if($scope.manageCameraOrSensor == 1) {

                    document.getElementById('editfilesAdadmin').value = null;
                } else {

                    document.getElementById('edit-sensor-image').value = null;
                }
                toastr.info(result);
                $scope.getallcamera($scope.manageCameraOrSensor);
            },
            error: function(err) {
                toastr.error('Somthing went wrong try again !!!');
                console.log(err);
            }
        });
    }

    $scope.updateDevice = function(device) {

        let deviceToEdit = device == 1 ? "camera" : "sensor";

        var getCamSpec = $scope.getAdminEditDevice(deviceToEdit);
        if (getCamSpec == "null") {
            return;
        } else {

            getCamSpec.id = $scope.EditcurrentCameraDataDetails.spec.id;
            getCamSpec.children[0].id = $scope.EditcurrentCameraDataDetails.spec.id + 1;
            var userId = StorageService.getDatavalue("U_ID");
            var cameraSpecDataupdate = {};
            cameraSpecDataupdate.user = userId;
            cameraSpecDataupdate.spec = getCamSpec;
            var Data = new FormData();
            var dataJson = JSON.stringify(getCamSpec);
            let fileJson;
            if(deviceToEdit == "camera") {

                fileJson = editfilesAdadmin.files[0];
            } else {
                fileJson = $scope.selectedSensorImage;
            }
            Data.append('file', fileJson);
            if (fileJson == undefined || fileJson == null) {

                $scope.updateCameraEditData(cameraSpecDataupdate);
            } else {

                $.ajax({
                    url: configFactory.strings.api + 'cameraSpec/users/update/img',
                    type: "POST",
                    processData: false,
                    contentType: false,
                    data: Data,
                    success: function(result) {

                        $scope.updateCameraEditData(cameraSpecDataupdate);

                    },
                    error: function(err) {

                        toastr.error('Somthing went wrong try again !!!');
                        console.log(err);
                    }
                });
            }
        }
    }

    $scope.allUsersCamera = function(index) {

        $http({
                method: "GET",
                url: configFactory.strings.api + "getAllCamera"

            }).then(function (response) {

            
                $scope.allCameraArray = [];
                $scope.allSensorArray = [];
                var userid = StorageService.getDatavalue("U_ID");
                for (var i = 0; i < response.data.length; i++) {

                    if (response.data[i].user_id != userid && response.data[i]["spec"]["children"][0].form_factor == "LiDAR") { 

                        $scope.allSensorArray.push(response.data[i]);

                    } else if( response.data[i].user_id != userid && response.data[i]["spec"]["children"][0].form_factor != null  ) {

                        $scope.allCameraArray.push(response.data[i]);

                    }
                }

                $scope.manageCameraOrSensor = index;
            })
            .catch(function(error) {

                console.log(error)
            });
    }

    $scope.updatecameraToCommon = function(event) {

        var camer_id = event.target.id;
        var cameraData = {
            'userId': StorageService.getDatavalue("U_ID")
        }
        $http({
                method: "POST",
                data: cameraData,
                url: configFactory.strings.api + "updateToCommon/" + event.target.id

            })
            .then(function (response) {

                $scope.allUsersCamera(3);
            })
            .catch(function(error) {

                console.log(error)
            });

    }

    $scope.updateSmartSensor = function(id) {

        var cameraData = {
            'user_id': StorageService.getDatavalue("U_ID"),
            'type': "admin"
        }

        $http({
                method: "PUT",
                data: cameraData,
                url: configFactory.strings.api + "sensorspec/" + id

            })
            .then(function (response) {

                $scope.getAdminSmartSensorList(5);
            })
            .catch(function(error) {

                console.log(error)
            });

    }

    $scope.getuserStorage = function(user_id) {
       
        for(var i= 0; i<$scope.allUsers.length ; i++){
            if($scope.allUsers[i]._id == user_id){

               $scope.matterportactiveproject=[]
               var userEmail ={"email":$scope.allUsers[i].email}               
               $http({
                   method: "POST",
                   data:userEmail,
                   url: configFactory.strings.api + "matterport/matterportperuser" 
   
               }).then(function(response){

                   $scope.matterportactiveproject = response.data;
               })
            }
        }
        $http({
                method: "GET",
                url: configFactory.strings.api + "statistics/users/" + user_id
                //url: 'http://192.168.11.157:8000/api/statistics/users/591aa4764105c70fb6b5e9ca'

            }).then(function (response) {

             
                var responseData = response.data;
                $scope.getInfoCurrentUserProject =responseData.body.projects

                if (response.status === 200) {

                    var stats = responseData.body.storage,
                        userChartData = [],
                        userLegendData = [],
                        totalValue = Number(stats.total).toFixed(2);
                    var keys = Object.keys(stats);
                    var len = keys.length,
                        subTotal = 0;
                    for (var i = 0; i < len; i++) {

                        if (keys[i] == 'total') {

                            var balanceTotal  = 10240 - Number(stats[keys[i]]).toFixed(2);
                            userLegendData.push('Used');
                            userChartData.push({
                                "name": CurrentLanguageData.Used,
                                "value": Number(stats[keys[i]]).toFixed(2)
                            });
                            userLegendData.push('Available');
                            userChartData.push({
                                "name": CurrentLanguageData.Available,
                                "value": balanceTotal
                            });
                        }

                    }

                    var userStorageChart = echarts.init(document.getElementById('adminEachTotal-user-storage'));
                    option = {
                        title: {
                            text: CurrentLanguageData.UtilizationInfo,
                            subtext: CurrentLanguageData.TotalActiveProjects+' : '+$scope.matterportactiveproject.length+'\n'+CurrentLanguageData.TotalUsedStorageSpace +' : ' + Number(totalValue).toFixed(2) + 'MB',
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
                        series: [{
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
                        }]
                    };
                    userStorageChart.setOption(option);
                    $("#eachUserStorage").modal();

                } else {

                    toastr.error(TotalUsedSize.SorrysomethingwentwrongPleasetryagainaftersometime);
                    return;

                }
                for(var i= 0; i<$scope.allUsers.length ; i++){
                     if($scope.allUsers[i]._id == user_id){

                        
                        $scope.getInfoCurrentUser = $scope.allUsers[i];
                        if($scope.allUsers[i].access == undefined) {
                            $scope.viewmode = "Enable";
                            $scope.matterport = "Enable"
                        } else {
                            if($scope.allUsers[i].access.api != undefined) {
                                $scope.viewmode = $scope.allUsers[i].access.api == true ? "Disable" : "Enable";
                            } else {
                                $scope.viewmode = "Enable"
                            }
                            if($scope.allUsers[i].access.matterport != undefined) {
                                $scope.matterport = $scope.allUsers[i].access.matterport == true ? "Disable": "Enable";
                            } else {
                                $scope.matterport = "Enable"
                            }
                        }
                        
                     }                 
                }
                $scope.getInfoCurrentUserCamera = []
                for(var j= 0;  j < $scope.allCameraFromDb.length ; j++){
                    if($scope.allCameraFromDb[j].user_id == user_id){

                        
                        $scope.getInfoCurrentUserCamera.push($scope.allCameraFromDb[j]);
                    }                 
                }
             


            })
            .catch(function(error) {

                console.log(error)
            });

    }

    $scope.removeUser =function(userEmail){

        var currentEmail = localStorage.getItem('email');
        if(userEmail == currentEmail){

            toastr.info('Its an admin account !!');
            return;
        }
        var userData = {'email':userEmail };
        if(confirm('Do you want to remove ' + userEmail)){

            $http({
                method: "POST",
                data: userData,
                url: configFactory.strings.api + "removeUser" 

            })
            .then(function (response) {

                console.log(response);
                if( response.data.status == 200){

                    toastr.info( 'successfully Removed !!')
                }
                else if ( response.data.status == 204){

                    toastr.info( 'successfully Removed but some error in sending email !!')


                }
                else {


                    toastr.error('Somthing went wrong try again !!!');


                }
                
                $scope.getUsersList();
            })
            .catch(function(error) {

                console.log(error)
            });
        }
        else{

            return;

        }

    }
    $scope.totalServerStorage = function(){

                    $http({
                method: "GET",
                //url: configFactory.strings.api + "storage
                url: configFactory.strings.api+'storage'

            }).then(function (response) {

                
                var responseData = response.data;
                $scope.getInfoCurrentUserProject =responseData.body

                if (response.status === 200) {

                    var stats = responseData.body,
                        userChartData = [],
                        userLegendData = [],
                        totalValue = Number(stats.size).toFixed(2);
                    var keys = Object.keys(stats);
                    var len = keys.length,
                        subTotal = 0;
                    for (var i = 0; i < len; i++) {

                        if (keys[i] == 'used') {                         
                            userLegendData.push('Used');
                            userChartData.push({
                                "name": CurrentLanguageData.Used,
                                "value": Number(stats[keys[i]]/(1024*1024*1024)).toFixed(2)
                            });
                        }
                        else if (keys[i] == 'free') {                         
                            userLegendData.push('Available');
                            userChartData.push({
                                "name": CurrentLanguageData.Available,
                                "value": Number(stats[keys[i]]/(1024*1024*1024)).toFixed(2)
                            });
                        }
                        else if (keys[i] == 'size') {                         
                            var siZe = Number(stats[keys[i]]).toFixed(2);
                             $scope.SeverTotalSize =  (siZe / (1024*1024*1024)).toFixed(2);
                        }
                    

                    }
                    
                    
                    
                    var userStorageChart = echarts.init(document.getElementById('totalServerStorage'));
                    option = {
                        title: {
                            text: CurrentLanguageData.Storage,
                            subtext: CurrentLanguageData.TotalSize + Number(totalValue/(1024*1024*1024)).toFixed(2) + 'GB ',
                            x: 'center',
                            subtextStyle: {
                                color: "red"
                            }
                        },
                        tooltip: {
                            trigger: 'item',
                            formatter: "{a} <br/>{b} : {c} GB ({d}%)"
                        },
                        legend: {
                            type: 'scroll',
                            //orient: 'horizontal',
                            left: 'center',
                            bottom: 5,
                            data: userLegendData
                        },
                        series: [{
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
                        }]
                    };
                    userStorageChart.setOption(option);
                }
                else {

                    toastr.error("Sorry something went wrong.\nStorage details of current project cannot be produced");
                    return;

                }
            })
            .catch(function(error) {

                console.log(error)
            });
    }

    
    $scope.grantApiAccess = function( user ){

        if(user.access != undefined && user.access.api != undefined) {
            if( user.access.api == true ){
                $scope.viewmode = 'Enable'
                $.ajax({
                    url: configFactory.strings.api + 'viewmode/access/' + user._id,
                    type: 'POST',
                    dataType: 'json',
                    data : {
                        "update": false
                    }, 
                    success: function( response ) {
                        $scope.getInfoCurrentUser = response
                        toastr.success("Revoked API Acess")
                    },
                    error: function(jqxhr, status, msg) {  
                        toastr.error("Upload Failed Try Again !!");
                    }
                });  
            }
            else if( user.access.api == false ){
                $scope.viewmode = 'Disable'
                $.ajax({
                    url: configFactory.strings.api + 'viewmode/access/' + user._id,
                    type: 'POST',
                    dataType: 'json',
                    data : {
                        "update" : true
                    }, 
                    success: function(response) {
                        $scope.getInfoCurrentUser = response
                        toastr.success("Granted API Acess")
                    },
                    error: function(jqxhr, status, msg) {  
                        toastr.error("Upload Failed Try Again !!");
                    }
                });  
      
            } else {
                $scope.viewmode = 'Disable'
                $.ajax({
                    url: configFactory.strings.api + 'viewmode/access/' + user._id,
                    type: 'POST',
                    dataType: 'json',
                    data : {
                        "update" : true
                    }, 
                    success: function(response) {
                        $scope.getInfoCurrentUser = response
                        toastr.success("Granted API Acess")
                    },
                    error: function(jqxhr, status, msg) {  
                        toastr.error("Upload Failed Try Again !!");
                    }
                });
            }
        } else {
            $scope.viewmode = 'Disable'
            $.ajax({
                url: configFactory.strings.api + 'viewmode/access/' + user._id,
                type: 'POST',
                dataType: 'json',
                data : {
                    "update" : true
                }, 
                success: function(response) {
                    $scope.getInfoCurrentUser = response
                    toastr.success("Granted API Acess")
                },
                error: function(jqxhr, status, msg) {  
                    toastr.error("Upload Failed Try Again !!");
                }
            });
        }

        $scope.getUsersList();
        
    }

    $scope.grantMatterportAccess = function( user ){
        if(user.access != undefined && user.access.matterport != undefined){
            if( user.access.matterport == true ){
                $scope.matterport = 'Enable'
                $.ajax({
                    url: configFactory.strings.api + 'matterport/access/' + user._id,
                    type: 'POST',
                    dataType: 'json',
                    data : {
                        "update":false
                    }, 
                    success: function( response ) {
                        $scope.getInfoCurrentUser = response
                        toastr.success("Revoked API Acess")
                    },
                    error: function(jqxhr, status, msg) {  
                        toastr.error("Update Failed Try Again !!");
                    }
                });  
            }
            else if( user.access.matterport == false ){
                $scope.matterport = 'Disable'
                $.ajax({
                    url: configFactory.strings.api + 'matterport/access/' + user._id,
                    type: 'POST',
                    dataType: 'json',
                    data : {
                        "update" : true
                    }, 
                    success: function(response) {
                        $scope.getInfoCurrentUser = response
                        toastr.success("Granted API Acess")
                    },
                    error: function(jqxhr, status, msg) {  
                        toastr.error("Update Failed Try Again !!");
                    }
                });  
      
            } else {
    
                $scope.matterport = 'Disable'
                $.ajax({
                    url: configFactory.strings.api + 'matterport/access/' + user._id,
                    type: 'POST',
                    dataType: 'json',
                    data : {
                        "update" : true
                    }, 
                    success: function(response) {
                        $scope.getInfoCurrentUser = response
                        toastr.success("Granted API Acess")
                    },
                    error: function(jqxhr, status, msg) {  
                        toastr.error("Update Failed Try Again !!");
                    }
                });  
            }
        } else {
            $scope.matterport = 'Disable'
            $.ajax({
                url: configFactory.strings.api + 'matterport/access/' + user._id,
                type: 'POST',
                dataType: 'json',
                data : {
                    "update" : true
                }, 
                success: function(response) {
                    $scope.getInfoCurrentUser = response
                    toastr.success("Granted API Acess")
                },
                error: function(jqxhr, status, msg) {  
                    toastr.error("Update Failed Try Again !!");
                }
            }); 
        }
        
        $scope.getUsersList();
        
    }

    $scope.userLoggedOut = function() {


        $rootScope.plan = 10;

        $('#logout_confirm').modal('hide');
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
        localStorage.clear()

        $scope.isFromLogout = true;
        //$window.location.reload(true);
        $location.path('/login')

        //$location.path('/login');
    }

    $scope.resetFileBtn = function(){

        document.getElementById('addFileInputadmin').value = null;   
        document.getElementById('add-sensor-input').value = null;   
    }

    $scope.generateTrailAccount  = function (){

       
        var getTrailEmail = $scope.trailEmail;
        toastr.info( 'Please wait account is creating, it will  take a bit time !!');
        var currentUrl =  window.location.href;
        var trailAccountCritereia =
            {
                                
                "firstname" : 'Welcome',
                "lastname" : 'Trial User',
                "email" : getTrailEmail,
                "phone" : "0000000000",
                "password" :"",
                "role" : 2,
                'currentUrl' : currentUrl
            }
        $http({
            method : "POST",
            url : configFactory.strings.api+"trailsignUp",
            data: trailAccountCritereia
        }).then(function mySucces(response) {

            console.log( response );
            if(response.data.status == "usedEmail"){

                toastr.info( 'Email already used');
                $scope.trailEmail = "";

            }
            else if (response.data.status == "Mailsends") {

                toastr.info("Account details is send to admin email !!");
                $scope.trailEmail = "";
               
            }

        })
        .catch (function(error){
           
            console.log(error)         
        })
    }

})