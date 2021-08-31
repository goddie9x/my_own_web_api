const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const User = new Schema({
    name: { type: String, maxLength: 255 },
    account: { type: String, maxLength: 255, required: true, unique: true },
    password: { type: String, maxLength: 255, required: true },
    img: { type: String, maxLength: 255 },
    slug: { type: String, slug: 'name', unique: true },
    fullName: { type: String, maxLength: 255 },
    email: [{ type: String, maxLength: 255 }],
    phone: [{ type: String, maxLength: 255 }],
    address: { type: String, maxLength: 255 },
    description: { type: String, maxLength: 600 },
}, { timestamps: true });

mongoose.plugin(slug);
User.method.encryptPassword = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
}
User.method.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}
User.plugin(mongooseDelete, { deletedAt: true, overrideMethods: 'all' });

module.exports = mongoose.model('User', User);