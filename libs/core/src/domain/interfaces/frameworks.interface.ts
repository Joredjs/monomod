import { IErrResponse, IOKResponse } from './result.interface';
import { ICorsInfo } from './route.interface';
import { TDomainGroups } from '../const';

export interface IRequestParams {
	body: any;
	params: any;
	query: any;
	headers: any;
}

export interface IResponseParams {
	locals: any;
}

export type TFrameworkRequest<TFwReq> = TFwReq;

export type TFrameworkResponse<TFwRes> = TFwRes;

export type TFrameworkNext<TFwNext> = TFwNext;

export type TFrameworkParams<TFwParams> = TFwParams;

export interface IFrameworkResponseInfo<TFwRes> {
	status: number;
	resBody: IOKResponse<any> | IErrResponse;
	resInstance: TFwRes;
}

export interface IFrameworkParams<TFwReq, TFwRes, TFwNext> {
	(
		req: TFrameworkRequest<TFwReq>,
		res: TFrameworkResponse<TFwRes>,
		next: TFrameworkNext<TFwNext>
	): void | Promise<void>;
}

export interface IFrameworkParamsErr<TFwReq, TFwRes, TFwNext> {
	(
		err: Error,
		req: TFrameworkRequest<TFwReq>,
		res: TFrameworkResponse<TFwRes>,
		next: TFrameworkNext<TFwNext>
	): void | Promise<void>;
}

export interface IFrameworkMicroApp {
	app: any;
	cors: ICorsInfo;
	httpPort: number;
	name: TDomainGroups;
}

export interface IMicroApp {
	[appName: string]: IFrameworkMicroApp;
}
