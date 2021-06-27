import * as tslib_1 from "tslib";
import { Requester } from './requester';
import { transformKlineType, } from './helpers';
var UDFCompatibleDatafeed = /** @class */ (function () {
    function UDFCompatibleDatafeed(url) {
        this.requester = new Requester({
            baseUrl: url,
        });
    }
    UDFCompatibleDatafeed.prototype.onReady = function (callback) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                setTimeout(function () {
                    callback({
                        supports_search: false,
                        supported_resolutions: ['1', '5', '15', '30', '60', '360', '1D'],
                    });
                });
                return [2 /*return*/];
            });
        });
    };
    UDFCompatibleDatafeed.prototype.resolveSymbol = function (symbolName, onResolve, onError) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var pricescale, volume_precision, res;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pricescale = 4;
                        volume_precision = 4;
                        return [4 /*yield*/, this.requester.sendRequest('pc/v3/k_link/round', {
                                market: symbolName
                            })];
                    case 1:
                        res = _a.sent();
                        if (res && res.data) {
                            pricescale = res.data.price_round;
                            volume_precision = res.data.num_round;
                        }
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
                            supported_resolutions: ['1', '5', '15', '30', '60', '360', '1D'],
                            has_daily: true,
                            has_weekly_and_monthly: false,
                            has_empty_bars: false,
                            has_no_volume: false,
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    UDFCompatibleDatafeed.prototype.searchSymbols = function (userInput, exchange, symbolType, onResult) {
    };
    UDFCompatibleDatafeed.prototype.getBars = function (symbolInfo, resolution, from, to, onResult, onError, isFirst) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var res, bars, _i, _a, bar;
            return tslib_1.__generator(this, function (_b) {
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
                            noData: bars.length === 0
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    UDFCompatibleDatafeed.prototype.subscribeBars = function (symbolInfo, resolution, onTick, listenerGuid, onResetCacheNeededCallback) {
        var symbol = symbolInfo.name;
        var period = transformKlineType(resolution);
        window.listenerGuid = symbol + ":" + period;
        if (window.socket) {
            window.socket.emit("tvkline_add", JSON.stringify({ symbol: symbol, period: period }));
        }
        if (!window.onTick) {
            window.onTick = onTick;
        }
    };
    UDFCompatibleDatafeed.prototype.unsubscribeBars = function (listenerGuid) {
        if (window.socket) {
            var _a = listenerGuid.split(':'), symbol = _a[0], period = _a[1];
            window.socket.emit("tvkline_remove", JSON.stringify({ symbol: symbol, period: period }));
        }
    };
    return UDFCompatibleDatafeed;
}());
export { UDFCompatibleDatafeed };
