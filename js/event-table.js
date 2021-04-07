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
        d3.select('#event').selectAll('table').remove();
        console.log("REMOVE OLD TABLE");
    }
    var table = d3.select('#event').append('table')
                    .attr("width", widthbar)
                    .attr("height", heightbar)
	var thead = table.append('thead')
	var	tbody = table.append('tbody');
    var columns = ['events'];

	// append the header row
	thead.append('tr')
	  .selectAll('th')
	  .data(columns).enter()
	  .append('th')
	    .text(function (column) { return column; });


    d3.csv("sankeydata/a4-cali-dropout-events.csv").then((data)=>{
       // create a row for each object in the data
       data = data.filter((d)=> d.year == year)
        var rows = tbody.selectAll('tr')
        .data(data)
        .enter()
        .append('tr');

        // create a cell in each row for each column
        var cells = rows.selectAll('td')
        .data(function (row) {
            return columns.map(function (column) {
            return {column: column, value: row[column]};
            });
        })
        .enter()
        .append('td')
            .attr("font-size", "5px")
            .text(function (d) { return d.value; });

    });
    return table;
}

eventTable("2000");