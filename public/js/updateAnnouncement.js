// Globals
var cropper;
var globalActivityId;

$(document).ready(() => {
    console.log("begin");
    $.get("api/announcement", results => {
        console.log(results);
        outputAnnouncements(results, $(".announcementContainer"));         
    })
});

$("#announcementPhoto").change(function(){   
    console.log("Activity id inside change function = " + globalActivityId) ;
    if(this.files && this.files[0]) {
        var reader = new FileReader();
        reader.onload = (e) => {
            var image = document.getElementById("announcementImagePreview");
            image.src = e.target.result;

            if(cropper !== undefined) {
                cropper.destroy();
            }

            cropper = new Cropper(image, {
                aspectRatio: 3 / 4,
                background: false
            });

        }
        reader.readAsDataURL(this.files[0]);
    }
})

$("#announcementImageUploadButton").click(() => {
    console.log("inside announcement image upload button function with api call, id says:" + globalActivityId);
    
    var canvas = cropper.getCroppedCanvas();
    if(canvas == null) {
        alert("Could not upload image. Make sure it is an image file.");
        return;
    }
    canvas.toBlob((blob) => {
        var formData = new FormData();
        formData.append("croppedImage", blob);
        var activityId = globalActivityId;
        $.ajax({
            url: "/api/announcement/updateImage/"+activityId,
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: () => location.reload()
        })
    })
})

function outputAnnouncements(results, container) {
    container.html("");

    if(!Array.isArray(results)) {
        results = [results];
    }

    results.forEach(result => {
        var html = createAnnouncementsHtml(result)
        container.append(`<div class='announcementEvent' data-toggle='modal', data-target='#announcementModal' data-id='${result._id}'>${html}</div>`);
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
    var announcementImage = announcementData.imageURL;
    
    return `<div class='announcement' data-id='${announcementData._id}'>
                <div class='leftContainer'>
                    <img src=${announcementImage}>
                </div>
                <div class='middleContainer'>
                    <div class='headerContainer'>
                        ${displayName}
                    </div>
                    <div class='centerContainer'>                        
                        ${announcementVenue}
                    </div>
                    <div class='footerContainer'>                        
                        On ${announcementDate[2]} '${announcementDate[1]} ,${announcementDate[0]}
                    </div>
                </div>            
                <div class='rightContainer'>
                    <div style='width:100%;'>
                        <button class='handlerAddImageButton' value='${announcementData._id}' data-toggle='modal', data-target='#announcementImageUploadModal' onclick='updateGlobalId(this.value)'>Add pic</button>
                    <div>  
                    <div style='width:100%;'>
                        <button class='handlerDeleteAnnouncementButton' value='${announcementData._id}' onclick='deleteAnnouncement(this.value)'>Remove</button>
                    <div>                   
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

function updateGlobalId(id) {
    console.log("activity id in id passing function :" + id);
    globalActivityId = id;
}

function deleteAnnouncement(id) {
    console.log("Trying to remove" + id);
    $.ajax({
        url: "/api/announcement/delete/"+id,
        type: "POST",        
        success: () => location.reload()
    })
}