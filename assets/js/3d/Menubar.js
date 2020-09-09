/**
 * @author mrdoob / http://mrdoob.com/
 */

var Menubar = function ( editor ) {

	var container = new UI.Panel();
	container.setId( 'menubar' );

	if(localStorage.getItem("viewmode") == "true"){
		container.add( new Menubar.Add( editor ) );

		container.add( new Menubar.TwoDViews( editor ) );
		container.add( new Menubar.FloorplanViews( editor ) );
		container.add( new Menubar.ThreeDView( editor ) );
	} else {

		container.add( new Menubar.File( editor ) );
		container.add( new Menubar.Edit( editor ) );
		container.add( new Menubar.Add( editor ) );
		container.add( new Menubar.Play( editor ) );
		container.add( new Menubar.Status( editor ) );
		container.add( new Menubar.Examples( editor ) );
		container.add( new Menubar.TwoDViews( editor ) );
		container.add( new Menubar.FloorplanViews( editor ) );
		container.add( new Menubar.ThreeDView( editor ) );
		if(localStorage.getItem( "matterport_user" ) == "true") {
		    
			container.add( new Menubar.ThreeDVirtualTour( editor ) );
		}

		container.add( new Menubar.ScreenshotList( editor ) );
		container.add( new Menubar.Screenshot2D( editor ) );
		container.add( new Menubar.Screenshot3D( editor ) );
		container.add( new Menubar.ParkingLotImage( editor ) );
		container.add( new Menubar.ReportGeneration( editor ) );
		
		

		if(localStorage.getItem( "api_access" ) == "true" ) {

			container.add( new Menubar.Manage( editor ) );
		
		}


		// if(localStorage.getItem( "matterport_user" ) == "true") {
		    
		// 	container.add( new Menubar.MatterportAssets( editor ) );
		// }

	}

	return container;

};
