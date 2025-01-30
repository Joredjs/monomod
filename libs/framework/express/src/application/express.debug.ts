import {
	IFrameworkMicroApp,
	IMicroApp,
	IPortFrameworkDebug,
	IPortLogs,
	IRoute,
	IServerConfig,
	TOKENS,
} from '@monomod/core/domain';
import { Inject, Injectable } from '@monomod/core/application';

@Injectable(TOKENS.framework.IFrameworkDebug)
export class ExpressDebug implements IPortFrameworkDebug {
	@Inject(TOKENS.services.logs) private logs: IPortLogs;

	@Inject(TOKENS.server.config) private appConfig: IServerConfig;

	routes(apps: IMicroApp) {
		if (this.appConfig.debug.routes) {
			const routes = [];
			for (const app in apps) {
				if (apps[app]) {
					// eslint-disable-next-line no-underscore-dangle
					apps[app].app._router.stack.forEach((route) => {
						if (route.route) {
							if (route.route.path !== '*') {
								routes.push(route.route);
							}
						}
					});
				}
			}
			this.logs.debug('Exposed routes:', routes);
			this.logs.debug('Total ammount routes:', routes.length);
		}
	}

	paths(microApp: IFrameworkMicroApp, req: any, domainInfo: IRoute) {
		if (this.appConfig.debug.paths) {
			this.logs.debug('******************');
			this.logs.debug('DEBUGGING APP URL');
			this.logs.debug('microAPP:', microApp.name);
			this.logs.debug('URL:', req.url);
			this.logs.debug('INFO:', domainInfo);
		}
	}

	cors(microApp: IFrameworkMicroApp, origin: any, info: any) {
		if (this.appConfig.debug.cors) {
			this.logs.debug('******************');
			this.logs.debug('DEBUGGING APP CORS');
			this.logs.debug('microAPP:', microApp.name);
			this.logs.debug('Cors config:', microApp.cors);
			this.logs.debug('Origin:', origin);
			this.logs.debug('Info:', info);
		}
	}
}
