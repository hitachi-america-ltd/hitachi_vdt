var EditCameraDetails = function(cameraData){

    this.camereaDetails = cameraData.camdata;
    this.editModel = cameraData.model;
    return this;

}
EditCameraDetails.prototype = {

    setallSensorDAta : function(){

        var scope = this;
        var cam = scope.camereaDetails;
        document.getElementById('sensorBrandnameUpdate').value = cam.manufacturer;
        document.getElementById('sensorModelnameUpdate').value = cam.model;
        document.getElementById('sensorHorizontalaovUpdate').value = cam.children[0].horizontal_aov;
        document.getElementById('sensorMinhorizontalaovUpdate').value = cam.children[0].min_horizontal_aov;
        //document.getElementById('cameraTypeUpdate').value = cam.children[0].form_factor;
        document.getElementById('sensorCategoryUpdate').value = cam.children[0].sensorCategory;
        document.getElementById('cardthumpimgEditSensor').src = cam.image_url;  
        document.getElementById('sensorResolutionWidthUpdate').value = cam.children[0].resolutionWidth;
        document.getElementById('sensorResolutionHeightUpdate').value = cam.children[0].resolutionHeight;
        document.getElementById('sensorDefaultfovUpdate').value = cam.children[0].def_fov;
        document.getElementById('sensorOpticalzoomUpdate').value = cam.children[0].zoom_optical;
        document.getElementById('sensorDigitalzoomUpdate').value = cam.children[0].zoom_digital;
        document.getElementById('sensorLenstypeUpdate').value = cam.children[0].cam_lens;

        document.getElementById('sensorMaxverticalaovUpdate').value = cam.children[0].max_vertical_aov;
        document.getElementById('sensorMinverticalaovUpdate').value = cam.children[0].min_vertical_aov;

        //scope.showModel();

    },

    setallDAta : function(){

        var scope = this;
        var cam = scope.camereaDetails;
        document.getElementById('brandnameUpdate').value = cam.manufacturer;
        document.getElementById('modelnameUpdate').value = cam.model;
        document.getElementById('horizontalaovUpdate').value = cam.children[0].horizontal_aov;
        document.getElementById('minhorizontalaovUpdate').value = cam.children[0].min_horizontal_aov;
        document.getElementById('cameraTypeUpdate').value = cam.children[0].form_factor;
        document.getElementById('cardthumpimgEdit').src = cam.image_url;  
        document.getElementById('resolutionwidthUpdate').value = cam.children[0].resolutionWidth;
        document.getElementById('resolutionheightUpdate').value = cam.children[0].resolutionHeight;
        document.getElementById('defaultfovUpdate').value = cam.children[0].def_fov;
        document.getElementById('opticalzoomUpdate').value = cam.children[0].zoom_optical;
        document.getElementById('digitalzoomUpdate').value = cam.children[0].zoom_digital;
        document.getElementById('lenstypeUpdate').value = cam.children[0].cam_lens;

        document.getElementById('maxverticalaovUpdate').value = cam.children[0].max_vertical_aov;
        document.getElementById('minverticalaovUpdate').value = cam.children[0].min_vertical_aov;

    },
    showModel : function(){

        var scope = this;
        
        document.getElementById('RemoveaddspeceachCameraSubmit').style.display= "block";
        document.getElementById('UpdateaddspeceachCameraSubmit').style.display= "block";
        document.getElementById('addspeceachCameraSubmit').style.display= "none";
        document.getElementById('addxmlfile').style.display= "none";
        document.getElementById('addeachspeccam').style.display= "none";
        scope.editModel.show();
        document.getElementById('addeachspeccam').click();
    } 



}