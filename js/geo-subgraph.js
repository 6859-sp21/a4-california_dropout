var barwidth = document.getElementById("bar-test").offsetWidth,
    barheight = document.getElementById("bar-test").offsetHeight / 3, // set svg width and height
    barmargin = 40,
    barmax = 60, // hard coded maximum number of paths (60 counties)
    subyearScale = d3.scaleLinear()
    .domain([1991, 2016])
    .range([0, barwidth - barmargin * 1.5]),
    initialpath = [];

var insertLinebreaks = function (t, d, width) {
    var el = d3.select(t);
    var p = d3.select(t.parentNode);
    p.append("foreignObject")
        .attr('x', -width/2)
        .attr("width", width)
        .attr("height", 200)
        .append("xhtml:p")
        .attr('style','word-wrap: break-word; text-align:center;')
        .html(d);    

    el.remove();

};

for (i = 1991; i < 2017; i++) { // only for transition purpose
    initialpath.push([subyearScale(i), barheight - barmargin]);
}

// preprocessed columns for faster data loading
var columes = {
    gender: ["Female", "Male"],
    ethnic: ["NativeAmericanorIndian", "Asian", "Pacific", "Filipino", "Hispanic", "AfricanAmerican", "White", "MultipleRace", "NoRace"],
    grade: ["Grade7", "Grade8", "Grade9", "Grade10", "Grade11", "Grade12"],
    county: ["Alameda", "Alpine", "Amador", "Butte", "Calaveras", "Colusa", "Contra Costa", "Del Norte", "El Dorado", "Fresno", "Glenn", "Humboldt", "Imperial", "Inyo", "Kern", "Kings", "Lake", "Lassen", "Los Angeles", "Madera", "Marin", "Mariposa", "Mendocino", "Merced", "Modoc", "Mono", "Monterey", "Napa", "Nevada", "Orange", "Placer", "Plumas", "Riverside", "Sacramento", "San Benito", "San Bernardino", "San Diego", "San Francisco", "San Joaquin", "San Luis Obispo", "San Mateo", "Santa Barbara", "Santa Clara", "Santa Cruz", "Shasta", "Sierra", "Siskiyou", "Solano", "Sonoma", "Stanislaus", "Sutter", "Tehama", "Trinity", "Tulare", "Tuolumne", "Ventura", "Yolo", "Yuba", "NA"]
};

var shortenedRace = ["NAI", "A", "P", "F", "H", "AA", "W", "M", "N"];

function geo_subgraph(type, county, load) {
    d3.json("./sankeydata/county-" + type + ".json").then(function (data) {
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
            .range(["#EF6633", "#DEBA77", "#7799BB", "#5B72B3", "#74AA5E", "#542231", "#F6D6D6", "#2b2b2b", "#bcbcbc"])
        } else if(type=="gender"){
            colorScheme = d3.scaleOrdinal()
            .domain(["Female", "Male"])
            .range(["#F7A952", "#A8DBED"]);
        } else {
            colorScheme = d3.scaleOrdinal()
            .domain(["Grade7", "Grade8", "Grade9", "Grade10", "Grade11", "Grade12"])
            .range(["#f67e7d", "#ff9796", "#fca5a4", "#ffb8b8", "#fac5c5", "#fcd9d9"]);
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

            d3.select("#bar" + type)
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
        if(type=="ethnic"){
            
        d3.select(".xScale" + type)
            .transition()
            .call(d3.axisBottom(xScale)
            .tickFormat(function(d,i){return shortenedRace[i];}))

        } else {
            d3.select(".xScale" + type)
            .transition()
            .call(d3.axisBottom(xScale))
            // .tickFormat(function(d,i){return shortenedRace[i];})
        }

        d3.select(".yScale" + type)
            .transition()
            .call(d3.axisLeft(yScale).tickFormat(d3.format("d")));

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

// function updateEthnicticks(){
//     // if(type=="ethnic"){
//     //     let shortenedRace = ["NAI", "A", "P", "F", "H", "AA", "W", "M", "N"];
//     //     let currentSVG = d3.selectAll(".xScale" + type);
//     //     let ticks = currentSVG.selectAll(".tick text");

//     //     ticks
//     //     .attr("class", function(d,i){
//     //         return ("ethnictick")
//     //     })

//     //     console.log(document.getElementsByClassName("ethnictick")[0].innerHTML);

        


//         let t = document.getElementsByClassName("xScaleethnic")[0].getElementsByTagName('g');
//         for(let i = 0; i < t.length; i++){
//             t[i].getElementsByTagName('text')[0].innerHTML = "aaa";
//             console.log(t[i]);
//             // t[i].getElementsByTagName('text')[0].classList = "sho";
//             // t[i].innerHtml = shortenedRace[i-1];
//         }
    
// }
// geo_subgraph("ethnic", "Los Angeles", "init");
// geo_subgraph("grade", "Los Angeles", "init");
// geo_subgraph("gender", "Los Angeles", "init");
// updateEthnicticks();
