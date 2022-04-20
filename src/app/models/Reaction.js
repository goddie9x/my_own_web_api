const mongoose = require('../../config/db');
const Schema = mongoose.Schema;

const ReactionSchema = new Schema({
    targetId: { type: String, required: true },
    userId: { type: String, required: true },
    reactionType: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Reaction', ReactionSchema);