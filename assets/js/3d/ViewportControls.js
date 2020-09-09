/**
 * @author Hari
 */

var ViewportControls = function ( editor ) {
    
    var scope = this;

    this.signals = editor.signals;
    this.wrapper = document.createElement( 'div' );
    this.wrapper.setAttribute( 'class', 'viewport-controls' );

    //Networking starts

    this.networkingWrapper = document.createElement( 'div' );

    var ntwrkngDrpdwn = document.createElement( 'div' );
    ntwrkngDrpdwn.setAttribute( "class","dropdown" );

    this.networkingGroupDropDown = document.createElement( 'button' );
    this.networkingGroupDropDown.setAttribute( "class", "theatre-button btn btn-default btn-xs btn-margin-left-9px dropdown-toggle" );
    this.networkingGroupDropDown.setAttribute( "id", "network-group-dropdown-button" );
    this.networkingGroupDropDown.setAttribute( "title", editor.languageData.Networking);
    this.networkingGroupDropDown.setAttribute( "data-toggle", "dropdown" );
    this.networkingGroupDropDown.innerHTML = '<span class="fa fa-plug span-font-23"></span>';

    ntwrkngDrpdwn.appendChild( this.networkingGroupDropDown );

    var listNtwrkng = document.createElement( "ul" );
    listNtwrkng.setAttribute( "class", "dropdown-menu" );
    listNtwrkng.setAttribute( "id" ,"network-button-dropdown-menu" );

    var showHideNtwrk = document.createElement( "li" );
    showHideNtwrk.setAttribute( "id", "show-hide-networking-li" );
    showHideNtwrk.innerHTML = "<a>" + editor.languageData.ShowNetworkCables + "</a>";

    var hrLineNtwrk = document.createElement( 'hr' );
    hrLineNtwrk.className = 'HorizontalRule';
    
    var hrLineNtwrk2 = document.createElement( 'hr' );
	hrLineNtwrk.className = 'HorizontalRule';

    var itemNetwork = document.createElement( "li" );
    itemNetwork.setAttribute( 'id','start-networking-li' );
    itemNetwork.innerHTML = "<a>"+ editor.languageData.EnableNetworking + "</a>";

    var placeJunctionBox = document.createElement( "li" );
    placeJunctionBox.setAttribute( 'id','place-junction-box-li' );
    placeJunctionBox.innerHTML = "<a>"+ editor.languageData.PlaceJunctionBox + "</a>";
    placeJunctionBox.style.display = "none";

    var itemAutoRouting = document.createElement( "li" );
    itemAutoRouting.setAttribute( 'id','start-autorouting-li' );
    itemAutoRouting.innerHTML = "<a>"+ editor.languageData.EnableAutoRouting + "</a>";

    var hrLineNtwrk = document.createElement( 'hr' );
    hrLineNtwrk.className = 'HorizontalRule';
    
    var editNetwork = document.createElement( "li" );
    editNetwork.setAttribute( 'id','edit-networking-li' );
    editNetwork.innerHTML = "<a>"+ editor.languageData.Editnetworking + "</a>";

    
    listNtwrkng.appendChild( showHideNtwrk );
    listNtwrkng.appendChild( hrLineNtwrk );
    listNtwrkng.appendChild( itemNetwork );
    listNtwrkng.appendChild( itemAutoRouting );
    listNtwrkng.appendChild( placeJunctionBox );
    listNtwrkng.appendChild( hrLineNtwrk2 );
    listNtwrkng.appendChild( editNetwork );

    ntwrkngDrpdwn.appendChild( listNtwrkng );

    this.networkingWrapper.appendChild( ntwrkngDrpdwn );
    this.wrapper.appendChild( scope.networkingWrapper );


    //Networking ends

    //Measurements group start
    //Measure group button
    this.measureGroupWrapper = document.createElement( 'div' );

    var measureDrpdwn = document.createElement( "div" );
    measureDrpdwn.setAttribute( "class", "dropdown" );

    this.measureGroupDropdown = document.createElement( "button" );
    this.measureGroupDropdown.setAttribute( "class", "theatre-button btn btn-default btn-xs btn-margin-left-9px dropdown-toggle" );
    this.measureGroupDropdown.setAttribute( "id", "measure-group-dropdown-button" );
    this.measureGroupDropdown.setAttribute( "title", editor.languageData.Measurementcontrols );
    this.measureGroupDropdown.setAttribute( "data-toggle", "dropdown" );
    //this.measureGroupDropdown.innerHTML = '<span class="fa fa-balance-scale"></span><span class="caret"></span>';
    //this.measureGroupDropdown.innerHTML = '<span class="fa fa-balance-scale span-font-19_5"></span>';
    this.measureGroupDropdown.innerHTML = '<span class="fa fa-object-group span-font-21"></span>';

    measureDrpdwn.appendChild( this.measureGroupDropdown );

    var list = document.createElement( "ul" );
    list.setAttribute( "class", "dropdown-menu" );
    list.setAttribute( "id", "measure-button-dropdown-menu" );

    var itemMeasurements = document.createElement( "li" );
    itemMeasurements.setAttribute( 'id', 'show-measurements-li' );
    itemMeasurements.innerHTML = "<a>" + editor.languageData.ShowLengthMeasurements + "</a>";
    list.appendChild( itemMeasurements );

    var showMsrmnts = document.createElement( "li" );
    showMsrmnts.setAttribute( 'id', 'show-all-measurements-li' );
    showMsrmnts.innerHTML = "<a>" + editor.languageData.showAllMeasurements + "</a>";
    list.appendChild( showMsrmnts );

    var hrLine = document.createElement( 'hr' );
	hrLine.className = 'HorizontalRule';
    list.appendChild( hrLine );

    var itemMeasureMode = document.createElement( "li" );
    itemMeasureMode.setAttribute( 'id', 'enable-measure-mode-li' );
    itemMeasureMode.innerHTML = "<a>" + editor.languageData.EnableLengthMeasurement +"</a>";
    list.appendChild( itemMeasureMode );

    //var hrLine = document.createElement( 'hr' );
	//hrLine.className = 'HorizontalRule';
    //list.appendChild( hrLine );

    var areaItemMeasurements = document.createElement( "li" );
    areaItemMeasurements.setAttribute( 'id', 'area-show-measurements-li' );
    areaItemMeasurements.innerHTML = "<a>" + editor.languageData.ShowAreaMeasurements +"</a>";
    list.appendChild( areaItemMeasurements );

    var areaItemMeasureMode = document.createElement( "li" );
    areaItemMeasureMode.setAttribute( 'id', 'area-enable-measure-mode-li' );
    areaItemMeasureMode.innerHTML = "<a>" + editor.languageData.EnableAreaMeasurement + "</a>";
    list.appendChild( areaItemMeasureMode );

    var hrLine2 = document.createElement( 'hr' );
	hrLine2.className = 'HorizontalRule';
    list.appendChild( hrLine2 );
    //****************************************/

    var twoDMeasurement = document.createElement('li');
    twoDMeasurement.setAttribute( 'id','twod-enable-measure-mode-li' );
    twoDMeasurement.innerHTML = "<a>" + editor.languageData.EnableTwoDMeasurement + "</a>";
    list.appendChild( twoDMeasurement );

    var showTwoDMeasurement = document.createElement('li');
    showTwoDMeasurement.setAttribute( 'id','twod-show-measurements-li' );
    showTwoDMeasurement.innerHTML = "<a>" + editor.languageData.ShowTwoDMeasurement + "</a>";
    list.appendChild( showTwoDMeasurement );

    var hrLine3 = document.createElement( 'hr' );
	hrLine3.className = 'HorizontalRule';
    list.appendChild( hrLine3 );

    //****************************************/

    var itemConfigure = document.createElement( "li" );
    itemConfigure.setAttribute( 'id', 'configure-measurement-li' );
    itemConfigure.innerHTML = "<a>" + editor.languageData.ConfigureMeasurement +"</a>";
    list.appendChild( itemConfigure );

    measureDrpdwn.appendChild( list );

    this.measureGroupWrapper.appendChild( measureDrpdwn );
    this.wrapper.appendChild( scope.measureGroupWrapper );
    //Measurements group end

    this.PointOfIntrestWrapper = document.createElement( 'div' );
    this.PointOfIntrest = document.createElement( 'button' );
    this.PointOfIntrest.setAttribute( 'class', 'theatre-button btn btn-default btn-xs btn-margin-left-9px' );
    this.PointOfIntrest.setAttribute( 'id', 'PointOfIntrestButton' );
    this.PointOfIntrest.setAttribute( 'title', editor.languageData.PointOfInterest);
    this.PointOfIntrest.innerHTML = '<span id="spanPointOfIntrestButtont" class="fa fa-tag span-font-40"></span>';
    this.PointOfIntrestWrapper.appendChild( scope.PointOfIntrest );
    this.PointOfIntrest.addEventListener("click", function(){
		editor.pointOfinterestObject.listShow();
	});
    this.wrapper.appendChild( scope.PointOfIntrestWrapper );

    // Start point of interest

    // End Point of interest
    //Zoom controls start
    //Zoom-in
    this.zoomPlusWrapper = document.createElement( 'div' );
    this.zoomPlus = document.createElement( 'button' );
    this.zoomPlus.setAttribute( 'class', 'btn btn-default btn-xs btn-margin-left-9px' );
    this.zoomPlus.setAttribute( 'id', 'zoomIn' );
    this.zoomPlus.setAttribute( 'title', editor.languageData.Zoomin );
    this.zoomPlus.innerHTML = '<span id="zoomIn-content" class="fa fa-plus-square span-font-40"></span>';
    this.zoomPlusWrapper.appendChild( scope.zoomPlus );
    this.wrapper.appendChild( scope.zoomPlusWrapper );

    //Zoom-out
    this.zoomMinusWrapper = document.createElement( 'div' );
    this.zoomMinus = document.createElement( 'button' );
    this.zoomMinus.setAttribute( 'class', 'btn btn-default btn-xs btn-margin-left-9px' );
    this.zoomMinus.setAttribute( 'id', 'zoomOut' );
    this.zoomMinus.setAttribute( 'title', editor.languageData.Zoomout );
    this.zoomMinus.innerHTML = '<span id="zoomOut-content" class="fa fa-minus-square span-font-40"></span>';
    this.zoomMinusWrapper.appendChild( scope.zoomMinus );
    this.wrapper.appendChild( scope.zoomMinusWrapper );
    //Zoom controls end

    //Reset button
    this.resetWrapper = document.createElement( 'div' );
    this.resetButton = document.createElement( 'button' );
    this.resetButton.setAttribute( 'class', 'btn btn-default btn-xs btn-margin-left-9px' );
    this.resetButton.setAttribute( 'id', 'reset-btn' );
    this.resetButton.setAttribute( 'title', editor.languageData.Resetviewport );
    this.resetButton.innerHTML = '<span id="reset-btn-content" class="fa fa-undo span-font-40"></span>';
    this.resetWrapper.appendChild( scope.resetButton );
    this.wrapper.appendChild( scope.resetWrapper );

    //Freez button
    this.freezWrapper = document.createElement( 'div' );
    this.freezButton = document.createElement( 'button' );
    this.freezButton.setAttribute( 'class', 'btn btn-default btn-xs btn-margin-left-9px' );
    this.freezButton.setAttribute( 'id', 'freeez-btn' );
    this.freezButton.setAttribute( 'title', editor.languageData.Freezobjectmovement );
    this.freezButton.innerHTML = '<span id="freeez-btn-content" class="fa fa-toggle-off span-font-23"></span>';
    this.freezWrapper.appendChild( scope.freezButton );
    this.wrapper.appendChild( scope.freezWrapper );

    //Live 2D view button
    this.live2DWrapper = document.createElement( 'div' );
    this.live2DButton = document.createElement( 'button' );
    this.live2DButton.setAttribute( 'class', 'btn btn-default btn-xs btn-margin-left-9px' );
    this.live2DButton.setAttribute( 'id', 'side-twod-btn' );
    this.live2DButton.setAttribute( 'title', editor.languageData.Startsecondaryrenderingforviewport );
    this.live2DButton.innerHTML = '<span id="side-twod-btn-content" class="fa fa-television span-font-23"></span>';
    this.live2DWrapper.appendChild( scope.live2DButton );
    this.wrapper.appendChild( scope.live2DWrapper );

    //Theatre mode button
    this.theatreWrapper = document.createElement( 'div' );
    this.theatreButton = document.createElement( 'button' );
    this.theatreButton.setAttribute( 'class', 'theatre-button btn btn-default btn-xs btn-margin-left-9px' );
    this.theatreButton.setAttribute( 'id', 'theatre_button' );
    this.theatreButton.setAttribute( 'title', editor.languageData.Theatremodeenablesyoutosimulatethecameras );
    this.theatreButton.innerHTML = '<span id="theatre_button_content" class="fa fa-video-camera span-font-26"></span>';
    this.theatreWrapper.appendChild( scope.theatreButton );
    this.wrapper.appendChild( scope.theatreWrapper );

    //Move Camera along with Model
    this.lockCameraWrapper = document.createElement( 'div' );
    this.lockCameraBtn = document.createElement( 'button' );
    this.lockCameraBtn.setAttribute( 'class', 'camera-lock btn btn-default btn-xs btn-margin-left-9px' );
    this.lockCameraBtn.setAttribute( 'id', 'move_with_model' );
    this.lockCameraBtn.setAttribute( 'title', editor.languageData.Lockcameraenablesyoutomovecameraalongwiththemodel );
    this.lockCameraBtn.innerHTML = '<span id="move_with_model_content" class="fa fa-unlock-alt span-font-26"></span>';
    this.lockCameraWrapper.appendChild( scope.lockCameraBtn );
    this.wrapper.appendChild( scope.lockCameraWrapper );
   

    document.getElementById( 'editorElement' ).appendChild( scope.wrapper );
    return this.wrapper;

};