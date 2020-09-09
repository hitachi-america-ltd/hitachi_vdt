var container, stats;
var camera, scene, renderer;
var mouseX = 0, mouseY = 0;

var hitachi3d = true;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

if (Detector.webgl) {
	init();
	animate();
	
	$("#aov-input").on("input", function() {
		camera.fov = $(this).val();
		camera.updateProjectionMatrix();
	});

	$(document).ready(function() {
		camera.fov = $("#aov-input").val();
		camera.updateProjectionMatrix();
	});
} else {
	var warning = Detector.getWebGLErrorMessage();
	document.getElementById('3d').appendChild(warning);
}

function init() {
	container = document.getElementById("3dview");
	
	camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 1000 );
	camera.position.y -= 90;

	// scene

	scene = new THREE.Scene();

	var ambient = new THREE.AmbientLight(0x404040, 3);
	scene.add( ambient );

	var directionalLight = new THREE.DirectionalLight( 0xffeedd );
	directionalLight.position.set( 0, 0, 1 ).normalize();
	scene.add( directionalLight );

	// model

	var onProgress = function ( xhr ) {
		if ( xhr.lengthComputable ) {
			var percentComplete = xhr.loaded / xhr.total * 100;
			$("#3dprogress").html("Loading "+Math.round(percentComplete, 2) + '%');
			if (Math.round(percentComplete, 2) == 100) {
				$("#3dprogress").css("background-color", "white");
			}
		}
	};

	var onError = function ( xhr ) { };

	THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );

	var mtlLoader = new THREE.MTLLoader();
	mtlLoader.setPath( '../../../assets/3d/' );
	mtlLoader.load( 'f3148c8cf73c4e9489c388b0c0181351.mtl', function( materials ) {

		materials.preload();

		var objLoader = new THREE.OBJLoader();
		objLoader.setMaterials( materials );
		objLoader.setPath( '../../../assets/3d/' );
		objLoader.load( 'f3148c8cf73c4e9489c388b0c0181351.obj', function ( object ) {
			object.scale.set(3,3,3);
			scene.add( object );
		}, onProgress, onError );
	});

	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth*0.75, window.innerHeight*0.75, false);
	container.appendChild( renderer.domElement );
	window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
}

function onDocumentMouseMove( event ) {
	mouseX = ( event.clientX - windowHalfX ) / 2;
	mouseY = ( event.clientY - windowHalfY ) / 2;
}

function animate() {
	requestAnimationFrame( animate );
	render();
}

function render() {
	// mousemove
	//camera.position.y += ( mouseX - camera.position.y ) * .05;
	//camera.position.z += ( - mouseY - camera.position.z ) * .05;
	
	camera.lookAt( scene.position );
	renderer.render( scene, camera );
}