/**
 * SanpshotList( editor ) - Constructor function for managing the snapshots.
 * @constructor
 * @param {any} editor - The instance of the Editor which manages the overall objects and signals
 * @author Mavelil
 * @returns {Void}
 * @example <caption>Example usage of SanpshotList</caption>
 * var sanpshotList = new SanpshotList( editor );
 */

var SanpshotList = function (editor) {

	this.editor = editor;
	this.uid = localStorage.getItem('U_ID');
	this.modelReportData();
	this.imageTrace = new ImageTracer();

}
SanpshotList.prototype = {

	/**
     * addClassToElement( id , className ) - Method to assing a CSS Class name to a particular element with specified ID.
	 * @param {String} id - ID of the DOM element to which the class has to be assigned
	 * @param {String} className - Class name that must be assigned
     * @returns {Void}
     * @author Mavelil
     * @example <caption>Example usage of addClassToElement method.</caption>
     * sanpshotList.addClassToElement( id , className );
     */

	addClassToElement: function (id, className) {

		document.getElementById(id).className += " " + className;
	},

	/**
     * removeClassFromElement( id , className ) - Method to remove a CSS Class name for a particular element.
	 * @param {String} id - ID of the DOM element from which the class has to be removed
	 * @param {String} className - Class name that must be removed
     * @returns {Void}
     * @author Mavelil
     * @example <caption>Example usage of removeClassFromElement method.</caption>
     * sanpshotList.removeClassFromElement( id , className );
     */

	removeClassFromElement: function (id, className) {

		document.getElementById(id).classList.remove(className);

	},

	/**
     * getSnapshotOfCurrentProject( projectUrlForSnapshot ) - Method to get the snapshot of the current project scene.
	 * @param {String} projectUrlForSnapshot - The URL to the project
     * @returns {Object<Promise>} - The JSON response from the server.
     * @author Mavelil
     * @example <caption>Example usage of getSnapshotOfCurrentProject method.</caption>
     * sanpshotList.getSnapshotOfCurrentProject( projectUrlForSnapshot );
     */

	getSnapshotOfCurrentProject: function (projectUrlForSnapshot) {

		return new Promise((resolve, reject) => {

			$.ajax({
				url: projectUrlForSnapshot,

				headers: {

					"Cache-Control": "no-cache, no-store, must-revalidate",
					"Pragma": "no-cache",
					"Expires": 0

				},

				type: 'POST',
				data: {
					code: '1'
				},
				success: function (response) {

					resolve(response)

				},
				error: function (jqxhr, status, msg) {

					reject(msg);
				}
			});

		})
	},

	/**
     * createModelForscreenShoot( data ) - Method to create the model containing the snapshots.
	 * @param {Array} data - The array containing the snapshot names.
	 * @returns {Void}
     * @author Mavelil
     * @example <caption>Example usage of createModelForscreenShoot method.</caption>
     * sanpshotList.createModelForscreenShoot( data );
     */

	createModelForscreenShoot: function (data) {

		this.toRemoveAlltheElement();
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
			this.outerDivForImage(this.row, i);
		}


	},
	outerDivForImage: function (rowCount, number) {


		this.outerMainDiv = document.createElement('div');
		this.outerMainDiv.className = 'col-sm-12 col-md-3'
		this.outerMainDiv.id = 'maindiv' + number;
		this.bodyForSnapshotImage(rowCount, number);

	},

	bodyForSnapshotImage: function (rowCount, number) {


		this.bodyForSnapshotImageDiv = document.createElement('div');
		this.bodyForSnapshotImageDiv.className = 'w3-card-4 user-image-card-3d btn-group';
		this.bodyForSnapshotImageDiv.id = 'secondDiv' + number;
		this.setImageToBody(rowCount, number);

	},

	setImageToBody: function (rowCount, number) {

		this.image = document.createElement('img');
		this.image.src = editor.path + 'output/uploadurl/' + this.uid + editor.activeProject.name + '/screenshottwod/' + this.data[number] + "?randomize=" + Date.now();
		this.image.className = 'thumbnail-3D enlargeScreenshot';

		this.imageEventListner(rowCount, number)
	},

	/**
     * imageEventListner( rowCount ,number ) - Method to create event listener for the sanpshot.
	 * @param {Number} rowCount
	 * @param {Number} number	
	 * @returns {Void} 
     * @author Mavelil
     * @example <caption>Example usage of imageEventListner method.</caption>
     * sanpshotList.imageEventListner( rowCount ,number );
     */

	imageEventListner: function (rowCount, number) {
		var scope = this;
		this.image.addEventListener("click", function () {

			this.enlargeModelModalImagePart = document.getElementById('enlargeModal');
			this.enlargeLastPart = this.src.split("/").pop();
			this.enlargeName = document.getElementById('screnshotname');

			this.Str = this.enlargeLastPart.substring(this.enlargeLastPart.lastIndexOf("(") + 1, this.enlargeLastPart.lastIndexOf(")"));
			document.getElementById('screnshotposition').innerHTML = this.Str.substring(0, this.Str.indexOf("D"));
			document.getElementById('screnshottilt').innerHTML = this.Str.substr(this.Str.indexOf("g") + 1);

			this.enlargeName.innerHTML = this.enlargeLastPart.substring(0, this.enlargeLastPart.indexOf("(")) + '.jpg';
			this.enlargeModelModalImagePart.src = this.src;
			scope.showEnlargeModel()

		})

		scope.showNameOfSnapshot(rowCount, number)
	},

	/**
     * showNameOfSnapshot( rowCount , number ) - Method to show the name of the snapshot in the thumbnail.
	 * @param {Number} rowCount
	 * @param {Number} number	 
	 * @returns {Void}
     * @author Mavelil
     * @example <caption>Example usage of showNameOfSnapshot method.</caption>
     * sanpshotList.showNameOfSnapshot( rowCount , number );
     */

	showNameOfSnapshot: function (rowCount, number) {

		this.nameDiv = document.createElement('div');
		this.nameDiv.className = 'w3-container w3-center user-details-card form-group overfolwfilename';
		this.nameDiv.id = "namediv" + number;
		this.nameParagraph = document.createElement('p');
		this.nameParagraph.id = this.data[number].substring(0, this.data[number].indexOf("."));
		this.nameParagraph.innerHTML = this.data[number].substring(0, this.data[number].indexOf("(")) + '.jpg';

		this.showPositionDetailsOfSnapshot(rowCount, number);

	},

	/**
     * showPositionDetailsOfSnapshot( rowCount , number ) - Method to show the details( position, tilt-roll-pan, unit ) of the snapshot in the thumbnail.
	 * @param {Number} rowCount
	 * @param {Number} number	 
	 * @returns {Void}
     * @author Mavelil
     * @example <caption>Example usage of showPositionDetailsOfSnapshot method.</caption>
     * sanpshotList.showPositionDetailsOfSnapshot( rowCount , number );
     */

	showPositionDetailsOfSnapshot: function (rowCount, number) {

		var test = this.data[number].substring(0, this.data[number].indexOf("."));
		var String = test.substring(test.lastIndexOf("(") + 1, test.lastIndexOf(")"));
		var position = String.substring(0, String.indexOf("D"));
		var count;
		position = position.trim();

		positionArray = position.split(',');
		position = "";
		count = 0;
		positionArray.forEach(function (element) {
			count++;
			position = position + (Number(element) * editor.commonMeasurements.targetConversionFactor).toFixed(1);
			if (count < 3)
				position = position + ",";

		});

		/*var tilt = String.substr(String.indexOf("g") + 1);
		tilt = tilt.trim();

		tiltArray = tilt.split(',');
		tilt="";
		count = 0;
		tiltArray.forEach( function( element ){
			count++;
			tilt = tilt + ( Number( element )  );
			if( count<3 )
			tilt = tilt+",";
		} );*/


		this.paragraphPositionDetailsOfSnapshot = document.createElement('p');
		this.paragraphPositionDetailsOfSnapshot.innerHTML = "Position :(" + position + ')  Tilt :(' + String.substr(String.indexOf("g") + 1) + ') Unit: ' + editor.commonMeasurements.targetUnit;
		this.inputFeildForChangeName(rowCount, number);

	},

	/**
     * inputFeildForChangeName( rowCount , number ) - Method to show the field to edit the name of the snapshots.
	 * @param {Number} rowCount
	 * @param {Number} number	 
	 * @returns {Void}
     * @author Mavelil
     * @example <caption>Example usage of inputFeildForChangeName method.</caption>
     * sanpshotList.inputFeildForChangeName( rowCount , number );
     */

	inputFeildForChangeName: function (rowCount, number) {

		this.inputFeildForChangeNameDiv = document.createElement('div');
		this.inputFeildForChangeNameDiv.className = 'flexContainer';
		this.inputFeildForChangeNameDiv.id = "inputdiv" + number;
		this.renameField = document.createElement('input');
		this.renameField.className = 'inputField form-control';
		this.renameField.id = "rename" + number;
		this.renameField.type = 'text';
		this.renameField.value = this.data[number].substring(0, this.data[number].indexOf("("));
		this.renameButton = document.createElement('button');
		this.renameButton.className = "btn btn-success";
		this.renameButton.id = 'renameButton' + number;
		this.renameButtonSymbol = document.createElement('i');
		this.renameButtonSymbol.className = "fa fa-check-square"
		this.renameButtonEventListner(rowCount, number);
	},

	/**
     * renameButtonEventListner( rowCount , number ) - Method to create listener for editing snapshot name.
	 * @param {Number} rowCount
	 * @param {Number} number	 
	 * @returns {Void}
     * @author Mavelil
     * @example <caption>Example usage of renameButtonEventListner method.</caption>
     * sanpshotList.renameButtonEventListner( rowCount , number );
     */

	renameButtonEventListner: function (rowCount, number) {

		var scope = this;
		this.renameButton.addEventListener("click", function () {

			this.renameButtonParent = this.parentElement;
			this.renamegetNamePart = this.renameButtonParent.parentElement;
			this.namePartChildren = this.renamegetNamePart.children;
			this.previousName = this.namePartChildren[0].id;
			this.getNewNameFromField = this.namePartChildren[2].children[0].value;
			this.validReplaceString = scope.replaceTheSpecialCharater(this.getNewNameFromField);
			this.sendDataToUpdate = {};
			this.sendDataToUpdate.id = scope.uid + scope.editor.activeProject.name;
			this.sendDataToUpdate.name = this.previousName + '.jpg';
			this.sendDataToUpdate.rename = this.validReplaceString + '(' + this.previousName.split('(')[1];
			scope.renameApiCall(this.sendDataToUpdate).then((responseData) => {

				this.mainRenameImagePart = this.renamegetNamePart.parentElement.children;
				//console.log( this.namePartChildren )
				this.mainRenameImagePart[0].src = editor.path + 'output/uploadurl/' + scope.uid + editor.activeProject.name + '/screenshottwod/' + responseData + '.jpg' + "?randomize=" + Date.now();

				this.namePartChildren[3].style.display = ''
				this.namePartChildren[2].style.display = 'none';
				this.namePartChildren[0].id = responseData;
				this.namePartChildren[0].innerHTML = "";
				this.namePartChildren[0].innerHTML = this.validReplaceString + '.jpg';

				if (editor.scene.userData.cameraList) {

					this.parts = this.sendDataToUpdate.name;
					this.cameraUuid = this.parts.substring(this.parts.lastIndexOf(")") + 1, this.parts.lastIndexOf("."))
					this.cameraSnapshotList = editor.scene.userData.cameraList[this.cameraUuid];

					for (var i = 0; i < this.cameraSnapshotList.length; i++) {

						if (this.cameraSnapshotList[i].screenshotname == this.sendDataToUpdate.name) {

							this.cameraSnapshotList[i].screenshotname = this.sendDataToUpdate.rename + '.jpg';
						}

					}
					scope.activityLogRenameSucess(this.sendDataToUpdate);

				}

				else {

					//console.log( 'no editor.scene.userData.cameraList ' )
				}
				if (editor.scene.userData.ReportImage) {


					if (editor.scene.userData.ReportImage.Project_Overview == this.sendDataToUpdate.name) {

						editor.scene.userData.ReportImage.Project_Overview = this.sendDataToUpdate.rename + '.jpg';
					}
					if (editor.scene.userData.ReportImage.Project_Scenes_Layouts == this.sendDataToUpdate.name) {

						editor.scene.userData.ReportImage.Project_Scenes_Layouts = this.sendDataToUpdate.rename + '.jpg';
					}

					if (editor.scene.userData.ReportImage.Top_View == this.sendDataToUpdate.name) {

						editor.scene.userData.ReportImage.Top_View = this.sendDataToUpdate.rename + '.jpg';
					}
					if (editor.scene.userData.ReportImage.Left_View == this.sendDataToUpdate.name) {

						editor.scene.userData.ReportImage.Left_View = this.sendDataToUpdate.rename + '.jpg';
					}
					if (editor.scene.userData.ReportImage.Right_View == this.sendDataToUpdate.name) {

						editor.scene.userData.ReportImage.Right_View = this.sendDataToUpdate.rename + '.jpg';
					}
					if (editor.scene.userData.ReportImage.Length_Mesurement == this.sendDataToUpdate.name) {

						editor.scene.userData.ReportImage.Length_Mesurement = this.sendDataToUpdate.rename + '.jpg';
					}
					if (editor.scene.userData.ReportImage.Area_Mesurement == this.sendDataToUpdate.name) {

						editor.scene.userData.ReportImage.Area_Mesurement = this.sendDataToUpdate.rename + '.jpg';
					}
					if (editor.scene.userData.ReportImage.point_Of_Intrest == this.sendDataToUpdate.name) {

						editor.scene.userData.ReportImage.point_Of_Intrest = this.sendDataToUpdate.rename + '.jpg';
					}
					if (editor.scene.userData.ReportImage.Network_Cable_Mesurement == this.sendDataToUpdate.name) {

						editor.scene.userData.ReportImage.Network_Cable_Mesurement = this.sendDataToUpdate.rename + '.jpg';
					}
					var snapshots = editor.scene.userData.ReportImage.Miscellaneous_Snapshots;
					var smartsensorsnapshots = editor.scene.userData.ReportImage.Smart_Sensor;
					for (var i = 0; i < snapshots.length; i++) {
						if (snapshots[i] == this.sendDataToUpdate.name) {
							editor.scene.userData.ReportImage.Miscellaneous_Snapshots[i] = this.sendDataToUpdate.rename + '.jpg';
						}
					}
					for (var i = 0; i < smartsensorsnapshots.length; i++) {
						if (smartsensorsnapshots[i] == this.sendDataToUpdate.name) {
							editor.scene.userData.ReportImage.Smart_Sensor[i] = this.sendDataToUpdate.rename + '.jpg';
						}
					}

				}

			})
				.catch((msg) => {

					console.log(msg);
					scope.activityLogRenameError(this.sendDataToUpdate)
				})



		})


		this.buttonGroupForEditOperation(rowCount, number);
	},

	/**
     * replaceTheSpecialCharater( data ) - Method to create listener for editing snapshot name.
	 * @param {String} data	- The string from which special charecters must be removed.
	 * @returns {String}
     * @author Mavelil
     * @example <caption>Example usage of replaceTheSpecialCharater method.</caption>
     * sanpshotList.replaceTheSpecialCharater( data );
     */

	replaceTheSpecialCharater: function (data) {

		this.newString = data;
		this.newString = this.newString.replace(/\s/g, '');
		this.newString = this.newString.replace(/\\/g, "");
		this.newString = this.newString.replace(/{/g, "");
		var invalid = /[°"§%()\[\]{}=\\?´`'#<>|,;.:+_-]+/g;
		this.newString = this.newString.replace(invalid, "");

		this.newString = this.newString.replace(/}/g, "");
		this.newString = this.newString.replace(/^/g, "");
		this.newString = this.newString.replace(/\^/g, "");

		return this.newString;

	},

	/**
     * renameApiCall( sendData ) - Method to reflect the edit to the snapshot's name in the server .
	 * @param {Object<JSON>} sendData - Details of the snapshots including name, rename and project name.
	 * @return {Object<Promise>}
	 * @author Mavelil
     * @example <caption>Example usage of renameApiCall method.</caption>
     * sanpshotList.renameApiCall( sendData );
     */

	renameApiCall: function (sendData) {

		return new Promise((resolve, reject) => {

			$.ajax({
				url: editor.api + 'rename/screenshot/',
				type: 'POST',
				contentType: 'application/json',
				processData: false,
				data: JSON.stringify(sendData),
				success: function (response) {

					resolve(response)

				},
				error: function (jqxhr, status, msg) {

					reject(msg)
				}
			});

		})

	},

	/**
     * buttonGroupForEditOperation( rowCount , number ) - Method to create a group containing buttons for edit, download, delete and categorize snapshots .
	 * @param {Number} rowCount
	 * @param {Number} number
	 * @returns {Void}
	 * @author Mavelil
     * @example <caption>Example usage of buttonGroupForEditOperation method.</caption>
     * sanpshotList.buttonGroupForEditOperation( rowCount , number );
     */

	buttonGroupForEditOperation: function (rowCount, number) {

		this.buttonGroupdiv = document.createElement('div');
		this.buttonGroupdiv.className = 'btn-group btnGroupa';
		this.buttonGroupdiv.id = number;
		this.buttonForEdit(rowCount, number);

	},

	/**
     * buttonForEdit( rowCount , number ) - Method to create a button that enables editing of snapshot's name.
	 * @param {Number} rowCount
	 * @param {Number} number
	 * @returns {Void}
	 * @author Mavelil
     * @example <caption>Example usage of buttonForEdit method.</caption>
     * sanpshotList.buttonForEdit( rowCount , number );
     */

	buttonForEdit: function (rowCount, number) {

		this.buttonEdit = document.createElement('button');
		this.buttonEdit.className = "btn btn-default";
		this.buttonEdit.id = 'editButton' + number;
		this.editSymbol = document.createElement('i');
		this.editSymbol.className = "fa fa-edit";
		this.buttonForEditEventListner(rowCount, number);
	},

	/**
     * buttonForEditEventListner( rowCount , number ) - Method to create a listener for the button that enables editing of snapshot name.
	 * @param {Number} rowCount
	 * @param {Number} number
	 * @returns {Void}
	 * @author Mavelil
     * @example <caption>Example usage of buttonForEditEventListner method.</caption>
     * sanpshotList.buttonForEditEventListner( rowCount , number );
     */

	buttonForEditEventListner: function (rowCount, number) {

		this.buttonEdit.addEventListener("click", function () {

			this.buttonPart = this.parentElement;
			this.namedivPart = this.buttonPart.parentElement;
			this.imagePart = this.namedivPart.parentElement;

			this.namedivPart.children[3].style.display = 'none';
			this.namedivPart.children[2].style.display = '';

			//console.log( this.imagePart );
		})


		this.buttonForDownload(rowCount, number);
	},

	/**
     * buttonForDownload( rowCount , number ) - Method to create a button that helps to download the snapshots.
	 * @param {Number} rowCount
	 * @param {Number} number
	 * @returns {Void}
	 * @author Mavelil
     * @example <caption>Example usage of buttonForDownload method.</caption>
     * sanpshotList.buttonForDownload( rowCount , number );
     */

	buttonForDownload: function (rowCount, number) {

		this.buttonDownload = document.createElement('select');
		var downloadIcon = document.createElement("option");
		downloadIcon.setAttribute("class", "fa fa-download opt");
		downloadIcon.innerHTML = "&#xf019;"
		var JPG = document.createElement("option");
		JPG.value = "JPG";
		JPG.text = "JPG";
		JPG.setAttribute("class", "opt");
		var SVG = document.createElement("option");
		SVG.value = "SVG";
		SVG.text = "SVG";
		SVG.setAttribute("class", "opt");
		this.buttonDownload.add(downloadIcon);
		this.buttonDownload.add(JPG);
		this.buttonDownload.add(SVG);
		this.buttonDownload.className = "btn btn-default dropdown-svg fa";
		this.buttonDownload.id = 'downloadButton' + number;
		this.buttonDownloadEventListner(rowCount, number)
	},

	/**
	* buttonDownloadEventListner( rowCount , number ) - Method to create a listener for the button that helps to download the snapshot.
	* @param {Number} rowCount
	* @param {Number} number
	* @returns {Void}
	* @author Mavelil
	* @example <caption>Example usage of buttonDownloadEventListner method.</caption>
	* sanpshotList.buttonDownloadEventListner( rowCount , number );
	*/

	buttonDownloadEventListner: function (rowCount, number) {
        
		var scope = this;
		this.buttonDownload.addEventListener("input", function () {
			

			if (event.target.value == "JPG") {

				this.downloadUrl = this.parentElement;
				this.downloadUrl = this.downloadUrl.parentElement;
				this.downloadUrl = this.downloadUrl.parentElement.children[0].src;
				this.downloadimageName = this.downloadUrl.split("/").pop();
				this.downloadimageName = this.downloadimageName.split("?").shift();
				this.linkElement = document.createElement('a');

				try {

					this.linkElement.setAttribute('href', this.downloadUrl);
					this.linkElement.setAttribute("download", this.downloadimageName);

					var clickEvent = new MouseEvent("click", {

						"view": window,
						"bubbles": true,
						"cancelable": false

					});

					this.linkElement.dispatchEvent(clickEvent);
					scope.activityLogDownloadSucess(this.downloadUrl);

				}
				catch (ex) {

					scope.activityLogDownloadError(this.downloadUrl);

				}
			} else {
				
				if (event.target.value == "SVG") {
                   
					this.downloadUrl = this.parentElement;
					this.downloadUrl = this.downloadUrl.parentElement;
					this.downloadUrl = this.downloadUrl.parentElement.children[0].src;
					this.downloadimageName = this.downloadUrl.split("/").pop();
					this.downloadimageName = this.downloadimageName.split("?").shift();
					scope.imageTrace.imageToSVG(this.downloadUrl, res => {

						var fileName = this.downloadimageName.replace('.jpg', '.svg');
						var blob = new Blob([res], { type: "image/svg+xml" });
						
						saveAs(blob, fileName);

					})
				}
			}

			event.target.selectedIndex = "0"


		});
		this.buttonForDelete(rowCount, number);

	},

	/**
     * buttonForDelete( rowCount , number ) - Method to create a button that helps to delete the snapshots.
	 * @param {Number} rowCount
	 * @param {Number} number
	 * @returns {Void}
	 * @author Mavelil
     * @example <caption>Example usage of buttonForDelete method.</caption>
     * sanpshotList.buttonForDelete( rowCount , number );
     */

	buttonForDelete: function (rowCount, number) {

		this.buttonDelete = document.createElement('button');
		this.buttonDelete.className = "btn btn-default";
		this.buttonDelete.id = 'deleteButton' + number;
		this.deleteSymbol = document.createElement('i');
		this.deleteSymbol.className = "fa fa-trash"
		this.buttonDeleteAddEventListner(rowCount, number);
	},

	/**
     * buttonDeleteAddEventListner( rowCount , number ) - Method to create a listener for the button that helps to delete the snapshot.
	 * @param {Number} rowCount
	 * @param {Number} number
	 * @returns {Void}
	 * @author Mavelil
     * @example <caption>Example usage of buttonDeleteAddEventListner method.</caption>
     * sanpshotList.buttonDeleteAddEventListner( rowCount , number );
     */

	buttonDeleteAddEventListner: function (rowCount, number) {

		var scope = this;
		this.buttonDelete.addEventListener("click", function () {

			this.deleteUrl = this.parentElement;
			this.deleteUrl = this.deleteUrl.parentElement;
			this.deleteUrl = this.deleteUrl.parentElement.children[0].src;
			this.deleteImageName = this.deleteUrl.substr(this.deleteUrl.lastIndexOf('/') + 1);
			this.deleteImageName = this.deleteImageName.split("?")[0];
			this.deleteImageNameCameraUid = this.deleteImageName.substring(this.deleteImageName.lastIndexOf(")") + 1, this.deleteImageName.lastIndexOf("."));
			this.deletePostData = {};
			this.deletePostData.id = scope.uid + editor.activeProject.name;
			this.deletePostData.name = this.deleteImageName;
			this.deletePostData.imgdatauuid = this.deleteImageNameCameraUid;
			scope.deleteApiCall(this.deletePostData)
				.then((responceData) => {



					if (responceData.length == '' || responceData.length == 0) {


						scope.hideSnapshotListModel();
						scope.removeClassFromElement('ScreenshotList', 'selectMenubar')
						toastr.error(editor.languageData.NoScreenshotinserve);

					} else {
						scope.createModelForscreenShoot(responceData);

					}

					if (editor.scene.userData.cameraList) {

						this.CurrentDeleteArray = editor.scene.userData.cameraList[this.deletePostData.imgdatauuid];


						if (this.CurrentDeleteArray != undefined) {

							for (var i = 0; i < this.CurrentDeleteArray.length; i++) {

								if (this.CurrentDeleteArray[i].screenshotname == this.deletePostData.name) {

									editor.scene.userData.cameraList[this.deletePostData.imgdatauuid].splice(i, 1);
								}

							}
						}


					}
					if (editor.scene.userData.ReportImage) {
						console.log("scope.deletePostData.name");
						console.log(this.deletePostData.name);

						if (editor.scene.userData.ReportImage.Top_View == this.deletePostData.name) {

							editor.scene.userData.ReportImage.Top_View = null;
						}
						if (editor.scene.userData.ReportImage.Project_Overview == this.deletePostData.name) {

							editor.scene.userData.ReportImage.Project_Overview = null;
						}
						if (editor.scene.userData.ReportImage.Project_Scenes_Layouts == this.deletePostData.name) {

							editor.scene.userData.ReportImage.Project_Scenes_Layouts = null;
						}
						if (editor.scene.userData.ReportImage.Left_View == this.deletePostData.name) {

							editor.scene.userData.ReportImage.Left_View = null;
						}
						if (editor.scene.userData.ReportImage.Right_View == this.deletePostData.name) {

							editor.scene.userData.ReportImage.Right_View = null;
						}
						if (editor.scene.userData.ReportImage.Length_Mesurement == this.deletePostData.name) {

							editor.scene.userData.ReportImage.Length_Mesurement = null;
						}
						if (editor.scene.userData.ReportImage.Area_Mesurement == this.deletePostData.name) {

							editor.scene.userData.ReportImage.Area_Mesurement = null;
						}
						if (editor.scene.userData.ReportImage.point_Of_Intrest == this.deletePostData.name) {

							editor.scene.userData.ReportImage.point_Of_Intrest = null;
						}
						if (editor.scene.userData.ReportImage.Network_Cable_Mesurement == this.deletePostData.name) {

							editor.scene.userData.ReportImage.Network_Cable_Mesurement = null;
						}
						var snapshots = editor.scene.userData.ReportImage.Miscellaneous_Snapshots;
						var smartsensorsnapshots = editor.scene.userData.ReportImage.Smart_Sensor;
						if (snapshots.includes(this.deletePostData.name)) {
							var imageTobeDeleted = snapshots.indexOf(this.deletePostData.name);
							editor.scene.userData.ReportImage.Miscellaneous_Snapshots.splice(imageTobeDeleted, 1);
						}
						if (smartsensorsnapshots.includes(this.deletePostData.name)) {
							var imageTobeDeleted = smartsensorsnapshots.indexOf(this.deletePostData.name);
							editor.scene.userData.ReportImage.Smart_Sensor.splice(imageTobeDeleted, 1);
						}

					}

					scope.activityLogDeleteSucess(this.deletePostData);


				})
				.catch((err) => {

					console.log(err);
					scope.activityLogDeleteError(this.deletePostData);
				})


		})
		this.addToReportButton(rowCount, number)
		//this.appendToModal( rowCount , number );

	},

	/**
     * addToReportButton( rowCount , number ) - Method to create a button that helps to categorize the snapshots.
	 * @param {Number} rowCount
	 * @param {Number} number
	 * @returns {Void}
	 * @author Mavelil
     * @example <caption>Example usage of addToReportButton method.</caption>
     * sanpshotList.addToReportButton( rowCount , number );
     */

	addToReportButton: function (rowCount, number) {

		this.buttonToAddToReport = document.createElement('button');
		this.buttonToAddToReport.className = "btn btn-default";
		this.buttonToAddToReport.id = 'addToReport' + number;
		this.addToReportSymbol = document.createElement('i');
		this.addToReportSymbol.className = "fa fa-plus"
		this.addToReportEventListner(rowCount, number);

	},


	/**
     * addToReportEventListner( rowCount , number ) - Method to create a listener for the button that helps to categorize the snapshot.
	 * @param {Number} rowCount
	 * @param {Number} number
	 * @returns {Void}
	 * @author Mavelil
     * @example <caption>Example usage of addToReportEventListner method.</caption>
     * sanpshotList.addToReportEventListner( rowCount , number );
     */

	addToReportEventListner: function (rowCount, number) {

		var scope = this;
		this.buttonToAddToReport.addEventListener("click", function () {
			this.buttonGroup = this.parentElement;
			this.namePlate = this.buttonGroup.parentElement;
			this.allChildren = this.namePlate.children;
			this.currentImageUrl = this.allChildren[0].id + '.jpg'
			this.currentImageName = this.allChildren[0].innerText;
			document.getElementById('nameOfReportSnapshotInput').value = this.currentImageName;
			document.getElementById("nameOfReportSnapshotInput").disabled = true;
			document.getElementById("urlOfReportSnapshotInput").disabled = true;
			document.getElementById('urlOfReportSnapshotInput').value = this.currentImageUrl;
			scope.checkImageIsUsedInReport(this.allChildren[0].id)


		})
		this.appendToModal(rowCount, number);


	},



	/**
     * checkImageIsUsedInReport( imageUrl ) - Method to set the category for the snapshot in the dropdown.
	 * @param {String} imageUrl - url of the snapshot image.
	 * @returns {Void}
	 * @author Mavelil
     * @example <caption>Example usage of checkImageIsUsedInReport method.</caption>
     * sanpshotList.checkImageIsUsedInReport( imageUrl );
     */

	checkImageIsUsedInReport: function (imageUrl) {

		var imageUrl = imageUrl + '.jpg'
		if (editor.scene.userData.ReportImage) {

			var key = Object.keys(editor.scene.userData.ReportImage);
			document.getElementById('used_list_report').value = 'Not_Selected'
			for (var i = 0; i < key.length; i++) {

				if (key[i] != "Miscellaneous_Snapshots" && key[i] != "Smart_Sensor" ) {
					var currentImageName = editor.scene.userData.ReportImage[key[i]];
					console.log(currentImageName + "   " + imageUrl);
					if (imageUrl == currentImageName) {
						console.log(key[i]);
						document.getElementById('used_list_report').value = key[i];
					}
				}
				else if (key[i] == "Miscellaneous_Snapshots") {
					var currentImageName = editor.scene.userData.ReportImage[key[i]]
					if (currentImageName.includes(imageUrl)) {
						document.getElementById('used_list_report').value = "Miscellaneous_Snapshots";
					}
				}
				else if (key[i] == "Smart_Sensor") {
					var currentImageName = editor.scene.userData.ReportImage[key[i]]
					if (currentImageName.includes(imageUrl)) {
						document.getElementById('used_list_report').value = "Smart_Sensor";
					}
				}

			}
			this.reportModel.show()

		}
		else {

			document.getElementById('used_list_report').value = 'Not_Selected';
			this.reportModel.show()

		}

	},

	/**
     * deleteApiCall( deleteData ) - Method to remove the deleted snapshot from the server.
	 * @param {Object<JSON>} sendData - Details of the snapshots including name, image and project name.
	 * @return {Object<Promise>}
	 * @author Mavelil
     * @example <caption>Example usage of deleteApiCall method.</caption>
     * sanpshotList.deleteApiCall( deleteData );
     */

	deleteApiCall: function (deleteData) {

		return new Promise((resolve, reject) => {

			$.ajax({
				url: editor.api + 'delete/Screenshot/',
				type: 'POST',
				contentType: 'application/json',
				processData: false,
				data: JSON.stringify(deleteData),
				success: function ( response ) {

					editor.notSelected = false;
					document.getElementById('markButton').innerHTML = editor.languageData.Mark;
					document.getElementById( "markAllButton" ).style.display = 'none'
					resolve( response )

				},
				error: function (jqxhr, status, msg) {

					reject( msg )
				}

			});

		})
	},

	toRemoveAlltheElement: function () {

		this.Mainelement = document.getElementById("mainpremn");
		while (this.Mainelement.firstChild) {
			this.Mainelement.removeChild(this.Mainelement.firstChild);


		}
	},

	/**
     * hideSnapshotListModel( ) - Method to hide the model showing snapshots.
	 * @return {Void}
	 * @author Mavelil
     * @example <caption>Example usage of hideSnapshotListModel method.</caption>
     * sanpshotList.hideSnapshotListModel( );
     */

	hideSnapshotListModel: function () {

		$('#screenShotModel').modal('hide');
	},

	/**
     * showSnapShotListModel( ) - Method to show the model listing snapshots taken.
	 * @return {Void}
	 * @author Mavelil
     * @example <caption>Example usage of showSnapShotListModel method.</caption>
     * sanpshotList.showSnapShotListModel( );
     */

	showSnapShotListModel: function () {

		$('#screenShotModel').modal({ backdrop: 'static', keyboard: false });
		this.addEventListnerToCloseButtons();
		this.addEventListenerToMarkButtons();
		this.addEventListenerToMarkAllButton();
	},

	/**
     * addEventListnerToCloseButtons( ) - Method to implement listener for the cancel button in the model.
	 * @return {Void}
	 * @author Mavelil
     * @example <caption>Example usage of addEventListnerToCloseButtons method.</caption>
     * sanpshotList.addEventListnerToCloseButtons( );
     */
	addEventListenerToMarkAllButton: function () {

			document.getElementById( "markAllButton" ).addEventListener( 'click', function () {
			var selectBoxes = document.getElementsByClassName( 'multipile-select-box' )
			for ( var i = 0; i < selectBoxes.length; i++ ) {
				selectBoxes[ i ].checked = true
			}
		})

	},
	updateProgress( progress ) {

		this.editor.progressBar.updateProgress( "Downloading", progress );
		this.editor.progressBar.show();

	},
	svgZip( date ) {

		var linkElement = document.createElement('a');
		var clickEvent = new MouseEvent("click", {
			"view": window,
			"bubbles": true,
			"cancelable": false

		});
		$.ajax({

			url: editor.api + 'zip/svg/' + editor.activeProject._id + '/date/' + date,
			type: "POST",
			contentType: false,
			processData: false,

			success: ( result ) => {

				if ( result.status == 200 ) {

					editor.notSelected = false;
					url = editor.path + result.body[ "pathToSVGZip" ].replace( '\\', '/' ) + '.zip';
					linkElement.setAttribute( 'href', url );
					var fileName = "svg_" + this.editor.activeProject._id+ "_" +date;
					linkElement.setAttribute( "download", fileName );
					linkElement.dispatchEvent( clickEvent );
					editor.progressBar.hide();
					document.getElementById( 'publish-svg-details-form' ).reset();
					$( '#publish-svg' ).modal({ backdrop: 'static', keyboard: false });
					document.getElementById( 'published-svg-link' ).value = url;
					document.getElementById( 'publish-svg-copy-clipbrd' ).addEventListener( 'click', function () {

						var copyFrom = document.getElementById( 'published-svg-link' );
						copyFrom.select();
						document.execCommand( 'Copy' );
						toastr.info( editor.languageData.Copiedtoclipboard );

					});
				}
			},
			error: ( err ) => {
				console.log( err );
				toastr.error( "ERROR" );

			}
		})
	},

	svgPost( blob, date, numberofblob, count ) {

		var fds = new FormData();
		var scope = this;
		fds.append( 'file', blob, blob.name );

		$.ajax({

			url : editor.api + 'svg/' + editor.activeProject._id + '/date/' + date,
			type : "POST",
			contentType : false,
			processData : false,
			data : fds,
			success : ( result ) => {

				if ( numberofblob == count ) {

					scope.svgZip( date )

				}
			},
			error : ( err ) => {

				console.log( err );
				toastr.error( "ERROR" );

			}
		})
	},

	addEventListenerToMarkButtons: function () {

		var scope = this;
		document.getElementById( "markButton" ).addEventListener( 'click', function( event ) {

			document.getElementById( "markAllButton" ).style.display = 'inline'
			var selectBoxes = document.getElementsByClassName( 'multipile-select-box' ) 
			var svglabels = document.getElementsByClassName( 'svg-label' );
			var count = 0;
			
			if (document.getElementById( 'markButton' ).innerHTML == "Download" ) {

				for (var i = 0; i < selectBoxes.length; i++) {

					if (selectBoxes[ i ].checked == true) {

						count++;
						
					}

				}

				if ( count == 0 && document.getElementById( 'markAllButton' ).style.display == "inline" && document.getElementById( 'markButton' ).innerHTML === "Download") {

					if (editor.notSelected) {

						toastr.warning( "No file selected" );
						toastr.clear();
						editor.notselected = false;

					}
				}

				if ( count > 0 ) {

					editor.notSelected = false
					var date = Date.now()
					var intialProgress = (1 / count);
					var actuallProgress = intialProgress
					var svgFileName = []
					var blobs = []
					editor.progressBar.show()
					scope.updateProgress( intialProgress )
					var numberofblob = 0;

					for ( var i = 0; i < selectBoxes.length; i++ ) {
						
						if (selectBoxes[ i ].checked == true) {
							
							
							var str = selectBoxes[ i ].id;
							var res = str.slice(15, str.length);
							this.downloadUrl = document.getElementById( res );
							this.downloadUrl = this.downloadUrl.parentElement;
							this.downloadUrl = this.downloadUrl.parentElement.children[ 0 ].src;
							this.downloadimageName = this.downloadUrl.split("/").pop();
							this.downloadimageName = this.downloadimageName.split("?").shift();
							svgFileName.push( this.downloadimageName )
							scope.imageTrace.imageToSVG( this.downloadUrl, res => {

								var fileName = svgFileName.shift();
								var newblob = new Promise(function ( resolve, reject ) {
									var blob = new Blob( [ res ], { type: "image/svg+xml" } );
									blob.lastModifiedDate = new Date();
									blob.name = fileName.replace( '.jpg', '.svg' );
									blobs.push( blob )
									resolve( blob );

								})

								newblob.then( function ( blob ) {
									scope.updateProgress(actuallProgress)

									numberofblob++
									scope.svgPost( blob, date, numberofblob, count )

									if ( numberofblob == count ) {
            
										scope.updateProgress(1)
										
									} else {
										
										actuallProgress = actuallProgress + intialProgress

									}
								})
								
							})
						}
					}

					document.getElementById('markButton').innerHTML = editor.languageData.Mark;
					scope.toRemoveAlltheElement();
					scope.hideSnapshotListModel();
					scope.removeClassFromElement( 'ScreenshotList', 'selectMenubar' )

				}

			} else {

				setTimeout(() => {
					editor.notSelected = true;
				}, 1000)

				for (var i = 0; i < svglabels.length; i++) {

					svglabels[ i ].style.display = "block"

				}

				for (var i = 0; i < selectBoxes.length; i++) {

					selectBoxes[ i ].style.display = 'block'
				}

				document.getElementById('markButton').innerHTML = editor.languageData.download;

			}
		})
	},
	addEventListnerToCloseButtons: function () {
		var scope = this
		document.getElementById( 'markButton' ).innerHTML = "Mark"
		document.getElementById("markAllButton").style.display = 'none'
		var svglabels = document.getElementsByClassName('svg-label');

		for (var i = 0; i < svglabels.length; i++) {

			svglabels[ i ].style.display = "block"

		}
		
		$("#cancelScreenshotButton").click(function () {
			editor.notSelected = false
			scope.toRemoveAlltheElement();
			scope.hideSnapshotListModel();
			scope.removeClassFromElement('ScreenshotList', 'selectMenubar')
		});
		$("#cancelScreenshotbutton").click(function () {
			editor.notSelected = false
			scope.toRemoveAlltheElement();
			scope.hideSnapshotListModel();
			scope.removeClassFromElement('ScreenshotList', 'selectMenubar')
		});
		$("#enlargeButtonClose").click(function () {

			scope.hideEnlargeModel();
		});
	},

	/**
     * showEnlargeModel( ) - Method to show the enlarged snapshot image and details.
	 * @return {Void}
	 * @author Mavelil
     * @example <caption>Example usage of showEnlargeModel method.</caption>
     * sanpshotList.showEnlargeModel( );
     */

	showEnlargeModel: function () {

		$('#enlargeImageModal').modal({ backdrop: 'static', keyboard: false });
	},

	/**
     * hideEnlargeModel( ) - Method to hide the enlarged snapshot model.
	 * @return {Void}
	 * @author Mavelil
     * @example <caption>Example usage of hideEnlargeModel method.</caption>
     * sanpshotList.hideEnlargeModel( );
     */

	hideEnlargeModel: function () {

		var a = document.getElementById('enlargeModal');
		a.src = '';
		$('#enlargeImageModal').modal('hide');

	},

	/**
     * activityLogRenameSucess( sendData ) - Method to send the activity logs when renamed.
	 * @param {Object<JSON>} sendData - Details of the snapshots including name, image and project name.
	 * @return {Void}
	 * @author Mavelil
     * @example <caption>Example usage of activityLogRenameSucess method.</caption>
     * sanpshotList.activityLogRenameSucess( sendData );
     */

	activityLogRenameSucess: function (sendData) {


		try {


			var logDatas = {};
			logDatas[moment().format("YYYY-MM-DD HH:mm:ss")] = "User " + localStorage.getItem('firstname') + " " + localStorage.getItem('lastname') + " : Snapshot " + sendData.name + " renamed to " + sendData.rename;
			logger.addLog(logDatas);
			logger.sendLogs(localStorage.getItem('U_ID'));


		}

		catch (exception) {

			console.log("Logging failed!");
			console.log(exception);

		}

	},

	/**
     * activityLogRenameError( sendData ) - Method to send the activity logs when an error occured while renaming.
	 * @param {Object<JSON>} sendData - Details of the snapshots including name, image and project name.
	 * @return {Void}
	 * @author Mavelil
     * @example <caption>Example usage of activityLogRenameError method.</caption>
     * sanpshotList.activityLogRenameError( sendData );
     */

	activityLogRenameError: function (sendData) {

		try {


			var logDatas = {};
			logDatas[moment().format("YYYY-MM-DD HH:mm:ss")] = "User " + localStorage.getItem('firstname') + " " + localStorage.getItem('lastname') + " : Failed to rename " + sendData.name + " (Snapshot)";
			logger.addLog(logDatas);
			logger.sendLogs(localStorage.getItem('U_ID'));


		}
		catch (exception) {

			console.log("Logging failed!");
			console.log(exception);

		}
	},

	/**
     * activityLogDownloadSucess( downloadUrl ) - Method to send the activity logs when renamed.
	 * @param {Object} downloadUrl - Details of the snapshots including name, image and project name.
	 * @return {Void}
	 * @author Mavelil
     * @example <caption>Example usage of activityLogDownloadSucess method.</caption>
     * sanpshotList.activityLogDownloadSucess( downloadUrl );
     */

	activityLogDownloadSucess: function (downloadUrl) {

		try {


			var logDatas = {};
			logDatas[moment().format("YYYY-MM-DD HH:mm:ss")] = "User " + localStorage.getItem('firstname') + " " + localStorage.getItem('lastname') + " : Downloaded snapshot " + downloadUrl;
			logger.addLog(logDatas);
			logger.sendLogs(localStorage.getItem('U_ID'));


		}
		catch (exception) {

			console.log("Logging failed!");
			console.log(exception);

		}
	},

	/**
     * activityLogDownloadError( downloadUrl ) - Method to send the activity logs when an error occured while renaming.
	 * @param {Object<JSON>} downloadUrl - Details of the snapshots including name, image and project name.
	 * @return {Void}
	 * @author Mavelil
     * @example <caption>Example usage of activityLogDownloadError method.</caption>
     * sanpshotList.activityLogDownloadError( downloadUrl );
     */

	activityLogDownloadError: function (downloadUrl) {

		try {


			var logDatas = {};
			logDatas[moment().format("YYYY-MM-DD HH:mm:ss")] = "User " + localStorage.getItem('firstname') + " " + localStorage.getItem('lastname') + " : Failed to download snapshot " + downloadUrl + " : " + ex;
			logger.addLog(logDatas);
			logger.sendLogs(localStorage.getItem('U_ID'));


		}
		catch (exception) {

			console.log("Logging failed!");
			console.log(exception);

		}
	},

	/**
     * activityLogDeleteSucess( dataPost ) - Method to send the activity logs when successfully deleted.
	 * @param {Object} dataPost - Object containing details such as project name, deleted image and camera uuid.
	 * @return {Void}
	 * @author Mavelil
     * @example <caption>Example usage of activityLogDeleteSucess method.</caption>
     * sanpshotList.activityLogDeleteSucess( dataPost );
     */

	activityLogDeleteSucess: function (dataPost) {

		try {


			var logDatas = {};
			logDatas[moment().format("YYYY-MM-DD HH:mm:ss")] = "User " + localStorage.getItem('firstname') + " " + localStorage.getItem('lastname') + " : Removed snapshot " + dataPost.name;
			logger.addLog(logDatas);
			logger.sendLogs(localStorage.getItem('U_ID'));


		}
		catch (exception) {

			console.log("Logging failed!");
			console.log(exception);

		}
	},

	/**
     * activityLogDeleteError( dataPost ) - Method to send the activity logs when an error occured while deleting a snapshot.
	 * @param {Object} dataPost - Object containing details such as project name, deleted image and camera uuid.
	 * @return {Void}
	 * @author Mavelil
     * @example <caption>Example usage of activityLogDeleteError method.</caption>
     * sanpshotList.activityLogDeleteError( dataPost );
     */

	activityLogDeleteError: function (dataPost) {

		try {

			var logDatas = {};
			logDatas[moment().format("YYYY-MM-DD HH:mm:ss")] = "User " + localStorage.getItem('firstname') + " " + localStorage.getItem('lastname') + " : Failed to remove snapshot " + dataPost.name + " : " + msg;
			logger.addLog(logDatas);
			logger.sendLogs(localStorage.getItem('U_ID'));


		}

		catch (exception) {

			console.log("Logging failed!");
			console.log(exception);

		}
	},

	/**
     * appendToModal( rowCount ,number ) - Method to send the activity logs when an error occured while deleting a snapshot.
	 * @param {Number} rowCount
	 * @param {Number} number
	 * @return {Void}
	 * @author Mavelil
     * @example <caption>Example usage of appendToModal method.</caption>
     * sanpshotList.appendToModal( rowCount ,number );
     */

	appendToModal: function (rowCount, number) {
		var scope = this;

		this.modalDiv = document.getElementById('mainpremn');
		this.modalDiv.appendChild(this.rowDiv);

		this.findRow = document.getElementById('row' + rowCount);
		this.findRow.appendChild(this.outerMainDiv);

		this.appendMainBody = document.getElementById('maindiv' + number);
		this.appendMainBody.appendChild(this.bodyForSnapshotImageDiv);

		this.imageappend = document.getElementById('secondDiv' + number);
		this.imageappend.appendChild(this.image);

		this.imageappend.appendChild(this.nameDiv);

		var multipleSelectDiv = document.createElement('div');
		var svgDiv = document.createElement('div');
		var checkboxDiv = document.createElement('div');

		var multipleSelect = document.createElement('input');
		multipleSelect.setAttribute('type', 'checkbox');
		multipleSelect.setAttribute('class', 'multipile-select-box');
		multipleSelect.id = 'select-multiple' + number;
		checkboxDiv.appendChild(multipleSelect)

		var svgLabel = document.createElement('label')
		svgLabel.innerHTML = "SVG"
		svgLabel.id = 'svg'
		svgLabel.setAttribute('class', 'svg-label')
		svgDiv.appendChild(svgLabel)




		svgDiv.appendChild(multipleSelect)
		this.imageappend.appendChild(svgDiv);
		this.imageappend.appendChild(multipleSelect);
		var selectBoxes = document.getElementsByClassName('multipile-select-box')
		for (var i = 0; i < selectBoxes.length; i++) {
			selectBoxes[i].style.display = 'none'
		}
		var svglabels = document.getElementsByClassName('svg-label');
		for (var i = 0; i < svglabels.length; i++) {
			svglabels[i].style.display = "none"
		}
		this.imageNameDiv = document.getElementById('namediv' + number);
		this.imageNameDiv.appendChild(this.nameParagraph);
		this.imageNameDiv.appendChild(this.paragraphPositionDetailsOfSnapshot);

		this.imageNameDiv.appendChild(this.inputFeildForChangeNameDiv);
		this.findRenameDiv = document.getElementById('inputdiv' + number);
		this.findRenameDiv.style.display = 'none';
		this.findRenameDiv.appendChild(this.renameField);
		this.findRenameDiv.appendChild(this.renameButton);
		this.findRenameInputButton = document.getElementById('renameButton' + number);
		this.findRenameInputButton.appendChild(this.renameButtonSymbol);


		this.imageNameDiv.appendChild(this.buttonGroupdiv);



		this.findButtonGroup = document.getElementById(number);
		this.findButtonGroup.appendChild(this.buttonEdit);
		this.findButtonGroup.appendChild(this.buttonDownload);
		this.findButtonGroup.appendChild(this.buttonDelete);
		this.findButtonGroup.appendChild(this.buttonToAddToReport);

		this.findEditButton = document.getElementById('editButton' + number);
		this.findEditButton.appendChild(this.editSymbol);

		this.findDownloadButton = document.getElementById('downloadButton' + number);

		this.findDeleteButton = document.getElementById('deleteButton' + number);
		this.findDeleteButton.appendChild(this.deleteSymbol);

		this.findAddtoReportButton = document.getElementById('addToReport' + number);
		this.findAddtoReportButton.appendChild(this.addToReportSymbol);
		this.findAddtoReportButton.appendChild(this.addToReportSymbol);
		this.findAddtoReportButton.appendChild(this.addToReportSymbol);



		this.findselectbutton = document.getElementById('selectbtn' + number);



	},

	/**
     * submitCallbackFun( ) - Method to update the userData when the snapshot category is changed.
	 * @return {Void}
	 * @author Mavelil
     * @example <caption>Example usage of submitCallbackFun method.</caption>
     * sanpshotList.submitCallbackFun( );
     */

	submitCallbackFun: function () {

		var urlofImage = document.getElementById('urlOfReportSnapshotInput').value;
		var useOfImage = document.getElementById('used_list_report').value;
		if (useOfImage != 'Not_Selected') {

			if (editor.scene.userData.ReportImage) {

				var keys = Object.keys(editor.scene.userData.ReportImage);
				if (useOfImage != "Miscellaneous_Snapshots" && useOfImage != "Smart_Sensor") {
					for (var n = 0; n < keys.length; n++) {
						if (keys[n] != "Miscellaneous_Snapshots" && keys[n] != "Smart_Sensor") {
							if (editor.scene.userData.ReportImage[keys[n]] == urlofImage) {
								editor.scene.userData.ReportImage[keys[n]] = null;
							}
						}
					}

					editor.scene.userData.ReportImage[useOfImage] = urlofImage;
					if (editor.scene.userData.ReportImage["Miscellaneous_Snapshots"].includes(urlofImage)) {
						var imageTobeDeletedFromMisc = editor.scene.userData.ReportImage["Miscellaneous_Snapshots"].indexOf(urlofImage);
						editor.scene.userData.ReportImage["Miscellaneous_Snapshots"].splice(imageTobeDeletedFromMisc, 1);
					}
					if (editor.scene.userData.ReportImage["Smart_Sensor"].includes(urlofImage)) {
						var imageTobeDeletedFromMisc = editor.scene.userData.ReportImage["Smart_Sensor"].indexOf(urlofImage);
						editor.scene.userData.ReportImage["Smart_Sensor"].splice(imageTobeDeletedFromMisc, 1);
					}

				}
				else {
					for (var n = 0; n < keys.length; n++) {
						if (keys[n] != "Miscellaneous_Snapshots" && keys[n] != "Smart_Sensor") {
							if (editor.scene.userData.ReportImage[keys[n]] == urlofImage) {
								editor.scene.userData.ReportImage[keys[n]] = null;
							}
						}
					}
					//check if valule is in miscellaneous snpashots

					if (editor.scene.userData.ReportImage["Miscellaneous_Snapshots"].includes(urlofImage)) {
						var imageTobeDeletedFromMisc = editor.scene.userData.ReportImage["Miscellaneous_Snapshots"].indexOf(urlofImage);
						editor.scene.userData.ReportImage["Miscellaneous_Snapshots"].splice(imageTobeDeletedFromMisc, 1);
					}
					if (editor.scene.userData.ReportImage["Smart_Sensor"].includes(urlofImage)) {
						var imageTobeDeletedFromMisc = editor.scene.userData.ReportImage["Smart_Sensor"].indexOf(urlofImage);
						editor.scene.userData.ReportImage["Smart_Sensor"].splice(imageTobeDeletedFromMisc, 1);
					}

					editor.scene.userData.ReportImage[useOfImage].push(urlofImage);
				}


			}
			else {

				
				editor.scene.userData.ReportImage = { Top_View: null, Left_View: null, Right_View: null, Length_Mesurement: null, Area_Mesurement: null, point_Of_Intrest: null, Network_Cable_Mesurement: null, Project_Overview: null, Project_Scenes_Layouts: null, Miscellaneous_Snapshots: [] ,Smart_Sensor:[]}
				if (useOfImage != "Miscellaneous_Snapshots" && useOfImage != "Smart_Sensor") {
					editor.scene.userData.ReportImage[useOfImage] = urlofImage;
				}
				else {
					editor.scene.userData.ReportImage[useOfImage].push(urlofImage);
				}


			}

		}
		else {

			if (editor.scene.userData.ReportImage) {

				var keys = Object.keys(editor.scene.userData.ReportImage);

				for (var n = 0; n < keys.length; n++) {
					if (keys[n] != "Miscellaneous_Snapshots" && keys[n] != "Smart_Sensor") {
						if (editor.scene.userData.ReportImage[keys[n]] == urlofImage) {
							editor.scene.userData.ReportImage[keys[n]] = null;
						}
					}
				}
				if (editor.scene.userData.ReportImage["Miscellaneous_Snapshots"].includes(urlofImage)) {
					var imageTobeDeletedFromMisc = editor.scene.userData.ReportImage["Miscellaneous_Snapshots"].indexOf(urlofImage);
					editor.scene.userData.ReportImage["Miscellaneous_Snapshots"].splice(imageTobeDeletedFromMisc, 1);
				}
				if (editor.scene.userData.ReportImage["Smart_Sensor"].includes(urlofImage)) {
					var imageTobeDeletedFromMisc = editor.scene.userData.ReportImage["Smart_Sensor"].indexOf(urlofImage);
					editor.scene.userData.ReportImage["Smart_Sensor"].splice(imageTobeDeletedFromMisc, 1);
				}
			}
		}

		console.log(urlofImage, useOfImage)
	},

	/**
     * modelReportData( ) - Method to map snapshots to categories.
	 * @return {Void}
	 * @author Mavelil
     * @example <caption>Example usage of modelReportData method.</caption>
     * sanpshotList.modelReportData( );
     */

	modelReportData: function () {

		this.defaultBodyContent = document.createElement('div');
		this.defaultBodyContent.id = "reportModel-modal-body";
		this.nameOfReportSnapshotForm = document.createElement('form');

		/* formGroup*/

		this.nameOfReportSnapshotFormGroup = document.createElement('div');
		this.nameOfReportSnapshotFormGroup.className = "form-group"

		this.nameOfReportSnapshotLabel = document.createElement('label');
		this.nameOfReportSnapshotLabel.innerHTML = editor.languageData.ImageName;

		this.nameOfReportSnapshotInput = document.createElement('input');
		this.nameOfReportSnapshotInput.className = "form-control";
		this.nameOfReportSnapshotInput.id = "nameOfReportSnapshotInput"
		this.nameOfReportSnapshotInput.innerHTML = ""

		this.nameOfReportSnapshotFormGroup.appendChild(this.nameOfReportSnapshotLabel);
		this.nameOfReportSnapshotFormGroup.appendChild(this.nameOfReportSnapshotInput);
		this.nameOfReportSnapshotForm.appendChild(this.nameOfReportSnapshotFormGroup);
		this.defaultBodyContent.appendChild(this.nameOfReportSnapshotForm);
		/* formGroup*/

		this.urlOfReportSnapshotFormGroup = document.createElement('div');
		this.urlOfReportSnapshotFormGroup.className = "form-group"

		this.urlOfReportSnapshotLabel = document.createElement('label');
		this.urlOfReportSnapshotLabel.innerHTML = editor.languageData.ImageUrl;

		this.urlOfReportSnapshotInput = document.createElement('input');
		this.urlOfReportSnapshotInput.className = "form-control";
		this.urlOfReportSnapshotInput.id = "urlOfReportSnapshotInput"
		this.urlOfReportSnapshotInput.innerHTML = ""

		this.urlOfReportSnapshotFormGroup.appendChild(this.urlOfReportSnapshotLabel);
		this.urlOfReportSnapshotFormGroup.appendChild(this.urlOfReportSnapshotInput);
		this.nameOfReportSnapshotForm.appendChild(this.urlOfReportSnapshotFormGroup);
		this.defaultBodyContent.appendChild(this.nameOfReportSnapshotForm);
		/* formGroup*/

		this.optionOfReportSnapshotFormGroup = document.createElement('div');
		this.optionOfReportSnapshotFormGroup.className = "form-group"

		this.optionOfReportSnapshotLabel = document.createElement('label');
		this.optionOfReportSnapshotLabel.innerHTML = editor.languageData.whereItUsed + ":"

		this.selectElement = document.createElement('select');

		this.notSelectedReport = document.createElement("option");
		this.notSelectedReport.setAttribute("value", 'Not_Selected');
		this.notSelectedReportText = document.createTextNode("Not_Selected");
		this.notSelectedReport.appendChild(this.notSelectedReportText);
		this.selectElement.appendChild(this.notSelectedReport);

		this.projectOverViewReport = document.createElement("option");
		this.projectOverViewReport.setAttribute("value", "Project_Overview");
		this.projectOverViewReportText = document.createTextNode("Project_Overview");
		this.projectOverViewReport.appendChild(this.projectOverViewReportText);
		this.selectElement.appendChild(this.projectOverViewReport);

		this.projectScreenLayoutReport = document.createElement("option");
		this.projectScreenLayoutReport.setAttribute("value", "Project_Scenes_Layouts");
		this.projectScreenLayoutReportText = document.createTextNode("Project_Scenes_Layouts");
		this.projectScreenLayoutReport.appendChild(this.projectScreenLayoutReportText);
		this.selectElement.appendChild(this.projectScreenLayoutReport);

		this.topViewReport = document.createElement("option");
		this.topViewReport.setAttribute("value", "Top_View");
		this.topviewText = document.createTextNode("Top_View");
		this.topViewReport.appendChild(this.topviewText);
		this.selectElement.appendChild(this.topViewReport);

		this.leftViewReport = document.createElement("option");
		this.leftViewReport.setAttribute("value", "Left_View");
		this.leftviewText = document.createTextNode("Left_View");
		this.leftViewReport.appendChild(this.leftviewText);
		this.selectElement.appendChild(this.leftViewReport);

		this.rightViewReport = document.createElement("option");
		this.rightViewReport.setAttribute("value", "Right_View");
		this.rightviewText = document.createTextNode("Right_View");
		this.rightViewReport.appendChild(this.rightviewText);
		this.selectElement.appendChild(this.rightViewReport);

		this.lengthMesurementViewReport = document.createElement("option");
		this.lengthMesurementViewReport.setAttribute("value", "Length_Mesurement");
		this.lengthMesurementviewText = document.createTextNode("Length_Mesurement");
		this.lengthMesurementViewReport.appendChild(this.lengthMesurementviewText);
		this.selectElement.appendChild(this.lengthMesurementViewReport);

		this.areaMesurementViewReport = document.createElement("option");
		this.areaMesurementViewReport.setAttribute("value", "Area_Mesurement");
		this.areaMesurementviewText = document.createTextNode("Area_Mesurement");
		this.areaMesurementViewReport.appendChild(this.areaMesurementviewText);
		this.selectElement.appendChild(this.areaMesurementViewReport);

		this.pointOfIntrestMesurementViewReport = document.createElement("option");
		this.pointOfIntrestMesurementViewReport.setAttribute("value", "point_Of_Intrest");
		this.pointOfIntrestMesurementviewText = document.createTextNode("point_Of_Intrest");
		this.pointOfIntrestMesurementViewReport.appendChild(this.pointOfIntrestMesurementviewText);
		this.selectElement.appendChild(this.pointOfIntrestMesurementViewReport);

		this.networkCablingMesurementViewReport = document.createElement("option");
		this.networkCablingMesurementViewReport.setAttribute("value", "Network_Cable_Mesurement");
		this.networkCablingMesurementviewText = document.createTextNode("Network_Cable_Mesurement");
		this.networkCablingMesurementViewReport.appendChild(this.networkCablingMesurementviewText);
		this.selectElement.appendChild(this.networkCablingMesurementViewReport);

		this.miscellaneousSpanshots = document.createElement("option");
		this.miscellaneousSpanshots.setAttribute("value", "Miscellaneous_Snapshots");
		this.miscellaneousSpanshotsText = document.createTextNode("Miscellaneous_Snapshots");
		this.miscellaneousSpanshots.appendChild(this.miscellaneousSpanshotsText);
		this.selectElement.appendChild(this.miscellaneousSpanshots);

		this.smartsensor = document.createElement("option");
		this.smartsensor.setAttribute("value", "Smart_Sensor");
		this.smartsensorText = document.createTextNode("Smart_Sensor");
		this.smartsensor.appendChild(this.smartsensorText);
		this.selectElement.appendChild(this.smartsensor);


		this.selectElement.className = "reportaddmodelList"
		this.selectElement.id = "used_list_report"
		this.optionOfReportSnapshotFormGroup.appendChild(this.optionOfReportSnapshotLabel);
		this.optionOfReportSnapshotFormGroup.appendChild(this.selectElement);
		this.nameOfReportSnapshotForm.appendChild(this.optionOfReportSnapshotFormGroup);
		this.defaultBodyContent.appendChild(this.nameOfReportSnapshotForm);
		/* formGroup*/



		this.reportModel = new UI.bootstrapModal("", "snapshotReportModel", editor.languageData.AddThisImagetoReport, this.defaultBodyContent, editor.languageData.submit, editor.languageData.Cancel, "snapshotReportModelForm");
		//this.reportModel.hideFooterButtons();
		//this.reportModel.makeLargeModal();
		this.reportModel.setSubmitClickCallback(this.submitCallbackFun)
		document.getElementById('editorElement').appendChild(this.reportModel.dom);
	},



}