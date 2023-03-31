const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ActivitySchema = new Schema({
    activityTitle: { type: String, required: true, trim: true, unique: true }, 
    activityDate: { type: Date, required: true}, 
    activityVenue: { type: String, required: true, trim: true}, 
    activityAttendance: { type: Number, required: true, trim: true}, 
    activityDescription: { type: String, required: true, trim: true}, 
    images: [{ type: String, trim: true }]     
}, { timestamps: true });

var Activity = mongoose.model('Activity', ActivitySchema);
module.exports = Activity;