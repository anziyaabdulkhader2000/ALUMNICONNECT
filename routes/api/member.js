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

router.get("/populateCouncil/:id", async (req, res, next) => {
    console.log("api council call acheived to populate council");
    var councilId = req.params.id;    
    var results = await Member.find({tenureId : councilId})   
    .populate("user") 
    .sort({ "createdAt": 1 })
    .then((results)=> {        
        res.status(200).send(results);
    })
    .catch(error => console.log(error))
})

router.get("/checkCouncilStatus/:id", async (req, res, next) => {
    console.log("api council call acheived to check status of council");
    var councilId = req.params.id;  
    var returnFlag = {
        presidentStatus : false,
        secretaryStatus : false,
        treasurerStatus : false
    }
    
    //Checking if president is existent
    var president = await Member.findOne({tenureId : councilId, designation : "President"})    
    .then((results)=> {        
        console.log(results);
        if(results != undefined) {
            returnFlag.presidentStatus = true;
        }
    })
    .catch(error => {
        console.log("President catch encountered");
        console.log(error);
    })

    //Checking if secretary is existent
    var secretary = await Member.findOne({tenureId : councilId, designation : "Secretary"})    
    .then((results)=> {        
        console.log(results);
        if(results != undefined) {
            returnFlag.secretaryStatus = true;
        }
    })
    .catch(error => {
        console.log("Secretary catch encountered");
        console.log(error);
    })

    //Checking if treasurer is existent
    var treasurer = await Member.findOne({tenureId : councilId, designation : "Treasurer"})    
    .then((results)=> {        
        console.log(results);
        if(results != undefined) {
            returnFlag.treasurerStatus = true;
        }
    })
    .catch(error => {
        console.log("Treasurer catch encountered");
        console.log(error);
    })

    res.status(200).send(returnFlag);
})

router.post("/", async (req, res, next) => {
    console.log("comes here");
    console.log(req.body);
    
    var newMember = {
        tenureStart : req.body.tenureStart,
        tenureId : req.body.tenureId,
        user : req.body.user,
        designation : req.body.designation,
        activeStatus : true
    };    
    
    Member.create(newMember)
    .then(async member => {
        member = await member.populate("user").execPopulate(); 
        console.log("data with which new omember is being created");
        console.log(member);
        res.status(201).send(member);
    })
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })   
})

router.post("/reactivateMember/", async (req, res, next) => {
    console.log("comes here");
    console.log(req.body);
    
    var newMember = {
        tenureStart : req.body.tenureStart,
        tenureId : req.body.tenureId,
        user : req.body.user,
        designation : req.body.designation,
        activeStatus : true
    };   
    
    var member = await Member.findOneAndUpdate({user : newMember.user, tenureId : newMember.tenureId, activeStatus : false}, { activeStatus : true })
    .then(member => {        
        console.log("data with which new member is being updated");
        console.log(member);
        res.status(201).send(member);
    })
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })       
})


router.post("/impeach/:id", async (req, res, next) => {
    console.log("api activeted to remove member");
    var id = req.params.id;
    console.log("Trying to remove "+ id);

    var member = await Member.findByIdAndUpdate(id, {activeStatus : false})
    .then(member => {
        console.log("Success block entered");       
        res.status(201).send(member);
    })    
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })
})

router.post("/undesignatePresident/:id", async (req, res, next) => {
    console.log("api activated to undesignate member as president");
    var id = req.params.id;
    console.log("UnSetting "+ id);
    var member = await Member.findOneAndUpdate({tenureId : id, designation : "President"}, {designation : "Associate Member"})
    .then(member => {
        console.log("Success block entered of undesignate api method");       
        res.status(201).send(member);
    })    
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })
})

router.post("/designatePresident/:id", async (req, res, next) => {
    console.log("api activated to designate member as president");
    var id = req.params.id;
    console.log("Setting "+ id);
    var member = await Member.findByIdAndUpdate(id, {designation : "President"})
    .then(member => {
        console.log("Success block entered of designate api method");       
        res.status(201).send(member);
    })    
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })
})

router.post("/undesignateSecretary/:id", async (req, res, next) => {
    console.log("api activated to undesignate member as secretary");
    var id = req.params.id;
    console.log("UnSetting "+ id);
    var member = await Member.findOneAndUpdate({tenureId : id, designation : "Secretary"}, {designation : "Associate Member"})
    .then(member => {
        console.log("Success block entered of undesignate api method");       
        res.status(201).send(member);
    })    
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })
})

router.post("/designateSecretary/:id", async (req, res, next) => {
    console.log("api activated to designate member as secretary");
    var id = req.params.id;
    console.log("Setting "+ id);
    var member = await Member.findByIdAndUpdate(id, {designation : "Secretary"})
    .then(member => {
        console.log("Success block entered of designate api method");       
        res.status(201).send(member);
    })    
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })
})

router.post("/undesignateTreasurer/:id", async (req, res, next) => {
    console.log("api activated to undesignate member as treasurer");
    var id = req.params.id;
    console.log("UnSetting "+ id);
    var member = await Member.findOneAndUpdate({tenureId : id, designation : "Treasurer"}, {designation : "Associate Member"})
    .then(member => {
        console.log("Success block entered of undesignate api method");       
        res.status(201).send(member);
    })    
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })
})

router.post("/designateTreasurer/:id", async (req, res, next) => {
    console.log("api activated to designate member as treasurer");
    var id = req.params.id;
    console.log("Setting "+ id);
    var member = await Member.findByIdAndUpdate(id, {designation : "Treasurer"})
    .then(member => {
        console.log("Success block entered of designate api method");       
        res.status(201).send(member);
    })    
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })
})

module.exports = router;