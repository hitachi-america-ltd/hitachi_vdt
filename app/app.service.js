app.service('ProjectService',function($q,$http, configFactory) {
	    
		
		var url = configFactory.strings.api+'projects/';
		var loadedProjects = [];
		var project = {
			uniqID       		: '' ,
			user_id      		: '' ,			
			projectName  		: '' ,		
			datas        		: {} ,			
			cppf         		: '' ,			
			data         		: {} ,			
			focallength  		: '' ,		
			result_aov   		: '' ,	
			distance     		: '' ,		
			width        		: '' ,			
			cameraheight 		: '' ,	
			sceneheight  		: '' ,		
			Tilt         		: '' ,
			unit		 		: '' ,
			Imager_Size_orginal : '' ,
			image_sizer 		: '' ,
			image_sizer_span 	: '' ,
			buttonname			: '' ,
			color	            : '' ,
			title	            : '' ,
			last_location		: '' ,
            /*MODIFIED TO INCLUDE CAMERA ICON START*/
			imageurl			: '' ,
			camBadgeText		: ''
            /*MODIFIED TO INCLUDE CAMERA ICON END*/
		};
		
        project.getAll = function(U_ID){
			var d = $q.defer();
			$http.get(url + U_ID).success(function(data,status){
				loadedProjects = data;
				return d.resolve(data);
			}).error(function(data){
				return d.reject(data);
			});
		    return d.promise;	
		}  	

		project.getIdOfTitle = function(project_title){
			var proj_count = loadedProjects.length;
			for(var k=0;k<proj_count;k++)
            {
            	if(loadedProjects[k].title == project_title)
            		return k;
            }
            return false;
		}
		
		project.openSelected = function(index){
			this.uniqID       = loadedProjects[index]._id ;
			this.user_id      = loadedProjects[index]._id ;		
			this.projectName  = loadedProjects[index].title ;	
			this.last_location  = loadedProjects[index].last_location ;	
			if(typeof(loadedProjects[index].cameras) != 'undefined')
			{	
				//this.datas        		 = {selectedresolutions : loadedProjects[index].cameras.camera0.resolution};			
				//this.data         		 = {selectedOption : loadedProjects[index].cameras.camera0.imager_size};
				this.datas        		 = loadedProjects[index].cameras.camera0.datas;
				this.data        		 = loadedProjects[index].cameras.camera0.data;

				this.cppf         		 = loadedProjects[index].cameras.camera0.ppf;							
				this.focallength  		 = loadedProjects[index].cameras.camera0.focal_length; 
				this.result_aov   		 = loadedProjects[index].cameras.camera0.aov;	
				this.distance     		 = loadedProjects[index].cameras.camera0.distance;		
				this.width        		 = loadedProjects[index].cameras.camera0.width;		
				this.cameraheight 		 = loadedProjects[index].cameras.camera0.camera_height;	
				this.sceneheight  		 = loadedProjects[index].cameras.camera0.scene_height;		
				this.Tilt         		 = loadedProjects[index].cameras.camera0.tilt;
				this.unit		  		 = loadedProjects[index].cameras.camera0.unit;
				this.Imager_Size_orginal = loadedProjects[index].cameras.camera0.Imager_Size_orginal;
				this.image_sizer 		 = loadedProjects[index].cameras.camera0.image_sizer;
				this.image_sizer_span 	 = loadedProjects[index].cameras.camera0.image_sizer_span;
				this.buttonname			 = loadedProjects[index].cameras.camera0.buttonname;
				this.color			     = loadedProjects[index].cameras.camera0.color;
				this.title			     = loadedProjects[index].cameras.camera0.title;
                /*MODIFIED TO INCLUDE CAMERA ICON START*/
				this.imageurl			 = loadedProjects[index].cameras.camera0.imageurl;
				this.camBadgeText		 = loadedProjects[index].cameras.camera0.camBadgeText;
                /*MODIFIED TO INCLUDE CAMERA ICON START*/

			}
			else
			{
				//this.datas        = {selectedresolutions : loadedProjects[index].default.resolution};		
				//this.data         = {selectedOption : loadedProjects[index].default.imager_size};
				this.datas        = loadedProjects[index].default.datas;
				this.data         = loadedProjects[index].default.data;

				this.cppf         = loadedProjects[index].default.ppf;							
				this.focallength  = loadedProjects[index].default.focal_length; 
				this.result_aov   = loadedProjects[index].default.aov;	
				this.distance     = loadedProjects[index].default.distance;
				this.width        = loadedProjects[index].default.width;
				this.cameraheight = loadedProjects[index].default.camera_height;	
				this.sceneheight  = loadedProjects[index].default.scene_height;		
				this.Tilt         = loadedProjects[index].default.tilt;
				this.unit		  = loadedProjects[index].default.unit;
				this.Imager_Size_orginal = "Imager_Size";
                this.image_sizer = false;
                this.image_sizer_span = true;
                this.buttonname	 = "Add Camera";
			}
		}

		project.deleteSelected = function(index){

			id = loadedProjects[index]._id;
			$http.delete(url + id).then(function(response)
				{

				});
		}
		
		project.saveSelected = function(userID,data){
				$http.put(url + userID, data).then(function(response)
				{

				});
		}

		project.saveNewProject = function(data){

			var d = $q.defer();
			$http.post(url, data).success(function(response,status){
					return d.resolve(response._id);
				}).error(function(data){
					return d.reject(data);
				});
		}
		
return project;	
});

