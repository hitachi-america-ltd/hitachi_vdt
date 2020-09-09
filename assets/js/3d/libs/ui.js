/**
 * @author mrdoob / http://mrdoob.com/
 */

var UI = {};

UI.Element = function ( dom ) {

	this.dom = dom;

};

UI.Element.prototype = {

	add: function () {

		for ( var i = 0; i < arguments.length; i ++ ) {

			var argument = arguments[ i ];

			if ( argument instanceof UI.Element ) {

				this.dom.appendChild( argument.dom );

			} else {

				console.error( 'UI.Element:', argument, 'is not an instance of UI.Element.' );

			}

		}

		return this;

	},

	remove: function () {

		for ( var i = 0; i < arguments.length; i ++ ) {

			var argument = arguments[ i ];

			if ( argument instanceof UI.Element ) {

				this.dom.removeChild( argument.dom );

			} else {

				console.error( 'UI.Element:', argument, 'is not an instance of UI.Element.' );

			}

		}

		return this;

	},

	clear: function () {

		while ( this.dom.children.length ) {

			this.dom.removeChild( this.dom.lastChild );

		}

	},

	setId: function ( id ) {

		this.dom.id = id;

		return this;

	},

	setClass: function ( name ) {

		this.dom.className = name;

		return this;

	},

	setStyle: function ( style, array ) {

		for ( var i = 0; i < array.length; i ++ ) {

			this.dom.style[ style ] = array[ i ];

		}

		return this;

	},

	setDisabled: function ( value ) {

		this.dom.disabled = value;

		return this;

	},

	setTextContent: function ( value ) {

		this.dom.textContent = value;

		return this;

	}

};

// properties

var properties = [ 'position', 'left', 'top', 'right', 'bottom', 'width', 'height', 'border', 'borderLeft',
'borderTop', 'borderRight', 'borderBottom', 'borderColor', 'display', 'overflow', 'margin', 'marginLeft', 'marginTop', 'marginRight', 'marginBottom', 'padding', 'paddingLeft', 'paddingTop', 'paddingRight', 'paddingBottom', 'color',
'background', 'backgroundColor', 'opacity', 'fontSize', 'fontWeight', 'textAlign', 'textDecoration', 'textTransform', 'cursor', 'zIndex' ];

properties.forEach( function ( property ) {

	var method = 'set' + property.substr( 0, 1 ).toUpperCase() + property.substr( 1, property.length );

	UI.Element.prototype[ method ] = function () {

		this.setStyle( property, arguments );

		return this;

	};

} );

// events

var events = [ 'KeyUp', 'KeyDown', 'MouseOver', 'MouseOut', 'Click', 'DblClick', 'Change' ];

events.forEach( function ( event ) {

	var method = 'on' + event;

	UI.Element.prototype[ method ] = function ( callback ) {

		this.dom.addEventListener( event.toLowerCase(), callback.bind( this ), false );

		return this;

	};

} );

// Span

UI.Span = function () {

	UI.Element.call( this );

	this.dom = document.createElement( 'span' );

	return this;

};

UI.Span.prototype = Object.create( UI.Element.prototype );
UI.Span.prototype.constructor = UI.Span;

// Div

UI.Div = function () {

	UI.Element.call( this );

	this.dom = document.createElement( 'div' );

	return this;

};

UI.Div.prototype = Object.create( UI.Element.prototype );
UI.Div.prototype.constructor = UI.Div;

// Row

UI.Row = function () {

	UI.Element.call( this );

	var dom = document.createElement( 'div' );
	dom.className = 'Row';

	this.dom = dom;

	return this;

};

UI.Row.prototype = Object.create( UI.Element.prototype );
UI.Row.prototype.constructor = UI.Row;

// Panel

UI.Panel = function () {

	UI.Element.call( this );

	var dom = document.createElement( 'div' );
	dom.className = 'Panel';

	this.dom = dom;

	return this;

};

UI.Panel.prototype = Object.create( UI.Element.prototype );
UI.Panel.prototype.constructor = UI.Panel;

// Text

UI.Text = function ( text ) {

	UI.Element.call( this );

	var dom = document.createElement( 'span' );
	dom.className = 'Text';
	dom.style.cursor = 'default';
	dom.style.display = 'inline-block';
	dom.style.verticalAlign = 'middle';

	this.dom = dom;
	this.setValue( text );

	return this;

};

UI.Text.prototype = Object.create( UI.Element.prototype );
UI.Text.prototype.constructor = UI.Text;

UI.Text.prototype.getValue = function () {

	return this.dom.textContent;

};

UI.Text.prototype.setValue = function ( value ) {

	if ( value !== undefined ) {

		this.dom.textContent = value;

	}

	return this;

};


// Input

UI.Input = function ( text ) {

	UI.Element.call( this );

	var scope = this;

	var dom = document.createElement( 'input' );
	dom.className = 'Input';
	dom.style.padding = '2px';
	dom.style.border = '1px solid transparent';

	dom.addEventListener( 'keydown', function ( event ) {

		event.stopPropagation();

	}, false );

	this.dom = dom;
	this.setValue( text );

	return this;

};

UI.Input.prototype = Object.create( UI.Element.prototype );
UI.Input.prototype.constructor = UI.Input;

UI.Input.prototype.getValue = function () {

	return this.dom.value;

};

UI.Input.prototype.setValue = function ( value ) {

	this.dom.value = value;

	return this;

};

//Label

UI.Label = function ( label ) {
	UI.Element.call( this );

	var dom = document.createElement( 'label' );
	this.dom = dom;
	this.dom.innerHTML = label;
	return this;
};

UI.Label.prototype = Object.create( UI.Element.prototype );
UI.Label.prototype.constructor = UI.Label;

UI.Label.prototype.setFor = function( id ){
	this.dom.for = id;
};


// TextArea

UI.TextArea = function () {

	UI.Element.call( this );

	var scope = this;

	var dom = document.createElement( 'textarea' );
	dom.className = 'TextArea';
	dom.style.padding = '2px';
	dom.spellcheck = false;

	dom.addEventListener( 'keydown', function ( event ) {

		event.stopPropagation();

		if ( event.keyCode === 9 ) {

			event.preventDefault();

			var cursor = dom.selectionStart;

			dom.value = dom.value.substring( 0, cursor ) + '\t' + dom.value.substring( cursor );
			dom.selectionStart = cursor + 1;
			dom.selectionEnd = dom.selectionStart;

		}

	}, false );

	this.dom = dom;

	return this;

};

UI.TextArea.prototype = Object.create( UI.Element.prototype );
UI.TextArea.prototype.constructor = UI.TextArea;

UI.TextArea.prototype.getValue = function () {

	return this.dom.value;

};

UI.TextArea.prototype.setValue = function ( value ) {

	this.dom.value = value;

	return this;

};


// Select

UI.Select = function () {

	UI.Element.call( this );

	var scope = this;

	var dom = document.createElement( 'select' );
	dom.className = 'Select';
	dom.style.padding = '2px';

	this.dom = dom;

	return this;

};

UI.Select.prototype = Object.create( UI.Element.prototype );
UI.Select.prototype.constructor = UI.Select;

UI.Select.prototype.setMultiple = function ( boolean ) {

	this.dom.multiple = boolean;

	return this;

};

UI.Select.prototype.setOptions = function ( options ) {

	var selected = this.dom.value;

	while ( this.dom.children.length > 0 ) {

		this.dom.removeChild( this.dom.firstChild );

	}

	for ( var key in options ) {

		var option = document.createElement( 'option' );
		option.value = key;
		option.innerHTML = options[ key ];
		this.dom.appendChild( option );

	}

	this.dom.value = selected;

	return this;

};

