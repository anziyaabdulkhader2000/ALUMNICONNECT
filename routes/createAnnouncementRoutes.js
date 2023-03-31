const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const bcrypt = require("bcrypt");
const User = require('../schemas/UserSchema');
const Handler = require('../schemas/HandlerSchema');
const Activity = require('../schemas/ActivitySchema');
const Announcement = require('../schemas/AnnouncementSchema');

router.get("/", (req, res, next) => {

    var payload = {
        pageTitle: "Create Announcement",
        handlerLoggedIn: req.session.handler,
        handlerLoggedInJs: JSON.stringify(req.session.handler),
        userLoggedIn: req.session.user       
    }    
    res.status(200).render("createAnnouncements", payload);
})

router.post("/", async (req, res, next) => {

    var announcementTitle = req.body.announcementTitle.trim();                
    var payload = req.body;           
    

    var announcement = await Announcement.findOne({announcementTitle : announcementTitle})
    .catch((error) => {
        console.log(error);            
        payload.errorMessage = "Something went wrong during search";
        res.status(200).render("createAnnouncements", payload);
    });

    if(announcement == null) {
        // No announcement redundancy found
        console.log("Announcement Redundancy Null");
        var data = req.body;
        data.imageURL = "/images/eventAnnouncement.png";
        console.log(data);
        // creating schema object and insertion
        Announcement.create(data)
        .then((newAnnouncement) => {
            console.log("then block says:" + newAnnouncement);
            payload.errorMessage = `${newAnnouncement.announcementTitle} event announcement has been successfully created`;
            return res.status(200).render("createAnnouncements",payload);
        })
    }
    else {
        // Announcement found
        payload.errorMessage = "Redundant announcement";
        console.log("Announcement redundancy affirmative")
        res.status(200).render("createAnnouncements", payload);
    }
})

module.exports = router;