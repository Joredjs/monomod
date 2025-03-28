export const SYMBOLS = {
	framework: {
		IFrameworkAdapter: Symbol('IFrameworkAdapter'),
		IFrameworkDebug: Symbol('IFrameworkDebug'),
		IFrameworkFactory: Symbol('IFrameworkFactory'),
		IFrameworkMiddleware: Symbol('IFrameworkMiddleware'),
		IFrameworkService: Symbol('IFrameworkService'),
	},
	server: {
		IPortServerAdapter: Symbol('IPortServerAdapter'),
		IPortServerController: Symbol('IPortServerController'),
		IServerConfig: Symbol('IServerConfig'),
		ServiceLogsServer: Symbol('ServiceLogsServer'),
		ServiceMessagesServer: Symbol('ServiceMessagesServer'),
	},
	services: {
		I18n: Symbol('IPortI18n'),
		errors: Symbol('IPortErrors'),
		logs: Symbol('IPortLogs'),
	},
};
