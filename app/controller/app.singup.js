	app.controller('singuppricingplanctrl', function($scope,$http,$location,$rootScope,configFactory,$translate){
		
		if($rootScope.currentLanguage == undefined){

			$rootScope.currentLanguage = "en";
			$translate.use("en"); 
		}
		else{
			$translate.use($rootScope.currentLanguage);
		}
		console.log($rootScope.currentLanguage);
		$scope.changeLanguage = function(lang){
			$translate.use(lang); 
			$rootScope.currentLanguage = lang;
		}

		$scope.singupfreeplan_fun=function(){
			 $rootScope.plan=0;
	         $rootScope.logdata.role=0;
	         $scope.send();
	         $location.path('/pay');

		}
		$scope.signupbasicplan_fun=function(){
			$rootScope.plan=1;
	        $rootScope.logdata.role=1;
	        $scope.send();
	        $location.path('/pay');
		}

		$scope.signupprofessionalplan_fun=function(){
			$rootScope.plan=2;
	        $rootScope.logdata.role=2;
	        $location.path('/pay');
            $scope.send();
		}
		$scope.send=function(){
			var id=$rootScope.details_get._id;
			$http({	
				method : "PUT",
				url : configFactory.strings.api+"signup/"+id,
				data:{"role":$rootScope.logdata.role}
			}).then(function mySucces(response) {
				$scope.result=response.data;
			}, function myError(status) {
				
			});
		}
	});