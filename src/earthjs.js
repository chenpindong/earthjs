import versorFn from './versor.js';

const versor = versorFn();
const earthjs = (options={}) => {
    /*eslint no-console: 0 */
    cancelAnimationFrame(earthjs.ticker);
    options = Object.assign({
        selector: '#earth-js',
        rotate: [130,-33,-11],
        transparent: false,
        map: false,
        padding: 0
    }, options);
    const _ = {
        onCreate: {},
        onCreateVals: [],

        onRefresh: {},
        onRefreshVals: [],

        onResize: {},
        onResizeVals: [],

        onInterval: {},
        onIntervalVals: [],

        ready: null,
        promeses: [],
        loadingData: null,
        recreateSvgOrCanvas: function() {
            _.onCreateVals.forEach(function(fn) {
                fn.call(globe);
            });
            return globe;
        }
    }
    window._ = _;
    const drag = false;
    const svg = d3.selectAll(options.selector);
    let width = +svg.attr('width'), height = +svg.attr('height');
    if (!width || !height) {
        width = options.width || 700;
        height = options.height || 500;
        svg.attr('width', width).attr('height', height);
    }
    const center = [width/2, height/2];
    Object.defineProperty(options, 'width', {
        get: () => width,
        set: (x) => {
            width = x;
            center[0] = x/2;
        }
    });
    Object.defineProperty(options, 'height', {
        get: () => height,
        set: (x) => {
            height = x;
            center[1] = x/2;
        }
    });
    const globe = {
        _: {
            svg,
            drag,
            versor,
            center,
            options,
        },
        $slc: {},
        ready(fn) {
            if (fn) {
                globe._.readyFn = fn;
                globe._.promeses = _.promeses;
                if (_.promeses.length>0) {
                    const q = d3.queue();
                    _.loadingData = true;
                    _.promeses.forEach(obj => {
                        obj.urls.forEach(url => {
                            let ext = url.split('.').pop();
                            if (ext==='geojson') {
                                ext = 'json';
                            }
                            q.defer(d3[ext], url);
                        });
                    })
                    q.await(function() {
                        let args = [].slice.call(arguments);
                        const err = args.shift();
                        _.promeses.forEach(obj => {
                            const ln = obj.urls.length;
                            const ar = args.slice(0,ln);
                            const ready = globe[obj.name].ready;
                            ar.unshift(err);

                            if (ready) {
                                ready.apply(globe, ar);
                            } else {
                                obj.onReady.apply(globe, ar);
                            }
                            args = args.slice(ln);
                        });
                        _.loadingData = false;
                        fn.called = true;
                        fn.call(globe);
                    });
                }
            } else if (arguments.length===0) {
                return _.loadingData;
            }
        },
        register(obj, name) {
            const ar = {name: name || obj.name, __on__:{}};
            globe[ar.name] = ar;
            Object.keys(obj).forEach(function(fn) {
                if ([
                    'urls',
                    'onReady',
                    'onInit',
                    'onCreate',
                    'onRefresh',
                    'onResize',
                    'onInterval'].indexOf(fn)===-1) {
                    if (typeof(obj[fn])==='function') {
                        ar[fn] = function() {
                            return obj[fn].apply(globe, arguments);
                        }
                    }
                }
            });
            if (obj.onInit) {
                obj.onInit.call(globe, ar);
            }
            qEvent(obj,'onCreate', ar.name);
            qEvent(obj,'onResize', ar.name);
            qEvent(obj,'onRefresh', ar.name);
            qEvent(obj,'onInterval', ar.name);
            if (obj.urls && obj.onReady) {
                _.promeses.push({
                    name: ar.name,
                    urls: obj.urls,
                    onReady: obj.onReady
                });
            }
            return globe;
        }
    }
    Object.defineProperty(globe, 'loading', {
        get: () => _.loadingData,
    });

    //----------------------------------------
    let earths = [];
    let ticker = null;
    const __ = globe._;

    globe.create = function(twinEarth) {
        earths = twinEarth || [];
        _.recreateSvgOrCanvas();
        earths.forEach(function(p) {
            p.create(null);
        });
        if (ticker===null && earths!==[]) {
            __.ticker();
        }
        return globe;
    }

    globe.$slc.defs = __.svg.append('defs');
    __.ticker = function(intervalTicker) {
        const interval = __.interval;
        intervalTicker = intervalTicker || 10;

        let start1 = 0;
        let start2 = 0;
        function step(timestamp) {
            if ((timestamp - start1) > intervalTicker) {
                start1 = timestamp;
                if (!_.loadingData) {
                    interval.call(globe, timestamp);
                    if ((timestamp - start2) > intervalTicker+30) {
                        start2 = timestamp;
                        for (var p of earths) {
                            p._.interval.call(p, timestamp);
                        }
                    }
                }
            }
            if (__.options.tween && !__.drag)
                __.options.tween(timestamp);
            earthjs.ticker = requestAnimationFrame(step);
        }
        earthjs.ticker = requestAnimationFrame(step);
        return globe;
    }

    //----------------------------------------
    // Helper
    __.scale = function(y) {
        __.proj.scale(y);
        __.resize();
        __.refresh();
        return globe;
    }

    __.rotate = function(r) {
        __.proj.rotate(r);
        __.refresh();
        return globe;
    }

    __.interval = function(t) {
        for (var fn of _.onIntervalVals) {
            fn.call(globe, t);
        }
        return globe;
    }

    __.refresh = function(filter) {
        if (filter) {
            const keys = filter ? _.onRefreshKeys.filter(d => filter.test(d)) : _.onRefreshKeys;
            keys.forEach(function(fn) {
                _.onRefresh[fn].call(globe);
            });
        } else {
            for (var fn of _.onRefreshVals) {
                fn.call(globe);
            }
        }
        return globe;
    }

    __.resize = function() {
        for (var fn of _.onResizeVals) {
            fn.call(globe);
        }
        return globe;
    }

    __.projection = function() {
        let {scale, width, height, padding} = __.options;
        if (__.options.map) {
            if (!scale) {
                scale = (width/6.279) - padding;
            }
            return d3.geoEquirectangular()
                .translate(__.center)
                .precision(0.1)
                .scale(scale);
        } else {
            if (!scale) {
                const mins = d3.min([width, height]);
                scale =  mins / 2 - padding;
            }
            const r = __.options.rotate;
            if (typeof(r)==='number') {
                __.options.rotate = [r,-33,-11];
            }
            return d3.geoOrthographic()
                .rotate(__.options.rotate)
                .translate(__.center)
                .precision(0.1)
                .clipAngle(90)
                .scale(scale);
        }

    }

    __.proj = __.projection();
    __.path = d3.geoPath().projection(__.proj);

    globe.__addEventQueue = function(name) {
        const obj = globe[name].__on__;
        obj && Object.keys(obj).forEach(qname => AddQueueEvent(obj, qname, name));
    }
    globe.__removeEventQueue = function(name) {
        const obj = globe[name].__on__;
        if (obj) {
            Object.keys(obj).forEach(qname => {
                delete _[qname][name];
                _[qname+'Keys'] = Object.keys(_[qname]);
                _[qname+'Vals'] = _[qname+'Keys'].map(k => _[qname][k]);
            });
        }
    }
    return globe;
    //----------------------------------------
    function AddQueueEvent(obj, qname, name) {
        _[qname][name]  = obj[qname];
        _[qname+'Keys'] = Object.keys(_[qname]);
        _[qname+'Vals'] = _[qname+'Keys'].map(k => _[qname][k]);
    }
    function qEvent(obj, qname, name) {
        if (obj[qname]) {
            globe[name].__on__[qname] = obj[qname];
            AddQueueEvent(obj, qname, name)
        }
    }
}
if (window.d3===undefined) {
    window.d3 = {};
}
window.d3.earthjs = earthjs;
export default earthjs;
