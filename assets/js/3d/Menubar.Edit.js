/**
 * @author mrdoob / http://mrdoob.com/
 */

Menubar.Edit = function(editor) {

    var container = new UI.Panel();
    container.setClass('menu');

    var title = new UI.Panel();
    title.setClass('title');
    title.setTextContent(editor.languageData.Edit);
    container.add(title);

    var options = new UI.Panel();
    options.setClass('options');
    container.add(options);

    // Undo

    var undo = new UI.Row();
    undo.setClass('option');
    undo.setTextContent(editor.languageData.Undo +'(Ctrl+Z)');
    undo.onClick(function() {

        editor.undo();

    });
    options.add(undo);

    // Redo

    var redo = new UI.Row();
    redo.setClass('option');
    redo.setTextContent(editor.languageData.Redo + '(Ctrl+Shift+Z)');
    redo.onClick(function() {

        editor.redo();

    });
    options.add(redo);

    // Clear History

    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent(editor.languageData.ClearHistory);
    option.onClick(function() {

        if (confirm(editor.languageData.TheUndoRedoHistorywillbeclearedAreyousure)) {

            editor.history.clear();

        }

    });
    options.add(option);


    editor.signals.historyChanged.add(function() {

        var history = editor.history;

        undo.setClass('option');
        redo.setClass('option');

        if (history.undos.length == 0) {

            undo.setClass('inactive');

        }

        if (history.redos.length == 0) {

            redo.setClass('inactive');

        }

    });

    // ---

    options.add(new UI.HorizontalRule());

    // Clone

    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent(editor.languageData.Clone);
    option.onClick(function() {

        var object = editor.selected;

        if( object === null ) return;
        
        else if ( object.parent === null) return; // avoid cloning the camera or scene

        else if( ( object instanceof THREE.Sprite ) && ( object.userData.checkLOSFlag ) ) return;
        
        //Modified to clone camera
        else if( editor.selected != null && editor.selected instanceof THREE.PerspectiveCamera ){

            editor.signals.cloneCamera.dispatch( object );

        } else if( object instanceof THREE.Group && object.userData && object.userData.modelType === 'not-a-base-model' ){
            
            function castShadow(){
        
                setTimeout( () => {
                    var castShadowObject = editor.selected;
                    if( castShadowObject && castShadowObject instanceof THREE.Group && castShadowObject.userData && castShadowObject.userData.modelType === 'not-a-base-model' ){
                        castShadowObject.children[0].castShadow = true;
                    }
                }, 1500 );
    
            }
    
            async function loadModel( objectName ){
                
                var preloadModels = new PreloadModel(editor);
                preloadModels.personOrLuggage( position, objectName, type, { 'x':object.scale.x, 'y': object.scale.y, 'z': object.scale.z  } );
                await castShadow();
            }

            var position = new THREE.Vector3( object.position.x + 2, object.position.y, object.position.z + 2 );
            var type = object.userData.type;
            var objectName;
            if( type === "medium-luggage" || type === "large-luggage" ){

                if( editor.scene.userData.luggageDeletedNumber != undefined && editor.scene.userData.luggageDeletedNumber.deletedLuggageArray.length > 0 ){
                    var objectName = "Luggage" + editor.luggageObjectDeletedNumber[0];
                    editor.luggageObjectDeletedNumber.splice( 0, 1 );
                } else{
                    var objectName = "Luggage" + editor.scene.userData.luggageObjectCounter;
                    editor.scene.userData.luggageObjectCounter++;
                }     
        
            }
            else if( type === "person" ){

                if( editor.scene.userData.personDeletedNumber != undefined && editor.scene.userData.personDeletedNumber.deletedPersonArray.length > 0 ){
                    var objectName = "Person" + editor.personObjectDeletedNumber[0];
                    editor.personObjectDeletedNumber.splice( 0, 1 );
                } else{
                    var objectName = "Person" + editor.scene.userData.personObjectCounter;
                    editor.scene.userData.personObjectCounter++;
                }     
        
            }

            loadModel( objectName );
    

        } else if( object instanceof THREE.Group && object.userData && object.userData.sensorData ){

            var sensorData = object.userData.sensorData;
            var addSmartSensor = new SelectSmartSensor( editor );
            var point = object.position.clone();
            point.x += 1

            if( editor.scene.userData.smartSensorCounter === undefined ){
                editor.scene.userData.smartSensorCounter = 1;
            }
    
            if( editor.scene.userData.sensorDeletedNumber != undefined && editor.scene.userData.sensorDeletedNumber.deletedSensorArray.length > 0 ){
                badgeText = editor.smartSensorDeletedNumber[0];
                editor.smartSensorDeletedNumber.splice( 0, 1 );
    
            } else{
                var badgeText = editor.scene.userData.smartSensorCounter;
                editor.scene.userData.smartSensorCounter++;
            }    

            var imageUrl = sensorData.imageUrl.split( "/" );
            imageUrl = imageUrl[ imageUrl.length - 1 ]

            var spec = {
                sensorImageUrl : imageUrl, sensorCategory : sensorData.category, sensorSubCategory : sensorData.subCategory, sensorBrand : sensorData.brandName, sensorModel : sensorData.modelName, sensorCoverage : sensorData.radius, sensorHeight: sensorData.height, connectionLists : sensorData.connectionLists, frustum: sensorData.frustum
            }
            if( sensorData.sensorAngle )
                spec.sensorAngle = sensorData.sensorAngle;
            
            if( sensorData.sphereType )
                spec.sphereType = sensorData.sphereType

            addSmartSensor.addSensortoScene( point, spec, badgeText );

        }

        else{

            object = object.clone();
            editor.execute(new AddObjectCommand(object));

        }


    });
    options.add(option);

    // Delete

    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent(editor.languageData.Delete);
    option.onClick(function() {

        var object = editor.selected;
        var referenceObject;

        if( object == null ){

            return;

        } 

        var re = /^AreaMeasureMarker[1-4]/g;
        var reMarker = /^(NetworkMarker[\d+])/g;
        if( re.test( object.name ) && ( object.parent.name === "AreaSelectionRectangle" ) ) {
           
            return null;

        }

        else if( ( object.name === 'StartMeasurementMarker' || object.name === 'EndMeasurementMarker' ) && object.parent.name === "MeasurementConnectionLine" ) {
            
            return null;
            
        }

        else if( reMarker.test( object.name ) && ( object.parent.name === "NetworkingCable" ) ) {

            return null;

        }
        if (object.type == "Group" && (object.children[0] instanceof THREE.Mesh)){
            if ( editor.camLock == true ) {
                document.getElementById('move_with_model').click();
            }
        }
        /*MODIFIED FOR REMOVING CAMERA */
        var delete_index = editor.camera_array.indexOf(object);
        /*MODIFIED FOR REMOVING CAMERA */

        if (confirm(editor.languageData.Delete  + object.name + '?') === false) return;

        
        /* Delete the camera generating Point*/
        if (object.name == "cameraGeneratingSprite"){

            editor.execute(new RemoveObjectCommand(editor.cameraGenerateLine.line));
            editor.setCamera = 0;
            editor.setCameraRotation = 1;
            editor.targetLocked = !editor.targetLocked;
           
        }

        /* Delete the camera generating Point*/
        /*Delete the camera Reference Point*/
        if (object instanceof THREE.PerspectiveCamera) {

            if(editor.scene.userData.cameraList){

                var newarray = editor.scene.userData.cameraList[object.uuid];
                var currentCameraBadgeNumber = object.badgeText;
                delete editor.scene.userData.cameraList[object.uuid];
            }
            
            editor.cameraDeletedNumber.push(object.badgeText);
            editor.cameraDeletedNumber.sort(function(a, b) {
              return b - a;
            });
            
            if (object.userData.objectUuid != "notset") {

                if (confirm(editor.languageData.ReferencePointalsoDeleted ) === false) {

                    //editor.cameraDeletedNumber.pop();
                    editor.cameraDeletedNumber.splice( editor.cameraDeletedNumber.indexOf(currentCameraBadgeNumber), 1 );
                    if(editor.scene.userData.cameraList){
                        editor.scene.userData.cameraList[object.uuid] = newarray;
                    } 
                   
                    return;

                } else {

                    editor.scene.traverse(function(child) {
                        if (child.uuid === object.userData.objectUuid) {

                            referenceObject = child;

                            if(editor.allReferencePoint.indexOf(child) != -1){

                                var indexOfObject = editor.allReferencePoint.indexOf(child);
                                editor.allReferencePoint.splice( indexOfObject , 1 );
         
                            }

                        }
                    });

                }
            }
            simulationManager.handleStop( object );
        }

        /*Delete the camera Reference Point End*/

        /* For update camera while removing the Reference Point*/
        if (object.camerauuid !== undefined) {
            var cameraReference;
            var userData;
            var falgUpdate = false;
            editor.scene.traverse(function(child) {
                if (child.uuid === object.camerauuid) {
                    cameraReference = child;
                    if (confirm(editor.languageData.ReferencePointofthe + child.name ) === false) return;
                    userData = { "location": child.userData.location, "cameraBrand": child.userData.cameraBrand, "cameraModel": child.userData.cameraModel, "objectUuid": "notset", "reference": new THREE.Vector3(0, 0, 0), "threeDModelType": child.userData.threeDModelType, "alignment" : child.userData.alignment, "tiltRotationValue": child.userData.tiltRotationValue, "panRotationValue": child.userData.panRotationValue, "rollRotationValue": child.userData.rollRotationValue, "flipped" : child.userData.flipped };
                    falgUpdate = true;

                    //Modified to delete line of sight and details table start
                    if( object.userData.checkLOSFlag && object.userData.checkLOSFlag === 'set' ){
                        
                        var lineuid = object.userData.lineUUID;     
                        line = editor.scene.getObjectByProperty( 'uuid', lineuid);  
                        line.traverse( function( child ){

                            if( child instanceof THREE.Sprite && child.name === "RefCamLineValueBadge" ){

                                var childIndex = editor.refCamBadge.indexOf( child );
                                if( child != -1 ){

                                    editor.refCamBadge.splice( childIndex, 1 );

                                }

                                line.remove( child );

                            }

                        } );  
                    
                        object.userData.checkLOSFlag = "notset";
                        delete object.userData.lineUUID;
                        editor.signals.sceneGraphChanged.dispatch();        

                    }

                    if( object.userData.checkDetailsFlag && object.userData.checkDetailsFlag === 'set' ){

                        var refPointName = object.name;
                        var camNum = refPointName.slice( 14 );
                        var detailsTable = document.querySelector( '#cam__ref__mobilewindow__' + object.uuid );
                        detailsTable.style.display = 'none';
                        object.userData.checkDetailsFlag = "hidden";

                    }

                    //Modified to delete line of sight and details table end
                   
                    if(editor.allReferencePoint.indexOf(object) != -1){

                       var indexOfObject = editor.allReferencePoint.indexOf(object);
                       editor.allReferencePoint.splice( indexOfObject , 1 );

                    }
                }
            });
            //Modified by pivot to delete line of sight start
            if( line != undefined && line != null ){
                        
                editor.execute( new RemoveObjectCommand( line ) );

            }
            //Modified by pivot to delete line of sight end
            if (falgUpdate) {

                editor.execute(new SetValueCommand(cameraReference, 'userData', userData));
                editor.selected = object;

            } else return;

        }
        /* For update camera while removing the Reference Point End*/

        var parent = object.parent;
        if (parent === undefined) return; // avoid deleting the camera or scene

        editor.execute(new RemoveObjectCommand(object));
        /*Delete the refrence Point*/
        if (referenceObject != null) {

            //Modified by Pivot to delete line of sight and details table start
            if( referenceObject.userData.checkLOSFlag && referenceObject.userData.checkLOSFlag === 'set' ){

                var lineuid = referenceObject.userData.lineUUID;    
                var line = editor.scene.getObjectByProperty( 'uuid', lineuid); 
                line.traverse( function( child ){

                    if( child instanceof THREE.Sprite && child.name === "RefCamLineValueBadge" ){

                        var childIndex = editor.refCamBadge.indexOf( child );
                        if( child != -1 ){

                            editor.refCamBadge.splice( childIndex, 1 );

                        }

                        line.remove( child );

                    }

                } );

                referenceObject.userData.checkLOSFlag = "notset";
                delete referenceObject.userData.lineUUID;
                editor.execute( new RemoveObjectCommand( line ) );   
                editor.signals.sceneGraphChanged.dispatch();                         

            }

            if( referenceObject.userData.checkDetailsFlag ){

                if( referenceObject.userData.checkDetailsFlag === 'set' ){

                    var refPointName = referenceObject.name;
                    var camNum = refPointName.slice( 14 );
                    var detailsTable = document.querySelector( '#cam__ref__mobilewindow__' + referenceObject.uuid );
                    detailsTable.style.display = 'none';
                    referenceObject.userData.checkDetailsFlag = "hidden";

                }

            }
            //Modified by Pivot to delete line of sight and details table end
            
            editor.execute(new RemoveObjectCommand(referenceObject));
            referenceObject = null;
        }

        /*MODIFIED FOR REMOVING CAMERA */
        editor.camera_array.splice(delete_index, 1);
        var count = 0;
        editor.scene.traverse(function(child) {

            if (child instanceof THREE.PerspectiveCamera) {
                count = count + 1;

            }
        });
        if (count == 0) {

            editor.cameracount = 1;
        }


        /*MODIFIED FOR REMOVING CAMERA */
       
    });
    /*MODIFIED FOR REMOVING CAMERA */
    options.add(option);

    // Minify shaders

    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent('Minify Shaders');
    option.onClick(function() {

        var root = editor.selected || editor.scene;

        var errors = [];
        var nMaterialsChanged = 0;

        var path = [];

        function getPath(object) {

            path.length = 0;

            var parent = object.parent;
            if (parent !== undefined) getPath(parent);

            path.push(object.name || object.uuid);

            return path;

        }

        var cmds = [];
        root.traverse(function(object) {

            var material = object.material;

            if (material instanceof THREE.ShaderMaterial) {

                try {

                    var shader = glslprep.minifyGlsl([
                        material.vertexShader, material.fragmentShader
                    ]);

                    cmds.push(new SetMaterialValueCommand(object, 'vertexShader', shader[0]));
                    cmds.push(new SetMaterialValueCommand(object, 'fragmentShader', shader[1]));

                    ++nMaterialsChanged;

                } catch (e) {

                    var path = getPath(object).join("/");

                    if (e instanceof glslprep.SyntaxError)

                        errors.push(path + ":" +
                        e.line + ":" + e.column + ": " + e.message);

                    else {

                        errors.push(path +
                            ": Unexpected error (see console for details).");

                        console.error(e.stack || e);

                    }

                }

            }

        });

        if (nMaterialsChanged > 0) {

            editor.execute(new MultiCmdsCommand(cmds), 'Minify Shaders');

        }

        window.alert(nMaterialsChanged +
            " material(s) were changed.\n" + errors.join("\n"));

    });
    //options.add( option );


    return container;

};