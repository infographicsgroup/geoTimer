// @ts-check
// @ts-ignore
// d3 = window.d3;
// @ts-ignore
// state = window.state;

const ANIMATION_DURATION = 50;
const CIRCLE_MAXRADIUS = 5;
const CIRCLE_MINRADIUS = 1;

class Path {

  constructor() {
    this.path = null;
    this.circles = null;
    this.coordinates = null;
    this.count = 0;
    this.dataset = {};
    this.projection = null;
    this.timeline = null;
    this.heightPlot = null;
    this.heightScale = null;
  }

  init(json) {

    this.json = json;
    let data = json.rows;

    let set = this.convertToGeo(data);

    this.projection = d3[state.type]();

    this.projection
      .scale(state.scale)
      .translate([state.translateX, state.translateY])
      .center([state.centerLon, state.centerLat])
      .rotate([state.rotateLambda, state.rotatePhi, state.rotateGamma]);

    //this.heightPlot.plotLine(this.dataset);
  }

  update() {

    this.projection
      .scale(state.scale)
      .translate([state.translateX, state.translateY])
      .center([state.centerLon, state.centerLat])
      .rotate([state.rotateLambda, state.rotatePhi, state.rotateGamma]);

    this.plot();
  }

  plot() {
    d3.selectAll("svg.map .path path").remove()
    for (let data in this.dataset) {

      this.drawStaticPath(this.dataset[data]);
    }
  }

  drawStaticPath(dataset) {

    let d3line = d3
      .line()
      .x(d => this.projection(d)[0])
      .y(d => this.projection(d)[1]);

    this.path = d3
      .select("svg.map g.path")
      .append("path")
      .attr("d", d3line(dataset.set))
      .attr("fill", "none")
      .attr("stroke", dataset.color)
      .attr("opacity", "0.5")
      .attr("stroke-width", "1")
      .attr("class", "line")
  }

  playAnimation() {

    this.plot();
    this.heightPlot.plotLine(this.dataset);
  }

  drawAnimatedPath() {

    let d3line = d3
      .line()
      .x(d => this.projection(d)[0])
      .y(d => this.projection(d)[1]);

    const pathTween = () => {
      const last = this.coordinates[this.count];
      const newPoint = this.coordinates[this.count + 1];

      let xi = d3.interpolate(last[0], newPoint[0]);
      let yi = d3.interpolate(last[1], newPoint[1]);

      return t => {
        return d3line([...this.lineArray, [xi(t), yi(t)]]);
      };
    };

    ///-----
    if (!this.coordinates[this.count + 1]) {
      console.log("END");
      return;
    }

    this.lineArray = this.coordinates.slice(0, this.count + 1);

    let tElement = this.coordinates[this.count + 1];
    let tTime = tElement[3] * 0.000001;

    this.timeline.update(tElement[2], tTime);
    this.heightPlot.update(tElement[4], tElement[2], tTime);

    //if (this.path) this.path.remove();
    d3.selectAll("svg.map .path path").remove()
    this.path = d3
      .select("svg.map g.path")
      .append("path")
      .attr("d", d3line(this.lineArray))
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("opacity", "0.5")
      .attr("stroke-width", "1")
      .attr("class", "line")
      .transition()
      .duration(tTime)
      .attrTween("d", pathTween)
      .on("end", () => {
        this.count++;
        this.plot();
      });
  }

  plotCircles() {

    this.timeline.plotCircles(this.dataset)

    this.projection
      .scale(state.scale)
      .translate([state.translateX, state.translateY])
      .center([state.centerLon, state.centerLat])
      .rotate([state.rotateLambda, state.rotatePhi, state.rotateGamma]);

    if (this.circles) this.circles.remove()

    for (let data in this.dataset) {

      this.circles = d3
        .select("svg.map g.points")
        .append("g")
        .selectAll("circle")
        .data(this.dataset[data].set)
        .enter()
        .append("circle")
        .attr("cx", d => this.projection(d)[0])
        .attr("cy", d => this.projection(d)[1])
        .attr("r", d => this.heightScale(d[4]))
        .attr("fill", this.dataset[data].color);
    }
  }

