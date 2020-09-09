	/**
	 * @author mrdoob / http://mrdoob.com/
	 * @author Hari
	 * Loader for JSON files exported without images
	 * To load and apply textures use setTexturePath method
	 */
	
	function ThreeJsonLoader( manager ) {

		this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;
		this.texturePath = '';

		this.Geometries = Object.freeze({
			WireframeGeometry: THREE.WireframeGeometry,
			ParametricGeometry: THREE.ParametricGeometry,
			ParametricBufferGeometry: THREE.ParametricBufferGeometry,
			TetrahedronGeometry: THREE.TetrahedronGeometry,
			TetrahedronBufferGeometry: THREE.TetrahedronBufferGeometry,
			OctahedronGeometry: THREE.OctahedronGeometry,
			OctahedronBufferGeometry: THREE.OctahedronBufferGeometry,
			IcosahedronGeometry: THREE.IcosahedronGeometry,
			IcosahedronBufferGeometry: THREE.IcosahedronBufferGeometry,
			DodecahedronGeometry: THREE.DodecahedronGeometry,
			DodecahedronBufferGeometry: THREE.DodecahedronBufferGeometry,
			PolyhedronGeometry: THREE.PolyhedronGeometry,
			PolyhedronBufferGeometry: THREE.PolyhedronBufferGeometry,
			TubeGeometry: THREE.TubeGeometry,
			TubeBufferGeometry: THREE.TubeBufferGeometry,
			TorusKnotGeometry: THREE.TorusKnotGeometry,
			TorusKnotBufferGeometry: THREE.TorusKnotBufferGeometry,
			TorusGeometry: THREE.TorusGeometry,
			TorusBufferGeometry: THREE.TorusBufferGeometry,
			TextGeometry: THREE.TextGeometry,
			TextBufferGeometry: THREE.TextBufferGeometry,
			SphereGeometry: THREE.SphereGeometry,
			SphereBufferGeometry: THREE.SphereBufferGeometry,
			RingGeometry: THREE.RingGeometry,
			RingBufferGeometry: THREE.RingBufferGeometry,
			PlaneGeometry: THREE.PlaneGeometry,
			PlaneBufferGeometry: THREE.PlaneBufferGeometry,
			LatheGeometry: THREE.LatheGeometry,
			LatheBufferGeometry: THREE.LatheBufferGeometry,
			ShapeGeometry: THREE.ShapeGeometry,
			ShapeBufferGeometry: THREE.ShapeBufferGeometry,
			ExtrudeGeometry: THREE.ExtrudeGeometry,
			ExtrudeBufferGeometry: THREE.ExtrudeBufferGeometry,
			EdgesGeometry: THREE.EdgesGeometry,
			ConeGeometry: THREE.ConeGeometry,
			ConeBufferGeometry: THREE.ConeBufferGeometry,
			CylinderGeometry: THREE.CylinderGeometry,
			CylinderBufferGeometry: THREE.CylinderBufferGeometry,
			CircleGeometry: THREE.CircleGeometry,
			CircleBufferGeometry: THREE.CircleBufferGeometry,
			BoxGeometry: THREE.BoxGeometry,
			BoxBufferGeometry: THREE.BoxBufferGeometry
		});

		this.TEXTURE_MAPPING = {
			UVMapping: THREE.UVMapping,
			CubeReflectionMapping: THREE.CubeReflectionMapping,
			CubeRefractionMapping: THREE.CubeRefractionMapping,
			EquirectangularReflectionMapping: THREE.EquirectangularReflectionMapping,
			EquirectangularRefractionMapping: THREE.EquirectangularRefractionMapping,
			SphericalReflectionMapping: THREE.SphericalReflectionMapping,
			CubeUVReflectionMapping: THREE.CubeUVReflectionMapping,
			CubeUVRefractionMapping: THREE.CubeUVRefractionMapping
		};
	
		this.TEXTURE_WRAPPING = {
			RepeatWrapping: THREE.RepeatWrapping,
			ClampToEdgeWrapping: THREE.ClampToEdgeWrapping,
			MirroredRepeatWrapping: THREE.MirroredRepeatWrapping
		};
	
		this.TEXTURE_FILTER = {
			NearestFilter: THREE.NearestFilter,
			NearestMipMapNearestFilter: THREE.NearestMipMapNearestFilter,
			NearestMipMapLinearFilter: THREE.NearestMipMapLinearFilter,
			LinearFilter: THREE.LinearFilter,
			LinearMipMapNearestFilter: THREE.LinearMipMapNearestFilter,
			LinearMipMapLinearFilter: THREE.LinearMipMapLinearFilter
		};

	}

	Object.assign( ThreeJsonLoader.prototype, {
		
		load: function ( url, onLoad, onProgress, onError ) {

			if ( this.texturePath === '' ) {

				this.texturePath = url.substring( 0, url.lastIndexOf( '/' ) + 1 );

			}

			var scope = this;

			var loader = new THREE.FileLoader( scope.manager );
			loader.load( url, function ( text ) {

				var json = null;

				try {

					json = JSON.parse( text );

				} catch ( error ) {

					if ( onError !== undefined ) onError( error );

					console.error( 'ThreeJsonLoader: Can\'t parse ' + url + '.', error.message );

					return;

				}

				var metadata = json.metadata;

				if ( metadata === undefined || metadata.type === undefined || metadata.type.toLowerCase() === 'geometry' ) {

					console.error( 'ThreeJsonLoader: Can\'t load ' + url + '. Use THREE.JSONLoader instead.' );
					return;

				}

				scope.parse( json, onLoad );

			}, onProgress, onError );

		},

		setTexturePath: function ( value ) {

			this.texturePath = value;

		},

		setCrossOrigin: function ( value ) {

			this.crossOrigin = value;

		},

		parse: function ( json, onLoad ) {

			var shapes = this.parseShape( json.shapes );
			var geometries = this.parseGeometries( json.geometries, shapes );

			var images = this.parseImages( json.images, function () {

				if ( onLoad !== undefined ) onLoad( object );

			} );

			var textures = this.parseTextures( json.textures, images );
			var materials = this.parseMaterials( json.materials, textures );

			var object = this.parseObject( json.object, geometries, materials );

			if ( json.animations ) {

				object.animations = this.parseAnimations( json.animations );

			}

			if ( json.images === undefined || json.images.length === 0 ) {

				if ( onLoad !== undefined ) onLoad( object );

			}

			return object;

		},

		parseShape: function ( json ) {

			var shapes = {};

			if ( json !== undefined ) {

				for ( var i = 0, l = json.length; i < l; i ++ ) {

					var shape = new THREE.Shape().fromJSON( json[ i ] );

					shapes[ shape.uuid ] = shape;

				}

			}

			return shapes;

		},

		parseGeometries: function ( json, shapes ) {

			var geometries = {};

			if ( json !== undefined ) {

				var geometryLoader = new THREE.JSONLoader();
				var bufferGeometryLoader = new THREE.BufferGeometryLoader();

				for ( var i = 0, l = json.length; i < l; i ++ ) {

					var geometry;
					var data = json[ i ];

					switch ( data.type ) {

						case 'PlaneGeometry':
						case 'PlaneBufferGeometry':

							geometry = new this.Geometries[ data.type ](
								data.width,
								data.height,
								data.widthSegments,
								data.heightSegments
							);

							break;

						case 'BoxGeometry':
						case 'BoxBufferGeometry':
						case 'CubeGeometry': // backwards compatible

							geometry = new this.Geometries[ data.type ](
								data.width,
								data.height,
								data.depth,
								data.widthSegments,
								data.heightSegments,
								data.depthSegments
							);

							break;

						case 'CircleGeometry':
						case 'CircleBufferGeometry':

							geometry = new this.Geometries[ data.type ](
								data.radius,
								data.segments,
								data.thetaStart,
								data.thetaLength
							);

							break;

						case 'CylinderGeometry':
						case 'CylinderBufferGeometry':

							geometry = new this.Geometries[ data.type ](
								data.radiusTop,
								data.radiusBottom,
								data.height,
								data.radialSegments,
								data.heightSegments,
								data.openEnded,
								data.thetaStart,
								data.thetaLength
							);

							break;

						case 'ConeGeometry':
						case 'ConeBufferGeometry':

							geometry = new this.Geometries[ data.type ](
								data.radius,
								data.height,
								data.radialSegments,
								data.heightSegments,
								data.openEnded,
								data.thetaStart,
								data.thetaLength
							);

							break;

						case 'SphereGeometry':
						case 'SphereBufferGeometry':

							geometry = new this.Geometries[ data.type ](
								data.radius,
								data.widthSegments,
								data.heightSegments,
								data.phiStart,
								data.phiLength,
								data.thetaStart,
								data.thetaLength
							);

							break;

						case 'DodecahedronGeometry':
						case 'DodecahedronBufferGeometry':
						case 'IcosahedronGeometry':
						case 'IcosahedronBufferGeometry':
						case 'OctahedronGeometry':
						case 'OctahedronBufferGeometry':
						case 'TetrahedronGeometry':
						case 'TetrahedronBufferGeometry':

							geometry = new this.Geometries[ data.type ](
								data.radius,
								data.detail
							);

							break;

						case 'RingGeometry':
						case 'RingBufferGeometry':

							geometry = new this.Geometries[ data.type ](
								data.innerRadius,
								data.outerRadius,
								data.thetaSegments,
								data.phiSegments,
								data.thetaStart,
								data.thetaLength
							);

							break;

						case 'TorusGeometry':
						case 'TorusBufferGeometry':

							geometry = new this.Geometries[ data.type ](
								data.radius,
								data.tube,
								data.radialSegments,
								data.tubularSegments,
								data.arc
							);

							break;

						case 'TorusKnotGeometry':
						case 'TorusKnotBufferGeometry':

							geometry = new this.Geometries[ data.type ](
								data.radius,
								data.tube,
								data.tubularSegments,
								data.radialSegments,
								data.p,
								data.q
							);

							break;

						case 'LatheGeometry':
						case 'LatheBufferGeometry':

							geometry = new this.Geometries[ data.type ](
								data.points,
								data.segments,
								data.phiStart,
								data.phiLength
							);

							break;

						case 'PolyhedronGeometry':
						case 'PolyhedronBufferGeometry':

							geometry = new this.Geometries[ data.type ](
								data.vertices,
								data.indices,
								data.radius,
								data.details
							);

							break;

						case 'ShapeGeometry':
						case 'ShapeBufferGeometry':

							var geometryShapes = [];

							for ( var j = 0, jl = data.shapes.length; j < jl; j ++ ) {

								var shape = shapes[ data.shapes[ j ] ];

								geometryShapes.push( shape );

							}

							geometry = new this.Geometries[ data.type ](
								geometryShapes,
								data.curveSegments
							);

							break;

						case 'BufferGeometry':

							geometry = bufferGeometryLoader.parse( data );

							break;

						case 'Geometry':

							geometry = geometryLoader.parse( data, this.texturePath ).geometry;

							break;

						default:

							console.warn( 'ThreeJsonLoader: Unsupported geometry type "' + data.type + '"' );

							continue;

					}

					geometry.uuid = data.uuid;

					if ( data.name !== undefined ) geometry.name = data.name;

					geometries[ data.uuid ] = geometry;

				}

			}

			return geometries;

		},

		parseMaterials: function ( json, textures ) {

			var materials = {};

			if ( json !== undefined ) {

				var loader = new THREE.MaterialLoader();
				loader.setTextures( textures );

				for ( var i = 0, l = json.length; i < l; i ++ ) {

					var data = json[ i ];

					if ( data.type === 'MultiMaterial' ) {

						// Deprecated

						var array = [];

						for ( var j = 0; j < data.materials.length; j ++ ) {

							array.push( loader.parse( data.materials[ j ] ) );

						}

						materials[ data.uuid ] = array;

					} else {

						materials[ data.uuid ] = loader.parse( data );

					}

				}

			}

			return materials;

		},

		parseAnimations: function ( json ) {

			var animations = [];

			for ( var i = 0; i < json.length; i ++ ) {

				var clip = AnimationClip.parse( json[ i ] );

				animations.push( clip );

			}

			return animations;

		},

		parseImages: function ( json, onLoad ) {

			var scope = this;
			var images = {};

			function loadImage( url ) {

				scope.manager.itemStart( url );

				return loader.load( url, function () {

					scope.manager.itemEnd( url );

				}, undefined, function () {

					scope.manager.itemEnd( url );
					scope.manager.itemError( url );

				} );

			}

			if ( json !== undefined && json.length > 0 ) {

				var manager = new THREE.LoadingManager( onLoad );

				var loader = new THREE.ImageLoader( manager );
				loader.setCrossOrigin( this.crossOrigin );

				for ( var i = 0, l = json.length; i < l; i ++ ) {

					var image = json[ i ];
					//var path = /^(\/\/)|([a-z]+:(\/\/)?)/i.test( image.url ) ? image.url : scope.texturePath + image.url;
					var path = scope.texturePath + image.url;

					/*Modified to avoid loading incorrect paths
					This scenario can arise if we are using a manually created texture using canvas and 2d context.*/
					if( image.url === undefined ) continue;

					images[ image.uuid ] = loadImage( path );

				}

			}

			return images;

		},

		parseTextures: function ( json, images ) {

			function parseConstant( value, type ) {

				if ( typeof value === 'number' ) return value;

				console.warn( 'ThreeJsonLoader.parseTexture: Constant should be in numeric form.', value );

				return type[ value ];

			}

			var textures = {};

			if ( json !== undefined ) {

				for ( var i = 0, l = json.length; i < l; i ++ ) {

					var data = json[ i ];

					if ( data.image === undefined ) {

						console.warn( 'ThreeJsonLoader: No "image" specified for', data.uuid );

					}

					if ( images[ data.image ] === undefined ) {

						console.warn( 'ThreeJsonLoader: Undefined image', data.image );

					}

					var texture = new THREE.Texture( images[ data.image ] );
					texture.needsUpdate = true;

					texture.uuid = data.uuid;

					if ( data.name !== undefined ) texture.name = data.name;

					if ( data.mapping !== undefined ) texture.mapping = parseConstant( data.mapping, this.TEXTURE_MAPPING );

					if ( data.offset !== undefined ) texture.offset.fromArray( data.offset );
					if ( data.repeat !== undefined ) texture.repeat.fromArray( data.repeat );
					if ( data.center !== undefined ) texture.center.fromArray( data.center );
					if ( data.rotation !== undefined ) texture.rotation = data.rotation;

					if ( data.wrap !== undefined ) {

						texture.wrapS = parseConstant( data.wrap[ 0 ], this.TEXTURE_WRAPPING );
						texture.wrapT = parseConstant( data.wrap[ 1 ], this.TEXTURE_WRAPPING );

					}

					if ( data.format !== undefined ) texture.format = data.format;

					if ( data.minFilter !== undefined ) texture.minFilter = parseConstant( data.minFilter, this.TEXTURE_FILTER );
					if ( data.magFilter !== undefined ) texture.magFilter = parseConstant( data.magFilter, this.TEXTURE_FILTER );
					if ( data.anisotropy !== undefined ) texture.anisotropy = data.anisotropy;

					if ( data.flipY !== undefined ) texture.flipY = data.flipY;

					textures[ data.uuid ] = texture;

				}

			}

			return textures;

		},

		parseObject: function ( data, geometries, materials ) {

			var object;

			function getGeometry( name ) {

				if ( geometries[ name ] === undefined ) {

					console.warn( 'ThreeJsonLoader: Undefined geometry', name );

				}

				return geometries[ name ];

			}

			function getMaterial( name ) {

				if ( name === undefined ) return undefined;

				if ( Array.isArray( name ) ) {

					var array = [];

					for ( var i = 0, l = name.length; i < l; i ++ ) {

						var uuid = name[ i ];

						if ( materials[ uuid ] === undefined ) {

							console.warn( 'ThreeJsonLoader: Undefined material', uuid );

						}

						array.push( materials[ uuid ] );

					}

					return array;

				}

				if ( materials[ name ] === undefined ) {

					console.warn( 'ThreeJsonLoader: Undefined material', name );

				}

				return materials[ name ];

			}

			switch ( data.type ) {

				case 'Scene':

					object = new THREE.Scene();

					if ( data.background !== undefined ) {

						if ( Number.isInteger( data.background ) ) {

							object.background = new THREE.Color( data.background );

						}

					}

					if ( data.fog !== undefined ) {

						if ( data.fog.type === 'Fog' ) {

							object.fog = new THREE.Fog( data.fog.color, data.fog.near, data.fog.far );

						} else if ( data.fog.type === 'FogExp2' ) {

							object.fog = new THREE.FogExp2( data.fog.color, data.fog.density );

						}

					}

					break;

				case 'PerspectiveCamera':

					object = new THREE.PerspectiveCamera( data.fov, data.aspect, data.near, data.far );

					if ( data.focus !== undefined ) object.focus = data.focus;
					if ( data.zoom !== undefined ) object.zoom = data.zoom;
					if ( data.filmGauge !== undefined ) object.filmGauge = data.filmGauge;
					if ( data.filmOffset !== undefined ) object.filmOffset = data.filmOffset;

					/*MODIFIED TO INCLUDE DYNAMIC CAMERA HELPER COLOR START*/
					if ( data.helperColor != undefined ) object.helperColor = data.helperColor;
					if ( data.iconUrl != undefined ) object.iconUrl = data.iconUrl;
					if ( data.badgeText != undefined ) object.badgeText = data.badgeText;
					/*MODIFIED TO INCLUDE DYNAMIC CAMERA HELPER COLOR END*/

					/*MODIFIED TO INCLUDE A PROPERTIES START*/
					if ( data.mountingOffset != undefined ) object.mountingOffset = data.mountingOffset;
					if ( data.camCategory != undefined ) object.camCategory = data.camCategory;
					if ( data.sensorCategory != undefined ) object.sensorCategory = data.sensorCategory;
					if ( data.isLocked != undefined ) object.isLocked = data.isLocked;
					if ( data.digitalZoom != undefined ) object.digitalZoom = data.digitalZoom;
					if ( data.opticalZoom != undefined ) object.opticalZoom = data.opticalZoom;
					if ( data.minHorizontalAOV != undefined ) object.minHorizontalAOV = data.minHorizontalAOV;
					if ( data.defFov != undefined ) object.defFov = data.defFov;
					if ( data.resolutionWidth != undefined ) object.resolutionWidth = data.resolutionWidth;
					if ( data.resolutionHeight != undefined ) object.resolutionHeight = data.resolutionHeight;
					if ( data.hFOV != undefined ) object.hFOV = data.hFOV;
					if ( data.hView != undefined ) object.hView = data.hView;
					if ( data.vView != undefined ) object.vView = data.vView;
					if ( data.distance != undefined ) object.distance = data.distance;
					/*MODIFIED TO INCLUDE A PROPERTIES END*/

					if ( data.view !== undefined ) object.view = Object.assign( {}, data.view );

					break;

				case 'OrthographicCamera':

					object = new THREE.OrthographicCamera( data.left, data.right, data.top, data.bottom, data.near, data.far );

					if ( data.zoom !== undefined ) object.zoom = data.zoom;
					if ( data.view !== undefined ) object.view = Object.assign( {}, data.view );

					break;

				case 'AmbientLight':

					object = new THREE.AmbientLight( data.color, data.intensity );

					break;

				case 'DirectionalLight':

					object = new THREE.DirectionalLight( data.color, data.intensity );

					break;

				case 'PointLight':

					object = new THREE.PointLight( data.color, data.intensity, data.distance, data.decay );

					break;

				case 'RectAreaLight':

					object = new THREE.RectAreaLight( data.color, data.intensity, data.width, data.height );

					break;

				case 'SpotLight':

					object = new THREE.SpotLight( data.color, data.intensity, data.distance, data.angle, data.penumbra, data.decay );

					break;

				case 'HemisphereLight':

					object = new THREE.HemisphereLight( data.color, data.groundColor, data.intensity );

					break;

				case 'SkinnedMesh':

					console.warn( 'ThreeJsonLoader.parseObject() does not support SkinnedMesh yet.' );

				case 'Mesh':

					var geometry = getGeometry( data.geometry );
					var material = getMaterial( data.material );

					if ( geometry.bones && geometry.bones.length > 0 ) {

						object = new THREE.SkinnedMesh( geometry, material );

					} else {

						object = new THREE.Mesh( geometry, material );

					}

					break;

				case 'LOD':

					object = new THREE.LOD();

					break;

				case 'Line':

					object = new THREE.Line( getGeometry( data.geometry ), getMaterial( data.material ), data.mode );

					break;

				case 'LineLoop':

					object = new THREE.LineLoop( getGeometry( data.geometry ), getMaterial( data.material ) );

					break;

				case 'LineSegments':

					object = new THREE.LineSegments( getGeometry( data.geometry ), getMaterial( data.material ) );

					break;

				case 'PointCloud':
				case 'Points':

					object = new THREE.Points( getGeometry( data.geometry ), getMaterial( data.material ) );

					break;

				case 'Sprite':

					object = new THREE.Sprite( getMaterial( data.material ) );

					/*Modefied for camera Reference Point*/
					if (data.camerauuid !== undefined) object.camerauuid = data.camerauuid;
					/*Modefied for camera Reference Point*/

					break;

				case 'Group':

					object = new THREE.Group();

					break;

				default:

					object = new THREE.Object3D();

			}

			object.uuid = data.uuid;

			if ( data.name !== undefined ) object.name = data.name;

			if ( data.matrix !== undefined ) {

				object.matrix.fromArray( data.matrix );

				if ( data.matrixAutoUpdate !== undefined ) object.matrixAutoUpdate = data.matrixAutoUpdate;
				if ( object.matrixAutoUpdate ) object.matrix.decompose( object.position, object.quaternion, object.scale );

			} else {

				if ( data.position !== undefined ) object.position.fromArray( data.position );
				if ( data.rotation !== undefined ) object.rotation.fromArray( data.rotation );
				if ( data.quaternion !== undefined ) object.quaternion.fromArray( data.quaternion );
				if ( data.scale !== undefined ) object.scale.fromArray( data.scale );

			}

			if ( data.castShadow !== undefined ) object.castShadow = data.castShadow;
			if ( data.receiveShadow !== undefined ) object.receiveShadow = data.receiveShadow;

			if ( data.shadow ) {

				if ( data.shadow.bias !== undefined ) object.shadow.bias = data.shadow.bias;
				if ( data.shadow.radius !== undefined ) object.shadow.radius = data.shadow.radius;
				if ( data.shadow.mapSize !== undefined ) object.shadow.mapSize.fromArray( data.shadow.mapSize );
				if ( data.shadow.camera !== undefined ) object.shadow.camera = this.parseObject( data.shadow.camera );

			}

			if ( data.visible !== undefined ) object.visible = data.visible;
			if ( data.frustumCulled !== undefined ) object.frustumCulled = data.frustumCulled;
			if ( data.renderOrder !== undefined ) object.renderOrder = data.renderOrder;
			if ( data.userData !== undefined ) object.userData = data.userData;

			if ( data.children !== undefined ) {

				var children = data.children;

				for ( var i = 0; i < children.length; i ++ ) {

					/*MODIFIED TO AVOID PARSING HEMISPHERELIGHT, BECAUSE IT IS ALREADY THERE IN THE SCENE START*/
					if( children[ i ].type == "HemisphereLight" ){

						continue;

					}
					/*MODIFIED TO AVOID PARSING HEMISPHERELIGHT, BECAUSE IT IS ALREADY THERE IN THE SCENE END*/
					object.add( this.parseObject( children[ i ], geometries, materials ) );

				}

			}

			if ( data.type === 'LOD' ) {

				var levels = data.levels;

				for ( var l = 0; l < levels.length; l ++ ) {

					var level = levels[ l ];
					var child = object.getObjectByProperty( 'uuid', level.object );

					if ( child !== undefined ) {

						object.addLevel( child, level.distance );

					}

				}

			}

			return object;

		}

	} );