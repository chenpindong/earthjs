// https://bl.ocks.org/mbostock/2b85250396c17a79155302f91ec21224
// https://bl.ocks.org/pbogden/2f8d2409f1b3746a1c90305a1a80d183
// http://www.svgdiscovery.com/ThreeJS/Examples/17_three.js-D3-graticule.htm
export default function (urlJson) {
    /*eslint no-console: 0 */
    var _ = {dataDots: null};
    var material = new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide,
        color: 0xC19999, //F0C400,
    });

    function init() {
        this._.options.showDots = true;
    }

    function createDot(feature) {
        var tj = this.threejsPlugin, radius = 10,
        geometry = new THREE.CircleGeometry(radius, 30),
        mesh     = new THREE.Mesh(geometry, material),
        position = tj.vertex(feature.geometry.coordinates);
        mesh.position.set(position.x, position.y, position.z);
        mesh.lookAt({x:0,y:0,z:0});
        return mesh;
    }

    function create() {
        var this$1 = this;

        var tj = this.threejsPlugin;
        if (!_.sphereObject) {
            _.sphereObject = new THREE.Group();
            _.dataDots.features.forEach(function (d) {
                var dot = createDot.call(this$1, d);
                _.sphereObject.add(dot);
            });
        }
        tj.addGroup(_.sphereObject);
    }

    return {
        name: 'dotsThreejs',
        urls: urlJson && [urlJson],
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
        data: function data(data$1) {
            if (data$1) {
                _.dataDots = data$1;
            } else {
                return _.dataDots;
            }
        },
        sphere: function sphere() {
            return _.sphereObject;
        },
        color: function color(c) {
            material.color.set(c);
            material.needsUpdate = true;
            this.threejsPlugin.renderThree();
        }
    }
}
