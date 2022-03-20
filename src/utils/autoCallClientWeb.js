const axios = require('axios');
const cron = require('node-cron');

module.exports = cron.schedule('* * * * *', () => {
    axios.get('http://te11.herokuapp.com')
        .then(res => {
            console.log('getted client');
        });
});