app.service( 'LoggerService', function( $rootScope, $window ){

    var scope = this;

    this.sendLogs = function( userId, activities, apiUrl ){

        function updateProgress( oEvent ) {

            if ( oEvent.lengthComputable ){
                
                //var percentComplete = ( oEvent.loaded / oEvent.total * 100 ).toFixed( 1 );
                //console.log( percentComplete );
                
            }
            else{

                // Unable to compute progress information since the total size is unknown

            }

        }

        function loadEnd( e ){

            //console.log( "The transfer finished (although we don't know if it succeeded or not)." );
        }

        var updateUploadProgress = function( event ){

            //upldProgress = Math.round( ( event.loaded / event.total ) * 100, 2);
            //console.log( upldProgress );

        }

        var transferFailed = function( evt ){
            
            console.log( "Logging failed : " + evt );
        
        }
          
        var transferCanceled = function( evt ){
            
            //console.log( "The transfer has been canceled by the user." );

        }

        var readyStateChange = function(  ){

            if ( this.readyState === 4 ) {
			  
                if( this.status == 200 ){

                    //console.log( this.response );

                }
                else{

                    //console.log( { status : this.status, message: this.statusText } );

                }
            
            }

        }

        var oReq = new XMLHttpRequest();
        oReq.addEventListener("progress", updateProgress);
        oReq.upload.addEventListener("progress", updateUploadProgress);
        //req.addEventListener("loadend", loadEnd);
        oReq.addEventListener("error", transferFailed);
        oReq.addEventListener("abort", transferCanceled);
        oReq.addEventListener("readystatechange", readyStateChange);
        
        var reqData = new FormData();
        reqData.append( 'data', JSON.stringify( { "userId" : userId, "activities": activities } ) );

        oReq.responseType = "json";
        oReq.open( "POST", apiUrl );

        oReq.send( reqData );

    }

} );

app.service('StorageService',function($rootScope,$q,$window){

    this.putDatavalue = function(key,value){
        $window.localStorage.setItem(key,value);
    };

    this.getDatavalue = function(key){
        var value = $window.localStorage.getItem(key);
        return value;
    };

});

