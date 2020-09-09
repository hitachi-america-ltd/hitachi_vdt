app.controller('loginctrl', function ($scope, $http, $location, $rootScope, StorageService, configFactory, $translate) {
	$rootScope.logindata = 0;
	var lang = new language();
	var lngDatas = lang.lngdata;
	$scope.invalid_ceiteria = false;

	if ($rootScope.currentLanguage == undefined) {

		$rootScope.currentLanguage = "en";
		$scope.languageData = lngDatas.en;
		$translate.use("en");
	}
	else {
		$translate.use($rootScope.currentLanguage);
		//$scope.languageData = lang.$rootScope.currentLanguage;
		if ($rootScope.currentLanguage == "jp") {

			$scope.languageData = lngDatas.jp;
			console.log($scope.languageData);
		}
		if ($rootScope.currentLanguage == "en") {

			$scope.languageData = lngDatas.en;
		}
	}
	//console.log($rootScope.currentLanguage);
	$scope.changeLanguage = function (lang) {
		$translate.use(lang);
		$rootScope.currentLanguage = lang;
		if (lang == "jp") {

			$scope.languageData = lngDatas.jp;
		}
		if (lang == "en") {

			$scope.languageData = lngDatas.en;
		}
	}
	$scope.class_body = "prembody";
	$scope.role_plan = function (value) {

		if (value == 0) {
			$scope.result.role = "free";
		}
		else if (value == 1) {
			$scope.result.role = "basic";
		}
		else if (value == 2) {
			$scope.result.role = "professional";
		}
	}
	$scope.login_fun = function () {
		//console.log($scope.checkboxModelTermsandContition);
		if ($scope.checkboxModelTermsandContition != true) {
			toastr.info($scope.languageData.PleaseaccepttheTermsandConditions)
			return;
		}

		var email = $scope.user_email;
		var password = $scope.user_password;
		var postdata = { "username": email, "password": password };
		$http({
			method: "POST",
			data: postdata,
			url: configFactory.strings.api + "login"
		}).then(function mySuccess(response) {
               
			$scope.result = response.data;
			$scope.result.isLoggedIn = "true"
			if( $scope.result.access != undefined){
				if($scope.result.access.api != undefined){
					localStorage.setItem("api_access",$scope.result.access.api)
				}
				if($scope.result.access.matterport != undefined) {
					localStorage.setItem("matterport_user",$scope.result.access.matterport)
				}
				
			}
			if (localStorage.getItem('matterport_user') == "true" && localStorage.getItem('model_id') !== undefined && localStorage.getItem('model_id') !== null) {
				modelId = localStorage.getItem('model_id');
			    $http({
					method: "GET",
					dataType: 'json',
					url: configFactory.strings.api + "matterport/" + modelId
				})
				.then(response => {
					localStorage.setItem("matterportAccessCount", response.data.count)
					if (response.data.count != 0 && response.data.count < 3){
						data = {
							count : response.data.count + 1
						}
						$http({
							method: "PUT",
							data: data,
							url: configFactory.strings.api + "matterport/model/" + modelId
						}).then(function mySucces(response) {
							console.log(response);
						})
					}
				})
			}
		
			$rootScope.loginResp = {
				"user_id": $scope.result._id,
				"firstname": $scope.result.firstname,
				"lastname": $scope.result.lastname,
				"email": $scope.result.email,
				"phone": parseInt($scope.result.phone),
				"role": $scope.result.role,
				'LogEmail': $scope.result.LogEmail,
				'viewmode': $scope.result.viewmode,
				'owner_id': $scope.result.owner_id,
				
			}
			if( $scope.result.user_logo ){
				$rootScope.loginResp.userLogo = $scope.result.user_logo;
				$rootScope.loginResp.userLogo = $scope.result.user_logo
				StorageService.putDatavalue("user_logo", "assets/img/" + $rootScope.loginResp.userLogo);
				
			}
            
			StorageService.putDatavalue("U_ID", $rootScope.loginResp.user_id);
			StorageService.putDatavalue("firstname", $rootScope.loginResp.firstname);
			StorageService.putDatavalue("lastname", $rootScope.loginResp.lastname);
			StorageService.putDatavalue("email", $rootScope.loginResp.email);
			StorageService.putDatavalue("phone", $rootScope.loginResp.phone);
			StorageService.putDatavalue("role", $rootScope.loginResp.role);
			StorageService.putDatavalue("Lang", $rootScope.currentLanguage);
			StorageService.putDatavalue("LogEmail", $rootScope.loginResp.LogEmail);
			StorageService.putDatavalue("viewmode", $rootScope.loginResp.viewmode);
			StorageService.putDatavalue("isLoggedIn", "true")
			StorageService.putDatavalue("owner_id", $rootScope.loginResp.owner_id)
		

            $rootScope.details_get = $scope.result;
            
			if ($rootScope.details_get) {

				if ($rootScope.details_get.password) delete ($rootScope.details_get.password);
				if ($rootScope.details_get.passwordencrypt) delete ($rootScope.details_get.passwordencrypt);

			}

			$rootScope.logdata = {

				"firstname": $rootScope.loginResp.firstname,
				"lastname": $rootScope.loginResp.firstname,
				"email": $rootScope.loginResp.email,
				"phone": $rootScope.loginResp.phone,
				"role": $rootScope.loginResp.role,
				"isLoggedIn": "true",
				"owner_id": $rootScope.loginResp.owner_id,
				"viewmode": $rootScope.loginResp.viewmode
			}			

			if ($scope.result.email == "3dezmonitoring@gmail.com" && $rootScope.logdata.isLoggedIn == "true") {
				$location.path('/admin');
			} else if($scope.result.isLoggedIn == "true"){
				$location.path('/hitachihome');
			}

		}, function myError(response) {
			$scope.invalid_ceiteria = true;
		});
	}
});