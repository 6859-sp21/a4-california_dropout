var barwidth = 200,
    barheight = 200, // set svg width and height
    barmargin = 20,
    barmax = 60, // hard coded maximum number of paths (60 counties)
    subyearScale = d3.scaleLinear()
    .domain([1991, 2016])
    .range([0, barwidth - barmargin * 1.5]),
    initialpath = [];

for (i = 1991; i < 2017; i++) { // only for transition purpose
    initialpath.push([subyearScale(i), barheight - barmargin]);
}

// preprocessed columns for faster data loading
var columes = {
    gender: ["Female", "Male"],
    ethnic: ["NativeAmericanorIndian", "Asian", "Pacific", "Filipino", "Hispanic", "AfricanAmerican", "White", "MultipleRace", "NoRace"],
    grade: ["D7", "D8", "D9", "D10", "D11", "D12"],
    county: ["Alameda", "Alpine", "Amador", "Butte", "Calaveras", "Colusa", "Contra Costa", "Del Norte", "El Dorado", "Fresno", "Glenn", "Humboldt", "Imperial", "Inyo", "Kern", "Kings", "Lake", "Lassen", "Los Angeles", "Madera", "Marin", "Mariposa", "Mendocino", "Merced", "Modoc", "Mono", "Monterey", "Napa", "Nevada", "Orange", "Placer", "Plumas", "Riverside", "Sacramento", "San Benito", "San Bernardino", "San Diego", "San Francisco", "San Joaquin", "San Luis Obispo", "San Mateo", "Santa Barbara", "Santa Clara", "Santa Cruz", "Shasta", "Sierra", "Siskiyou", "Solano", "Sonoma", "Stanislaus", "Sutter", "Tehama", "Trinity", "Tulare", "Tuolumne", "Ventura", "Yolo", "Yuba", "NA"]
};

function geo_subgraph(type, county, load) {

    d3.json("sankeydata/county-" + type + ".json").then(function (data) {
        data = data[county];

        let barData = [],
            maxpop = 0;

        columes[type].forEach(function (item, i) {
            let value = data[item]; 
            if (value == undefined){
                value = 0;
            }else {
                value = value["All"];
                if (value > maxpop) {
                    maxpop = value;
                }
            }
            barData.push({
                [type]: item,
                population: value
            });
        });

        // console.log(barData);

        // append the svg object to the body of the page
        

        // let parentlist = Object.keys(data);
        // var barjson = {
        //     "nodes": [],
        //     "links": []
        // };

        let colorScheme;
        if(type == "ethnic"){
            colorScheme = d3.scaleOrdinal()
            .domain(["NativeAmericanorIndian", "Asian", "Pacific", "Filipino", "Hispanic", "AfricanAmerican", "White", "MultipleRace", "NoRace"])
            .range(["orange", "yellow", "blue", "purple", "green", "brown", "white", "pink", "red"])
        } else if(type=="gender"){
            colorScheme = d3.scaleOrdinal()
            .domain(["Female", "Male"])
            .range(["orange", "blue"]);
        } else {
            colorScheme = d3.scaleOrdinal()
            .domain(["D7", "D8", "D9", "D10", "D11", "D12"])
            .range(["red","orange","yellow","green", "teal", "blue"]);
        }

        // set x and y remapping scales     
        let xScale = d3.scaleBand()
            .domain(columes[type])
            .range([0, barwidth - barmargin * 1.5])
            .padding(0.1);
        let yScale = d3.scaleLinear()
            .domain([0, maxpop])
            .range([barheight - barmargin, 0])

        if (load == "init") {

            d3.select("#bar-test")
                .append("svg")
                .attr("width", barwidth)
                .attr("height", barheight)
                .append("g")
                .attr("class", "bar" + type) // this is important
                .attr("transform", "translate(" + barmargin+ "," + barmargin/2 + ")")

            // append legends
            d3.select(".bar" + type)
                .append("g")
                .attr("transform", "translate(0," + (barheight - barmargin) + ")")
                .attr("class", "xScale" + type)

            d3.select(".bar" + type)
                .append("g")
                .attr("class", "yScale" + type)

            d3.select(".bar" + type)
                .append("g")
                .selectAll("barbar" + type)
                .data(barData)
                .enter()
                .append("rect")
                .attr("class","barbar" + type)
                .attr("x", function(d) { 
                    return xScale(d[type]); 
                })
                .attr("width", xScale.bandwidth())
                .attr("y", barheight - barmargin)
                .attr("height", 0)
                .on("mouseover", function(event,d){
                    console.log(d);
                })
        }

        // call axis
        d3.select(".xScale" + type)
            .transition()
            .call(d3.axisBottom(xScale));

        d3.select(".yScale" + type)
            .transition()
            .call(d3.axisLeft(yScale));

        d3.selectAll(".barbar" + type)
            .data(barData)
            .transition()
            .attr("x", function(d) { 
                return xScale(d[type]); 
            })
            .attr("width", xScale.bandwidth())
            .attr("y", function(d) {
                return yScale(d.population); 
            })
            .attr("height", function(d) {
                return barheight - barmargin - yScale(d.population); 
            })
            .style("fill", function(d){
                return colorScheme(d[type]);
            })

     
    });
};
geo_subgraph("ethnic", "Los Angeles", "init");
geo_subgraph("grade", "Los Angeles", "init");
geo_subgraph("gender", "Los Angeles", "init");
