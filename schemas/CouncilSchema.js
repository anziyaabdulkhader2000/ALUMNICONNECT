const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CouncilSchema = new Schema({
    tenureStart: { type: Date, required: true}, 
    tenureClose: { type: Date}, 
    councilMessage: { type: String, required: true, trim: true},         
    activeStatus: Boolean    
}, { timestamps: true });

var Council = mongoose.model('Council', CouncilSchema);
module.exports = Council;