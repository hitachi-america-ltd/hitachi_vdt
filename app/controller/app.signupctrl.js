
	app.controller('signupctrl', function($scope,$http,$location,$rootScope,configFactory,$translate){
		 $scope.email_span=false;
		 $rootScope.logdata=null;
		 $scope.number_up=false;
		  $scope.name_un=false;
		 $scope.span_conform=false;

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

		 $scope.sent=function(){

		 		$http({
					method : "POST",
					url : configFactory.strings.api+"signup",
					data:$rootScope.logdata
				})
				.then(function mySucces(response) {

					$scope.result = response.data;
					$rootScope.details_get = $scope.result;

					if($scope.result.status==0){
						//alert($scope.result.status);
						$rootScope.invalidemails=true;
						$location.path('/signup');
					}
					else{
						$location.path('/signupplan');
						$rootScope.invalidemails=false;
					}
				
				}, function myError(status){
					alert("error in api");
				});


		 };
			$scope.signup_fun=function(){
			
				$scope.email_span=false;
		        $scope.number_up=false;
		        $scope.name_un=false;
				var first_name=$scope.firstname;
				var last_name=$scope.lastname;
				var email_up=$scope.emailup;
				var Mobile_up= $scope.Mobileup;
				var password_up=$scope.passwordup;
				var confirm=$scope.c_passwordup;
				const  FREE = 0;
				const  BASIC = 1;
				const PROFESS = 2;
				if(confirm== password_up)
					{
						if($rootScope.plan==FREE||$rootScope.plan==BASIC|| $rootScope.plan==PROFESS)
						{
							$rootScope.logdata={
								"firstname" : $scope.firstname,
								"lastname" : $scope.lastname,
								"email" : $scope.emailup,
								"phone" : $scope.Mobileup,
								"password" :$scope.passwordup,
								"role" : $rootScope.plan
							}
							$scope.sent();
							$location.path('/pay');
						}
						else{

							$rootScope.logdata={
										 "firstname" : $scope.firstname,
										 "lastname" : $scope.lastname,
										 "email" : $scope.emailup,
										 "phone" : $scope.Mobileup,
										 "password" :$scope.passwordup,
										 "role" : 0
									}
									$scope.sent();
									//$location.path('/signupplan');
						}
				       
					}
					else{

						$scope.span_conform=true;
					}

		}
	});