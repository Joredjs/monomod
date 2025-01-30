import {
	ELogLevel,
	IErrorMapping,
	ILogs,
	IPortLogs,
	TOKENS,
} from '../../domain';
import { Injectable } from '../di';

@Injectable(TOKENS.services.logs)
export class ServiceLogs implements IPortLogs {
	#formatLog(infoLog: ILogs): string {
		return `[${infoLog.timestamp.toISOString()}] [${infoLog.level}] ${
			infoLog.traceId ? `[${infoLog.traceId}] ` : ''
		}${infoLog.context ? `[${infoLog.context}] ` : ''}${infoLog.message}`;
	}

	#createLog(level: ELogLevel, message: string, metadata?: unknown): ILogs {
		return {
			context: 'context',
			level,
			message,
			metadata,
			timestamp: new Date(),
		};
	}

	#log(infoLog: ILogs) {
		const message = this.#formatLog(infoLog);
		switch (infoLog.level) {
			case ELogLevel.DEBUG:
				console.debug(message, infoLog.metadata || '');
				break;
			case ELogLevel.ERROR:
				console.error(message, infoLog.metadata);
				break;
			default:
				console.error('UNDEFINED LOG TYPE', message);
				break;
		}
	}

	saveError(errInfo: IErrorMapping) {
		/*  TODO: Use library for saving logs
       TODO: Obtain the params and headers info in the request */

		console.error('------ERROR:---------');
		console.trace(errInfo);
		console.error('----------------------');
	}

	debug(message: string, args: unknown) {
		const infoLog = this.#createLog(ELogLevel.DEBUG, message, args);
		this.#log(infoLog);
	}

	error(message: string, args: unknown) {
		const infoLog = this.#createLog(ELogLevel.ERROR, message, args);
		this.#log(infoLog);
	}
}
