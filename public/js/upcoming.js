$(document).ready(() => {
    console.log("begin");
    $.get("api/announcement", results => {
        console.log(results);
        outputAnnouncements(results, $(".announcementContainer"));        
    })
});

$("#announcementModal").on("show.bs.modal", (event) => {
    var button = $(event.relatedTarget);
    var activityId = getActivityIdFromElement(button);    
    console.log(activityId);
    $.get("/api/announcement/" + activityId, results => {
        console.log(results);
        outputSingleAnnouncementHeader(results,$("#announcementModalLabel"));
        outputSingleAnnouncementDescription(results, $(".announcementModalContentContainer"));
        outputSingleAnnouncementImage(results.imageURL, $(".announcementModalImageContainer"));
    })
    console.log(activityId);
})

function outputAnnouncements(results, container) {
    container.html("");

    if(!Array.isArray(results)) {
        results = [results];
    }

    results.forEach(result => {
        var html = createAnnouncementsHtml(result)
        container.append(`<button class='announcementEvent' data-toggle='modal', data-target='#announcementModal' data-id='${result._id}'>${html}</button>`);
    });

    if (results.length == 0) {
        container.append("<span class='noResults'>Nothing to show.</span>")
    }
}


function createAnnouncementsHtml(announcementData) {
    console.log("entered createannouncementshtml function");
    if(announcementData == null) return alert("Activity object is null");
        
    if(announcementData == null) {
        return;
    }

    
    var displayName = announcementData.announcementTitle;    
    var announcementDate = getDateArray(announcementData.announcementDate);    
    var announcementVenue = announcementData.announcementVenue;
    var announcementDescription = announcementData.announcementDescription;
    var announcementImage = announcementData.imageURL;
    
    return `<div class='announcement' data-id='${announcementData._id}'>
                <div class='leftContainer'>
                    <img src=${announcementImage}>
                </div>
                <div class='middleContainer'>
                    <div class='headerContainer'>
                        ${displayName}
                    </div>
                    <div class='footerContainer'>
                        <i class="fas fa-landmark"> ${announcementVenue}</i>
                    </div>
                </div>            
                <div class='rightContainer'>
                    <div class='calendarIcon'>
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
                                ${announcementDate[1]}
                            </div>                                
                        </div>
                        <div class='date'>
                            ${announcementDate[2]}    
                        </div>
                        <div class='year'>
                            ${announcementDate[0]}
                        </div>
                    </div>                    
                </div>    
            </div>`;
}

function getDateArray(data) {
    
    var dateArray = [];
    var temp = data.split("-");
    var month = "";
    switch(temp[1]) {
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
    var newTemp = temp[2].split("T");
    dateArray.push(temp[0]);
    dateArray.push(month);
    dateArray.push(newTemp[0]);
    return dateArray;
}

function timeDiff(current, previous) {
    console.log("current :" + current);
    console.log("previous :" + previous);
    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < 0) {
        return 'We missed you';
    }

    if (elapsed < msPerMinute) {
        if(elapsed/1000 < 30) return "Happening Now";
        
        return Math.round(elapsed/1000) + ' seconds from now';   
    }

    else if (elapsed < msPerHour) {
         return Math.round(elapsed/msPerMinute) + ' minutes from now';   
    }

    else if (elapsed < msPerDay ) {
         return Math.round(elapsed/msPerHour ) + ' hours from now';   
    }

    else if (elapsed < msPerMonth) {
        return Math.round(elapsed/msPerDay) + ' days from now';   
    }

    else if (elapsed < msPerYear) {
        return Math.round(elapsed/msPerMonth) + ' months from now';   
    }

    else {
        return Math.round(elapsed/msPerYear ) + ' years from now';   
    }
}

function getActivityIdFromElement(element) {
    console.log("trying to get activityID");
    var isRoot = element.hasClass("announcementEvent");
    var rootElement = isRoot == true ? element : element.closest(".announcementEvent");
    var activityId = rootElement.data().id;

    if(activityId === undefined) return alert("Post id undefined");

    return activityId;
}

function outputSingleAnnouncementDescription(data,container) {
    console.log("in the custom function");
    console.log(data);
    container.html("");
    var html = createAnnouncementContentHtml(data);
    container.append(html);
}

function createAnnouncementContentHtml(activityData) {
    console.log("in the alternate fn");
    console.log(activityData);
    if(activityData == null) return alert("Activity object is null");
        
    if(activityData == null) {
        return;
    }
    
    var eventDescription = activityData.announcementDescription;
    var eventDate = getTimeOfEvent(activityData.announcementDate);     
    var eventVenue = activityData.announcementVenue;
    var eventLink = activityData.announcementLink? `<a href=${activityData.announcementLink}>join now</a>` : "";

    return `<div class='announcementContent'>  
                <div class='buttonsContainer'>
                    <div class='item1'>
                        <i class="fas fa-landmark"> ${eventVenue}</i>
                    </div>
                    <div class='item2'>
                        <i class="fas fa-clock"> ${eventDate[0]} : ${eventDate[1]}</i>
                    </div>
                    <div class='item3'>
                        ${eventLink}
                    </div>
                </div>
                <div class='contentContainer'>                 
                    ${eventDescription} 
                </div>
            </div>`;
}


function outputSingleAnnouncementImage(data,container) {
    container.html(""); 
    var imagesHtml = `<img src=${data}>`;
    container.append(imagesHtml);     
}

function outputSingleAnnouncementHeader(data,container) {
    console.log("inside header content rendering method");
    console.log(data);
    container.html("");
    var html = createAnnouncementHeaderContentHtml(data);
    container.append(html);
}

function createAnnouncementHeaderContentHtml(data) {
    var eventDate = getTimeOfEvent(data.announcementDate);    
    var eventTitle = data.announcementTitle;
    var eventVenue = data.announcementVenue;
    var eventLink = data.announcementLink? `<a href=${eventLink}>join now</a>` : "";
    var testArray = [eventDate,eventTitle,eventVenue,eventLink];
    console.log("rendering testArray?");
    console.log(testArray);
    return `<div class='announcementModalHeader'>
                ${eventTitle}
            </div>`;
}

function getTimeOfEvent(data) {
    console.log("time of the event method says:")
    console.log(data);
    var tempDateArray = data.split("-");
    console.log("tempDateArray:");
    console.log(tempDateArray);
    var tempTimeArrayInitial = tempDateArray[2].split("T");
    console.log("tempTimeArrayInitial says");
    console.log(tempTimeArrayInitial);
    var tempTimeArrayFinal = tempTimeArrayInitial[1].split(".");
    console.log("tempTimeArrayFinal says");
    console.log(tempTimeArrayFinal);
    var timeArray = tempTimeArrayFinal[0].split(":");
    console.log("TimeArray says");
    console.log(timeArray);
    return timeArray;
}