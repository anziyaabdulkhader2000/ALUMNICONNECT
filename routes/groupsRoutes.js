const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const bcrypt = require("bcrypt");
const User = require('../schemas/UserSchema');

router.get("/", (req, res, next) => {    
    var payload = {
        pageTitle: "Directory of information",
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user)        
    }    
    res.status(200).render("groupsPage", payload);
})

// router.get("/:passedString", (req, res, next) => {    
//     var payload = getPayload(req.params.graduationBatch);
//     res.status(200).render("groupsPage", payload);
// })

// function getPayload(passedString) {
//     if(passedString == "faculty") {
//         return {
//             pageTitle: "Fleet of faculties",
//             userLoggedIn: req.session.user,
//             userLoggedInJs: JSON.stringify(req.session.user),
//             passedString : passedString
//         }
//     } 
//     else {
//         return {
//             pageTitle: `Alumnae fleet of ${passedString}`,
//             userLoggedIn: req.session.user,
//             userLoggedInJs: JSON.stringify(req.session.user),
//             passedString : passedString
//         }
//     }
// }

router.get("/faculty", (req, res, next) => {    
    var payload = {
        pageTitle: "Directory of Members",
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user),
        keyString : "faculty"      
    }    
    res.status(200).render("groupsPage", payload);
})

router.get("/:graduationBatch", (req, res, next) => {    
    var payload = {
        pageTitle: `Directory of Members`,
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user),
        keyString :  req.params.graduationBatch 
    }    
    res.status(200).render("groupsPage", payload);
})


module.exports = router;