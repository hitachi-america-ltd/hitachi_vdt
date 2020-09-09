Menubar.MatterportAssets = function( editor ) {

    var floorplanImage = new FloorplanImage();
    var threeSixtyImage = new ThreeSixtyImage();
    var container = new UI.Panel();
    container.setClass('menu');
    container.setId('matterport-container-id');
    
    var title = new UI.Panel();
    title.setClass('title');
    title.setId('matterport-asset-id');
    title.setTextContent(editor.languageData.Matterport);
    container.add(title);
    
    var options = new UI.Panel();
    options.setClass( 'options' );
    container.add( options );
    
    //Floorplan Images
    var Floorplan = new UI.Row();
    Floorplan.setClass('option');
    Floorplan.setTextContent(editor.languageData.Floorplan);
    Floorplan.setId('floorplanImage');
    Floorplan.onClick(function() {

        if((editor.scene.userData.matterportParameters != undefined) && (editor.scene.userData.matterportParameters != null)) {
    
            floorplanImage.addClassToElement('floorplanImage','selectMenubar');
            floorplanImage.getFloorplanImage().then((floorplanImages)=>{
                var floorPlanLength = floorplanImages.length;
                if (floorPlanLength !== 0) {
                    floorplanImage.showFloorplanImageModal();
                    floorplanImage.createModelForFloorplanImage(floorplanImages);
                } else {
                    floorplanImage.removeClassFromElement('floorplanImage', 'selectMenubar');
                    toastr.error(editor.languageData.NoFloorplanImages);
                }
            }).catch((error)=>{
                console.log(error);
            
            });
        } else{
            toastr.info(editor.languageData.Youhavetobeinaprojectfloorplan);
        }
    });

    //MATTERPORT VIDEO PLAYER BUTTON START//

    var videoPlayer = new UI.Row();
    videoPlayer.setClass('option');
    videoPlayer.setTextContent(editor.languageData.videoPlayer);
    videoPlayer.setId('video-player-matterport');
	
	var videoModalContainer = document.createElement("div");

	var videoPlayerModal = new UI.bootstrapModal("", "video-player-modal", editor.languageData.videoPlayer , videoModalContainer, "Open", editor.languageData.Cancel, "video-player-modal-form");
	videoPlayerModal.hideFooterSuccessButton();
	document.getElementById('editorElement').appendChild( videoPlayerModal.dom );
	
	videoPlayer.onClick( function(){
        
        if((editor.activeProject._id == undefined) && (localStorage.getItem("model_id") == null)) {

            toastr.info(editor.languageData.Youhavetobeinaprojectmatterport);

        } else if((editor.activeProject._id == undefined) && (editor.scene.userData.matterportParameters == undefined)) {

            toastr.info(editor.languageData.Youhavetobeinaprojectmatterport);

        }else if((localStorage.getItem("model_id") == null) && (editor.scene.userData.matterportParameters == undefined)){
            
            toastr.info(editor.languageData.Youdonthaveavideoforthisprojecttobeplayed);

        } else if((editor.activeProject) || (localStorage.getItem("model_id")) || (editor.scene.userData.matterportParameters.info.modelId)){

            if(!document.getElementById("video-player-id")){

                var videoBodyDiv = document.createElement("div");
                videoBodyDiv.className = "modal-body";
                videoBodyDiv.id = "video-player-id";
        
                var videoCanvas = document.createElement("video");
                videoCanvas.className = "video-modal-canvas";
                videoCanvas.controls = true;
        
                var videoSource = document.createElement("source");

                if( editor.scene.userData.matterportParameters != undefined ){

                    var link = editor.scene.userData.matterportParameters.info.details.assets.clips[1].url;
                    videoSource.src = link;
                    videoSource.type = "video/mp4"; 
                    videoCanvas.appendChild(videoSource);
                    videoBodyDiv.appendChild(videoCanvas);
                    videoModalContainer.appendChild(videoBodyDiv);
                    videoPlayerModal.show();
                }
                else{

                    toastr.info(editor.languageData.Youdonthaveavideoforthisprojecttobeplayed);

                }
                
            } else{
    
                videoPlayerModal.show();
    
            }
        } else{
            toastr.info(editor.languageData.Youhavetobeinaprojectmatterport)
        }
	} );

    //MATTERPORT VIDEO PLAYER BUTTON END//
    
    //360 Images
    var ThreeSixty = new UI.Row();
    ThreeSixty.setClass('option');
    ThreeSixty.setTextContent(editor.languageData.Images360);
    ThreeSixty.setId('threeSixtyImage');
    ThreeSixty.onClick(function () {

        if((editor.scene.userData.matterportParameters != undefined) && (editor.scene.userData.matterportParameters != null)) {
        
            threeSixtyImage.addClassToElement('threeSixtyImage','selectMenubar');
            threeSixtyImage.getThreeSixtyImage().then((threeSixtyImages) => {

                var threeSixtyLength = threeSixtyImages.length;
                if (threeSixtyLength!=0) {

                    threeSixtyImage.createModelForThreeSixtyImage(threeSixtyImages)
                    threeSixtyImage.showThreeSixtyImageModal();

                } else {
                
                    threeSixtyImage.removeClassFromElement('threeSixtyImage', 'selectMenubar');
                    toastr.error(editor.languageData.No360Images);

                }

            }).catch((error)=>{
                console.log(error);
            })
        } else {
            toastr.info(editor.languageData.Youhavetobeinaproject360image)
        }
    
    });
    
    options.add(Floorplan);
    options.add(ThreeSixty);
    options.add(videoPlayer);
    
    let defaultBodyContent = document.createElement('div');
    
    let openMatterportView = new UI.bootstrapModal("", "matterport-iframe", "Interactive Tour" , defaultBodyContent, editor.languageData.Open, editor.languageData.Cancel , "matterport-iframe-view");
    openMatterportView.hideFooterButtons();
    openMatterportView.makeLargeModal();

    document.getElementById('editorElement').appendChild(openMatterportView.dom);

    var virualTour = new UI.Row();
    virualTour.setClass('option');
    virualTour.setTextContent(editor.languageData.VirtualTour);
    virualTour.setId('model-virtual-tour');
    virualTour.onClick(function(){

        if(editor.scene.userData.matterportParameters != undefined) {

            if(document.getElementById("matterportIframe") == undefined) {
                let matterportIframe = document.createElement('iframe');
                matterportIframe.src = "https://my.matterport.com/show/?m=" + editor.scene.userData.matterportParameters.info.modelId;
                matterportIframe.id = "matterportIframe";
                matterportIframe.width = "1024";
                matterportIframe.height= "512";
                matterportIframe.frameborder = "0";
                matterportIframe.allow = 'vr';
                matterportIframe.allowFullscreen = true;
                defaultBodyContent.appendChild(matterportIframe);
            }
            openMatterportView.show()
            
        } else {
            toastr.info(editor.languageData.Youhavetobeinaprojectmatterport)
        }
    });

    options.add(virualTour)

    var matterportTags = new UI.Row();
    matterportTags.setClass('option');
    matterportTags.setTextContent(editor.languageData.MatterportTags);

    matterportTags.onClick(function () {

        if(editor.scene.userData.matterportParameters != null && editor.scene.userData.matterportParameters != undefined) {
            $.ajax({
                url: editor.api + 'matterport/models/mattertags/' + editor.scene.userData.matterportParameters.info.modelId,
                type: 'GET',
                dataType: 'json',
                success: function (response) {
                    var data = response;
                    var rowCount, number;
                    var scope = this;
                    this.data = data;
                    this.dataLength = data.length;
                    this.row = 0;
        
                    for (var i = 0; i < this.dataLength; i++) {
                        this.addNewRow = i % 4;
                        if (!this.addNewRow) {
                            this.row = this.row + 1;
                            this.rowDiv = document.createElement('div');
                            this.rowDiv.className = 'row';
                            this.rowDiv.id = 'row' + this.row;
        
                        } 
                        outerDivForImage(this.row, i);
                    }

                    function outerDivForImage(rowCount, number) {
        
        
                        this.outerMainDiv = document.createElement('div');
                        this.outerMainDiv.className = 'col-sm-12 col-md-4 matterporttag'
                        this.outerMainDiv.id = 'maindiv' + number;
                        bodyForImage(rowCount, number);
        
                    }

                    function bodyForImage(rowCount, number) {
        
        
                        this.bodyForImageDiv = document.createElement('div');
                        this.bodyForImageDiv.className = 'w3-card-4 user-image-card-3d btn-group matterportsize ';
                        this.bodyForImageDiv.id = 'secondDiv' + number;
                        setImageToBody(rowCount, number);
        
                    }

                    function setImageToBody(rowCount, number) {
        
                        this.iframe = document.createElement('iframe');
        
                        if (data[number].media.slice(0,24) == 'https://www.youtube.com/') {
        
                            this.iframe.src = data[number].media.slice(0, 24) + 'embed/' + data[number].media.slice(32);
                            this.iframe.className = 'thumbnail-3D enlargeScreenshot';
        
                        }
                        else {
        
                            this.iframe.src = data[number].media
                            this.iframe.className = 'thumbnail-3D enlargeScreenshot ';
        
                        }
                        showNameOfMatterport(rowCount, number)
                    }

                    function showNameOfMatterport(rowCount, number) {
        
                        this.nameDiv = document.createElement('div');
                        this.nameDiv.className = 'w3-container w3-center user-details-card form-group overfolwfilename matterporttag';
                        this.nameDiv.id = "namediv" + number;
                        this.nameDiv.innerHTML = "Name : " + data[number].label;
                        showDescription(rowCount,number)
        
                    }

                    function showDescription(rowCount, number) {
        
                        this.descriptionDiv = document.createElement('div');
                        this.descriptionDiv.className = 'w3-container w3-center user-details-card form-group overfolwfilename ';
                        this.descriptionDiv.id = "namediv" + number;
                        this.descriptionDiv.innerHTML = "Description : " + data[number].description;
                        appendToModal(rowCount, number);
        
                    }
        
                    function appendToModal(rowCount, number) {
        
                        var modalDiv = document.getElementById('mainbody');
                        modalDiv.appendChild(scope.rowDiv);
        
                        var findRow = document.getElementById('row' + rowCount);
                        findRow.appendChild(this.outerMainDiv);
        
                        var appendMainBody = document.getElementById('maindiv' + number);
                        appendMainBody.appendChild(this.bodyForImageDiv);
        
                        var imageappend = document.getElementById('secondDiv' + number);
                        imageappend.appendChild(this.iframe);
                        imageappend.appendChild(this.nameDiv);
                        imageappend.appendChild(this.descriptionDiv);
                    }
                }
            })
            $('#matterportTags').modal('show');
        } else {
            toastr.info(editor.languageData.Youhavetobeinaprojectmatterport)
        }
    })
    options.add(matterportTags);
    
    return container;
    };