  convertToGeo(data) {

    let datastructure = {

      "longitude": d3.select("#dataIds input#longitude").property("value"),
      "latitude": d3.select("#dataIds input#latitude").property("value"),
      "altitude": d3.select("#dataIds input#altitude").property("value"),
      "time": d3.select("#dataIds input#time").property("value"),
      "id": d3.select("#dataIds input#elementId").property("value"),
      "name": d3.select("#dataIds input#elementName").property("value")
    }

    let lastElement = null;

    let startTime = 0;
    let endTime = 0;
    let lastTime = 0;
    let minHeight = 10000000000000;
    let maxHeight = -10000000000000;
    /*{
        id:{

          "name"
          "color"
          "set":[]
        },...
      }
    */

    data.forEach(element => {

      if (parseFloat(element[datastructure.longitude]) && parseFloat(element[datastructure.latitude])) {

        let point = [parseFloat(element[datastructure.longitude]), parseFloat(element[datastructure.latitude])];

        let timeElement = element[datastructure.time];

        //"2013-12-18 18:00:22.000",
        let year = parseInt(timeElement.split(" ")[0].split("-")[0], 10);
        let month = parseInt(timeElement.split(" ")[0].split("-")[1], 10) - 1;
        let day = parseInt(timeElement.split(" ")[0].split("-")[2], 10);
        let hour = parseInt(timeElement.split(" ")[1].split(":")[0], 10);
        let min = parseInt(timeElement.split(" ")[1].split(":")[1], 10);

        let time = new Date(year, month, day, hour, min).getTime();

        point.push(time);

        let timeToLast;

        if (!startTime) {
          startTime = time;

          timeToLast = 0;
        } else {

          timeToLast = time - lastTime;
        }

        if (startTime > time) {

          startTime = time;
        }

        if (endTime < time) {

          endTime = time;
        }

        lastTime = time;

        let height = 0;

        if (element[datastructure.altitude]) {

          height = parseFloat(element[datastructure.altitude]);

          if (height < minHeight) minHeight = height;
          if (height > maxHeight) maxHeight = height;
        }

        point.push(timeToLast);
        point.push(height);

        let id = element[datastructure.id];
        let name = element[datastructure.name];

        if (!this.dataset[id]) {

          this.dataset[id] = {

            "name": name,
            "id": id,
            "color": "rgb(" + Math.round(Math.random() * 255) + "," + Math.round(Math.random() * 255) + "," + Math.round(Math.random() * 255) + ")",
            "set": []
          }
        }

        this.dataset[id].set.push(point);
      }
    });

    //let minHeight = Math.min(...heights);
    //let maxHeight = Math.max(...heights);
    //[long,lat,time, timetolast, height, id, name]
    this.timeline.setStartEnd(startTime, endTime);
    this.heightPlot.setStartEnd(startTime, endTime);
    this.heightPlot.setMinMaxHeight(minHeight, maxHeight);

    this.heightScale = d3.scaleLinear()
      .domain([minHeight, maxHeight])
      .range([CIRCLE_MINRADIUS, CIRCLE_MAXRADIUS]);

    return this.dataset;
  }

  // zoom() {

  //   var bounds = path.bounds(d),
  //     dx = bounds[1][0] - bounds[0][0],
  //     dy = bounds[1][1] - bounds[0][1],
  //     x = (bounds[0][0] + bounds[1][0]) / 2,
  //     y = (bounds[0][1] + bounds[1][1]) / 2,
  //     scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / width, dy / height))),
  //     translate = [width / 2 - scale * x, height / 2 - scale * y];

  //   svg.transition()
  //     .duration(750)
  //     // .call(zoom.translate(translate).scale(scale).event); // not in d3 v4
  //     .call(zoom.transform, d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale)); // updated for d3 v4
  // }
}