const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const bcrypt = require("bcrypt");
const User = require('../schemas/UserSchema');
const Handler = require('../schemas/HandlerSchema');
const Activity = require('../schemas/ActivitySchema');

router.get("/", (req, res, next) => {

    var payload = {
        pageTitle: "Handler Console",
        handlerLoggedIn: req.session.handler,
        handlerLoggedInJs: JSON.stringify(req.session.handler),
        userLoggedIn: req.session.user       
    }    
    res.status(200).render("createActivity", payload);
})

router.post("/", async (req, res, next) => {

    var activityTitle = req.body.activityTitle.trim();                
    var payload = req.body;           
    
    var activity = await Activity.findOne({activityTitle : activityTitle})
    .catch((error) => {
        console.log(error);            
        payload.errorMessage = "Something went wrong during search";
        res.status(200).render("createActivity", payload);
    });

    if(activity == null) {
        // No activity redundancy found
        console.log("Activity Redundancy Null");
        var data = req.body;
        console.log(data);
        // creating schema object and insertion
        Activity.create(data)
        .then((newActivity) => {
            console.log("then block says:" + newActivity);
            payload.errorMessage = `${newActivity.activityTitle} activity has been successfully created`;
            return res.status(200).render("createActivity",payload);
        })
    }
    else {
        // Activity found
        payload.errorMessage = "Redundant activity";
        console.log("Activity redundancy affirmative")
        res.status(200).render("createActivity", payload);
    }
})

module.exports = router;