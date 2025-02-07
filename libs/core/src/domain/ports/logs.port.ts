import { IErrorMapping, ILogsMapping } from '../interfaces';

export interface IPortLogs {
	saveError(errInfo: IErrorMapping): void;
	debug(logInfo: ILogsMapping): void;
	error(logInfo: ILogsMapping): void;
}
