
/**
 * Menubar.ScreenshotList( editor ) : Constructor for adding the MySnapshots option in the Menubar
 * @constructor
 * @param {any} editor - The instance of the Editor which manages the overall objects and signals
 * @returns {Object<UI.Panel>}
 * @author Mavelil
 * @example <caption>Example usage of Menubar.ScreenshotList</caption>
 * var menubarScreenshotList = new Menubar.ScreenshotList( editor );
 */

Menubar.ScreenshotList = function(editor) {

    var signals = editor.signals;
    var uid = localStorage.getItem('U_ID');
    var sanpshotListComponent = new SanpshotList( editor );
    var container = new UI.Panel();
    container.setClass('menu');

    var title = new UI.Panel();
    title.setClass('title');
    title.setId('ScreenshotList');
    title.setTextContent( editor.languageData.MySnapshots);
    
    title.onClick(function(event) {
        
        sanpshotListComponent.addClassToElement( 'ScreenshotList' ,
        'selectMenubar');

        sanpshotListComponent.getSnapshotOfCurrentProject( editor.api + 'screenshotlist/' + uid + editor.activeProject.name)
            .then( function ( sanapshotDetails ){

                var numberOfscreenShot = sanapshotDetails.length;
                if (numberOfscreenShot != 0) {
                    
                    sanpshotListComponent.showSnapShotListModel();
                    sanpshotListComponent.createModelForscreenShoot( sanapshotDetails );
                   
                } else {
                   
                    sanpshotListComponent.removeClassFromElement( 'ScreenshotList' , 'selectMenubar' );
                    toastr.error(editor.languageData.NoScreenshotinserve);

                }
            })
            .catch( function ( err) {

                console.log( err)
            })    


    })

    container.add(title);

    return container;

};