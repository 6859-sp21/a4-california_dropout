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
    
    var mapWidth = document.getElementById("calimap").offsetWidth,
        mapHeight = document.getElementById("calimap").offsetHeight;

        var svg = d3.select("#calimap")
        .append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 " + mapWidth + " " + mapHeight)
    

    
    mercator = d3.geoMercator()
            .center([0,0])
            .scale(3410)
            .translate([7430,2750]);
                        
    var path = d3.geoPath().projection(mercator);
    
    // var svg = d3.select("#calimap")
    //     .append("svg")
    //     .attr("width", mapWidth)
    //     .attr("height", mapHeight);
    
    d3.json("./data/california-counties@1.topojson").then(function(json) {
        let counties = topojson.feature(json, json.objects.counties);
    
        // <g> grouping element
        let g = svg.append('g');
    
        // get another data
        d3.json("./sankeydata/county-gender.json").then(function(json_data) {
    
            // filter data
            console.log(json_data)
            var county2num = {};
            let selectedYear = year;
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
            let shabicolor = d3.scaleSequentialQuantile(Object.values(county2num), d3.interpolateBlues);
    
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
                    return county2num[d.properties.NAME] == 0 ? "rgb(213,222,217)" : shabicolor(county2num[d.properties.NAME]);
                } else {
                    // console.log(d.properties.NAME);
                    return "rgb(213,222,217)";
                }})
            .style("stroke", "white")
            .style('stroke-width', 0)
            .append("text")
            .text(function(d){
                return d.properties.NAME;
            })
            // .text(d => d.properties.County)
    
            // tooltip
            let tooltip = svg.append("g");

            svg
            .selectAll(".county")
            .on("touchmove mousemove", function(event, d) {
                tooltip.call(
                    callout,
                    `${format(d.properties.NAME)}
                    ${county2num[d.properties.NAME] != undefined ? county2num[d.properties.NAME] : 0} dropout(s)`
                )
                tooltip.attr("transform", `translate(${d3.pointer(event, this)})`);
                })
                
            .on("touchend mouseleave", function() {
                tooltip.call(callout, null);
                
                // d3.select(this)
                //     .attr("stroke", null)
                //     .lower();
            })  
            .on("click", function(event,d){

                let selectedcounty = d.properties.NAME;
                let selectedcountynum = county2num[d.properties.NAME] || 0;

                geo_subgraph("ethnic", selectedcounty, "update");
                geo_subgraph("gender", selectedcounty, "update");
                geo_subgraph("grade", selectedcounty, "update");
                
                UpdateCountyInfo(selectedcounty, selectedcountynum, "update");

                d3.selectAll(".county")
                    .style("stroke-width", 0)
                    .style("stroke", "white")

                    console.log(this);

                d3.select(this)
                    .style('z-index', 999999)
                    .transition()
                    .duration(200)
                    .style("stroke", "black")
                    .style("stroke-opacity", 1)
                    .style('stroke-width', 1)





            })       
        })

            
    })

}

drawGeomap("All");


