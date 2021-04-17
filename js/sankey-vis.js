var sankeywidth = document.getElementById("sankey").offsetWidth,
    sankeyheight = document.getElementById("sankey").offsetHeight,
    sankeymargin = 40;

// Create a long color-scheme for the sankey since D3 v6 is a bitch and doesn't have categorical20
var color = d3.scaleOrdinal(['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080', '#ffffff', '#000000']);

// Sankey property setup: DO NOT CHANGE
var sankey = d3.sankey()
    .nodeWidth(10)
    .nodePadding(0)
    .size([sankeywidth, sankeyheight - sankeymargin]);
var path = sankey.links();


function updatesankey(first, second, year) {

    d3.json("sankeydata/" + first + "-" + second + ".json").then(function (data) {

        document.getElementById("sankey").innerHTML = "";

        // append the svg object to the body of the page
        let sankeysvg = d3.select("#sankey")
            .append("svg")
            .attr("width", sankeywidth)
            .attr("height", sankeyheight)
            .append("g")
            .attr("transform", "translate(0, " + sankeymargin / 2 + ")")

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

        //offset for gradient
        graph.links.forEach(function (d) {
            d.y0 = d.y0 + 0.1;
        })

        let sankeysvgDefs = sankeysvg.append("defs");

        let Gradient = sankeysvgDefs.append('linearGradient')
            .attr('id', 'Gradientmain');

        Gradient.append('stop')
            .attr('stop-color', "pink")
            .attr('offset', '0');

        Gradient.append('stop')
            .attr('stop-color', "red")
            .attr('offset', '100');


        // add in the links
        var link = sankeysvg
            .append("g")
            .selectAll(".sankeylink")
            .data(graph.links)
            .enter()
            .append("path")
            .attr("class", function (d) {
                return "sankeylink " + "link" + d.source.name.replace(/\s/g, "") + " link" + d.target.name.replace(/\s/g, "");
            })
            .attr("d", d3.sankeyLinkHorizontal())
            .style("stroke", function (d) {
                d.source.color = color(d.source.name.replace(/\s/g, ""));
                d.target.color = color(d.target.name.replace(/\s/g, ""));

                Gradient = sankeysvgDefs.append('linearGradient')
                    .attr('id', 'Gradient' + d.index);

                Gradient.append('stop')
                    .attr('stop-color', color(d.source.name.replace(/\s/g, "")))
                    .attr('offset', '0');

                Gradient.append('stop')
                    .attr('stop-color', color(d.target.name.replace(/\s/g, "")))
                    .attr('offset', '100');

                return "url(#Gradient" + d.index + ")";
            })
            .on("mouseover", function (event, d) {
                d3.selectAll(".path" + d.source.name.replace(/\s/g, ''))
                    .transition()
                    .style("stroke-width", "5px")
                d3.selectAll(".path" + d.target.name.replace(/\s/g, ''))
                    .transition()
                    .style("stroke-width", "5px")
                d3.select(this).transition()
                    .style("stroke-opacity", 1)
            })
            .on("mouseout", function (event, d) {
                d3.selectAll(".path" + d.source.name.replace(/\s/g, ''))
                    .transition()
                    .style("stroke-width", "1px")
                d3.selectAll(".path" + d.target.name.replace(/\s/g, ''))
                    .transition()
                    .style("stroke-width", "1px")
                d3.select(this).transition()
                    .style("stroke-opacity", 0.3)
            })

        link.transition()
            .attr("stroke-width", function (d) {
                return d.width;
            })

        // add in the nodes
        var node = sankeysvg.append("g")
            .selectAll(".node")
            .data(graph.nodes)
            .enter()
            .append("g")
            .attr("class", "node");

        // add the rectangles for the nodes
        node.append("rect")
            .attr("class", function (d) {
                return "nodeedges edge" + d.name.replace(/\s/g, '');
            })
            .attr("x", function (d) {
                return d.x0;
            })
            .attr("width", sankey.nodeWidth())
            .style("fill", function (d) {
                return d.color = color(d.name.replace(/ .*/, ""));
            })
            .style("stroke", function (d) {
                return d.color;
            })
            .on("mouseover", function (event, d) {
                console.log(d);
            })

        sankeysvg.selectAll("rect")
            .transition()
            .attr("y", function (d) {
                return d.y0;
            })
            .attr("height", function (d) {
                if (d.y1 - d.y0 > 0) {
                    return d.y1 - d.y0
                } else {
                    return 0;
                };
            });

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
                return d.x0 < sankeywidth / 2;
            })
            .attr("x", function (d) {
                return d.x1 + 5;
            })
            .attr("text-anchor", "start");

    });

};
