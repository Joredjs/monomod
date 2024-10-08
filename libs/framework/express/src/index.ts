import {
	IExpressApps,
	IExpressParams,
	TExpressReq,
	TExpressRes,
} from './interface';
import {
	IMicroServiceConfig,
	IRouteGroup,
} from '@nxms/core/domain';
import { ApiCore } from '@nxms/gateway';
import { ExpressFactory } from './factory';
import { ExpressService } from './service';
import { normalizeError } from '@nxms/core/application';

export class ExpressFramework {
	#appConfig: IMicroServiceConfig;

	#service: ExpressService;

	#appFactory: ExpressFactory;

	constructor(appConfig: IMicroServiceConfig) {
		this.#appConfig = appConfig;
		this.#service = new ExpressService();
		this.#appFactory = new ExpressFactory(this.#service);
	}

	// TODO: move al debugs to a same file

	#debugPaths(apps: IExpressApps) {
		const rutass = [];
		for (const app in apps) {
			if (apps[app]) {
				// eslint-disable-next-line no-underscore-dangle
				apps[app].app._router.stack.forEach((ruta) => {
					if (ruta.route) {
						if (ruta.route.path !== '*') {
							rutass.push(ruta.route);
						}
					}
				});
			}
		}
		console.debug('Rutas que se exponen:', rutass);
		console.debug('Rutas totales:', rutass.length);
	}

	getServices(): IExpressApps {
		const apps: IExpressApps = {};

		try {
			const apiCore = new ApiCore<IExpressParams, TExpressReq, TExpressRes>(
				this.#service
			);

			const microServices: IRouteGroup<IExpressParams>[] =
				apiCore.getMicroServices();

			microServices.forEach((routeGroup) => {
				const appName = `${routeGroup.group}App`;
				apps[appName] = this.#appFactory.createMicroApp(
					routeGroup,
					this.#appConfig
				);
			});

			if (this.#appConfig.debug.routes) {
				this.#debugPaths(apps);
			}
		} catch (error) {
			throw normalizeError(error);
		}

		return apps;
	}
}
