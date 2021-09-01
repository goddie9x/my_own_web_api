const mongoose = require('mongoose');

async function connect(url, callback) {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
        console.log("connect successfully");
    } catch (err) {
        console.log(err);
    }
}

module.exports = { connect };