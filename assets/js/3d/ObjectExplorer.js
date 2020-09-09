/**
 * ObjectExplorer - Object explorer and tree view generator for Object3D
 * @constructor
 * @param {Object} editor
 * @author Hari
 */
var ObjectExplorer = function( editor ){

    var scope = this;
    this.cameraCount = 0;
    this.objectsToTrack = [];
    this.listWrapper = document.createElement( 'div' );
    //this.listWrapper.setAttribute( 'class', 'container' );
    this.listWrapper.setAttribute( 'id', 'object-explorer' );

    this.listPanel = document.createElement( 'div' );
    this.listPanel.setAttribute( 'class', 'panel panel-default' );

    //Camera list start
    this.camList = document.createElement( 'div' );
    this.camList.setAttribute( 'class', 'panel-heading librePanelHeading' );
    this.camList.setAttribute( 'style', 'color: #000000;' );

    var collapseBtn = document.createElement( 'button' );
    collapseBtn.setAttribute( 'class', 'btn btn-default btn-xs list-clpse-btn' );
    collapseBtn.setAttribute( 'data-toggle', 'collapse' );
    collapseBtn.innerHTML = '-';
    this.camList.appendChild( collapseBtn );
    
    //Toggling the list expand or collapse button icon between + and -
    collapseBtn.addEventListener( 'click', function( event ){

        if( collapseBtn.innerHTML === '-' ){
            
            collapseBtn.innerHTML = '+';

        }
        else{
            
            collapseBtn.innerHTML = '-';

        }

    } );

    var nameSpan = document.createElement( 'span' );
    //nameSpan.setAttribute( 'style', 'font-weight:bold; font-size:15px;' );
    nameSpan.setAttribute( 'style', 'font-weight:bold;' );
    nameSpan.innerHTML = 'Cameras';
    this.camList.appendChild( nameSpan );

    var hideCameraButton = document.createElement('button');
    hideCameraButton.setAttribute( 'class', 'btn btn-default btn-xs list-clpse-btn' );
    hideCameraButton.setAttribute( 'style', ' margin-left: 130px;margin-top: 0%;' );
    hideCameraButton.setAttribute( 'id', 'hideAllCameraButton' );
    hideCameraButton.innerHTML ='<span class="fa fa-eye-slash"></span>';
    hideCameraButton.addEventListener('click', ( event )=>{
        if(editor.theatreMode){
            
            toastr.warning( editor.languageData.DisableTheatremodeandtryagain )
            return;
        } else if ( editor.hideAllFrustum == true ){
            toastr.warning( editor.languageData.Pleaseenablethefrustumandtryagain )
            return;
        }
        else{

            if(editor.hideAllCamera){
            
                editor.hideAllCamera = false;
                hideCameraButton.innerHTML ='<span class="fa fa-eye"></span>';
                editor.signals.cameraShowHideSignal.dispatch( editor.hideAllCamera );
                editor.deselect();
                
                //Modified for activity logging start
                    try{

                        //Modified for activity logging start
                        var logDatas = {};
                        logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Hide all camera in the editor";
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
            else{
             
                editor.hideAllCamera = true;
                hideCameraButton.innerHTML ='<span class="fa fa-eye-slash"></span>';
                editor.signals.cameraShowHideSignal.dispatch( editor.hideAllCamera );
                editor.deselect();
            //Modified for activity logging start
             try{

            //Modified for activity logging start
                var logDatas = {};
                logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Show all camera in the editor";
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
        }
    })
    
    this.camList.appendChild( hideCameraButton );

    
    this.camUl = document.createElement( 'ul' );
    //this.camUl.setAttribute( 'class', 'collapse librePanelSubListGroupItem' );
    
    /******************************************************************/
    this.camUl.setAttribute( 'class', 'collapse librePanelSubListGroupItem in' );//newly added
    /******************************************************************/
    
    this.camUl.setAttribute( 'id', 'camera-list-ul' );
    collapseBtn.setAttribute( 'data-target', '#camera-list-ul' );
    this.camList.appendChild( scope.camUl );

    this.listWrapper.appendChild( scope.camList );
    //Camera list end

    //Sensors start
    this.sensorsList = document.createElement( 'div' );
    this.sensorsList.setAttribute( 'class', 'panel-heading librePanelHeading' );
    this.sensorsList.setAttribute( 'style', 'color: #000000;' );

    var collapseBtnSensor = document.createElement( 'button' );
    collapseBtnSensor.setAttribute( 'class', 'btn btn-default btn-xs list-clpse-btn' );
    collapseBtnSensor.setAttribute( 'data-toggle', 'collapse' );
    collapseBtnSensor.innerHTML = '-';
    this.sensorsList.appendChild( collapseBtnSensor );
    
    //Toggling the list expand or collapse button icon between + and -
    collapseBtnSensor.addEventListener( 'click', function( event ){

        if( collapseBtnSensor.innerHTML === '-' ){
            
            collapseBtnSensor.innerHTML = '+';

        }
        else{
            
            collapseBtnSensor.innerHTML = '-';

        }

    } );

    var nameSpan = document.createElement( 'span' );
    //nameSpan.setAttribute( 'style', 'font-weight:bold; font-size:15px;' );
    nameSpan.setAttribute( 'style', 'font-weight:bold;' );
    nameSpan.innerHTML = editor.languageData.THREEDLiDARSensor;
    this.sensorsList.appendChild( nameSpan );


    this.sensorsUl = document.createElement( 'ul' );
    
    this.sensorsUl.setAttribute( 'class', 'collapse librePanelSubListGroupItem in' );
    
    this.sensorsUl.setAttribute( 'id', 'sensors-list-ul' );
    collapseBtnSensor.setAttribute( 'data-target', '#sensors-list-ul' );
    this.sensorsList.appendChild( scope.sensorsUl );
    this.listWrapper.appendChild( scope.sensorsList );
    //Sensors end

    //Smart Sensor List
    this.smartSensorList = document.createElement('div');
    this.smartSensorList.setAttribute('class', 'panel-heading librePanelHeading');
    this.smartSensorList.setAttribute('style', 'color: #000000;');

    var smartSensorClose = document.createElement('button');
    smartSensorClose.setAttribute('class', 'btn btn-default btn-xs list-clpse-btn');
    smartSensorClose.setAttribute('data-toggle', 'collapse');
    smartSensorClose.innerHTML = '-';
    this.smartSensorList.appendChild(smartSensorClose);

    //Toggling the list expand or collapse button icon between + and -
    smartSensorClose.addEventListener('click', function (event) {

        if (smartSensorClose.innerHTML === '-') {

            smartSensorClose.innerHTML = '+';

        }
        else {

            smartSensorClose.innerHTML = '-';

        }

    });
    var smartSensorField = document.createElement('span');
    smartSensorField.setAttribute('style', 'font-weight:bold;');
    smartSensorField.innerHTML = editor.languageData.SmartSensor;
    this.smartSensorList.appendChild(smartSensorField);

    this.smartSensorUl = document.createElement('ul');

    this.smartSensorUl.setAttribute('class', 'collapse librePanelSubListGroupItem in');//newly added

    this.smartSensorUl.setAttribute('id', 'smartSensor-list-ul');
    smartSensorClose.setAttribute('data-target', '#smartSensor-list-ul');
    this.smartSensorList.appendChild(scope.smartSensorUl);

    this.listWrapper.appendChild(scope.smartSensorList);
    //Smart Sensor List

    //Camera Reference list start
    this.camRefPointList = document.createElement( 'div' );
    this.camRefPointList.setAttribute( 'class', 'panel-heading librePanelHeading' );
    this.camRefPointList.setAttribute( 'style', 'color: #000000;' );

    var clpseBtn = document.createElement( 'button' );
    clpseBtn.setAttribute( 'class', 'btn btn-default btn-xs list-clpse-btn' );
    clpseBtn.setAttribute( 'data-toggle', 'collapse' );
    clpseBtn.innerHTML = '-';
    this.camRefPointList.appendChild( clpseBtn );
    
    //Toggling the list expand or collapse button icon between + and -
    clpseBtn.addEventListener( 'click', function( event ){

        if( clpseBtn.innerHTML === '-' ){
            
            clpseBtn.innerHTML = '+';

        }
        else{
            
            clpseBtn.innerHTML = '-';

        }

    } );

    var listTitleField = document.createElement( 'span' );
    listTitleField.setAttribute( 'style', 'font-weight:bold;' );
    listTitleField.innerHTML = 'Reference Points';
    this.camRefPointList.appendChild( listTitleField );

    this.camRefPointUl = document.createElement( 'ul' );
    
    this.camRefPointUl.setAttribute( 'class', 'collapse librePanelSubListGroupItem in' );//newly added
    
    this.camRefPointUl.setAttribute( 'id', 'camera-reference-list-ul' );
    clpseBtn.setAttribute( 'data-target', '#camera-reference-list-ul' );
    this.camRefPointList.appendChild( scope.camRefPointUl );

    this.listWrapper.appendChild( scope.camRefPointList );
    //Camera Reference list end

    //Cabling  list start

    this.cablingList = document.createElement( 'div' );
    this.cablingList.setAttribute( 'class', 'panel-heading librePanelHeading' );
    this.cablingList.setAttribute( 'style', 'color: #000000;' );
    
    var cablingListClose = document.createElement( 'button' );
    cablingListClose.setAttribute( 'class', 'btn btn-default btn-xs list-clpse-btn' );
    cablingListClose.setAttribute( 'data-toggle', 'collapse' );
    cablingListClose.innerHTML = '-';
    this.cablingList.appendChild( cablingListClose );
        
    //Toggling the list expand or collapse button icon between + and -
    cablingListClose.addEventListener( 'click', function( event ){
        
        
        if( cablingListClose.innerHTML === '-' ){
                
            cablingListClose.innerHTML = '+';
        
        }
        else{

            cablingListClose.innerHTML = '-';
        
        }
        
 

    } );
    
    var cablingListField = document.createElement( 'span' );
    cablingListField.setAttribute( 'style', 'font-weight:bold;' );
    cablingListField.innerHTML = 'Cabling Lists';
    this.cablingList.appendChild( cablingListField );
        
    this.cablingListUl = document.createElement( 'ul' );
        
    this.cablingListUl.setAttribute( 'class', 'collapse librePanelSubListGroupItem in' );//newly added
        
    this.cablingListUl.setAttribute( 'id', 'network-cabling-list-ul' );
    cablingListClose.setAttribute( 'data-target', '#network-cabling-list-ul' );
    this.cablingList.appendChild( scope.cablingListUl );
    
    this.listWrapper.appendChild( scope.cablingList );
    //Cabling list end

    //2D Drawing list start
    this.twoDDrawingList = document.createElement( 'div' );
    this.twoDDrawingList.setAttribute( 'class', 'panel-heading librePanelHeading' );
    this.twoDDrawingList.setAttribute( 'style', 'color: #000000;' );

    var twoDListClose = document.createElement( 'button' );
    twoDListClose.setAttribute( 'class', 'btn btn-default btn-xs list-clpse-btn' );
    twoDListClose.setAttribute( 'data-toggle', 'collapse' );
    twoDListClose.innerHTML = '-';
    this.twoDDrawingList.appendChild( twoDListClose );

    //Toggling the list expand or collapse button icon between + and -
    twoDListClose.addEventListener( 'click', function( event ){
        
        if( twoDListClose.innerHTML === '-' ){
                
            twoDListClose.innerHTML = '+';
        
        }
        else{

            twoDListClose.innerHTML = '-';
        
        }
        
    } );
    var twoDListField = document.createElement( 'span' );
    twoDListField.setAttribute( 'style', 'font-weight:bold;' );
    twoDListField.innerHTML = '2D Line Lists';
    this.twoDDrawingList.appendChild( twoDListField );

    this.twoDDrawingListUl = document.createElement( 'ul' );
        
    this.twoDDrawingListUl.setAttribute( 'class', 'collapse librePanelSubListGroupItem in' );//newly added
        
    this.twoDDrawingListUl.setAttribute( 'id', 'twod-drawing-list-ul' );
    twoDListClose.setAttribute( 'data-target', '#twod-drawing-list-ul' );
    this.twoDDrawingList.appendChild( scope.twoDDrawingListUl );
    
    this.listWrapper.appendChild( scope.twoDDrawingList );
    //2D Drawing list end

    //Junction Box List
    this.junctionBoxList = document.createElement('div');
    this.junctionBoxList.setAttribute('class', 'panel-heading librePanelHeading');
    this.junctionBoxList.setAttribute('style', 'color: #000000;');

    var junctionBoxClose = document.createElement('button');
    junctionBoxClose.setAttribute('class', 'btn btn-default btn-xs list-clpse-btn');
    junctionBoxClose.setAttribute('data-toggle', 'collapse');
    junctionBoxClose.innerHTML = '-';
    this.junctionBoxList.appendChild(junctionBoxClose);

    //Toggling the list expand or collapse button icon between + and -
    junctionBoxClose.addEventListener('click', function (event) {

        if (junctionBoxClose.innerHTML === '-') {

            junctionBoxClose.innerHTML = '+';

        }
        else {

            junctionBoxClose.innerHTML = '-';

        }

    });
    var junctionBoxField = document.createElement('span');
    junctionBoxField.setAttribute('style', 'font-weight:bold;');
    junctionBoxField.innerHTML = 'Junction Box';
    this.junctionBoxList.appendChild(junctionBoxField);

    this.junctionBoxListUl = document.createElement('ul');

    this.junctionBoxListUl.setAttribute('class', 'collapse librePanelSubListGroupItem in');//newly added

    this.junctionBoxListUl.setAttribute('id', 'junction-box-list-ul');
    junctionBoxClose.setAttribute('data-target', '#junction-box-list-ul');
    this.junctionBoxList.appendChild(scope.junctionBoxListUl);

    this.listWrapper.appendChild(scope.junctionBoxList);
    //Junction Box List

    //Person List Start
    this.personList = document.createElement('div');
    this.personList.setAttribute('class', 'panel-heading librePanelHeading');
    this.personList.setAttribute('style', 'color: #000000;');

    var personClose = document.createElement('button');
    personClose.setAttribute('class', 'btn btn-default btn-xs list-clpse-btn');
    personClose.setAttribute('data-toggle', 'collapse');
    personClose.innerHTML = '-';
    this.personList.appendChild(personClose);

    //Toggling the list expand or collapse button icon between + and -
    personClose.addEventListener('click', function (event) {

        if (personClose.innerHTML === '-') {
            personClose.innerHTML = '+';
        }
        else {
            personClose.innerHTML = '-';
        }

    });

    var personField = document.createElement('span');
    personField.setAttribute('style', 'font-weight:bold;');
    personField.innerHTML = 'Person';
    this.personList.appendChild(personField);
    this.personListUl = document.createElement('ul');
    this.personListUl.setAttribute('class', 'collapse librePanelSubListGroupItem in');//newly added
    this.personListUl.setAttribute('id', 'person-list-ul');
    personClose.setAttribute('data-target', '#person-list-ul');
    this.personList.appendChild(scope.personListUl);
    this.listWrapper.appendChild(scope.personList);
    //Person List End


    //Luggage List Start
    this.luggageList = document.createElement('div');
    this.luggageList.setAttribute('class', 'panel-heading librePanelHeading');
    this.luggageList.setAttribute('style', 'color: #000000;');

    var luggageClose = document.createElement('button');
    luggageClose.setAttribute('class', 'btn btn-default btn-xs list-clpse-btn');
    luggageClose.setAttribute('data-toggle', 'collapse');
    luggageClose.innerHTML = '-';
    this.luggageList.appendChild(luggageClose);

    //Toggling the list expand or collapse button icon between + and -
    luggageClose.addEventListener('click', function (event) {

        if (luggageClose.innerHTML === '-') {
            luggageClose.innerHTML = '+';
        }
        else {
            luggageClose.innerHTML = '-';
        }

    });

    var luggageField = document.createElement('span');
    luggageField.setAttribute('style', 'font-weight:bold;');
    luggageField.innerHTML = 'Luggage';
    this.luggageList.appendChild(luggageField);
    this.luggageListUl = document.createElement('ul');
    this.luggageListUl.setAttribute('class', 'collapse librePanelSubListGroupItem in');//newly added
    this.luggageListUl.setAttribute('id', 'luggage-list-ul');
    luggageClose.setAttribute('data-target', '#luggage-list-ul');
    this.luggageList.appendChild(scope.luggageListUl);
    this.listWrapper.appendChild(scope.luggageList);
    //Luggage List End

    // Point of Interest List Start

    this.pointOfInterestList = document.createElement('div');
    this.pointOfInterestList.setAttribute('class', 'panel-heading librePanelHeading');
    this.pointOfInterestList.setAttribute('style', 'color: #000000;');

    var pointOfInterestClose = document.createElement('button');
    pointOfInterestClose.setAttribute('class', 'btn btn-default btn-xs list-clpse-btn');
    pointOfInterestClose.setAttribute('data-toggle', 'collapse');
    pointOfInterestClose.innerHTML = '-';
    this.pointOfInterestList.appendChild(pointOfInterestClose);

    //Toggling the list expand or collapse button icon between + and -
    pointOfInterestClose.addEventListener('click', function (event) {

        if (pointOfInterestClose.innerHTML === '-') {

            pointOfInterestClose.innerHTML = '+';

        }
        else {

            pointOfInterestClose.innerHTML = '-';

        }

    });
    var pointOfInterestField = document.createElement('span');
    pointOfInterestField.setAttribute('style', 'font-weight:bold;');
    pointOfInterestField.innerHTML = 'Point Of Interest';
    this.pointOfInterestList.appendChild(pointOfInterestField);

    this.pointOfInterestListUl = document.createElement('ul');

    this.pointOfInterestListUl.setAttribute('class', 'collapse librePanelSubListGroupItem in');//newly added

    this.pointOfInterestListUl.setAttribute('id', 'pointofinterest-box-list-ul');
    pointOfInterestClose.setAttribute('data-target', '#pointofinterest-box-list-ul');
    this.pointOfInterestList.appendChild(scope.pointOfInterestListUl);

    this.listWrapper.appendChild(scope.pointOfInterestList);

    // Point of Interest List Start

    this.listWrapper.appendChild( scope.listPanel );

    this.dom = this.listWrapper;
    //document.getElementById( 'editorElement' ).appendChild( scope.listWrapper );

    return scope;

}

ObjectExplorer.prototype = {

    /**
     * generateTree( object ) - Generates the tree structure for the specified object.
     * @param {Object} object - The THREE.Object3D instance to be attached to the list.
     * @returns {Void}
     * @author Hari
     */
    generateTree : function( object ){

        var scope = this;
        //scope.listPanel.appendChild( scope.genListRecursive( object ).bind( scope ) );
        scope.listPanel.appendChild( scope.genListRecursive( object ) );

    },

    /**
     * genListRecursive( object ) - Uses recursive method to search for children and generate list structure.
     * @param {Object} object - A THREE.Object3D instance whose tree structure should be generated. 
     * @returns {Void}
     * @author Hari
     */
    genListRecursive : function( object ){

        var scope = this;

        //List head with the object name
        var objectHead = document.createElement( 'div' );
        objectHead.setAttribute( 'class', 'panel-heading librePanelHeading' );
        objectHead.setAttribute( 'id', object.uuid + '-list-head' );
        
        objectHead.setAttribute( 'value', object.id );// Newly added

        objectHead.setAttribute( 'data-toggle', 'collapse' );
        var listParent = ( object.name && object.name != '' )? object.name : 'Parent-no-name';
        //objectHead.innerHTML = '<b class="fa fa-cubes"></b><span>' + listParent + '</span>';
        
        //
        var collapseBtn = document.createElement( 'button' );
        collapseBtn.setAttribute( 'class', 'btn btn-default btn-xs list-clpse-btn' );
        collapseBtn.setAttribute( 'data-toggle', 'collapse' );
        collapseBtn.innerHTML = '-';
        objectHead.appendChild( collapseBtn );
        
        //Toggling the list expand or collapse button icon between + and -
        collapseBtn.addEventListener( 'click', function( event ){

            if( collapseBtn.innerHTML === '-' ){
                
                collapseBtn.innerHTML = '+';

            }
            else{
                
                collapseBtn.innerHTML = '-';

            }

        } );

        //var cubesIcon = document.createElement( 'b' );
        //cubesIcon.setAttribute( 'class', 'fa fa-cubes' );
        //cubesIcon.setAttribute( 'value', object.id );
        //objectHead.appendChild( cubesIcon );

        var nameSpan = document.createElement( 'span' );
        //nameSpan.setAttribute( 'style', 'font-weight:bold; font-size:15px;' );
        nameSpan.setAttribute( 'style', 'font-weight:bold;' );
        nameSpan.setAttribute( 'value', object.id );
        nameSpan.innerHTML = listParent;
        objectHead.appendChild( nameSpan );
        //

        //Listener for name span click
        nameSpan.addEventListener( 'click', function( evt ){

            if( evt.target === this ){

                scope.onListClick( Number( this.getAttribute( 'value' ) ) );

            }

        } );

        //Listener for mouse click on the list collapse link
        objectHead.addEventListener( 'click', function( evt ){

            if( evt.target === this ){

                scope.onListClick( Number( this.getAttribute( 'value' ) ) );

            }

        } );

        scope.objectsToTrack.push( object.uuid );//Newly added
        //

        if( object.children.length != 0 ){

            var childArray = object.children;
            var len = childArray.length;
            var twoDLineCount = 1; //Added to include counter for TwoD Line
             //Added to include counter for cameras

            var ulList = document.createElement( 'ul' );
            ulList.setAttribute( 'class', 'collapse librePanelSubListGroupItem in' );
            ulList.setAttribute( 'id', object.uuid + '-ul' );
            collapseBtn.setAttribute( 'data-target', '#' + ulList.getAttribute( 'id' ) );

            for( var i = 0; i < len; i++ ){
            
                //Modified to prevent meassurementsession
                if( childArray[ i ] instanceof THREE.Group && childArray[ i ].name === "MeasurementSession" ){

                    continue;

                }
                else if( childArray[ i ] instanceof THREE.Group && childArray[ i ].name === "AreaMeasurementSession" ){
                    
                    continue;

                }
                else if( (/^RefPointCameraLOS\d+/g).test(childArray[ i ].name ) ){

                    continue;

                }
                else if( childArray[ i ] instanceof THREE.Sprite && childArray[ i ].name === "RefCamLineValueBadge" ){

                    continue;

                }
                else if( childArray[ i ] instanceof THREE.Group && childArray[ i ].name === "NetworkCablingSession" ){
                   
                    /*var listItem = document.createElement( 'li' );
                    listItem.setAttribute( 'class', 'list-group-item librePanelListGroupItem' );

                    listItem.setAttribute( 'id', childArray[ i ].uuid + '-li' );//Newly added

                    var listChild = ( childArray[ i ].name && childArray[ i ].name != '' )?childArray[ i ].name : 'Network Cabling';
                    listItem.innerHTML = '<b class="fa fa-cube"></b> <span>' + listChild + '</span>';
                    scope.cablingListUl.appendChild( listItem );

                    listItem.setAttribute( 'value', childArray[ i ].id );

                    listItem.addEventListener( 'click', function( evt ){

                        scope.onListClick( Number( this.getAttribute( 'value' ) ) );

                    } );

                    scope.objectsToTrack.push( childArray[ i ].uuid );*/

                    //
                    childArray[ i ].traverse( function( nwSessionChild ){

                        if( nwSessionChild.name === "NetworkingCable" ){

                            var listItem = document.createElement( 'li' );
                            listItem.setAttribute( 'class', 'list-group-item librePanelListGroupItem' );

                            listItem.setAttribute( 'id', nwSessionChild.uuid + '-li' );//Newly added

                            //var listChild = ( nwSessionChild.name && nwSessionChild.name != '' )?nwSessionChild.name : 'Network Cabling';
                            var listChild = ( editor.scene.userData.cableDatas && editor.scene.userData.cableDatas[ nwSessionChild.uuid ] && editor.scene.userData.cableDatas[ nwSessionChild.uuid ].label )? editor.scene.userData.cableDatas[ nwSessionChild.uuid ].label : 'Network Cable';

                            listItem.innerHTML = '<b class="fa fa-cube"></b> <span>' + listChild + '</span>';
                            scope.cablingListUl.appendChild( listItem );

                            listItem.setAttribute( 'value', nwSessionChild.id );

                            listItem.addEventListener( 'click', function( evt ){

                                scope.onListClick( Number( this.getAttribute( 'value' ) ) );

                            } );

                            scope.objectsToTrack.push( nwSessionChild.uuid );

                        }
                        else if ( nwSessionChild instanceof THREE.Mesh && ((/^JunctionBox[1-9]+[0-9]*/g).test( nwSessionChild.name )) ){
                            var listItem = document.createElement('li');
                            listItem.setAttribute('class', 'list-group-item librePanelListGroupItem');
                            listItem.setAttribute('id', nwSessionChild.uuid + '-li');//Newly added

                            var listChild = (nwSessionChild.name && nwSessionChild.name != '') ? nwSessionChild.name : 'JunctionBox';
                            listItem.innerHTML = '<b class="fa fa-cube"></b> <span>' + listChild + '</span>';
                            scope.junctionBoxListUl.appendChild(listItem);

                            listItem.setAttribute('value', nwSessionChild.id);

                            listItem.addEventListener('click', function (evt) {

                                scope.onListClick(Number(this.getAttribute('value')));

                            });

                            scope.objectsToTrack.push(nwSessionChild.uuid);//Newly added
                        }

                    } );
                    //

                }
                else if( childArray[ i ] instanceof THREE.Group && childArray[ i ].name === "TwoDMeasurementSession"){
                    
                    childArray[ i ].traverse( function( twoDLine ) {

                        if( twoDLine.name === "2DMeasurement" ) {
                            
                            var listItem = document.createElement( 'li' );
                            listItem.setAttribute( 'class', 'list-group-item librePanelListGroupItem' );

                            listItem.setAttribute( 'id', twoDLine.uuid + '-li' );//Newly added

                            var listChild;
                            if( twoDLine.userData.lineLabel == "2D Line" ){

                                if( editor.scene.userData.twoDDrawingDatas && editor.scene.userData.twoDDrawingDatas[twoDLine.uuid] && editor.scene.userData.twoDDrawingDatas[twoDLine.uuid][1] && editor.scene.userData.twoDDrawingDatas[twoDLine.uuid][1].label ) {
                                    
                                    listChild = '2D Line ' + editor.scene.userData.twoDDrawingDatas[twoDLine.uuid][1].label.substr(1);

                                } else {

                                    listChild = '2D Line ' + twoDLineCount;

                                }

                            } else {

                                listChild = twoDLine.userData.lineLabel;

                            }
                            ++twoDLineCount;
                            
                            listItem.innerHTML = '<b class="fa fa-cube"></b> <span>' + listChild + '</span>';
                            scope.twoDDrawingListUl.appendChild( listItem );

                            listItem.setAttribute( 'value', twoDLine.id );
                            listItem.addEventListener( 'click', function( evt ){

                                scope.onListClick( Number( this.getAttribute( 'value' ) ) );

                            } );

                            scope.objectsToTrack.push( twoDLine.uuid );

                        }

                    } )

                }

                //For Reference point start
                else if( ( childArray[ i ] instanceof THREE.Sprite ) && ( childArray[ i ].camerauuid != null ) && ( childArray[ i ].camerauuid != undefined ) ){

                    var listItem = document.createElement( 'li' );
                    listItem.setAttribute( 'class', 'list-group-item librePanelListGroupItem' );
                    
                    listItem.setAttribute( 'id', childArray[ i ].uuid + '-li' );//Newly added
                    
                    var listChild = ( childArray[ i ].name && childArray[ i ].name != '' )?childArray[ i ].name : 'Referencepoint';
                    listItem.innerHTML = '<b class="fa fa-cube"></b> <span>' + listChild + '</span>';
                    scope.camRefPointUl.appendChild( listItem );

                    listItem.setAttribute( 'value', childArray[ i ].id );

                    listItem.addEventListener( 'click', function( evt ){

                        scope.onListClick( Number( this.getAttribute( 'value' ) ) );
        
                    } );

                    scope.objectsToTrack.push( childArray[ i ].uuid );//Newly added

                }//For Reference point end
                
                //For cam list start
                else if( childArray[ i ] instanceof THREE.PerspectiveCamera ){

                    this.cameraCount++;
                    var sortedArray = [];
                    var cameraBadges = [];
                    for(var cameraBadgeNum=0;cameraBadgeNum<editor.sceneCameras.length;cameraBadgeNum++){

                        cameraBadges.push(editor.sceneCameras[cameraBadgeNum].badgeText);
    
                    }
                    sortedArray = cameraBadges.sort( function(a, b){return a - b} );

                    childArray[i].traverse( function( child ) {

                        if( child instanceof THREE.Group && child.userData && child.userData.modelType === 'not-a-base-model' ){
                            var listItem = document.createElement('li');
                            listItem.setAttribute('class', 'list-group-item librePanelListGroupItem');
                            listItem.setAttribute('id', child.uuid + '-li');

                            if( child.userData.type === "person" ){
                            
                                var listChild = (child.name && child.name != '') ? child.name : 'Person';
                                listItem.innerHTML = '<b class="fa fa-cube"></b> <span>' + listChild + '</span>';
                                scope.personListUl.appendChild(listItem);
                            
                            } else if( child.userData.type === "medium-luggage" || child.userData.type === "large-luggage" ){
                            
                                var listChild = (child.name && child.name != '') ? child.name : 'Person';
                                listItem.innerHTML = '<b class="fa fa-cube"></b> <span>' + listChild + '</span>';
                                scope.luggageListUl.appendChild(listItem);
                            
                            }


                            listItem.setAttribute('value', child.id);

                            listItem.addEventListener('click', function (evt) {
                                scope.onListClick(Number(this.getAttribute('value')));
                            });

                            scope.objectsToTrack.push(child.uuid);


                        }

                    } )

                    if( this.cameraCount == editor.sceneCameras.length ) {
                    
                        this.cameraCount = 0;
                        for( cameraBadgeNum=0;cameraBadgeNum<sortedArray.length;cameraBadgeNum++ ) {

                            for( cameraWithBadgeNum=0;cameraWithBadgeNum<editor.sceneCameras.length;cameraWithBadgeNum++ ) {
        
                                if( sortedArray[cameraBadgeNum] == editor.sceneCameras[cameraWithBadgeNum].badgeText ) {
                                    
                                    var selectedCamera = editor.sceneCameras[cameraWithBadgeNum];
                                    var listItem = document.createElement( 'li' );
                                    listItem.setAttribute( 'class', 'list-group-item librePanelListGroupItem' );
                                    
                                    listItem.setAttribute( 'id', selectedCamera.uuid + '-li' );//Newly added
                                    
                                    var listChild = ( selectedCamera.name && selectedCamera.name != '' )?selectedCamera.name : 'Camera-no-name';
                                    
                                    //Simulation in interactive view mode start

                                    if( localStorage.getItem("viewmode") == "true") {
                                            
                                        if( selectedCamera && ( selectedCamera === editor.sceneCameras[ editor.sceneCameras.length - 1 ] ) ){
        
                                            listItem.innerHTML = '<b><span class="badge last-camera-highlight" style = "background-color: #CC2624">'+selectedCamera.badgeText+'</span></b> <span>' + listChild + '</span><span class = "fa fa-play" style="float:right; cursor:pointer" id=' + selectedCamera.uuid + '-play ></span>' 
                    
                                        }
                                        else if ( selectedCamera )
                                        {
                    
                                            listItem.innerHTML = '<b><span class="badge" style = "background-color: black;color:white">'+selectedCamera.badgeText+'</span></b> <span>' + listChild + '</span><span class = "fa fa-play"  style="float:right; cursor:pointer" id=' + selectedCamera.uuid + '-play ></span>';
                    
                                        }                                        
                                        if( editor.sceneCameras[cameraWithBadgeNum].camCategory == "LiDAR" ){
                                            scope.sensorsUl.appendChild( listItem );
                                        }
                                        else{
                                            scope.camUl.appendChild( listItem );
                                        }
                                        listItem.setAttribute( 'value', selectedCamera.id );
                
                                        listItem.addEventListener( 'click', function( evt ){
                
                                            scope.onListClick( Number( this.getAttribute( 'value' ) ) );
                            
                                        } );
                
                                        listItem.addEventListener( 'contextmenu', function( event ){
                
                                            scope.onListRightClick( Number( this.getAttribute( 'value' ) ), event  );
                
                                        } );
                                        document.getElementById(selectedCamera.uuid + '-play').addEventListener('click',function(){
                                            if(editor.theatreMode){
                                                
                                                var indexPos = this.id.lastIndexOf( '-' );
                                                var cameraUuid = this.id.substring( 0, indexPos );
        
                                                editor.getObjectByUuid( cameraUuid ).then( ( camera ) => {
                                                    simulationManager.handlePlay( camera );
                                                } )
                                                editor.liveCamera = this.id;
                                            }else{
                                                toastr.info(editor.languageData.EnableTheatreModeandtryagain)
                                            }   
                                        })

                                    }
                                    //Simulation in interactive view mode end

                                    else{
                                        if( selectedCamera && ( selectedCamera === editor.sceneCameras[ editor.sceneCameras.length - 1 ] ) ){
        
                                            listItem.innerHTML = '<b><span class="badge last-camera-highlight" style = "background-color: #CC2624">'+selectedCamera.badgeText+'</span></b> <span>' + listChild  
                    
                                        }
                                        else if ( selectedCamera )
                                        {
                    
                                            listItem.innerHTML = '<b><span class="badge" style = "background-color: black;color:white">'+selectedCamera.badgeText+'</span></b> <span>' + listChild 
                    
                                        }
                                        if( editor.sceneCameras[cameraWithBadgeNum].camCategory == "LiDAR" ){
                                            scope.sensorsUl.appendChild( listItem );
                                        }
                                        else{
                                            scope.camUl.appendChild( listItem );
                                        }
                                        listItem.setAttribute( 'value', selectedCamera.id );
                
                                        listItem.addEventListener( 'click', function( evt ){
                
                                            scope.onListClick( Number( this.getAttribute( 'value' ) ) );
                            
                                        } );
                                        
                
                                        listItem.addEventListener( 'contextmenu', function( event ){
                
                                            scope.onListRightClick( Number( this.getAttribute( 'value' ) ), event  );
                
                                        } );
                                    }
                                    
                                    
                                    scope.objectsToTrack.push( selectedCamera.uuid );//Newly added
        
                                }
        
                            }
        
                        }
                        if( editor.liveCamera != "" && editor.theatreMode )
                            document.getElementById( editor.liveCamera ).setAttribute( 'class', 'fa fa-pause' )

                    }
                    /*
                    var listItem = document.createElement( 'li' );
                    listItem.setAttribute( 'class', 'list-group-item librePanelListGroupItem' );*/
                    /*
                    
                    listItem.setAttribute( 'id', childArray[ i ].uuid + '-li' );
                    
                    var listChild = ( childArray[ i ].name && childArray[ i ].name != '' )?childArray[ i ].name : 'Camera-no-name';

                    if( childArray[ i ] === editor.sceneCameras[ editor.sceneCameras.length - 1 ] ){

                        listItem.innerHTML = '<b><span class="badge last-camera-highlight" style = "background-color: #CC2624">'+childArray[i].badgeText+'</span></b> <span>' + listChild + '</span>';

                    }
                    else
                    {

                        listItem.innerHTML = '<b><span class="badge" style = "background-color: black;color:white">'+childArray[i].badgeText+'</span></b> <span>' + listChild + '</span>';

                    }
                    
                    scope.camUl.appendChild( listItem );

                    listItem.setAttribute( 'value', childArray[ i ].id );

                    listItem.addEventListener( 'click', function( evt ){

                        scope.onListClick( Number( this.getAttribute( 'value' ) ) );
        
                    } );

                    listItem.addEventListener( 'contextmenu', function( event ){

                        scope.onListRightClick( Number( this.getAttribute( 'value' ) ), event  );

                    } );

                    scope.objectsToTrack.push( childArray[ i ].uuid );
                    */

                }//For cam list end

                //For Junction Box Start
                else if ( childArray[i] instanceof THREE.Mesh && (( /^JunctionBox[1-9]+[0-9]*/g ).test( childArray[i].name )) ) {
                    var listItem = document.createElement('li');
                    listItem.setAttribute('class', 'list-group-item librePanelListGroupItem');

                    listItem.setAttribute('id', childArray[i].uuid + '-li');//Newly added

                    var listChild = (childArray[i].name && childArray[i].name != '') ? childArray[i].name : 'JunctionBox';
                    listItem.innerHTML = '<b class="fa fa-cube"></b> <span>' + listChild + '</span>';
                    scope.junctionBoxListUl.appendChild(listItem);

                    listItem.setAttribute('value', childArray[i].id);

                    listItem.addEventListener('click', function (evt) {

                        scope.onListClick(Number(this.getAttribute('value')));

                    });

                    scope.objectsToTrack.push(childArray[i].uuid);//Newly added

                }
                //For Junction Box End

                //For Junction Box Start
                else if ( childArray[i] instanceof THREE.Group && childArray[i].userData && childArray[i].userData.sensorData ) {
                    var listItem = document.createElement('li');
                    listItem.setAttribute('class', 'list-group-item librePanelListGroupItem');

                    listItem.setAttribute('id', childArray[i].uuid + '-li');//Newly added
                    var listChild = childArray[i].userData.sensorData;
                    var name = childArray[i].name;

                    listItem.innerHTML = '<b><span class="badge" style = "background-color: black;color:white">'+listChild.badgeText+'</span></b> <span>' + name 
                    scope.smartSensorUl.appendChild(listItem);

                    listItem.setAttribute('value', childArray[i].id);

                    listItem.addEventListener('click', function (evt) {

                        scope.onListClick(Number(this.getAttribute('value')));

                    });

                    scope.objectsToTrack.push(childArray[i].uuid);//Newly added

                }
                //For Junction Box End

                //Person and Luggage object start
                else if( childArray[i] instanceof THREE.Group && childArray[i].userData && childArray[i].userData.modelType === 'not-a-base-model' ){

                    var listItem = document.createElement('li');
                    listItem.setAttribute('class', 'list-group-item librePanelListGroupItem');
                    listItem.setAttribute('id', childArray[i].uuid + '-li');

                    if( childArray[i].userData.type === "person" ){
                        var listChild = (childArray[i].name && childArray[i].name != '') ? childArray[i].name : 'Person';
                        listItem.innerHTML = '<b class="fa fa-cube"></b> <span>' + listChild + '</span>';
                        scope.personListUl.appendChild(listItem);
                    } else if( childArray[i].userData.type === "medium-luggage" || childArray[i].userData.type === "large-luggage" ){
                        var listChild = (childArray[i].name && childArray[i].name != '') ? childArray[i].name : 'Person';
                        listItem.innerHTML = '<b class="fa fa-cube"></b> <span>' + listChild + '</span>';
                        scope.luggageListUl.appendChild(listItem);
                    }
                    

                    listItem.setAttribute('value', childArray[i].id);

                    listItem.addEventListener('click', function (evt) {
                        scope.onListClick(Number(this.getAttribute('value')));
                    });

                    scope.objectsToTrack.push(childArray[i].uuid);


                }

                //Person and Luggage object end
                else if( childArray[ i ].children != undefined && childArray[ i ].children.length != 0 ){
                    
                    //test
                    var listItem = document.createElement( 'li' );
                    listItem.setAttribute( 'class', 'list-group-item librePanelListGroupItem' );
                    listItem.setAttribute( 'id', childArray[ i ].uuid + '-li' );
                    ulList.appendChild( listItem );

                    //Newly added
                    listItem.setAttribute( 'value', childArray[ i ].id );
                    listItem.addEventListener( 'click', function( event ){

                        if( event.target === this ){

                            scope.onListClick( Number( this.getAttribute( 'value' ) ) );

                        }
                        //event.stopPropagation();

                    } );

                    var childSubList = scope.genListRecursive( childArray[ i ] );
                    //objectHead.appendChild( childSubList );
                    if( childSubList !== undefined ){

                        listItem.appendChild( childSubList );

                    }
                // For Point of Interest   
                } else if( childArray[i] instanceof THREE.Sprite && (/^Point Of Interest [1-9]+[0-9]*/g).test( childArray[i].name ) ){
                    
                    var listItem = document.createElement('li');
                    listItem.setAttribute('class', 'list-group-item librePanelListGroupItem');

                    listItem.setAttribute('id', childArray[i].uuid + '-li');//Newly added

                    var listChild = (childArray[i].name && childArray[i].name != '') ? childArray[i].name : 'Point Of Interest';
                    listItem.innerHTML = '<b class="fa fa-cube"></b> <span>' + listChild + '</span>';
                    scope.pointOfInterestListUl.appendChild(listItem);

                    listItem.setAttribute('value', childArray[i].id);

                    listItem.addEventListener('click', function (evt) {

                        scope.onListClick(Number(this.getAttribute('value')));

                    });

                    scope.objectsToTrack.push(childArray[i].uuid);//Newly added
                }
                else{
                    
                    //
                    if( childArray[ i ].name === 'EditorOrigin' || childArray[ i ] instanceof THREE.HemisphereLight || childArray[ i ].name === 'DetailsOfPointOfIntrest' || childArray[ i ].name === "StartMeasurementMarker" || childArray[ i ].name === "EndMeasurementMarker" || childArray[ i ].name === "MeasureValueBadge" || childArray[ i ].name === "MeasurementSession" || childArray[ i ].name === "MeasurementConnectionLine" || childArray[ i ].name === "AreaMouseCursor" || childArray[ i ].name === "NetworkCablingSession" || (/^NetworkMarker\d+/g).test(childArray[ i ].name) || childArray[ i ].name === "NetworkCableLengthBadge" || childArray[ i ].name === "NetworkingCable" || childArray[ i ].name === "cablingMouseCursor" || (/^TwoDMeasureMarker\d+/g).test(childArray[ i ].name) || childArray[ i ].name === "TwoDMeasurementBadge" || childArray[ i ].name === "TwoD-MeasurementCursor" || childArray[ i ].name === "TwoDMeasurementSession" || childArray[ i ].name === "2DMeasurement" || childArray[i].name === "JunctionBoxNumberBadge" || childArray[i].name === "AutoRoutedCableLengthBadge"){

                        continue;

                    }
                    //

                    //list.push( childArray[ i ].name );
                    
                    var listItem = document.createElement( 'li' );
                    listItem.setAttribute( 'class', 'list-group-item librePanelListGroupItem' );
                    
                    listItem.setAttribute( 'id', childArray[ i ].uuid + '-li' );//Newly added
                    
                    var listChild = ( childArray[ i ].name && childArray[ i ].name != '' )?childArray[ i ].name : 'Child-no-name';
                    listItem.innerHTML = '<b class="fa fa-cube"></b> <span>' + listChild + '</span>';
                    ulList.appendChild( listItem );
                    //objectHead.appendChild( childArray[ i ].name );

                    listItem.setAttribute( 'value', childArray[ i ].id );

                    listItem.addEventListener( 'click', function( evt ){

                        //if( evt.target === this ){
                            
                            scope.onListClick( Number( this.getAttribute( 'value' ) ) );

                        //}
                        //evt.stopPropagation();
        
                    } );

                    scope.objectsToTrack.push( childArray[ i ].uuid );//Newly added
                
                }
            
            }
            objectHead.appendChild( ulList );
            return objectHead;

        }
        else{

            //
            if( object.name === 'EditorOrigin' || object instanceof THREE.HemisphereLight || object.name === 'DetailsOfPointOfIntrest' || object.name === "StartMeasurementMarker"  || object.name === "EndMeasurementMarker"  || object.name === "MeasureValueBadge" || object.name === "MeasurementSession" || object.name === "MeasurementConnectionLine" || object.name === "AreaMouseCursor" || object.name === "NetworkCablingSession" || (/^NetworkMarker\d+/g).test(object.name) || object.name === "NetworkCableLengthBadge" || object.name === "NetworkingCable" || object.name === "cablingMouseCursor"|| (/^TwoDMeasureMarker\d+/g).test(object.name) || object.name === "TwoDMeasurementBadge" || object.name === "TwoD-MeasurementCursor" || object.name === "TwoDMeasurementSession" || object.name === "2DMeasurement" || object.name === "JunctionBoxNumberBadge" || object.name === "AutoRoutedCableLengthBadge"){

                return;

            }
            //

            var listItem = document.createElement( 'li' );
            listItem.setAttribute( 'class', 'list-group-item librePanelListGroupItem' );

            listItem.setAttribute( 'id', object.uuid + '-li' );//Newly added

            var listChild = ( object.name && object.name != '' )? object.name : 'Child-no-name';
            listItem.innerHTML = '<b class="fa fa-cube"></b> <span>' + listChild + '</span>';
            objectHead.appendChild( listItem );

            listItem.addEventListener( 'click', function( evt ){

                //if( evt.target === this ){

                    scope.onListClick( Number( this.getAttribute( 'value' ) ) );

                //}
                //evt.stopPropagation();

            } );

            return objectHead;

        }

    },

    showCntxtPlayPause : function (selectedItem, event) {

        event.preventDefault();
        var onPlayClicked = function(selectedItem) {

            simulationManager.handlePlay(selectedItem);

        }

        var onPauseClicked = function(selectedItem) {

            simulationManager.handlePause(selectedItem);

        }

        var items = [

            {
                title: editor.languageData.Play,
                icon: 'fa fa-play',
                fn: function() {
                    onPlayClicked(selectedItem);
                }
            },
            {
                title: editor.languageData.Pause,
                icon: 'fa fa-pause',
                fn: function() {
                    onPauseClicked(selectedItem);
                }
            }

        ];

        basicContext.show(items, event);

    },
    showPanoramaContextMenu : function ( selectedItem, event ){
        event.preventDefault();

        var prcsSmltdViewClkd = function( selectedItem ){
            simulationManager.processPanorama( selectedItem );
        }

        var items = [

            {
                title: editor.languageData.ProcessSimulatedView,
                icon: 'fa fa-picture-o',
                fn: function() {
                    prcsSmltdViewClkd( selectedItem );
                }
            },

        ];

        basicContext.show(items, event);
    },

    /**
     * onListClick( id ) - Tasks to be executed when the user clicks on a list item.
     * @param {Number} id - Id of the object to be selected.
     * @returns {Void}
     * @author Hari
     */
    onListClick : function( id ){

        var scope = this;
        editor.selectById( parseInt( id ) );
        scope.highlightItem( editor.selected, false );

    },

    /**
     * onListRightClick( id ) - Tasks to be executed when the user right clicks on a list item.
     * @param {Number} id - Id of the object which right clicked.
     * @returns {Void}
     * @author Pr@vi
     */

    onListRightClick : function( id, event ){
        var scope = this;
        editor.selectById( parseInt( id ) );
        var item = editor.selected;
        if(editor.theatreMode){
            if( item != undefined && item instanceof THREE.PerspectiveCamera ){
                if( item.camCategory != undefined && item.camCategory == "Panorama" ){
                    scope.showPanoramaContextMenu( item, event );
                }
                else{
                    scope.showCntxtPlayPause( item, event );
                }
            }
        }
    },

    /**
     * addToList( listId, object ) - Attaches subtree of object to the list with id listId
     * @param {String} listId - Id of the list element to which the subtree should be attached
     * @param {Object} object - Object whos subtree should be attached to the list
     * @returns {Void}
     * @author Hari
     */
    addObjectToList : function( listId, object ){

        var scope = this;
        var list = document.getElementById( listId );
        if( list === null ){
            
            console.warn( 'Can\'t find an element with id' + listId + '. Item can\'t be attached to the list!' );
            return;

        }

        var subList = scope.genListRecursive( object );
        //Creating a list item
        var listItem = document.createElement( 'li' );
        listItem.setAttribute( 'class', 'list-group-item librePanelListGroupItem' );
        listItem.setAttribute( 'id', object.uuid + '-li' );
        listItem.appendChild( subList );

        list.appendChild( listItem );

    },

    /**
     * removeObjectFromList( object ) - Removes the object from the list 
     * @param {any} object - Object to be removed from the list(Must be instance of Object3D)
     * @returns {Void}
     * @author Hari
     */
    removeObjectFromList : function( object ){

        var scope = this;
        var listItemId = object.uuid + '-li';
        scope.removeFromList( listItemId );

    },

    /**
     * removeFromList( id ) - Removes an item(specified by id) from the list
     * @param {String} id - Id of the element to be removed  
     * @returns {Void}
     * @author Hari
     */
    removeFromList : function( id ){

        var scope = this;
        var item = document.getElementById( id );
        if( item !== null ){

            var parent = item.parentNode;
            if( parent ){

                parent.removeChild( item );

            }
            else{

                console.warn( 'Parent node of the item can\'t be accessed or the item is not valid' );
                return;

            }

        }
        else{
            
            console.warn( 'can\'t find an element with id ' + id );

        }

    },

    /**
     * addToTrackers( object ) - Adds the object to the list of objects which should be tracked
     * @param {any} object
     * @returns {Void}
     * @author Hari
     */
    addToTrackers : function( object ){

        var scope = this;
        scope.objectsToTrack.push( object.uuid );

    },

    /**
     * removeFromTrackers( object ) - Removes the object from the list of objects which should be tracked
     * @param {any} object
     * @returns {Void}
     * @author Hari
     */
    removeFromTrackers : function( object ){

        var scope = this;
        var objIndex = scope.objectsToTrack.indexOf( object.uuid );
        if( objIndex !== -1 ){

            scope.objectsToTrack.splice( objIndex, 1 );

        }

    },

    /**
     * highlightItem( object )
     * @param {any} object - The object to be selected on the list(Must be instance of Object3D).
     * @param {Boolean} - Flag to point whether the list need to be expanded or not
     * @returns {Void}
     * @author Hari
     */
    highlightItem : function( object, expandList ){

        var scope = this;

        var needToExpand = ( expandList === undefined )? true : expandList;

        var len = scope.objectsToTrack.length;

        for( var i = 0; i < len; i++ ){

            var listItem = document.getElementById( scope.objectsToTrack[ i ] + '-li' );
            if( listItem ){

                listItem.classList.remove( 'collapsible-list-active' );

            }

        }

        if( object === null ) return;

        var currentListItem = document.getElementById( object.uuid + '-li' );
        if( currentListItem ){

            currentListItem.classList.add( 'collapsible-list-active' );

        }

        //Modified to expand the list to the highlighted item start
        
        //Traversing to the container div of the current list
        if( ( currentListItem != null ) && ( needToExpand === true ) ){

            //checking whether the list item is already displayed on the screen or not.
            //If it is already displayed on the screen, then we don't have to execute the following loop.
            if( currentListItem.offsetWidth > 0 && currentListItem.offsetHeight > 0 ){

                //var topPos = currentListItem.offsetTop;
                //document.getElementById( 'object-explorer' ).scrollTop = topPos;
                return;

            }

            var highlightedLi = currentListItem;

            while( highlightedLi != null ){
                
                if( highlightedLi.getAttribute( 'id' ) == 'object-explorer' ){

                    break;

                }

                if( ( highlightedLi.nodeName ).toLowerCase() !== 'div' ){

                    highlightedLi = highlightedLi.parentNode;
                    continue;

                }

                var containerChildren = highlightedLi.childNodes;
                var len = containerChildren.length;
                for( var i = 0; i < len; i++  ){

                    if( ( containerChildren[ i ].nodeName ).toLowerCase() == 'button' ){

                        if( containerChildren[ i ].getAttribute( 'aria-expanded' ) == 'false' ){

                            containerChildren[ i ].click();

                        }

                    }

                }
                highlightedLi = highlightedLi.parentNode;

            }

            //var topPos = currentListItem.offsetTop;
            //document.getElementById( 'object-explorer' ).scrollTop = topPos;

        }
        //Modified to expand the list to the highlighted item end

    },

    /**
     * refreshList( object ) - Refresh the list by removing old list items and generating the new one
     * @param {any} object - The object using which the new list should be created( Must be instance of an Object3D )
     * @returns {Void}
     * @author Hari
     */
    refreshList : function( object ){
        
        var scope = this;
        var curList = scope.listPanel.firstChild;
        scope.listPanel.removeChild( curList );
        
        //Cam list start
        while ( scope.camUl.firstChild ) {
            scope.camUl.removeChild( scope.camUl.firstChild );
        }
        while ( scope.sensorsUl.firstChild ) {
            scope.sensorsUl.removeChild( scope.sensorsUl.firstChild );
        }
        //Cam list end

        //Camera reference point start
        while ( scope.camRefPointUl.firstChild ) {
            scope.camRefPointUl.removeChild( scope.camRefPointUl.firstChild );
        }
        //Camera reference point end

        //Network cable  start
        while ( scope.cablingListUl.firstChild ) {
            scope.cablingListUl.removeChild( scope.cablingListUl.firstChild );
        }
        //Network cable  end

        //2D List start
        while ( scope.twoDDrawingListUl.firstChild ) {
            scope.twoDDrawingListUl.removeChild( scope.twoDDrawingListUl.firstChild );
        }
        //2D List end

        //Junction Box Start
        while (scope.junctionBoxListUl.firstChild) {
            scope.junctionBoxListUl.removeChild(scope.junctionBoxListUl.firstChild);
        }
        //Junction Box End

        //Smart Sensor Start
        while (scope.smartSensorUl.firstChild) {
            scope.smartSensorUl.removeChild(scope.smartSensorUl.firstChild);
        }
        //Smart Sensor End

        //Person List Start
        while (scope.personListUl.firstChild) {
            scope.personListUl.removeChild(scope.personListUl.firstChild);
        }
        //Person List End

        //Luggage List Start
        while (scope.luggageListUl.firstChild) {
            scope.luggageListUl.removeChild(scope.luggageListUl.firstChild);
        }
        //Luggage List End

        //Point of Interest Start
        while (scope.pointOfInterestListUl.firstChild) {
            scope.pointOfInterestListUl.removeChild(scope.pointOfInterestListUl.firstChild);
        }
        //Point of Interest End

        /**************************************************************/
        scope.objectsToTrack = [];
        /**************************************************************/

        scope.listPanel.appendChild( scope.genListRecursive( object ) );

    },

    /**
     * scrollToItem( object ) - Scrolls the list to the selected item
     * @param {any} object - The item to show on top of the list
     * @returns {Void}
     * @author Hari
     */
    scrollToItem : function( object ){

        var scope = this;
        if( object ){
            
            var targetLi = document.getElementById( object.uuid + '-li' );
            var explr = document.getElementById( 'object-explorer' );
            if( targetLi === null || explr === null || this.isWithinElement( targetLi, explr ) ){
                
                return;

            }
            /*if( targetLi !== null ){

                var targetLiOffset = targetLi.offsetTop - explr.offsetTop;
                explr.scrollTop = targetLiOffset;

            }*/
            else{

                var targetRect = targetLi.getBoundingClientRect();
                var explrRect = explr.getBoundingClientRect();
                explr.scrollTop += ( targetRect.top - explrRect.top ) - 85;

            }

        }

    },

    /** 
     * isWithinElement( target, container ) - To check whether the target node is within the container or not
     * @param {any} target - The target node
     * @param {any} container - The container node
     * @returns {Boolean} - Returns true if the target is within the container, else returns false
     * @author Hari
     */
    isWithinElement : function( target, container ){
	
        var targetClientRect = target.getBoundingClientRect();
        var containerClientRect = container.getBoundingClientRect();
        if( ( targetClientRect.top > containerClientRect.top ) && ( targetClientRect.bottom < containerClientRect.bottom ) ){

            return true;
            
        }
        else{

            return false;
            
        }
        
    }

}

ObjectExplorer.prototype.constructor = ObjectExplorer;