UI.Select.prototype.getValue = function () {

	return this.dom.value;

};

UI.Select.prototype.setValue = function ( value ) {

	value = String( value );

	if ( this.dom.value !== value ) {

		this.dom.value = value;

	}

	return this;

};

// Checkbox

UI.Checkbox = function ( boolean ) {

	UI.Element.call( this );

	var scope = this;

	var dom = document.createElement( 'input' );
	dom.className = 'Checkbox';
	dom.type = 'checkbox';

	this.dom = dom;
	this.setValue( boolean );

	return this;

};

UI.Checkbox.prototype = Object.create( UI.Element.prototype );
UI.Checkbox.prototype.constructor = UI.Checkbox;

UI.Checkbox.prototype.getValue = function () {

	return this.dom.checked;

};

UI.Checkbox.prototype.setValue = function ( value ) {

	if ( value !== undefined ) {

		this.dom.checked = value;

	}

	return this;

};


// Color

UI.Color = function () {

	UI.Element.call( this );

	var scope = this;

	var dom = document.createElement( 'input' );
	dom.className = 'Color';
	dom.style.width = '64px';
	dom.style.height = '17px';
	dom.style.border = '0px';
	dom.style.padding = '2px';
	dom.style.backgroundColor = 'transparent';

	try {

		dom.type = 'color';
		dom.value = '#ffffff';

	} catch ( exception ) {}

	this.dom = dom;

	return this;

};

UI.Color.prototype = Object.create( UI.Element.prototype );
UI.Color.prototype.constructor = UI.Color;

UI.Color.prototype.getValue = function () {

	return this.dom.value;

};

UI.Color.prototype.getHexValue = function () {

	return parseInt( this.dom.value.substr( 1 ), 16 );

};

UI.Color.prototype.setValue = function ( value ) {

	this.dom.value = value;

	return this;

};

UI.Color.prototype.setHexValue = function ( hex ) {

	this.dom.value = '#' + ( '000000' + hex.toString( 16 ) ).slice( - 6 );

	return this;

};


// Number

UI.Number = function ( number ) {

	UI.Element.call( this );

	var scope = this;

	var dom = document.createElement( 'input' );
	dom.className = 'Number';
	dom.value = '0.00';

	dom.addEventListener( 'keydown', function ( event ) {

		event.stopPropagation();

		if ( event.keyCode === 13 ) dom.blur();

	}, false );

	this.value = 0;

	this.min = - Infinity;
	this.max = Infinity;

	this.precision = 2;
	this.step = 1;
	this.unit = '';

	this.dom = dom;

	this.setValue( number );

	var changeEvent = document.createEvent( 'HTMLEvents' );
	changeEvent.initEvent( 'change', true, true );

	var distance = 0;
	var onMouseDownValue = 0;

	var pointer = [ 0, 0 ];
	var prevPointer = [ 0, 0 ];

	function onMouseDown( event ) {

		event.preventDefault();

		distance = 0;

		onMouseDownValue = scope.value;

		prevPointer = [ event.clientX, event.clientY ];

		document.addEventListener( 'mousemove', onMouseMove, false );
		document.addEventListener( 'mouseup', onMouseUp, false );

	}

	function onMouseMove( event ) {

		var currentValue = scope.value;

		pointer = [ event.clientX, event.clientY ];

		distance += ( pointer[ 0 ] - prevPointer[ 0 ] ) - ( pointer[ 1 ] - prevPointer[ 1 ] );

		var value = onMouseDownValue + ( distance / ( event.shiftKey ? 5 : 50 ) ) * scope.step;
		value = Math.min( scope.max, Math.max( scope.min, value ) );

		if ( currentValue !== value ) {

			scope.setValue( value );
			dom.dispatchEvent( changeEvent );

		}

		prevPointer = [ event.clientX, event.clientY ];

	}

	function onMouseUp( event ) {

		document.removeEventListener( 'mousemove', onMouseMove, false );
		document.removeEventListener( 'mouseup', onMouseUp, false );

		if ( Math.abs( distance ) < 2 ) {

			dom.focus();
			dom.select();

		}

	}

	function onChange( event ) {

		scope.setValue( dom.value );

	}

	function onFocus( event ) {

		dom.style.backgroundColor = '';
		dom.style.cursor = '';

	}

	function onBlur( event ) {

		dom.style.backgroundColor = 'transparent';
		dom.style.cursor = 'col-resize';

	}

	onBlur();

	dom.addEventListener( 'mousedown', onMouseDown, false );
	dom.addEventListener( 'change', onChange, false );
	dom.addEventListener( 'focus', onFocus, false );
	dom.addEventListener( 'blur', onBlur, false );

	return this;

};

UI.Number.prototype = Object.create( UI.Element.prototype );
UI.Number.prototype.constructor = UI.Number;

UI.Number.prototype.getValue = function () {

	return this.value;

};

UI.Number.prototype.setValue = function ( value ) {

	if ( value !== undefined ) {

		value = parseFloat( value );

		if ( value < this.min ) value = this.min;
		if ( value > this.max ) value = this.max;

		this.value = value;
		this.dom.value = value.toFixed( this.precision );

		if ( this.unit !== '' ) this.dom.value += ' ' + this.unit;

	}

	return this;

};

UI.Number.prototype.setPrecision = function ( precision ) {

	this.precision = precision;

	return this;

};

UI.Number.prototype.setStep = function ( step ) {

	this.step = step;

	return this;

};

UI.Number.prototype.setRange = function ( min, max ) {

	this.min = min;
	this.max = max;

	return this;

};

UI.Number.prototype.setUnit = function ( unit ) {

	this.unit = unit;

	return this;

};

// Integer

UI.Integer = function ( number ) {

	UI.Element.call( this );

	var scope = this;

	var dom = document.createElement( 'input' );
	dom.className = 'Number';
	dom.value = '0';

	dom.addEventListener( 'keydown', function ( event ) {

		event.stopPropagation();

	}, false );

	this.value = 0;

	this.min = - Infinity;
	this.max = Infinity;

	this.step = 1;

	this.dom = dom;

	this.setValue( number );

	var changeEvent = document.createEvent( 'HTMLEvents' );
	changeEvent.initEvent( 'change', true, true );

	var distance = 0;
	var onMouseDownValue = 0;

	var pointer = [ 0, 0 ];
	var prevPointer = [ 0, 0 ];

	function onMouseDown( event ) {

		event.preventDefault();

		distance = 0;

		onMouseDownValue = scope.value;

		prevPointer = [ event.clientX, event.clientY ];

		document.addEventListener( 'mousemove', onMouseMove, false );
		document.addEventListener( 'mouseup', onMouseUp, false );

	}

	function onMouseMove( event ) {

		var currentValue = scope.value;

		pointer = [ event.clientX, event.clientY ];

		distance += ( pointer[ 0 ] - prevPointer[ 0 ] ) - ( pointer[ 1 ] - prevPointer[ 1 ] );

		var value = onMouseDownValue + ( distance / ( event.shiftKey ? 5 : 50 ) ) * scope.step;
		value = Math.min( scope.max, Math.max( scope.min, value ) ) | 0;

		if ( currentValue !== value ) {

			scope.setValue( value );
			dom.dispatchEvent( changeEvent );

		}

		prevPointer = [ event.clientX, event.clientY ];

	}

	function onMouseUp( event ) {

		document.removeEventListener( 'mousemove', onMouseMove, false );
		document.removeEventListener( 'mouseup', onMouseUp, false );

		if ( Math.abs( distance ) < 2 ) {

			dom.focus();
			dom.select();

		}

	}

	function onChange( event ) {

		scope.setValue( dom.value );

	}

	function onFocus( event ) {

		dom.style.backgroundColor = '';
		dom.style.cursor = '';

	}

	function onBlur( event ) {

		dom.style.backgroundColor = 'transparent';
		dom.style.cursor = 'col-resize';

	}

	onBlur();

	dom.addEventListener( 'mousedown', onMouseDown, false );
	dom.addEventListener( 'change', onChange, false );
	dom.addEventListener( 'focus', onFocus, false );
	dom.addEventListener( 'blur', onBlur, false );

	return this;

};

