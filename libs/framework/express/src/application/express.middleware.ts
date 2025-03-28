import {
	DEFAULTS,
	IDomainGroup,
	IPortFrameworkDebug,
	IPortFrameworkMiddleware,
	IPortFrameworkService,
	IPortResponseResult,
	IRoute,
	SYMBOLS,
	TVersion,
} from '@monomod/core/domain';
import {
	IExpressMicroApp,
	TExpressNext,
	TExpressReq,
	TExpressRes,
} from '../domain/express.interface';
import { Inject, Injectable, ResponseResult } from '@monomod/core/application';
import cors from 'cors';

// TODO: recieve the service in constructor

@Injectable(SYMBOLS.framework.IFrameworkMiddleware)
export class ExpressMiddleware<TFwRes, TFwReq, TFwNext>
	implements IPortFrameworkMiddleware<TFwRes, TFwReq, TFwNext>
{
	#response: IPortResponseResult;

	readonly #debug: IPortFrameworkDebug;

	@Inject(SYMBOLS.framework.IFrameworkService)
	private service: IPortFrameworkService<TFwRes>;

	// eslint-disable-next-line max-params
	constructor(
		@Inject(SYMBOLS.framework.IFrameworkDebug)
		debug: IPortFrameworkDebug
	) {
		this.#response = new ResponseResult();
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
			this.service.returnInfo(resInfo);
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

			this.#debug.paths(microApp, req, domainInfo);

			next();
		};
	}

	setCors(microApp: IExpressMicroApp) {
		const corsOptions = {
			origin: (originCors, callback) => {
				console.debug('originCors', this);
				originCors = originCors ?? false;

				const isMyOrigin = originCors === DEFAULTS.cors.origin;
				const isDomainAllowed =
					microApp.cors.dnsDomains.indexOf(originCors) !== -1;
				const isLocalhostAllowed =
					microApp.cors.localhostAllowed &&
					originCors &&
					originCors.includes('http://localhost:');
				const isNoOriginAllowed = microApp.cors.noOriginAllowed;

				this.#debug.cors(microApp, originCors, {
					isDomainAllowed,
					isLocalhostAllowed,
					isMyOrigin,
				});

				if (
					isMyOrigin ||
					isDomainAllowed ||
					isLocalhostAllowed ||
					isNoOriginAllowed
				) {
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
			this.service.returnInfo(resInfo);
		};
	}
}

