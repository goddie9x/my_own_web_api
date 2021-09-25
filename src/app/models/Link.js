const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');

// instantiate a mongoose schema
const URLSchema = new mongoose.Schema({
    longUrl: { type: String, required: true },
    shortUrl: { type: String, unique: true },
    date: {
        type: String,
        default: Date.now
    }
})

// create a model from schema and export it
module.exports = mongoose.model('Url', URLSchema)