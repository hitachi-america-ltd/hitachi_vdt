AddSmartSensor = function( editor ){

    this.allSensorDetails;
    this.dbCategoryOptions;

}

AddSmartSensor.prototype = {

    createNewSensorModal : function(){
        var scope = this;
        var sensorCategoryList;
        var sensorCategoryOptions = [];
        function setOptions( selectTag, options ){
            options.forEach( ( child ) => {
                var opt = document.createElement( 'option' );
                opt.value = child;
                opt.innerHTML = child;
                selectTag.appendChild( opt );
            } )
        
        }
        function getSmartSensorDetails(){
                return new Promise( (resolve, reject) => {
                    $.ajax({
                        url: editor.api + 'sensor/',
                        type: 'GET',
                        dataType: 'json',
                        success: function(response) {

                            sensorCategoryList = response;
                            sensorCategoryList.forEach( child => {
                            
                                if( !(sensorCategoryOptions.includes( child.category ))){
                                
                                    sensorCategoryOptions.push( child.category );
                                    sensorCategoryOptions[ child.category ] = [];
                                    sensorCategoryOptions[ child.category ].push( child.subCategory );
                                
                                } else{
                                
                                    sensorCategoryOptions[ child.category ].push( child.subCategory );
                                
                                }
                            
                            } )
                            resolve( sensorCategoryOptions );
                        
                        },
                        error: function(jqxhr, status, msg) {  
                            toastr.error("Upload Failed Try Again !!");
                        }
                    });  
                } )
        }

    
        var container = document.createElement( 'div' );
    
        var headingDiv = document.createElement( 'div' );
        var heading = document.createElement( 'h3' );
        heading.innerHTML = editor.languageData.PleaseAddSmartSensorDetails;
        heading.className = 'smart-sensor-heading';
        headingDiv.appendChild( heading );
    
        var firstRow = document.createElement( 'div' );
        firstRow.classList = 'row smart-sensor-rows';
    
        var brandNameDiv = document.createElement( 'div' );
        brandNameDiv.classList = "col-sm-3 smart-sensor-div";
        var brandLabel = document.createElement('label');
        brandLabel.innerHTML = editor.languageData.BrandName;
        brandLabel.className = "required"
        var brandInput = document.createElement('input');
        brandInput.classList = "form-control required smart-sensor-inputs";
        brandInput.placeholder = editor.languageData.ForEg + ": Hitachi"
        brandInput.id = 'smart-sensor-brand';
        brandNameDiv.appendChild( brandLabel );
        brandNameDiv.appendChild( brandInput );
    
        var modelNameDiv = document.createElement( 'div' );
        modelNameDiv.classList = "col-sm-3 smart-sensor-div";
        var modelLabel = document.createElement('label');
        modelLabel.innerHTML = editor.languageData.ModelName;
        modelLabel.className = "required"
        var modelInput = document.createElement('input');
        modelInput.classList = "form-control required smart-sensor-inputs";
        modelInput.placeholder = editor.languageData.ForEg + ": DI-CB320G"
        modelInput.id = 'smart-sensor-model';
        modelNameDiv.appendChild( modelLabel );
        modelNameDiv.appendChild( modelInput );
    
        var sensorTypeDiv = document.createElement( 'div' );
        sensorTypeDiv.classList = "col-sm-3 smart-sensor-div";
        var sensorTypeLabel = document.createElement('label');
        sensorTypeLabel.innerHTML = editor.languageData.Coverage;
        var sensoryTypeUnitDiv = document.createElement( 'div' );
        sensoryTypeUnitDiv.className = "row";
        var sensorTypeInput = document.createElement('input');
        sensorTypeInput.type = "number";
        sensorTypeInput.placeholder = "1-100";
        sensorTypeInput.min = 1;
        sensorTypeInput.max = 100;
        sensorTypeInput.classList = "form-control smart-sensor-inputs col-sm-9";
        sensorTypeInput.id = 'smart-sensor-coverage';
        sensorTypeUnit = document.createElement( 'label' );
        sensorTypeUnit.innerHTML = "ft";
        sensorTypeUnit.className = "col-sm-3 input-unit"
        sensorTypeDiv.appendChild( sensorTypeLabel );
        sensorTypeDiv.appendChild( sensoryTypeUnitDiv );
        sensoryTypeUnitDiv.appendChild( sensorTypeInput );
        sensoryTypeUnitDiv.appendChild( sensorTypeUnit );

        sensorTypeInput.addEventListener( 'change', ( event ) => {

            if( event.target.value != '' ){

                if( event.target.value > 100 )
                    sensorTypeInput.value = 100
                else if( event.target.value < 1 )
                    sensorTypeInput.value = 1
            
            }
        } )

        var sensorHeightDiv = document.createElement( 'div' );
        sensorHeightDiv.classList = "col-sm-3 smart-sensor-div";
        var sensorHeightLabel = document.createElement('label');
        sensorHeightLabel.innerHTML = editor.languageData.Height;
        var senssorHeightUnitDiv = document.createElement( 'div' );
        senssorHeightUnitDiv.className = "row"
        var sensorHeightInput = document.createElement('input');
        sensorHeightInput.type = "number"
        sensorHeightInput.placeholder = "1-50";
        sensorHeightInput.min = 1;
        sensorHeightInput.max = 50;
        sensorHeightInput.classList = "form-control smart-sensor-inputs col-sm-5";
        sensorHeightInput.id = 'smart-sensor-height';
        sensorHeightUnit = document.createElement( 'label' );
        sensorHeightUnit.innerHTML = "ft";
        sensorHeightUnit.className = "col-sm-3 input-unit";
        sensorHeightDiv.appendChild( sensorHeightLabel );
        sensorHeightDiv.appendChild( senssorHeightUnitDiv );
        senssorHeightUnitDiv.appendChild( sensorHeightInput );
        senssorHeightUnitDiv.appendChild( sensorHeightUnit );

        sensorHeightInput.addEventListener( 'change', ( event ) => {
            
            if( event.target.value != '' ){
                if( event.target.value > 50 )
                    sensorHeightInput.value = 50
                else if( event.target.value < 1 )
                    sensorHeightInput.value = 1
            }
            

        } )
    
        firstRow.appendChild( brandNameDiv );
        firstRow.appendChild( modelNameDiv );
        firstRow.appendChild( sensorTypeDiv );
        firstRow.appendChild( sensorHeightDiv );
    
        var secondRow = document.createElement( 'div' );
        secondRow.classList = 'row smart-sensor-rows';
    
        var sensorCategoryDiv = document.createElement( 'div' );
        sensorCategoryDiv.classList = "col-sm-3 smart-sensor-div";
        var sensorCategoryLabel = document.createElement('label');
        sensorCategoryLabel.innerHTML = editor.languageData.SensorCategory;
        var sensorCategorySelect = document.createElement( 'select' );
        sensorCategorySelect.classList = "form-control required smart-sensor-inputs";
        sensorCategorySelect.id = "smart-sensor-category";
    
        sensorCategoryDiv.appendChild( sensorCategoryLabel );
        sensorCategoryDiv.appendChild( sensorCategorySelect );
    
        var applicationTypeDiv = document.createElement( 'div' );
        applicationTypeDiv.classList = "col-sm-3 smart-sensor-div";
        applicationTypeDiv.id = 'application-type-div'
        var applicationTypeLabel = document.createElement('label');
        applicationTypeLabel.innerHTML = editor.languageData.ApplicationType;
        applicationTypeDiv.appendChild( applicationTypeLabel );
    
        getSmartSensorDetails().then( sensorCategoryOptions => {

            scope.dbCategoryOptions = sensorCategoryOptions

            setOptions( sensorCategorySelect, sensorCategoryOptions )
            setOptions( sensorCategorySelect, ['other'] );
        
            for( var i = 0 ; i < sensorCategoryOptions.length; i++ ){
                var categoryName = sensorCategoryOptions[i]
                var applicationTypeSelect = document.createElement( 'select' );
                applicationTypeSelect.style.display = "none";
                applicationTypeSelect.classList = "form-control required smart-sensor-inputs";
                applicationTypeSelect.id = categoryName + "select";
                setOptions( applicationTypeSelect, sensorCategoryOptions[categoryName] );
                applicationTypeDiv.appendChild( applicationTypeSelect );
            
            }
            applicationTypeDiv.children[1].style.display = "block";
        
        } )

        var connectionTypeDiv = document.createElement( 'div' );
        connectionTypeDiv.classList = "col-sm-3 smart-sensor-div";
        var connectionTypeLabel = document.createElement('label');
        connectionTypeLabel.innerHTML = editor.languageData.ConnectionType;
        var connectionTypeSelect = document.createElement( 'select' );
        connectionTypeSelect.classList = "form-control required smart-sensor-inputs";
        connectionTypeSelect.id = "smart-sensor-connection";
        
        var connectionOptions = [ "Battery", "PoE", "Wired", "Wi-Fi", "Other" ];
        setOptions( connectionTypeSelect, connectionOptions )
        
        connectionTypeDiv.appendChild( connectionTypeLabel );
        connectionTypeDiv.appendChild( connectionTypeSelect );
        
        var checkBoxesDiv = document.createElement( 'div' );
        checkBoxesDiv.classList = "";

        var connectionList = [ "Wifi", "Bluetooth", "P2P", "ZigBee" ]
        connectionList.forEach( ( child ) => {

            var eachCheckBoxDiv = document.createElement( 'div' )
            var eachCheckboxLabel = document.createElement('label');
            eachCheckboxLabel.innerHTML = child;
            var eachCheckboxInput = document.createElement('input');
            eachCheckboxInput.setAttribute( 'type', 'checkbox' )
            eachCheckboxInput.setAttribute( 'value', child );
            eachCheckboxInput.classList = "sensor-checkboxes";
            eachCheckboxInput.id = child;
            eachCheckBoxDiv.appendChild( eachCheckboxInput );
            eachCheckBoxDiv.appendChild( eachCheckboxLabel );

            checkBoxesDiv.appendChild( eachCheckBoxDiv );


        } )

        connectionTypeDiv.appendChild( checkBoxesDiv );

        var angleDiv = document.createElement( 'div' );
        angleDiv.classList = "col-sm-3 smart-sensor-div";
        var sensorAngleLabel = document.createElement('label');
        sensorAngleLabel.innerHTML = editor.languageData.Angle;
        var sensorAngleInput = document.createElement('input');
        sensorAngleInput.classList = "form-control smart-sensor-inputs";
        sensorAngleInput.type = "number";
        sensorAngleInput.min = 0;
        sensorAngleInput.max = 360;
        sensorAngleInput.placeholder = "0-360"
        sensorAngleInput.id = 'smart-sensor-angle';
        angleDiv.appendChild( sensorAngleLabel );
        angleDiv.appendChild( sensorAngleInput );

        sensorAngleInput.addEventListener( 'change', ( event ) => {
            
            if( event.target.value != '' ){
                if( event.target.value > 360 )
                    sensorAngleInput.value = 360
                else if( event.target.value < 1 )
                    sensorAngleInput.value = 1
            }
            

        } )

        secondRow.appendChild( sensorCategoryDiv );
        secondRow.appendChild( applicationTypeDiv );
        secondRow.appendChild( connectionTypeDiv );
        secondRow.appendChild( angleDiv );
        
        var thirdRow = document.createElement( 'div' );
        thirdRow.className = 'row';
        thirdRow.id = "new-cat-subcat-div"
        
        var otherCategoryDiv = document.createElement( 'div' );
        otherCategoryDiv.classList = "col-sm-3 smart-sensor-div";
        var otherCategoryLabel = document.createElement('label');
        otherCategoryLabel.innerHTML = editor.languageData.AddNewCategory;
        otherCategoryLabel.className = "required"
        var otherCategoryInput = document.createElement('input');
        otherCategoryInput.classList = "form-control required smart-sensor-inputs";
        otherCategoryInput.id = 'smart-sensor-new-category';
        otherCategoryDiv.appendChild( otherCategoryLabel );
        otherCategoryDiv.appendChild( otherCategoryInput );
        
        var newApplicationDiv = document.createElement( 'div' );
        newApplicationDiv.classList = "col-sm-3 smart-sensor-div";
        var newApplicationLabel = document.createElement('label');
        newApplicationLabel.innerHTML = editor.languageData.AddNewApplication;
        newApplicationLabel.className = "required"
        var newApplicationInput = document.createElement('input');
        newApplicationInput.classList = "form-control required smart-sensor-inputs";
        newApplicationInput.id = 'smart-sensor-new-application';
        newApplicationDiv.appendChild( newApplicationLabel );
        newApplicationDiv.appendChild( newApplicationInput );
        
        thirdRow.appendChild( otherCategoryDiv );
        thirdRow.appendChild( newApplicationDiv );
        thirdRow.style.display = "none";
        
        container.appendChild( headingDiv );
        container.appendChild( firstRow );
        container.appendChild( secondRow );
        container.appendChild( thirdRow );
        
        var cardDiv = document.createElement('div');
        cardDiv.setAttribute('class','card');
        cardDiv.setAttribute('id','smart-sensor-card');
        
        var cardthumpimg = document.createElement('img')
        cardthumpimg.setAttribute('class','card-img-top img-thumbnail');
        cardthumpimg.setAttribute('src','assets/img/lidar_black_256.png');
        cardthumpimg.setAttribute('id', "card-thumping-smart-sensor");
    
        function readURLSmartSensor(input) {
            if (input.files && input.files[0]) {
                var reader = new FileReader();
            
                reader.onload = function (e) {
                    $('#card-thumping-smart-sensor').attr('src', e.target.result);
                };
            
                reader.readAsDataURL(input.files[0]);
            }
        }

        sensorCategorySelect.addEventListener( "change", ( event ) => {
        
            if( event.target.value === 'other' ){
                thirdRow.style.display = "block";
            } else{

                if( thirdRow.style.display === "block" )
                    thirdRow.style.display = "none"
                for( var i = 0; i <applicationTypeDiv.childElementCount; i++ ){
                    applicationChild = applicationTypeDiv.children[i]
                    if( applicationChild.id === (event.target.value + "select") )
                        applicationChild.style.display = "block";
                    else if( applicationChild.type === "select-one" )
                        applicationChild.style.display = "none";
                }
            
            }
        
        } );

        var cardBody = document.createElement('div');
        cardBody.setAttribute('class','card-body  cardbodyAdd');
        
        var cardLabel =  document.createElement('label');
        cardLabel.setAttribute('for', "cardSensorLabel");
        cardLabel.setAttribute('class','btn btn-primary');
        cardLabel.innerHTML= editor.languageData.ChangeImage;
        cardLabel.setAttribute('id', "smart-sensor-image");
        
        var cardInputSensor =  document.createElement('input');
        cardInputSensor.setAttribute('id','cardSensorLabel');
        cardInputSensor.style.visibility = 'hidden';
        cardInputSensor.setAttribute('type','file');
        cardInputSensor.addEventListener("change", function() {
            readURLSmartSensor(this)
        });
    
        cardDiv.appendChild(cardthumpimg);
        cardDiv.appendChild(cardBody);
        cardBody.appendChild(cardLabel);
        cardBody.appendChild(cardInputSensor);
    
        container.appendChild( cardDiv );
    
        var submitButton = document.createElement('button');
        submitButton.className = "btn btn-success pull-right submit-button"
        submitButton.innerHTML = editor.languageData.submit;
        submitButton.id = 'add-each-smart-sensor';

        var editDiv = document.createElement( 'div' );
        editDiv.id = 'edit-remove-div'
        var removeBtn = document.createElement( 'button' );
        removeBtn.id = 'remove-sensor';
        removeBtn.className = "btn btn-danger";
        removeBtn.setAttribute("data-dismiss", "modal");
        removeBtn.innerHTML = editor.languageData.Remove;

        var editBtn = document.createElement( 'button' );
        editBtn.id = 'edit-sensor';
        editBtn.className = "btn btn-success";
        editBtn.setAttribute("data-dismiss", "modal");
        editBtn.innerHTML = editor.languageData.update;

        editDiv.appendChild( removeBtn );
        editDiv.appendChild( editBtn );
        editDiv.style.display = "none";
    
        container.appendChild( submitButton );
        container.appendChild( editDiv );
    
        submitButton.addEventListener( 'click', (event) => {
            thirdRow.style.display = "none";
            for( var i = 0; i <applicationTypeDiv.childElementCount; i++ ){
            
                if( applicationTypeDiv.children[i].type === "select-one" ){
                
                    if( applicationTypeDiv.children[i].id === "Building" )
                    applicationTypeDiv.children[i].style.display = "block";
                else
                    applicationTypeDiv.children[i].style.display = "none";
                
                }
            }
        
            scope.storeImageLocally();
        
           // storeSensorDetails();

            var syncGetSensorSpec = new Promise( ( resolve, reject ) => {
                var sensorSpec = scope.getSensorSpec();
                if( sensorSpec === null )
                    reject()
                else
                    resolve( sensorSpec );
            
            } )
        
            syncGetSensorSpec.then( result => {
                
                var smartSensorSpec = { "user_id" : localStorage.getItem( "U_ID" ), "spec" : result }
                
                $.ajax({
                    url: editor.api + 'sensorspec/user',
                    type: "POST",
                    dataType: "json",
                    data: {
                        "user_id": smartSensorSpec.user_id,
                        "spec": smartSensorSpec.spec
                    },
                    success: function(response) {

                        toastr.info( editor.languageData.SpecUpdatedSuccessfully )
                        AddSmartSensorModel.hide();   
        
                        var element = document.getElementById( "select-smart-sensor-model" );
                        if( element )
                            element.remove();

                        editor.signals.specUpdateCompleteSensor.dispatch();

                    },
                    error: function(jqxhr, status, msg) {  
                        toastr.error("Upload Failed Try Again !!");
                    }
                });  
    

            } ).catch( () => {
                toastr.error(editor.languageData.SomeDataisMissing);
                AddSmartSensorModel.hide();   
            } )    
        
        } )
    
        var AddSmartSensorModel = new UI.bootstrapModal("", "Add-Smart-Sensor", editor.languageData.AddSmartSensorSpec , container, "Open", editor.languageData.Cancel ,   "open-Smart-Sensor-form");
        AddSmartSensorModel.makeLargeModal();
        AddSmartSensorModel.hideFooterSuccessButton();
        return AddSmartSensorModel;

    },

    storeImageLocally : function(){
        
        var Data = new FormData();
        var fileJson = cardSensorLabel.files[0];
        Data.append('file', fileJson);
        if (!(cardSensorLabel.files[0] == undefined || cardSensorLabel.files[0] == null)) {
        
            $.ajax({
                url: editor.api + 'cameraSpec/users/update/img',
                type: "POST",
                processData: false,
                contentType: false,
                data: Data,
                success: function(result) {
                
                },
                error: function(err) {
                    toastr.error('Somthing went wrong try again !!!');
                    console.log(err);
                }
            });
        
        }
    
    },

    initializeValues : function(){

        document.getElementById( 'smart-sensor-brand' ).value = '';
        document.getElementById( 'smart-sensor-model' ).value = '';
        document.getElementById( 'smart-sensor-coverage' ).value = '';
        document.getElementById( 'smart-sensor-height' ).value = '';
        document.getElementById( 'smart-sensor-new-category' ).value = '';
        document.getElementById( 'smart-sensor-new-application' ).value = '';
        document.getElementById( 'smart-sensor-angle' ).value = '';
        document.getElementById( 'smart-sensor-category' ).value = 'Building';
        document.getElementById( 'new-cat-subcat-div' ).style.display = 'none';
        var applicationDiv = document.getElementById( 'application-type-div' );

        var connectionList = [ "Wifi", "Bluetooth", "P2P", "ZigBee" ];
        connectionList.forEach( ( child ) => {
           document.getElementById( child ).checked = false;
        } )

        for( var i = 0; i < applicationDiv.childElementCount; i++ ){
            
            if( applicationDiv.children[i].type === "select-one" ){
                applicationDiv.children[i].style.display = "none";    
            }

        }
        document.getElementById( 'Buildingselect' ).style.display = 'block';
        cardSensorLabel.files[0] = undefined;
        document.getElementById( 'card-thumping-smart-sensor' ).src = 'assets/img/lidar_black_256.png'

    },

    setValues : function( sensorSpec ){

        var scope = this;
        document.getElementById( 'smart-sensor-brand' ).value = sensorSpec.sensorBrand;
        document.getElementById( 'smart-sensor-model' ).value = sensorSpec.sensorModel;
        document.getElementById( 'smart-sensor-coverage' ).value = sensorSpec.sensorCoverage;
        document.getElementById( 'smart-sensor-height' ).value = sensorSpec.sensorHeight;
        if( sensorSpec.sensorAngle != undefined )
            document.getElementById( 'smart-sensor-angle' ).value = sensorSpec.sensorAngle

        if( sensorSpec.checkedTypes )
            var checkedTypes = sensorSpec.checkedTypes;
        if( checkedTypes && checkedTypes.length > 0 ){

            checkedTypes.forEach( function( child ){

                document.getElementById( child ).checked = true;

            } )

        }

        var sensorCat = document.getElementById( 'smart-sensor-category' );

        var applicationDiv = document.getElementById( 'application-type-div' );
        for( var i = 0; i <applicationDiv.childElementCount; i++ ){
            
            if( applicationDiv.children[i].type === "select-one" ){
                applicationDiv.children[i].style.display = "none";    
            }

        }

        if( !(scope.dbCategoryOptions.includes( sensorSpec.sensorCategory )) ){

            sensorCat.value = "other";
            document.getElementById( "Buildingselect" ).style.display = "block";

            document.getElementById( "new-cat-subcat-div" ).style.display = "block";
            document.getElementById( "smart-sensor-new-category" ).value = sensorSpec.sensorCategory;
            document.getElementById( "smart-sensor-new-application" ).value = sensorSpec.sensorSubCategory;


        } else{

            sensorCat.value = sensorSpec.sensorCategory;
            var applicationCategory = document.getElementById( sensorCat.value + "select" );
            applicationCategory.style.display = 'block';
            applicationCategory.value = sensorSpec.sensorSubCategory;
            document.getElementById( "new-cat-subcat-div" ).style.display = "none";
        
        }

        

        cardSensorLabel.files[0] = sensorSpec.sensorImageUrl;
        document.getElementById( 'card-thumping-smart-sensor' ).src = 'assets/img/' + sensorSpec.sensorImageUrl;

    },


    getSensorSpec : function(){
        
        var details = {};
        var scope = this;
        var sensorBrand = document.getElementById( 'smart-sensor-brand' ).value;
        var sensorModel = document.getElementById( 'smart-sensor-model' ).value;
        var sensorCoverage = document.getElementById( 'smart-sensor-coverage' ).value;
        var sensorHeight = document.getElementById( "smart-sensor-height" ).value;
        var checkCategory = document.getElementById( 'smart-sensor-category' ).value;
        var connectionList = [ "Wifi", "Bluetooth", "P2P", "ZigBee" ];
        var sensorAngle = document.getElementById( 'smart-sensor-angle' ).value;
        var checked = [];
        connectionList.forEach( ( child ) => {
            if( document.getElementById( child ).checked === true )
                checked.push( child );
        } )

        if ( cardSensorLabel.files[0] == undefined || cardSensorLabel.files[0] == null) {
        
            sensorImageUrl = "lidar_black_256.png";
        } else {
        
            sensorImageUrl = cardSensorLabel.files[0].name;
            scope.storeImageLocally();
        }
        if( checkCategory === "other" ){
        
            var sensorCategory = document.getElementById( 'smart-sensor-new-category' ).value;
            var sensorSubCategory = document.getElementById( 'smart-sensor-new-application' ).value;

            if( sensorCategory == '' || sensorCategory == null || sensorSubCategory == '' || sensorSubCategory == null )
                return null

        } else{
            var sensorCategory = document.getElementById( 'smart-sensor-category' ).value;
            var sensorSubCategory = document.getElementById( sensorCategory + "select" ).value;
        
        }
        var sensorConnection = document.getElementById( 'smart-sensor-connection' ).value
        details = { "sensorBrand" : sensorBrand, "sensorModel" : sensorModel, "sensorCoverage" : sensorCoverage, "sensorHeight" : sensorHeight, "sensorCategory" : sensorCategory, "sensorSubCategory" :sensorSubCategory, "sensorConnection" : sensorConnection, "sensorImageUrl" : sensorImageUrl, "checkedTypes" : checked, "sensorAngle" : sensorAngle };
        
        if( sensorBrand == '' || sensorBrand == null || sensorModel == '' || sensorModel == null  )
            return null 
        else
            return details;
    
    },
     
    updateDB : function( details, id ){

        $.ajax({
            url: editor.api + 'sensorspec/' + id,
            type: "PUT",
            dataType: "json",
            data: {
                "user_id": localStorage.getItem( 'U_ID' ),
                "spec": details
            },
            success: function(response) { 
                
                toastr.info( editor.languageData.SpecUpdatedSuccessfully )

                var element = document.getElementById( "select-smart-sensor-model" );
                if( element )
                    element.remove();

                editor.signals.specUpdateCompleteSensor.dispatch();

            },
            error: function(jqxhr, status, msg) {  
                toastr.error("Upload Failed Try Again !!");
            }
        });

    },

    removeFromDB : function( id ){

        if (confirm( editor.languageData.DoYouWanttoRemovethisSensor )){
            
            $.ajax({
                url: editor.api + 'sensorspec/' + id,
                type: "DELETE",
                success: function(response) {   
    
                    toastr.info( editor.languageData.SuccessfullyRemoved )
                    var element = document.getElementById( "select-smart-sensor-model" );
                    if( element )
                        element.remove();
    
                    editor.signals.specUpdateCompleteSensor.dispatch();
    
                },
                error: function(jqxhr, status, msg) {  
                    toastr.error("Upload Failed Try Again !!");
                }
            });
        }
        

    }

}