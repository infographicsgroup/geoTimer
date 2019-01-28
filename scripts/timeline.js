class Timeline {

    constructor() {

        this.start;
        this.end;
        this.padding = 15;
        this.circle = null;
        this.timeRelation = 1;
    }

    init() {

        let line = d3.select("svg.timeline")
            .append("line")
            .attrs({

                "x1": 0 + this.padding,
                "y1": 50,
                "x2": 900 - this.padding,
                "y2": 50
            })
            .styles({

                "stroke": "black",
                "stroke-width": "1",
            })

        let sideline = d3.select("svg.timeline")
            .append("g")
            .selectAll("line")
            .data([0, 1])
            .enter()
            .append("line")
            .attrs({

                "x1": (d, i) => {

                    if (i == 1) {

                        return (i * 900) - this.padding;
                    }

                    return (i * 900) + this.padding;
                },
                "y1": 50 - 10,
                "x2": (d, i) => {

                    if (i == 1) {

                        return (i * 900) - this.padding;
                    }

                    return (i * 900) + this.padding;
                },
                "y2": 50 + 10
            })
            .styles({

                "stroke": "black",
                "stroke-width": "1",
            })

        // this.circle = d3.select("svg.timeline")
        //     .append("circle")
        //     .attr("cx", this.padding)
        //     .attr("cy", 50)
        //     .attr("r", 5);
    }

    setStartEnd(start, end) {

        this.timeScale = d3.scaleLinear()
            .domain([start, end])
            .range([this.padding, 900 - (2 * this.padding)]);
    }

    update(time, duration) {

        let tTime = time - this.start;

        this.circle
            .transition()
            .duration(duration)
            .attr("cx", tTime * this.timeRelation)
            .attr("transform", "translate(" + this.padding + ", 0)");

    }

    plotCircles(dataset) {

        let tCount = 0;
        let elementPadding = 7;
        for (let data in dataset) {
            tCount++;
            let line = d3.select("svg.timeline")
                .append("g")
                .selectAll("circle")
                .data(dataset[data].set)
                .enter()
                .append("circle")
                .attr("cx", (d) => {

                    return this.timeScale(d[2]);
                })
                .attr("cy", 50 - (this.padding) - (tCount * elementPadding))
                .attr("r", 3)
                .attrs({
                    "fill": dataset[data].color
                })
                .attr("transform", "translate(" + this.padding + ", " + this.padding + ")");
        }
    }

}