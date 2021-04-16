function drawGeomap(year) {

    callout = (g, value) => {
        if (!value) return g.style("display", "none");
    
        g.style("display", null)
            .style("pointer-events", "none")
            .style("font", "10px sans-serif");
    
        let path = g.selectAll("path")
            .data([null])
            .join("path")
            .attr("fill", "white")
            .attr("stroke", "black");
    
        let text = g.selectAll("text")
            .data([null])
            .join("text")
            .call(text => text
            .selectAll("tspan")
            .data((value + "").split(/\n/))
            .join("tspan")
                .attr("x", 0)
                .attr("y", (d, i) => `${i * 1.1}em`)
                .style("font-weight", (_, i) => i ? null : "bold")
                .text(d => d));
    
        let {x, y, width: w, height: h} = text.node().getBBox();
    
        text.attr("transform", `translate(${-w / 2},${15 - y})`);
        path.attr("d", `M${-w / 2 - 10},5H-5l5,-5l5,5H${w / 2 + 10}v${h + 20}h-${w + 20}z`);
    }
    
    format = d => `County: ${d}`
    
    var mapWidth = 640,
        mapHeight = 640;
    
        mercator = d3
            .geoMercator()
            .center([-119, 37.4])
            .scale((1 << 18) / (28 * Math.PI))
            .translate([320, 320])
                        
    var path = d3.geoPath().projection(mercator);
    
    var svg = d3.select("#calimap").append("svg")
        .attr("width", mapWidth)
        .attr("height", mapHeight);
    
    d3.json("./data/california-counties@1.topojson").then(function(json) {
        const counties = topojson.feature(json, json.objects.counties);
    
        // <g> grouping element
        const g = svg.append('g');
    
        // get another data
        d3.json("./sankeydata/county-gender.json").then(function(json_data) {
    
            // filter data
            console.log(json_data)
            var county2num = {};
            const selectedYear = year;
            for (var key in json_data) {
                county2num[key] = 0;
                for (var gender in json_data[key]) {
                    if (json_data[key][gender] != undefined && json_data[key][gender][selectedYear] != undefined) {
                        // console.log(json_data[key][gender][selectedYear])
                        county2num[key] += json_data[key][gender][selectedYear];
                    }
                }
            }

            console.log(county2num)
    
            // color
            color = d3.scaleSequentialQuantile(Object.values(county2num), d3.interpolateBlues);
    
            g.append("g")
            .selectAll("path")
            .data(counties.features)
            .join("path")
            .attr("d", path)
            .attr("class", "county")
            // .attr("fill", d => color(county2num[d.properties.NAME]))
            .style('fill', function(d) {
                if (county2num[d.properties.NAME] != undefined) {
                    // console.log(color(county2num[d.properties.NAME]));
                    return county2num[d.properties.NAME] == 0 ? "rgb(213,222,217)" : color(county2num[d.properties.NAME]);
                } else {
                    console.log(d.properties.NAME);
                    return "rgb(213,222,217)";
                }})
            .style("stroke", "white")
            .style('stroke-width', 1)
            .append("text")
            .text(function(d){
                return d.properties.NAME;
            })
            // .text(d => d.properties.County)
    
            // tooltip
            const tooltip = svg.append("g");

            svg
            .selectAll(".county")
            .on("touchmove mousemove", function(event, d) {
                tooltip.call(
                    callout,
                    `${format(d.properties.NAME)}
                    ${county2num[d.properties.NAME] != undefined ? county2num[d.properties.NAME] : 0} dropout(s)`
                )
                tooltip.attr("transform", `translate(${d3.pointer(event, this)})`);
                
                d3.select(this)
                    .attr("stroke", "red")
                    .raise();
                })
            .on("touchend mouseleave", function() {
                tooltip.call(callout, null);
                
                d3.select(this)
                    .attr("stroke", null)
                    .lower();
            })  
            .on("click", function(event,d){
                let selectedcounty = d.properties.NAME;
                geo_subgraph("ethnic", selectedcounty, "update");
                geo_subgraph("gender", selectedcounty, "update");
                geo_subgraph("grade", selectedcounty, "update");
            })       
        })

            
    })

}

drawGeomap("All");


