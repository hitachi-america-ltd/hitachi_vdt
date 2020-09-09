/**
 * TwoDMeasurement( editor ) - Coordinates the operations of 2D Lines drawn with any number of points using TwoDMeasurementControls.
 * This class uses the TwoDMeasurementControls internally to perform the 2D measurement operations.

 * @constructor
 * @param {any} editor - The instance of the Editor which manages the overall objects and signals
 * @author Peeyush
 * @example <caption>Instanciation of this class is very much straight forward</caption>
 * var twoDMsrmt = new TwoDMeasurement( editor );
 */
var twoDMeasurement = function( editor ) {

    var scope = this;
    var viewport = document.getElementById( 'viewport' );
    var enableTwoDMeasurements = document.getElementById('twod-enable-measure-mode-li');
    var measureGrpDrpDwnBtn = document.getElementById( 'measure-group-dropdown-button' );
    var showHideTwoDMeasurements = document.getElementById('twod-show-measurements-li');
    var startNetworkingLi = document.getElementById( 'start-networking-li' );
    var showHideNetworkingLi = document.getElementById( 'show-hide-networking-li' );
    var editNetworkCablesLi = document.getElementById( 'edit-networking-li' );
    var enableMeasurementLi = document.getElementById( 'enable-measure-mode-li' );
    var enableAreaMeasurementLi = document.getElementById( 'area-enable-measure-mode-li' );
    var showAllMsrmntsLi = document.getElementById('show-all-measurements-li');

    this.initUI();

    this.twoDMeasurementControls = new TwoDMeasurementControls( { camera : editor.camera, areaOfScope : viewport, baseUnit : "meter", baseConversionFactor : 1 }, editor );

    this.twoDMeasurementTable = new UI.MobileWindow( "twoD__measurement__table" ); 
    document.querySelector( "#editorElement" ).appendChild( this.twoDMeasurementTable.dom );
    this.twoDMeasurementTable.setDraggable();

    this.twoDTable = new HtmlTable( "twoD__table" );

    var twoDTableBody = document.createElement( 'div' );
    twoDTableBody.setAttribute( 'id', 'twoD__measurement__table__body' );
    twoDTableBody.setAttribute( 'class', 'table-responsive' );
    twoDTableBody.appendChild( this.twoDTable.table );

    this.twoDMeasurementTable.setBody( twoDTableBody );
    this.twoDMeasurementTable.setHeading( editor.languageData.TwoDMeasurements );

    this.twoDMeasurementTable.hide();

    var tableBody = document.createElement( 'tbody' );
    var Headers = ['Label','Distance','Unit'];
    this.twoDTable.setHeadersFromArray( Headers );

    this.twoDTable.setBody( tableBody );

    if( enableTwoDMeasurements ) {

        enableTwoDMeasurements.addEventListener('click', function(event) {

            var child = editor.scene.children;

            if( editor.camLock == true ){
                toastr.warning( editor.languageData.DisableLockAndTryAgain );
                return;
            }

            if(editor.isTwoDMeasurementEnabled === false) {

                if(child.length > 2) {

                    if( editor.isMeasuring == true ){

						enableMeasurementLi.click();

					}
					if( editor.isAreaMeasuring == true ){
						
						enableAreaMeasurementLi.click();

					}
					if( editor.msrmntsShowHideToggle === true ){

						showAllMsrmntsLi.click();

					}
                    if( editor.isntwrkngStarted == true ) {

						startNetworkingLi.click();
	
					}

					if( editor.isCableEditingEnabled == true ) {

						editNetworkCablesLi.click();
	
					}
	
					if( editor.nwShowHideToggle == true ) {
	
						showHideNetworkingLi.click();
	
					}

					if( editor.theatreMode === true ){

						document.getElementById( 'theatre_button' ).click();

                    }
                    
                    if( editor.addSensorToScene ){

						editor.addSensorToScene = false;

					}

					if( editor.rePositionRefpoint === true ){

						editor.rePositionRefpoint = false;
						editor.currentRefpoint = '';
						toastr.error( editor.languageData.RepositioningofReferencePointisdisabled );

						var movingSphere = editor.scene.getObjectByProperty( 'name','RefPointCursor' );
            			if( movingSphere ){

							editor.scene.remove( movingSphere );	

						}

                    }

                    if( editor.isFloorplanViewActive === false || editor.type2dView != 1 ) {

                        var floorPlanTopview = document.getElementById('floorplan-top');
                        floorPlanTopview.click();
                        toastr.info( editor.languageData.twoDDrawingIsEnbaledOnlyInFloorPlanview );

                    }
                    
                    toastr.success( editor.languageData.twoDDrawingActivated );
                    enableTwoDMeasurements.innerHTML = '<a>' + editor.languageData.DisableTwoDMeasurement + "</a>";
                    enableTwoDMeasurements.className = "activated";
					measureGrpDrpDwnBtn.style.color = "#500080";
                    measureGrpDrpDwnBtn.innerHTML = '<span class="fa fa-object-group span-font-21 faa-pulse animated"></span>';
                    editor.isTwoDMeasuring = true;
                    editor.isTwoDMeasurementEnabled = true;
                    scope.twoDMeasurementControls.activate();

                    editor.scene.traverse( function( child ){

                        if( child instanceof THREE.Group && child.name == "TwoDMeasurementSession" ){

                            child.visible = true;
            
                        }
                        editor.signals.sceneGraphChanged.dispatch();
            
                    } );

                    var twoDTable = document.getElementById('twoD__measurement__table');
                    if( twoDTable && twoDTable.style.display == "none" && editor.scene.userData.twoDDrawingDatas && ( Object.keys(editor.scene.userData.twoDDrawingDatas ).length > 0 ) ) {

                        twoDTable.style.display = "block";

                    }

                } else {

                    toastr.warning(editor.languageData.ItappearsthatnoobjectshavebeenaddedtothesceneYoucantactivatetwoDmeasurementsonanemptyscene)

                }

            } else {

                enableTwoDMeasurements.innerHTML = "<a>" + editor.languageData.EnableTwoDMeasurement + "</a>";
                enableTwoDMeasurements.className = "deactivated";
                editor.isTwoDMeasuring = false;
                editor.isTwoDMeasurementEnabled = false;
                scope.twoDMeasurementControls.deActivate();

                if( editor.msrmntsShowHideToggle === false && editor.isAreaMeasuring === false && editor.isMeasuring === false && editor.isTwoDMeasurementEnabled == false && editor.twoDDrawingsShowHideToggle == false ){

					measureGrpDrpDwnBtn.style.color = "#000000";
					measureGrpDrpDwnBtn.innerHTML = '<span class="fa fa-object-group span-font-21"></span>';

                }
                
                if( editor.twoDDrawingsShowHideToggle === false ) {

                    editor.scene.traverse( function( child ){

						if( child instanceof THREE.Group && child.name == "TwoDMeasurementSession" ){

                            child.visible = false;
                            
                            var twoDTable = document.getElementById('twoD__measurement__table');
                            if( twoDTable.style.display == "block" ) 
                                twoDTable.style.display = "none";
                            
						}
			
                    } );
                    editor.deselect();
					editor.signals.sceneGraphChanged.dispatch();

                }

            }

        });

    }

    if( showHideTwoDMeasurements ) {

        showHideTwoDMeasurements.addEventListener( 'click', function( event ) {

            if( editor.isFloorplanViewActive === false || editor.type2dView != 1 ){

                toastr.warning(  editor.languageData.TwoDmeasurementfeaturesarecurrentlyavailableonlyon2Dtopview );
				return;

            }

            if( editor.twoDDrawingsShowHideToggle === false ){

                if( editor.scene.userData.twoDDrawingDatas != undefined && Object.keys( editor.scene.userData.twoDDrawingDatas ).length != 0 ){

                    if( editor.isntwrkngStarted == true ) {

						startNetworkingLi.click();
	
					}
	
					if( editor.nwShowHideToggle == true ) {
	
						showHideNetworkingLi.click();
	
                    }
                    
                    if( editor.isMeasuring == true ){

						enableMeasurementLi.click();

                    }
                    
					if( editor.isAreaMeasuring == true ){
						
						enableAreaMeasurementLi.click();

                    }
                    
					if( editor.msrmntsShowHideToggle === true ){

                        showAllMsrmntsLi.click();

                    }

					editor.scene.traverse( function( child ){

						if( child instanceof THREE.Group && child.name == "TwoDMeasurementSession" ){

                            child.visible = true;
                            /*
                            child.traverse( function( subChild ) {

                                if( subChild.type === "Line" && subChild.name === "2DMeasurement" ) {

                                    scope.showTwoDLine( subChild );

                                }

                            } );*/
			
						}
			
                    } );
                    
                    var twoDTable = document.getElementById('twoD__measurement__table');
                    twoDTable.style.display = "block";

                    editor.signals.sceneGraphChanged.dispatch();
                    
                    showHideTwoDMeasurements.innerHTML = "<a>" + editor.languageData.Hide2DDrawing + "</a>";
					showHideTwoDMeasurements.className = "activated";
					measureGrpDrpDwnBtn.style.color = "#500080";
					measureGrpDrpDwnBtn.innerHTML = '<span class="fa fa-object-group span-font-21 faa-pulse animated"></span>';
					editor.twoDDrawingsShowHideToggle = true;

                } else {

                    toastr.warning( editor.languageData.TwoDMeasurementsdatanotfound );

                }

            } else {

                if( editor.isTwoDMeasurementEnabled === false ){
					
					editor.scene.traverse( function( child ){

						if( child instanceof THREE.Group && child.name == "TwoDMeasurementSession" ){

                            child.visible = false;
			
						}
			
                    } );
                    var twoDTable = document.getElementById('twoD__measurement__table');
                    twoDTable.style.display = "none";

                }
                
                editor.signals.sceneGraphChanged.dispatch();

                showHideTwoDMeasurements.innerHTML = "<a>" + editor.languageData.ShowTwoDMeasurement + "</a>";
                showHideTwoDMeasurements.className = "deactivated";
                editor.twoDDrawingsShowHideToggle = false;

                if( editor.lengthShowHideToggle === false && editor.areaShowHideToggle === false && editor.isAreaMeasuring === false && editor.isMeasuring === false && editor.twoDDrawingsShowHideToggle == false && editor.isTwoDMeasurementEnabled == false){

					measureGrpDrpDwnBtn.style.color = "#000000";
					measureGrpDrpDwnBtn.innerHTML = '<span class="fa fa-object-group span-font-21"></span>';

				}

            }

        } );

    }

    editor.signals.objectRemoved.add( function(object) {
 
        if( object.name === "2DMeasurement" && object.type == "Line" ) {

            var lineElement = object;
            lineElement.traverse( function( subElement ) {

                if( subElement instanceof THREE.Sprite && subElement.name === "TwoDMeasurementBadge" ){

                    var childIndex = editor.twoDMeasureBadges.indexOf( subElement );
                    if( childIndex != -1 ){
                        
                        editor.twoDMeasureBadges.splice( childIndex, 1 );

                    }

                }else if(subElement instanceof THREE.Mesh && (/^TwoDMeasureMarker\d+/g).test(subElement.name)) {
                
                    var childIndex = editor.twoDMeasureMarkers.indexOf( subElement );
                    if( childIndex != -1 ){
                        
                        editor.twoDMeasureMarkers.splice( childIndex, 1 );
        
                    }
        
                }

            } );

            if( editor.scene.userData.twoDDrawingDatas[ object.uuid ] != undefined && editor.scene.userData.twoDDrawingDatas[ object.uuid ] !=  null ) {

                var subKeys = Object.keys(editor.scene.userData.twoDDrawingDatas[ object.uuid ]);
                
                for( i=0;i<subKeys.length;i++ ) {
                    
                    if(editor.scene.userData.twoDDrawingDatas[ object.uuid ][subKeys[i]]) {

                        var row = document.getElementById( object.uuid + '__row ' + subKeys[i] );
                        
                        if( row ) {

                            scope.twoDTable.removeRow( row );

                        }

                    }

                }

                //Modified to track deleted 2D Line Number
                var lineLabel = editor.scene.userData.twoDDrawingDatas[ object.uuid ][1].label;
                var lineNumber = lineLabel.substr(1);

                if( editor.scene.userData.twoDLineDeletedNumber == undefined || editor.scene.userData.twoDLineDeletedNumber == null ) {
                    
                    editor.scene.userData.twoDLineDeletedNumber = [];

                }
                editor.scene.userData.twoDLineDeletedNumber.push(Number(lineNumber));
                editor.scene.userData.twoDLineDeletedNumber.sort();

                delete editor.scene.userData.twoDDrawingDatas[ object.uuid ];

            }

        } else {
            
            object.traverse( function( subChild ) {

                if( subChild instanceof THREE.Group && subChild.name == "TwoDMeasurementSession" ) {

                    subChild.traverse( function( lineElement ) {

                        if( lineElement.type == "Line" && lineElement.name === "2DMeasurement" ) {

                            lineElement.traverse( function( subElement ) {
                        
                                if( subElement instanceof THREE.Sprite && subElement.name === "TwoDMeasurementBadge" ){
                                    
                                    var childIndex = editor.twoDMeasureBadges.indexOf( subElement );
                                    if( childIndex != -1 ){
                                        
                                        editor.twoDMeasureBadges.splice( childIndex, 1 );
        
                                    }
        
                                } else if(subElement instanceof THREE.Mesh && (/^TwoDMeasureMarker\d+/g).test(subElement.name)) {
                                    
                                    var childIndex = editor.twoDMeasureMarkers.indexOf( subElement );
                                    if( childIndex != -1 ){
                                        
                                        editor.twoDMeasureMarkers.splice( childIndex, 1 );
        
                                    }
        
                                }
        
                            } )

                            if( editor.scene.userData.twoDDrawingDatas[ lineElement.uuid ] != undefined && editor.scene.userData.twoDDrawingDatas[ lineElement.uuid ] !=  null ) {

                                var subKeys = Object.keys(editor.scene.userData.twoDDrawingDatas[ lineElement.uuid ]);
                
                                for( i=0;i<subKeys.length;i++ ) {
                
                                    if(editor.scene.userData.twoDDrawingDatas[ lineElement.uuid ][subKeys[i]]) {
                
                                        var row = document.getElementById( lineElement.uuid + '__row ' + subKeys[i] );
                                        
                                        if( row ) {
                
                                            scope.twoDTable.removeRow( row );
                
                                        }
                
                                    }
                
                                }
                
                                delete editor.scene.userData.twoDDrawingDatas[ lineElement.uuid ];
                
                            }

                        }

                    })

                }

            } )

        }

    } );

    editor.signals.newTwoDLineAdded.add( function( twoDLine, pointsPicked, needToSave ) {

        var subLines = pointsPicked - 2;
        var intermediateVertices = twoDLine.geometry.attributes.position.array;
        var tableRows = [];
        var labelFields = [];
        var temporaryLabels = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
        var deletedCounterUsed = false;
        var siblingNode;

        var lineNumber = Object.keys(editor.scene.userData.twoDDrawingDatas).length;

        //If 'needToSave' is set to true, then it is a recently added line and its details must be added in the userdata. If false, then the data is present in the userdata(used when opening a saved project) 
        if( needToSave == true ) {

            if( editor.scene.userData.twoDLineDeletedNumber && editor.scene.userData.twoDLineDeletedNumber.length > 0 ) {

                lineNumber = editor.scene.userData.twoDLineDeletedNumber[0];
                editor.scene.userData.twoDLineDeletedNumber.shift();
                deletedCounterUsed = true;

                var twoDLinesCount = Object.keys(editor.scene.userData.twoDDrawingDatas ).length;
                var twoDLineKeys = Object.keys(editor.scene.userData.twoDDrawingDatas );
                var lineNumbers = [];

                for(i=0;i<twoDLinesCount;i++) {

                    var key = twoDLineKeys[i];
                    var lineNum = editor.scene.userData.twoDDrawingDatas[key][1].label.substr(1);
                    lineNumbers.push(lineNum);

                }
                lineNumbers.push(lineNumber);
                lineNumbers.sort();

                var index = lineNumbers.indexOf(lineNumber);
                ++index;
                var siblingNodeNumber = lineNumbers[index];

                for(i=0;i<twoDLinesCount;i++) {

                    var key = twoDLineKeys[i];
                    var lineNum = editor.scene.userData.twoDDrawingDatas[key][1].label.substr(1);

                    if(siblingNodeNumber == lineNum) {

                        siblingNode = key;

                    }

                }
    
            } else if ( !lineNumber ) {
    
                lineNumber = 1;
    
            } else{
    
                lineNumber = lineNumber + 1;
    
            }   

        } else {

            lineNumber = editor.scene.userData.twoDDrawingDatas[twoDLine.uuid][1].label.substr(1);

        }

        for( var i=0;i<(subLines*3); i=i+3 ) {

            var badgeLabelText;
            var startMarker = new THREE.Vector3( intermediateVertices[i], intermediateVertices[i+1], intermediateVertices[i+2]);
            var endMarker = new THREE.Vector3( intermediateVertices[i+3], intermediateVertices[i+4], intermediateVertices[i+5]);
            var curMeasurement = ( startMarker.distanceTo(endMarker) * editor.commonMeasurements.targetConversionFactor ).toFixed(1);
            if( editor.commonMeasurements.targetUnit === "meter" ) badgeLabelText = curMeasurement + " m";
            else if(  editor.commonMeasurements.targetUnit === "feet"  ) badgeLabelText = curMeasurement + " ft";

            var rowValue = (1 + i/3);
            var labelAlphabet = rowValue - 1;
            if( labelAlphabet > 25 ) {

                labelAlphabet = labelAlphabet%26;

            }

            var tableRow = document.createElement( 'tr' );
            tableRow.id = twoDLine.uuid + '__row ' + rowValue;
            tableRows.push( tableRow );

            var tableValueLabel = document.createElement( 'td' );
            tableValueLabel.contentEditable = true;
            tableValueLabel.setAttribute( 'class', 'editable__table__cell' );
            tableValueLabel.id = twoDLine.uuid + '__row__label ' + rowValue;
            if( needToSave == true )
                tableValueLabel.innerHTML = temporaryLabels[ labelAlphabet ] + lineNumber;
            else
                {   
                    var oldName;
                    if( editor.scene.userData.twoDDrawingDatas[twoDLine.uuid][rowValue].editedLabel ){
                        oldName = editor.scene.userData.twoDDrawingDatas[twoDLine.uuid][rowValue].editedLabel;
                    }
                    else{
                        oldName = editor.scene.userData.twoDDrawingDatas[twoDLine.uuid][rowValue].label;
                    }
                    tableValueLabel.innerHTML = oldName;  
                }

            tableValueLabel.style.width = "100px";
            labelFields.push(tableValueLabel);

            var tableValueDis = document.createElement( 'td' );
            tableValueDis.id = twoDLine.uuid + '__row__dis ' + rowValue;
            tableValueDis.innerHTML = badgeLabelText;
            tableValueDis.style.width = "100px";

            var tableValueUnit = document.createElement( 'td' );
            tableValueUnit.id = twoDLine.uuid + '__row__unit ' + rowValue;
            tableValueUnit.innerHTML =  editor.commonMeasurements.targetUnit;
            tableValueUnit.style.width = "50px";

            tableRow.appendChild( tableValueLabel );
            tableRow.appendChild( tableValueDis );
            tableRow.appendChild( tableValueUnit );
            //tableBody.appendChild( tableRow );

            if( needToSave === true ) {

                var data = {};
                data.label = temporaryLabels[ labelAlphabet ] + lineNumber;
                data.distance = badgeLabelText;
                data.unit = editor.commonMeasurements.targetUnit;
                data.threeDDistance = ( startMarker.distanceTo(endMarker) ).toFixed(1);

                if( i == 0 ) {

                    editor.scene.userData.twoDDrawingDatas[twoDLine.uuid] = {};
            
                }
                if( rowValue > 0 ){
            
                    editor.scene.userData.twoDDrawingDatas[twoDLine.uuid][rowValue] = data;
            
                }

                var twoDTable = document.getElementById('twoD__measurement__table');
                if( twoDTable && twoDTable.style.display == "none" ) 
                    twoDTable.style.display = "block";

            }

            if( deletedCounterUsed == true ) {

                var twoDTableBody = document.getElementById('twoD__table')
                var siblingChild = document.getElementById(siblingNode + '__row 1')
                if( twoDTableBody && siblingChild ) {

                    twoDTableBody.childNodes[1].insertBefore( tableRow, siblingChild );

                } else {

                    scope.twoDTable.addRow( tableRow );

                }

            } else {

                scope.twoDTable.addRow( tableRow );

            }

        }

        tableRows.forEach( function( eachRow ) {

            eachRow.addEventListener('dblclick', function( event ){
        
                event.preventDefault();
                var rowID = eachRow.id;
                var lineNumber = rowID.split('__row ').pop();
                editor.signals.editTwoDDrawings.dispatch( twoDLine, lineNumber );
        
            });
        
        } )
        
        labelFields.forEach( function( eachLabel ) {
        
            eachLabel.addEventListener( 'keydown', function( event ) {
        
                if( event.keyCode === 13 ){
                    event.preventDefault();
                }
        
            } );
        
            eachLabel.addEventListener( 'blur', function( event ){
        
                event.preventDefault();
                var editedText = event.target.innerHTML;
                var eachLabelID = eachLabel.id;
                var lineNumber = eachLabelID.split('__row__label ').pop();
                var lineID = eachLabelID.substr(0,36);
                var oldName;
                if( editor.scene.userData.twoDDrawingDatas[lineID][lineNumber].editedLabel ){
                    oldName = editor.scene.userData.twoDDrawingDatas[lineID][lineNumber].editedLabel;
                }
                else{
                    oldName = editor.scene.userData.twoDDrawingDatas[lineID][lineNumber].label;
                }   
        
                if( ( editedText === '' ) || ( editedText.length > 10 ) ){
                    document.getElementById( eachLabel.id ).innerHTML = oldName;
                    toastr.error(  editor.languageData.EnteraValidNameWithin10Characters );
        
                } else if( editedText != undefined && ( editedText != oldName ) && ( editedText.length < 10 ) ) {
        
                    editor.scene.userData.twoDDrawingDatas[lineID][lineNumber].editedLabel = editedText;
                    toastr.success( editor.languageData.LabelValueChangedSuccessfully );
        
                }
        
            } );
        
        } );

    } )

    editor.signals.projectDataLoaded.add( function() {

        editor.twoDMeasureBadges = [];
        editor.twoDMeasureMarkers = [];

        editor.scene.traverse( function(child) {

            if( child instanceof THREE.Group && child.name === "TwoDMeasurementSession" ) {

                if( editor.isFloorplanViewActive === false || editor.type2dView != 1 ) {

                    child.visible = false;

                }
                child.traverse( function( subChild ){

                    if( subChild instanceof THREE.Sprite && subChild.name === "TwoDMeasurementBadge" ){

                        var lineID = subChild.userData.lineID;
                        var lineNumber = subChild.userData.lineNumber;
                        var badgeLabelText = editor.scene.userData.twoDDrawingDatas[ lineID ][ lineNumber ].distance;

                        if( badgeLabelText != undefined ){
                            var badgeColor = subChild.userData.badgeColor;
                           
                            var badgeTexture = editor.commonMeasurements.getNumberBadgeTransparent( { badgeText : badgeLabelText, badgeWidth : 105, badgeHeight : 35, fontSize : "16px", fontColor : badgeColor, strokeColor : "#500080", borderRadius : 7, type : "image" } );
                            var badgeColorChanger = document.getElementById('badge-color-value').value = badgeColor;

							subChild.material.map = badgeTexture;

							editor.twoDMeasureBadges.push( subChild );

						}

                    }
                    else if( subChild instanceof THREE.Mesh && (/^(TwoDMeasureMarker[\d+])/g).test(subChild.name) ){

						editor.twoDMeasureMarkers.push( subChild );

                    }/* else if(subChild.type == "Line" && subChild.name == "2DMeasurement") {

                        if( editor.scene.userData.twoDDrawingDatas[subChild.uuid]!= undefined && editor.scene.userData.twoDDrawingDatas[subChild.uuid]!= null ) {

                            var vertexCounts = Object.keys(editor.scene.userData.twoDDrawingDatas[subChild.uuid]).length;
                            editor.signals.newTwoDLineAdded.dispatch(subChild, (vertexCounts + 2), false);

                        }

                    }*/

                } );

            }

        } );

        if( editor.scene.userData.twoDDrawingDatas && ( Object.keys(editor.scene.userData.twoDDrawingDatas ).length > 0 ) ) {

            var twoDLinesCount = Object.keys(editor.scene.userData.twoDDrawingDatas ).length;
            var twoDLineKeys = Object.keys(editor.scene.userData.twoDDrawingDatas );
            var lineNumbers = [];

            for(i=0;i<twoDLinesCount;i++) {

                var key = twoDLineKeys[i];
                var line = editor.scene.userData.twoDDrawingDatas[key];
                var lineNum = editor.scene.userData.twoDDrawingDatas[key][1].label.substr(1);
                lineNumbers.push(lineNum);
                lineNumbers.sort();

            }
            
            for( k=0;k<lineNumbers.length;k++ ) {

                var firstLabel = 'A' + lineNumbers[k];

                for( j=0;j<twoDLinesCount;j++ ) {

                    var currentLineID = twoDLineKeys[j];
                    if(editor.scene.userData.twoDDrawingDatas[currentLineID] && editor.scene.userData.twoDDrawingDatas[currentLineID][1].label == firstLabel) {

                        var line = editor.scene.getObjectByProperty('uuid',currentLineID); 
                        var vertexCounts = Object.keys(editor.scene.userData.twoDDrawingDatas[line.uuid]).length;
    
                        if( line ) {
                            
                            editor.signals.newTwoDLineAdded.dispatch(line, (vertexCounts + 2), false);
                        }
                        break;

                    }

                }
                
            }

        }

    } );

}

