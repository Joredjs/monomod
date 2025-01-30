import { IJSONObject } from './values.interface';
import { IRoute } from './route.interface';
import { IncomingHttpHeaders } from 'http2';

export type TIncomingHttpHeaders = IncomingHttpHeaders;

export type THttpMethods = 'get' | 'post' | 'delete' | 'put';

export enum EHttpMethods {
	'DELETE' = 'delete',
	'GET' = 'get',
	'PATCH' = 'patch',
	'POST' = 'post',
	'PUT' = 'put',
}

export interface ITransactionParams {
	bodyParams?: IJSONObject;
	reqHeader?: IncomingHttpHeaders;
	route?: IRoute;
}
