/**
 * AreaMeasurements( editor, viewport ) - Coordinates the operations of area measurement controls.
 * This class uses the AreaMeasurementControls internally to perform the measurement operations.
 * It can also be used as the entry point for everything which is related to area measurements.
 * Attach the signal listeners here if something related with area measurements need to be performed with that signal
 * @constructor
 * @param {any} editor - The instance of the Editor which manages the overall objects and signals
 * @param {any} viewport - The parent DOM for the renderer's DOM element
 * @author Hari
 * @returns {Object}
 * @example <caption>Instanciation of this class is very much straight forward</caption>
 * var viewport = document.getElementById( 'viewport' );
 * var msrmt = new AreaMeasurements( editor, viewport );
 */
var AreaMeasurements = function ( editor, viewport ){

	var scope = this;
	var view = document.getElementById( 'viewport' );

	this.collectedBaseUnit;
	this.collectedTargetUnit;
	this.collectedConFactor;

	this.initUI();
	this.measurementTableWindow = new UI.MobileWindow( 'area__measurement__table__window' );
	document.getElementById( 'editorElement' ).appendChild( this.measurementTableWindow.dom );

	this.measurementTable = new HtmlTable( 'area__measurements__table' );

	var measurementTableWindowBody = document.createElement( 'div' );
	measurementTableWindowBody.setAttribute( 'id', 'area__table__window__body' );
	measurementTableWindowBody.setAttribute( 'class', 'table-responsive' );
	measurementTableWindowBody.appendChild( this.measurementTable.table );

	this.measurementTableWindow.setBody( measurementTableWindowBody );
	this.measurementTableWindow.setHeading( editor.languageData.AreaMeasurements );
	
	//this.measurementTableWindow.headerCloseBtn.disabled = true;

	var areaTableResizeCallback = function( event, ui ){
		
		var paddingBottomNeeded =  10, paddingLeftNeeded = 10;

		document.getElementById( 'area__table__window__body' ).style.width = ( this.measurementTableWindow.dom.offsetWidth - ( paddingLeftNeeded * 2 ) )+ "px";
		document.getElementById( 'area__table__window__body' ).style.marginLeft = paddingLeftNeeded + "px";

		document.getElementById( 'area__table__window__body' ).style.height = ( this.measurementTableWindow.body.offsetHeight - ( paddingBottomNeeded * 2 ) ) + "px";
		document.getElementById( 'area__table__window__body' ).style.marginTop = paddingBottomNeeded + "px";
		
	}

	this.measurementTableWindow.setResizable( false, 1.7, 155, 90, 700, 400, areaTableResizeCallback.bind( this ) );
	this.measurementTableWindow.setDraggable();
	
	this.measurementControls = new AreaMeasurementControls( { camera : editor.camera, areaOfScope : view, baseUnit : "meter", baseConversionFactor : 1, maxPolygonPoints : 4 }, editor );

	//var measurementRow = new UI.Row();
	//var elem = document.getElementById( "measure-tool-btn-content" );

	var enableMeasurementLi = document.getElementById( 'area-enable-measure-mode-li' );
	var measureGrpDrpDwnBtn = document.getElementById( 'measure-group-dropdown-button' );
	var showMeasurementsLi = document.getElementById( 'area-show-measurements-li' );
	var configureMeasurementsLi = document.getElementById( 'configure-measurement-li' );

	var startNetworkingLi = document.getElementById( 'start-networking-li' );
	var showHideNetworkingLi = document.getElementById( 'show-hide-networking-li' );
	var editNetworkCablesLi = document.getElementById( 'edit-networking-li' );
	var autoRoutingLi = document.querySelector('#start-autorouting-li');

	if( enableMeasurementLi ){

		enableMeasurementLi.addEventListener( 'click', function( event ){

			var child = editor.scene.children;

			if( editor.isMeasuring === true ){

				//toastr.warning( editor.languageData.Youcantactivatebothareameasurementandlengthmeasurementatatime );
				//return;
				if( editor.selectedView === true ){
					toastr.warning( editor.languageData.Areameasurementsinthe3Dviewisnotsupportedcurrently );
					return;
				}
				else if( editor.selectedView === false && editor.type2dView > 1 ){
					toastr.warning( editor.languageData.Areameasurementsinthe3Dviewisnotsupportedcurrently );
					return;
				}
				var enableLengthMeasurementLi = document.getElementById( 'enable-measure-mode-li' );
				enableLengthMeasurementLi.click();

			}
			//editor.selectedView === false implies editor is in one of the 2D views
			if( editor.selectedView === false && editor.type2dView < 2 ){

				if( editor.areaEnableDisableToggle === false ){

					if( child.length > 2 ){

						if( editor.isntwrkngStarted == true ) {

							startNetworkingLi.click();
		
						}

						if( editor.isAutoRoutingStrtd == true ) {

							autoRoutingLi.click();
		
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

						if( editor.isTwoDMeasurementEnabled === true ) {

							var enableTwoDMeasurements = document.getElementById('twod-enable-measure-mode-li');
							enableTwoDMeasurements.click();

						}

						if( editor.twoDDrawingsShowHideToggle === true ) {

							var showHideTwoDMeasurements = document.getElementById('twod-show-measurements-li');
							showHideTwoDMeasurements.click();

						}

						enableMeasurementLi.innerHTML = "<a>" + editor.languageData.DisableAreaMeasurements + "</a>";
						enableMeasurementLi.className = "activated";
						measureGrpDrpDwnBtn.style.color = "#500080";
						measureGrpDrpDwnBtn.innerHTML = '<span class="fa fa-object-group span-font-21 faa-pulse animated"></span>';
						editor.isAreaMeasuring = true;
						editor.areaEnableDisableToggle = true;
						scope.measurementControls.activate();
						
						//Modified to show the measurement group when the controls are enabled start
						editor.scene.traverse( function( child ){

							if( child instanceof THREE.Group && child.name == "AreaMeasurementSession" ){

								child.visible = true;
				
							}
				
						} );

						editor.signals.sceneGraphChanged.dispatch();
						//Modified to show the measurement group when the controls are enabled end
						toastr.success( editor.languageData.areaMeasurementActivated );

					}
					else{
						
						toastr.warning( editor.languageData.ItappearsthatnoobjectshavebeenaddedtothesceneYoucantactivatemeasurementsonanemptyscene );

					}

				}
				else{

				enableMeasurementLi.innerHTML = "<a>" + editor.languageData.EnableAreaMeasurements + "</a>";
				enableMeasurementLi.className = "deactivated";

				editor.isAreaMeasuring = false;
				editor.areaEnableDisableToggle = false;
				scope.measurementControls.deActivate();

				//if( editor.lengthShowHideToggle === false && editor.areaShowHideToggle === false && editor.isAreaMeasuring === false && editor.isMeasuring === false ){
				if( editor.msrmntsShowHideToggle === false && editor.isAreaMeasuring === false && editor.isMeasuring === false ){

					measureGrpDrpDwnBtn.style.color = "#000000";
					measureGrpDrpDwnBtn.innerHTML = '<span class="fa fa-object-group span-font-21"></span>';

				}

				//editor.isAreaMeasuring = false;
				//editor.areaEnableDisableToggle = false;
				//scope.measurementControls.deActivate();

				//Modified to hide the measurement group (if it is visible) when the controls are disabled start
				if( editor.msrmntsShowHideToggle === false ){
					
					//if( editor.areaShowHideToggle === true ){//
						//showMeasurementsLi.click();//
					//}//
					editor.scene.traverse( function( child ){

						if( child instanceof THREE.Group && child.name == "AreaMeasurementSession" ){

							child.visible = false;
			
						}
			
					} );
					editor.signals.sceneGraphChanged.dispatch();

				}
				//Modified to hide the measurement group (if it is visible) when the controls are disabled end

			}

			}
			else{

				toastr.warning( editor.languageData.Areameasurementsinthe3Dviewisnotsupportedcurrently );

			}

		} );

	}

	if( showMeasurementsLi ){

		showMeasurementsLi.addEventListener( 'click', function( event ){

			if( editor.selectedView === true ){

				toastr.warning(  editor.languageData.Areameasurementfeaturesarecurrentlyavailableonlyon2Dtopview );
				return;

			}

			if( editor.areaShowHideToggle === false ){

				if( editor.scene.userData.areaMeasurementDatas != undefined && Object.keys( editor.scene.userData.areaMeasurementDatas ).length != 0 ){
					
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

					scope.updateTable( editor.scene.userData.areaMeasurementDatas );
					scope.measurementTableWindow.show();

					editor.scene.traverse( function( child ){

						if( child instanceof THREE.Group && child.name == "AreaMeasurementSession" ){

							child.visible = true;
			
						}
			
					} );

					editor.signals.sceneGraphChanged.dispatch();

					showMeasurementsLi.innerHTML = "<a>" + editor.languageData.HideAreaMeasurements + "</a>";
					showMeasurementsLi.className = "activated";
					measureGrpDrpDwnBtn.style.color = "#500080";
					measureGrpDrpDwnBtn.innerHTML = '<span class="fa fa-object-group span-font-21 faa-pulse animated"></span>';
					editor.areaShowHideToggle = true;

				}
				else{

					toastr.warning( editor.languageData.AreaMeasurementsdatanotfound );

				}

			}
			else{

				if( editor.isAreaMeasuring === false ){
					
					editor.scene.traverse( function( child ){

						if( child instanceof THREE.Group && child.name == "AreaMeasurementSession" ){

							child.visible = false;
			
						}
			
					} );

				}

				editor.signals.sceneGraphChanged.dispatch();

				showMeasurementsLi.innerHTML = "<a>" + editor.languageData.ShowAreaMeasurements + "</a>";
				showMeasurementsLi.className = "deactivated";

				editor.areaShowHideToggle = false;
				scope.measurementTableWindow.hide();

				//if( editor.areaEnableDisableToggle === false ){
				if( editor.lengthShowHideToggle === false && editor.areaShowHideToggle === false && editor.isAreaMeasuring === false && editor.isMeasuring === false ){

					measureGrpDrpDwnBtn.style.color = "#000000";
					measureGrpDrpDwnBtn.innerHTML = '<span class="fa fa-object-group span-font-21"></span>';

				}

				//editor.areaShowHideToggle = false;
				//scope.measurementTableWindow.hide();

			}

		} );

	}

	this.measurementTableWindow.headerCloseBtn.addEventListener( 'click', function( event ){

		//showMeasurementsLi.click();
		scope.measurementTableWindow.hide();
		editor.deselect();

	} );

	//Listener for showAllMeasurements
	editor.signals.showAllMeasurements.add( function(){

		if( editor.selectedView === true || ( editor.selectedView === false && editor.type2dView != 1 ) ){

			toastr.warning(  editor.languageData.Areameasurementfeaturesarecurrentlyavailableonlyon2Dtopview );
			return;

		}

		if( editor.scene.userData.areaMeasurementDatas != undefined && Object.keys( editor.scene.userData.areaMeasurementDatas ).length != 0 ){

			scope.updateTable( editor.scene.userData.areaMeasurementDatas );
			scope.measurementTableWindow.show();
	
			editor.scene.traverse( function( child ){
	
				if( child instanceof THREE.Group && child.name == "AreaMeasurementSession" ){
	
					child.visible = true;
	
				}
	
			} );
	
			editor.signals.sceneGraphChanged.dispatch();
			editor.areaShowHideToggle = true;
	
		}
		else{
	
			toastr.warning( editor.languageData.AreaMeasurementsdatanotfound );
	
		}

	} );
	//

	//Listener for hideAllMeasurements
	editor.signals.hideAllMeasurements.add( function(){

		if( editor.isAreaMeasuring === false ){
		
			editor.scene.traverse( function( child ){
	
				if( child instanceof THREE.Group && child.name == "AreaMeasurementSession" ){
	
					child.visible = false;
	
				}
	
			} );
	
		}
	
		editor.signals.sceneGraphChanged.dispatch();
		editor.areaShowHideToggle = false;
		scope.measurementTableWindow.hide();

	} );
	//

	//Listener to update the scene userData when a measurement is removed
	editor.signals.objectRemoved.add( function( object ){

        if( object.name === "AreaSelectionRectangle" ){

			var key = object.uuid;

			//Modified for activity logging start
			try{

				//Modified for activity logging start
				if( editor.scene.userData.areaMeasurementDatas != undefined && editor.scene.userData.areaMeasurementDatas[ key ] != undefined ){

					var removedLabel = editor.scene.userData.areaMeasurementDatas[ key ][ "label" ];

				}

				var logDatas = {};
				logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Area measurement " + removedLabel + " removed";
				logger.addLog( logDatas );
				logger.sendLogs( localStorage.getItem( 'U_ID' ) );
				//Modified for activity logging end

			}
			catch( exception ){

				console.log( "Logging failed!" );
				console.log( exception );

			}
			//Modified for activity logging end

			if( editor.scene.userData.areaMeasurementDatas[ key ] != undefined ){
				
				delete editor.scene.userData.areaMeasurementDatas[ key ];
				var deletedMeasurementRow = document.getElementById( object.uuid + "__area__measure__row" );
				if( deletedMeasurementRow != null ){

					scope.measurementTable.removeRow( deletedMeasurementRow );

				}

			}
			editor.deselect();
			toastr.info( editor.languageData.Selectedmeasurementandassociateddatahasbeenremoved );

			object.traverse( function( subChild ){

				if( subChild instanceof THREE.Sprite && subChild.name === "AreaMeasureValueBadge" ){
					
					var childIndex = editor.areaBadges.indexOf( subChild );
					if( childIndex != -1 ){

						editor.areaBadges.splice( childIndex, 1 );

					}
					
				}
				else if( subChild instanceof THREE.Mesh && (/^(AreaMeasureMarker[1-4])/g).test(subChild.name) ){
					
					var childIndex = editor.areaEndMarkers.indexOf( subChild );
					if( childIndex != -1 ){

						editor.areaEndMarkers.splice( childIndex, 1 );

					}
					
				}

			} );

		}
		else{

			var lineId;
			object.traverse( function( child ){

				if( child.name === "AreaSelectionRectangle" ){

					lineId = child.uuid;
					if( editor.scene.userData.areaMeasurementDatas[ lineId ] != undefined ){

						delete editor.scene.userData.areaMeasurementDatas[ lineId ];
						var deletedMeasurementRow = document.getElementById( child.uuid + "__area__measure__row" );
						if( deletedMeasurementRow != null ){

							scope.measurementTable.removeRow( deletedMeasurementRow );

						}

					}

				}
				else if( child instanceof THREE.Sprite && child.name === "AreaMeasureValueBadge" ){
							
					var childIndex = editor.areaBadges.indexOf( child );
					if( childIndex != -1 ){

						editor.areaBadges.splice( childIndex, 1 );

					}
					
				}
				else if( child instanceof THREE.Mesh && (/^(AreaMeasureMarker[1-4])/g).test(child.name) ){
							
					var childIndex = editor.areaEndMarkers.indexOf( child );
					if( childIndex != -1 ){

						editor.areaEndMarkers.splice( childIndex, 1 );

					}
					
				}

			} );
			editor.deselect();
			//toastr.info( "AreaMeasurements data associated with the object is also removed" );

		}

	} );
	
	editor.signals.newAreaMeasurementAdded.add( function( measuredData ){

		var key = measuredData.lineUuid;
		delete measuredData.lineUuid;
		var htmlTableValueRow = document.createElement( 'tr' );
		htmlTableValueRow.setAttribute( 'value', key );
		htmlTableValueRow.setAttribute( 'id', key + "__area__measure__row" );
		
		htmlTableValueRow.addEventListener( 'click', function( event ){
			editor.selectByUuid( this.getAttribute( 'value' ) );
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
				tableColumnValue.innerHTML = "( " + point.x.toFixed( 1 ) + ", " + point.y.toFixed( 1 ) + ", " + point.z.toFixed( 1 ) + " )";
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
						var oldUserDataItem = editor.scene.userData.areaMeasurementDatas[currentLine.uuid];
						if( editedText === "" ){
							
							if( oldUserDataItem != undefined ){
								
								event.target.innerHTML = oldUserDataItem.label;

							}

						}
						else if( oldUserDataItem != undefined && oldUserDataItem.label != editedText ){

							editor.signals.areaMeasurementEdited.dispatch( currentLine, { label : editedText, updateTable : false } );

						}

					}
					
				} );
				htmlTableValueRow.appendChild( tableColumnValue );
			}
			else{

				tableColumnValue.innerHTML = measuredData[ info ];
				htmlTableValueRow.appendChild( tableColumnValue );

			}

		}
		
		scope.measurementTable.addRow( htmlTableValueRow );

		if( editor.msrmntsShowHideToggle === true && editor.areaShowHideToggle === false ){
			editor.signals.showAllMeasurements.dispatch();
		}

		//Modified for activity logging start
		try{

			//Modified for activity logging start
			var logDatas = {};
			logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : New area measurement added : " + measuredData[ "label" ] + " : " + measuredData[ "area" ] + " " + measuredData[ "unit" ];
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

		/*if( editor.areaShowHideToggle === true ){

			showMeasurementsLi.click();

		}*/

		if( editor.areaEnableDisableToggle === true ){

			enableMeasurementLi.click();

		}

	} );

	//Modified to add listener for the projectDataLoaded signal start
	//When this signal is caught, we have to find the measurement groups from the scene
	//push all of the identified measurement groups to the editor.measureGroups array.
	//Hide all the measurement groups initially
	editor.signals.projectDataLoaded.add( function(){

		editor.areaBadges = [];
		editor.areaEndMarkers = [];
		editor.scene.traverse( function( child ){

			if( child instanceof THREE.Group && child.name == "AreaMeasurementSession" ){

				//editor.measureGroups.push( child );
				child.visible = false;

				child.traverse( function( subChild ){

					if( subChild instanceof THREE.Sprite && subChild.name === "AreaMeasureValueBadge" ){

						//AreaMeasurements value badge is a sprite and is the child of the connection line
						//so 'subChild.parent.uuid' will give the uuid of the connection line
						var badgeLabelText = editor.scene.userData.areaMeasurementDatas[ subChild.parent.uuid ][ 'badgeLabel' ];

						if( badgeLabelText != undefined ){

							var badgeTexture = scope.measurementControls.getNumberBadge( { badgeText : badgeLabelText, badgeWidth : 105, badgeHeight : 35, fontSize : "16px", fontColor : "#500080", strokeColor : "#500080", borderRadius : 7, type : "image" } );

							subChild.material.map = badgeTexture;

							editor.areaBadges.push( subChild );

						}

					}
					else if( subChild instanceof THREE.Mesh && (/^(AreaMeasureMarker[1-4])/g).test(subChild.name) ){

						editor.areaEndMarkers.push( subChild );

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

	//Modified to add listener for 'measurementConfigurationChanged' signal start
	editor.signals.measurementConfigurationChanged.add( function( baseUnit, convFactor, targetUnit ){

		scope.measurementControls.setBaseUnit( baseUnit, convFactor );
		scope.measurementControls.setTargetUnit( targetUnit );

	} );
	//Modified to add listener for 'measurementConfigurationChanged' signal end

	//Modified to add listener for the measurement changed signal start
	editor.signals.areaMeasurementEdited.add( function( changedMeasurementLine, options ){

		try{

			if( editor.scene.userData.areaMeasurementDatas[ changedMeasurementLine.uuid ] != undefined ){

				var selectedRowId = changedMeasurementLine.uuid + "__area__measure__row";
				var selectedRow = document.getElementById( selectedRowId );

				if(options.label){
					editor.scene.userData.areaMeasurementDatas[ changedMeasurementLine.uuid ].label = options.label;
					if( options.updateTable != undefined && options.updateTable === true && selectedRow ){
						scope.measurementTable.editColumn( selectedRow, "Label", options.label );
					}
				}
				if(options.area){
					editor.scene.userData.areaMeasurementDatas[ changedMeasurementLine.uuid ].area = options.area;
					if( options.updateTable != undefined && options.updateTable === true && selectedRow ){
						scope.measurementTable.editColumn( selectedRow, "Area", options.area );
					}
				}
				if(options.badgeLabel){
					editor.scene.userData.areaMeasurementDatas[ changedMeasurementLine.uuid ].badgeLabel = options.badgeLabel;
				}
				if(options.unit){
					editor.scene.userData.areaMeasurementDatas[ changedMeasurementLine.uuid ].unit = options.unit;
					if( options.updateTable != undefined && options.updateTable === true && selectedRow ){
						scope.measurementTable.editColumn( selectedRow, "Unit", options.unit );
					}
				}

				toastr.success( editor.languageData.Datasuccessfullyupdated );
				editor.signals.measurementEditingCompleted.dispatch( { measurementType : "area", label : options.label, rowId : selectedRowId, lineUuid : changedMeasurementLine.uuid } );

			}
			/*if( options.updateTable != undefined && options.updateTable === true ){

				var selectedRowId = changedMeasurementLine.uuid + "__area__measure__row";
				var selectedRow = document.getElementById( selectedRowId );
				if( selectedRow ){
					
					scope.measurementTable.editColumn( selectedRow, "Label", options.label );
					toastr.success( editor.languageData.Datasuccessfullyupdated );
					editor.signals.measurementEditingCompleted.dispatch( { measurementType : "area", label : options.label, rowId : selectedRowId, lineUuid : changedMeasurementLine.uuid } );
		
				}
				else{
					console.warn( "Failed to update table" );
				}

			}
			else{

				toastr.success( editor.languageData.Datasuccessfullyupdated );
				editor.signals.measurementEditingCompleted.dispatch( { measurementType : "area", label : options.label, rowId : selectedRowId, lineUuid : changedMeasurementLine.uuid } );

			}*/

		}
		catch( error ){

			toastr.error( editor.languageData.SorrysomethingwentwrongPleasetryagainaftersometime );
			console.warn( error );

		}

	} );
	//Modified to add listener for the measurement changed signal end

}

AreaMeasurements.prototype = {

	constructor : AreaMeasurements,

	initUI : function(){

		var scope = this;

	},

	/**
	 * updateTable( data ) - Updates the measurement table with data supplied
	 * @param {Object} data - The measurement data as an object.
	 * Structure of the data should be like,
	 * { 
	 *     <measurement line uuid> : {
	 * 	   label : <Measurement label>,
	 * 	   area : <Number>,
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
		//			label : <AreaMeasurements label>,
		//			area : <Number>,
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
				htmlTableValueRow.setAttribute( 'id', key + "__area__measure__row" );
				
				htmlTableValueRow.addEventListener( 'click', function( event ){
					editor.selectByUuid( this.getAttribute( 'value' ) );
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
						tableColumnValue.innerHTML = "( " + point.x.toFixed( 1 ) + ", " + point.y.toFixed( 1 ) + ", " + point.z.toFixed( 1 ) + " )";
						htmlTableValueRow.appendChild( tableColumnValue );

					}
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
								var oldUserDataItem = editor.scene.userData.areaMeasurementDatas[ currentLine.uuid ];
								if( editedText === "" ){
									
									if( oldUserDataItem != undefined ){
										
										event.target.innerHTML = oldUserDataItem.label;

									}

								}
								else if( oldUserDataItem != undefined && oldUserDataItem.label != editedText ){

									editor.signals.areaMeasurementEdited.dispatch( currentLine, { label : editedText, updateTable : false } );

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

			console.warn( "AreaMeasurements data is empty!" );

		}

	},

	showAreaMeasurements : function(){

		var scope = this;
		if( editor.selectedView === true ){

			toastr.warning(  editor.languageData.Areameasurementfeaturesarecurrentlyavailableonlyon2Dtopview );
			return;

		}

		if( editor.scene.userData.areaMeasurementDatas != undefined && Object.keys( editor.scene.userData.areaMeasurementDatas ).length != 0 ){

			scope.updateTable( editor.scene.userData.areaMeasurementDatas );
			scope.measurementTableWindow.show();
	
			editor.scene.traverse( function( child ){
	
				if( child instanceof THREE.Group && child.name == "AreaMeasurementSession" ){
	
					child.visible = true;
	
				}
	
			} );
	
			editor.signals.sceneGraphChanged.dispatch();
			//editor.areaShowHideToggle = true;
	
		}
		else{
	
			toastr.warning( editor.languageData.AreaMeasurementsdatanotfound );
	
		}

	},

	hideAreaMeasurements : function(){

		var scope = this;
		if( editor.isAreaMeasuring === false ){
		
			editor.scene.traverse( function( child ){
	
				if( child instanceof THREE.Group && child.name == "AreaMeasurementSession" ){
	
					child.visible = false;
	
				}
	
			} );
	
		}
	
		editor.signals.sceneGraphChanged.dispatch();
		//editor.areaShowHideToggle = false;
		scope.measurementTableWindow.hide();

	},

}