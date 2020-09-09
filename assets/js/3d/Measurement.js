/**
 * Measurement( editor, viewport ) - Coordinates the operations of point to point MeasurementControls.
 * This class uses the MeasurementControls internally to perform the measurement operations.
 * It can also be used as the entry point for everything which is related to point to point measurements.
 * Attach the signal listeners here if something related with point to point measurements need to be performed with that signal
 * @constructor
 * @param {any} editor - The instance of the Editor which manages the overall objects and signals
 * @param {any} viewport - The parent DOM for the renderer's DOM element
 * @author Hari
 * @returns {Object}
 * @example <caption>Instanciation of this class is very much straight forward</caption>
 * var viewport = document.getElementById( 'viewport' );
 * var msrmt = new Measurement( editor, viewport );
 */
var Measurement = function ( editor, viewport ) {

	var scope = this;
	var view = document.getElementById( 'viewport' );

	this.collectedBaseUnit;
	this.collectedTargetUnit;
	this.collectedConFactor;

	this.measurementConfigModal;
	this.initUI();
	this.measurementTableWindow = new UI.MobileWindow( 'measurement__table__window' );
	document.getElementById( 'editorElement' ).appendChild( this.measurementTableWindow.dom );

	this.measurementTable = new HtmlTable( 'measurements__table' );

	var measurementTableWindowBody = document.createElement( 'div' );
	measurementTableWindowBody.setAttribute( 'id', 'table__window__body' );
	measurementTableWindowBody.setAttribute( 'class', 'table-responsive' );
	measurementTableWindowBody.appendChild( this.measurementTable.table );

	this.measurementTableWindow.setBody( measurementTableWindowBody );
	this.measurementTableWindow.setHeading( editor.languageData.Measurements );

	//this.measurementTableWindow.headerCloseBtn.disabled = true;
	
	var resizeCallback = function( event, ui ){
		
		var paddingBottomNeeded =  10, paddingLeftNeeded = 10;

		document.getElementById( 'table__window__body' ).style.width = ( this.measurementTableWindow.dom.offsetWidth - ( paddingLeftNeeded * 2 ) )+ "px";
		document.getElementById( 'table__window__body' ).style.marginLeft = paddingLeftNeeded + "px";

		document.getElementById( 'table__window__body' ).style.height = ( this.measurementTableWindow.body.offsetHeight - ( paddingBottomNeeded * 2 ) ) + "px";
		document.getElementById( 'table__window__body' ).style.marginTop = paddingBottomNeeded + "px";
		
	}

	this.measurementTableWindow.setResizable( false, 1.7, 155, 90, 700, 400, resizeCallback.bind( this ) );
	this.measurementTableWindow.setDraggable();
	
	this.measurementControls = new MeasurementControls( { camera : editor.camera, areaOfScope : view, baseUnit : "meter", baseConversionFactor : 1 }, editor );

	//var lengthShowHideToggle = false, enableDisableToggle = false;

	//var measurementRow = new UI.Row();
	//var elem = document.getElementById( "measure-tool-btn-content" );
	//var measurementButton = document.getElementById( 'measure-tool-btn' );

	var enableMeasurementLi = document.getElementById( 'enable-measure-mode-li' );
	var measureGrpDrpDwnBtn = document.getElementById( 'measure-group-dropdown-button' );
	var showMeasurementsLi = document.getElementById( 'show-measurements-li' );
	var configureMeasurementsLi = document.getElementById( 'configure-measurement-li' );
	var showAllMsrmntsLi = document.getElementById( "show-all-measurements-li" );

	var startNetworkingLi = document.getElementById( 'start-networking-li' );
	var showHideNetworkingLi = document.getElementById( 'show-hide-networking-li' );
	var editNetworkCablesLi = document.getElementById( 'edit-networking-li' );
	var autoRoutingLi = document.querySelector('#start-autorouting-li');

	if( showAllMsrmntsLi ){

		showAllMsrmntsLi.addEventListener( 'click', function( event ){

			if( editor.msrmntsShowHideToggle === false ){

				var lengthOrAreaExist = ( editor.scene.userData.measurementDatas != undefined && Object.keys( editor.scene.userData.measurementDatas ).length != 0 ) || ( editor.scene.userData.areaMeasurementDatas != undefined && Object.keys( editor.scene.userData.areaMeasurementDatas ).length != 0 );

				if( lengthOrAreaExist === true ){

					if( editor.isntwrkngStarted == true ) {

						startNetworkingLi.click();
	
					}

					if( editor.isAutoRoutingStrtd == true ) {

						autoRoutingLi.click();
	
					}
	
					if( editor.nwShowHideToggle == true ) {
	
						showHideNetworkingLi.click();
	
					}

					if( editor.isTwoDMeasurementEnabled === true ) {

						var enableTwoDMeasurements = document.getElementById('twod-enable-measure-mode-li');
						enableTwoDMeasurements.click();

					}

					if( editor.twoDDrawingsShowHideToggle === true ) {

						var showHideTwoDMeasurements = document.getElementById('twod-show-measurements-li');
						showHideTwoDMeasurements.click();

					}

					editor.msrmntsShowHideToggle = true;
					editor.signals.showAllMeasurements.dispatch();

					showAllMsrmntsLi.innerHTML = "<a>" + editor.languageData.hideAllMeasurements + "</a>";
					showAllMsrmntsLi.className = "activated";
					measureGrpDrpDwnBtn.style.color = "#500080";
					measureGrpDrpDwnBtn.innerHTML = '<span class="fa fa-object-group span-font-21 faa-pulse animated"></span>';

				}
				else{
					toastr.warning( editor.languageData.Measurementdatanotfound );
				}

			}
			else{

				editor.msrmntsShowHideToggle = false;
				editor.signals.hideAllMeasurements.dispatch();
				showAllMsrmntsLi.innerHTML = "<a>" + editor.languageData.showAllMeasurements + "</a>";
				showAllMsrmntsLi.className = "deactivated";
				
				if( editor.isMeasuring === false && editor.isAreaMeasuring === false ){

					measureGrpDrpDwnBtn.style.color = "#000000";
					measureGrpDrpDwnBtn.innerHTML = '<span class="fa fa-object-group span-font-21"></span>';

				}
				editor.deselect();

			}

		} );

	}

	if( enableMeasurementLi ){

		enableMeasurementLi.addEventListener( 'click', function( event ){

			var child = editor.scene.children;
			if( editor.isAreaMeasuring === true ){

				//toastr.warning( editor.languageData.Youcantactivatebothareameasurementandlengthmeasurementatatime );
				//return;
				var enableAreaMeasurementLi = document.getElementById( 'area-enable-measure-mode-li' );
				enableAreaMeasurementLi.click();

			}
			if( editor.enableDisableToggle === false ){

				if( child.length > 2 ){

					if( editor.isntwrkngStarted == true ) {

						startNetworkingLi.click();
	
					}

					if( editor.isAutoRoutingStrtd == true ) {

						autoRoutingLi.click();
	
					}

					if( editor.isCableEditingEnabled == true ) {

						var editNetworkCablesLi = document.getElementById( 'edit-networking-li' );
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
					if( editor.isTwoDMeasurementEnabled === true ) {

						var enableTwoDMeasurements = document.getElementById('twod-enable-measure-mode-li');
						enableTwoDMeasurements.click();

					}

					if( editor.twoDDrawingsShowHideToggle === true ) {

						var showHideTwoDMeasurements = document.getElementById('twod-show-measurements-li');
						showHideTwoDMeasurements.click();

					}

					enableMeasurementLi.innerHTML = "<a>" + editor.languageData.DisableLengthMeasurement + "</a>";
					enableMeasurementLi.className = "activated";
					measureGrpDrpDwnBtn.style.color = "#500080";
					measureGrpDrpDwnBtn.innerHTML = '<span class="fa fa-object-group span-font-21 faa-pulse animated"></span>';
					editor.isMeasuring = true;
					editor.enableDisableToggle = true;
					scope.measurementControls.activate();
					
					//Modified to show the measurement group when the controls are enabled start
					editor.scene.traverse( function( child ){

						if( child instanceof THREE.Group && child.name == "MeasurementSession" ){

							child.visible = true;
			
						}
			
					} );

					editor.signals.sceneGraphChanged.dispatch();
					//Modified to show the measurement group when the controls are enabled end

					toastr.success( editor.languageData.lengthMeasurementActivated );

				}
				else{
					toastr.warning( editor.languageData.ItappearsthatnoobjectshavebeenaddedtothesceneYoucantactivatemeasurementsonanemptyscene );
				}

			}
			else{

				enableMeasurementLi.innerHTML = "<a>" + editor.languageData.EnableLengthMeasurement + "</a>";
				enableMeasurementLi.className = "deactivated";

				editor.isMeasuring = false;
				editor.enableDisableToggle = false;
				scope.measurementControls.deActivate();

				//if( editor.lengthShowHideToggle === false && editor.areaShowHideToggle === false && editor.isAreaMeasuring === false && editor.isMeasuring === false ){
				if( editor.msrmntsShowHideToggle === false && editor.isAreaMeasuring === false && editor.isMeasuring === false ){

					measureGrpDrpDwnBtn.style.color = "#000000";
					measureGrpDrpDwnBtn.innerHTML = '<span class="fa fa-object-group span-font-21"></span>';

				}

				//editor.isMeasuring = false;
				//editor.enableDisableToggle = false;
				//scope.measurementControls.deActivate();

				//Modified to hide the measurement group (if it is visible) when the controls are disabled start
				if( editor.msrmntsShowHideToggle === false ){

					//if( editor.lengthShowHideToggle === true ){//
						//showMeasurementsLi.click();//
					//}//
					editor.scene.traverse( function( child ){
	
						if( child instanceof THREE.Group && child.name == "MeasurementSession" ){
	
							child.visible = false;
			
						}
			
					} );
					editor.signals.sceneGraphChanged.dispatch();

				}
				//Modified to hide the measurement group (if it is visible) when the controls are disabled end

			}

		} );

	}

	if( showMeasurementsLi ){

		showMeasurementsLi.addEventListener( 'click', function( event ){

			if( editor.lengthShowHideToggle === false ){

				if( editor.scene.userData.measurementDatas != undefined && Object.keys( editor.scene.userData.measurementDatas ).length != 0 ){

					scope.updateTable( editor.scene.userData.measurementDatas );
					scope.measurementTableWindow.show();

					editor.scene.traverse( function( child ){

						if( child instanceof THREE.Group && child.name == "MeasurementSession" ){

							child.visible = true;
			
						}
			
					} );

					editor.signals.sceneGraphChanged.dispatch();

					showMeasurementsLi.innerHTML = "<a>" + editor.languageData.HideLengthMeasurements + "</a>";
					showMeasurementsLi.className = "activated";
					measureGrpDrpDwnBtn.style.color = "#500080";
					measureGrpDrpDwnBtn.innerHTML = '<span class="fa fa-object-group span-font-21 faa-pulse animated"></span>';
					editor.lengthShowHideToggle = true;

				}
				else{

					toastr.warning( editor.languageData.Measurementdatanotfound );

				}

			}
			else{

				if( editor.isMeasuring === false ){
					
					editor.scene.traverse( function( child ){

						if( child instanceof THREE.Group && child.name == "MeasurementSession" ){

							child.visible = false;
			
						}
			
					} );

				}

				editor.signals.sceneGraphChanged.dispatch();

				showMeasurementsLi.innerHTML = "<a>" + editor.languageData.ShowLengthMeasurements + "</a>";
				showMeasurementsLi.className = "deactivated";

				editor.lengthShowHideToggle = false;
				scope.measurementTableWindow.hide();

				//if( editor.enableDisableToggle === false ){
				if( editor.lengthShowHideToggle === false && editor.areaShowHideToggle === false && editor.isAreaMeasuring === false && editor.isMeasuring === false ){

					measureGrpDrpDwnBtn.style.color = "#000000";
					measureGrpDrpDwnBtn.innerHTML = '<span class="fa fa-object-group span-font-21"></span>';

				}

				//editor.lengthShowHideToggle = false;
				//scope.measurementTableWindow.hide();

			}

		} );

	}

	if( configureMeasurementsLi ){

		configureMeasurementsLi.addEventListener( 'click', function( event ){

			var baseUnitSelectorElement = document.getElementById( 'measurement-base-unit-selector' );
			baseUnitSelectorElement.value = ( editor.scene.userData.measurementConfig != undefined )? editor.scene.userData.measurementConfig.baseUnit : scope.measurementControls.baseUnit;

			var convFactorInputElement = document.getElementById( 'measurement-config-conv-factor-input' );
			convFactorInputElement.value = ( editor.scene.userData.measurementConfig != undefined )? editor.scene.userData.measurementConfig.baseConversionFactor : scope.measurementControls.baseConversionFactor;

			var targetUnitSelectorElement = document.getElementById( 'measurement-target-unit-selector' );
			targetUnitSelectorElement.value = ( editor.scene.userData.measurementConfig != undefined )? editor.scene.userData.measurementConfig.targetUnit : scope.measurementControls.targetUnit;

			scope.measurementConfigModal.show();

		} );

	}

	//Listener for modal "Save" button
	this.measurementConfigModal.modalFooterSuccessButton.addEventListener( 'click', function( event ){

		try{
			
			var baseUnitSelectorElement = document.getElementById( 'measurement-base-unit-selector' );
			var convFactorInputElement = document.getElementById( 'measurement-config-conv-factor-input' );
			var targetUnitSelectorElement = document.getElementById( 'measurement-target-unit-selector' );

			scope.measurementControls.setBaseUnit( baseUnitSelectorElement.value, convFactorInputElement.value );
			scope.measurementControls.setTargetUnit( targetUnitSelectorElement.value );
			toastr.success( editor.languageData.AppliedtheconfigurationThisconfigurationwillbeappliedforyournextmeasurementsonwards );
			scope.measurementConfigModal.hide();

			if( editor.scene.userData.measurementConfig === undefined ){

				editor.scene.userData.measurementConfig = {};

			}
			editor.scene.userData.measurementConfig.baseUnit = baseUnitSelectorElement.value;
			editor.scene.userData.measurementConfig.baseConversionFactor = convFactorInputElement.value;
			editor.scene.userData.measurementConfig.targetUnit = targetUnitSelectorElement.value;

			editor.signals.measurementConfigurationChanged.dispatch( baseUnitSelectorElement.value, convFactorInputElement.value, targetUnitSelectorElement.value  );

			//Modified to change grid size as per saved base unit start
			var gridSize = editor.gridSize;
			var gridDivisions = editor.gridDivision;
			editor.signals.gridUnitChanged.dispatch( gridSize, targetUnitSelectorElement.value, baseUnitSelectorElement.value, false );
			//Modified to change grid size as per saved base unit end

			//Modified for activity logging start
            try{

                //Modified for activity logging start
                var logDatas = {};
                logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Measurement configuration changed : { " + baseUnitSelectorElement.value + ", " + convFactorInputElement.value + ", " + targetUnitSelectorElement.value + "}";
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
		catch( error ){

			toastr.error( editor.languageData.SorrysomethingwentwrongPleasetryagainaftersometime );
			scope.measurementConfigModal.hide();

		}

	} );

	this.measurementTableWindow.headerCloseBtn.addEventListener( 'click', function( event ){

		//showMeasurementsLi.click();
		scope.measurementTableWindow.hide();
		editor.deselect();

	} );

	//Listener for showAllMeasurements
	editor.signals.showAllMeasurements.add( function(){

		if( editor.scene.userData.measurementDatas != undefined && Object.keys( editor.scene.userData.measurementDatas ).length != 0 ){

			scope.updateTable( editor.scene.userData.measurementDatas );
			scope.measurementTableWindow.show();
	
			editor.scene.traverse( function( child ){
	
				if( child instanceof THREE.Group && child.name == "MeasurementSession" ){
	
					child.visible = true;
	
				}
	
			} );
	
			editor.signals.sceneGraphChanged.dispatch();
			editor.lengthShowHideToggle = true;
	
		}
		else{
	
			toastr.warning( editor.languageData.lengthMeasurementDataNotFound );
	
		}

	} );

	//Listener for hideAllMeasurements
	editor.signals.hideAllMeasurements.add( function(){

		if( editor.isMeasuring === false ){
		
			editor.scene.traverse( function( child ){
	
				if( child instanceof THREE.Group && child.name == "MeasurementSession" ){
	
					child.visible = false;
	
				}
	
			} );
	
		}
	
		editor.signals.sceneGraphChanged.dispatch();
		editor.lengthShowHideToggle = false;
		scope.measurementTableWindow.hide();

	} );

	//Listener to update the scene userData when a measurement is removed
	editor.signals.objectRemoved.add( function( object ){

        if( object.name === "MeasurementConnectionLine" ){

			var key = object.uuid;

			//Modified for activity logging start
			try{

				//Modified for activity logging start
				if( editor.scene.userData.measurementDatas != undefined && editor.scene.userData.measurementDatas[ key ] != undefined ){

					var removedLabel = editor.scene.userData.measurementDatas[ key ][ "label" ];

				}

				var logDatas = {};
				logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Length measurement " + removedLabel + " removed";
				logger.addLog( logDatas );
				logger.sendLogs( localStorage.getItem( 'U_ID' ) );
				//Modified for activity logging end

			}
			catch( exception ){

				console.log( "Logging failed!" );
				console.log( exception );

			}
			//Modified for activity logging end

			if( editor.scene.userData.measurementDatas != undefined && editor.scene.userData.measurementDatas[ key ] != undefined ){
				
				delete editor.scene.userData.measurementDatas[ key ];
				var deletedMeasurementRow = document.getElementById( object.uuid + "__measure__row" );
				if( deletedMeasurementRow != null ){

					scope.measurementTable.removeRow( deletedMeasurementRow );

				}

			}
			editor.deselect();
			toastr.info( editor.languageData.Selectedmeasurementandassociateddatahasbeenremoved );
			object.traverse( function( subChild ){

				if( subChild instanceof THREE.Sprite && subChild.name === "MeasureValueBadge" ){
					
					var childIndex = editor.lengthBadges.indexOf( subChild );
					if( childIndex != -1 ){

						editor.lengthBadges.splice( childIndex, 1 );

					}
					
				}
				else if( subChild instanceof THREE.Mesh && ( subChild.name === "StartMeasurementMarker" || subChild.name === "EndMeasurementMarker" ) ){
					
					var childIndex = editor.lengthEndMarkers.indexOf( subChild );
					if( childIndex != -1 ){

						editor.lengthEndMarkers.splice( childIndex, 1 );

					}
					
				}

			} );

		}
		else{

			var lineId;
			object.traverse( function( child ){

				if( child.name === "MeasurementConnectionLine" ){

					lineId = child.uuid;
					if( editor.scene.userData.measurementDatas != undefined && editor.scene.userData.measurementDatas[ lineId ] != undefined ){

						delete editor.scene.userData.measurementDatas[ lineId ];
						var deletedMeasurementRow = document.getElementById( child.uuid + "__measure__row" );
						if( deletedMeasurementRow != null ){

							scope.measurementTable.removeRow( deletedMeasurementRow );

						}

					}

				}
				else if( child instanceof THREE.Sprite && child.name === "MeasureValueBadge" ){
							
					var childIndex = editor.lengthBadges.indexOf( child );
					if( childIndex != -1 ){

						editor.lengthBadges.splice( childIndex, 1 );

					}
					
				}
				else if( child instanceof THREE.Mesh && ( child.name === "StartMeasurementMarker" || child.name === "EndMeasurementMarker" ) ){
							
					var childIndex = editor.lengthEndMarkers.indexOf( child );
					if( childIndex != -1 ){

						editor.lengthEndMarkers.splice( childIndex, 1 );

					}
					
				}

			} );
			editor.deselect();
			//toastr.info( "Measurement data associated with the object is also removed" );

		}

	} );
	
	editor.signals.newMeasurementAdded.add( function( measuredData ){

		var key = measuredData.lineUuid;
		delete measuredData.lineUuid;
		var htmlTableValueRow = document.createElement( 'tr' );
		htmlTableValueRow.setAttribute( 'value', key );
		htmlTableValueRow.setAttribute( 'id', key + "__measure__row" );
		
		htmlTableValueRow.addEventListener( 'click', function( event ){
			editor.selectByUuid( this.getAttribute( 'value' ) );
		} );

		htmlTableValueRow.addEventListener( 'dblclick', function( event ){
			editor.selectByUuid( this.getAttribute( 'value' ) );
			var selectedLine = editor.selected;
			editor.signals.showLengthMsrCntxtMenu.dispatch( selectedLine, event );
		} );

		//Looping through each info in a single measurement
		//info holds each of the keys in a single measurement
		for( var info in measuredData ){

			var tableColumnValue = document.createElement( 'td' );
			var infoUpper = info.toUpperCase();
			if( infoUpper === 'BADGELABEL' ){
				continue;
			}
			else if( infoUpper === 'START' || infoUpper === 'END' ){

				var point = measuredData[ info ];
				//Modified Pivot start
				//tableColumnValue.innerHTML = "( " + point.x.toFixed( 1 ) + ", " + point.y.toFixed( 1 ) + ", " + point.z.toFixed( 1 ) + " )";
				//Modified to convert start and end points to real world values
				tableColumnValue.innerHTML = "( " + (point.x * editor.commonMeasurements.targetConversionFactor ).toFixed( 1 ) + ", " + (point.y * editor.commonMeasurements.targetConversionFactor ).toFixed( 1 ) + ", " + (point.z * editor.commonMeasurements.targetConversionFactor ).toFixed( 1 ) + " )";

				htmlTableValueRow.appendChild( tableColumnValue );

			}
			else if( infoUpper === 'LABEL' ){

				tableColumnValue.contentEditable = true;
				tableColumnValue.setAttribute( 'class', 'editable__table__cell' );
				tableColumnValue.innerHTML = measuredData[ info ];
				tableColumnValue.addEventListener( 'keydown', function( event ){
					
					if( event.keyCode === 13 ){
						event.preventDefault();
					}
					
				} );

				tableColumnValue.addEventListener( 'blur', function( event ){
					
					event.preventDefault();
					var editedText = event.target.innerHTML;
					var parentValue = event.target.parentNode.getAttribute( 'value' ), currentLine;
					
					if( parentValue ){

						editor.selectByUuid( parentValue );
						currentLine = editor.selected;
						var oldUserDataItem = editor.scene.userData.measurementDatas[ currentLine.uuid ];
						if( editedText === "" ){
							
							if( oldUserDataItem != undefined ){
								
								event.target.innerHTML = oldUserDataItem.label;

							}

						}
						else if( oldUserDataItem != undefined && oldUserDataItem.label != editedText ){

							editor.signals.measurementEdited.dispatch( currentLine, { label : editedText, updateTable : false } );

						}

					}
					
				} );
				htmlTableValueRow.appendChild( tableColumnValue );
			}
			else if( infoUpper === 'ELEVATION' ){

				tableColumnValue.setAttribute( 'id', key + "__row__labelHeight" );
				var elevation = measuredData[ info ];
				var heightInput = document.createElement( 'input' );
				heightInput.setAttribute( 'id', key + "__row__labelHeight__input" );
				heightInput.className = "length__table__height__input";
				heightInput.setAttribute( "type", "number" );
				heightInput.setAttribute( "step", "0.1" );
				heightInput.setAttribute( "size", "1" );
				elevation = Number( elevation );
				heightInput.value = elevation.toFixed(1);
				tableColumnValue.appendChild( heightInput );
				htmlTableValueRow.appendChild( tableColumnValue );

				heightInput.addEventListener( 'change', function( event ){

					var startPoint, endPoint;
					var heightValue = Number( event.target.value );
					var parentValue = event.target.parentNode.parentNode.getAttribute( 'value' );

					if( parentValue ){

						var currentLineSession = editor.scene.getObjectByProperty( 'uuid', parentValue);

						currentLineSession.traverse( function( child ){

							if( child instanceof THREE.Mesh && ( child.name === 'StartMeasurementMarker' ) ){
								
								startPoint = child;

							} else if( child instanceof THREE.Mesh && ( child.name === 'EndMeasurementMarker' ) ){

								endPoint = child;

							} 

						} );

						if( startPoint!= null && startPoint!= undefined && endPoint!= null && endPoint!= undefined ){

							var changeInHeight, elevation;
							var startOrginalPosition = startPoint.position.clone();
				
							startPoint.position.setY( heightValue/editor.lengthMeasurement.measurementControls.targetConversionFactor );
							editor.signals.changeLengthMeasurementHeight.dispatch( startPoint );
							editor.signals.sceneGraphChanged.dispatch();

							changeInHeight = Math.abs( startOrginalPosition.y - startPoint.position.y );
							elevation = startPoint.position.y.toFixed(1);
							
							if( startOrginalPosition.y > startPoint.position.y ){

								endPoint.position.setY( endPoint.position.y - changeInHeight );
								editor.signals.changeLengthMeasurementHeight.dispatch( endPoint );
								editor.signals.sceneGraphChanged.dispatch();

							} else if( startOrginalPosition.y < startPoint.position.y ){

								endPoint.position.setY( endPoint.position.y + changeInHeight );
								editor.signals.changeLengthMeasurementHeight.dispatch( endPoint );
								editor.signals.sceneGraphChanged.dispatch();

							}

						}
						editor.signals.measurementEdited.dispatch( currentLineSession, { elevation : elevation, updateTable : false } );

					}

				} );

			}
			else{

				tableColumnValue.innerHTML = measuredData[ info ];
				htmlTableValueRow.appendChild( tableColumnValue );

			}

		}
		scope.measurementTable.addRow( htmlTableValueRow );

		if( editor.msrmntsShowHideToggle === true && editor.lengthShowHideToggle === false ){
			editor.signals.showAllMeasurements.dispatch();
		}

		//Modified for activity logging start
		try{

			//Modified for activity logging start
			var logDatas = {};
			logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : New length measurement added : " + measuredData[ "label" ] + " : " + measuredData[ "measurement" ] + " " + measuredData[ "unit" ];
			logger.addLog( logDatas );
			logger.sendLogs( localStorage.getItem( 'U_ID' ) );
			//Modified for activity logging end

		}
		catch( exception ){

			console.log( "Logging failed!" );
			console.log( exception );

		}
		//Modified for activity logging end

	} );

	editor.signals.editorCleared.add( function(){

		/*if( editor.lengthShowHideToggle === true ){

			showMeasurementsLi.click();

		}*/

		if( editor.msrmntsShowHideToggle === true ){

			showAllMsrmntsLi.click();

		}

		/*if( editor.enableDisableToggle === true ){

			enableMeasurementLi.click();

		}*/

	} );

	//Modified to add listener for the projectDataLoaded signal start
	//When this signal is caught, we have to find the measurement groups from the scene
	//push all of the identified measurement groups to the editor.measureGroups array.
	//Hide all the measurement groups initially
	editor.signals.projectDataLoaded.add( function(){

		editor.lengthBadges = [];
		editor.lengthEndMarkers = [];

		editor.scene.traverse( function( child ){

			if( child instanceof THREE.Group && child.name == "MeasurementSession" ){

				editor.measureGroups.push( child );
				child.visible = false;

				child.traverse( function( subChild ){

					if( subChild instanceof THREE.Sprite && subChild.name === 'MeasureValueBadge' ){

						//Measurement value badge is a sprite and is the child of the connection line
						//so 'subChild.parent.uuid' will give the uuid of the connection line
						var badgeLabelText = editor.scene.userData.measurementDatas[ subChild.parent.uuid ][ 'badgeLabel' ];

						if( badgeLabelText != undefined ){

							var badgeTexture = scope.measurementControls.getNumberBadge( { badgeText : badgeLabelText, badgeWidth : 55, badgeHeight : 55, fontSize : "16px", fontColor : "#500080", strokeColor : "#500080", borderRadius : 7, type : "image" } );

							subChild.material.map = badgeTexture;
							
							editor.lengthBadges.push( subChild );

						}

					}
					else if( subChild instanceof THREE.Mesh && ( subChild.name === "StartMeasurementMarker" || subChild.name === "EndMeasurementMarker" ) ){
						
						editor.lengthEndMarkers.push( subChild );

					}

				} );

			}

		} );

		editor.signals.sceneGraphChanged.dispatch();

		//Modified to configure the measurement controls when project is opened start
		if( editor.scene.userData.measurementConfig != undefined ){

			scope.measurementControls.setBaseUnit( editor.scene.userData.measurementConfig.baseUnit, editor.scene.userData.measurementConfig.baseConversionFactor );
			scope.measurementControls.setTargetUnit( editor.scene.userData.measurementConfig.targetUnit );

		}
		else{
			
			toastr.warning( editor.languageData.Youhaventconfiguredthemeasurementcontrolsyetpleaseconfiguremeasurementsandremembertosaveit );

		}
		//Modified to configure the measurement controls when project is opened end

	} );
	//Modified to add listener for the projectDataLoaded signal end

	//Modified to add listener for the measurement changed signal start
	editor.signals.measurementEdited.add( function( changedMeasurementLine, options ){

		try{

			if( editor.scene.userData.measurementDatas[ changedMeasurementLine.uuid ] != undefined ){

				var selectedRowId = changedMeasurementLine.uuid + "__measure__row";
				var selectedRow = document.getElementById( selectedRowId );

				if( options.label ){
					
					editor.scene.userData.measurementDatas[ changedMeasurementLine.uuid ].label = options.label;
					if( options.updateTable != undefined && options.updateTable === true && selectedRow != null ){
						scope.measurementTable.editColumn( selectedRow, "Label", options.label );
					}

				}

				if( options.start ){

					editor.scene.userData.measurementDatas[ changedMeasurementLine.uuid ].start = options.start;
					if( options.updateTable != undefined && options.updateTable === true && selectedRow != null ){
						
						var startValue = "( " + (options.start.x * editor.commonMeasurements.targetConversionFactor).toFixed( 1 ) + ", " + (options.start.y * editor.commonMeasurements.targetConversionFactor).toFixed( 1 ) + ", " + (options.start.z * editor.commonMeasurements.targetConversionFactor).toFixed( 1 ) + " ) "; 
						scope.measurementTable.editColumn( selectedRow, "Start", startValue );
					
					}
				} 

				if( options.end ){
					
					editor.scene.userData.measurementDatas[ changedMeasurementLine.uuid ].end = options.end;
					if( options.updateTable != undefined && options.updateTable === true && selectedRow != null ){

						var endValue = "( " + (options.end.x * editor.commonMeasurements.targetConversionFactor).toFixed( 1 ) + ", " + (options.end.y * editor.commonMeasurements.targetConversionFactor).toFixed( 1 ) + ", " + (options.end.z * editor.commonMeasurements.targetConversionFactor).toFixed( 1 ) + " ) "; 
						scope.measurementTable.editColumn( selectedRow, "End", endValue );
					}
				}

				if( options.badgeLabel ) editor.scene.userData.measurementDatas[ changedMeasurementLine.uuid ].badgeLabel = options.badgeLabel;

				if( options.measurement ){
					editor.scene.userData.measurementDatas[ changedMeasurementLine.uuid ].measurement = options.measurement;
					if( options.updateTable != undefined && options.updateTable === true && selectedRow != null ){
						scope.measurementTable.editColumn( selectedRow, "Measurement", options.measurement );
					}

				} 

				if( options.unit ){
					editor.scene.userData.measurementDatas[ changedMeasurementLine.uuid ].unit = options.unit;
					if( options.updateTable != undefined && options.updateTable === true && selectedRow != null ){
						scope.measurementTable.editColumn( selectedRow, "Unit", options.unit );
					}

				}

				if( options.elevation ){
					editor.scene.userData.measurementDatas[ changedMeasurementLine.uuid ].elevation = options.elevation;
					if( options.updateTable != undefined && options.updateTable === true && selectedRow != null ){
						//scope.measurementTable.editColumn( selectedRow, "ELEVATION", options.elevation );
						var a = document.getElementById( changedMeasurementLine.uuid + '__row__labelHeight__input' );
						a.value = options.elevation;

					} 
				}
				toastr.success( editor.languageData.Datasuccessfullyupdated );
				editor.signals.measurementEditingCompleted.dispatch( { measurementType : "length", label : options.label, rowId : selectedRowId, lineUuid : changedMeasurementLine.uuid } ); 
	
			}
			/*if( options.updateTable != undefined && options.updateTable === true ){

				var selectedRowId = changedMeasurementLine.uuid + "__measure__row";
				var selectedRow = document.getElementById( selectedRowId );
				if( selectedRow ){
					
					scope.measurementTable.editColumn( selectedRow, "Label", options.label );

					toastr.success( editor.languageData.Datasuccessfullyupdated );
					editor.signals.measurementEditingCompleted.dispatch( { measurementType : "length", label : options.label, rowId : selectedRowId, lineUuid : changedMeasurementLine.uuid } );
		
				}
				else{
					console.warn( "Failed to update table" );
				}

			}
			else{

				toastr.success( editor.languageData.Datasuccessfullyupdated );
				editor.signals.measurementEditingCompleted.dispatch( { measurementType : "length", label : options.label, rowId : selectedRowId, lineUuid : changedMeasurementLine.uuid } );

			}*/

		}
		catch( error ){

			toastr.error( editor.languageData.SorrysomethingwentwrongPleasetryagainaftersometime );
			console.warn( error );

		}

	} );
	//Modified to add listener for the measurement changed signal end

	//Modified to add listener for the new project created signal start
	editor.signals.newProjectCreated.add( function(){

		scope.measurementConfigModal.show();
		toastr.info( editor.languageData.YouhaventconfiguredthemeasurementcontrolsyetpleaseconfiguremeasurementshereandremembertosaveitAlsoyoucanchangeitanytime );

	} );
	//Modified to add listener for the new project created signal end

}

Measurement.prototype = {

	constructor : Measurement,

	/**
	 * initUI() - Initializes the measurement configuration UI.
	 * THis method should not be invoked externally.
	 * @returns {Void}
	 * @author Hari
	 * @example <caption>usage of initUI</caption>
	 * var msrmt = new Measurement( editor, viewport );
	 * msrmt.initUI();
	 */
	initUI : function(){

		var scope = this;
		var defaultBodyContent = document.createElement( 'div' );
		defaultBodyContent.id = "measurement-config-modal__body";

		//UI.bootstrapModal = function ( value, id, modalHeading, modalBodyContents, successButtonText, failureButtonText, formId )
		this.measurementConfigModal = new UI.bootstrapModal( "", "measurement-config-modal", "<span class='fa fa-cogs'></span>" + editor.languageData.Configuremeasurements, defaultBodyContent, editor.languageData.Save , editor.languageData.Cancel, "measurement-config-modal-form" );

		//this.measurementConfigModal.hideFooterButtons();
		document.getElementById('editorElement').appendChild( this.measurementConfigModal.dom );

		//Creating body for the modal start
		var bodyWrapper = document.createElement( 'div' );
		bodyWrapper.setAttribute( 'id', 'measurement-config-body-wrapper' );

		//BASE UNIT SECTION START
		var baseUnitWrapper = document.createElement( 'div' );
		baseUnitWrapper.setAttribute( 'id', 'measurement-config-baseunit-wrapper' );
		baseUnitWrapper.setAttribute( 'class', 'measurement_config_baseunit_wrapper' );

		var baseUnitHelpInfo = document.createElement( 'span' );
		baseUnitHelpInfo.setAttribute( 'class', 'measurement_config_help_info' );
		baseUnitHelpInfo.innerHTML = editor.languageData.ChoosethebaseunitforthemodelBaseunitisthemeasurementsystemMeterorFeetusedforthe3Dmodel;
		baseUnitWrapper.appendChild( baseUnitHelpInfo );

		var baseUnitListWrapper = document.createElement( 'div' );
		baseUnitListWrapper.setAttribute( 'class', 'form-group form-group-sm' );
		//baseUnitListWrapper.setAttribute( 'style', 'margin-bottom: 7px !important;' );

		var col4 = document.createElement( 'div' );
		//col4.setAttribute( 'class', 'col-sm-2 col-md-12' );

		var selectList = document.createElement( 'select' );
		selectList.setAttribute( 'class', 'form-control' );
		selectList.setAttribute( 'id', 'measurement-base-unit-selector' );

		var option1 = document.createElement( 'option' );
		option1.innerHTML = "meter";
		var option2 = document.createElement( 'option' );
		option2.innerHTML = "feet";

		selectList.appendChild( option1 );
		selectList.appendChild( option2 );

		col4.appendChild( selectList );

		baseUnitListWrapper.appendChild( col4 );

		baseUnitWrapper.appendChild( baseUnitListWrapper );
		bodyWrapper.appendChild( baseUnitWrapper );
		//BASE UNIT SECTION END

		//CONVERSION FACTOR SECTION START
		var conversionFactorWrapper = document.createElement( 'div' );
		conversionFactorWrapper.setAttribute( 'id', 'measurement-config-conv-factor-wrapper' );
		conversionFactorWrapper.setAttribute( 'class', 'measurement_config_conv_factor_wrapper' );

		convFactorHelpInfo = document.createElement( 'span' );
		convFactorHelpInfo.setAttribute( 'class', 'measurement_config_help_info' );
		convFactorHelpInfo.innerHTML = editor.languageData.EntertheconversionfactorbelowConversionfactorindicatesthemeasurementvalueinbaseUnitcorrespondingto1unitdistanceinthemodel;

		conversionFactorWrapper.appendChild( convFactorHelpInfo );

		var convFactorInputCol = document.createElement( 'div' );
		//convFactorInputCol.setAttribute( 'class', 'col-sm-2 col-md-12' );

		var convFactorInputFrmGrp = document.createElement( 'div' );
		convFactorInputFrmGrp.setAttribute( 'class', 'form-group' );

		var convFactorInput = document.createElement( 'input' );
		convFactorInput.setAttribute( 'type', 'number' );
		convFactorInput.setAttribute( 'class', 'form-control' );
		convFactorInput.setAttribute( 'min', '0.01' );
		convFactorInput.setAttribute( 'max', Infinity );
		convFactorInput.setAttribute( 'step', '0.01' );
		convFactorInput.setAttribute( 'value', '1' );
		convFactorInput.setAttribute( 'id', 'measurement-config-conv-factor-input' );

		convFactorInput.addEventListener( 'change', function( event ){

			if( Number( event.target.value ) === NaN || ( Number( event.target.value ) > this.max || Number( event.target.value ) < this.min ) ){

				event.target.value = scope.measurementControls.baseConversionFactor;

			}

		} );

		convFactorInputFrmGrp.appendChild( convFactorInput );
		convFactorInputCol.appendChild( convFactorInputFrmGrp );
		conversionFactorWrapper.appendChild( convFactorInputCol );
		bodyWrapper.appendChild( conversionFactorWrapper );
		//CONVERSION FACTOR SECTION END

		//TARGET UNIT SECTION START
		var targetUnitWrapper = document.createElement( 'div' );
		targetUnitWrapper.setAttribute( 'id', 'measurement-config-targetunit-wrapper' );
		targetUnitWrapper.setAttribute( 'class', 'measurement_config_targetunit_wrapper' );

		var targetUnitHelpInfo = document.createElement( 'span' );
		targetUnitHelpInfo.setAttribute( 'class', 'measurement_config_help_info' );
		targetUnitHelpInfo.innerHTML = editor.languageData.ChoosethetargetunitforthemodelTargetunitisthemeasurementsystemMeterorFeettouseforyournextmeasurements;
		targetUnitWrapper.appendChild( targetUnitHelpInfo );

		var targetUnitListWrapper = document.createElement( 'div' );
		targetUnitListWrapper.setAttribute( 'class', 'form-group form-group-sm' );
		//targetUnitListWrapper.setAttribute( 'style', 'margin-bottom: 7px !important;' );

		var targetCol4 = document.createElement( 'div' );
		//targetCol4.setAttribute( 'class', 'col-sm-2 col-md-12' );

		var targetUnitSelectList = document.createElement( 'select' );
		targetUnitSelectList.setAttribute( 'class', 'form-control' );
		targetUnitSelectList.setAttribute( 'id', 'measurement-target-unit-selector' );
		targetUnitSelectList.setAttribute( 'value', 'feet' );

		var targetOption1 = document.createElement( 'option' );
		targetOption1.innerHTML = "meter";
		var targetOption2 = document.createElement( 'option' );
		targetOption2.innerHTML = "feet";

		targetUnitSelectList.appendChild( targetOption1 );
		targetUnitSelectList.appendChild( targetOption2 );

		targetCol4.appendChild( targetUnitSelectList );

		targetUnitListWrapper.appendChild( targetCol4 );

		targetUnitWrapper.appendChild( targetUnitListWrapper );
		bodyWrapper.appendChild( targetUnitWrapper );
		//TARGET UNIT SECTION END

		//Creating body for the modal end

		this.measurementConfigModal.setModalBody( bodyWrapper );

	},

	/**
	 * updateTable( data ) - Updates the measurement table with data supplied
	 * @param {Object} data - The measurement data as an object.
	 * Structure of the data should be like,
	 * { 
	 *     <measurement line uuid> : {
	 * 	   label : <Measurement label>,
	 * 	   start : {
	 * 		   x : <Number>,
	 * 		   y : <Number>,
	 * 		   z : <Number>
	 * 	   },
	 * 	   end : {
	 * 		   x : <Number>,
	 * 		   y : <Number>,
	 * 		   z : <Number>
	 * 	   },
	 * 	   measurement : <Number>,
	 * 	   unit : <String>,
	 * 	   badgeLabel : <String>
	 * }
	 * @returns {Void}
	 * @author Hari
	 */
	updateTable : function( data ){

		//Creating a table body
		var htmlTableBody = document.createElement( 'tbody' );

		//Looping through the measurement data to find the table heading and rows
		//measurement data should be in the format given below
		//	{ 
		//		<measurement line uuid> : {
		//			label : <Measurement label>,
		//			start : {
		//				x : <Number>,
		//				y : <Number>,
		//				z : <Number>
		//			},
		//			end : {
		//				x : <Number>,
		//				y : <Number>,
		//				z : <Number>
		//			},
		//			measurement : <Number>,
		//			unit : <String>,
		//			badgeLabel : <String>
		//		}
		//	}

		var measurementKeys = Object.keys( data ); //measurementKeys holds all of the '<measurement line uuid>'
		if( measurementKeys.length != 0 ){

			//data[ measurementKeys[ 0 ] ] holds the first measurement data in the 'data' object
			//Assuming that all the measurement data is following the structure specified above, we can 
			//find the table headers by taking the keys of first measurement data in the 'data' object
			var tableHeaders = Object.keys( data[ measurementKeys[ 0 ] ] );
			tableHeaders.splice( tableHeaders.indexOf( 'badgeLabel' ), 1 );
			this.measurementTable.setHeadersFromArray( tableHeaders );
			
			for( var key in data ){

				var measurementItem = key; //measurementItem holds each of the measurements
				var htmlTableValueRow = document.createElement( 'tr' );
				htmlTableValueRow.setAttribute( 'value', key );
				htmlTableValueRow.setAttribute( 'id', key + "__measure__row" );
				
				htmlTableValueRow.addEventListener( 'click', function( event ){
					editor.selectByUuid( this.getAttribute( 'value' ) );
				} );

				htmlTableValueRow.addEventListener( 'dblclick', function( event ){
					editor.selectByUuid( this.getAttribute( 'value' ) );
					var selectedLine = editor.selected;
					editor.signals.showLengthMsrCntxtMenu.dispatch( selectedLine, event );
				} );

				//Looping through each info in a single measurement
				//info holds each of the keys in a single measurement
				for( var info in data[ measurementItem ] ){

					var tableColumnValue = document.createElement( 'td' );
					var infoUpper = info.toUpperCase();
					if( infoUpper === 'BADGELABEL' ){
						continue;
					}
					else if( infoUpper === 'START' || infoUpper === 'END' ){

						var point = data[ measurementItem ][ info ];
						//Modified here Pivot
						//tableColumnValue.innerHTML = "( " + point.x.toFixed( 1 ) + ", " + point.y.toFixed( 1 ) + ", " + point.z.toFixed( 1 ) + " )";

						//Modofied to convert start and end points to real world values
						tableColumnValue.innerHTML = "( " + (point.x * editor.commonMeasurements.targetConversionFactor ).toFixed( 1 ) + ", " + (point.y * editor.commonMeasurements.targetConversionFactor ).toFixed( 1 ) + ", " + (point.z * editor.commonMeasurements.targetConversionFactor ).toFixed( 1 ) + " )";

						htmlTableValueRow.appendChild( tableColumnValue );

					}
					//Modified start
					else if( infoUpper === 'ELEVATION' ){

						tableColumnValue.setAttribute( 'id', key + "__row__labelHeight" );
						var elevation = data[ measurementItem ][ info ];
						var heightInput = document.createElement( 'input' );
						heightInput.setAttribute( 'id', key + "__row__labelHeight__input" );
						heightInput.className = "length__table__height__input";
						heightInput.setAttribute( "type", "number" );
						//heightInput.setAttribute( "id", "number" );
						heightInput.setAttribute( "step", "0.1" );
						heightInput.setAttribute( "size", "1" );
						elevation = Number( elevation );
						heightInput.value = elevation.toFixed(1);
						tableColumnValue.appendChild( heightInput );
						htmlTableValueRow.appendChild( tableColumnValue );

						heightInput.addEventListener( 'change', function( event ){

							var parentValue = event.target.parentNode.parentNode.getAttribute( 'value' );
							
							if( parentValue ){

								var startPoint, endPoint;
								var heightValue = Number( event.target.value );
								var currentLineSession = editor.scene.getObjectByProperty( 'uuid', parentValue);
								
								currentLineSession.traverse( function( child ){

									if( child instanceof THREE.Mesh && ( child.name === 'StartMeasurementMarker' ) ){
										
										startPoint = child;

									} else if( child instanceof THREE.Mesh && ( child.name === 'EndMeasurementMarker' ) ){

										endPoint = child;

									} 

								} );

								if( startPoint!= null && startPoint!= undefined && endPoint!= null && endPoint!= undefined ){

									var changeInHeight, elevation;
									var startOrginalPosition = startPoint.position.clone();
						
									startPoint.position.setY( heightValue/editor.lengthMeasurement.measurementControls.targetConversionFactor );
									editor.signals.changeLengthMeasurementHeight.dispatch( startPoint );
									editor.signals.sceneGraphChanged.dispatch();

									elevation = startPoint.position.y.toFixed(1);
									changeInHeight = Math.abs( startOrginalPosition.y - startPoint.position.y );
									
									if( startOrginalPosition.y > startPoint.position.y ){

										endPoint.position.setY( endPoint.position.y - changeInHeight );
										editor.signals.changeLengthMeasurementHeight.dispatch( endPoint );
										editor.signals.sceneGraphChanged.dispatch();

									} else if( startOrginalPosition.y < startPoint.position.y ){

										endPoint.position.setY( endPoint.position.y + changeInHeight );
										editor.signals.changeLengthMeasurementHeight.dispatch( endPoint );
										editor.signals.sceneGraphChanged.dispatch();

									}

								}
								editor.signals.measurementEdited.dispatch( currentLineSession, { elevation : elevation, updateTable : false } );

							}

						} );

					}
					//Modified end
					else if( infoUpper === 'LABEL' ){

						tableColumnValue.contentEditable = true;
						tableColumnValue.setAttribute( 'class', 'editable__table__cell' );
						tableColumnValue.innerHTML = data[ measurementItem ][ info ];
						
						tableColumnValue.addEventListener( 'keydown', function( event ){
							
							if( event.keyCode === 13 ){
								event.preventDefault();
							}
							
						} );

						tableColumnValue.addEventListener( 'blur', function( event ){
							
							event.preventDefault();
							var editedText = event.target.innerHTML;
							var parentValue = event.target.parentNode.getAttribute( 'value' ), currentLine;
							
							if( parentValue ){

								editor.selectByUuid( parentValue );
								currentLine = editor.selected;
								var oldUserDataItem = editor.scene.userData.measurementDatas[ currentLine.uuid ];
								if( editedText === "" ){
									
									if( oldUserDataItem != undefined ){
										
										event.target.innerHTML = oldUserDataItem.label;

									}

								}
								else if( oldUserDataItem != undefined && oldUserDataItem.label != editedText ){

									editor.signals.measurementEdited.dispatch( currentLine, { label : editedText, updateTable : false } );

								}

							}
							
						} );

						htmlTableValueRow.appendChild( tableColumnValue );

					}
					else{

						tableColumnValue.innerHTML = data[ measurementItem ][ info ];
						htmlTableValueRow.appendChild( tableColumnValue );

					}

				}

				htmlTableBody.appendChild( htmlTableValueRow );
			
			}

			this.measurementTable.setBody( htmlTableBody );

		}
		else{

			console.warn( "Measurement data is empty!" );

		}

	},

	deActivateControls : function(){

		var scope = this;
		var enableMeasurement = document.getElementById( 'enable-measure-mode-li' );
		var measureGrp = document.getElementById( 'measure-group-dropdown-button' );
		enableMeasurement.innerHTML = "<a>" + editor.languageData.EnableLengthMeasurement + "</a>";
		enableMeasurement.className = "deactivated";

		editor.isMeasuring = false;
		editor.enableDisableToggle = false;
		scope.measurementControls.deActivate();

		//if( editor.lengthShowHideToggle === false && editor.areaShowHideToggle === false && editor.isAreaMeasuring === false && editor.isMeasuring === false ){
		if( editor.msrmntsShowHideToggle === false && editor.isAreaMeasuring === false && editor.isMeasuring === false ){

			measureGrp.style.color = "#000000";
			measureGrp.innerHTML = '<span class="fa fa-object-group span-font-21"></span>';

		}

		//editor.isMeasuring = false;
		//editor.enableDisableToggle = false;
		//scope.measurementControls.deActivate();

		//Modified to hide the measurement group (if it is visible) when the controls are disabled start
		if( editor.msrmntsShowHideToggle === false ){

			//if( editor.lengthShowHideToggle === true ){//
				//showMeasurementsLi.click();//
			//}//
			editor.scene.traverse( function( child ){

				if( child instanceof THREE.Group && child.name == "MeasurementSession" ){

					child.visible = false;
	
				}
	
			} );
			editor.signals.sceneGraphChanged.dispatch();

		}
		//Modified to hide the measurement group (if it is visible) when the controls are disabled end

	},

}