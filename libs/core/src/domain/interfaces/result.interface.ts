/* eslint-disablexxx no -use -before-define */
// Se deshabilita esta regla por la dependencia que se genera al momento de la creación de las interfaces / types

import { TErroresValues, TJSONValue } from './values.interface';
import { Result } from '../entities';

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
	detail: any;
	errType: TErroresValues;
	saveLog?: boolean;
	showDetail?: boolean;
	text?: string;
}

export type TResultOK<T> = Result<IOKResponse<T>, IErrResponse>;
export type TResultErr = Result<never, IErrResponse>;
