import {
	IErrResponse,
	IHeaderData,
	IHeadersInfo,
	IHeadersValues,
	ITransactionParams,
	TResult,
	resultErr,
	resultOk,
} from '@nxms/core-main/domain';
import { HeadersInfo } from '../../domain';
import { IncomingHttpHeaders } from 'http2';

export class AppServiceHeaders {
	// eslint-disable-next-line no-use-before-define
	private static instance: InstanceType<typeof AppServiceHeaders>;

	private headersInfo: IHeadersInfo = {};

	private mandatoryHeaders: IHeaderData[] = [];

	private allHeaders: { [id: string]: IHeaderData } = {};

	constructor() {
		this.headersInfo = new HeadersInfo().headers;
		this.setMyHeaders();
	}

	public static getInstance(): InstanceType<typeof AppServiceHeaders> {
		return this.instance || (this.instance = new this());
	}
	// Llena la lista de headers (all y mandatory)

	private setMyHeaders(): void {
		for (const head in this.headersInfo) {
			if (this.headersInfo[head]) {
				const myHeader = this.headersInfo[head];
				const pref = myHeader.prefix;
				const fullHeader = `${pref.letter}-${pref.prefix}-${myHeader.key}`;
				const values = myHeader.values || [];

				this.allHeaders[head] = { key: fullHeader, values };

				if (myHeader.mandatory) {
					this.mandatoryHeaders.push({ key: fullHeader, values });
				}
			}
		}
	}

	// Obtiene el detalle de un header

	private getHeaderInfo(headerName: string) {
		return this.allHeaders[headerName] || { key: 'fail', values: ['error'] };
	}

	// Obtiene el valor enviado en un header

	private getHeaderValue(
		headers: IncomingHttpHeaders,
		headerName: string
	): string {
		return (headers[this.getHeaderInfo(headerName).key] as string) || '';
	}

	private validateListHeaders(
		reqHeader: IncomingHttpHeaders,
		headers: string[]
	): TResult<IHeadersValues, IErrResponse> {
		let isValidHeader = true,
			validHeadersResponse = null;
		const headersValues: IHeadersValues = {};

		for (const headerName of headers) {
			// If (info.ruta.path) {

			validHeadersResponse = this.validate(reqHeader, headerName);

			// }

			if (validHeadersResponse.isErr()) {
				isValidHeader = false;
				break;
			}
			headersValues[headerName] = this.getHeaderValue(reqHeader, headerName);
		}

		if (!isValidHeader) {
			return validHeadersResponse;
		}

		return resultOk(headersValues);
	}

	// Valida headers después de obtener la info

	public validateRutaHeaders(
		info: ITransactionParams
	): TResult<IHeadersValues, IErrResponse> {
		if (info.reqHeader && info.ruta?.headers && info.ruta?.globalHeaders) {
			const resGlobalHeaders = this.validateListHeaders(
				info.reqHeader,
				info.ruta.globalHeaders
			);

			if (resGlobalHeaders.isErr()) {
				return resGlobalHeaders;
			}

			return this.validateListHeaders(info.reqHeader, info.ruta.headers);
		}

		if (info.ruta.private) {
			/* TODO: hacer algo cuando la ruta es privada
			    Console.log('asd'); */
		}

		return resultOk({});
	}

	private setHeaderError(errDetail: string) {
		return { errDetail, headersOk: false };
	}

	private validateHeaderValue(value: string, values: string[]) {
		if (values) {
			if (values.length === 0) {
				return true;
			}
			return values.includes(value);
		}
		return false;
	}

	private validateSpecificHeader(
		headerName: string,
		headersReq: IncomingHttpHeaders
	) {
		let headerMsg = { errDetail: '', headersOk: true };

		headerName = headerName || '';

		const activeHeader = this.getHeaderInfo(headerName);
		const keyHeader = activeHeader.key;
		const keyExist = Boolean(headersReq[keyHeader]);
		if (!keyExist) {
			headerMsg = this.setHeaderError('Verifica las cabeceras.');
		}
		if (headerMsg.headersOk) {
			headerMsg.headersOk = this.validateHeaderValue(
				headersReq[keyHeader] as string,
				activeHeader.values
			);

			if (!headerMsg.headersOk) {
				headerMsg = this.setHeaderError('Verifica bien las cabeceras.');
			}
		}

		return headerMsg;
	}

	// TODO: no llamar esto 2 veces

	public validateMandatory(
		headersReq: IncomingHttpHeaders
	): TResult<string, IErrResponse> {
		let headerMsg = { errDetail: '', headersOk: true };
		for (const head of this.mandatoryHeaders) {
			if (!headersReq[head.key]) {
				headerMsg = this.setHeaderError('Verifica las cabeceras');
				break;
			}

			const reqValue = headersReq[head.key] as string;
			if (!this.validateHeaderValue(reqValue, head.values)) {
				headerMsg = this.setHeaderError('Verifica bien las cabeceras');
				break;
			}
		}

		if (headerMsg.headersOk) {
			return resultOk();
		}
		return resultErr({
			detail: headersReq,
			errType: 'headers',
			text: headerMsg.errDetail,
		});
	}

	// Valida headers antes de obtener la info

	public validate(
		headersReq: IncomingHttpHeaders,
		key?: string
	): TResult<string, IErrResponse> {
		try {
			let headerMsg = { errDetail: '', headersOk: true };

			// HeaderMsg = this.validateMandatory(headersReq);

			if (key && headerMsg.headersOk) {
				const specificHeader = this.validateSpecificHeader(key, headersReq);
				headerMsg = specificHeader;
			}

			if (headerMsg.headersOk) {
				return resultOk();
			}
			return resultErr({
				detail: headersReq,
				errType: 'headers',
				text: headerMsg.errDetail,
			});
		} catch (error) {
			return resultErr(error);
		}
	}
}
