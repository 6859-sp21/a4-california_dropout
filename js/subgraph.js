var subwidth = document.getElementById("partAGraph").offsetWidth,
    subheight = document.getElementById("partAGraph").offsetHeight, // set svg width and height
    submargin = 40,
    submax = 60, // hard coded maximum number of paths (60 counties)
    subyearScale = d3.scaleLinear()
    .domain([1991, 2016])
    .range([0, subwidth - submargin * 1.5]),
    initialpath = [];

for (i = 1991; i < 2017; i++) { // only for transition purpose
    initialpath.push([subyearScale(i), subheight - submargin]);
}

// preprocessed columns for faster data loading
var columes = {
    gender: ["Female", "Male"],
    ethnic: ["NativeAmericanorIndian", "Asian", "Pacific", "Filipino", "Hispanic", "AfricanAmerican", "White", "MultipleRace", "NoRace"],
    grade: ["D7", "D8", "D9", "D10", "D11", "D12"],
    county: ["Alameda", "Alpine", "Amador", "Butte", "Calaveras", "Colusa", "Contra Costa", "Del Norte", "El Dorado", "Fresno", "Glenn", "Humboldt", "Imperial", "Inyo", "Kern", "Kings", "Lake", "Lassen", "Los Angeles", "Madera", "Marin", "Mariposa", "Mendocino", "Merced", "Modoc", "Mono", "Monterey", "Napa", "Nevada", "Orange", "Placer", "Plumas", "Riverside", "Sacramento", "San Benito", "San Bernardino", "San Diego", "San Francisco", "San Joaquin", "San Luis Obispo", "San Mateo", "Santa Barbara", "Santa Clara", "Santa Cruz", "Shasta", "Sierra", "Siskiyou", "Solano", "Sonoma", "Stanislaus", "Sutter", "Tehama", "Trinity", "Tulare", "Tuolumne", "Ventura", "Yolo", "Yuba", "NA"]
};

function subgraph(N, C, load) {
    d3.csv("data/dropoutdata_cleaned.csv").then(function (data) {

        // create container for new fitered data
        let filtereddata = {},
            maxfiltered = {},
            maxpop = 0;

        // set up for-loop from 1991 to 2016 per category of data
        for (let col = 0; col < columes[C].length; col++) {
            filtereddata[columes[C][col]] = {}; //e.g. filtereddata[Female] = {}
            maxfiltered[columes[C][col]] = 0;
            for (let yr = 1991; yr < 2017; yr++) {
                filtereddata[columes[C][col]][yr] = 0;
            };
        };

        // process actual path data
        if (C == "county") {

            data.forEach(function (d) {
                let gradepopulation = 0;

                columes.grade.forEach(function (g) {
                    gradepopulation += +d[g];
                })

                filtereddata[d.County][+d.Academic_Year] += gradepopulation;
                if (filtereddata[d.County][+d.Academic_Year] > maxpop) {
                    maxpop = filtereddata[d.County][+d.Academic_Year];
                }
                if (filtereddata[d.County][+d.Academic_Year] > maxfiltered[d.County]) {
                    maxfiltered[d.County] = filtereddata[d.County][+d.Academic_Year];
                };
            })

        } else {

            data.forEach(function (d) { // run csv
                columes[C].forEach(function (g) {
                    filtereddata[g][+d.Academic_Year] += +d[g];

                    if (filtereddata[g][+d.Academic_Year] > maxpop) {
                        maxpop = filtereddata[g][+d.Academic_Year];
                    }

                    if (filtereddata[g][+d.Academic_Year] > maxfiltered[g]) {
                        maxfiltered[g] = filtereddata[g][+d.Academic_Year];
                    }
                })
            })
        }

        let maxfilteredarray = [];
        Object.keys(maxfiltered).forEach(function (d) {
            maxfilteredarray.push({
                key: d,
                value: maxfiltered[d]
            })
        })

        maxfilteredarray = maxfilteredarray.sort(function (x, y) {
            return d3.ascending(y.value, x.value);
        })

        if (load == "init") {

            d3.select("#part" + N + "Graph")
                .append("svg")
                .attr("width", subwidth)
                .attr("height", subheight)
                .append("g")
                .attr("class", "part" + N + "GraphG")
                .attr("transform", "translate(" + submargin + ", 2)");

            // append legends
            d3.select(".part" + N + "GraphG")
                .append("g")
                .attr("transform", "translate(0," + (subheight - submargin) + ")")
                .attr("class", "xScale" + N)

            d3.select(".part" + N + "GraphG")
                .append("g")
                .attr("class", "yScale" + N)

            for (let i = 0; i < submax; i++) {
                d3.select(".part" + N + "GraphG")
                    .append("path")
                    .attr("class", "graph" + N + "path" + i)
                    .attr("fill", "none")
                    .attr("stroke", "none")
                    .attr("stroke-width", 1)
                    .attr("d", d3.line()(initialpath))
            };
        }

        // set x and y remapping scales
        let yScale = d3.scaleLinear()
            .domain([0, maxpop])
            .range([subheight - submargin, 0])
        let xScale = d3.scaleLinear()
            .domain([1991, 2016])
            .range([0, subwidth - submargin * 1.5])

        // call axis
        d3.select(".xScale" + N)
            .call(d3.axisBottom(xScale));

        d3.select(".yScale" + N)
            .transition()
            .call(d3.axisLeft(yScale));
        
        for (let i = 0; i < submax; i++) {
            if (i < maxfilteredarray.length) {

                let tempname = maxfilteredarray[i].key,
                    tempdata = [],
                    temp = document.getElementsByClassName("edge" + tempname.replace(/\s/g, ''))[0],
                    tempcolor = "none";

                if (temp !== undefined) {
                    tempcolor = temp.style.fill;
                }

                for (let yr = 1991; yr < 2017; yr++) {
                    tempdata.push({
                        name: tempname,
                        date: yr,
                        value: filtereddata[tempname][yr]
                    })
                };

                d3.select(".graph" + N + "path" + i)
                    .datum(tempdata)
                    .transition()
                    .duration(800)
                    .attr("class", "graph" + N + "path" + i + " activepath path" + tempname.replace(/\s/g, ''))
                    .attr("stroke", tempcolor)
                    .attr("d", d3.line()
                        .x(function (d) {
                            return xScale(d.date)
                        })
                        .y(function (d) {
                            return yScale(d.value)
                        })
                    )

                d3.select(".graph" + N + "path" + i)
                    .on("mouseover", function (event, d) {

                        d3.select(this).transition()
                            .style("stroke-width", "5px")
                        d3.selectAll(".link" + d[0].name.replace(/\s/g, ''))
                            .transition()
                            .style("stroke-opacity", 1)
                    })
                    .on("mouseout", function (event, d) {
                        d3.select(this).transition()
                            .style("stroke-width", "1px")
                        d3.selectAll(".link" + d[0].name.replace(/\s/g, ''))
                            .transition()
                            .style("stroke-opacity", 0.3)
                    })

            } else {

                d3.select(".graph" + N + "path" + i)
                    .transition()
                    .attr("class", "graph" + N + "path" + i)
                    .attr("stroke", "none")
                    .attr("d", d3.line()(initialpath))

                d3.select(".graph" + N + "path" + i)
                    .on("mouseover", "")
                    .on("mouseout", "")

            }

        };

    });
};
