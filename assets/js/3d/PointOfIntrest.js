/**
 * PointOfIntrest( editor, viewport ) - Constructor function for generating point of interest
 * @constructor
 * @param {any} editor - The instance of the Editor which manages the overall objects and signals
 * @author Mavelil
 * @returns {Object}
 * @example <caption>Example usage of PointOfIntrest</caption>
 * var viewport = document.getElementById( 'viewport' );
 * var pointOfIntrest = new PointOfIntrest( editor, viewport );
 */

var PointOfIntrest = function( editor ){
	
	var scope = this;
	this.create();
	this.createEditWindow();
	this.createDetailsWindow();
	this.title = "";
	this.content = "";
	this.currentEditObject = ""
	this.hyperlink = "";
	//this.position = position;


	this.pointOfInterestTableWindow = new UI.MobileWindow( 'pointofInterest__table__window' );
	document.getElementById( 'editorElement' ).appendChild( this.pointOfInterestTableWindow.dom );
	this.pointofInterestTable = new HtmlTable( 'pointofInterest__table' );
	
	var pointOfInterestTableWindowBody = document.createElement( 'div' );
	pointOfInterestTableWindowBody.setAttribute( 'id', 'points_interest_table__window__body' );
	pointOfInterestTableWindowBody.setAttribute( 'class', 'table-responsive' );
	pointOfInterestTableWindowBody.appendChild( this.pointofInterestTable.table );

	this.pointOfInterestTableWindow.setBody( pointOfInterestTableWindowBody );
	this.pointOfInterestTableWindow.setHeading( editor.languageData.PointOfInterest );
	
	var resizeCallback = function( event, ui ){
		
		var paddingBottomNeeded =  10, paddingLeftNeeded = 10;

		document.getElementById( 'points_interest_table__window__body' ).style.width = ( this.pointOfInterestTableWindow.dom.offsetWidth - ( paddingLeftNeeded * 2 ) )+ "px";
		document.getElementById( 'points_interest_table__window__body' ).style.marginLeft = paddingLeftNeeded + "px";

		document.getElementById( 'points_interest_table__window__body' ).style.height = ( this.pointOfInterestTableWindow.body.offsetHeight - ( paddingBottomNeeded * 2 ) ) + "px";
		document.getElementById( 'points_interest_table__window__body' ).style.marginTop = paddingBottomNeeded + "px";
		
	}

	this.pointOfInterestTableWindow.setResizable( false, 1.7, 155, 90, 700, 400, resizeCallback.bind( this ) );
	this.pointOfInterestTableWindow.setDraggable();
	//this.pointOfInterestTableWindow.show();

	editor.signals.objectRemoved.add( function( object ){

		if(object.userData.pointData){

			scope.hideModelDetails();
			scope.hide();
			scope.editHide();
			if(editor.allPointOfinterest.indexOf(object) != -1){

				var indexOfObject = editor.allPointOfinterest.indexOf(object);
				editor.allPointOfinterest.splice( indexOfObject , 1 );

			}
			editor.deletePointofIntrestNumber.push(object.userData.pointData.BadgeNumber);
			// var index = editor.deletePointofIntrestNumber.indexOf(object.userData.pointData.BadgeNumber);
			// if( index != -1)
			// {
			// 	editor.deletePointofIntrestNumber.splice( index , 1 )
			// }
			editor.deletePointofIntrestNumber = editor.deletePointofIntrestNumber.filter(function (value, index, self) { 
				return self.indexOf(value) === index;
			  });
            editor.deletePointofIntrestNumber.sort(function(a, b) {
              return b - a;
            });
			delete editor.scene.userData.PointofinterestData[object.uuid]
			var deletedPointOfintrestRow = document.getElementById( object.uuid + "__measure__row" );
			if( deletedPointOfintrestRow != null ){
				
				scope.pointofInterestTable.removeRow( deletedPointOfintrestRow );
			}

			//Modified for activity logging start
			try{

				//Modified for activity logging start
				var logDatas = {};
				logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Point of interest with title : "  + object.userData.pointData.Title + " removed";
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
		else{
			object.traverse( function( child ){

				if(child.userData.pointData){
					scope.hideModelDetails();
					scope.hide();
					scope.editHide();
					editor.deletePointofIntrestNumber.push(child.userData.pointData.BadgeNumber);
					editor.deletePointofIntrestNumber.sort(function(a, b) {
					  return b - a;
					});
					delete editor.scene.userData.PointofinterestData[child.uuid]
					var deletedPointOfintrestRow = document.getElementById( object.uuid + "__measure__row" );
					if( deletedPointOfintrestRow != null ){
						
						scope.pointofInterestTable.removeRow( deletedPointOfintrestRow );
		
					}

				}

			})
		}
	})
	
	editor.signals.objectChanged.add( function( object ){

		if(object.userData.pointData){

			editor.scene.userData.PointofinterestData[object.uuid].position = object.position;
		}

	})
	editor.signals.objectAdded.add( function( object ){

		if(object.userData.pointData){
			
			var key = object.uuid;
			var htmlTableValueRow = document.createElement( 'tr' );
			htmlTableValueRow.setAttribute( 'value', key );
			htmlTableValueRow.setAttribute( 'id', key + "__measure__row" );
		
			htmlTableValueRow.addEventListener( 'click', function( event ){
				editor.selectByUuid( this.getAttribute( 'value' ) );
			} );	
			var tableColumnValueTitle = document.createElement( 'td' );
			var tableColumnValueDescription = document.createElement( 'td' );
			var tableColumnValueposition = document.createElement( 'td' );
			
			tableColumnValueTitle.innerHTML = (object.userData.pointData.Title);
			htmlTableValueRow.appendChild( tableColumnValueTitle );

			tableColumnValueDescription.innerHTML = ( object.userData.pointData.Description );
			htmlTableValueRow.appendChild( tableColumnValueDescription );
			
			var position = '('+ Number(object.position.x).toFixed(1) + ',' + Number(object.position.y).toFixed(1) + ',' + Number(object.position.z).toFixed(1) +')'
			tableColumnValueposition.innerHTML = (  position );
			htmlTableValueRow.appendChild( tableColumnValueposition );
			
			scope.pointofInterestTable.addRow( htmlTableValueRow );
		}
	})
	
	return this;
}
PointOfIntrest.prototype =  {

	/**
     * create() - Method to create a window for adding a new point of interest.
     * @returns {Void}
     * @author Mavelil
     * @example <caption>Example usage of create method.</caption>
     * pointOfIntrest.create( );
     */
	create : function(){

		var scope = this;
		scope.ui = new UI.MobileWindow( 'point-interest-mob-window' );
       	scope.ui.setHeading( editor.languageData.Pointofinterest );
       	var bodyDiv = document.createElement('div');
       	bodyDiv.setAttribute("style" ," height : 135px;border: 1px solid rgb(204, 204, 204); margin-top :4px")

       	var TitleDiv = document.createElement('div');
       	TitleDiv.setAttribute("class" ,"input-group")
       	TitleDiv.setAttribute("style" ,"  margin-top: 13px !important; padding-right: 8px; padding-left: 8px;");
       	var inputTitleBox = document.createElement('input');
       	inputTitleBox.setAttribute( "class" , " form-control");
       	inputTitleBox.setAttribute("placeholder" , editor.languageData.Title)
       	inputTitleBox.setAttribute( "id" , "pointOfIntrestTitle");

       	var contentDiv = document.createElement('div');
       	contentDiv.setAttribute("class" ,"input-group")
       	contentDiv.setAttribute("style" ,"padding-right: 8px; padding-left: 8px;  margin-top: 8px !important; ");
   
       	var inputContent = document.createElement('textarea');
       	inputContent.setAttribute( "class" , " form-control");
       	//inputContent.maxLength = 25;
       	inputContent.setAttribute( "id" , "pointOfIntrestDescription");
       	inputContent.setAttribute('cols',80);
		inputContent.setAttribute('rows', 2);
		inputContent.setAttribute('style', 'resize:none;');
		inputContent.setAttribute("placeholder" , editor.languageData.Description);
		
		// Hyperlink
		var urlContent = document.createElement('input');
		urlContent.setAttribute( "type" , "text");
		urlContent.setAttribute( "class" , " form-control");
		urlContent.setAttribute( "id" , "pointOfIntrestHyperlink");
		urlContent.setAttribute("placeholder" , editor.languageData.Hyperlinks )

       	var footerDiv = document.createElement('div');
       	footerDiv.setAttribute("style" ,"     padding-top: 12px;padding-left: 60px;")
       	var saveButton = document.createElement('button');
       	saveButton.setAttribute("class","btn btn-success btn-sm")
       	saveButton.innerHTML = editor.languageData.Save;	
       	saveButton.addEventListener("click",() =>{
    		scope.saveData();
		});
       	var cancelButton = document.createElement('button');
       	cancelButton.setAttribute("class","btn btn-danger btn-sm")
       	cancelButton.setAttribute("style","margin-left: 3px;");
       	cancelButton.innerHTML = editor.languageData.Cancel;
       	cancelButton.addEventListener("click",() =>{
    		scope.hide();
		});
       	scope.ui.dom.className += "  pointofinterstModal";
       	document.getElementById( 'editorElement' ).appendChild( scope.ui.dom );
        $( '.pointofinterstModal' ).draggable( {
            containment: "parent"
        } );
       	TitleDiv.appendChild( inputTitleBox );
       	contentDiv.appendChild( inputContent );
       	contentDiv.appendChild( urlContent );
       	footerDiv.appendChild( saveButton );
       	footerDiv.appendChild( cancelButton );
       	bodyDiv.appendChild( TitleDiv );
       	bodyDiv.appendChild( contentDiv );
       	bodyDiv.appendChild( footerDiv );

       	scope.ui.setBody( bodyDiv );
       
       	document.getElementById( 'editorElement' ).appendChild( scope.ui.dom );
	},

	/**
     * createEditWindow() - Method to create the edit window for an existing point of interest.
     * @returns {Void}
     * @author Mavelil
     * @example <caption>Example usage of createEditWindow method.</caption>
     * pointOfIntrest.createEditWindow( );
     */
	createEditWindow : function(){

		var scope = this;
		scope.uiEdit = new UI.MobileWindow( 'edit-point-interest-mob-window' );
       	scope.uiEdit.setHeading( editor.languageData.EditPointofinterest );
       	var bodyDiv = document.createElement('div');
       	bodyDiv.setAttribute("style" ," height : 135px;border: 1px solid rgb(204, 204, 204); margin-top :4px")

       	var TitleDiv = document.createElement('div');
       	TitleDiv.setAttribute("class" ,"input-group")
       	TitleDiv.setAttribute("style" ,"  margin-top: 13px !important; padding-right: 8px; padding-left: 8px;");
       	var inputTitleBox = document.createElement('input');
       	inputTitleBox.setAttribute( "class" , " form-control");
       	inputTitleBox.setAttribute("placeholder" , editor.languageData.Title)
       	inputTitleBox.setAttribute( "id" , "editPointOfIntrestTitle");

       	var contentDiv = document.createElement('div');
       	contentDiv.setAttribute("class" ,"input-group")
       	contentDiv.setAttribute("style" ,"padding-right: 8px; padding-left: 8px;  margin-top: 8px !important; ");
   
       	var inputContent = document.createElement('textarea');
       	inputContent.setAttribute( "class" , " form-control");
		inputContent.setAttribute( "id" , "editPointOfIntrestDescription");
		inputContent.setAttribute('cols',80);
		inputContent.setAttribute('rows', 2);
		inputContent.setAttribute('style', 'resize:none;');
		inputContent.setAttribute("placeholder" , editor.languageData.Description);
		   
		// Hyperlink
		var urlContent = document.createElement('input');
		urlContent.setAttribute( "type" , "text");
		urlContent.setAttribute( "class" , " form-control");
		urlContent.setAttribute( "id" , "editPointOfIntrestHyperlink");
		urlContent.setAttribute("placeholder" ,  editor.languageData.Hyperlinks )

       	var footerDiv = document.createElement('div');
       	footerDiv.setAttribute("style" ,"     padding-top: 12px;padding-left: 60px;")
       	var saveButton = document.createElement('button');
       	saveButton.setAttribute("class","btn btn-success btn-sm")
       	saveButton.innerHTML = editor.languageData.Save;	
       	saveButton.addEventListener("click",() =>{
			scope.editSaveData();
		});
       	var cancelButton = document.createElement('button');
       	cancelButton.setAttribute("class","btn btn-danger btn-sm")
       	cancelButton.setAttribute("style","margin-left: 3px;");
       	cancelButton.innerHTML = editor.languageData.Cancel;
       	cancelButton.addEventListener("click",() =>{
    		scope.editHide();
		});
		scope.uiEdit.dom.className += "  pointofinterstModal";
       	document.getElementById( 'editorElement' ).appendChild( scope.uiEdit.dom );
        $( '.pointofinterstModal' ).draggable( {
            containment: "parent"
        } );
       	TitleDiv.appendChild( inputTitleBox );
       	contentDiv.appendChild( inputContent );
       	contentDiv.appendChild( urlContent );
       	footerDiv.appendChild( saveButton );
       	footerDiv.appendChild( cancelButton );
       	bodyDiv.appendChild( TitleDiv );
       	bodyDiv.appendChild( contentDiv );
       	bodyDiv.appendChild( footerDiv );

       	scope.uiEdit.setBody( bodyDiv );
       
       	document.getElementById( 'editorElement' ).appendChild( scope.uiEdit.dom );
	},

	/**
     * createDetailsWindow() - Method to create the details window for an existing point of interest on double click.
     * @returns {Void}
     * @author Mavelil
     * @example <caption>Example usage of createDetailsWindow method.</caption>
     * pointOfIntrest.createDetailsWindow( );
     */
	createDetailsWindow : function(){

		var scope = this;
		scope.uiDetails = new UI.MobileWindow( 'details-point-interest-mob-window' );
       	scope.uiDetails.setHeading( editor.languageData.Detailsofpointofinterest );
       	var bodyDiv = document.createElement('div');
       	bodyDiv.setAttribute("style" ," height : 135px;border: 1px solid rgb(204, 204, 204); margin-top :4px")

       	var TitleDiv = document.createElement('div');
       	TitleDiv.setAttribute("class" ,"input-group")
       	TitleDiv.setAttribute("style" ,"  margin-top: 13px !important; padding-right: 8px; padding-left: 8px;");
       	var inputTitleBox = document.createElement('input');
       	inputTitleBox.setAttribute( "class" , " form-control");
       	inputTitleBox.setAttribute("placeholder" , editor.languageData.Title)
		inputTitleBox.setAttribute( "id" , "detailsPointOfIntrestTitle");
		inputTitleBox.setAttribute("disabled", true);
		//inputContent.disabled = true;   

       	var contentDiv = document.createElement('div');
       	contentDiv.setAttribute("class" ,"input-group")
       	contentDiv.setAttribute("style" ,"padding-right: 8px; padding-left: 8px;  margin-top: 8px !important; ");
   
       	var inputContent = document.createElement('textarea');
       	inputContent.setAttribute( "class" , " form-control");
		inputContent.setAttribute( "id" , "detailsPointOfIntrestDescription");
		inputContent.setAttribute('cols',80);
		inputContent.setAttribute('rows', 2);
		inputContent.setAttribute('style', 'resize:none;');
		inputContent.setAttribute("placeholder" , editor.languageData.Description);
		inputContent.setAttribute("disabled", true);

		// Hyperlink
		var urlContent = document.createElement('input');
		urlContent.setAttribute( "type" , "text");
		urlContent.setAttribute( "class" , " form-control");
		urlContent.setAttribute( "id" , "detailsPointOfIntrestHyperlink");
		urlContent.setAttribute("placeholder" , "hyperlinks");
		urlContent.setAttribute("disabled", true);


		var iconToNavigate = document.createElement('a');
		iconToNavigate.setAttribute("style", "text-align: center;")
		iconToNavigate.innerHTML = "<i class='fa fa-map-marker' aria-hidden='true'></i> Click to Navigate"
		iconToNavigate.setAttribute("id", "iconPointOfInterestHyperlink");
		iconToNavigate.setAttribute("target", "_blank");

		scope.uiDetails.dom.className += "  detailsPointofinterstModal";
      
        $( '.detailsPointofinterstModal' ).draggable( {
            containment: "parent"
		} );
		
       	TitleDiv.appendChild( inputTitleBox );
       	contentDiv.appendChild( inputContent );
       	contentDiv.appendChild( urlContent );
       	contentDiv.appendChild( iconToNavigate );
       	bodyDiv.appendChild( TitleDiv );
       	bodyDiv.appendChild( contentDiv );
       	scope.uiDetails.setBody( bodyDiv );
		document.getElementById( 'editorElement' ).appendChild(  scope.uiDetails.dom );
		   
	},

	/**
     * show( position ) - Method to show the point of interest create window.
	 * @param {Object} position - Object containing the properties distance, point, object etc. As returned from the THREE.Raycaster intersectObject method.
     * @returns {Void}
     * @author Mavelil
     * @example <caption>Example usage of show method.</caption>
     * pointOfIntrest.show( position );
     */

	show : function( position ){
		var scope = this;
		scope.title = "";
		scope.content = "";
		document.getElementById('pointOfIntrestTitle').value = "";
		document.getElementById('pointOfIntrestDescription').value = "" ;
		document.getElementById('pointOfIntrestHyperlink').value = "" ;
		scope.position = position.point;
		scope.currentObject = position.object;
		scope.ui.show();
	},

	/**
     * hide() - Method to hide the point of interest create window.
     * @returns {Void}
     * @author Mavelil
     * @example <caption>Example usage of hide method.</caption>
     * pointOfIntrest.hide( );
     */

	hide : function(){

		var scope = this;
		scope.title = "";
		scope.content = "";
		document.getElementById('pointOfIntrestTitle').value = "";
		document.getElementById('pointOfIntrestDescription').value = "" ;
		document.getElementById('pointOfIntrestHyperlink').value = "" ;
		scope.ui.hide();
	},

	/**
     * saveData() - Method to save the point of interest details.
     * @returns {Void}
     * @author Mavelil
     * @example <caption>Example usage of saveData method.</caption>
     * pointOfIntrest.saveData( );
     */

	saveData : function(){

		var scope = this;
		scope.title = document.getElementById('pointOfIntrestTitle').value;
		scope.content = document.getElementById('pointOfIntrestDescription').value;
		scope.hyperlink = document.getElementById('pointOfIntrestHyperlink').value;
		var urlRegex = /^$|^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
		if( scope.title == "" || scope.content == "" )
		{
			toastr.info( editor.languageData.Pleaseenterthedetailsandsavethese )
		}
		else if ( !urlRegex.test( scope.hyperlink ) ){
			toastr.warning( editor.languageData.SorryTheUrlSeemstobeInvalid )
		}
		
		else{

			scope.addLabel();
		}
		
	},

	/**
     * addLabel() - Method to add a badge number for the point of interest to be created.
     * @returns {Void}
     * @author Mavelil
     * @example <caption>Example usage of addLabel method.</caption>
     * pointOfIntrest.addLabel( );
     */

	addLabel : function(){

		
        var scope = this;  
        
        if(editor.deletePointofIntrestNumber.length == 0){

        	editor.pointofIntrestNumber++ ;
        	scope.findBadgeNumber(); 
        } 
        else{

        	scope.pointOfintrestBadge =editor.deletePointofIntrestNumber.pop();
        	scope.addSprite();
        }
        
        
	},

	/**
     * findBadgeNumber() - Method to find the badge number of the point of interest to be created.
     * @returns {Void}
     * @author Mavelil
     * @example <caption>Example usage of findBadgeNumber method.</caption>
     * pointOfIntrest.findBadgeNumber( );
     */

	findBadgeNumber : function(){

		var scope = this;  

		if(editor.savepointofIntrestNumber.includes( editor.pointofIntrestNumber) ){

			editor.pointofIntrestNumber++
			scope.findBadgeNumber()
		} 
		else {

			 scope.pointOfintrestBadge = editor.pointofIntrestNumber;
			 scope.addSprite();
		}
	},

	/**
     * addSprite() - Method to create the point of interest sprite.
     * @returns {Void}
     * @author Mavelil
     * @example <caption>Example usage of addSprite method.</caption>
     * pointOfIntrest.addSprite( );
     */

	addSprite : function(){

		var scope = this ;
		var iconUrl = 'assets/img/pindrop_yellow.png';
		var badgeTextValue = Number(scope.pointOfintrestBadge).toString();
		var badgeColor = new THREE.Color( editor.randomColor() ).getHexString();
		badgeColor = '#'+badgeColor;
		var option = {number:badgeTextValue,badgeColour :badgeColor }        
		//var iconBadge = editor.triangleWithBadge(option);
		var iconBadge = editor.iconWithBadgeSpriteForPoi(iconUrl, badgeTextValue, badgeColor);
        iconBadge.name = "Point Of Interest "+ badgeTextValue;
        iconBadge.position.copy( scope.position );
		iconBadge.scale.set( 1.5, 1.5, 1.5 )
        /*var spriteCanvas = document.createElement('canvas');
        var spriteTexture = new THREE.Texture(spriteCanvas);
        spriteCanvas.width = spriteCanvas.height = 300;
        var ctx = spriteCanvas.getContext('2d');
        ctx.fillStyle="black";
        ctx.fillRect(0,0,300,300)
        ctx.fillStyle = "White";
        ctx.font = '30px serif';
		ctx.textAlign = 'center';
		var maxWidth = 280;
		var lineHeight = 30;
		var x1 = 130;
		var y1 =75;
		scope.warpText(ctx,scope.title,x1,y1,maxWidth,lineHeight);
		//ctx.fillText(scope.title, 100, 100);
		ctx.font = '20px serif';
		var x2 = 130;
		var y2 =150;
		scope.warpText(ctx,scope.content,x2,y2,maxWidth,lineHeight);
		//ctx.fillText( scope.content , 50, 150);

		spriteTexture.needsUpdate = true;
		var sprite = new THREE.Sprite(new THREE.SpriteMaterial({

            map: spriteTexture

        }));
		var vectorData = new THREE.Vector3(0.05,1.28,0.5);
		sprite.name ="DetailsOfPointOfIntrest"
		sprite.position.copy( vectorData );
        sprite.scale.set(1.5, 1.5, 1.5);
        iconBadge.add(sprite)*/
		
        var currentSprite = iconBadge;
        var DataOfPointofIntrestr = {Title : scope.title,Description : scope.content,BadgeNumber : scope.pointOfintrestBadge , BadgeColor : badgeColor,Hyperlink : scope.hyperlink};
        currentSprite.userData.pointData = DataOfPointofIntrestr;
		editor.execute( new AddObjectCommand( iconBadge ) );
		editor.allPointOfinterest.push( iconBadge )
		var pickedObject = scope.currentObject;
		
		
		while( !( pickedObject.parent instanceof THREE.Scene ) ){

			pickedObject = pickedObject.parent;

		}
		
		THREE.SceneUtils.attach( iconBadge, editor.scene, pickedObject );
		if(editor.scene.userData.PointofinterestData){

			var data = {};
			data.Title = scope.title;
			data.content = scope.content;
			data.position = scope.position;
			data.color = badgeColor
			data.hyperlink = scope.hyperlink;
			var badgeUuid = iconBadge.uuid;
			editor.scene.userData.PointofinterestData[badgeUuid] = data

		}
		else{
			
			editor.scene.userData.PointofinterestData = {};
			var data = {};
			data.Title = scope.title;
			data.content = scope.content;
			data.position = scope.position;
			data.color = badgeColor;
			data.hyperlink = scope.hyperlink;
			var badgeUuid = iconBadge.uuid;
			editor.scene.userData.PointofinterestData[badgeUuid] = data
			
		}
		
		toastr.info(editor.languageData.pointofinterestadded);
        scope.hide();
		
		//Modified for activity logging start
		try{

			//Modified for activity logging start
			var logDatas = {};
			logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Point of interest added with title : "  + DataOfPointofIntrestr.Title;
			logger.addLog( logDatas );
			logger.sendLogs( localStorage.getItem( 'U_ID' ) );
			//Modified for activity logging end

		}
		catch( exception ){

			console.log( "Logging failed!" );
			console.log( exception );

		}
		//Modified for activity logging end

	},

	/**
     * editColor( color ) - Method to change color of the point of interest.
	 * @param {String} color - Hex Code of the color to be assigned.
     * @returns {Void}
     * @author Mavelil
     * @example <caption>Example usage of editColor method.</caption>
     * pointOfIntrest.editColor( color );
     */

	editColor : function(color){

		var scope = this;
		var object = editor.selected;
		var pickedObject = object.parent;
		var pointOfInterestData = object.userData.pointData;
		var badgeTextValue = Number(object.userData.pointData.BadgeNumber).toString();
		
		var badgeColor = color;
		var option = {
			number:badgeTextValue,
			badgeColour :badgeColor
		}
		//var iconBadge = editor.triangleWithBadge(option);
		var iconUrl = 'assets/img/pindrop_yellow.png';
		var iconBadge = editor.iconWithBadgeSpriteForPoi(iconUrl, badgeTextValue, badgeColor);
        iconBadge.name = "Point Of Interest "+ badgeTextValue;
		iconBadge.position.copy( object.position );
		var currentSprite = iconBadge;
        var DataOfPointofIntrestr = {Title : pointOfInterestData.Title,Description : pointOfInterestData.Description,BadgeNumber : Number( badgeTextValue ) , BadgeColor : badgeColor,Hyperlink:pointOfInterestData.Hyperlink};
		currentSprite.userData.pointData = DataOfPointofIntrestr;
		editor.execute( new AddObjectCommand( iconBadge ) );
		editor.execute( new RemoveObjectCommand(object));
		var index = editor.allPointOfinterest.indexOf(object);
		if(index != -1) {
			editor.allPointOfinterest.splice(index,1)
		}
		editor.deletePointofIntrestNumber.splice( editor.deletePointofIntrestNumber.indexOf( Number( badgeTextValue ) ) , 1 );
		editor.allPointOfinterest.push( iconBadge );
				
		while( !( pickedObject.parent instanceof THREE.Scene ) ){

			pickedObject = pickedObject.parent;

		}
		THREE.SceneUtils.attach( iconBadge, editor.scene, pickedObject );
		if(editor.scene.userData.PointofinterestData){

			var data = {};
			data.Title = pointOfInterestData.Title;
			data.content = pointOfInterestData.Description;
			data.position = iconBadge.position;
			data.color = badgeColor;
			data.hyperlink = scope.hyperlink;
			var badgeUuid = iconBadge.uuid;
			editor.scene.userData.PointofinterestData[badgeUuid] = data

		}
		else{
			
			editor.scene.userData.PointofinterestData = {};
			var data = {};
			data.Title = pointOfInterestData.Title;
			data.content = pointOfInterestData.Description;
			data.position = iconBadge.position;
			data.color = badgeColor
			data.hyperlink = scope.hyperlink;
			var badgeUuid = iconBadge.uuid;
			editor.scene.userData.PointofinterestData[badgeUuid] = data
			
		}
		
		toastr.info( editor.languageData.ColorUpdatedSuccessfully );
		editor.deselect();
		

	},
	warpText : function(context,text,x,y,maxWidth,lineHeight){
		
		var words = text.split(' ');
		var line = '';
		for(var n = 0 ; n < words.length; n++){
		
		   var testLine = line+ words[n] + " ";
		   var metrics = context.measureText(testLine);
		   var testWidth = metrics.width;
		   if(testWidth > maxWidth  && n>0){
			
			   context.fillText(line,x,y)
			   line = words[n];
			   y += lineHeight;
			   
		   }
		   else{
			   
			   line = testLine
		   }
		}
		context.fillText(line,x,y);
	},

	/**
     * hideAllPointOfIntrest() - Method to hide all the point of interests.
     * @returns {Void}
     * @author Mavelil
     * @example <caption>Example usage of hideAllPointOfIntrest method.</caption>
     * pointOfIntrest.hideAllPointOfIntrest( );
     */

	hideAllPointOfIntrest : function(){
		
		editor.scene.traverse(function(child){

			if(child.userData.pointData){
				child.visible = false;
				editor.signals.objectChanged.dispatch(child)
			}
		})

	},

	/**
     * ShowAllPointOfIntrest() - Method to show all the point of interests.
     * @returns {Void}
     * @author Mavelil
     * @example <caption>Example usage of ShowAllPointOfIntrest method.</caption>
     * pointOfIntrest.ShowAllPointOfIntrest( );
     */

	ShowAllPointOfIntrest : function(){

		editor.scene.traverse(function(child){

			if(child.userData.pointData){
				child.visible = true;
				editor.signals.objectChanged.dispatch(child)
			}
		})
		
	},

	/**
     * updateTable( data ) - Method to update the table showing point of interest details.
	 * @param {Object} data - Details of the point of interests.
     * @returns {Void}
     * @author Mavelil
     * @example <caption>Example usage of updateTable method.</caption>
     * pointOfIntrest.updateTable( data );
     */

	updateTable  : function( data ){

		var htmlTableBody = document.createElement( 'tbody' );
		var pointOfInteresttKeys = Object.keys( data ); //pointOfInteresttKeys holds all of the '<measurement line uuid>'
		if( pointOfInteresttKeys.length != 0 ){

			var tableHeaders = Object.keys( data[ pointOfInteresttKeys[ 0 ] ] );
			tableHeaders.splice( tableHeaders.indexOf( 'color' ), 1 );
			this.pointofInterestTable.setHeadersFromArray( tableHeaders );
			
			for( var key in data ){				

				var pointOfinterestItem = key; 
				var htmlTableValueRow = document.createElement( 'tr' );
				htmlTableValueRow.setAttribute( 'value', key );
				htmlTableValueRow.setAttribute( 'id', key + "__measure__row" );
				
				htmlTableValueRow.addEventListener( 'click', function( event ){
					editor.selectByUuid( this.getAttribute( 'value' ) );
				} );

				//Looping through each info in a single measurement
				//info holds each of the keys in a single measurement
				for( var info in data[ pointOfinterestItem ] ){

					var tableColumnValue = document.createElement( 'td' );
					var infoUpper = info.toUpperCase();
					if( infoUpper === 'POSITION' ){

						var point = data[ pointOfinterestItem ][ info ];
						tableColumnValue.innerHTML = "( " + point.x.toFixed( 1 ) + ", " + point.y.toFixed( 1 ) + ", " + point.z.toFixed( 1 ) + " )";
						htmlTableValueRow.appendChild( tableColumnValue );

					}
					
					
					else if (  infoUpper === 'TITLE' ||  infoUpper === 'CONTENT' || infoUpper === 'HYPERLINK') {

						tableColumnValue.innerHTML = data[ pointOfinterestItem ][ info ];
						htmlTableValueRow.appendChild( tableColumnValue );

					}

				}

				htmlTableBody.appendChild( htmlTableValueRow );
			
			}

			this.pointofInterestTable.setBody( htmlTableBody );

		}
		else{

			console.warn( "Measurement data is empty!" );

		}

	},

	/**
     * listShow() - Method to show the table of point of interest details.
     * @returns {Void}
     * @author Mavelil
     * @example <caption>Example usage of listShow method.</caption>
     * pointOfIntrest.listShow( );
     */

	listShow:function(){
		var scope = this;

		if (editor.scene.userData.PointofinterestData){

			scope.updateTable( editor.scene.userData.PointofinterestData )
			scope.pointOfInterestTableWindow.show();

		}
		else{
			toastr.warning( editor.languageData.Nopointofinterestismarked )
		}

	},

	/**
     * listHide() - Method to hide the table of point of interest details.
     * @returns {Void}
     * @author Mavelil
     * @example <caption>Example usage of listHide method.</caption>
     * pointOfIntrest.listHide( );
     */

	listHide:function(){
		var scope = this;
		scope.pointOfInterestTableWindow.hide();

	},

	/**
     * editPointofIntertData( object ) - Method to show edit window for an existing point of interest.
	 * @param {Object} object - Details of the point of interests.
     * @returns {Void}
     * @author Mavelil
     * @example <caption>Example usage of editPointofIntertData method.</caption>
     * pointOfIntrest.editPointofIntertData( object );
     */

	editPointofIntertData : function( object ){
		
		var scope = this ;
		document.getElementById('editPointOfIntrestTitle').value = object.userData.pointData.Title ;
		document.getElementById('editPointOfIntrestDescription').value = object.userData.pointData.Description ;
		document.getElementById('editPointOfIntrestHyperlink').value = object.userData.pointData.Hyperlink ;
		scope.currentEditObject = object;
		scope.uiEdit.show();
	},

	/**
     * editSaveData( ) - Method to read the edited point of interest details.
     * @returns {Void}
     * @author Mavelil
     * @example <caption>Example usage of editSaveData method.</caption>
     * pointOfIntrest.editSaveData( );
     */

	editSaveData : function(){
		
		var scope = this ;
		var oldTitle = scope.currentEditObject.userData.pointData.Title;
		scope.currentEditTitle = document.getElementById('editPointOfIntrestTitle').value;
		scope.currentEditDescription = document.getElementById('editPointOfIntrestDescription').value;
		scope.currentEditHyperlink = document.getElementById('editPointOfIntrestHyperlink').value;
		if( scope.currentEditTitle != "" && scope.currentEditDescription != "" ){

			scope.currentEditObject.userData.pointData.Title = scope.currentEditTitle;
			scope.currentEditObject.userData.pointData.Description = scope.currentEditDescription;
			scope.currentEditObject.userData.pointData.Hyperlink = scope.currentEditHyperlink;
	
			var objectUuid = scope.currentEditObject.uuid
			scope.updateUserData(objectUuid, scope.currentEditTitle , scope.currentEditDescription , scope.currentEditHyperlink  );
			scope.editHide();

			//Modified for activity logging start
			try{

				//Modified for activity logging start
				var logDatas = {};
				logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Point of interest with title "  + oldTitle + " editted, { title : " + scope.currentEditTitle  + ", description : " + scope.currentEditDescription + " }";
				logger.addLog( logDatas );
				logger.sendLogs( localStorage.getItem( 'U_ID' ) );
				//Modified for activity logging end

			}
			catch( exception ){

				console.log( "Logging failed!" );
				console.log( exception );

			}
			//Modified for activity logging end

			toastr.success( editor.languageData.UpdatedSuccessfully );

		}
		else{

			toastr.info(editor.languageData.Pleaseenterthedetailsandsavethese)
		}

	},
	updateChildMateraial: function(title,content){
		var scope = this;
		var spriteCanvas = document.createElement('canvas');
        var spriteTexture = new THREE.Texture(spriteCanvas);
        spriteCanvas.width = spriteCanvas.height = 300;
        var ctx = spriteCanvas.getContext('2d');
        ctx.fillStyle="black";
        ctx.fillRect(0,0,300,300)
        ctx.fillStyle = "White";
        ctx.font = '30px serif';
		ctx.textAlign = 'center';
		var maxWidth = 280;
		var lineHeight = 30;
		var x1 = 130;
		var y1 =75;
		scope.warpText(ctx,title,x1,y1,maxWidth,lineHeight);
		//ctx.fillText(scope.title, 100, 100);
		ctx.font = '20px serif';
		var x2 = 130;
		var y2 =150;
		scope.warpText(ctx,content,x2,y2,maxWidth,lineHeight);
		//ctx.fillText( scope.content , 50, 150);

		spriteTexture.needsUpdate = true;
		return spriteTexture;

	},

	/**
     * updateUserData( id,title,content,hyperlink ) - Method to update the point of interest userData.
	 * @param {String} id - id of the point of interest. 
	 * @param {String} title - title of the point of interest. 
	 * @param {String} content - content of the point of interest. 
	 * @param {String} hyperlink - hyperlink for the point of interest. 
     * @returns {Void}
     * @author Mavelil
     * @example <caption>Example usage of updateUserData method.</caption>
     * pointOfIntrest.updateUserData( id,title,content,hyperlink );
     */
	updateUserData : function(id,title,content,hyperlink){

		var scope = this;
		editor.scene.userData.PointofinterestData[ id ].Title = title ; 
		editor.scene.userData.PointofinterestData[ id ].content = content ; 
		editor.scene.userData.PointofinterestData[ id ].hyperlink = hyperlink ; 
		scope.updateTable( editor.scene.userData.PointofinterestData );

	},
	
	/**
     * editHide( ) - Method to hide the edit window for an existing point of interest.
     * @returns {Void}
     * @author Mavelil
     * @example <caption>Example usage of editHide method.</caption>
     * pointOfIntrest.editHide( );
     */
	editHide : function(){

		var scope = this;
		scope.uiEdit.hide();
	},

	/**
     * showDetails( object ) - Method to set the details window of the point of interest.
	 * @param {Object} object - Point of interest object.
     * @returns {Void}
     * @author Mavelil
     * @example <caption>Example usage of showDetails method.</caption>
     * pointOfIntrest.showDetails( object );
     */

	showDetails : function(object){

		var scope = this ;
		var camera = editor.camera;
		var screenPosition  =  scope.toScreenPosition( object , camera);
		scope.uiDetails.dom.style.left = screenPosition.x + "px";
		scope.uiDetails.dom.style.top = screenPosition.y + "px";
		document.getElementById('detailsPointOfIntrestTitle').value = object.userData.pointData.Title;
		document.getElementById('detailsPointOfIntrestDescription').value = object.userData.pointData.Description;
		document.getElementById('detailsPointOfIntrestHyperlink').value = object.userData.pointData.Hyperlink;
		document.getElementById('iconPointOfInterestHyperlink').href = object.userData.pointData.Hyperlink;

	},

	/**
     * showModelDetails( ) - Method to show the details window of the point of interest.
	 * @returns {Void}
     * @author Mavelil
     * @example <caption>Example usage of showModelDetails method.</caption>
     * pointOfIntrest.showModelDetails( );
     */

	showModelDetails : function(){

		var scope = this ;
		scope.uiDetails.show();
	},


	/**
     * hideModelDetails( ) - Method to hide the details window of the point of interest.
	 * @returns {Void}
     * @author Mavelil
     * @example <caption>Example usage of hideModelDetails method.</caption>
     * pointOfIntrest.hideModelDetails( );
     */

	hideModelDetails : function(){


		var scope = this ;
		scope.uiDetails.hide();
	},

	/**
     * toScreenPosition( obj, camera ) - Method to hide the details window of the point of interest.
	 * @param {Object} obj - Point of interest object.
	 * @param {Object<THREE.PerspectiveCamera>} camera - Instance of perspective camera.
	 * @returns {Object} - JSON object containing the x and y values
     * @author Mavelil
     * @example <caption>Example usage of toScreenPosition method.</caption>
     * pointOfIntrest.toScreenPosition( obj, camera );
     */	
	toScreenPosition : function( obj, camera )
    {
        var vector = new THREE.Vector3();
        var view = document.getElementById( 'viewport' );
        var widthHalf = 0.5 * view.offsetWidth;
        var heightHalf = 0.5 * view.offsetHeight;

        obj.updateMatrixWorld();
        vector.setFromMatrixPosition(obj.matrixWorld);
        vector.project(camera);

        vector.x = ( vector.x * widthHalf ) + widthHalf;
        vector.y = - ( vector.y * heightHalf ) + heightHalf;

        return { 
            x: vector.x,
            y: vector.y
        };

    }



}