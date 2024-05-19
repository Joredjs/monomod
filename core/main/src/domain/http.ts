import {
	IErrResponse,
	IOKResponse,
	IJSONObject,
	IRuta,
	IUseCaseParams,
} from '.';
import { IncomingHttpHeaders } from 'http2';

export type TIncomingHttpHeaders = IncomingHttpHeaders;

export type THttpMethods = 'get' | 'post' | 'delete' | 'put';

export enum EHttpMethods {
	'GET' = 'get',
	'POST' = 'post',
	'PUT' = 'put',
	'DELETE' = 'delete',
}

export interface ITransactionParams {
	bodyParams?: IJSONObject;
	reqHeader?: TIncomingHttpHeaders;
	ruta?: IRuta;
}

export interface ITransactionValid extends ITransactionParams {
	useCase: (
		info?: ITransactionParams
	) => Promise<IOKResponse<unknown> | IErrResponse>;
	usecaseParams?: IUseCaseParams<unknown>;
}
