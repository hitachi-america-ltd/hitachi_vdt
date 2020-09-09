/**
 * @author mrdoob / http://mrdoob.com/
 */

Sidebar.Scene = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Panel();
	container.setBorderTop( '0' );
	container.setPaddingTop( '20px' );
	container.setId( 'sidebar-scene' );
	
	// outliner

	function buildOption( object, draggable ) {

		if(object.name == 'spritecamera'){
			return;
			
		}
		var option = document.createElement( 'div' );
		option.draggable = draggable;
		option.innerHTML = buildHTML( object );

		if(object.type == 'PerspectiveCamera' || object.type == 'Group' ||object.type == 'Scene'||object.type == 'Object3D'){
			option.id="strongcamera";
			
		}
		else if (object.type == 'HemisphereLight')
		{

			option.id="hemisphereLight";
		}
		
		option.value = object.id;


		return option;

	}

	function getMaterialName( material ) {

		if ( Array.isArray( material ) ) {

			var array = [];

			for ( var i = 0; i < material.length; i ++ ) {

				array.push( material[ i ].name );

			}

			return array.join( ',' );

		}

		return material.name;

	}

	function buildHTML( object ) {

		if(object.name == 'spritecamera'){
			return;
			
		}
		if(object.type == 'PerspectiveCamera'){
			var html = '<span class=" fa fa-camera type' + object.type + '"></span> ' + object.name;
			
		}
		else if(object.type == 'Group'|| object.type == 'Object3D'){
			var html = '<span class=" fa fa-cubes type' + object.type + '"></span> ' + object.name;
			
		}
		else if(object.type == 'Mesh'){
			var html = '<span class=" fa fa-cube type' + object.type + '"></span> ' + object.name;
			
		}
		else if(object.type == 'HemisphereLight' || object.type == 'PointLight' || object.type == 'SpotLight'  || object.type == 'DirectionalLight'  || object.type == 'AmbientLight' ){
			var html = '<span class=" fa fa-lightbulb-o "></span> ' + object.name;
			
		}
		else if(object.type == 'Scene'){
			var html = '<span class=" fa fa-picture-o type' + object.type + '"></span> ' + object.name;
			
		}
		else{

			var html = '<span class="type ' + object.type + '"></span> ' + object.name;
		}	
		
		//var html = '<span class="type ' + object.type + '"></span> ' + object.name;
		
		if ( object instanceof THREE.Mesh ) {

			var geometry = object.geometry;
			var material = object.material;

			html += ' <span class="type ' + geometry.type + '"></span> ' + geometry.name;
			html += ' <span class="type ' + material.type + '"></span> ' + getMaterialName( material );

		}

		html += getScript( object.uuid );

		return html;

	}

	function getScript( uuid ) {

		if ( editor.scripts[ uuid ] !== undefined ) {

			return ' <span class="type Script"></span>';

		}

		return '';

	}

	var ignoreObjectSelectedSignal = false;

	var outliner = new UI.Outliner( editor );
	outliner.setId( 'outliner' );
	outliner.onChange( function () {

		ignoreObjectSelectedSignal = true;

		editor.selectById( parseInt( outliner.getValue() ) );

		ignoreObjectSelectedSignal = false;

	} );
	outliner.onDblClick( function () {

		editor.focusById( parseInt( outliner.getValue() ) );

	} );
	//container.add( outliner );//commented to remove old scene explorer
	container.dom.appendChild( oExplorer.dom );//Added to show new ObjectExplorer
	container.add( new UI.Break() );

	// background

	function onBackgroundChanged() {

		signals.sceneBackgroundChanged.dispatch( backgroundColor.getHexValue() );

	}

	var backgroundRow = new UI.Row();

	/*MODIFIED TO APPLY WHITE COLOR TO THE VIEWPORT START*/
	var backgroundColor = new UI.Color().setValue( '#aaaaaa' ).onChange( onBackgroundChanged );
	backgroundColor.setId('sidebar-scene-bgcolor-input');
	//backgroundColor.setId( 'bgcolor' );
	//var backgroundColor = new UI.Color().setValue( '#ffffff' ).onChange( onBackgroundChanged );
	/*MODIFIED TO APPLY WHITE COLOR TO THE VIEWPORT END*/

	backgroundRow.add( new UI.Text( editor.languageData.Background ).setWidth( '90px' ) );
	backgroundRow.add( backgroundColor );

	var centreCubeRow = new UI.Row();
	var hideCenterCube = new UI.Checkbox();
	hideCenterCube.setId( 'hide-center-cube' );
	hideCenterCube.setValue(true);
	hideCenterCube.onClick( function( event ){
		if( editor.hideCenterCube == false ){
			editor.pivot.visible = false;
			hideCenterCube.setValue( false );
			editor.hideCenterCube = true;
			editor.signals.sceneGraphChanged.dispatch();
		}
		else if( editor.hideCenterCube == true ){
			editor.pivot.visible =true;
			hideCenterCube.setValue( true );
			editor.hideCenterCube = false;
			editor.signals.sceneGraphChanged.dispatch();
		}
	} );

	var labelForHideCntrCube = new UI.Label( editor.languageData.ShowHideOrgin );
	labelForHideCntrCube.setFor("hide-center-cube");
	centreCubeRow.add( hideCenterCube );
	centreCubeRow.add( labelForHideCntrCube ); 

	var targetUnitLabel = new UI.Label( editor.languageData.TargetUnit+":" );
	targetUnitLabel.setId( 'sidebar-targetunit-label' );
	var targetUnit = new UI.Label( editor.languageData.feet );
	targetUnit.setId( 'sidebar-targetunit' );
	centreCubeRow.add( targetUnitLabel );
	centreCubeRow.add( targetUnit );

	container.add( backgroundRow );
	container.add( centreCubeRow );

	// Hide Camera frustum start
	var hideFrustumRow = new UI.Row();
	var hideFrustum = new UI.Checkbox().setId( "hide-camera-frustum" ).setStyle( "checked",["true"] );
	hideFrustumRow.add( hideFrustum );
	hideFrustumRow.add( new UI.Label( editor.languageData.ShowHideFrustum ) )
	hideFrustum.onClick( function(){	
		if( editor.theatreMode ){
			toastr.warning( editor.languageData.PleaseDisableTheatreModeToHideCameraFrustum );
			hideFrustum.setValue( false );
			return;
        }	
		if( editor.hideAllCamera == false ){
			
			toastr.info( editor.languageData.FrustumHideWorksOnlyWhenCamerasAreVisible );
			hideFrustum.setValue( false );
			
		} else {

			if( hideFrustum.getValue() ){

				editor.hideAllFrustum = true;
				editor.scene.traverse( function( child ){
					if( child instanceof THREE.PerspectiveCamera){
						child.traverse( function( children ){
							if( children.name == 'CameraFrustum' ) {
								children.visible = false;
							} 
						} )
					
					}
				} )

				editor.sceneHelpers.traverse( function( child ){
					if( child instanceof THREE.LineSegments && child.camera instanceof THREE.PerspectiveCamera){
						child.visible = false;
					}
				} )
				hideFrustum.setValue( true );

			} else {

				editor.hideAllFrustum = false;
				editor.scene.traverse( function( child ){
					if( child instanceof THREE.PerspectiveCamera){
						child.traverse( function( children ){
							if( children.name == 'CameraFrustum' ) {
								children.visible = true;
							} 
						} )
					
					}
				} )

				editor.sceneHelpers.traverse( function( child ){
					if( child instanceof THREE.LineSegments && child.camera instanceof THREE.PerspectiveCamera){
						child.visible = true;
					}
				} )
				hideFrustum.setValue( false );
			}
		}
		editor.signals.sceneGraphChanged.dispatch();
	})
	container.add( hideFrustumRow ) 

	// Hide Camera frustum end

	var hideSensorFrustumRow = new UI.Row();
	var hideSensorFrustum = new UI.Checkbox().setId( "hide-sensor-frustum" );
	hideSensorFrustumRow.add( hideSensorFrustum );
	hideSensorFrustumRow.add( new UI.Label( editor.languageData.ShowHideSensorFrustum ) )

	hideSensorFrustum.onClick( function( event ){

		var scope = this;
		editor.scene.traverse( function( child ){
			if( child instanceof THREE.Group && child.userData && child.userData.sensorData ){

				child.traverse( function( children ){
					if( children instanceof THREE.Mesh ){
						children.visible = !(scope.getValue())
						editor.signals.sceneGraphChanged.dispatch();
					}
					
				} )
				
				
			}
		} )

	} )

	container.add( hideSensorFrustumRow ) 
	
	//Enable/Disable Theatre Mode Start
	if( localStorage.getItem("viewmode") == "true") {

		var enableTheatreModeSidebar = new UI.Row();
		var sidebarTheatreMode = new UI.Checkbox().setId( "sidebar-theatre-mode" ).setStyle( "checked",["true"] );
		enableTheatreModeSidebar.add( sidebarTheatreMode );
		enableTheatreModeSidebar.add( new UI.Label( editor.languageData.EnableDisableTheatreMode ) )
		sidebarTheatreMode.onClick( function(){	
			if( editor.hideAllCamera == false ){

				toastr.warning(editor.languageData.Allcamerasshouldbevisibletoenabletheatermode)
				sidebarTheatreMode.setValue( false );
				
			} else if( editor.hideAllFrustum ){
				toastr.warning(editor.languageData.ShowCameraFrustum)
				sidebarTheatreMode.setValue( false );

			} else{
				$('#theatre_button_content').click();
			}		
		})
		container.add( enableTheatreModeSidebar ) 
	}

	//Enable/Disable Theatre Mode End

	
	if( localStorage.getItem("viewmode") == "true"){
		var hideNetworkingRow = new UI.Row();
		var hideNetworking = new UI.Checkbox().setId( "hide-networking" ).setStyle( "checked",["true"] );
		hideNetworkingRow.add( hideNetworking );
		hideNetworkingRow.add( new UI.Label( editor.languageData.ShowHideNetworking ) );
		
		hideNetworking.onClick( function(){
			$("#show-hide-networking-li").click();
			if( document.getElementById( "network__table__window" ) )
				$( "#network__table__window" ).hide();
		} )

		container.add( hideNetworkingRow ) 
	}
	


	// fog

	function onFogChanged() {

		signals.sceneFogChanged.dispatch(
			fogType.getValue(),
			fogColor.getHexValue(),
			fogNear.getValue(),
			fogFar.getValue(),
			fogDensity.getValue()
		);

	}

	var fogTypeRow = new UI.Row();
	var fogType = new UI.Select().setOptions( {

		'None': 'None',
		'Fog': 'Linear',
		'FogExp2': 'Exponential'

	} ).setWidth( '150px' );
	fogType.onChange( function () {

		onFogChanged();
		refreshFogUI();

	} );

	fogTypeRow.add( new UI.Text( editor.languageData.Fog ).setWidth( '90px' ) );
	fogTypeRow.add( fogType );

	container.add( fogTypeRow );

	// fog color

	var fogPropertiesRow = new UI.Row();
	fogPropertiesRow.setDisplay( 'none' );
	fogPropertiesRow.setMarginLeft( '90px' );
	container.add( fogPropertiesRow );

	var fogColor = new UI.Color().setValue( '#aaaaaa' );
	fogColor.onChange( onFogChanged );
	fogPropertiesRow.add( fogColor );

	// fog near

	var fogNear = new UI.Number( 0.1 ).setWidth( '40px' ).setRange( 0, Infinity ).onChange( onFogChanged );
	fogPropertiesRow.add( fogNear );

	// fog far

	var fogFar = new UI.Number( 50 ).setWidth( '40px' ).setRange( 0, Infinity ).onChange( onFogChanged );
	fogPropertiesRow.add( fogFar );

	// fog density

	var fogDensity = new UI.Number( 0.05 ).setWidth( '40px' ).setRange( 0, 0.1 ).setPrecision( 3 ).onChange( onFogChanged );
	fogPropertiesRow.add( fogDensity );

	//

	function refreshUI() {

		var camera = editor.camera;
		var scene = editor.scene;

		var options = [];

		options.push( buildOption( camera, false ) );
		options.push( buildOption( scene, false ) );

		( function addObjects( objects, pad ) {

			for ( var i = 0, l = objects.length; i < l; i ++ ) {

				var object = objects[ i ];
				if(object.name != 'spritecamera'){
					if( object.name == "EditorOrigin" ){
						editor.removeHelper(editor.pivot);
						continue;
					}
					else if( object.name == 'cameraHelperIcon' ){
						
						continue;
						
					}
					else if( object.name == 'CameraFrustum' ){
						
						continue;
						
					}
					else if( object.name == 'GenerateCameraLine' ){
						
						editor.removeHelper(object);
						continue;
						
					}
					
					var option = buildOption( object, true );
					option.style.paddingLeft = ( pad * 10 ) + 'px';
					options.push( option );

					addObjects( object.children, pad + 1 );
				}

			}

		} )( scene.children, 1 );

		outliner.setOptions( options );

		if ( editor.selected !== null ) {

			outliner.setValue( editor.selected.id );
			

		}

		if ( scene.background ) {

			backgroundColor.setHexValue( scene.background.getHex() );

		}

		if ( scene.fog ) {

			fogColor.setHexValue( scene.fog.color.getHex() );

			if ( scene.fog instanceof THREE.Fog ) {

				fogType.setValue( "Fog" );
				fogNear.setValue( scene.fog.near );
				fogFar.setValue( scene.fog.far );

			} else if ( scene.fog instanceof THREE.FogExp2 ) {

				fogType.setValue( "FogExp2" );
				fogDensity.setValue( scene.fog.density );

			}

		} else {

			fogType.setValue( "None" );

		}

		refreshFogUI();

	}

	function refreshFogUI() {

		var type = fogType.getValue();

		fogPropertiesRow.setDisplay( type === 'None' ? 'none' : '' );
		fogNear.setDisplay( type === 'Fog' ? '' : 'none' );
		fogFar.setDisplay( type === 'Fog' ? '' : 'none' );
		fogDensity.setDisplay( type === 'FogExp2' ? '' : 'none' );

	}

	//refreshUI();//Commented to avoid refreshing the old list

	// events

	//signals.editorCleared.add( refreshUI );//Commented to add more callbacks during the signal
	signals.editorCleared.add( function(){

		//refreshUI();//Commented to avoid refreshing the old list
		oExplorer.refreshList( editor.scene );
		//oExplorer.highlightItem( editor.selected, false );

	} );

	//signals.sceneGraphChanged.add( refreshUI );//Commented to add more callbacks during the signal
	signals.sceneGraphChanged.add( function(){

		//refreshUI();//Commented to avoid refreshing the old list
		oExplorer.refreshList( editor.scene );
		oExplorer.highlightItem( editor.selected, false );

	} );

	signals.objectChanged.add( function ( object ) {

		var options = outliner.options;

		for ( var i = 0; i < options.length; i ++ ) {

			var option = options[ i ];

			if ( option.value === object.id ) {

				option.innerHTML = buildHTML( object );
				return;

			}

		}

	} );

	signals.objectSelected.add( function ( object ) {

		if ( ignoreObjectSelectedSignal === true ) return;

		outliner.setValue( object !== null ? object.id : null );
		
		//Added to highlight the list item when an object is selected
		//if( editor.selected != null ){

			oExplorer.highlightItem( editor.selected );
			//MODIFIED TO SELECT AND SCROLL TO THE OBJECT IN THE COLLAPSIBLE LIST START
			oExplorer.scrollToItem( editor.selected );
			//MODIFIED TO SELECT AND SCROLL TO THE OBJECT IN THE COLLAPSIBLE LIST END

		//}
		//

	} );

	return container;

};
