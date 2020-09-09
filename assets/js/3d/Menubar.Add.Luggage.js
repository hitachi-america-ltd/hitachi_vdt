Menubar.Add.Luggage = function( editor ){

    var position = {x: 0,y: 0,z: 0};
    var preloadModels = new PreloadModel(editor);

    function loadLuggage( luggageSize ){

        var scaleFactor;
        if( luggageSize == 'medium-luggage' )
            scaleFactor = { 'x': 0.15, 'y': 0.15, 'z': 0.15 };
        else
            scaleFactor = { 'x': 0.3, 'y': 0.3, 'z': 0.3 };

        if( editor.scene.userData.luggageObjectCounter === undefined ){
            editor.scene.userData.luggageObjectCounter = 1;
        }
    
        if( editor.scene.userData.luggageDeletedNumber != undefined && editor.scene.userData.luggageDeletedNumber.deletedLuggageArray.length > 0 ){
            var luggageName = "Luggage" + editor.luggageObjectDeletedNumber[0];
            editor.luggageObjectDeletedNumber.splice( 0, 1 );
        } else{
    
            var luggageName = "Luggage" + editor.scene.userData.luggageObjectCounter;
            editor.scene.userData.luggageObjectCounter++;
    
        }    
        
        function castShadow(){
    
            setTimeout( () => {
                var castShadowObject = editor.selected;
                if( castShadowObject && castShadowObject instanceof THREE.Group && castShadowObject.userData && castShadowObject.userData.modelType === 'not-a-base-model' ){
                    castShadowObject.children[0].castShadow = true;
                }
            }, 1500 );
    
        }
        
        async function loadModel(  ){ 
            
            preloadModels.personOrLuggage( position, luggageName, luggageSize, scaleFactor );
            await castShadow();
        }
        loadModel()

    }
    
    var luggage = new UI.Panel();
    luggage.setId('menubar-luggage-list');
    luggage.dom.style.display = 'none';

    var options = new UI.Panel();
	options.setClass('options');
    luggage.add(options);
    
    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent( editor.languageData.Medium );
    option.setId('menubar-add-mediumLuggage');
    option.onClick(function() {

        loadLuggage( 'medium-luggage' );

    });
    options.add(option);

    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent( editor.languageData.Large );
    option.setId('menubar-add-large');
    option.onClick(function() {

        loadLuggage( "large-luggage" );

    });
    options.add(option);


    return luggage;

}