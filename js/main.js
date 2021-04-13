$(".selectors").change(updateS);

function allyear() {
    let allyearvalue = $('#allyear').val();

    if(allyearvalue == "true"){
        $('#allyear').val("false");
        document.getElementById("allyear").innerHTML = "Show All Year Instead";
        document.getElementById("yearRange").style.display = "inline-block";
    } else {
        $('#allyear').val("true");
        document.getElementById("allyear").innerHTML = "Showimg all years, Click again to select individual year";
        document.getElementById("yearRange").style.display = "none";
    }

    updateS();
}

function updateS() {
    let partA = $('#partA').val(),
        partB = $('#partB').val(),
        year,
        allyearvalue = $('#allyear').val();

        if(allyearvalue == "false"){
            year = $('#yearRange').val()
        } else {
            year = "All";
        };

        console.log("data: " + partA + "-" + partB + "(" + year + ")");

        document.getElementById("selectedyear").innerHTML = year; 

    if (partA !== partB) {
        updatesankey(partA, partB, year);
        eventTable(year);
        drawGeomap(year);
        document.getElementById("warning").innerHTML = "";
    } else {
        document.getElementById("warning").innerHTML = "Please make sure that you are comparing different data";
    }

}