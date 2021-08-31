module.exports = function checkAndAddHttpSlash(url) {
    if (!url.contains('http')) {
        url = 'http://' + url;
    }
    return url;
}