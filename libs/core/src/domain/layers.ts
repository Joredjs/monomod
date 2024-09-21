import {
	IAllUseCases,
	IExternalUseCaseParams,
	IUseCaseParams,
	TExternalUseCases,
} from './useCases';
import { IDefaultToken, ISchema, TDomainGroups } from './rutas';
import { ITransactionParams, TIncomingHttpHeaders } from './http';
import { TFrameworkRequest, TFrameworkResponse } from './frameworks';
import { IDatabase } from './database';
import { IHeadersValues } from './validations';
import { IJSONObject } from './values';

export interface IController<TFwReq, TFwRes> {
	handler(
		req: TFrameworkRequest<TFwReq>,
		res: TFrameworkResponse<TFwRes>,
		next: any
	): void | Promise<void>;
}

export type TControllers<TFwReq, TFwRes> = {
	[index in TDomainGroups]: IController<TFwReq, TFwRes>;
};

export interface IServiceHeader {
	validateToken<IToken extends IDefaultToken>(info: ITransactionParams): IToken;
	validateMandatory(headersReq: TIncomingHttpHeaders): boolean;
	validate(headersReq: TIncomingHttpHeaders, key?: string): boolean;
	validateRutaHeaders(info: ITransactionParams): IHeadersValues;
}

export interface IServices {
	crypto?: {
		encrypt(texto: any): string;
		decrypt(encrypted: string): string;
	};
	db?: { [db: string]: IDatabase };
	encode?: {
		encode(texto: string): string;
		decode(texto: string): string;
	};
	headers?: IServiceHeader;
	mail?: {
		send(para: string, asunto: string, cuerpo: string): Promise<boolean>;
	};
	schema?: {
		validate(schema: ISchema, keys: string[], params: IJSONObject): boolean;
	};
	storage?: {
		upload(key: string, data: string, section?: string): Promise<string>;
		read(key: string, section?: string): Promise<string>;

		// TODO: crear interface para reemplazar IBanner

		list(section?: string): Promise<any[]>;
		remove(key: string, section?: string): void;
	};
	useCases?: {
		requestExternal<TGReturn>(
			params: IExternalUseCaseParams
		): Promise<TGReturn>;
	};
}

export interface IServicesDependencies {
	crypto?: {
		client: any;
	};
	mail?: {
		client: any;
	};
	schema?: {
		client: any;
	};
}

export interface IPort {
	usecaseParams: IUseCaseParams<unknown>;
	getPublicUseCases(): IAllUseCases;
}

export type TPorts = {
	[index in TDomainGroups]?: IPort;
};

export interface IPortParams {
	services?: IServices;
	externalUseCases?: TExternalUseCases;
}
