$(document).ready(() => {
    console.log("begin creating council management page");
    
        outputCreateButton($(".createCouncilButtonContainer"));
        $.get("api/council", results => {
            console.log(results);
            outputCouncils(results, $(".councilsListContainer"));        
        })       
});

$("#createCouncilSubmitButton").click(() => {
    var tenureStart = $("#tenureStartId");    
    var councilMessage = $("#councilMessage");

    var data = {
        tenureStart: tenureStart.val(),        
        councilMessage: councilMessage.val()
    }

    $.post("/api/council", data, returnedData => {  
        console.log(returnedData);      
        location.reload();
    })
    console.log("out of api call block");
})

$(document).on("click", ".councilElement", (event) => {  //handler to navigate to council page
    var element = $(event.target);
    var councilId = getCouncilIdFromElement(element);

    if(councilId !== undefined && !element.is("button")) {
        window.location.href = '/councilUpdate/' + councilId;        
    }
});

function outputCreateButton(container) {
    container.html("");
    container.append(`<button class='createCouncilButton' data-toggle='modal', data-target='#councilCreateModal'>Create a new council</button>`);
}

function showMessage(data) {
    console.log("calls have returned with:");
    console.log(data);
}


function outputCouncils(data,container) {
    container.html("");
    
    var html=createListOfCouncils(data);
    container.append(html);

    if (data.length == 0) {
        container.append("<span class='noResults'>No councils formed yet.</span>")
    }
}

function createListOfCouncils(data) {
    var content="";
    var tempDateStart="";
    var startDate="";
    var activeStatus;
    var activeStatusClass = "";    
    console.log("comes to creation method");
    data.forEach(dataItem => {
        
        tempDateStart = dataItem.tenureStart.split("-");
        startDate = tempDateStart[0];
        console.log(startDate);
        activeStatus = dataItem.activeStatus==true? "Active Now" : "Idle now";
        activeStatusClass = dataItem.activeStatus==true? "activeCouncil" : "inactiveCouncil";
        content += `<div class='councilElement' data-id='${dataItem._id}'>
                        <div class='councilTagLine'>
                            <i class="fas fa-ribbon"> Council of ${startDate}</i>
                        </div>
                        <div class='councilState ${activeStatusClass}'>
                            <i class="fas fa-circle"> ${activeStatus}</i>
                        </div>                        
                    </div>`;
    })
    console.log("content rendered");
    console.log(content);
    return content;
}



function getCouncilIdFromElement(element) {
    var isRoot = element.hasClass("councilElement");
    var rootElement = isRoot == true ? element : element.closest(".councilElement");
    var councilId = rootElement.data().id;

    if(councilId === undefined) return alert("Post id undefined");

    return councilId;
}