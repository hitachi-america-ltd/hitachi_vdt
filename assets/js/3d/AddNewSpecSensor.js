
/**
 * AddNewSpecSensor( editor ) : Constructor function for creating a new sensor
 * @constructor
 * @param {any} editor - The instance of the Editor which manages the overall objects and signals
 * @returns {Object}
 * @author Mavelil
 * @example <caption>Example usage of AddNewSpecCamera</caption>
 * var addNewSpecCamera = new AddNewSpecCamera( editor );
 */

var AddNewSpecSensor = function( editor ) {
    this.name = "AddNewSpecSensor";
    return this;
}
AddNewSpecSensor.prototype = {

    /**
     * createModal( ) - Method to create a UI modal for entering the new sensor spec
     * @returns {Object<UI.bootstrapModal>} - Returns a UI modal
     * @author Mavelil
     * @example <caption>Example usage of createModal method.</caption>
     * addNewSpecSensor.createModal( );
     */

    createModal: function() {
        var body = document.createElement('div');

        // var buttondiv = document.createElement('div');
        // buttondiv.className = "btn-group";
        // var bittonEachSpec = document.createElement('button');
        // bittonEachSpec.className = "btn btn-default";
        // // bittonEachSpec.innerHTML = editor.languageData.AddCameraSpec;
        // bittonEachSpec.innerHTML = 'Add Sensor Spec';
        // bittonEachSpec.id = "addeachspecsen";
        // /* bittonEachSpec.onclick = function() {

        //      document.getElementById('fileXmlSpec').style.display = "none";
        //      Container.style.display = "block";
        //  }*/
        // bittonEachSpec.click();
        // var buttonFile = document.createElement('button');
        // buttonFile.className = "btn btn-default";
        // buttonFile.innerHTML = editor.languageData.AddDetailsfromFile;
        // buttonFile.id = "addxmlfile";
        /*  buttonFile.onclick = function() {

              document.getElementById('fileXmlSpec').style.display = "block";
              Container.style.display = "none";
          }*/
        // buttondiv.appendChild(bittonEachSpec);
        // // buttondiv.appendChild(buttonFile);
        // buttondiv
        // body.appendChild(buttondiv);



        var ContainerSensor = document.createElement('div');
        ContainerSensor.className = "container-fluid";
        ContainerSensor.id = "eachSpecSen"

        var mainHeading = document.createElement('h3');
        mainHeading.innerHTML = editor.languageData.PLEASEADDTHEDETAILSOFSENSOR;
        mainHeading.style.textAlign = 'center';
        mainHeading.style.marginBottom = '3%';
        ContainerSensor.appendChild(mainHeading);
        var firstRow = document.createElement('div');
        firstRow.className = 'row';
        var secondRow = document.createElement('div');
        secondRow.className = 'row';
        var thirdRow = document.createElement('div');
        thirdRow.className = 'row';
        //var fourthRow = document.createElement('div');
        //fourthRow.className = 'row';

        var submitButton = document.createElement('button');
        submitButton.className = "btn btn-success pull-right submitbutto"
        submitButton.innerHTML = editor.languageData.submit;
        submitButton.id = 'addspeceachSensorSubmit';

        /*For edit camera spec */
            /* for card image of camera */
            
            var cardDiv = document.createElement('div');
            cardDiv.setAttribute('class','card');
            cardDiv.setAttribute('id','cardAddSensor');
    
            // var cardthumpimg = document.createElement('img')
            // cardthumpimg.setAttribute('class','card-img-top img-thumbnail');
            // cardthumpimg.setAttribute('src','assets/img/lidar_lform5.png');
            // cardthumpimg.setAttribute('id', "sencardthumpimgAdd");
            
            var cardthumpimg = document.createElement('img')
            cardthumpimg.setAttribute('class','card-img-top img-thumbnail');
            cardthumpimg.setAttribute('src','assets/img/lidar_black_256.png');
            cardthumpimg.setAttribute('id', "cardthumpimgAddSensor");
            cardthumpimg.height = "20%";
            
            var cardBody = document.createElement('div');
            cardBody.setAttribute('class','card-body  cardbodyAdd');
            
            var cardLabel =  document.createElement('label');
            cardLabel.setAttribute('for', "filesAddSensor");
            cardLabel.setAttribute('class','btn btn-primary');
            cardLabel.innerHTML= editor.languageData.ChangeImage;
            cardLabel.setAttribute('id', "senchangeImageButttonAdd");
    
            var cardInput =  document.createElement('input');
            cardInput.setAttribute('id','filesAddSensor');
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
        
        var innerElementone = createElemnt(editor.languageData.BrandName, editor.languageData.ModelName, editor.languageData.HorizontalAOV, editor.languageData.MinHorizontalAOV, "senbrandname", "senmodelname", "senhorizontalaov", "senminhorizontalaov");
        var innerElementtwo = createElemnt(editor.languageData.ResolutionWidth, editor.languageData.ResolutionHeight, editor.languageData.LensType,editor.languageData.MaxVAOV, "senresolutionwidth", "senresolutionheight", "senlenstype", "senmaxverticalaov");
        var innerElementthree = createElemnt(editor.languageData.MinVAOV, editor.languageData.OpticalZoom, editor.languageData.DigitalZoom, editor.languageData.DefaultFOV,"senminverticalaov", "senopticalzoom", "sendigitalzoom", "sendefaultfov");
        //var innerElementFour = createElemnt( editor.languageData.MinVAOV, , );        


        // var innerElementone = createElemnt("senbrandname", "senmodelname", "senhorizontalaov", "senminhorizontalaov");
        // var innerElementtwo = createElemnt( "senresolutionwidth", "senresolutionheight", "senlenstype", "senType");
        // var innerElementthree = createElemnt("sendefaultfov", "senopticalzoom", "sendigitalzoom", undefined);
        // var innerElementFour = createElemnt( "senmaxverticalaov", "senminverticalaov", undefined, undefined);  
        firstRow.appendChild(innerElementone);
        secondRow.appendChild(innerElementtwo);
        thirdRow.appendChild(innerElementthree);
        //fourthRow.appendChild(innerElementFour);

        ContainerSensor.appendChild(firstRow);
        ContainerSensor.appendChild(secondRow);
        ContainerSensor.appendChild(thirdRow);
        //Container.appendChild(fourthRow);
        ContainerSensor.appendChild(cardDiv);
        ContainerSensor.appendChild(submitButton);
        
        /*show image*/
        function readURL(input) {
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

        body.appendChild(ContainerSensor);

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
			
			if(first == editor.languageData.BrandName){
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
            else if( first == editor.languageData.MinVAOV ){
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
                opt.value = "Dome";
                opt.innerHTML = editor.languageData.Dome;
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
                opt.value = "Bullet";
                opt.innerHTML = editor.languageData.Bullet;
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

                opt = document.createElement('option');
                opt.value = "LiDAR";
                opt.innerHTML = editor.languageData.LiDAR;
                fourthinput.appendChild(opt);
                
            }
			else if(fourth == editor.languageData.MinHorizontalAOV ){
				
				var fourthinput = document.createElement('input');
                fourthinput.className = "form-control";
                fourthinput.type = "number";
                fourthinput.id = fourthid;
				
            }
            else if( fourth == editor.languageData.MaxVAOV ){
                var fourthinput = document.createElement('input');
				fourthinput.className = "form-control";
                fourthinput.type = "number";
				fourthinput.id = fourthid;
            }
            else if(fourth == editor.languageData.DefaultFOV){
                var opt;
                fourthlabel.className = "required";
                var fourthinput = document.createElement('select');
                fourthinput.id = fourthid;
                fourthinput.className = "form-control";
                opt = document.createElement('option');
                opt.value = "Left";
                opt.innerHTML = "Left";
                fourthinput.appendChild(opt);

                opt = document.createElement('option');
                opt.value = "Right";
                opt.innerHTML = "Right";
                fourthinput.appendChild(opt);

                opt = document.createElement('option');
                opt.value = "Top";
                opt.innerHTML = "Top";
                fourthinput.appendChild(opt);

                opt = document.createElement('option');
                opt.value = "Bottom";
                opt.selected = "selected";
                opt.innerHTML = "Bottom";
                fourthinput.appendChild(opt);

                opt = document.createElement('option');
                opt.value = "Front";
                opt.innerHTML = "Front";
                fourthinput.appendChild(opt);

                opt = document.createElement('option');
                opt.value = "Back";
                opt.innerHTML = "Back";
                fourthinput.appendChild(opt);

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

        // var maincontainor = document.createElement('div');
        // maincontainor.className = "container";
        // maincontainor.id = "fileXmlSpec";
        // maincontainor.style.display = 'none';

        // var maincolDiv = document.createElement('div');
        // maincolDiv.className = "col-md-8 col-md-offset-2";
        // var heading = document.createElement('h3');
        // heading.innerHTML = editor.languageData.PLEASESELECTTHEEXCELFILE;
        // maincolDiv.appendChild(heading);
        // var fileFormGroup = document.createElement('div');
        // fileFormGroup.className = "form-group";
        // var fileDiv = document.createElement('div');
        // fileDiv.className = "input-group input-file";
        // var fileInput = document.createElement('input');
        // fileInput.className = "form-control choosexmlinput";
        // fileInput.id = "addFileInput";
        // fileInput.setAttribute("accept", ".xlsx");
        // fileInput.type = "file";
        // /*  var fileSpan = document.createElement('span');
        //   fileSpan.className = "input-group-btn";*/
        // var chooseFile = document.createElement('button');
        // chooseFile.className = "btn btn-default btn-choose";
        // chooseFile.innerHTML = editor.languageData.ChooseFile;
        // // chooseFile.style.width = '244%';

      

        // var fileresetDiv = document.createElement('div');
        // fileresetDiv.className = "form-group";
        // var submitFile = document.createElement('button');
        // submitFile.className = "btn btn-primary pull-right";
        // submitFile.id = "submitFileButton";
        // submitFile.innerHTML = editor.languageData.submit;

        // var resetfile = document.createElement('button');
        // resetfile.className = "btn btn-danger";
        // resetfile.id ="resetFileButton";
        // resetfile.innerHTML = editor.languageData.Reset;

        // maincolDiv.appendChild(fileFormGroup);
        // fileFormGroup.appendChild(fileDiv);
        // fileDiv.appendChild(fileInput);

        /*   fileSpan.appendChild(chooseFile);*/
        /*   fileDiv.appendChild(fileSpan);*/
        // maincolDiv.appendChild(fileresetDiv);
        // fileresetDiv.appendChild(submitFile);
        // fileresetDiv.appendChild(resetfile);
        // maincontainor.appendChild(maincolDiv);
        // body.appendChild(maincontainor);





        var AddSpecSensorModel = new UI.bootstrapModal("", "Add-Sensor-Spec", "Add New Sensor Spec" , body, "Open", editor.languageData.Cancel , "open-Add-Sensor-form");
        AddSpecSensorModel.makeLargeModal();
        AddSpecSensorModel.hideFooterSuccessButton();
        return AddSpecSensorModel;
    }

}