import {
	IExpressApps,
	IExpressMicroApp,
	IExpressParams,
	TExpressReq,
	TExpressRes,
} from './interface';
import {
	IMicroAppConfig,
	IRouteGroup,
	domainKeys,
} from '@nxms/core-main/domain';
import { ApiCore } from '@nxms/core-gateway';
import { ExpressService } from './service';
import express from 'express';

function setTestPath(microApp: IExpressMicroApp, groupName: string) {
	microApp.app.get(`${groupName}/test`, (req, res, next) => {
		res
			.status(domainKeys.httpCodes[200].code)
			.send(`Servicio de prueba para ${microApp.name}`);
	});
	return microApp;
}

function setPaths(
	routeGroup: IRouteGroup<IExpressParams>,
	microApp: IExpressMicroApp,
	appConfig: IMicroAppConfig
) {
	const defaultHandler = (req, res, next) => {
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
				next();
			});

			const path = `${groupName}/${version}/${routeInfo.path}`;
			microApp.app[routeInfo.method](path, handler);
		});
	});
	microApp = setTestPath(microApp, groupName);
	return microApp;
}

export const getApps = ({
	addGroupName = false,
	removePrefix = false,
}: IMicroAppConfig) => {
	const apiCore = new ApiCore<IExpressParams, TExpressReq, TExpressRes>(
		new ExpressService()
	);

	const rutas = apiCore.getRutas();

	const apps: IExpressApps = {};

	rutas.forEach((routeGroup) => {
		const appName = `${routeGroup.group}App`;
		apps[appName] = {
			app: express(),
			cors: routeGroup.cors,
			name: routeGroup.group,
			port: routeGroup.puerto,
		};
		apps[appName].app.use(express.json());

		// Const groupName = `${addGroupName ? `/${routeGroup.group}` : ''}`;

		apps[appName] = setPaths(routeGroup, apps[appName], {
			addGroupName,
			removePrefix,
		});
	});

	// Debuggear que rutas se exponen

	console.debug('Debuggear que rutas se exponen');
	const rutass = [];
	for (const app in apps) {
		if (apps[app]) {
			console.debug('APP:', apps[app].name);
			// eslint-disable-next-line no-underscore-dangle
			apps[app].app._router.stack.forEach((ruta) => {
				if (ruta.route) {
					rutass.push(ruta.route);
				}
			});
		}
	}
	console.debug(rutass);
	console.debug(rutass.length);

	return apps;
};
