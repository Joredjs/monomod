import {
	IDomainGroup,
	IFrameworkMicroApp,
	IFrameworkParams,
	IFrameworkParamsErr,
	IFrameworkResponseInfo,
	IMicroApp,
	IRoute,
} from '../interfaces';
import { TVersion } from '../const';

export interface IPortFrameworkAdapter {
	getApps(): any;
}

export interface IPortFrameworkService<TFwRes> {
	returnInfo(responseInfo: IFrameworkResponseInfo<TFwRes>): void;
}

export interface IPortFrameworkDebug {
	routes(apps: IMicroApp): void;
	paths(microApp: IFrameworkMicroApp, req: any, domainInfo: IRoute): void;
	cors(microApp: IFrameworkMicroApp, origin: any, info: any): void;
}

export interface IPortFrameworkFactory {
	createMicroApp(domainGroup: IDomainGroup): IFrameworkMicroApp;
	/* GetService(): IPortFrameworkService<TFwRes>;
	   getDebug(): IPortFrameworkDebug;
	   getConfig(): IMicroAppConfig; */
}

export interface IPortFrameworkMiddleware<TFwReq, TFwRes, TFwNext> {
	notFound(): IFrameworkParams<TFwReq, TFwRes, TFwNext>;
	setDomainInfo(
		domainGroup: IDomainGroup,
		microApp: IFrameworkMicroApp,
		domainInfo: IRoute,
		version: TVersion
	): IFrameworkParams<TFwReq, TFwRes, TFwNext>;
	setCors(
		microApp: IFrameworkMicroApp
	): IFrameworkParams<TFwReq, TFwRes, TFwNext>;
	errorHandler(): IFrameworkParamsErr<TFwReq, TFwRes, TFwNext>;
}
