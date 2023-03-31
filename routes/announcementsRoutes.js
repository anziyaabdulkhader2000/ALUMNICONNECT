const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const bcrypt = require("bcrypt");
const User = require('../schemas/UserSchema');
const Activity = require('../schemas/ActivitySchema');
const Announcement = require('../schemas/AnnouncementSchema');

router.get("/", (req, res, next) => {    
    var payload = {
        pageTitle: "Upcoming Events",
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user)       
    }    
    res.status(200).render("announcementsPage", payload);
})

module.exports = router;