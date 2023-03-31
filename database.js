const mongoose = require("mongoose");
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);


class Database {
    constructor() {
        this.connect();
    }

    connect() {
        mongoose.connect("mongodb+srv://socialoutpost:SU50ehfkGBKvpYir@cluster0.rqt1uxe.mongodb.net/?retryWrites=true&w=majorit")
        .then(() => {
            console.log("Database connection successful");
        })
        .catch((err) => {
            console.log("Database connection Error " + err);
        })
    }
}

module.exports = new Database();