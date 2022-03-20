const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
    url: String,
    public_id: String,
    active: { type: Boolean, default: true },
    lang: String,
}, { timestamps: true });

module.exports = mongoose.model('Image', ImageSchema);