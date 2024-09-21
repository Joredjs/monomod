import {
	IExpressApps,
	IExpressMicroApp,
	IExpressParams,
	TExpressReq,
	TExpressRes,
} from './interface';
import {
	IMicroServiceConfig,
	IRouteGroup,
	domainKeys,
	resultErr,
} from '@nxms/core/domain';
import { ApiCore } from '@nxms/gateway';
import { ExpressService } from './service';
import cors from 'cors';
import express from 'express';

export class ExpressFramework {
	#appConfig: IMicroServiceConfig;

	#service: ExpressService;

	constructor(appConfig: IMicroServiceConfig) {
		this.#appConfig = appConfig;
		this.#service = new ExpressService();
	}

	#setAppCors(microApp: IExpressMicroApp, appConfig: IMicroServiceConfig) {
		const corsOptions = {
			origin(origin, callback) {
				if (appConfig.debug.cors) {
					console.debug('******************');
					console.debug('DEBUGGING APP CORS');
					console.debug('microAPP:', microApp.name);
					console.debug('DOMINIOS:', microApp.domains);
					console.debug('Origin:', origin);
				}

				if (microApp.domains.indexOf(origin) !== -1 || !origin) {
					callback(null, true);
				} else {
					// TODO: Standar framework error
					callback(new Error('Not allowed by CORS'));
				}
			},
		};

		return cors(corsOptions);
	}

	#setTestPath(microApp: IExpressMicroApp, groupName: string) {
		microApp.app.get(`${groupName}/test`, (req, res) => {
			res
				.status(domainKeys.httpCodes[200].code)
				.send(`Servicio de prueba para ${microApp.name}`);
		});

		microApp.app.all('*', (req, res) => {
			const infoError = resultErr({
				detail: 'No existe el recurso solicitado',
				errType: 'gone',
				saveLog: false,
			}).unwrap();
			const resInfo = {
				resBody: infoError,
				resInstance: res,
				status: 404,
			};
			this.#service.returnInfo(resInfo);
		});
		return microApp;
	}

	/* #setAppPath(
	   	routeGroup: IRouteGroup<IExpressParams>,
	   	microApp: IExpressMicroApp,
	   	appConfig: IMicroServiceConfig,
	   	routeInfo: IRuta,
	   	version: IRuta['version']
	   ) {
	   	return (req, res, next) => {
	   		if (appConfig.removePrefix) {
	   			const sUrl = req.url.split('/');
	   			if (sUrl[1] === microApp.name) {
	   				req.url = req.url.replace(`/${microApp.name}`, '');
	   			}
	   		} */

	/* 		If (routeGroup.port) {
	   			routeInfo = {
	   				...routeInfo,
	   				globalHeaders: routeGroup.headers,
	   				port: routeGroup.port,
	   				version,
	   			};
	   		}
	   		res.locals.route = routeInfo;
	   		if (appConfig.debug.paths) {
	   			console.debug('******************');
	   			console.debug('DEBUGGING APP URL');
	   			console.debug('microAPP:', microApp.name);
	   			console.debug('URL:', req.url);
	   			console.debug('INFO:', routeInfo);
	   		}
	   		next();
	   	};
	   } */

	#setPaths(
		routeGroup: IRouteGroup<IExpressParams>,
		microApp: IExpressMicroApp,
		appConfig: IMicroServiceConfig
	) {
		const defaultHandler = (req, res) => {
			res
				.status(domainKeys.httpCodes[400].code)
				.send('No existe configuración para esta ruta');
		};

		const groupName = `${appConfig.addGroupName ? `/${routeGroup.group}` : ''}`;

		routeGroup.paths.forEach((routeInfo) => {
			const handler = routeGroup.handler || defaultHandler;
			routeGroup.versions.forEach((version) => {
				microApp.app.use((req, res, next) => {
					if (appConfig.removePrefix) {
						const sUrl = req.url.split('/');
						if (sUrl[1] === microApp.name) {
							req.url = req.url.replace(`/${microApp.name}`, '');
						}
					}

					if (routeGroup.port) {
						routeInfo = {
							...routeInfo,
							globalHeaders: routeGroup.headers,
							port: routeGroup.port,
							version,
						};
					}
					res.locals.route = routeInfo;
					if (appConfig.debug.paths) {
						console.debug('******************');
						console.debug('DEBUGGING APP URL');
						console.debug('microAPP:', microApp.name);
						console.debug('URL:', req.url);
						console.debug('INFO:', routeInfo);
					}
					next();
				});
				microApp.app.use(this.#setAppCors(microApp, appConfig));

				const path = `${groupName}/${version}/${routeInfo.path}`;
				microApp.app[routeInfo.method](path, handler);
			});
		});
		microApp = this.#setTestPath(microApp, groupName);
		return microApp;
	}

	#debugPaths(apps: IExpressApps) {
		console.debug('Rutas que se exponen');
		const rutass = [];
		for (const app in apps) {
			if (apps[app]) {
				console.debug('APP:', apps[app].name);
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
		console.debug(rutass);
		console.debug(rutass.length);
	}

	getServices(): IExpressApps {
		const apiCore = new ApiCore<IExpressParams, TExpressReq, TExpressRes>(
			this.#service
		);

		const rutas: IRouteGroup<IExpressParams>[] = apiCore.getRutas();
		const apps: IExpressApps = {};

		rutas.forEach((routeGroup) => {
			const appName = `${routeGroup.group}App`;
			apps[appName] = {
				app: express(),
				cors: routeGroup.cors,
				domains: routeGroup.domains,
				name: routeGroup.group,
				port: routeGroup.puerto,
			};
			apps[appName].app.use(express.json({ limit: '5mb' }));
			// eslint-disable-next-line max-params
			apps[appName].app.use((err, req, res, next) => {
				console.error('ERROR:---------');
				console.error(err);
			});
			apps[appName] = this.#setPaths(
				routeGroup,
				apps[appName],
				this.#appConfig
			);
		});

		if (this.#appConfig.debug.routes) {
			this.#debugPaths(apps);
		}

		return apps;
	}
}

/* Function AppErrorHandler() {
   	console.log('ERROR');
   	return (err, req, res, next) => {
   		console.log(err);
   		throw setError({
   			errType: 'invalid',
   			text: 'Error interno del servidor',
   			detail: err,
   		});
   	};
   } */
