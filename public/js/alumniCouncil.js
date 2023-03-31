//GLOBALS
var associateCouncil = [];
var executiveCouncil = [];

$(document).ready(()=> {    
    console.log("Current Alumni Council id is " + councilId + ". Lets begin");
    $.get("/api/council/"+councilId, results=> {             
        populateCouncilDescription(results, $(".alumni"));
    })
    $.get("/api/member/populateCouncil/"+councilId, results=> {
        results.forEach(member=> {
            if(member.designation == "Associate Member") {
                associateCouncil.push(member);
            }
            else {
                executiveCouncil.push(member);
            }
        })
        populateExecutiveCouncil(executiveCouncil, $(".executiveCouncilContent"));
        populateAssociateCouncil(associateCouncil, $(".associateCouncilContent"));
    })
})

//Alumni Name Construction
function populateCouncilName(data, container) {
    container.html("");
    var tenureStart = data.tenureStart;
    var splitDate = tenureStart.split("-");
    var year = splitDate[0];
    var containerHtml = `<div class='councilNameContainer'>
                            Council of ${year}
                         </div>`;
    container.append(containerHtml);
}

//Alumni Description Construction
function populateCouncilDescription(data, container) {
    container.html("");
    var alumniMessage = data.councilMessage;
    var containerHtml = `<blockquote>
                            <p>${alumniMessage}</p>
                        </blockquote>`;
    container.append(containerHtml);
}

//Executive Council Members Construction
function populateExecutiveCouncil(data, container) {
    container.html("");
    var containerHtml = createExecutiveMembersHtml(data);
    container.append(containerHtml); 
}

//Executive Council Members HTML creation
function createExecutiveMembersHtml(data) {
    var president,secretary,treasurer;
    var profilePic = "";
    var name = "";
    var username = "";
    var email = "";
    var tag = "";
    var designation = "";
    var returnString = "";
    data.forEach(element=> {
        if(element.designation == "President") {
            president = element;
        }
        else if(element.designation == "Secretary") {
            secretary = element;
        }
        else {
            treasurer = element;
        }
    })
    var members = [president, secretary, treasurer];
    console.log("final list is");
    console.log(members);
    members.forEach(element=> {        
        tempMemb = element.user;
        profilePic = tempMemb.profilePic;
        name = `${tempMemb.firstName} ${tempMemb.lastName}`;
        username = tempMemb.username;
        email = tempMemb.email;
        tag = tempMemb.faculty==true? "Faculty" : `Class of ${tempMemb.graduationBatch}`;
        designation = element.designation;
        returnString += `<div class='execMem'>
                            <div class='execMemHeader'>
                                ${designation}
                            </div>
                            <div class='execMemImage'>
                                <img src=${profilePic}>
                            </div>                                
                            <div class='name'>
                                ${name}
                            </div>
                            <div class='tag'>
                                ${tag}
                            </div>
                            <div class='email'>
                                ${email}
                            </div>
                            <div class='link'>
                                <a href='/profile/${username}'>Get Connected </a>
                            </div>
                        </div>`;               
    })
    return returnString;
}

//Associate Council Members Construction
function populateAssociateCouncil(data, container) {
    container.html("");
    var containerHtml = createAssociateMembersHtml(data);
    container.append(containerHtml); 
}

//Associate Council Members HTML creation
function createAssociateMembersHtml(data) {
    var tempMemb;
    var profilePic = "";
    var name = "";
    var username = "";    
    var tag = "";    
    var returnString = "";
    
    data.forEach(element=> {
        tempMemb = element.user;
        profilePic = tempMemb.profilePic;
        name = `${tempMemb.firstName} ${tempMemb.lastName}`;
        username = tempMemb.username;
        tag = tempMemb.faculty==true? "Faculty" : `Class of ${tempMemb.graduationBatch}`;
        returnString += `<div class='assocMem'>
                            <div class='assocMemHeader'>
                                ${tag}
                            </div>
                            <div class='assocMemImage'>
                                <img src=${profilePic}>
                            </div>
                            <div class='assocMemName'>
                                ${name}
                            </div>
                            <div class='assocMemLink'>
                                <a href='/profile/${username}'>Connect</a>
                            </div>
                         </div>`;
    })
    return returnString;
}