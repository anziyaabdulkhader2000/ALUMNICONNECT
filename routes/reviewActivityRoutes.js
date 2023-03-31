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
    res.status(200).render("reviewActivity", payload);
})


module.exports = router;