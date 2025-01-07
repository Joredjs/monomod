import {
	IDomainGroup,
	IMicroAppConfig,
	IRoute,
	TVersion,
	domainKeys,
} from '@monomod/core/domain';
import {
	IExpressDebug,
	IExpressMicroApp,
	IExpressService,
	TExpressNext,
	TExpressReq,
	TExpressRes,
} from '../domain/interface';
import { ResponseResult } from '@monomod/core/application';
import cors from 'cors';

// TODO: recieve the service in constructor
export class ExpressMiddleware {
	#service: IExpressService;

	#debug: IExpressDebug;

	#appConfig: IMicroAppConfig;

	#response = new ResponseResult();

	constructor(
		appConfig: IMicroAppConfig,
		debug: IExpressDebug,
		service: IExpressService
	) {
		this.#service = service;
		this.#appConfig = appConfig;
		this.#debug = debug;
	}

	// TODO: is it correct this to use here (resultErr)

	notFound() {
		return (req: TExpressReq, res: TExpressRes) => {
			const infoError = this.#response
				.resultErr({
					detail: `No existe el recurso solicitado (${req.url})`,
					errType: 'noInfo',
					saveLog: false,
				})
				.unwrap();
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
		domainGroup: IDomainGroup,
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

			domainInfo.headers = domainInfo.headers ?? [];

			res.locals.route = domainInfo;
			if (this.#appConfig.debug.paths) {
				this.#debug.paths(microApp, req, domainInfo);
			}
			next();
		};
	}

	setCors(microApp: IExpressMicroApp) {
		const appConfig = this.#appConfig;
		const debug = this.#debug;

		const corsOptions = {
			origin(originCors, callback) {
				originCors = originCors ?? false;

				const isMyOrigin = originCors === domainKeys.core.cors.origin;
				const isDomainAllowed = microApp.cors.dnsDomains.indexOf(originCors) !== -1;
				const isLocalhostAllowed =
					microApp.cors.localhostAllowed &&
					originCors &&
					originCors.includes('http://localhost:');

				if (appConfig.debug.cors) {
					debug.cors(microApp, originCors, {
						isDomainAllowed,
						isLocalhostAllowed,
						isMyOrigin,
					});
				}

				if (isMyOrigin || isDomainAllowed || isLocalhostAllowed) {
					callback(null, true);
				} else {
					callback(new Error('Not allowed by CORS'));
				}
			},
		};

		return cors(corsOptions);
	}

	// TODO: is it correct this to use here (resultErr)
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

			const infoError = this.#response
				.resultErr({
					detail,
					errType: 'nocatch',
					saveLog: false,
					text: 'Error interno del servidor',
				})
				.unwrap();
			const resInfo = {
				resBody: infoError,
				resInstance: res,
				status: infoError.code,
			};
			this.#service.returnInfo(resInfo);
		};
		/* eslint-disable max-params */
	}
}
