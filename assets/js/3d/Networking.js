/**
 * Networking( editor, viewport ) - Coordinates the operations of cable drawing of NetworkCableDesigner.
 * This class uses the NetworkCableDesigner internally to perform the cabling operations.
 * It can also be used as the entry point for everything which is related to cabling operations.
 * Attach the signal listeners here if something related with cabling operations need to be performed with that signal
 * @constructor
 * @param {any} editor - The instance of the Editor which manages the overall objects and signals
 * @param {any} viewport - The parent DOM for the renderer's DOM element
 * @author Hari
 * @returns {Void}
 * @example <caption>Example usage of Networking</caption>
 * var viewport = document.getElementById( 'viewport' );
 * var networking = new Networking( editor, viewport );
 */
var Networking = function( editor,viewport ){

    this.collectedBaseUnit;
	this.collectedTargetUnit;
	this.collectedConFactor;

	this.badgeFontColor = "#0b0c5b";
    this.badgeStrokeColor = "#0b0c5b";

    var view = document.getElementById( 'viewport' );
	var startNetworkingLi = document.getElementById( 'start-networking-li' );
	var networkGrpDrpDwnBtn = document.getElementById( 'network-group-dropdown-button' );
	var showHideNetworkingLi = document.getElementById( 'show-hide-networking-li' );
	var editNetworkCablesLi = document.getElementById( 'edit-networking-li' );
	
	var enableMeasurementLi = document.getElementById( 'enable-measure-mode-li' );	
	var showMeasurementsLi = document.getElementById( 'show-measurements-li' );	
	var showAllMsrmntsLi = document.getElementById( "show-all-measurements-li" );
	var enableAreaMeasurementLi = document.getElementById( 'area-enable-measure-mode-li' );
	var showAreaMeasurementsLi = document.getElementById( 'area-show-measurements-li' );
	var autoRoutingLi = document.querySelector('#start-autorouting-li');

    var child = editor.scene.children;

    this.networkDesigner = new NetworkCableDesigner( {  areaOfScope : view,camera : editor.camera , baseUnit : "meter", baseConversionFactor : 1}, editor );
    var scope = this;

    this.networkTableWindow = new UI.MobileWindow( 'network__table__window' );
	document.getElementById( 'editorElement' ).appendChild( this.networkTableWindow.dom );

	this.networkTable = new HtmlTable( 'network__table' );
	
    var networkTableWindowBody = document.createElement( 'div' );
	networkTableWindowBody.setAttribute( 'id', 'nw__table__window__body' );
	networkTableWindowBody.setAttribute( 'class', 'table-responsive' );
	networkTableWindowBody.appendChild( this.networkTable.table );

	this.networkTableWindow.setBody( networkTableWindowBody );
	this.networkTableWindow.setHeading( editor.languageData.NetworkingDetails );

	//this.networkTableWindow.headerCloseBtn.disabled = true;
	
	var resizeCallback = function( event, ui ){
		
		var paddingBottomNeeded =  10, paddingLeftNeeded = 10;

		document.getElementById( 'nw__table__window__body' ).style.width = ( this.networkTableWindow.dom.offsetWidth - ( paddingLeftNeeded * 2 ) )+ "px";
		document.getElementById( 'nw__table__window__body' ).style.marginLeft = paddingLeftNeeded + "px";

		document.getElementById( 'nw__table__window__body' ).style.height = ( this.networkTableWindow.body.offsetHeight - ( paddingBottomNeeded * 2 ) ) + "px";
		document.getElementById( 'nw__table__window__body' ).style.marginTop = paddingBottomNeeded + "px";
		
	}

	this.networkTableWindow.setResizable( false, 1.7, 255, 150, 1600, 400, resizeCallback.bind( this ) );
    this.networkTableWindow.setDraggable();
    //


    if( startNetworkingLi ){

		startNetworkingLi.addEventListener( 'click',function( event ){

			var child = editor.scene.children;
	
			if( editor.isntwrkngStarted === false ){

				if( child.length > 2 ){

					if( editor.isMeasuring == true ){

						enableMeasurementLi.click();

					}

					if( editor.isAutoRoutingStrtd == true ) {

						autoRoutingLi.click();
	
					}

					if( editor.isAreaMeasuring == true ){
						
						enableAreaMeasurementLi.click();

					}
					if( editor.msrmntsShowHideToggle === true ){

						showAllMsrmntsLi.click();

					}
					if( editor.isCableEditingEnabled === true ){

						editNetworkCablesLi.click();

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
						
					editor.showNetworkingCables();
					editor.signals.sceneGraphChanged.dispatch();

					startNetworkingLi.innerHTML = "<a>" + editor.languageData.DisableNetworking + "</a>";
					startNetworkingLi.className = "activated";
					networkGrpDrpDwnBtn.style.color = "#500080";
					networkGrpDrpDwnBtn.innerHTML = '<span class="fa fa-plug span-font-26 faa-pulse animated"></span>';
					toastr.success(editor.languageData.Networkcontrolsactivated);
					scope.networkDesigner.activate();
					editor.isntwrkngStarted = true;

					//Modified for activity logging start
					try {

						var logDatas = {};
						logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Enabled networking mode";
						logger.addLog( logDatas );
						logger.sendLogs( localStorage.getItem( 'U_ID' ) );
			
					}
					catch( exception ) {
			
						console.log( "Logging failed!" );
						console.log( exception );
			
					}
					//Modified for activity logging end

				}
				else{
					toastr.warning( editor.languageData.ItappearsthatnoobjectshavebeenaddedtothesceneYoucantactivatenetworkcontrolsonanemptyscene );
				}
			}
			else if( editor.isntwrkngStarted === true ){
				
				if( editor.nwShowHideToggle == false ){
					editor.hideNetworkingCables();
					editor.signals.sceneGraphChanged.dispatch();
				}
				if( editor.nwShowHideToggle == false ){
					networkGrpDrpDwnBtn.style.color = "#000000";
					networkGrpDrpDwnBtn.innerHTML = '<span class="fa fa-plug span-font-26"></span>';
				}
				startNetworkingLi.innerHTML = "<a>" + editor.languageData.EnableNetworking + "</a>";
				startNetworkingLi.className = "deactivated";
				scope.networkDesigner.deActivate();
				editor.isntwrkngStarted = false;

				//Modified for activity logging start
				try {

					var logDatas = {};
					logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Disabled networking mode";
					logger.addLog( logDatas );
					logger.sendLogs( localStorage.getItem( 'U_ID' ) );
		
				}
				catch( exception ) {
		
					console.log( "Logging failed!" );
					console.log( exception );
		
				}
				//Modified for activity logging end
				
			}
	
		} );
	}

    if( showHideNetworkingLi ){

        showHideNetworkingLi.addEventListener( 'click' , function( event ){

            if( editor.nwShowHideToggle == false ){
                
                if( editor.scene.userData.cableDatas && Object.keys( editor.scene.userData.cableDatas ).length > 0  ){

					if( editor.isMeasuring == true ){

						enableMeasurementLi.click();

					}
					if( editor.isAreaMeasuring == true ){
						
						enableAreaMeasurementLi.click();

					}
					if( editor.msrmntsShowHideToggle === true ){

						showAllMsrmntsLi.click();

					}
					if( editor.isTwoDMeasurementEnabled === true ) {

						var enableTwoDMeasurements = document.getElementById('twod-enable-measure-mode-li');
						enableTwoDMeasurements.click();

					}

					if( editor.twoDDrawingsShowHideToggle === true ) {

						var showHideTwoDMeasurements = document.getElementById('twod-show-measurements-li');
						showHideTwoDMeasurements.click();

					}

					scope.updateTable( editor.scene.userData.cableDatas );
					scope.networkTableWindow.show();

					editor.showNetworkingCables();
					showHideNetworkingLi.className = "activated";
                    networkGrpDrpDwnBtn.style.color = "#500080";
					networkGrpDrpDwnBtn.innerHTML = '<span class="fa fa-plug span-font-26 faa-pulse animated"></span>';
                    editor.nwShowHideToggle = true; 
                    showHideNetworkingLi.innerHTML = "<a>" + editor.languageData.HideNetworkCables + "</a>"; 
                    editor.signals.sceneGraphChanged.dispatch();

                }
                else{

                    toastr.warning( editor.languageData.NoDataFound );

                }

            }   
            else{
				
				
                //if( editor.scene.userData.cableDatas && Object.keys( editor.scene.userData.cableDatas ).length > 0  ){

					if( editor.isCableEditingEnabled === true ){

						toastr.warning( "You can't hide the networking data before the editing is finished" );
						return false;

					}

					scope.networkTableWindow.hide();
					
					showHideNetworkingLi.className = "deactivated";
					
					if( editor.isntwrkngStarted === false ){
						editor.hideNetworkingCables();
						networkGrpDrpDwnBtn.style.color = "#000000";
						networkGrpDrpDwnBtn.innerHTML = '<span class="fa fa-plug span-font-26"></span>';
					}
				
                    editor.nwShowHideToggle = false;
					showHideNetworkingLi.innerHTML = "<a>" + editor.languageData.ShowNetworkCables + "</a>";
					editor.deselect();
                    editor.signals.sceneGraphChanged.dispatch();

                //}
                
            }

        } );

	}

	if( editNetworkCablesLi ){

		editNetworkCablesLi.addEventListener( 'click',function( event ){

			if( editor.isCableEditingEnabled === false ){

				if( editor.scene.userData.cableDatas == null || Object.keys( editor.scene.userData.cableDatas ).length === 0 ){

					toastr.error( editor.languageData.NoNetworkingCablesAreFound );
					return false;
	
				}
				else{

					if( editor.isntwrkngStarted === true ){

						startNetworkingLi.click();

					}
					if( editor.isAutoRoutingStrtd == true ) {

						autoRoutingLi.click();
	
					}
					if( editor.theatreMode === true ){

						document.getElementById( 'theatre_button' ).click();

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

					toastr.info( editor.languageData.CableEditingEnabledTheCablesPositionChangeswillBeAppliedOnlyAfterDisablingtheEditOption );
					editNetworkCablesLi.innerHTML = "<a>" + editor.languageData.StopCableEditing  + "</a>";
					editNetworkCablesLi.className = "activated";
					editor.isCableEditingEnabled = true;

					editor.scene.traverse( function( child ){

						if( ( ( /^(NetworkMarker[\d+])/g ).test( child.name ) ) ){

							child.scale.set(2,2,2);

						}

						if( child.name === "NetworkCableLengthBadge" ){

							child.visible = false;

						}

					} );

					if( editor.nwShowHideToggle === false ){

						showHideNetworkingLi.click();

					}

					for( var row of scope.networkTable.table.rows ) {

						if( row.rowIndex === 0 ) continue;
						var cols = row.cells;
						var lineUuid = row.getAttribute( "value" );

						for( var col of cols ) {

							switch( col.id ) {

								case ( lineUuid + "__row__label" ):
									col.contentEditable = true;
									col.setAttribute( 'class', 'editable__table__cell' );
									break;

								case ( lineUuid + "__row__length" ):
									break;

								case ( lineUuid + "__row__unit" ):
									break;

								case ( lineUuid + "__row__cablecolor" ):
									var colorInput = document.getElementById( lineUuid + '__row__cablecolor__input' );
									colorInput.disabled =  false;
									break;

								case ( lineUuid + "__row__cableHeight" ):
									var cbleHeightInput = document.getElementById( lineUuid + "__row__cableHeight__input" );
									cbleHeightInput.disabled =  false;
									break;

								case ( lineUuid + "__row__cableHeightUnit" ):
									var cbleHeightUnitInput = document.getElementById( lineUuid + "__row__cableHeightUnit__select" );
									cbleHeightUnitInput.disabled =  false;
									break;

								case ( lineUuid + "__row__numofwires" ):
									col.contentEditable = true;
									col.setAttribute( 'class', 'editable__table__cell' );
									break;

								case ( lineUuid + "__row__cabletype" ):
									var colorInput = document.getElementById( lineUuid + '__row__cabletype__select' );
									colorInput.disabled = false;
									break;

								case ( lineUuid + "__row__cableapplication" ):
									var colorInput = document.getElementById( lineUuid + '__row__cableapplication__select' );
									colorInput.disabled = false;
									break;

								default : break;

							}

						}

					}
					
					editor.signals.sceneGraphChanged.dispatch();

					//Modified for activity logging start
					try {

						var logDatas = {};
						logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Enabled edit networking mode";
						logger.addLog( logDatas );
						logger.sendLogs( localStorage.getItem( 'U_ID' ) );
			
					}
					catch( exception ) {
			
						console.log( "Logging failed!" );
						console.log( exception );
			
					}
					//Modified for activity logging end

				}

			}
			else {

				toastr.success( editor.languageData.CableEditingFinished );
				editNetworkCablesLi.innerHTML = "<a>" + editor.languageData.Editnetworking + "</a>";
				editNetworkCablesLi.className = "deactivated";
				editor.isCableEditingEnabled = false;
				editor.deselect();

				editor.scene.traverse( function( child ) {

					if( ( ( /^(NetworkMarker[\d+])/g ).test( child.name ) ) ) {

						child.scale.set( 0.5, 0.5, 0.5 );

					}

					if( child.name === "NetworkCableLengthBadge" ) {

						var parent = child.parent;
						var newLength = scope.networkDesigner.getCableLength( parent, 30 ); 

						if( Number( editor.scene.userData.cableDatas[ parent.uuid ]["length"] ) != Number( newLength ) ) {

							var editedArray = parent.geometry.attributes.position.array
							var vLen = parent.geometry.attributes.position.array.length;
							var vertexPoint = new THREE.Vector3( editedArray[ vLen - 3 ], editedArray[ vLen - 2 ] + 0.8, editedArray[ vLen - 1 ] );
							child.position.copy( vertexPoint );

							var newbadgeLabelText = newLength.length + ( ( this.targetUnit === "meter" ) ? "m" : "ft" );

							var badgeTexture = scope.networkDesigner.getNumberBadge( { badgeText: newbadgeLabelText, badgeWidth: 125, badgeHeight: 35, fontSize: "16px", fontColor: this.badgeFontColor, strokeColor: this.badgeStrokeColor, borderRadius: 8, type: "image" } );
							child.material.map = badgeTexture;
							child.visible = true;

							editor.signals.networkDataEdited.dispatch( parent, { length : newLength.length, unit : this.targetUnit, updateTable : true } );

						}

					}

				} );

				for( var row of scope.networkTable.table.rows ) {

					if( row.rowIndex === 0 ) continue;
					var cols = row.cells;
					var lineUuid = row.getAttribute( "value" );

					for( var col of cols ) {

						switch( col.id ) {

							case ( lineUuid + "__row__label" ):
								col.contentEditable = false;
								col.removeAttribute( 'class' );
								break;

							case ( lineUuid + "__row__length" ):
								break;

							case ( lineUuid + "__row__unit" ):
								break;

							case ( lineUuid + "__row__cablecolor" ):
								var colorInput = document.getElementById( lineUuid + '__row__cablecolor__input' );
								colorInput.disabled =  true;
								break;

							case ( lineUuid + "__row__cableHeight" ):
								var cbleHeightInput = document.getElementById( lineUuid + "__row__cableHeight__input" );
								cbleHeightInput.disabled =  true;
								break;

							case ( lineUuid + "__row__cableHeightUnit" ):
								var cbleHeightUnitInput = document.getElementById( lineUuid + "__row__cableHeightUnit__select" );
								cbleHeightUnitInput.disabled =  true;
								break;

							case ( lineUuid + "__row__numofwires" ):
								col.contentEditable = false;
								col.removeAttribute( 'class' );
								break;

							case ( lineUuid + "__row__cabletype" ):
								var colorInput = document.getElementById( lineUuid + '__row__cabletype__select' );
								colorInput.disabled = true;
								break;

							case ( lineUuid + "__row__cableapplication" ):
								var colorInput = document.getElementById( lineUuid + '__row__cableapplication__select' );
								colorInput.disabled = true;
								break;

							default : break;

						}

					}

				}

				editor.signals.sceneGraphChanged.dispatch();

				//Modified for activity logging start
				try {

					var logDatas = {};
					logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Disabled edit networking mode";
					logger.addLog( logDatas );
					logger.sendLogs( localStorage.getItem( 'U_ID' ) );
		
				}
				catch( exception ) {
		
					console.log( "Logging failed!" );
					console.log( exception );
		
				}
				//Modified for activity logging end

			}

		} );

	}

	//Modified to close Networking table on clicking header close button start
	this.networkTableWindow.headerCloseBtn.addEventListener( 'click', function(){

		scope.networkTableWindow.hide();

	} );
	//Modified to close Networking table on clicking header close button end

	editor.signals.networkDataEdited.add( function( changedNetworkLine, options ){

		try{
			if( editor.scene.userData.cableDatas[ changedNetworkLine.uuid ] != undefined ){

				var selectedRowId = changedNetworkLine.uuid + "__network__row";
				var selectedRow = document.getElementById( selectedRowId );
				if( options.label ){
					
					editor.scene.userData.cableDatas[ changedNetworkLine.uuid ].label = options.label;
					if( options.updateTable != undefined && options.updateTable === true && selectedRow != null ){
						scope.networkTable.editColumn( selectedRow, "Label", options.label );
					}
					//toastr.success( "Label updated" );

				}
				if( options.cableApplication ){
					
					editor.scene.userData.cableDatas[ changedNetworkLine.uuid ].cableApplication = options.cableApplication;
					if( options.updateTable != undefined && options.updateTable === true && selectedRow != null ){
						scope.networkTable.editColumn( selectedRow, "cableApplication", options.cableApplication );
					}
					//toastr.success( "Cable application updated" );

				}
				if( options.cableType ){
					
					editor.scene.userData.cableDatas[ changedNetworkLine.uuid ].cableType = options.cableType;
					if( options.updateTable != undefined && options.updateTable === true && selectedRow != null ){
						scope.networkTable.editColumn( selectedRow, "cableType", options.cableType );
					}
					//toastr.success( "Cable type updated" );

				}
				if( options.numOfWires != undefined ){
					
					editor.scene.userData.cableDatas[ changedNetworkLine.uuid ].numOfWires = options.numOfWires;
					if( options.updateTable != undefined && options.updateTable === true && selectedRow != null ){
						scope.networkTable.editColumn( selectedRow, "numOfWires", options.numOfWires );
					}
					//toastr.success( "Number of wires updated" );

				}
				if( options.cableColor ){
					
					editor.scene.userData.cableDatas[ changedNetworkLine.uuid ].cableColor = options.cableColor;
					if( options.updateTable != undefined && options.updateTable === true && selectedRow != null ){
						scope.networkTable.editColumn( selectedRow, "cableColor", options.cableColor );
					}
					//toastr.success( "Cable color updated" );

				}
				if( options.cableHeight ){
					
					editor.scene.userData.cableDatas[ changedNetworkLine.uuid ].cableHeight = options.cableHeight;
					if( options.updateTable != undefined && options.updateTable === true && selectedRow != null ){
						scope.networkTable.editColumn( selectedRow, "cableHeight", options.cableHeight );
					}
					//toastr.success( "Cable height updated" );

				}
				if( options.cableHeightUnit ){
					
					editor.scene.userData.cableDatas[ changedNetworkLine.uuid ].cableHeightUnit = options.cableHeightUnit;
					if( options.updateTable != undefined && options.updateTable === true && selectedRow != null ){
						scope.networkTable.editColumn( selectedRow, "cableHeightUnit", options.cableHeightUnit );
					}
					//toastr.success( "Cable height unit updated" );

				}
				if( options.unit ){
					
					editor.scene.userData.cableDatas[ changedNetworkLine.uuid ].unit = options.unit;
					if( options.updateTable != undefined && options.updateTable === true && selectedRow != null ){
						scope.networkTable.editColumn( selectedRow, "unit", options.unit );
					}

				}
				if( options.length ){
					
					editor.scene.userData.cableDatas[ changedNetworkLine.uuid ].length = options.length;
					if( options.updateTable != undefined && options.updateTable === true && selectedRow != null ){
						scope.networkTable.editColumn( selectedRow, "length", options.length );
					}

				}
				toastr.success( editor.languageData.Datasuccessfullyupdated );
				editor.signals.refreshSidebarObject3D.dispatch( changedNetworkLine );
				//oExplorer.refreshList( editor.scene );
				//oExplorer.highlightItem( editor.selected, false );

				//Modified for activity logging start
				try {

					var logDatas = {};
					logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Network data edited " + "\n\t" + JSON.stringify( options );
					logger.addLog( logDatas );
					logger.sendLogs( localStorage.getItem( 'U_ID' ) );
		
				}
				catch( exception ) {
		
					console.log( "Logging failed!" );
					console.log( exception );
		
				}
				//Modified for activity logging end

			}

		}
		catch( error ){

			toastr.error( editor.languageData.SorrysomethingwentwrongPleasetryagainaftersometime );
			console.warn( error );

			//Modified for activity logging start
			try {

				var logDatas = {};
				logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Network data editing failed " + error;
				logger.addLog( logDatas );
				logger.sendLogs( localStorage.getItem( 'U_ID' ) );
	
			}
			catch( exception ) {
	
				console.log( "Logging failed!" );
				console.log( exception );
	
			}
			//Modified for activity logging end

		}

	} );

	//Listener to update the scene userData when a network cable is removed
	editor.signals.objectRemoved.add( function( object ){

        if( object.name === "NetworkingCable" ){

			var key = object.uuid;

			//Modified for activity logging start
			try{

				//Modified for activity logging start
				if( editor.scene.userData.cableDatas != undefined && editor.scene.userData.cableDatas[ key ] != undefined ){

					var removedLabel = editor.scene.userData.cableDatas[ key ][ "label" ];

				}

				var logDatas = {};
				logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Network cable " + removedLabel + " removed";
				logger.addLog( logDatas );
				logger.sendLogs( localStorage.getItem( 'U_ID' ) );
				//Modified for activity logging end

			}
			catch( exception ){

				console.log( "Logging failed!" );
				console.log( exception );

			}
			//Modified for activity logging end

			if( editor.scene.userData.cableDatas != undefined && editor.scene.userData.cableDatas[ key ] != undefined ){
				
				delete editor.scene.userData.cableDatas[ key ];
				var deletedNetworkRow = document.getElementById( object.uuid + "__network__row" );
				if( deletedNetworkRow != null ){

					scope.networkTable.removeRow( deletedNetworkRow );

				}

			}
			editor.deselect();
			toastr.info( editor.languageData.Selectednetworkcableandassociateddatahasbeenremoved );
			object.traverse( function( subChild ){

				if( subChild instanceof THREE.Sprite && subChild.name == "NetworkCableLengthBadge" ){
					
					var childIndex = editor.nwBadges.indexOf( subChild );
					if( childIndex != -1 ){

						editor.nwBadges.splice( childIndex, 1 );

					}
					
				}
				else if( subChild instanceof THREE.Mesh && (/^NetworkMarker\d+/g).test(subChild.name) ){
					
					var childIndex = editor.nwMarkers.indexOf( subChild );
					if( childIndex != -1 ){

						editor.nwMarkers.splice( childIndex, 1 );

					}
					
				}

			} );

		}
		else{

			var lineId;
			object.traverse( function( child ){

				if( child.name === "NetworkingCable" ){

					lineId = child.uuid;
					if( editor.scene.userData.cableDatas != undefined && editor.scene.userData.cableDatas[ lineId ] != undefined ){

						delete editor.scene.userData.cableDatas[ lineId ];
						var deletedNetworkRow = document.getElementById( child.uuid + "__network__row" );
						if( deletedNetworkRow != null ){

							scope.networkTable.removeRow( deletedNetworkRow );

						}

					}

				}
				else if( child instanceof THREE.Sprite && child.name === "NetworkCableLengthBadge" ){
							
					var childIndex = editor.nwBadges.indexOf( child );
					if( childIndex != -1 ){

						editor.nwBadges.splice( childIndex, 1 );

					}
					
				}
				else if( child instanceof THREE.Mesh && (/^NetworkMarker\d+/g).test(child.name) ){
							
					var childIndex = editor.nwMarkers.indexOf( child );
					if( childIndex != -1 ){

						editor.nwMarkers.splice( childIndex, 1 );

					}
					
				}

			} );
			editor.deselect();
			//toastr.info( "Measurement data associated with the object is also removed" );

		}

	} );

	editor.signals.newNetworkCableAdded.add( function( networkData ){

		var htmlTableValueRow = document.createElement( 'tr' );
		htmlTableValueRow.setAttribute( 'value', networkData.lineUuid );
		htmlTableValueRow.setAttribute( 'id', networkData.lineUuid + "__network__row" );
				
		htmlTableValueRow.addEventListener( 'click', function( event ){
			editor.selectByUuid( this.getAttribute( 'value' ) );
		} );
		//var keys = Object.keys(networkData);
		for( var info in networkData){

			var infoUpper = info.toUpperCase();
			var tableColumnValue = document.createElement( 'td' );
			if( infoUpper === 'LINEUUID' ){
				continue;
			}
			else if( infoUpper === 'LABEL' ){

				tableColumnValue.setAttribute( 'id', networkData["lineUuid"] + "__row__label" );
				tableColumnValue.innerHTML = networkData[info];
				
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
						var oldUserDataItem = editor.scene.userData.cableDatas[ currentLine.uuid ];
						if( editedText === "" ){
							
							if( oldUserDataItem != undefined ){
								
								event.target.innerHTML = oldUserDataItem.label;

							}

						}
						else if( oldUserDataItem != undefined && oldUserDataItem.label != editedText ){

							editor.signals.networkDataEdited.dispatch( currentLine, { label : editedText, updateTable : false } );

						}

					}
					
				} );

				htmlTableValueRow.appendChild( tableColumnValue );

			}
			else if( infoUpper === 'CABLECOLOR' ){

				var colorInput = document.createElement( 'input' );
				colorInput.setAttribute( 'type', 'color' );
				colorInput.setAttribute( 'id', networkData["lineUuid"] + "__row__cablecolor__input" );
				colorInput.disabled = true;
				colorInput.setAttribute( 'class', 'text-center nw-table-color-input-element' );
				colorInput.value = networkData[ info ];
				colorInput.addEventListener( 'change', function( event ){
					
					var editedColor = event.target.value;
					var parentValue = event.target.parentNode.parentNode.getAttribute( 'value' ), currentLine;
					
					if( parentValue ){
						editor.selectByUuid( parentValue );
						currentLine = editor.selected;
						var oldUserDataItem = editor.scene.userData.cableDatas[ currentLine.uuid ];
						if( editedColor === "" ){
							
							if( oldUserDataItem != undefined ){
								
								event.target.value = oldUserDataItem.cableColor;

							}

						}
						else if( oldUserDataItem != undefined && oldUserDataItem.cableColor != editedColor ){
							
							

							var newColor = new THREE.Color( this.value );
							currentLine.material.uniforms.color.value = newColor;
							currentLine.material.uniformsNeedUpdate = true;
							currentLine.material.needsUpdate = true;
							editor.signals.sceneGraphChanged.dispatch();

							editor.signals.networkDataEdited.dispatch( currentLine, { cableColor : editedColor, updateTable : false } );

						}

					}
					
				} );
				tableColumnValue.setAttribute( 'id', networkData["lineUuid"] + "__row__cablecolor" );
				tableColumnValue.appendChild( colorInput );
				tableColumnValue.setAttribute( 'class', 'text-center' );
				htmlTableValueRow.appendChild( tableColumnValue );

			}
			else if ( infoUpper === 'CABLEHEIGHT' ){

				tableColumnValue.setAttribute( 'id', networkData[ "lineUuid" ] + "__row__cableHeight" );
				var heightInput = document.createElement( 'input' );
				heightInput.setAttribute( 'id', networkData[ "lineUuid" ] + "__row__cableHeight__input" );
				heightInput.className = "nw__table__cableHeight__input";
				heightInput.setAttribute( "type", "number" );
				heightInput.setAttribute( "step", "0.1" );
				heightInput.value = networkData[ info ];
				heightInput.disabled = true;
				tableColumnValue.appendChild( heightInput );

				heightInput.addEventListener( 'change', function( event ){

					//event.preventDefault();
					var heightValue = event.target.value;
					var parentValue = event.target.parentNode.parentNode.getAttribute( 'value' ), currentLine;

					if( parentValue ){

						editor.selectByUuid( parentValue );
						currentLine = editor.selected;
						var oldUserDataItem = editor.scene.userData.cableDatas[ currentLine.uuid ];
						
						var existingCableVerticesLength = currentLine.geometry.attributes.position.array.length;
						var calculatedHeight = Number( heightValue ) * Number( scope.networkDesigner.conversionFactors[ oldUserDataItem.cableHeightUnit ][ scope.networkDesigner.baseUnit ] );
						calculatedHeight = Number( calculatedHeight.toFixed( 1 ) );
						for( var i = 1; i <= existingCableVerticesLength - 2; i += 3 ){
			
							currentLine.geometry.attributes.position.array[ i ] = calculatedHeight;
			
						}
						currentLine.geometry.attributes.position.needsUpdate = true;

						currentLine.traverse( function( subChild ){

							if( subChild instanceof THREE.Mesh && ( /^NetworkMarker(\d+)/g ).test( subChild.name ) ){
		
								if( calculatedHeight != undefined ){
		
									subChild.position.y = calculatedHeight;
		
								}
		
							}
			
						} );

						editor.select( currentLine );
						//editor.signals.sceneGraphChanged.dispatch();
						editor.signals.objectChanged.dispatch( editor.selected );
						editor.signals.networkDataEdited.dispatch( currentLine, { cableHeight : heightValue, updateTable : false } );

					}

				} );

				htmlTableValueRow.appendChild( tableColumnValue );

			}
			else if ( infoUpper === 'CABLEHEIGHTUNIT' ){

				var heightUnitSelector = document.createElement( 'select' );
				heightUnitSelector.className = "form-control input-sm nw-table-select-element";
				heightUnitSelector.disabled = true;
				heightUnitSelector.id = networkData[ "lineUuid" ] + "__row__cableHeightUnit__select";

				var optFeet = document.createElement( 'option' );
				optFeet.value = "feet";
				optFeet.innerHTML = "feet";
				heightUnitSelector.appendChild( optFeet );

				var optMeter = document.createElement( 'option' );
				optMeter.value = "meter";
				optMeter.innerHTML = "meter";
				heightUnitSelector.appendChild( optMeter );

				heightUnitSelector.value = networkData[ info ];

				heightUnitSelector.addEventListener( 'change', function( event ){
					
					var editedCableHeightUnit = event.target.value;
					var parentValue = event.target.parentNode.parentNode.getAttribute( 'value' ), currentLine;

					if( parentValue ){

						editor.selectByUuid( parentValue );
						currentLine = editor.selected;
						var oldUserDataItem = editor.scene.userData.cableDatas[ currentLine.uuid ];
						var existingCableVerticesLength = currentLine.geometry.attributes.position.array.length;
						var calculatedHeight = Number( oldUserDataItem.cableHeight ) * scope.networkDesigner.conversionFactors[ editedCableHeightUnit ][ scope.networkDesigner.baseUnit ];
						calculatedHeight = Number( calculatedHeight.toFixed( 1 ) );
						for( var i = 1; i <= existingCableVerticesLength - 2; i += 3 ){
			
							currentLine.geometry.attributes.position.array[ i ] = calculatedHeight;
			
						}
						currentLine.geometry.attributes.position.needsUpdate = true;

						currentLine.traverse( function( subChild ){

							if( subChild instanceof THREE.Mesh && ( /^NetworkMarker(\d+)/g ).test( subChild.name ) ){
		
								if( calculatedHeight != undefined ){
		
									subChild.position.y = calculatedHeight;
		
								}
		
							}
			
						} );

						editor.select( currentLine );
						//editor.signals.sceneGraphChanged.dispatch();
						editor.signals.objectChanged.dispatch( editor.selected );
						editor.signals.networkDataEdited.dispatch( currentLine, { cableHeightUnit : editedCableHeightUnit, updateTable : false } );

					}
					//

					
				} );

				tableColumnValue.setAttribute( 'id', networkData[ "lineUuid" ] + "__row__cableHeightUnit" );
				tableColumnValue.appendChild( heightUnitSelector )
				htmlTableValueRow.appendChild( tableColumnValue );

			}
			else if ( infoUpper === 'NUMOFWIRES' ){

				/*tableColumnValue.contentEditable = true;
				tableColumnValue.setAttribute( 'class', 'editable__table__cell' );*/
				tableColumnValue.setAttribute( 'id', networkData["lineUuid"] + "__row__numofwires" );
				tableColumnValue.innerHTML = networkData[ info ];
				
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
						var oldUserDataItem = editor.scene.userData.cableDatas[ currentLine.uuid ];
						if( editedText === "" ){
							
							if( oldUserDataItem != undefined ){
								
								event.target.innerHTML = oldUserDataItem.numOfWires;

							}

						}
						else if( oldUserDataItem != undefined && oldUserDataItem.numOfWires != editedText ){

							editor.signals.networkDataEdited.dispatch( currentLine, { numOfWires : editedText, updateTable : false } );

						}

					}
					
				} );

				htmlTableValueRow.appendChild( tableColumnValue );
			}
			else if( infoUpper === 'CABLETYPE' ){
				var cableTypeInput = document.createElement( 'select' );
				cableTypeInput.disabled = true;
				cableTypeInput.className = "form-control input-sm";
				cableTypeInput.id =  networkData["lineUuid"] + "__row__cabletype__select";
				
				var typesLen = editor.nwCableTypes.length;
				for( var i = 0; i < typesLen; i++ ){
					var selected = networkData[ info ];
					var opt = document.createElement( 'option' );
					opt.value = editor.nwCableTypes[ i ];
					opt.innerHTML = editor.nwCableTypes[ i ];
					if( selected ===  editor.nwCableTypes[ i ]){
						opt.setAttribute("selected","");
					}
					cableTypeInput.appendChild( opt );

				}
				cableTypeInput.addEventListener( 'change', function( event ){
					
					var editedCableType = event.target.value;
					var parentValue = event.target.parentNode.parentNode.getAttribute( 'value' ), currentLine;
					if( parentValue ){
						editor.selectByUuid( parentValue );
						currentLine = editor.selected;
						var oldUserDataItem = editor.scene.userData.cableDatas[ currentLine.uuid ];
						if( oldUserDataItem != undefined && oldUserDataItem.cableType != editedCableType ){

							editor.signals.networkDataEdited.dispatch( currentLine, { cableType : editedCableType, updateTable : false } );

						}

					}
					
				} );

				tableColumnValue.setAttribute( 'id', networkData["lineUuid"] + "__row__cabletype" );
				tableColumnValue.appendChild( cableTypeInput )
				htmlTableValueRow.appendChild( tableColumnValue );
			}
			else if( infoUpper === 'CABLEAPPLICATION' ){
				
				var cableAppInput = document.createElement( 'select' );
				cableAppInput.className = "form-control input-sm";
				cableAppInput.disabled = true;
				cableAppInput.id = networkData["lineUuid"] + "__row__cableapplication__select";
				
				var applcnsLen = editor.nwCableApplications.length;
				for( var i = 0; i < applcnsLen; i++ ){
					var selected = networkData[ info ];
					var opt = document.createElement( 'option' );
					opt.value = editor.nwCableApplications[ i ];
					opt.innerHTML = editor.nwCableApplications[ i ];
					if( selected ===  editor.nwCableTypes[ i ]){
						opt.setAttribute("selected","");
					}
					cableAppInput.appendChild( opt );

				}
				cableAppInput.addEventListener( 'change', function( event ){
					
					var editedCableType = event.target.value;
					var parentValue = event.target.parentNode.parentNode.getAttribute( 'value' ), currentLine;
					if( parentValue ){
						editor.selectByUuid( parentValue );
						currentLine = editor.selected;
						var oldUserDataItem = editor.scene.userData.cableDatas[ currentLine.uuid ];
						if( oldUserDataItem != undefined && oldUserDataItem.cableType != editedCableType ){

							editor.signals.networkDataEdited.dispatch( currentLine, { cableApplication : editedCableType, updateTable : false } );

						}

					}
					
				} );

				tableColumnValue.setAttribute( 'id', networkData["lineUuid"] + "__row__cableapplication" );
				tableColumnValue.appendChild( cableAppInput )
				htmlTableValueRow.appendChild( tableColumnValue );
			}
			else if( infoUpper === 'LENGTH' ){

				tableColumnValue.setAttribute( 'id', networkData["lineUuid"] + "__row__length" );
				tableColumnValue.innerHTML = networkData[info];
				htmlTableValueRow.appendChild( tableColumnValue );

			}
			else if( infoUpper === 'UNIT' ){

				tableColumnValue.setAttribute( 'id', networkData["lineUuid"] + "__row__unit" );
				tableColumnValue.innerHTML = networkData[info];
				htmlTableValueRow.appendChild( tableColumnValue );

			}
			else{

				tableColumnValue.innerHTML = networkData[info];
				htmlTableValueRow.appendChild( tableColumnValue );

			}
		
		}

		scope.networkTable.addRow( htmlTableValueRow );

		//Modified for activity logging start
		try {

			var logDatas = {};
			logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : New network data added " + "\n\t" + JSON.stringify( networkData );
			logger.addLog( logDatas );
			logger.sendLogs( localStorage.getItem( 'U_ID' ) );

		}
		catch( exception ) {

			console.log( "Logging failed!" );
			console.log( exception );

		}
		//Modified for activity logging end
		
	} );

	editor.signals.editorCleared.add( function(){

		if( editor.nwShowHideToggle === true ){

			showHideNetworkingLi.click();

		}

	} );

	//Modified to add listener for the projectDataLoaded signal start
	//When this signal is caught, we have to find the measurement groups from the scene
	//push all of the identified measurement groups to the editor.measureGroups array.
	//Hide all the measurement groups initially
	editor.signals.projectDataLoaded.add( function(){

		editor.nwBadges = [];
		editor.nwMarkers = [];

		editor.scene.traverse( function( child ){

			if( child instanceof THREE.Group && child.name == "NetworkCablingSession" ){

				child.visible = false;

				child.traverse( function( subChild ){

					if( subChild instanceof THREE.Sprite && subChild.name === 'NetworkCableLengthBadge' ){

						//Measurement value badge is a sprite and is the child of the connection line
						//so 'subChild.parent.uuid' will give the uuid of the connection line
						var badgeLabelText = editor.scene.userData.cableDatas[ subChild.parent.uuid ][ 'length' ] + ( ( editor.scene.userData.cableDatas[ subChild.parent.uuid ][ 'unit' ] === 'meter' )? ' m' : ' ft' );

						if( badgeLabelText != undefined ){

							var badgeTexture = scope.networkDesigner.getNumberBadge( { badgeText : badgeLabelText, badgeWidth : 125, badgeHeight : 35, fontSize : "16px", fontColor : this.badgeFontColor, strokeColor : this.badgeStrokeColor, borderRadius : 8, type : "image" } );

							subChild.material.map = badgeTexture;
							
							editor.nwBadges.push( subChild );

						}

					}
					else if( subChild instanceof THREE.Mesh && (/^NetworkMarker\d+/g).test(subChild.name) ){
						
						editor.nwMarkers.push( subChild );

					}

				} );

			}

		} );

		editor.signals.sceneGraphChanged.dispatch();

		//Modified to configure the measurement controls when project is opened start
		if( editor.scene.userData.measurementConfig != undefined ){

			scope.networkDesigner.setBaseUnit( editor.scene.userData.measurementConfig.baseUnit, editor.scene.userData.measurementConfig.baseConversionFactor );
			scope.networkDesigner.setTargetUnit( editor.scene.userData.measurementConfig.targetUnit );

		}
		//Modified to configure the measurement controls when project is opened end

		//Modified to initially rescale all the networkcables for perspective camera, start
		scope.rescaleCablesForPerspectiveCamera();
		//Modified to initially rescale all the networkcables for perspective camera, end

	} );
	//Modified to add listener for the projectDataLoaded signal end

	//Modified to add listener for 'measurementConfigurationChanged' signal start
	editor.signals.measurementConfigurationChanged.add( function( baseUnit, convFactor, targetUnit ){

		scope.networkDesigner.setBaseUnit( baseUnit, convFactor );
		scope.networkDesigner.setTargetUnit( targetUnit );

	} );
	//Modified to add listener for 'measurementConfigurationChanged' signal end

	//Modified to add the listener for nwMarkerSidebarPositionChanged start
    editor.signals.nwMarkerSidebarPositionChanged.add( function( object ){

		if( ( /^(NetworkMarker[\d+])/g ).test( object.name ) === true ){

			scope.moveCableVertexByMarkerPosition( object );
			editor.signals.sceneGraphChanged.dispatch();

		}

	} );

}

