  export interface RequestParams {
	[paramName: string]: string | string[] | number;
}
export class Requester {
	private _baseUrl: string;
  private _corsProxy?: string;

	public constructor(options: {
    baseUrl: string,
    proxy?: string,
  }) {
    this._baseUrl = options.baseUrl;
    this._corsProxy = options.proxy;
	}

	public sendRequest<T>(urlPath: string, params?: RequestParams): Promise<T> {
		if (params !== undefined) {
			const paramKeys = Object.keys(params);
			if (paramKeys.length !== 0) {
				urlPath += '?';
			}

			urlPath += paramKeys.map((key: string) => {
				return `${encodeURIComponent(key)}=${encodeURIComponent(params[key].toString())}`;
			}).join('&');
		}

		// console.log('New request: ' + urlPath);

		// Send user cookies if the URL is on the same origin as the calling script.
		const options: RequestInit = { credentials: 'same-origin' };

    const originUrl = `${this._baseUrl}/${urlPath}`;
    const url = this._corsProxy ? `${this._corsProxy}/${originUrl}` : originUrl;
    console.log(`request url: ${url}`);
    return fetch(`${url}`, options)
      .then((response: Response) => response.text())
      .then((responseTest: string) => JSON.parse(responseTest));
	}
}
