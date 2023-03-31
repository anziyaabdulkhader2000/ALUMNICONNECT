const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MemberSchema = new Schema({
    tenureStart: { type: Date, required: true},     
    tenureId: { type: String, required: true, trim: true}, 
    user: { type: Schema.Types.ObjectId, ref: 'User' }, 
    designation: { type: String, required: true, trim: true}, 
    activeStatus: Boolean   
}, { timestamps: true });

var Member = mongoose.model('Member', MemberSchema);
module.exports = Member;