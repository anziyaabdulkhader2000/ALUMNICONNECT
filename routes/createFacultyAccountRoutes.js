const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const bcrypt = require("bcrypt");
const User = require('../schemas/UserSchema');
const Handler = require('../schemas/HandlerSchema');

router.get("/", (req, res, next) => {

    var payload = {
        pageTitle: "Handler Console",
        handlerLoggedIn: req.session.handler,
        handlerLoggedInJs: JSON.stringify(req.session.handler),
        userLoggedIn: req.session.user        
    }    
    res.status(200).render("createFacultyaccount", payload);
})

router.post("/", async (req, res, next) => {

    var firstName = req.body.firstName.trim();
    var lastName = req.body.lastName.trim();
    var username = req.body.username.trim();
    var email = req.body.email.trim();
    var password = req.body.password;    
    var payload = req.body;
    payload.faculty = true;    

    if(firstName && lastName && username && email && password) {
        var user = await User.findOne({
            $or: [
                { username: username },
                { email: email }
            ]
        })
        .catch((error) => {
            console.log(error);            
            payload.errorMessage = "Something went wrong during search";
            res.status(200).render("createFacultyaccount", payload);
        });

        if(user == null) {
            // No user found
            console.log("no user found");
            var data = req.body;
            data.password = await bcrypt.hash(password, 10);

            User.create(data)
            .then((user) => {
                payload.errorMessage = `${firstName} ${lastName} @${username} account has been successfully created`;
                return res.redirect("createFacultyaccount");
            })
            .catch((error) => {
                console.log(error);
                payload.errorMessage = "successfully created";
                res.status(200).render("createFacultyaccount", payload);
            });
        }
        else {
            // User found
            if (email == user.email) {
                payload.errorMessage = "Email already in use.";
            }
            else {
                payload.errorMessage = "Username already in use.";
            }
            res.status(200).render("createFacultyaccount", payload);
        }
    }
    else {
        payload.errorMessage = "Make sure each field has a valid value.";
        res.status(200).render("createFacultyaccount", payload);
    }
})

module.exports = router;