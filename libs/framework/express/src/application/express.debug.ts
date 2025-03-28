import {
	IFrameworkMicroApp,
	IMicroApp,
	IPortFrameworkDebug,
	IPortLogs,
	IRoute,
	IServerConfig,
	SYMBOLS,
} from '@monomod/core/domain';
import { Inject, Injectable } from '@monomod/core/application';

@Injectable(SYMBOLS.framework.IFrameworkDebug)
export class ExpressDebug implements IPortFrameworkDebug {
	readonly #serverConfig: IServerConfig;

	readonly #logs: IPortLogs;

	constructor(
		@Inject(SYMBOLS.server.IServerConfig) serverConfig: IServerConfig,
		@Inject(SYMBOLS.services.logs) logs: IPortLogs
	) {
		this.#serverConfig = serverConfig;
		this.#logs = logs;
	}

	routes(apps: IMicroApp) {
		if (this.#serverConfig.debug.routes) {
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
			this.#logs.debug({ detail: routes, text: 'Exposed routes:' });
			this.#logs.debug({ detail: routes.length, text: 'Total ammount routes:' });
		}
	}

	paths(microApp: IFrameworkMicroApp, req: any, domainInfo: IRoute) {
		if (this.#serverConfig.debug.paths) {
			this.#logs.debug({ text: '*************' });
			this.#logs.debug({ text: 'DEBUGGING APP URL' });
			this.#logs.debug({ detail: microApp.name, text: 'microAPP' });
			this.#logs.debug({ detail: req.url, text: 'URL' });
			this.#logs.debug({ detail: domainInfo, text: 'DOMAIN' });
		}
	}

	cors(microApp: IFrameworkMicroApp, origin: any, info: any) {
		if (this.#serverConfig.debug.cors) {
			this.#logs.debug({ text: '*************' });
			this.#logs.debug({ text: 'DEBUGGING APP CORS' });
			this.#logs.debug({ detail: microApp.name, text: 'microAPP' });
			this.#logs.debug({ detail: microApp.cors, text: 'Cors config' });
			this.#logs.debug({ detail: origin, text: 'Origin' });
			this.#logs.debug({ detail: info, text: 'Info' });
		}
	}
}
