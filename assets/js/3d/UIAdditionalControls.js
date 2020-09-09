/**
 * UIAdditionalControls( editor ) - Constructor function for changing the badge size
 * @constructor
 * @param {any} editor - The instance of the Editor which manages the overall objects and signals
 * @author Mavelil
 * @returns {void}
 * @example <caption>Example usage of UIAdditionalControls</caption>
 * var uIAdditionalControls = new UIAdditionalControls( editor );
 */
var UIAdditionalControls = function( editor ){
    var uiMobileWindow = new UI.MobileWindow( "uicontrols-mobilewindow" );
    var scaleFactor = 0.2;
    var uiControlButton = document.querySelector( "#uicontrol-toggle" );
    //uiMobileWindow.show();
    
    uiMobileWindow.setHeading( editor.languageData.UIControls );

    var uiContainer = document.createElement( 'div' );
    uiContainer.id = "uicontrols-mobilewindow-container";
    
    var incrementSize = document.createElement( "button" );
    incrementSize.innerHTML = '<span class="fa fa-search-plus"></span>';
    incrementSize.className = "btn btn-default";

    var decrementSize = document.createElement( "button" );
    decrementSize.innerHTML = '<span class="fa fa-search-minus"></span>';  
    decrementSize.className = "btn btn-default";
    
    var btnContainer = document.createElement( 'div' );
    btnContainer.id = "ui-controls-zoom-buttons-div";
    btnContainer.appendChild( incrementSize );
    btnContainer.appendChild( decrementSize );

    var zoomLabelcontainer = document.createElement( "div" );
    zoomLabelcontainer.id = "ui-controls-resize-badges-label-div";
    zoomLabelcontainer.innerHTML = '<span>' + editor.languageData.ResizeBadges + '</span>';
    uiContainer.appendChild( zoomLabelcontainer );
    uiContainer.appendChild( btnContainer );
    uiContainer.className = "text-center";

    uiMobileWindow.setBody(uiContainer);
    uiMobileWindow.body.setAttribute("style","padding:2px;");

    document.querySelector( "#editorElement" ).appendChild( uiMobileWindow.dom );
    uiMobileWindow.setDraggable();
    uiMobileWindow.setResizable( true, 1.7, 200, 80, 400, 160, undefined );

    uiMobileWindow.headerCloseBtn.addEventListener( 'click', function(){

        uiControlButton.click();

    } );

    incrementSize.addEventListener('click',function(){

        if( editor.lengthBadges.length > 0 || editor.areaBadges.length > 0 || editor.nwBadges.length > 0 || editor.refCamBadge.length > 0 ){
            
            editor.lengthBadges.forEach( function( element ){

                var actualFactor = element.scale.x + scaleFactor;
                if( actualFactor > 0 ) {

                    element.scale.set( actualFactor, actualFactor, 1 );
                    element.userData.badgeScaledValue = element.scale.clone();
                    editor.currentScaleFactor.copy( element.userData.badgeScaledValue );

                } 
            
            } );
            
            editor.areaBadges.forEach( function( element ){

                var actualFactor = element.scale.x + scaleFactor;
                if( actualFactor > 0 ) {

                    element.scale.set( actualFactor, actualFactor, 1 );
                    element.userData.badgeScaledValue = element.scale.clone();
                    editor.currentScaleFactor.copy( element.userData.badgeScaledValue );

                } 
            
            } );
            
            editor.nwBadges.forEach( function( element ){

                var actualFactor = element.scale.x + scaleFactor;
                if( actualFactor > 0 ) {

                    element.scale.set( actualFactor, actualFactor, 1 );
                    element.userData.badgeScaledValue = element.scale.clone();
                    editor.currentScaleFactor.copy( element.userData.badgeScaledValue );

                } 
            
            } );

            editor.refCamBadge.forEach( function( element ){

                var actualFactor = element.scale.x + scaleFactor;
                if( actualFactor > 0 ) {

                    element.scale.set( actualFactor, actualFactor, 1 );
                    element.userData.badgeScaledValue = element.scale.clone();
                    editor.currentScaleFactor.copy( element.userData.badgeScaledValue );

                } 

            } );
            
            editor.signals.sceneGraphChanged.dispatch();
        
        }

    });

    decrementSize.addEventListener( 'click', function() {

        if( editor.lengthBadges.length > 0 || editor.areaBadges.length > 0 || editor.nwBadges.length > 0 || editor.refCamBadge.length > 0 ) {

            editor.lengthBadges.forEach( function( element ) {

                var actualFactor = element.scale.x - scaleFactor;
                if( actualFactor > 0 ){

                    element.scale.set( actualFactor, actualFactor, 1 );
                    element.userData.badgeScaledValue = element.scale.clone();
                    editor.currentScaleFactor.copy( element.userData.badgeScaledValue );

                } 

            } );

            editor.areaBadges.forEach( function( element ) {

                var actualFactor = element.scale.x - scaleFactor;
                if( actualFactor > 0 ){

                    element.scale.set( actualFactor, actualFactor, 1 );
                    element.userData.badgeScaledValue = element.scale.clone();
                    editor.currentScaleFactor.copy( element.userData.badgeScaledValue );

                } 

            } );

            editor.nwBadges.forEach( function( element ) {

                var actualFactor = element.scale.x - scaleFactor;
                if( actualFactor > 0 ){

                    element.scale.set( actualFactor, actualFactor, 1 );
                    element.userData.badgeScaledValue = element.scale.clone();
                    editor.currentScaleFactor.copy( element.userData.badgeScaledValue );

                } 

            } );

            editor.refCamBadge.forEach( function( element ) {

                var actualFactor = element.scale.x - scaleFactor;
                if( actualFactor > 0 ){

                    element.scale.set( actualFactor, actualFactor, 1 );
                    element.userData.badgeScaledValue = element.scale.clone();
                    editor.currentScaleFactor.copy( element.userData.badgeScaledValue );

                } 

            } );
            editor.signals.sceneGraphChanged.dispatch();

        }

    } );

    editor.uiAdditionalControls = uiMobileWindow;

    editor.signals.restoreBadgesToLastSize.add( function(){

        for( i=0;i<editor.refCamBadge.length;i++ ){

            if( editor.currentScaleFactor!= undefined && editor.currentScaleFactor!= null && !( editor.currentScaleFactor.equals( editor.zeroVector ) ) ){

                editor.refCamBadge[i].scale.set( editor.currentScaleFactor.x, editor.currentScaleFactor.y, 1 );
                editor.refCamBadge[i].userData.badgeScaledValue = editor.currentScaleFactor.clone();

            }
            else if( editor.refCamBadge[i].userData.badgeScaledValue && editor.refCamBadge[i].userData.badgeScaledValue != null && editor.refCamBadge[i].userData.badgeScaledValue != undefined ){

                var oldScaleValue = editor.refCamBadge[i].userData.badgeScaledValue;
                editor.refCamBadge[i].scale.set( oldScaleValue.x, oldScaleValue.y, oldScaleValue.z );
                editor.currentScaleFactor.copy( oldScaleValue );

            }
            else{

                editor.currentScaleFactor.copy( editor.refCamBadge[i].scale.clone() );

            }

        }
        for( i=0;i<editor.lengthBadges.length;i++ ){

            if( editor.currentScaleFactor!= undefined && editor.currentScaleFactor!= null && !( editor.currentScaleFactor.equals( editor.zeroVector ) ) ){

                editor.lengthBadges[i].scale.set( editor.currentScaleFactor.x, editor.currentScaleFactor.y, 1 );
                editor.lengthBadges[i].userData.badgeScaledValue = editor.currentScaleFactor.clone();

            }
            else if( editor.lengthBadges[i].userData.badgeScaledValue && editor.lengthBadges[i].userData.badgeScaledValue != null && editor.lengthBadges[i].userData.badgeScaledValue != undefined ){

                var oldScaleValue = editor.lengthBadges[i].userData.badgeScaledValue;
                editor.lengthBadges[i].scale.set( oldScaleValue.x, oldScaleValue.y, oldScaleValue.z );
                editor.currentScaleFactor.copy( oldScaleValue );

            }
            else{

                editor.currentScaleFactor.copy( editor.lengthBadges[i].scale.clone() );

            }

        }
        for( i=0;i<editor.areaBadges.length;i++ ){

            if( editor.currentScaleFactor!= undefined && editor.currentScaleFactor!= null && !( editor.currentScaleFactor.equals( editor.zeroVector ) ) ){

                editor.areaBadges[i].scale.set( editor.currentScaleFactor.x, editor.currentScaleFactor.y, 1 );
                editor.areaBadges[i].userData.badgeScaledValue = editor.currentScaleFactor.clone();

            }
            else if( editor.areaBadges[i].userData.badgeScaledValue && editor.areaBadges[i].userData.badgeScaledValue != null && editor.areaBadges[i].userData.badgeScaledValue != undefined ){

                var oldScaleValue = editor.areaBadges[i].userData.badgeScaledValue;
                editor.areaBadges[i].scale.set( oldScaleValue.x, oldScaleValue.y, oldScaleValue.z );
                editor.currentScaleFactor.copy( oldScaleValue );

            }
            else{

                editor.currentScaleFactor.copy( editor.areaBadges[i].scale.clone() );

            }

        }

        for( i=0;i<editor.nwBadges.length;i++ ){

            if( editor.currentScaleFactor!= undefined && editor.currentScaleFactor!= null && !( editor.currentScaleFactor.equals( editor.zeroVector ) ) ){

                editor.nwBadges[i].scale.set( editor.currentScaleFactor.x, editor.currentScaleFactor.y, 1 );
                editor.nwBadges[i].userData.badgeScaledValue = editor.currentScaleFactor.clone();

            }
            else if( editor.nwBadges[i].userData.badgeScaledValue && editor.nwBadges[i].userData.badgeScaledValue != null && editor.nwBadges[i].userData.badgeScaledValue != undefined ){

                var oldScaleValue = editor.nwBadges[i].userData.badgeScaledValue;
                editor.nwBadges[i].scale.set( oldScaleValue.x, oldScaleValue.y, oldScaleValue.z );
                editor.currentScaleFactor.copy( oldScaleValue );
                
            }
            else{

                editor.currentScaleFactor.copy( editor.nwBadges[i].scale.clone() );

            }

        }
        
        editor.signals.sceneGraphChanged.dispatch();

    } );
}