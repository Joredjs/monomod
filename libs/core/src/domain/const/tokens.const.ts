export const TOKENS = {
	/* Dependencies: {
	   	// core: Symbol('CoreDependenciesFactory'),
	   	// express: Symbol('ExpressDependenciesFactory'),
	   	// serverLocal: Symbol('IPortDependenciesServerLocal'),
	   }, */
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
		ServiceLogsServer: Symbol('ServiceLogsServer'),
		ServiceMessagesServer: Symbol('ServiceMessagesServer'),
		config: Symbol('configServer'),
	},
	services: {
		I18n: Symbol('IPortI18n'),
		errors: Symbol('IPortErrors'),
		logs: Symbol('IPortLogs'),
	},
};
