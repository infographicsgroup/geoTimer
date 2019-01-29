class Map {

    constructor() {

        this.geojson = null;
    }

    init() {

        let that = this;

        d3.json(
            'https://gist.githubusercontent.com/d3indepth/f28e1c3a99ea6d84986f35ac8646fac7/raw/c58cede8dab4673c91a3db702d50f7447b373d98/ne_110m_land.json',
            function (err, json) {

                that.geojson = json;

                that.update(state);
            })
    }

    update(state) {


        // Update projection
        let projection = d3[state.type]();

        let geoGenerator = d3.geoPath()
            .projection(projection);

        const graticule = d3.geoGraticule();

        projection
            .scale(state.scale)
            .translate([state.translateX, state.translateY])
            .center([state.centerLon, state.centerLat])
            .rotate([state.rotateLambda, state.rotatePhi, state.rotateGamma])

        // Update world map
        let u = d3.select('svg.map g.map')
            .selectAll('path')
            .data(this.geojson.features)

        u.enter()
            .append('path')
            .merge(u)
            .attr('d', geoGenerator)

        // Update graticule
        d3.select('svg.map .graticule path')
            .datum(graticule())
            .attr('d', geoGenerator)
    }
};