import { Express, NextFunction, Request, Response } from 'express';
import {
	ICorsInfo,
	IDomainGroup,
	IErrResponse,
	IMicroAppConfig,
	IOKResponse,
	IRoute,
	TDomainGroups,
	TVersion,
} from '@monomod/core/domain';

export type TExpressReq = Request;
export type TExpressRes = Response;
export type TExpressNext = NextFunction;

export interface IExpressParams {
	(
		req: TExpressReq,
		res: TExpressRes,
		next: TExpressNext
	): void | Promise<void>;
}

export interface IExpressParamsErr {
	(
		err: Error,
		req: TExpressReq,
		res: TExpressRes,
		next: TExpressNext
	): void | Promise<void>;
}

export interface IExpressResponse {
	status: number;
	resBody: IOKResponse<unknown> | IErrResponse;
	resInstance: TExpressRes;
}

export interface IExpressMicroApp {
	app: Express;
	cors: ICorsInfo;
	httpPort: number;
	name: TDomainGroups;
}

export interface IExpressApps {
	[appName: string]: IExpressMicroApp;
}

export interface IExpressDebug {
	routes(apps: IExpressApps): void;
	paths(microApp: IExpressMicroApp, req: any, domainInfo: IRoute): void;
	cors(microApp: IExpressMicroApp, origin: any, info: any): void;
}

export interface IExpressService {
	returnInfo(responseInfo: IExpressResponse): void;
}

export interface IExpressMiddleware {
	notFound(): IExpressParams;
	setDomainInfo(
		domainGroup: IDomainGroup,
		microApp: IExpressMicroApp,
		domainInfo: IRoute,
		version: TVersion
	): IExpressParams;
	setCors(microApp: IExpressMicroApp): IExpressParams;
	errorHandler(): IExpressParamsErr;
}

export interface IExpressFactory {
	createMicroApp(domainGroup: IDomainGroup): IExpressMicroApp;
	getService(): IExpressService;
	getDebug(): IExpressDebug;
	getConfig(): IMicroAppConfig;
}
