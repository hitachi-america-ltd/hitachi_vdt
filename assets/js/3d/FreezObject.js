
/**
 * FreezObject( editor ) : Constructor for freezing the objects excpet camera
 * @constructor
 * @param {any} object - The object tree from which the non camera elements must be sorted
 * @param {any} editor - The instance of the Editor which manages the overall objects and signals
 * @returns {Void}
 * @author Hari
 * @example <caption>Example usage of FreezObject</caption>
 * var freezObject = new FreezObject( editor );
 */

var FreezObject = function(object,editor){			
	var data = [];
	var position = [];
	object.forEach(function(element,index){
		if( ( element instanceof THREE.PerspectiveCamera ) || ( element instanceof THREE.Sprite && element.camerauuid ) ){
			return;
		} else if( element instanceof THREE.Group && element.category === "sensorCategory" ){
			return;
		}	
		else{
			data[index] = element;
			
		}
	})
	editor.previousfreezeObject = data;
	this.objects = data;
}
FreezObject.prototype = {

	/**
     * freezall( ) - Method to freeze objects except camera
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of freezall method.</caption>
     * freezObject.freezall( );
     */

	freezall:function(){
		this.objects.forEach(function(element,index){
			editor.deselect();
			element.matrixAutoUpdate = false;	
		})

	},

	/**
     * removeFreez( ) - Method to unfreeze objects except camera
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of removeFreez method.</caption>
     * freezObject.removeFreez( );
     */

	removeFreez:function(){

		this.objects.forEach(function(element,index){
			element.matrixAutoUpdate = true;
			
			

		});
	}
}	