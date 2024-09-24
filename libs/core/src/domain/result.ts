/* eslint-disable no-use-before-define */
// Se deshabilita esta regla por la dependencia que se genera al momento de la creación de las interfaces / types

import { IError, TErroresValues } from './values';
import { domainKeys } from './keys';


/** Represents a failed computation.*/

interface ILeft<T, E> {
	/** * Returns true if the Result is successful, false otherwise.*/

	isOk(this: TResult<T, E>): this is IRight<T, E>;

	/** * Returns true if the Result is an error, false otherwise.*/

	isErr(this: TResult<T, E>): this is ILeft<T, E>;
	type: 'error';

	/** * Returns the value of the Result if it is successful, otherwise throws an error.*/

	unwrap(): IErrResponse;

	value: IErrResponse;
}

/** Represents a successful computation.*/

interface IRight<T, E> {
	/** * Returns true if the Result is successful, false otherwise.*/

	isOk(this: TResult<T, E>): this is IRight<T, E>;

	/** * Returns true if the Result is an error, false otherwise.*/

	isErr(this: TResult<T, E>): this is ILeft<T, E>;
	type: 'ok';

	/** * Returns the value of the Result.*/

	unwrap(): IOKResponse<T>;

	value: IOKResponse<T>;
}

export type TResult<T, E> = ILeft<T, E> | IRight<T, E>;

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

// TODO: reults not dependent on domainKeys

export function resultOk<T>(value?: T): TResult<T, IErrResponse> {
	const res: IOKResponse<any> = {
		body: value || 'OK',
		code: domainKeys.httpCodes[200].code,
	};
	return {
		isErr: () => false,
		isOk: () => true,
		type: 'ok',
		unwrap: () => res,
		value: res,
	};
}

interface IErrorMap {
	errType: TErroresValues;
	text?: string;
	detail?: any;
	showDetail?: boolean;
	saveLog?: boolean;
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

export function resultErr(errInfo: IErrorMap): TResult<any, IErrResponse> {
	errInfo.saveLog =
		typeof errInfo.saveLog === 'undefined' ? true : errInfo.saveLog;
	errInfo.showDetail =
		typeof errInfo.showDetail === 'undefined' ? true : errInfo.showDetail;

	const res: IErrResponse = setErrorInfo(errInfo);

	saveLog(errInfo);

	return {
		isErr: () => true,
		isOk: () => false,
		type: 'error',
		unwrap: () => res,
		value: res,
	};
}
