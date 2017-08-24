import earthjs from './src/earthjs';

import worldJson       from './src/data/worldJson';
import choroplethCsv   from './src/data/choroplethCsv';
import countryNamesCsv from './src/data/countryNamesCsv';

import hoverCanvas      from './src/base/hoverCanvas';
import clickCanvas      from './src/base/clickCanvas';
import mousePlugin      from './src/base/mousePlugin';
import configPlugin     from './src/base/configPlugin';
import canvasPlugin     from './src/base/canvasPlugin';
import countryCanvas    from './src/base/countryCanvas';
import threejsPlugin    from './src/base/threejsPlugin';
import dblClickCanvas   from './src/base/dblClickCanvas';
import autorotatePlugin from './src/base/autorotatePlugin';

import barSvg           from './src/svg/barSvg';
import dotsSvg          from './src/svg/dotsSvg';
import worldSvg         from './src/svg/worldSvg';
import pingsSvg         from './src/svg/pingsSvg';
import oceanSvg         from './src/svg/oceanSvg';
import sphereSvg        from './src/svg/sphereSvg';
import centerSvg        from './src/svg/centerSvg';
import placesSvg        from './src/svg/placesSvg';
import fauxGlobeSvg     from './src/svg/fauxGlobeSvg';
import graticuleSvg     from './src/svg/graticuleSvg';
import dropShadowSvg    from './src/svg/dropShadowSvg';
import dotTooltipSvg    from './src/svg/dotTooltipSvg';
import barTooltipSvg    from './src/svg/barTooltipSvg';
import countryTooltipSvg from './src/svg/countryTooltipSvg';

import pinCanvas            from './src/canvas/pinCanvas';
import dotsCanvas           from './src/canvas/dotsCanvas';
import worldCanvas          from './src/canvas/worldCanvas';
import pingsCanvas          from './src/canvas/pingsCanvas';
import centerCanvas         from './src/canvas/centerCanvas';
import dotSelectCanvas      from './src/canvas/dotSelectCanvas';
import graticuleCanvas      from './src/canvas/graticuleCanvas';
import dotTooltipCanvas     from './src/canvas/dotTooltipCanvas';
import countrySelectCanvas  from './src/canvas/countrySelectCanvas';
import countryTooltipCanvas from './src/canvas/countryTooltipCanvas';

import zoomPlugin           from './src/plugins/zoomPlugin';
import flattenPlugin        from './src/plugins/flattenPlugin';

import barThreejs         from './src/threejs/barThreejs';
import hmapThreejs        from './src/threejs/hmapThreejs';
import dotsThreejs        from './src/threejs/dotsThreejs';
import dotsCThreejs       from './src/threejs/dotsCThreejs';
import iconsThreejs       from './src/threejs/iconsThreejs';
import canvasThreejs      from './src/threejs/canvasThreejs';
import textureThreejs     from './src/threejs/textureThreejs';
import graticuleThreejs   from './src/threejs/graticuleThreejs';
import flightLineThreejs  from './src/threejs/flightLineThreejs';
import flightLine2Threejs from './src/threejs/flightLine2Threejs';
import debugThreejs       from './src/threejs/debugThreejs';
import oceanThreejs       from './src/threejs/oceanThreejs';
import imageThreejs       from './src/threejs/imageThreejs';
import worldThreejs       from './src/threejs/worldThreejs';
import globeThreejs       from './src/threejs/globeThreejs';
import sphereThreejs      from './src/threejs/sphereThreejs';
import world3d            from './src/threejs/world3d';
import world3d2           from './src/threejs/world3d2';

import commonPlugins    from './src/mixed/commonPlugins';
import selectCountryMix from './src/mixed/selectCountryMix';

earthjs.plugins= {
    worldJson,
    choroplethCsv,
    countryNamesCsv,

    hoverCanvas,
    clickCanvas,
    mousePlugin,
    configPlugin,
    canvasPlugin,
    countryCanvas,
    threejsPlugin,
    dblClickCanvas,
    autorotatePlugin,

    oceanSvg,
    sphereSvg,
    zoomPlugin,
    fauxGlobeSvg,
    graticuleSvg,
    dropShadowSvg,
    dotTooltipSvg,
    dotSelectCanvas,
    graticuleCanvas,
    dotTooltipCanvas,
    countrySelectCanvas,
    countryTooltipCanvas,
    countryTooltipSvg,
    barTooltipSvg,
    worldCanvas,
    centerSvg,
    placesSvg,
    worldSvg,
    barSvg,
    dotsSvg,
    pingsSvg,
    pinCanvas,
    dotsCanvas,
    pingsCanvas,
    centerCanvas,
    flattenPlugin,

    barThreejs,
    hmapThreejs,
    dotsThreejs,
    dotsCThreejs,
    iconsThreejs,
    canvasThreejs,
    textureThreejs,
    graticuleThreejs,
    flightLineThreejs,
    flightLine2Threejs,
    debugThreejs,
    oceanThreejs,
    imageThreejs,
    worldThreejs,
    globeThreejs,
    sphereThreejs,
    world3d,
    world3d2,

    commonPlugins,
    selectCountryMix,
};
export default earthjs;
