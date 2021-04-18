function UpdateCountyInfo(county, num, load) {
    if(load == "update") {
        document.getElementById("sel-c").innerHTML = "<h1>" + county + "</h1><h3>" + num+ " dropout(s)</h3><p>Hover above each county to display its total drop-out rate, click to show statistics by gender, ethnicity and grade on the right.</p>";
    }
}