twoDMeasurement.prototype = {

    constructor: twoDMeasurement,

    /**
	 * initUI() - Initializes the 2D measurement configuration UI.
	 * This method should not be invoked externally.
	 * @returns {Void}
	 * @author Peeyush
	 * @example <caption>usage of initUI</caption>
	 * var twoDMsrmt = new TwoDMeasurement( editor );
	 * twoDMsrmt.initUI();
	 */

    initUI: function() {

        var scope = this;

    },

    /**
	 * showTwoDLine() - Shows the 2D Line Table with the drawn lines.
	 * @returns {Void}
	 * @author Peeyush
	 * @example <caption>usage of showTwoDLine</caption>
	 * scope.showTwoDLine(line);
	 */

    showTwoDLine: function( twoDLine ) {

        var table = document.getElementById( "twoD__measurement__table" + twoDLine.uuid );
        table.style.display = "block";

    },

    /**
	 * hideTwoDLine() - Hides the 2D Line Table with the drawn lines.
	 * @returns {Void}
	 * @author Peeyush
	 * @example <caption>usage of hideTwoDLine</caption>
	 * scope.hideTwoDLine(line);
	 */

    hideTwoDLine: function( twoDLine ) {

        var table = document.getElementById( "twoD__measurement__table" + twoDLine.uuid );
        table.style.display = "none";

    }

}