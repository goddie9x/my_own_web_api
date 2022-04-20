const mongoose = require('../../config/db');
const Schema = mongoose.Schema;

const NotificationRead = new Schema({
    userId: { type: String, required: true },
    readNotifIds: [{ type: String, required: true }],
    viewedNotifIds: [{ type: String, required: true }],
    createdAt: { type: Date, default: Date.now, expires: '2w' },
}, { timestamps: true });

module.exports = mongoose.model('NotificationRead', NotificationRead);