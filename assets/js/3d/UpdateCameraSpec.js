
/**
 * UpdateCameraSpec( editor ) - Constructor function for editing the camera specifications.
 * @constructor
 * @param {any} editor - The instance of the Editor which manages the overall objects and signals
 * @param {Object<UI.bootstrapModal>} addspecModal - UI modal for creating new camera spec.
 * @author Mavelil
 * @returns {void}
 * @example <caption>Example usage of UpdateCameraSpec</caption>
 * var updateCameraSpec = new UpdateCameraSpec( editor );
 */
var UpdateCameraSpec = function(editor, addspecModal) {

    this.editor = editor;
    this.addspecModal = addspecModal;
    this.editCamData = ""
    return this;
}
UpdateCameraSpec.prototype = {

    /**
     * setUpadteFeilds( ) -  Method to set the default values and properties for create camera modal.
	 * @returns {Void}
     * @author Mavelil
     * @example <caption>Example usage of setUpadteFeilds method.</caption>
     * updateCameraSpec.setUpadteFeilds( );
     */

    setUpadteFeilds: function() {

        var scope = this;
        document.getElementById('editorElement').appendChild(scope.addspecModal.dom);
        document.getElementById('horizontalaov').setAttribute("type", "number");
        document.getElementById('horizontalaov').setAttribute("min", "10");
        document.getElementById('horizontalaov').setAttribute("max", "179");
        document.getElementById('horizontalaov').setAttribute("value", "50");
        document.getElementById('minhorizontalaov').setAttribute("type", "number");
        document.getElementById('minhorizontalaov').setAttribute("value", "10");
        document.getElementById('opticalzoom').setAttribute("value", "2x");
        document.getElementById('digitalzoom').setAttribute("value", "4x");
        document.getElementById('resolutionwidth').setAttribute( "value", "1920" );
        document.getElementById('resolutionheight').setAttribute( "value", "1080" );
        //document.getElementById('lenstype').setAttribute("value", "Normal");

    },

    setUpadteFeildsForSensors: function(){
        var scope = this;
        document.getElementById('editorElement').appendChild(scope.addspecModal.dom);
        document.getElementById('sensorHorizontalaov').setAttribute("type", "number");
        document.getElementById('sensorHorizontalaov').setAttribute("min", "10");
        document.getElementById('sensorHorizontalaov').setAttribute("max", "179");
        document.getElementById('sensorHorizontalaov').setAttribute("value", "50");
        document.getElementById('sensorMinhorizontalaov').setAttribute("type", "number");
        document.getElementById('sensorMinhorizontalaov').setAttribute("value", "10");
        document.getElementById('sensorOpticalzoom').setAttribute("value", "2x");
        document.getElementById('sensorDigitalzoom').setAttribute("value", "4x");
        document.getElementById('sensorResolutionWidth').setAttribute( "value", "1920" );
        document.getElementById('sensorResolutionHeight').setAttribute( "value", "1080" );
    },

    /**
     * updateCameraEditData( cameraSpecDataupdate ) -  Method to update the camera specs with the edited values in the server.
     * @param {Object<JSON>} cameraSpecDataupdate - The JSON Object containing user ID and camera specifications
	 * @returns {Void}
     * @author Mavelil
     * @example <caption>Example usage of updateCameraEditData method.</caption>
     * updateCameraSpec.updateCameraEditData( cameraSpecDataupdate );
     */

    updateCameraEditData: function(cameraSpecDataupdate) {
        var scope = this;
        $.ajax({
            url: scope.editor.api + 'cameraSpec/users/update/',
            type: "POST",
            contentType: 'application/json',
            processData: false,
            data: JSON.stringify(cameraSpecDataupdate),
            success: function(result) {
                document.getElementById('filesEdit').value = null;
                toastr.info(editor.languageData[result]);
                var element = document.getElementById("select-camera-model");
                element.remove();
                scope.addspecModal.hide();
                scope.editor.signals.specUpdateComplete.dispatch();

            },
            error: function(err) {
                toastr.error('Somthing went wrong try again !!!');
                console.log(err);
            }
        });

    },

    updateSensorEditData: function(cameraSpecDataupdate) {
        var scope = this;
        $.ajax({
            url: scope.editor.api + 'cameraSpec/users/update/',
            type: "POST",
            contentType: 'application/json',
            processData: false,
            data: JSON.stringify(cameraSpecDataupdate),
            success: function(result) {
                document.getElementById('filesEditSensor').value = null;
                toastr.info(editor.languageData[result]);
                var element = document.getElementById("select-sensor-model");
                element.remove();
                scope.addspecModal.hide();
                scope.editor.signals.specUpdateCompleteSensor.dispatch();

            },
            error: function(err) {
                toastr.error('Somthing went wrong try again !!!');
                console.log(err);
            }
        });

    },

    /**
     * camNewSpecDataUpdate( ) -  Method to update the camera specs with the edited values in the server.
	 * @returns {Object}
     * @author Mavelil
     * @example <caption>Example usage of camNewSpecDataUpdate method.</caption>
     * updateCameraSpec.camNewSpecDataUpdate( );
     */

    camNewSpecDataUpdate: function() {

        var cameraBrandName = document.getElementById('brandnameUpdate').value;
        var cameraModelName = document.getElementById('modelnameUpdate').value;
        var cameraHorizontalAOV = document.getElementById('horizontalaovUpdate').value;
        var cameraMinHorizontalAOV = document.getElementById('minhorizontalaovUpdate').value;
        var cameraImageUrl = document.getElementById('filesEdit').value;
        var cameraCameraType = document.getElementById('cameraTypeUpdate').value;
        var cameraResolutionWidth = document.getElementById('resolutionwidthUpdate').value;
        var cameraResolutionHeight = document.getElementById('resolutionheightUpdate').value;    
        var cameraDefFov = document.getElementById('defaultfovUpdate').value;
        var cameraOpticalZoom = document.getElementById('opticalzoomUpdate').value;
        var cameraDigitalZoom = document.getElementById('digitalzoomUpdate').value;
        var cameraLensType = document.getElementById('lenstypeUpdate').value;

        var cameraMaxVerticalAOV = document.getElementById('maxverticalaovUpdate').value;
        var cameraMinVerticalAOV = document.getElementById('minverticalaovUpdate').value;
        

        if (filesEdit.files[0] == undefined || filesEdit.files[0] == null) {

            var imageNameEdit = cardthumpimgEdit.src;
            var imagenameSpiltArray = imageNameEdit.split('/');
            cameraImageUrl = imagenameSpiltArray.pop();

        } 
        else {

            cameraImageUrl = filesEdit.files[0].name;

        }
        if (cameraBrandName == '' || cameraModelName == '' || cameraBrandName == null || cameraModelName == null || cameraHorizontalAOV == '' || cameraResolutionWidth == '' || cameraResolutionHeight == '' ) {

            toastr.error(editor.languageData.SomeDataisMissing);
            return "null";

        }
        else if( (/(^(?:\b|-)([1-9]{1,2}[0]?x|100x)\b)/g).test(cameraOpticalZoom) == false || (/^(?:[1-9]x|0[1-9]x|1[1-5]x|10x)$/g).test(cameraDigitalZoom) == false ){
            toastr.error(editor.languageData.incorrectzoomparameters);
            return "null";
        } 
        else {
            var vFOV;
            var idRandom = Math.random();
            idRandom = idRandom * 10000;
            var aspect = cameraResolutionWidth/cameraResolutionHeight;
            if( cameraMaxVerticalAOV == "" || cameraMaxVerticalAOV == null ) {
        
                vFOV = cameraHorizontalAOV / aspect;
            }
            else{
                vFOV = cameraMaxVerticalAOV;
            }
            var getCamSpec = {
                "id": idRandom,
                "manufacturer": cameraBrandName,
                "model": cameraModelName,
                "model_path": cameraModelName,
                "parent": true,
                "text": cameraBrandName,
                "disabled": true,
                "children": [{
                    "id": idRandom + 1,
                    "manufacturer": cameraBrandName,
                    "model": cameraModelName,
                    "model_path": cameraModelName,
                    "horizontal_aov": cameraHorizontalAOV,
                    "aspect": aspect,
                    "vertical_aov": vFOV,
                    "min_horizontal_aov": cameraMinHorizontalAOV,
                    "max_vertical_aov" : cameraMaxVerticalAOV,
                    "min_vertical_aov" : cameraMinVerticalAOV,
                    "text": cameraBrandName,
                    "zoom_digital":cameraDigitalZoom,
                    "zoom_optical":cameraOpticalZoom,
                    "def_fov": cameraDefFov,
                    "cam_lens": cameraLensType,
                    "resolutionWidth": cameraResolutionWidth,
                    "resolutionHeight": cameraResolutionHeight,
                    "image_url": "assets/img/" + cameraImageUrl,
                    "form_factor": cameraCameraType
                }],
                "image_url": "assets/img/" + cameraImageUrl,
                "form_factor": cameraCameraType
            }
            return (getCamSpec);
        }
    },

    camNewSensorSpecDataUpdate: function() {

        var cameraBrandName = document.getElementById('sensorBrandnameUpdate').value;
        var cameraModelName = document.getElementById('sensorModelnameUpdate').value;
        var cameraHorizontalAOV = document.getElementById('sensorHorizontalaovUpdate').value;
        var cameraMinHorizontalAOV = document.getElementById('sensorMinhorizontalaovUpdate').value;
        var cameraImageUrl = document.getElementById('filesEditSensor').value;
        //var cameraCameraType = document.getElementById('cameraTypeUpdate').value;
        var sensorSensortype = document.getElementById('sensorCategoryUpdate').value;
        var cameraResolutionWidth = document.getElementById('sensorResolutionWidthUpdate').value;
        var cameraResolutionHeight = document.getElementById('sensorResolutionHeightUpdate').value;    
        var cameraDefFov = document.getElementById('sensorDefaultfovUpdate').value;
        var cameraOpticalZoom = document.getElementById('sensorOpticalzoomUpdate').value;
        var cameraDigitalZoom = document.getElementById('sensorDigitalzoomUpdate').value;
        var cameraLensType = document.getElementById('sensorLenstypeUpdate').value;

        var cameraMaxVerticalAOV = document.getElementById('sensorMaxverticalaovUpdate').value;
        var cameraMinVerticalAOV = document.getElementById('sensorMinverticalaovUpdate').value;
        

        if (filesEditSensor.files[0] == undefined || filesEditSensor.files[0] == null) {

            var imageNameEdit = cardthumpimgEditSensor.src;
            var imagenameSpiltArray = imageNameEdit.split('/');
            cameraImageUrl = imagenameSpiltArray.pop();

        } 
        else {

            cameraImageUrl = filesEditSensor.files[0].name;

        }
        if (cameraBrandName == '' || cameraModelName == '' || cameraBrandName == null || cameraModelName == null || cameraHorizontalAOV == '' || cameraResolutionWidth == '' || cameraResolutionHeight == '' ) {

            toastr.error(editor.languageData.SomeDataisMissing);
            return "null";

        }
        else if( (/(^(?:\b|-)([1-9]{1,2}[0]?x|100x)\b)/g).test(cameraOpticalZoom) == false || (/^(?:[1-9]x|0[1-9]x|1[1-5]x|10x)$/g).test(cameraDigitalZoom) == false ){
            toastr.error(editor.languageData.incorrectzoomparameters);
            return "null";
        } 
        else {
            var vFOV;
            var idRandom = Math.random();
            idRandom = idRandom * 10000;
            var aspect = cameraResolutionWidth/cameraResolutionHeight;
            if( cameraMaxVerticalAOV == "" || cameraMaxVerticalAOV == null ) {
        
                vFOV = cameraHorizontalAOV / aspect;
            }
            else{
                vFOV = cameraMaxVerticalAOV;
            }
            var getCamSpec = {
                "id": idRandom,
                "manufacturer": cameraBrandName,
                "model": cameraModelName,
                "model_path": cameraModelName,
                "parent": true,
                "text": cameraBrandName,
                "disabled": true,
                "children": [{
                    "id": idRandom + 1,
                    "manufacturer": cameraBrandName,
                    "model": cameraModelName,
                    "model_path": cameraModelName,
                    "horizontal_aov": cameraHorizontalAOV,
                    "aspect": aspect,
                    "vertical_aov": vFOV,
                    "min_horizontal_aov": cameraMinHorizontalAOV,
                    "max_vertical_aov" : cameraMaxVerticalAOV,
                    "min_vertical_aov" : cameraMinVerticalAOV,
                    "text": cameraBrandName,
                    "zoom_digital":cameraDigitalZoom,
                    "zoom_optical":cameraOpticalZoom,
                    "def_fov": cameraDefFov,
                    "cam_lens": cameraLensType,
                    "resolutionWidth": cameraResolutionWidth,
                    "resolutionHeight": cameraResolutionHeight,
                    "image_url": "assets/img/" + cameraImageUrl,
                    "form_factor" : "LiDAR",
                    "sensorCategory": sensorSensortype
                }],
                "image_url": "assets/img/" + cameraImageUrl,
                "form_factor" : "LiDAR",
            }
            return (getCamSpec);
        }
    },

    /**
     * selectCameraDomChange( ) -  Method to show the model for selecting specific camera.
	 * @returns {Void}
     * @author Mavelil
     * @example <caption>Example usage of selectCameraDomChange method.</caption>
     * updateCameraSpec.selectCameraDomChange( );
     */

    selectCameraDomChange : function (){

        document.getElementById('selectCameraBtn').style.display = "block";
        document.getElementById(' brand-list').style.display = "block";
        document.getElementById('editorCameraModellist').style.display = "block";
        document.getElementById('camera-modelthreeD').style.display = "none";
        document.getElementById('updateEachSpec').style.display = "none";
        document.getElementById('EditCameraBtn').style.display = "none";

    },

    /**
     * selectSensorDomChange( ) -  Method to show the model for selecting specific camera.
	 * @returns {Void}
     * @author Mavelil
     * @example <caption>Example usage of selectSensorDomChange method.</caption>
     * updateCameraSpec.selectSensorDomChange( );
     */

    selectSensorDomChange : function (){

        document.getElementById('selectSensorBtn').style.display = "block";
        document.getElementById(' brand-list-sensor').style.display = "block";
        document.getElementById('editorSensorModellist').style.display = "block";
        document.getElementById('sensor-modelthreeD').style.display = "none";
        document.getElementById('updateEachSensorSpec').style.display = "none";
        document.getElementById('EditSensorBtn').style.display = "none";

    },
    /**
     * addNewSpecDomAction( ) -  Method to show the model for adding new camera spec manually or from a file.
	 * @returns {Void}
     * @author Mavelil
     * @example <caption>Example usage of addNewSpecDomAction method.</caption>
     * updateCameraSpec.addNewSpecDomAction( );
     */

    addNewSpecDomAction : function (){

        var scope = this;
        document.getElementById('addxmlfile').style.display = "block";
        document.getElementById('addeachspeccam').style.display = "block";
        document.getElementById('addspeceachCameraSubmit').style.display = "block";
        document.getElementById('brandname').value = "";
        document.getElementById('modelname').value = "";
        document.getElementById('addxmlfile').click();
        scope.editor.select(null);
        

    },

    /**
     * editButtonCameraDomAction( ) -  Method to show the model for editing camera spec.
	 * @returns {Void}
     * @author Mavelil
     * @example <caption>Example usage of editButtonCameraDomAction method.</caption>
     * updateCameraSpec.editButtonCameraDomAction( );
     */

    editButtonCameraDomAction : function(){

        document.getElementById(' brand-list').style.display = "none";
        document.getElementById('editorCameraModellist').style.display = "none";
        document.getElementById('camera-modelthreeD').style.display = "none";
        document.getElementById('updateEachSpec').style.display = "block";
    },

    editButtonSensorDomAction : function(){

        document.getElementById(' brand-list-sensor').style.display = "none";
        document.getElementById('editorSensorModellist').style.display = "none";
        document.getElementById('sensor-modelthreeD').style.display = "none";
        document.getElementById('updateEachSensorSpec').style.display = "block";
    },

    /**
     * changeSpecDomAction( ) -  Method to show the model for choosing the camera to edit.
	 * @returns {Void}
     * @author Mavelil
     * @example <caption>Example usage of changeSpecDomAction method.</caption>
     * updateCameraSpec.changeSpecDomAction( );
     */

    changeSpecDomAction : function(){

        document.getElementById('updateEachSpec').style.display = "none";
        document.getElementById('selectCameraBtn').style.display = "none";
        document.getElementById('EditCameraBtn').style.display = "block";
        document.getElementById(' brand-list').style.display = "block";
        document.getElementById('editorCameraModellist').style.display = "block";
        document.getElementById('camera-modelthreeD').style.display = "none";

    },

    changeSensorSpecDomAction : function(){

        document.getElementById('updateEachSensorSpec').style.display = "none";
        document.getElementById('selectSensorBtn').style.display = "none";
        document.getElementById('EditSensorBtn').style.display = "block";
        document.getElementById(' brand-list-sensor').style.display = "block";
        document.getElementById('editorSensorModellist').style.display = "block";
        document.getElementById('sensor-modelthreeD').style.display = "none";

    },

    /**
     * camNewSpecData( ) -  Method to store the details of a newly created camera.
	 * @returns {Object} getCamSpec - To store the details of the camera to send it to db
     * @author Mavelil
     * @example <caption>Example usage of camNewSpecData method.</caption>
     * updateCameraSpec.camNewSpecData( );
     */

    camNewSpecData : function(){

        var cameraBrandName = document.getElementById('brandname').value;
        var cameraModelName = document.getElementById('modelname').value;
        var cameraHorizontalAOV = document.getElementById('horizontalaov').value;
        var cameraMinHorizontalAOV = document.getElementById('minhorizontalaov').value;
        var cameraImageUrl;
        var cameraCameraType = document.getElementById('cameraType').value;
        var cameraResolutionWidth = document.getElementById('resolutionwidth').value;
        var cameraResolutionHeight = document.getElementById('resolutionheight').value;
        var cameraDefFov = document.getElementById('defaultfov').value;
        var cameraOpticalZoom = document.getElementById('opticalzoom').value;
        var cameraDigitalZoom = document.getElementById('digitalzoom').value;
        var cameraLensType = document.getElementById('lenstype').value;

        var cameraMaxVerticalAOV = document.getElementById('maxverticalaov').value;
        var cameraMinVerticalAOV = document.getElementById('minverticalaov').value;



        if (filesAdd.filesAdd.files[0] == undefined || filesAdd.filesAdd.files[0] == null) {

            cameraImageUrl = "Cam_VX_3PV_B_I.png";
        } else {

            cameraImageUrl = filesAdd.filesAdd.files[0].name;
        }
        if ( cameraBrandName == '' || cameraModelName == '' || cameraBrandName == null || cameraModelName == null || cameraHorizontalAOV == '' || cameraResolutionWidth =='' ||  cameraResolutionHeight == '' ) {

            toastr.error( editor.languageData.SomeDataisMissing );
            return "null";
        }
        else if( (/(^(?:\b|-)([1-9]{1,2}[0]?x|100x)\b)/g).test(cameraOpticalZoom) == false || (/^(?:[1-9]x|0[1-9]x|1[1-5]x|10x)$/g).test(cameraDigitalZoom) == false ){
            toastr.error(editor.languageData.incorrectzoomparameters);
            return "null";
        }
        else {
            var vFOV;
            var idRandom = Math.random();
            idRandom = idRandom * 10000;
            var aspect = cameraResolutionWidth/cameraResolutionHeight;
            if( cameraMaxVerticalAOV == "" || cameraMaxVerticalAOV == null ) {

                vFOV = cameraHorizontalAOV / aspect;
            }
            else{

                vFOV = cameraMaxVerticalAOV;
            }
            var getCamSpec = {
                "id": idRandom,
                "manufacturer": cameraBrandName,
                "model": cameraModelName,
                "model_path": cameraModelName,
                "parent": true,
                "text": cameraBrandName,
                "disabled": true,
                "children": [{
                    "id": idRandom + 1,
                    "manufacturer": cameraBrandName,
                    "model": cameraModelName,
                    "model_path": cameraModelName,
                    "horizontal_aov": cameraHorizontalAOV,
                    "aspect": aspect,
                    "vertical_aov": vFOV,
                    "min_horizontal_aov": cameraMinHorizontalAOV,
                    "max_vertical_aov" : cameraMaxVerticalAOV,
                    "min_vertical_aov" : cameraMinVerticalAOV,
                    "text": cameraBrandName,
                    "zoom_digital":cameraDigitalZoom,
                    "zoom_optical":cameraOpticalZoom,
                    "def_fov": cameraDefFov,
                    "cam_lens": cameraLensType,
                    "resolutionWidth": cameraResolutionWidth,
                    "resolutionHeight": cameraResolutionHeight,
                    "image_url": "assets/img/" + cameraImageUrl,
                    "form_factor": cameraCameraType
                }],
                "image_url": "assets/img/" + cameraImageUrl,
                "form_factor": cameraCameraType
            }
            return (getCamSpec)
        }
    },


    /**
     * sensorNewSpecData( ) -  Method to store the details of a newly created sensor.
	 * @returns {Object} getCamSpec - To store the details of the sensor to send it to db
     * @author Mavelil
     * @example <caption>Example usage of sensorNewSpecData method.</caption>
     * updateCameraSpec.sensorNewSpecData( );
     */

    sensorNewSpecData : function(){

        var sensorBrandName = document.getElementById('sensorBrandname').value;
        var sensorModelName = document.getElementById('sensorModelname').value;
        var sensorHorizontalAOV = document.getElementById('sensorHorizontalaov').value;
        var sensorMinHorizontalAOV = document.getElementById('sensorMinhorizontalaov').value;
        var sensorImageUrl;
        // var sensorSensorType = document.getElementById('cameraType').value;
        var sensorCategory = document.getElementById('sensorCategory').value;
        var sensorResolutionWidth = document.getElementById('sensorResolutionWidth').value;
        var sensorResolutionHeight = document.getElementById('sensorResolutionHeight').value;
        var sensorDefFov = document.getElementById('sensorDefaultfov').value;
        var sensorOpticalZoom = document.getElementById('sensorOpticalzoom').value;
        var sensorDigitalZoom = document.getElementById('sensorDigitalzoom').value;
        var sensorLensType = document.getElementById('sensorLenstype').value;

        var sensorMaxVerticalAOV = document.getElementById('sensorMaxverticalaov').value;
        var sensorMinVerticalAOV = document.getElementById('sensorMinverticalaov').value;


        if (filesAddSensor.filesAddSensor.files[0] == undefined || filesAddSensor.filesAddSensor.files[0] == null) {

            sensorImageUrl = "lidar_lfom5.jpg";
        } else {

            sensorImageUrl = filesAddSensor.filesAddSensor.files[0].name;
        }
        if ( sensorBrandName == '' || sensorModelName == '' || sensorBrandName == null || sensorModelName == null || sensorHorizontalAOV == '' || sensorResolutionWidth =='' ||  sensorResolutionHeight == '' ) {

            toastr.error( editor.languageData.SomeDataisMissing );
            return "null";
        }
        else if( (/(^(?:\b|-)([1-9]{1,2}[0]?x|100x)\b)/g).test(sensorOpticalZoom) == false || (/^(?:[1-9]x|0[1-9]x|1[1-5]x|10x)$/g).test(sensorDigitalZoom) == false ){
            toastr.error(editor.languageData.incorrectzoomparameters);
            return "null";
        }
        else {
            var vFOV;
            var idRandom = Math.random();
            idRandom = idRandom * 10000;
            var aspect = sensorResolutionWidth/sensorResolutionHeight;
            if( sensorMaxVerticalAOV == "" || sensorMaxVerticalAOV == null ) {

                vFOV = sensorHorizontalAOV / aspect;
            }
            else{

                vFOV = sensorMaxVerticalAOV;
            }
            var getSensorSpec = {
                "id": idRandom,
                "manufacturer": sensorBrandName,
                "model": sensorModelName,
                "model_path": sensorModelName,
                "parent": true,
                "text": sensorBrandName,
                "disabled": true,
                "children": [{
                    "id": idRandom + 1,
                    "manufacturer": sensorBrandName,
                    "model": sensorModelName,
                    "model_path": sensorModelName,
                    "horizontal_aov": sensorHorizontalAOV,
                    "aspect": aspect,
                    "vertical_aov": vFOV,
                    "min_horizontal_aov": sensorMinHorizontalAOV,
                    "max_vertical_aov" : sensorMaxVerticalAOV,
                    "min_vertical_aov" : sensorMinVerticalAOV,
                    "text": sensorBrandName,
                    "zoom_digital":sensorDigitalZoom,
                    "zoom_optical":sensorOpticalZoom,
                    "def_fov": sensorDefFov,
                    "cam_lens": sensorLensType,
                    "resolutionWidth": sensorResolutionWidth,
                    "resolutionHeight": sensorResolutionHeight,
                    "image_url": "assets/img/" + sensorImageUrl,
                    "form_factor": "LiDAR",
                    "sensorCategory": sensorCategory
                }],
                "image_url": "assets/img/" + sensorImageUrl,
                "form_factor": "LiDAR"
            }
            return (getSensorSpec)
        }
    },

    /**
     * addindividualSensor( getCamSpec ) -  Method to send the image( if any ) of the newly created sensor into the server.
     * @param { Object } getSensorSpec - Details of the camera. 
	 * @returns {Void} 
     * @author Mavelil
     * @example <caption>Example usage of addindividualSensor method.</caption>
     * updateCameraSpec.addindividualSensor( getCamSpec );
     */

    addindividualSensor : function( getSensorSpec ){

        var scope = this ; 
        if (getSensorSpec == "null") {
            return;
        }
        var userId = localStorage.getItem('U_ID');
        var sensorSpecData = {};
        sensorSpecData.user = userId;
        sensorSpecData.spec = getSensorSpec;
        var Data = new FormData();
        var fileJson = filesAddSensor.filesAddSensor.files[0];
        Data.append('file', fileJson);
        if (filesAddSensor.filesAddSensor.files[0] == undefined || filesAddSensor.filesAddSensor.files[0] == null) {

            scope.createNewSensorUseSpec(sensorSpecData);

        } else {

            $.ajax({
                url: editor.api + 'cameraSpec/users/update/img',
                type: "POST",
                processData: false,
                contentType: false,
                data: Data,
                success: function(result) {

                    scope.createNewSensorUseSpec(sensorSpecData);


                },
                error: function(err) {
                    toastr.error('Somthing went wrong try again !!!');
                    console.log(err);
                }
            });

        }

    },


      /**
     * createNewSensorUseSpec( cameraSpecData ) -  Method to send the details of the newly created camera into the server.
     * @param { Object } cameraSpecData - Details of the camera. 
	 * @returns {Void} 
     * @author Mavelil
     * @example <caption>Example usage of createNewCameraUseSpec method.</caption>
     * updateCameraSpec.createNewCameraUseSpec( cameraSpecData );
     */

    createNewSensorUseSpec : function ( cameraSpecData ){

        $.ajax({

            url: editor.api + 'addCameraSpec',
            type: "POST",
            contentType: 'application/json',
            processData: false,
            data: JSON.stringify(cameraSpecData),
            success: function(result) {
                document.getElementById('filesAddSensor').value = null;
                cardthumpimgAdd.src = 'assets/img/lidar_black_256.png'
                toastr.info( editor.languageData.YourNewSpecIsUpdated );
                var element = document.getElementById("select-sensor-model");
                element.remove();
                editor.signals.specUpdateCompleteSensor.dispatch();
                document.getElementById('sensorBrandname').value = "";
                document.getElementById('sensorModelname').value = "";
            },
            error: function(err) {
                toastr.error('Somthing went wrong try again !!!');
                console.log(err);
            }

        });
    },

     /**
     * addindividualCamera( getCamSpec ) -  Method to send the image( if any ) of the newly created camera into the server.
     * @param { Object } getCamSpec - Details of the camera. 
	 * @returns {Void} 
     * @author Mavelil
     * @example <caption>Example usage of addindividualCamera method.</caption>
     * updateCameraSpec.addindividualCamera( getCamSpec );
     */

    addindividualCamera : function( getCamSpec ){

        var scope = this ; 
        if (getCamSpec == "null") {
            return;
        }
        var userId = localStorage.getItem('U_ID');
        var cameraSpecData = {};
        cameraSpecData.user = userId;
        cameraSpecData.spec = getCamSpec;
        var Data = new FormData();
        var fileJson = filesAdd.filesAdd.files[0];
        Data.append('file', fileJson);
        if (filesAdd.filesAdd.files[0] == undefined || filesAdd.filesAdd.files[0] == null) {

            scope.createNewCameraUseSpec(cameraSpecData);

        } else {

            $.ajax({
                url: editor.api + 'cameraSpec/users/update/img',
                type: "POST",
                processData: false,
                contentType: false,
                data: Data,
                success: function(result) {

                    scope.createNewCameraUseSpec(cameraSpecData);


                },
                error: function(err) {
                    toastr.error('Somthing went wrong try again !!!');
                    console.log(err);
                }
            });

        }

    },

    /**
     * createNewCameraUseSpec( cameraSpecData ) -  Method to send the details of the newly created camera into the server.
     * @param { Object } cameraSpecData - Details of the camera. 
	 * @returns {Void} 
     * @author Mavelil
     * @example <caption>Example usage of createNewCameraUseSpec method.</caption>
     * updateCameraSpec.createNewCameraUseSpec( cameraSpecData );
     */

    createNewCameraUseSpec : function ( cameraSpecData ){

        $.ajax({

            url: editor.api + 'addCameraSpec',
            type: "POST",
            contentType: 'application/json',
            processData: false,
            data: JSON.stringify(cameraSpecData),
            success: function(result) {
                document.getElementById('filesAdd').value = null;
                cardthumpimgAdd.src = 'assets/img/Cam_VX_3PV_B_I.png'
                toastr.info( editor.languageData.YourNewSpecIsUpdated );
                var element = document.getElementById("select-camera-model");
                element.remove();
                editor.signals.specUpdateComplete.dispatch();
                document.getElementById('brandname').value = "";
                document.getElementById('modelname').value = "";
            },
            error: function(err) {
                toastr.error('Somthing went wrong try again !!!');
                console.log(err);
            }

        });
    },

    /**
     * cameraSpecSubmit( ) -  Method to add camera spec details from a file.
     * @returns {Void} 
     * @author Mavelil
     * @example <caption>Example usage of cameraSpecSubmit method.</caption>
     * updateCameraSpec.cameraSpecSubmit( );
     */

    cameraSpecSubmit : function() {

        var scope = this ;
        var fileDAta = document.getElementById("addFileInput").files[0];
        //console.log(fileDAta.name);
        var checkData  = this.checkSpecialCharater(fileDAta.name);
        if(checkData){
            var fds = new FormData()
            fds.append('file', fileDAta);
            var sendFile = new ApiHandler();
            sendFile.prepareRequest({
                method: 'POST',
                url: editor.api + 'addCameraSpecFromFile/' + localStorage.getItem('U_ID'),
                responseType: 'json',
                isDownload: false,
                formDataNeeded: true,
                formData: fds
            });
            sendFile.onStateChange(function(response) {

                toastr.info(response.body.message);
                var element = document.getElementById("select-camera-model");
                element.remove();
                scope.editor.signals.specUpdateComplete.dispatch();

             }, function(error) {

                    console.log(error);

            });
            sendFile.sendRequest();
        }
        else{

            toastr.error("Remove the special characters and white space from the file name");
        }
        

    },

    /**
     * getAllCameraInDb( ) -  Method to read all the camera details in the db.
     * @returns {Object<Promise>} 
     * @author Mavelil
     * @example <caption>Example usage of getAllCameraInDb method.</caption>
     * updateCameraSpec.getAllCameraInDb( );
     */

    getAllCameraInDb : function(){
            
        return new Promise (function(resolve,reject){
            var getcameraSpeclist = new ApiHandler();
            getcameraSpeclist.prepareRequest({
                method: 'GET',
                url: editor.api + 'cameraSpec/users/' + localStorage.getItem('U_ID'),
                responseType: 'json',
                isDownload: false,
                formDataNeeded: false,
                formData: ''
            });
            getcameraSpeclist.onStateChange(function(result) {
    
               
                var camData = result;
                editor.allCameras = camData;
                // editor.allCameras = editor.allSensors = new Array()

                // camData.forEach(device => {
                //     if(device.children[0].sensorCategory == null || device.children[0].sensorCategory == undefined){
                //         editor.allCameras.push(device);
                //     } else {
                //         editor.allSensors.push(device);
                //     }
                // });

                editor.signals.newCameraSpec.dispatch();
                resolve( camData )
    
            }, function(response) {
    
                //request failed
                console.log(response);
                reject ( response );
    
            });
            getcameraSpeclist.sendRequest();
        })
    },
    getAllSensorInDb : function(){
            
        return new Promise (function(resolve,reject){
            var getcameraSpeclist = new ApiHandler();
            getcameraSpeclist.prepareRequest({
                method: 'GET',
                url: editor.api + 'cameraSpec/users/' + localStorage.getItem('U_ID'),
                responseType: 'json',
                isDownload: false,
                formDataNeeded: false,
                formData: ''
            });
            getcameraSpeclist.onStateChange(function(result) {
    
               
                var camData = result;
                editor.allCameras = camData;

                // editor.allCameras = editor.allSensors = new Array()

                // camData.forEach(device => {
                //     if(device.children[0].sensorCategory == null || device.children[0].sensorCategory == undefined){  
                //         editor.allCameras.push(device);
                //     } else {
                //         editor.allSensors.push(device);
                //     }
                // });

                editor.signals.newCameraSpec.dispatch();
                resolve( camData )
    
            }, function(response) {
    
                //request failed
                console.log(response);
                reject ( response );
    
            });
            getcameraSpeclist.sendRequest();
        })
    },
    
    /**
     * createCameraModalUseNewCamera( Selectcamera ) -  Method to show the modal for creating a new camera.
     * @param {Object<SelectedCamera>} Selectcamera - Instance of class SelectedCamera
     * @returns {Object<Promise>} 
     * @author Mavelil
     * @example <caption>Example usage of createCameraModalUseNewCamera method.</caption>
     * updateCameraSpec.createCameraModalUseNewCamera( Selectcamera );
     */

    createCameraModalUseNewCamera : function (Selectcamera){
        return new Promise(function(resolve,reject){

            var scope = this ;
            var modalcamera = Selectcamera.createmodal();
            document.getElementById('editorElement').appendChild(modalcamera.dom);
            Selectcamera.hideModelAndDetails();
            scope.editor.getSelectedCameraModel = Selectcamera.getModelName();
            scope.editor.getSelectedCameraBrand = Selectcamera.getBrandName(); 
            resolve(modalcamera)

        })
       
    },

    /**
     * removeCamera( editCamData ) -  Method to remove a camera from the db.
     * @param {Object<THREE.PerspectiveCamera>} editCamData - Camera to be deleted from the db
     * @returns {Void} 
     * @author Mavelil
     * @example <caption>Example usage of removeCamera method.</caption>
     * updateCameraSpec.removeCamera( editCamData );
     */

    removeCamera : function ( editCamData  ) {

        var user_id = localStorage.getItem('U_ID');
        var camera_id = editCamData.camereaDetails.id;
        var cameraSpecDataupdate = {};
        cameraSpecDataupdate.userId = user_id;
        cameraSpecDataupdate.cameraId = camera_id;	
        if (confirm( editor.languageData.DoYouWanttoRemovethisCamera )) {

            $.ajax({
                url: editor.api + 'cameraSpec/users/remove/',
                type: "POST",
                contentType: 'application/json',
                processData: false,
                data: JSON.stringify(cameraSpecDataupdate),
                success: function(result) {

                    toastr.info( editor.languageData[result] );
                    var element = document.getElementById("select-camera-model");
                    element.remove();
                    
                    editor.signals.specUpdateComplete.dispatch();



                },
                error: function(err) {
                    toastr.error('Somthing went wrong try again !!!');
                    console.log(err);
                }
            });

        } else {

            return;

        }

    },

    removeSensor : function ( editCamData  ) {

        var user_id = localStorage.getItem('U_ID');
        var camera_id = editCamData.camereaDetails.id;
        var cameraSpecDataupdate = {};
        cameraSpecDataupdate.userId = user_id;
        cameraSpecDataupdate.cameraId = camera_id;	
        if (confirm( editor.languageData.DoYouWanttoRemovethisSensor )) {

            $.ajax({
                url: editor.api + 'cameraSpec/users/remove/',
                type: "POST",
                contentType: 'application/json',
                processData: false,
                data: JSON.stringify(cameraSpecDataupdate),
                success: function(result) {

                    toastr.info( editor.languageData[result] );
                    var element = document.getElementById("select-sensor-model");
                    element.remove();
                    
                    editor.signals.specUpdateCompleteSensor.dispatch();



                },
                error: function(err) {
                    toastr.error('Somthing went wrong try again !!!');
                    console.log(err);
                }
            });

        } else {

            return;

        }

    },

    /**
     * updateCameraFromData( editCamData ) -  Method to add the image( if any ) of the edited camera into the server.
     * @param {Object<THREE.PerspectiveCamera>} editCamData - Camera that has to be edited
     * @returns {Void} 
     * @author Mavelil
     * @example <caption>Example usage of updateCameraFromData method.</caption>
     * updateCameraSpec.updateCameraFromData( editCamData );
     */

    updateCameraFromData : function( editCamData ){
        var scope = this ;
        var getCamSpec = scope.camNewSpecDataUpdate()
        if (getCamSpec == "null") {
            return;
        } 
        else {
            getCamSpec.id = editCamData.camereaDetails.id;
            getCamSpec.children[0].id = editCamData.camereaDetails.id + 1;
            var userId = localStorage.getItem('U_ID');
            var cameraSpecDataupdate = {};
            cameraSpecDataupdate.user = userId;
            cameraSpecDataupdate.spec = getCamSpec;
            var Data = new FormData();
            var dataJson = JSON.stringify(getCamSpec);
            var fileJson = filesEdit.files[0];
            Data.append('file', fileJson);
            if (fileJson == undefined || fileJson == null) {

                scope.updateCameraEditData(cameraSpecDataupdate);
            } else {

                $.ajax({
                    url: editor.api + 'cameraSpec/users/update/img',
                    type: "POST",
                    processData: false,
                    contentType: false,
                    data: Data,
                    success: function(result) {

                        scope.updateCameraEditData(cameraSpecDataupdate);

                    },
                    error: function(err) {

                        toastr.error('Somthing went wrong try again !!!');
                        console.log(err);
                    }
                });
            }
        }
    },

    updateSensorFromData : function( editCamData ){
        var scope = this ;
        var getCamSpec = scope.camNewSensorSpecDataUpdate()
        if (getCamSpec == "null") {
            return;
        } 
        else {
            getCamSpec.id = editCamData.camereaDetails.id;
            getCamSpec.children[0].id = editCamData.camereaDetails.id + 1;
            var userId = localStorage.getItem('U_ID');
            var cameraSpecDataupdate = {};
            cameraSpecDataupdate.user = userId;
            cameraSpecDataupdate.spec = getCamSpec;
            var Data = new FormData();
            var dataJson = JSON.stringify(getCamSpec);
            var fileJson = filesEditSensor.files[0];
            Data.append('file', fileJson);
            if (fileJson == undefined || fileJson == null) {

                scope.updateSensorEditData(cameraSpecDataupdate);
            } else {

                $.ajax({
                    url: editor.api + 'cameraSpec/users/update/img',
                    type: "POST",
                    processData: false,
                    contentType: false,
                    data: Data,
                    success: function(result) {

                        scope.updateSensorEditData(cameraSpecDataupdate);

                    },
                    error: function(err) {

                        toastr.error('Somthing went wrong try again !!!');
                        console.log(err);
                    }
                });
            }
        }
    },

    /**
     * checkSpecialCharater( str ) -  Method to check if any special characters in the string.
     * @param {String} str - String to be checked for special characters
     * @returns {Boolean} 
     * @author Mavelil
     * @example <caption>Example usage of checkSpecialCharater method.</caption>
     * updateCameraSpec.checkSpecialCharater( str );
     */

    checkSpecialCharater : function(str){

        return !/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?\s]/g.test(str);
    }
    
}