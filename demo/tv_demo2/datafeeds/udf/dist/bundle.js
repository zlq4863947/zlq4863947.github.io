(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.Datafeeds = {})));
}(this, (function (exports) { 'use strict';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */













function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) { throw t[1]; } return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) { throw new TypeError("Generator is already executing."); }
        while (_) { try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) { return t; }
            if (y = 0, t) { op = [0, t.value]; }
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) { _.ops.pop(); }
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; } }
        if (op[0] & 5) { throw op[1]; } return { value: op[0] ? op[1] : void 0, done: true };
    }
}

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

/*export function transformKlineType(resolution: string): string {
  switch (resolution) {
    case '1':
      return '1M';
    case '5':
      return '5M';
    case '15':
      return '15M';
    case '30':
      return '30M';
    case '60':
      return '60M';
    case '1M':
    case 'M':
      return 'MO';
    default: {
      return resolution;
    }
  }
}*/
function transformKlineType(resolution) {
    switch (resolution) {
        case '1D':
        case 'D':
        case 'M':
        case '1M':
            return 1440;
        case '1W':
        case 'W':
            return 10080;
        default: {
            return +resolution;
        }
    }
}

var UDFCompatibleDatafeed = /** @class */ (function () {
    function UDFCompatibleDatafeed(url) {
        this.requester = new Requester({
            baseUrl: url,
        });
    }
    UDFCompatibleDatafeed.prototype.onReady = function (callback) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                setTimeout(function () {
                    callback({
                        supports_search: false,
                        supported_resolutions: ['1', '5', '15', '30', '60', '360', '1D', '1W'],
                    });
                });
                return [2 /*return*/];
            });
        });
    };
    UDFCompatibleDatafeed.prototype.getRound = function (symbol) {
        return __awaiter(this, void 0, void 0, function () {
            var precision, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        precision = {
                            price: 4,
                            amount: 4,
                        };
                        return [4 /*yield*/, this.requester.sendRequest('pc/v3/k_link/round', {
                                market: symbol
                            })];
                    case 1:
                        res = _a.sent();
                        if (res && res.data) {
                            precision.amount = res.data.num_round;
                            precision.price = res.data.price_round;
                        }
                        return [2 /*return*/, precision];
                }
            });
        });
    };
    UDFCompatibleDatafeed.prototype.resolveSymbol = function (symbolName, onResolve, onError) {
        return __awaiter(this, void 0, void 0, function () {
            var pricescale, volume_precision, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pricescale = 4;
                        volume_precision = 4;
                        return [4 /*yield*/, this.getRound(symbolName)];
                    case 1:
                        res = _a.sent();
                        if (res && res.data) {
                            pricescale = res.data.price_round;
                            volume_precision = res.data.num_round;
                        }
                        try {
                            onResolve({
                                name: symbolName,
                                ticker: symbolName,
                                full_name: symbolName,
                                description: '',
                                session: '24x7',
                                type: 'bitcoin',
                                exchange: '',
                                listed_exchange: '',
                                timezone: 'Asia/Shanghai',
                                pricescale: Math.pow(10, pricescale),
                                volume_precision: volume_precision,
                                minmov: 1,
                                has_intraday: true,
                                intraday_multipliers: ['1', '5', '15', '30', '60', '360'],
                                supported_resolutions: ['1', '5', '15', '30', '60', '360', '1D', '1W'],
                                has_daily: true,
                                has_weekly_and_monthly: false,
                                has_empty_bars: false,
                                has_no_volume: false,
                            });
                        }
                        catch (e) { }
                        return [2 /*return*/];
                }
            });
        });
    };
    UDFCompatibleDatafeed.prototype.searchSymbols = function (userInput, exchange, symbolType, onResult) {
    };
    UDFCompatibleDatafeed.prototype.getBars = function (symbolInfo, resolution, from, to, onResult, onError, isFirst) {
        return __awaiter(this, void 0, void 0, function () {
            var res, bars, _i, _a, bar;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.requester.sendRequest('pc/v3/k_link', {
                            symbol: symbolInfo.name,
                            period: transformKlineType(resolution),
                            start_time: from * 1000,
                            end_time: to * 1000,
                        })];
                    case 1:
                        res = _b.sent();
                        bars = [];
                        if (res.data && res.data.data && res.data.data.k_link) {
                            for (_i = 0, _a = res.data.data.k_link; _i < _a.length; _i++) {
                                bar = _a[_i];
                                bars.push({
                                    time: bar.date,
                                    close: bar.close,
                                    open: bar.open,
                                    high: bar.high,
                                    low: bar.low,
                                    volume: bar.volume,
                                });
                            }
                        }
                        onResult(bars, {
                            noData: bars.length === 0,
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    UDFCompatibleDatafeed.prototype.subscribeBars = function (symbolInfo, resolution, onTick, listenerGuid, onResetCacheNeededCallback) { };
    UDFCompatibleDatafeed.prototype.unsubscribeBars = function (listenerGuid) { };
    return UDFCompatibleDatafeed;
}());

exports.UDFCompatibleDatafeed = UDFCompatibleDatafeed;

Object.defineProperty(exports, '__esModule', { value: true });

})));
