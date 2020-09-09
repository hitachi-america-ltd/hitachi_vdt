	app.controller('ptrl', function($scope,$http,$location,$rootScope,StorageService ,$translate){
		
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

		$scope.pay=function(){    
			$rootScope.plan=10;
			StorageService.putDatavalue("U_ID", $rootScope.details_get._id);
			StorageService.putDatavalue("firstname", $rootScope.logdata.firstname);
			StorageService.putDatavalue("lastname", $rootScope.logdata.lastname);
			StorageService.putDatavalue("email", $rootScope.logdata.email);
			StorageService.putDatavalue("phone", $rootScope.logdata.phone);
			StorageService.putDatavalue("role", $rootScope.logdata.role);
			
			$location.path('/hitachihome')
		}	
		
	});