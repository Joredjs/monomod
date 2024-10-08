import {
	IExpressMicroApp,
	TExpressNext,
	TExpressReq,
	TExpressRes,
} from './interface';
import { ExpressService } from './service';
import { IMicroServiceConfig } from '@nxms/core/domain';
import cors from 'cors';
import { resultErr } from '@nxms/core/application';

export class ExpressMiddleware {
	notFound(service: ExpressService) {
		return (req: TExpressReq, res: TExpressRes) => {
			const infoError = resultErr({
				detail: `No existe el recurso solicitado (${req.url})`,
				errType: 'noInfo',
				saveLog: false,
			}).unwrap();
			const resInfo = {
				resBody: infoError,
				resInstance: res,
				status: 404,
			};
			service.returnInfo(resInfo);
		};
	}

	setRouteInfo({ appConfig, microApp, routeGroup, routeInfo, version }) {
		return (req, res, next) => {
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
		};
	}

	setCors(microApp: IExpressMicroApp, appConfig: IMicroServiceConfig) {
		const corsOptions = {
			origin(origin, callback) {
				if (appConfig.debug.cors) {
					console.debug('******************');
					console.debug('DEBUGGING APP CORS');
					console.debug('microAPP:', microApp.name);
					console.debug('Domains:', microApp.domains);
					console.debug('Origin:', origin);
				}

				if (microApp.domains.indexOf(origin) !== -1 || !origin) {
					callback(null, true);
				} else {
					callback(new Error('Not allowed by CORS'));
				}
			},
		};

		return cors(corsOptions);
	}

	errorHandler(service: ExpressService) {
		/* eslint-disable max-params */
		return (
			err: Error,
			req: TExpressReq,
			res: TExpressRes,
			next: TExpressNext
		) => {
			let detail = 'Error interno del servidor';

			if (err instanceof Error) {
				detail = `${err.message}`;
			} else if (typeof err === 'object' && err !== null) {
				detail = JSON.stringify(err, Object.getOwnPropertyNames(err));
			} else {
				detail = String(err);
			}

			const infoError = resultErr({
				detail,
				errType: 'invalid',
				saveLog: false,
				text: 'Error interno del servidor',
			}).unwrap();
			const resInfo = {
				resBody: infoError,
				resInstance: res,
				status: 500,
			};
			service.returnInfo(resInfo);
		};
		/* eslint-disable max-params */
	}
}
