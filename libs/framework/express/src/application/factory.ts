import {
	IDomainGroup,
	IMicroAppConfig,
	TOKENS,
	domainKeys,
} from '@monomod/core/domain';
import {
	IExpressDebug,
	IExpressFactory,
	IExpressMicroApp,
	IExpressMiddleware,
	IExpressService,
} from '../domain/interface';
import { ExpressMiddleware } from './middleware';
import { Inject } from '@monomod/core/application';
import express from 'express';

export class ExpressFactory implements IExpressFactory {
	#middleware: IExpressMiddleware;

	constructor(
		@Inject(TOKENS.server.config) private appConfig: IMicroAppConfig,
		@Inject(TOKENS.framework.IExpressDebug) private debug: IExpressDebug,
		@Inject(TOKENS.framework.IExpressService) private service: IExpressService
	) {
		this.#middleware = new ExpressMiddleware(appConfig, debug, service);
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
			throw new Error(`Error de prueba para ${microApp.name}`);
		});

		microApp.app.all('*', this.#middleware.notFound());
		return microApp;
	}

	#setPaths(
		domainGroup: IDomainGroup,
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

	createMicroApp(domainGroup: IDomainGroup) {
		const app = express();

		let myApp: IExpressMicroApp = {
			app,
			cors: domainGroup.cors,
			httpPort: domainGroup.httpPort,
			name: domainGroup.name,
		};

		const groupName = `${
			this.appConfig.addDomainName ? `/${domainGroup.name}` : ''
		}`;

		myApp.app.use(express.json({ limit: this.appConfig.bodyLimit }));
		myApp.app.use(this.#middleware.setCors(myApp));
		myApp = this.#setPaths(domainGroup, myApp, groupName);
		myApp = this.#setTestPath(myApp, groupName);
		myApp.app.use(this.#middleware.errorHandler());
		return myApp;
	}

	getService(): IExpressService {
		return this.service;
	}

	getDebug(): IExpressDebug {
		return this.debug;
	}

	getConfig(): IMicroAppConfig {
		return this.appConfig;
	}
}
