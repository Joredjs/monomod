import {
	ELogLevel,
	IErrorMapping,
	ILogsEntry,
	ILogsMapping,
	IPortLogs,
	IPortMessages,
	SYMBOLS,
} from '../../domain';
import { Injectable } from '../di';

@Injectable(SYMBOLS.services.logs)
export class ServiceLogs implements IPortLogs {
	constructor(private messages: IPortMessages) {}

	#formatLog(infoLog: ILogsEntry): string {
		return `[${infoLog.timestamp.toISOString()}] [${infoLog.level}] ${
			infoLog.traceId ? `[${infoLog.traceId}] ` : ''
		}${infoLog.context ? `[${infoLog.context}] ` : ''}${infoLog.message}`;
	}

	#getMessage(logInfo: ILogsMapping): string {
		// TODO: no dejar quemado
		let message = 'No message specified';
		if (logInfo.messageKey) {
			message = this.messages.getMessage(
				logInfo.messageKey,
				logInfo.messageParams || []
			);
		} else {
			message = logInfo.text || 'Message bad configured';
		}
		return message;
	}

	#createLog(level: ELogLevel, logInfo: ILogsMapping): ILogsEntry {
		const context = this.messages?.getContext() || 'nocontext';
		const message = this.#getMessage(logInfo);

		/*  TODO: add trace id??
			   TODO: add context always */
		return {
			context,
			level,
			message,
			metadata: logInfo.detail,
			timestamp: new Date(),
		};
	}

	#log(infoLog: ILogsEntry) {
		// TODO: implement log transport (elastic, console, bd, file, etc)
		const message = this.#formatLog(infoLog);
		switch (infoLog.level) {
			case ELogLevel.DEBUG:
				console.debug(message, infoLog.metadata || '');
				break;
			case ELogLevel.ERROR:
				console.error(message, infoLog.metadata || '');
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

	debug(logInfo: ILogsMapping) {
		const log = this.#createLog(ELogLevel.DEBUG, logInfo);
		this.#log(log);
	}

	error(logInfo: ILogsMapping) {
		const log = this.#createLog(ELogLevel.ERROR, logInfo);
		this.#log(log);
	}
}
