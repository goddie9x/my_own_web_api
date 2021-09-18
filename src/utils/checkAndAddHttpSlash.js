module.exports = function checkAndAddHttpSlash(url) {
    let newUrl = url;

    if (!url.includes('http')) {
        newUrl = 'http://' + url;
    }
    return newUrl;
}