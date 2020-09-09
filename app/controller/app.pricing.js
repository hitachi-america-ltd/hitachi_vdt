app.controller('pricingplanctrl', function($scope,$http,$location,$rootScope,$translate){
		$rootScope.plan="asd";
		
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

		$scope.freeplan_fun=function(){
	         $rootScope.plan=0;
	        // $location.path('/signup'); 
	         $location.path('/login'); 

		}
		$scope.basicplan_fun=function(){
	         $rootScope.plan=1;
	        // $location.path('/signup'); 
	         $location.path('/login'); 

		}

		$scope.professionalplan_fun=function(){
	         $rootScope.plan=2;
	        // $location.path('/signup'); 
	         $location.path('/login'); 

		}
	
	
	});