
/**
 * Menubar.Screenshot2D( editor ) : Constructor for taking the snapshot of any 2D view
 * @constructor
 * @param {any} editor - The instance of the Editor which manages the overall objects and signals
 * @returns {Object<UI.Panel>}
 * @author Mavelil
 * @example <caption>Example usage of Menubar.Screenshot2D</caption>
 * var menubarScreenshot2D = new Menubar.Screenshot2D( editor );
 */

Menubar.Screenshot2D = function(editor) {

    var container = new UI.Panel();
    container.setClass('menu');

    var title = new UI.Panel();
    title.setClass('title fa fa-camera screenshotcamera');
    title.setId('screenshot_2d');
    title.setStyle('display', ['none']);
    //title.setTextContent( 'Screenshot' );

    title.onClick(function() {
        var date = new Date;
        var classListName = document.getElementById("screenshot_2d");
    
        if (editor.activeProject.user_id != undefined) {
            document.getElementById("screenshot_2d").className += " selectMenubar";
            editor.scene.children[1].visible = false;
            editor.scene.children.forEach(function(data) {
                if (data instanceof THREE.Camera) {
                    //  data.children[0].visible = false;
                }
            })
            var cameraX, cameraY, cameraZ ,fov,filmgauge ,distance ,focus;
            var cameraTiltX, cameraTiltY, cameraTiltZ;
            cameraX = (editor.camera.position.x).toFixed(0);
            fov = editor.camera.fov; 
            distance = editor.camera.far - editor.camera.near;
            filmgauge = editor.camera.filmGauge;
            focus = editor.camera.focus;
            cameraY = (editor.camera.position.y).toFixed(0);
            cameraZ = (editor.camera.position.z).toFixed(0);
            cameraTiltX = ((editor.camera.rotation.x) * 57.32).toFixed(0);
            cameraTiltY = ((editor.camera.rotation.y) * 57.32).toFixed(0);
            cameraTiltZ = ((editor.camera.rotation.z) * 57.32).toFixed(0);
            //renderer = new THREE.WebGLRenderer({ antialias: true });
            var a = document.createElement('a');
            editor.takeViewportSnapShot = true;
            //editor.signals.sceneGraphChanged.dispatch();
            //renderer.setSize(window.innerWidth, window.innerHeight)
            //renderer.render(editor.scene, editor.camera);
            
            function dataURItoBlob(dataURI, type) {
                 // convert base64 to raw binary data held in a string
                editor.scene.children[1].visible = true;
                editor.scene.children.forEach(function(data) {
                    if (data instanceof THREE.Camera) {
                        data.children[0].visible = true;
                    }
                })
                var byteString = atob(dataURI.split(',')[1]);

                // separate out the mime component
                var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

                // write the bytes of the string to an ArrayBuffer
                var ab = new ArrayBuffer(byteString.length);
                var ia = new Uint8Array(ab);
                for (var i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }

                // write the ArrayBuffer to a blob, and you're done
                var file = new Blob([ab], { type: type });
               
                //return file;
                var fds = new FormData();
                if (editor.type2dView == 1) {

                    editor.filenametwod = "Top_View"  +Date.now() + "(" + cameraX + ',' + cameraY + ',' + cameraZ + 'Deg' + cameraTiltX + ',' + cameraTiltY + ',' + cameraTiltZ + ')' + "editorCamera";
                    //var topName = editor.filenametwod;
                    // editor.twodTopviewUrl = topName;
                    //editor.topTopView = true;
                }
                else if (editor.type2dView == 2) {

                    editor.filenametwod = "Left_View" +Date.now() +"(" + cameraX + ',' + cameraY + ',' + cameraZ + 'Deg' + cameraTiltX + ',' + cameraTiltY + ',' + cameraTiltZ + ')' + "editorCamera";
                    //var leftName = editor.filenametwod;
                    //editor.twodLeftviewUrl = leftName;
                    //editor.topLeftView = true;

                }
                else if (editor.type2dView == 3) {

                    editor.filenametwod = "Right_View" +Date.now() + "(" + cameraX + ',' + cameraY + ',' + cameraZ + 'Deg' + cameraTiltX + ',' + cameraTiltY + ',' + cameraTiltZ + ')' + "editorCamera";
                    //var rightName = editor.filenametwod;
                    //editor.twodRightviewUrl = rightName;
                    //editor.topRightView = true;


                }
                else if (editor.type2dView == 4) {

                    editor.filenametwod = "Bottom_View" +Date.now() + "(" + cameraX + ',' + cameraY + ',' + cameraZ + 'Deg' + cameraTiltX + ',' + cameraTiltY + ',' + cameraTiltZ + ')' + "editorCamera";
                    //var rightName = editor.filenametwod;
                    //editor.twodRightviewUrl = rightName;
                    //editor.topRightView = true;


                }
                else if (editor.type2dView == 5) {

                    editor.filenametwod = "Front_View" +Date.now() + "(" + cameraX + ',' + cameraY + ',' + cameraZ + 'Deg' + cameraTiltX + ',' + cameraTiltY + ',' + cameraTiltZ + ')' + "editorCamera";
                    //var rightName = editor.filenametwod;
                    //editor.twodRightviewUrl = rightName;
                    //editor.topRightView = true;


                }
                else if(editor.type2dView == 6 ) {

                    editor.filenametwod = "Back_View" +Date.now() + "(" + cameraX + ',' + cameraY + ',' + cameraZ + 'Deg' + cameraTiltX + ',' + cameraTiltY + ',' + cameraTiltZ + ')' + "editorCamera";
                    //var rightName = editor.filenametwod;
                    //editor.twodRightviewUrl = rightName;
                    //editor.topRightView = true;


                }
                fds.append('file', file, editor.filenametwod);
                var uid = localStorage.getItem('U_ID');


                $.ajax({
                    url: editor.api + 'screenshot/' + uid + editor.activeProject.name,
                    type: 'POST',
                    processData: false,
                    contentType: false,
                    data: fds,
                    success: function(response) {
                        var cameraUserdata = editor.scene.userData.cameraList;
                        if( cameraUserdata == undefined){

                            editor.scene.userData.cameraList= {};
                            cameraUserdata = editor.scene.userData.cameraList
                            var value = []
                            var position = { "x": cameraX, "y": cameraY, "z": cameraZ };
                            var rotation = { "x": cameraTiltX, "y": cameraTiltY, "z": cameraTiltZ }
                            var newimg =  editor.filenametwod + ".jpg";
                            var data = { "screenshotname":  editor.filenametwod + '.jpg', "position": position, "rotation": rotation, "positionimage": newimg, "focus": focus, "distance": distance, "cameraBrand": "Default", "cameraBrandmodel": "Default" , "cameraLocation": "Not Specified", "filmgauge": filmgauge, "fov": fov, "name": "editorCamera" };
                            value.push(data);
                            cameraUserdata["editorCamera"] = value;
                            editor.scene.userData.cameraList = cameraUserdata ;
                            editor.signals.sceneGraphChanged.dispatch();

                        }
                        else{

                            if(cameraUserdata["editorCamera"] == undefined){

                                var currentCameraArray = []
                                var position = { "x": cameraX, "y": cameraY, "z": cameraZ };
                                var rotation = { "x": cameraTiltX, "y": cameraTiltY, "z": cameraTiltZ }
                                var newimg =  editor.filenametwod + ".jpg";
                                var data = { "screenshotname":  editor.filenametwod + '.jpg', "position": position, "rotation": rotation, "positionimage": newimg, "focus": focus, "distance": distance, "cameraBrand": "Default", "cameraBrandmodel": "Default" , "cameraLocation": "Not Specified", "filmgauge": filmgauge, "fov": fov, "name": "editorCamera" };
                                currentCameraArray.push(data);
                                cameraUserdata["editorCamera"] = currentCameraArray;
                                editor.scene.userData.cameraList = cameraUserdata ;
                                editor.signals.sceneGraphChanged.dispatch();

                            }
                            else{

                                var currentCameraArray = cameraUserdata["editorCamera"];
                                var position = { "x": cameraX, "y": cameraY, "z": cameraZ };
                                var rotation = { "x": cameraTiltX, "y": cameraTiltY, "z": cameraTiltZ }
                                var newimg =  editor.filenametwod + ".jpg";
                                var data = { "screenshotname":  editor.filenametwod + '.jpg', "position": position, "rotation": rotation, "positionimage": newimg, "focus": focus, "distance": distance, "cameraBrand": "Default", "cameraBrandmodel": "Default" , "cameraLocation": "Not Specified", "filmgauge": filmgauge, "fov": fov, "name": "editorCamera" };
                                currentCameraArray.push(data);
                                cameraUserdata["editorCamera"] = currentCameraArray;
                                editor.scene.userData.cameraList = cameraUserdata ;
                                editor.signals.sceneGraphChanged.dispatch();
                            }

                        }
                        classListName.classList.remove("selectMenubar");
                        toastr.success( editor.languageData.SuccessfullyUploadedToServer);

                        //Modified for activity logging start
                        try{

                            //Modified for activity logging start
                            var logDatas = {};
                            logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Screenshot taken : " + editor.filenametwod;
                            logger.addLog( logDatas );
                            logger.sendLogs( localStorage.getItem( 'U_ID' ) );
                            //Modified for activity logging end

                        }
                        catch( exception ){

                            console.log( "Logging failed!" );
                            console.log( exception );

                        }
                        //Modified for activity logging end

                    },
                    error: function(jqxhr, status, msg) {
                        classListName.classList.remove("selectMenubar");
                        toastr.error( editor.languageData.SomeProblemInServer);

                        //Modified for activity logging start
                        try{

                            //Modified for activity logging start
                            var logDatas = {};
                            logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Screenshot attempt failed from 2D view : " + msg;
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
                });

            }
            
            editor.signals.viewportSnapshotTaken.addOnce( function( imgDatadata )
            { 
               
                url = imgDatadata.replace("image/png", "image/octet-stream");
                var file = dataURItoBlob(url, 'image/png');
            });

            editor.signals.sceneGraphChanged.dispatch();
  
        } else {
            classListName.classList.remove("selectMenubar");
            toastr.error( editor.languageData.Youhavetobeonaprojectbeforeyoutakethesnapshot );
        }


    });
    container.add(title);

    return container;


};