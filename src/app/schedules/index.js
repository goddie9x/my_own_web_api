const autoCallClientWeb = require('./autoCallClientWeb');
const {
    scheduleUpdatePerMonth,
    scheduleUpdatePerWeek,
} = require('./autoUpdateDashBoard');

module.exports = function startAllSchedule() {
    autoCallClientWeb.start();
    scheduleUpdatePerMonth.start();
    scheduleUpdatePerWeek.start();
}