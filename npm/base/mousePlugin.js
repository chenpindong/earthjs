// Mike Bostock’s Block https://bl.ocks.org/mbostock/7ea1dde508cec6d2d95306f92642bc42
export default function (ref) {
    if ( ref === void 0 ) ref={zoomScale:[0,50000]};
    var zoomScale = ref.zoomScale;
    var intervalDrag = ref.intervalDrag;

    /*eslint no-console: 0 */
    var _ = {
        svg:null,
        wait: null,
        zoom: null,
        mouse: null,
        q: null,
        sync: [],
        onDrag: {},
        onDragVals: [],
        onDragStart: {},
        onDragStartVals: [],
        onDragEnd: {},
        onDragEndVals: [],
        onClick: {},
        onClickVals: [],
        onDblClick: {},
        onDblClickVals: []
    };

    if (zoomScale===undefined) {
        zoomScale = [0,50000];
    }

    function onclick() {
        _.onClickVals.forEach(function (v) {
            v.call(_._this, _.event, _.mouse);
        });
    }

    function ondblclick() {
        _.onDblClickVals.forEach(function (v) {
            v.call(_._this, _.event, _.mouse);
        });
    }

    var v0, // Mouse position in Cartesian coordinates at start of drag gesture.
        r0, // Projection rotation as Euler angles at start.
        q0; // Projection rotation as versor at start.

    function r(__) {
        var versor = __.versor;
        var v1 = versor.cartesian(__.proj.rotate(r0).invert(_.mouse)),
              q1 = versor.multiply(q0, versor.delta(v0, v1));
        _.r = versor.rotation(q1);
    }

    function drag(__) {
        var this$1 = this;

        r(__);
        __.rotate(_.r);
        _.onDragVals.forEach(function (v) {
            v.call(this$1, _.mouse);
        });
    }

    function init() {
        var __ = this._;
        var versor = __.versor;
        var s0 = __.proj.scale();
        var wh = [__.options.width, __.options.height];
        _.scale  = d3.scaleLinear().domain([30,__.proj.scale()]).range([0.1,1]);

        _.zoom = d3.zoom()
            .on('zoom', zoom)
            .scaleExtent([0.1,160])
            .translateExtent([[0,0], wh]);

        _.svg.call(d3.drag()
            .on('start',dragstarted)
            .on('end',  dragsended)
            .on('drag', dragged));
        _.svg.call(_.zoom);

        // todo: add zoom lifecycle to optimize plugins zoom-able
        // ex: barTooltipSvg, at the end of zoom, need to recreate
        function zoom() {
            var z = zoomScale;
            var r1 = s0 * d3.event.transform.k;
            if (r1>=z[0] && r1<=z[1]) {
                __.scale(r1);
                _.sync.forEach(function (g){ return g._.scale(r1); });
            }
        }

        function rotate(r) {
            var d = r[0] - r0[0];
            r[0] = d + this._.proj.rotate()[0];
            if (r[0] >= 180)
                { r[0] -= 360; }
            this._.rotate(r);
        }

        function dragstarted() {
            var this$1 = this;

            var mouse = d3.mouse(this);
            v0 = versor.cartesian(__.proj.invert(mouse));
            r0 = __.proj.rotate();
            q0 = versor(r0);
            __.drag = null;
            _.onDragStartVals.forEach(function (v) { return v.call(this$1, mouse); });
            _.onDragVals.forEach(     function (v) { return v.call(this$1, mouse); });
            __.refresh();
            _.mouse = mouse;
            _._this = this;
            _.t1 = 0;
            _.t2 = 0;
        }

        function dragged() { // DOM update must be onInterval!
            __.drag = true;
            _._this = this;
            _.mouse = d3.mouse(this);
            !intervalDrag && drag(__);
            // _.t1+=1; // twice call compare to onInterval
        }

        function dragsended() {
            var this$1 = this;

            var drag = __.drag;
            __.drag = false;
            if (drag===null) {
                _.event = d3.event;
                if (__.options.spin) {
                    onclick();
                } else if (_.wait) {
                    _.wait = null;
                    ondblclick();
                } else if (_.wait===null) {
                    _.wait = window.setTimeout(function() {
                        if (_.wait) {
                            _.wait = false;
                        }
                    }, 250);
                }
            } else if (drag) {
                r(__);
                __.rotate(_.r);
                _.onDragVals.forEach(function (v) { return v.call(_._this, _.mouse); });
                _.sync.forEach(function (g){ return rotate.call(g, _.r); });
            }
            _.onDragEndVals.forEach(function (v) { return v.call(this$1, _.mouse); });
            __.refresh();
            // console.log('ttl:',_.t1,_.t2);
        }
    }

    function interval() {
        var __ = this._;
        if (__.drag && intervalDrag) {
            if (_.oMouse[0]!==_.mouse[0] &&
                _.oMouse[1]!==_.mouse[1]) {
                _.oMouse = _.mouse;
                drag(__);
                // _.t2+=1;
            }
        } else if (_.wait===false) {
            _.wait = null;
            onclick();
        }
    }

    return {
        name: 'mousePlugin',
        onInit: function onInit(me) {
            _.me = me;
            _.oMouse = [];
            _.svg = this._.svg;
            init.call(this);
        },
        onInterval: function onInterval() {
            interval.call(this);
        },
        selectAll: function selectAll(q) {
            if (q) {
                _.q = q;
                _.svg.call(d3.zoom()
                    .on('zoom start end', null));
                _.svg.call(d3.drag()
                    .on('start',null)
                    .on('end',  null)
                    .on('drag', null));
                _.svg = d3.selectAll(q);
                init.call(this);
                if (this.hoverCanvas) {
                    this.hoverCanvas.selectAll(q);
                }
            }
            return _.svg;
        },
        sync: function sync(arr) {
            _.sync = arr;
        },
        zoom: function zoom(k) {
            _.zoom.scaleTo(_.svg, (k ? _.scale(k) : 1));
        },
        mouse: function mouse() {
            return _.mouse;
        },
        onDrag: function onDrag(obj) {
            Object.assign(_.onDrag, obj);
            _.onDragVals = Object.keys(_.onDrag).map(function (k) { return _.onDrag[k]; });
        },
        onDragStart: function onDragStart(obj) {
            Object.assign(_.onDragStart, obj);
            _.onDragStartVals = Object.keys(_.onDragStart).map(function (k) { return _.onDragStart[k]; });
        },
        onDragEnd: function onDragEnd(obj) {
            Object.assign(_.onDragEnd, obj);
            _.onDragEndVals = Object.keys(_.onDragEnd).map(function (k) { return _.onDragEnd[k]; });
        },
        onClick: function onClick(obj) {
            Object.assign(_.onClick, obj);
            _.onClickVals = Object.keys(_.onClick).map(function (k) { return _.onClick[k]; });
        },
        onDblClick: function onDblClick(obj) {
            Object.assign(_.onDblClick, obj);
            _.onDblClickVals = Object.keys(_.onDblClick).map(function (k) { return _.onDblClick[k]; });
        }
    }
}
