import {
	IAllUseCases,
	IServiceUseCase,
	IUseCaseParams,
	TExternalUseCases,
} from './useCases.port';
import {
	IDatabaseClient,
	ISchemaClient,
	IStorageClient,
	TFrameworkRequest,
	TFrameworkResponse,
} from '../interfaces';
import { IMailClient, IServiceMail } from './mail.port';
import { IPortCrypto, IPortCryptoClient } from './crypto.port';
import { IDatabaseAdapter } from './database.port';
import { IPortResponseResult } from './result.port';
import { IServiceHeader } from './headers.port';
import { IServiceSchema } from './schema.port';
import { IServiceStorage } from './storage.port';
import { TDomainGroups } from '../const';

export interface IController<TFwReq, TFwRes> {
	handler(
		req: TFrameworkRequest<TFwReq>,
		res: TFrameworkResponse<TFwRes>,
		next: any
	): void | Promise<void>;
}

export interface IPort {
	usecaseParams: IUseCaseParams<unknown>;
	getPublicUseCases(): IAllUseCases;
}

export type TControllers<TFwReq, TFwRes> = {
	[index in TDomainGroups]?: IController<TFwReq, TFwRes>;
};

export type TPorts = {
	[index in TDomainGroups]?: IPort;
};

export interface IServices {
	crypto?: IPortCrypto;
	db?: IDatabaseAdapter;
	encode?: {
		encode(texto: string): string;
		decode(texto: string): string;
	};
	headers?: IServiceHeader;
	mail?: IServiceMail;
	schema?: IServiceSchema;
	storage?: IServiceStorage;
	useCases?: IServiceUseCase;
}

export interface IServicesDependencies {
	db?: {
		yourdbclientname: IDatabaseClient;
	};
	crypto?: {
		client: IPortCryptoClient;
	};
	mail?: {
		client: IMailClient;
	};
	schema?: {
		client: ISchemaClient;
	};
	storage?: {
		client: IStorageClient;
	};
}

export interface IPortParams {
	externalUseCases: TExternalUseCases;
	response: IPortResponseResult;
	services: IServices;
}
