export enum ELogLevel {
	DEBUG = 'debug',
	INFO = 'info',
	WARN = 'warn',
	ERROR = 'error',
	FATAL = 'fatal',
}

export interface ILogsEntry {
	timestamp: Date;
	level: ELogLevel;
	message: string;
	context?: string;
	metadata?: unknown;
	traceId?: string;
}

export interface ILogsMapping {
	detail?: unknown;
	messageKey?: string;
	messageParams?: unknown[];
	text?: string;
}
