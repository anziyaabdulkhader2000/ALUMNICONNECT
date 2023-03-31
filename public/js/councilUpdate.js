var timer;
var selectedUsers = [];
var activeMembers = [];
var removedMembers = [];
var activationMessage = "";

$(document).ready(()=> {
    console.log("Creating council update page");
    $.get("/api/council/" + councilId, results => {                       
        outputCouncilName(results,$(".councilName"));                 
        outputCouncilDescription(results,$(".councilDescription"));                 
    }) 
    $.get("/api/member/populateCouncil/" + councilId, results => {                   
        results.forEach(member=> {
            selectedUsers.push(member);
            if(member.activeStatus == true) {
                activeMembers.push(member);
            }            
            else {
                removedMembers.push(member);
            }
        }) 
        outputCouncilMembers(activeMembers, $(".footerContainer"));         
    }) 
    $.get("/api/member/checkCouncilStatus/" + councilId, results => {                       
           console.log("Status check of council has been executed and the results are");
           console.log(results); 
           outputActivationMessage(results, $(".councilActivateMessage"));            
    }) 
})

//Handler to activate keydown event
$("#memberSearchTextbox").keydown((event) => { 
    clearTimeout(timer);
    var textbox = $(event.target);
    var value = textbox.val();    
    timer = setTimeout(() => {
        value = textbox.val().trim();
        if(value == "") {
            $(".queryResultsContainer").html("");
        }
        else {            
            searchUsers(value);
        }
    }, 1000)
})

//Handler to add/update member event
$(document).on("click", ".queryResult", (event) => {
    console.log("Click recorded on user element"); 
    var element = $(event.target);
    var textbox = $("#memberSearchTextbox");
    var memberId = getMemberIdFromElement(element);    
    console.log("Member ID is" + memberId);
    var tempMem;
    var flag = 0;
    var data = {
        tenureStart : new Date(),
        tenureId : councilId,        
        designation : "Associate Member"        
    }    
    data.user = getMemberIdFromElement(element);
    flag=0;
    removedMembers.forEach(rem=> {
        tempMem = rem.user;
        if(tempMem._id == memberId) {
            console.log("Idle member found");
            console.log("data passed is");
            console.log(data);
            $.post("/api/member/reactivateMember", data, returnedMember => {  
                    activeMembers.push(returnedMember);                   
            })
        }
        else {
            flag++;
        }
    })
    if(removedMembers.length == flag) {
        flag = 0;
        activeMembers.forEach(active=> {
            tempMem = active.user;
            if(tempMem._id == memberId) {
                console.log("Trying to resolve redundant adding");
            }
            else {
                flag++;
            }
        })
        if(activeMembers.length == flag) {
            console.log("trying to send to member api to create new member");
            console.log("data passed is");
            console.log(data);
            $.post("/api/member", data, returnedMember => {  
                    activeMembers.push(returnedMember);
            })
        }        
    } 
    $(".queryResultsContainer").html("");
    textbox.val("");
});

// Handler to activate council
$(document).on("click", "#activateCouncilConfirmButton", (event) => { 
    console.log("Activating council button clicked");
    
    $.ajax({
        url: "/api/council/activate/"+councilId,
        type: "PUT",
        success: () => location.reload()
    })
    
});

// Handler to reload document upon confirming update button on the modal
$(document).on("click", "#updateCouncilMembersButton", (event) => { 
    location.reload();
});

//Handler to impeach member
$(document).on("click", ".memberDeleteButtonContainer", (event) => {
    console.log("Click recorded on user element"); 
    var element = $(event.target);
    var memberId = getDeleteMemberIdFromElement(element);    
    console.log("Member ID is" + memberId);
    $.post("/api/member/impeach/"+memberId, returnedMember => {        
        console.log("Returned data is");
        console.log(returnedMember); 
        location.reload();         
    })
});

//Handler to set member as President
$(document).on("click", "#presButton", (event) => {    
    console.log("Click recorded on member's set as president button"); 
    var element = $(event.target);
    var memberId = getCouncilMemberIdFromElement(element);    
    console.log("Member ID is" + memberId);    
    $.post("/api/member/undesignatePresident/"+councilId, returnedMember => {        
        console.log("Returned data of undesignated President is");
        console.log(returnedMember);                  
    })
    $.post("/api/member/designatePresident/"+memberId, returnedMember => {        
        console.log("Returned data of designated President is ");
        console.log(returnedMember);                  
    })
    location.reload();
});

