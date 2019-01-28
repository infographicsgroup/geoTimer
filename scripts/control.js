const map = new Map();
map.init();

const timeline = new Timeline();
const path = new Path();
const menu = new Menu(map, path);
menu.init();
const heightPlot = new HeightPlot();
path.timeline = timeline;
path.timeline.init();
path.heightPlot = heightPlot;
path.heightPlot.init();

const loader = new Loader();

let state = {
    type: 'geoMercator',
    scale: 120,
    translateX: 450,
    translateY: 250,
    centerLon: 0,
    centerLat: 0,
    rotateLambda: 0.1,
    rotatePhi: 0,
    rotateGamma: 0
};

function datasetLoaded() {

    path.init(loader.getDataset());
};

function loadDataset() {

    let pathString = d3.select("#menu #pathString").attr('value');

    window.addEventListener('loadingFinished', function (e) {
        datasetLoaded();
    });

    loader.load(pathString);
};

function playAnimation() {

    path.playAnimation();
};

function plotCircles() {

    path.plotCircles();
};