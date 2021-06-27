import {Bar} from '../../../charting_library/datafeed-api';
import {Requester} from './requester';

export interface Precision {
  price: number;
  amount: number;
}

export async function getRoundByPair(requester: Requester, symbol: string): Promise<Precision> {
  const precision: Precision = {
    price: 2,
    amount: 2,
  };
  const res: any = await requester.sendRequest('Tview/getRoundByPair', {
    pair: symbol
  });
  if (res && res.data) {
    precision.amount = res.data.num_round;
    precision.price = res.data.price_round;
  }

  return precision;
}

export function transformKlineType(resolution: string): number {
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

export function transformResolution(klineType: number): string {

  switch (klineType) {
    case 1440:
      return '1D';
    case 10080:
      return '1W';
    default: {
      return `${klineType}`;
    }
  }
}

// 时间戳，成交量，开盘价，最高价，最低价，收盘价
type BarSourceData = [number, string, number, number, number, number];

export interface BarSource {
  kline1?: number[][],
  kline5?: number[][],
  kline15?: number[][],
  kline30?: number[][],
  kline60?: number[][],
  kline360?: number[][],
  kline1440?: number[][],
  real: 0 | 1,
}

export interface BarOutputData {
  bars: Bar[],
  realtime: boolean;
}

export function transform(source: BarSource): BarOutputData {
  const keys = Object.keys(source);
  let key;
  for (const o of keys) {
    if (o.indexOf('kline') != -1) {
      key = o;
      break;
    }
  }
  if (!key) {
    return {bars: [], realtime: false};
  }
  const bars: BarSourceData[] = (<any>source)[key];
  const newBars = bars.map(o => ({
    time: o[0] * 1000,
    volume: +o[1],
    open: o[2],
    high: o[3],
    low: o[4],
    close: o[5],
  })) as Bar[];
  const realtime = source.real === 1;

  return {bars: newBars, realtime};
}
