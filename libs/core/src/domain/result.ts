/* eslint-disablexxx no-use-before-define */
// Se deshabilita esta regla por la dependencia que se genera al momento de la creación de las interfaces / types

import { TErroresValues, TJSONValue } from './values';

export interface IOKResponse<T> {
	body: T;
	code: number;
}

export interface IErrResponse {
	body?: unknown;
	code: number;
	error: {
		detail: TJSONValue;
		text: string;
	};
}

export interface IErrorMapping {
	detail: TJSONValue;
	errType: TErroresValues;
	saveLog?: boolean;
	showDetail?: boolean;
	text?: string;
}

export class Result<T, E> {
	value: T | E;

	type: 'ok' | 'error';

	constructor(type: 'ok' | 'error', value: T | E) {
		this.type = type;
		this.value = value;
	}

	static resOk<T>(value: T): Result<T, never> {
		return new Result<T, never>('ok', value);
	}

	static resErr<E>(value: E): Result<never, E> {
		return new Result<never, E>('error', value);
	}

	isOk(): this is Result<T, any> {
		return this.type === 'ok';
	}

	isErr(): this is Result<any, E> {
		return this.type === 'error';
	}

	unwrap(): T | E {
		if (this.type === 'ok') {
			return this.value as T;
		}
		return this.value as E;
	}
}

export type TResultOK<T> = Result<IOKResponse<T>, IErrResponse>;
export type TResultErr = Result<never, IErrResponse>;

export interface IResponseResult {
	resultOk<T>(value?: T): TResultOK<T>;
	resultErr(errInfo: IErrorMapping | unknown): TResultErr;
}

