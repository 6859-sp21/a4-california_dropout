var width = window.innerWidth;
    height = window.innerHeight / 2;

// format variables
var formatNumber = d3.format(",.0f"), // zero decimal places
    format = function (d) {
        return formatNumber(d);
    },
    color = d3.scaleOrdinal(d3.schemePastel1);

// append the svg object to the body of the page
var svg = d3.select("#sankey").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")

// Set the sankey diagram properties
var sankey = d3.sankey()
    .nodeWidth(36)
    .nodePadding(40)
    .size([width, height]);

var path = sankey.links();

let first = "gender",
    second = "grade";

// load the data

d3.json("../sankeydata/" + first + "-" + second + ".json").then(function (data) {

    let parentlist = Object.keys(data);
    var sankeyjson = {
        "nodes": [],
        "links": []
    };

    parentlist.forEach(function (parent, i) {

        // push all the parent nodes to "nodes"

        let parentnodenumber = i;
        sankeyjson.nodes.push({
            "node": i,
            "name": parent
        })
    });

    parentlist.forEach(function (parent, i) {

        let parentnodenumber = i;
        let childlist = Object.keys(data[parent]);
        childlist.forEach(function (child) {

            let childfilter = sankeyjson.nodes.filter(function (d) {
                return d.name == child;
            });

            // console.log(childfilter);

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

            }

            // push all the correlations to "links"
            
            sankeyjson.links.push({
                "source": parentnodenumber,
                "target": childnodenumber,
                "value": +data[parent][child]
            })

        })
    })

        graph = sankey(sankeyjson);
    
        // add in the links
        var link = svg.append("g")
        .selectAll(".link")
            .data(graph.links)
            .enter().append("path")
            .attr("class", "link")
            .attr("d", d3.sankeyLinkHorizontal())
            .attr("stroke-width", function (d) {
                return d.width;
            });
    
        // add the link titles
        link.append("title")
            .text(function (d) {
                return d.source.name + " → " +
                    d.target.name + "\n" + format(d.value);
            });
    
        // add in the nodes
        var node = svg.append("g").selectAll(".node")
            .data(graph.nodes)
            .enter().append("g")
            .attr("class", "node");
    
        // add the rectangles for the nodes
        node.append("rect")
            .attr("x", function (d) {
                return d.x0;
            })
            .attr("y", function (d) {
                return d.y0;
            })
            .attr("height", function (d) {
                return d.y1 - d.y0;
            })
            .attr("width", sankey.nodeWidth())
            .style("fill", function (d) {
                return d.color = color(d.name.replace(/ .*/, ""));
            })
            .style("stroke", function (d) {
                return d3.rgb(d.color).darker(2);
            })
            .append("title")
            .text(function (d) {
                return d.name + "\n" + format(d.value);
            });
    
        // add in the title for the nodes
        node.append("text")
            .attr("x", function (d) {
                return d.x0 - 6;
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
                return d.x1 + 6;
            })
            .attr("text-anchor", "start");

    console.log(sankeyjson);
});