$(document).ready(() => {
    console.log("begin");
    $.get("api/activity", results => {
        console.log(results);
        outputActivities(results, $(".activityContainer"));        
    })
});



function outputActivities(results, container) {
    container.html("");

    if(!Array.isArray(results)) {
        results = [results];
    }

    results.forEach(result => {
        var html = createActivitiesHtml(result)
        container.append(`<a href='/updateActivity/${result._id}'>${html}</a>`);
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
    var timestamp = timeDifference(new Date(), new Date(activityData.createdAt));

    return `<div class='activity' data-id='${activityData._id}'>                
                <div class='mainContentContainer'>                   
                    <div class='postContentContainer'>                        
                        <div class='header'>
                            <span class='displayName'>${displayName}</span>                            
                            <span class='date'>${timestamp}</span>                            
                        </div>
                        
                        <div class='postBody'>
                            <span>${activityData.activityDescription}</span>
                        </div>                        
                    </div>
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

