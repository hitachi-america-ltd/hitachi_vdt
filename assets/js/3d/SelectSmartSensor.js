SelectSmartSensor = function( editor ){

    this.smartSensorId = Date.now();
    this.allSmartSensors;

}

SelectSmartSensor.prototype = {

    createSelectSensorModal : function(){

        this.previousSelectedCategory;
        this.previousSelectedSubCategory;
        this.previousSelectedBrand;
        this.previousModel;
        this.previousSelectedmodel = null;
        this.previousId = null;
        this.saveorEdit = "";
        var scope = this;

        var applicationList = [];
        var applicationBrandMap = [];

        var categoryList = [];
        var categorySubCategoryMap = [];
        var categorizedBrand = [];
        var catSubCategoryList = [];

        function showBrandList( brandListKey ){

            document.getElementById('smart-sensor-modelthreeD').style.display = 'none';

            if( !(scope.previousSelectedSubCategory === "" || scope.previousSelectedSubCategory === undefined) ){
                var listToHide = applicationBrandMap[ scope.previousSelectedSubCategory ];
                for( var i = 0; i < listToHide.length; i++ ){
                    document.getElementById( scope.previousSelectedSubCategory + '-' + listToHide[i] ).style.display = "none";
                }
            }

            if( !(scope.previousSelectedmodel === "" || scope.previousSelectedmodel === undefined) ){

                if( document.getElementById( scope.previousSelectedSubCategory ) ){
                    document.getElementById( scope.previousSelectedSubCategory ).style.background = 'white';
                } 

            }

            if( !(scope.previousSelectedBrand === "" || scope.previousSelectedBrand === undefined) ){
                var listToHide = document.getElementsByClassName( scope.previousSelectedBrand );
                for( var i = 0; i < listToHide.length; i++ ){
                    listToHide[i].style.display = "none";
                }
            }


            if( document.getElementById( scope.previousSelectedSubCategory ) ){
                document.getElementById( scope.previousSelectedSubCategory ).style.background = 'white';
            }    
            document.getElementById( brandListKey ).style.background = '#d5cce4';
            var modelList = applicationBrandMap[ brandListKey ];
            if( document.getElementById( brandListKey + '-' +modelList[0] ).style.display === "none" )
            for( var i = 0; i < modelList.length; i++ ){
                document.getElementById( brandListKey + '-' +modelList[i] ).style.display = "block";
            }
            scope.previousSelectedSubCategory = brandListKey;


        }

        function showSensorModel( brandName ){

            document.getElementById('smart-sensor-modelthreeD').style.display = 'none';
               
            if( !(scope.previousSelectedBrand === "" || scope.previousSelectedBrand === undefined) ){
                var listToHide = document.getElementsByClassName( scope.previousSelectedBrand );
                for( var i = 0; i < listToHide.length; i++ ){
                    listToHide[i].style.display = "none";
                }
            }

            document.getElementById( scope.previousSelectedBrand ).style.background = 'white';
            document.getElementById( brandName ).style.background = '#d5cce4';
            var modelList = document.getElementsByClassName( brandName );
            if( modelList[0].style.display == "none" ){
                for( var i = 0; i < modelList.length; i++ ){
                    modelList[i].style.display = "block";
                }
                scope.previousSelectedBrand = brandName;
            }
            
        }

        function setSensordetails( modelName, sensorid ){

            document.getElementById(modelName).style.background = '#d5cce4';
            if( modelName != scope.previousSelectedmodel && scope.previousSelectedmodel != null ){
            
                document.getElementById(scope.previousSelectedmodel).style.background = 'white';

            }
        
            scope.previousSelectedmodel = modelName;
            scope.previousId = sensorid;

            scope.allSmartSensors.forEach(function(sensordata) {
                if (sensordata._id == sensorid) {
                    var imageData = "assets/img/"
                    document.getElementById('sensor-model').innerHTML = sensordata.spec.sensorModel;
                    document.getElementById('category').innerHTML = sensordata.spec.sensorCategory;
                    document.getElementById('application').innerHTML = sensordata.spec.sensorSubCategory;
                    document.getElementById('image-sensor-thread').src = imageData + sensordata.spec.sensorImageUrl;
                    document.getElementById('smart-sensor-modelthreeD').style.display = 'block';

                    if( scope.saveorEdit === "select-smart-sensor-btn" ){

                        document.getElementById('select-smart-sensor-btn').style.display = 'block';
                        document.getElementById('edit-smart-sensor-btn').style.display = 'none';

                    } else if( scope.saveorEdit === "edit-smart-sensor-btn" ){
                        
                        document.getElementById('edit-smart-sensor-btn').style.display = 'block';
                        document.getElementById('select-smart-sensor-btn').style.display = 'none';

                    }
                }

            });


        }

        var subCategoryDiv = document.createElement( 'div' );
        subCategoryDiv.className = "col1 col-sm-12 col-md-2";
        subCategoryDiv.id = "smart-sensor-subcategory-list";
        var subCategoryUl = document.createElement('ul');
        subCategoryUl.className = " list list-group";

        this.allSmartSensors.forEach( function( sensorData ){

            spec = sensorData.spec;
            if( spec != "" && spec != undefined ){

                if( !(applicationList.includes( spec.sensorSubCategory )) ){

                    applicationList.push( spec.sensorSubCategory );
                    applicationBrandMap[ spec.sensorSubCategory ] = [];
                    applicationBrandMap[ spec.sensorSubCategory ].push( spec.sensorBrand );
                
                } else{

                    applicationBrandMap[ spec.sensorSubCategory ].push( spec.sensorBrand );

                }

            }

        } );

        applicationList.forEach( function( applicationTypes ){

            var subCategoryli = document.createElement('li');
            subCategoryli.className = " list-group-item";
            subCategoryli.innerHTML = applicationTypes;
            subCategoryli.id = applicationTypes;
            subCategoryli.onclick = function(){
                showBrandList( applicationTypes )
            }
            subCategoryUl.appendChild( subCategoryli );

        } )

        var sensorBrand = [];
        sensorBrandCount = 0;
        var mainDiv = document.createElement('div');
        mainDiv.className = "col1 col-sm-12 col-md-2";
        mainDiv.id = "smart-sensor-brand-list";
        var mainui = document.createElement('ul');
        mainui.className = " list list-group";

        var secDiv = document.createElement('div');
        secDiv.className = "col1 col-sm-12 col-md-2";
        secDiv.id = "sensor-model-list";
        var secui = document.createElement('ul');
        secui.className = " list list-group";

        this.allSmartSensors.forEach(function(sensordata) {
            if( sensordata.spec != "" && sensordata.spec != undefined ){
                
                var brandToCheck = sensordata.spec.sensorSubCategory + '-' + sensordata.spec.sensorBrand
                if (!sensorBrand.includes( brandToCheck )) {
                    sensorBrand[sensorBrandCount] = brandToCheck;
                    sensorBrandCount++;
                    var mainli = document.createElement('li');
                    mainli.className = " list-group-item";
                    mainli.id = brandToCheck;
                    mainli.innerHTML = sensordata.spec.sensorBrand;
                    mainli.style.display = "none";
                    mainli.onclick = function() {
                        
                        showSensorModel(this.id);
                    }
                    mainui.appendChild(mainli);
                }
            
            }
                
        });
 
        var modelsensorcheck = [];
        var brandsensorcheck = [];

        let sensorExistance = [];
        let brandExistance = [];

        this.allSmartSensors.forEach(function(sensordata) {
            var brandToCheck = sensordata.spec.sensorSubCategory + '-' +sensordata.spec.sensorBrand;
            if( sensordata.spec != "" && sensordata.spec != undefined ){
                if (!modelsensorcheck.includes(sensordata.spec.sensorModel)) {
                    modelsensorcheck.push(sensordata.spec.sensorModel);
                    brandExistance.push(sensordata.spec.sensorBrand);
                    sensorBrand[sensorBrandCount] = sensordata.spec.sensorBrand;
                    sensorBrandCount++;
                    var secli = document.createElement('li');
                    secli.className = " list-group-item " + brandToCheck;
                    secli.id = brandToCheck + '-' + sensordata.spec.sensorModel;
                    secli.innerHTML = sensordata.spec.sensorModel;
                    secli.style.display = "none";
                    secli.onclick = function() {

                        setSensordetails(this.id, sensordata._id );
                        
                    }
    
                    secui.appendChild(secli);
                } else {
    
                    if (!brandsensorcheck.includes(sensordata.manufacturer)) {
    
                        modelsensorcheck.push(sensordata.spec.sensorModel);
                        brandsensorcheck.push(sensordata.spec.sensorBrand);
                        sensorBrand[sensorBrandCount] = sensordata.spec.sensorBrand;
                        sensorBrandCount++;
                        var secli = document.createElement('li');
                        secli.className = " list-group-item " + brandToCheck;
                        secli.id = brandToCheck + '-' + sensordata.spec.sensorModel;
                        secli.innerHTML = sensordata.spec.sensorModel;
                        secli.style.display = "none";
                        secli.onclick = function() {
                            setSensordetails( this.id, sensordata._id );
                            
                        }
                        secui.appendChild(secli);
                    }
                }
            }
            
        });

        secDiv.appendChild(secui);
        mainDiv.appendChild(mainui);
        subCategoryDiv.appendChild( subCategoryUl )

        

        function trcreate(html, value, idName) {

            var tr = document.createElement('tr');
            for (var i = 0; i < 1; i++) {
                var td1 = document.createElement('td');
                var td2 = document.createElement('td');
                var span = document.createElement('span')
                span.id = idName;
                td1.innerHTML = html;
                span.innerHTML = value;
                tr.appendChild(td1);
                td2.appendChild(span);
                tr.appendChild(td2);
                return (tr);

            }

        }
        var firstdiv = document.createElement('div');
        firstdiv.className = " col3 col-sm-12 col-md-6";
        firstdiv.id = "smart-sensor-modelthreeD";
        firstdiv.style.display = "none"

        var contentdiv = document.createElement('div');
        contentdiv.className = " content";
        firstdiv.appendChild(contentdiv);

        var paneldiv = document.createElement('div');
        paneldiv.className = " panel panel-default description-panel";
        contentdiv.appendChild(paneldiv);

        var panelheadingdiv = document.createElement('div');
        panelheadingdiv.className = " panel-heading";
        panelheadingdiv.innerHTML = editor.languageData.SensorDetails;
        paneldiv.appendChild(panelheadingdiv);


        var panelbodydiv = document.createElement('div');
        panelbodydiv.className = " panel-body row";
        paneldiv.appendChild(panelbodydiv);

        var tbl = document.createElement("table");
        tbl.className = " table table-striped description-table col-sm-12 col-md-3"
        var tblBody = document.createElement("tbody");
        tbl.appendChild(tblBody);
        tblBody.appendChild(trcreate("Sensor Model", "HHD834-2", "sensor-model"));
        tblBody.appendChild(trcreate("Category Type", "Building", "category"));
        tblBody.appendChild(trcreate("Application Type", "Hitachi LFOM5", "application"));
        panelbodydiv.appendChild(tbl);

        var buttondiv = document.createElement('div');
        buttondiv.className = " configurations col-sm-12 col-md-4 id ";
        var button = document.createElement('button');
        button.className = " btn btn-default1";
        button.id = "select-smart-sensor-btn"
        button.innerHTML = editor.languageData.SelectThisSensor;
        button.setAttribute("data-dismiss", "modal");
        buttondiv.appendChild(button);


        var editButton = document.createElement('button');
        editButton.className = " btn btn-default1";
        editButton.id = "edit-smart-sensor-btn"
        editButton.innerHTML = editor.languageData.Editthissensor;
        editButton.setAttribute("data-dismiss", "modal");
        buttondiv.appendChild( editButton );
        editButton.style.display = "none";


        var imagemaindiv = document.createElement('div');
        imagemaindiv.className = " image camimage col-sm-12 col-md-3 ";
        var imagesecdiv = document.createElement('div');
        imagesecdiv.id = "image_sensor-modal";
        var img = document.createElement('img');
        img.setAttribute('src', editor.webroot+'assets/img/DICD.jpg');
        img.id = "image-sensor-thread"
        img.setAttribute('height', '100px');
        img.setAttribute('width', '150px');
        imagesecdiv.appendChild(img);
        imagemaindiv.appendChild(imagesecdiv);

        panelbodydiv.appendChild(buttondiv);
        panelbodydiv.appendChild(imagemaindiv)

        

        var div = document.createElement('div');
        div.appendChild( subCategoryDiv );
        div.appendChild(mainDiv);
        div.appendChild(secDiv);
        div.appendChild(firstdiv);

        var body = div;
        var selectSensorModel = new UI.bootstrapModal("", "select-smart-sensor-model", editor.languageData.SelectSensor , body, "Open", editor.languageData.Cancel, "open-camera-form");
        selectSensorModel.makeLargeModal();
        selectSensorModel.hideFooterSuccessButton();
        selectSensorModel.setModalBodyStyle('height:400px');
        selectSensorModel.setModalBodyStyle('overflow: scroll');

        selectSensorModel.saveorEdit = function( btnId ){

            scope.saveorEdit = btnId;

        }

        return selectSensorModel;

    },

    createEditSensorModel : function(){

    },

    hideModalElements : function(){

        document.getElementById( "smart-sensor-modelthreeD" ).style.display = "none";
 
    },

    addSensortoScene : function( point, spec, badgeText ){

        var defaultSensorCategory = ["Building", "Factory", "Networking"];
        var colour = editor.randomColor();
        var iconUrl;
        if( defaultSensorCategory.includes( spec.sensorCategory ) )
            iconUrl = "assets/img/Icons/" + spec.sensorSubCategory + ".png";
        else
            iconUrl = "assets/img/Icons/Generic.png";
        var text = parseInt( badgeText )
        var iconBadge = editor.iconWithBadgeSpriteAlignTop( iconUrl, badgeText, colour )
        iconBadge.scale.set( 1.5, 1.5, 1.5 )
        
        iconBadge.name = spec.sensorBrand + " " + spec.sensorModel;
        iconBadge.position.copy( point );
        iconBadge.sensorType = "smart-sensor";
        var imageUrl = 'assets/img/' + spec.sensorImageUrl;
        var iconSprite = iconBadge;
        iconSprite.userData.sensorData = {

            badgeText : text, category : spec.sensorCategory, subCategory : spec.sensorSubCategory, badgeColor : colour, iconUrl : iconUrl, brandName : spec.sensorBrand, modelName : spec.sensorModel, imageUrl : imageUrl, radius : spec.sensorCoverage, height : spec.sensorHeight, connectionLists : spec.checkedTypes

        }
        if( (spec.frustum === undefined) || (spec.frustum === "Cylinder Frustum") ){

            if( spec.sensorCoverage != "" || spec.sensorHeight != "" ){
                var radius = 50;
                var height = 25;
                if( spec.sensorCoverage != "" && spec.sensorCategory != undefined ){
                    radius = spec.sensorCoverage;
                }
                    
                if( spec.sensorHeight != "" && spec.sensorHeight != undefined ){
                    height = spec.sensorHeight;
                } 
    
                radiusInTargetUnit = radius/3.28084
                heightInTargetUnit = height/3.28084
                var endAngle = 2*Math.PI;
                if( spec.sensorAngle != undefined && spec.sensorAngle != '' ){
                    endAngle = spec.sensorAngle * (Math.PI/180);
                }
                var geometry = new THREE.CylinderGeometry( radiusInTargetUnit, radiusInTargetUnit, heightInTargetUnit, 200, 200, false, 0, endAngle );
                var material = new THREE.MeshBasicMaterial( {color: colour, transparent: true, opacity: 0.5, side: THREE.DoubleSide} );
                material.depthWrite = false;
                var cylinder = new THREE.Mesh( geometry, material );
                cylinder.position.copy( point )
                cylinder.position.setY( point.y - heightInTargetUnit/2 )
                editor.execute( new AddObjectCommand( cylinder ) )
    
            }
        } else if( spec.frustum === "Spherical Frustum" ){
            if( spec.sensorCoverage != "" || spec.sensorHeight != "" ){
                var radius = 50;
                if( spec.sensorCoverage != "" && spec.sensorCategory != undefined ){
                    radius = spec.sensorCoverage;
                }
                radiusInTargetUnit = radius/3.28084;
                var startAngle = 0;
                var endAngle = Math.PI;

                if( spec.sphereType != undefined ){

                    if( spec.sphereType === "half-sphere-top" ){

                        startAngle = 0;
                        endAngle = Math.PI/2;

                    } else if( spec.sphereType === "half-sphere-bottom" ){

                        startAngle = Math.PI/2;
                        endAngle = Math.PI;
                        
                    }
                   

                }

                var geometry = new THREE.SphereGeometry( radiusInTargetUnit, 500, 500, 0, 2 * Math.PI, startAngle, endAngle );
                var material = new THREE.MeshBasicMaterial( {color: colour, transparent: true, opacity: 0.5, side: THREE.DoubleSide} );
                material.depthWrite = false;
                var sphere = new THREE.Mesh( geometry, material );
                sphere.position.copy( point )	
                editor.execute( new AddObjectCommand( sphere ) )
            }
            

        }
        

        var smartSensorGroup = new THREE.Group();
        smartSensorGroup.name = spec.sensorBrand + " " + spec.sensorModel;
        smartSensorGroup.category = "sensorCategory";
        smartSensorGroup.position.copy( point );
        var sensorFrustum = "Cylinder Frustum" ;
        if( spec.frustum != undefined && spec.frustum != '' ){
            sensorFrustum = spec.frustum;
        }
        smartSensorGroup.userData.sensorData = {

            badgeText : text, category : spec.sensorCategory, subCategory : spec.sensorSubCategory, badgeColor : colour, iconUrl : iconUrl, brandName : spec.sensorBrand, modelName : spec.sensorModel, imageUrl : imageUrl, radius : spec.sensorCoverage, height : spec.sensorHeight, connectionLists : spec.checkedTypes, frustum : sensorFrustum

        }
        if( spec.sensorAngle )
            smartSensorGroup.userData.sensorData.sensorAngle = spec.sensorAngle

        if( spec.sphereType )
            smartSensorGroup.userData.sensorData.sphereType = spec.sphereType

        editor.execute( new AddObjectCommand( iconBadge ) )
        editor.execute( new AddObjectCommand( smartSensorGroup ) )

        THREE.SceneUtils.attach( iconBadge, editor.scene, smartSensorGroup )

        if( cylinder ){
            THREE.SceneUtils.attach( cylinder, editor.scene, smartSensorGroup )
        } else if( sphere ){
            THREE.SceneUtils.attach( sphere, editor.scene, smartSensorGroup )
        }
        editor.signals.sceneGraphChanged.dispatch();

    },

    getSensorDetails : function(){

        var scope = this;
        return new Promise( ( resolve, reject ) => {
            
            this.allSmartSensors.forEach(function(sensordata){

                if( sensordata._id === scope.previousId ){
                         resolve( sensordata.spec );
                }
    
            })
        
        } )
        

    },

    getSensortoUpdate : function(){
        
        return this.previousId;

    },

    getAllSmartSensorsinDB : function(){

        return new Promise( (resolve,reject) => {
            var scope = this;
            $.ajax({
                url: editor.api + 'sensorspec/',
                type: "GET",
                dataType: "json",
                success: function(response) {
                    
                    scope.allSmartSensors = response;
                    resolve( scope.allSmartSensors )
                    
                },
                error: function(jqxhr, status, msg) {  
                    toastr.error("Upload Failed Try Again !!");
                }
            });  
        } )
        
    }
    

}