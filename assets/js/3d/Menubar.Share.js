Menubar.Share = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Panel();
	container.setClass( 'menu' );

	


	var title = new UI.Panel();
	title.setClass( 'title' );
	title.setId('publish');
	title.setTextContent( 'Publish' );
	title.onClick( function () {
		$("#premm").modal("show");
		document.getElementById('urlid').style.display='none';
		document.getElementById("uploadsharebutton").disabled = false;
		//element.style.display = 'none'; 
		

	} );
	$( ".premshareupload" ).click(function() {
	 
	 var file= document.getElementById('sharefile').files[0];
	 var name=file.name.replace(/^.*\./, '');
	 if (name == 'zip' || name == 'json' || name == 'obj' || name == '3ds' || name == 'dwg' || name == 'dxf'){
	 var fd = new FormData();
	 fd.append('file', file);
	 if (file!=null){
		if(file.size <21000000)
			{
	 					 var uid = localStorage.getItem('U_ID');
	 					$.ajax({
							url: editor.api+'editorload/'+uid,
							type: 'POST',
							contentType: false,
							processData: false,
							data: fd,
							success: function (response) {
								document.getElementById("urlinput").value = editor.webroot+'#/share/'+response;
								document.getElementById('urlid').style.display='block';
								document.getElementById("uploadsharebutton").disabled = true;
								document.getElementById('urlid').value=response;
								var path=response;
							},
							error: function (jqxhr, status, msg) {
								//error code
							}
						});
			}	
			else{
					
					alert('Size limit exceeded');
				
				}		


	 }
	 else{
	 		toastr.error("please select a file");
           	toastr.css = "toast-css";
		//alert('please select a file');
	 }
	}
	else{
		toastr.error("File not supported");
           	toastr.css = "toast-css";
		//alert ('please select the 3D model ');
	}

	});
	container.add( title );

	return container;

};
