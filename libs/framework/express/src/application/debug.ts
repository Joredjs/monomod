import {
	IExpressApps,
	IExpressDebug,
	IExpressMicroApp,
} from '../domain/interface';
import { IRoute } from '@monomod/core/domain';

export class ExpressDebug implements IExpressDebug {
	routes(apps: IExpressApps) {
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
		console.debug('Exposed routes:', routes);
		console.debug('Total ammount routes:', routes.length);
	}

	paths(microApp: IExpressMicroApp, req: any, domainInfo: IRoute) {
		console.debug('******************');
		console.debug('DEBUGGING APP URL');
		console.debug('microAPP:', microApp.name);
		console.debug('URL:', req.url);
		console.debug('INFO:', domainInfo);
	}

	cors(microApp: IExpressMicroApp, origin: any, info: any) {
		console.debug('******************');
		console.debug('DEBUGGING APP CORS');
		console.debug('microAPP:', microApp.name);
		console.debug('Cors config:', microApp.cors);
		console.debug('Origin:', origin);
		console.debug('Info:', info);
	}
}
