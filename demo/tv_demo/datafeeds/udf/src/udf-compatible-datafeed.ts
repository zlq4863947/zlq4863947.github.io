import {
  DatafeedConfiguration,
  ErrorCallback,
  HistoryCallback,
  IDatafeedChartApi,
  IExternalDatafeed,
  LibrarySymbolInfo,
  OnReadyCallback,
  ResolutionString,
  ResolveCallback,
  SubscribeBarsCallback,
  SearchSymbolsCallback,
  Bar,
} from '../../../charting_library/datafeed-api';

import {Requester} from './requester';

import {
  transformKlineType,
} from './helpers';

export interface UdfCompatibleConfiguration extends DatafeedConfiguration {
  supports_search?: boolean;
  supports_group_request?: boolean;
}

interface Window {
  socket: any;
  onTick?: SubscribeBarsCallback;
  listenerGuid: string;
}

declare var window: Window;

export class UDFCompatibleDatafeed implements IExternalDatafeed, IDatafeedChartApi {

  private requester: Requester;

  constructor(url: string) {
    this.requester = new Requester({
      baseUrl: url,
    });
  }

  public async onReady(callback: OnReadyCallback) {
    setTimeout(() => {
      callback(<UdfCompatibleConfiguration>{
        supports_search: false,
        supported_resolutions: ['1', '5', '15', '30', '60', '360', '1D'],
      });
    });
  }

  public async resolveSymbol(symbolName: string, onResolve: ResolveCallback, onError: ErrorCallback) {
    let pricescale = 4;
    let volume_precision = 4;
    const res: any = await this.requester.sendRequest('pc/v3/k_link/round', {
      market: symbolName
    });
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
      pricescale: 10 ** pricescale,
      volume_precision,
      minmov: 1,
      has_intraday: true,
      intraday_multipliers: ['1', '5', '15', '30', '60', '360'],
      supported_resolutions: ['1', '5', '15', '30', '60', '360', '1D'],
      has_daily: true,
      has_weekly_and_monthly: false,
      has_empty_bars: false,
      has_no_volume: false,
    });
  }

  public searchSymbols(userInput: string, exchange: string, symbolType: string, onResult: SearchSymbolsCallback) {
  }

  public async getBars(
    symbolInfo: LibrarySymbolInfo,
    resolution: string,
    from: number,
    to: number,
    onResult: HistoryCallback,
    onError: ErrorCallback,
    isFirst: boolean,
  ) {
    const res: any = await this.requester.sendRequest('pc/v3/k_link', {
      symbol: symbolInfo.name,
      period: transformKlineType(resolution),
      start_time: from * 1000,
      end_time: to * 1000,
    });
    const bars: Bar[] = [];
    if (res.data && res.data.data && res.data.data.k_link) {
      for (const bar of res.data.data.k_link) {
        bars.push({
          time: bar.date,
          close: bar.close,
          open: bar.open,
          high: bar.high,
          low: bar.low,
          volume: bar.volume,
        })
      }
    }
    onResult(bars, {
      noData: bars.length === 0
    });
  }

  public subscribeBars(
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    onTick: SubscribeBarsCallback,
    listenerGuid: string,
    onResetCacheNeededCallback: () => void,
  ): void {
    const symbol = symbolInfo.name;
    const period = transformKlineType(resolution);
    window.listenerGuid = `${symbol}:${period}`;
    if (window.socket) {
      window.socket.emit("tvkline_add", JSON.stringify({symbol, period}));
    }
    if (!window.onTick) {
      window.onTick = onTick;
    }
  }

  public unsubscribeBars(listenerGuid: string): void {
    if (window.socket) {
      const [symbol, period] = listenerGuid.split(':');
      window.socket.emit("tvkline_remove", JSON.stringify({symbol, period}));
    }
  }
}
