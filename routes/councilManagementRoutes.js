const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const bcrypt = require("bcrypt");
const User = require('../schemas/UserSchema');
const Handler = require('../schemas/HandlerSchema');
const Activity = require('../schemas/ActivitySchema');
const Announcement = require('../schemas/AnnouncementSchema');
const Council = require('../schemas/CouncilSchema');
const Member = require('../schemas/MemberSchema');


router.get("/", (req, res, next) => {
    var payload = {
        pageTitle: "Council Management",
        handlerLoggedIn: req.session.handler,
        handlerLoggedInJs: JSON.stringify(req.session.handler),
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user)        
    }    
    res.status(200).render("councilManagement", payload);
})

module.exports = router;

