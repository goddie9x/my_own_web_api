const mongoose = require('../../config/db');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const Schedule = new Schema({
    name: { type: String, maxLength: 255, required: true },
    //0: schedule, 1: exam
    type: Number,
    room: { type: String, maxLength: 255, required: true },
    dayOfWeek: { type: Number, required: true },
    partOfDay: { type: Number, required: true },
    dayStart: { type: Number, required: true },
    dayEnd: { type: Number },
    time: { type: String },
    linkMeet: [{ type: String, maxLength: 255 }],
    linkClass: [{ type: String, maxLength: 255 }],
}, { timestamps: true });

//add plugin
mongoose.plugin(slug);
Schedule.plugin(mongooseDelete, { deletedAt: true, overrideMethods: 'all' });

module.exports = mongoose.model('Schedule', Schedule);