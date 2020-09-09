app.controller('forgotChangePasswordCtrl', function($scope,$http,$location,$rootScope,StorageService,configFactory ,$translate){


		$scope.forgotChangeNewPassword = "";
		$scope.forgotChangeConfirmPassword = "";
		$scope.captcha = "JPDFspDha";
		$scope.txtCaptcha  = "" ;
	var lang = new language();
	var lngDatas = lang.lngdata;
	console.log( lang );
	if($rootScope.currentLanguage == undefined){

		$rootScope.currentLanguage = "en";
		$scope.languageData = lngDatas.en;
		$translate.use("en"); 
	}
	else{
		$translate.use( $rootScope.currentLanguage );
		//$scope.languageData = lang.$rootScope.currentLanguage;
		if( $rootScope.currentLanguage == "jp"){
			
			$scope.languageData = lngDatas.jp;
			//console.log( $scope.languageData ) ;
		}
		if( $rootScope.currentLanguage == "en"){

			$scope.languageData = lngDatas.en;
		}

	}
	
	$scope.changeLanguage = function(langData){
		$translate.use(langData); 
		$rootScope.currentLanguage = langData;
		//$scope.languageData = lang.langData;
		if( langData == "jp"){

			$scope.languageData = lngDatas.jp;
		}
		if( langData == "en"){

			$scope.languageData = lngDatas.en;
		}
	}
		$scope.Captcha = function(){
			var alpha = new Array('A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z');
            var i;
            for (i=0;i<6;i++){
                var a = alpha[Math.floor(Math.random() * alpha.length)];
                var b = alpha[Math.floor(Math.random() * alpha.length)];
                var c = alpha[Math.floor(Math.random() * alpha.length)];
                var d = alpha[Math.floor(Math.random() * alpha.length)];
                var e = alpha[Math.floor(Math.random() * alpha.length)];
                var f = alpha[Math.floor(Math.random() * alpha.length)];
                var g = alpha[Math.floor(Math.random() * alpha.length)];
               }
            var code = a + ' ' + b + ' ' + ' ' + c + ' ' + d + ' ' + e + ' '+ f + ' ' + g;
            $scope.captcha = code ;
            $scope.txtCaptcha  = "" ;
		}

		$scope.ValidCaptcha = function (){
			
            var string1 = removeSpaces($scope.captcha);
            var string2 = removeSpaces($scope.txtCaptcha);
            if (string1 == string2){
                
                $scope.changePassword();
            }
            else{ 
            	$scope.Captcha();
            	$scope.forgotChangeNewPassword = "";
				$scope.forgotChangeConfirmPassword = "";
            	toastr.warning($scope.languageData.Captchanotcorrect)       
               	return false;
            }
        }


		$scope.changePassword = function(){

			var currentUrl =  window.location.href;
			var splitCurrentPassword = currentUrl.split('/');
			var forgotToken = splitCurrentPassword.pop();
			var newPassword = $scope.forgotChangeNewPassword;
			var confirmPassword = $scope.forgotChangeConfirmPassword;
			if(newPassword === confirmPassword)
			{
				var changePasswordData= {'Token' : forgotToken , 'password': newPassword}
				$http({
		                 method : "POST",
		                 data:changePasswordData,
		                 url : configFactory.strings.api+"forgotChangePassword"

	                 }).then(function mySucces(response) {

	                        if(response.data.status == 200){


	                            toastr.success( $scope.languageData.NewpasswordisUpdated);
	                            $location.path('/login')
	                            
	                        }
	                        else if(response.data.status == 204 ){

	                            toastr.warning( $scope.languageData.Youaretryingwithaninvalidlink );
	                           
	                        }
	                        
	                    })
	                    .catch(function(error){

	                        console.log(error)
	                    });
			}
			else{

				toastr.warning($scope.languageData.passwordmismatch);
				$scope.forgotChangeConfirmPassword = "";
				$scope.Captcha();
			}

		}

		function removeSpaces(string){
            return string.split(' ').join('');
        }

        var formData = document.getElementById('resetPasswordForm');
		formData.addEventListener("keypress", function(e){
			var Keycode = e.keyCode || e.which;
			if( Keycode === 13 ) {
		   		 e.preventDefault();
				if($scope.forgotChangeNewPassword != "" &&$scope.forgotChangeConfirmPassword != "" && $scope.txtCaptcha  != "" ){

					$scope.$apply(function () {
			            $scope.ValidCaptcha();
			        });
				}
		  	}
		});
})