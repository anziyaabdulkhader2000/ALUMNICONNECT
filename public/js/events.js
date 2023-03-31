$(document).ready(() => {
    console.log("begin");
    $.get("api/activity", results => {
        console.log(results);
        outputActivities(results, $(".eventsContainer"));        
    })
});

$("#eventElementModal").on("show.bs.modal", (event) => {
    var button = $(event.relatedTarget);
    var activityId = getActivityIdFromElement(button);    

    $.get("/api/activity/" + activityId, results => {
        outputSingleActivity(results, $("#activityElementContainer"));
        displaySlides(results.images, $("#slider"));
    })
    console.log(activityId);
})

function outputActivities(results, container) {
    container.html("");

    if(!Array.isArray(results)) {
        results = [results];
    }

    results.forEach(result => {
        var html = createActivitiesHtml(result)
        container.append(`<button class='eventElement' data-toggle='modal', data-target='#eventElementModal' data-id='${result._id}'>${html}</button>`);
    });

    if (results.length == 0) {
        container.append("<span class='noResults'>Nothing to show.</span>")
    }
}


function createActivitiesHtml(activityData) {

    if(activityData == null) return alert("Activity object is null");
        
    if(activityData == null) {
        return;
    }
    
    var displayName = activityData.activityTitle; 
    eventdescription = activityData.activityDescription;   
    var eventDate = timeDifference(new Date(), new Date(activityData.activityDate));
    var eventVenue = activityData.activityVenue;
    var numberOfImages = activityData.images.length;
    var dateSanitized = getSanitizedDate(activityData.activityDate);
    var calendarHtml = createCalendarHtml(dateSanitized);
    var numberOfPeople = activityData.activityAttendance;
    

    return `<div class='event' data-id='${activityData._id}'>                
                <div class='leftContainer'>
                    ${calendarHtml}
                </div>
                <div class='middleContainer'>
                    <div class='headerContainer'>
                        ${displayName}
                    </div>
                    <div class='footerContainer'>
                        <i class="far fa-clock"> ${eventDate}</i>
                    </div>
                </div>
                <div class='rightContainer'>
                    <div class='item1'>
                        <i class="fas fa-camera-retro"> ${numberOfImages} photos in album</i>                            
                    </div>
                    <div class='item2'>
                        <i class="fas fa-landmark"> ${eventVenue}</i>
                    </div>
                    <div class='item3'>
                        <i class="fas fa-user-graduate"> ${numberOfPeople} attended</i>
                    </div>
                </div>                
            </div>`;
}



function getSanitizedDate(data) {
    var tempArrayInitial = data.split("-");    
    var newFormatDate = [];
    var month = "";
    newFormatDate.push(tempArrayInitial[0]); //year pushed
    switch(tempArrayInitial[1]) {
        case '01':
            month = "January";
            break;
        case '02':
            month = "February";
            break;
        case '03':
            month = "March";
            break;
        case '04':
            month = "April";
            break;
        case '05':
            month = "May";
            break;
        case '06':
            month = "June";
            break;
        case '07':
            month = "July";
            break;
        case '08':
            month = "August";
            break;
        case '09':
            month = "September";
            break;
        case '10':
            month = "October";
            break;
        case '11':
            month = "November";
            break;
        case '12':
            month = "December";
            break;
        default:
            month = "Unspecified month";
            break;
    }
    newFormatDate.push(month); //month pushed

    var tempArrayFinal = tempArrayInitial[2].split("T");    
    newFormatDate.push(tempArrayFinal[0]); //date pushed
    return newFormatDate;
}

function createCalendarHtml(data) {
    return `<div class='calendarIcon'>
                <div class='month'>
                    <div class='binder'>
                        <div class='binderLeft'>
                            <i class="fas fa-circle"></i>
                        </div>
                        <div class='binderRight'>
                            <i class="fas fa-circle"></i>
                        </div>
                    </div>
                    <div class='monthContent'>
                        ${data[1]}
                    </div>    
                                               
                </div>
                <div class='date'>
                    ${data[2]}    
                </div>
                <div class='year'>
                    ${data[0]}
                </div> 
            </div>`;
}

function timeDifference(current, previous) {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
        if(elapsed/1000 < 30) return "Just now";
        
        return Math.round(elapsed/1000) + ' seconds ago';   
    }

    else if (elapsed < msPerHour) {
         return Math.round(elapsed/msPerMinute) + ' minutes ago';   
    }

    else if (elapsed < msPerDay ) {
         return Math.round(elapsed/msPerHour ) + ' hours ago';   
    }

    else if (elapsed < msPerMonth) {
        return Math.round(elapsed/msPerDay) + ' days ago';   
    }

    else if (elapsed < msPerYear) {
        return Math.round(elapsed/msPerMonth) + ' months ago';   
    }

    else {
        return Math.round(elapsed/msPerYear ) + ' years ago';   
    }
}

function getActivityIdFromElement(element) {
    var isRoot = element.hasClass("eventElement");
    var rootElement = isRoot == true ? element : element.closest(".eventElement");
    var activityId = rootElement.data().id;

    if(activityId === undefined) return alert("Post id undefined");

    return activityId;
}

function outputSingleActivity(data,container) {
    console.log("in the custom function");
    console.log(data);
    container.html("");
    var html = createActivityReportHtml(data);
    container.append(html);
}

function createActivityReportHtml(activityData) {
    console.log("in the alternate fn");
    console.log(activityData);
    if(activityData == null) return alert("Activity object is null");
        
    if(activityData == null) {
        return;
    }

    var displayName = activityData.activityTitle;
    var timestamp = timeDifference(new Date(), new Date(activityData.createdAt));
    var eventDate = timeDifference(new Date(), new Date(activityData.activityDate));
    var eventVenue = activityData.activityVenue;
    var activityDescription = activityData.activityDescription;

    return `<div class='activity' data-id='${activityData._id}'>                
                <div class='mainContentContainer'>                   
                    <div class='postContentContainer'>                        
                        <div class='header'>
                            <div class='displayName'>${displayName} @${eventVenue}</div>                       
                                                       
                        </div>       
                        <div class='postBody'>
                            <div class='eventDate'>conducted ${eventDate}</div>
                            <div>${activityDescription}</div>
                        </div>            
                    </div>
                </div>
            </div>`;
}


function displaySlides(data,container) {
    container.html(""); 
    var imagesHtml = createImagesHtmlContent(data);
    container.append(imagesHtml);     
}

function createImagesHtmlContent(data) {
    var string = "";    
    data.forEach(result => {              
        string+=` <div class='carousel-item'><img src= ${result}></div>`;  
                
    });    
    var finalString = createCarousel(string);
    return finalString;
}

function createCarousel(string) {
    
    return `<div id='carouselExampleControls' class='carousel slide ' data-ride='carousel'>                
                <div class='carousel-inner'>
                    <div class='carousel-item active'>
                        <img class='d-block w-100' src='/uploads/activityMedia/soutpost.jpg' alt='First slide'>
                    </div>
                    ${string}                
                </div>
                <a class='carousel-control-prev' href='#carouselExampleControls' role='button' data-slide='prev'>
                    <div class='imageNavButtonContainer'><i class="fas fa-angle-left"></i></div>
                </a>
                <a class='carousel-control-next' href='#carouselExampleControls' role='button' data-slide='next'>
                    <div class='imageNavButtonContainer'><i class="fas fa-angle-right"></i></div>
                </a>
                
            </div>`;
}
