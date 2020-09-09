
/**
 * AddNewSpecCamera( editor ) : Constructor function for creating a new camera
 * @constructor
 * @param {any} editor - The instance of the Editor which manages the overall objects and signals
 * @returns {Object}
 * @author Mavelil
 * @example <caption>Example usage of AddNewSpecCamera</caption>
 * var addNewSpecCamera = new AddNewSpecCamera( editor );
 */

var AddNewSpecCamera = function( editor ) {
    this.name = "AddNewSpecCamera";
    return this;
}
AddNewSpecCamera.prototype = {

    /**
     * createModal( ) - Method to create a UI modal for entering the new camera spec
     * @returns {Object<UI.bootstrapModal>} - Returns a UI modal
     * @author Mavelil
     * @example <caption>Example usage of createModal method.</caption>
     * addNewSpecCamera.createModal( );
     */

    createModal: function() {
        var body = document.createElement('div');

        var buttondiv = document.createElement('div');
        buttondiv.className = "btn-group";
        var bittonEachSpec = document.createElement('button');
        bittonEachSpec.className = "btn btn-default";
        bittonEachSpec.innerHTML = editor.languageData.AddCameraSpec;
        bittonEachSpec.id = "addeachspeccam";

        var bittonEachSensorSpec = document.createElement('button');
        bittonEachSensorSpec.className = "btn btn-default";
        bittonEachSensorSpec.innerHTML = "Add Sensor Spec";
        bittonEachSensorSpec.id = "addeachspecsensor";
        /* bittonEachSpec.onclick = function() {

             document.getElementById('fileXmlSpec').style.display = "none";
             Container.style.display = "block";
         }*/
        bittonEachSpec.click();
        var buttonFile = document.createElement('button');
        buttonFile.className = "btn btn-default";
        buttonFile.innerHTML = editor.languageData.AddDetailsfromFile;
        buttonFile.id = "addxmlfile";
        /*  buttonFile.onclick = function() {

              document.getElementById('fileXmlSpec').style.display = "block";
              Container.style.display = "none";
          }*/
        buttondiv.appendChild(bittonEachSpec);
        buttondiv.appendChild(bittonEachSensorSpec);
        buttondiv.appendChild(buttonFile);
        buttondiv
        body.appendChild(buttondiv);



        var Container = document.createElement('div');
        Container.className = "container-fluid";
        Container.id = "eachSpec"

        var mainHeading = document.createElement('h3');
        mainHeading.innerHTML = editor.languageData.PLEASEADDTHEDETAILSOFCAMERA;
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

        var submitButton = document.createElement('button');
        submitButton.className = "btn btn-success pull-right submitbutto"
        submitButton.innerHTML = editor.languageData.submit;
        submitButton.id = 'addspeceachCameraSubmit';

        /*For edit camera spec */
            /* for card image of camera */
            var cardDiv = document.createElement('div');
            cardDiv.setAttribute('class','card');
            cardDiv.setAttribute('id','cardAddCamera');
    
            var cardthumpimg = document.createElement('img')
            cardthumpimg.setAttribute('class','card-img-top img-thumbnail');
            cardthumpimg.setAttribute('src','assets/img/Cam_VX_3PV_B_I.png');
            cardthumpimg.setAttribute('id', "cardthumpimgAdd");
            
    
            var cardBody = document.createElement('div');
            cardBody.setAttribute('class','card-body  cardbodyAdd');
            
            var cardLabel =  document.createElement('label');
            cardLabel.setAttribute('for', "filesAdd");
            cardLabel.setAttribute('class','btn btn-primary');
            cardLabel.innerHTML= editor.languageData.ChangeImage;
            cardLabel.setAttribute('id', "changeImageButttonAdd");
    
            var cardInput =  document.createElement('input');
            cardInput.setAttribute('id','filesAdd');
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

        /*var updateButton = document.createElement('button');
        updateButton.className = "btn btn-success pull-right submitbutto"
        updateButton.innerHTML = "Update"
        updateButton.id = 'UpdateaddspeceachCameraSubmit';
        updateButton.style.display= "none";
        updateButton.setAttribute("data-dismiss","modal");
       

        var deleteButton = document.createElement('button');
        deleteButton.className = "btn btn-danger pull-right submitbutto"
        deleteButton.innerHTML = "Remove"
        deleteButton.id = 'RemoveaddspeceachCameraSubmit';
        deleteButton.style.display= "none";
        deleteButton.setAttribute("data-dismiss","modal");*/
    

        /*For edit camera spec */


        var innerElementone = createElemnt(editor.languageData.BrandName, editor.languageData.ModelName, editor.languageData.HorizontalAOV, editor.languageData.MinHorizontalAOV, "brandname", "modelname", "horizontalaov", "minhorizontalaov");
        var innerElementtwo = createElemnt(editor.languageData.ResolutionWidth, editor.languageData.ResolutionHeight, editor.languageData.LensType,  editor.languageData.CameraType , "resolutionwidth", "resolutionheight", "lenstype", "cameraType");
        var innerElementthree = createElemnt( editor.languageData.DefaultFOV,  editor.languageData.OpticalZoom, editor.languageData.DigitalZoom,  undefined, "defaultfov", "opticalzoom", "digitalzoom", undefined);
        var innerElementFour = createElemnt( editor.languageData.MaxVAOV, editor.languageData.MinVAOV, undefined ,  undefined, "maxverticalaov", "minverticalaov", undefined, undefined);        
        firstRow.appendChild(innerElementone);
        secondRow.appendChild(innerElementtwo);
        thirdRow.appendChild(innerElementthree);
        fourthRow.appendChild(innerElementFour);

        Container.appendChild(firstRow);
        Container.appendChild(secondRow);
        Container.appendChild(thirdRow);
        Container.appendChild(fourthRow);
        Container.appendChild(cardDiv);
        Container.appendChild(submitButton);
        
        /*show image*/
        function readURL(input) {
            if (input.files && input.files[0]) {
                var reader = new FileReader();
        
                reader.onload = function (e) {
                    $('#cardthumpimgAdd').attr('src', e.target.result);
                };
        
                reader.readAsDataURL(input.files[0]);
            }
        }
        /*show image*/
        //Container.appendChild(updateButton);
        //Container.appendChild(deleteButton);

        body.appendChild(Container);

        /* var firstColoum = document.createElement('div');
         firstColoum.className = "col-sm-6";*/
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
                firstinput.placeholder = editor.languageData.ForEg + ": Hitachi"
                firstlabel.className = "required";
				firstinput.id = firstid;
            }
            else if( first == editor.languageData.ResolutionWidth ){

                var firstinput = document.createElement('input');
				firstinput.className = "form-control";
                firstinput.placeholder = editor.languageData.ForEg + ": 1920";
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
				secondinput.placeholder = editor.languageData.ForEg + ": DI-CB320G"
				secondinput.id = secondid;
            }
            else if( second == editor.languageData.ResolutionHeight ){
                var secondinput = document.createElement('input');
                secondinput.className = "form-control";
                secondlabel.className = "required";
                secondinput.type = "number";
				secondinput.placeholder = editor.languageData.ForEg + ": 1080"
				secondinput.id = secondid;
            }
            else if( second == editor.languageData.OpticalZoom ){
                secondlabel.className ="required";
                var secondinput = document.createElement('input');
                secondinput.className = "form-control";
                secondinput.placeholder = editor.languageData.ForEg + ": 2x"
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
        //Sensor spec modal container"

        var sensorContainer = document.createElement('div');
        sensorContainer.className = "container-fluid";
        sensorContainer.id = "eachSpecSen"
        
        var mainHeading = document.createElement('h3');
        mainHeading.innerHTML = "PLEASE ADD THE DETAILS OF SENSOR";
        mainHeading.style.textAlign = 'center';
        mainHeading.style.marginBottom = '3%';
        sensorContainer.appendChild(mainHeading);
        var firstRow = document.createElement('div');
        firstRow.className = 'row';
        var secondRow = document.createElement('div');
        secondRow.className = 'row';
        var thirdRow = document.createElement('div');
        thirdRow.className = 'row';
        var fourthRow = document.createElement('div');
        fourthRow.className = 'row';
        
        var submitButton = document.createElement('button');
        submitButton.className = "btn btn-success pull-right submitbutto"
        submitButton.innerHTML = editor.languageData.submit;
        submitButton.id = 'addspeceachSensorSubmit';
        
        /*For edit camera spec */
            /* for card image of camera */
            var cardDiv = document.createElement('div');
            cardDiv.setAttribute('class','card');
            cardDiv.setAttribute('id','cardAddSensor');
        
            var cardthumpimg = document.createElement('img')
            cardthumpimg.setAttribute('class','card-img-top img-thumbnail');
            cardthumpimg.setAttribute('src','assets/img/lidar_black_256.png');
            cardthumpimg.setAttribute('id', "cardthumpimgAddSensor");
            
        
            var cardBody = document.createElement('div');
            cardBody.setAttribute('class','card-body  cardbodyAdd');
            
            var cardLabel =  document.createElement('label');
            cardLabel.setAttribute('for', "filesAddSensor");
            cardLabel.setAttribute('class','btn btn-primary');
            cardLabel.innerHTML= editor.languageData.ChangeImage;
            cardLabel.setAttribute('id', "changeImageButttonAddSensor");
        
            var cardInputSensor =  document.createElement('input');
            cardInputSensor.setAttribute('id','filesAddSensor');
            cardInputSensor.style.visibility = 'hidden';
            cardInputSensor.setAttribute('type','file');
            cardInputSensor.addEventListener("change", function() {
                readURLSensor(this)
            });
        
            cardDiv.appendChild(cardthumpimg);
            cardDiv.appendChild(cardBody);
            cardBody.appendChild(cardLabel);
            cardBody.appendChild(cardInputSensor);
            
        /* for card image of camera End */  
        
        /*var updateButton = document.createElement('button');
        updateButton.className = "btn btn-success pull-right submitbutto"
        updateButton.innerHTML = "Update"
        updateButton.id = 'UpdateaddspeceachCameraSubmit';
        updateButton.style.display= "none";
        updateButton.setAttribute("data-dismiss","modal");
        
        
        var deleteButton = document.createElement('button');
        deleteButton.className = "btn btn-danger pull-right submitbutto"
        deleteButton.innerHTML = "Remove"
        deleteButton.id = 'RemoveaddspeceachCameraSubmit';
        deleteButton.style.display= "none";
        deleteButton.setAttribute("data-dismiss","modal");*/
        
        
        /*For edit camera spec */
        
        
        var innerElementone = createElemntForSensor(editor.languageData.BrandName, editor.languageData.ModelName, editor.languageData.HorizontalAOV, editor.languageData.MinHorizontalAOV, "sensorBrandname", "sensorModelname", "sensorHorizontalaov", "sensorMinhorizontalaov");
        var innerElementtwo = createElemntForSensor(editor.languageData.ResolutionWidth, editor.languageData.ResolutionHeight, editor.languageData.LensType, editor.languageData.ApplicationType , "sensorResolutionWidth", "sensorResolutionHeight", "sensorLenstype", "sensorCategory");
        var innerElementthree = createElemntForSensor( editor.languageData.DefaultFOV,  editor.languageData.OpticalZoom, editor.languageData.DigitalZoom,  editor.languageData.MinVAOV, "sensorDefaultfov", "sensorOpticalzoom", "sensorDigitalzoom", "sensorMinverticalaov");
        var innerElementFour = createElemntForSensor( editor.languageData.MaxVAOV, undefined, undefined ,  undefined, "sensorMaxverticalaov", undefined, undefined, undefined);        
        firstRow.appendChild(innerElementone);
        secondRow.appendChild(innerElementtwo);
        thirdRow.appendChild(innerElementthree);
        fourthRow.appendChild(innerElementFour);
        
        sensorContainer.appendChild(firstRow);
        sensorContainer.appendChild(secondRow);
        sensorContainer.appendChild(thirdRow);
        sensorContainer.appendChild(fourthRow);
        sensorContainer.appendChild(cardDiv);
        sensorContainer.appendChild(submitButton);
        
        /*show image*/
        function readURLSensor(input) {
            if (input.files && input.files[0]) {
                var reader = new FileReader();
        
                reader.onload = function (e) {
                    $('#cardthumpimgAddSensor').attr('src', e.target.result);
                };
        
                reader.readAsDataURL(input.files[0]);
            }
        }
        /*show image*/
        //Container.appendChild(updateButton);
        //Container.appendChild(deleteButton);
        
        body.appendChild(sensorContainer);
        
        /* var firstColoum = document.createElement('div');
         firstColoum.className = "col-sm-6";*/
        function createElemntForSensor(first, second, third, fourth, firstid, secondid, thirdid, fourthid) {
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
                firstinput.placeholder = editor.languageData.ForEg + ": Hitachi"
                firstlabel.className = "required";
                firstinput.id = firstid;
            }
            else if( first == editor.languageData.ResolutionWidth ){
        
                var firstinput = document.createElement('input');
                firstinput.className = "form-control";
                firstinput.placeholder = editor.languageData.ForEg + ": 1920";
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
                secondinput.placeholder = editor.languageData.ForEg + ": DI-CB320G"
                secondinput.id = secondid;
            }
            else if( second == editor.languageData.ResolutionHeight ){
                var secondinput = document.createElement('input');
                secondinput.className = "form-control";
                secondlabel.className = "required";
                secondinput.type = "number";
                secondinput.placeholder = editor.languageData.ForEg + ": 1080"
                secondinput.id = secondid;
            }
            else if( second == editor.languageData.OpticalZoom ){
                secondlabel.className ="required";
                var secondinput = document.createElement('input');
                secondinput.className = "form-control";
                secondinput.placeholder = editor.languageData.ForEg + ": 2x"
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
            // if(fourth == editor.languageData.CameraType){
        
            //     var opt;
            //     fourthlabel.className = "required";
            //     var fourthinput  = document.createElement("select");
            //     fourthinput.id = fourthid;
            //     fourthinput.className = "form-control" ;
            //     opt = document.createElement('option');
            //     opt.value = "Box";
            //     opt.innerHTML = editor.languageData.Box;
            //     fourthinput.appendChild(opt);
        
            //     opt = document.createElement('option');
            //     opt.value = "Dome";
            //     opt.innerHTML = editor.languageData.Dome;
            //     fourthinput.appendChild(opt);
        
            //     opt = document.createElement('option');
            //     opt.value = "Fixed Dome";
            //     opt.innerHTML = editor.languageData.FixedDome;
            //     fourthinput.appendChild(opt);
            //     opt = document.createElement('option');
            //     opt.value = "PTZ";
            //     opt.innerHTML = editor.languageData.PTZ;
            //     fourthinput.appendChild(opt);
            //     opt = document.createElement('option');
            //     opt.value = "Bullet";
            //     opt.innerHTML = editor.languageData.Bullet;
            //     fourthinput.appendChild(opt);
            //     opt = document.createElement('option');
            //     opt.value = "IP";
            //     opt.innerHTML = editor.languageData.IP;
            //     fourthinput.appendChild(opt);
            //     opt = document.createElement('option');
            //     opt.value = "Day/Night";
            //     opt.innerHTML = editor.languageData.DayNight;
            //     fourthinput.appendChild(opt);
            //     opt = document.createElement('option');
            //     opt.value = "Thermal";
            //     opt.innerHTML = editor.languageData.Thermal;
            //     fourthinput.appendChild(opt);
            //     opt = document.createElement('option');
            //     opt.value = "Wireless";
            //     opt.innerHTML = editor.languageData.Wireless;
            //     fourthinput.appendChild(opt);
        
            //     opt = document.createElement('option');
            //     opt.value = "Fisheye";
            //     opt.innerHTML = editor.languageData.Fisheye;
            //     fourthinput.appendChild(opt);
        
            //     opt = document.createElement('option');
            //     opt.value = "Panorama";
            //     opt.innerHTML = editor.languageData.Panorama;
            //     fourthinput.appendChild(opt);
        
            //     opt = document.createElement('option');
            //     opt.value = "LiDAR";
            //     opt.innerHTML = editor.languageData.LiDAR;
            //     fourthinput.appendChild(opt);
                
            // }
            if(fourth == editor.languageData.MinHorizontalAOV ){
                
                var fourthinput = document.createElement('input');
                fourthinput.className = "form-control";
                fourthinput.type = "number";
                fourthinput.id = fourthid;
                
            }
            else if (fourth == editor.languageData.ApplicationType){

                var fourthinput = document.createElement('input');
                fourthinput.className = "form-control";
                fourthinput.id = fourthid;
                var opt;
                fourthlabel.className = "required";
                var fourthinput  = document.createElement("select");
                fourthinput.id = fourthid;
                fourthinput.className = "form-control" ;

                opt = document.createElement('option');
                opt.value = "Hitachi LFOM5";
                opt.innerHTML = "Hitachi LFOM5";
                fourthinput.appendChild(opt);
        
                opt = document.createElement('option');
                opt.value = "Intel RealSense L515";
                opt.innerHTML = "Intel RealSense L515";
                fourthinput.appendChild(opt); 

                opt = document.createElement('option');
                opt.value = "HLS-LFOM1";
                opt.innerHTML = "HLS-LFOM1";
                fourthinput.appendChild(opt); 

                opt = document.createElement('option');
                opt.value = "HLS-LFOM3";
                opt.innerHTML = "HLS-LFOM3";
                fourthinput.appendChild(opt); 
            }
            else if( fourth == editor.languageData.MinVAOV ){

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
        

        var maincontainor = document.createElement('div');
        maincontainor.className = "container";
        maincontainor.id = "fileXmlSpec";
        maincontainor.style.display = 'none';

        var maincolDiv = document.createElement('div');
        maincolDiv.className = "col-md-8 col-md-offset-2";
        var heading = document.createElement('h3');
        heading.innerHTML = editor.languageData.PLEASESELECTTHEEXCELFILE;
        maincolDiv.appendChild(heading);
        var fileFormGroup = document.createElement('div');
        fileFormGroup.className = "form-group";
        var fileDiv = document.createElement('div');
        fileDiv.className = "input-group input-file";
        var fileInput = document.createElement('input');
        fileInput.className = "form-control choosexmlinput";
        fileInput.id = "addFileInput";
        fileInput.setAttribute("accept", ".xlsx");
        fileInput.type = "file";
        /*  var fileSpan = document.createElement('span');
          fileSpan.className = "input-group-btn";*/
        var chooseFile = document.createElement('button');
        chooseFile.className = "btn btn-default btn-choose";
        chooseFile.innerHTML = editor.languageData.ChooseFile;
        // chooseFile.style.width = '244%';

      

        var fileresetDiv = document.createElement('div');
        fileresetDiv.className = "form-group";
        var submitFile = document.createElement('button');
        submitFile.className = "btn btn-primary pull-right";
        submitFile.id = "submitFileButton";
        submitFile.innerHTML = editor.languageData.submit;

        var resetfile = document.createElement('button');
        resetfile.className = "btn btn-danger";
        resetfile.id ="resetFileButton";
        resetfile.innerHTML = editor.languageData.Reset;

        maincolDiv.appendChild(fileFormGroup);
        fileFormGroup.appendChild(fileDiv);
        fileDiv.appendChild(fileInput);

        /*   fileSpan.appendChild(chooseFile);*/
        /*   fileDiv.appendChild(fileSpan);*/
        maincolDiv.appendChild(fileresetDiv);
        fileresetDiv.appendChild(submitFile);
        fileresetDiv.appendChild(resetfile);
        maincontainor.appendChild(maincolDiv);
        body.appendChild(maincontainor);





        var AddSpecCameraModel = new UI.bootstrapModal("", "Add-Camera-Spec", editor.languageData.AddNewCameraSpec , body, "Open", editor.languageData.Cancel , "open-Add-Camera-form");
        AddSpecCameraModel.makeLargeModal();
        AddSpecCameraModel.hideFooterSuccessButton();
        return AddSpecCameraModel;
    }

}