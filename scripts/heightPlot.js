// @ts-check
// @ts-ignore
// d3 = window.d3;
// @ts-ignore
// state = window.state;


class HeightPlot {

    constructor() {

        this.padding = 10;

        this.maxHeight = 0;
        this.minHeight = 0;

        this.start;
        this.end;
        this.timeRelation;

        this.circle = null;
    }

    setMinMaxHeight(min, max) {

        this.maxHeight = max;
        this.minHeight = min;

        this.yRange = d3.scaleLinear()
            .domain([this.minHeight, this.maxHeight])
            .range([this.padding, 500 - (2 * this.padding)]);
    }

    setStartEnd(start, end) {

        this.start = start;
        this.end = end;

        let lineLength = 900 - (2 * this.padding)

        let timespan = this.end - this.start;
        this.timeRelation = lineLength / timespan;
    }

    init() {

        let legend = d3.select("svg.heightPlot")
            .append("g")
            .attr("class", "legend")

        legend.append("line")
            .attr("x1", this.padding)
            .attr("y1", 500 - this.padding)
            .attr("x2", this.padding)
            .attr("y2", this.padding)
            .attr("stroke", "black")
            .attr("stroke-width", "1")

        legend.append("line")
            .attr("x1", this.padding)
            .attr("y1", 500 - this.padding)
            .attr("x2", 900 - this.padding)
            .attr("y2", 500 - this.padding)
            .attr("stroke", "black")
            .attr("stroke-width", "1");

        this.circle = d3.select("svg.heightPlot")
            .append("circle")
            .attrs({

                "cx": this.padding,
                "cy": 500 - this.padding,
                "r": "5",
                "fill": "black"
            })
    }

    plotLine(dataset) {

        let zeroPoint = d3.select("svg.heightPlot")
            .append("g")
            .attr("class", "zeroPoint")

        zeroPoint.append("line")
            .attr("x1", this.padding)
            .attr("y1", 500 - this.yRange(0))
            .attr("x2", 900 - this.padding)
            .attr("y2", 500 - this.yRange(0))
            .attr("stroke", "black")
            .attr("stroke-width", "1")

        const generator2 = d3.line()
            .curve(d3.curveLinear)
            .x((d) => {

                let tTime = d[2] - this.start;

                return tTime * this.timeRelation;
            })
            .y((d) => {

                return 500 - this.yRange(d[4]);
            });


        for (let data in dataset) {

            let line = d3.select("svg.heightPlot")
                .append("path")
                .data(data)
                .attr("d", generator2(dataset[data].set))
                .attrs({
                    fill: 'none',
                    stroke: dataset[data].color,
                    "stroke-width": "1"
                })
                .attr("transform", "translate(" + this.padding + ", " + this.padding + ")");
        }
    }

    update(height, time, duration) {

        let tTime = time - this.start;

        this.circle
            .transition()
            .duration(duration)
            .attr("cx", tTime * this.timeRelation)
            .attr("cy", (d) => {

                return 500 - this.yRange(height)
            })
            .attr("transform", "translate(" + this.padding + ", " + this.padding + ")");
    }
}