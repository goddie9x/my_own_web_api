const mongoose = require('../../config/db');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const Post = new Schema({
    author: String,
    authorAvatar: String,
    authorQuote: String,
    authorId: String,
    title: { type: String, required: true },
    //1: post, 2:news
    type: Number,
    avatarUrl: String,
    description: String,
    content: String,
    headingList: String,
    reactions: { type: Array, default: [0, 0, 0, 0, 0, 0], maxItems: 6, minItems: 6 },
    commentCount: Number,
    slug: { type: String, slug: 'title', unique: true },
    tag: [{ type: String }],
    //0: public, 1: private, 2:classmate
    publicType: Number,
}, { timestamps: true });

mongoose.plugin(slug);
Post.plugin(mongooseDelete, { deletedAt: true, overrideMethods: 'all' });

module.exports = mongoose.model('Post', Post);