app.service('modelService', function($q, $http) {
    var images;
    var objLoader;
	var fovd;
    var stats;
    var camera, controls, scene, renderer;
    var mouseX = 0,
        mouseY = 0;
    var hitachi3d = true;

    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;
    var renderer;

    /*********Modified for camera texture***********/
    var activeCamera; 
    /*********Modified for camera texture***********/
    this. fov_set = function(fovf){
      fovd=fovf;
      camera.fov=fovd;
       camera.updateProjectionMatrix();
           
    }
    this.detectWebgl = function() {
        if (Detector.webgl)
            return {
                "result": "message",
                "webGL": true
            };
        else {
            var warning = Detector.getWebGLErrorMessage();
            return {
                "result": warning,
                "webGL": false
            }

        }

    }

    this.setFOV = function(fov) {
		camera.fov = fov;
        camera.updateProjectionMatrix();
    }
	/*  Start this is for load preloaded function*/
	this.initdemo = function(model3d) {
	  removeScene(scene);
		console.log(model3d);
		//model3d = 'http://192.168.11.247:8000/output/StarWarsJuggeren.zip1493370579503/model.json';
		//model3d = 'resp.json';
		
        $("#3dprogress").css("background-color", "red");
        camera = new THREE.PerspectiveCamera(fovd, window.innerWidth / window.innerHeight, 2, 1000);
        camera.position.y -= 190;     
        scene = new THREE.Scene();
        var ambient = new THREE.AmbientLight(0x404040, 3);
        scene.add(ambient);
        var directionalLight = new THREE.DirectionalLight(0xffeedd);
        directionalLight.position.set(0, 0, 1).normalize();
        scene.add(directionalLight);
		
		 var containerexists = document.getElementById( 'canvasobject' );
         if (containerexists) {    
            containerexists.parentNode.removeChild(containerexists);
         }
		
        var onProgress = function(xhr) { 
            if (xhr.lengthComputable) {
			
				$(".overlay").hide();
                $("#3dprogress").css("background-color", "red");
                var percentComplete = xhr.loaded / xhr.total * 100;
                $("#3dprogress").html("Loading " + Math.round(percentComplete, 2) + '%');
                if (Math.round(percentComplete, 2) == 100) {
                    $("#3dprogress").css("background-color", "white");
                }
            }
			//console.log( scene);
        };

        var onError = function(xhr) {};
		var json_loader = new THREE.AssimpJSONLoader();
		//json_loader.load( model3d, function ( object ) { 
		json_loader.load( model3d, function ( object ) { 
                scene.add( object );

        }, onProgress, onError );

        
         
         var maindiv = document.getElementById('3dview');
        container = document.createElement( 'div' );
        container.id = "canvasobject";
        console.log(container);
        maindiv.appendChild( container );

        // renderer
        renderer = new THREE.WebGLRenderer();
        renderer.setSize(800,550);
        container.appendChild( renderer.domElement);
         window.addEventListener('resize', onWindowResize, false);
         controls = new THREE.OrbitControls( camera, container);
         controls.addEventListener( 'change', render );
       
        return renderer;

    }

	
	/*  End this is for load preloaded function*/
    var removeScene=function(scene)
	{ 
		if(scene!=null && typeof scene!="undefined" ){
		console.log("scene poyi");
			for( var i = scene.children.length - 1; i >= 0; i--) { 
				obj = scene.children[i];
				scene.remove(obj);
		 }
		}
	}
    this.init = function(model3d) {
	    removeScene(scene);
        $("#3dprogress").css("background-color", "red");
        model3d.obj = model3d.obj ? model3d.obj : 'bbd3874250e2414aaa6a4c84c8a21656.obj';
        model3d.mtl = model3d.mtl ? model3d.mtl : 'bbd3874250e2414aaa6a4c84c8a21656.mtl';
        model3d.path = model3d.path ? model3d.path : 'http://tvm2.pivotsys.com/hitachi/assets/3d/'
         camera = new THREE.PerspectiveCamera(fovd, window.innerWidth / window.innerHeight, 2, 1000);
        camera.position.y -= 190;
              
        scene = new THREE.Scene();
		 
        var ambient = new THREE.AmbientLight(0x404040, 3);
        scene.add(ambient);
        var directionalLight = new THREE.DirectionalLight(0xffeedd);
        directionalLight.position.set(0, 0, 1).normalize();
        scene.add(directionalLight);
		
		         var containerexists = document.getElementById( 'canvasobject' );
         if (containerexists) {    
            containerexists.parentNode.removeChild(containerexists);
         }
         
		
        var onProgress = function(xhr) {
            
            if (xhr.lengthComputable) {
			
			$(".overlay").hide();
                $("#3dprogress").css("background-color", "red");
                var percentComplete = xhr.loaded / xhr.total * 100;
                $("#3dprogress").html("Loading " + Math.round(percentComplete, 2) + '%');
                if (Math.round(percentComplete, 2) == 100) {
                    $("#3dprogress").css("background-color", "white");
                }
            }
			//console.log( scene);
        };
  
        var onError = function(xhr) {};

        THREE.Loader.Handlers.add(/\.dds$/i, new THREE.DDSLoader());
        var mtlLoader = new THREE.MTLLoader();
        mtlLoader.crossOrigin = '';
        mtlLoader.setPath(model3d.path);
        mtlLoader.load(model3d.mtl, function(materials) {

            materials.preload();
           // var container = document.createElement( '3dvdiew' );
             //        document.body.appendChild( container );
             objLoader=null;
            objLoader = new THREE.OBJLoader();
            objLoader.crossOrigin = '';
            objLoader.setMaterials(materials);
            objLoader.setPath(model3d.path);
            objLoader.load(model3d.obj, function(object) { 
                images=object;
                object.scale.set(3, 3, 3);
                scene.add(object);
            }, onProgress, onError);
        
        });


         var maindiv = document.getElementById('3dview');
        container = document.createElement( 'div' );
        container.id = "canvasobject";
        console.log(container);
        maindiv.appendChild( container );

        // renderer
        renderer = new THREE.WebGLRenderer();
        renderer.setSize(800,550);
        container.appendChild( renderer.domElement);


         window.addEventListener('resize', onWindowResize, false);
         controls = new THREE.OrbitControls( camera, container);
         controls.addEventListener( 'change', render );
        //event.stopPropagation();
        return renderer;

    }

    this.callAnimate = function() {
        animate();
    }

    function onWindowResize() {
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
		//controls.handleResize();

        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function onDocumentMouseMove(event) {
        mouseX = (event.clientX - windowHalfX) / 2;
        mouseY = (event.clientY - windowHalfY) / 2;
    }


    animate = function() {
        requestAnimationFrame(animate);
        controls.update();
        render();
    }

    function render() {
        camera.lookAt(scene.position);
        renderer.render(scene, camera);
    }

});
