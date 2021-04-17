function toPage(n) {
    document.getElementById("pageAll").style.marginLeft = (n - 1) * -100 + "vw";
    
    for (let i = 1; i < 4; i++) {
        if (i == n) {
            document.getElementById("button" + i).className = "pageButton active";
        } else {
            document.getElementById("button" + i).className = "pageButton";
        }
    }
}

$(".selectorsC").change(function () {
    updateS("Category");
});

$(".selectorsT").change(function () {
    updateS("Time");
});

function allyear() {
    let allyearvalue = $('#allyear').val();

    if (allyearvalue == "true") {
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

function updateS(type) { // type is for different trigger scenarios

    // when there's a categorical change, to make sure that line-graphs can grab colors, revert year-info back to "All"
    if (type == "Category") {
        $('#allyear').val("true");
        document.getElementById("allyear").innerHTML = "Showimg all years, Click again to select individual year";
        document.getElementById("yearRange").style.display = "none";
    };

    // get current comparison set and year value
    let partA = $('#partA').val(),
        partB = $('#partB').val(),
        year,
        allyearvalue = $('#allyear').val();

    // check if "All year" is on, if not grab current slider year
    if (allyearvalue == "false") {
        year = $('#yearRange').val();
        document.getElementById("selectedyear").innerHTML = "showing: " + year;
    } else {
        year = "All";
        document.getElementById("selectedyear").innerHTML = "";
    };

    if (partA !== partB) { // only update data when you are comparing two different factors

        updatesankey(partA, partB, year);
        subgraph("A", partA, type);
        subgraph("B", partB, type);

        // geo_subgraph("ethnic", "Los Angeles", type);
        // geo_subgraph("grade", "Los Angeles", type);
        // geo_subgraph("gender", "Los Angeles", type);

        eventTable(year);

        document.getElementById("warning").innerHTML = "";

    } else { // return error when you are comparing two of the same factors

        document.getElementById("warning").innerHTML = "Please make sure that you are comparing different data";
    }

    // console change for debugging purpose
    console.log("data: " + partA + "-" + partB + "(" + year + ")");
}

updateS("init");