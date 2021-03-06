// view-source:http://callumprentice.github.io/apps/extruded_earth/index.html
export default function (worldUrl, landUrl, inner,outer, rtt) {
    if ( worldUrl === void 0 ) worldUrl='../d/countries.geo.json';
    if ( landUrl === void 0 ) landUrl='../d/gold.jpg';
    if ( inner === void 0 ) inner=0.9;
    if ( outer === void 0 ) outer=0;
    if ( rtt === void 0 ) rtt=0;

    /*eslint no-console: 0 */
    var _ = {sphereObject: new THREE.Object3D(), group: {}};

    function extrude(geometry,_i,_o) {
        if ( _i === void 0 ) _i=0.9;
        if ( _o === void 0 ) _o=0;

        var half = geometry.vertices.length / 2;
        geometry.vertices.forEach(function(vert, i) {
            var r = _i;
            if (i >= half) {
                r = 1+_o;
            }
            var phi= ( 90.0 - vert.oy) * 0.017453292519943295; //Math.PI / 180.0;
            var the= (360.0 - vert.ox) * 0.017453292519943295; //Math.PI / 180.0;
            vert.x = r * Math.sin(phi) * Math.cos(the);
            vert.y = r * Math.cos(phi);
            vert.z = r * Math.sin(phi) * Math.sin(the);
        });
        geometry.verticesNeedUpdate = true;
        geometry.computeFaceNormals();
    }

    function add_country(shape_points) {
        var shape = new THREE.Shape(shape_points);
        var geometry = new THREE.ExtrudeGeometry(shape,{
            bevelEnabled:false,
            amount: 16
        });
        geometry.vertices.forEach(function(vert) {
            vert.ox = vert.x;
            vert.oy = vert.y;
            vert.oz = vert.z;
        });
        extrude(geometry, inner, outer);
        return new THREE.Mesh(geometry, _.material);
    }

    function shapePoints(country, list) {
        var id = country.id;
        var shape_points = [];
        var _g = _.group[id];
        if (_g===undefined) {
            _g = new THREE.Group();
            _g.name = id;
            _.group[id] = _g;
            _.sphereObject.add(_g);
        }
        list.forEach(function (points) {
            shape_points.push(new THREE.Vector2(points[0], points[1]));
        });
        _g.add(add_country(shape_points));
    }

    function loadCountry() {
        _.world.features.forEach(function(country) {
            var ref = country.geometry;
            var coordinates = ref.coordinates;
            if (coordinates.length === 1) {
                shapePoints(country, coordinates[0]);
            } else {
                coordinates.forEach(function(coord_set) {
                    if (coord_set.length == 1) {
                        shapePoints(country, coord_set[0]);
                    } else {
                        shapePoints(country, coord_set);
                    }
                });
            }
        });
    }

    function init() {
        var r = this._.proj.scale();
        this._.options.showWorld = true;
        _.sphereObject.rotation.y = rtt;
        _.sphereObject.scale.set(r,r,r);
        makeEnvMapMaterial(landUrl, function(material) {
            _.material = material;
            if (_.world && !_.loaded) {
                loadCountry()
            }
        });
    }

    function create() {
        if (_.material && !_.loaded) {
            loadCountry()
        }
        var tj = this.threejsPlugin;
        tj.addGroup(_.sphereObject);
    }

    var vertexShader = "\n    varying vec2 vN;\n    void main() {\n        vec4 p = vec4( position, 1. );\n        vec3 e = normalize( vec3( modelViewMatrix * p ) );\n        vec3 n = normalize( normalMatrix * normal );\n        vec3 r = reflect( e, n );\n        float m = 2. * length( vec3( r.xy, r.z + 1. ) );\n        vN = r.xy / m + .5;\n        gl_Position = projectionMatrix * modelViewMatrix * p;\n    }\n    "
    var fragmentShader = "\n    uniform sampler2D tMatCap;\n    varying vec2 vN;\n    void main() {\n        vec3 base = texture2D( tMatCap, vN ).rgb;\n        gl_FragColor = vec4( base, 1. );\n    }\n    "
    function makeEnvMapMaterial(imgUrl, cb) {
        var loader = new THREE.TextureLoader();
        loader.load(imgUrl, function(value) {
            var type = 't';
            var uniforms = {tMatCap:{type: type,value: value}};
            var material = new THREE.ShaderMaterial({
                uniforms: uniforms,
                vertexShader: vertexShader,
                fragmentShader: fragmentShader,
                shading: THREE.SmoothShading
            });
            cb.call(this, material);
        });
    }

    return {
        name: 'world3d2',
        urls: worldUrl && [worldUrl],
        onReady: function onReady(err, data) {
            _.me.data(data);
        },
        onInit: function onInit(me) {
            _.me = me;
            init.call(this);
        },
        onCreate: function onCreate() {
            create.call(this);
        },
        rotate: function rotate(rtt) {
            _.sphereObject.rotation.y = rtt;
        },
        data: function data(data$1) {
            if (data$1) {
                _.world = data$1;
            } else {
                return  _.world;
            }
        },
        sphere: function sphere() {
            return _.sphereObject;
        },
        group: function group() {
            return _.group;
        },
        extrude: function extrude$1(id, inner, outer) {
            _.group[id] && _.group[id].children.forEach(function(mesh) {
                extrude(mesh.geometry, inner, outer);
            });
        }
    }
}
