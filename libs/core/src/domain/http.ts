import { IErrResponse, IOKResponse } from './result';
import { IJSONObject } from './values';
import { IRoute } from './route';
import { IUseCaseParams } from './useCases';
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
	reqHeader?: IncomingHttpHeaders;
	route?: IRoute;
}

export interface ITransactionValid extends ITransactionParams {
	handler: (
		info?: ITransactionParams
	) => Promise<IOKResponse<unknown> | IErrResponse>;
	usecaseParams?: IUseCaseParams<unknown>;
}
