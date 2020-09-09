/**
 * PanoramaSimulationView( editor, camera ) - Constructor function for generating simulated view of panoramic cameras
 * @constructor
 * @param {any} editor - The instance of the Editor which manages the overall objects and signals
 * @param {Object<THREE.PerspectiveCamera>} camera - Instance of THREE.PerspectiveCamera
 * @author Pravi
 * @returns {Object}
 * @example <caption>Example usage of PanoramaSimulationView</caption>
 * var panoramaSimulationView = new PanoramaSimulationView( editor, camera );
 */
var PanoramaSimulationView = function(editor,camera){

    
    var scope = this;

    this.signals = editor.signals;
    this.snapshot;

    //Rendering components start
    this.camera = camera;
    //Rendering components end

    //unique id for div START
    var timestamp = Date.now();
    this.wrapperId = 'fp-wrapper-' + Date.now();
    this.previewId = 'fp-preview-' + Date.now();
    this.statusId = 'fp-status-' + Date.now();
    this.headerCloseButtonId = 'fp-header-close-' + Date.now();
    //unique id for div END

    //Creating the UI for simulated view
    this.playerWrapperDiv = document.createElement( 'div' );
    this.playerWrapperDiv.setAttribute( 'id', this.wrapperId );
    this.playerWrapperDiv.setAttribute( 'class', 'ui-widget-content simulation-wrapper' );
    this.playerWrapperDiv.style.display = 'none';
    
    //Header section
    this.wrapperHeader = document.createElement( 'div' );
    this.wrapperHeader.setAttribute( 'class', 'simulation-header-div' );
    this.wrapperHeader.setAttribute( 'style', 'text-align:center' );//
    this.wrapperHeader.innerHTML = '<strong style="text-align:center;">'+ editor.languageData.Simulatedviewofcamera +'</strong>'; //+ this.camera.badgeText

    //Header close button
    this.wrapperCloseBtn = document.createElement( 'button' );
    this.wrapperCloseBtn.setAttribute( 'class', 'btn btn-default btn-xs simulation-header-close-button' );
    this.wrapperCloseBtn.setAttribute( 'id', scope.headerCloseButtonId );
    this.wrapperCloseBtn.innerHTML = '<span class="fa fa-close"></span>';
    this.wrapperHeader.appendChild( scope.wrapperCloseBtn );

    this.playerWrapperDiv.appendChild( this.wrapperHeader );
    
    this.playerPreviewDiv = document.createElement( 'div' );
    this.playerPreviewDiv.setAttribute( 'id', this.previewId );
    this.playerPreviewDiv.setAttribute( 'class', 'simulation-preview' );
    
    this.playerWrapperDiv.appendChild( this.playerPreviewDiv );

    //simulation controls
    this.controls = document.createElement( 'div' );
    this.controls.setAttribute( 'class', 'simulation-controls' );

    //Process view
    this.processButton = document.createElement( 'button' );
    this.processButton.setAttribute( 'class', 'btn btn-default btn-xs left-right-margin' );
    this.processButton.setAttribute( 'id', scope.statusId );
    this.processButton.innerHTML = '<span class="fa fa-refresh faa-shake animated-hover"></span>'+ editor.languageData.RefreshView+'';
    this.controls.appendChild( this.processButton );

    //SnapShot Button
    this.snapShotButton = document.createElement( 'button' );
    this.snapShotButton.setAttribute( 'class', 'btn btn-default btn-xs left-right-margin' );
    this.snapShotButton.setAttribute( 'id', scope.statusId );
    this.snapShotButton.innerHTML = '<span class="fa fa-camera faa-shake animated-hover"></span>'+ editor.languageData.TakeSnapShot+'';
    this.controls.appendChild( this.snapShotButton );

    scope.playerWrapperDiv.addEventListener( 'click', function( event ){

        scope.signals.simulationScreenClicked.dispatch( scope );

    } );

    scope.processButton.addEventListener( 'click', function( event ){

        scope.processButtonClicked( event );

    } );

    scope.snapShotButton.addEventListener( 'click', function( event ){
        
        scope.snapshotButtonClicked( event );
        
    } );

    scope.playerWrapperDiv.addEventListener( 'contextmenu', function( event ){

        scope.signals.simulationScreenContextmenuRequested.dispatch( event );

    } );

    scope.wrapperCloseBtn.addEventListener( 'click', function( event ){

        scope.closeButtonClicked( event );

    } );

    this.playerWrapperDiv.appendChild( this.controls );

    

   /* //Listener for the simulation controls update request signal 
    editor.signals.updateSimulationControls.add( function( object ){

        if( object.uuid === scope.camera.uuid ) scope.updateControls();

    } );*/


    return this;

};