Networking.prototype = {

    constructor : Networking,

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

		var scope = this;
		
		//Creating a table body
		var htmlTableBody = document.createElement( 'tbody' );

		// Looping through the measurement data to find the table heading and rows
		// measurement data should be in the format given below
        //	
        //   {  
        //        "87EE709B-AE36-430C-B369-A79521613414":{  
        //            "label":"asd",
        //            "length":137.9,
        //            "unit":"feet",
        //            "cableColor":"#42a4f4",
        //            "numOfWires":"1",
        //            "cableType":"CAT5",
        //            "cableApplication":"Network"
        //        }
        //    }

		var networkKeys = Object.keys( data ); //networkKeys holds all of the '<measurement line uuid>'
		if( networkKeys.length != 0 ){

			//data[ networkKeys[ 0 ] ] holds the first measurement data in the 'data' object
			//Assuming that all the measurement data is following the structure specified above, we can 
			//find the table headers by taking the keys of first measurement data in the 'data' object
			var tableHeaders = Object.keys( data[ networkKeys[ 0 ] ] );
			//tableHeaders.splice( tableHeaders.indexOf( 'label' ), 1 );
			this.networkTable.setHeadersFromArray( tableHeaders );
			
			for( var key in data ){

				var networkItem = key; //networkItem holds each of the measurements
				var htmlTableValueRow = document.createElement( 'tr' );
				htmlTableValueRow.setAttribute( 'value', key );
				htmlTableValueRow.setAttribute( 'id', key + "__network__row" );
				
				htmlTableValueRow.addEventListener( 'click', function( event ){
					editor.selectByUuid( this.getAttribute( 'value' ) );
				} );

				//Looping through each info in a single network
				//info holds each of the keys in a single network
				for( var info in data[ networkItem ] ){

					var tableColumnValue = document.createElement( 'td' );
					var infoUpper = info.toUpperCase();
					if( infoUpper === 'LABEL' ){

						/*tableColumnValue.contentEditable = true;
						tableColumnValue.setAttribute( 'class', 'editable__table__cell' );*/
						tableColumnValue.setAttribute( 'id', key + "__row__label" );
						tableColumnValue.innerHTML = data[ networkItem ][ info ];
						
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
								var oldUserDataItem = editor.scene.userData.cableDatas[ currentLine.uuid ];
								if( editedText === "" ){
									
									if( oldUserDataItem != undefined ){
										
										event.target.innerHTML = oldUserDataItem.label;

									}

								}
								else if( oldUserDataItem != undefined && oldUserDataItem.label != editedText ){

									editor.signals.networkDataEdited.dispatch( currentLine, { label : editedText, updateTable : false } );

								}

							}
							
						} );

						htmlTableValueRow.appendChild( tableColumnValue );

					}
					else if( infoUpper === 'CABLECOLOR' ){

						var colorInput = document.createElement( 'input' );
						colorInput.setAttribute( 'type', 'color' );
						colorInput.disabled = true;
						colorInput.setAttribute( 'class', 'text-center nw-table-color-input-element' );
						colorInput.setAttribute( 'id', key + "__row__cablecolor__input" );
						colorInput.value = data[ networkItem ][ info ];
						colorInput.addEventListener( 'change', function( event ){
							
							var editedColor = event.target.value;
							var parentValue = event.target.parentNode.parentNode.getAttribute( 'value' ), currentLine;
							
							if( parentValue ){
								editor.selectByUuid( parentValue );
								currentLine = editor.selected;
								var oldUserDataItem = editor.scene.userData.cableDatas[ currentLine.uuid ];
								if( editedColor === "" ){
									
									if( oldUserDataItem != undefined ){
										
										event.target.value = oldUserDataItem.cableColor;

									}

								}
								else if( oldUserDataItem != undefined && oldUserDataItem.cableColor != editedColor ){
									
									

									var newColor = new THREE.Color( this.value );
									currentLine.material.uniforms.color.value = newColor;
									currentLine.material.uniformsNeedUpdate = true;
									currentLine.material.needsUpdate = true;
									editor.signals.sceneGraphChanged.dispatch();

									editor.signals.networkDataEdited.dispatch( currentLine, { cableColor : editedColor, updateTable : false } );

								}

							}
							
						} );
						tableColumnValue.setAttribute( 'id', key + "__row__cablecolor" );
						tableColumnValue.appendChild( colorInput );
						tableColumnValue.setAttribute( 'class', 'text-center' );
						htmlTableValueRow.appendChild( tableColumnValue );

					}
					else if ( infoUpper === 'NUMOFWIRES' ){

						/*tableColumnValue.contentEditable = true;
						tableColumnValue.setAttribute( 'class', 'editable__table__cell' );*/
						tableColumnValue.setAttribute( 'id', key + "__row__numofwires" );
						tableColumnValue.innerHTML = data[ networkItem ][ info ];
						
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
								var oldUserDataItem = editor.scene.userData.cableDatas[ currentLine.uuid ];
								if( editedText === "" ){
									
									if( oldUserDataItem != undefined ){
										
										event.target.innerHTML = oldUserDataItem.numOfWires;

									}

								}
								else if( oldUserDataItem != undefined ){

									var newNumOfWires = Number( editedText );
									if( isNaN( newNumOfWires ) || newNumOfWires <= 0 ){

										event.target.innerHTML = oldUserDataItem.numOfWires;
										toastr.warning( "You should enter a number greater than \"0\" for this field" );
										return false;

									}
									if( Number( oldUserDataItem.numOfWires ) != newNumOfWires ){

										editor.signals.networkDataEdited.dispatch( currentLine, { numOfWires : newNumOfWires, updateTable : false } );

									}

								}

							}
							
						} );

						htmlTableValueRow.appendChild( tableColumnValue );
					}
					else if ( infoUpper === 'CABLEHEIGHT' ){

						tableColumnValue.setAttribute( 'id', key + "__row__cableHeight" );
						var heightInput = document.createElement( 'input' );
						heightInput.setAttribute( 'id', key + "__row__cableHeight__input" );
						heightInput.className = "nw__table__cableHeight__input";
						heightInput.setAttribute( "type", "number" );
						heightInput.setAttribute( "step", "0.1" );
						heightInput.value = data[ networkItem ][ info ];
						heightInput.disabled = true;
						tableColumnValue.appendChild( heightInput );

						heightInput.addEventListener( 'change', function( event ){

							//event.preventDefault();
							var heightValue = event.target.value;
							var parentValue = event.target.parentNode.parentNode.getAttribute( 'value' ), currentLine;

							if( parentValue ){

								editor.selectByUuid( parentValue );
								currentLine = editor.selected;
								var oldUserDataItem = editor.scene.userData.cableDatas[ currentLine.uuid ];
								
								var existingCableVerticesLength = currentLine.geometry.attributes.position.array.length;
								var calculatedHeight = Number( heightValue ) * Number( scope.networkDesigner.conversionFactors[ oldUserDataItem.cableHeightUnit ][ scope.networkDesigner.baseUnit ] );
								calculatedHeight =  Number( calculatedHeight.toFixed( 1 ) );
								for( var i = 1; i <= existingCableVerticesLength - 2; i += 3 ){
					
									currentLine.geometry.attributes.position.array[ i ] = calculatedHeight;
					
								}
								currentLine.geometry.attributes.position.needsUpdate = true;

								currentLine.traverse( function( subChild ){

									if( subChild instanceof THREE.Mesh && ( /^NetworkMarker(\d+)/g ).test( subChild.name ) ){
				
										if( calculatedHeight != undefined ){
				
											subChild.position.y = calculatedHeight;
				
										}
				
									}
					
								} );

								editor.select( currentLine );
								//editor.signals.sceneGraphChanged.dispatch();
								editor.signals.objectChanged.dispatch( editor.selected );
								editor.signals.networkDataEdited.dispatch( currentLine, { cableHeight : heightValue, updateTable : false } );

							}

						} );

						htmlTableValueRow.appendChild( tableColumnValue );

					}
					else if( infoUpper === 'CABLEHEIGHTUNIT' ){
						
						var heightUnitSelector = document.createElement( 'select' );
						heightUnitSelector.className = "form-control input-sm nw-table-select-element";
						heightUnitSelector.disabled = true;
						heightUnitSelector.id = key + "__row__cableHeightUnit__select";

						var optFeet = document.createElement( 'option' );
						optFeet.value = "feet";
						optFeet.innerHTML = "feet";
						heightUnitSelector.appendChild( optFeet );

						var optMeter = document.createElement( 'option' );
						optMeter.value = "meter";
						optMeter.innerHTML = "meter";
						heightUnitSelector.appendChild( optMeter );

						heightUnitSelector.value = data[ networkItem ][ info ];

						heightUnitSelector.addEventListener( 'change', function( event ){
							
							var editedCableHeightUnit = event.target.value;
							var parentValue = event.target.parentNode.parentNode.getAttribute( 'value' ), currentLine;

							//
							if( parentValue ){

								editor.selectByUuid( parentValue );
								currentLine = editor.selected;
								var oldUserDataItem = editor.scene.userData.cableDatas[ currentLine.uuid ];
								
								var existingCableVerticesLength = currentLine.geometry.attributes.position.array.length;
								var calculatedHeight = Number( oldUserDataItem.cableHeight ) * scope.networkDesigner.conversionFactors[ editedCableHeightUnit ][ scope.networkDesigner.baseUnit ];
								calculatedHeight = Number( calculatedHeight.toFixed( 1 ) );
								for( var i = 1; i <= existingCableVerticesLength - 2; i += 3 ){
					
									currentLine.geometry.attributes.position.array[ i ] = calculatedHeight;
					
								}
								currentLine.geometry.attributes.position.needsUpdate = true;

								currentLine.traverse( function( subChild ){

									if( subChild instanceof THREE.Mesh && ( /^NetworkMarker(\d+)/g ).test( subChild.name ) ){
				
										if( calculatedHeight != undefined ){
				
											subChild.position.y = calculatedHeight;
				
										}
				
									}
					
								} );

								editor.select( currentLine );
								//editor.signals.sceneGraphChanged.dispatch();
								editor.signals.objectChanged.dispatch( editor.selected );
								editor.signals.networkDataEdited.dispatch( currentLine, { cableHeightUnit : editedCableHeightUnit, updateTable : false } );

							}
							
						} );

						tableColumnValue.setAttribute( 'id', key + "__row__cableHeightUnit" );
						tableColumnValue.appendChild( heightUnitSelector )
						htmlTableValueRow.appendChild( tableColumnValue );

					}
					else if( infoUpper === 'CABLETYPE' ){
						var cableTypeInput = document.createElement( 'select' );
						cableTypeInput.className = "form-control input-sm nw-table-select-element";
						cableTypeInput.disabled = true;
						cableTypeInput.id = key + "__row__cabletype__select";
						
						for( var cbleType of editor.nwCableTypes ){

							var opt = document.createElement( 'option' );
							opt.value = cbleType;
							opt.innerHTML = cbleType;
							cableTypeInput.appendChild( opt );

						}
						cableTypeInput.value = data[ networkItem ][ info ];

						cableTypeInput.addEventListener( 'change', function( event ){
							
							var editedCableType = event.target.value;
							var parentValue = event.target.parentNode.parentNode.getAttribute( 'value' ), currentLine;
							if( parentValue ){

								editor.selectByUuid( parentValue );
								currentLine = editor.selected;
								var oldUserDataItem = editor.scene.userData.cableDatas[ currentLine.uuid ];
								if( oldUserDataItem != undefined && oldUserDataItem.cableType != editedCableType ){

									editor.signals.networkDataEdited.dispatch( currentLine, { cableType : editedCableType, updateTable : false } );

								}

							}
							
						} );

						tableColumnValue.setAttribute( 'id', key + "__row__cabletype" );
						tableColumnValue.appendChild( cableTypeInput )
						htmlTableValueRow.appendChild( tableColumnValue );
					}
					else if( infoUpper === 'CABLEAPPLICATION' ){
						
						var cableAppInput = document.createElement( 'select' );
						cableAppInput.className = "form-control input-sm nw-table-select-element";
						cableAppInput.disabled = true;
						cableAppInput.id = key + "__row__cableapplication__select";
						
						for( var cbleApplcn of editor.nwCableApplications ){

							var opt = document.createElement( 'option' );
							opt.value = cbleApplcn;
							opt.innerHTML = cbleApplcn;
							cableAppInput.appendChild( opt );

						}
						cableAppInput.value = data[ networkItem ][ info ];

						cableAppInput.addEventListener( 'change', function( event ){
							
							var editedCableApplcn = event.target.value;
							var parentValue = event.target.parentNode.parentNode.getAttribute( 'value' ), currentLine;
							if( parentValue ){
								editor.selectByUuid( parentValue );
								currentLine = editor.selected;
								var oldUserDataItem = editor.scene.userData.cableDatas[ currentLine.uuid ];
								if( oldUserDataItem != undefined && oldUserDataItem.cableApplication != editedCableApplcn ){

									editor.signals.networkDataEdited.dispatch( currentLine, { cableApplication : editedCableApplcn, updateTable : false } );

								}

							}
							
						} );

						tableColumnValue.setAttribute( 'id', key + "__row__cableapplication" );
						tableColumnValue.appendChild( cableAppInput )
						htmlTableValueRow.appendChild( tableColumnValue );
					}
					else if( infoUpper === 'LENGTH' ){

						tableColumnValue.setAttribute( 'id', key + "__row__length" );
						tableColumnValue.innerHTML = data[ networkItem ][ info ];
						htmlTableValueRow.appendChild( tableColumnValue );
		
					}
					else if( infoUpper === 'UNIT' ){
		
						tableColumnValue.setAttribute( 'id', key + "__row__unit" );
						tableColumnValue.innerHTML = data[ networkItem ][ info ];
						htmlTableValueRow.appendChild( tableColumnValue );
		
					}
					else{

						tableColumnValue.innerHTML = data[ networkItem ][ info ];
						htmlTableValueRow.appendChild( tableColumnValue );

					}

				}

				htmlTableBody.appendChild( htmlTableValueRow );
			
			}

			this.networkTable.setBody( htmlTableBody );

		}
		else{

			console.warn( "Measurement data is empty!" );

		}

	},

	/**
     * rescaleCablesForOrthographicCamera( ) - Method to scale cables for orthographic cameras
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of rescaleCablesForOrthographicCamera method.</caption>
     * networking.rescaleCablesForOrthographicCamera( );
     */
	rescaleCablesForOrthographicCamera : function(){

		var scope = this;
		editor.scene.traverse( function( child ){

			if( child.name === "NetworkingCable" ){

				child.material.uniforms.lineWidth.value = 0.2;
				child.material.uniformsNeedUpdate = true;
				child.material.needsUpdate = true;

			}

		} );

		if( this.networkDesigner.networkCable ){

			this.networkDesigner.networkCable.material.uniforms.lineWidth.value = 0.2;
			this.networkDesigner.networkCable.material.uniformsNeedUpdate = true;
			this.networkDesigner.networkCable.material.needsUpdate = true;

		}

		editor.signals.sceneGraphChanged.dispatch();

	},
	/**
     * rescaleCablesForPerspectiveCamera( ) - Method to scale cables for perspective cameras
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of rescaleCablesForPerspectiveCamera method.</caption>
     * networking.rescaleCablesForPerspectiveCamera( );
     */
	rescaleCablesForPerspectiveCamera : function(){

		var scope = this;
		editor.scene.traverse( function( child ){

			if( child.name === "NetworkingCable" ){

				child.material.uniforms.lineWidth.value = 10;
				child.material.uniformsNeedUpdate = true;
				child.material.needsUpdate = true;

			}

		} );

		if( this.networkDesigner.networkCable ){

			this.networkDesigner.networkCable.material.uniforms.lineWidth.value = 10;
			this.networkDesigner.networkCable.material.uniformsNeedUpdate = true;
			this.networkDesigner.networkCable.material.needsUpdate = true;

		}

		editor.signals.sceneGraphChanged.dispatch();

	},

	/**
     * moveCableVertexByMarkerPosition( marker ) - Method to change cable vertex with marker
     * @param {Object<THREE.Mesh>} marker - The marker whose respective cable vertex need to be changed
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of moveCableVertexByMarkerPosition method.</caption>
     * networking.moveCableVertexByMarkerPosition( marker );
     */
	moveCableVertexByMarkerPosition: function( marker ){

		var scope = this;
		if( marker instanceof THREE.Mesh && ( /^NetworkMarker(\d+)/g ).test( marker.name ) ){

			var matches = marker.name.match( /(\d+)/g );
			var index = Number( matches[ 0 ] );
			var cable = marker.parent;
			var startPoint = 2 * ( ( index * 3 ) - 3 );

			if( cable.name === "NetworkingCable" ){

				cable.geometry.attributes.position.array[ startPoint ] = marker.position.x;
				cable.geometry.attributes.position.array[ startPoint + 1 ] = marker.position.y;
				cable.geometry.attributes.position.array[ startPoint + 2 ] = marker.position.z;
				cable.geometry.attributes.position.array[ startPoint + 3 ] = marker.position.x;
				cable.geometry.attributes.position.array[ startPoint + 4 ] = marker.position.y;
				cable.geometry.attributes.position.array[ startPoint + 5 ] = marker.position.z;

				cable.geometry.attributes.position.needsUpdate = true;

			}

		}

	},

}