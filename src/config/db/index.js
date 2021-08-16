const mongoose = require('mongoose');

async function connect(url, callback) {
    try {
        await mongoose.connect('mongodb+srv://goddie9x:Mtamhm97@cluster0.hlbwa.mongodb.net/Cluster0?retryWrites=true&w=majority', {
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