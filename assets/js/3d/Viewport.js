/**
 * @author mrdoob / http://mrdoob.com/
 */
var Viewport = function(editor) {

    /*MODIFIED TO INCLUDE MEASUREMENT START*/
    var line;
    var distance, pointSelected = 0,
        start, end, markerStart, markerEnd, geometry, material, sphere;
    var sceneImage;
    /*MODIFIED TO INCLUDE MEASUREMENT END*/
    var timeOut;
    this.imageTrace = new ImageTracer();
    var scope = this;
    var signals = editor.signals;
    var cameraGeneratingPointArrayLength = 5;
    var container = new UI.Panel();
    container.setId('viewport');
    container.setPosition('absolute');
    var objectData = "";
    var firstObjectUUid = null;
    var secondObjectUUid = null;
    var cameralookPointFlag = 0;
    var mouseGenCamera = {
        x: 0,
        y: 0
    };
    container.add(new Viewport.Info(editor));
    var currentPostioncameraDoubleClick;
    var cameraGeneratingCount = 0;
    var cameraGeneratingMouse = new THREE.Vector3();
    var camToEditor = new AddCameraToEditor(editor);
    var PointofIntrestObject = new PointOfIntrest(editor);
    var perviousPointOfIntrestObject;
    var PointOfIntrestTimeOut;
    editor.pointOfinterestObject = PointofIntrestObject;
    //var referenceLineArray = [];

    //Modified for edit measurement start
    var selectedMeasurementLine = null;
    var selectedAreaMeasurementLine = null;
    //Modified for edit measurement end

    //For aligning table to left
    var TableLeftShift = 200;

    //CommonControls
    this.commonControls = new CommonControls( { camera : editor.camera, baseUnit : "meter", baseConversionFactor : 1 }, editor );

    this.editor = editor; 
    //Perspective camera for clonning
    this.addClonecCam = new AddCameraToEditor( editor );
    this.rePositionCursor;
    var scope = this;
    //var that = this; //Commented here

    //Creating Modal for selecting a camera to place at the zoomed and right clicked position

    var camModal = createCameraModal();
    var positionWindow = createPositionWindow();
    
    var brandDetailsModalShown = false; 
    // cameraGenerating add point
    function cameraGeneratingaddPoint(event) {

        editor.targetLocked = !editor.targetLocked;
        if (editor.targetLocked) {

            editor.scene.remove(editor.cameraGenerateLine.line);

        } else {

            editor.cameraGenerateLine = new LineMaker({
                style: 'dashed',
                color: '#ffff00'
            });
            editor.cameraGenerateLine.setEndPoints(currentPostioncameraDoubleClick, currentPostioncameraDoubleClick);
            editor.scene.add(editor.cameraGenerateLine.line);
            editor.cameraGenerateLine.computeLineDistances();
            editor.signals.sceneGraphChanged.dispatch();
        }

    }

    editor.signals.changeLengthMeasurementHeight.add( function( object ){

        findAndProcessMsrmtEndPoints( object );

    } );

            //Modified to update measurement line start
            function findAndProcessMsrmtEndPoints( object ){

                try {
                                    
                    if(object instanceof THREE.Mesh && object.name =='StartMeasurementMarker'){
                        
                        if( object.parent && object.parent.name === "MeasurementConnectionLine" ){
    
                            var lineStartPoint = new THREE.Vector3( (object.parent.geometry.attributes.position.array[0]).toFixed(2), (object.parent.geometry.attributes.position.array[1]).toFixed(2), (object.parent.geometry.attributes.position.array[2]).toFixed(2) );
                            
    
                            var objectRoundedPosition = new THREE.Vector3((object.position.x).toFixed(2),(object.position.y).toFixed(2),(object.position.z).toFixed(2));
                            
    
                            if( !lineStartPoint.equals(objectRoundedPosition) ){
                                
                                object.parent.geometry.attributes.position.array[0] = object.position.x;
                                object.parent.geometry.attributes.position.array[1] = object.position.y;
                                object.parent.geometry.attributes.position.array[2] = object.position.z;
                            
                                updateLineComponents(object.parent);
                            }
    
                        }
                        
                    }
                    else if(object instanceof THREE.Mesh && object.name =='EndMeasurementMarker'){
                        
                        if( object.parent && object.parent.name === "MeasurementConnectionLine" ){
    
                            var lineEndPoint = new THREE.Vector3( (object.parent.geometry.attributes.position.array[3]).toFixed(2), (object.parent.geometry.attributes.position.array[4]).toFixed(2), (object.parent.geometry.attributes.position.array[5]).toFixed(2) );
                        
    
                            var objectRoundedPosition = new THREE.Vector3((object.position.x).toFixed(2),(object.position.y).toFixed(2),(object.position.z).toFixed(2));
    
                            if( !lineEndPoint.equals(objectRoundedPosition) ){
                                
                                object.parent.geometry.attributes.position.array[3] = object.position.x;
                                object.parent.geometry.attributes.position.array[4] = object.position.y;
                                object.parent.geometry.attributes.position.array[5] = object.position.z;
                            
                            updateLineComponents(object.parent);
                            }
    
                        }
    
                    }
                    else if( object instanceof THREE.Mesh && (/^(AreaMeasureMarker[1-4])/g).test(object.name) ){
    
                        var polygon = object.parent;
                        if( polygon && polygon.name === "AreaSelectionRectangle" ){
    
                            var markerId;
                            switch(object.name) {
                                case "AreaMeasureMarker1":
                                    markerId = 1;
                                    break;
                                case "AreaMeasureMarker2":
                                    markerId = 2;
                                    break;
                                case "AreaMeasureMarker3":
                                    markerId = 3;
                                    break;
                                case "AreaMeasureMarker4":
                                    markerId = 4;
                                    break;
                            }
                            
                            var linePoint = new THREE.Vector3( (polygon.geometry.attributes.position.array[((3*markerId)-3)]).toFixed(2), (polygon.geometry.attributes.position.array[((3*markerId)-2)]).toFixed(2), (polygon.geometry.attributes.position.array[((3*markerId)-1)]).toFixed(2) );
    
                            var objectRoundedPosition = new THREE.Vector3((object.position.x).toFixed(2),(object.position.y).toFixed(2),(object.position.z).toFixed(2));
    
                            if( !linePoint.equals(objectRoundedPosition) ){
    
                                polygon.geometry.attributes.position.array[((3*markerId)-3)] = object.position.x;
                                polygon.geometry.attributes.position.array[((3*markerId)-2)] = object.position.y;
                                polygon.geometry.attributes.position.array[((3*markerId)-1)] = object.position.z;
                                if( markerId == 1 ){
                                    polygon.geometry.attributes.position.array[((3*5)-3)] = object.position.x;
                                    polygon.geometry.attributes.position.array[((3*5)-2)] = object.position.y;
                                    polygon.geometry.attributes.position.array[((3*5)-1)] = object.position.z;
                                }
                                polygon.geometry.attributes.position.needsUpdate = true;
                                
                                var areaSelectionShade = polygon.getObjectByName( "AreaSelectionShade" );
                                
                                if( markerId == 1 ){
                                    areaSelectionShade.geometry.vertices[4].x = polygon.geometry.attributes.position.array[((3*5)-3)];
                                    areaSelectionShade.geometry.vertices[4].y = polygon.geometry.attributes.position.array[((3*5)-2)];
                                    areaSelectionShade.geometry.vertices[4].z = polygon.geometry.attributes.position.array[((3*5)-1)];
                                }
    
                                areaSelectionShade.geometry.vertices[(markerId-1)].x = polygon.geometry.attributes.position.array[((3*markerId)-3)];
                                areaSelectionShade.geometry.vertices[(markerId-1)].y = polygon.geometry.attributes.position.array[((3*markerId)-2)];
                                areaSelectionShade.geometry.vertices[(markerId-1)].z = polygon.geometry.attributes.position.array[((3*markerId)-1)];
    
                                areaSelectionShade.geometry.verticesNeedsUpdate = true;
                                areaSelectionShade.geometry.elementsNeedUpdate = true;
    
                                updatePolygonComponents( polygon );
                                                        
                                //editor.signals.sceneGraphChanged.dispatch();
                                
                            }
                        }
                    }
    
                }
                catch( exception ){
    
                    console.warn( exception );
    
                }
    
            }

            //update scene userData with current measurement value
            function updateAreaLengthMeasurementSceneUserData( objectPositionOnDown,object ){
                if( ( object.name == 'StartMeasurementMarker' || object.name == 'EndMeasurementMarker' ) && object.parent.name === "MeasurementConnectionLine" ){

                       var lineStartPosition = new THREE.Vector3(  
                           object.parent.geometry.attributes.position.array[0],
                           object.parent.geometry.attributes.position.array[1],
                           object.parent.geometry.attributes.position.array[2]
                       );

                       var lineEndPosition = new THREE.Vector3( 
                           object.parent.geometry.attributes.position.array[3],
                           object.parent.geometry.attributes.position.array[4],
                           object.parent.geometry.attributes.position.array[5]
                       );

                       var distance = editor.lengthMeasurement.measurementControls.getDistance( lineStartPosition, lineEndPosition );

                       distance = distance.toFixed(1);

                       //Modified start
                       var startMarker = object.parent.getObjectByProperty( 'name','StartMeasurementMarker' );
                       elevation = ( startMarker.position.y * editor.lengthMeasurement.measurementControls.targetConversionFactor).toFixed(1);
                       //Modified end
                       var badgeText = distance + ( ( editor.lengthMeasurement.measurementControls.targetUnit == "feet" ) ? "ft" : "m" );
                       
                       var objectRoundedPosition = new THREE.Vector3((object.position.x).toFixed(2),(object.position.y).toFixed(2),(object.position.z).toFixed(2));

                       var objectPositionOnDownRnded = objectPositionOnDown.clone();
                       objectPositionOnDownRnded.x = ( objectPositionOnDownRnded.x ).toFixed(2);
                       objectPositionOnDownRnded.y = ( objectPositionOnDownRnded.y ).toFixed(2);
                       objectPositionOnDownRnded.z = ( objectPositionOnDownRnded.z ).toFixed(2);

                       editor.signals.measurementEdited.dispatch( object.parent, { start: lineStartPosition, end : lineEndPosition, badgeLabel :  badgeText, measurement : distance, unit : editor.lengthMeasurement.measurementControls.targetUnit, elevation : elevation, updateTable : true } );                      

                   }
                   else if( (/^(AreaMeasureMarker[1-4])/g).test(object.name) && object.parent.name === "AreaSelectionRectangle" ){

                       var polygon = object.parent;

                       var vertexArray = editor.float32ToVerticesArray ( polygon.geometry.attributes.position.array );
                       var area = editor.areaMeasurement.measurementControls.getQuadPointsArea( vertexArray ).toFixed(1);

                       var badgeText = area + ( ( editor.areaMeasurement.measurementControls.targetUnit == "feet" ) ? " sqft" : " sqm" );
                       
                       var objectPositionOnDownRnded = objectPositionOnDown.clone();
                       objectPositionOnDownRnded.x = ( objectPositionOnDownRnded.x ).toFixed(2);
                       objectPositionOnDownRnded.y = ( objectPositionOnDownRnded.y ).toFixed(2);
                       objectPositionOnDownRnded.z = ( objectPositionOnDownRnded.z ).toFixed(2);

                       var objectRoundedPosition = new THREE.Vector3((object.position.x).toFixed(2),(object.position.y).toFixed(2),(object.position.z).toFixed(2));
                       
                       editor.signals.areaMeasurementEdited.dispatch( polygon, { badgeLabel :  badgeText, area : area, unit : ( ( editor.areaMeasurement.measurementControls.targetUnit == "feet" ) ? " square foot" : " square meter" ), updateTable : true } );                       

                   }                 

                   editor.execute(new SetPositionCommand(object, object.position, objectPositionOnDown));
               
            }

            function updateLineComponents( object ){

                var x1 = object.geometry.attributes.position.array[0];
                var y1 = object.geometry.attributes.position.array[1];
                var z1 = object.geometry.attributes.position.array[2];
                var x2 = object.geometry.attributes.position.array[3];
                var y2 = object.geometry.attributes.position.array[4];
                var z2 = object.geometry.attributes.position.array[5];
    
                var distance = editor.lengthMeasurement.measurementControls.getDistance( new THREE.Vector3( x1, y1, z1 ), new THREE.Vector3( x2, y2, z2 ) );
    
                var lineMidpoint = new THREE.Vector3((x1+x2)/2,(y1+y2)/2,(z1+z2)/2);
    
                distance = distance.toFixed(1);
    
                var badgeText = distance + ( ( editor.lengthMeasurement.measurementControls.targetUnit == "feet" ) ? "ft" : "m" );
                
                var badgeTexture = editor.lengthMeasurement.measurementControls.getNumberBadge( { "badgeText" : badgeText, "badgeWidth" : 55, "badgeHeight" : 55, "fontSize" : "16px", "fontColor" : "#0f590b", "strokeColor" : "#0f590b", "borderRadius" : 8, "type" : "image" } );
    
                object.traverse(function(child){
                    if( child instanceof THREE.Sprite && child.name == "MeasureValueBadge" ){
                        
                        child.material.map = badgeTexture;
                        child.position.copy( lineMidpoint );
    
                        /*editor.signals.measurementEdited.dispatch( object, { start: new THREE.Vector3( x1, y1, z1 ), end : new THREE.Vector3( x2, y2, z2 ), badgeLabel :  badgeText, measurement : distance, unit : editor.lengthMeasurement.measurementControls.targetUnit, updateTable : true } );*/
                        object.matrixAutoUpdate = false;
                        
                    }
    
                });
                object.geometry.attributes.position.needsUpdate = true;
                editor.signals.sceneGraphChanged.dispatch();
                
                
            }

            
        //Modified to update measurement line end
        function updatePolygonComponents( polygon ){

            var vertexArray = editor.float32ToVerticesArray ( polygon.geometry.attributes.position.array );
            var area = editor.areaMeasurement.measurementControls.getQuadPointsArea( vertexArray ).toFixed(1);            

            var badgeText = area + ( ( editor.areaMeasurement.measurementControls.targetUnit == "feet" ) ? " sqft" : " sqm" );

            var badgeTexture = editor.areaMeasurement.measurementControls.getNumberBadge( { badgeText : badgeText, badgeWidth : 105, badgeHeight : 35, fontSize : "16px", fontColor : "#0f590b", strokeColor : "#0f590b", borderRadius : 8, type : "image" } );

            var midPoint =  new THREE.Vector3( ( vertexArray[ 0 ].x + vertexArray[ 2 ].x ) / 2, ( vertexArray[ 0 ].y + vertexArray[ 2 ].y ) / 2, ( vertexArray[ 0 ].z + vertexArray[ 2 ].z ) / 2 );

            polygon.traverse(function(child){
                if( child instanceof THREE.Sprite && child.name == "AreaMeasureValueBadge" ){
                    
                    child.material.map = badgeTexture;
                    child.position.copy( midPoint );


                    polygon.matrixAutoUpdate = false;
                    
                }
            });            

        }


    function cameraRefernceaddPoint(){

        editor.generateReferenceLine = new LineMaker( { style : 'dashed', color : '#ffff00' } );
        editor.generateReferenceLine.setEndPoints( editor.currentRefernceCamera.position, editor.currentRefernceCamera.position );
        editor.referenceLineArray.push( editor.generateReferenceLine.line );
        editor.scene.add(editor.generateReferenceLine.line);
        editor.generateReferenceLine.computeLineDistances();
        editor.signals.sceneGraphChanged.dispatch();
    }

    var renderer = null;

    var camera = editor.camera;
    var scene = editor.scene;
    var sceneHelpers = editor.sceneHelpers;

    var objects = [];

    var vrEffect, vrControls;

    if (WEBVR.isAvailable() === true) {

        var vrCamera = new THREE.PerspectiveCamera();
        vrCamera.projectionMatrix = camera.projectionMatrix;
        camera.add(vrCamera);

    }

    // helpers

    var grid = new THREE.GridHelper(60, 196);
    sceneHelpers.add(grid);

    //Modified to change grid as per user selection start
    editor.signals.gridParametersChanged.add( function( newSize, newDivisions, gridScale ){

        sceneHelpers.remove(grid);
        grid = new THREE.GridHelper(newSize, newDivisions, 0xc92a2a, 0x888888);
        sceneHelpers.add(grid);

        if( editor.isGridShowing === false ){

            grid.visible = false;

        }

        if( editor.scene.userData.gridParameters === undefined ){

			editor.scene.userData.gridParameters = {};

		}
		editor.scene.userData.gridParameters.gridSize = newSize;
        editor.scene.userData.gridParameters.gridDivision = newDivisions;
        editor.scene.userData.gridParameters.gridScale = gridScale;

        editor.signals.sceneGraphChanged.dispatch();

    } );

    //Modified to change grid as per user selection end

    //

    var box = new THREE.Box3();

    var selectionBox = new THREE.BoxHelper();
    selectionBox.material.depthTest = false;
    selectionBox.material.transparent = true;
    selectionBox.visible = false;
    sceneHelpers.add(selectionBox);

    var objectPositionOnDown = null;
    var objectPositionOnMouseDown = null;
    var objectRotationOnDown = null;
    var objectScaleOnDown = null;

    //Modified for orthographic top-view start
    //var transformControls = new THREE.TransformControls(camera, container.dom);
    /*var transformControls = new THREE.TransformControls( editor.camera, container.dom );
    transformControls.addEventListener('change', function() {

        var object = transformControls.object;

        //MODIFIED TO AVOID BOX HELPER FOR CAMERA START
        //if (object !== undefined) {
        if (object !== undefined && object.type != 'PerspectiveCamera') {

            selectionBox.setFromObject(object);

            if (editor.helpers[object.id] !== undefined) {

                editor.helpers[object.id].update();

            }

            signals.refreshSidebarObject3D.dispatch(object);

        }
        //MODIFIED TO AVOID BOX HELPER FOR CAMERA END

        render();

    });
    transformControls.addEventListener('mouseDown', function() {

        var object = transformControls.object;

        objectPositionOnDown = object.position.clone();
        objectRotationOnDown = object.rotation.clone();
        objectScaleOnDown = object.scale.clone();

        controls.enabled = false;

    });
    transformControls.addEventListener('mouseUp', function() {

        var object = transformControls.object;

        if (object !== undefined) {

            switch (transformControls.getMode()) {

                case 'translate':

                    if (!objectPositionOnDown.equals(object.position)) {

                        editor.execute(new SetPositionCommand(object, object.position, objectPositionOnDown));

                    }

                    break;

                case 'rotate':

                    if (!objectRotationOnDown.equals(object.rotation)) {

                        editor.execute(new SetRotationCommand(object, object.rotation, objectRotationOnDown));

                    }

                    break;

                case 'scale':

                    if (!objectScaleOnDown.equals(object.scale)) {

                        editor.execute(new SetScaleCommand(object, object.scale, objectScaleOnDown));

                    }

                    break;

            }

        }

        controls.enabled = true;

    });

    sceneHelpers.add(transformControls);*/

    var transformControls;

    function configureTransformControls(camera, dom) {

        if (transformControls) {

            try {

                sceneHelpers.remove(transformControls);
                transformControls.dispose();

            } catch (exception) {

                console.warn(exception);

            }

        }
        transformControls = new THREE.TransformControls(camera, dom);

        signals.resizeTransformControls.add( function(view){

            if( view === 'floorPlanView' ){
    
                transformControls.setSize( 0.25 );
    
            }
    
        } );

        transformControls.addEventListener('change', function( event ) {

            var object = transformControls.object;

            //MODIFIED TO AVOID BOX HELPER FOR CAMERA START
            //if (object !== undefined) {
            if (object !== undefined && object.type != 'PerspectiveCamera') {

                selectionBox.setFromObject(object);

                if (editor.helpers[object.id] !== undefined) {

                    editor.helpers[object.id].update();

                }

                signals.refreshSidebarObject3D.dispatch(object);

                findAndProcessMsrmtEndPoints(object); //Modified to update measurement line

            }

            if( ( object instanceof THREE.Sprite ) && ( object.userData.lineUUID ) && ( object.userData.checkLOSFlag ) && ( object.userData.checkDetailsFlag ) ) {

                editor.signals.updateReferenceLineOfSight.dispatch( object );
                //Modified here Pivot
                /*
                var refPointPosition = object.position.clone();
                var referencePoint = object;
                var lineUUID = object.userData.lineUUID;
                var camUUID = object.camerauuid;
                var refCam = editor.scene.getObjectByProperty( 'uuid', camUUID );
                var refLine = editor.scene.getObjectByProperty( 'uuid', lineUUID );           
                var camPosition = refCam.position.clone();
                var Distance = ( ( refPointPosition.distanceTo( camPosition ) ) * editor.commonMeasurements.targetConversionFactor ).toFixed(1);

                //Modified to include reference point position in camera userdata start
                refCam.userData.reference = refPointPosition;
                //Modified to include referencepoint position in camera userdata end

                //Modified to include absolute height and absolute distance start
                var absHeight = Math.abs((( camPosition.y - object.position.y )* editor.commonMeasurements.targetConversionFactor ).toFixed(1));
                var absDistance = Math.abs((( camPosition.x - object.position.x )* editor.commonMeasurements.targetConversionFactor ).toFixed(1));
                //Modified to include absolute height and absolute distance end

                refCam.userData.absHeight = absHeight;
                refCam.userData.absDistance = absDistance;

                var badgeLabelText;
                if( editor.commonMeasurements.targetUnit === "meter" ) {

                    badgeLabelText = Distance + " m";
                    absHeight = absHeight + " m";
                    absDistance = absDistance + " m";

                }
                else if(  editor.commonMeasurements.targetUnit === "feet"  ){

                    badgeLabelText = Distance + " ft";
                    absHeight = absHeight + " ft";
                    absDistance = absDistance + " ft";

                } 

                if( referencePoint.userData.checkLOSFlag === 'set' ){

                    var processedLine = processRefCamLineEndPoints( refLine, refPointPosition, camPosition, badgeLabelText );

                }

                var relPoint = new THREE.Vector3();
                relPoint.x = camPosition.x - refPointPosition.x;
                relPoint.y = camPosition.y - refPointPosition.y;
                relPoint.z = camPosition.z - refPointPosition.z;

                if( referencePoint.userData.checkDetailsFlag === 'set' ){

                    var data = {

                        dis: badgeLabelText,
                        changedPos: relPoint,
                        refuuid: referencePoint.uuid,
                        absoluteHeight: absHeight,
                        absoluteDistance: absDistance

                    }

                    editor.signals.refCamAttributesChanged.dispatch( data );

                }

                object.userData.refCamDistance = badgeLabelText;
                object.userData.absHeight = absHeight;
                object.userData.absDistance = absDistance;
                editor.signals.sceneGraphChanged.dispatch(); */

            }

            else if ( ( object instanceof THREE.PerspectiveCamera )  && ( object.userData.objectUuid != "notset" ) && ( object.userData.lineUUID ) ) {
                
                editor.signals.updateCameraLineOfSight.dispatch( object );
                //Commented here Pivot
                /*
                var camPosition = object.position.clone();
                lineUUID = object.userData.lineUUID;
                refUUID = object.userData.refUUID;
                refPoint = editor.scene.getObjectByProperty( 'uuid', refUUID );
                refLine = editor.scene.getObjectByProperty( 'uuid', lineUUID );
                var refPosition = refPoint.position.clone();                            
                var badgeLabelText;
                var Distance =( ( refPosition.distanceTo( camPosition ) )* editor.commonMeasurements.targetConversionFactor ).toFixed(1);

                //Modified to include absolute height and absolute distance start
                var absHeight = Math.abs((( camPosition.y - refPosition.y )* editor.commonMeasurements.targetConversionFactor ).toFixed(1));
                var absDistance = Math.abs((( camPosition.x - refPosition.x )* editor.commonMeasurements.targetConversionFactor ).toFixed(1));
                //Modified to include absolute height and absolute distance end
                object.userData.absHeight = absHeight;
                object.userData.absDistance = absDistance;

                if( editor.commonMeasurements.targetUnit === "meter" ) {

                    badgeLabelText = Distance + " m";
                    absHeight = absHeight + " m";
                    absDistance = absDistance + " m";

                }
                else if(  editor.commonMeasurements.targetUnit === "feet"  ){
                    
                    badgeLabelText = Distance + " ft";
                    absHeight = absHeight + " ft";
                    absDistance = absDistance + " ft";

                } 

                if( refPoint.userData.checkLOSFlag === "set" ){

                    var processedLine = processRefCamLineEndPoints( refLine, refPosition, camPosition, badgeLabelText );

                }

                var relPoint = new THREE.Vector3();
                relPoint.x = camPosition.x - refPosition.x;
                relPoint.y = camPosition.y - refPosition.y;
                relPoint.z = camPosition.z - refPosition.z;

                if( refPoint.userData.checkDetailsFlag === 'set' ){

                    var data = {

                        dis: badgeLabelText,
                        changedPos: relPoint,
                        refuuid: refPoint.uuid,
                        absoluteHeight: absHeight,
                        absoluteDistance: absDistance

                    }

                    editor.signals.refCamAttributesChanged.dispatch( data );

                }

                refPoint.userData.refCamDistance = badgeLabelText;
                refPoint.userData.absHeight = absHeight;
                refPoint.userData.absDistance = absDistance;
                editor.signals.sceneGraphChanged.dispatch(); */

            } 

            //MODIFIED TO AVOID BOX HELPER FOR CAMERA END

            if( objectPositionOnMouseDown && !object.position.equals( objectPositionOnMouseDown ) ){

                if( object instanceof THREE.Mesh && ( /^NetworkMarker(\d+)/g ).test( object.name ) ){

                    /*var matches = object.name.match( /(\d+)/g );
                    var index = Number( matches[ 0 ] );
                    var cable = object.parent;
                    var startPoint = 2 * ( ( index * 3 ) - 3 );

                    if( cable.name === "NetworkingCable" ){

                        cable.geometry.attributes.position.array[ startPoint ] = object.position.x;
                        cable.geometry.attributes.position.array[ startPoint + 1 ] = object.position.y;
                        cable.geometry.attributes.position.array[ startPoint + 2 ] = object.position.z;
                        cable.geometry.attributes.position.array[ startPoint + 3 ] = object.position.x;
                        cable.geometry.attributes.position.array[ startPoint + 4 ] = object.position.y;
                        cable.geometry.attributes.position.array[ startPoint + 5 ] = object.position.z;

                        cable.geometry.attributes.position.needsUpdate = true;

                    }*/

                    editor.networking.moveCableVertexByMarkerPosition( object );

                }

            }

            //MODIFIED TO EDIT TWOD LINES
            if( object instanceof THREE.Mesh && ( /^TwoDMeasureMarker(\d+)/g ).test( object.name ) ) {

                editor.twodmeasurement.twoDMeasurementControls.moveDrawingsByMarkerPosition( object, object.parent );

            }

            render();

        });

        transformControls.addEventListener('mouseDown', function() {

            var object = transformControls.object;

            objectPositionOnDown = object.position.clone();
            objectPositionOnMouseDown = object.position.clone();
            objectRotationOnDown = object.rotation.clone();
            objectScaleOnDown = object.scale.clone();

            controls.enabled = false;

        });
        transformControls.addEventListener('mouseUp', function() {

            var object = transformControls.object;
            objectPositionOnMouseDown = null;

            if (object !== undefined) {

                switch (transformControls.getMode()) {

                    case 'translate':

                        if (!objectPositionOnDown.equals(object.position)) {

                        updateAreaLengthMeasurementSceneUserData( objectPositionOnDown,object );
                     }

                        break;

                    case 'rotate':

                        if (!objectRotationOnDown.equals(object.rotation)) {

                            editor.execute(new SetRotationCommand(object, object.rotation, objectRotationOnDown));

                        }

                        break;

                    case 'scale':

                        if (!objectScaleOnDown.equals(object.scale)) {

                            editor.execute(new SetScaleCommand(object, object.scale, objectScaleOnDown));

                        }

                        break;

                }

            }

            controls.enabled = true;

        });



        sceneHelpers.add(transformControls);

    }
    configureTransformControls(camera, container.dom);
    //Modified for orthographic top-view end

    // object picking

    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();

    // events

    function getIntersects(point, objects) {

        mouse.set((point.x * 2) - 1, -(point.y * 2) + 1);

        raycaster.setFromCamera(mouse, camera);

        return raycaster.intersectObjects(objects, true); //Modified to add a more accurate mouse picking

    }

    var onDownPosition = new THREE.Vector2();
    var onUpPosition = new THREE.Vector2();
    var onDoubleClickPosition = new THREE.Vector2();
    var onRightClickPosition = new THREE.Vector2();

    function getMousePosition(dom, x, y) {

        var rect = dom.getBoundingClientRect();
        return [(x - rect.left) / rect.width, (y - rect.top) / rect.height];

    }

    function handleClick() {

        if (onDownPosition.distanceTo(onUpPosition) === 0) {

            var intersects = getIntersects(onUpPosition, objects);

            if (intersects.length > 0) {

                var object = intersects[0].object;

                if (object === null) return;
                if( object.name == "JunctionBoxNumberBadge" &&  object instanceof THREE.Sprite ){
                    editor.select( object.parent );
                    return;
                }
                if( (/^JunctionBox[1-9]+[0-9]*/g).test(object.name) && object instanceof THREE.Mesh ){
                    editor.select( object );
                    return;
                }
                //Modified to select the measurement line when clicked upon the badge or on the line start
                if (object.name != undefined && object.name === "MeasurementConnectionLine" && object.parent.name === "MeasurementSession" && object.parent.visible === true) {

                    editor.select(object);
                    return;

                } else if (object.name != undefined && object.name === "MeasureValueBadge" && object.parent.parent.name === "MeasurementSession" && object.parent.parent.visible === true) {

                    editor.select(object.parent);
                    return;

                }
                //
                else if (object.name != undefined && object.name === "AreaSelectionRectangle" && object.parent.name === "AreaMeasurementSession" && object.parent.visible === true) {

                    editor.select(object);
                    return;

                } else if (object.name != undefined && object.name === "AreaSelectionShade" && object.parent.parent.name === "AreaMeasurementSession" && object.parent.parent.visible === true) {

                    editor.select(object.parent);
                    return;

                } else if (object.name != undefined && object.name === "AreaMeasureValueBadge" && object.parent.parent.name === "AreaMeasurementSession" && object.parent.parent.visible === true) {

                    editor.select(object.parent);
                    return;

                }
                else if (object.name != undefined && object.name === "NetworkingCable" && object.parent.name === "NetworkCablingSession" && object.parent.visible === true) {

                    editor.select(object.parent);
                    return;

                }
                else if (object.name != undefined && object.name === "NetworkCableLengthBadge" && object.parent.parent.name === "NetworkCablingSession" && object.parent.parent.visible === true) {

                    editor.select(object.parent);
                    return;

                }
                else if (object.name != undefined && object.name === "TwoDMeasurementSession" ) {

                    editor.select(object.parent);
                    return;

                } 
                else if ( object.name != undefined && object.name === "TwoDMeasurementBadge" && object.parent.parent.name  === "TwoDMeasurementSession" && object.parent.parent.visible === true ) {

                    editor.select(object.parent);
                    return;

                }
                else if( (/^(NetworkMarker[\d+])/g).test(object.name ) && ( editor.isCableEditingEnabled === true ) ){

                    editor.select( object );
                    return;
                }
                else if( (/^(RefPointCameraLOS[\d+])/g).test(object.name ) ){

                    if( object.userData.refPoint != null && object.userData.refPoint != undefined ){

                        var referencePoint = editor.scene.getObjectByProperty( 'uuid', object.userData.refPoint );
                        editor.select(referencePoint);

                    }
                    return;
                }
                else if( object.name != undefined && object.name === "RefCamLineValueBadge" ){

                    return;

                }
                else if( object.name === "NetworkStartMarkerIcon" || object.name === "NetworkEndMarkerIcon" ) {

                    if( editor.isCableEditingEnabled === true ) {

                        editor.select( object.parent );//Selecting the marker
                        return;

                    }
                    else {

                        editor.select( object.parent.parent );//Selecting the cable
                        return;

                    }

                }

                //
                //Modified to select the measurement line when clicked upon the badge or on the line end

                /* modified for Point of intrest */
                if (object.userData.pointData) {

                    editor.select(object)
                    return;

                }
                /* modified for Point of intrest */

                if( object.name == "picker" && object instanceof THREE.Mesh ){
                    object = object.userData.object;
                }
                
                /*MODIFIED TO SELECT THE COMPLETE OBJECT INSTEAD OF SUB MESH START*/
                while (!( object.parent instanceof(THREE.Scene) && ( object.parent.name == "Scene" ))) {
                    if( object.isLocked && object.isLocked == true )
                        break;
                    else if( object instanceof THREE.Group && object.userData && object.userData.sensorData )
                        break;
                    object = object.parent;

                }

                if (object instanceof(THREE.CameraHelper)) {

                    object = intersects[0].object
                    //return;

                }
                /*MODIFIED TO SELECT THE COMPLETE OBJECT INSTEAD OF SUB MESH END*/

                if (object.userData.object !== undefined) {

                    // helper

                    editor.select(object.userData.object);

                } else {

                    editor.select(object);

                }

            } else {

                editor.select(null);

            }

            render();

        }

    }

    //Modified to add popup windows for measurement label editing start
    var editLengthMeasurementPopup = new UI.SingleInputFieldPopup('edit-length-measure-popup');
    editLengthMeasurementPopup.setHeading(editor.languageData.EditMeasurement);
    editLengthMeasurementPopup.setInputFieldLabel('New measurement label :');
    editLengthMeasurementPopup.setFooterButtonsText('Save', 'Cancel');
    editLengthMeasurementPopup.dom.style.zIndex = "1001";
    document.getElementById('editorElement').appendChild(editLengthMeasurementPopup.dom);

    editLengthMeasurementPopup.successButton.addEventListener('click', function() {

        if (selectedMeasurementLine && selectedMeasurementLine.name === "MeasurementConnectionLine") {

            editor.signals.measurementEdited.dispatch(selectedMeasurementLine, {
                label: editLengthMeasurementPopup.input.value,
                updateTable: true
            });

        }

    });

    //{ measurementType : "", label : options.label, rowId : selectedRowId, lineUuid : changedMeasurementLine.uuid }
    editor.signals.measurementEditingCompleted.add(function(info) {

        if (info.measurementType === 'length') {

            editLengthMeasurementPopup.hide();

            //Modified for activity logging start
            try {

                //Modified for activity logging start
                var logDatas = {};
                logDatas[moment().format("YYYY-MM-DD HH:mm:ss")] = "User " + localStorage.getItem('firstname') + " " + localStorage.getItem('lastname') + " : Length measurement edited : " + info.label + "\n" + JSON.stringify( editor.scene.userData.measurementDatas[ info.lineUuid ] );
                logger.addLog(logDatas);
                logger.sendLogs(localStorage.getItem('U_ID'));
                //Modified for activity logging end

            } catch (exception) {

                console.log("Logging failed!");
                console.log(exception);

            }
            //Modified for activity logging end

        } else if (info.measurementType === 'area') {

            editAreaMeasurementPopup.hide();

            //Modified for activity logging start
            try {

                //Modified for activity logging start
                var logDatas = {};
                logDatas[moment().format("YYYY-MM-DD HH:mm:ss")] = "User " + localStorage.getItem('firstname') + " " + localStorage.getItem('lastname') + " : Area measurement edited : " + info.label + "\n" + JSON.stringify( editor.scene.userData.areaMeasurementDatas[ info.lineUuid ] );
                logger.addLog(logDatas);
                logger.sendLogs(localStorage.getItem('U_ID'));
                //Modified for activity logging end

            } catch (exception) {

                console.log("Logging failed!");
                console.log(exception);

            }
            //Modified for activity logging end

        }

    });

    //Signal to load and place badges on project load start
    
    editor.signals.projectDataLoaded.add( function(){

        var syncCameraRotation = new Promise( function( resolve,reject ){
            editor.scene.traverse( function( child ){

                if( ( child instanceof THREE.Sprite ) && ( child.userData.lineUUID ) && ( child.userData.checkLOSFlag === 'set' ) ){
    
                    var refDist = child.userData.refCamDistance;
                    var badgeTexture = editor.commonMeasurements.getNumberBadge( { badgeText : refDist, badgeWidth : 105, badgeHeight : 35, fontSize : "16px", fontColor : "#0f590b", strokeColor : "#0f590b", borderRadius : 8, type : "image" } );
    
                    var lineuid = child.userData.lineUUID;
                    var line = editor.scene.getObjectByProperty( 'uuid', lineuid );
    
                    line.traverse( function( subChild ){
    
                        if( subChild instanceof THREE.Sprite && subChild.name === "RefCamLineValueBadge" ){
    
                            subChild.material.map = badgeTexture;
                            editor.refCamBadge.push( subChild );
    
                        }
        
                    });
                    
                }
                
                if( ( child instanceof THREE.Sprite ) && ( child.userData.checkDetailsFlag === 'set' ) ){
    
                    createRefCamTable( child );
                
                }
                else if( ( child instanceof THREE.Sprite ) && ( child.userData.checkDetailsFlag === 'hidden' ) ){
    
                    child.userData.checkDetailsFlag = 'notset';
    
                }
    
            } ); 
            resolve();
        } );

        editor.deselect();

        //Modified to configure the measurement controls when project is opened start
		if( editor.scene.userData.measurementConfig != undefined ){

			editor.commonMeasurements.setBaseUnit( editor.scene.userData.measurementConfig.baseUnit, editor.scene.userData.measurementConfig.baseConversionFactor );
            editor.commonMeasurements.setTargetUnit( editor.scene.userData.measurementConfig.targetUnit );

		}
		else{
			
			toastr.warning( editor.languageData.Youhaventconfiguredthemeasurementcontrolsyetpleaseconfiguremeasurementsandremembertosaveit );

		}
        //Modified to configure the measurement controls when project is opened end

        if( editor.isFloorplanViewActive === true ){

            editor.orthographicScale();

        } else {

            editor.scaleAllIcons();

        }
        editor.signals.sceneGraphChanged.dispatch();
        
        syncCameraRotation.then( function(){
            editor.resetDomeCameras();
        } )
        // setTimeout( function() {
        //     editor.resetDomeCameras();
        // });
        

    } ); 

    //Signal to load and place badges on project load end

    editLengthMeasurementPopup.discardButton.addEventListener('click', function() {

        editLengthMeasurementPopup.hide();

    });

    var editAreaMeasurementPopup = new UI.SingleInputFieldPopup('edit-area-measure-popup');
    editAreaMeasurementPopup.setHeading(editor.languageData.EditMeasurement);
    editAreaMeasurementPopup.setInputFieldLabel('New measurement label :');
    editAreaMeasurementPopup.setFooterButtonsText('Save', 'Cancel');
    document.getElementById('editorElement').appendChild(editAreaMeasurementPopup.dom);

    editAreaMeasurementPopup.successButton.addEventListener('click', function() {

        if (selectedAreaMeasurementLine && selectedAreaMeasurementLine.name === "AreaSelectionRectangle") {

            editor.signals.areaMeasurementEdited.dispatch(selectedAreaMeasurementLine, {
                label: editAreaMeasurementPopup.input.value,
                updateTable: true
            });

        }

    });

    editAreaMeasurementPopup.discardButton.addEventListener('click', function() {

        editAreaMeasurementPopup.hide();

    });
    //Modified to add popup windows for measurement label editing end

    //MODIFIED FOR CONTEXT MENU START
    function showCustomContextMenu(selectedItem, event) {

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
        //basicContext.show(items);

    }

    function showScreensList(event) {

        event.preventDefault();

        if (Object.keys(simulationManager.screens).length == 0) return;

        function reAlignWindows(highlightedWindow) {

            for (var k in simulationManager.screens) {

                simulationManager.screens[k].sendToBack();

            }
            highlightedWindow.bringToFront();

        }

        var menuItems = [];

        for (var key in simulationManager.screens) {

            var targetScreen = simulationManager.screens[key];
            var subItem = {

                title: targetScreen.camera.name,
                icon: 'fa fa-window-restore',
                fn: reAlignWindows.bind(this, targetScreen)
            };
            menuItems.push(subItem);

        }

        basicContext.show(menuItems, event);

    }

    function contextmenuCoordinates(){

        var array = getMousePosition( container.dom, event.clientX, event.clientY );
        onRightClickPosition.fromArray(array);

        var intersects = getIntersects(onRightClickPosition, objects);
        if ( intersects.length ) {

            var intersect = intersects[0];        
            return intersect;
        }

    }

    function showCustomMenuForCurrentPosition(position, event) {

        event.preventDefault();

        editor.contextPosition = '';
        editor.contextPosition = position;
        var intersect = contextmenuCoordinates( event );
        showPositionWindow(intersect);

    }

    function showCustomContextMenuForPointOfIntrestEditOption(currentPointofIntrestObject, event) {


        event.preventDefault();
        var editPointofIntrest = function(currentPointofIntrestObject) {

            PointofIntrestObject.editPointofIntertData(currentPointofIntrestObject);

        }

        var deleteObject = function(object) {

            editor.execute(new RemoveObjectCommand(object));

        }

        var items = [

            {
                title: editor.languageData.Edit,
                icon: 'fa fa-pencil',
                fn: function() {
                    editPointofIntrest(currentPointofIntrestObject);
                }
            },
            {
                title: editor.languageData.Delete,
                icon: 'fa fa-times-circle',
                fn: function() {
                    deleteObject(currentPointofIntrestObject);
                }
            },
            {
                title: "Goto Url",
                icon: 'fa fa-link',
                fn: function() {
                    window.open( editor.selected.userData.pointData.Hyperlink , "_blank" )
                }
            }


        ];

        basicContext.show(items, event);

    }
    
    editor.signals.showLengthMsrCntxtMenu.add( function( objectItem, event ){
 
        event.preventDefault();

        var menuItems = [

            {

                title: "Rename",
                icon: 'fa fa-i-cursor',
                fn: function() {
                    
                    selectedMeasurementLine = objectItem;
                    editLengthMeasurementPopup.dom.style.left = event.clientX + "px";
                    editLengthMeasurementPopup.dom.style.top = Number(event.clientY) + 10 + "px";
                    editLengthMeasurementPopup.input.value = (editor.scene.userData.measurementDatas[objectItem.uuid]) ? editor.scene.userData.measurementDatas[objectItem.uuid].label : "";
                    editLengthMeasurementPopup.show();

                }

            },
            {

                title: "Delete",
                icon: 'fa fa-trash-o',
                fn: function() {

                    editor.execute(new RemoveObjectCommand(objectItem));

                }

            },
            {
                title: "Edit Start Marker",
                icon: 'fa fa-map-marker',
                fn: function() {

                    //objectItem.matrixAutoUpdate = true;
                    var lineChildrenLength = objectItem.children.length;
                    for (var i = 0; i < lineChildrenLength; i++) {

                        if (objectItem.children[i] instanceof THREE.Mesh && objectItem.children[i].name == 'StartMeasurementMarker') {

                            editor.select(objectItem.children[i]);
                        }
                    }
                }
            },
            {

                title: "Edit End Marker",
                icon: 'fa fa-map-marker',
                fn: function() {
                    //objectItem.matrixAutoUpdate = true;
                    var lineChildrenLength = objectItem.children.length;
                    for (var i = 0; i < lineChildrenLength; i++) {

                        if (objectItem.children[i] instanceof THREE.Mesh && objectItem.children[i].name == 'EndMeasurementMarker') {

                            editor.select(objectItem.children[i]);

                        }
                    }
                }

            },

        ];

        basicContext.show(menuItems, event);

    } );

    editor.signals.editTwoDDrawings.add( function(objectItem, lineNumber) {

        var markerName = 'TwoDMeasureMarker' + lineNumber;
        var editEndPoints = [

            {

                title: 'Edit Start Point',
                icon: 'fa fa-map-marker',
                fn: function() {

                    var lineChildrenLength = objectItem.children.length;
                    for (var i = 0; i < lineChildrenLength; i++) {

                        if (objectItem.children[i] instanceof THREE.Mesh && objectItem.children[i].name == markerName ) {

                            editor.select(objectItem.children[i]);

                        }
                    }

                }

            },
            {

                title: 'Edit End Point',
                icon: 'fa fa-map-marker',
                fn: function() {

                    var endMarkerName = 'TwoDMeasureMarker' + (Number(lineNumber) + 1);
                    var lineChildrenLength = objectItem.children.length;
                    for (var i = 0; i < lineChildrenLength; i++) {

                        if (objectItem.children[i] instanceof THREE.Mesh && objectItem.children[i].name == endMarkerName ) {

                            editor.select(objectItem.children[i]);
                            
                        }
                    }

                }

            },
            {

                /* Change position of the badge */

                title: 'Edit Badge Position',
                icon: 'fa fa-map-marker',
                fn: function() {
                   
                    objectItem.traverse( function( child ){

                        if( child instanceof THREE.Sprite && child.name === 'TwoDMeasurementBadge' ){

                            if( child.userData.lineNumber === Number(lineNumber) && child.userData.lineNumber != undefined && child.userData.lineNumber != null ) {
                                editor.select(child)
                            }

                        }
                    } );
                  

                }

            }

        ]
        basicContext.show(editEndPoints, event);

    } );

    function showAreaMsrCntxtMenu(selectedAreaLine, event) {

        event.preventDefault();

        var menuAreaItems = [

            {

                title: editor.languageData.Rename,
                icon: 'fa fa-i-cursor',
                fn: function() {

                    selectedAreaMeasurementLine = selectedAreaLine;
                    editAreaMeasurementPopup.dom.style.left = event.clientX + "px";
                    editAreaMeasurementPopup.dom.style.top = Number( event.clientY ) + 10 + "px";
                    editAreaMeasurementPopup.input.value = ( editor.scene.userData.areaMeasurementDatas[ selectedAreaLine.uuid ] )? editor.scene.userData.areaMeasurementDatas[ selectedAreaLine.uuid ].label : "";
                    editAreaMeasurementPopup.show();
                }

            },
            {

                title: editor.languageData.Delete,
                icon: 'fa fa-trash-o',
                fn: function() {

                    editor.execute(new RemoveObjectCommand(selectedAreaLine));

                }

            },
            {

                title: "Edit End Point 1",
                icon: 'fa fa-map-marker',
                fn: function() {

                    //selectedAreaLine.matrixAutoUpdate = true;
                    selectedAreaLine.traverse(function(child) {
                        if (child.name == "AreaMeasureMarker1") {
                            editor.select(child);
                        }
                    });

                }

            },
            {

                title: "Edit End Point 2",
                icon: 'fa fa-map-marker',
                fn: function() {
                    //selectedAreaLine.matrixAutoUpdate = true;
                    selectedAreaLine.traverse(function(child) {
                        if (child.name == "AreaMeasureMarker2") {
                            editor.select(child);
                        }
                    });

                }

            },
            {

                title: "Edit End Point 3",
                icon: 'fa fa-map-marker',
                fn: function() {
                    //selectedAreaLine.matrixAutoUpdate = true;
                    selectedAreaLine.traverse(function(child) {
                        if (child.name == "AreaMeasureMarker3") {
                            editor.select(child);
                        }
                    });

                }

            },
            {

                title: "Edit End Point 4",
                icon: 'fa fa-map-marker',
                fn: function() {
                    //selectedAreaLine.matrixAutoUpdate = true;
                    selectedAreaLine.traverse(function(child) {
                        if (child.name == "AreaMeasureMarker4") {
                            editor.select(child);
                        }
                    });

                }

            },

        ];

        basicContext.show(menuAreaItems, event);

    }

    function ShowRefPntCntxtmenu( selectedRefPoint, event ){

        event.preventDefault();

        var refPointItems = [

            {

                title: ( selectedRefPoint.userData.checkDetailsFlag === 'notset' ) ? editor.languageData.ShowDetails : ( selectedRefPoint.userData.checkDetailsFlag === 'set' ) ? editor.languageData.HideDetails : editor.languageData.ShowDetails,
                icon: 'fa fa-bars',
                fn: function() {

                    if( editor.selected != null && editor.selected instanceof THREE.Sprite ){

                        if( selectedRefPoint.userData.checkDetailsFlag === 'notset' ){

                            createRefCamTable( selectedRefPoint );
    
                        }

                        else if ( selectedRefPoint.userData.checkDetailsFlag === 'set' ){
    
                            detailsTable = document.querySelector( '#cam__ref__mobilewindow__' + selectedRefPoint.uuid );
                            detailsTable.style.display = 'none';
                            selectedRefPoint.userData.checkDetailsFlag = 'hidden';
    
                        }
    
                        else if ( selectedRefPoint.userData.checkDetailsFlag === 'hidden' ){
    
                            detailsTable = document.querySelector( '#cam__ref__mobilewindow__' + selectedRefPoint.uuid );
    
                            var changedDis = document.getElementById( selectedRefPoint.uuid + '__row__dis' );
                            var changedXPos = document.getElementById( selectedRefPoint.uuid + '__valueX' );
                            var changedYPos = document.getElementById( selectedRefPoint.uuid + '__valueY' );
                            var changedZPos = document.getElementById( selectedRefPoint.uuid + '__valueZ' );
                            var changedAbsHeight = document.getElementById( selectedRefPoint.uuid + '__row__abs__height' );
                            var changedAbsDistance = document.getElementById( selectedRefPoint.uuid + '__row__abs__distance' );
                            
    
                            var camUUID = selectedRefPoint.camerauuid;
                            var refPoint = selectedRefPoint.position.clone();
                            var camPos = editor.getObjectByUuid( camUUID );
                            camPos.then( function( value ){
    
                                var cameraPos = value.position.clone();
                                var newDis = ( refPoint.distanceTo( cameraPos ) * editor.commonMeasurements.targetConversionFactor ).toFixed(1);
                                var relPos = new THREE.Vector3();
                                relPos.x = refPoint.x - cameraPos.x;
                                relPos.y = refPoint.y - cameraPos.y;
                                relPos.z = refPoint.z - cameraPos.z;

                                //Modified to include absolute height and absolute distance start
                                var absHeight = Math.abs((( cameraPos.y - refPoint.y )* editor.commonMeasurements.targetConversionFactor ).toFixed(1));
                                var absDistance = Math.abs((( cameraPos.x - refPoint.x )* editor.commonMeasurements.targetConversionFactor ).toFixed(1));
                                //Modified to include absolute height and absolute distance end
    
                                if( editor.commonMeasurements.targetUnit === "meter" ){

                                    refDist = newDis + " m";
                                    absHeight = absHeight + " m";
                    		        absDistance = absDistance + " m";

                                } 
                                else if(  editor.commonMeasurements.targetUnit === "feet"  ){

                                    refDist = newDis + " ft";   
                                    absHeight = absHeight + " ft";
                    		        absDistance = absDistance + " ft";

                                } 
    
                                changedDis.innerHTML = refDist;
                                changedXPos.setAttribute( 'value', relPos.x.toFixed(1) );
                                changedYPos.setAttribute( 'value', relPos.y.toFixed(1) );
                                changedZPos.setAttribute( 'value', relPos.z.toFixed(1) );
                                changedAbsHeight.innerHTML = absHeight;
                                changedAbsDistance.innerHTML = absDistance;
    
                            } );
    
                            detailsTable.style.display = 'block';
                            selectedRefPoint.userData.checkDetailsFlag = 'set';                        
                        }

                    }
                    else{
    
                        toastr.error( editor.languageData.SomethingwentwrongPleasetryagain );

                    }

                }

            },

            {

                title: editor.languageData.UpdateCamera,
                icon: 'fa fa-bars',
                fn: function(){

                    if( editor.selected != null && editor.selected instanceof THREE.Sprite ){

                        var camUUID = selectedRefPoint.camerauuid;
                        var cam = editor.scene.getObjectByProperty( 'uuid', camUUID);
                        editor.select( cam );
                        var updateCamButton = document.querySelector('#update-camera-button');
                        updateCamButton.click();

                    }
                    else{

                        toastr.error( editor.languageData.SomethingwentwrongPleasetryagain );

                    }

                }

            },

            {

                title: ( selectedRefPoint.userData.checkLOSFlag === 'notset'? editor.languageData.ShowLine : editor.languageData.HideLine ), 
                icon: 'fa fa-bars',
                fn: function() {

                    if( editor.selected != null && editor.selected instanceof THREE.Sprite ){

                        if( selectedRefPoint.userData.checkLOSFlag === 'notset' ){

                            if( ( selectedRefPoint.userData.lineUUID ) ){
    
                                var refPoint = selectedRefPoint.position.clone();
                                var camUUID = selectedRefPoint.camerauuid;
                                var lineUID = selectedRefPoint.userData.lineUUID;
                                refCam = editor.scene.getObjectByProperty( 'uuid',camUUID );
                                refLine = editor.scene.getObjectByProperty( 'uuid', lineUID );
    
                                if( !refCam.visible ){
    
                                    toastr.error( editor.languageData.UnhidecameratodrawLineOfSight );
                                    return;
    
                                }
    
                                var camPosition = refCam.position.clone();   
                                var Distance = ( ( refPoint.distanceTo( camPosition ) ) * editor.commonMeasurements.targetConversionFactor ).toFixed(1);       
                                var badgeLabelText;
                                if( editor.commonMeasurements.targetUnit === "meter" ) badgeLabelText = Distance + " m";
                                else if(  editor.commonMeasurements.targetUnit === "feet"  ) badgeLabelText = Distance + " ft";    
                                var lineProcessed = processRefCamLineEndPoints( refLine, refPoint, camPosition, badgeLabelText );    
                                lineProcessed.visible = true;
                                selectedRefPoint.userData.checkLOSFlag = 'set';
                                editor.signals.sceneGraphChanged.dispatch();
                                selectedRefPoint.userData.refCamDistance = badgeLabelText;
    
                            }
        
                            else {
    
                                editor.signals.addReferencePointLine.dispatch( selectedRefPoint );
    
                            }
    
                        }
    
                        else{
    
                            var lineuid = selectedRefPoint.userData.lineUUID;
                            var LOS = editor.getObjectByUuid( lineuid );
                            LOS.then( function(value){
    
                            var line = value;
                            line.visible = false;                        
                            selectedRefPoint.userData.checkLOSFlag = 'notset';
                            editor.signals.sceneGraphChanged.dispatch();
    
                            } );
    
                        }

                    }
                    else{

                        toastr.error( editor.languageData.SomethingwentwrongPleasetryagain );

                    }

                }

            },

        ];

        basicContext.show(refPointItems, event);

    }
    
    function lockUnlockCamera(){
        var cam = editor.selected;
        var baseModel = '';
        baseModel = editor.setBaseModel();
        
        if( baseModel == '' ){
            toastr.warning( editor.languageData.BaseModelNotFound );
            return;
        }
        
        if( !cam.isLocked || cam.isLocked == false ){
            THREE.SceneUtils.attach( cam, editor.scene, baseModel );
            cam.isLocked = true;
            var selectedCamRefPointId = cam.userData.objectUuid;
            editor.getObjectByUuid( selectedCamRefPointId ).then( function( refPoint ){
                if( refPoint ){
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
                }
            } );
            toastr.success( editor.languageData.Locked );
        }
        else{
            var selectedCam = editor.selected;
            editor.scene.traverse( function( refPoint ){
                if( refPoint instanceof THREE.Sprite && (/^Cam Reference [1-9]+[0-9]*/g).test(refPoint.name) ) {
                    if( selectedCam.userData.objectUuid == refPoint.uuid ){
                        THREE.SceneUtils.detach( refPoint, baseModel, editor.scene );
                    }
                }
            } ); 
            THREE.SceneUtils.detach( selectedCam, baseModel, editor.scene );
            selectedCam.isLocked = false;
            toastr.success( editor.languageData.UnLocked );
            
        }
    } 

    function addRefPointOrCloneCamera( selectedCamera, event ){

        event.preventDefault();

        var addRefPointOrClone = [

            {

                title: editor.languageData.AddOrGoToReferencePoint,
                icon: 'fa fa-map-pin',
                fn: function(){

                    if( editor.selected != null && editor.selected instanceof THREE.PerspectiveCamera ){
                        if( editor.selected.isLocked  ){
                            toastr.warning( 'Unlock the cameras and retry' );
                            return;
                        }
                        else{
                            if( selectedCamera.userData.objectUuid == "notset" ){
                            
                                document.querySelector( '#refPointButton' ).click();
                                /*
                                var refUUID = selectedCamera.userData.objectUuid;
                                var refPt = editor.scene.getObjectByProperty( 'uuid', refUUID );
                                var camUUID = refPt.camerauuid
                            
                                toastr.info('<div>'+editor.languageData.Doyouneedtochangerefpointpos+ ' '   + selectedCamera.badgeText + '</div><div><button type="button"    id="ref-change-' + selectedCamera.uuid + '" class="btn btn-success"    style="margin-right:1px">' + editor.languageData.Yes + '</button><button   type="button" id="ref-pos-no-change" class="btn btn-danger"   style="margin-left:1px">'+ editor.languageData.No + '</button></div>');
                            
                                document.getElementById( 'ref-change-' + selectedCamera.uuid )  .addEventListener( 'click', function(){
                                    
                                    processRePositioningRefPt( camUUID );
                                
                                } ); */
                            
                            }
                            else{
                            
                                var rePointId = selectedCamera.userData.objectUuid;
                                var refPoint = editor.getObjectByUuid( rePointId  );
                                refPoint.then( function( value ) {
                                    
                                    editor.select( value );
                                    value.visible = true;
                                    editor.signals.sceneGraphChanged.dispatch();
                                
                                } );
                            
                            }
                    }

                    }
                    else{

                        toastr.error( editor.languageData.SomethingwentwrongPleasetryagain );

                    }

                }  

            },

            {

                title: editor.languageData.CloneCamera,
                icon: 'fa fa-camera',
                fn: function(){

                    if( editor.selected != null && editor.selected instanceof THREE.PerspectiveCamera ){

                        //cloneCamera( selectedCamera );
                        editor.signals.cloneCamera.dispatch( selectedCamera );

                    }
                    else{

                        toastr.error( editor.languageData.SomethingwentwrongPleasetryagain );

                    }

                } 

            },
            /*Nimil */
            {

                title: ( editor.selected.isLocked ? editor.languageData.UnlockCamera : editor.languageData.lockCamera ),
                icon:  ( editor.selected.isLocked ? "fa fa-unlock-alt" : "fa fa-lock" ),
                fn: function(){
                    lockUnlockCamera();
                }
            }

        ];

        basicContext.show(addRefPointOrClone, event);

    }

    function addCloneSensor( selectedSensor, event ){

        var addSensorClone = [
            {
                title: editor.languageData.CloneSensor,
                icon: 'fa fa-camera',
                fn: function(){

                    var sensorData = selectedSensor.userData.sensorData;
                    var addSmartSensor = new SelectSmartSensor( editor );
                    var point = selectedSensor.position.clone();
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
                    
                    var sensorFrustum = "Cylinder Frustum" ;
                    if( sensorData.frustum != undefined && sensorData.frustum != '' ){
                        sensorFrustum = sensorData.frustum;
                    }

                    var spec = {
                        sensorImageUrl : imageUrl, sensorCategory : sensorData.category, sensorSubCategory : sensorData.subCategory, sensorBrand : sensorData.brandName, sensorModel : sensorData.modelName, sensorCoverage : sensorData.radius, sensorHeight: sensorData.height, connectionLists : sensorData.connectionLists, frustum : sensorFrustum
                    }
                    if( sensorData.sensorAngle )
                        spec.sensorAngle = sensorData.sensorAngle

                    if( sensorData.sphereType )
                        spec.sphereType = sensorData.sphereType
        
                    addSmartSensor.addSensortoScene( point, spec, badgeText );

                }
 
            }
        ]

        basicContext.show(addSensorClone, event);
    }

    //Added for Panorama start
    function showPanoramaContextMenu( selectedItem, event ){
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
    }
    //Added for Panorama end

    function showJunctionBoxCtxtMenu( selectedItem, event ){

        event.preventDefault();
        var items = [
            {
                title:editor.languageData.RouteStraighttoCameras,
                icon: "fa fa-microchip",
                fn: function(){
                    var mode = "direct";
                    editor.autoRouting.drawCableFromJnctnBx( selectedItem, mode );
                }
            },
            {
                title:editor.languageData.RoutetoCamerasviaCeiling,
                icon: "fa fa-microchip",
                fn: function(){
                    var mode = "ceiling";
                    editor.autoRouting.drawCableFromJnctnBx( selectedItem, mode );
                }
            },
            {
                title:editor.languageData.RoutetoCamerasviaCustomHeight,
                icon: "fa fa-microchip",
                fn: function(){
                    var mode = "customheight";
                    var customHeightWindow;
                    var keys;
                    var userDataKeys
                    var junctionBoxtoRoute = editor.selected;
                    if( editor.scene.userData.mobileWindow ){
                        userDataKeys = Object.keys( editor.scene.userData.mobileWindow );
                        userDataKeys.forEach( function( child ){
                            editor.ceilingHeightin3DUnits[child] = editor.scene.userData.mobileWindow[child] 
                        } );
                       // editor.ceilingHeightin3DUnits = editor.scene.userData.mobileWindow;
                    }
                        

                    if( !(editor.selected.uuid in editor.routingWithHeight) ){
                        customHeightWindow = new UI.MobileWindow( "customheight-mobilewindow"+junctionBoxtoRoute.uuid );
                        customHeightWindow.setHeading( editor.languageData.CeilingHeight );
                        customHeightWindow.body.setAttribute("style","padding:2px;"); 
                        customHeightWindow.setClass( "customheight-mobilewindow" );

                        var ceilingHeightDiv = document.createElement( 'div' );
                        ceilingHeightDiv.setAttribute( 'class', 'height-div' );

                        var labelDiv = document.createElement( 'div' );
                        var heightLabel = document.createElement( 'label' );
                        heightLabel.className = "height-label";
                        heightLabel.innerHTML = editor.languageData.HeightoftheCeiling;

                        // var unitLabel = document.createElement( 'label' );
                        // unitLabel.className = "unit-label";
                        // unitLabel.innerHTML = "unit";

                        labelDiv.appendChild( heightLabel );

                        var ceilingHeight = document.createElement( 'input' );
                        ceilingHeight.type = "number";
                        ceilingHeight.className = "ceiling-height form-control";
                        ceilingHeight.setAttribute( 'id', 'ceiling-height'+junctionBoxtoRoute.uuid );
                        
                        ceilingHeight.value = (highestCameraY*editor.commonMeasurements.targetConversionFactor).toFixed(2);
                        ceilingHeight.setAttribute( 'min',0 );
                        ceilingHeight.setAttribute( 'max',Infinity );

                        var ceilingHeightUnit = document.createElement( 'label' );
                        ceilingHeightUnit.className = "ceiling-height-unit";
                        ceilingHeightUnit.setAttribute( 'id', 'ceiling-height-unit'+junctionBoxtoRoute.uuid );
                        // var ceilingHeightUnit = document.createElement( 'select' );
                        // ceilingHeightUnit.setAttribute( 'id', 'ceiling-height-unit' );

                        // var optionmeter = document.createElement( 'option' );
                        // optionmeter.setAttribute( 'value','meter' );
                        // optionmeter.innerHTML = "meter";

                        // var optionfeet = document.createElement( 'option' );
                        // optionfeet.setAttribute( 'value','feet' );
                        // optionfeet.innerHTML = "feet";

                        var btnDiv = document.createElement( 'div' );
                        btnDiv.className = "save-cancel-div";

                        var saveBtn = document.createElement( 'button' );
                        saveBtn.innerHTML = "<span class='fa fa-floppy-o'> <strong>" + editor.languageData.Route + "</strong></span>";
                        saveBtn.id = "save-height"+junctionBoxtoRoute.uuid;
                        saveBtn.className = "btn btn-success btn-xs save-height";

                        var cancelBtn = document.createElement( 'button' );
                        cancelBtn.innerHTML = "<span class='fa fa-times'> <strong>" + editor.languageData.Cancel + "</strong></span>";
                        cancelBtn.id = "cancel-routing"+junctionBoxtoRoute.uuid;
                        cancelBtn.className = "btn btn-danger btn-xs cancel-routing";

                        btnDiv.appendChild( saveBtn );
                        btnDiv.appendChild( cancelBtn );
                        
                        ceilingHeightDiv.appendChild( labelDiv );
                        ceilingHeightDiv.appendChild( ceilingHeight );
                        ceilingHeightDiv.appendChild( ceilingHeightUnit );
                        ceilingHeightDiv.appendChild( btnDiv );                                           

                        customHeightWindow.setBody( ceilingHeightDiv );
                        ceilingHeightDiv.id = "ceiling-heightDiv"
                        document.querySelector( "#editorElement" ).appendChild( customHeightWindow.dom );
                        customHeightWindow.setDraggable();
                        keys = Object.keys( editor.routingWithHeight );
                        keys.forEach( function( child ){
                            editor.routingWithHeight[child].hide();
                        } )
                        customHeightWindow.show();
                        editor.routingWithHeight[editor.selected.uuid] = customHeightWindow;



                    } 
                    else{
                        customHeightWindow = editor.routingWithHeight[junctionBoxtoRoute.uuid];
                        keys = Object.keys( editor.routingWithHeight );
                        keys.forEach( function( child ){
                            editor.routingWithHeight[child].hide();
                        } )
                        customHeightWindow.show();
                    }
                    
                    var unitofHeight = document.getElementById( 'ceiling-height-unit'+junctionBoxtoRoute.uuid );
                    var heightofCeiling = document.getElementById( 'ceiling-height'+junctionBoxtoRoute.uuid );
                    
                    if( heightofCeiling.value === "" ){
                        //multiply with target conversion factor;
                        if( userDataKeys && userDataKeys.length > 0 && userDataKeys.includes( junctionBoxtoRoute.uuid ) ){
                            
                            heightofCeiling.value = editor.ceilingHeightin3DUnits[junctionBoxtoRoute.uuid]* (editor.commonMeasurements.targetConversionFactor).toFixed(2);
                        }
                        else if( editor.sceneCameras.length > 0 ){
                            var highestCameraY;
                            editor.sceneCameras.forEach( camera => {
                                
                                highestCameraY = ( ( highestCameraY == undefined )? camera.position.y : ( camera.position.y > highestCameraY ) ? camera.position.y : highestCameraY );
                            });
                            heightofCeiling.value = (highestCameraY*editor.commonMeasurements.targetConversionFactor).toFixed(2);
                            editor.ceilingHeightin3DUnits[junctionBoxtoRoute.uuid] = highestCameraY;
                        }
                        

                    }
                    
                    heightofCeiling.addEventListener( 'input',function(){
                        var height = parseInt( heightofCeiling.value );
                        editor.ceilingHeightin3DUnits[junctionBoxtoRoute.uuid] = height/editor.commonMeasurements.targetConversionFactor;  
                    } )

                    if( editor.commonMeasurements.targetUnit != unitofHeight.innerHTML ){
                        heightofCeiling.value = ( editor.ceilingHeightin3DUnits[junctionBoxtoRoute.uuid]*editor.commonMeasurements.targetConversionFactor ).toFixed(2);
                        unitofHeight.innerHTML = editor.commonMeasurements.targetUnit;
                    }
                    var routeBtn = document.getElementById( "save-height"+junctionBoxtoRoute.uuid );
                    routeBtn.addEventListener( 'click',function(){
                        
                        if( !editor.scene.userData.mobileWindow ){
                            editor.scene.userData.mobileWindow = {};
                        }
                        //editor.scene.userData.mobileWindow = {heightMobileWindow:editor.ceilingHeightin3DUnits };
                        var junctionBoxKeys = Object.keys( editor.ceilingHeightin3DUnits )
                        junctionBoxKeys.forEach( function( child ){
                            editor.scene.userData.mobileWindow[child] = editor.ceilingHeightin3DUnits[child];
                        } )
                        //editor.scene.userData.mobileWindow = { ceilingHeightWindow: editor.ceilingHeightin3DUnits };
                        customHeightWindow.hide();
                        editor.autoRouting.drawCableFromJnctnBx( selectedItem, mode );
                       
                        
                    } );
                    document.getElementById( "cancel-routing"+junctionBoxtoRoute.uuid ).addEventListener( 'click',function(){
                        customHeightWindow.hide();
                    } )
                }
            },
            {
                title:editor.languageData.RoutetoCamerasviaFloor,
                icon: "fa fa-microchip",
                fn: function(){
                    var mode = "floor";
                    editor.autoRouting.drawCableFromJnctnBx( selectedItem, mode );
                }
            }
        ];
        basicContext.show(items, event);

    }


    container.dom.addEventListener('contextmenu', function(event) {

        event.preventDefault();
        if( localStorage.getItem("viewmode") != "true"){
            handleClick();
            var selectedItem = editor.selected;
            if (editor.theatreMode) {
    
                if (selectedItem instanceof THREE.PerspectiveCamera) {
                    
                    //Modified for Panorama start
                    if( selectedItem.camCategory!= undefined && selectedItem.camCategory == "Panorama"  )
                    showPanoramaContextMenu( selectedItem, event )
                    else
                    showCustomContextMenu(selectedItem, event);
                    //Modified for Panorama end
    
                }
                //Modified to add a context menu to show the active screens list.
                /*else if( selectedItem === null ){
    
                    //Generate the list using all the active screens from SimulationManager.
                    showScreensList( event );
    
                }*/
                else {
    
                    //Generate the list using all the active screens from SimulationManager.
                    showScreensList(event);
                    //return;
    
                }
    
            } else if (editor.isMeasuring === true || editor.isAreaMeasuring === true || editor.isntwrkngStarted===true || editor.isTwoDMeasuring === true ) {
    
                editor.deselect();
    
            } else if (editor.areaShowHideToggle === true && selectedItem != null && selectedItem != undefined && selectedItem.name === "AreaSelectionRectangle") {
    
                showAreaMsrCntxtMenu(selectedItem, event);
    
            } else if ( ( selectedItem != null ) && ( selectedItem != undefined ) && ( selectedItem instanceof THREE.Sprite ) && ( selectedItem.camerauuid != undefined ) && ( selectedItem.camerauuid != null ) ){
                
                ShowRefPntCntxtmenu(selectedItem, event);
    
            } else if ( selectedItem != null && selectedItem != undefined && selectedItem instanceof THREE.PerspectiveCamera && !editor.theatreMode ){
    
                addRefPointOrCloneCamera(selectedItem, event);
    
            } else if( selectedItem instanceof THREE.Group && selectedItem.userData && selectedItem.userData.sensorData ){

                addCloneSensor( selectedItem, event );

            }
            else if( selectedItem != null && selectedItem instanceof THREE.Mesh && (/^JunctionBox[1-9]+[0-9]*/g).test(selectedItem.name) && editor.isAutoRoutingStrtd == true ){
                showJunctionBoxCtxtMenu( selectedItem, event );
            } 
            else if(editor.isTwoDMeasuring === true) {
    
                editor.deselect();
                
            }
            
            else {
                
                var boundingRect = renderer.domElement.getBoundingClientRect();
                var elem = document.getElementsByTagName('canvas')[0];
                var x = (((event.clientX - boundingRect.left) * elem.width) / boundingRect.width);
                var y = (((event.clientY - boundingRect.top) * elem.height) / boundingRect.height);
                var z = 0.5;
                var mouse3D = new THREE.Vector3(((event.clientX - boundingRect.left) / elem.width) * 2 - 1, -((event.clientY - boundingRect.top) / elem.height) * 2 + 1, 0.5);
                var point3D = new THREE.Vector2(x, y);
                var raycaster = new THREE.Raycaster();
                raycaster.setFromCamera(mouse3D, camera);
                var intersects = raycaster.intersectObjects(editor.sceneObjects, true);
    
                if (intersects.length > 0) {
    
                    var intersectObject = intersects[0].object
                    if (intersectObject.userData.pointData) {
    
                        showCustomContextMenuForPointOfIntrestEditOption(intersectObject, event)
    
                    } else if( intersects[0] != null && intersects[0] != undefined ) {
    
                        showCustomMenuForCurrentPosition(intersects[0], event)
                    }
    
    
    
                }
    
            }
        }
        

    }, false);
    //MODIFIED FOR CONTEXT MENU END

    //Modified to generate the camera screens list when right clicked on the simulation screen start
    editor.signals.simulationScreenContextmenuRequested.add(function(event) {

        if (editor.theatreMode) {

            //Generate the list using all the active screens from SimulationManager.
            showScreensList(event);

        }

    });
    //Modified to generate the camera screens list when right clicked on the simulation screen end

    //Modified to update Ref-Cam table when changed in viewport start
    editor.signals.refCamAttributesChanged.add( function( data ){

        if( data != undefined && data !=null ){

            var changedDis = document.getElementById( data.refuuid + '__row__dis' );
            var changedXPos = document.getElementById( data.refuuid + '__valueX' );
            var changedYPos = document.getElementById( data.refuuid + '__valueY' );
            var changedZPos = document.getElementById( data.refuuid + '__valueZ' );
            var chagedAbsHeight = document.getElementById( data.refuuid + '__row__abs__height' );
            var chagedAbsDistance = document.getElementById( data.refuuid + '__row__abs__distance' );

            changedDis.innerHTML = data.dis;
            changedXPos.value = ( (data.changedPos.x * editor.commonMeasurements.targetConversionFactor ).toFixed(2) );
            changedYPos.value = ( (data.changedPos.y * editor.commonMeasurements.targetConversionFactor ).toFixed(2) );
            changedZPos.value = ( (data.changedPos.z * editor.commonMeasurements.targetConversionFactor ).toFixed(2) );
            chagedAbsHeight.innerHTML = data.absoluteHeight;
            chagedAbsDistance.innerHTML = data.absoluteDistance;

        }

    } );
    //Modified to update Ref-Cam table when changed in viewport end
    var initialJBPosition = new THREE.Vector3();
    var finalJBPosition = new THREE.Vector3();
    function onMouseDown(event) {

        //  Junction Box on move toastr event start
        var selectedJB = editor.selected;
        if( selectedJB != null && selectedJB != undefined && (/^JunctionBox[1-9]+[0-9]*/g).test(selectedJB.name) && selectedJB instanceof THREE.Mesh ){

            if(selectedJB instanceof THREE.Mesh){

                initialJBPosition = selectedJB.position.clone();
                
            }

        }



        // Junction Box on move toastr event end

        event.preventDefault();

        var array = getMousePosition(container.dom, event.clientX, event.clientY);
        onDownPosition.fromArray(array);

        document.addEventListener('mouseup', onMouseUp, false);

    }

    function onMouseUp(event) {

        //  Junction Box on move toastr event start
        var selectedJB = editor.selected;

        if(selectedJB != null && selectedJB != undefined && (/^JunctionBox[1-9]+[0-9]*/g).test(selectedJB.name) && selectedJB instanceof THREE.Mesh){
        
       

            if(selectedJB instanceof THREE.Mesh){

                finalJBPosition = selectedJB.position.clone();
                
            }
            
            if(initialJBPosition.distanceTo(finalJBPosition) != 0 ){
                toastr.info( editor.languageData.PleaseReRoutetheAutoRoutingforChangestoTakeEffect )
            }

        }
        

        // Junction Box on move toastr event end

        var array = getMousePosition(container.dom, event.clientX, event.clientY);
        onUpPosition.fromArray(array);

        //handleClick(); //modified to perform handle click only if measuring tool is not active

        /*MODIFIED TO INCLUDE MEASURING TOOLS START*/
        //If the measuring tools are active then deselect the selected items on mouse click
        //This is to avoid confusion on the viewport as selecting an item will highlight more lines on the screen
        if (editor.isMeasuring === true || editor.isAreaMeasuring === true) {

            editor.deselect();

        } else if (!editor.isMeasuring && !editor.isAreaMeasuring) {

            handleClick();

        }
        /*MODIFIED TO INCLUDE MEASURING TOOLS END*/

        document.removeEventListener('mouseup', onMouseUp, false);

    }

    function onTouchStart(event) {

        var touch = event.changedTouches[0];

        var array = getMousePosition(container.dom, touch.clientX, touch.clientY);
        onDownPosition.fromArray(array);

        document.addEventListener('touchend', onTouchEnd, false);

    }

    function onTouchEnd(event) {

        var touch = event.changedTouches[0];

        var array = getMousePosition(container.dom, touch.clientX, touch.clientY);
        onUpPosition.fromArray(array);

        handleClick();

        document.removeEventListener('touchend', onTouchEnd, false);

    }

    /**
     * showCurrentPossition( intersect ) - Show the current postion when double clicked.
     * @param {Object} intersect  - first intersect point result of ray casting
     * @returns {Void}
     * @author Mavelil
     */
    var showCurrentPossition = function(intersect) {

        var X = Number(intersect.point.x).toFixed(1);
        var Y = Number(intersect.point.y).toFixed(1);
        var Z = Number(intersect.point.z).toFixed(1);

        if (timeOut != undefined) {

            window.clearTimeout(timeOut);
            editor.currentPosition.hide();
            editor.currentPosition.setcurrent(X, Y, Z);
            editor.currentPosition.show();
            timeOut = window.setTimeout(function() {
                editor.currentPosition.hide();
            }, 4000);


        } else {

            window.clearTimeout(timeOut);
            editor.currentPosition.setcurrent(X, Y, Z);
            editor.currentPosition.show();
            timeOut = window.setTimeout(function() {
                editor.currentPosition.hide();
            }, 4000);

        }

    }

    var showPositionWindow = function(intersect) {

        var X = Number(intersect.point.x).toFixed(1);
        var Y = Number(intersect.point.y).toFixed(1);
        var Z = Number(intersect.point.z).toFixed(1);

        var rightClickedPositionWindow = document.getElementById( 'position-mob-window' );
        var xPosition = document.querySelector( '#x-position-value' );
        var yPosition = document.querySelector( '#y-position-value' );
        var zPosition = document.querySelector( '#z-position-value' );

        if( rightClickedPositionWindow.style.display == "none" ){

            rightClickedPositionWindow.style.zIndex = '1';
            rightClickedPositionWindow.style.display = "block";
            xPosition.innerHTML = X;
            yPosition.innerHTML = Y;
            zPosition.innerHTML = Z;

        }
        else{

            xPosition.innerHTML = X;
            yPosition.innerHTML = Y;
            zPosition.innerHTML = Z;

        }

    }

    function repositionReferencepoint( intersect ){

        if( editor.currentRefpoint != null && editor.currentRefpoint != undefined && editor.rePositionRefpoint === true){

            var newPosition = intersect.point; 
            editor.currentRefpoint.position.copy( newPosition );

            if( editor.currentRefpoint.userData.checkLOSFlag === "set" ){

                var refPoint = editor.currentRefpoint.position.clone();
                var lineUUID = editor.currentRefpoint.userData.lineUUID;
                var camUUID = editor.currentRefpoint.camerauuid;
                var line = editor.scene.getObjectByProperty( 'uuid', lineUUID );
                var cam = editor.scene.getObjectByProperty( 'uuid', camUUID );
                var camPosition = cam.position.clone();

                var currDistance = ( (refPoint.distanceTo( camPosition ) ) * editor.commonMeasurements.targetConversionFactor).toFixed(1);

                //Modified to include absolute height and absolute distance start
                var absHeight = Math.abs((( camPosition.y - refPoint.y )* editor.commonMeasurements.targetConversionFactor ).toFixed(1));
                var absDistance = Math.abs((( camPosition.x - refPoint.x )* editor.commonMeasurements.targetConversionFactor ).toFixed(1));
                //Modified to include absolute height and absolute distance end
                cam.userData.absHeight = absHeight;
                cam.userData.absDistance = absDistance;

                //Modified to include reference point position in camera userdata start
                cam.userData.reference = newPosition;
                //Modified to include referencepoint position in camera userdata end

                var badgeLabelText;
                if( editor.commonMeasurements.targetUnit === "meter" ){

                    badgeLabelText = currDistance + " m";
                    absHeight = absHeight + " m";
                    absDistance = absDistance + " m";

                } 
                else if(  editor.commonMeasurements.targetUnit === "feet"  ){

                    badgeLabelText = currDistance + " ft";
                    absHeight = absHeight + " ft";
                    absDistance = absDistance + " ft";

                } 

                var relPoint = new THREE.Vector3();
                relPoint.x = camPosition.x - refPoint.x;
                relPoint.y = camPosition.y - refPoint.y;
                relPoint.z = camPosition.z - refPoint.z;

                if( editor.currentRefpoint.userData.checkLOSFlag === 'set' ){

                    processRefCamLineEndPoints( line, refPoint, camPosition, badgeLabelText );

                }

                if( editor.currentRefpoint.userData.checkDetailsFlag === 'set' ){

                    var data = {

                        dis: badgeLabelText,
                        changedPos: relPoint,
                        refuuid: editor.currentRefpoint.uuid,
                        absoluteHeight: absHeight,
                        absoluteDistance: absDistance

                    }

                    editor.signals.refCamAttributesChanged.dispatch( data );

                }

            }

            editor.signals.sceneGraphChanged.dispatch();
            editor.rePositionRefpoint = false; 
            editor.currentRefpoint = '';
            editor.scene.remove( scope.rePositionCursor );
            editor.signals.sceneGraphChanged.dispatch();

        }

    }

    function onDoubleClick(event) {

        //Modified to avoid performing other actions during the measurement flag is set to true start
        if (editor.isMeasuring != true && editor.isAreaMeasuring != true &&editor.addSensorToScene != true) {

            var array = getMousePosition(container.dom, event.clientX, event.clientY);
            onDoubleClickPosition.fromArray(array);

            var intersects = getIntersects(onDoubleClickPosition, objects);

            if (intersects.length > 0 && editor.rePositionRefpoint === false) {
                var intersect = intersects[0];

                showCurrentPossition(intersect);

                // signals.objectFocused.dispatch(intersect.object);

            }
            else if ( intersects.length > 0 && editor.rePositionRefpoint === true ){

                var intersect = intersects[0];
                repositionReferencepoint(intersect);

            }
            else if( intersects.length == 0 && editor.rePositionRefpoint === true ){

                toastr.info("Click on an object to re-position Reference point");

            }

            /* Point of intrest*/
            var currentObject = editor.selected;
            if (currentObject != null) {
                if (currentObject.userData.pointData) {

                    if (PointOfIntrestTimeOut == undefined) {


                        window.clearTimeout(PointOfIntrestTimeOut);
                        PointofIntrestObject.showDetails(currentObject);
                        PointofIntrestObject.showModelDetails();

                        /*currentObject.children[0].visible = true; */

                        editor.signals.sceneGraphChanged.dispatch();
                        perviousPointOfIntrestObject = currentObject.children[0];
                        PointOfIntrestTimeOut = window.setTimeout(function() {

                            PointofIntrestObject.hideModelDetails();
                            /*currentObject.children[0].visible = false; */

                            editor.signals.sceneGraphChanged.dispatch();
                        }, 3000);


                    } else {


                        window.clearTimeout(PointOfIntrestTimeOut);

                        /* perviousPointOfIntrestObject.visible = false ;
                         currentObject.children[0].visible = true; 
                         perviousPointOfIntrestObject  = currentObject.children[0];*/
                        PointofIntrestObject.showDetails(currentObject);
                        PointofIntrestObject.showModelDetails();
                        editor.signals.sceneGraphChanged.dispatch();
                        PointOfIntrestTimeOut = window.setTimeout(function() {

                            PointofIntrestObject.hideModelDetails();
                            /* currentObject.children[0].visible = false; */

                            editor.signals.sceneGraphChanged.dispatch();
                        }, 3000);
                    }
                }


            }
            /* Point of intrest*/

            /*Modefied for generate point for camera generation*/
            if (editor.cameraGeneratingFlag) {
                var boundingRect = renderer.domElement.getBoundingClientRect();
                var elem = document.getElementsByTagName('canvas')[0];
                var x = (((event.clientX - boundingRect.left) * elem.width) / boundingRect.width);
                var y = (((event.clientY - boundingRect.top) * elem.height) / boundingRect.height);
                var z = 0.5;
                var mouse3D = new THREE.Vector3(((event.clientX - boundingRect.left) / elem.width) * 2 - 1, -((event.clientY - boundingRect.top) / elem.height) * 2 + 1, 0.5);
                var point3D = new THREE.Vector2(x, y);
                var raycaster = new THREE.Raycaster();
                raycaster.setFromCamera(mouse3D, camera);
                var intersects = raycaster.intersectObjects(objects);
                if (intersects.length > 0) {


                    currentPostioncameraDoubleClick = intersects[0].point;
                    cameraGeneratingaddPoint();

                    if (editor.setCamera == 0 && editor.setCameraRotation == 1) {

                        editor.cameraGeneratingPosition = [];
                        objectData = '';
                        var spriteMap = new THREE.TextureLoader().load("assets/img/camgen.png");
                        var spriteMaterial = new THREE.SpriteMaterial({
                            map: spriteMap,
                            color: 0xffffff
                        });
                        var sprite = new THREE.Sprite(spriteMaterial);
                        sprite.scale.set(2, 2, 2);
                        sprite.position.copy(intersects[0].point);
                        sprite.name = "cameraGeneratingSprite"
                        editor.execute(new AddObjectCommand(sprite));
                        editor.signals.objectAdded.dispatch(sprite);
                        editor.signals.sceneGraphChanged.dispatch();
                        editor.cameraGeneratingPosition.push(sprite);
                        sprite.matrixAutoUpdate = false;
                        objectData = sprite
                        toastr.info(editor.languageData.CamerapointisaddedDoubleclickpointwherethecameralook);
                        editor.setCamera = 1;
                        editor.setCameraRotation = 0;


                    } else {


                        editor.setCamera = 0;
                        editor.setCameraRotation = 1;
                        geometry = new THREE.SphereGeometry(0.4, 32, 32);
                        material = new THREE.MeshBasicMaterial({
                            color: 0xf2651f
                        });
                        sphere = new THREE.Mesh(geometry, material);
                        sphere.position.copy(intersects[0].point);
                        sphere.name = "cameraGeneratingSphere"
                        editor.execute(new AddObjectCommand(sphere));
                        editor.signals.objectAdded.dispatch(sphere);
                        editor.signals.sceneGraphChanged.dispatch();
                        //sphere.matrixAutoUpdate = false;
                        var lastObject = {}
                        lastObject.LookObject = sphere;
                        lastObject.object = objectData;
                        firstObjectUUid = objectData.uuid;
                        secondObjectUUid = sphere.uuid;
                        editor.cameraGeneratingPositionAndLook[objectData.uuid] = lastObject;
                        camToEditor.addPositionCameraGenerating(editor.cameraGeneratingPosition);

                    }


                }
            }
            /*Modefied for generate point for camera generation*/

            /*Modefied for Reference point for camera */
            /*else if (editor.referencePointFlag) {
            
                editor.referencePointFlag = false;
                var boundingRect = renderer.domElement.getBoundingClientRect();
                var elem = document.getElementsByTagName('canvas')[0];
                var x = (((event.clientX - boundingRect.left) * elem.width) / boundingRect.width);
                var y = (((event.clientY - boundingRect.top) * elem.height) / boundingRect.height);
                var z = 0.5;

                var mouse3D = new THREE.Vector3(((event.clientX - boundingRect.left) / elem.width) * 2 - 1, -((event.clientY - boundingRect.top) / elem.height) * 2 + 1, 0.5);

                var point3D = new THREE.Vector2(x, y);
                var raycaster = new THREE.Raycaster();

                raycaster.setFromCamera(mouse3D, camera);
                var intersects = raycaster.intersectObjects(objects);

                if (intersects.length > 0) {
                    var currentcamera = editor.currentRefernceCamera;
                    var iconUrl = 'assets/img/vlc.png';
                    var badgeTextValue = Number(currentcamera.badgeText).toString();
                    var iconBadge = editor.iconWithBadge(iconUrl, badgeTextValue, currentcamera.helperColor);
                    iconBadge.name = "ReferenceIcon";
                    iconBadge.position.copy(intersects[0].point);
                    iconBadge.camerauuid = currentcamera.uuid
                    iconBadge.givenid = "refpostion"
                    editor.execute(new AddObjectCommand(iconBadge));
                    var meshUuid = editor.selected.uuid;
                    editor.signals.referranceSignal.dispatch(currentcamera, intersects[0].point, meshUuid);
                    editor.signals.objectAdded.dispatch(iconBadge);
                    editor.signals.sceneGraphChanged.dispatch();
                    for(var i = 0 ; i< editor.referenceLineArray.length ; i++ ){

                    editor.execute(new RemoveObjectCommand( editor.referenceLineArray[i])); 
                    if( i == editor.referenceLineArray.length -1){
                        editor.referenceLineArray = [];
                    }
                    }
                    container.dom.style.cursor = "auto";

                    

                }
            } */
            /*Modefied for Reference point for camera */

        }
        //Modified to avoid performing other actions during the measurement flag is set to true end     

    }

    container.dom.addEventListener('mousedown', onMouseDown, false);
    container.dom.addEventListener('touchstart', onTouchStart, false);
    container.dom.addEventListener('dblclick', onDoubleClick, false);

    document.addEventListener('contextmenu', function(event) {

        event.preventDefault();

    });

    // controls need to be added *after* main logic,
    // otherwise controls.enabled doesn't work.

    /*var controls = new THREE.EditorControls(camera, container.dom);
    controls.addEventListener('change', function() {

        transformControls.update();
        signals.cameraChanged.dispatch(camera);

    });*/

    //Modified for orthographic top-view start
    var controls;

    function configureEditorControls(sceneCamera, dom) {

        if (controls) {

            try {

                controls.dispose();

            } catch (exception) {

                console.warn(exception);

            }

        }

        controls = new THREE.EditorControls(sceneCamera, dom);
        controls.addEventListener('change', function() {

            transformControls.update();
            signals.cameraChanged.dispatch(sceneCamera);

        });

    }
    configureEditorControls(camera, container.dom);
    //Modified for orthographic top-view end

    container.dom.addEventListener('mousemove', function(event) {

        if (editor.cameraGeneratingFlag) {

            if (editor.targetLocked == false) {


                var boundingRect = renderer.domElement.getBoundingClientRect();
                var elem = document.getElementsByTagName('canvas')[0];
                var x = (((event.clientX - boundingRect.left) * elem.width) / boundingRect.width);
                var y = (((event.clientY - boundingRect.top) * elem.height) / boundingRect.height);
                var z = 0.5;
                var mouse3D = new THREE.Vector3(((event.clientX - boundingRect.left) / elem.width) * 2 - 1, -((event.clientY - boundingRect.top) / elem.height) * 2 + 1, 0.5);
                var point3D = new THREE.Vector2(x, y);
                var raycaster = new THREE.Raycaster();
                raycaster.setFromCamera(mouse3D, camera);
                var intersects = raycaster.intersectObjects(objects);
                if (intersects.length > 0) {
                    var pos = intersects[0].point;
                    editor.cameraGenerateLine.setTargetPoint(pos);
                    editor.cameraGenerateLine.computeLineDistances();

                }

                editor.signals.objectChanged.dispatch(editor.cameraGenerateLine.line);

            }


            if (editor.setCamera == 0 && editor.setCameraRotation == 1) {

                container.dom.style.cursor = "url(assets/img/camgen-e.png) 4 12, auto";

            } else {


                container.dom.style.cursor = "url(assets/img/map-marker-icon-e.png) 4 12, auto";

            }
        } else {

            container.dom.style.cursor = "auto";
        }
        
        if( editor.rePositionRefpoint === true ){

            var boundingRect = renderer.domElement.getBoundingClientRect();
            var elem = document.getElementsByTagName('canvas')[0];
            var x = (((event.clientX - boundingRect.left) * elem.width) / boundingRect.width);
            var y = (((event.clientY - boundingRect.top) * elem.height) / boundingRect.height);
            var z = 0.5;
            var mouse3D = new THREE.Vector3(((event.clientX - boundingRect.left) / elem.width) * 2 - 1, -((event.clientY - boundingRect.top) / elem.height) * 2 + 1, 0.5);
            var point3D = new THREE.Vector2(x, y);
            var raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(mouse3D, camera);
            var intersects = raycaster.intersectObjects(editor.sceneObjects, true);

            if (intersects.length > 0) {

                scope.rePositionCursor.position.copy( intersects[ 0 ].point.clone() );
                editor.signals.sceneGraphChanged.dispatch();

                if( editor.isFloorplanViewActive === true ){

                    editor.scaleCursorFloorPlanView( scope.rePositionCursor );
    
                } else{

                    editor.scaleCursorThreeDView( scope.rePositionCursor );

                }

            }
            
        } 

    });

    // signals

    signals.editorCleared.add(function() {

        controls.center.set(0, 0, 0);
        render();

    });

    signals.enterVR.add(function() {

        vrEffect.isPresenting ? vrEffect.exitPresent() : vrEffect.requestPresent();

    });

    signals.themeChanged.add(function(value) {

        switch (value) {

            /*MODIFIED TO INCLUDE CENTER LINE IN THE VIEWPORT START*/
            case 'assets/css/light.css':
                sceneHelpers.remove(grid);
                grid = new THREE.GridHelper(60, 196, 0xc92a2a, 0x888888);
                sceneHelpers.add(grid);
                break;
            case 'assets/css/dark.css':
                sceneHelpers.remove(grid);
                grid = new THREE.GridHelper(60, 196, 0xbbbbbb, 0x888888);
                sceneHelpers.add(grid);
                break;
                /*MODIFIED TO INCLUDE CENTER LINE IN THE VIEWPORT END*/

        }

        render();

    });

    /*MODIFIED TO UPDATE MEASUREMENT VALUE DIV SFTER UNDO START*/
    signals.historyChanged.add(function(cmd) {

        /*if (editor.distanceHelperDiv.dom.style.display == "block") {

            editor.distanceHelperDiv.dom.innerHTML = "<strong> 0 m </strong>";

        }*/

    });
    /*MODIFIED TO UPDATE MEASUREMENT VALUE DIV SFTER UNDO END*/

    signals.transformModeChanged.add(function(mode) {

        /*MODIFIED TO SHOW THE TRANSLATION CONTROLS UI EVEN IF THE ROTATE MODE SELECTED START*/
        if (mode === 'rotate' && transformControls.object instanceof THREE.PerspectiveCamera && transformControls.object.camCategory != undefined && transformControls.object.camCategory === 'Fixed Dome') {

            transformControls.setMode('translate');
            toastr.info(editor.languageData.YouhaveselectedaDomecameraYoucanrotateitonlyontheZaxis);
            return;

        }
        /*MODIFIED TO SHOW THE TRANSLATION CONTROLS UI EVEN IF THE ROTATE MODE SELECTED END*/

        transformControls.setMode(mode);

    });

    signals.snapChanged.add(function(dist) {

        transformControls.setTranslationSnap(dist);

    });

    signals.spaceChanged.add(function(space) {

        transformControls.setSpace(space);

    });

    signals.rendererChanged.add(function(newRenderer) {

        if (renderer !== null) {

            container.dom.removeChild(renderer.domElement);

        }

        renderer = newRenderer;

        renderer.autoClear = false;
        renderer.autoUpdateScene = false;
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(container.dom.offsetWidth, container.dom.offsetHeight);

        container.dom.appendChild(renderer.domElement);

        render();

    });

    signals.sceneGraphChanged.add(function() {

        render();

    });

    signals.cameraChanged.add(function() {

        render();

    });

    //Modified for orthographic top-view start
    signals.sceneCameraChanged.add(function(newCamera) {

        camera = newCamera;
        configureTransformControls(camera, container.dom);
        configureEditorControls(camera, container.dom);
        editor.lengthMeasurement.measurementControls.updateCamera(newCamera);
        editor.areaMeasurement.measurementControls.updateCamera(newCamera);
        editor.networking.networkDesigner.updateCamera(newCamera);
        editor.cubeAxisHelper.updateCamera(newCamera);
        editor.twodmeasurement.twoDMeasurementControls.updateCamera(newCamera);
        editor.autoRouting.autoRoutingDesigner.updateCamera(newCamera);
        render();

    });
    //Modified for orthographic top-view end
    signals.cameraShowHideSignal.add(function(isShow) {

        editor.scene.traverse(function(children) {

            var seenHelper = editor.sceneHelpers.children;
            if (children.type == 'PerspectiveCamera') {

                children.visible = isShow;
                for (var i = 0; i < seenHelper.length; i++) {

                    if (seenHelper[i].camera) {

                        if (seenHelper[i].camera.uuid == children.uuid) {

                            seenHelper[i].visible = isShow;
                        }
                    }
                }

                if( ( children.userData.objectUuid != "notset" ) && !isShow ){
                   
                    var refPointUID = children.userData.objectUuid;
                    var refPoint = editor.scene.getObjectByProperty( 'uuid', refPointUID );

                    if( refPoint.userData.checkLOSFlag === 'set' ){

                        var lineUID = refPoint.userData.lineUUID;
                        var line = editor.scene.getObjectByProperty( 'uuid', lineUID );
                        line.visible = false;
                        refPoint.userData.checkLOSFlag = 'notset';
                        editor.signals.sceneGraphChanged.dispatch();

                    }

                }

                signals.objectChanged.dispatch(children);
            }

        })

    });

    signals.objectSelected.add(function(object) {

        selectionBox.visible = false;
        transformControls.detach();

        /*MODIFIED TO AVOID THE BOX HELPER FOR CAMERA START*/
        //if (object !== null && object !== scene && object !== camera) {
        if (object !== null && object !== scene && object !== camera) {

            box.setFromObject(object);

            if (box.isEmpty() === false) {

                selectionBox.setFromObject(object);
                //selectionBox.visible = true;
                if (object.type != 'PerspectiveCamera') selectionBox.visible = true;

            }

            //Modified to avoid attaching TransformControls rotation to Dome type cameras start
            if (editor.rotationControls.isSphericalControlsActive === true) {

                if (object instanceof THREE.PerspectiveCamera && object.camCategory != undefined && object.camCategory === 'Fixed Dome') {

                    toastr.info(editor.languageData.YouhaveselectedaDomecameraYoucanrotateitonlyontheZaxis);
                    transformControls.setMode('translate');

                } else if(object instanceof THREE.PerspectiveCamera &&  object.userData.threeDModelType != undefined && (object.userData.threeDModelType == "Dome" || object.userData.threeDModelType == "PTZ" || (object.userData.threeDModelType == "LiDAR" && object.sensorCategory === "Hitachi LFOM5" )) ) {

                    toastr.info( editor.languageData.SphericalControlsisdisabledforthiscameras );
                    transformControls.setMode('translate');

                } else {

                    transformControls.setMode('rotate');

                }

            }
            //Modified to avoid attaching TransformControls rotation to Dome type cameras end

            transformControls.attach(object);

        }
        /*MODIFIED TO AVOID THE BOX HELPER FOR CAMERA END*/

        render();

    });

    signals.objectFocused.add(function(object) {

        controls.focus(object);

    });

    signals.geometryChanged.add(function(object) {

        if (object !== undefined) {

            selectionBox.setFromObject(object);

        }

        render();

    });

    signals.objectAdded.add(function(object) {

        object.traverse(function(child) {

            objects.push(child);
            if (editor.checkRaycastApplicability(child) === true) {

                if (!(child instanceof THREE.Camera)) {

                    editor.sceneObjects.push(child);

                }

            }
            //editor.sceneObjects = objects;

        });

        //MODIFIED TO INCLUDE CAMERA FRUSTUM UPDATIONS START
        //Camera object includes 2 children 0-iconBadge and 1-camera frustum
        /*if (object.children[1] != undefined) {

            if (object.children[1].name == 'CameraFrustum') {

                object.children[1].geometry.updateFromCamera(object);
                editor.signals.sceneGraphChanged.dispatch();
            }

        }*/
        if (object != undefined) {

            object.traverse( function( child ) {

                if( child.name === "CameraFrustum" ) {

                    child.geometry.updateFromCamera(object);
                    editor.signals.sceneGraphChanged.dispatch();

                }

            } ) 

        }
        //MODIFIED TO INCLUDE CAMERA FRUSTUM UPDATIONS END

        //Modified to scale camera icons when they are added to the scene start
        var scaleFactor = 16;
        if (object instanceof THREE.PerspectiveCamera) {

            var scaleVector = new THREE.Vector3();
            var scale = scaleVector.subVectors(object.position, editor.camera.position).length() / scaleFactor;
            object.children[0].scale.set(scale, scale, 1);

        }
        //Modified to scale camera icons when they are added to the scene end        

    });

    //modified to handle manual area change
    signals.arealengthManualPositionChange.add( function( marker ){
        findAndProcessMsrmtEndPoints( marker );
        updateAreaLengthMeasurementSceneUserData( marker.position,marker );
    } );



    signals.objectChanged.add(function(object) {

        if (editor.selected === object) {

            selectionBox.setFromObject(object);
            transformControls.update();

        }

        if (object instanceof THREE.PerspectiveCamera) {

            object.updateProjectionMatrix();

        }

        if (editor.helpers[object.id] !== undefined) {

            editor.helpers[object.id].update();

        }

        render();

    });

    signals.objectRemoved.add(function(object) {

        object.traverse(function(child) {

            if( objects.indexOf(child) != -1 ){
                objects.splice(objects.indexOf(child), 1);
            }
            //editor.sceneObjects = objects;
            if (editor.sceneObjects.indexOf(child) != -1) {
                editor.sceneObjects.splice(editor.sceneObjects.indexOf(child), 1);
            }

        });

    });

    signals.helperAdded.add(function(object) {

        objects.push(object.getObjectByName('picker'));
        //editor.sceneObjects = objects;

    });

    signals.helperRemoved.add(function(object) {

        objects.splice(objects.indexOf(object.getObjectByName('picker')), 1);
        //editor.sceneObjects = objects;

    });

    signals.materialChanged.add(function(material) {

        render();

    });

    // fog

    signals.sceneBackgroundChanged.add(function(backgroundColor) {

        scene.background.setHex(backgroundColor);

         //Save the background color to the project metadata when the background color changes start
         if( editor.scene.userData.viewportSettings ){

            editor.scene.userData.viewportSettings.background = backgroundColor;

        }
        else{

            editor.scene.userData.viewportSettings = {};
            editor.scene.userData.viewportSettings.background = backgroundColor;

        }
        //Save the background color to the project metadata when the background color changes end

        render();

    });
    // signals for reference point of camera strat
    signals.neededReferancePoint.add(function() {

        cameraRefernceaddPoint();

    });
    // signals for reference point of camera End

    //Modified to load the background color for the viewport while loading the project start
    editor.signals.projectDataLoaded.add( function(){

        if( editor.hideAllFrustum != undefined && editor.hideAllFrustum == true ){
                        
            document.querySelector( "#hide-camera-frustum" ).click();
        }
        if( document.getElementById( 'hide-sensor-frustum' ).checked ){

            document.getElementById( 'hide-sensor-frustum' ).click();
            
        }
        var sceneUserData = editor.scene.userData.viewportSettings
        if( sceneUserData ){

            editor.signals.sceneBackgroundChanged.dispatch( sceneUserData.background );
            var bgColorInput = document.querySelector('#sidebar-scene-bgcolor-input');
            if( bgColorInput && bgColorInput != undefined ) {

                bgColorInput.value = "#"+(new THREE.Color(sceneUserData.background)).getHexString();

            }

        }

    } );
    //Modified to load the background color for the viewport while loading the project end

    var currentFogType = null;

    signals.sceneFogChanged.add(function(fogType, fogColor, fogNear, fogFar, fogDensity) {

        if (currentFogType !== fogType) {

            switch (fogType) {

                case 'None':
                    scene.fog = null;
                    break;
                case 'Fog':
                    scene.fog = new THREE.Fog();
                    break;
                case 'FogExp2':
                    scene.fog = new THREE.FogExp2();
                    break;

            }

            currentFogType = fogType;

        }

        if (scene.fog instanceof THREE.Fog) {

            scene.fog.color.setHex(fogColor);
            scene.fog.near = fogNear;
            scene.fog.far = fogFar;

        } else if (scene.fog instanceof THREE.FogExp2) {

            scene.fog.color.setHex(fogColor);
            scene.fog.density = fogDensity;

        }

        render();

    });

    //

    signals.windowResize.add(function() {

        // TODO: Move this out?

        editor.DEFAULT_CAMERA.aspect = container.dom.offsetWidth / container.dom.offsetHeight;
        editor.DEFAULT_CAMERA.updateProjectionMatrix();

        camera.aspect = container.dom.offsetWidth / container.dom.offsetHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(container.dom.offsetWidth, container.dom.offsetHeight);

        render();

    });

    signals.showGridChanged.add(function(showGrid) {

        editor.isGridShowing = showGrid;
        var gridSize = document.querySelector( '#change-grid-size' );
        var gridUnit = document.querySelector( '#change-grid-unit' );

        gridSize.disabled = !showGrid;
        gridUnit.disabled = !showGrid;
        grid.visible = showGrid;
        render();

    });


    //

    /*function render() {

        sceneHelpers.updateMatrixWorld();
        scene.updateMatrixWorld();

        renderer.render(scene, camera);

        if (renderer instanceof THREE.RaytracingRenderer === false) {

            renderer.render(sceneHelpers, camera);

        }


    }*/
    /*Modeied for draw line B/w to camera and point*/

    /*var generateLine = function(firstPoint,secondPoint,objectUUid){

            var material = new THREE.LineBasicMaterial({ color:0x0000ff });
            var geometry = new THREE.Geometry();
            geometry.vertices.push(firstPoint);
            geometry.vertices.push(secondPoint);
            var line = new THREE.Line(geometry, material);
            line.name = "GenerateCameraLine"
            editor.execute(new AddObjectCommand(line));
            editor.cameraGeneratingLines.push(line)
            editor.cameraGeneratingPositionAndLook[objectUUid].Line = line;
            firstObjectUUid = null;
            secondObjectUUid = null;
        }*/

    /* function drawLineCamera ( firstPointUuid , secondPointUuid ,callback){

         editor.selectByUuid(firstPointUuid);
         var firstPoint = editor.selected.position;
         editor.selected.matrixAutoUpdate = false
         editor.selectByUuid(secondPointUuid);
         var secondPoint = editor.selected.position;
         editor.selected.matrixAutoUpdate = false
         callback(firstPoint,secondPoint,firstPointUuid);           
     }*/


    /*Modeied for draw line B/w to point End*/

    //MODIFIED TO TAKE VIEWPORT SNAPSHOT START
    function render() {

        if( editor.cubeAxisHelper ){

            editor.cubeAxisHelper.update();

        }

        //original start
        sceneHelpers.updateMatrixWorld();
        scene.updateMatrixWorld();

        if (editor.takeViewportSnapShot) {

            renderer.render(scene, camera);
            sceneImage = renderer.domElement.toDataURL();
            editor.takeViewportSnapShot = false;
            editor.signals.viewportSnapshotTaken.dispatch(sceneImage);

        }
        else {

            renderer.render(scene, camera);

        }
        //Modified to take snapshot when digital zoom is active
        if (editor.takeViewprtSnpshtWhnCamPaused) {
            
            renderer.render(scene, camera);
            sceneImage = renderer.domElement.toDataURL();
            editor.takeViewprtSnpshtWhnCamPaused = false;
            editor.signals.vwprtSnpshtTakenWhenCamPaused.dispatch(sceneImage);

        }

        if (renderer instanceof THREE.RaytracingRenderer === false) {

            renderer.render(sceneHelpers, camera);

        }
        //original end

    }
    //MODIFIED TO TAKE VIEWPORT SNAPSHOT END

    /*   
    Function to create table for Reference Point to show details
    */

    function createRefCamTable ( refPoint ){

        var selectedRefPoint;
        selectedRefPoint = refPoint;
        var camUUID =  selectedRefPoint.camerauuid;
        var cam = editor.scene.getObjectByProperty( 'uuid', camUUID );
        var camNum = cam.badgeText;
        cameraRefDetail = new UI.MobileWindow( "cam__ref__mobilewindow__" + selectedRefPoint.uuid );                    
 
        cameraRefDetail.setStyle( ['position'], ['absolute'] );
        cameraRefDetail.setStyle( ['left'], [ TableLeftShift + 'px'] );
        cameraRefDetail.setStyle( ['width'], ['auto'] );
        cameraRefDetail.setStyle( ['z-index'], ['1'] );
        cameraRefDetail.setStyle( ['top'], ['211px'] );
        TableLeftShift = TableLeftShift + 20;

        refCamTable = new HtmlTable( "ref__cam__table" );
        var refCamTableWindowBody = document.createElement( 'div' );
        refCamTableWindowBody.setAttribute( 'id', 'table__window__body' );
        refCamTableWindowBody.setAttribute( 'class', 'table-responsive' );
        refCamTableWindowBody.appendChild( refCamTable.table );
        cameraRefDetail.setBody( refCamTableWindowBody );
        cameraRefDetail.setHeading( "Camera Details " + camNum );
        cameraRefDetail.show();
        
        cameraRefDetail.headerCloseBtn.addEventListener( 'click', function( event ){

            selectedRefPoint.userData.checkDetailsFlag = "hidden";

        } ); 

        cameraRefDetail.dom.addEventListener( 'click', function( event ){

            editor.select( selectedRefPoint );
            bringWindowToFront( selectedRefPoint );

        } );

        var bringWindowToFront = function( referencePoint ){

            editor.scene.traverse( function( child ){

                if( child instanceof THREE.Sprite && child.camerauuid ){

                    if( ( child.userData.checkDetailsFlag === "set" ) ){

                        var detailsTable = document.querySelector( '#cam__ref__mobilewindow__' + child.uuid );
                        detailsTable.style.zIndex = 1;

                    }

                }

            } );

            var clickedTable = document.querySelector( '#cam__ref__mobilewindow__' + referencePoint.uuid );
            clickedTable.style.zIndex = 2;

        }
                
        var camRefBody = document.createElement( 'tbody' );
        var camRefHeader = ['Label','Distance','Actual-Camera-Position','Abs-Height','Abs-Distance'];
        refCamTable.setHeadersFromArray( camRefHeader );
        
        document.querySelector( "#editorElement" ).appendChild( cameraRefDetail.dom );
        cameraRefDetail.setDraggable();
        selectedRefPoint.userData.checkDetailsFlag = 'set';

        var camUUID = selectedRefPoint.camerauuid;
        var camPos = editor.getObjectByUuid( camUUID );
        camPos.then( function( value ) {

            var camPosition = value.position.clone();
            var refPosition = selectedRefPoint.position.clone();
            var relCamPos = new THREE.Vector3();
            relCamPos.x = ( ( camPosition.x - refPosition.x ) * editor.commonMeasurements.targetConversionFactor );
            relCamPos.y = ( ( camPosition.y - refPosition.y ) * editor.commonMeasurements.targetConversionFactor );
            relCamPos.z = ( ( camPosition.z - refPosition.z ) * editor.commonMeasurements.targetConversionFactor);
            var refName = 'Cam Ref ' + camNum;
            var dis, absHeight, absDistance;

            if( selectedRefPoint.userData.refCamDistance != undefined && selectedRefPoint.userData.refCamDistance != null ){

                dis = selectedRefPoint.userData.refCamDistance;
                absHeight = selectedRefPoint.userData.absHeight;
                absDistance = selectedRefPoint.userData.absDistance;

            }
            else{

                dis = ( refPosition.distanceTo( camPosition ) * editor.commonMeasurements.targetConversionFactor ).toFixed(1);

                //Modified to include absolute height and absolute distance start
                var absHeight = Math.abs((( camPosition.y - refPosition.y )* editor.commonMeasurements.targetConversionFactor ).toFixed(1));
                var absDistance = math.abs((( camPosition.x - refPosition.x )* editor.commonMeasurements.targetConversionFactor ).toFixed(1));
                //Modified to include absolute height and absolute distance end

                if( editor.commonMeasurements.targetUnit === "meter" ){

                    dis = dis + " m";
                    absHeight = absHeight + " m";
                    absDistance = absDistance + " m";

                } 
                else if(  editor.commonMeasurements.targetUnit === "feet"  ) {

                    dis = dis + " ft";
                    absHeight = absHeight + " ft";
                    absDistance = absDistance + " ft";

                }

            }

            var tableRow = document.createElement( 'tr' );
            tableRow.id = selectedRefPoint.uuid + '__row';
            var tableValueLabel = document.createElement( 'td' );
            tableValueLabel.contentEditable = true;
            tableValueLabel.setAttribute( 'class', 'editable__table__cell' );
            tableValueLabel.id = selectedRefPoint.uuid + '__row__label';
            tableValueLabel.style.maxWidth = "100px";
            
            if( ( selectedRefPoint.userData.labelName != undefined ) && ( selectedRefPoint.userData.labelName != null ) ){

                tableValueLabel.innerHTML = selectedRefPoint.userData.labelName;

            }

            tableValueLabel.addEventListener( 'keydown', function( event ){

                if( event.keyCode === 13 ){
                    event.preventDefault();
                }
                
            } ); 

            tableValueLabel.addEventListener( 'blur', function( event ){

                event.preventDefault();
                var editedText = event.target.innerHTML;
                var oldText = selectedRefPoint.userData.labelName;
                var cam = editor.scene.getObjectByProperty( 'uuid', selectedRefPoint.camerauuid );

                if( ( editedText === '' ) || ( editedText.length > 15 ) ){

                    if( oldText != undefined ){

                        toastr.error( "Enter a valid name within 15 characters" );
                        event.target.innerHTML = oldText;

                    }

                }
                else if( editedText != undefined && ( editedText != oldText ) && ( editedText.length < 15 ) ){

                    selectedRefPoint.userData.labelName = editedText;
                    cam.userData.refName = editedText;

                }

            } );

            var tableValueDis = document.createElement( 'td' );
            tableValueDis.id = selectedRefPoint.uuid + '__row__dis';
            tableValueDis.innerHTML = dis;

            //Modified to include absolute height and distance start
            var tableAbsHeight = document.createElement( 'td' );
            tableAbsHeight.id = selectedRefPoint.uuid + '__row__abs__height';
            tableAbsHeight.innerHTML = absHeight;

            var tableAbsDistance = document.createElement( 'td' );
            tableAbsDistance.id = selectedRefPoint.uuid + '__row__abs__distance';
            tableAbsDistance.innerHTML = absDistance;
            //Modified to include absolute height and distance end

            var tableValuePos = document.createElement( 'td' );
            tableValuePos.id = selectedRefPoint.uuid + '__row__pos';
            var labelX = document.createElement( 'label' );
            labelX.innerHTML ="<b>" + "X :" + "</b>";
            var labelY = document.createElement( 'label' );
            labelY.innerHTML = "<b>" + "Y :" + "</b>";
            var labelZ = document.createElement( 'label' );
            labelZ.innerHTML = "<b>" + "Z :" + "</b>";
            var labelSpace = document.createElement( 'label' );
            labelSpace.innerHTML = " ";
            var valueX = document.createElement( 'input' );
            var valueY = document.createElement( 'input' );
            var valueZ = document.createElement( 'input' );

            valueX.setAttribute( 'value',relCamPos.x.toFixed(2) );
            valueX.setAttribute( 'class', 'editable__table__input' );
            valueX.setAttribute( 'size', '2' );
            valueX.setAttribute( 'id', selectedRefPoint.uuid + '__valueX' );
            valueY.setAttribute( 'value',relCamPos.y.toFixed(2) );
            valueY.setAttribute( 'class', 'editable__table__input' );
            valueY.setAttribute( 'size', '2' );
            valueY.setAttribute( 'id', selectedRefPoint.uuid + '__valueY' );
            valueZ.setAttribute( 'value',relCamPos.z.toFixed(2) );
            valueZ.setAttribute( 'class', 'editable__table__input' );
            valueZ.setAttribute( 'size', '2' );
            valueZ.setAttribute( 'id', selectedRefPoint.uuid + '__valueZ' );

            valueX.addEventListener( 'blur', function( event ){

                event.preventDefault();
                var editedValueX = event.target.value;
                var camId = selectedRefPoint.camerauuid;
                var cam = editor.scene.getObjectByProperty( 'uuid',camId );
                var camPos = cam.position.clone();
                var refPstn = selectedRefPoint.position.clone();
                var oldValueX = ( ( camPos.x - refPstn.x ) * editor.commonMeasurements.targetConversionFactor );

                if( event.target.value === "" || isNaN( event.target.value ) ){

                    toastr.info( editor.languageData.Enteranintegerbw );
                    event.target.value = oldValueX.toFixed(2);

                }
                else if( ( editedValueX != undefined ) && ( editedValueX != oldValueX ) ){

                    //cam.position.x = Number( editedValueX ) + selectedRefPoint.position.x;
                    var newPosition = new THREE.Vector3();
                    newPosition.copy( cam.position.clone() );
                    newPosition.setX( Number( editedValueX / editor.commonMeasurements.targetConversionFactor ) + selectedRefPoint.position.x );

                    editor.execute( new SetPositionCommand( cam, newPosition ) );

                    var camPosition = cam.position.clone();
                    var changedDis = ( refPstn.distanceTo( camPosition ) * editor.commonMeasurements.targetConversionFactor ).toFixed(1);

                    //Modified to include absolute height and absolute distance start
                    var absHeight = Math.abs((( camPosition.y - refPstn.y )* editor.commonMeasurements.targetConversionFactor ).toFixed(1));
                    var absDistance = Math.abs((( camPosition.x - refPstn.x )* editor.commonMeasurements.targetConversionFactor ).toFixed(1));
                    //Modified to include absolute height and absolute distance end

                    var refDist;
                    if( editor.commonMeasurements.targetUnit === "meter" ){

                        refDist = changedDis + " m";
                        absHeight = absHeight + " m";
                    	absDistance = absDistance + " m";

                    } 
                    else if(  editor.commonMeasurements.targetUnit === "feet"  ){

                        refDist = changedDis + " ft";
                        absHeight = absHeight + " ft";
                    	absDistance = absDistance + " ft";

                    } 

                    var changedDis = document.getElementById( selectedRefPoint.uuid + '__row__dis' );
                    var changedAbsHeight = document.getElementById( selectedRefPoint.uuid + '__row__abs__height' );
                    var changedAbsDistance = document.getElementById( selectedRefPoint.uuid + '__row__abs__distance' );

                    changedDis.innerHTML = refDist;
                    changedAbsHeight.innerHTML = absHeight;
                    changedAbsDistance.innerHTML = absDistance;

                    selectedRefPoint.userData.refCamDistance = refDist;
                    selectedRefPoint.userData.absHeight = absHeight;
                    selectedRefPoint.userData.absDistance = absDistance;

                    if( selectedRefPoint.userData.checkLOSFlag === "set" ){

                        var lineuuid = selectedRefPoint.userData.lineUUID;
                        var line = editor.scene.getObjectByProperty( 'uuid', lineuuid );
                        var lineProcessed = processRefCamLineEndPoints( line, refPstn, camPosition, refDist );
                        editor.signals.sceneGraphChanged.dispatch();          
                        editor.deselect();
                        editor.select( selectedRefPoint );

                    }

                    editor.signals.sceneGraphChanged.dispatch();          
                    editor.deselect();
                    editor.select( selectedRefPoint );

                }

            } );

            valueY.addEventListener( 'blur', function( event ){

                event.preventDefault();
                var editedValueY = event.target.value;

                var camId = selectedRefPoint.camerauuid;
                var cam = editor.scene.getObjectByProperty( 'uuid',camId );
                var camPos = cam.position.clone();
                var refPstn = selectedRefPoint.position.clone();
                var oldValueY = ( ( camPos.y - refPstn.y ) * editor.commonMeasurements.targetConversionFactor );

                if( event.target.value === "" || isNaN( event.target.value ) ){

                    toastr.info( editor.languageData.Enteranintegerbw );
                    event.target.value = oldValueY.toFixed(2);

                }
                else if( ( editedValueY != undefined ) && ( editedValueY != oldValueY ) ){

                    //cam.position.y = Number( editedValueY ) + selectedRefPoint.position.y;

                    var newPosition = new THREE.Vector3();
                    newPosition.copy( cam.position.clone() );
                    newPosition.setY( Number( editedValueY / editor.commonMeasurements.targetConversionFactor ) + selectedRefPoint.position.y );

                    editor.execute( new SetPositionCommand( cam, newPosition ) );

                    var camPosition = cam.position.clone();
                    
                    var refPstn = selectedRefPoint.position.clone();
                    var changedDis = ( ( refPstn.distanceTo( camPosition ) )* editor.commonMeasurements.targetConversionFactor).toFixed(1);

                    //Modified to include absolute height and absolute distance start
                    var absHeight = Math.abs((( camPosition.y - refPstn.y )* editor.commonMeasurements.targetConversionFactor ).toFixed(1));
                    var absDistance = Math.abs((( camPosition.x - refPstn.x )* editor.commonMeasurements.targetConversionFactor ).toFixed(1));
                    //Modified to include absolute height and absolute distance end

                    var refDist;
                    if( editor.commonMeasurements.targetUnit === "meter" ){

                        refDist = changedDis + " m";
                        absHeight = absHeight + " m";
                    	absDistance = absDistance + " m";

                    } 
                    else if(  editor.commonMeasurements.targetUnit === "feet"  ){

                        refDist = changedDis + " ft";
                        absHeight = absHeight + " ft";
                    	absDistance = absDistance + " ft";

                    } 
                    var changedDis = document.getElementById( selectedRefPoint.uuid + '__row__dis' );
                    var changedAbsHeight = document.getElementById( selectedRefPoint.uuid + '__row__abs__height' );
                    var changedAbsDistance = document.getElementById( selectedRefPoint.uuid + '__row__abs__distance' );

                    changedDis.innerHTML = refDist;
                    changedAbsHeight.innerHTML = absHeight;
                    changedAbsDistance.innerHTML = absDistance;

                    selectedRefPoint.userData.refCamDistance = refDist;
                    selectedRefPoint.userData.absHeight = absHeight;
                    selectedRefPoint.userData.absDistance = absDistance;

                    if( selectedRefPoint.userData.checkLOSFlag === "set" ){

                        var lineuuid = selectedRefPoint.userData.lineUUID;
                        var refPointline = editor.scene.getObjectByProperty( 'uuid', lineuuid );
                        var lineProcessed = processRefCamLineEndPoints( refPointline, refPstn, camPosition, refDist );
                        editor.signals.sceneGraphChanged.dispatch();          
                        editor.deselect();
                        editor.select( selectedRefPoint );

                    }

                    editor.signals.sceneGraphChanged.dispatch();          
                    editor.deselect();
                    editor.select( selectedRefPoint );

                }

            } );

            valueZ.addEventListener( 'blur', function( event ){

                event.preventDefault();
                var editedValueZ = event.target.value;

                var camId = selectedRefPoint.camerauuid;
                var cam = editor.scene.getObjectByProperty( 'uuid',camId );
                var camPos = cam.position.clone();
                var refPstn = selectedRefPoint.position.clone();
                var oldValueZ = ( camPos.z - refPstn.z ) * editor.commonMeasurements.targetConversionFactor;

                if( event.target.value === "" || isNaN( event.target.value ) ){

                    toastr.info( editor.languageData.Enteranintegerbw );
                    event.target.value = oldValueZ.toFixed(2);

                }
                else if( ( editedValueZ != undefined ) && ( editedValueZ != oldValueZ ) ){

                    //cam.position.z = Number( editedValueZ ) + selectedRefPoint.position.z;

                    var newPosition = new THREE.Vector3();
                    newPosition.copy( cam.position.clone() );
                    newPosition.setZ( Number( editedValueZ  / editor.commonMeasurements.targetConversionFactor ) + selectedRefPoint.position.z );

                    editor.execute( new SetPositionCommand( cam, newPosition ) );

                    var camPosition = cam.position.clone();
                    
                    var refPstn = selectedRefPoint.position.clone();
                    var changedDis = ( ( refPstn.distanceTo( camPosition ) )* editor.commonMeasurements.targetConversionFactor ).toFixed(1);

                    //Modified to include absolute height and absolute distance start
                    var absHeight = Math.abs((( camPosition.y - refPstn.y )* editor.commonMeasurements.targetConversionFactor ).toFixed(1));
                    var absDistance = Math.abs((( camPosition.x - refPstn.x )* editor.commonMeasurements.targetConversionFactor ).toFixed(1));
                    //Modified to include absolute height and absolute distance end

                    var refDist;
                    if( editor.commonMeasurements.targetUnit === "meter" ){

                        refDist = changedDis + " m";
                        absHeight = absHeight + " m";
                    	absDistance = absDistance + " m";

                    } 
                    else if(  editor.commonMeasurements.targetUnit === "feet"  ){

                        refDist = changedDis + " ft";
                        absHeight = absHeight + " ft";
                    	absDistance = absDistance + " ft";

                    } 

                    selectedRefPoint.userData.refCamDistance = refDist;
                    selectedRefPoint.userData.absHeight = absHeight;
                    selectedRefPoint.userData.absDistance = absDistance;

                    var changedDis = document.getElementById( selectedRefPoint.uuid + '__row__dis' );
                    var changedAbsHeight = document.getElementById( selectedRefPoint.uuid + '__row__abs__height' );
                    var changedAbsDistance = document.getElementById( selectedRefPoint.uuid + '__row__abs__distance' );

                    changedDis.innerHTML = refDist;
                    changedAbsHeight.innerHTML = absHeight;
                    changedAbsDistance.innerHTML = absDistance;

                    if( selectedRefPoint.userData.checkLOSFlag === "set" ){

                        var lineuuid = selectedRefPoint.userData.lineUUID;
                        var refPointline = editor.scene.getObjectByProperty( 'uuid',lineuuid );
                        var lineProcessed = processRefCamLineEndPoints( refPointline, refPstn, camPosition, refDist );
                        editor.signals.sceneGraphChanged.dispatch();          
                        editor.deselect();
                        editor.select( selectedRefPoint );

                    }

                    editor.signals.sceneGraphChanged.dispatch();          
                    editor.deselect();
                    editor.select( selectedRefPoint );

                }

            } );

            tableValuePos.appendChild( labelX );
            tableValuePos.appendChild( valueX );
            tableValuePos.appendChild( labelY );
            tableValuePos.appendChild( valueY );
            tableValuePos.appendChild( labelZ );
            tableValuePos.appendChild( valueZ );
            tableRow.appendChild( tableValueLabel );
            tableRow.appendChild( tableValueDis );
            tableRow.appendChild( tableValuePos );
            tableRow.appendChild( tableAbsHeight );
            tableRow.appendChild( tableAbsDistance );
            camRefBody.appendChild( tableRow );

        });   

        refCamTable.setBody( camRefBody );
       
    }

    /*
    
    Function to update line w.r.t the movement of Reference Point or Camera

    */

    function processRefCamLineEndPoints( line, refPos, camPos, badgeLabelText ){

        //line.geometry.vertices[0].copy( refPos );
        //line.geometry.vertices[1].copy( camPos );
        //line.geometry.verticesNeedUpdate = true;

        //Modified to change line attributes for buffer geometry start
        if( ( refPos instanceof THREE.Vector3 ) && ( camPos instanceof THREE.Vector3 ) ){
            
            line.geometry.dispose();
            var newArray = new Float32Array( [refPos.x, refPos.y, refPos.z, camPos.x, camPos.y, camPos.z] );
            line.geometry.attributes.position.setArray( newArray );
            line.geometry.attributes.position.needsUpdate = true;

        } else{

            console.warn( "%csetEndPoints( start, end ) : \'start\' and \'end\' should be instance of THREE.Vector3", "color: yellow; font-style: italic; background-color: blue; padding: 2px" );
            return;

        }
        
        //Modified to change line attributes for buffer geometry end

        var badgeTexture = editor.commonMeasurements.getNumberBadge( { badgeText : badgeLabelText, badgeWidth : 105, badgeHeight : 35, fontSize : "16px", fontColor : "#0f590b", strokeColor : "#0f590b", borderRadius : 8, type : "image" } );
    
        var midPoint = new THREE.Vector3( ( refPos.x + camPos.x )/2, ( refPos.y + camPos.y )/2, ( refPos.z + camPos.z )/2  );
        
        line.traverse( function( child ){

            if( child instanceof THREE.Sprite && child.name === "RefCamLineValueBadge" ){

                child.material.map = badgeTexture;
                child.position.copy( midPoint );

            }

        } );

        return line;

    }

    /*
    
    Signal to draw line-of-sight between Reference Point and Camera

    */

    editor.signals.addReferencePointLine.add( function( selectedReferecePoint ){

        var refPoint = selectedReferecePoint.position.clone();
        var camPosition;
        var camUUID = selectedReferecePoint.camerauuid;
        var refPointName = selectedReferecePoint.userData.refPointName;
        var camNum = refPointName.slice( 14 );
        var refCam = editor.scene.getObjectByProperty( 'uuid', camUUID );
        //var material = new THREE.LineBasicMaterial( { color: 0xffff00 } );
        //var geometry = new THREE.Geometry();

        if( !refCam.visible ){

            toastr.error( editor.languageData.UnhidecameratodrawLineOfSight );
            return;

        }

        camPosition = refCam.position.clone();
        //geometry.vertices.push( refPoint );
        //geometry.vertices.push( camPosition );
        //var line = new THREE.Line( geometry, material );

         //Modified to draw Reference point Line-of-Sight using Buffer Geometry start

        var material = new THREE.LineBasicMaterial( { 
            color: 0xffff00,
            linewidth: 1,
            depthTest : true,
            depthWrite : true,
            side : THREE.DoubleSide
        } );
        
        var geometry = new THREE.BufferGeometry();
        var verticesArray = new Float32Array( [refPoint.x, refPoint.y, refPoint.z, camPosition.x, camPosition.y, camPosition.z] );
        geometry.addAttribute( 'position', new THREE.BufferAttribute( verticesArray, 3 ) );
        geometry.setDrawRange( 0, 2 );
        geometry.attributes.position.needsUpdate = true;
        var line = new THREE.Line( geometry, material );

        //Modified to draw Reference point Line-of-Sight using Buffer Geometry end

        line.name = "RefPointCameraLOS" + camNum;
        line.matrixAutoUpdate = false;
        editor.execute( new AddObjectCommand( line ) );
        editor.deselect();
        line.userData.refPoint = selectedReferecePoint.uuid;

        var currDistance = ( ( refPoint.distanceTo( camPosition ) ) * editor.commonMeasurements.targetConversionFactor ).toFixed(1);

        var badgeLabelText;
        if( editor.commonMeasurements.targetUnit === "meter" ) badgeLabelText = currDistance + " m";
        else if(  editor.commonMeasurements.targetUnit === "feet"  ) badgeLabelText = currDistance + " ft";

        var curMeasurementBadge = editor.commonMeasurements.getNumberBadge( { badgeText : badgeLabelText, badgeWidth : 105, badgeHeight : 35, fontSize : "16px", fontColor : "#0f590b", strokeColor : "#0f590b", borderRadius : 8 } );

        curMeasurementBadge.position.copy( new THREE.Vector3( ( refPoint.x + camPosition.x ) / 2, ( refPoint.y + camPosition.y ) / 2, ( refPoint.z + camPosition.z ) / 2 ) );
        editor.refCamBadge.push( curMeasurementBadge );
        curMeasurementBadge.name = "RefCamLineValueBadge";

        if( editor.isFloorplanViewActive === true ){

            editor.scaleBadgeFloorPlanView( curMeasurementBadge );

        }
        else {

            editor.scaleBadgesThreeDView( curMeasurementBadge );

        }

        line.add( curMeasurementBadge ); 

        editor.signals.sceneGraphChanged.dispatch();
        selectedReferecePoint.userData.lineUUID = line.uuid;
        refCam.userData.lineUUID = line.uuid;
        refCam.userData.refUUID = selectedReferecePoint.uuid;
        selectedReferecePoint.userData.refCamDistance = badgeLabelText;
        selectedReferecePoint.userData.checkLOSFlag = 'set';

    } );


    //Signal to re-configure Ref-Cam measurement start
    editor.signals.measurementConfigurationChanged.add( function( baseUnit, convFactor, targetUnit ){

		editor.commonMeasurements.setBaseUnit( baseUnit, convFactor );
        editor.commonMeasurements.setTargetUnit( targetUnit );

        editor.signals.reConfigurePreviousMeasurements.dispatch();

        keys = Object.keys( editor.routingWithHeight );
        keys.forEach( function( child ){
            editor.routingWithHeight[child].hide();
        } )

    } ); 
    //Signal to re-configure Ref-Cam measurement end

    //Signal to re-calculate earlier measurements when it is changed
    editor.signals.reConfigurePreviousMeasurements.add( function(){

        editor.scene.traverse( function( child ){

            if( child != null && child!= undefined && child instanceof THREE.Sprite && child.camerauuid ){

                if( ( child.userData.checkLOSFlag && child.userData.checkDetailsFlag ) && ( child.userData.checkLOSFlag === "set" || child.userData.checkDetailsFlag === "set" ) ){

                    var refLine = editor.scene.getObjectByProperty( 'uuid', child.userData.lineUUID );
                    var relatedCamera = editor.scene.getObjectByProperty( 'uuid', child.camerauuid );
                    var refPointPosition = child.position.clone();
                    var camPosition = relatedCamera.position.clone();
                    var newDistance = ( ( camPosition.distanceTo( refPointPosition ) ) * editor.commonMeasurements.targetConversionFactor ).toFixed(1);

                    //Modified to include absolute height and absolute distance start
                    var absHeight = Math.abs((( camPosition.y - refPointPosition.y )* editor.commonMeasurements.targetConversionFactor ).toFixed(1));
                    var absDistance = Math.abs((( camPosition.x - refPointPosition.x )* editor.commonMeasurements.targetConversionFactor ).toFixed(1));
                    //Modified to include absolute height and absolute distance end
                    relatedCamera.userData.absHeight = absHeight;
                    relatedCamera.userData.absDistance = absDistance;

                    var badgeLabelText;
                    if( editor.commonMeasurements.targetUnit === "meter" ){

                        badgeLabelText = newDistance + " m";
                        absHeight = absHeight + " m";
                    	absDistance = absDistance + " m";

                    } 
                    else if(  editor.commonMeasurements.targetUnit === "feet"  ){

                        badgeLabelText = newDistance + " ft";
                        absHeight = absHeight + " ft";
                    	absDistance = absDistance + " ft";

                    } 
                    child.userData.refCamDistance = badgeLabelText;

                    if( child.userData.checkLOSFlag === 'set' ){

                        var processedLine = processRefCamLineEndPoints( refLine, refPointPosition, camPosition, badgeLabelText );

                    }
                    
                    if( child.userData.checkDetailsFlag === 'set' ){

                        /*
                        var changedDis = document.getElementById( child.uuid + '__row__dis' );
                        var changedAbsHeight = document.getElementById( child.uuid + '__row__abs__height' );
                        var changedAbsDistance = document.getElementById( child.uuid + '__row__abs__distance' );

                        changedDis.innerHTML = badgeLabelText;
                        changedAbsHeight.innerHTML = absHeight;
                        changedAbsDistance.innerHTML = absDistance; */
                        var relPoint = new THREE.Vector3();
                        relPoint.x = camPosition.x - refPointPosition.x;
                        relPoint.y = camPosition.y - refPointPosition.y;
                        relPoint.z = camPosition.z - refPointPosition.z;

                        var data = {

                            dis: badgeLabelText,
                            changedPos: relPoint,
                            refuuid: child.uuid,
                            absoluteHeight: absHeight,
                            absoluteDistance: absDistance
            
                        }

                        editor.signals.refCamAttributesChanged.dispatch( data );

                    } 

                }

            } else if( child instanceof THREE.Group && child.name === "MeasurementSession" ){

                child.traverse( function( subChild ){

                    if( subChild instanceof THREE.Line && subChild.name === "MeasurementConnectionLine" ){

                        var currentline = subChild.uuid;
                        if( editor.scene.userData.measurementDatas != null && editor.scene.userData.measurementDatas != undefined ){

                            if( editor.scene.userData.measurementDatas[ currentline ]!= undefined && editor.scene.userData.measurementDatas[ currentline ]!= null ){

                                var lineDetails = editor.scene.userData.measurementDatas[ currentline ];
                                var startPoint = new THREE.Vector3( lineDetails.start.x, lineDetails.start.y, lineDetails.start.z );
                                var endPoint = new THREE.Vector3( lineDetails.end.x, lineDetails.end.y, lineDetails.end.z );
                                var newDistance = ( startPoint.distanceTo( endPoint ) * editor.commonMeasurements.targetConversionFactor ).toFixed( 1 );
                                var distance = ( startPoint.distanceTo( endPoint )* editor.commonMeasurements.targetConversionFactor ).toFixed( 1 );
                                var elevation = ( lineDetails.start.y * editor.commonMeasurements.targetConversionFactor ).toFixed( 1 );

                                var badgeLabelText;
                                if( editor.commonMeasurements.targetUnit === "meter" ) badgeLabelText = newDistance + " m";
                                else if(  editor.commonMeasurements.targetUnit === "feet"  ) badgeLabelText = newDistance + " ft";

                                lineDetails.badgeLabel = badgeLabelText;
                                lineDetails.unit = editor.lengthMeasurement.measurementControls.targetUnit;
                                lineDetails.measurement = distance;
                                lineDetails.elevation = elevation;

                                var badgeTexture = editor.lengthMeasurement.measurementControls.getNumberBadge( { "badgeText" : badgeLabelText, "badgeWidth" : 55, "badgeHeight" : 55, "fontSize" : "16px", "fontColor" : "#0f590b", "strokeColor" : "#0f590b", "borderRadius" : 8, "type" : "image" } );

                                subChild.traverse( function( subElement ){

                                    if( subElement instanceof THREE.Sprite && subElement.name == "MeasureValueBadge" ){

                                        subElement.material.map = badgeTexture;
                                        subElement.material.needsUpdate = true;

                                    }

                                } );

                                if( editor.lengthShowHideToggle === true ){

                                    editor.signals.measurementEdited.dispatch(subChild, {
                                        start: startPoint,
                                        end: endPoint,
                                        badgeLabel: badgeLabelText,
                                        unit: editor.commonMeasurements.targetUnit,
                                        measurement: distance,
                                        elevation: elevation,                                    updateTable: true
                                    });

                                }

                                editor.signals.sceneGraphChanged.dispatch();

                            }

                        }

                    }

                } );

            } else if( child instanceof THREE.Group && child.name === "AreaMeasurementSession" ){

                child.traverse( function( subChild ){

                    if( subChild instanceof THREE.Line && subChild.name === "AreaSelectionRectangle" ){

                        if( editor.scene.userData.areaMeasurementDatas[ subChild.uuid ] != null && editor.scene.userData.areaMeasurementDatas[ subChild.uuid ] != undefined ){

                            var areaDetails = editor.scene.userData.areaMeasurementDatas[ subChild.uuid ];
                            var vertexArray = editor.float32ToVerticesArray ( subChild.geometry.attributes.position.array );
                            var area = editor.commonMeasurements.getQuadPointsArea( vertexArray ).toFixed(1);

                            var badgeText = area + ( ( editor.commonMeasurements.targetUnit == "feet" ) ? " sqft" : " sqm" );

                            var badgeTexture = editor.lengthMeasurement.measurementControls.getNumberBadge( { badgeText : badgeText, badgeWidth : 105, badgeHeight : 35, fontSize : "16px", fontColor : "#0f590b", strokeColor : "#0f590b", borderRadius : 8, type : "image" } );
                            
                            areaDetails.badgeLabel = badgeText;
                            areaDetails.area = area;
                            areaDetails.unit = ( ( editor.commonMeasurements.targetUnit == "feet" ) ? " square foot" : " square meter" );
                            subChild.traverse( function( subElement ){

                                if( subElement instanceof THREE.Sprite && subElement.name === "AreaMeasureValueBadge" ){

                                    subElement.material.map = badgeTexture;
                                    subElement.material.needsUpdate = true;

                                }

                            } );

                            editor.signals.sceneGraphChanged.dispatch();

                            if( editor.areaShowHideToggle === true ){

                                editor.signals.areaMeasurementEdited.dispatch( subChild, { badgeLabel :  badgeText, area : area, unit : ( ( editor.commonMeasurements.targetUnit == "feet" ) ? " square foot" : " square meter" ), updateTable : true } );

                            }

                        }

                    }

                } );

            } else if( child instanceof THREE.Group && child.name === "NetworkCablingSession" ){

                child.traverse( function( subChild ){
                    
                    if( subChild instanceof THREE.Mesh && subChild.name === "NetworkingCable" ){
                        
                        if( editor.scene.userData.cableDatas[ subChild.uuid ] != null && editor.scene.userData.cableDatas[ subChild.uuid ] != undefined ){

                            var networkLineDetails = editor.scene.userData.cableDatas[ subChild.uuid ];
                            var newLength = editor.commonMeasurements.getCableLength( subChild, 30 );

                            var newbadgeLabelText = newLength.length + ( ( editor.commonMeasurements.targetUnit === "meter" ) ? "m" : "ft" );

                            var badgeTexture = editor.networking.networkDesigner.getNumberBadge( { badgeText: newbadgeLabelText, badgeWidth: 125, badgeHeight: 35, fontSize: "16px", fontColor: this.badgeFontColor, strokeColor: this.badgeStrokeColor, borderRadius: 8, type: "image" } );
                            
                            subChild.traverse( function( subElement ){

                                if( subElement instanceof THREE.Sprite && subElement.name === "NetworkCableLengthBadge" ){

                                    subElement.material.map = badgeTexture;
                                    subElement.material.needsUpdate = true;

                                }

                                networkLineDetails.length = newLength.length; 
                                networkLineDetailsunit = editor.commonMeasurements.targetUnit;
                                editor.signals.sceneGraphChanged.dispatch();
                                
                                if( editor.nwShowHideToggle === true ){

                                    editor.signals.networkDataEdited.dispatch( subChild, { length : newLength.length, unit : editor.commonMeasurements.targetUnit, updateTable : true } );

                                }

                            } );

                        }

                    }
                    else if( subChild instanceof THREE.Sprite && subChild.name === "AutoRoutedCableLengthBadge" ){

                        var badgeLabelText = editor.scene.userData.cableDatas[subChild.parent.uuid ][ 'length' ] + ( (editor.commonMeasurements.targetUnit === "meter" ) ? "m" : "ft" );
                        if( badgeLabelText != undefined ){
                            
                            //var badgeTexture = scope.networkDesigner.getNumberBadge( { badgeText : badgeLabelText, badgeWidth : 125, badgeHeight : 35, fontSize : "16px", fontColor : this.badgeFontColor, strokeColor : this.badgeStrokeColor, borderRadius : 8, type : "image" } );
                            var badgeTexture = editor.commonMeasurements.getNumberBadgeTransparent( { badgeText : badgeLabelText, badgeWidth : 100, badgeHeight : 35, fontSize : "20px", fontColor : editor.autoRouting.autoRoutingDesigner.badgeFontColor, strokeColor : editor.autoRouting.autoRoutingDesigner.strokeColor, borderRadius : 8, type : "image" } );
    
                            subChild.material.map = badgeTexture;
                            
                            editor.nwBadges.push( subChild );
    
                        }
                    }

                } );

            } else if( child instanceof THREE.Group && child.name === "TwoDMeasurementSession" ) {

                child.traverse( function( subChild ) {

                    if( subChild.type == "Line" && subChild.name === "2DMeasurement" ) {

                        if( editor.scene.userData.twoDDrawingDatas[subChild.uuid] != null && editor.scene.userData.twoDDrawingDatas[subChild.uuid] != undefined) {

                            var lineSegments = Object.keys(editor.scene.userData.twoDDrawingDatas[subChild.uuid]).length;
                            //var TwoDDrawingTable = document.getElementById("twoD__measurement__table" + subChild.uuid);
                            var TwoDDrawingTable = document.getElementById("twoD__measurement__table");
                            for( i=1;i<=lineSegments;i++) {

                                var currentLineDatas = editor.scene.userData.twoDDrawingDatas[subChild.uuid][i];
                                var newDistance = ( (currentLineDatas.threeDDistance)*editor.commonMeasurements.targetConversionFactor).toFixed(1);
                                var newBadgeLabelText = newDistance + ( ( editor.commonMeasurements.targetUnit === "meter" ) ? "m" : "ft" );
                                editor.scene.userData.twoDDrawingDatas[subChild.uuid][i].distance = newBadgeLabelText;
                                editor.scene.userData.twoDDrawingDatas[subChild.uuid][i].unit = editor.commonMeasurements.targetUnit;

                                subChild.traverse( function( badgeElement ) {

                                    if( badgeElement instanceof THREE.Sprite && badgeElement.name === "TwoDMeasurementBadge") {
    
                                        if( badgeElement.userData.lineID === subChild.uuid && badgeElement.userData.lineNumber == i ) {

                                            var badgeTexture = editor.commonMeasurements.getNumberBadgeTransparent( { "badgeText" : newBadgeLabelText, "badgeWidth" : 105, "badgeHeight" : 35, "fontSize" : "16px", "fontColor" : "#FF0000", "strokeColor" : "#0f590b", "borderRadius" : 8, "type" : "image" } );
                                            badgeElement.material.map = badgeTexture;
                                            badgeElement.material.needsUpdate = true;

                                        }

                                    }

                                });

                                if( TwoDDrawingTable!= null && TwoDDrawingTable!= undefined ) {

                                    var tableDistanceRow = document.getElementById( subChild.uuid + '__row__dis ' + i );
                                    tableDistanceRow.innerHTML = newBadgeLabelText;

                                    var tableUnitRow = document.getElementById( subChild.uuid + '__row__unit ' + i );
                                    tableUnitRow.innerHTML = editor.commonMeasurements.targetUnit;

                                }

                            }

                        }

                    }

                });

            }
            
        } );

        var selectedObject = editor.selected;
        if( selectedObject!= null ){

            editor.translationControls.updateUI();

        }

        editor.signals.sceneGraphChanged.dispatch();

    } );

    //Signal to place a Reference Point to newly added camera start

    editor.signals.addReferencePoint.add( function( selectedCamera ){

        toastr.clear();
        toastr.info('<div>'+editor.languageData.Doyouneedtoaddreferencepoint+ ' ' + selectedCamera.badgeText  + '</div><div><button type="button" id="ref-accept-' + selectedCamera.uuid + '" class="btn btn-success" style="margin-right:1px">'+ editor.languageData.Yes+'</button><button type="button" id="ref-reject" class="btn btn-danger" style="margin-left:1px">'+ editor.languageData.No +'</button></div>');

        document.getElementById( 'ref-accept-' + selectedCamera.uuid ).addEventListener( 'click', function(){

            var buttonId = document.getElementById( 'ref-accept-' + selectedCamera.uuid ).id;
            var camUUID = buttonId.substr( 11, 36 );
            var cam = editor.scene.getObjectByProperty( 'uuid', camUUID);

            if( cam!=  null && cam!= undefined ){

                editor.select( cam );

            }

            if( editor.selected instanceof THREE.PerspectiveCamera  ){

                document.querySelector( '#refPointButton' ).click(); 
                /*
                toastr.info('<div>'+editor.languageData.Doyouneedtochangerefpointpos+ ' ' + selectedCamera.badgeText + '</div><div><button type="button" id="ref-change-' + cam.uuid + '" class="btn btn-success" style="margin-right:1px">' + editor.languageData.Yes + '</button><button type="button" id="ref-pos-no-change" class="btn btn-danger" style="margin-left:1px">'+ editor.languageData.No + '</button></div>');   
                
                document.getElementById( 'ref-change-' + selectedCamera.uuid ).addEventListener( 'click', function(){

                    processRePositioningRefPt( camUUID );
        
                } ); */

            }

        } );

    } );

    //Signal to place a Reference Point to newly added camera end

    //Function which helps to process data for re-Positioning Ref point
    editor.signals.processRePositioningRefPt.add( function( camUUID ){

        var startNetworkingLi = document.getElementById( 'start-networking-li' );

        if( editor.isntwrkngStarted === true ){
            
            var startNetworkingLi = document.getElementById( 'start-networking-li' );
            if( startNetworkingLi ) startNetworkingLi.click();

        }

        if( editor.isCableEditingEnabled === true ){

            var editNetworkCablesLi = document.getElementById( 'edit-networking-li' );
            editNetworkCablesLi.click();

        }

        if( editor.enableDisableToggle === true ){

            var enableLengthMeasurementBtn = document.getElementById( 'enable-measure-mode-li' );
            if( enableLengthMeasurementBtn ) enableLengthMeasurementBtn.click();
            
        }

        if( editor.areaEnableDisableToggle === true ){
            
            var enableAreaMeasurementBtn = document.getElementById( 'area-enable-measure-mode-li' );
            if( enableAreaMeasurementBtn ) enableAreaMeasurementBtn.click();

        }

        if( editor.isTwoDMeasurementEnabled === true ) {

            var enableTwoDMeasurements = document.getElementById('twod-enable-measure-mode-li');
            enableTwoDMeasurements.click();

        }

        if( editor.twoDDrawingsShowHideToggle === true ) {

            var showHideTwoDMeasurements = document.getElementById('twod-show-measurements-li');
            showHideTwoDMeasurements.click();

        }

        var Refcamera = editor.scene.getObjectByProperty( 'uuid', camUUID);
        var refUUID = Refcamera.userData.objectUuid;
        var refPoint = editor.scene.getObjectByProperty( 'uuid', refUUID);
        toastr.clear();
        if( editor.rePositionRefpoint === true ){

            editor.rePositionRefpoint = false;
            editor.currentRefpoint = '';
            toastr.error( editor.languageData.RepositioningfeatureofpreviousReferencePointisdisabled );

            var movingSphere = editor.scene.getObjectByProperty( 'name','RefPointCursor' );
            if( movingSphere ){

                editor.scene.remove( movingSphere );	

            }
            scope.rePositionCursor = '';

        }

        toastr.success( editor.languageData.Doubleclicktorepositionreferencepoint );
        editor.rePositionRefpoint = true; 
        editor.currentRefpoint = refPoint;

        scope.rePositionCursor = '';
        var markerGeo = new THREE.SphereGeometry( 0.04, 8, 6 );
        var markerMat = new THREE.MeshStandardMaterial( { color: 0x76f441 } );
        scope.rePositionCursor = new THREE.Mesh( markerGeo, markerMat );
        scope.rePositionCursor.name = "RefPointCursor";
        editor.scene.add( scope.rePositionCursor );

    } );
    /*
    function processRePositioningRefPt( camUUID ){


    }*/

    /*
    
    Function to create a modal to select a camera to be placed at the right clicked position

    */

    function createCameraModal(){

        var camBrandName = [];
        var cameraBrandCount = 0;
        var sortedBrands = [];
        var allCameras = [];
        var modalContent = document.createElement( 'div' );
        modalContent.className = "col-md-2";
        modalContent.id = "camera-list";
        modalUI = document.createElement( 'ui' );
        modalUI.className = "list list-group";

        var brandList = document.createElement( 'div' );
        brandList.className = "col1 col-sm-12 col-md-3";
        brandList.id = "brand-list";
        brandList.style.display = "none";
        var brandUi = document.createElement('ul');
        brandUi.className = " list list-group";

        var camerasInClickedBrand = document.createElement( 'div' );
        camerasInClickedBrand.className = "col1 col-sm-12 col-md-3";
        camerasInClickedBrand.id = "cameras-in-selected-brand";
        var camerasInClickedBrandUi = document.createElement('ul');
        camerasInClickedBrandUi.className = " list list-group";
        camerasInClickedBrandUi.id = "cameras-in-selected-brand-ul";

        var sensorSelection = document.createElement( 'div' );
        sensorSelection.className = "col1 col-sm-12 col-md-3";
        sensorSelection.id = "select-sensor-list";
        var sensorSelectionUI = document.createElement('ul');
        sensorSelectionUI.className = "list list-group";
        sensorSelectionUI.id = "select-sensor-ui";
        sensorSelection.style.display = "none";
        sensorSelectionLi = document.createElement( 'li' );
        sensorSelectionLi.id = "sensor-lidar-select";
        sensorSelectionLi.className = "list-group-item"; 
        sensorSelectionLi.innerHTML = "Lidar-Sensor";
        sensorSelectionLi.onclick = function(){

            clearModalContent();
            camToEditor.addLidarCamera();
            brandList.style.display = 'none';
            camerasInClickedBrand.style.display = 'none';
            var newCamLength = editor.sceneCameras.length;
            var newCam = editor.sceneCameras[ newCamLength-1 ];
            newCam.position.copy( editor.cameraPosition );
            editor.cameraPosition = '';
            editor.signals.sceneGraphChanged.dispatch(); 
            hideModal(); 

        }

        sensorSelectionUI.appendChild( sensorSelectionLi );
        sensorSelection.appendChild( sensorSelectionUI );
        
        modalLiCustomCam = document.createElement( 'li' );
        modalLiCustomCam.id = "custom-camera";
        modalLiCustomCam.className = "list-group-item"; 
        modalLiCustomCam.innerHTML = "Select a Camera";
        modalLiCustomCam.onclick = function(){

            if( brandList.style.display === 'none' ){

                clearModalContent();
                modalLiCustomCam.classList.add( 'list-clicked' );
                editor.allCameraDetails.forEach( function( customCameras ){

                    if (!camBrandName.includes(customCameras.manufacturer)) {
    
                        camBrandName[cameraBrandCount] = customCameras.manufacturer;
                        cameraBrandCount++;
    
                    }

                    var currentCam = document.createElement('li');
                    currentCam.className = " list-group-item";
                    currentCam.id = customCameras.manufacturer + 'place_cam' + customCameras.model;
                    currentCam.innerHTML = customCameras.model;
                    currentCam.style.display = "none";
                    currentCam.onclick = function(){


                        var selectedCameraDetails = [customCameras.children[0].horizontal_aov, customCameras.children[0].min_horizontal_aov, customCameras.model, customCameras.manufacturer, customCameras.image_url, customCameras.form_factor,customCameras.children[0].def_fov,customCameras.children[0].zoom_optical,customCameras.children[0].zoom_digital, customCameras.children[0].resolutionWidth, customCameras.children[0].resolutionHeight,customCameras.children[0].max_vertical_aov,customCameras.children[0].min_vertical_aov];
                        //var selectedCameraDetails = [customCameras.children[0].min_aov, customCameras.children[0].far, customCameras.children[0].min_focal, customCameras.model, customCameras.manufacturer, customCameras.image_url, customCameras.form_factor,customCameras.children[0].def_fov,customCameras.children[0].zoom_optical,customCameras.children[0].zoom_digital];

                        data =  {

                            "selectedcam": selectedCameraDetails,
                            "fullcamData": customCameras

                        };

                        camToEditor.addSelectPerspectiveCamera( data );
                        clearModalContent();
                        hideModal();

                        var CamLength = editor.sceneCameras.length;
                        var currentlyPlacedCam = editor.sceneCameras[ CamLength-1 ];
                        currentlyPlacedCam.position.copy( editor.cameraPosition );
                        editor.cameraPosition = '';
                        editor.signals.sceneGraphChanged.dispatch(); 
                        
                    }

                    allCameras.push( currentCam );
                    camerasInClickedBrandUi.appendChild( currentCam );

                });

                sortedBrands = camBrandName.sort();
                sortedBrands.forEach( function( brand ){

                    var brandLi = document.createElement('li');
                    brandLi.className = " list-group-item";
                    brandLi.id = 'place_cam' + brand;
                    brandLi.innerHTML = brand;
                    brandLi.onclick = function(){

                        var lateClickedBrand = document.getElementsByClassName( 'list-clicked' );
                        for( i=0;i<lateClickedBrand.length;i++ ){

                            if( lateClickedBrand[i].id != 'custom-camera' ){

                                lateClickedBrand[i].classList.remove( 'list-clicked' );
                                
                            }

                        }

                        brandLi.classList.add( 'list-clicked' );
                        camerasInClickedBrand.style.display = "block";
                        var currentBrandID =  brandLi.id;
                        var currentBrandName = currentBrandID.substring( 9 );

                        editor.allCameras.forEach( function( currentCam ){

                            if( currentBrandName == currentCam.manufacturer ){

                                var currentCamLi = document.getElementById( currentBrandName + 'place_cam' + currentCam.model );
                                currentCamLi.style.display = 'block';

                            }
                            else{

                                var otherBrands = currentCam.manufacturer;
                                var currentCamLi = document.getElementById( otherBrands + 'place_cam' + currentCam.model );
                                currentCamLi.style.display = 'none';

                            }

                        } );

                    }
                    brandUi.appendChild(brandLi);

                } );
                brandList.style.display = 'block';

            }
            else{

                modalLiCustomCam.classList.remove( 'list-clicked' );
                clearModalContent();

            }
                
        }
        camerasInClickedBrand.appendChild( camerasInClickedBrandUi );

        modalLiDefaultCam = document.createElement( 'li' );
        modalLiDefaultCam.id = "default-camera";
        modalLiDefaultCam.className = "list-group-item"; 
        modalLiDefaultCam.innerHTML = "Default-Camera";
        modalLiDefaultCam.onclick = function(){

            clearModalContent();
            camToEditor.addPerspectiveCamera();
            var CamLength = editor.sceneCameras.length;
            var defaultCam = editor.sceneCameras[ CamLength-1 ];
            defaultCam.position.copy( editor.cameraPosition );
            editor.cameraPosition = '';
            editor.signals.sceneGraphChanged.dispatch(); 
            hideModal(); 

        }
        modalUI.appendChild( modalLiDefaultCam );

        modalLiLastCam = document.createElement( 'li' );
        modalLiLastCam.id = "last-camera";
        modalLiLastCam.className = "list-group-item"; 
        modalLiLastCam.innerHTML = "Last used Camera";

        modalLiLastCam.onclick = function(){

            clearModalContent();
            var camlength = editor.sceneCameras.length;

            if( camlength != '0' && camlength!= undefined ){

                var lastCam = editor.sceneCameras[ camlength-1 ];
                
                if( lastCam.camCategory == "LiDAR" ){

                    camToEditor.addLidarCamera();
                    var newCamLength = editor.sceneCameras.length;
                    var newCam = editor.sceneCameras[ newCamLength-1 ];
                    newCam.position.copy( editor.cameraPosition );
                    editor.cameraPosition = '';
                    editor.signals.sceneGraphChanged.dispatch(); 
                    hideModal(); 

                }
                else{

                    //cloneCamera( lastCam );
                    editor.signals.cloneCamera.dispatch( lastCam );
                    var newCamLength = editor.sceneCameras.length;
                    var newCam = editor.sceneCameras[ newCamLength-1 ];
                    newCam.position.copy( editor.cameraPosition );
                    editor.cameraPosition = '';
                    editor.signals.sceneGraphChanged.dispatch(); 
                    hideModal();

                } 

            }
            else{

                toastr.info( editor.languageData.NocamerainEditor );

            } 

        }
        modalUI.appendChild( modalLiLastCam );
        modalUI.appendChild( modalLiCustomCam );

        modalLiLidarSensor = document.createElement( 'li' );
        modalLiLidarSensor.id = "place-lidar-sensor";
        modalLiLidarSensor.className = "list-group-item"; 
        modalLiLidarSensor.innerHTML = "Select a Sensor";
        modalLiLidarSensor.onclick = function(){

             if( sensorSelection.style.display === "block" ){

                clearModalContent();
                sensorSelection.style.display = "none";

             }
             else{

                clearModalContent();
                modalLiLidarSensor.classList.add( 'list-clicked' );
                sensorSelection.style.display = "block";

             }

        }
        
        modalUI.appendChild( modalLiLidarSensor );
        modalContent.appendChild( modalUI );
        brandList.appendChild( brandUi );
        
        var selectCamModal = document.createElement( 'div' );
        selectCamModal.appendChild( modalContent );
        selectCamModal.appendChild( sensorSelection );
        selectCamModal.appendChild( brandList );
        selectCamModal.appendChild( camerasInClickedBrand );

        var placeCameraModel = new UI.bootstrapModal("", "place-camera-model", editor.languageData.ChooseCamera , selectCamModal, "Open", editor.languageData.Cancel, "place-camera-form");
        placeCameraModel.hideFooterSuccessButton();
        placeCameraModel.setWidth(90);
        placeCameraModel.setModalBodyStyle('height:400px');
        placeCameraModel.setModalBodyStyle('overflow: scroll');

        document.getElementById('editorElement').appendChild(placeCameraModel.dom);
        
        var closeXButton = placeCameraModel.dom.getElementsByClassName( 'close' );
        var closeButton = placeCameraModel.dom.getElementsByClassName( 'btn-danger' );

        closeButton[0].addEventListener( 'click', function(){

            clearModalContent();

        } );

        closeXButton[0].addEventListener( 'click', function(){

            clearModalContent();

        }); 

        function hideModal(){

            placeCameraModel.hide();

        } 

        function clearModalContent(){

            if( brandList && brandList.style.display == 'block' ){

                brandList.style.display = 'none';
                modalLiCustomCam.classList.remove( 'list-clicked' );

            }
            if( camerasInClickedBrand && camerasInClickedBrand.style.display == 'block' ){

                camerasInClickedBrand.style.display = 'none';

            }
            if( sensorSelection && sensorSelection.style.display == 'block' ){

                sensorSelection.style.display = 'none';

            }
            
            modalLiLidarSensor.classList.remove( 'list-clicked' );

            while( camerasInClickedBrandUi.hasChildNodes() ){

                camerasInClickedBrandUi.removeChild( camerasInClickedBrandUi.firstChild );

            }

            while( brandUi.hasChildNodes() ){

                brandUi.removeChild( brandUi.firstChild );

            }
            camBrandName = [];
            allCameras = [];
            sortedBrands = [];

        }

        return placeCameraModel;

    }

    editor.signals.cameraControlsChanged.add(function( data ){

        let pan = document.querySelector( "#panControlLabelValue" + data.timestamp );
        let roll = document.querySelector( "#rollControlLabelValue" + data.timestamp );
        let tilt = document.querySelector( "#tiltControlLabelValue" + data.timestamp );
        
        if( data != undefined && pan != (undefined || null ) && roll != (undefined || null ) && tilt != (undefined || null ) ){

                document.querySelector( "#panControlLabelValue" + data.timestamp).innerHTML = data.panRotationValue + "&deg;";
                document.querySelector( "#rollControlLabelValue" + data.timestamp).innerHTML = data.rollRotationValue + "&deg;";
                document.querySelector( "#tiltControlLabelValue" + data.timestamp).innerHTML = data.tiltRotationValue + "&deg;";
        }   
     })


    /*
    
    Function to clone a selected camera
    
    */
    editor.signals.cloneCamera.add( function( selectedCamera ){

        if( editor.theatreMode ){
            toastr.warning( editor.languageData.PleaseDisableTheatreMode );
            return;
        }

        var cameraWithPerson = false
        
        selectedCamera.traverse( function( child ){
            if( child && child.userData && child.userData.modelType === "not-a-base-model" )
                cameraWithPerson = true
        } );

        if( cameraWithPerson ){
            toastr.warning( editor.languageData.UnlockPersonOrLuggageAndRetry );
            return;
        }  

            var clonedCam = selectedCamera.clone();  
            var camPosition = selectedCamera.position.clone();
            clonedCam.iconUrl = selectedCamera.iconUrl;
            
            if( selectedCamera.camCategory == "PTZ" ){
				editor.execute( new SetRotationCommand( clonedCam, new THREE.Euler( 0, 0, 0 ) ) );
            }
            else if( selectedCamera.camCategory == "Dome" ){
				editor.execute( new SetRotationCommand( clonedCam, new THREE.Euler( -1.57, 0, 0 ) ) );
            }
            else if( selectedCamera.camCategory == "LiDAR" && selectedCamera.sensorCategory === "Hitachi LFOM5" ){

				editor.execute( new SetRotationCommand( clonedCam, new THREE.Euler( THREE.Math.degToRad(-45), 0, 0 ) ) );
            }
            
            var is3DModelCam = false;
            selectedCamera.traverse( function( child ){
                if( child.name == "threeDCameraModel" ){
                    var icon = clonedCam.getObjectByName( 'threeDCameraModel' );
                    clonedCam.remove( icon ); 
                    is3DModelCam = true;
                }
            } );
            if( !is3DModelCam ){

                var icon = clonedCam.getObjectByName( 'cameraHelperIcon' );
                clonedCam.remove( icon );                 
            }
            var frustm = clonedCam.getObjectByName( 'CameraFrustum' );
            if( frustm ){
                clonedCam.remove( frustm ); 
            }
            var panFrustm = clonedCam.getObjectByName( 'PanoramaFrustum' );
            if( panFrustm ){
                clonedCam.remove( panFrustm ); 
            }
                            
            clonedCamModel = clonedCam.userData.cameraModel;
            clonedCamBrand = clonedCam.userData.cameraBrand;
            clonedCam.position.x = camPosition.x + 5;
            var cameraCount = 0;

            if( clonedCam.userData.objectUuid != "notset" ){

                clonedCam.userData.objectUuid = "notset";

            }

            if( clonedCam.userData.refUUID != null ){

                delete clonedCam.userData.refUUID;

            }
            
            if( clonedCam.userData.lineUUID ){

                delete clonedCam.userData.lineUUID;

            }

            if( selectedCamera.camCategory && selectedCamera.camCategory != null && selectedCamera.camCategory != undefined ){

                clonedCam.camCategory = selectedCamera.camCategory;

            }
            
            if( selectedCamera.isCameraLite ){
                clonedCam.isCameraLite = selectedCamera.isCameraLite;
            }
            

            if( selectedCamera.defFov && selectedCamera.defFov != null && selectedCamera.defFov != undefined ){

                clonedCam.defFov = selectedCamera.defFov;

            }

            if( selectedCamera.digitalZoom && selectedCamera.digitalZoom != null && selectedCamera.digitalZoom != undefined ){

                clonedCam.digitalZoom = selectedCamera.digitalZoom;

            }

            if( selectedCamera.opticalZoom && selectedCamera.opticalZoom != null && selectedCamera.opticalZoom != undefined ){

                clonedCam.opticalZoom = selectedCamera.opticalZoom;

            }
            if( (selectedCamera.distance || selectedCamera.distance == 0) && selectedCamera.distance != null && selectedCamera.distance != undefined ){

                clonedCam.distance = selectedCamera.distance;

            }
            if( selectedCamera.resolutionWidth && selectedCamera.resolutionWidth != null && selectedCamera.resolutionWidth != undefined ){

                clonedCam.resolutionWidth = selectedCamera.resolutionWidth;

            }
            if( selectedCamera.resolutionHeight && selectedCamera.resolutionHeight != null && selectedCamera.resolutionHeight != undefined ){

                clonedCam.resolutionHeight = selectedCamera.resolutionHeight;

            }
            if( selectedCamera.hFOV && selectedCamera.hFOV != null && selectedCamera.hFOV != undefined ){

                clonedCam.hFOV = selectedCamera.hFOV;

            }
            if( selectedCamera.minHorizontalAOV && selectedCamera.minHorizontalAOV != null && selectedCamera.minHorizontalAOV != undefined ){

                clonedCam.minHorizontalAOV = selectedCamera.minHorizontalAOV;

            }
            if( (selectedCamera.hView || selectedCamera.hView == 0) && selectedCamera.hView != null && selectedCamera.hView != undefined ){

                clonedCam.hView = selectedCamera.hView;

            }
            if( (selectedCamera.vView || selectedCamera.vView == 0) && selectedCamera.vView != null && selectedCamera.vView != undefined ){

                clonedCam.vView = selectedCamera.vView;

            }
            if( selectedCamera.sensorCategory != undefined && selectedCamera.sensorCategory != null ){

                clonedCam.sensorCategory = selectedCamera.sensorCategory
            
            }
            var editorChildLength = editor.scene.children.length;

            for( var a =0 ;a< editorChildLength; a++ ){

                if( editor.scene.children[a].type == 'PerspectiveCamera' ){
            
                    cameraCount++;
                    
                }

            }

            var camera = clonedCam;
            
            if(editor.scene.userData.cameraDeletedNumber != undefined  ) {
                editor.cameraDeletedNumber = editor.scene.userData.cameraDeletedNumber.deletedCamArray;
            }
                
            if( editor.cameraDeletedNumber.length == 0){

                var tagName = editor.cameracount;
                tagName = tagName + 1;

                if( ( (/^(Camera(\d+))/g).test(camera.name) ) ) {

                    camera.name = 'Camera' + (tagName);

                }
                else if( (/^(PerspectiveCamera(\d+))/g).test(camera.name) ){

                    camera.name = 'PerspectiveCamera' + (tagName);

                }
                else
                {

                    camera.name = selectedCamera.name;

                }

                var syncCameraAddedCaseOne = new Promise (function( resolve,reject  ){

                    scope.cameradetails = {model: clonedCamModel, brand: clonedCamBrand, "threeDModelType": selectedCamera.userData.threeDModelType , "alignment" : selectedCamera.userData.alignment , "tiltRotationValue": selectedCamera.userData.tiltRotationValue, "panRotationValue": selectedCamera.userData.panRotationValue, "rollRotationValue": selectedCamera.userData.rollRotationValue };
                
                    camera.updateProjectionMatrix();
                    editor.execute( new AddObjectCommand( camera ) );
                    resolve();
                })
                syncCameraAddedCaseOne.then( function( ){
                    editor.signals.cameraAdded.dispatch(scope.cameradetails);
                    editor.camera_array.push(camera);
                } )
                

            }
             else{
        
                var lastIndex = editor.cameraDeletedNumber.length
                var value = editor.cameraDeletedNumber[lastIndex-1];

                if( ( (/^(Camera(\d+))/g).test(camera.name) ) ) {

                    camera.name = 'Camera' + (value);

                }
                else if( (/^(PerspectiveCamera(\d+))/g).test(camera.name) ){

                    camera.name = 'PerspectiveCamera' + (value);

                }
                else
                {

                    camera.name = selectedCamera.name;

                }


                 var syncCameraAddedCaseTwo = new Promise( function( resolve,reject ){

                    scope.cameradetails = {model: clonedCamModel, brand: clonedCamBrand, "threeDModelType": selectedCamera.userData.threeDModelType , "alignment" : selectedCamera.userData.alignment , "tiltRotationValue": selectedCamera.userData.tiltRotationValue, "panRotationValue": selectedCamera.userData.panRotationValue, "rollRotationValue": selectedCamera.userData.rollRotationValue };

                    camera.camCategory = clonedCam.camCategory;
                    editor.execute( new AddObjectCommand( camera ) );
                    resolve();

                   } );

                syncCameraAddedCaseTwo.then( function(){

                    editor.signals.cameraAdded.dispatch(scope.cameradetails);
                    editor.camera_array.push(camera);

                   } );
                
                    
            } 
            
            editor.signals.addReferencePoint.dispatch( camera );

            if( editor.isFloorplanViewActive === false ){
               
                editor.scaleCameraThreeDView( camera );

            } else if( editor.isFloorplanViewActive === true ){
                
                editor.scaleCameraOrthographicView( camera );

            }
            if( editor.hideAllFrustum ){
                
                clonedCam.traverse( function( children ){
                    if( children.name == 'CameraFrustum' ) {
                        children.visible = false;
                    } 
                } )
                editor.sceneHelpers.children[ editor.sceneHelpers.children.length -1 ].visible = false;
            }

        //}

    } );
    /*
    function cloneCamera( selectedCamera ){


    } */

    function createPositionWindow(){
        
        var windowBody = document.createElement( 'div' );
        windowBody.setAttribute( 'class', 'position-window-body' );
        var positionFields = document.createElement( 'div' );
        positionFields.setAttribute( 'class', ' text-center' );
		
        var xValue = document.createElement( 'button' );
        xValue.setAttribute( 'id', 'x-position-value' );
        xValue.setAttribute( 'class', 'x-pos-value btn btn-default' );
        xValue.innerHTML = '0.0';
        positionFields.appendChild( xValue );
		
		var yValue = document.createElement( 'button' );
        yValue.setAttribute( 'class', 'y-pos-value btn btn-default' );
        yValue.setAttribute( 'id', 'y-position-value' );
        yValue.innerHTML = '0.0';
        positionFields.appendChild( yValue );
			
	    var zValue = document.createElement( 'button' );
        zValue.setAttribute( 'class', 'z-pos-value btn btn-default' );
        zValue.setAttribute( 'id', 'z-position-value' );
        zValue.innerHTML = '0.0';
        positionFields.appendChild( zValue );

        var positionWindow = new UI.MobileWindow( 'position-mob-window' );

        var headerIconButton ={};
        headerIconButton.icon = 'fa fa-map-marker';
        headerIconButton.id = 'currentpositonFlag';
        headerIconButton.style = 'right:25px !important';

        positionWindow.setHeading( editor.languageData.CurrentPosition );

        positionWindow.setHeadingIcon( headerIconButton );
        positionWindow.headerIconBtn.addEventListener('click',(event)=>{

            positionWindow.dom.style.display = "none";
            var flagPoints = editor.contextPosition.point.clone();
            var x = flagPoints.x;
            var y = flagPoints.y;
            var z = flagPoints.z;
            var pos = new THREE.Vector3(Number(x),Number(y),Number(z));
            var spriteMap = new THREE.TextureLoader().load( "assets/img/flag.png" );
            var spriteMaterial = new THREE.SpriteMaterial( { map: spriteMap, color: 0xffffff } );
            var sprite = new THREE.Sprite( spriteMaterial );
            sprite.scale.set(3, 3, 3);   
            sprite.position.set(Number(x),Number(y),Number(z));       
            sprite.name = "CurrentLocationFlag"
            editor.execute(new AddObjectCommand(sprite));
            editor.signals.objectAdded.dispatch(sprite);
            editor.signals.sceneGraphChanged.dispatch();

        });

        var cameraPlaceOrPointofTntrst = document.createElement( 'div' );
        cameraPlaceOrPointofTntrst.setAttribute( 'class', 'btn-group-vertical' );

        var cameraPlaceButton = document.createElement( 'button' );
        cameraPlaceButton.setAttribute( 'class', "btn btn-sm btn-default" );
        cameraPlaceButton.setAttribute( 'style', "width:178px;" );
        cameraPlaceButton.innerHTML = '<span class="fa fa-camera pull-left"></span>' + '' + '<span> '+ editor.languageData.Placeacameraorsensor +' </span>';

        cameraPlaceButton.addEventListener( 'click', function(){

            editor.cameraPosition = editor.contextPosition.point.clone();
            positionWindow.dom.style.display = "none";
            camModal.show();

        } );

        var PointofInterestButton = document.createElement( 'button' );
        PointofInterestButton.setAttribute( 'class', "btn btn-sm btn-default" );
        PointofInterestButton.setAttribute( 'style', "width:178px;" );
        PointofInterestButton.innerHTML = '<span class="fa fa-map-pin pull-left" style="padding-left:2px;"></span>' + '' + '<span style="padding-right:14px"> ' + editor.languageData.AddPointofInterest + '</span>';

        PointofInterestButton.addEventListener( 'click',function(){

            PointofIntrestObject.show( editor.contextPosition );
            positionWindow.dom.style.display = "none";

        } );

        cameraPlaceOrPointofTntrst.appendChild( cameraPlaceButton );
        cameraPlaceOrPointofTntrst.appendChild( PointofInterestButton );

        windowBody.appendChild( positionFields );
        windowBody.appendChild( cameraPlaceOrPointofTntrst );
        positionWindow.setBody( windowBody );
        
        positionWindow.dom.style.minHeight = "60px";
        positionWindow.dom.style.width = "180px";
        positionWindow.dom.className += "  currentpostioninfo";
        document.getElementById( 'editorElement' ).appendChild( positionWindow.dom );
        $( '.currentpostioninfo' ).draggable( {
            containment: "parent"
        } );
        
        return windowBody;

    }

    editor.signals.updateReferenceLineOfSight.add( function( object ){

		var refPointPosition = object.position.clone();
		var referencePoint = object;
		var lineUUID = object.userData.lineUUID;
		var camUUID = object.camerauuid;
		var refCam = editor.scene.getObjectByProperty( 'uuid', camUUID );
		var refLine = editor.scene.getObjectByProperty( 'uuid', lineUUID );           
		var camPosition = refCam.position.clone();
		var Distance = ( ( refPointPosition.distanceTo( camPosition ) ) * editor.commonMeasurements.targetConversionFactor ).toFixed(1);

		//Modified to include absolute height and absolute distance start
		var absHeight = Math.abs((( camPosition.y - object.position.y )* editor.commonMeasurements.targetConversionFactor ).toFixed(1));
		var absDistance = Math.abs((( camPosition.x - object.position.x )* editor.commonMeasurements.targetConversionFactor ).toFixed(1));
        //Modified to include absolute height and absolute distance end
        refCam.userData.absHeight = absHeight;
        refCam.userData.absDistance = absDistance;

        //Modified to include reference point position in camera userdata start
        refCam.userData.reference = refPointPosition;
        //Modified to include referencepoint position in camera userdata end
        

		var badgeLabelText;
		if( editor.commonMeasurements.targetUnit === "meter" ) {

			badgeLabelText = Distance + " m";
			absHeight = absHeight + " m";
			absDistance = absDistance + " m";

		}
		else if(  editor.commonMeasurements.targetUnit === "feet"  ){

			badgeLabelText = Distance + " ft";
			absHeight = absHeight + " ft";
			absDistance = absDistance + " ft";

		} 

		if( referencePoint.userData.checkLOSFlag === 'set' ){

			var processedLine = processRefCamLineEndPoints( refLine, refPointPosition, camPosition, badgeLabelText );

		}

		var relPoint = new THREE.Vector3();
		relPoint.x = camPosition.x - refPointPosition.x;
		relPoint.y = camPosition.y - refPointPosition.y;
		relPoint.z = camPosition.z - refPointPosition.z;

		if( referencePoint.userData.checkDetailsFlag === 'set' ){

			var data = {

				dis: badgeLabelText,
				changedPos: relPoint,
				refuuid: referencePoint.uuid,
				absoluteHeight: absHeight,
				absoluteDistance: absDistance

			}

			editor.signals.refCamAttributesChanged.dispatch( data );

		}

		object.userData.refCamDistance = badgeLabelText;
		object.userData.absHeight = absHeight;
		object.userData.absDistance = absDistance;
		editor.signals.sceneGraphChanged.dispatch();

	} );

	editor.signals.updateCameraLineOfSight.add( function( object ){

		var camPosition = object.position.clone();
		lineUUID = object.userData.lineUUID;
		refUUID = object.userData.refUUID;
		refPoint = editor.scene.getObjectByProperty( 'uuid', refUUID );
		refLine = editor.scene.getObjectByProperty( 'uuid', lineUUID );
		var refPosition = refPoint.position.clone();                            
		var badgeLabelText;
		var Distance =( ( refPosition.distanceTo( camPosition ) )* editor.commonMeasurements.targetConversionFactor ).toFixed(1);

		//Modified to include absolute height and absolute distance start
		var absHeight = Math.abs((( camPosition.y - refPosition.y )* editor.commonMeasurements.targetConversionFactor ).toFixed(1));
		var absDistance = Math.abs((( camPosition.x - refPosition.x )* editor.commonMeasurements.targetConversionFactor ).toFixed(1));
        //Modified to include absolute height and absolute distance end
        object.userData.absHeight = absHeight;
		object.userData.absDistance = absDistance;

		if( editor.commonMeasurements.targetUnit === "meter" ) {

			badgeLabelText = Distance + " m";
			absHeight = absHeight + " m";
			absDistance = absDistance + " m";

		}
		else if(  editor.commonMeasurements.targetUnit === "feet"  ){
			
			badgeLabelText = Distance + " ft";
			absHeight = absHeight + " ft";
			absDistance = absDistance + " ft";

		} 

		if( refPoint.userData.checkLOSFlag === "set" ){

			var processedLine = processRefCamLineEndPoints( refLine, refPosition, camPosition, badgeLabelText );

		}

		var relPoint = new THREE.Vector3();
		relPoint.x = camPosition.x - refPosition.x;
		relPoint.y = camPosition.y - refPosition.y;
		relPoint.z = camPosition.z - refPosition.z;

		if( refPoint.userData.checkDetailsFlag === 'set' ){

			var data = {

				dis: badgeLabelText,
				changedPos: relPoint,
				refuuid: refPoint.uuid,
				absoluteHeight: absHeight,
				absoluteDistance: absDistance

			}

			editor.signals.refCamAttributesChanged.dispatch( data );

		}

		refPoint.userData.refCamDistance = badgeLabelText;
		refPoint.userData.absHeight = absHeight;
        refPoint.userData.absDistance = absDistance;
		editor.signals.sceneGraphChanged.dispatch();

    } );
    
    editor.signals.changeTwoDValues.add( function(startMarker, endMarker, twoDLine, badge, markerNumber, isLastVertex) {

        var curMeasurement = ( startMarker.distanceTo(endMarker) * editor.commonMeasurements.targetConversionFactor ).toFixed(1);

        if( editor.commonMeasurements.targetUnit === "meter" ) badgeLabelText = curMeasurement + " m";
        else if(  editor.commonMeasurements.targetUnit === "feet"  ) badgeLabelText = curMeasurement + " ft";

        var badgeTexture = editor.commonMeasurements.getNumberBadgeTransparent( { "badgeText" : badgeLabelText, "badgeWidth" : 105, "badgeHeight" : 35, "fontSize" : "16px", "fontColor" : "#FF0000", "strokeColor" : "#0f590b", "borderRadius" : 8, "type" : "image" } );
        badge.material.map = badgeTexture;
        badge.material.needsUpdate = true;

        //badge.position.copy( new THREE.Vector3( ( startMarker.x + endMarker.x )/2, ( startMarker.y + endMarker.y )/2, ( startMarker.z + endMarker.z )/2) );
        var xdiff = Math.abs(startMarker.x - endMarker.x);
        var zdiff = Math.abs(startMarker.z - endMarker.z);
                        
        if( zdiff > 1.5 ){
            
            badge.position.copy( new THREE.Vector3( ( ( (startMarker.x + endMarker.x)/2 ) + 1 ), ( (startMarker.y + endMarker.y)/2), ( ( startMarker.z + endMarker.z)/2 ) ) );
        }
        
        else if( xdiff > 1.5 ){
            
            badge.position.copy( new THREE.Vector3( ( (startMarker.x + endMarker.x)/2 ) , ( (startMarker.y + endMarker.y)/2), ( ( (startMarker.z + endMarker.z)/2 ) - 1  ) ) );
                
        }
        else{

            badge.position.copy( new THREE.Vector3( ( (startMarker.x + endMarker.x)/2 ), ( (startMarker.y + endMarker.y)/2), ( ( startMarker.z + endMarker.z)/2 ) ) );
            
        }

        if( isLastVertex == true ) {

            var distanceField = document.getElementById( twoDLine.uuid + '__row__dis ' + (markerNumber-1) );
            distanceField.innerHTML = badgeLabelText;
            editor.scene.userData.twoDDrawingDatas[twoDLine.uuid][(markerNumber-1)].distance = badgeLabelText;
            editor.scene.userData.twoDDrawingDatas[twoDLine.uuid][(markerNumber-1)].threeDDistance = ( startMarker.distanceTo(endMarker) ).toFixed(1);

        } else {

            var distanceField = document.getElementById( twoDLine.uuid + '__row__dis ' + markerNumber );
            distanceField.innerHTML = badgeLabelText;
            editor.scene.userData.twoDDrawingDatas[twoDLine.uuid][(markerNumber)].distance = badgeLabelText;
            editor.scene.userData.twoDDrawingDatas[twoDLine.uuid][(markerNumber)].threeDDistance = ( startMarker.distanceTo(endMarker) ).toFixed(1);

        }

        editor.signals.sceneGraphChanged.dispatch();

    } );

    return container;

};