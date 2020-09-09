/**
 * TwodView( editor ) - Constructor function for changing view into 2D View
 * @constructor
 * @param {any} editor - The instance of the Editor which manages the overall objects and signals
 * @author Mavelil
 * @returns {void}
 * @example <caption>Example usage of TwodView</caption>
 * var twodView = new TwodView( editor );
 */
var TwodView = function(editor) {

    var renderer = new THREE.WebGLRenderer({ antialias: true });
    var imageData;
    function animate(time) {

        request = requestAnimationFrame(animate);
        renderer.render(scene, editor.twodCamera);
        imageData = renderer.domElement.toDataURL();
    }

    function addDom(callback) {

        playerDiv.appendChild(dom);
        callback();

    }

    function addBtnDom() {

        playerDivBtn.appendChild(cameraUp);
        playerDivBtn.appendChild(zoomInBtn);
        playerDivBtn.appendChild(resetViewBtn);
        playerDivBtn.appendChild(topViewBtn);
        playerDivBtn.appendChild(leftViewBtn);
        playerDivBtn.appendChild(rightViewBtn);
        playerDivBtn.appendChild(screenShotBtn);
        playerDivBtn.appendChild(stopScreenShotBtn);
        playerDivBtn.appendChild(zoomOutBtn);
        playerDivBtn.appendChild(cameraDown);
    }

    function dataURItoBlob(dataURI, type) {

        var date = new Date;
        var cameraX = (editor.twodCamera.position.x).toFixed(0);
        var cameraY = (editor.twodCamera.position.y).toFixed(0);
        var cameraZ = (editor.twodCamera.position.z).toFixed(0);
        var cameraTiltX = ((editor.twodCamera.rotation.x) * 57.32).toFixed(0);
        var cameraTiltY = ((editor.twodCamera.rotation.y) * 57.32).toFixed(0);
        var cameraTiltZ = ((editor.twodCamera.rotation.z) * 57.32).toFixed(0);
        // convert base64 to raw binary data held in a string
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

        if(editor.twoViewInLive){

            if (editor.type2dView == 1) {

                editor.filenametwod = "Top_View(" + cameraX + ',' + cameraY + ',' + cameraZ + 'Deg' + cameraTiltX + ',' + cameraTiltY + ',' + cameraTiltZ + ')' + date.getTime();

            }
            if (editor.type2dView == 2) {

                 editor.filenametwod = "Left_View(" + cameraX + ',' + cameraY + ',' + cameraZ + 'Deg' + cameraTiltX + ',' + cameraTiltY + ',' + cameraTiltZ + ')' + date.getTime();

            }
            if (editor.type2dView == 3) {

              editor.filenametwod = "Right_View(" + cameraX + ',' + cameraY + ',' + cameraZ + 'Deg' + cameraTiltX + ',' + cameraTiltY + ',' + cameraTiltZ + ')' + date.getTime();

            }  
        }
        else{

             editor.filenametwod = "Live_View(" + cameraX + ',' + cameraY + ',' + cameraZ + 'Deg' + cameraTiltX + ',' + cameraTiltY + ',' + cameraTiltZ + ')' + date.getTime();

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
                
                toastr.success( editor.languageData.SuccessfullyUploadedToServer );
                //Modified for activity logging start
                try{

                    //Modified for activity logging start
                    var logDatas = {};
                    logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Snapshot taken from live view, image name : "  + editor.filenametwod + ", Project : " + editor.activeProject.name;
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
                
                //error code
                toastr.error( editor.languageData.SomeProblemInServer);
                
                //Modified for activity logging start
                try{

                    //Modified for activity logging start
                    var logDatas = {};
                    logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Snapshot upload failed from live view, : "  + msg;
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

    var dom = document.createElement('div');
    dom.id= "domLive"
    var topViewBtn = document.createElement('button');
    topViewBtn.className = 'btn btn-primary fa fa-arrow-circle-up';
    topViewBtn.innerHTML = '  '+editor.languageData.TopView;

    topViewBtn.addEventListener("click", function() {
        //editor.twodCamera = editor.orthoCamera 
        //render();
        console.log(editor.twodCamera);
        editor.type2dView = 1;
        editor.twoViewInLive = true;
        editor.twodCamera.matrixAutoUpdate = true;
        editor.execute(new SetPositionCommand(editor.twodCamera, new THREE.Vector3(00, 61, 00)));
        editor.execute(new SetRotationCommand(editor.twodCamera, new THREE.Euler(-1.5708, 0, 0)));
       // editor.twodCamera.matrixAutoUpdate = false;

    });

    var leftViewBtn = document.createElement('button');
    leftViewBtn.className = 'btn btn-primary fa fa-arrow-circle-left';
    leftViewBtn.innerHTML = ' '+editor.languageData.LeftView;

    leftViewBtn.addEventListener("click", function() {
       // editor.twodCamera = editor.orthoCamera 
        editor.type2dView = 2;
        editor.twoViewInLive = true;
        editor.twodCamera.matrixAutoUpdate = true;
        editor.execute(new SetPositionCommand(editor.twodCamera, new THREE.Vector3(-60, 7, 00)));
        editor.execute(new SetRotationCommand(editor.twodCamera, new THREE.Euler(-1.5708, -1.5708, -1.5708)));
       // editor.twodCamera.matrixAutoUpdate = false;

    });

    var rightViewBtn = document.createElement('button');
    rightViewBtn.className = 'btn btn-primary fa fa-arrow-circle-right';
    rightViewBtn.innerHTML = ' '+editor.languageData.RightView;

    rightViewBtn.addEventListener("click", function() {

        //editor.twodCamera = editor.orthoCamera ;
        editor.type2dView = 3;
        editor.twoViewInLive = true;
        editor.twodCamera.matrixAutoUpdate = true;
        editor.execute(new SetPositionCommand(editor.twodCamera, new THREE.Vector3(60,5, 00)));
        editor.execute(new SetRotationCommand(editor.twodCamera, new THREE.Euler(-3.14159, 1.5708, 3.14159)));
       // editor.twodCamera.matrixAutoUpdate = false;

    });

    var resetViewBtn = document.createElement('button');
    resetViewBtn.className = 'btn btn-primary fa  fa-refresh';
    resetViewBtn.innerHTML = '  '+editor.languageData.Reset;
    resetViewBtn.addEventListener("click", function() {

        editor.twoViewInLive = false;
        editor.type2dView = 0;
        editor.twodCamera.matrixAutoUpdate = true;
        editor.twodCamera = Object.create(editor.camera);

    })

    var cameraUp = document.createElement('button');
    cameraUp.className ="btn btn-warning fa fa-arrow-up";
    cameraUp.style.backgroundColor = "rgb(169, 70, 230)";
    cameraUp.addEventListener("click", function() {

        if(editor.type2dView == 2 || editor.type2dView  == 3){
           
            var position =  getPostion(editor.twodCamera);
            var posY = position.y;
            posY--;
            editor.twodCamera.matrixAutoUpdate = true;
            editor.execute(new SetPositionCommand(editor.twodCamera, new THREE.Vector3(position.x,posY, position.z)));
              
  
        }
        else if(editor.type2dView == 1){

            var position =  getPostion(editor.twodCamera);
            var posZ = position.z;
            posZ++;
            editor.twodCamera.matrixAutoUpdate = true;
            editor.execute(new SetPositionCommand(editor.twodCamera, new THREE.Vector3(position.x,position.y, posZ)));

        }

        else{

            toastr.warning( editor.languageData.Onlyfor2Dview );
        }


    })

    var cameraDown = document.createElement('button');
    cameraDown.className ="btn btn-warning fa fa-arrow-down";
    cameraDown.style.backgroundColor = "rgb(169, 70, 230)";
    cameraDown.addEventListener("click", function() {

        if(editor.type2dView == 2|| editor.type2dView  == 3){
          
           var position =  getPostion(editor.twodCamera);
           var posY = position.y;
           posY++;
           editor.twodCamera.matrixAutoUpdate = true;
           editor.execute(new SetPositionCommand(editor.twodCamera, new THREE.Vector3(position.x,posY, position.z)));

        }
        else if(editor.type2dView == 1){
            
            var position =  getPostion(editor.twodCamera);
            var posZ = position.z;
            posZ--;
            editor.twodCamera.matrixAutoUpdate = true;
            editor.execute(new SetPositionCommand(editor.twodCamera, new THREE.Vector3(position.x,position.y, posZ)));
            
        }
        else{
            
            toastr.warning( editor.languageData.Onlyfor2Dview );
        }

    })

    var zoomInBtn = document.createElement('button');
    zoomInBtn.className ="btn btn-warning fa fa-plus-square";
    zoomInBtn.addEventListener("click", function() {
       editor.liveZoombtn =true;
       editor.Zoomoperationcontrol.zoom( new THREE.Vector3( 0, 0, -100) );

    })

    var zoomOutBtn = document.createElement('button');
    zoomOutBtn.className ="btn btn-warning  fa fa-minus-square";
    zoomOutBtn.addEventListener("click", function() {
        editor.liveZoombtn =true;
        editor.Zoomoperationcontrol.zoom( new THREE.Vector3( 0, 0, 100) );
       
    })

    var screenShotBtn = document.createElement('button');
    screenShotBtn.className = 'btn btn-default  fa fa-camera ';
    screenShotBtn.innerHTML = ' '+editor.languageData.Snapshot;
    screenShotBtn.addEventListener("click", function() {
        
        if (editor.activeProject.name != undefined) {
           
            url = imageData.replace("image/png", "image/octet-stream");
            var file = dataURItoBlob(url, 'image/png');
        
        } else {

            toastr.warning( editor.languageData.Youhavetobeonaprojectbeforeyoutakethesnapshot );
        }



    })

    var elem = document.getElementById( "side-twod-btn-content" );
    var stopScreenShotBtn = document.createElement('button');
    stopScreenShotBtn.className = 'btn btn-danger fa fa-close';
    stopScreenShotBtn.innerHTML = '  '+editor.languageData.Exit;
    stopScreenShotBtn.id = "stopSide2dView";
    stopScreenShotBtn.addEventListener("click", function() {
        
        editor.liveTwodViewFlag = false;
        elem.style.color = "#000000";
        elem.className = "fa fa-television span-font-23";
        playerDivBtn.style.marginTop = "300px";
        outerDiv.style = "display:none";
        dom.removeChild(dom.firstChild);
        renderer.dispose();
        editor.twoViewInLive = false;

        //Modified for activity logging start
        try{

            //Modified for activity logging start
            var logDatas = {};
            logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Live view stopped";
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

    var outerDiv = document.getElementById('player_wrapper_2d');
    $( '#player_wrapper_2d' ).resizable( {minWidth : 679.313,
        minHeight : 319.422,
        maxWidth : 922.917,
        maxHeight : 521.422,
        //alsoResize : "#twodViewBtnSide",
        resize : function( event, ui ){
            
            renderer.setSize( (outerDiv.offsetWidth)-40, (outerDiv.offsetHeight)-20 )  
            var heightDiv = document.getElementById('player_wrapper_2d')
			if( heightDiv.style.height ==""){

				playerDivBtn.style.marginTop = '305px'
				var widthDAta = parseInt(heightDiv.style.width,10);
				widthDAta = widthDAta+20;
                heightDiv.style.width = widthDAta +'px';
              
            } 
           else{
    
                var heightDAta = parseInt(heightDiv.style.height, 10);
                heightDAta = heightDAta-20;
                playerDivBtn.style.marginTop = heightDAta+'px';

           }
        }
    });
    var playerDiv = document.getElementById('player_preview_2d');
    var playerDivBtn = document.getElementById('twodViewBtnSide');
    var close = document.getElementById('closeTwodViewSide');
    close.addEventListener("click", function() {

        editor.liveTwodViewFlag = false;
        elem.style.color = "#000000";
        elem.className = "fa fa-television span-font-23";
        playerDivBtn.style.marginTop = "300px";
        outerDiv.style = "display:none";
        dom.removeChild(dom.firstChild);
        renderer.dispose();
        editor.twoViewInLive = false;

        //Modified for activity logging start
        try{

            //Modified for activity logging start
            var logDatas = {};
            logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Live view stopped";
            logger.addLog( logDatas );
            logger.sendLogs( localStorage.getItem( 'U_ID' ) );
            //Modified for activity logging end

        }
        catch( exception ){

            console.log( "Logging failed!" );
            console.log( exception );

        }
        //Modified for activity logging end


    })
    function getPostion(object){

       return  object.position;
        
    }
    var camera;
    //var container = new UI.Panel();
    //container.setId('two-d-view-container');
    //var twodviewSideButton = new UI.Button();
    //twodviewSideButton.setId('side-twod-btn');
    //twodviewSideButton.setClass('fa fa-television fa-3x');
    //twodviewSideButton.onClick(function() {
    document.getElementById( 'side-twod-btn' ).addEventListener( 'click' , function( event ){
        if(editor.cameraGeneratingFlag == true){
            toastr.warning( editor.languageData.Firststopgeneratingcameraandthentryit )
            return

        }
        if( editor.theatreMode ){
            toastr.warning( editor.languageData.Youcantactivatebothliveviewandtheatremodesimultaneously );
            return;   
        }
        if(!editor.selectedView){

            toastr.warning( editor.languageData.Youalreadyin2Dview );
            return;   

        }
        
        elem.style.color = "#500080";
        elem.className = "fa fa-television span-font-23 faa-pulse animated";

        editor.liveTwodViewFlag = true;
        if (dom.firstChild) {

            return;
        }

        var width = 639;
        var height = 299;
        $("#player_wrapper_2d").draggable( {
            containment: "parent"
        } );
        outerDiv.style = "display:block";
       
        renderer.setClearColor(0x000000);
        renderer.setPixelRatio(window.devicePixelRatio);
        dom.appendChild(renderer.domElement);

        scene = editor.scene;
        editor.twodCamera = editor.camera.clone();
        width = playerDiv.offsetWidth;
        height = playerDiv.offsetHeight;
        editor.twodCamera.aspect = width / height;
        // editor.twodCamera.updateProjectionMatrix();
        renderer.setSize(639, 299);
        request = requestAnimationFrame(animate);
        addDom(addBtnDom);

        //Modified for activity logging start
        try{

            //Modified for activity logging start
            var logDatas = {};
            logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Live view started";
            logger.addLog( logDatas );
            logger.sendLogs( localStorage.getItem( 'U_ID' ) );
            //Modified for activity logging end

        }
        catch( exception ){

            console.log( "Logging failed!" );
            console.log( exception );

        }
        //Modified for activity logging end

    } );

    //container.add(twodviewSideButton);
    //return container;

}