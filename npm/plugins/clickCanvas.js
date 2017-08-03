// KoGor’s Block http://bl.ocks.org/KoGor/5994804
export default function () {
    /*eslint no-console: 0 */
    var _ = {
        mouse: null,
        country: null,
        countries: null,
        onCircle: {},
        onCircleVals: [],
        onCountry: {},
        onCountryVals: []
    }

    function init() {
        if (this.worldCanvas) {
            var world = this.worldCanvas.data();
            if (world) {
                _.countries = topojson.feature(world, world.objects.countries);
            }
        }
        var __ = this._;
        var mouseClickHandler = function(event, mouse) {
            var this$1 = this;

            if (!event) {
                return;
            }
            if (event.sourceEvent) {
                event = event.sourceEvent;
            }
            var xmouse = [event.clientX, event.clientY];
            var pos = __.proj.invert(mouse);
            _.pos = pos;
            _.dot = null;
            _.mouse = xmouse;
            _.country = null;
            if (__.options.showDots) {
                _.onCircleVals.forEach(function (v) {
                    _.dot = v.call(this$1, _.mouse, pos);
                });
            }
            if (__.options.showLand && !_.dot) {
                if (!__.drag) {
                    _.country = findCountry(pos);
                }
                _.onCountryVals.forEach(function (v) {
                    v.call(this$1, _.mouse, _.country);
                });
            }
        }
        if (this.mousePlugin) {
            this.mousePlugin.onClick({
                clickCanvas: mouseClickHandler
            });
        }
    }

    function findCountry(pos) {
        return _.countries.features.find(function(f) {
            return f.geometry.coordinates.find(function(c1) {
                return d3.polygonContains(c1, pos) || c1.find(function(c2) {
                    return d3.polygonContains(c2, pos)
                })
            })
        });
    }

    return {
        name: 'clickCanvas',
        onInit: function onInit() {
            init.call(this);
        },
        onCircle: function onCircle(obj) {
            Object.assign(_.onCircle, obj);
            _.onCircleVals = Object.keys(_.onCircle).map(function (k) { return _.onCircle[k]; });
        },
        onCountry: function onCountry(obj) {
            Object.assign(_.onCountry, obj);
            _.onCountryVals = Object.keys(_.onCountry).map(function (k) { return _.onCountry[k]; });
        },
        data: function data(data$1) {
            if (data$1) {
                _.world = data$1;
                _.countries = topojson.feature(data$1, data$1.objects.countries);
            } else {
                return _.world;
            }
        },
        state: function state() {
            return {
                pos: _.pos,
                dot: _.dot,
                mouse: _.mouse,
                country: _.country,
            };
        },
    }
}