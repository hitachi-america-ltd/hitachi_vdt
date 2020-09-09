var CurrentPossition = function ( editor){

    var scope = this;
    this.ui = {};
    this.positionX =20; ;
    this.positiony ;
    this.positionZ ;
    return this;
}

CurrentPossition.prototype = {

    show: function(){

        var scope = this ;
        scope.ui.show();        

    },
    hide : function(){

        var scope = this;
        scope.ui.hide();

    },
    create : function(){
        
        var scope = this;
        
        var posValueFields = document.createElement( 'div' );
        posValueFields.setAttribute( 'class', ' text-center' );
		
		scope.positionX = document.createElement( 'button' );
        scope.positionX.setAttribute( 'class', 'x-position btn btn-default' );
        scope.positionX.innerHTML = '0.0';
        posValueFields.appendChild( scope.positionX );
		
		scope.positiony = document.createElement( 'button' );
        scope.positiony.setAttribute( 'class', 'x-position btn btn-default' );
        scope.positiony.innerHTML = '0.0';
        posValueFields.appendChild( scope.positiony );
		
		
	    scope.positionZ = document.createElement( 'button' );
        scope.positionZ.setAttribute( 'class', 'x-position btn btn-default' );
        scope.positionZ.innerHTML = '0.0';
        posValueFields.appendChild( scope.positionZ );


        scope.ui = new UI.MobileWindow( 'mob-window' );

         scope.headerIconBtn ={};
         scope.headerIconBtn.icon = 'fa fa-map-marker';
         scope.headerIconBtn.id = 'currentpossitonFlag';
         scope.headerIconBtn.style = 'right:25px !important';

        scope.ui.setHeading( editor.languageData.CurrentPosition );

        scope.ui.setHeadingIcon(  scope.headerIconBtn);
        scope.ui.headerIconBtn.addEventListener('click',(event)=>{
            this.setReferencePoint();
        });
        scope.ui.setBody( posValueFields );
        
        scope.ui.dom.style.minHeight = "60px";
        scope.ui.dom.style.width = "180px";
        scope.ui.dom.className += "  currentpostioninfo";
        document.getElementById( 'editorElement' ).appendChild( scope.ui.dom );
        $( '.currentpostioninfo' ).draggable( {
            containment: "parent"
        } );
       

    },
    setcurrent : function(x,y,z){

        var scope = this;
        scope.X = x;
        scope.Y = y;
        scope.Z = z;
        scope.positionX.innerHTML = x;
        scope.positiony.innerHTML = y;
        scope.positionZ.innerHTML = z;
    },
    getcurrentPossition :function (){
        return { X :this.X , Y:this.Y , Z:this.Z}
    },
    setReferencePoint : function(){
        var scope = this;
        var x = scope.X;
        var y = scope.Y;
        var z = scope.Z;
        var pos = new THREE.Vector3(Number(x),Number(y),Number(z));
        var spriteMap = new THREE.TextureLoader().load( "assets/img/flag.png" );
        var spriteMaterial = new THREE.SpriteMaterial( { map: spriteMap, color: 0xffffff } );
        var sprite = new THREE.Sprite( spriteMaterial );
        sprite.scale.set(3, 3, 3);   
        sprite.position.set(Number(x),Number(y),Number(z));       
        sprite.name = "CurrentLocationFlag"
        editor.execute(new AddObjectCommand(sprite));
        editor.signals.objectAdded.dispatch(sprite);
        editor.signals.sceneGraphChanged.dispatch();
    }

}