UI.Integer.prototype = Object.create( UI.Element.prototype );
UI.Integer.prototype.constructor = UI.Integer;

UI.Integer.prototype.getValue = function () {

	return this.value;

};

UI.Integer.prototype.setValue = function ( value ) {

	if ( value !== undefined ) {

		value = parseInt( value );

		this.value = value;
		this.dom.value = value;

	}

	return this;

};

UI.Integer.prototype.setStep = function ( step ) {
	
	this.step = parseInt( step ); 
	
	return this;

};

UI.Integer.prototype.setRange = function ( min, max ) {

	this.min = min;
	this.max = max;

	return this;

};


// Break

UI.Break = function () {

	UI.Element.call( this );

	var dom = document.createElement( 'br' );
	dom.className = 'Break';

	this.dom = dom;

	return this;

};

UI.Break.prototype = Object.create( UI.Element.prototype );
UI.Break.prototype.constructor = UI.Break;


// HorizontalRule

UI.HorizontalRule = function () {

	UI.Element.call( this );

	var dom = document.createElement( 'hr' );
	dom.className = 'HorizontalRule';

	this.dom = dom;

	return this;

};

UI.HorizontalRule.prototype = Object.create( UI.Element.prototype );
UI.HorizontalRule.prototype.constructor = UI.HorizontalRule;


// Button

UI.Button = function ( value ) {

	UI.Element.call( this );

	var dom = document.createElement( 'button' );
	dom.className = 'Button';

	this.dom = dom;
	this.dom.textContent = value;

	return this;

};

UI.Button.prototype = Object.create( UI.Element.prototype );
UI.Button.prototype.constructor = UI.Button;

UI.Button.prototype.setLabel = function ( value ) {

	this.dom.textContent = value;

	return this;

};


// Modal

UI.Modal = function ( value ) {

	var scope = this;

	var dom = document.createElement( 'div' );

	dom.style.position = 'absolute';
	dom.style.width = '100%';
	dom.style.height = '100%';
	dom.style.backgroundColor = 'rgba(0,0,0,0.5)';
	dom.style.display = 'none';
	dom.style.alignItems = 'center';
	dom.style.justifyContent = 'center';
	dom.addEventListener( 'click', function ( event ) {

		scope.hide();

	} );

	this.dom = dom;

	this.container = new UI.Panel();
	this.container.dom.style.width = '200px';
	this.container.dom.style.padding = '20px';
	this.container.dom.style.backgroundColor = '#ffffff';
	this.container.dom.style.boxShadow = '0px 5px 10px rgba(0,0,0,0.5)';

	this.add( this.container );

	return this;

};

UI.Modal.prototype = Object.create( UI.Element.prototype );
UI.Modal.prototype.constructor = UI.Modal;

UI.Modal.prototype.show = function ( content ) {

	this.container.clear();
	this.container.add( content );

	this.dom.style.display = 'flex';

	return this;

};

UI.Modal.prototype.hide = function () {

	this.dom.style.display = 'none';

	return this;

};

//Progress
/*MODIFIED TO INCLUDE PROGRESSBAR IN THE UI START*/

UI.Progress = function ( min, max ) {

	var scope = this;

	var dom = document.createElement( 'div' );
	dom.className = 'progress';
	//dom.id = 'editor-progressbar';
	/*dom.addEventListener( 'click', function ( event ) {

		scope.hide();

	} );*/

	this.dom = dom;

	this.progressBar = document.createElement( 'div' );
	this.progressBar.className = 'progress-bar';
	this.progressBar.role = 'progressbar';
	this.progressBar.style = 'width:1%';
	dom.appendChild( this.progressBar );

	return this;

};

UI.Progress.prototype = Object.create( UI.Element.prototype );
UI.Progress.prototype.constructor = UI.Progress;

UI.Progress.prototype.show = function (  ) {

	this.dom.style.display = 'block';
	return this;

};

UI.Progress.prototype.hide = function () {

	this.dom.style.display = 'none';

	return this;

};

UI.Progress.prototype.setProgress = function (value) {

	this.dom.firstChild.style = "width:"+ value + "%";
	this.dom.firstChild.innerHTML = value + "% loaded";
	return this;

};

/*MODIFIED TO INCLUDE PROGRESSBAR IN THE UI END*/

/*MODIFIED TO INCLUDE BOOTSTRAP MODAL IN THE UI START*/
// Modal

UI.bootstrapModal = function ( value, id, modalHeading, modalBodyContents, successButtonText, failureButtonText, formId ) {

	var scope = this;
	scope.submitCallback = '';
	scope.submitCallbackParams = [];

	var dom = document.createElement( 'div' );
	dom.className = 'modal fade';
	dom.id = id;
	dom.role = "dialog";
	
	var modalDialog = document.createElement( 'div' );
	modalDialog.className = 'modal-dialog';
	
	var modalContent = document.createElement( 'div' );
	modalContent.className = 'modal-content model_width';
	
	var modalHeader = document.createElement( 'div' );
	modalHeader.className = 'modal-header  model_color';
	
	var modalHeaderXButton = document.createElement( 'button' );
	modalHeaderXButton.className = 'close';
	modalHeaderXButton.setAttribute("data-dismiss", "modal");
	modalHeaderXButton.innerHTML = '&times';

	
	
	var modalHeaderHeading = document.createElement( 'h3' );
	modalHeaderHeading.className = 'modal-title';
	modalHeaderHeading.innerHTML = modalHeading;
	
	modalHeader.appendChild(modalHeaderXButton);
	modalHeader.appendChild(modalHeaderHeading);
	
	var modalBody = document.createElement( 'div' );
	modalBody.className = 'modal-body';
	modalBody.appendChild(modalBodyContents);
	
	var modalFooter = document.createElement( 'div' );
	modalFooter.className = 'modal-footer';
	
	var modalFooterSuccessButton = document.createElement( 'button' );
	modalFooterSuccessButton.className = 'btn btn-success';
	//modalFooterSuccessButton.id = 'submit-button';
	//modalFooterSuccessButton.setAttribute("data-dismiss", "modal");
	modalFooterSuccessButton.setAttribute("type", "submit");
	modalFooterSuccessButton.innerHTML = successButtonText;
	
	var modalFooterFailureButton = document.createElement( 'button' );
	modalFooterFailureButton.className = 'btn btn-danger';
	//modalFooterFailureButton.id = 'cancel-button';
	modalFooterFailureButton.setAttribute("data-dismiss", "modal");
	modalFooterFailureButton.innerHTML = failureButtonText;
	
	modalFooter.appendChild(modalFooterSuccessButton);
	modalFooter.appendChild(modalFooterFailureButton);

	
	modalContent.appendChild(modalHeader);

	modalContent.appendChild(modalBody);
	modalContent.appendChild(modalFooter);
	modalDialog.appendChild(modalContent);

	var form = document.createElement( 'form' );
	form.id = formId;
	//form.setAttribute( 'name', 'new-projec' );
	//form.setAttribute( 'data-toggle', 'validator' );
	//form.setAttribute( 'data-disable', 'true' );
	form.appendChild( modalDialog );

	//dom.appendChild(modalDialog);
	dom.appendChild( form );
	
	//modalFooterSuccessButton.addEventListener( 'click', function ( event ) {

		//scope.submitCallback( scope.submitCallbackParams );
		//scope.submitCallback();

	//} );

	this.dom = dom;
	this.modalDialog = modalDialog;
	this.modalContent = modalContent;
	this.modalHeaderHeading = modalHeaderHeading;
	this.modalBody = modalBody;
	this.modalFooterSuccessButton = modalFooterSuccessButton;
	this.modalFooterFailureButton = modalFooterFailureButton;
	return this;

};

