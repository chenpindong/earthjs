// KoGor’s Block http://bl.ocks.org/KoGor/5994804
export default function () {
    /*eslint no-console: 0 */
    var _ = { mouseXY: [0,0], visible: false }
    var dotTooltip = d3.select('body').append('div').attr('class', 'ej-dot-tooltip');

    function show(data, tooltip) {
        var props = data.properties;
        var title = Object.keys(props).map(function (k) { return k+': '+props[k]; }).join('<br/>');
        return tooltip.html(title)
    }

    function create() {
        var _this = this;
        this.dotsSvg.$dots()
        .on('mouseover', function() {
            if (_this._.options.showBarTooltip) {
                _.visible = true;
                _.mouseXY = [d3.event.pageX + 7, d3.event.pageY - 15];
                var i = +this.dataset.index;
                var data = _this.dotsSvg.data().features[i];
                (_.me.show || show)(data, dotTooltip)
                .style('display', 'block')
                .style('opacity', 1);
                refresh();
            }
        })
        .on('mouseout', function() {
            _.visible = false;
            dotTooltip.style('opacity', 0)
            .style('display', 'none');
        })
        .on('mousemove', function() {
            if (_this._.options.showBarTooltip) {
                _.mouseXY = [d3.event.pageX + 7, d3.event.pageY - 15];
                refresh();
            }
        });
    }

    function refresh() {
        dotTooltip
        .style('left', _.mouseXY[0] + 7 + 'px')
        .style('top', _.mouseXY[1] - 15 + 'px');
    }

    function resize() {
        create.call(this);
        dotTooltip.style('opacity', 0)
        .style('display', 'none');
    }

    return {
        name: 'dotTooltipSvg',
        onInit: function onInit(me) {
            _.me = me;
            this._.options.showBarTooltip = true;
        },
        onCreate: function onCreate() {
            create.call(this);
        },
        onRefresh: function onRefresh() {
            refresh.call(this);
        },
        onResize: function onResize() {
            resize.call(this);
        },
        visible: function visible() {
            return _.visible;
        }
    }
}
