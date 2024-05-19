import { IErrResponse, IOKResponse } from '.';

export interface IRequestParams {
	body: any;
	params: any;
	query: any;
	headers: any;
}

export interface IResponseParams {
	locals: any;
}

// TExpressReq

export type TFrameworkRequest<TFwReq> = TFwReq;

// TExpressRes;

export type TFrameworkResponse<TFwRes> = TFwRes;

// IExpressParams;

export type TFrameworkParams<TFwParams> = TFwParams;

// IExpressResponse;

export interface IFrameworkResponseInfo<TFwRes> {
	status: number;
	resBody: IOKResponse<any> | IErrResponse;
	resInstance: TFwRes;
}

export interface IFrameworkService<TFwRes> {
	returnInfo(responseInfo: IFrameworkResponseInfo<TFwRes>): void;
}

export interface IMicroAppConfig {
	addGroupName?: boolean;
	removePrefix?: boolean;
}
