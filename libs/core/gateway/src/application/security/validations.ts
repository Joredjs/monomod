import {
	EHttpMethods,
	IAppValidations,
	IJSONObject,
	IRequestParams,
	IResponseParams,
	IRuta,
	ISchema,
	ITransactionValid,
	TFrameworkRequest,
	TFrameworkResponse,
	setError,
} from '@nxms/core-main/domain';
import {
	ServiceCrypto,
	ServiceHeaders,
} from "@nxms/core-main/application";
import { clientCrypto, clientSchema } from "../../infra/dependencies";
import { DataHeaders } from "../../domain";
import { SecurityClass } from './security';
import { ServiceSchema } from '../services';

export class AppValidations<
	TFwReq extends IRequestParams,
	TFwRes extends IResponseParams
> implements IAppValidations<TFwReq, TFwRes>
{
	#security: SecurityClass<TFwReq>;

	#schemaValidator;

	constructor() {
		// TODO: no triplicar la dependencia de headerservice y por ende de cryptoservice y dataheaders

		const infoHeaders = new DataHeaders();
		const headerService = ServiceHeaders.getInstance(
			infoHeaders.headers,
			ServiceCrypto.getInstance(clientCrypto)
		);
		this.#security = new SecurityClass<TFwReq>(headerService);
		this.#schemaValidator = new ServiceSchema(clientSchema);
	}

	#getBodyParams(ruta: IRuta, req: TFrameworkRequest<TFwReq>): IJSONObject {
		let params = req.body;
		if (Object.keys(req.params).length > 0) {
			params = { ...params, ...req.params };
		}

		if (ruta.method === EHttpMethods.GET) {
			if (Object.keys(req.params).length > 0) {
				({ params } = req);
			} else {
				params = req.query;
			}

			for (const key in params) {
				if (params[key]) {
					const paramNumber = Number(params[key]);
					params[key] = isNaN(paramNumber) ? params[key] : paramNumber;
				}
			}
		}

		return params;
	}

	#validateRouteTransaction(info: ITransactionValid): boolean {
		return this.#security.validateRoute(info);
	}

	#getTransactionInfo(
		req: TFrameworkRequest<TFwReq>,
		res: TFrameworkResponse<TFwRes>
	): ITransactionValid {
		const ruta: IRuta = res.locals.route;

		const pathReplace = ruta.path.replace(/\//g, '_').replace(/:/g, '$');
		const path = `${ruta.method}_${pathReplace}`;

		let useCase = this.#security.emptyUseCase;

		if (ruta.port && path && ruta.port[path]) {
			useCase = ruta.port[path];
		}

		return {
			bodyParams: this.#getBodyParams(ruta, req),
			reqHeader: req.headers,
			ruta,
			useCase,
			usecaseParams: ruta.port.usecaseParams,
		};
	}

	#validateParams(ruta: IRuta, bodyParams: IJSONObject): boolean {
		try {
			const schema: ISchema = ruta.schema[ruta.version];

			if (!schema) {
				throw setError({
					errType: 'invalid',
					text: 'No existe schema para esta versión',
				});
			}

			const schemaKeys = Object.keys(schema).filter(
				(key) => !schema[key].optional
			);

			let vacio = false;
			for (const param of schemaKeys) {
				if (bodyParams[param as string] === '') {
					vacio = true;
					break;
				}
			}
			if (vacio) {
				throw setError({
					detail: bodyParams,
					errType: 'params',
					text: 'Parametro vacio o inexistente',
				});
			}

			return this.#schemaValidator.validate(schema, schemaKeys, bodyParams);
		} catch (error) {
			throw setError(error);
		}
	}

	#validateLocals(res: TFrameworkResponse<TFwRes>): boolean {
		if (res.locals.route) {
			const ruta: IRuta = res.locals.route;
			if (!ruta.port) {
				throw setError({
					detail: ruta,
					errType: 'gone',
					text: 'Ruta mal configurada',
				});
			}

			return true;
		}
		throw setError({
			detail: res.locals,
			errType: 'gone',
			text: 'Framework mal configurado',
		});
	}

	#validateInitialTransaction(
		req: TFrameworkRequest<TFwReq>,
		res: TFrameworkResponse<TFwRes>
	): boolean {
		try {
			// Valida Headers

			const sec = this.#security.validateHeaders(req);

			// Valida locals del framework

			const locals = this.#validateLocals(res);

			// Valida los parametros

			if (sec && locals) {
				const ruta: IRuta = res.locals.route;
				const bodyParams = this.#getBodyParams(ruta, req);
				return this.#validateParams(ruta, bodyParams);
			}

			return false;
		} catch (error) {
			throw setError(error);
		}
	}

	public manager(
		req: TFrameworkRequest<TFwReq>,
		res: TFrameworkResponse<TFwRes>
	): ITransactionValid {
		try {
			// Valida: Headers, locals y params

			const resInitialValidations = this.#validateInitialTransaction(req, res);
			if (resInitialValidations) {
				// Obtiene la info (locals) del req

				const info = this.#getTransactionInfo(req, res);


				this.#validateRouteTransaction(info);

				return info;
			}

			return null;
		} catch (error) {
			throw setError(error);
		}
	}
}
