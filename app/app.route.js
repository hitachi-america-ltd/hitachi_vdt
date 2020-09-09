/*angular
        .module('myApp')
        .config('appConfig')
		.factory('settingsFactory', settingsFactory);*/
    
app.config(function($routeProvider,$stateProvider,$urlRouterProvider,$translateProvider) {
        
        $routeProvider
        .when("/", {
            templateUrl : "app/template/login.html"
            // templateUrl : "app/template/pp.html"
        })
        .when("/login", {
        
            templateUrl : "app/template/login.html"
        })
        //  .when("/signup", {
        //      templateUrl : "app/template/signup.html"
        //  })
         .when("/hitachihome/:id", {
            templateUrl : "app/template/hitachihome.html"
        })
        .when("/matterport/:id", {
            templateUrl : "app/template/login.html"
        })
        .when("/forgot", {
            templateUrl : "app/template/forgot.html"
        })
        .when("/terms", {
            templateUrl : "app/template/termsAndCondition.html"
        })
        .when("/signupplan", {

            templateUrl : "app/template/signupplan.html"
        })
        .when("/pay", {

			    templateUrl : "app/template/pay.html"
        })
        .when("/views", {

			    templateUrl : "app/template/share.html"

		    })
         .when("/admin", {

                templateUrl : "app/template/admin.html"

            })
        .when("/changePassword/:id",{

                templateUrl : "app/template/changePassword.html"
                 
        })

        /*.when('/trail', {

                templateUrl : "app/template/trailLogin.html"

        })*/
       
        .when("/changePasswordConform/:id" , {


            resolve : {
                "check" : function( $location, $rootScope, StorageService , $http , configFactory ){
                    
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
                    var currentUrl = window.location.href;
                    var splitCurrentUrl = currentUrl.split('/');
                    var token = splitCurrentUrl.pop();
                    var data = { "Token" : token };

                    
                    $http({
                        method : "POST",
                        data:data,
                        url : configFactory.strings.api+"changePasswordConform"

                    }).then(function mySucces(response) {

                        toastr.info(response.data.body.message);
                        $location.path('/login')
                      
                    })
                    .catch(function(error){
                        console.log(error)
                    });

                }
            }
        })
        .when("/share/:id", {
            resolve : {
                "check" : function( $location, $rootScope, StorageService ){
                    var currentUrl = window.location.href;
                    var userEmail = StorageService.getDatavalue("email");
                    var uniqueId = StorageService.getDatavalue("U_ID");
                    
                    if (typeof userEmail !== 'undefined' && userEmail !== null  && userEmail !== ''){

                        if( uniqueId != undefined && uniqueId != null && uniqueId != '' ){

                            $rootScope.uploadurl = currentUrl;
                            $rootScope.share = 1;
                            $location.path('/hitachihome')

                        }
                        else{
                            $rootScope.uploadurl = currentUrl;
                            $location.path('/views');
                        }
                    
                    }
                    else{
                        $rootScope.uploadurl = currentUrl;
                        $location.path('/views');
                    }

                }
            }

        })
        .when("/matterport/:id", {
            resolve:{
                "check":function($location,$rootScope,StorageService, $http, configFactory){
                    let url = window.location.href;
                    let model_id = url.substring(url.lastIndexOf('/') + 1);
                    var accessCode = prompt("Please enter the Token ID to Access the URL");
                    if (accessCode != null || accessCode != undefined) {

                        $http({
                            method: "POST",
                            data: {
                                "modelId": model_id,
                                "matId": accessCode
                            },
                            dataType: 'json',
                            url: configFactory.strings.api + "matterport/verify"

                        })
                        .then(function (response) {

                            if (response.data.verify == true && response.data.count <3) {

                                localStorage.setItem("model_id", model_id)
                                localStorage.setItem("matterport_access_count", 1);
                                toastr.success("Code Accepted")
                                $location.path('/login');

                            } else if (response.data.verify == false) {

                                toastr.error("The code is invalid. You cannot view the project if you login. Please contact the admin")
                                $location.path('/login');

                            } else if (response.data.verify == true && response.data.count >= 3) {

                                toastr.error("You cannot view the project if you login. Please contact the admin")
                                $location.path('/login');

                            }
                        })
                        .catch(function (error) {

                            console.log(error)

                        });

                    } else {
                        toastr.info("Empty Token ID")
                    }
                }
            },
                templateUrl : "app/template/hitachihome.html"
            })
        .when("/hitachihome", {
        resolve:{
            "check":function($location,$rootScope,StorageService){
                let url = window.location.href;
                let viewModeProjectId = url.substring(url.lastIndexOf('/') + 1);
                if(StorageService.getDatavalue("email") == '3dezmonitoring@gmail.com' ){

                     $location.path('/admin');
                }
                else if(StorageService.getDatavalue("U_ID") == '' || StorageService.getDatavalue("U_ID") == null)
                {
                    $location.path('/login');
                }
            }
        },
            templateUrl : "app/template/hitachihome.html"
        })
        .when("/hitachihome/:id", {
            resolve:{
                "check":function($location,$rootScope,StorageService){
                    let url = window.location.href;
                    let viewModeProjectId = url.substring(url.lastIndexOf('/') + 1);
                   if(viewModeProjectId!= null && viewModeProjectId!= undefined || viewModeProjectId == ''){
                        
                        localStorage.setItem("viewmodeProjectId",viewModeProjectId)
                        $location.path('/login');
                    }
                
                    else if(StorageService.getDatavalue("U_ID") == '' || StorageService.getDatavalue("U_ID") == null)
                    {
                        $location.path('/login');
                    }
                }
            },
                templateUrl : "app/template/hitachihome.html"
            })
        .otherwise({
        
        templateUrl : "app/template/login.html"
        });
        
        $stateProvider

        .state('3D', {
            templateUrl: 'app/template/editor3d.html'
        })

        var en_translations = {
            "HITACHI DESIGN SIMULATOR PLATFORM" :"3D Simulator Visualizer Platform" ,
            "Information About tool" :" Hitachi IP camera simulator is a very user friendly web based software simulator. This tool would be a right solution for a customer to select the correct camera for his specific needs. With this simulator, a client can simulate the camera video surveillance system and can effectively choose the camera/s he wants" ,
            "Single Camera" : "Single Camera" ,
            "FREE PLAN" : "FREE PLAN",
            "Basic 2D Operations": "Basic 2D Operations",
            "NO 3D Operations":"NO 3D Operations",
            "No Reports": "No Reports",
            "SUBSCRIBE" :"SUBSCRIBE",
            "BASIC PLAN" : "BASIC PLAN",
            "Multiple Cameras" : "Multiple Cameras",
            "2D Operations":"2D Operations",
            "Basic 3D": "Basic 3D",
            "User Activity Logs": "User Activity Logs",
            "PROFESSIONAL PLAN" : "PROFESSIONAL PLAN",
            "3D,2D Operations":"3D,2D Operations",
            "Save & Export":"Save & Export",
            "Report Generation": "Report Generation",
            "Signup": "Signup",
            "Login":  "Login",
            "LiDAR" : "LiDAR",
            "Register" : "Register",
            "First name":"First name",
            "Last Name":"Last Name",
            "Your E-mail": "Your Email",
            "Your password": "Your password",
            "Paste your 3D model URL here" : "Paste your 3D model URL here",
            "Confirm Password":"Confirm Password",
            "First name is required!":"First name is required!",
            "Email is required!" : "Email is required!" ,
            "Forgot password":"Forgot password",
            "Sign In":"Sign In",
            "Select any of the plan for using the HITACHI DESIGN SIMULATOR PLATFORM": "Select any of the plan for using the HITACHI DESIGN SIMULATOR PLATFORM",
            "Payment Coming Soon": "Payment Coming Soon",
            "Password" :"Password",
            "Finish" : "Finish",
            "Loading...": "Loading...",
            "invalid credential " : "invalid credential ",
            "password is  required!" :"password is  required!",
            "Last name is required!": "Last name is required!",
            "Not a Valid Id": "Not a Valid Id",
            "re enter the password": "re enter the password",
            "Email already used!": "Email already used!",
            "Email is required!" : "Email is required!",
            "mm/yy":"mm/yy",
            "Conference Room" : "Conference Room",
            "Telecom Room" : "Telecom Room",
            "Service Center": "Service Center",
            "card number" : "card number",
            "select language" : "Select language",
            "camera name" : "camera name",
            "japaneses" : "日本語",
            "english": "English",
            "submit" : "Submit",
            "Change Password": "Change Password",
            "Enter the above text":"Enter the above text",
            "Save" : "Save",
            "new password" : 'new password',
            "Admin": "Admin",
            "DashBoard":"DashBoard",
            "Admin Profile": "Admin Profile",
            "Add Camera": "Add Camera",
            "Manage Camera" : 'Manage Camera/Sensor',
            "User List": "User List",
            "Logout": "Logout",
            "Total Capacity": "Total Capacity",
            "Total Project":"Total Project",
            "Total Cameras" : "Total Cameras ",
            "Total Users" : " Total Users " ,
            "People" : "People",
            "Types" : "Types",
            "GB" : "GB",
            "Welcome Admin !!":"Welcome Admin !!",
            "Email": "Email",
            "Phone" : "Phone",
            "Edit" : "Edit",
            "This field is required!":"This field is required!",
            "Phone number required!" : "Phone number required!",
            "Close": "Close",
            "Current Password": "Current Password",
            "New Password":"New Password",
            "update" :"update",
            "ADD NEW CAMERA" : "ADD NEW CAMERA",
            "Add Camera Spec" : "Add Camera Spec",
            "Add Details from File": "Add Details from File",
            "PLEASE SELECT THE EXCEL FILE" : "PLEASE SELECT THE EXCEL FILE",
            "Reset": "Reset",
            "Add Details from File":"Add Details from File",
            "PLEASE ADD THE DETAILS OF CAMERA": "PLEASE ADD THE DETAILS OF CAMERA",
            "Brand Name":"Brand Name" ,
            "Model Name":"Model Name",
            "Min Aov" : "Min Aov",
            "Max Aov" : "Max Aov",
            "Image Count":"Image Count",
            "ir" :"ir",
            "imager Size" : "imager Size",
            "Camera Type":"Camera Type",
            "Resolution Width" :"Resolution Width",
            "Resolution Height" :"Resolution Height",
            "Resolution" : "Resolution",
            "Frame Rate" : "Frame Rate",
            "Vertical AOV": "Min Vertical AOV",
            "Distance" : "Distance",
            "Horizontal AOV": "Max Horizontal AOV",
            "Min Horizontal AOV": "Min Horizontal AOV",
            "Min Focus" : "Min Focus",
            "Max focus": "Max focus",
            "Change Image": "Change Image",
            "Box" : "Box",
            "Dome" : "Dome",
            "PTZ" : "PTZ",
            "Bullet" : "Bullet",
            "DomeLite" : "Dome Lite",
            "BoxLite" : "Box Lite",
            "BulletLite" : "Bullet Lite",
            "PTZLite" : "PTZ Lite",
            "Covert" : "Covert",
            "CovertLite" : "Covert Lite",
            "LiDARLite" : "LiDAR Lite",
            "IP" : "IP",
            "Day/Night" :  "Day/Night",
            "Thermal" : "Thermal",
            "Wireless" : "Wireless",
            "Brand": "Brand",
            "Imager Size":"Imager Size",
            "Type" : "Type",
            "Model": "Model",
            "View Camera":"View Camera",
            "View": "View",
            "Add To Admin" : "Add To Admin",
            "Edit Camera" : "Edit Camera",
            "All Other Camera": "All Other Camera",
            "User Info" :"User Info",
            "My Account" : "My Account",
            "Account Statistics" : "Account Statistics",
            "Project": "Project",
            "New":"New",
            "Open" : "Open",
            "Save As" :"Save As" ,
            "Delete":"Delete",
            "Export as": "Export as",
            "PDF":"PDF",
            "Snapshot" :"Snapshot",
            "Generate Report": "Generate Report",
            "Add Objects" : "Add Objects",
            "Select Camera": "Select Camera",
            "Upload 2D" : "Upload 2D",
            "Remove 2D" : "Remove 2D",
            "Upload 3D" :"Upload 3D",
            "Preloaded 3D scenes" : "Preloaded 3D scenes",
            "Map View" : "Map View",
            "3D Editor" : "3D Editor",
            "Help": "Help",
            "Hitachi Floor Demo": "Hitachi Floor Demo",
            "Contact info": "Contact info",
            "User Manual": "User Manual",
            "Release Notes" : "Release Notes",
            "Release ID & Date": "Release ID & Date",
            "Upload 2D Objects": "Upload 2D Objects",
            "You can upload 2D Floor Plans or any images as you need." :"You can upload 2D Floor Plans or any images as you need.",
            "File format not supported": "File format not supported" ,
            "Upload" : "Upload",
            "Cancel" : "Cancel" ,
            "You can upload 2D Floor Plans or any images as you need." :"You can upload 2D Floor Plans or any images as you need.",
            "File format not supported": "File format not supported" ,
            "Upload" : "Upload",
            "Cancel" : "Cancel" ,
            "Upload 3D Model" : "Upload 3D Model",
            "Please upload 3D Model as zip file. The folder should contain .obj and .mtl files." :  "Please upload 3D Model as zip file. The folder should contain .obj and .mtl",
            "ONLY ZIP FILE": "オンリー・ジップ・ファイル",
            "Your ZIP file doesnot contain the .obj or .mtl file please upload a new ZIP" : "Your ZIP file doesnot contain the .obj or .mtl file please upload a new ZIP" ,
            "Type a name to your camera" : "Type a name to your camera",
            "Please enter a valid name ." : "Please enter a valid name . ",
            "select a colour for your camera" : "select a colour for your camera",
            "Add" : "Add",
            "Camera Name" : "Camera Name",
            "Select Your Project" : "Select Your Project",
            "Open": "Open",
            "Save Project As" : "Save Project As",
            "Enter a title for this project:" :"Enter a title for this project:",
            "Title" : "Title",
            "Save Project":"Save Project",
            "Save Changes to": "Save Changes to",
            "Warning" : "",
            "Warning" : "",
            "Project already exists. Please choose another name." : "Project already exists. Please choose another name.",
            "Select one to remove": "Select one to remove",
            "Are you sure you want to remove this project?" : "Are you sure you want to remove this project?",
            "Yes" : "はYesい",
            "You may loose the changes made. Do you wish to proceed?" : "You may loose the changes made. Do you wish to proceed?",
            "No" : "No",
            "Select Camera" : "Select Camera",
            "Camera Details":"Camera Details",
            "max-resolution" :"max-resolution",
            "AoV":"AoV",
            "Focal Length" : "Focal Length",
            "Select this camera":"Select this camera",
            "Do you wish to save changes?":"Do you wish to save changes?",
            "Contact Information" : "Contact Information",
            "Email to" :"Email to",
            "for inquiries and support." : "for inquiries and support.",
            "Phone number" : "Phone number",
            "All unsaved data would be lost! Do you wish to save changes?" : "All unsaved data would be lost! Do you wish to save changes?",
            "Operation Not Allowed": "Operation Not Allowed",
            "Please upgrade your account to perform this action.": "Please upgrade your account to perform this action.",
            "Upgrade Now": "Upgrade Now",
            "Are you sure?": "Are you sure?",
            "Do you wish to log out from your account?": "Do you wish to log out from your account?",
            "Logout Now": "Logout Now",
            "Personal Details": "Personal Details",
            "Account Type: Professional": "Account Type: Professional",
            "Account Type: Basic": "Account Type: Basic",
            "Account Type: Free": "Account Type: Free",
            "Upgrade/RenewAccount": "Upgrade/Renew Account",
            "Account Details": "Account Details",
            "2D/Floorplan": "2D/Floorplan",
            "Save,Open,Delete": "Save,Open,Delete",
            "Export(PDF/Snapshot)": "Export(PDF/Snapshot)",
            "MultipleCamera": "MultipleCamera",
            "3D": "3D",
            "Basic": "Basic",
            "Professional": "Professional",
            "Edit Details": "Edit Details",
            "Upload": "Upload",
            "Choose Logo" : "Choose Logo:",
            "Save Project Before Proceeding": "Save Project Before Proceeding",
            "Give a title for the location": "Give a title for the location",
            "Enter title:": "Enter title:",
            "Title already used! Try another one:": "Title already used! Try another one:",
            "Select locations": "Select locations",
            "Select a 3D model": "Select a 3D model",
            "Hitachiwarehouse": "Hitachiwarehouse",
            "Office": "Office",
            "Hitachi second Floor": "Hitachi second Floor",
            "Hitachi Floor": "Hitachi Floor",
            "Snapshots": "Snapshots",
            "Name": "Name",
            "Position": "Position",
            "Tilt": "Tilt",
            "3D Upload": "3D Upload",
            "Loading 3D view, this may take some time!": "Loading 3D view, this may take some time!",
            "Upload Options": "Upload Options",
            "URL": "URL",
            "OR": "OR",
            "Storage Statistics": "Storage Statistics",
            "Nothing to display here! click on the refresh button above": "Nothing to display here! click on the refresh button above",
            "The storage": "The storage",
            "Invalid input": "Invalid input",
            "Angle of View": "Angle of View",
            "Must be between 1 and 180": "Must be between 1 and 180",
            "Distance ": "Distance ",
            "Width": "Width",
            "Unit": "Unit",
            "Imperial": "Imperial",
            "Metric": "Metric",
            "Operational for the 3D camera placement and 3D simulated FOV (Future release)": "Operational for the 3D camera placement and 3D simulated FOV (Future release)",
            "Camera Height": "Camera Height",
            "GetTrailAccount" : "Create Trial Account",
            "Scene Height": "Scene Height",
            "Current FOV": "Current FOV",
            "Day Mode": "Day Mode",
            "Details": "Details",
            "Distance is": "Distance is",
            "Night Mode": "Night Mode",
            "Upload And Share": "Upload And Share",
            "Export and Upload the Scene You Want To Share": "Export and Upload the Scene You Want To Share",
            "URl To Share": "URl To Share",
            "Release ID & Date": "Release ID & Date",
            "Release ID:": "Release ID:",
            "Date": "Date",
            "far" : "far",
            "imager_count" : "imager_count",
            "Number of Project" : "Number of Project",
            "Number of user added camera" :"Number of user added camera",
            "Edit Camera Details": "Edit Camera Details",
            "User Details":"User Details",
            "Simulatedviewoftheselectedcamera"       :  "Simulated view of the selected camera" ,  
            "Simulated2Dview"                        :  "Simulated 2D view",
            "ProjectName"                            :  "Project Name" ,
            "Description"                            :   "Description" ,
            "ProjectLocation"                        :  "Project Location",
            "Company"                                :   "Company",
            "Clonecurrentprojectwithadifferentname"  : "Clone current project with a different name",  "Create"                                :  "Create",
            "CreateNewProject"                       : "Create New Project",
            "Chooseabasemodelfortheproject"          : "Choose a base model for the project",
            "Createashareablelinktomyproject"        : "Create a shareable link to my project", 
            "Defaultsettings"                        : "Default settings",
            "Advancedsettings"                       : "Advanced settings",
            "Optionalsettingsforthelink"             : "Optional settings for the link",
            "Allowotherstoclonethisproject?"         : "Allow others to clone this project?",
            "Expirydateneeded?"                      : "Expiry date needed?",
            "Expireafter"                            : "Expire after",
            "Days"                                   : "Days",
            "Hours"                                  : "Hours",
            "Minutes"                                : "Minutes",
            "ShareableLink"                          : "Shareable Link",
            "Copytoclipboard"                        : "Copy to clipboard" ,
            "GenerateLink"                           : "Generate Link",
            "SaveProject"                            : "Save Project",
            "download": "Download",
            "Check to accept the" : "Check to accept the",
            "Terms & Conditions": "Terms & Conditions",
            "Import Project" : "Import Project",
            "Import from Local Drive/Network" : "Import from Local Drive/Network",
            "Choose File" : "Choose File",
            "Import from DropBox" : "Import from DropBox",
            "Enter a new project name" : "Enter a new project name",
            "MySnapshots":"My Snapshots",
            "Mark":"Mark",
            "MarkAll": "Mark All",
            "URLList" : "URL List",
            "ManageUsers" : "Manage Users",
            "Manage":"Manage",
            "ApiDataList": "API Data List",
            "Optimal Size : Below 50MB" : "Optimal Size : Below 50MB",
            "YouhavetobeonaprojectbeforeyougenerateJSONdata":"You have to be on a project before you generate JSON data",
            "Createuser" : "Create User",
            "UserAlreadyExists" : "User already exists!",
            "Usercreatedsuccessfully" : "User created successfully!",
            "UploadFailedtryAgain" : "Upload failed, try again",
            "Pleaseenablethefrustumandtryagain" : "Please enable the frustum and try again",
            "Pleaseclicktherefreshbutton":"Please click the refresh button!",
            "Generic": "Generic",
            "Serial No":"Serial No",
            "Matterport URLs":"Matterport URLs",
            "Matterport Token":"Matterport Token",
            "Matterport Url List":"Matterport URL List",
            "Matterport" : "Matterport",
            "GenerateUniqueID" : "Generate Unique ID",
            "Generate" : "Generate",
            "Matterport Unique ID List": "Matterport Unique ID List",
            "Matterport Ids" : "Matterport ID",
            "HLS-LFOM3" : "HLS-LFOM3",
            "HLS-LFOM1" : "HLS-LFOM1"
            

            
            

        }
          
          var sp_translations = {
              
            "Matterport Url List":"Matterport URLリスト",
            "Matterport" : "Matterport",
            "HLS-LFOM3" : "HLS-LFOM3",
            "HLS-LFOM1" : "HLS-LFOM1",
            "GenerateUniqueID" : "一意のIDを生成",
            "Matterport Unique ID List": "Matterport 一意のIDリスト",
            "Matterport Ids" : "Matterport ID",
            "Generate" : "生む",
            "Serial No":"シリアル番号",
            "Matterport URLs":"マッターポートURL",
            "Matterport Token":"マッターポートトークン",
            "Optimal Size : Below 50MB" : "最適サイズ：50MB以下",
            "Createuser" : "ユーザーを作成",
            "Pleaseenablethefrustumandtryagain" : "錐台を有効にしてもう一度お試しください",
            "UploadFailedtryAgain" : "アップロードに失敗しました。もう一度お試しください",
            "Usercreatedsuccessfully" : "ユーザーが正常に作成されました！",
            "Pleaseclicktherefreshbutton":"更新ボタンをクリックしてください！",
            "Upgrade/RenewAccount": "アカウントのアップグレード/更新",
            "YouhavetobeonaprojectbeforeyougenerateJSONdata":"JSONデータを生成する前にプロジェクトに参加する必要があります",
            "MySnapshots":"スナップショット",
            "Mark": "マーク",
            "URLList" : "URLリスト",
            "ApiDataList" : "APIデータリスト",
            "ManageUsers" : "ユーザーを管理する",
            "Manage":"管理する",
            "MarkAll": "すべてをマーク",
            "Enter a new project name" : "新しいプロジェクト名を入力してください",
            "Import from DropBox" : "Dropboxからインポート",
            "Choose File" : "ファイルを選ぶ",
            "Import from Local Drive/Network" : "ローカルドライブ/ネットワークからインポート",
            "Import Project" : "インポートプロジェクト",
            "HITACHI DESIGN SIMULATOR PLATFORM" :"3Dシミュレータビジュアライザプラットフォーム" ,
            "Information About tool" :"日立のIPカメラシミュレータは、非常にユーザーフレンドリーなWebベースのソフトウェアシミュレータです。このツールは、顧客が特定のニーズに合った正しいカメラを選択するための適切なソリューションです。このシミュレータを使用すると、クライアントはカメラのビデオ監視システムをシミュレートし、必要なカメラを効果的に選択できます " ,
            "Single Camera" : "単一のカメラ" ,
            "FREE PLAN" : "無料プラン",
            "Basic 2D Operations": "基本2D操作",
            "NO 3D Operations":"3D操作なし",
            "No Reports": "レポートなし",
            "SUBSCRIBE" :"申し込む",
            "BASIC PLAN" : "基本計画",
            "Multiple Cameras" : "複数のカメラ",
            "2D Operations":"2D操作",
            "Basic 3D": "基本的な3D",
            "PROFESSIONAL PLAN" : "プロフェッショナルプラン",
            "3D,2D Operations":"3D、2D操作",
            "Save & Export":"保存してエクスポート",
            "Report Generation": "レポート生成",
            "Signup": "サインアップ",
            "Login":  "ログイン",
            "Register" : "登録",
            "First name":"ファーストネーム",
            "Last Name":"苗字",
            "Your E-mail": "あなたのEメール",
            "Your Yourpassword": "あなたのパスワード",
            "Confirm Password":"パスワードを認証する",
            "First name is required!":"名前は必須です！",
            "Email is required!" : "メールが必要です！" ,
            "Forgot password":"パスワードをお忘れですか",
            "Sign In":"サインイン",
            "Select any of the plan for using the HITACHI DESIGN SIMULATOR PLATFORM": "HITACHI DESIGN SIMULATOR PLATFORMの使用計画を選択してください",
            "Payment Coming Soon": "すぐにお支払い",
            "Password" :"パスワード",
            "Finish" : "フィニッシュ",
            "Loading...": "読み込んでいます...",
            "invalid credential": "無効な資格情報",
            "password is  required!" : "パスワードが必要！",
            "Last name is required!" :"姓は必須です！",
            "Not a Valid Id" :"有効なIDではありません",
            "re enter the password" : "パスワードを再入力する",
            "Email already used!" : "既に使用されている電子メール！",
            "Email is required!" : "メールが必要です！",
            "Your password": "あなたのパスワード",
            "mm/yy" : "月/年",
            "card number" : "カード番号",
            "select language" : "言語を選択する",
            "japaneses" : "日本語",
            "english": "English",
            "submit" : "提出する",
            "Change Password":"パスワードを変更する",
            "Enter the above text":"上記のテキストを入力してください",
            "Save" : "セーブ",
            "new password" : "新しいパスワード",
            "Admin" : "管理者",
            "User Activity Logs" : "ユーザーアクティビティログ",
            "DashBoard":"ダッシュボード",
            "Admin Profile": "管理者プロファイル",
            "Add Camera" : "カメラを追加する",
            "Manage Camera" : "カメラの管理",
            "User List": "ユーザーリスト",
            "Logout" : "ログアウト",
            "Total Capacity": "総容量",
            "Total Project":"プロジェクト総数",
            "Total Cameras" : "トータルカメラ ",
            "Total Users" : " ユーザー総数 " ,
            "People" : "人",
            "Types" : "タイプ",
            "GB" : "ギガビット",
            "Welcome Admin !!":"ようこそ管理者！",
            "Email": "Eメール",
            "Phone" : "電話",
            "Edit":"編集",
            "This field is required!":"この項目は必須です！",
            "Phone number required!" : "電話番号が必要です！",
            "Close": "閉じる",
            "Conference Room" : "会議室",
            "Telecom Room" : "テレコムルーム",
            "Service Center" : "サービスセンター",
            "Current Password": "現在のパスワード" ,
            "New Password":"新しいパスワード",
            "update" :"更新",
            "ADD NEW CAMERA":"新しいカメラを追加する",
            "Add Camera Spec" : "カメラ仕様を追加",
            "Add Details from File" : "ファイルから詳細を追加する",
            "PLEASE SELECT THE EXCEL FILE" : "エクセルファイルを選択してください",
            "Reset": "リセット",
            "Add Details from File":"ファイルから詳細を追加する",
            "PLEASE ADD THE DETAILS OF CAMERA": "カメラの詳細を追加してください",
            "Brand Name":"ブランド名" ,
            "Model Name":"モデル名",
            "Min Aov" : "最小画角",
            "Max Aov" : "最大Aov",
            "Image Count":"イメージ数",
            "ir" :"ir",
            "imager Size" : "イメージャサイズ",
            "Camera Type":"カメラの種類",
            "Resolution Width" : "解像度幅",
            "Resolution Height" : "解像度の高さ",
            "Min Focus" : "最小焦点",
            "Max focus": "最大の焦点",
            "Change Image": "画像の変更",
            "Box" : "ボックス",
            "Dome" : "ドーム",
            "PTZ" : "PTZ",
            "Bullet" : "弾丸",
            "IP" : "私P",
            "Day/Night" :  "昼/夜",
            "Thermal" : "サーマル",
            "Wireless" : "無線",
            "Admin Camera":"管理カメラ",
            "All Other Camera": "その他のカメラ",
            "Brand": "ブランド",
            "Imager Size":"イメージャのサイズ",
            "Type" : "タイプ",
            "Model": "モデル",
            "View Camera":"カメラを見る",
            "Add To Admin" : "管理者に追加",
            "Edit Camera" : "カメラの編集",
            "User Info" :"ユーザー情報",
            "My Account" : "マイアカウント",
            "Account Statistics" : "アカウント統計 ",
            "Project": "プロジェクト",
            "New":"新しい",
            "Open" : "開いた",
            "Save As" :"名前を付けて保存" ,
            "Delete":"削除",
            "Export as": "別名でエクスポート",
            "PDF":"PDF",
            "Snapshot" :"スナップショット",
            "Generate Report": "レポートを生成する",
            "Add Objects" : "オブジェクト",
            "Select Camera": "カメラを選択",
            "Upload 2D" : "2Dをアップロードする",
            "Remove 2D" : "2Dを削除",
            "Upload 3D" :"3Dをアップロードする",
            "Preloaded 3D scenes" : "プリロードされた3Dシーン",
            "Map View" : "マップビュー",
            "3D Editor" : "3Dエディタ",
            "Help": "助けて",
            "Hitachi Floor Demo": "日立フロアデモ",
            "Contact info": "連絡先情報",
            "User Manual": "ユーザーマニュアル",
            "Release Notes" : "リリースノート",
            "Release ID & Date": "リリースIDと日付",
            "Upload 2D Objects":"2Dオブジェクトのアップロード",
            "You can upload 2D Floor Plans or any images as you need." :"2Dフロアプランまたは必要に応じて任意の画像をアップロードできます。",
            "File format not supported": "サポートされていないファイル形式" ,
            "Upload" : "アップロード",
            "Cancel" : "キャンセル" ,
            "Upload 3D Model" : "3Dモデルのアップロード",
            "Please upload 3D Model as zip file. The folder should contain .obj and .mtl files." :  "3Dモデルをzipファイルとしてアップロードしてください。フォルダには、.objファイルと.mtlファイルが含まれている必要があります。",
            "ONLY ZIP FILE": "オンリー・ジップ・ファイル",
            "Your ZIP file doesnot contain the .obj or .mtl file please upload a new ZIP" : "あなたのZIPファイルに.objまたは.mtlファイルが含まれていません。新しいZIPファイルをアップロードしてください。" ,
            "Type a name to your camera" : "カメラの名前を入力してください",
            "Please enter a valid name ." : "有効な名前を入力してください ",
            "select a colour for your camera" : "「カメラの色を選択する」",
            "Add" : "追加",
            "Camera Name" : "カメラ名",
            "Select Your Project" : "あなたのプロジェクトを選択",
            "Open": "開いた",
            "Save Project As" : "プロジェクトを別名で保存",
            "Enter a title for this project:" :"このプロジェクトのタイトルを入力してください",
            "Title" : "タイトル",
            "Save Project":"プロジェクトを保存する",
            "Save Changes to": "変更を保存する",
            "camera name" : "カメラ名",            
            "Warning" : "警告",
            "Project already exists. Please choose another name." : "プロジェクトはすでに存在します。別の名前を選択してください。",
            "Select one to remove": "削除するものを選択してください",
            "Are you sure you want to remove this project?" : "このプロジェクトを削除してもよろしいですか？",
            "Yes" : "はい",
            "You may loose the changes made. Do you wish to proceed?" : "あなたが行った変更を緩和する可能性があります。続行しますか？",
            "No" : "いいえ",
            "Select Camera" : "カメラを選択",
            "Camera Details":"カメラの詳細",
            "max-resolution" :"最大解像度",
            "AoV":"視野角",
            "Focal Length" : "焦点距離",
            "Select this camera":"このカメラを選択",
            "Do you wish to save changes?":"変更を保存しますか？",
            "Contact Information" : "連絡先",
            "Email to" :"電子メール,",
            "Paste your 3D model URL here" :"3DモデルのURLをここに貼り付けてください",
            "for inquiries and support." : "お問い合わせやサポートが必要です。",
            "Phone number" : "電話番号",
            "All unsaved data would be lost! Do you wish to save changes?" : "保存されていないデータはすべて失われます。変更を保存しますか？",
            "Operation Not Allowed" :	"操作が許可されていない",
            "Please upgrade your account to perform this action."	: "この操作を実行するには、アカウントをアップグレードしてください。",   
            "Upgrade Now"	: "今すぐアップグレード",
            "Are you sure?"	 :"本気ですか",
            "Do you wish to log out from your account?"	:"あなたのアカウントからログアウトしますか？",
            "Logout Now"	:"今すぐログアウト",
            "Personal Details"	:"個人情報",
            "Account Type: Professional":	"アカウントの種類：Professional",
            "Upload And Share" : 	"アップロードと共有",
            "Export and Upload the Scene You Want To Share":	"あなたが共有したいシーンを書き出してアップロードする",
            "URl To Share":	"共有する",
            "Release ID & Date" : 	"リリースIDと日付",
            "Release ID:" : 	"リリースID：",
            "Date"	:"日付",      
            "Account Type: Basic" : "口座タイプ：基本",
            "Account Type: Free"	:"アカウントの種類：無料",
            "Account Type: Free"	:"アカウントのアップグレード/更新",
            "Account Details":	"アカウント詳細",
            "2D/Floorplan":	"2D /フロアプラン",
            "Save,Open,Delete": 	"保存、開く、削除",
            "Export(PDF/Snapshot)":	"エクスポート（PDF /スナップショット）",
            "MultipleCamera":	"MultipleCamera",
            "3D":"3D",
            "Basic"	:"ベーシック",
            "Professional" :	"専門家",
            "Edit Details":	"詳細を編集する",
            "Upload": "アップロード",
            "Choose Logo" : "ロゴの選択:",
            "Save Project Before Proceeding":	"進行の前にプロジェクトを保存する",
            "Give a title for the location":	"場所のタイトルを与える",
            "Enter title:":	"タイトルを入力",
            "Title already used! Try another one:" :	"タイトルは既に使用されています！もう1つ試してみてください：",
            "Select locations" :	"場所を選択",
            "Select a 3D model"	:"3Dモデルを選択する",
            "Hitachiwarehouse":	"日立ソフトウエアハウス",
            "Office":	"オフィス",
            "Hitachi second Floor":	"日立第2フロア",
            "Hitachi Floor":	"日立フロア",
            "Snapshots":	"スナップショット",
            "Name":	"名",
            "Position":	"ポジション",
            "Tilt":	"傾斜",
            "3D Upload":	"3Dアップロード",
            "Loading 3D view, this may take some time!"	:"3Dビューを読み込むと、時間がかかることがあります。",
            "Upload Options"	:"アップロードオプション",
            "URL"	:"URL",
            "OR":	"または",
            "Storage Statistics":	"ストレージ統計",
            "Nothing to display here! click on the refresh button above":	"ここに表示するものはありません！上の更新ボタンをクリックしてください",
            "The storage details of the current project will appear here. If you have opened a project, click the refresh button!" :"現在のプロジェクトのストレージの詳細がここに表示されます。プロジェクトを開いた場合は、[更新]ボタンをクリックしてください！",
            "Resolution" :"解決",
            "Invalid input" :"無効入力",
            "Angle of View" :"ビューの角度",
            "Must be between 1 and 180" : "1と180の間でなければならない",	
            "Distance" :	"距離",
            "Width"	:"幅",
            "Unit"	:"単位",
            "Imperial":	"インペリアル",
            "Metric":	"メトリック",
            "Operational for the 3D camera placement and 3D simulated FOV (Future release)":	"3Dカメラの配置と3DシミュレートされたFOV（将来のリリース）",
            "Camera Height"	:"カメラの高さ",
            "Scene Height"	:"シーンの高さ",
            "Tilt" :	"傾斜",
            "GetTrailAccount": "トレイルアカウントを取得する",
            "Current FOV":	"現在のFOV",
            "Day Mode":	"デイモード",
            "Details":	"詳細",
            "Distance is":	"距離は",
            "Night Mode":	"ナイトモード",
            "far" : "遠い",
            "imager_count" : "イメージャ計数",
            "Number of Project" : "プロジェクト数",
            "Number of user added camera" :"ユーザーが追加したカメラの数",
            "Edit Camera Details" : "カメラの詳細を編集する",
            "User Details":"ユーザーの詳細" ,
            "View":"ビュー",
            "Simulatedviewoftheselectedcamera"       :  "選択したカメラのシミュレートされたビュー",
            "Simulated2Dview"                        :  "シミュレートされた2Dビュー"   ,
            "ProjectName"                            :  "プロジェクト名"    ,  
            "Description"                            :  "説明"     ,      
            "ProjectLocation"                        :  "プロジェクトの場所",
            "Company"                                :  "会社",
            "Clonecurrentprojectwithadifferentname"  :  "現在のプロジェクトを別の名前で複製する",
            "CreateNewProject"                       :  "新しいプロジェクトを作成する",
            "Chooseabasemodelfortheproject"          :  "プロジェクトの基本モデルを選択する" ,
            "Createashareablelinktomyproject"        :  "プロジェクトへの共有可能なリンクを作成する",
            "Defaultsettings"                        :  "デフォルトの設定",
            "Advancedsettings"                       :  "高度な設定",
            "Optionalsettingsforthelink"             :  "リンクのオプション設定",
            "Allowotherstoclonethisproject?"         :  "他の人がこのプロジェクトを複製できるようにしますか？",
            "Expirydateneeded?"                      :  "有効期限は必要ですか？",
            "Expireafter"                            :  "後に期限が切れる",
            "Days"                                   :  "日々",
            "Hours"                                  :  "時間" ,
            "Minutes"                                :  "分",
            "ShareableLink"                          :  "共有可能なリンク",
            "Copytoclipboard"                        :  "クリップボードにコピー",
            "GenerateLink"                           :  "リンクを生成する"  ,
            "SaveProject"                            :  "プロジェクトを保存する",
            "Create"                                 :  "作成する",
            "download": "ダウンロード",
            "Check to accept the": "チェックして",
            "Terms & Conditions": "利用規約"

 

            

            
            
          }
          
          $translateProvider.translations('en',en_translations);
          
          $translateProvider.translations('jp',sp_translations);
          
          $translateProvider.preferredLanguage('en');
		 
    });