const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const bcrypt = require("bcrypt");
const User = require('../schemas/UserSchema');
const Handler = require('../schemas/HandlerSchema');
const Activity = require('../schemas/ActivitySchema');

router.get("/:id", async (req, res, next) => {

    var payload = await getPayload(req.params.id,req.session.handler);
    console.log(payload);  
    res.status(200).render("updateActivity", payload);
})



module.exports = router;

async function getPayload(id,handler) {
    result = await Activity.findById(id)
    .catch(error=> console.log(error));  
    
    return {
        pageTitle: "Update Activity",
        handlerLoggedIn: handler,
        handlerLoggedInJs: JSON.stringify(handler),
        activityId: id,
        activity : result,
        userLoggedIn: req.session.user
    }
}