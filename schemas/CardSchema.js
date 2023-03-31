const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CardSchema = new Schema({
    user: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    mode: { type: String, required: true, trim: true },
    establishment: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true, unique: true },
    tag: { type: String, required: true, trim: true, unique: true }    
}, { timestamps: true });

var Card = mongoose.model('Card', CardSchema);
module.exports = Card;