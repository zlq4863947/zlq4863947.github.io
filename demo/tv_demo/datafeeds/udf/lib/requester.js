var Requester = /** @class */ (function () {
    function Requester(options) {
        this._baseUrl = options.baseUrl;
        this._corsProxy = options.proxy;
    }
    Requester.prototype.sendRequest = function (urlPath, params) {
        if (params !== undefined) {
            var paramKeys = Object.keys(params);
            if (paramKeys.length !== 0) {
                urlPath += '?';
            }
            urlPath += paramKeys.map(function (key) {
                return encodeURIComponent(key) + "=" + encodeURIComponent(params[key].toString());
            }).join('&');
        }
        // console.log('New request: ' + urlPath);
        // Send user cookies if the URL is on the same origin as the calling script.
        var options = { credentials: 'same-origin' };
        var originUrl = this._baseUrl + "/" + urlPath;
        var url = this._corsProxy ? this._corsProxy + "/" + originUrl : originUrl;
        console.log("request url: " + url);
        return fetch("" + url, options)
            .then(function (response) { return response.text(); })
            .then(function (responseTest) { return JSON.parse(responseTest); });
    };
    return Requester;
}());
export { Requester };
