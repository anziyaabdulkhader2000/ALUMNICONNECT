const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AnnouncementSchema = new Schema({
    announcementTitle: { type: String, required: true, trim: true, unique: true }, 
    announcementDate: { type: Date, required: true}, 
    announcementVenue: { type: String, required: true, trim: true}, 
    announcementLink: { type: String, trim: true}, 
    announcementDescription: { type: String, required: true, trim: true}, 
    imageURL: { type: String, trim: true }     
}, { timestamps: true });

var Announcement = mongoose.model('Announcement', AnnouncementSchema);
module.exports = Announcement;