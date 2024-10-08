import {
	DataHeaders,
	EPrivacyLevel,
	IDefaultToken,
	IHeaderData,
	IHeadersInfo,
	IHeadersValues,
	IServices,
	ITransactionParams,
	TIncomingHttpHeaders,
} from '../../domain';
import { normalizeError } from '../responses';

export class ServiceHeaders {
	#headersInfo: IHeadersInfo = {};

	#mandatoryHeaders: IHeaderData[] = [];

	#allHeaders: { [id: string]: IHeaderData } = {};

	#cryptoService: IServices['crypto'];

	constructor(cryptoService: IServices['crypto']) {
		this.#headersInfo = new DataHeaders().headers;
		this.#setHeaders();
		this.#cryptoService = cryptoService;
	}

	// Llena la lista de headers (all y mandatory)

	#setHeaders(): void {
		for (const head in this.#headersInfo) {
			if (this.#headersInfo[head]) {
				const myHeader = this.#headersInfo[head];
				const pref = myHeader.prefix;
				const fullHeader = `${pref.letter}-${pref.prefix}-${myHeader.key}`;
				const values = myHeader.values || [];

				this.#allHeaders[head] = { key: fullHeader, values };

				if (myHeader.mandatory) {
					this.#mandatoryHeaders.push({ key: fullHeader, values });
				}
			}
		}
	}

	// Obtiene el detalle de un header

	#getHeaderInfo(headerName: string) {
		return this.#allHeaders[headerName] || { key: 'fail', values: ['error'] };
	}

	// Obtiene el valor enviado en un header

	#getHeaderValue(headers: TIncomingHttpHeaders, headerName: string): string {
		return (headers[this.#getHeaderInfo(headerName).key] as string) || '';
	}

	#validateListHeaders(
		reqHeader: TIncomingHttpHeaders,
		headers: string[]
	): IHeadersValues {
		try {
			let isValidHeader = true,
				validHeadersResponse = null;
			const headersValues: IHeadersValues = {};

			for (const headerName of headers) {
				validHeadersResponse = this.validate(reqHeader, headerName);

				if (!validHeadersResponse) {
					isValidHeader = false;
					break;
				}
				headersValues[headerName] = this.#getHeaderValue(reqHeader, headerName);
			}

			if (isValidHeader) {
				return headersValues;
			}

			return null;
		} catch (error) {
			throw normalizeError(error);
		}
	}

	#validateTokenInfo<IToken extends IDefaultToken>(
		info: ITransactionParams,
		tokenInfo: IToken
	): IToken {
		const mshora = 3600000;
		const diffHoras = (new Date().getTime() - tokenInfo.valid) / mshora;
		if (diffHoras > 1) {
			throw normalizeError({
				detail: info.reqHeader,
				errType: 'session',
				text: 'Para continuar inicia sesión nuevamente',
			});
		}

		let permisos = false;
		for (const priv of info.ruta.privacy) {
			if (priv === tokenInfo.privacy) {
				permisos = true;
				break;
			}
		}

		if (!permisos) {
			throw normalizeError({
				detail: info.reqHeader,
				errType: 'session',
				text: 'No tienes permiso para realizar esta acción',
			});
		}

		return tokenInfo;
	}

	#decryptToken<IToken extends IDefaultToken>(
		info: ITransactionParams,
		token: string
	): IToken {
		const decryptInfo = this.#cryptoService.decrypt(token);

		if (decryptInfo === 'error') {
			throw normalizeError({
				detail: info.reqHeader,
				errType: 'badInfo',
				text: 'Para continuar debes iniciar sesión correctamente',
			});
		}

		const tokenInfo: IToken = JSON.parse(decryptInfo);
		return this.#validateTokenInfo(info, tokenInfo);
	}

	public validateToken<IToken extends IDefaultToken>(
		info: ITransactionParams
	): IToken {
		try {
			const headerMsg = this.#validateSpecificHeader('token', info.reqHeader);
			if (!headerMsg.headersOk) {
				throw normalizeError({
					detail: info.reqHeader,
					errType: 'session',
					text: 'Para continuar inicia sesión',
				});
			}

			const activeHeader = this.#getHeaderInfo('token');
			const tokenValue = info.reqHeader[activeHeader.key] as string;
			return this.#decryptToken<IToken>(info, tokenValue);
		} catch (error) {
			throw normalizeError(error);
		}
	}

	// Valida headers después de obtener la info

	public validateRutaHeaders(info: ITransactionParams): IHeadersValues {
		try {
			if (!info.reqHeader || !info.ruta?.headers || !info.ruta?.globalHeaders) {
				throw normalizeError({
					errType: 'headers',
					text: 'información incompleta',
				});
			}

			const isPublic = info.ruta.privacy.some(
				(priv) => priv === EPrivacyLevel.public
			);

			if (!isPublic) {
				this.validateToken(info);
			}

			const resGlobalHeaders = this.#validateListHeaders(
				info.reqHeader,
				info.ruta.globalHeaders
			);

			const resLocalHeaders = this.#validateListHeaders(
				info.reqHeader,
				info.ruta.headers
			);

			/* Console.log('GLOBAL', resGlobalHeaders);
			   console.log('LOCAL', resLocalHeaders); */

			return { ...resLocalHeaders, ...resGlobalHeaders };
		} catch (error) {
			throw normalizeError(error);
		}
	}

	#setHeaderError(errDetail: string) {
		return { errDetail, headersOk: false };
	}

	#validateHeaderValue(value: string, values: string[]) {
		if (values) {
			if (values.length === 0) {
				return true;
			}
			return values.includes(value);
		}
		return false;
	}

	#validateSpecificHeader(
		headerName: string,
		headersReq: TIncomingHttpHeaders
	) {
		let headerMsg = { errDetail: '', headersOk: true };

		headerName = headerName || '';

		const activeHeader = this.#getHeaderInfo(headerName);
		const keyHeader = activeHeader.key;
		const keyExist = Boolean(headersReq[keyHeader]);
		if (!keyExist) {
			headerMsg = this.#setHeaderError('Verifica las cabeceras.');
		}
		if (headerMsg.headersOk) {
			headerMsg.headersOk = this.#validateHeaderValue(
				headersReq[keyHeader] as string,
				activeHeader.values
			);

			if (!headerMsg.headersOk) {
				headerMsg = this.#setHeaderError('Verifica bien las cabeceras.');
			}
		}

		return headerMsg;
	}

	validateMandatory(headersReq: TIncomingHttpHeaders): boolean {
		let headerMsg = { errDetail: '', headersOk: true };
		for (const head of this.#mandatoryHeaders) {
			if (!headersReq[head.key]) {
				headerMsg = this.#setHeaderError('Verifica las cabeceras');
				break;
			}

			const reqValue = headersReq[head.key] as string;
			if (!this.#validateHeaderValue(reqValue, head.values)) {
				headerMsg = this.#setHeaderError('Verifica bien las cabeceras');
				break;
			}
		}

		if (headerMsg.headersOk) {
			return true;
		}
		throw normalizeError({
			detail: headersReq,
			errType: 'headers',
			text: headerMsg.errDetail,
		});
	}

	// Valida headers antes de obtener la info

	public validate(headersReq: TIncomingHttpHeaders, key?: string): boolean {
		try {
			let headerMsg = { errDetail: '', headersOk: true };

			if (key && headerMsg.headersOk) {
				const specificHeader = this.#validateSpecificHeader(key, headersReq);
				headerMsg = specificHeader;
			}

			if (headerMsg.headersOk) {
				return true;
			}
			throw normalizeError({
				detail: headersReq,
				errType: 'headers',
				text: headerMsg.errDetail,
			});
		} catch (error) {
			throw normalizeError(error);
		}
	}
}
