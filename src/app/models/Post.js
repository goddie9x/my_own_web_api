const mongoose = require('../../config/db');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const Post = new Schema({
    authorId: [Schema.Types.ObjectId],
    title: { type: String, maxLength: 255, required: true },
    type: Number,
    avatarUrl: String,
    description: { type: String, maxLength: 600 },
    content: { type: String },
    slug: { type: String, slug: 'title', unique: true },
}, { timestamps: true });

//add plugin
mongoose.plugin(slug);
Post.plugin(mongooseDelete, { deletedAt: true, overrideMethods: 'all' });

module.exports = mongoose.model('Post', Post);