const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const HandlerSchema = new Schema({
    accessPoint: { type: String, required: true, trim: true },    
    password: { type: String, required: true }    
}, { timestamps: true });

var Handler = mongoose.model('Handler', HandlerSchema);
module.exports = Handler;