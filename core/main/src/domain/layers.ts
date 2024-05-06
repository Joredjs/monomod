import { TFrameworkRequest, TFrameworkResponse } from "./frameworks";
import { IDatabases } from "./database";
import { TDomainGroups } from "./rutas";

export interface IController<TFwReq, TFwRes> {
	handler(
		req: TFrameworkRequest<TFwReq>,
		res: TFrameworkResponse<TFwRes>,
		next: any
	): void | Promise<void>;

	// Handler: TFrameworkParams<TFwParams>;

	// GetInstance(appValidations: IAppValidations): any;

}

export type TControllers<TFwReq, TFwRes> = {
	[index in TDomainGroups]: IController<TFwReq, TFwRes>;
};

// TODO: generar interface no any de services

export interface IAppServices {
	crypto?: {
		encrypt(texto: any): string;
		decrypt(encrypted: string): string;
	};
	db?: { [db: string]: IDatabases };
	encode?: {
		encode(texto: string): string;
		decode(texto: string): string;
	};
	headers?: any;
	mail?: {
		send(para: string, asunto: string, cuerpo: string): Promise<any>;
	};
}
export interface IPort {
	appServices: IAppServices;
}

export type TPorts = {
	[index in TDomainGroups]: IPort;
};