UI.bootstrapModal.prototype = Object.create( UI.Element.prototype );
UI.bootstrapModal.prototype.constructor = UI.bootstrapModal;

UI.bootstrapModal.prototype.show = function () {

	//this.dom.style.display = 'flex';
	$('#' + this.dom.id).modal({backdrop: 'static', keyboard : false});

	//return this;

};

UI.bootstrapModal.prototype.hide = function () {

	//this.dom.style.display = 'none';
	$('#' + this.dom.id).modal('hide');

	//return this;

};

UI.bootstrapModal.prototype.setSubmitCallback = function ( callback ) {

	this.submitCallback = callback;

};

UI.bootstrapModal.prototype.setSubmitClickCallback = function ( callback ) {

	this.submitClickCallback = callback;
	var scope = this;
	this.modalFooterSuccessButton.addEventListener('click',function(){

		scope.submitClickCallback();
		scope.hide();
	})


};

UI.bootstrapModal.prototype.setsubmitCallbackParams = function ( paramsArray ) {
	
	this.submitCallbackParams = paramsArray;

};

UI.bootstrapModal.prototype.setModalClass = function ( value ) {

	this.dom.className += value;

};

UI.bootstrapModal.prototype.setModalBody = function ( value ) {
	
	while ( this.modalBody.firstChild ) {
	    
	    this.modalBody.removeChild( this.modalBody.firstChild );
	
	}
	
	this.modalBody.appendChild( value );

};

UI.bootstrapModal.prototype.setModalBodyStyle = function ( value ) {
	
	this.modalBody.setAttribute( 'style', value );

};

UI.bootstrapModal.prototype.appendToModalBody = function ( value ) {

	this.modalBody.appendChild( value );

};

UI.bootstrapModal.prototype.setWidth = function ( value ) {

	this.modalDialog.setAttribute( 'style', 'width:'+ value +'%' );

};

UI.bootstrapModal.prototype.hideFooterButtons = function () {
	
	this.modalFooterSuccessButton.style.display = 'none';
	this.modalFooterFailureButton.style.display = 'none';

};

UI.bootstrapModal.prototype.showFooterButtons = function () {
	
	this.modalFooterSuccessButton.style.display = 'block';
	this.modalFooterFailureButton.style.display = 'block';

};

UI.bootstrapModal.prototype.hideFooterSuccessButton = function () {
 
 this.modalFooterSuccessButton.style.display = 'none';

};

UI.bootstrapModal.prototype.hideFooterFailureButton = function () {
 
 this.modalFooterFailureButton.style.display = 'none';

};
UI.bootstrapModal.prototype.showFooterSuccessButton = function () {
 
 this.modalFooterSuccessButton.style.display = 'block';

};

UI.bootstrapModal.prototype.showFooterFailureButton = function () {

 this.modalFooterFailureButton.style.display = 'block';

};

UI.bootstrapModal.prototype.makeLargeModal = function () {

 this.modalDialog.className += " chumma_modal"

};




/*MODIFIED TO INCLUDE BOOTSTRAP MODAL IN THE UI END*/

/*MODIFIED TO INCLUDE INPUT WITH LABEL IN THE UI START*/
UI.InputWithLabel = function ( inputID, labelName ) {

	var scope = this;

	var dom = document.createElement('div');
	dom.className = 'form-group';

	var label = document.createElement('label');
	label.innerHTML = labelName;
	label.setAttribute("for", inputID);

	var inputField = document.createElement('input');
	inputField.setAttribute("type", "text");
	inputField.className = 'form-control';
	inputField.setAttribute("id", inputID);

	dom.appendChild(label);
	dom.appendChild(inputField);

	this.dom = dom;

	return this;

};

UI.InputWithLabel.prototype = Object.create( UI.Element.prototype );
UI.InputWithLabel.prototype.constructor = UI.InputWithLabel;

UI.InputWithLabel.prototype.show = function (  ) {

	this.dom.style.display = 'block';
	//return this;

};

UI.InputWithLabel.prototype.hide = function () {

	this.dom.style.display = 'none';

	//return this;

};

/*MODIFIED TO INCLUDE INPUT WITH LABEL IN THE UI END*/

//Progress
/*MODIFIED TO INCLUDE d3 PROGRESSBAR IN THE UI START*/

UI.CreateProgress = function ( min, max, domId ) {

	var scope = this;

	var dom = document.createElement( 'div' );
	dom.id = domId;
	dom.setAttribute("style","background-color: #4F4F4F; display:none");
	/*dom.addEventListener( 'click', function ( event ) {

		scope.hide();

	} );*/
	
	this.wrapper = document.createElement( 'div' );
	//this.wrapper.id = "progress-wrapper";
	this.wrapper.setAttribute("style","position: absolute;left: 5px;top: 20px;width: 214px;border: 2px solid #cccccc;border-radius: 5px;");
	
	this.contentDiv = document.createElement( 'div' );
	this.contentDiv.id = domId + "_" +"content";
	this.contentDiv.setAttribute("class","text-center");
	this.contentDiv.setAttribute("style","background-color: #4F4F4F");
	
	this.messageDiv = document.createElement( 'div' );
	this.messageDiv.id = domId + "_" + "message";
	this.messageDiv.setAttribute("class","text-center");
	this.messageDiv.setAttribute("style","background-color: #4F4F4F;font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;font-size: 13px;font-weight: bold;color: #ffffff;border-bottom: 2px solid #47e495;");
	
	this.wrapper.appendChild( this.messageDiv );
	this.wrapper.appendChild( this.contentDiv );
	dom.appendChild( this.wrapper );

	this.dom = dom;
	
	this.colors = {};
	this.color = '';
	this.radius = '';
	this.border = '';
	this.padding = '';
	this.startPercent = '';
	this.endPercent = '';
	this.twoPi = '';
	this.formatPercent = '';
	this.boxSize = '';
	this.count = '';
	this.step = '';
	this.arc = '';
	this.parent = '';
	this.svg = '';
	this.defs = '';
	this.filter = '';
	this.g = '';
	this.meter = '';
	this.foreground = '';
	this.front = '';
	this.numberText = '';
	this.message = '';

	/*this.progressBar = document.createElement( 'div' );
	this.progressBar.className = 'progress-bar';
	this.progressBar.role = 'progressbar';
	this.progressBar.style = 'width:1%';
	dom.appendChild( this.progressBar );*/

	return this;

};

UI.CreateProgress.prototype = Object.create( UI.Element.prototype );
UI.CreateProgress.prototype.constructor = UI.CreateProgress;

