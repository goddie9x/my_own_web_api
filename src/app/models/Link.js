const mongoose = require('../../config/db/urlsDb');
const Schema = mongoose.Schema;

const Link = new Schema({
    url: { type: String, required: true, unique: true },
    shortUrl: { type: String, required: true, unique: true },
}, { timestamps: true });

module.exports = mongoose.model('Link', Link);