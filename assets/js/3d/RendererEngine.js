/**
 * RendererEngine( editor ) - Constructor function handling the rendering tasks.
 * @constructor
 * @param {any} editor - The instance of the Editor which manages the overall objects and signals
 * @author Hari
 * @returns {Object}
 * @example <caption>Example usage of RendererEngine</caption>
 * var rendererEngine = new RendererEngine( editor );
 */
var RendererEngine = function( editor ){

    var scope = this;
    this.signals = editor.signals;
    
    //Rendering components start
    this.camera;
    this.scene;
    this.renderer;
    this.normalRenderer;
    this.fishEyeRenderer;
    this.renderingType;
    this.request;
    this.keepRenderingAlive = true;
    this.takeSnapshot = false;
    this.hideShowItems = [];
    //Rendering components end

    //Modified for fish eye start
    this.composer;
    this.effect;
    this.fishEyeParams = {
        
        horizontalFOV:		140,
        strength: 			0.6,
        cylindricalRatio:	0.5,
    
    };

    this.getDistortionShaderDefinition = function() {
        return {
    
            uniforms: {
                "tDiffuse": 		{ type: "t", value: null },
                "strength": 		{ type: "f", value: 0 },
                "height": 			{ type: "f", value: 1 },
                "aspectRatio":		{ type: "f", value: 1 },
                "cylindricalRatio": { type: "f", value: 1 }
            },
    
            vertexShader: [
                "uniform float strength;",          // s: 0 = perspective, 1 = stereographic
                "uniform float height;",            // h: tan(verticalFOVInRadians / 2)
                "uniform float aspectRatio;",       // a: screenWidth / screenHeight
                "uniform float cylindricalRatio;",  // c: cylindrical distortion ratio. 1 = spherical
                 
                "varying vec3 vUV;",                // output to interpolate over screen
                "varying vec2 vUVDot;",             // output to interpolate over screen
                 
                "void main() {",
                    "gl_Position = projectionMatrix * (modelViewMatrix * vec4(position, 1.0));",
                 
                    "float scaledHeight = strength * height;",
                    "float cylAspectRatio = aspectRatio * cylindricalRatio;",
                    "float aspectDiagSq = aspectRatio * aspectRatio + 1.0;",
                    "float diagSq = scaledHeight * scaledHeight * aspectDiagSq;",
                    "vec2 signedUV = (2.0 * uv + vec2(-1.0, -1.0));",
                 
                    "float z = 0.5 * sqrt(diagSq + 1.0) + 0.5;",
                    "float ny = (z - 1.0) / (cylAspectRatio * cylAspectRatio + 1.0);",
                 
                    "vUVDot = sqrt(ny) * vec2(cylAspectRatio, 1.0) * signedUV;",
                    "vUV = vec3(0.5, 0.5, 1.0) * z + vec3(-0.5, -0.5, 0.0);",
                    "vUV.xy += uv;",
                "}"
            ].join("\n"),
            
            fragmentShader: [
                "uniform sampler2D tDiffuse;",      // sampler of rendered scene?s render target
                "varying vec3 vUV;",                // interpolated vertex output data
                "varying vec2 vUVDot;",             // interpolated vertex output data
    
                "void main() {",
                    "vec3 uv = dot(vUVDot, vUVDot) * vec3(-0.5, -0.5, -1.0) + vUV;",
                    "gl_FragColor = texture2DProj(tDiffuse, uv);",
                "}"
            ].join("\n")
    
        };
    }

    this.signals.simulationResized.add( function( width, height ){
        
        scope.setRendererSize( width, height );
        
    } );

    this.signals.pauseScreenResized.add( function( width, height, cam ){

        scope.currentDigtalZoomSlidr = simulationManager.screens[ cam.uuid ].digZoomSlider;
        scope.currentZoomValue = scope.currentDigtalZoomSlidr.dom.value;
        scope.prevId = simulationManager.screens[ cam.uuid ].previewId;
        scope.targetScreen = document.querySelector( "#" + scope.prevId );

        if( scope.currentZoomValue != null ){

            scope.origImg = simulationManager.screens[ cam.uuid ].snapshotOnPause;
            //scope.zoomRatio = 1 - ( ( 100/scope.currentDigtalZoomSlidr.dom.max ) * ( scope.currentZoomValue - 1 ) * 0.01 );
            scope.zoomRatio = ( 100/scope.currentZoomValue * 0.01 );
            var lensWidth = width * scope.zoomRatio;
            var lensHeight = height * scope.zoomRatio;
            var img = new Image();
            img.src = scope.origImg;
            img.width = width;
            img.height = height;
            var cx = width / lensWidth;
            var cy = height / lensHeight;
            scope.targetScreen.style.backgroundImage = "url('" + img.src + "')";
            scope.targetScreen.style.backgroundSize = (img.width * cx) + "px " + (img.height * cy) + "px";
            scope.targetScreen.style.backgroundPosition = "center";

        } 

    } );

    return this;

}

