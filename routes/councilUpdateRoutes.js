const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const bcrypt = require("bcrypt");
const User = require('../schemas/UserSchema');
const Council = require('../schemas/CouncilSchema');
const Member = require('../schemas/MemberSchema');

router.get("/", (req, res, next) => {

    var payload = {
        pageTitle: "You have not selected a council yet!!!",
        handlerLoggedIn: req.session.handler,
        handlerLoggedInJs: JSON.stringify(req.session.handler),
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user) 
    }
    
    res.status(200).render("councilUpdate", payload);
})

router.get("/:id", (req, res, next) => {
    var payload = {
        pageTitle: "Handler Console",
        handlerLoggedIn: req.session.handler,
        handlerLoggedInJs: JSON.stringify(req.session.handler),
        userLoggedIn: req.session.user,
        councilId: req.params.id
    }
    
    res.status(200).render("councilUpdate", payload);
})

module.exports = router;