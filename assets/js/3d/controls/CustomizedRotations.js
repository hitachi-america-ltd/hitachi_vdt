/**
 * CustomizedRotation( editor ) : Constructor for tranversing and selectively rotating parts of 3D Camera Models. 
 * @constructor
 * @param {any} editor - The instance of the Editor which manages the overall objects and signals
 * @author Peeyush
 * @example <caption>Example usage of CustomizedRotation</caption>
 * var customizedRotation = new CustomizedRotation( editor );
 */
var CustomizedRotation = function(editor) {

    var scope = this;

}

CustomizedRotation.prototype = {

    constructor: CustomizedRotation,
    /**
     * traverseDomeCamera( camera ) - Method to traverse and split Dome camera into rim, glass, holder, lens and camera helper icon. 
     * @param {Camera} Camera - The 3D Dome camera 
     * @returns {Object} Returns an object containg rim, glass, holder and lens of 3D Dome Camera.
     * @author Peeyush
     * @example <caption>Example usage of traverseDomeCamera method.</caption>
     * customizedRotation.traverseDomeCamera( camera );
     */
    traverseDomeCamera: function(object) {
        
        
            var cameraParts = {};
            object.traverse( function( subChild ) {
    
                if( subChild.name == "threeDCameraModel" && subChild.type == "Scene" ) {
                    
                    cameraParts.cameraBody = subChild;
                    subChild.traverse( function( subElement ) {
    
                        if( subElement.name == "Rim" ) {
    
                            cameraParts.rim = subElement;
                            
                        }
    
                        if( subElement.name == "Glass" ) {
    
                            cameraParts.glass = subElement;
    
                        }
    
                        //if( subElement.name == "Rotating_Camera_Holder_Z" ) {//Commented for 180 tilt dome camera
                        if( subElement.name == "CameraHolder" ) {
                            cameraParts.lensHolder = subElement;
    
                        }
    
                        //if( subElement.name == "Rotating_camera_Y" ) {//Commented for 180 tilt dome camera
                        if( subElement.name == "Lens" ) {

                            cameraParts.lens = subElement;
        
                        }
    
                        if( subElement instanceof THREE.Sprite ) {
    
                            cameraParts.numberBadge = subElement;
    
                        }
    
                    } )
    
                }
    
            } )
    
            return cameraParts; 
        

    },

    /**
     * tiltDomeCameraUp( camera, rotation ) - Method used to tilt the Threejs camera and the lens part of the 3D Dome camera in the upward direction.
     * @param {camera} camera - The 3D Dome camera. 
     * @param {Number} rotation - The angle of rotation in degree.
     * @returns {Void}
     * @author Peeyush
     * @example <caption>Example usage of tiltDomeCameraUp method.</caption>
     * customizedRotation.tiltDomeCameraUp( camera, 10 );
     */

    tiltDomeCameraUp: function(object,rotation) {

        var scope = this;
        //var parts = scope.traverseDomeCamera(object);
        var parts = scope.traverseDomeCamera( object );

            var glass, rim, lensHolder, cameraBody, numberBadge, extraTiltValue;
            glass = parts.glass;
            rim = parts.rim;
            lensHolder = parts.lensHolder;
            numberBadge = parts.numberBadge;
            cameraBody = parts.cameraBody;

            THREE.SceneUtils.detach( lensHolder, cameraBody, editor.scene );
            THREE.SceneUtils.detach( glass, cameraBody, editor.scene );
            THREE.SceneUtils.detach( rim, cameraBody, editor.scene );
            THREE.SceneUtils.detach( numberBadge, cameraBody, editor.scene );
            cameraBody.updateMatrixWorld();

            if( object.userData.tiltRotationValue > 90 ) {

                extraTiltValue = object.userData.tiltRotationValue - 90;
                object.userData.tiltRotationValue = 90;
                object.rotateOnAxis( new THREE.Vector3(1,0,0), THREE.Math.degToRad(rotation - extraTiltValue) );
                editor.signals.sceneGraphChanged.dispatch();

            } else {

                object.rotateOnAxis( new THREE.Vector3(1,0,0), THREE.Math.degToRad(rotation) );
                editor.signals.sceneGraphChanged.dispatch();    

            }

            THREE.SceneUtils.attach( lensHolder, editor.scene, cameraBody );
            THREE.SceneUtils.attach( glass, editor.scene, cameraBody );
            THREE.SceneUtils.attach( rim, editor.scene, cameraBody );  
            THREE.SceneUtils.attach( numberBadge, editor.scene, cameraBody );  
            editor.scene.updateMatrixWorld(); 

        

    },

    /**
     * tiltDomeCameraDown( camera, rotation ) - Method used to tilt the Threejs camera and the lens part of the 3D Dome camera in the downward direction.
     * @param {camera} camera - The 3D Dome camera. 
     * @param {Number} rotation - The angle of rotation in degree.
     * @returns {Void}
     * @author Peeyush
     * @example <caption>Example usage of tiltDomeCameraDown method.</caption>
     * customizedRotation.tiltDomeCameraDown( camera, 10 );
     */

    tiltDomeCameraDown: function(object,rotation) {

        var scope = this;
        var parts = scope.traverseDomeCamera( object );

            var glass, rim, lensHolder, cameraBody, numberBadge, extraTiltValue;
            glass = parts.glass;
            rim = parts.rim;
            lensHolder = parts.lensHolder;
            numberBadge = parts.numberBadge;
            cameraBody = parts.cameraBody;
    
            THREE.SceneUtils.detach( lensHolder, cameraBody, editor.scene );
            THREE.SceneUtils.detach( glass, cameraBody, editor.scene );
            THREE.SceneUtils.detach( rim, cameraBody, editor.scene );
            THREE.SceneUtils.detach( numberBadge, cameraBody, editor.scene );
            cameraBody.updateMatrixWorld();
    
            //if( object.userData.tiltRotationValue < 0 ) { //Commented for 180 tilt dome camera
            if( object.userData.tiltRotationValue < -90 ) {

                //extraTiltValue = 0 - object.userData.tiltRotationValue;
                extraTiltValue = object.userData.tiltRotationValue + 90;
                //object.userData.tiltRotationValue = 0;
                object.userData.tiltRotationValue = -90;
                //object.rotateOnAxis( new THREE.Vector3(-1,0,0), THREE.Math.degToRad(rotation - extraTiltValue) );
                object.rotateOnAxis( new THREE.Vector3(-1,0,0), THREE.Math.degToRad(rotation + extraTiltValue) );//Commented for 180 tilt dome camera
                editor.signals.sceneGraphChanged.dispatch();
            
            } else {
            
                object.rotateOnAxis( new THREE.Vector3(-1,0,0), THREE.Math.degToRad(rotation) );
                editor.signals.sceneGraphChanged.dispatch();
            
            }
    
            THREE.SceneUtils.attach( lensHolder, editor.scene, cameraBody );
            THREE.SceneUtils.attach( glass, editor.scene, cameraBody );
            THREE.SceneUtils.attach( rim, editor.scene, cameraBody );  
            THREE.SceneUtils.attach( numberBadge, editor.scene, cameraBody );  
            editor.scene.updateMatrixWorld(); 
        
    },

    /**
     * rollDomeCameraLeft( camera, rotation ) - Method used to roll the camera in the 'left' direction.
     * @param {camera} camera - The 3D Dome camera. 
     * @param {Number} rotation - The angle of rotation in degree.
     * @returns {Void}
     * @author Peeyush
     * @example <caption>Example usage of rollDomeCameraLeft method.</caption>
     * customizedRotation.rollDomeCameraLeft( camera, 10 );
     */

    rollDomeCameraLeft: function(object,rotation) {

        if( object.userData.alignment == "top" ) {

            object.rotateOnWorldAxis( new THREE.Vector3(0,1,0), THREE.Math.degToRad(rotation) );
            editor.signals.sceneGraphChanged.dispatch();

        } else if( object.userData.alignment == "left" ) {

            object.rotateOnWorldAxis( new THREE.Vector3(0,0,1), THREE.Math.degToRad(rotation) );
            editor.signals.sceneGraphChanged.dispatch();

        } else if( object.userData.alignment == "right" ) {

            object.rotateOnWorldAxis( new THREE.Vector3(0,0,-1), THREE.Math.degToRad(rotation) );
            editor.signals.sceneGraphChanged.dispatch();

        } else if( object.userData.alignment == "front" ) {

            object.rotateOnWorldAxis( new THREE.Vector3(-1,0,0), THREE.Math.degToRad(rotation) );
            editor.signals.sceneGraphChanged.dispatch();

        } else if( object.userData.alignment == "back" ) {

            object.rotateOnWorldAxis( new THREE.Vector3(1,0,0), THREE.Math.degToRad(rotation) );
            editor.signals.sceneGraphChanged.dispatch();

        }

    },

    /**
     * rollDomeCameraRight( camera, rotation ) - Method used to roll the camera in the 'right' direction.
     * @param {camera} camera - The 3D Dome camera. 
     * @param {Number} rotation - The angle of rotation in degree.
     * @returns {Void}
     * @author Peeyush
     * @example <caption>Example usage of rollDomeCameraRight method.</caption>
     * customizedRotation.rollDomeCameraRight( camera, 10 );
     */

    rollDomeCameraRight: function(object,rotation) {

        if( object.userData.alignment == "top" ) {

            object.rotateOnWorldAxis( new THREE.Vector3(0,-1,0), THREE.Math.degToRad(rotation) );
            editor.signals.sceneGraphChanged.dispatch();

        } else if( object.userData.alignment == "left" ) {

            object.rotateOnWorldAxis( new THREE.Vector3(0,0,-1), THREE.Math.degToRad(rotation) );
            editor.signals.sceneGraphChanged.dispatch();

        } else if( object.userData.alignment == "right" ) {

            object.rotateOnWorldAxis( new THREE.Vector3(0,0,1), THREE.Math.degToRad(rotation) );
            editor.signals.sceneGraphChanged.dispatch();

        } else if( object.userData.alignment == "front" ) {

            object.rotateOnWorldAxis( new THREE.Vector3(1,0,0), THREE.Math.degToRad(rotation) );
            editor.signals.sceneGraphChanged.dispatch();

        } else if( object.userData.alignment == "back" ) {

            object.rotateOnWorldAxis( new THREE.Vector3(-1,0,0), THREE.Math.degToRad(rotation) );
            editor.signals.sceneGraphChanged.dispatch();

        }

    },

    /**
     * panDomeCameraRight( camera, rotation ) - Method used to pan the Threejs camera and the lens/holder part of the 3D Dome Camera in 'right' direction.
     * @param {Camera} Camera - The 3D Dome camera. 
     * @param {Number} rotation - The angle of rotation in degree.
     * @returns {Void}
     * @author Peeyush
     * @example <caption>Example usage of panDomeCameraRight method.</caption>
     * customizedRotation.panDomeCameraRight( camera, 10 );
     */

    panDomeCameraRight: function(object,rotation) {

        var scope = this;
        var parts = scope.traverseDomeCamera( object );

        var glass, rim, lensHolder, cameraBody, numberBadge, extraTiltValue;
        glass = parts.glass;
        rim = parts.rim;
        lensHolder = parts.lensHolder;
        numberBadge = parts.numberBadge;
        cameraBody = parts.cameraBody;
        lens = parts.lens;

        THREE.SceneUtils.detach( glass, cameraBody, editor.scene );
        THREE.SceneUtils.detach( rim, cameraBody, editor.scene );
        THREE.SceneUtils.detach( numberBadge, cameraBody, editor.scene );
        THREE.SceneUtils.detach( lensHolder, cameraBody, editor.scene );
        cameraBody.updateMatrixWorld();

        if( object.userData.alignment == "top" ) {
            
            object.rotateOnWorldAxis( new THREE.Vector3(0,-1,0), THREE.Math.degToRad(rotation) );
            lensHolder.rotateOnWorldAxis( new THREE.Vector3(0,-1,0), THREE.Math.degToRad(rotation) );

            editor.signals.sceneGraphChanged.dispatch();
        
        } else if( object.userData.alignment == "left" ) {
        
            object.rotateOnWorldAxis( new THREE.Vector3(0,0,-1), THREE.Math.degToRad(rotation) );
            lensHolder.rotateOnWorldAxis( new THREE.Vector3(0,0,-1), THREE.Math.degToRad(rotation) );
            
            editor.signals.sceneGraphChanged.dispatch();
        
        } else if( object.userData.alignment == "right" ) {
        
            object.rotateOnWorldAxis( new THREE.Vector3(0,0,1), THREE.Math.degToRad(rotation) );
            lensHolder.rotateOnWorldAxis( new THREE.Vector3(0,0,1), THREE.Math.degToRad(rotation) );
            
            editor.signals.sceneGraphChanged.dispatch();
        
        } else if( object.userData.alignment == "front" ) {
        
            object.rotateOnWorldAxis( new THREE.Vector3(1,0,0), THREE.Math.degToRad(rotation) );
            lensHolder.rotateOnWorldAxis( new THREE.Vector3(1,0,0), THREE.Math.degToRad(rotation) );
            
            editor.signals.sceneGraphChanged.dispatch();
        
        } else if( object.userData.alignment == "back" ) {
        
            object.rotateOnWorldAxis( new THREE.Vector3(-1,0,0), THREE.Math.degToRad(rotation) );
            lensHolder.rotateOnWorldAxis( new THREE.Vector3(-1,0,0), THREE.Math.degToRad(rotation) );
            
            editor.signals.sceneGraphChanged.dispatch();
        
        } else {
        
            object.rotateOnAxis( new THREE.Vector3(0,0,1), THREE.Math.degToRad(rotation) );
        
        }
        editor.signals.sceneGraphChanged.dispatch();

        THREE.SceneUtils.attach( glass, editor.scene, cameraBody );
        THREE.SceneUtils.attach( rim, editor.scene, cameraBody );  
        THREE.SceneUtils.attach( numberBadge, editor.scene, cameraBody );  
        THREE.SceneUtils.attach( lensHolder, editor.scene, cameraBody );
        editor.scene.updateMatrixWorld(); 

        editor.signals.sceneGraphChanged.dispatch();

   
    },

    /**
     * panDomeCameraLeft( camera, rotation ) - Method used to pan the Threejs camera and the lens/holder part of the 3D Dome Camera in 'left' direction.
     * @param {Camera} Camera - The 3D Dome camera. 
     * @param {Number} rotation - The angle of rotation in degree.
     * @returns {Void}
     * @author Peeyush
     * @example <caption>Example usage of panDomeCameraLeft method.</caption>
     * customizedRotation.panDomeCameraLeft( camera, 10 );
     */

    panDomeCameraLeft: function(object,rotation) {

        var scope = this;
        var parts = scope.traverseDomeCamera( object );

            var glass, rim, lensHolder, cameraBody, numberBadge, extraTiltValue;
            glass = parts.glass;
            rim = parts.rim;
            lensHolder = parts.lensHolder;
            numberBadge = parts.numberBadge;
            cameraBody = parts.cameraBody;
            lens = parts.lens;
    
            THREE.SceneUtils.detach( glass, cameraBody, editor.scene );
            THREE.SceneUtils.detach( rim, cameraBody, editor.scene );
            THREE.SceneUtils.detach( numberBadge, cameraBody, editor.scene );
            THREE.SceneUtils.detach( lensHolder, cameraBody, editor.scene );
            cameraBody.updateMatrixWorld();
    
            if( object.userData.alignment == "top" ) {
                
                object.rotateOnWorldAxis( new THREE.Vector3(0,1,0), THREE.Math.degToRad(rotation) );
                lensHolder.rotateOnWorldAxis( new THREE.Vector3(0,1,0), THREE.Math.degToRad(rotation) );
    
                editor.signals.sceneGraphChanged.dispatch();
            
            } else if( object.userData.alignment == "left" ) {
            
                object.rotateOnWorldAxis( new THREE.Vector3(0,0,1), THREE.Math.degToRad(rotation) );
                lensHolder.rotateOnWorldAxis( new THREE.Vector3(0,0,1), THREE.Math.degToRad(rotation) );
                
                editor.signals.sceneGraphChanged.dispatch();
            
            } else if( object.userData.alignment == "right" ) {
            
                object.rotateOnWorldAxis( new THREE.Vector3(0,0,-1), THREE.Math.degToRad(rotation) );
                lensHolder.rotateOnWorldAxis( new THREE.Vector3(0,0,-1), THREE.Math.degToRad(rotation) );
                
                editor.signals.sceneGraphChanged.dispatch();
            
            } else if( object.userData.alignment == "front" ) {
            
                object.rotateOnWorldAxis( new THREE.Vector3(-1,0,0), THREE.Math.degToRad(rotation) );
                lensHolder.rotateOnWorldAxis( new THREE.Vector3(-1,0,0), THREE.Math.degToRad(rotation) );
                
                editor.signals.sceneGraphChanged.dispatch();
            
            } else if( object.userData.alignment == "back" ) {
            
                object.rotateOnWorldAxis( new THREE.Vector3(1,0,0), THREE.Math.degToRad(rotation) );
                lensHolder.rotateOnWorldAxis( new THREE.Vector3(1,0,0), THREE.Math.degToRad(rotation) );
                
                editor.signals.sceneGraphChanged.dispatch();
            
            } else {
            
                object.rotateOnAxis( new THREE.Vector3(0,0,-1), THREE.Math.degToRad(rotation) );
            
            }
            editor.signals.sceneGraphChanged.dispatch();
    
            THREE.SceneUtils.attach( glass, editor.scene, cameraBody );
            THREE.SceneUtils.attach( rim, editor.scene, cameraBody );  
            THREE.SceneUtils.attach( numberBadge, editor.scene, cameraBody );  
            THREE.SceneUtils.attach( lensHolder, editor.scene, cameraBody );
            editor.scene.updateMatrixWorld(); 
    
            editor.signals.sceneGraphChanged.dispatch();

    },

    /**
     * traversePTZCamera( camera ) - Method to traverse and split PTZ camera into rim, glass, holder, lens and camera helper icon. 
     * @param {Camera} Camera - The 3D PTZ camera 
     * @returns {Object} An object containg rim, glass, holder and lens of 3D PTZ Camera.
     * @author Peeyush
     * @example <caption>Example usage of traversePTZCamera method.</caption>
     * customizedRotation.traversePTZCamera( camera );
     */

    traversePTZCamera: function(object) {

        return new Promise( function( resolve,reject ){

            var cameraParts = {};
            object.traverse( function( subChild ) {
    
                if( subChild.name == "threeDCameraModel" && subChild.type == "Scene" ) {
                    
                    cameraParts.cameraBody = subChild;
                    subChild.traverse( function( subElement ) {
    
                        if( subElement.name == "Base" ) {
    
                            cameraParts.rim = subElement;
                            
                        }
    
                        if( subElement.name == "Glass" ) {
    
                            cameraParts.glass = subElement;
    
                        }
    
                        if( subElement.name == "Camera_Holder" ) {
    
                            cameraParts.lensHolder = subElement;
    
                        }
    
                        if( subElement.name == "Camera" ) {
                
                            cameraParts.lens = subElement;
        
                        }
    
                        if( subElement instanceof THREE.Sprite ) {
    
                            cameraParts.numberBadge = subElement;
    
                        }
    
                    } )
    
                }
    
            } )
    
            resolve( cameraParts );

        } )

    },

    /**
     * tiltPTZCamera( camera, rotation, direction ) - Method used to tilt the Threejs camera and the lens of the 3D PTZ camera in the specified direction.
     * @param {camera} camera - The 3D PTZ camera. 
     * @param {Number} rotation - The angle of rotation in degree.
     * @param {String} direction - The direction of tilt movement, either up or down.
     * @returns {Void}
     * @author Peeyush
     * @example <caption>Example usage of tiltPTZCamera method.</caption>
     * customizedRotation.tiltPTZCamera( camera, 10, 'up' );
     */

    tiltPTZCamera: function(object,rotation,direction) {

        var scope = this;
        scope.traversePTZCamera(object).then( function( parts ){

            var glass, rim, lensHolder, numberBadge, cameraBody;
            glass = parts.glass;
            rim = parts.rim;
            lensHolder = parts.lensHolder;
            numberBadge = parts.numberBadge;
            cameraBody = parts.cameraBody;
    
            THREE.SceneUtils.detach( lensHolder, cameraBody, editor.scene );
            THREE.SceneUtils.detach( glass, cameraBody, editor.scene );
            THREE.SceneUtils.detach( rim, cameraBody, editor.scene );
            THREE.SceneUtils.detach( numberBadge, cameraBody, editor.scene );
            cameraBody.updateMatrixWorld();
    
            if( direction && direction === "up" ) {
    
                if( object.userData.tiltRotationValue < 0 ) {
    
                    extraTiltValue = 0 - object.userData.tiltRotationValue;
                    object.userData.tiltRotationValue = 0;
                    object.rotateOnAxis( new THREE.Vector3(1,0,0), THREE.Math.degToRad(rotation - extraTiltValue) );
                    editor.signals.sceneGraphChanged.dispatch();
        
                } else {
        
                    object.rotateOnAxis( new THREE.Vector3(1,0,0), THREE.Math.degToRad(rotation) );
                    editor.signals.sceneGraphChanged.dispatch();
        
                }
    
            } else if( direction && direction === "down" ) {
    
                if( object.userData.tiltRotationValue > 180 ){
    
                    extraTiltValue = object.userData.tiltRotationValue - 180;
                    object.userData.tiltRotationValue = 180;
                    object.rotateOnAxis( new THREE.Vector3(-1,0,0), THREE.Math.degToRad(rotation - extraTiltValue ) );
                    editor.signals.sceneGraphChanged.dispatch();
        
                } else {
        
                    object.rotateOnAxis( new THREE.Vector3(-1,0,0), THREE.Math.degToRad(rotation) );
                    editor.signals.sceneGraphChanged.dispatch();
        
                }
    
            }
    
            THREE.SceneUtils.attach( lensHolder, editor.scene, cameraBody );
            THREE.SceneUtils.attach( glass, editor.scene, cameraBody );
            THREE.SceneUtils.attach( rim, editor.scene, cameraBody );  
            THREE.SceneUtils.attach( numberBadge, editor.scene, cameraBody );  
            editor.scene.updateMatrixWorld();
            editor.signals.cameraControlsChanged.dispatch( object.userData);

        } );

    },

    /**
     * rollPTZCamera( camera, rotation, direction ) - Method used to roll the camera in the specified direction.
     * @param {camera} camera - The 3D PTZ camera. 
     * @param {Number} rotation - The angle of rotation in degree.
     * @param {String} direction - The direction of roll movement, either left or right.
     * @returns {Void}
     * @author Peeyush
     * @example <caption>Example usage of rollPTZCamera method.</caption>
     * customizedRotation.rollPTZCamera( camera, 10, 'left' );
     */

    rollPTZCamera: function(object,rotation,direction) {

        if( direction && direction == "left" ) {

            object.rotateOnWorldAxis( new THREE.Vector3(0,1,0), THREE.Math.degToRad(rotation) );
            editor.signals.sceneGraphChanged.dispatch();

        } else if( direction && direction == "right" ) {

            object.rotateOnWorldAxis( new THREE.Vector3(0,-1,0), THREE.Math.degToRad(rotation) );
            editor.signals.sceneGraphChanged.dispatch();

        }

    },

    /**
     * panPTZCamera( camera, rotation, direction ) - Method used to pan the Threejs camera and the lens/holder of the 3D Camera in the specified direction.
     * @param {Camera} Camera - The 3D PTZ camera. 
     * @param {Number} rotation - The angle of rotation in degree.
     * @param {String} direction - The direction of pan movement, either left or right.
     * @returns {Void}
     * @author Peeyush
     * @example <caption>Example usage of panPTZCamera method.</caption>
     * customizedRotation.panPTZCamera( camera, 10, 'left' );
     */

    panPTZCamera: function(object,rotation,direction) {

        var scope = this;
        scope.traversePTZCamera(object).then( function( parts ){

            var glass, rim, lensHolder, numberBadge, cameraBody;
            glass = parts.glass;
            rim = parts.rim;
            lensHolder = parts.lensHolder;
            numberBadge = parts.numberBadge;
            cameraBody = parts.cameraBody;
    
            THREE.SceneUtils.detach( glass, cameraBody, editor.scene );
            THREE.SceneUtils.detach( rim, cameraBody, editor.scene );
            THREE.SceneUtils.detach( numberBadge, cameraBody, editor.scene );
            cameraBody.updateMatrixWorld();
    
            if( direction && direction === "left" ) {
    
                object.rotateOnWorldAxis( new THREE.Vector3(0,1,0), THREE.Math.degToRad(rotation) );
    
            } else if( direction && direction === "right" ) {
    
                object.rotateOnWorldAxis( new THREE.Vector3(0,-1,0), THREE.Math.degToRad(rotation) );
    
            }
    
            editor.signals.sceneGraphChanged.dispatch();
            
            THREE.SceneUtils.attach( glass, editor.scene, cameraBody );
            THREE.SceneUtils.attach( rim, editor.scene, cameraBody );
            THREE.SceneUtils.attach( numberBadge, editor.scene, cameraBody );  
            editor.scene.updateMatrixWorld(); 
    
            editor.signals.sceneGraphChanged.dispatch();

        } );
        
    },

    /**
     * traverseLidar( camera ) - Method to traverse and split 3D LiDAR sensor into lens and camera helper icon. 
     * @param {Sensor} Sensor - The 3D LiDAR sensor. 
     * @returns {Object} An object containg lens and camera helper icon of 3D LiDAR sensor.
     * @author Peeyush
     * @example <caption>Example usage of traverseLidar method.</caption>
     * customizedRotation.traverseLidar( sensor );
     */

    traverseLidar: function(object) {

        return new Promise( function( resolve,reject ){

            var cameraParts = {};
            object.traverse( function( subChild ) {
    
                if( subChild.name == "threeDCameraModel" && subChild.type == "Scene" ) {
                    
                    cameraParts.cameraBody = subChild;
                    subChild.traverse( function( subElement ) {
    
                        if( subElement.name == "LiDAR_LP" ) {
    
                            cameraParts.frame = subElement;
                            
                        }
    
                        if( subElement instanceof THREE.Sprite ) {
    
                            cameraParts.numberBadge = subElement;
    
                        }
    
                    } )
    
                }
    
            } )
    
            resolve( cameraParts );

        } )

    },

    /**
     * tiltLidar( sensor, rotation, direction ) - Method used to tilt the Threejs camera and the lens of the 3D Sensor in the specified direction.
     * @param {Sensor} Sensor - The 3D LiDAR sensor. 
     * @param {Number} rotation - The angle of rotation in degree.
     * @param {String} direction - The direction of tilt movement, either up or down.
     * @returns {Void}
     * @author Peeyush
     * @example <caption>Example usage of tiltLidar method.</caption>
     * customizedRotation.tiltLidar( sensor, 10, 'up' );
     */

    tiltLidar: function(object,rotation,direction) {

        var scope = this;
        scope.traverseLidar(object).then( function( parts ){

            var frame;
            frame = parts.frame;
            cameraBody = parts.cameraBody;
            numberBadge = parts.numberBadge;
    
            THREE.SceneUtils.detach( frame, cameraBody, editor.scene );
            THREE.SceneUtils.detach( numberBadge, cameraBody, editor.scene );
            cameraBody.updateMatrixWorld();
    
            if( direction && direction === "up" ) {
    
                if( object.userData.tiltRotationValue > 0 ) {
    
                    extraTiltValue = object.userData.tiltRotationValue - 0;
                    object.userData.tiltRotationValue = 0;
                    object.rotateOnAxis( new THREE.Vector3(1,0,0), THREE.Math.degToRad(rotation - extraTiltValue ) );
                    editor.signals.sceneGraphChanged.dispatch();
        
                } else {
        
                    object.rotateOnAxis( new THREE.Vector3(1,0,0), THREE.Math.degToRad(rotation) );
                    editor.signals.sceneGraphChanged.dispatch();
        
                }
    
            } else if( direction && direction === "down" ) {
    
                if( object.userData.tiltRotationValue < -90 ){

                    extraTiltValue = -90 - object.userData.tiltRotationValue;
                    object.userData.tiltRotationValue = -90;
                    object.rotateOnAxis( new THREE.Vector3(-1,0,0), THREE.Math.degToRad(rotation - extraTiltValue) );
                    editor.signals.sceneGraphChanged.dispatch();
        
                } else {
        
                    object.rotateOnAxis( new THREE.Vector3(-1,0,0), THREE.Math.degToRad(rotation) );
                    editor.signals.sceneGraphChanged.dispatch();
        
                }
    
            }
    
            THREE.SceneUtils.attach( frame, editor.scene, cameraBody );  
            THREE.SceneUtils.attach( numberBadge, editor.scene, cameraBody );  
            editor.scene.updateMatrixWorld();
            editor.signals.cameraControlsChanged.dispatch( object.userData);
        } );

    },

}