UI.CreateProgress.prototype.show = function (  ) {

	this.dom.style.display = 'block';
	return this;

};

UI.CreateProgress.prototype.hide = function () {

	this.dom.style.display = 'none';

	return this;

};

UI.CreateProgress.prototype.init = function () {

	this.colors = {
		'pink': '#E1499A',
		'yellow': '#f0ff08',
		'green': '#47e495',
		'red'    : '#f44242'
	};

	this.color = this.colors.green;

	this.radius = 50;//100
	this.border = 10;//5
	this.padding = 10;//30
	this.startPercent = 0;
	this.endPercent = 1.0;//0.85

	this.twoPi = Math.PI * 2;
	this.formatPercent = d3.format('.0%');
	this.boxSize = (this.radius + this.padding) * 2;


	this.count = Math.abs((this.endPercent - this.startPercent) / 0.01);
	this.step = this.endPercent < this.startPercent ? -0.01 : 0.01;

	this.arc = d3.svg.arc()
		.startAngle(0)
		.innerRadius(this.radius)
		.outerRadius(this.radius - this.border);

	//this.parent = d3.select('div#progress-content');
	this.parent = d3.select('div#'+ this.dom.id + '_' +'content');
	
	this.message = d3.select('div#' + this.dom.id + '_' + 'message').append('text')
				.attr('fill', '#fff')
				.attr('text-anchor', 'middle')
				.attr('dy', '.35em');

	this.svg = this.parent.append('svg')
		.attr('width', this.boxSize)
		.attr('height', this.boxSize);

	this.defs = this.svg.append('defs');

	this.filter = this.defs.append('filter')
		.attr('id', 'blur');

	this.filter.append('feGaussianBlur')
		.attr('in', 'SourceGraphic')
		.attr('stdDeviation', '7');

	this.g = this.svg.append('g')
		.attr('transform', 'translate(' + this.boxSize / 2 + ',' + this.boxSize / 2 + ')');

	this.meter = this.g.append('g')
		.attr('class', 'progress-meter');

	this.meter.append('path')
		.attr('class', 'background')
		.attr('fill', '#ccc')
		.attr('fill-opacity', 0.5)
		.attr('d', this.arc.endAngle(this.twoPi));

	this.foreground = this.meter.append('path')
		.attr('class', 'foreground')
		.attr('fill', this.color)
		.attr('fill-opacity', 1)
		.attr('stroke', this.color)
		.attr('stroke-width', 5)
		.attr('stroke-opacity', 1)
		.attr('filter', 'url(#blur)');

	this.front = this.meter.append('path')
		.attr('class', 'foreground')
		.attr('fill', this.color)
		.attr('fill-opacity', 1);

	this.numberText = this.meter.append('text')
		.attr('fill', '#fff')
		.attr('text-anchor', 'middle')
		.attr('dy', '.35em');

	return this;

};

UI.CreateProgress.prototype.updateProgress = function (task,progress) {
	this.message = d3.select('div#' + this.dom.id + '_' + 'message');
	this.foreground.attr('d', this.arc.endAngle(this.twoPi * Number(progress)));
	this.front.attr('d', this.arc.endAngle(this.twoPi * Number(progress)));
	this.numberText.text(this.formatPercent(Number(progress)));
	this.message.text(task);
	//this.numberText.text(progress);

	return this;

};
/*MODIFIED TO INCLUDE d3 PROGRESSBAR IN THE UI END*/


/*MODIFIED TO INCLUDE BOOTSTRAP CARD IN THE UI START*/
// Modal

UI.BootstrapCard = function ( id, title, description, actionButtonText, cancelButtonText, footer, matterport_token ) {

	var scope = this;
	scope.submitCallback = '';
	scope.cancelCallback = '';
	scope.submitCallbackParams = [];
	scope.cancelCallbackParams = [];
	scope.downloadCallback ='';
	scope.copyCallback ='';
	scope.downloadCallbackParams = [];
	scope.copyCallbackParams = [];
	
	//scope.wraperClass = "col-sm-6";

	//var dom = document.createElement( 'div' );
	//dom.className = scope.wraperClass;
	//dom.id = id;
	
	//var cardContainer = document.createElement( 'div' );
	//cardContainer.className = 'card text-center';

	var dom = document.createElement( 'div' );
	dom.className = 'card text-center';
	dom.id = id;
	
	var cardHeader = document.createElement( 'div' );
	cardHeader.className = 'card-header';
	cardHeader.innerHTML = title;
	
	var cardBlock = document.createElement( 'div' );
	cardBlock.className = 'card-block';
	
	var cardTitle = document.createElement( 'h3' );
	cardTitle.className = 'card-title';
	cardTitle.innerHTML = title;
	
	var cardText = document.createElement( 'p' );
	cardText.className = 'card-text';
	cardText.innerHTML = description;

	
	
	var cardButton = document.createElement( 'button' );
	cardButton.className = 'btn btn-primary';
	cardButton.innerHTML = actionButtonText;

	var cardButton2 = document.createElement( 'button' );
	cardButton2.className = 'btn btn-danger';
	cardButton2.setAttribute( 'style', 'margin-left: 3px;' );
	cardButton2.innerHTML = cancelButtonText;

	var cardFooter = document.createElement( 'div' );
	cardFooter.className = 'card-footer text-muted';
	cardFooter.innerHTML = footer;
	
	//cardBlock.appendChild(cardTitle);
	cardBlock.appendChild(cardText);
	if( matterport_token != undefined ) {
		var cardToken = document.createElement( 'p' );
		cardToken.className = 'card-token';
		cardToken.innerHTML = "Token: " + matterport_token.Token;
		cardBlock.appendChild(cardToken);
	}
	cardBlock.appendChild(cardButton);
	cardBlock.appendChild(cardButton2);
	//cardContainer.appendChild(cardHeader);
	//cardContainer.appendChild(cardBlock);
	//cardContainer.appendChild(cardFooter);

	dom.appendChild(cardHeader);
	dom.appendChild(cardBlock);
	dom.appendChild(cardFooter);
	
	//dom.appendChild(cardContainer);
	
	cardButton.addEventListener( 'click', function( event ) {

		scope.submitCallback( scope.submitCallbackParams );

	} );

	cardButton2.addEventListener( 'click', function( event ) {
		
		scope.cancelCallback( scope.cancelCallbackParams );

	} );

	this.dom = dom;
	this.cardHeader = cardHeader;
	this.cardBlock = cardBlock;
	this.cardText = cardText;
	this.cardButton = cardButton;
	this.cardFooter = cardFooter;

	return this;

};

UI.BootstrapCard.prototype = Object.create( UI.Element.prototype );
UI.BootstrapCard.prototype.constructor = UI.BootstrapCard;

UI.BootstrapCard.prototype.show = function () {

	this.dom.style.display = 'block';
	return this;

};

UI.BootstrapCard.prototype.hide = function () {

	this.dom.style.display = 'none';
	return this;

};

UI.BootstrapCard.prototype.setSubmitCallback = function ( callback, params ) {

	this.submitCallback = callback;
	this.submitCallbackParams = params;

};

UI.BootstrapCard.prototype.setCancelCallback = function ( callback, params ) {
	
	this.cancelCallback = callback;
	this.cancelCallbackParams = params;

};

UI.BootstrapCard.prototype.setDownloadCallback = function ( callback, params ) {
	
	this.downloadCallback = callback;
	this.downloadCallbackParams = params;

};

