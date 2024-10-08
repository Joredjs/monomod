import {
	IDomainGroup,
	IMicroAppConfig,
	IRoute,
	TVersion,
} from '@nxms/core/domain';
import {
	IExpressDebug,
	IExpressMicroApp,
	IExpressService,
	TExpressNext,
	TExpressReq,
	TExpressRes,
} from '../domain/interface';
import cors from 'cors';
import { resultErr } from '@nxms/core/application';

// TODO: recieve the service in constructor
export class ExpressMiddleware<IExpressParams> {
	#service: IExpressService;

	#debug: IExpressDebug;

	#appConfig: IMicroAppConfig;

	constructor(
		appConfig: IMicroAppConfig,
		debug: IExpressDebug,
		service: IExpressService
	) {
		this.#service = service;
		this.#appConfig = appConfig;
		this.#debug = debug;
	}

	notFound() {
		return (req: TExpressReq, res: TExpressRes, next: TExpressNext) => {
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
			this.#service.returnInfo(resInfo);
		};
	}

	// eslint-disable-next-line max-params
	setDomainInfo(
		domainGroup: IDomainGroup<IExpressParams>,
		microApp: IExpressMicroApp,
		domainInfo: IRoute,
		version: TVersion
	) {
		return (req, res, next) => {
			if (domainGroup.businessPort) {
				domainInfo = {
					...domainInfo,
					businessPort: domainGroup.businessPort,
					globalHeaders: domainGroup.headers,
					version,
				};
			}
			res.locals.route = domainInfo;
			if (this.#appConfig.debug.paths) {
				this.#debug.paths(microApp, req, domainInfo);
			}
			next();
		};
	}

	setCors(microApp: IExpressMicroApp) {
		const corsOptions = {
			origin(origin, callback) {
				if (this.#appConfig.debug.cors) {
					this.#debug.cors(microApp, origin);
				}

				if (microApp.dnsDomains.indexOf(origin) !== -1 || !origin) {
					callback(null, true);
				} else {
					callback(new Error('Not allowed by CORS'));
				}
			},
		};

		return cors(corsOptions);
	}

	errorHandler() {
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
			this.#service.returnInfo(resInfo);
		};
		/* eslint-disable max-params */
	}
}
