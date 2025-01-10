import { TFrameworkRequest, TFrameworkResponse } from './frameworks';
import {
	crypto,
	database,
	headers,
	mail,
	schema,
	storage,
	useCases,
} from './services/';
import { IResponseResult } from './result';
import { TDomainGroups } from './modules';

export interface IController<TFwReq, TFwRes> {
	handler(
		req: TFrameworkRequest<TFwReq>,
		res: TFrameworkResponse<TFwRes>,
		next: any
	): void | Promise<void>;
}

export type TControllers<TFwReq, TFwRes> = {
	[index in TDomainGroups]?: IController<TFwReq, TFwRes>;
};

export interface IServices {
	crypto?: crypto.IServiceCrypto;
	db?: database.IDatabaseAdapter;
	encode?: {
		encode(texto: string): string;
		decode(texto: string): string;
	};
	headers?: headers.IServiceHeader;
	mail?: mail.IServiceMail;
	schema?: schema.IServiceSchema;
	storage?: storage.IServiceStorage;
	useCases?: useCases.IServiceUseCase;
}

export interface IServicesDependencies {
	db?: {
		yourdbclientname: database.IDatabaseClient;
	};
	crypto?: {
		client: crypto.ICryptoClient;
	};
	mail?: {
		client: mail.IMailClient;
	};
	schema?: {
		client: schema.ISchemaClient;
	};
	storage?: {
		client: storage.IStorageClient;
	};
}

export interface IPort {
	usecaseParams: useCases.IUseCaseParams<unknown>;
	getPublicUseCases(): useCases.IAllUseCases;
}

export type TPorts = {
	[index in TDomainGroups]?: IPort;
};

export interface IPortParams {
	externalUseCases: useCases.TExternalUseCases;
	response: IResponseResult;
	services: IServices;
}


export interface IContainer {
	register(token: symbol, instance: any, isConstant: boolean): void;
	resolve(token: symbol): any;
	hasRegistration(token: symbol): boolean;
}