UI.BootstrapCard.prototype.setCopyCallback = function ( callback, params ) {
	
	this.copyCallback = callback;
	this.copyCallbackParams = params;

};

UI.BootstrapCard.prototype.setWraperClass = function ( value ) {

	this.dom.className += value;

};

UI.BootstrapCard.prototype.setWraperStyle = function ( value ) {

	this.dom.setAttribute( 'style', value );

};

UI.BootstrapCard.prototype.setHeaderStyle = function ( value ) {

	this.cardHeader.setAttribute( 'style', value );

};

UI.BootstrapCard.prototype.setBodyStyle = function ( value ) {

	this.cardBlock.setAttribute( 'style', value );

};

UI.BootstrapCard.prototype.setFooterStyle = function ( value ) {

	this.cardFooter.setAttribute( 'style', value );

};

UI.BootstrapCard.prototype.setCardButton = function ( value ) {
	var scope = this;
	var cardButton = document.createElement( 'button' );
	cardButton.className = 'btn btn-warning';
	cardButton.innerHTML = value;
	cardButton.style.marginLeft= "1%"
	cardButton.addEventListener( 'click', function( event ) {

		scope.downloadCallback(scope.downloadCallbackParams );

	});
	this.cardBlock.appendChild(cardButton);
		
	
	};
UI.BootstrapCard.prototype.setCardText = function ( value ) {
		
	var cardText = document.createElement( 'p' );
	cardText.className = 'card-text';
	cardText.innerHTML = value;
	
	this.cardText.appendChild(cardText);

			
};

UI.BootstrapCard.prototype.setShareLink = function (value,idname,copyName,shareText) {

var scope = this;	
var setShareLinkDiv = document.createElement( 'div' );
setShareLinkDiv.className = 'text-center';
setShareLinkDiv.style.border = "1px solid #cccccc;";
var shareHeading = document.createElement('h5');
var sapnShare = document.createElement('span');
sapnShare.className = " fa fa-link";
sapnShare.innerHTML = shareText
var inputDiv = document.createElement('div');
inputDiv.className = "col-xs-12";
var inputDatadiv = document.createElement('div');
inputDatadiv.className = "col-xs-10"
inputDatadiv.style.marginLeft ="-10px"
inputDatadiv.style.marginBottom ="10px"
var buttonDiv = document.createElement('div');
buttonDiv.className = "col-xs-2"
var inputData = document.createElement('input');
inputData.className ="form-control";
inputData.id = idname;
inputData.value = value ;
var copyButton = document.createElement('button');

copyButton.className = "btn btn-sm btn-primary"
copyButton.innerHTML = copyName;
copyButton.style.marginTop = "2px"
copyButton.style.marginLeft = "-157%"
copyButton.addEventListener( 'click', function( event ) {
	
	scope.copyCallback(scope.copyCallbackParams );
	
});
inputDatadiv.appendChild(inputData);
inputDiv.appendChild(inputDatadiv);
buttonDiv.appendChild(copyButton);
inputDiv.appendChild(buttonDiv);
shareHeading.appendChild(sapnShare);
setShareLinkDiv.appendChild(shareHeading);
setShareLinkDiv.appendChild(inputDiv);

this.cardBlock.appendChild(setShareLinkDiv);
		
};
/*MODIFIED TO INCLUDE BOOTSTRAP CARD IN THE UI END*/

/**
 * UI.MobileWindow( id ) - Constructor for creating a resizable and draggable window
 * @constructor
 * @param {String} id - id of the DOM element of window 
 * @returns {Void}
 * @author Hari
 */
UI.MobileWindow = function( id ){

	var scope = this;
	this.id = id;
	
	this.dom = document.createElement( 'div' );
    this.dom.setAttribute( 'id', id );
    this.dom.setAttribute( 'class', 'ui-widget-content mobile-base-window' );
    //this.dom.setAttribute( 'style', 'position:absolute;top:250px;left:200px;width:270px;min-height:204px;' );
    this.dom.style.display = 'none';
	
	//Header section
    this.header = document.createElement( 'div' );
    this.header.setAttribute( 'class', 'mobile-header text-center' );

    //Header close button
    this.headerCloseBtn = document.createElement( 'button' );
    this.headerCloseBtn.setAttribute( 'class', 'btn btn-default btn-xs simulation-header-close-button' );
    this.headerCloseBtn.innerHTML = '<span class="fa fa-close"></span>';
    this.header.appendChild( scope.headerCloseBtn );

	this.body = document.createElement( 'div' );
    this.body.setAttribute( 'id', scope.id + '-body' );
    this.body.setAttribute( 'class', 'mobile-body' );

    this.footer = document.createElement( 'div' );
    this.footer.setAttribute( 'id', scope.id + '-footer' );
    this.footer.setAttribute( 'class', 'mobile-footer' );

	//Attach everything to the dom
    this.dom.appendChild( this.header );
	this.dom.appendChild( scope.body );
	this.dom.appendChild( scope.footer );
	
	this.headerCloseBtn.addEventListener( 'click', function( event ){
		
		scope.hide();
		
	} );
	
	return this;

};

UI.MobileWindow.prototype = Object.create( UI.Element.prototype );
UI.MobileWindow.prototype.constructor = UI.MobileWindow;

/**
 * show() - Show the window
 * @returns {Void}
 * @author Hari
 */
UI.MobileWindow.prototype.show = function(){

	var scope = this;
	scope.dom.style.display = 'block';

};

/**
 * hide() - Hide the window
 * @returns {Void}
 * @author Hari
 * 
 */
UI.MobileWindow.prototype.hide = function(){

	var scope = this;
	scope.dom.style.display = 'none';

};

/**
 * setHeading( content ) - Set the string content for window header
 * @param {String} content - String content for the window header.
 * @returns {Void}
 * @author Hari
 */
UI.MobileWindow.prototype.setHeading = function( content ){

	var scope = this;
	scope.header.innerHTML = '<strong style="text-align:center;">' + content + '</strong>';
	scope.header.appendChild( scope.headerCloseBtn );
	

};

/**
 * setBody( domContent ) - Set the HTML DOM content for the window body.
 * @param {any} domContent - Content of the window body, must be HTML DOM element
 * @returns {Void}
 * @author Hari
 */
UI.MobileWindow.prototype.setBody = function( domContent ){

	var scope = this;
	scope.body.appendChild( domContent );

};

UI.MobileWindow.prototype.setHeadingIcon = function( dom ){
	//console.log(dom);
	var scope = this;
	scope.headerIconBtn = document.createElement( 'button' );
	scope.headerIconBtn.setAttribute( 'class', 'btn btn-warning btn-xs simulation-header-close-button ' );
	scope.headerIconBtn.setAttribute( 'id', ''+dom.id+'' );
    scope.headerIconBtn.setAttribute( 'style', ''+dom.style+'' );
    scope.headerIconBtn.innerHTML = '<span class="'+ dom.icon +'"></span>';
	scope.header.appendChild( scope.headerIconBtn );

};

/**
 * setFooter( domContent ) - Set the footer content for the window
 * @param {any} domContent - Content for the window footer, must be HTML DOM element
 * @returns {Void}
 * @author Hari
 */
UI.MobileWindow.prototype.setFooter = function( domContent ){

	var scope = this;
	scope.footer.appendChild( domContent );

};

