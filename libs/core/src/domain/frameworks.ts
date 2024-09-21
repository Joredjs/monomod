import { IErrResponse, IOKResponse } from './result';

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

export type TFrameworkParams<TFwParams> = TFwParams;

export interface IFrameworkResponseInfo<TFwRes> {
	status: number;
	resBody: IOKResponse<any> | IErrResponse;
	resInstance: TFwRes;
}

export interface IFrameworkService<TFwRes> {
	returnInfo(responseInfo: IFrameworkResponseInfo<TFwRes>): void;
}

export interface IMicroServiceConfig {
	addGroupName?: boolean;
	removePrefix?: boolean;
	debug?: {
		cors?: boolean;
		paths?: boolean;
		routes?: boolean;
	};
}
