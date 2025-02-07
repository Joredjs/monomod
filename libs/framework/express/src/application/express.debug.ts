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
			this.logs.debug({ detail: routes, text: 'Exposed routes:' });
			this.logs.debug({ detail: routes.length, text: 'Total ammount routes:' });
		}
	}

	paths(microApp: IFrameworkMicroApp, req: any, domainInfo: IRoute) {
		if (this.appConfig.debug.paths) {
			this.logs.debug({ text: '*************' });
			this.logs.debug({ text: 'DEBUGGING APP URL' });
			this.logs.debug({ detail: microApp.name, text: 'microAPP' });
			this.logs.debug({ detail: req.url, text: 'URL' });
			this.logs.debug({ detail: domainInfo, text: 'DOMAIN' });
		}
	}

	cors(microApp: IFrameworkMicroApp, origin: any, info: any) {
		if (this.appConfig.debug.cors) {
			this.logs.debug({ text: '*************' });
			this.logs.debug({ text: 'DEBUGGING APP CORS' });
			this.logs.debug({ detail: microApp.name, text: 'microAPP' });
			this.logs.debug({ detail: microApp.cors, text: 'Cors config' });
			this.logs.debug({ detail: origin, text: 'Origin' });
			this.logs.debug({ detail: info, text: 'Info' });
		}
	}
}
