Menubar.ParkingLotImage = function(editor) {


    var defaultBodyContent = document.createElement('div');
    defaultBodyContent.id = "open-parkinglotimage-modal-body";
    var openParkingLotImage = new UI.bootstrapModal("", "parking-lot-image", editor.languageData.YourParkingLotImage , defaultBodyContent, editor.languageData.Open, editor.languageData.Cancel , "parking-lot-image-form");
    openParkingLotImage.hideFooterButtons();
    openParkingLotImage.makeLargeModal();
    document.getElementById('editorElement').appendChild(openParkingLotImage.dom);

    var container = new UI.Panel();
    container.setClass('menu');
    var title = new UI.Panel();
    title.setClass('title');
    title.setId('parking_lot_image');
    //title.setStyle('display',['none']);
    title.setTextContent(editor.languageData.ParkingLotImage);
    title.onClick(function() {
        
        //openParkingLotImage.show();

        var openParkingLobImg = function(paramsArray){
            
                var parkinglobImageData = paramsArray[0];
                var imageUrl = editor.path +parkinglobImageData.path;
                //var imagetoBlob = new ApiHandler();
                var downloadImage = new ApiHandler();
                 downloadImage.prepareRequest({
                    method: 'GET',
                    url: imageUrl,
                    responseType: 'blob',
                    isDownload: true,
                    formDataNeeded: false,
                    formData: ''
                });
                downloadImage.onStateChange(function(response) {
                    
                    //alert("OK");
                    console.log(response);
                    response.name = parkinglobImageData.name+'.png';
                    editor.loader.loadFile(response);
                    openParkingLotImage.hide();
                    
                    
                }, function(error) {
            
                     console.log(error);
            
                });
                downloadImage.sendRequest();
                
            
            
            
            }

        var onDeleteParkingClick = function(paramsArray) {
            
            
            
               var parkinglobimg = paramsArray[0];
               var parkinglobimgDomElement = paramsArray[1];
               var deleteParkingLobImg = new ApiHandler();
               deleteParkingLobImg.prepareRequest({
            
                   method: 'GET',
                   url: editor.api + 'location/trash/' + parkinglobimg._id,
                   responseType: 'json',
                   isDownload: false,
                   formDataNeeded: false,
                   formData: null
            
               });
               deleteParkingLobImg.onStateChange(function(response) {
            
                    var cardToRemove = document.getElementById(parkinglobimgDomElement.dom.id);
                        if (cardToRemove) {
            
                            var parent = cardToRemove.parentNode;
                            parent.removeChild(cardToRemove);
            
                        }
                    toastr.success( editor.languageData.ParkinglotImageremovedsuccessfully );
            
                   },function(error) {
            
                    console.log(error);
                    toastr.error(editor.languageDataSorrysomethingwentwrongPleasetryagainaftersometime);
            
                });
            
               //Progress trackers for the http request
                
                    deleteParkingLobImg.sendRequest();
            
            }

        var genParkingLotImage = function() {
            
               var parkingLotImage, parkingLotImageCount = 0;
               var parkingLotImageModalBody = document.createElement('div');
               parkingLotImageModalBody.className = 'row';
               
               var defaultModalBodyContent = document.createElement('div');
               defaultModalBodyContent.setAttribute('class', 'text-center');
               defaultModalBodyContent.setAttribute('style', 'font-size: 20px; color: #b5afaf');
               defaultModalBodyContent.innerHTML = ' <strong> '+editor.languageData.Nothingtoshowhere
               +'</strong>';
               var genParkingLotImageList = new ApiHandler();
                   genParkingLotImageList.prepareRequest({
                       method: 'GET',
                       url: editor.api + 'location/users/' + localStorage.getItem('U_ID'),
                       responseType: 'json',
                       isDownload: false,
                       formDataNeeded: false,
                       formData: ''
               });
                genParkingLotImageList.onStateChange(function(result) {
           
                    if (result !== undefined) {
                        parkingLotImage = result;
                        if (parkingLotImage.length != 0) {
                            parkingLotImage.forEach(function(imageData) {
           
                                if (imageData !== undefined) {
                                    console.log( editor.path +imageData.path);
                                    var img =  editor.path +'/projects3d/'+localStorage.getItem("U_ID")+ '/maplocations/'+imageData.name+'.png'	;
                                    var cardFooterValue = (imageData.updated_at != undefined && project.updated_at != null) ? imageData.updated_at : imageData.created_at;
                                    var card = new UI.BootstrapCard('open-project-card-' + parkingLotImageCount, imageData.name, " ", editor.languageData.Open, editor.languageData.Delete, cardFooterValue);
                                    card.setWraperClass(' col-sm-3');
                                    card.setWraperStyle('border: 1px solid #cccccc;padding-left: 0px;padding-right: 0px;');
                                    card.setHeaderStyle('font-size: 21px;background-color: #e0e0e0;border-bottom: 1px solid #cccccc;overflow: hidden;text-overflow: clip;');
                                    card.setBodyStyle('padding-top: 18px;');
                                    card.setBodyStyle('background-image :url('+img+');height: 70px;')
                                    card.setFooterStyle('padding-top: 10px;margin-top: 10px;font-size: 12px;border-top: 1px solid #cccccc;background-color: #e0e0e0;');
                                    card.setSubmitCallback(openParkingLobImg, [imageData, card]);
                                    card.setCancelCallback(onDeleteParkingClick, [imageData, card]);
                                    parkingLotImageModalBody.appendChild(card.dom);
           
                                }
                                parkingLotImageCount++;
           
                            });
                            openParkingLotImage.setModalBody(parkingLotImageModalBody);
           
                        } else {
                            openParkingLotImage.setModalBody(defaultModalBodyContent);
                        }
                        openParkingLotImage.show();
                    } else {
                        openParkingLotImage.setModalBody(defaultModalBodyContent);
                        openParkingLotImage.show();
                    }
           
                   }, function(response) {
           
                    //request failed
                    console.log(response);
           
               });
               genParkingLotImageList.sendRequest();
            };	

            genParkingLotImage();
    });
    container.add(title);

    return container;

};