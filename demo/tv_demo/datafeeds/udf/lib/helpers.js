import * as tslib_1 from "tslib";
export function getRoundByPair(requester, symbol) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var precision, res;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    precision = {
                        price: 2,
                        amount: 2,
                    };
                    return [4 /*yield*/, requester.sendRequest('Tview/getRoundByPair', {
                            pair: symbol
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
}
export function transformKlineType(resolution) {
    switch (resolution) {
        case '1D':
        case 'D':
            return 1440;
        case '1W':
        case 'W':
            return 10080;
        default: {
            return +resolution;
        }
    }
}
export function transformResolution(klineType) {
    switch (klineType) {
        case 1440:
            return '1D';
        case 10080:
            return '1W';
        default: {
            return "" + klineType;
        }
    }
}
export function transform(source) {
    var keys = Object.keys(source);
    var key;
    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
        var o = keys_1[_i];
        if (o.indexOf('kline') != -1) {
            key = o;
            break;
        }
    }
    if (!key) {
        return { bars: [], realtime: false };
    }
    var bars = source[key];
    var newBars = bars.map(function (o) { return ({
        time: o[0] * 1000,
        volume: +o[1],
        open: o[2],
        high: o[3],
        low: o[4],
        close: o[5],
    }); });
    var realtime = source.real === 1;
    return { bars: newBars, realtime: realtime };
}
