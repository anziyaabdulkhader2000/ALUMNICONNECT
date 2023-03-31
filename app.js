const express = require('express');
const app = express();
const port = 3003;
const middleware = require('./middleware')
const path = require('path')
const bodyParser = require("body-parser")
const mongoose = require("./database");
const session = require("express-session");

const server = app.listen(port, () => console.log("Server listening on port " + port));
const io = require("socket.io")(server, {pingTimeout: 60000});

app.set("view engine", "pug");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(session({
    secret: "bbq chips",
    resave: true,
    saveUninitialized: false
}))

// Routes
const loginRoute = require('./routes/loginRoutes');
const registerRoute = require('./routes/registerRoutes');
const logoutRoute = require('./routes/logout');
const postRoute = require('./routes/postRoutes');
const profileRoute = require('./routes/profileRoutes');
const uploadRoute = require('./routes/uploadRoutes');
const searchRoute = require('./routes/searchRoutes');
const messagesRoute = require('./routes/messagesRoutes');
const notificationsRoute = require('./routes/notificationRoutes');
const directoryRoute = require('./routes/directoryRoutes');
const eventsRoute = require('./routes/eventsRoutes');
const announcementsRoute = require('./routes/announcementsRoutes');
const alumniCouncilRoute = require('./routes/alumniCouncilRoutes');
const groupsRoute = require('./routes/groupsRoutes');
const requestReset = require("./routes/requestReset");
const passwordReset = require("./routes/passwordReset");

//Handler Routes
const handlerAccessRoute = require('./routes/handlerAccessRoutes');
const handlerPanelRoute = require('./routes/handlerPanelRoutes');
const createFacultyAccountRoute = require('./routes/createFacultyAccountRoutes');
const createActivityRoute = require('./routes/createActivityRoutes');
const reviewActivityRoute = require('./routes/reviewActivityRoutes');
const updateActivityRoute = require('./routes/updateActivityRoutes');
const createAnnouncementRoute = require('./routes/createAnnouncementRoutes');
const updateAnnouncementRoute = require('./routes/updateAnnouncementRoutes');
const councilManagementRoute = require('./routes/councilManagementRoutes');
const councilUpdateRoute = require('./routes/councilUpdateRoutes');


// Api routes
const postsApiRoute = require('./routes/api/posts');
const usersApiRoute = require('./routes/api/users');
const chatsApiRoute = require('./routes/api/chats');
const messagesApiRoute = require('./routes/api/messages');
const notificationsApiRoute = require('./routes/api/notifications');
const activityApiRoute = require('./routes/api/activity');
const announcementApiRoute = require('./routes/api/announcement');
const councilApiRoute = require('./routes/api/council');
const memberApiRoute = require('./routes/api/member');


//routes app.use
app.use("/login", loginRoute);
app.use("/register", registerRoute);
app.use("/logout", logoutRoute);
app.use("/posts", middleware.requireLogin, postRoute);
app.use("/profile", middleware.requireLogin, profileRoute);
app.use("/uploads", uploadRoute);
app.use("/search", middleware.requireLogin, searchRoute);
app.use("/messages", middleware.requireLogin, messagesRoute);
app.use("/notifications", middleware.requireLogin, notificationsRoute);
app.use("/directory", middleware.requireLogin, directoryRoute);
app.use("/announcements", middleware.requireLogin, announcementsRoute);
app.use("/alumniCouncil", middleware.requireLogin, alumniCouncilRoute);
app.use("/events", middleware.requireLogin, eventsRoute);
app.use("/groups", middleware.requireLogin, groupsRoute);
app.use("/requestReset", requestReset);
app.use("/passwordReset", passwordReset);

//handler routes app.use
app.use("/handlerAccess", handlerAccessRoute);
app.use("/handlerPanel", handlerPanelRoute);
app.use("/createFacultyAccount", createFacultyAccountRoute);
app.use("/createActivity", createActivityRoute);
app.use("/reviewActivity", reviewActivityRoute);
app.use("/updateActivity", updateActivityRoute);
app.use("/createAnnouncements", createAnnouncementRoute);
app.use("/updateAnnouncement", updateAnnouncementRoute);
app.use("/councilManagement", councilManagementRoute);
app.use("/councilUpdate", councilUpdateRoute);



//api routes app.use
app.use("/api/posts", middleware.requireLogin, postsApiRoute);
app.use("/api/users", middleware.requireLogin, usersApiRoute);
app.use("/api/chats", middleware.requireLogin, chatsApiRoute);
app.use("/api/messages", middleware.requireLogin, messagesApiRoute);
app.use("/api/notifications", middleware.requireLogin, notificationsApiRoute);
app.use("/api/activity", activityApiRoute);
app.use("/api/announcement", announcementApiRoute);
app.use("/api/council", councilApiRoute);
app.use("/api/member", memberApiRoute);

app.get("/", middleware.requireLogin, (req, res, next) => {
    var banner = "Welcome home, " + " " + req.session.user.firstName;
    var payload = {
        pageTitle: banner,
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user),
    }

    res.status(200).render("home", payload);
})

io.on("connection", (socket)=> {
    socket.on("setup", userData => {
        socket.join(userData._id);
        socket.emit("connected");
    })

    socket.on("join room", room => socket.join(room));
    socket.on("typing", room => socket.in(room).emit("typing"));
    socket.on("stop typing", room => socket.in(room).emit("stop typing"));
    socket.on("notification received", room => socket.in(room).emit("notification received"));
    socket.on("new message", newMessage => {
        var chat = newMessage.chat;
        if(!chat.users) return console.log("chat.users not defined");

        chat.users.forEach(user => {
            if(user._id == newMessage.sender._id) return;

            socket.in(user._id).emit("message received", newMessage);
        })
    });
})