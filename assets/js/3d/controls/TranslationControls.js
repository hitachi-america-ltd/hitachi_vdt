
/**
 * TranslationControls( editor ) : Constructor for the translation controls
 * @constructor
 * @param {any} editor - The instance of the Editor which manages the overall objects and signals
 * @returns {Object}
 * @author Peeyush
 * @example <caption>Example usage of TranslationControls</caption>
 * var translationControls = new TranslationControls( editor );
 */

var TranslationControls = function( editor ){

    var scope = this;
    this.translateStep = 0.1;
    this.translationAxis = 'x';
    this.createUI();
    
    return this;

}

TranslationControls.prototype = {

    /**
     * show( ) - Method to make the translation controls visible
     * @returns {Void}
     * @author Peeyush
     * @example <caption>Example usage of show method.</caption>
     * translationControls.show( );
     */

    show: function(){

        var scope = this;
        scope.translationWindow.show();

    },

     /**
     * hide( ) - Method to hide the translation controls.
     * @returns {Void}
     * @author Peeyush
     * @example <caption>Example usage of hide method.</caption>
     * translationControls.hide( );
     */

    hide: function(){

        var scope = this;
        scope.translationWindow.hide(); 

    },

    /**
     * createUI( ) - Method to create the table for translation controls
     * @returns {Void}
     * @author Peeyush
     * @example <caption>Example usage of createUI method.</caption>
     * translationControls.createUI( );
     */

    createUI: function(){

        var scope = this;
        scope.translationWindow = new UI.MobileWindow( 'translationwindow' );
        scope.translationWindow.setClass( 'class', 'translationwindowclass' );
        scope.translationWindow.setHeading( editor.languageData.TranslationControls );

        var translationWrapper = document.createElement( 'div' );

        var translationTarget = document.createElement( 'div' );
        translationTarget.setAttribute( 'class','text-center' );
        var translationTargetName = document.createElement( 'div' );
        translationTargetName.innerHTML = '<strong>None selected</strong>';
        translationTarget.appendChild( translationTargetName );
        translationWrapper.appendChild( translationTarget );
        scope.translationTarget = translationTargetName;

        var buttonWrapper = document.createElement( 'div' );
        buttonWrapper.setAttribute( 'class','buttonWrapperClass' );

        var translationButtonY = document.createElement( 'div' );
        //translationButtonY.setAttribute( 'class','btnYClass' );

        //var translationButtonXZ = document.createElement( 'div' );
        //translationButtonXZ.setAttribute( 'class','btndXZClass' );

        var minusButton = document.createElement( 'button' );
        minusButton.setAttribute( 'class', 'btn btn-default btn-md top-align' );
        minusButton.setAttribute( 'title', editor.languageData.TranslateinForwardDirection );
        minusButton.innerHTML = '<span class="fa fa-minus"></span>';

        var plusButton = document.createElement( 'button' );
        plusButton.setAttribute( 'class', 'btn btn-default btn-md plus-align-left' );
        plusButton.setAttribute( 'title', editor.languageData.TranslateinBackwardDirection );
        plusButton.innerHTML = '<span class="fa fa-plus"></span>';

        scope.xAxis = new UI.Button( 'X' );
        scope.yAxis = new UI.Button( 'Y' );
        scope.zAxis = new UI.Button( 'Z' );
        //xAxis.setClass( 'btn btn-danger btn-xs margin-left-pos' );
        scope.xAxis.setClass( 'btn btn-danger btn-md align-x-axis' );
        scope.yAxis.setClass( 'btn btn-success btn-xs' );
        //zAxis.setClass( 'btn btn-primary btn-xs align-left-x' );
        scope.zAxis.setClass( 'btn btn-primary btn-xs' );

        translationButtonY.appendChild( minusButton );
        translationButtonY.appendChild( scope.xAxis.dom );
        translationButtonY.appendChild( scope.yAxis.dom );
        translationButtonY.appendChild( scope.zAxis.dom );
        translationButtonY.appendChild( plusButton );

        buttonWrapper.appendChild( translationButtonY );
        //buttonWrapper.appendChild( translationButtonXZ ); 
        translationWrapper.appendChild( buttonWrapper );

        var translationRow = new UI.Row();
        translationRow.setStyle( 'border', [ '1px solid #cccccc' ] );
        translationRow.setStyle( 'margin-top', [ '9px' ] );
        translationRow.setStyle( 'padding-left', [ '10px' ] );
        translationRow.setStyle( 'margin-bottom', [ '10px' ] );

        scope.translationX = new UI.Number().setStep( 10 ).setWidth( '50px' ).onChange( function( event ){

            var translateFactor = event.target.value;
            var object = editor.selected;

            if( object!= null ){

                var currentPosition = new THREE.Vector3();
                currentPosition.copy( object.position.clone() );
                currentPosition.setX( Number( translateFactor/editor.commonMeasurements.targetConversionFactor ) );
                editor.execute( new SetPositionCommand( object, currentPosition ) );
                editor.signals.sceneGraphChanged.dispatch();

                if( ( object instanceof THREE.Sprite ) && ( object.userData.lineUUID ) && ( object.userData.checkLOSFlag ) && ( object.userData.checkDetailsFlag ) ) {

                    editor.signals.updateReferenceLineOfSight.dispatch( object );
    
                }
    
                else if ( ( object instanceof THREE.PerspectiveCamera )  && ( object.userData.objectUuid != "notset" ) && ( object.userData.lineUUID ) ) {
    
                    editor.signals.updateCameraLineOfSight.dispatch( object );
    
                } 

            }

        } );
        scope.xValue = scope.translationX;

        scope.translationY = new UI.Number().setStep( 10 ).setWidth( '50px' ).onChange( function( event ){

            var translateFactor = event.target.value;
            var object = editor.selected;

            if( object!= null ){

                var currentPosition = new THREE.Vector3();
                currentPosition.copy( object.position.clone() );
                currentPosition.setY( Number( translateFactor/editor.commonMeasurements.targetConversionFactor ) );
                editor.execute( new SetPositionCommand( object, currentPosition ) );
                editor.signals.sceneGraphChanged.dispatch();

                if( ( object instanceof THREE.Sprite ) && ( object.userData.lineUUID ) && ( object.userData.checkLOSFlag ) && ( object.userData.checkDetailsFlag ) ) {

                    editor.signals.updateReferenceLineOfSight.dispatch( object );
    
                }
    
                else if ( ( object instanceof THREE.PerspectiveCamera )  && ( object.userData.objectUuid != "notset" ) && ( object.userData.lineUUID ) ) {
    
                    editor.signals.updateCameraLineOfSight.dispatch( object );
    
                } 

            }

        } );
        scope.yValue = scope.translationY;

        scope.translationZ = new UI.Number().setStep( 10 ).setWidth( '50px' ).onChange( function( event ){

            var translateFactor = event.target.value;
            var object = editor.selected;

            if( object!= null ){

                var currentPosition = new THREE.Vector3();
                currentPosition.copy( object.position.clone() );
                currentPosition.setZ( Number( translateFactor/editor.commonMeasurements.targetConversionFactor ) );
                editor.execute( new SetPositionCommand( object, currentPosition ) );
                editor.signals.sceneGraphChanged.dispatch();

                if( ( object instanceof THREE.Sprite ) && ( object.userData.lineUUID ) && ( object.userData.checkLOSFlag ) && ( object.userData.checkDetailsFlag ) ) {

                    editor.signals.updateReferenceLineOfSight.dispatch( object );
    
                }
    
                else if ( ( object instanceof THREE.PerspectiveCamera )  && ( object.userData.objectUuid != "notset" ) && ( object.userData.lineUUID ) ) {
    
                    editor.signals.updateCameraLineOfSight.dispatch( object );
    
                } 

            }

        } );
        scope.zValue = scope.translationZ;

        translationRow.add( scope.translationX, scope.translationY, scope.translationZ );
        buttonWrapper.appendChild( translationRow.dom );
        //translationWrapper.appendChild( translationInput );

        var stepWrapper = document.createElement( 'div' );
        stepWrapper.setAttribute( 'style', 'margin-bottom: 7px !important;' );
        stepWrapper.innerHTML = '<strong>'+ editor.languageData.Choosestep +'</strong>';

        var stepListWrapper = document.createElement( 'div' );
        stepWrapper.setAttribute( 'class', 'form-group form-group-sm text-center' );
        stepWrapper.setAttribute( 'style', 'margin-bottom: 7px !important;' );

        var col4 = document.createElement( 'div' );
        var selectList = document.createElement( 'select' );
        selectList.setAttribute( 'class', 'form-control' );

        var option1 = document.createElement( 'option' );
        option1.innerHTML = "0.1";
        var option2 = document.createElement( 'option' );
        option2.innerHTML = "0.5";
        var option3 = document.createElement( 'option' );
        option3.innerHTML = "1";
        var option4 = document.createElement( 'option' );
        option4.innerHTML = "5";

        selectList.appendChild( option1 );
        selectList.appendChild( option2 );
        selectList.appendChild( option3 );
        selectList.appendChild( option4 );

        col4.appendChild( selectList );
        stepListWrapper.appendChild( col4 );

        stepWrapper.appendChild( stepListWrapper );
        buttonWrapper.appendChild( stepWrapper );

        selectList.addEventListener( 'change', function( event ){

            scope.translateStep = Number( selectList.value );

        } );

        scope.xAxis.dom.addEventListener( 'click', function(){
            
            scope.setTranslation( 'x' );

        } );

        scope.yAxis.dom.addEventListener( 'click', function(){
            
            scope.setTranslation( 'y' );

        } );

        scope.zAxis.dom.addEventListener( 'click', function(){
            
            scope.setTranslation( 'z' );

        } );

        minusButton.addEventListener( 'click', function(){

            var object = editor.selected;

            if( object!= null ){

                if( scope.translationAxis === 'x' ){

                    var currentPosition = new THREE.Vector3();
                    currentPosition.copy( object.position.clone() );
                    currentPosition.setX( ( ( (currentPosition.x * editor.commonMeasurements.targetConversionFactor) - scope.translateStep )/editor.commonMeasurements.targetConversionFactor ) );
                    editor.execute( new SetPositionCommand( object, currentPosition ) );
                    editor.signals.sceneGraphChanged.dispatch();                   

                } else if( scope.translationAxis === 'y' ){

                    var currentPosition = new THREE.Vector3();
                    currentPosition.copy( object.position.clone() );
                    currentPosition.setY( ( ( (currentPosition.y * editor.commonMeasurements.targetConversionFactor) - scope.translateStep )/editor.commonMeasurements.targetConversionFactor ) );
                    editor.execute( new SetPositionCommand( object, currentPosition ) );
                    editor.signals.sceneGraphChanged.dispatch();   

                } else if( scope.translationAxis === 'z' ){
                    /*
                    var currentPosition = new THREE.Vector3();
                    currentPosition.copy( object.position.clone() );
                    currentPosition.setZ( currentPosition.z - scope.translateStep );
                    editor.execute( new SetPositionCommand( object, currentPosition ) );
                    editor.signals.sceneGraphChanged.dispatch(); */

                    var currentPosition = new THREE.Vector3();
                    currentPosition.copy( object.position.clone() );
                    currentPosition.setZ( ( ( (currentPosition.z * editor.commonMeasurements.targetConversionFactor) - scope.translateStep )/editor.commonMeasurements.targetConversionFactor ) );
                    editor.execute( new SetPositionCommand( object, currentPosition ) );
                    editor.signals.sceneGraphChanged.dispatch();

                }

                if( ( object instanceof THREE.Sprite ) && ( object.userData.lineUUID ) && ( object.userData.checkLOSFlag ) && ( object.userData.checkDetailsFlag ) ) {

                    editor.signals.updateReferenceLineOfSight.dispatch( object );
    
                }
    
                else if ( ( object instanceof THREE.PerspectiveCamera )  && ( object.userData.objectUuid != "notset" ) && ( object.userData.lineUUID ) ) {
    
                    editor.signals.updateCameraLineOfSight.dispatch( object );
    
                }  

            }

        } );

        plusButton.addEventListener( 'click', function(){

            var object = editor.selected;

            if( object!= null ){

                if( scope.translationAxis === 'x' ){

                    var currentPosition = new THREE.Vector3();
                    currentPosition.copy( object.position.clone() );
                    currentPosition.setX( ( ( (currentPosition.x * editor.commonMeasurements.targetConversionFactor) + scope.translateStep )/editor.commonMeasurements.targetConversionFactor ) );
                    editor.execute( new SetPositionCommand( object, currentPosition ) );
                    editor.signals.sceneGraphChanged.dispatch(); 

                } else if( scope.translationAxis === 'y' ){

                    var currentPosition = new THREE.Vector3();
                    currentPosition.copy( object.position.clone() );
                    currentPosition.setY( ( ( (currentPosition.y * editor.commonMeasurements.targetConversionFactor) + scope.translateStep )/editor.commonMeasurements.targetConversionFactor ) );
                    editor.execute( new SetPositionCommand( object, currentPosition ) );
                    editor.signals.sceneGraphChanged.dispatch();

                } else if( scope.translationAxis === 'z' ){

                    var currentPosition = new THREE.Vector3();
                    currentPosition.copy( object.position.clone() );
                    currentPosition.setZ( ( ( (currentPosition.z * editor.commonMeasurements.targetConversionFactor) + scope.translateStep )/editor.commonMeasurements.targetConversionFactor ) );
                    editor.execute( new SetPositionCommand( object, currentPosition ) );
                    editor.signals.sceneGraphChanged.dispatch();

                }

                if( ( object instanceof THREE.Sprite ) && ( object.userData.lineUUID ) && ( object.userData.checkLOSFlag ) && ( object.userData.checkDetailsFlag ) ) {

                    editor.signals.updateReferenceLineOfSight.dispatch( object );
    
                }
    
                else if ( ( object instanceof THREE.PerspectiveCamera )  && ( object.userData.objectUuid != "notset" ) && ( object.userData.lineUUID ) ) {
    
                    editor.signals.updateCameraLineOfSight.dispatch( object );
    
                }

            }

        } );

        scope.translationWindow.setBody( translationWrapper );
        scope.hide();
        document.getElementById('editorElement').appendChild( scope.translationWindow.dom );
        scope.translationWindow.setDraggable(true);

    },

    /**
     * updateUI() - Updates the user interface of the translation controls window
     * @returns {Void}
     * @author Peeyush
     * @example <caption>Example usage of updateUI method.</caption>
     * translationControls.updateUI( ); 
     */

    updateUI: function(){

        var scope = this;
        var obj = editor.selected;

        if( obj!= null ){

            if( obj.name != undefined && obj.name != "" ){
                
                scope.translationTarget.innerHTML = '<strong>' + obj.name + '</strong>';

            }
            else{

                scope.translationTarget.innerHTML = '<strong>Object no name</strong>';

            }
            scope.xValue.setValue( ( (obj.position.x )*editor.commonMeasurements.targetConversionFactor).toFixed(2) );
            scope.yValue.setValue( ( (obj.position.y )*editor.commonMeasurements.targetConversionFactor).toFixed(2) );
            scope.zValue.setValue( ( (obj.position.z )*editor.commonMeasurements.targetConversionFactor).toFixed(2) );

        } 
        else{

            scope.translationTarget.innerHTML = '<strong>None selected</strong>';

        }

    },

    /**
     * hide( ) - Method to hide the translation controls.
     * @returns {Void}
     * @author Peeyush
     * @example <caption>Example usage of hide method.</caption>
     * translationControls.hide( );
     */

    hide: function(){

        var scope = this;
        scope.translationWindow.hide();

    },

    /**
     * show( ) - Method to make the translation controls visible
     * @returns {Void}
     * @author Peeyush
     * @example <caption>Example usage of show method.</caption>
     * translationControls.show( );
     */

    show: function(){

        var scope = this;
        var obj = editor.selected;
        
        if( obj != null ){
            scope.updateUI();
        }
        scope.translationWindow.show();

    },

    /**
     * setTranslation( axis ) - Method to set the direction, either X, Y or Z
     * @param {String} axis - X, Y or Z direction
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of setTranslation method.</caption>
     * translationControls.setTranslation( axis );
     */


    setTranslation: function( axis ){

        var scope = this;
        var formattedAxis = axis.toLowerCase();

        if( formattedAxis === 'x' || formattedAxis === 'y' || formattedAxis === 'z' ){

            if( formattedAxis === 'x' ){

                scope.xAxis.setClass( 'btn btn-danger btn-md align-x-axis' );
                scope.yAxis.setClass( 'btn btn-success btn-xs align-yz-axis' );
                scope.zAxis.setClass( 'btn btn-primary btn-xs align-yz-axis' );

            }
            else if( formattedAxis === 'y' ){

                scope.xAxis.setClass( 'btn btn-danger btn-xs align-x-axis' );
                scope.yAxis.setClass( 'btn btn-success btn-md align-yz-axis' );
                scope.zAxis.setClass( 'btn btn-primary btn-xs align-yz-axis' );

            }
            else if( formattedAxis === 'z' ){

                scope.xAxis.setClass( 'btn btn-danger btn-xs align-x-axis' );
                scope.yAxis.setClass( 'btn btn-success btn-xs align-yz-axis' );
                scope.zAxis.setClass( 'btn btn-primary btn-md align-yz-axis' );

            }
            
            scope.translationAxis = formattedAxis;

        }

    }

}