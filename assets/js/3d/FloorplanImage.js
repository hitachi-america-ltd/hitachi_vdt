var FloorplanImage = function (editor) {
    this.editor = editor;
    this.uid = localStorage.getItem('U_ID');
}

FloorplanImage.prototype = {
    addClassToElement: function (id, className) {

        document.getElementById(id).className += " " + className;
    },

    removeClassFromElement: function (id, className) {

        document.getElementById(id).classList.remove(className);

    },

    toRemoveAlltheElement: function () {

        this.Mainelement = document.getElementById("mainFloorplan");
        while (this.Mainelement.firstChild) {
            this.Mainelement.removeChild(this.Mainelement.firstChild);
        }
    },

    createModelForFloorplanImage: function (data) {

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
        this.bodyForFloorplanImage(rowCount, number);

    },

    bodyForFloorplanImage: function (rowCount, number) {

        this.bodyForFloorplanImageDiv = document.createElement('div');
        this.bodyForFloorplanImageDiv.className = 'w3-card-4 user-image-card-3d btn-group';
        this.bodyForFloorplanImageDiv.id = 'secondDiv' + number;
        this.setImageToBody(rowCount, number);

    },
    

    setImageToBody: function (rowCount, number) {
        
        this.image = document.createElement('img');
        this.image.src = editor.modelPath + editor.scene.userData.matterportParameters.info.modelId +'/floorplan/' + this.data[number];
        this.image.className = 'thumbnail-3D enlargeFloorplan'
        this.imageEventListner(rowCount, number);
        
    },

    imageEventListner: function (rowCount, number) {
		var scope = this;
		this.image.addEventListener("click", function () {

			this.enlargeModelModalImagePart = document.getElementById('enlargeFloorplanModal');
			this.enlargeLastPart = this.src.split("/").pop();
			this.enlargeName = document.getElementById('floorplanImageName');

			this.Str = this.enlargeLastPart.substring(this.enlargeLastPart.lastIndexOf("(") + 1, this.enlargeLastPart.lastIndexOf(")"));
			this.enlargeName.innerHTML = this.enlargeLastPart;
			this.enlargeModelModalImagePart.src = this.src;
			scope.showEnlargeModel()

		})

		scope.showNameOfSnapshot(rowCount, number)        
    },

    showNameOfSnapshot: function (rowCount, number) {

		this.nameDiv = document.createElement('div');
		this.nameDiv.className = 'w3-container w3-center user-details-card form-group overfolwfilename';
		this.nameDiv.id = "namediv" + number;
		this.nameParagraph = document.createElement('p');
		this.nameParagraph.id = this.data[number].substring(0, this.data[number].indexOf("."));
        this.nameParagraph.innerHTML = this.data[number].substring();
		this.appendToModal(rowCount, number);

	},

    getFloorplanImage () {
        return new Promise((resolve, reject) => {

            $.ajax({
                url: editor.api + 'matterport/models/floorplan/' + localStorage.getItem('model_id'),
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

    hideFloorplanImagetModal: function () {

        $('#FloorplanModel').modal('hide');
    },

    showFloorplanImageModal: function () {

        $('#FloorplanModel').modal({ backdrop: 'static', keyboard: false });
        this.addEventListnerToCloseButtons();
    },

    addEventListnerToCloseButtons: function () {
        var scope = this;

        $("#cancelFloorplanButton").click(function () {
            editor.notSelected = false
            scope.toRemoveAlltheElement();
            scope.hideFloorplanImagetModal();
            scope.removeClassFromElement('floorplanImage', 'selectMenubar')
        });
        $("#enlargeFloorplanButtonClose").click(function () {

			scope.hideEnlargeModel();
		});
    },

    showEnlargeModel: function () {

		$('#enlargeFloorplanImageModal').modal({ backdrop: 'static', keyboard: false });
    },
    
    hideEnlargeModel: function () {

		var a = document.getElementById('enlargeFloorplanModal');
		a.src = '';
		$('#enlargeFloorplanImageModal').modal('hide');

	},

    appendToModal: function (rowCount, number) {
        var scope = this;

        this.modalDiv = document.getElementById('mainFloorplan');
        this.modalDiv.appendChild(this.rowDiv);

        this.findRow = document.getElementById('row' + rowCount);
        this.findRow.appendChild(this.outerMainDiv);

        this.appendMainBody = document.getElementById('maindiv' + number);
        this.appendMainBody.appendChild(this.bodyForFloorplanImageDiv);

        this.imageappend = document.getElementById('secondDiv' + number);
        this.imageappend.appendChild(this.image);
    }
    
}