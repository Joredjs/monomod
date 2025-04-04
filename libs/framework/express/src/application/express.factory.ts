import {
	HTTPCODES,
	IDomainGroup,
	IFrameworkMicroApp,
	IPortFrameworkFactory,
	IPortFrameworkMiddleware,
	IServerConfig,
	SYMBOLS,
} from '@monomod/core/domain';
import { Inject, Injectable } from '@monomod/core/application';
import express from 'express';

@Injectable(SYMBOLS.framework.IFrameworkFactory)
export class ExpressFactory<TFwRes, TFwReq, TFwNext>
	implements IPortFrameworkFactory
{
	readonly #middleware: IPortFrameworkMiddleware<TFwRes, TFwReq, TFwNext>;

	readonly #serverConfig: IServerConfig;

	constructor(
		@Inject(SYMBOLS.framework.IFrameworkMiddleware)
		middleware: IPortFrameworkMiddleware<TFwRes, TFwReq, TFwNext>,
		@Inject(SYMBOLS.server.IServerConfig) serverConfig: IServerConfig
	) {
		this.#middleware = middleware;
		this.#serverConfig = serverConfig;
	}

	#setTestPath(
		microApp: IFrameworkMicroApp,
		groupName: string
	): IFrameworkMicroApp {
		microApp.app.get(`${groupName}/test`, (req, res) => {
			res
				.status(HTTPCODES[200].code)
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
		microApp: IFrameworkMicroApp,
		groupName: string
	): IFrameworkMicroApp {
		const defaultHandler = (req, res) => {
			res
				.status(HTTPCODES[400].code)
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

		let myApp: IFrameworkMicroApp = {
			app,
			cors: domainGroup.cors,
			httpPort: domainGroup.httpPort,
			name: domainGroup.name,
		};

		const groupName = `${
			this.#serverConfig.addDomainName ? `/${domainGroup.name}` : ''
		}`;

		myApp.app.use(express.json({ limit: this.#serverConfig.bodyLimit }));
		myApp.app.use(this.#middleware.setCors(myApp));
		myApp = this.#setPaths(domainGroup, myApp, groupName);
		myApp = this.#setTestPath(myApp, groupName);
		myApp.app.use(this.#middleware.errorHandler());
		return myApp;
	}
}
