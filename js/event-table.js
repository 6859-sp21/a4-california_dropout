var widthbar = document.getElementById("event").offsetWidth,
    heightbar = document.getElementById("event").offsetHeight,
    margin = 10;


// var data = [
//     { "date" : '2013-01-01', "close" : 45 },
//     { "date" : '2013-02-01', "close" : 50 },
//     { "date" : '2013-03-01', "close" : 55 },
//     { "date" : '2013-04-01', "close" : 50 },
//     { "date" : '2013-05-01', "close" : 45 },
//     { "date" : '2013-06-01', "close" : 50 },
//     { "date" : '2013-07-01', "close" : 50 },
//     { "date" : '2013-08-01', "close" : 52 }
//   ]


function eventTable(year) {
    
    if (d3.select('#event').size() > 0) {
        d3.select('#event').selectAll('ul').remove();
        console.log("REMOVE OLD TABLE");
    }
    var head = d3.select("#event").append("p").text("Key events");
    var body = d3.select('#event').append('ul')
                    .attr("width", widthbar)
                    .attr("height", heightbar);

    d3.csv("./data/a4-cali-dropout-events.csv").then((data)=>{
       // create a row for each object in the data
       data = data.filter((d)=> d.year == year);

       // create a cell in each row for each column
        body.selectAll("li")
            .data(data)
            .join("li")
                .text(d => d.events);
    })
    return body;
}

eventTable("2001");