//Handler to set member as Secretary
$(document).on("click", "#secButton", (event) => {
    console.log("Click recorded on member's set as secretary button"); 
    var element = $(event.target);
    var memberId = getCouncilMemberIdFromElement(element);    
    console.log("Member ID is" + memberId);    
    $.post("/api/member/undesignateSecretary/"+councilId, returnedMember => {        
        console.log("Returned data of undesignated Secreatary is");
        console.log(returnedMember);                  
    })
    $.post("/api/member/designateSecretary/"+memberId, returnedMember => {        
        console.log("Returned data of designated Secretary is");
        console.log(returnedMember);                  
    })
    location.reload();
});

//Handler to set member as Treasurer
$(document).on("click", "#treasButton", (event) => {
    console.log("Click recorded on member's set as treasurer button"); 
    var element = $(event.target);
    var memberId = getCouncilMemberIdFromElement(element);    
    console.log("Member ID is" + memberId);  
    $.post("/api/member/undesignateTreasurer/"+councilId, returnedMember => {        
        console.log("Returned data of undesignated Treasurer is");
        console.log(returnedMember);                  
    })
    $.post("/api/member/designateTreasurer/"+memberId, returnedMember => {        
        console.log("Returned data of designated Treasurer is");
        console.log(returnedMember);                  
    })
    location.reload();  
});

// Council Information
function outputCouncilName(data, container) {
    container.html("");
    var containerHtml = createCouncilNameHtml(data);
    container.append(containerHtml);
}

function createCouncilNameHtml(data) {
    var tenureStart = data.tenureStart;
    var splitDate = tenureStart.split("-");
    var year = splitDate[0];
    return `Council of ${year}`;
}

function outputCouncilDescription(data, container) {
    container.html("");
    var containerHtml = createCouncilDescriptionHtml(data);
    container.append(containerHtml);
}

function createCouncilDescriptionHtml(data) {
    var councilMessage = data.councilMessage;
    return `${councilMessage}`;
}

// Output council members

function outputCouncilMembers(data, container) {    
    container.html("");
    var containerHtml = createMembersHtml(data);
    container.append(containerHtml);
}

function createMembersHtml(data) {
    var user;
    var designation = "";
    var name = "";
    var tag="";
    var profilePic = "";
    var returnString = "";
    var presidentStatus = "";
    var secretaryStatus = "";
    var treasurerStatus = "";
    data.forEach(element=> {
        presidentStatus = "";
        secretaryStatus = "";
        treasurerStatus = "";
        if(element.designation == "Associate Member") {
            designation = `<i class='fas fa-chess-pawn'> ${element.designation}</i>`;
        }
        else if(element.designation == "President") {
            designation = `<i class='fas fa-chess-king'> ${element.designation}</i>`;
            presidentStatus = "activeNow";
        }
        else if(element.designation == "Secretary") {
            designation = `<i class='fas fa-chess-queen'> ${element.designation}</i>`;
            secretaryStatus = "activeNow";
        }
        else if(element.designation == "Treasurer") {
            designation = `<i class='fas fa-chess-rook'> ${element.designation}</i>`;
            treasurerStatus = "activeNow";
        }
        else {
            designation = element.designation;
        }
        user = element.user;
        name = `${user.firstName} ${user.lastName} @${user.username}`;
        tag = user.faculty==true? "Faculty" : `Class of ${user.graduationBatch}`;
        profilePic = user.profilePic;

        returnString += `<div class='memberElement' data-id='${element._id}'>
                            <div class='elementHeaderContainer'>
                                <div class='memberImageContainer'>
                                    <img src='${profilePic}'>
                                </div>
                                <div class='memberDescriptionContainer'>
                                    <div class='text1'>
                                        ${name}
                                    </div>
                                    <div class='text2'>
                                        ${tag}
                                    </div>
                                    <div class='text3'>
                                        ${designation}
                                    </div>
                                </div>
                                <div class='memberDeleteButtonContainer' data-id='${element._id}'>
                                    <i class="fas fa-times"></i>
                                </div>
                            </div>
                            <div class='elementFooterContainer'>
                                <div class='footerButton'>
                                    <button id='presButton' class='${presidentStatus}'>
                                        <i class="fas fa-chess-king"></i>
                                        <span id='presTag'> Set as President</span>
                                    </button>                                    
                                </div>
                                <div class='footerButton'>
                                    <button id='secButton' class='${secretaryStatus}'>
                                        <i class="fas fa-chess-queen"></i>
                                        <span id='secTag'> Set as Secretary</span>
                                    </button>                                    
                                </div>
                                <div class='footerButton'>
                                    <button id='treasButton' class='${treasurerStatus}'>
                                        <i class="fas fa-chess-rook"></i>
                                        <span id='treasTag'> Set as Treasurer</span>
                                    </button>                                    
                                </div>                                
                            </div>
                         </div>`;
    })
                            
    return returnString;
}

