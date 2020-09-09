/**
 * @author mrdoob / http://mrdoob.com/
 */

Menubar.File = function (editor) {

    var NUMBER_PRECISION = 6;
    //var saveWorker = new Worker('assets/js/workerlibrary/WebWorker.js');

    /*MODIFIED FOR DROPBOX BUTTON START*/
    dropBoxOptions = {

        // Required. Called when a user selects an item in the Chooser.
        success: function (files) {
            //alert("Here's the file link: " + files[0].link);
            editor.dropBoxUrl = files[0].link;
            if (editor.dropBoxUrl != "" || typeof (editor.dropBoxUrl) != 'undefined') {
                editor.loader.loadFromUrl(editor.dropBoxUrl);
                $('#editor_drop_box_modal').modal('hide');
            }
        },

        // Optional. Called when the user closes the dialog without selecting a file
        // and does not include any parameters.
        cancel: function () {

        },

        // Optional. "preview" (default) is a preview link to the document for sharing,
        // "direct" is an expiring link to download the contents of the file. For more
        // information about link types, see Link types below.
        linkType: "direct", // or "preview"

        // Optional. A value of false (default) limits selection to a single file, while
        // true enables multiple file selection.
        multiselect: false, // or true

        // Optional. This is a list of file extensions. If specified, the user will
        // only be able to select files with these extensions. You may also specify
        // file types, such as "video" or "images" in the list. For more information,
        // see File types below. By default, all extensions are allowed.
        extensions: ['.zip', '.json', '.3ds', '.obj', '.dae', '.dxf', '.dwg'],
    };

    var urlButton = document.getElementById('btn_url_submit');

    urlButton.addEventListener('click', function () {

        var supportedExtns = ['zip', 'json', '3ds', 'obj', 'dae', 'dxf', 'dwg'];
        var url = document.getElementById('text_url').value;
        var mainPath = url.split("/");
        var urlFileName = mainPath[mainPath.length - 1];
        var splitNames = urlFileName.split(".");
        if (splitNames.length <= 1) {
            $('#editor_drop_box_modal').modal('hide');
            alert(editor.languageData.OnlydirectURLissupported);
        } else {
            var ext = splitNames[splitNames.length - 1];
            if (supportedExtns.indexOf(ext) != -1) {
                //var urlFileName = mainPath[mainPath.length-1];
                $('#editor_drop_box_modal').modal('hide');
                editor.loader.loadFromUrl(url);
            } else {
                $('#editor_drop_box_modal').modal('hide');
                alert(editor.languageData.OnlydirectURLissupported);
                return;
            }
        }
    });

    /*MODIFIED FOR DROPBOX BUTTON END*/

    /*MODIFIED FOR DOWNLOADING USER PROJECT DATA START*/
    var exportToLocalDrive = document.getElementById('export-local-drive');

    exportToLocalDrive.addEventListener('click', function () {

        var currentProject = editor.activeProject;
        var projectId = currentProject._id;
        var userId = currentProject.user_id;
        var jsonData = JSON.stringify(currentProject);

        editor.progressBar.updateProgress(editor.languageData.Initializing, 0.0);
        editor.progressBar.show();
        editor.progressBar.updateProgress(editor.languageData.PreparingFiles, 0.10);

        $.ajax({

            url: editor.api + 'project3d/projectzip',
            type: "POST",
            contentType: 'application/json',
            processData: false,
            data: jsonData,
            success: (result) => {

                var projectName = result.data;
                if (result.status == 200) {

                    editor.progressBar.updateProgress(editor.languageData.FinishedProjectConfiguration, 0.99);
                    editor.progressBar.hide();
                    $('#export-project-modal').modal('hide');
                    toastr.success(editor.languageData.ProjectconfiguredforExporting);
                    var projectUrl = editor.path + 'exported_projects/' + 'exported/' + projectName + '.zip';
                    downloadUserProject(projectUrl);

                } else {

                    editor.progressBar.hide();
                    $('#export-project-modal').modal('hide');
                    toastr.error(editor.languageData.ProjectExportingFailed);

                }

            },
            error: (err) => {

                $('#export-project-modal').modal('hide');
                console.log(err);
                toastr.error(editor.languageData.ProjectExportingFailed);

            }
        })
    });

    function downloadUserProject(projectUrl) {

        var linkElement = document.createElement('a');

        try {

            linkElement.setAttribute('href', projectUrl);
            linkElement.setAttribute('download', 'Exported-Project');
            //linkElement.click();
            var clickEvent = new MouseEvent("click", {
                "view": window,
                "bubbles": true,
                "cancelable": false
            });

            linkElement.dispatchEvent(clickEvent);

        }
        catch (error) {

            console.log(error);
            toastr.error('Download Failed');

        }
    }
    /*MODIFIED FOR DOWNLOADING USER PROJECT DATA END*/

    function parseNumber(key, value) {

        return typeof value === 'number' ? parseFloat(value.toFixed(NUMBER_PRECISION)) : value;

    }

    //

    var container = new UI.Panel();
    container.setClass('menu');

    var title = new UI.Panel();
    title.setClass('title');
    title.setTextContent(editor.languageData.File);
    container.add(title);

    var options = new UI.Panel();
    options.setClass('options');
    container.add(options);

    /**********************************************************/
    /*MODIFIED TO ADD A MENU ITEM FOR CREATE NEW PROJECT START*/
    // New Project	

    /**
     * createNewProject( projectDetails, projBaseModal ) - creates a new project using the details provided.
     * @param {Object} projectDetails - details of the project.
     * @param {File} projBaseModal - Basemodel for the project.
     * @return returns the project json data if the request succeeds and an error message in case of failure
     * @author Hari.
     */
    var createNewProject = function (projectDetails, projBaseModal) {

        return new Promise(function (resolve, reject) {

            var getUserProjects = new ApiHandler();
            getUserProjects.prepareRequest({
                method: 'GET',
                url: editor.api + 'projects3d/users/' + localStorage.getItem('U_ID'),
                responseType: 'json',
                isDownload: false,
                formDataNeeded: false,
                formData: ''
            });
            getUserProjects.onStateChange(function (response) {

                var len = response.length,
                    isDuplicate = false;
                for (var i = 0; i < len; i++) {

                    if (projectDetails.name.toLowerCase() == response[i].name.toLowerCase()) {

                        //toastr.info( projectDetails.name + ' already exists!' );
                        //reject( 'alreadyexist' );
                        isDuplicate = true;
                        break;
                        //return;

                    }

                }
                if (!isDuplicate) {

                    editor.activeProject = projectDetails;

                    $('#new-project-3d').modal('hide');
                    //document.getElementById( 'project-title-3d' ).innerHTML = projectDetails.name;

                    var jsonData = JSON.stringify(projectDetails);

                    var data = new FormData();
                    data.append('data', jsonData);
                    if (projBaseModal != undefined) data.append("file", projBaseModal);

                    var createProjectReq = new ApiHandler();
                    createProjectReq.prepareRequest({
                        method: 'POST',
                        url: editor.api + "projects3d",
                        responseType: 'json',
                        isDownload: false,
                        formDataNeeded: true,
                        formData: data
                    });
                    createProjectReq.onStateChange(function (response) {

                        /*MODIFIED TO FIX THE UNSUPPORTED FILE BUG START*/
                        if (response.status != undefined && response.status == 500) {

                            alert(editor.languageData.ProjectcreationfailedUnsupportedfileformat);
                            reject(response);

                        }
                        /*MODIFIED TO FIX THE UNSUPPORTED FILE BUG START*/
                        resolve(response);

                    }, function (error) {

                        console.log(error);
                        reject(error);

                    });

                    //Progress trackers for the http request
                    createProjectReq.setProgressTrackers(function (info) {

                        editor.progressBar.updateProgress(editor.languageData.UploadingFiles, info.progress / 100);
                        //editor.progressBar.show();

                    }, function (info) {

                        if (info.status == 500) {

                            alert(editor.languageData.ProjectcreationfailedUnsupportedfileformat);

                        }
                        editor.progressBar.updateProgress(editor.languageData.DownloadingFiles, Number(info.progress) / 100);

                    });

                    createProjectReq.sendRequest();

                } else {

                    toastr.info(projectDetails.name + editor.languageData.alreadyexists);
                    reject('alreadyexist');

                }

            }, function (error) {

                console.log(error);
                reject(error);

            });
            getUserProjects.sendRequest();

        });

    }

    //This form is used to create a new project by providing the basemodel
    $('#create-project-details-form').validator().on('submit', function (e) {

        if (e.isDefaultPrevented()) {

            // handle the invalid form...
            return;

        } else {

            $('#new-project-3d').modal('hide');
            var curDate = new Date();
            var projectDetails = {

                user_id: localStorage.getItem('U_ID'),
                name: document.getElementById('proj-name').value,
                description: document.getElementById('proj-desc').value,
                location: document.getElementById('proj-loc').value,
                company: document.getElementById('proj-company').value,
                contactInfo: document.getElementById('proj-company-contact').value,
                createdAt: curDate,
                UpdatedAt: ""

            }
            var projBaseModal = document.getElementById('proj-base-modal').files[0];

            if ((projBaseModal.size != undefined) && (projBaseModal.size != null) && (projBaseModal.size > 52428800)) {

                toastr.warning("Import models below 50MB for better performance");

            }

            //Modified for activity logging start
            try {

                var logDatas = {};
                logDatas[moment().format("YYYY-MM-DD HH:mm:ss")] = "User " + localStorage.getItem('firstname') + " " + localStorage.getItem('lastname') + " started creation of project: " + projectDetails.name;
                logger.addLog(logDatas);
                logger.sendLogs(localStorage.getItem('U_ID'));

            }
            catch (exception) {

                console.log("Logging failed!");
                console.log(exception);

            }
            //Modified for activity logging end

            editor.progressBar.show();
            createNewProject(projectDetails, projBaseModal).then(function (response) {

                cleanEditor();
                document.getElementById('project-title-3d').innerHTML = '';

                editor.activeProject = response.body;
                document.getElementById('project-title-3d').innerHTML = editor.activeProject.name;
                toastr.success(editor.languageData.ProjectCreatedAttemptingtoloadfilesfromtheserver);
                editor.loader.openProject(response);
                toastr.info(editor.languageData.Remembertosaveprojectbeforeyouquitthebrowser);

                //Modified for activity logging start
                try {

                    var logDatas = {};
                    logDatas[moment().format("YYYY-MM-DD HH:mm:ss")] = "User " + localStorage.getItem('firstname') + " " + localStorage.getItem('lastname') + " finished creation of project: " + editor.activeProject.name;
                    logger.addLog(logDatas);
                    logger.sendLogs(localStorage.getItem('U_ID'));

                }
                catch (exception) {

                    console.log("Logging failed!");
                    console.log(exception);

                }
                //Modified for activity logging end

            }, function (error) {

                console.log(error);
                editor.activeProject = {};
                editor.progressBar.hide();
                if (error != 'alreadyexist')
                    toastr.error(editor.languageData.SorryanerroroccuredPleasetryaftersometime);

                //Modified for activity logging start
                try {

                    var logDatas = {};
                    logDatas[moment().format("YYYY-MM-DD HH:mm:ss")] = "User " + localStorage.getItem('firstname') + " " + localStorage.getItem('lastname') + " : Error creating project:" + error;
                    logger.addLog(logDatas);
                    logger.sendLogs(localStorage.getItem('U_ID'));

                }
                catch (exception) {

                    console.log("Logging failed!");
                    console.log(exception);

                }
                //Modified for activity logging end

            });

        }
    });

    //options.add( new UI.HorizontalRule() );
    /*MODIFIED TO ADD A MENU ITEM FOR CREATE NEW PROJECT END*/
    /**********************************************************/

    // Open Project
    /****************************************************/
    /*MODIFIED TO ADD A MENU ITEM FOR OPEN PROJECT START*/
    var defaultBodyContent = document.createElement('div');
    defaultBodyContent.id = "open-project-modal-body";
    var openProjectModal = new UI.bootstrapModal("", "open-project-3d", editor.languageData.YourRecentProjects, defaultBodyContent, editor.languageData.Open, editor.languageData.Cancel, "open-project-form");
    openProjectModal.hideFooterButtons();
    document.getElementById('editorElement').appendChild(openProjectModal.dom);

    var onOpenProjectClick = function (paramsArray) {

        if (Object.keys(editor.activeProject).length != 0) {

            if (confirm(editor.languageData.Doyouwishtoabandoncurrentprojectandstartanother) === false) return;
            //editor.clear();
            //editor.deselect();

        }

        document.getElementById('project-title-3d').innerHTML = '';
        //editor.clear();
        //editor.deselect();
        cleanEditor();
        //document.getElementById( 'project-title-3d' ).innerHTML = '';
        editor.checkConnectionSpeed();
        openProjectModal.hide();
        var project = paramsArray[0];
        //editor.progressBar.updateProgress("Opening Project",0);
        //editor.progressBar.show();
        //$('.overlay').show();

        editor.progressBar.updateProgress(editor.languageData.Initializing, 0.0);
        editor.progressBar.show();
        localStorage.setItem('project3d', project.name);

        //Modified for activity logging start
        try {

            //Modified for activity logging start
            var logDatas = {};
            logDatas[moment().format("YYYY-MM-DD HH:mm:ss")] = "User " + localStorage.getItem('firstname') + " " + localStorage.getItem('lastname') + " : Attempting to open project " + project.name;
            logger.addLog(logDatas);
            logger.sendLogs(localStorage.getItem('U_ID'));
            //Modified for activity logging end

        }
        catch (exception) {

            console.log("Logging failed!");
            console.log(exception);

        }
        //Modified for activity logging end

        if (project.updated_at == undefined || project.updated_at == '' || project.updated_at == null) {

            editor.loader.openProject({ status: 200, body: project });

        } else {

            editor.loader.openProject({ status: 'modified', body: project });

        }
        editor.activeProject = project;
        document.getElementById('project-title-3d').innerHTML = project.name;

    }

    /**
     * deleteSnapshotFolder ( folderName) -  function to delete the snapshot folder
     * @param folderName - name of the folder to remove folder name is (user id + project Name)
     * @return  return the json responce from the server if scucess in the server then retun a   message -  message : 'remove files from the disc' if error -  message : 'failed to remove files from the disc'
     */
    var deleteSnapshotFolder = function (folderName) {
        return new Promise(function (resolve, reject) {

            var deleteProjScrenShoot = new ApiHandler();
            deleteProjScrenShoot.prepareRequest({

                method: 'GET',
                url: editor.api + 'projects3dSimulatedview/trash/' + folderName,
                responseType: 'json',
                isDownload: false,
                formDataNeeded: false,
                formData: null

            });
            deleteProjScrenShoot.onStateChange(function (response) {
                resolve(response)
            }, function (error) {

                console.log(error);
                reject(error)

            });
            deleteProjScrenShoot.sendRequest();

        })


    }

    var onDeleteProjectClick = function (paramsArray) {

        var project = paramsArray[0];
        var projDomElement = paramsArray[1];
        if (Object.keys(editor.activeProject).length != 0 && editor.activeProject.name == paramsArray[0].name) {

            if (confirm(editor.languageData.Doyouwishtoremovethecurrentproject) === false)
                return;
            projectID = project._id;
            console.log("Deleted project with id ", projectID)
            $.ajax({
                type: 'DELETE',
                url: editor.api + 'viewmode/project/' + projectID,
                success: function (response) {
                    console.log(response)
                },
                error: function (status) {
                    console.log(status);
                    console.log(err);
                }
            });
            editor.activeProject = {};
            document.getElementById('project-title-3d').innerHTML = '';
            editor.clear();
            cleanEditor();//Modified to clean the editor when the active project is deleted
            editor.deselect();
            if (editor.theatreMode === true) document.getElementById('theatre_button').click();


        }

        //var project = paramsArray[0];
        //var projDomElement = paramsArray[1];

        else if (editor.activeProject.name != project.name) {

            if (confirm(editor.languageData.Areyousureyouwanttoremoveproject + project.name + '?') === false)
                return;

        }

        var deleteProjReq = new ApiHandler();
        deleteProjReq.prepareRequest({

            method: 'GET',
            url: editor.api + 'projects3d/trash/' + project._id,
            responseType: 'json',
            isDownload: false,
            formDataNeeded: false,
            formData: null

        });
        deleteProjReq.onStateChange(function (response) {

            editor.dataManager.init(function () {

                editor.dataManager.clearProjectData(project._id, function (isSuccess) {

                    if (isSuccess === false) {

                        console.log('Datastore for user doesn\'t exist; Creating one...');
                        editor.dataManager.init(function () {

                            editor.dataManager.clearProjectData(project._id, function (isSuccess) {

                                if (isSuccess === false) {

                                    console.warn('DataManager : Failed to remove from the indexedDB, attempts : 2\nItem may be absent from the DB\nProceeding with next operations as this is a non fatal issue');

                                }
                                else {
                                    console.log('Recovered from DB errors :)');
                                }

                                var cardToRemove = document.getElementById(projDomElement.dom.id);
                                if (cardToRemove) {

                                    var parent = cardToRemove.parentNode;
                                    parent.removeChild(cardToRemove);

                                }
                                toastr.success(editor.languageData.Projectremovedsuccessfully);

                                //Modified for activity logging start
                                try {

                                    //Modified for activity logging start
                                    var logDatas = {};
                                    logDatas[moment().format("YYYY-MM-DD HH:mm:ss")] = "User " + localStorage.getItem('firstname') + " " + localStorage.getItem('lastname') + " : Project " + project.name + " : removed";
                                    logger.addLog(logDatas);
                                    logger.sendLogs(localStorage.getItem('U_ID'));
                                    //Modified for activity logging end

                                }
                                catch (exception) {

                                    console.log("Logging failed!");
                                    console.log(exception);

                                }
                                //Modified for activity logging end

                                /* Modified for remove the  SnapshotFolder Start */
                                var sanapShotFolderName = localStorage.getItem('U_ID') + project.name
                                deleteSnapshotFolder(sanapShotFolderName).then(function (message) {

                                    console.log("Successfully  Removed Project Files  ");

                                }).catch(function (message) {

                                    toastr.error(message);

                                });
                                /* Modified for remove the  SnapshotFolder End */

                            });

                        });

                    }
                    else {

                        var cardToRemove = document.getElementById(projDomElement.dom.id);
                        if (cardToRemove) {

                            var parent = cardToRemove.parentNode;
                            parent.removeChild(cardToRemove);

                        }
                        //toastr.success("Project removed successfully");
                        toastr.success(editor.languageData.Projectremovedsuccessfully);

                        //Modified for activity logging start
                        try {

                            //Modified for activity logging start
                            var logDatas = {};
                            logDatas[moment().format("YYYY-MM-DD HH:mm:ss")] = "User " + localStorage.getItem('firstname') + " " + localStorage.getItem('lastname') + " : Project " + project.name + " : removed";
                            logger.addLog(logDatas);
                            logger.sendLogs(localStorage.getItem('U_ID'));
                            //Modified for activity logging end

                        }
                        catch (exception) {

                            console.log("Logging failed!");
                            console.log(exception);

                        }
                        //Modified for activity logging end

                        /* Modified for remove the  SnapshotFolder Start */
                        var sanapShotFolderName = localStorage.getItem('U_ID') + project.name
                        deleteSnapshotFolder(sanapShotFolderName).then(function (message) {

                            console.log("Successfully  Removed Project Files  ");

                        }).catch(function (message) {

                            toastr.error(message);

                        });
                        /* Modified for remove the  SnapshotFolder End */
                    }

                });

            });

        }, function (error) {

            console.log(error);
            toastr.error(editor.languageData.SorrysomethingwentwrongPleasetryagainaftersometime);

            //Modified for activity logging start
            try {

                //Modified for activity logging start
                var logDatas = {};
                logDatas[moment().format("YYYY-MM-DD HH:mm:ss")] = "User " + localStorage.getItem('firstname') + " " + localStorage.getItem('lastname') + " : Project " + project.name + " : remove failed : " + error;
                logger.addLog(logDatas);
                logger.sendLogs(localStorage.getItem('U_ID'));
                //Modified for activity logging end

            }
            catch (exception) {

                console.log("Logging failed!");
                console.log(exception);

            }
            //Modified for activity logging end

        });

        //Progress trackers for the http request
        deleteProjReq.setProgressTrackers(function (info) {

        }, function (info) {

            if (info.status == 500) {

                console.log("Error contacting server!");

            }


        });

        deleteProjReq.sendRequest();



    }

    var genProjectDynamicList = function () {

        var projects, projCount = 0;
        var projModalBody = document.createElement('div');
        projModalBody.className = 'row';

        var defaultModalBodyContent = document.createElement('div');
        defaultModalBodyContent.setAttribute('class', 'text-center');
        defaultModalBodyContent.setAttribute('style', 'font-size: 20px; color: #b5afaf');
        defaultModalBodyContent.innerHTML = ' <strong>' + editor.languageData.Nothingtoshowhere + '</strong>';

        var getProjectsList = new ApiHandler();
        getProjectsList.prepareRequest({
            method: 'GET',
            url: editor.api + 'projects3d/users/' + localStorage.getItem('U_ID'),
            responseType: 'json',
            isDownload: false,
            formDataNeeded: false,
            formData: ''
        });
        getProjectsList.onStateChange(function (result) {
            if (result !== undefined) {
                projects = result;
                if (projects.length != 0) {
                    projects.forEach(function (project) {

                        if (project !== undefined) {
                            if(project.assets != undefined){

                                var cardFooterValue = (project.updated_at != undefined && project.updated_at != null) ? project.updated_at : project.created_at;
                                var card = new UI.BootstrapCard('open-project-card-' + projCount, project.name, project.description, editor.languageData.Open, editor.languageData.Delete, cardFooterValue,project.assets);
                                card.setWraperClass(' col-sm-3');
                                card.setWraperStyle('border: 1px solid #cccccc;padding-left: 0px;padding-right: 0px;');
                                card.setHeaderStyle('font-size: 21px;background-color: #e0e0e0;border-bottom: 1px solid #cccccc;');
                                card.setBodyStyle('padding-top: 18px; height: 102px;');
                                card.setFooterStyle('padding-top: 10px;margin-top: 10px;font-size: 12px;border-top: 1px solid #cccccc;background-color: #e0e0e0;');
                                card.setSubmitCallback(onOpenProjectClick, [project]);
                                card.setCancelCallback(onDeleteProjectClick, [project, card]);

                                projModalBody.appendChild(card.dom);

                            } else {
                                var cardFooterValue = (project.updated_at != undefined && project.updated_at != null) ? project.updated_at : project.created_at;
                                var card = new UI.BootstrapCard('open-project-card-' + projCount, project.name, project.description, editor.languageData.Open, editor.languageData.Delete, cardFooterValue,);
                                card.setWraperClass(' col-sm-3');
                                card.setWraperStyle('border: 1px solid #cccccc;padding-left: 0px;padding-right: 0px;');
                                card.setHeaderStyle('font-size: 21px;background-color: #e0e0e0;border-bottom: 1px solid #cccccc;');
                                card.setBodyStyle('padding-top: 18px; height: 102px;');
                                card.setFooterStyle('padding-top: 10px;margin-top: 10px;font-size: 12px;border-top: 1px solid #cccccc;background-color: #e0e0e0;');
                                card.setSubmitCallback(onOpenProjectClick, [project]);
                                card.setCancelCallback(onDeleteProjectClick, [project, card]);

                                projModalBody.appendChild(card.dom);
                            }
                        }
                        projCount++;

                    });
                    openProjectModal.setModalBody(projModalBody);

                } else {
                    openProjectModal.setModalBody(defaultModalBodyContent);
                }
                openProjectModal.show();
            } else {
                openProjectModal.setModalBody(defaultModalBodyContent);
                openProjectModal.show();
            }

        }, function (response) {

            //request failed
            console.log(response);

        });
        getProjectsList.setProgressTrackers(function (info) {

        }, function (info) {

        });
        getProjectsList.sendRequest();

    }

    //
    //options.add( new UI.HorizontalRule() );
    /*MODIFIED TO ADD A MENU ITEM FOR OPEN PROJECT END*/
    /****************************************************/

    //Save Project
    /****************************************************/
    /*MODIFIED TO ADD A MENU ITEM FOR SAVE PROJECT START*/

    var saveProject = function (jsonData, imageList) {

        return new Promise(function (resolve, reject) {

            /*MODIFIED TO PERFORM INDEXED-DB OPERATIONS START*/
            saveWorker = new Worker('assets/js/workerlibrary/WebWorker.js');

            /*Message listner for saveWorker*/
            saveWorker.onmessage = function (e) {

                if (e.data.status == 200) {

                    try {

                        editor.dataManager.init(function () {

                            editor.dataManager.setProjectData(editor.activeProject._id, jsonData, function (success) {

                                if (success === false) {

                                    console.log('Datastore for user doesn\'t exist; Creating one...');
                                    editor.dataManager.init(function () {

                                        editor.dataManager.setProjectData(editor.activeProject._id, jsonData, function (success) {

                                            if (success === false) {

                                                console.log('Failed to write to the indexedDB, attempts : 2');

                                            }
                                            $('.overlay').hide();
                                            toastr.success(editor.languageData.Projectsavedsuccessfully);
                                            resolve(e.data.body.message);

                                        });

                                    });

                                }
                                else {

                                    $('.overlay').hide();
                                    toastr.success(editor.languageData.Projectsavedsuccessfully);
                                    resolve(e.data.body.message);

                                }

                            });

                        });

                    }
                    catch (error) {

                        resolve('Project saved to cloud, but failed to save in the local storage!');

                    }
                    saveWorker.terminate();

                }
                else if (e.data.status == 'progressing') {

                    editor.progressBar.updateProgress(editor.languageData.SavingProject, (e.data.body.progress) / 100);

                }
                else {

                    reject(e.data.body.message);
                    saveWorker.terminate();

                }


            }

            var workerInput = {};
            workerInput.projectDetails = editor.activeProject;
            workerInput.newData = jsonData;
            if (imageList != undefined && imageList != null) {

                workerInput.imageList = imageList;

            }

            editor.dataManager.init(function () {

                //is this the first save or not
                editor.dataManager.getProjectData(editor.activeProject._id, function (projData) {

                    if (projData === false) {

                        console.log('Data store not found: attempt :1, retrying...');
                        editor.dataManager.init(function () {

                            editor.dataManager.getProjectData(editor.activeProject._id, function (projData) {

                                console.log('succeeded');
                                if (projData != undefined) {

                                    //we are updating the project
                                    workerInput.oldData = projData;

                                }
                                saveWorker.postMessage(workerInput);

                            });

                        });


                    }
                    else {

                        if (projData != undefined) {

                            //we are updating the project
                            workerInput.oldData = projData;

                        }
                        saveWorker.postMessage(workerInput);

                    }

                });

            });

        });

    }

    $('#save-project-details-form').validator().on('submit', function (e) {
        if (e.isDefaultPrevented()) {

            // handle the invalid form...
            return;

        } else {

            // everything looks good!
            $('#proj3d-nobasemodel').modal('hide');
            //$('.overlay').show();

            var curDate = new Date();
            var projectDetails = {

                user_id: localStorage.getItem('U_ID'),
                name: document.getElementById('proj-save-name').value,
                description: document.getElementById('proj-save-desc').value,
                location: document.getElementById('proj-save-loc').value,
                company: document.getElementById('proj-save-company').value,
                contactInfo: document.getElementById('proj-save-company-contact').value,
                createdAt: curDate,
                UpdatedAt: ""

            }
            if(localStorage.getItem("matterport_user") == "true") {
                if( editor.scene.userData.matterportParameters &&  editor.scene.userData.matterportParameters.info )
                    projectDetails.assets = {"Token" : editor.scene.userData.matterportParameters.info.matId}
            }

            editor.progressBar.show();

            //Modified for activity logging start
            try {

                var logDatas = {};
                logDatas[moment().format("YYYY-MM-DD HH:mm:ss")] = "User " + localStorage.getItem('firstname') + " " + localStorage.getItem('lastname') + " started creation of project(Without choosing base-model): " + projectDetails.name;
                logger.addLog(logDatas);
                logger.sendLogs(localStorage.getItem('U_ID'));

            }
            catch (exception) {

                console.log("Logging failed!");
                console.log(exception);

            }
            //Modified for activity logging end

            createNewProject(projectDetails).then(function (response) {

                editor.checkConnectionSpeed();
                if (editor.isntwrkngStarted === true) {

                    var startNetworkingLi = document.getElementById('start-networking-li');
                    if (startNetworkingLi) startNetworkingLi.click();

                }

                if (editor.camLock === true) {
                    document.getElementById('move_with_model_content').click();
                }
                else {
                    editor.sceneCameras.forEach(element => {
                        if (element.isLocked && element.isLocked == true) {
                            document.getElementById('move_with_model_content').click();
                            document.getElementById('move_with_model_content').click();
                        }
                    });
                }

                if (editor.isCableEditingEnabled === true) {

                    var editNetworkCablesLi = document.getElementById('edit-networking-li');
                    editNetworkCablesLi.click();

                }

                if (editor.enableDisableToggle === true) {

                    var enableLengthMeasurementBtn = document.getElementById('enable-measure-mode-li');
                    if (enableLengthMeasurementBtn) enableLengthMeasurementBtn.click();

                }

                if (editor.areaEnableDisableToggle === true) {

                    var enableAreaMeasurementBtn = document.getElementById('area-enable-measure-mode-li');
                    if (enableAreaMeasurementBtn) enableAreaMeasurementBtn.click();

                }

                if (editor.freezflag === true) {

                    var freezeButton = document.getElementById("freeez-btn-content");
                    freezeButton.click();

                }

                if (editor.isTwoDMeasurementEnabled === true) {

                    var enableTwoDMeasurements = document.getElementById('twod-enable-measure-mode-li');
                    enableTwoDMeasurements.click();

                }

                if (editor.twoDDrawingsShowHideToggle === true) {

                    var showHideTwoDMeasurements = document.getElementById('twod-show-measurements-li');
                    showHideTwoDMeasurements.click();

                }

                //editor.progressBar.hide();
                toastr.info(editor.languageData.ProjectcreatedNowsavingthechanges);
                editor.activeProject = response.body;
                document.getElementById('project-title-3d').innerHTML = editor.activeProject.name;

                /*Preparing for the initial project save*/
                console.time('Scene toJSON()');
                var output = editor.scene.toJSON();
                var date = new Date();
                editor.activeProject.UpdatedAt = date;
                output.metadata.info = editor.activeProject;
                console.time('Scene toJSON()');

                var imgList;
                var imgArray, len;
                if (output.images != undefined && output.images != null) {

                    imgList = [];
                    imgArray = output.images;
                    len = imgArray.length;
                    for (var i = 0; i < len; i++) {

                        if (imgArray[i].url != undefined)
                            imgList.push(imgArray[i].url);

                    }

                }

                editor.progressBar.updateProgress(editor.languageData.Preparingtosave, 0.0);

                //Modified for activity logging start
                try {

                    //Modified for activity logging start
                    var logDatas = {};
                    logDatas[moment().format("YYYY-MM-DD HH:mm:ss")] = "User " + localStorage.getItem('firstname') + " " + localStorage.getItem('lastname') + " : Project(Without choosing base-model) created, " + projectDetails.name + " : attempting initial save";
                    logger.addLog(logDatas);
                    logger.sendLogs(localStorage.getItem('U_ID'));
                    //Modified for activity logging end

                }
                catch (exception) {

                    console.log("Logging failed!");
                    console.log(exception);

                }
                //Modified for activity logging end

                saveProject(output, imgList).then(function (message) {

                    toastr.success(editor.languageData.Projectsavedsuccessfully);
                    editor.progressBar.hide();
                    editor.signals.newProjectCreated.dispatch();//Dispatch this signal to indicate that a new project is created

                    //Modified for activity logging start
                    try {

                        //Modified for activity logging start
                        var logDatas = {};
                        logDatas[moment().format("YYYY-MM-DD HH:mm:ss")] = "User " + localStorage.getItem('firstname') + " " + localStorage.getItem('lastname') + " : Project saved successfully , " + editor.activeProject.name;
                        logger.addLog(logDatas);
                        logger.sendLogs(localStorage.getItem('U_ID'));
                        //Modified for activity logging end

                    }
                    catch (exception) {

                        console.log("Logging failed!");
                        console.log(exception);

                    }
                    //Modified for activity logging end

                }, function (message) {

                    toastr.error(editor.languageData.Projectsavefailed);
                    editor.progressBar.hide();

                    //Modified for activity logging start
                    try {

                        //Modified for activity logging start
                        var logDatas = {};
                        logDatas[moment().format("YYYY-MM-DD HH:mm:ss")] = "User " + localStorage.getItem('firstname') + " " + localStorage.getItem('lastname') + " : Error : Project save failed, " + editor.activeProject.name + " - " + message;
                        logger.addLog(logDatas);
                        logger.sendLogs(localStorage.getItem('U_ID'));
                        //Modified for activity logging end

                    }
                    catch (exception) {

                        console.log("Logging failed!");
                        console.log(exception);

                    }
                    //Modified for activity logging end

                });

            }, function (error) {

                console.log(error);
                //toastr.error( "Project creation failed" );
                editor.progressBar.hide();
                if (error != 'alreadyexist')
                    toastr.error(editor.languageData.SorryanerroroccuredPleasetryaftersometime);

                //Modified for activity logging start
                try {

                    //Modified for activity logging start
                    var logDatas = {};
                    logDatas[moment().format("YYYY-MM-DD HH:mm:ss")] = "User " + localStorage.getItem('firstname') + " " + localStorage.getItem('lastname') + " : Error : Project save failed - " + error;
                    logger.addLog(logDatas);
                    logger.sendLogs(localStorage.getItem('U_ID'));
                    //Modified for activity logging end

                }
                catch (exception) {

                    console.log("Logging failed!");
                    console.log(exception);

                }
                //Modified for activity logging end

            });
            
            // Add logging acceptance data start
            if( localStorage.getItem('matterportAccessCount') == 0) {
                $.ajax({
                    url: editor.api + "matterport/model/" + localStorage.getItem('modelId'),
                    dataType: 'json',
                    type: 'PUT',
                    data: {
                        endUserId: localStorage.getItem('email'),
                        count: 1,
                        projectAcceptanceDate: new Date().toISOString()
                    },
                    success: function() {  
                
                        activityLogSuccessForGenerateJSon = function(){
                
                            try{  
                
                                var logDatas = {};
                                logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Started to generate matterport save operation assigning acceptance date "
                                logger.addLog( logDatas );
                                logger.sendLogs( localStorage.getItem( 'U_ID' ) );
                    
                            }
                            catch( exception ){
                    
                                console.log( "Logging failed!" );
                                console.log( exception );
                    
                            }
                        }
                        activityLogSuccessForGenerateJSon();
                    },
                    error: function() {
                        
                        activityLogsFailureForGenerateJSon = function(){
                
                            try{
                    
                                       
                                var logDatas = {};
                                logDatas[ moment().format( "YYYY-MM-DD HH:mm:ss" ) ] = "User " + localStorage.getItem( 'firstname' ) + " " + localStorage.getItem( 'lastname' ) + " : Failed to generate matterport save operation and assigning acceptance date "
                                logger.addLog( logDatas );
                                logger.sendLogs( localStorage.getItem( 'U_ID' ) );
                                
                    
                            }
                            catch( exception ){
                    
                                console.log( "Logging failed!" );
                                console.log( exception );
                    
                            }
                        }
                        activityLogsFailureForGenerateJSon();
                    }
                });
            }

            // Add logging acceptance data end


        }
    });

    /*MODIFIED TO ADD A MENU ITEM FOR SAVE PROJECT END*/
    /****************************************************/

    /*MODIFIED TO ADD CLONE PROJECT START*/
    $('#clone-project-details-form').validator().on('submit', function (e) {
        if (e.isDefaultPrevented()) {

            // handle the invalid form...
            return;

        }
        else {

            // everything looks good!
            $('#proj3d-clone').modal('hide');
            //$('.overlay').show();

            //Modified for activity logging start
            try {

                //Modified for activity logging start
                var logDatas = {};
                logDatas[moment().format("YYYY-MM-DD HH:mm:ss")] = "User " + localStorage.getItem('firstname') + " " + localStorage.getItem('lastname') + " : Attempting to clone project " + editor.activeProject.name;
                logger.addLog(logDatas);
                logger.sendLogs(localStorage.getItem('U_ID'));
                //Modified for activity logging end

            }
            catch (exception) {

                console.log("Logging failed!");
                console.log(exception);

            }
            //Modified for activity logging end

            var curDate = new Date();
            var projectDetails =
            {

                user_id: localStorage.getItem('U_ID'),
                name: document.getElementById('proj-clone-name').value,
                description: document.getElementById('proj-clone-desc').value,
                location: document.getElementById('proj-clone-loc').value,
                company: document.getElementById('proj-clone-company').value,
                contactInfo: document.getElementById('proj-clone-company-contact').value,
                createdAt: curDate,
                UpdatedAt: ""

            }

            var idToBeCloned;
            if (editor.isFromPublishedUrl === false) {

                projectDetails.isIdProjectId = true;
                idToBeCloned = editor.activeProject._id;

            }
            else {

                projectDetails.isIdProjectId = false;
                idToBeCloned = editor.publishedUrlID;

            }

            var getUserProjects = new ApiHandler();
            getUserProjects.prepareRequest({
                method: 'GET',
                url: editor.api + 'projects3d/users/' + localStorage.getItem('U_ID'),
                responseType: 'json',
                isDownload: false,
                formDataNeeded: false,
                formData: ''
            });
            getUserProjects.onStateChange(function (response) {

                var len = response.length, isDuplicate = false;
                for (var i = 0; i < len; i++) {

                    if (projectDetails.name.toLowerCase() == response[i].name.toLowerCase()) {

                        //toastr.info( projectDetails.name + ' already exists!' );
                        isDuplicate = true;
                        break;

                    }

                }
                if (!isDuplicate) {

                    var data = new FormData();
                    data.append('data', JSON.stringify(projectDetails));
                    var cloneProjectReq = new ApiHandler();
                    cloneProjectReq.prepareRequest({
                        method: 'POST',
                        //url: editor.api + "projects3d/clone/" + editor.activeProject._id,
                        url: editor.api + "projects3d/clone/" + idToBeCloned,
                        responseType: 'json',
                        isDownload: false,
                        formDataNeeded: true,
                        formData: data
                    });
                    cloneProjectReq.onStateChange(function (response) {

                        if (Number(response.status) == 200) {

                            toastr.success(editor.languageData.ProjectclonedsuccessfullyThisprojecthasbeenaddedtoyourprojectlists);

                            //Modified for activity logging start
                            try {

                                //Modified for activity logging start
                                var logDatas = {};
                                logDatas[moment().format("YYYY-MM-DD HH:mm:ss")] = "User " + localStorage.getItem('firstname') + " " + localStorage.getItem('lastname') + " : Cloned the project : " + editor.activeProject.name + " and created : " + response.body.name;
                                logger.addLog(logDatas);
                                logger.sendLogs(localStorage.getItem('U_ID'));
                                //Modified for activity logging end

                            }
                            catch (exception) {

                                console.log("Logging failed!");
                                console.log(exception);

                            }
                            //Modified for activity logging end

                        }
                        else if (Number(response.status) == 204) {

                            toastr.info(editor.languageData.YoushouldsavetheprojectbeforeyoucloneSavetheprojectandtryagain);

                        }
                        else if (Number(response.status) == 205) {

                            toastr.info(editor.languageData.Theownerofthisprojecthasdeniedthepermissionforcloning);

                            //Modified for activity logging start
                            try {

                                //Modified for activity logging start
                                var logDatas = {};
                                logDatas[moment().format("YYYY-MM-DD HH:mm:ss")] = "User " + localStorage.getItem('firstname') + " " + localStorage.getItem('lastname') + " : Attempt to clone project : " + editor.activeProject.name + " rejected( permission denied by project owner )";
                                logger.addLog(logDatas);
                                logger.sendLogs(localStorage.getItem('U_ID'));
                                //Modified for activity logging end

                            }
                            catch (exception) {

                                console.log("Logging failed!");
                                console.log(exception);

                            }
                            //Modified for activity logging end

                        }
                        else {

                            toastr.error(editor.languageData.SomethingwentwrongPleasetryagain);

                            //Modified for activity logging start
                            try {

                                //Modified for activity logging start
                                var logDatas = {};
                                logDatas[moment().format("YYYY-MM-DD HH:mm:ss")] = "User " + localStorage.getItem('firstname') + " " + localStorage.getItem('lastname') + " : Error : failed to clone project : " + editor.activeProject.name;
                                logger.addLog(logDatas);
                                logger.sendLogs(localStorage.getItem('U_ID'));
                                //Modified for activity logging end

                            }
                            catch (exception) {

                                console.log("Logging failed!");
                                console.log(exception);

                            }
                            //Modified for activity logging end

                        }

                    }, function (error) {

                        console.log(error);
                        toastr.error(editor.languageData.Errorcontactingserver);

                    });

                    //Progress trackers for the http request
                    cloneProjectReq.setProgressTrackers(function (info) {

                        editor.progressBar.updateProgress(editor.languageData.SendingRequest, info.progress / 100);
                        //editor.progressBar.show();

                    }, function (info) {

                        if (info.status == 500) {

                            toastr.error(editor.languageData.SomethingwentwrongPleasetryagain);

                        }
                        editor.progressBar.updateProgress(editor.languageData.Analysingresponse, Number(info.progress) / 100);

                    });

                    cloneProjectReq.sendRequest();

                } else {

                    toastr.info(projectDetails.name + editor.languageData.alreadyexists);

                }

            }, function (error) {

                console.log(error);
                toastr.error(editor.languageData.Errorcontactingserver);

            });
            getUserProjects.sendRequest();

        }

    });

    /*MODIFIED TO INCLUDE PUBLISH PROJECT IN MENUBAR START*/
    document.getElementById('publish-copy-clipbrd').addEventListener('click', function () {

        var copyFrom = document.getElementById('published-link');
        copyFrom.select();
        document.execCommand('Copy');
        toastr.info(editor.languageData.Copiedtoclipboard);

    });
    document.getElementById('publish-gen-btn').addEventListener('click', function () {

        //Modified for activity logging start
        try {

            //Modified for activity logging start
            var logDatas = {};
            logDatas[moment().format("YYYY-MM-DD HH:mm:ss")] = "User " + localStorage.getItem('firstname') + " " + localStorage.getItem('lastname') + " : Attempting to publish project : " + editor.activeProject.name;
            logger.addLog(logDatas);
            logger.sendLogs(localStorage.getItem('U_ID'));
            //Modified for activity logging end

        }
        catch (exception) {

            console.log("Logging failed!");
            console.log(exception);

        }
        //Modified for activity logging end

        var settings = {};
        settings.clone = document.getElementById('clone-allowed').checked;
        settings.expiry = document.getElementById('expiry-needed').checked;
        settings.expiryValue = document.getElementById('expire-after').value;
        settings.criteria = document.getElementById('publish-expiry-criteria').value;
        var reqParams = { userId: localStorage.getItem('U_ID'), projId: editor.activeProject._id, options: settings };
        reqParams = JSON.stringify(reqParams);
        var fd = new FormData();
        fd.append('reqParams', reqParams);
        var publishRequest = new ApiHandler();
        publishRequest.prepareRequest({

            method: 'post',
            url: editor.api + 'projects3d/url',
            responseType: 'json',
            isDownload: false,
            formDataNeeded: true,
            formData: fd

        });

        publishRequest.onStateChange(function (response) {

            console.log("Done");
            if (Number(response.status) == 200) {

                document.getElementById('published-link').value = response.body.publishedUrl;

                //Modified for activity logging start
                try {

                    //Modified for activity logging start
                    var logDatas = {};
                    logDatas[moment().format("YYYY-MM-DD HH:mm:ss")] = "User " + localStorage.getItem('firstname') + " " + localStorage.getItem('lastname') + " : Successfully published project : " + editor.activeProject.name;
                    logger.addLog(logDatas);
                    logger.sendLogs(localStorage.getItem('U_ID'));
                    //Modified for activity logging end

                }
                catch (exception) {

                    console.log("Logging failed!");
                    console.log(exception);

                }
                //Modified for activity logging end

            }

        }, function (error) {

            console.log(error);

            //Modified for activity logging start
            try {

                //Modified for activity logging start
                var logDatas = {};
                logDatas[moment().format("YYYY-MM-DD HH:mm:ss")] = "User " + localStorage.getItem('firstname') + " " + localStorage.getItem('lastname') + " : Error publishing project : " + editor.activeProject.name + " : " + error;
                logger.addLog(logDatas);
                logger.sendLogs(localStorage.getItem('U_ID'));
                //Modified for activity logging end

            }
            catch (exception) {

                console.log("Logging failed!");
                console.log(exception);

            }
            //Modified for activity logging end

        });

        //Progress trackers for the http request
        publishRequest.setProgressTrackers(function (info) {

            //console.log( 'uploading' );

        }, function (info) {

            //console.log( 'downloading' );
            if (info.status == 500) {

                console.log("Error contacting server!");

            }


        });

        publishRequest.sendRequest();

    });

    //options.add( new UI.HorizontalRule() );

    // Import

    var fileInput = document.createElement('input');
    fileInput.type = 'file';

    fileInput.addEventListener('change', function (event) {

        editor.loader.loadFile(fileInput.files[0]);

    });

    /*MODIFIED FOR IMPORTING SAME FILE MULTIPLE TIMES START*/
    fileInput.addEventListener('click', function () {
        this.value = null;
    });
    /*MODIFIED FOR IMPORTING SAME FILE MULTIPLE TIMES END*/

    /*MODIFIED FOR IMPORTING EXPORTED PROJECTS START*/
    var importProject = document.createElement('input');
    importProject.type = 'file';

    importProject.addEventListener('click', function () {
        this.value = null;
    });

    importProject.addEventListener('change', function () {

        var projNewName = document.querySelector('#local-new-projname').value;
        var fileName = importProject.files[0].name;
        var ext = fileName.split('.').pop().toLowerCase();
        if (ext == "zip")
            editor.loader.loadProject(importProject.files[0], projNewName);
        else
            toastr.error("Unsupported File Format");
        document.querySelector('#local-new-projname').value = ''

    });
    /*MODIFIED FOR IMPORTING EXPORTED PROJECTS START*/

    /*MODIFIED FOR DROP BOX START*/
    // Import using URL

    //

    //

    //options.add(new UI.HorizontalRule()); //commented to avoid this menu
    /*MODIFIED FOR DROP BOX END*/

    // Export Geometry

    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent('Export Geometry');
    option.onClick(function () {

        var object = editor.selected;

        if (object === null) {

            alert(editor.languageData.Noobjectselected);
            return;

        }

        var geometry = object.geometry;

        if (geometry === undefined) {

            alert(editor.languageData.Theselectedobjectdoesnthavegeometry);
            return;

        }

        var output = geometry.toJSON();

        try {

            output = JSON.stringify(output, parseNumber, '\t');
            output = output.replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1');

        } catch (e) {

            output = JSON.stringify(output);

        }

        saveString(output, 'geometry.json');

    });
    //options.add(option); //commented to avoid this menu

    // Export Object

    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent('Export Object');
    option.onClick(function () {

        var object = editor.selected;

        if (object === null) {

            alert(editor.languageData.Noobjectselected);
            return;

        }

        var output = object.toJSON();

        try {

            output = JSON.stringify(output, parseNumber, '\t');
            output = output.replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1');

        } catch (e) {

            output = JSON.stringify(output);

        }

        saveString(output, 'model.json');

    });
    //options.add(option); //commented to avoid this menu

    // Export Scene

    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent('Export Scene');
    option.onClick(function () {

        var output = editor.scene.toJSON();

        try {

            output = JSON.stringify(output, parseNumber, '\t');
            output = output.replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1');

        } catch (e) {

            output = JSON.stringify(output);

        }

        saveString(output, 'scene.json');

    });
    //options.add(option); //commented to avoid this menu

    //

    options.add(new UI.HorizontalRule());

    // Export GLTF

    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent('Export GLTF');
    option.onClick(function () {

        var exporter = new THREE.GLTFExporter();

        exporter.parse(editor.scene, function (result) {

            saveString(JSON.stringify(result, null, 2), 'scene.gltf');

        });


    });
    //options.add( option );

    // Export OBJ

    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent('Export OBJ');
    option.onClick(function () {

        var object = editor.selected;

        if (object === null) {

            alert(editor.languageData.Noobjectselected);
            return;

        }

        var exporter = new THREE.OBJExporter();

        saveString(exporter.parse(object), 'model.obj');

    });
    //options.add(option); //commented to avoid this menu

    // Export STL

    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent('Export STL');
    option.onClick(function () {

        var exporter = new THREE.STLExporter();

        saveString(exporter.parse(editor.scene), 'model.stl');

    });
    //options.add(option); //commented to avoid this menu

    //

    //options.add(new UI.HorizontalRule()); //commented to avoid this menu

    // Clear Editor

    var cleanEditor = function () {

        var activeProjBackup = Object.assign({}, editor.activeProject);

        toastr.clear();
        editor.allReferencePoint = [];
        editor.allPointOfinterest = [];
        editor.cameraDeletCount = 0;
        editor.isFromPublishedUrl = false; // resetting the flag
        editor.preloadModelName = '';
        editor.cameraGeneratingPosition = [];
        editor.cameraGeneratingFlag = false;
        editor.setCamera = 0;
        editor.setCameraRotation = 1;
        editor.referencePointFlag = false;
        editor.referenceLineArray = [];
        editor.rePositionRefpoint = false;
        editor.currentRefpoint = '';
        var title = document.getElementById('threedview');
        title.click();
        //var cameraplay = document.getElementById('playcamera');
        //var cameravalue = cameraplay.innerHTML;
        editor.generateCameraFlag = 0;
        document.getElementById('cameraGenerationPoints').innerText = editor.languageData.MarkCameraPosition;
        if (editor.freezflag) {
            document.getElementById('freeez-btn').click();
        }
        if (!editor.hideAllCamera) {

            document.getElementById('hideAllCameraButton').click()
        }
        if (editor.hideAllFrustum) {
            document.querySelector("#hide-camera-frustum").click();
        }

        if( document.getElementById( 'hide-sensor-frustum' ).checked ){
            document.getElementById( 'hide-sensor-frustum' ).click()
        }

        editor.cameracount = 0;
        editor.selectedView = true;
        editor.cameraDeletedNumber = [];
        document.getElementById('project-title-3d').innerHTML = '';
        editor.activeProject = {};

        editor.lengthBadges = [];
        editor.areaBadges = [];
        editor.lengthEndMarkers = [];
        editor.areaEndMarkers = [];
        editor.nwBadges = [];
        editor.nwMarkers = [];
        editor.refCamBadge = [];
        editor.twoDMeasureBadges = [];
        editor.twoDMeasureMarkers = [];
        editor.cameraPosition = '';
        editor.contextPosition = '';
        editor.currentScaleFactor.copy(editor.zeroVector);
        editor.isRotationControlsClosed = false;
        editor.routingWithHeight = [];
        editor.ceilingHeightin3DUnits = [];

        delete editor.autoRouting.autoRoutingDesigner.modelHeight;
        delete editor.autoRouting.autoRoutingDesigner.basemodel;

        if (editor.scene.userData.junctionBoxCounter != undefined) {
            editor.scene.userData.junctionBoxCounter = 1;
        }
        editor.junctionBoxBadges = [];

        var bgColorInput = document.querySelector('#sidebar-scene-bgcolor-input');
        bgColorInput.value = "#aaaaaa";

        //Modified to clear the units to default unit when the editor is cleared start
        editor.commonMeasurements.setBaseUnit('meter', '1');
        editor.commonMeasurements.setTargetUnit('feet');
        editor.lengthMeasurement.measurementControls.setBaseUnit('meter', '1');
        editor.lengthMeasurement.measurementControls.setTargetUnit('feet');
        editor.areaMeasurement.measurementControls.setBaseUnit('meter', '1');
        editor.areaMeasurement.measurementControls.setTargetUnit('feet');
        editor.networking.networkDesigner.setBaseUnit('meter', '1');
        editor.networking.networkDesigner.setTargetUnit('feet');
        //Modified to clear the units to default unit when the editor is cleared end

        editor.scene.traverse(function (child) {

            if (child instanceof THREE.Mesh && (/^JunctionBox[1-9]+[0-9]*/g).test(child.name)) {
                var mobileWindow = document.getElementById("customheight-mobilewindow" + child.uuid);
                if (mobileWindow && mobileWindow != undefined) {
                    mobileWindow.parentNode.removeChild(mobileWindow);
                }
            }


            if ((child instanceof THREE.Sprite) && ((child.userData.checkDetailsFlag === "set") || (child.userData.checkDetailsFlag === "hidden"))) {

                var detailsTable = document.querySelector('#cam__ref__mobilewindow__' + child.uuid);
                var Dis = document.getElementById(child.uuid + '__row__dis');
                var XPos = document.getElementById(child.uuid + '__valueX');
                var YPos = document.getElementById(child.uuid + '__valueY');
                var ZPos = document.getElementById(child.uuid + '__valueZ');

                if (child.userData.checkDetailsFlag === 'set') {

                    ZPos.parentNode.removeChild(ZPos);
                    YPos.parentNode.removeChild(YPos);
                    XPos.parentNode.removeChild(XPos);
                    Dis.parentNode.removeChild(Dis);
                    detailsTable.parentNode.removeChild(detailsTable);
                    detailsTable.style.display = 'none';

                }
                else if (child.userData.checkDetailsFlag === 'hidden') {

                    child.userData.checkDetailsFlag = 'notset';
                    ZPos.parentNode.removeChild(ZPos);
                    YPos.parentNode.removeChild(YPos);
                    XPos.parentNode.removeChild(XPos);
                    Dis.parentNode.removeChild(Dis);
                    detailsTable.parentNode.removeChild(detailsTable);

                }

            }

        });

        //editor.deletePointofIntrestNumber =[]
        if (editor.pointOfinterestObject) {

            editor.pointOfinterestObject.listHide()
        }
        //Modified to disable the length measurements start
        var enableLengthMeasurementLi = document.getElementById('enable-measure-mode-li');
        if (editor.enableDisableToggle === true) {

            enableLengthMeasurementLi.click();
            //editor.lengthMeasurement.deActivateControls();
            //editor.lengthMeasurement.measurementControls.deActivate();

        }
        //Modified to disable the length measurements end

        //Modified to disable the network cabling start 
        var startNetworkingLi = document.getElementById('start-networking-li');
        if (editor.isntwrkngStarted === true) {

            startNetworkingLi.click();

        }

        var autoRoutingLi = document.querySelector('#start-autorouting-li');
        if (editor.isAutoRoutingStrtd == true) {

            autoRoutingLi.click();

        }

        if (editor.camLock == true) {
            document.getElementById('move_with_model').click();
        }

        if (editor.isCableEditingEnabled === true) {

            var editNetworkCablesLi = document.getElementById('edit-networking-li');
            editNetworkCablesLi.click();

        }

        if (editor.isTwoDMeasurementEnabled === true) {

            var enableTwoDMeasurements = document.getElementById('twod-enable-measure-mode-li');
            enableTwoDMeasurements.click();

        }

        if (editor.twoDDrawingsShowHideToggle === true) {

            var showHideTwoDMeasurements = document.getElementById('twod-show-measurements-li');
            showHideTwoDMeasurements.click();

        }
        var twoDTable = document.getElementById('twoD__measurement__table');
        if (twoDTable.style.display == "block")
            twoDTable.style.display = "none";

        //Modified to disable the network cabling end

        editor.clear();
        editor.deselect();
        if (editor.theatreMode === true) document.getElementById('theatre_button').click();

        /*Point of intrest Data*/
        editor.pointofIntrestNumber = 0;
        editor.deletePointofIntrestNumber = [];
        editor.savepointofIntrestNumber = [];
        /*Point of intrest Data*/

        editor.preloadIcons();

        var positionWindow = document.querySelector('#position-mob-window');
        if (positionWindow) {

            if (positionWindow.style.display == "block") {

                positionWindow.style.display = "none";

            }

        }

        var gridSize = document.querySelector('#change-grid-size');
        var gridUnit = document.querySelector('#change-grid-unit');
        editor.gridSize = 60;
        editor.gridDivision = 198;
        editor.gridUnit = 'feet';
        editor.gridScale = 1;
        gridSize.value = '1';
        gridUnit.value = 'feet';

        editor.signals.gridParametersChanged.dispatch(editor.gridSize, editor.gridDivision, editor.gridScale);

        editor.junctionBoxDeletedNumber = [];

        editor.personObjectDeletedNumber = [];
        editor.luggageObjectDeletedNumber = [];

        editor.smartSensorDeletedNumber  = [];
        //Modified for activity logging start
        try {

            //Modified for activity logging start
            if ((Object.keys(activeProjBackup)).length != 0) {

                var logDatas = {};
                logDatas[moment().format("YYYY-MM-DD HH:mm:ss")] = "User " + localStorage.getItem('firstname') + " " + localStorage.getItem('lastname') + " : Project closed : " + activeProjBackup.name;
                logger.addLog(logDatas);
                logger.sendLogs(localStorage.getItem('U_ID'));

            }
            else {

                var logDatas = {};
                logDatas[moment().format("YYYY-MM-DD HH:mm:ss")] = "User " + localStorage.getItem('firstname') + " " + localStorage.getItem('lastname') + " : Editor cleared";
                logger.addLog(logDatas);
                logger.sendLogs(localStorage.getItem('U_ID'));

            }
            //Modified for activity logging end

        }
        catch (exception) {

            console.log("Logging failed!");
            console.log(exception);

        }
        //Modified for activity logging end

    }

    //

    //CHANGING THE ORDER OF MENUBAR TO NEW LAYOUT START 

    //CREATE PROJECT
    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent(editor.languageData.CreateProject);
    option.onClick(function () {

        editor.select(null);
        if (Object.keys(editor.activeProject).length != 0) {
            if (confirm(editor.languageData.Doyouwishtoabandoncurrentprojectandstartanother) === false) return;
        }
        editor.activeProject = {};
        document.getElementById('create-project-details-form').reset();
        $('#new-project-3d').modal('show');

    });
    options.add(option);

    //IMPORT PROJECT

    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent(editor.languageData.ImportProject);
    option.onClick(function () {

        $('#import-project-modal').modal('show');
        //importProject.click();

    });
    options.add(option);

    //OPEN PROJECT

    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent(editor.languageData.openproject);

    option.onClick(function () {

        genProjectDynamicList();
        openProjectModal.setWidth(90);
        openProjectModal.setModalBodyStyle('margin:20px');

    });

    options.add(option);

    options.add(new UI.HorizontalRule());

    //CLONE PROJECT

    var cloneProjRow = new UI.Row();
    cloneProjRow.setClass('option');
    cloneProjRow.setTextContent(editor.languageData.CloneProject);

    cloneProjRow.onClick(function () {

        if (Object.keys(editor.activeProject).length == 0 && editor.isFromPublishedUrl === false) {

            alert(editor.languageData.Openaprojectthenclickcloneproject);
            return;

        }
        document.getElementById('clone-project-details-form').reset();
        $('#proj3d-clone').modal('show');
        toastr.info(editor.languageData.Pleasebeawarethattheunsavedchangewontbecloned);

    });

    options.add(cloneProjRow);

    //EXPORT PROJECT

    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent(editor.languageData.ExportProject);
    option.onClick(function () {
        if (Object.keys(editor.activeProject).length == 0) {

            alert(editor.languageData.Openaprojectthenclickexportproject);
            return;

        }
        $('#export-project-modal').modal('show');
    });
    options.add(option);

    //PUBLISH PROJECT
    var publishRow = new UI.Row();
    publishRow.setClass('option');
    publishRow.setTextContent(editor.languageData.PublishProject);

    publishRow.onClick(function () {
        editor.select(null);
        if (Object.keys(editor.activeProject).length == 0) {
            alert(editor.languageData.Openaprojectthenclickpublish);
            return;
        }
        document.getElementById('publish-project-details-form').reset();
        $('#publish-project').modal({ backdrop: 'static', keyboard: false });

    });
    options.add(publishRow);

    //SAVE PROJECT
    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent(editor.languageData.SaveProject);

    option.onClick(function () {

        editor.select(null);

        if (editor.isFromPublishedUrl === true) {
            toastr.info(editor.languageData.IfyouwishtocopythisprojectPleaseCloneitinsteadofsaving);

            //Modified for activity logging start
            try {

                var logDatas = {};
                logDatas[moment().format("YYYY-MM-DD HH:mm:ss")] = "User " + localStorage.getItem('firstname') + " " + localStorage.getItem('lastname') + " attempted to save project using published URL(Rejected it can only be cloned): ";
                logger.addLog(logDatas);
                logger.sendLogs(localStorage.getItem('U_ID'));

            }
            catch (exception) {

                console.log("Logging failed!");
                console.log(exception);

            }
            //Modified for activity logging end

            return;
        }
        else if (Object.keys(editor.activeProject).length == 0) {

            document.getElementById('save-project-details-form').reset();
            $('#proj3d-nobasemodel').modal('show');
            return;

        }

        if (editor.enableDisableToggle === true) {

            var enableLengthMeasurementBtn = document.getElementById('enable-measure-mode-li');
            if (enableLengthMeasurementBtn) enableLengthMeasurementBtn.click();

        }

        if (editor.areaEnableDisableToggle === true) {

            var enableAreaMeasurementBtn = document.getElementById('area-enable-measure-mode-li');
            if (enableAreaMeasurementBtn) enableAreaMeasurementBtn.click();

        }

        if (editor.isntwrkngStarted === true) {

            var startNetworkingLi = document.getElementById('start-networking-li');
            if (startNetworkingLi) startNetworkingLi.click();

        }
        if (editor.camLock === true) {
            document.getElementById('move_with_model_content').click();
        }
        else {
            editor.sceneCameras.forEach(element => {
                if (element.isLocked && element.isLocked == true) {
                    document.getElementById('move_with_model_content').click();
                    document.getElementById('move_with_model_content').click();
                }
            });
        }


        if (editor.isCableEditingEnabled === true) {

            var editNetworkCablesLi = document.getElementById('edit-networking-li');
            editNetworkCablesLi.click();

        }

        //Modified to deactivate freeze option during saving a project start

        if (editor.freezflag === true) {

            var freezeButton = document.getElementById("freeez-btn-content");
            freezeButton.click();

        }

        if (editor.isTwoDMeasurementEnabled === true) {

            var enableTwoDMeasurements = document.getElementById('twod-enable-measure-mode-li');
            enableTwoDMeasurements.click();

        }

        if (editor.twoDDrawingsShowHideToggle === true) {

            var showHideTwoDMeasurements = document.getElementById('twod-show-measurements-li');
            showHideTwoDMeasurements.click();

        }

        //Modified for activity logging start
        try {

            //Modified for activity logging start
            var logDatas = {};
            logDatas[moment().format("YYYY-MM-DD HH:mm:ss")] = "User " + localStorage.getItem('firstname') + " " + localStorage.getItem('lastname') + " : Started to save project : " + editor.activeProject.name;
            logger.addLog(logDatas);
            logger.sendLogs(localStorage.getItem('U_ID'));
            //Modified for activity logging end

        }
        catch (exception) {

            console.log("Logging failed!");
            console.log(exception);

        }
        //Modified for activity logging end

        $('.overlay').show();
        setTimeout(function () {

            /*Preparing for the initial project save*/
            console.time('Scene toJSON()');
            var output = editor.scene.toJSON();
            var date = new Date();
            editor.activeProject.UpdatedAt = date;
            output.metadata.info = editor.activeProject;
            console.timeEnd('Scene toJSON()');
            $('.overlay').hide();

            var imgList;
            var imgArray, len;
            if (output.images != undefined && output.images != null) {

                imgList = [];
                imgArray = output.images;
                len = imgArray.length;
                for (var i = 0; i < len; i++) {

                    if (imgArray[i].url != undefined)
                        imgList.push(imgArray[i].url);

                }

            }

            editor.progressBar.updateProgress(editor.languageData.Preparingtosave, 0.0);
            editor.progressBar.show();
            editor.checkConnectionSpeed();
            saveProject(output, imgList).then(function (message) {

                toastr.success(editor.languageData.Projectsavedsuccessfully);
                editor.progressBar.hide();

                //Modified for activity logging start
                try {

                    //Modified for activity logging start
                    var logDatas = {};
                    logDatas[moment().format("YYYY-MM-DD HH:mm:ss")] = "User " + localStorage.getItem('firstname') + " " + localStorage.getItem('lastname') + " : Project : " + editor.activeProject.name + " saved successfully";
                    logger.addLog(logDatas);
                    logger.sendLogs(localStorage.getItem('U_ID'));
                    //Modified for activity logging end

                }
                catch (exception) {

                    console.log("Logging failed!");
                    console.log(exception);

                }
                //Modified for activity logging end

            }, function (message) {

                toastr.error(editor.languageData.Failedtosavetheproject);
                editor.progressBar.hide();

                //Modified for activity logging start
                try {

                    //Modified for activity logging start
                    var logDatas = {};
                    logDatas[moment().format("YYYY-MM-DD HH:mm:ss")] = "User " + localStorage.getItem('firstname') + " " + localStorage.getItem('lastname') + " : Project : " + editor.activeProject.name + ", save failed";
                    logger.addLog(logDatas);
                    logger.sendLogs(localStorage.getItem('U_ID'));
                    //Modified for activity logging end

                }
                catch (exception) {

                    console.log("Logging failed!");
                    console.log(exception);

                }
                //Modified for activity logging end

            });

        }, 500);

    });

    options.add(option);
    options.add(new UI.HorizontalRule());

    //IMPORT FILE OR MODEL
    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent(editor.languageData.Import);
    option.onClick(function () {

        fileInput.click();

    });
    options.add(option);

    //UPLOAD FILE OR MODEL
    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent(editor.languageData.Upload);
    option.onClick(function () {
        editor.dropBoxUrl = "";
        var tBox = document.getElementById('text_url');
        tBox.value = null;
        $('#editor_drop_box_modal').modal('show');
    });
    options.add(option);
    options.add(new UI.HorizontalRule());

    //CLEAR EDITOR

    var option = new UI.Row();
    option.setClass('option');
    option.setId('editor-reset');
    option.setTextContent(editor.languageData.ClearEditor);
    option.onClick(function () {

        if (confirm(editor.languageData.AnyunsaveddatawillbelostAreyousure)) {

            cleanEditor();

        }

    });
    options.add(option);

    //CHANGING THE ORDER OF MENUBAR TO NEW LAYOUT END

    // Publish

    /*var option = new UI.Row();
    option.setClass( 'option' );
    option.setTextContent( 'Publish' );
    option.onClick( function () {

    	var zip = new JSZip();

    	//

    	var output = editor.toJSON();
    	output.metadata.type = 'App';
    	delete output.history;

    	var vr = output.project.vr;

    	output = JSON.stringify( output, parseNumber, '\t' );
    	output = output.replace( /[\n\t]+([\d\.e\-\[\]]+)/g, '$1' );

    	zip.file( 'app.json', output );

    	//

    	var manager = new THREE.LoadingManager( function () {

    		save( zip.generate( { type: 'blob' } ), 'download.zip' );

    	} );

    	var loader = new THREE.FileLoader( manager );
    	loader.load( 'js/libs/app/index.html', function ( content ) {

    		var includes = [];

    		if ( vr ) {

    			includes.push( '<script src="js/VRControls.js"></script>' );
    			includes.push( '<script src="js/VREffect.js"></script>' );
    			includes.push( '<script src="js/WebVR.js"></script>' );

    		}

    		content = content.replace( '<!-- includes -->', includes.join( '\n\t\t' ) );

    		zip.file( 'index.html', content );

    	} );
    	loader.load( 'js/libs/app.js', function ( content ) {

    		zip.file( 'js/app.js', content );

    	} );
    	loader.load( '../build/three.min.js', function ( content ) {

    		zip.file( 'js/three.min.js', content );

    	} );

    	if ( vr ) {

    		loader.load( '../examples/js/controls/VRControls.js', function ( content ) {

    			zip.file( 'js/VRControls.js', content );

    		} );

    		loader.load( '../examples/js/effects/VREffect.js', function ( content ) {

    			zip.file( 'js/VREffect.js', content );

    		} );

    		loader.load( '../examples/js/WebVR.js', function ( content ) {

    			zip.file( 'js/WebVR.js', content );

    		} );

    	}

    } );
    options.add( option );*/

    /*
    // Publish (Dropbox)

    var option = new UI.Row();
    option.setClass( 'option' );
    option.setTextContent( 'Publish (Dropbox)' );
    option.onClick( function () {

    	var parameters = {
    		files: [
    			{ 'url': 'data:text/plain;base64,' + window.btoa( "Hello, World" ), 'filename': 'app/test.txt' }
    		]
    	};

    	Dropbox.save( parameters );

    } );
    options.add( option );
    */


    //
    /*var option = new UI.Row();
    option.setClass( 'option' );
    option.setTextContent( 'Export JSON' );
    option.onClick( function () {

    	var output = editor.scene.toJSON();

    	try {

    		output = JSON.stringify( output, parseNumber, '\t' );
    		output = output.replace( /[\n\t]+([\d\.e\-\[\]]+)/g, '$1' );

    	} catch ( e ) {

    		output = JSON.stringify( output );

    	}

    	saveString( output, 'Jsonfile.json' );

    } );
    options.add( option );*/

    var link = document.createElement('a');
    link.style.display = 'none';
    document.body.appendChild(link); // Firefox workaround, see #6594

    /*MODIFIED FOR DROPBOX BUTTON START*/
    var button = Dropbox.createChooseButton(dropBoxOptions);
    document.getElementById("drop_box_button").appendChild(button);
    /*MODIFIED FOR DROPBOX BUTTON END*/

    function save(blob, filename) {

        link.href = URL.createObjectURL(blob);
        link.download = filename || 'data.json';
        link.click();

        // URL.revokeObjectURL( url ); breaks Firefox...

    }

    function saveString(text, filename) {

        save(new Blob([text], { type: 'text/plain' }), filename);

    }
    var exportToDropBoxBtn = document.querySelector('#export-dropbox-btn');
    exportToDropBoxBtn.addEventListener('click', function (event) {
        $('#export-dropbox-btn').modal('hide');
        $.ajax({
            type: 'POST',
            url: editor.api + 'projectZipForDropbox',
            data: editor.activeProject,
            success: function (res) {
                //var pathToZip = encodeURI(editor.path+(res.body.relativePathToZip).replace(/\\/g,'/'));
                var pathToZip = encodeURI(editor.path + res.body.relativePathToZip);

                console.log(pathToZip);

                var options = {
                    files: [
                        { 'url': pathToZip },
                    ],
                    success: function () {

                        toastr.success("Success! Files saved to your Dropbox.");
                        editor.progressBar.hide();

                    },
                    cancel: function () {
                        toastr.warning("Action aborted by user");
                        editor.progressBar.hide();
                    },
                    progress: function (progress) {
                        editor.progressBar.updateProgress("Exporting", progress * 100);
                    },
                    error: function (errorMessage) {
                        toastr.error(errorMessage);
                        editor.progressBar.hide();
                    }
                };
                editor.progressBar.updateProgress("Initializing", 0);
                editor.progressBar.show();
                Dropbox.save(options);
            },
            error: function (error) {
                toastr.error(error);
            }
        });
    });

    var importFromLocal = document.querySelector('#import-local-drive');
    importFromLocal.addEventListener('click', function (event) {
        $('#import-project-modal').modal('hide');
        var projNewName = document.querySelector('#local-new-projname').value;;

        if (projNewName != null && projNewName != '' && projNewName != undefined && !projNewName.includes('.') && !projNewName.includes('/') && !projNewName.includes('\\')) {
            importProject.click();
        }
        else {
            toastr.error("Please enter a valid project name");
            document.querySelector('#local-new-projname').value = ''
        }

    });

    var importFromDropBox = document.querySelector('#import-dropbox-btn');
    importFromDropBox.addEventListener('click', function (event) {

        $('#import-project-modal').modal('hide');
        var newProjNmeForDropBx = document.querySelector('#dropbox-new-projname').value;

        if (newProjNmeForDropBx != null && newProjNmeForDropBx != undefined && newProjNmeForDropBx != '' && !newProjNmeForDropBx.includes('.') && !newProjNmeForDropBx.includes('/') && !newProjNmeForDropBx.includes('\\')) {
            var chooserOptions = {

                success: function (files) {

                    editor.progressBar.updateProgress('Importing', 0.1);
                    editor.progressBar.show();
                    editor.loader.loadProjectFromDropBox(files[0].link, newProjNmeForDropBx);
                },
                cancel: function () {
                    toastr.warning("Action aborted by user");
                },
                linkType: "direct",
                multiselect: false,
                extensions: ['.zip'],
                folderselect: false,
            };

            Dropbox.choose(chooserOptions);
        }
        else {
            toastr.error("Please enter a valid project name");
            document.querySelector('#dropbox-new-projname').value = '';
        }
        document.querySelector('#dropbox-new-projname').value = '';
    });



    return container;

};