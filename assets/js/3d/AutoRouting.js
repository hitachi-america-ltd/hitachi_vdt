/**
 * AutoRouting( editor ) - Coordinates the operations AutoRoutingDesigner.
 * This class uses the AutoRoutingDesigner internally to perform the autorouting operations.
 * It can also be used as the entry point for everything which is related to autorouting.
 * @constructor
 * @param {any} editor - The instance of the Editor which manages the overall objects and signals
 * @author Pravi
 * @returns {Object}
 * @example <caption>Instanciation of this class is very much straight forward</caption>
 * var autoRouting = new AutoRouting( editor );
 */
var AutoRouting = function( editor ){

    var scope = this;
    var autoRoutingLi = document.querySelector('#start-autorouting-li');
    var networkGrpDrpDwnBtn = document.getElementById( 'network-group-dropdown-button' );

    var startNetworkingLi = document.getElementById( 'start-networking-li' );
    var enableMeasurementLi = document.getElementById( 'enable-measure-mode-li' );
    var enableAreaMeasurementLi = document.getElementById( 'area-enable-measure-mode-li' );
    var showAllMsrmntsLi = document.getElementById( "show-all-measurements-li" );
    var editNetworkCablesLi = document.getElementById( 'edit-networking-li' );
    var placeJunctionBox = document.getElementById( 'place-junction-box-li' );
    this.view = document.getElementById( 'viewport' );
    this.autoRoutingDesigner = new AutoRoutingDesigner( {  areaOfScope : this.view, camera : editor.camera , baseUnit : "meter", baseConversionFactor : 1}, editor );

    var scope = this;

    placeJunctionBox.addEventListener( 'click', function( event ){

        if( editor.addSensorToScene ){

            editor.addSensorToScene = false;

        }

        if( editor.isAutoRoutingStrtd == true && editor.placeJunctionBox == false ){

            scope.autoRoutingDesigner.addFollowingCursorToScene();
            placeJunctionBox.innerHTML = "<a>" + editor.languageData.StopPlacingJunctionBox + "</a>";
            placeJunctionBox.className = "activated";
            editor.placeJunctionBox = true;

        }
        else if( editor.isAutoRoutingStrtd == true && editor.placeJunctionBox == true ){
            
            scope.autoRoutingDesigner.removeFollowingCursorFromScene();
            placeJunctionBox.innerHTML = "<a>" + editor.languageData.PlaceJunctionBox + "</a>";
            placeJunctionBox.className = "deactivated";
            editor.placeJunctionBox = false;
        }
    } );

    if( autoRoutingLi ){

        autoRoutingLi.addEventListener( 'click', function( event ){


            if( editor.isAutoRoutingStrtd == false ){
                var child = editor.scene.children;

                if( child.length>2 ){
                    placeJunctionBox.style.display = "block";

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
                    if( editor.isCableEditingEnabled === true ){

                        editNetworkCablesLi.click();

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
                    scope.autoRoutingDesigner.activate();
                    toastr.success( editor.languageData.AutoRoutingActivated );
                    editor.isAutoRoutingStrtd = true;

                    autoRoutingLi.innerHTML = "<a>" + editor.languageData.DisableAutoRouting + "</a>";
                    autoRoutingLi.className = "activated";
                    networkGrpDrpDwnBtn.style.color = "#500080";
                    networkGrpDrpDwnBtn.innerHTML = '<span class="fa fa-plug span-font-26 faa-pulse animated"></span>';

                    toastr.info('<div>' + editor.languageData.DoYouWishtoPlaceJunctionBox + '</div><div><button type="button" id="place-jb-accept" class="btn btn-success" style="margin-right:1px">'+ editor.languageData.Yes+'</button><button type="button" id="place-jb-reject" class="btn btn-danger" style="margin-left:1px">'+ editor.languageData.No +'</button></div>');

                    document.getElementById( "place-jb-accept" ).addEventListener( 'click',function(){

                        document.getElementById( "place-junction-box-li" ).click();

                    } );

                }
                else{
                    toastr.warning( editor.languageData.ItappearsthatnoobjectshavebeenaddedtothesceneYoucantactivateautoroutingonanemptyscene );
                }
            }
            else if( editor.isAutoRoutingStrtd == true ){
                if( editor.placeJunctionBox ){
                    placeJunctionBox.click();
                }
                placeJunctionBox.style.display = "none";
                scope.autoRoutingDesigner.deActivate();
                editor.isAutoRoutingStrtd = false;

                autoRoutingLi.innerHTML = "<a>" + editor.languageData.EnableAutoRouting + "</a>";
                autoRoutingLi.className = "deactivated";
                toastr.success( editor.languageData.AutoRoutingDeactivated );                
                networkGrpDrpDwnBtn.style.color = "#000000";
                networkGrpDrpDwnBtn.innerHTML = '<span class="fa fa-plug span-font-26"></span>';
            }

        } );

        if( editor.scene.userData.measurementConfig != undefined ){

			scope.networkDesigner.setBaseUnit( editor.scene.userData.measurementConfig.baseUnit, editor.scene.userData.measurementConfig.baseConversionFactor );
			scope.networkDesigner.setTargetUnit( editor.scene.userData.measurementConfig.targetUnit );

		}

        editor.signals.measurementConfigurationChanged.add( function( baseUnit, convFactor, targetUnit ){

            scope.autoRoutingDesigner.setBaseUnit( baseUnit, convFactor );
            scope.autoRoutingDesigner.setTargetUnit( targetUnit );
    
        } );
    }

    editor.signals.projectDataLoaded.add( function(){

		editor.nwBadges = [];
        editor.nwMarkers = [];
        if( editor.scene.userData.jnBoxDeletedNumber != undefined ){
            editor.junctionBoxDeletedNumber = editor.scene.userData.jnBoxDeletedNumber.deletedJnBoxArray;
        }      
        editor.junctionBoxDeletedNumber
		editor.scene.traverse( function( child ){

			if( child instanceof THREE.Group && child.name == "NetworkCablingSession" ){

				child.visible = false;

				child.traverse( function( subChild ){

					if( subChild instanceof THREE.Sprite && subChild.name === 'AutoRoutedCableLengthBadge' ){

						//Measurement value badge is a sprite and is the child of the connection line
						//so 'subChild.parent.uuid' will give the uuid of the connection line
						var badgeLabelText = editor.scene.userData.cableDatas[ subChild.parent.uuid ][ 'length' ] + ( ( editor.scene.userData.cableDatas[ subChild.parent.uuid ][ 'unit' ] === 'meter' )? ' m' : ' ft' );

						if( badgeLabelText != undefined ){

                            //var badgeTexture = scope.networkDesigner.getNumberBadge( { badgeText : badgeLabelText, badgeWidth : 125, badgeHeight : 35, fontSize : "16px", fontColor : this.badgeFontColor, strokeColor : this.badgeStrokeColor, borderRadius : 8, type : "image" } );
                            var badgeTexture = editor.commonMeasurements.getNumberBadgeTransparent( { badgeText : badgeLabelText, badgeWidth : 100, badgeHeight : 35, fontSize : "20px", fontColor : scope.autoRoutingDesigner.badgeFontColor, strokeColor : scope.autoRoutingDesigner.badgeStrokeColor, borderRadius : 8, type : "image" } );

							subChild.material.map = badgeTexture;
							
							editor.nwBadges.push( subChild );

						}

					}
					else if( subChild instanceof THREE.Mesh && (/^NetworkMarker\d+/g).test(subChild.name) ){
						
						editor.nwMarkers.push( subChild );

					}

				} );

            }
            else if( (/^JunctionBox[1-9]+[0-9]*/g).test(child.name )){
                child.traverse( function( subChild ){
                    if( subChild instanceof THREE.Sprite && subChild.name == "JunctionBoxNumberBadge" ){

                        var junctionBoxBadgeNumber = child.name.substr(11);
                        editor.getNumberBadgeIcon( { badgeText: junctionBoxBadgeNumber, badgeRadius: 20, badgeColor: editor.randomColor(), type: "image",badgeShape: "square" }).then(

                            function( iconTexture ){
    
                                subChild.material.map = iconTexture;
                                editor.junctionBoxBadges.push( subChild );
                                subChild.scale.set( 3,3,3 );
        
                            },
                            function( err ){
        
                                console.log( "Problem with junction box number badge" );
        
                            }
                        );
                    }
                } );
            }

		} );

		editor.signals.sceneGraphChanged.dispatch();

		//Modified to configure the measurement controls when project is opened start
		if( editor.scene.userData.measurementConfig != undefined ){

			scope.autoRoutingDesigner.setBaseUnit( editor.scene.userData.measurementConfig.baseUnit, editor.scene.userData.measurementConfig.baseConversionFactor );
			scope.autoRoutingDesigner.setTargetUnit( editor.scene.userData.measurementConfig.targetUnit );

		}

    } );

    editor.signals.objectRemoved.add( function(object){

        if (object.name == "NetworkingCable" && object instanceof THREE.Mesh ){

            editor.scene.traverse( function( child ){

                if (child instanceof THREE.Mesh && (/^JunctionBox[1-9]+[0-9]*/g).test(child.name) ){

                    if ( child.userData.autoRouteData != undefined ){

                        var networkLines = Object.keys(child.userData.autoRouteData)
                        networkLines.forEach( line => {

                            if (line == object.uuid ){

                                delete child.userData.autoRouteData[ line ];
                                for (i = 0; i < editor.nwBadges.length; i++) {

                                    if (editor.nwBadges[i] instanceof THREE.Sprite && editor.nwBadges[i].name == "AutoRoutedCableLengthBadge") {

                                        if (editor.nwBadges[i].parent.uuid == line) {
                                            
                                            editor.nwBadges.splice(i, 1);
                                        }
                                    }
                                }
                            }
                        });
                    }
                }
            } );
        }
        else if(object instanceof THREE.Mesh && (/^JunctionBox[1-9]+[0-9]*/g).test(object.name) ){

            if( editor.scene.userData.mobileWindow ){
                delete editor.scene.userData.mobileWindow[object.uuid];
            }

            if( object.userData.autoRouteData != undefined && Object.keys( object.userData.autoRouteData ).length > 0 ){
                var networkLines = Object.keys(object.userData.autoRouteData);
                networkLines.forEach(lineUUID => {
                var junctionBoxLine = editor.scene.getObjectByProperty( 'uuid', lineUUID );
                if ( junctionBoxLine != undefined ){
                    editor.execute( new RemoveObjectCommand( junctionBoxLine ));
                    delete editor.scene.userData.cableDatas[ lineUUID ];
                }
            });
            }
            editor.junctionBoxDeletedNumber.push( parseInt( object.name.substring( 11 ) ));  
            editor.junctionBoxDeletedNumber.sort( function(a, b){return a-b} );
            editor.scene.userData.jnBoxDeletedNumber = {deletedJnBoxArray : editor.junctionBoxDeletedNumber};
        }
        else if( object instanceof THREE.Group ){
            object.traverse( function( child ){
                if( child instanceof THREE.Mesh && (/^JunctionBox[1-9]+[0-9]*/g).test(child.name) ){
                    editor.junctionBoxDeletedNumber.push( parseInt( child.name.substring( 11 ) ));  
                    editor.junctionBoxDeletedNumber.sort( function(a, b){return a-b} );
                    editor.scene.userData.jnBoxDeletedNumber = {deletedJnBoxArray :         editor.junctionBoxDeletedNumber}
                }    
            } );
        }
    } );

}
AutoRouting.prototype = {
    constructor: AutoRouting,
    /**
	 * drawCableFromJnctnBx() - Draws network cable from junction box to all the cameras on the scene.
	 * @param {Object} junctionBox - The junction box from which the network cable need to be drawn.
	 * @param {String} mode - Determines how the network cable must be drawn. 'direct', 'floor' or 'ceiling' are the expected modes.
	 * @returns {Void}
	 * @author Pravi
	 * @example <caption>usage of initUI</caption>
	 * var autoRouting = new AutoRouting( editor );
	 * autoRouting.drawCableFromJnctnBx(junctionBox,"direct");
	 */
    drawCableFromJnctnBx : function( junctionBox, mode ){
        
        this.autoRoutingDesigner.setMode( mode );
        this.autoRoutingDesigner.drawCableFromAllCameras( junctionBox );

        
    },
    // drawCableViaCeilingFromJnctnBx : function( junctionBox, mode ){

    //     this.autoRoutingDesigner.setMode( mode );
    //     this.autoRoutingDesigner.drawCableFromAllCameras( junctionBox );

    // },
    // drawCableViaFloorFromJnctnBx : function( junctionBox, mode ){

    //     this.autoRoutingDesigner.setMode( mode );
    //     this.autoRoutingDesigner.drawCableFromAllCameras( junctionBox );

    // } 
}