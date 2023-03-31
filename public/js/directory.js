$(document).ready(()=> {
    createButtons();    
    populateFaculty();    
})



function createButtons() {
    $.get("/api/users/getBatches", results => {        
        populateButtons(results, $(".indexContainer"));
    })
}

function populateButtons(data, container) {
    container.html("<i id='directoryLogo' class='fas fa-graduation-cap'></i>");
    console.log("in populatebuttons");
    console.log(data);
    var buttonsHtml = createButtonsHtml(data);
    container.append(buttonsHtml);
}

function createButtonsHtml(data) {    
    var string = "<button onclick='populateFaculty()'><i class='fas fa-users'></i>  Fleet of faculty</button>";    
    data.forEach(buttonData => {
        string+= `<button onclick='populateResults(${buttonData})'><i class='fas fa-users'></i>  Class of ${buttonData}</button>`
    })    
    return string;
}

function populateResults(data) {
    
    $.get("/api/users/getBatch/" + data, results => {
        outputDirectoryGroupUsers(results, $(".usersContainer"), data);        
    })
}

function populateFaculty() {
    $.get("/api/users/getFacultyList", results => {
        outputDirectoryGroupUsers(results, $(".usersContainer"), "faculty");        
    })
}

function outputDirectoryGroupUsers(results, container, key) {
    var userPhotoUrl = getUserPhotoUrl(results);
    console.log(userPhotoUrl);
    var bannerHtml;
    var number = results.length;    
    if(key == "faculty") {
        bannerHtml = `<div class='groupBanner'>
                        <div class='groupHeaderContainer'>
                            
                        </div>
                        <div class='groupFooterContainer'>
                            ${userPhotoUrl}  
                        </div>                          
                        <div class='detailsContainer'>
                            <div class='groupText'><i class="fas fa-gem"></i>  Fleet of Faculties</div>
                            <div class='groupNumber'>${number} members</div>
                        </div>                        
                      </div> `;
    }

    
    else {
        bannerHtml = `<div class='groupBanner'>
                        <div class='groupHeaderContainer'>
                            
                        </div>
                        <div class='groupFooterContainer'>
                            ${userPhotoUrl}  
                        </div>                          
                        <div class='detailsContainer'>
                            <div class='groupText'><i class="fas fa-gem"></i>  Class of ${key}</div>
                            <div class='groupNumber'>${number} members</div>
                        </div>                        
                    </div> `;
        
    }
    container.html(bannerHtml);    
    results.forEach(result => {
        var html = createUserHtml(result, true);
        container.append(`<div class='listOfUsers'>${html}</div>`);
    });

    if(results.length == 0) {
        container.append("<span class='noResults'>No results found</span>")
    }
}

function createUserHtml(userData, showFollowButton) {

    var name = userData.firstName + " " + userData.lastName;
    var isFollowing = userLoggedIn.following && userLoggedIn.following.includes(userData._id);
    var text = isFollowing ? "Following" : "Follow"
    var buttonClass = isFollowing ? "followButton following" : "followButton"

    var followButton = "";
    if (showFollowButton && userLoggedIn._id != userData._id) {
        followButton = `<div class='followButtonContainer'>
                            <button class='${buttonClass}' data-user='${userData._id}'>${text}</button>
                        </div>`;
    }

    return `<div class='user'>
                <div class='userImageContainer'>
                    <img src='${userData.profilePic}'>
                </div>
                <div class='userDetailsContainer'>
                    <div class='header'>
                        <a href='/profile/${userData.username}'>${name}</a>
                        <span class='username'>@${userData.username}</span>                        
                    </div>
                </div>
                ${followButton}
            </div>`;
}

function getUserPhotoUrl(data) {
   
    var string = "";
    var i = 0;
    data.forEach(dataElement => {
        console.log(dataElement.profilePic)
        if(i<7) {
            string += ` <div class='imgClassSmall'><img src= ${dataElement.profilePic}></div>`;
        }
        
        i++;        
    })    
    return string;
}
