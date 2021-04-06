var widthbar = document.getElementById("bar").offsetWidth,
    heightbar = document.getElementById("bar").offsetHeight,
    margin = 10;

function barbar() {
    // var svg = d3.select("svg"),
    // margin = 200,
    // width = svg.attr("width") - margin,
    // height = svg.attr("height") - margin;

    // var g = svg.append("g")
    //         .attr("transform", "translate(" + 100 + "," + 100 + ")");

    let g = d3.select("#bar")
            .append("svg")
            .attr("width", widthbar)
            .attr("height", heightbar)
            .append("g")
            // .attr("transform", "translate(" + margin / 2 + ", " + margin / 2 + ")")
            .attr("transform", "translate(" + 50 + "," + 50 + ")");

        g.append("text")
            .attr("transform", "translate(100,0)")
            .attr("x", 50)
            .attr("y", 50)
            .attr("font-size", "24px")
            .text("Number of Dropouts in California from 1991-2016")

    d3.csv("sankeydata/bar-test.csv").then((original_data)=>{

        // sum the dropout numbers and save to data
        var aggregated_data = {};
        original_data.forEach(function(d) {
        if (aggregated_data.hasOwnProperty(d.begin_year)) {
            // console.log(d.dropout)
            aggregated_data[d.begin_year] = aggregated_data[d.begin_year] + parseInt(d.dropout);
        } else {
            aggregated_data[d.begin_year] = parseInt(d.dropout);
        }
        });
        console.log(aggregated_data)

        var data = [];
        for (var prop in aggregated_data) {
            data.push({ begin_year: prop, dropout: aggregated_data[prop] });
        }
        console.log(data)
        // const year = document.getElementById("yearRange").value;
        // var csvdata = data.filter(d => d.begin_year === year);
        // console.log(data)

        var xScale = d3.scaleBand()
                        .domain(data.map(d => d.begin_year))
                        .range ([0, widthbar]).padding(0.2),
            yScale = d3.scaleLinear()
                        .domain([0, d3.max(data, function(d) { return d.dropout; })])
                        .range ([heightbar, 0]);

        // xScale.domain(data.map(function(d) { return d.begin_year; }));
        // yScale.domain([0, d3.max(data, function(d) { return d.dropout; })]);

        // x-axis
        g.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale))
            .append("text")
            .attr("y", heightbar - 550)
            .attr("x", widthbar - 100)
            .attr("text-anchor", "end")
            .attr("stroke", "black")
            .text("Year");

        // g.append("g")
        //     .attr("transform", "translate(0," + height + ")")
        //     .call(d3.axisBottom(xScale));

        g.append("g")
            .call(d3.axisLeft(yScale)
            .tickFormat(function(d){
                return d;
            }).ticks(10))
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "-5.1em")
            .attr("text-anchor", "middle")
            .attr("stroke", "black")
            .text("Number of Dropouts");
        
        g.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return xScale(d.begin_year); })
            .attr("y", function(d) { return yScale(d.dropout); })
            .attr("width", xScale.bandwidth()/2)
            .attr("height", function(d) { return heightbar - yScale(d.dropout); })
        
        g.selectAll('#bar.text')
            .data(data)
            .join('text')
            .attr('x', d => xScale(d.begin_year))
            .attr('y', d => yScale(d.dropout))   
            .attr('dx', xScale.bandwidth() / 2)
            .attr('dy', '1em')
            .attr('fill', 'white')
            .style('font-size', 10)
            .style('text-anchor', 'middle')
            .text(d => d.dropout)
        
        // document.getElementById("bar").appendChild(g.node());
    });
}
barbar();