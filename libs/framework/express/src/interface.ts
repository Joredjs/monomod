import { Express, NextFunction, Request, Response } from 'express';
import { IErrResponse, IOKResponse, TDomainGroups } from '@nxms/core/domain';

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

export interface IExpressResponse {
	status: number;
	resBody: IOKResponse<unknown> | IErrResponse;
	resInstance: TExpressRes;
}

export interface IExpressMicroApp {
	app: Express;
	port: number;
	name: TDomainGroups;
	cors: RegExp[];
	domains: string[];
}

export interface IExpressApps {
	[appName: string]: IExpressMicroApp;
}
