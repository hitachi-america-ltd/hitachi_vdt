/**
 * Menubar.Add( editor ) : Constructor for adding add options in the menubar
 * @constructor
 * @param {any} editor - The instance of the Editor which manages the overall objects and signals
 * @returns {Object<UI.Panel>}
 * @author Mavelil
 * @example <caption>Example usage of Menubar.Add</caption>
 * var menubarAdd = new Menubar.Add( editor );
 */
Menubar.Add = function(editor) {

    var container = new UI.Panel();
    container.setClass('menu');
    var title = new UI.Panel();
    title.setClass('title');
    title.setId('add_editor');
    title.setTextContent(editor.languageData.Add);
    container.add(title);
    var options = new UI.Panel();
    options.setClass('options');
    container.add(options);
    /**Add camera to the Editor */
    
    var preloadModels = new PreloadModel(editor);
    var meshCount = 0;
    var lightCount = 0;
    var camera3d;
	
    //Camera category start
    var cameras = new UI.Row();
    cameras.setClass('option');

    var camerasLblAndIcon = document.createElement( 'div' );
    camerasLblAndIcon.setAttribute( 'id', 'menubar-camera-lbl-ico' );
    camerasLblAndIcon.setAttribute( 'class', 'submenu-label-icon' );
    camerasLblAndIcon.innerHTML = editor.languageData.Cameras+'<span class="fa fa-chevron-right pull-right"></span>';
    cameras.dom.appendChild( camerasLblAndIcon );

    var cameraMenu = new Menubar.Add.Camera( editor );
    cameras.add( cameraMenu );
    options.add(cameras);
    cameras.onClick( function(){

        var camerasSubmenu = document.getElementById( 'menubar-cameras-list' );
        
        //Toggle the display property of sensorsSubmenu between 'none' and 'block'
        if( camerasSubmenu.style.display == 'none' ){
            var sensorsSubmenu = document.getElementById( 'menubar-sensors-list' );
            if( sensorsSubmenu != undefined && sensorsSubmenu.style.display == 'block' ){
                sensorsSubmenu.style.display = 'none';
                var snsrsLblAndIcon = document.getElementById('menubar-sensor-lbl-ico');
                snsrsLblAndIcon.innerHTML = editor.languageData.Sensors+'<span class="fa fa-chevron-right pull-right"></span>';

            }
            var luggageSubmenu = document.getElementById( 'menubar-luggage-list' );

            if( luggageSubmenu != undefined && luggageSubmenu.style.display == 'block' ){
                luggageSubmenu.style.display = 'none';
                var luggageLblAndIcon = document.getElementById( 'menubar-luggage-lbl-ico' );
                luggageLblAndIcon.innerHTML = editor.languageData.Luggage+'<span class="fa fa-chevron-right pull-right"></span>';
            }

            camerasSubmenu.style.display = 'block';
            camerasLblAndIcon.innerHTML = editor.languageData.Cameras+'<span class="fa fa-chevron-left pull-right"></span>';

        }
        else{
            camerasSubmenu.style.display = 'none';
            camerasLblAndIcon.innerHTML = editor.languageData.Cameras+'<span class="fa fa-chevron-right pull-right"></span>';

        }

    } );
    
    //Camera category end

/*
    // PerspectiveCamera

    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent(editor.languageData.Camera);
    option.onClick(function() {

        camToEditor.addPerspectiveCamera();

    });
    options.add(option);

    //Modified to add an option for 3D Dome camera start
    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent( "3D Dome Camera" );
    option.onClick( function() {

        editor.deselect();
        var texLoader = new THREE.TextureLoader();
        
        var wwObjLoader2 = new THREE.OBJLoader2.WWOBJLoader2();
        wwObjLoader2.setCrossOrigin( 'anonymous' );
        var Validator = THREE.OBJLoader2.prototype._getValidator();
        var prepData, objectGroup;

        if( editor.domCameraModel ){

            camToEditor.addPerspectiveCamera();
            var newCam = editor.selected;
            newCam.name = "Dome3D";
            newCam.camCategory = "Dome3D";
            var camIconModel = editor.domCameraModel.clone();
            editor.execute( new AddObjectCommand( camIconModel ) );
            editor.execute( new MoveObjectCommand( camIconModel, newCam ) );
            editor.select( newCam );
            //newCam.add( camIconModel );
            newCam.rotation.set( -90.0 * ( Math.PI / 180 ), 0, 0 );
            camIconModel.rotation.set( 90.0 * ( Math.PI / 180 ), 0, 0 );
            newCam.getObjectByName( "cameraHelperIcon" ).visible = false;
            camIconModel.position.copy( newCam.position.clone() );
            editor.signals.sceneGraphChanged.dispatch();

        }
        else{

            texLoader.load(

                'assets/editorresources/DomeCamera/DomeCamera.png',
                
                function( texture ) {

                    var reportProgress = function( content ) {

                        var response = content;
                        var splittedResp = response.split(":");
                        var respMessage = splittedResp[0];
                        if (respMessage.indexOf("Download of") !== -1) {
            
                            var actualProgress = Number((splittedResp[splittedResp.length - 1].trim()).slice(0, -1));
                            var evalProgress = (actualProgress * 0.8) / 100;
                            editor.progressBar.updateProgress(editor.languageData.DownloadingFiles, evalProgress);
                            //editor.progressBar.show();
            
                        }
                    };
            
                    var materialsLoaded = function( materials ) {
            
                        var count = Validator.isValid(materials) ? materials.length : 0;
                        //console.log('Loaded #' + count + ' materials.');
                        //console.log( materials );
            
                    };
            
                    var meshLoaded = function(name, bufferGeometry, material) {
            
                        //console.log('Loaded mesh: ' + name + ' Material name: ' + material.name);
            
                    };
            
                    var errorLoading = function() {
            
                        console.log("Error while loading");
                        editor.progressBar.hide();
            
                    };
            
                    var completedLoading = function(first, second, third) {
            
                        try{

                            var count = Math.abs((1.0 - 0.8) / 0.01);
                            var progressVal = 0.80;
                
                            //console.log('Loading complete!');
                            editor.progressBar.updateProgress(editor.languageData.DownloadingFiles, 1 );
                            objectGroup.scale.set( 0.5, 0.5, 0.5 );
                            //editor.execute( new AddObjectCommand( objectGroup ) );
                            objectGroup.traverse( function( subChild ){

                                if(  subChild.name === "CamBody" && subChild.material ){

                                    subChild.material.map = texture;
                                    subChild.material.needsUpdate = true;

                                }

                            } );

                            camToEditor.addPerspectiveCamera();
                            var newCam = editor.selected;
                            newCam.name = "Dome3D";
                            newCam.camCategory = "Dome3D";
                            editor.execute( new AddObjectCommand( objectGroup ) );
                            editor.execute( new MoveObjectCommand( objectGroup, newCam ) );
                            editor.select( newCam );
                            //newCam.add( objectGroup );
                            newCam.rotation.set( -90.0 * ( Math.PI / 180 ), 0, 0 );
                            objectGroup.rotation.set( 90.0 * ( Math.PI / 180 ), 0, 0 );
                            newCam.getObjectByName( "cameraHelperIcon" ).visible = false;
                            objectGroup.position.copy( newCam.position.clone() );
                            editor.signals.sceneGraphChanged.dispatch();
                            editor.domCameraModel = objectGroup;
                            editor.progressBar.hide();

                        }
                        catch( exception ){

                            console.log( exception );
                            editor.progressBar.hide();

                        }
            
                    };

                    wwObjLoader2.registerCallbackProgress(reportProgress);
                    wwObjLoader2.registerCallbackCompletedLoading(completedLoading);
                    wwObjLoader2.registerCallbackMaterialsLoaded(materialsLoaded);
                    wwObjLoader2.registerCallbackMeshLoaded(meshLoaded);
                    wwObjLoader2.registerCallbackErrorWhileLoading(errorLoading);
                    prepData = new THREE.OBJLoader2.WWOBJLoader2.PrepDataFile( '3DDomeCamera', 'assets/editorresources/DomeCamera/', 'DomeCamera.obj' );
                    objectGroup = new THREE.Group();
                    objectGroup.name = '3DDomeCamera';
                    prepData.setSceneGraphBaseNode( objectGroup );
                    prepData.setStreamMeshes( true );
                    wwObjLoader2.setDebug( false );
                    wwObjLoader2.prepareRun( prepData );
                    
                    editor.progressBar.updateProgress( "Preparing", 0.0 );
                    editor.progressBar.show();

                    wwObjLoader2.run();
                    
                },

                undefined,

                function ( err ) {
                    
                    console.error( 'An error happened.' );
                    console.error( err );
                    editor.progressBar.hide();
                    
                }
                
            );

        }

    } );
    options.add( option );
    //Modified to add an option for 3D Dome camera end
 */
/*
    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent(editor.languageData.SelectCamera);
    option.onClick(function() {

        updateCamera.selectCameraDomChange();
        modalcamera.show();

    });
    options.add(option);
    //
    */
    // Add new Camera Data//
/*
    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent(editor.languageData.AddNewSpec);
    option.onClick(function() {

		updateCamera.addNewSpecDomAction();
		addspecModal.show();
		
    });
    options.add(option);
    // End Add new Camera //

    // Edit camera Spec Start

    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent(editor.languageData.ChangeSpec);
    option.onClick(function() {

		var uid = localStorage.getItem('U_ID');
		updateCamera.changeSpecDomAction();
		modalcamera.show();
        var Editbutton = document.getElementById('EditCameraBtn');
        Editbutton.onclick = function() {
			editor.select(null);
			updateCamera.editButtonCameraDomAction()
			var cameraObject = Selectcamera.getcameraDetails();
            editCamData = new EditCameraDetails({
                'camdata': cameraObject.fullcamData,
                "model": addspecModal
            });
            editCamData.setallDAta();
            return false;
        }

    });
    options.add(option);

    // Edit camera spec End

    // Add camera Generating
    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent(editor.languageData.MarkCameraPosition);
    option.setId('cameraGenerationPoints')
    option.onClick(function() {

        if (editor.liveTwodViewFlag) {
            toastr.warning(editor.languageData.Exitfromtheliveviewandtryagain);
            return;
        }

        var inneraText = document.getElementById('cameraGenerationPoints').innerText;
        if ( editor.generateCameraFlag == 0 ) {
            if(editor.referencePointFlag){
                toastr.error(editor.languageData.Firstchoosethereferencepositionthentrythis)
            }
            else{

                editor.cameraGeneratingPosition = [];
                toastr.info(editor.languageData.DoubleClickonthe3Dobjectwhereyouwanttoplacethecamera)
                editor.cameraGeneratingFlag = true;
                editor.generateCameraFlag = 1;
                document.getElementById('cameraGenerationPoints').innerText = editor.languageData.StopGenerateCamera
            }

        } 
        else {

            editor.cameraGeneratingFlag = false;
            if(editor.cameraGeneratingPosition.length ==1){

                editor.execute(new RemoveObjectCommand(editor.cameraGeneratingPosition[0]));
                editor.execute(new RemoveObjectCommand(editor.cameraGenerateLine.line));
                editor.setCamera = 0;
                editor.setCameraRotation = 1;
                editor.targetLocked = !editor.targetLocked;

            }
            editor.generateCameraFlag = 0;
            document.getElementById('cameraGenerationPoints').innerText = editor.languageData.MarkCameraPosition;

        }

        // option.setTextContent('Stop');	
    });
    options.add(option);
    // End Add new Camera //
    //Add camera Generating End
    */
    options.add(new UI.HorizontalRule());
    
    //Sensor category start
    var sensors = new UI.Row();
    sensors.setClass('option');
    //sensors.setTextContent('Sensors');
    //sensors.dom.innerHTML = '<div>Sensors<span class="fa fa-chevron-right pull-right"></span></div>';

    var snsrsLblAndIcon = document.createElement( 'div' );
    snsrsLblAndIcon.setAttribute( 'id', 'menubar-sensor-lbl-ico' )
    snsrsLblAndIcon.setAttribute( 'class', 'submenu-label-icon' );
    snsrsLblAndIcon.innerHTML = editor.languageData.Sensors+'<span class="fa fa-chevron-right pull-right"></span>';
    sensors.dom.appendChild( snsrsLblAndIcon );

    var sensorMenu = new Menubar.Add.Sensors( editor );
    sensors.add( sensorMenu );
    options.add(sensors);
    sensors.onClick( function(){

        var sensorsSubmenu = document.getElementById( 'menubar-sensors-list' );
        //Toggle the display property of sensorsSubmenu between 'none' and 'block'
        if( sensorsSubmenu.style.display == 'none' ){
            var camerasSubmenu = document.getElementById( 'menubar-cameras-list' );
            if( camerasSubmenu != undefined && camerasSubmenu.style.display == 'block' ){
                camerasSubmenu.style.display = 'none';
                var camerasLblAndIcon = document.getElementById( 'menubar-camera-lbl-ico' );
                camerasLblAndIcon.innerHTML = editor.languageData.Cameras+'<span class="fa fa-chevron-right pull-right"></span>';

            }
            var luggageSubmenu = document.getElementById( 'menubar-luggage-list' );

            if( luggageSubmenu != undefined && luggageSubmenu.style.display == 'block' ){
                luggageSubmenu.style.display = 'none';
                var luggageLblAndIcon = document.getElementById( 'menubar-luggage-lbl-ico' );
                luggageLblAndIcon.innerHTML = editor.languageData.Luggage+'<span class="fa fa-chevron-right pull-right"></span>';
            }

            sensorsSubmenu.style.display = 'block';
            snsrsLblAndIcon.innerHTML = editor.languageData.Sensors+'<span class="fa fa-chevron-left pull-right"></span>';

        }
        else{

            sensorsSubmenu.style.display = 'none';
            snsrsLblAndIcon.innerHTML = editor.languageData.Sensors+'<span class="fa fa-chevron-right pull-right"></span>';

        }

    } );
    //Sensor category end

    options.add(new UI.HorizontalRule());

    //Preload

    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent(editor.languageData.PreloadedModels);
    option.onClick(function() {

        $('#pre_uploaded_models').modal({
            backdrop: 'static',
            keyboard: false
        });


    });
    options.add(option);

    // Person
    
    var option = new UI.Row();
    option.setClass('option');
    option.setId( 'add-person' )
    option.setTextContent(editor.languageData.Person);
    option.onClick(function(){

        var position = {x: 0,y: 0,z: 0};

        if( editor.scene.userData.personObjectCounter === undefined ){
            editor.scene.userData.personObjectCounter = 1;
        }

        if( editor.scene.userData.personDeletedNumber != undefined && editor.scene.userData.personDeletedNumber.deletedPersonArray.length > 0 ){
            var personName = "Person" + editor.personObjectDeletedNumber[0];
            editor.personObjectDeletedNumber.splice( 0, 1 );

        } else{
            var personName = "Person" + editor.scene.userData.personObjectCounter;
            editor.scene.userData.personObjectCounter++;
        }    
        
        function castShadow(){

            setTimeout( () => {
                var castShadowObject = editor.selected;
                if( castShadowObject && castShadowObject instanceof THREE.Group && castShadowObject.userData && castShadowObject.userData.modelType === 'not-a-base-model' ){
                    castShadowObject.children[0].castShadow = true;
                }
            }, 1500 );

        }

        async function loadModel(){
            
            preloadModels.personOrLuggage( position, personName, "person", { 'x': 1, 'y': 1, 'z': 1 } );
            await castShadow();
        }

        loadModel();

    });
    options.add(option);

    //Luggage

    
    //Luggage category start
    var luggages = new UI.Row();
    luggages.setClass('option');

    var luggageLabelIcon = document.createElement( 'div' );
    luggageLabelIcon.setAttribute( 'id', 'menubar-luggage-lbl-ico' );
    luggageLabelIcon.setAttribute( 'class', 'submenu-label-icon' );
    luggageLabelIcon.innerHTML = editor.languageData.Luggage+'<span class="fa fa-chevron-right pull-right"></span>';
    luggages.dom.appendChild( luggageLabelIcon );

    var luggageMenu = new Menubar.Add.Luggage( editor );
    luggages.add( luggageMenu );
    options.add(luggages);

    luggages.onClick( function(){

        var luggageSubmenu = document.getElementById( 'menubar-luggage-list' );
        
        if( luggageSubmenu.style.display == 'none' ){

            var sensorsSubmenu = document.getElementById( 'menubar-sensors-list' );
            
            if( sensorsSubmenu != undefined && sensorsSubmenu.style.display == 'block' ){
                sensorsSubmenu.style.display = 'none';
                var snsrsLblAndIcon = document.getElementById('menubar-sensor-lbl-ico');
                snsrsLblAndIcon.innerHTML = editor.languageData.Sensors+'<span class="fa fa-chevron-right pull-right"></span>';

            }
            var camerasSubMenu = document.getElementById( 'menubar-cameras-list' );
            
            if( camerasSubMenu != undefined && camerasSubMenu.style.display == 'block' ){
                camerasSubMenu.style.display = 'none';
                var camerasLblAndIcon = document.getElementById('menubar-camera-lbl-ico');
                camerasLblAndIcon.innerHTML = editor.languageData.Cameras+'<span class="fa fa-chevron-right pull-right"></span>'; 
            }
            luggageSubmenu.style.display = 'block';
            luggageLabelIcon.innerHTML = editor.languageData.Luggage+'<span class="fa fa-chevron-left pull-right"></span>';

        } else{

            luggageSubmenu.style.display = 'none';
            luggageLabelIcon.innerHTML = editor.languageData.Luggage+'<span class="fa fa-chevron-right pull-right"></span>';

        }

    } );
    // Plane

    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent(editor.languageData.Plane);
    option.onClick(function() {

        var geometry = new THREE.PlaneBufferGeometry(2, 2);
        var material = new THREE.MeshStandardMaterial();
        var mesh = new THREE.Mesh(geometry, material);
        mesh.name = 'Plane ' + (++meshCount);

        editor.execute(new AddObjectCommand(mesh));

    });
    options.add(option);

    // Box

    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent(editor.languageData.Box);
    option.onClick(function() {

        var geometry = new THREE.BoxBufferGeometry(1, 1, 1);
        var mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial());
        mesh.name = 'Box ' + (++meshCount);

        editor.execute(new AddObjectCommand(mesh));

    });
    options.add(option);

    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent(editor.languageData.Cylinder);
    option.onClick(function() {

        var radiusTop = 1;
        var radiusBottom = 1;
        var height = 2;
        var radiusSegments = 32;
        var heightSegments = 1;
        var openEnded = false;

        var geometry = new THREE.CylinderBufferGeometry(radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded);
        var mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial());
        mesh.name = 'Cylinder ' + (++meshCount);

        editor.execute(new AddObjectCommand(mesh));

    });
    options.add(option);

    // Sphere

    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent(editor.languageData.Sphere);
    option.onClick(function() {

        var radius = 1;
        var widthSegments = 32;
        var heightSegments = 16;
        var phiStart = 0;
        var phiLength = Math.PI * 2;
        var thetaStart = 0;
        var thetaLength = Math.PI;

        var geometry = new THREE.SphereBufferGeometry(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength);
        var mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial());
        mesh.name = 'Sphere ' + (++meshCount);

        editor.execute(new AddObjectCommand(mesh));

    });
    options.add(option);



    options.add(new UI.HorizontalRule());

    // PointLight

    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent(editor.languageData.PointLight);
    option.onClick(function() {

        var color = 0xffffff;
        var intensity = 1;
        var distance = 0;

        var light = new THREE.PointLight(color, intensity, distance);
        light.name = 'PointLight ' + (++lightCount);

        editor.execute(new AddObjectCommand(light));

    });
    options.add(option);

    // SpotLight

    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent(editor.languageData.SpotLight);
    option.onClick(function() {

        var color = 0xffffff;
        var intensity = 1;
        var distance = 0;
        var angle = Math.PI * 0.1;
        var penumbra = 0;

        var light = new THREE.SpotLight(color, intensity, distance, angle, penumbra);
        light.name = 'SpotLight ' + (++lightCount);
        light.target.name = 'SpotLight ' + (lightCount) + ' Target';

        light.position.set(5, 10, 7.5);

        editor.execute(new AddObjectCommand(light));

    });
    options.add(option);

    // DirectionalLight

    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent(editor.languageData.DirectionalLight);
    option.onClick(function() {

        var color = 0xffffff;
        var intensity = 1;

        var light = new THREE.DirectionalLight(color, intensity);
        light.name = 'DirectionalLight ' + (++lightCount);
        light.target.name = 'DirectionalLight ' + (lightCount) + ' Target';

        light.position.set(5, 10, 7.5);

        editor.execute(new AddObjectCommand(light));

    });
    options.add(option);

    // HemisphereLight

    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent(editor.languageData.HemisphereLight);
    option.onClick(function() {

        var skyColor = 0xffffff;
        var groundColor = 0xffffff;
        var intensity = 1;

        var light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
        light.name = 'HemisphereLight ' + (++lightCount);

        light.position.set(0, 1000, 0);

        editor.execute(new AddObjectCommand(light));

    });
    options.add(option);

    // AmbientLight

    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent( editor.languageData.AmbientLight);
    option.onClick(function() {

        var color = 0x222222;

        var light = new THREE.AmbientLight(color);
        light.name = 'AmbientLight ' + (++lightCount);

        editor.execute(new AddObjectCommand(light));

    });
    options.add(option);

    //

    options.add(new UI.HorizontalRule());


    // Group

    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent( editor.languageData.Group);
    option.onClick(function() {

        var mesh = new THREE.Group();
        mesh.name = 'Group ' + (++meshCount);

        editor.execute(new AddObjectCommand(mesh));

    });
    options.add(option);
    // preload seen city//
    var filename = '';
    /*$("#heartjson").click(function() {

        preloadModels.hitachiWarehouse();

        //Modified for activity logging start
        try{

            //Modified for activity logging start
            var logDatas = {};
            logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Attempting to add one of the preloaded models ";
            logger.addLog( logDatas );
            logger.sendLogs( localStorage.getItem( 'U_ID' ) );
            //Modified for activity logging end

        }
        catch( exception ){

            console.log( "Logging failed!" );
            console.log( exception );

        }
        //Modified for activity logging end

    });*/

    $("#office_preload").click(function() {

        preloadModels.office();

        //Modified for activity logging start
        try{

            //Modified for activity logging start
            var logDatas = {};
            logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Attempting to add one of the preloaded models ";
            logger.addLog( logDatas );
            logger.sendLogs( localStorage.getItem( 'U_ID' ) );
            //Modified for activity logging end

        }
        catch( exception ){

            console.log( "Logging failed!" );
            console.log( exception );

        }
        //Modified for activity logging end

    });
    /*$("#helicopterpreload").click(function() {

        preloadModels.hitachiSecondFloor();

        //Modified for activity logging start
        try{

            //Modified for activity logging start
            var logDatas = {};
            logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Attempting to add one of the preloaded models ";
            logger.addLog( logDatas );
            logger.sendLogs( localStorage.getItem( 'U_ID' ) );
            //Modified for activity logging end

        }
        catch( exception ){

            console.log( "Logging failed!" );
            console.log( exception );

        }
        //Modified for activity logging end

    });*/

    /*$("#hitachi_preload").click(function() {


        preloadModels.demothreeD();

        //Modified for activity logging start
        try{

            //Modified for activity logging start
            var logDatas = {};
            logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Attempting to add one of the preloaded models ";
            logger.addLog( logDatas );
            logger.sendLogs( localStorage.getItem( 'U_ID' ) );
            //Modified for activity logging end

        }
        catch( exception ){

            console.log( "Logging failed!" );
            console.log( exception );

        }
        //Modified for activity logging end

    });*/
    $("#hitachi-conference-room").click(function() {

        preloadModels.conferenceRoom();
    
        //Modified for activity logging start
        try{
    
            //Modified for activity logging start
            var logDatas = {};
            logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Attempting to add one of the preloaded models ";
            logger.addLog( logDatas );
            logger.sendLogs( localStorage.getItem( 'U_ID' ) );
            //Modified for activity logging end
    
        }
        catch( exception ){
    
            console.log( "Logging failed!" );
            console.log( exception );
    
        }
        //Modified for activity logging end
    
    });

    $("#hitachi-telecom-room").click(function() {

        preloadModels.telecomRoom();
    
        //Modified for activity logging start
        try{
    
            //Modified for activity logging start
            var logDatas = {};
            logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Attempting to add one of the preloaded models ";
            logger.addLog( logDatas );
            logger.sendLogs( localStorage.getItem( 'U_ID' ) );
            //Modified for activity logging end
    
        }
        catch( exception ){
    
            console.log( "Logging failed!" );
            console.log( exception );
    
        }
        //Modified for activity logging end
    
    });

    $("#hitachi-service-center").click(function() {

        preloadModels.serviceCenter();
    
        //Modified for activity logging start
        try{
    
            //Modified for activity logging start
            var logDatas = {};
            logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Attempting to add one of the preloaded models ";
            logger.addLog( logDatas );
            logger.sendLogs( localStorage.getItem( 'U_ID' ) );
            //Modified for activity logging end
    
        }
        catch( exception ){
    
            console.log( "Logging failed!" );
            console.log( exception );
    
        }
        //Modified for activity logging end
    
    });
	var count = 0;

	/* Default hemisphere light */
	
    var skyColor = 0xffffff;
    var groundColor = 0xffffff;
    var intensity = 1;
    light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    //light.name = 'HemisphereLight ' + (++lightCount);

    //
    ++lightCount;
    light.name = 'SceneHemisphereLight';
    //

    light.position.set(0, 1100, 0);
    editor.arraylight.push(light)
	editor.execute(new AddObjectCommand(light));
	
	/* Default hemisphere light */
	
	/*pivot element*/
	
    var geometry = new THREE.BoxBufferGeometry(0.5, 0.5, 0.5);
    var material = new THREE.MeshBasicMaterial({
        color: 0xffff00
    });
    editor.pivot = new THREE.Mesh(geometry, material);
    editor.pivot.name = 'EditorOrigin';
    editor.pivot.matrixAutoUpdate = false;
	editor.execute(new AddObjectCommand(editor.pivot));
	
	/*pivot element*/
	
    return container;

};