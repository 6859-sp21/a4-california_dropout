$(".selectors").change(function () {
    let partA = $('#partA').val(),
        partB = $('#partB').val(),
        year = "All";

    if (partA !== partB) {
        updatesankey(partA, partB, year);
        document.getElementById("warning").innerHTML = "";
    } else {
        document.getElementById("warning").innerHTML = "Please make sure that you are comparing different data";
    }

});