//keydown action function
function searchUsers(searchTerm) {   
    console.log("Trying to populate queryResultsContainer with");
    console.log(activeMembers);
    $.get("/api/users", { search: searchTerm }, results => {
        outputSelectableUsers(results, $(".queryResultsContainer"));
    })
}

function outputSelectableUsers(data, container) {
    container.html("");
    var containerHtml = createUsersHtml(data);
    container.append(containerHtml);
}

function createUsersHtml(data) {
    var string = "";
    var imageUrl = "";
    var name = "";
    var tag = "";
    var userContainer = "";
    var tempUser;
    data.forEach(element=> {
        imageUrl = element.profilePic;
        name = `${element.firstName} ${element.lastName} @${element.username}`;
        tag = element.faculty? "Faculty" : `Class of ${element.graduationBatch}`;
        
        activeMembers.forEach(active=> {
            tempUser = active.user;
            
            if(tempUser._id == element._id) {
                userContainer = "selected";
            }
        })
        string+= `<div class='queryResult ${userContainer}' data-id='${element._id}'>
                    <div class='imageContainer'>
                        <img src=${imageUrl}>
                    </div>
                    <div class='textContainer'>
                        <div class='name'>
                            ${name}
                        </div>
                        <div class='tag'>
                            ${tag}
                        </div>
                    </div>
                  </div>`;
        userContainer = "";
    })
    return string;
}

//getting user id to add member handler function
function getMemberIdFromElement(element) {
    var isRoot = element.hasClass("queryResult");
    var rootElement = isRoot == true ? element : element.closest(".queryResult");
    var memberId = rootElement.data().id;

    if(memberId === undefined) return alert("User id undefined");

    return memberId;
}

//getting user id to impeach member handler function
function getDeleteMemberIdFromElement(element) {
    var isRoot = element.hasClass("memberDeleteButtonContainer");
    var rootElement = isRoot == true ? element : element.closest(".memberDeleteButtonContainer");
    var memberId = rootElement.data().id;

    if(memberId === undefined) return alert("User id undefined");

    return memberId;
}

//getting member to activate designate
function getCouncilMemberIdFromElement(element) {
    var isRoot = element.hasClass("memberElement");
    var rootElement = isRoot == true ? element : element.closest(".memberElement");
    var memberId = rootElement.data().id;

    if(memberId === undefined) return alert("User id undefined");

    return memberId;
}

//Function to create activationErrorMessage
function outputActivationMessage(data, container) {
    container.html("");
    var containerHtml = createActivationErrorMessage(data);
    container.append(containerHtml);
}

//Creating activationerrormessage HTML
function createActivationErrorMessage(data) {
    var activationMessage = "";
    if(data.presidentStatus==true && data.secretaryStatus==true && data.treasurerStatus==true) {
        activationMessage = `<div> You are about to activate this council</div>`;
        $("#activateCouncilConfirmButton").prop("disabled", false);
    }
    else {
        $("#activateCouncilConfirmButton").prop("disabled", true);
        if(data.presidentStatus == false) {
            activationMessage += `<p> President has not been designated for this council</p>`;
        }
        if(data.secretaryStatus == false) {
            activationMessage += `<p> Secretary has not been designated for this council</p>`;
        }
        if(data.treasurerStatus == false) {
            activationMessage += `<p> Treasurer has not been designated for this council</p>`;
        }
    }
    return activationMessage;
}