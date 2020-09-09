var ThreeSixtyImage = function (editor) {
    this.editor = editor;
    this.uid = localStorage.getItem('U_ID');
}

ThreeSixtyImage.prototype = {
    addClassToElement: function (id, className) {

        document.getElementById(id).className += " " + className;
    },

    removeClassFromElement: function (id, className) {

        document.getElementById(id).classList.remove(className);

    },

    toRemoveAlltheElement: function () {

        this.Mainelement = document.getElementById("mainThreeSixty");
        while (this.Mainelement.firstChild) {
            this.Mainelement.removeChild(this.Mainelement.firstChild);
        }
    },

    createModelForThreeSixtyImage: function (data) {

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
        this.bodyForThreeSixtyImage(rowCount, number);

    },

    bodyForThreeSixtyImage: function (rowCount, number) {

        this.bodyForThreeSixtyImageDiv = document.createElement('div');
        this.bodyForThreeSixtyImageDiv.className = 'w3-card-4 user-image-card-3d btn-group';
        this.bodyForThreeSixtyImageDiv.id = 'secondDiv' + number;
        this.setImageToBody(rowCount, number);

    },

    setImageToBody: function (rowCount, number) {
        
        this.image = document.createElement('img');
        this.image.src = editor.modelPath + editor.scene.userData.matterportParameters.info.modelId +'/images/' + this.data[number];
        this.image.className = 'thumbnail-3D enlarge360'
        this.imageEventListner(rowCount, number);
        
    },

    imageEventListner: function (rowCount, number) {
		var scope = this;
		this.image.addEventListener("click", function () {

			this.enlargeModelModalImagePart = document.getElementById('enlargeThreeSixtyModal');
            this.enlargeLastPart = this.src.split("/").pop();
			this.enlargeModelModalImagePart.src = this.src;
			scope.showEnlargeModel()

		})

		this.appendToModal(rowCount, number);        
    },
    
    getThreeSixtyImage () {
        return new Promise((resolve, reject) => {

            $.ajax({
                url: editor.api + 'matterport/models/images/' + localStorage.getItem("model_id"),
                type: 'GET',
                success: function (response) {
                    resolve(response)
                },
                error: function (jqxhr, status, msg) {
                    reject(msg);
                }
            });
        })
      

    },

    hideThreeSixtyImagetModal: function () {

        $('#ThreeSixtyModel').modal('hide');
    },

    showThreeSixtyImageModal: function () {

        $('#ThreeSixtyModel').modal({ backdrop: 'static', keyboard: false });
        this.addEventListnerToCloseButtons();
    },

    addEventListnerToCloseButtons: function () {
        var scope = this;

        $("#cancelThreeSixtyButton").click(function () {
            editor.notSelected = false
            scope.toRemoveAlltheElement();
            scope.hideThreeSixtyImagetModal();
            scope.removeClassFromElement('threeSixtyImage', 'selectMenubar')
        });
        $("#enlargeThreeSixtyButtonClose").click(function () {

			scope.hideEnlargeModel();
		});
    },

    showEnlargeModel: function () {

		$('#enlargeThreeSixtyImageModal').modal({ backdrop: 'static', keyboard: false });
    },
    
    hideEnlargeModel: function () {

		var a = document.getElementById('enlargeThreeSixtyModal');
		a.src = '';
		$('#enlargeThreeSixtyImageModal').modal('hide');

    },
    
    appendToModal: function (rowCount, number) {
        var scope = this;

        this.modalDiv = document.getElementById('mainThreeSixty');
        this.modalDiv.appendChild(this.rowDiv);

        this.findRow = document.getElementById('row' + rowCount);
        this.findRow.appendChild(this.outerMainDiv);

        this.appendMainBody = document.getElementById('maindiv' + number);
        this.appendMainBody.appendChild(this.bodyForThreeSixtyImageDiv);

        this.imageappend = document.getElementById('secondDiv' + number);
        this.imageappend.appendChild(this.image);
    }

}