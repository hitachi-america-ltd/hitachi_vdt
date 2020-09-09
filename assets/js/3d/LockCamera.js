
/**
 * LockCamera( editor ) : Constructor for locking the cameras on to the model
 * @constructor
 * @param {any} editor - The instance of the Editor which manages the overall objects and signals
 * @returns {Void}
 * @author Nimil
 * @example <caption>Example usage of LockCamera</caption>
 * var lockCamera = new LockCamera( editor );
 */

var LockCamera = function( editor ){

    var cam = [];
    var refPoints = [];
    var personOrLuggage = [];
    var smartSensors = [];
    var editorChild;
    var baseModel;
    var lockCameraBtn = document.getElementById( "move_with_model" );
    lockCameraBtn.addEventListener( 'click',function(){

        cam = [];
        refPoints = [];
        camRefLine = [];
        personOrLuggage = [];
        smartSensors = [];

        baseModel = '';

        if( editor.theatreMode ){
            toastr.warning( editor.languageData.DisableTheatremodeandtryagain );
            return;
        }
        else if( editor.liveTwodViewFlag ){
            toastr.warning( editor.languageData.DisableLive2DView );
            return;
        }
        else if( editor.isntwrkngStarted ){
            toastr.warning( editor.languageData.DisableNetworkingAndTryAgain );
            return;
        }
        else if( editor.isMeasuring ){
            toastr.warning( editor.languageData.DisableLengthMeasurementAndRetry );
            return;
        }
        else if( editor.isAreaMeasuring ){
            toastr.warning( editor.languageData.DisableAreaMeasurementAndRetry );
            return;
        }
        else if( editor.isTwoDMeasuring ){
            toastr.warning( editor.languageData.DisableTwoDDrawingAndRetry );
            return;
        }
        baseModel = editor.setBaseModel();

        if( baseModel !='' ){
            if( editor.camLock == false ){

                editor.scene.traverse( function( child ){
                    if( child instanceof THREE.PerspectiveCamera )
                        cam.push( child );
                    else if( child instanceof THREE.Sprite && (/^Cam Reference [1-9]+[0-9]*/g).test(child.name) )
                        refPoints.push( child );
                    else if( child instanceof THREE.Group && child.userData && child.userData.modelType == 'not-a-base-model' ){
                        if( child.parent instanceof THREE.Scene )
                            personOrLuggage.push( child );
                    }
                    else if( child instanceof THREE.Group && child.userData && child.userData.sensorData ){
                        smartSensors.push( child )
                    }
                } );
                cam.forEach( camera => {
                    if( !camera.isLocked || camera.isLocked == false ){
                        THREE.SceneUtils.attach( camera, editor.scene, baseModel );
                        camera.isLocked = true;
                    }
                    
                });

                refPoints.forEach( refPoint => {

                      THREE.SceneUtils.attach( refPoint, editor.scene, baseModel );  
                    if( refPoint.userData.checkLOSFlag != 'notset' ){

                        var lineuid = refPoint.userData.lineUUID;
                        var LOS = editor.getObjectByUuid( lineuid );
                        LOS.then( function(value){

                        var line = value;
                        line.visible = false;
                        refPoint.userData.checkLOSFlag = 'notset';
                        editor.signals.sceneGraphChanged.dispatch();

                        } );

                    }
                });
                personOrLuggage.forEach( child => {

                    THREE.SceneUtils.attach( child, editor.scene, baseModel );

                } )

                smartSensors.forEach( child => {

                    THREE.SceneUtils.attach( child, editor.scene, baseModel );
                
                } )

                lockCameraBtn.style.color = "#500080";
                lockCameraBtn.innerHTML = '<span id="move_with_model_content" class="fa fa-lock span-font-26 faa-pulse animated">';
                editor.signals.sceneGraphChanged.dispatch();
                editor.camLock = true;
                toastr.success( editor.languageData.Locked );
            }
            else{
                baseModel = {};
                baseModel = editor.setBaseModel();

                var tempChildrenLength = baseModel.children.length;
                for( var i = tempChildrenLength; i>0 ; i-- ){
                    if( baseModel.children[i] instanceof THREE.PerspectiveCamera || baseModel.children[i] instanceof THREE.Sprite && (/^Cam Reference [1-9]+[0-9]*/g).test(baseModel.children[i].name) || baseModel.children[i] instanceof THREE.Group && baseModel.children[i].userData.modelType === 'not-a-base-model' || baseModel.children[i] instanceof THREE.Group && baseModel.children[i].userData && baseModel.children[i].userData.sensorData ) {
        
                        if( baseModel.children[i] instanceof THREE.PerspectiveCamera ){
                            baseModel.children[i].isLocked = false;
                        }
                        THREE.SceneUtils.detach( baseModel.children[i], baseModel, editor.scene );
                    }
                }
                lockCameraBtn.style.color = "#000000";
                lockCameraBtn.innerHTML = '<span id="move_with_model_content" class="fa fa-unlock-alt span-font-26">';
                toastr.success( editor.languageData.UnLocked );
                editor.camLock = false;
                editor.signals.sceneGraphChanged.dispatch();
            }
    }
    else{
        toastr.warning( editor.languageData.BaseModelNotFound );
        return;
    }


    } );

}