import {
	IAllUseCases,
	IUseCaseParams,
	TExternalUseCases,
	TFrameworkRequest,
	TFrameworkResponse,
	IDatabases,
	TDomainGroups,
	TIncomingHttpHeaders,
} from '.';

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
	validateToken<IToken>(reqHeader: TIncomingHttpHeaders): IToken;
}

export interface IServices {
	crypto?: {
		encrypt(texto: any): string;
		decrypt(encrypted: string): string;
	};
	db?: { [db: string]: IDatabases };
	encode?: {
		encode(texto: string): string;
		decode(texto: string): string;
	};
	headers?: IServiceHeader;
	mail?: {
		send(para: string, asunto: string, cuerpo: string): Promise<boolean>;
	};
	storage?: {
		upload(key: string, data: string): Promise<string>;
		read(key: string): Promise<string>;

		// TODO: crear interface para reemplazar IBanner

		list(): Promise<any[]>;
	};
}
export interface IPort {
	usecaseParams: IUseCaseParams<unknown>;
	getPublicUseCases(): IAllUseCases;
}

export type TPorts = {
	[index in TDomainGroups]: IPort;
};

export interface IPortParams {
	services?: IServices;
	externalUseCases?: TExternalUseCases;
}
