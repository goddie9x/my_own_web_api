const mongoose = require('../../config/db');
const Schema = mongoose.Schema;

const Comment = new Schema({
    targetId: { type: String, required: true },
    userId: { type: String, required: true },
    content: { type: String, required: true },
    reactions: { type: Array, default: [0, 0, 0, 0, 0, 0], maxItems: 6, minItems: 6 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', Comment);