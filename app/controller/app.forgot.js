app.controller('forgotctrl', function($scope,$http,$location,$rootScope, configFactory,$translate){
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
			console.log( $scope.languageData ) ;
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
	

	$scope.forgot_fun=function(){
		/*api for send email*/
			if( $scope.confirmForgotEmail  == $scope.forgotemail  )
			{
				var currentUrl =  window.location.href;
				var emailforgot=$scope.forgotemail;  
				var emailData= {'email' : emailforgot, 'currentUrl' : currentUrl }
				toastr.info('Please wait !!');
				$http({
			         method : "POST",
			         data:emailData,
			         url : configFactory.strings.api+"forgotpassword"

		             }).then(function mySucces(response) {

		                if(response.data.status == 200){

							toastr.success($scope.languageData.AlinkissenttoyourEmail);
		                    $location.path('/login');
		                            
		                }
		                else if(response.data.status == 204 ){

		                	$scope.forgotemail = '';
				 			$scope.confirmForgotEmail = '';
		                    toastr.warning( "This  email is not registred yet !!! ");
		                           
		                }
		                        
		            })
		            .catch(function(error){

		                console.log(error)
		            });

			}
			else {
				 toastr.warning(' Mismatch in the email address !!');
				 $scope.forgotemail = '';
				 $scope.confirmForgotEmail = '';
			}
		}
	});