/**
 * @author mrdoob / http://mrdoob.com/
 */

Menubar.PlaySelectedCamera = function(editor) {

    var signals = editor.signals;

    var container = new UI.Panel();
    container.setClass('menu');

    var isPlaying = false;

    /*MODIFIED FOR SMALL PLAYER DIV START*/
    //var player = new APP.Player();
    /*MODIFIED FOR SMALL PLAYER DIV END*/

    var camera, scene, renderer, request;
    var dom = document.createElement('div');
    var width = 500;
    var height = 500;

    /*MODIFIED TO FIX WEBGL CRASH START*/
    var imageData;
    var renderDiv = document.getElementById('player_preview');
    //editor.takeSnapShot = false;
    var snapShotRow = new UI.Panel();
    snapShotRow.setClass('title');
    snapShotRow.setId('snap');
    snapShotRow.setTextContent('Take Snapshot');

    snapShotRow.onClick( function(){

        editor.takeSnapShot = true;
        editor.takeViewportSnapShot = true;

    } );

    //container.add( snapShotRow );
    /*MODIFIED TO FIX WEBGL CRASH END*/

    var title = new UI.Panel();
    title.setClass('title');
    title.setId('playcamera');
    title.setTextContent('PlayCamera');

    /*function animate(time) {

        request = requestAnimationFrame(animate);
        renderer.render( scene, camera );
        if( editor.takeSnapShot ){

            var imageData = renderer.domElement.toDataURL();
            var file = dataURItoBlob( imageData, 'image/png', filename );
            editor.takeSnapShot = false;

        }
        
    }*/

    function animate() {
        request = requestAnimationFrame( animate );
        if( editor.takeSnapShot ){
            renderer.setSize( 1440, 720 );
            renderer.render( scene, camera );
            imageData = renderer.domElement.toDataURL();
            editor.signals.cameraSnapshotTaken.dispatch( imageData, camera );
            editor.takeSnapShot = false;
        }
        else{
            renderer.setSize( renderDiv.offsetWidth, renderDiv.offsetHeight );
            renderer.render( scene, camera );
        }
    }

    title.onClick(function() {
        var refObject = [];
        var outerDiv = document.getElementById('player_wrapper');
        var playerDiv = document.getElementById('player_preview');
        editor.scene.traverse(function(child) {

            if (child.camerauuid !== undefined) {

                refObject.push(child);

            }

        });

        $("#player_wrapper").draggable();
        if (isPlaying === false) {

            if (editor.selected instanceof THREE.PerspectiveCamera) {
                outerDiv.style = "display:block";
                document.getElementById('snapshot').style.display = "block";

                renderer = new THREE.WebGLRenderer( { antialias: true } );
                renderer.setClearColor(0x000000);
                renderer.setPixelRatio(window.devicePixelRatio);

                dom.appendChild(renderer.domElement);

                scene = editor.scene;
                editor.hideObjectsOnSimulation( refObject );

                camera = editor.selected;
                width = playerDiv.offsetWidth;
                height = playerDiv.offsetHeight;
                camera.aspect = width / height;
                camera.updateProjectionMatrix();

                /*MODIFIED TO INCLUDE CAMERA FRUSTUM UPDATIONS START*/
                /*if (camera.children[1] != undefined) {

                    if (camera.children[1].name == 'CameraFrustum') {

                        camera.children[1].geometry.updateFromCamera(camera);

                    }

                }*/
                if (camera != undefined) {

                    camera.traverse( function( child ) {

                        if( child.name === "CameraFrustum" ) {

                            child.geometry.updateFromCamera(camera);

                        }

                    } ) 

                }
                editor.helpers[camera.id].update();
                editor.signals.sceneGraphChanged.dispatch();
                /*MODIFIED TO INCLUDE CAMERA FRUSTUM UPDATIONS END*/

                renderer.setSize(width, height);
                playerDiv.appendChild(dom);
                request = requestAnimationFrame(animate);
                isPlaying = true;
                title.setTextContent('Stop');

            } else {
                alert("Please click on a camera and then select this option to view the simulation!");
                outerDiv.style = "display:none";
                return;
            }

        } else {

            editor.showObjectsAfterSimulation(refObject);

            outerDiv.style = "display:none";
            cancelAnimationFrame(request);
            dom.removeChild(dom.firstChild);
            renderer.dispose();
            camera = undefined;
            scene = undefined;
            renderer = undefined;
            document.getElementById('snapshot').style.display = "none";
            title.setTextContent('PlayCamera');
            isPlaying = false;

        }

    });
    container.add(title);

    return container;

};