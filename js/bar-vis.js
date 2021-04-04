const data = [
    { name: 'John', score: 80 },
    { name: 'Simon', score: 76 },
    { name: 'Samantha', score: 90 },
    { name: 'Patrick', score: 82 },
    { name: 'Mary', score: 90 },
    { name: 'Christina', score: 75 },
    { name: 'Michael', score: 86 },
  ];
  
  d3.csv("/a4-california_dropout/sankeydata/bar-test.csv").then((datatest)=>{

    const year = document.getElementById("yearRange").value;
    var data = datatest.filter(d => d.begin_year === year);

    var width = document.getElementById("bar").offsetWidth;
    var height = document.getElementById("bar").offsetHeight;
    var margin = { top: 50, bottom: 50, left: 50, right: 50 };
    
    const svg = d3.select('#bar')
        .append('svg')
        .attr('width', width - margin.left - margin.right)
        .attr('height', height - margin.top - margin.bottom)
        .attr("viewBox", [0, 0, width, height]);
    
    const x = d3.scaleBand()
        .domain(d3.range(data.length))
        .range([margin.left, width - margin.right])
        .padding(0.1)
    
    const y = d3.scaleLinear()
        .domain([0, d3.max(datatest, d => d.dropout)])
        .range([height - margin.bottom, margin.top])
    
    const colorScale = d3.scaleOrdinal()
        .domain(data.map(d => d.grade))
        .range(d3.schemeTableau10);

    svg
        .append("g")
        .selectAll("rect")
        .data(data)
        .join("rect")
        .attr("x", (d, i) => x(i))
        .attr("y", d => y(d.dropout))
        .attr('title', (d) => d.dropout)
        .attr("class", "rect")
        .attr("height", d => y(0) - y(d.dropout))
        .attr("width", x.bandwidth())
        .attr("fill",  d => colorScale(d.grade));
    
    function yAxis(g) {
        g.attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(y).ticks(null, data.format))
        .attr("font-size", '20px')
    }
    
    function xAxis(g) {
        g.attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickFormat(i => data[i].grade))
        .attr("font-size", '20px')
    }
    
    svg.append("g").call(xAxis);
    svg.append("g").call(yAxis);
    svg.node();

  document.getElementById("bar").appendChild(svg.node());
});