PanoramaSimulationView.prototype = {

    /**
     * show() - sets the visibility to 'block'.
     * @returns {Void}
     * @author Pravi
     * @example <caption>Example usage of show method.</caption>
     * panoramaSimulationView.show( );
     */
    show : function(){
        
        var scope = this;
        this.playerWrapperDiv.style.display = 'block';
    },

    /**
     * hide( ) - sets the visibility to 'none'.
     * @returns {Void}
     * @author Pravi
     * @example <caption>Example usage of hide method.</caption>
     * panoramaSimulationView.hide( );
     */
    hide : function(){
        
        this.playerWrapperDiv.style.display = 'none';

    },

    /**
     * bringToFront( ) - Method to bring the window to front
     * @returns {Void}
     * @author Pravi
     * @example <caption>Example usage of bringToFront method.</caption>
     * panoramaSimulationView.bringToFront( );
     */
    bringToFront : function(){

        var scope = this;
        scope.playerWrapperDiv.style.zIndex = 1000;
        scope.playerWrapperDiv.style.backgroundColor = '#ffffff';

    },

    /**
     * sendToBack( ) - Method to send the window to back
     * @returns {Void}
     * @author Pravi
     * @example <caption>Example usage of sendToBack method.</caption>
     * panoramaSimulationView.sendToBack( );
     */
    sendToBack : function(){
        
        var scope = this;
        scope.playerWrapperDiv.style.zIndex = 1;
        scope.playerWrapperDiv.style.backgroundColor = '#eeeeee';

    },

    /**
     * snapshotButtonClicked( ) - Method to take a snapshot
     * @returns {Void}
     * @author Pravi
     * @example <caption>Example usage of snapshotButtonClicked method.</caption>
     * panoramaSimulationView.snapshotButtonClicked( );
     */
    snapshotButtonClicked : function( event ){

        var scope = this;
        
        editor.signals.simulationSnapshotNeeded.dispatch( scope.camera );
        editor.signals.simulationSnapshotTaken.dispatch( scope.snapshot );
        

    },

    /**
     * setResizable( keepAspectRatio, aspectRatio ) - Set the element dimensions as resizable.
     * @param {Boolean} keepAspectRatio - Determines whether aspect ratio should be kept or not. Default is false
     * @param {Number} aspectRatio - Number specifying the aspect ratio value. This field have effect only when keepAspectRatio is true
     * @returns {Void}
     * @author Pravi
     * @example <caption>Example usage of setResizable method.</caption>
     * panoramaSimulationView.setResizable( );
     */
    setResizable : function( keepAspectRatio, aspectRatio ){

        var scope = this;
        var ratio = ( keepAspectRatio === true )? ( ( typeof( aspectRatio ) == 'number' )? aspectRatio : 1.77 ) : false;

        $( '#' + this.wrapperId ).resizable( {
            aspectRatio : ratio,
            alsoResize : "#" + this.previewId,
            //minWidth : 604.331,
            //minHeight : 341.43,
            minWidth : 344.127,
            //minHeight : 194.422,
            maxWidth : 922.917,
            //maxHeight : 521.422,
            resize : function( event, ui ){

                if( scope.isLive == true ){

                    scope.signals.simulationResized.dispatch( scope.playerPreviewDiv.offsetWidth, scope.playerPreviewDiv.offsetHeight );

                }

            }
        } );

    },

    /**
     * setDraggable() - set the element draggable.
     * @returns {Void}
     * @author Pravi
     * @example <caption>Example usage of setDraggable method.</caption>
     * panoramaSimulationView.setDraggable( );
     */
    setDraggable : function(){

        $( '.simulation-wrapper' ).draggable( {
            containment: "parent"
        } );

    },

    /**
     * setMobile() - set the element both resizable and draggable.
     * @returns {Void}
     * @author Pravi
     * @example <caption>Example usage of setMobile method.</caption>
     * panoramaSimulationView.setMobile( );
     */
    setMobile : function(){

        var scope = this;
        scope.setDraggable();
        scope.setResizable( true, 1.77 );

    },

    /**
     * attachFilm( film ) - Attach the renderer DOM element to the screen.
     * @param {Object} film - Renderer DOM element to be attached.
     * @returns {Void}
     * @author Pravi
     * @example <caption>Example usage of attachFilm method.</caption>
     * panoramaSimulationView.attachFilm( film );
     */
    attachFilm : function( film ){

        var scope = this;
        scope.playerPreviewDiv.appendChild( film );

    },

    /**
     * destroySelf() - Destroy and detach the simulation view object and DOM
     * @returns {Void}
     * @author Pravi
     * @example <caption>Example usage of destroySelf method.</caption> 
     * panoramaSimulationView.destroySelf( );
     */
    destroySelf : function(){

        var scope = this;
        scope.hide();
        scope.playerWrapperDiv.parentNode.removeChild( scope.playerWrapperDiv );

    },

    /**
     * closeButtonClicked( event ) - Method to close the simulation window
     * @returns {Void}
     * @author Pravi
     * @example <caption>Example usage of closeButtonClicked method.</caption>
     * panoramaSimulationView.closeButtonClicked( ); 
     */
    closeButtonClicked : function( event ){

        var scope = this;
        scope.signals.simulationViewStopped.dispatch( scope.camera );

    },

    /**
     * setAsPaused( background ) - Method to set the panoramic view to the window
     * @param {String} background - base64 format image.
     * @returns {Void}
     * @author Pravi
     * @example <caption>Example usage of setAsPaused method.</caption> 
     * panoramaSimulationView.setAsPaused( background );
     */
    setAsPaused : function( background ){
        var scope = this;
        this.snapshot = background;
        scope.wrapperHeader.innerHTML = '<strong style="text-align:center;">'+editor.languageData.Simulatedviewofcamera  + scope.camera.badgeText + '</strong>';
        scope.wrapperHeader.appendChild( scope.wrapperCloseBtn );
        if( background != undefined ){

            document.getElementById( scope.previewId ).style.background = 'url( "' + background + '" )';
            document.getElementById( scope.previewId ).style.backgroundSize = '100% 100%';

        }

    },

    /**
     * processButtonClicked( event ) - Method to refresh the panoramic view.
     * @returns {Void}
     * @author Pravi
     * @example <caption>Example usage of processButtonClicked method.</caption> 
     * panoramaSimulationView.processButtonClicked( event );
     */
    processButtonClicked : function( event ){
        var scope = this;
        editor.signals.panoramicViewRefreshed.dispatch( scope.camera );

    },


};

PanoramaSimulationView.prototype.constructor = PanoramaSimulationView;