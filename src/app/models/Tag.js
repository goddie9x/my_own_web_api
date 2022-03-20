const mongoose = require('mongoose');
// instantiate a mongoose schema
const TagSchema = new mongoose.Schema({
    tag: { type: String, required: true, unique: true },
    color: { type: String, required: true },
});

// create a model from schema and export it
module.exports = mongoose.model('Tag', TagSchema)