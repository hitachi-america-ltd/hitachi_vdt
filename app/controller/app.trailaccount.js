	app.controller('trailaccountCtrl', function($scope,$http,$location,$rootScope,configFactory,$translate){



		var lang = new language();
		var lngDatas = lang.lngdata;
		$scope.invalid_ceiteria=false;
		
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
		//console.log($rootScope.currentLanguage);
		$scope.changeLanguage = function(lang){
			$translate.use(lang); 
			$rootScope.currentLanguage = lang;
			if( lang == "jp"){

				$scope.languageData = lngDatas.jp;
			}
			if( lang == "en"){
	
				$scope.languageData = lngDatas.en;
			}
		}
		$scope.GetTrailAccountFun = function(){


			var trailAccountCritereia =
			 {
								
				"firstname" : 'Trail',
				"lastname" : 'user',
				"email" : $scope.trailAccountEmail,
				"phone" : "0000000000",
				"password" :"",
				"role" : 2
			}
			//console.log(trailAccountCritereia);

			$http({
					method : "POST",
					url : configFactory.strings.api+"trailsignUp",
					data: trailAccountCritereia
				}).then(function mySucces(response) {

					console.log( response );
					if(response.data.status == "usedEmail"){

						toastr.info($scope.languageData.Emailalreadyused)

					}
					else if (response.data.status == "Mailsends") {

						toastr.info($scope.languageData.mailWithpassword);
	                     $location.path('/login');

					}

				})
				.catch (function(error){
					console.log(error)
				})

		}
	})