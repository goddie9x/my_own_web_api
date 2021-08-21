const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const User = new Schema({
    name: { type: String, maxLength: 255, required: true },
    username: { type: String, maxLength: 255, required: true },
    partword: { type: String, maxLength: 255, required: true },
    img: { type: String, maxLength: 255 },
    slug: { type: String, slug: 'name', unique: true },
    description: { type: String, maxLength: 600 },
}, { timestamps: true });

mongoose.plugin(slug);
User.plugin(mongooseDelete, { deletedAt: true, overrideMethods: 'all' });

module.exports = mongoose.model('User', User);