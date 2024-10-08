import { IDomainGroup, IMicroAppConfig, domainKeys } from '@nxms/core/domain';
import {
	IExpressDebug,
	IExpressMicroApp,
	IExpressMiddleware,
	IExpressParams,
	IExpressService,
} from '../domain/interface';
import { ExpressMiddleware } from './middleware';
import express from 'express';

export class ExpressFactory {
	#middleware: IExpressMiddleware;

	#appConfig: IMicroAppConfig;

	constructor(
		appConfig: IMicroAppConfig,
		debug: IExpressDebug,
		service: IExpressService
	) {
		this.#middleware = new ExpressMiddleware<IExpressParams>(
			appConfig,
			debug,
			service
		);
		this.#appConfig = appConfig;
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

		microApp.app.all('*', this.#middleware.notFound());
		return microApp;
	}

	#setPaths(
		domainGroup: IDomainGroup<IExpressParams>,
		microApp: IExpressMicroApp,
		groupName: string
	): IExpressMicroApp {
		const defaultHandler = (req, res) => {
			res
				.status(domainKeys.httpCodes[400].code)
				.send('There is not handler configured for this route');
		};

		domainGroup.paths.forEach((domainInfo) => {
			const handler = domainGroup.handler || defaultHandler;
			domainGroup.versions.forEach((version) => {
				// Apply middleware and set locals for each route and version
				microApp.app[domainInfo.method](
					`${groupName}/${version}/${domainInfo.path}`,
					this.#middleware.setDomainInfo(
						domainGroup,
						microApp,
						domainInfo,
						version
					),
					handler
				);
			});
		});
		return microApp;
	}

	createMicroApp(domainGroup: IDomainGroup<IExpressParams>) {
		const app = express();

		let myApp: IExpressMicroApp = {
			app,
			cors: domainGroup.cors,
			dnsDomains: domainGroup.dnsDomains,
			httpPort: domainGroup.httpPort,
			name: domainGroup.name,
		};

		const groupName = `${
			this.#appConfig.addDomainName ? `/${domainGroup.name}` : ''
		}`;

		myApp = this.#setPaths(domainGroup, myApp, groupName);
		myApp = this.#setTestPath(myApp, groupName);
		myApp = this.#setMiddlewares(myApp);
		return myApp;
	}

	#setMiddlewares(myApp: IExpressMicroApp): IExpressMicroApp {
		myApp.app.use(express.json({ limit: this.#appConfig.bodyLimit }));
		myApp.app.use(this.#middleware.errorHandler());
		myApp.app.use(this.#middleware.setCors(myApp));
		return myApp;
	}
}
