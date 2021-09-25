const mongoose = require('mongoose');

async function connectShortUrl(url, callback) {
    try {
        await mongoose.connect(process.env.MONGODB_URI_FOR_URLS, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("connect url2 successfully");
    } catch (err) {
        console.log(err);
    }
}
connectShortUrl();

module.exports = mongoose;