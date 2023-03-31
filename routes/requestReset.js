const express = require('express')
const app = express()
const router = express.Router()
const bodyParser = require('body-parser')
const User = require("../schemas/UserSchema")
const nodemailer = require('nodemailer');
const uuid = require("uuid-random")


 
app.use(bodyParser.urlencoded({extended: false}))
 
router.get("/", (req, res, next) => {
    res.status(200).render("requestReset")
})
router.post("/", async (req, res, next) => {
 
    if(!req.body)
        return
    
    const payload = req.body
    const findEmail = req.body.resetEmail.trim()
 
    const getUser = await User.findOne({email: findEmail})
    .catch(() => {
        payload.statusMessage = "Something went wrong. Please try again."
        return res.status(400).render("requestReset", payload)
    })
 
    if(getUser == null) {
        payload.statusMessage = "No user found. Please use the email address you used when registering your account"
        return res.status(400).render("requestReset", payload)
    }
 
    else {
 
        const checkForField = await User.updateOne({email: findEmail}, [{$set:{"resetPassword": { $cond: [ { $not: ["$resetPassword"] }, "", "$resetPassword" ]}}}])
        .catch(() => {
            payload.statusMessage = "Something went wrong. Please try again."
            return res.status(400).render("requestReset", payload)
        })
 
        const checkForPreviousReset = await User.findOne({email: findEmail}).select("resetPassword")
        .catch(() => {
            payload.statusMessage = "Something went wrong. Please try again."
            return res.status(400).render("requestReset", payload)
        })
 
        if(checkForPreviousReset.resetPassword !== "") {
            payload.statusMessage = "You have already requested a password change. Please check your inbox"
            return res.status(400).render("requestReset", payload)
        }
 
        const uniqueId = uuid()
 
        const updateUser = await User.findOneAndUpdate({email: findEmail}, {resetPassword: uniqueId})
        .catch(() => {
            payload.statusMessage = "Something went wrong. Please try again."
            return res.status(400).render("requestReset", payload)
        })
 
        var transporter = nodemailer.createTransport({
            host: "smtp.mailgun.org",
            port: 587,
            auth: {
              user: "postmaster@sandbox61730a252d754e8a9d67c1b3f6404aad.mailgun.org",
              pass: "3b4ad286778033bf00982910e55aefda-b6d086a8-5aab2bb2"
            }
          });
      
        var mailOptions = {
            from: 'Social Outpost',
            to: findEmail,
            subject: 'Password change',
            html: `You have requested a password change. 
            <p>Please follow this link to change your password:</p>
            <a href="http://localhost:3003/passwordReset?id=${uniqueId}">Click here</a>
            <br><br>If you don't see the link, please copy and paste this line in your browser's address bar:
            <p>http://localhost:3003/passwordReset?id=${uniqueId}</p>
            `
            
        }
      
        transporter.sendMail(mailOptions, async function(error, info){
            if (error) {
                const updateUser = await User.findOneAndUpdate({email: findEmail}, {resetPassword: ""})
                .catch(() => {
                    payload.statusMessage = "Something went wrong. Please try again."
                    return res.status(400).render("requestReset", payload)
                })
                payload.statusMessage = "Something went wrong. Please try again"
                return res.status(400).render("requestReset", payload)
            } else {
            console.log('Email sent: ' + info.response)
            }
        })
 
        payload.statusMessage = "We have sent you an email with a link to reset your password. If you don't see it in your inbox, please check your spam folder"
        return res.status(200).render("requestReset", payload)
    }
})
 
module.exports = router