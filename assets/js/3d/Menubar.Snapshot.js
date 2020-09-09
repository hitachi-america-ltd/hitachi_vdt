Menubar.Snapshot = function(editor) {

    var signals = editor.signals;

    var container = new UI.Panel();
    container.setClass('menu');

    var title = new UI.Panel();
    title.setClass('title fa fa-camera screenshotcamera');
    title.setId('snapshot');
    title.setStyle('display', ['none']);
    //var selectedCamera = editor.selected;
    var selectedCamera;


    var cameraX, cameraY, cameraZ;
    var cameraTiltX, cameraTiltY, cameraTiltZ;
    var focus;
    var distance;
    var cameraBrand;
    var cameraBrandmodel;
    var cameraLocation;
    var filmgauge;
    var fov;
    var nameOfCamera, helper;

    function takecamerasnapshot() {

        selectedCamera.children[0].visible = true;
        selectedCamera.children[1].visible = true;
        var helper = new THREE.CameraHelper(selectedCamera, new THREE.Color(editor.selected.helperColor));
        editor.execute(new AddObjectCommand(helper));

        var camera = editor.camera.clone();
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight)
        renderer.render(editor.scene, camera);
        var url = renderer.domElement.toDataURL().replace("image/png", "image/octet-stream");
        var cameraName = (editor.selected.name).replace('Perspective', '');
        var filename = editor.filenamethreed + 'positionImage';
        editor.filenamethreed = editor.filenamethreed + 'positionImage';
        //var filename = editor.filenamethreed+'positionImage';
        var file = dataURItoBlob(url, 'image/png', filename, camerascreenshot);
        editor.execute(new RemoveObjectCommand(helper));

    }

    var camerascreenshot = function(uid, fds) {

        $.ajax({
            url: editor.api + 'cameraScreenshot/' + uid,
            type: 'POST',
            processData: false,
            contentType: false,
            data: fds,
            success: function(response) {

                toastr.success(editor.languageData.SuccessfullyUploadedToServer);
                selectedCamera.children[0].visible = false;
                selectedCamera.children[1].visible = false;

            },
            error: function(jqxhr, status, msg) {
                toastr.error(editor.languageData.UploadFailedTryAgain);
            }
        });

    }

    var simulatedscreenshot = function( uid, fds ) {

        $.ajax({
            url: editor.api + 'screenshot/' + uid,
            type: 'POST',
            processData: false,
            contentType: false,
            data: fds,
            success: function(response) {

                var cameraUserdata = editor.scene.userData;
                var selectedCameraId = selectedCamera.uuid;
                if (!cameraUserdata.hasOwnProperty(selectedCameraId)) {
                    var value = []
                    var position = { "x": cameraX, "y": cameraY, "z": cameraZ };
                    var rotation = { "x": cameraTiltX, "y": cameraTiltY, "z": cameraTiltZ }
                    var newimg = editor.filenamethreed + "positionImage.jpg";
                    var data = { "screenshotname": editor.filenamethreed + '.jpg', "position": position, "rotation": rotation, "positionimage": newimg, "focus": focus, "distance": distance, "cameraBrand": cameraBrand, "cameraBrandmodel": cameraBrandmodel, "cameraLocation": cameraLocation, "filmgauge": filmgauge, "fov": fov, "name": nameOfCamera };
                    value.push(data);
                    cameraUserdata[selectedCameraId] = value;
                    editor.execute(new SetValueCommand(editor.scene, 'userData', cameraUserdata));

                } else {
                    var currentCameraArray = cameraUserdata[selectedCameraId];
                    var position = { "x": cameraX, "y": cameraY, "z": cameraZ };
                    var rotation = { "x": cameraTiltX, "y": cameraTiltY, "z": cameraTiltX }
                    var newimg = editor.filenamethreed + "positionImage.jpg";
                    var data = { "screenshotname": editor.filenamethreed + '.jpg', "position": position, "rotation": rotation, "positionimage": newimg, "focus": focus, "distance": distance, "cameraBrand": cameraBrand, "cameraBrandmodel": cameraBrandmodel, "cameraLocation": cameraLocation, "filmgauge": filmgauge, "fov": fov, "name": nameOfCamera }
                    currentCameraArray.push(data);
                    cameraUserdata[selectedCameraId] = currentCameraArray;
                    editor.execute(new SetValueCommand(editor.scene, 'userData', cameraUserdata));
                }

                toastr.success(editor.languageData.SuccessfullyUploadedToServer);
                //takecamerasnapshot();
            },
            error: function(jqxhr, status, msg) {
                toastr.error(editor.languageData.UploadFailedTryAgain);
            }
        });
    }

    title.onClick(function() {
        
        selectedCamera = editor.selected;

        if( editor.activeProject.user_id != undefined ){
            selectedCamera.children[0].visible = true;
            selectedCamera.children[1].visible = true;

            if( !( selectedCamera instanceof THREE.PerspectiveCamera ) ){

                alert(editor.languageData.Selectacamerathenclickonthesnapshotbuttontotakesnapshot);
                return;

            }
            
            //tell the renderer to take the snapshot
            editor.takeSnapShot = true;
            editor.takeViewportSnapShot = true;

            cameraX, cameraY, cameraZ;
            cameraTiltX, cameraTiltY, cameraTiltZ;
            focus = editor.selected.focus;
            distance = editor.selected.far - editor.selected.near;
            cameraBrand = editor.selected.userData.cameraBrand;
            cameraBrandmodel = editor.selected.userData.cameraModel;
            cameraLocation = editor.selected.userData.location;
            filmgauge = editor.selected.filmGauge;
            fov = editor.selected.fov;
            nameOfCamera = editor.selected.name;

            cameraX = (editor.selected.position.x).toFixed(0);
            cameraY = (editor.selected.position.y).toFixed(0);
            cameraZ = (editor.selected.position.z).toFixed(0);
            cameraTiltX = ((editor.selected.rotation.x) * 57.32).toFixed(0);
            cameraTiltY = ((editor.selected.rotation.y) * 57.32).toFixed(0);
            cameraTiltZ = ((editor.selected.rotation.z) * 57.32).toFixed(0);

            helper = new THREE.CameraHelper( selectedCamera, new THREE.Color( selectedCamera.helperColor ) );
            editor.execute( new AddObjectCommand( helper ) );

        }
        else{
        
            toastr.error( editor.languageData.Youhavetobeonaprojectbeforeyoutakethesnapshot );

        }    




    });

    container.add(title);

    return container;

};