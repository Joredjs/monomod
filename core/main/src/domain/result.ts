/* eslint-disable no-use-before-define */
// Se deshabilita esta regla por la dependencia que se genera al momento de la creación de las interfaces / types

import { IError, TErroresValues } from "./values";
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

//TODO: reults not dependent on domainKeys

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
}
export function resultErr(errInfo: IErrorMap): TResult<any, IErrResponse> {
	let res: IErrResponse = {
		code: 500,
		error: {
			detail: '',
			text: 'Error sin definir',
		},
	};
	if ('code' in errInfo && 'error' in errInfo) {
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
				detail: errDetail,

				/* Detail: errInfo.showDetail
				   	? errDetail
				   	: 'No está permitido ver el detalle del error', */

				text: errInfo.text || msj.text,
			},
		};
	}

	if (errInfo) {
		/*  TODO: manjear LOGS
       TODO: Guardar info del req y del header */

		// Console.error("------ERROR:---------");

		console.trace(errInfo);

		// Console.error("----------------------");
	}

	// TODO: mejorar objetos de error para traer el detalle

	return {
		isErr: () => true,
		isOk: () => false,
		type: 'error',
		unwrap: () => res,
		value: res,
	};
}

export function setError(errInfo: IErrorMap) {
	if (!errInfo.errType && !errInfo.detail) {
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
