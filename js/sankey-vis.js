var width = document.getElementById("sankey").offsetWidth,
    height = document.getElementById("sankey").offsetHeight,
    margin = 40;

// format variables
var color = d3.scaleOrdinal(['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080', '#ffffff', '#000000']);

console.log(d3.schemePastel1);

// Set the sankey diagram properties
var sankey = d3.sankey()
    .nodeWidth(10)
    .nodePadding(0)
    .size([width - margin, height - margin]);

var path = sankey.links();


// load the data

function updatesankey(first, second, year) {

    document.getElementById("sankey").innerHTML = "";

    // append the svg object to the body of the page
    let svg = d3.select("#sankey")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + margin / 2 + ", " + margin / 2 + ")")

    d3.json("sankeydata/" + first + "-" + second + ".json").then(function (data) {

        let parentlist = Object.keys(data);
        var sankeyjson = {
            "nodes": [],
            "links": []
        };

        parentlist.forEach(function (parent, i) {

            // push all the parent nodes to "nodes"

            let parentnodenumber = Object.keys(sankeyjson.nodes).length;
            let childlist = Object.keys(data[parent]);

            let parentchecker = 0;

            childlist.forEach(function (d) {
                if (data[parent][d][year] !== undefined) {
                    parentchecker++;
                }
            });

            if (parentchecker !== 0) {
                sankeyjson.nodes.push({
                    "node": parentnodenumber,
                    "name": parent
                })


                childlist.forEach(function (child) {

                    let value = data[parent][child][year];

                    if (value !== undefined) {

                        let childfilter = sankeyjson.nodes.filter(function (d) {
                            return d.name == child;
                        });

                        let childnodenumber;

                        // push all the child nodes to "nodes" if no duplicates
                        if (childfilter.length == 0) {

                            childnodenumber = Object.keys(sankeyjson.nodes).length;
                            sankeyjson.nodes.push({
                                "node": childnodenumber,
                                "name": child
                            });

                        } else {
                            childnodenumber = childfilter[0].node;
                        };

                        // push all the correlations to "links"
                        sankeyjson.links.push({
                            "source": parentnodenumber,
                            "target": childnodenumber,
                            "value": +value
                        });
                    };

                });
            };
        })

        graph = sankey(sankeyjson);
        console.log(graph);
        
        //offset for gradient
        graph.links.forEach(function(d){
            d.y0 = d.y0 + 0.1;
        })

        let svgDefs = svg.append("defs");

        let Gradient = svgDefs.append('linearGradient')
            .attr('id', 'Gradientmain');

        Gradient.append('stop')
            .attr('stop-color', "pink")
            .attr('offset', '0');

        Gradient.append('stop')
            .attr('stop-color', "red")
            .attr('offset', '100');


        // add in the links
        var link = svg
            .append("g")
            .selectAll(".link")
            .data(graph.links)
            .enter()
            .append("path")
            .attr("class", "link")
            .attr("d", d3.sankeyLinkHorizontal())
            .style("stroke", function (d) {
                d.source.color = color(d.source.name.replace(/ .*/, ""));
                d.target.color = color(d.target.name.replace(/ .*/, ""));

                Gradient = svgDefs.append('linearGradient')
                    .attr('id', 'Gradient' + d.index);

                Gradient.append('stop')
                    .attr('stop-color', color(d.source.name.replace(/ .*/, "")))
                    .attr('offset', '0');

                Gradient.append('stop')
                    .attr('stop-color', color(d.target.name.replace(/ .*/, "")))
                    .attr('offset', '100');

                return "url(#Gradient" + d.index + ")";
                
                console.log("url(#Gradient" + d.index + ")")
                
//                return d.source.color;
            });

        link.transition()
            .attr("stroke-width", function (d) {
                return d.width;
            })

        // add in the nodes
        var node = svg.append("g")
            .selectAll(".node")
            .data(graph.nodes)
            .enter()
            .append("g")
            .attr("class", "node");

        // add the rectangles for the nodes
        node.append("rect")
            .attr("class", "nodeedges")
            .attr("x", function (d) {
                return d.x0;
            })
            .attr("width", sankey.nodeWidth())
            .style("fill", function (d) {
                return d.color = color(d.name.replace(/ .*/, ""));
            })
            .style("stroke", function (d) {
                return d.color;
            });

        svg.selectAll("rect")
            .transition()
            .attr("y", function (d) {
                return d.y0;
            })
            .attr("height", function (d) {
                if (d.y1 - d.y0 > 0) {
                    return d.y1 - d.y0
                } else {
                    return 0
                };
            })

        // add in the title for the nodes
        node.append("text")
            .attr("class", "categories")
            .attr("x", function (d) {
                return d.x0 - 5;
            })
            .attr("y", function (d) {
                return (d.y1 + d.y0) / 2;
            })
            .attr("dy", "0.35em")
            .attr("text-anchor", "end")
            .text(function (d) {
                return d.name;
            })
            .filter(function (d) {
                return d.x0 < width / 2;
            })
            .attr("x", function (d) {
                return d.x1 + 5;
            })
            .attr("text-anchor", "start");

    });

};

updatesankey("gender", "ethnic", "All");
