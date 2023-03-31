const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const bcrypt = require("bcrypt");
const User = require('../schemas/UserSchema');
const Handler = require('../schemas/HandlerSchema');

app.set("view engine", "pug");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));

router.get("/", (req, res, next) => {
    
    res.status(200).render("handlerAccess");
})

router.post("/", async (req, res, next) => {

    var payload = req.body;
    console.log(payload);
    if(req.body.logUsername && req.body.logPassword) {
        var handler = await Handler.findOne({accessPoint : req.body.logUsername})
        .catch((error) => {
            console.log(error);
            payload.errorMessage = "Non Existent Handler";
            res.status(200).render("/handlerAccess", payload);
        });
        
        if(handler != null) {
            var result = await bcrypt.compare(req.body.logPassword, handler.password);

            if(result === true) {
                req.session.handler = handler;
                return res.redirect("/handlerPanel");
            }
        }

        payload.errorMessage = "Access Denied.";
        return res.status(200).render("handlerAccess", payload);
    }

    payload.errorMessage = "Make sure each field has a valid value.";
    res.status(200).render("handlerPanel");
})

module.exports = router;