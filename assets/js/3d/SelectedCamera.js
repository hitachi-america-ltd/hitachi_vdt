/**
 * SelectedCamera( cameraDetails , editor ) - Constructor function for managing the snapshots.
 * @constructor
 * @param {Array<Object>} cameraDetails - An array of objects containing the details of all the cameras
 * @param {any} editor - The instance of the Editor which manages the overall objects and signals
 * @author Mavelil
 * @returns {Object}
 * @example <caption>Example usage of SelectedCamera</caption>
 * var selectedCamera = new SelectedCamera( cameraDetails , editor );
 */

var SelectedCamera = function(cameraDetails , editor ) {

    this.cameraDetails = editor.allCameras;
    this.previousmodel = null;
    this.previousSelectedBrand;
    this.previousSelectedmodel;
    this.previousId = null;
    this.scelectedbrand;
    return this;


}
SelectedCamera.prototype = {

    /**
     * createmodal( ) - Method to create a model for showing the list of all cameras in the db.
	 * @returns {Object<UI.bootstrapModal>}
     * @author Mavelil
     * @example <caption>Example usage of createmodal method.</caption>
     * selectedCamera.createmodal( );
     */

    createmodal: function() {      
        var that = this;
        var camBrandName = [];
        cameraBrandCount = 0;
        var mainDiv = document.createElement('div');
        mainDiv.className = "col1 col-sm-12 col-md-3";
        mainDiv.id = " brand-list";
        var mainui = document.createElement('ul');
        mainui.className = " list list-group";

        var secDiv = document.createElement('div');
        secDiv.className = "col1 col-sm-12 col-md-3";
        secDiv.id = "editorCameraModellist";
        var secui = document.createElement('ul');
        secui.className = " list list-group";

        this.cameraDetails.forEach(function(camerasdata) {
            if( camerasdata.children[0].sensorCategory === undefined || camerasdata.children[0].sensorCategory === null ){
                if (!camBrandName.includes(camerasdata.manufacturer)) {
                    camBrandName[cameraBrandCount] = camerasdata.manufacturer;
                    cameraBrandCount++;
                    var mainli = document.createElement('li');
                    mainli.className = " list-group-item";
                    mainli.id = camerasdata.manufacturer;
                    mainli.innerHTML = camerasdata.manufacturer;
                    mainli.onclick = function() {
                        that.showCameraModel(this.id , camerasdata.children[0].id);
                    }
                    mainui.appendChild(mainli);
                }
            }
            
        });
         

            // editor.allSensors.forEach(function( sensorData ) {

            //     if (!sensorBrandNames.includes(sensorData.manufacturer)) {

            //         sensorBrandNames[sensorBrandCount] = sensorData.manufacturer;
            //         sensorBrandCount++;
            //         var mainli = document.createElement('li');
            //         mainli.className = " list-group-item";
            //         mainli.id = sensorData.manufacturer;
            //         mainli.innerHTML = sensorData.manufacturer;
            //         mainli.onclick = function() {
            //             that.showCameraModel(this.id , sensorData.children[0].id);
            //         }
            //         mainui.appendChild(mainli);
            //     }
            // });


        var modelcamcheck = [];
        var brandcamcheck = [];

        let sensorExistance = [];
        let brandExistance = [];

        if(editor.selectedDevice == "camera"){

            this.cameraDetails.forEach(function(camerasdata) {
                if( camerasdata.children[0].sensorCategory === undefined || camerasdata.children[0].sensorCategory === null ){
                    if (!modelcamcheck.includes(camerasdata.model)) {
                        modelcamcheck.push(camerasdata.model);
                        brandExistance.push(camerasdata.manufacturer);
                        camBrandName[cameraBrandCount] = camerasdata.manufacturer;
                        cameraBrandCount++;
                        var secli = document.createElement('li');
                        secli.className = " list-group-item " + camerasdata.manufacturer;
                        secli.id = camerasdata.model;
                        secli.innerHTML = camerasdata.model;
                        secli.style.display = "none";
                        secli.onclick = function() {
        
                            that.setCameradetails(this.id , camerasdata.children[0].id);
        
                        }
        
                        secui.appendChild(secli);
                    } else {
        
                        if (!brandcamcheck.includes(camerasdata.manufacturer)) {
        
                            modelcamcheck.push(camerasdata.model);
                            brandcamcheck.push(camerasdata.manufacturer);
                            camBrandName[cameraBrandCount] = camerasdata.manufacturer;
                            cameraBrandCount++;
                            var secli = document.createElement('li');
                            secli.className = " list-group-item " + camerasdata.manufacturer;
                            secli.id = camerasdata.model;
                            secli.innerHTML = camerasdata.model;
                            secli.style.display = "none";
                            secli.onclick = function() {
                                that.setCameradetails(this.id ,  camerasdata.children[0].id);
                            }
                            secui.appendChild(secli);
                        }
                    }
                }
                
            });
        } else {


        }

        secDiv.appendChild(secui);
        mainDiv.appendChild(mainui);


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
        firstdiv.id = "camera-modelthreeD";

        var contentdiv = document.createElement('div');
        contentdiv.className = " content";
        firstdiv.appendChild(contentdiv);

        var paneldiv = document.createElement('div');
        paneldiv.className = " panel panel-default description-panel";
        contentdiv.appendChild(paneldiv);

        var panelheadingdiv = document.createElement('div');
        panelheadingdiv.className = " panel-heading";
        panelheadingdiv.innerHTML = editor.languageData.CameraDetails;
        paneldiv.appendChild(panelheadingdiv);


        var panelbodydiv = document.createElement('div');
        panelbodydiv.className = " panel-body row";
        paneldiv.appendChild(panelbodydiv);

        var tbl = document.createElement("table");
        tbl.className = " table table-striped description-table col-sm-12 col-md-3"
        var tblBody = document.createElement("tbody");
        tbl.appendChild(tblBody);
        tblBody.appendChild(trcreate("Camera Model", "HHD834-2", "CameraModel"));
        tblBody.appendChild(trcreate("Camera Max-Horizontal AOV", "20", "CameraFov"));
        tblBody.appendChild(trcreate("Resolution", "1920", "cameraResolution"));
        tblBody.appendChild(trcreate("Camera Type", "Dome", "CameraType"));
        panelbodydiv.appendChild(tbl);

        var buttondiv = document.createElement('div');
        buttondiv.className = " configurations col-sm-12 col-md-4 id ";
        var button = document.createElement('button');
        button.className = " btn btn-default1";
        button.id = "selectCameraBtn"
        button.innerHTML = editor.languageData.Selectthiscamera;
        button.setAttribute("data-dismiss", "modal")
        button.onclick = function() {

			selectCameraModel.hide();
			return false;

        }
        /* Edit button */
        var editButton = document.createElement('button');
        editButton.className = " btn btn-default1";
        editButton.id = "EditCameraBtn"
        editButton.innerHTML = editor.languageData.Editthiscamera;
        //editButton.setAttribute("data-dismiss", "modal")
        /*editButton.onclick = function() {		
  			//selectCameraModel.hide();

		}*/
        /* Edit button */
        buttondiv.appendChild(button);
        /* Edit button */
        buttondiv.appendChild(editButton);
        /* Edit button */
        panelbodydiv.appendChild(buttondiv);

        var imagemaindiv = document.createElement('div');
        imagemaindiv.className = " image camimage col-sm-12 col-md-3 ";
        var imagesecdiv = document.createElement('div');
        imagesecdiv.id = "image_modal";
        var img = document.createElement('img');
        img.setAttribute('src', editor.webroot+'assets/img/DICD.jpg');
        img.id = "imagethreed"
        img.setAttribute('height', '100px');
        img.setAttribute('width', '150px');
        imagesecdiv.appendChild(img);
        imagemaindiv.appendChild(imagesecdiv);
        panelbodydiv.appendChild(imagemaindiv);

        /* for edit option */

        var Container = document.createElement('div');
        Container.className = "container-fluid";
        Container.id = "updateEachSpec"

        var mainHeading = document.createElement('h3');
        mainHeading.innerHTML = editor.languageData.UpdateorRemovetheCamera ;
        mainHeading.style.textAlign = 'center';
        mainHeading.style.marginBottom = '3%';
        Container.appendChild(mainHeading);

        var firstRow = document.createElement('div');
        firstRow.className = 'row';
        var secondRow = document.createElement('div');
        secondRow.className = 'row';
        var thirdRow = document.createElement('div');
        thirdRow.className = 'row';
        var fourthRow = document.createElement('div');
        fourthRow.className = 'row';

        /*var submitButton = document.createElement('button');
        submitButton.className = "btn btn-success pull-right submitbutto"
        submitButton.innerHTML = "Submit"
        submitButton.id = 'addspeceachCameraSubmit';*/

        /* for card image of camera */
        var cardDiv = document.createElement('div');
        cardDiv.setAttribute('class','card');
        cardDiv.setAttribute('id','cardEditCamera');

        var cardthumpimg = document.createElement('img')
        cardthumpimg.setAttribute('class','card-img-top img-thumbnail');
        cardthumpimg.setAttribute('src','assets/img/Cam_VX_3PV_B_I.png');
        cardthumpimg.setAttribute('id', "cardthumpimgEdit");
        

        var cardBody = document.createElement('div');
        cardBody.setAttribute('class','card-body  cardbodyEdit');
        
        var cardLabel =  document.createElement('label');
        cardLabel.setAttribute('for', "filesEdit");
        cardLabel.setAttribute('class','btn btn-primary');
        cardLabel.innerHTML= editor.languageData.ChangeImage;
        cardLabel.setAttribute('id', "changeImageButttonEdit");

        var cardInput =  document.createElement('input');
        cardInput.setAttribute('id','filesEdit');
        cardInput.style.visibility = 'hidden';
        cardInput.setAttribute('type','file');
        cardInput.addEventListener("change", function() {
  
            readURL(this)
        });

        cardDiv.appendChild(cardthumpimg);
        cardDiv.appendChild(cardBody);
        cardBody.appendChild(cardLabel);
        cardBody.appendChild(cardInput);
        /* for card image of camera End */


        /*For edit camera spec */


        var updateButton = document.createElement('button');
        updateButton.className = "btn btn-success pull-right submitbutto"
        updateButton.innerHTML = editor.languageData.update;
        updateButton.id = 'UpdateaddspeceachCameraSubmit';
        updateButton.setAttribute("data-dismiss", "modal");


        var deleteButton = document.createElement('button');
        deleteButton.className = "btn btn-danger pull-right submitbutto"
        deleteButton.innerHTML = editor.languageData.Remove;
        deleteButton.id = 'RemoveaddspeceachCameraSubmit';
        deleteButton.setAttribute("data-dismiss", "modal");


        /*For edit camera spec */

        var innerElementone = createElemnt(editor.languageData.BrandName, editor.languageData.ModelName, editor.languageData.HorizontalAOV, editor.languageData.MinHorizontalAOV, "brandnameUpdate", "modelnameUpdate", "horizontalaovUpdate", "minhorizontalaovUpdate");
        var innerElementtwo = createElemnt(editor.languageData.ResolutionWidth, editor.languageData.ResolutionHeight, editor.languageData.LensType,  editor.languageData.CameraType , "resolutionwidthUpdate", "resolutionheightUpdate", "lenstypeUpdate", "cameraTypeUpdate");
        var innerElementthree = createElemnt( editor.languageData.DefaultFOV,  editor.languageData.OpticalZoom, editor.languageData.DigitalZoom,  undefined, "defaultfovUpdate", "opticalzoomUpdate", "digitalzoomUpdate", undefined);
        //var innerElementFour = createElemnt( "Max V-AOV", "Min V-AOV", undefined ,  undefined, "maxverticalaovUpdate", "minverticalaovUpdate", undefined, undefined);
        var innerElementFour = createElemnt( editor.languageData.MaxVAOV, editor.languageData.MinVAOV, undefined ,  undefined, "maxverticalaovUpdate", "minverticalaovUpdate", undefined, undefined);


        firstRow.appendChild(innerElementone);
        secondRow.appendChild(innerElementtwo);
        thirdRow.appendChild(innerElementthree);
        fourthRow.appendChild(innerElementFour);
        Container.appendChild(firstRow);
        Container.appendChild(secondRow);
        Container.appendChild(thirdRow);
        Container.appendChild(fourthRow);

        Container.appendChild(cardDiv);
        Container.appendChild(updateButton);
        Container.appendChild(deleteButton);



        function createElemnt(first, second, third, fourth, firstid, secondid, thirdid, fourthid) {
            var maindiv = document.createElement('div');
            var firstColoum = document.createElement('div');
            firstColoum.className = "col-sm-6";
            var firstFormgroup = document.createElement('div');
            firstFormgroup.className = "form-group";

            var firstColoumchildOne = document.createElement('div');
            firstColoumchildOne.className = "col-sm-6";
            var firstlabel = document.createElement('label');
            firstlabel.innerHTML = first;
			if(first == editor.languageData.DefaultFOV){
                var opt;
                firstlabel.className = "required";
                var firstinput = document.createElement('select');
                firstinput.id = firstid;
                firstinput.className = "form-control";
                opt = document.createElement('option');
                opt.value = "Left";
                opt.innerHTML = "Left";
                firstinput.appendChild(opt);

                opt = document.createElement('option');
                opt.value = "Right";
                opt.innerHTML = "Right";
                firstinput.appendChild(opt);

                opt = document.createElement('option');
                opt.value = "Top";
                opt.innerHTML = "Top";
                firstinput.appendChild(opt);

                opt = document.createElement('option');
                opt.value = "Bottom";
                opt.selected = "selected";
                opt.innerHTML = "Bottom";
                firstinput.appendChild(opt);

                opt = document.createElement('option');
                opt.value = "Front";
                opt.innerHTML = "Front";
                firstinput.appendChild(opt);

                opt = document.createElement('option');
                opt.value = "Back";
                opt.innerHTML = "Back";
                firstinput.appendChild(opt);

            }
			else if(first == editor.languageData.BrandName){
				var firstinput = document.createElement('input');
				firstinput.className = "form-control";
                firstinput.placeholder = "For eg: Hitachi"
                firstlabel.className = "required";
				firstinput.id = firstid;
            }
            else if( first == editor.languageData.ResolutionWidth ){

                var firstinput = document.createElement('input');
				firstinput.className = "form-control";
                firstinput.placeholder = "For eg: 1920";
                firstinput.type = "number";
                firstlabel.className = "required";
				firstinput.id = firstid;

            }
            else if( first == editor.languageData.MaxVAOV ){
                var firstinput = document.createElement('input');
				firstinput.className = "form-control";
                firstinput.type = "number";
				firstinput.id = firstid;
            }


            var firstColoumchildTwo = document.createElement('div');
            firstColoumchildTwo.className = "col-sm-6";
            var secondlabel = document.createElement('label');
            secondlabel.innerHTML = second;
			if(second == editor.languageData.ModelName){
				var secondinput = document.createElement('input');
                secondinput.className = "form-control";
                secondlabel .className = "required";
				secondinput.placeholder = "For eg: DI-CB320G"
				secondinput.id = secondid;
            }
            else if( second == editor.languageData.ResolutionHeight ){
                var secondinput = document.createElement('input');
                secondinput.className = "form-control";
                secondlabel.className = "required";
                secondinput.type = "number";
				secondinput.placeholder = "For eg: 1080"
				secondinput.id = secondid;
            }
            else if( second == editor.languageData.OpticalZoom ){
                secondlabel.className ="required";
                var secondinput = document.createElement('input');
                secondinput.className = "form-control";
                secondinput.placeholder = "For eg: 2x"
				secondinput.id = secondid;
            }
            else if( second == editor.languageData.MinVAOV ){
                var secondinput = document.createElement('input');
                secondinput.className = "form-control";
                secondinput.type = "number";
				secondinput.id = secondid;
            }
           
            var SecondColoum = document.createElement('div');
            SecondColoum.className = "col-sm-6";
            var secondFormgroup = document.createElement('div');
            secondFormgroup.className = "form-group";

            var secondColoumchildOne = document.createElement('div');
            secondColoumchildOne.className = "col-sm-6";
            
            if( third ==  editor.languageData.HorizontalAOV){
                var thirdlabel = document.createElement('label');
                thirdlabel.innerHTML = third;
                var thirdinput = document.createElement('input');
                thirdinput.className = "form-control";
                thirdinput.type = "number";
                thirdlabel.className = "required";
                thirdinput.id = thirdid;
            }
            else if( third == editor.languageData.DigitalZoom ){
                var thirdlabel = document.createElement('label');
                thirdlabel.innerHTML = third;
                var thirdinput = document.createElement('input');
                thirdinput.className = "form-control";
                thirdlabel.className = "required";
                thirdinput.id = thirdid;
            }
            else if( third == editor.languageData.LensType ){
                var thirdlabel = document.createElement('label');
                thirdlabel.innerHTML = third;
                var thirdinput = document.createElement('input');
                thirdinput.className = "form-control";
                thirdinput.id = thirdid;
            }
            

            var secondColoumchildTwo = document.createElement('div');
            secondColoumchildTwo.className = "col-sm-6";

            var fourthlabel = document.createElement('label');
            fourthlabel.innerHTML = fourth;
            if(fourth == editor.languageData.CameraType){

                var opt;
                fourthlabel.className = "required";
                var fourthinput  = document.createElement("select");
                fourthinput.id = fourthid;
                fourthinput.className = "form-control" ;
                opt = document.createElement('option');
                opt.value = "Box";
                opt.innerHTML = editor.languageData.Box;
                fourthinput.appendChild(opt);

                opt = document.createElement('option');
                opt.value = "Box Lite";
                opt.innerHTML = editor.languageData.BoxLite;
                fourthinput.appendChild(opt);


                opt = document.createElement('option');
                opt.value = "Dome";
                opt.innerHTML = editor.languageData.Dome;
                fourthinput.appendChild(opt);

                opt = document.createElement('option');
                opt.value = "Dome Lite";
                opt.innerHTML = editor.languageData.DomeLite;
                fourthinput.appendChild(opt);

                opt = document.createElement('option');
                opt.value = "Fixed Dome";
                opt.innerHTML = editor.languageData.FixedDome;
                fourthinput.appendChild(opt);
                opt = document.createElement('option');
                opt.value = "PTZ";
                opt.innerHTML = editor.languageData.PTZ;
                fourthinput.appendChild(opt);

                opt = document.createElement('option');
                opt.value = "PTZ Lite";
                opt.innerHTML = editor.languageData.PTZLite;
                fourthinput.appendChild(opt);
                
                opt = document.createElement('option');
                opt.value = "Bullet";
                opt.innerHTML = editor.languageData.Bullet;
                fourthinput.appendChild(opt);

                opt = document.createElement('option');
                opt.value = "Bullet Lite";
                opt.innerHTML = editor.languageData.BulletLite;
                fourthinput.appendChild(opt);

                opt = document.createElement('option');
                opt.value = "Covert";
                opt.innerHTML = editor.languageData.Covert;
                fourthinput.appendChild(opt);

                opt = document.createElement('option');
                opt.value = "Covert Lite";
                opt.innerHTML = editor.languageData.CovertLite;
                fourthinput.appendChild(opt);
                

                opt = document.createElement('option');
                opt.value = "IP";
                opt.innerHTML = editor.languageData.IP;
                fourthinput.appendChild(opt);
                opt = document.createElement('option');
                opt.value = "Day/Night";
                opt.innerHTML = editor.languageData.DayNight;
                fourthinput.appendChild(opt);
                opt = document.createElement('option');
                opt.value = "Thermal";
                opt.innerHTML = editor.languageData.Thermal;
                fourthinput.appendChild(opt);
                opt = document.createElement('option');
                opt.value = "Wireless";
                opt.innerHTML = editor.languageData.Wireless;
                fourthinput.appendChild(opt);

                opt = document.createElement('option');
                opt.value = "Fisheye";
                opt.innerHTML = editor.languageData.Fisheye;
                fourthinput.appendChild(opt);

                opt = document.createElement('option');
                opt.value = "Panorama";
                opt.innerHTML = editor.languageData.Panorama;
                fourthinput.appendChild(opt);

                // opt = document.createElement('option');
                // opt.value = "LiDAR";
                // opt.innerHTML = editor.languageData.LiDAR;
                // fourthinput.appendChild(opt);
                // opt = document.createElement('option');
                // opt.value = "LiDAR Lite";
                // opt.innerHTML = editor.languageData.LiDARLite;
                // fourthinput.appendChild(opt);
                
            }
			else if(fourth == editor.languageData.MinHorizontalAOV ){
				
				var fourthinput = document.createElement('input');
                fourthinput.className = "form-control";
                fourthinput.type = "number";
                fourthinput.id = fourthid;
				
			}

            firstColoum.appendChild(firstFormgroup);
            firstFormgroup.appendChild(firstColoumchildOne);
            if( firstinput != undefined && firstlabel != undefined ){
                firstColoumchildOne.appendChild(firstlabel);
                firstColoumchildOne.appendChild(firstinput);
            }
            firstFormgroup.appendChild(firstColoumchildTwo);
            if( secondinput != undefined && secondlabel != undefined ){
                firstColoumchildTwo.appendChild(secondlabel);
                firstColoumchildTwo.appendChild(secondinput);
            }

            SecondColoum.appendChild(secondFormgroup);
            secondFormgroup.appendChild(secondColoumchildOne);
            if( thirdinput != undefined && thirdlabel != undefined ){
                secondColoumchildOne.appendChild(thirdlabel);
                secondColoumchildOne.appendChild(thirdinput);
            }
            secondFormgroup.appendChild(secondColoumchildTwo);
            if( fourthinput != undefined && fourthlabel != undefined ){
                secondColoumchildTwo.appendChild(fourthlabel);
                secondColoumchildTwo.appendChild(fourthinput);
            }

            maindiv.appendChild(firstColoum);
            maindiv.appendChild(SecondColoum);



            return maindiv;



        }
        function readURL(input) {
            if (input.files && input.files[0]) {
                var reader = new FileReader();
        
                reader.onload = function (e) {
                    $('#cardthumpimgEdit').attr('src', e.target.result);
                };
        
                reader.readAsDataURL(input.files[0]);
            }
        }

        /* for edir option end */

        var div = document.createElement('div');
        div.appendChild(mainDiv);
        div.appendChild(secDiv);
        div.appendChild(firstdiv);
        div.appendChild(Container);

        var body = div;
        var selectCameraModel = new UI.bootstrapModal("", "select-camera-model", editor.languageData.SelectCamera , body, "Open", editor.languageData.Cancel, "open-camera-form");
        selectCameraModel.makeLargeModal();
        selectCameraModel.hideFooterSuccessButton();
        selectCameraModel.setModalBodyStyle('height:400px');
        selectCameraModel.setModalBodyStyle('overflow: scroll');

        return selectCameraModel;
    },

    /**
     * hideModelAndDetails( ) - Method to hide the camera details pane.
	 * @returns {Void}
     * @author Mavelil
     * @example <caption>Example usage of hideModelAndDetails method.</caption>
     * selectedCamera.hideModelAndDetails( );
     */

    hideModelAndDetails: function() {

        var cameraModellistHide = document.getElementById('editorCameraModellist');
        //cameraModellistHide.style.display = 'none';
        var cameraDetailsHide = document.getElementById('camera-modelthreeD');
        cameraDetailsHide.style.display = 'none';

    },

    /**
     * showCameraModel( cameraBrand ,idcam ) - Method to show the camera details pane.
     * @param {String} cameraBrand - Brand name of the camera
     * @param {String} idcam
	 * @returns {Void}
     * @author Mavelil
     * @example <caption>Example usage of showCameraModel method.</caption>
     * selectedCamera.showCameraModel( cameraBrand ,idcam );
     */

    showCameraModel: function(cameraBrand ,idcam) {

        var scope = this;
        this.scelectedbrand = cameraBrand;
        var scope = this;
        var hideModel = function(value, callback) {
           document.getElementById(cameraBrand).style.background = '#d5cce4';
            document.getElementById('camera-modelthreeD').style.display = 'none';
            var x = document.getElementsByClassName(cameraBrand);
            if (this.previousmodel === undefined || this.previousmodel === null) {
                this.previousSelectedBrand = cameraBrand;
                callback(x);

            } else {

                if (document.getElementById(this.previousSelectedBrand) == null) {

                    this.previousSelectedBrand = scope.previousSelectedmodel;
                    if(cameraBrand != this.previousSelectedBrand ){
                        document.getElementById(this.previousSelectedBrand).style.background = 'white';
                    }
                    //document.getElementById(this.previousSelectedBrand).style.background = 'white';
                    this.previousSelectedBrand = cameraBrand;
                    for (i = 0; i < this.previousmodel.length; i++) {

                        this.previousmodel[i].style.display = "none";

                    }
                    callback(x);

                } else {

                    if(cameraBrand != this.previousSelectedBrand ){
                        document.getElementById(this.previousSelectedBrand).style.background = 'white';
                    }
                    
                    this.previousSelectedBrand = cameraBrand;
                    for (i = 0; i < this.previousmodel.length; i++) {

                        this.previousmodel[i].style.display = "none";

                    }
                    callback(x);
                }


            }

        }
        var callbackFunction = function(value) {

            for (i = 0; i < value.length; i++) {

                value[i].style.display = "block";
                if (i == value.length - 1) {
                    this.previousmodel = [];
                    this.previousmodel = value;

                }

            }


        }
        hideModel(cameraBrand, callbackFunction);
    },

    /**
     * setCameradetails( model ,idcamera ) - Method to show details in the camera details pane.
     * @param {String} model - Brand name of the camera
     * @param {Number} idcam
	 * @returns {Void}
     * @author Mavelil
     * @example <caption>Example usage of setCameradetails method.</caption>
     * selectedCamera.setCameradetails( model ,idcam );
     */

    setCameradetails: function(model ,idcamera) {
        document.getElementById(model).style.background = '#d5cce4';
        if(model !=this.previousSelectedmodel ){

            document.getElementById(this.previousSelectedmodel).style.background = 'white';

        }
       
        this.previousSelectedmodel = model;
        this.previousId = idcamera;
        this.cameraDetails.forEach(function(cameradata) {
            if (cameradata.children[0].id == idcamera) {
                document.getElementById('CameraModel').innerHTML = cameradata.model;
                document.getElementById('CameraFov').innerHTML = cameradata.children[0].horizontal_aov;
                document.getElementById('cameraResolution').innerHTML = cameradata.children[0].resolutionWidth+" X "+ cameradata.children[0].resolutionHeight;
                document.getElementById('CameraType').innerHTML = cameradata.form_factor;
                document.getElementById('imagethreed').src = cameradata.image_url;
                document.getElementById('camera-modelthreeD').style.display = 'block';
            }

        });


    },

    /**
     * getcameraDetails( ) - Method to read the details of the camera.
     * @returns {Object} - Returns a JSON object with the keys 'selectedcam' containing the selected camera details and 'fullcamData' containing all the camera details
     * @author Mavelil
     * @example <caption>Example usage of getcameraDetails method.</caption>
     * selectedCamera.getcameraDetails( );
     */

    getcameraDetails: function() {

        var model = this.previousSelectedmodel;
        var brand = this.scelectedbrand;
        var camId = this.previousId;
        var a, selectCamData;
        this.cameraDetails.forEach(function(cameradata) {
            if (cameradata.children[0].id == camId) {

                selectCamData = cameradata;
                a = [cameradata.children[0].horizontal_aov, cameradata.children[0].min_horizontal_aov, model, brand, cameradata.image_url, cameradata.form_factor,cameradata.children[0].def_fov,cameradata.children[0].zoom_optical,cameradata.children[0].zoom_digital, cameradata.children[0].resolutionWidth, cameradata.children[0].resolutionHeight,cameradata.children[0].max_vertical_aov,cameradata.children[0].min_vertical_aov,cameradata.isCameraLite];
                //a = [cameradata.children[0].min_aov, cameradata.children[0].far, cameradata.children[0].min_focal, model, brand, cameradata.image_url, cameradata.form_factor,cameradata.children[0].def_fov,cameradata.children[0].zoom_optical,cameradata.children[0].zoom_digital];

            }
        });

        return {
            "selectedcam": a,
            "fullcamData": selectCamData
        };
    },

    /**
     * getModelName( ) - Method to read the model name of all the cameras.
     * @returns {Object} - Returns an object containing model names of all the cameras
     * @author Mavelil
     * @example <caption>Example usage of getModelName method.</caption>
     * selectedCamera.getModelName( );
     */

    getModelName: function() {
        var cameramodelName = {};
        this.cameraDetails.forEach(function(data) {

            cameramodelName[data.model] = data.model;
        });
        return cameramodelName;


    },

    /**
     * getBrandName( ) - Method to read the brand name of all the cameras.
     * @returns {Object} - Returns an object containing brand names of all the cameras
     * @author Mavelil
     * @example <caption>Example usage of getBrandName method.</caption>
     * selectedCamera.getBrandName( );
     */

    getBrandName: function() {
        var camBrandName = {};
        this.cameraDetails.forEach(function(camerasdata) {

            if (!camerasdata.manufacturer in camBrandName) {
                camBrandName[camerasdata.manufacturer] = camerasdata.manufacturer;

            }
        });

        return camBrandName;

    },
    editcameraspec: function(camdata) {

    }
}