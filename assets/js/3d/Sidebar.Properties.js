/**
 * @author mrdoob / http://mrdoob.com/
 */

Sidebar.Properties = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Span();

	var objectTab = new UI.Text( editor.languageData.OBJECT ).onClick( onClick );
	var geometryTab = new UI.Text( editor.languageData.GEOMETRY ).onClick( onClick );
	var materialTab = new UI.Text( editor.languageData.MATERIAL ).onClick( onClick );

	var tabs = new UI.Div();
	tabs.setId( 'tabs' );
	tabs.add( objectTab, geometryTab, materialTab );
	container.add( tabs );

	function onClick( event ) {

		select( event.target.textContent );

	}

	//

	var object = new UI.Span().add(
		new Sidebar.Object( editor )
	);
	container.add( object );

	var geometry = new UI.Span().add(
		new Sidebar.Geometry( editor )
	);
	container.add( geometry );

	var material = new UI.Span().add(
		new Sidebar.Material( editor )
	);
	container.add( material );

	//

	function select( section ) {

		objectTab.setClass( '' );
		geometryTab.setClass( '' );
		materialTab.setClass( '' );

		object.setDisplay( 'none' );
		geometry.setDisplay( 'none' );
		material.setDisplay( 'none' );

		switch ( section ) {
			case  editor.languageData.OBJECT:
				objectTab.setClass( 'selected' );
				object.setDisplay( '' );
				break;
			case  editor.languageData.GEOMETRY:
				geometryTab.setClass( 'selected' );
				geometry.setDisplay( '' );
				break;
			case  editor.languageData.MATERIAL:
				materialTab.setClass( 'selected' );
				material.setDisplay( '' );
				break;
		}

	}

	select(  editor.languageData.OBJECT );

	return container;

};
