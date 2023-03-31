const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const bcrypt = require("bcrypt");
const User = require('../schemas/UserSchema');
const Activity = require('../schemas/ActivitySchema');
const Announcement = require('../schemas/AnnouncementSchema');
const Council = require('../schemas/CouncilSchema');
const Member = require('../schemas/MemberSchema');

router.get("/", async(req, res, next) => {
    var currentCouncil = "";    
    var payload = {
        pageTitle: "Alumni Council",
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user)       
    }    
    currentCouncil = await getCurrentCouncil();
    if(currentCouncil != 0) {
        payload.councilId = currentCouncil;
    }
    res.status(200).render("alumniCouncil", payload);
})


async function getCurrentCouncil() {
    var council = await Council.findOne({activeStatus : true})
    
    if (council != undefined) {
        return council._id;
    }
    else {
        return 0;
    } 
}
module.exports = router;