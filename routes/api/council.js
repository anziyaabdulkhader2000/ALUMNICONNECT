const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const User = require('../../schemas/UserSchema');
const Post = require('../../schemas/PostSchema');
const Notification = require('../../schemas/NotificationSchema');
const Council = require('../../schemas/CouncilSchema');
const Member = require('../../schemas/MemberSchema');

app.use(bodyParser.urlencoded({ extended: false }));

router.get("/", async (req, res, next) => {

    console.log("api council call acheived");    
    var results = await Council.find()    
    .sort({ "createdAt": -1 })
    .then((results)=> {
        console.log(results);
        res.status(200).send(results);
    })
    .catch(error => console.log(error))
})

router.get("/:id", async (req, res, next) => {
    console.log("api id search reached");
    var councilId = req.params.id;
    var council = await Council.findById(councilId) 
    // .populate("president")
    // .populate("secretary")
    // .populate("treasurer")
    .then((council)=> {
        console.log(council);
        res.status(200).send(council);
    })     
    .catch(error => console.log(error))    
})


router.post("/", async (req, res, next) => {    
    console.log("reaching api point");                  
    var payload = req.body;      
    payload.activeStatus = false;
    Council.create(payload)
    .then(async newCouncil => {        
        res.status(201).send(newCouncil);
    })
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })
})

// router.post("/clearStatus/:id", async (req, res, next) => {    
//     console.log("reaching api point to clear all council from activeStatus");                  
//     var id = req.params.id;
//     var close = new Date();
//     console.log("Trying to deactivate " + id);
//     await Council.findByIdAndUpdate(id, {activeStatus : false, tenureClose : close})
//     .then(async newCouncil => {  
//         console.log("Updated council");
//         console.log(newCouncil);      
//         res.status(201).send(newCouncil);
//     })
//     .catch(error => {
//         console.log(error);
//         res.sendStatus(400);
//     })
// })

router.put("/activate/:id", async (req, res, next) => {    
    console.log("reaching api point to activate council " + req.params.id);                  
    var id = req.params.id;
    await Council.updateMany({activeStatus : true}, {activeStatus : false})
        .catch(error => {
            console.log(error);
            res.sendStatus(400);
        })
    await Council.findByIdAndUpdate(id, {activeStatus : true})
    .then(async newCouncil => {        
        res.status(201).send(newCouncil);
    })
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })
})

module.exports = router;