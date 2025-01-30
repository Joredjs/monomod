import { IMailConfig } from '../interfaces';

export interface IMailClient {
	client: {
		createTransport(config: IMailConfig);
	};
}
export interface IServiceMail {
	send(para: string, asunto: string, cuerpo: string): Promise<boolean>;
}
