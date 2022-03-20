const mongoose = require('../../config/db');
const Schema = mongoose.Schema;

const Notifs = new Schema({
    userNameAthor: String,
    userAthorAvatar: String,
    url: String,
    content: String,
    //1: post, 2:news, 3: schedule, 4: exam,  5: comment, 6: like, 7: follow, 8: message
    type: Number,
    forAll: Boolean,
    forUserIds: [{ type: String }],
    createdAt: { type: Date, default: Date.now, expires: '2d' },
}, { timestamps: true });

module.exports = mongoose.model('Notifs', Notifs);