/**
 * setMobile( minwidth, minheight, maxwidth, maxheight, onResizeCallback ) - Set the window both as draggable and resizable
 * @param {Number} minwidth - Minimum width that should be maintained during resize event. Required parameter
 * @param {Number} minheight - Minimum height that should be maintained during resize event. Required parameter
 * @param {Number} maxwidth - Maximum width that should be maintained during resize event. Required parameter
 * @param {Number} maxheight - Maximum height that should be maintained during resize event. Required parameter
 * @param {function} onResizeCallback - Callback to execute during the resize event
 * @returns {Void}
 * @author Hari
 */
UI.MobileWindow.prototype.setMobile = function( minwidth, minheight, maxwidth, maxheight, onResizeCallback ){

	var scope = this;
	scope.setResizable( false, 1.7, minwidth, minheight, maxwidth, maxheight, onResizeCallback );
	scope.setDraggable();

};

/**
 * setResizable( keepAspectRatio, aspectRatio, minwidth, minheight, maxwidth, maxheight, onResize ) - Set the window as resizable
 * @param {Boolean} keepAspectRatio - true or false value that shows whether or not to keep the aspect ratio during resize. Default false.
 * @param {any} aspectRatio - Aspect ratio that should be kept during simulation. 'keepAspectRatio' should be true for this parameter to have an effect
 * @param {any} minwidth - Minimum width that should be maintained during resize event. Required parameter
 * @param {any} minheight - Minimum height that should be maintained during resize event. Required parameter
 * @param {any} maxwidth - Maximum width that should be maintained during resize event. Required parameter
 * @param {any} maxheight - Maximum height that should be maintained during resize event. Required parameter
 * @param {any} onResize - Callback to execute during the resize event
 * @returns {Void}
 * @author Hari
 */
UI.MobileWindow.prototype.setResizable = function( keepAspectRatio, aspectRatio, minwidth, minheight, maxwidth, maxheight, onResize ){

	var scope = this;
	if( minwidth === undefined || minheight === undefined || maxwidth === undefined || maxheight === undefined ){
		
		console.warn( 'The arguments minwidth, minheight, maxwidth and maxheight cannot be undefined in the following syntax.\nUI.MobileWindow.prototype.setResizable( keepAspectRatio, aspectRatio, minwidth, minheight, maxwidth, maxheight, onResize )' );
		return;
		
	}
	var ratio = ( keepAspectRatio === true )? ( ( typeof( aspectRatio ) == 'number' )? aspectRatio : 1.77 ) : false;
	$( '#' + scope.id ).resizable( {
		aspectRatio : ratio,
		alsoResize : "#" + scope.id + '-body',
		minWidth : minwidth,
		minHeight : minheight,
		maxWidth : maxwidth,
		maxHeight : maxheight,
		resize : function( event, ui ){

			if( onResize )
				onResize( event, ui );

		}
	} );

};

/**
 * setDraggable() - Enables the window to be draggable
 * @returns {Void}
 * @author Hari
 */
UI.MobileWindow.prototype.setDraggable = function(){

	var scope = this;
	$( '#' + scope.id ).draggable( {
		containment: "parent"
	} );

};

/**
 * Slider - Base class for the range slider component
 * @constructor
 * @param {String} id - Id to be given for the range slider component 
 * @returns {Void}
 * @author Hari
 */
UI.Slider = function( id ){

	var scope = this;

	this.dom = document.createElement( 'input' );
	this.dom.setAttribute( 'type', 'range' );
	this.dom.setAttribute( 'min', '1' );
	this.dom.setAttribute( 'max', '100' );
	this.dom.setAttribute( 'step', '1' );
	this.dom.setAttribute( 'value', 50 );
	this.dom.setAttribute( 'class', 'slider' );
	this.dom.setAttribute( 'id', id );

	return this;

}

UI.Slider.prototype = {

	constructor : UI.Slider,

	/**
	 * init( options ) - Initialize the range slider with the specified options
	 * @param {Object} options - The options to be set for the range slider. Format { min : Number, max : Number, value : Number, step : Number }
	 * @param {Number} options.min - Minimum value of the slider
	 * @param {Number} options.max - Maximum value of the slider
	 * @param {Number} options.value - Initial value of the slider
	 * @param {Number} options.step - Incremental step value of the slider
	 * @returns {Void}
	 * @author Hari
	 */
	init : function( options ){

		var scope = this;
		
		if( options ){

			( options.min ) ? scope.dom.setAttribute( 'min', options.min ) : scope.dom.setAttribute( 'min', '1' );
			( options.max ) ? scope.dom.setAttribute( 'max', options.max ) : scope.dom.setAttribute( 'max', '100' );
			( options.value ) ? scope.dom.setAttribute( 'value', options.value ) : scope.dom.setAttribute( 'value', '50' );
			( options.step ) ? scope.dom.setAttribute( 'step', options.step ) : scope.dom.setAttribute( 'step', '1' );

		}
		else{

			console.warn( 'Function signature doesn\'t meet the minimum number of parameters( options )' );

		}

	},

	/**
	 * show() - Function to show the slider
	 * @returns {Void}
	 * @author Hari
	 */
	show : function(){

		var scope = this;
		scope.dom.style.display = 'block';

	},

	/**
	 * hide() - Function to hide the slider
	 * @returns {Void}
	 * @author Hari
	 */
	hide : function(){

		var scope = this;
		scope.dom.style.display = 'none';

	},

	/**
	 * setSliderMinMax( min, max ) - Function to set the minimum and maximum values for the slider
	 * @param {Number} min - Minimum value for the slider
	 * @param {Number} max - Maximum value for the slider
	 * @returns {Void}
	 * @author Hari
	 */
	setSliderMinMax : function( min, max ){

		var scope = this;
		if( min !== undefined && max !== undefined ){

			scope.dom.min = min;
			scope.dom.max = max;

		}
		else{

			console.warn( 'Function signature doesn\'t meet the minimum number of parameters( min, max )' );

		}
		
	},

	/**
	 * setSliderMin( min ) - Sets the minimum value for the slider
	 * @param {Number} min - Minimum value for the slider
	 * @returns {Void}
	 * @author Hari
	 */
	setSliderMin : function( min ){

		var scope = this;
		if( min !== undefined ){

			scope.dom.min = min;

		}
		else{

			console.warn( 'Function signature doesn\'t meet the minimum number of parameters( min )' );

		}
		
	},
	
	/**
	 * setSliderMax( max ) - Sets the maximum value for the slider
	 * @param {Number} max - Maximum value for the slider
	 * @returns {Void}
	 * @author Hari
	 */
	setSliderMax : function( max ){

		var scope = this;
		if( max !== undefined ){

			scope.dom.max = max;

		}
		else{

			console.warn( 'Function signature doesn\'t meet the minimum number of parameters( max )' );

		}
		
	},

	/**
	 * setSliderValue( value ) - Sets the current value of the slider
	 * @param {Number} value - The current value for the slider
	 * @returns {Void}
	 * @author Hari
	 */
	setSliderValue : function( value ){

		var scope = this;
		if( value !== undefined ){

			scope.dom.value = value;

		}
		else{

			console.warn( 'Function signature doesn\'t meet the minimum number of parameters( value )' );

		}
		
	},

	/**
	 * setSliderStep( step ) - Sets the incremental step value
	 * @param {Number} step - The incremental step value for the slider
	 * @returns {Void}
	 * @author Hari
	 */
	setSliderStep : function( step ){

		var scope = this;
		if( step !== undefined ){

			scope.dom.step = step;

		}
		else{

			console.warn( 'Function signature doesn\'t meet the minimum number of parameters( step )' );

		}
		
	},

	/**
	 * getSliderMin() - Get the min value of the slider
	 * @returns {Void}
	 * @author Hari
	 */
	getSliderMin : function(){

		var scope = this;
		return( scope.dom.min );

	},

	/**
	 * getSliderMax() - Get the max value of the slider
	 * @returns {Void}
	 * @author Hari
	 */
	getSliderMax : function(){

		var scope = this;
		return( scope.dom.max );

	},

	/**
	 * getSliderValue() - Get the current value of the slider
	 * @returns {Void}
	 * @author Hari
	 */
	getSliderValue : function(){

		var scope = this;
		return( scope.dom.value );

	}

}

