module.exports = function getCurrentWeek() {
    const currentDay = new Date().getDay();
    const currentWeek = Math.floor(currentDay / 7);
    return currentWeek;
};