RendererEngine.prototype = {

    //Modified for fish eye start
    /**
     * updateDistortionEffect( fishEyeParams ) - Method to update the distortion effect for fisheye.
     * @param {Object} fishEyeParams - JSON object containing the properties "horizontalFOV", "strength", "cyclindricalRatio".
     * @return {Void}
     * @author Pravi
     */
    updateDistortionEffect : function( fishEyeParams ) {
        
        var scope = this;
        var height = Math.tan( THREE.Math.degToRad( fishEyeParams.horizontalFOV ) / 2 ) / scope.camera.aspect;

        //scope.camera.fov = Math.atan(height) * 2 * 180 / 3.1415926535;
        scope.camera.updateProjectionMatrix();
        
        scope.effect.uniforms[ "strength" ].value = fishEyeParams.strength;
        scope.effect.uniforms[ "height" ].value = height;
        scope.effect.uniforms[ "aspectRatio" ].value = scope.camera.aspect;
        scope.effect.uniforms[ "cylindricalRatio" ].value = fishEyeParams.cylindricalRatio;
    },
    //Modified for fish eye end
    /**
     * start( options, clearColor, pixelRatio, width, height ) - initializes the rendering context.
     * @param {Object} options - options for WebGLRenderer. Default is { antialias: true }.
     * @param {Number} clearColor - Default material color(as Hex number) for the renderer. Default is 0x000000.
     * @param {Number} pixelRatio - The pixel ratio value for the renderer. Default is window.devicePixelRatio.
     * @param {Number} width - The initial width for the renderer DOM element. Default is 604.331.
     * @param {Number} height - The initial height for the renderer DOM element. Default is 282.5.
     * @author Hari
     */
    start : function( options, clearColor, pixelRatio, width, height ){

        var scope = this;

        options    = options || { antialias: true };
        clearColor = clearColor || 0x000000;
        pixelRatio = pixelRatio || window.devicePixelRatio;
        width      = width || 604.331;
        height     = height || 282.5;
        //Modified for fish eye start
        /*Original
        scope.renderer = new THREE.WebGLRenderer( options );
        scope.renderer.setClearColor( clearColor );
        scope.renderer.setPixelRatio( pixelRatio );
        scope.renderer.setSize( width, height );*/

        scope.normalRenderer = new THREE.WebGLRenderer( options );
        scope.normalRenderer.setClearColor( clearColor );
        scope.normalRenderer.setPixelRatio( pixelRatio );
        scope.normalRenderer.setSize( width, height );

        scope.fishEyeRenderer = new THREE.WebGLRenderer( options );
        scope.fishEyeRenderer.setClearColor( clearColor );
        scope.fishEyeRenderer.setPixelRatio( pixelRatio );
        scope.fishEyeRenderer.setSize( width, height );
        //Modified for fish eye end
    },

    /**
     * setRendererSize( width, height ) - set the renderer width and height
     * @param {Number} width - desired width of the renderer DOM element.
     * @param {Number} height - desired height of the renderer DOM element.
     * @return {Void}
     * @author Hari
     */
    setRendererSize : function( width, height ){

        var scope = this;
        scope.renderer.setSize( width, height );

    },

    /**
     * setScene( scene ) - Set the specified scene for rendering
     * @param {Object} scene - THREE.Scene instance which should be set for renderer
     * @returns {Void}
     * @author Hari
     */
    setScene : function( scene ){

        var scope = this;
        scope.scene = scene;

    },

    /**
     * setCamera( camera ) - set the specified camera for simulation
     * @param {Object} camera - the camera object to be set for simulation.
     * @returns {Void} 
     * @author Hari
     */
    setCamera : function( camera, screen ){
        //Modified for fish eye start
        var scope = this;
        if(camera.camCategory == "Fisheye"){
            scope.renderingType = "Fisheye";
            scope.renderer = scope.fishEyeRenderer;
        }
        else{
            scope.renderingType = "normal";
            scope.renderer = scope.normalRenderer;
        }
       //Modified for fish eye end
        return new Promise( function( resolve, reject ){

            try{

                scope.camera = camera;
                //var width = screen.offsetWidth;
                //var height = screen.offsetHeight;
                //scope.camera.aspect = width / height;
                //console.info( screen );
                scope.camera.updateProjectionMatrix();
        
                //MODIFIED TO INCLUDE CAMERA FRUSTUM UPDATIONS START
                /*if (scope.camera.children[1] != undefined) {
        
                    if (scope.camera.children[1].name == 'CameraFrustum') {
        
                        scope.camera.children[1].geometry.updateFromCamera(scope.camera);
        
                    }
        
                }*/
                if (scope.camera != undefined) {

                    scope.camera.traverse( function( child ) {

                        if( child.name === "CameraFrustum" ) {

                            child.geometry.updateFromCamera(scope.camera);

                        }

                    } ) 

                }
                //Modified for fish eye start
                if( scope.renderingType == "Fisheye" ){
                    
                    scope.fishEyeParams.horizontalFOV = scope.camera.fov;
                    scope.composer = new THREE.EffectComposer( scope.renderer );
                    scope.composer.addPass( new THREE.RenderPass( scope.scene, scope.camera ) );

                    scope.effect = new THREE.ShaderPass( scope.getDistortionShaderDefinition() );
                    scope.composer.addPass( scope.effect );
                    scope.effect.renderToScreen = true;
                    scope.updateDistortionEffect( scope.fishEyeParams );
                    
                }
                //Modified for fish eye end
                editor.helpers[scope.camera.id].update();
                editor.signals.sceneGraphChanged.dispatch();
                resolve( true );

            }
            catch( error ){

                console.warn( error );
                reject( false );

            }

        } );

    },
    //Modified for Panorama start
    /**
     * setRendererForPanorama( camera ) - Set the specified camera for simulation(Panorama)
     * @param {Object<THREE.PerspectiveCamera>} camera - the camera instance to be set for simulation.
     * @returns {Void} 
     * @author Pravi
     */
    setRendererForPanorama : function( camera ){
        this.renderingType = "normal";
        this.renderer = this.normalRenderer;
        this.camera = camera;
    },
    //Modified for Panorama end

    /**
     * render() - Method to render the scene with the current camera.
     * @returns {Void}
     * @author Hari
     */
    /*render : function(){
        
        var scope = this;
        if( scope.keepRenderingAlive === true ){

            scope.request = requestAnimationFrame( scope.render.bind( scope ) );
            scope.renderer.render( scope.scene, scope.camera );

        }
        
    }*/
    render : function(){
        
        var scope = this;
        if( scope.keepRenderingAlive === true ){

            scope.request = requestAnimationFrame( scope.render.bind( scope ) );
            if( scope.takeSnapshot === true ){

                try{

                    var actualDimensions = scope.renderer.getSize();
                    if( scope.camera.resolutionWidth != undefined && scope.camera.resolutionHeight != undefined ){
                        scope.renderer.setSize( scope.camera.resolutionWidth, scope.camera.resolutionHeight  );
                    }
                    else{
                        scope.renderer.setSize( 1440, 720 );
                    }
                    //Modified for fish eye start
                    
                    if( scope.renderingType == "Fisheye" ){
                        scope.composer.render( scope.scene, scope.camera );
                    }
                    else{
                        scope.renderer.render( scope.scene, scope.camera );
                    }
                    //Modified for fish eye end
                    scope.takeSnapshot = false;
                    var imageData = scope.renderer.domElement.toDataURL();
                    scope.renderer.setSize( actualDimensions.width, actualDimensions.height );
                    scope.signals.simulationSnapshotTaken.dispatch( imageData );

                }
                catch( error ){

                    scope.signals.simulationSnapshotTaken.dispatch( false );

                }

            }
            else{
                //Modified for fish eye start
                if( scope.renderingType == "Fisheye" ){
                    scope.composer.render( scope.scene, scope.camera );
                }
                else{
                    scope.renderer.render( scope.scene, scope.camera );
                }
                    
                //Modified for fish eye end
            }
            
        }
        
    },

    /**
     * runPreRenderingTasks() - Things to run before the rendering starts
     * @returns {Void}
     * @author Hari
     */

    runPreRenderingTasks : function(){
        var scope = this;
        scope.hideShowItems = [];
        editor.scene.traverse( function( child ) {
            
            //modification for hiding camera helper during simulation start
            if( child instanceof THREE.PerspectiveCamera ){

                scope.hideShowItems.push( editor.helpers[ child.id ] );

            }
            //modification for hiding camera helper during simulation end

            if( child.camerauuid !== undefined ){

                scope.hideShowItems.push( child );

            }

        } );
        editor.hideObjectsOnSimulation( scope.hideShowItems );


    },

    /**
     * runPostRenderingTasks() - Things to run after the rendering ends
     * @returns {Void}
     * @author Hari
     */
    //Modified for Panorama start
    runPostRenderingTasks : function(){
        var scope = this;

            editor.showObjectsAfterSimulation( scope.hideShowItems );
            scope.hideShowItems = [];

    },
    //Modified for Panorama end

    /**
     * stop() - Stops the rendering opertaion.
     * @returns {Void}
     * @author Hari
     */
    stop : function(){

        var scope = this;
        scope.keepRenderingAlive = false;
        cancelAnimationFrame( scope.request );
        scope.runPostRenderingTasks();
        //scope.dispose();

    },

    /**
     * dispose() - Disposes the renderer to free up memory.
     * @returns {Void}
     * @author Hari
     */
    dispose : function(){
        //Modified for Panorama start
        var scope = this;
        if( scope.renderer != undefined )
        scope.renderer.dispose();
        if( scope.fishEyeRenderer != undefined )
        scope.fishEyeRenderer.dispose();
        if( scope.normalRenderer != undefined )
        scope.normalRenderer.dispose();
        scope.camera = undefined;
        scope.scene = undefined;
        scope.renderer = undefined;
        console.warn( 'THREE.WebGLRenderer engine has been stoped and disposed.\n Restart to regain context' );
        //Modified for Panorama end

    },
    /**
     * getSnapshot() - Method to return the snapshot of the camera
     * @param {Number} width - The optional width parameter to set the width of the renderer
     * @param {Number} height - The optional height parameter to set the width of the renderer  
     * @returns {Object<Promise>} - The DOMString data URI containing the image data
     * @author Hari
     */
    getSnapshot : function( width, height ){

        var scope = this;

        return new Promise( function( resolve, reject ){

            scope.takeSnapshot = true;
            
            scope.signals.simulationSnapshotTaken.addOnce( function( imageData ){

                if( imageData === false ){

                    reject( false );

                }
                else{

                    resolve( imageData );

                }
        
            } );

        } );

    },

    setRendererShadowMap : function(){

        this.normalRenderer.shadowMap.enabled = true;

    }

}

RendererEngine.prototype.constructor = RendererEngine;