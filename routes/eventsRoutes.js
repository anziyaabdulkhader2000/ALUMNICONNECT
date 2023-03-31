const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const bcrypt = require("bcrypt");
const User = require('../schemas/UserSchema');
const Activity = require('../schemas/ActivitySchema');

router.get("/", (req, res, next) => {    
    var payload = {
        pageTitle: "Our Chronicles",
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user)        
    }    
    res.status(200).render("eventsPage", payload);
})

module.exports = router;