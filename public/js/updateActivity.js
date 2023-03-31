// Globals
var cropper;

$(document).ready(() => {
    $.get("/api/activity/" +activityId, results => {
       createActivityTitle(results, $(".activityTitleContainer"));
       console.log("taking images console");
       console.log(results.images);
       var data = results.images;
       populateActivitiesImages(data, $(".imageReviewContainer"));       
    })
})

$("#activityPhoto").change(function(){    
    if(this.files && this.files[0]) {
        var reader = new FileReader();
        reader.onload = (e) => {
            var image = document.getElementById("activityImagePreview");
            image.src = e.target.result;

            if(cropper !== undefined) {
                cropper.destroy();
            }

            cropper = new Cropper(image, {
                aspectRatio: 4 / 3,
                background: false
            });

        }
        reader.readAsDataURL(this.files[0]);
    }
})

$("#activityImageUploadButton").click(() => {
    var canvas = cropper.getCroppedCanvas();
    if(canvas == null) {
        alert("Could not upload image. Make sure it is an image file.");
        return;
    }
    canvas.toBlob((blob) => {
        var formData = new FormData();
        formData.append("croppedImage", blob);

        $.ajax({
            url: "/api/activity/updateImage/"+activityId,
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: () => location.reload()
        })
    })
})

function createActivityTitle(results,container) {
    container.html("");   
    var titleHtml = createActivityTitleContent(results);
    container.append(titleHtml); 
}

function createActivityTitleContent(activityData) {

    var activityTitle = activityData.activityTitle;
    var timestamp = timeDifference(new Date(), new Date(activityData.activityDate));
    var activityVenue = activityData.activityVenue
    var activityDescription = activityData.activityDescription;
    return `<div class='activityTitle'>  
                <span class='activityTitleName'>${activityTitle}</span>                            
                <div class='date'>${timestamp}</div>
                <div class='date'>${activityVenue}</div>
                <div class='activityDescription'>${activityDescription}</div>  
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

function populateActivitiesImages(data,container) {
    container.html(""); 
    var imagesReviewHtml = createImagesReviewHtmlContent(data);
    container.append(`<span>${imagesReviewHtml}</span>`);     
}

function createImagesReviewHtmlContent(data) {
    var string = "";
    data.forEach(result => {              
        string+=`<img src= ${result}>`;        
    });
    console.log(string);
    return string;

}

