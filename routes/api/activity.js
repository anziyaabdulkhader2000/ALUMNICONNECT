const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const upload = multer({ dest: "uploads/" });
const User = require('../../schemas/UserSchema');
const Post = require('../../schemas/PostSchema');
const Notification = require('../../schemas/NotificationSchema');
const Activity = require('../../schemas/ActivitySchema');


app.use(bodyParser.urlencoded({ extended: false }));

router.get("/", async (req, res, next) => {
    console.log("api activity call acheived");    
    var results = await Activity.find()    
    .sort({ "createdAt": -1 })
    .then((results)=> {
        console.log(results);
        res.status(200).send(results);
    })
    .catch(error => console.log(error))
    
})

router.get("/:id", async (req, res, next) => {

    var activityId = req.params.id;
    
    var results = await Activity.findOne({ _id: activityId })    
    .populate("imagesPath")    
    .catch(error => console.log(error));
    res.status(200).send(results);
})

router.post("/updateImage/:activityId", upload.single("croppedImage"), async (req, res, next) => {
    if(!req.file) {
        console.log("No file uploaded with ajax request.");
        return res.sendStatus(400);
    }

    var filePath = `/uploads/activityMedia/${req.file.filename}.png`;
    var tempPath = req.file.path;
    var targetPath = path.join(__dirname, `../../${filePath}`);

    fs.rename(tempPath, targetPath, async error => {
        if(error != null) {
            console.log(error);
            return res.sendStatus(400);
        }
        var tempResults = await Activity.findById(req.params.activityId)
        .catch(error=> console.log(error));
        var data = tempResults.images;
        data.push(filePath)
        await Activity.findByIdAndUpdate(req.params.activityId,{ images: data } , { new: true } )
        .catch(error=> console.log(error));
        res.sendStatus(204);
    })
    console.log("coming to api");
    console.log(req.params.activityId);
});


module.exports = router;