/**
 * UI.SliderWithLabel( containerId, sliderId, labelText, labelValue ) - Component for creating range slider with a label value. This component extends the UI.Slider internally
 * @param {String} containerId - Id for slider and label container
 * @param {String} sliderId - Id for the range slider
 * @param {String} labelText - Label text that should be shown on the label container. Example 'Zoom : '
 * @param {String} labelValue - Label value that should be given. Example '1'. Together the labelText and labelValue represent the slider's intended use. Example 'Zoom : 1'
 * @returns {Void}
 * @author Hari
 */
UI.SliderWithLabel = function( containerId, sliderId, labelText, labelValue ){

	var scope = this;

	if( containerId === undefined || sliderId === undefined || labelText === undefined || labelValue === undefined ){

		console.warn( 'SliderWithLabel( containerId, sliderId, labelText, labelValue ) constructor is invoked with insufficient number of parameters. Please correct the constructor signature!' );
		return;

	}

	UI.Slider.call( this, sliderId );

	/*
	<div class="slider-container">
		<div class="slider-text">
			<strong>Zoom: 3</strong>
		</div>
		<input type="range" min="1" max="100" step="1" value="50" class="slider" id="sim-zoom-slider">
	</div>
	*/
	this.container = document.createElement( 'div' );
	this.container.setAttribute( 'id', containerId );

	this.labelContainer = document.createElement( 'div' );
	this.labelContainer.setAttribute( 'class', 'slider-text' );
	
	this.labelText = document.createElement( 'strong' );
	this.labelText.innerHTML = labelText;

	this.labelValue = document.createElement( 'strong' );
	this.labelValue.innerHTML = labelValue;
	
	this.labelContainer.appendChild( this.labelText );
	this.labelContainer.appendChild( this.labelValue );

	this.container.appendChild( this.labelContainer );
	this.container.appendChild( this.dom );

	return this;

}

UI.SliderWithLabel.prototype = Object.create( UI.Slider.prototype );
UI.SliderWithLabel.prototype.constructor = UI.SliderWithLabel;

/**
 * setContainerClass( value ) - Function to set the container class name
 * @param {String} value - The desired class name
 * @returns {Void}
 * @author Hari
 */
UI.SliderWithLabel.prototype.setContainerClass = function( value ){

	var scope = this;
	scope.container.setAttribute( 'class', value );

}

/**
 * setLabelClass( value ) - Function to set the label container class
 * @param {String} value - The desired class name
 * @returns {Void}
 * @author Hari
 */
UI.SliderWithLabel.prototype.setLabelClass = function( value ){

	var scope = this;
	scope.labelContainer.setAttribute( 'class', value );

}

/**
 * setLabelText( text ) - Function to set the text value for the slider label
 * @param {String} text - The text value for the slider label
 * @returns {Void}
 * @author Hari
 */
UI.SliderWithLabel.prototype.setLabelText = function( text ){

	var scope = this;
	scope.labelText.innerHTML = text;

}

/**
 * setLabelValue( value ) - Function to set the label value for the slider label
 * @param {String} text - The label value for the slider label
 * @returns {Void}
 * @author Hari
 */
UI.SliderWithLabel.prototype.setLabelValue = function( value ){

	var scope = this;
	scope.labelValue.innerHTML = value;

}

/**
 * setLabelValue( value ) - Function to set the label value for the slider label
 * @param {String} text - The label value for the slider label
 * @returns {Void}
 * @author Hari
 */
UI.SliderWithLabel.prototype.setValue = function( value ){

	var scope = this;
	scope.labelValue.innerHTML = value;
	scope.setSliderValue( value );

}

/**
 * hide() - Function to hide both slider and the label
 * @returns {Void}
 * @author Pr@vi
 */
UI.SliderWithLabel.prototype.hide = function(){
	var scope = this;
	scope.dom.style.display = 'none';
	scope.container.style.display = 'none';

}

/**
 * show() - Function to show both slider and the label
 * @returns {Void}
 * @author Pr@vi
 */
UI.SliderWithLabel.prototype.show = function(){
	var scope = this;
	scope.dom.style.display = 'block';
	scope.container.style.display = 'block';
}



UI.SingleInputFieldPopup = function( id ){

    var scope = this;
    var labelPopup = new UI.MobileWindow( id );
    //labelPopup.headerCloseBtn.disabled = true;
    
    //Popup body section start
    var msrPopupBody = document.createElement( 'div' );
    msrPopupBody.setAttribute( 'class', 'single_input_field_popup_body' );

    var nameSection = document.createElement( 'div' );
    nameSection.setAttribute( 'class', 'single_input_field_popup_name_section' );

    var nameFrmGrp = document.createElement( 'div' );
    nameFrmGrp.setAttribute( 'class', 'form-group single_input_field_popup_form' );

    var nameId = id + "_name_field_" + Date.now();
    var nameLabel = document.createElement( 'label' );
    nameLabel.setAttribute( 'for', nameId );
    nameFrmGrp.appendChild( nameLabel );

    var nameInput = document.createElement( 'input' );
    nameInput.setAttribute( 'type', 'text' );
    nameInput.setAttribute( 'class', 'form-control' );
    nameInput.setAttribute( 'id', nameId );
    nameFrmGrp.appendChild( nameInput );
    labelPopup.nameInputField = nameInput;

    nameSection.appendChild( nameFrmGrp );
    msrPopupBody.appendChild( nameSection );
    //Popup body section end
    
    labelPopup.setBody( msrPopupBody );

    //Popup footer section start
    var footerDiv = document.createElement( 'div' );
    footerDiv.setAttribute( 'class', 'pull-right single_input_field_popup_footer' );

    var measureSaveBtn = document.createElement( 'button' );
    measureSaveBtn.setAttribute( 'class', 'btn btn-success btn-xs left-right-margin single_input_field_popup_success_btn' );

    var measureDeleteBtn = document.createElement( 'button' );
    measureDeleteBtn.setAttribute( 'class', 'btn btn-danger btn-xs left-right-margin single_input_field_popup_discard_btn' );

    footerDiv.appendChild( measureSaveBtn );
    footerDiv.appendChild( measureDeleteBtn );
    //Popup footer section end

    labelPopup.setFooter( footerDiv );

    this.dom = labelPopup.dom;
    this.window = labelPopup;
    this.inputLabel = nameLabel;
    this.input = nameInput;
    this.successButton = measureSaveBtn;
    this.discardButton = measureDeleteBtn;
    return this;

}

UI.SingleInputFieldPopup.prototype = {

    constructor : UI.SingleInputFieldPopup,

    show : function(){

        this.window.show();

    },

    hide : function(){

        this.window.hide();

    },

    setHeading : function( value ){

        this.window.setHeading( value );

    },

    setInputFieldLabel : function( label ){

        this.inputLabel.innerHTML = label;

    },

    setFooterButtonsText : function( successText, discardText ){

        this.successButton.innerHTML = successText;
        this.discardButton.innerHTML = discardText;

    },

}