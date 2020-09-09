/**
 * @author mrdoob / http://mrdoob.com/
 */

Menubar.Examples = function ( editor ) {
    var view_toolbar=false, showBottomToolbar = false, showUIControls = false;
	var container = new UI.Panel();
	container.setClass( 'menu right' ); 
	//container.setClass( ''  );
	
	/*var toolbarToggle = new UI.Panel();
	toolbarToggle.setClass( 'fa fa-gear' );
	toolbarToggle.setId('toolbar-toggle');
	toolbarToggle.setTextContent( ' Show Toolbar' );
	container.add( toolbarToggle );
	toolbarToggle.onClick( function(){

		document.getElementById( 'toolbar' ).style.display =  'block';

	} );*/

	var toolbarToggle = new UI.Button();
	toolbarToggle.setClass( 'btn btn-default btn-xs' );
	toolbarToggle.setId('toolbar-toggle');
	toolbarToggle.dom.innerHTML = '<span class="fa fa-gear"></span>'+ editor.languageData.HideToolbar;
	//toolbarToggle.setTextContent( ' Show Toolbar' );
	container.add( toolbarToggle );
	toolbarToggle.onClick( function(){

		if( showBottomToolbar === false ){

			toolbarToggle.dom.innerHTML = '<span class="fa fa-gear"></span>'+ editor.languageData.ShowToolbar;
			document.getElementById( 'toolbar' ).style.display =  'none';
			showBottomToolbar = true;

		}
		else{

			toolbarToggle.dom.innerHTML = '<span class="fa fa-gear"></span>'+editor.languageData.HideToolbar;
			document.getElementById( 'toolbar' ).style.display =  'block';
			showBottomToolbar = false;

		}

	} );

	var uiControls = new UI.Button();
	uiControls.setClass( 'btn btn-default btn-xs' );
	uiControls.setId('uicontrol-toggle');
	uiControls.dom.innerHTML = '<span class="fa fa-desktop"></span>'+ editor.languageData.ShowUIControls;
	
	container.add( uiControls );
	uiControls.onClick( function(){

		if( showUIControls === false ){

			uiControls.dom.innerHTML = '<span class="fa fa-desktop"></span>'+ editor.languageData.HideUIControls;
			editor.uiAdditionalControls.show();
			showUIControls = true;

		}
		else{

			uiControls.dom.innerHTML = '<span class="fa fa-desktop"></span>'+editor.languageData.ShowUIControls;
			editor.uiAdditionalControls.hide();
			showUIControls = false;

		}

	} );

	/*var title = new UI.Panel();
	title.setClass( 'title fa fa-eye-slash' );
	title.setId('toolButton');
	title.setTextContent( '   Hide Sidebar' );
	container.add( title );*/

	var sidebarButton = new UI.Button();
	//title.setClass( 'title fa fa-eye-slash' );
	sidebarButton.setClass( 'btn btn-default btn-xs' );
	//sidebarButton.setId('toolButton');
	sidebarButton.dom.innerHTML = '<span class="fa fa-eye-slash"></span>'+editor.languageData.HideSidebar;
	//title.setTextContent( '   Hide Sidebar' );
	container.add( sidebarButton );

	sidebarButton.onClick( function () {

		if(view_toolbar){

			//var el = document.getElementById("toolButton");
			//if (el.classList.contains("fa-eye")) {
				//el.classList.remove("fa-eye");
			//}
		
			view_toolbar=false;
			//title.setTextContent( '   Hide Sidebar' );
			//document.getElementById("toolButton").className += " fa fa-eye-slash";
			sidebarButton.dom.innerHTML = '<span class="fa fa-eye-slash"></span>'+editor.languageData.HideSidebar;
			document.getElementById("sidebar").style.display="block";
			
		}
		else{

		    view_toolbar=true;
			document.getElementById("sidebar").style.display="none";
			//var el = document.getElementById("toolButton");
			//title.setTextContent( '   Show Sidebar' );
			//document.getElementById("toolButton").className += " fa fa-eye";
			//if(el.classList.contains("fa-eye-slash")){
				//el.classList.remove("fa-eye-slash");
			//}
			//else{
				//el.classList.add("fa-eye");
			//}
			sidebarButton.dom.innerHTML = '<span class="fa fa-eye"></span>'+editor.languageData.ShowSidebar;

		}

	} );

	editor.signals.toolbarHidden.add( function(){

		showBottomToolbar = true;
		toolbarToggle.dom.innerHTML = '<span class="fa fa-gear"></span> '+editor.languageData.ShowToolbar;

	} );

	return container;
	

};
