const mongoose = require('../../config/db');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const User = new Schema({
    name: { type: String, maxLength: 255 },
    account: { type: String, maxLength: 255, required: true, unique: true },
    password: { type: String, maxLength: 255, required: true },
    //0: unknow, 1. Man, 2. female
    gender: { type: Number },
    dateOfBirth: { type: Date },
    status: { type: Boolean, default: false },
    //0: admin, 1: mod, 2: populer user
    role: { type: Number, default: 2 },
    image: { type: String, maxLength: 255 },
    fullName: { type: String, maxLength: 255 },
    email: [{ type: String, maxLength: 255 }],
    phone: [{ type: String, maxLength: 255 }],
    address: { type: String, maxLength: 255 },
    description: { type: String, maxLength: 600 },
}, { timestamps: true });

User.method.encryptPassword = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
}
User.method.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}
User.plugin(mongooseDelete, { deletedAt: true, overrideMethods: 'all' });

module.exports = mongoose.model('User', User);