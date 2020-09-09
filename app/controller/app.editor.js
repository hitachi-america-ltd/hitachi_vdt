app.controller('editorControl', function($scope,$http,$location,$rootScope,StorageService,configFactory,$translate){

    $scope.editorapi = editor.api
    $scope.modelPath = editor.modelPath
    $scope.owner_id = localStorage.getItem("U_ID")
	if(StorageService.getDatavalue('Lang') == undefined  || StorageService.getDatavalue('Lang') == null ){

        $rootScope.currentLanguage = "en";
        $translate.use("en"); 
    }
    else{
        $translate.use(StorageService.getDatavalue('Lang'));
    }
    
    var editorScope = $scope;
    $scope.getUserData = () => {
        $.ajax({
            url: editor.api + 'viewmode/user/' + localStorage.getItem('U_ID'),
            type: 'GET',
            dataType: 'json',
            success: function(response) {
                $scope.getUsers = response;
            },
            error: function(jqxhr, status, msg) {  
                toastr.error("Upload Failed Try Again !!");
            }
        });  
    }
    $scope.getUserData();

    $scope.checkAccess = elem => {
        if(elem.data.info.user_id == editorScope.owner_id){
            return elem;
        }    
    }    

    $scope.getUrlList = () => {
        
        $.ajax({
            url: editor.api + 'viewmode/',
            type: 'GET',
            headers:{
                "secretkey": "hitachi3dez",
                "accesskey": "3dezmonitoring@gmail.com"
            },
            success: function(data) {
                $scope.getUrl = data.filter($scope.checkAccess)               
            },
            error: function(jqxhr, status, msg) {  
                toastr.error("Failed to load URL List !!");
            }
        }); 
    }
    
    $scope.getUrlList();
    


    $scope.deleteUser = index => {
        $.ajax({
            type: 'delete',
            url: editor.api + 'viewmode/'+ $scope.getUsers[index]._id,
            success: function(response){},
            error: function(status)
            {
                editorScope.getUserData();
                toastr.info(editor.languageData.Pleaseclicktherefreshbutton);
            }
        });
    };	

    $scope.copyToClipboard = function(urlId){

        var valueToCopy = document.getElementById( urlId );
        var a = document.createElement('input')
        a.setAttribute('type', 'text')
        a.value = valueToCopy.innerText
        document.body.appendChild(a)
        a.select()
        document.execCommand( 'Copy' );
        document.body.removeChild(a)
		toastr.info( editor.languageData.Copiedtoclipboard );
    }

    $scope.deleteUrl = index => {

        $.ajax({
            type: 'DELETE',
            url: editor.api + 'viewmode/url/'+ index,
            success: function(response){
                
            },
            error: function(status)
            {
                editorScope.getUrlList();
                toastr.info("Please click the refresh button");
               
            }
        });
    };	
});