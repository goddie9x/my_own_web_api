module.exports = function checkAndAddHttpSlash(url) {
    if (!url.includes('http')) {
        newUrl = 'http://' + url;
    }
    return newUrl;
}