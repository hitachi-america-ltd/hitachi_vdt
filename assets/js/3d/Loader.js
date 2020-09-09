/**
 * @author mrdoob / http://mrdoob.com/
 */

var Loader = function(editor) {
    var modelObj = {};
    var scope = this;
    var signals = editor.signals;
    var cameraArray = [];
    var cameraArrayrotation = [];

    this.texturePath = '';
    var degToEulerFactor = Math.PI / 180;

    /*MODIFIED FOR DROP BOX URL START*/
    this.loadFromUrl = function(fileUrl) {

        var reader = new FileReader();

        if (!window.Worker) {
            alert("Web Worker not supported in your browser");
            return;
        }

        var loadingManager = new THREE.LoadingManager();
        var objLoader = new THREE.OBJLoader(loadingManager);
        var mtlLoader = new THREE.MTLLoader(loadingManager);
        var json_loader = new THREE.AssimpJSONLoader(loadingManager);

        var wwObjLoader2 = new THREE.OBJLoader2.WWOBJLoader2();
        wwObjLoader2.setCrossOrigin('anonymous');

        var Validator = THREE.OBJLoader2.prototype._getValidator();
        var prepData, objectGroup, workerInput, objBuffer, mtlString;

        var reportProgress = function(content) {

            var response = content;
            var splittedResp = response.split(":");
            var respMessage = splittedResp[0];
            if (respMessage.indexOf("Download of") !== -1) {
                var actualProgress = Number((splittedResp[splittedResp.length - 1].trim()).slice(0, -1));
                /* evaluating current progress as the 80% of the original download progress to accommodate for the rest of the tasks(Mesh and material related tasks). Again dividing the value by 100 to pass it to the progress bar*/
                var evalProgress = (actualProgress * 0.8) / 100;
                editor.progressBar.updateProgress(editor.languageData.Downloading, evalProgress);
            }

        };

        var materialsLoaded = function(materials) {

            var count = Validator.isValid(materials) ? materials.length : 0;
            console.log('Loaded #' + count + ' materials.');

        };

        var meshLoaded = function(name, bufferGeometry, material) {

            console.log('Loaded mesh: ' + name + ' Material name: ' + material.name);

        };

        var errorLoading = function() {

            console.log("Error while loading");
            alert(editor.languageData.SorryanerroroccuredPleasetryaftersometime );
            editor.progressBar.hide();

            //Modified for activity logging start
            try{

                var logDatas = {};
                logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "Error parsing OBJ file from DropBox";
                logger.addLog( logDatas );
                logger.sendLogs( localStorage.getItem( 'U_ID' ) );

            }
            catch( exception ){

                console.log( "Logging failed!" );
                console.log( exception );

            }
            //Modified for activity logging end
                

        };

        var completedLoading = function(first, second, third) {

            var count = Math.abs((1.0 - 0.8) / 0.01);
            var progressVal = 0.80;
            (function loops() {
                editor.progressBar.updateProgress( editor.languageData.Finishingtasks, progressVal);

                if (count > 0) {
                    count--;
                    progressVal += 0.01;
                    console.log("progressVal: " + progressVal + " count: " + count);
                    setTimeout(loops, 100);
                } else {
                    editor.progressBar.hide();
                }

            })();

            console.log('Loading complete!');
            editor.execute(new AddObjectCommand(objectGroup));
            
            //Applying the -90.0 rotation for obj mtl file loaded from DropBox
            editor.execute( new SetRotationCommand( objectGroup, new THREE.Euler( -90.0 * degToEulerFactor, 0, 0 ) ) );
            toastr.info('<div>'+editor.languageData.IstheobjectrotationcorrectClickNOtomakerotationadjustments+'</div><div><button type="button" id="rot-accept" class="btn btn-success" style="margin-right:1px">'+ editor.languageData.Yes+'</button><button type="button" id="rot-reject" class="btn btn-danger" style="margin-left:1px">'+ editor.languageData.No +'</button></div>');
            
            //Modified for activity logging start
            try{

                var logDatas = {};
                logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " Completed parsing OBJ file from DropBox, Added : " + objectGroup.name;
                logger.addLog( logDatas );
                logger.sendLogs( localStorage.getItem( 'U_ID' ) );

            }
            catch( exception ){

                console.log( "Logging failed!" );
                console.log( exception );

            }
            //Modified for activity logging end
            
            document.getElementById( 'rot-reject' ).addEventListener( 'click', function listenerRotReject(){
                editor.select( objectGroup );
                editor.rotationControls.show();
                document.getElementById( 'rot-reject' ).removeEventListener( 'click', listenerRotReject );
            } );

        };
        wwObjLoader2.registerCallbackProgress(reportProgress);
        wwObjLoader2.registerCallbackCompletedLoading(completedLoading);
        wwObjLoader2.registerCallbackMaterialsLoaded(materialsLoaded);
        wwObjLoader2.registerCallbackMeshLoaded(meshLoaded);
        wwObjLoader2.registerCallbackErrorWhileLoading(errorLoading);

        loadingManager.onStart = function(url, itemsLoaded, itemsTotal) {

            console.log('Started loading file: Progress :' + ((itemsLoaded / itemsTotal) * 100) + '%');
            editor.progressBar.updateProgress(editor.languageData.Downloading, 0.0);

        };

        loadingManager.onLoad = function() {

            console.log('Loading complete!');
            $(".overlay").hide();

            setTimeout(function() {
                editor.progressBar.updateProgress(editor.languageData.DownloadingFiles , 1.0);
                editor.progressBar.hide();
            }, 1000);

        };


        loadingManager.onProgress = function(url, itemsLoaded, itemsTotal) {

            var percent = (itemsLoaded / itemsTotal) * 100;
            editor.progressBar.updateProgress( editor.languageData.DownloadingFiles, Number(Math.round(percent / 100)));

        };

        loadingManager.onError = function(url) {

            console.log('There was an error loading ' + url);

            //Modified for activity logging start
            try{

                var logDatas = {};
                logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Error loading url : " + url;
                logger.addLog( logDatas );
                logger.sendLogs( localStorage.getItem( 'U_ID' ) );

            }
            catch( exception ){

                console.log( "Logging failed!" );
                console.log( exception );

            }
            //Modified for activity logging end

        };

        var urlRequest = null;
        console.log("fileUrl" + fileUrl);

        var formData = {};
        formData.userId = localStorage.getItem('U_ID');
        formData.URL = decodeURIComponent(fileUrl);
        if (Object.keys(editor.activeProject).length != 0) {

            formData.projPath = editor.activeProject.basemodel_path;

        }
        formData = JSON.stringify(formData);

        //editor.progressBar.updateProgress(editor.languageData"Preparing to Download", 0.0);
        editor.progressBar.updateProgress(editor.languageData.PreparingtoDownload, 0.0);
        editor.progressBar.show();

        //Modified for activity logging start
        try{

            var logDatas = {};
            logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " started loading file from DropBox - URL : " + fileUrl;
            logger.addLog( logDatas );
            logger.sendLogs( localStorage.getItem( 'U_ID' ) );

        }
        catch( exception ){

            console.log( "Logging failed!" );
            console.log( exception );

        }
        //Modified for activity logging end

        urlRequest = $.ajax({
            url: editor.api + 'urlfileupload',
            type: 'POST',
            contentType: 'application/json',
            processData: false,
            data: formData,

            success: function(response) {

                if (typeof response.obj !== "undefined" && typeof response.mtl !== "undefined") {
                    modelObj.obj = response.obj;
                    modelObj.mtl = response.mtl;
                    modelObj.path = editor.path + response.path + "/";

                    workerInput = { "type": "objmtl", "path": modelObj.path, "mtl": modelObj.mtl, "obj": modelObj.obj };
                    prepData = new THREE.OBJLoader2.WWOBJLoader2.PrepDataFile(
                        workerInput.obj,
                        workerInput.path,
                        workerInput.obj,
                        workerInput.path,
                        workerInput.mtl
                    );

                    objectGroup = new THREE.Group();
                    objectGroup.name = workerInput.obj;

                    prepData.setSceneGraphBaseNode(objectGroup);
                    prepData.setStreamMeshes(true);
                    wwObjLoader2.setDebug(false);
                    wwObjLoader2.prepareRun(prepData);
                    wwObjLoader2.run();

                    //Modified for activity logging start
                    try{

                        var logDatas = {};
                        logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " finished loading process for file on DropBox-URL : " + fileUrl + ". File is of type OBJ + MTL";
                        logger.addLog( logDatas );
                        logger.sendLogs( localStorage.getItem( 'U_ID' ) );

                    }
                    catch( exception ){

                        console.log( "Logging failed!" );
                        console.log( exception );
        
                    }
                    //Modified for activity logging end

                } else if (typeof response.obj !== "undefined") {
                    modelObj.obj = response.obj;
                    modelObj.mtl = response.mtl;
                    modelObj.path = editor.path + response.path + "/";

                    workerInput = { "type": "obj", "path": modelObj.path, "mtl": modelObj.mtl, "obj": modelObj.obj };
                    prepData = new THREE.OBJLoader2.WWOBJLoader2.PrepDataFile(
                        workerInput.obj,
                        workerInput.path,
                        workerInput.obj
                    );

                    objectGroup = new THREE.Group();
                    objectGroup.name = workerInput.obj;

                    prepData.setSceneGraphBaseNode(objectGroup);
                    prepData.setStreamMeshes(true);
                    wwObjLoader2.setDebug(false);
                    wwObjLoader2.prepareRun(prepData);
                    wwObjLoader2.run();

                    //Modified for activity logging start
                    try{

                        var logDatas = {};
                        logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " finished loading process for file on DropBox-URL : " + fileUrl + ". File is of type OBJ";
                        logger.addLog( logDatas );
                        logger.sendLogs( localStorage.getItem( 'U_ID' ) );

                    }
                    catch( exception ){

                        console.log( "Logging failed!" );
                        console.log( exception );
        
                    }
                    //Modified for activity logging end

                } else if (typeof response.converted != "undefined") {
                   
                    modelObj.json = response.json;
                    modelObj.path = editor.path + response.path + '/' + modelObj.json;
                    json_loader.crossOrigin = '';

                    //Modified for activity logging start
                    try{

                        var logDatas = {};
                        logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " finished loading process for file on DropBox-URL : " + fileUrl + ". File is of type ASSIMP-JSON";
                        logger.addLog( logDatas );
                        logger.sendLogs( localStorage.getItem( 'U_ID' ) );

                    }
                    catch( exception ){

                        console.log( "Logging failed!" );
                        console.log( exception );
        
                    }
                    //Modified for activity logging end

                    json_loader.load(modelObj.path, function(object) {

                        editor.execute(new AddObjectCommand(object));

                        //Modified for activity logging start
                        try{

                            var logDatas = {};
                            logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " finished parsing ASSIMP-JSON file, DropBox-URL : " + fileUrl + ". Object : " + object.name + " added to the scene";
                            logger.addLog( logDatas );
                            logger.sendLogs( localStorage.getItem( 'U_ID' ) );

                        }
                        catch( exception ){

                            console.log( "Logging failed!" );
                            console.log( exception );
            
                        }
                        //Modified for activity logging end

                    });
                    
                } else if (typeof(response.jsonPath) != 'undefined') {
                    //reader.addEventListener( 'load', function ( event ) {
                    var jsonType = response.jsonType;

                    var assimpJSONLoader = new THREE.AssimpJSONLoader();
                    assimpJSONLoader.crossOrigin = '';
                    var pat = editor.path + response.jsonPath;

                    var loader = new THREE.JSONLoader(loadingManager);

                    var onProgress = function(xhr) {
                        if (xhr.lengthComputable) {
                            var percentComplete = xhr.loaded / xhr.total * 100;
                            percentComplete = Math.round(percentComplete, 2);

                            editor.progressBar.updateProgress(editor.languageData.DownloadingFiles, Number((percentComplete / 100)));

                        }
                    };

                    var onError = function(xhr) {

                        if (xhr == 'failure') {
                            var filenamesExt = response.jsonPath.split("/");
                            var filenameExt = filenamesExt[filenamesExt.length - 1];
                            var filenames = filenameExt.split(".");
                            var filename = filenames[filenames.length - 2];
                            var pat = editor.path + response.jsonPath;
                            var req = $.getJSON(pat, function(result, status, xhr) {

                                    var contents = JSON.stringify(result);

                                    var data;

                                    try {

                                        data = JSON.parse(contents);

                                    } catch (error) {

                                        alert(error);
                                        return;

                                    }

                                    if (data.metadata === undefined) {

                                        $(".overlay").hide();
                                        alert(editor.languageData.Unsupportedfileformat);
                                        return;

                                    }

                                    handleJSON(data, file, filename);
                                })
                                .done(function() {

                                    //$('#editor_3D_upld_modal').modal('hide');
                                    $(".overlay").hide();

                                    setTimeout(function() {
                                        editor.progressBar.updateProgress(editor.languageData.Processing, 1.0);
                                        editor.progressBar.hide();
                                    }, 1000);

                                })
                                .fail(function() {
                                    console.log("error");

                                    //$('#editor_3D_upld_modal').modal('hide');
                                    $(".overlay").hide();
                                    alert(editor.languageData.UnabletoloadfilesfromserverPleasetryagain);

                                    editor.progressBar.hide();

                                });
                        }
                    };

                    assimpJSONLoader.load(pat, function(object) {
                        editor.execute(new AddObjectCommand(object));
                        editor.progressBar.hide();
                    }, onProgress, onError);

                } 
                else{

                    //$('#editor_3D_upld_modal').modal('hide');
                    $(".overlay").hide();
                    editor.progressBar.hide();
                    //alert("Please upload the correct Zip");
                    alert(editor.languageData.PleaseuploadthecorrectZip);

                    //Modified for activity logging start
                    try{

                        var logDatas = {};
                        logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Completed loading zip file from DropBox, but the file is either corrupted or not supported or not in the required format.";
                        logger.addLog( logDatas );
                        logger.sendLogs( localStorage.getItem( 'U_ID' ) );

                    }
                    catch( exception ){

                        console.log( "Logging failed!" );
                        console.log( exception );
        
                    }
                    //Modified for activity logging end

                }
            },
            error: function(jqxhr, status, msg) {
                
                console.log("error");
                $(".overlay").hide();
                editor.progressBar.hide();

                //Modified for activity logging start
                try{

                    var logDatas = {};
                    logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Error : Failed to load file from DropBox, " + msg;
                    logger.addLog( logDatas );
                    logger.sendLogs( localStorage.getItem( 'U_ID' ) );

                }
                catch( exception ){

                    console.log( "Logging failed!" );
                    console.log( exception );
    
                }
                //Modified for activity logging end

                alert(editor.languageData.Failedtoloadfile);
            }
        });
    };
    /*MODIFIED FOR DROP BOX URL END*/

    this.loadFile = function(file) {
console.log(file)
        if( (file.size != undefined) && (file.size != null) && (file.size > 52428800) ){

            toastr.warning( "Import models below 50MB for better performance" );

        }
        var filename = file.name;
        var extension = filename.split('.').pop().toLowerCase();
        var reader = new FileReader();
        var loadingManager = new THREE.LoadingManager();

        var wwObjLoader2 = new THREE.OBJLoader2.WWOBJLoader2();
        wwObjLoader2.setCrossOrigin('anonymous');

        var Validator = THREE.OBJLoader2.prototype._getValidator();
        var prepData, objectGroup, workerInput, objBuffer, mtlString;

        //var initPostGL = function () {

        var reportProgress = function(content) {

            var response = content;
            var splittedResp = response.split(":");
            var respMessage = splittedResp[0];
            if (respMessage.indexOf("Download of") !== -1) {
                var actualProgress = Number((splittedResp[splittedResp.length - 1].trim()).slice(0, -1));
                /* evaluating current progress as the 80% of the original download progress to accommodate for the rest of the tasks(Mesh and material related tasks). Again dividing the value by 100 to pass it to the progress bar*/
                var evalProgress = (actualProgress * 0.8) / 100;
                editor.progressBar.updateProgress(editor.languageData.Downloading, evalProgress);

            }
        };

        var materialsLoaded = function(materials) {

            var count = Validator.isValid(materials) ? materials.length : 0;
            console.log('Loaded #' + count + ' materials.');

        };

        var meshLoaded = function(name, bufferGeometry, material) {

            console.log('Loaded mesh: ' + name + ' Material name: ' + material.name);

        };

        var errorLoading = function() {

            console.log("Error while loading");
            alert(editor.languageData.Sorryanerroroccured);
            editor.progressBar.hide();

            //Modified for activity logging start
            try{

                var logDatas = {};
                logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "Error loading OBJ file:";
                logger.addLog( logDatas );
                logger.sendLogs( localStorage.getItem( 'U_ID' ) );

            }
            catch( exception ){

                console.log( "Logging failed!" );
                console.log( exception );

            }
            //Modified for activity logging end

        };

        var completedLoading = function(first, second, third) {

            var count = Math.abs((1.0 - 0.8) / 0.01);
            var progressVal = 0.80;
            (function loops() {
                editor.progressBar.updateProgress(editor.languageData.Finishingtasks, progressVal);

                if (count > 0) {
                    count--;
                    progressVal += 0.01;
                    console.log("progressVal: " + progressVal + " count: " + count);
                    setTimeout(loops, 100);
                } else {
                    editor.progressBar.hide();
                }

            })();

            console.log('Loading complete!');
            //$(".overlay").hide();
            editor.execute(new AddObjectCommand(objectGroup));
            //Applying -90.0 rotation for OBJ MTL files loaded through upload
            editor.execute( new SetRotationCommand( objectGroup, new THREE.Euler( -90.0 * degToEulerFactor, 0, 0 ) ) );
            toastr.info('<div>'+ editor.languageData.IstheobjectrotationcorrectClickNOtomakerotationadjustments+'</div></br><div><button type="button" id="rotation-accept" class="btn btn-success" style="margin-right:1px">'+editor.languageData.Yes+'</button><button type="button" id="rotation-reject" class="btn btn-danger" style="margin-left:1px">'+editor.languageData.No+'</button></div>');
            
            //Modified for activity logging start
            try{

                var logDatas = {};
                logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "Completed loading OBJ file, Added : " + objectGroup.name;
                logger.addLog( logDatas );
                logger.sendLogs( localStorage.getItem( 'U_ID' ) );

            }
            catch( exception ){

                console.log( "Logging failed!" );
                console.log( exception );

            }
            //Modified for activity logging end

            document.getElementById( 'rotation-reject' ).addEventListener( 'click', function rotationRejectListner(){
                editor.select( objectGroup );
                editor.rotationControls.show();
                document.getElementById( 'rotation-reject' ).removeEventListener( 'click', rotationRejectListner );
            } );

        };
        wwObjLoader2.registerCallbackProgress(reportProgress);
        wwObjLoader2.registerCallbackCompletedLoading(completedLoading);
        wwObjLoader2.registerCallbackMaterialsLoaded(materialsLoaded);
        wwObjLoader2.registerCallbackMeshLoaded(meshLoaded);
        wwObjLoader2.registerCallbackErrorWhileLoading(errorLoading);

        //return true;
        //};

        loadingManager.onStart = function(url, itemsLoaded, itemsTotal) {

            console.log('Started loading file: Progress :' + ((itemsLoaded / itemsTotal) * 100) + '%');
            editor.progressBar.updateProgress(editor.languageData.Downloading, 0.0);

        };

        loadingManager.onLoad = function() {

            console.log('Loading complete!');
            $(".overlay").hide();

            setTimeout(function() {
                editor.progressBar.updateProgress(editor.languageData.Downloading, 1.0);
                editor.progressBar.hide();
            }, 1000);

        };


        loadingManager.onProgress = function(url, itemsLoaded, itemsTotal) {

            var percent = (itemsLoaded / itemsTotal) * 100;
            editor.progressBar.updateProgress(editor.languageData.Downloading, Number(Math.round(percent / 100)));
        };

        loadingManager.onError = function(url) {

            console.log('There was an error loading ' + url);

            //Modified for activity logging start
            try{

                var logDatas = {};
                logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Error : Failed to load file from url, " + url;
                logger.addLog( logDatas );
                logger.sendLogs( localStorage.getItem( 'U_ID' ) );

            }
            catch( exception ){

                console.log( "Logging failed!" );
                console.log( exception );

            }
            //Modified for activity logging end

            alert(editor.languageData.UnabletoloadfilesfromserverPleasetryagain);

        };

        reader.addEventListener('progress', function(event) {

            var size = '(' + Math.floor(event.total / 1000).format() + ' KB)';
            var progress = Math.floor((event.loaded / event.total) * 100) + '%';

        });

        switch (extension) {

            case '3ds':

                reader.addEventListener('load', function(event) {

                    var loader = new THREE.TDSLoader();
                    var object = loader.parse(event.target.result);

                    editor.execute(new AddObjectCommand(object));

                    //Modified for activity logging start
                    try{

                        var logDatas = {};
                        logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " finished importing : " + file.name;
                        logger.addLog( logDatas );
                        logger.sendLogs( localStorage.getItem( 'U_ID' ) );

                    }
                    catch( exception ){

                        console.log( "Logging failed!" );
                        console.log( exception );
        
                    }
                    //Modified for activity logging end

                }, false);

                //Modified for activity logging start
                try{

                    var logDatas = {};
                    logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " started to import: " + file.name;
                    logger.addLog( logDatas );
                    logger.sendLogs( localStorage.getItem( 'U_ID' ) );

                }
                catch( exception ){

                    console.log( "Logging failed!" );
                    console.log( exception );
    
                }
                //Modified for activity logging end

                reader.readAsArrayBuffer(file);

                break;

            case 'amf':

                reader.addEventListener('load', function(event) {

                    var loader = new THREE.AMFLoader(loadingManager);
                    var amfobject = loader.parse(event.target.result);

                    editor.execute(new AddObjectCommand(amfobject));

                    //Modified for activity logging start
                    try{

                        var logDatas = {};
                        logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " finished importing : " + file.name;
                        logger.addLog( logDatas );
                        logger.sendLogs( localStorage.getItem( 'U_ID' ) );

                    }
                    catch( exception ){

                        console.log( "Logging failed!" );
                        console.log( exception );
        
                    }
                    //Modified for activity logging end

                }, false);

                //Modified for activity logging start
                try{

                    var logDatas = {};
                    logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " started to import: " + file.name;
                    logger.addLog( logDatas );
                    logger.sendLogs( localStorage.getItem( 'U_ID' ) );

                }
                catch( exception ){

                    console.log( "Logging failed!" );
                    console.log( exception );
    
                }
                //Modified for activity logging end

                reader.readAsArrayBuffer(file);

                break;

            case 'awd':

                reader.addEventListener('load', function(event) {

                    var loader = new THREE.AWDLoader(loadingManager);
                    var scene = loader.parse(event.target.result);

                    editor.execute(new SetSceneCommand(scene));

                    //Modified for activity logging start
                    try{

                        var logDatas = {};
                        logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " finished importing : " + file.name;
                        logger.addLog( logDatas );
                        logger.sendLogs( localStorage.getItem( 'U_ID' ) );

                    }
                    catch( exception ){

                        console.log( "Logging failed!" );
                        console.log( exception );
        
                    }
                    //Modified for activity logging end

                }, false);

                //Modified for activity logging start
                try{

                    var logDatas = {};
                    logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " started to import: " + file.name;
                    logger.addLog( logDatas );
                    logger.sendLogs( localStorage.getItem( 'U_ID' ) );

                }
                catch( exception ){

                    console.log( "Logging failed!" );
                    console.log( exception );
    
                }
                //Modified for activity logging end

                reader.readAsArrayBuffer(file);

                break;

            case 'babylon':

                reader.addEventListener('load', function(event) {

                    var contents = event.target.result;
                    var json = JSON.parse(contents);

                    var loader = new THREE.BabylonLoader(loadingManager);
                    var scene = loader.parse(json);

                    editor.execute(new SetSceneCommand(scene));

                    //Modified for activity logging start
                    try{

                        var logDatas = {};
                        logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " finished importing : " + file.name;
                        logger.addLog( logDatas );
                        logger.sendLogs( localStorage.getItem( 'U_ID' ) );

                    }
                    catch( exception ){

                        console.log( "Logging failed!" );
                        console.log( exception );
        
                    }
                    //Modified for activity logging end

                }, false);

                //Modified for activity logging start
                try{

                    var logDatas = {};
                    logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " started to import: " + file.name;
                    logger.addLog( logDatas );
                    logger.sendLogs( localStorage.getItem( 'U_ID' ) );

                }
                catch( exception ){

                    console.log( "Logging failed!" );
                    console.log( exception );
    
                }
                //Modified for activity logging end

                reader.readAsText(file);

                break;

            case 'babylonmeshdata':

                reader.addEventListener('load', function(event) {

                    var contents = event.target.result;
                    var json = JSON.parse(contents);

                    var loader = new THREE.BabylonLoader(loadingManager);

                    var geometry = loader.parseGeometry(json);
                    var material = new THREE.MeshStandardMaterial();

                    var mesh = new THREE.Mesh(geometry, material);
                    mesh.name = filename;

                    editor.execute(new AddObjectCommand(mesh));

                    //Modified for activity logging start
                    try{

                        var logDatas = {};
                        logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " finished importing : " + file.name;
                        logger.addLog( logDatas );
                        logger.sendLogs( localStorage.getItem( 'U_ID' ) );

                    }
                    catch( exception ){

                        console.log( "Logging failed!" );
                        console.log( exception );
        
                    }
                    //Modified for activity logging end

                }, false);

                //Modified for activity logging start
                try{

                    var logDatas = {};
                    logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " started to import: " + file.name;
                    logger.addLog( logDatas );
                    logger.sendLogs( localStorage.getItem( 'U_ID' ) );

                }
                catch( exception ){

                    console.log( "Logging failed!" );
                    console.log( exception );
    
                }
                //Modified for activity logging end

                reader.readAsText(file);

                break;

            case 'ctm':

                reader.addEventListener('load', function(event) {

                    var data = new Uint8Array(event.target.result);

                    var stream = new CTM.Stream(data);
                    stream.offset = 0;

                    var loader = new THREE.CTMLoader(loadingManager);
                    loader.createModel(new CTM.File(stream), function(geometry) {

                        geometry.sourceType = "ctm";
                        geometry.sourceFile = file.name;

                        var material = new THREE.MeshStandardMaterial();

                        var mesh = new THREE.Mesh(geometry, material);
                        mesh.name = filename;

                        editor.execute(new AddObjectCommand(mesh));

                        //Modified for activity logging start
                        try{

                            var logDatas = {};
                            logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " finished importing : " + file.name;
                            logger.addLog( logDatas );
                            logger.sendLogs( localStorage.getItem( 'U_ID' ) );

                        }
                        catch( exception ){

                            console.log( "Logging failed!" );
                            console.log( exception );
            
                        }
                        //Modified for activity logging end

                    });

                }, false);

                //Modified for activity logging start
                try{

                    var logDatas = {};
                    logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " started to import: " + file.name;
                    logger.addLog( logDatas );
                    logger.sendLogs( localStorage.getItem( 'U_ID' ) );

                }
                catch( exception ){

                    console.log( "Logging failed!" );
                    console.log( exception );
    
                }
                //Modified for activity logging end

                reader.readAsArrayBuffer(file);

                break;

            case 'dae':

                reader.addEventListener('load', function(event) {

                    var contents = event.target.result;

                    var loader = new THREE.ColladaLoader(loadingManager);
                    var collada = loader.parse(contents);

                    collada.scene.name = filename;

                    editor.execute(new AddObjectCommand(collada.scene));

                    //Modified for activity logging start
                    try{

                        var logDatas = {};
                        logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " finished importing : " + file.name;
                        logger.addLog( logDatas );
                        logger.sendLogs( localStorage.getItem( 'U_ID' ) );

                    }
                    catch( exception ){

                        console.log( "Logging failed!" );
                        console.log( exception );
        
                    }
                    //Modified for activity logging end

                }, false);

                //Modified for activity logging start
                try{

                    var logDatas = {};
                    logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " started to import: " + file.name;
                    logger.addLog( logDatas );
                    logger.sendLogs( localStorage.getItem( 'U_ID' ) );

                }
                catch( exception ){

                    console.log( "Logging failed!" );
                    console.log( exception );
    
                }
                //Modified for activity logging end

                reader.readAsText(file);

                break;

            case 'fbx':

                reader.addEventListener('load', function(event) {

                    var contents = event.target.result;

                    var loader = new THREE.FBXLoader(loadingManager);
                    var object = loader.parse(contents);

                    editor.execute(new AddObjectCommand(object));

                    //Modified for activity logging start
                    try{

                        var logDatas = {};
                        logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " finished importing : " + file.name;
                        logger.addLog( logDatas );
                        logger.sendLogs( localStorage.getItem( 'U_ID' ) );

                    }
                    catch( exception ){

                        console.log( "Logging failed!" );
                        console.log( exception );
        
                    }
                    //Modified for activity logging end

                }, false);

                //Modified for activity logging start
                try{

                    var logDatas = {};
                    logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " started to import: " + file.name;
                    logger.addLog( logDatas );
                    logger.sendLogs( localStorage.getItem( 'U_ID' ) );

                }
                catch( exception ){

                    console.log( "Logging failed!" );
                    console.log( exception );
    
                }
                //Modified for activity logging end

                reader.readAsArrayBuffer(file);

                break;

            case 'glb':
            case 'gltf':

                reader.addEventListener('load', function(event) {

                    var contents = event.target.result;

                    var loader = new THREE.GLTFLoader(loadingManager);
                    loader.parse(contents, '', function(result) {

                        result.scene.name = filename;
                        editor.execute(new AddObjectCommand(result.scene));

                        //Modified for activity logging start
                        try{

                            var logDatas = {};
                            logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " finished importing : " + file.name;
                            logger.addLog( logDatas );
                            logger.sendLogs( localStorage.getItem( 'U_ID' ) );

                        }
                        catch( exception ){

                            console.log( "Logging failed!" );
                            console.log( exception );
            
                        }
                        //Modified for activity logging end

                    });

                }, false);

                //Modified for activity logging start
                try{

                    var logDatas = {};
                    logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " started to import: " + file.name;
                    logger.addLog( logDatas );
                    logger.sendLogs( localStorage.getItem( 'U_ID' ) );

                }
                catch( exception ){

                    console.log( "Logging failed!" );
                    console.log( exception );
    
                }
                //Modified for activity logging end

                reader.readAsArrayBuffer(file);

                break;

            case 'js':
            case 'json':

            case '3geo':
            case '3mat':
            case '3obj':
            case '3scn':

                reader.addEventListener('load', function(event) {

                    var contents = event.target.result;
                    // 2.0

                    if (contents.indexOf('postMessage') !== -1) {

                        var blob = new Blob([contents], { type: 'text/javascript' });
                        var url = URL.createObjectURL(blob);

                        var worker = new Worker(url);

                        worker.onmessage = function(event) {

                            event.data.metadata = { version: 2 };
                            var isJsonValid = handleJSON(event.data, file, filename);

                            /*MODIFIED TO CHECK STATUS OF handleJSON START*/
                            if (isJsonValid == false) {

                                //Modified for activity logging start
                                try{

                                    var logDatas = {};
                                    logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "Unsupported JSON : " + file.name;
                                    logger.addLog( logDatas );
                                    logger.sendLogs( localStorage.getItem( 'U_ID' ) );

                                }
                                catch( exception ){

                                    console.log( "Logging failed!" );
                                    console.log( exception );
                    
                                }
                                //Modified for activity logging end

                                alert(editor.languageData.UnsupportedJSON);
                                return;

                            }
                            /*MODIFIED TO CHECK STATUS OF handleJSON END*/

                        };

                        worker.postMessage(Date.now());

                        return;

                    }

                    // >= 3.0

                    var data;

                    try {

                        data = JSON.parse(contents);

                    } catch (error) {

                        //Modified for activity logging start
                        try{

                            var logDatas = {};
                            logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "Error : " + file.name + " " + error;
                            logger.addLog( logDatas );
                            logger.sendLogs( localStorage.getItem( 'U_ID' ) );

                        }
                        catch( exception ){

                            console.log( "Logging failed!" );
                            console.log( exception );
            
                        }
                        //Modified for activity logging end

                        alert(error);
                        return;

                    }

                    /*MODIFIED TO CHECK STATUS OF handleJSON START*/
                    //handleJSON( data, file, filename );
                    var isJsonValid = handleJSON(data, file, filename);
                    if (isJsonValid == false) {

                        //Modified for activity logging start
                        try{

                            var logDatas = {};
                            logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "Unsupported JSON : " + file.name;
                            logger.addLog( logDatas );
                            logger.sendLogs( localStorage.getItem( 'U_ID' ) );

                        }
                        catch( exception ){

                            console.log( "Logging failed!" );
                            console.log( exception );
            
                        }
                        //Modified for activity logging end

                        alert(editor.languageData.UnsupportedJSON);
                        return;

                    }
                    /*MODIFIED TO CHECK STATUS OF handleJSON END*/

                }, false);

                //Modified for activity logging start
                try{

                    var logDatas = {};
                    logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " started to import: " + file.name;
                    logger.addLog( logDatas );
                    logger.sendLogs( localStorage.getItem( 'U_ID' ) );

                }
                catch( exception ){

                    console.log( "Logging failed!" );
                    console.log( exception );
    
                }
                //Modified for activity logging end

                reader.readAsText(file);

                break;


            case 'kmz':

                reader.addEventListener('load', function(event) {

                    var loader = new THREE.KMZLoader(loadingManager);
                    var collada = loader.parse(event.target.result);

                    collada.scene.name = filename;

                    editor.execute(new AddObjectCommand(collada.scene));

                    //Modified for activity logging start
                    try{

                        var logDatas = {};
                        logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " finished importing : " + file.name;
                        logger.addLog( logDatas );
                        logger.sendLogs( localStorage.getItem( 'U_ID' ) );

                    }
                    catch( exception ){

                        console.log( "Logging failed!" );
                        console.log( exception );
        
                    }
                    //Modified for activity logging end

                }, false);

                //Modified for activity logging start
                try{

                    var logDatas = {};
                    logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " started to import: " + file.name;
                    logger.addLog( logDatas );
                    logger.sendLogs( localStorage.getItem( 'U_ID' ) );

                }
                catch( exception ){

                    console.log( "Logging failed!" );
                    console.log( exception );
    
                }
                //Modified for activity logging end

                reader.readAsArrayBuffer(file);

                break;

            case 'md2':

                reader.addEventListener('load', function(event) {

                    var contents = event.target.result;

                    var geometry = new THREE.MD2Loader(loadingManager).parse(contents);
                    var material = new THREE.MeshStandardMaterial({
                        morphTargets: true,
                        morphNormals: true
                    });

                    var mesh = new THREE.Mesh(geometry, material);
                    mesh.mixer = new THREE.AnimationMixer(mesh);
                    mesh.name = filename;

                    editor.execute(new AddObjectCommand(mesh));

                    //Modified for activity logging start
                    try{

                        var logDatas = {};
                        logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " finished importing : " + file.name;
                        logger.addLog( logDatas );
                        logger.sendLogs( localStorage.getItem( 'U_ID' ) );

                    }
                    catch( exception ){

                        console.log( "Logging failed!" );
                        console.log( exception );
        
                    }
                    //Modified for activity logging end

                }, false);

                //Modified for activity logging start
                try{

                    var logDatas = {};
                    logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " started to import: " + file.name;
                    logger.addLog( logDatas );
                    logger.sendLogs( localStorage.getItem( 'U_ID' ) );

                }
                catch( exception ){

                    console.log( "Logging failed!" );
                    console.log( exception );
    
                }
                //Modified for activity logging end

                reader.readAsArrayBuffer(file);

                break;

            case 'obj':

                reader.addEventListener('load', function(event) {

                    var contents = event.target.result;

                    var object = new THREE.OBJLoader(loadingManager).parse(contents);
                    object.name = filename;

                    editor.execute(new AddObjectCommand(object));

                    //Modified for activity logging start
                    try{

                        var logDatas = {};
                        logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " finished importing : " + file.name;
                        logger.addLog( logDatas );
                        logger.sendLogs( localStorage.getItem( 'U_ID' ) );

                    }
                    catch( exception ){

                        console.log( "Logging failed!" );
                        console.log( exception );
        
                    }
                    //Modified for activity logging end

                }, false);

                //Modified for activity logging start
                try{

                    var logDatas = {};
                    logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " started to import: " + file.name;
                    logger.addLog( logDatas );
                    logger.sendLogs( localStorage.getItem( 'U_ID' ) );

                }
                catch( exception ){

                    console.log( "Logging failed!" );
                    console.log( exception );
    
                }
                //Modified for activity logging end

                reader.readAsText(file);

                break;

            case 'playcanvas':

                reader.addEventListener('load', function(event) {

                    var contents = event.target.result;
                    var json = JSON.parse(contents);

                    var loader = new THREE.PlayCanvasLoader(loadingManager);
                    var object = loader.parse(json);

                    editor.execute(new AddObjectCommand(object));

                    //Modified for activity logging start
                    try{

                        var logDatas = {};
                        logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " finished importing : " + file.name;
                        logger.addLog( logDatas );
                        logger.sendLogs( localStorage.getItem( 'U_ID' ) );

                    }
                    catch( exception ){

                        console.log( "Logging failed!" );
                        console.log( exception );
        
                    }
                    //Modified for activity logging end

                }, false);

                //Modified for activity logging start
                try{

                    var logDatas = {};
                    logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " started to import: " + file.name;
                    logger.addLog( logDatas );
                    logger.sendLogs( localStorage.getItem( 'U_ID' ) );

                }
                catch( exception ){

                    console.log( "Logging failed!" );
                    console.log( exception );
    
                }
                //Modified for activity logging end

                reader.readAsText(file);

                break;

            case 'ply':

                reader.addEventListener('load', function(event) {

                    var contents = event.target.result;

                    var geometry = new THREE.PLYLoader(loadingManager).parse(contents);
                    geometry.sourceType = "ply";
                    geometry.sourceFile = file.name;

                    var material = new THREE.MeshStandardMaterial();

                    var mesh = new THREE.Mesh(geometry, material);
                    mesh.name = filename;

                    editor.execute(new AddObjectCommand(mesh));

                    //Modified for activity logging start
                    try{

                        var logDatas = {};
                        logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " finished importing : " + file.name;
                        logger.addLog( logDatas );
                        logger.sendLogs( localStorage.getItem( 'U_ID' ) );

                    }
                    catch( exception ){

                        console.log( "Logging failed!" );
                        console.log( exception );
        
                    }
                    //Modified for activity logging end

                }, false);

                //Modified for activity logging start
                try{

                    var logDatas = {};
                    logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " started to import: " + file.name;
                    logger.addLog( logDatas );
                    logger.sendLogs( localStorage.getItem( 'U_ID' ) );

                }
                catch( exception ){

                    console.log( "Logging failed!" );
                    console.log( exception );
    
                }
                //Modified for activity logging end

                reader.readAsArrayBuffer(file);

                break;

            case 'stl':

                reader.addEventListener('load', function(event) {

                    var contents = event.target.result;

                    var geometry = new THREE.STLLoader(loadingManager).parse(contents);
                    geometry.sourceType = "stl";
                    geometry.sourceFile = file.name;

                    var material = new THREE.MeshStandardMaterial();

                    var mesh = new THREE.Mesh(geometry, material);
                    mesh.name = filename;

                    editor.execute(new AddObjectCommand(mesh));

                    //Modified for activity logging start
                    try{

                        var logDatas = {};
                        logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " finished importing : " + file.name;
                        logger.addLog( logDatas );
                        logger.sendLogs( localStorage.getItem( 'U_ID' ) );

                    }
                    catch( exception ){

                        console.log( "Logging failed!" );
                        console.log( exception );
        
                    }
                    //Modified for activity logging end

                }, false);

                //Modified for activity logging start
                try{

                    var logDatas = {};
                    logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " started to import: " + file.name;
                    logger.addLog( logDatas );
                    logger.sendLogs( localStorage.getItem( 'U_ID' ) );

                }
                catch( exception ){

                    console.log( "Logging failed!" );
                    console.log( exception );
    
                }
                //Modified for activity logging end

                if (reader.readAsBinaryString !== undefined) {

                    reader.readAsBinaryString(file);

                } else {

                    reader.readAsArrayBuffer(file);

                }

                break;

                /*
                case 'utf8':

                	reader.addEventListener( 'load', function ( event ) {

                		var contents = event.target.result;

                		var geometry = new THREE.UTF8Loader().parse( contents );
                		var material = new THREE.MeshLambertMaterial();

                		var mesh = new THREE.Mesh( geometry, material );

                		editor.execute( new AddObjectCommand( mesh ) );

                	}, false );
                	reader.readAsBinaryString( file );

                	break;
                */

            case 'vtk':

                reader.addEventListener('load', function(event) {

                    var contents = event.target.result;

                    var geometry = new THREE.VTKLoader(loadingManager).parse(contents);
                    geometry.sourceType = "vtk";
                    geometry.sourceFile = file.name;

                    var material = new THREE.MeshStandardMaterial();

                    var mesh = new THREE.Mesh(geometry, material);
                    mesh.name = filename;

                    editor.execute(new AddObjectCommand(mesh));

                    //Modified for activity logging start
                    try{

                        var logDatas = {};
                        logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " finished importing : " + file.name;
                        logger.addLog( logDatas );
                        logger.sendLogs( localStorage.getItem( 'U_ID' ) );

                    }
                    catch( exception ){

                        console.log( "Logging failed!" );
                        console.log( exception );
        
                    }
                    //Modified for activity logging end

                }, false);

                //Modified for activity logging start
                try{

                    var logDatas = {};
                    logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " started to import: " + file.name;
                    logger.addLog( logDatas );
                    logger.sendLogs( localStorage.getItem( 'U_ID' ) );

                }
                catch( exception ){

                    console.log( "Logging failed!" );
                    console.log( exception );
    
                }
                //Modified for activity logging end

                reader.readAsText(file);

                break;

            case 'wrl':

                reader.addEventListener('load', function(event) {

                    var contents = event.target.result;

                    var result = new THREE.VRMLLoader(loadingManager).parse(contents);

                    editor.execute(new SetSceneCommand(result));

                    //Modified for activity logging start
                    try{

                        var logDatas = {};
                        logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " finished importing : " + file.name;
                        logger.addLog( logDatas );
                        logger.sendLogs( localStorage.getItem( 'U_ID' ) );

                    }
                    catch( exception ){

                        console.log( "Logging failed!" );
                        console.log( exception );
        
                    }
                    //Modified for activity logging end

                }, false);

                //Modified for activity logging start
                var logDatas = {};
                logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " started to import: " + file.name;
                logger.addLog( logDatas );
                logger.sendLogs( localStorage.getItem( 'U_ID' ) );
                //Modified for activity logging end

                reader.readAsText(file);

                break;

            case 'zip':

                //Modified for activity logging start
                try{

                    var logDatas = {};
                    logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " started to import: " + file.name;
                    logger.addLog( logDatas );
                    logger.sendLogs( localStorage.getItem( 'U_ID' ) );

                }
                catch( exception ){

                    console.log( "Logging failed!" );
                    console.log( exception );
    
                }
                //Modified for activity logging end

                var upload_request = null;
                document.getElementById("editor_3D_upld_body_cntnt").innerHTML = editor.languageData.Uploadingtoserver;
                //$('#editor_3D_upld_modal').modal({backdrop: 'static',keyboard: false});
                //$(".overlay").show();

                editor.progressBar.updateProgress(editor.languageData.PreparingtoDownload, 0.0);
                editor.progressBar.show();

                var fd = new FormData();
                fd.append('userId', localStorage.getItem('U_ID'));
                if (Object.keys(editor.activeProject).length != 0) {

                    fd.append('projPath', editor.activeProject.basemodel_path);

                }
                fd.append('file', file);
                
                upload_request = $.ajax({
                    url: editor.api + 'multer',
                    type: 'POST',
                    contentType: false,
                    processData: false,
                    data: fd,
                    success: function(response) {
                        if (typeof response.obj !== "undefined" && typeof response.mtl !== "undefined") {
                            modelObj.obj = response.obj;
                            modelObj.mtl = response.mtl;
                            modelObj.path = editor.path + response.path + "/";

                            workerInput = { "type": "objmtl", "path": modelObj.path, "mtl": modelObj.mtl, "obj": modelObj.obj };

                            //initPostGL();
                            prepData = new THREE.OBJLoader2.WWOBJLoader2.PrepDataFile(
                                workerInput.obj,
                                workerInput.path,
                                workerInput.obj,
                                workerInput.path,
                                workerInput.mtl
                            );

                            objectGroup = new THREE.Group();
                            objectGroup.name = workerInput.obj;

                            prepData.setSceneGraphBaseNode(objectGroup);
                            prepData.setStreamMeshes(true);
                            wwObjLoader2.setDebug(false);
                            wwObjLoader2.prepareRun(prepData);
                            wwObjLoader2.run();

                        } else if (typeof response.obj !== "undefined") {
                            modelObj.obj = response.obj;
                            modelObj.mtl = response.mtl;
                            modelObj.path = editor.path + response.path + "/";

                            workerInput = { "type": "obj", "path": modelObj.path, "mtl": modelObj.mtl, "obj": modelObj.obj };

                            //initPostGL();
                            prepData = new THREE.OBJLoader2.WWOBJLoader2.PrepDataFile(
                                workerInput.obj,
                                workerInput.path,
                                workerInput.obj
                            );

                            objectGroup = new THREE.Group();
                            objectGroup.name = workerInput.obj;

                            prepData.setSceneGraphBaseNode(objectGroup);
                            prepData.setStreamMeshes(true);
                            wwObjLoader2.setDebug(false);

                            try {

                                wwObjLoader2.prepareRun(prepData);
                                wwObjLoader2.run();

                            } catch (exception) {

                                //Modified for activity logging start
                                try{

                                    var logDatas = {};
                                    logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "Error executing wwObjLoader2.prepareRun  and wwObjLoader2.run : " + file.name;
                                    logger.addLog( logDatas );
                                    logger.sendLogs( localStorage.getItem( 'U_ID' ) );

                                }
                                catch( exception ){

                                    console.log( "Logging failed!" );
                                    console.log( exception );
                    
                                }
                                //Modified for activity logging end

                                alert(editor.languageData.SorryanerroroccuredPleasetryaftersometime);
                                editor.progressBar.hide();

                            }

                        } else if (typeof response.converted != "undefined") {

                            modelObj.json = response.json;
                            modelObj.path = editor.path + response.path + '/' + modelObj.json;
                            var json_loader = new THREE.AssimpJSONLoader(loadingManager);
                            json_loader.crossOrigin = '';

                            json_loader.load(modelObj.path, function(object) {
                                editor.execute(new AddObjectCommand(object));
                            });
                            try {
                                reader.readAsText(modelObj.path);
                            } catch (exception) {
                                $(".overlay").hide();
                                //alert("Sorry! Something went wrong with the model. Please wait until the object gets loaded and try again if it is not loaded");

                            }
                        } else {

                            $(".overlay").hide();
                            //$('#editor_3D_upld_modal').modal('hide');

                            //Modified for activity logging start
                            try{

                                var logDatas = {};
                                logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "Zip file is currupted : " + file.name;
                                logger.addLog( logDatas );
                                logger.sendLogs( localStorage.getItem( 'U_ID' ) );

                            }
                            catch( exception ){

                                console.log( "Logging failed!" );
                                console.log( exception );
                
                            }
                            //Modified for activity logging end

                            alert(editor.languageData.PleaseuploadthecorrectZip);
                            editor.progressBar.hide();

                        }

                        //Modified for activity logging start
                        try{

                            var logDatas = {};
                            logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " finished importing : " + file.name;
                            logger.addLog( logDatas );
                            logger.sendLogs( localStorage.getItem( 'U_ID' ) );

                        }
                        catch( exception ){

                            console.log( "Logging failed!" );
                            console.log( exception );
            
                        }
                        //Modified for activity logging end

                    },
                    error: function(jqxhr, status, msg) {
                        //error code
                        $(".overlay").hide();
                        //$('#editor_3D_upld_modal').modal('hide');

                        //Modified for activity logging start
                        try{

                            var logDatas = {};
                            logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "Error importing zip file : " + file.name;
                            logger.addLog( logDatas );
                            logger.sendLogs( localStorage.getItem( 'U_ID' ) );

                        }
                        catch( exception ){

                            console.log( "Logging failed!" );
                            console.log( exception );
            
                        }
                        //Modified for activity logging end

                        alert(editor.languageData.SomethingwentwrongwiththeserverPleasetryagain);
                        editor.progressBar.hide();
                    }
                });
                break;

                /*MODIFIED TO INCLUDE FLOORPLANS IN EDITOR START*/
            case 'jpg':
            case 'png':

                //Modified for activity logging start
                try{

                    var logDatas = {};
                    logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " started to import an image: " + file.name;
                    logger.addLog( logDatas );
                    logger.sendLogs( localStorage.getItem( 'U_ID' ) );

                }
                catch( exception ){

                    console.log( "Logging failed!" );
                    console.log( exception );
    
                }
                //Modified for activity logging end

                var imageData = new FormData();
                imageData.append( 'file', file, file.name );
                imageData.append( 'userId', localStorage.getItem( 'U_ID' ) );
                var importImage = new ApiHandler();
                importImage.prepareRequest({
                    method: 'POST',
                    url: editor.api + 'import/single',
                    responseType: 'json',
                    isDownload: false,
                    formDataNeeded: true,
                    formData: imageData
                });
                importImage.onStateChange( function( response ) {

                    var loader = new THREE.TextureLoader();
                    loader.load( editor.path + response.path + "/" + response.img,
                        
                        function ( texture ) {

                            var img = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
                            img.map.needsUpdate = true;
                            var plane = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), img);
                            plane.overdraw = true;
                            plane.name = "Floorplan";
                            editor.execute(new AddObjectCommand(plane));
                            editor.execute(new SetRotationCommand(plane, new THREE.Euler((-90.0) * THREE.Math.DEG2RAD, 0, 0)));

                            //Modified for activity logging start
                            try{

                                var logDatas = {};
                                logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " finished importing image: " + file.name;
                                logger.addLog( logDatas );
                                logger.sendLogs( localStorage.getItem( 'U_ID' ) );

                            }
                            catch( exception ){

                                console.log( "Logging failed!" );
                                console.log( exception );
                
                            }
                            //Modified for activity logging end
                            
                        },
                        function ( xhr ) {
                            
                            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
                            
                        },
                        
                        function ( xhr ) {
                            
                            console.error( 'An error happened' );
                            toastr.error( editor.languageData.SorrysomethingwentwrongPleasetryagainaftersometime );

                            //Modified for activity logging start
                            try{

                                var logDatas = {};
                                logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "Error importing image: " + file.name;
                                logger.addLog( logDatas );
                                logger.sendLogs( localStorage.getItem( 'U_ID' ) );

                            }
                            catch( exception ){

                                console.log( "Logging failed!" );
                                console.log( exception );
                
                            }
                            //Modified for activity logging end
                            
                        }
                    );
            
                }, function( error ) {
        
                    console.log( error );
                    toastr.error( editor.languageData.SorrysomethingwentwrongPleasetryagainaftersometime );

                    //Modified for activity logging start
                    try{

                        var logDatas = {};
                        logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "Error importing image: " + file.name + " " + error;
                        logger.addLog( logDatas );
                        logger.sendLogs( localStorage.getItem( 'U_ID' ) );

                    }
                    catch( exception ){

                        console.log( "Logging failed!" );
                        console.log( exception );
        
                    }
                    //Modified for activity logging end
        
                });
                importImage.sendRequest();
                break;
                /*MODIFIED TO INCLUDE FLOORPLANS IN EDITOR END*/

            default:

                //Modified for activity logging start
                try{

                    var logDatas = {};
                    logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "Imported an unsupported file";
                    logger.addLog( logDatas );
                    logger.sendLogs( localStorage.getItem( 'U_ID' ) );

                }
                catch( exception ){

                    console.log( "Logging failed!" );
                    console.log( exception );
    
                }
                //Modified for activity logging end

                //alert('Unsupported file format (' + extension + ').');
                alert(editor.languageData.Unsupportedfileformat +'(' + extension + ').');

                break;

        }

    };

    /**
     *
     *	loadObjMtl - loads objmtl models using web worker
     *	@param - objectName - String - overall name of the model
     *	@param - objPath - String - path of the obj file
     *	@param - objName - String - name of obj file
     *	@param - mtlPath - String - Optional - path of the mtl file
     *	@param - mtlName - String - Optional - name of the mtl file
     *
     **/
    this.loadObjMtl = function(objectName, objPath, objName, mtlPath, mtlName) {

        var wwObjLoader2 = new THREE.OBJLoader2.WWOBJLoader2();
        wwObjLoader2.setCrossOrigin('anonymous');

        var Validator = THREE.OBJLoader2.prototype._getValidator();
        var prepData, objectGroup, workerInput, objBuffer, mtlString;

        var reportProgress = function(content) {

            var response = content;
            var splittedResp = response.split(":");
            var respMessage = splittedResp[0];
            if (respMessage.indexOf("Download of") !== -1) {
                var actualProgress = Number((splittedResp[splittedResp.length - 1].trim()).slice(0, -1));
                /* evaluating current progress as the 80% of the original download progress to accommodate for the rest of the tasks(Mesh and material related tasks). Again dividing the value by 100 to pass it to the progress bar*/
                var evalProgress = (actualProgress * 0.8) / 100;
                editor.progressBar.updateProgress(editor.languageData.DownloadingFiles, evalProgress);
                //editor.progressBar.show();
            }
        };

        var materialsLoaded = function(materials) {

            var count = Validator.isValid(materials) ? materials.length : 0;
            console.log('Loaded #' + count + ' materials.');

        };

        var meshLoaded = function(name, bufferGeometry, material) {

            console.log('Loaded mesh: ' + name + ' Material name: ' + material.name);

        };

        var errorLoading = function() {

            console.log("Error while loading");
            alert(editor.languageData.SomethingwentwrongwiththeserverPleasetryagain);
            editor.progressBar.hide();
            editor.isFromPublishedUrl = false; // resetting the flag
            editor.publishedUrlID = '';

            //Modified for activity logging start
            try{

                //Modified for activity logging start
                var logDatas = {};
                logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Error loading OBJ + MTL file";
                logger.addLog( logDatas );
                logger.sendLogs( localStorage.getItem( 'U_ID' ) );
                //Modified for activity logging end

            }
            catch( exception ){

                console.log( "Logging failed!" );
                console.log( exception );

            }
            //Modified for activity logging end

        };

        var completedLoading = function(first, second, third) {

            var count = Math.abs((1.0 - 0.8) / 0.01);
            var progressVal = 0.80;
            (function loops() {
                editor.progressBar.updateProgress(editor.languageData.Finishingtasks, progressVal);

                if (count > 0) {
                    count--;
                    progressVal += 0.01;
                    setTimeout(loops, 100);
                } else {
                    editor.progressBar.hide();
                }

            })();

            console.log('Loading complete!');
            editor.signals.sceneGraphChanged.dispatch();
            var syncBaseModelRotation = new Promise( ( resolve, reject ) => {

                resolve( editor.execute( new AddObjectCommand( objectGroup ) ));
            
            } );//Modified to fix object selection issue
            syncBaseModelRotation.then( () => {

                editor.execute( new SetRotationCommand( editor.selected, new THREE.Euler(  -1.5708, 0, 0 ) ) );

            },2000 )
            editor.signals.newProjectCreated.dispatch();//Dispatch this signal to indicate that a new project is created

            //Modified for activity logging start
            try{

                //Modified for activity logging start
                var logDatas = {};
                logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Added object " + objectGroup.name;
                logger.addLog( logDatas );
                logger.sendLogs( localStorage.getItem( 'U_ID' ) );
                //Modified for activity logging end

            }
            catch( exception ){

                console.log( "Logging failed!" );
                console.log( exception );

            }
            //Modified for activity logging end

        };
        wwObjLoader2.registerCallbackProgress(reportProgress);
        wwObjLoader2.registerCallbackCompletedLoading(completedLoading);
        wwObjLoader2.registerCallbackMaterialsLoaded(materialsLoaded);
        wwObjLoader2.registerCallbackMeshLoaded(meshLoaded);
        wwObjLoader2.registerCallbackErrorWhileLoading(errorLoading);

        if (mtlPath == null && mtlName == null) {

            prepData = new THREE.OBJLoader2.WWOBJLoader2.PrepDataFile(objectName, objPath, objName);
            //prepData = new THREE.OBJLoader2.WWOBJLoader2.PrepDataFile( 'Base Model', objPath, objName );

        } else {

            prepData = new THREE.OBJLoader2.WWOBJLoader2.PrepDataFile(objectName, objPath, objName, mtlPath, mtlName);
            //prepData = new THREE.OBJLoader2.WWOBJLoader2.PrepDataFile( 'Base Model', objPath, objName, mtlPath, mtlName );

        }


        objectGroup = new THREE.Group();
        //objectGroup.name = objectName;
        objectGroup.name = 'Base Model';

        prepData.setSceneGraphBaseNode(objectGroup);
        prepData.setStreamMeshes(true);
        wwObjLoader2.setDebug(false);
        //editor.execute(new AddObjectCommand(objectGroup));
        wwObjLoader2.prepareRun(prepData);
        wwObjLoader2.run();

    }

    /**
     *
     *	loadAssimpJSON - loads JSON files converted using assimp2json
     *	@param - path - String - path to the model( including file name )
     *
     **/
    var loadAssimpJSON = function(path, loadingManager) {

        var jsonLoader = new THREE.AssimpJSONLoader(loadingManager);
        jsonLoader.crossOrigin = '';

        jsonLoader.load(path, function(object) {

            object.name = 'Base Model';
            editor.execute(new AddObjectCommand(object));
            editor.signals.newProjectCreated.dispatch();//Dispatch this signal to indicate that a new project is created

            //Modified for activity logging start
            try{

                //Modified for activity logging start
                var logDatas = {};
                logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Added ASSIMPJSON file : " + object.name;
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

    }

    /**
     * loadThreeJson( jsonScene ) - loads an object in THREE.js JSON format
     * @param {object} - jsonScene - Scene data as JSON object
     * @param {string} - imagePath - path from which textures should be loaded.
     * @return - void
     */
    this.loadThreeJson = function(jsonScene, imagePath) {

        var loadingManager = new THREE.LoadingManager();
        loadingManager.onStart = function(url, itemsLoaded, itemsTotal) {

            console.log('Started loading file: Progress :' + ((itemsLoaded / itemsTotal) * 100) + '%');
            editor.progressBar.updateProgress(editor.languageData.Processing, 0.0);

        };

        loadingManager.onLoad = function() {

            console.log('Loading complete!');
            if( editor.isFloorplanViewActive === true ){

                editor.orthographicScale();
    
            } else {
    
                editor.scaleAllIcons();
    
            }
            editor.signals.sceneGraphChanged.dispatch();
            editor.progressBar.hide();
            //$('.overlay').hide();
            /*setTimeout(function(){
            	editor.progressBar.updateProgress("Processing",1.0);
            	editor.progressBar.hide();
            },1000);*/

        };


        loadingManager.onProgress = function(url, itemsLoaded, itemsTotal) {

            var percent = (itemsLoaded / itemsTotal) * 100;
            editor.progressBar.updateProgress(editor.languageData.Processing , Number(Math.round(percent / 100)));

        };

        loadingManager.onError = function(url) {

            console.log('There was an error loading ' + url);

        };

        //var loader = new THREE.ObjectLoader( loadingManager );
        var loader = new ThreeJsonLoader(loadingManager);
        loader.setTexturePath(imagePath);

        try {

            var result = loader.parse(jsonScene);
            if (result instanceof THREE.Scene) {

                editor.execute(new SetSceneCommand(result));
                editor.scene.traverse(function(child) {

                    if (child.camerauuid != undefined) {

                        var refSprite = child;
                        editor.getObjectByUuid(refSprite.camerauuid).then(function(cam) {

                            if (cam == undefined) return;

                            var spriteCanvas = document.createElement('canvas');
                            var spriteTexture = new THREE.Texture(spriteCanvas);

                            spriteCanvas.width = spriteCanvas.height = 128;
                            var imageLoader = new THREE.ImageLoader();
                            var iconUrl = 'assets/img/mappin.png';
                            badgeColor = cam.helperColor;
                            var badgeText = Number(cam.badgeText).toString();
                            imageLoader.load(iconUrl, function(img) {

                                var ctx = spriteCanvas.getContext('2d');
                                ctx.drawImage(img, 0, 0, 128, 128);
                                var colorHex;
                                //check whether the badgeColor is hex value or number
                                if (typeof(badgeColor) == 'number') {

                                    colorHex = '#' + (new THREE.Color(badgeColor)).getHexString();

                                } else if (typeof(badgeColor) == 'string') {

                                    colorHex = badgeColor;

                                }

                                ctx.fillStyle = colorHex;
                                //ctx.arc(104, 24, 24, 0, Math.PI * 2);
                                ctx.arc(98, 50, 30, 0, Math.PI * 2);
                                ctx.fill();
                                var pc = new ProcessColors();
                                var fontColor;
                                fontColor = pc.invert( colorHex, true );
                                ctx.fillStyle = fontColor;
                                //ctx.font = '26px sans-serif';
                                ctx.font = '30px sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                //ctx.fillText(badgeText, 104, 24);
                                ctx.fillText(badgeText, 98, 50);

                                spriteTexture.needsUpdate = true;

                            });

                            var newMaterial = new THREE.SpriteMaterial({

                                map: spriteTexture

                            });

                            refSprite.material = newMaterial;
                            editor.allReferencePoint.push( refSprite );
                            editor.signals.materialChanged.dispatch(newMaterial);

                        }, function(err) {

                            console.log(err);

                        });

                    }
                    /* Point of intrest*/
                    if(child.userData.pointData){

                        var pointOfIntrestMain = child;
                        var badgeNumber = child.userData.pointData.BadgeNumber;
                        var badgeColor;
                        if(pointOfIntrestMain.userData.pointData.BadgeColor == undefined){
                            badgeColor ="#f47c41";
                        }
                        else {
                            
                            badgeColor = pointOfIntrestMain.userData.pointData.BadgeColor;
                        }
                        editor.savepointofIntrestNumber.push( badgeNumber );
                       
                        // var spriteCanvas = document.createElement('canvas');
                        // var spriteTexture = new THREE.Texture(spriteCanvas);
                        // spriteCanvas.width = spriteCanvas.height = 128;
                        // var ctx = spriteCanvas.getContext('2d');
                        // ctx.beginPath();
                        // ctx.moveTo(0, 0)
                        // ctx.lineTo(100,0);
                        // ctx.lineTo(50,70)
                        // ctx.fillStyle = badgeColor;
                        // ctx.fill();
                        // ctx.fillStyle = 'white';
                        // ctx.font = '30px sans-serif';
                        // ctx.textAlign = 'center';
                        // ctx.textBaseline = 'middle';
                        // ctx.fillText(badgeNumber,50,20)
                        // spriteTexture.needsUpdate = true;

                        var spriteCanvas = document.createElement('canvas');
                            var spriteTexture = new THREE.Texture(spriteCanvas);

                            spriteCanvas.width = spriteCanvas.height = 308;
                            var imageLoader = new THREE.ImageLoader();
                            var iconUrl = 'assets/img/pindrop_yellow.png';
                            //badgeColor = child.userData.sensorData.badgeColor;
                            //var badgeText = child.userData.sensorData.badgeText;
                            imageLoader.load(iconUrl, function(img) {

                                var ctx = spriteCanvas.getContext('2d');
                                ctx.drawImage(img, 20, 120, 140, 140);
                                var colorHex;
                                //check whether the badgeColor is hex value or number
                                if (typeof(badgeColor) == 'number') {

                                    colorHex = '#' + (new THREE.Color(badgeColor)).getHexString();

                                } else if (typeof(badgeColor) == 'string') {

                                    colorHex = badgeColor;

                                }

                                ctx.fillStyle = colorHex;
                                //ctx.arc(104, 24, 24, 0, Math.PI * 2);
                                ctx.arc(100, 60, 50, 0, Math.PI * 2);
                                ctx.fill();
                                var pc = new ProcessColors();
                                var fontColor;
                                fontColor = pc.invert( colorHex, true );
                                ctx.fillStyle = fontColor;
                                //ctx.font = '26px sans-serif';
                                ctx.font = 'bold 75px sans-serif';//30px default
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                //ctx.fillText(badgeText, 104, 24);
                                ctx.fillText(badgeNumber,100, 60);

                                spriteTexture.needsUpdate = true;

                            });

                            var newMaterial = new THREE.SpriteMaterial({

                                map: spriteTexture

                            });

                        // var newMaterial = new THREE.SpriteMaterial({

                        //     map: spriteTexture

                        // });
                        

                        //newMaterial.scale.set(1.5, 1.5, 1.5);

                        pointOfIntrestMain.material = newMaterial;
                        editor.signals.materialChanged.dispatch(newMaterial);
                        editor.allPointOfinterest.push( pointOfIntrestMain );
                        }
                        /* Point of intrest*/
                    /*sensor*/
                    if( child instanceof THREE.Sprite && child.userData.sensorData){

                            var sensorMain = child;
                            var spriteCanvas = document.createElement('canvas');
                            var spriteTexture = new THREE.Texture(spriteCanvas);

                            spriteCanvas.width = spriteCanvas.height = 308;
                            var imageLoader = new THREE.ImageLoader();
                            var iconUrl = child.userData.sensorData.iconUrl;
                            badgeColor = child.userData.sensorData.badgeColor;
                            var badgeText = child.userData.sensorData.badgeText;
                            imageLoader.load(iconUrl, function(img) {

                                var ctx = spriteCanvas.getContext('2d');
                                ctx.drawImage(img, 55, 170, 110, 110);
                                var colorHex;
                                //check whether the badgeColor is hex value or number
                                if (typeof(badgeColor) == 'number') {

                                    colorHex = '#' + (new THREE.Color(badgeColor)).getHexString();

                                } else if (typeof(badgeColor) == 'string') {

                                    colorHex = badgeColor;

                                }

                                ctx.fillStyle = colorHex;
                                //ctx.arc(104, 24, 24, 0, Math.PI * 2);
                                ctx.arc(113, 80, 70, 0, Math.PI * 2);
                                ctx.fill();
                                var pc = new ProcessColors();
                                var fontColor;
                                fontColor = pc.invert( colorHex, true );
                                ctx.fillStyle = fontColor;
                                //ctx.font = '26px sans-serif';
                                ctx.font = 'bold 80px sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                //ctx.fillText(badgeText, 104, 24);
                                ctx.fillText(badgeText, 113, 80);

                                spriteTexture.needsUpdate = true;

                            });

                            var newMaterial = new THREE.SpriteMaterial({

                                map: spriteTexture

                            });

                            sensorMain.material = newMaterial;
                            //editor.allReferencePoint.push( refSprite );
                            editor.signals.materialChanged.dispatch(newMaterial);
                        //editor.allPointOfinterest.push( pointOfIntrestMain );
                    }
                    /*sensor*/

                });
                editor.progressBar.hide();
                $('.overlay').hide();

                //Modified to dispatch a signal to indicate that the projectdata has been loaded start
                editor.signals.projectDataLoaded.dispatch();

                //Modified to dispatch a signal to indicate that the projectdata has been loaded end

                //Modified for activity logging start
                try{

                    //Modified for activity logging start
                    var logDatas = {};
                    logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Project successfully opened " + editor.activeProject.name;
                    logger.addLog( logDatas );
                    logger.sendLogs( localStorage.getItem( 'U_ID' ) );
                    //Modified for activity logging end

                }
                catch( exception ){

                    console.log( "Logging failed!" );
                    console.log( exception );

                }
                //Modified for activity logging end

            } else {

                editor.execute(new AddObjectCommand(result));
                editor.progressBar.hide();
                $('.overlay').hide();

                //Modified for activity logging start
                try{

                    //Modified for activity logging start
                    var logDatas = {};
                    logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Object added " + result.name;
                    logger.addLog( logDatas );
                    logger.sendLogs( localStorage.getItem( 'U_ID' ) );
                    //Modified for activity logging end

                }
                catch( exception ){

                    console.log( "Logging failed!" );
                    console.log( exception );

                }
                //Modified for activity logging end

            }

        } catch(exception) {

            console.log(exception);
            $('.overlay').hide();
            editor.isFromPublishedUrl = false; // resetting the flag
            editor.publishedUrlID = '';
            alert(editor.languageData.FileloadingfailedPleasetryagain);

            //Modified for activity logging start
            try{

                //Modified for activity logging start
                var logDatas = {};
                logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Error parsing project data " + exception;
                logger.addLog( logDatas );
                logger.sendLogs( localStorage.getItem( 'U_ID' ) );
                //Modified for activity logging end

            }
            catch( exception ){

                console.log( "Logging failed!" );
                console.log( exception );

            }
            //Modified for activity logging end

        }

    }

    /**
     * openProject( projectInfo ) - using project info
     * @param projectInfo - String - parameter that holds project information ( sent from server )
     **/
    this.openProject = function(projectInfo) {

        var projType = projectInfo.body.basemodel_type;
        var projPath = projectInfo.body.basemodel_path;

        var loadingManager = new THREE.LoadingManager();
        loadingManager.onStart = function(url, itemsLoaded, itemsTotal) {

            console.log('Started loading file: Progress :' + ((itemsLoaded / itemsTotal) * 100) + '%');
            editor.progressBar.updateProgress(editor.languageData.DownloadingFiles, 0.0);

        };

        loadingManager.onLoad = function() {

            console.log('Loading complete!');
            editor.progressBar.hide();
            editor.signals.sceneGraphChanged.dispatch();

        };


        loadingManager.onProgress = function(url, itemsLoaded, itemsTotal) {

            var percent = (itemsLoaded / itemsTotal) * 100;
            editor.progressBar.updateProgress(editor.languageData.DownloadingFiles, Number(Math.round(percent / 100)));

        };

        loadingManager.onError = function(url) {

            console.log('There was an error loading ' + url);

            //Modified for activity logging start
            try{

                //Modified for activity logging start
                var logDatas = {};
                logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Error loading URL " + url;
                logger.addLog( logDatas );
                logger.sendLogs( localStorage.getItem( 'U_ID' ) );
                //Modified for activity logging end

            }
            catch( exception ){

                console.log( "Logging failed!" );
                console.log( exception );

            }
            //Modified for activity logging end

        };

        /* status == 200 is the server response after creating a new project. Here we are opening the project for the first time */
        if (projectInfo.status == 200) {

            switch (projType) {

                case 'objmtl':

                    editor.clear();
                    editor.deselect();
                    loadObjMtl(projectInfo.body.basemodel_obj, editor.path + projPath + '\\', projectInfo.body.basemodel_obj, editor.path + projPath + '\\', projectInfo.body.basemodel_mtl);
                    localStorage.setItem('project3d', projectInfo.body.name);
                    break;

                case 'obj':

                    editor.clear();
                    editor.deselect();
                    loadObjMtl(projectInfo.body.basemodel_obj, editor.path + projPath, projectInfo.body.basemodel_obj, null, null);
                    localStorage.setItem('project3d', projectInfo.body.name);
                    break;

                case 'json/assimp':

                    editor.clear();
                    editor.deselect();
                    loadAssimpJSON(editor.path + projPath + '\\' + projectInfo.body.basemodel_json, loadingManager);
                    localStorage.setItem('project3d', projectInfo.body.name);
                    break;

                case 'json/three':

                    alert(editor.languageData.Notsupportedyet);
                    break;

                default:

                    alert(editor.languageData.SorrysomethingwentwrongPleasetryagainaftersometime);
                    //Modified for activity logging start
                    try{

                        //Modified for activity logging start
                        var logDatas = {};
                        logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Error opening project";
                        logger.addLog( logDatas );
                        logger.sendLogs( localStorage.getItem( 'U_ID' ) );
                        //Modified for activity logging end

                    }
                    catch( exception ){

                        console.log( "Logging failed!" );
                        console.log( exception );

                    }
                    //Modified for activity logging end

            }

        }
        /* status == 'modified' means this is a previously saved project */
        else if (projectInfo.status == 'modified') {

            //projType, projPath;
            var downloadWorker = new Worker('assets/js/workerlibrary/DownloadWorker.js');
            var scope = this;
            downloadWorker.onmessage = function(e) {

                var resp = e.data;

                if (resp.status == 'progressing') {

                    editor.progressBar.updateProgress(editor.languageData.DownloadingFiles, (resp.body.progress / 100));

                } else if (resp.status === 'success') {

                    var sceneAsJson = resp.body;
                    downloadWorker.terminate();
                    console.timeEnd('Project Load Process : ');
                    scope.loadThreeJson(sceneAsJson, editor.path + projPath + '/');

                }

            }

            localStorage.setItem('project3d', projectInfo.body.name);
            var downPath = editor.path + projectInfo.body.basemodel_path + '/' + projectInfo.body._id + '.zip';
            var resType = 'blob';

            console.time('Project Load Process : ');
            downloadWorker.postMessage({ downloadPath: downPath, respType: resType });

        }

    }
	
	/**
	 * loadSharedUrl( urlId ) - Restores the project context from a published project URL. 
	 * @param {String} urlId - Unique id of the published URL
	 * @return {Void}
	 * @author Hari
	 */
	this.loadSharedUrl = function( urlId ){
		
		var scope = this;
		editor.progressBar.updateProgress( editor.languageData.Initializing, 0.0 );
		editor.progressBar.show();
		var loadingManager = new THREE.LoadingManager();
		loadingManager.onStart = function ( url, itemsLoaded, itemsTotal ) {

			console.log( 'Started loading file: Progress :'+((itemsLoaded/itemsTotal)*100)+'%' );
			editor.progressBar.updateProgress(editor.languageData.DownloadingFiles,0.0);

		};

		loadingManager.onLoad = function ( ) {

			console.log( 'Loading complete!');
			editor.progressBar.hide();

		};


		loadingManager.onProgress = function ( url, itemsLoaded, itemsTotal ) {

			var percent = ( itemsLoaded / itemeditor.languageData.DownloadingFiles,Number(Math.round(percent/100)));

		};

		loadingManager.onError = function ( url ) {

			console.log( 'There was an error loading ' + url );

		};

		var fileType;
		var getPublishedData = new ApiHandler();
		getPublishedData.prepareRequest( {
			
			method: 'get',  
			url: editor.api + 'projects3d/url/' + urlId,
			responseType : 'json',
			isDownload : false,
			formDataNeeded: false, 
			formData: ''
			
		} );
		
		getPublishedData.onStateChange( function( response ){
			
			if( Number( response.status ) == 200 ){

				switch( response.body.type ){

					case "json/three":
					{
						var path = response.body.url;
						var downloadWorker = new Worker( 'assets/js/workerlibrary/DownloadWorker.js' );
						downloadWorker.onmessage = function( e ){
				
							var resp = e.data;
				
							if( resp.status == 'progressing' ){
								
								editor.progressBar.updateProgress( editor.languageData.DownloadingFiles, ( resp.body.progress / 100 ) );
				
							}
							else if( resp.status === 'success' ){
				
								var sceneAsJson = resp.body;
								downloadWorker.terminate();
								scope.loadThreeJson( sceneAsJson, editor.path + path + '/' );
				
							}
				
						}

						var downPath = editor.path + path + '/' + response.body.otherFormat;
						var resType = 'blob';

						downloadWorker.postMessage( { downloadPath : downPath, respType : resType } );
						break;
					}

					case "json/assimp":
					{
						var path = response.body.url;
						loadAssimpJSON( editor.path + path + '\\' + response.body.otherFormat, loadingManager );
						break;
					}

					case "objmtl":
					{
						var path = response.body.url;
						loadObjMtl( response.body.obj, editor.path + path + '\\', response.body.obj, editor.path + path + '\\', response.body.mtl );
						break;
					}

					case "obj":
					{
						var path = response.body.url;
						loadObjMtl( response.body.obj, editor.path + path + '\\', response.body.obj, null, null );
						break;
					}

					default:
						console.log( 'unsupported type' );
                }
                editor.isFromPublishedUrl = true;
                editor.publishedUrlID = urlId;

			}
			else if( Number( response.status ) == 204 ){

				//alert( 'This link has expired. Please try another one.' );
				alert( editor.languageData.ThislinkhasexpiredPleasetryanotherone );
				$( '.overlay' ).hide();
                editor.progressBar.hide();
                editor.isFromPublishedUrl = false; // resetting the flag
                editor.publishedUrlID = '';
				return;

			}
			
		}, function( error ){
			
            console.log( error );
            editor.isFromPublishedUrl = false; // resetting the flag
            editor.publishedUrlID = '';
            toastr.error( editor.languageData.SorrysomethingwentwrongPleasetryagainaftersometime );
            
			
		} );
		
		//Progress trackers for the http request
		getPublishedData.setProgressTrackers( function( info ){
			
			//console.log( 'uploading' );
			
		}, function( info ){
			
			console.log( 'downloading' );
			if( info.status == 500 ){
				
				console.log( "Error contacting server!" );
		
			}
			
			
		} );
		
		getPublishedData.sendRequest();
	
	}

    function handleJSON(data, file, filename) {


        if (data.metadata === undefined) { // 2.0

            data.metadata = { type: 'Geometry' };

        }

        if (data.metadata.type === undefined) { // 3.0

            data.metadata.type = 'Geometry';

        }

        if (data.metadata.formatVersion !== undefined) {

            data.metadata.version = data.metadata.formatVersion;

        }

        switch (data.metadata.type.toLowerCase()) {

            case 'buffergeometry':

                var loader = new THREE.BufferGeometryLoader();
                var result = loader.parse(data);
                var mesh = new THREE.Mesh(result);
                editor.execute(new AddObjectCommand(mesh));

                //Modified for activity logging start
                try{

                    var logDatas = {};
                    logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " finished importing JSON file: " + filename + " Added Mesh : " + mesh.name;
                    logger.addLog( logDatas );
                    logger.sendLogs( localStorage.getItem( 'U_ID' ) );

                }
                catch( exception ){

                    console.log( "Logging failed!" );
                    console.log( exception );
    
                }
                //Modified for activity logging end

                break;

            case 'geometry':
                var loader = new THREE.JSONLoader();
                loader.setTexturePath(scope.texturePath);

                var result = loader.parse(data);
                var geometry = result.geometry;
                var material;
                if (result.materials !== undefined) {

                    if (result.materials.length > 1) {

                        material = new THREE.MultiMaterial(result.materials);

                    } else {

                        material = result.materials[0];

                    }

                } else {

                    material = new THREE.MeshStandardMaterial();

                }

                geometry.sourceType = "ascii";
                geometry.sourceFile = file.name;

                var mesh;

                if (geometry.animation && geometry.animation.hierarchy) {

                    mesh = new THREE.SkinnedMesh(geometry, material);

                } else {

                    mesh = new THREE.Mesh(geometry, material);

                }
                mesh.name = filename;
                editor.execute(new AddObjectCommand(mesh));

                //Modified for activity logging start
                try{

                    var logDatas = {};
                    logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " finished importing JSON file:" + filename + " Added Mesh : " + mesh.name;
                    logger.addLog( logDatas );
                    logger.sendLogs( localStorage.getItem( 'U_ID' ) );

                }
                catch( exception ){

                    console.log( "Logging failed!" );
                    console.log( exception );
    
                }
                //Modified for activity logging end

                break;

            case 'object':

                var loader = new THREE.ObjectLoader();
                loader.setTexturePath(scope.texturePath);
                var result = loader.parse(data);

                /*MODIFIED FOR PUSHING CAMERAS TO EDITOR.CAMERA_ARRAY END*/

                if (result instanceof THREE.Scene) {

                    editor.execute(new SetSceneCommand(result));

                    //Modified for activity logging start
                    try{

                        var logDatas = {};
                        logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " finished importing JSON file:" + filename + " Applied scene from JSON";
                        logger.addLog( logDatas );
                        logger.sendLogs( localStorage.getItem( 'U_ID' ) );

                    }
                    catch( exception ){

                        console.log( "Logging failed!" );
                        console.log( exception );
        
                    }
                    //Modified for activity logging end

                } else {

                    editor.execute(new AddObjectCommand(result));

                    //Modified for activity logging start
                    try{

                        var logDatas = {};
                        logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " finished importing JSON file:" + filename + " Added Object from JSON";
                        logger.addLog( logDatas );
                        logger.sendLogs( localStorage.getItem( 'U_ID' ) );

                    }
                    catch( exception ){

                        console.log( "Logging failed!" );
                        console.log( exception );
        
                    }
                    //Modified for activity logging end

                }

                break;

            case 'app':

                editor.fromJSON(data);

                break;

        }

    };

    /*MODIFIED TO LOAD THE EXPORTED PROJECTS SAVED IN LOCAL DISK START*/
    this.loadProject = function(file, projNewName) {

        var formData = new FormData();
        var uid = localStorage.U_ID;
        formData.append('file',file,projNewName);
        formData.append('uid',JSON.stringify(uid));
        editor.progressBar.updateProgress(editor.languageData.Initializing, 0.0);
        editor.progressBar.show();
        editor.progressBar.updateProgress( editor.languageData.UploadingProject, 0.20);

        upload_project = $.ajax({
            url: editor.api + 'uploadproject',
            type: 'POST',
            contentType: false,
            processData: false,
            data: formData,
            success: function(response) {
                
                var data = response.data;
                if( response.status == 200) {

                    toastr.success('<div>' + editor.languageData.Succesfullyimportedproject + '</div><div><button class="btn btn-primary btn-sm" id="open-imported-project" style="margin-right:1px">' + editor.languageData.Yes + '</button><button class="btn btn-danger btn-sm" style="margin-left:1px">' + editor.languageData.No + '</button></div>');
                    editor.progressBar.updateProgress( editor.languageData.UploadedProject, 0.99);
                    editor.progressBar.hide();

                    document.getElementById('open-imported-project').addEventListener('click', function() {

                        if (Object.keys(editor.activeProject).length != 0) {

                            if (confirm(editor.languageData.Doyouwishtoabandoncurrentprojectandstartanother) === false) return;
                
                        }
                
                        document.getElementById('project-title-3d').innerHTML = '';
                        document.getElementById('editor-reset').click();

                        var project = data;
                        editor.progressBar.updateProgress(editor.languageData.Initializing, 0.0);
                        editor.progressBar.show();
                        localStorage.setItem('project3d', project.name);
                
                        //Modified for activity logging start
                        try{
                
                            //Modified for activity logging start
                            var logDatas = {};
                            logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Attempting to open project " + project.name;
                            logger.addLog( logDatas );
                            logger.sendLogs( localStorage.getItem( 'U_ID' ) );
                            //Modified for activity logging end
                
                        }
                        catch( exception ){
                
                            console.log( "Logging failed!" );
                            console.log( exception );
                
                        }
                        //Modified for activity logging end
                
                        if (project.updated_at == undefined || project.updated_at == '' || project.updated_at == null) {
                
                            editor.loader.openProject({ status: 200, body: project });
                
                        } else {
                
                            editor.loader.openProject({ status: 'modified', body: project });
                
                        }
                        editor.activeProject = project;
                        document.getElementById('project-title-3d').innerHTML = project.name;

                    });

                } else if( response.status == 409 ) {
                    editor.progressBar.hide();
                    toastr.info(editor.languageData.ProjectwithsamenamealreadyexistsPleasesavethezipfileusingadifferentname);

                } else {
                    editor.progressBar.hide();
                    toastr.error(editor.languageData.Failedtoimportedproject);

                }

            },
            error: function(err) {

                editor.progressBar.hide();
                toastr.error(editor.languageData.Failedtoimportedproject);
                console.log(err);

            }
        })

    }
    /*MODIFIED TO LOAD THE EXPORTED PROJECTS SAVED IN LOCAL DISK END*/

    /*MODIFIED TO LOAD THE EXPORTED PROJECTS SAVED FROM DROP BOX START*/
    this.loadProjectFromDropBox = function(urlToFile,newProjNmeForDropBx) {

        var uid = localStorage.U_ID;
        editor.progressBar.updateProgress('Importing',  0.3);

        upload_project = $.ajax({
            url: editor.api + 'uploadProjectFromDropBox',
            type: 'POST',
            data: {"urlToFile" : urlToFile, "newProjNmeForDropBx": newProjNmeForDropBx, "uid" : uid},
            success: function(response) {
                editor.progressBar.updateProgress('Importing',  0.5);
                var data = response.data;
                if( response.status == 200) {
                    editor.progressBar.updateProgress('Importing',  1);
                    toastr.success('<div>' + editor.languageData.Succesfullyimportedproject + '</div><div><button class="btn btn-primary btn-sm" id="open-imported-project" style="margin-right:1px">' + editor.languageData.Yes + '</button><button class="btn btn-danger btn-sm" style="margin-left:1px">' + editor.languageData.No + '</button></div>');
                    editor.progressBar.updateProgress( editor.languageData.UploadedProject, 0.99);
                    editor.progressBar.hide();

                    document.getElementById('open-imported-project').addEventListener('click', function() {

                        if (Object.keys(editor.activeProject).length != 0) {

                            if (confirm(editor.languageData.Doyouwishtoabandoncurrentprojectandstartanother) === false) return;
                
                        }
                
                        document.getElementById('project-title-3d').innerHTML = '';
                        document.getElementById('editor-reset').click();

                        var project = data;
                        editor.progressBar.updateProgress(editor.languageData.Initializing, 0.0);
                        editor.progressBar.show();
                        localStorage.setItem('project3d', project.name);
                
                        //Modified for activity logging start
                        try{
                
                            //Modified for activity logging start
                            var logDatas = {};
                            logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Attempting to open project " + project.name;
                            logger.addLog( logDatas );
                            logger.sendLogs( localStorage.getItem( 'U_ID' ) );
                            //Modified for activity logging end
                
                        }
                        catch( exception ){
                
                            console.log( "Logging failed!" );
                            console.log( exception );
                
                        }
                        //Modified for activity logging end
                
                        if (project.updated_at == undefined || project.updated_at == '' || project.updated_at == null) {
                
                            editor.loader.openProject({ status: 200, body: project });
                
                        } else {
                
                            editor.loader.openProject({ status: 'modified', body: project });
                
                        }
                        editor.activeProject = project;
                        document.getElementById('project-title-3d').innerHTML = project.name;

                    });

                } else if( response.status == 409 ) {

                    toastr.info(editor.languageData.ProjectwithsamenamealreadyexistsPleasesavethezipfileusingadifferentname);
                    editor.progressBar.hide();

                } else {

                    toastr.error(editor.languageData.Failedtoimportedproject);
                    editor.progressBar.hide();

                }

            },
            error: function(err) {

                toastr.error(editor.languageData.Failedtoimportedproject);
                editor.progressBar.hide();
                console.log(err);

            }
        })

    }
    /*MODIFIED TO LOAD THE EXPORTED PROJECTS SAVED FROM DROP BOX END*/

};