export const TOKENS = {
	framework: {
		IExpressAdapter: Symbol('IExpressAdapter'),
		IExpressDebug: Symbol('IExpressDebug'),
		IExpressFactory: Symbol('IExpressFactory'),
		IExpressMiddleware: Symbol('IExpressMiddleware'),
		IExpressService: Symbol('IExpressService'),
	},
	server: {
		IServer: Symbol('IServer'),
		IServerController: Symbol('IServerController'),
		config: Symbol('config'),
	},
	services: {
		IServiceI18n: Symbol('IServiceI18n'),
		IServiceMessages: Symbol('IServiceMessages'),
	},
};
