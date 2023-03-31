const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const bcrypt = require("bcrypt");
const User = require('../schemas/UserSchema');
const Handler = require('../schemas/HandlerSchema');

router.get("/", (req, res, next) => {
    console.log("user is identified as");
    console.log(req.session.user);
    console.log("finally");
    var payload = {
        pageTitle: "Handler Console",
        handlerLoggedIn: req.session.handler,
        handlerLoggedInJs: JSON.stringify(req.session.handler),
        userLoggedIn: req.session.user        
    }    
    res.status(200).render("handlerPanel", payload);
})

module.exports = router;