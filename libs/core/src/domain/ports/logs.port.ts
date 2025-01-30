import { IErrorMapping } from '../interfaces';

export interface IPortLogs {
	saveError(errInfo: IErrorMapping): void;
	debug(message: string, ...args: any): void;
	error(message: string, ...args: any): void;
}
