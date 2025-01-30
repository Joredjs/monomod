export enum ELogLevel {
	DEBUG = 'debug',
	INFO = 'info',
	WARN = 'warn',
	ERROR = 'error',
	FATAL = 'fatal',
}

export interface ILogs {
	timestamp: Date;
	level: ELogLevel;
	message: string;
	context?: string;
	metadata?: unknown;
	traceId?: string;
}
