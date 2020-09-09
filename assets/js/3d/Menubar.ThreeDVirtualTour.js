Menubar.ThreeDVirtualTour = function ( editor ) {

	var container = new UI.Panel();
	container.setClass( 'menu' );

    let defaultBodyContent = document.createElement('div');
    
    let openMatterportView = new UI.bootstrapModal("", "matterport-iframe", "Interactive Tour" , defaultBodyContent, editor.languageData.Open, editor.languageData.Cancel , "matterport-iframe-view");
    openMatterportView.hideFooterButtons();
    openMatterportView.makeLargeModal();

    document.getElementById('editorElement').appendChild(openMatterportView.dom);

	var virualTour = new UI.Panel();
    virualTour.setClass('title');
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
    container.add( virualTour );

	return container;
	

};