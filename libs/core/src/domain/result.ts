/* eslint-disable no-use-before-define */
// Se deshabilita esta regla por la dependencia que se genera al momento de la creación de las interfaces / types

import { IError, TErroresValues } from './values';
import { domainKeys } from './keys';

class Result<T, E> {
	#value: T | E;

	#type: 'ok' | 'error';

	constructor(type: 'ok' | 'error', value: T | E) {
		this.#type = type;
		this.#value = value;
	}

	static resOk<T>(value: T): Result<T, any> {
		return new Result('ok', value);
	}

	static resErr<E>(value: E): Result<any, E> {
		return new Result('error', value);
	}

	isOk(): this is Result<T, any> {
		return this.#type === 'ok';
	}

	isErr(): this is Result<any, E> {
		return this.#type === 'error';
	}

	unwrap(): T | E {
		if (this.#type === 'ok') {
			return this.#value as T;
		}
		return this.#value as E;
	}
}

export interface IOKResponse<T> {
	body: T;
	code: number;
}

export interface IErrResponse {
	body?: any;
	code: number;
	error: {
		detail: any;
		text: string;
	};
}

interface IErrorMap {
	detail?: any;
	errType: TErroresValues;
	saveLog?: boolean;
	showDetail?: boolean;
	text?: string;
}

function setErrorInfo(errInfo: IErrorMap): IErrResponse {
	let res: IErrResponse = {
		code: 500,
		error: {
			detail: 'Error no mapeado',
			text: 'Error sin definir',
		},
	};

	if ('code' in errInfo && 'error' in errInfo) {
		// Si entra por acá es pq viene un IErrResponse
		const myerror = errInfo as any;
		res = {
			code: myerror.code as number,
			error: {
				detail: myerror.error.detail,
				text: myerror.error.text,
			},
		};
	} else {
		errInfo = setError(errInfo);

		const msj: IError = domainKeys.errores[errInfo.errType];

		let errDetail = '';
		if (errInfo.detail) {
			errDetail = errInfo.detail;
			if (errInfo.detail.code) {
				errDetail = errInfo.detail.code;
			}
		}

		res = {
			code: msj.code,
			error: {
				detail: errInfo.showDetail
					? errDetail
					: 'No está permitido ver el detalle del error',

				text: errInfo.text || msj.text,
			},
		};
	}

	return res;
}

// TODO: reults not dependent on domainKeys

export function resultOk<T>(value?: T): Result<IOKResponse<T>, IErrResponse> {
	const res: IOKResponse<any> = {
		body: value || 'OK',
		code: domainKeys.httpCodes[200].code,
	};
	return Result.resOk(res);
}

export function resultErr(errInfo: IErrorMap): Result<any, IErrResponse> {
	errInfo.saveLog =
		typeof errInfo.saveLog === 'undefined' ? true : errInfo.saveLog;
	errInfo.showDetail =
		typeof errInfo.showDetail === 'undefined' ? true : errInfo.showDetail;

	const res: IErrResponse = setErrorInfo(errInfo);

	saveLog(errInfo);

	return Result.resErr(res);
}

// TODO: volver clase
function saveLog(errInfo: IErrorMap) {
	if (errInfo && errInfo.saveLog) {
		/*  TODO: manejar LOGS
       TODO: Guardar info del req y del header */

		console.error('------ERROR:---------');
		console.trace(errInfo);
		console.error('----------------------');
	}
}

export function setError(errInfo: IErrorMap) {
	if (!errInfo.errType && !errInfo.detail) {
		// Si entra acá es porque el error viene sin dormatear cprrectamente
		const oldErr = errInfo;
		errInfo = {
			detail:
				typeof oldErr === 'string'
					? oldErr
					: JSON.stringify(oldErr, Object.getOwnPropertyNames(oldErr)),
			errType: 'nocatch',
		};
	}

	return errInfo;
}
