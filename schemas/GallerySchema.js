const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const GallerySchema = new Schema({
    imagePath: { type: String, required: true, trim: true }    
}, { timestamps: true });

var Gallery = mongoose.model('Gallery', GallerySchema);
module.exports = Gallery;