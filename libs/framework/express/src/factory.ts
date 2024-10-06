import { IExpressMicroApp, IExpressParams } from './interface';
import {
	IMicroServiceConfig,
	IRouteGroup,
	domainKeys,
} from '@nxms/core/domain';
import { ExpressMiddleware } from './middleware';
import { ExpressService } from './service';
import express from 'express';

export class ExpressFactory {
	#middleware: ExpressMiddleware;

	#service: ExpressService;

	constructor(service: ExpressService) {
		this.#middleware = new ExpressMiddleware();
		this.#service = service;
	}

	#setTestPath(
		microApp: IExpressMicroApp,
		groupName: string
	): IExpressMicroApp {
		microApp.app.get(`${groupName}/test`, (req, res) => {
			res
				.status(domainKeys.httpCodes[200].code)
				.send(`Servicio de prueba para ${microApp.name}`);
		});

		microApp.app.get(`${groupName}/error`, (req, res) => {
			throw new Error('Error de prueba');
		});

		microApp.app.all('*', this.#middleware.notFound(this.#service));
		return microApp;
	}

	#setPaths(
		routeGroup: IRouteGroup<IExpressParams>,
		microApp: IExpressMicroApp,
		appConfig: IMicroServiceConfig
	): IExpressMicroApp {
		const defaultHandler = (req, res) => {
			res
				.status(domainKeys.httpCodes[400].code)
				.send('No existe configuración para esta ruta');
		};

		const groupName = `${appConfig.addGroupName ? `/${routeGroup.group}` : ''}`;

		routeGroup.paths.forEach((routeInfo) => {
			const handler = routeGroup.handler || defaultHandler;
			routeGroup.versions.forEach((version) => {
				// Apply middleware and set locals for each route and version
				microApp.app[routeInfo.method](
					`${groupName}/${version}/${routeInfo.path}`,
					this.#middleware.setRouteInfo({
						appConfig,
						microApp,
						routeGroup,
						routeInfo,
						version,
					}),
					handler
				);
			});
		});
		return microApp;
	}

	createMicroApp(
		routeGroup: IRouteGroup<IExpressParams>,
		appConfig: IMicroServiceConfig
	) {
		const app = express();
		app.use(express.json({ limit: appConfig.bodyLimit }));

		let myApp: IExpressMicroApp = {
			app,
			cors: routeGroup.cors,
			domains: routeGroup.domains,
			name: routeGroup.group,
			port: routeGroup.puerto,
		};

		const groupName = `${appConfig.addGroupName ? `/${routeGroup.group}` : ''}`;

		myApp.app.use(this.#middleware.setCors(myApp, appConfig));
		myApp = this.#setPaths(routeGroup, myApp, appConfig);
		myApp = this.#setTestPath(myApp, groupName);

		// eslint-disable-next-line max-params
		app.use(this.#middleware.errorHandler(this.#service));
		return myApp;
	}
}
